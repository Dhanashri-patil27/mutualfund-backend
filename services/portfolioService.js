import FundsService from './fundsService.js'
import database from '../models/index.js';
import { CacheManager } from '../cacheManager/cache.js'; 
import ErrorCodes from '../errors/ErrorCodes.js';

class PortfolioService {
    static async addInvestment(userId, schemeCode, schemeName, units, purchasePrice) {
        try {
            const user = await database.users.findOne({ where: { id: userId } });
            if(!user){
                throw { ...ErrorCodes['100001'] };
            }
            const existingInvestment = await database.portfolios.findOne({
                where: {
                    userId,
                    schemeCode,
                    schemeName,
                }
            });
    
            if (existingInvestment) {
                const totalUnits = existingInvestment.units + units;
                const avgPurchasePrice = ((existingInvestment.purchasePrice * existingInvestment.units) + (purchasePrice * units)) / totalUnits;
                await existingInvestment.update({
                    units: totalUnits, 
                    purchasePrice: avgPurchasePrice, 
                    purchaseDate: new Date()
                });
                return this.getPortfolioValue(userId);
            } else {
                await database.portfolios.create({
                    userId,
                    schemeCode,
                    schemeName,
                    units,
                    purchasePrice,
                    purchaseDate: new Date()
                });
                return this.getPortfolioValue(userId);
            }
    
        } catch (error) {
            throw error;
        }
    }

    static async getUserPortfolio(userId) {
        try {
            const user = await database.users.findOne({ where: { id: userId } });
            if(!user){
                throw { ...ErrorCodes['100001'] };
            }
            const portfolio = await database.portfolios.findAll({ where: { userId } });
            return portfolio.length ? portfolio : [];
        } catch (error) {          
            throw error;
        }
    }

    static async getPortfolioValue(userId) {
        try {
            const user = await database.users.findOne({ where: { id: userId } });
            if(!user){
                throw { ...ErrorCodes['100001'] };
            }
            const investments = await database.portfolios.findAll({ where: { userId } });
            if (!investments.length) {
                return { message: "No investments found" };
            }

            // Check if cached data is available
            let fundsData = await CacheManager.getCache('latestNavData');
            if (!fundsData) {
                // Fetch fresh data from RapidAPI
                try {
                    const apiData = await FundsService.fetchDataFromAPI();
                    fundsData = apiData.data;
                    // Cache the data
                    await CacheManager.setCache('latestNavData', fundsData);
                } catch (error) {
                    fundsData = await FundsService.fetchDataFromAMFI();
                    await CacheManager.setCache('latestNavData', fundsData);
                }
            }

            let totalValue = 0;
            const portfolioDetails = await Promise.all(investments.map(async (investment) => {
                const fund = fundsData.find(f => f.Scheme_Code === investment.schemeCode);
                const latestNAV = fund ? fund.Net_Asset_Value : investment.purchasePrice;
                const currentValue = latestNAV * investment.units;
                totalValue += currentValue;

                // Update portfolio in database
                await database.portfolios.update({
                    currentValue,
                    latestNAV
                }, {
                    where: { id: investment.id }
                });

                return {
                    schemeName: investment.schemeName,
                    units: investment.units,
                    purchasePrice: investment.purchasePrice,
                    latestNAV,
                    currentValue
                };
            }));

            console.log(`Portfolio value calculated for user: ${userId}`);
            return { totalValue, portfolioDetails };

        } catch (error) {
            throw error;
        }
    }

}

export default PortfolioService;
