const express = require('express');
const router = express.Router();

const { AddAddress, getMyAddress, getAddressById, updateAddress, DeleteAddress } = require('../controllers/address.controller');
const authMiddleWare = require('../middleWares/authMiddleware');

router.post('/addAddress', authMiddleWare, AddAddress);
router.get('/getMyAddress', authMiddleWare, getMyAddress);
router.get('/getAddress/:id', authMiddleWare, getAddressById);
router.put('/updateAddress/:id', authMiddleWare, updateAddress);
router.delete('/deleteAddress/:id', authMiddleWare, DeleteAddress); 


module.exports = router;