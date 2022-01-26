const http = require('http');
const fs = require('fs').promises;

const server= http.createServer(async (req, res)=>{
    res.writeHead(200, {
        'Content-Type':'text/html; charset=utf-8'
    });
    try{
        await fs.writeFile(__dirname + '/headers3.txt', JSON.stringify(req.headers, null, 4));
    } catch{
        return res.end('error'+ex);
    }
    res.end('ok');
});

server.listen(3000);
console.log('http://localhost:3000/');