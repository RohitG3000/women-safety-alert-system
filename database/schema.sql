-- Create database
CREATE DATABASE IF NOT EXISTS women_safety;
USE women_safety;

-- Users table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100),
    phone_hash VARCHAR(64) UNIQUE,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emergency Alerts
CREATE TABLE Emergency_Alerts (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    status VARCHAR(20) DEFAULT 'RAISED',
    alert_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Location Log
CREATE TABLE Location_Log (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    alert_id INT,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    recorded_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alert_id) REFERENCES Emergency_Alerts(alert_id)
);

-- Trusted Contacts
CREATE TABLE Trusted_Contacts (
    contact_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    contact_name VARCHAR(100),
    contact_phone VARCHAR(20),
    relation VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Authorities
CREATE TABLE Authorities (
    authority_id INT AUTO_INCREMENT PRIMARY KEY,
    station_name VARCHAR(100),
    contact_number VARCHAR(20)
);