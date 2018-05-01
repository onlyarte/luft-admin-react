import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import axios from 'axios';

class ImageSelect extends Component {
  constructor(props) {
    super(props);
    this.handleImgDrop = this.handleImgDrop.bind(this);
    this.handleImgRemove = this.handleImgRemove.bind(this);
  }

  handleImgDrop(files) {
    const file = files[0];
    const data = new FormData();
    data.append('logo', file);
    axios.post('http://localhost:3000/posts/image/upload', data)
      .then((result) => {
        console.log(result.data);
        this.props.onChange({ target: { name: this.props.name, value: result.data } });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleImgRemove() {
    this.props.onChange({ target: { name: this.props.name, value: '' } });
  }

  render() {
    return (
      <div className="form-group">
        <label htmlFor={`${this.props.id}-image-upload`}>{this.props.title}</label>
        <div className="form-group">
          <img
            src={this.props.value}
            alt="logo"
            className="img-thumbnail"
            style={{
              maxWidth: '300px',
            }}
          />
        </div>
        <div className="btn-group">
          <button type="button" className="btn btn-default" id={`${this.props.id}-image-upload`}>
            <Dropzone
              onDrop={this.handleImgDrop}
              multiple={false}
              style={{ width: '100px', height: '40px', display: 'inline' }}
            >
              Вибрати
            </Dropzone>
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={this.handleImgRemove}
          >
            Видалити
          </button>
        </div>
      </div>
    );
  }
}

ImageSelect.defaultProps = {
  value: '',
};

ImageSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default ImageSelect;
