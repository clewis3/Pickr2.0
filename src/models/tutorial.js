// exports.init = function(Sequelize, connection) {

//     var Tutorial = connection.define('tutorial', {
//         name: Sequelize.STRING,
//         cycle_id: Sequelize.INTEGER,
//         room_number: Sequelize.STRING,
//         teacher_name: Sequelize.STRING,
//         max_students: Sequelize.INTEGER
//     });
// }

module.exports = (connection, Sequelize) =>  {
	var Tutorial = connection.define('tutorial', {
        name: Sequelize.STRING,
        room_number: Sequelize.STRING,
        teacher_name: Sequelize.STRING,
        max_students: Sequelize.INTEGER
    });
    return Tutorial;
};