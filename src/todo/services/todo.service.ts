import { Injectable         } from "@nestjs/common";
import { Repository         } from "typeorm";
import { InjectRepository   } from "@nestjs/typeorm";
import { Todo               } from "../entities/todo.entity";
import { TodoItem           } from "../todo.interface";

@Injectable()
export class TodoService {

    constructor(
        @InjectRepository(Todo)
        private readonly todoRepository: Repository<Todo>
    ){}

    async findAll(): Promise<TodoItem[]> {
        return this.todoRepository.find()
    }

    async saveAll(todoItems: TodoItem[]) : Promise<TodoItem[]> {
        return this.todoRepository.save(todoItems)
    }

    async save(todoItem: TodoItem) : Promise<TodoItem> {
        return this.todoRepository.save(todoItem)
    }
}