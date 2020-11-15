import React from 'react';
import ReactDOM from 'react-dom';

const LandingPage = (props) => {

    return (
        <div> </div>
    );
}

export default LandingPage;

let view =  document.getElementById('landing_container')

if (view) {
    let json_user= view.getAttribute('user')
    let user = JSON.parse(json_user)
    ReactDOM.render(<LandingPage user={user}/>, view);
}
