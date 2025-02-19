import FundsService from '../services/fundsService.js';

class FundController {
    static async fetchFundFamilies(req, res) {
        try {
            const fundFamilies = await FundsService.getFundFamilies();
            res.status(200).json(fundFamilies);
        } catch (error) {
            console.log("🚀 ~ FundController ~ fetchFundFamilies ~ error:", error)
            res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
            code: error.responseCode || "300003",
            type: error.type || "ServerError",
            });
        }
    }

    static async fetchSchemesByFamily(req, res) {
        try {
            const { family } = req.query;
            const schemes = await FundsService.getSchemesByFamily(family);
            res.status(200).json(schemes);
        } catch (error) {
            res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
            code: error.responseCode || "300003",
            type: error.type || "ServerError",
            });
        }
    }


}

export default FundController;
