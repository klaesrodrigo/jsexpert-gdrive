import fs from 'fs'
import prettyBytes from 'pretty-bytes'

export default class FileHelper {
    static getFileStatus = async (downloadsFolder) => {
        const currentFilesNames = await fs.promises.readdir(downloadsFolder)
        const statuses = await Promise.all(
            currentFilesNames.map(
                file => fs.promises.stat(`${downloadsFolder}/${file}`)
            )
        )

        const filesStatuses = []
        for (const fileIndex in currentFilesNames) {
            const { birthtime, size } = statuses[fileIndex]
            filesStatuses.push({
                size: prettyBytes(size),
                lastModified: birthtime,
                file: currentFilesNames[fileIndex],
                owner: process.env.USER
            })
        }

        return filesStatuses
    }
}