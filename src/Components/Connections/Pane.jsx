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
        name: 'originAirport',
        secondary: 'name',
        title: 'З',
      },
      {
        name: 'destinationAirport',
        secondary: 'name',
        title: 'До',
      },
      {
        name: 'departureTime',
        title: 'Відправлення',
      },
      {
        name: 'arrivalTime',
        title: 'Прибуття',
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
    const { connections } = this.props;
    let filtered = [...connections];

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
    const connections = this.getFiltered();
    const displayedConnections = connections
      .slice(current * step, (current * step) + step);

    return (
      <React.Fragment>
        <h1>Маршрути</h1>
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
                    data-target="#connection-add-modal"
                  >
                    Додати
                  </button>
                  <AddModal id="connection-add-modal" airports={this.props.airports} onSubmit={this.props.onChange} />
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedConnections.map(connection => (
                <tr key={connection._id}>
                  {this.schema.map(prop => (
                    <td key={prop.name}>
                      {prop.secondary
                        ? connection[prop.name][prop.secondary]
                        : connection[prop.name]}
                    </td>
                  ))}
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-dark btn-sm btn-block"
                      data-toggle="modal"
                      data-target={`#${connection._id}-update`}
                    >
                      Змінити
                    </button>
                    <UpdateModal id={`${connection._id}-update`} connection={connection} onSubmit={this.props.onChange} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            length={Math.ceil(connections.length / this.state.pagination.step)}
            current={this.state.pagination.current}
            onChange={this.handlePage}
          />
        </div>
      </React.Fragment>
    );
  }
}

const Airport = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
});

Pane.propTypes = {
  connections: PropTypes.arrayOf(PropTypes.shape({
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
  })).isRequired,
  airports: PropTypes.arrayOf(Airport).isRequired,

  onChange: PropTypes.func.isRequired,
};

export default Pane;
