// Mock API service to replace Base44 SDK
import { mockDepartments, mockTimelineEvents, mockUser } from './mockData.js';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Persistent storage using localStorage
const STORAGE_KEYS = {
  DEPARTMENTS: 'depsync_departments',
  TIMELINE_EVENTS: 'depsync_timeline_events',
  USER: 'depsync_user'
};

// Load data from localStorage or use defaults
const loadFromStorage = (key, defaultData) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultData;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultData;
  }
};

// Save data to localStorage
const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Initialize with persistent storage
let departments = loadFromStorage(STORAGE_KEYS.DEPARTMENTS, [...mockDepartments]);
let timelineEvents = loadFromStorage(STORAGE_KEYS.TIMELINE_EVENTS, [...mockTimelineEvents]);
let user = loadFromStorage(STORAGE_KEYS.USER, { ...mockUser });

// Generate unique IDs
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

// Mock Department API
export const Department = {
  async list(sortBy = null) {
    await delay(300);
    let result = [...departments];
    
    if (sortBy === "-created_date") {
      result.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    } else if (sortBy === "created_date") {
      result.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
    }
    
    return result;
  },

  async get(id) {
    await delay(200);
    const dept = departments.find(d => d.id === id);
    if (!dept) throw new Error(`Department with id ${id} not found`);
    return dept;
  },

  async create(data) {
    await delay(400);
    const newDept = {
      id: generateId(),
      created_date: new Date().toISOString(),
      ...data
    };
    departments.push(newDept);
    saveToStorage(STORAGE_KEYS.DEPARTMENTS, departments);
    return newDept;
  },

  async update(id, data) {
    await delay(400);
    const index = departments.findIndex(d => d.id === id);
    if (index === -1) throw new Error(`Department with id ${id} not found`);
    
    departments[index] = { ...departments[index], ...data };
    saveToStorage(STORAGE_KEYS.DEPARTMENTS, departments);
    return departments[index];
  },

  async delete(id) {
    await delay(300);
    const index = departments.findIndex(d => d.id === id);
    if (index === -1) throw new Error(`Department with id ${id} not found`);
    
    const deleted = departments.splice(index, 1)[0];
    saveToStorage(STORAGE_KEYS.DEPARTMENTS, departments);
    return deleted;
  },

  // Utility method to reset data to defaults
  async resetToDefaults() {
    departments = [...mockDepartments];
    saveToStorage(STORAGE_KEYS.DEPARTMENTS, departments);
    return departments;
  }
};

// Mock TimelineEvent API
export const TimelineEvent = {
  async list(sortBy = null) {
    await delay(300);
    let result = [...timelineEvents];
    
    if (sortBy === "-start_date") {
      result.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
    } else if (sortBy === "start_date") {
      result.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
    } else if (sortBy === "-created_date") {
      result.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    }
    
    return result;
  },

  async get(id) {
    await delay(200);
    const event = timelineEvents.find(e => e.id === id);
    if (!event) throw new Error(`TimelineEvent with id ${id} not found`);
    return event;
  },

  async create(data) {
    await delay(400);
    const newEvent = {
      id: generateId(),
      created_date: new Date().toISOString(),
      status: 'upcoming',
      ...data
    };
    timelineEvents.push(newEvent);
    return newEvent;
  },

  async update(id, data) {
    await delay(400);
    const index = timelineEvents.findIndex(e => e.id === id);
    if (index === -1) throw new Error(`TimelineEvent with id ${id} not found`);
    
    timelineEvents[index] = { ...timelineEvents[index], ...data };
    return timelineEvents[index];
  },

  async delete(id) {
    await delay(300);
    const index = timelineEvents.findIndex(e => e.id === id);
    if (index === -1) throw new Error(`TimelineEvent with id ${id} not found`);
    
    const deleted = timelineEvents.splice(index, 1)[0];
    return deleted;
  }
};

// Mock Project API (if needed)
export const Project = {
  async list() {
    await delay(300);
    return []; // Empty for now, can be populated if needed
  },

  async get(id) {
    await delay(200);
    throw new Error(`Project with id ${id} not found`);
  },

  async create(data) {
    await delay(400);
    return { id: generateId(), ...data };
  },

  async update(id, data) {
    await delay(400);
    return { id, ...data };
  },

  async delete(id) {
    await delay(300);
    return { id };
  }
};

// Mock User/Auth API
export const User = {
  async me() {
    await delay(200);
    return user;
  },

  async login(credentials) {
    await delay(500);
    // Always return success for demo
    return { success: true, user };
  },

  async logout() {
    await delay(200);
    return { success: true };
  }
};

// Reset function for testing
export const resetMockData = () => {
  departments = [...mockDepartments];
  timelineEvents = [...mockTimelineEvents];
  user = { ...mockUser };
};
