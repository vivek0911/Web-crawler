const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const db = require('./constants');
mongoose.Promise = require('bluebird');

module.exports = () => {
  // Find the appropriate database to connect to, default to localhost if not found.
  const connect = () => {
    mongoose.connect(db, (err) => {
      if (err) {
        console.log(`===>  Error connecting to ${db}`);
        console.log(`Reason: ${err}`);
      } else {
        console.log(`===>  Succeeded in connecting to ${db}`);
      }
    });
  };
  connect();

  mongoose.connection.on('error', console.log);
  mongoose.connection.on('disconnected', connect);

};