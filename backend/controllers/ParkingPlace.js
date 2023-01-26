import ParkingPlace from "../models/parkingPlaceModel.js";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import { v4 as uuid } from "uuid";
const storage = db.storage().bucket();
let token = null;
const firestore = db.firestore();

export const storeParkingPlace = async (req, res) => {
  try {
    const data = req.body;
    const image = req.file;
    // Upload image to firebase storage
    const imagePromise = new Promise((resolve, reject) => {
      const fileNameImage = uuid() + image.originalname;
      const file = storage.file(fileNameImage);
      file.save(image.buffer, { contentType: file.mimetype }, function (err) {
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
    await firestore.collection("parking_place").doc().set({
      name: data.name,
      image: imageUrl,
      sub_name: data.sub_name,
    });
    res.status(200).json({
      message: "Parking place data saved successfuly",
      status: 200,
    })
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong while saving data: " + error.toString(),
      status: 400,
    })
  }
}

export const getAllParkingPlaces = async (req, res) => {
  try {
    const data = await firestore.collection("parking_place").get();
    const parkingPlaceArray = [];
    if (data.empty) {
      res.status(404).json({
        message: "No parking place record found",
        status: 404,
      })
    } else {
      data.forEach(doc => {
        const parkingPlace = new ParkingPlace(
          doc.id,
          doc.data().name,
          doc.data().image,
          doc.data().sub_name
        );
        parkingPlaceArray.push(parkingPlace);
      });
      res.status(200).json({
        message: "Parking place data retrieved successfuly",
        data: parkingPlaceArray,
        status: 200
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while fetching data: " + error.toString(),
      status: 500
    });
  }
}

export const getParkingPlaceById = async (req, res) => {
  try {
    const id = req.params.id;
    const parkingPlace = firestore.collection("parking_place").doc(id);
    const data = await parkingPlace.get();
    if (!data.exists) {
      res.status(404).json({
        message: "Parking place with the given ID not found",
        status: 404,
      })
    } else {
      res.status(200).json({
        message: "Parking place data retrieved successfuly",
        data: data.data(),
        status: 200
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while fetching data: " + error.toString(),
      status: 500
    });
  }
}

export const updateParkingPlace = async (req, res) => {
  try {
    const id = req.params.id;
    const imageFile = req.file;
    // Upload image to firebase storage
    const imagePromise = new Promise((resolve, reject) => {
      const fileNameImage = uuid() + imageFile.originalname;
      const file = storage.file(fileNameImage);
      file.save(imageFile.buffer, { contentType: file.mimetype }, function (err) {
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
    const data = req.body;
    const parkingPlace = firestore.collection("parking_place").doc(id);
    if(!imageFile){
      await parkingPlace.update({
        name: data.name,
        sub_name: data.sub_name,
      }, { merge: true });
    }else{   
      await parkingPlace.update({
        name: data.name,
        image: imageUrl,
        sub_name: data.sub_name,
      });
    }
    res.status(200).json({
      message: "Parking place updated successfuly",
      status: 200
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while updating data: " + error.toString(),
      status: 500
    });
  }
}

export const destroyParkingPlace = async (req, res) => {
  try {
    const id = req.params.id;
    await firestore.collection("parking_place").doc(id).delete();
    res.status(200).json({
      message: "Parking place deleted successfuly",
      status: 200
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while deleting data: " + error.toString(),
      status: 500
    });
  }
}
