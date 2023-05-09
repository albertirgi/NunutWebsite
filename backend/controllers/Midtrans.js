import { db } from "../config/db.js";
import midtransClient from "midtrans-client";
import { v4 as uuid } from "uuid";
import https from 'https'
const firestore = db.firestore();

export const topup2 = async(req, res) => {
  try{
    const data = req.body
    const wallet = await firestore
      .collection("wallet")
      .where("user_id", "==", data.user_id)
      .get();
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
              return wallet;
            })
            .catch((error) => {
              res.status(500).json({
                message: `Error while create wallet: ${error.toString()}`,
                status: 500,
              });
              return null;
            });
    const url = "https://api.sandbox.midtrans.com/v2/charge/"
    var payload;
    if(data.payment_type == "gopay"){
      payload = {
        "payment_type": "gopay",
        "transaction_details": {
          "order_id": uuid(),
          "gross_amount": 150000,
        },
        "gopay": {
          "enable_callback": true,
          "callback_url": "https://ayonunut.com/api/v1/handle-topup",
        },
      };
    }else if(data.payment_type == "bank_transfer" && (data.bank == "bca" || data.bank == "bni" || data.bank == "bri" || data.bank == "mandiri")){
      payload = {
        "payment_type": data.payment_type,
        "transaction_details": {
          "order_id": uuid(),
          "gross_amount": data.gross_amount,
        },
        "bank_transfer": {
          "bank": data.bank,
        },
      };
    }else if(data.payment_type == "echannel"){
      payload = {
        "payment_type": data.payment_type,
        "transaction_details": {
          "order_id": uuid(),
          "gross_amount": data.gross_amount,
        },
        "echannel": {
          "bill_info1": "AYONUNUT",
          "bill_info2": "Topup",
        },
      };
    }
    else if(data.payment_type == "permata"){
      payload = {
        "payment_type": data.payment_type,
        "transaction_details": {
          "order_id": uuid(),
          "gross_amount": data.gross_amount,
        }
      };
    }else{
      res.status(400).json({
        message: "Payment type not supported",
        status: 400
      })
      return
    }
    
    const options = {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Basic " + Buffer.from("SB-Mid-server-9QzxKyc37GPcw1gv_tBX77YR:", "utf8").toString("base64"),
      },
      timeout: 10000,
    };
    const post = new Promise ((resolve, reject) => {
      const request = https.request(url, options, (res) => {
        if(res.statusCode < 200 || res.statusCode > 299){
	  console.log(res);
          return reject(new Error('HTTP status code' + res.statusCode))
        }
        const body = []
        res.on('data', (chunk) => body.push(chunk))
        res.on('end', () => {
          const resString = Buffer.concat(body).toString()
          resolve(resString)
        })
      })
      request.on('error', (err) => {
        reject(err)
      })
      request.on('timeout', () => {
        request.destroy()
        reject(new Error("Request timeout"))
      })
      request.write(JSON.stringify(payload))
      request.end()
    })
    post.then(
      function(value){
        if(JSON.parse(value).status_code != "201"){
	  console.log(JSON.parse(value));
          res.status(500).json({
            message: "Transaction failed: " + JSON.parse(value).status_message,
            status: 400
          })
          return
        }
        firestore
          .collection("transaction")
          .doc(payload.transaction_details.order_id)
          .set({
            amount: parseInt(payload.transaction_details.gross_amount),
            status: JSON.parse(value).transaction_status,
            method: payload.payment_type,
            order_id: JSON.parse(value).order_id,
            transaction_id: JSON.parse(value).transaction_id,
            type: "topup",
            wallet_id: walletData.id,
            transaction_time: new Date(JSON.parse(value).transaction_time),
          })
          .then(() => {
            res.status(200).json({
              message: "Transaction created",
              data: JSON.parse(value),
              status: 200,
            });
          })
          .catch((error) => {
	    console.log(error);
            res.status(500).json({
              message: "Transaction failed: " + error.toString(),
              status: 400,
            });
          });
      },
      function(error){
	console.log(error);
        res.status(500).json({
          message: "Transaction failed: " + error.toString(),
          status: 400
        })
      }
    )
  } catch(err) {
    console.log(err);
    res.status(500).json({
      message: "Error while creating transaction: " + err.toString(),
      status: 500
    })
  }
}

