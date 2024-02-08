// import User module
const { User } = require('../models');
// import auth checker to add token of signed in user
const { signToken, AuthenticationError } = require('../utils/auth');
// object with Query and Mutations we will add to our routes

const resolvers = {
  Query: {
    // query to find one user by id or username

    user: async (parent, { username, id }) => {
      return User.findOne({ $or: [{ _id: id }, { username: username }] });
    },

  },

  Mutation: {
    // mutation to create new user and add jwt token for authorization

    createUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      if (!user) {
        return alert(`Cannot create user`)
      }
      const token = signToken(user);

      return { token, user };
    },
    // mutation to check user who wants to log in and add token if he is valid

    login: async (parent, { email, password, username }) => {
      const user = await User.findOne({ $or: [{ username: username }, { email: email }] });

      if (!user) {
        throw AuthenticationError;
      }
      // console.log(user);
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        console.log(`work here`)
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },
    // mutation to saveBook to user data
    saveBook: async (parent, { _id, description, bookId, image, link, title }, context) => {
      // if (context.user) {
      // console.log(args)
      // const newBook = {
      //   description: description,
      //   bookId: bookId,
      //   image: image,
      //   link: link,
      //   title: title,
      //   authors: [{
      //     type: author
      //   }]
      // }
      // { description, bookId, image, link, title }
      return User.findOneAndUpdate(
        { _id: _id },
        { $addToSet: { savedBooks: { description, bookId, image, link, title } } },
        { new: true, runValidators: true }
      )
      // }
      throw AuthenticationError;

    },
    // mutation to deleteBook from user data
    deleteBook: async (parent, { _id, bookId }, context) => {
      // if (context.user) {
      return User.findOneAndUpdate(
        { _id: _id },
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true }
      );
      // }
      throw AuthenticationError;
    }
  }
};

module.exports = resolvers;
