import React from 'react';
import './landingstyle.css';
import '../ahmed.css';

const LandingPage = (props) => {

    const carNr = props.user.carNr
    const username = props.user.userName
    let nextButton = <></>
    if (username.includes('user') || username === 'official') {
        nextButton = 
            <button 
                className="px-2 py-2 btn btn-success " 
                onClick={() => props.setPage("configuration")}
                >BEGIN VEHICLE SETUP
            </button>
    }

    return (
        <div className="container-fluid mainContainer col-12 col-lg-8 col-md-11">
            <div className="container-fluid E1">
                <div className="row mx-0 justify-content-center">	
                    <div className="col-2 text-center logo1-div text-left pl-0">
                        <img className=" img-fluid logo" src="/images/logo.jpg"/>
                    </div>
                    <div className="col-8 text-center middle-div text-center px-4 py-1 ">
                        <h3> TEAM PARTICIPATION IN THE VIRTUAL 2020 DCEVGP</h3>
                        <p>Car No. {carNr.substring(carNr.length-2)}</p>
                        <p>{props.user.name}</p>
                    </div>
                    <div className="col-2 text-right logo2-div pr-0">
                        <img className=" img-fluid logo" src="/images/logo_DOEE.png"/>
                    </div>
                </div>
            </div>

            <div className="container-fluid E2 mt-4 ">
                <div className="I1 p-4">
                    <p className="info px-3">
                    {'\u00A0\u00A0\u00A0\u00A0\u00A0'} Welcome to the virtual 2020 DC Electric Vehicle Grand Prix. This is a physics-based simulation platform that enables high school teams to compete head-to-head in an exciting vehicle efficiency and strategy competition. Like the annual DC EV Grand Prix held since 2013, teams must follow the rules and regulations to design then race their cars on a challenging track over a period of one hour. <br/> <br/>
                    {'\u00A0\u00A0\u00A0\u00A0\u00A0'} You will be guided through the four stages of the competition to set up your car design, go through the technical inspection, run a few laps on the track for practice and qualifying, and finally race in two half-hour heats. Just like in the physical race, your objective is to go the maximum number of laps around the track in the allotted time. Team strategy and paying attention to the details of the regulations are essential to winning this competition. 	
                    </p>
                    <div className="text-right">
                        {nextButton}
                    </div>
                </div>

            </div>

            <div className="container-fluid E3 py-4 ">
                <div className="I2 p-4 text-center">
                    <h3>
                        STAGE OF COMPETITION
                    </h3>
                    <table className="table">
                        <tbody>
                            <tr>
                                <td>VEHICLE SETUP</td>
                                <td>TECHNICAL INSPECTION</td>
                                <td>PRACTICE & QUALIFYING</td>
                                <td>RACE </td>
                            </tr>
                        </tbody>
                    </table>	
                </div>
            </div>
        </div>
    )
}

export default LandingPage;
