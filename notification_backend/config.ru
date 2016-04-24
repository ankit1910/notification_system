require './config/environment'
require 'rack/cors'

use Rack::Cors do
  allow do
    origins '*'
    resource '*', headers: :any, methods: [:get, :put]
  end
end

run NotificationsApi


