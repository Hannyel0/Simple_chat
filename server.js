import chalk from "chalk"
import express from "express"
import http from "http"
import { WebSocketServer } from "ws"
import fs from 'fs'
import os from "os"


//Get the Ip address of the machine
const getLocalIpAddress = () => {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
        for (const iface of networkInterfaces[interfaceName]) {
            // Check for an IPv4 address that is not internal (127.0.0.1)
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';  // Default to localhost if no external IP is found
};



const PORT = 3939
const HOST = getLocalIpAddress()


const app = express()

const server = http.createServer(app);


app.use(express.static("public"))

const logFilePath = './public/messages.txt';

const wss = new WebSocketServer({server})


wss.on("connection", (ws)=>{
    console.log("New client just connected")

    


    ws.on('message', (message)=>{
        console.log(`Recieved message: ${message}`)

        const messageString = message.toString();

        fs.appendFile(logFilePath, messageString + '\n', (err) => {
            if (err) {
                console.error('Error writing message to file:', err);
            }
        });

        fs.readFile(logFilePath, 'utf-8', (err, data) => {
            if (err) {
                console.error('Error reading messages file:', err);
                return;
            }
            wss.clients.forEach((client)=>{
                if(client.readyState === client.OPEN){
                    client.send(data)
                }
            })
        });

        
    })

    ws.on("close", ()=>{
        console.log("client just disconenected")
    })
})

server.listen(PORT, HOST, ()=>{
    console.log("server is running on ", chalk.green(`http://${HOST}:${PORT}`))
})


