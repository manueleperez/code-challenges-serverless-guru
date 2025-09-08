// service/deleteItem.service.js
import { deleteItem } from "../repository/repository.js";
import { map } from "rxjs/operators";

export function deleteItemService(tableName, id) {
  return deleteItem(tableName, id).pipe(
    map(() => ({ message: `Item ${id} deleted` }))
  );
}