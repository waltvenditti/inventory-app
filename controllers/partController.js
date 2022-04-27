var Part = require("../models/part");

var async = require("async");

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
  res.send("NOT IMPLEMENTED: part create get");
};

// Display part create on POST
exports.part_create_post = function (req, res) {
  res.send("NOT IMPLEMENTED: part create post");
};

// Display form for part update GET
exports.part_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: part update get");
};

// Process part update POST request
exports.part_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: part update post");
};

// Display form for part delete GET
exports.part_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED: part delete get");
};

// Process request for part delete POST
exports.part_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED: part delete post");
};