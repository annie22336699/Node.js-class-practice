const http = require('http');

const server= http.createServer((req, res)=>{
    res.writeHead(200,{
        'Content-Type': 'text/html'
        // 寫在檔頭的東西
    })
    res.write('<div>我改!!</div>');
    res.end(`<h2>Hola</h2>
        <p>${req.url}</p>
    `)
    // 寫在尾端的東西，所以end跟writeHead都只有一個
});

server.listen(3000);
// 埠號用3000
// node practice\http_server01.js 在CMD開啟後，在網頁端以localhost:3000查看
// 居然會有編碼問題