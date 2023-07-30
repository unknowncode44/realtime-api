import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserI      } from '../../users/user.interface';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService){

    }

    async generateJWT(user: UserI): Promise<string>{
        return this.jwtService.signAsync({user})
    }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 12)
    }

    async comparePassword(password: string, storedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, storedPassword);
    }

    async verifyJwt(jwt: string) : Promise<any> {
        return this.jwtService.verifyAsync(jwt)
    }
}