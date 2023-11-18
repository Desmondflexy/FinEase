import { connect, connection } from "mongoose";

const withoutInternet = false;

export default function connectDB() {

  const databaseUrl = withoutInternet ? process.env.DATABASE_URL_LOCAL : process.env.DATABASE_URL;

  function connectWithRetry() {
    connect(databaseUrl as string)
      .then(() => {
        console.log("Database is connected");
      })
      .catch((err) => {
        console.error("Error connecting to Database: ", err.code);
        setTimeout(connectWithRetry, 5000);
      });
  };

  // Event listeners for disconnection
  connection.on("disconnected", () => {
    console.log("Disconnected from the database");
    setTimeout(connectWithRetry, 5000);
  });

  connectWithRetry();
}