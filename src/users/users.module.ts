import { Module           } from '@nestjs/common';
import { UsersService     } from './services/users.service';
import { UsersController  } from './controllers/users.controller';
import { AuthModule       } from '../auth/auth.module';
import { TypeOrmModule    } from '@nestjs/typeorm';
import { User             } from './entities/user.entity';
import { DtoHelperService } from './dto/dto-helper.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([User])
  ],
  controllers: [UsersController],
  providers: [UsersService, DtoHelperService]
})
export class UsersModule {}
