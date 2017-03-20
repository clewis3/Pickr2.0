module.exports = (localApp, db) => {

	//when loging in as a student
	//{id: name: cycle_id: room_number: teacher_name: max_students:, students}
	//view is tutorials/index
	//We should refactor the count for each tutorial
	localApp.get('/api/cycles/:id/tutorials.json', (req, res) => {

	});

	localApp.put('/api/cycles/:cycle_id/tutorials/:tutorial_id/.json', (req, res) => {

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



	//deletes a cycle
	localApp.delete('/api/cycles/:id', (req, res) => {
		db.cycle.destroy({
			where: {
				cycle_id: req.params.id.slice(0,-5)
			}
		}).then((rowDeleted) => {
			//it might be more than one, if it deletes all the associated tutorials it is in
			if(rowDeleted >= 1) {
				res.json({numOfRowsDeleted: rowDeleted}); //might want to change response
			}
		});
	});

}
