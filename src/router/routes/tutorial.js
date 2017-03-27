module.exports = (localApp, db) => {

	localApp.post('/api/tutorials/:tutorial_id/students/:id', (req, res) =>{

	});


    // Retrieve all tutorials 
    localApp.get('/api/cycles/:cycle_id/tutorials.json', (req, res) => {
        db.tutorial.findAll().then((tutorials) => {
            
            var responseJSON = tutorials.map((tutorial) => {
                return {
                    // change these
                    name: tutorial.name,
                    room_number: tutorial.room_number,
                    teacher_name: tutorial.teacher_name,
                    max_students: tutorial.max_students
                }
            });

            res.json(responseJSON);
        });
    });

    // Tutorial details - tutorialDetailController.js and tutorial/view/detail.html
    localApp.get('/api/cycles/:cycle_id/tutorials/:tutorial_id.json', (req, res) => {
        // console.log(req.params);
        // console.log("___________________________");
        // console.log(req);


    })

    // Creating tutorials
    localApp.post('/api/cycles/:cycle_id/tutorials.json', (req, res) => {
        const name = req.body.name;
        const teacher_name = req.body.teacher_name;
        const room_number = req.body.room_number;
        const max_students = req.body.max_students;

        db.tutorial.findOne({
            where: {
                    name: name,
                }
        }).then((tutorial) => {
        res.json({"tutorial": { name: name,
                                teacher_name: teacher_name,
                                room_number: room_number,
                                max_students: max_students}, 
            });
        
        });

    });

    // Editting tutorials
    localApp.put('/api/cycles/:cycle_id/tutorials.json', (req, res) => {


    });
}