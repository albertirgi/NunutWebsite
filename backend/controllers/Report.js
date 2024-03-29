import Report from '../models/reportModel.js'
import jwt from 'jsonwebtoken'
import { db } from '../config/db.js'
import CancellationUser from "../models/cancellationUserModel.js";
import nodemailer from "nodemailer";
import { uuid } from "uuidv4";

let token = null
const firestore = db.firestore()

export const storeReport = async (req, res) => {
  try {
    const data = req.body
    const cancellationUser = new CancellationUser(
      uuid(),
      data.user_id,
      data.ride_request_id,
      data.title,
      data.description,
      "PENDING"
    );
    await firestore.collection("report").doc().set({
      user_id: cancellationUser.user_id,
      ride_request_id: cancellationUser.ride_request_id,
      title: cancellationUser.title,
      description: cancellationUser.description,
      status: "PENDING",
    });
    res.status(200).json({
      message: "Report successfully added",
      data: cancellationUser,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while saving data: ' + error.toString(),
      status: 500
    })
  }
}

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

export const feedbackReport = async (req, res) => {
  try {
    const id = req.params.id
    const body = req.body
    const report = firestore.collection('report').doc(id)
    const data = await report.get()
    const user = await firestore.collection('users').doc(data.data().user_id).get()
    const userData = user.data()
    await report.update({
      status: body.status,
    }).then(async () => {
      const email = userData.email;
      const subject = body.title;
      const html = `<h1>Hi ${userData.name},</h1>
      <p>Thank you for your feedback report. We will process it as soon as possible.</p>
      <p>Here is your feedback:</p>
      <p>${body.description}</p>
      <p>Status: ${body.status}</p>
      <p>Best Regards,</p>
      <p>NUNUT Team</p>
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
        } else {
          res.status(200).json({
            message: "Report successfully updated",
            status: 200,
          });
        }
      });
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while updating data: ' + error.toString(),
      status: 500
    })
  }
}

export const getAllReports = async (req, res) => {
  try {
    const data = await firestore.collection('report').get()
    const reportArray = []
    const rideRequest = await firestore.collection('ride_request').get()
    const rideRequestArray = req.query.ride_request !== undefined ? rideRequest.docs.map(doc => {
      return {
        ride_request_id: doc.id,
        ...doc.data(),
      };
    }) : null
    const user = await firestore.collection('users').get()
    const userArray = req.query.user !== undefined ? user.docs.map(doc => {
      return {
        user_id: doc.id,
        ...doc.data(),
      };
    }) : null
    if (data.empty) {
      res.status(404).json({
        message: 'No report record found',
        status: 404
      })
    } else {
      data.forEach(doc => {
        const report = new Report(
          doc.id,
          doc.data().title,
          doc.data().description,
          req.query.ride_request !== undefined
            ? rideRequestArray.find(
                (rideRequest) =>
                  rideRequest.ride_request_id === doc.data().ride_request_id
              )
            : doc.data().ride_request_id,
          req.query.user !== undefined
            ? userArray.find((user) => user.user_id === doc.data().user_id)
            : doc.data().user_id,
          doc.data().status,
        );
        reportArray.push(report)
      })
      res.status(200).json({
        message: 'Report data retrieved successfuly',
        data: reportArray,
        status: 200
      })
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while fetching data: ' + error.toString(),
      status: 500
    })
  }
}

export const getReportById = async (req, res) => {
  try {
    const id = req.params.id
    const data = await firestore.collection('report').doc(id).get()
    const rideRequest = await firestore.collection('ride_request').get()
    const rideRequestArray = req.query.ride_request !== undefined ? rideRequest.docs.map(doc => {
      return {
        ride_request_id: doc.id,
        ...doc.data(),
      };
    }) : null
    const user = await firestore.collection('users').get()
    const userArray = req.query.user !== undefined ? user.docs.map(doc => {
      return {
        user_id: doc.id,
        ...doc.data()
      }
    }) : null
    if (!data.exists) {
      res.status(404).json({
        message: 'Report with the given ID not found',
        status: 404
      })
    } else {
      res.status(200).json({
        message: "Report data retrieved successfuly",
        data: {
          report_id: data.id,
          title: data.data().title,
          description: data.data().description,
          ride_request_id:
            req.query.ride_request !== undefined
              ? rideRequestArray.find(
                  (rideRequest) =>
                    rideRequest.ride_request_id === data.data().ride_request_id
                )
              : data.data().ride_request_id,
          user_id:
            req.query.user !== undefined
              ? userArray.find((user) => user.user_id === data.data().user_id)
              : data.data().user_id,
          status: data.data().status,
        },
        status: 200,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while fetching data: ' + error.toString(),
      status: 500
    })
  }
}

export const updateReport = async (req, res) => {
  try {
    const id = req.params.id
    const data = req.body
    const report = firestore.collection('report').doc(id)
    await report.update(data)
    res.status(200).json({
      message: 'Report data updated successfuly',
      status: 200
    })
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while updating data: ' + error.toString(),
      status: 500
    })
  }
}

export const destroyReport = async (req, res) => {
  try {
    const id = req.params.id
    await firestore.collection('report').doc(id).delete()
    res.status(200).json({
      message: 'Report data deleted successfuly',
      status: 200
    })
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while deleting data: ' + error.toString(),
      status: 500
    })
  }
}

