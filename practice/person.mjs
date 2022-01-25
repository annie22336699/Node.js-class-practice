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
console.log('引用person.mjs');
const f4 =a=>a*a;
export const f5 =a=>a+a;

export {f4};   // 這個可以有很多個，但要引用的話需要用{}包起來，詳情參見_test.mjs
export default Person;  // 這個只能有一個