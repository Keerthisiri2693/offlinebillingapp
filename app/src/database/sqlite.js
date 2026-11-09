import * as SQLite from "expo-sqlite";

let db = null;
let dbPromise = null;

// ============================================================
// SQLITE CONNECTION HEALTH CHECK
// ============================================================

const isDatabaseUsable = async (
  database
) => {
  if (!database) return false;

  try {
    if (
      typeof database.getFirstAsync !== "function" ||
      typeof database.runAsync !== "function" ||
      typeof database.getAllAsync !== "function" ||
      typeof database.execAsync !== "function"
    ) {
      return false;
    }

    await database.getFirstAsync("SELECT 1 AS sqliteHealth");
    return true;
  } catch (error) {
  console.warn(
    "⚠️ SQLITE CONNECTION IS NOT USABLE:",
    error?.message || error
  );

  console.warn(
    "⚠️ SQLITE ERROR DETAILS:",
    error
  );

  return false;
}
};

// ============================================================
// INITIALIZATION SQL EXECUTOR
// Logs the exact SQL step that fails during startup.
// ============================================================

const executeInitSQL = async (
  database,
  label,
  sql
) => {
  console.log(`➡️ ${label} START`);

  try {
    await database.execAsync(sql);
    console.log(`✅ ${label} DONE`);
  } catch (error) {
    console.error(`❌ ${label} FAILED`);
    console.error("❌ SQL:", sql);
    console.error("❌ ERROR:", error?.message || error);
    throw error;
  }
};

// ============================================================
// GET / OPEN SQLITE DATABASE
// Single-flight: opening + initialization happen once.
// No caller can use the connection before initialization ends.
// ============================================================

export const getDB = async () => {
  if (db) {
    const usable = await isDatabaseUsable(db);

    if (usable) {
      return db;
    }

    console.warn("⚠️ Existing SQLite connection is stale.");
    db = null;
  }

  // Reuse the same promise while another caller is opening or
  // initializing the database.
  if (dbPromise) {
    console.log("⏳ Waiting for SQLite database initialization...");
    return dbPromise;
  }

  const openingPromise = (async () => {
    console.log("🗄️ OPENING SQLITE DATABASE...");

    const database = await SQLite.openDatabaseAsync("app1.db");

    if (!database) {
      throw new Error("Unable to open SQLite database.");
    }

    if (
      typeof database.runAsync !== "function" ||
      typeof database.getFirstAsync !== "function" ||
      typeof database.getAllAsync !== "function" ||
      typeof database.execAsync !== "function"
    ) {
      throw new Error("Invalid SQLite database object.");
    }

    console.log("✅ SQLITE DATABASE OPENED");
    console.log("📁 DATABASE PATH:", database.databasePath);
    console.log("🔧 STARTING DATABASE INITIALIZATION...");

    // IMPORTANT: do not assign global `db` until initialization
    // has completed successfully.
    const initialized = await initializeDatabase(database);

    if (!initialized) {
      throw new Error("SQLite database initialization failed.");
    }

    const usable = await isDatabaseUsable(database);

    if (!usable) {
      throw new Error(
        "SQLite database became unusable after initialization."
      );
    }

    db = database;

    console.log("✅ SQLITE DATABASE READY");
    return database;
  })();

  dbPromise = openingPromise;

  try {
    return await openingPromise;
  } catch (error) {
    console.error("❌ getDB ERROR:", error);
    console.error("❌ getDB ERROR MESSAGE:", error?.message || error);
    db = null;
    throw error;
  } finally {
    if (dbPromise === openingPromise) {
      dbPromise = null;
    }
  }
};

// ============================================================
// PUBLIC INITIALIZATION API
// Keep this for existing App startup calls: await initDB().
// It uses the same single-flight getDB() path.
// ============================================================

export const initDB = async () => {
  try {
    await getDB();
    return true;
  } catch (error) {
    console.error("❌ initDB ERROR:", error?.message || error);
    return false;
  }
};

// ============================================================
// INTERNAL DATABASE SCHEMA INITIALIZATION
// Always receives the already-open database instance.
// Never open another connection or call getDB() here.
// ============================================================

const initializeDatabase = async (
  database
) => {
  try {
    console.log("🔧 INITIALIZING DATABASE...");

    // =====================================================
    // FOREIGN KEYS
    // =====================================================

    await executeInitSQL(database, "INIT SQL STEP 1", `
      PRAGMA foreign_keys = ON;
    `);

    // =====================================================
    // USERS
    // =====================================================

    await executeInitSQL(database, "INIT SQL STEP 2", `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY NOT NULL,
        email TEXT UNIQUE,
        password TEXT,
        deviceId TEXT,
        isLoggedIn INTEGER DEFAULT 0
      );
    `);

    console.log("✅ USERS TABLE READY");

    // =====================================================
    // PROFILE
    // =====================================================

    await executeInitSQL(database, "INIT SQL STEP 3", `
      CREATE TABLE IF NOT EXISTS profile (
        id TEXT PRIMARY KEY NOT NULL,
        shopName TEXT,
        ownerName TEXT,
        mobile TEXT,
        email TEXT,
        address TEXT,
        categories TEXT,
        openTime TEXT,
        closeTime TEXT,
        image TEXT,
        updatedAt TEXT
      );
    `);

    console.log("✅ PROFILE TABLE READY");

    // =====================================================
    // PROFILE MIGRATION
    // =====================================================

    try {
      const columns = await database.getAllAsync(
        `PRAGMA table_info(profile)`
      );

      const columnNames = columns.map(
        (column) => column.name
      );

      console.log("📋 PROFILE COLUMNS:", columnNames);

      const requiredColumns = [
        ["shopName", "TEXT"],
        ["ownerName", "TEXT"],
        ["mobile", "TEXT"],
        ["email", "TEXT"],
        ["address", "TEXT"],
        ["categories", "TEXT"],
        ["openTime", "TEXT"],
        ["closeTime", "TEXT"],
        ["image", "TEXT"],
        ["updatedAt", "TEXT"],
      ];

      for (const [columnName, columnType] of requiredColumns) {
        if (!columnNames.includes(columnName)) {
          await executeInitSQL(database, "INIT SQL STEP 4", `
            ALTER TABLE profile
            ADD COLUMN ${columnName} ${columnType};
          `);

          console.log(
            `✅ Added profile column: ${columnName}`
          );
        }
      }
    } catch (error) {
      console.log(
        "❌ PROFILE MIGRATION ERROR:",
        error
      );
    }

    // =====================================================
    // PRODUCTS
    // =====================================================

    await executeInitSQL(database, "INIT SQL STEP 5", `
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY NOT NULL,

        productcode TEXT,
        productenglishname TEXT,
        producttamilName TEXT,

        category TEXT,
        subcategory TEXT,

        producttype TEXT,
        subtype TEXT,
        brandname TEXT,

        unittype TEXT,
        uom TEXT,

        purchase REAL DEFAULT 0,
        profit REAL DEFAULT 0,
        loss REAL DEFAULT 0,

        wholesale REAL DEFAULT 0,
        retail REAL DEFAULT 0,
        mrp REAL DEFAULT 0,

        discount REAL DEFAULT 0,
        finalprice REAL DEFAULT 0,

        stockquantity REAL DEFAULT 0,
        stockvalue REAL DEFAULT 0,
        maxqty REAL DEFAULT 0,

        productimage TEXT,

        barcode TEXT,
        sellingcode TEXT,

        competitor1 TEXT,
        competitor2 TEXT,

        mfd TEXT,
        exp TEXT,
        bestbefore TEXT,

        pricetype TEXT,

        sgst REAL DEFAULT 0,
        cgst REAL DEFAULT 0,
        igst REAL DEFAULT 0,

        hsn TEXT,
        hsncode TEXT,

        createdAt TEXT
      );
    `);

    console.log("✅ PRODUCTS TABLE READY");

    // =====================================================
    // PRODUCTS MIGRATION
    // IMPORTANT:
    // CREATE TABLE IF NOT EXISTS DOES NOT UPDATE
    // AN EXISTING TABLE.
    // =====================================================

    try {
      const columns = await database.getAllAsync(
        `PRAGMA table_info(products)`
      );

      const columnNames = columns.map(
        (column) => column.name
      );

      console.log(
        "📋 EXISTING PRODUCT COLUMNS:",
        columnNames
      );

      const requiredProductColumns = [
        ["productcode", "TEXT"],
        ["productenglishname", "TEXT"],
        ["producttamilName", "TEXT"],
        ["category", "TEXT"],
        ["subcategory", "TEXT"],
        ["producttype", "TEXT"],
        ["subtype", "TEXT"],
        ["brandname", "TEXT"],
        ["unittype", "TEXT"],
        ["uom", "TEXT"],
        ["purchase", "REAL DEFAULT 0"],
        ["profit", "REAL DEFAULT 0"],
        ["loss", "REAL DEFAULT 0"],
        ["wholesale", "REAL DEFAULT 0"],
        ["retail", "REAL DEFAULT 0"],
        ["mrp", "REAL DEFAULT 0"],
        ["discount", "REAL DEFAULT 0"],
        ["finalprice", "REAL DEFAULT 0"],
        ["stockquantity", "REAL DEFAULT 0"],
        ["stockvalue", "REAL DEFAULT 0"],
        ["maxqty", "REAL DEFAULT 0"],
        ["productimage", "TEXT"],
        ["barcode", "TEXT"],
        ["sellingcode", "TEXT"],
        ["competitor1", "TEXT"],
        ["competitor2", "TEXT"],
        ["mfd", "TEXT"],
        ["exp", "TEXT"],
        ["bestbefore", "TEXT"],
        ["pricetype", "TEXT"],
        ["sgst", "REAL DEFAULT 0"],
        ["cgst", "REAL DEFAULT 0"],
        ["igst", "REAL DEFAULT 0"],
        ["hsn", "TEXT"],
        ["hsncode", "TEXT"],
        ["createdAt", "TEXT"],
      ];

      for (
        const [columnName, columnType]
        of requiredProductColumns
      ) {
        if (!columnNames.includes(columnName)) {
          try {
            await executeInitSQL(database, "INIT SQL STEP 6", `
              ALTER TABLE products
              ADD COLUMN ${columnName} ${columnType};
            `);

            console.log(
              `✅ Added product column: ${columnName}`
            );
          } catch (error) {
            console.log(
              `⚠️ Could not add product column ${columnName}:`,
              error
            );
          }
        }
      }
    } catch (error) {
      console.log(
        "❌ PRODUCTS MIGRATION ERROR:",
        error
      );
    }

    // =====================================================
    // NEW INVOICE
    // =====================================================

    await executeInitSQL(database, "INIT SQL STEP 7", `
      CREATE TABLE IF NOT EXISTS newinvoice (
        id TEXT PRIMARY KEY NOT NULL,

        invoiceNo TEXT,
        invoiceDate TEXT,

        customerId TEXT,
        customerName TEXT,
        customerMobile TEXT,

        gstNo TEXT,

        paymentMode TEXT,
        taxType TEXT,
        billType TEXT,

        subtotal REAL DEFAULT 0,
        discount REAL DEFAULT 0,
        taxableAmount REAL DEFAULT 0,

        sgst REAL DEFAULT 0,
        cgst REAL DEFAULT 0,
        igst REAL DEFAULT 0,

        tax REAL DEFAULT 0,

        totalAmount REAL DEFAULT 0,
        paidAmount REAL DEFAULT 0,
        balanceAmount REAL DEFAULT 0,

        status TEXT DEFAULT 'PAID',

        notes TEXT,

        createdAt TEXT
      );
    `);

    console.log("✅ NEWINVOICE TABLE READY");

    // =====================================================
    // NEW INVOICE MIGRATION
    // =====================================================

    try {
      const columns = await database.getAllAsync(
        `PRAGMA table_info(newinvoice)`
      );

      const columnNames = columns.map(
        (column) => column.name
      );

      const requiredInvoiceColumns = [
        ["invoiceNo", "TEXT"],
        ["invoiceDate", "TEXT"],
        ["customerId", "TEXT"],
        ["customerName", "TEXT"],
        ["customerMobile", "TEXT"],
        ["gstNo", "TEXT"],
        ["paymentMode", "TEXT"],
        ["taxType", "TEXT"],
        ["billType", "TEXT"],
        ["subtotal", "REAL DEFAULT 0"],
        ["discount", "REAL DEFAULT 0"],
        ["taxableAmount", "REAL DEFAULT 0"],
        ["sgst", "REAL DEFAULT 0"],
        ["cgst", "REAL DEFAULT 0"],
        ["igst", "REAL DEFAULT 0"],
        ["tax", "REAL DEFAULT 0"],
        ["totalAmount", "REAL DEFAULT 0"],
        ["paidAmount", "REAL DEFAULT 0"],
        ["balanceAmount", "REAL DEFAULT 0"],
        ["status", "TEXT DEFAULT 'PAID'"],
        ["notes", "TEXT"],
        ["createdAt", "TEXT"],
      ];

      for (
        const [columnName, columnType]
        of requiredInvoiceColumns
      ) {
        if (!columnNames.includes(columnName)) {
          await executeInitSQL(database, "INIT SQL STEP 8", `
            ALTER TABLE newinvoice
            ADD COLUMN ${columnName} ${columnType};
          `);

          console.log(
            `✅ Added invoice column: ${columnName}`
          );
        }
      }
    } catch (error) {
      console.log(
        "❌ NEWINVOICE MIGRATION ERROR:",
        error
      );
    }

    // =====================================================
    // NEW INVOICE ITEMS
    // =====================================================

    await executeInitSQL(database, "INIT SQL STEP 9", `
      CREATE TABLE IF NOT EXISTS newinvoice_items (
        id TEXT PRIMARY KEY NOT NULL,

        invoiceId TEXT NOT NULL,

        productId TEXT,

        productcode TEXT,
        productName TEXT,
        productimage TEXT,

        category TEXT,
        subcategory TEXT,

        quantity REAL DEFAULT 0,
        rate REAL DEFAULT 0,
        amount REAL DEFAULT 0,

        unit TEXT,
        uom TEXT,

        discount REAL DEFAULT 0,
        taxableAmount REAL DEFAULT 0,

        sgst REAL DEFAULT 0,
        cgst REAL DEFAULT 0,
        igst REAL DEFAULT 0,

        taxAmount REAL DEFAULT 0,
        totalAmount REAL DEFAULT 0,

        FOREIGN KEY (invoiceId)
          REFERENCES newinvoice(id)
          ON DELETE CASCADE
      );
    `);

    console.log(
      "✅ NEWINVOICE_ITEMS TABLE READY"
    );

    // =====================================================
    // LEDGER
    // =====================================================


    await executeInitSQL(database, "INIT SQL STEP 10", `
  CREATE TABLE IF NOT EXISTS ledger (
    id TEXT PRIMARY KEY NOT NULL,

    memberId TEXT,
    ledgerType TEXT,
    accountGroup TEXT,
    accountType TEXT,

    nameEnglish TEXT,
    nameTamil TEXT,

    creditPoints TEXT DEFAULT '0',
    category TEXT,
    amount REAL DEFAULT 0,

    gst TEXT,
    taxType TEXT,

    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,

    mobile TEXT,
    altMobile1 TEXT,
    altMobile2 TEXT,

    officialEmail TEXT,
    personalEmail TEXT,

    businesssinceyear TEXT,

    pan TEXT,
    aadhar TEXT,

    creditLimit TEXT,
    creditDays TEXT,

    dob TEXT,
    bloodGroup TEXT,

    openingBalance REAL DEFAULT 0,
    balanceType TEXT,

    createdAt TEXT
  );
`);



// =====================================================
// LEDGER MIGRATION
// =====================================================

const ledgerColumns = [
  ["memberId", "TEXT"],
  ["ledgerType", "TEXT"],
  ["accountGroup", "TEXT"],
  ["accountType", "TEXT"],

  ["nameEnglish", "TEXT"],
  ["nameTamil", "TEXT"],

  ["creditPoints", "TEXT"],
  ["category", "TEXT"],
  ["amount", "REAL DEFAULT 0"],

  ["gst", "TEXT"],
  ["taxType", "TEXT"],

  ["address", "TEXT"],
  ["city", "TEXT"],
  ["state", "TEXT"],
  ["pincode", "TEXT"],

  ["mobile", "TEXT"],
  ["altMobile1", "TEXT"],
  ["altMobile2", "TEXT"],

  ["officialEmail", "TEXT"],
  ["personalEmail", "TEXT"],

  ["businesssinceyear", "TEXT"],

  ["pan", "TEXT"],
  ["aadhar", "TEXT"],

  ["creditLimit", "TEXT"],
  ["creditDays", "TEXT"],

  ["dob", "TEXT"],
  ["bloodGroup", "TEXT"],

  ["openingBalance", "REAL DEFAULT 0"],
  ["balanceType", "TEXT"],

  ["createdAt", "TEXT"],
];

for (const [
  columnName,
  columnType,
] of ledgerColumns) {

  try {

    await executeInitSQL(database, "INIT SQL STEP 11", `
      ALTER TABLE ledger
      ADD COLUMN ${columnName} ${columnType};
    `);

    console.log(
      `✅ Added ledger.${columnName}`
    );

  } catch (error) {

    const message =
      String(error?.message || error);

    if (
      message.includes(
        "duplicate column name"
      )
    ) {

      console.log(
        `ℹ️ ledger.${columnName} already exists`
      );

    } else {

      console.log(
        `⚠️ Migration ${columnName}:`,
        error
      );
    }
  }
}




 const createPurchaseTables = async (database) => {
  try {
    await executeInitSQL(database, "INIT SQL STEP 12", `
      CREATE TABLE IF NOT EXISTS purchases (
        id TEXT PRIMARY KEY,
        purchaseNo INTEGER,
        billNo TEXT,
        supplier TEXT,
        purchaseMobileNo TEXT,
        ledger TEXT,
        gstNo TEXT,
        taxType TEXT,
        paidType TEXT,
        billType TEXT,
        purchaseType TEXT,
        date TEXT,
        subtotal REAL DEFAULT 0,
        discount REAL DEFAULT 0,
        tax REAL DEFAULT 0,
        sgst REAL DEFAULT 0,
        cgst REAL DEFAULT 0,
        igst REAL DEFAULT 0,
        total REAL DEFAULT 0,
        createdAt TEXT,
        isSynced INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS purchase_items (
        id TEXT PRIMARY KEY,
        purchaseNo TEXT,
        billNo TEXT,
        product TEXT,
        qty REAL DEFAULT 0,
        rate REAL DEFAULT 0,
        amount REAL DEFAULT 0,
        batch TEXT,
        unit TEXT,
        uom TEXT,
        weight TEXT,
        stockquantity REAL DEFAULT 0,
        netRate REAL DEFAULT 0,
        sgst REAL DEFAULT 0,
        cgst REAL DEFAULT 0,
        igst REAL DEFAULT 0,
        createdAt TEXT
      );
    `);

    // Check old database schema
    const columns = await database.getAllAsync(`
      PRAGMA table_info(purchase_items);
    `);

    const hasBillNo = columns.some(
      column => column.name === "billNo"
    );

    if (!hasBillNo) {
      await executeInitSQL(database, "INIT SQL STEP 13", `
        ALTER TABLE purchase_items
        ADD COLUMN billNo TEXT;
      `);

      console.log(
        "✅ Added billNo column"
      );
    }

    console.log(
      "✅ PURCHASE TABLES READY"
    );

  } catch (error) {

    console.log(
      "❌ CREATE PURCHASE TABLES ERROR:",
      error
    );

    throw error;
  }
};

    // Purchase tables must be created before their indexes/queries are used.
    await createPurchaseTables(database);

    // =====================================================
    // SALES RETURN TABLES
    // These tables are required by getFullReport(),
    // deleteSalesReturn(), and saveSalesReturn().
    // =====================================================

    await executeInitSQL(database, "INIT SQL STEP 14", `
      CREATE TABLE IF NOT EXISTS sales_returns (
        id TEXT PRIMARY KEY NOT NULL,
        date TEXT,
        invoiceNo INTEGER DEFAULT 0,
        customer TEXT,
        ledger TEXT,
        salesType TEXT,
        paidType TEXT,
        state TEXT,
        city TEXT,
        cashDiscount REAL DEFAULT 0,
        actualAmount REAL DEFAULT 0,
        discountPercent REAL DEFAULT 0,
        grossAmount REAL DEFAULT 0,
        netAmount REAL DEFAULT 0,
        previousBalance REAL DEFAULT 0,
        total REAL DEFAULT 0,
        createdAt TEXT,
        isSynced INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS sales_return_items (
        id TEXT PRIMARY KEY NOT NULL,
        salesReturnId TEXT,
        product TEXT,
        qty REAL DEFAULT 0,
        rate REAL DEFAULT 0,
        amount REAL DEFAULT 0,
        batch TEXT,
        unit TEXT,
        uom TEXT,
        weight TEXT,
        netRate REAL DEFAULT 0,
        sgst REAL DEFAULT 0,
        cgst REAL DEFAULT 0,
        igst REAL DEFAULT 0,
        createdAt TEXT
      );
    `);

    // =====================================================
    // SALES RETURN SCHEMA MIGRATION
    // CREATE TABLE IF NOT EXISTS does not update old databases.
    // Add isSynced safely without deleting existing sales returns.
    // =====================================================
    const salesReturnColumns = await database.getAllAsync(
      `PRAGMA table_info(sales_returns)`
    );

    const hasSalesReturnIsSynced = salesReturnColumns.some(
      (column) => column.name === "isSynced"
    );

    if (!hasSalesReturnIsSynced) {
      await executeInitSQL(database, "INIT SQL STEP 15", `
        ALTER TABLE sales_returns
        ADD COLUMN isSynced INTEGER NOT NULL DEFAULT 0;
      `);
      console.log("✅ Added sales_returns.isSynced");
    } else {
      console.log("ℹ️ sales_returns.isSynced already exists");
    }

    console.log("✅ SALES RETURN TABLES READY");

    // =====================================================
    // PURCHASE RETURN TABLES
    // Required by getFullReport() and purchase return APIs.
    // =====================================================

    await executeInitSQL(database, "INIT SQL STEP 16", `
  CREATE TABLE IF NOT EXISTS purchase_returns (
    id TEXT PRIMARY KEY NOT NULL,

    date TEXT,
    purchaseNo INTEGER DEFAULT 0,
    invoiceNo INTEGER DEFAULT 0,
    billNo TEXT,

    supplier TEXT,
    ledger TEXT,
    customer TEXT,

    purchaseType TEXT,
    paidType TEXT,

    state TEXT,
    city TEXT,

    vehicleNo TEXT,
    customerName TEXT,

    cashDiscount REAL DEFAULT 0,
    actualAmount REAL DEFAULT 0,
    discountPercent REAL DEFAULT 0,
    discountAmount REAL DEFAULT 0,

    grossAmount REAL DEFAULT 0,
    netAmount REAL DEFAULT 0,
    previousBalance REAL DEFAULT 0,

    subtotal REAL DEFAULT 0,
    total REAL DEFAULT 0,

    createdAt TEXT,
    isSynced INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS purchase_return_items (
    id TEXT PRIMARY KEY NOT NULL,
    purchaseReturnId TEXT,
    purchaseNo TEXT,
    billNo TEXT,
    product TEXT,
    qty REAL DEFAULT 0,
    rate REAL DEFAULT 0,
    amount REAL DEFAULT 0,
    batch TEXT,
    unit TEXT,
    uom TEXT,
    weight TEXT,
    stockquantity REAL DEFAULT 0,
    netRate REAL DEFAULT 0,
    sgst REAL DEFAULT 0,
    cgst REAL DEFAULT 0,
    igst REAL DEFAULT 0,
    createdAt TEXT
  );
`);


// =====================================================
// PURCHASE RETURNS MIGRATION
// Preserve existing purchase return records.
// Add only columns that are missing.
// =====================================================

const purchaseReturnColumns = await database.getAllAsync(
  `PRAGMA table_info(purchase_returns)`
);

const existingPurchaseReturnColumns = purchaseReturnColumns.map(
  column => column.name
);

const requiredPurchaseReturnColumns = [
  ["purchaseNo", "INTEGER DEFAULT 0"],
  ["invoiceNo", "INTEGER DEFAULT 0"],
  ["billNo", "TEXT"],
  ["supplier", "TEXT"],
  ["ledger", "TEXT"],
  ["customer", "TEXT"],
  ["purchaseType", "TEXT"],
  ["paidType", "TEXT"],
  ["state", "TEXT"],
  ["city", "TEXT"],
  ["vehicleNo", "TEXT"],
  ["customerName", "TEXT"],
  ["cashDiscount", "REAL DEFAULT 0"],
  ["actualAmount", "REAL DEFAULT 0"],
  ["discountPercent", "REAL DEFAULT 0"],
  ["discountAmount", "REAL DEFAULT 0"],
  ["grossAmount", "REAL DEFAULT 0"],
  ["netAmount", "REAL DEFAULT 0"],
  ["previousBalance", "REAL DEFAULT 0"],
  ["subtotal", "REAL DEFAULT 0"],
  ["total", "REAL DEFAULT 0"],
  ["createdAt", "TEXT"],
  ["isSynced", "INTEGER NOT NULL DEFAULT 0"],
];

for (const [columnName, columnType] of requiredPurchaseReturnColumns) {
  if (!existingPurchaseReturnColumns.includes(columnName)) {
    await executeInitSQL(
      database,
      `PURCHASE RETURN MIGRATION: ${columnName}`,
      `ALTER TABLE purchase_returns ADD COLUMN ${columnName} ${columnType};`
    );

    console.log(`✅ Added purchase_returns.${columnName}`);
  } else {
    console.log(`ℹ️ purchase_returns.${columnName} already exists`);
  }
}

console.log("✅ PURCHASE RETURNS MIGRATION COMPLETED");

    console.log("✅ PURCHASE RETURN TABLES READY");

    await executeInitSQL(database, "INIT SQL STEP 17", `
      CREATE INDEX IF NOT EXISTS idx_products_barcode
      ON products(barcode);
    `);

    await executeInitSQL(database, "INIT SQL STEP 18", `
      CREATE INDEX IF NOT EXISTS idx_products_productcode
      ON products(productcode);
    `);

    await executeInitSQL(database, "INIT SQL STEP 19", `
      CREATE INDEX IF NOT EXISTS idx_products_category
      ON products(category);
    `);

    await executeInitSQL(database, "INIT SQL STEP 20", `
      CREATE INDEX IF NOT EXISTS idx_invoice_date
      ON newinvoice(invoiceDate);
    `);

    await executeInitSQL(database, "INIT SQL STEP 21", `
      CREATE INDEX IF NOT EXISTS idx_invoice_customer
      ON newinvoice(customerId);
    `);

    await executeInitSQL(database, "INIT SQL STEP 22", `
      CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice
      ON newinvoice_items(invoiceId);
    `);

    await executeInitSQL(database, "INIT SQL STEP 23", `
      CREATE INDEX IF NOT EXISTS idx_sales_return_date
      ON sales_returns(date);
    `);

    await executeInitSQL(database, "INIT SQL STEP 24", `
      CREATE INDEX IF NOT EXISTS idx_sales_return_items_header
      ON sales_return_items(salesReturnId);
    `);

    await executeInitSQL(database, "INIT SQL STEP 25", `
      CREATE INDEX IF NOT EXISTS idx_purchase_return_date
      ON purchase_returns(date);
    `);

    await executeInitSQL(database, "INIT SQL STEP 26", `
      CREATE INDEX IF NOT EXISTS idx_purchase_return_items_header
      ON purchase_return_items(purchaseReturnId);
    `);

    await executeInitSQL(database, "INIT SQL STEP 27", `
      CREATE INDEX IF NOT EXISTS idx_ledger_member
      ON ledger(memberId);
    `);

    await executeInitSQL(database, "INIT SQL STEP 28", `
      CREATE INDEX IF NOT EXISTS idx_ledger_type
      ON ledger(ledgerType);
    `);

    console.log("✅ DATABASE INDEXES READY");

    // =====================================================
    // VERIFY ALL TABLES
    // =====================================================

    const tables =
      await database.getAllAsync(`
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
        ORDER BY name
      `);

    console.log(
      "📋 SQLITE TABLES:",
      tables
    );

    // =====================================================
    // VERIFY PRODUCTS
    // =====================================================

    const productColumns =
      await database.getAllAsync(
        `PRAGMA table_info(products)`
      );

    console.log(
      "📦 PRODUCT COLUMNS:",
      productColumns
    );

   const productCount = await database.getFirstAsync(`
  SELECT COUNT(*) AS count
  FROM products
`);

console.log(
  "📦 PRODUCT COUNT:",
  productCount?.count ?? 0
);

    // =====================================================
    // VERIFY NEW INVOICE
    // =====================================================

   const invoiceCount = await database.getFirstAsync(`
  SELECT COUNT(*) AS count
  FROM newinvoice
`);

console.log(
  "🧾 NEW INVOICE COUNT:",
  invoiceCount?.count ?? 0
);

    // =====================================================
    // VERIFY INVOICE ITEMS
    // =====================================================

    const invoiceItemCount = await database.getFirstAsync(`
  SELECT COUNT(*) AS count
  FROM newinvoice_items
`);

console.log(
  "📦 NEW INVOICE ITEM COUNT:",
  invoiceItemCount?.count ?? 0
);
    // =====================================================
    // FINAL
    // =====================================================

    console.log(
      "✅ ALL DATABASE TABLES READY"
    );

    return true;

  } catch (error) {

    console.error(
      "❌ initializeDatabase ERROR:",
      error?.message || error
    );
    console.error("❌ INITIALIZATION STACK:", error?.stack || "No stack");

    return false;
  }
};


