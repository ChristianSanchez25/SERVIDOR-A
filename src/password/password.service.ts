import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as fs from 'fs';
import * as lockfile from 'proper-lockfile';

@Injectable()
export class PasswordService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  /*
    El metodo create() crea un usuario en la base de datos
    genera un password aleatorio
  */
  async create(createUserDto: CreateUserDto) {
    try {
      const password = this.generatePassword();
      /*
        busca el usuario en la base de datos
        si lo consigue devuelve un mensaje, sino retorna la contraseña
      */
      const userBD = await this.userRepository.findOne({
        where: {
          nombre: createUserDto.nombre.toLowerCase(),
        }
      })
      if (userBD) {
        return {
          message: 'Ya existe un Usuario con esa identificacion'
        };
      }
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

  /*
     MANEJO DE CONCURRENCIA:
     Prioridad de escritura
      Si un usuario quiere crear un usuario y otro usuario quiere buscar un usuario
      el que quiere crear un usuario tiene prioridad
      se bloquea el archivo para que no se pueda buscar un usuario
      hasta que el usuario que quiere crear un usuario termine.
  */

  async createWithLock(createUserDto: CreateUserDto) {
    // abre el archivo publico: BD.txt en modo lectura y escritura
    const file = await fs.openSync('../../public/BD.txt', 'r+');
    // bloquea el archivo para que no se pueda leer
    lockfile.lock(file).then(async () => {
      // se ejecuta crear usuario
      await this.create(createUserDto);
      // desbloquea el archivo
      return lockfile.unlock(file);
    });
  }



}
