const http2 = require('http2');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

const key = fs.readFileSync('./20665488_localhost.key');
const cert = fs.readFileSync('./20665488_localhost.cert');

const {HTTP2_HEADER_PATH} = http2.constants;
const server = http2.createSecureServer(
	{ key, cert },
	onRequest
);

function onRequest(req, res) {
	console.log(req.headers[':path']);

	const filePath = path.join('./public', req.headers[':path']);
	switch(req.headers[':path']) {
		case '/index.html': {
			push(req.stream, 'site.css');
			push(req.stream, 'app.js');
			for (var i = 1; i < 21; i++)
			{
				push(req.stream, 'app' + i + '.js');
			}

			req.stream.respondWithFile(filePath,
				{'content-type': mime.getType(filePath)});
			break;
		}
		case '/site.css':
		case '/app.js': {
			req.stream.respondWithFile(filePath,
				{'content-type': mime.getType(filePath)});
			break;
		}
		default:
		{
			res.stream.respond({
				'content-type': 'text/html',
				':status': 404
			});

			res.stream.end('<h1>Not found</h1>');
		}
	}
}

function push(stream, filePath) {
	const fullResourcePath = path.join('./public', filePath);
	const {descriptor, headers} = getFileInfo(fullResourcePath);
	const pushHeaders = {[HTTP2_HEADER_PATH]: '/' + filePath};

	stream.pushStream(pushHeaders, (err, pushStream) => {
		pushStream.respondWithFD(descriptor, headers)
	});
}

function getFileInfo(filePath) {
	const descriptor = fs.openSync(filePath, 'r');

	const stat = fs.fstatSync(descriptor);
	const contentType = mime.getType(filePath);

	return {
		descriptor,
		headers: {
			'content-length': stat.size,
			'last-modified': stat.mtime.toUTCString(),
			'content-type': contentType
		}
	}
}

server.listen(8443, 'localhost', () => {
	console.log('Server is running');
});