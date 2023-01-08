import Wallet from '../models/walletModel.js';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
let token = null;
const firestore = db.firestore();

export const storeWallet = async (req, res) => {
  try {
    const data = req.body;
    await firestore.collection('wallet').doc().set(data);
    res.status(200).json({
      message: 'Wallet data saved successfuly',
      status: 200,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while saving data: ' + error.toString(),
      status: 500,
    })
  }
}

export const getAllWallets = async (req, res) => {
  try {
    const data = await firestore.collection('wallet').get();
    const walletArray = [];
    const user = await firestore.collection('users').get();
    const userArray =
      req.query.user !== undefined
        ? user.docs.map(doc => {
            return {
              user_id: doc.id,
              ...doc.data(),
            };
          })
        : null;
    if (data.empty) {
      res.status(404).json({
        message: 'No wallet record found',
        status: 404,
      })
    } else {
      data.forEach(doc => {
        const wallet = new Wallet(
          doc.id,
          req.query.user !== undefined
            ? userArray.find((user) => user.user_id === doc.data().user_id)
            : doc.data().user_id,
          doc.data().balance
        );
        walletArray.push(wallet);
      });
      res.status(200).json({
        message: 'Wallet data retrieved successfuly',
        data: walletArray,
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

export const getWalletById = async (req, res) => {
  try {
    const id = req.params.id;
    const wallet = firestore.collection('wallet').doc(id);
    const data = await wallet.get();
    if (!data.exists) {
      res.status(404).json({
        message: 'Wallet with the given ID not found',
        status: 404,
      });
    } else {
      res.status(200).json({
        message: 'Wallet data retrieved successfuly',
        data: data.data(),
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

export const updateWallet = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const wallet = firestore.collection('wallet').doc(id);
    await wallet.update(data);
    res.status(200).json({
      message: 'Wallet record updated successfuly',
      status: 200
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while updating data: ' + error.toString(),
      status: 500
    });
  }
}

export const destroyWallet = async (req, res) => {
  try {
    const id = req.params.id;
    await firestore.collection('wallet').doc(id).delete();
    res.status(200).json({
      message: 'Wallet record deleted successfuly',
      status: 200
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while deleting data: ' + error.toString(),
      status: 500
    });
  }
}