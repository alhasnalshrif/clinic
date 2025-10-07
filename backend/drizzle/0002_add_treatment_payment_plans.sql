-- Add treatment plans and payment plans tables

-- Treatment Plans table
CREATE TABLE IF NOT EXISTS `treatment_plans` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `patient_id` INTEGER NOT NULL,
  `doctor_id` INTEGER NOT NULL,
  `title` TEXT NOT NULL,
  `description` TEXT,
  `status` TEXT DEFAULT 'planned',
  `priority` TEXT DEFAULT 'medium',
  `total_cost` INTEGER DEFAULT 0,
  `estimated_duration` TEXT,
  `start_date` TEXT,
  `end_date` TEXT,
  `completion_date` TEXT,
  `notes` TEXT,
  `created_at` TEXT DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`patient_id`) REFERENCES `patient_patient`(`id`),
  FOREIGN KEY (`doctor_id`) REFERENCES `users_user`(`id`)
);

-- Treatment Plan Phases table
CREATE TABLE IF NOT EXISTS `treatment_plan_phases` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `treatment_plan_id` INTEGER NOT NULL,
  `phase_number` INTEGER NOT NULL,
  `title` TEXT NOT NULL,
  `description` TEXT,
  `status` TEXT DEFAULT 'pending',
  `cost` INTEGER DEFAULT 0,
  `estimated_duration` TEXT,
  `start_date` TEXT,
  `completion_date` TEXT,
  `notes` TEXT,
  `created_at` TEXT DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`treatment_plan_id`) REFERENCES `treatment_plans`(`id`)
);

-- Payment Plans table
CREATE TABLE IF NOT EXISTS `payment_plans` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `patient_id` INTEGER NOT NULL,
  `treatment_plan_id` INTEGER,
  `appointment_id` INTEGER,
  `title` TEXT NOT NULL,
  `total_amount` INTEGER NOT NULL,
  `paid_amount` INTEGER DEFAULT 0,
  `remaining_amount` INTEGER NOT NULL,
  `number_of_installments` INTEGER NOT NULL,
  `installment_amount` INTEGER NOT NULL,
  `status` TEXT DEFAULT 'active',
  `start_date` TEXT NOT NULL,
  `next_due_date` TEXT,
  `notes` TEXT,
  `created_at` TEXT DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`patient_id`) REFERENCES `patient_patient`(`id`),
  FOREIGN KEY (`treatment_plan_id`) REFERENCES `treatment_plans`(`id`),
  FOREIGN KEY (`appointment_id`) REFERENCES `appointment_appointment`(`id`)
);

-- Payment Installments table
CREATE TABLE IF NOT EXISTS `payment_installments` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `payment_plan_id` INTEGER NOT NULL,
  `installment_number` INTEGER NOT NULL,
  `amount` INTEGER NOT NULL,
  `due_date` TEXT NOT NULL,
  `paid_date` TEXT,
  `paid_amount` INTEGER DEFAULT 0,
  `status` TEXT DEFAULT 'pending',
  `notes` TEXT,
  `created_at` TEXT DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`payment_plan_id`) REFERENCES `payment_plans`(`id`)
);

-- Create indices for better query performance
CREATE INDEX IF NOT EXISTS `idx_treatment_plans_patient_id` ON `treatment_plans` (`patient_id`);
CREATE INDEX IF NOT EXISTS `idx_treatment_plans_doctor_id` ON `treatment_plans` (`doctor_id`);
CREATE INDEX IF NOT EXISTS `idx_treatment_plans_status` ON `treatment_plans` (`status`);
CREATE INDEX IF NOT EXISTS `idx_treatment_plan_phases_treatment_plan_id` ON `treatment_plan_phases` (`treatment_plan_id`);
CREATE INDEX IF NOT EXISTS `idx_payment_plans_patient_id` ON `payment_plans` (`patient_id`);
CREATE INDEX IF NOT EXISTS `idx_payment_plans_status` ON `payment_plans` (`status`);
CREATE INDEX IF NOT EXISTS `idx_payment_installments_payment_plan_id` ON `payment_installments` (`payment_plan_id`);
CREATE INDEX IF NOT EXISTS `idx_payment_installments_status` ON `payment_installments` (`status`);
