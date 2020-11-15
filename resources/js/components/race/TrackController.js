import React, {useEffect, useState} from "react"
import StageSetting from "./StageSetting";
import PitLaneActivities from "./PitLaneActivities";
import Track from "./Track";
import * as d3 from "d3";
// import {leftLane, rightLane, centerLane, controlToFullMap, nControlPoints} from "./RaceTrackData"
import {leftLane, rightLane, centerLane, pitLeftLane, pitLanePoints, controlToFullMap, nControlPoints} from "./PracticeTrackData"
import {updatePhysics, getInitialPhysicsState} from "./Physics"

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

const goToPitLane = (setMultipleControlPoints) => {
    const points = pitLanePoints.map(i => {return {index: i, lane: "Pit", throttle: "-2"}})
    setMultipleControlPoints(points)

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
    } else if (lane === "Pit") {
        return pitLeftLane
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

const updateRaceLine = (controlPoints, setRaceLine, setRealPath) => {
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
    updateDistances(raceLine, setRealPath)
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

const updateDistances = (raceLine, setRealPath) => {
    const raceLineRotated = rotateListByOne(raceLine)
    const Gen = d3.line().x(d=>d.x).y(d=>d.y)
        .curve(d3.curveCatmullRomClosed.alpha(0.5))
    const xmlns = "http://www.w3.org/2000/svg";
    const realPath = document.createElementNS(xmlns, "path");

    const fullPathString = Gen(raceLineRotated)

    realPath.setAttributeNS(null, 'd', fullPathString);
    const totalLength = realPath.getTotalLength()
    raceLine[0].distance = totalLength

    let index = fullPathString.indexOf('C', 0)
    for(let i = 1; i < raceLine.length; i++) {
        index = fullPathString.indexOf('C', index+1)
        const subPathString = fullPathString.substring(0, index)
        realPath.setAttributeNS(null, 'd', subPathString);

        const partialLength = realPath.getTotalLength()
        raceLine[i].distance = partialLength
    }

    realPath.setAttributeNS(null, 'd', fullPathString);
    setRealPath(realPath)
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

const updateServer = (socket, physics) => {
    const data = {
        counter: physics.pos,  
        x: physics.x,
        y: physics.y,
        heatLaps: physics.heatLaps,
        totalLaps: physics.totalLaps,
        lastLapTime: physics.lastLapTime,
        fastestLapTime: physics.fastestLapTime,
        timeSinceLastFinish: physics.timeSinceLastFinish
    }
    let message = JSON.stringify(data)
    try {
        socket.send(message)
    } catch {
        console.log("Couldn't send")
    }
}

const TrackController = (props) => {
    const [count, setCount] = useState(0)
    const [physics, setPhysics] = useState(getInitialPhysicsState())
    const [cars, setCars] = useState([])
    const [normalizedCars, setNormalizedCars] = useState([])
    const [currentStage, setCurrentStage] = useState(0)
    const [controlPoints, setControlPoints] = useState(Array(nControlPoints).fill({lane: "Center", throttle: 3}))
    const [raceLine, setRaceLine] = useState(initialRaceLine)
    const [controlPointsUI, setControlPointsUI] = useState()
    const [socket, setSocket] = useState(null)
    const [realPath, setRealPath] = useState(null)

    const trackDistance = raceLine[0].distance

    const getThrottle = (d) => getThrottleAtDistance(controlPoints, raceLine, d%trackDistance)
    useEffect(() => updatePhysics(getThrottle, physics, setPhysics, props.setAnalystData, realPath, props.setGForce), [count])

    const initialize = () => {
        window.Echo.channel('carPhysics')
            .listen('CarsUpdated', (e) => setCars(e.carPhysics))
        updateControlPointsUI(setControlPoint, setControlPointsUI)
        updateRaceLine(controlPoints, setRaceLine, setRealPath)
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
        updateRaceLine(newPoints, setRaceLine, setRealPath)
        setControlPoints(newPoints)
        setCurrentStage(pointIndex)
    }

    const setMultipleControlPoints = (list) => {
        const newPoints = controlPoints.map((oldPoint, i) => {
            const relevantPoint = list.find((changedPoint) => changedPoint.index === i)
            const newLane = relevantPoint ? relevantPoint.lane : oldPoint.lane
            const newThrottle = relevantPoint && relevantPoint.throttle != -2 ? throttle : oldPoint.throttle
            const newPoint = { lane: newLane, throttle: newThrottle}
            return newPoint
        })
        updateRaceLine(newPoints, setRaceLine, setRealPath)
        setControlPoints(newPoints)
    }

    useEffect(initialize, [])
    useEffect(() => updateControlPointsUI(setControlPoint, setControlPointsUI), [controlPoints]) 
    useEffect(() => updateServer(socket, physics), [physics])
    useEffect(() => props.setGoToPitLane(() => () => goToPitLane(setMultipleControlPoints)), [controlPoints])

    const normalize = (d) => (d % trackDistance) / trackDistance
    const getThrottleUI = (normDist) => getThrottleAtDistance(controlPoints, raceLine, normDist*trackDistance)
    const normalizedDistance = normalize(physics.pos)

    useEffect(() => {
        if(cars.length == 0) {
            return
        }
        const newCars = cars.map(c => {
            c.data.counter /= raceLine[0].distance
            return c
        }) 
        setNormalizedCars(newCars)
        props.setHighScore(cars)
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
                radius={physics.radius}
            /> 
        </div> 
    )
    
} 

export default TrackController