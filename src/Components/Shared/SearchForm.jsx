import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.handlePropChange = this.handlePropChange.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      prop: this.props.properties[0],
      query: '',
    };
  }

  handlePropChange(prop) {
    this.setState({ prop });
  }

  handleQueryChange(event) {
    this.setState({ query: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { prop, query } = this.state;
    this.props.onSubmit(prop.name, query);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} style={{ width: '100%' }}>
        <div className="form-group input-group">
          <div className="input-group-prepend">
            <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {this.state.prop.title}{' '}<span className="caret" />
            </button>
            <div className="dropdown-menu">
              {this.props.properties.map(prop => (
                <a
                  role="button"
                  tabIndex={0}
                  onClick={e => this.handlePropChange(prop, e)}
                  className="dropdown-item"
                  key={prop.name}
                >
                  {prop.title}
                </a>
              ))}
            </div>
          </div>
          <input
            type="text"
            className="form-control"
            aria-label="..."
            value={this.state.query}
            onChange={this.handleQueryChange}
            placeholder="Пошук..."
          />
          <div className="input-group-append">
            <input type="submit" className="btn btn-outline-secondary dropdown-toggle" value="Шукати" />
          </div>
        </div>
      </form>
    );
  }
}

SearchForm.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default SearchForm;
