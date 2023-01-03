export default class ParkingRequest {
  constructor(id, parking_slot_id, ride_schedule_id, status){
    this.id = id;
    this.parking_slot_id = parking_slot_id;
    this.ride_schedule_id = ride_schedule_id;
    this.status = status
  }
}
