// controller/updateItem.controller.js
import { updateItemService } from "../service/updateItem.service.js";
import { lastValueFrom, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export function updateItemController(event) {
  const id = event.pathParameters.id;
  const body = JSON.parse(event.body);
  const tableName = process.env.TABLE_NAME;
  
  return lastValueFrom(
        updateItemService(tableName, id, body.name).pipe(
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