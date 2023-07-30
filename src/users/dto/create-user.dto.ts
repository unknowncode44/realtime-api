import { LoginUserDto } from "./login-user.dto";
import { IsString, IsNotEmpty } from 'class-validator'


// Extendemos nuestra clase Login User, y le agregamos el username, aseguramos que cumple con los requisitos usando
// los decoradores que nos proporciona class-validator
export class CreateUserDto extends LoginUserDto {

    @IsString()
    @IsNotEmpty()
    username: string;

}
