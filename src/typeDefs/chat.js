import { gql } from 'apollo-server-express'

export default gql`
    extend type Mutation {
        startChat(title: String, userIds: [ID!]!): Chat @auth
    }
    type Chat {
        id: ID!
        title: String!
        users: [User!]!
        lastMessage: Message
        createdAt: String!
        updateAt: String!
    }
`
