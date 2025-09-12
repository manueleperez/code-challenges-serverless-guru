// updateItem.service.js
import { updateItem } from "../repository/repository.js";
import { map } from "rxjs/operators";

export function updateItemService(tableName, id, name) {
  return updateItem(tableName, id, name).pipe(
    map(result => {
      // Si el repositorio retorna un mensaje de que no existía
      if (result.message) {
        return { message: result.message };
      }
      // Si se actualizó correctamente
      return {
        message: `Item ${id} updated`,
        item: result.Attributes
      };
    })
  );
}