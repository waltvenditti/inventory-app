var Bike = require("../models/bike");
var Part = require("../models/part");

var async = require("async");

// Display home page
exports.index = function (req, res) {
  res.render("index", {title: "Bike Shop Inventory"});
};

// Display list of all bikes
exports.bike_list = function (req, res, next) {
  async.parallel(
    {
      street_bikes: function (callback) {
        Bike.find({ class: "Street" }, "bike manf price invCount")
          .sort({ manf: 1 })
          .exec(callback);
      },
      gravel_bikes: function (callback) {
        Bike.find({ class: "Gravel" }, "bike manf price invCount")
          .sort({ manf: 1 })
          .exec(callback);
      },
      mountain_bikes: function (callback) {
        Bike.find({ class: "Mountain" }, "bike manf price invCount")
          .sort({ manf: 1 })
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) { 
        return next(err); 
      }
      res.render("bike_list", {
        title: "Bike Inventory",
        street_bike_list: results.street_bikes,
        gravel_bike_list: results.gravel_bikes,
        mountain_bike_list: results.mountain_bikes,
      })
    }
  );
};

// Display info page for a specific bike
exports.bike_info = function (req, res, next) {
  Bike.findById(req.params.id)
    .populate("services")
    .exec(function (err, bike) {
      if (err) { return next(err); }
      if (bike == null) {
        var err = new Error("Bike not found");
        err.status = 404;
        return next(err);
      }
      res.render("bike_info", {
        title: `${bike.manf} ${bike.bike}`,
        bike: bike,
      });
    });
};

// Display bike create form on GET
exports.bike_create_get = function (req, res) {
  res.render("bike_form", {
    title: "Add New Bike"
  });
};

// Display bike create on POST
exports.bike_create_post = function (req, res) {
  res.send("NOT IMPLEMENTED: bike create post");
};

// Display form for bike update GET
exports.bike_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: bike update get");
};

// Process bike update POST request
exports.bike_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: bike update post");
};

// Display form for bike delete GET
exports.bike_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED: bike delete get");
};

// Process request for bike delete POST
exports.bike_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED: bike delete post");
};