// controller/listItems.controller.js
import { listItemsService } from "../service/listItems.service.js";
import { lastValueFrom, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export function listItemsController() {
  const tableName = process.env.TABLE_NAME;

   return lastValueFrom(
      listItemsService(tableName).pipe(
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