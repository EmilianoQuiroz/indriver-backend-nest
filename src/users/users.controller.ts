import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { updateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRol } from 'src/auth/jwt/jwt-rol';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  //GET -> OBTENER
  //POST -> CREAR
  //PUT -> ACTUALIZAR
  //DELETE -> ELIMINAR
  //PATCH -> ACTUALIZAR PARCIALMENTE

  //Creamos la ruta para obtener todos los usuarios
  @HasRoles(JwtRol.ADMIN, JwtRol.CLIENT) //Solo los usuarios con el rol de admin pueden acceder a esta ruta
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Get() //http://localhost/users -> GET
  findAll() {
    return this.userService.findAll();
  }

  @Post() //http://localhost/users -> POST
  create(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }

  @HasRoles(JwtRol.CLIENT) //Solo los usuarios con el rol de client pueden acceder a esta ruta
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Put(':id') //http://localhost/users/:id -> PUT
  update(@Param('id', ParseIntPipe) id: number, @Body() user: updateUserDto) {
    return this.userService.update(id, user);
  }

  @HasRoles(JwtRol.CLIENT) //Solo los usuarios con el rol de client pueden acceder a esta ruta
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  updateWithImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
    @Body() user: updateUserDto,
  ) {
    return this.userService.updateWithImage(file, id, user); //Subimos la imagen a Firebase Storage
  }
}
