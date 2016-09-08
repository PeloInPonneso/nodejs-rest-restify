// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var restify = require('restify');

var server = restify.createServer();
 
server
    .use(restify.fullResponse())
    .use(restify.bodyParser({ mapParams: false }));

var port = process.env.PORT || 8080;        // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/NODE_API');
var User       = require('./app/models/user');

// ROUTES FOR OUR API
// =============================================================================

// more routes for our API will happen here

    // create a user (accessed at POST http://localhost:8080/api/users)
    server.post("/api/users", function(req, res) {
        
        var user = new User();      // create a new instance of the Bear model
        user.username = req.body.username;  // set the users username (comes from the request)
        user.firstName = req.body.firstName;  // set the users firstName (comes from the request)
        user.lastName = req.body.lastName;  // set the users lastName (comes from the request)
        user.email = req.body.email;  // set the users email (comes from the request)
        // save the bear and check for errors
        user.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'User created!' });
        });
        
    });
    // get all the users (accessed at GET http://localhost:8080/api/users)
    server.get("/api/users", function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });
    });

// on routes that end in /bears/:bear_id
// ----------------------------------------------------

    // get the user with that id (accessed at GET http://localhost:8080/api/users/:user_id)
    server.get("/api/users/:user_id", function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    });

    // update the user with this id (accessed at PUT http://localhost:8080/api/users/:user_id)
    server.put("/api/users/:user_id", function(req, res) {

        // use our user model to find the user we want
        User.findById(req.params.user_id, function(err, user) {

            if (err)
                res.send(err);

	    user.username = req.body.username;  // update the users username (comes from the request)
            user.firstName = req.body.firstName;  // update the users firstName (comes from the request)
            user.lastName = req.body.lastName;  // update the users lastName (comes from the request)
            user.email = req.body.email;  // update the users email (comes from the request)
            // save the user
            user.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'User updated!' });
            });

        });
    });

    // delete the user with this id (accessed at DELETE http://localhost:8080/api/users/:user_id)
    server.del("/api/users/:user_id", function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });



// START THE SERVER
// =============================================================================
server.listen(port, function (err) {
    if (err)
        console.error(err)
    else
        console.log('App is ready at : ' + port)
})
 
if (process.env.environment == 'production')
    process.on('uncaughtException', function (err) {
        console.error(JSON.parse(JSON.stringify(err, ['stack', 'message', 'inner'], 2)))
    })
console.log('Magic happens on port ' + port);
