import React, {useState, useEffect} from 'react';
import '../ahmed.css';
import './configuration.css';
import * as co from "./ConfigurationOptions"

const getOption = (carConfig, part) => co.getOption(part, carConfig[part])

const calculateMass = (carConfig) => {
    const chassis = getOption(carConfig, co.chassis).mass
    const body = getOption(carConfig, co.body).mass
    const canopy = getOption(carConfig, co.canopy).mass
    const frontWheel = getOption(carConfig, co.frontWheel).mass
    const battery = getOption(carConfig, co.battery).mass
    return 159 + chassis + body + canopy + frontWheel + battery
}

const calculateDrag = (carConfig) => {
    const body = getOption(carConfig, co.body).cd
    const canopy = getOption(carConfig, co.canopy).cd
    return body + canopy
}

const calculateArea = (carConfig) => {
    const body = getOption(carConfig, co.body).A
    const canopy = getOption(carConfig, co.canopy).A
    return body + canopy
}

const calculateDiameter = (carConfig) => {
    const driveSystem = getOption(carConfig, co.drivesys).tireDiam
    const rearTire = getOption(carConfig, co.rearTire).tireDiam
    return (driveSystem + rearTire) * 0.0245  // convert from inch to m
}

const calculateRollingResistance = (carConfig) => {
    return getOption(carConfig, co.frontWheel).crr
}

const calculateCapacity = (carConfig) => {
    return getOption(carConfig, co.battery).capacity
}

const calculateNG = (carConfig) => {
    if(carConfig[co.drivesys] === co.wheelMotor || carConfig[co.sprocket] === co.teeth18) {
        return 1
    } else {
        return 1.2
    }
}

const calculateDriverChangeTime = (carConfig) => {
    const body = getOption(carConfig, co.body).driverTime
    const canopy = getOption(carConfig, co.canopy).driverTime
    return 30 + body + canopy
}

const updateCarParams = (config, setParams) => {
    setParams(calculateCarParams(config))
}

const calculateCarParams = (config) => {
    return ({
        mass: calculateMass(config),
        cd: calculateDrag(config),
        A: calculateArea(config),
        D: calculateDiameter(config),
        crr: calculateRollingResistance(config),
        C: calculateCapacity(config),
        NG: calculateNG(config),
        driverTime: calculateDriverChangeTime(config),
        chassis: getOption(config, co.chassis),
        drivesys: getOption(config, co.drivesys),
        frontWheel: getOption(config, co.frontWheel)
    })
}

export const initCarParams = (storedConfig) => {
    const config = storedConfig.mass ? storedConfig : getDefaultConfig()
    return calculateCarParams(config)
}

const getDefaultConfig = () => {
    return ({
        [co.chassis]: co.steel, 
        [co.body]: co.base,
        [co.canopy]: co.none,
        [co.drivesys]: co.wheelMotor,
        [co.sprocket]: co.teeth15,
        [co.rearTire]: co.defaultTire,
        [co.frontWheel]: co.spoked,
        [co.battery]: co.single
    })
}

const ConfigureationPage = (props) => {
    const user = props.user
    const [activeMenu, setActiveMenu] = useState(co.chassis)
    const [configuration, setConfiguration] = useState(props.savedConfig.CHASSIS ? props.savedConfig : getDefaultConfig())

    useEffect(() => updateCarParams(configuration, props.setParams), [configuration])

    const currentOption = co.options[activeMenu][configuration[activeMenu]]
    
    const getImageName = () => {
        if(activeMenu === co.rearTire) {
            return "TIRE-" + configuration[co.drivesys] + "-" + configuration[co.rearTire]
        }
        return activeMenu + "-" + configuration[activeMenu]
    }

    const getImage = () => {
        const text = (name) => <div style={{"fontSize": "10vh", "color": "yellow"}}> {name} </div>
        
        if(activeMenu === co.canopy && configuration[co.canopy] === "None") {
            return text("NO CANOPY")
        }
        if(activeMenu === co.sprocket && configuration[co.drivesys] != co.sprockChain) {
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
        if(name === co.sprocket && configuration[co.drivesys] != co.sprockChain) {
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
        if(activeMenu === co.sprocket && configuration[co.drivesys] != co.sprockChain) {
            return []
        }
        Object.keys(co.options[activeMenu]).forEach((key) => {
            const option = co.options[activeMenu][key].name
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

    const saveAndContinue  = () => {
        const data = configuration
        props.setPage("race")
        fetch('/api/car-config/' + user.userName, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {"Content-type": "application/json; charset=UTF-8"} })
    }
    const carNr = user.carNr

    return (
        <div className="container-fluid mainContainer col-12 col-lg-8 col-md-11">

		<div className="container-fluid E1">
			<div className="row mx-0 ">	
				<div className="col-2 logo1-div text-left pl-0">
					<img className=" img-fluid logo" src="/images/logo.jpg"/>
				</div>
				<div className="col-8 middle-div text-center px-4 py-1 ">
					<h3> VEHICLE CONFIGURATION SETUP</h3>
                    <p>Car No. {carNr.substring(carNr.length-2)}</p>
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
                        {menuItem(co.chassis)}
                        {menuItem(co.body)}
                        {menuItem(co.canopy)}
                        {menuItem(co.drivesys)}
                        {menuItem(co.sprocket)}
                        {menuItem(co.rearTire)}
                        {menuItem(co.frontWheel)}
                        {menuItem(co.battery)}
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
                            onClick={saveAndContinue}
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
