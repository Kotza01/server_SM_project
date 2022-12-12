import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

/**User login function */
export const singIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res.status(404).json({ message: "The user doesn´t exist." });

    const isCorrect = await bcrypt.compare(password, existingUser.password);

    if (!isCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    /**Jwt sing
     * first parameter: user data as the email and id
     * Second parameter: secret key, should be save in env doc or in a safety place
     * thirt parameter: expiration time of the token
     */
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "secretKey",
      { expiresIn: "1h" }
    );

    res.json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "something went wrong in the server" });
  }
};

export const singUp = async (req, res) => {
  const { firstName, lastName, password, confirmPassword, email } = req.body;

  try {
    const existPerson = await User.findOne({ email });

    if (existPerson)
      return res.status(400).json({ message: "Email already exists" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Password don´t match" });

    const encrypPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      password: encrypPassword,
    });

    const token = jwt.sign({ email, id: result._id }, "secretKey", {
      expiresIn: "1h",
    });

    res.json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "somethin went wrong" });
  }
};
