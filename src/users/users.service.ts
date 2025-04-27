import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import storage = require('../utils/cloud_storage');
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  //Metodo para crear un nuevo usuario
  create(user: CreateUserDto) {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  // Metodo para obtener todos los usuarios
  findAll() {
    return this.usersRepository.find();
  }

  //Metodo para modificar un usuario
  async update(id: number, user: updateUserDto) {
    const userFound = await this.usersRepository.findOneBy({ id: id });

    if (!userFound) {
      return new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
    }

    const updatedUser = Object.assign(userFound, user); //Actualizamos el usuario
    return this.usersRepository.save(updatedUser); //Guardamos el usuario actualizado
  }

  //Metodo para la carga de imagenes
  async updateWithImage(
    file: Express.Multer.File,
    id: number,
    user: updateUserDto,
  ) {
    const url = await storage(file, file.originalname); //Subimos la imagen a Firebase Storage
    console.log(url); //Mostramos la url de la imagen en consola

    if (url === undefined && url === null) {
      return new HttpException(
        'La imagen no se pudo guardar',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const userFound = await this.usersRepository.findOneBy({ id: id });

    if (!userFound) {
      return new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
    }
    user.image = url; //Asignamos la url de la imagen al usuario
    const updatedUser = Object.assign(userFound, user); //Actualizamos el usuario
    return this.usersRepository.save(updatedUser); //Guardamos el usuario actualizado
  }
}
