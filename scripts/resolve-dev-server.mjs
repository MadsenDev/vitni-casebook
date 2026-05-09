import fs from 'node:fs'
import path from 'node:path'
import net from 'node:net'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const statePath = path.join(repoRoot, '.casebook-dev-server.json')

function isPortAvailable(port) {
  return new Promise(resolve => {
    const server = net.createServer()
    server.once('error', () => resolve(false))
    server.once('listening', () => {
      server.close()
      resolve(true)
    })
    server.listen(port)
  })
}

async function findPort(start) {
  for (let p = start; p < start + 20; p++) {
    if (await isPortAvailable(p)) return p
  }
  throw new Error('No available port found')
}

const port = await findPort(5173)
const url = `http://localhost:${port}`

fs.writeFileSync(statePath, JSON.stringify({ port, url }, null, 2))
console.log(`Dev server will use port ${port}`)
