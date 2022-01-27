const buffer = require("buffer");
const {json} = require("express");
const fs = require('fs').promises;
const {Parser} = require("json2csv");

// Access the data.js and school.js files
const User = require("../models/data")
const School = require("../models/schools")


module.exports.findInstituteByString = async function (string) {
    let data;

//    try {
//        data = await fs.readFile("school.json");
//        data = JSON.parse(data);
//    } catch (err) {
//        return {succeed: false, message: err}
//    }

    // find school with string
    const result = await School.find(
        {"string": string}
    );
    //const result = data.filter(school => school.string === string)

    if (result.length > 0) {    // if succeed, return to admin home page
        return {succeed: true, data: result[0]}
    }else{
        return {succeed: false, message: "Whoops, We can not find such string!"}

    }
}

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

module.exports.downloadInstitute = async function (req, res) {
    let data;
    try {
        data = await fs.readFile("school.json");
        data = JSON.parse(data);
    } catch (err) {
        return {succeed: false, message: err}
    }

    const json2csv = new Parser();
    const csv = json2csv.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment("schools.csv");
    return res.send(csv);

}

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