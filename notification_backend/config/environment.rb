# Require all gems
require 'grape'
require 'grape/activerecord'
require "json"
require 'sqlite3'
require 'pusher'
require 'rake'

# Require all files in app/ & other config files
folder_locations = %w[../../app ../../lib].collect do |folder_path|
  ((::File.expand_path(folder_path, __FILE__)) + "/**/*.rb")
end
Dir[*folder_locations].each {|file| require file }

# Tell Grape::ActiveRecord about your database config
Grape::ActiveRecord.configure_from_file! "config/database.yml"

# Pusher Settings
Pusher.app_id = '120932'
Pusher.key = 'e409e0060e42dfb30b4f'
Pusher.secret = '9918dc9f6ee608a4903c'

