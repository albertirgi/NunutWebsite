export default class ParkingSlot {
  constructor(parking_slot_id, parking_building_id, instruction, image, subtitle, title, status){
    this.parking_slot_id = parking_slot_id;
    this.parking_building_id = parking_building_id;
    this.instruction = instruction;
    this.image = image;
    this.subtitle = subtitle;
    this.title = title;
    this.status = status;
  }
}
