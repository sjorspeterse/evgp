import React from "react"

const Analyst = (props) => {
    const data = props.data
    return (
        <div className='voltageWrapper'> 
            <div className="m-1" style={{"gridColumn": "1", "gridRow": "1"}}>{data.speed} km/h</div>
            <div className="m-1" style={{"gridColumn": "1", "gridRow": "2"}}>{data.voltage} V</div>
            <div className="m-1" style={{"gridColumn": "1", "gridRow": "3"}}>{data.current} A</div>
            <div className="m-1" style={{"gridColumn": "2", "gridRow": "1"}}>{data.ampHours} Ah</div>
            <div className="m-1" style={{"gridColumn": "2", "gridRow": "2"}}>{data.power} W</div>
            <div className="m-1" style={{"gridColumn": "2", "gridRow": "3"}}>{data.wattHours} Wh</div>
        </div>
    )
}

export default Analyst