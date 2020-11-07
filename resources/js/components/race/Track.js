import React, {useEffect, useRef} from 'react';
import * as d3 from "d3";
import "./Track.css"
import {leftLane, rightLane, centerLane, leftBorder, rightBorder, 
    centerLeftBorder, centerRightBorder, maxX, maxY} from "./TrackData"

import applyColorMap from "./ColorMap"

const controlToFullMap = {
    0: [0], 1: [1], 2: [2], 3: [3], 4: [4, 5, 6], 5: [7], 6: [8], 7: [9, 10, 11],
    8: [12], 9: [13], 10: [14], 11: [15], 12: [16, 17, 18], 13: [19], 14: [20],
    15: [21], 16: [22, 23, 24], 17: [25], 18: [26], 19: [27], 20: [28, 29, 30],
    21: [31], 22: [32], 23: [33], 24: [34], 25: [35, 36, 37], 26: [38]
}

let scaledLeftLane 
let scaledCenterLane
let scaledRightLane

const getControlPoints = (lane) => {
    return Object.keys(controlToFullMap).map(i => {
        const indices = controlToFullMap[i]
        let coords
        if(indices.length == 1) {
            coords = lane[indices[0]]
        } else {
            coords = lane[indices[1]]
        }
        return {"x": coords[0], "y": coords[1], "index": Number(i)}
    })
}

const getSupportPoints = (lane) => {
    return Object.keys(controlToFullMap).flatMap(i => {
        const indices = controlToFullMap[i]
        if(indices.length == 3) {
            const coords = [lane[indices[0]], lane[indices[2]]]
            const result = [
                {"x": coords[0][0], "y": coords[0][1], "index": Number(i)},
                {"x": coords[1][0], "y": coords[1][1], "index": Number(i)},
            ]
            return result
        }
        return []
    })
}

const drawOpponents = (svg, carsData, user) => {
    const filteredData = carsData.filter((d) => d.username != user.name)
    const cars = svg.selectAll(".car")
    .data(filteredData)

    cars
        // .transition()
        // .duration(40)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)

    cars
        .enter() 
        .append("circle")
        .attr("r", "0.8vh")
        .attr("class", "car")
        .attr("opacity", "0.5")
        .attr("style", "fill:pink")
}

const drawUser = (svg, userData) => {
    const cars = svg.selectAll(".user")
    .data([userData])

    cars
        // // .transition()
        // .duration(40)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)

    cars
        .enter() 
        .append("circle")
        .attr("r", "0.8vh")
        .attr("class", "user")
        .attr("opacity", "1")
        .attr("style", "fill:yellow")
}


const updateVehicles = (svg, cars, user, userCar) => {
    const raceLine = svg.selectAll(".raceLine").node()
    if(!raceLine) return

    const lengthInMeters = 600.0
    const length = raceLine.getTotalLength();
    const carData = cars.map(car => {
        const trackRatio = (car.data.counter % lengthInMeters) / lengthInMeters
        const point = raceLine.getPointAtLength(trackRatio * length)
        const entry = {"x": point.x, "y": point.y, "username": car.user.username}
        return entry
    })
    const trackRatio = (userCar % lengthInMeters) / lengthInMeters
    const point = raceLine.getPointAtLength(trackRatio * length)
    const userData = {"x": point.x, "y": point.y}

    drawOpponents(svg, carData, user);
    drawUser(svg, userData);
}

let getSize = (svgElement) => { 
    const aspectRatio = maxX / maxY         
    const divWidth = svgElement.clientWidth
    const divHeight = svgElement.clientHeight

    let height
    let width
    
    if(divWidth > aspectRatio * divHeight) {
        width = aspectRatio * divHeight
        height = divHeight
    } else {
        width = divWidth
        height = divWidth / aspectRatio
    }
    const marginLeft = (divWidth - width)/2
    const marginTop = (divHeight - height)/2
    let size = {"width": width, "height": height, 
        "marginLeft": marginLeft, "marginTop": marginTop}

    return size 
}

// const sleep = (ms) => {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// const calculate3000points = async (line) => {
//     const totallength = line.node().gettotallength();
//     for(let i = 0; i < 3000; i++) {
//         const sampledistance = i / 3000.0 * totallength
//         const point = line.node().getpointatlength(sampledistance)
//         console.log(point.x + ', ' + point.y)
//         await sleep(10)
//     }
// }


const scaleLane = (lane, size) => {
    const laneCopy = JSON.parse(JSON.stringify(lane));
    const scaledLane = laneCopy.map(c => {
        let scaled = c;
        scaled[0] = size.marginLeft + c[0] * size.width / maxX;
        scaled[1] = size.marginTop + (maxY - c[1]) * size.height / maxY;
        return scaled;
    })
    return scaledLane
}

