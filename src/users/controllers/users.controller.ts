import { Controller, Post, Body } from '@nestjs/common';
import { DtoHelperService       } from '../dto/dto-helper.service';
import { UsersService           } from '../services/users.service';
import { CreateUserDto          } from '../dto/create-user.dto';
import { LoginResponseI, UserI                  } from '../user.interface';
import { LoginUserDto } from '../dto/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService : UsersService,
    private dtoHelperService      : DtoHelperService,
    ) {}
  
  // el metodo create del tipo POST es para crear un nuevo usuario
  // usamos el metodo createUserDTO de nuestro DTO Helper Service, para asegurar la correcta creacion de nuestra entidad
  // asegurando la integridad de los tipos de datos
  // finalemente usaremos el metodo create de nuestro usersService para hacer todas las comprobaciones y crear una entrada segura
  @Post()
  async create(@Body() createUserDto: CreateUserDto) : Promise<UserI> {
    const userEntity: UserI = this.dtoHelperService.createUserDtoEntity(createUserDto);
    return await this.usersService.create(userEntity)
  }

  // el metodo login del tipo POST es para loggear un usuario ya registrado
  // usamos el metodo loginUserDTO de nuesto DTO Helper Service para asegurar la correcta creacion de nuestra entidad
  // asegurando la integridad de los tipos de datos
  // luego generamos llamamos al metodo login de nuestro User Service para hacer las comprobaciones necesarias y retornar el JWT
  // que finalmente retornaremos
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponseI> {
    const userEntity: UserI = this.dtoHelperService.loginUserDtoEntity(loginUserDto);
    const jwt: string = await this.usersService.login(userEntity);
    return {
      access_token  : jwt,
      token_type    : 'JWT',
      expires_in    : 10000,
    }
  }

}
