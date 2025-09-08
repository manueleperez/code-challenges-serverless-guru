// controller/deleteItem.controller.js
import { deleteItemService } from "../service/deleteItem.service.js";
import { lastValueFrom, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export function deleteItemController(event) {
  const id = event.pathParameters.id;
  const tableName = process.env.TABLE_NAME;
 
  return lastValueFrom(
      deleteItemService(tableName, id).pipe(
        map(result => ({
          statusCode: 200,
          body: JSON.stringify(result)
        })),
        catchError(err =>
          of({
            statusCode: 400,
            body: JSON.stringify({ error: err.message })
          })
        )
      )
    );
}