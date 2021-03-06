const pool = require("../config/pool");
class Citizen {
    // constructor(id_citizen, quiz_id, answer) {
    //     this.id_citizen = id_citizen;
    //     this.quiz_id = quiz_id;
    //     this.answer = answer;
    // }

    // static create(citizen = {}) {
    //     return new this(
    //         citizen.id_citizen,
    //         citizen.quiz_id,
    //         citizen.answer
    //     );
    // }

    // static async findOne(citizen = {}) {
    //     //console.log(user);
    //     let qry = null;
    //     if (citizen.id)
    //         qry = `SELECT * FROM answer where id = ${citizen.id}`;
    //     if (citizen.id_citizen)
    //         qry = `SELECT * FROM answer where id_citizen = ${citizen.id_citizen}`;
    //     if (citizen.quiz_id)
    //         qry = `SELECT * FROM answer where address_code = ${citizen.quiz_id}`;
    //     try {
    //         const [rows, fields] = await pool.query(qry);
    //         if (rows.length == 1) {
    //             return this.create(rows[0]);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    //     return null;
    // }

    // Check {id_citizen, quiz_id} trùng nhau
    // async checkDuplicate() {
    //     const qry = "SELECT id_citizen, quiz_id FROM answer where id_citizen=? and quiz_id=?";
    //     try {
    //         const [rows, fields] = await pool.execute(qry, [
    //             this.id_citizen,
    //             this.quiz_id,
    //         ]);
    //         if (rows.length == 1) return true;
    //     } catch (error) {
    //         console.log(error);
    //     }

    //     return false;
    // }

    static async findIdCitizen(id) {
        const qry = `SELECT * FROM citizen where id = ${id}`;
        try {
            const [rows, fields] = await pool.query(qry);
            if (rows.length == 1) {
                return true;
            }
        } catch (error) {
            console.log(error);
        }

        return false;
    }

    // nhập liệu
    static async inputData(
        fullname,
        dateofbirth,
        gender,
        CMND,
        countryside,
        permantlyaddress,
        tempaddress,
        religion,
        academiclevel,
        job,
        addressCode
    ) {
        const qry = `INSERT INTO citizen(fullname, dateofbirth, gender, CMND, countryside, permantlyaddress, 
                     tempaddress, religion, academiclevel, job, address_code) VALUES(?,?,?,?,?,?,?,?,?,?, ?)`;
        try {
            const [rows, fields] = await pool.query(qry, [
                fullname,
                dateofbirth,
                gender,
                CMND,
                countryside,
                permantlyaddress,
                tempaddress,
                religion,
                academiclevel,
                job,
                addressCode,
            ]);
            return rows;
        } catch (error) {
            console.log(error);
        }

        return null;
    }

    static async editData(
        id,
        fullname,
        dateofbirth,
        gender,
        CMND,
        countryside,
        permantlyaddress,
        tempaddress,
        religion,
        academiclevel,
        job
    ) {
        const qry = `UPDATE citizen SET fullname=?, dateofbirth=?, gender=?, CMND=?, countryside=?,
                     permantlyaddress=?, tempaddress=?, religion=?, academiclevel=?, job=? WHERE id=?`;
        try {
            const [rows, fields] = await pool.query(qry, [
                fullname,
                dateofbirth,
                gender,
                CMND,
                countryside,
                permantlyaddress,
                tempaddress,
                religion,
                academiclevel,
                job,
                id,
            ]);
            return true;
        } catch (error) {
            return false;
        }
    }

    static async delData(id) {
        const qry = `DELETE FROM citizen WHERE id=?`;
        try {
            const [rows, fields] = await pool.query(qry, [id]);
            if (rows.length == 1) return true;
        } catch (error) {}
        return false;
    }

