import React, {useState, useEffect, useRef} from 'react';
import * as d3 from "d3";
import "./Track.css"
import {leftLane, rightLane, centerLane, leftBorder, rightBorder, 
    centerLeftBorder, centerRightBorder, maxX, maxY} from "./TrackData"


const pointsMap = {
    0: [0], 1: [1], 2: [2], 3: [3], 4: [4, 5, 6], 5: [7], 6: [8], 7: [9, 10, 11],
    8: [12], 9: [13], 10: [14], 11: [15], 12: [16, 17, 18], 13: [19], 14: [20],
    15: [21], 16: [22, 23, 24], 17: [25], 18: [26], 19: [27], 20: [28, 29, 30],
    21: [31], 22: [32], 23: [33], 24: [34], 25: [35, 36, 37], 26: [38]
}

let scaledLeftLane 
let scaledCenterLane
let scaledRightLane

const getControlPoints = (lane) => {
    return Object.keys(pointsMap).map(i => {
        const indices = pointsMap[i]
        let coords
        if(indices.length == 1) {
            coords = lane[indices[0]]
        } else {
            coords = lane[indices[1]]
        }
        return {"x": coords[0], "y": coords[1], "index": Number(i)}
    })
}

const drawOpponents = (svg, carsData, user) => {
    const filteredData = carsData.filter((d) => d.username != user.name)
    const cars = svg.selectAll(".car")
    .data(filteredData)

    cars
        .transition()
        .duration(40)
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
        .transition()
        .duration(40)
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

const updateRaceLine = (svg, raceLine, setRaceLine) => {

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
        scaled[1] = size.marginTop + (200 - c[1]) * size.height / maxY;
        return scaled;
    })
    return scaledLane
}

const drawControlPoints = (svg, lane, setCurrentStage) => {
    const controlPoints = getControlPoints(lane)

    svg.selectAll("controlPoint")	
        .data(controlPoints)	
        .enter().append("circle")	
        .attr("class", "controlPoint")
        .attr("transform", d => "translate(" + d.x + ','+ d.y + ")")
        .on("click", (event, d) => setCurrentStage(d.index))
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

const drawRaceLine = (svg, points) => {
    console.log("drawing race line!")
    const path = svg.selectAll(".raceLine")
        .data([scaledLeftLane])
        .enter()
        .append("path")
        .attr("d", d3.line()
            .curve(d3.curveCatmullRomClosed.alpha(0.5))
        )
        .attr("class", "raceLine")
    return path
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

const drawAllControlPoints = (svg, setCurrentStage) => {
    drawControlPoints(svg, scaledCenterLane, setCurrentStage);
    drawControlPoints(svg, scaledLeftLane, setCurrentStage);
    drawControlPoints(svg, scaledRightLane, setCurrentStage);
}

const initialize = (svgElement, raceLinePoints, setCurrentStage) => {
    const size = getSize(svgElement.current)
    const svg = d3.select(svgElement.current)
    svg.selectAll("*").remove();
    scaleLanes(size)

    drawRaceLine(svg, raceLinePoints)
    drawBorders(svg, size)
    drawAllControlPoints(svg, setCurrentStage)
}

const Track = (props) => {
    const svgElement=useRef(null)
    
    const callInitialize = () => initialize(svgElement, props.raceLinePoints, props.setCurrentStage)
    const resizeListener = () => {
        window.addEventListener('resize', callInitialize)
        return () => window.removeEventListener('resize', callInitialize)
    }

    useEffect(resizeListener, [])
    useEffect(callInitialize , [])

    let svg = d3.select(svgElement.current)
    updateVehicles(svg, props.cars, props.user, props.count)
    
    return <svg width="100%" height="100%" ref={svgElement}></svg>
}

export default Track;
  