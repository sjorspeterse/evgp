import React, {useEffect, useState} from "react"
import StageSetting from "./StageSetting";
import PitLaneActivities from "./PitLaneActivities";
import Track from "./Track";
import * as d3 from "d3";
import {leftLane, rightLane, centerLane} from "./TrackData"

const controlToFullMap = {
    0: [0], 1: [1], 2: [2], 3: [3], 4: [4, 5, 6], 5: [7], 6: [8], 7: [9, 10, 11],
    8: [12], 9: [13], 10: [14], 11: [15], 12: [16, 17, 18], 13: [19], 14: [20],
    15: [21], 16: [22, 23, 24], 17: [25], 18: [26], 19: [27], 20: [28, 29, 30],
    21: [31], 22: [32], 23: [33], 24: [34], 25: [35, 36, 37], 26: [38]
}


const fullToControl = (fullArray) => {
    return Object.keys(controlToFullMap)
        .map(controlIndex => {
            const indices = controlToFullMap[controlIndex]
            let index
            if(indices.length == 1) index = [0]
            else index = 1
            const newIndex = indices[index]
            return fullArray[newIndex]
        })
}

const leftControl = fullToControl(leftLane)
const centerControl = fullToControl(centerLane)
const rightControl = fullToControl(rightLane)

const getLane = (lane) => {
    if(lane === "Left") {
        return leftLane
    } else if(lane === "Center") {
        return centerLane
    } else if (lane === "Right") {
        return rightLane
    }
}

const getControlPoint = (index, lane) => {
    return getLane(lane)[index]
}

const calculateRaceSupportPoints = (indices, side, prevLane, nextLane) => {
    const totalIndices = centerLane.length
    const index1 = (indices[0] - 1 + totalIndices) % totalIndices // Control point
    const index2 = indices[0] // support point
    const index3 = indices[1] // control point
    const index4 = indices[2] // support point 
    const index5 = (indices[2] + 1) % totalIndices // control point

    const support1 = calculateSingleSupportPoint(index1, index2, index3, prevLane, side)
    const support2 = calculateSingleSupportPoint(index3, index4, index5, side, nextLane)

    // Adjusted support points:
    const lane = getLane(side)
    return [support1, lane[index3], support2]

    // Fixed support points:
    // return [scaledLane[index2], scaledLane[index3], scaledLane[index4]]

    // No support points:
    // return [scaledLane[index3]] // without support points
}

const getLeftLane = (lane1, lane2) => {
    if (lane1 === "Left" || lane2 == "Left") return "Left"
    if (lane1 === "Center" || lane2 == "Center") return "Center"
    return "Right"
}

const getRightLane = (lane1, lane2) => {
    if (lane1 === "Right" || lane2 == "Right") return "Right"
    if (lane1 === "Center" || lane2 == "Center") return "Center"
    return "Left"
}

const calcDist = (point1, point2) => {
    const x1 = point1[0]
    const y1 = point1[1]
    const x2 = point2[0]
    const y2 = point2[1]
    return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2))
}


const calculateSingleSupportPoint = (startIndex, middleIndex, endIndex, lane1, lane2) => {
    const leftLabel = getLeftLane(lane1, lane2)
    const rightLabel = getRightLane(lane1, lane2)

    const startLeft = getControlPoint(startIndex, leftLabel)
    const startRight = getControlPoint(startIndex, rightLabel)
    const middleLeft = getControlPoint(middleIndex, leftLabel)
    const middleRight = getControlPoint(middleIndex, rightLabel)
    const endLeft = getControlPoint(endIndex, leftLabel)
    const endRight = getControlPoint(endIndex, rightLabel)

    const leftStartDist = calcDist(startLeft, middleLeft)
    const rightStartDist = calcDist(startRight, middleRight)
    const leftEndDist = calcDist(middleLeft, endLeft)
    const rightEndDist = calcDist(middleRight, endRight)
    const avgStartDist = (leftStartDist + rightStartDist) / 2
    const avgEndDist = (leftEndDist + rightEndDist) / 2

    const tempFrac = avgEndDist / (avgStartDist + avgEndDist)
    const tweak = 2 // tweaking parameter, from 1 to infinity. 
    const frac = (tempFrac < 0.5) ? tempFrac - tempFrac / tweak : tempFrac + (1 - tempFrac)/tweak


    const startSupport = getControlPoint(middleIndex, lane1)
    const endSupport = getControlPoint(middleIndex, lane2)
    const supportX = frac * startSupport[0] + (1-frac) * endSupport[0]
    const supportY = frac * startSupport[1] + (1-frac) * endSupport[1]

    return [supportX, supportY]
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
} 

const connectSocket = (userId) => {
    let connectionType = window.APP_DEBUG ? "ws" : "wss"
    let host = "://" + window.location.hostname
    let port = window.APP_DEBUG ? ":6001" : ':6002'
    let path = "/update-server/"
    let key = window.PUSHER_APP_KEY
    let user = "/" + userId
    let url = connectionType + host + port + path + key + user
    let socket = new WebSocket(url);

    socket.onopen = function(e) {
        console.log("[open] Connection established");
        };
        
        socket.onmessage = function(event) {
        console.log(`[message] Data received from server: ${event.data}`);
        };
        
        socket.onclose = function(event) {
        if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            console.log('[close] Connection died');
        }
        };
        
        socket.onerror = function(error) {
        console.log(`[error] ${error.message}`);
        };
        
        return socket
}

