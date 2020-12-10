import React, { useContext, useState } from 'react'
import './Header.css'
import { Link, useHistory } from 'react-router-dom'
import {connect} from 'react-redux';
import { logoutUser } from '../../redux/actions/authAction'

function Header({loggedInuser, dispatchUser}) {
    const history = useHistory();
    //const { user, setUser } = useState(null);

    let logoutHandler = () => {
        dispatchUser(logoutUser())
        history.push('/signin');

    }

    let navLink = null;
    console.log("TTTEEESSSEETTTTT--")
    console.log(loggedInuser.user)
    if (loggedInuser.user) {
        navLink = [
            <li key="1"><Link className="Navigate" to="/home">Home</Link></li>,
            loggedInuser.user.role==="FAC"?
            <li key="2"><Link className="Navigate" to="/addcourse">Create</Link></li>:
            <li key="3"><Link className="Navigate" to="/allcourse">All Course</Link></li>,
            
            <li key="4">
                <button className="Logout_Button"
                    onClick={logoutHandler}>Logout</button>
            </li>
        ]
    }
    else {
        navLink = [
            <li key="5"><Link className="Navigate" to="/signin">SignIn</Link></li>,
            <li key="6"><Link className="Navigate" to="/signup">SignUp</Link></li>

        ]
    }

    

    return (
        <nav className="Header">
           
            <Link to={loggedInuser.user ? "/" : "/signin"}><h1>Mini Learning</h1></Link>
            <div className="Header__right">
                <ul>
                    {navLink}
                </ul>
            </div>
        </nav>
    )
}

let mapStateToProps = state => {
    return {
        loggedInuser: state
    }
}

const mapDispatchToProps = dispatch =>{
    return {
        dispatchUser: (data) => dispatch(logoutUser(data))
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(Header)
