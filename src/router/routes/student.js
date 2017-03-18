module.exports = (localApp, db) => {

	localApp.get('/api/students.json', (req, res) => {
		//res.json({"student": "hello"})
		db.student.findAll().then((students) => {
			
			var responseJSON = students.map((student) => {
				console.log(student);
				return {
					full_name: student.full_name,
					grade_level: student.grade_level
				}
			});

			res.json(responseJSON);
		});
	});

	localApp.get('/students.json', (req, res) => {
		//res.json({"student": "hello"})
		db.student.findAll().then((students) => {
			res.json({"students": students});
		});
	});


	localApp.get('/api/students/:id', (req, res) => {
		//get one student
		res.json({"test": "test"});
	});


	localApp.post('/api/students/login.json', (req, res) => {
		res.json({"student": "admin", "password": "sadfsda", "admin":"true", "type": "admin"});
	});

}