const drawControlPoints = (svg, lane, currentStage, setCurrentStage, setControlPoint, side) => {
    const controlPoints = getControlPoints(lane)
    const supportPoints = getSupportPoints(lane)

    const points = svg.selectAll("." + side + "Side")	
    points
        .data(controlPoints)	
        .enter().append("circle").merge(points)
        .attr("transform", d => "translate(" + d.x + ','+ d.y + ")")
        .attr("class", "controlPoint " + side + "Side")
        .attr("opacity", (d, stage) => stage == currentStage ? "1.0" : "0.5")
        .attr("fill", (d, stage) => stage == currentStage ? "white" : "red")
        .on("click", (event, d) => {
            setCurrentStage(d.index)
            setControlPoint(d.index, lane=side)
        })

    // svg.selectAll(".supportPoint" + side)	
    //     .data(supportPoints)	
    //     .enter().append("circle")	
    //     .attr("class", "supportPoint" + side)
    //     .attr("transform", d => "translate(" + d.x + ','+ d.y + ")")
    //     .attr("fill", "green")
    //     .attr("opacity", "0.5")
    //     .attr("r", "0.3vh")
}

const drawBorder = (svg, lane) => {
    const path = svg.append("path")
        .data([lane])
        .attr("d", d3.line()
            .curve(d3.curveCatmullRomClosed.alpha(0.5))
        )
        .style("stroke", "gray")
        .style("stroke-width", "0.1vh")

    return path
}

const drawDivider = (svg, lane) => {
    const path = svg.append("path")
        .data([lane])
        .attr("d", d3.line()
            .curve(d3.curveCatmullRomClosed.alpha(0.5))
        )
        .style("stroke", "gray")
        .style("stroke-width", "0.1vh")
        .attr("stroke-dasharray", "10, 15")

    return path
}

const getScaledLane = (lane) => {
    if(lane === "Left") {
        return scaledLeftLane
    } else if(lane === "Center") {
        return scaledCenterLane
    } else if (lane === "Right") {
        return scaledRightLane
    }
}


const drawRaceLine = (currentSvg, raceLine) => {
    const size = getSize(currentSvg)
    const svg = d3.select(currentSvg)
    const scaledRaceLine = scaleLane(raceLine, size)

    const Gen = d3.line().curve(d3.curveCatmullRomClosed.alpha(0.5))
    const xmlns = "http://www.w3.org/2000/svg";
    const myPath = document.createElementNS(xmlns, "path");
    myPath.setAttributeNS(null, 'd', Gen(raceLine));
    const svgString = Gen(scaledRaceLine)
    let index = svgString.indexOf('C', 0)
    index = svgString.indexOf('C', index+1)

    const newString = svgString.substring(0, index)
    // console.log(svgString.split('C').map(d => d.split(',')))
    const line = svg.selectAll(".raceLine")
    line
        .data([scaledRaceLine])
        .enter()
        .append("path")
        .merge(line)
        // .attr("d", newString)
        .attr("d", d3.line()
            .curve(d3.curveCatmullRomClosed.alpha(0.5))
        )
        .attr("class", "raceLine")
    // applyColorMap()
}

const scaleLanes = (size) => {
    scaledLeftLane = scaleLane(leftLane, size)
    scaledCenterLane = scaleLane(centerLane, size)
    scaledRightLane = scaleLane(rightLane, size)
}

const drawBorders = (svg, size) => {
    const scaledLeftBorder = scaleLane(leftBorder, size)
    const scaledCenterLeftBorder = scaleLane(centerLeftBorder, size)
    const scaledCenterRightBorder = scaleLane(centerRightBorder, size)
    const scaledRightBorder = scaleLane(rightBorder, size)
    drawBorder(svg, scaledLeftBorder)
    drawDivider(svg, scaledCenterLeftBorder)
    drawDivider(svg, scaledCenterRightBorder)
    drawBorder(svg, scaledRightBorder)
}

const drawAllControlPoints = (svg, setCurrentStage, setControlPoint, currentStage) => {
    drawControlPoints(svg, scaledLeftLane, currentStage, setCurrentStage, setControlPoint, "Left");
    drawControlPoints(svg, scaledCenterLane, currentStage, setCurrentStage, setControlPoint, "Center");
    drawControlPoints(svg, scaledRightLane, currentStage, setCurrentStage, setControlPoint, "Right");
}

const initialize = (svgElement, setCurrentStage, setControlPoint, currentStage, raceLine) => {
    const size = getSize(svgElement.current)
    const svg = d3.select(svgElement.current)
    svg.selectAll("*").remove();
    scaleLanes(size)

    drawRaceLine(svgElement.current, raceLine)
    drawBorders(svg, size)
    drawAllControlPoints(svg, setCurrentStage, setControlPoint, currentStage)
}

const Track = React.memo((props) => {
    const svgElement=useRef(null)
    
    const callInitialize = () => initialize(svgElement, props.setCurrentStage, 
        props.setControlPoint, props.currentStage, props.raceLine)
    const resizeListener = () => {
        window.addEventListener('resize', callInitialize)
        return () => window.removeEventListener('resize', callInitialize)
    }

    const updateRacePoints = () => {
        const svg = d3.select(svgElement.current)
        drawAllControlPoints(svg, props.setCurrentStage, props.setControlPoint, props.currentStage)
    }   

    useEffect(resizeListener, [props.controlPoints, props.raceLine])
    useEffect(callInitialize, [])
    useEffect(updateRacePoints, [props.controlPoints])

    useEffect(() => drawRaceLine(svgElement.current, props.raceLine), [props.raceLine])
    const svg = d3.select(svgElement.current)
    updateVehicles(svg, props.cars, props.user, props.count)
    
    return <svg width="100%" height="100%" ref={svgElement}></svg>
})

export default Track;
  