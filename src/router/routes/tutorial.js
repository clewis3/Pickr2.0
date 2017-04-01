module.exports = (localApp, db) => {

	localApp.post('/api/tutorials/:tutorial_id/students/:id', (req, res) =>{
        const tutorialId = req.params.tutorialId;
        const studentId = req.params.studentId.slice(0,-5);
	});


    // Retrieve all tutorials is in src/router/routes/cycle.js

    // Tutorial details - tutorialDetailController.js and tutorial/view/detail.html
    localApp.get('/api/cycles/:cycle_id/tutorials/:tutorial_id.json', (req, res) => {
        console.log(req.params);
        console.log("___________________________");
        console.log(req);
        
    })

    // Add tutorials
    localApp.post('/api/cycles/:cycle_id/tutorials.json', (req, res) => {
        console.log("cycle id for adding tutorials ", req.params.cycle_id);
        db.tutorial.create({
            name: req.body.name,
            teacher_name: req.body.teacher_name,
            room_number: req.body.room_number,
            max_students: req.body.max_students,
            cycleId: req.params.cycle_id
        }).then((tutorial) => {
            // console.log("got new tutorial", tutorial);
            res.json(tutorial);
        }).catch(function(errors) {
            console.log(errors);
        });
    });


    // Editting tutorials
    localApp.put('/api/cycles/tutorials/:id.json', (req, res) => {
        console.log("req.params.id.slice(1,-5) ", req.params.id.slice(0,-5));
        console.log("req.body ", req.body);
        const reqid = req.body.id;
        db.tutorial.findOne({
            where: {
                id: reqid
            }
        }).then((tutorial) => {
                console.log(tutorial)
                if (tutorial) {
                    tutorial.update(req.body).then((tutorialUpdate) => {
                        //update the tutorial and then only return that tutorial
                        if (tutorialUpdate) {
                            res.json(tutorialUpdate);
                        }
                    })
                    .catch(function (error){
                    res.status(500).json(error);
                    });
                }
        });
    });
    
    localApp.put('/api/cycles/tutorials/:id.json', (req, res) => {
        
    });

}