// =====================
// 📦 SAVE PRODUCT
// =====================

export const saveProduct = async (product) => {
  try {
    const database = await getDB();

    if (!database) {
      throw new Error("SQLite database is not available.");
    }

    if (!product || !product.id) {
      throw new Error("Product ID is missing.");
    }

    // Ensure older app1.db installations have the product-detail columns.
    const existingColumns = await database.getAllAsync(
      `PRAGMA table_info(products)`
    );
    const columnNames = existingColumns.map(column => column.name);

    const requiredColumns = [
      ["productcode", "TEXT"],
      ["productenglishname", "TEXT"],
      ["producttamilName", "TEXT"],
      ["category", "TEXT"],
      ["subcategory", "TEXT"],
      ["producttype", "TEXT"],
      ["subtype", "TEXT"],
      ["brandname", "TEXT"],
      ["unittype", "TEXT"],
      ["uom", "TEXT"],
      ["purchase", "REAL DEFAULT 0"],
      ["profit", "REAL DEFAULT 0"],
      ["loss", "REAL DEFAULT 0"],
      ["wholesale", "REAL DEFAULT 0"],
      ["retail", "REAL DEFAULT 0"],
      ["mrp", "REAL DEFAULT 0"],
      ["discount", "REAL DEFAULT 0"],
      ["finalprice", "REAL DEFAULT 0"],
      ["stockquantity", "REAL DEFAULT 0"],
      ["stockvalue", "REAL DEFAULT 0"],
      ["maxqty", "REAL DEFAULT 0"],
      ["productimage", "TEXT"],
      ["barcode", "TEXT"],
      ["sellingcode", "TEXT"],
      ["competitor1", "TEXT"],
      ["competitor2", "TEXT"],
      ["mfd", "TEXT"],
      ["exp", "TEXT"],
      ["bestbefore", "TEXT"],
      ["pricetype", "TEXT"],
      ["sgst", "REAL DEFAULT 0"],
      ["cgst", "REAL DEFAULT 0"],
      ["igst", "REAL DEFAULT 0"],
      ["hsn", "TEXT"],
      ["hsncode", "TEXT"],
      ["createdAt", "TEXT"],
    ];

    for (const [columnName, columnType] of requiredColumns) {
      if (!columnNames.includes(columnName)) {
        await database.execAsync(
          `ALTER TABLE products ADD COLUMN ${columnName} ${columnType};`
        );
      }
    }

    const columns = [
      "id",
      "productcode",
      "productenglishname",
      "producttamilName",
      "category",
      "subcategory",
      "producttype",
      "subtype",
      "brandname",
      "unittype",
      "uom",
      "purchase",
      "profit",
      "loss",
      "wholesale",
      "retail",
      "mrp",
      "discount",
      "finalprice",
      "stockquantity",
      "stockvalue",
      "maxqty",
      "productimage",
      "barcode",
      "sellingcode",
      "competitor1",
      "competitor2",
      "mfd",
      "exp",
      "bestbefore",
      "pricetype",
      "sgst",
      "cgst",
      "igst",
      "hsn",
      "hsncode",
      "createdAt",
    ];

    const values = [
      String(product.id),
      String(product.productcode ?? ""),
      String(product.productenglishname ?? "").trim(),
      String(product.producttamilName ?? "").trim(),
      String(product.category ?? "").trim(),
      String(product.subcategory ?? "").trim(),
      String(product.producttype ?? "").trim(),
      String(product.subtype ?? "").trim(),
      String(product.brandname ?? "").trim(),
      String(product.unittype ?? "").trim(),
      String(product.uom ?? "Piece").trim(),
      Number(product.purchase ?? 0),
      Number(product.profit ?? 0),
      Number(product.loss ?? 0),
      Number(product.wholesale ?? 0),
      Number(product.retail ?? 0),
      Number(product.mrp ?? 0),
      Number(product.discount ?? 0),
      Number(product.finalprice ?? 0),
      Number(product.stockquantity ?? 0),
      Number(product.stockvalue ?? 0),
      Number(product.maxqty ?? 0),
      String(product.productimage ?? ""),
      String(product.barcode ?? ""),
      String(product.sellingcode ?? ""),
      String(product.competitor1 ?? ""),
      String(product.competitor2 ?? ""),
      String(product.mfd ?? ""),
      String(product.exp ?? ""),
      String(product.bestbefore ?? ""),
      String(product.pricetype ?? product.priceType ?? "Exclusive"),
      Number(product.sgst ?? 0),
      Number(product.cgst ?? 0),
      Number(product.igst ?? 0),
      String(product.hsn ?? ""),
      String(product.hsncode ?? ""),
      String(product.createdAt ?? new Date().toISOString()),
    ];

    if (columns.length !== values.length) {
      throw new Error(
        `Product save mismatch: ${columns.length} columns, ${values.length} values.`
      );
    }

    const placeholders = columns.map(() => "?").join(", ");
    const sql = `
      INSERT OR REPLACE INTO products (${columns.join(", ")})
      VALUES (${placeholders})
    `;

    console.log("📦 SAVING PRODUCT DETAILS:", {
      id: product.id,
      productenglishname: product.productenglishname,
      category: product.category,
      subcategory: product.subcategory,
      producttype: product.producttype,
      subtype: product.subtype,
      columnCount: columns.length,
      valueCount: values.length,
    });

    await database.runAsync(sql, values);

    // Read the row back to confirm SQLite stored the product details.
    const savedProduct = await database.getFirstAsync(
      `SELECT id, productenglishname, category, subcategory,
              producttype, subtype, brandname
       FROM products
       WHERE id = ?
       LIMIT 1`,
      [String(product.id)]
    );

    if (!savedProduct) {
      throw new Error("Product insert completed but the saved row could not be found.");
    }

    console.log("✅ PRODUCT DETAILS VERIFIED IN SQLITE:", savedProduct);
    return true;
  } catch (error) {
    console.error("❌ saveProduct FAILED:", error?.message || error);
    console.error("❌ saveProduct STACK:", error?.stack || "No stack");
    throw error;
  }
};


