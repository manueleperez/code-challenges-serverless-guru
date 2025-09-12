// service/deleteItem.service.js
import { deleteItem } from "../repository/repository.js";
import { map } from "rxjs/operators";

export function deleteItemService(tableName, id) {
  return deleteItem(tableName, id).pipe(
    map(result => {
      // Si el repositorio retorna un mensaje de que no existía
      if (result.message) {
        return { message: result.message };
      }
      // Si se eliminó correctamente
      return {
        message: `Item ${id} deleted`,
        item: result
      };
    })
  );
}