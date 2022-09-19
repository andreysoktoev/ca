import fastify from 'fastify'
import mercurius from 'mercurius'
import { sql } from './db/connector.js'

const f = fastify()

const schema = `
  type User {
    id: Int
    firstName: String
    lastName: String
    age: Int
    isFree: Boolean
    createdAt: String
    updatedAt: String
  }

  input UserInput {
    firstName: String!
    lastName: String!
    age: Int!
    isFree: Boolean!
  }

  type Query {
    getUsers: [User]
    getUser(id: Int!): User
  }

  type Mutation {
    createUser(data: UserInput!): User
  }
`

const resolvers = {
  Query: {
    getUsers: async () => await sql`table users`,
    getUser: async (_, { id }) => {
      const [user] = await sql`select * from users where id = ${id}`
      return user
    }
  },
  Mutation: {
    createUser: async (_, { data }) => {
      const [user] = await sql`insert into users ${sql(data)} returning *`
      return user
    }
  }
}

f.register(mercurius, {
  schema,
  resolvers,
  graphiql: true,
})

f.listen({ port: 3000 })