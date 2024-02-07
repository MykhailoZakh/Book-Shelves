import { gql } from '@apollo/client';
// exporting gql query to front end
export const QUERY_USER = gql`
query GetUser($username: String!, $userId: ID!) {
    user(username: $username, id: $userId) {
      _id
      email
      username
      savedBooks {
        _id
        description
        bookId
        image
        link
        title
        authors {
          type
        }
      }
    }
  }
`