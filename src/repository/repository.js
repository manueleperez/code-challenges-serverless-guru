import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  ScanCommand
} from "@aws-sdk/client-dynamodb";

import { from, of } from "rxjs";
import { catchError, mergeMap,tap  } from "rxjs/operators";

// Cliente de DynamoDB
const client = new DynamoDBClient({
  region: 'us-east-1',          
  endpoint: 'http://localhost:8000', 
  credentials: {
    accessKeyId: 'dummy',        
    secretAccessKey: 'dummy',    
  },
});

export function putItem(tableName, item) {
  const command = new PutItemCommand({
    TableName: tableName,
    Item: {
      id: { S: item.id },
      name: { S: item.name }
    },
    ReturnValues: "ALL_OLD" // Devuelve item anterior si existía
  });

  return from(client.send(command)).pipe(
    mergeMap(response => {
      if (response.Attributes) {
        return of(response.Attributes); // emitimos el item anterior
      } else {
        return of({ message: "Item did not exist, new item created" });
      }
    }),
    catchError(error => of({ message: "Error inserting item", error }))
  );
}

export function getItem(tableName, id) {
  const command = new GetItemCommand({
    TableName: tableName,
    Key: { id: { S: String(id) } }
  });

  return from(client.send(command)).pipe(
    tap(response => console.log("DynamoDB response:", response)),
    mergeMap(response => {
      // Siempre devolvemos algo con of(), nunca EMPTY
      if (response.Item) {
        return of(response.Item); // si existe
      } else {
        return of({ message: "Item not found" }); // si no existe
      }
    }),
    catchError(error => of({ message: "Error fetching item", error }))
  );
}

/**
 * Actualiza el nombre de un ítem por id.
 */
export function updateItem(tableName, id,name) {

  const getCommand = new GetItemCommand({
    TableName: tableName,
    Key: { id: { S: id } },
  });

  return from(client.send(getCommand)).pipe(
    mergeMap(response => {
      if (!response.Item) {
        return of({ message: "Item did not exist, nothing updated" });
      }

      // Si existe, actualizamos
      const updateCommand = new UpdateItemCommand({
        TableName: tableName,
        Key: { id: { S: id } },
        UpdateExpression: "SET #name = :name",
        ExpressionAttributeNames: { "#name": "name" },
        ExpressionAttributeValues: { ":name": { S: name } },
        ReturnValues: "ALL_NEW"
      });

      return from(client.send(updateCommand));
    })
  );
}

/**
 * Elimina un ítem si existe y devuelve los datos eliminados.
 * Si no existe, no emite nada.
 */
// Eliminar item solo si existe
export function deleteItem(tableName, id) {
  const command = new DeleteItemCommand({
    TableName: tableName,
    Key: { id: { S: id } },
    ReturnValues: "ALL_OLD" // Devuelve el item eliminado si existía
  });

  return from(client.send(command)).pipe(
    mergeMap((response) => {
      if (response.Attributes) {
        // Emitimos el ítem eliminado
        return of(response.Attributes);
      } else {
        // No existía, emitimos mensaje
        return of({ message: "Item did not exist, nothing deleted" });
      }
    })
  );
}

export function scanItems(tableName) {
  const command = new ScanCommand({ TableName: tableName });

  return from(client.send(command)).pipe(
    mergeMap(response => {
      if (response.Items && response.Items.length > 0) {
        return of(response.Items); // Emitimos los items encontrados
      } else {
        return of({ message: "No items found" }); // Mensaje si no hay items
      }
    }),
    catchError(error => of({ message: "Error scanning table", error }))
  );
}