var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);
    dl = require('../../lib/delivery.server'),
    fs  = require('fs');
    path= require('path');
    server.listen(2000);
    console.log("server has started");
    
    app.use(express.static(path.join(__dirname, 'public')));
    app.get('/',function(req,res){
      res.sendFile(path.join(__dirname +'/public/index.html'));
      //__dirname : It will resolve to your project folder.
    });

io.sockets.on('connection', function(socket){
  console.log("here is the socket",socket.id);
  var delivery = dl.listen(socket);
  delivery.on('receive.start',function(filePackage){
    console.log("started receieving",filePackage.name);
  });
  delivery.on('receive.success',function(file){
      io.sockets.emit('addImage','file sent from server',file.name);
    fs.writeFile(__dirname + '/public/'+ file.name,file.buffer, function(err){
      if(err){
        console.log('File could not be saved.');
      }else{
        console.log('File saved.');
      };
    });
  });
});