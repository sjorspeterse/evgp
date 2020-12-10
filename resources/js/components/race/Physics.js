import * as co from "../configuration/ConfigurationOptions"

const polynomial = (v, constant, p1, p2=0, p3=0, p4=0, p5=0, p6=0) => {
    return constant + p1 * v + p2 * Math.pow(v, 2) + p3 * Math.pow(v, 3) + p4 * Math.pow(v, 4) + p5 * Math.pow(v, 5) + p6 * Math.pow(v, 6) 
}

const updateAnalyst = (physics, setAnalystData) => {
    const current = physics.imotor.toFixed(1)
    const skph = (physics.spd *3600 / 1000).toFixed(1)
    const voltage = (physics.vBatt * 4).toFixed(1)
    const power = physics.pBatt.toFixed(1)
    const ampHours = physics.ecc.toFixed(1)
    const wattHours = physics.wh.toFixed(1)
    setAnalystData({speed: skph, voltage: voltage, current: current, ampHours: ampHours, power: power, wattHours: wattHours})
}

const isEmpty = (obj) => {
    return Object.keys(obj).length==0
}


const getInitialPhysicsState = (initialState, totalPoints) => {
    if(isEmpty(initialState) || !initialState.x) {
        return {
            heatLaps: 0,
            totalLaps: 0,
            lastLapTime: 0,
            fastestLapTime: 0,
            startTime: Date.now(),
            lapStartTime: Date.now(),
            timeSinceLastFinish: 0,
            time: Date.now(),
            spd: 0,
            npos: {lastPoint: 0, frac: 0},
            // pos: 648,  //just before pit stop
            // pos: 510,  //just before pit lane
            // pos: 630,  // can go too fast in pit lane
            pos: 0,
            x: 0,
            y: 0,
            rpm: 0,
            ir1: 0,
            vBatt: 12.6631,
            soc: 100,
            socZeroL: 100,
            E: 0,
            rpmv: 0,
            pbatt: 0,
            wh: 0,
            ecc: 0,
            inPitLane: false,
            timerStartTime: 0,
            extraTime: 0,
        }
    }
    let npos = initialState.npos
    npos.lastPoint %= totalPoints
    return {
        heatLaps: initialState.heatLaps,
        totalLaps: initialState.totalLaps,
        lastLapTime: initialState.lastLapTime,
        fastestLapTime: initialState.fastestLapTime,
        startTime: Date.now(),
        lapStartTime: initialState.lapStartTime,
        timeSinceLastFinish: initialState.timeSinceLastFinish,
        time: Date.now(),
        spd: initialState.spd,
        npos: initialState.npos,
        pos: 0,
        x: initialState.x,
        y: initialState.y,
        rpm: initialState.rpm,
        ir1: 0,
        vBatt: 12.6631,
        soc: initialState.soc,
        socZeroL: initialState.socZeroL,
        E: initialState.E,
        rpmv: initialState.rpmv,
        pbatt: 0,
        wh: initialState.wh,
        ecc: initialState.ecc,
        inPitLane: false,
        timerStartTime: initialState.timerStartTime ? initialState.timerStartTime : 0,
        extraTime: 0,
    }
}

const handleCompleteLap = (realPath, raceLine, physics, isFirstLap) => {
    if(!realPath) return
    const totalLength = realPath.getTotalLength()
    if(physics.pos < totalLength) return 

    physics.pos -= totalLength
    physics.npos = posToNpos(physics.pos, raceLine)
    if (!isFirstLap) {
        physics.heatLaps += 1
        physics.totalLaps += 1 
    }
    physics.timeSinceLastFinish = 0

    const time = Date.now() 
    const lapTime = (time - physics.lapStartTime) / 1000 
    physics.lastLapTime  = lapTime
    physics.lapStartTime = time
    if (lapTime < physics.fastestLapTime || physics.fastestLapTime == 0) {
        physics.fastestLapTime = lapTime
    }
}

export const posToNpos = (pos, raceLine) => {
    const totalLength = raceLine[0].distance
    if(pos < 0) pos += totalLength
    const n = raceLine.length
    const tempRaceLine = [{x: 0, y:0, distance: 0}, ...(raceLine.slice(1)), raceLine[0]]
    const nextPoint = 1 + raceLine.slice(1).findIndex((point) => pos < point.distance);
    const lastPoint = (nextPoint+n-1)%n 
    const nextDistance = tempRaceLine[lastPoint+1].distance
    const lastDistance = tempRaceLine[lastPoint].distance
    const fraction = (pos-lastDistance) / (nextDistance-lastDistance)

    return {lastPoint: lastPoint, frac: fraction}
}

const nposToPos = (npos, raceLine) => {
    const tempRaceLine = [{x: 0, y:0, distance: 0}, ...(raceLine.slice(1)), raceLine[0]]
    const lastDistance = tempRaceLine[npos.lastPoint].distance
    const nextDistance = tempRaceLine[npos.lastPoint+1].distance
    const pos = lastDistance + (nextDistance - lastDistance) * npos.frac
    return pos
}

