import Fastify, { FastifyInstance } from 'fastify'
import { Client } from 'discord.js';
import fastifyPassport from '@fastify/passport'
import fastifySecureSession from '@fastify/secure-session'
const oauthPlugin = require('@fastify/oauth2')
import fs from 'fs';
import path from 'path';

let scopes = ['identify', 'email', /* 'connections', (it is currently broken) */ 'guilds', 'guilds.join'];
// let prompt = 'consent'

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
        // Config 
        this.server.register(require('@fastify/cors'), (instance) => {
            return (req: any, callback: any) => {
                const corsOptions = {
                    // This is NOT recommended for production as it enables reflection exploits
                    origin: true
                };

                // do not include CORS headers for requests from localhost
                // if (/^localhost$/m.test(req.headers.origin)) {
                //     corsOptions.origin = false
                // }

                // callback expects two parameters: error and options
                callback(null, corsOptions)
            }
        })

        // set up secure sessions for @fastify/passport to store data in
        this.server.register(fastifySecureSession, {
            key: fs.readFileSync(path.join(__dirname, 'secret-key')),
        })

        // initialize @fastify/passport and connect it to the secure-session storage. Note: both of these plugins are mandatory.
        this.server.register(fastifyPassport.initialize())
        this.server.register(fastifyPassport.secureSession())

        this.server.register(oauthPlugin, {
            name: 'discordOauth2',
            scope: ["identify"],
            credentials: {
                client: {
                    id: process.env.CLIENT_ID,
                    secret: process.env.CLIENT_SECRET
                },
                auth: {
                    authorizeHost: 'https://discord.com',
                    authorizePath: '/oauth2/authorize',
                    tokenHost: 'https://discord.com',
                    tokenPath: '/api/oauth2/token'
                }

            },
            startRedirectPath: '/login',
            callbackUri: `http://localhost:6777/login/discord/callback`,
            callbackUriParams: {
                test: "test"
            }
        })

        this.server.get('/login/discord/callback', function (request, reply) {
            console.log('ICICIICI', request)
            // const token = await this.discordOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)

            // console.log(token)

            // you should store the `token` for further usage
            // await saveAccessToken(token)

            reply.send({ access_token: 'token' })
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