const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model('User');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');

//  router.get('/', (req, res)=>{
//      res.send("hello-->")
//  })


router.post('/signup', (req, res) => {
    console.log("Signup")
    let { name, email, password, role } = req.body;
    if (!role) {
        role = "STD"
    }
    console.log(req.body)

    if (!email || !password || !name) {
        return res.status(422).json({ error: "please add all fields" })
    }

    User.findOne({ email: email })
        .then((alreadyUser) => {
            console.log(alreadyUser)
            if (alreadyUser) {
                return res.status(422).json({ error: "user already exists with this email" })
            }

            bcrypt.hash(password, 12)
                .then(hashedpassword => {

                    const user = new User({
                        email,
                        password: hashedpassword,
                        name,
                        role
                    })

                    user.save()
                        .then(user => {
                            res.status(200).json({ message: "saved successfully" });
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(422).json({ message: "something went wrong" });
                        })
                })


        })



})


router.post('/signin', (req, res) => {
    const {email, password} = req.body
    console.log("I am SignIn")
    if(!email || !password) {
        return res.status(422).json({error: "please add email or password"})
    }
    console.log("hi ")
    User.findOne({email:email})
        .populate("subcourse", "title desc photo postedBy")    
        .then( savedUser => {
            if(!savedUser) {
                return res.status(422).json({error: "Invalid Email or password"});
            }

            console.log("----------------- ONE 0 -------------------------")
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if(doMatch){
                        //res.json({message: "successfully signed in"})
                        console.log("----------------- ONE 1 -------------------------")
                        const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
                        console.log("----------------- ONE 2 -------------------------")
                        const {_id, name, email, role, subcourse } = savedUser;
                        console.log("----------------- ONE 3 -------------------------")

                       
                        res.json({
                                token, 
                                user: { _id, email, name, role, subcourse}
                            });
                        console.log("----------------- ONE 4 -------------------------")
                    }
                    else {
                        return res.status(422).json({error: "Invalid Email or password"})
                    }
                })
                .catch(err => {
                    console.log("bycrypt....")
                    return res.status(422).json({error: err,message:"bycrypt"})
                    console.log(err);
                })
        })
        .catch(err => {
            console.log("find....")
            return res.status(422).json({error: err, message:"bycrypt"})
            console.log(err);
        })
})


module.exports = router