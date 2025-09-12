
Nodejs
Construcción del proyecto
npm init -y
Intalar nodejs
npm install

Instalar dependencias
npm install serverless serverless-offline serverless-dynamodb-local --save-dev

Serverless 4 
Create Access Key

Loguearse a Serverless

npx serverless login

npm install @jest/globals@30.1.2 --save-dev
npm install rxjs@latest
npm test

Cobertura de test 

![test](./docs/testJests.png)

Installar en Docker el DynamoDB local para pruebas locales

docker run -d --name dynamodb-local  -p 8000:8000 amazon/dynamodb-local

Instalar 
AWS Cli V2

Creación tabla local en dynamodb

aws dynamodb create-table --table-name ItemsTable --attribute-definitions AttributeName=id,
AttributeType=S --key-schema AttributeName=id,KeyType=HASH --billing-mode PAY_PER_REQUEST --endpoint-url http://localhost:8000 --region us-east-1

Para probar local

npx serverless offline start


Levantar API local
npx serverless offline
Starting Offline at http://localhost:3000

Templates de CloudFormation

IAC

Cuando se haga commit se dispare el pipeline automáticamente

![gitActions](./docs/gitActions.png)

Contrucción del proyecto buildspec
![buildspec](./docs/buildspec.png)

Contrucción de Tabla de DynamoDB y el Bucket S3

![infra](./docs/infra.png)
![infra](./docs/infraII.png)
![infra](./docs/infraIII.png)

Api 

Donde se encuentra el apiGateway y las funciones lambda de nodejs

![api](./docs/api.png)


Como ejecutar el deploy-infra.yaml que es la infractura

Manualmente:
sls deploy --stage %STAGE% -c deploy-infra.yaml

Automáticamente ejecutando estos archivos bat así

deploy-infra.bat dev
deploy-infra.bat test
deploy-infra.bat prod

Pipeline

Construye el proyecto y despliega la aplicación

![pipeline](./docs/pipeline.png)

La información de la IAC los templates se encuentran en la carpeta /template, en la raíz pipeline.yaml y en .github/workflows deploy.yaml que es el que dispara todo el proceso
automático cuando se hace commit.


















