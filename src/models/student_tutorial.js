module.exports = (connection, Sequelize) =>  {
	var Student_tutorial = connection.define('student_tutorial', {
        locked: Sequelize.INTEGER
    });
	return Student_tutorial;
};