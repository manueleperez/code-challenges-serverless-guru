import { jest } from "@jest/globals";
import { of, throwError } from "rxjs";

// 🔹 Mock del servicio antes de importar el controller
const mockDeleteItemService = jest.fn();

jest.unstable_mockModule("../service/deleteItem.service.js", () => ({
  deleteItemService: mockDeleteItemService,
}));

// 🔹 Importar el controller después del mock
const { deleteItemController } = await import("../controller/deleteItem.controller.js");

describe("deleteItemController", () => {
  const tableName = "TestTable";
  const event = { pathParameters: { id: "123" } };

  beforeAll(() => {
    process.env.TABLE_NAME = tableName;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("✅ debe retornar 200 y el resultado cuando el servicio funciona", async () => {
    const mockResult = { success: true, id: "123" };

    mockDeleteItemService.mockReturnValue(of(mockResult));

    const response = await deleteItemController(event);

    expect(mockDeleteItemService).toHaveBeenCalledWith(tableName, "123");
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(mockResult);
  });

  it("❌ debe retornar 400 cuando el servicio lanza error", async () => {
    mockDeleteItemService.mockReturnValue(
      throwError(() => new Error("Delete Error"))
    );

    const response = await deleteItemController(event);

    expect(mockDeleteItemService).toHaveBeenCalledWith(tableName, "123");
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({ error: "Delete Error" });
  });

  it("🔎 debe tomar correctamente el id desde event.pathParameters", async () => {
    const mockResult = { success: true, id: "456" };
    mockDeleteItemService.mockReturnValue(of(mockResult));

    const customEvent = { pathParameters: { id: "456" } };
    const response = await deleteItemController(customEvent);

    expect(mockDeleteItemService).toHaveBeenCalledWith(tableName, "456");
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(mockResult);
  });
});