// =====================
// 📦 GET PRODUCTS
// =====================

export const getProducts = async () => {

  try {

    const db =
      await getDB();

    if (!db) {

      console.log(
        '❌ DB NOT FOUND'
      );

      return [];

    }

    const result =

      await db.getAllAsync(

        `
        SELECT *

        FROM products

        ORDER BY

        CAST(productcode AS INTEGER)

        DESC
        `

      );

    console.log(
      '📦 PRODUCTS:',
      result
    );

    return Array.isArray(result)

      ? result

      : [];

  } catch (e) {

    console.log(

      '❌ PRODUCT LOAD ERROR:',

      e

    );

    return [];

  }

};


export const deleteProduct = async (
  id
) => {

  try {

    const db = await getDB();

    if (!db) {

      console.log(
        '❌ DB NOT FOUND'
      );

      return false;

    }

    await db.runAsync(

      `
      DELETE FROM products
      WHERE id = ?
      `,

      [String(id)]

    );

    console.log(
      '✅ Product Deleted'
    );

    return true;

  } catch (e) {

    console.log(
      '❌ deleteProduct:',
      e
    );

    return false;

  }

};

// =====================
// 🔍 SEARCH PRODUCTS
// =====================

export const searchProductsByFirstLetter = async (
  text = ""
) => {

  try {

    const database =
      await getDB();

    if (!database) {

      console.log(
        "❌ SEARCH: DATABASE NOT FOUND"
      );

      return [];
    }

    const searchText =
      String(text ?? "")
        .trim();

    console.log(
      "🔍 SEARCH PRODUCT:",
      searchText
    );

    // =================================================
    // EMPTY
    // =================================================

    if (!searchText) {

      return [];
    }

    const keyword =
      `%${searchText}%`;

    const result =
      await database.getAllAsync(
        `
        SELECT *

        FROM products

        WHERE

          LOWER(
            COALESCE(
              productenglishname,
              ''
            )
          ) LIKE LOWER(?)

          OR LOWER(
            COALESCE(
              producttamilName,
              ''
            )
          ) LIKE LOWER(?)

          OR LOWER(
            COALESCE(
              productcode,
              ''
            )
          ) LIKE LOWER(?)

          OR LOWER(
            COALESCE(
              barcode,
              ''
            )
          ) LIKE LOWER(?)

          OR LOWER(
            COALESCE(
              sellingcode,
              ''
            )
          ) LIKE LOWER(?)

        ORDER BY
          productenglishname
          COLLATE NOCASE ASC

        LIMIT 50
        `,
        [
          keyword,
          keyword,
          keyword,
          keyword,
          keyword,
        ]
      );

    console.log(
      "📦 SEARCH RESULT:",
      result?.length || 0
    );

    return Array.isArray(result)
      ? result
      : [];

  } catch (error) {

    console.log(
      "❌ SEARCH ERROR:",
      error
    );

    return [];
  }
};

// =====================
// 📒 GET LEDGERS
// =====================

export const getLedgers = async () => {

  try {

    const db = await getDB();

    if (!db) {
      return [];
    }

    const result = await db.getAllAsync(

      `
      SELECT *
      FROM ledger
      ORDER BY id DESC
      `

    );

    return Array.isArray(result)
      ? result
      : [];

  } catch (e) {

    console.log(
      '❌ getLedgers:',
      e
    );

    return [];

  }

};


//customer getledger 


export const getCustomers = async () => {

  try {

    const db = await getDB();

    if (!db) {
      return [];
    }

    const result = await db.getAllAsync(

      `
      SELECT *
      FROM ledger
      WHERE ledgerType = 'Customer'
      ORDER BY id DESC
      `

    );

    return Array.isArray(result)
      ? result
      : [];

  } catch (e) {

    console.log(
      "❌ getCustomers:",
      e
    );

    return [];

  }

};


//party getledger


export const getParty = async () => {

  try {

    const db = await getDB();

    if (!db) {
      return [];
    }

    const result = await db.getAllAsync(

      `
      SELECT *
      FROM ledger
      WHERE ledgerType = 'Party'
      ORDER BY id DESC
      `

    );

    return Array.isArray(result)
      ? result
      : [];

  } catch (e) {

    console.log(
      "❌ getParty:",
      e
    );

    return [];

  }

};

export const saveLedger = async (ledger) => {
  try {
    const db = await getDB();

    if (!db) {
      console.log("❌ DB NOT INITIALIZED");
      return false;
    }

    // =================================================
    // SAFE VALUE HELPERS
    // =================================================

    const text = (value) => {
      if (
        value === null ||
        value === undefined
      ) {
        return "";
      }

      return String(value);
    };

    const number = (value) => {
      const n = Number(value);

      return Number.isFinite(n)
        ? n
        : 0;
    };

    // =================================================
    // VALUES
    // =================================================

    const id =
      text(ledger?.id) ||
      `${Date.now()}`;

    const memberId =
      text(ledger?.memberId);

    const ledgerType =
      text(ledger?.ledgerType);

    const accountGroup =
      text(ledger?.accountGroup);

    const accountType =
      text(ledger?.accountType);

    const nameEnglish =
      text(ledger?.nameEnglish);

    const nameTamil =
      text(ledger?.nameTamil);

    const creditPoints =
      text(ledger?.creditPoints || "0");

    const category =
      text(ledger?.category);

    const amount =
      number(ledger?.amount);

    const gst =
      text(ledger?.gst);

    const taxType =
      text(ledger?.taxType);

    const address =
      text(ledger?.address);

    const city =
      text(ledger?.city);

    const state =
      text(ledger?.state);

    const pincode =
      text(ledger?.pincode);

    const mobile =
      text(ledger?.mobile);

    const altMobile1 =
      text(ledger?.altMobile1);

    const altMobile2 =
      text(ledger?.altMobile2);

    const officialEmail =
      text(ledger?.officialEmail);

    const personalEmail =
      text(ledger?.personalEmail);

    const businesssinceyear =
      text(ledger?.businesssinceyear);

    const pan =
      text(ledger?.pan);

    const aadhar =
      text(ledger?.aadhar);

    const creditLimit =
      text(ledger?.creditLimit);

    const creditDays =
      text(ledger?.creditDays);

    const dob =
      text(ledger?.dob);

    const bloodGroup =
      text(ledger?.bloodGroup);

    const openingBalance =
      number(ledger?.openingBalance);

    const balanceType =
      text(ledger?.balanceType);

    const createdAt =
      text(
        ledger?.createdAt ||
        new Date().toISOString()
      );

    // =================================================
    // QUERY
    // =================================================

    const query = `
      INSERT OR REPLACE INTO ledger (
        id,
        memberId,
        ledgerType,
        accountGroup,
        accountType,
        nameEnglish,
        nameTamil,
        creditPoints,
        category,
        amount,
        gst,
        taxType,
        address,
        city,
        state,
        pincode,
        mobile,
        altMobile1,
        altMobile2,
        officialEmail,
        personalEmail,
        businesssinceyear,
        pan,
        aadhar,
        creditLimit,
        creditDays,
        dob,
        bloodGroup,
        openingBalance,
        balanceType,
        createdAt
      )
      VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?
      )
    `;

    // =================================================
    // PARAMS
    // =================================================

    const params = [
      id,
      memberId,
      ledgerType,
      accountGroup,
      accountType,

      nameEnglish,
      nameTamil,

      creditPoints,
      category,
      amount,

      gst,
      taxType,

      address,
      city,
      state,
      pincode,

      mobile,
      altMobile1,
      altMobile2,

      officialEmail,
      personalEmail,

      businesssinceyear,

      pan,
      aadhar,

      creditLimit,
      creditDays,

      dob,
      bloodGroup,

      openingBalance,
      balanceType,

      createdAt,
    ];

    // =================================================
    // DEBUG
    // =================================================

    console.log(
      "===================================="
    );

    console.log(
      "📦 SAVE LEDGER"
    );

    console.log(
      "ID:",
      id
    );

    console.log(
      "memberId:",
      memberId
    );

    console.log(
      "ledgerType:",
      ledgerType
    );

    console.log(
      "📊 PARAM COUNT:",
      params.length
    );

    console.log(
      "📊 PARAM TYPES:",
      params.map(
        (value) => typeof value
      )
    );

    // =================================================
    // VALIDATE
    // =================================================

    if (params.length !== 31) {
      console.log(
        "❌ INVALID PARAM COUNT:",
        params.length
      );

      return false;
    }

    const hasNullOrUndefined =
      params.some(
        (value) =>
          value === null ||
          value === undefined
      );

    if (hasNullOrUndefined) {
      console.log(
        "❌ NULL/UNDEFINED VALUE FOUND"
      );

      return false;
    }

    // =================================================
    // INSERT
    // =================================================

    await db.runAsync(
      query,
      ...params
    );

    console.log(
      "✅ LEDGER SAVED SUCCESSFULLY"
    );

    console.log(
      "===================================="
    );

    return true;

  } catch (error) {

    console.log(
      "❌ saveLedger ERROR:",
      error
    );

    return false;
  }
};


export const updateLedger = async (
  id,
  ledger
) => {

  try {

    const db = await getDB();

    if (!db) {
      console.log(
        "❌ DB NOT INITIALIZED"
      );

      return false;
    }

    if (!id) {
      console.log(
        "❌ INVALID LEDGER ID"
      );

      return false;
    }

    const query = `
      UPDATE ledger SET

        memberId = ?,
        ledgerType = ?,
        accountGroup = ?,
        accountType = ?,

        nameEnglish = ?,
        nameTamil = ?,

        creditPoints = ?,
        category = ?,
        amount = ?,

        gst = ?,
        taxType = ?,

        address = ?,
        city = ?,
        state = ?,
        pincode = ?,

        mobile = ?,
        altMobile1 = ?,
        altMobile2 = ?,

        officialEmail = ?,
        personalEmail = ?,

        businesssinceyear = ?,

        pan = ?,
        aadhar = ?,

        creditLimit = ?,
        creditDays = ?,

        dob = ?,
        bloodGroup = ?,

        openingBalance = ?,
        balanceType = ?,

        createdAt = ?

      WHERE id = ?
    `;

    const params = [

      ledger?.memberId ?? "",

      ledger?.ledgerType ?? "",

      ledger?.accountGroup ?? "",

      ledger?.accountType ?? "",


      ledger?.nameEnglish ?? "",

      ledger?.nameTamil ?? "",


      ledger?.creditPoints ?? "0",

      ledger?.category ?? "",

      Number(
        ledger?.amount ?? 0
      ),


      ledger?.gst ?? "",

      ledger?.taxType ?? "",


      ledger?.address ?? "",

      ledger?.city ?? "",

      ledger?.state ?? "",

      ledger?.pincode ?? "",


      ledger?.mobile ?? "",

      ledger?.altMobile1 ?? "",

      ledger?.altMobile2 ?? "",


      ledger?.officialEmail ?? "",

      ledger?.personalEmail ?? "",


      ledger?.businesssinceyear ?? "",


      ledger?.pan ?? "",

      ledger?.aadhar ?? "",


      ledger?.creditLimit ?? "",

      ledger?.creditDays ?? "",


      ledger?.dob ?? "",

      ledger?.bloodGroup ?? "",


      Number(
        ledger?.openingBalance ?? 0
      ),

      ledger?.balanceType ?? "",


      ledger?.createdAt ??
        new Date().toISOString(),


      id,
    ];

    console.log(
      "📦 UPDATE PARAM COUNT:",
      params.length
    );

    await db.runAsync(
      query,
      ...params
    );

    console.log(
      "✅ Ledger Updated"
    );

    return true;

  } catch (error) {

    console.log(
      "❌ updateLedger ERROR:",
      error
    );

    return false;
  }
};

// =====================
// 👤 GET LOGGED IN USER
// =====================

export const getLoggedInUser = async () => {

  try {

    const database =
      await getDB();

    if (!database) {

      console.log(
        "❌ getLoggedInUser: DATABASE NOT FOUND"
      );

      return null;
    }

    const result =
      await database.getFirstAsync(
        `
        SELECT *

        FROM users

        WHERE isLoggedIn = 1

        LIMIT 1
        `
      );

    console.log(
      "👤 SQLITE USER:",
      result
    );

    return result || null;

  } catch (error) {

    console.log(
      "❌ getLoggedInUser ERROR:",
      error
    );

    return null;
  }
};

// =====================
// 💾 INSERT USER
// =====================

export const insertUser = async (
  id,
  email,
  password,
  deviceId
) => {

  try {

    const database =
      await getDB();

    if (!database) {

      console.log(
        "❌ insertUser: DATABASE NOT FOUND"
      );

      return false;
    }

    const cleanId =
      String(id || "").trim();

    const cleanEmail =
      String(email || "")
        .trim()
        .toLowerCase();

    const cleanPassword =
      String(password || "");

    const cleanDeviceId =
      String(deviceId || "");

    if (!cleanId || !cleanEmail) {

      console.log(
        "❌ insertUser: INVALID USER DATA"
      );

      return false;
    }

    // =================================================
    // CLEAR PREVIOUS LOCAL SESSION
    // =================================================

    await database.runAsync(`
      UPDATE users
      SET isLoggedIn = 0
    `);

    // =================================================
    // INSERT / UPDATE USER
    // =================================================

    await database.runAsync(
      `
      INSERT OR REPLACE INTO users (

        id,

        email,

        password,

        deviceId,

        isLoggedIn

      )

      VALUES (?, ?, ?, ?, ?)
      `,
      [
        cleanId,
        cleanEmail,
        cleanPassword,
        cleanDeviceId,
        1,
      ]
    );

    console.log(
      "✅ SQLITE USER SAVED:",
      cleanEmail
    );

    return true;

  } catch (error) {

    console.log(
      "❌ insertUser ERROR:",
      error
    );

    return false;
  }
};


export const getProductById = async (
  id
) => {

  try {

    const productId =
      String(id || "").trim();

    if (!productId) {

      console.log(
        "❌ INVALID PRODUCT ID"
      );

      return null;
    }

    const database =
      await getDB();

    if (!database) {

      console.log(
        "❌ getProductById: DATABASE NOT FOUND"
      );

      return null;
    }

    const product =
      await database.getFirstAsync(
        `
        SELECT *

        FROM products

        WHERE id = ?

        LIMIT 1
        `,
        [productId]
      );

    console.log(
      "📦 PRODUCT:",
      product
    );

    return product || null;

  } catch (error) {

    console.log(
      "❌ getProductById ERROR:",
      error
    );

    return null;
  }
};




export const deleteInvoice = async (
  id
) => {

  try {

    const db = await getDB();

    if (!db) {

      console.log(
        '❌ DB NOT FOUND'
      );

      return false;

    }

    // =========================
    // TRANSACTION
    // =========================

    await db.withExclusiveTransactionAsync(

      async () => {

        // =========================
        // GET INVOICE ITEMS
        // =========================

        const items =

          await db.getAllAsync(

            `
            SELECT *

            FROM newinvoice_items

            WHERE invoiceId = ?
            `,

            [String(id)]

          );

        // =========================
        // RESTORE STOCK
        // =========================

        if (
          Array.isArray(items)
        ) {

          for (const item of items) {

            const currentProduct =

              await db.getFirstAsync(

                `
                SELECT

                  stockquantity,
                  purchase

                FROM products

                WHERE productenglishname = ?
                `,

                [

                  String(
                    item?.product || ''
                  )

                ]

              );

            const currentQty =

              Number(
                currentProduct?.stockquantity || 0
              );

            const purchase =

              Number(
                currentProduct?.purchase || 0
              );

            // =========================
            // RESTORE QTY
            // =========================

            const restoreQty =

              Number(
                item?.qty || 0
              );

            const newQty =

              currentQty + restoreQty;

            const newStockValue =

              newQty * purchase;

            // =========================
            // UPDATE STOCK
            // =========================

            await db.runAsync(

              `
              UPDATE products

              SET

                stockquantity = ?,

                stockvalue = ?

              WHERE

                productenglishname = ?
              `,

              [

                Number(newQty || 0),

                Number(
                  newStockValue || 0
                ),

                String(
                  item?.product || ''
                ),

              ]

            );

            console.log(
              '✅ STOCK RESTORED:',
              item?.product,
              newQty
            );

          }

        }

        // =========================
        // DELETE ITEMS
        // =========================

        await db.runAsync(

          `
          DELETE FROM newinvoice_items

          WHERE invoiceId = ?
          `,

          [String(id)]

        );

        // =========================
        // DELETE INVOICE
        // =========================

        await db.runAsync(

          `
          DELETE FROM newinvoice

          WHERE id = ?
          `,

          [String(id)]

        );

      }

    );

    console.log(
      '✅ Invoice Deleted'
    );

    return true;

  } catch (e) {

    console.log(
      '❌ deleteInvoice:',
      e
    );

    return false;

  }

};






