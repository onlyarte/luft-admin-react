import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

class UpdateModal extends Component {
  static getDerivedStateFromProps(nextProps) {
    return { name: nextProps.airport.name };
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);

    this.closeButton = React.createRef();

    this.state = {
      name: this.props.airport.name,
      status: '',
    };
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value, status: 'Зміни не збережено' });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { name } = this.state;
    axios.post(`http://localhost:3000/airports/${this.props.airport._id}/update`, {
      name,
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

  handleRemove() {
    axios.delete(`http://localhost:3000/airports/${this.props.airport._id}/remove`)
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
              <h4 className="modal-title">Оновити аеропорт</h4>
              <button type="button" className="close" data-dismiss="modal">&times;</button>
            </div>

            <div className="modal-body">
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor={`${this.props.id}-code`}>Код IATA:</label>
                  <input
                    type="text"
                    name="code"
                    value={this.props.airport.code}
                    className="form-control"
                    required
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`${this.props.id}-name`}>Назва:</label>
                  <input
                    type="text"
                    name="name"
                    value={this.state.name}
                    onChange={this.handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`${this.props.id}-city`}>Місто:</label>
                  <input
                    type="text"
                    name="city"
                    value={this.props.airport.city}
                    className="form-control"
                    required
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`${this.props.id}-country`}>Країна:</label>
                  <input
                    type="text"
                    name="country"
                    value={this.props.airport.country}
                    className="form-control"
                    required
                    readOnly
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
  airport: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default UpdateModal;
