const http = require('http')

const HOST = 'http://127.0.0.1'
const PORT = 9999
const serverHandle = require('../app')

const server = http.createServer(serverHandle)

server.listen(PORT, () => {
	console.log(`start in ${HOST}:${PORT}`)
})
