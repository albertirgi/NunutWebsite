export default class ParkingRequest {
  constructor(id, parkingSlotId, rideScheduleId){
    this.id = id;
    this.parkingSlotId = parkingSlotId;
    this.rideScheduleId = rideScheduleId;
  }
}
