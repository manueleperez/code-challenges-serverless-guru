// updateItem.service.js
import { updateItem } from "../repository/repository.js";
import { map } from "rxjs/operators";

export function updateItemService(tableName, id, name) {
  return updateItem(tableName, id, name).pipe(
    map(result => ({
      message: `Item ${id} updated`,
      item: result.Attributes
    }))
  );
}