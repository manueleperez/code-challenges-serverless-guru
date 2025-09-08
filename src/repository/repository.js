import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  ScanCommand
} from "@aws-sdk/client-dynamodb";
import { from } from "rxjs";

const client = new DynamoDBClient({
  region: 'us-east-1',          // cualquier región válida
  endpoint: 'http://localhost:8000', // apunta a tu DynamoDB Local
  credentials: {
    accessKeyId: 'dummy',        // cualquier valor
    secretAccessKey: 'dummy',    // cualquier valor
  },
});

export function putItem(tableName, item) {
  const command = new PutItemCommand({
    TableName: tableName,
    Item: {
      id: { S: item.id },
      name: { S: item.name }
    }
  });
  return from(client.send(command));
}

export function getItem(tableName, id) {
  const command = new GetItemCommand({
    TableName: tableName,
    Key: { id: { S: id } }
  });
  return from(client.send(command));
}

export function updateItem(tableName, id, name) {
  const command = new UpdateItemCommand({
    TableName: tableName,
    Key: { id: { S: id } },
    UpdateExpression: "SET #name = :name",
    ExpressionAttributeNames: { "#name": "name" },
    ExpressionAttributeValues: { ":name": { S: name } },
    ReturnValues: "ALL_NEW"
  });
  return from(client.send(command));
}

export function deleteItem(tableName, id) {
  const command = new DeleteItemCommand({
    TableName: tableName,
    Key: { id: { S: id } }
  });
  return from(client.send(command));
}

export function scanItems(tableName) {
  const command = new ScanCommand({ TableName: tableName });
  return from(client.send(command));
}