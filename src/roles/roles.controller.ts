import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRol } from 'src/auth/jwt/jwt-rol';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';

@Controller('roles')
export class RolesController {
    
    constructor(private rolesService: RolesService) {}

    @HasRoles(JwtRol.ADMIN) // Only users with the admin role can access this route
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post()
    create(@Body() rol: CreateRolDto) {
        return this.rolesService.create(rol);
    }
}
