import Dexie, { type EntityTable } from "dexie";

interface TranslateTable {
  module: string;
  vie: string;
  jap: string;
  thai: string;
  eng: string;
  cn: string;
  create_at: string;
}

const db = new Dexie("FriendsDatabase") as Dexie & {
  translate: EntityTable<
    TranslateTable,
    "module" // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  translate: "++module, vie, jap, thai, eng, cn, create_at", // primary key "id" (for the runtime!)
});

export type { TranslateTable };
export { db };
