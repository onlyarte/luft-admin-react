import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

class UpdateModal extends Component {
  static getDerivedStateFromProps(nextProps) {
    return {
      coefficient: nextProps.flight.coefficient,
    };
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.closeButton = React.createRef();

    this.state = {
      coefficient: this.props.flight.coefficient,
      status: '',
    };
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value, status: 'Зміни не збережено' });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { coefficient } = this.state;
    const { _id } = this.props.flight;

    axios.post(`https://api-luft-kma.herokuapp.com/flights/${_id}/update`, {
      coefficient,
    })
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

  render() {
    return (
      <div className="modal fade" id={this.props.id}>
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h4 className="modal-title">Оновити рейс</h4>
              <button type="button" className="close" data-dismiss="modal">&times;</button>
            </div>

            <div className="modal-body">
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor={`${this.props.id}-connection`}>Маршрут:</label>
                  <input
                    type="text"
                    name="connection"
                    value={
                      `${this.props.flight.connection.originAirport} — ${this.props.flight.connection.destinationAirport}`
                    }
                    className="form-control"
                    required
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`${this.props.id}-plane`}>Літак:</label>
                  <input
                    type="text"
                    name="plane"
                    value={this.props.flight.plane.tailNum}
                    className="form-control"
                    required
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`${this.props.id}-date`}>Дата:</label>
                  <input
                    type="text"
                    name="date"
                    value={this.props.flight.date}
                    className="form-control"
                    required
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`${this.props.id}-price`}>Базова ціна:</label>
                  <input
                    type="text"
                    name="price"
                    value={this.props.flight.price}
                    className="form-control"
                    required
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`${this.props.id}-coeff`}>Коефіцієнт ціни:</label>
                  <input
                    type="text"
                    name="coefficient"
                    value={this.state.coefficient}
                    onChange={this.handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <div className="btn-group">
                    <input type="submit" value="Оновити" className="btn btn-outline-success" />
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
  flight: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    coefficient: PropTypes.number.isRequired,
    connection: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      originAirport: PropTypes.string.isRequired,
      destinationAirport: PropTypes.string.isRequired,
      departureTime: PropTypes.string.isRequired,
      arrivalTime: PropTypes.string.isRequired,
    }).isRequired,
    plane: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      tailNum: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default UpdateModal;
