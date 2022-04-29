var Service = require("../models/service");

var async = require("async");
const { body, validationResult } = require("express-validator");
const { resetWatchers } = require("nodemon/lib/monitor/watch");
const part = require("../models/part");

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
  res.render("service_form", {
    title: "Add New Service"
  });
};

// Display service create on POST
exports.service_create_post = [
  // Validate and sanitize all fields
  body("serviceName").trim().isLength({ min: 1 }).escape().withMessage("Service must have a name."),
  body("price").trim().isLength({ min: 1 }).escape().withMessage("The service must have a price.").isNumeric().withMessage("Price can only be numbers (with a decimal point)."),
  body("desc").optional({ checkFalsy: true }).trim().escape(),
  body("serviceType").optional({ checkFalsy: true }).trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    var service = new Service({
      service: req.body.serviceName,
      price: req.body.price,
      desc: req.body.desc,
      serviceType: req.body.serviceType,
    });

    if (!errors.isEmpty()) {
      res.render("service_form", {
        title: "Add New Service",
        service: service,
        errors: errors.array(),
      })
    } else {
      service.save(function (err) {
        if (err) { return next(err); }
        res.redirect(service.url);
      });
    }
  }
];

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
  Service.findById(req.params.id).exec(function (err, service) {
    if (err) { return next(err); }
    if (service==null) {
      res.redirect("/index/services");
    }
    res.render("service_delete", {
      title: `Delete Service: ${service.service}`,
      service: service,
    })
  })
};

// Process request for service delete POST
exports.service_delete_post = function (req, res) {
  Service.findById(req.body.serviceid).exec(function (err, service) {
    if (err) { return next(err); }
    if (service==="undefined") {
      var error = new Error("Service not found");
      error.status = 404;
      return next(error);
    }
    Service.findByIdAndRemove(req.body.serviceid, function (err) {
      if (err) { return next(err); }
      res.redirect("/index/services/");
    });
  })
};