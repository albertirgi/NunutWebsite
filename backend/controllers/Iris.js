import { db } from "../config/db.js";
import { v4 as uuid } from "uuid";
import https from "https";
import fetch from "node-fetch";
import nodemailer from "nodemailer";
const firestore = db.firestore();

function setupMailer() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "psociopreneur@gmail.com",
      pass: "remnvcsctsuphumg",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

export const sendEmail = (req, res) => {
  const mailer = setupMailer();
  const mailOptions = {
    from: "psociopreneur@gmail.com",
    to: req.body.to,
    subject: req.body.subject,
    text: req.body.text,
  };
  mailer.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).json({
        message: "Something went wrong while sending email: " + error.toString(),
        status: 500,
      });
    } else {
      res.status(200).json({
        message: "Email sent successfully",
        status: 200,
      });
    }
  });
}

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
            "Mid-server-V7Id9uuEEzMD9ZrUHXhvxB1T",
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
    //         "Mid-server-V7Id9uuEEzMD9ZrUHXhvxB1T",
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
    //         "Mid-server-V7Id9uuEEzMD9ZrUHXhvxB1T",
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
    var beneficiariesData = beneficiaries.empty
      ? []
      : beneficiaries.docs.map((beneficiary) => {
          return {
            beneficiary_id: beneficiary.id,
            ...beneficiary.data(),
          };
        });
    if(req.query.user !== undefined && req.query.user != "") {
      beneficiariesData = beneficiariesData.filter((beneficiary) => {
        return beneficiary.alias_name == req.query.user;
      });
    } 
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
    const user = await firestore
      .collection("users")
      .doc(data.user_id)
      .get();
    if (user.empty) {
      res.status(400).json({
        message: "User not found",
        status: 400,
      });
      return;
    }
    const userData = user.data();
    const driver = await firestore
      .collection("driver")
      .where("user_id", "==", data.user_id)
      .get();
    var emailStatus = "Driver";
    if (driver.empty) {
      emailStatus = "User";
    }
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
	      console.log(error.toString());
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
    //         "Mid-server-V7Id9uuEEzMD9ZrUHXhvxB1T",
    //         "utf8"
    //       ).toString("base64"),
    //     "X-Idempotency-Key": uuid(),
    //   },
    // };
    const beneficiary = await firestore.collection("beneficiary").doc(data.beneficiary_id).get();
    if(beneficiary.empty) {
      res.status(400).json({
        message: "Beneficiary not found",
        status: 400,
      });
      return;
    }
    const beneficiaryData = beneficiary.data();
    console.log(beneficiaryData);
    const payload = {
      reference_no: uuid(),
      beneficiary_name: beneficiaryData.name,
      beneficiary_email: beneficiaryData.email,
      beneficiary_account: beneficiaryData.account,
      beneficiary_bank: beneficiaryData.bank,
      amount: parseInt(data.amount),
      notes: "Withdrawal",
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
    console.log(userData);
    firestore
      .collection("transaction")
      .doc(payload.reference_no)
      .set({
        amount: parseInt(data.amount),
        status: "pending",
        method: payload.beneficiary_bank,
        order_id: payload.reference_no,
        transaction_id: data.beneficiary_id,
        type: "withdraw",
        wallet_id: walletData.id,
        transaction_time: new Date(),
      })
      .then(() => {
        const email = "d12200009@john.petra.ac.id";
        const subject = "Withdrawal Request";
        const html = `
          <h1><b>NUNUT REQUEST!</b></h1>
          <br>
          <p>Dear nunut management</p>
          <br>
          <p>Terjadi permintaan WITHDRAW saldo NUNUT PAY oleh</p>
          <p>Nama: ${userData.name}</p>
          <p>Status: ${emailStatus}</p>
          <p>Bank: ${payload.beneficiary_bank}</p>
          <p>Nomor Rekening: ${payload.beneficiary_account}</p>
          <p>Nominal Withdraw: Rp. ${payload.amount}</p>
          <br>
          <p>Harap segera ditransfer dan lakukan konfirmasi melalui link berikut ini https://ayonunut.com/dashboard/payout</p>
          <p>Terima kasih</p>
          `;
        const mailer = setupMailer();
        const mailOptions = {
          from: "psociopreneur@gmail.com",
          to: email,
          subject: subject,
          html: html,
        };
        mailer.sendMail(mailOptions, function (err, info) {
          if (err) {
          } else {
            mailer.sendMail(
              {
                from: "psociopreneur@gmail.com",
                to: "psociopreneur@gmail.com",
                subject: subject,
                html: html,
              },
              function (err, info) {
                if (err) {
                  res.status(500).json({
                    message: "Error while sending email: " + err.message,
                    status: 500,
                  });
                } else {
                  res.status(200).json({
                    message: "Payout data saved successfuly",
                    status: 200,
                  });
                }
              }
            );
          }
        });
      })
      .catch((error) => {
	console.log(error.toString());
        res.status(500).json({
          message:
            "Something went wrong while saving data: " + error.toString(),
          status: 500,
        });
      });
  } catch (error) {
    console.log(error.toString());
    res.status(500).json({
      message: "Something went wrong while updating data: " + error.toString(),
      status: 500,
    });
  }
};

