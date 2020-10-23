import React from 'react';
import ReactDOM from 'react-dom';
import Flags from "./Flags"
import Scoreboard from "./Scoreboard"
import AnimatedPath from "./AnimatedPath"
import '../../../css/app.css';
import PenaltiesDelays from './PenaltiesDelays';

const PublicView = (props) => {
    return (
        <div className="container p-2">
            <div className="row no-gutters justify-content-center mb-2">
                <div className="col-md-2">
                    <img src="/images/logo.jpg" className="img-fluid p-1" alt="Responsive image"/>
                    <Flags/>
                </div>
                <div className="col-md-10">
                    <Scoreboard/>
                </div>
            </div>
            <div className="row no-gutters justify-content-center">
                <div className="col-md-2">
                    <PenaltiesDelays/>
                </div>
                <div className="col-md-10 border border-light d-flex justify-content-center align-items-center">
                    <AnimatedPath/>
                </div> 
            </div>
        </div>
    );
}

export default PublicView;

let view =  document.getElementById('view_container')

if (view) {
    let json_data = view.getAttribute('data')
    let data = JSON.parse(json_data)
    ReactDOM.render(<PublicView team={data}/>, view);
}

