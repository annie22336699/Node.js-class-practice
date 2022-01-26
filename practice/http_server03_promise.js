const http = require('http');
const fs = require('fs');
const { rejects } = require('assert');

function MyReadFile(file_path){
    return new Promise((resolve, reject)=>{
        fs.readFile(file_path, (error, data)=>{
            if(error) return reject(error);
            resolve(data);
        });
    });
}

const server= http.createServer(async (req, res)=>{
    const data= await MyReadFile(__dirname + './../headers.txt');
    res.writeHead(200, {
                'Content-Type':'text/html; charset=utf-8'
            });
            res.end(data);
        });

server.listen(3000);
console.log('http://localhost:3000/');