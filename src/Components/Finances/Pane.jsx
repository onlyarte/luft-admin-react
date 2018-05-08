import React, { Component } from 'react';
import axios from 'axios';

import TicketsTable from './TicketsTable';

class FinancesPane extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handlePeriodReport = this.handlePeriodReport.bind(this);
    this.handleFlightReport = this.handleFlightReport.bind(this);

    this.state = {
      tickets: [],
      periodFrom: '',
      periodTo: '',
      flight: '',
    };
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handlePeriodReport(event) {
    event.preventDefault();

    axios.get(`http://localhost:3000/tickets/period/${this.state.periodFrom}/${this.state.periodTo}`)
      .then(({ data }) => {
        this.setState({ tickets: data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleFlightReport(event) {
    event.preventDefault();

    axios.get(`http://localhost:3000/tickets/flight/${this.state.flight}`)
      .then(({ data }) => {
        this.setState({ tickets: data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <React.Fragment>
        <h1>Фінанси</h1>
        <div className="row">
          <div className="col-12 col-md-4">
            <h3>Звіт за період:</h3>
            <form onSubmit={this.handlePeriodReport}>
              <div className="form-group">
                <label htmlFor="periodFrom">З:</label>
                <input
                  type="text"
                  name="periodFrom"
                  value={this.state.periodFrom}
                  onChange={this.handleChange}
                  className="form-control"
                  placeholder="05-01-2018"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="periodTo">До:</label>
                <input
                  type="text"
                  name="periodTo"
                  value={this.state.periodTo}
                  onChange={this.handleChange}
                  className="form-control"
                  placeholder="05-30-2018"
                  required
                />
              </div>

              <div className="form-group">
                <input type="submit" className="btn btn-outline-succes" value="Сформувати" />
              </div>
            </form>
          </div>

          <div className="col-12 col-md-4">
            <h3>Звіт за рейсом:</h3>
            <form onSubmit={this.handleFlightReport}>
              <div className="form-group">
                <label htmlFor="flight">Рейс (ID):</label>
                <input
                  type="text"
                  name="flight"
                  value={this.state.flight}
                  onChange={this.handleChange}
                  className="form-control"
                  placeholder="5ae877a23cfbbb2d047ce3e3"
                  required
                />
              </div>

              <div className="form-group">
                <input type="submit" className="btn btn-outline-succes" value="Сформувати" />
              </div>
            </form>
          </div>
        </div>
        <TicketsTable tickets={this.state.tickets} />
      </React.Fragment>
    );
  }
}

export default FinancesPane;
