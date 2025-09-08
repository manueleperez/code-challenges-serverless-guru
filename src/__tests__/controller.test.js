import { jest } from "@jest/globals";
import { of, throwError } from "rxjs";

// 🔹 Definir mocks ANTES de importar controladores
jest.unstable_mockModule("../src/service/createItem.service.js", () => ({
  createItemService: jest.fn(),
}));
jest.unstable_mockModule("../src/service/getItem.service.js", () => ({
  getItemService: jest.fn(),
}));
jest.unstable_mockModule("../src/service/updateItem.service.js", () => ({
  updateItemService: jest.fn(),
}));
jest.unstable_mockModule("../src/service/deleteItem.service.js", () => ({
  deleteItemService: jest.fn(),
}));
jest.unstable_mockModule("../src/service/listItems.service.js", () => ({
  listItemsService: jest.fn(),
}));

// 🔹 Import dinámico: los mocks ya están activos
const { createItemController } = await import("../src/controller/createItem.controller.js");
const { getItemController } = await import("../src/controller/getItem.controller.js");
const { updateItemController } = await import("../src/controller/updateItem.controller.js");
const { deleteItemController } = await import("../src/controller/deleteItem.controller.js");
const { listItemsController } = await import("../src/controller/listItems.controller.js");

// 🔹 Importar servicios (mockeados arriba)
const createService = await import("../src/service/createItem.service.js");
const getService = await import("../src/service/getItem.service.js");
const updateService = await import("../src/service/updateItem.service.js");
const deleteService = await import("../src/service/deleteItem.service.js");
const listService = await import("../src/service/listItems.service.js");

describe("Controller Layer", () => {
  beforeAll(() => {
    process.env.TABLE_NAME = "ItemsTable";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("createItemController retorna 201", async () => {
    createService.createItemService.mockReturnValue(of({ message: "created" }));

    const res = await createItemController({
      body: JSON.stringify({ id: "1", name: "Test" }),
    });

    expect(res.statusCode).toBe(201);
    expect(JSON.parse(res.body).message).toBe("created");
  });

  test("getItemController retorna 200", async () => {
    getService.getItemService.mockReturnValue(of({ item: { id: { S: "1" } } }));

    const res = await getItemController({ pathParameters: { id: "1" } });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).item.id.S).toBe("1");
  });

  test("updateItemController retorna 200", async () => {
    updateService.updateItemService.mockReturnValue(of({ message: "updated" }));

    const res = await updateItemController({
      pathParameters: { id: "1" },
      body: JSON.stringify({ name: "Updated" }),
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).message).toBe("updated");
  });

  test("deleteItemController retorna 200", async () => {
    deleteService.deleteItemService.mockReturnValue(of({ message: "deleted" }));

    const res = await deleteItemController({ pathParameters: { id: "1" } });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).message).toBe("deleted");
  });

  test("listItemsController retorna 200", async () => {
    listService.listItemsService.mockReturnValue(of({ items: [] }));

    const res = await listItemsController({});

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).items).toEqual([]);
  });

  test("getItemController retorna error 404", async () => {
    getService.getItemService.mockReturnValue(
      throwError(() => new Error("Not found"))
    );

    const res = await getItemController({ pathParameters: { id: "99" } });

    expect(res.statusCode).toBe(404);
    expect(JSON.parse(res.body).error).toBe("Not found");
  });
});