const { User, Book }= require('../models');
const { AuthenticationError }= require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user){
                const userData = await User.findOne({ _id: context.user._id})
                    .select('-__V -password')
                    .populate('savedBooks')
                return userData
            }
            throw new AuthenticationError('not logged in')
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);

            console.log("addUser called");
            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { email, password}) => {
            const user = await User.findOne({ email });

            if(!user){
                throw new AuthenticationError('Incorrect credentials')
            }
            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw){
                throw new AuthenticationError('Incorrect credentials')
            }
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, {bookData}, context) => {
            if (context.user){
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id},
                    { $push: { savedBooks: bookData }},
                    { new: true, runValidators:true }
                );
                return updatedUser
            }
        },
        removeBook: async (parent, {bookId}, context ) => {
            if(context.user){
                const updatedUser = await User.findOneAndUpdate(
                    { _id : context.user._id },
                    { $pull: { savedBooks: {bookId} } },
                    { new: true } 
                );
                return updatedUser
            }
            throw new AuthenticationError( 'You need to login')

        }
    }
}

module.exports = resolvers