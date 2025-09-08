// __tests__/repository.test.js
import { jest } from "@jest/globals";
import { firstValueFrom } from "rxjs";

// Mock completo de DynamoDBClient y Commands
const sendMock = jest.fn().mockResolvedValue({ mock: true });

jest.unstable_mockModule("@aws-sdk/client-dynamodb", () => {
  return {
    DynamoDBClient: jest.fn(() => ({
      send: sendMock,
    })),
    PutItemCommand: jest.fn(),
    GetItemCommand: jest.fn(),
    UpdateItemCommand: jest.fn(),
    DeleteItemCommand: jest.fn(),
    ScanCommand: jest.fn(),
  };
});

// 👇 importa el repo DESPUÉS de mockear
const repository = await import("../src/repository/repository.js");

describe("Repository Layer (RxJS)", () => {
  const table = "ItemsTable";

  beforeEach(() => {
    sendMock.mockClear();
  });

  test("putItem debe llamar a DynamoDBClient.send()", async () => {
    const res = await firstValueFrom(
      repository.putItem(table, { id: "1", name: "Test" })
    );
    expect(res).toEqual({ mock: true });
    expect(sendMock).toHaveBeenCalled();
  });

  test("getItem debe retornar observable con resultado", async () => {
    const res = await firstValueFrom(repository.getItem(table, "1"));
    expect(res).toEqual({ mock: true });
    expect(sendMock).toHaveBeenCalled();
  });

  test("updateItem debe retornar observable con resultado", async () => {
    const res = await firstValueFrom(repository.updateItem(table, "1", "Updated"));
    expect(res).toEqual({ mock: true });
    expect(sendMock).toHaveBeenCalled();
  });

  test("deleteItem debe retornar observable con resultado", async () => {
    const res = await firstValueFrom(repository.deleteItem(table, "1"));
    expect(res).toEqual({ mock: true });
    expect(sendMock).toHaveBeenCalled();
  });

  test("scanItems debe retornar observable con resultado", async () => {
    const res = await firstValueFrom(repository.scanItems(table));
    expect(res).toEqual({ mock: true });
    expect(sendMock).toHaveBeenCalled();
  });
});