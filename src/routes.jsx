import React from 'react';
import { IndexRoute, Route }  from 'react-router';
import App from 'components/App';
import CounterPage from 'components/CounterPage';
import MainPage from 'components/MainPage';
import TimePage from 'components/TimePage';
import GoogleSheets from 'components/GoogleSheets';
import TestPage from 'components/Test';
import Countries from 'components/Countries';

export default (
  <Route component={App} path='/'>
    <IndexRoute component={MainPage} />
    <Route component={CounterPage} path='counters' />
    <Route component={TimePage} path='time' />
    <Route component={GoogleSheets} path='googlesh' />
    <Route component={TestPage} path='test_page' />
    <Route component={Countries} path='countries' />
  </Route>
);
