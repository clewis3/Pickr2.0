module.exports = (localApp, db) => {

	localApp.get('/api/students.json', (req, res) => {
		//res.json({"student": "hello"})
		db.student.findAll().then((students) => {
			res.json(students);
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
		console.log(req);
		res.json({"student": "admin", "password": "sadfsda", "admin":"true", "type": "admin"});
	});

}