import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Scheme from './Scheme';

class SchemeModal extends Component {
  render() {
    return (
      <div className="modal fade" id={this.props.id}>
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h4 className="modal-title">Схема {this.props.plane.tailNum}</h4>
              <button type="button" className="close" data-dismiss="modal">&times;</button>
            </div>

            <div className="modal-body">
              <Scheme scheme={this.props.plane.scheme} />
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline-danger" data-dismiss="modal">Закрити</button>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

SchemeModal.propTypes = {
  id: PropTypes.string.isRequired,
  plane: PropTypes.shape({
    tailNum: PropTypes.string.isRequired,
    scheme: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({
      empty: PropTypes.bool,
      seatNum: PropTypes.number,
    }))).isRequired,
  }).isRequired,
};

export default SchemeModal;
