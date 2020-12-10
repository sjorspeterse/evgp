import React, {useRef} from "react"

const xOffset = -400
const bgColor = "#222"

const getTopFlag = (color, clicked, clickable) => {
    const location = xOffset + ", 30"
    const background = (color === "green") ? "green" : bgColor
    return getFlag(color, location, clicked, clickable, background)
}

const getCenterFlag = (color, clicked, clickable) => {
    const location = xOffset + ", 150"
    return getFlag(color, location, clicked, clickable)
}

const getBottomFlag = (color, clicked, clickable) => {
    const location = xOffset + ", 270"
    return getFlag(color, location, clicked, clickable)
}

const getFlag = (color, location, onClick, clickable, background=bgColor) => {
    let strokeColor = "white"
    if(color === "gone" ) {
        color = background
        strokeColor = background
    }

    return (
        <g transform={"translate(" + location + ")"} >
            <path
                style={{"fill": color, "strokeWidth": 5, "stroke": strokeColor}}
                d="m 313.625,-22.583008 c 0,0 0,29.222015 133.324,27.396011 133.32401,-1.826004 126.02097,20.089996 126.02097,20.089996 0,0 -49.01996,-9.132004 -114.91598,29.222 C 392.15799,92.479003 313.625,81.520995 313.625,81.520995"
                onClick={onClick}
                cursor={clickable ? "pointer" : ""}
            >
                <animate
                    attributeType="XML"
                    attributeName="fill"
                    values={color + ";" + color +";" + background + ";" + color}
                    dur="0.8s"
                    repeatCount={"indefinite"}/>
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

    return (
        <div className="" style={{"height": "100%", "overflow":"hidden", "backgroundColor": bgColor}}>
            <svg id="flagSVG" width="100%" height="100%" viewBox="0 -50 1 450" ref={svgElementFlags}>
                {getTopFlag(props.topFlag, props.clickedTopFlag, props.clickable)}
                {getCenterFlag(props.centerFlag, props.clickedCenterFlag, props.clickable)}
                {getBottomFlag(props.bottomFlag, props.clickedBottomFlag, props.clickable)}
                {getPole()}
            </svg>
        </div>
    )
}

export default Flags