import Driver from '../models/driverModel.js'
import Vehicle from '../models/vehicleModel.js'
import jwt from 'jsonwebtoken'
import { db } from '../config/db.js'
import admin from 'firebase-admin'
import { uuid } from 'uuidv4'
const firestore = db.firestore()
const storage = db.storage().bucket()
let token = null

export const storeDriver = async (req, res, err) => {
  try {
    const data = req.body
    if(data.name && data.nik && data.phone && data.user_id && req.files.aggrement_letter[0] && req.files.student_card[0] && req.files.driving_license[0] && req.files.image[0]){
      //Upload files to firebase storage
      const aggrLetter = req.files.aggrement_letter[0]
      const studentCard = req.files.student_card[0]
      const drivingLicense = req.files.driving_license[0]
      const image = req.files.image[0]
      //Get user data
      const userPromise = new Promise((resolve, reject) => {
        firestore.collection('users').doc(data.user_id).get()
        .then(doc => {
          if(doc.exists){
            resolve(doc.data())
          }else{
            reject("User not found")
          }
        })
        .catch(err => {
          reject(err)
        })
      })
      //Upload aggrement letter
      const aggrLetterPromise = new Promise((resolve, reject) => {
        const fileNameAggrLetter = uuid() + aggrLetter.originalname
        const file = storage.file(fileNameAggrLetter)
        file.save(aggrLetter.buffer, {contentType: aggrLetter.mimetype}, function(err) {
          if(err){
            let aggrLetterMessage = "Error occured while uploading image: " + err
            reject(aggrLetterMessage)
          }else{
            file.makePublic();
            resolve(file.publicUrl())
          }
        })
      })
      //Upload student card
      const studentCardPromise = new Promise((resolve, reject) => {
        const fileNameStudentCard = uuid() + studentCard.originalname;
        const file = storage.file(fileNameStudentCard)
        file.save(studentCard.buffer, {contentType: studentCard.mimetype}, function(err) {
          if(err){
            let studentCardMessage = "Error occured while uploading image: " + err
            reject(studentCardMessage)
          }else{
            file.makePublic();
            resolve(file.publicUrl())
          }
        })
      })
      
      //Upload driving license
      const drivingLicensePromise = new Promise((resolve, reject) => {
        const fileNameDrivingLicense = uuid() + drivingLicense.originalname;
        const file = storage.file(fileNameDrivingLicense)
        file.save(drivingLicense.buffer, {contentType: drivingLicense.mimetype}, function(err) {
          if(err){
            let drivingLicenseMessage = "Error occured while uploading image: " + err
            reject(drivingLicenseMessage)
          }else{
            file.makePublic();
            resolve(file.publicUrl())
          }
        })
      })
      
      //Upload image
      const imagePromise = new Promise((resolve, reject) => {
        const fileNameImage = uuid() + image.originalname;
        const file = storage.file(fileNameImage)
        file.save(image.buffer, {contentType: image.mimetype}, function(err) {
          if(err){
            let imageMessage = "Error occured while uploading image: " + err
            reject(imageMessage)
          }else{
            file.makePublic()
            resolve(file.publicUrl())
          }
        })
      })
      await Promise.all([aggrLetterPromise, studentCardPromise, drivingLicensePromise, imagePromise, userPromise]).then(
        (values) => {
          // Store driver registration data to firestore
          firestore
            .collection("driver")
            .doc()
            .set({
              name: data.name,
              nik: data.nik,
              phone: data.phone,
              student_card: values[1],
              aggrement_letter: values[0],
              driving_license: values[2],
              user_id: data.user_id,
              email: values[4].email,
              status: "pending",
              image: values[3],
            })
            .then(() => {
              res.status(200).json({
                message: "Driver registration data stored successfuly",
                status: 200,
              });
            })
            .catch((error) => {
              res.status(400).json({
                message:
                  "Error occured while storing driver registration data: " +
                  error.message,
                status: 400,
              });
            });
        })
    }else{
      res.status(400).json({
        message: "Please upload all required files",
        status: 400,
      })
    }
  } catch (error) {
    res.status(400).json({
      message: "Error occured while storing driver registration data: " + error.toString(),
      status: 400,
    })
  }
}

