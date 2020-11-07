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

const fullToControlMap = Object.values(controlToFullMap).flatMap((fullIndices, controlIndex) => {
    if(fullIndices.length == 1) return controlIndex
    else return [controlIndex, controlIndex, controlIndex]
})

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


const TrackController = (props) => {
    const [count, setCount] = useState(0)
    const [cars, setCars] = useState([])
    const [currentStage, setCurrentStage] = useState(11)
    const [controlPoints, setControlPoints] = useState(Array(27).fill({lane: "Center", throttle: 3, distance: 0}))
    const [raceLine, setRaceLine] = useState(centerLane)

    // const [controlPoints, setControlPoints] = useState( [
        // "Center", "Center", "Left", "Left", "Right", "Left", "Left", "Right", "Left", 
        // "Left", "Left", "Left", "Right", "Left", "Left", "Left", "Right", "Left", 
        // "Center", "Right", "Left", "Right", "Right", "Center", "Left", "Right", "Left"
        // ]
    // )

    const sleep = (ms) => {
       return new Promise(resolve => setTimeout(resolve, ms));
    } 

    const loop = async () => {
        let c = 0
        let socket = connectSocket()
        while(true) {
            c++
            setCount(c)
            let data = {"counter": c}
            let message = JSON.stringify(data)
            try {
                socket.send(message)
            } catch {
                console.log("Couldn't send")
            }
            await sleep(50);
        }
    }

    const connectSocket = () => {
        let connectionType = window.APP_DEBUG ? "ws" : "wss"
        let host = "://" + window.location.hostname
        let port = window.APP_DEBUG ? ":6001" : ':6002'
        let path = "/update-server/"
        let key = window.PUSHER_APP_KEY
        let user = "/" + props.user.id
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

    const updateRaceLine = (controlPoints) => {
        const raceLine = controlPoints.flatMap((point, i) => {
            const indices = controlToFullMap[i]
            if (indices.length == 1) 
                return [getControlPoint(indices, point.lane)]
            else {
                const totalIndices = centerLane.length
                const prevLane = controlPoints[(i-1 + totalIndices) % totalIndices].lane
                const nextLane = controlPoints[(i+1) % totalIndices].lane
                return calculateRaceSupportPoints(indices, point.lane, prevLane, nextLane)
            }
        })
        setRaceLine(raceLine)
    }

    const initialize = () => {
        console.log("Initializing TrackController")
        window.Echo.channel('carPhysics')
            .listen('CarsUpdated', (e) => {
                setCars(e.carPhysics)
            });
        updateRaceLine(controlPoints)
        loop()
    }

    const setControlPoint = (pointIndex, lane=null, throttle=null, distance=null) => {
        const newPoints = controlPoints.map((oldPoint, i) => {
            const newLane = lane ? lane : oldPoint.lane
            const newThrottle = throttle ? throttle : oldPoint.throttle
            const newDistance = distance ? distance : oldPoint.distance
            const newPoint = {
                lane: newLane, 
                throttle: newThrottle,
                distance: newDistance
            }
            return i === pointIndex ? newPoint: oldPoint
        })
        updateRaceLine(newPoints)
        setControlPoints(newPoints)
    }

    useEffect(initialize, [])

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
                cars={cars}
                user={props.user}
                currentStage={currentStage}
                setCurrentStage={setCurrentStage}
                controlPoints={controlPoints}
                setControlPoint={setControlPoint}
                raceLine={raceLine}
            /> 
        </div> 
    )
    
} 

export default TrackController