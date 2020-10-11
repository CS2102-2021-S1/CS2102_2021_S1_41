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
	login_name		VARCHAR (50) NOT NULL,
	uname	   		VARCHAR (50) NOT NULL,
	password_hash  	VARCHAR (64) NOT NULL,
	PRIMARY KEY (login_name)
);

CREATE TABLE PCS_Administrators (
	login_name		VARCHAR (50) NOT NULL REFERENCES Users(login_name),
	PRIMARY KEY (login_name)
);

CREATE TABLE Pet_Owners (
	login_name		VARCHAR (50) NOT NULL REFERENCES Users(login_name),
	area			VARCHAR (50) NOT NULL, /*May want to add some contraint here*/
	PRIMARY KEY (login_name)
);

CREATE TABLE Care_Takers (
	login_name		VARCHAR (50) NOT NULL REFERENCES Users(login_name),
	/*rating_score	NUMERIC (2,2), Can be easily replaced with view instead of triggers */
	/*IMPORTANT! May still be better to add rating_score to use as trigger to update price, left rating score in er diagram*/
	employee_type	VARCHAR (50) NOT NULL,
	area			VARCHAR (50) NOT NULL, /*May want to add some contraint here*/
	PRIMARY KEY (login_name)
);


CREATE TABLE Base_Prices (
	pet_type		VARCHAR (50) NOT NULL,
	price			NUMERIC (4,2) NOT NULL CHECK (price > 0), /*Used by trigger*/
	PRIMARY KEY (pet_type)
);

CREATE TABLE Pets (
	login_name		VARCHAR (50) NOT NULL REFERENCES Pet_Owners(login_name),
	pet_name		VARCHAR (50) NOT NULL,
	pet_type		VARCHAR (50) NOT NULL REFERENCES Base_Prices(pet_type),
	special_req		VARCHAR (50),
	PRIMARY KEY (login_name, pet_name),
	UNIQUE (login_name, pet_name, pet_type)
);

CREATE TABLE Bids (
	pet_owner		VARCHAR (50) NOT NULL REFERENCES Pet_Owners(login_name),
	care_taker		VARCHAR (50) NOT NULL REFERENCES Care_Takers(login_name),
	pet_name		VARCHAR (50) NOT NULL, /*Composite Foreign Key*/
	transfer_mode	VARCHAR (50) NOT NULL, /*Will change this to 1,2,3 and integer if this is settled in front end, else check if it fits all availble transfer method in varchar*/
	start_date		DATE NOT NULL, /*Overlapping dates in availability can be checked by triggers or in the insertion function itself. Simply (start1, end1) OVERLAPS (start2, end2)*/
	end_date		DATE NOT NULL CHECK (end_date >= start_date), 
	daily_price		NUMERIC (4,2) NOT NULL CHECK (daily_price > 0),/*Will add check caretaker price, triggers needed to update caretaker price with rating*/
	
	selected		BOOLEAN, /*Simply a nullable attribute*/
	paid			BOOLEAN CHECK (selected), /*Inserted as NULL, must be selected to be true*/
	payment_type	VARCHAR CHECK (selected), /*Made to update at the same time as paid*/
	/*Will change this to 1,2,3 and integer if this is settled in front end, else check if it fits all availble payment method in varchar*/
	/*payment_amt removed as it can be easily computated*/
	rating			INTEGER CHECK ((rating BETWEEN 0 AND 5) AND paid and (CURRENT_DATE - end_date > 0)),
	review			VARCHAR (200) CHECK (paid and (CURRENT_DATE - end_date > 0)),
	
	PRIMARY KEY (pet_owner,care_taker,pet_name,start_date,end_date),
	/*Composite Foreign Key*/
	FOREIGN KEY (pet_owner, pet_name) REFERENCES Pets (login_name, pet_name)
);

CREATE TABLE Prices (
	care_taker		VARCHAR (50) NOT NULL REFERENCES Care_Takers(login_name),
	pet_type		VARCHAR (50) NOT NULL REFERENCES Base_Prices(pet_type),
	price			NUMERIC (4,2) NOT NULL CHECK (price > 0),/*triggers needed to prevent inserting less than base price, triggers needed to update caretaker price with rating, (price=base_price+rating*increment),can be easily substituted if don't want triggers*/
	PRIMARY KEY (care_taker,pet_type)
);

CREATE TABLE Availabilities (
	care_taker		VARCHAR (50) NOT NULL REFERENCES Care_Takers(login_name),
	start_date		DATE NOT NULL,
	end_date		DATE NOT NULL CHECK (end_date >= start_date)
	/*Overlapping dates can be checked by triggers or in the insertion function itself. Simply (start1, end1) OVERLAPS (start2, end2)*/
	/*PRIMARY KEY not even needed as check between dates, dates unique have no impact*/
	/*PRIMARY KEY (care_taker,start_date) end date pointless*/
	/*IMPORTANT! Take in to account the max he can take care of to set availabilty as well*/
	/*IMPORTANT! Take in to account the auto accepting of job for full timer*/
);

CREATE TABLE Leaves (
	care_taker		VARCHAR (50) NOT NULL REFERENCES Care_Takers(login_name),
	start_date		DATE NOT NULL,
	end_date		DATE NOT NULL CHECK (end_date >= start_date)
	/*Overlapping dates can be checked by triggers or in the insertion function itself. Simply (start1, end1) OVERLAPS (start2, end2)*/
	/*PRIMARY KEY not even needed as check between dates, dates unique have no impact*/
	/*PRIMARY KEY (care_taker,start_date) end date pointless*/
);


