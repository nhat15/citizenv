const sql = require("../config/pool");
class Area {
    constructor(addressCode, name) {
        this.addressCode = addressCode;
        this.name = name;
    }
    async checkIfAddressCodeExists() {
        console.log("checke1");
        const qry = `SELECT id FROM area where id= ?`;
        try {
            console.log("checke2");
            const [rows, fields] = await pool.query(qry, [this.addressCode]);
            console.log("checke3");
            if (rows.length == 1) return true;
        } catch (error) {
            console.log(error);
        }
        console.log("checke4");
        return false;
    }
    async checkIfNameExists() {
        const qry = `SELECT name FROM area where name= ?`;
        try {
            const [rows, fields] = await pool.query(qry, [this.name]);
            if (rows.length == 1) return true;
        } catch (error) {
            console.log(error);
        }
        return false;
    }

    async createProvince() {
        const qry = `INSERT INTO area(address_code, name) VALUES(?,?)`;
        try {
            const [rows, fields] = await pool.query(qry, [
                this.addressCode,
                this.name,
            ]);
            return rows;
        } catch (error) {
            return error;
        }
    }
    static async findOne(user = {}) {
        console.log(user);
        let qry = null;
        if (user.username)
            qry = `SELECT * FROM users where username = "${user.username}"`;
        if (user.id) qry = `SELECT * FROM users where id = ${user.id}`;
        if (user.address_code)
            qry = `SELECT * FROM users where address_code = ${user.address_code}`;
        try {
            const [rows, fields] = await pool.query(qry);
            console.log(rows.length);
            if (rows.length == 1) {
                return this.create(rows[0]);
            }
        } catch (error) {
            console.log(error);
        }
        return null;
    }
    // check if belongto
    // check role this.addresscode.length >= addressCode.length ko quyen
    // lay this.addressCode.length slice so sanh neu hai chuoi trung nhau thi co quyen
    // 11; 1122->11
    checkIfBelongTo() {}

    //
}
module.exports = Area;
