import React, {useRef, useEffect} from "react"
import * as d3 from "d3";

const getSize = (svgElement) => { 
    const aspectRatio = 1         
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

const xRange = 1
const yRange = 0.25

const scaleXY = (x, y, size) => {
    if(x < -xRange) x = -xRange
    if(x > xRange) x = xRange
    if(y < -yRange) y = -yRange
    if(y > yRange) y = yRange
    let scaledX = size.marginLeft + (x+xRange) * size.width / (2*xRange);
    const scaledY = size.marginTop + (2*yRange - (y+yRange)) * size.height / (2*yRange);
    return [scaledX, scaledY]
}

const scale = (d, size) => {
    const range = 2
    return d * size.width / range
}

const drawLine = (currentSvg, p1, p2) => {
    const size = getSize(currentSvg)
    const svg = d3.select(currentSvg)

    const point1 = scaleXY(p1[0], p1[1], size)
    const point2 = scaleXY(p2[0], p2[1], size)

    svg.append('line')
    .style("stroke", "white")
    .style("stroke-width", "0.1vh")
    .attr("x1", point1[0])
    .attr("y1", point1[1])
    .attr("x2", point2[0])
    .attr("y2", point2[1]); 

}

const drawCircle = (currentSvg, r) => {
    const size = getSize(currentSvg)
    const svg = d3.select(currentSvg)

    const r1 = scale(r, size)
    const point = scaleXY(0, 0, size)
    svg.append('circle')
    .style("stroke", "white")
    .style("stroke-width", "0.1vh")
    .attr("r", r1)
    .attr("cx", point[0])
    .attr("cy", point[1])
    .attr("fill", "none")

}

const drawGForce = (currentSvg, gForce) => {
    const svg = d3.select(currentSvg)
    const size = getSize(currentSvg)
    const point = scaleXY(gForce.x, gForce.y, size)

    let color = "yellow"
    if(gForce.brake === "regen") color = "green"
    if(gForce.brake === "brake") color = "red"

    const dataPoint = {x: point[0], y: point[1], color: color}

    const force = svg.selectAll(".gForce")
        .data([dataPoint])

    force
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("fill", d => d.color)

    force
        .enter() 
        .append("circle")
        .attr("r", "0.8vh")
        .attr("class", "gForce")
        .attr("opacity", "1")
}

const drawGrid = (currentSvg) => {
    const svg = d3.select(currentSvg)
    svg.selectAll("*").remove();

    const y90 = 0.9 * yRange
    const y45 = 0.5 * Math.sqrt(2) * y90
    const x90 = 0.9 * xRange
    const x45 = 0.5 * Math.sqrt(2) * x90

    drawLine(currentSvg, [0, -y90], [0, y90]) // vertical
    drawLine(currentSvg, [-x90, 0], [x90, 0]) // horizontal

    drawLine(currentSvg, [-x45, -y45], [x45, y45]) //diagonal
    drawLine(currentSvg, [x45, -y45], [-x45, y45]) //diagonal

    drawCircle(currentSvg, 0.4)
    drawCircle(currentSvg, 0.75)
}


const GForce = (props) => {
    const svgElement=useRef(null)

    const initialize = () => {
        drawGrid(svgElement.current)
    }

    useEffect(() => drawGForce(svgElement.current, props.gForce), [props.gForce])

    const resizeListener = () => {
        window.addEventListener('resize', initialize)
        return () => window.removeEventListener('resize', initialize)
    }

    useEffect(resizeListener, [])
    useEffect(initialize, [])

    return <svg width="100%" height="100%" ref={svgElement}></svg>
}

export default GForce