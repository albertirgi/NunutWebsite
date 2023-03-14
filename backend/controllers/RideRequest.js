import RideRequest from '../models/rideRequestModel.js';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
let token = null;
const firestore = db.firestore();

export const storeRideRequest = async (req, res) => {
  try {
    const data = req.body;
    // Check ride request and user id
    const rideRequest = await firestore.collection('ride_request').where('ride_schedule_id', '==', data.ride_schedule_id).where('user_id', '==', data.user_id).get();
    if (!rideRequest.empty) {
      res.status(400).json({
        message: 'You have already requested this ride',
        status: 400,
      });
      return;
    }
    const rideSchedule = await firestore.collection('ride_schedule').doc(data.ride_schedule_id).get();
    if (!rideSchedule.exists) {
      res.status(404).json({
        message: 'No ride schedule record found',
        status: 404,
      });
      return;
    }
    const rideScheduleData = rideSchedule.data();
    const postRideRequest = await firestore.collection("ride_request").doc().set(data);
    const wallet = await firestore.collection('wallet').where('user_id', '==', data.user_id).get();
    if (wallet.empty) {
      res.status(404).json({
        message: 'No wallet record found',
        status: 404,
      });
      return;
    }
    // RIDE ORDER ==========================
    // const walletData = wallet.docs[0].data();
    // walletData.balance -= (rideScheduleData.price + (rideScheduleData.price * 0.1));
    // await firestore.collection('wallet').doc(wallet.docs[0].id).update(walletData);
    var userVoucher = await firestore.collection("user_voucher").get();
    if (data.voucher_id != undefined && data.voucher_id != "") {
      userVoucher = await firestore
        .collection("user_voucher")
        .where("voucher_id", "==", data.voucher_id)
        .get();
    }
    const userVoucherData = userVoucher.docs.map((doc) => {
      return {
        user_voucher_id: doc.id,
        voucher_id: doc.data().voucher_id,
        user_id: doc.data().user_id,
      };
    });
    // Check user wallet
    if (wallet.empty) {
      await firestore.collection("wallet").doc().set({
        user_id: data.user_id,
        balance: 0,
      });
      res.status(400).json({
        message: "Your wallet is empty, please top up your wallet first",
        status: 400,
      });
      return;
    }
    const walletData = wallet.docs[0].data();
    var price_after =
      rideScheduleData.price + (rideScheduleData.price * 10) / 100; // 10% tax fee
    // Check voucher
    if (
      data.voucher_id != undefined
    ) {
      const voucher = await firestore
        .collection("voucher")
        .doc(data.voucher_id)
        .get();
      if (!voucher.exists) {
        res.status(400).json({
          message: "Voucher not found",
          status: 400,
        });
        return;
      } else {
        // Check is used
        if (
          userVoucherData.find((userVoucher) => {
            return (
              userVoucher.user_id == data.user_id &&
              userVoucher.voucher_id == data.voucher_id
            );
          }).length > 0
        ) {
          res.status(400).json({
            message: "Voucher is used",
            status: 400,
          });
          return;
        }
        // Check voucher expired
        const voucherData = voucher.data();
        const voucherExpired = new Date(voucherData.expired_at);
        const today = new Date();

        if (today <= voucherExpired) {
          // Check voucher type
          if (voucherData.type == "percentage") {
            price_after =
              rideScheduleData.price -
              (rideScheduleData.price * voucherData.discount) / 100;
          } else {
            price_after = rideScheduleData.price - voucherData.discount;
          }
          if (price_after < 0) {
            price_after = 0;
          }
        }
        // Store User Voucher
        await firestore.collection("user_voucher").doc().set({
          user_id: data.user_id,
          voucher_id: data.voucher_id,
        });
      }
    }
    if (walletData.balance < price_after) {
      res.status(400).json({
        message:
          "Your wallet balance is not enough, please top up your wallet first",
        status: 400,
      });
      return;
    }
    // Check ride request
    const rideRequestSingle = await firestore
      .collection("ride_request")
      .doc(postRideRequest.id)
      .get();
    if (!rideRequestSingle.exists) {
      res.status(400).json({
        message: "Ride request not found",
        status: 400,
      });
      return;
    }
    // Substract wallet balance
    await firestore
      .collection("wallet")
      .doc(wallet.docs[0].id)
      .update({
        balance: walletData.balance - price_after,
      });

    // Get driver data
    const driver = await firestore
      .collection("driver")
      .doc(rideScheduleData.driver_id)
      .get();
    if (!driver.exists) {
      res.status(400).json({
        message: "Driver not found",
        status: 400,
      });
      return;
    }
    const driverData = driver.data();
    // Add ride order
    await firestore
      .collection("ride_order")
      .doc()
      .set({
        description: "Ride Order",
        discount: price_after - (rideScheduleData.price + (rideScheduleData.price * 10) / 100),
        from: postRideRequest.data().user_id,
        price_after: price_after,
        price_before: rideScheduleData.price + (rideScheduleData.price * 10) / 100,
        ride_request_id: postRideRequest.id,
        status_payment: "paid",
        to: driverData.user_id,
        type: "nominal",
        voucher_id: data.voucher_id != undefined ? data.voucher_id : "",
      });
    res.status(200).json({
      message: "Ride order data saved successfuly",
      status: 200,
    });
    // ==========================
    res.status(200).json({
      message: 'Ride request data saved successfuly',
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while saving data: ' + error.toString(),
      status: 500,
    })
  }
}

