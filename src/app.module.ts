import { forwardRef, Module } from '@nestjs/common';
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
import { ChatModule } from './routes/chat/chat.module';
import { MessageModule } from './routes/messages/message.module';
import { NotificationModule } from './routes/notifications/notifications.module';
import { MessagesSocketModule } from './routes/messages/socket/messages-socket.module';
import { NotificationsSocketModule } from './routes/notifications/socket/notifications-socket.module';
import { LanguageModule } from './routes/languages/language.module';
import { SubcategoryModule } from './routes/subcategories/subcategories.module';
import { CategoryModule } from './routes/categories/categories.module';
import { CourseModule } from './routes/courses/course.module';
import { SectionModule } from './routes/sections/section.module';
import { LectureModule } from './routes/lectures/lecture.module';
import { CommentModule } from './routes/comments/comments.module';
import { ReviewModule } from './routes/reviews/review.module';
import { CommentsSocketModule } from './routes/comments/socket/comments-socket.module';
import { PurshaseModule } from './routes/purshases/categories.module';
import { ProgressModule } from './routes/progress/progress.module';
import { AuthGoogleModule } from './auth-google/auth-google.module';
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
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    forwardRef(() =>
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
    ),
    forwardRef(() => UsersModule),
    forwardRef(() => FilesModule),
    AuthModule,
    SessionModule,
    MailModule,
    MailerModule,
    HomeModule,
    forwardRef(() => ChatModule),
    MessageModule,
    NotificationModule,
    MessagesSocketModule,
    NotificationsSocketModule,
    LanguageModule,
    SubcategoryModule,
    CategoryModule,
    CourseModule,
    SectionModule,
    LectureModule,
    PurshaseModule,
    CommentsSocketModule,
    CommentModule,
    ReviewModule,
    ProgressModule,
    AuthGoogleModule,
  ],
  /* providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],*/
})
export class AppModule {}
