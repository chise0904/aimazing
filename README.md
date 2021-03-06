# aimazing

# ER diagram
ER diagram.png

# api doc
use swagger

http://127.0.0.1:3001/apidoc

# postgreSQL


    # docker run --name postgres -e POSTGRES_PASSWORD=12345 -e POSTGRES_USER=12345 -d -p 5432:5432 postgres
    # docker exec -it postgres psql -U 12345

    # CREATE DATABASE example;
    # \c example;
    # CREATE SCHEMA t;
    # CREATE TABLE IF NOT EXISTS t."Bob's Store" ( 
        receiptid varchar PRIMARY KEY, 
        total decimal(15,6) NOT NULL, 
        date date NOT NULL, 
        time time NOT NULL, 
        tags text[]
    );
    # INSERT INTO t."Bob's Store"(receiptid, total, date, time, tags) VALUES(87450, 50.06, '05-apr-2020', '08:48:04','{"vip","canceled"}');
    # INSERT INTO t."Bob's Store"(receiptid, total, date, time, tags) VALUES(92737, 42.70, '14-apr-2020', '19:51:46','{"vip"}');
    # INSERT INTO t."Bob's Store"(receiptid, total, date, time, tags) VALUES(98260, 4.40, '25-apr-2020', '11:26:45','{"vip"}');
    # INSERT INTO t."Bob's Store"(receiptid, total, date, time, tags) VALUES(100792, 12.40, '30-apr-2020', '11:46:40','{}');
    # INSERT INTO t."Bob's Store"(receiptid, total, date, time, tags) VALUES(122769, 53.40, '13-jun-2020', '20:11:09','{"canceled"}');

#### test data


    PUT http://127.0.0.1:3001/receipt/44444
    {"serialnumber":"44444","tags":""}

# MySQL

    # docker run -p 3306:3306 -e MYSQL\_ROOT\_PASSWORD=123456 -d mysql
    # docker exec -it d38ca5f9446d mysql -u root -p123456

    # CREATE DATABASE example;
    # CREATE TABLE IF NOT EXISTS `Bob's Store` ( 
        receiptid varchar(255) PRIMARY KEY, 
        total decimal(15,6) NOT NULL, 
        date date NOT NULL, 
        time time NOT NULL
    )ENGINE=INNODB;
    # INSERT INTO `Bob's Store` (receiptid, total, date, time) VALUES('87450', 50.06, '2020-05-05', '08:48:04');
    # INSERT INTO `Bob's Store` (receiptid, total, date, time) VALUES('92737', 42.70, '2020-04-14', '19:51:46');
    # INSERT INTO `Bob's Store` (receiptid, total, date, time) VALUES('98260', 4.40, '2020-04-25', '11:26:45');
    # INSERT INTO `Bob's Store` (receiptid, total, date, time) VALUES('100792', 12.40, '2020-04-30', '11:46:40');
    # INSERT INTO `Bob's Store` (receiptid, total, date, time) VALUES('122769', 53.40, '2020-07-13', '20:11:09');

#### test data

    [
        {"receiptid":"11223","total":"55.45","date":"1999-06-23", "time": "02:11:15"},
        {"receiptid":"33211","total":"35.5","date":"1998-06-23", "time":"12:10:35"},
        {"receiptid":"33445","total":"51.43","date":"1939-06-23", "time":"19:40:25"}
    ]


# gRPC server

    client: nodejs_grpc_client project





