import { verifyAccessToken } from './auth.js'

export default async f => {
  const { sql } = f

  f.register(import('./files.js'))

  f.addHook('onRequest', async (req, res) => {
    try {
      const token = req?.headers?.authorization?.split(' ')[1]
      const { id } = verifyAccessToken(token)
      const [user] = await sql`select access_token from users where id = ${id}`
      if (!user || token !== user.access_token) res.unauthorized('Invalid token')
      req.user = { id }
    } catch (e) {
      res.unauthorized(e.message)
    }
  })

  f.get('/info', async (req, res) => {
    const { id } = req.user
    res.send({ id })
  })
}