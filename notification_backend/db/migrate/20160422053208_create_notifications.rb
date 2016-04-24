class CreateNotifications < ActiveRecord::Migration
  def change
    create_table :notifications do |t|
      t.string :notifier
      t.string :description
      t.boolean :read, default: false
    end
  end
end
