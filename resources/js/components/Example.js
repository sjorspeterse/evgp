import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';

const Example = () => {
    const [users, setUsers] = useState(0)

    const subscribe = () => {
        console.log("Subscribing!")
        window.Echo.join('common_room')
            .here((users) => {
                console.log("Joined also in React!")
                setUsers(users.length)
            })
            .joining((user) => {
                console.log("Online users in React: ", users)
                setUsers(users => users+ 1)
            })
            .leaving((user) => {
                console.log("Online users in React: ", users)
                setUsers(users => users - 1)
            });
    }

    useEffect(subscribe, [])

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">Example Component</div>

                        <div className="card-body">
                            I'm an example component! Nr of users = {users}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

if (document.getElementById('example')) {
    ReactDOM.render(<Example />, document.getElementById('example'));
}