const calculatePhysics = (getThrottle, physics, carParams,
    setAnalystData, realPath, raceLine, setGForce,
    stopButtonPressed, controllerOn, setControllerOn,
    isFirstLap, pitting, cruiseControl=-1
) => {
    if(raceLine[0].distance == 1) {
        return physics
    }

    // const shouldLog = !window.APP_DEBUG 
    const shouldlog = false
    const g=9.812, rho=1.225, pi=3.14159, epsv=0.01  // physical constants
    const m=carParams.mass, D=carParams.D, mu=0.75, crr=carParams.crr, wheelEff=1, cd=carParams.cd, A=carParams.A // vehicle parameters
    const NG=carParams.NG
    const r02=0.02, tau=3000, C=carParams.C  // battery parameters
    const thmax=5, thregn=1.5, rpmMax=750  // throttle parameters
    const tsp=8, tm=15, N=1, gearEff=1  // sprocket/chain parameters

    const r1 = C==26 ? 0.010546 : 0.029529
    if(shouldLog) console.log("NG: ", NG, ", r1 = ", r1)


    // old values
    let rpmv = physics.rpmv 
    let spd = physics.spd
    let rpm = physics.rpm
    let ir1 = physics.ir1
    let socZeroL = physics.socZeroL
    let soc = physics.soc
    let E = physics.E
    let ecc = physics.ecc

    const time = Date.now()
    if(shouldLog) console.log()
    if(shouldLog) console.log("----------------------")
    if(shouldLog) console.log("t: ", (time - physics.startTime)/1000)
    if(shouldLog) console.log()
    const dt = (time - physics.time) / 1000
    physics.time = time

    const dttau = dt / tau

    let spdMax = 1000
    const prevPos = nposToPos(physics.npos, raceLine)
    const radius = getTurningRadius(prevPos, realPath)
    if(radius) {
        spdMax = Math.sqrt(g * mu * radius.R) 
    }

    let useCruiseControl = false
    if(cruiseControl != -1) {
        useCruiseControl = true
    } 
    
    if (spd > spdMax) {
        cruiseControl = useCruiseControl ? Math.min(spdMax, cruiseControl) : spdMax
        useCruiseControl = true
    }
    
    if (stopButtonPressed && physics.spd < 3) {
        cruiseControl = 0
        useCruiseControl = true
    }

    // Four modes: 
    // spd < 0.9cc: use throttle
    // 0.9cc <= spd < cc: set throttle = 1
    // cc <= spd < 1.1cc: set throttle = 0
    // spd >= 1.1cc: set throttle -1, apply mechanical brake
    let ccMode, th
    if(stopButtonPressed && physics.spd >= 3) {
        ccMode = "stop-regen"
        th = -1
    } else if (!useCruiseControl || spd < 0.9 * cruiseControl) {
        ccMode = "userThrottle"
        th = getThrottle(prevPos)
    } else if (spd >= 0.9*cruiseControl && spd < cruiseControl) {
        ccMode = "lowGas"
        th = 1
    } else if (spd >= cruiseControl && spd < 1.1*cruiseControl) {
        ccMode = "roll"
        th = 0
    } else {
        ccMode = "brake"
        th = -1
    }

    if(shouldLog) console.log("th: ", th)
    
    const trmax = polynomial(rpmv, 81.6265, -1.24086, -3.19602, 0.710122, -0.0736331, 0.00390688, -0.000085488)
    if(shouldLog) console.log("trmax: ", trmax)
    const imax = rpmv <= 13.79361 ? -0.6174*rpmv + 41.469 : -0.6174* rpmv + 41.469
    if(shouldLog) console.log("imax: ", imax)

    let trmotor = trmax * Math.pow(th / thmax, 1.6) * controllerOn
    if (th < 0) trmotor = trmax * th * thregn * Math.pow(rpm/rpmMax, 2)
    if (soc <= 0) trmotor = 0
    if(shouldLog) console.log("trmotor: ", trmotor)

    let imotor = imax * Math.pow(th / thmax, 1.6) * controllerOn 
    if (th < 0) imotor = imax * th * thregn * Math.pow(rpm / rpmMax, 2)
    // if (soc <= 0) imotor = 0 // and statment, if controller is turned off. remove this line
    if(shouldLog) console.log("imotor: ", imotor)

    const ftire = trmotor / (D/2) * NG
    if(shouldLog) console.log("ftire: ", ftire)

    const frr = m * g * crr / wheelEff
    if(shouldLog) console.log("frr: ", frr)

    const fd = 0.5 * rho * cd * A * Math.pow(spd, 2)
    if(shouldLog) console.log("fd ", fd)

    let fnet = (ccMode === "brake") ? m * (cruiseControl - physics.spd) / dt : ftire - frr - fd
    if (spd <= 0 && ftire < frr) fnet = 0
    if(shouldLog) console.log("fnet: ", fnet)

    const accel = fnet / m
    if(shouldLog) console.log("accel: ", accel)

    spd += accel * dt 
    if (spd < epsv) spd = 0
    if(shouldLog) console.log("spd: ", spd)

    let lateral = 0
    if(radius) lateral = Math.pow(spd, 2) / radius.R * radius.dir

    let brakeStyle = "notBraking"
    if (th == -1) brakeStyle = "regen"
    if (ccMode === "brake") brakeStyle = "brake"
    setGForce({x: lateral/g, y: accel/g, brake: brakeStyle})

    const pos = nposToPos(physics.npos, raceLine) + spd * dt
    if(shouldLog) console.log("pos ", pos)
    const npos = posToNpos(pos, raceLine)
    if(shouldLog) console.log("npos ", npos)
    
    rpm = spd * 60 / (D * pi)
    if(shouldLog) console.log("rpm: ", rpm)

    ir1 = dttau * imotor + (1 - dttau) * ir1
    if(shouldLog) console.log("ir1 ", ir1)

    const vr0r2 = imotor * r02
    if(shouldLog) console.log("vr0r2: ", vr0r2)

    const vr1 = ir1 * ir1 * r1 // This seems odd, but orders from Nabih! 
    if(shouldLog) console.log("vr1: ", vr1)

    const voc = polynomial(socZeroL, 10.862, 0.056091, -0.00068882, 0.0000030802)
    if(shouldLog) console.log("voc: ", voc)

    const vBatt = voc - vr0r2 - vr1
    if(shouldLog) console.log("vbatt: ", vBatt)

    const vZeroL = voc - vr1
    if(shouldLog) console.log("vzerol: ", vZeroL)

    soc = polynomial(vZeroL, -41397.3226448, 10988.9, -973.093, 28.752)
    if (soc > 100) soc = 100
    if (soc < 1) {
        // soc = 0  // here: turn off controller
        setControllerOn(false)
    }
    if(shouldLog) console.log("soc ", soc)

    socZeroL = (1 - E / C) * 100
    if (socZeroL > 100) socZeroL = 100
    if(shouldLog) console.log("socZeroL ", socZeroL)

    E += imotor * dt / 3600 
    if(shouldLog) console.log("E: ", E)

    rpmv = rpm / (vBatt*4)
    if(shouldLog) console.log("rpmv: ", rpmv)

    const pBatt = imotor * vBatt * 4
    if(shouldLog) console.log("pBatt: ", pBatt)

    const pMotor = trmotor * rpm * 2 * pi / 60
    if(shouldLog) console.log("pMotor: ", pMotor)

    const pVeh = (frr + fd) * spd
    if(shouldLog) console.log("pVeh: ", pVeh)

    ecc += (E - physics.E)
    const wh = physics.wh + pBatt*dt/3600

    const loc = getXY(pos, realPath, pitting)

    const timeSinceLastFinish = physics.timeSinceLastFinish + dt

    // write to  output
    physics.imotor = imotor
    physics.spd = spd
    physics.pos = pos
    physics.npos = npos
    physics.x = loc.x
    physics.y = loc.y
    physics.rpm = rpm
    physics.ir1 = ir1
    physics.vBatt = vBatt
    physics.soc = soc
    physics.socZeroL = socZeroL
    physics.E = E
    physics.rpmv = rpmv
    physics.pBatt = pBatt
    physics.wh = wh
    physics.ecc = ecc
    physics.radius = radius
    physics.timeSinceLastFinish = timeSinceLastFinish

    handleCompleteLap(realPath, raceLine, physics, isFirstLap)
    
    // update analyst display
    updateAnalyst(physics, setAnalystData)
    const newPhysics = JSON.parse(JSON.stringify(physics));
    return newPhysics
}

