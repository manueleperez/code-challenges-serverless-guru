import { jest } from "@jest/globals";
import { of, throwError } from "rxjs";

// 🔹 Mock del servicio antes de importar el controller
const mockListItemsService = jest.fn();

jest.unstable_mockModule("../service/listItems.service.js", () => ({
  listItemsService: mockListItemsService,
}));

// 🔹 Importar el controller después del mock
const { listItemsController } = await import("../controller/listItems.controller.js");

describe("listItemsController", () => {
  const tableName = "TestTable";

  beforeAll(() => {
    process.env.TABLE_NAME = tableName;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("✅ debe retornar 200 y la lista de items cuando el servicio funciona", async () => {
    const mockResult = [
      { id: "1", name: "Item 1" },
      { id: "2", name: "Item 2" },
    ];

    mockListItemsService.mockReturnValue(of(mockResult));

    const response = await listItemsController();

    expect(mockListItemsService).toHaveBeenCalledWith(tableName);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(mockResult);
  });

  it("❌ debe retornar 404 cuando el servicio lanza error", async () => {
    mockListItemsService.mockReturnValue(
      throwError(() => new Error("No items found"))
    );

    const response = await listItemsController();

    expect(mockListItemsService).toHaveBeenCalledWith(tableName);
    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body)).toEqual({ error: "No items found" });
  });

  it("🔎 debe usar correctamente process.env.TABLE_NAME", async () => {
    const mockResult = [{ id: "3", name: "Otro Item" }];
    mockListItemsService.mockReturnValue(of(mockResult));

    const response = await listItemsController();

    expect(mockListItemsService).toHaveBeenCalledWith("TestTable");
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(mockResult);
  });
});