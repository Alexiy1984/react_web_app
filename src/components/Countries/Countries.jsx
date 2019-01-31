import React, { Component } from 'react';
import Grid  from 'react-bootstrap/lib/Grid';
import Row  from 'react-bootstrap/lib/Row';
import Col  from 'react-bootstrap/lib/Col';
import ClinicCard from './ClinicCard';
import './Countries.less';

class Countries extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      country: 'All counties'
    };
  }

  componentDidMount() {
    fetch('/list')
      .then(response => response.json())
      .then(data => this.setState({ data }));
  }

  handleChange = (event) => {
    this.setState({ country: event.target.value });
  };

  render() {
    const { data, country }  = this.state;
    // const selectedCountry = this.state.country;
    const arr = [];
    const uniqueArray = [ 'All counties' ];

    return (
      <Grid>
        <Row>
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
            <select className='select_fw' onChange={this.handleChange} value={country}>
              {uniqueArray.map((unelt, unind) =>
                <option value={unelt} key={unind}>{unelt}</option>
              )}
            </select>
          </ Col>
        </ Row>
        <Row>
          <Col xs={12}>
            <h2>Country: {country}</h2>
            <div className='card__container'>
              {data.map((elt, index) => {
                if (country === 'All counties') {
                  return (
                    <ClinicCard key={index}
                      clinicName={elt.clinic_name}
                      contactName={elt.contact_name}
                      address={elt.address}
                      tel={elt.tel}
                    />
                  );
                } else if (elt.country === country) {
                  return (
                    <ClinicCard className='card' key={index}
                      clinicName={elt.clinic_name}
                      contactName={elt.contact_name}
                      address={elt.address}
                      tel={elt.tel}
                    />
                  );
                }
              })}
            </div>
          </ Col>
        </ Row>
      </Grid>
    );
  }
}

export default Countries;
