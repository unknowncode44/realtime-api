import { UserI } from "../users/user.interface";

export type Status      = 'EN_PROGRESO' | 'PARA_HACER'  | 'FINALIZADAS';
export type Complexity  = 'DIFICIL'     | 'MEDIO'       | 'FACIL'

export interface TodoItem {
    id?         : number,
    createdBy?  : UserI,
    updatedBy?  : UserI,
    createdAt?  : Date,
    updatedAt?  : Date;
    status?     : Status,
    title?      : string,
    subtitle?   : string,
    text?       : string,
    complexity? : Complexity
}

export interface ConnectionI {
    id?             : number,
    socketId?       : string,
    connectedUser?  : UserI
}