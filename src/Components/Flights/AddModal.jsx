import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

class AddModal extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      connection: '',
      plane: '',
      date: '',
      status: '',
    };
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value, status: 'Зміни не збережено' });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { connection, plane, date } = this.state;
    axios.post('http://localhost:3000/flights/new', {
      connection,
      plane,
      date,
    })
      .then(() => {
        this.setState({
          connection: '',
          plane: '',
          date: '',
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
              <h4 className="modal-title">Новий рейс</h4>
              <button type="button" className="close" data-dismiss="modal">&times;</button>
            </div>

            <div className="modal-body">
              <div className="text text-danger">
                Обережно, пізніше не можна змінити вказані дані,
                оскільки після збереження квитки на рейс стануть доступними для бронювання.
              </div>
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor={`${this.props.id}-connection`}>Маршрут:</label>
                  <select
                    name="connection"
                    value={this.state.connection}
                    onChange={this.handleChange}
                    className="form-control"
                    id={`${this.props.id}-connection`}
                    required
                  >
                    <option value="" />
                    {this.props.connections.map(connection => (
                      <option value={connection._id} key={connection._id}>
                        {`${connection.originAirport.name} - ${connection.destinationAirport.name} (${connection.departureTime})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor={`${this.props.id}-plane`}>Літак:</label>
                  <select
                    name="plane"
                    value={this.state.plane}
                    onChange={this.handleChange}
                    className="form-control"
                    id={`${this.props.id}-plane`}
                    required
                  >
                    <option value="" />
                    {this.props.planes.map(plane => (
                      <option value={plane._id} key={plane._id}>{plane.tailNum}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor={`${this.props.id}-date`}>Дата (2018-05-27):</label>
                  <input
                    type="text"
                    name="date"
                    value={this.state.date}
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
  connections: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    originAirport: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
    destinationAirport: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
    departureTime: PropTypes.string.isRequired,
    arrivalTime: PropTypes.string.isRequired,
  })).isRequired,

  planes: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    tailNum: PropTypes.string.isRequired,
  })).isRequired,

  id: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AddModal;
