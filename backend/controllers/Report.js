import Report from '../models/reportModel.js'
import jwt from 'jsonwebtoken'
import { db } from '../config/db.js'
let token = null
const firestore = db.firestore()

export const storeReport = async (req, res) => {
  try {
    const data = req.body
    await firestore.collection('report').doc().set(data)
    res.status(200).json({
      message: 'Report data saved successfuly',
      status: 200
    })
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while saving data: ' + error.toString(),
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
        id: doc.id,
        ...doc.data()
      }
    }) : null
    const user = await firestore.collection('users').get()
    const userArray = req.query.user !== undefined ? user.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
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
          req.query.ride_request !== undefined ? rideRequestArray.find(rideRequest => rideRequest.id === doc.data().ride_request_id) : doc.data().ride_request_id,
          req.query.user !== undefined ? userArray.find(user => user.id === doc.data().user_id) : doc.data().user_id,
        )
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
        id: doc.id,
        ...doc.data()
      }
    }) : null
    const user = await firestore.collection('users').get()
    const userArray = req.query.user !== undefined ? user.docs.map(doc => {
      return {
        id: doc.id,
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
        message: 'Report data retrieved successfuly',
        data: {
          id: data.id,
          title: data.data().title,
          description: data.data().description,
          ride_request: req.query.ride_request !== undefined ? rideRequestArray.find(rideRequest => rideRequest.id === data.data().ride_request_id) : data.data().ride_request_id,
          user: req.query.user !== undefined ? userArray.find(user => user.id === data.data().user_id) : data.data().user_id,
        },
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

