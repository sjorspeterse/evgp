import React, {useEffect, useRef} from 'react';
import * as d3 from "d3";
import "./Track.css"
import {leftBorder, rightBorder, centerLeftBorder, centerRightBorder, maxX, maxY} from "./TrackData"

import applyColorMap from "./ColorMap"
const drawOpponents = (svg, carsData, user) => {
    const filteredData = carsData.filter((d) => d.username != user.name)
    const cars = svg.selectAll(".car")
    .data(filteredData)

    cars
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

const drawRadius = (currentSvg, radius) => {
    if(!radius) return
    const size = getSize(currentSvg)
    const scaleX = (d) => size.marginLeft + d  * size.width / maxX
    const scaleY = (d) => size.marginTop + (maxY - d)  * size.height / maxY
    const scale = (d) => d * size.width / maxX

    const svg = d3.select(currentSvg)
    const lag = [scaleX(radius.lagx), scaleY(radius.lagy)]
    const center = [scaleX(radius.Mx), scaleY(radius.My), scale(radius.R)]
    const lead = [scaleX(radius.leadx), scaleY(radius.leady)]

    const lagLead = svg.selectAll(".leadlag")
    lagLead
        .data([lead, lag])
        .enter().append("circle").merge(lagLead)
        .attr("cx", d => d[0])
        .attr("cy", d => d[1])
        .attr("r", "0.3vh")
        .attr("class", "leadlag")
        .attr("fill", "blue")

    const centerPoint = svg.selectAll(".centerpoint")
    centerPoint
        .data([center])
        .enter().append("circle").merge(centerPoint)
        .attr("cx", d => d[0])
        .attr("cy", d => d[1])
        .attr("r", d => d[2])
        .attr("class", "centerpoint")
        .attr("fill", "none")
        .attr("stroke", "gray")
}


const updateVehicles = (currentSvg, cars, user, normalizedDistance, radius) => {
    const svg = d3.select(currentSvg)
    const raceLine = svg.selectAll(".raceLine").node()
    if(!raceLine) return

    const length = raceLine.getTotalLength();
    const carData = cars.map(car => {
        const trackRatio = car.data.counter
        const point = raceLine.getPointAtLength(trackRatio * length)
        const entry = {"x": point.x, "y": point.y, "username": car.user.username}
        return entry
    })
    const point = raceLine.getPointAtLength(normalizedDistance * length)
    const userData = {"x": point.x, "y": point.y}

    drawOpponents(svg, carData, user);
    drawUser(svg, userData);
    drawRadius(currentSvg, radius)
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
    let size = {width: width, height: height, 
        marginLeft: marginLeft, marginTop: marginTop}

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

const drawBorder = (svg, lane, size, className, divider=false) => {
    const scaledLane = scaleLane(lane, size)
    const path = svg.selectAll("." + className)
    path
        .data([scaledLane])
        .enter().append("path").merge(path)
        .attr("d", d3.line()
            .curve(d3.curveCatmullRomClosed.alpha(0.5))
        )
        .attr("class", className)
        .style("stroke", divider ? "gray" :"white")
        .style("stroke-width", divider ? "0.1vh" : "0.3vh")
        .style("stroke-dasharray", divider ? "2, 4" : "")
    return path
}

const rotateListByOne = (oldList) => {
    const n = oldList.length
    return oldList.map((v, i) => oldList[(n + i-1)%n])
}

const drawTrack = (currentSvg, raceLine, getThrottleUI) => {
    const size = getSize(currentSvg)
    const svg = d3.select(currentSvg)
    drawBorders(svg, size)
    const scaledRaceLine = scaleRaceLine(raceLine, size)
    const scaledRotatedLine = rotateListByOne(scaledRaceLine)
    
    const line = svg.selectAll(".raceLine")
    line
        .data([scaledRotatedLine])
        .enter()
        .append("path")
        .merge(line)
        .attr("d", d3.line()
            .curve(d3.curveCatmullRomClosed.alpha(0.5))
        )
        .attr("class", "raceLine")
    applyColorMap(getThrottleUI)
}

const drawBorders = (svg, size) => {
    drawBorder(svg, leftBorder, size, "leftBorder")
    drawBorder(svg, centerLeftBorder, size, "leftCenterBorder", true)
    drawBorder(svg, centerRightBorder, size, "rightCenterBorder", true)
    drawBorder(svg, rightBorder, size, "rightBorder")
}

const drawControlPoints = (currentSvg, currentStage, controlPointsUI) => {
    if(!controlPointsUI) {
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

const Track = React.memo((props) => {
    const svgElement=useRef(null)

    const initialize = () => {
        const svg = d3.select(svgElement.current)
        svg.selectAll("*").remove();

        drawTrack(svgElement.current, props.raceLine, props.getThrottleUI)
        drawControlPoints(svgElement.current, props.currentStage, props.controlPointsUI)
    }

    const resizeListener = () => {
        window.addEventListener('resize', initialize)
        return () => window.removeEventListener('resize', initialize)
    }

    const updateControlPoints = () => {
        drawControlPoints(svgElement.current, props.currentStage, props.controlPointsUI)
    }   

    useEffect(resizeListener, [props.raceLine])
    useEffect(initialize, [])
    useEffect(updateControlPoints, [props.controlPointsUI])

    useEffect(() => drawTrack(svgElement.current, props.raceLine, props.getThrottleUI), [props.raceLine])
    updateVehicles(svgElement.current, props.cars, props.user, props.normalizedDistance, props.radius)

    return <svg width="100%" height="100%" ref={svgElement}></svg>
})

export default Track;
  