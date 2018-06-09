const { check, validationResult } = require("express-validator/check");
//To get all coupons
function couponController(router,auth) {
  var validation = [
    check("couponCode")
      .not()
      .isEmpty()
      .withMessage("Coupon is required!")
  ];
  router.post("/homelogin", validation, (req, res) => {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).send({ errors: "Coupon code is required!" });
    }
    Coupon.findOne({ couponCode: req.body.couponCode })
      .then(coupon => {
        if (coupon) {
          req.session.couponCode = coupon.couponCode;
          res.json({ isLoggedIn: true, coupon: coupon.couponCode });
        } else {
          res.status(401).json({ errors: "Invalid coupon code!" });
        }
      })
      .catch(function(error) {
        res.status(401).send(error);
      });
  });


//get all coupons 
router.get("/allcoupons",auth, (req, res) => {
  Coupon.find()
  .then(coupons => {
    res.json(coupons);
  })
  .catch(err => {
    res.status(404).json(err);
  });
});

  //@to check session for coupon
  router.get('/isvalidcoupon',(req,res)=>{
    if (req.session.couponCode) {
      res.send({isLoggedIn:true})
    }else{
      res.status(401).send({isLoggedIn:false})      
    }
  })


  //@To create coupon
  router.post("/addcoupon",auth, validation, (req, res) => {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).send({ errors: errors.mapped() });
    }
    var coupon = new Coupon(req.body);
    coupon
      .save()
      .then(savedcoupon => {
        res.json(savedcoupon);
      })
      .catch(err => {
        res.status(400).send(err);
      });
  });

  //@To delete coupon
  router.delete("/deletecoupon/:id",auth, (req, res) => {
    Coupon
      .findByIdAndRemove(req.params.id)
      .then(result => {
        res.send(result);
      })
      .catch(err => res.send(err));
  });
}
module.exports = couponController;
