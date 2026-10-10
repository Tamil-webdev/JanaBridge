import { mockApi } from './mockApi';

export const searchService = {
  /**
   * Universal search across Schemes, Services, and Documents
   */
  globalSearch: async (query, stateId = 'tamil-nadu') => {
    if (!query || query.trim().length === 0) {
      return { schemes: [], services: [], documents: [] };
    }
    const cleanQuery = query.trim().toLowerCase();

    const [allSchemes, allServices, allDocuments] = await Promise.all([
      mockApi.getSchemes({ state: stateId }),
      mockApi.getServices({ state: stateId }),
      mockApi.getDocuments()
    ]);

    const matchingSchemes = allSchemes.filter(s =>
      s.name.toLowerCase().includes(cleanQuery) ||
      (s.tamilName && s.tamilName.toLowerCase().includes(cleanQuery)) ||
      s.description.toLowerCase().includes(cleanQuery) ||
      s.department.toLowerCase().includes(cleanQuery)
    );

    const matchingServices = allServices.filter(s =>
      s.name.toLowerCase().includes(cleanQuery) ||
      (s.tamilName && s.tamilName.toLowerCase().includes(cleanQuery)) ||
      s.description.toLowerCase().includes(cleanQuery) ||
      s.department.toLowerCase().includes(cleanQuery)
    );

    const matchingDocuments = allDocuments.filter(d =>
      d.name.toLowerCase().includes(cleanQuery) ||
      (d.tamilName && d.tamilName.toLowerCase().includes(cleanQuery)) ||
      d.purpose.toLowerCase().includes(cleanQuery) ||
      d.category.toLowerCase().includes(cleanQuery)
    );

    return {
      schemes: matchingSchemes,
      services: matchingServices,
      documents: matchingDocuments,
      totalCount: matchingSchemes.length + matchingServices.length + matchingDocuments.length
    };
  }
};
