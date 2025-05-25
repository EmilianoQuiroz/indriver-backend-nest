import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { In, Repository } from 'typeorm';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Rol } from 'src/roles/rol.entity';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Rol) private rolesRepository: Repository<Rol>,

    private jwtService: JwtService,
  ) {}

  async register(user: RegisterAuthDto) {
    const { email, phone } = user; //Desestructuramos el objeto

    // Validamos si el email ya existe
    const emailExist = await this.usersRepository.findOneBy({ email: email });
    if (emailExist) {
      //Error 409 Conflict
      throw new HttpException('El correo ya existe', HttpStatus.CONFLICT);
    }
    // Validamos si el telefono ya existe
    const phoneExist = await this.usersRepository.findOneBy({ phone: phone });
    if (phoneExist) {
      //Error 409 Conflict
      throw new HttpException('El telefono ya existe', HttpStatus.CONFLICT);
    }

    const newUser = this.usersRepository.create(user);

    let rolesIds: string[] = []; //Inicializamos los rolesIds como un array vacio
    if (user.rolesIds !== undefined && user.rolesIds !== null) {
      rolesIds = user.rolesIds; //Si el usuario tiene roles, los asignamos a rolesIds
    }
    else {
      rolesIds.push('CLIENT') //Si no tiene roles, asignamos el rol por defecto (id: 1)
    }

    const roles = await this.rolesRepository.findBy({ id: In(rolesIds) }); //Buscamos los roles por sus ids
    newUser.roles = roles; //Asignamos los roles al usuario
    const userSaved =  await this.usersRepository.save(newUser);
    const rolesString = userSaved.roles.map(rol => rol.id); //Obtenemos los Ids de los roles del usuario
    const payload = { 
      id: userSaved.id, 
      name: userSaved.name,
      roles: rolesString
    };
    const token = this.jwtService.sign(payload); //Generamos el token
    const data = {
      user: userSaved,
      token: 'Bearer ' + token,
    }
    delete (data.user as any).password;

    return data;
  }

  //Recibimos la data para el login
  async login(loginData: LoginAuthDto) {
    //Validamos si el email existe
    const { email, password } = loginData; //Desestructuramos el objeto
    const userFound = await this.usersRepository.findOne({
      where: { email: email },
      relations: ['roles'], //Cargamos las relaciones de roles
     });
    if (!userFound) {
      //Error 404 Not Found
      throw new HttpException('El correo no existe', 404);
    }
    //Validamos si la contraseña es correcta
    const isPasswordValid = await compare(password, userFound.password);
    if (!isPasswordValid) {
      //Error 403 Forbidden
      throw new HttpException(
        'La contraseña es incorrecta',
        HttpStatus.FORBIDDEN,
      );
    }

    // Validacion de los roles del usuario
    const  rolesIds = userFound.roles.map(rol => rol.id); //Obtenemos los ids de los roles del usuario

    const payload = { id: userFound.id, name: userFound.name, roles: rolesIds }; //Creamos el payload del token
    const token = this.jwtService.sign(payload); //Generamos el token
    //Retornamos el token y la data del usuario
    const data = {
      user: userFound,
      token: 'Bearer ' + token,
    };

    //Eliminamos la contraseña del usuario antes de retornarla
    delete (data.user as any).password;
    //Retornamos la data del usuario
    return data;
  }
}
