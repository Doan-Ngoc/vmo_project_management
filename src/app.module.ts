import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from './modules/jwt/jwt.module';
import { PermissionModule } from './modules/permissions/permission.module';
import { ClientModule } from './modules/clients/client.module';
import { ProjectModule } from './modules/projects/project.module';
import { TaskModule } from './modules/tasks/task.module';
import typeorm from './databases/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskCommentModule } from './modules/task_comments/task-comment.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { EmailModule } from './modules/emails/email.module';
import { QueueModule } from './modules/queue/queue.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
      envFilePath: path.join(
        __dirname,
        'configs',
        `.env-${process.env.NODE_ENV || 'dev'}`,
      ),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm') as TypeOrmModuleOptions,
    }),
    UserModule,
    AuthModule,
    JwtModule,
    PermissionModule,
    ClientModule,
    ProjectModule,
    TaskModule,
    TaskCommentModule,
    ScheduleModule.forRoot(),
    FirebaseModule,
    EmailModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
