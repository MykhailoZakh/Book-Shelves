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

export const QUERY_USERS = gql`
query FindUser($username: String!) {
  user1(username: $username) {
    username
    email
    _id
    savedBooks {
      _id
      description
      bookId
      image
      link
      title
      authors
    }
  }
}
`