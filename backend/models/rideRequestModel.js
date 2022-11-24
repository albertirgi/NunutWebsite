export default class RideRequest {
  constructor(id, rideScheduleId, statusPayment, statusRide, userId){
    this.id = id;
    this.rideScheduleId = rideScheduleId;
    this.statusPayment = statusPayment;
    this.statusRide = statusRide;
    this.userId = userId;
  }
}
