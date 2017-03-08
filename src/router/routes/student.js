module.exports = (localApp, db) => {

	localApp.get('/students', (req, res) => {
		res.json({"student": "hello"})
	});

}