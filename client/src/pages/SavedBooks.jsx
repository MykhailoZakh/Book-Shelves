import {useState, useEffect} from "react";
import {Navigate, useParams} from "react-router-dom";
import {Container, Card, Button, Row, Col} from "react-bootstrap";

import {useMutation, useQuery} from "@apollo/client";
import {DELETE_BOOK} from "../utils/mutations";
import {QUERY_USER, QUERY_USERS} from "../utils/queriess";
import Auth from "../utils/auth";
import {removeBookId} from "../utils/localStorage";
import auth from "../utils/auth";

const SavedBooks = () => {
  const [deleteBook, {error}] = useMutation(DELETE_BOOK, {
    refetchQueries: [QUERY_USER, "user"],
  });
  const [userData, setUserData] = useState({});
  const obj = Auth.getProfile();

  const {loading, data} = useQuery(QUERY_USERS, {
    variables: {username: obj.data.username},
  });
  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const {data} = await deleteBook({
        variables: {id: Auth.getProfile().data._id, bookId: bookId},
      });

      if (!data) {
        throw new Error("something went wrong!");
      }

      // // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {data.user1.savedBooks.length
            ? `Viewing ${data.user1.savedBooks.length} saved ${
                data.user1.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <Row>
          {data.user1.savedBooks.map((book) => {
            return (
              <Col key={book.bookId} md="4">
                <Card border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
