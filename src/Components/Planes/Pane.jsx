import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AddModal from './AddModal';
import UpdateModal from './UpdateModal';
import SchemeModal from './SchemeModal';
import SearchForm from '../Shared/SearchForm';
import Pagination from '../Shared/Pagination';

class Pane extends Component {
  constructor(props) {
    super(props);
    this.handleSort = this.handleSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handlePage = this.handlePage.bind(this);
    this.getFiltered = this.getFiltered.bind(this);

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
    const { planes } = this.props;
    let filtered = [...planes];

    const searchBy = this.state.search.prop;
    const { query } = this.state.search;
    if (this.state.search.prop) {
      filtered = filtered.filter(a => (a[searchBy].toString().indexOf(query) > -1));
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
    const planes = this.getFiltered();
    const displayedPlanes = planes.slice(current * step, (current * step) + step);

    return (
      <React.Fragment>
        <h1>Літаки</h1>
        <SearchForm properties={[{ name: 'tailNum', title: 'Бортовий номер' }]} onSubmit={this.handleSearch} />
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>
                  Бортовий номер{' '}
                  <a
                    role="button"
                    tabIndex={0}
                    className={this.state.sort.prop === 'tailNum' && this.state.sort.type === -1
                      ? 'icon-active'
                      : 'icon-pale'}
                    onClick={event => this.handleSort('tailNum', -1, event)}
                  >
                    <span className="oi oi-caret-bottom" />
                  </a>
                  <a
                    role="button"
                    tabIndex={0}
                    className={this.state.sort.prop === 'tailNum' && this.state.sort.type === 1
                      ? 'icon-active'
                      : 'icon-pale'}
                    onClick={() => this.handleSort('tailNum', 1)}
                  >
                    <span className="oi oi-caret-top" />
                  </a>
                </th>
                <th>Схема</th>
                <th className="td-button">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm btn-block"
                    data-toggle="modal"
                    data-target="#plane-add-modal"
                  >
                    Додати
                  </button>
                  <AddModal id="plane-add-modal" onSubmit={this.props.onChange} />
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedPlanes.map(plane => (
                <tr key={plane._id}>
                  <td>{plane.tailNum}</td>
                  <td className="td-button">
                    <button
                      type="button"
                      className="btn btn-outline-dark btn-sm btn-block"
                      data-toggle="modal"
                      data-target={`#${plane._id}-scheme-view`}
                    >
                      Переглянути
                    </button>
                    <SchemeModal id={`${plane._id}-scheme-view`} plane={plane} onSubmit={this.props.onChange} />
                  </td>
                  <td className="td-button">
                    <button
                      type="button"
                      className="btn btn-outline-dark btn-sm btn-block"
                      data-toggle="modal"
                      data-target={`#${plane._id}-update`}
                    >
                      Змінити
                    </button>
                    <UpdateModal id={`${plane._id}-update`} plane={plane} onSubmit={this.props.onChange} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            length={Math.ceil(planes.length / this.state.pagination.step)}
            current={this.state.pagination.current}
            onChange={this.handlePage}
          />
        </div>
      </React.Fragment>
    );
  }
}

Pane.propTypes = {
  planes: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    tailNum: PropTypes.string.isRequired,
    seats: PropTypes.number.isRequired,
    scheme: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({
      empty: PropTypes.bool,
      seatNum: PropTypes.number,
    }))).isRequired,
  })).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Pane;
