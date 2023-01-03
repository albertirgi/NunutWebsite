export default class Voucher {
  constructor(id, code, expired_at, minimum, maximum, tnc, image, type, discount){
    this.id = id
    this.code = code
    this.expired_at = expired_at
    this.minimum = minimum
    this.maximum = maximum
    this.tnc = tnc
    this.image = image,
    this.type = type
    this.discount = discount
  }
}
