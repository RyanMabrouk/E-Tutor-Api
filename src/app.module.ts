import { Module } from '@nestjs/common';
import { UsersModule } from './routes/users/users.module';
import { FilesModule } from './routes/files/files.module';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './database/config/database.config';
import authConfig from './auth/config/auth.config';
import appConfig from './config/app.config';
import mailConfig from './shared/services/mail/config/mail.config';
import fileConfig from './routes/files/config/file.config';
import path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule } from 'nestjs-i18n/dist/i18n.module';
import { HeaderResolver } from 'nestjs-i18n';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { MailModule } from './shared/services/mail/mail.module';
import { HomeModule } from './routes/home/home.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AllConfigType } from './config/config.type';
import { SessionModule } from './routes/session/session.module';
import { MailerModule } from './shared/services/mailer/mailer.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './database/mongoose-config.service';
import { DatabaseConfig } from './database/config/database-config.type';
import { ProjectsModule } from './routes/projects/projects.module';
import { TasksModule } from './routes/tasks/tasks.module';
import { ChatModule } from './routes/chat/chat.module';
import { MessageModule } from './routes/messages/message.module';
import { NotificationModule } from './routes/notifications/notifications.module';
import { MessagesSocketModule } from './routes/messages/socket/messages-socket.module';
import { NotificationsSocketModule } from './routes/notifications/socket/notifications-socket.module';
//import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
//import { APP_INTERCEPTOR } from '@nestjs/core';
@Module({
  imports: [
    // CacheModule.register(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig, mailConfig, fileConfig],
      envFilePath: ['.env'],
    }),
    (databaseConfig() as DatabaseConfig).isDocumentDatabase
      ? MongooseModule.forRootAsync({
          useClass: MongooseConfigService,
        })
      : TypeOrmModule.forRootAsync({
          useClass: TypeOrmConfigService,
          dataSourceFactory: async (options: DataSourceOptions) => {
            return new DataSource(options).initialize();
          },
        }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: {
          path: path.join(__dirname, '/shared/i18n/'),
          watch: true,
        },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get('app.headerLanguage', {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    UsersModule,
    FilesModule,
    AuthModule,
    SessionModule,
    MailModule,
    MailerModule,
    HomeModule,
    ProjectsModule,
    TasksModule,
    ChatModule,
    MessageModule,
    NotificationModule,
    MessagesSocketModule,
    NotificationsSocketModule,
  ],
  /* providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],*/
})
export class AppModule {}
