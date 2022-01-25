const f1 = require('./funciton01');  // 將剛剛的funciton01掛入
// 相當於設定一個變數，引用funciton01做事，所以變數名稱不一定要一樣
// const f1 = require(__dirname + '/funciton01');

console.log('func02: ', f1(8));