const http = require('http');
const fs = require('fs');

const server= http.createServer((req, res)=>{
    res.writeHead(200,{
        'Content-Type': 'text/html; charset=utf-8'
        // 編碼設定可寫在這裡
    })
    fs.writeFile('./headers.txt', JSON.stringify(req.headers, null, 4), error => {
        if(error){
            console.log(error);
            res.end('<meta charset="utf-8" /> 錯誤');
            // 編碼設定可寫在這裡
        } else {
            res.end('<meta charset="utf-8" /> 沒問題');
            // 編碼設定可寫在這裡
        }
    });
});

server.listen(3000);