export const getInvoiceById = async (id) => {

  try {

    const db = await getDB();

    if (!db) {
      return null;
    }

    // HEADER
    const invoice =

      await db.getFirstAsync(

        `
        SELECT *

        FROM newinvoice

        WHERE id = ?
        `,

        [String(id)]

      );

    if (!invoice) {
      return null;
    }

    // ITEMS
    const items =

      await db.getAllAsync(

        `
        SELECT *

        FROM newinvoice_items

        WHERE invoiceId = ?
        `,

        [String(id)]

      );

    return {

      ...invoice,

      items: Array.isArray(items)
        ? items
        : [],

    };

  } catch (e) {

    console.log(
      '❌ getInvoiceById:',
      e
    );

    return null;
  }

};


// =====================================================
// SAVE PURCHASE
// =====================================================

export const savePurchase = async (
  purchase,
  items = []
) => {
  try {
    const db = await getDB();

    if (!db) {
      console.log("❌ DATABASE NOT FOUND");
      return false;
    }

    // =====================================================
    // CREATE TABLES
    // =====================================================

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS purchases (
        id TEXT PRIMARY KEY,
        purchaseNo INTEGER,
        billNo TEXT,
        supplier TEXT,
        purchaseMobileNo TEXT,
        ledger TEXT,
        gstNo TEXT,
        taxType TEXT,
        paidType TEXT,
        billType TEXT,
        purchaseType TEXT,
        date TEXT,
        subtotal REAL DEFAULT 0,
        discount REAL DEFAULT 0,
        tax REAL DEFAULT 0,
        sgst REAL DEFAULT 0,
        cgst REAL DEFAULT 0,
        igst REAL DEFAULT 0,
        total REAL DEFAULT 0,
        createdAt TEXT,
        isSynced INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS purchase_items (
        id TEXT PRIMARY KEY,
        purchaseNo TEXT,
        billNo TEXT,
        product TEXT,
        qty REAL DEFAULT 0,
        rate REAL DEFAULT 0,
        amount REAL DEFAULT 0,
        batch TEXT,
        unit TEXT,
        uom TEXT,
        weight TEXT,
        stockquantity REAL DEFAULT 0,
        netRate REAL DEFAULT 0,
        sgst REAL DEFAULT 0,
        cgst REAL DEFAULT 0,
        igst REAL DEFAULT 0,
        createdAt TEXT
      );
    `);

    console.log("✅ PURCHASE TABLES READY");

    // =====================================================
    // CHECK purchase_items BILLNO
    // =====================================================

    const columns = await db.getAllAsync(`
      PRAGMA table_info(purchase_items);
    `);

    const hasBillNo = columns.some(
      column => column.name === "billNo"
    );

    if (!hasBillNo) {
      await db.execAsync(`
        ALTER TABLE purchase_items
        ADD COLUMN billNo TEXT;
      `);

      console.log(
        "✅ billNo column added"
      );
    }

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!purchase) {
      console.log(
        "❌ PURCHASE DATA EMPTY"
      );

      return false;
    }

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      console.log(
        "❌ PURCHASE ITEMS EMPTY"
      );

      return false;
    }

    // =====================================================
    // PURCHASE ID
    // =====================================================

    const purchaseId =
      String(
        purchase.id || ""
      ).trim();

    const purchaseNo =
      Number(
        purchase.purchaseNo || 0
      );

    if (!purchaseId) {
      console.log(
        "❌ INVALID PURCHASE ID"
      );

      return false;
    }

    if (purchaseNo <= 0) {
      console.log(
        "❌ INVALID PURCHASE NUMBER"
      );

      return false;
    }

    // =====================================================
    // DUPLICATE PURCHASE
    // =====================================================

    const existingPurchase =
      await db.getFirstAsync(
        `
        SELECT id
        FROM purchases
        WHERE id = ?
        LIMIT 1
        `,
        [purchaseId]
      );

    if (existingPurchase) {
      console.log(
        "⚠️ PURCHASE ALREADY EXISTS:",
        purchaseId
      );

      return false;
    }

    // =====================================================
    // TRANSACTION
    // =====================================================

    await db.withTransactionAsync(
      async () => {

        // =================================================
        // SAVE PURCHASE HEADER
        // =================================================

        await db.runAsync(
          `
          INSERT INTO purchases (
            id,
            purchaseNo,
            billNo,
            supplier,
            purchaseMobileNo,
            ledger,
            gstNo,
            taxType,
            paidType,
            billType,
            purchaseType,
            date,
            subtotal,
            discount,
            tax,
            sgst,
            cgst,
            igst,
            total,
            createdAt,
            isSynced
          )
          VALUES (
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?
          )
          `,
          [
            purchaseId,
            purchaseNo,

            String(
              purchase.billNo || ""
            ),

            String(
              purchase.supplier || ""
            ),

            String(
              purchase.purchaseMobileNo || ""
            ),

            String(
              purchase.ledger ||
              "COMMON CASH"
            ),

            String(
              purchase.gstNo || ""
            ),

            String(
              purchase.taxType || ""
            ),

            String(
              purchase.paidType ||
              "CASH"
            ),

            String(
              purchase.billType || ""
            ),

            String(
              purchase.purchaseType || ""
            ),

            String(
              purchase.date || ""
            ),

            Number(
              purchase.subtotal || 0
            ),

            Number(
              purchase.discount || 0
            ),

            Number(
              purchase.tax || 0
            ),

            Number(
              purchase.sgst || 0
            ),

            Number(
              purchase.cgst || 0
            ),

            Number(
              purchase.igst || 0
            ),

            Number(
              purchase.total || 0
            ),

            String(
              purchase.createdAt ||
              new Date().toISOString()
            ),

            0
          ]
        );

        console.log(
          "✅ PURCHASE HEADER SAVED:",
          purchaseId
        );

        // =================================================
        // SAVE ITEMS
        // =================================================

        for (
          let index = 0;
          index < items.length;
          index++
        ) {

          const item =
            items[index];

          const productName =
            String(
              item?.product || ""
            ).trim();

          if (!productName) {
            continue;
          }

          const purchaseQty =
            Number(
              item?.qty || 0
            );

          const purchaseRate =
            Number(
              item?.purchase ??
              item?.pRate ??
              item?.rate ??
              0
            );

          const sellingRate =
            Number(
              item?.rate || 0
            );

          if (purchaseQty <= 0) {
            throw new Error(
              `Invalid quantity: ${productName}`
            );
          }

          if (purchaseRate <= 0) {
            throw new Error(
              `Invalid purchase rate: ${productName}`
            );
          }

          // ===============================================
          // PURCHASE ITEM
          // ===============================================

          const purchaseItemId =
            String(
              item?.id ||
              `${purchaseId}_${index}_${Date.now()}`
            );

          await db.runAsync(
            `
            INSERT INTO purchase_items (
              id,
              purchaseNo,
              billNo,
              product,
              qty,
              rate,
              amount,
              batch,
              unit,
              uom,
              weight,
              stockquantity,
              netRate,
              sgst,
              cgst,
              igst,
              createdAt
            )
            VALUES (
              ?, ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?
            )
            `,
            [
              purchaseItemId,

              String(
                purchaseNo
              ),

              String(
                purchase.billNo || ""
              ),

              productName,

              purchaseQty,

              sellingRate,

              purchaseQty *
              sellingRate,

              String(
                item?.batch || ""
              ),

              String(
                item?.unit || ""
              ),

              String(
                item?.uom ||
                item?.unittype ||
                ""
              ),

              String(
                item?.weight || ""
              ),

              purchaseQty,

              Number(
                item?.netRate ??
                purchaseRate
              ),

              Number(
                item?.sgst || 0
              ),

              Number(
                item?.cgst || 0
              ),

              Number(
                item?.igst || 0
              ),

              new Date().toISOString()
            ]
          );

          console.log(
            "✅ PURCHASE ITEM SAVED:",
            productName
          );

          // =================================================
          // FIND PRODUCT
          // =================================================

          const productData =
            await db.getFirstAsync(
              `
              SELECT
                id,
                productenglishname,
                stockquantity,
                stockvalue,
                purchase
              FROM products
              WHERE
                TRIM(productenglishname)
                = TRIM(?)
              LIMIT 1
              `,
              [productName]
            );

          // =================================================
          // EXISTING PRODUCT
          // =================================================

          if (productData) {

            const oldStock =
              Number(
                productData.stockquantity || 0
              );

            const newStock =
              oldStock +
              purchaseQty;

            const stockValue =
              newStock *
              purchaseRate;

            await db.runAsync(
              `
              UPDATE products
              SET
                stockquantity = ?,
                stockvalue = ?,
                purchase = ?
              WHERE id = ?
              `,
              [
                newStock,
                stockValue,
                purchaseRate,
                productData.id
              ]
            );

            console.log(
              "✅ EXISTING PRODUCT UPDATED",
              {
                product: productName,
                oldStock,
                purchaseQty,
                newStock,
                purchaseRate,
                stockValue
              }
            );

          } else {

            // =================================================
            // NEW PRODUCT
            // =================================================

            const codeResult =
              await db.getFirstAsync(
                `
                SELECT
                  COALESCE(
                    MAX(
                      CAST(productcode AS INTEGER)
                    ),
                    0
                  ) AS maxCode
                FROM products
                `
              );

            const nextProductCode =
              Number(
                codeResult?.maxCode || 0
              ) + 1;

            const newProductId =
              `${Date.now()}_${Math.random()
                .toString(36)
                .substring(2, 8)}`;

            const stockValue =
              purchaseQty *
              purchaseRate;

            await db.runAsync(
              `
              INSERT INTO products (
                id,
                productcode,
                productenglishname,
                producttamilName,
                category,
                subcategory,
                producttype,
                subtype,
                brandname,
                unittype,
                uom,
                purchase,
                profit,
                loss,
                wholesale,
                retail,
                mrp,
                discount,
                finalprice,
                stockquantity,
                stockvalue,
                maxqty,
                productimage,
                barcode,
                sellingcode,
                competitor1,
                competitor2,
                mfd,
                exp,
                bestbefore,
                pricetype,
                sgst,
                cgst,
                igst,
                hsn,
                hsncode,
                createdAt
              )
              VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
              )
              `,
              [
                newProductId,

                String(
                  item?.productcode ||
                  nextProductCode
                ),

                productName,

                String(
                  item?.producttamilName || ""
                ),

                String(
                  item?.category || ""
                ),

                String(
                  item?.subcategory || ""
                ),

                String(
                  item?.producttype || ""
                ),

                String(
                  item?.subtype || ""
                ),

                String(
                  item?.brandname || ""
                ),

                String(
                  item?.unittype ||
                  item?.uom ||
                  ""
                ),

                String(
                  item?.uom || ""
                ),

                purchaseRate,

                Number(
                  item?.profit || 0
                ),

                Number(
                  item?.loss || 0
                ),

                Number(
                  item?.wholesale ??
                  sellingRate
                ),

                Number(
                  item?.retail ??
                  sellingRate
                ),

                Number(
                  item?.mrp ??
                  sellingRate
                ),

                Number(
                  item?.discount || 0
                ),

                Number(
                  item?.finalprice ??
                  sellingRate
                ),

                purchaseQty,

                stockValue,

                Number(
                  item?.maxqty || 0
                ),

                String(
                  item?.productimage || ""
                ),

                String(
                  item?.barcode || ""
                ),

                String(
                  item?.sellingcode || ""
                ),

                String(
                  item?.competitor1 || ""
                ),

                String(
                  item?.competitor2 || ""
                ),

                String(
                  item?.mfd || ""
                ),

                String(
                  item?.exp || ""
                ),

                String(
                  item?.bestbefore || ""
                ),

                String(
                  item?.pricetype ??
                  item?.priceType ??
                  ""
                ),

                Number(
                  item?.sgst || 0
                ),

                Number(
                  item?.cgst || 0
                ),

                Number(
                  item?.igst || 0
                ),

                String(
                  item?.hsn || ""
                ),

                String(
                  item?.hsncode || ""
                ),

                new Date().toISOString()
              ]
            );

            console.log(
              "✅ NEW PRODUCT CREATED:",
              productName
            );
          }
        }
      }
    );

    console.log(
      "🎉 PURCHASE SAVED SUCCESSFULLY:",
      purchaseId
    );

    return true;

  } catch (error) {

    console.log(
      "===================================="
    );

    console.log(
      "❌ SAVE PURCHASE ERROR"
    );

    console.log(
      "MESSAGE:",
      error?.message
    );

    console.log(
      "ERROR:",
      error
    );

    console.log(
      "===================================="
    );

    return false;
  }
};


export const searchProducts = async (
  searchText
) => {

  const db = await getDB();

  return await db.getAllAsync(

    `
    SELECT *
    FROM products
    WHERE productenglishname LIKE ?
    `,

    [
      `%${searchText}%`
    ]

  );

};

export const getPurchases = async () => {

  try {

    const db = await getDB();

    if (!db) {

      console.log(
        '❌ DB NOT FOUND'
      );

      return [];

    }

    const result =

      await db.getAllAsync(

        `
        SELECT *

        FROM purchases

        ORDER BY

          createdAt DESC
        `

      );

    console.log(
      '📦 Purchases:',
      result
    );

    return Array.isArray(result)

      ? result

      : [];

  } catch (e) {

    console.log(
      '❌ getPurchases:',
      e
    );

    return [];

  }

};



export const getPurchaseItems = async (
  purchaseNo
) => {

  const result =
    await db.getAllAsync(
      `
      SELECT *
      FROM purchase_items
      WHERE purchaseNo = ?
      `,
      [String(purchaseNo)]
    );

  return result || [];
};


export const getPurchaseItemsById = async (
  purchaseNo
) => {
  try {
    const db = await getDB();

    if (!db) {
      console.log("❌ DB NOT FOUND");
      return [];
    }

    const result = await db.getAllAsync(
      `
      SELECT *
      FROM purchase_items
      WHERE purchaseNo = ?
      ORDER BY id ASC
      `,
      [String(purchaseNo)]
    );

    console.log(
      "📦 PURCHASE ITEMS:",
      result
    );

    return Array.isArray(result)
      ? result
      : [];

  } catch (error) {
    console.log(
      "❌ getPurchaseItemsById ERROR:",
      error
    );

    return [];
  }
};




export const saveSalesReturn = async (
  salesReturn,
  items = []
) => {
  try {

    // ===================================================
    // DATABASE
    // ===================================================

    const db = await getDB();

    if (!db) {
      console.log("❌ DB NOT FOUND");
      return false;
    }

    // ===================================================
    // CREATE TABLES
    // ===================================================

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS sales_returns (

        id TEXT PRIMARY KEY,

        date TEXT,

        invoiceNo INTEGER DEFAULT 0,

        customer TEXT,

        ledger TEXT,

        salesType TEXT,

        paidType TEXT,

        state TEXT,

        city TEXT,

        cashDiscount REAL DEFAULT 0,

        actualAmount REAL DEFAULT 0,

        discountPercent REAL DEFAULT 0,

        grossAmount REAL DEFAULT 0,

        netAmount REAL DEFAULT 0,

        previousBalance REAL DEFAULT 0,

        total REAL DEFAULT 0,

        createdAt TEXT,

        isSynced INTEGER DEFAULT 0

      );


      CREATE TABLE IF NOT EXISTS sales_return_items (

        id TEXT PRIMARY KEY,

        salesReturnId TEXT,

        product TEXT,

        qty REAL DEFAULT 0,

        rate REAL DEFAULT 0,

        amount REAL DEFAULT 0,

        batch TEXT,

        unit TEXT,

        uom TEXT,

        weight TEXT,

        netRate REAL DEFAULT 0,

        sgst REAL DEFAULT 0,

        cgst REAL DEFAULT 0,

        igst REAL DEFAULT 0,

        createdAt TEXT

      );
    `);

    // ===================================================
    // SAFE MIGRATION FOR EXISTING DATABASES
    // ===================================================
    const salesReturnColumns = await db.getAllAsync(
      `PRAGMA table_info(sales_returns)`
    );

    const hasIsSynced = salesReturnColumns.some(
      (column) => column.name === "isSynced"
    );

    if (!hasIsSynced) {
      await db.execAsync(`
        ALTER TABLE sales_returns
        ADD COLUMN isSynced INTEGER NOT NULL DEFAULT 0;
      `);
      console.log("✅ Added missing sales_returns.isSynced column");
    }

    console.log(
      "✅ SALES RETURN TABLES READY"
    );


    // ===================================================
    // VALIDATION
    // ===================================================

    if (!salesReturn) {

      console.log(
        "❌ SALES RETURN DATA EMPTY"
      );

      return false;
    }


    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {

      console.log(
        "❌ SALES RETURN ITEMS EMPTY"
      );

      return false;
    }


    // ===================================================
    // RETURN ID
    // ===================================================

    const returnId =
      String(
        salesReturn.id ||
        Date.now().toString()
      ).trim();


    if (!returnId) {

      console.log(
        "❌ INVALID SALES RETURN ID"
      );

      return false;
    }


    // ===================================================
    // DUPLICATE CHECK
    // ===================================================

    const existingReturn =
      await db.getFirstAsync(
        `
        SELECT id

        FROM sales_returns

        WHERE id = ?

        LIMIT 1
        `,
        [returnId]
      );


    if (existingReturn) {

      console.log(
        "⚠️ SALES RETURN ALREADY EXISTS:",
        returnId
      );

      return false;
    }


    // ===================================================
    // TRANSACTION
    // ===================================================

    await db.withTransactionAsync(
      async () => {

        // ===============================================
        // SAVE SALES RETURN HEADER
        // ===============================================

        await db.runAsync(
          `
          INSERT INTO sales_returns (

            id,
            date,
            invoiceNo,
            customer,
            ledger,
            salesType,
            paidType,
            state,
            city,
            cashDiscount,
            actualAmount,
            discountPercent,
            grossAmount,
            netAmount,
            previousBalance,
            total,
            createdAt,
            isSynced

          )

          VALUES (

            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?

          )
          `,
          [

            returnId,

            String(
              salesReturn.date || ""
            ),

            Number(
              salesReturn.invoiceNo || 0
            ),

            String(
              salesReturn.customer || ""
            ),

            String(
              salesReturn.ledger || ""
            ),

            String(
              salesReturn.salesType || ""
            ),

            String(
              salesReturn.paidType || ""
            ),

            String(
              salesReturn.state || ""
            ),

            String(
              salesReturn.city || ""
            ),

            Number(
              salesReturn.cashDiscount || 0
            ),

            Number(
              salesReturn.actualAmount || 0
            ),

            Number(
              salesReturn.discountPercent || 0
            ),

            Number(
              salesReturn.grossAmount || 0
            ),

            Number(
              salesReturn.netAmount || 0
            ),

            Number(
              salesReturn.previousBalance || 0
            ),

            Number(
              salesReturn.total || 0
            ),

            String(
              salesReturn.createdAt ||
              new Date().toISOString()
            ),

            0

          ]
        );


        console.log(
          "✅ SALES RETURN HEADER SAVED:",
          returnId
        );


        // ===============================================
        // SAVE ITEMS
        // ===============================================

        for (
          let index = 0;
          index < items.length;
          index++
        ) {

          const item =
            items[index];


          // =============================================
          // PRODUCT NAME
          // =============================================

          const productName =
            String(
              item?.product || ""
            ).trim();


          if (!productName) {
            continue;
          }


          // =============================================
          // RETURN QUANTITY
          // =============================================

          const returnQty =
            Number(
              item?.qty || 0
            );


          if (returnQty <= 0) {

            throw new Error(
              `Invalid return quantity for ${productName}`
            );
          }


          // =============================================
          // RATE
          // =============================================

          const rate =
            Number(
              item?.rate || 0
            );


          // =============================================
          // AMOUNT
          // =============================================

          const amount =
            Number(
              item?.amount ??
              (
                returnQty *
                rate
              )
            );


          // =============================================
          // ITEM ID
          // =============================================

          const itemId =
            String(
              item?.id ||
              `${returnId}_${index}_${Date.now()}`
            );


          // =============================================
          // SAVE ITEM
          // =============================================

          await db.runAsync(
            `
            INSERT INTO sales_return_items (

              id,
              salesReturnId,
              product,
              qty,
              rate,
              amount,
              batch,
              unit,
              uom,
              weight,
              netRate,
              sgst,
              cgst,
              igst,
              createdAt

            )

            VALUES (

              ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?

            )
            `,
            [

              itemId,

              returnId,

              productName,

              returnQty,

              rate,

              amount,

              String(
                item?.batch || ""
              ),

              String(
                item?.unit || ""
              ),

              String(
                item?.uom || ""
              ),

              String(
                item?.weight || ""
              ),

              Number(
                item?.netRate || 0
              ),

              Number(
                item?.sgst || 0
              ),

              Number(
                item?.cgst || 0
              ),

              Number(
                item?.igst || 0
              ),

              new Date().toISOString()

            ]
          );


          console.log(
            "✅ SALES RETURN ITEM SAVED:",
            productName,
            "QTY:",
            returnQty
          );


          // =============================================
          // FIND EXISTING PRODUCT
          // =============================================

          const productData =
            await db.getFirstAsync(
              `
              SELECT

                id,
                productenglishname,
                stockquantity,
                stockvalue,
                purchase

              FROM products

              WHERE
                TRIM(productenglishname)
                =
                TRIM(?)

              LIMIT 1
              `,
              [
                productName
              ]
            );


          // =============================================
          // PRODUCT NOT FOUND
          // =============================================

          if (!productData) {

            throw new Error(
              `Product not found: ${productName}`
            );
          }


          // =============================================
          // OLD STOCK
          // =============================================

          const oldStock =
            Number(
              productData.stockquantity || 0
            );


          // =============================================
          // PURCHASE RATE
          // =============================================

          const purchaseRate =
            Number(
              productData.purchase || 0
            );


          // =============================================
          // SALES RETURN
          // STOCK INCREASE
          // =============================================

          const newStock =
            oldStock +
            returnQty;


          // =============================================
          // NEW STOCK VALUE
          // =============================================

          const newStockValue =
            newStock *
            purchaseRate;


          // =============================================
          // UPDATE PRODUCT
          // =============================================

          await db.runAsync(
            `
            UPDATE products

            SET

              stockquantity = ?,

              stockvalue = ?

            WHERE id = ?
            `,
            [

              newStock,

              newStockValue,

              productData.id

            ]
          );


          // =============================================
          // LOG
          // =============================================

          console.log(
            "===================================="
          );

          console.log(
            "↩️ SALES RETURN STOCK UPDATED"
          );

          console.log(
            "Product:",
            productName
          );

          console.log(
            "Product ID:",
            productData.id
          );

          console.log(
            "Old Stock:",
            oldStock
          );

          console.log(
            "Return Qty:",
            returnQty
          );

          console.log(
            "New Stock:",
            newStock
          );

          console.log(
            "Purchase Rate:",
            purchaseRate
          );

          console.log(
            "New Stock Value:",
            newStockValue
          );

          console.log(
            "===================================="
          );
        }
      }
    );


    // ===================================================
    // SUCCESS
    // ===================================================

    console.log(
      "===================================="
    );

    console.log(
      "🎉 SALES RETURN SAVED SUCCESSFULLY"
    );

    console.log(
      "RETURN ID:",
      returnId
    );

    console.log(
      "===================================="
    );


    return true;


  } catch (error) {

    // ===================================================
    // ERROR
    // ===================================================

    console.log(
      "===================================="
    );

    console.log(
      "❌ SAVE SALES RETURN ERROR"
    );

    console.log(
      "MESSAGE:",
      error?.message
    );

    console.log(
      "ERROR:",
      error
    );

    console.log(
      "===================================="
    );


    return false;
  }
};


