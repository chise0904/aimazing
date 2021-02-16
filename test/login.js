
// var chai = require('chai')
// var chaiHttp = require('chai-http');
// var expect = chai.expect;
// var cookieParser = require('cookie-parser')

// chai.use(chaiHttp);

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
