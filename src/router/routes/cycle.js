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
				return {
					id: cycle.id,
					name: cycle.name,
					status: cycle.status
				}
			});

			res.json(responseJSON);
		});
	});

	//note that the angula request uses id + .json
	localApp.get('/api/cycles/:id', (req, res) => {

	});

}