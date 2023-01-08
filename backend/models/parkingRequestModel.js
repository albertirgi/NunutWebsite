export default class ParkingRequest {
  constructor(parking_request_id, parking_slot_id, ride_schedule_id, status){
    this.parking_request_id = parking_request_id;
    this.parking_slot_id = parking_slot_id;
    this.ride_schedule_id = ride_schedule_id;
    this.status = status
  }
}