    static async getCitizenList() {
        const sql = `SELECT * FROM citizen c`;
        try {
            const [rows, fields] = await pool.query(sql);
            //console.log(rows);
            if (rows.length > 0) {
                return rows;
            }
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    //Lấy ra thông tin người dân trên 1 tỉnh
    static async getCitizenListFromProvince(provinceCode) {
        const sql = `SELECT * FROM citizen c
                    WHERE address_code LIKE ?`;
        try {
            const [rows, fields] = await pool.query(sql, [provinceCode + "%"]);
            console.log(provinceCode);
            console.log(rows);
            if (rows.length > 0) {
                return rows;
            }
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    //Lấy ra thông tin số người trong 1 tỉnh
    static async getCitizenListCateByProvince(id) {
        const sql = `SELECT COUNT(*) as number FROM citizen WHERE address_code LIKE ?`;
        try {
            const [rows, fields] = await pool.query(sql, [id + "%"]);
            if (rows.length > 0) {
                return rows[0].number;
            }
        } catch (error) {
            console.log(error);
        }
        return -1;
    }

    //Lấy ra số người giới tính nam, giới tính nữ
    static async getCitizenListCateByGender(id) {
        const sql = `SELECT COUNT(case when gender = 'Nam' then 1 end) as Male, 
                    COUNT(case when gender = 'Nữ' then 1 end) as Female 
                    from citizen WHERE address_code LIKE ?`;
        try {
            const [rows, fields] = await pool.query(sql, [id + "%"]);
            if (rows.length > 0) {
                return rows;
            }
        } catch (error) {
            console.log(error);
        }
        return -1;
    }

    //Lấy ra số người trong các độ tuổi từ 0-12: child, 12-18: teenager, 18-25: pre adult, 25-40: young adult,
    //40-50: adult, 50-60: pre old, 60+: old
    static async getCitizenListCateByAged(id) {
        const sql = `select count(case when (select birthday(id)) between 0 and 12 THEN 1 end) as child,
                    count(case when (select birthday(id)) between 12 and 18 THEN 1 end) as teenager,
                    count(case when (select birthday(id)) between 19 and 25 THEN 1 end) as pre_adult,
                    count(case when (select birthday(id)) between 26 and 40 THEN 1 end) as adult,
                    count(case when (select birthday(id)) between 41 and 50 THEN 1 end) as pre_old,
                    count(case when (select birthday(id)) between 51 and 60 THEN 1 end) as old_age
                    from citizen
                    where address_code LIKE ?`;
        try {
            const [rows, fields] = await pool.query(sql, [id + "%"]);
            if (rows.length > 0) {
                return rows;
            }
        } catch (error) {
            console.log(error);
        }
        return -1;
    }

    //Lấy ra số người đã tốt nghiệp bậc thpt, đã tốt nghiệp bậc thcs, chưa tốt nghiệp
    static async getCitizenListCateByAcademicLevel(id) {
        const sql = `select count(case when academiclevel < 9 then 1 end) as notGra,
                    count(case when academiclevel between 9 and 11 then 1 end) as secondGra,
		            count(case when academiclevel = 12 then 1 end) as thirdGra
                    from citizen
                    where address_code LIKE ?`;
        try {
            if (id !== "0") {
                const [rows, fields] = await pool.query(sql, [id + "%"]);
                if (rows.length > 0) {
                    return rows;
                }
            } else {
                const [rows, fields] = await pool.query(sql, ["%"]);
                if (rows.length > 0) {
                    return rows;
                }
            }
        } catch (error) {
            console.log(error);
        }
        return -1;
    }

    //Lấy thông tin của 1 người dân bất kỳ
    static async getCitizenInfo(citizenid) {
        const sql = `SELECT * FROM citizen c
                    WHERE id = ?`;
        try {
            const [rows, fields] = await pool.query(sql, [citizenid]);
            //console.log(citizenid);
            console.log(rows);
            if (rows.length > 0) {
                return rows[0];
            }
        } catch (error) {
            console.log(error);
        }
        return null;
    }
}

module.exports = Citizen;

// Thêm function này vào database
// use test;

// delimiter //

// create function birthday(citizen INT)
// returns INT
// reads sql data
// BEGIN
// 	declare tmp INT;
//     select floor(datediff(curdate(), (select answer from test.answer WHERE quiz_id = 2 and id_citizen = citizen)) / 365.242199) into tmp;
//     return tmp;
// END //

// delimiter ;
