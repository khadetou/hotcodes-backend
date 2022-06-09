import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/auth/auth.decorator';
import { GetUser } from 'src/auth/get-user-decorator';
import { Role } from 'src/auth/roles/role.enum';
import { User } from 'src/auth/schema/user.schema';
import { CreateMobiledevDto } from './dto/create-mobiledev.dto';
import { OrdermobileService } from './ordermobile.service';
import { OrderMobile } from './schema/ordermobile.schema';

@Controller('ordermobile')
@UseGuards(AuthGuard(['jwt', 'google']))
export class OrdermobileController {
  constructor(private readonly ordermobileService: OrdermobileService) {}

  //GET MY ORDERMOBILE
  @Get('/myorder')
  async getMyOrderMobile(@GetUser() user: User): Promise<OrderMobile | any> {
    return await this.ordermobileService.findMyOrder(user);
  }

  //GET ORDERMOBILE BY ID
  @Get(':id')
  async getOrderMobileById(@Param('id') id: string): Promise<OrderMobile> {
    return await this.ordermobileService.findOne(id);
  }

  //GET ALL ORDERMOBILE
  @Get()
  @Auth(Role.Admin)
  async findAll(): Promise<OrderMobile[]> {
    return await this.ordermobileService.findAll();
  }

  //DELETE ORDERMOBILE
  @Delete('/:id')
  @Auth(Role.Admin)
  async delete(@Param('id') id: string): Promise<OrderMobile> {
    return await this.ordermobileService.delete(id);
  }

  //CREATE ORDERMOBILE
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createMobiledevDto: CreateMobiledevDto,
    @GetUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void | OrderMobile> {
    return await this.ordermobileService.create(createMobiledevDto, user, file);
  }
}
