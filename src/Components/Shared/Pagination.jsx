import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Pagination extends Component {
  render() {
    const { length, current, onChange } = this.props;
    return (
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${current === 0 ? 'disabled' : ''}`}>
            <a className="page-link" href="#" onClick={e => onChange(current - 1, e)}>Назад</a>
          </li>
          {[...Array(length)].map((x, page) => (
            <li className={`page-item ${page === current ? 'active' : ''}`} key={page}>
              <a className="page-link" href="#" onClick={e => onChange(page, e)}>
                {page + 1}
              </a>
            </li>
          ))}
          <li className={`page-item ${current >= length - 1 ? 'disabled' : ''}`}>
            <a className="page-link" href="#" onClick={e => onChange(current + 1, e)}>Далі</a>
          </li>
        </ul>
      </nav>
    );
  }
}

Pagination.propTypes = {
  length: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Pagination;
