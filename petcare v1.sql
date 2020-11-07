DROP TABLE IF EXISTS Users CASCADE ;
DROP TABLE IF EXISTS PCS_Administrators CASCADE ;
DROP TABLE IF EXISTS Pet_Owners CASCADE ;
DROP TABLE IF EXISTS Care_Takers CASCADE ;
DROP TABLE IF EXISTS Base_Prices CASCADE ;
DROP TABLE IF EXISTS Pets CASCADE ;
DROP TABLE IF EXISTS Bids CASCADE ;
DROP TABLE IF EXISTS Prices CASCADE ;
DROP TABLE IF EXISTS Availablilities CASCADE ;
DROP TABLE IF EXISTS Leaves CASCADE ;

CREATE TABLE Users (
	username		VARCHAR (50) NOT NULL,
	display_name	   	VARCHAR (50) NOT NULL,
	password_hash  	VARCHAR (64) NOT NULL,
	salt			VARCHAR (16),
	PRIMARY KEY (username)
);

CREATE TABLE PCS_Administrators (
	username		VARCHAR (50) NOT NULL REFERENCES Users(username) ON DELETE CASCADE,
	PRIMARY KEY (username)
);

CREATE TABLE Pet_Owners (
	username		VARCHAR (50) NOT NULL REFERENCES Users(username) ON DELETE CASCADE,
	area			VARCHAR (50), /*May want to add some contraint here*/
	PRIMARY KEY (username)
);

CREATE TABLE Care_Takers (
	username		VARCHAR (50) NOT NULL REFERENCES Users(username) ON DELETE CASCADE,
	/*rating_score	NUMERIC (2,2), Can be easily replaced with view instead of triggers */
	/*IMPORTANT! May still be better to add rating_score to use as trigger to update price, left rating score in er diagram*/
	employee_type	VARCHAR (50) NOT NULL DEFAULT 'part-time',
	area			VARCHAR (50), /*May want to add some contraint here*/
	avg_rating 		double precision,
	PRIMARY KEY (username)
);


CREATE TABLE Base_Prices (
	pet_type		VARCHAR (50) NOT NULL,
	price			NUMERIC (4,2) NOT NULL CHECK (price > 0), /*Used by trigger*/
	PRIMARY KEY (pet_type)
);

CREATE TABLE Pets (
	username		VARCHAR (50) NOT NULL REFERENCES Pet_Owners(username) ON DELETE CASCADE,
	pet_name		VARCHAR (50) NOT NULL,
	pet_type		VARCHAR (50) NOT NULL REFERENCES Base_Prices(pet_type) ON DELETE CASCADE,
	special_req		VARCHAR (50),
	PRIMARY KEY (username, pet_name)
);

CREATE TABLE Bids (
	pet_owner		VARCHAR (50) NOT NULL REFERENCES Pet_Owners(username) ON DELETE CASCADE,
	care_taker		VARCHAR (50) NOT NULL REFERENCES Care_Takers(username) ON DELETE CASCADE,
	pet_name		VARCHAR (50) NOT NULL, /*Composite Foreign Key*/
	transfer_mode	VARCHAR (50) NOT NULL, /*Will change this to 1,2,3 and integer if this is settled in front end, else check if it fits all availble transfer method in varchar*/
	start_date		DATE NOT NULL, /*Overlapping dates in availability can be checked by triggers or in the insertion function itself. Simply (start1, end1) OVERLAPS (start2, end2)*/
	end_date		DATE NOT NULL, 
	daily_price		NUMERIC (4,2) NOT NULL CHECK (daily_price > 0),/*Will add check caretaker price, triggers needed to update caretaker price with rating*/
	
	selected		BOOLEAN DEFAULT false, /*Simply a nullable attribute*/
	paid			BOOLEAN DEFAULT false, /*Inserted as NULL, must be selected to be true*/
	payment_type	VARCHAR, /*Made to update at the same time as paid*/
	/*Will change this to 1,2,3 and integer if this is settled in front end, else check if it fits all availble payment method in varchar*/
	/*payment_amt removed as it can be easily computated*/
	rating			INTEGER CHECK (((rating BETWEEN 0 AND 5) OR rating IS NULL)),
	review			VARCHAR (200),
	
	PRIMARY KEY (pet_owner,care_taker,pet_name,start_date,end_date),
	/*Composite Foreign Key*/
	FOREIGN KEY (pet_owner, pet_name) REFERENCES Pets (username, pet_name) ON DELETE CASCADE
);

CREATE TABLE Prices (
	care_taker		VARCHAR (50) NOT NULL REFERENCES Care_Takers(username) ON DELETE CASCADE,
	pet_type		VARCHAR (50) NOT NULL REFERENCES Base_Prices(pet_type) ON DELETE CASCADE,
	price			NUMERIC (4,2) NOT NULL CHECK (price > 0),/*triggers needed to prevent inserting less than base price, triggers needed to update caretaker price with rating, (price=base_price+rating*increment),can be easily substituted if don't want triggers*/
	PRIMARY KEY (care_taker,pet_type)
);

CREATE TABLE Availabilities (
	care_taker		VARCHAR (50) NOT NULL REFERENCES Care_Takers(username) ON DELETE CASCADE,
	start_date		DATE NOT NULL,
	end_date		DATE NOT NULL CHECK (end_date >= start_date)
	/*Overlapping dates can be checked by triggers or in the insertion function itself. Simply (start1, end1) OVERLAPS (start2, end2)*/
	/*PRIMARY KEY not even needed as check between dates, dates unique have no impact*/
	/*PRIMARY KEY (care_taker,start_date) end date pointless*/
	/*IMPORTANT! Take in to account the max he can take care of to set availabilty as well*/
	/*IMPORTANT! Take in to account the auto accepting of job for full timer*/
);

CREATE TABLE Leaves (
	care_taker		VARCHAR (50) NOT NULL REFERENCES Care_Takers(username) ON DELETE CASCADE,
	start_date		DATE NOT NULL,
	end_date		DATE NOT NULL CHECK (end_date >= start_date)
	/*Overlapping dates can be checked by triggers or in the insertion function itself. Simply (start1, end1) OVERLAPS (start2, end2)*/
	/*PRIMARY KEY not even needed as check between dates, dates unique have no impact*/
	/*PRIMARY KEY (care_taker,start_date) end date pointless*/
);


