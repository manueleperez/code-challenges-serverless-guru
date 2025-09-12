import { jest } from "@jest/globals";
import { of, throwError } from "rxjs";

// 🟢 Mock del cliente Dynamo antes de importar el repository
const mockSend = jest.fn();

jest.unstable_mockModule("@aws-sdk/client-dynamodb", () => ({
  DynamoDBClient: jest.fn(() => ({ send: mockSend })),
  PutItemCommand: jest.fn((args) => ({ ...args, _type: "PutItemCommand" })),
  GetItemCommand: jest.fn((args) => ({ ...args, _type: "GetItemCommand" })),
  UpdateItemCommand: jest.fn((args) => ({ ...args, _type: "UpdateItemCommand" })),
  DeleteItemCommand: jest.fn((args) => ({ ...args, _type: "DeleteItemCommand" })),
  ScanCommand: jest.fn((args) => ({ ...args, _type: "ScanCommand" })),
}));

// 🔹 Importamos el repository después del mock
const { putItem, getItem, updateItem, deleteItem, scanItems } = await import(
  "../repository/repository.js"
);

describe("Dynamo Repository", () => {
  const tableName = "TestTable";

  afterEach(() => {
    jest.clearAllMocks();
  });

  // -------------------
  // putItem
  // -------------------
  it("✅ putItem debe crear un item nuevo", (done) => {
    mockSend.mockResolvedValueOnce({}); // sin Attributes → item nuevo

    putItem(tableName, { id: "1", name: "Item 1" }).subscribe((res) => {
      expect(res).toEqual({ message: "Item did not exist, new item created" });
      expect(mockSend).toHaveBeenCalled();
      done();
    });
  });

  it("✅ putItem debe devolver Attributes si existía", (done) => {
    const attrs = { id: { S: "1" }, name: { S: "Old" } };
    mockSend.mockResolvedValueOnce({ Attributes: attrs });

    putItem(tableName, { id: "1", name: "Item 1" }).subscribe((res) => {
      expect(res).toEqual(attrs);
      done();
    });
  });

  it("❌ putItem debe capturar error", (done) => {
    mockSend.mockRejectedValueOnce(new Error("Dynamo error"));

    putItem(tableName, { id: "1", name: "Item 1" }).subscribe((res) => {
      expect(res.message).toBe("Error inserting item");
      expect(res.error).toBeInstanceOf(Error);
      done();
    });
  });

  // -------------------
  // getItem
  // -------------------
  it("✅ getItem devuelve Item si existe", (done) => {
    const item = { id: { S: "1" } };
    mockSend.mockResolvedValueOnce({ Item: item });

    getItem(tableName, "1").subscribe((res) => {
      expect(res).toEqual(item);
      done();
    });
  });

  it("🔎 getItem devuelve mensaje si no existe", (done) => {
    mockSend.mockResolvedValueOnce({});

    getItem(tableName, "1").subscribe((res) => {
      expect(res).toEqual({ message: "Item not found" });
      done();
    });
  });

  it("❌ getItem captura error", (done) => {
    mockSend.mockRejectedValueOnce(new Error("Fail"));

    getItem(tableName, "1").subscribe((res) => {
      expect(res.message).toBe("Error fetching item");
      done();
    });
  });

  // -------------------
  // updateItem
  // -------------------
  it("✅ updateItem actualiza si existe", (done) => {
    const updated = { id: { S: "1" }, name: { S: "Updated" } };

    mockSend
      .mockResolvedValueOnce({ Item: { id: { S: "1" } } }) // primer GetItem
      .mockResolvedValueOnce(updated); // UpdateItem

    updateItem(tableName, "1", "Updated").subscribe((res) => {
      expect(res).toEqual(updated);
      expect(mockSend).toHaveBeenCalledTimes(2);
      done();
    });
  });

  it("🔎 updateItem devuelve mensaje si no existe", (done) => {
    mockSend.mockResolvedValueOnce({}); // GetItem vacío

    updateItem(tableName, "1", "Updated").subscribe((res) => {
      expect(res).toEqual({ message: "Item did not exist, nothing updated" });
      done();
    });
  });

  // -------------------
  // deleteItem
  // -------------------
  it("✅ deleteItem devuelve Attributes si existía", (done) => {
    const attrs = { id: { S: "1" } };
    mockSend.mockResolvedValueOnce({ Attributes: attrs });

    deleteItem(tableName, "1").subscribe((res) => {
      expect(res).toEqual(attrs);
      done();
    });
  });

  it("🔎 deleteItem devuelve mensaje si no existía", (done) => {
    mockSend.mockResolvedValueOnce({});

    deleteItem(tableName, "1").subscribe((res) => {
      expect(res).toEqual({ message: "Item did not exist, nothing deleted" });
      done();
    });
  });

  // -------------------
  // scanItems
  // -------------------
  it("✅ scanItems devuelve items si existen", (done) => {
    const items = [{ id: { S: "1" } }];
    mockSend.mockResolvedValueOnce({ Items: items });

    scanItems(tableName).subscribe((res) => {
      expect(res).toEqual(items);
      done();
    });
  });

  it("🔎 scanItems devuelve mensaje si no hay items", (done) => {
    mockSend.mockResolvedValueOnce({ Items: [] });

    scanItems(tableName).subscribe((res) => {
      expect(res).toEqual({ message: "No items found" });
      done();
    });
  });

  it("❌ scanItems captura error", (done) => {
    mockSend.mockRejectedValueOnce(new Error("Fail"));

    scanItems(tableName).subscribe((res) => {
      expect(res.message).toBe("Error scanning table");
      done();
    });
  });
});