import Client from "./utils/Client";
const client = new Client();

client.start();

process.on('unhandledRejection', error => console.error('Unhandled promise rejection:', error));

process.on("uncaughtException", error => console.error('Uncaught Exception:', error))