import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Importamos el modulo de TypeOrm y le pasamos el User
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
