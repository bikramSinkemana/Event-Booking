
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

module.exports = {
  createUser: async (args) => {
    try {
      const userFromDB = User.findOne({
        email: args.userInput.email
      })

      if (userFromDB) {
        throw new Error("User exists already")
      }

      const hashedPassword = bcrypt
        .hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      })

      const result = user.save();

      return {
        ...result._doc, _id: result.id
      }
      
    } catch (error) {
      throw error
    }
  },
  login: async ({email, password}) => {
    const user = await User.findOne({
      email: email
    })

    if(!user){
      throw new Error('User does not exist!');
    }

    console.log('user', user)
    const isEqual = await bcrypt.compare(password, user._doc.password);

    if(!isEqual){
      throw new Error('Password is incorrect');
    }

    const token = jwt.sign({
        userId: user.id,
        email: user._doc.email
      }, 
      'somesupersecretkey', 
      {expiresIn: '1h'}
    );

    return {
      userId: user.id,
      token: token,
      tokenExpiration: 1
    }
  }
  
}