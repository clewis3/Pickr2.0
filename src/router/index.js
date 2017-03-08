const routes = [
  require('./routes/routes')
];

module.exports = function router(localApp, db){
	return routes.forEach((route) => {
		route(localApp , db);
	});
}