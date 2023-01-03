export default class Transaction {
  constructor(id, wallet, order_id, token, amount, method, status, type){
    this.id = id;
    this.wallet = wallet;
    this.order_id = order_id;
    this.token = token;
    this.amount = amount;
    this.method = method;
    this.status = status;
    this.type = type;
  }
}