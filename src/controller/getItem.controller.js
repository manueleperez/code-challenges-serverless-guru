// controller/getItem.controller.js
import { getItemService } from "../service/getItem.service.js";
import { lastValueFrom, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export function getItemController(event) {
  const id = event.pathParameters.id;
  const tableName = process.env.TABLE_NAME;

  return lastValueFrom(
        getItemService(tableName, id).pipe(
          map(result => ({
            statusCode: 200,
            body: JSON.stringify(result)
          })),
          catchError(err =>
            of({
              statusCode: 404,
              body: JSON.stringify({ error: err.message })
            })
          )
        )
      );
}