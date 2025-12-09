-- ============================================
-- Test Accounts for ImmaCare System
-- Roles: admin, doctor, patient
-- 
-- Passwords:
-- Admin: admin123
-- Doctor: doctor123  
-- Patient: patient123
-- ============================================

-- ============================================
-- 1. ADMIN ACCOUNT
-- ============================================

START TRANSACTION;

-- Insert into users_info for Admin
INSERT INTO `users_info` (`firstname`, `middlename`, `lastname`, `gender`, `birthdate`, `age`, `role`, `status`) 
VALUES ('Test', 'Admin', 'User', 'Male', '1990-01-01', 34, 'admin', 1);

SET @admin_user_id = LAST_INSERT_ID();

-- Insert into account_info for Admin
INSERT INTO `account_info` (`user_id`, `phone`, `email`, `password`, `status`, `is_verified`) 
VALUES (@admin_user_id, '+639123456789', 'admin@test.com', '$2b$10$vdl9QSTjoAMzbpiKZnApoeVtThqLleHWl6R.XPS5KmyvQWLcLpDX2', 1, 1);

COMMIT;

-- ============================================
-- 2. DOCTOR ACCOUNT
-- ============================================

START TRANSACTION;

-- Insert into users_info for Doctor
INSERT INTO `users_info` (`firstname`, `middlename`, `lastname`, `gender`, `birthdate`, `age`, `role`, `status`) 
VALUES ('Test', 'Doctor', 'User', 'Female', '1985-05-15', 39, 'doctor', 1);

SET @doctor_user_id = LAST_INSERT_ID();

-- Insert into account_info for Doctor
INSERT INTO `account_info` (`user_id`, `phone`, `email`, `password`, `status`, `is_verified`) 
VALUES (@doctor_user_id, '+639123456790', 'doctor@test.com', '$2b$10$0HRxJvTVRt6OwCoNfUb3ueQ4uUdVLg2nb/AQ3Ljpts.TWZUmQajN6', 1, 1);

-- Insert into doctors_profile for Doctor
-- Note: specialty ID 12 = Obgyne (based on existing data). Adjust if needed.
INSERT INTO `doctors_profile` (`user_id`, `specialty`, `department`, `years_of_experience`, `status`) 
VALUES (@doctor_user_id, 12, 'General Medicine', 10, '1');

COMMIT;

-- ============================================
-- 3. PATIENT ACCOUNT
-- ============================================

START TRANSACTION;

-- Insert into users_info for Patient
INSERT INTO `users_info` (`firstname`, `middlename`, `lastname`, `gender`, `birthdate`, `age`, `role`, `status`) 
VALUES ('Test', 'Patient', 'User', 'Male', '1995-08-20', 29, 'patient', 1);

SET @patient_user_id = LAST_INSERT_ID();

-- Insert into account_info for Patient
INSERT INTO `account_info` (`user_id`, `phone`, `email`, `password`, `status`, `is_verified`) 
VALUES (@patient_user_id, '+639123456791', 'patient@test.com', '$2b$10$QeGaqbjtl7.giVOhI.SHeumNtiabn3Ax.dabS5pBAEdbhmKpotE3.', 1, 1);

-- Insert into patient_info for Patient
INSERT INTO `patient_info` (`user_id`, `firstname`, `middlename`, `lastname`, `gender`, `birthdate`, `age`, `civil_status`, `mobile_number`, `email_address`, `home_address`, `bloodtype`) 
VALUES (@patient_user_id, 'Test', 'Patient', 'User', 'Male', '1995-08-20', '29', 'Single', '+639123456791', 'patient@test.com', '123 Test Street, Test City', 'O+');

COMMIT;

