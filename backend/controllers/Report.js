import Report from '../models/reportModel.js'
import jwt from 'jsonwebtoken'
import { db } from '../config/db.js'
let token = null
const firestore = db.firestore()

export const storeReport = async (req, res) => {
  try {
    const data = req.body
    await firestore.collection('reports').doc().set(data)
    res.send('Record saved successfuly')
  } catch (error) {
    res.status(400).send(error.message)
  }
}

export const getAllReports = async (req, res) => {
  try {
    const data = await firestore.collection('reports').get()
    const reportArray = []
    if (data.empty) {
      res.status(404).send('No report record found')
    } else {
      data.forEach(doc => {
        const report = new Report(
          doc.id,
          doc.data().description,
          doc.data().ride_request_id
        )
        reportArray.push(report)
      })
      res.status(200).send({
        message: 'Report data retrieved successfuly',
        data: reportArray,
        status: 200
      })
    }
  } catch (error) {
    res.status(500).send({
      message: 'Something went wrong while fetching data: ' + error.toString(),
      status: 500
    })
  }
}

export const getReportById = async (req, res) => {
  try {
    const id = req.params.id
    const data = await firestore.collection('reports').doc(id).get()
    if (!data.exists) {
      res.status(404).send('Report with the given ID not found')
    } else {
      res.status(200).send({
        message: 'Report data retrieved successfuly',
        data: data.data(),
        status: 200
      })
    }
  } catch (error) {
    res.status(500).send({
      message: 'Something went wrong while fetching data: ' + error.toString(),
      status: 500
    })
  }
}

export const updateReport = async (req, res) => {
  try {
    const id = req.params.id
    const data = req.body
    const report = await firestore.collection('reports').doc(id)
    await report.update(data)
    res.send('Report updated successfuly')
  } catch (error) {
    res.status(400).send(error.message)
  }
}

export const destroyReport = async (req, res) => {
  try {
    const id = req.params.id
    await firestore.collection('reports').doc(id).delete()
    res.send('Report deleted successfuly')
  } catch (error) {
    res.status(400).send(error.message)
  }
}

