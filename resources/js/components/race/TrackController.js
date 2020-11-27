import React, {useEffect, useState} from "react"
import {usePrevious} from "./CustomHooks"
import StageSetting from "./StageSetting";
import {PitLaneActivities, driverChangeActivity, checkMirrorsAcitivity, 
    checkSeatbeltActivity, checkHelmetActivity, forgotMirrorsActivity, 
    forgotHelmetActivity, forgotSeatbeltActivity, droveTooFastActivity} 
    from "./PitLaneActivities";
import Track from "./Track";
import * as d3 from "d3";
// import {leftLane, rightLane, centerLane, controlToFullMap, nControlPoints} from "./RaceTrackData"
import {leftLane, rightLane, centerLane, pitLeftLane, pitLanePoints, controlToFullMap, nControlPoints} from "./PracticeTrackData"
import {calculatePhysics, getInitialPhysicsState} from "./Physics"

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

const go = (setForceSpeed, isInPit) => {
    if(isInPit()) {
        setForceSpeed(3)
    } else {
        setForceSpeed(-1)
    }
}

const goToPitLane = (controlPoints, setMultipleControlPoints) => {
    const points = pitLanePoints.map(i => {return {index: i, lane: controlPoints[i].lane, throttle: "-2", pit: true}})
    setMultipleControlPoints(points)
}

const revertRacelineAfterPit = (controlPoints, setMultipleControlPoints) => {
    const points = pitLanePoints.map(i => {return {index: i, lane: controlPoints[i].lane, throttle: "-2", pit: false}})
    setMultipleControlPoints(points)
}

const leftControl = fullToControl(leftLane)
const centerControl = fullToControl(centerLane)
const rightControl = fullToControl(rightLane)

const getLane = (lane, pit) => {
    if(pit) {
        return pitLeftLane
    } else if(lane === "Left") {
        return leftLane
    } else if(lane === "Center") {
        return centerLane
    } else if (lane === "Right") {
        return rightLane
    }
}

const getControlPoint = (index, lane, pit=false) => {
    return getLane(lane, pit)[index]
}

