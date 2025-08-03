CREATE TABLE `users_user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`email` text,
	`first_name` text,
	`last_name` text,
	`is_active` integer DEFAULT true,
	`is_staff` integer DEFAULT false,
	`is_superuser` integer DEFAULT false,
	`date_joined` text DEFAULT '2025-08-03T21:10:15.966Z',
	`last_login` text,
	`group` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `patient_patient` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`doctor_id` integer NOT NULL,
	`name` text NOT NULL,
	`phone` text,
	`bloodgroup` text,
	`sex` text DEFAULT 'MALE',
	`age` integer,
	`created_at` text DEFAULT '2025-08-03T21:10:15.967Z',
	`updated_at` text DEFAULT '2025-08-03T21:10:15.967Z',
	FOREIGN KEY (`doctor_id`) REFERENCES `users_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `patient_adultteethchart` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` integer NOT NULL,
	`UR_1` text DEFAULT 'None',
	`UR_2` text DEFAULT 'None',
	`UR_3` text DEFAULT 'None',
	`UR_4` text DEFAULT 'None',
	`UR_5` text DEFAULT 'None',
	`UR_6` text DEFAULT 'None',
	`UR_7` text DEFAULT 'None',
	`UR_8` text DEFAULT 'None',
	`UL_9` text DEFAULT 'None',
	`UL_10` text DEFAULT 'None',
	`UL_11` text DEFAULT 'None',
	`UL_12` text DEFAULT 'None',
	`UL_13` text DEFAULT 'None',
	`UL_14` text DEFAULT 'None',
	`UL_15` text DEFAULT 'None',
	`UL_16` text DEFAULT 'None',
	`LL_17` text DEFAULT 'None',
	`LL_18` text DEFAULT 'None',
	`LL_19` text DEFAULT 'None',
	`LL_20` text DEFAULT 'None',
	`LL_21` text DEFAULT 'None',
	`LL_22` text DEFAULT 'None',
	`LL_23` text DEFAULT 'None',
	`LL_24` text DEFAULT 'None',
	`LR_25` text DEFAULT 'None',
	`LR_26` text DEFAULT 'None',
	`LR_27` text DEFAULT 'None',
	`LR_28` text DEFAULT 'None',
	`LR_29` text DEFAULT 'None',
	`LR_30` text DEFAULT 'None',
	`LR_31` text DEFAULT 'None',
	`LR_32` text DEFAULT 'None',
	FOREIGN KEY (`patient_id`) REFERENCES `patient_patient`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `patient_childteethchart` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` integer NOT NULL,
	`UR_A` text DEFAULT 'None',
	`UR_B` text DEFAULT 'None',
	`UR_C` text DEFAULT 'None',
	`UR_D` text DEFAULT 'None',
	`UR_E` text DEFAULT 'None',
	`UL_F` text DEFAULT 'None',
	`UL_G` text DEFAULT 'None',
	`UL_H` text DEFAULT 'None',
	`UL_I` text DEFAULT 'None',
	`UL_J` text DEFAULT 'None',
	`LL_K` text DEFAULT 'None',
	`LL_L` text DEFAULT 'None',
	`LL_M` text DEFAULT 'None',
	`LL_N` text DEFAULT 'None',
	`LL_O` text DEFAULT 'None',
	`LR_P` text DEFAULT 'None',
	`LR_Q` text DEFAULT 'None',
	`LR_R` text DEFAULT 'None',
	`LR_S` text DEFAULT 'None',
	`LR_T` text DEFAULT 'None',
	FOREIGN KEY (`patient_id`) REFERENCES `patient_patient`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `appointment_appointment` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` integer NOT NULL,
	`doctor_id` integer NOT NULL,
	`token` integer,
	`date` text,
	`time` text,
	`reason` text NOT NULL,
	`created_at` text DEFAULT '2025-08-03T21:10:15.967Z',
	`updated_at` text DEFAULT '2025-08-03T21:10:15.967Z',
	FOREIGN KEY (`patient_id`) REFERENCES `patient_patient`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`doctor_id`) REFERENCES `users_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `treatment_treatment` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` integer NOT NULL,
	`title` text NOT NULL,
	`token` integer NOT NULL,
	`description` text,
	`toothPosition` text,
	`dental_test` text,
	`created_at` text DEFAULT '2025-08-03T21:10:15.967Z',
	`updated_at` text DEFAULT '2025-08-03T21:10:15.967Z',
	FOREIGN KEY (`patient_id`) REFERENCES `patient_patient`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `payment_bill` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`appointment_id` integer NOT NULL,
	`amount_paid` integer DEFAULT 0,
	`current_balance_before` integer DEFAULT 0,
	`new_balance_after` integer DEFAULT 0,
	`date_paid` text DEFAULT '2025-08-03T21:10:15.967Z',
	FOREIGN KEY (`appointment_id`) REFERENCES `appointment_appointment`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `authtoken_token` (
	`key` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`created` text DEFAULT '2025-08-03T21:10:15.967Z',
	FOREIGN KEY (`user_id`) REFERENCES `users_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_user_username_unique` ON `users_user` (`username`);