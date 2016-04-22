var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});


var firstNames = ['Arron', 'Camron', 'Dion', 'Enzo', 'Hudson', 'Esha', 'Jada', 'Martyna', 'Rosin', 'Rowan'];
var lastNames = ['Vitre', 'Greve', 'Penhallow', 'Longford', 'Wetherington', 'Biswell',
                 'Arles', 'Bignall', 'Farrant', 'Hodder'];
var messages = ['Sign On', 'Sign Off', 'Invalid Password', 'Illegal IP Access'];

setInterval(function () {

    var firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    var lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    var message = messages[Math.floor(Math.random() * messages.length)];

    io.emit('security event', {
        name: firstName + ' ' + lastName,
        event: message,
        datetime: new Date().toString()
    });
}, 500);