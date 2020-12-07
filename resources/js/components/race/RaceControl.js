import React from "react"

const RaceControl = (props) => {
    const text = props.text
    return (
        <div className="p-2" style={{"height": "100%", "overflow":"hidden"}}>
            <h2 className='red text-center sectionHeader'>RACE CONTROL</h2>
            <h2 className='yellow text-center sectionHeader'>{text.bigText ? text.bigText : text.smallText ? "BLACK FLAG - PIT NOW" : ""}</h2>
            <div className='text-center'>
                <span className='yellow fontHeader'>{text.smallText ? text.smallText + ": " : ""}</span>
                <span className='fontHeader'>{text.whiteText}</span>
            </div>
        </div>
    )
}

export default RaceControl