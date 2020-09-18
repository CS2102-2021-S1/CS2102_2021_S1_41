# CS2102_2021_S1_41
AY20/21 Sem1 CS2102 Database Systems Group Project (Team 41)
* Ko Gi Hun (@nordic96)
* Lim Jia Ying (@AugGust)
* Chan Wei Qiang Jason (@jasonchanwq)
* Putra Mohammad Danish Bin Mohd Rafee (@iamputradanish)
* Chew Zhao En (@chewzhaoen) 
## W6 Project Deliverables
### 1. ER Diagram Model: Pet Caring Service (PCS) Application
![ER Diagram](docs/images/ER_Diagram_Project.jpg)

### 2. Constraints
1. Users have to belong to either Admin, Pet Owners or Caretakers (Covering constraint). Users can belong to multiple groups (Overlapping Constraint).

1. Price_List of Care_Takers will record down the available pet types the Caretakers are capable of handling.

1. Part-time Caretakers have to specify their own availability for the current year + the next year. For full-time Caretakers, they are assumed to be available during working hours (weekdays) unless they are on leave.

1. Leaves will be documented in the Leave entity, where a start date and end date is specified. PCS Admin will approve/reject the leave based on availability of Care Takers

1. Leave must not be approved by the applicant him/herself

1. Attribute employee_type of Care_Takers will record whether they are full-time or part-time Caretakers.

1. Pet Owners will be able to search Caretakers based on criteria - for example, filtering by rating or maximum price, and select manually if needed.

1. Automatic contract selection based on the same/similar area and availability of caretaker.

1. Underperforming full-time caretakers is defined as a full-time caretaker that works less than the average number of pet-days per month of all full-time caretakers, or one that works less than 60 pet-days per month. ie min(average, 60).

1. Successful bidders are defined as the highest bidder by price, if there are multiple bidders for the same caretaker for the same day.

1. Every User can be identified by their user_id

1. Every Pet can be identified by their pet_id

1. Every Agreement can be identified by their agreement_id

1. Every Payment can be identified by their payment_id

1. Only Pet_Owners that bids for Care_Takers can make Agreements

1. Existence of Pets(weak entity) depends on the existence of Pet_Owners(owning entity)

1. Existence of Payments(weak entity) depends on the existence of Agreements(owning entity)

1. Existence of Rates(weak entity) depends on the existence of Agreements(owning entity)

1. Existence and identity of Price_List(weak entity) depends on the existence of Care_Takers(owning entity)

1. Existence and identity of Availablity(weak entity) depends on the existence of Care_Takers(owning entity)

1. Existence and identity of Leave(weak entity) depends on the existence of Care_Takers(owning entity)

1. Full-time Care_Takers can take care of up to 5 pets at a time

1. Care_Takers cannot bid or rate themselves

### 3. Non-trivial constraints with triggers

1. Average rating for Caretakers

1. When bid by any Pet Owner, a full-time Caretaker will always accept the job immediately if possible

1. If Caretaker applies for leave, their availability will automatically be set to not available for the range of the dates of the leave.

### 4. Justification of any serial type

1. user_id
    * user_id can be tracked easily with natural increments, as well as to identify which role the user is taking. Hence, one user may take multiple roles, for example, PCS_Admin may also be a Pet_Owner.

1. agreement_id
    * agreement_id increments naturally as agreements are made from successful bids

1. payment_id
    * payment_id increments naturally as payment is made for the agreement

1. pet_id
    * pet_id increments naturally as pets are added

### 5. Data Types

| Table        | Attribute       | Data Type | Nullity  |
|--------------|-----------------|-----------|----------|
| Users        | user_id         | SERIAL    | NOT NULL |
|              | name            | VARCHAR   | NOT NULL |
|              | password        | VARCHAR   | NOT NULL |
| Rates        | rating          | INTEGER   | NOT NULL |
|              | review          | TEXT      | NULLABLE |
| Pet_Owners   | area            | INTEGER   | NOT NULL |
| Care_Takers  | rating_score    | INTEGER   | NULLABLE |
|              | employment_type | VARCHAR   | NOT NULL |
|              | area            | INTEGER   | NOT NULL |
| Pets         | pet_id          | SERIAL    | NOT NULL |
|              | pet_name        | VARCHAR   | NULLABLE |
|              | special_req     | TEXT      | NULLABLE |
|              | pet_type        | VARCHAR   | NOT NULL |
| Agreements   | agreement_id    | SERIAL    | NOT NULL |
|              | transfer_mode   | VARCHAR   | NOT NULL |
|              | dates           | DATE      | NOT NULL |
| Payments     | payment_id      | SERIAL    | NOT NULL |
|              | payment_amt     | FLOAT     | NOT NULL |
|              | payment_mode    | VARCHAR   | NOT NULL |
| Price_List   | price           | FLOAT     | NOT NULL |
|              | pet_type        | VARCHAR   | NOT NULL |
| Availability | start_date      | DATE      | NOT NULL |
|              | end_date        | DATE      | NOT NULL |
| Leave        | start_date      | DATE      | NOT NULL |
|              | end_date        | DATE      | NOT NULL |
