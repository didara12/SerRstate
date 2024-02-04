const mongoose = require('mongoose')


mongoose.connect("mongodb://localhost:27017/Rstate")

const userShema = new mongoose.Schema({
    username: "String",
    email: "String",
    password:"string"
})

const googleUserShema = new mongoose.Schema({
  _id:"string",
  username: "String",
  email: "String",
  photo:"String"
})


const Real_state_Shema = new mongoose.Schema({
    type: String,
    name: String,
    location: {
      city: String,
      neighborhood: String,
      country: String,
      zipcode: String
    },
    features: {
      bedrooms: Number,
      bathrooms: Number,
      garages: Number,
      area: String,
      lotSize: String,
      floors: Number,
      swimmingPool: Boolean,
      garden: Boolean,
      balcony: Boolean
    },
    description: String,
    price: {
      amount: Number,
      currency: String
    },
    additionalInfo: {
      yearBuilt: Number,
      renovationYear: Number,
      heating: String,
      cooling: String,
      securitySystem: Boolean
    },
    images: [],
    contact: {
      agent: String,
      email: String,
      phone: String
    },
    uid: String
})



const users = mongoose.model("users", userShema)
const Real_state = mongoose.model("Real_state", Real_state_Shema)
const googleUser = mongoose.model("googleUser", googleUserShema)

module.exports = {users , Real_state, googleUser}