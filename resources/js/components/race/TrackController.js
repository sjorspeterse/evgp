import React, {useEffect, useState} from "react"
import {usePrevious} from "./CustomHooks"
import StageSetting from "./StageSetting";
import {PitLaneActivities, getDriverChangeActivity, checkMirrorsAcitivity, 
    checkSeatbeltActivity, checkHelmetActivity, forgotMirrorsActivity, 
    forgotHelmetActivity, forgotSeatbeltActivity, droveTooFastActivity,
    skippedBlackFlagActivity, passOnYellowActivity, illegalChargeActivity,
    changeBallastActivity, didNotChangeBallastActivity
} 
    from "./PitLaneActivities";
import {getChassisBreakdown, getDrivesysBreakdown, getWheelBreakdown} from "./Breakdowns"
import Track from "./Track";
import * as d3 from "d3";
import {leftLane as leftLanePrac, rightLane as rightLanePrac,
    centerLane as centerLanePrac, pitLeftLane as pitLeftLanePrac,
    pitLanePoints as pitLanePointsPrac, controlToFullMap as controlToFullMapPrac,
    nControlPoints as nControlPointsPrac} 
    from "./PracticeTrackData"
import {leftLaneRace, rightLaneRace, centerLaneRace, pitLeftLaneRace, pitLanePointsRace, controlToFullMapRace, nControlPointsRace} 
    from "./RaceTrackData"
import {calculatePhysics, getInitialPhysicsState, posToNpos} from "./Physics"

const view =  document.getElementById('race_container')
let track = "Practice"
let admin
if(view) {
    const json_admin = view.getAttribute('admin')
    admin = JSON.parse(json_admin)
    if(admin.track) {
        track = admin.track
    }
}
const useRealTrack = (track === "Official")

const leftLane = useRealTrack ? leftLaneRace : leftLanePrac
const rightLane = useRealTrack ? rightLaneRace : rightLanePrac
const centerLane = useRealTrack ? centerLaneRace : centerLanePrac
const pitLeftLane = useRealTrack ? pitLeftLaneRace : pitLeftLanePrac
const pitLanePoints = useRealTrack ? pitLanePointsRace : pitLanePointsPrac
const controlToFullMap = useRealTrack ? controlToFullMapRace : controlToFullMapPrac
const nControlPoints = useRealTrack ? nControlPointsRace : nControlPointsPrac

const totalPoints = leftLane.length

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

