// service/listItems.service.js
import { scanItems } from "../repository/repository.js";
import { map } from "rxjs/operators";

export function listItemsService(tableName) {
  return scanItems(tableName).pipe(
    map(result => {
      // Si es un mensaje de "No items found", devolvemos items vacío
      if (result.message) {
        return { items: [] };
      }
      // Si es un array de items, lo retornamos directamente
      return { items: result };
    })
  );
}