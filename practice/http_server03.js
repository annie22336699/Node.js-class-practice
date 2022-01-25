const http = require('http');
const fs = require('fs');
// 讀檔
const server= http.createServer((req, res)=>{
    fs.readFile(__dirname + './headers.txt',(error, data)=>{
        if(error){
            console.log(error);
            res.writeHead(200, {
                'Content-Type':'text/html; charset=utf-8'
            });
            res.end('錯誤');
            // 編碼部分還是寫在檔頭比較好
        }else{
            res.writeHead(200, {
                'Content-Type':'application/json; charset=utf-8'
            });
            res.end(data);
        }
    })
});

server.listen(3000);
console.log('http://localhost:3000/');