import Notification from '../models/notificationModel.js';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
let token = null;
const firestore = db.firestore();

export const storeNotification = async (req, res) => {
  try {
    const data = req.body;
    await firestore.collection('notifications').doc().set(data);
    res.send('Record saved successfuly');
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export const getAllNotifications = async (req, res) => {
  try {
    const data = await firestore.collection('notifications').get();
    const notificationArray = [];
    if (data.empty) {
      res.status(404).send('No notification record found');
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
    const data = await firestore.collection('notifications').doc(id).get();
    if (!data.exists) {
      res.status(404).send('Notification with the given ID not found');
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
    const notification = await firestore.collection('notifications').doc(id);
    await notification.update(data);
    res.status(200).send({
      message: 'Notification data updated successfuly',
      status: 200
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export const destroyNotification = async (req, res) => {
  try {
    const id = req.params.id;
    await firestore.collection('notifications').doc(id).delete();
    res.status(200).send({
      message: 'Notification deleted successfuly',
      status: 200
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
}
