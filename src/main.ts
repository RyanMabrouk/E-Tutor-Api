import 'dotenv/config';
import 'module-alias/register';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import validationOptions from './utils/validation-options';
import { AllConfigType } from './config/config.type';
import { ResolvePromisesInterceptor } from './utils/serializer.interceptor';
import {
  restResponseTimeHistogram,
  startMetricsServer,
} from './shared/metrics/metrics.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { fastifyCookie } from '@fastify/cookie';
import helmet from '@fastify/helmet';
import fastifyMultipart from '@fastify/multipart';
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
    {
      cors: {
        origin: true,
        credentials: true,
      },
    },
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // files
  await app.register(fastifyMultipart);
  // security
  await app.register(helmet);
  // cookies
  await app.register(fastifyCookie, {
    secret: process.env.COOKIES_SECRET, // for cookies signature
  });

  app.enableShutdownHooks();

  const configService = app.get(ConfigService<AllConfigType>);

  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(new ValidationPipe(validationOptions));

  app.useGlobalInterceptors(
    // ResolvePromisesInterceptor is used to resolve promises in responses because class-transformer can't do it
    // https://github.com/typestack/class-transformer/issues/549
    new ResolvePromisesInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  //Add hooks to measure response time
  app
    .getHttpAdapter()
    .getInstance()
    .addHook('onRequest', (request, reply, done) => {
      request['startTime'] = process.hrtime();
      done();
    });

  app
    .getHttpAdapter()
    .getInstance()
    .addHook('onSend', (request, reply, payload, done) => {
      const diff = process.hrtime(request['startTime']);
      const time = diff[0] * 1e3 + diff[1] * 1e-6; // Convert to milliseconds

      if (request.raw.url) {
        restResponseTimeHistogram.observe(
          {
            method: request.method,
            route: request.raw.url,
            status_code: reply.statusCode,
          },
          time,
        );
      }

      done();
    });

  await app.listen(
    configService.getOrThrow('app.port', { infer: true }),
    '0.0.0.0',
  );
  startMetricsServer();
}
void bootstrap();
