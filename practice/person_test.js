const aaa=require('./person');
const {Person}=require('./person');
const {f3}=require('./person');
// {}←這裡的內容需要參照引用的js檔內的module.exports輸出的內容值，不然會出問題

const p2=new aaa.Person('peter',55);
const p3=new Person('ShouldBeIt', 60);

console.log('p2：',p2);
console.log('f3：',f3(7));
console.log('引用person.js的f3：',aaa.f3(5));
console.log('p3',p3);
console.log(aaa.Person===Person);