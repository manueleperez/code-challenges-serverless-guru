import { jest } from "@jest/globals";
import { of, throwError } from "rxjs";

// 🔹 Mock del servicio antes de importar el controller
const mockGetItemService = jest.fn();

jest.unstable_mockModule("../service/getItem.service.js", () => ({
  getItemService: mockGetItemService,
}));

// 🔹 Importar el controller después del mock
const { getItemController } = await import("../controller/getItem.controller.js");

describe("getItemController", () => {
  const tableName = "TestTable";
  const event = { pathParameters: { id: "123" } };

  beforeAll(() => {
    process.env.TABLE_NAME = tableName;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("✅ debe retornar 200 y el resultado cuando el servicio funciona", async () => {
    const mockResult = { id: "123", name: "Test Item" };

    mockGetItemService.mockReturnValue(of(mockResult));

    const response = await getItemController(event);

    expect(mockGetItemService).toHaveBeenCalledWith(tableName, "123");
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(mockResult);
  });

  it("❌ debe retornar 404 cuando el servicio lanza error", async () => {
    mockGetItemService.mockReturnValue(
      throwError(() => new Error("Item not found"))
    );

    const response = await getItemController(event);

    expect(mockGetItemService).toHaveBeenCalledWith(tableName, "123");
    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body)).toEqual({ error: "Item not found" });
  });

  it("🔎 debe tomar correctamente el id desde event.pathParameters", async () => {
    const mockResult = { id: "456", name: "Otro Item" };
    mockGetItemService.mockReturnValue(of(mockResult));

    const customEvent = { pathParameters: { id: "456" } };
    const response = await getItemController(customEvent);

    expect(mockGetItemService).toHaveBeenCalledWith(tableName, "456");
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(mockResult);
  });
});