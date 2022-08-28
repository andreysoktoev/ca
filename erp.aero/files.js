import fs from 'fs'
import path from 'path'
import { pipeline } from 'stream'
import util from 'util'

const pump = util.promisify(pipeline)

export default async f => {
  const { sql } = f
  f.register(import('@fastify/multipart'))

  f.post('/file/upload', async (req, res) => {
    const data = await req.file()
    const { file, filename, mimetype } = data
    const { name, ext } = path.parse(filename)
    const pathToFile = './bucket/' + filename
    await pump(file, fs.createWriteStream(pathToFile))
    const { size } = fs.statSync(pathToFile)
    const row = {
      name,
      extension: ext,
      mime: mimetype,
      size,
      date: Date.now()
    }
    await sql`insert into files ${sql(row)}`
    res.send(row)
  })
}