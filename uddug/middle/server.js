import Fastify from 'fastify'
import fastifyRateLimit from 'fastify-rate-limit'

const fastify = Fastify()

fastify.register(fastifyRateLimit, {
  global: false
})

fastify.get('/', (req, reply) => {
  reply.send('Middle Go / Node.js Dev')
})

fastify.get('/:user/message',
  {
    config: {
      rateLimit: {
        keyGenerator(req) { return req.params.user },
        max: 1,
        timeWindow: '1 second'
      }
    }
  },
  (req, reply) => {
    reply.send('A user can send only one message per second.')
  }
)

fastify.get('/:user/pay',
  {
    config: {
      rateLimit: {
        keyGenerator(req) { return req.params.user },
        max: 3,
        timeWindow: '1 day'
      }
    }
  },
  (req, reply) => {
    reply.send('A user is allowed only three failed credit card transactions per day.')
  }
)

fastify.get('/signup',
  {
    config: {
      rateLimit: {
        max: 20,
        timeWindow: '1 day'
      }
    }
  },
  (req, reply) => {
    reply.send('A single IP can only create twenty accounts per day.')
  }
)

fastify.listen(3000)