import { createSigner, createVerifier } from 'fast-jwt'

const ACCESS_TOKEN_TTL = 1000 * 60 * 10
const REFRESH_TOKEN_TTL = 1000 * 60 * 60 * 24 * 7

const createAccessToken = (id) => createSigner({ expiresIn: ACCESS_TOKEN_TTL, key: 'access' })({ id })
const createRefreshToken = (id) => createSigner({ expiresIn: REFRESH_TOKEN_TTL, key: 'refresh' })({ id })
const verifyRefreshToken = createVerifier({ key: 'refresh' })
export const verifyAccessToken = createVerifier({ key: 'access' })

export default async f => {
  const { sql } = f

  f.post('/signin', async (req, res) => {
    try {
      const { id, password } = req.body
      const [user] = await sql`select password from users where id = ${id}`
      if (!user || password !== user.password) res.unauthorized('Invalid credentials')
      const accessToken = createAccessToken(id)
      const refreshToken = createRefreshToken(id)
      await sql`update users set refresh_token = ${refreshToken} where id = ${id}`
      res
        .setCookie('refreshToken', refreshToken, {
          expires: new Date(Date.now() + REFRESH_TOKEN_TTL),
          httpOnly: true,
          path: '/signin/new_token',
          sameSite: true,
        })
        .send({ accessToken })
      } catch (e) {
      res.unauthorized(e.message)
    }
  })

  f.post('/signup', async (req, res) => {
    try {
      const { id, password } = req.body
      const accessToken = createAccessToken(id)
      const refreshToken = createRefreshToken(id)
      await sql`insert into users ${sql({ id, password, refresh_token: refreshToken })}`
      res
        .setCookie('refreshToken', refreshToken, {
          expires: new Date(Date.now() + REFRESH_TOKEN_TTL),
          httpOnly: true,
          path: '/signin/new_token',
          sameSite: true,
        })
        .send({ accessToken })
    } catch (e) {
      res.conflict(e.message)
    }
  })
}