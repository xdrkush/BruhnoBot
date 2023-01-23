import Fastify, { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify'

export class ServerClient {
    server: FastifyInstance;

    constructor() {
        this.server = Fastify({
            logger: true
        })
    }
    
    initConfig() {
        this.server.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
            return 'test\n'
        })
    }

    run() {
        this.server.listen({ port: 6777 }, (err: any, address: any) => {
            if (err) {
                console.error(err)
                process.exit(1)
            }
            console.log(`Server listening at ${address}`)
        })
    }

}