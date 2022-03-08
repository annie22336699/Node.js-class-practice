const jwt= require('jsonwebtoken');

let t= jwt.sign({name:"john", age:26}, 'aa123456');
console.log(t);

let v = jwt.verify(t, 'aa123456')
console.log(v);

// 測試token