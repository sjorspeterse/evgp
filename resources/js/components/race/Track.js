import React, {useEffect, useRef} from 'react';
import * as d3 from "d3";
import "./Track.css"

let leftLane = [
    [238.7409168,123.3658496],
    [281.96077,97.31391576],
    [304.7456734,99.98663164],
    [316.9339726,107.3945461],
    [349.7064054,102.4530154],
    [358.9354693,82.16832759],
    [362.6455747,32.19439553],
    [351.5679134,7.502252469],
    [322.1518605,10.02049058],
    [214.0150673,50.34642602],
    [128.9163362,62.16396105],
    [59.59552298,29.7770632],
    [14.67468817,11.43440695],
    [17.74913674,53.90507878],
    [81.20508673,125.8008911],
    [97.05824947,153.3577554],
    [116.4397386,167.4361708],
    [138.8654756,154.7698203],
    [230.6232743,78.54902714],
    [300.9314277,52.7706575],
    [323.8536301,57.51412566],
    [299.6961021,71.06161516],
    [270.3545521,72.68575164],
    [245.0211377,83.5273517],
    [145.8143897,159.2222248],
    [136.5465616,194.4334084],
    [171.5593651,182.3803061],
];

let rightLane = [
    [232.7432576,115.3640945],
    [279.8825259,87.53225425],
    [308.5769256,90.74966752],
    [320.8096942,98.17615242],
    [343.2366927,94.82787166],
    [349.0883813,80.42624343],
    [352.65678,32.66766225],
    [347.0426678,16.41977187],
    [325.3336648,19.50079233],
    [216.997127,59.89144148],
    [127.5540034,72.0707289],
    [52.7305333,37.04837097],
    [19.87228073,19.97753469],
    [25.90284972,48.11569498],
    [89.4403425,120.1280997],
    [105.2473186,147.6184917],
    [117.1876834,157.4641811],
    [132.3028734,147.2244738],
    [225.663622,69.86560334],
    [298.5065353,43.06911654],
    [333.8162674,56.6504946],
    [299.6961021,81.06161516],
    [272.3154069,82.49161971],
    [250.0748104,92.1563952],
    [152.4581899,166.6961741],
    [142.4839245,186.3868116],
    [164.13667,175.6792914]
]

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

const drawPoint = (svg, offset) => {
    let ellipses = svg.selectAll(".myEllipse")
    .data(offset)

    ellipses
        .attr("cx", d => d[0])
        .attr("cy", d => d[1])

    ellipses
        .enter() 
        .append("ellipse")
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("class", "myEllipse")
        .attr("style", "fill:red")

    
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

const update = (svg, counter) => {
    let offset = [[points[0][0], points[0][1]],
        [points[0][0], points[0][1]]]
    offset[0][0] = points[0][0] + counter
    drawPoint(svg, offset);
}

let setSize = (svgElement) => {            
    let divWidth = svgElement.clientWidth
    let divHeight = svgElement.clientHeight

    let height
    let width
    if(divWidth > 2 * divHeight) {
        width = 2 * divHeight
        height = divHeight
    } else {
        width = divWidth
        height = divWidth / 2
    }
    return [width, height];
}

const drawTrack = (svg, points, width, height) => {
    svg
        .attr("width", width)
        .attr("height", height)
    points = points.map(c => {
        let scaled = c;
        scaled[0] = c[0] * width / 370;
        scaled[1] = (200 - c[1]) * height / 200;
        return scaled;
    })

    const path = svg.append("path")
        .data([points])
        .attr("d", d3.line()
        .curve(d3.curveCatmullRomClosed.alpha(0.5))
        );
    
    svg.selectAll(".point")
        .data(points)
        .enter().append("circle")
        .attr("r", 3)
        .attr("transform", function(d) { return "translate(" + d + ")"; });
}


const Track = (props) => {
    let svgElement=useRef(null)

    let initialize = () => {
        let [width, height] = setSize(svgElement.current);
        let svg = d3.select(svgElement.current)

        drawTrack(svg, points, width, height);
        drawTrack(svg, leftLane, width, height);
        drawTrack(svg, rightLane, width, height);
    }

    let svg = d3.select(svgElement.current)
    update(svg, props.count)

    useEffect(initialize , [])
    
    return <svg width="100%" height="100%" ref={svgElement}></svg>
}

export default Track;
  