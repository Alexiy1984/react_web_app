import React, { Component } from 'react';
import Grid  from 'react-bootstrap/lib/Grid';
import Row  from 'react-bootstrap/lib/Row';
import Col  from 'react-bootstrap/lib/Col';
import './GoogleSheets.less';

class GoogleSheets extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };
  }

  componentDidMount() {
    fetch('/list')
      .then(response => response.json())
      .then(data => this.setState({ data }));
  }

  render() {
    const { data } = this.state;
    const arr = [];
    const uniqueArray = [];

    return (
      <Grid>
        <Row className='show-grid'>
          <Col sm={12} md={9}>
            <h2>Malaysia Clinics</h2>
            <ul className='col-6'>
              {data.map(elt =>
                (elt.country === 'Malaysia') ?
                  <li key={`${elt.clinic_name}->${elt.country}`}>
                    {elt.clinic_name}
                  </li>
                : null
              )}
            </ul>
            <div className='box'>
              {data.map(elt =>
                (elt.country === 'Malaysia' && elt.clinic_name === 'Cell Malaysia') ?
                  <div key={`${elt.clinic_name}->${elt.country}`}>
                    <p>Clinic name: {elt.clinic_name}</p>
                    <p>Country: {elt.country}</p>
                    <p>Tel: {elt.tel}</p>
                    <p>Email: {elt.email}</p>
                  </div>
                : null
              )}
            </div>
          </ Col>
          <Col sm={12} md={3}>
            {data.map(elt => {
              arr.push(elt.country);
            })}
            {arr.forEach((element) => {
              if (uniqueArray.indexOf(element) === -1) {
                uniqueArray.push(element);
              }
            })}
            <h2>Clinics location</h2>
            <select className='select_fw'>
              {uniqueArray.map((unelt, unind) =>
                <option value={unind} key={unind}>{unelt}</option>
              )}
            </select>
          </ Col>
        </ Row>
      </ Grid>
    );
  }
}

export default GoogleSheets;
