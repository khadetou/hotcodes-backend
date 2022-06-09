import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OrderDesign } from './schema/orderdesing.schema';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateOrderDesignDto } from './dto/create-design.dto';
import { User } from 'src/auth/schema/user.schema';
import { v2 } from 'cloudinary';

@Injectable()
export class OrderdesignService {
  constructor(
    @InjectModel(OrderDesign.name)
    private readonly orderwebModel: Model<OrderDesign>,
    private cloudinaryService: CloudinaryService,
  ) {}

  //GET ALL ORDER DESIGN
  async getAll(): Promise<OrderDesign[]> {
    return await this.orderwebModel.find().exec();
  }

  //GET ORDER DESIGN BY ID
  async getById(id: string): Promise<OrderDesign> {
    return await this.orderwebModel.findById(id).populate('user').exec();
  }

  //DELETE ORDER DESIGN
  async delete(id: string): Promise<OrderDesign> {
    return await this.orderwebModel.findByIdAndDelete(id).exec();
  }

  //GET MY ORDER DESIGNS
  async getMyOrderDesigns(user: any): Promise<OrderDesign[]> {
    return await this.orderwebModel.find({ user: user._id }).exec();
  }

  //DELET MY ORDER DESIGN
  async deleteMyOrderDesign(id: string, user: any): Promise<OrderDesign> {
    const orderdesign = await this.orderwebModel.findById(id).exec();
    if (orderdesign.user.toString() !== user._id.toString()) {
      throw new UnauthorizedException('You are not authorized');
    }
    return await this.orderwebModel.findByIdAndDelete(id).exec();
  }

  //CREATE ORDERDESIGN
  async create(
    createOrderDesignDto: CreateOrderDesignDto,
    user: any,
    file: Express.Multer.File,
  ): Promise<OrderDesign> {
    const {
      plateform,
      description,
      typeapp,
      Goal,
      appName,
      functionnality,
      moodBoard,
      target,
      wireframe,
      design,
    } = createOrderDesignDto;

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

    if (design) {
      for (let i = 0; i < design.length; i++) {
        const upload = await v2.uploader.upload(design[i], {
          folder: `hotcodes/orders/${user.lastName}/${user._id}`,
        });

        designLinks[i].public_id = upload.public_id;
        designLinks[i].url = upload.secure_url;
        designLinks[i].format = upload.format;
      }
    }

    if (Goal) {
      goalSplits = Goal.split(',').map((s) => s.trim());
    }

    if (functionnality) {
      funcSplits = functionnality.split(',').map((s) => s.trim());
    }

    let orderDesignFields = {
      user: user._id,
      plateform: plateform !== '' && plateform,
      typeapp: typeapp !== '' && typeapp,
      appName: appName !== '' && appName,
      description: description !== '' && description,
      Goal: goalSplits && goalSplits,
      functionnality: funcSplits && funcSplits,
      design: designLinks,
      moodBoard: moodBoard !== '' && moodBoard,
      target: target !== '' && target,
      wireframe: wireframe !== '' && wireframe,
      date: new Date(),
    };

    let orderDesign = await this.orderwebModel.findOne({ user: user._id });
    if (orderDesign) {
      orderDesign = await this.orderwebModel.findOneAndUpdate(
        { user: user._id },
        { $set: orderDesignFields },
        { new: true },
      );
    } else {
      orderDesign = await this.orderwebModel.create(orderDesignFields);
    }

    try {
      return await orderDesign.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
