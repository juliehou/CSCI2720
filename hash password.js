var bcrypt = require('bcrypt.js');

function createNewUser(name, password) {
    var hash = bcrypt.hashSync(password);
    var userObj = { name: name, password: hash };

    UserModel.create(userObj, function (err, result) {
        if (err)
            return handleError(err);

    });
}


function validateUser(name, password) {
    var hash = bcrypt.hashSync(password);
    UserModel.findone({ name: name }, function (err, user) {
        if (err)
            return handleError(err);


        return bcrypt.compareSync(hash, user.password);
    })
}