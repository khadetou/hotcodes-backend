import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { configValidationSchema } from './config.schema';
import { MailModule } from './mail/mail.module';
import { OrderwebModule } from './orderweb/orderweb.module';
import { OrdermobileModule } from './ordermobile/ordermobile.module';
import { OrderdesignModule } from './orderdesign/orderdesign.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles/roles.guard';
import { OrdermarketingModule } from './ordermarketing/ordermarketing.module';

@Module({
  imports: [
    CloudinaryModule,
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`, '.env'],
      validationSchema: configValidationSchema,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
      }),
    }),
    AuthModule,
    MailModule,
    OrderwebModule,
    OrdermobileModule,
    OrderdesignModule,
    OrdermarketingModule,
  ],
})
export class AppModule {}
