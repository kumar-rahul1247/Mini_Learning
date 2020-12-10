import React, { useEffect, useState, useContext } from 'react'
import './Profile.css'
import {connect} from 'react-redux';
import NoPic from '../../StaticImage/noProfilePic.jpg'
import Spinner from '../Spinner/spinner';
import CourseCard from '../course/Course'
import { setUser } from '../../redux/actions/authAction'


function Profile({loggedInuser, dispatchUser}) {
   
    const [error, setError] = useState("");
    const [course, setCourse] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        
        if(loggedInuser.user.role==='FAC'){
            uploadedCourse();
        
        }
            
    }, [] )


    let uploadedCourse = () => {
        fetch('/mycourse', {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + loggedInuser.token
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                console.log("DNAGER===========================")
                setIsLoading(false)
                if (data.error) {
                    setError({ error: data.error })
                }
                else {
                    setCourse(data.mycourse);
                  console.log(data)
                }

            })
            .catch(err => {
                setIsLoading(false);
                setError("Unable to Fetch Courses. Something went Wrong")
                console.log(err.message)
            })

    }


    let unSubscribeCourse = (courseId) => {
        fetch('/unsubscribe', {
            method: "put",
            headers: {
                "Authorization": "Bearer "+loggedInuser.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                courseId: courseId
            })
        
        })
        .then( res => res.json())
        .then( data => {
            
            console.log(data)

            
            //console.log(newCourse)
            console.log("--------------$$$$$$$$$$$$$$$$$$$$$--------")
            console.log(setUser({...loggedInuser,user:data.userData}))
            dispatchUser({...loggedInuser,user:data.userData});
            
        })
    }

    let allcourses=null;
    if(loggedInuser.user.role==='FAC'){
        allcourses= !course.length ? "No Course Found.. :-(" :
                        course.map(item => (
                                <CourseCard key = {item._id} item={item} role="FAC" />
                            ))
    }
    else{
        allcourses= !loggedInuser.user.subcourse.length ? "No Course Found.. :-(" :
                        loggedInuser.user.subcourse.map(item => (
                                <CourseCard key = {item._id} item={item} role="STD" onHandler={unSubscribeCourse}/>
                            ))
    }
    return (<>
            {
                !loggedInuser ? <><h2 style={{ textDecoration: "none", margin: "150px auto" }}> Loading.....!! </h2><Spinner /></> : (

                    <div className="profile__container">
                        <div className="profile__upper">
                            <div className="profile__image">

                                <img className="image"
                                    src={NoPic}
                                    alt="RK"
                                />

                            </div>

                            <div className="profile__content">
                                <h2>{loggedInuser ? loggedInuser.user.name : null}</h2>
                                <h4 style={{ fontWeight: 500, fontSize: "16px" }}>{loggedInuser && loggedInuser.user.email}</h4>
                                {loggedInuser.user.role==='STD'? <p>STUDENT</p> : <p>FACULTY</p>}
                                <div className="profile__summary">
                                    {
                                        loggedInuser.user.role==='STD' ?
                                            <h5>{loggedInuser.user.subcourse.length} Course Subscribed</h5> :
                                            <h5>{course.length} Course Posted</h5>
                                    }
                                    
                                </div>
                            </div>
                        </div>

                        <div className="profile__gallery">
                            {error ? <p className="ErrorMessage">{error}</p> :null }

                            {allcourses}

                            {/* <img  className="item" src="https://images.unsplash.com/photo-1572276643543-90ec6f977376?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" alt=""/>
                            <img  className="item" src="https://images.unsplash.com/photo-1567267020524-07219c353d4a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" alt=""/>
                            <img  className="item" src="https://images.unsplash.com/photo-1568207182762-8838beec7dca?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" alt=""/>
                            <img  className="item" src="https://images.unsplash.com/photo-1578553951253-48c6eb50ae41?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" alt=""/>
                            <img  className="item" src="https://images.unsplash.com/photo-1549276755-bdd15cddcfbf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" alt=""/>
                            <img  className="item" src="https://images.unsplash.com/photo-1596126753378-b077b0913842?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" alt=""/> */}
                        </div>
                    </div>
                )}
        </>
    )
}

let mapStateToProps = state => {
    return {
        loggedInuser: state
    }
}

const mapDispatchToProps = dispatch =>{
    return {
        dispatchUser: (data) => dispatch(setUser(data))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Profile)
