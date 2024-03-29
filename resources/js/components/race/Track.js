import React, {useEffect, useRef} from 'react';
import * as d3 from "d3";
import "./Track.css"
import {
    leftBorder as leftBorderPrac, rightBorder as rightBorderPrac, 
    centerLeftBorder as centerLeftBorderPrac, centerRightBorder as centerRightBorderPrac,
    pitLeftBorder as pitLeftBorderPrac, pitRightBorder as pitRightBorderPrac,
    pitCenterBorder as pitCenterBorderPrac, maxX as maxXPrac, maxY as maxYPrac
} from "./PracticeTrackData"
import {
    leftBorderRace, rightBorderRace, centerLeftBorderRace, centerRightBorderRace,
    pitLeftBorderRace, pitRightBorderRace, pitCenterBorderRace, maxXRace, maxYRace
} from "./RaceTrackData"

const view =  document.getElementById('race_container')
let track = "Practice"
if(view) {
    const json_admin = view.getAttribute('admin')
    const admin = JSON.parse(json_admin)
    if(admin.track) {
        track = admin.track
    }
}

const useRealTrack = (track === "Official")

const leftBorder = useRealTrack ? leftBorderRace : leftBorderPrac
const rightBorder = useRealTrack ? rightBorderRace : rightBorderPrac
const centerLeftBorder = useRealTrack ? centerLeftBorderRace : centerLeftBorderPrac
const centerRightBorder = useRealTrack ? centerRightBorderRace : centerRightBorderPrac
const pitLeftBorder = useRealTrack ? pitLeftBorderRace : pitLeftBorderPrac
const pitRightBorder = useRealTrack ? pitRightBorderRace : pitRightBorderPrac
const pitCenterBorder = useRealTrack ? pitCenterBorderRace : pitCenterBorderPrac
const maxX = useRealTrack ? maxXRace : maxXPrac
const maxY = useRealTrack ? maxYRace : maxYPrac

import applyColorMap from "./ColorMap"
const drawOpponents = (svg, carsData, user) => {
    const filteredData = carsData.filter((d) => d.username != user.userName)
    const cars = svg.selectAll(".car")
        .data(filteredData)
    cars.exit().remove()

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

    const carBox = svg.selectAll(".carBox")
        .data(filteredData)

    const xOffset = 2.5
    const yOffet = 5
    const width = 25
    const height = 20
    carBox.exit().remove()
    carBox.enter()
        .append("rect").merge(carBox)
        .attr("x", d => d.x - (width + xOffset))
        .attr("y", d => d.y - (height + yOffet))
        .attr("width", width)
        .attr("height", height)
        .attr("class", "carBox")
        .attr("style", "fill:gray")
        .attr("opacity", "0.5")
        .attr("stroke-width", 3)

    const carText = svg.selectAll(".carText")
        .data(filteredData)

    carText.exit().remove()
    carText.enter()
        .append("text").merge(carText)
        .text(d => d.carNr.substring(d.carNr.length-2))
        .attr("font-size", 20)
        .attr("opacity", "0.5")
        .attr("x", d => d.x - xOffset)
        .attr("y", d => d.y - (yOffet + 2))
        .attr("text-anchor", "end")
        .attr("class", "carText")
}

const drawUser = (svg, userData) => {
    const cars = svg.selectAll(".user")
        .data([userData])
    cars.exit().remove()
    cars.enter().append("circle").merge(cars)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", "0.8vh")
        .attr("class", "user")
        .attr("opacity", "1")
        .attr("style", "fill:blue")
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


const drawVehicles = (currentSvg, cars, user, userLoc, pitting, radius) => {
    if (!currentSvg) return
    const svg = d3.select(currentSvg)
    const size = getSize(currentSvg)
    const raceLine = svg.selectAll(".raceLine").node()
    if(!raceLine) return

    const carData = cars.map(car => {
        const data = car.data
        const user = car.user
        const point = scalePoint({x: data.x, y:data.y}, size)
        const entry = {x: point.x, y: point.y, username: user.username, carNr: user.carNr}
        return entry
    })
    const scaleX = (d) => size.marginLeft + d  * size.width / maxX
    const scaleY = (d) => size.marginTop + (maxY - d)  * size.height / maxY
    const point = userLoc
    let userData = {x: scaleX(point.x), y: scaleY(point.y)}

    drawOpponents(svg, carData, user);

    const scale = (d) => d * size.width / maxX
    drawUser(svg, userData, pitting);
    // drawRadius(currentSvg, radius)
}

const getSize = (svgElement) => { 
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

const scalePoint = (point, size) => {
    let scaledPoint = point
    scaledPoint.x = size.marginLeft + point.x * size.width / maxX;
    scaledPoint.y = size.marginTop + (maxY - point.y) * size.height / maxY;
    return scaledPoint;
}

const scaleControlPoints = (points, size) => {
    const pointsCopy = JSON.parse(JSON.stringify(points));
    const scaledPoints = pointsCopy.map((point, i) => {
        let scaledPoint = scalePoint(point, size)
        scaledPoint.setControlPoint = points[i].setControlPoint
        return scaledPoint
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
    drawBorder(svg, pitLeftBorder, size, "pitLeftBorder", true)
    drawBorder(svg, pitRightBorder, size, "pitRightBorder", true)
    drawBorder(svg, pitCenterBorder, size, "pitCenterBorder", true)
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
        .attr("fill", (d) => d.stage == currentStage ? "white" : (d.stage == 0) ? "green" : "red")
        .on("click", (event, d) => d.setControlPoint())
}

const Track = React.memo((props) => {
    const svgElement=useRef(null)

    const initialize = () => {
        const svg = d3.select(svgElement.current)
        svg.selectAll("*").remove();

        drawTrack(svgElement.current, props.raceLine, props.getThrottleUI)
        drawControlPoints(svgElement.current, props.currentStage, props.controlPointsUI)
        drawVehicles(svgElement.current, props.cars, props.user, props.userLoc, props.pitting, props.radius)
    }

    const resizeListener = () => {
        window.addEventListener('resize', initialize)
        return () => window.removeEventListener('resize', initialize)
    }

    const updateControlPoints = () => {
        drawControlPoints(svgElement.current, props.currentStage, props.controlPointsUI)
    }   

    useEffect(resizeListener, [props.raceLine, props.pitting])
    useEffect(initialize, [])
    useEffect(updateControlPoints, [props.controlPointsUI])

    useEffect(() => drawTrack(svgElement.current, props.raceLine, props.getThrottleUI), [props.raceLine])
    useEffect(() => drawVehicles(svgElement.current, props.cars, props.user, props.userLoc, props.pitting, props.radius), [props.cars, props.userLoc])

    return <svg id="trackSvg" width="100%" height="100%" ref={svgElement}></svg>
})

export default Track;
  