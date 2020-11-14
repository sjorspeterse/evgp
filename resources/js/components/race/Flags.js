import React, {useRef, useEffect, useState} from "react"

const xOffset = -400
const bgColor = "#222"

const getTopFlag = (color, clicked) => {
    const location = xOffset + ", 30"
    return getFlag(color, location, "0", clicked)
}

const getCenterFlag = (color, clicked) => {
    const location = xOffset + ", 150"
    return getFlag(color, location, "indefinite", clicked)
}

const getBottomFlag = (color, clicked) => {
    const location = xOffset + ", 270"
    return getFlag(color, location, "indefinite", clicked)
}

const getFlag = (color, location, flash, onClick) => {
    let strokeColor = "white"
    if(color === "gone" ) {
        color = bgColor
        strokeColor = bgColor
    }

    return (
        <g transform={"translate(" + location + ")"} >
            <path
                style={{"fill": color, "strokeWidth": 5, "stroke": strokeColor}}
                d="m 313.625,-22.583008 c 0,0 0,29.222015 133.324,27.396011 133.32401,-1.826004 126.02097,20.089996 126.02097,20.089996 0,0 -49.01996,-9.132004 -114.91598,29.222 C 392.15799,92.479003 313.625,81.520995 313.625,81.520995"
                onClick={onClick}
                cursor="pointer"
            >
                <animate
                    attributeType="XML"
                    attributeName="fill"
                    values={color + ";" + color +";" + bgColor + ";" + color}
                    dur="0.8s"
                    repeatCount={flash}/>
            </path>
        </g>
    )
}

const getPole = () => {
      return <line
         style={{"fill": "#ffffff", "fillOpacity": 1, "stroke": "#ffffff", "strokeOpacity": 1}}
         y2="0"
         x2="-90"
         y1="400"
         x1="-90"
         strokeWidth="10"
         strokeMiterlimit="10"
         strokeLinecap="round"
         stroke="#000000"
         id="svg_1" />
}

const Flags = (props) => {
    const svgElementFlags=useRef(null)
    const [topFlag, setTopFlag] = useState(getTopFlag(props.topFlag, props.clickedCenterFlag))

    useEffect(() => setTopFlag(getTopFlag(props.topFlag, props.clickedTopFlag)), [props.topFlag])

    return (
        <div className="" style={{"height": "100%", "overflow":"hidden", "backgroundColor": bgColor}}>
            {/* <h2 className='red text-center sectionHeader'>FLAGS</h2> */}
            <svg id="flagSVG" width="100%" height="100%" viewBox="0 -50 1 450" ref={svgElementFlags}>
                {topFlag}
                {getCenterFlag(props.centerFlag, props.clickedCenterFlag)}
                {getBottomFlag(props.bottomFlag, props.clickedBottomFlag)}
                {getPole()}
            </svg>
            {/* <img src={"/images/raceflags.svg"} className="logo" style={{"height": "80%"}}/> */}
        </div>
    )
}

export default Flags