import { db } from "../config/db.js";
import midtransClient from "midtrans-client";
import { v4 as uuid } from "uuid";
const firestore = db.firestore();

export const topup = async (req, res) => {
  try {
    const data = req.body;
    console.log(`data: ${data.toString()}`)
    const wallet = await firestore.collection("wallet").where("user_id", "==", data.user_id).get();
    const walletData =
      wallet.empty == false
        ? wallet.docs[0]
        : await firestore
            .collection("wallet")
            .add({
              balance: 0,
              user_id: data.user_id,
            })
            .then((wallet) => {
              return wallet
            })
            .catch((error) => {
              res.status(500).json({
                message: `Error while create wallet: ${error.toString()}`,
                status: 500,
              });
              return null;
            });
    
    let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: "SB-Mid-server-9QzxKyc37GPcw1gv_tBX77YR",
    });
    const order_id = uuid();

    let parameter = {
      transaction_details: {
        order_id: order_id,
        gross_amount: data.gross_amount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
      },
    };

    snap.createTransaction(parameter).then((transaction) => {
      // transaction token
      let transactionToken = transaction.token;
      firestore.collection("transaction").doc(order_id).set({
        amount: data.gross_amount,
        method: "",
        order_id: order_id,
        status: "pending",
        token: transactionToken,
        type: "topup",
        wallet_id: walletData.id,
      }).then(() => {
        res.status(200).json({
          message: "Snap token generated successfuly",
          status: 200,
          token: transactionToken,
          redirect_url:
            "https://app.sandbox.midtrans.com/snap/v2/vtweb/" + transactionToken,
        });
      }).catch((error) => {
        res.status(500).json({
          message: `Error while save transaction: ${error.toString()}`,
          status: 500,
        });
      })
    });
  } catch (error) {
    res.status(500).json({
      message: `Error while fetch snap token: ${error.toString()}`,
      status: 500,
    });
  }
};

export const handleTopup = async (req, res) => {
  try {
    console.log(`data: ${JSON.stringify(req.body)}`)
    const data = req.body;
    const transaction = await firestore.collection("transaction").doc(data.order_id).get();
    if (transaction.empty) {
      res.status(404).json({
        message: "No transaction record found",
        status: 404,
      })
      return
    }else if(transaction.data().status == "success"){
      res.status(403).json({
        message: "Transaction already success",
        status: 403,
      });
      return
    }
    const wallet = await firestore.collection("wallet").doc(transaction.data().wallet_id).get();
    if (wallet.empty) {
      res.status(404).json({
        message: "No wallet record found",
        status: 404,
      })
      return
    }
    const walletData = wallet.data()
    const balance = walletData.balance + transaction.data().amount;
    await transaction.ref.update({
      status: "success",
      method: data.payment_type,
    });
    await wallet.ref.update({
      balance: balance,
    });
    res.status(200).json({
      message: "Topup successfuly",
      status: 200,
    });
  } catch (error) {
    console.log(error.toString())
    res.status(500).json({
      message: `Error while topup: ${error.toString()}`,
      status: 500,
    });
  }
}