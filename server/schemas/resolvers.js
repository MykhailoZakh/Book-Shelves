// import User module
const { User } = require('../models');
// import auth checker to add token of signed in user
const { signToken, AuthenticationError } = require('../utils/auth');
// object with Query and Mutations we will add to our routes
const resolvers = {
    Query: {
        // query to find one user by id or username
        user: async (parent, args, context) => {
            return User.findOne({
                $or: [{ _id: args.user ? args.id : args.id }, { username: args.username }]
            })
        }
    },

    Mutation: {
        // mutation to create new user and add jwt token for authorization
        createUser: async (parent, args) => {
            const user = await User.create({ username: args.username, email: args.email, password: args.password });
            if (!user) {
                return alert(`Cannot create user`)
            }
            const token = signToken(user);
            return { token, user };
        },
        // mutation to check user who wants to log in and add token if he is valid
        login: async (parent, args) => {
            const user = await User.findOne({ $or: [{ username: args.username }, { email: args.email }] });
            if (!user) {
                throw AuthenticationError;
            }

            const correctPw = await user.isCorrectPassword(args.password);

            if (!correctPw) {
                throw AuthenticationError;
            }
            const token = signToken(user);
            return { token, user };
        },
        // mutation to saveBook to user data
        saveBook: async (parent, args, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: args._id },
                    { $addToSet: { savedBooks: args.body } },
                    { new: true, runValidators: true }
                )
            }
            throw AuthenticationError;

        },
        // mutation to deleteBook from user data
        deleteBook: async (parent, args, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: args.user._id },
                    { $pull: { savedBooks: { bookId: args.bookId } } },
                    { new: true }
                );
            }
            throw AuthenticationError;
        }

    }
}


module.exports = resolvers;