export const getSalesReturns = async () => {

  try {

    const db = await getDB();

    if (!db) {

      console.log(
        '❌ DB NOT FOUND'
      );

      return [];

    }

    const result =

      await db.getAllAsync(

        `
        SELECT *

        FROM sales_returns

        ORDER BY

          createdAt DESC
        `

      );

    console.log(
      '📦 SALES RETURNS:',
      result
    );

    return Array.isArray(result)

      ? result

      : [];

  } catch (e) {

    console.log(
      '❌ getSalesReturns:',
      e
    );

    return [];

  }

};


export const savePurchaseReturn = async (
  purchaseReturn,
  items = []
) => {

  try {

    // ===================================================
    // DATABASE
    // ===================================================

    const db = await getDB();

    if (!db) {

      console.log(
        "❌ DB NOT FOUND"
      );

      return false;
    }

    // ===================================================
    // CREATE TABLES
    // ===================================================

    await db.execAsync(`

      CREATE TABLE IF NOT EXISTS purchase_returns (

        id TEXT PRIMARY KEY,

        date TEXT,

        invoiceNo INTEGER DEFAULT 0,

        ledger TEXT,

        customer TEXT,

        paidType TEXT,

        state TEXT,

        city TEXT,

        vehicleNo TEXT,

        customerName TEXT,

        discountPercent REAL DEFAULT 0,

        discountAmount REAL DEFAULT 0,

        subtotal REAL DEFAULT 0,

        total REAL DEFAULT 0,

        createdAt TEXT,

        isSynced INTEGER DEFAULT 0

      );


      CREATE TABLE IF NOT EXISTS purchase_return_items (

        id TEXT PRIMARY KEY,

        purchaseReturnId TEXT,

        product TEXT,

        qty REAL DEFAULT 0,

        rate REAL DEFAULT 0,

        amount REAL DEFAULT 0,

        batch TEXT,

        unit TEXT,

        uom TEXT,

        weight TEXT,

        netRate REAL DEFAULT 0,

        sgst REAL DEFAULT 0,

        cgst REAL DEFAULT 0,

        igst REAL DEFAULT 0,

        createdAt TEXT,

        FOREIGN KEY (
          purchaseReturnId
        )
        REFERENCES purchase_returns(id)
        ON DELETE CASCADE

      );

    `);

    console.log(
      "✅ PURCHASE RETURN TABLES READY"
    );


    // ===================================================
    // VALIDATION
    // ===================================================

    if (!purchaseReturn) {

      console.log(
        "❌ PURCHASE RETURN DATA EMPTY"
      );

      return false;
    }


    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {

      console.log(
        "❌ PURCHASE RETURN ITEMS EMPTY"
      );

      return false;
    }


    // ===================================================
    // PURCHASE RETURN ID
    // ===================================================

    const returnId =
      String(
        purchaseReturn.id || ""
      ).trim();


    if (!returnId) {

      console.log(
        "❌ INVALID PURCHASE RETURN ID"
      );

      return false;
    }


    // ===================================================
    // DUPLICATE CHECK
    // ===================================================

    const existingReturn =
      await db.getFirstAsync(
        `
        SELECT id

        FROM purchase_returns

        WHERE id = ?

        LIMIT 1
        `,
        [returnId]
      );


    if (existingReturn) {

      console.log(
        "⚠️ PURCHASE RETURN ALREADY EXISTS:",
        returnId
      );

      return false;
    }


    // ===================================================
    // TRANSACTION
    // ===================================================

    await db.withTransactionAsync(
      async () => {

        // ===============================================
        // SAVE PURCHASE RETURN HEADER
        // ===============================================

        await db.runAsync(
          `
          INSERT INTO purchase_returns (

            id,
            date,
            invoiceNo,
            ledger,
            customer,
            paidType,
            state,
            city,
            vehicleNo,
            customerName,
            discountPercent,
            discountAmount,
            subtotal,
            total,
            createdAt,
            isSynced

          )

          VALUES (

            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?

          )
          `,
          [

            returnId,

            String(
              purchaseReturn.date || ""
            ),

            Number(
              purchaseReturn.invoiceNo || 0
            ),

            String(
              purchaseReturn.ledger || ""
            ),

            String(
              purchaseReturn.customer || ""
            ),

            String(
              purchaseReturn.paidType || ""
            ),

            String(
              purchaseReturn.state || ""
            ),

            String(
              purchaseReturn.city || ""
            ),

            String(
              purchaseReturn.vehicleNo || ""
            ),

            String(
              purchaseReturn.customerName || ""
            ),

            Number(
              purchaseReturn.discountPercent || 0
            ),

            Number(
              purchaseReturn.discountAmount || 0
            ),

            Number(
              purchaseReturn.subtotal || 0
            ),

            Number(
              purchaseReturn.total || 0
            ),

            String(
              purchaseReturn.createdAt ||
              new Date().toISOString()
            ),

            0

          ]
        );


        console.log(
          "✅ PURCHASE RETURN HEADER SAVED:",
          returnId
        );


        // ===============================================
        // SAVE ITEMS
        // ===============================================

        for (
          let index = 0;
          index < items.length;
          index++
        ) {

          const item =
            items[index];


          // =============================================
          // PRODUCT NAME
          // =============================================

          const productName =
            String(
              item?.product || ""
            ).trim();


          if (!productName) {
            continue;
          }


          // =============================================
          // QUANTITY
          // =============================================

          const returnQty =
            Number(
              item?.qty || 0
            );


          if (returnQty <= 0) {

            throw new Error(
              `Invalid return quantity for ${productName}`
            );
          }


          // =============================================
          // RATE
          // =============================================

          const returnRate =
            Number(
              item?.rate || 0
            );


          // =============================================
          // AMOUNT
          // =============================================

          const amount =
            Number(
              item?.amount ??
              (
                returnQty *
                returnRate
              )
            );


          // =============================================
          // ITEM ID
          // =============================================

          const itemId =
            String(
              item?.id ||
              `${returnId}_${index}_${Date.now()}`
            );


          // =============================================
          // SAVE RETURN ITEM
          // =============================================

          await db.runAsync(
            `
            INSERT INTO purchase_return_items (

              id,
              purchaseReturnId,
              product,
              qty,
              rate,
              amount,
              batch,
              unit,
              uom,
              weight,
              netRate,
              sgst,
              cgst,
              igst,
              createdAt

            )

            VALUES (

              ?, ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?, ?,
              ?, ?, ?

            )
            `,
            [

              itemId,

              returnId,

              productName,

              returnQty,

              returnRate,

              amount,

              String(
                item?.batch || ""
              ),

              String(
                item?.unit || ""
              ),

              String(
                item?.uom || ""
              ),

              String(
                item?.weight || ""
              ),

              Number(
                item?.netRate || 0
              ),

              Number(
                item?.sgst || 0
              ),

              Number(
                item?.cgst || 0
              ),

              Number(
                item?.igst || 0
              ),

              new Date().toISOString()

            ]
          );


          console.log(
            "✅ RETURN ITEM SAVED:",
            productName,
            "QTY:",
            returnQty
          );


          // =============================================
          // FIND PRODUCT
          // =============================================

          const productData =
            await db.getFirstAsync(
              `
              SELECT

                id,
                productenglishname,
                stockquantity,
                stockvalue,
                purchase

              FROM products

              WHERE
                TRIM(productenglishname)
                =
                TRIM(?)

              LIMIT 1
              `,
              [
                productName
              ]
            );


          // =============================================
          // PRODUCT NOT FOUND
          // =============================================

          if (!productData) {

            console.log(
              "⚠️ PRODUCT NOT FOUND:",
              productName
            );

            throw new Error(
              `Product not found: ${productName}`
            );
          }


          // =============================================
          // OLD STOCK
          // =============================================

          const oldStock =
            Number(
              productData.stockquantity || 0
            );


          // =============================================
          // PURCHASE RATE
          // =============================================

          const purchasePrice =
            Number(
              productData.purchase || 0
            );


          // =============================================
          // NEW STOCK
          // =============================================

          const newStock =
            oldStock -
            returnQty;


          // =============================================
          // PREVENT NEGATIVE STOCK
          // =============================================

          if (newStock < 0) {

            throw new Error(
              `Insufficient stock for ${productName}. Available: ${oldStock}, Return: ${returnQty}`
            );
          }


          // =============================================
          // NEW STOCK VALUE
          // =============================================

          const newStockValue =
            newStock *
            purchasePrice;


          // =============================================
          // UPDATE PRODUCT STOCK
          // =============================================

          await db.runAsync(
            `
            UPDATE products

            SET

              stockquantity = ?,

              stockvalue = ?

            WHERE id = ?
            `,
            [

              newStock,

              newStockValue,

              productData.id

            ]
          );


          console.log(
            "===================================="
          );

          console.log(
            "✅ PURCHASE RETURN STOCK UPDATED"
          );

          console.log(
            "Product:",
            productName
          );

          console.log(
            "Product ID:",
            productData.id
          );

          console.log(
            "Old Stock:",
            oldStock
          );

          console.log(
            "Return Qty:",
            returnQty
          );

          console.log(
            "New Stock:",
            newStock
          );

          console.log(
            "Purchase Rate:",
            purchasePrice
          );

          console.log(
            "New Stock Value:",
            newStockValue
          );

          console.log(
            "===================================="
          );

        }

      }
    );


    // ===================================================
    // SUCCESS
    // ===================================================

    console.log(
      "===================================="
    );

    console.log(
      "🎉 PURCHASE RETURN SAVED SUCCESSFULLY"
    );

    console.log(
      "RETURN ID:",
      returnId
    );

    console.log(
      "===================================="
    );


    return true;


  } catch (error) {

    // ===================================================
    // ERROR
    // ===================================================

    console.log(
      "===================================="
    );

    console.log(
      "❌ SAVE PURCHASE RETURN ERROR"
    );

    console.log(
      "MESSAGE:",
      error?.message
    );

    console.log(
      "ERROR:",
      error
    );

    console.log(
      "===================================="
    );


    return false;
  }

};

