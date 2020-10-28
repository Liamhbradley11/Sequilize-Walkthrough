'use strict';
//includes the models that exist in the separte files
var fs        = require('fs');
// path / file paths
var path      = require('path');
// allows us to sequelize 
var Sequelize = require('sequelize');
// returns the basename / last part of the path
var basename  = path.basename(module.filename);
// enviroment variavle indicating to run on in development
var env       = process.env.NODE_ENV || 'development';
// sets the congif directiry name 
var config    = require(__dirname + '/../config/config.json')[env];
// database
var db        = {};

// which database you want to use and checks the database / uses the default congfiguration
if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  //creates a deafult congfiguration incase something changes 
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

//file server 
fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

//files are being called without needing to require them
Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
