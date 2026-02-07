exports.validatePayment = (req, res, next) => {
    const { amount, customer_name, customer_email, items } = req.body;
    
    if (!amount || !customer_name || !customer_email || !items) {
        return res.status(400).json({ message: "Data tidak lengkap" });
    }
    
    next();
};