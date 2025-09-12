import { jest } from "@jest/globals";
import { of, throwError } from "rxjs";

// 🔹 Mockear el módulo antes de importarlo
const mockCreateItemService = jest.fn();

jest.unstable_mockModule("../service/createItem.service.js", () => ({
  createItemService: mockCreateItemService,
}));

// 🔹 Importar después de mockear
const { createItemController } = await import("../controller/createItem.controller.js");

describe("createItemController", () => {
  const tableName = "TestTable";
  const mockItem = { id: "1", name: "Test Item" };
  const event = { body: JSON.stringify(mockItem) };

  beforeAll(() => {
    process.env.TABLE_NAME = tableName;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("✅ debe retornar 201 y el resultado cuando el servicio funciona", async () => {
    const mockResult = { id: "1", name: "Test Item Saved" };

    mockCreateItemService.mockReturnValue(of(mockResult));

    const response = await createItemController(event);

    expect(mockCreateItemService).toHaveBeenCalledWith(tableName, mockItem);
    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body)).toEqual(mockResult);
  });

  it("❌ debe retornar 400 cuando el servicio lanza error", async () => {
    mockCreateItemService.mockReturnValue(
      throwError(() => new Error("DB Error"))
    );

    const response = await createItemController(event);

    expect(mockCreateItemService).toHaveBeenCalledWith(tableName, mockItem);
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({ error: "DB Error" });
  });

  it("🔎 debe parsear correctamente el body del evento", async () => {
    const mockResult = { id: "2", name: "Otro Item" };
    mockCreateItemService.mockReturnValue(of(mockResult));

    const customEvent = { body: JSON.stringify({ id: "2", name: "Otro Item" }) };
    const response = await createItemController(customEvent);

    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body)).toEqual(mockResult);
  });
});