import React from "react"

const Breakdowns = () => {
    return (
        <div className="p-2" style={{"height": "100%", "overflow":"hidden"}}>
            <h2 className='red text-center sectionHeader' style={{"paddingBottom": "0px"}}>BREAKDOWNS</h2>
            <div className='text-center'>
                <span className='yellow fontHeader'>Loose chain: </span><span className='fontHeader'>20 sec</span>
            </div>
            <div className='text-center'>
                <span className='yellow fontHeader'>Loose connector: </span><span className='fontHeader green'>fixed</span>
            </div>
        </div>
    )
}

export default Breakdowns