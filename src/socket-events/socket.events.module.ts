import { Module } from "@nestjs/common";
import { SocketEventsGateway } from "./socket.events.gateway";

@Module({
    imports: [],
    controllers: [],
    providers: [SocketEventsGateway]
})
export class SocketEvents {}
