
var chai = require('chai')
var chaiHttp = require('chai-http');
var expect = chai.expect;
var cookieParser = require('cookie-parser')

chai.use(chaiHttp);

describe('api test', function () {

    var server;
    before(function (done) {
        server = require('../index');
        done();
    });
    after(function () {
        server.close();
    });

    // upload some datas
    it('POST /receipts', function (done) {

        const agent = chai.request.agent(server)
        agent.post('/login')
            .send({ username: 'admin', password: 'admin' })
            .then(function (res) {

                cookie = res.headers['set-cookie'].pop().split(';')[0];

                console.log('cookie: ', cookie)

                return agent.post('/receipts')
                    .set('Cookie', cookie)
                    .send([
                        {"receiptid":"11111","total":"11.11","date":"05-apr-2020", "time": "11:11:11","tags":"test, vip"},
                        {"receiptid":"22222","total":"222.22","date":"06-apr-2020", "time": "11:22:22","tags":"test, canceled"},
                        {"receiptid":"33333","total":"3333.3","date":"07-apr-2020", "time": "11:33:33","tags":"test, vip, canceled"},
                        {"receiptid":"44444","total":"4.4","date":"08-apr-2020", "time": "11:44:44","tags":"test"},
                        {"receiptid":"55555","total":"5.55","date":"09-apr-2020", "time": "11:55:55","tags":"test"},
                    ])
                    .then(function (res) {
                        console.log("POST /receipts \n", res.body);
                        expect(res).to.have.status(200);
                        done();
                    })
            })
    })


    // get all receipts 
    it('GET /receipts', function (done) {

        const agent = chai.request.agent(server)
        agent.post('/login')
            .send({ username: 'admin', password: 'admin' })
            .then(function (res) {

                cookie = res.headers['set-cookie'].pop().split(';')[0];

                console.log('cookie: ', cookie)

                return agent.get('/receipts')
                    .set('Cookie', cookie)
                    .then(function (res) {
                        console.log("GET /receipts \n", res.body);
                        expect(res).to.have.status(200);
                        done();
                    })
            })
    })


    // get all receipts with tags = 'vip'
    it('GET /receipts?tags=vip', function (done) {

        const agent = chai.request.agent(server)
        agent.post('/login')
            .send({ username: 'admin', password: 'admin' })
            .then(function (res) {

                cookie = res.headers['set-cookie'].pop().split(';')[0];

                return agent.get('/receipts?tags=vip')
                .then(function (res) {
                    expect(res).to.have.status(200);
                    console.log("GET /receipts?tags=vip \n", res.body);
                    done();
                })
            })
    })

    // set 92737's tag to '' 
    it('PUT /receipt/92737 without tags', function (done) {

        const agent = chai.request.agent(server)
        agent.post('/login')
            .send({ username: 'admin', password: 'admin' })
            .then(function (res) {

                cookie = res.headers['set-cookie'].pop().split(';')[0];

                return agent.put('/receipt/92737')
                .then(function (res) {
                    console.log("PUT /receipt/92737 without tags\n", res.body);
                    expect(res).to.have.status(200);
                    done();
                })
            })
    })

    // set 92737's tag to 'vvvip' 
    it('PUT /receipt/92737 with tags=vvvip', function (done) {

        const agent = chai.request.agent(server)
        agent.post('/login')
            .send({ username: 'admin', password: 'admin' })
            .then(function (res) {

                cookie = res.headers['set-cookie'].pop().split(';')[0];

                return agent.put('/receipt/92737')
                .send({ tags: 'vvvip' })
                .then(function (res) {
                    console.log("PUT /receipt/92737 with tags=vvvip \n", res.body);
                    expect(res).to.have.status(200);
                    done();
                })
            })
    })
});


// describe('login test', function () {

//     var server;
//     var agent;
//     before(function () {
//         server = require('../index');
//         agent = chai.request.agent(server)
//     });
//     after(function () {
//         server.close();
//     });

//     it('/login with existed username', function () {
//         agent.post('/login')
//             .send({ username: 'admin', password: 'admin' })
//             .then(function (res) {

//                 console.log('/login', res.body);

//                 var cookie = res.headers['set-cookie'].pop().split(';')[0];
//                 console.log(cookie);

//             })
//     })

//     it('/login with non existed username', function () {
//         agent.post('/login')
//             .send({ username: 'john', password: 'johnpass' })
//             .then(function (res) {

//                 // body: { ret_code: 1, ret_msg: '账号或密码错误' },
//                 console.log(res.body);

//                 const cookieStr = res.headers["set-cookie"][0];
//                 console.log(cookieStr);
//             })
//     })
// });
