namespace :random_notification do
  desc 'Start a process to randomly generate notifications'
  task :generate do
    create_and_push
  end
end

def create_and_push(counter = 10)
  puts "waiting for next notification to create"
  sleep(rand(6) + 5) #sleeps the system for random seconds from 5 to 10

  puts "creating notification"
  Notification.create_and_push

  create_and_push(counter - 1) if counter > 0
end
