import PortfolioService from '../services/portfolioService.js';

class PortfolioController {
    static async addInvestment(req, res) {
        try {
            const { userId, schemeCode, schemeName, units, purchasePrice } = req.body;
            const investment = await PortfolioService.addInvestment(userId, schemeCode, schemeName, units, purchasePrice);
            res.status(200).json(investment);
        } catch (error) {
            res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
            code: error.responseCode || "300003",
            type: error.type || "ServerError",
            });
        }
    }

    static async fetchUserPortfolio(req, res) {
        try {
            const { userId } = req.query;
            const portfolio = await PortfolioService.getUserPortfolio(userId);
            res.status(200).json(portfolio);
        } catch (error) {
            res.status(error.statusCode || 500).json({
                message: error.message || "Internal Server Error",
                code: error.responseCode || "300003",
                type: error.type || "ServerError",
                });
        }
    }

    static async fetchPortfolioValue(req, res) {
        try {
            const { userId } = req.query;
            const portfolioValue = await PortfolioService.getPortfolioValue(userId);
            res.status(200).json(portfolioValue);
        } catch (error) {
            res.status(error.statusCode || 500).json({
                message: error.message || "Internal Server Error",
                code: error.responseCode || "300003",
                type: error.type || "ServerError",
                });
        }
    }
}

export default PortfolioController;
