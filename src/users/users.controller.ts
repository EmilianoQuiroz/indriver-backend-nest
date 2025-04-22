import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  //GET -> OBTENER
  //POST -> CREAR
  //PUT -> ACTUALIZAR
  //DELETE -> ELIMINAR
  //PATCH -> ACTUALIZAR PARCIALMENTE

  //Creamos la ruta para obtener todos los usuarios
  @UseGuards(JwtAuthGuard)
  @Get() //http://localhost/users -> GET
  findAll() {
    return this.userService.findAll();
  }

  @Post() //http://localhost/users -> POST
  create(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }
}