const loop = async (userId, setCount) => {
    let c = 0
    while(true) {
        c++
        setCount(c)
        await sleep(50);
    }
}

const updateRaceLine = (controlPoints, setRaceLine) => {
    const raceLine = controlPoints.flatMap((controlPoint, i) => {
        const indices = controlToFullMap[i]
        if (indices.length == 1) {
            const point = getControlPoint(indices, controlPoint.lane)
            return [{x: point[0], y: point[1], distance: 0}]
        } else {
            const totalIndices = centerLane.length
            const prevLane = controlPoints[(i-1 + totalIndices) % totalIndices].lane
            const nextLane = controlPoints[(i+1) % totalIndices].lane
            const supportPoints = calculateRaceSupportPoints(indices, controlPoint.lane, prevLane, nextLane)
            return supportPoints.map(p => ({x: p[0], y: p[1], distance: 0}))
        }
    })
    updateDistances(raceLine)
    setRaceLine(raceLine)
}

const updateControlPointsUI = (setControlPoint, setControlPointsUI) => {
    const controlPointsUI = leftControl.flatMap((point, i) => {
        const leftPoint = {x: leftControl[i][0], y: leftControl[i][1], stage: i, setControlPoint: () => {setControlPoint(i, "Left", -2)}}
        const centerPoint = {x: centerControl[i][0], y: centerControl[i][1], stage: i, setControlPoint: () => setControlPoint(i, "Center", -2)}
        const rightPoint = {x: rightControl[i][0], y: rightControl[i][1], stage: i, setControlPoint: () => setControlPoint(i, "Right", -2)}
        return [leftPoint, centerPoint, rightPoint]
    })

    setControlPointsUI(controlPointsUI)
}

const rotateListByOne = (oldList) => {
    const n = oldList.length
    return oldList.map((v, i) => oldList[(n + i-1)%n])
}

const updateDistances = (raceLine) => {
    const raceLineRotated = rotateListByOne(raceLine)

    const Gen = d3.line().x(d=>d.x).y(d=>d.y)
        .curve(d3.curveCatmullRomClosed.alpha(0.5))
    const xmlns = "http://www.w3.org/2000/svg";
    const tempPath = document.createElementNS(xmlns, "path");

    const fullPathString = Gen(raceLineRotated)

    tempPath.setAttributeNS(null, 'd', fullPathString);
    const totalLength = tempPath.getTotalLength()
    raceLine[0].distance = totalLength

    let index = fullPathString.indexOf('C', 0)
    for(let i = 1; i < raceLine.length; i++) {
        index = fullPathString.indexOf('C', index+1)
        const subPathString = fullPathString.substring(0, index)
        tempPath.setAttributeNS(null, 'd', subPathString);

        const partialLength = tempPath.getTotalLength()
        raceLine[i].distance = partialLength
    }
}

const initialRaceLine = centerLane.map( (p) => ({x: p[0], y: p[1], distance: 1}) )

const getThrottleAtDistance = (controlPoints, raceLine, distance) => {
    if (!raceLine) {
        console.log("Raceline not defined!")
        return 0
    }
    const controlRaceLine = fullToControl(raceLine)

    const nrPoints = controlPoints.length
    for(let i = 0; i < nrPoints; i++) {
        const startDistance = (i == 0) ? 0 : controlRaceLine[i].distance
        const endDistance = controlRaceLine[(i+1)%nrPoints].distance
        const rampDistance = endDistance - 10
        if(distance >= startDistance && distance <= endDistance) {
            const throttle1 = controlPoints[i].throttle
            const throttle2 = controlPoints[(i+1)%nrPoints].throttle
            if(distance < rampDistance) return throttle1
            else {
                const fraction = (endDistance - distance) / 10
                return fraction * throttle1 + (1 - fraction) * throttle2
            }
        }
    }

    console.log("Warning: Incorrect distance provided to getThrottleAtDistance: ", distance, 
        ", max distance is ", raceLine[0].distance)
    return 0
}

const updateAnalyst = (physics, setAnalystData, value) => {
    const newValue = value.toFixed(1)
    const current = physics.imotor.toFixed(1)
    setAnalystData({speed: 0, voltage: 0, current: current, ampHours: 0, power: 0, wattHours: newValue})
}

const polynomial = (v, constant, p1, p2=0, p3=0, p4=0, p5=0, p6=0) => {
    return constant + p1 * v + p2 * Math.pow(v, 2) + p3 * Math.pow(v, 3) + p4 * Math.pow(v, 4) + p5 * Math.pow(v, 5) + p6 * Math.pow(v, 6) 
}

