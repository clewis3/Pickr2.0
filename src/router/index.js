
const routes = [
  require('./routes/student.js')
];

module.exports = function router(localApp, db){
	return routes.forEach((route) => {
		route(localApp , db);
	});
}
