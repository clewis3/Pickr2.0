module.exports = (connection, Sequelize) =>  {
	var Student = connection.define('student', {
        first_name: Sequelize.STRING,
        last_name: Sequelize.STRING,
        grade_level: Sequelize.INTEGER
    },{ getterMethods: {
    	full_name: function() { return this.last_name + ', ' + this.first_name }
		}
	});
    return Student;
};