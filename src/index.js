import express from 'express'
import session from 'express-session'
import { bucket } from './db'
import { ApolloServer } from 'apollo-server-express'
import typeDefs from './typeDefs'
import resolvers from './resolvers'

const CouchbaseStore = require('connect-couchbase')(session)
const APP_PORT = 3000
const IN_PROD = false
bucket.on('connect', () => {
  const app = express()
  app.disable('x-powered-by')
  const couchbaseStore = new CouchbaseStore({
    db: bucket,
    //ttl: 2 * 60,
    prefix: 'sess::'
  })
  app.use(session({
    name: 'MYSESSION',
    store: couchbaseStore,
    secret: 'aplocandiemete',
    cookie: {maxAge: 30 * 60 * 1000},//{maxAge:24*60*60*1000},
    resave: false,
    //rolling: true,
    saveUninitialized: true
  }))

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: IN_PROD ? false : {
      settings: {
        'request.credentials': 'include'
      }
    },
    context: ({ req, res }) => ({ req, res })
  })
  server.applyMiddleware({app, cors: true})
  app.listen({port: APP_PORT}, () => {
      console.log(`http://localhost:${APP_PORT}${server.graphqlPath}`)
    }
  )
})
