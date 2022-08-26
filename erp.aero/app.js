import fastify from 'fastify'
import postgres from 'postgres'

export function app() {
  const f = fastify()

  f.decorate('sql', postgres({
    username: 'postgres',
    password: 'postgres'
  }))

  return f
}