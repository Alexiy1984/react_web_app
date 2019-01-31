import React, { Component } from 'react';
import { Link } from 'react-router';
import './TestPage.less';

class TestPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      links: []
    };
  }

  componentDidMount() {
    fetch('/list')
      .then(response => response.json())
      .then(links => this.setState({ links }));
  }

  render() {
    const { links } = this.state;
    const arr = [];
    const uniqueArray = [];
    let uneltToLink;

    return (
      <div>
        {links.map(elt => {
          arr.push(elt.country);
        })}
        {arr.forEach((element) => {
          if (uniqueArray.indexOf(element) === -1) {
            uniqueArray.push(element);
          }
        })}
        <ul>
          {uniqueArray.map((unelt, unind) => {
            uneltToLink = unelt.replace(/\s+/g, '_').toLowerCase();
            return <li key={unind}><Link to = {uneltToLink}>{unelt}</Link></li>;
          })}
        </ul>
      </div>
    );
  }

}

export default TestPage;
