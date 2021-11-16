const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static("client"));
app.use(bodyParser.json());

var data = require("./data.json");
var data = require("./schools.json");

app.listen(888);

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