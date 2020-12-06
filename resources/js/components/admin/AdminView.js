import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import '../../../css/app.css';

const handleSubmitChoice = (event, endpoint, state) => {
    let data =  {
        [endpoint]: state
    } 

    fetch('/api/' + endpoint, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {"Content-type": "application/json; charset=UTF-8"} })
            .then(response => response.text())
            .then(reply => console.log("Server replied:", reply));

    event.preventDefault();
}

const choiceForm = (label, endpoint, state, setState, options) => { 
    const formattedOptions = options.map(optionText => 
            <option key={optionText} value={optionText}>{optionText}</option>
    )

    return (
        <form className="form-inline" onSubmit={(event) => handleSubmitChoice(event, endpoint, state)}>
            <div className="input-group mb-2 mr-sm-2">
                <div className="input-group-prepend">
                    <label className="input-group-text" htmlFor="selectTrack">{label}</label>
                </div>
                <select className="custom-select mr-sm-2" 
                        value={state} 
                        onChange={(event) => setState(event.target.value)} 
                        id="selectTrack">
                    {formattedOptions}
                </select>
            </div> 
            <button type="submit" className="btn btn-primary mb-2">Submit</button>
        </form>
    )
}

const AdminView = (props) => {
    const [car, setCar] = useState("1001")
    const [reason, setReason] = useState("")
    const [penaltyValue, setSetPenaltyValue] = useState(5)
    const [penaltyType, setPenaltyType] = useState("SEC")

    const [track, setTrack] = useState("Practice")
    const [breakdownsEnabled, setBreakdownsEnabled] = useState("Disabled")
    const [defaultPage, setDefaultPage] = useState("landing")

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
                    {choiceForm("Track", "track", track, setTrack, ["Practice", "Official"])}
                    {choiceForm("Breakdowns", "breakdowns", breakdownsEnabled, setBreakdownsEnabled, ["Disabled", "Enabled"])}
                    {choiceForm("Force page", "forcepage", defaultPage, setDefaultPage, ["landing", "configuration", "race"])}
                </div>
            </div>
        </div>
    );
}

export default AdminView;

let view =  document.getElementById('admin_container')

if (view) {
    let json_data = view.getAttribute('data')
    let data = JSON.parse(json_data)
    ReactDOM.render(<AdminView/>, view);
}
