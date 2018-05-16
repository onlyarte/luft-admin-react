import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AddModal from './AddModal';
import UpdateModal from './UpdateModal';
import SearchForm from '../Shared/SearchForm';
import Pagination from '../Shared/Pagination';

class Pane extends Component {
  constructor(props) {
    super(props);
    this.handleSort = this.handleSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handlePage = this.handlePage.bind(this);
    this.getFiltered = this.getFiltered.bind(this);

    this.schema = [
      {
        name: 'connection',
        secondary: 'originAirport',
        title: 'З',
      },
      {
        name: 'connection',
        secondary: 'destinationAirport',
        title: 'До',
      },
      {
        name: 'date',
        title: 'Дата',
      },
      {
        name: 'connection',
        secondary: 'departureTime',
        title: 'Відправлення',
      },
      {
        name: 'connection',
        secondary: 'arrivalTime',
        title: 'Прибуття',
      },
      {
        name: 'plane',
        secondary: 'tailNum',
        title: 'Літак',
      },
      {
        name: 'price',
        title: 'Базова ціна',
      },
      {
        name: 'coefficient',
        title: 'Коефіцієнт ціни',
      },
      {
        name: 'seatsAvailable',
        title: 'Вільних місць',
      },
      {
        name: '_id',
        title: 'Ідентифікатор',
      },
    ];

    this.state = {
      sort: {
        prop: null,
        type: 0, // 1 asc, -1 desc
      },
      search: {
        prop: null,
        query: '',
      },
      pagination: {
        current: 0,
        step: 10,
      },
    };
  }

  getFiltered() {
    const { flights } = this.props;
    let filtered = [...flights];

    const searchProp = this.state.search.prop;
    const { query } = this.state.search;
    if (this.state.search.prop) {
      filtered = filtered.filter(a => (
        (searchProp.secondary
          ? a[searchProp.name][searchProp.secondary]
          : a[searchProp.name]
        ).toString().indexOf(query) > -1));
    }

    const sortProp = this.state.sort.prop;
    const sortType = this.state.sort.type;

    if (sortType === -1) {
      filtered.sort((a, b) => {
        if (sortProp.secondary) {
          return a[sortProp.name][sortProp.secondary] < b[sortProp.name][sortProp.secondary]
            ? 1
            : -1;
        }
        return a[sortProp.name] < b[sortProp.name] ? 1 : -1;
      });
    } else if (sortType === 1) {
      filtered.sort((a, b) => {
        if (sortProp.secondary) {
          return a[sortProp.name][sortProp.secondary] > b[sortProp.name][sortProp.secondary]
            ? 1
            : -1;
        }
        return a[sortProp.name] > b[sortProp.name] ? 1 : -1;
      });
    }

    return filtered;
  }

  handleSort(prop, type) {
    this.setState({ sort: { prop, type } });
  }

  handleSearch(prop, query) {
    this.setState({ search: { prop, query } });
  }

  handlePage(page) {
    const { pagination } = this.state;
    pagination.current = page;
    this.setState({ pagination });
  }

  render() {
    const { current, step } = this.state.pagination;
    const flights = this.getFiltered();
    const displayedFlights = flights
      .slice(current * step, (current * step) + step);

    return (
      <React.Fragment>
        <h1>Рейси</h1>
        <SearchForm properties={this.schema} onSubmit={this.handleSearch} />
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                {this.schema.map((prop, index) => (
                  <th key={prop.name + index}>
                    {prop.title}{' '}
                    <a
                      role="button"
                      tabIndex={0}
                      className={this.state.sort.prop === prop.name && this.state.sort.type === -1
                        ? 'icon-active'
                        : 'icon-pale'}
                      onClick={event => this.handleSort(prop, -1, event)}
                    >
                      <span className="oi oi-caret-bottom" />
                    </a>
                    <a
                      role="button"
                      tabIndex={0}
                      className={this.state.sort.prop === prop.name && this.state.sort.type === 1
                        ? 'icon-active'
                        : 'icon-pale'}
                      onClick={() => this.handleSort(prop, 1)}
                    >
                      <span className="oi oi-caret-top" />
                    </a>
                  </th>
                ))}
                <th>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm btn-block"
                    data-toggle="modal"
                    data-target="#flight-add-modal"
                  >
                    Додати
                  </button>
                  <AddModal id="flight-add-modal" connections={this.props.connections} planes={this.props.planes} onSubmit={this.props.onChange} />
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedFlights.map(flight => (
                <tr key={flight._id}>
                  {this.schema.map((prop, index) => (
                    <td key={prop.name + index}>
                      {prop.secondary
                        ? flight[prop.name][prop.secondary]
                        : flight[prop.name]}
                    </td>
                  ))}
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-dark btn-sm btn-block"
                      data-toggle="modal"
                      data-target={`#${flight._id}-update`}
                    >
                      Змінити
                    </button>
                    <UpdateModal id={`${flight._id}-update`} flight={flight} onSubmit={this.props.onChange} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            length={Math.ceil(flights.length / this.state.pagination.step)}
            current={this.state.pagination.current}
            onChange={this.handlePage}
          />
        </div>
      </React.Fragment>
    );
  }
}

Pane.propTypes = {
  flights: PropTypes.arrayOf(PropTypes.shape({
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
  })).isRequired,

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

  onChange: PropTypes.func.isRequired,
};

export default Pane;
