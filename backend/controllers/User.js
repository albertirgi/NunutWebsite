import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { initializeApp } from 'firebase/app'
import { db, firebaseConfig } from '../config/db.js'
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { uuid } from 'uuidv4'
const firestore = db.firestore()
const storage = db.storage().bucket()
let token = null
const app = initializeApp(firebaseConfig)

// Create and Save a new userModel
export const storeUser = async (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).json({
      message: "Input can not be empty",
    });
  }

  // Upload image to storage
  let publicUrl =
    "https://firebasestorage.googleapis.com/v0/b/nunut-da274.appspot.com/o/avatar.png?alt=media&token=62dfdb20-7aa0-4ca4-badf-31c282583b1b";
  const image = req.file;
  if (image) {
    let status = true;
    let message = "";
    const fileName = uuid() + ".png";
    const blob = storage.file(fileName);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream.on("error", function (err) {
      status = false;
      message = "Error occured while uploading image: " + err;
    });
    blobStream.on("finish", async function () {
      publicUrl = `https://storage.googleapis.com/${storage.name}/${blob.name}`;
    });
    blobStream.end(image.buffer);
    if (!status) {
      res.status(500).json({
        message: message,
        status: 500,
      });
      return;
    }
  }

  // Save userModel in the database
  db.auth()
    .createUser({
      email: req.body.email,
      emailVerified: false,
      password: req.body.password,
      displayName: req.body.name,
      disabled: false,
      photoURL: publicUrl,
    })
    .then(async function (data) {
      await firestore.collection("users").doc(data.uid).set({
        email: req.body.email,
        name: req.body.name,
        nik: req.body.nik,
        phone: req.body.phone,
        image: publicUrl,
        role: req.body.role,
      });
      res.status(200).json({
        message: "User created successfully",
        data: data,
        status: 200,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message || "Some error occurred while creating the user.",
        status: 500,
      });
    });
}

export const updateUser = async (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).json({
      message: "Input can not be empty",
    });
  }

  // Upload image to storage
  let publicUrl =
    "https://firebasestorage.googleapis.com/v0/b/nunut-da274.appspot.com/o/avatar.png?alt=media&token=62dfdb20-7aa0-4ca4-badf-31c282583b1b";
  const image = req.file;
  if (image) {
    const imagePromise = new Promise((resolve, reject) => {
      const fileNameImage = uuid() + image.originalname;
      const file = storage.file(fileNameImage);
      file.save(image.buffer, { contentType: image.mimetype }, function (err) {
        if (err) {
          let imageMessage = "Error occured while uploading image: " + err;
          reject(imageMessage);
        } else {
          file.makePublic();
          const pubUrl = file.publicUrl();
          resolve(pubUrl);
        }
      });
    });
    publicUrl = await imagePromise;
  }

  // Save userModel in the database
  await firestore.collection("users").doc(data.uid).set({
    name: req.body.name,
    nik: req.body.nik,
    phone: req.body.phone,
    image: publicUrl,
  });
  res.status(200).json({
    message: "User updated successfully",
    status: 200,
  });
};

// Login a user
export const login = async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    signInWithEmailAndPassword(getAuth(app), email, password)
    .then(async data => {
        const userData = firestore.collection('users').doc(data.user.uid)
        const datauser = await userData.get();
        if(!datauser.exists) {
          return res.status(404).json({
            message: 'Some error occurred while logging in the user: data not found',
            status: 404
          });
        }else{
          token = jwt.sign(
            {
              userId: data.user.uid,
              userEmail: data.user.email,
            },
            "9d891f12a761461d918c8264ad3f0e2e9a49998f008982c0cee73467e657e1f2",
            { expiresIn: "24h" }
          );
          const sendData = {
            token: token,
          }
          res.status(200).json({
            message: "Login Successful",
            data: sendData,
            status: 200
          });
        }
    }).catch(err => {
        res.status(500).json({
            message: err.message || "Some error occurred while logging in the user.",
            status: 500
        });
    });
}

// Logout a user
export const logout = async (req, res) => {
    const auth = getAuth(app);
    signOut(auth).then(() => {  
        res.status(200).json({  
            message: "Logout Successful",
        });
    });
}

// Retrieve all users from the database.
export const getAllUsers = async (req, res) => {
    const users = await firestore.collection('users');
    const data = await users.get();
    const usersArray = [];
    if(data.empty) {
      res.status(404).json({
        message: 'No user record found',
        status: 404
      })
    }
    else{
        data.forEach(doc => {
          usersArray.push({
            id: doc.id,
            email: doc.data().email,
            name: doc.data().name,
            nik: doc.data().nik,
            phone: doc.data().phone,
            image: doc.data().image,
            role: doc.data().role
          });
        });
        res.status(200).json({
          message: "All users retrieved successfully",
          users: usersArray,
          status: 200
        });
    }
}

export const getUserById = async (req, res) => {
    const user = firestore.collection('users').doc(req.params.id);
    const data = await user.get();
    if(data.empty){
      res.status(404).json({
        message: 'No user record found',
        status: 404
      })
    }else{
      res.status(200).json({
        message: "User retrieved successfully",
        user: data.data(),
        status: 200
      });
    }
}

export const resetPassword = async (req, res) => {
    const email = req.body.email 
    const auth = db.auth()
    // Check password and confirm password
    if(req.body.password != req.body.confirmPassword){
        res.status(400).json({
            message: "Password and confirm password do not match",
            status: 400
        });
    }
    else{
      await auth.getUserByEmail(email)
      .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
          auth.updateUser(userRecord.uid, {
              password: req.body.password 
          })
          .then(function(userRecord) {
              res.status(200).json({
                  message: "Password reset successfully",
                  status: 200
              });
          })
          .catch(function(error) {
              res.status(500).json({
                  message: error.message || "Some error occurred while resetting the password.",
                  status: 500
              });
          });
      })
      .catch(function(error) {
          res.status(500).json({
              message: error.message || "Some error occurred while resetting the password.",
              status: 500
          });
      });
    }
}

export const destroyUser = async (req, res) => {
    const uid = req.params.id
    const user = firestore.collection('users').doc(uid);
    const data = await user.get();
    if(!data.exists) {
      res.status(404).json({
        message: 'No user record found',
        status: 404
      })
    }
    else{
        await firestore.collection('users').doc(uid).delete();
        db.auth().getUser(uid).then(function(userRecord) {
          db.auth().deleteUser(userRecord.uid)
          .then(function() {
              res.status(200).json({
                  message: "User deleted successfully",
                  status: 200
              });
          })
          .catch(function(error) {
              res.status(500).json({
                  message: error.message || "Some error occurred while deleting the user.",
                  status: 500
              });
          })
        })
    }
}
