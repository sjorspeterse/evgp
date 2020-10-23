import React from "react"

const Analyst = () => {
    return (
        <div className='voltageWrapper'> 
            <div className="m-1" style={{"gridColumn": "1", "gridRow": "1"}}>42 kph</div>
            <div className="m-1" style={{"gridColumn": "1", "gridRow": "2"}}>49.8 V</div>
            <div className="m-1" style={{"gridColumn": "1", "gridRow": "3"}}>12.8 A</div>
            <div className="m-1" style={{"gridColumn": "2", "gridRow": "1"}}>13.2 AH</div>
            <div className="m-1" style={{"gridColumn": "2", "gridRow": "2"}}>637.7 W</div>
            <div className="m-1" style={{"gridColumn": "2", "gridRow": "3"}}>660.1 Wh</div>
        </div>
    )
}

export default Analyst