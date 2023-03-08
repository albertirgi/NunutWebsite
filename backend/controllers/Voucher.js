import Voucher from '../models/voucherModel.js'
import jwt from 'jsonwebtoken'
import { db } from '../config/db.js'
import { v4 as uuid } from 'uuid'
const storage = db.storage().bucket()
let token = null
const firestore = db.firestore()

export const storeVoucher = async (req, res) => {
  try {
    const data = req.body
    const image = req.file
    // Upload image to storage
    const imagePromise = new Promise((resolve, reject) => {
      const fileNameImage = uuid() + image.originalname;
      const file = storage.file(fileNameImage);
      file.save(image.buffer, { contentType: image.mimetype }, function (err) {
        if (err) {
          let imageMessage = "Error occured while uploading image: " + err;
          reject(imageMessage);
        } else {
          file.makePublic();
          resolve(file.publicUrl());
        }
      });
    })
    const imageUrl = await imagePromise
    await firestore.collection('voucher').doc().set({
      code: data.code,
      expired_at: data.expired_at,
      minimum_purchase: parseInt(data.minimum),
      maximum_discount: parseInt(data.maximum),
      tnc: data.tnc,
      image: imageUrl,
      type: data.type,
      discount: data.discount
    })
    res.status(200).json({
      message: 'Voucher created successfully',
      status: 200
    })
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Something went wrong while creating voucher',
      status: 500
    })
  }
}

export const getAllVouchers = async (req, res) => {
  try {
    const data = await firestore.collection('voucher').get()
    const userVoucher = await firestore.collection('user_voucher').get()
    const userVoucherArray = userVoucher.docs.map((doc) => {
      return {
        user_voucher_id: doc.id,
        ...doc.data()
      }
    });
    var voucherArray = []
    if (data.empty) {
      res.status(404).json({
        message: 'No voucher record found',
        status: 404
      })
    } else {
      data.forEach(doc => {
        const voucher = new Voucher(
          doc.id,
          doc.data().code,
          doc.data().expired_at,
          doc.data().minimum_purchase,
          doc.data().maximum_discount,
          doc.data().tnc,
          doc.data().image,
          doc.data().type,
          doc.data().discount
        );
        voucherArray.push(voucher)
      })
      if(req.query.user !== undefined && req.query.user !== ''){
        voucherArray = voucherArray.filter(
          (voucher) => {
            const userVoucherData = userVoucherArray.find((uv) => {
              return uv.voucher_id == voucher.voucher_id && uv.user_id == req.query.user
            });
            if(userVoucherData == undefined){
              return true;
            }else{
              return false;
            }
          }
        );
        res.status(200).json({
          message: "Voucher data retrieved successfuly",
          data: voucherArray,
          status: 200,
        });
      }else{  
        res.status(200).json({
          message: "Voucher data retrieved successfuly",
          data: voucherArray,
          status: 200,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while fetching data: ' + error.toString(),
      status: 500
    })
  }
}

export const getVoucherById = async (req, res) => {
  try {
    const id = req.params.id
    const data = await firestore.collection('voucher').doc(id).get()
    if (!data.exists) {
      res.status(404).json({
        message: 'Voucher with the given ID not found',
        status: 404
      })
    } else {
      res.status(200).json({
        message: 'Voucher data retrieved successfuly',
        data: {
          id: data.id,
          code: data.data().code,
        },
        status: 200
      })
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while fetching data: ' + error.toString(),
      status: 500
    })
  }
}

export const updateVoucher = async (req, res) => {
  try {
    const id = req.params.id
    const data = req.body;
    const image = req.file;
    const voucher = firestore.collection("voucher").doc(id);
    const voucherData = await voucher.get();
    // Upload image to storage
    const imagePromise = new Promise((resolve, reject) => {
      const fileNameImage = uuid() + image.originalname;
      const file = storage.file(fileNameImage);
      file.save(image.buffer, { contentType: image.mimetype }, function (err) {
        if (err) {
          let imageMessage = "Error occured while uploading image: " + err;
          reject(imageMessage);
        } else {
          file.makePublic();
          resolve(file.publicUrl());
        }
      });
    });
    const imageUrl = await imagePromise;
    await firestore
      .collection("voucher")
      .doc(id)
      .set({
        code: data.code ? data.code : voucherData.data().code,
        expired_at: data.expired_at ? data.expired_at : voucherData.data().expired_at,
        minimum_purchase: data.minimum_purchase ? data.minimum_purchase : voucherData.data().minimum_purchase,
        maximum_discount: data.maximum_discount ? data.maximum_discount : voucherData.data().maximum_discount,
        tnc: data.tnc ? data.tnc : voucherData.data().tnc,
        image: image ? imageUrl : voucherData.data().image,
        type: data.type ? data.type : voucherData.data().type,
        discount: data.discount ? data.discount : voucherData.data().discount,
      });
    res.status(200).json({
      message: "Voucher updated successfully",
      status: 200,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong while updating voucher",
      status: 500,
    })
  }
}

export const destroyVoucher = async (req, res) => {
  try {
    const id = req.params.id
    await firestore.collection('voucher').doc(id).delete()
    res.status(200).json({
      message: 'Voucher record deleted successfuly',
      status: 200
    })
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while deleting data: ' + error.toString(),
      status: 500
    })
  }
}