const calculateRaceSupportPoints = (indices, side, pit, prevLane, nextLane) => {
    const totalIndices = centerLane.length
    const index1 = (indices[0] - 1 + totalIndices) % totalIndices // Control point
    const index2 = indices[0] // support point
    const index3 = indices[1] // control point
    const index4 = indices[2] // support point 
    const index5 = (indices[2] + 1) % totalIndices // control point

    const support1 = calculateSingleSupportPoint(index1, index2, index3, pit, prevLane, side)
    const support2 = calculateSingleSupportPoint(index3, index4, index5, pit, side, nextLane)

    // Adjusted support points:
    const lane = getLane(side, pit)
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

const calculateSingleSupportPoint = (startIndex, middleIndex, endIndex, pit, lane1, lane2) => {
    const leftLabel = getLeftLane(lane1, lane2)
    const rightLabel = getRightLane(lane1, lane2)

    const startLeft = getControlPoint(startIndex, leftLabel, pit)
    const startRight = getControlPoint(startIndex, rightLabel, pit)
    const middleLeft = getControlPoint(middleIndex, leftLabel, pit)
    const middleRight = getControlPoint(middleIndex, rightLabel, pit)
    const endLeft = getControlPoint(endIndex, leftLabel, pit)
    const endRight = getControlPoint(endIndex, rightLabel, pit)

    const leftStartDist = calcDist(startLeft, middleLeft)
    const rightStartDist = calcDist(startRight, middleRight)
    const leftEndDist = calcDist(middleLeft, endLeft)
    const rightEndDist = calcDist(middleRight, endRight)
    const avgStartDist = (leftStartDist + rightStartDist) / 2
    const avgEndDist = (leftEndDist + rightEndDist) / 2

    const tempFrac = avgEndDist / (avgStartDist + avgEndDist)
    const tweak = 2 // tweaking parameter, from 1 to infinity. 
    const frac = (tempFrac < 0.5) ? tempFrac - tempFrac / tweak : tempFrac + (1 - tempFrac)/tweak


    const startSupport = getControlPoint(middleIndex, lane1, pit)
    const endSupport = getControlPoint(middleIndex, lane2, pit)
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

const loop = async (setCount) => {
    while(true) {
        setCount(c => c+1)
        await sleep(50);
    }
}

const updateRaceLine = (controlPoints, setRaceLine, setRealPath) => {
    const raceLine = controlPoints.flatMap((controlPoint, i) => {
        const indices = controlToFullMap[i]
        if (indices.length == 1) {
            const point = getControlPoint(indices, controlPoint.lane, controlPoint.pit)
            return [{x: point[0], y: point[1], distance: 0}]
        } else {
            const totalIndices = centerLane.length
            const prevLane = controlPoints[(i-1 + totalIndices) % totalIndices].lane
            const nextLane = controlPoints[(i+1) % totalIndices].lane
            const supportPoints = calculateRaceSupportPoints(indices, controlPoint.lane, controlPoint.pit, prevLane, nextLane)
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
        x: physics.x,
        y: physics.y,
        heatLaps: physics.heatLaps,
        totalLaps: physics.totalLaps,
        lastLapTime: physics.lastLapTime,
        fastestLapTime: physics.fastestLapTime,
        timeSinceLastFinish: physics.timeSinceLastFinish,
        spd: physics.spd,
        rpm: physics.rpm,
        soc: physics.soc,
        socZeroL: physics.socZeroL,
        E: physics.E,
        rpmv: physics.rpmv,
        wh: physics.wh,
        ecc: physics.ecc
    }
    let message = JSON.stringify(data)
    try {
        socket.send(message)
    } catch {
        console.log("Couldn't send")
    }
}

const controlDistance = (raceLine, index) => {
    const fullIndices = controlToFullMap[index]
    let fullIndex 
    if(fullIndices.length == 3) {
        fullIndex = fullIndices[1]
    } else {
        fullIndex = fullIndices[0]
    }
    const distance = raceLine[fullIndex].distance
    return distance
}

const entryPointIndex = pitLanePoints[0]
const slowDrivePointIndex = pitLanePoints[1]
const exitPointIndex = pitLanePoints[pitLanePoints.length -1]
const revertRacelineIndex = exitPointIndex + 2

const startPitlaneActivityIfNeeded = (setPitLaneList) => {
    setPitLaneList(oldList => {
        let changed = false
        const newList =  oldList.map((activity, i) => {
            if (activity.startTime) {
                return activity
            }

            const now = Date.now()
            const filledActivity = ({...activity, startTime: now})
            if (i == 0) {
                changed = true
                return filledActivity
            }
            const prevActivity = oldList[i-1]
            if(!prevActivity.startTime) {
                return activity
            }
            if(prevActivity.startTime + prevActivity.duration*1000 > now) {
                return activity
            }

            changed = true
            return filledActivity
        })
        if(changed) return newList
        return oldList
    })
}

const startPitLaneActivities = (setForceSpeed, setShowPitLaneActivities, setPitLaneList, setActiveButtons)  => {
    setForceSpeed(0) 
    setShowPitLaneActivities(true)
    startPitlaneActivityIfNeeded(setPitLaneList)
    setActiveButtons((old) => (
        {...old, go: false, walkingSpeed: false})
    )
}

const pitLaneListContains = (pitLaneList, activity) => {
    return pitLaneList.reduce((acc, cur) => acc || cur.text === activity.text, false)
}

const pitStopDistance = 10

const TrackController = (props) => {
    const [count, setCount] = useState(0)
    const [physics, setPhysics] = useState(getInitialPhysicsState())
    const [cars, setCars] = useState([])
    const [normalizedCars, setNormalizedCars] = useState([])
    const [currentStage, setCurrentStage] = useState(0)
    const [controlPoints, setControlPoints] = useState(Array(nControlPoints).fill({lane: "Center", throttle: 3, pit: false}))
    const [raceLine, setRaceLine] = useState(initialRaceLine)
    const [controlPointsUI, setControlPointsUI] = useState()
    const [socket, setSocket] = useState(null)
    const [realPath, setRealPath] = useState(null)
    const [forceSpeed, setForceSpeed] = useState(-1)
    const [showPitLaneActivities, setShowPitLaneActivities] = useState(false)
    const [pitting, setPitting] = useState(false)
    const [pitLaneList, setPitLaneList] = useState([])
    const [cameInForDriverChange, setCameInForDriverChange] = useState(false)
    const [stopButtonPressed, setStopButtonPressed] = useState(false)
    const [increaseThrottlePressed, setIncreaseThrottlePressed] = useState(false)
    const [decreaseThrottlePressed, setReduceThrottlePressed] = useState(false)
    const prevFlags = usePrevious(props.flags)

    const trackDistance = raceLine[0].distance

    const inPit = () => {
        const pitStartDistance = controlDistance(raceLine, entryPointIndex)
        const pitEndDistance = controlDistance(raceLine, exitPointIndex)
        const isInPit = controlPoints[0].pit && (physics.pos > pitStartDistance || physics.pos < pitEndDistance)
        return isInPit
    }

    const inSlowDrivePit = () => {
        const swapPoint = getSwapPoint(realPath)
        const slowStartDistance = controlDistance(raceLine, slowDrivePointIndex)
        return inPit() && physics.pos >slowStartDistance && physics.pos < swapPoint
    }

    const getThrottle = (d) => {
        let throttle = getThrottleAtDistance(controlPoints, raceLine, d%trackDistance)
        if(increaseThrottlePressed) {
            throttle = Math.min(throttle + 1, 5)
        }
        if(decreaseThrottlePressed) {
            throttle = Math.max(throttle - 1, -1)
        }
        return throttle
    }

    const updateCar = () => {
        handleSlowDriveRegion()
        handlePointsReached()
        if(pitting) {
            startPitlaneActivityIfNeeded(setPitLaneList)
        }
    }
    useEffect(() => updateCar(), [count])

    const handlePointsReached = () => {
        const posBefore = physics.pos
        const newPhysics = calculatePhysics(getThrottle, physics, props.setAnalystData, realPath, raceLine, props.setGForce, stopButtonPressed, forceSpeed)
        setPhysics(newPhysics)
        const posAfter = newPhysics.pos
        if(pitLaneReached(raceLine, inPit, posBefore, posAfter)) {
            if(props.flags.blue && !cameInForDriverChange) {
                setCameInForDriverChange(true)
            }
            props.setFlags(old => ({...old, black: false}))
            props.setActiveButtons(old => ({...old, go: false}))
        }
        if(pitStopReached(realPath, inPit, posBefore, posAfter)) {
            setPitting(true)
            startPitLaneActivities(setForceSpeed, setShowPitLaneActivities, setPitLaneList, props.setActiveButtons)
        }
        if(pitEndReached(raceLine, inPit, posBefore, posAfter)) {
            setForceSpeed(-1)
        }
        if(racelineRevertPointReached(raceLine, posBefore, posAfter)){
            revertRacelineAfterPit(controlPoints, setMultipleControlPoints)
        }
    }

    const handleSlowDriveRegion = () => {
        const maxSpeed = 5
        if(!inSlowDrivePit()) return
        const driveTooFast = physics.spd > maxSpeed
        const alreadyPenalized = pitLaneListContains(pitLaneList, droveTooFastActivity)
        if (driveTooFast && !alreadyPenalized) {
            setPitLaneList(old => [...old, droveTooFastActivity])
        }

    }


    const flagsUpdated = (prevFlags, newFlags) => {
        if(!prevFlags) return

        if(!prevFlags.blue && newFlags.blue) {
            setPitLaneList(old => [...old, driverChangeActivity])
            setCameInForDriverChange(false)
        }
        if(prevFlags.blue && !newFlags.blue) {
            if(!cameInForDriverChange) {
                props.setFlags(old => ({...old, black: true}))
            }
        }
    }

    useEffect(() => flagsUpdated(prevFlags, props.flags), [props.flags])

    const canPit = () => {
        const startPoint = controlDistance(raceLine, revertRacelineIndex)
        const lastChancePoint = controlDistance(raceLine, pitLanePoints[0] - 1)
        const mayPit = physics.pos > startPoint && physics.pos < lastChancePoint
        return mayPit
    }

    const initialize = () => {
        window.Echo.channel('carPhysics')
            .listen('CarsUpdated', (e) => setCars(e.carPhysics))
        updateControlPointsUI(setControlPoint, setControlPointsUI)
        updateRaceLine(controlPoints, setRaceLine, setRealPath)
        const socket = connectSocket(props.user.id)
        setSocket(socket)
        loop(setCount)
    }

    const setControlPoint = (pointIndex, lane=null, throttle=-2, pit=null) => {
        const newPoints = controlPoints.map((oldPoint, i) => {
            const newLane = lane ? lane : oldPoint.lane
            const newThrottle = throttle != -2 ? throttle : oldPoint.throttle
            const newPit = pit != null ? pit : oldPoint.pit
            const newPoint = { lane: newLane, throttle: newThrottle, pit: newPit}
            return i === pointIndex ? newPoint: oldPoint
        })
        updateRaceLine(newPoints, setRaceLine, setRealPath)
        setControlPoints(newPoints)
        setCurrentStage(pointIndex)
    }

    const setMultipleControlPoints = (list) => {
        const newPoints = controlPoints.map((oldPoint, i) => {
            const relevantPoint = list.find((changedPoint) => changedPoint.index === i)
            const newLane = relevantPoint && relevantPoint.lane ? relevantPoint.lane : oldPoint.lane
            const newThrottle = relevantPoint && relevantPoint.throttle != -2 ? relevantPoint.throttle : oldPoint.throttle
            const newPit = relevantPoint && relevantPoint.pit != null ? relevantPoint.pit : oldPoint.pit
            const newPoint = { lane: newLane, throttle: newThrottle, pit: newPit}
            return newPoint
        })
        updateRaceLine(newPoints, setRaceLine, setRealPath)
        setControlPoints(newPoints)
    }

    const setAllThrottles = (throttle) => {
        const list = controlPoints.map((oldPoint, i) => 
            ({index: i, lane: null, throttle: throttle, pit: null})
        )
        setMultipleControlPoints(list)
    }

    useEffect(initialize, [])
    useEffect(() => updateControlPointsUI(setControlPoint, setControlPointsUI), [controlPoints]) 
    useEffect(() => updateServer(socket, physics), [physics])
    useEffect(() => props.setActiveButtons(old => 
        ({...old, checkHelmet: pitting, checkMirrors: pitting, checkSeatbelt: pitting})
    ), [pitting])

    const performCheck = (check, forgotActivity) => {
        if(!check) {
            const forgotBefore = pitLaneList.reduce((acc, cur) => acc || cur.text === forgotActivity.text, false)
            let penalty = JSON.parse(JSON.stringify(forgotActivity))
            penalty.text += forgotBefore ? "... again" : ""
            setPitLaneList(old => [...old, penalty])
            return false
        }
        return true
    }

    const canGo = () => {
        const listContainsDriverChange = pitLaneList.reduce((acc, cur) => acc || cur.text === driverChangeActivity.text, false)
        if(listContainsDriverChange) {
            const checks = pitLaneList.reduce((acc, cur) => {
                if(cur.text === checkHelmetActivity.text) return {...acc, helmet: true}
                if(cur.text === checkSeatbeltActivity.text) return {...acc, belt: true}
                if(cur.text === checkMirrorsAcitivity.text) return {...acc, mirrors: true}
                return acc
            }, {helmet: false, belt: false, mirrors: false})
            if(!performCheck(checks.helmet, forgotHelmetActivity)) return false
            if(!performCheck(checks.belt, forgotSeatbeltActivity)) return false
            if(!performCheck(checks.mirrors, forgotMirrorsActivity)) return false
        }
        return true
    }

    const checkPittingAndLeave = () => {
        if(pitting) {
            setPitLaneList([])
            setPitting(false)
            setShowPitLaneActivities(false)
        }
    }

    const goButtonPressed = () => {
        setStopButtonPressed(false)
        if(canGo()) {
            checkPittingAndLeave()
            go(setForceSpeed, inPit)
        }
    }

    const walkingSpeedButtonPressed = () => {
        setStopButtonPressed(false)
        if(canGo()) {
            checkPittingAndLeave()
            setForceSpeed(3)
        }
    }

    const updateControlPointsCallbacks = () => {
        props.setButtonCallbacks((old) => (
            {...old, goToPitLane: () => goToPitLane(controlPoints, setMultipleControlPoints)})
        )
    }
    
    const updatePhysicsCallbacks = () => {
        props.setButtonCallbacks(old => ({...old, 
            go: goButtonPressed, 
            walkingSpeed: walkingSpeedButtonPressed,
            resetCycleAnalyst: () => setPhysics(old => ({...old, ecc: 0, wh: 0}))
        }))
        props.setActiveButtons(old => ({...old, goToPitLane: canPit()}))
    }

    const updateUnconditionalCallbacks = () => {
        props.setButtonCallbacks((oldCallbacks) => ( {
            ...oldCallbacks, 
            stop: () => setStopButtonPressed(true),
            increaseThrottle: () => setIncreaseThrottlePressed(true),
            increaseReleased: () => setIncreaseThrottlePressed(false),
            reduceThrottle: () => setReduceThrottlePressed(true),
            reduceReleased: () => setReduceThrottlePressed(false),
            checkHelmet: () => setPitLaneList(old => [...old, checkHelmetActivity]),
            checkMirrors: () => setPitLaneList(old => [...old, checkMirrorsAcitivity]),
            checkSeatbelt: () => setPitLaneList(old => [...old, checkSeatbeltActivity]),
        }))
    }

    useEffect(updateControlPointsCallbacks, [controlPoints])
    useEffect(updatePhysicsCallbacks, [physics])
    useEffect(updateUnconditionalCallbacks, [])

    const getThrottleUI = (normDist) => getThrottleAtDistance(controlPoints, raceLine, normDist*trackDistance)

    useEffect(() => {
        if(cars.length == 0) {
            return
        }
        const newCars = cars.map(c => {
            c.data.counter /= trackDistance
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
                    setAllThrottles={setAllThrottles}
                />
            </div>
            <PitLaneActivities
                show={showPitLaneActivities}
                list={pitLaneList}
                setActiveButtons={props.setActiveButtons}
            />
            <Track 
                pitting={pitting}
                userLoc={{x: physics.x, y: physics.y}}
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
const getSwapPoint = (realPath) => {
    return realPath ? realPath.getTotalLength() - pitStopDistance : 9999999
}

const pitLaneReached = (raceLine, inPit, posBefore, posAfter) => {
    const entryPoint = controlDistance(raceLine, entryPointIndex)
    return (inPit() && posBefore < entryPoint && posAfter >= entryPoint) 
}

const pitStopReached = (realPath, inPit, posBefore, posAfter) => {
    const swapPoint = getSwapPoint(realPath)
    return (inPit() && posBefore < swapPoint && posAfter >= swapPoint) 
}

const pitEndReached = (raceLine, inPit, posBefore, posAfter) => {
    const exitPoint = controlDistance(raceLine, exitPointIndex) - 1
    return (inPit() && posBefore < exitPoint && posAfter >= exitPoint) 
}

const racelineRevertPointReached = (raceLine, posBefore, posAfter) => {
    const revertRacelinePoint = controlDistance(raceLine, revertRacelineIndex)
    return (posBefore < revertRacelinePoint && posAfter >= revertRacelinePoint)
}

export default TrackController