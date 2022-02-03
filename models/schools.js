// Ensures we use mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creating a new schema to describe the type of objects we want to store (the structure)
const schoolSchema = new Schema({

// The name of the school this pupil is at
     school: {
          type: String,
          required: true
     },
// The unique string required to access the webapp
     string: {
          type: String,
          required: true
     }
// Automatically creates timestamps for each of these above
}, {timestamps: true});





// Creating the model
// Looks for "Schools" in mongo.db
const School = mongoose.model("School", schoolSchema)
// Allowing us to use this model to save new user's data in our database collection
module.exports = School;