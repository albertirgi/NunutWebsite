export default class RegisteredVehicle {
  constructor(id, color, expiredAt, isMain, licensePlate, note, type, userId, vehicleRegistrationId) {
    this.id = id;
    this.color = color;
    this.expiredAt = expiredAt;
    this.isMain = isMain;
    this.licensePlate = licensePlate;
    this.note = note;
    this.type = type;
    this.userId = userId;
    this.vehicleRegistrationId = vehicleRegistrationId;
  }
}
