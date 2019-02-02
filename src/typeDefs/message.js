import { gql } from 'apollo-server-express'

export default gql`    
    type Message {
        id: ID!
        sender: User!
        chat: Chat!
        createdAt: String!
        updateAt: String!
    }
`
