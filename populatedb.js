#! /usr/bin/env node

console.log(
  "This script populates bikes, parts, and services to the database. Execute via '$ node populatedb mongodb+srv://user:password@cluster0.a9azn.mongodb.net/your_db?retryWrites=true"
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/

var async = require("async");
var Service = require("./models/service");
var Part = require("./models/part");
var Bike = require("./models/bike");

var mongoose = require("mongoose");
const { type } = require("express/lib/response");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var bikes = [];
var parts = [];
var services = [];

function bikeCreate(bike_name, price, year, manf, frame, wheels, crankset, drivetrain, brakes, tires, bike_class, services, invCount, cb) {
  bikedetail = { bike: bike_name, price: price };
  if (year != false) bikedetail.year = year;
  if (manf != false) bikedetail.manf = manf;
  if (frame != false) bikedetail.frame = frame;
  if (wheels != false) {
    let wheelsProps = {};
    wheelsProps.wheelsString = wheels[0];
    if (wheels[1] != false) { 
      wheelsProps.wheelsObj = wheels[1]; 
    }
    bikedetail.wheels = wheelsProps;
  }
  if (crankset != false) {
    let cranksetProps = {};
    cranksetProps.cranksetString = crankset[0];
    if (crankset[1] != false) { 
      cranksetProps.cranksetObj = crankset[1]; 
    }
    bikedetail.crankset = cranksetProps;
  }
  if (drivetrain != false) {
    let drivetrainProps = {};
    drivetrainProps.drivetrainString = drivetrain[0];
    if (drivetrain[1] != false) { 
      drivetrainProps.drivetrainObj = drivetrain[1]; 
    }
    bikedetail.drivetrain = drivetrainProps;
  }
  if (brakes != false) bikedetail.brakes = brakes;
  if (tires != false) {
    let tiresProps = {};
    tiresProps.tiresString = tires[0];
    if (tires[1] != false) { 
      tiresProps.tiresObj = tires[1]; 
    }
    bikedetail.tires = tiresProps;
  }
  if (bike_class != false) bikedetail.class = bike_class;
  if (services != false) bikedetail.services = services;
  if (invCount != false) bikedetail.invCount = invCount;

  var bike = new Bike(bikedetail);

  bike.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Bike: " + bike);
    bikes.push(bike);
    cb(null, bike);
  })
}

function partCreate(part_name, price, type, manf, specs, sizeInfo, services, invCount, cb) {
  partdetail = { name: part_name,  price: price};
  if (type != false) partdetail.type = type;
  if (manf != false) partdetail.manf = manf;
  if (specs != false) partdetail.specs = specs;
  if (sizeInfo != []) partdetail.sizeInfo = sizeInfo;
  if (services != []) partdetail.services = services;
  if (invCount != false) partdetail.invCount = invCount;

  var part = new Part(partdetail);

  part.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Part: " + part);
    parts.push(part);
    cb(null, part);
  })
}

function serviceCreate(service, price, desc, cb) {
  servicedetail = { service: service, price: price };
  if (desc != false) servicedetail.desc = desc;

  var service = new Service(servicedetail);

  service.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Service: " + service);
    services.push(service);
    cb(null, service);
  })
}

function createServices(cb) {
  console.log("Starting createServices")
  async.series(
    [
      // service, price, desc, cb
      function(callback) { // 0
        serviceCreate("Install Wheel", 15, "Install the wheel onto the customer's bike.", callback);
      },
      function(callback) { // 1
        serviceCreate("Install Crankset", 30, "Install and adjust a crankset onto the customer's bike.", callback);
      },
      function(callback) { // 2
        serviceCreate("Install Drivetrain", 40, "Install and adjust a drivetrain onto the customer's bike.", callback);
      },
      function(callback) { // 3
        serviceCreate("Install Tire", 10, "Install a tire onto the customer's bike.", callback);
      },
      function(callback) { // 4
        serviceCreate("Repair Wheel", 25, "Attempt a repair of the customer's wheel.", callback);
      },
      function(callback) { // 5
        serviceCreate("Repair Crankset", 25, "Attempt a repair of the customer's wheel.", callback);
      },
      function(callback) { // 6
        serviceCreate("Repair Drivetrain", 25, "Attempt a repair of the customer's drivetrain.", callback);
      },
      function(callback) { // 7
        serviceCreate("Repair Tire", 15, "Attempt a repair of the customer's tire (only attempt if damage not on sidewall).", callback);
      },
      function(callback) { // 8
        serviceCreate("Bike Tire Tube Replacement", 10, "Replace the tube for customers tire. Price of tube not included in price.", callback);
      },
      function(callback) { // 9
        serviceCreate("Bike Tune-up", 60, "True wheels, perform braking and shifting adjustments, and run thorough diagnostics.", callback);
      },
      function(callback) { // 10
        serviceCreate("Bike Overhall", 120, "Everything in the bike tune-up, plus a cleaning of the drivechain and a cleaning & inspection of the bottom bracket.", callback);
      },
    ],
    cb);
}

