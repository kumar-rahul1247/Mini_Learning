const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require('../Middleware/requireLogin');
const Course = mongoose.model('Course');
const User = mongoose.model('User');

router.post('/createcourse', requireLogin, (req, res) => {

    const { title, desc } = req.body;
    console.log(title, desc)
    if (!title || !desc) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    console.log(req.user)

    const course = new Course({
        title,
        desc,
        photo: "https://images.unsplash.com/photo-1572276643543-90ec6f977376?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        postedBy: req.user._id
    });

    course.save()
        .then(result => {
            res.status(200).json({ course: result })
        })
        .catch(err => {
            console.log("Error " + err.message)
        })

})

router.get('/allcourse', requireLogin, (req, res) => {
    Course.find()
        .populate("postedBy", "_id name")
        .sort('-createdAt')
        .then(courses => {
            console.log(courses)
            res.json({ courses })
        })
        .catch(err => {
            console.log("Error : " + err.message)
        })

})

router.get('/mycourse', requireLogin, (req, res) => {
    console.log(req.user)
    Course.find({ postedBy: req.user._id })
        .populate("postedBy", "_id email role name")
        .sort('-createdAt')
        .then(mycourse => {
            console.log("MyC COURSE-----------------")
            console.log(mycourse);
            res.json({ mycourse })
        })
        .catch(err => {
            console.log("error: " + err.message)
            res.status(422).json({ error: err.message })
        })
})

router.put('/subscribe', requireLogin, (req, res) => {
    console.log(req.user._id)
    Course.findByIdAndUpdate(req.body.courseId, {
        $push: { subsuser: req.user._id }
    }, {
        new: true
    }, (err, courseresult) => {
        if (err) {
            return res.status(422).json({ error: err })
        }

        User.findByIdAndUpdate(req.user._id, {
            $push: { subcourse: req.body.courseId }
        }, {
            new: true
        })
            .populate("subcourse", "_id title desc photo postedBy")
            .populate("subcourse.postedBy", "name")
            .select("-password")
            .then(resultuser => {
                res.json({ userData: resultuser, updatedcourse: courseresult })
            })
            .catch(err => {
                return res.status(200).json({ error: err })
            })
    }

    )
})

router.put('/unsubscribe', requireLogin, (req, res) => {
    console.log(req.user._id)
    Course.findByIdAndUpdate(req.body.courseId, {
        $pull: { subsuser: req.user._id }
    }, {
        new: true
    }, (err, courseresult) => {
        if (err) {
            return res.status(422).json({ error: err })
        }

        User.findByIdAndUpdate(req.user._id, {
            $pull: { subcourse: req.body.courseId }
        }, {
            new: true
        })
            .populate("subcourse", "_id title desc photo postedBy")
            .populate("subcourse.postedBy", "name")
            .select("-password")
            .then(resultuser => {
                res.json({ userData: resultuser, updatedcourse: courseresult })
            })
            .catch(err => {
                return res.status(200).json({ error: err })
            })
    }

    )
})

router.put('/updatecourse', requireLogin, (req, res) => {
    console.log("I am here----------------------------------------")
    console.log(req.body._id)
    Course.findOne({_id: req.body._id})
            .then(course =>{
                course.title = req.body.title;
                course.desc = req.body.desc;

                course.save()
                .then( saveduser => {
                    res.json({message: "updated successfully.."});
                })
                .catch( err => {
                    console.log(err);
                    res.json({message: "Something Wrong.."});
                })

            })
            .catch(()=>{
                res.json({message: "Something Wrong.."});
            })
})


router.delete('/delete/:courseId', requireLogin, (req, res) => {


            Course.findOne({ _id: req.params.courseId })
                    .then((course) => {
                        course.remove()
                            .then(result => {
                                console.log("Deleted Successfully")
                                res.status(200).json(result);

                            })
                            .catch(error => {
                                console.log(error)
                                res.status(444).json("Something went wrong");
                            })
                    })
                    .catch((err)=>{
                        res.status(444).json("Something went wrong");
                    })
                    
                 
        })
        
 


module.exports = router