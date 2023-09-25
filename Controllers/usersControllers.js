const users = require("../models/usersSchema");
const moment = require("moment");
const csv = require("fast-csv");
const fs = require("fs");
const BASE_URL = process.env.BASE_URL

// register user
exports.userpost = async (req, res) => {
    const file = req.file.filename;
    const { fname, resourcename,practicelead,practice,mentorname,releasedfrom,
        availablefrom,projectbenchreleasedate,aging,qualification,
        coe,skills,yearsofexp,doj,
      
        email, 
          mobile, gender,
         location, status } = req.body;

    if (!fname ||  !resourcename || !practicelead || !practice || !mentorname||
         !releasedfrom || !availablefrom || !projectbenchreleasedate|| !aging|| 
         !qualification||  !coe ||  !skills|| !yearsofexp||  !doj||

        !email || 
           !mobile || !gender ||
          !location || !status || !file) {
        res.status(401).json("All Inputs is required")
    }

    try {
        const preuser = await users.findOne({ email: email });

        if (preuser) {
            res.status(401).json("This user already exist in our databse")
        } else {

            const datecreated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

            const userData = new users({
                fname, resourcename,practicelead,practice,mentorname,releasedfrom,
                availablefrom,projectbenchreleasedate,aging,qualification,
        coe,skills,yearsofexp,doj,

                 email,
                  mobile, gender, 
                location, status, profile: file, datecreated
            });
            await userData.save();
            res.status(200).json(userData);
        }
    } catch (error) {
        res.status(401).json(error);
        console.log("catch block error")
    }
};


// usersget
exports.userget = async (req, res) => {

    const search = req.query.search || ""
    const gender = req.query.gender || ""
    const status = req.query.status || ""
    const sort = req.query.sort || ""
    const page = req.query.page || 1
    const ITEM_PER_PAGE = 4;


    const query = {
        fname: { $regex: search, $options: "i" }
    }

    if (gender !== "All") {
        query.gender = gender
    }

    if (status !== "All") {
        query.status = status
    }

    try {

        const skip = (page - 1) * ITEM_PER_PAGE  // 1 * 4 = 4

        const count = await users.countDocuments(query);

        const usersdata = await users.find(query)
            .sort({ datecreated: sort == "new" ? -1 : 1 })
            .limit(ITEM_PER_PAGE)
            .skip(skip);

        const pageCount = Math.ceil(count/ITEM_PER_PAGE);  // 8 /4 = 2

        res.status(200).json({
            Pagination:{
                count,pageCount
            },
            usersdata
        })
    } catch (error) {
        res.status(401).json(error)
    }
}

// single user get
exports.singleuserget = async (req, res) => {

    const { id } = req.params;

    try {
        const userdata = await users.findOne({ _id: id });
        res.status(200).json(userdata)
    } catch (error) {
        res.status(401).json(error)
    }
}

// user edit
exports.useredit = async (req, res) => {
    const { id } = req.params;

    // const { fname, lname, email, mobile, gender, location, status, user_profile } = req.body;
    const { fname, resourcename,practicelead,practice,mentorname,releasedfrom,
        availablefrom,projectbenchreleasedate,aging,qualification,
        coe,skills,yearsofexp,doj,
      
        email, 
          mobile, gender,
         location, status,user_profile } = req.body;


    const file = req.file ? req.file.filename : user_profile

    const dateUpdated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

    try {
        const updateuser = await users.findByIdAndUpdate({ _id: id }, {
            fname, resourcename,practicelead,practice,mentorname,releasedfrom,
            availablefrom,projectbenchreleasedate,aging,qualification,
    coe,skills,yearsofexp,doj,

             email,
              mobile, gender, 
            location, status, profile: file, dateUpdated
            // fname, lname, email, mobile, gender, location, status, profile: file, dateUpdated
        }, {
            new: true
        });

        await updateuser.save();
        res.status(200).json(updateuser);
    } catch (error) {
        res.status(401).json(error)
    }
}

// delete user
exports.userdelete = async (req, res) => {
    const { id } = req.params;
    try {
        const deletuser = await users.findByIdAndDelete({ _id: id });
        res.status(200).json(deletuser);
    } catch (error) {
        res.status(401).json(error)
    }
}

// chnage status
exports.userstatus = async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    try {
        const userstatusupdate = await users.findByIdAndUpdate({ _id: id }, { status: data }, { new: true });
        res.status(200).json(userstatusupdate)
    } catch (error) {
        res.status(401).json(error)
    }
}

// export user
exports.userExport = async (req, res) => {
    try {
        const usersdata = await users.find();

        const csvStream = csv.format({ headers: true });

        if (!fs.existsSync("public/files/export/")) {
            if (!fs.existsSync("public/files")) {
                fs.mkdirSync("public/files/");
            }
            if (!fs.existsSync("public/files/export")) {
                fs.mkdirSync("./public/files/export/");
            }
        }

        const writablestream = fs.createWriteStream(
            "public/files/export/users.csv"
        );

        csvStream.pipe(writablestream);

        writablestream.on("finish", function () {
            res.json({
                downloadUrl: `${BASE_URL}/files/export/users.csv`,
            });
        });
        if (usersdata.length > 0) {
            usersdata.map((user) => {
                csvStream.write({
                    FirstName: user.fname ? user.fname : "-",
                    ResourceName: user.resourcename ? user.resourcename : "-",
                    
                    Practicelead: user.practicelead ? user.practicelead : "-",
                    Practice: user.practice ? user.practice : "-",
                    MentorName: user.mentorname ? user.mentorname : "-",
                    Releasedfrom: user.releasedfrom ? user.releasedfrom : "-",
                    Availablefrom: user.availablefrom ? user.availablefrom : "-",
                    Projectbenchreleasedate: user.projectbenchreleasedate ? user.projectbenchreleasedate : "-",
                    Aging: user.aging ? user.aging : "-",
                    
                    Qualification: user.qualification ? user.qualification : "-",
                    Coe: user.coe ? user.coe : "-",
                    Skills: user.skills ? user.skills : "-",
                    Yearsofexp: user.yearsofexp ? user.yearsofexp : "-",
                    Doj: user.doj ? user.doj : "-",



                    Email: user.email ? user.email : "-",
                    Phone: user.mobile ? user.mobile : "-",
                    Gender: user.gender ? user.gender : "-",
                    Status: user.status ? user.status : "-",
                    Profile: user.profile ? user.profile : "-",
                    Location: user.location ? user.location : "-",
                    DateCreated: user.datecreated ? user.datecreated : "-",
                    DateUpdated: user.dateUpdated ? user.dateUpdated : "-",
                })
            })
        }
        csvStream.end();
        writablestream.end();

    } catch (error) {
        res.status(401).json(error)
    }
}