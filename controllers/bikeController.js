var Bike = require("../models/bike");
var Service = require("../models/service");

var async = require("async");
const { body, validationResult } = require("express-validator");

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
exports.bike_create_post = [
  // Validate and sanitize all fields
  body("bikeName")
    .trim().isLength({ min: 1 }).escape().withMessage("Bike must have a name."),
  body("price").trim().isLength({ min: 1 }).escape().withMessage("Bike must have a price.").isNumeric().withMessage("Price can be numbers (with a decimal point) only."),
  body("year").optional({ checkFalsy: true }).trim().escape(),
  body("manf").optional({ checkFalsy: true }).trim().escape(),
  body("frame").optional({ checkFalsy: true }).trim().escape(),
  body("wheels").optional({ checkFalsy: true }).trim().escape(),
  body("crankset").optional({ checkFalsy: true }).trim().escape(),
  body("drivetrain").optional({ checkFalsy: true }).trim().escape(),
  body("brakes").optional({ checkFalsy: true }).trim().escape(),
  body("tires").optional({ checkFalsy: true }).trim().escape(),
  body("class").trim().escape(),
  body("invCount").optional({ checkFalsy: true }).trim().escape().isNumeric(),

  // Process request after validation/sanitization
  (req, res, next) => {
    const errors = validationResult(req);

    Service.find({ serviceType: "Bike" }).sort({ service: 1 }).exec(function (err, results) {
      if (err) { return next(err); }
      var bike = new Bike({
        bike: req.body.bikeName,
        price: req.body.price,
        year: req.body.year,
        manf: req.body.manf,
        frame: req.body.frame,
        wheels: req.body.wheels,
        crankset: req.body.crankset,
        drivetrain: req.body.drivetrain,
        brakes: req.body.brakes,
        tires: req.body.tires,
        invCount: req.body.invCount,
        class: req.body.class,
        services: results,
      })
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized./validated data and error messages
        res.render("bike_form", {
          title: "Add New Bike",
          bike: bike,
          errors: errors.array(),
        });
      } else {
        bike.save(function (err) {
          if (err) { return next(err); }
          // Successful so redirect to page of new bike
          res.redirect(bike.url);
        })
      }
    });
  }
];

// Display form for bike update GET
exports.bike_update_get = function (req, res) {
  Bike.findById(req.params.id, function (err, bike) {
    if (err) { return next(err); }
    if (bike==null) {
      var err = new Error("Bike not found in database");
      err.status = 404;
      return next(err);
    }
    res.render("bike_form", {
      title: `Update Bike: ${bike.manf} ${bike.bike}`,
      bike: bike,
    })
  })
};

// Process bike update POST request
exports.bike_update_post = [
  // Validate and sanitize all fields
  body("bikeName").trim().isLength({ min: 1 }).escape().withMessage("Bike must have a name."),
  body("price").trim().isLength({ min: 1 }).escape().withMessage("Bike must have a price.").isNumeric().withMessage("Price can be numbers (with decimal points) only."),
  body("year").optional({ checkFalsy: true }).trim().escape(),
  body("manf").optional({ checkFalsy: true }).trim().escape(),
  body("frame").optional({ checkFalsy: true }).trim().escape(),
  body("wheels").optional({ checkFalsy: true }).trim().escape(),
  body("crankset").optional({ checkFalsy: true }).trim().escape(),
  body("drivetrain").optional({ checkFalsy: true }).trim().escape(),
  body("brakes").optional({ checkFalsy: true }).trim().escape(),
  body("tires").optional({ checkFalsy: true }).trim().escape(),
  body("class").trim().escape(),
  body("invCount").trim().escape().isNumeric(),
  
  // Process request after validation/sanitization
  (req, res, next) => {
    const errors = validationResult(req);
    Service.find({ serviceType: "Bike" }).sort({ service: 1 }).exec(function (err, results) {
      if (err) { return next(err); }
      var bike = new Bike({
        _id: req.params.id,
        bike: req.body.bikeName,
        price: req.body.price,
        year: req.body.year,
        manf: req.body.manf,
        frame: req.body.frame,
        wheels: req.body.wheels,
        crankset: req.body.crankset,
        drivetrain: req.body.drivetrain,
        brakes: req.body.brakes,
        tires: req.body.tires,
        invCount: req.body.invCount,
        class: req.body.class,
        services: results,
      })
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized./validated data and error messages
        res.render("bike_form", {
          title: "Update Bike",
          bike: bike,
          errors: errors.array(),
        });
        
      } else {
        Bike.findByIdAndUpdate(req.params.id, bike, {}, function (err, thebike) {
          if (err) { return next(err); }
          // Successful so redirect to updated page
          res.redirect(thebike.url);
        })
      }
    });
  },

];

// Display form for bike delete GET
// Displays key info on the bike and asks you to confirm the delete by pressing a DELETE button
exports.bike_delete_get = function (req, res) {
  Bike.findById(req.params.id).exec(function (err, bike) {
    if (err) { return next(err); }
    if (bike==null) {
      res.redirect("/index/bikes");
    }
    res.render("bike_delete", {
      title: `Delete ${bike.manf} ${bike.bike}`,
      bike: bike,
    })
  })
};

// Process request for bike delete POST
exports.bike_delete_post = function (req, res) {
  Bike.findById(req.body.bikeid).exec(function (err, bike) {
    if (err) { return next(err); }
    if (bike=="undefined") {
      var error = new Error("Bike not found in database");
      error.status = 404;
      return next(error);
    }
    Bike.findByIdAndRemove(req.body.bikeid, function (err) {
      if (err) { return next(err); }
      res.redirect("/index/bikes/");
    })
  });
};