export const getPurchaseReturns = async () => {

  try {

    const db = await getDB();

    if (!db) {

      console.log(
        '❌ DB NOT FOUND'
      );

      return [];

    }

    const result =

      await db.getAllAsync(

        `
        SELECT *

        FROM purchase_returns

        ORDER BY

          createdAt DESC
        `

      );

    console.log(
      '📦 PURCHASE RETURNS:',
      result
    );

    return Array.isArray(result)

      ? result

      : [];

  } catch (e) {

    console.log(
      '❌ getPurchaseReturns:',
      e
    );

    return [];

  }

};


export const getFullReport = async (from, to) => {
  const emptyReport = {
    invoices: [],
    purchases: [],
    salesReturns: [],
    purchaseReturns: [],

    salesTotal: 0,
    purchaseTotal: 0,
    salesReturnTotal: 0,
    purchaseReturnTotal: 0,
    profit: 0,
  };

  try {
    const db = await getDB();

    if (!db) {
      console.log("❌ DATABASE NOT FOUND");
      return emptyReport;
    }

    // =====================================================
    // DATE PARSER
    // =====================================================

    const parseDate = (value) => {
      if (
        value === null ||
        value === undefined ||
        value === ""
      ) {
        return null;
      }

      // Date object
      if (value instanceof Date) {
        const date = new Date(value);

        return isNaN(date.getTime())
          ? null
          : date;
      }

      // Numeric timestamp
      if (typeof value === "number") {
        const date = new Date(value);

        return isNaN(date.getTime())
          ? null
          : date;
      }

      const valueString =
        String(value).trim();

      if (!valueString) {
        return null;
      }

      // =====================================================
      // DD/MM/YYYY
      // =====================================================

      let match =
        valueString.match(
          /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
        );

      if (match) {
        const day =
          Number(match[1]);

        const month =
          Number(match[2]) - 1;

        const year =
          Number(match[3]);

        const date =
          new Date(
            year,
            month,
            day
          );

        if (
          date.getFullYear() !== year ||
          date.getMonth() !== month ||
          date.getDate() !== day
        ) {
          return null;
        }

        return date;
      }

      // =====================================================
      // DD-MM-YYYY
      // =====================================================

      match =
        valueString.match(
          /^(\d{1,2})-(\d{1,2})-(\d{4})$/
        );

      if (match) {
        const day =
          Number(match[1]);

        const month =
          Number(match[2]) - 1;

        const year =
          Number(match[3]);

        const date =
          new Date(
            year,
            month,
            day
          );

        if (
          date.getFullYear() !== year ||
          date.getMonth() !== month ||
          date.getDate() !== day
        ) {
          return null;
        }

        return date;
      }

      // =====================================================
      // YYYY-MM-DD
      // =====================================================

      match =
        valueString.match(
          /^(\d{4})-(\d{1,2})-(\d{1,2})$/
        );

      if (match) {
        const year =
          Number(match[1]);

        const month =
          Number(match[2]) - 1;

        const day =
          Number(match[3]);

        const date =
          new Date(
            year,
            month,
            day
          );

        if (
          date.getFullYear() !== year ||
          date.getMonth() !== month ||
          date.getDate() !== day
        ) {
          return null;
        }

        return date;
      }

      // =====================================================
      // ISO / OTHER
      // =====================================================

      const parsed =
        new Date(valueString);

      if (isNaN(parsed.getTime())) {
        return null;
      }

      return parsed;
    };

    // =====================================================
    // REPORT DATES
    // =====================================================

    const fromDate =
      parseDate(from);

    const toDate =
      parseDate(to);

    console.log(
      "📅 REPORT INPUT:",
      {
        from,
        to,
      }
    );

    if (!fromDate || !toDate) {
      console.log(
        "❌ INVALID REPORT DATE",
        {
          from,
          to,
        }
      );

      return emptyReport;
    }

    // Start of day
    fromDate.setHours(
      0,
      0,
      0,
      0
    );

    // End of day
    toDate.setHours(
      23,
      59,
      59,
      999
    );

    if (fromDate > toDate) {
      console.log(
        "❌ FROM DATE IS GREATER THAN TO DATE"
      );

      return emptyReport;
    }

    console.log(
      "===================================="
    );

    console.log(
      "📊 REPORT DATE RANGE"
    );

    console.log(
      "FROM:",
      fromDate.toString()
    );

    console.log(
      "TO:",
      toDate.toString()
    );

    console.log(
      "===================================="
    );

    // =====================================================
    // GET ALL INVOICES
    // =====================================================

    const invoices =
      await db.getAllAsync(`
        SELECT *
        FROM newinvoice
        ORDER BY invoiceNo DESC
      `);

    // =====================================================
    // GET ALL PURCHASES
    // =====================================================

    const purchases =
      await db.getAllAsync(`
        SELECT *
        FROM purchases
        ORDER BY purchaseNo DESC
      `);

    // =====================================================
    // GET SALES RETURNS
    // =====================================================

    const salesReturns =
      await db.getAllAsync(`
        SELECT *
        FROM sales_returns
        ORDER BY id DESC
      `);

    // =====================================================
    // GET PURCHASE RETURNS
    // =====================================================

    const purchaseReturns =
      await db.getAllAsync(`
        SELECT *
        FROM purchase_returns
        ORDER BY id DESC
      `);

    console.log(
      "📄 ALL INVOICES:",
      invoices?.length || 0
    );

    console.log(
      "📦 ALL PURCHASES:",
      purchases?.length || 0
    );

    console.log(
      "↩️ ALL SALES RETURNS:",
      salesReturns?.length || 0
    );

    console.log(
      "↩️ ALL PURCHASE RETURNS:",
      purchaseReturns?.length || 0
    );

    // =====================================================
    // DEBUG ALL INVOICES
    // =====================================================

    invoices.forEach((invoice) => {

      console.log(
        "🧾 INVOICE:",
        {
          id: invoice?.id,
          invoiceNo:
            invoice?.invoiceNo,

          invoiceDate:
            invoice?.invoiceDate,

          date:
            invoice?.date,

          createdAt:
            invoice?.createdAt,

          created_at:
            invoice?.created_at,

          totalAmount:
            invoice?.totalAmount,
        }
      );

    });

    // =====================================================
    // DATE RANGE CHECK
    // =====================================================

    const isDateInRange =
      (value) => {

        const date =
          parseDate(value);

        if (!date) {
          return false;
        }

        date.setHours(
          0,
          0,
          0,
          0
        );

        const checkDate =
          date.getTime();

        const startDate =
          new Date(fromDate);

        startDate.setHours(
          0,
          0,
          0,
          0
        );

        const endDate =
          new Date(toDate);

        endDate.setHours(
          23,
          59,
          59,
          999
        );

        return (
          checkDate >=
            startDate.getTime() &&
          checkDate <=
            endDate.getTime()
        );
      };

    // =====================================================
    // FILTER INVOICES
    // =====================================================

    const filteredInvoices =
      invoices.filter(
        (invoice) => {

          /*
           * Support all existing invoice date fields.
           *
           * Priority:
           * invoiceDate
           * date
           * createdAt
           * created_at
           */

          const invoiceDate =
            invoice?.invoiceDate ||
            invoice?.date ||
            invoice?.createdAt ||
            invoice?.created_at;

          const included =
            isDateInRange(
              invoiceDate
            );

          console.log(
            "🔍 INVOICE FILTER:",
            {
              invoiceNo:
                invoice?.invoiceNo,

              invoiceDate,

              totalAmount:
                invoice?.totalAmount,

              included,
            }
          );

          return included;
        }
      );

    // =====================================================
    // FILTER PURCHASES
    // =====================================================

    const filteredPurchases =
      purchases.filter(
        (purchase) => {

          const purchaseDate =
            purchase?.date ||
            purchase?.purchaseDate ||
            purchase?.createdAt ||
            purchase?.created_at;

          return isDateInRange(
            purchaseDate
          );
        }
      );

    // =====================================================
    // FILTER SALES RETURNS
    // =====================================================

    const filteredSalesReturns =
      salesReturns.filter(
        (item) => {

          const returnDate =
            item?.date ||
            item?.returnDate ||
            item?.createdAt ||
            item?.created_at;

          return isDateInRange(
            returnDate
          );
        }
      );

    // =====================================================
    // FILTER PURCHASE RETURNS
    // =====================================================

    const filteredPurchaseReturns =
      purchaseReturns.filter(
        (item) => {

          const returnDate =
            item?.date ||
            item?.returnDate ||
            item?.createdAt ||
            item?.created_at;

          return isDateInRange(
            returnDate
          );
        }
      );

    // =====================================================
    // SALES TOTAL
    // =====================================================

    const salesTotal =
      filteredInvoices.reduce(
        (sum, invoice) => {

          const amount =
            Number(
              invoice?.totalAmount ||
              invoice?.grandTotal ||
              invoice?.total ||
              0
            );

          return (
            sum + amount
          );
        },
        0
      );

    // =====================================================
    // PURCHASE TOTAL
    // =====================================================

    const purchaseTotal =
      filteredPurchases.reduce(
        (sum, purchase) => {

          const amount =
            Number(
              purchase?.total ||
              purchase?.totalAmount ||
              purchase?.grandTotal ||
              0
            );

          return (
            sum + amount
          );
        },
        0
      );

    // =====================================================
    // SALES RETURN TOTAL
    // =====================================================

    const salesReturnTotal =
      filteredSalesReturns.reduce(
        (sum, item) => {

          const amount =
            Number(
              item?.total ||
              item?.totalAmount ||
              0
            );

          return (
            sum + amount
          );
        },
        0
      );

    // =====================================================
    // PURCHASE RETURN TOTAL
    // =====================================================

    const purchaseReturnTotal =
      filteredPurchaseReturns.reduce(
        (sum, item) => {

          const amount =
            Number(
              item?.total ||
              item?.totalAmount ||
              0
            );

          return (
            sum + amount
          );
        },
        0
      );

    // =====================================================
    // PROFIT
    // =====================================================

    const profit =
      salesTotal -
      salesReturnTotal -
      purchaseTotal +
      purchaseReturnTotal;

    // =====================================================
    // ROUND MONEY
    // =====================================================

    const roundMoney =
      (value) => {

        return Number(
          Number(
            value || 0
          ).toFixed(2)
        );

      };

    // =====================================================
    // FINAL REPORT
    // =====================================================

    const finalReport = {

      invoices:
        filteredInvoices,

      purchases:
        filteredPurchases,

      salesReturns:
        filteredSalesReturns,

      purchaseReturns:
        filteredPurchaseReturns,

      salesTotal:
        roundMoney(
          salesTotal
        ),

      purchaseTotal:
        roundMoney(
          purchaseTotal
        ),

      salesReturnTotal:
        roundMoney(
          salesReturnTotal
        ),

      purchaseReturnTotal:
        roundMoney(
          purchaseReturnTotal
        ),

      profit:
        roundMoney(
          profit
        ),

    };

    // =====================================================
    // FINAL LOG
    // =====================================================

    console.log(
      "===================================="
    );

    console.log(
      "📊 FINAL REPORT"
    );

    console.log(
      "INVOICES:",
      finalReport.invoices.length
    );

    console.log(
      "PURCHASES:",
      finalReport.purchases.length
    );

    console.log(
      "SALES RETURNS:",
      finalReport.salesReturns.length
    );

    console.log(
      "PURCHASE RETURNS:",
      finalReport.purchaseReturns.length
    );

    console.log(
      "💰 SALES:",
      finalReport.salesTotal
    );

    console.log(
      "🛒 PURCHASE:",
      finalReport.purchaseTotal
    );

    console.log(
      "↩️ SALES RETURN:",
      finalReport.salesReturnTotal
    );

    console.log(
      "↩️ PURCHASE RETURN:",
      finalReport.purchaseReturnTotal
    );

    console.log(
      "📈 PROFIT:",
      finalReport.profit
    );

    console.log(
      "===================================="
    );

    return finalReport;

  } catch (error) {

    console.log(
      "===================================="
    );

    console.log(
      "❌ getFullReport ERROR"
    );

    console.log(
      "MESSAGE:",
      error?.message
    );

    console.log(
      "ERROR:",
      error
    );

    console.log(
      "===================================="
    );

    return emptyReport;
  }
};


export const deletePurchaseReturn = async (
  id
) => {

  try {

    const db = await getDB();

    if (!db) {
      return false;
    }

    await db.runAsync(
      `
      DELETE FROM purchase_returns
      WHERE id = ?
      `,
      [id]
    );

    console.log(
      "✅ Purchase Return Deleted"
    );

    return true;

  } catch (e) {

    console.log(
      "❌ deletePurchaseReturn:",
      e
    );

    return false;

  }

};



export const getPurchaseReturnById = async (id) => {

  try {

    const db = await getDB();

    if (!db) {
      return null;
    }

    // =========================
    // GET HEADER
    // =========================

    const purchaseReturn =

      await db.getFirstAsync(

        `
        SELECT *

        FROM purchase_returns

        WHERE id = ?
        `,

        [String(id)]

      );

    if (!purchaseReturn) {

      return null;
    }

    // =========================
    // GET ITEMS
    // =========================

    const items =

      await db.getAllAsync(

        `
        SELECT *

        FROM purchase_return_items

        WHERE purchaseReturnId = ?
        `,

        [String(id)]

      );

    return {

      ...purchaseReturn,

      items: Array.isArray(items)
        ? items
        : [],

    };

  } catch (e) {

    console.log(
      '❌ getPurchaseReturnById:',
      e
    );

    return null;
  }

};

export const saveStock = async ({
  stockType,
  fromStock,
  date,
  productName,
  batchNo,
  batch,
  purchaseRate,
  wholesaleProfit,
  wholesalePrice,
  retailProfit,
  retailPrice,
  currentStock,
  stockQty,
  entryType,
  referenceNo,
  transactionNo,
  narration,
}) => {

  try {

    // ✅ IMPORTANT FIX
    const db = await getDB();

    if (!db) {

      console.log(
        '❌ DB NOT FOUND'
      );

      return false;
    }

    const id =
      Date.now().toString();

    const createdAt =
      new Date().toISOString();

    await db.runAsync(

      `
      INSERT INTO stock (

        id,
        stockType,
        fromStock,
        date,
        productName,
        batchNo,
        batch,
        purchaseRate,
        wholesaleProfit,
        wholesalePrice,
        retailProfit,
        retailPrice,
        currentStock,
        stockQty,
        entryType,
        referenceNo,
        transactionNo,
        narration,
        createdAt

      )

      VALUES (

        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?

      )
      `,

      [

        String(id),

        String(stockType || ''),

        String(fromStock || ''),

        String(date || ''),

        String(productName || ''),

        String(batchNo || ''),

        String(batch || ''),

        Number(purchaseRate || 0),

        Number(wholesaleProfit || 0),

        Number(wholesalePrice || 0),

        Number(retailProfit || 0),

        Number(retailPrice || 0),

        Number(currentStock || 0),

        Number(stockQty || 0),

        String(entryType || ''),

        String(referenceNo || ''),

        String(transactionNo || ''),

        String(narration || ''),

        String(createdAt),

      ]

    );

    console.log(
      '✅ Stock Saved'
    );

    return true;

  } catch (error) {

    console.log(
      '❌ saveStock:',
      error
    );

    return false;
  }
};


export const getStock = async () => {
  try {
    const rows = await db.getAllAsync(`
      SELECT *
      FROM stock
      ORDER BY createdAt DESC
    `);

    console.log(
      "📦 STOCK:",
      rows
    );

    return rows || [];
  } catch (error) {
    console.log(
      "❌ GET STOCK ERROR:",
      error
    );

    return [];
  }
};


export const getStockByProduct = async (
  productName
) => {
  try {
    const rows =
      await db.getAllAsync(
        `
        SELECT *
        FROM stock
        WHERE productName = ?
        ORDER BY createdAt DESC
      `,
        [productName]
      );

    return rows || [];
  } catch (error) {
    console.log(error);
    return [];
  }
};



export const getCurrentStock = async (
  productName
) => {
  try {
    const result =
      await db.getFirstAsync(
        `
        SELECT
          SUM(stockQty) as totalStock
        FROM stock
        WHERE productName = ?
      `,
        [productName]
      );

    return result?.totalStock || 0;
  } catch (error) {
    console.log(error);
    return 0;
  }
};

// =====================================================
// GET LOCAL SHOP PROFILE
// =====================================================
export const getProfileLocal = async () => {

  try {

    const database =
      await getDB();

    if (!database) {
      return null;
    }

    const profile =
      await database.getFirstAsync(
        `
        SELECT *
        FROM profile
        LIMIT 1
        `
      );

    console.log(
      "👤 SQLITE SHOP PROFILE:",
      profile
    );

    return profile || null;

  } catch (error) {

    console.log(
      "❌ getProfileLocal:",
      error
    );

    return null;
  }
};



// =====================================================
// UPDATE LOCAL SHOP PROFILE
// =====================================================

