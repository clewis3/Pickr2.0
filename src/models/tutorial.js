exports.init = function(Sequelize, connection) {

    var Tutorial = connection.define('tutorial', {
        name: Sequelize.STRING,
        cycle_id: Sequelize.INTEGER,
        room_number: Sequelize.STRING,
        teacher_name: Sequelize.STRING,
        max_students: Sequelize.INTEGER
    });
}