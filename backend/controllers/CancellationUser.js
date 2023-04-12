import CancellationUser from "../models/cancellationUserModel.js";
import { db } from "../config/db.js";
import { uuid } from "uuidv4";
import Validator from "validatorjs";
const firestore = db.firestore();

export const storeCancellationUser = async (req, res) => {
  try {
    const data = req.body;
    const validator = new Validator(data, {
      user_id: "required",
      ride_request_id: "required",
      title: "required",
      description: "required",
    });
    if (validator.fails()) {
      res.status(400).json({
        message: validator.errors.all(),
        status: 400,
      });
      return;
    }
    // Validate data
    // if (!data.user_id) {
    //   res.status(400).json({
    //     message: 'user_id is required',
    //     status: 400
    //   })
    //   return
    // }
    // if (!data.ride_request_id) {
    //   res.status(400).json({
    //     message: 'ride_request_id is required',
    //     status: 400
    //   })
    //   return
    // }
    // if (!data.title) {
    //   res.status(400).json({
    //     message: 'title is required',
    //     status: 400
    //   })
    //   return
    // }
    // if (!data.description) {
    //   res.status(400).json({
    //     message: 'description is required',
    //     status: 400
    //   })
    //   return
    // }
    const cancellationUser = new CancellationUser(
      uuid(),
      data.user_id,
      data.ride_request_id,
      data.title,
      data.description,
      "PENDING"
    );
    await firestore
      .collection("cancellation_user")
      .doc(cancellationUser.cancellation_user_id)
      .set(cancellationUser.toFirestore());
    await firestore.collection("ride_request").doc(data.ride_request_id).set({
      status_ride: "CANCELED",
    }, { merge: true });
    await firestore.collection("ride_order").where("ride_request_id", "==", data.ride_request_id).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if(doc.data().from == data.user_id){
          firestore.collection("ride_order").doc(doc.id).set({
            status_payment: "REFUND",
          }, { merge: true }).then(() => {
            firestore.collection("wallet").where("user_id", "==", data.user_id).get().then((querySnapshotWallet) => {
              querySnapshotWallet.forEach((walletDoc) => {
                firestore.collection("wallet").doc(walletDoc.id).set({
                  balance: walletDoc.data().balance + doc.data().price_after,
                }, { merge: true });
              });
            });
          });
        }
      });
    });
    res.status(200).json({
      message: "CancellationUser successfully added",
      data: cancellationUser,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding cancellationUser",
      data: error.toString(),
      status: 500,
    });
  }
};

export const updateCancellationUser = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;
    const validator = new Validator(data, {
      user_id: "required",
      ride_request_id: "required",
      title: "required",
      description: "required",
    });
    if (validator.fails()) {
      res.status(400).json({
        message: validator.errors.all(),
        status: 400,
      });
      return;
    }
    // Validate data
    // if (!data.user_id) {
    //   res.status(400).json({
    //     message: 'user_id is required',
    //     status: 400
    //   })
    //   return
    // }
    // if (!data.ride_request_id) {
    //   res.status(400).json({
    //     message: 'ride_request_id is required',
    //     status: 400
    //   })
    //   return
    // }
    // if (!data.title) {
    //   res.status(400).json({
    //     message: 'title is required',
    //     status: 400
    //   })
    //   return
    // }
    // if (!data.description) {
    //   res.status(400).json({
    //     message: 'description is required',
    //     status: 400
    //   })
    //   return
    // }
    const cancellationUser = new CancellationUser(
      id,
      data.user_id,
      data.ride_request_id,
      data.title,
      data.description
    );
    await firestore
      .collection("cancellation_user")
      .doc(cancellationUser.cancellation_user_id)
      .update(cancellationUser.toFirestore());
    await firestore.collection("ride_request").doc(data.ride_request_id).set(
      {
        status_ride: "CANCELED",
      },
      { merge: true }
    );
    res.status(200).json({
      message: "CancellationUser successfully updated",
      data: cancellationUser,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating cancellationUser",
      data: error.toString(),
      status: 500,
    });
  }
};

export const deleteCancellationUser = async (req, res) => {
  try {
    const id = req.params.id;
    await firestore.collection("cancellation_user").doc(id).delete();
    res.status(200).json({
      message: "CancellationUser successfully deleted",
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting cancellationUser",
      data: error.toString(),
      status: 500,
    });
  }
};

export const getCancellationUser = async (req, res) => {
  try {
    const id = req.params.id;
    const cancellationUser = firestore.collection("cancellation_user").doc(id);
    const user = await firestore.collection("users").get();
    const rideRequest = await firestore.collection("ride_request").get();
    const userArray =
      req.query.user !== undefined
        ? user.docs.map((doc) => {
            return {
              user_id: doc.id,
              ...doc.data(),
            };
          })
        : null;
    const rideRequestArray =
      req.query.ride_request !== undefined
        ? rideRequest.docs.map((doc) => {
            return {
              ride_request_id: doc.id,
              ...doc.data(),
            };
          })
        : null;
    const data = await cancellationUser.get();
    const cancellationUserData = new CancellationUser(
      data.id,
      userArray != null
        ? userArray.filter((user) => user.user_id === data.data().user_id)
        : data.data().user_id,
      rideRequestArray != null
        ? rideRequestArray.filter(
            (rideRequest) =>
              rideRequest.ride_request_id === data.data().ride_request_id
          )
        : data.data().ride_request_id,
      data.data().title,
      data.data().description
    );
    if (!data.exists) {
      res.status(404).json({
        message: "CancellationUser not found",
        status: 404,
      });
      return;
    }
    res.status(200).json({
      message: "CancellationUser successfully retrieved",
      data: cancellationUserData,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving cancellationUser",
      data: error.toString(),
      status: 500,
    });
  }
};

export const getAllCancellationUsers = async (req, res) => {
  try {
    const cancellationUser = firestore.collection("cancellation_user");
    const data = await cancellationUser.get();
    const cancellationUserArray = [];
    const user = await firestore.collection("users").get();
    const userArray =
      req.query.user !== undefined
        ? user.docs.map((doc) => {
            return {
              user_id: doc.id,
              ...doc.data(),
            };
          })
        : null;
    const rideRequest = await firestore.collection("ride_request").get();
    const rideRequestArray =
      req.query.ride_request !== undefined
        ? rideRequest.docs.map((doc) => {
            return {
              ride_request_id: doc.id,
              ...doc.data(),
            };
          })
        : null;
    if (data.empty) {
      res.status(404).json({
        message: "No CancellationUser found",
        status: 404,
      });
      return;
    }
    data.forEach((doc) => {
      const cancellationUser = new CancellationUser(
        doc.id,
        userArray != null
          ? userArray.filter((user) => {
              return user.user_id === doc.data().user_id;
            })
          : doc.data().user_id,
        rideRequestArray != null
          ? rideRequestArray.filter((rideRequest) => {
              return rideRequest.ride_request_id === doc.data().ride_request_id;
            })
          : doc.data().ride_request_id,
        doc.data().title,
        doc.data().description
      );
      cancellationUserArray.push(cancellationUser);
    });
    res.status(200).json({
      message: "All CancellationUser successfully retrieved",
      data: cancellationUserArray,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving cancellationUser",
      data: error.toString(),
      status: 500,
    });
  }
};
