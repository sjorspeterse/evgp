const polynomial = (v, constant, p1, p2=0, p3=0, p4=0, p5=0, p6=0) => {
    return constant + p1 * v + p2 * Math.pow(v, 2) + p3 * Math.pow(v, 3) + p4 * Math.pow(v, 4) + p5 * Math.pow(v, 5) + p6 * Math.pow(v, 6) 
}

const updateAnalyst = (physics, setAnalystData, value) => {
    const newValue = value.toFixed(1)
    const current = physics.imotor.toFixed(1)
    const skph = (physics.spd *3600 / 1000).toFixed(1)
    setAnalystData({speed: skph, voltage: 0, current: current, ampHours: 0, power: 0, wattHours: newValue})
}

const getInitialPhysicsState = () => {
    return {
        time: Date.now(), 
        trmax: 0, 
        spd: 0, 
        pos: 0, 
        rpmv: 0
    }
}

const updatePhysics = (getThrottle, physics, setPhysics, socket, setAnalystData) => {
    const g=9.812, rho=1.225, pi=3.14159, epsv=0.01  // physical constants
    const m=159, D=0.4064, mu=0.75, crr=0.017, wheelEff=1, cd=0.45, A=1.6 // vehicle parameters
    const r02=0.02, r1=0.010546, tau=3000, dttau=1.667e-04, C=26  // battery parameters
    const thmax=5, thregn=1.5, rpmMax=750  // throttle parameters
    const tsp=8, tm=15, N=1, gearEff=1  // sprocket/chain parameters

    // to get from physics:
    const velocity = 25, soc = 100, rpm = 0

    // old values
    const rpmv = physics.rpmv
    let spd = physics.spd

    const time = Date.now()
    const dt = (time - physics.time) / 1000
    physics.time = time

    const th = getThrottle(physics.pos)
    
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
    const fd = 0.5 * rho * cd * A * Math.pow(spd, 2)
    let fnet = ftire - frr - fd
    if (spd <= 0 && ftire < frr) fnet = 0

    const accel = fnet / m
    spd += accel * dt 
    if (spd < epsv) spd = 0

    const pos = physics.pos + spd * dt

    physics.imotor = imotor
    physics.spd = spd
    physics.pos = pos    


    setPhysics(physics)
    updateAnalyst(physics, setAnalystData, pos)

    let data = {"counter": physics.pos}
    let message = JSON.stringify(data)
    try {
        socket.send(message)
    } catch {
        console.log("Couldn't send")
    }
}

export {updatePhysics, getInitialPhysicsState}