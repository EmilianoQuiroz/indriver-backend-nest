import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        private jwtService: JwtService
    ) {}

     async register(user:RegisterAuthDto) {

        const { email, phone } = user;//Desestructuramos el objeto

        // Validamos si el email ya existe
        const emailExist = await this.usersRepository.findOneBy({ email: email});
        if (emailExist) {
            //Error 409 Conflict
            return  new HttpException('El correo ya existe', HttpStatus.CONFLICT);
        }
        // Validamos si el telefono ya existe
        const phoneExist = await this.usersRepository.findOneBy({ phone: phone});
        if (phoneExist) {
            //Error 409 Conflict
            return  new HttpException('El telefono ya existe', HttpStatus.CONFLICT);
        }

        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser);
    }

    //Recibimos la data para el login
    async login(loginData: LoginAuthDto) {
        //Validamos si el email existe
        const {email, password} = loginData;//Desestructuramos el objeto
        const userFound = await this.usersRepository.findOneBy({ email: email });
        if (!userFound) {
            //Error 404 Not Found
            return new HttpException('El correo no existe', 404);
        }
        //Validamos si la contraseña es correcta
        const isPasswordValid = await compare(password, userFound.password);
        if (!isPasswordValid) {
            //Error 403 Forbidden
            return new HttpException('La contraseña es incorrecta', HttpStatus.FORBIDDEN);
        }

        const payload = { id: userFound.id, name: userFound.name };
        const token = this.jwtService.sign(payload); //Generamos el token
        //Retornamos el token y la data del usuario
        const data = {
            user: userFound,
            token: token,
        }
        //Retornamos la data del usuario
        return data;
    }
}
