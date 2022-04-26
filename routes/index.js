var express = require("express");
var router = express.Router();

// Import controller modules
var bike_controller = require("../controllers/bikeController");
var part_controller = require("../controllers/partController");
var service_controller = require("../controllers/serviceController");

// GET home page. 
router.get("/", function(req, res, next) {
  res.redirect("/index");
});

router.get("/index", bike_controller.index);


/// BIKE ROUTES ///

// GET request for bike create
router.get("/index/bike/create", bike_controller.bike_create_get);

// POST request for bike create
router.post("/index/bike/create", bike_controller.bike_create_post);

// GET request for bike update
router.get("/index/bike/:id/update", bike_controller.bike_update_get);

// POST request for bike update
router.post("/index/bike/:id/update", bike_controller.bike_update_post);

// bike delete GET
router.get("/index/bike/:id/delete", bike_controller.bike_delete_get);

// bike delete POST
router.post("/index/bike/:id/delete", bike_controller.bike_delete_post);

// GET request for a specific bike
router.get("/index/bike/:id", bike_controller.bike_info);

// GET request for viewing list of all bikes
router.get("/index/bikes", bike_controller.bike_list);


/// PART ROUTES ///

// GET request for part create
router.get("/index/part/create", part_controller.part_create_get);

// POST request for part create
router.post("/index/part/create", part_controller.part_create_post);

// GET request for part update
router.get("/index/part/:id/update", part_controller.part_update_get);

// POST request for part update
router.post("/index/part/:id/update", part_controller.part_update_post);

// part delete GET
router.get("/index/part/:id/delete", part_controller.part_delete_get);

// part delete POST
router.post("/index/part/:id/delete", part_controller.part_delete_post);

// GET request for a specific part
router.get("/index/part/:id", part_controller.part_info);

// GET request for viewing list of all parts
router.get("/index/parts", part_controller.part_list);


/// SERVICE ROUTES ///

// GET request for service create
router.get("/index/service/create", service_controller.service_create_get);

// POST request for service create
router.post("/index/service/create", service_controller.service_create_post);

// GET request for service update
router.get("/index/service/:id/update", service_controller.service_update_get);

// POST request for service update
router.post("/index/service/:id/update", service_controller.service_update_post);

// service delete GET
router.get("/index/service/:id/delete", service_controller.service_delete_get);

// service delete POST
router.post("/index/service/:id/delete", service_controller.service_delete_post);

// GET request for a specific service
router.get("/index/service/:id", service_controller.service_info);

// GET request for viewing list of all services
router.get("/index/services", service_controller.service_list);


module.exports = router;