export const approvePayout = async (req, res) => {
  try {
    const data = req.body;
    const encoded = req.file.buffer.toString("base64");
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
    const user = await firestore.collection("users").doc(walletData.user_id).get();
    if (!user.exists) {
      res.status(400).json({
        message: "User not found",
        status: 400,
      });
      return;
    }
    const userData = user.data();
    // const url = "https://app.sandbox.midtrans.com/iris/api/v1/payouts/approve";
    // const options = {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Accept: "application/json",
    //     Authorization:
    //       "Basic " +
    //       Buffer.from(
    //         "Mid-server-V7Id9uuEEzMD9ZrUHXhvxB1T",
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
          // Get image and send email to user
          const image = req.file;
          const email = userData.email;
          const subject = "Payout Approved";
          const html = `<p>Your payout has been approved</p>
          <p>Amount: ${payoutData.amount}</p>
          <p>Bank: ${payoutData.method}</p>
          <p>Transaction Date: ${payoutData.transaction_time.toDate()}</p>
          <p>Transaction Status: Approved</p>
          <p>Transaction Type: ${payoutData.type}</p>
          <p>Transaction Balance: ${walletData.balance}</p>
          `;
          const mailer = setupMailer();
          const mailOptions = {
            from: "psociopreneur@gmail.com",
            to: email,
            subject: subject,
            html: html,
            attachments: [
              {
                // encoded string as an attachment
                filename: "transfer_receipt.jpg",
                content: encoded,
                encoding: "base64",
              },
            ],
          };
          mailer.sendMail(mailOptions, function (err, info) {
            if (err) {
              res.status(500).json({
                message: "Error while sending email: " + err.message,
                status: 500,
              });
              user.delete();
            } else {
              res.status(200).json({
                message: "Payout data approved successfuly",
                status: 200,
              });
            }
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
    //         "Mid-server-V7Id9uuEEzMD9ZrUHXhvxB1T",
    //         "utf8"
    //       ).toString("base64"),
    //     "X-Idempotency-Key": uuid(),
    //   },
    // };
    const payload = {
      references_no: [data.reference_no],
      reject_reason: data.reject_reason,
    };
    const payout = await firestore
      .collection("transaction")
      .doc(data.reference_no)
      .get();

    if (!payout.exists) {
      res.status(404).json({
        message: "Payout data not found",
        status: 404,
      });
      return;
    }

    const payoutData = payout.data();
    const wallet = await firestore
      .collection("wallet")
      .doc(payoutData.wallet_id)
      .get();

    if (!wallet.exists) {
      res.status(404).json({
        message: "Wallet data not found",
        status: 404,
      });
      return;
    }

    const walletData = wallet.data();
    const user = await firestore
      .collection("users")
      .doc(walletData.user_id)
      .get();

    if (!user.exists) {
      res.status(404).json({
        message: "User data not found",
        status: 404,
      });
      return;
    }

    const userData = user.data();
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
        // Get image and send email to user
        const email = userData.email;
        const subject = "Payout Rejected";
        const html = `
          <h1>Payout Rejected</h1>
          <p>Transaction ID: ${payoutData.transaction_id}</p>
          <p>Transaction Status: Rejected</p>
          <p>Transaction Type: ${payoutData.type}</p>
          <p>Transaction Amount: ${payoutData.amount}</p>
          <p>Transaction Date: ${payoutData.transaction_time.toDate()}</p>
          <p>Reject Reason: ${data.reject_reason}</p>
          `;
        const mailer = setupMailer();
        const mailOptions = {
          from: "psociopreneur@gmail.com",
          to: email,
          subject: subject,
          html: html,
        };
        mailer.sendMail(mailOptions, function (err, info) {
          if (err) {
            res.status(500).json({
              message: "Error while sending email: " + err.message,
              status: 500,
            });
            user.delete();
          } else {
            res.status(200).json({
              message: "Payout data rejected successfuly",
              status: 200,
            });
          }
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
    var payoutDataArray = [];
    const payoutData = payout.docs.map((doc) => {
      return {
        order_id: doc.id,
        ...doc.data(),
      };
    });
    const beneficiary = await firestore.collection("beneficiary").get();
    const beneficiaryData = beneficiary.docs.map((doc) => {
      return {
        beneficiary_id: doc.id,
        ...doc.data(),
      };
    });
    payout.docs.forEach((doc) => {
      payoutDataArray.push({
        order_id: doc.id,
        ...doc.data(),
        beneficiary: beneficiaryData.find(
          (beneficiary) => beneficiary.beneficiary_id == doc.data().transaction_id
        ),
      });
    });
    res.status(200).json({
      message: "Payout data found",
      status: 200,
      data: payoutDataArray,
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
    //         "Mid-server-V7Id9uuEEzMD9ZrUHXhvxB1T",
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
    const beneficiary = await firestore.collection("beneficiary").doc(payout.data().transaction_id).get();
    if (!beneficiary.exists) {
      res.status(404).json({
        message: "Beneficiary not found",
        status: 404,
      });
      return;
    }
    res.status(200).json({
      message: "Payout data retrieved successfuly",
      status: 200,
      data: {
        ...payout.data(),
        ...beneficiary.data(),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while getting data: " + error.toString(),
      status: 500,
    });
  }
};
