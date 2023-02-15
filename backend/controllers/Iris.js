import { db } from "../config/db.js";
import { v4 as uuid } from "uuid";
import https from "https";
import fetch from "node-fetch";
const firestore = db.firestore();

export const storeBeneficiary = async (req, res) => {
  try {
    const url = "https://app.sandbox.midtrans.com/iris/api/v1/beneficiaries";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:
          "Basic " +
          Buffer.from(
            "SB-Mid-server-9QzxKyc37GPcw1gv_tBX77YR:",
            "utf8"
          ).toString("base64"),
        "X-Idempotency-Key": uuid(),
      },
    };
    const data = req.body;
    const payload = {
      name: data.name,
      account: data.account,
      bank: data.bank,
      alias_name: data.alias_name,
      email: data.email,
    };
    // const post = new Promise((resolve, reject) => {
    //   const request = https.request(url, options, (res) => {
    //     if (res.statusCode < 200 || res.statusCode > 299) {
    //       return reject(new Error("HTTP status code" + res.statusCode));
    //     }
    //     const body = [];
    //     res.on("data", (chunk) => body.push(chunk));
    //     res.on("end", () => {
    //       const resString = Buffer.concat(body).toString();
    //       resolve(resString);
    //     });
    //   });
    //   request.on("error", (err) => {
    //     reject(err);
    //   });
    //   request.on("timeout", () => {
    //     request.destroy();
    //     reject(new Error("Request timeout"));
    //   });
    //   request.write(JSON.stringify(payload));
    //   request.end();
    // });
    // post.then(
    //   function (value) {
    //     if (JSON.parse(value).status_code != 201) {
    //       res.status(500).json({
    //         message:
    //           "Something went wrong while saving data: " +
    //           JSON.parse(value).status,
    //         status: 500,
    //       });
    //       return;
    //     }
    //     firestore
    //       .collection("beneficiary")
    //       .doc()
    //       .set(data)
    //       .then(() => {
    //         res.status(200).json({
    //           message: "Beneficiary data saved successfuly",
    //           status: 200,
    //         });
    //       })
    //       .catch((error) => {
    //         res.status(500).json({
    //           message:
    //             "Something went wrong while saving data: " + error.toString(),
    //           status: 500,
    //         });
    //       });
    //   },
    //   function (error) {
    //     res.status(500).json({
    //       message:
    //         "Something went wrong while saving data: " + error.toString(),
    //       status: 500,
    //     });
    //   }
    // );

    // Confirm manually for temporary
    firestore
      .collection("beneficiary")
      .doc()
      .set(payload)
      .then(() => {
        res.status(200).json({
          message: "Beneficiary data saved successfuly",
          status: 200,
        });
      })
      .catch((error) => {
        res.status(500).json({
          message:
            "Something went wrong while saving data: " + error.toString(),
          status: 500,
        });
      });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while saving data: " + error.toString(),
      status: 500,
    });
  }
};

