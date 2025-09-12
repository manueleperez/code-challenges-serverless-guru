// createItem.service.js
import { putItem } from "../repository/repository.js";
import { map } from "rxjs/operators";

export function createItemService(tableName, item) {
  return putItem(tableName, item).pipe(
    map(result => {
      if (result.message) {
        // Caso: no existía, se creó uno nuevo
        return { message: `Item ${item.id} created`, item };
      } else {
        // Caso: ya existía, retornamos el anterior
        return { 
          message: `Item ${item.id} already existed`,
          previousItem: result 
        };
      }
    })
  );
}
