import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { initializeApp } from 'firebase/app'
import { db, firebaseConfig } from '../config/db.js'
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
const firestore = db.firestore()
let token = null
const app = initializeApp(firebaseConfig)

// Create and Save a new userModel
export const storeUser = async (req, res) => {
    // Validate request
    if(!req.body) {
      return res.status(400).send({
          message: "Input can not be empty"
      });
    }

    // Create a userModel
    const user = new User({
      id: req.body.email,
      email: req.body.email,
      name: req.body.name,
      nik: req.body.nik,
      phone: req.body.phone,
    });

    // Save userModel in the database
    db.auth().createUser({
      email: req.body.email,
      emailVerified: false,
      password: req.body.password,
      displayName: req.body.name,
      disabled: false,
      photoURL: "https://example.com/jane-q-user/profile.jpg",
    })
    .then(async function(data) {
        await firestore.collection('users').doc(data.uid).set({
          email: req.body.email,
          name: req.body.name,
          nik: req.body.nik,
          phone: req.body.phone,
        });
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the user."
        });
    });
}

// Login a user
export const login = async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    signInWithEmailAndPassword(getAuth(app), email, password)
    .then(async data => {
        const userData = await firestore.collection('users').doc(data.user.uid)
        const datauser = await userData.get();
        if(!datauser.exists) {
          return res.status(404).json({
            message: 'Some error occurred while logging in the user: data not found',
            status: 404
          });
        }else{
          token = jwt.sign({
            userId: data.user.uid,
            userEmail: data.user.email
          },
          "RANDOM-TOKEN",
          { expiresIn: "24h" });
          res.status(200).send({
            message: "Login Successful",
            email: data.user.email,
            token: token,
            status: 200
          });
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while logging in the user.",
            status: 500
        });
    });
}

// Logout a user
export const logout = async (req, res) => {
    const auth = getAuth(app);
    signOut(auth).then(() => {  
        res.status(200).send({  
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
        res.status(404).send('No user record found');
    }
    else{
        data.forEach(doc => {
          usersArray.push({
            id: doc.id,
            email: doc.data().email,
            name: doc.data().name,
            nik: doc.data().nik,
            phone: doc.data().phone,
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
    const user = await firestore.collection('users').doc(req.params.id);
    const data = await user.get();
    if(data.empty){
      res.status(404).send('No user record found');
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
        res.status(400).send({
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
              res.status(200).send({
                  message: "Password reset successfully",
                  status: 200
              });
          })
          .catch(function(error) {
              res.status(500).send({
                  message: error.message || "Some error occurred while resetting the password.",
                  status: 500
              });
          });
      })
      .catch(function(error) {
          res.status(500).send({
              message: error.message || "Some error occurred while resetting the password.",
              status: 500
          });
      });
    }
}

export const destroyUser = async (req, res) => {
    const uid = req.params.id
    const user = await firestore.collection('users').doc(uid);
    const data = await user.get();
    if(!data.exists) {
        res.status(404).send('No user record found');
    }
    else{
        await firestore.collection('users').doc(uid).delete();
        db.auth().getUser(uid).then(function(userRecord) {
          db.auth().deleteUser(userRecord.uid)
          .then(function() {
              res.status(200).send({
                  message: "User deleted successfully",
                  status: 200
              });
          })
          .catch(function(error) {
              res.status(500).send({
                  message: error.message || "Some error occurred while deleting the user.",
                  status: 500
              });
          })
        })
    }
}
