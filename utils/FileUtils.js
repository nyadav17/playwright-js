// @ts-check
import path from "path";
import fs from "fs";
import { parse } from "csv-parse/sync";

export function readCSV(filename) {
  const record = parse(
    fs.readFileSync(path.join(__dirname, "../data", "sauce-demo", filename)),
    {
      columns: true,
      skip_empty_lines: true,
      delimiter: ",",
    }
  );
  return record;
}
