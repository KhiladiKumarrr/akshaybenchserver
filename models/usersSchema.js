const mongoose = require("mongoose");
const validator = require("validator");

const usersSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true
    },
    resourcename: {
        type: String,
        required: true,
        trim: true
    },

    

    practicelead: {
        type: String,
        required: true,
        trim: true
    },
    practice: {
        type: String,
        required: true,
        trim: true
    },
    mentorname: {
        type: String,
        required: true,
        trim: true
    },
    releasedfrom: {
        type: String,
        required: true,
        trim: true
    },
    availablefrom: {
        type: String,
        required: true,
        trim: true
    },
    projectbenchreleasedate: {
        type: String,
        required: true,
        trim: true
    },
    aging :{
        type: String,
        required: true,
        trim: true
    },
    qualification :{
        type: String,
        required: true,
        trim: true
    },



    coe :{
        type: String,
        required: true,
        trim: true
    }, 
    skills :{
        type: String,
        required: true,
        trim: true
    },
    yearsofexp :{
        type: String,
        required: true,
        trim: true
    },
     doj :{
        type: String,
        required: true,
        trim: true
    },





    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw Error("not valid email")
            }
        }
    },
    
    mobile: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 10
    },
    gender: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    profile: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    datecreated:Date,
    dateUpdated:Date
});

// model
const users = new mongoose.model("users",usersSchema);

module.exports = users;