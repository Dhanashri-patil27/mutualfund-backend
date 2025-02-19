export const asyncErrorHandler = (func) => async (req, res, next) => {
    try {
        await func(req, res, next);
    } catch (error) {
        const { request_id } = req;
        const code = error.statusCode || 500;
        const responseObj = { request_id, code, message: error.message };

        if (error.responseCode) {
            res.setHeader('x-response-code', error.responseCode);
            responseObj.response_code = error.responseCode;
        }

        res.status(code).send(responseObj);

        next(error);
    }
};
