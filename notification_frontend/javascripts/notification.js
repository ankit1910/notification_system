var Notification  = function(notification) {
  this.id = notification.id;
  this.read = notification.read;
  this.notifier = notification.notifier;
  this.description = notification.description;
}

Notification.prototype.markRead = function() {
  this.read = true;
}

