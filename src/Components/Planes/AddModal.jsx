import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import Scheme from './Scheme';

class AddModal extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleRowsChange = this.handleRowsChange.bind(this);
    this.handleColsChange = this.handleColsChange.bind(this);
    this.handleSeatPick = this.handleSeatPick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      tailNum: '',
      rows: 0,
      cols: 0,
      seats: 0,
      scheme: [],
      status: '',
    };
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value, status: 'Зміни не збережено' });
  }

  handleRowsChange(event) {
    const { rows, cols, scheme } = this.state;
    let newScheme = [...scheme];
    const newRows = parseInt(event.target.value, 10) || 0;

    if (newRows === rows) return;
    if (newRows < rows) {
      newScheme = newScheme.slice(0, newRows);
    } else {
      for (let i = 0; i < newRows - rows; i += 1) {
        const newRow = [];
        for (let j = 0; j < cols; j += 1) {
          newRow.push({ empty: true });
        }
        newScheme.push(newRow);
      }
    }

    this.setState({ rows: newRows, scheme: newScheme });
  }

  handleColsChange(event) {
    const { rows, cols, scheme } = this.state;
    const newScheme = [...scheme];
    const newCols = parseInt(event.target.value, 10) || 0;

    if (newCols === cols) return;
    if (newCols < cols) {
      for (let i = 0; i < rows; i += 1) {
        newScheme[i] = newScheme[i].slice(0, newCols);
      }
    } else {
      for (let i = 0; i < rows; i += 1) {
        for (let j = 0; j < newCols - cols; j += 1) {
          newScheme[i].push({ empty: true });
        }
      }
    }

    this.setState({ cols: newCols, scheme: newScheme });
  }

  handleSeatPick(i, j) {
    const { seats, scheme } = this.state;
    let newScheme = [...scheme];
    const current = newScheme[i][j];
    if (current.empty) {
      newScheme[i][j] = { seatNum: seats + 1 };
      delete newScheme[i][j].empty;
      this.setState({ seats: seats + 1, scheme: newScheme });
    } else {
      newScheme[i][j] = { empty: true };
      newScheme = newScheme.map(row => row.map(cell => (
        !cell.empty && cell.seatNum > current.seatNum
          ? { seatNum: cell.seatNum - 1 }
          : cell)));
      this.setState({ seats: seats - 1, scheme: newScheme });
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    const { tailNum, seats, scheme } = this.state;
    axios.post('http://localhost:3000/planes/new', {
      tailNum,
      seats,
      scheme,
    })
      .then(() => {
        this.setState({
          tailNum: '',
          rows: 0,
          cols: 0,
          seats: 0,
          scheme: [],
          status: 'Додано!',
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
              <h4 className="modal-title">Новий літак</h4>
              <button type="button" className="close" data-dismiss="modal">&times;</button>
            </div>

            <div className="modal-body">
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor={`${this.props.id}-code`}>Бортовий номер:</label>
                  <input
                    type="text"
                    name="tailNum"
                    value={this.state.tailNum}
                    onChange={this.handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`${this.props.id}-schema-update`}>Схема:</label>

                  <div className="form-inline form-inline-margin-fix">
                    <div className="form-group form-group-inline">
                      <label htmlFor={`${this.props.id}-schema-rows`}>Рядів:</label>
                      <input
                        name="rows"
                        type="number"
                        value={this.state.rows}
                        onChange={this.handleRowsChange}
                        id={`${this.props.id}-schema-rows`}
                        className="form-control form-control-short"
                      />
                    </div>

                    <div className="form-group form-group-inine">
                      <label htmlFor={`${this.props.id}-schema-cols`}>Сповпців:</label>
                      <input
                        name="cols"
                        type="number"
                        value={this.state.cols}
                        onChange={this.handleColsChange}
                        id={`${this.props.id}-schema-cols`}
                        className="form-control form-control-short"
                      />
                    </div>
                  </div>

                  <Scheme scheme={this.state.scheme} onClick={this.handleSeatPick} />
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
  id: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AddModal;
