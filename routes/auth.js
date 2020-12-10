const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');

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

            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if(doMatch){
                        //res.json({message: "successfully signed in"})
                        
                        const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
                        const {_id, name, email, role, subcourse } = savedUser;

                       
                        res.json({
                                token, 
                                user: { _id, email, name, role, subcourse}
                            });
                    }
                    else {
                        return res.status(422).json({error: "Invalid Email or password"})
                    }
                })
                .catch(err => {
                    console.log("bycrypt....")
                    return res.status(422).json({error: err})
                    console.log(err);
                })
        })
        .catch(err => {
            console.log("find....")
            return res.status(422).json({error: err})
            console.log(err);
        })
})


module.exports = router