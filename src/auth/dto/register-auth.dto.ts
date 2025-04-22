import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterAuthDto {

    @IsNotEmpty()//Validamos que el nombre de usuario no sea vacio
    @IsString()//Validamos que el nombre de usuario sea un string
    name: string;
    @IsNotEmpty()//Validamos que el apellido de usuario no sea vacio
    @IsString()//Validamos que el apellido de usuario sea un string
    lastname: string;
    @IsNotEmpty()
    @IsString()
    @IsEmail()//Validamos que sea un email
    email: string;
    @IsNotEmpty()
    @IsString()
    phone: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(6, {message: 'La contraseña debe tener minimo 6 caracteres'})//Validamos que la contraseña tenga al menos 6 caracteres
    password: string;
}