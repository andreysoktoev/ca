import fastify from 'fastify'
import postgres from 'postgres'

export function app() {
  const f = fastify()

  f.register(import('@fastify/cookie'))
  f.register(import('@fastify/cors'), {
    allowedHeaders: ['Content-Type', 'Authorization'],
    origin: true,
  })

  f.register(import('@fastify/sensible'))

  f.register(import('./auth.js'))
  f.register(import('./routes.js'))

  f.decorate('sql', postgres({
    database: 'erp_aero',
    password: 'postgres',
    username: 'postgres',
  }))

  return f
}