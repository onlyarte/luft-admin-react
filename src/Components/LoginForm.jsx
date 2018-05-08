import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      email: '',
      password: '',
    };
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { email, password } = this.state;

    axios.post('http://localhost:3000/admin/login', {
      email, password,
    }, { withCredentials: true })
      .then(({ data }) => {
        this.props.onLogin(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="card login-card">
        <div className="card-header">Вхід</div>
        <div className="card-body">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">Електронна адреса:</label>
              <input
                type="email"
                name="email"
                value={this.state.email}
                onChange={this.handleChange}
                className="form-control"
                id="login-email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="login-password">Пароль:</label>
              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
                className="form-control"
                id="login-password"
                required
              />
            </div>
            <div className="form-group">
              <input type="submit" className="btn btn-outline-success" value="Увійти" />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginForm;
