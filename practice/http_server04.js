const http = require('http');
const fs = require('fs').promises;

const server= http.createServer((req, res)=>{
    res.writeHead(200, {
        'Content-Type':'text/html; charset=utf-8'
    });
    fs.writeFile(__dirname + '/headers2.txt', JSON.stringify(req.headers, null, 4)).then(()=>{
        res.end('ok');
    })
});
// 加不加'__dirname + '只是補上當前資料夾名，如果需要把檔案放到不同地方還是需要自己接檔案位置，ex. ./ or ../
server.listen(3000);
console.log('http://localhost:3000/');