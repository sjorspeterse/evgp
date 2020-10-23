import React from "react"

const Flags = () => {
    return (
        <div className="border border-light mr-1 p-1">
        <h5 className="text-danger"><strong>FLAGS</strong></h5> 
        <div className="flex-container">
            <div style={{"color": "white", "backgroundColor": "green"}}>
                <strong>TRACK <br/> CLEAR</strong>
            </div>
            <div style={{"color": "black", "backgroundColor": "yellow"}}>
                <strong>NO <br/>PASSING</strong>
            </div>
        </div>
        <div className="flex-container">
            <div style={{"color": "white", "backgroundColor": "red"}}>
                <strong> STOP <br/>RACING </strong>
            </div>
            <div style={{"color": "white", "backgroundColor": "black"}}>
                <strong>ORDERED <br/>TO PIT </strong>
            </div>
        </div>
        <div className="flex-container">
            <div style={{"color": "black", "backgroundColor": "white"}}>
                <strong>LAST 2 <br/>MINUTES</strong>
            </div>
            <div style={{"color": "white", "backgroundColor": "darkcyan"}}>
               <strong>DRIVER <br/> CHANGE</strong>
            </div>
        </div>
    </div>
    )
}

export default Flags