'use strict';

const express = require('express');

import { ApolloServer } from 'apollo-server-express'
import typeDefs from './typeDefs'
import resolvers from './resolvers'

(async () => {
  const APP_PORT = 3000
  try {
    /* await mongoose.connect(
       `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
       { useNewUrlParser: true }
     )*/
    const app = express()

    app.disable('x-powered-by')

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      playground: true
    })

    server.applyMiddleware({ app })

    app.listen({ port: APP_PORT }, () =>
      console.log(`http://localhost:${APP_PORT}${server.graphqlPath}`)
    )
  } catch (e) {
    console.error(e)
  }
})()