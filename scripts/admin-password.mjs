import { randomBytes, scryptSync } from 'node:crypto'
import readline from 'node:readline/promises'
import { Writable } from 'node:stream'

if (!process.stdin.isTTY) {
  console.error('Run interactively: npm run admin:password (password entry is hidden).')
  process.exit(1)
}
const silent = new Writable({ write(_chunk, _encoding, next) { next() } })
const rl = readline.createInterface({ input: process.stdin, output: silent, terminal: true })
try {
  process.stdout.write('New admin password (at least 12 characters, hidden): ')
  const password = await rl.question('')
  process.stdout.write('\n')
  if (password.length < 12 || password.length > 256) throw new Error('Use 12–256 characters.')
  const salt = randomBytes(16).toString('hex')
  console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt}:${scryptSync(password, salt, 64).toString('hex')}`)
  console.log(`ADMIN_SESSION_SECRET=${randomBytes(48).toString('hex')}`)
} catch (error) { console.error(error.message); process.exitCode = 1 }
finally { rl.close() }