function createParts (cb) {
  console.log("Starting createParts")
  async.series(
    [
      // part_name, price, type, manf, specs, sizeInfo, services, invCount, cb
      function(callback) { // 0
        partCreate("527", 214.99, "Wheel", "Oval Concepts", ["Rim braking"], ["700c", "100mm", "19mm inner"], [services[0], services[4],], 4, callback);
      },
      function(callback) { // 1
        partCreate("Freedom Cruz", 179.99, "Wheel", "WTB", ["Disc braking"], ["29in", "700c"], [services[0], services[4],], 2, callback);
      },
      function(callback) { // 2
        partCreate("X-30SE TR", 249.99, "Wheel", "Syncros", ["Disc braking"], ["29in", "2.4in width"], [services[0], services[4],], 2, callback);
      },
      function(callback) { // 3
        partCreate("Compact Gear", 214.99, "Crankset", "FSA", ["600g weight"], ["170mm"], [services[1], services[5],], 0, callback);
      },
      function(callback) { // 4
        partCreate("Zayante Carbon", 324.99, "Crankset", "Praxis", ["50/34", "620g weight"], false, [services[1], services[5],], 1, callback);
      },
      function(callback) { // 5
        partCreate("Deore", 169.99, "Drivetrain", "Shimano", false, ["10-speed"], [services[2], services[6],], 4, callback);
      },
      function(callback) { // 6
        partCreate("NX Eagle", 114.99, "Drivetrain", "SRAM", false, ["12-speed"], [services[2], services[6],], 1, callback);
      },
      function(callback) { // 7
        partCreate("Horizon", 65.95, "Tire", "WTB", false, ["650x47c"], [services[3], services[7],], 3, callback);
      },
      function(callback) { // 8
        partCreate("Wicked Will", 95.00, "Tire", "Schwalbe", false, ["62-622 (29x2.4in"], [services[3], services[7]], 4, callback);
      },
      function(callback) { // 9
        partCreate("Part Not Available", 0.00, false, false, false, false, false, false, callback)
      }
    ], cb);
}

function createBikes(cb) {
  console.log("Starting createBikes");
  async.series(
    [
      // bike_name, price, year, manf, frame, @@wheels, @@crankset, @@drivetrain, brakes, @@tires, bike_class, @@services, invCount, cb
      function(callback) {
        bikeCreate("Dew Plus", 949.99, "2022", "Kona", "aluminum", ["Double Wall alloy", false], ["Samox 36t", false], ["Shimano Deore 10-speed", parts[5]], "Disc", ["WTB Horizon 650x47c", parts[7]], "Street", [services[8], services[9], services[10]], 2, callback);
      },
      function(callback) {
        bikeCreate("Rove AL", 899.99, "2017", "Kona", "Aluminum", ["WTB Freedom Cruz", parts[1]], ["FSA Compact Gear", parts[3]], ["Shimano Claris 10-speed", false], "Disc", ["Schwalbe Delta Cruiser 700x35c", false], "Gravel", [services[8], services[9], services[10]], 0, callback);
      },
      function(callback) {
        bikeCreate("SL 2.1", 2699.99, "2022", "Fuji", "Carbon", ["Oval Concepts 527", parts[0]], ["Praxis Zayante Carbon", parts[4]], ["Shimano Ultegra 11-speed", false], "Rim", ["Vittoria Rubino Pro IV 700x25c", false], "Street", [services[8], services[9], services[10]], 1, callback);
      },
      function(callback) {
        bikeCreate("Spark 970", 2899.99, "2021", "Scott", "Steel", ["Syncros X-30SE TR", parts[2]], ["SRAM SX Eagle DUB", false], ["SRAM NX Eagle 12-speed", parts[6]], "Disc", ["Schwalbe Wicked Will 29x2.4in", parts[8]], "Mountain", [services[8], services[9], services[10]], 1, callback);
      },
    ],cb);
}



async.series(
  [
    createServices,
    createParts,
    createBikes
  ],
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("BIKES: ", + bikes);
    }
    mongoose.connection.close();
  }
);
