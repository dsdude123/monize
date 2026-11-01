import { IsArray, ArrayMaxSize, IsDateString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

/**
 * How many rows one reconcile may cover. A first reconciliation of an imported
 * history is every row the account has ever held, and it commits whole or not
 * at all, so the ceiling sits well above any one account's register rather
 * than at a page size; 100,000 ids are about 4 MB of JSON, inside the 10 MB
 * body limit in main.ts.
 */
export const BULK_RECONCILE_MAX_IDS = 100_000;

export class BulkReconcileDto {
  @ApiProperty({
    description: "Array of transaction IDs to reconcile",
    type: [String],
  })
  @IsArray()
  @ArrayMaxSize(BULK_RECONCILE_MAX_IDS)
  @IsUUID("4", { each: true })
  transactionIds: string[];

  @ApiProperty({
    description: "Reconciliation date (YYYY-MM-DD format)",
  })
  @IsDateString()
  reconciledDate: string;
}
