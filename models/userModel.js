// Ensures we use mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// Creating a new schema to describe the type of objects we want to store (the structure)
const userSchema = new Schema({
// The unique user ID
     username : {type: String, unique: true, required:true},

// The selected wall colour
     wallColour: {
          type: String,
     },
// The selected chatter level
     bell: {
          type: Number,
               min: 0,
          max: 5
     },
     // email: {type: String},
     school : { type: Schema.Types.ObjectId, ref: 'School' }
// Automatically creates timestamps for each of these above
}, {timestamps: true});


userSchema.plugin(passportLocalMongoose);

// Creating the model
// Looks for "Users" in mongo.db
const User = mongoose.model("User", userSchema)


// Allowing us to use this model to save new user's data in our database collection
module.exports = User;