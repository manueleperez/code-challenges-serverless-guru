import { jest } from "@jest/globals";
import { of } from "rxjs";

// 🔹 Mockear el módulo repository antes de importarlo
const mockScanItems = jest.fn();

jest.unstable_mockModule("../repository/repository.js", () => ({
  scanItems: mockScanItems,
}));

// 🔹 Importar después de mockear
const { listItemsService } = await import("../service/listItems.service.js");

describe("listItemsService", () => {
  const tableName = "TestTable";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("📭 debe retornar items vacío cuando no existen", (done) => {
    const noItemsResult = { message: "No items found" };
    mockScanItems.mockReturnValue(of(noItemsResult));

    listItemsService(tableName).subscribe((result) => {
      expect(mockScanItems).toHaveBeenCalledWith(tableName);
      expect(result).toEqual({ items: [] });
      done();
    });
  });

  it("📋 debe retornar lista de items cuando existen", (done) => {
    const items = [
      { id: "1", name: "Item 1" },
      { id: "2", name: "Item 2" },
    ];
    mockScanItems.mockReturnValue(of(items));

    listItemsService(tableName).subscribe((result) => {
      expect(mockScanItems).toHaveBeenCalledWith(tableName);
      expect(result).toEqual({ items });
      done();
    });
  });
});