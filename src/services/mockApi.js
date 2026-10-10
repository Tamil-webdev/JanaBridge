import schemesData from '../data/schemes.json';
import servicesData from '../data/services.json';
import documentsData from '../data/documents.json';
import categoriesData from '../data/categories.json';
import statesData from '../data/states.json';
import districtsData from '../data/districts.json';
import helplinesData from '../data/helplines.json';

/**
 * Service layer providing clean asynchronous abstraction over local mock data.
 * Structured so that a future FastAPI backend can replace these functions seamlessly.
 */
export const mockApi = {
  getSchemes: async (filters = {}) => {
    let result = [...schemesData];
    if (filters.state && filters.state !== 'all') {
      result = result.filter(
        s => s.applicableStates.includes('all') || s.applicableStates.includes(filters.state)
      );
    }
    if (filters.category && filters.category !== 'all') {
      result = result.filter(
        s => s.beneficiaryCategories.includes('all') || s.beneficiaryCategories.includes(filters.category)
      );
    }
    if (filters.level && filters.level !== 'all') {
      result = result.filter(s => s.governmentLevel.toLowerCase() === filters.level.toLowerCase());
    }
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(
        s => s.name.toLowerCase().includes(q) ||
             (s.tamilName && s.tamilName.toLowerCase().includes(q)) ||
             s.description.toLowerCase().includes(q) ||
             s.department.toLowerCase().includes(q)
      );
    }
    return result;
  },

  getSchemeById: async (id) => {
    return schemesData.find(s => s.id === id) || null;
  },

  getServices: async (filters = {}) => {
    let result = [...servicesData];
    if (filters.state && filters.state !== 'all') {
      result = result.filter(
        s => s.applicableStates.includes('all') || s.applicableStates.includes(filters.state)
      );
    }
    if (filters.category && filters.category !== 'all') {
      result = result.filter(s => s.category === filters.category);
    }
    if (filters.department && filters.department !== 'All Departments') {
      result = result.filter(s => s.department === filters.department);
    }
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(
        s => s.name.toLowerCase().includes(q) ||
             (s.tamilName && s.tamilName.toLowerCase().includes(q)) ||
             s.description.toLowerCase().includes(q) ||
             s.department.toLowerCase().includes(q)
      );
    }
    return result;
  },

  getServiceById: async (id) => {
    return servicesData.find(s => s.id === id) || null;
  },

  getDocuments: async (query = '') => {
    if (!query) return documentsData;
    const q = query.toLowerCase();
    return documentsData.filter(
      d => d.name.toLowerCase().includes(q) ||
           (d.tamilName && d.tamilName.toLowerCase().includes(q)) ||
           d.purpose.toLowerCase().includes(q) ||
           d.category.toLowerCase().includes(q)
    );
  },

  getDocumentById: async (id) => {
    return documentsData.find(d => d.id === id) || null;
  },

  getCategories: async () => {
    return categoriesData;
  },

  getStates: async () => {
    return statesData;
  },

  getDistrictsByState: async (stateId = 'tamil-nadu') => {
    return districtsData[stateId] || districtsData['tamil-nadu'] || [];
  },

  getHelplines: async () => {
    return helplinesData;
  }
};
