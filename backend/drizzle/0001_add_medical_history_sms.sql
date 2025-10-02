-- Add medical_history table
CREATE TABLE IF NOT EXISTS `medical_history` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `patient_id` INTEGER NOT NULL,
  `patient_name` TEXT,
  `date` TEXT NOT NULL,
  `type` TEXT NOT NULL,
  `description` TEXT,
  `severity` TEXT,
  `status` TEXT,
  `doctor` TEXT,
  `created_at` TEXT DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`patient_id`) REFERENCES `patient_patient`(`id`)
);

-- Add sms_messages table
CREATE TABLE IF NOT EXISTS `sms_messages` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `patient_id` INTEGER,
  `phone` TEXT NOT NULL,
  `message` TEXT NOT NULL,
  `status` TEXT DEFAULT 'pending',
  `sent_at` TEXT,
  `delivered_at` TEXT,
  `created_at` TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`patient_id`) REFERENCES `patient_patient`(`id`)
);

-- Create indices for better query performance
CREATE INDEX IF NOT EXISTS `idx_medical_history_patient_id` ON `medical_history` (`patient_id`);
CREATE INDEX IF NOT EXISTS `idx_sms_messages_patient_id` ON `sms_messages` (`patient_id`);
CREATE INDEX IF NOT EXISTS `idx_sms_messages_status` ON `sms_messages` (`status`);
