import postgres from 'postgres'

export const sql = postgres({
  username: 'postgres',
  password: 'postgres',
  database: 'insquad',
})