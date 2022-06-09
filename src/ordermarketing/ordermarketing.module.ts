import { Module } from '@nestjs/common';
import { OrdermarketingService } from './ordermarketing.service';
import { OrdermarketingController } from './ordermarketing.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OrderMarketing,
  OrderMarketingSchema,
} from './schema/ordermarketing.schema';

@Module({
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([
      { name: OrderMarketing.name, schema: OrderMarketingSchema },
    ]),
  ],
  providers: [OrdermarketingService],
  controllers: [OrdermarketingController],
})
export class OrdermarketingModule {}
