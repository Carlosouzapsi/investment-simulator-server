const express = require('express');
const cors = require('cors');
const { user } = require('./api');
const HandleErrors = require('./utils/errorHandler');

module.exports = async (app) => {
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cors());
  app.use(express.static(__dirname + '/public'));

  user(app);

  app.use(HandleErrors);
};
