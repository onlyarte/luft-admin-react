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
        name: 'code',
        title: 'Код IATA',
      },
      {
        name: 'name',
        title: 'Назва',
      },
      {
        name: 'city',
        title: 'Місто',
      },
      {
        name: 'country',
        title: 'Країна',
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
        step: 5,
      },
    };
  }

  getFiltered() {
    const { airports } = this.props;
    let filtered = [...airports];

    const searchProp = this.state.search.prop;
    const { query } = this.state.search;
    if (this.state.search.prop) {
      filtered = filtered.filter(a => (a[searchProp.name].toString().indexOf(query) > -1));
    }

    const sortBy = this.state.sort.prop;
    const sortType = this.state.sort.type;

    if (sortType === -1) {
      filtered.sort((a, b) => (
        a[sortBy] < b[sortBy] ? 1 : -1
      ));
    } else if (sortType === 1) {
      filtered.sort((a, b) => (
        a[sortBy] > b[sortBy] ? 1 : -1
      ));
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
    const airports = this.getFiltered();
    const displayedAirports = airports.slice(current * step, (current * step) + step);

    return (
      <React.Fragment>
        <h1>Аеропорти</h1>
        <SearchForm properties={this.schema} onSubmit={this.handleSearch} />
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                {this.schema.map(prop => (
                  <th key={prop.name}>
                    {prop.title}{' '}
                    <a
                      role="button"
                      tabIndex={0}
                      className={this.state.sort.prop === prop.name && this.state.sort.type === -1
                        ? 'icon-active'
                        : 'icon-pale'}
                      onClick={event => this.handleSort(prop.name, -1, event)}
                    >
                      <span className="oi oi-caret-bottom" />
                    </a>
                    <a
                      role="button"
                      tabIndex={0}
                      className={this.state.sort.prop === prop.name && this.state.sort.type === 1
                        ? 'icon-active'
                        : 'icon-pale'}
                      onClick={() => this.handleSort(prop.name, 1)}
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
                    data-target="#airport-add-modal"
                  >
                    Додати
                  </button>
                  <AddModal id="airport-add-modal" onSubmit={this.props.onChange} />
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedAirports.map(airport => (
                <tr key={airport._id}>
                  {this.schema.map(prop => (
                    <td key={prop.name}>{airport[prop.name]}</td>
                  ))}
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-dark btn-sm btn-block"
                      data-toggle="modal"
                      data-target={`#${airport._id}-update`}
                    >
                      Змінити
                    </button>
                    <UpdateModal id={`${airport._id}-update`} airport={airport} onSubmit={this.props.onChange} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            length={Math.ceil(airports.length / this.state.pagination.step)}
            current={this.state.pagination.current}
            onChange={this.handlePage}
          />
        </div>
      </React.Fragment>
    );
  }
}

Pane.propTypes = {
  airports: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
  })).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Pane;
