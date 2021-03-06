import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

class UpdateModal extends Component {
  static getDerivedStateFromProps(nextProps) {
    return {
      departureTime: nextProps.connection.departureTime,
      arrivalTime: nextProps.connection.arrivalTime,
      distance: nextProps.connection.distance,
    };
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);

    this.closeButton = React.createRef();

    this.state = {
      departureTime: this.props.connection.departureTime,
      arrivalTime: this.props.connection.arrivalTime,
      status: '',
    };
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value, status: 'Зміни не збережено' });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { departureTime, arrivalTime } = this.state;
    const { _id } = this.props.connection;
    axios.post(`https://api-luft-kma.herokuapp.com/connections/${_id}/update`, {
      departureTime,
      arrivalTime,
    }, { withCredentials: true })
      .then(() => {
        this.setState({
          status: 'Збережено!',
        });
        this.props.onSubmit();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleRemove() {
    const { _id } = this.props.connection;
    axios.delete(
      `https://api-luft-kma.herokuapp.com/connections/${_id}/remove`,
      { withCredentials: true },
    )
      .then(() => {
        this.closeButton.current.click();
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
              <h4 className="modal-title">Оновити маршрут</h4>
              <button type="button" className="close" data-dismiss="modal">&times;</button>
            </div>

            <div className="modal-body">
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor={`${this.props.id}-originAirport`}>З:</label>
                  <input
                    type="text"
                    name="originAirport"
                    value={this.props.connection.originAirport.name}
                    className="form-control"
                    id={`${this.props.id}-originAirport`}
                    required
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`${this.props.id}-destinationAirport`}>До:</label>
                  <input
                    type="text"
                    name="destinationAirport"
                    value={this.props.connection.destinationAirport.name}
                    className="form-control"
                    id={`${this.props.id}-destinationAirport`}
                    required
                    readOnly
                  />
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
                  <div className="btn-group">
                    <input type="submit" value="Оновити" className="btn btn-outline-success" />
                    <button type="button" onClick={this.handleRemove} className="btn btn-outline-danger">Видалити</button>
                  </div>
                </div>

                <div className="text-danger">{this.state.status}</div>
              </form>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline-danger" data-dismiss="modal" ref={this.closeButton}>Закрити</button>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

UpdateModal.propTypes = {
  id: PropTypes.string.isRequired,
  connection: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    originAirport: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    destinationAirport: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    departureTime: PropTypes.string.isRequired,
    arrivalTime: PropTypes.string.isRequired,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default UpdateModal;
