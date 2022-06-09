import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OrderMarketing } from './schema/ordermarketing.schema';
import { Model } from 'mongoose';
import { CreateMarketingDto } from './dto/create-marketing.dto';

@Injectable()
export class OrdermarketingService {
  constructor(
    @InjectModel(OrderMarketing.name)
    private readonly ordermarketingModel: Model<OrderMarketing>,
  ) {}

  //GET ALL ORDERMARKETING
  async getAllOrderMarketing(): Promise<OrderMarketing[]> {
    return await this.ordermarketingModel.find().exec();
  }

  //GET ORDERMARKETING BY ID
  async getOrderMarketingById(id: string): Promise<OrderMarketing> {
    const user = await this.ordermarketingModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('OrderMarketing not found with that id');
    }
    return user;
  }

  //GET MY ORDERMARKETING
  async getMyOrderMarketing(user: any): Promise<OrderMarketing[]> {
    return await this.ordermarketingModel.find({ user: user._id }).exec();
  }

  //DELETE ORDERMARKETING
  async delete(id: string): Promise<OrderMarketing> {
    const result = await this.ordermarketingModel.findByIdAndRemove(id).exec();

    if (!result) {
      throw new NotFoundException('OrderMarketing not found');
    }
    return result;
  }

  //DELETE MY ORDERMARKETING
  async deleteMyOrderMarketing(id: string, user: any): Promise<OrderMarketing> {
    const ordermarketing = await this.ordermarketingModel.findById(id).exec();
    if (ordermarketing.user.toString() !== user._id.toString()) {
      throw new NotFoundException('You are not authorized');
    }
    return await this.ordermarketingModel.findByIdAndDelete(id).exec();
  }

  //CREATE ORDERMARKETING
  async create(
    createmarketingDto: CreateMarketingDto,
    user: any,
  ): Promise<OrderMarketing> {
    const {
      ageMoyen,
      besoinClients,
      genresClient,
      moyenVentes,
      nombreClient,
      nombreProduits,
      problemeVente,
      status,
    } = createmarketingDto;

    let moyenVentesSplit: string[];

    if (moyenVentes) {
      moyenVentesSplit = moyenVentes.split(',').map((item) => item.trim());
    }

    const ordermarketing = new this.ordermarketingModel({
      ageMoyen,
      besoinClients,
      genresClient,
      moyenVentes: moyenVentesSplit,
      nombreClient,
      nombreProduits,
      problemeVente,
      status,
      user: user._id,
    });

    try {
      return await ordermarketing.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
