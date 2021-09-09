import FileHelper from "./fileHelper.js"
import { logger } from "./logger.js"
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const defaultDownloadsFolder = resolve(__dirname, '../', 'downloads')

export default class Routes {
    io
    constructor(downloadsFolder = defaultDownloadsFolder) {
        this.downloadsFolder = downloadsFolder
        this.fileHelper = FileHelper
    }

    setSocketInstance = (io) => {
        this.io = io
    }

    defaultRoute = (req, res) => {
        res.end('Hello world!')
    }

    options = async (req, res) => {
        res.writeHead(204)
        res.end('Hello world!')
    }

    get = async (req, res) => {
        const result = await this.fileHelper.getFileStatus(this.downloadsFolder)

        res.writeHead(200)
        res.end(JSON.stringify(result))
    }

    post = async (req, res) => {
        logger.info('Post')
        res.end()
    }

    handler = (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        const chosen = this[req.method.toLowerCase()] || this.defaultRoute
        return chosen.apply(this, [req, res])
    }
}