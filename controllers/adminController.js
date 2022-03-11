const {Parser} = require("json2csv");
const { v4: uuidv4 } = require('uuid');
const User = require("../models/userModel")
const School = require("../models/schoolModel")

// DOWNLOADING DATA
module.exports.downloadInstitute = async function (req, res) {
    let data;
    let schoolN = "";
    let sID = req.body.school;

    // Checks if specific school was inputed
    if (sID == ""){
        // Finds all initialized users
        data = await User.find({initialized: 1}, {_id: 0, username: 1, school: 1, wallColour: 1, bell: 1, chatter: 1})
        data = JSON.parse(JSON.stringify(data));

        // Finds school strings for every school
        for (let u of data){
            let school = await School.find({_id: u.school}, {_id: 0, accessString: 1})
            u.school = school[0].accessString;
        }
    }
    else{
        // Finds initialized users of specific school
        data = await User.find({school: sID, initialized: 1},  {_id: 0, username: 1, school: 1, wallColour: 1, bell: 1, chatter: 1})
        let school = await School.find({_id: sID}, {_id: 0, accessString: 1, name: 1})
        data = JSON.parse(JSON.stringify(data));

        // Finds school string of school
        schoolN = school[0].name
        for (let u of data){
            u.school = school[0].accessString;
        }
    }

    // Creates csv from data
    const fields = ["username", "school", "wallColour", "bell", "chatter"];

    const json2csv = new Parser({fields});
    const csv = json2csv.parse(data);


    res.header('Content-Type', 'text/csv');
    res.attachment(schoolN + "_data.csv");
    return res.send(csv);


}


// GENERATE NEW INSTITUTE
module.exports.generateInstitute = async function (req, res) {
    let name = req.body.name;
    let numberOfIDs = req.body.num;
    let  postCode = req.body.postCode;

    let school;

    // Checks if all data inputed
    if (name !== "" && postCode !== "" && numberOfIDs !== "") {
        // Checks if school exists
        school = await School.findOne({ 'postCode': postCode, 'name': name }).lean()

        // Generate ids and register users to db
        let users = []
        let ids = []
        let oldIds = []
        for (let step = 0; step < numberOfIDs; step++) {
            let newId = Math.floor(10000 + Math.random() * 90000);
            let newUser = await User.register({username: newId.toString(), initialized: 0}, newId.toString());
            users.push(newUser);
            ids.push(newId)
        }

        // If school not yet created
        if(!school){
            // Create access string
            let stringA = uuidv4().replace("-", "");
            let stringB = uuidv4().replace("-", "");
            string = Buffer.from(stringA, 'hex').toString('base64') + Buffer.from(stringB, 'hex').toString('base64')

            // Store school do db
            school = new School({name: name, accessString: string, postCode: postCode, ids: ids})
            await school.save();

            // Assign school to users as foreign object
            for (let u of users){
                u.school = school.id; 
                await u.save()
            }
        }
        else{
            // Get existing IDs
            for (const el of school.ids){
                oldIds.push(el)
            }
            allIds = ids.concat(oldIds)
            // Add new IDs to db
            await School.updateOne({ 'postCode': postCode, 'school': name },{ $set: { ids: allIds}})

            // Assign school to users as foreign object
            for (let u of users){
                u.school = school._id;
                await u.save()
            }
        }

        // Create txt document with all info
        let text = "School: " + school.name;
        text += "\nPostcode: " + school.postCode;
        text += "\nAccess string: " + school.accessString;
        if (oldIds.length){
            text += "\nnew IDs: " + ids;
            text += "\nold IDs: " + oldIds;

        }
        else{
            text += "\nIDs: " + school.ids;
        }

        res.attachment(school.name + ".txt");
        res.type("txt")
        return res.send(text);

    } else {
        req.flash('message', "please input school name or string!")
        res.redirect("/admin/home");
    }
}
