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
      minimum: data.minimum,
      maximum: data.maximum,
      tnc: data.tnc,
      image: imageUrl,
      type: data.type,
      discount: data.discount
    })
    res.send('Record saved successfuly')
  } catch (error) {
    res.status(400).send(error.message)
  }
}

export const getAllVouchers = async (req, res) => {
  try {
    const data = await firestore.collection('voucher').get()
    const voucherArray = []
    if (data.empty) {
      res.status(404).send('No voucher record found')
    } else {
      data.forEach(doc => {
        const voucher = new Voucher(
          doc.id,
          doc.data().code,
          doc.data().expired_at,
          doc.data().minimum,
          doc.data().maximum,
          doc.data().tnc,
          doc.data().image,
          doc.data().type,
          doc.data().discount
        )
        voucherArray.push(voucher)
      })
      res.status(200).send({
        message: 'Voucher data retrieved successfuly',
        data: voucherArray,
        status: 200
      })
    }
  } catch (error) {
    res.status(500).send({
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
      res.status(404).send('Voucher with the given ID not found')
    } else {
      res.status(200).send({
        message: 'Voucher data retrieved successfuly',
        data: {
          id: data.id,
          code: data.data().code,
        },
        status: 200
      })
    }
  } catch (error) {
    res.status(500).send({
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
        minimum: data.minimum ? data.minimum : voucherData.data().minimum,
        maximum: data.maximum ? data.maximum : voucherData.data().maximum,
        tnc: data.tnc ? data.tnc : voucherData.data().tnc,
        image: image ? imageUrl : voucherData.data().image,
        type: data.type ? data.type : voucherData.data().type,
        discount: data.discount ? data.discount : voucherData.data().discount,
      });
    res.send("Record saved successfuly");
  } catch (error) {
    res.status(400).send(error.message)
  }
}

export const destroyVoucher = async (req, res) => {
  try {
    const id = req.params.id
    await firestore.collection('voucher').doc(id).delete()
    res.status(200).send('Voucher record deleted successfuly')
  } catch (error) {
    res.status(400).send(error.message)
  }
}

