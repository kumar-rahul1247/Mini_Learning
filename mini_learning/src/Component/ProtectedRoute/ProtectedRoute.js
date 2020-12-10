import React, {  useEffect} from 'react'

import {connect} from 'react-redux';

import Profile from "../../Component/Profile/Profile";
import Create from "../../Component/Create/Create";
import AllCourse from '../../Component/AllCourses/AllCourses'

import Login from '../../Component/Login/Login';
import Signup from '../../Component/Signup/Signup';
import {Route, Switch, useHistory } from 'react-router-dom'

const ProtectedRoute = ({ loggedInuser }) => {

    const history = useHistory();
    console.log(loggedInuser)
    useEffect(() => {
        
        if (!loggedInuser.user) {
            console.log("00909090909")
                history.push('/signin')
            
        }



    }, [])

    return (
        <Switch>
            
            <Route path="/signin" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/addcourse" component={Create} />
            <Route path="/allcourse" component={AllCourse} />
            <Route path="/home" component={Profile} />
            
           
        </Switch>
    )
}


let mapStateToProps = state => {
    return {
        loggedInuser: state
    }
}

export default connect(mapStateToProps)(ProtectedRoute)