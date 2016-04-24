var NotificationController = function(input) {
  this.notifications           = [];
  this.unreadNotificationCount = 0;
  this.notificationCountSpan   = input.notificationCountSpan;
  this.dropdownBox             = input.dropdownBox;
  this.bellButton              = input.bellButton;
  this.notificationsUrl        = input.notificationsUrl
  this.pusherChannel           = input.pusherChannel
  this.dropdownContentBox      = input.dropdownContentBox;
  this.sampleNotificationRow   = input.sampleNotificationRow;
}

NotificationController.prototype.init = function() {
  this.dropdownBox.addClass('hide');
  this.fetchInitialNotifications();
  this.bindEvents();
};

NotificationController.prototype.bindEvents = function() {
  this.bindBellButtonEvent();
  this.bindPushEvents();
}

// BIND EVENTS
NotificationController.prototype.bindBellButtonEvent = function() {
  var _this = this;
  this.bellButton.click(function () {
    if(_this.dropdownBox.is(':visible')) {
      _this.dropdownBox.fadeOut()
    } else {
      _this.dropdownBox.fadeIn()
      _this.markAllNotificationsRead();
    }
  });
}

NotificationController.prototype.bindPushEvents = function() {
  var _this = this;

  _this.pusherChannel.bind('create_notification', function(data) {
    var notification = new Notification(data)
    _this.notifications.push(notification)
    _this.drawDropdownElements([notification]);
  });
}

// Fetch Notifications from backend using AJAX.
NotificationController.prototype.fetchInitialNotifications = function () {
  var _this = this;

  $.ajax({
    url:        _this.notificationsUrl,
    type:       'GET',
    dataType:   'JSON'
  }).success(function(data) {
    $.each(data, function(index, notificationData) {
      _this.notifications.push(new Notification(notificationData))
    });

    _this.drawDropdownElements(_this.notifications);
  }).fail(function(data) {
    alert("Couldn't fetch data, Maybe server is not working.");
  });
}

// Update Notifications on server using AJAX.
NotificationController.prototype.markAllNotificationsRead = function() {
  var _this = this,
      unreadNotifications = this.getUnreadNotifications(),
      notificationIds = [];

  notificationIds = $.map(unreadNotifications, function(notification) {
    return notification.id;
  });

  if(notificationIds.length) {
    $.ajax({
      url:      this.notificationsUrl + '/mark_as_read',
      type:     'PUT',
      dataType: 'JSON',
      data: { notification_ids: notificationIds }
    }).success(function(data) {
      $.each(unreadNotifications, function(index, notification) {
        notification.markRead();
      });
      _this.unreadNotificationCount = 0;
      _this.setNotifictionCount();
    }).fail(function(data) {
      alert("Couldn't mark notifications read, Maybe server is not working.");
    });
  }
};

// Set notification count in bubbles.
NotificationController.prototype.setNotifictionCount = function() {
  this.notificationCountSpan.html(this.unreadNotificationCount)
};

// Methods to draw elementry rows of notifications
NotificationController.prototype.drawDropdownElements = function(notifications) {
  var _this = this;

  var elements = $.map(notifications, function(notification) {
    return _this.notificationRowHtml(notification);
  });

  this.dropdownContentBox.prepend(elements)
  this.setNotifictionCount();
}

NotificationController.prototype.notificationRowHtml = function(notification) {
  var newElement = this.sampleNotificationRow.clone();

  newElement.find('[data-container="notification-user"]').append(notification.notifier);
  newElement.find('[data-container="notification-description"]').append(notification.description);

  if(!notification.read) { this.unreadNotificationCount++; }
  return newElement
}

NotificationController.prototype.getUnreadNotifications = function() {
  return $.map(this.notifications, function(notification) {
    if(!notification.read) { return notification; }
  });
}

NotificationController.prototype.getUnreadNotificationIds = function() {
  return $.map(this.getUnreadNotifications, function(notification) {
    return notification.id;
  });
}

//Start Program
$(document).ready(function() {
  var pusherChannel = (new Pusher('e409e0060e42dfb30b4f', { encrypted: true })).subscribe('notification_channel');
  var input = {
    notificationsUrl:       "http://localhost:9292/notifications",
    notificationCountSpan:  $("span[data-container='count']"),
    bellButton:             $("div[data-behaviour='bell-button']"),
    dropdownBox:            $("div[data-container='notification-box']"),
    pusherChannel:          pusherChannel,
    sampleNotificationRow:  $('[data-element="notification-content"]'),
    dropdownContentBox :    $('.notification-content-holder'),
  }
  var notificationController = new NotificationController(input);
  notificationController.init();
});
