export default class VehicleType {
 constructor(vehicle_type_id, name, fuel_consumption, fuel_type, fuel_price){
  this.vehicle_type_id = vehicle_type_id;
  this.name = name;
  this.fuel_consumption = fuel_consumption;
  this.fuel_type = fuel_type;
  this.fuel_price = fuel_price
 }

 static fromFirestore(snapshot){
  const data = snapshot.data();
  return new VehicleType(snapshot.id, data.name, data.fuel_consumption, data.fuel_type, data.fuel_price);
 }

 toFirestore(){
  return {
   name: this.name,
   fuel_consumption: this.fuel_consumption,
   fuel_type: this.fuel_type,
   fuel_price: this.fuel_price
  }
 }
}