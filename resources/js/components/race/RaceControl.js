import React from "react"

const RaceControl = () => {
    return (
        <div className="p-2" style={{"height": "100%", "overflow":"hidden"}}>
            <h2 className='red text-center sectionHeader'>RACE CONTROL</h2>
            <h2 className='yellow text-center sectionHeader'>BLACK FLAG - PIT NOW</h2>
            <div className='text-center'>
                <span className='yellow fontHeader'>passing on yellow: </span><span className='fontHeader'>30 sec</span>
            </div>
        </div>
    )
}

export default RaceControl