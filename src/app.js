const express = require("express");
const { PORT } = require("./config");
const { databaseConnection } = require("./database");
const expressApp = require("./express-app");
const HandleErrors = require("./utils/errorHandler");

const startServer = async () => {
  const app = express();

  await databaseConnection();

  await expressApp(app);

  app.use(HandleErrors);

  app
    .listen(PORT, () => {
      console.log(`listening to port ${PORT}`);
    })
    .on("error", (err) => {
      console.log(err);
      process.exit();
    });
};

startServer();
