import https from 'https'
import fs from 'fs'
import { logger } from './logger.js'
import { Server } from 'socket.io'
import Routes from './routes.js'

const routes = new Routes()
const PORT = process.env.PORT || 3000
const localHostSSL = {
    key: fs.readFileSync('./certificates/key.pem'),
    cert: fs.readFileSync('./certificates/cert.pem')
}

const io = new Server({
    cors: {
        origin: '*',
        credentials: false
    }
})

io.on('connection', (socket) => {
    logger.info(`Someone connected: ${socket.id}`)
})

routes.setSocketInstance(io)

const server = https.createServer(localHostSSL, routes.handler)

const startServer = () => {
    const {address, port} = server.address()
    logger.info(`App running at https://${address}:${port}`)
}

server.listen(PORT, startServer)