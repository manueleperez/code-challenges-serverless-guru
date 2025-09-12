import { jest } from "@jest/globals";
import { of, throwError } from "rxjs";

// 🔹 Mockear el módulo repository antes de importarlo
const mockGetItem = jest.fn();

jest.unstable_mockModule("../repository/repository.js", () => ({
  getItem: mockGetItem,
}));

// 🔹 Importar después de mockear
const { getItemService } = await import("../service/getItem.service.js");

describe("getItemService", () => {
  const tableName = "TestTable";
  const id = "123";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("📭 debe retornar mensaje cuando el item no existe", (done) => {
    const notFoundResult = { message: "Item not found" };
    mockGetItem.mockReturnValue(of(notFoundResult));

    getItemService(tableName, id).subscribe((result) => {
      expect(mockGetItem).toHaveBeenCalledWith(tableName, id);
      expect(result).toEqual({ message: "Item not found" });
      done();
    });
  });

  it("📦 debe retornar el item cuando existe", (done) => {
    const foundItem = { id, name: "Test Item" };
    mockGetItem.mockReturnValue(of(foundItem));

    getItemService(tableName, id).subscribe((result) => {
      expect(mockGetItem).toHaveBeenCalledWith(tableName, id);
      expect(result).toEqual({ item: foundItem });
      done();
    });
  });

  it("❌ debe retornar mensaje de error cuando el repositorio lanza excepción", (done) => {
    mockGetItem.mockReturnValue(throwError(() => new Error("DB Error")));

    getItemService(tableName, id).subscribe((result) => {
      expect(mockGetItem).toHaveBeenCalledWith(tableName, id);
      expect(result).toEqual({
        message: "Error fetching item",
        error: new Error("DB Error"),
      });
      done();
    });
  });
});