import {Body, Controller, Post} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) {}
    //GET -> OBTENER
    //POST -> CREAR
    //PUT -> ACTUALIZAR
    //DELETE -> ELIMINAR
    //PATCH -> ACTUALIZAR PARCIALMENTE
    @Post()//http://localhost/users -> POST
    create(@Body() user : CreateUserDto) {
        return this.userService.create(user);
    }
}
