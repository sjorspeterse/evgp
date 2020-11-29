import React, {useState} from 'react';
import '../ahmed.css';
import './configuration.css';

const ConfigureationPage = (props) => {
    const user = props.user
    const [activeMenu, setActiveMenu] = useState("OUTERBODY")
    const [configuration, setConfiguration] = useState({
        "CHASSIS": "Steel", 
        "OUTERBODY": "Baseline",
        "CANOPY": "None",
        "DRIVE SYSTEM": "Sprocket-chain",
        "MOTOR SPROCKET": "18 teeth",
        "REAR TIRE": "Larger tire",
        "FRONT WHEEL": "Spoked",
        "BATTERY": "Single pack"
    })

    const options = {
        "CHASSIS": ["Steel", "Aluminium 1", "Aluminium 2", "Aluminium 3"],
        "OUTERBODY": ["Baseline", "Smaller"],
        "CANOPY": ["None", "Front half", "Full"],
        "DRIVE SYSTEM": ["Wheel motor", "Sprocket-chain"],
        "MOTOR SPROCKET": ["15 teeth", "18 teeth"],
        "REAR TIRE": ["Default", "Larger tire"],
        "FRONT WHEEL": ["Spoked", "Solid aluminium"],
        "BATTERY": ["Single pack", "Double pack"]
    }

    const getImageName = () => {
        if(activeMenu === "REAR TIRE") {
            return "TIRE-" + configuration["DRIVE SYSTEM"] + "-" + configuration["REAR TIRE"]
        }
        return activeMenu + "-" + configuration[activeMenu]
    }

    const getImage = () => {
        const text = (name) => <div style={{"fontSize": "10vh", "color": "yellow"}}> {name} </div>
        
        if(activeMenu === "CANOPY" && configuration["CANOPY"] === "None") {
            return text("NO CANOPY")
        }
        if(activeMenu === "MOTOR SPROCKET" && configuration["DRIVE SYSTEM"] != "Sprocket-chain") {
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
        if(name === "MOTOR SPROCKET" && configuration["DRIVE SYSTEM"] != "Sprocket-chain") {
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
        if(activeMenu === "MOTOR SPROCKET" && configuration["DRIVE SYSTEM"] != "Sprocket-chain") {
            return []
        }
        options[activeMenu].forEach((option) => {
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
                        {menuItem("CHASSIS")}
                        {menuItem("OUTERBODY")}
                        {menuItem("CANOPY")}
                        {menuItem("DRIVE SYSTEM")}
                        {menuItem("MOTOR SPROCKET")}
                        {menuItem("REAR TIRE")}
                        {menuItem("FRONT WHEEL")}
                        {menuItem("BATTERY")}
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
					<div className="text-right"><a href="landing.html"><button className=" px-2 py-2 btn btn-success " >RETURN TO MAIN PAGE</button></a></div>
				</div>
			</div>
		</div>


		<div className="container-fluid E3 py-4 ">
			<div className="d3 p-1 text-center">
				<h3 className="red" >
					EXPLANATION OF SLECTION
				</h3>
				<table className="table">
                    <tbody>
                        <tr>
                            <td>{activeMenu}: {configuration[activeMenu]}</td>
                            <td>Mass=6.5kg, Drag Coefficient = 0.45, Frontal Area= 1.3 m ^2 <br/>
                                <small 
                                    style={{"color": "yellow", "fontWeight": "bold"}}
                                >Driver change delay 30 Sec</small></td>
                        </tr>
                    </tbody>
				</table>
			</div>
		</div>


	</div>
    )
}

export default ConfigureationPage;
