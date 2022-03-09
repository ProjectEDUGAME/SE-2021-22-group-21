const buffer = require("buffer");
const {json} = require("express");
const fs = require('fs').promises;
const {Parser} = require("json2csv");
const { v4: uuidv4 } = require('uuid');

// Access the data.js and school.js files
const User = require("../models/userModel")
const School = require("../models/schoolModel")
//var salt = sessionStorage.getItem("salt");
const bcrypt = require("bcrypt");

module.exports.downloadInstitute = async function (req, res) {
    let data;
    let schoolS = req.body.schooldl;
    let schoolN;

    if (schoolS == ""){
        try {
            data = await User.find({}, {_id: 0, user: 1, school: 1, wallColour: 1, bell: 1})
            console.log(data)

        } catch (err) {
            return {succeed: false, message: err}
        }
    }
    else{
        try {
            schoolN = await School.find({name: schoolS}, {_id: 0, string: 1})
            console.log(schoolN[0].string)

        } catch (err) {
            return {succeed: false, message: err}
        }

        try {
            data = await User.find({school: schoolN[0].string}, {_id: 0, user: 1, school: 1, wallColour: 1, bell: 1})
            console.log(data)

        } catch (err) {
            return {succeed: false, message: err}
        }
    }

    const fields = ["user", "school", "wallColour", "bell"];

    const json2csv = new Parser({fields});
    const csv = json2csv.parse(data);


    res.header('Content-Type', 'text/csv');
    res.attachment(schoolS + "_data.csv");
    return res.send(csv);


}

module.exports.generateInstitute = async function (req, res) {
    let name = req.body.name;
    let numberOfIDs = req.body.num;
    let  postCode = req.body.postCode;

    let school;
    if (name !== "" && postCode !== "" && numberOfIDs !== "") {
        school = await School.findOne({ 'postCode': postCode, 'name': name }).lean()

        // generate ids
        let users = []
        for (let step = 0; step < numberOfIDs; step++) {
            let newId = Math.floor(10000 + Math.random() * 90000);
            // ids.push(newId)
            let newUser = await User.register({email: newId.toString() + "@test.com", username: newId.toString()}, newId.toString());
            users.push(newUser);
        }

        if(!school){
            // save into mongodb
            school = new School({name: name, accessString: uuidv4(), postCode: postCode})
            // Save the new model instance, passing a callback
            await school.save();
        }

        for (let u of users){
            u.school = school.id;  // assign foreign object id to user object
            await u.save()
        }


        // download
        let text = "School: " + school.name;
        text += "\nPostcode: " + school.postCode;
        text += "\nAccess string: " + school.accessString;
        text += "\nIDs: ";
        for (let u of users){
            text += u.username + " ";
        }

        res.attachment(school.name + ".txt");
        res.type("txt")
        return res.send(text);

    } else {
        req.flash('message', "please input school name or string!")
        res.redirect("/admin/home");
    }
}

module.exports.generateNewString = async function (string, string2) {
        let result = false;
        const doc = await School.distinct("string");
        for (const string of doc) {
            const final = await bcrypt.compare(string2, string)
            if (final == true){
                result = true;
                hashed_string = string;
            }
        };

        salt = await bcrypt.genSalt();
        const new_hashed_string = await bcrypt.hash(string, salt);
        console.log(string, string2, new_hashed_string, hashed_string);

        try {
            await School.findOneAndUpdate({
                "string": hashed_string
            }, {
                "string": new_hashed_string
            })
        } catch (err) {
            return {succeed:false, message:err}
        }
        return {succeed:true}

}

// OLD
// module.exports.generateNewString = async function (string) {
//     let data;
//     let new_data;
//     try {
//         data = await fs.readFile("data.json");
//         data = JSON.parse(data);
//         // deep copy
//         new_data = JSON.parse(JSON.stringify(data));
//     } catch (err) {
//         return {succeed: false, message: err}
//     }

//     for (let i of new_data.admins){
//         i["string"] = string
//     }

//     // new_data.admins.push({"string": string})

//     try {
//         await fs.writeFile("data.json", JSON.stringify(new_data));
//     } catch (err) {
//         await fs.writeFile("data.json", JSON.stringify(data));
//         return {succeed:false, message:err}
//     }
//     return {succeed:true}

// }