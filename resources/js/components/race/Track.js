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

const drawCars = (svg, carsData, user) => {
    const cars = svg.selectAll(".car")
    .data(carsData)

    cars
        .attr("cx", d => d[0])
        .attr("cy", d => d[1])

    cars
        .enter() 
        .append("ellipse")
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("class", "car")
        .attr("style", d => {
            if(d[2] == user.name) {
                return "fill:green"
            } else {
                return "fill:red"
            }
        })
}

const update = (svg, raceLine, cars, user) => {
    if(raceLine) {
        const carData = cars.map(car => {
            const length = raceLine.node().getTotalLength();
            const trackRatio = (car.data.counter % 300) / 300.0
            const point = raceLine.node().getPointAtLength(trackRatio * length)
            const entry = [point.x, point.y, car.user.username]
            return entry
        })

        drawCars(svg, carData, user);
    }
}

let getSize = (svgElement, aspectRatio) => {            
    let divWidth = svgElement.clientWidth
    let divHeight = svgElement.clientHeight

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


const scaleLane = (lane, size, maxX, maxY) => {
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
        );

    return path
}

const drawDivider = (svg, lane) => {
    const path = svg.append("path")
        .data([lane])
        .attr("d", d3.line()
            .curve(d3.curveCatmullRomClosed.alpha(0.5))
        )
        .style("stroke", "gray")
        .attr("stroke-dasharray", "10, 15")

    return path
}

const drawRaceLine = (svg, lane) => {
    const path = svg.append("path")
        .data([lane])
        .attr("d", d3.line()
            .curve(d3.curveCatmullRomClosed.alpha(0.5))
        )
        .style("stroke", "yellow")
    return path
}

const initialize = (svgElement, setRaceLine, setCurrentStage) => {
    const size = getSize(svgElement.current, maxX/maxY);
    const svg = d3.select(svgElement.current)
    svg.selectAll("*").remove();
    const scaledLeftLane = scaleLane(leftLane, size, maxX, maxY)
    const scaledCenterLane = scaleLane(centerLane, size, maxX, maxY)
    const scaledRightLane = scaleLane(rightLane, size, maxX, maxY)
    const scaledLeftBorder = scaleLane(leftBorder, size, maxX, maxY)
    const scaledCenterLeftBorder = scaleLane(centerLeftBorder, size, maxX, maxY)
    const scaledCenterRightBorder = scaleLane(centerRightBorder, size, maxX, maxY)
    const scaledRightBorder = scaleLane(rightBorder, size, maxX, maxY)

    const raceLine = drawRaceLine(svg, scaledCenterLane)
    setRaceLine(raceLine)
    drawControlPoints(svg, scaledCenterLane, setCurrentStage);
    drawControlPoints(svg, scaledLeftLane, setCurrentStage);
    drawControlPoints(svg, scaledRightLane, setCurrentStage);
    drawBorder(svg, scaledLeftBorder)
    drawDivider(svg, scaledCenterLeftBorder)
    drawDivider(svg, scaledCenterRightBorder)
    drawBorder(svg, scaledRightBorder)
}

const Track = (props) => {
    const svgElement=useRef(null)
    const [raceLine, setRaceLine] = useState(null)
    
    const callInitialize = () => initialize(svgElement, setRaceLine, props.setCurrentStage)
    const resizeListener = () => {
        window.addEventListener('resize', callInitialize)
        return () => window.removeEventListener('resize', callInitialize)
    }

    let svg = d3.select(svgElement.current)
    update(svg, raceLine, props.cars, props.user)

    useEffect(resizeListener, [])
    useEffect(callInitialize , [])
    
    return <svg width="100%" height="100%" ref={svgElement}></svg>
}

export default Track;
  