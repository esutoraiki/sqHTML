/* Update: 20230618 */

"use strict";

import { stringToBoolean } from "./fn.mjs";
import http from "http";
import fs from "fs";
import path from "path";
import logs from "excolor";
import os from "os";
import net from "net";

const
    // Enviroments
    port = process.env.PORT || 8125,
    view = stringToBoolean(process.env.LOG) || false,
    networkInterfaces = os.networkInterfaces(),
    addresses = [];
;

for (const [interfaceKey, interfaces] of Object.entries(networkInterfaces)) {
    for (const iface of interfaces) {
        // Filtrar direcciones IPv4 y no internas
        if (iface.family === "IPv4" && !iface.internal) {
            addresses.push(iface.address);
        }
    }
}

// Función para comprobar si el puerto está en uso
function isPortInUse(port, callback) {
    const server = net.createServer();
    server.once("error", function (err) {
        if (err.code === "EADDRINUSE" || err.code === "EACCES") {
            callback(true);
        } else {
            callback(false);
        }
    });
    server.once("listening", function () {
        server.close();
        callback(false);
    });
    server.listen(port);
}

isPortInUse(port, (inUse) => {
    if (inUse) {
        if (port < 1024) {
            logs("%[red]ACCESS DENIED. YOU ARE TRYING TO LISTEN ON A PORT BELOW 1024. PORT: " + port);
        } else {
            logs("%[red]PORT " + port + " IS ALREADY IN USE");
        }
        process.exit(1);
    } else {
        http.createServer(function (request, response) {
            if (view) {
                let
                timeElapsed = Date.now(),
                    t = new Date(timeElapsed),
                    hour = t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds()
                ;

                logs("%[yellow][" + hour + "]", request.url);
            }


            var filePath = "." + request.url;

            if (filePath == "./") {
                filePath = "./index.html";
            }

            var extname = String(path.extname(filePath)).toLowerCase();
            var contentType = "text/html";
            var mimeTypes = {
                ".html": "text/html",
                ".js": "text/javascript",
                ".css": "text/css",
                ".json": "application/json",
                ".png": "image/png",
                ".jpg": "image/jpg",
                ".webp": "image/webp",
                ".gif": "image/gif",
                ".svg": "image/svg+xml",
                ".wav": "audio/wav",
                ".mp4": "video/mp4",
                ".webm": "video/webm",
                ".ogv": "video/ogv",
                ".mov": "video/mov",
                ".woff": "application/font-woff",
                ".woff2": "font/woff2",
                ".ttf": "applilcation/font-ttf",
                ".eot": "application/vnd.ms-fontobject",
                ".otf": "application/font-otf",
                ".scss": "text/x-scss"
            };

            contentType = mimeTypes[extname] || "application/octect-stream";
            fs.readFile(filePath, function (error, content) {
                if (error) {
                    if (error.code === "ENOENT") {
                        fs.readFile("./404.html", function (error, content) {
                            response.writeHead(200, { "Content-Type": contentType });
                            response.end(content, "utf-8");
                        });
                    } else {
                        response.writeHead(500);
                        response.end("Sorry, check with the site admin for error: " + error.code + " ..\n");
                        response.end();
                    }
                } else {
                    response.writeHead(200, { "Content-Type": contentType });
                    response.end(content, "utf-8");
                }
            });
        }).listen(port);

        console.clear();

        logs("%[yellow]START SQHTML");
        logs("%[yellowBright]-------------------------------------");
        logs("%[yellow]Server running at");
        logs("Local: %[yellow]http://localhost:%[red]" + port + "/");
        logs("IP: %[yellow]http://0.0.0.0:%[red]" + port + "/");

        for (let address of addresses) {
            logs("IP: %[yellow]http://" + address + ":%[red]" + port + "/");
        }
        logs("%[yellowBright]-------------------------------------");
    }
});

