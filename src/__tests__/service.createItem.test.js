import { jest } from "@jest/globals";
import { of } from "rxjs";

// 🔹 Mockear el módulo repository antes de importarlo
const mockPutItem = jest.fn();

jest.unstable_mockModule("../repository/repository.js", () => ({
  putItem: mockPutItem,
}));

// 🔹 Importar después de mockear
const { createItemService } = await import("../service/createItem.service.js");

describe("createItemService", () => {
  const tableName = "TestTable";
  const mockItem = { id: "1", name: "Test Item" };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("✅ debe retornar mensaje de creado cuando no existía antes", (done) => {
    mockPutItem.mockReturnValue(of({ message: "inserted" }));

    createItemService(tableName, mockItem).subscribe((result) => {
      expect(mockPutItem).toHaveBeenCalledWith(tableName, mockItem);
      expect(result).toEqual({
        message: `Item ${mockItem.id} created`,
        item: mockItem,
      });
      done();
    });
  });

  it("♻️ debe retornar mensaje de existente cuando ya estaba en la tabla", (done) => {
    const previousItem = { id: "1", name: "Prev Item" };
    mockPutItem.mockReturnValue(of(previousItem));

    createItemService(tableName, mockItem).subscribe((result) => {
      expect(mockPutItem).toHaveBeenCalledWith(tableName, mockItem);
      expect(result).toEqual({
        message: `Item ${mockItem.id} already existed`,
        previousItem,
      });
      done();
    });
  });
});