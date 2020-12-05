import React from 'react';

import '../../../css/app.css';


const TestView = (props) => {
    let formattedUsers = [];
    props.users.forEach((item) => {
        formattedUsers.push(
            <h3 key={item.user.username}> {item.user.fullName}:  {item.data.counter} </h3>
        )
    })

    return (
        <div className="container p-2 text-white">
            <div className="row no-gutters justify-content-center mb-2">
                <div className="col-md-3 pt-3">
                    <h1>Local counter</h1>
                    <h3>{props.count}</h3>
                    <h1>Public </h1>
                    {formattedUsers}
                    <button className="btn btn-dark" onClick={props.onToggleRunning} disabled={props.fetching}>
                        {props.running ? 'Stop' : 'Start'} server updates
                    </button>
                </div>
            </div>
            <div className="row no-gutters justify-content-center mb-2">
                <div className="col-md-2 pt-3">
                </div>
            </div>
        </div>
    );
}

export default TestView;
