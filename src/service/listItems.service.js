// service/listItems.service.js
import { scanItems } from "../repository/repository.js";
import { map } from "rxjs/operators";

export function listItemsService(tableName) {
  return scanItems(tableName).pipe(
    map(result => ({ items: result.Items || [] }))
  );
}