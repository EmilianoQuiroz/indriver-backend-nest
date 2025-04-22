import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

    //Metodo para crear un nuevo usuario
    create(user:CreateUserDto) {
        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser);
    }

    // Metodo para obtener todos los usuarios
    findAll() {
        return this.usersRepository.find();
    }
}
