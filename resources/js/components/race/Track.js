import React, {useState, useEffect, useRef} from 'react';
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

const fullToControlMap = Object.values(controlToFullMap).flatMap((fullIndices, controlIndex) => {
    if(fullIndices.length == 1) return controlIndex
    else return [controlIndex, controlIndex, controlIndex]
})

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
    console.log("X scaling: ", maxX / size.width)
    console.log("Y scaling: ", maxY / size.height)
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

const getSinglePoint = (index, lane) => {
    const scaledLane = getScaledLane(lane)
    return scaledLane[index]
}

const getLeftLane = (lane1, lane2) => {
    if (lane1 === "Left" || lane2 == "Left") return "Left"
    if (lane1 === "Center" || lane2 == "Center") return "Center"
    return "Right"
}

const getRightLane = (lane1, lane2) => {
    if (lane1 === "Right" || lane2 == "Right") return "Right"
    if (lane1 === "Center" || lane2 == "Center") return "Center"
    return "Left"
}

const calcDist = (point1, point2) => {
    const x1 = point1[0]
    const y1 = point1[1]
    const x2 = point2[0]
    const y2 = point2[1]
    return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2))
}

const calculateSingleSupportPoint = (startIndex, middleIndex, endIndex, lane1, lane2) => {
    const leftLabel = getLeftLane(lane1, lane2)
    const rightLabel = getRightLane(lane1, lane2)

    const startLeft = getSinglePoint(startIndex, leftLabel)
    const startRight = getSinglePoint(startIndex, rightLabel)
    const middleLeft = getSinglePoint(middleIndex, leftLabel)
    const middleRight = getSinglePoint(middleIndex, rightLabel)
    const endLeft = getSinglePoint(endIndex, leftLabel)
    const endRight = getSinglePoint(endIndex, rightLabel)

    const leftStartDist = calcDist(startLeft, middleLeft)
    const rightStartDist = calcDist(startRight, middleRight)
    const leftEndDist = calcDist(middleLeft, endLeft)
    const rightEndDist = calcDist(middleRight, endRight)
    const avgStartDist = (leftStartDist + rightStartDist) / 2
    const avgEndDist = (leftEndDist + rightEndDist) / 2

    const tempFrac = avgEndDist / (avgStartDist + avgEndDist)
    const tweak = 2 // tweaking parameter, from 1 to infinity. 
    const frac = (tempFrac < 0.5) ? tempFrac - tempFrac / tweak : tempFrac + (1 - tempFrac)/tweak


    const startSupport = getSinglePoint(middleIndex, lane1)
    const endSupport = getSinglePoint(middleIndex, lane2)
    const supportX = frac * startSupport[0] + (1-frac) * endSupport[0]
    const supportY = frac * startSupport[1] + (1-frac) * endSupport[1]

    return [supportX, supportY]
}

const calculateRaceSupportPoints = (indices, lane, prevLane, nextLane) => {
    const totalIndices = centerLane.length
    const index1 = (indices[0] - 1 + totalIndices) % totalIndices // Control point
    const index2 = indices[0] // support point
    const index3 = indices[1] // control point
    const index4 = indices[2] // support point 
    const index5 = (indices[2] + 1) % totalIndices // control point

    const support1 = calculateSingleSupportPoint(index1, index2, index3, prevLane, lane)
    const support2 = calculateSingleSupportPoint(index3, index4, index5, lane, nextLane)

    const scaledLane = getScaledLane(lane)

    // Adjusted support points:
    return [support1, scaledLane[index3], support2]

    // Fixed support points:
    // return [scaledLane[index2], scaledLane[index3], scaledLane[index4]]

    // No support points:
    // return [scaledLane[index3]] // without support points
}

const drawRaceLine = (svg, controlPoints) => {
    if(!scaledLeftLane || !scaledCenterLane || !scaledRightLane) return

    const raceLine = controlPoints.flatMap((point, i) => {
        const indices = controlToFullMap[i]
        if (indices.length == 1) 
            return [getSinglePoint(indices, point.lane)]
        else {
            const totalIndices = centerLane.length
            const prevLane = controlPoints[(i-1 + totalIndices) % totalIndices].lane
            const nextLane = controlPoints[(i+1) % totalIndices].lane
            return calculateRaceSupportPoints(indices, point.lane, prevLane, nextLane)
        }
    })

    const Gen = d3.line().curve(d3.curveCatmullRomClosed.alpha(0.5))
    const xmlns = "http://www.w3.org/2000/svg";
    const myPath = document.createElementNS(xmlns, "path");
    myPath.setAttributeNS(null, 'd', Gen(raceLine));
    const svgString = Gen(raceLine)
    let index = svgString.indexOf('C', 0)
    index = svgString.indexOf('C', index+1)
    console.log("index = ", index)

    console.log(svgString)

    const newString = svgString.substring(0, index)
    console.log("new String: ", newString)
    // console.log(svgString.split('C').map(d => d.split(',')))

    const line = svg.selectAll(".raceLine")
    line
        .data([raceLine])
        .enter()
        .append("path")
        .merge(line)
        .attr("d", newString)
        // .attr("d", d3.line()
            // .curve(d3.curveCatmullRomClosed.alpha(0.5))
        // )
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

const initialize = (svgElement, controlPoints, setCurrentStage, setControlPoint, currentStage) => {
    const size = getSize(svgElement.current)
    const svg = d3.select(svgElement.current)
    svg.selectAll("*").remove();
    scaleLanes(size)

    drawRaceLine(svg, controlPoints)
    drawBorders(svg, size)
    drawAllControlPoints(svg, setCurrentStage, setControlPoint, currentStage)
}

const Track = React.memo((props) => {
    const svgElement=useRef(null)
    
    const callInitialize = () => initialize(svgElement, props.controlPoints, props.setCurrentStage, props.setControlPoint, props.currentStage)
    const resizeListener = () => {
        window.addEventListener('resize', callInitialize)
        return () => window.removeEventListener('resize', callInitialize)
    }

    const updateRacePoints = () => {
        const svg = d3.select(svgElement.current)
        drawAllControlPoints(svg, props.setCurrentStage, props.setControlPoint, props.currentStage)
    }   

    useEffect(resizeListener, [props.controlPoints])
    useEffect(callInitialize, [])
    useEffect(updateRacePoints, [props.controlPoints])

    const svg = d3.select(svgElement.current)
    useEffect(() => drawRaceLine(svg, props.controlPoints), [props.controlPoints])
    updateVehicles(svg, props.cars, props.user, props.count)
    
    return <svg width="100%" height="100%" ref={svgElement}></svg>
})

export default Track;
  