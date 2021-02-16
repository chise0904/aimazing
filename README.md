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

