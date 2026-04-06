import { dataSource } from "../config/dataSource";
import { initializeApp } from "./app";

const port = process.env.PORT || 3000;

dataSource
  .initialize()
  .then(() => initializeApp())
  .then((app) => {
    app.listen(port, () =>
      console.log(`Example app listening at http://localhost:${port}`),
    );
  })
  .catch((error) => {
    console.error("Failed to initialize app:", error);
    process.exit(1);
  });
