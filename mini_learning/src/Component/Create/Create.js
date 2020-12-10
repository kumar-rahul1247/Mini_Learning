import React, { useState, useEffect, useRef } from 'react'
import './Create.css'
import {connect} from 'react-redux';

import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Spinner from '../Spinner/spinner';


function Create(props) {

    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const ref = useRef(null)

    

    useEffect(() => {
        if(props.location.state){
            console.log("----------%%%%%%")
            ref.current=props.location.state.item;
            setTitle(ref.current.title)
            setDesc(ref.current.desc)
            
        }
    }, [])
    
    let onUploadHandler = () => {
        console.log(title, desc)
        if (!title || !desc) {

            return setError("All fields are mandotry")
        }
        
        setIsLoading(true);

        if(ref.current){
            updateData()
        }
        else{
            postData();
        }
        

    }

    const postData = () => {
       
        fetch('/createcourse', {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + props.loggedInuser.token
            },
            body: JSON.stringify({
                title,
                desc,
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setIsLoading(false)
                if (data.error) {
                    setError({ error: data.error })
                }
                else {

                    props.history.push('/home');
                }

            })
            .catch(err => {
                setIsLoading(false);
                setError("Unable to upload. Something went Wrong")
                console.log(err.message)
            })

    }

    const updateData = () => {
        console.log("OOOOOOOOOOoooooooooooooooooo")
       console.log(ref.current)
        fetch('/updatecourse', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + props.loggedInuser.token
            },
            body: JSON.stringify({
                _id: ref.current._id,
                title,
                desc,
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setIsLoading(false)
                if (data.error) {
                    setError({ error: data.error })
                }
                else {
                    props.history.push('/home');
                }

            })
            .catch(err => {
                setIsLoading(false);
                setError("Unable to upload. Something went Wrong")
                console.log(err.message)
            })

    }

    const deleteCourse = () =>{
        fetch('/delete/'+ref.current._id, {
            method: "delete",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + props.loggedInuser.token
            },
           
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setIsLoading(false)
                if (data.error) {
                    setError({ error: data.error })
                }
                else {
                    props.history.push('/home');
                }

            })
            .catch(err => {
                setIsLoading(false);
                setError("Unable to upload. Something went Wrong")
                console.log(err.message)
            })
    }
    
    let deleteButton =null;
    if(ref.current){
        deleteButton = <button
        type="submit"
        className="uploadButton"
        onClick={deleteCourse}
    >
        Delete Course
    </button>
    }

    return (
        <div>
            <div className="create__card">
                <h2>Add New Course</h2>
                {
                    isLoading ? <Spinner /> : 
                    <>
                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            value={title}
                            onChange={(event) => {setTitle(event.target.value); setError(null)}}
                        />

                        <input
                            type="text"
                            name="desc"
                            placeholder="Description"
                            value={desc}
                            onChange={(event) => {setDesc(event.target.value);setError(null)}}
                        />

                        <button
                            type="submit"
                            className="uploadButton"
                            onClick={onUploadHandler}
                        >
                            {ref.current? 'Update Course' : 'Add Course'} <CloudUploadIcon className="uploadIcon" />
                        </button>

                        {deleteButton}
                        

                    </>
                }

                {error ? <p className="create_error">{error}</p> : null}

                
            </div>
            <div>

            </div>
        </div>
    )
}


let mapStateToProps = state => {
    return {
        loggedInuser: state
    }
}


export default connect(mapStateToProps)(Create)
