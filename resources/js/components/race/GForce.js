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

const scaleXY = (x, y, size) => {
    const xRange = 2
    const yRange = 2
    if(x < -1) x = -1
    if(x > 1) x = 1
    if(y < -1) y = -1
    if(y > 1) y = 1
    let scaledX = size.marginLeft + (x+1) * size.width / xRange;
    const scaledY = size.marginTop + (yRange - (y+1)) * size.height / yRange;
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
    const point = scaleXY(gForce[1], gForce[0], size)

    const force = svg.selectAll(".gForce")
        .data([point])

    force
        .attr("cx", d => d[0])
        .attr("cy", d => d[1])

    force
        .enter() 
        .append("circle")
        .attr("r", "0.8vh")
        .attr("class", "gForce")
        .attr("opacity", "1")
        .attr("style", "fill:red")
}

const drawGrid = (currentSvg) => {
    const svg = d3.select(currentSvg)
    svg.selectAll("*").remove();

    drawLine(currentSvg, [0, -0.9], [0, 0.9])
    drawLine(currentSvg, [-0.9, 0], [0.9, 0])

    const f = 0.5 * Math.sqrt(2)
    drawLine(currentSvg, [-0.9 * f, -0.9*f], [0.9*f, 0.9*f])
    drawLine(currentSvg, [0.9 * f, -0.9*f], [-0.9*f, 0.9*f])

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