export default class Notification {
  constructor(id, description, image, is_read, title, user_id){
    this.id = id;
    this.description = description;
    this.image = image;
    this.is_read = is_read;
    this.title = title;
    this.user_id = user_id;
  }
}
