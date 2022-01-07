const express = require('express');
const bodyParser = require('body-parser');

// Mongoose object created to connect to the database
const mongoose = require("mongoose");
// For testing
// Access the data.js file
const User = require("./models/data")

// Starts a server
const app = express();

// MongoDB (using collections (tables) and documents (containing JSON data - rows and columns))
// Connects to the cloud database (MongoDB)
const dbLink = "mongodb+srv://se21:kkmjssymhh2000@edugame.fvs2e.mongodb.net/edugame-database?retryWrites=true&w=majority";
// Mongoose connects to the MongoDB database, and displays an error if one occurs. It listens for requests only when connected to the database
mongoose.connect(dbLink, {useNewUrlParser: true, useUnifiedTopology: true} /* Removes command line warning print */)
    .then((result) => /*console.log("Poggers! You've connected to the database")*/ app.listen(888))
    .catch((err) => console.log(err));

app.use(express.static("client"));
app.use(bodyParser.json());









// Database get requests (INCLUDING TESTING)
// Adds a new user to the collection database, with a unique ID (by MongoDB) and timestamps, for testing
// We however want this to be automatically generated once clicking (so add the click events here to add this information in)
app.get("/add-user", (req, res) => {
    const user = new User({
        user: 105,
        school: "Gr490dfsFF55aa1",
        wallColour: "#9534eb",
        chatterLevel: 4
    })
// Mongoose saves this new instance to the database
    user.save()
// Allows us to see the result in the browser, or displays an error in the console
     .then((result) => {
         res.send(result)
     })
     .catch((err) => {
         console.log(err);
     });
})
// We can check our collections on cloud.mongo.db or http://localhost:888/add-user to see that this new data is in our database


// Seeing all the users
app.get("/all-users", (req, res) => {
// Finds all the users - applied to the Users - instead of using the save instance method on a single user
    User.find()
// Same process as before, to see results or display an error
     .then((result) => {
         res.send(result)
     })
     .catch((err) => {
         console.log(err);
     });
})












// GET for login
// POST for the unique string on the admin page
// GET for event slider position and POST to update the page appropriately
// GET for the final selection
// (PS all notes as hash forgets stuff)


// Add to a text file for the meantime
const loginAttempt = [];

const schoolString = [];
const studentID = [];

const randomID = [];

// LOGIN PAGE
// When the login button is selected, send the login details as JSON to main
app.get("/login/fetch", function(req, resp){
    resp.json(loginAttempt);
});

// ADMIN PAGE
// When the generate new ID button is selected, send the school string and student ID as JSON to main
app.get("/admin/fetch", function(req, resp){
    resp.json(schoolString);
    resp.json(studentID);
});

// The unique strings for the schools are added to the app. These will match up with the school string and student ID (fetched above)
app.post("/admin/add", function(req, resp){
    const newID = request.body.newID;
    randomID.push(newID);
});

// (Similar process for other events)
app.post("/wallColor", function (req, resp){
    let wallColor = req.body;

    let id = wallColor.id; //for now, probs gonna use express-session
    let colorHex = wallColor.colorHex;

    for(let d of data){
        if(d.user == id){
            d.wall = colorHex;
        }
    }
    resp.json("done");

});

module.exports = app;




// Mongoose (allows us to create simple data models with query methods to change the database)
// Schema defines the structure of our documents (e.g. each user) within a collection (e.g. user table)