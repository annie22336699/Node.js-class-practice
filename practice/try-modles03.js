const Product = require('./../models/Product');

let p3;
(async ()=>{
    // 新增並修改作者
    p3 = new Product({author:'david', bookname:'教你如何讀一本書'});
    console.log(await p3.save());
    console.log(await p3.update({author:'林大明'}));
    console.log(p3);

    process.exit();
})();
