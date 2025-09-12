import { jest } from "@jest/globals";
import { of, throwError } from "rxjs";

// 🔹 Mock del servicio antes de importar el controller
const mockUpdateItemService = jest.fn();

jest.unstable_mockModule("../service/updateItem.service.js", () => ({
  updateItemService: mockUpdateItemService,
}));

// 🔹 Importar el controller después del mock
const { updateItemController } = await import("../controller/updateItem.controller.js");

describe("updateItemController", () => {
  const tableName = "TestTable";
  const id = "123";
  const body = { name: "Updated Name" };
  const event = { pathParameters: { id }, body: JSON.stringify(body) };

  beforeAll(() => {
    process.env.TABLE_NAME = tableName;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("✅ debe retornar 200 y el resultado cuando el servicio funciona", async () => {
    const mockResult = { id: "123", name: "Updated Name" };

    mockUpdateItemService.mockReturnValue(of(mockResult));

    const response = await updateItemController(event);

    expect(mockUpdateItemService).toHaveBeenCalledWith(tableName, id, body.name);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(mockResult);
  });

  it("❌ debe retornar 400 cuando el servicio lanza error", async () => {
    mockUpdateItemService.mockReturnValue(
      throwError(() => new Error("Update failed"))
    );

    const response = await updateItemController(event);

    expect(mockUpdateItemService).toHaveBeenCalledWith(tableName, id, body.name);
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({ error: "Update failed" });
  });

  it("🔎 debe parsear correctamente el id y body del evento", async () => {
    const mockResult = { id: "456", name: "Nuevo Nombre" };
    const customEvent = { pathParameters: { id: "456" }, body: JSON.stringify({ name: "Nuevo Nombre" }) };

    mockUpdateItemService.mockReturnValue(of(mockResult));

    const response = await updateItemController(customEvent);

    expect(mockUpdateItemService).toHaveBeenCalledWith("TestTable", "456", "Nuevo Nombre");
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(mockResult);
  });
});