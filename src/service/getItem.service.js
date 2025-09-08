// readItem.service.js
import { getItem } from "../repository/repository.js";
import { map } from "rxjs/operators";

export function getItemService(tableName, id) {
  return getItem(tableName, id).pipe(
    map(result => {
      if (!result.Item) throw new Error("Item not found");
      return { item: result.Item };
    })
  );
}