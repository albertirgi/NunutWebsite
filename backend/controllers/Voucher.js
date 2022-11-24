import Voucher from '../models/voucherModel.js'
import jwt from 'jsonwebtoken'
import { db } from '../config/db.js'
let token = null
const firestore = db.firestore()

export const storeVoucher = async (req, res) => {
  try {
    const data = req.body
    await firestore.collection('vouchers').doc().set(data)
    res.send('Record saved successfuly')
  } catch (error) {
    res.status(400).send(error.message)
  }
}

export const getAllVouchers = async (req, res) => {
  try {
    const data = await firestore.collection('vouchers').get()
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
          doc.data().title,
          doc.data().tnc,
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
    const data = await firestore.collection('vouchers').doc(id).get()
    if (!data.exists) {
      res.status(404).send('Voucher with the given ID not found')
    } else {
      res.status(200).send({
        message: 'Voucher data retrieved successfuly',
        data: data.data(),
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
    const data = req.body
    const voucher = await firestore.collection('vouchers').doc(id)
    await voucher.update(data)
    res.status(200).send('Voucher record updated successfuly')
  } catch (error) {
    res.status(400).send(error.message)
  }
}

export const destroyVoucher = async (req, res) => {
  try {
    const id = req.params.id
    await firestore.collection('vouchers').doc(id).delete()
    res.status(200).send('Voucher record deleted successfuly')
  } catch (error) {
    res.status(400).send(error.message)
  }
}

