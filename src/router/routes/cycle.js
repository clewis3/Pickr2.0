module.exports = (localApp, db) => {

	//when loging in as a student
	//{id: name: cycle_id: room_number: teacher_name: max_students:, students}
	//view is tutorials/index
	//We should refactor the count for each tutorial
	localApp.get('/api/cycles/:id/tutorials.json', (req, res) => {
		const cycle_id = req.params.id;

		if (cycle_id == 0) {
			db.tutorial.findAll({
				include: [
				{
					model: db.cycle,
					where: db.Sequelize.or({status: 'Active'},{status: 'Open'})		
				}]
			}).then((tutorials) => {
				res.json( JSON.parse(JSON.stringify(tutorials)));
			});
		} else {
			db.tutorial.findAll( { where: { cycleId: [req.params.id] } } ).then((tutorials) => {        
        	var responseJSON = tutorials.map((tutorial) => {
                return {
                	id: tutorial.id,
                    name: tutorial.name,
                    room_number: tutorial.room_number,
                    teacher_name: tutorial.teacher_name,
                    max_students: tutorial.max_students
                }
        	});
        	res.json(responseJSON);
    	});
		}
	});


	localApp.put('/api/cycles/:cycle_id/tutorials/:tutorial_id/.json', (req, res) => {

	}); 

	//gets all the cycles 
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

	// gets tutorials for a cycle id 
	localApp.get('/api/cycles/:id', (req, res) => {
		const reqid = req.params.id.slice(0,-5);
		db.cycle.findOne({
			where: {
				id: reqid
			}
		}).then((cycle) => {
			console.log("got the cycle", cycle.id);
   			var responseJSON = {
   				id: cycle.id,
   				name: cycle.name,
   				status: cycle.status
   			}
   			res.json(responseJSON);
		});
	});


	// adds a cycle
	localApp.post('/api/cycles.json', (req, res) => {
		db.cycle.create({
			name: req.body.name,
			status: req.body.status
		}).then((cycle) => {
			res.json(cycle);
		})
		.catch(function(errors) {
			console.log(errors)
		});
	});

	//deletes a cycle
	localApp.delete('/api/cycles/:id', (req, res) => {
		const reqid = req.params.id.slice(0,-5);
		console.log(req.params.id.slice(0,-5));
		db.cycle.destroy({
			where: {
				id: reqid
			}
		}).then((rowDeleted) => {
			//still have to check if it might be more than one (if it deletes all the associated tutorials it is in)
			console.log(rowDeleted);
			if(rowDeleted >= 1) {
				res.json({numOfRowsDeleted: rowDeleted}); //might want to change response
			}
		})
		.catch(function(errors) {
			console.log(errors);
		});
	});

  //updates a cycle
	localApp.put('/api/cycles/:id', (req, res) => {
		console.log(req.params.id.slice(0,-5));
		console.log(req.body);
		const reqid = req.params.id.slice(0,-5);
		db.cycle.findOne({
			where: {
				id: reqid
			}
		}).then((cycle) => {
				if (cycle) {
					cycle.update(req.body).then((cycleUpdate) => {
						//update the cycle and then only return that cycle
						if (cycleUpdate) {
							res.json(cycleUpdate);
						}
					})
					.catch(function (error){
   					res.status(500).json(error);
 					});
				}
		});
	});
}
