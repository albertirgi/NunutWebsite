import Bookmark from '../models/bookmarkModel.js'
import jwt from 'jsonwebtoken'
import { db } from '../config/db.js'
let token = null
const firestore = db.firestore()

export const storeBookmark = async (req, res) => {
  try {
    const data = req.body
    await firestore.collection('bookmark').doc().set(data)
    res.status(200).json({
      message: 'Bookmark data saved successfuly',
      status: 200,
    })
  } catch (error) {
    res.status(400).json({
      message: 'Something went wrong while saving data: ' + error.toString(),
      status: 400,
    })
  }
}

export const getAllBookmarks = async (req, res) => {
  try {
    const data = await firestore.collection('bookmark').get()
    var bookmarkArray = []
    const rideSchedule = await firestore.collection('ride_schedule').get()
    const rideScheduleArray =
      req.query.ride_schedule !== undefined
        ? rideSchedule.docs.map(doc => {
            return {
              ride_schedule_id: doc.id,
              date: doc.data().date,
              time: doc.data().time,
              capacity: doc.data().capacity,
              destination: doc.data().destination,
              meeting_point: doc.data().meeting_point,
              vehicle_id: doc.data().vehicle_id,
              price: doc.data().price,
              is_active: doc.data().is_active,
              note: doc.data().note
            }
          })
        : null
    const user = await firestore.collection('users').get()
    const userArray =
      req.query.user !== undefined
        ? user.docs.map(doc => {
            return {
              user_id: doc.id,
              ...doc.data(),
            }
          })
        : null
    if (data.empty) {
      res.status(404).json({
        message: 'No bookmark record found',
        status: 404,
      })
    } else {
      const driver = await firestore.collection("driver").get();
      data.forEach(doc => {
        if(req.query.user != "" && req.query.user != undefined && doc.data().user_id != req.query.user){
          return
        }
        var bookmark = new Bookmark(
          doc.id,
          req.query.ride_schedule !== undefined
            ? rideScheduleArray.find(
                (rideSchedule) =>
                  rideSchedule.ride_schedule_id === doc.data().ride_schedule_id
              )
            : doc.data().ride_schedule_id,
          req.query.user !== undefined
            ? userArray.find((user) => user.user_id === doc.data().user_id)
            : doc.data().user_id
        );
        if (req.query.ride_schedule !== undefined) {
          const driverData = driver.docs.find(
            (driver) => driver.driver_id === doc.data().driver_id
          );
          bookmarkArray.push({
            id: doc.id,
          ride_schedule_id: req.query.ride_schedule !== undefined
            ? rideScheduleArray.find(
                (rideSchedule) =>
                  rideSchedule.ride_schedule_id === doc.data().ride_schedule_id
              )
            : doc.data().ride_schedule_id,
          user_id: req.query.user !== undefined
            ? userArray.find((user) => user.user_id === doc.data().user_id)
            : doc.data().user_id,
            driver_id: {
              driver_id: driverData.id,
              ...driverData.data(),
            },
          });
        } else {
          bookmarkArray.push(bookmark);
        }
      })
      res.status(200).json({
        message: 'Bookmark data retrieved successfuly',
        data: bookmarkArray,
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

export const getBookmarkById = async (req, res) => {
  try {
    const id = req.params.id
    const data = await firestore.collection('bookmark').doc(id).get()
    const rideSchedule = await firestore.collection('ride_schedule').get()
    const rideScheduleArray =
      req.query.ride_schedule !== undefined
        ? rideSchedule.docs.map(doc => {
            return {
              ride_schedule_id: doc.id,
              ...doc.data(),
            }
          })
        : null
    const user = await firestore.collection('users').get()
    const userArray =
      req.query.user !== undefined
        ? user.docs.map(doc => {
            return {
              user_id: doc.id,
              ...doc.data(),
            }
          })
        : null
    if (!data.exists) {
      res.status(404).json({
        message: 'Bookmark with the given ID not found',
        status: 404,
      })
    } else {
      res.status(200).json({
        message: 'Bookmark data retrieved successfuly',
        data: {
          bookmark_id: data.id,
          ride_schedule: req.query.ride_schedule !== undefined ? rideScheduleArray.find(rideSchedule => rideSchedule.ride_schedule_id === data.data().ride_schedule_id) : data.data().ride_schedule_id,
          user: req.query.user !== undefined ? userArray.find(user => user.user_id === data.data().user_id) : data.data().user_id,
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

export const getBookmarkByUserId = async (req, res) => {
  try {
    const id = req.params.id
    const data = await firestore.collection('bookmark').where('user_id', '==', id).get()
    const bookmarkArray = []
    const user = await firestore.collection('users').doc(id).get()
    const userArray =
      req.query.user !== undefined
        ? {
            user_id: user.user_id,
            ...user.data(),
        }
        : null
    const rideSchedule = await firestore.collection('ride_schedule').get()
    const rideScheduleArray =
      req.query.ride_schedule !== undefined
        ? rideSchedule.docs.map(doc => {
            return {
              ride_schedule_id: doc.id,
              ...doc.data(),
            }
          })
        : null
    if (data.empty) {
      res.status(404).json({
        message: 'No bookmark record found',
        status: 404,
      })
    } else {
      data.forEach(doc => {
        const bookmark = new Bookmark(
          doc.id,
          req.query.ride_schedule !== undefined
            ? rideScheduleArray.find((rideSchedule) => {
                return rideSchedule.ride_schedule_id == doc.data().ride_schedule_id;
              })
            : doc.data().ride_schedule_id,
          req.query.user !== undefined ? userArray : doc.data().user_id
        );
        bookmarkArray.push(bookmark)
      })
      res.status(200).json({
        message: 'Bookmark data retrieved successfuly',
        data: bookmarkArray,
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

export const updateBookmark = async (req, res) => {
  try {
    const id = req.params.id
    const data = req.body
    const bookmark = firestore.collection('bookmark').doc(id)
    await bookmark.update(data)
    res.status(200).json({
      message: 'Bookmark updated successfuly',
      status: 200
    })
  } catch (error) {
    res.status(400).json({
      message: 'Something went wrong while updating data: ' + error.toString(),
      status: 400
    })
  }
}

export const destroyBookmark = async (req, res) => {
  try {
    const id = req.params.id
    await firestore.collection('bookmark').doc(id).delete()
    res.status(200).json({
      message: 'Bookmark deleted successfuly',
      status: 200
    })
  } catch (error) {
    res.status(400).json({
      message: 'Something went wrong while deleting data: ' + error.toString(),
      status: 400
    })
  }
}

export const destroyBookmarkByRideScheduleIdandUserId = async (req, res) => {
  try{
    const rideScheduleId = req.query.ride_schedule
    const userId = req.query.user
    const data = await firestore.collection('bookmark').where('ride_schedule_id', '==', rideScheduleId).where('user_id', '==', userId).get()
    if(data.empty){
      res.status(404).json({
        message: 'No bookmark record found',
        status: 404,
      })
    }else{
      data.forEach(doc => {
        doc.ref.delete()
      })
      res.status(200).json({
        message: 'Bookmark deleted successfuly',
        status: 200
      })
    }
  }catch (error) {
    res.status(400).json({
      message: 'Something went wrong while deleting data: ' + error.toString(),
      status: 400
    })
  }
}
