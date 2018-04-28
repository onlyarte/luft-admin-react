import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AddModal from './AddModal';
import UpdateModal from './UpdateModal';
import SearchForm from './SearchForm';

class Pane extends Component {
  constructor(props) {
    super(props);
    this.handleSort = this.handleSort.bind(this);

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
    };
  }

  getFiltered() {
    const { airports } = this.props;
    const filtered = [...airports];
    const sortBy = this.state.sort.prop;
    const { prop, type } = this.state.sort;
    const sorted = [...airports];

    sorted.sort((a, b) => {
      if (type === -1) {
        return a[prop] < b[prop] ? 1 : -1;
      }
      return a[prop] > b[prop] ? 1 : -1;
    });

    return sorted;
  }

  handleSort(prop, type) {
    this.setState({ sort: { prop, type } });
  }

  handleSearch(prop, query) {
    this.setState({ search: { prop, query } });
  }

  render() {
    const airports = this.getSortedAirports();
    return (
      <React.Fragment>
        <h1>Аеропорти</h1>
        <SearchForm properties={this.schema} onSubmit={() => {}} />
        <table className="table table-striped table-hover table-responsive">
          <thead>
            <tr>
              {this.schema.map(prop => (
                <th>
                  {prop.title}
                  <a
                    role="button"
                    tabIndex={0}
                    className={this.state.sort.prop === prop.name && this.state.sort.type === -1
                      ? 'icon-active'
                      : 'icon-pale'}
                    onClick={event => this.handleSortChange(prop.name, -1, event)}
                  >
                    <span className="oi oi-caret-bottom" />
                  </a>
                  <a
                    role="button"
                    tabIndex={0}
                    className={this.state.sort.prop === prop.name && this.state.sort.type === 1
                      ? 'icon-active'
                      : 'icon-pale'}
                    onClick={() => this.handleSortChange(prop.name, 1)}
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
            {airports.map(airport => (
              <tr key={airport._id}>
                {this.schema.map(prop => (
                  <td>{airport[prop.name]}</td>
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
