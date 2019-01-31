import { gql } from 'apollo-server-express'

export default gql`    
    type Chat {
        id: ID!
        user: User!
        createdAt: String!
    }
`
