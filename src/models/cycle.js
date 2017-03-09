module.exports = (connection, Sequelize) =>  {
	var Cycle = connection.define('cycle', {
        name: Sequelize.STRING,
        status: Sequelize.STRING,
    });
    return Cycle
};