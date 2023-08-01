import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { TodoService } from "./todo.service";
import { TodoItem } from "../todo.interface";

@Injectable()

export class SetupService implements OnApplicationBootstrap {
    
    constructor(
        private todosService: TodoService
    ) {}
    
    onApplicationBootstrap() {
        // const items: TodoItem[] = [
        //     {
        //       title: 'Item Dificil',
        //       complexity: 'DIFICIL',
        //       subtitle: 'Item Dificil',
        //       text: 'Tarea Dificil',
        //       status: 'EN_PROGRESO'
        //     },
        //     {
        //       title: 'Item Dificil',
        //       complexity: 'DIFICIL',
        //       subtitle: 'Item Dificil',
        //       text: 'Tarea Dificil',
        //       status: 'EN_PROGRESO'
        //     },
        //     {
        //       title: 'Item Medio',
        //       complexity: 'MEDIO',
        //       subtitle: 'Item Medio',
        //       text: 'Tarea Media',
        //       status: 'PARA_HACER'
        //     },
        //     {
        //       title: 'Item Facil',
        //       complexity: 'FACIL',
        //       subtitle: 'Item Facil',
        //       text: 'Tarea Facil',
        //       status: 'FINALIZADAS'
        //     }
        //   ];
        //   this.todosService.saveAll(items)
    }


}