export const getAllDrivers = async (req, res) => {
  try {
    const vehicle = await firestore
      .collection("vehicle")
      .get();
    const vehicleArray = vehicle.docs.map((doc) => {
      return {
        vehicle_id: doc.id,
        ...doc.data(),
      };
    });
    const user = await firestore.collection("users").get();
    const userArray = user.docs.map((doc) => {
      return {
        user_id: doc.id,
        ...doc.data(),
      };
    });
    const driver = await firestore.collection("driver").get();
    const driverArray = driver.docs
      .map((doc) => {
        return {
          driver_id: doc.id,
          name: doc.data().name,
          email: doc.data().email,
          nik: doc.data().nik,
          phone: doc.data().phone,
          student_card: doc.data().student_card,
          driving_license: doc.data().driving_license,
          aggrement_letter: doc.data().aggrement_letter,
          user_id: req.query.user !== undefined ? userArray.filter((user) => {
            if (doc.data().user_id == user.user_id) {
              return user;
            }
          }) : doc.data().user_id,
          status: doc.data().status,
          message: doc.data().message ? doc.data().message : "",
          image: doc.data().image,
          vehicle_id: vehicleArray.filter(
            (vehicle) => {
              if (doc.id == vehicle.driver_id) {
                return vehicle;
              }
            }
          ),
        };
      })

    res.status(200).json({
      message: "Driver data retrieved successfuly",
      data: driverArray,
      status: 200,
    });
  } catch (error) {
    res.status(400).json({
      message: `Error while retrieving driver data: ${error.message}`,
      status: 400,
    });
  }
}

export const getDriverByUserId = async (req, res) => {
  try{
    const user_id = req.params.id
    const vehicle = await firestore.collection("vehicle").get();
    const vehicleArray = vehicle.docs.map((doc) => {
      return {
        vehicle_id: doc.id,
        ...doc.data(),
      };
    });
    const user = await firestore.collection("users").doc(user_id).get();
    const userData = {
      user_id: user.id,
      ...user.data(),
    }
    const data = await firestore
      .collection("driver")
      .where("user_id", "==", user_id)
      .get();
    const driverData = data.docs[0];
    if (driverData == undefined) {
      res.status(404).json({
        message: `Driver with the given User ID ${user_id} not found`,
        status: 404,
      });
    } else {
      const driver = {
        driver_id: driverData.id,
        name: driverData.data().name,
        email: driverData.data().email,
        nik: driverData.data().nik,
        phone: driverData.data().phone,
        student_card: driverData.data().student_card,
        driving_license: driverData.data().driving_license,
        aggrement_letter: driverData.data().aggrement_letter,
        user_id: userData,
        status: driverData.data().status,
        message: driverData.data().message ? driverData.data().message : "",
        image: driverData.data().image,
        vehicle_id: vehicleArray.filter((vehicle) => {
          if (driverData.id == vehicle.driver_id) {
            return vehicle;
          }
        }),
      };

      res.status(200).json({
        message: "Driver data retrieved successfuly",
        data: driver,
        status: 200,
      });
    }
  }catch(error){
    res.status(500).json({
      message: "Error while fetching data: " + error.toString(),
      status: 500,
    })
  }
}

export const getDriverById = async (req, res) => {
  try{
    const vehicle = await firestore.collection("vehicle").get();
    const vehicleArray = vehicle.docs.map((doc) => {
      return {
        vehicle_id: doc.id,
        ...doc.data(),
      };
    });
    const user = await firestore.collection("users").get();
    const userArray = user.docs.map((doc) => {
      return {
        user_id: doc.id,
        ...doc.data(),
      };
    });
    const id = req.params.id
    const data = await firestore.collection('driver').doc(id).get()
    if(!data.exists){
      res.status(404).json({
        message: "Driver with the given ID not found",
        status: 404,
      })
    }else{
      const driver = {
        driver_id: id,
        name: data.data().name,
        email: data.data().email,
        nik: data.data().nik,
        phone: data.data().phone,
        student_card: data.data().student_card,
        driving_license: data.data().driving_license,
        aggrement_letter: data.data().aggrement_letter,
        user_id:
          req.query.user !== undefined
            ? userArray.filter((user) => {
                if (data.data().user_id == user.user_id) {
                  return user;
                }
              })
            : data.data().user_id,
        status: data.data().status,
        message: data.data().message ? data.data().message : "",
        image: data.data().image,
        vehicle_id: vehicleArray.filter((vehicle) => {
          if (id == vehicle.driver_id) {
            return vehicle;
          }
        }),
      };

      res.status(200).json({
        message: "Driver data retrieved successfuly",
        data: driver,
        status: 200,
      })
    }
  }catch(error){
    res.status(500).send({
      message: "Something went wrong while fetching data: " + error.toString(),
      status: 500
    })
  }
}

