import cron from 'node-cron';
import database from '../models/index.js';
import FundsService from '../services/fundsService.js';

const updatePortfolioNAV = async () => {
    try {
        const portfolios = await database.portfolios.findAll();

        if (portfolios.length === 0) {
            console.log('No portfolios found to update NAV.');
            return;
        }

        let fundsData = null;
        if (!fundsData) {
            // Fetch fresh data from RapidAPI
            try {
                const apiData = await FundsService.fetchDataFromAPI();
                fundsData = apiData.data;
            } catch (error) {
                fundsData = await FundsService.fetchDataFromAMFI();
            }
        }

        for (let investment of portfolios) {
            const fund = fundsData.find(f => f.Scheme_Code === investment.schemeCode);
            const latestNAV = fund ? fund.Net_Asset_Value : investment.purchasePrice;
            const currentValue = latestNAV * investment.units;

            await investment.update({
                currentValue,
                latestNAV
            });

            console.log(`Updated NAV for scheme: ${investment.schemeName}`);
        }
    } catch (error) {
        console.error('Error updating portfolio NAV:', error);
        throw error;
    }
};

const cronJob = cron.schedule('0 * * * *', async () => {
    console.log('Running scheduled job to update portfolio NAV...');
    await updatePortfolioNAV();
}, {
    scheduled: true
});

export default cronJob;
