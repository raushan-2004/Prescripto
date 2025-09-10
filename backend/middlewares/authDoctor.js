import jwt from 'jsonwebtoken';

const authDoctor = async (req, res, next) => {
    try {
        const { dtoken } = req.headers

        if (!dtoken) {
            return res.json({ success: false, message: "Unauthorized login" });
        }

        const token_decoded = jwt.verify(dtoken, process.env.JWT_SECRET);
        req.docId = token_decoded.id;

        next();
    } catch (error) {
        console.error("authDoctor error:", error);
        res.json({ success: false, message: "Internal server error" });
    }
};

export default authDoctor;