export const topup = async (req, res) => {
  try {
    const data = req.body;
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
    const data = req.body;
    const transaction = await firestore.collection("transaction").doc(data.order_id).get();
    if (transaction.empty) {
      res.status(404).json({
        message: "No transaction record found",
        status: 404,
      })
      return
    }else if(transaction.data().status == "settlement"){
      res.status(403).json({
        message: "Transaction already settlement",
        status: 403,
      });
      return
    }

    if(data.transaction_status == "settlement"){
      const wallet = await firestore
        .collection("wallet")
        .doc(transaction.data().wallet_id)
        .get();
      if (wallet.empty) {
        res.status(404).json({
          message: "No wallet record found",
          status: 404,
        });
        return;
      }
      const walletData = wallet.data();
      const balance = walletData.balance + transaction.data().amount;
      await transaction.ref.update({
        status: "settlement",
        method: data.payment_type,
      });
      await wallet.ref.update({
        balance: balance,
      });
      res.status(200).json({
        message: "Topup successfuly",
        status: 200,
      });
    }else{
      await transaction.ref.update({
        status: data.transaction_status,
        method: data.payment_type,
      });
      res.status(200).json({
        message: "Topup is on " + data.transaction_status,
        status: 200,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: `Error while topup: ${error.toString()}`,
      status: 500,
    });
  }
}

export const getTransaction = async (req, res) => {
  try {
    const data = req.body;
    const transaction = await firestore.collection("transaction").doc(data.order_id).get();
    if (transaction.empty) {
      res.status(404).json({
        message: "No transaction record found",
        status: 404,
      })
      return
    }
    res.status(200).json({
      message: "Transaction record found",
      status: 200,
      data: transaction.data(),
    })
  } catch (error) {
    res.status(500).json({
      message: `Error while get transaction: ${error.toString()}`,
      status: 500,
    });
  }
}

export const getTransactionByWallet = async (req, res) => {
  try {
    const data = req.body;
    const transaction = await firestore.collection("transaction").where("wallet_id", "==", data.wallet_id).get();
    if (transaction.empty) {
      res.status(404).json({
        message: "No transaction record found",
        status: 404,
      })
      return
    }
    res.status(200).json({
      message: "Transaction record found",
      status: 200,
      data: transaction.docs.map((doc) => doc.data()),
    })
  } catch (error) {
    res.status(500).json({
      message: `Error while get transaction: ${error.toString()}`,
      status: 500,
    });
  }
}

export const getTransactionByWalletByList = async (req, res) => {
  try {
    const num = req.params.num;
    const data = req.body;
    const transaction = await firestore.collection("transaction").where("wallet_id", "==", data.wallet_id).get();
    if (transaction.empty) {
      res.status(404).json({
        message: "No transaction record found",
        status: 404,
      })
      return
    }
    res.status(200).json({
      message: "Transaction record found",
      status: 200,
      data: transaction.docs.map((doc) => doc.data()).slice(
          0 + (num - 1) * 10,
          num * 10
        ),
    })
  } catch (error) {
    res.status(500).json({
      message: `Error while get transaction: ${error.toString()}`,
      status: 500,
    });
  }
}

export const getWalletBalance = async (req, res) => {
  try {
    const data = req.body;
    const wallet = await firestore.collection("wallet").where("user_id", "==", data.user_id).get();
    if (wallet.empty) {
      res.status(404).json({
        message: "No wallet record found",
        status: 404,
      });
      return;
    }
    const walletData = wallet.docs[0].data();
    res.status(200).json({
      message: "Wallet record found",
      status: 200,
      data: {
        id: wallet.docs[0].id,
        ...walletData,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: `Error while get wallet: ${error.toString()}`,
      status: 500,
    });
  }
}
