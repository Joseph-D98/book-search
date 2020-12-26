import gql from 'graphql-tag';

// route to get logged in user's info (needs the token)
// export const getMe = (token) => {
//   return fetch('/api/users/me', {
//     headers: {
//       'Content-Type': 'application/json',
//       authorization: `Bearer ${token}`,
//     },
//   });
// };

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!){
    addUser(username: $username, email: $email, password: $password){
      token
      user{
        _id
        username
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email:String!, $password: String!){
    login(email: $email, password: $password){
      token
      user{
        _id
        username
      }
    }
  }
`; 


export const SAVE_BOOK = gql`
  mutation saveBook($bookData: BookInput!){
    saveBook(bookData: $bookData){
      _id
      username
      email
      bookcount
      savedBooks{
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;

export const REMOVE_BOOK= gql`
  mutation removeBook($bookId: ID!){
    removeBook(bookId: $bookId){
      _id
      username 
      email
      bookCount
      savedBooks{
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;


// // remove saved book data for a logged in user
// export const deleteBook = (bookId, token) => {
//   return fetch(`/api/users/books/${bookId}`, {
//     method: 'DELETE',
//     headers: {
//       authorization: `Bearer ${token}`,
//     },
//   });
// };

// make a search to google books api
// https://www.googleapis.com/books/v1/volumes?q=harry+potter
export const searchGoogleBooks = (query) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};
