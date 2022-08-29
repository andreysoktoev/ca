import { createSigner, createVerifier } from 'fast-jwt'

const ACCESS_TOKEN_TTL = 1000 * 60 * 10
const REFRESH_TOKEN_TTL = 1000 * 60 * 60 * 24 * 7

const createAccessToken = (id) => createSigner({ expiresIn: ACCESS_TOKEN_TTL, key: 'access' })({ id })
const createRefreshToken = (id) => createSigner({ expiresIn: REFRESH_TOKEN_TTL, key: 'refresh' })({ id })
const verifyRefreshToken = createVerifier({ key: 'refresh' })
export const verifyAccessToken = createVerifier({ key: 'access' })

export default async f => {
  const { redis, sql } = f

  f.get('/logout', async (req, res) => {
    try {
      const token = req?.headers?.authorization?.split(' ')[1]
      const { id } = verifyAccessToken(token)
      const [user] = await sql`select access_token from users where id = ${id}`
      if (!user || token !== user.access_token) res.unauthorized('Invalid token')
      const access_token = createAccessToken(id)
      const refresh_token = createRefreshToken(id)
      await sql`update users set ${sql({ access_token, refresh_token })} where id = ${id}`
      res
        .setCookie('refreshToken', refresh_token, {
          expires: new Date(Date.now() + REFRESH_TOKEN_TTL),
          httpOnly: true,
          path: '/signin/new_token',
          sameSite: true,
        })
        .send({ access_token })
    } catch (e) {
      res.unauthorized(e.message)
    }
  })

  f.post('/signin', async (req, res) => {
    try {
      const { id, password } = req.body
      const [user] = await sql`select password from users where id = ${id}`
      if (!user || password !== user.password) res.unauthorized('Invalid credentials')
      const access_token = createAccessToken(id)
      const refresh_token = createRefreshToken(id)
      await sql`update users set ${sql({ access_token, refresh_token })} where id = ${id}`
      res
        .setCookie('refreshToken', refresh_token, {
          expires: new Date(Date.now() + REFRESH_TOKEN_TTL),
          httpOnly: true,
          path: '/signin/new_token',
          sameSite: true,
        })
        .send({ access_token })
      } catch (e) {
      res.unauthorized(e.message)
    }
  })

  f.post('/signin/new_token', async (req, res) => {
    try {
      const { id } = verifyRefreshToken(req.cookies.refreshToken)
      const [user] = await sql`select id from users where id = ${id}`
      if (!user) res.unauthorized('Invalid token')
      const access_token = createAccessToken(id)
      const refresh_token = createRefreshToken(id)
      await sql`update users set ${sql({ access_token, refresh_token })} where id = ${id}`
      res
        .setCookie('refreshToken', refresh_token, {
          expires: new Date(Date.now() + REFRESH_TOKEN_TTL),
          httpOnly: true,
          path: '/signin/new_token',
          sameSite: true,
        })
        .send({ access_token })
      } catch (e) {
      res.unauthorized(e.message)
    }
  })

  f.post('/signup', async (req, res) => {
    try {
      const { id, password } = req.body
      const access_token = createAccessToken(id)
      const refresh_token = createRefreshToken(id)
      await sql`insert into users ${sql({ id, password, access_token, refresh_token })}`
      res
        .setCookie('refreshToken', refresh_token, {
          expires: new Date(Date.now() + REFRESH_TOKEN_TTL),
          httpOnly: true,
          path: '/signin/new_token',
          sameSite: true,
        })
        .send({ access_token })
    } catch (e) {
      res.conflict(e.message)
    }
  })
}