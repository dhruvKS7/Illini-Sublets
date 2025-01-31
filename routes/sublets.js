var Sublets = require('../models/sublets.js');
var Users = require('../models/users.js');

module.exports = function (router) {

    var subletRoute = router.route('/sublets');

    // get all sublets from MongoDB collection
    subletRoute.get(async function (req, res) {

        try {
            var whereOption = req.query.where;
            var sortOption = req.query.sort;
            var selectOption = req.query.select;
            var skipOption = req.query.skip;
            var limitOption = req.query.limit;
            // var countOption = req.query.count;

            var query = Sublets
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

    // get sublet matching id
    router.route('/sublets/:id').get(function (req, res) {
        Sublets.findById(req.params.id, function (_error, result) {
            if (result) {
                return res.status(200).send({
                    message: 'OK',
                    data: result
                });
            }
            return res.status(404).send({
                message: 'No Sublet Found',
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

    // add a new sublet to MongoDB collection
    subletRoute.post(async function (req, res) {

        try {
            // make sure poster_id exists
            const query = Users.find({ _id: req.body.poster_id });
            const results = await query.exec();

            if (results.length == 0) {
                res.status(404).json({
                    message: 'User does not exist',
                    data: null,
                });
            }
            else {
                const sublet = new Sublets(req.body);
                const result = await sublet.save();

                Users.findById(req.body.poster_id, function (_err, user) {
                    user.postings.push(sublet.id)
                    user.save()

                    res.status(201).json({
                        message: 'Sublet added',
                        data: result,
                    });
                })
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

    // add user to sublet's interested users and sublet to user's interested sublets
    router.route('/interested/:user_id/:sublet_id').put(function (req, res) {
        const user_id = req.params.user_id
        const sublet_id = req.params.sublet_id
        Sublets.findById(sublet_id, function (_error, sublet) {

            if (sublet == null) {
                return res.status(404).send({
                    message: 'No Sublet Found',
                    data: []
                })
            }

            Users.findById(user_id, function (_error, user) {

                if (user == null) {
                    return res.status(404).send({
                        message: 'No User Found',
                        data: []
                    })
                }

                var interestedUsers = sublet.interestedUsers
                if (interestedUsers.includes(user_id)) {
                    interestedUsers.remove(user_id)
                    sublet.save()
                    user.interested.remove(sublet_id)
                    user.save()
                } else {
                    interestedUsers.push(user_id)
                    sublet.save()
                    user.interested.push(sublet_id)
                    user.save()
                }

                return res.status(200).send({
                    message: 'OK',
                    data: []
                })
            })
        })
    })

    // modify sublet information
    router.route('/sublets/:id').put(function (req, res) {
        Sublets.findById(req.params.id, function (_error, sublet) {
            if (sublet == null) {
                return res.status(404).send({
                    message: 'No Sublet Found',
                    data: []
                })
            }

            if (!('interestedUsers' in req.body) | !('poster_id' in req.body) | !('numBedrooms' in req.body)
                | !('numBathrooms' in req.body) | !('gym' in req.body) | !('petFriendly' in req.body)
                | !('parking' in req.body) | !('utilitiesIncluded' in req.body) | !('secureEntry' in req.body)
                | !('elevator' in req.body) | !('address' in req.body) | !('lat' in req.body)
                | !('long' in req.body) | !('description' in req.body) | !('term' in req.body)
                | !('monthlyPrice' in req.body) | !('leasingCompany' in req.body) | !('lessor' in req.body)) {
                return res.status(400).send({
                    message: 'Missing Required Fields',
                    data: []
                });
            }

            // Should not be changed directly
            sublet.interestedUsers = req.body.interestedUsers
            sublet.poster_id = req.body.poster_id
            sublet.lessor = req.body.lessor

            // Can be changed
            sublet.numBedrooms = req.body.numBedrooms
            sublet.numBathrooms = req.body.numBathrooms
            sublet.gym = req.body.gym
            sublet.petFriendly = req.body.petFriendly
            sublet.parking = req.body.parking
            sublet.utilitiesIncluded = req.body.utilitiesIncluded
            sublet.secureEntry = req.body.secureEntry
            sublet.elevator = req.body.elevator
            sublet.address = req.body.address
            sublet.lat = req.body.lat
            sublet.long = req.body.long
            sublet.description = req.body.description
            sublet.term = req.body.term
            sublet.monthlyPrice = req.body.monthlyPrice
            sublet.leasingCompany = req.body.leasingCompany
            sublet.save()

            return res.status(200).send({
                message: 'Sublet Modified',
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

    // get sublet's list of interested users
    router.route('/interestedUsers/:id').get(async function (req, res) {
        Sublets.findById(req.params.id, async function (_error, sublet) {

            if (sublet == null) {
                return res.status(404).send({
                    message: 'No Sublet Found',
                    data: []
                })
            }

            const url = "http://drop-table-backend.onrender.com/api/users?where={\"_id\": {\"$in\": "
                + JSON.stringify(sublet.interestedUsers) + "}}"
            await fetch(url, {
                method: 'GET'
            })
                .then(async function (output) {
                    const interestedUsers = await output.json()
                    return res.status(200).send({
                        message: 'OK',
                        data: interestedUsers.data
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

    // delete sublet
    router.route('/sublets/:id').delete(function (req, res) {
        Sublets.findById(req.params.id, function (_error, sublet) {
            if (sublet == null) {
                return res.status(404).send({
                    message: 'No Sublet Found',
                    data: []
                })
            }

            Users.findById(sublet.poster_id, function (_error, poster) {
                poster.postings.remove(sublet.id);
                poster.save().then();
            })

            sublet.interestedUsers.forEach(interestedUser => {
                Users.findById(interestedUser, function (_error, user) {
                    user.interested.remove(sublet.id);
                    user.save().then();
                })
            })

            sublet.delete().then(function () {
                return res.status(200).send({
                    message: 'Sublet Deleted',
                    data: []
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
