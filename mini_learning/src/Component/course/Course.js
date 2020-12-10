import React from 'react'
import './course.css'
import UnsubscribeIcon from '@material-ui/icons/Unsubscribe';
import EditIcon from '@material-ui/icons/Edit';
import { useHistory } from "react-router-dom";

function Course({item, role, onHandler}) {
    let history = useHistory();
    console.log(item)
    let unsubscribeButton = null;
    if(role==="STD"){
        
        console.log("How am i here............?? "+ item.role)
        console.log(item)
        unsubscribeButton=<UnsubscribeIcon style={{color:"#d64040"}} onClick={()=>{onHandler(item._id)}}/>
    }
    else{
        unsubscribeButton=<EditIcon style={{color:"#d64040"}} onClick={()=>{history.push("/addcourse", {item:item})}}/> 
    }

    return (
        <div className="coursecard">
            <p><span>{item.title}</span><span className="unsubscribe" >{unsubscribeButton}</span></p>
            <img
                className="item"
                key={item._id}
                src={item.photo}
                alt="Ocean" />
            <div>
                <p>{item.desc}....</p>
                <p>{item.postedBy.name}</p>
            </div>
        </div>
    )
}

export default Course
