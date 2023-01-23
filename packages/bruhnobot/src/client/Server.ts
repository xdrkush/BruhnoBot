import Fastify, { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify'
import { Client } from 'discord.js';

export class ServerClient {
    server: FastifyInstance;
    discord_client: Client;

    constructor(client: Client) {
        this.discord_client = client;
        this.server = Fastify({
            logger: true
        })
    }
    
    initConfig() {
        console.log('discord', this.discord_client)
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