export const updateProfileLocal = async (
  profile
) => {

  try {

    const db =
      await getDB();

    // =================================================
    // DATABASE CHECK
    // =================================================

    if (!db) {

      console.log(
        "❌ updateProfileLocal: DATABASE NOT FOUND"
      );

      return false;
    }

    // =================================================
    // PROFILE ID
    // =================================================

    const profileId =
      String(
        profile?.id ||
        profile?.email ||
        ""
      ).trim();

    if (!profileId) {

      console.log(
        "❌ updateProfileLocal: PROFILE ID MISSING"
      );

      return false;
    }

    // =================================================
    // SAFE PROFILE DATA
    // =================================================

    const shopName =
      String(
        profile?.shopName || ""
      );

    const ownerName =
      String(
        profile?.ownerName || ""
      );

    const mobile =
      String(
        profile?.mobile || ""
      );

    const email =
      String(
        profile?.email || ""
      );

    const image =
      String(
        profile?.image || ""
      );

    const categories =
      String(
        profile?.categories || ""
      );

    const address =
      String(
        profile?.address || ""
      );

    const openTime =
      String(
        profile?.openTime || ""
      );

    const closeTime =
      String(
        profile?.closeTime || ""
      );

    const updatedAt =
      String(
        profile?.updatedAt ||
        new Date().toISOString()
      );

    // =================================================
    // DEBUG
    // =================================================

    console.log(
      "📝 UPDATING LOCAL PROFILE:",
      {
        id: profileId,
        shopName,
        ownerName,
        mobile,
        email,
        address,
        categories,
        openTime,
        closeTime,
        image,
        updatedAt,
      }
    );

    // =================================================
    // CHECK EXISTING PROFILE
    // =================================================

    const existingProfile =
      await db.getFirstAsync(
        `
        SELECT id
        FROM profile
        WHERE id = ?
        LIMIT 1
        `,
        [profileId]
      );

    // =================================================
    // PROFILE EXISTS → UPDATE
    // =================================================

    if (existingProfile) {

      const result =
        await db.runAsync(
          `
          UPDATE profile

          SET

            shopName = ?,
            ownerName = ?,
            mobile = ?,
            email = ?,
            image = ?,
            categories = ?,
            address = ?,
            openTime = ?,
            closeTime = ?,
            updatedAt = ?

          WHERE id = ?
          `,
          [
            shopName,
            ownerName,
            mobile,
            email,
            image,
            categories,
            address,
            openTime,
            closeTime,
            updatedAt,
            profileId,
          ]
        );

      console.log(
        "✅ PROFILE UPDATED:",
        result
      );

      return true;
    }

    // =================================================
    // PROFILE DOES NOT EXIST → INSERT
    // =================================================

    console.log(
      "ℹ️ PROFILE NOT FOUND LOCALLY"
    );

    console.log(
      "➕ CREATING LOCAL PROFILE..."
    );

    await db.runAsync(
      `
      INSERT INTO profile (

        id,
        shopName,
        ownerName,
        mobile,
        email,
        address,
        categories,
        openTime,
        closeTime,
        image,
        updatedAt

      )

      VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
      `,
      [
        profileId,
        shopName,
        ownerName,
        mobile,
        email,
        address,
        categories,
        openTime,
        closeTime,
        image,
        updatedAt,
      ]
    );

    console.log(
      "✅ PROFILE INSERTED LOCALLY"
    );

    return true;

  } catch (error) {

    console.log(
      "❌ updateProfileLocal ERROR:",
      error
    );

    return false;
  }
};

export const clearProfile =
  async () => {

  try {

    const db =
      await getDB();

    await db.runAsync(
      `DELETE FROM profile`
    );

    console.log(
      '✅ PROFILE CLEARED'
    );

  } catch (e) {

    console.log(
      '❌ clearProfile:',
      e
    );

  }

};

export const saveProfileLocal = async (
  profile
) => {

  try {

    const database =
      await getDB();

    if (!database) {

      console.log(
        "❌ saveProfileLocal: DATABASE NOT FOUND"
      );

      return false;
    }

    const profileId =
      String(
        profile?.id ||
        "current_profile"
      );

    await database.runAsync(
      `
      INSERT OR REPLACE INTO profile (

        id,
        shopName,
        ownerName,
        mobile,
        email,
        address,
        categories,
        openTime,
        closeTime,
        image,
        updatedAt

      )

      VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?
      )
      `,
      [
        profileId,

        String(
          profile?.shopName || ""
        ),

        String(
          profile?.ownerName || ""
        ),

        String(
          profile?.mobile || ""
        ),

        String(
          profile?.email || ""
        ),

        String(
          profile?.address || ""
        ),

        String(
          profile?.categories || ""
        ),

        String(
          profile?.openTime || ""
        ),

        String(
          profile?.closeTime || ""
        ),

        String(
          profile?.image || ""
        ),

        String(
          profile?.updatedAt ||
          new Date().toISOString()
        ),
      ]
    );

    console.log(
      "✅ PROFILE SAVED"
    );

    return true;

  } catch (error) {

    console.log(
      "❌ saveProfileLocal ERROR:",
      error
    );

    return false;
  }
};

//logout


export const logoutUser = async () => {

  try {

    console.log(
      "🚪 LOGOUT START"
    );

    const database =
      await getDB();

    if (!database) {

      console.log(
        "❌ logoutUser: DATABASE NOT FOUND"
      );

      return false;
    }

    // =================================================
    // GET CURRENT USER
    // =================================================

    const user =
      await database.getFirstAsync(
        `
        SELECT *

        FROM users

        WHERE isLoggedIn = 1

        LIMIT 1
        `
      );

    console.log(
      "👤 Logout User:",
      user
    );

    const email =
      String(
        user?.email || ""
      )
        .trim()
        .toLowerCase();

    // =================================================
    // SQLITE LOGOUT
    // =================================================

    await database.runAsync(
      `
      UPDATE users

      SET
        isLoggedIn = 0,
        deviceId = ''

      WHERE isLoggedIn = 1
      `
    );

    console.log(
      "✅ SQLite logout completed"
    );

    // =================================================
    // FIREBASE LOGOUT
    // =================================================

    if (email) {

      try {

        const q =
          query(
            collection(
              firebaseDB,
              "users"
            ),
            where(
              "email",
              "==",
              email
            )
          );

        const snapshot =
          await getDocs(q);

        if (!snapshot.empty) {

          await updateDoc(
            snapshot.docs[0].ref,
            {
              isLoggedIn: 0,
              deviceId: "",
            }
          );

          console.log(
            "✅ Firebase logout completed"
          );

        } else {

          console.log(
            "⚠️ Firebase user not found"
          );
        }

      } catch (firebaseError) {

        console.log(
          "⚠️ Firebase logout failed:",
          firebaseError
        );

        // SQLite logout already succeeded.
      }

    }

    console.log(
      "✅ LOGOUT SUCCESS"
    );

    return true;

  } catch (error) {

    console.log(
      "❌ logoutUser ERROR:",
      error
    );

    return false;
  }
};




export const getInvoiceItems = async (invoiceId) => {
  try {
    const db = await getDB();

    if (!db) {
      console.log("❌ DB NOT FOUND");
      return [];
    }

    console.log(
      "🔍 GET INVOICE ITEMS:",
      invoiceId
    );

    const result = await db.getAllAsync(
      `
      SELECT *
      FROM newinvoice_items
      WHERE invoiceId = ?
      ORDER BY createdAt ASC
      `,
      [String(invoiceId)]
    );

    console.log(
      "📦 INVOICE ITEMS:",
      JSON.stringify(result, null, 2)
    );

    return Array.isArray(result)
      ? result
      : [];

  } catch (e) {
    console.log(
      "❌ getInvoiceItems ERROR:",
      e
    );

    return [];
  }
};


export const deleteLedger = async (id) => {

  try {

    const db = await getDB();

    console.log("DELETE ID:", id);

    const before =
      await db.getAllAsync(
        `SELECT id FROM ledger`
      );

    console.log(
      "BEFORE DELETE:",
      before
    );

    const result =
      await db.runAsync(
        `
        DELETE FROM ledger
        WHERE id = ?
        `,
        [String(id)]
      );

    console.log(
      "ROWS AFFECTED:",
      result.changes
    );

    const after =
      await db.getAllAsync(
        `SELECT id FROM ledger`
      );

    console.log(
      "AFTER DELETE:",
      after
    );

    return result.changes > 0;

  } catch (e) {

    console.log(
      "❌ deleteLedger ERROR:",
      e
    );

    return false;

  }

};




export const deleteSalesReturn = async id => {

  try {

    const db = await getDB();

    if (!db) {
      return false;
    }

    // Delete items first

    await db.runAsync(
      `
      DELETE FROM sales_return_items
      WHERE salesReturnId = ?
      `,
      [String(id)]
    );

    // Delete header

    await db.runAsync(
      `
      DELETE FROM sales_returns
      WHERE id = ?
      `,
      [String(id)]
    );

    console.log(
      "✅ Sales Return Deleted:",
      id
    );

    return true;

  } catch (e) {

    console.log(
      "❌ deleteSalesReturn:",
      e
    );

    return false;

  }

};


export const saveProductIfNotExists = async (
  product
) => {
  try {

    const db = await getDB();

    const existing =
      await db.getFirstAsync(
        `
        SELECT id
        FROM products
        WHERE productenglishname = ?
        `,
        [product.product]
      );

    if (existing) {
      return true;
    }

    await db.runAsync(
      `
      INSERT INTO products (
        productenglishname,
        retail,
        sgst,
        cgst,
        igst,
        batch,
        unittype,
        uom
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        product.product,
        Number(product.rate || 0),
        Number(product.sgst || 0),
        Number(product.cgst || 0),
        Number(product.igst || 0),
        product.unittype || "",
        product.uom || ""
      ]
    );

    return true;

  } catch (e) {

    console.log(
      "❌ saveProductIfNotExists:",
      e
    );

    return false;
  }
};


export const getProductByBarcode = async (
  barcode
) => {

  try {

    const db = await getDB();

    return await db.getFirstAsync(
      `
      SELECT *
      FROM products
      WHERE barcode = ?
      `,
      [barcode]
    );

  } catch (e) {

    console.log(
      "❌ getProductByBarcode:",
      e
    );

    return null;
  }
};

export const clearAllLocalData = async () => {

  try {

    const db = await getDB();

    if (!db) return false;

    await db.execAsync(`

      DELETE FROM newinvoice_items;
      DELETE FROM newinvoice;

      DELETE FROM purchase_items;
      DELETE FROM purchases;

      DELETE FROM sales_return_items;
      DELETE FROM sales_returns;

      DELETE FROM purchase_return_items;
      DELETE FROM purchase_returns;

      DELETE FROM stock;

      DELETE FROM products;

      DELETE FROM ledger;

      DELETE FROM profile;

    `);

    console.log("✅ ALL DATA CLEARED");

    return true;

  } catch (error) {

    console.log(
      "❌ CLEAR DATA ERROR:",
      error
    );

    return false;

  }

};

export const deletePurchase = async (
  purchaseId
) => {

  try {

    const db = await getDB();

    if (!db) return false;

    // Get purchase
    const purchase =
      await db.getFirstAsync(
        `
        SELECT *
        FROM purchases
        WHERE id = ?
        `,
        [String(purchaseId)]
      );

    if (!purchase) {
      return false;
    }

    // Get purchase items
    const items =
      await db.getAllAsync(
        `
        SELECT *
        FROM purchase_items
        WHERE purchaseNo = ?
        `,
        [
          String(
            purchase.purchaseNo
          )
        ]
      );

    // Reverse stock
    for (const item of items) {

      const product =
        await db.getFirstAsync(
          `
          SELECT *
          FROM products
          WHERE productenglishname = ?
          `,
          [
            String(
              item.product
            )
          ]
        );

      if (product) {

        const currentQty =
          Number(
            product.stockquantity || 0
          );

        const deleteQty =
          Number(
            item.qty || 0
          );

        const newQty =
          Math.max(
            0,
            currentQty - deleteQty
          );

        await db.runAsync(
          `
          UPDATE products
          SET
            stockquantity = ?,
            stockvalue = ?
          WHERE productenglishname = ?
          `,
          [
            newQty,
            newQty *
            Number(
              product.purchase || 0
            ),
            String(
              item.product
            )
          ]
        );

      }

    }

    // Delete items
    await db.runAsync(
      `
      DELETE FROM purchase_items
      WHERE purchaseNo = ?
      `,
      [
        String(
          purchase.purchaseNo
        )
      ]
    );

    // Delete purchase
    await db.runAsync(
      `
      DELETE FROM purchases
      WHERE id = ?
      `,
      [String(purchaseId)]
    );

    console.log(
      "✅ Purchase Deleted"
    );

    return true;

  } catch (e) {

    console.log(
      "❌ deletePurchase:",
      e
    );

    return false;

  }

};

export const getPurchaseById = async (id) => {
  try {
    const db = await getDB();

    if (!db) {
      console.log("❌ DB NOT FOUND");
      return null;
    }

    const purchase = await db.getFirstAsync(
      `
      SELECT *
      FROM purchases
      WHERE id = ?
      `,
      [String(id)]
    );

    console.log(
      "📦 PURCHASE BY ID:",
      purchase
    );

    return purchase || null;

  } catch (error) {

    console.log(
      "❌ getPurchaseById:",
      error
    );

    return null;
  }
};



export const setLoggedInUser = async (
  email
) => {

  try {

    const database =
      await getDB();

    if (!database) {
      return false;
    }

    await database.runAsync(
      `
      UPDATE users
      SET isLoggedIn = 0
      `
    );

    const result =
      await database.runAsync(
        `
        UPDATE users

        SET isLoggedIn = 1

        WHERE LOWER(email) = LOWER(?)
        `,
        [
          String(email || "")
            .trim()
            .toLowerCase(),
        ]
      );

    console.log(
      "✅ LOGIN SESSION UPDATED:",
      result
    );

    return true;

  } catch (error) {

    console.log(
      "❌ setLoggedInUser ERROR:",
      error
    );

    return false;
  }
};



// =====================================================
// SAVE SHOP PROFILE LOCALLY
// =====================================================

export const saveShopProfileLocal = async (
  profile
) => {

  try {

    const database =
      await getDB();

    if (!database) {
      console.log(
        "❌ DATABASE NOT FOUND"
      );
      return false;
    }

    await database.runAsync(
      `
      INSERT OR REPLACE INTO profile (

        id,
        shopName,
        ownerName,
        mobile,
        email,
        address,
        categories,
        openTime,
        closeTime,
        image,
        updatedAt

      )

      VALUES (
        ?,?,?,?,?,?,?,?,?,?,?
      )
      `,
      [

        String(
          profile.id || ""
        ),

        String(
          profile.shopName || ""
        ),

        String(
          profile.ownerName || ""
        ),

        String(
          profile.mobile || ""
        ),

        String(
          profile.email || ""
        ),

        String(
          profile.address || ""
        ),

        String(
          profile.categories || ""
        ),

        String(
          profile.openTime || ""
        ),

        String(
          profile.closeTime || ""
        ),

        String(
          profile.image || ""
        ),

        String(
          profile.updatedAt ||
          new Date().toISOString()
        ),

      ]
    );

    console.log(
      "✅ SHOP PROFILE SAVED LOCALLY"
    );

    return true;

  } catch (error) {

    console.log(
      "❌ saveShopProfileLocal:",
      error
    );

    return false;
  }
};



// =====================================================
// GET CUSTOMERS FROM INVOICES
// =====================================================

export const getInvoiceCustomers = async () => {
  try {
    const db = await getDB();

    if (!db) {
      console.log(
        "❌ getInvoiceCustomers: DATABASE NOT FOUND"
      );
      return [];
    }

    // --------------------------------------------------
    // CHECK TABLE
    // --------------------------------------------------

    const table = await db.getFirstAsync(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
      AND name = 'newinvoice'
    `);

    if (!table) {
      console.log(
        "❌ getInvoiceCustomers: newinvoice TABLE NOT FOUND"
      );
      return [];
    }

    // --------------------------------------------------
    // GET CUSTOMERS FROM NEW INVOICE TABLE
    // --------------------------------------------------

    const result = await db.getAllAsync(`
      SELECT
        customerName,
        customerMobile,

        COUNT(*) AS invoiceCount,

        COALESCE(
          SUM(totalAmount),
          0
        ) AS totalAmount,

        MAX(createdAt) AS lastInvoiceDate

      FROM newinvoice

      WHERE
        customerName IS NOT NULL
        AND TRIM(customerName) != ''

      GROUP BY
        customerName,
        customerMobile

      ORDER BY
        lastInvoiceDate DESC
    `);

    console.log(
      "👥 INVOICE CUSTOMERS:",
      result
    );

    return Array.isArray(result)
      ? result
      : [];

  } catch (error) {
    console.error(
      "❌ getInvoiceCustomers ERROR:",
      error
    );

    return [];
  }
};



// ============================================================
// GENERATE NEXT INVOICE NUMBER
// ============================================================

export const generateInvoiceNo = async () => {
  try {
    const database = await getDB();

    const row = await database.getFirstAsync(`
      SELECT invoiceNo
      FROM newinvoice
      WHERE invoiceNo IS NOT NULL
        AND TRIM(CAST(invoiceNo AS TEXT)) != ''
      ORDER BY
        CASE
          WHEN CAST(invoiceNo AS INTEGER) IS NOT NULL
          THEN CAST(invoiceNo AS INTEGER)
          ELSE 0
        END DESC
      LIMIT 1
    `);

    const lastInvoiceNo = Number(
      row?.invoiceNo ?? 0
    );

    const nextInvoiceNo =
      Number.isFinite(lastInvoiceNo) &&
      lastInvoiceNo > 0
        ? Math.floor(lastInvoiceNo) + 1
        : 1;

    console.log(
      "🧾 LAST INVOICE NO:",
      lastInvoiceNo
    );

    console.log(
      "🧾 NEXT INVOICE NO:",
      nextInvoiceNo
    );

    return String(nextInvoiceNo);

  } catch (error) {
    console.error(
      "❌ generateInvoiceNo ERROR:",
      error
    );

    throw error;
  }
};

