// createItem.service.js
import { putItem } from "../repository/repository.js";
import { map } from "rxjs/operators";

export function createItemService(tableName, item) {
  return putItem(tableName, item).pipe(
    map(() => ({ message: `Item ${item.id} created`, item }))
  );
}
