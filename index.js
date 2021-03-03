const express = require('express')
const session = require('express-session');
const bodyParser = require('body-parser')
// const formidable = require('express-formidable');
const FileStore = require('session-file-store')(session); // TODO: use redis instead
const app = express();
const errResp = require('./resp');
const errCode = require('./error-code');
// const dbc = require('./db')({ dbName: "example", table: "Bob\'s Store" });
const dbc = require('./mysqldb')({ dbName: "example", table: "Bob\'s Store" });
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const grpcServer = require("./grpcServer")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(formidable());
app.use(session({
    name: 'sessionid',
    secret: 'examplesecret',
    store: new FileStore(),
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 300 * 1000,
        httpOnly: false
    }
}));


const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Receipts database api",
            version: "0.1.0",
            description: "",
        },
        servers: [
            {
                url: "http://localhost:3001/",
            },
        ],
    },
    apis: ["./index.js"],
};

const specs = swaggerJsdoc(options);

app.use(
    "/apidoc",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);




//TODO: from DB
function checkUserAuth(name, password) {

    if (name == 'admin' && password == 'admin') {
        return { name: name }
    } else {
        return undefined
    }
}

 /**
 * @swagger
 * definitions:
 *  login:
 *    type: object
 *    properties:
 *      username:
 *        type: string
 *        description: user's name
 *      password:
 *        type: string
 *        description: user's password
 * 
 *  loginreturn:
 *    type: object
 *    properties:
 *      success:
 *        type: boolean
 * 
 *  loginerrorreturn:
 *    type: object
 *    properties:
 *      code:
 *        type: integer
 *      msg:
 *        type: string
 *      details:
 *        type: string
 * 
 * 
 * /:
 *   post:
 *      description: root for test description
 *      summary: root for test summary
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:      # Request body contents
 *              type: object
 *              properties:
 *                id:
 *                  type: integer
 *                name:
 *                  type: string
 *            examples:    # Child of media type
 *              Jessica:   # Example 1
 *                value:
 *                  id: 100
 *                  name: Jessica Smith
 *              Ron:       # Example 2
 *                value:
 *                  id: 11
 *                  name: Ron Stewart
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/loginreturn'
 *        403:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/loginerrorreturn'
 */
app.get('/', function (req, resp, next) {

    resp.json({ suceess: true});
});


app.get('/test', function(req, resp, next){


    dbc.test().then((res) => {
        // console.log(res.rows);
        resp.json(res);
    })
        .catch((error) => {
            console.log(error);
        })
})

 /**
 * @swagger
 * definitions:
 *  login:
 *    type: object
 *    properties:
 *      username:
 *        type: string
 *        description: user's name
 *      password:
 *        type: string
 *        description: user's password
 * 
 *  loginreturn:
 *    type: object
 *    properties:
 *      success:
 *        type: boolean
 * 
 *  loginerrorreturn:
 *    type: object
 *    properties:
 *      code:
 *        type: integer
 *      msg:
 *        type: string
 *      details:
 *        type: string
 * 
 * 
 * /login:
 *   post:
 *      description: log in to retrieve sessionid
 *      parameters:
 *      - name: ""
 *        type: object
 *        in: body
 *        required: true
 *        schema: 
 *          $ref: '#/definitions/login'
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/loginreturn'
 *        403:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/loginerrorreturn'
 */
app.post('/login', function (req, resp, next) {

    var session = req.session;
    var user = checkUserAuth(req.body.username, req.body.password);

    if (user) {
        req.session.regenerate(function (err) {
            if (err) {
                return resp.status(403).json(errResp("10001", errCode[10001], ""));
            }

            req.session.loginUser = user.name;
            req.session.save();

            resp.json({ success: true });
        });
    } else {
        resp.status(403).json(errResp("10001", errCode[10001], ""));
    }
});

 /**
 * @swagger
 * definitions: 
 *  logoutreturn:
 *    type: object
 *    properties:
 *      success:
 *        type: boolean
 * 
 *  logouterrorreturn:
 *    type: object
 *    properties:
 *      code:
 *        type: integer
 *      msg:
 *        type: string
 *      details:
 *        type: string
 * 
 * 
 * /logout:
 *   get:
 *      description: log in to retrieve sessionid
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/logoutreturn'
 *        403:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/logouterrorreturn'
 */
