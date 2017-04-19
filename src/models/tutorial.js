module.exports = (connection, Sequelize) =>  {
	var Tutorial = connection.define('tutorial', {
        name: Sequelize.STRING,
        room_number: Sequelize.STRING,
        teacher_name: Sequelize.STRING,
        max_students: Sequelize.INTEGER,
        approved: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
    });
    return Tutorial;
};