import React, {useState, useEffect, useRef} from 'react';
import * as d3 from "d3";
import "./Track.css"

const leftLane = [[237.122045,124.6850213],
[280.445307,97.69561221],
[303.7998594,99.57548194],
[315.2450975,106.670053],
[336.7492787,108.0377518],
[348.355324,103.6645193],
[355.7850204,94.1218377],
[358.494658,83.82223594],
[362.757373,34.05535274],
[359.9565303,17.29265778],
[353.6600715,8.868980857],
[343.2238845,6.05243221],
[323.8672123,9.485390772],
[215.7067029,49.81826109],
[130.6004516,62.37411628],
[60.49788415,30.79533967],
[29.7968603,9.261002451],
[16.3285338,10.72330916],
[6.955296614,22.52119583],
[16.85312827,52.77980585],
[80.25367355,124.7363824],
[96.08182918,151.8930554],
[105.7002708,162.5348962],
[113.9195812,166.9890952],
[126.0800363,164.3796773],
[137.1983497,155.9700161],
[229.7356293,78.97163371],
[299.1858495,53.20696336],
[319.5747946,51.37297504],
[323.7019067,56.79675094],
[322.1089063,64.30364167],
[301.4413255,71.06161516],
[272.2485042,72.44022017],
[246.0677144,82.89939671],
[147.198799,158.07203],
[129.9718107,178.1183683],
[134.8888247,192.6340259],
[147.9544915,197.3336158],
[170.572456,183.3746037]]

const rightLane = [[230.8693768,116.8809108],
[277.9068326,88.02316953],
[306.9057912,90.07005256],
[319.8816209,97.80988082],
[336.1282879,98.00988596],
[342.6228902,95.47066772],
[346.0847113,91.18938571],
[348.6539205,82.04462904],
[352.7602968,34.29715194],
[350.5682752,20.73658945],
[347.566926,16.79826693],
[343.098893,16.05165104],
[327.1096468,18.94512748],
[218.7968251,59.32884176],
[129.3599802,72.29687953],
[53.78977491,38.21162381],
[27.80411427,19.06043934],
[20.32789709,19.88873841],
[16.67101931,24.88862745],
[25.05540834,47.05943859],
[88.50281142,119.0837967],
[104.4806437,146.4653566],
[113.2230058,155.5512597],
[116.217926,157.2567979],
[119.895201,156.4115473],
[130.9868615,148.1330897],
[224.3688508,70.53376143],
[296.7609572,43.5054224],
[323.2461509,42.02187405],
[333.3887327,54.31372829],
[330.9642606,68.94936008],
[301.4413255,81.06161516],
[273.9122564,82.30084532],
[251.2108271,91.4754326],
[153.6206127,165.7375573],
[139.8422166,179.7230763],
[142.1075775,185.7137942],
[147.8295077,187.3511293],
[163.3769368,176.4302173]]

const centerLane = [[234.2505183,120.4193779],
[279.1760698,92.85939087],
[305.3528253,94.82276725],
[317.5633592,102.2399669],
[336.3238019,103.1125786],
[345.4891071,99.56759351],
[350.9485616,92.64123794],
[353.5742893,82.93343249],
[357.7588349,34.17625234],
[354.7176412,18.25108836],
[350.6134988,12.83362389],
[342.7250828,11.05204162],
[325.4884295,14.21525913],
[217.251764,54.57355142],
[129.9802159,67.3354979],
[57.14382953,34.50348174],
[28.80048729,14.16072089],
[18.32821544,15.30602378],
[11.81315796,23.70491164],
[20.95426831,49.91962222],
[84.37824249,121.9100896],
[100.2812365,149.179206],
[109.3991717,159.177882],
[115.0687536,162.1229466],
[122.9235893,160.4867996],
[134.0926056,152.0515529],
[227.0522401,74.75269757],
[297.9734033,48.35619288],
[321.5352501,46.72004589],
[328.5453197,55.55523961],
[326.5365834,66.62650088],
[301.4413255,76.06161516],
[273.0803803,77.37053274],
[248.6392708,87.18741465],
[150.4097058,161.9047936],
[134.9070136,178.9207223],
[138.4982011,189.17391],
[147.7671289,192.3371276],
[166.9746964,179.9024105]]

const maxX = 370
const maxY = 200

const pointsMap = {
    0: [0], 1: [1], 2: [2], 3: [3], 4: [4, 5, 6], 5: [7], 6: [8], 7: [9, 10, 11],
    8: [12], 9: [13], 10: [14], 11: [15], 12: [16, 17, 18], 13: [19], 14: [20],
    15: [21], 16: [22, 23, 24], 17: [25], 18: [26], 19: [27], 20: [28, 29, 30],
    21: [31], 22: [32], 23: [33], 24: [34], 25: [35, 36, 37], 26: [38]
}

const getControlPoints = (lane) => {
    return Object.keys(pointsMap).map(i => {
        const indices = pointsMap[i]
        if(indices.length == 1) {
            return lane[indices[0]]
        } else {
            return lane[indices[1]]
        }
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

const drawTrack = (svg, lane) => {
    const path = svg.append("path")
        .data([lane])
        .attr("d", d3.line()
        .curve(d3.curveCatmullRomClosed.alpha(0.5))
        );

    const controlPoints = getControlPoints(lane)

    svg.selectAll("controlPoint")	
        .data(controlPoints)	
        .enter().append("circle")	
        .attr("class", "controlPoint")
        .attr("transform", d => "translate(" + d + ")");
    return path
}

const initialize = (svgElement, setRaceLine) => {
    const size = getSize(svgElement.current, maxX/maxY);
    const svg = d3.select(svgElement.current)
    svg.selectAll("*").remove();
    const scaledLeftLane = scaleLane(leftLane, size, maxX, maxY)
    const scaledCenterLane = scaleLane(centerLane, size, maxX, maxY)
    const scaledRightLane = scaleLane(rightLane, size, maxX, maxY)

    const line = drawTrack(svg, scaledCenterLane);
    setRaceLine(line)
    drawTrack(svg, scaledLeftLane, size);
    drawTrack(svg, scaledRightLane, size);
}

const Track = (props) => {
    const svgElement=useRef(null)
    const [raceLine, setRaceLine] = useState(null)

    const handleResize = () => {
        initialize(svgElement, setRaceLine)   
    }

    const resizeListener = () => {
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }

    let svg = d3.select(svgElement.current)
    update(svg, raceLine, props.cars, props.user)

    useEffect(resizeListener, [])
    useEffect(() => initialize(svgElement, setRaceLine) , [])
    
    return <svg width="100%" height="100%" ref={svgElement}></svg>
}

export default Track;
  