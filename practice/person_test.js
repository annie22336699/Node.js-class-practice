const aaa=require('./person');
const {IdontKnowWhatisit}=require('./person');

const p2=new aaa.Person('peter',55);
const p3=new IdontKnowWhatisit('ShouldBeIt', 60);

console.log('p2：',p2);
console.log('引用person.js的f3：',aaa.f3(5));
console.log('p3',p3);
console.log(aaa.person===IdontKnowWhatisit);