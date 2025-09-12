import { jest } from "@jest/globals";
import { of, throwError } from "rxjs";

// 🔹 Mockear el módulo repository antes de importarlo
const mockUpdateItem = jest.fn();

jest.unstable_mockModule("../repository/repository.js", () => ({
  updateItem: mockUpdateItem,
}));

// 🔹 Importar después de mockear
const { updateItemService } = await import("../service/updateItem.service.js");

describe("updateItemService", () => {
  const tableName = "TestTable";
  const id = "123";
  const name = "Updated Name";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("📭 debe retornar mensaje cuando el item no existe", (done) => {
    const notFoundResult = { message: "Item not found" };
    mockUpdateItem.mockReturnValue(of(notFoundResult));

    updateItemService(tableName, id, name).subscribe((result) => {
      expect(mockUpdateItem).toHaveBeenCalledWith(tableName, id, name);
      expect(result).toEqual({ message: "Item not found" });
      done();
    });
  });

  it("📝 debe retornar mensaje y item cuando se actualiza correctamente", (done) => {
    const updatedItem = { Attributes: { id, name } };
    mockUpdateItem.mockReturnValue(of(updatedItem));

    updateItemService(tableName, id, name).subscribe((result) => {
      expect(mockUpdateItem).toHaveBeenCalledWith(tableName, id, name);
      expect(result).toEqual({
        message: `Item ${id} updated`,
        item: updatedItem.Attributes,
      });
      done();
    });
  });

  it("❌ debe propagar error cuando el repositorio lanza excepción", (done) => {
    mockUpdateItem.mockReturnValue(throwError(() => new Error("DB Error")));

    updateItemService(tableName, id, name).subscribe({
      error: (err) => {
        expect(mockUpdateItem).toHaveBeenCalledWith(tableName, id, name);
        expect(err).toEqual(new Error("DB Error"));
        done();
      },
    });
  });
});