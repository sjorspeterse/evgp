import React, {useState} from 'react';
import '../ahmed.css';
import './configuration.css';

const chassis = "CHASSIS", body = "OUTERBODY", canopy = "CANOPY", drivesys = "DRIVE SYSTEM",
sprocket = "MOTOR SPROCKET", rearTire = "REAR TIRE", frontWheel = "FRONT WHEEL", battery = "BATTERY"

const steel = "Steel", alum1 = "Aluminium 1", alum2 = "Aluminium 2", alum3 = "Aluminium 3"
const base = "Baseline", small = "Smaller"
const none = "None", half = "Front half", full = "Full"
const wheelMotor = "Wheel motor", sprockChain = "Sprocket-chain"
const teeth15 = "15 teeth", teeth18 = "18 teeth" 
const defaultTire = "Default", largeTire = "Larger tire"
const spoked = "Spoked", solid = "Solid aluminium"
const single = "Single pack", double = "Double pack"

const options = {
    [chassis]: { 
        [steel]: {name: steel, mass: 15, reliability: 100, repairTime: 0,
            description: "Mass: 15kg, Reliability: 100%", important: ""}, 
        [alum1]: {name: alum1, mass: 14, reliability: 98, repairTime: 30,
            description: "Mass: 14 kg, Reliability: 98%", important: "Repair time: 30 sec"}, 
        [alum2]: {name: alum2, mass: 12, reliability: 94, repairTime: 45,
            description: "Mass: 12 kg, Reliability: 94%", important: "Repair time: 45 sec"},
        [alum3]: {name: alum3, mass: 10, reliability: 90, repairTime: 30,  // + pit
             description: "Mass: 10 kg, reliability: 90%", important: "Can only be repaired in the pit lane (30 sec)"},
    },    
    [body]: {
        [base]: {name: base, Cd: 0.45, A: 1.4, mass: 7, driverTime: 0,
            description: "Drag coefficient: 0.45, Frontal area: 1.4 m^2, Mass: 7 kg", important: ""}, 
        [small]: {name: small, Cd: 0.45, A: 1.3, mass: 6.5, driverTime: 30,
            description: "Drag coefficient: 0.45, Frontal area: 1.3 m^2, Mass: 6.5 kg", 
            important: "Driver change delay: 30 sec"}, 
},    
    [canopy]: {
        [none]: {name: none}, 
        [half]: {name: half}, 
        [full]: {name: full},
},    
    [drivesys]: [
        {name: wheelMotor}, 
        {name: sprockChain},
],    
    [sprocket]: [
        {name: teeth15},
        {name: teeth18},
    ], 
    [rearTire]: [
        {name: defaultTire},
        {name: largeTire},
    ],
    [frontWheel]: [
        {name: spoked},
        {name: solid},
],    
    [battery]: [
        {name: single},
        {name: double},
    ] 
}    
    
const ConfigureationPage = (props) => {
    const user = props.user
    const [activeMenu, setActiveMenu] = useState(chassis)
    const [configuration, setConfiguration] = useState({
        [chassis]: steel, 
        [body]: base,
        [canopy]: none,
        [drivesys]: wheelMotor,
        [sprocket]: teeth15,
        [rearTire]: defaultTire,
        [frontWheel]: spoked,
        [battery]: single
    })

    const currentOption = options[activeMenu][configuration[activeMenu]]

    const getImageName = () => {
        if(activeMenu === rearTire) {
            return "TIRE-" + configuration[drivesys] + "-" + configuration[rearTire]
        }
        return activeMenu + "-" + configuration[activeMenu]
    }

    const getImage = () => {
        const text = (name) => <div style={{"fontSize": "10vh", "color": "yellow"}}> {name} </div>
        
        if(activeMenu === canopy && configuration[canopy] === "None") {
            return text("NO CANOPY")
        }
        if(activeMenu === sprocket && configuration[drivesys] != sprockChain) {
            return text("NOT APPLICABLE")
        }

        const image = 
            <img 
                style={{"maxWidth": "100%", "maxHeight": "90%"}} 
                src={"/images/" + getImageName() + ".png"}/>
        return image
    }

    const menuItem = (name) => {
        let chosenOption = ""
        if(name === sprocket && configuration[drivesys] != sprockChain) {
            chosenOption = "Not applicable"
        } else {
            chosenOption = configuration[name]
        }
        return (
            <li className="mb-2">
                <ul className=" px-0 item-list">
                    <li className="part ">
                        <a 
                            className={name === activeMenu ? "active" : ""}
                            style={{"cursor": "pointer"}}
                            onClick={() => setActiveMenu(name)}
                        >{name} </a>	
                    </li>
                    <li className="option">
                        {chosenOption}
                    </li>
                </ul>
            </li>
        )
    }
    const getOptions = () => {
        let list = [];
        if(activeMenu === sprocket && configuration[drivesys] != sprockChain) {
            return []
        }
        Object.keys(options[activeMenu]).forEach((key) => {
            const option = options[activeMenu][key].name
            list.push(
                <td 
                    className={option === configuration[activeMenu] ? "active" : ""} 
                    key={option}
                    style={{"cursor": "pointer"}}
                    onClick={() => {
                        setConfiguration(old => ({...old, [activeMenu]: option}))
                    }}
                > 
                    {option} 
                </td>
            )
        })
        return list
    }


    return (
        <div className="container-fluid mainContainer col-12 col-lg-8 col-md-11">

		<div className="container-fluid E1">
			<div className="row mx-0 ">	
				<div className="col-2 logo1-div text-left pl-0">
					<img className=" img-fluid logo" src="/images/logo.jpg"/>
				</div>
				<div className="col-8 middle-div text-center px-4 py-1 ">
					<h3> VEHICLE CONFIGURATION SETUP</h3>
                    <p > Car No. {user.carNr}</p>
					<p>{user.name}</p>
				</div>
				<div className="col-2 text-right logo2-div pr-0">
					<img className=" img-fluid logo" src="/images/logo_DOEE.png"/>
				</div>
			</div>
		</div>

		<div className="container-fluid E2 mt-4 ">
			<div className="row mx-0 ">
				<div className="col-2 d1 py-3 pl-2">
					<ul className=" pl-0 items ">
                        {menuItem(chassis)}
                        {menuItem(body)}
                        {menuItem(canopy)}
                        {menuItem(drivesys)}
                        {menuItem(sprocket)}
                        {menuItem(rearTire)}
                        {menuItem(frontWheel)}
                        {menuItem(battery)}
					</ul>
				</div>

				<div className="col-10 d2 p-4 ">
					<table className="table">
                        <tbody>
                            <tr>
                                <th>
                                    {activeMenu} OPTIONS:
                                </th>
                                {getOptions()}
                            </tr>
                        </tbody>
					</table>
					<div className="image-div my-auto text-center ">
                        {getImage()}
					</div>
                    <div className="text-right">
                        <button className=" px-2 py-2 btn btn-success " 
                            onClick={() => props.setPage("race")}
                        > SAVE AND GO TO TRACK
                        </button>
                    </div>
				</div>
			</div>
		</div>


		<div className="container-fluid E3 py-4 ">
			<div className="d3 p-1 text-center">
				<h3 className="red" >
					EXPLANATION OF SELECTION
				</h3>
				<table className="table">
                    <tbody>
                        <tr>
                            <td>{currentOption.description}<br/>
                                <small 
                                    style={{"color": "yellow", "fontWeight": "bold"}}
                                >{currentOption.important}</small></td>
                        </tr>
                    </tbody>
				</table>
			</div>
		</div>


	</div>
    )
}

export default ConfigureationPage;
