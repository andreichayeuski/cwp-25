# CWP/TASK/25 - HTTP2 / Encoding

function task00() {

Создаем на Github репозиторий cwp-25, клонируем его, открываем в IDE

Проверяем установленную версию nodejs, должна быть не ниже 9.х.х

Устанавливаем express и shrink-ray

}

function task01() {

Для HTTP2 сервера нам понадобится SSL-сертификат. Для лабораторнай работы достаточно будет самоподписанного

Идём на selfsignedcertificate.com и генеририуем сертификат для localhost

Скачаем полученные файлы и поместим их в папку проекта

}

function task02() {

Напишем простой HTTP2-сервер в файле http2.js

const http2 = require('http2');

const fs = require('fs');

const key = fs.readFileSync('localhost.key');

const cert = fs.readFileSync('localhost.cert');

const server = http2.createSecureServer(

  { key, cert },

  onRequest

);

function onRequest(req, res) {

  console.log(req.headers[':path']);

  res.stream.respond({

    'content-type': 'text/html',
    ':status': 200
  });

  res.stream.end('<h1>Hello World</h1>');

}

server.listen(8443);

Проверим его работу https://localhost:8443/. Из-за того, что наш сертификат самоподписанный браузер будет на него ругаться и просто так не пустит нас дальше. Необходимо явно выразить свои намерения. Например, в Chrome находим на странице ссылку "ADVANCED" и нажимаем "Proceed to localhost (unsafe)"

}

function task03() {

Создадим файлы public/index.html, public/site.css и public/app.js с произвольным содержимым. Подключим CSS и JS файлы к HTML

С помощью метода respondWithFile напишем раздачу этих файлов при помощи HTTP2. Для остальных запросов будем возвращать 404 ошибку

В файле http1.js реализуем раздачу статики через express

}

function task04() {

В public/index.html подключим 20 скриптов, например, можно подключить наш public/app.js с увеличивающимся query-параметром - app.js?v=1, app.js?v=2, ...


Сравним диаграммы сетевой загрузки HTTP1 и HTTP2 серверов (через инструменты разработчика в браузере)

}

function task05() {

С помощью метода pushStream напишем push CSS и JS файла при запросе /

Увидеть результат можно, например, в хроме во вкладке Network колонке Initiator

В версии Chrome 65 баг/фича запрещающая push с использованием недоверенного сертификата, поэтому работу фичи можно проверить с помощью chrome://net-internals/#http2. Подробнее в баг-трекере Chromium

}

function task06() {

Добавим какой-нибудь бесполезной логики в public/app.js чтобы общий размер файла составлял около 0.5Мб

С помощью shrink-ray для express включим поддержку сжатия

В файле downloader.js разработаем скрипт, который при помощи httt.request скачивает на диск ответы для 4 разных запросов: без компрессии, gzip (Accept-Encoding: gzip), deflate (Accept-Encoding: deflate) и brotli (Accept-Encoding: br)

}