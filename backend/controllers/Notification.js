import Notification from '../models/notificationModel.js';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
let token = null;
import { v4 as uuid } from 'uuid';
const storage = db.storage().bucket();
const firestore = db.firestore();

export const storeNotification = async (req, res) => {
  try {
    const data = req.body;
    const image = req.file;
    const imagePromise = new Promise((resolve, reject) => {
      const fileNameImage = uuid() + image.originalname;
      const file = storage.file(fileNameImage);
      file.save(image.buffer, { contentType: image.mimetype }, function (err) {
        if (err) {
          let imageMessage = 'Error occured while uploading image: ' + err;
          reject(imageMessage);
        } else {
          file.makePublic();
          resolve(file.publicUrl());
        }
      });
    });
    const imageUrl = await imagePromise;
    if(data.user_id == null || data.user_id == undefined || data.user_id == ''){
      const user = await firestore.collection('users').get();
      user.docs.forEach(async (doc) => {
        await firestore
          .collection("notification")
          .doc()
          .set({
            description: data.description,
            image: imageUrl,
            is_read: false,
            title: data.title,
            user_id: doc.data().user_id,
          });
      });
    }else {
      await firestore
        .collection("notification")
        .doc()
        .set({
          description: data.description,
          image: imageUrl,
          is_read: false,
          title: data.title,
          user_id: data.user_id,
        });
    }
    res.status(200).json({
      message: 'Record saved successfuly',
      status: 200
    })
  } catch (error) {
    res.status(400).json({
      message: 'Something went wrong while saving data: ' + error.toString(),
      status: 400
    })
  }
}

export const getAllNotifications = async (req, res) => {
  try {
    const data = await firestore.collection('notification').get();
    const notificationArray = [];
    if (data.empty) {
      res.status(404).json({
        message: 'No notification record found',
        status: 404
      })
    } else {
      data.forEach(doc => {
        const notification = new Notification(
          doc.id,
          doc.data().description,
          doc.data().image,
          doc.data().is_read,
          doc.data().title,
          doc.data().user_id
        );
        notificationArray.push(notification);
      });
      res.status(200).send({
        message: 'Notification data retrieved successfuly',
        data: notificationArray,
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

export const getNotificationById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await firestore.collection('notification').doc(id).get();
    if (!data.exists) {
      res.status(404).json({
        message: 'No notification record found',
        status: 404
      })
    } else {
      res.status(200).send({
        message: 'Notification data retrieved successfuly',
        data: data.data(),
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

export const updateNotification = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const image = req.file;
    const imagePromise = new Promise((resolve, reject) => {
      const fileNameImage = uuid() + image.originalname;
      const file = storage.file(fileNameImage);
      file.save(image.buffer, { contentType: image.mimetype }, function (err) {
        if (err) {
          let imageMessage = "Error occured while uploading image: " + err;
          reject(imageMessage);
        } else {
          file.makePublic();
          resolve(file.publicUrl());
        }
      });
    });
    const imageUrl = await imagePromise;
    await firestore
      .collection("notification")
      .doc(id)
      .set({
        description: data.description,
        image: imageUrl,
        is_read: data.is_read == "true" ? true : false,
        title: data.title,
        user_id: data.user_id,
      });
    res.status(200).send({
      message: 'Notification data updated successfuly',
      status: 200
    });
  } catch (error) {
    res.status(400).json({
      message: 'Something went wrong while updating data: ' + error.toString(),
      status: 400
    })
  }
}

export const destroyNotification = async (req, res) => {
  try {
    const id = req.params.id;
    await firestore.collection('notification').doc(id).delete();
    res.status(200).send({
      message: 'Notification deleted successfuly',
      status: 200
    });
  } catch (error) {
    res.status(400).json({
      message: 'Something went wrong while deleting data: ' + error.toString(),
      status: 400
    })
  }
}
