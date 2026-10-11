import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '..', 'data', 'database.json');

class Collection {
  constructor(name, getDb, saveDb) {
    this.name = name;
    this.getDb = getDb;
    this.saveDb = saveDb;
  }

  getAll() {
    const db = this.getDb();
    return db[this.name] || [];
  }

  find(predicate = () => true) {
    const items = this.getAll();
    if (typeof predicate === 'function') {
      return items.filter(predicate);
    }
    // Match object properties
    return items.filter(item => {
      for (const [key, value] of Object.entries(predicate)) {
        if (item[key] !== value) return false;
      }
      return true;
    });
  }

  findOne(predicate) {
    const items = this.getAll();
    if (typeof predicate === 'function') {
      return items.find(predicate) || null;
    }
    return items.find(item => {
      for (const [key, value] of Object.entries(predicate)) {
        if (item[key] !== value) return false;
      }
      return true;
    }) || null;
  }

  findById(id) {
    const items = this.getAll();
    return items.find(item => item._id === id || item.id === id) || null;
  }

  create(doc) {
    const db = this.getDb();
    if (!db[this.name]) db[this.name] = [];
    const newDoc = {
      _id: doc._id || 'id_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      ...doc,
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db[this.name].push(newDoc);
    this.saveDb();
    return newDoc;
  }

  findByIdAndUpdate(id, updates) {
    const db = this.getDb();
    const items = db[this.name] || [];
    const index = items.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;
    items[index] = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveDb();
    return items[index];
  }

  findByIdAndDelete(id) {
    const db = this.getDb();
    const items = db[this.name] || [];
    const index = items.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;
    const removed = items.splice(index, 1)[0];
    this.saveDb();
    return removed;
  }

  count(predicate = () => true) {
    return this.find(predicate).length;
  }
}

class Database {
  constructor() {
    this.data = {
      users: [],
      skills: [],
      requests: [],
      sessions: [],
      reviews: [],
      notifications: [],
      reports: []
    };
    this.init();
  }

  init() {
    const dataDir = path.dirname(DB_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.warn('Error reading database file, initializing empty db:', err.message);
      }
    } else {
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  collection(name) {
    return new Collection(name, () => this.data, () => this.save());
  }
}

const dbInstance = new Database();

export const Users = dbInstance.collection('users');
export const Skills = dbInstance.collection('skills');
export const Requests = dbInstance.collection('requests');
export const Sessions = dbInstance.collection('sessions');
export const Reviews = dbInstance.collection('reviews');
export const Notifications = dbInstance.collection('notifications');
export const Reports = dbInstance.collection('reports');

export default dbInstance;