export const updateBeneficiary = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;
    // const url =
    //   "https://app.sandbox.midtrans.com/iris/api/v1/beneficiaries/" +
    //   data.alias_name;
    // const options = {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Accept: "application/json",
    //     Authorization:
    //       "Basic " +
    //       Buffer.from(
    //         "SB-Mid-server-9QzxKyc37GPcw1gv_tBX77YR:",
    //         "utf8"
    //       ).toString("base64"),
    //     "X-Idempotency-Key": uuid(),
    //   },
    // };
    const payload = {
      name: data.name,
      account: data.account,
      bank: data.bank,
      alias_name: data.alias_name,
      email: data.email,
    };
    // const post = new Promise((resolve, reject) => {
    //   const request = https.request(url, options, (res) => {
    //     if (res.statusCode < 200 || res.statusCode > 299) {
    //       return reject(new Error("HTTP status code" + res.statusCode));
    //     }
    //     const body = [];
    //     res.on("data", (chunk) => body.push(chunk));
    //     res.on("end", () => {
    //       const resString = Buffer.concat(body).toString();
    //       resolve(resString);
    //     });
    //   });
    //   request.on("error", (err) => {
    //     reject(err);
    //   });
    //   request.on("timeout", () => {
    //     request.destroy();
    //     reject(new Error("Request timeout"));
    //   });
    //   request.write(JSON.stringify(payload));
    //   request.end();
    // });
    // post.then(
    //   function (value) {
    //     if (JSON.parse(value).status_code != 201) {
    //       res.status(500).json({
    //         message:
    //           "Something went wrong while update data: " +
    //           JSON.parse(value).status,
    //         status: 500,
    //       });
    //       return;
    //     }
    //     firestore
    //       .collection("beneficiary")
    //       .doc(id)
    //       .set(data)
    //       .then(() => {
    //         res.status(200).json({
    //           message: "Beneficiary data saved successfuly",
    //           status: 200,
    //         });
    //       })
    //       .catch((error) => {
    //         res.status(500).json({
    //           message:
    //             "Something went wrong while saving data: " + error.toString(),
    //           status: 500,
    //         });
    //       });
    //   },
    //   function (error) {
    //     res.status(500).json({
    //       message:
    //         "Something went wrong while saving data: " + error.toString(),
    //       status: 500,
    //     });
    //   }
    // );

    // Confirm manually for temporary
    firestore
      .collection("beneficiary")
      .doc(id)
      .set(data)
      .then(() => {
        res.status(200).json({
          message: "Beneficiary data saved successfuly",
          status: 200,
        });
      })
      .catch((error) => {
        res.status(500).json({
          message:
            "Something went wrong while saving data: " + error.toString(),
          status: 500,
        });
      });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while updating data: " + error.toString(),
      status: 500,
    });
  }
};

export const getAllBeneficiaries = async (req, res) => {
  try {
    // const url = "https://app.sandbox.midtrans.com/iris/api/v1/beneficiaries";
    // const options = {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Accept: "application/json",
    //     Authorization:
    //       "Basic " +
    //       Buffer.from(
    //         "SB-Mid-server-9QzxKyc37GPcw1gv_tBX77YR:",
    //         "utf8"
    //       ).toString("base64"),
    //     "X-Idempotency-Key": uuid(),
    //   },
    // };
    // const get = new Promise((resolve, reject) => {
    //   const request = https.request(url, options, (res) => {
    //     if (res.statusCode < 200 || res.statusCode > 299) {
    //       return reject(new Error("HTTP status code" + res.statusCode));
    //     }
    //     const body = [];
    //     res.on("data", (chunk) => body.push(chunk));
    //     res.on("end", () => {
    //       const resString = Buffer.concat(body).toString();
    //       resolve(resString);
    //     });
    //   });
    //   request.on("error", (err) => {
    //     reject(err);
    //   });
    //   request.on("timeout", () => {
    //     request.destroy();
    //     reject(new Error("Request timeout"));
    //   });
    //   request.end();
    // });

    // get
    //   .then(function (value) {
    //     if (JSON.parse(value).status_code != 200) {
    //       res.status(500).json({
    //         message:
    //           "Something went wrong while fetching data: " +
    //           JSON.parse(value).status,
    //         status: 500,
    //       });
    //       return;
    //     }
    //     res.status(200).json({
    //       message: JSON.parse(value).data,
    //       status: 200,
    //     });
    //   })
    //   .catch((error) => {
    //     res.status(500).json({
    //       message:
    //         "Something went wrong while fetching data: " + error.toString(),
    //       status: 500,
    //     });
    //   });
    const beneficiaries = await firestore.collection("beneficiary").get();
    const beneficiariesData = beneficiaries.empty
      ? []
      : beneficiaries.docs.map((beneficiary) => {
          return {
            id: beneficiary.id,
            ...beneficiary.data(),
          };
        });
    res.status(200).json({
      message: "Beneficiaries data fetched successfuly",
      data: beneficiariesData,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while fetching data: " + error.toString(),
      status: 500,
    });
  }
};

