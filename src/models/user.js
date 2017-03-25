module.exports = (connection, Sequelize) =>  {
	var User = connection.define('user', {
        name: Sequelize.STRING,
        role: Sequelize.STRING,
        password: Sequelize.STRING
    });
    return User;
};