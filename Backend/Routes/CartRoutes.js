let express=require('express');
let router=express.Router();
let cartController=require('../Controller/Cart')



router.post('/addtocart',cartController.addtocart);
router.get('/getcart',cartController.getCart);
router.post('/updateQty',cartController.updateQuantity);
router.post('/removeItem',cartController.remove);

module.exports=router;