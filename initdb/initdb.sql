CREATE DATABASE IF NOT EXISTS api;

USE api;

CREATE TABLE IF NOT EXISTS users (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       username VARCHAR(255) NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       refreshToken VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS files (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       name VARCHAR(255) NOT NULL,
                       extension VARCHAR(50),
                       mimeType VARCHAR(255),
                       size INT,
                       uploadDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       filename VARCHAR(255) NOT NULL
);