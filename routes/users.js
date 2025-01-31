var Users = require('../models/users.js');

module.exports = function (router) {

    var userRoute = router.route('/users');

    // add a new user to MongoDB collection
    userRoute.post(async function (req, res) {

        try {

            // make sure username does not already  exist
            const query = Users.find({ username: req.body.username });
            const results = await query.exec();

            if (results.length > 0) {
                res.status(400).json({
                    message: 'Username already exists',
                    data: null,
                });
            }
            else {
                const user = new Users(req.body);
                const result = await user.save();
                res.status(201).json({
                    message: 'User added',
                    data: result,
                });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Internal Server Error',
                data: null,
            });
        }
    });

    // get user matching id
    router.route('/users/:id').get(function (req, res) {
        Users.findById(req.params.id, function (_error, result) {
            if (result) {
                return res.status(200).send({
                    message: 'OK',
                    data: result
                });
            }
            return res.status(404).send({
                message: 'No User Found',
                data: []
            });
        })
            .catch(function (_error) {
                return res.status(500).send({
                    message: 'Server Error',
                    data: []
                });
            });
    })

    // get all users from MongoDB collection
    userRoute.get(async function (req, res) {

        try {
            var whereOption = req.query.where;
            var sortOption = req.query.sort;
            var selectOption = req.query.select;
            var skipOption = req.query.skip;
            var limitOption = req.query.limit;
            // var countOption = req.query.count;

            var query = Users
                .find(eval("(" + whereOption + ")"))
                .sort(eval("(" + sortOption + ")"))
                .select(eval("(" + selectOption + ")"))
                .skip(eval("(" + skipOption + ")"))
                .limit(eval("(" + limitOption + ")"))

            const results = await query.exec();

            res.status(200).json({
                message: 'OK',
                data: results,
            });

        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Internal Server Error',
                data: null,
            });
        }
    });

    // modify user information
    router.route('/users/:id').put(function (req, res) {
        Users.findById(req.params.id, function (_error, user) {
            if (user == null) {
                return res.status(404).send({
                    message: 'No User Found',
                    data: []
                })
            }

            if (!('postings' in req.body) | !('liked' in req.body) | !('interested' in req.body)
                | !('email' in req.body) | !('username' in req.body)
                | !('firebase_id' in req.body)) {
                return res.status(400).send({
                    message: 'Missing Required Fields',
                    data: []
                });
            }


            // Should not be changed directly
            user.postings = req.body.postings
            user.liked = req.body.liked
            user.interested = req.body.interested
            user.firebase_id = req.body.firebase_id

            // Can be changed
            user.email = req.body.email
            user.username = req.body.username
            user.save()

            return res.status(200).send({
                message: 'User Modified',
                data: []
            })
        })
            .catch(function (_error) {
                return res.status(500).send({
                    message: 'Server Error',
                    data: []
                });
            });
    })

    // get users's list of interested sublets
    router.route('/interestedSublets/:id').get(async function (req, res) {
        Users.findById(req.params.id, async function (_error, user) {

            if (user == null) {
                return res.status(404).send({
                    message: 'No User Found',
                    data: []
                })
            }

            const url = "http://drop-table-backend.onrender.com/api/sublets?where={\"_id\": {\"$in\": "
                + JSON.stringify(user.interested) + "}}"
            await fetch(url, {
                method: 'GET'
            })
                .then(async function (output) {
                    const interestedSublets = await output.json()
                    return res.status(200).send({
                        message: 'OK',
                        data: interestedSublets.data
                    })
                })
                .catch(function (_error) {
                    return res.status(500).send({
                        message: 'Server Error',
                        data: []
                    });
                });

        })
            .catch(function (_error) {
                return res.status(500).send({
                    message: 'Server Error',
                    data: []
                });
            });
    })


    // delete user
    router.route('/users/:id').delete(function (req, res) {
        Users.findById(req.params.id, function (_error, user) {
            if (user == null) {
                return res.status(404).send({
                    message: 'No User Found',
                    data: []
                })
            }

            var taskProms = []
            user.postings.forEach(posting => {
                const url = "http://drop-table-backend.onrender.com/api/sublets/" + posting
                const resp = fetch(url, {
                    method: 'DELETE'
                })
                taskProms.push(resp)
            })

            user.interested.forEach(subletId => {
                const url = "http://drop-table-backend.onrender.com/api/interested/" + user.id + "/" + subletId
                const resp = fetch(url, {
                    method: 'PUT'
                })
                taskProms.push(resp)
            })

            Promise.all(taskProms).then(function (_tasks) {
                user.delete().then(function () {
                    return res.status(200).send({
                        message: 'User Deleted',
                        data: []
                    })
                })
            })
        })
            .catch(function (_error) {
                return res.status(500).send({
                    message: 'Server Error',
                    data: []
                });
            });
    })

    return router;
}