export const getAllRideRequests = async (req, res) => {
  try {
    const rideRequest = await firestore.collection('ride_request').get();
    const dataRideRequest = rideRequest.docs.map(doc => {
      return {
        ride_request_id: doc.id,
        ...doc.data(),
      };
    });
    const rideSchedule = await firestore.collection('ride_schedule').get();
    const rideScheduleArray = req.query.ride_schedule !== undefined ? rideSchedule.docs.map(doc => {
      return {
        ride_schedule_id: doc.id,
        ...doc.data(),
      };
    }) : null;
    const user = await firestore.collection('users').get();
    const userArray = req.query.user !== undefined ? user.docs.map(doc => {
      return {
        user_id: doc.id,
        ...doc.data(),
      };
    }) : null;
    const driver = await firestore.collection("driver").get();
    const driverArray =
      req.query.driver !== undefined
        ? driver.docs.map((doc) => {
            return {
              driver_id: doc.id,
              ...doc.data(),
            };
          })
        : null;
    const vehicle = await firestore.collection("vehicle").get();
    const vehicleArray =
      req.query.vehicle !== undefined
        ? vehicle.docs.map((doc) => {
            return {
              vehicle_id: doc.id,
              ...doc.data(),
            };
          })
        : null;
    const data = await firestore.collection('ride_request').get();
    var rideRequestArray = [];
    if (data.empty) {
      res.status(404).json({
        message: 'No ride request record found',
        status: 404,
      });
    } else {
      data.forEach(doc => {
        if(req.query.ride_schedule_only !== undefined && req.query.ride_schedule_only !== ""){
          const rideSchedule = rideScheduleArray.find((rideSchedule) => {
            return rideSchedule.ride_schedule_id == doc.data().ride_schedule_id;
          });
          const data = {
            ride_schedule_id: rideSchedule.id,
            date: rideSchedule.date,
            time: rideSchedule.time,
            meeting_point: rideSchedule.meeting_point,
            destination: rideSchedule.destination,
            note: rideSchedule.note,
            price: rideSchedule.price,
            driver: req.query.driver !== undefined
              ? driverArray.find((driver) => {
                  return driver.driver_id == rideSchedule.driver_id;
                })
              : rideSchedule.driver_id,
            vehicle: req.query.vehicle !== undefined
              ? vehicleArray.find((vehicle) => {
                  return vehicle.vehicle_id == rideSchedule.vehicle_id;
                })
              : rideSchedule.vehicle_id,
            capacity: rideSchedule.capacity,
            is_active: rideSchedule.is_active,
            ride_request: dataRideRequest.filter((rideRequest) => {
              return rideRequest.ride_schedule_id == rideSchedule.ride_schedule_id;
            }),
          };
          rideRequestArray.push(data);
        } else {
          const rideRequest = new RideRequest(
            doc.id,
            req.query.ride_schedule !== undefined ? rideScheduleArray.find((rideSchedule) => {
              return rideSchedule.ride_schedule_id == doc.data().ride_schedule_id;
            }) : doc.data().ride_schedule_id,
            doc.data().status_ride,
            req.query.user !== undefined ? userArray.find((user) => {
              return user.user_id == doc.data().user_id;
            }) : doc.data().user_id,
          );
          rideRequestArray.push(rideRequest);
        }
      });
      if(req.query.ride_schedule !== undefined && req.query.ride_schedule !== "") {
        rideRequestArray = rideRequestArray.filter((rideRequest) => {
          return rideRequest.ride_schedule_id.ride_schedule_id == req.query.ride_schedule;
        });
      }
      if(req.query.user !== undefined && req.query.user !== ""){
        rideRequestArray = rideRequestArray.filter((rideRequest) => {
          return rideRequest.user_id.user_id == req.query.user;
        });
      }
      if(req.query.status_ride !== undefined && req.query.status_ride !== ""){
        const active = req.query.status_ride == "active" ? true : false;
        if(active){
          rideRequestArray = rideRequestArray.filter((rideRequest) => {
            return rideRequest.status_ride == "ONGOING" || rideRequest.status_ride == "BOOKED";
          });
        } else {
          rideRequestArray = rideRequestArray.filter((rideRequest) => {
            return rideRequest.status_ride == "COMPLETED" || rideRequest.status_ride == "CANCELLED" || rideRequest.status_ride == "REJECTED" || rideRequest.status_ride == "EXPIRED" || rideRequest.status_ride == "FAILED" || rideRequest.status_ride == "DONE";
          });
        }
      }
      res.status(200).json({
        message: 'Ride request data retrieved successfuly',
        data: rideRequestArray,
        status: 200
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while fetching data: ' + error.toString(),
      status: 500
    });
  }
}

export const getRideRequestByList = async (req, res) => {
  try {
    const rideRequest = await firestore.collection('ride_request').get();
    const DataRideRequestArray = rideRequest.docs.map(doc => {
      return {
        ride_request_id: doc.id,
        ...doc.data(),
      };
    });
    const num = req.params.num;
    const rideSchedule = await firestore.collection("ride_schedule").get();
    const rideScheduleArray =
      rideSchedule.docs.map((doc) => {
            return {
              ride_schedule_id: doc.id,
              ...doc.data(),
            };
          });
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
    const driver = await firestore.collection("driver").get();
    const driverArray =
      req.query.driver !== undefined
        ? driver.docs.map((doc) => {
            return {
              driver_id: doc.id,
              ...doc.data(),
            };
          })
        : null;
    const vehicle = await firestore.collection("vehicle").get();
    const vehicleArray =
      req.query.vehicle !== undefined
        ? vehicle.docs.map((doc) => {
            return {
              vehicle_id: doc.id,
              ...doc.data(),
            };
          })
        : null;
    const data = await firestore.collection("ride_request").get();
    var rideRequestArray = [];
    if (data.empty) {
      res.status(404).json({
        message: "No ride request record found",
        status: 404,
      });
    } else {
      data.forEach((doc) => {
        if (
          req.query.ride_schedule_only !== undefined &&
          req.query.ride_schedule_only !== ""
        ) {
          if(doc.data().user_id == req.query.ride_schedule_only){
            const rideScheduleSingle = rideScheduleArray.find((rideSchedule) => {
              return rideSchedule.ride_schedule_id == doc.data().ride_schedule_id;
            });
            const capacity = DataRideRequestArray.filter((rideRequest) => {
              return rideRequest.ride_schedule_id == rideScheduleSingle.ride_schedule_id;
            }).length;
            const single = {
              ride_schedule_id: rideScheduleSingle.ride_schedule_id,
              date: rideScheduleSingle.date,
              time: rideScheduleSingle.time,
              meeting_point: rideScheduleSingle.meeting_point,
              destination: rideScheduleSingle.destination,
              note: rideScheduleSingle.note,
              price: rideScheduleSingle.price,
              driver_id:
                req.query.driver !== undefined
                  ? driverArray.find((driver) => {
                      return driver.driver_id == rideScheduleSingle.driver_id;
                    })
                  : rideScheduleSingle.driver_id,
              vehicle_id:
                req.query.vehicle !== undefined
                  ? vehicleArray.find((vehicle) => {
                      return (
                        vehicle.vehicle_id == rideScheduleSingle.vehicle_id
                      );
                    })
                  : rideScheduleSingle.vehicle_id,
              capacity: capacity,
              is_active: rideScheduleSingle.is_active,
              status_ride: doc.data().status_ride,
              ride_request: DataRideRequestArray.find((rideRequest) => {
                return rideRequest.user_id == req.query.ride_schedule_only;
              }),
            };
            rideRequestArray.push(single);
          }
        } else {
          const rideRequest = new RideRequest(
            doc.id,
            req.query.ride_schedule !== undefined
              ? rideScheduleArray.find((rideSchedule) => {
                  return (
                    rideSchedule.ride_schedule_id == doc.data().ride_schedule_id
                  );
                })
              : doc.data().ride_schedule_id,
            doc.data().status_ride,
            req.query.user !== undefined
              ? userArray.find((user) => {
                  return user.user_id == doc.data().user_id;
                })
              : doc.data().user_id
          );
          rideRequestArray.push(rideRequest);
        }
      });
      if (
        req.query.ride_schedule !== undefined &&
        req.query.ride_schedule !== ""
      ) {
        rideRequestArray = rideRequestArray.filter((rideRequest) => {
          return (
            rideRequest.ride_schedule_id.ride_schedule_id ==
            req.query.ride_schedule
          );
        });
      }
      if (req.query.user !== undefined && req.query.user !== "") {
        rideRequestArray = rideRequestArray.filter((rideRequest) => {
          return rideRequest.user_id.user_id == req.query.user;
        });
      }
      if (req.query.status_ride !== undefined && req.query.status_ride !== "") {
        const active = req.query.status_ride == "active" ? true : false;
        console.log(active);
        if (active) {
          rideRequestArray = rideRequestArray.filter((rideRequest) => {
            return (
              rideRequest.status_ride == "ONGOING" ||
              rideRequest.status_ride == "BOOKED"
            );
          });
        } else {
          rideRequestArray = rideRequestArray.filter((rideRequest) => {
            return (
              rideRequest.status_ride == "COMPLETED" ||
              rideRequest.status_ride == "CANCELLED" ||
              rideRequest.status_ride == "REJECTED" ||
              rideRequest.status_ride == "EXPIRED" ||
              rideRequest.status_ride == "FAILED" ||
              rideRequest.status_ride == "DONE"
            );
          });
        }
      }
      res.status(200).json({
        message: "Ride request data retrieved successfuly",
        data: rideRequestArray.slice(
          0 + (num - 1) * 10,
          num * 10
        ),
        status: 200,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while fetching data: " + error.toString(),
      status: 500,
    });
  }
};

export const getRideRequestById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await firestore.collection('ride_request').doc(id).get();
    const rideSchedule = await firestore.collection('ride_schedule').get();
    const rideScheduleArray = req.query.ride_schedule !== undefined ? rideSchedule.docs.map(doc => {
      return {
        ride_schedule_id: doc.id,
        ...doc.data(),
      };
    }) : null;
    const user = await firestore.collection('users').get();
    const userArray = req.query.user !== undefined ? user.docs.map(doc => {
      return {
        user_id: doc.id,
        ...doc.data()
      }
    }) : null;
    if (!data.exists) {
      res.status(404).json({
        message: 'Ride request with the given ID not found',
        status: 404,
      })
    } else {
      res.status(200).json({
        message: 'Ride request data retrieved successfuly',
        data: {
          ride_request_id: data.id,
          ride_schedule_id: req.query.ride_schedule !== undefined ? rideScheduleArray.find((rideSchedule) => {
            return rideSchedule.id == data.data().ride_schedule_id;
            }) : data.data().ride_schedule_id,
          status_payment: data.data().status_payment,
          user_id: req.query.user !== undefined ? userArray.find((user) => {
            return user.user_id == data.data().user_id;
            }) : data.data().user_id,
        },
        status: 200
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while fetching data: ' + error.toString(),
      status: 500
    });
  }
}

export const updateRideRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const rideRequest = firestore.collection("ride_request").doc(id);
    await rideRequest.update(data);
    // Check ride request and user id
    const rideRequestCheck = await firestore
      .collection("ride_request")
      .where("ride_schedule_id", "==", data.ride_schedule_id)
      .where("user_id", "==", data.user_id)
      .get();
    if (!rideRequestCheck.empty) {
      res.status(400).json({
        message: "You have already requested this ride",
        status: 400,
      });
      return;
    }
    res.status(200).json({
      message: "Ride request data updated successfuly",
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while updating data: ' + error.toString(),
      status: 500
    })
  }
}

export const destroyRideRequest = async (req, res) => {
  try {
    const id = req.params.id;
    await firestore.collection('ride_request').doc(id).delete();
    res.status(200).json({
      message: 'Ride request record deleted successfuly',
      status: 200,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while deleting data: ' + error.toString(),
      status: 500
    })
  }
}

export const updateStatusRideRequest = async (req, res) => {
  try {
    const id = req.params.id;
    if(id == 'all') {
      const rideRequestAll = await firestore.collection('ride_request').get();
      rideRequestAll.forEach(async (rideRequest) => {
        await rideRequest.ref.update({
          status_ride: 'REGISTERED'
        })
      })
      res.status(200).json({
        message: 'Ride request data updated successfuly',
        status: 200,
      });
      return;
    }else{
      const status = req.params.status;
      const rideRequest = firestore.collection("ride_request").doc(id);
      const data = await rideRequest.get();
      if (!data.exists) {
        res.status(404).json({
          message: "Ride request with the given ID not found",
          status: 404,
        });
        return;
      }
      await rideRequest.update({
        status_ride: status,
      });
      res.status(200).json({
        message: "Ride request data updated successfuly",
        status: 200,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong while updating data: ' + error.toString(),
      status: 500
    })
  }
}

