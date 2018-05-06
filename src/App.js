import React, { Component } from 'react';
import axios from 'axios';

import './App.css';

import FlightPane from './Components/Flights/Pane';
import ConnectionPane from './Components/Connections/Pane';
import AirportPane from './Components/Airports/Pane';
import PlanePane from './Components/Planes/Pane';

class App extends Component {
  constructor(props) {
    super(props);
    this.loadAirports = this.loadAirports.bind(this);
    this.loadConnections = this.loadConnections.bind(this);
    this.loadFlights = this.loadFlights.bind(this);
    this.loadPlanes = this.loadPlanes.bind(this);

    this.state = {
      airports: [],
      connections: [],
      flights: [],
      planes: [],
    };
  }

  componentDidMount() {
    this.loadAirports();
    this.loadConnections();
    this.loadFlights();
    this.loadPlanes();
  }

  loadAirports() {
    axios.get('https://api-luft-kma.herokuapp.com/airports')
      .then(({ data }) => {
        this.setState({ airports: data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  loadConnections() {
    axios.get('https://api-luft-kma.herokuapp.com/connections/')
      .then(({ data }) => {
        this.setState({ connections: data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  loadFlights() {
    axios.get('https://api-luft-kma.herokuapp.com/flights')
      .then(({ data }) => {
        this.setState({ flights: data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  loadPlanes() {
    axios.get('https://api-luft-kma.herokuapp.com/planes/')
      .then(({ data }) => {
        this.setState({ planes: data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar navbar-expand-sm bg-light navbar-light">
          <a className="navbar-brand" href="#">LUFT</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div id="navbar" className="collapse navbar-collapse">
            <ul className="nav navbar-nav mr-auto mt-2 mt-lg-0">
              <li className="nav-item">
                <a className="nav-link active" data-toggle="tab" href="#flights" role="tab" aria-controls="flights" aria-selected="true">Рейси</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-toggle="tab" href="#connections" role="tab" aria-controls="connections" aria-selected="false">Маршрути</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-toggle="tab" href="#airports" role="tab" aria-controls="airports" aria-selected="false">Аеропорти</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-toggle="tab" href="#planes" role="tab" aria-controls="planes" aria-selected="false">Літаки</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-toggle="tab" href="#reports" role="tab" aria-controls="reports" aria-selected="false">Фінанси</a>
              </li>
            </ul>
          </div>
        </nav>
        <div className="container">
          <div className="row justify-content-around">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12">
              <div className="tab-content" id="nav-tabContent">
                <div className="tab-pane fade show active" id="flights" role="tabpanel">
                  <FlightPane flights={this.state.flights} connections={this.state.connections} planes={this.state.planes} onChange={this.loadFlights} />
                </div>
                <div className="tab-pane fade" id="connections" role="tabpanel">
                  <ConnectionPane connections={this.state.connections} airports={this.state.airports} onChange={this.loadConnections} />
                </div>
                <div className="tab-pane fade" id="airports" role="tabpanel">
                  <AirportPane airports={this.state.airports} onChange={this.loadAirports} />
                </div>
                <div className="tab-pane fade" id="planes" role="tabpanel">
                  <PlanePane planes={this.state.planes} onChange={this.loadPlanes} />
                </div>
                <div className="tab-pane fade" id="reports" role="tabpanel">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
