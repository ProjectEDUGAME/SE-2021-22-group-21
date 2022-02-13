// Ensures we use mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Access bcrypt for hashing
const bcrypt = require("bcrypt");

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


// Hashing function run before saving to the dabase
schoolSchema.pre("save", async function (next){
// Creates a salt (a consistent string added to the front of a password) before hashing     
     const salt = await bcrypt.genSalt();
     this.string = await bcrypt.hash(this.string, salt);
     next();
});


// Creating the model
// Looks for "Schools" in mongo.db
const School = mongoose.model("School", schoolSchema)
// Allowing us to use this model to save new user's data in our database collection
module.exports = School;