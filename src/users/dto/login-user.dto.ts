import { IsEmail, IsNotEmpty } from 'class-validator'

// Usamos este DTO (Data Transfer Object) para verificar si los datos cumplen con las condiciones minimas
export class LoginUserDto {

    @IsEmail()
    email   : string;

    @IsNotEmpty()
    password: string;
}