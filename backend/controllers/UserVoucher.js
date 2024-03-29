import UserVoucher from '../models/userVoucherModel.js';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
let token = null;
const firestore = db.firestore();

export const storeUserVoucher = async (req, res) => {
  try {
    const data = req.body;
    await firestore.collection('user_voucher').doc().set(data);
    res.status(200).json({
      message: 'User voucher data saved successfuly',
      status: 200,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while saving data: ' + error.toString(),
      status: 500,
    })
  }
}

export const getAllUserVouchers = async (req, res) => {
  try {
    const data = await firestore.collection('user_voucher').get();
    const userVoucherArray = [];
    const user = await firestore.collection('users').get();
    const userArray = req.query.user !== undefined ? user.docs.map(doc => {
      return {
        user_id: doc.id,
        ...doc.data()
      }
    }) : null;
    const voucher = await firestore.collection('voucher').get();
    const voucherArray = req.query.voucher !== undefined ? voucher.docs.map(doc => {
      return {
        voucher_id: doc.id,
        ...doc.data()
      }
    }) : null;
    if (data.empty) {
      res.status(404).json({
        message: 'No user voucher record found',
        status: 404,
      });
    } else {
      data.forEach(doc => {
        const userVoucher = new UserVoucher(
          doc.id,
          req.query.user !== undefined ? userArray.find(user => user.id === doc.data().user_id) : doc.data().user_id,
          req.query.voucher !== undefined ? voucherArray.find(voucher => voucher.id === doc.data().voucher_id) : doc.data().voucher_id
        )
        userVoucherArray.push(userVoucher);
      });
      res.status(200).json({
        message: 'User voucher data retrieved successfuly',
        data: userVoucherArray,
        status: 200
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while fetching data: ' + error.toString(),
      status: 500
    });
  }
}

export const getUserVoucherById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await firestore.collection('user_voucher').doc(id).get();
    const user = await firestore.collection('users').get();
    const userArray = req.query.user !== undefined ? user.docs.map(doc => {
      return {
        user_id: doc.id,
        ...doc.data()
      }
    }) : null;
    const voucher = await firestore.collection('voucher').get();
    const voucherArray = req.query.voucher !== undefined ? voucher.docs.map(doc => {
      return {
        voucher_id: doc.id,
        ...doc.data()
      }
    }) : null;
    if (!data.exists) {
      res.status(404).json({
        message: 'User voucher with the given ID not found',
        status: 404,
      })
    } else {
      res.status(200).json({
        message: "User voucher data retrieved successfuly",
        data: {
          id: data.id,
          user:
            req.query.user !== undefined
              ? userArray.find((user) => user.user_id === data.data().user_id)
              : data.data().user_id,
          voucher:
            req.query.voucher !== undefined
              ? voucherArray.find(
                  (voucher) => voucher.voucher_id === data.data().voucher_id
                )
              : data.data().voucher_id,
        },
        status: 200,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while fetching data: ' + error.toString(),
      status: 500
    });
  }
}

export const updateUserVoucher = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const userVoucher = firestore.collection('user_voucher').doc(id);
    await userVoucher.update(data);
    res.status(200).json({
      message: 'User voucher record updated successfuly',
      status: 200
    });
  } catch (error) {
    res.status(400).json({
      message: 'Something went wrong while updating data: ' + error.toString(),
      status: 400
    })
  }
}

export const destroyUserVoucher = async (req, res) => {
  try {
    const id = req.params.id;
    await firestore.collection('user_voucher').doc(id).delete();
    res.status(200).json({
      message: 'User voucher record deleted successfuly',
      status: 200
    });
  } catch (error) {
    res.status(400).json({
      message: 'Something went wrong while deleting data: ' + error.toString(),
      status: 400
    })
  }
}

