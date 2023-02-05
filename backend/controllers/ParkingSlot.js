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
      title: data.title,
      status: data.status == "true" ? true : false
    })
    res.status(200).json({
      message: 'Record saved successfuly',
      status: 200
    })
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while saving data: ' + error.toString(),
      status: 500
    })
  }
}

export const getAllParkingSlots = async (req, res) => {
  try {
    const data = await firestore.collection('parking_slot').get()
    const parkingSlotArray = []
    var parkingBuilding = await firestore.collection('parking_building').get()
    if(req.query.parking_place !== undefined && req.query.parking_place !== ""){
      parkingBuilding = await firestore.collection('parking_building').where('parking_place_id', '==', req.query.parking_place).get()
      if(parkingBuilding.empty){
        res.status(404).json({
          message: 'No parking slot record found',
          status: 404
        })
        return
      }
    } 
    const parkingBuildingArray = parkingBuilding.docs.map(doc => {
      return {
        parking_building_id: doc.id,
        ...doc.data()
      }
    })
    if (data.empty) {
      res.status(404).json({
        message: 'No parking slot record found',
        status: 404
      })
    } else {
      data.forEach(doc => {
        if(req.query.parking_place !== undefined && req.query.parking_place != ""){
          if(doc.data().parking_building_id == parkingBuildingArray.find(parkingBuilding => parkingBuilding.parking_building_id === doc.data().parking_building_id).parking_building_id){
            const parkingSlot = new ParkingSlot(
              doc.id,
              req.query.parking_building !== undefined
                ? parkingBuildingArray.find(
                    (parkingBuilding) =>
                      parkingBuilding.parking_building_id ===
                      doc.data().parking_building_id
                  )
                : doc.data().parking_building_id,
              doc.data().instruction,
              doc.data().image,
              doc.data().subtitle,
              doc.data().title,
              doc.data().status
            );
            if(req.query.parking_building !== undefined && req.query.parking_building != ""){
              if(parkingSlot.parking_building_id.parking_building_id == req.query.parking_building){
                parkingSlotArray.push(parkingSlot);
              }
            }else{  
              parkingSlotArray.push(parkingSlot);
            }
          }
        }else{
          const parkingSlot = new ParkingSlot(
            doc.id,
            req.query.parking_building !== undefined
              ? parkingBuildingArray.find(
                  (parkingBuilding) =>
                    parkingBuilding.parking_building_id ===
                    doc.data().parking_building_id
                )
              : doc.data().parking_building_id,
            doc.data().instruction,
            doc.data().image,
            doc.data().subtitle,
            doc.data().title,
            doc.data().status
          );
          if (
            req.query.parking_building !== undefined &&
            req.query.parking_building != ""
          ) {
            if (
              parkingSlot.parking_building_id.parking_building_id ==
              req.query.parking_building
            ) {
              parkingSlotArray.push(parkingSlot);
            }
          } else {
            parkingSlotArray.push(parkingSlot);
          }
        }
      })
      res.status(200).json({
        message: 'Parking slot data retrieved successfuly',
        data: parkingSlotArray,
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

export const getParkingSlotById = async (req, res) => {
  try {
    const id = req.params.id
    const data = await firestore.collection('parking_slot').doc(id).get()
    const parkingBuilding = await firestore.collection('parking_building').get()
    const parkingBuildingArray = req.query.parking_building !== undefined ? parkingBuilding.docs.map(doc => {
      return {
        parking_building_id: doc.id,
        ...doc.data(),
      };
    }) : null
    if (!data.exists) {
      res.status(404).json({
        message: 'Parking slot with the given ID not found',
        status: 404
      })
    } else {
      res.status(200).json({
        message: "Parking slot data retrieved successfuly",
        data: {
          id: data.id,
          parking_building_id:
            req.query.parking_building !== undefined
              ? parkingBuildingArray.find(
                  (parkingBuilding) =>
                    parkingBuilding.parking_building_id ===
                    data.data().parking_building_id
                )
              : data.data().parking_building_id,
          instruction: data.data().instruction,
          image: data.data().image,
          subtitle: data.data().subtitle,
          title: data.data().title,
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

export const updateParkingSlot = async (req, res) => {
  try {
    const id = req.params.id
    const data = req.body
    const parkingSlot = await firestore.collection('parking_slot').doc(id).get()
    if(!parkingSlot.exists){
      res.status(404).json({
        message: 'Parking slot with the given ID not found',
        status: 404
      })
      return
    }
    const parkingSlotData = parkingSlot.data()
    const image = req.file;
    // Upload image to storage
    const imagePromise = new Promise((resolve, reject) => {
      if(image === undefined){
        resolve(parkingSlotData.image)
      }
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
    const imageUrl = image === undefined ? parkingSlotData.image : await imagePromise;
    await firestore.collection("parking_slot").doc(id).set({
      parking_building_id: data.parking_building_id ? data.parking_building_id : parkingSlotData.parking_building_id,
      instruction: data.instruction ? data.instruction : parkingSlotData.instruction,
      image: image ? imageUrl : parkingSlotData.image,
      subtitle: data.subtitle ? data.subtitle : parkingSlotData.subtitle,
      title: data.title ? data.title : parkingSlotData.title,
      status: data.status ? (data.status == "true" ? true : false) : parkingSlotData.status,
    });
    res.status(200).json({
      message: "Parking slot record updated successfuly",
      status: 200,
    })
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while updating data: " + error.toString(),
      status: 500,
    });
  }
}

export const destroyParkingSlot = async (req, res) => {
  try {
    const id = req.params.id
    await firestore.collection('parking_slot').doc(id).delete()
    res.status(200).json({
      message: 'Parking slot record deleted successfuly',
      status: 200
    })
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while deleting data: ' + error.toString(),
      status: 500
    })
  }
}