// ============================================================
// INSERT NEW INVOICE
// ============================================================

export const insertNewInvoice = async (database, invoice) => {
  try {
    // ==========================================================
    // 1. DATABASE VALIDATION
    // ==========================================================

    if (!database) {
      throw new Error("Database connection not available.");
    }

    if (
      typeof database.runAsync !== "function" ||
      typeof database.getFirstAsync !== "function" ||
      typeof database.getAllAsync !== "function"
    ) {
      throw new Error("Invalid SQLite database object.");
    }

    // ==========================================================
    // 2. INVOICE VALIDATION
    // ==========================================================

    if (
      !invoice ||
      typeof invoice !== "object" ||
      Array.isArray(invoice)
    ) {
      throw new Error("Invalid invoice data.");
    }

    if (!invoice.id) {
      throw new Error("Invoice ID is missing.");
    }

    // ==========================================================
    // 3. CHECK newinvoice TABLE
    // ==========================================================

    const table = await database.getFirstAsync(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
      AND name = 'newinvoice'
    `);

    console.log("📋 newinvoice TABLE:", table);

    if (!table) {
      throw new Error(
        "SQLite table 'newinvoice' does not exist."
      );
    }

    // ==========================================================
    // 4. CHECK TABLE COLUMNS
    // ==========================================================

    const columns = await database.getAllAsync(`
      PRAGMA table_info(newinvoice)
    `);

    console.log(
      "📋 newinvoice COLUMNS:",
      columns
    );

    const columnNames = columns.map(
      column => column.name
    );

    const requiredColumns = [
      "id",
      "invoiceNo",
      "invoiceDate",
      "customerId",
      "customerName",
      "customerMobile",
      "gstNo",
      "paymentMode",
      "taxType",
      "billType",
      "subtotal",
      "discount",
      "taxableAmount",
      "sgst",
      "cgst",
      "igst",
      "tax",
      "totalAmount",
      "paidAmount",
      "balanceAmount",
      "status",
      "notes",
      "createdAt",
    ];

    const missingColumns =
      requiredColumns.filter(
        column => !columnNames.includes(column)
      );

    if (missingColumns.length > 0) {
      throw new Error(
        `Missing columns in newinvoice: ${missingColumns.join(
          ", "
        )}`
      );
    }

    // ==========================================================
    // 5. PREPARE VALUES
    // ==========================================================

    const invoiceId = String(invoice.id);

    const invoiceNumber = String(
      invoice.invoiceNo ?? ""
    );

    /*
     * IMPORTANT:
     * Always store a valid invoice date.
     *
     * Priority:
     * 1. invoice.invoiceDate
     * 2. invoice.date
     * 3. current date
     */
    const invoiceDate = String(
      invoice.invoiceDate ??
        invoice.date ??
        new Date().toISOString()
    );

    const customerId = String(
      invoice.customerId ?? ""
    );

    const customerName = String(
      invoice.customerName ?? ""
    );

    const customerMobile = String(
      invoice.customerMobile ?? ""
    );

    const gstNo = String(
      invoice.gstNo ?? ""
    );

    const paymentMode = String(
      invoice.paymentMode ?? "Cash"
    );

    const taxType = String(
      invoice.taxType ?? "No Tax"
    );

    const billType = String(
      invoice.billType ?? "Retail"
    );

    const subtotal = Number(
      invoice.subtotal ?? 0
    );

    const discount = Number(
      invoice.discount ?? 0
    );

    const taxableAmount = Number(
      invoice.taxableAmount ?? 0
    );

    const sgst = Number(
      invoice.sgst ?? 0
    );

    const cgst = Number(
      invoice.cgst ?? 0
    );

    const igst = Number(
      invoice.igst ?? 0
    );

    const tax = Number(
      invoice.tax ??
        sgst +
          cgst +
          igst
    );

    const totalAmount = Number(
      invoice.totalAmount ??
        invoice.grandTotal ??
        invoice.total ??
        0
    );

    const paidAmount = Number(
      invoice.paidAmount ?? 0
    );

    const balanceAmount = Number(
      invoice.balanceAmount ??
        Math.max(
          0,
          totalAmount - paidAmount
        )
    );

    const status = String(
      invoice.status ??
        (balanceAmount <= 0
          ? "PAID"
          : "PENDING")
    );

    const notes = String(
      invoice.notes ?? ""
    );

    const createdAt = String(
      invoice.createdAt ??
        new Date().toISOString()
    );

    // ==========================================================
    // 6. DEBUG - VALUES BEING SAVED
    // ==========================================================

    console.log(
      "========================================"
    );

    console.log(
      "🧾 INSERTING NEW INVOICE"
    );

    console.log(
      "========================================"
    );

    console.log({
      invoiceId,
      invoiceNumber,
      invoiceDate,
      customerId,
      customerName,
      customerMobile,
      gstNo,
      paymentMode,
      taxType,
      billType,
      subtotal,
      discount,
      taxableAmount,
      sgst,
      cgst,
      igst,
      tax,
      totalAmount,
      paidAmount,
      balanceAmount,
      status,
      notes,
      createdAt,
    });

    // ==========================================================
    // 7. CHECK DUPLICATE INVOICE
    // ==========================================================

    const existingInvoice =
      await database.getFirstAsync(
        `
        SELECT id, invoiceNo
        FROM newinvoice
        WHERE id = ?
        LIMIT 1
        `,
        [invoiceId]
      );

    if (existingInvoice) {
      console.warn(
        "⚠️ INVOICE ALREADY EXISTS"
      );

      console.warn(
        "🧾 Existing Invoice:",
        existingInvoice
      );

      /*
       * Avoid inserting the same invoice twice.
       */
      return true;
    }

    // ==========================================================
    // 8. INSERT INTO newinvoice
    // ==========================================================

    const result = await database.runAsync(
      `
      INSERT INTO newinvoice (
        id,
        invoiceNo,
        invoiceDate,
        customerId,
        customerName,
        customerMobile,
        gstNo,
        paymentMode,
        taxType,
        billType,
        subtotal,
        discount,
        taxableAmount,
        sgst,
        cgst,
        igst,
        tax,
        totalAmount,
        paidAmount,
        balanceAmount,
        status,
        notes,
        createdAt
      )
      VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?
      )
      `,
      [
        invoiceId,
        invoiceNumber,
        invoiceDate,
        customerId,
        customerName,
        customerMobile,
        gstNo,
        paymentMode,
        taxType,
        billType,
        subtotal,
        discount,
        taxableAmount,
        sgst,
        cgst,
        igst,
        tax,
        totalAmount,
        paidAmount,
        balanceAmount,
        status,
        notes,
        createdAt,
      ]
    );

    // ==========================================================
    // 9. CHECK INSERT RESULT
    // ==========================================================

    console.log(
      "📊 SQLITE INSERT RESULT:",
      result
    );

    // ==========================================================
    // 10. VERIFY SAVED INVOICE
    // ==========================================================

    const savedInvoice =
      await database.getFirstAsync(
        `
        SELECT *
        FROM newinvoice
        WHERE id = ?
        LIMIT 1
        `,
        [invoiceId]
      );

    console.log(
      "========================================"
    );

    console.log(
      "🔎 VERIFY SAVED INVOICE"
    );

    console.log(
      "========================================"
    );

    console.log(
      "🧾 SAVED INVOICE:",
      savedInvoice
    );

    console.log(
      "🧾 SAVED ID:",
      savedInvoice?.id
    );

    console.log(
      "🧾 SAVED INVOICE NO:",
      savedInvoice?.invoiceNo
    );

    console.log(
      "📅 SAVED INVOICE DATE:",
      savedInvoice?.invoiceDate
    );

    console.log(
      "💰 SAVED TOTAL:",
      savedInvoice?.totalAmount
    );

    // ==========================================================
    // 11. INSERT VERIFICATION
    // ==========================================================

    if (!savedInvoice) {
      throw new Error(
        "Invoice INSERT completed but verification failed. Invoice was not found in newinvoice."
      );
    }

    // Make sure the important report fields exist
    if (
      savedInvoice.invoiceDate === null ||
      savedInvoice.invoiceDate === undefined ||
      String(savedInvoice.invoiceDate).trim() === ""
    ) {
      console.warn(
        "⚠️ WARNING: invoiceDate is empty."
      );
    }

    if (
      savedInvoice.totalAmount === null ||
      savedInvoice.totalAmount === undefined
    ) {
      console.warn(
        "⚠️ WARNING: totalAmount is empty."
      );
    }

    // ==========================================================
    // 12. COUNT ALL INVOICES
    // ==========================================================

    const invoiceCount =
      await database.getFirstAsync(
        `
        SELECT COUNT(*) AS count
        FROM newinvoice
        `
      );

    console.log(
      "📦 TOTAL INVOICES IN SQLITE:",
      invoiceCount?.count
    );

    // ==========================================================
    // 13. REPORT TOTAL CHECK
    // ==========================================================

    const reportCheck =
      await database.getFirstAsync(
        `
        SELECT
          COUNT(*) AS invoiceCount,
          COALESCE(
            SUM(totalAmount),
            0
          ) AS salesTotal
        FROM newinvoice
        `
      );

    console.log(
      "========================================"
    );

    console.log(
      "📊 REPORT DATABASE CHECK"
    );

    console.log(
      "========================================"
    );

    console.log(
      "🧾 Invoice Count:",
      reportCheck?.invoiceCount
    );

    console.log(
      "💰 Sales Total:",
      reportCheck?.salesTotal
    );

    console.log(
      "========================================"
    );

    // ==========================================================
    // 14. SUCCESS
    // ==========================================================

    console.log(
      "========================================"
    );

    console.log(
      "✅ NEW INVOICE INSERTED SUCCESSFULLY"
    );

    console.log(
      "========================================"
    );

    console.log(
      "🧾 Invoice ID:",
      invoiceId
    );

    console.log(
      "🧾 Invoice No:",
      invoiceNumber
    );

    console.log(
      "📅 Invoice Date:",
      invoiceDate
    );

    console.log(
      "💰 Total:",
      totalAmount
    );

    console.log(
      "💵 Paid:",
      paidAmount
    );

    console.log(
      "💳 Balance:",
      balanceAmount
    );

    console.log(
      "========================================"
    );

    return true;

  } catch (error) {

    // ==========================================================
    // ERROR HANDLING
    // ==========================================================

    console.error(
      "========================================"
    );

    console.error(
      "❌ insertNewInvoice ERROR"
    );

    console.error(
      "========================================"
    );

    console.error(
      "❌ ERROR MESSAGE:",
      error?.message
    );

    console.error(
      "❌ ERROR:",
      error
    );

    console.error(
      "❌ INVOICE DATA:",
      invoice
    );

    console.error(
      "========================================"
    );

    // Do NOT hide original SQLite error
    throw error;
  }
};

// ============================================================
// INSERT NEW INVOICE ITEM
// ============================================================

export const insertNewInvoiceItem = async (
  database,
  item
) => {
  try {
    // ==========================================================
    // 1. DATABASE VALIDATION
    // ==========================================================

    if (!database) {
      throw new Error(
        "Database connection not available."
      );
    }

    if (
      typeof database.runAsync !== "function" ||
      typeof database.getFirstAsync !== "function" ||
      typeof database.getAllAsync !== "function"
    ) {
      throw new Error(
        "Invalid SQLite database object."
      );
    }

    // ==========================================================
    // 2. ITEM VALIDATION
    // ==========================================================

    if (
      !item ||
      typeof item !== "object" ||
      Array.isArray(item)
    ) {
      throw new Error(
        "Invalid invoice item."
      );
    }

    if (!item.id) {
      throw new Error(
        "Invoice item ID is missing."
      );
    }

    if (!item.invoiceId) {
      throw new Error(
        "Invoice item invoiceId is missing."
      );
    }

    // ==========================================================
    // 3. CHECK TABLE
    // ==========================================================

    const table =
      await database.getFirstAsync(`
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
        AND name = 'newinvoice_items'
      `);

    console.log(
      "📋 newinvoice_items TABLE:",
      table
    );

    if (!table) {
      throw new Error(
        "SQLite table 'newinvoice_items' does not exist."
      );
    }

    // ==========================================================
    // 4. CHECK TABLE COLUMNS
    // ==========================================================

    const columns =
      await database.getAllAsync(`
        PRAGMA table_info(newinvoice_items)
      `);

    console.log(
      "📋 newinvoice_items COLUMNS:",
      columns
    );

    const columnNames =
      columns.map(
        column => column.name
      );

    const requiredColumns = [
      "id",
      "invoiceId",
      "productId",
      "productcode",
      "productName",
      "productimage",
      "category",
      "subcategory",
      "quantity",
      "rate",
      "amount",
      "unit",
      "uom",
      "discount",
      "taxableAmount",
      "sgst",
      "cgst",
      "igst",
      "taxAmount",
      "totalAmount",
    ];

    const missingColumns =
      requiredColumns.filter(
        column =>
          !columnNames.includes(column)
      );

    if (missingColumns.length > 0) {
      throw new Error(
        `Missing columns in newinvoice_items: ${missingColumns.join(
          ", "
        )}`
      );
    }

    // ==========================================================
    // 5. PREPARE VALUES
    // ==========================================================

    const itemId =
      String(item.id);

    const invoiceId =
      String(item.invoiceId);

    const productId =
      String(item.productId ?? "");

    const productCode =
      String(item.productcode ?? "");

    const productName =
      String(item.productName ?? "");

    const productImage =
      String(item.productimage ?? "");

    const category =
      String(item.category ?? "");

    const subcategory =
      String(item.subcategory ?? "");

    const quantity =
      Number(item.quantity ?? 0);

    const rate =
      Number(item.rate ?? 0);

    const amount =
      Number(item.amount ?? 0);

    const unit =
      String(item.unit ?? "");

    const uom =
      String(item.uom ?? "");

    const discount =
      Number(item.discount ?? 0);

    const taxableAmount =
      Number(
        item.taxableAmount ?? 0
      );

    const sgst =
      Number(item.sgst ?? 0);

    const cgst =
      Number(item.cgst ?? 0);

    const igst =
      Number(item.igst ?? 0);

    const taxAmount =
      Number(item.taxAmount ?? 0);

    const totalAmount =
      Number(item.totalAmount ?? 0);

    // ==========================================================
    // 6. DEBUG
    // ==========================================================

    console.log(
      "========================================"
    );

    console.log(
      "📦 INSERTING NEW INVOICE ITEM"
    );

    console.log(
      "========================================"
    );

    console.log({
      itemId,
      invoiceId,
      productId,
      productCode,
      productName,
      quantity,
      rate,
      amount,
      unit,
      uom,
      discount,
      taxableAmount,
      sgst,
      cgst,
      igst,
      taxAmount,
      totalAmount,
    });

    // ==========================================================
    // 7. INSERT
    // ==========================================================

    const result =
      await database.runAsync(
        `
        INSERT INTO newinvoice_items (
          id,
          invoiceId,
          productId,
          productcode,
          productName,
          productimage,
          category,
          subcategory,
          quantity,
          rate,
          amount,
          unit,
          uom,
          discount,
          taxableAmount,
          sgst,
          cgst,
          igst,
          taxAmount,
          totalAmount
        )
        VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
        `,
        [
          itemId,
          invoiceId,
          productId,
          productCode,
          productName,
          productImage,
          category,
          subcategory,
          quantity,
          rate,
          amount,
          unit,
          uom,
          discount,
          taxableAmount,
          sgst,
          cgst,
          igst,
          taxAmount,
          totalAmount,
        ]
      );

    // ==========================================================
    // 8. SUCCESS
    // ==========================================================

    console.log(
      "✅ NEW INVOICE ITEM INSERTED"
    );

    console.log(
      "📦 Item ID:",
      itemId
    );

    console.log(
      "🧾 Invoice ID:",
      invoiceId
    );

    console.log(
      "📦 Product:",
      productName
    );

    console.log(
      "📦 Quantity:",
      quantity
    );

    console.log(
      "📊 SQLite RESULT:",
      result
    );

    return true;

  } catch (error) {

    console.error(
      "❌ insertNewInvoiceItem ERROR:",
      error
    );

    console.error(
      "❌ ERROR MESSAGE:",
      error?.message
    );

    console.error(
      "❌ ITEM:",
      item
    );

    // Keep the original SQLite error
    throw error;
  }
};


export const getNewInvoices = async () => {
  try {
    const db = await getDB();

    if (!db) {
      console.log("❌ getNewInvoices: DB NOT FOUND");
      return [];
    }

    const rows = await db.getAllAsync(`
      SELECT *
      FROM newinvoice
      ORDER BY invoiceNo DESC
    `);

    console.log(
      "✅ getNewInvoices:",
      rows?.length || 0
    );

    return Array.isArray(rows)
      ? rows
      : [];

  } catch (error) {

    console.log(
      "===================================="
    );

    console.log(
      "❌ getNewInvoices ERROR:",
      error?.message || error
    );

    console.log(
      "===================================="
    );

    return [];
  }
};