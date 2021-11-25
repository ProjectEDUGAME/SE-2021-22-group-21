const express = require('express');
const bodyParser = require('body-parser');

// Starts a server
const app = express();

app.use(express.static("client"));
app.use(bodyParser.json());


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

modules.exports = app;