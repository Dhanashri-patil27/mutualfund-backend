import axios from 'axios';
import CacheManager from '../cacheManager/cache.js'; // Assuming CacheManager is in a separate file

class FundService {
  static async getFundFamilies() {
    try {
      // Check if cached data is available
      let cacheKey = 'FundFamilies'
      const cachedData = await CacheManager.getCache(cacheKey);
      if (cachedData) {
        return cachedData; 
      }

      // Attempt to fetch fresh data from API
      const apiData = await FundService.fetchDataFromAPI();
      if (apiData) {
        if(Array.isArray(apiData)){
              const fundFamilies = [...new Set(response.data.map(fund => fund.Mutual_Fund_Family))]  // Unique family names
              .map(familyName => ({
              familyName,
              id: familyName.toLowerCase().replace(/\s+/g, '-') 
              }));
              await CacheManager.setCache(cacheKey, fundFamilies);
              return fundFamilies;
            }

      }

      // If API fails, fall back to AMFI data
      const amfiData = await FundService.fetchDataFromAMFI();
        if (Array.isArray(amfiData)) {
          const fundFamilies = [...new Set(amfiData.map(fund => fund.Mutual_Fund_Family))]  // Unique family names
            .map(familyName => ({
              familyName: familyName.replace(/\r/g, '').trim(),
              id: familyName.toLowerCase().replace(/\s+/g, '-') 
            }));
               await CacheManager.setCache(cacheKey, fundFamilies);
          return fundFamilies;
        } else {
          return []; 
        }
    } catch (error) {
      console.log("🚀 ~ FundService ~ getFundFamilies ~ error:", error)
      throw error;
    }
  }

  static async fetchDataFromAPI() {
    try {
      const options = {
        method: 'GET',
        url: 'https://latest-mutual-fund-nav.p.rapidapi.com/latest',
        params: {
          Scheme_Type: 'Open'
        },
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY,
          'x-rapidapi-host': 'latest-mutual-fund-nav.p.rapidapi.com'
        }
      };

      const response = await axios.request(options);
      
      if (response.data) {
        console.log("Data fetched from API");
        await CacheManager.setCache('latestNavData', response.data); 
        return response.data;
      }

      return null; // Return null if no data from API
    } catch (error) {
      console.log("🚀 ~ FundService ~ fetchDataFromAPI ~ error:", error)
      return null; // If API fails, return null for fallback
    }
  }

  static async fetchDataFromAMFI() {
    try {
      const options = {
        method: 'GET',
        url: 'https://www.amfiindia.com/spages/NAVAll.txt',
      };
  
      const response = await axios.request(options);
      if (response.data) {
        console.log("Data fetched from AMFI");
        const amfiData = FundService.parseAMFIData(response.data);
        if(amfiData){
          await CacheManager.setCache('latestNavData', amfiData); 
          return amfiData;  
        }    
      }  
      return [];
    } catch (error) {
      throw error; // If AMFI API fails, throw an error
    }
  }
  
  static parseAMFIData(data) {
    const rows = data.split('\n').slice(1);
  
    const amfiJSON = [];
  
    let Mutual_Fund_Family = null;
    rows.forEach(row => {
      // Skip empty rows or rows that consist only of whitespace
      if (!row || !row.trim()) return;
  
      // Split the row by semicolon (;) to get columns
      const columns = row.split(';');
  
      if (columns.length < 6) {
        if (columns.length === 1 && row !== 'Open Ended Schemes(Debt Scheme - Banking and PSU Fund)') {
          Mutual_Fund_Family = row;
        }
        return;
      }
      const schemeCode = columns[0].trim();
      const isinDivPayout = columns[1] ? columns[1].trim() : "";
      const isinDivReinvestment = columns[2] ? columns[2].trim() : ""; 
      const schemeName = columns[3] ? columns[3].trim() : "";
      const netAssetValue = columns[4].trim();
      const date = columns[5] ? columns[5].trim() : "";
        let family = {
          Scheme_Code: schemeCode,
          ISIN_Div_Payout_ISIN_Growth: isinDivPayout,
          ISIN_Div_Reinvestment: isinDivReinvestment,
          Scheme_Name: schemeName,
          Net_Asset_Value: netAssetValue,
          Date: date,
          Scheme_Type : "Open Ended Schemes",
          Mutual_Fund_Family: Mutual_Fund_Family.replace(/\r/g, '').trim(),
        };
        amfiJSON.push(family);
    });
  
    return amfiJSON; // Return the final parsed data
  }
  

  static async getSchemesByFamily(familyName) {
    try {
      // Fetch from cache
      const cachedData = await CacheManager.getCache('latestNavData');
      if (cachedData) {
        const filteredSchemes = cachedData.filter(
            fund => fund.Mutual_Fund_Family.toLowerCase() === familyName.toLowerCase()
        );
        return filteredSchemes.map(fund => ({
            schemeCode: fund.Scheme_Code,
            schemeName: fund.Scheme_Name,
            NAV: fund.Net_Asset_Value,
            date: fund.Date 
        }));
      }

      // If no cache, fetch fresh data from the API
      const apiData = await FundService.fetchDataFromAPI();
      console.log("🚀 ~ FundService ~ getSchemesByFamily ~ apiData:", )
      if (apiData) {
        const filteredSchemes = apiData.filter(
            fund => fund.Mutual_Fund_Family.toLowerCase() === familyName.toLowerCase()
        ); 
        return filteredSchemes.map(fund => ({
            schemeCode: fund.Scheme_Code,
            schemeName: fund.Scheme_Name,
            NAV: fund.Net_Asset_Value,
            date: fund.Date 
        }));
    }

      // If both API and cache fail, fall back to AMFI API
      const amfiData = await FundService.fetchDataFromAMFI();
      if (amfiData) {
        const filteredSchemes = amfiData.filter(
            fund => fund.Mutual_Fund_Family.toLowerCase() === familyName.toLowerCase()
        );
        return filteredSchemes.map(fund => ({
            schemeCode: fund.Scheme_Code,
            schemeName: fund.Scheme_Name,
            NAV: fund.Net_Asset_Value,
            date: fund.Date 
        }));
      }
    return []; ; // If no family found in AMFI data
    } catch (error) {
      throw error;
    }
  }
}

export default FundService;
