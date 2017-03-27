module.exports = (localApp, db) => {

	//when loging in as a student
	//{id: name: cycle_id: room_number: teacher_name: max_students:, students}
	//view is tutorials/index
	//We should refactor the count for each tutorial
	localApp.get('/api/cycles/:id/tutotials.json', (req, res) => {
		
	});

	localApp.put('/api/cycles/:cycle_id/tutotials/:tutorial_id/.json', (req, res) => {
		
	});

	localApp.get('/api/cycles.json', (req, res) =>{
		db.cycle.findAll().then((cycles) => {
			
			var responseJSON = cycles.map((cycle) => {
				// console.log(cycle);
				return {
					id: cycle.id,
					name: cycle.name,
					status: cycle.status
				}
			});
			res.json(responseJSON);
		});
	});

	//note that the angular request uses id + .json
	// Returns tutorials that have cycle_id 
	localApp.get('/api/cycles/:id', (req, res) => {
		// console.log(req.params.id.slice(0,-5));
		db.tutorial.findAll({ where: { cycleId: [req.params.id.slice(0,-5)] } }).then((tutorials) => {
			var responseJSON = tutorials.map((tutorial) => {
				return {
					name: tutorial.name,
                    room_number: tutorial.room_number,
                    teacher_name: tutorial.teacher_name,
                    max_students: tutorial.max_students
				}
			});
			res.json(responseJSON);
		});
	});

}