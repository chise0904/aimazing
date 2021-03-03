const mysql = require("mysql")
const bluebird = require("bluebird")
const util = require("util")

exports = module.exports = CreateDBConnection;

function CreateDBConnection({dbName, table}) {

    var pool  = mysql.createPool({
        // connectionLimit : 10,
        host            : '172.17.0.3',
        user            : 'root',
        password        : '123456',
        database        : `${dbName}`
    })

    return new Table(pool, table)
}

function Table(pool, tbname) {
    this.pool = pool;
    this.table = tbname;
}

Table.prototype.test = async function test() {

    const table = this.table;

    // const connection = this.pool.getConnection();
    // db = Bluebird.promisifyAll(this.pool.query);
    const queryAsync  = util.promisify(this.pool.query).bind(this.pool);

    query = `SELECT * FROM \`${table}\``;

    return await queryAsync(query);

}

Table.prototype.setReceipts = async function setReceipts(datas) {
    
    let table = this.table

    const db  = bluebird.promisifyAll(this.pool);

    let query = `INSERT INTO \`${table}\` VALUES ?`
    
    let data = [];
    for (let i of datas) {
        data.push(Object.values(i));
    }

    try {
        return await db.queryAsync(query, [data]);
    } catch (error) {
        throw error;
    }
}

Table.prototype.updateReceipt = async function updateReceipt({ receiptid, total=0 }) {
    
    let table = this.table

    const db  = bluebird.promisifyAll(this.pool);

    if (!receiptid)
        throw new TypeError('missing receiptid')

    let query = `UPDATE \`${table}\` SET total = ? WHERE receiptid = ?`

    try {
        return await db.queryAsync(query, [total, receiptid]);
    } catch (error) {
        throw error;
    }
}
