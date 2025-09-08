import { of, throwError } from "rxjs";
import { jest } from "@jest/globals";

// 🔹 Mock del repository con ESM
jest.unstable_mockModule("../src/repository/repository.js", () => ({
  putItem: jest.fn(),
  getItem: jest.fn(),
  updateItem: jest.fn(),
  deleteItem: jest.fn(),
  scanItems: jest.fn(),
}));

// 🔹 Import dinámico después de definir mocks
const repository = await import("../src/repository/repository.js");
const { createItemService } = await import("../src/service/createItem.service.js");
const { getItemService } = await import("../src/service/getItem.service.js");
const { updateItemService } = await import("../src/service/updateItem.service.js");
const { deleteItemService } = await import("../src/service/deleteItem.service.js");
const { listItemsService } = await import("../src/service/listItems.service.js");

describe("Service Layer", () => {
  const table = "ItemsTable";

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("createItemService debe retornar mensaje", done => {
    repository.putItem.mockReturnValue(of({}));

    createItemService(table, { id: "1", name: "Test" }).subscribe(res => {
      expect(res.message).toContain("created");
      done();
    });
  });

  test("getItemService debe retornar item", done => {
    repository.getItem.mockReturnValue(of({ Item: { id: { S: "1" } } }));

    getItemService(table, "1").subscribe(res => {
      expect(res.item.id.S).toBe("1");
      done();
    });
  });

  test("getItemService lanza error si no existe", done => {
    repository.getItem.mockReturnValue(of({}));

    getItemService(table, "2").subscribe({
      next: () => {
        done.fail("Debió lanzar error");
      },
      error: err => {
        expect(err.message).toBe("Item not found");
        done();
      }
    });
  });

  test("updateItemService debe retornar mensaje actualizado", done => {
    repository.updateItem.mockReturnValue(
      of({ Attributes: { id: { S: "1" }, name: { S: "Updated" } } })
    );

    updateItemService(table, "1", "Updated").subscribe(res => {
      expect(res.message).toContain("updated");
      expect(res.item.name.S).toBe("Updated");
      done();
    });
  });

  test("deleteItemService debe retornar mensaje eliminado", done => {
    repository.deleteItem.mockReturnValue(of({}));

    deleteItemService(table, "1").subscribe(res => {
      expect(res.message).toContain("deleted");
      done();
    });
  });

  test("listItemsService debe retornar lista", done => {
    repository.scanItems.mockReturnValue(
      of({ Items: [{ id: { S: "1" } }] })
    );

    listItemsService(table).subscribe(res => {
      expect(res.items.length).toBe(1);
      expect(res.items[0].id.S).toBe("1");
      done();
    });
  });
});