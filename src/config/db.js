//set up database
var Sequelize = require("sequelize");

var connection = new Sequelize('db', 'username', 'password',{
    dialect: 'sqlite',
    storage: __dirname + '/db.sqlite'
});


var db = {};

db.Sequelize = Sequelize;
db.connection = connection;


db.student = require('../models/student.js')(connection, Sequelize);
db.student_tutorial = require('../models/student_tutorial.js')(connection, Sequelize);
db.cycle = require('../models/cycle.js')(connection, Sequelize);
db.user = require('../models/user.js')(connection, Sequelize);
db.tutorial = require('../models/tutorial.js')(connection, Sequelize);

db.cycle.hasMany(db.tutorial, {onDelete: 'cascade', as: 'cycle_id'});
db.tutorial.belongsTo(db.cycle);

db.tutorial.belongsToMany(db.student, {onDelete: 'cascade', through: db.student_tutorial} );
db.student.belongsToMany(db.tutorial, {through: db.student_tutorial} );


module.exports = db;