import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { UsersService } from "./users/services/users.service";
import { AuthService } from "./auth/services/auth.service";
import { UserI } from "./users/user.interface";
import { NextFunction } from "express";

export interface RequestModel {
    user    : UserI,
    headers : any
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private authService: AuthService,
        private userService: UsersService, 
    ) {

    }

    async use(request: RequestModel, response: Response, next: NextFunction) {
        try {
            const tokenArray: string[] = request.headers['authorization'].split(' ')
            // tira error si el token no es valido
            const decodedToken = await this.authService.verifyJwt(tokenArray[1]);

            // nos aseguramos que el usuario no fue borrado,
            // o si alguna propiedad cambio durante desde que se otorgo el token
            const user: UserI = await this.userService.getOneById(decodedToken.user.id)
            if(user) {
                // anexa el objeto user a nuestro objeto request, de esta manera podemos acceder
                // luego al mismo si lo necesitamos.
                // si ya existia uno lo sobrescribimos
                request.user = user;
                next();
            }
            else {
                throw new HttpException('No Autorizado', HttpStatus.UNAUTHORIZED)
            }
            
        } catch {
            throw new HttpException('No Autorizado', HttpStatus.UNAUTHORIZED)  
        }
    }
}