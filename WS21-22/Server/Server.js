/**
 * Minimal implementation showing the use of the FudgeServer.
 * Start with `node Server.js port`, Heroku uses the start-script in package.json
 * @author Jirka Dell'Oro-Friedl, HFU, 2021
 */
console.log("starting server");
import { FudgeServer } from "../FudgeNet/Server/FudgeServer.js";
let port = process.env.PORT;
if (port == undefined)
    port = parseInt(process.argv[2]);
if (!port) {
    console.log("Syntax: node Server.js port or use start script in Heroku");
    process.exit();
}
let server = new FudgeServer();
server.startUp(port);
server.broadcast("Do you get this message?");
console.log(server);
console.log("server started");
