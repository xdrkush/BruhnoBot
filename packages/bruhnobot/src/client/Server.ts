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
            cookieName: 'BrunhoBot',
            key: fs.readFileSync(path.join(__dirname, 'secret-key')),
            cookie: {
                path: '/'
            }
        })

        // initialize @fastify/passport and connect it to the secure-session storage. Note: both of these plugins are mandatory.
        this.server.register(fastifyPassport.initialize())
        this.server.register(fastifyPassport.secureSession())

        this.server.register(oauthPlugin, {
            name: 'discordOAuth2',
            scope: ["identify"],
            credentials: {
                client: {
                    id: process.env.CLIENT_ID,
                    secret: process.env.CLIENT_SECRET
                },
                auth: oauthPlugin.DISCORD_CONFIGURATION
            },
            startRedirectPath: '/discord',
            callbackUri: `http://localhost:6777/login/discord/callback`
        })

        this.server.get('/login/discord/callback', async function (request, reply) {
            console.log('ICICIICI', request)
            const token = await this.discordOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)

            console.log(request.session)

            // you should store the `token` for further usage
            // await saveAccessToken(token)

            reply.redirect('http://localhost:3000')
        })

        this.server.get('/login/discord', async function (request, reply) {
            const authorizationEndpoint = this.discordOAuth2.generateAuthorizationUri(request);
            console.log(authorizationEndpoint)

            reply.send({ endPoint: authorizationEndpoint })

            // reply.redirect('/discord')
        })

        this.server.get('/', async function (request, reply) {
            const session = request.session
            console.log(session)
            reply.send({ session })
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