import asyncHandler from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const jwtverify = asyncHandler(async (req, res, next) => {
    const accesstoken =
        req.cookies?.accesstoken ||
        req.headers.authorization?.replace("Bearer ", "") ||
        req.headers["authorization"]?.replace("Bearer ", "");

    if (!accesstoken) {
        return res.status(401).json({
            statusCode: 401,
            message: "No token provided",
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(accesstoken, process.env.ACCESS_TOKEN_SECRET);
    } catch {
        return res.status(401).json({
            statusCode: 401,
            message: "Invalid or expired token",
        });
    }

    const user = await User.findById(decoded?._id || decoded?.id).select(
        "-password -refreshtoken"
    );

    if (!user) {
        return res.status(401).json({
            statusCode: 401,
            message: "Invalid access token",
        });
    }

    req.user = user;
    next();
});

export { jwtverify };
