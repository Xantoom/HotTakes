//----Importe the package http of Node ((qui nous permet de créer un serveur ensuite))
const http = require('http');

//---Importe the application
const app = require('./app');
app.set('port', process.env.PORT || 3000);//---app have to turn in porte 3000

//----Create a server
const server = http.createServer(app);

//-----The server have to lesten the respose(res) and requeste(req) that had sended buy the server 
server.listen(process.env.PORT || 3000);
