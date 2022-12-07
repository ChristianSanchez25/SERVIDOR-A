import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PasswordService } from './password.service';
import { CreateUserDto } from './dto/create-user.dto';


@Controller('users')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.passwordService.create(createUserDto);
  }

}
