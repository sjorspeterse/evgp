import React, {useState, useEffect, useRef} from 'react';
import * as d3 from "d3";
import "./AnimatedPath.css"

let points = [
    [235.742087, 119.364972],
    [280.921648, 92.42308501],
    [306.6612995, 95.36814958],
    [318.8718334, 102.7853492],
    [346.4715491, 98.64044355],
    [354.0119253, 81.29728551],
    [357.6511773, 32.43102889],
    [349.3052906, 11.96101217],
    [323.7427627, 14.76064145],
    [215.5060971, 55.11893375],
    [128.2351698, 67.11734497],
    [56.16302814, 33.41271708],
    [17.27348445, 15.70597082],
    [21.82599323, 51.01038688],
    [85.32271461, 122.9644954],
    [101.152784, 150.4881236],
    [116.813711, 162.450176],
    [135.5841745, 150.9971471],
    [228.1434481, 74.20731524],
    [299.7189815, 47.91988702],
    [328.8349487, 57.08231013],
    [299.6961021, 76.06161516],
    [271.3349795, 77.58868568],
    [247.547974, 87.84187345],
    [149.1362898, 162.9591995],
    [139.515243, 190.41011],
    [167.8480176, 179.0297987]
];



const AnimatedPath = (props) => {
    let svgElement=useRef(null)


    useEffect(() => {
        drawTrack();
    }, [])

    let drawTrack = () => {
        let divWidth = svgElement.current.clientWidth
        let divHeight = svgElement.current.clientHeight

        let height
        let width
        if(divWidth > 2 * divHeight) {
            width = 2 * divHeight
            height = divHeight
        } else {
            width = divWidth
            height = divWidth / 2
        }

        const svg = d3.select(svgElement.current)
            // .style("border", "1px solid white")
            .attr("width", width)
            .attr("height", height)

        points = points.map(c => {
            let scaled = c;
            scaled[0] = c[0] * width / 400;
            scaled[1] = (200 - c[1]) * height / 200;
            return scaled;
        })

        const path = svg.append("path")
            .data([points])
            .attr("d", d3.line()
            .curve(d3.curveCatmullRomClosed.alpha(0.5))
                // .curve(d3.curveCardinalClosed)
            );
        
        svg.selectAll(".point")
            .data(points)
            .enter().append("circle")
            .attr("r", 5)
            .attr("transform", function(d) { return "translate(" + d + ")"; });
        
        // const circle = svg.append("circle")
            // .attr("r", 13)
            // .attr("transform", "translate(" + points[0] + ")");
        
        // transition();
        
        function transition() {
            circle.transition()
                .duration(10000)
                .attrTween("fill", function() {
                    return d3.interpolateRgb("red", "blue");
                  });
                // .attrTween("transform", translateAlong(path.node()))
                // .each("end", transition);
        }
        
        // Returns an attrTween for translating along the specified path element.
        function translateAlong(path) {
            let l = path.getTotalLength();
            return function(d, i, a) {
                return function(t) {
                    var p = path.getPointAtLength(t * l);
                    return "translate(" + p.x + "," + p.y + ")";
                };
            };
        }
    }

    return <svg width="100%" height="100%" ref={svgElement}></svg>
}


export default AnimatedPath;
  