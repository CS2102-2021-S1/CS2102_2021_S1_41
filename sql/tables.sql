CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    password VARCHAR(50)
);

CREATE TABLE PCS_Administrators (
    user_pca_admin_id INTEGER NOT NULL REFERENCES Users(user_id) PRIMARY KEY
);

CREATE TABLE PetOwners (
    user_pet_owner_id INTEGER NOT NULL REFERENCES Users(user_id) PRIMARY KEY,
    area VARCHAR(50)
);

CREATE TABLE CareTakers (
    user_care_taker_id INTEGER NOT NULL REFERENCES Users(user_id) PRIMARY KEY,
    area VARCHAR(50) NOT NULL,
    employee_type VARCHAR(3) NOT NULL,
    rating_score INTEGER CHECK rating_score >= 0 AND rating_score <= 5
);

CREATE TABLE Pets (
    user_pet_owner_id INTEGER REFERENCES PetOwners(user_pet_owner_id) ON DELETE CASCADE,
    pet_id SERIAL PRIMARY KEY,
    pet_name VARCHAR(50) NOT NULL,
    special_req VARCHAR(50) NOT NULL,
    pet_type VARCHAR(50) NOT NULL
);

CREATE TABLE Owns (
    user_pet_owner_id INTEGER NOT NULL,
    pet_id INTEGER NOT NULL,
    FOREIGN KEY pet_id REFERENCES Pets(pet_id),
    FOREIGN KEY user_pet_owner_id REFERENCES PetOwners(user_pet_owner_id),
    PRIMARY KEY (pet_id)
);

CREATE TABLE Agreements (
    agreement_id SERIAL PRIMARY KEY,
    transfer_mode VARCHAR(3) NOT NULL,
    dates DATE NOT NULL
)

CREATE TABLE Payments (
    agreement_id INTEGER REFERENCES Agreements(agreement_id) ON DELETE CASCADE
    payment_id SERIAL PRIMARY KEY,
    payment_amt NUMERIC(2) NOT NULL,
    payment_mode VARCHAR(3) NOT NULL
)