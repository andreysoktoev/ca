import fsSync from 'fs'
import fs from 'fs/promises'
import path from 'path'
import { pipeline } from 'stream'
import util from 'util'

export default async f => {
  const { sql } = f
  const PATH_TO_FOLDER = './bucket/'
  const pump = util.promisify(pipeline)

  f.register(import('@fastify/multipart'))

  f.post('/file/upload', async (req, res) => {
    const data = await req.file()
    const { file, filename, mimetype } = data
    const { name, ext } = path.parse(filename)
    const pathToFile = PATH_TO_FOLDER + filename
    await pump(file, fsSync.createWriteStream(pathToFile))
    const { size } = await fs.stat(pathToFile)
    await sql`insert into files ${sql({
      name,
      extension: ext,
      mime: mimetype,
      size,
      date: Date.now()
    })}`
  })

  f.put('/file/update/:id', async (req, res) => {
    const { id } = req.params
    const [old] = await sql`select * from files where id = ${id}`
    await fs.unlink(PATH_TO_FOLDER + old.name + old.extension)
    const data = await req.file()
    const { file, filename, mimetype } = data
    const { name, ext } = path.parse(filename)
    const pathToFile = PATH_TO_FOLDER + filename
    await pump(file, fsSync.createWriteStream(pathToFile))
    const { size } = await fs.stat(pathToFile)
    await sql`update files set ${sql({
      name,
      extension: ext,
      mime: mimetype,
      size,
      date: Date.now()
    })} where id = ${id}`
  })

  f.delete('/file/:id', async (req, res) => {
    try {
      const { id } = req.params
      const [{ name, extension }] = await sql`select * from files where id = ${id}`
      await fs.unlink(PATH_TO_FOLDER + name + extension)
      await sql`delete from files where id = ${id}`
    } catch (e) {
      res.badRequest(e.message)
    }
  })

  f.get('/file/:id', async (req, res) => {
    try {
      const { id } = req.params
      const [file] = await sql`select * from files where id = ${id}`
      res.send(file)
    } catch (e) {
      res.badRequest(e.message)
    }
  })

  f.get('/file/list', async (req, res) => {
    try {
      const files = await sql`table files`
      res.send(files)
    } catch (e) {
      res.badRequest(e.message)
    }
  })
}