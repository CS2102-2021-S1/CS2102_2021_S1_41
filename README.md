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


### 3. Non-trivial constraints with triggers

### 4. Justification of any serial type