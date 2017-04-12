
const routes = [
  require('./routes/student.js'), require('./routes/cycle.js'), require('./routes/tutorial.js'), require('./routes/user.js')
];

module.exports = function router(localApp, db){
	return routes.forEach((route) => {
		route(localApp , db);
	});
}
