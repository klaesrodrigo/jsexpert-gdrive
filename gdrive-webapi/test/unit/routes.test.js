import {
    describe,
    test,
    expect,
    jest
} from '@jest/globals'
import Routes from '../../src/routes'

describe("#Routes tests suite", () => {
    const defaultParams = {
        request: {
            headers: {
                'Content-Type': 'Multipart/form-data'
            },
            method: '',
            body: {}
        },
        response: {
            setHeader: jest.fn(),
            writeHead: jest.fn(),
            end: jest.fn(),
        },
        values: () => Object.values(defaultParams)
    }

    describe('#setSocketInstance tests', () => {
        test("seetSocket should store io instance", () => {
            const routes = new Routes()
            const ioObj = {
                to: (id) => ioObj,
                emit: (event, meessage) => { }
            }

            routes.setSocketInstance(ioObj)

            expect(routes.io).toStrictEqual(ioObj)
        })
    })

    describe('#handler tests', () => {
        test('given an inexistent route it should choose default route', async () => {
            const routes = new Routes()
            const params = { ...defaultParams }

            params.request.method = 'inexistent'
            await routes.handler(...params.values())
            expect(params.response.end).toHaveBeenCalledWith('Hello world!')
        })
        test('it should set any request with CORS enabled', async () => {
            const routes = new Routes()
            const params = { ...defaultParams }

            params.request.method = 'inexistent'
            await routes.handler(...params.values())
            expect(params.response.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*')
        })
        test('given method OPTIONS it should choose options route', async () => {
            const routes = new Routes()
            const params = { ...defaultParams }

            params.request.method = 'OPTIONS'
            await routes.handler(...params.values())
            expect(params.response.writeHead).toHaveBeenCalledWith(204)
            expect(params.response.end).toHaveBeenCalled()
        })
        test('given method GET it should choose get route', async () => {
            const routes = new Routes()
            const params = { ...defaultParams }
            jest.spyOn(routes, routes.get.name).mockResolvedValueOnce()
            params.request.method = 'GET'
            await routes.handler(...params.values())
            expect(routes.get).toHaveBeenCalled()
        })
        test('given method POST it should choose post route', async () => {
            const routes = new Routes()
            const params = { ...defaultParams }
            jest.spyOn(routes, routes.post.name).mockResolvedValueOnce()
            params.request.method = 'POST'
            await routes.handler(...params.values())
            expect(routes.post).toHaveBeenCalled()
        })
    })

    describe('#get tests', () => {
        test('given method GET it should list all files downloaded', async () => {
            const routes = new Routes()
            const params = { ...defaultParams }
            const filesStatusesMock = [
                {
                    size: '78.9 kB',
                    lastModified: '2021-09-07T04:24:36.125Z',
                    owner: 'klaes',
                    file: 'file.png'
                }
            ]

            jest.spyOn(routes.fileHelper, routes.fileHelper.getFileStatus.name).mockResolvedValueOnce(filesStatusesMock)

            params.request.method = 'GET'
            await routes.handler(...params.values())

            expect(params.response.writeHead).toHaveBeenLastCalledWith(200)
            expect(params.response.end).toHaveBeenLastCalledWith(JSON.stringify(filesStatusesMock))
        })
    })
})