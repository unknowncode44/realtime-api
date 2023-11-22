import { Injectable         } from '@nestjs/common'
import { InjectRepository   } from '@nestjs/typeorm'
import { ConnectionEntity   } from '../entities/connection.entity'
import { Repository         } from 'typeorm'
import { ConnectionI        } from '../todo.interface'

@Injectable()
export class ConnectionService {
    constructor(
        @InjectRepository(ConnectionEntity)
        private readonly connectionRepo: Repository<ConnectionEntity>
    ){}

    async create(connection: ConnectionI): Promise<ConnectionI> {
        return await this.connectionRepo.save(connection)
    }

    async findByUserId(userID: number): Promise<ConnectionEntity[]> {
        return this.connectionRepo.find({
            where: {connectedUser: {
                id: userID
            }}
        })
    }

    async deleteBySocket(socketId: string) {
        return await this.connectionRepo.delete({socketId});
    }

    async deleteAll() {
        return await this.connectionRepo.createQueryBuilder().delete().execute()
    }

    async findAll() : Promise<ConnectionI[]> {
        return this.connectionRepo.find();
    }
}