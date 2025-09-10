import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers

        if (!token) {
            return res.json({ success: false, message: "Unauthorized login" });
        }

        const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = token_decoded.id;

        next();
    } catch (error) {
        console.error("authUser error:", error);
        res.json({ success: false, message: "Internal server error" });
    }
};

export default authUser;
