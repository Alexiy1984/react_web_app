import React, { Component, PropTypes  } from 'react';
import Col  from 'react-bootstrap/lib/Col';

const propTypes = {
  clinicName: PropTypes.string,
  contactName: PropTypes.string,
  address: PropTypes.string,
  tel: PropTypes.string
};

const defaultProps = {
  clinicName: '',
  contactName: '',
  address: '',
  tel: ''
};

class ClinicCard extends Component {
  render() {
    const {
      clinicName,
      contactName,
      address,
      tel
    } = this.props;

    return (
      <Col xs={12} md={4}>
        <div className='card'>
          <h3>{clinicName}</h3>
          <p>{contactName}</p>
          <p>{address}</p>
          <p>{tel}</p>
        </div>
      </ Col>
    );
  }
}

ClinicCard.propTypes = propTypes;
ClinicCard.defaultProps = defaultProps;

export default ClinicCard;
