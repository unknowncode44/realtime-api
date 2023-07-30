import { Injectable     } from "@nestjs/common";
import { CreateUserDto  } from "./create-user.dto";
import { UserI          } from "../user.interface";
import { LoginUserDto   } from "./login-user.dto";


@Injectable()
export class DtoHelperService {

    createUserDtoEntity(createUserDto: CreateUserDto)   : UserI {
        return {
            email   : createUserDto.email,
            password: createUserDto.password,
            username: createUserDto.username
        }
    }

    loginUserDtoEntity(loginUserDto: LoginUserDto)      : UserI {
        return {
            email   : loginUserDto.email,
            password: loginUserDto.password
        }
    }

}