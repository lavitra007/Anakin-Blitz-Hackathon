import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(process.cwd(), "records.json");

async function ensureDb() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify([], null, 2), "utf-8");
  }
}

export async function getRecords(): Promise<any[]> {
  await ensureDb();
  const content = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(content);
}

export async function saveRecords(records: any[]): Promise<void> {
  await ensureDb();
  await fs.writeFile(DB_PATH, JSON.stringify(records, null, 2), "utf-8");
}

export async function addRecord(record: any): Promise<any> {
  const records = await getRecords();
  records.push(record);
  await saveRecords(records);
  return record;
}

export async function updateRecord(id: string, updates: any): Promise<any | null> {
  const records = await getRecords();
  const index = records.findIndex(r => r.id === id);
  if (index !== -1) {
    records[index] = { ...records[index], ...updates };
    await saveRecords(records);
    return records[index];
  }
  return null;
}

export async function clearRecords(): Promise<void> {
  await saveRecords([]);
}
