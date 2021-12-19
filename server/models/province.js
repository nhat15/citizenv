const sql = require("../config/pool");
class Province {
    constructor(addressCode, name) {
        this.addressCode = addressCode;
        this.name = name;
    }
    async checkIfAddressCodeExists() {
        console.log("checke1");
        const qry = `SELECT id FROM province_a2 where id= ?`;
        try {
            console.log("checke2");
            const [rows, fields] = await sql.query(qry, [this.addressCode]);
            console.log("checke3");
            if (rows.length == 1) return true;
        } catch (error) {
            console.log(error);
        }
        console.log("checke4");
        return false;
    }
    async checkIfNameExists() {
        const qry = `SELECT name FROM province_a2 where name= ?`;
        try {
            const [rows, fields] = await sql.query(qry, [this.name]);
            if (rows.length == 1) return true;
        } catch (error) {
            console.log(error);
        }
        return false;
    }
    async createProvince() {
        const qry = `INSERT INTO province_a2(id, name) VALUES(?,?)`;
        try {
            const [rows, fields] = await sql.query(qry, [
                this.addressCode,
                this.name,
            ]);
            return rows;
        } catch (error) {
            return error;
        }
    }
    // check if belongto
    // check role this.addresscode.length >= addressCode.length ko quyen
    // lay this.addressCode.length slice so sanh neu hai chuoi trung nhau thi co quyen
    // 11; 1122->11
    checkIfBelongTo() {}

    //
}
module.exports = Province;
