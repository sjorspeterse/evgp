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

const updatePhysics = (getThrottle, physics, setPhysics, socket, setAnalystData) => {
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
    console.log()
    console.log("----------------------")
    console.log("t: ", (time - physics.startTime)/1000)
    console.log()
    const dt = (time - physics.time) / 1000
    physics.time = time

    const dttau = dt / tau

    const th = getThrottle(physics.pos)
    console.log("th: ", th)
    
    const trmax = polynomial(rpmv, 81.6265, -1.24086, -3.19602, 0.710122, -0.0736331, 0.00390688, -0.000085488)
    console.log("trmax: ", trmax)
    const imax = rpmv <= 13.79361 ? -0.6174*rpmv + 41.469 : -0.6174* rpmv + 41.469
    console.log("imax: ", imax)

    let trmotor = trmax * Math.pow(th / thmax, 1.6)
    if (th < 0) trmotor = trmax * th * thregn * Math.pow(rpm/rpmMax, 2)
    if (soc <= 0) trmotor = 0
    console.log("trmotor: ", trmotor)

    let imotor = imax * Math.pow(th / thmax, 1.6)
    if (th < 0) imotor = imax * th * thregn * Math.pow(rpm / rpmMax, 2)
    if (soc <= 0) imotor = 0
    console.log("imotor: ", imotor)

    const ftire = trmotor / (D/2) * gearEff
    console.log("ftire: ", ftire)

    const frr = m * g * crr / wheelEff
    console.log("frr: ", frr)

    const fd = 0.5 * rho * cd * A * Math.pow(spd, 2)
    console.log("fd ", fd)

    let fnet = ftire - frr - fd
    if (spd <= 0 && ftire < frr) fnet = 0
    console.log("fnet: ", fnet)

    const accel = fnet / m
    console.log("accel: ", accel)

    spd += accel * dt 
    if (spd < epsv) spd = 0
    console.log("spd: ", spd)

    const pos = physics.pos + spd * dt
    console.log("pos ", pos)

    rpm = spd * 60 / (D * pi)
    console.log("rpm: ", rpm)

    ir1 = dttau * imotor + (1 - dttau) * ir1
    console.log("ir1 ", ir1)

    const vr0r2 = imotor * r02
    console.log("vr0r2: ", vr0r2)

    const vr1 = ir1 * r1
    console.log("vr1: ", vr1)

    const voc = polynomial(socZeroL, 10.862, 0.056091, -0.00068882, 0.0000030802)
    console.log("voc: ", voc)

    const vBatt = voc - vr0r2 - vr1
    console.log("vbatt: ", vBatt)

    const vZeroL = voc - vr1
    console.log("vzerol: ", vZeroL)

    soc = polynomial(vZeroL, -41397.3226448, 10988.9, -973.093, 28.752)
    if (soc > 100) soc = 100
    if (soc < 1) soc = 0
    console.log("soc ", soc)

    socZeroL = (1 - E / C) * 100
    if (socZeroL > 100) socZeroL = 100
    console.log("socZeroL ", socZeroL)

    E += imotor * dt / 3600 
    console.log("E: ", E)

    rpmv = rpm / (vBatt*4)
    console.log("rpmv: ", rpmv)

    const pBatt = imotor * vBatt * 4
    console.log("pBatt: ", pBatt)

    const pMotor = trmotor * rpm * 2 * pi / 60
    console.log("pMotor: ", pMotor)

    const pVeh = (frr + fd) * spd
    console.log("pVeh: ", pVeh)

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

export {updatePhysics, getInitialPhysicsState}