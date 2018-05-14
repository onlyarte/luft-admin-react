import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TicketsTable extends Component {
  render() {
    return (
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Маршрут</th>
              <th>Дата</th>
              <th>Час</th>
              <th>Літак</th>
              <th>Місце</th>
              <th>Пасажир</th>
              <th>Сума</th>
              <th>Статус</th>
              <th>Номер замовлення</th>
            </tr>
          </thead>
          <tbody>
            {this.props.tickets.map(ticket => (
              <tr key={ticket._id}>
                <td>{ticket.flight.origin} — {ticket.flight.destination}</td>
                <td>{ticket.flight.date}</td>
                <td>{ticket.flight.departure} — {ticket.flight.arrival}</td>
                <td>{ticket.flight.plane}</td>
                <td>{ticket.seat}</td>
                <td>{ticket.passanger.firstname} {ticket.passanger.surname}</td>
                <td>{ticket.price}</td>
                <td>{ticket.status}</td>
                <td>{ticket._id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

TicketsTable.propTypes = {
  tickets: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    passanger: PropTypes.shape({
      firstname: PropTypes.string.isRequired,
      surname: PropTypes.string.isRequired,
    }).isRequired,
    flight: PropTypes.shape({
      date: PropTypes.string.isRequired,
      origin: PropTypes.string.isRequired,
      destination: PropTypes.string.isRequired,
      departure: PropTypes.string.isRequired,
      arrival: PropTypes.string.isRequired,
      plane: PropTypes.string.isRequired,
    }).isRequired,
  })).isRequired,
};

export default TicketsTable;
