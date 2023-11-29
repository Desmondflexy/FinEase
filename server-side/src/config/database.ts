import { connect, connection } from "mongoose";

const withoutInternet = true;

export default function connectDB() {

  const databaseUrl = withoutInternet
    ? process.env.DATABASE_URL_LOCAL as string
    : process.env.DATABASE_URL as string;

  function connectWithRetry() {
    connect(databaseUrl)
      .then(() => {
        console.log(`Database ${withoutInternet? '(offline)':"(online)"} is connected`);
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