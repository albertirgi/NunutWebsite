import UserVoucher from '../models/userVoucherModel.js';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
let token = null;
const firestore = db.firestore();

export const storeUserVoucher = async (req, res) => {
  try {
    const data = req.body;
    await firestore.collection('user_vouchers').doc().set(data);
    res.send('Record saved successfuly');
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export const getAllUserVouchers = async (req, res) => {
  try {
    const data = await firestore.collection('user_vouchers').get();
    const userVoucherArray = [];
    if (data.empty) {
      res.status(404).send('No user voucher record found');
    } else {
      data.forEach(doc => {
        const userVoucher = new UserVoucher(
          doc.id,
          doc.data().user_id,
          doc.data().voucher_id,
        );
        userVoucherArray.push(userVoucher);
      });
      res.status(200).send({
        message: 'User voucher data retrieved successfuly',
        data: userVoucherArray,
        status: 200
      });
    }
  } catch (error) {
    res.status(500).send({
      message: 'Something went wrong while fetching data: ' + error.toString(),
      status: 500
    });
  }
}

export const getUserVoucherById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await firestore.collection('user_vouchers').doc(id).get();
    if (!data.exists) {
      res.status(404).send('User voucher with the given ID not found');
    } else {
      res.status(200).send({
        message: 'User voucher data retrieved successfuly',
        data: data.data(),
        status: 200
      });
    }
  } catch (error) {
    res.status(500).send({
      message: 'Something went wrong while fetching data: ' + error.toString(),
      status: 500
    });
  }
}

export const updateUserVoucher = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const userVoucher = await firestore.collection('user_vouchers').doc(id);
    await userVoucher.update(data);
    res.status(200).send({
      message: 'User voucher record updated successfuly',
      status: 200
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export const destroyUserVoucher = async (req, res) => {
  try {
    const id = req.params.id;
    await firestore.collection('user_vouchers').doc(id).delete();
    res.status(200).send({
      message: 'User voucher record deleted successfuly',
      status: 200
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
}

