// readItem.service.js
import { getItem } from "../repository/repository.js";
import { map,catchError } from "rxjs/operators";
import { of } from "rxjs";

export function getItemService(tableName, id) {
  return getItem(tableName, id).pipe(
    map(result => {
      // Si el repositorio retorna un mensaje de "not found", propagamos ese mensaje
      if (result.message) {
        return { message: result.message };
      }
      // Si existe el item, lo retornamos
      return { item: result };
    }),
    catchError(error => of({ message: "Error fetching item", error }))
  );
}