export const storePayout = async (req, res) => {
  try {
    const data = req.body;
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
              res.status(400).json({
                message: "Wallet not found, new wallet created",
                status: 400,
              });
              return wallet;
            })
            .catch((error) => {
              res.status(500).json({
                message: `Error while create wallet: ${error.toString()}`,
                status: 500,
              });
              return null;
            });
    if(walletData.data().balance < data.amount) {
      res.status(400).json({
        message: "Insufficient balance",
        status: 400,
      });
      return;
    }
    // const url = "https://app.sandbox.midtrans.com/iris/api/v1/payouts";
    // const options = {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Accept: "application/json",
    //     Authorization:
    //       "Basic " +
    //       Buffer.from(
    //         "SB-Mid-server-9QzxKyc37GPcw1gv_tBX77YR:",
    //         "utf8"
    //       ).toString("base64"),
    //     "X-Idempotency-Key": uuid(),
    //   },
    // };
    const payload = {
      reference_no: uuid(),
      beneficiary_name: data.beneficiary_name,
      beneficiary_email: data.beneficiary_email,
      beneficiary_account: data.beneficiary_account,
      beneficiary_bank: data.beneficiary_bank,
      amount: parseInt(data.amount),
      notes: data.notes,
    };
    // const post = new Promise((resolve, reject) => {
    //   const request = https.request(url, options, (res) => {
    //     if (res.statusCode < 200 || res.statusCode > 299) {
    //       return reject(new Error("HTTP status code" + res.statusCode));
    //     }
    //     const body = [];
    //     res.on("data", (chunk) => body.push(chunk));
    //     res.on("end", () => {
    //       const resString = Buffer.concat(body).toString();
    //       resolve(resString);
    //     });
    //   });
    //   request.on("error", (err) => {
    //     reject(err);
    //   });
    //   request.on("timeout", () => {
    //     request.destroy();
    //     reject(new Error("Request timeout"));
    //   });
    //   request.write(JSON.stringify(payload));
    //   request.end();
    // });
    // post.then(
    //   function (value) {
    //     if (JSON.parse(value).status_code != 201) {
    //       res.status(500).json({
    //         message:
    //           "Something went wrong while creating payout: " +
    //           JSON.parse(value).status,
    //         status: 500,
    //       });
    //       return;
    //     }
    //     firestore
    //       .collection("transaction")
    //       .doc(JSON.parse(value).reference_no)
    //       .set({
    //         amount: parseInt(data.amount),
    //         status: JSON.parse(value).status,
    //         method: payload.beneficiary_bank,
    //         order_id: JSON.parse(value).reference_no,
    //         transaction_id: JSON.parse(value).reference_no,
    //         type: "withdraw",
    //         wallet_id: walletData.id,
    //         transaction_time: new Date().toISOString(),
    //       })
    //       .then(() => {
    //         res.status(200).json({
    //           message: "Payout data saved successfuly",
    //           status: 200,
    //         });
    //       })
    //       .catch((error) => {
    //         res.status(500).json({
    //           message:
    //             "Something went wrong while saving data: " + error.toString(),
    //           status: 500,
    //         });
    //       });
    //   },
    //   function (error) {
    //     res.status(500).json({
    //       message:
    //         "Something went wrong while saving data: " + error.toString(),
    //       status: 500,
    //     });
    //   }
    // );

    firestore
      .collection("transaction")
      .doc(payload.reference_no)
      .set({
        amount: parseInt(data.amount),
        status: "pending",
      method: payload.beneficiary_bank,
        order_id: payload.reference_no,
        transaction_id: payload.reference_no,
        type: "withdraw",
        wallet_id: walletData.id,
        transaction_time: new Date().toISOString(),
      })
      .then(() => {
        res.status(200).json({
          message: "Payout data saved successfuly",
          status: 200,
        });
      })
      .catch((error) => {
        res.status(500).json({
          message:
            "Something went wrong while saving data: " + error.toString(),
          status: 500,
        });
      });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while updating data: " + error.toString(),
      status: 500,
    });
  }
};

