const express=require('express');
const router=express.Router();
const orderController=require('../Controller/Order');

router.post('/makeOrder',orderController.makeOrder);
router.get('/getorders',orderController.getOrder);
router.post('/make-1-Order',orderController.singleOrder);

module.exports=router;