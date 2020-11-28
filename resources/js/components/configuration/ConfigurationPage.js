import React from 'react';
import '../ahmed.css';
import './configuration.css';

const ConfigureationPage = (props) => {

    return (
        <div className="container-fluid mainContainer col-12 col-lg-8 col-md-11">

		<div className="container-fluid E1">
			<div className="row mx-0 ">	
				<div className="col-2 logo1-div text-left pl-0">
					<img className=" img-fluid logo" src="/images/logo.jpg"/>
				</div>
				<div className="col-8 middle-div text-center px-4 py-1 ">
					<h3> VEHICLE CONFIGURATION SETUP</h3>
					<p > Car No. 185</p>
					<p > Your Team Name Goes Here</p>
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

						<li className="mb-3">
							<ul className="px-0 item-list">
								<li className="part active">
								<a className="" href="">CHASSIS</a>	
								</li>

								<li className="option">
								Almunium Option B	
								</li>
							</ul>
						</li>

						<li className="mb-3">
							<ul className=" px-0 item-list">
								<li className="part ">
								<a className="active" href="">OUTERBODY</a>	
								</li>

								<li className="option">
								Baseline	
								</li>
							</ul>
						</li>


						<li className="mb-3">
							<ul className=" px-0 item-list">
								<li className="part ">
								<a href="">CANOPY</a>	
								</li>

								<li className="option">
								Option1	
								</li>
							</ul>
						</li>


						<li className="mb-3">
							<ul className=" px-0 item-list">
								<li className="part ">
								<a href="">DRIVE SYSTEM</a>	
								</li>

								<li className="option">
								Option 2	
								</li>
							</ul>
						</li>


						<li className="mb-3">
							<ul className="px-0 item-list">
								<li className="part ">
								<a href="">MOTOR SPROCKET</a>	
								</li>

								<li className="option">Option 3</li>
							</ul>
						</li>


						<li className="mb-3"> 
							<ul className=" px-0 item-list">
								<li className="part">
								<a href="">REAR TIRE</a>	
								</li>

								<li className="option">Option 4</li>
							</ul>
						</li>

						<li className="mb-3">
							<ul className=" px-0 item-list">
								<li className="part">
								<a href="">FRONT WHEELS</a>	
								</li>

								<li className="option">Option 5</li>
							</ul>
						</li>

						<li className="mb-3">
							<ul className=" px-0 item-list">
								<li className="part">
								<a href="">BATTERY BACK</a>	
								</li>

								<li className="option">Option 6</li>
							</ul>
						</li>

					</ul>
				</div>

				<div className="col-10 d2 p-4 ">
					<table className="table">
                        <tbody>
                            <tr>
                                <th>
                                    OUTERBODY OPTIONS:
                                </th>
                                <td className="active">
                                Baseline Shell	
                                </td>
                                <td>
                                Smaller Shell
                                </td>
                            </tr>
                        </tbody>
					</table>
					<div className="image-div my-auto text-center ">
						<img className="  img-fluid" src="/images/Outerbody-Baseline.png"/>
					</div>
					<div className="text-right"><a href="landing.html"><button className=" px-2 py-2 btn btn-success " >RETURN TO MAIN PAGE</button></a></div>
				</div>
			</div>
		</div>


		<div className="container-fluid E3 py-4 ">
			<div className="d3 p-4 text-center">
				<h3 className="red" >
					EXPLANATION OF SLECTION
				</h3>
				<table className="table">
                    <tbody>
                        <tr>
                            <td>OUTERBODY: Smaller Shell</td>
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
