import React, { useState, useEffect } from 'react'
//import './Signup.css'
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import Spinner from '../Spinner/spinner';

function Signup(props) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState(null);
    const [role, setRole] = useState("STD");
    const [profilePic, setProfilePic] = useState(null);
    const [picurl, setPicurl] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {

        if (picurl) {
            console.log("I am Again Effect")
            console.log(picurl)
            //registerSignupDetail();
        }

    }, [picurl])


    let submithandler = (event) => {
        event.preventDefault();
        console.log(" i am clicked called")
        if (!email || !password || !name) {
            setError("All Field are mandatory");
            return;
        }
        setIsLoading(true);
        if (profilePic) {
            //uploadProfilePic()
        }
        else {
            registerSignupDetail();
        }


    }

    let registerSignupDetail = () => {

        fetch('/signup', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password,
                name,
                role
            })
        })
            .then(res => res.json())
            .then(data => {
                setIsLoading(false)
                console.log(data);
                if (data.error) {
                    setError(data.error)
                }
                else {
                    props.history.push('/signin');
                }
            })
            .catch(err => {
                setIsLoading(false)
                setError("Something went wrong..!!")
                console.log(err.message)
            })
    }


    // let uploadProfilePic = () => {
    //     console.log("I am Upload")
    //     console.log(profilePic)
    //     const data = new FormData();
    //     data.append("file", profilePic);
    //     data.append("upload_preset", "clickza");
    //     data.append("cloud_name", "reyhul")

    //     fetch('	https://api.cloudinary.com/v1_1/reyhul/image/upload', {
    //         method: "post",
    //         body: data
    //     })
    //         .then(res => res.json())
    //         .then(data => {
    //             //loading will go to register
    //             setPicurl(data.url);
    //             console.log(data)
    //         })
    //         .catch(err => {
    //             setIsLoading(false)
    //             console.log(err)
    //         })
    // }



    return (
        <div className="Login">
            <form className="card" onSubmit={(event)=>submithandler(event)}>
                {error ? <p className='ErrorMessage'>{error}</p> : null}
                <h2>Mini Learning SignUp</h2>
                {
                    isLoading ? <Spinner /> : (
                        <>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={email}
                                onChange={(event) => {
                                    setEmail(event.target.value);
                                    setError(null);
                                }
                                }
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={password}
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                    setError(null);
                                }}
                            />
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={name}
                                onChange={(event) => {
                                    setName(event.target.value);
                                    setError(null);
                                }}
                            />

                            <select name="role" id="role" onChange={(event)=>setRole(event.target.value)}>
                                <option value="STD">Student</option>
                                <option value="FAC">Faculty</option>
                            </select>   
                                                        {/* <div className="upload__button">
                                <label htmlFor="uploadImg" className="upload__label ">Profile Pic</label>
                                <input
                                    id="uploadImg"
                                    type="file"
                                    name="file"
                                    onChange={(event) => setProfilePic(event.target.files[0])}
                                />
                                <AddPhotoAlternateIcon className="addImage" />
                            </div> */}

                            <button type="submit">
                                SignUp
                            </button>
                        </>
                    )}

            </form>
        </div>
    )
}

export default Signup






