import React, {useState, useEffect} from 'react'
import './AllCourses.css'
import {connect} from 'react-redux';
import { setUser } from '../../redux/actions/authAction'
import Spinner from '../Spinner/spinner';
import CourseRow from '../AllCourses/CourseRow';

function AllCourses({loggedInuser, dispatchUser}) {

    const [allCourse, setAllCourse] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/allcourse', {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + loggedInuser.token
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log("-------**************************")
                console.log(data);
                
                console.log("-------***********//////////////////***************")
                if (data.error) {
                    setError({ error: data.error })
                }
                else {
                    console.log(data.courses)
                    setAllCourse(data.courses);
                    setIsLoading(false)
                    
                }

            })
            .catch(err => {
                setIsLoading(false);
                setError("Unable to Fetch Courses. Something went Wrong")
                console.log(err.message)
            })

        
        
    }, []);

    let onSubscribeHandle = (courseId, operation) =>{
        if(operation === "subs")
            subscribeCourse(courseId)
        else  {
            unSubscribeCourse(courseId);
        }  
           
    }
    
    let subscribeCourse = (courseId) => {
        fetch('/subscribe', {
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
            

            let newCourse=[]

            for (const item of allCourse) {
                if(item._id !== data.updatedcourse._id){
                    newCourse.push(item)
                }
                else{
                    newCourse.push(data.updatedcourse)
                }
            }
            console.log("++++++++++++++++++++")
            console.log(newCourse)
            console.log(data.userData)
            setAllCourse(newCourse);

            dispatchUser({...loggedInuser,user:data.userData});
            //localStorage.setItem("user", JSON.stringify(data));
            // setUser(data);
           
            // setUserProfile({
            //     ...userProfile,
            //     user: {
            //         ...userProfile.user,
            //         followers: [...userProfile.user.followers, data._id]
            //     }
            // });
            // console.log(userProfile)
            console.log("After..")
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

            let newCourse=[]

            for (const item of allCourse) {
                if(item._id !== data.updatedcourse._id){
                    newCourse.push(item)
                }
                else{
                    newCourse.push(data.updatedcourse)
                }
            }
            
            console.log(newCourse)
            console.log("--------------$$$$$$$$$$$$$$$$$$$$$--------")
            console.log(setUser({...loggedInuser,user:data.userData}))
            dispatchUser({...loggedInuser,user:data.userData});
            setAllCourse(newCourse);
            //localStorage.setItem("user", JSON.stringify(data));
            // setUser(data);
           
            // setUserProfile({
            //     ...userProfile,
            //     user: {
            //         ...userProfile.user,
            //         followers: [...userProfile.user.followers, data._id]
            //     }
            // });
            // console.log(userProfile)
            console.log("After..")
        })
    }

    
    return (
        <div>
            {isLoading ? <Spinner/> : allCourse.map((item)=>{
                return <CourseRow 
                    key={item._id}
                    course = {item} 
                    loggedInuser={loggedInuser.user} 
                    subsHandler={onSubscribeHandle}/>
            })}
        </div>
       
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

export default connect(mapStateToProps, mapDispatchToProps)(AllCourses)
