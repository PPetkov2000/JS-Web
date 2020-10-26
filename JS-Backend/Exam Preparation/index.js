const express = require("express");
const { port } = require("./config");

const app = express();
const appString = `Server running on port ${port}`;

require("./config/database")()
  .then(() => {
    require("./config/express")(express, app);
    require("./config/routes")(express, app);

    app.listen(port, () => console.log(appString));
  })
  .catch(console.error);
