import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserInputDTO } from './types';
import { UsersService } from './users.service';
import { UsersQueryRepository } from './repositories/users-query.repository';
import { BasicAuthGuard } from '../basic-auth.guard';

@UseGuards(BasicAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    protected usersService: UsersService,
    protected usersQueryRepository: UsersQueryRepository,
  ) {}

  @Post()
  async createUser(@Body() inputDTO: UserInputDTO) {
    const userId: string = await this.usersService.create(inputDTO);
    const user = await this.usersQueryRepository.getUser(userId);
    if (!user) throw new BadRequestException();
    return user;
  }

  @Get()
  async getUsers(
    @Query()
    query: {
      sortBy: string;
      sortDirection: string;
      pageNumber: string;
      pageSize: string;
      searchLoginTerm: string;
      searchEmailTerm: string;
    },
  ) {
    const pageNumber = query.pageNumber ? +query.pageNumber : 1;
    const pageSize = query.pageSize ? +query.pageSize : 10;
    const sortBy = query.sortBy ? query.sortBy.toString() : 'createdAt';
    const sortDirection = query.sortDirection
      ? query.sortDirection.toString()
      : 'desc';
    const searchLoginTerm = query.searchLoginTerm
      ? query.searchLoginTerm.toString()
      : null;
    const searchEmailTerm = query.searchEmailTerm
      ? query.searchEmailTerm.toString()
      : null;
    return this.usersQueryRepository.getUsers(
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
    );
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') userId: string) {
    const user = await this.usersQueryRepository.getUser(userId);
    if (!user) throw new NotFoundException();

    await this.usersService.delete(userId);
  }
}
