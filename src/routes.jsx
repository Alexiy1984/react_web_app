import React from 'react';
import { IndexRoute, Route }  from 'react-router';
import App from 'components/App';
import CounterPage from 'components/CounterPage';
import MainPage from 'components/MainPage';
import TimePage from 'components/TimePage';
import GoogleSheets from 'components/GoogleSheets';

export default (
  <Route component={App} path='/'>
    <IndexRoute component={MainPage} />
    <Route component={CounterPage} path='counters' />
    <Route component={TimePage} path='time' />
    <Route component={GoogleSheets} path='googlesh' />
  </Route>
);