export const updateDriver = async (req, res) => {
  try{
    const id = req.params.id
    const driver = await firestore.collection('driver').doc(id).get()
    if(!driver.exists){
      res.status(404).json({
        message: "Driver with the given ID not found",
        status: 404,
      })
      return
    }
    const driverData = driver.data()
    const data = req.body
    if (
      data.name &&
      data.nik &&
      data.phone
    ) {
      //Upload files to firebase storage
      const aggrLetter = req.files.aggrement_letter[0];
      const studentCard = req.files.student_card[0];
      const drivingLicense = req.files.driving_license[0];
      const image = req.files.image[0];
      //Upload aggrement letter
      const aggrLetterPromise = new Promise((resolve, reject) => {
        const fileNameAggrLetter = uuid() + aggrLetter.originalname;
        const file = storage.file(fileNameAggrLetter);
        file.save(
          aggrLetter.buffer,
          { contentType: aggrLetter.mimetype },
          function (err) {
            if (err) {
              let aggrLetterMessage =
                "Error occured while uploading image: " + err;
              reject(aggrLetterMessage);
            } else {
              file.makePublic();
              resolve(file.publicUrl());
            }
          }
        );
      });
      //Upload student card
      const studentCardPromise = new Promise((resolve, reject) => {
        const fileNameStudentCard = uuid() + studentCard.originalname;
        const file = storage.file(fileNameStudentCard);
        file.save(
          studentCard.buffer,
          { contentType: studentCard.mimetype },
          function (err) {
            if (err) {
              let studentCardMessage =
                "Error occured while uploading image: " + err;
              reject(studentCardMessage);
            } else {
              file.makePublic();
              resolve(file.publicUrl());
            }
          }
        );
      });

      //Upload driving license
      const drivingLicensePromise = new Promise((resolve, reject) => {
        const fileNameDrivingLicense = uuid() + drivingLicense.originalname;
        const file = storage.file(fileNameDrivingLicense);
        file.save(
          drivingLicense.buffer,
          { contentType: drivingLicense.mimetype },
          function (err) {
            if (err) {
              let drivingLicenseMessage =
                "Error occured while uploading image: " + err;
              reject(drivingLicenseMessage);
            } else {
              file.makePublic();
              resolve(file.publicUrl());
            }
          }
        );
      });

      //Upload image
      const imagePromise = new Promise((resolve, reject) => {
        const fileNameImage = uuid() + image.originalname;
        const file = storage.file(fileNameImage);
        file.save(
          image.buffer,
          { contentType: image.mimetype },
          function (err) {
            if (err) {
              let imageMessage = "Error occured while uploading image: " + err;
              reject(imageMessage);
            } else {
              file.makePublic();
              resolve(file.publicUrl());
            }
          }
        );
      });
      await Promise.all([
        aggrLetterPromise,
        studentCardPromise,
        drivingLicensePromise,
        imagePromise,
      ]).then((values) => {
        // Store driver registration data to firestore
        firestore
          .collection("driver")
          .doc(id)
          .set({
            name: data.name ? data.name : driverData.name,
            email: driverData.email,
            nik: data.nik ? data.nik : driverData.nik,
            phone: data.phone ? data.phone : driverData.phone,
            student_card: studentCard ? values[1] : driverData.student_card,
            aggrement_letter: aggrLetter ? values[0] : driverData.aggrement_letter,
            driving_license: drivingLicense ? values[2] : driverData.driving_license,
            user_id: data.user_id ? data.user_id : driverData.user_id,
            status: data.status ? data.status : driverData.status,
            image: image ? values[3] : driverData.image,
          })
          .then(() => {
            res.status(200).json({
              message: "Driver registration data stored successfuly",
              status: 200,
            });
          })
          .catch((error) => {
            res.status(400).json({
              message:
                "Error occured while storing driver registration data: " +
                error.message,
              status: 400,
            });
          });
      });
    } else {
      res.status(400).json({
        message: "Please upload all required files",
        status: 400,
      })
    }
  }catch(error){
    res.status(400).json({
      message: "Error occured while updating driver data: " + error.message,
      status: 400,
    })
  }
}

export const destroyDriver = async (req, res) => {
  try{
    const id = req.params.id
    await firestore.collection('driver').doc(id).delete()
    res.send('Record deleted successfuly')
  }catch(error){
    res.status(400).json({
      message: "Error occured while deleting driver data: " + error.message,
      status: 400,
    })
  }
}
