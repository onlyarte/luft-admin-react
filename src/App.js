import React, { Component } from 'react';
import axios from 'axios';

import './App.css';

import FlightPane from './Components/Flights/Pane';
import ConnectionPane from './Components/Connections/Pane';
import AirportPane from './Components/Airports/Pane';
import PlanePane from './Components/Planes/Pane';
import ReportPane from './Components/Reports/Pane';
import LoginForm from './Components/LoginForm';

class App extends Component {
  constructor(props) {
    super(props);
    this.fetchUser = this.fetchUser.bind(this);
    this.fetchAirports = this.fetchAirports.bind(this);
    this.fetchConnections = this.fetchConnections.bind(this);
    this.fetchFlights = this.fetchFlights.bind(this);
    this.fetchPlanes = this.fetchPlanes.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);

    this.state = {
      airports: [],
      connections: [],
      flights: [],
      planes: [],
      user: null,
      loaded: false,
    };
  }

  componentDidMount() {
    this.fetchUser()
      .then(() => {
        this.setState({ loaded: true });
        this.fetchAirports();
        this.fetchConnections();
        this.fetchFlights();
        this.fetchPlanes();
      })
      .catch((error) => {
        this.setState({ loaded: true });
        console.log(error);
      });
  }

  fetchUser() {
    return axios.get(
      'https://api-luft-kma.herokuapp.com/admin/current',
      { withCredentials: true },
    )
      .then(({ data }) => {
        if (data) {
          this.setState({ user: data });
        } else {
          throw new Error('Не владося підтвердити права доступу!');
        }
      });
  }

  fetchAirports() {
    axios.get('https://api-luft-kma.herokuapp.com/airports')
      .then(({ data }) => {
        this.setState({ airports: data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  fetchConnections() {
    axios.get('https://api-luft-kma.herokuapp.com/connections/')
      .then(({ data }) => {
        this.setState({ connections: data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  fetchFlights() {
    axios.get('https://api-luft-kma.herokuapp.com/flights')
      .then(({ data }) => {
        console.log(data);
        this.setState({ flights: data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  fetchPlanes() {
    axios.get('https://api-luft-kma.herokuapp.com/planes/')
      .then(({ data }) => {
        this.setState({ planes: data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleLogin(user) {
    this.setState({ user });
    this.fetchAirports();
    this.fetchConnections();
    this.fetchFlights();
    this.fetchPlanes();
  }

  handleLogout() {
    axios.delete(
      'https://api-luft-kma.herokuapp.com/admin/logout',
      { withCredentials: true },
    )
      .then(() => {
        this.setState({ user: null });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="App">
        {this.state.user && (
          <React.Fragment>
            <nav className="navbar navbar-expand-sm bg-light navbar-light">
              <a className="navbar-brand" href="#">LUFT</a>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div id="navbar" className="collapse navbar-collapse">
                <ul className="nav navbar-nav mr-auto mt-2 mt-lg-0">
                  <li className="nav-item">
                    <a className="nav-link active" data-toggle="tab" href="#flights" role="tab" aria-controls="flights" aria-selected="true">
                      Рейси
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" data-toggle="tab" href="#connections" role="tab" aria-controls="connections" aria-selected="false">
                      Маршрути
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" data-toggle="tab" href="#airports" role="tab" aria-controls="airports" aria-selected="false">
                      Аеропорти
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" data-toggle="tab" href="#planes" role="tab" aria-controls="planes" aria-selected="false">
                      Літаки
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" data-toggle="tab" href="#reports" role="tab" aria-controls="reports" aria-selected="false">
                      Фінанси
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#logout" onClick={this.handleLogout}>
                      Вийти
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
            <div className="container">
              <div className="row justify-content-around">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                  <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="flights" role="tabpanel">
                      <FlightPane
                        flights={this.state.flights}
                        connections={this.state.connections}
                        planes={this.state.planes}
                        onChange={this.fetchFlights}
                      />
                    </div>
                    <div className="tab-pane fade" id="connections" role="tabpanel">
                      <ConnectionPane
                        connections={this.state.connections}
                        airports={this.state.airports}
                        onChange={this.fetchConnections}
                      />
                    </div>
                    <div className="tab-pane fade" id="airports" role="tabpanel">
                      <AirportPane
                        airports={this.state.airports}
                        onChange={this.fetchAirports}
                      />
                    </div>
                    <div className="tab-pane fade" id="planes" role="tabpanel">
                      <PlanePane
                        planes={this.state.planes}
                        onChange={this.fetchPlanes}
                      />
                    </div>
                    <div className="tab-pane fade" id="reports" role="tabpanel">
                      <ReportPane />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
        {this.state.loaded && !this.state.user && (
          <div className="container">
            <div className="row justify-content-around">
              <div className="col-12 col-sm-12 col-md-6 col-lg-5 login-block">
                <LoginForm onLogin={this.handleLogin} />
              </div>
            </div>
          </div>
        )}
        {!this.state.loaded && (
          <div className="text-center align-middle">
            <h2>Завантажую...</h2>
          </div>
        )}
      </div>
    );
  }
}

export default App;
