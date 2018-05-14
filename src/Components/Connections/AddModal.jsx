import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

class AddModal extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      originAirport: '',
      destinationAirport: '',
      departureTime: '',
      arrivalTime: '',
      status: '',
    };
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value, status: 'Зміни не збережено' });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { originAirport, destinationAirport, departureTime, arrivalTime } = this.state;
    axios.post('https://api-luft-kma.herokuapp.com/connections/new', {
      originAirport,
      destinationAirport,
      departureTime,
      arrivalTime,
    }, { withCredentials: true })
      .then(() => {
        this.setState({
          originAirport: '',
          destinationAirport: '',
          departureTime: '',
          arrivalTime: '',
          status: 'Збережено!',
        });
        this.props.onSubmit();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="modal fade" id={this.props.id}>
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h4 className="modal-title">Новий маршрут</h4>
              <button type="button" className="close" data-dismiss="modal">&times;</button>
            </div>

            <div className="modal-body">
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor={`${this.props.id}-originAirport`}>З:</label>
                  <select
                    name="originAirport"
                    value={this.state.originAirport}
                    onChange={this.handleChange}
                    className="form-control"
                    id={`${this.props.id}-originAirport`}
                    required
                  >
                    <option value="" />
                    {this.props.airports.map(airport => (
                      <option value={airport._id} key={airport._id}>{airport.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor={`${this.props.id}-destinationAirport`}>До:</label>
                  <select
                    name="destinationAirport"
                    value={this.state.destinationAirport}
                    onChange={this.handleChange}
                    className="form-control"
                    id={`${this.props.id}-destinationAirport`}
                    required
                  >
                    <option value="" />
                    {this.props.airports.map(airport => (
                      <option value={airport._id} key={airport._id}>{airport.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor={`${this.props.id}-departureTime`}>Відправлення (UTC):</label>
                  <input
                    type="text"
                    name="departureTime"
                    value={this.state.departureTime}
                    onChange={this.handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`${this.props.id}-arrivalTime`}>Прибуття (UTC):</label>
                  <input
                    type="text"
                    name="arrivalTime"
                    value={this.state.arrivalTime}
                    onChange={this.handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <input type="submit" value="Додати" className="btn btn-dark" />
                </div>

                <div className="text-danger">{this.state.status}</div>
              </form>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline-danger" data-dismiss="modal">Закрити</button>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

AddModal.propTypes = {
  airports: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
  })).isRequired,
  id: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AddModal;
