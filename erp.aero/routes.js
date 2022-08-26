import { verifyAccessToken } from './auth.js'

export default async f => {
  f.addHook('onRequest', async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1]
      req.user = verifyAccessToken(token)
    } catch (e) {
      res.unauthorized(e.message)
    }
  })

  f.get('/info', async (req, res) => {
    const { id } = req.user
    res.send({ id })
  })
}