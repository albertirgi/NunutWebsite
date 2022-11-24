export default class Voucher {
  constructor(id, code, expiredAt, minimum, title, tnc){
    this.id = id
    this.code = code
    this.expiredAt = expiredAt
    this.minimum = minimum
    this.title = title
    this.tnc = tnc
  }
}
