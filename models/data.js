// Ensures we use mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creating a new schema to describe the type of objects we want to store (the structure)
const dataSchema = new Schema({
// The unique user ID
     user: {
          type: Number,
          required: true,
          min: 1
     },
// The name of the school this pupil is at
     school: {
          type: String,
          required: true
     },
// The selected wall colour
     wallColour: {
          type: String,
          required: true
     },
// The selected chatter level
     chatterLevel: {
          type: Number,
          required: true,
          min: 1,
          max: 5
     }
// Automatically creates timestamps for each of these above
}, {timestamps: true});





// Creating the model
// Looks for "Users" in mongo.db
const Data = mongoose.model("User", dataSchema)
// Allowing us to use this model to save new user's data in our database collection
module.exports = Data;