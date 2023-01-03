import ParkingSlot from '../models/parkingSlotModel.js'
import jwt from 'jsonwebtoken'
import { db } from '../config/db.js'
import { v4 as uuid } from 'uuid'
const storage = db.storage().bucket()
let token = null
const firestore = db.firestore()

export const storeParkingSlot = async (req, res) => {
  try {
    const data = req.body
    const image = req.file
    // Upload image to storage
    const imagePromise = new Promise((resolve, reject) => {
      const fileNameImage = uuid() + image.originalname;
      const file = storage.file(fileNameImage);
      file.save(image.buffer, { contentType: image.mimetype }, function (err) {
        if (err) {
          let imageMessage = "Error occured while uploading image: " + err;
          reject(imageMessage)
        } else{
          file.makePublic()
          resolve(file.publicUrl())
        }
      })
    })
    const imageUrl = await imagePromise
    await firestore.collection('parking_slot').doc().set({
      parking_building_id: data.parking_building_id,
      instruction: data.instruction,
      image: imageUrl,
      subtitle: data.subtitle,
      title: data.title
    })
    res.send('Record saved successfuly')
  } catch (error) {
    res.status(400).send(error.message)
  }
}

export const getAllParkingSlots = async (req, res) => {
  try {
    const data = await firestore.collection('parking_slot').get()
    const parkingSlotArray = []
    const parkingBuilding = await firestore.collection('parking_building').get()
    const parkingBuildingArray = req.query.parking_building !== undefined ? parkingBuilding.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    }) : null
    if (data.empty) {
      res.status(404).send('No parking slot record found')
    } else {
      data.forEach(doc => {
        const parkingSlot = new ParkingSlot(
          doc.id,
          req.query.parking_building !== undefined ? parkingBuildingArray.find(
            (parkingBuilding) =>
              parkingBuilding.id === doc.data().parking_building_id 
          ) : doc.data().parking_building_id,
          doc.data().instruction,
          doc.data().image,
          doc.data().subtitle,
          doc.data().title,
        )
        parkingSlotArray.push(parkingSlot)
      })
      res.status(200).send({
        message: 'Parking slot data retrieved successfuly',
        data: parkingSlotArray,
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

export const getParkingSlotById = async (req, res) => {
  try {
    const id = req.params.id
    const data = await firestore.collection('parking_slot').doc(id).get()
    const parkingBuilding = await firestore.collection('parking_building').get()
    const parkingBuildingArray = req.query.parking_building !== undefined ? parkingBuilding.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    }) : null
    if (!data.exists) {
      res.status(404).send('Parking slot with the given ID not found')
    } else {
      res.status(200).send({
        message: 'Parking slot data retrieved successfuly',
        data: {
          id: data.id,
          parking_building: req.query.parking_building !== undefined ? parkingBuildingArray.find(
            (parkingBuilding) =>
              parkingBuilding.id === data.data().parking_building_id
          ) : data.data().parking_building_id,
          instruction: data.data().instruction,
          image: data.data().image,
          subtitle: data.data().subtitle,
          title: data.data().title,
        },
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

export const updateParkingSlot = async (req, res) => {
  try {
    console.log(req.file)
    const id = req.params.id
    const data = req.body
    const parkingSlot = await firestore.collection('parking_slot').doc(id).get()
    const parkingSlotData = parkingSlot.data()
    const image = req.file;
    // Upload image to storage
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
    await firestore.collection("parking_slot").doc(id).set({
      parking_building_id: data.parking_building_id ? data.parking_building_id : parkingSlotData.parking_building_id,
      instruction: data.instruction ? data.instruction : parkingSlotData.instruction,
      image: image ? imageUrl : parkingSlotData.image,
      subtitle: data.subtitle ? data.subtitle : parkingSlotData.subtitle,
      title: data.title ? data.title : parkingSlotData.title,
    });
    res.status(200).send('Parking slot record updated successfuly')
  } catch (error) {
    res.status(400).send(error.message)
  }
}

export const destroyParkingSlot = async (req, res) => {
  try {
    const id = req.params.id
    await firestore.collection('parking_slot').doc(id).delete()
    res.status(200).send('Parking slot record deleted successfuly')
  } catch (error) {
    res.status(400).send(error.message)
  }
}
