import React from "react"

const Flags = () => {
    return (
        <div className="p-2" style={{"height": "100%", "overflow":"hidden"}}>
            <h2 className='red text-center sectionHeader'>FLAGS</h2>
            <img src={"/images/raceflags.svg"} className="logo" style={{"height": "80%"}}/>
        </div>
    )
}

export default Flags