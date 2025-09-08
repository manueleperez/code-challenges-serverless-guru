// controller/createItem.controller.js
import { createItemService } from "../service/createItem.service.js";
import { lastValueFrom, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export function createItemController(event) {
  const item = JSON.parse(event.body); // espera JSON con id y name
  console.debug(item);
  const tableName = process.env.TABLE_NAME;

  return lastValueFrom(
    createItemService(tableName, item).pipe(
      map(result => ({
        statusCode: 201,
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