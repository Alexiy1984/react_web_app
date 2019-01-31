import express  from 'express';
import React    from 'react';
import ReactDom from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from './routes';
import { Provider } from 'react-redux';
import configureStore from './redux/configureStore';

const app = express();

// let sheet;
let result;

app.use('/list', (req, res, next) => {
  const fs = require('fs');
  const readline = require('readline');
  const { google } = require('googleapis');
  const SCOPES = [ 'https://www.googleapis.com/auth/spreadsheets.readonly' ];
  const TOKEN_PATH = './src/token.json';

  fs.access('./src/data/clinicTable.json', fs.F_OK, (err) => {
    if (err) {
      fs.readFile('./src/credentials.json', (crederr, content) => {
        if (crederr) return console.log('Error loading client secret file:', crederr);
        authorize(JSON.parse(content), listMajors);
      });
    }
    fs.readFile('./src/data/clinicTable.json',  (dataerr, content) => {
      if (dataerr) return console.log('Error loading data file:', dataerr);
      result = JSON.parse(content);
    });
  });

  function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getNewToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error while trying to retrieve access token', err);
        oAuth2Client.setCredentials(token);
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }

  function listMajors(auth) {
    const sheets = google.sheets({ version: 'v4', auth });
    sheets.spreadsheets.values.get({
      spreadsheetId: '1KrJppgU8OCEb4rC2glZTjVd7kJ0FXVEeGQ9YszE5B6M',
      range: 'Stem Cell Clinic'
    }, (err, res) => {
      if (err) return console.log(`The API returned an error: ${err}`);
      const rows = res.data.values;
      // sheet = rows;
      result = [];
      // const replacer = (_match, m1) => { '_' + m1.toLowerCase() }
      if (rows.length) {
        const columns = rows[0];

        rows.map((row, index) => {
          if (index !== 0) {
            const _row = {};

            columns.map((item, index) => {
              item = item.toLowerCase().replace(/\s+/g, '_').replace(/[^_a-z]/, '');
              _row[item] = row[index];
            });
            result.push(_row);
          }
          // console.log(result);
          // console.warn('results printed');
        });
        // (fsPromises.writeFile('./src/data/clinicTable.json', JSON.stringify(result))
        //   .then(() => {
        //     console.log('JSON saved');
        //   })
        //   .catch(er => {
        //     console.log(er);
        //   }));
        // eslint-disable-next-line
        fs.writeFileSync('./src/data/clinicTable.json', JSON.stringify(result), (_err) => {
          if (_err) console.error(_err);
        });
      } else {
        console.log('No data found.');
      }
    });
    return result;
  }

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(result));

  // exports.list(JSON.stringify(result));
});

app.use('/test', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ a: 1, b: 2, c: 3 }));
});

app.use((req, res) => {
  const store = configureStore();

  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      return res.redirect(301, redirectLocation.pathname + redirectLocation.search);
    }

    if (error) {
      return res.status(500).send(error.message);
    }

    if (!renderProps) {
      return res.status(404).send('Not found');
    }

    const componentHTML = ReactDom.renderToString(
      <Provider store={store}>
        <RouterContext {...renderProps} />
      </Provider>
    );

    return res.end(renderHTML(componentHTML));
  });
});

const assetUrl = process.env.NODE_ENV !== 'production' ? 'http://localhost:8050' : '/';

function renderHTML(componentHTML) {
  return `
    <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Hello React</title>
          <link rel="stylesheet" href="${assetUrl}/public/assets/styles.css">
      </head>
      <body>
        <div id="react-view">${componentHTML}</div>
        <script type="application/javascript" src="${assetUrl}/public/assets/bundle.js"></script>
      </body>
    </html>
  `;
}

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on: ${PORT}`);
});
