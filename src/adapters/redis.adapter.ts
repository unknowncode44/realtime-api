import { IoAdapter      } from "@nestjs/platform-socket.io";
import { ServerOptions  } from "socket.io";
import { createAdapter  } from '@socket.io/redis-adapter'
import { createClient   } from 'redis'



export class RedisIoAdapter extends IoAdapter {

    // creamos una variable del tipo ReturnType, esta la retornaremos con una instancia de 
    // del metodo createAdapter de la libreria 'socket.io-reds'
    private adapterConstructor: ReturnType<typeof createAdapter>

    // creamos el metodo para connectarnos al Redis Server
    async connectToRedis(): Promise<void> {
        // nos registramos como un cliente del server
        // en este caso tenemos una instancia de docker-redis corriendo, la cual por defecto
        // asigna el puerto 6379 
        const pubClient = createClient({ url: 'redis://127.0.0.1:6379' })
        const subClient = pubClient.duplicate()

        await Promise.all([pubClient.connect(), subClient.connect()])
        
        // retornamos nuestra variable adapter constructor ya instanciada
        // con nuestros clientes redis creados
        this.adapterConstructor = createAdapter(pubClient, subClient)
        
    }


    // tambien crearemos un metodo para la creacion de un servidor socketIO

    createIOServer(port: number, options?: any): any {
        const server = super.createIOServer(port, options)

        // utilizaremos nuestra variable adapterConstructor con el adaptador de los clientes redis
        server.adapter(this.adapterConstructor);

        // retornamos nuestra variable server, configurada y con el adaptador redis

        return server
    }
}