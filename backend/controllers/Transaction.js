import Transaction from '../models/transactionModel.js';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
import { getWalletById } from './Wallet.js';
let token = null;
const firestore = db.firestore();

export const storeTransaction = async (req, res) => {
  try {
    const data = req.body;
    await firestore.collection('transaction').doc().set(data);
    res.send('Record saved successfuly');
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export const getAllTransactions = async (req, res) => {
  try {
    const data = await firestore.collection('transaction').get();
    const transactionArray = [];
    const wallet = await firestore.collection('wallet').get();
    const walletArray =
      req.query.wallet !== undefined
        ? wallet.docs.map(doc => {
            return {
              id: doc.id,
              ...doc.data(),
            };
          })
        : null;
    if (data.empty) {
      res.status(404).send('No transaction record found');
    } else {
      data.forEach(doc => {
        const transaction = new Transaction(
          doc.id,
          req.query.wallet !== undefined ? walletArray.find(wallet => wallet.id === doc.data().wallet_id) : doc.data().wallet_id,
          doc.data().order_id,
          doc.data().token,
          doc.data().amount,
          doc.data().method,
          doc.data().status,
          doc.data().type
        );
        transactionArray.push(transaction);
      });
      res.status(200).send({
        message: 'Transaction data retrieved successfuly',
        data: transactionArray,
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

export const getTransactionById = async (req, res) => {
  try {
    const id = req.params.id;
    const transaction = await firestore.collection('transaction').doc(id).get();
    const wallet = await firestore.collection('wallet').get();
    const walletData = req.query.wallet !== undefined ? wallet.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    }) : null;

    if (!transaction.exists) {
      res.status(404).send('Transaction with the given ID not found');
    } else {
      res.status(200).send({
        message: 'Transaction data retrieved successfuly',
        data: {
          id: transaction.data().id,
          wallet: req.query.wallet !== undefined ? walletData.find(wallet => wallet.id === transaction.data().wallet_id) : transaction.data().wallet_id,
          order_id: transaction.data().order_id,
          token: transaction.data().token,
          amount: transaction.data().amount,
          method: transaction.data().method,
          status: transaction.data().status,
          type: transaction.data().type
        },
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

export const updateTransaction = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const transaction = firestore.collection('transaction').doc(id);
    await transaction.update(data);
    res.status(200).send({
      message: 'Transaction record updated successfuly',
      status: 200
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export const destroyTransaction = async (req, res) => {
  try {
    const id = req.params.id;
    await firestore.collection('transaction').doc(id).delete();
    res.status(200).send({
      message: 'Transaction record deleted successfuly',
      status: 200
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
}