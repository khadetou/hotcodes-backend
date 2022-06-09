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
import { GetUser } from 'src/auth/get-user-decorator';
import { OrderdesignService } from './orderdesign.service';
import { OrderDesign } from './schema/orderdesing.schema';
import { CreateOrderDesignDto } from './dto/create-design.dto';
import { Auth } from 'src/auth/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { User } from 'src/auth/schema/user.schema';

@Controller('orderdesign')
@UseGuards(AuthGuard(['jwt', 'google']))
export class OrderdesignController {
  constructor(private readonly orderdesignService: OrderdesignService) {}

  //GET MY ORDER DESIGNS
  @Get('/myorder')
  async getMyOrderDesigns(@GetUser() user: User): Promise<OrderDesign | any> {
    return await this.orderdesignService.getMyOrderDesigns(user);
  }

  //GET ORDER DESIGN BY ID
  @Get(':id')
  async getById(@Param('id') id: string): Promise<OrderDesign> {
    return await this.orderdesignService.getById(id);
  }

  //GET ALL ORDER DESIGN
  @Get()
  @Auth(Role.Admin)
  async getAll(): Promise<OrderDesign[]> {
    return await this.orderdesignService.getAll();
  }

  //DELETE ORDER DESIGN
  @Delete('/:id')
  @Auth(Role.Admin)
  async delete(@Param('id') id: string): Promise<OrderDesign> {
    console.log(id);
    return await this.orderdesignService.delete(id);
  }

  //DELETE MY ORDER DESIGN
  @Delete('/my/:id')
  @Auth(Role.User)
  async deleteMyOrderDesign(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<OrderDesign> {
    return await this.orderdesignService.deleteMyOrderDesign(id, user);
  }

  //CREATE ORDERDESIGN
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createOrderdesignDto: CreateOrderDesignDto,
    @GetUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void | OrderDesign> {
    return await this.orderdesignService.create(
      createOrderdesignDto,
      user,
      file,
    );
  }
}
