import { createSigner, createVerifier } from 'fast-jwt'

const ACCESS_TOKEN_TTL = 1000 * 60 * 10
const REFRESH_TOKEN_TTL = 1000 * 60 * 60 * 24 * 7

const createAccessToken = (id) => createSigner({ expiresIn: ACCESS_TOKEN_TTL, key: 'access' })({ id })
const createRefreshToken = (id) => createSigner({ expiresIn: REFRESH_TOKEN_TTL, key: 'refresh' })({ id })
const verifyRefreshToken = createVerifier({ key: 'refresh' })
export const verifyAccessToken = createVerifier({ key: 'access' })

export default async f => {
  const { sql } = f

  f.post('/signup', async (req, res) => {
    try {
      const [{ id }] = await sql`insert into users ${sql(req.body)} returning id`
      res
        .setCookie('refreshToken', createRefreshToken(id), {
          expires: new Date(Date.now() + REFRESH_TOKEN_TTL),
          httpOnly: true,
          path: '/signin/new_token',
          sameSite: true,
        })
        .send({ accessToken: createAccessToken(id) })
    } catch (e) {
      res.badRequest(e.message)
    }
  })
}