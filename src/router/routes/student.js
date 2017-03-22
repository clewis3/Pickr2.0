var fs = require("fs");
var multer = require('multer');
var upload = multer({dest: 'uploads/'})

module.exports = (localApp, db) => {

	localApp.get('/api/students.json', (req, res) => {
		db.student.findAll().then((students) => {
			
			var responseJSON = students.map((student) => {
				return {
					full_name: student.full_name,
					grade_level: student.grade_level,
					id: student.student_id
				}
			});

			res.json(responseJSON);
		});
	});

	//deletes a student, but dont know which one
	localApp.delete('/api/students/:id', (req, res) => {
		db.student.destroy({
			where: {
				student_id: req.params.id.slice(0,-5)
			}
		}).then((rowDeleted) => {
			//it might be more than one, if it deletes all the associated tutorials it is in
			if(rowDeleted >= 1) {
				res.json({numOfRowsDeleted: rowDeleted}); //might want to change response
			}
		});
	});

	//clicking on student report this is the get
	//list with [{id: first_name: last_name grade_level: tutorials:{id: name: cycle_id: room number: teacher name: max_students: _matchingData: {Cycles: {id: name: status : } }, "_joinData:{tutorial_id, id: student_id: locked:}}, fullname: }]
	//Table has student name(first name alphabetical), gradelevel, tutorial name, instructor, room#

	localApp.get('/api/students/active.json', (req, res) => {

	});

	localApp.get('/api/students/:id', (req, res) => {

	});


	//login for everybody
	localApp.post('/api/students/login.json', (req, res) => {
		const first_name = req.body.student.first_name;
		const password = req.body.password;

		if (first_name === "admin") {
			//add logic to check password
			res.json({"student": "admin", "password": "sadfsda", "admin":"true", "type": "admin"});
		} else if (first_name === "teacher"){
			//add logic to check password
			res.json({"student": "teacher", "password": "sadfsda", "admin":"false", "type": "teacher"});		
		} else {
			//add logic to check password & return data
		}
	});

	//importing list
	localApp.post('/api/students/import.json', upload.single('file'),function(req, res) {
		console.log(req.file.filename, req.body);
		res.json({"test": "test"});
	});

}