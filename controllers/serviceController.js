var Service = require("../models/service");

var async = require("async");

// Display list of all services
exports.service_list = function (req, res, next) {
  async.parallel(
    {
      part_services: function (callback) {
        Service.find({
          $or:[
            {serviceType: "Wheel"},
            {serviceType: "Crankset"},
            {serviceType: "Drivetrain"},
            {serviceType: "Tire"}
          ]
        }, "service price")
          .sort({ service: 1 })
          .exec(callback);
      },
      bike_services: function (callback) {
        Service.find({ serviceType: "Bike" }, "service price")
          .sort({ service: 1 })
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) { 
        return next(err); 
      }
      res.render("service_list", {
        title: "Service Inventory",
        part_service_list: results.part_services,
        bike_service_list: results.bike_services,
      });
    }
  );
};

// Display info page for a specific service
exports.service_info = function (req, res) {
  Service.findById(req.params.id)
    .exec(function (err, service) {
      if (err) { return next(err); }
      if (service == null) {
        var err = new Error("Service not found");
        err.status = 404;
        return next(err);
      }
      res.render("service_info", {
        title: `${service.service}`,
        service: service,
      })
    });
};

// Display service create form on GET
exports.service_create_get = function (req, res) {
  res.send("NOT IMPLEMENTED: service create get");
};

// Display service create on POST
exports.service_create_post = function (req, res) {
  res.send("NOT IMPLEMENTED: service create post");
};

// Display form for service update GET
exports.service_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: service update get");
};

// Process service update POST request
exports.service_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: service update post");
};

// Display form for service delete GET
exports.service_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED: service delete get");
};

// Process request for service delete POST
exports.service_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED: service delete post");
};