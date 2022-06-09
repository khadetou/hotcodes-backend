import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OrderMobile } from './schema/ordermobile.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMobiledevDto } from './dto/create-mobiledev.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class OrdermobileService {
  constructor(
    @InjectModel(OrderMobile.name)
    private readonly ordermobileModel: Model<OrderMobile>,
    private cloudinaryService: CloudinaryService,
  ) {}

  //GET ALL ORDERMOBILE
  async findAll(): Promise<OrderMobile[]> {
    return await this.ordermobileModel.find().exec();
  }

  //GET ORDERMOBILE BY ID
  async findOne(id: string): Promise<OrderMobile> {
    return await this.ordermobileModel.findById(id).populate('user').exec();
  }

  //DELETE ORDERMOBILE
  async delete(id: string): Promise<OrderMobile> {
    const user = await this.ordermobileModel.findById(id).exec();
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }
    return await user.remove();
  }

  //GET ORDERMOBILE BY USER
  async findMyOrder(user: any): Promise<OrderMobile[]> {
    return await this.ordermobileModel.find({ user: user._id }).exec();
  }

  //CREATE ORDERMOBILE
  async create(
    createMobiledevDto: CreateMobiledevDto,
    user: any,
    file: Express.Multer.File,
  ): Promise<OrderMobile> {
    const {
      Goal,
      appName,
      description,
      design,
      functionnality,
      plateform,
      typeapp,
    } = createMobiledevDto;
    let goalSplits: string[];
    let funcSplits: string[];
    let designLinks: [
      {
        public_id: string;
        url: string;
        format: string;
      },
    ] = [
      {
        public_id: '',
        url: '',
        format: '',
      },
    ];
    const result =
      file && (await this.cloudinaryService.uploadImages(file, user));

    if (result) {
      for (let i = 0; i < designLinks.length; i++) {
        designLinks[i].public_id = result.public_id;
        designLinks[i].url = result.secure_url;
        designLinks[i].format = result.format;
      }
    }

    if (Goal) {
      goalSplits = Goal.split(',').map((s) => s.trim());
    }
    if (functionnality) {
      funcSplits = functionnality.split(',').map((s) => s.trim());
    }
    let ordermobileFields = {
      user: user._id,
      plateform: plateform && plateform,
      typeapp: typeapp && typeapp,
      appName: appName && appName,
      description: description && description,
      design: designLinks,
      functionnality: funcSplits && funcSplits,
      Goal: goalSplits && goalSplits,
      date: new Date(),
    };

    let orderMobile = await this.ordermobileModel.findOne({ user: user._id });

    if (orderMobile) {
      orderMobile = await this.ordermobileModel.findByIdAndUpdate(
        { user: user._id },
        { $set: ordermobileFields },
        { new: true },
      );
    } else {
      orderMobile = await this.ordermobileModel.create(ordermobileFields);
    }

    try {
      return await orderMobile.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
