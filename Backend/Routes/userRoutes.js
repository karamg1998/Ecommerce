let express=require('express');
let router=express.Router();
let loginController=require('../Controller/user')


router.get('/login',loginController.login);
router.post('/signup',loginController.signup);
router.post('/forgot',loginController.forgot);
router.put('/forgot/success',loginController.forgotSuccess)


module.exports=router;