const newRaceLine = (controlPoints) => {
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
    return raceLine
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

const newRealPath = (raceLine) => {
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
    return realPath
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
        lapStartTime: physics.lapStartTime,
        timeSinceLastFinish: physics.timeSinceLastFinish,
        spd: physics.spd,
        npos: physics.npos,
        rpm: physics.rpm,
        soc: physics.soc,
        socZeroL: physics.socZeroL,
        E: physics.E,
        rpmv: physics.rpmv,
        wh: physics.wh,
        ecc: physics.ecc,
        inPitLane: physics.inPitLane,
        timerStartTime: physics.timerStartTime,
        extraTime: physics.extraTime,
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

const startActivityIfNeeded = (setList) => {
    setList(oldList => {
        let changed = false
        const newList =  oldList.map((activity, i) => {
            if (activity.startTime) { // has already started
                return activity
            }

            const now = Date.now()
            const filledActivity = ({...activity, startTime: now})
            if (i == 0) { // Starting first item on list, yes, start!
                changed = true
                return filledActivity
            }
            const prevActivity = oldList[i-1]
            if(!prevActivity.startTime) {  // Previous activity hasn't started yet
                return activity
            }
            if(prevActivity.startTime + prevActivity.duration*1000 > now) {
                return activity   // Previous activty hasn't finished yet
            }

            changed = true  // yes, starting new activity!
            return filledActivity
        })
        if(changed) return newList
        return oldList
    })
}

const startPitLaneActivities = (setForceSpeed, setShowPitLaneActivities, setPitLaneList, setActiveButtons)  => {
    setForceSpeed(0) 
    setShowPitLaneActivities(true)
    startActivityIfNeeded(setPitLaneList)
    console.log('Starting pit lane activities, disabling go buttons')
    setActiveButtons((old) => (
        {...old, go: false, walkingSpeed: false, doNotPass: false})
    )
}

const pitLaneListContains = (pitLaneList, activity) => {
    return pitLaneList.reduce((acc, cur) => acc || cur.text === activity.text, false)
}

const breakdownListContains = (breakdownList, breakdown) => {
    return breakdownList.reduce((acc, cur) => acc || cur.text === breakdown.text, false)
}


const getInitialRaceLine = (controlPoints) => {
    const line = newRaceLine(controlPoints)
    newRealPath(line)
    return line
}

const TrackController = (props) => {
    const [count, setCount] = useState(0)
    const [physics, setPhysics] = useState(() => getInitialPhysicsState(props.initialState, totalPoints))
    const [cars, setCars] = useState([])
    const [currentStage, setCurrentStage] = useState(0)
    const [controlPoints, setControlPoints] = useState(Array(nControlPoints).fill({lane: "Center", throttle: 3, pit: false}))
    const [realPath, setRealPath] = useState(null)
    const [raceLine, setRaceLine] = useState(getInitialRaceLine(controlPoints))
    const [controlPointsUI, setControlPointsUI] = useState()
    const [socket, setSocket] = useState(null)
    const [forceSpeed, setForceSpeed] = useState(-1)
    const [showPitLaneActivities, setShowPitLaneActivities] = useState(false)
    const [pitting, setPitting] = useState(false)
    const [pitLaneList, setPitLaneList] = useState([])
    const [cameInForDriverChange, setCameInForDriverChange] = useState(false)
    const [stopButtonPressed, setStopButtonPressed] = useState(true)
    const [doNotPassButtonPressed, setDoNotPassButtonPressed] = useState(false)
    const [increaseThrottlePressed, setIncreaseThrottlePressed] = useState(false)
    const [decreaseThrottlePressed, setReduceThrottlePressed] = useState(false)
    const [raceHasStarted, setRaceHasStarted] = useState(false)
    const [breakdownsEnabled, setBreakDownsEnabled] = useState(admin ? admin.breakdowns === "Enabled": false)
    const [brokenDown, setBrokenDown] = useState(false)
    const [repairing, setRepairing] = useState(false)
    const [lastBreakdownGamble, setLastBreakdownGamble] = useState(Date.now())
    const [overridePhysics, setOverridePhysics] = useState({should: false, new: {}})
    const [controllerOn, setControllerOn] = useState(true)
    const [whiteFlagTime, setWhiteFlagTime] = useState(Date.now())
    const [mode, setMode] = useState(admin ? admin.mode : "Practice")
    const [isFirstLap, setIsFirstLap] = useState(true)
    const [latestAdmin, setLatestAdmin] = useState(admin)
    const [linedUp, setLinedUp] = useState(false)
    const prevFlags = usePrevious(props.flags)
    const [driverWindowOpened, setDriverWindowOpened] = useState(false)
    const [driverWindowClosed, setDriverWindowClosed] = useState(false)

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

    const handleDoNotPass = () => {
        if (!doNotPassButtonPressed) return
        const aheadCar = getAheadCar()
        if (!aheadCar) {
            setForceSpeed(-1)
            return
        }
        const newMaxSpeed = aheadCar.data.spd
        setForceSpeed(newMaxSpeed)
    }

    const yellowFlagForEveryone = () => {
        fetch('/api/topflag', {
            method: "POST",
            body: JSON.stringify("Yellow"),
            headers: {"Content-type": "application/json; charset=UTF-8"} })
    }

    const breakDown = (componentBreakdown) => {
        setBrokenDown(true)
        setStopButtonPressed(true)
        console.log('Broken down! disabling go buttons')
        props.setActiveButtons(old => ({...old, go: false, doNotPass: false, walkingSpeed: false}))
        props.setBreakdownList(old => [...old, componentBreakdown])
        yellowFlagForEveryone()
    }

    const gambleComponent = (component, breakdownGetter, name) => {
        const dice = Math.random() * 100
        const componentBreakdown = breakdownGetter(component.duration)
        let alreadyBrokeDown = breakdownListContains(props.breakdownList, componentBreakdown)
        if(dice > component.reliability) {
            if (!alreadyBrokeDown) {
                console.log("BREAKDOWN " + name + "!")
                breakDown(componentBreakdown)
                return true
            }
        }
        return false
    }

    const breakDownGamble = () => {
        const params = props.carParams
        setLastBreakdownGamble(Date.now())

        if(gambleComponent(params.chassis, getChassisBreakdown, "CHASSIS")) return
        if(gambleComponent(params.drivesys, getDrivesysBreakdown, "CHAIN")) return
        gambleComponent(params.frontWheel, getWheelBreakdown, "SPOKE")
    }

    const handleBreakdowns = () => {
        if (!breakdownsEnabled) return
        if (physics.spd < 0.1) return
        if (Date.now() - lastBreakdownGamble > 30000) {
            breakDownGamble()
        }
    }

    useEffect(() => {
        const canRepairFailure = physics.spd <= 0.1 && brokenDown
        props.setActiveButtons(old => ({...old, repairFailure: canRepairFailure}))
    }, [brokenDown, physics.spd])

    const updateCar = () => {
        handleSlowDriveRegion()
        handleDoNotPass()
        handlePointsReached()
        handleBreakdowns()
        if(pitting) {
            startActivityIfNeeded(setPitLaneList)
        }
        if(repairing)   {
            startActivityIfNeeded(props.setBreakdownList)
        }
        updateTimer()
    }
    useEffect(() => updateCar(), [count])

    const aheadBy = (npos, physics) => {
        let difference = (npos.lastPoint + npos.frac - physics.npos.lastPoint - physics.npos.frac + totalPoints) % totalPoints
        if (difference > totalPoints/2) difference -= totalPoints
        return difference
    }

    const getAheadCar = () => {
        const filteredCars = cars.filter(car => car.user.id != props.user.id && 
            car.data.spd > 0.1 && !car.data.inPitLane)
        filteredCars.forEach(car => car.aheadBy = aheadBy(car.data.npos, physics))
        const newFilteredCars = filteredCars.filter(car => car.aheadBy > 0)
        if (newFilteredCars.length == 0) {
            return null
        }
        const aheadCar =  newFilteredCars.reduce((acc, cur) => acc.aheadBy < cur.aheadBy ? acc : cur)
        return aheadCar
    }

    const checkPassOnYellow = (aheadCar, newPhysics) => {
        if(!props.flags.yellow || !aheadCar || doNotPassButtonPressed) {
            return
        }
        if (aheadBy(aheadCar.data.npos, newPhysics) > 0) {
            return
        }
        if (inPit()) {
            return
        }
        props.setRaceControlText({smallText: "Passed on yellow flag", whiteText: "30 sec"})
        props.setFlags(old => ({...old, black: true}))
        const alreadyPenalized = pitLaneListContains(pitLaneList, passOnYellowActivity)
        if (!alreadyPenalized) {
            setPitLaneList(old => [...old, passOnYellowActivity])
        }
    }

    const handlePointsReached = () => {
        const posBefore = physics.pos
        const aheadCar = getAheadCar()
        let newPhysics 

        if(overridePhysics.should) {
            newPhysics = {...physics, ...overridePhysics.new}
            setOverridePhysics({should: false})
        } else {
            newPhysics = calculatePhysics(getThrottle, physics, props.carParams,
                props.setAnalystData, realPath, raceLine, 
                props.setGForce, stopButtonPressed, controllerOn,
                setControllerOn, isFirstLap, pitting, forceSpeed)
        }
        setPhysics(newPhysics)
        const posAfter = newPhysics.pos
        checkPassOnYellow(aheadCar, newPhysics)
        if(pitLaneReached(raceLine, inPit, posBefore, posAfter)) {
            if(props.flags.blue && !cameInForDriverChange) {
                setCameInForDriverChange(true)
            }
            setPhysics(old => ({...old, inPitLane: true}))
            props.setFlags(old => ({...old, black: false}))
            props.setRaceControlText({})
            setDoNotPassButtonPressed(false)
            console.log("Pit lane has been reached, go button and do not pass button are disabled")
            props.setActiveButtons(old => ({...old, go: false, doNotPass: false}))
        }
        if(pitStopReached(realPath, inPit, posBefore, posAfter)) {
            console.log("Pit stop reached!")
            setPitting(true)
            startPitLaneActivities(setForceSpeed, setShowPitLaneActivities, setPitLaneList, props.setActiveButtons)
        }
        if(pitEndReached(raceLine, inPit, posBefore, posAfter)) {
            setForceSpeed(-1)
            setPhysics(old => ({...old, inPitLane: false}))
            console.log("End of the pit reached, re-enabling the do not pass button")
            props.setActiveButtons(old => ({...old, doNotPass: true}))
        }
        if(racelineRevertPointReached(raceLine, posBefore, posAfter)){
            revertRacelineAfterPit(controlPoints, setMultipleControlPoints)
        }
        if(lastChancePointReached(raceLine, posBefore, posAfter)) {
            const skippedBlack = props.flags.black && !controlPoints[0].pit
            const alreadyPenalized = pitLaneListContains(pitLaneList, skippedBlackFlagActivity)
            if (skippedBlack && !alreadyPenalized) {
                setPitLaneList(old => [...old, skippedBlackFlagActivity])
            }
        }
        if (finishReached(posBefore, posAfter)) {
            if(props.flags.white) {
                setStopButtonPressed(true)
                console.log("Finished reached during a white flag, disabling go, walking speed and do not pass")
                props.setActiveButtons((old) => (
                    {...old, go: false, walkingSpeed: false, doNotPass: false})
                )
                const extraTime = (Date.now() - whiteFlagTime) / 1000
                setPhysics(old => ({...old, extraTime: extraTime}))
                props.setFlags(old => ({...old, white: false}))
            }
            setIsFirstLap(false)
        }

        if(mode === "Qualification" && physics.totalLaps >= 4) {
            setStopButtonPressed(true)
            console.log("4 laps driven in Qualification, go buttons are disabled")
            props.setActiveButtons((old) => (
                {...old, go: false, walkingSpeed: false, doNotPass: false})
            )
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
            const driverAcitivity = getDriverChangeActivity(props.carParams)
            const alreadyChangingDrivers = pitLaneListContains(pitLaneList, driverAcitivity)
            if (!alreadyChangingDrivers) {
                setPitLaneList(old => [...old, driverAcitivity])
            }
            setCameInForDriverChange(false)
        }
        if(prevFlags.blue && !newFlags.blue) {
            if(!cameInForDriverChange) {
                props.setRaceControlText({smallText: "Missed driver change", whiteText: "-1 lap"})
                setPhysics(old => ({...old, totalLaps: old.totalLaps-1, heatLaps: old.heatLaps-1}))
                props.setFlags(old => ({...old, black: true}))
            }
        }
        if(!prevFlags.white && newFlags.white) {
            setWhiteFlagTime(Date.now())
        }
    }

    useEffect(() => flagsUpdated(prevFlags, props.flags), [props.flags])

    const canPit = () => {
        const startPoint = controlDistance(raceLine, revertRacelineIndex)
        const lastChancePoint = controlDistance(raceLine, pitLanePoints[0] - 1)
        const mayPit = physics.pos > startPoint && physics.pos < lastChancePoint
        return mayPit
    }

    const setNextMode = (mode) => {
        // if(callingAdmin) return    // TODO: Everyone would be calling the api at the same time
        // setCallingAdmin(true)
        // fetch('/api/mode', {
            // method: "POST",
            // body: JSON.stringify(mode),
            // headers: {"Content-type": "application/json; charset=UTF-8"} })
    }

    const timeLeft = (minutes) => {
        const now = Date.now()
        return minutes + (physics.timerStartTime - now) / 1000 / 60
    }

    const handleTimerMode = (currentMode, nextMode, totalTime, stopTime=0) => {
        if(mode === currentMode) {
            const minutesLeft = timeLeft(totalTime)
            if(minutesLeft < stopTime) {
                setNextMode(nextMode)
            } else {
                props.setTimer(minutesLeft * 60)
            }
        }
    }

    const updateTimer = () => {
        if(mode === "Practice") {
            props.setTimer(null)
        }

        if((mode === "Break 0" || mode === "Break 1" || mode === "Break 2") && timeLeft(5) < 1) {
        // if((mode === "Break 0" || mode === "Break 1" || mode === "Break 2") && timeLeft(0.5) < 0.1) {
            if(!linedUp) {
                lineUp() 
                setLinedUp(true)
            }
        }

        if((mode === "Heat 1" || mode === "Heat 2") && timeLeft(30) < 18) {
        // if((mode === "Heat 1" || mode === "Heat 2") && timeLeft(3) < 1.8) {
            if(!driverWindowOpened) {
                props.setFlags(old => ({...old, blue: true}))
                setDriverWindowOpened(true)
            }
        }
        if((mode === "Heat 1" || mode === "Heat 2") && timeLeft(30) < 12) {
        // if((mode === "Heat 1" || mode === "Heat 2") && timeLeft(3.0) < 1.2) {
            if(!driverWindowClosed) {
                props.setFlags(old => ({...old, blue: false}))
                setDriverWindowClosed(true)
            }
        }
        if((mode === "Heat 1" || mode === "Heat 2") && timeLeft(30) < 0) {
        // if((mode === "Heat 1" || mode === "Heat 2") && timeLeft(3) < 0) {
            props.setFlags(old => ({...old, white: true}))
        }

        // handleTimerMode('Break 0', 'Qualification', 0.5)
        // handleTimerMode('Qualification', 'Break 1', 1.5)
        // handleTimerMode('Break 1', 'Heat 1', 0.5)
        // handleTimerMode('Heat 1', 'Break 2', 3, -0.2)
        // handleTimerMode('Break 2', 'Heat 2', 0.5)
        // handleTimerMode('Heat 2', 'None', 3, -0.2)
        handleTimerMode('Break 0', 'Qualification', 5)
        handleTimerMode('Qualification', 'Break 1', 15)
        handleTimerMode('Break 1', 'Heat 1', 5)
        handleTimerMode('Heat 1', 'Break 2', 30, -2)
        handleTimerMode('Break 2', 'Heat 2', 5)
        handleTimerMode('Heat 2', 'None', 30, -2)
    }

    const lineUp = () => {
        console.log("Lining up!")
        const pos = -10 * props.rank
        const npos = posToNpos(pos, raceLine)
        const newValues = {npos: npos, spd: 0}
        setOverridePhysics({should: true, new: newValues})
        setStopButtonPressed(true)
        setIsFirstLap(true)
        setLinedUp(true)
        console.log("Cars are lined up, disabling go buttons")
        props.setActiveButtons((old) => (
            {...old, go: false, walkingSpeed: false, doNotPass: false})
        )
    }

    const handleAdmin = (adminState) => {
        if(adminState.breakdowns) {
            const enabled = adminState.breakdowns === "Enabled"
            console.log("Breakdowns are", enabled ? 'enabled' : 'disabled', 'by Admin!')
            setBreakDownsEnabled(enabled)
        }
        if(adminState.reset) {
            if(adminState.reset === "Position") {
                console.log('Position is reset by Admin!')
                const pos = -1
                const npos = posToNpos(pos, raceLine)
                const newValues = {npos: npos, spd: 0}
                setOverridePhysics({should: true, new: newValues})
                setStopButtonPressed(true)
                setIsFirstLap(true)
            }
            if(adminState.reset === "Lineup") {
                console.log('Cars are lined up by Admin!')
                lineUp()
            }
            if(adminState.reset === "Total laps") {
                console.log('Total laps are reset by Admin!')
                const laps = {totalLaps: 0, heatLaps: 0, lapStartTime: Date.now()}
                setOverridePhysics({should: true, new: laps})
            }
        }
        if(adminState.mode) {
            console.log('Admin changed mode to: ', adminState.mode)
            setPhysics(old => ({...old, timerStartTime: Date.now()}))
            setLinedUp(false)
            setDriverWindowOpened(false)
            setDriverWindowClosed(false)
            setMode(adminState.mode)
            if(adminState.mode === 'Qualification') {
                console.log("Entered qualification mode! go buttons are re-enabled!")
                props.setActiveButtons((old) => (
                    {...old, go: true, walkingSpeed: true, doNotPass: true})
                )
                const laps = {totalLaps: 0, heatLaps: 0, lapStartTime: Date.now(), fastestLapTime: 0, lastLapTime: 0}
                setOverridePhysics({should: true, new: laps})
                props.setSortMode('Fastest lap')
            }
            if(adminState.mode === 'Heat 1') {
                console.log("Heat 1 started! Go buttons are re-enabled!")
                props.setActiveButtons((old) => (
                    {...old, go: true, walkingSpeed: true, doNotPass: true})
                )
                const laps = {totalLaps: 0, heatLaps: 0, lapStartTime: Date.now(), fastestLapTime: 0, lastLapTime: 0}
                setOverridePhysics({should: true, new: laps})
                props.setSortMode('Total laps')
            }
            if(adminState.mode === 'Heat 2') {
                console.log("Heat 2 started! Go buttons are re-enabled!")
                props.setActiveButtons((old) => (
                    {...old, go: true, walkingSpeed: true, doNotPass: true})
                )
                const laps = {heatLaps: 0, lapStartTime: Date.now(), fastestLapTime: 0, lastLapTime: 0}
                setOverridePhysics({should: true, new: laps})
                props.setSortMode('Total laps')
            }
            if(adminState.mode === 'Break 1' || adminState.mode ==='Break 2') {
                console.log("Break 1 or Break 2 started, disabling go buttons")
                props.setActiveButtons((old) => (
                    {...old, go: false, walkingSpeed: false, doNotPass: false})
                )
                props.setFlags(old => ({...old, white: false}))
            }
        }
    }

    const initialize = () => {
        window.Echo.channel('carPhysics')
            .listen('CarsUpdated', (e) => {
                setCars(e.carPhysics)
            })
        window.Echo.channel('adminState')
            .listen('AdminUpdated', (e) => {
                setLatestAdmin(e.adminState)
            })

        updateControlPointsUI(setControlPoint, setControlPointsUI)
        const newLine = newRaceLine(controlPoints)
        setRaceLine(newLine)
        const newPath = newRealPath(newLine)
        setRealPath(newPath)
        const socket = connectSocket(props.user.id)
        setSocket(socket)
        loop(setCount)
    }

    useEffect(() => handleAdmin(latestAdmin), [latestAdmin])

    const setControlPoint = (pointIndex, lane=null, throttle=-2, pit=null) => {
        const newPoints = controlPoints.map((oldPoint, i) => {
            const newLane = lane ? lane : oldPoint.lane
            const newThrottle = throttle != -2 ? throttle : oldPoint.throttle
            const newPit = pit != null ? pit : oldPoint.pit
            const newPoint = { lane: newLane, throttle: newThrottle, pit: newPit}
            return i === pointIndex ? newPoint: oldPoint
        })
        const newLine = newRaceLine(newPoints)
        setRaceLine(newLine)
        const newPath = newRealPath(newLine)
        setRealPath(newPath)
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
        const newLine = newRaceLine(newPoints)
        setRaceLine(newLine)
        const newPath = newRealPath(newLine)
        setRealPath(newPath)
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
        ({...old, checkHelmet: pitting, checkMirrors: pitting, checkSeatbelt: pitting, changeBallast: pitting})
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
        const listContainsDriverChange = pitLaneList.reduce((acc, cur) => acc || cur.text === getDriverChangeActivity(props.carParams).text, false)
        if(listContainsDriverChange && pitting) {
            const checks = pitLaneList.reduce((acc, cur) => {
                if(cur.text === checkHelmetActivity.text) return {...acc, helmet: true}
                if(cur.text === checkSeatbeltActivity.text) return {...acc, belt: true}
                if(cur.text === checkMirrorsAcitivity.text) return {...acc, mirrors: true}
                if(cur.text === changeBallastActivity .text) return {...acc, ballast: true}
                return acc
            }, {helmet: false, belt: false, mirrors: false, ballast: false})
            if(!performCheck(checks.helmet, forgotHelmetActivity)) return false
            if(!performCheck(checks.belt, forgotSeatbeltActivity)) return false
            if(!performCheck(checks.mirrors, forgotMirrorsActivity)) return false
            if(!performCheck(checks.ballast, didNotChangeBallastActivity)) return false
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
        setRepairing(false)
        setDoNotPassButtonPressed(false)
        if(canGo()) {
            checkPittingAndLeave()
            go(setForceSpeed, inPit)
        }
    }

    const walkingSpeedButtonPressed = () => {
        setStopButtonPressed(false)
        setRepairing(false)
        setDoNotPassButtonPressed(false)
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

    const chargeBatteriesButtonPressed = () => {
        if(mode === "Heat 1" || mode === "Heat 2") {
            props.setRaceControlText({smallText: "Tried charging battery", whiteText: "30 sec"})
            props.setFlags(old => ({...old, black: true}))
            setPitLaneList(old => [...old, illegalChargeActivity])
        }
        if(mode === "Break 2") {
            props.setRaceControlText({
                bigText: "WE SAW THAT",
                smallText: "Tried charging battery", whiteText: "-1 lap"})
            const newValues = {totalLaps: physics.totalLaps-1 , heatLaps: physics.heatLaps-1}
            setOverridePhysics({should: true, new: newValues})
        } else {
            chargeBatteries()
        }
    }

    const chargeBatteries = () => {
        const newValues = {soc: 100, socZeroL: 100, E: 0, ir1: 0}
        setOverridePhysics({should: true, new: newValues})
    }

    const updateUnconditionalCallbacks = () => {
        props.setButtonCallbacks((oldCallbacks) => ( {
            ...oldCallbacks, 
            stop: () => setStopButtonPressed(true),
            doNotPass: () => setDoNotPassButtonPressed(true),
            increaseThrottle: () => setIncreaseThrottlePressed(true),
            increaseReleased: () => setIncreaseThrottlePressed(false),
            reduceThrottle: () => setReduceThrottlePressed(true),
            reduceReleased: () => setReduceThrottlePressed(false),
            checkHelmet: () => setPitLaneList(old => [...old, checkHelmetActivity]),
            checkMirrors: () => setPitLaneList(old => [...old, checkMirrorsAcitivity]),
            checkSeatbelt: () => setPitLaneList(old => [...old, checkSeatbeltActivity]),
            changeBallast: () => setPitLaneList(old => [...old, changeBallastActivity]),
            swapBatteries: () => chargeBatteries(),
            repairFailure: () => setRepairing(true),
            resetController: () => setControllerOn(true),
        }))
    }

    const updateModeCallbacks = () => {
        props.setButtonCallbacks((oldCallbacks) => ( {
            ...oldCallbacks,
            chargeBatteries: () => chargeBatteriesButtonPressed(),
        }))
        const chargeBatteriesActive = physics.spd < 0.1
        const swapButtonActive = 
            (mode !== "Heat 1" && mode !== "Heat 2") &&
            props.carParams.C == 12 && physics.spd < 0.1
        props.setActiveButtons(old => ({...old, 
            swapBatteries: swapButtonActive,
            chargeBatteries: chargeBatteriesActive
        }))
    }

    useEffect(updateControlPointsCallbacks, [controlPoints])
    useEffect(updatePhysicsCallbacks, [physics])
    useEffect(updateModeCallbacks, [mode, physics])
    useEffect(updateUnconditionalCallbacks, [])
    useEffect(
        () => props.setActiveButtons(old => ({...old, resetController: !controllerOn})), [controllerOn]
    )

    const getThrottleUI = (normDist) => getThrottleAtDistance(controlPoints, raceLine, normDist*trackDistance)

    useEffect(() => {
        if(cars.length == 0) {
            return
        }
        props.setHighScore(cars)
    }, [cars])

    const pitStopDistance = 5 + 10 * props.rank
    const getSwapPoint = (realPath) => {
        return realPath ? realPath.getTotalLength() - pitStopDistance : 9999999
    }
    
    const pitStopReached = (realPath, inPit, posBefore, posAfter) => {
        const swapPoint = getSwapPoint(realPath)
        return (inPit() && posBefore < swapPoint && posAfter >= swapPoint) 
    }

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
                cars={cars}
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

const pitLaneReached = (raceLine, inPit, posBefore, posAfter) => {
    const entryPoint = controlDistance(raceLine, entryPointIndex)
    return (inPit() && posBefore < entryPoint && posAfter >= entryPoint) 
}

const pitEndReached = (raceLine, inPit, posBefore, posAfter) => {
    const exitPoint = controlDistance(raceLine, exitPointIndex) - 1
    return (inPit() && posBefore < exitPoint && posAfter >= exitPoint) 
}

const racelineRevertPointReached = (raceLine, posBefore, posAfter) => {
    const revertRacelinePoint = controlDistance(raceLine, revertRacelineIndex)
    return (posBefore < revertRacelinePoint && posAfter >= revertRacelinePoint)
}

const lastChancePointReached = (raceLine, posBefore, posAfter) => {
    const lastChancePoint = controlDistance(raceLine, pitLanePoints[0] - 1)
    return (posBefore < lastChancePoint && posAfter >= lastChancePoint)
}

const finishReached = (posBefore, posAfter) => {
    return (posBefore > 10  && posAfter < 10)
}

export default TrackController