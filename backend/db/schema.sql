
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    status TEXT NOT NULL DEFAULT 'new'
        CHECK (status IN ('new', 'contacted', 'qualified', 'lost')),
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    leadId INTEGER NOT NULL,
    content TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (leadId)
        REFERENCES leads(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_leads_name
ON leads(name);

CREATE INDEX IF NOT EXISTS idx_leads_email
ON leads(email);

CREATE INDEX IF NOT EXISTS idx_notes_leadId
ON notes(leadId);
