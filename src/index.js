import express from 'express'
import session from 'express-session'
import { bucket, ottoman } from './db'
import { ApolloServer } from 'apollo-server-express'
import typeDefs from './typeDefs'
import resolvers from './resolvers'
import schemaDirectives from './directives'

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
    cookie: {
      maxAge: 15 * 60 * 1000,
      sameSite: true,
      secure: false //true if https server
    },
    resave: true,
    rolling: true,
    saveUninitialized: false
  }))

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives,
    playground: IN_PROD ? false : {
      settings: {
        'request.credentials': 'include'
      }
    },
    context: ({req, res}) => ({req, res})
  })
  server.applyMiddleware({app, cors: false})
  app.listen({port: APP_PORT}, () => {
    /* ottoman.ensureIndices(function (err) {
       if (err) {
         return console.error('Error ensure indices places!', err)
       }
       console.log('Ensure indices places!')
       bucket.manager().buildDeferredIndexes(function (err) {
         if (err) {
           return console.error('Error build indexes', err)
         }
         console.log('Built indexes!')
       })
     })*/
    console.log(`http://localhost:${APP_PORT}${server.graphqlPath}`)
  })
})
