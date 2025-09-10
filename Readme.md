npm init -y
npm install
npm install --save-dev jest jest-environment-node
npm test
npm install @aws-sdk/client-dynamodb@latest

------------
Instalar dependencias
npm install serverless serverless-offline serverless-dynamodb-local --save-dev

Serverless 4 
Create Access Key

Loguearse a Serverless

npx serverless login

Installar en Docker
docker run -d --name dynamodb-local  -p 8000:8000 amazon/dynamodb-local

Instalar 

AWS Cli V2

Creación tabla local en dynamodb

aws dynamodb create-table --table-name ItemsTable --attribute-definitions AttributeName=id,
AttributeType=S --key-schema AttributeName=id,KeyType=HASH --billing-mode PAY_PER_REQUEST --endpoint-url http://localhost:8000 --region us-east-1

npx serverless offline start

Levantar Dynamo local
npx sls dynamodb start

Levantar API local
npx serverless offline
Starting Offline at http://localhost:3000