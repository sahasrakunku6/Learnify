import { admin, db } from "../config/firebaseAdmin.js";
import {
  isNonEmptyString,
  isValidEmail,
  isValidPassword,
  isValidRole,
} from "../utils/validators.js";

export const signup = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password, phone_no, role, dob, education_lvl, subject } = req.body;

    if (!isNonEmptyString(first_name) || !isNonEmptyString(last_name)) {
      return res.status(400).json({ error: "First name and last name are required." });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Valid email is required." });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    if (!isNonEmptyString(phone_no)) {
      return res.status(400).json({ error: "Phone number is required." });
    }

    if (!isValidRole(role)) {
      return res.status(400).json({ error: "Role must be either learner or teacher." });
    }

    if (role === "learner" && !isNonEmptyString(education_lvl)) {
      return res.status(400).json({ error: "Education level is required for learners." });
    }

    if (role === "teacher" && !isNonEmptyString(subject)) {
      return res.status(400).json({ error: "Subject is required for teachers." });
    }

    const existingUser = await admin.auth().getUserByEmail(email).catch(() => null);
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered!" });
    }

    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${first_name} ${last_name}`,
    });

    const userData = {
      uid: userRecord.uid,
      first_name,
      last_name,
      phone_no: phone_no || "",
      role,
      createdAt: admin.firestore.Timestamp.now(),
    };

    if (role === "learner") {
      let dobTimestamp = null;
      if (dob) {
        dobTimestamp = admin.firestore.Timestamp.fromDate(new Date(dob));
      }
      userData.dob = dobTimestamp;
      userData.education_lvl = education_lvl;
    } else if (role === "teacher") {
      userData.subject = subject;
    }

    await db.collection("Users").doc(userRecord.uid).set(userData);

    res.status(201).json({ message: "User signed up successfully!" });
  } catch (error) {
    next(error);
  }
};

export const teacherOnly = (req, res) => {
  res.json({ message: "Welcome teacher!", user: req.user });
};