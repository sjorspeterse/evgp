
export const chassis = "CHASSIS", body = "OUTERBODY", canopy = "CANOPY", drivesys = "DRIVE SYSTEM",
sprocket = "MOTOR SPROCKET", rearTire = "REAR TIRE", frontWheel = "FRONT WHEELS", battery = "BATTERY"

export const steel = "Steel", alum1 = "Aluminium 1", alum2 = "Aluminium 2", alum3 = "Aluminium 3"
export const base = "Baseline", small = "Smaller"
export const none = "None", half = "Front half", full = "Full"
export const wheelMotor = "Wheel motor", sprockChain = "Sprocket-chain"
export const teeth15 = "15 teeth", teeth18 = "18 teeth" 
export const defaultTire = "Default", largeTire = "Larger tire"
export const spoked = "Spoked", solid = "Solid aluminium"
export const single = "Single pack", double = "Double pack"

export const options = {
    [chassis]: { 
        [steel]: {name: steel, mass: 0, reliability: 100, repairTime: 0,
            description: "Mass: 15kg, Reliability: 100%", important: ""}, 
        [alum1]: {name: alum1, mass: -1, reliability: 98, repairTime: 30,
            description: "Mass: 14 kg, Reliability: 98%", important: "Repair time: 30 sec"}, 
        [alum2]: {name: alum2, mass: -3, reliability: 94, repairTime: 45,
            description: "Mass: 12 kg, Reliability: 94%", important: "Repair time: 45 sec"},
        [alum3]: {name: alum3, mass: -5, reliability: 90, repairTime: 30,  // + pit
             description: "Mass: 10 kg, Reliability: 90%", important: "Can only be repaired in the pit lane (30 sec)"},
    },    
    [body]: {
        [base]: {name: base, Cd: 0.45, A: 1.4, mass: 0, driverTime: 0,
            description: "Drag coefficient: 0.45, Frontal area: 1.4 m^2, Mass: 7 kg", important: ""}, 
        [small]: {name: small, Cd: 0.45, A: 1.3, mass: -0.5, driverTime: 30,
            description: "Drag coefficient: 0.45, Frontal area: 1.3 m^2, Mass: 6.5 kg", 
            important: "Driver change delay: 30 sec"}, 
    },    
    [canopy]: {
        [none]: {name: none, Cd: 0, A: 0, mass: 0, driverTime: 0, 
            description: "", important: ""},
        [half]: {name: half, Cd: -0.03, A: 0.2, mass: 1.3, driverTime: 0, 
            description: "Drag coefficient: -0.03, Frontal area: +0.2 m^2, Mass: +1.3 kg", imporant: ""}, 
        [full]: {name: full, Cd: -0.08, A: 0.2, mass: 2.5, driverTime: 30,
            description: "Drag coefficient: -0.08, Frontal area: +0.2 m^2, Mass: +2.5 kg",
            important: "Driver change delay: 30 sec"},
    },    
    [drivesys]: {
        [wheelMotor]: {name: wheelMotor, tireDiam: 16, reliability: 100, repairTime: 0, 
            description: "Tire outer diameter: 16'', Reliability: 100%", important: ""}, 
        [sprockChain]: {name: sprockChain, tireDiam: 18, reliability: 95, repairTime: 30,
            description: "Tire outer diameter: 20'', Reliability: 95%", important: "Repair time: 30 sec"},
    },    
    [sprocket]: {
        [teeth15]: {name: teeth15, mainTeeth: 60, motorTeeth: 15, 
            description: "Main sprocket: 60 teeth, Motor sprocket: 15 teeth", important: ""},
        [teeth18]: {name: teeth18, mainTeeth: 60, motorTeeth: 18, 
            description: "Main sprocket: 60 teeth, Motor sprocket: 18 teeth", important: ""},
    }, 
    [rearTire]: {
        [defaultTire]: {name: defaultTire, tireDiam: 0, description: "", important: ""},
        [largeTire]: {name: largeTire, tireDiam: 2, description: "Tire outer diamter: +2''", important: ""},
    },
    [frontWheel]: {
        [spoked]: {name: spoked, mass: 0, reliability: 90, crr: 0.018, repairTime: 30,
            description: "Mass for 2 wheels: 7 kg, Reliability: 90%, Rolling resistance coefficient: 0.018",
            important: "Repair time: 30 sec"}, 
        [solid]: {name: solid, mass: 3, reliability: 100, crr: 0.017, repairTime: 0,
            description: "Mass for 2 wheels: 10 kg, Reliability: 100%, Rolling resistance coefficient: 0.017",
            important: ""},
    },    
    [battery]: {
        [single]: {name: single, packs: 1, capacity: 26, mass: 0, 
            description: "1 pack, 4 batteries. Energy capacity: 26 AH, Mass = 8 kg/battery", important: ""},
        [double]: {name: double, packs: 2, capacity: 12, mass: -4.3*4, 
            description: "2 pack, 4 batteries/pack. Energy capacity: 12 AH/pack, Mass = 3.7 kg/battery", important: ""},
    }
}   