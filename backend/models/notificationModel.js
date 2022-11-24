export default class Notification {
  constructor(id, description, image, isRead, title, userId){
    this.id = id;
    this.description = description;
    this.image = image;
    this.isRead = isRead;
    this.title = title;
    this.userId = userId;
  }
}
