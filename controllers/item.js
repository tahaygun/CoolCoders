const fs = require("fs");
const { check, validationResult } = require("express-validator/check");
function itemController(router, upload, auth) {
  var validations = [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2 })
      .withMessage("Firstname should be at least 2 letters"),
    check("shortDesc")
      .not()
      .isEmpty()
      .withMessage("Short description is required")
      .isLength({ min: 2 })
      .withMessage("Short description should be at least 2 letters"),
    check("longDesc")
      .not()
      .isEmpty()
      .withMessage("Long description is required")
      .isLength({ min: 2 })
      .withMessage("Long description should be at least 2 letters"),
    check("price")
      .not()
      .isEmpty()
      .withMessage("Price is required")
      .isNumeric()
      .withMessage("Price should be a number.")
  ];
  //To get all itemS
  router.get("/allitems", (req, res) => {
    Item.find()
      .sort([["createdAt", "descending"]])
      .then(items => {
        res.json(items);
      })
      .catch(err => {
        res.status(404).json(err);
      });
  });

  //@to get one item
  router.get("/item/:itemid", (req, res) => {
    Item.findById(req.params.itemid)
      .then(item => {
        res.json(item);
      })
      .catch(err => res.status(404).json(err));
  });
  //@to get one item
  router.get("/itembySeqId/:id", (req, res) => {
    Item.findOne({ seqId: req.params.id })
      .then(item => {
        res.json(item);
      })
      .catch(err => res.status(404).json(err));
  });

  //@To create item

  router.post(
    "/additem",
    upload.fields([{ name: "imgUrl", maxCount: 1 }]),
    auth,
    validations,
    (req, res) => {
      var errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.mapped() });
      }
      var filename = null;
      if (req.files && req.files.imgUrl && req.files.imgUrl[0]) {
        filename = req.files.imgUrl[0].filename;
      }
      var item = new Item(req.body);
      item.imgUrl = filename;
      item
        .save()
        .then(saveditem => {
          res.json(saveditem);
        })
        .catch(err => {
          res.status(404).send(err);
        });
    }
  );

  //@To edit item
  var oldImg = "";
  router.put(
    "/edititem/:id",
    upload.fields([{ name: "imgUrl", maxCount: 1 }]),
    auth, //multer files upload
    validations,
    (req, res) => {
      var errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(500).send({ errors: errors.mapped() });
      }
      Item.findById(req.params.id)
        .then(item => {
          item.name = req.body.name;
          item.shortDesc = req.body.shortDesc;
          item.shortDesc = req.body.shortDesc;
          item.longDesc = req.body.longDesc;
          item.price = req.body.price;
          if (req.files.imgUrl) {
            oldImg = item.imgUrl; //we store path of old image to delete it later
            item.imgUrl = req.files.imgUrl[0].filename;
            if (fs.existsSync(`./uploads/${oldImg}`)) {
              fs.unlinkSync(`./uploads/${oldImg}`);
            }
          }
          item
            .save()
            .then(result => {
              res.send(result);
            })
            .catch(err => res.send(err));
        })
        .catch(error => {
          res.status(404).send(error);
        });
    }
  );

  //@To delete item
  router.delete("/deleteitem/:id", auth, (req, res) => {
    Item.findByIdAndRemove(req.params.id)
      .then(result => {
        if (fs.existsSync(`./uploads/${result.imgUrl}`)) {
          fs.unlinkSync(`./uploads/${result.imgUrl}`);
        }
        res.send(result);
      })
      .catch(err => res.send(err));
  });
}

module.exports = itemController;
