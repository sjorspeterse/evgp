import React, {useEffect, useRef} from 'react';
import * as d3 from "d3";
import "./Track.css"
import {leftLane, rightLane, centerLane, leftBorder, rightBorder, 
    centerLeftBorder, centerRightBorder, maxX, maxY} from "./TrackData"

import applyColorMap from "./ColorMap"
let scaledLeftLane 
let scaledCenterLane
let scaledRightLane
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

const scaleRaceLine = (raceLine, size) => {
    const laneCopy = JSON.parse(JSON.stringify(raceLine));
    const scaledLane = laneCopy.map(racePoint => {
        let scaled = [0, 0];
        scaled[0] = size.marginLeft + racePoint.x * size.width / maxX;
        scaled[1] = size.marginTop + (maxY - racePoint.y) * size.height / maxY;
        return scaled;
    })
    return scaledLane
}

const scaleControlPoints = (points, size) => {
    const pointsCopy = JSON.parse(JSON.stringify(points));
    const scaledPoints = pointsCopy.map((point, i) => {
        let scaledPoint = point;
        scaledPoint.x = size.marginLeft + point.x * size.width / maxX;
        scaledPoint.y = size.marginTop + (maxY - point.y) * size.height / maxY;
        scaledPoint.setControlPoint = points[i].setControlPoint
        return scaledPoint;
    })
    return scaledPoints
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

const drawRaceLine = (currentSvg, raceLine) => {
    const size = getSize(currentSvg)
    const svg = d3.select(currentSvg)
    const scaledRaceLine = scaleRaceLine(raceLine, size)

    const line = svg.selectAll(".raceLine")
    line
        .data([scaledRaceLine])
        .enter()
        .append("path")
        .merge(line)
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

const drawControlPoints = (currentSvg, currentStage, controlPointsUI) => {
    if(!controlPointsUI) {
        console.log("controlPointsUI = ", controlPointsUI)
        return
    }
    const size = getSize(currentSvg)
    const scaledPoints = scaleControlPoints(controlPointsUI, size)
    const svg = d3.select(currentSvg)

    const points = svg.selectAll(".controlPoint")	
    points
        .data(scaledPoints)	
        .enter().append("circle").merge(points)
        .attr("transform", d => "translate(" + d.x + ','+ d.y + ")")
        .attr("class", "controlPoint ")
        .attr("opacity", (d) => d.stage == currentStage ? "1.0" : "0.5")
        .attr("fill", (d) => d.stage == currentStage ? "white" : "red")
        .on("click", (event, d) => d.setControlPoint())
}

const initialize = (svgElement, currentStage, raceLine, controlPointsUI) => {
    const size = getSize(svgElement.current)
    const svg = d3.select(svgElement.current)
    svg.selectAll("*").remove();
    scaleLanes(size)

    drawRaceLine(svgElement.current, raceLine)
    drawBorders(svg, size)
    drawControlPoints(svgElement.current, currentStage, controlPointsUI)
}

const Track = React.memo((props) => {
    const svgElement=useRef(null)

    const callInitialize = () => initialize(svgElement, props.currentStage, props.raceLine, props.controlPointsUI)
    const resizeListener = () => {
        window.addEventListener('resize', callInitialize)
        return () => window.removeEventListener('resize', callInitialize)
    }

    const updateControlPoints = () => {
        drawControlPoints(svgElement.current, props.currentStage, props.controlPointsUI)
    }   

    useEffect(resizeListener, [props.raceLine])
    useEffect(callInitialize, [])
    useEffect(updateControlPoints, [props.controlPointsUI])

    useEffect(() => drawRaceLine(svgElement.current, props.raceLine), [props.raceLine])
    const svg = d3.select(svgElement.current)
    updateVehicles(svg, props.cars, props.user, props.count)
    
    return <svg width="100%" height="100%" ref={svgElement}></svg>
})

export default Track;
  