const getTurningRadius = (pos, realPath) => {
    if(!realPath) return 
    const leadDist = 15
    const lagDist = 5
    const l = realPath.getTotalLength()
    const A = realPath.getPointAtLength(pos % l)
    const B = realPath.getPointAtLength((pos + l - lagDist)%l)
    const C = realPath.getPointAtLength((pos + leadDist) % l)

    const Bx = B.x - A.x
    const By = B.y - A.y
    const Cx = C.x - A.x
    const Cy = C.y - A.y

    const beta = (Bx * Cx + By * Cy - Bx*Bx - By * By) / (2*(-Bx * Cy + By * Cx))
    const Mx = 0.5*Cx + beta*Cy
    const My = 0.5*Cy - beta*Cx
    const R = Math.sqrt(Math.pow(Mx, 2) + Math.pow(My, 2))

    return {Mx: Mx+A.x, My: My+A.y, R: R, lagx: Bx + A.x, lagy: By + A.y, leadx: Cx + A.x, leady: Cy + A.y, dir: Math.sign(beta)}
}

const getXY = (pos, realPath, pitting) => {
    if(!realPath) return {x: 0, y: 0}
    const l = realPath.getTotalLength()
    const loc = realPath.getPointAtLength(pos % l)
    if(pitting) {
        loc.x -= 3
        loc.y -= 3
    }
    return {x: loc.x, y: loc.y}
}

export {calculatePhysics, getInitialPhysicsState}