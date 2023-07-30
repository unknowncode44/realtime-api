import { HttpException, HttpStatus, Injectable       } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository       } from 'typeorm';
import { User             } from '../entities/user.entity';
import { AuthService      } from '../../auth/services/auth.service';
import { UserI            } from '../user.interface';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository : Repository<User>,
    private authService             : AuthService 
  ){}

  // metodo create para crear un nuevo usuario si el mismo no esta registrado
  async create(newUser: UserI): Promise<UserI> {
    
    // usamos los metodos privados para asegurar que el usuario no existe
    const emailExist    : boolean = await this.mailExists(    newUser.email);
    const usernameExist : boolean = await this.usernameExist( newUser.email);

    // si no existe procedemos a crearlo
    if (emailExist === false && usernameExist === false) {

      // hasheamos la contrasena usando nuestro metodo del authService
      const passwordHash: string = await this.authService.hashPassword(newUser.password)

      // instanciamos los datos en el usuario y convertimos las cadenas de texto en minusculas
      newUser.password  = passwordHash;
      newUser.email     = newUser.email.toLowerCase();
      newUser.username  = newUser.username.toLowerCase()

      // guardamos el user en la bd y lo retornamos
      const user = await this.userRepository.save(this.userRepository.create(newUser))
      
      // el metodo findOne es un metodo privado (ver mas abajo), con esto aseguramos y re contra aseguramos que se creo el user.
      return await this.findOne(user.id)

    // si el usuario existe, tiramos una exepcion del tipo HTTP:  
    } else {
      throw new HttpException('Email / Usuario ya existen!', HttpStatus.CONFLICT)
    }

  }

  // el metodo login es para comprobar si un usuario existe y retornar el token de accesso
  async login(user: UserI): Promise<string> {
    // chequeamos la db para comprobar la existencia del usuario, para eso llamamos al metodo privado findByEmail,
    const foundUser: UserI = await this.findByEmail(user.email);

    // si el usuario existe comprobamos su contrasena contra la contrasena almacenada, usando el metodo compare de bcrypt
    if(foundUser) {
      const passwordMatch: boolean = await this.authService.comparePassword(user.password, foundUser.password);

      // si las contrasenas coinciden procedemos a la generacion de un nuevo JWT
      if(passwordMatch === true){
        const payload: UserI = await this.findOne(foundUser.id);
        return await this.authService.generateJWT(payload)
      }

      // si no coninciden tiramos una excepcion del tipo HTTP NO AUTORIZADO 
      else {
        throw new HttpException('Contraseña incorrecta!', HttpStatus.UNAUTHORIZED)
      }
    }

    // Si el usuario no existe tiramos una excepcion del tipo HTTP No Encontrado
    else {
      throw new HttpException('Usuario no encontrado!', HttpStatus.NOT_FOUND)
    }
  }

  // creamos metodos para chequear si el mail y/o el username ya existe/n
  private async mailExists(email: string)       : Promise<boolean> {
    const user = await this.userRepository.findOne({ where: {email}});
    return !!user;
    
  }

  private async usernameExist(username: string) : Promise<boolean> {
    const user = await this.userRepository.findOne({ where: {username}});
    return !!user;
  }

  // creamos un metodo para crear y devolever el usuario creado
  private async findOne(id: number): Promise<UserI> {
    return await this.userRepository.findOne({where: {id}})
  }

  // creamos un metodo para encontrar a un usuario ya registrado
  private async findByEmail(email: string): Promise<UserI>  {
    return await this.userRepository.findOne({
      where: {email},
      select: ['id', 'email', 'password', 'username']
    })
  }
  
}
