exports.init = function(Sequelize, connection) {

    var Student_tutorial = connection.define('student_tutorial', {
        student_id: Sequelize.INTEGER,
        tutorial_id: Sequelize.INTEGER,
        locked: Sequelize.INTEGER
    });
}