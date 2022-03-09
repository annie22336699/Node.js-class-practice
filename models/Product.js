require('dotenv').config();
const db = require('../modules/connect-db');

class Product {

    constructor(data={}){
        //  sid, author, bookname, category_sid, book_id, publish_date, pages, price, isbn, on_sale, introduction
        // TODO: 哪些是必要的欄位
        const defaultData = {
            author: '',
            bookname: '', 
            category_sid: 4,
            book_id: '', 
            publish_date: '1970-01-01', 
            pages: 0, 
            price: 0, 
            isbn: '', 
            on_sale: 1, 
            introduction: ''
        }
        this.data = {...defaultData, ...data};
    }

    // 新增 C
    async save() {
        const [result] = await db.query('INSERT INTO `products` SET ?', [this.data]);
        // console.log(result);

        // 儲存新增的sid
        this.data.sid = result.insertId;

        return {
            success: !! result.insertId, 
            insertId: result.insertId, 
            instance: this, 
        }
    }

    // 修改 U
    async update(modi={}) {
        const pk = this.data.sid;
        if(!pk){
            return {success: false}
        }

        const data = {...this.data, ...modi};
        delete data.sid;
        const [result] = await db.query(`UPDATE products SET ? WHERE sid=?`,[data, pk]);
        
        console.log(result);
        return {success: !!result.affectedRows};
    }

    // 刪除 D
    async remove(){
        const pk = this.data.sid;
        if(!pk){
            return {success: false};
        }
        
        const [result]=await db.query(`DELETE FROM products WHERE sid=?`, [pk]);

        delete this.data.sid;
        console.log(result);
        return {success: !! result.affectedRows};
    }

    // 呈現資料
    static async findOne(pk){
        pk= parseInt(pk);

        if(isNaN(pk) || !pk){
            throw new Error ('沒有主鍵');
            return null; 
        }
        
        const [rs]= await db.query(`SELECT * FROM products WHERE sid=${pk}`);
        if(! rs.length){
            return null;
        }

        return new Product({...rs[0]})
    }


}

module.exports = Product;