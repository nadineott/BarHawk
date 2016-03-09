var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/../client'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var storedBarLogin = {
  username: 'admin',
  password: 'fancypants'
};

app.post('/api/barUsers/barSignin', function(req, res, next) {
  var attemptedBarUsername = req.body.username;
  var attemptedBarPassword = req.body.password;
  if(attemptedBarUsername === storedBarLogin.username && attemptedBarPassword === storedBarLogin.password) {
    res.json({});
  } else {
    return next(new Error('Incorrect username or password.'));
  }
});

app.get('/api/barUsers/barQueue', function(req, res) {
  res.status = 200;
  res.send(ordersArray);
});

app.listen(port, function() {
  console.log('Server now listening on port ' + port);
});

//userbase dummy data
var users = {
  Michael: {
    password: "password",
    age: '25',
    weight: 160,
    gender: "Male",
    drinkCount: 0,
    totalPrice: 0
  }
};

app.post('/api/users/signup', function(req, res) {
  console.log("user info", req.body);
  var data = req.body;
  if(data.username in users) {
    res.sendStatus(401);
  } else {
    users[data.username] = data;
    console.log("all users", users);
    res.sendStatus(200);
  }

});

//barQueue dummy data
var ordersArray = [{
  username: 'zeebow',
  drinkType: 'beer',
  time: 'Tue Mar 08 2016 16:24:37 GMT-0800 (PST)',
  closeout: false,
  currentPrice: 5,
  totalPrice: 60
}, {
  username: "Nadine",
  drinkType: "beer",
  time: 'Tue Mar 08 2016 17:24:37 GMT-0800 (PST)',
  closeout: false,
  currentPrice: 5,
  totalPrice: 100,
  drinkCount: 4
}, 
{
  username: "Collin",
  drinkType: "wine",
  time: 'Tue Mar 08 2016 18:24:37 GMT-0800 (PST)',
  closeout: false,
  currentPrice: 5,
  totalPrice: 15,
  drinkCount: 8
}];

app.post('/api/customer/order', function(req, res) {
  //assigning drink order to varible
  var ord = req.body;
  //if no username or drink was not specified, throw err
  if (ord.username === undefined || ord.drinkType === undefined) {
    res.sendStatus(400);
  } else {
    //increment user's drinkCount
    users[ord.username].drinkCount++;
    //recalculate user's tab
    users[ord.username].totalPrice += ord.currentPrice;
    //prepare order with pertinent user information for bar queue
    var newOrder = {
      username: ord.username,
      drinkType: ord.drinkType,
      time: ord.time,
      closeout: ord.closeout,
      currentPrice: ord.currentPrice,
      totalPrice: users[ord.username].totalPrice,
      drinkCount: users[ord.username].drinkCount
    };
    //push order to bar queue
    ordersArray.push(newOrder);
    res.sendStatus(200);
  }
});

  app.post('/api/barUsers/barQueue/dequeue', function(req, res) {
    console.log("req.body.orderToBeDequeued ", req.body.orderToBeDequeued);
    ordersArray.splice(req.body.orderToBeDequeued, 1);
    res.sendStatus(200);
  });

