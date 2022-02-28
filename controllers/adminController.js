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
            schoolN = await School.find({school: schoolS}, {_id: 0, string: 1})
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

    let newSchool;
    if (name !== "" && postCode !== "" && numberOfIDs !== "") {
        let existSchool = await School.find({ 'postCode': postCode, 'school': name }).lean()
        console.log(existSchool)

        // generate ids
        let ids = []
        for (let step = 0; step < numberOfIDs; step++) {
            let newId = Math.floor(10000 + Math.random() * 90000);
            ids.push(newId)
        }

        if(existSchool.length == 0){
            // save into mongodb
            newSchool = new School({school: name, string: uuidv4(), postCode: postCode, ids: ids})
            // Save the new model instance, passing a callback
            await newSchool.save();
        }
        else{
            let schols = await School.find({ 'postCode': postCode, 'school': name }).lean()
            for (const el of schols[0].ids){
                ids.push(el)
            }
            console.log(ids)
            await School.updateOne({ 'postCode': postCode, 'school': name },{ $set: { ids: ids}})
        }

        // download
        // find all schools with the postCode
        let schools = await School.find({ 'postCode': postCode, 'school': name }).lean()

        let text = "School: " + schools[0].school
        text += "\nPostcode: " + schools[0].postCode
        text += "\nAccess string: " + schools[0].string
        text += "\nIDs: " + schools[0].ids

        res.attachment(schools[0].school + ".txt");
        res.type("txt")
        return res.send(text);

    } else {
        console.log("sss");
        req.flash('message', "please input school name or string!")
        res.redirect("/admin/home");
    }
}


// OLD
module.exports.generateNewString = async function (string) {
    let data;
    let new_data;
    try {
        data = await fs.readFile("data.json");
        data = JSON.parse(data);
        // deep copy
        new_data = JSON.parse(JSON.stringify(data));
    } catch (err) {
        return {succeed: false, message: err}
    }

    for (let i of new_data.admins){
        i["string"] = string
    }

    // new_data.admins.push({"string": string})

    try {
        await fs.writeFile("data.json", JSON.stringify(new_data));
    } catch (err) {
        await fs.writeFile("data.json", JSON.stringify(data));
        return {succeed:false, message:err}
    }
    return {succeed:true}

}