export const approvePayout = async (req, res) => {
  try {
    const data = req.body;
    const payout = await firestore.collection("transaction").doc(data.reference_no).get();
    if (!payout.exists) {
      res.status(400).json({
        message: "Payout not found",
        status: 400,
      });
      return;
    }
    const payoutData = payout.data();
    const wallet = await firestore.collection("wallet").doc(payoutData.wallet_id).get();
    if (!wallet.exists) {
      res.status(400).json({
        message: "Wallet not found",
        status: 400,
      });
      return;
    }
    const walletData = wallet.data();
    if(walletData.balance < payoutData.amount) {
      res.status(400).json({
        message: "Insufficient balance",
        status: 400,
      });
      return;
    }
    // const url = "https://app.sandbox.midtrans.com/iris/api/v1/payouts/approve";
    // const options = {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Accept: "application/json",
    //     Authorization:
    //       "Basic " +
    //       Buffer.from(
    //         "SB-Mid-server-9QzxKyc37GPcw1gv_tBX77YR:",
    //         "utf8"
    //       ).toString("base64"),
    //     "X-Idempotency-Key": uuid(),
    //   },
    // };
    // const payload = {
    //   references_no: [data.reference_no],
    // };
    // const post = new Promise((resolve, reject) => {
    //   const request = https.request(url, options, (res) => {
    //     if (res.statusCode < 200 || res.statusCode > 299) {
    //       return reject(new Error("HTTP status code" + res.statusCode));
    //     }
    //     const body = [];
    //     res.on("data", (chunk) => body.push(chunk));
    //     res.on("end", () => {
    //       const resString = Buffer.concat(body).toString();
    //       resolve(resString);
    //     });
    //   });
    //   request.on("error", (err) => {
    //     reject(err);
    //   });
    //   request.on("timeout", () => {
    //     request.destroy();
    //     reject(new Error("Request timeout"));
    //   });
    //   request.write(JSON.stringify(payload));
    //   request.end();
    // });
    // post.then(
    //   function (value) {
    //     if (JSON.parse(value).status_code != 201) {
    //       res.status(500).json({
    //         message:
    //           "Something went wrong while approving payout: " +
    //           JSON.parse(value).status,
    //         status: 500,
    //       });
    //       return;
    //     }
    //     firestore
    //       .collection("transaction")
    //       .doc(data.reference_no)
    //       .update({
    //         status: JSON.parse(value).status,
    //       })
    //       .then(() => {
    //         res.status(200).json({
    //           message: "Payout data approved successfuly",
    //           status: 200,
    //         });
    //       })
    //       .catch((error) => {
    //         res.status(500).json({
    //           message:
    //             "Something went wrong while approving data: " +
    //             error.toString(),
    //           status: 500,
    //         });
    //       });
    //   },
    //   function (error) {
    //     res.status(500).json({
    //       message:
    //         "Something went wrong while approving data: " + error.toString(),
    //       status: 500,
    //     });
    //   }
    // );
    firestore
      .collection("transaction")
      .doc(data.reference_no)
      .update({
        status: "approved",
      })
      .then(() => {
        wallet.ref.update({
          balance: walletData.balance - payoutData.amount,
        }).then(() => {
          res.status(200).json({
            message: "Payout data approved successfuly",
            status: 200,
          });
        })
      })
      .catch((error) => {
        res.status(500).json({
          message:
            "Something went wrong while approving data: " + error.toString(),
          status: 500,
        });
      });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while approving data: " + error.toString(),
      status: 500,
    });
  }
};

export const rejectPayout = async (req, res) => {
  try {
    const data = req.body;
    // const url = "https://app.sandbox.midtrans.com/iris/api/v1/payouts/reject";
    // const options = {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Accept: "application/json",
    //     Authorization:
    //       "Basic " +
    //       Buffer.from(
    //         "SB-Mid-server-9QzxKyc37GPcw1gv_tBX77YR:",
    //         "utf8"
    //       ).toString("base64"),
    //     "X-Idempotency-Key": uuid(),
    //   },
    // };
    const payload = {
      references_no: [data.reference_no],
      reject_reason: data.reject_reason,
    };
    // const post = new Promise((resolve, reject) => {
    //   const request = https.request(url, options, (res) => {
    //     if (res.statusCode < 200 || res.statusCode > 299) {
    //       return reject(new Error("HTTP status code" + res.statusCode));
    //     }
    //     const body = [];
    //     res.on("data", (chunk) => body.push(chunk));
    //     res.on("end", () => {
    //       const resString = Buffer.concat(body).toString();
    //       resolve(resString);
    //     });
    //   });
    //   request.on("error", (err) => {
    //     reject(err);
    //   });
    //   request.on("timeout", () => {
    //     request.destroy();
    //     reject(new Error("Request timeout"));
    //   });
    //   request.write(JSON.stringify(payload));
    //   request.end();
    // });
    // post.then(
    //   function (value) {
    //     if (JSON.parse(value).status_code != 201) {
    //       res.status(500).json({
    //         message:
    //           "Something went wrong while rejecting payout: " +
    //           JSON.parse(value).status,
    //         status: 500,
    //       });
    //       return;
    //     }
    //     firestore
    //       .collection("transaction")
    //       .doc(data.reference_no)
    //       .update({
    //         status: JSON.parse(value).status,
    //       })
    //       .then(() => {
    //         res.status(200).json({
    //           message: "Payout data rejected successfuly",
    //           status: 200,
    //         });
    //       })
    //       .catch((error) => {
    //         res.status(500).json({
    //           message:
    //             "Something went wrong while rejecting data: " +
    //             error.toString(),
    //           status: 500,
    //         });
    //       });
    //   },
    //   function (error) {
    //     res.status(500).json({
    //       message:
    //         "Something went wrong while rejecting data: " + error.toString(),
    //       status: 500,
    //     });
    //   }
    // );
    firestore
      .collection("transaction")
      .doc(data.reference_no)
      .update({
        status: "rejected",
      })
      .then(() => {
        res.status(200).json({
          message: "Payout data rejected successfuly",
          status: 200,
        });
      })
      .catch((error) => {
        res.status(500).json({
          message:
            "Something went wrong while rejecting data: " + error.toString(),
          status: 500,
        });
      });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while rejecting data: " + error.toString(),
      status: 500,
    });
  }
};

