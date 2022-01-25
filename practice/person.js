class Person{
    constructor(aaa='noname', bbb=0){
        this.name=aaa;
        this.age=bbb;
    }

    ccc(){
        return{
            ddd:this.name,
            eee:this.age,
        }
    }

    sayHello(){
        return `Hello ${this.name}`;
    }
}
console.log('引用person.js');
const f3 =a=>a*a;
module.exports= {Person,f3};

// const p1=new Person('John',26);

// console.log('天線寶寶說你好：',p1.sayHello());
// console.log('轉JSON檔01：',JSON.stringify(p1.ccc()));
// console.log('轉JSON檔02：',JSON.stringify(p1));
