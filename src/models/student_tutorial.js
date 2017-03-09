module.exports = (connection, Sequelize) =>  {
	var Student_tutorial = connection.define('student_tutorial', {
        //student_id: Sequelize.INTEGER,
        //tutorial_id: Sequelize.INTEGER,
        locked: Sequelize.INTEGER
    });
	return Student_tutorial;
};