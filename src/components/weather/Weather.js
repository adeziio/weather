import React, { Component } from 'react';
import { Input, Grid, Image, Button } from 'semantic-ui-react';
import './weather.css'

export default class Weather extends Component {
    constructor(props) {
        super(props);
        this.state = {
            delayCounter: 0,
            expandHours: false,
            data: {}
        }
    }

    componentDidMount() {
        document.title = "Utility - Weather"
    }

    fetchData = (search) => {
        if (this.state.delayCounter === 1) {
            fetch("https://weatherapi-com.p.rapidapi.com/forecast.json?q=" + search + "&days=7", {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
                    "x-rapidapi-key": process.env.REACT_APP_RAPID_API_KEY
                }
            })
                .then(response => response.json())
                .then(resData => this.setState({ data: resData }))
        }
        this.setState({
            delayCounter: this.state.delayCounter - 1
        })
    }

    handleInput = (e) => {
        this.setState({
            delayCounter: this.state.delayCounter + 1
        }, () => {
            setTimeout(() => {
                this.fetchData(e.target.value);
            }, 1200)
        })
    }

    toggleExpandHours = () => {
        this.setState((prevState) => ({
            expandHours: !prevState.expandHours
        }))
    }

    convertToStandardTime = (time) => {
        let convertedTime = "";
        if (Number(time) < 12 && Number(time) > 0) {
            convertedTime = time + ":00 AM";
        }
        else if (Number(time) === 0) {
            convertedTime = "12:00 AM";
        }
        else if (Number(time) === 12) {
            convertedTime = "12:00 PM";
        }
        else {
            convertedTime = (time - 12) + ":00 PM";
        }
        return convertedTime;
    }

    formatDate = (date) => {
        const d = new Date(date);
        const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
        const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
        const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
        return this.dayNumberToString(d.getDay()) + ` ${mo}-${da}-${ye}`;
    }

    dayNumberToString = (d) => {
        let day = ""
        switch (d) {
            case 0:
                day = "Sunday";
                break;
            case 1:
                day = "Monday";
                break;
            case 2:
                day = "Tuesday";
                break;
            case 3:
                day = "Wednesday";
                break;
            case 4:
                day = "Thursday";
                break;
            case 5:
                day = "Friday";
                break;
            case 6:
                day = "Saturday";
                break;
            default:
                day = "";
        }
        return day;
    }

    render() {
        const { data, expandHours } = this.state;
        console.log(data)
        return (
            <div>
                <Input placeholder='Search City or Zip Code' onChange={this.handleInput} />
                {data ?
                    <Grid relaxed centered stackable>
                        {data.current ?
                            <>
                                <Grid.Row columns={5} >
                                    <Grid.Column >
                                        <div className="condition">
                                            <Image src={data.current.condition.icon} centered />
                                            <div className="info-text">{data.current.condition.text}</div>
                                            <div className="temp-f">{`${data.current.temp_f}°F`}</div>
                                            <div className="temp-c">{`${data.current.temp_c}°c`}</div>
                                        </div>
                                    </Grid.Column>
                                    <Grid.Column >
                                        <div className="location">
                                            <div className="location-name">{`${data.location.name},`}</div>
                                            <div className="location-name">{`${data.location.region}`}</div>
                                            <div className="location-name">{`${data.location.country}`}</div>
                                            <div className="location-time">{` Last updated: 
                                                ${this.formatDate(data.current.last_updated.split(' ')[0])} 
                                                ${this.convertToStandardTime(data.current.last_updated.split(' ')[1].split(':')[0])} 
                                                ${data.location.tz_id}`}
                                            </div>
                                            <div className="info">
                                                <div><span className="bold">{`Humidity: `}</span>{`${data.current.humidity}%`}</div>
                                                <div><span className="bold">{`Wind: `}</span>{`${data.current.wind_dir} ${data.current.wind_mph} mph`}</div>
                                            </div>

                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                                <Button primary onClick={this.toggleExpandHours} className="info">{!expandHours ? "Expand Today's Hours" : "Hide Today's Hours"}</Button>
                                {expandHours ? (
                                    <>
                                        <Grid.Row columns={12} >
                                            {data.forecast.forecastday[0].hour ?
                                                data.forecast.forecastday[0].hour.filter((item, index) => index < 12).map((forecastday, index) => (
                                                    <Grid.Column key={index}>
                                                        <div className={"condition"}>
                                                            <div className="info">{`${forecastday.time.split(' ')[0]}`}</div>
                                                            <div className="info bold">{`${this.convertToStandardTime(forecastday.time.split(' ')[1].split(':')[0])}`}</div>
                                                            <Image src={forecastday.condition.icon} centered size="mini" />
                                                            <div className="info-text">{forecastday.condition.text}</div>
                                                            <div className="temp-f">{`${forecastday.temp_f}°F`}</div>
                                                            <div className="temp-c">{`${forecastday.temp_c}°c`}</div>
                                                        </div>
                                                    </Grid.Column>
                                                )) : null}
                                        </Grid.Row>
                                        <Grid.Row columns={12} >
                                            {data.forecast.forecastday[0].hour ?
                                                data.forecast.forecastday[0].hour.filter((item, index) => index >= 12).map((forecastday, index) => (
                                                    <Grid.Column key={index}>
                                                        <div className={"condition"}>
                                                            <div className="info">{`${forecastday.time.split(' ')[0]}`}</div>
                                                            <div className="info bold">{`${this.convertToStandardTime(forecastday.time.split(' ')[1].split(':')[0])}`}</div>
                                                            <Image src={forecastday.condition.icon} centered size="mini" />
                                                            <div className="info-text">{forecastday.condition.text}</div>
                                                            <div className="temp-f">{`${forecastday.temp_f}°F`}</div>
                                                            <div className="temp-c">{`${forecastday.temp_c}°c`}</div>
                                                        </div>
                                                    </Grid.Column>
                                                )) : null}
                                        </Grid.Row>
                                    </>) : null
                                }
                                <Grid.Row columns={1} >
                                    <Grid relaxed centered>
                                        <Grid.Row columns={3} divided>
                                            {data.forecast.forecastday ?
                                                data.forecast.forecastday.map((forecastday, index) => (
                                                    <Grid.Column key={index}>
                                                        <div className="condition border-top">
                                                            <div className="info bold">{`${this.formatDate(forecastday.date)}`}</div>
                                                            <Image src={forecastday.day.condition.icon} centered />
                                                            <div>{forecastday.day.condition.text}</div>
                                                            <div className="temp-f">{`${forecastday.day.avgtemp_f}°F`}</div>
                                                            <div className="temp-c">{`${forecastday.day.avgtemp_c}°c`}</div>
                                                        </div>
                                                    </Grid.Column>
                                                )) : null}
                                        </Grid.Row>
                                    </Grid>
                                </Grid.Row>
                            </> : null
                        }



                    </Grid> : null
                }


            </div>
        )
    }
}