export const getAllPayouts = async (req, res) => {
  try {
    const payout = await firestore.collection("transaction").where('type', "==", "withdraw").get();
    if(payout.empty) {
      res.status(404).json({
        message: "No payout data found",
        status: 404,
        data: [],
      });
      return;
    }
    const payoutData = payout.docs.map((doc) => {
      return {
        payout_id: doc.id,
        ...doc.data(),
      };
    });
    res.status(200).json({
      message: "Payout data found",
      status: 200,
      data: payoutData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while getting data: " + error.toString(),
      status: 500,
    });
  }
};

export const getPayoutById = async (req, res) => {
  try {
    const referenceNo = req.params.reference_no;
    // const url =
    //   "https://app.sandbox.midtrans.com/iris/api/v1/payouts/" + referenceNo;
    // const options = {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Accept: "application/json",
    //     Authorization:
    //       "Basic " +
    //       Buffer.from(
    //         "SB-Mid-server-9QzxKyc37GPcw1gv_tBX77YR:",
    //         "utf8"
    //       ).toString("base64"),
    //   },
    // };
    // const get = new Promise((resolve, reject) => {
    //   const request = https.request(url, options, (res) => {
    //     if (res.statusCode < 200 || res.statusCode > 299) {
    //       return reject(new Error("HTTP status code" + res.statusCode));
    //     }
    //     const body = [];
    //     res.on("data", (chunk) => body.push(chunk));
    //     res.on("end", () => {
    //       const resString = Buffer.concat(body).toString();
    //       resolve(resString);
    //     });
    //   });
    //   request.on("error", (err) => {
    //     reject(err);
    //   });
    //   request.on("timeout", () => {
    //     request.destroy();
    //     reject(new Error("Request timeout"));
    //   });
    //   request.end();
    // });
    // get.then(
    //   function (value) {
    //     if (JSON.parse(value).status_code != 200) {
    //       res.status(500).json({
    //         message:
    //           "Something went wrong while getting payout: " +
    //           JSON.parse(value).status,
    //         status: 500,
    //       });
    //       return;
    //     }
    //     res.status(200).json({
    //       message: "Payout data retrieved successfuly",
    //       status: 200,
    //       data: JSON.parse(value).data,
    //     });
    //   },
    //   function (error) {
    //     res.status(500).json({
    //       message:
    //         "Something went wrong while getting data: " + error.toString(),
    //       status: 500,
    //     });
    //   }
    // );
    const payout = await firestore.collection("transaction").doc(referenceNo).get();
    if (!payout.exists) {
      res.status(404).json({
        message: "Payout not found",
        status: 404,
      });
      return;
    }
    res.status(200).json({
      message: "Payout data retrieved successfuly",
      status: 200,
      data: payout.data(),
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while getting data: " + error.toString(),
      status: 500,
    });
  }
};
