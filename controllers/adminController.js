const buffer = require("buffer");
const {json} = require("express");
const fs = require('fs').promises;
const {Parser} = require("json2csv");

// Access the data.js and school.js files
const User = require("../models/data");
const School = require("../models/schools");
//var salt = sessionStorage.getItem("salt");
const bcrypt = require("bcrypt");


//module.exports.findInstituteByString = async function (string) {
//    let data;
//    try {
//        data = await fs.readFile("school.json");
//        data = JSON.parse(data);
//    } catch (err) {
//        return {succeed: false, message: err}
//    }

    // find school with string
//    const result = data.filter(school => school.string === string)
/*     string = await bcrypt.hash(string.toString(), global.salt);
    console.log(string); */

//    const result = await School.find(
//       {"string": string}
//    );

//    if (result.length > 0) {    // if succeed, return to admin home page
//        return {succeed: true, data: result[0]}
//    }else{
//        return {succeed: false, message: "Whoops, We can not find such string!"}

//    }
//}


module.exports.readInstitute = async function () {
    let data;
    try {
        data = await fs.readFile("school.json");
        data = JSON.parse(data);
        return {succeed: true, data: data}
    } catch (err) {
        return {succeed: false, message: err}
    }

}

module.exports.addInstitute = async function (school) {
    let data;
    let new_data;
    try {
        data = await fs.readFile("school.json");
        data = JSON.parse(data);
        // deep copy
        new_data = JSON.parse(JSON.stringify(data));

    } catch (err) {
        return {succeed:false, message:err}
    }

    new_data.push(school);
    try {
        await fs.writeFile("school.json", JSON.stringify(new_data));
    } catch (err) {
        await fs.writeFile("school.json", JSON.stringify(data));
        return {succeed:false, message:err}
    }
    return {succeed:true, message:"add succeed!"}
}

module.exports.deleteInstitute =  async function (string) {
    let new_data;
    let data;
    try {
        data = await fs.readFile("school.json");
        data = JSON.parse(data);
        // deep copy
        new_data = JSON.parse(JSON.stringify(data));
    } catch (err) {
        return {succeed:false, message:err}
    }

    const result = new_data.filter(school => school.string !== string)


    try {
        await fs.writeFile("school.json", JSON.stringify(result));
    } catch (err) {
        await fs.writeFile("school.json", JSON.stringify(data));

        return {succeed:false, message:err}
    }
    return {succeed:true}
}

module.exports.updateInstitute =  async function (newData) {
    let new_data;
    let data;
    try {
        data = await fs.readFile("school.json");
        data = JSON.parse(data);
        // deep copy
        new_data = JSON.parse(JSON.stringify(data));
    } catch (err) {
        return {succeed:false, message:err}
    }

    const result = new_data.map(function (item) {
        if (item.string === newData.string){
            item.school = newData.school;
        }
        return item;
    })

    try {
        await fs.writeFile("school.json", JSON.stringify(result));
    } catch (err) {
        await fs.writeFile("school.json", JSON.stringify(data));
        return {succeed:false, message:err}
    }
    return {succeed:true}
}

//downloads and returns csv with data from school
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



// Input a password, hash it and set this as the new password
// The password is the string that belongs to "schools"
// find the current access string, change this to what is inputted

module.exports.generateNewString = async function (string, string2) {
/*     let data;
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
    return {succeed:true} */

    // Find the original admin string
    // Replace with the input
    //string = await bcrypt.hash(string.toString(), global.salt);
    //string2 = await bcrypt.hash(string.toString(), global.salt);

    try {
        await School.findOneAndUpdate({
            "string": string2
        }, {
            "string": string
        })
    } catch (err) {
        return {succeed:false, message:err}
    }
    return {succeed:true}

}