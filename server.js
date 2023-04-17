const app = require('./app');
const process = require('node:process')
const connectToDataBase = require('./database/databaseconnect');
const dotenv = require("dotenv").config({ path: "backend/config/.env" });
//  unhandled uncaughtException
process.on("uncaughtException", (err) => {
    console.log(err);
    console.log(`error : ${err.message}`);
    console.log(`shutting down the server because of  uncaught Exception`);
 
        process.exit(1);
 

})


//  connecting to data base 
connectToDataBase();

const port = process.env.port;
const server = app.listen(port, () => {
    console.log(`server listing on port  on http://localhost:${port}`)
})
//  unhandled promise regestions
process.on('unhandledRejection', (err) => {
    console.log(err);
    console.log(`error : ${err.message}`);
    console.log(`shutting down the server because of  unhanddled promiss  rejection`);
    server.close(() => {
        process.exit(1);
    });

})

