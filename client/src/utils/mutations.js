import { gql } from '@apollo/client';
// exporting graphql mutations to use them in front end

export const LOGIN_USER = gql`
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      _id
      username
      email
    }
  }
}
  `;

export const ADD_USER = gql`
mutation CreateUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      token
      user {
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
        }
      }
    }
  }
  `;

export const SAVE_BOOK = gql`
mutation AddBook($id: ID!, $description: String, $bookId: String, $image: String, $link: String, $title: String, $authors: [String]) {
  saveBook(_id: $id, description: $description, bookId: $bookId, image: $image, link: $link, title: $title, authors: $authors) {
    _id
    username
    email
    password
    savedBooks {
      _id
      authors
      description
      bookId
      image
      link
      title
    }
  }
}
`;

export const DELETE_BOOK = gql`
mutation DeleteBook($id: ID!, $bookId: ID!) {
    deleteBook(_id: $id, bookId: $bookId) {
      savedBooks {
        _id
        description
        bookId
        image
        link
        title
      }
      _id
      username
    }
  }
`