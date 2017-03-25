var fs = require("fs");
var multer = require('multer');
var upload = multer({dest: 'uploads/'})
var parse = require('csv-parse');

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
	//add error to resplonse
	localApp.post('/api/students/import.json', upload.single('file'),function(req, res) {
		const filepath = req.file.path;
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
	});

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