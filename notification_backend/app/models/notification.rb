class Notification < ActiveRecord::Base

  # Validations
  validates :notifier, :description, presence: true

  # Class Methods
  def self.create_and_push
    notification = Notification.create({
      notifier: sample_data('name'),
      description: sample_data('description'),
      read: false
    })
    notification.push_notification
  end

  def self.mark_as_read
    all.update_all(read: true)
  end

# Private Class Methods
  def self.sample_data(type)
    if type == 'name'
      ['Adam', 'Ankit', 'Nupur', 'Sean', 'Jason'].sample
    else
      ['added a photo', 'added a video', 'commented on your photo', 'commented on your post'].sample
    end
  end
  private_class_method :sample_data

  # Instance Methods
  def push_notification
    Pusher.trigger('notification_channel', 'create_notification',
      self.as_json(only: [:notifier, :description, :read, :id])
    )
  end
end
