import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomToken = token.length < 500;

    if (token && isCustomToken) {
      const decodeData = jwt.decode(token, "secretKey");

      req.userId = decodeData?.id;
    } else {
      const decodeData = jwt.decode(token);

      req.userId = decodeData?.sub;
    }

    next();
  } catch (error) {
    console.log(error);
  }
};
