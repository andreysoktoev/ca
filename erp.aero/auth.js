export default async f => {
  const { sql } = f

  f.post('/signup', async (req, res) => {
    try {
      const [user] = await sql`insert into users ${sql(req.body)} returning *`
      res.send(user)
    } catch (err) {
      res.badRequest(err.message)
    }
  })
}