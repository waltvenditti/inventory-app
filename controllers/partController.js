var Part = require("../models/part");
var Service = require("../models/service");

var async = require("async");
const { body, validationResult } = require("express-validator");

// Display list of all parts
exports.part_list = function (req, res, next) {
  async.parallel(
    {
      wheels: function (callback) {
        Part.find({ type: "Wheel" }, "name manf price invCount")
          .sort({ manf: 1 })
          .exec(callback);
      },
      cranksets: function (callback) {
        Part.find({ type: "Crankset" }, "name manf price invCount")
          .sort({ manf: 1 })
          .exec(callback);
      },
      drivetrains: function (callback) {
        Part.find({ type: "Drivetrain" }, "name manf price invCount")
          .sort({ manf: 1 })
          .exec(callback);
      },
      tires: function (callback) {
        Part.find({ type: "Tire" }, "name manf price invCount")
          .sort({ manf: 1 })
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) { 
        return next(err); 
      }
      res.render("part_list", {
        title: "Parts Inventory",
        wheel_list: results.wheels,
        crankset_list: results.cranksets,
        drivetrain_list: results.drivetrains,
        tire_list: results.tires,
      });
    }
  );
};

// Display info page for a specific part
exports.part_info = function (req, res, next) {
  Part.findById(req.params.id)
    .populate("services")
    .exec(function (err, part) {
      if (err) { return next(err); 0}
      if (part == null) {
        var err = new Error("Part not found");
        err.status = 404;
        return next(err);
      }
      res.render("part_info", {
        title: `${part.manf} ${part.name} ${part.type}`,
        part: part,
      });
    });
};

// Display part create form on GET
exports.part_create_get = function (req, res) {
  res.render("part_form", {
    title: "Add New Part",
  });
};

// Display part create on POST
exports.part_create_post = [
  // Validate and sanitize all fields
  body("partName").trim().isLength({ min: 1 }).escape().withMessage("Part must have a name."),
  body("price").trim().isLength({ min: 1 }).escape().withMessage("Part must have a price.").isNumeric().withMessage("Price can be numbers (with a decimal point) only."),
  body("invCount").optional({ checkFalsy: true }).trim().escape().isNumeric(),
  body("manf").optional({ checkFalsy: true }).trim().escape(),
  body("type").optional({ checkFalsy: true }).trim().escape(),
  body("specs").optional({ checkFalsy: true }).trim().escape(),
  body("sizeInfo").optional({ checkFalsy: true }).trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    Service.find({ serviceType: "Part" }).sort({ service: 1 }).exec(function (err, results) {
      if (err) { return next(err); }
      // convert strings to arrays
      let specsArray = req.body.specs.split(",");
      let sizeInfoArray = req.body.sizeInfo.split(",");
      // iterate to remove whitespace from array eles
      for (let i = 0; i < specsArray.length; i++) {
        specsArray[i] = specsArray[i].trim();
      }
      for (let i = 0; i < sizeInfoArray.length; i++) {
        sizeInfoArray[i] = sizeInfoArray[i].trim();
      }
      // check for and remove blank terminal element
      if (specsArray[specsArray.length-1]==="") {
        specsArray.pop();
      }
      if (sizeInfoArray[sizeInfoArray.length-1]==="") {
        sizeInfoArray.pop();
      }
      // create part obj
      var part = new Part({
        name: req.body.partName,
        price: req.body.price,
        manf: req.body.manf,
        type: req.body.type,
        invCount: req.body.invCount,
        specs: specsArray,
        sizeInfo: sizeInfoArray,
      });
      // check errors empty
      if (!errors.isEmpty()) {
        res.render("part_form", {
          title: "Add New Part",
          part: part,
          errors: errors.array(),
        })
      } else {
        part.save(function (err) {
          if (err) { return next(err); }
          res.redirect(part.url);
        })
      }
    });
  },
];

// Display form for part update GET
exports.part_update_get = function (req, res) {
  Part.findById(req.params.id).exec(function (err, part) {
    if (err) { return next(err); }
    if (part===null) {
      // part not found
      res.redirect("/index/parts");
    }
    res.render("part_form", {
      title: `Update Part: ${part.manf} ${part.name} ${part.type}`,
      part: part,
    });
  });
};

// Process part update POST request
exports.part_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: part update post");
};

// Display form for part delete GET
exports.part_delete_get = function (req, res) {
  Part.findById(req.params.id).exec(function (err, part) {
    if (err) { return next(err); }
    if (part===null) {
      // part not found
      res.redirect("/index/parts");
    }
    res.render("part_delete", {
      title: `Delete Part: ${part.manf} ${part.name} ${part.type}`,
      part: part,
    });
  });
};

// Process request for part delete POST
exports.part_delete_post = function (req, res) {
  Part.findById(req.body.partid).exec(function (err, part) {
    if (err) { return next(err); }
    if (part==="undefined") {
      var error = new Error("Part not found");
      error.status = 404;
      return next(error);
    }
    Part.findByIdAndRemove(req.body.partid, function (err) {
      if (err) { return next(err); }
      res.redirect("/index/parts/");
    });
  });
};