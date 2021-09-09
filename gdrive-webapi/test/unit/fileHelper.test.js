import {
    describe,
    test,
    expect,
    jest
} from '@jest/globals'
import Routes from '../../src/routes'
import fs from 'fs'
import FileHelper from '../../src/fileHelper'
describe("#Filehelper tests suite", () => {
    describe('#getFileStatus tests', () => {
        test('it should return files statuses in correct format', async () => {
            const statMock = {
                dev: 2096,
                mode: 33188,
                nlink: 1,
                uid: 1000,
                gid: 1000,
                rdev: 0,
                blksize: 4096,
                ino: 63493,
                size: 78902,
                blocks: 160,
                atimeMs: 1630988676384.791,
                mtimeMs: 1630988676124.791,
                ctimeMs: 1630988676124.791,
                birthtimeMs: 1630988676124.791,
                atime: '2021-09-07T04:24:36.385Z',
                mtime: '2021-09-07T04:24:36.125Z',
                ctime: '2021-09-07T04:24:36.125Z',
                birthtime: '2021-09-07T04:24:36.125Z'
            }
            const mockUser = 'klaes'
            const filename = 'file.png'

            jest.spyOn(fs.promises, fs.promises.readdir.name).mockResolvedValueOnce([filename])
            jest.spyOn(fs.promises, fs.promises.stat.name).mockResolvedValueOnce(statMock)

            const result = await FileHelper.getFileStatus('/tmp')
            const expectedResult = [
                {
                    size: '78.9 kB',
                    lastModified: statMock.birthtime,
                    owner: mockUser,
                    file: filename
                }
            ]

            expect(fs.promises.stat).toHaveBeenCalledWith(`/tmp/${filename}`)
            expect(result).toMatchObject(expectedResult)
        })
    })
})