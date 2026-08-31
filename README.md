# Tamil Nadu State Election – Live Result Processing, Simulation & Analytics System

A scalable cloud-based election simulation platform built using **AWS, Expo and React Native**.

The system simulates election vote processing across **234 Tamil Nadu Assembly constituencies** and automatically processes constituency winners, party-wise seat tallies, alliance-wise seat tallies, majority status and final election results.

> **Note:** This is an educational election simulation and technical demonstration. It does not represent official election results.

---

## 🎯 Objective

To develop a scalable AWS-based election simulation platform that can:

- Accept simulated votes
- Update candidate vote counts
- Identify constituency winners
- Calculate party-wise seat positions
- Calculate alliance-wise seat positions
- Determine the majority position
- Generate the final election result
- Display results through a live dashboard

---

## 📌 Project Overview

The project demonstrates how multiple AWS services can work together to build a **distributed, event-driven cloud application**.

The system separates relatively stable election master data from continuously changing live election data.

### Data Flow

```text
Candidate Votes
       ↓
Constituency Winner
       ↓
Party Seat Tally
       ↓
Alliance Seat Tally
       ↓
Majority Calculation
       ↓
Final Result
       ↓
Live Dashboard

AWS Architecture


                 Frontend
              Expo / React Native
                     |
                     ↓
              API Gateway
                     |
                     ↓
                  Lambda
                     |
          ┌──────────┴──────────┐
          ↓                              ↓
        RDS                 		DynamoDB
   Master Election Data    		Live/Result Data
                                		|
                                		↓
                               			SQS
          		                        |
                          		        ↓
                    			Result Processing
                        		        |
              	       ┌─────────────────┼─────────────────┐
         	       ↓                        ↓                        ↓
        		Party Tally       Alliance Tally     Final Result
              			|                 |                 |
              			└────────────┴────────────┘
                             			   |
                                		   ↓
                         		Election Dashboard


AWS Services used

| AWS Service         | Resource / Name                              | Purpose                         |
| ------------------- | -------------------------------------------- | ------------------------------- |
| Amazon VPC          | `TN-Election-VPC`                            | Main network environment        |
| Subnets             | `Public1`, `Public2`, `Private1`, `Private2` | Network separation              |
| Internet Gateway    | `TN-Election-IGW`                            | Internet connectivity           |
| Route Tables        | `Public-RT`, `Private-RT`                    | Network traffic routing         |
| Amazon RDS          | `tn-election-rds`                            | Structured election master data |
| Amazon DynamoDB     | `LiveVoteCounts`                             | Live candidate vote counts      |
| Amazon DynamoDB     | `ElectionResults`                            | Constituency-wise results       |
| Amazon DynamoDB     | `ElectionPartyTally`                         | Party-wise seat tally           |
| Amazon DynamoDB     | `ElectionAllianceTally`                      | Alliance-wise seat tally        |
| Amazon DynamoDB     | `ElectionFinalResult`                        | Final election result           |
| AWS Lambda          | `UpdateLiveVotes`                            | Processes vote updates          |
| AWS Lambda          | `ProcessElectionResults`                     | Determines constituency winners |
| AWS Lambda          | `ProcessPartyTally`                          | Calculates party-wise seats     |
| AWS Lambda          | `ProcessAllianceTally`                       | Calculates alliance-wise seats  |
| AWS Lambda          | `ProcessFinalResult`                         | Processes final election result |
| Amazon API Gateway  | Election APIs                                | Frontend-backend communication  |
| Amazon SQS          | `TN-Election-VoteQueue`                      | Asynchronous vote processing    |
| Amazon SQS          | `TN-Election-VoteDLQ`                        | Handles failed messages         |
| AWS Secrets Manager | `TN-Election-RDS-Credentials`                | Secure RDS credentials          |
| AWS IAM             | Lambda roles/policies                        | Access management               |
| Amazon CloudWatch   | Lambda Log Groups                            | Monitoring and troubleshooting  |

Processing Workflow

User
 |
 ↓
Submit Simulated Vote
 |
 ↓
API Gateway
 |
 ↓
UpdateLiveVotes Lambda
 |
 ↓
LiveVoteCounts
 |
 ↓
SQS
 |
 ↓
ProcessElectionResults
 |
 ↓
ElectionResults
 |
 ↓
ProcessPartyTally
 |
 ↓
ElectionPartyTally
 |
 ↓
ProcessAllianceTally
 |
 ↓
ElectionAllianceTally
 |
 ↓
ProcessFinalResult
 |
 ↓
ElectionFinalResult
 |
 ↓
Dashboard


Project Phases

The project was implemented in 11 phases:

Networking Foundation
Database Setup
Master Data Setup
Live Vote Processing
Election Result Processing
Party & Alliance Tally Processing
Automated Asynchronous Processing
Final Result Processing & Notification
Election Dashboard & Frontend
Monitoring, Testing & Validation
Security & Access Management

Frontend

The application was developed using:

Expo
React Native
TypeScript
Expo Router

Dashboard Features

Election result overview
CM candidate cards
Live seat position
234-seat Seat Meter
118-seat majority mark
Party-wise seat tally
Alliance-wise seat tally
Constituency-wise results
Individual party winning details
Final election status

Database Architecture

Amazon RDS

Used for relatively stable and relational election master data such as:

Districts
Constituencies
Parties
Alliances
Candidates
Candidate–constituency relationships

Amazon DynamoDB

Used for frequently changing and processed election data:

LiveVoteCounts
       ↓
ElectionResults
       ↓
ElectionPartyTally
       ↓
ElectionAllianceTally
       ↓
ElectionFinalResult

Asynchronous Processing

Amazon SQS was introduced to make the processing workflow more reliable.

Vote Update
    ↓
SQS Queue
    ↓
Lambda Processing
    ↓
Party Tally
    ↓
Alliance Tally
    ↓
Final Result

Security

The project uses:

AWS IAM
IAM Lambda execution roles
Security Groups
AWS Secrets Manager
VPC network segmentation

RDS credentials are stored securely using: TN-Election-RDS-Credentials

Testing & Monitoring

The complete workflow was tested from vote submission to final result display.

Testing included:

Simulated vote submission
DynamoDB vote updates
Constituency winner processing
Party tally calculation
Alliance tally calculation
SQS-based processing
Final result processing
Dashboard updates

Amazon CloudWatch was used to monitor Lambda executions, logs and errors.

Challenges Faced

1. DynamoDB Access Permission Error

Problem: Lambda initially received AccessDeniedException.

Solution: Updated the Lambda IAM execution role with the required DynamoDB permissions.

2. Lambda Rate Exceeded Error

Problem: Rapid vote updates caused Lambda rate-limit errors.

Solution: Introduced Amazon SQS for asynchronous processing.

3. Dashboard Tally Delay

Problem: Party/alliance tallies were not always reflected immediately.

Solution: Automated the processing chain

What I Learned

Through this project, I gained practical experience in:

AWS VPC networking
Subnets and route tables
Amazon RDS
Amazon DynamoDB
AWS Lambda
Amazon API Gateway
Amazon SQS
AWS IAM
AWS Secrets Manager
Amazon CloudWatch
Serverless architecture
Event-driven processing
AWS service integration
React Native / Expo development
Cloud troubleshooting

The project also provided practical experience in troubleshooting issues such as AccessDeniedException, Lambda Rate Exceeded errors, API integration issues and frontend/Metro errors.

Project Complexity

Instead of implementing the application using a simple single Lambda and database architecture, the project deliberately uses multiple AWS services and processing stages.

This demonstrates concepts including:

Cloud networking
Multiple database technologies
Serverless computing
API-based communication
Asynchronous processing
Event-driven architecture
Security
Monitoring
Frontend-cloud integration

Documentation

The complete project documentation contains:

Project objective and overview
Phase-wise implementation
AWS architecture
AWS services and resource details
Challenges and solutions
Learning outcomes
AWS Console screenshots
Dashboard outputs
Mobile application screenshots
Final result demonstration