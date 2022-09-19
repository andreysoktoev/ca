import 'dotenv/config'
import fastify from 'fastify'
import mercurius from 'mercurius'
import postgres from 'postgres'

const f = fastify()
const sql = postgres(process.env.PG_URL)

const schema = `
  type Book {
    id: Int
    title: String
    author: String
    createdAt: Float
  }

  input BookAdd {
    title: String!
    author: String!
  }

  input BookUpdate {
    id: Int!
    title: String
    author: String
  }

  type User {
    id: Int
    firstName: String
    lastName: String
    age: Int
    isFree: Boolean
    createdAt: Float
    updatedAt: Float
    books: [Book]
  }

  input UserCreate {
    firstName: String!
    lastName: String!
    age: Int!
    isFree: Boolean!
  }

  input UserUpdate {
    id: Int!
    firstName: String
    lastName: String
    age: Int
    isFree: Boolean
  }

  type Query {
    getAllBooks: [Book]
    getAllUsers: [User]
    getBook(id: Int!): Book
    getUser(id: Int!): User
  }

  type Mutation {
    addBook(data: BookAdd!): Book
    addUser(data: UserCreate!): User
    deleteBook(id: Int!): Boolean
    deleteUser(id: Int!): Boolean
    updateBook(data: BookUpdate!): Book
    updateUser(data: UserUpdate!): User
  }
`

const resolvers = {
  Query: {
    getAllBooks: async () => await sql`table books`,
    getAllUsers: async () => await sql`table users_view`,
    getBook: async (_, { id }) => {
      const [book] = await sql`select * from books where id = ${id}`
      return book
    },
    getUser: async (_, { id }) => {
      const [user] = await sql`select * from users where id = ${id}`
      return user
    },
  },
  Mutation: {
    addBook: async (_, { data }) => {
      const [book] = await sql`insert into books ${sql(data)} returning *`
      return book
    },
    addUser: async (_, { data }) => {
      const [user] = await sql`insert into users ${sql(data)} returning *`
      return user
    },
    deleteBook: async (_, { id }) => {
      await sql`delete from books where id = ${id}`
      return true
    },
    deleteUser: async (_, { id }) => {
      await sql`delete from users where id = ${id}`
      return true
    },
    updateBook: async (_, args) => {
      const { id, ...data } = args.data
      const [book] = await sql`update books set ${sql(data)} where id = ${id} returning *`
      return book
    },
    updateUser: async (_, args) => {
      const { id, ...data } = args.data
      const [user] = await sql`update users set ${sql({ ...data, updatedAt: Date.now() })} where id = ${id} returning *`
      return user
    },
  }
}

f.register(mercurius, {
  schema,
  resolvers,
  graphiql: true,
})

f.listen({ host: '0.0.0.0', port: 3000 })