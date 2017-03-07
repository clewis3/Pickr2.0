exports.init = function(Sequelize, connection) {

    var Cycle = connection.define('cycle', {
        name: Sequelize.STRING,
        status: Sequelize.STRING,
    });
}