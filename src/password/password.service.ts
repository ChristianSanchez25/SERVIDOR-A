import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';


@Injectable()
export class PasswordService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository : Repository<User>,
  ) {}
  
  
  async create(createUserDto: CreateUserDto) {
    try {
      const password = this.generatePassword();
      const user = await this.userRepository.create({
        nombre: createUserDto.nombre.toLowerCase(),
        password: password,
      });
      await this.userRepository.save(user);
      return {
        password: password,
      };
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('User already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  //generate random password
  generatePassword(): number {
    //length of password is 8
    const password = Math.floor(Math.random() * 100000000);
    return password;
  }

  
}
