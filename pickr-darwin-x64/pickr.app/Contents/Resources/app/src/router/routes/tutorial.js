module.exports = (localApp, db) => {
    // Retrieve all tutorials is in src/router/routes/cycle.js

    // Add students to tutorials
	localApp.post('/api/tutorials/:tutorial_id/students/:id', (req, res) =>{
        const tutorial_id = req.params.tutorial_id;
        // Inconsistency in naming student_id, student_id = students primary key id 
        const student_id = req.params.id.slice(0,-5);
        const isLock = req.body; // if isLock.lock == true, locked: 1

        // Determine if locked (if admin or student added to tutorial)
        if (isLock.lock == true) {
            console.log(isLock.lock); 
            // Admin
            currLocked = Number(1);
        }
        else {
            // Student
            currLocked = Number(0);
        }

        // Find all tutorials in origin cycle to delete if necessary
        db.tutorial.findOne({
            where: {    
                id: tutorial_id,
            }
        }).then((tutorial) => {
            currCycle = tutorial.cycleId;
            console.log("currCycle= ", currCycle);
            // Find all tutorials in origin cycle to delete if necessary
            // Find all tutorials within same cycle as tutorial_id 
            db.tutorial.findAll({
                include: [
                    {
                        model: db.cycle,
                        where: {id: currCycle}
                    }]
                }).then((openTutorials) => {
                    // console.log(openTutorials);
                    // Find any openTutorials in student_tutorials where studentId matches
                    openTutorials.map((openTutorial) => {
                        db.student_tutorial.findOne({
                            where: {
                                tutorialId: openTutorial.id,
                                studentId: student_id
                            }
                        }).then((deleteStudentTutorial) => {
                            if (deleteStudentTutorial != null) {
                                //delete student_tutorial if returns an object   
                                if (!(deleteStudentTutorial.locked!=1 && currLocked)) { 
                                    db.student_tutorial.destroy({
                                        where: {
                                            tutorialId: deleteStudentTutorial.tutorialId,
                                            studentId: student_id 
                                        }
                                    }).then(() =>{
                                        console.log({'data': 'deleted student from tutorial'});
                                    });
                                };
                            }
                            else if (deleteStudentTutorial==null || (!(deleteStudentTutorial.locked!=1 && currLocked))) {
                                // Add student and tutorial to student_tutorials
                                console.log("tutorial_id= ", tutorial_id);
                                console.log("student_id= ", student_id);
                                console.log("locked= ", currLocked);
                                db.student_tutorial.create({
                                    tutorialId: tutorial_id,
                                    studentId: student_id,
                                    locked: currLocked
                                }).then((newStudentTutorial) => {
                                    res.json(newStudentTutorial);
                                }).catch(function(err) {
                                    console.log(err, currLocked);
                                }); 
                            }
                            else {
                                res.json({data: "You are locked into another tutorial."})
                            }
                        });
                    });
                });
            });
	});

    // Delete students from tutorial 
    localApp.delete('/api/tutorials/:tutorial_id/students/:id', (req, res) =>{
        const tutorial_id = req.params.tutorial_id;
        const student_id = req.params.id.slice(0,-5);
        console.log(student_id);
        db.student_tutorial.destroy({
            where: {
                tutorialId: tutorial_id,
                studentId: student_id 
            }
        }).then(() =>{
            res.json({'data': 'deleted student from tutorial'});
        }).catch(function(errors) {
            console.log(errors);
        });
    }); 

    // Student view: adding student to tutorial
    localApp.post('/api/tutorials/:tutorial_id/students.json', (req, res) =>{
        res.json({'data':'this route exists'});
    });

    // Get students for a specific tutorial
    localApp.get('/api/tutorials/:tutorial_id/students.json', (req, res) =>{
        // console.log(req.params);
        const tutorialId = req.params.tutorial_id;

        // Find all studentId for selected tutorial 
        db.student.findAll({
            include: [
            {
                model: db.tutorial,
                    where: {
                        id: tutorialId
                    }
                }
            ]
        }).then((student) => {
            // console.log("student=", student);

            var responseJSON = student.map((student) => {
                return {
                        student_id: student.student_id,
                        full_name: student.full_name,
                        first_name: student.first_name,
                        last_name: student.last_name,
                        grade_level: student.grade_level,
                        id: student.id
                }
            });
            // console.log(responseJSON);
            res.json(responseJSON);
        });
    });

    // TODO: Locked tutorial 

    // TODO: Locked student 

    // Tutorial details - tutorialDetailController.js and tutorial/view/detail.html
    localApp.get('/api/cycles/:cycle_id/tutorials/:tutorial_id.json', (req, res) => {
        const cycleId = req.params.cycle_id;
        const tutorialId = req.params.tutorial_id;

        db.tutorial.findOne({
            where: {
                id: tutorialId
            }
        }).then((tutorial) => {
            // console.log("got the tutorial ", tutorial.id);
            var responseJSON = {
                id: tutorial.id,
                name: tutorial.name,
                teacher_name: tutorial.teacher_name,
                room_number: tutorial.room_number,
                max_students: tutorial.max_students
            }
            res.json(responseJSON);
        });
    });

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
        // console.log("req.params.id.slice(1,-5) ", req.params.id.slice(0,-5));
        // console.log("req.body ", req.body);
        const reqid = req.body.id;
        db.tutorial.findOne({
            where: {
                id: reqid
            }
        }).then((tutorial) => {
                // console.log(tutorial)
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

    //deletes a tutorial CHECK THE ROUTE 
    localApp.delete('/api/cycles/tutorials.json', (req, res) => {
        
    });

}