const { Pool, Client } = require('pg')
const format = require('pg-format');
const pgp = require('pg-promise')();

const util = require('./util')

exports = module.exports = createDBConnection;

// {dbName: "exampleDB", table: "exampleTable"}
function createDBConnection({ dbName, table }) {

    const config = {
        host: '172.17.0.2',
        port: 5432,
        database: `${dbName}`,
        user: '12345',
        password: '12345',
    };

    const db = new Pool(config);

    return new Table(db, table);
}

function Table(db, table) {
    this.db = db
    this.table = table
}

Table.prototype.setReceipts = async function setReceipts(datas) {
    const db = this.db
    let table = this.table

    const values = util.toPostgreValues(datas);

    table = new pgp.helpers.TableName({table: table, schema: 't'});
    console.log(table);

    let query = format(`INSERT INTO ${table} VALUES %L returning receiptid`, values);

    try {
        return await db.query(query);
    } catch (error) {
        throw error;
    }

}

Table.prototype.updateReceipt = async function updateReceipt({ receiptid, tags = "" }) {
    const db = this.db
    let table = this.table

    if (!receiptid)
        throw new TypeError('missing receiptid')

    const mtags = util.tagsString2ptagsArray(tags);

    table = new pgp.helpers.TableName({table: table, schema: 't'});
    let query = `UPDATE ${table} SET tags = ${mtags} WHERE receiptid = '${receiptid}' returning tags`;

    try {
        return await db.query(query);
    } catch (error) {
        throw error;
    }
}


Table.prototype.getReceipt = async function getReceipt(conds) {

    if (typeof conds !== 'string')
        throw new TypeError('argument must be object type');

    try {
        return await getReceiptBy(this, conds)
    } catch (error) {
        throw error;
    }
}

Table.prototype.getReceipts = async function getReceipts() {

    try {
        return await getReceiptBy(this, '')
    } catch (error) {
        throw error;
    }
}

function getReceiptBy(self, conds) {
    const db = self.db
    var table = self.table


    table = new pgp.helpers.TableName({table: table, schema: 't'});
    console.log(table);

    if (!conds.length) {

        return db.query(`SELECT * FROM ${table}`)

    } else {

        tags = util.tagsString2ptagsArray(conds);
        let query = `SELECT * FROM ${table} WHERE tags @> ${tags}`;
     
        return db.query(query)
    }
}
