const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static("client"));
app.use(bodyParser.json());

var data = require("./data.json");

app.listen(888);

app.get("", function (req, resp){
    
});