import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Auth } from 'src/auth/auth.decorator';
import { GetUser } from 'src/auth/get-user-decorator';
import { Role } from 'src/auth/roles/role.enum';
import { User } from 'src/auth/schema/user.schema';
import { CreateMarketingDto } from './dto/create-marketing.dto';
import { OrdermarketingService } from './ordermarketing.service';

@Controller('ordermarketing')
@UseGuards(AuthGuard(['jwt', 'google']))
export class OrdermarketingController {
  constructor(private readonly ordermarketingService: OrdermarketingService) {}

  //GET ALL ORDER MARKETING
  @Get()
  async getAll(): Promise<any> {
    return await this.ordermarketingService.getAllOrderMarketing();
  }

  //GET ORDER MARKETING BY ID
  @Get(':id')
  @Auth(Role.Admin)
  async getById(id: string): Promise<any> {
    return await this.ordermarketingService.getOrderMarketingById(id);
  }

  //GET MY ORDER MARKETING
  @Get('/my')
  @Auth(Role.User)
  async getMyOrderMarketing(user: User): Promise<any> {
    return await this.ordermarketingService.getMyOrderMarketing(user);
  }

  //DELETE MY ORDER MARKETING
  @Delete('/my/:id')
  @Auth(Role.User)
  async deleteMyOrderMarketing(id: string, user: User): Promise<any> {
    return await this.ordermarketingService.deleteMyOrderMarketing(id, user);
  }

  //DELETE ORDER MARKETING
  @Delete('/:id')
  @Auth(Role.Admin)
  async delete(id: string): Promise<any> {
    return await this.ordermarketingService.delete(id);
  }

  //CREATE ORDER MARKETING
  @Post()
  async create(
    @Body() createordermarketingDto: CreateMarketingDto,
    @GetUser() user,
  ): Promise<any> {
    return await this.ordermarketingService.create(
      createordermarketingDto,
      user,
    );
  }
}
