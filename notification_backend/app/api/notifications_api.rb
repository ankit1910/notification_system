class NotificationsApi < Grape::API
  format :json

  resources :notifications do
    get :/ do
      Notification.select(:id, :notifier, :description, :read).reverse.first(5).as_json
    end

    put :mark_as_read do
      Notification.where(id: params[:notification_ids]).mark_as_read
      { message: 'success', status: 200 }
    end
  end
end
