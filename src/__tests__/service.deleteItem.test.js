import { jest } from "@jest/globals";
import { of } from "rxjs";

// 🔹 Mockear el módulo repository antes de importarlo
const mockDeleteItem = jest.fn();

jest.unstable_mockModule("../repository/repository.js", () => ({
  deleteItem: mockDeleteItem,
}));

// 🔹 Importar después de mockear
const { deleteItemService } = await import("../service/deleteItem.service.js");

describe("deleteItemService", () => {
  const tableName = "TestTable";
  const id = "123";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("✅ debe retornar mensaje cuando el item no existía", (done) => {
    const notFoundResult = { message: "Item not found" };
    mockDeleteItem.mockReturnValue(of(notFoundResult));

    deleteItemService(tableName, id).subscribe((result) => {
      expect(mockDeleteItem).toHaveBeenCalledWith(tableName, id);
      expect(result).toEqual({ message: "Item not found" });
      done();
    });
  });

  it("🗑️ debe retornar mensaje de eliminado cuando existe", (done) => {
    const deletedItem = { id, name: "Test Item" };
    mockDeleteItem.mockReturnValue(of(deletedItem));

    deleteItemService(tableName, id).subscribe((result) => {
      expect(mockDeleteItem).toHaveBeenCalledWith(tableName, id);
      expect(result).toEqual({
        message: `Item ${id} deleted`,
        item: deletedItem,
      });
      done();
    });
  });
});