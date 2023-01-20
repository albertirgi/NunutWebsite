export default class VehicleType {
 constructor(vehicle_type_id, name, fuel_consumption, fuel_type){
  this.vehicle_type_id = vehicle_type_id;
  this.name = name;
  this.fuel_consumption = fuel_consumption;
  this.fuel_type = fuel_type;
 }

 static fromFirestore(snapshot){
  const data = snapshot.data();
  return new VehicleType(snapshot.id, data.name, data.fuel_consumption, data.fuel_type);
 }

 toFirestore(){
  return {
   name: this.name,
   fuel_consumption: this.fuel_consumption,
   fuel_type: this.fuel_type
  }
 }
}