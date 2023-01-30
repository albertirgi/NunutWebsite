export default class Vehicle {
  constructor(id, transportation_type, license_plate, expired_at, color, note, is_main, driver) {
    this.id = id;
    this.transportation_type = transportation_type;
    this.license_plate = license_plate;
    this.expired_at = expired_at;
    this.color = color;
    this.note = note;
    this.is_main = is_main;
    this.driver = driver;
  }
}