app.get('/logout', function (req, resp, next) {

    req.session.destroy(function (err) {
        if (err) {
            resp.status(500).json(errResp("10004", errCode[10004], "logout failed"));
            return;
        }

        req.session.loginUser = null;
        resp.clearCookie('sessionid');
        resp.json({ success: true });
    });
});



function checkAuth(req, resp, next) {

    console.log(req.headers);

    if (req.session.loginUser) {
        next();
    } else {
        // resp.redirect('/login');
        console.log('login first');
        resp.status(403).json(errResp("10003", errCode[10003], "login first"));
    }
}

 /**
 * @swagger
 * definitions:
 *  receipt:
 *    type: array
 *    items:
 *      type: object
 *      properties:
 *        receiptid:
 *          type: string
 *          description: receipt's id
 *        total:
 *          type: string
 *          description: amount of all items
 *        date:
 *          type: string
 *          description: receipt's date in 05-apr-2020 format
 *        time:
 *          type: string
 *          description: receipt's time in 19:51:46 format
 *        tags:
 *          type: string
 *          description: receipt's tags, separated by ","
 *  return:
 *    type: array
 *    items:
 *      type: object
 *      properties:
 *        receiptid:
 *          type: string
 *          description: receipt's id
 *
 * /receipts:
 *   post:
 *      description: Create receipts
 *      parameters:
 *      - name: ""
 *        type: array
 *        in: body
 *        required: true
 *        schema: 
 *          $ref: '#/definitions/receipt'
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/return'
 */
app.post('/receipts', function (req, resp, next) {

    dbc.setReceipts(req.body).then((res) => {
        // console.log(res);
        console.log(res.insertId);
        // resp.json(res);
    }).catch((error) => {
            console.log("/receipts error: ", error);
    })
});

 /**
 * @swagger
 * definitions:
 *  return2:
 *    type: object
 *    properties:
 *      tags:
 *        type: string
 *        description: receipt's tags
 * 
 * 
 * /receipts/{receiptid}:
 *   put:
 *      description: modify receipt's tags
 *      parameters:
 *      - name: "receiptid"
 *        in: path
 *        description: receipt's id
 *        required: true
 *        schema: 
 *          type: integer
 *      - name: "tags"
 *        in: query
 *        description: receipt's new tags
 *        required: true
 *        schema: 
 *          type: string
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/return2'
 */
// app.put('/receipt/:receiptid', checkAuth, function (req, resp, next) {

//     const receiptid = req.params.receiptid || "";
//     const tags = req.body.tags || "";

//     if (!receiptid.length) {
//         resp.status(400).json(errResp("10002", errCode[10002], "missing receiptid"));
//     } else {
//         dbc.updateReceipt({ receiptid: receiptid, tags: tags })
//             .then((res) => {
//                 console.log(res.rows);
//                 resp.json(res.rows);
//             })
//             .catch((error) => {
//                 console.log(error);
//             })
//     }
// });


app.put('/receipt/:receiptid', function (req, resp, next) {

    const receiptid = req.params.receiptid || "";
    const total = req.body.total || 0;

    if (!receiptid.length) {
        resp.status(400).json(errResp("10002", errCode[10002], "missing receiptid"));
    } else {
        dbc.updateReceipt({ receiptid: receiptid, total: total })
            .then((res) => {
                console.log(res);
                resp.json(res);
            })
            .catch((error) => {
                console.log(error);
            })
    }
});

 /**
 * @swagger
 * 
 * /receipts:
 *   get:
 *      description: get receipts by tags
 *      parameters:
 *      - name: "tags"
 *        in: query
 *        description: receipt's tags
 *        required: false
 *        schema: 
 *          type: string
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/receipt'
 * 
 */
app.get('/receipts', checkAuth, async function (req, resp, next) {
    const tags = req.query.tags || "";

    console.log("/receipts api");

    if (tags.length) {
        dbc.getReceipt(tags)
            .then((res) => {
                resp.json(res.rows);
            })
            .catch((error) => {
                console.log(error);
            })
    } else {
        dbc.getReceipts()
            .then((res) => {
                resp.json(res.rows);
            })
            .catch((error) => {
                console.log(error);
            })
    }
});


const server = app.listen(3001, () => console.log('listening on port 3001!'))
grpcServer();

module.exports = server;