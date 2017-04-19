var fs = require("fs");
var multer = require('multer');
var upload = multer({dest: __dirname + '/uploads/'})
var parse = require('csv-parse');

module.exports = (localApp, db) => {

	//deletes a student, but dont know which one
	localApp.delete('/api/students/:id', (req, res) => {
		console.log("req.params etc. ", req.params.id.slice(0,-5));
		db.student.destroy({
			where: {
				id: req.params.id.slice(0,-5)
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
	//Table has student name(first name alphabetical), grade level, tutorial name, instructor, room #
	localApp.get('/api/students/active.json', (req, res) => {
		db.student.findAll({
			include: [
			{
				model: db.tutorial,
				include: [
					{
						model: db.cycle,
						where: {
							status: "Active"
							//gets all students that have a tutorial in the active cycle
						}
					}
				]
			}
			]
		}).then((student) => {
			var responseJSON = student.map((student) => {
				 //console.log( JSON.parse(JSON.stringify(student)) );
				return {
					full_name: student.full_name,
					first_name: student.first_name,
					last_name: student.last_name,
					grade_level: student.grade_level,
					id: student.student_id,
					tutorial: student.tutorials.map((tutorial) => {
					 //console.log( tutorial.room_number );
						return {
							id: tutorial.id,
							name: tutorial.name,
							cycle_id: tutorial.cycleId,
							room_number: tutorial.room_number,
							teacher_name: tutorial.teacher_name,
							max_students: tutorial.max_students,
							cycle: [tutorial.cycle].map((cycle) => {
								//map only works for arrays
								return {
									id: cycle.id,
									name: cycle.name,
									status: cycle.status
								}
							})
						}
					})
				}
			});
			//console.log(responseJSON[0].tutorial, responseJSON[0].tutorial[0].cycle);
			res.json(responseJSON);
		});
	});

	localApp.get('/api/students.json', (req, res) => {
		db.student.findAll().then((students) => {
			var responseJSON = students.map((student) => {
				return {
					full_name: student.full_name,
					first_name: student.first_name,
					last_name: student.last_name,
					grade_level: student.grade_level,
					id: student.id,
					student_id: student.student_id
				}
			});

			res.json(responseJSON);
		});
	});

	localApp.get('/api/students/activeU.json', (req, res) => { 

		db.connection.query("SELECT * FROM students WHERE students.id NOT IN ( SELECT student_tutorials.studentId FROM student_tutorials )", { type: db.connection.QueryTypes.SELECT})
		  	.then((ms) => {
		  	var notSignedUp = ms.map((s) => {
		  		return{
		  			first_name: s.first_name,
					last_name: s.last_name,
					grade_level: s.grade_level,
					id: s.student_id,
		  		}
		  	});




		  	db.connection.query("SELECT * FROM students LEFT JOIN student_tutorials ON students.id = student_tutorials.studentId LEFT JOIN tutorials ON student_tutorials.tutorialId = tutorials.id LEFT JOIN cycles ON tutorials.cycleId = cycles.id WHERE cycles.status != 'Active' AND  students.student_id NOT IN (SELECT students.student_id FROM students LEFT JOIN student_tutorials ON students.id = student_tutorials.studentId LEFT JOIN tutorials ON student_tutorials.tutorialId = tutorials.id LEFT JOIN cycles ON tutorials.cycleId = cycles.id WHERE cycles.status = 'Active') GROUP BY students.student_id", { type: db.connection.QueryTypes.SELECT})
			.then((student) => {
				var responseJSON = student.map((student) => {
					return {
						first_name: student.first_name,
						last_name: student.last_name,
						grade_level: student.grade_level,
						id: student.student_id,
					}
				});
				if (!!notSignedUp.length) {
					res.json(responseJSON.concat(notSignedUp))
				} else {
					res.json(responseJSON);
				}

			 });
		})
	});

	localApp.get('/api/students/:id', (req, res) => {
		const id = req.params.id.slice(0,-5);
		if (id == 0) {
			db.student.findAll().then((students) => {
				var responseJSON = students.map((student) => {
					return {
						full_name: student.full_name,
						first_name: student.first_name,
						last_name: student.last_name,
					}
				});

				res.json(responseJSON);
			});
		} else {
			//get a specific student
		}
	});

	localApp.delete('/api/students.json', (req, res) => {
		db.student.destroy({
			where: {},
			truncate: true
		}).then(() =>{
			res.json({'data': 'deleted all'});
		})
	});

	//deletes a student, but dont know which one
	localApp.delete('/api/students/:id', (req, res) => {
		db.student.destroy({
			where: {
				id: req.params.id.slice(0,-5)
			}
		}).then((rowDeleted) => {
			//it might be more than one, if it deletes all the associated tutorials it is in
			if(rowDeleted >= 1) {
				res.json({numOfRowsDeleted: rowDeleted}); //might want to change response
			}
		});
	});

	//login for users
	localApp.post('/api/students/login.json', (req, res) => {
		const first_name = req.body.student.first_name;
		const last_name = req.body.student.last_name;
		const password = req.body.password;
		//add something for multi threading here
		//loginCheck(first_name, last_name, password, req, res);
		devLoginCheck(first_name,last_name,req,res);
	});

	//importing list
	//add error to resplonse
	localApp.post('/api/students/import.json', upload.single('file'),function(req, res) {
		const filepath = req.file.path;
		importCSV(filepath,req, res);
	});



var devLoginCheck = (first_name, last_name,req, res) => {
	if (first_name === "admin") {
		res.json({"student": "admin", "password": "n/a", "admin":"true", "type": "admin"});
	} else if(first_name === 'teacher') {
		res.json({"student": "teacher", "password": "n/a", "admin":"false", "type": "teacher"});
	} else {
		db.student.findOne({
			where: {
					first_name: first_name,
					last_name: last_name
				},
				include: [{
					model: db.tutorial,
					include: [{
						model: db.cycle
					}]
				}]
		}).then((student) => {
		console.log(JSON.parse(JSON.stringify(student)));
		res.json({"student": { first_name: student.first_name,
							   last_name: student.last_name,
								sid: student.student_id,
								grade_level: student.grade_level,
								fullname: student.fullname,
								id: student.id},
				 "password": "n/a",
				 "admin":"false",
				 "type": "student",
				 "tutorials": student.tutorials});

		});
	}
}



//database helper methods
var loginCheck = (first_name, last_name, password, req, res) =>{
	if (first_name === "admin") {
			//add logic to check password
			db.user.findOne({
				where: {name: "admin"}
			}).then((user) => {
				if (user.password === password) {
					res.json({"student": "admin", "password": "n/a", "admin":"true", "type": "admin"});
				} else {
					res.status(403).json({'message': 'Forbidden'})
				}
			});
		} else if (first_name === "teacher"){
			//add logic to check password
			db.user.findOne({
				where: {name: "teacher"}
			}).then((user) => {
				if (user.password === password) {
					res.json({"student": "teacher", "password": "n/a", "admin":"false", "type": "teacher"});
				} else {
					res.status(403).json({'message': 'Forbidden'})
				}
			});
		} else {
			db.student.findOne({
				where: {
					first_name: first_name,
					last_name: last_name
				},
				include: [{
					model: db.tutorial,
					include: [{
						model: db.cycle
					}]
				}]
			}).then((student) => {
				console.log(JSON.parse(JSON.stringify(student)));
				if (student.student_id == password) {
					res.json({"student": { first_name: student.first_name,
										   last_name: student.last_name,
											sid: student.student_id,
											grade_level: student.grade_level,
											fullname: student.fullname,
											id: student.id
										},
							 "password": "n/a",
							 "admin":"false",
							 "type": "student",
							 "tutorials": student.tutorials});
				} else {
					res.status(403).json({'message': 'Forbidden'})
				}
			})
		}
	}


var importCSV = (filepath, req, res) =>{
	var csvData = [];
	const input = 'last_name,first_name,grade_level,Student_Number';
	var source = fs.createReadStream(filepath);

	var parser = parse({
        delimiter: ',',
        columns: ['last_name','first_name','grade_level','student_id']
    });

	source.pipe(parser).on('data', function(csvRow) {
		csvData.push(csvRow);
	})
	.on('error', function(error){
		console.log(error.message);
		res.json({'status': error.message});
	})
	.on('end', function() {

		if (testKeys(csvData[0]) ) {
			//send error
			console.log('heading error');
		} else {
			//start bulk load
			csvData.splice(0, 1);


			//check if any of the data sets already exists
			csvData.forEach((row, index) => {
				console.log(index);
				db.student.findOne({
					where: {
						student_id: row.student_id
					}
				}).then((student) => {
					if (student != null) {
						student.grade_level = row.grade_level
						student.save().then(() => {
							console.log(row.last_name + ' grade was updated to ' + row.grade_level);
						});
					}
				});
			});

			//if they do update the exsting one with the uploading files grade.

			db.student.bulkCreate(csvData, { ignoreDuplicates: true })
			.catch((errors) => {
				console.log(errors);
			})
			.then(function(){
				fs.unlink(filepath, err => {
					console.log(err);
				});
				res.json({"test": "finished"});
			});
		}
	});
}





}



//helper methods
testKeys = (row) => {
	errorMssg = "Wrong file structure. Check order or spelling of headings.";
	if (row.last_name != "last_name" || row.first_name != "first_name" || row.grade_level != "grade_level" || row.student_id != "student_number"){
		return errorMssg;
	} else {
		return false;
	}
}