const updatePhysics = (raceLine, controlPoints, physics, setPhysics, socket, setAnalystData) => {
    const g=9.812  // physical constants
    const m=159, D=0.4064, crr=0.017, wheelEff=1  // vehicle parameters
    const thmax=5, thregn=1.5, rpmMax=750  // throttle parameters
    const gearEff=1  // sprocket/chain parameters

    // to get from physics:
    const velocity = 25, soc = 100, rpm = 0

    const rpmv = physics.rpmv

    const time = Date.now()
    const dt = (time - physics.time) / 1000
    physics.time = time

    const th = getThrottleAtDistance(controlPoints, raceLine, physics.distance)

    const distance = velocity * dt 
    physics.distance = (physics.distance + distance) % raceLine[0].distance
    
    const trmax = polynomial(rpmv, 81.6265, -1.24086, -3.19602, 0.710122, -0.0736331, 0.00390688, -0.000085488)
    const imax = rpmv <= 13.79361 ? -0.6174*rpmv + 41.469 : -0.6174* rpmv + 41.469

    let trmotor = trmax * Math.pow(th / thmax, 1.6)
    if (th < 0) trmotor = trmax * th * thregn * Math.pow(rpm/rpmMax, 2)
    if (soc <= 0) trmotor = 0

    let imotor = imax * Math.pow(th / thmax, 1.6)
    if (th < 0) imotor = imax * th * thregn * Math.pow(rpm / rpmMax, 2)
    if (soc <= 0) imotor = 0

    const ftire = trmotor / (D/2) * gearEff
    const frr = m * g * crr / wheelEff

    physics.imotor = imotor


    setPhysics(physics)
    updateAnalyst(physics, setAnalystData, ftire)

    let data = {"counter": physics.distance}
    let message = JSON.stringify(data)
    try {
        socket.send(message)
    } catch {
        console.log("Couldn't send")
    }
}

const TrackController = (props) => {
    const [count, setCount] = useState(0)
    const [physics, setPhysics] = useState({time: Date.now(), distance: 0, trmax: 0, rpmv: 0})
    const [cars, setCars] = useState([])
    const [normalizedCars, setNormalizedCars] = useState([])
    const [currentStage, setCurrentStage] = useState(11)
    const [controlPoints, setControlPoints] = useState(Array(27).fill({lane: "Center", throttle: 3}))
    const [raceLine, setRaceLine] = useState(initialRaceLine)
    const [controlPointsUI, setControlPointsUI] = useState()
    const [socket, setSocket] = useState(null)

    // const [controlPoints, setControlPoints] = useState( [
        // "Center", "Center", "Left", "Left", "Right", "Left", "Left", "Right", "Left", 
        // "Left", "Left", "Left", "Right", "Left", "Left", "Left", "Right", "Left", 
        // "Center", "Right", "Left", "Right", "Right", "Center", "Left", "Right", "Left"
        // ]
    // )


    useEffect(() => updatePhysics(raceLine, controlPoints, physics, setPhysics, socket, props.setAnalystData), [count])

    const initialize = () => {
        window.Echo.channel('carPhysics')
            .listen('CarsUpdated', (e) => setCars(e.carPhysics))
        updateControlPointsUI(setControlPoint, setControlPointsUI)
        updateRaceLine(controlPoints, setRaceLine)
        const socket = connectSocket(props.user.id)
        setSocket(socket)
        loop(props.user.id, setCount, raceLine)
    }

    const setControlPoint = (pointIndex, lane=null, throttle=-2) => {
        const newPoints = controlPoints.map((oldPoint, i) => {
            const newLane = lane ? lane : oldPoint.lane
            const newThrottle = throttle != -2 ? throttle : oldPoint.throttle
            const newPoint = { lane: newLane, throttle: newThrottle}
            return i === pointIndex ? newPoint: oldPoint
        })
        updateRaceLine(newPoints, setRaceLine)
        setControlPoints(newPoints)
        setCurrentStage(pointIndex)
    }

    useEffect(initialize, [])
    useEffect(() => updateControlPointsUI(setControlPoint, setControlPointsUI), [controlPoints]) 

    const getThrottleUI = (normDist) => getThrottleAtDistance(controlPoints, raceLine, normDist*raceLine[0].distance)
    const normalizedDistance = physics.distance/raceLine[0].distance

    useEffect(() => {
        if(cars.length == 0) {
            return
        }
        const newCars = cars.map(c => {
            c.data.counter /= raceLine[0].distance
            return c
        }) 
        setNormalizedCars(newCars)
    }, [cars])

    return (
        <div id="trackContainer"
            style={{
                "height": "100%",
                "margin": "auto",
                "position": "relative"
            }}
        >
            <div className=" stageSettingDiv border">
                <StageSetting
                    currentStage={currentStage}
                    controlPoint={controlPoints[currentStage]}
                    setControlPoint={setControlPoint}
                />
            </div>
            <div className=" pitLaneActivitiesDiv border"><PitLaneActivities/></div>
            <Track 
                count={count}
                normalizedDistance={normalizedDistance}
                cars={normalizedCars}
                user={props.user}
                currentStage={currentStage}
                raceLine={raceLine}
                controlPointsUI={controlPointsUI}
                getThrottleUI={getThrottleUI}
            /> 
        </div> 
    )
    
} 

export default TrackController