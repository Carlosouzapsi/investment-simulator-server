const express = require('express');
const cors = require('cors');
const { user } = require('./api');
const HandleErrors = require('./utils/errorHandler');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
// Carrega o arquivo swagger.yaml
const swaggerDocs = YAML.load(path.join(__dirname, '../swagger.yaml'));

module.exports = async (app) => {
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cors());
  app.use(express.static(__dirname + '/public'));

  // Configura a rota da documentação Swagger (UI)
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


  user(app);

  app.use(HandleErrors);
};
