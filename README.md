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
1. Users belong to either Admin, Pet Owners or Caretakers (Covering constraint). Users can belong to multiple groups (Overlapping Constraint).

1. Price_List of Care_Takers will record down the available pet types the Caretakers are capable of handling.

1. Part-time Caretakers have to specify their own availability for the current year + the next year. For full-time Caretakers, they are assumed to be available during working hours (weekdays) unless they are on leave.

1. Leaves will be documented in the Leave entity, where a start date and end date is specified. PCS Admin will approve/reject the leave based on availability of Care Takers

1. Leave must not be approved by the applicant him/herself

1. Attribute EmployeeType of Care_Takers will record whether they are full-time or part-time Caretakers.

1. Pet Owners will be able to search Caretakers based on criteria - for example, filtering by rating or maximum price, and select manually if needed.

1. Automatic contract selection based on the same/similar area and availability of caretaker.

1. Underperforming full-time caretakers is defined as a full-time caretaker that works less than the average number of pet-days per month of all full-time caretakers, or one that works less than 60 pet-days per month. ie min(average, 60).

1. Successful bidders are defined as the highest bidder by price, if there are multiple bidders for the same caretaker for the same day.



### 3. Non-trivial constraints with triggers

### 4. Justification of any serial type

1. UserID
* UserID can be tracked easily with natural increments, as well as to identify which role the user is taking. Hence, one user may take multiple roles, for example, PCS_Admin may also be a Pet_Owner.

1. AgreementID
* Agreements increments naturally as bids come

1. PaymentID
* PaymentID and AgreementID are total participating entities with key constraint, hence PaymentID follows AgreementId to have a serial type

### 5. Data Types

| Table        | Attribute       | Data Type |
|--------------|-----------------|-----------|
| Users        | user_id         | SERIAL    |
|              | name            | VARCHAR   |
|              | password        | VARCHAR   |
| Rates        | transaction     | VARCHAR   |
|              | rating          | INTEGER   |
|              | review          | TEXT      |
| Pet_Owners   | area            | INTEGER   |
| Care_Takers  | rating_score    | INTEGER   |
|              | employment_type | VARCHAR   |
|              | area            | INTEGER   |
| Pets         | pet_id          | VARCHAR   |
|              | pet_name        | VARCHAR   |
|              | special_req     | TEXT      |
|              | pet_type        | VARCHAR   |
| Agreements   | agreement_id    | SERIAL    |
|              | transfer_mode   | VARCHAR   |
|              | dates           | DATE      |
| Payments     | payment_id      | SERIAL    |
|              | payment_amt     | FLOAT     |
|              | payment_mode    | VARCHAR   |
| Price_List   | price           | FLOAT     |
|              | pet_type        | VARCHAR   |
| Availability | start_date      | DATE      |
|              | end_date        | DATE      |
| Leave        | start_date      | DATE      |
|              | end_date        | DATE      |
