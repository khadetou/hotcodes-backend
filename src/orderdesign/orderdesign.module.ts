import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { OrderdesignController } from './orderdesign.controller';
import { OrderdesignService } from './orderdesign.service';
import { OrderDesign, OrderDesignSchema } from './schema/orderdesing.schema';

@Module({
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([
      { name: OrderDesign.name, schema: OrderDesignSchema },
    ]),
    AuthModule,
  ],
  controllers: [OrderdesignController],
  providers: [OrderdesignService],
})
export class OrderdesignModule {}
