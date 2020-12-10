import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import '../../../css/app.css';

const handleSubmitChoice = (event, endpoint, state) => {
    fetch('/api/' + endpoint, {
        method: "POST",
        body: JSON.stringify(state),
        headers: {"Content-type": "application/json; charset=UTF-8"} })
            .then(response => response.text())
            .then(reply => console.log("Server replied:", reply));

    event.preventDefault();
}

const choiceForm = (adminRight, reactButtonState, current) => {
    const [buttonState, setButtonState] = reactButtonState
    const options = adminRight.options
    const endpoint = adminRight.endpoint
    const label = adminRight.label
    const formattedOptions = options.map(optionText => 
            <option key={optionText} value={optionText}>{optionText}</option>
    )
    let currentState = "Not applicable"
    if(current[endpoint]) currentState = current[endpoint]

    return (
        <>
        <form className="form-inline" onSubmit={(event) => handleSubmitChoice(event, endpoint, buttonState)}>
            <div className="input-group mb-2 mr-sm-2">
                <div className="input-group-prepend">
                    <label className="input-group-text" htmlFor="selectTrack">{label}</label>
                </div>
                <select className="custom-select mr-sm-2" 
                        value={buttonState} 
                        onChange={(event) => setButtonState(event.target.value)} 
                        id="selectTrack">
                    {formattedOptions}
                </select>
            </div> 
            <button type="submit" className="btn btn-primary mb-2">Submit</button>
        </form>
            Current value: {currentState}
            <br/><br/>
        </>
    )
}

const track = {
    options: ["Practice", "Official"],
    endpoint: 'track',
    label: 'Track'
}

const breakDowns = {
    options: ["Disabled", "Enabled"],
    endpoint: 'breakdowns',
    label: 'Breakdowns'
}

const page = {
    options: ["landing", "configuration", "race"],
    endpoint: 'forcepage',
    label: 'Force page'
}

const reset = {
    options: ["Total laps", "Position", "Lineup"],
    endpoint: 'reset',
    label: 'Reset' 
}

const mode = {
    options: ["Practice", "Break 0", "Qualification", "Break 1", "Heat 1", "Break 2", "Heat 2"],
    endpoint: 'mode',
    label: 'Mode'
}

const topFlag = {
    options: ["Green", 'Yellow'],
    endpoint: 'topflag',
    label: 'Top flag'
}

const centerFlag = {
    options: ['Gone', 'Blue', 'White'],
    endpoint: 'centerflag',
    label: 'Center flag'
}

const sort = {
    options: ['Total laps', 'Fastest lap'],
    endpoint: 'sort',
    label: 'Highscore sort'
}

const AdminView = (props) => {
    const [car, setCar] = useState("1001")
    const [reason, setReason] = useState("")
    const [penaltyValue, setSetPenaltyValue] = useState(5)
    const [penaltyType, setPenaltyType] = useState("SEC")
    const [admin, setAdmin] = useState(props.admin)

    const initialButtonState = (adminRight) => {
        if(admin[adminRight.endpoint]) {
            return admin[adminRight.endpoint]
        } else{
            return adminRight.options[0]
        }
    }

    const trackButton = useState(initialButtonState(track))
    const breakdownsButton = useState(initialButtonState(breakDowns))
    const pageButton = useState(initialButtonState(page))
    const resetButton = useState(initialButtonState(reset))
    const modeButton= useState(initialButtonState(mode))
    const topFlagButton = useState(initialButtonState(topFlag))
    const centerFlagButton = useState(initialButtonState(centerFlag))
    const sortButton = useState(initialButtonState(sort))

    const initialize = () => {
        window.Echo.channel('adminState')
            .listen('AdminUpdated', (e) => {
                setAdmin(old => ({...old, ...e.adminState}))
            })
    }

    useEffect(initialize, [])

    const handleSubmitPenalty = (event) => {
        let data =  {
            "car_nr": car, 
            "reason": reason, 
            "penalty_value": penaltyValue, 
            "penalty_type": penaltyType
       } 

        fetch('/api/penalty', {
            method: "POST",
            body: JSON.stringify(data),
            headers: {"Content-type": "application/json; charset=UTF-8"} })

        event.preventDefault();
    }

    const carSelectField = (
        <div className="input-group mb-3">
            <div className="input-group-prepend">
                <label className="input-group-text" htmlFor="inputGroupSelect01">Car</label>
            </div>
            <select className="custom-select" 
                    value={car} 
                    onChange={(event) => setCar(event.target.value)} 
                    id="inputGroupSelect01">
                <option value="1001">1001</option>
                <option value="1002">1002</option>
                <option value="1003">1003</option>
            </select>
        </div> 
    )

    const reasonField = (
        <div className="input-group mb-3">
            <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon3">Reason</span>
            </div>
            <input type="text" className="form-control" id="basic-url" value={reason} onChange={(event) => setReason(event.target.value)} aria-describedby="basic-addon3"/>
        </div>
    )

    const penaltyField = (
        <div className="input-group">
            <div className="input-group-prepend">
                <span className="input-group-text" id="">Penalty</span>
            </div>
            <input type="number" value={penaltyValue} onChange={(event) => setSetPenaltyValue(event.target.value)} className="form-control"/>

            <select className="custom-select" 
                    value={penaltyType} 
                    onChange={(event) => setPenaltyType(event.target.value)} 
                    id="inputGroupSelect01">
                <option value="SEC">Seconds</option>
                <option value="LAP">Lap(s)</option>
            </select>
        </div>
    )

    const penaltyForm = 
    <>
        <h1>Penalize</h1>
        <form onSubmit={handleSubmitPenalty}>
            {carSelectField}
            {reasonField}
            {penaltyField}
            <input className="btn btn-primary mb-2 mt-3"type="submit" value="Submit" />
            <br/><br/><br/>
        </form>
    </>


    return (
        <div className="container p-2 text-light">
            <div className="row no-gutters justify-content-center mb-2">
                <div className="col-md-4">
                    {/* {penaltyForm} */}
                    {choiceForm(track, trackButton, admin)}
                    {choiceForm(breakDowns, breakdownsButton, admin)}
                    {choiceForm(page, pageButton, admin)}
                    {choiceForm(reset, resetButton, admin)}
                    {choiceForm(mode, modeButton, admin)}
                    {choiceForm(topFlag, topFlagButton, admin)}
                    {choiceForm(centerFlag, centerFlagButton, admin)}
                    {choiceForm(sort, sortButton, admin)}
                </div>
            </div>
        </div>
    )
}

export default AdminView;

let view =  document.getElementById('admin_container')

if (view) {
    let json_admin = view.getAttribute('admin')
    let admin = JSON.parse(json_admin)
    ReactDOM.render(<AdminView admin={admin}/>, view);
}
