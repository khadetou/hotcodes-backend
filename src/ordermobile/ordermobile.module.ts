import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { OrdermobileController } from './ordermobile.controller';
import { OrdermobileService } from './ordermobile.service';
import { OrderMobile, OrderMobileSchema } from './schema/ordermobile.schema';

@Module({
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([
      {
        name: OrderMobile.name,
        schema: OrderMobileSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [OrdermobileController],
  providers: [OrdermobileService],
})
export class OrdermobileModule {}
