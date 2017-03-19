
const routes = [
  require('./routes/student.js'), require('./routes/cycle.js')
];

module.exports = function router(localApp, db){
	return routes.forEach((route) => {
		route(localApp , db);
	});
}
