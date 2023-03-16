export default class RideSchedule {
  constructor(ride_schedule_id, date, time, meeting_point, destination, note, price, driver_id, vehicle_id, capacity, is_active) {
    this.ride_schedule_id = ride_schedule_id;
    this.date = date;
    this.time = time;
    this.meeting_point = meeting_point;
    this.destination = destination;
    this.note = note;
    this.price = price;
    this.driver_id = driver_id;
    this.vehicle_id = vehicle_id;
    this.capacity = capacity;
    this.is_active = is_active;
  }
}
