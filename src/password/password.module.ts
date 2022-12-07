import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordService } from './password.service';
import { PasswordController } from './password.controller';
import { User } from './entities/user.entity';

@Module({
  controllers: [PasswordController],
  providers: [PasswordService],
  imports : [
    TypeOrmModule.forFeature([User]),
  ],
  
})
export class PasswordModule {}
