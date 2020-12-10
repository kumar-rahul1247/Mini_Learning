import React from 'react'
import './CourseRow.css'


function courseRow({course, loggedInuser, subsHandler,}) {

    
    let subsButton = <button style={{backgroundColor: "lightgreen"}} onClick={()=>subsHandler(course._id, "subs")}>Subscribe</button>

    for (const crs of course.subsuser) {
        if(crs === loggedInuser._id){
            subsButton = <button style={{backgroundColor: "#f9a8a8"}} onClick={()=>subsHandler(course._id, "unsubs")}>UnSubscribe</button>
        }
    }
    return (
        <div className="course_row">
            <img src= {course.photo} alt=""/>
            <div>
                <h5>{course.title}</h5>
                <p>{course.desc}</p>
                <p>{course.postedBy.name}</p>
                {subsButton}
            </div>
        </div>
    )
}



export default courseRow
