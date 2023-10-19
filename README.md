# project-2022-23t2-g1-t1-backend

## Maker Checker

### Setup
```
cd into maker-checker

# If dev locally, run the one below. Spins up local dynamodb + backend
docker-compose up --build

# If dev locally and using aws dynamodb, 
docker build -t maker-checker . -f makerchecker.Dockerfile
docker run -p 5000:5000 -e AWS_ACCESS_KEY_ID=<key id> -e AWS_SECRET_ACCESS_KEY=<key id> maker-checker 

# If pushing to ECR, ensure AWS configured is done with g1t1 account first 
aws configure 
# Follow steps to push to ECR on AWS

```