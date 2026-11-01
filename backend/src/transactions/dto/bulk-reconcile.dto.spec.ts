import "reflect-metadata";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { BULK_RECONCILE_MAX_IDS, BulkReconcileDto } from "./bulk-reconcile.dto";

const uuid = (n: number): string =>
  `00000000-0000-4000-8000-${n.toString(16).padStart(12, "0")}`;

function build(count: number): BulkReconcileDto {
  return plainToInstance(BulkReconcileDto, {
    transactionIds: Array.from({ length: count }, (_, i) => uuid(i)),
    reconciledDate: "2026-10-31",
  });
}

describe("BulkReconcileDto", () => {
  // A first reconciliation covers every row the account has ever held, and the
  // reconcile screen sends them in one request so it commits whole or not at
  // all. The old ceiling of 1,000 refused an imported history outright with
  // "transactionIds must contain no more than 1000 elements".
  it("accepts more than a thousand ids", async () => {
    expect(await validate(build(1001))).toEqual([]);
  });

  it("accepts the ceiling and refuses one more", async () => {
    expect(await validate(build(BULK_RECONCILE_MAX_IDS))).toEqual([]);
    const over = await validate(build(BULK_RECONCILE_MAX_IDS + 1));
    expect(over.map((e) => Object.keys(e.constraints ?? {})).flat()).toContain(
      "arrayMaxSize",
    );
  });

  it("fits the ceiling inside the 10 MB JSON body limit", () => {
    const body = JSON.stringify({
      transactionIds: build(BULK_RECONCILE_MAX_IDS).transactionIds,
      reconciledDate: "2026-10-31",
    });
    expect(Buffer.byteLength(body)).toBeLessThan(10 * 1024 * 1024);
  });
});
