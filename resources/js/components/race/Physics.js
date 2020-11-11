const polynomial = (v, constant, p1, p2=0, p3=0, p4=0, p5=0, p6=0) => {
    return constant + p1 * v + p2 * Math.pow(v, 2) + p3 * Math.pow(v, 3) + p4 * Math.pow(v, 4) + p5 * Math.pow(v, 5) + p6 * Math.pow(v, 6) 
}

const updateAnalyst = (physics, setAnalystData) => {
    const current = physics.imotor.toFixed(1)
    const skph = (physics.spd *3600 / 1000).toFixed(1)
    const voltage = physics.vBatt.toFixed(1)
    const power = physics.pBatt.toFixed(1)
    const ampHours = physics.ecc.toFixed(1)
    const wattHours = physics.wh.toFixed(1)
    setAnalystData({speed: skph, voltage: voltage, current: current, ampHours: ampHours, power: power, wattHours: wattHours})
}

const getInitialPhysicsState = () => {
    return {
        startTime: Date.now(),
        time: Date.now(), 
        trmax: 0, 
        spd: 0, 
        pos: 0, 
        rpm: 0,
        ir1: 0,
        vBatt: 12.6631,
        soc: 100,
        socZeroL: 100,
        E: 0,
        rpmv: 0,
        pbatt: 0,
        wh: 0,
        ecc: 0
    }
}

const updatePhysics = (getThrottle, physics, setPhysics, socket, setAnalystData, realPath, setGForce) => {
    const production = !window.APP_DEBUG 
    const g=9.812, rho=1.225, pi=3.14159, epsv=0.01  // physical constants
    const m=159, D=0.4064, mu=0.75, crr=0.017, wheelEff=1, cd=0.45, A=1.6 // vehicle parameters
    const r02=0.02, r1=0.010546, tau=3000, C=26  // battery parameters
    const thmax=5, thregn=1.5, rpmMax=750  // throttle parameters
    const tsp=8, tm=15, N=1, gearEff=1  // sprocket/chain parameters

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
    if(production) console.log()
    if(production) console.log("----------------------")
    if(production) console.log("t: ", (time - physics.startTime)/1000)
    if(production) console.log()
    const dt = (time - physics.time) / 1000
    physics.time = time

    const dttau = dt / tau

    let brakeForTurn = false
    let spdMax = 1000

    const radius = getTurningRadius(physics.pos, realPath)
    if(radius) {
        spdMax = Math.sqrt(g * mu * radius.R) 
        if (spd > spdMax) {
            console.log("BRAKE!")
            brakeForTurn = true
        }
    }

    const th = brakeForTurn ? -1 : getThrottle(physics.pos)
    if(production) console.log("th: ", th)
    
    const trmax = polynomial(rpmv, 81.6265, -1.24086, -3.19602, 0.710122, -0.0736331, 0.00390688, -0.000085488)
    if(production) console.log("trmax: ", trmax)
    const imax = rpmv <= 13.79361 ? -0.6174*rpmv + 41.469 : -0.6174* rpmv + 41.469
    if(production) console.log("imax: ", imax)

    let trmotor = trmax * Math.pow(th / thmax, 1.6)
    if (th < 0) trmotor = trmax * th * thregn * Math.pow(rpm/rpmMax, 2)
    if (soc <= 0) trmotor = 0
    if(production) console.log("trmotor: ", trmotor)

    let imotor = imax * Math.pow(th / thmax, 1.6)
    if (th < 0) imotor = imax * th * thregn * Math.pow(rpm / rpmMax, 2)
    if (soc <= 0) imotor = 0
    if(production) console.log("imotor: ", imotor)

    const ftire = trmotor / (D/2) * gearEff
    if(production) console.log("ftire: ", ftire)

    const frr = m * g * crr / wheelEff
    if(production) console.log("frr: ", frr)

    const fd = 0.5 * rho * cd * A * Math.pow(spd, 2)
    if(production) console.log("fd ", fd)

    const fnet = brakeForTurn ? m * (spdMax - physics.spd) / dt : ftire - frr - fd
    if (spd <= 0 && ftire < frr) fnet = 0
    if(production) console.log("fnet: ", fnet)

    const accel = fnet / m
    if(production) console.log("accel: ", accel)

    spd += accel * dt 
    if (spd < epsv) spd = 0
    if(production) console.log("spd: ", spd)

    let lateral = 0
    if(radius) lateral = Math.pow(spd, 2) / radius.R * radius.dir
    setGForce([accel/g, lateral/g])

    const pos = physics.pos + spd * dt
    if(production) console.log("pos ", pos)
    
    rpm = spd * 60 / (D * pi)
    if(production) console.log("rpm: ", rpm)

    ir1 = dttau * imotor + (1 - dttau) * ir1
    if(production) console.log("ir1 ", ir1)

    const vr0r2 = imotor * r02
    if(production) console.log("vr0r2: ", vr0r2)

    const vr1 = ir1 * r1
    if(production) console.log("vr1: ", vr1)

    const voc = polynomial(socZeroL, 10.862, 0.056091, -0.00068882, 0.0000030802)
    if(production) console.log("voc: ", voc)

    const vBatt = voc - vr0r2 - vr1
    if(production) console.log("vbatt: ", vBatt)

    const vZeroL = voc - vr1
    if(production) console.log("vzerol: ", vZeroL)

    soc = polynomial(vZeroL, -41397.3226448, 10988.9, -973.093, 28.752)
    if (soc > 100) soc = 100
    if (soc < 1) soc = 0
    if(production) console.log("soc ", soc)

    socZeroL = (1 - E / C) * 100
    if (socZeroL > 100) socZeroL = 100
    if(production) console.log("socZeroL ", socZeroL)

    E += imotor * dt / 3600 
    if(production) console.log("E: ", E)

    rpmv = rpm / (vBatt*4)
    if(production) console.log("rpmv: ", rpmv)

    const pBatt = imotor * vBatt * 4
    if(production) console.log("pBatt: ", pBatt)

    const pMotor = trmotor * rpm * 2 * pi / 60
    if(production) console.log("pMotor: ", pMotor)

    const pVeh = (frr + fd) * spd
    if(production) console.log("pVeh: ", pVeh)

    ecc += (E - physics.E)
    const wh = physics.wh + pBatt*dt/3600

    // write to  output
    physics.imotor = imotor
    physics.spd = spd
    physics.pos = pos    
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

    setPhysics(physics)

    // update analyst display
    updateAnalyst(physics, setAnalystData)

    // update other users (Should probably be somewhere else)
    let data = {"counter": physics.pos}
    let message = JSON.stringify(data)
    try {
        socket.send(message)
    } catch {
        console.log("Couldn't send")
    }
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

export {updatePhysics, getInitialPhysicsState}