const express=require('express');
const router=express.Router();
const prodController=require('../Controller/Prods');
const multer=require('multer');

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        return cb(null,"./images")
    },
    filename:function(req,file,cb){
        return cb(null,`${Date.now()}_${file.originalname}`)
    }
})

const upload=multer({storage});



router.post('/addProd',upload.single('image'),prodController.Addprod);
router.get('/get-prod',prodController.getProd);


module.exports=router;