export default class Vehicle {
  constructor(vehicle_id, transportation_type, license_plate, expired_at, color, note, is_main, driver_id) {
    this.vehicle_id = vehicle_id;
    this.transportation_type = transportation_type;
    this.license_plate = license_plate;
    this.expired_at = expired_at;
    this.color = color;
    this.note = note;
    this.is_main = is_main;
    this.driver_id = driver_id;
  }
}
