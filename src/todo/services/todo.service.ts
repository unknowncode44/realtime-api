import { Injectable         } from "@nestjs/common";
import { DeleteResult, Repository         } from "typeorm";
import { InjectRepository   } from "@nestjs/typeorm";
import { Todo               } from "../entities/todo.entity";
import { TodoItem           } from "../todo.interface";

@Injectable()
export class TodoService {

    constructor(
        @InjectRepository(Todo)
        private readonly todoRepository: Repository<Todo>
    ){}
    
    // busca todos las tareas
    async findAll(): Promise<TodoItem[]> {
        return this.todoRepository.find()
    }

    // guarda todas las tareas
    async saveAll(todoItems: TodoItem[]) : Promise<TodoItem[]> {
        return this.todoRepository.save(todoItems)
    }

    // guarda unica tarea
    async save(todoItem: TodoItem) : Promise<TodoItem> {
        return this.todoRepository.save(todoItem)
    }

    // atualiza tarea
    async update(todoItem: TodoItem) : Promise<TodoItem> {
        await this.todoRepository.update(todoItem.id, todoItem)
        return await this.todoRepository.findOne({
            where: {
                id: todoItem.id
            }
        })
    }

    // borra la tarea
    async delete(todoItem: TodoItem) : Promise<DeleteResult> {
        return await this.todoRepository.delete(todoItem.id)
    }

}