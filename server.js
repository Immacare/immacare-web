// // const express = require("express");
// const nodemailer = require("nodemailer");
// const crypto = require("crypto");
// const path = require("path");
// const bodyParser = require("body-parser");
// // const cors = require("cors"); // ✅ Fix for CORS
// // const mysql = require("mysql"); // ✅ Fix added
// // const app = express();
// const express = require("express");
// const cors = require("cors");
// const mysql = require("mysql2");
// const bcrypt = require("bcryptjs");
// const session = require("express-session");

// const app = express();

// // app.use(cors()); // Enable CORS
// // app.use(bodyParser.json());
// // app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const db = mysql.createConnection({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASS || "",
//   database: process.env.DB_NAME || "immacare_db",
//   port: process.env.DB_PORT || 3306,
// });
// db.connect((err) => {
//   if (err) {
//     console.error("❌ Database connection failed:", err);
//   } else {
//     console.log("✅ Connected to MySQL database");
//   }
// });

// app.get("/", (req, res) => {
//   res.send("ImmaCare API is live 🚀");
// });

// app.use(express.static(path.join(__dirname, "web_immacare")));
// app.use(
//   "/bootstrap",
//   express.static(path.join(__dirname, "node_modules/bootstrap/dist"))
// );
// app.use(
//   "/bootstrap-icons",
//   express.static(__dirname + "/node_modules/bootstrap-icons")
// );
// app.use(
//   "/datatables.net",
//   express.static(__dirname + "/node_modules/datatables.net")
// );
// app.use(
//   "/datatables.net-dt",
//   express.static(__dirname + "/node_modules/datatables.net-dt")
// );
// app.use("/jquery", express.static(__dirname + "/node_modules/jquery/dist"));
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "web_immacare", "main.html"));
// });

// // const PORT = 3000;
// // app.listen(PORT, () => {
// //   console.log(`Server is running at http://localhost:${PORT}/login/login.html`);
// // });
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running at http://localhost:${PORT}/login/login.html`);
// });
// // Middleware
// app.use(bodyParser.json());
// app.use(cors()); // Allow all origins for simplicity; configure for production
// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static("public"));

// // Create MySQL connection
// const connection = mysql.createConnection({
//   host: "localhost", // or your DB host
//   user: "root", // your MySQL username
//   password: "", // your MySQL password
//   database: "immacare_db", // your database name
// });

// // Connect to database
// connection.connect((err) => {
//   if (err) {
//     console.error("DB connection failed: ", err);
//     return;
//   }
//   console.log("Connected to MySQL database");
// });

// // Login API endpoint

// // const bcrypt = require("bcryptjs");
// // const session = require("express-session");

// app.use(
//   session({
//     secret: "your-secret-key", // use a strong secret in production, store safely
//     resave: false, // don't save session if unmodified
//     saveUninitialized: false, // don't create session until something stored
//     cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day (in milliseconds)
//   })
// );

// app.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).send({ message: "email and password are required" });
//   }
//   // First, check account_info
//   const query = "SELECT * FROM account_info WHERE email = ? and status = 1";
//   connection.query(query, [email], (err, results) => {
//     if (err) return res.status(500).send({ message: "Database error" });
//     if (results.length === 0) {
//       return res.status(401).send({ message: "Invalid credentials" });
//     }

//     const user = results[0];

//     bcrypt.compare(password, user.password, (err, isMatch) => {
//       if (err)
//         return res.status(500).send({ message: "Error checking password" });

//       if (!isMatch) {
//         return res.status(401).send({ message: "Invalid credentials" });
//       }

//       // Now fetch personal info from users_info
//       const userInfoQuery =
//         "SELECT * FROM users_info WHERE id = ? and status = 1";
//       connection.query(
//         userInfoQuery,
//         [user.user_id],
//         (err, userInfoResults) => {
//           if (err)
//             return res
//               .status(500)
//               .send({ message: "Error fetching user info" });

//           const userInfo = userInfoResults[0];

//           req.session.userId = user.id;
//           req.session.email = user.email;
//           req.session.phone = user.phone;
//           req.session.user_id_id = userInfo.id;
//           req.session.firstname = userInfo.firstname;
//           req.session.lastname = userInfo.lastname;
//           req.session.middlename = userInfo.middlename;
//           req.session.gender = userInfo.gender;
//           req.session.birthdate = userInfo.birthdate;
//           req.session.age = userInfo.age;
//           req.session.role = userInfo.role;

//           res.send({
//             message: "Login successful",
//             user: {
//               id: user.id,
//               email: user.email,
//               firstname: userInfo.firstname,
//               lastname: userInfo.lastname,
//               middlename: userInfo.middlename,
//               gender: userInfo.gender,
//               birthdate: userInfo.birthdate,
//               age: userInfo.age,
//               role: userInfo.role,
//               phone: user.phone,
//               user_id_id: userInfo.id,
//             },
//           });
//         }
//       );
//     });
//   });
// });

// const saltRounds = 10;
// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// // app.post("/register", (req, res) => {
// //   const {
// //     firstname,
// //     middlename,
// //     lastname,
// //     gender,
// //     birthdate,
// //     age,
// //     phone,
// //     email,
// //     password,
// //   } = req.body;

// //   if (!firstname || !lastname || !gender || !birthdate || !email || !password) {
// //     return res.status(400).send({ message: "All fields are required" });
// //   }

// //   if (!emailRegex.test(email)) {
// //     return res.status(400).send({ message: "Invalid email format" });
// //   }

// //   // 1. Check if email already exists
// //   const checkEmailQuery = "SELECT * FROM account_info WHERE email = ?";
// //   connection.query(checkEmailQuery, [email], (err, results) => {
// //     if (err) {
// //       return res
// //         .status(500)
// //         .send({ message: "Database error during email check" });
// //     }
// //     if (results.length > 0) {
// //       return res.status(409).send({ message: "Email already in use" });
// //     }

// //     // 2. Begin Transaction
// //     connection.beginTransaction((err) => {
// //       if (err) {
// //         return res.status(500).send({ message: "Transaction start failed" });
// //       }

// //       const userInsertQuery = `
// //         INSERT INTO users_info (firstname, middlename, lastname, gender, birthdate, age, role, status)
// //         VALUES (?, ?, ?, ?, ?, ?, 'patient', 1)
// //       `;
// //       const userValues = [
// //         firstname,
// //         middlename || null,
// //         lastname,
// //         gender,
// //         birthdate,
// //         age,
// //       ];

// //       connection.query(userInsertQuery, userValues, (err, userResult) => {
// //         if (err) {
// //           return connection.rollback(() => {
// //             res.status(500).send({ message: "Error inserting user info" });
// //           });
// //         }

// //         const userId = userResult.insertId;

// //         // Hash password
// //         bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
// //           if (err) {
// //             return connection.rollback(() => {
// //               res.status(500).send({ message: "Error hashing password" });
// //             });
// //           }

// //           const accountInsertQuery = `
// //             INSERT INTO account_info (user_id, phone, email, password, status)
// //             VALUES (?, ?, ?, ?, 1)
// //           `;
// //           const accountValues = [userId, phone, email, hashedPassword];

// //           connection.query(
// //             accountInsertQuery,
// //             accountValues,
// //             (err, accountResult) => {
// //               if (err) {
// //                 return connection.rollback(() => {
// //                   res
// //                     .status(500)
// //                     .send({ message: "Error inserting account info" });
// //                 });
// //               }

// //               // 3. Commit Transaction
// //               connection.commit((err) => {
// //                 if (err) {
// //                   return connection.rollback(() => {
// //                     res.status(500).send({ message: "Commit failed" });
// //                   });
// //                 }

// //                 res.send({
// //                   message: "User registered successfully",
// //                   userId,
// //                   accountId: accountResult.insertId,
// //                 });
// //               });
// //             }
// //           );
// //         });
// //       });
// //     });
// //   });
// // });

// // To create a session
// app.post("/register", (req, res) => {
//   const { email, password, name } = req.body;

//   if (!email || !password || !name)
//     return res.status(400).json({ message: "All fields are required" });

//   const hashedPassword = bcrypt.hashSync(password, 10);

//   db.query(
//     "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
//     [email, hashedPassword, name],
//     (err, result) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ message: "Registration failed" });
//       }
//       res.json({ message: "Registration successful" });
//     }
//   );
// });

// app.get("/homepage", (req, res) => {
//   if (!req.session.userId) {
//     return res.status(401).send({ message: "Unauthorized: Please login" });
//   }

//   // User is authenticated
//   res.send({
//     message: `Welcome user ${req.session.email}`,
//     email: req.session.email,
//     phone: req.session.phone,
//     firstname: req.session.firstname,
//     lastname: req.session.lastname,
//     user_id: req.session.userId,
//     middlename: req.session.middlename,
//     gender: req.session.gender,
//     birthdate: req.session.birthdate,
//     age: req.session.age,
//     role: req.session.role,
//     user_id_id: req.session.user_id_id,
//   });
// });

// app.post("/login", (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password)
//     return res.status(400).json({ message: "Email and password required" });

//   db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
//     if (err) return res.status(500).json({ message: "Server error" });
//     if (results.length === 0)
//       return res.status(401).json({ message: "Invalid credentials" });

//     const user = results[0];
//     const validPass = bcrypt.compareSync(password, user.password);

//     if (!validPass)
//       return res.status(401).json({ message: "Invalid credentials" });

//     res.json({ message: "Login successful", user });
//   });
// });

// app.get("/users", (req, res) => {
//   db.query("SELECT * FROM users", (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ message: "Failed to fetch users" });
//     }
//     res.json(results);
//   });
// });

// // Example booking route (customize later)
// app.post("/book", (req, res) => {
//   const { user_id, service, appointment_date } = req.body;
//   if (!user_id || !service || !appointment_date)
//     return res.status(400).json({ message: "Missing required fields" });

//   db.query(
//     "INSERT INTO appointments (user_id, service, appointment_date) VALUES (?, ?, ?)",
//     [user_id, service, appointment_date],
//     (err, result) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ message: "Booking failed" });
//       }
//       res.json({ message: "Appointment booked successfully" });
//     }
//   );
// });

// // ========================
// // START SERVER
// // ========================
// // const PORT = process.env.PORT || 3000;
// // app.listen(PORT, () => {
// //   console.log(`✅ Server running on port ${PORT}`);
// // });

// app.post("/logout", (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       return res.status(500).send({ message: "Logout failed" });
//     }
//     res.send({ message: "Logged out successfully" });
//   });
// });

// // GET ALL USERS TABLE- in User Access Management
// app.get("/users", (req, res) => {
//   const { role, fullname } = req.query;

//   let query = `
//     SELECT
//       u.id as user_id,
//       u.role,
//       CONCAT(u.firstname, ' ', u.lastname) as fullname,
//       CASE WHEN a.status = 1 THEN 'Active' ELSE 'Inactive' END as status,
//       a.email as username,
//       DATE_FORMAT(a.updated_date, '%m-%d-%Y') AS updated_date
//     FROM account_info a
//     JOIN users_info u ON a.user_id = u.id
//     WHERE u.role != 'admin'
//   `;

//   const params = [];

//   if (role) {
//     query += ` AND u.role = ?`;
//     params.push(role);
//   }

//   if (fullname) {
//     query += ` AND CONCAT(u.firstname, ' ' , u.lastname) LIKE ?`;
//     params.push(`%${fullname}%`);
//   }
//   connection.query(query, params, (err, results) => {
//     if (err) return res.status(500).json({ message: "Database error" });

//     res.json({ data: results }); // DataTables expects data inside "data" key
//   });
// });

// app.get("/users_update/:id", (req, res) => {
//   const userId = req.params.id;

//   const query = `
//     SELECT
//       u.id AS user_id,
//       CONCAT(u.firstname, ' ', u.lastname) AS fullname,
//       u.firstname,
//       u.middlename,
//       u.lastname,
//       DATE_FORMAT(u.birthdate, '%m-%d-%Y') AS birthdate,
//       u.gender,
//       u.role,
//       a.email AS username,
//       CASE WHEN a.status = 1 THEN 'Active' ELSE 'Inactive' END AS status,
//       DATE_FORMAT(a.updated_date, '%m-%d-%Y') AS updated_date
//     FROM account_info a
//     JOIN users_info u ON a.user_id = u.id
//     WHERE u.role != 'admin' AND u.id = ?
//   `;

//   connection.query(query, [userId], (err, results) => {
//     if (err) return res.status(500).json({ message: "Database error" });

//     res.json({ data: results });
//   });
// });

// // POST - Update account_info by user ID
// app.post("/updateUserAccount", (req, res) => {
//   const { user_id, email, password, status } = req.body;

//   const query = `
//     UPDATE account_info
//     SET email = ?, password = ?, status = ?, updated_date = NOW()
//     WHERE id = ?
//   `;

//   bcrypt.hash(password, saltRounds, (err, password) => {
//     if (err) {
//       return connection.rollback(() => {
//         res.status(500).send({ message: "Error hashing password" });
//       });
//     }

//     connection.query(
//       query,
//       [email, password, status, user_id],
//       (err, result) => {
//         if (err) {
//           console.error("Update error:", err);
//           return res.status(500).json({ message: "Update failed" });
//         }

//         res.json({ message: "User account updated successfully" });
//       }
//     );
//   });
// });

// // BOOKING APPOINTMENT - INSERT BOOKING

// app.post("/book-appointment", (req, res) => {
//   const {
//     user_id,
//     firstname,
//     middlename,
//     lastname,
//     gender,
//     birthdate,
//     age,
//     civil_status,
//     mobile_number,
//     email_address,
//     home_address,
//     emergency_name,
//     emergency_relationship,
//     emergency_mobile_number,
//     bloodtype,
//     allergies,
//     current_medication,
//     past_medical_condition,
//     chronic_illness,
//     consultation_type,
//     booking_date,
//     booking_time,
//     status,
//     doctor_id,
//   } = req.body;

//   if (
//     !firstname ||
//     !lastname ||
//     !gender ||
//     !birthdate ||
//     !age ||
//     !civil_status
//   ) {
//     return res.status(400).send({ message: "Missing required patient info" });
//   }

//   // Step 1: Check if user_id already exists
//   const checkUserQuery = "SELECT id FROM patient_info WHERE user_id = ?";
//   connection.query(checkUserQuery, [user_id], (err, results) => {
//     if (err) {
//       console.error("Error checking user_id:", err);
//       return res.status(500).send({ message: "Database error" });
//     }

//     const isExisting = results.length > 0;

//     const patientValues = [
//       firstname,
//       middlename,
//       lastname,
//       gender,
//       birthdate,
//       age,
//       civil_status,
//       mobile_number,
//       email_address,
//       home_address,
//       emergency_name,
//       emergency_relationship,
//       emergency_mobile_number,
//       bloodtype,
//       allergies,
//       current_medication,
//       past_medical_condition,
//       chronic_illness,
//     ];

//     const proceedWithBooking = (patientId) => {
//       const insertBookingQuery = `
//         INSERT INTO appointment_booking (
//           patient_id, consultation_type, booking_date, booking_time, status, doctor_id
//         ) VALUES (?, ?, ?, ?, ?, ?)
//       `;
//       const bookingValues = [
//         patientId,
//         consultation_type,
//         booking_date,
//         booking_time,
//         status || "Pending",
//         doctor_id,
//       ];

//       connection.query(
//         insertBookingQuery,
//         bookingValues,
//         (err, bookingResult) => {
//           if (err) {
//             console.error("Error inserting booking:", err);
//             return res.status(500).send({ message: "Error saving booking" });
//           }

//           return res.send({
//             message: "Appointment booked successfully",
//             appointment_id: bookingResult.insertId,
//             patient_id: patientId,
//           });
//         }
//       );
//     };

//     if (isExisting) {
//       const patientId = results[0].id;

//       const updateQuery = `
//         UPDATE patient_info SET
//           firstname = ?, middlename = ?, lastname = ?, gender = ?, birthdate = ?, age = ?, civil_status = ?,
//           mobile_number = ?, email_address = ?, home_address = ?,
//           emergency_name = ?, emergency_relationship = ?, emergency_mobile_number = ?,
//           bloodtype = ?, allergies = ?, current_medication = ?, past_medical_condition = ?, chronic_illness = ?
//         WHERE user_id = ?
//       `;

//       connection.query(updateQuery, [...patientValues, user_id], (err) => {
//         if (err) {
//           console.error("Error updating patient:", err);
//           return res
//             .status(500)
//             .send({ message: "Error updating patient info" });
//         }

//         proceedWithBooking(patientId);
//       });
//     } else {
//       const insertPatientQuery = `
//         INSERT INTO patient_info (
//           user_id, firstname, middlename, lastname, gender, birthdate, age, civil_status,
//           mobile_number, email_address, home_address,
//           emergency_name, emergency_relationship, emergency_mobile_number,
//           bloodtype, allergies, current_medication, past_medical_condition, chronic_illness
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `;

//       connection.query(
//         insertPatientQuery,
//         [user_id, ...patientValues],
//         (err, result) => {
//           if (err) {
//             console.error("Error inserting patient:", err);
//             return res
//               .status(500)
//               .send({ message: "Error saving patient info" });
//           }

//           proceedWithBooking(result.insertId);
//         }
//       );
//     }
//   });
// });

// // DASHBOARD - NO. OF BOOKED
// app.get("/appointment-count", (req, res) => {
//   const query =
//     "SELECT COUNT(*) AS total_booked FROM appointment_booking WHERE status = 'booked'";

//   connection.query(query, (err, result) => {
//     if (err) {
//       console.error("Database error:", err);
//       return res.status(500).send({ message: "Database query failed" });
//     }

//     const count = result[0].total_booked;
//     res.send({
//       message: "Count fetched successfully",
//       total_booked: count,
//     });
//   });
// });

// // DASHBOARD - NO. OF PATIENTS TODAY
// app.get("/appointment-count-today", (req, res) => {
//   const query =
//     "SELECT COUNT(*) AS total_booked_today FROM appointment_booking WHERE status = 'Booked'AND STR_TO_DATE(booking_date, '%m-%d-%Y') = CURDATE()";

//   connection.query(query, (err, result) => {
//     if (err) {
//       console.error("Database error:", err);
//       return res.status(500).send({ message: "Database query failed" });
//     }

//     const count = result[0].total_booked_today;
//     res.send({
//       message: "Count fetched successfully",
//       total_booked_today: count,
//     });
//   });
// });

// // DASHBOARD - NO. OF OVERALL PATIENTS
// app.get("/overall_patients", (req, res) => {
//   const query = "SELECT COUNT(*) as patient_count FROM `patient_info` ";

//   connection.query(query, (err, result) => {
//     if (err) {
//       console.error("Database error:", err);
//       return res.status(500).send({ message: "Database query failed" });
//     }

//     const count = result[0].patient_count;
//     res.send({
//       message: "Count fetched successfully",
//       patient_count: count,
//     });
//   });
// });

// // DASHBOARD - NO. OF ITEMS in INVENTORY
// app.get("/item-inventory-count", (req, res) => {
//   const query = "SELECT COUNT(*) as patient_count FROM `inventory` ";

//   connection.query(query, (err, result) => {
//     if (err) {
//       console.error("Database error:", err);
//       return res.status(500).send({ message: "Database query failed" });
//     }

//     const count = result[0].patient_count;
//     res.send({
//       message: "Count fetched successfully",
//       inventory_count: count,
//     });
//   });
// });

// // GET LIST OF BOOKING
// app.get("/getBookingList", (req, res) => {
//   const query = `
//     SELECT
//         a.patient_id,
//         a.id,
//         a.consultation_type,
//         a.booking_date,
//         a.booking_time,
//         a.status,
//         a.queue_no,
//         CONCAT(b.firstname, ' ', b.lastname) AS fullname,
//         b.gender,
//         b.age FROM appointment_booking a
//         INNER JOIN patient_info b on a.patient_id = b.id
//   `;

//   connection.query(query, (err, results) => {
//     if (err) return res.status(500).json({ message: "Database error" });

//     res.json({ data: results });
//   });
// });

// // GET BOOKING DETAILS / VIEW BOOKING
// app.get("/getBookingListById/:id", (req, res) => {
//   const id = req.params.id;

//   const query = `
//     SELECT
//         a.patient_id,
//         a.id,
//         a.consultation_type,
//         a.booking_date,
//         a.booking_time,
//         a.status,
//         a.queue_no,
//         CONCAT(b.firstname, ' ', b.lastname) AS fullname,
//         b.gender,
//         b.age FROM appointment_booking a
//         INNER JOIN patient_info b on a.patient_id = b.id
//         WHERE a.id = ?
//   `;

//   connection.query(query, [id], (err, results) => {
//     if (err) return res.status(500).json({ message: "Database error" });

//     res.json({ data: results });
//   });
// });

// // CREATING QUEUE NUMBER
// app.post("/generateQueueNumber/:id", (req, res) => {
//   const bookingId = req.params.id;

//   const today = new Date().toISOString().slice(0, 10);
//   // Select latest queue_no for today only
//   const getLatestQueueQuery = `
//     SELECT queue_no FROM appointment_booking
//     WHERE DATE(updated_date) = ?
//     AND queue_no REGEXP '^[0-9]+$'
//     ORDER BY CAST(queue_no AS UNSIGNED) DESC
//     LIMIT 1
//   `;

//   connection.query(getLatestQueueQuery, [today], (err, results) => {
//     if (err) {
//       return res.status(500).json({ message: "Database error (select)" });
//     }

//     let newQueueNo;

//     if (results.length === 0) {
//       // No queue numbers for today yet — start at 001
//       newQueueNo = "001";
//     } else {
//       // Get latest number and increment
//       const raw = results[0].queue_no?.toString().trim();
//       const latest = Number(raw);

//       if (isNaN(latest)) {
//         return res
//           .status(400)
//           .json({ message: "Invalid latest queue number in DB" });
//       }

//       newQueueNo = (latest + 1).toString().padStart(3, "0");
//     }

//     const updateQuery = `
//       UPDATE appointment_booking
//       SET queue_no = ?, status = 'In Queue', updated_date = NOW()
//       WHERE id = ?
//     `;

//     connection.query(
//       updateQuery,
//       [newQueueNo, bookingId],
//       (err, updateResult) => {
//         if (err) {
//           return res.status(500).json({ message: "Database error (update)" });
//         }

//         res.json({
//           message: "Queue number generated successfully",
//           queue_no: newQueueNo,
//         });
//       }
//     );
//   });
// });

// function toMySQLDateFormat(dateStr) {
//   const [mm, dd, yyyy] = dateStr.split("-");
//   return `${yyyy}-${mm}-${dd}`;
// }

// // GET LIST OF BOOKING WITH SEARCH CRITERIA
// app.get("/getBookingListSearch", (req, res) => {
//   const { booking_date, status, fullname, consultation_type, role, user_id } =
//     req.query;
//   let query = `
//     SELECT
//       a.patient_id,
//       a.id,
//       a.consultation_type,
//       a.booking_date,
//       a.booking_time,
//       a.status,
//       a.queue_no,
//       CONCAT(b.firstname,' ', b.lastname) AS fullname,
//       b.gender,
//       b.age,
//       b.user_id as patient_user_id
//     FROM appointment_booking a
//     INNER JOIN patient_info b ON a.patient_id = b.id
//     WHERE 1=1
//   `;

//   const params = [];

//   if (booking_date) {
//     query += ` AND a.booking_date = ?`;
//     params.push(booking_date);
//   }
//   if (status) {
//     query += ` AND a.status = ?`;
//     params.push(status);
//   }

//   if (fullname) {
//     query += ` AND CONCAT(b.firstname,' ', b.lastname) LIKE ?`;
//     params.push(`%${fullname}%`);
//   }

//   if (consultation_type) {
//     query += ` AND a.consultation_type = ?`;
//     params.push(consultation_type);
//   }

//   // Add role-based filter
//   if (role === "patient" && user_id) {
//     query += ` AND b.user_id = ?`;
//     params.push(user_id);
//   }

//   if (role === "doctor" && user_id) {
//     query += ` AND a.doctor_id = ? AND a.status = ?`;
//     params.push(user_id, "In Queue");
//   }

//   connection.query(query, params, (err, results) => {
//     if (err)
//       return res.status(500).json({ message: "Database error", error: err });

//     res.json({ data: results });
//   });
// });

// // SAVE INVENTORY
// app.post("/saveInventoryItem", (req, res) => {
//   const { addItem, addCategory, addQuantity, addMinimum, addPrice } = req.body;

//   // Step 1: Check if item already exists (case-insensitive)
//   const checkQuery = `
//     SELECT * FROM inventory WHERE LOWER(item) = LOWER(?)
//   `;

//   connection.query(checkQuery, [addItem], (checkErr, results) => {
//     if (checkErr) {
//       console.error("Check error:", checkErr);
//       return res.status(500).json({ message: "Error checking item" });
//     }

//     if (results.length > 0) {
//       return res.status(400).json({ message: "Item already listed" });
//     }

//     // Step 2: Insert new item
//     const insertQuery = `
//       INSERT INTO inventory (item, category, quantity, average_quantity, price, status)
//       VALUES (?, ?, ?, ?, ?,
//         CASE
//           WHEN ? = 0 THEN 'out of stock'
//           WHEN ? < ? THEN 'for reorder'
//           ELSE 'in stock'
//         END
//       )
//     `;

//     connection.query(
//       insertQuery,
//       [
//         addItem,
//         addCategory,
//         addQuantity,
//         addMinimum,
//         addPrice,
//         addQuantity,
//         addQuantity,
//         addMinimum,
//       ],
//       (insertErr, result) => {
//         if (insertErr) {
//           console.error("Insert error:", insertErr);
//           return res.status(500).json({ message: "Insert failed" });
//         }

//         res.json({ message: "Inventory item added successfully" });
//       }
//     );
//   });
// });

// // GET LIST OF INVENTORY WITH CRITERIA
// app.get("/getInventory", (req, res) => {
//   const { item, status } = req.query;
//   let query = `
//     SELECT
//       a.id, a.item, b.category, a.quantity, a.average_quantity, a.price, a.status
//     FROM inventory a
//     INNER JOIN inventory_category b ON b.id = a.category
//     WHERE 1 = 1
//   `;

//   const params = [];

//   if (item) {
//     query += ` AND (a.item LIKE ? OR b.category LIKE ?)`;
//     params.push(`%${item}%`, `%${item}%`);
//   }

//   if (status) {
//     query += ` AND a.status = ?`;
//     params.push(status);
//   }

//   connection.query(query, params, (err, results) => {
//     if (err) return res.status(500).json({ message: "Database error" });

//     res.json({ data: results }); // DataTables expects data inside "data" key
//   });
// });

// app.get("/getItemInventoryByID/:id", (req, res) => {
//   const id = req.params.id;

//   const query = `
//    SELECT
//       a.id, a.item, b.category, a.category as category_id, a.quantity, a.average_quantity, a.price, a.status
//     FROM inventory a
//     INNER JOIN inventory_category b ON b.id = a.category
//     WHERE a.id = ?
//   `;

//   connection.query(query, [id], (err, results) => {
//     if (err) return res.status(500).json({ message: "Database error" });

//     res.json({ data: results });
//   });
// });

// app.post("/updateInventory", (req, res) => {
//   const {
//     id,
//     updateItemName,
//     updateCategory,
//     updateQuantity,
//     updateMinimum,
//     updatePrice,
//   } = req.body;

//   const query = `
//     UPDATE inventory
//     SET
//       item = ?,
//       category = ?,
//       quantity = ?,
//       average_quantity = ?,
//       price = ?,
//       status = CASE
//                  WHEN ? = 0 THEN 'out of stock'
//                  WHEN ? < ? THEN 'for reorder'
//                  ELSE 'in stock'
//                END
//     WHERE id = ?
//   `;

//   connection.query(
//     query,
//     [
//       updateItemName,
//       updateCategory,
//       updateQuantity,
//       updateMinimum,
//       updatePrice,
//       updateQuantity,
//       updateQuantity,
//       updateMinimum, // for CASE logic
//       id,
//     ],
//     (err, result) => {
//       if (err) {
//         console.error("Update error:", err);
//         return res.status(500).json({ message: "Inventory update failed" });
//       }

//       res.json({ message: "Inventory updated successfully" });
//     }
//   );
// });

// app.post("/createAccount", (req, res) => {
//   const {
//     firstname,
//     middlename,
//     lastname,
//     gender,
//     birthdate,
//     email,
//     password,
//     role,
//     status,
//   } = req.body;

//   const checkEmailQuery = "SELECT * FROM account_info WHERE email = ?";

//   connection.query(checkEmailQuery, [email], (err, results) => {
//     if (err) {
//       return res
//         .status(500)
//         .send({ message: "Database error during email check" });
//     }

//     if (results.length > 0) {
//       return res.status(409).send({ message: "Email already in use" });
//     }

//     connection.beginTransaction((err) => {
//       if (err) {
//         return res.status(500).send({ message: "Transaction start failed" });
//       }

//       const userInsertQuery = `
//         INSERT INTO users_info (firstname, middlename, lastname, gender, birthdate, status, role)
//         VALUES (?, ?, ?, ?, ?, ?, ?)
//       `;
//       const userValues = [
//         firstname,
//         middlename || null,
//         lastname,
//         gender,
//         birthdate,
//         status,
//         role,
//       ];

//       connection.query(userInsertQuery, userValues, (err, userResult) => {
//         if (err) {
//           return connection.rollback(() => {
//             res.status(500).send({ message: "Error inserting user info" });
//           });
//         }

//         const userId = userResult.insertId;

//         bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
//           if (err) {
//             return connection.rollback(() => {
//               res.status(500).send({ message: "Error hashing password" });
//             });
//           }

//           const accountInsertQuery = `
//             INSERT INTO account_info (user_id, email, password, status)
//             VALUES (?, ?, ?, ?)
//           `;
//           const accountValues = [userId, email, hashedPassword, status];

//           connection.query(
//             accountInsertQuery,
//             accountValues,
//             (err, accountResult) => {
//               if (err) {
//                 return connection.rollback(() => {
//                   res
//                     .status(500)
//                     .send({ message: "Error inserting account info" });
//                 });
//               }

//               const accountId = accountResult.insertId;

//               // If doctor, insert into doctors_profile first
//               if (role.toLowerCase() === "doctor") {
//                 const doctorInsertQuery = `
//                 INSERT INTO doctors_profile (user_id)
//                 VALUES (?)
//               `;
//                 connection.query(
//                   doctorInsertQuery,
//                   [userId],
//                   (err, doctorResult) => {
//                     if (err) {
//                       return connection.rollback(() => {
//                         res
//                           .status(500)
//                           .send({ message: "Error inserting doctor profile" });
//                       });
//                     }

//                     const doctorProfileId = doctorResult.insertId;

//                     connection.commit((err) => {
//                       if (err) {
//                         return connection.rollback(() => {
//                           res.status(500).send({ message: "Commit failed" });
//                         });
//                       }

//                       res.send({
//                         message: "Doctor account created successfully",
//                         userId,
//                         accountId,
//                         doctorProfileId,
//                       });
//                     });
//                   }
//                 );
//               } else {
//                 // If not doctor, just commit and send response
//                 connection.commit((err) => {
//                   if (err) {
//                     return connection.rollback(() => {
//                       res.status(500).send({ message: "Commit failed" });
//                     });
//                   }

//                   res.send({
//                     message: "User created successfully",
//                     userId,
//                     accountId,
//                   });
//                 });
//               }
//             }
//           );
//         });
//       });
//     });
//   });
// });

// app.post("/updateDoctorPassword", (req, res) => {
//   const { user_id, password } = req.body;

//   // Step 1: Hash the new password
//   bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
//     if (err) {
//       console.error("Error hashing password:", err);
//       return res.status(500).send({ message: "Error hashing password" });
//     }

//     // Step 2: Run the UPDATE query with the hashed password
//     const query = `
//       UPDATE account_info
//       SET password = ?, updated_date = NOW()
//       WHERE id = ?
//     `;

//     connection.query(query, [hashedPassword, user_id], (err, result) => {
//       if (err) {
//         console.error("Update error:", err);
//         return res.status(500).json({ message: "Update failed" });
//       }

//       res.json({ message: "User password updated successfully" });
//     });
//   });
// });

// app.post("/updateDoctorInfo", (req, res) => {
//   const {
//     user_id,
//     firstname,
//     middlename,
//     lastname,
//     gender,
//     birthdate,
//     age,
//     contactNumber,
//     emailAddress,
//     specialty,
//     department,
//     yearsofexp,
//     professionalBoard,
//     certificate,
//     status,
//   } = req.body;

//   connection.beginTransaction((err) => {
//     if (err) {
//       console.error("Transaction start error:", err);
//       return res.status(500).json({ message: "Failed to start transaction" });
//     }

//     const updateUsersQuery = `
//       UPDATE users_info
//       SET firstname = ?, middlename = ?, lastname = ?, gender = ?, birthdate = ?, age = ?
//       WHERE id = ?
//     `;

//     connection.query(
//       updateUsersQuery,
//       [firstname, middlename, lastname, gender, birthdate, age, user_id],
//       (err, usersResult) => {
//         if (err) {
//           return connection.rollback(() => {
//             console.error("users_info update error:", err);
//             res.status(500).json({ message: "Failed to update users_info" });
//           });
//         }

//         const updateAccountQuery = `
//           UPDATE account_info
//           SET phone = ?, email = ?, updated_date = NOW()
//           WHERE id = ?
//         `;

//         connection.query(
//           updateAccountQuery,
//           [contactNumber, emailAddress, user_id],
//           (err, accountResult) => {
//             if (err) {
//               return connection.rollback(() => {
//                 console.error("account_info update error:", err);
//                 res
//                   .status(500)
//                   .json({ message: "Failed to update account_info" });
//               });
//             }

//             const updateDoctorQuery = `
//               UPDATE doctors_profile
//               SET specialty = ?, department = ?, years_of_experience = ?, professional_board = ?, certificate = ?, status = ?
//               WHERE user_id = ?
//             `;

//             connection.query(
//               updateDoctorQuery,
//               [
//                 specialty,
//                 department,
//                 yearsofexp,
//                 professionalBoard,
//                 certificate,
//                 status,
//                 user_id,
//               ],
//               (err, doctorResult) => {
//                 if (err) {
//                   return connection.rollback(() => {
//                     console.error("doctors_info update error:", err);
//                     res
//                       .status(500)
//                       .json({ message: "Failed to update doctors_info" });
//                   });
//                 }

//                 connection.commit((err) => {
//                   if (err) {
//                     return connection.rollback(() => {
//                       console.error("Commit error:", err);
//                       res
//                         .status(500)
//                         .json({ message: "Failed to commit transaction" });
//                     });
//                   }

//                   res.json({ message: "Doctor profile updated successfully" });
//                 });
//               }
//             );
//           }
//         );
//       }
//     );
//   });
// });

// app.get("/getProfessionalInfo/:user_id", (req, res) => {
//   const user_id = req.params.user_id;

//   const query = `
//       SELECT
//         specialty AS specialty,
//         department AS department,
//         years_of_experience AS yearsofexp,
//         professional_board AS professionalBoard,
//         certificate AS certificate,
//         status AS status
//       FROM doctors_profile
//       WHERE user_id = ?
//   `;

//   connection.query(query, [user_id], (err, results) => {
//     if (err) return res.status(500).json({ message: "Database error" });

//     res.json({ data: results });
//   });
// });

// app.get("/getPatientsList", (req, res) => {
//   const { fullname, emailAddress, user_id, role } = req.query;

//   let query = `
//     SELECT
//       id,
//       CONCAT(firstname, ' ', lastname) AS fullname,
//       gender,
//       age,
//       mobile_number,
//       email_address,
//       user_id
//     FROM patient_info
//     WHERE 1=1
//   `;

//   const params = [];

//   if (fullname) {
//     query += ` AND (
//     CONCAT(firstname, ' ', lastname) LIKE ? OR
//     CONCAT(firstname, ' ', middlename, ' ', lastname) LIKE ? OR
//     firstname LIKE ? OR
//     middlename LIKE ? OR
//     lastname LIKE ?
//   )`;
//     const likeName = `%${fullname}%`;
//     params.push(likeName, likeName, likeName, likeName, likeName);
//   }
//   if (fullname) {
//     query += ` AND (
//     TRIM(CONCAT_WS(' ', firstname, middlename, lastname)) LIKE ? OR
//     TRIM(CONCAT(firstname, ' ', lastname)) LIKE ? OR
//     firstname LIKE ? OR
//     middlename LIKE ? OR
//     lastname LIKE ?
//   )`;
//     const likeName = `%${fullname}%`;
//     params.push(likeName, likeName, likeName, likeName, likeName);
//   }

//   if (emailAddress) {
//     query += ` AND email_address LIKE ?`;
//     params.push(`%${emailAddress}%`);
//   }

//   if (role === "patient" && user_id) {
//     query += ` AND user_id = ?`;
//     params.push(user_id);
//   }

//   connection.query(query, params, (err, results) => {
//     if (err)
//       return res.status(500).json({ message: "Database error", error: err });

//     res.json({ data: results });
//   });
// });

// app.get("/getDoctorsList", (req, res) => {
//   const { doctorName, specialtyId } = req.query;
//   let query = `
//     SELECT
//       CONCAT(u.firstname,' ', u.lastname) AS fullname,
//       d.specialty,
//       a.email,
//       d.status,
//       u.id
//     FROM doctors_profile d
//     JOIN users_info u ON d.user_id = u.id
//     JOIN account_info a ON d.user_id = a.user_id
//     WHERE 1=1
//   `;

//   const params = [];

//   if (doctorName) {
//     query += `
//       AND (
//         u.firstname LIKE ? OR
//         u.middlename LIKE ? OR
//         u.lastname LIKE ?
//       )
//     `;
//     const likeName = `%${doctorName}%`;
//     params.push(likeName, likeName, likeName);
//   }

//   if (specialtyId) {
//     query += ` AND d.specialty = ?`;
//     params.push(specialtyId);
//   }

//   connection.query(query, params, (err, results) => {
//     if (err) {
//       return res.status(500).json({ message: "Database error", error: err });
//     }
//     res.json({ data: results });
//   });
// });

// app.post("/reschedBooking", (req, res) => {
//   const { booking_id, formattedDate, newBookingTime } = req.body;

//   const query = `
//     UPDATE appointment_booking
//     SET
//       booking_date = ?,
//       booking_time = ?
//     WHERE id = ?
//   `;

//   connection.query(
//     query,
//     [formattedDate, newBookingTime, booking_id],
//     (err, result) => {
//       if (err) {
//         console.error("Booking update error:", err);
//         return res.status(500).json({ message: "Booking update failed" });
//       }

//       res.json({ message: "Booking updated successfully" });
//     }
//   );
// });

// app.post("/cancelBooking", (req, res) => {
//   const { booking_id, tag } = req.body;

//   const query = `UPDATE appointment_booking
//     SET
//     status = ?
//     WHERE id = ?`;

//   connection.query(query, [tag, booking_id], (err, result) => {
//     if (err) {
//       console.error("Booking cancellation error:", err);
//       return res.status(500).json({ message: "Booking cancellation failed" });
//     }

//     res.json({ message: "Booking cancelled" });
//   });
// });

// app.get("/validateAppointment", (req, res) => {
//   const { booking_date, booking_time, user_id, consultation_type } = req.query;

//   if (!booking_date || !booking_time || !user_id || !consultation_type) {
//     return res.status(400).json({ message: "Missing required parameters" });
//   }

//   const query = `
//     SELECT a.consultation_type, a.booking_time
//     FROM appointment_booking a
//     INNER JOIN patient_info p ON p.id = a.patient_id
//     WHERE a.booking_date = ?
//       AND p.user_id = ?
//   `;

//   const params = [booking_date, user_id];

//   connection.query(query, params, (err, results) => {
//     if (err) {
//       return res.status(500).json({ message: "Database error", error: err });
//     }

//     const normalizedType = consultation_type.trim().toLowerCase();
//     const normalizedTime = booking_time.trim();

//     for (const row of results) {
//       const rowType = row.consultation_type?.trim().toLowerCase();
//       const rowTime = row.booking_time?.trim();

//       if (rowType === normalizedType && rowTime === normalizedTime) {
//         return res.json({
//           exists: true,
//           message:
//             "You have already booked this consultation type at the same date and time.",
//         });
//       }

//       if (rowType === normalizedType && rowTime !== normalizedTime) {
//         return res.json({
//           exists: true,
//           message:
//             "You have already booked this consultation type at the same date with a different time.",
//         });
//       }

//       if (rowType !== normalizedType && rowTime === normalizedTime) {
//         return res.json({
//           exists: true,
//           message:
//             "You have already booked a different consultation type at the same date and time.",
//         });
//       }
//     }

//     // No match found
//     return res.json({ exists: false });
//   });
// });

// app.get("/getDoctorsByConsultationType", (req, res) => {
//   const consultationType = req.query.consultationType;

//   if (!consultationType) {
//     return res
//       .status(400)
//       .json({ error: "Missing consultationType parameter" });
//   }

//   const query = `
//     SELECT CONCAT(u.firstname, ' ', u.lastname) AS name, u.id AS id
//     FROM users_info u
//     JOIN doctors_profile d ON d.user_id = u.id
//     WHERE u.role = 'doctor' AND d.specialty = ?
//   `;

//   connection.query(query, [consultationType], (err, results) => {
//     if (err) {
//       console.error("Error fetching doctors:", err);
//       return res.status(500).json({ error: "Internal Server Error" });
//     }

//     res.json(results);
//   });
// });

// app.post("/giveRecommendation", (req, res) => {
//   const { appointment_id, recommendation, follow_up, pres_tag, prescription } =
//     req.body;

//   const follow_up_required = follow_up === "Yes" ? 1 : 0;
//   const prescription_given = pres_tag === "Yes" ? 1 : 0;

//   // 🔒 Validate recommendation
//   if (!recommendation || recommendation.trim() === "") {
//     return res.status(400).json({ message: "Recommendation is required." });
//   }

//   // 🔒 Validate prescription if required
//   if (prescription_given && (!prescription || prescription.trim() === "")) {
//     return res.status(400).json({
//       message: "Prescription is required when 'Prescription Given' is Yes.",
//     });
//   }

//   const sql = `
//     INSERT INTO doctor_recommendations
//       (appointment_id, recommendation, follow_up_required, prescription_given, prescription, created_at)
//     VALUES (?, ?, ?, ?, ?, NOW())
//   `;

//   const values = [
//     appointment_id,
//     recommendation,
//     follow_up_required,
//     prescription_given,
//     prescription,
//   ];

//   connection.query(sql, values, (err, result) => {
//     if (err) {
//       console.error("Database insert error:", err);
//       return res
//         .status(500)
//         .json({ message: "Failed to save recommendation." });
//     }

//     // ✅ Update appointment_booking status to "Consulted"
//     const updateStatusQuery = `
//       UPDATE appointment_booking
//       SET status = 'Consulted'
//       WHERE id = ?
//     `;

//     connection.query(updateStatusQuery, [appointment_id], (updateErr) => {
//       if (updateErr) {
//         console.error("Status update error:", updateErr);
//         return res.status(500).json({
//           message: "Recommendation saved, but failed to update status.",
//         });
//       }

//       res.status(200).json({
//         message: "Recommendation saved and status updated to Consulted.",
//       });
//     });
//   });
// });

// app.get("/getConsultationDetails", (req, res) => {
//   const { user_id } = req.query;

//   if (!user_id) {
//     return res
//       .status(400)
//       .json({ message: "Missing required parameter: user_id" });
//   }

//   const sql = `
//     SELECT
//       ab.booking_date AS consultation_date,
//       ab.consultation_type,
//       dr.recommendation,
//       dr.follow_up_required AS follow_up,
//       CONCAT(ui.firstname, ' ', ui.lastname) AS doctor_fullname,
//       ab.status AS consultation_status
//     FROM appointment_booking ab
//     LEFT JOIN doctor_recommendations dr ON ab.id = dr.appointment_id
//     LEFT JOIN doctors_profile dp ON ab.doctor_id = dp.id
//     LEFT JOIN users_info ui ON ab.doctor_id = ui.id
//     INNER JOIN patient_info pi ON ab.patient_id = pi.id
//     WHERE
//     ab.status in ("Emergency", "Completed")
//     AND pi.user_id = ?
//     ORDER BY ab.booking_date DESC
//   `;

//   connection.query(sql, [user_id], (err, results) => {
//     if (err) {
//       console.error("Error fetching consultation details:", err);
//       return res
//         .status(500)
//         .json({ message: "Failed to retrieve consultation details." });
//     }
//     res.status(200).json({ data: results });
//   });
// });

// app.get("/getPatientInfo", (req, res) => {
//   const { patient_user_id } = req.query;

//   if (!patient_user_id) {
//     return res
//       .status(400)
//       .json({ message: "Missing required parameter: patient_user_id" });
//   }

//   const sql = `
//     SELECT b.email, a.*
//     FROM patient_info a
//     INNER JOIN account_info b on b.user_id = a.user_id
//     WHERE a.user_id = ?
//   `;

//   connection.query(sql, [patient_user_id], (err, results) => {
//     if (err) {
//       console.error("Error fetching patient details:", err);
//       return res
//         .status(500)
//         .json({ message: "Failed to retrieve patient details." });
//     }
//     res.status(200).json({ data: results });
//   });
// });

// app.post("/updatePatientInfo", (req, res) => {
//   const {
//     user_id,
//     firstname,
//     middlename,
//     lastname,
//     gender,
//     birthdate,
//     age,
//     civil_status,
//     mobile_number,
//     home_address,
//     emergency_name,
//     emergency_relationship,
//     emergency_mobile_number,
//     bloodtype,
//     allergies,
//     current_medication,
//     past_medical_condition,
//     chronic_illness,
//     email, // from account_info
//   } = req.body;

//   if (!user_id) {
//     return res
//       .status(400)
//       .json({ message: "Missing required parameter: user_id" });
//   }

//   // Update patient_info
//   const sqlPatient = `
//     UPDATE patient_info SET
//       firstname = ?,
//       middlename = ?,
//       lastname = ?,
//       gender = ?,
//       birthdate = ?,
//       age = ?,
//       civil_status = ?,
//       mobile_number = ?,
//       home_address = ?,
//       emergency_name = ?,
//       emergency_relationship = ?,
//       emergency_mobile_number = ?,
//       bloodtype = ?,
//       allergies = ?,
//       current_medication = ?,
//       past_medical_condition = ?,
//       chronic_illness = ?,
//       email_address = ?
//     WHERE user_id = ?
//   `;

//   const patientValues = [
//     firstname,
//     middlename,
//     lastname,
//     gender,
//     birthdate,
//     age,
//     civil_status,
//     mobile_number,
//     home_address,
//     emergency_name,
//     emergency_relationship,
//     emergency_mobile_number,
//     bloodtype,
//     allergies,
//     current_medication,
//     past_medical_condition,
//     chronic_illness,
//     email,
//     user_id,
//   ];

//   connection.query(sqlPatient, patientValues, (err, result) => {
//     if (err) {
//       console.error("Error updating patient_info:", err);
//       return res
//         .status(500)
//         .json({ message: "Failed to update patient info." });
//     }

//     // Update account_info email if needed
//     const sqlAccount = `UPDATE account_info SET email = ? WHERE user_id = ?`;
//     connection.query(sqlAccount, [email, user_id], (err2, result2) => {
//       if (err2) {
//         console.error("Error updating account_info email:", err2);
//         return res.status(500).json({
//           message: "Patient info updated, but failed to update email.",
//         });
//       }

//       res
//         .status(200)
//         .json({ message: "Patient information updated successfully." });
//     });
//   });
// });

// app.get("/getInventoryTotal", (req, res) => {
//   const query = `
//     SELECT
//       a.id,
//       a.item,
//       b.category,
//       a.quantity,
//       a.average_quantity,
//       a.price,
//       a.status,
//       (a.quantity * a.price) AS total
//     FROM inventory a
//     INNER JOIN inventory_category b ON b.id = a.category;
//   `;

//   connection.query(query, (err, results) => {
//     if (err) {
//       console.error("Database error:", err); // good to log actual error on the server side
//       return res.status(500).json({ message: "Database error" });
//     }

//     res.json({ data: results });
//   });
// });

// app.get("/getDoctorsInfo", (req, res) => {
//   const { doctor_user_id } = req.query;
//   if (!doctor_user_id) {
//     return res
//       .status(400)
//       .json({ message: "Missing required parameter: doctors_id" });
//   }

//   const sql = `
//     SELECT b.email, a.*
//     FROM users_info a
//     INNER JOIN account_info b on b.user_id = a.id
//     WHERE a.id = ?
//   `;

//   connection.query(sql, [doctor_user_id], (err, results) => {
//     if (err) {
//       console.error("Error fetching doctor details:", err);
//       return res
//         .status(500)
//         .json({ message: "Failed to retrieve doctor details." });
//     }
//     res.status(200).json({ data: results });
//   });
// });

// app.get("/getPatientsToday", (req, res) => {
//   const query = `
//         SELECT

//             CONCAT(b.firstname, ' ', b.lastname) AS patient_name,
//             a.consultation_type,
//             a.queue_no,
//             a.id AS case_id,
//             a.status,
//             a.booking_time

//         FROM appointment_booking a
//         INNER JOIN patient_info b
//             ON a.patient_id = b.id
//         WHERE
//             STR_TO_DATE(a.booking_date, '%m-%d-%Y') = CURDATE()
//             AND a.status = 'Booked'
//         ORDER BY
//             a.queue_no ASC
//     `;

//   connection.query(query, (err, results) => {
//     if (err) {
//       console.error("Database error fetching patients for today:", err);
//       return res.status(500).json({ message: "Database error" });
//     }

//     // Return the array of results directly, which is what the front-end AJAX expects
//     res.json(results);
//   });
// });

// app.get("/getBookings", (req, res) => {
//   const query = `
//         SELECT

//             CONCAT(b.firstname, ' ', b.lastname) AS patient_name,
//             a.consultation_type,
//             a.queue_no,
//             a.id AS case_id,
//             a.status,
//             a.booking_time

//         FROM appointment_booking a
//         INNER JOIN patient_info b
//             ON a.patient_id = b.id
//         WHERE
//             a.status = 'Booked'
//         ORDER BY
//             a.queue_no ASC
//     `;

//   connection.query(query, (err, results) => {
//     if (err) {
//       console.error("Database error fetching patients for today:", err);
//       return res.status(500).json({ message: "Database error" });
//     }

//     // Return the array of results directly, which is what the front-end AJAX expects
//     res.json(results);
//   });
// });

// app.get("/getInventoryDashboard", (req, res) => {
//   let query = `
//     SELECT
//       a.id, a.item, b.category, a.quantity, a.average_quantity, a.price, a.status
//     FROM inventory a
//     INNER JOIN inventory_category b ON b.id = a.category
//   `;

//   connection.query(query, (err, results) => {
//     if (err) return res.status(500).json({ message: "Database error" });

//     res.json(results); // DataTables expects data inside "data" key
//   });
// });

// app.get("/getAllPatients", (req, res) => {
//   let query = `
//      SELECT
//       id,
//       CONCAT(firstname, ' ', lastname) AS fullname,
//       gender,
//       age,
//       mobile_number,
//       email_address,
//       user_id
//     FROM patient_info
//     WHERE 1=1
//   `;

//   connection.query(query, (err, results) => {
//     if (err) return res.status(500).json({ message: "Database error" });

//     res.json(results); // DataTables expects data inside "data" key
//   });
// });

// ============================================================================
// IMMACARE WEB APPLICATION - MAIN SERVER FILE
// ============================================================================
// 
// PURPOSE:
// This is the main Express.js server file for the Immacare healthcare management
// system. It handles all API endpoints, authentication, database connections,
// and serves static files for the web application.
//
// ARCHITECTURE:
// - Backend: Express.js (Node.js)
// - Database: MongoDB (using Mongoose ODM)
// - Authentication: Session-based for web, token-based for mobile
// - Frontend: Static HTML/CSS/JS files served from /public directory
//
// MAIN FUNCTIONALITY:
// 1. User Authentication (login, register, logout)
// 2. Mobile API endpoints (token-based authentication)
// 3. Appointment booking and management
// 4. Patient profile management
// 5. Doctor profile and scheduling
// 6. Inventory management
// 7. Dashboard statistics and reporting
// 8. User account management
//
// ============================================================================

// ============================================================================
// SECTION 1: DEPENDENCIES AND IMPORTS
// ============================================================================
// Core Node.js modules for system operations
const { exec } = require('child_process');
const os = require('os');

// Express.js framework for building the REST API server
const express = require("express");

// Email service for sending notifications (configured but may not be actively used)
const nodemailer = require("nodemailer");

// Cryptographic functions for secure operations
const crypto = require("crypto");

// Path utilities for file system operations
const path = require("path");

// Body parser middleware to parse JSON and URL-encoded request bodies
const bodyParser = require("body-parser");

// CORS middleware to allow cross-origin requests from frontend
const cors = require("cors");

// Load environment variables from .env file
require('dotenv').config();

// MongoDB connection configuration
const { connectMongoDB } = require('./config/mongodb');

// ============================================================================
// SECTION 2: DATABASE MODELS
// ============================================================================
// Import Mongoose models for MongoDB collections
// Note: Previously used MySQL, but all features have been migrated to MongoDB
const User = require('./models/User');                    // User accounts and authentication
const DoctorProfile = require('./models/DoctorProfile'); // Doctor information and profiles
const PatientProfile = require('./models/PatientProfile'); // Patient medical profiles
const Appointment = require('./models/Appointment');      // Appointment bookings
const DoctorRecommendation = require('./models/DoctorRecommendation'); // Doctor recommendations
const Inventory = require('./models/Inventory');         // Medical inventory items
const InventoryCategory = require('./models/InventoryCategory'); // Inventory categories
const EmailVerificationToken = require('./models/EmailVerificationToken'); // Email verification tokens

// Email service for sending verification emails
const { sendVerificationEmail } = require('./services/emailService');

// ============================================================================
// SECTION 3: EXPRESS APP INITIALIZATION
// ============================================================================
// Create Express application instance
const app = express();

// ============================================================================
// SECTION 4: MIDDLEWARE CONFIGURATION
// ============================================================================
// Enable CORS (Cross-Origin Resource Sharing) to allow frontend to make API calls
// Configure CORS to allow credentials (cookies) to be sent
app.use(cors({
  origin: true, // Allow requests from any origin (for development)
  credentials: true // Allow cookies to be sent with requests
}));

// Parse JSON request bodies (for API endpoints that send JSON data)
app.use(bodyParser.json());

// Parse URL-encoded request bodies (for form submissions)
app.use(bodyParser.urlencoded({ extended: true }));

// ============================================================================
// SESSION MIDDLEWARE (MUST BE BEFORE ROUTES THAT USE IT)
// ============================================================================
// Import express-session for managing user sessions
const session = require("express-session");

// Configure session middleware for web-based authentication
// Sessions allow users to remain logged in across multiple requests
app.use(
  session({
    secret: "your-secret-key", // TODO: Use environment variable in production for security
    resave: false, // Don't save session if it hasn't been modified
    saveUninitialized: false, // Don't create session until something is stored
    cookie: { 
      maxAge: 1000 * 60 * 60 * 24, // Session expires after 1 day (24 hours)
      // sameSite not set - allows cookies in iframes for localhost development
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: false, // Set to true in production with HTTPS
      path: '/' // Ensure cookie is available for all paths
    },
  })
);

// ============================================================================
// SECTION 5: STATIC FILE SERVING
// ============================================================================
// Serve static files from the web_immacare directory (legacy/main HTML files)
app.use(express.static(path.join(__dirname, "web_immacare")));

// Serve Bootstrap CSS/JS framework from node_modules
app.use(
  "/bootstrap",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist"))
);

// Serve Bootstrap Icons from node_modules
app.use(
  "/bootstrap-icons",
  express.static(__dirname + "/node_modules/bootstrap-icons")
);

// Serve DataTables library for enhanced table functionality
app.use(
  "/datatables.net",
  express.static(__dirname + "/node_modules/datatables.net")
);

// Serve DataTables styling and responsive features
app.use(
  "/datatables.net-dt",
  express.static(__dirname + "/node_modules/datatables.net-dt")
);

// Serve jQuery library (dependency for Bootstrap and DataTables)
app.use("/jquery", express.static(__dirname + "/node_modules/jquery/dist"));

// Root route - redirect to landing page
app.get("/", (req, res) => {
  res.redirect("/landingpage/landingpage.html");
});

// ============================================================================
// SECTION: PREDICTIVE ANALYTICS ENDPOINTS (ADMIN ONLY)
// ============================================================================

// Import Gemini AI module for analytics insights
const { generateInsights, getAPIUsageStats, clearCache } = require('./config/gemini');

// Middleware to check if user is admin
// Uses same session check as /homepage endpoint
const requireAdmin = (req, res, next) => {
  // Debug logging
  console.log('🔍 [AUTH DEBUG] requireAdmin middleware called');
  console.log('🔍 [AUTH DEBUG] req.session:', req.session ? 'exists' : 'missing');
  console.log('🔍 [AUTH DEBUG] req.sessionID:', req.sessionID || 'none');
  console.log('🔍 [AUTH DEBUG] req.session.userId:', req.session?.userId || 'undefined');
  console.log('🔍 [AUTH DEBUG] req.session.role:', req.session?.role || 'undefined');
  console.log('🔍 [AUTH DEBUG] req.headers.cookie:', req.headers.cookie ? req.headers.cookie.substring(0, 100) : 'missing');
  
  // Check session the same way /homepage does - check userId first
  if (!req.session || !req.session.userId) {
    console.log('❌ [AUTH DEBUG] Authentication failed - no session or userId');
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required',
      debug: {
        hasSession: !!req.session,
        hasUserId: !!req.session?.userId,
        hasRole: !!req.session?.role,
        role: req.session?.role || 'undefined',
        userId: req.session?.userId || 'undefined',
        sessionID: req.sessionID || 'none'
      }
    });
  }
  
  // Then check if admin
  if (req.session.role !== 'admin') {
    console.log('❌ [AUTH DEBUG] Authorization failed - not admin, role:', req.session.role);
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  
  console.log('✅ [AUTH DEBUG] Authentication successful - admin user:', req.session.email);
  next();
};

/**
 * GET /analytics/debug-session
 * Purpose: Debug endpoint to check session state
 */
app.get('/analytics/debug-session', (req, res) => {
  res.json({
    hasSession: !!req.session,
    sessionId: req.sessionID || 'none',
    role: req.session?.role || 'none',
    userId: req.session?.userId || 'none',
    email: req.session?.email || 'none',
    cookies: req.headers.cookie || 'no cookies',
    cookieHeader: req.headers.cookie ? req.headers.cookie.substring(0, 100) : 'none'
  });
});

/**
 * GET /analytics/list-gemini-models
 * Purpose: List available Gemini models (admin only)
 */
app.get('/analytics/list-gemini-models', requireAdmin, async (req, res) => {
  try {
    const https = require('https');
    const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyD1dUGmiSer-rapBfWza_CaicUZyfwYoK0';
    
    // Try different API endpoints to list models
    const endpoints = [
      `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`,
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    ];
    
    const results = {};
    
    for (const endpoint of endpoints) {
      try {
        const urlObj = new URL(endpoint);
        const response = await new Promise((resolve, reject) => {
          https.get({
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            timeout: 5000
          }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
              try {
                resolve(JSON.parse(data));
              } catch (e) {
                reject(e);
              }
            });
          }).on('error', reject).on('timeout', () => {
            reject(new Error('Timeout'));
          });
        });
        
        results[endpoint] = response;
      } catch (err) {
        results[endpoint] = { error: err.message };
      }
    }
    
    res.json({
      success: true,
      availableModels: results
    });
  } catch (error) {
    console.error('❌ Error listing models:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list models',
      error: error.message
    });
  }
});

/**
 * GET /analytics/test-gemini
 * Purpose: Test Gemini API connection (admin only)
 */
app.get('/analytics/test-gemini', requireAdmin, async (req, res) => {
  try {
    console.log('🧪 Testing Gemini API connection...');
    const { generateInsights } = require('./config/gemini');
    
    const testPrompt = 'Say "Hello, AI is working!" in one sentence.';
    const testData = { test: true };
    
    const result = await generateInsights(testPrompt, testData, 'test_connection');
    
    res.json({
      success: true,
      message: 'Gemini API is working!',
      response: result.text.substring(0, 200)
    });
  } catch (error) {
    console.error('❌ Gemini API test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Gemini API test failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * GET /analytics/api-usage-stats
 * Purpose: Get API usage statistics (admin only)
 */
app.get('/analytics/api-usage-stats', requireAdmin, (req, res) => {
  try {
    const stats = getAPIUsageStats();
    res.json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('❌ Error getting API usage stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get API usage stats',
      error: error.message
    });
  }
});

/**
 * POST /analytics/clear-ai-cache
 * Purpose: Clear AI cache to force fresh insights (admin only)
 */
app.post('/analytics/clear-ai-cache', requireAdmin, (req, res) => {
  try {
    clearCache();
    console.log('🗑️ AI cache cleared by admin');
    res.json({
      success: true,
      message: 'AI cache cleared successfully. Next insights will be fresh.'
    });
  } catch (error) {
    console.error('❌ Error clearing AI cache:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cache',
      error: error.message
    });
  }
});

/**
 * GET /analytics/appointment-forecast
 * Purpose: Get appointment demand forecast data
 * Access: Admin only
 */
app.get('/analytics/appointment-forecast', requireAdmin, async (req, res) => {
  try {
    // Get last 30 days of appointments
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    const appointments = await Appointment.find({
      createdAt: { $gte: thirtyDaysAgo }
    })
      .sort({ createdAt: 1 })
      .lean();
    
    // Group by date
    const dailyCounts = {};
    appointments.forEach(apt => {
      const date = new Date(apt.createdAt).toISOString().split('T')[0];
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });
    
    // Prepare historical data (last 21 days)
    const historical = [];
    for (let i = 20; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      historical.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: dailyCounts[dateStr] || 0
      });
    }
    
    // Simple forecast: average of last 7 days + trend
    const last7Days = historical.slice(-7).map(d => d.count);
    const avg = last7Days.reduce((a, b) => a + b, 0) / 7;
    const trend = (last7Days[6] - last7Days[0]) / 7;
    
    // Forecast next 7 days
    const forecast = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const predicted = Math.max(0, Math.round(avg + (trend * i)));
      forecast.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        predicted: predicted
      });
    }
    
    res.json({
      success: true,
      data: {
        historical: historical,
        forecast: forecast
      }
    });
  } catch (error) {
    console.error('Error in appointment forecast:', error);
    res.status(500).json({ success: false, message: 'Failed to generate forecast' });
  }
});

/**
 * GET /analytics/inventory-forecast
 * Purpose: Get inventory reorder prediction data
 * Access: Admin only
 */
app.get('/analytics/inventory-forecast', requireAdmin, async (req, res) => {
  try {
    const inventory = await Inventory.find()
      .populate('category', 'category')
      .lean();
    
    // Get appointment history for usage estimation
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const recentAppointments = await Appointment.countDocuments({
      createdAt: { $gte: last30Days }
    });
    
    // Estimate usage based on appointments (simple heuristic)
    const dailyAppointmentAvg = recentAppointments / 30;
    
    const reorderPredictions = inventory.map(item => {
      const currentQty = item.quantity || 0;
      const avgQty = item.averageQuantity || currentQty || 10;
      const reorderThreshold = Math.max(5, Math.floor(avgQty * 0.3));
      
      // Estimate days until reorder needed (simplified)
      const estimatedDailyUsage = Math.max(0.1, dailyAppointmentAvg * 0.1);
      const daysUntilReorder = currentQty > reorderThreshold 
        ? Math.floor((currentQty - reorderThreshold) / estimatedDailyUsage)
        : 0;
      
      return {
        item: item.item,
        currentQuantity: currentQty,
        reorderThreshold: reorderThreshold,
        daysUntilReorder: daysUntilReorder,
        category: item.category ? item.category.category : 'Uncategorized',
        needsReorder: daysUntilReorder <= 7 && daysUntilReorder > 0
      };
    });
    
    // Sort by days until reorder (soonest first)
    reorderPredictions.sort((a, b) => {
      if (a.needsReorder && !b.needsReorder) return -1;
      if (!a.needsReorder && b.needsReorder) return 1;
      return a.daysUntilReorder - b.daysUntilReorder;
    });
    
    res.json({
      success: true,
      data: {
        reorderPredictions: reorderPredictions.slice(0, 20) // Top 20 items
      }
    });
  } catch (error) {
    console.error('Error in inventory forecast:', error);
    res.status(500).json({ success: false, message: 'Failed to generate forecast' });
  }
});

/**
 * GET /analytics/health-risk-analysis
 * Purpose: Get patient health risk prediction data
 * Access: Admin only
 */
app.get('/analytics/health-risk-analysis', requireAdmin, async (req, res) => {
  try {
    const patients = await PatientProfile.find()
      .populate('userId', 'firstname lastname')
      .lean();
    
    // Get appointment data for each patient
    const patientIds = patients.map(p => p._id);
    const appointments = await Appointment.find({
      patientId: { $in: patientIds }
    })
      .sort({ createdAt: -1 })
      .lean();
    
    // Group appointments by patient
    const appointmentsByPatient = {};
    appointments.forEach(apt => {
      const pid = apt.patientId.toString();
      if (!appointmentsByPatient[pid]) {
        appointmentsByPatient[pid] = [];
      }
      appointmentsByPatient[pid].push(apt);
    });
    
    // Calculate risk levels for each patient
    const riskPatients = patients.map(patient => {
      const patientApts = appointmentsByPatient[patient._id.toString()] || [];
      const lastApt = patientApts.length > 0 ? patientApts[0] : null;
      
      // Risk calculation factors
      let riskScore = 0;
      const concerns = [];
      
      // Age factor
      const age = parseInt(patient.age) || 0;
      if (age >= 65) riskScore += 3;
      else if (age >= 50) riskScore += 2;
      else if (age >= 40) riskScore += 1;
      
      // Chronic illness
      if (patient.chronicIllness && patient.chronicIllness.trim()) {
        riskScore += 4;
        concerns.push('Chronic illness: ' + patient.chronicIllness);
      }
      
      // Past medical conditions
      if (patient.pastMedicalCondition && patient.pastMedicalCondition.trim()) {
        riskScore += 2;
        concerns.push('Past conditions: ' + patient.pastMedicalCondition);
      }
      
      // Allergies
      if (patient.allergies && patient.allergies.trim()) {
        riskScore += 1;
        concerns.push('Allergies: ' + patient.allergies);
      }
      
      // Appointment frequency (more frequent = higher risk)
      if (patientApts.length > 5) riskScore += 2;
      else if (patientApts.length > 2) riskScore += 1;
      
      // Time since last appointment (long time = potential risk)
      if (lastApt) {
        const lastAptDate = new Date(lastApt.createdAt);
        const daysSince = (Date.now() - lastAptDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSince > 90) riskScore += 2;
        else if (daysSince > 60) riskScore += 1;
      } else {
        riskScore += 1; // Never had appointment
      }
      
      // Determine risk level
      let riskLevel = 'Low';
      if (riskScore >= 7) riskLevel = 'High';
      else if (riskScore >= 4) riskLevel = 'Medium';
      
      const lastAptDate = lastApt 
        ? new Date(lastApt.createdAt).toLocaleDateString()
        : 'Never';
      
      return {
        patientId: patient._id.toString(),
        name: patient.userId 
          ? `${patient.userId.firstname} ${patient.userId.lastname}`
          : `${patient.firstname} ${patient.lastname}`,
        age: patient.age,
        riskLevel: riskLevel,
        riskScore: riskScore,
        primaryConcern: concerns[0] || 'Routine care',
        lastAppointment: lastAptDate,
        recommendation: riskLevel === 'High' 
          ? 'Schedule follow-up appointment soon'
          : riskLevel === 'Medium'
          ? 'Monitor regularly'
          : 'Continue routine care'
      };
    });
    
    // Sort by risk score (highest first)
    riskPatients.sort((a, b) => b.riskScore - a.riskScore);
    
    // Count risk distribution
    const riskDistribution = {
      high: riskPatients.filter(p => p.riskLevel === 'High').length,
      medium: riskPatients.filter(p => p.riskLevel === 'Medium').length,
      low: riskPatients.filter(p => p.riskLevel === 'Low').length
    };
    
    res.json({
      success: true,
      data: {
        riskDistribution: riskDistribution,
        riskPatients: riskPatients.slice(0, 50) // Top 50 at-risk patients
      }
    });
  } catch (error) {
    console.error('Error in health risk analysis:', error);
    res.status(500).json({ success: false, message: 'Failed to analyze health risks' });
  }
});

/**
 * POST /analytics/ai/appointment-insights
 * Purpose: Generate AI insights for appointment forecasting
 * Access: Admin only
 */
app.post('/analytics/ai/appointment-insights', requireAdmin, async (req, res) => {
  try {
    console.log('🤖 [AI] Generating appointment insights...');
    
    // Get forecast data directly (same logic as GET endpoint)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    const appointments = await Appointment.find({
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: 1 }).lean();
    
    console.log(`📊 [AI] Found ${appointments.length} appointments in last 30 days`);
    
    const dailyCounts = {};
    appointments.forEach(apt => {
      const date = new Date(apt.createdAt).toISOString().split('T')[0];
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });
    
    const historical = [];
    for (let i = 20; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      historical.push({
        date: dateStr,
        count: dailyCounts[dateStr] || 0
      });
    }
    
    const last7Days = historical.slice(-7).map(d => d.count);
    const avg = last7Days.length > 0 ? last7Days.reduce((a, b) => a + b, 0) / last7Days.length : 0;
    const trend = last7Days.length >= 2 ? (last7Days[last7Days.length - 1] - last7Days[0]) / last7Days.length : 0;
    
    const forecast = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const predicted = Math.max(0, Math.round(avg + (trend * i)));
      forecast.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        predicted: predicted
      });
    }
    
    // Aggregate data for AI (keep it small!)
    const historicalAvg = historical.length > 0 
      ? historical.reduce((sum, d) => sum + d.count, 0) / historical.length 
      : 0;
    const forecastAvg = forecast.length > 0
      ? forecast.reduce((sum, d) => sum + d.predicted, 0) / forecast.length
      : 0;
    const peakDay = forecast.length > 0
      ? forecast.reduce((max, d) => d.predicted > max.predicted ? d : max, forecast[0])
      : { date: 'N/A', predicted: 0 };
    
    const summary = {
      historicalAvg: historicalAvg,
      forecastAvg: forecastAvg,
      peakDay: peakDay
    };
    
    const prompt = `Analyze this appointment forecast data for a healthcare clinic and provide actionable insights:
- Historical average: ${summary.historicalAvg.toFixed(1)} appointments/day
- Forecasted average: ${summary.forecastAvg.toFixed(1)} appointments/day
- Peak predicted day: ${summary.peakDay.date} with ${summary.peakDay.predicted} appointments

Provide recommendations for staffing, resource allocation, and patient scheduling optimization.`;
    
    console.log('🤖 [AI] Calling Gemini API...');
    const insights = await generateInsights(prompt, summary, 'appointment_insights');
    console.log('✅ [AI] Insights generated successfully');
    
    res.json({
      success: true,
      insights: insights
    });
  } catch (error) {
    console.error('❌ [AI] Error generating appointment insights:', error);
    console.error('❌ [AI] Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate AI insights',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /analytics/ai/inventory-insights
 * Purpose: Generate AI insights for inventory management
 * Access: Admin only
 */
app.post('/analytics/ai/inventory-insights', requireAdmin, async (req, res) => {
  try {
    console.log('🤖 [AI] Generating inventory insights...');
    
    // Get forecast data directly (same logic as GET endpoint)
    const inventory = await Inventory.find().populate('category', 'category').lean();
    console.log(`📊 [AI] Found ${inventory.length} inventory items`);
    
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const recentAppointments = await Appointment.countDocuments({
      createdAt: { $gte: last30Days }
    });
    const dailyAppointmentAvg = recentAppointments / 30;
    
    const reorderPredictions = inventory.map(item => {
      const currentQty = item.quantity || 0;
      const avgQty = item.averageQuantity || currentQty || 10;
      const reorderThreshold = Math.max(5, Math.floor(avgQty * 0.3));
      const estimatedDailyUsage = Math.max(0.1, dailyAppointmentAvg * 0.1);
      const daysUntilReorder = currentQty > reorderThreshold 
        ? Math.floor((currentQty - reorderThreshold) / estimatedDailyUsage)
        : 0;
      return {
        item: item.item,
        currentQuantity: currentQty,
        reorderThreshold: reorderThreshold,
        daysUntilReorder: daysUntilReorder,
        needsReorder: daysUntilReorder <= 7 && daysUntilReorder > 0
      };
    });
    
    reorderPredictions.sort((a, b) => {
      if (a.needsReorder && !b.needsReorder) return -1;
      if (!a.needsReorder && b.needsReorder) return 1;
      return a.daysUntilReorder - b.daysUntilReorder;
    });
    
    const urgentItems = reorderPredictions.filter(p => p.needsReorder);
    
    // Aggregate data
    const avgDays = reorderPredictions.length > 0 && reorderPredictions.slice(0, 10).length > 0
      ? reorderPredictions.slice(0, 10).reduce((sum, p) => sum + p.daysUntilReorder, 0) / Math.min(10, reorderPredictions.length)
      : 0;
    
    const summary = {
      totalItems: reorderPredictions.length,
      urgentReorder: urgentItems.length,
      avgDaysUntilReorder: avgDays,
      topItems: urgentItems.slice(0, 5).map(i => ({ name: i.item, days: i.daysUntilReorder }))
    };
    
    const topItemsStr = summary.topItems.length > 0 
      ? summary.topItems.map(i => `${i.name} (${i.days} days)`).join(', ')
      : 'None';
    
    const prompt = `Analyze this inventory reorder prediction data for a healthcare clinic:
- Total items monitored: ${summary.totalItems}
- Items needing urgent reorder (within 7 days): ${summary.urgentReorder}
- Average days until reorder needed: ${summary.avgDaysUntilReorder.toFixed(1)} days
- Top urgent items: ${topItemsStr}

Provide recommendations for inventory management, ordering schedules, and cost optimization.`;
    
    console.log('🤖 [AI] Calling Gemini API...');
    const insights = await generateInsights(prompt, summary, 'inventory_insights');
    console.log('✅ [AI] Insights generated successfully');
    
    res.json({
      success: true,
      insights: insights
    });
  } catch (error) {
    console.error('❌ [AI] Error generating inventory insights:', error);
    console.error('❌ [AI] Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate AI insights',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /analytics/ai/health-risk-insights
 * Purpose: Generate AI insights for patient health risk analysis
 * Access: Admin only
 */
app.post('/analytics/ai/health-risk-insights', requireAdmin, async (req, res) => {
  try {
    // Get risk analysis data directly (same logic as GET endpoint)
    const patients = await PatientProfile.find().populate('userId', 'firstname lastname').lean();
    const patientIds = patients.map(p => p._id);
    const appointments = await Appointment.find({
      patientId: { $in: patientIds }
    }).sort({ createdAt: -1 }).lean();
    
    const appointmentsByPatient = {};
    appointments.forEach(apt => {
      const pid = apt.patientId.toString();
      if (!appointmentsByPatient[pid]) appointmentsByPatient[pid] = [];
      appointmentsByPatient[pid].push(apt);
    });
    
    const riskPatients = patients.map(patient => {
      const patientApts = appointmentsByPatient[patient._id.toString()] || [];
      const lastApt = patientApts.length > 0 ? patientApts[0] : null;
      let riskScore = 0;
      const concerns = [];
      
      const age = parseInt(patient.age) || 0;
      if (age >= 65) riskScore += 3;
      else if (age >= 50) riskScore += 2;
      else if (age >= 40) riskScore += 1;
      
      if (patient.chronicIllness && patient.chronicIllness.trim()) {
        riskScore += 4;
        concerns.push('Chronic illness: ' + patient.chronicIllness);
      }
      if (patient.pastMedicalCondition && patient.pastMedicalCondition.trim()) {
        riskScore += 2;
        concerns.push('Past conditions: ' + patient.pastMedicalCondition);
      }
      if (patient.allergies && patient.allergies.trim()) {
        riskScore += 1;
        concerns.push('Allergies: ' + patient.allergies);
      }
      if (patientApts.length > 5) riskScore += 2;
      else if (patientApts.length > 2) riskScore += 1;
      
      if (lastApt) {
        const daysSince = (Date.now() - new Date(lastApt.createdAt).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSince > 90) riskScore += 2;
        else if (daysSince > 60) riskScore += 1;
      } else {
        riskScore += 1;
      }
      
      let riskLevel = 'Low';
      if (riskScore >= 7) riskLevel = 'High';
      else if (riskScore >= 4) riskLevel = 'Medium';
      
      return {
        riskLevel: riskLevel,
        primaryConcern: concerns[0] || 'Routine care'
      };
    });
    
    const distribution = {
      high: riskPatients.filter(p => p.riskLevel === 'High').length,
      medium: riskPatients.filter(p => p.riskLevel === 'Medium').length,
      low: riskPatients.filter(p => p.riskLevel === 'Low').length
    };
    
    const highRiskPatients = riskPatients.filter(p => p.riskLevel === 'High').slice(0, 5);
    const totalAssessed = distribution.high + distribution.medium + distribution.low;
    
    // Aggregate data
    const summary = {
      totalAssessed: totalAssessed,
      highRisk: distribution.high,
      mediumRisk: distribution.medium,
      lowRisk: distribution.low,
      highRiskPercentage: totalAssessed > 0 ? ((distribution.high / totalAssessed) * 100).toFixed(1) : '0',
      topConcerns: highRiskPatients.map(p => p.primaryConcern)
    };
    
    const concernsStr = summary.topConcerns && summary.topConcerns.length > 0 
      ? summary.topConcerns.join('; ')
      : 'None identified';
    
    const prompt = `Analyze this patient health risk assessment data for a healthcare clinic:
- Total patients assessed: ${summary.totalAssessed}
- High risk patients: ${summary.highRisk} (${summary.highRiskPercentage}%)
- Medium risk: ${summary.mediumRisk}
- Low risk: ${summary.lowRisk}
- Common concerns among high-risk patients: ${concernsStr}

Provide recommendations for proactive patient care, follow-up scheduling, and preventive health strategies.`;
    
    console.log('🤖 [AI] Calling Gemini API for health risk insights...');
    const insights = await generateInsights(prompt, summary, 'health_risk_insights');
    console.log('✅ [AI] Health risk insights generated successfully');
    
    res.json({
      success: true,
      insights: insights
    });
  } catch (error) {
    console.error('❌ [AI] Error generating health risk insights:', error);
    console.error('❌ [AI] Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate AI insights',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================================================
// SECTION 6: SERVER CONFIGURATION AND STARTUP
// ============================================================================
// Server port configuration - use environment variable for production (Render uses PORT)
const PORT = process.env.PORT || 3000;

// Default URL to open when server starts
const TARGET_URL = `http://localhost:${PORT}/landingpage/landingpage.html`;

// Start the Express server and optionally open browser
// Listen on 0.0.0.0 to allow access from mobile devices on the same network
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Server is accessible from network at http://<your-ip>:${PORT}`);

  // Only open browser in development mode (not in production/cloud)
  if (process.env.NODE_ENV !== 'production') {
    try {
      const open = await import("open");

      open.default(TARGET_URL, {
        app: {
          name: open.apps.chrome
        }
      })
        .then(() => {
          console.log('Opened in Chrome!');
        })
        .catch((err) => {
          console.error('Failed to open URL in Chrome:', err.message);
        });
    } catch (err) {
      console.error('Error loading the "open" module:', err);
    }
  }
});

// ============================================================================
// SECTION 7: ADDITIONAL MIDDLEWARE (DUPLICATE - FOR COMPATIBILITY)
// ============================================================================
// Note: Some middleware is duplicated here for compatibility with different routes
// Parse JSON request bodies
app.use(bodyParser.json());

// CORS is already configured in Section 4 with credentials support
// Do not add another cors() middleware here as it overrides the credentials setting

// Serve static files from the public directory (main frontend files)
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));

// ============================================================================
// SECTION 8: DATABASE CONNECTION
// ============================================================================
// Connect to MongoDB database
// All features now use MongoDB (MySQL has been removed)
connectMongoDB();

// ============================================================================
// SECTION 9: AUTHENTICATION CONFIGURATION
// ============================================================================
// Import bcrypt for password hashing and comparison
const bcrypt = require("bcryptjs");

// Note: Session middleware has been moved earlier (before routes) for proper initialization

// ============================================================================
// SECTION 10: WEB AUTHENTICATION ENDPOINTS
// ============================================================================

/**
 * POST /login
 * Purpose: Authenticate a user and create a session for web-based access
 * 
 * Request Body:
 *   - email: User's email address
 *   - password: User's password (plain text, will be compared with hashed version)
 * 
 * Response:
 *   - Success (200): Returns user information and creates a session
 *   - Error (400): Missing email or password
 *   - Error (401): Invalid credentials
 *   - Error (500): Database/server error
 * 
 * Process:
 *   1. Validate that email and password are provided
 *   2. Find user in MongoDB by email (case-insensitive, active users only)
 *   3. Compare provided password with stored hashed password
 *   4. If valid, create session with user data
 *   5. Return user information (excluding password)
 */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).send({ message: "email and password are required" });
  }

  try {
    // Find user in MongoDB (case-insensitive email search, only active users)
    const user = await User.findOne({ email: email.toLowerCase(), status: true });
    
    if (!user) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    // Compare provided password with stored hashed password using bcrypt
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).send({ 
        message: "Please verify your email address before logging in. Check your inbox for the verification email.",
        requiresVerification: true,
        email: user.email
      });
    }

    // Create session with user data (stored server-side, session ID sent to client)
    req.session.userId = user._id.toString();
    req.session.email = user.email;
    req.session.phone = user.phone;
    req.session.user_id_id = user._id.toString();
    req.session.firstname = user.firstname;
    req.session.lastname = user.lastname;
    req.session.middlename = user.middlename;
    req.session.gender = user.gender;
    req.session.birthdate = user.birthdate;
    req.session.age = user.age;
    req.session.role = user.role;

    // Return success response with user information (password excluded)
    res.send({
      message: "Login successful",
      user: {
        id: user._id.toString(),
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        middlename: user.middlename,
        gender: user.gender,
        birthdate: user.birthdate,
        age: user.age,
        role: user.role,
        phone: user.phone,
        user_id_id: user._id.toString()
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send({ message: "Database error" });
  }
});

// Password hashing configuration (used by User model, not directly here)
const saltRounds = 10;

// Email validation regex pattern
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /register
 * Purpose: Register a new user account
 * 
 * Request Body:
 *   - firstname, lastname: Required user names
 *   - middlename: Optional middle name
 *   - gender: Required (Male, Female, Other)
 *   - birthdate: Required date of birth
 *   - age: Optional age (can be calculated from birthdate)
 *   - phone: Optional phone number
 *   - email: Required email address (must be unique)
 *   - password: Required password (will be hashed automatically)
 * 
 * Response:
 *   - Success (200): Returns user ID and account ID
 *   - Error (400): Missing required fields or invalid email format
 *   - Error (409): Email already in use
 *   - Error (500): Server error
 * 
 * Process:
 *   1. Validate all required fields
 *   2. Validate email format
 *   3. Check if email already exists
 *   4. Create new user (password automatically hashed by User model)
 *   5. Save to database
 */
app.post("/register", async (req, res) => {
  const {
    firstname,
    middlename,
    lastname,
    gender,
    birthdate,
    age,
    phone,
    email,
    password,
  } = req.body;

  if (!firstname || !lastname || !gender || !birthdate || !email || !password) {
    return res.status(400).send({ message: "All fields are required" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).send({ message: "Invalid email format" });
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).send({ message: "Email already in use" });
    }

    // Normalize gender to match enum values (Male, Female, Other)
      // Handle any case: "male", "Male", "MALE", "female", etc.
    let finalGender = 'Male'; // Default
    if (gender) {
      const genderLower = String(gender).toLowerCase().trim();
      if (genderLower === 'male') finalGender = 'Male';
      else if (genderLower === 'female') finalGender = 'Female';
      else if (genderLower === 'other') finalGender = 'Other';
      else {
        // Fallback: capitalize first letter
        finalGender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
        // Validate it's one of the allowed values
        const validGenders = ['Male', 'Female', 'Other'];
        if (!validGenders.includes(finalGender)) {
          finalGender = 'Male'; // Default to Male if invalid
        }
      }
    }

    // Create new user (password will be automatically hashed by the model)
    const user = new User({
      firstname,
      middlename: middlename || null,
      lastname,
      gender: finalGender,
      birthdate: new Date(birthdate),
      age: age || null,
      phone: phone || null,
      email: email.toLowerCase(),
      password, // Will be hashed automatically by the model's pre-save hook
      role: 'patient',
      status: true,
      isVerified: false
    });

    await user.save();

    // Generate verification token and send verification email
    try {
      const verificationToken = await EmailVerificationToken.generateToken(user._id);
      const userName = `${firstname} ${lastname}`;
      
      await sendVerificationEmail(
        user.email,
        userName,
        verificationToken.token
      );
      
      res.send({
        message: "User registered successfully. Please check your email to verify your account.",
        userId: user._id.toString(),
        accountId: user._id.toString(),
        emailSent: true
      });
    } catch (emailError) {
      // If email fails, still return success but log the error
      console.error("Failed to send verification email:", emailError);
      res.send({
        message: "User registered successfully, but verification email could not be sent. Please contact support.",
        userId: user._id.toString(),
        accountId: user._id.toString(),
        emailSent: false
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    if (error.code === 11000) {
      // Duplicate key error (email already exists)
      return res.status(409).send({ message: "Email already in use" });
    }
    return res.status(500).send({ message: "Error registering user" });
  }
});

/**
 * GET /verify-email
 * Purpose: Verify user email address using verification token
 * 
 * Query Parameters:
 *   - token: Email verification token
 * 
 * Response:
 *   - Success (200): Email verified successfully
 *   - Error (400): Invalid or expired token
 *   - Error (404): Token not found
 *   - Error (500): Server error
 */
app.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send({ message: "Verification token is required" });
  }

  try {
    // Verify the token
    const tokenDoc = await EmailVerificationToken.verifyToken(token);

    if (!tokenDoc) {
      // Check if request is from browser
      const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
      if (acceptsHtml) {
        return res.redirect(`/verify-email/verify-email.html?token=${encodeURIComponent(token)}&error=invalid`);
      }
      return res.status(400).send({ 
        message: "Invalid or expired verification token. Please request a new verification email." 
      });
    }

    // Find the user and verify their email
    const user = await User.findById(tokenDoc.userId);

    if (!user) {
      const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
      if (acceptsHtml) {
        return res.redirect(`/verify-email/verify-email.html?token=${encodeURIComponent(token)}&error=notfound`);
      }
      return res.status(404).send({ message: "User not found" });
    }

    if (user.isVerified) {
      // User already verified, delete the token
      await EmailVerificationToken.deleteOne({ _id: tokenDoc._id });
      const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
      if (acceptsHtml) {
        return res.redirect(`/verify-email/verify-email.html?token=${encodeURIComponent(token)}&verified=true&already=true`);
      }
      return res.status(200).send({ 
        message: "Email already verified. You can now log in.",
        alreadyVerified: true
      });
    }

    // Mark user as verified
    user.isVerified = true;
    await user.save();

    // Delete the used token
    await EmailVerificationToken.deleteOne({ _id: tokenDoc._id });

    // Check if request is from browser (has Accept header with text/html)
    const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
    
    if (acceptsHtml) {
      // Redirect to HTML verification page
      return res.redirect(`/verify-email/verify-email.html?token=${encodeURIComponent(token)}&verified=true`);
    }
    
    // Return JSON for API requests
    res.send({ 
      message: "Email verified successfully! You can now log in.",
      verified: true
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(500).send({ message: "Error verifying email" });
  }
});

/**
 * POST /resend-verification
 * Purpose: Resend verification email to user
 * 
 * Request Body:
 *   - email: User's email address
 * 
 * Response:
 *   - Success (200): Verification email sent
 *   - Error (400): Invalid email or user already verified
 *   - Error (404): User not found
 *   - Error (500): Server error
 */
app.post("/resend-verification", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: "Email is required" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).send({ message: "Invalid email format" });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).send({ message: "Email already verified" });
    }

    // Generate new verification token
    const verificationToken = await EmailVerificationToken.generateToken(user._id);
    const userName = `${user.firstname} ${user.lastname}`;

    // Send verification email
    await sendVerificationEmail(
      user.email,
      userName,
      verificationToken.token
    );

    res.send({ 
      message: "Verification email sent successfully. Please check your inbox.",
      emailSent: true
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return res.status(500).send({ message: "Error sending verification email" });
  }
});

/**
 * GET /homepage
 * Purpose: Verify user session and return current user information
 * 
 * Authentication: Requires valid session (user must be logged in)
 * 
 * Response:
 *   - Success (200): Returns current user's session data
 *   - Error (401): No active session (user not logged in)
 * 
 * Use Case: Frontend calls this to check if user is still logged in
 * and to retrieve user information for display
 */
app.get("/homepage", (req, res) => {
  // Check if user has an active session
  if (!req.session.userId) {
    return res.status(401).send({ message: "Unauthorized: Please login" });
  }

  // User is authenticated - return session data
  res.send({
    message: `Welcome user ${req.session.email}`,
    email: req.session.email,
    phone: req.session.phone,
    firstname: req.session.firstname,
    lastname: req.session.lastname,
    user_id: req.session.userId,
    middlename: req.session.middlename,
    gender: req.session.gender,
    birthdate: req.session.birthdate,
    age: req.session.age,
    role: req.session.role,
    user_id_id: req.session.user_id_id
  });
});

/**
 * POST /logout
 * Purpose: Destroy user session and log them out
 * 
 * Response:
 *   - Success (200): Session destroyed, user logged out
 *   - Error (500): Failed to destroy session
 * 
 * Process: Destroys the server-side session, invalidating the session ID
 */
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send({ message: "Logout failed" });
    }
    res.send({ message: "Logged out successfully" });
  });
});

// ============================================================================
// SECTION 11: MOBILE API AUTHENTICATION
// ============================================================================
// Mobile apps use token-based authentication instead of sessions
// Tokens are sent in the Authorization header as "Bearer <token>"

/**
 * generateToken
 * Purpose: Create a simple authentication token for mobile users
 * 
 * Token Format: Base64-encoded JSON containing userId and timestamp
 * 
 * Note: This is a simple implementation. For production, consider using
 * JWT (JSON Web Tokens) with proper signing and expiration.
 * 
 * @param {string} userId - MongoDB user ID
 * @returns {string} Base64-encoded token
 */
const generateToken = (userId) => {
  const payload = {
    userId: userId.toString(),
    timestamp: Date.now()
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

/**
 * verifyMobileToken
 * Purpose: Middleware to verify authentication token for mobile API requests
 * 
 * Process:
 *   1. Extract token from Authorization header (format: "Bearer <token>")
 *   2. Decode token and extract userId
 *   3. Verify user exists and is active
 *   4. Attach user to request object for use in route handlers
 * 
 * Usage: Add before mobile API routes that require authentication
 * Example: app.get("/user/profile", verifyMobileToken, async (req, res) => {...})
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
const verifyMobileToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.status) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    req.userId = user._id.toString();
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

/**
 * POST /auth/mobile-login
 * Purpose: Authenticate mobile app users and return authentication token
 * 
 * Request Body:
 *   - email: User's email address
 *   - password: User's password
 * 
 * Response:
 *   - Success (200): Returns authentication token and user data
 *   - Error (400): Missing email or password
 *   - Error (401): Invalid credentials
 *   - Error (500): Database error
 * 
 * Differences from web login:
 *   - Returns token instead of creating session
 *   - Includes patient profile data if available
 *   - Returns data formatted for mobile app consumption
 */
app.post("/auth/mobile-login", async (req, res) => {
  console.log('📱 Mobile login request received:', { email: req.body.email, hasPassword: !!req.body.password });
  
  const { email, password } = req.body;

  if (!email || !password) {
    console.log('❌ Missing email or password');
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find user in MongoDB
    const user = await User.findOne({ email: email.toLowerCase(), status: true });
    
    if (!user) {
      console.log('❌ User not found or inactive:', email.toLowerCase());
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log('✅ User found:', user.email);

    // Compare password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      console.log('❌ Password mismatch for:', email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log('✅ Password verified for:', email);

    // Generate token
    const token = generateToken(user._id);

    // Get patient profile if exists
    const patientProfile = await PatientProfile.findOne({ userId: user._id });

    // Format userData for mobile app
    const userData = {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstname,
      lastName: user.lastname,
      suffix: user.middlename || '',
      PhoneNumber: user.phone || patientProfile?.mobileNumber || '',
      Address: patientProfile?.homeAddress || '',
      Age: user.age || patientProfile?.age || '',
      role: user.role
    };

    console.log('✅ Mobile login successful for:', email);
    res.json({
      token: token,
      userData: userData
    });
  } catch (error) {
    console.error("❌ Mobile login error:", error);
    return res.status(500).json({ message: "Database error", error: error.message });
  }
});

/**
 * POST /auth/mobile-register
 * Purpose: Register a new user from mobile app
 * 
 * Request Body:
 *   - name: Full name (will be parsed into firstname, lastname, suffix)
 *   - age: User's age
 *   - gender: User's gender
 *   - mobile: Phone number (optional)
 *   - address: Home address (optional)
 *   - email: Email address (required, must be unique)
 *   - password: Password (required)
 * 
 * Response:
 *   - Success (200): Returns user ID
 *   - Error (400): Missing required fields or invalid email
 *   - Error (409): Email already in use
 *   - Error (500): Server error
 * 
 * Process:
 *   1. Parse full name into components
 *   2. Calculate approximate birthdate from age
 *   3. Create user account
 *   4. Create patient profile
 *   5. Return user ID
 */
app.post("/auth/mobile-register", async (req, res) => {
  const { name, age, gender, mobile, address, email, password } = req.body;

  if (!name || !age || !gender || !email || !password) {
    return res.status(400).json({ message: "All required fields must be provided" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // Normalize gender to match enum values (Male, Female, Other)
    // Handle any case: "male", "Male", "MALE", "female", etc.
    let finalGender = 'Male'; // Default
    if (gender) {
      const genderLower = String(gender).toLowerCase().trim();
      if (genderLower === 'male') finalGender = 'Male';
      else if (genderLower === 'female') finalGender = 'Female';
      else if (genderLower === 'other') finalGender = 'Other';
      else {
        // Fallback: capitalize first letter
        finalGender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
        // Validate it's one of the allowed values
        const validGenders = ['Male', 'Female', 'Other'];
        if (!validGenders.includes(finalGender)) {
          finalGender = 'Male'; // Default to Male if invalid
        }
      }
    }

    // Parse name into firstname, lastname, suffix
    const nameParts = name.trim().split(/\s+/);
    const firstname = nameParts[0] || '';
    const lastname = nameParts[nameParts.length - 1] || '';
    const middlename = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : null;

    // Calculate birthdate (approximate from age)
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - parseInt(age);
    const birthdate = new Date(birthYear, 0, 1); // January 1st of birth year

    // Create new user
    const user = new User({
      firstname,
      middlename: middlename || null,
      lastname,
      gender: finalGender,
      birthdate: birthdate,
      age: parseInt(age),
      phone: mobile || null,
      email: email.toLowerCase(),
      password, // Will be hashed automatically
      role: 'patient',
      status: true,
      isVerified: false
    });

    await user.save();

    // Create patient profile
    const patientProfile = new PatientProfile({
      userId: user._id,
      firstname,
      middlename: middlename || null,
      lastname,
      gender: user.gender,
      birthdate: birthdate.toISOString().split('T')[0],
      age: age.toString(),
      civilStatus: 'Single', // Default
      mobileNumber: mobile || null,
      emailAddress: email.toLowerCase(),
      homeAddress: address || null
    });

    await patientProfile.save();

    res.json({
      message: "Registration successful",
      userId: user._id.toString()
    });
  } catch (error) {
    console.error("Mobile registration error:", error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already in use" });
    }
    return res.status(500).json({ message: "Error registering user" });
  }
});

/**
 * GET /user/profile
 * Purpose: Retrieve authenticated user's profile information for mobile app
 * 
 * Authentication: Requires valid mobile token (use verifyMobileToken middleware)
 * 
 * Response:
 *   - Success (200): Returns user profile data formatted for mobile
 *   - Error (401): Invalid or missing token
 *   - Error (500): Database error
 * 
 * Returns: User information including name, email, phone, address, age, role
 */
app.get("/user/profile", verifyMobileToken, async (req, res) => {
  try {
    const user = req.user;
    const patientProfile = await PatientProfile.findOne({ userId: user._id });

    // Format response for mobile app
    const profileData = {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstname,
      lastName: user.lastname,
      suffix: user.middlename || '',
      PhoneNumber: user.phone || patientProfile?.mobileNumber || '',
      Address: patientProfile?.homeAddress || '',
      Age: user.age || patientProfile?.age || '',
      signupEmail: user.email,
      role: user.role
    };

    res.json(profileData);
  } catch (error) {
    console.error("Get user profile error:", error);
    return res.status(500).json({ message: "Database error" });
  }
});

/**
 * PUT /user/profile
 * Purpose: Update authenticated user's profile information from mobile app
 * 
 * Authentication: Requires valid mobile token
 * 
 * Request Body (all optional):
 *   - firstName, lastName, suffix: Name components
 *   - PhoneNumber: Phone number
 *   - Address: Home address
 *   - Age: User's age
 *   - signupEmail: Email address
 * 
 * Response:
 *   - Success (200): Profile updated successfully
 *   - Error (401): Invalid token
 *   - Error (500): Database error
 */
app.put("/user/profile", verifyMobileToken, async (req, res) => {
  try {
    const user = req.user;
    const { firstName, lastName, suffix, PhoneNumber, Address, Age, signupEmail } = req.body;

    // Update user
    if (firstName) user.firstname = firstName;
    if (lastName) user.lastname = lastName;
    if (suffix !== undefined) user.middlename = suffix || null;
    if (PhoneNumber) user.phone = PhoneNumber;
    if (Age) user.age = parseInt(Age);
    if (signupEmail) user.email = signupEmail.toLowerCase();

    await user.save();

    // Update or create patient profile
    let patientProfile = await PatientProfile.findOne({ userId: user._id });
    if (patientProfile) {
      if (firstName) patientProfile.firstname = firstName;
      if (lastName) patientProfile.lastname = lastName;
      if (suffix !== undefined) patientProfile.middlename = suffix || null;
      if (PhoneNumber) patientProfile.mobileNumber = PhoneNumber;
      if (Address) patientProfile.homeAddress = Address;
      if (Age) patientProfile.age = Age.toString();
      if (signupEmail) patientProfile.emailAddress = signupEmail.toLowerCase();
      await patientProfile.save();
    } else {
      // Create patient profile if doesn't exist
      patientProfile = new PatientProfile({
        userId: user._id,
        firstname: user.firstname,
        middlename: user.middlename,
        lastname: user.lastname,
        gender: user.gender,
        birthdate: user.birthdate ? user.birthdate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        age: user.age ? user.age.toString() : '',
        civilStatus: 'Single',
        mobileNumber: PhoneNumber || null,
        emailAddress: signupEmail || user.email,
        homeAddress: Address || null
      });
      await patientProfile.save();
    }

    // Return updated profile
    const profileData = {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstname,
      lastName: user.lastname,
      suffix: user.middlename || '',
      PhoneNumber: user.phone || patientProfile.mobileNumber || '',
      Address: patientProfile.homeAddress || '',
      Age: user.age || patientProfile.age || '',
      signupEmail: user.email,
      role: user.role
    };

    res.json(profileData);
  } catch (error) {
    console.error("Update user profile error:", error);
    return res.status(500).json({ message: "Database error" });
  }
});

// ============================================================================
// SECTION 12: MOBILE APPOINTMENT ENDPOINTS
// ============================================================================

/**
 * GET /user/appointments
 * Purpose: Get all appointments for the authenticated mobile user
 * 
 * Authentication: Requires valid mobile token
 * 
 * Response:
 *   - Success (200): Returns array of user's appointments
 *   - Error (401): Invalid token
 *   - Error (500): Database error
 * 
 * Returns: List of appointments with consultation type, date, time, status, doctor info
 */
app.get("/user/appointments", verifyMobileToken, async (req, res) => {
  try {
    const userId = req.userId;
    
    // Find patient profile
    const patientProfile = await PatientProfile.findOne({ userId: userId });
    if (!patientProfile) {
      return res.json([]);
    }

    // Get appointments for this patient
    const appointments = await Appointment.find({ patientId: patientProfile._id })
      .populate('doctorId', 'firstname middlename lastname')
      .sort({ bookingDate: -1, bookingTime: -1 })
      .lean();

    // Helper to get specialization name
    const getSpecialtyName = (specialtyId) => {
      const specialties = {
        1: 'Prenatal', 2: 'Post Natal', 3: 'Family Planning', 4: 'Vaccination (Pedia and Adult)',
        5: 'Ultrasound', 6: 'Laboratory Services', 7: 'ECG', 8: 'Non-stress test for pregnant',
        9: 'Hearing screening test', 10: '2D Echo', 11: 'Minor Surgery', 12: 'Obgyne',
        13: 'Pediatrician', 14: 'Surgeon', 15: 'Internal Medicine', 16: 'Urologist',
        17: 'ENT', 18: 'Opthalmologist', 19: 'Ear Piercing', 20: 'Papsmear'
      };
      return specialties[parseInt(specialtyId)] || 'Unknown';
    };

    // Format for mobile app
    const formattedAppointments = appointments.map(apt => {
      const specialtyId = apt.consultationType;
      const specialtyName = getSpecialtyName(specialtyId);
      
      return {
        _id: apt._id.toString(),
        consultationType: apt.consultationType,
        specialization: {
          _id: specialtyId,
          name: specialtyName
        },
        date: apt.bookingDate,
        bookingDate: apt.bookingDate,
        bookingTime: apt.bookingTime,
        time: apt.bookingTime,
        status: apt.status,
        queueNo: apt.queueNo,
        reason: apt.reason || null,
        doctor: apt.doctorId ? {
          _id: apt.doctorId._id.toString(),
          userAccount: {
            fullname: `${apt.doctorId.firstname} ${apt.doctorId.middlename ? apt.doctorId.middlename + ' ' : ''}${apt.doctorId.lastname}`
          }
        } : null,
        createdAt: apt.createdAt
      };
    });

    res.json(formattedAppointments);
  } catch (error) {
    console.error("Get user appointments error:", error);
    return res.status(500).json({ message: "Database error" });
  }
});

// POST /user/appointments - Create appointment (mobile)
app.post("/user/appointments", verifyMobileToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { firstName, lastName, phone, age, address, specialization, doctor, date, time, reason } = req.body;

    if (!firstName || !lastName || !phone || !age || !address || !specialization || !doctor || !date || !time || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find or create patient profile
    let patientProfile = await PatientProfile.findOne({ userId: userId });
    if (patientProfile) {
      // Update existing profile
      patientProfile.firstname = firstName;
      patientProfile.lastname = lastName;
      patientProfile.mobileNumber = phone;
      patientProfile.age = age.toString();
      patientProfile.homeAddress = address;
      await patientProfile.save();
    } else {
      // Get user data
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Create new patient profile
      patientProfile = new PatientProfile({
        userId: userId,
        firstname: firstName,
        lastname: lastName,
        gender: user.gender || 'Male',
        birthdate: user.birthdate ? user.birthdate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        age: age.toString(),
        civilStatus: 'Single',
        mobileNumber: phone,
        emailAddress: user.email,
        homeAddress: address
      });
      await patientProfile.save();
    }

    // Convert date format if needed (mobile might send YYYY-MM-DD, we need MM-DD-YYYY)
    let formattedDate = date;
    if (date.includes('-') && date.split('-')[0].length === 4) {
      // YYYY-MM-DD format
      const [year, month, day] = date.split('-');
      formattedDate = `${month}-${day}-${year}`;
    }

    // Create appointment
    const appointment = new Appointment({
      patientId: patientProfile._id,
      doctorId: doctor,
      consultationType: specialization,
      bookingDate: formattedDate,
      bookingTime: time,
      status: 'Booked',
      reason: reason || null
    });

    await appointment.save();

    res.json({
      message: "Appointment booked successfully",
      appointmentId: appointment._id.toString()
    });
  } catch (error) {
    console.error("Create appointment error:", error);
    return res.status(500).json({ message: "Database error" });
  }
});

// PUT /user/appointments/:id/cancel - Cancel appointment (mobile)
app.put("/user/appointments/:id/cancel", verifyMobileToken, async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const userId = req.userId;

    // Find patient profile
    const patientProfile = await PatientProfile.findOne({ userId: userId });
    if (!patientProfile) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    // Find appointment and verify it belongs to this patient
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.patientId.toString() !== patientProfile._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update status to Cancelled
    appointment.status = 'Cancelled';
    await appointment.save();

    res.json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error("Cancel appointment error:", error);
    return res.status(500).json({ message: "Database error" });
  }
});

// GET /doctors - Get doctors list (mobile)
app.get("/doctors", async (req, res) => {
  try {
    const doctors = await DoctorProfile.find({ status: '1' })
      .populate('userId', 'firstname middlename lastname email')
      .lean();

    // Format for mobile app
    const formattedDoctors = doctors
      .filter(doctor => doctor.userId && doctor.userId.role === 'doctor')
      .map(doctor => ({
        _id: doctor.userId._id.toString(),
        userAccount: {
          fullname: `${doctor.userId.firstname} ${doctor.userId.middlename ? doctor.userId.middlename + ' ' : ''}${doctor.userId.lastname}`,
          email: doctor.userId.email
        },
        specialization: {
          _id: doctor.specialty?.toString() || '',
          name: getSpecialtyName(doctor.specialty)
        },
        schedules: {} // You can add schedule data here if available
      }));

    res.json(formattedDoctors);
  } catch (error) {
    console.error("Get doctors error:", error);
    return res.status(500).json({ message: "Database error" });
  }
});

/**
 * GET /specializations
 * Purpose: Get list of all available medical specializations/services
 * 
 * Authentication: Public endpoint
 * 
 * Response:
 *   - Success (200): Returns array of specializations
 * 
 * Returns: Hardcoded list of 20 specializations (Prenatal, Post Natal, etc.)
 * Note: This could be moved to a database collection for easier management
 */
app.get("/specializations", async (req, res) => {
  try {
    // Return list of specializations based on specialty numbers
    const specializations = [
      { _id: '1', name: 'Prenatal' },
      { _id: '2', name: 'Post Natal' },
      { _id: '3', name: 'Family Planning' },
      { _id: '4', name: 'Vaccination (Pedia and Adult)' },
      { _id: '5', name: 'Ultrasound' },
      { _id: '6', name: 'Laboratory Services' },
      { _id: '7', name: 'ECG' },
      { _id: '8', name: 'Non-stress test for pregnant' },
      { _id: '9', name: 'Hearing screening test' },
      { _id: '10', name: '2D Echo' },
      { _id: '11', name: 'Minor Surgery' },
      { _id: '12', name: 'Obgyne' },
      { _id: '13', name: 'Pediatrician' },
      { _id: '14', name: 'Surgeon' },
      { _id: '15', name: 'Internal Medicine' },
      { _id: '16', name: 'Urologist' },
      { _id: '17', name: 'ENT' },
      { _id: '18', name: 'Opthalmologist' },
      { _id: '19', name: 'Ear Piercing' },
      { _id: '20', name: 'Papsmear' }
    ];

    res.json(specializations);
  } catch (error) {
    console.error("Get specializations error:", error);
    return res.status(500).json({ message: "Database error" });
  }
});

// Helper function to get specialty name
const getSpecialtyName = (specialtyId) => {
  const specialties = {
    1: 'Prenatal',
    2: 'Post Natal',
    3: 'Family Planning',
    4: 'Vaccination (Pedia and Adult)',
    5: 'Ultrasound',
    6: 'Laboratory Services',
    7: 'ECG',
    8: 'Non-stress test for pregnant',
    9: 'Hearing screening test',
    10: '2D Echo',
    11: 'Minor Surgery',
    12: 'Obgyne',
    13: 'Pediatrician',
    14: 'Surgeon',
    15: 'Internal Medicine',
    16: 'Urologist',
    17: 'ENT',
    18: 'Opthalmologist',
    19: 'Ear Piercing',
    20: 'Papsmear'
  };
  return specialties[specialtyId] || 'Unknown Specialty';
};

// GET /schedule/:doctorId - Get doctor schedule (mobile)
app.get("/schedule/:doctorId", async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    
    // For now, return a default schedule structure
    // You can customize this based on your actual schedule system
    const schedule = {
      Monday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      Tuesday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      Wednesday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      Thursday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      Friday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      Saturday: ['09:00', '10:00', '11:00'],
      Sunday: []
    };

    res.json(schedule);
  } catch (error) {
    console.error("Get doctor schedule error:", error);
    return res.status(500).json({ message: "Database error" });
  }
});

// GET /booked-times - Get booked times for a doctor and date (mobile)
app.get("/booked-times", async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({ message: "doctorId and date are required" });
    }

    // Convert date format if needed
    let formattedDate = date;
    if (date.includes('-') && date.split('-')[0].length === 4) {
      const [year, month, day] = date.split('-');
      formattedDate = `${month}-${day}-${year}`;
    }

    // Find appointments for this doctor and date
    const appointments = await Appointment.find({
      doctorId: doctorId,
      bookingDate: formattedDate,
      status: { $in: ['Booked', 'In Queue'] }
    }).select('bookingTime').lean();

    const bookedTimes = appointments.map(apt => apt.bookingTime);

    res.json(bookedTimes);
  } catch (error) {
    console.error("Get booked times error:", error);
    return res.status(500).json({ message: "Database error" });
  }
});

// POST /auth/change-password - Change password (mobile)
app.post("/auth/change-password", verifyMobileToken, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = req.user;

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Update password (will be hashed automatically by pre-save hook)
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ message: "Database error" });
  }
});

// ============================================================================
// END MOBILE API ENDPOINTS
// ============================================================================

// ============================================================================
// SECTION 14: USER MANAGEMENT ENDPOINTS (WEB)
// ============================================================================
// These endpoints are used by the web interface for managing user accounts

/**
 * GET /users
 * Purpose: Get list of all users for User Access Management page
 * 
 * Query Parameters (optional):
 *   - role: Filter by user role (doctor, patient, staff)
 *   - fullname: Search by full name (case-insensitive partial match)
 * 
 * Response:
 *   - Success (200): Returns array of users (excluding admins)
 *   - Error (500): Database error
 * 
 * Use Case: Admin/staff can view and manage user accounts
 */
app.get("/users", async (req, res) => {
  try {
    const { role, fullname } = req.query;

    // Build MongoDB query
    const query = { role: { $ne: 'admin' } };

    if (role) {
      query.role = role;
    }

    if (fullname) {
      query.$or = [
        { firstname: { $regex: fullname, $options: 'i' } },
        { lastname: { $regex: fullname, $options: 'i' } },
        { $expr: { $regexMatch: { input: { $concat: ['$firstname', ' ', '$lastname'] }, regex: fullname, options: 'i' } } }
      ];
    }

    const users = await User.find(query)
      .select('_id firstname middlename lastname role email status updatedAt')
      .lean();

    // Format results to match expected format
    const results = users.map(user => ({
      user_id: user._id.toString(),
      role: user.role,
      fullname: `${user.firstname} ${user.lastname}`,
      status: user.status ? 'Active' : 'Inactive',
      username: user.email,
      updated_date: user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : null
    }));

    res.json({ data: results });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ message: "Database error" });
  }
});

app.get("/users_update/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findOne({ 
      _id: userId, 
      role: { $ne: 'admin' } 
    }).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Format result to match expected format
    const result = {
      user_id: user._id.toString(),
      fullname: `${user.firstname} ${user.lastname}`,
      firstname: user.firstname,
      middlename: user.middlename,
      lastname: user.lastname,
      birthdate: user.birthdate ? new Date(user.birthdate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : null,
      gender: user.gender,
      role: user.role,
      username: user.email,
      status: user.status ? 'Active' : 'Inactive',
      updated_date: user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : null
    };

    res.json({ data: [result] });
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({ message: "Database error" });
  }
});

// POST - Update account_info by user ID (MongoDB)
app.post("/updateUserAccount", async (req, res) => {
  try {
    const { user_id, email, password, status } = req.body;

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update email if provided
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user_id } });
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
      }
      user.email = email.toLowerCase();
    }

    // Update password if provided
    if (password) {
      user.password = password; // Will be hashed by pre-save hook
    }

    // Update status if provided
    if (status !== undefined) {
      user.status = status === 1 || status === true;
    }

    user.updatedAt = new Date();
    await user.save();

    res.json({ message: "User account updated successfully" });
  } catch (error) {
    console.error("Update user account error:", error);
    return res.status(500).json({ message: "Update failed" });
  }
});

// BOOKING APPOINTMENT - INSERT BOOKING

app.post("/book-appointment", async (req, res) => {
  try {
    const {
      user_id,
      firstname,
      middlename,
      lastname,
      gender,
      birthdate,
      age,
      civil_status,
      mobile_number,
      email_address,
      home_address,
      emergency_name,
      emergency_relationship,
      emergency_mobile_number,
      bloodtype,
      allergies,
      current_medication,
      past_medical_condition,
      chronic_illness,
      consultation_type,
      booking_date,
      booking_time,
      status,
      doctor_id,
    } = req.body;

    if (
      !firstname ||
      !lastname ||
      !gender ||
      !birthdate ||
      !age ||
      !civil_status
    ) {
      return res.status(400).send({ message: "Missing required patient info" });
    }

    // Step 1: Check if patient profile exists, create or update if needed
    let patientProfile = await PatientProfile.findOne({ userId: user_id });

    if (patientProfile) {
      // Update existing profile
      patientProfile.firstname = firstname;
      patientProfile.middlename = middlename || null;
      patientProfile.lastname = lastname;
      patientProfile.gender = gender;
      patientProfile.birthdate = birthdate;
      patientProfile.age = age;
      patientProfile.civilStatus = civil_status;
      patientProfile.mobileNumber = mobile_number || null;
      patientProfile.emailAddress = email_address || null;
      patientProfile.homeAddress = home_address || null;
      patientProfile.emergencyName = emergency_name || null;
      patientProfile.emergencyRelationship = emergency_relationship || null;
      patientProfile.emergencyMobileNumber = emergency_mobile_number || null;
      patientProfile.bloodtype = bloodtype || null;
      patientProfile.allergies = allergies || null;
      patientProfile.currentMedication = current_medication || null;
      patientProfile.pastMedicalCondition = past_medical_condition || null;
      patientProfile.chronicIllness = chronic_illness || null;
      await patientProfile.save();
    } else {
      // Create new profile
      patientProfile = new PatientProfile({
        userId: user_id,
        firstname,
        middlename: middlename || null,
        lastname,
        gender,
        birthdate,
        age,
        civilStatus: civil_status,
        mobileNumber: mobile_number || null,
        emailAddress: email_address || null,
        homeAddress: home_address || null,
        emergencyName: emergency_name || null,
        emergencyRelationship: emergency_relationship || null,
        emergencyMobileNumber: emergency_mobile_number || null,
        bloodtype: bloodtype || null,
        allergies: allergies || null,
        currentMedication: current_medication || null,
        pastMedicalCondition: past_medical_condition || null,
        chronicIllness: chronic_illness || null
      });
      await patientProfile.save();
    }

    // Step 2: Convert doctor_id to MongoDB ObjectId if provided
    let doctorObjectId = null;
    if (doctor_id && doctor_id !== 0 && doctor_id !== '0') {
      // Find doctor user
      const doctorUser = await User.findById(doctor_id);
      if (doctorUser) {
        doctorObjectId = doctorUser._id;
      }
    }

    // Step 3: Check for conflicting appointments (same doctor, date, and time)
    if (doctorObjectId) {
      const existingAppointment = await Appointment.findOne({
        doctorId: doctorObjectId,
        bookingDate: booking_date,
        bookingTime: booking_time,
        status: { $in: ['Booked', 'In Queue'] }
      });

      if (existingAppointment) {
        return res.status(400).send({
          message: "This time slot is already booked for the selected doctor. Please choose a different time.",
          conflict: true
        });
      }
    }

    // Step 4: Create appointment
    const appointment = new Appointment({
      patientId: patientProfile._id,
      doctorId: doctorObjectId,
      consultationType: consultation_type,
      bookingDate: booking_date,
      bookingTime: booking_time,
      status: status || "Booked"
    });

    await appointment.save();

    return res.send({
      message: "Appointment booked successfully",
      appointment_id: appointment._id.toString(),
      patient_id: patientProfile._id.toString(),
    });
  } catch (error) {
    console.error("Book appointment error:", error);
    return res.status(500).send({ message: "Error booking appointment" });
  }
});

// ============================================================================
// SECTION 16: DASHBOARD STATISTICS ENDPOINTS
// ============================================================================
// These endpoints provide statistics for the admin/staff dashboard

/**
 * GET /appointment-count
 * Purpose: Get total count of booked appointments
 * 
 * Response:
 *   - Success (200): Returns total_booked count
 *   - Error (500): Database error
 * 
 * Use Case: Display total appointments on dashboard
 */
app.get("/appointment-count", async (req, res) => {
  try {
    const count = await Appointment.countDocuments({ status: 'Booked' });
    res.send({
      message: "Count fetched successfully",
      total_booked: count,
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).send({ message: "Database query failed" });
  }
});

/**
 * GET /appointment-count-today
 * Purpose: Get count of appointments booked for today
 * 
 * Response:
 *   - Success (200): Returns total_booked_today count
 *   - Error (500): Database error
 * 
 * Use Case: Display today's appointment count on dashboard
 */
app.get("/appointment-count-today", async (req, res) => {
  try {
    const today = new Date();
    const todayStr = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}-${today.getFullYear()}`;
    
    const count = await Appointment.countDocuments({ 
      status: 'Booked',
      bookingDate: todayStr
    });
    
    res.send({
      message: "Count fetched successfully",
      total_booked_today: count,
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).send({ message: "Database query failed" });
  }
});

/**
 * GET /overall_patients
 * Purpose: Get total count of all patients in the system
 * 
 * Response:
 *   - Success (200): Returns total_patients count
 *   - Error (500): Database error
 * 
 * Use Case: Display total patient count on dashboard
 */
app.get("/overall_patients", async (req, res) => {
  try {
    const count = await PatientProfile.countDocuments();
    res.send({
      message: "Count fetched successfully",
      patient_count: count,
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).send({ message: "Database query failed" });
  }
});

/**
 * GET /item-inventory-count
 * Purpose: Get total count of items in inventory
 * 
 * Response:
 *   - Success (200): Returns inventory_count
 *   - Error (500): Database error
 * 
 * Use Case: Display total inventory items count on dashboard
 */
app.get("/item-inventory-count", async (req, res) => {
  try {
    const count = await Inventory.countDocuments();
    res.send({
      message: "Count fetched successfully",
      inventory_count: count,
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).send({ message: "Database query failed" });
  }
});

/**
 * GET /appointment-count-completed-today
 * Purpose: Get count of completed appointments for today
 */
app.get("/appointment-count-completed-today", async (req, res) => {
  try {
    const today = new Date();
    const todayStr = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}-${today.getFullYear()}`;
    
    const count = await Appointment.countDocuments({ 
      status: 'Completed',
      bookingDate: todayStr
    });
    
    res.send({ count });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).send({ message: "Database query failed" });
  }
});

/**
 * GET /appointment-count-in-queue
 * Purpose: Get count of appointments currently in queue
 */
app.get("/appointment-count-in-queue", async (req, res) => {
  try {
    const count = await Appointment.countDocuments({ status: 'In Queue' });
    res.send({ count });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).send({ message: "Database query failed" });
  }
});

/**
 * GET /appointment-count-cancelled
 * Purpose: Get count of cancelled appointments
 */
app.get("/appointment-count-cancelled", async (req, res) => {
  try {
    const count = await Appointment.countDocuments({ status: 'Cancelled' });
    res.send({ count });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).send({ message: "Database query failed" });
  }
});

/**
 * GET /doctor-count
 * Purpose: Get total count of doctors in the system
 */
app.get("/doctor-count", async (req, res) => {
  try {
    const count = await User.countDocuments({ role: 'doctor' });
    res.send({ count });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).send({ message: "Database query failed" });
  }
});

// ============================================================================
// SECTION 17: APPOINTMENT MANAGEMENT ENDPOINTS (WEB)
// ============================================================================

/**
 * GET /getBookingList
 * Purpose: Get list of all appointments with patient information
 * 
 * Response:
 *   - Success (200): Returns array of appointments with patient details
 *   - Error (500): Database error
 * 
 * Returns: List of appointments sorted by creation date (newest first)
 * Includes: patient info, consultation type, booking date/time, status, queue number
 * 
 * Use Case: Display all appointments in appointment management page
 */
app.get("/getBookingList", async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'firstname middlename lastname gender age')
      .sort({ createdAt: -1 })
      .lean();

    const results = appointments.map(appointment => ({
      patient_id: appointment.patientId ? appointment.patientId._id.toString() : '',
      id: appointment._id.toString(),
      consultation_type: appointment.consultationType,
      booking_date: appointment.bookingDate,
      booking_time: appointment.bookingTime,
      status: appointment.status,
      queue_no: appointment.queueNo,
      fullname: appointment.patientId ? `${appointment.patientId.firstname} ${appointment.patientId.lastname}` : '',
      gender: appointment.patientId ? appointment.patientId.gender : '',
      age: appointment.patientId ? appointment.patientId.age : ''
    }));

    res.json({ data: results });
  } catch (error) {
    console.error("Get booking list error:", error);
    return res.status(500).json({ message: "Database error" });
  }
});

/**
 * GET /getBookingListById/:id
 * Purpose: Get detailed information about a specific appointment
 * 
 * URL Parameters:
 *   - id: Appointment ID (MongoDB ObjectId)
 * 
 * Response:
 *   - Success (200): Returns appointment details
 *   - Error (404): Appointment not found
 *   - Error (500): Database error
 * 
 * Use Case: View individual appointment details
 */
app.get("/getBookingListById/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const appointment = await Appointment.findById(id)
      .populate('patientId', 'firstname middlename lastname gender age')
      .lean();

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const result = {
      patient_id: appointment.patientId ? appointment.patientId._id.toString() : '',
      id: appointment._id.toString(),
      consultation_type: appointment.consultationType,
      booking_date: appointment.bookingDate,
      booking_time: appointment.bookingTime,
      status: appointment.status,
      queue_no: appointment.queueNo,
      fullname: appointment.patientId ? `${appointment.patientId.firstname} ${appointment.patientId.lastname}` : '',
      gender: appointment.patientId ? appointment.patientId.gender : '',
      age: appointment.patientId ? appointment.patientId.age : ''
    };

    res.json({ data: [result] });
  } catch (error) {
    console.error("Get booking by id error:", error);
    return res.status(500).json({ message: "Database error" });
  }
});

// CREATING QUEUE NUMBER (MongoDB)
app.post("/generateQueueNumber/:id", async (req, res) => {
  try {
    const bookingId = req.params.id;

    const today = new Date();
    const todayStr = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}-${today.getFullYear()}`;
    
    // Get latest queue_no for today only
    const latestAppointment = await Appointment.findOne({
      bookingDate: todayStr,
      queueNo: { $ne: null, $ne: '', $regex: /^[0-9]+$/ }
    })
      .sort({ queueNo: -1 })
      .lean();

    let newQueueNo;

    if (!latestAppointment || !latestAppointment.queueNo) {
      // No queue numbers for today yet — start at 001
      newQueueNo = "001";
    } else {
      // Get latest number and increment
      const raw = latestAppointment.queueNo.toString().trim();
      const latest = Number(raw);

      if (isNaN(latest)) {
        return res
          .status(400)
          .json({ message: "Invalid latest queue number in DB" });
      }

      newQueueNo = (latest + 1).toString().padStart(3, "0");
    }

    // Update appointment
    const appointment = await Appointment.findById(bookingId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.queueNo = newQueueNo;
    appointment.status = 'In Queue';
    await appointment.save();

    res.json({
      message: "Queue number generated successfully",
      queue_no: newQueueNo,
    });
  } catch (error) {
    console.error("Generate queue number error:", error);
    return res.status(500).json({ message: "Database error" });
  }
});

// Removed toMySQLDateFormat - no longer needed (all data in MongoDB)

// GET LIST OF BOOKING WITH SEARCH CRITERIA (MongoDB)
app.get("/getBookingListSearch", async (req, res) => {
  try {
    const { booking_date, status, fullname, consultation_type, role, user_id } = req.query;
    
    // Build MongoDB query
    const query = {};
    
    if (booking_date) {
      query.bookingDate = booking_date;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (consultation_type) {
      query.consultationType = consultation_type;
    }
    
    // Role-based filtering
    if (role === "patient" && user_id) {
      // Find patient profile by user_id
      const patientProfile = await PatientProfile.findOne({ userId: user_id });
      if (patientProfile) {
        query.patientId = patientProfile._id;
      } else {
        // No patient profile found, return empty
        return res.json({ data: [] });
      }
    }
    
    if (role === "doctor" && user_id) {
      query.doctorId = user_id;
      // Show both "Booked" and "In Queue" appointments for doctors
      query.status = { $in: ["Booked", "In Queue"] };
    }
    
    let appointments = await Appointment.find(query)
      .populate('patientId', 'firstname middlename lastname gender age userId')
      .sort({ createdAt: -1 })
      .lean();
    
    // Filter by fullname if provided
    if (fullname) {
      const searchTerm = fullname.toLowerCase();
      appointments = appointments.filter(appointment => {
        if (!appointment.patientId) return false;
        const name = `${appointment.patientId.firstname || ''} ${appointment.patientId.lastname || ''}`.toLowerCase();
        return name.includes(searchTerm);
      });
    }
    
    // Format results
    const results = appointments.map(appointment => ({
      patient_id: appointment.patientId ? appointment.patientId._id.toString() : '',
      id: appointment._id.toString(),
      consultation_type: appointment.consultationType,
      booking_date: appointment.bookingDate,
      booking_time: appointment.bookingTime,
      status: appointment.status,
      queue_no: appointment.queueNo,
      fullname: appointment.patientId ? `${appointment.patientId.firstname} ${appointment.patientId.lastname}` : '',
      gender: appointment.patientId ? appointment.patientId.gender : '',
      age: appointment.patientId ? appointment.patientId.age : '',
      patient_user_id: appointment.patientId && appointment.patientId.userId ? appointment.patientId.userId.toString() : ''
    }));

    res.json({ data: results });
  } catch (error) {
    console.error("Get booking list search error:", error);
    return res.status(500).json({ message: "Database error", error: error.message });
  }
});

// ============================================================================
// SECTION 18: INVENTORY MANAGEMENT ENDPOINTS
// ============================================================================

/**
 * POST /saveInventoryItem
 * Purpose: Create a new inventory item
 * 
 * Request Body:
 *   - addItem: Item name
 *   - addCategory: Category ID (references InventoryCategory)
 *   - addQuantity: Current quantity
 *   - addMinimum: Minimum/average quantity
 *   - addPrice: Item price
 * 
 * Response:
 *   - Success (200): Returns created item ID
 *   - Error (400): Missing required fields or item already exists
 *   - Error (500): Database error
 * 
 * Process:
 *   1. Check if item already exists (case-insensitive)
 *   2. Create or find category
 *   3. Create new inventory item
 *   4. Return item ID
 */
app.post("/saveInventoryItem", async (req, res) => {
  try {
    const { addItem, addCategory, addQuantity, addMinimum, addPrice } = req.body;

    // Validate required fields
    if (!addItem || !addCategory) {
      return res.status(400).json({ message: "Item name and category are required" });
    }

    // Step 1: Check if item already exists (case-insensitive)
    const existing = await Inventory.findOne({ 
      item: { $regex: new RegExp(`^${addItem}$`, 'i') }
    });

    if (existing) {
      return res.status(400).json({ message: "Item already listed" });
    }

    // Step 2: Convert category to ObjectId
    let categoryObjectId;
    const mongoose = require('mongoose');
    
    // Check if addCategory is already a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(addCategory)) {
      // It's already an ObjectId, use it directly
      const categoryExists = await InventoryCategory.findById(addCategory);
      if (!categoryExists) {
        return res.status(400).json({ message: "Invalid category" });
      }
      categoryObjectId = addCategory;
    } else {
      // It's a number or string, need to find the category
      // Map numeric values to category names (from HTML)
      const categoryMap = {
        '1': 'Medicines / Pharmaceuticals',
        '2': 'Personal Protective Equipment (PPE)',
        '3': 'Medical Instruments / Tools',
        '4': 'Surgical Supplies',
        '5': 'Consumables / Disposables',
        '6': 'Cleaning and Disinfection Supplies',
        '7': 'Diagnostic Supplies',
        '8': 'IV Supplies',
        '9': 'Office and Stationery Supplies',
        '10': 'Equipment and Devices',
        '11': 'Vaccines',
        '12': 'Reagents / Lab Supplies'
      };
      
      const categoryName = categoryMap[addCategory.toString()];
      if (categoryName) {
        // Find category by name
        const categoryDoc = await InventoryCategory.findOne({ category: categoryName });
        if (!categoryDoc) {
          return res.status(400).json({ message: `Category "${categoryName}" not found in database` });
        }
        categoryObjectId = categoryDoc._id;
      } else {
        // Try to find by the value directly (in case it's a category name)
        const categoryDoc = await InventoryCategory.findOne({ category: addCategory });
        if (categoryDoc) {
          categoryObjectId = categoryDoc._id;
        } else {
          return res.status(400).json({ message: "Invalid category" });
        }
      }
    }

    // Step 3: Calculate status
    let status = 'in stock';
    const quantity = parseInt(addQuantity) || 0;
    const minimum = addMinimum ? parseInt(addMinimum) : null;
    
    if (quantity === 0) {
      status = 'out of stock';
    } else if (minimum && quantity < minimum) {
      status = 'for reorder';
    }

    // Step 4: Create new item
    const newItem = new Inventory({
      item: addItem,
      category: categoryObjectId,
      quantity: quantity,
      averageQuantity: minimum || null,
      price: addPrice ? parseFloat(addPrice) : null,
      status: status
    });

    await newItem.save();

    res.json({ message: "Inventory item added successfully" });
  } catch (error) {
    console.error("Save inventory error:", error);
    return res.status(500).json({ message: "Error saving inventory item", error: error.message });
  }
});

// GET LIST OF INVENTORY WITH CRITERIA (MongoDB)
app.get("/getInventory", async (req, res) => {
  try {
    const { item, status } = req.query;
    
    // Build MongoDB query
    const query = {};
    
    if (status) {
      // Case-insensitive status matching
      query.status = { $regex: new RegExp(`^${status}$`, 'i') };
    }
    
    // Get inventory items with populated category
    let items = await Inventory.find(query)
      .populate('category', 'category')
      .lean();
    
    // Filter by item name or category if provided
    if (item) {
      const searchTerm = item.toLowerCase();
      items = items.filter(inv => {
        const itemName = inv.item ? inv.item.toLowerCase() : '';
        const categoryName = inv.category && inv.category.category ? inv.category.category.toLowerCase() : '';
        return itemName.includes(searchTerm) || categoryName.includes(searchTerm);
      });
    }
    
    // Format results to match expected structure
    const results = items.map(inv => ({
      id: inv._id.toString(),
      item: inv.item,
      category: inv.category ? inv.category.category : '',
      quantity: inv.quantity,
      average_quantity: inv.averageQuantity,
      price: inv.price,
      status: inv.status
    }));

    res.json({ data: results });
  } catch (error) {
    console.error("Get inventory error:", error);
    return res.status(500).json({ message: "Database error" });
  }
});

app.get("/getItemInventoryByID/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const item = await Inventory.findById(id)
      .populate('category', 'category')
      .lean();

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const result = {
      id: item._id.toString(),
      item: item.item,
      category: item.category ? item.category.category : '',
      category_id: item.category ? item.category._id.toString() : '',
      quantity: item.quantity,
      average_quantity: item.averageQuantity,
      price: item.price,
      status: item.status
    };

    res.json({ data: [result] });
  } catch (error) {
    console.error("Get item by ID error:", error);
    return res.status(500).json({ message: "Database error" });
  }
});

app.post("/updateInventory", async (req, res) => {
  try {
    const {
      id,
      updateItemName,
      updateCategory,
      updateQuantity,
      updateMinimum,
      updatePrice,
    } = req.body;

    // Validate required fields
    if (!id) {
      return res.status(400).json({ message: "Item ID is required" });
    }
    if (!updateItemName) {
      return res.status(400).json({ message: "Item name is required" });
    }
    if (!updateCategory) {
      return res.status(400).json({ message: "Category is required" });
    }

    const item = await Inventory.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Convert category to ObjectId if needed
    let categoryObjectId;
    const mongoose = require('mongoose');
    
    if (mongoose.Types.ObjectId.isValid(updateCategory)) {
      const categoryExists = await InventoryCategory.findById(updateCategory);
      if (!categoryExists) {
        return res.status(400).json({ message: "Invalid category" });
      }
      categoryObjectId = updateCategory;
    } else {
      // Map numeric values to category names
      const categoryMap = {
        '1': 'Medicines / Pharmaceuticals',
        '2': 'Personal Protective Equipment (PPE)',
        '3': 'Medical Instruments / Tools',
        '4': 'Surgical Supplies',
        '5': 'Consumables / Disposables',
        '6': 'Cleaning and Disinfection Supplies',
        '7': 'Diagnostic Supplies',
        '8': 'IV Supplies',
        '9': 'Office and Stationery Supplies',
        '10': 'Equipment and Devices',
        '11': 'Vaccines',
        '12': 'Reagents / Lab Supplies'
      };
      
      const categoryName = categoryMap[updateCategory?.toString()];
      if (categoryName) {
        const categoryDoc = await InventoryCategory.findOne({ category: categoryName });
        if (!categoryDoc) {
          return res.status(400).json({ message: `Category "${categoryName}" not found` });
        }
        categoryObjectId = categoryDoc._id;
      } else {
        const categoryDoc = await InventoryCategory.findOne({ category: updateCategory });
        if (categoryDoc) {
          categoryObjectId = categoryDoc._id;
        } else {
          return res.status(400).json({ message: "Invalid category" });
        }
      }
    }

    // Calculate status
    let status = 'in stock';
    const quantity = parseInt(updateQuantity) || 0;
    const minimum = updateMinimum ? parseInt(updateMinimum) : null;
    
    if (quantity === 0) {
      status = 'out of stock';
    } else if (minimum && quantity < minimum) {
      status = 'for reorder';
    }

    // Update item
    item.item = updateItemName;
    item.category = categoryObjectId;
    item.quantity = quantity;
    item.averageQuantity = minimum || null;
    item.price = updatePrice ? parseFloat(updatePrice) : null;
    item.status = status;

    await item.save();

    res.json({ message: "Inventory updated successfully" });
  } catch (error) {
    console.error("Update inventory error:", error);
    return res.status(500).json({ message: "Inventory update failed", error: error.message });
  }
});

app.post("/createAccount", async (req, res) => {
  try {
    const {
      firstname,
      middlename,
      lastname,
      gender,
      birthdate,
      email,
      password,
      role,
      status,
    } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).send({ message: "Email already in use" });
    }

    // Create new user (password will be automatically hashed by the model)
    const user = new User({
      firstname,
      middlename: middlename || null,
      lastname,
      gender,
      birthdate: new Date(birthdate),
      email: email.toLowerCase(),
      password, // Will be hashed automatically by the model's pre-save hook
      role: role || 'patient',
      status: status !== undefined ? (status === 1 || status === true) : true,
      isVerified: false
    });

    await user.save();

    // If doctor, create doctor profile in MongoDB
    if (role && role.toLowerCase() === "doctor") {
      const doctorProfile = new DoctorProfile({
        userId: user._id,
        specialty: null,
        department: '',
        yearsOfExperience: 0,
        professionalBoard: '',
        certificate: '',
        status: '1'
      });
      await doctorProfile.save();
    }

    res.send({
      message: role && role.toLowerCase() === "doctor" 
        ? "Doctor account created successfully" 
        : "User created successfully",
      userId: user._id.toString(),
      accountId: user._id.toString(),
    });
  } catch (error) {
    console.error("Create account error:", error);
    if (error.code === 11000) {
      return res.status(409).send({ message: "Email already in use" });
    }
    return res.status(500).send({ message: "Error creating account" });
  }
});

app.post("/updateDoctorPassword", async (req, res) => {
  try {
    const { user_id, password } = req.body;

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = password;
    user.updatedAt = new Date();
    await user.save();

    res.json({ message: "User password updated successfully" });
  } catch (error) {
    console.error("Update password error:", error);
    return res.status(500).json({ message: "Update failed" });
  }
});

app.post("/updateDoctorInfo", async (req, res) => {
  try {
    const {
      user_id,
      firstname,
      middlename,
      lastname,
      gender,
      birthdate,
      age,
      contactNumber,
      emailAddress,
      specialty,
      department,
      yearsofexp,
      professionalBoard,
      certificate,
      status,
    } = req.body;

    // Update user information
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.firstname = firstname;
    user.middlename = middlename || null;
    user.lastname = lastname;
    user.gender = gender;
    user.birthdate = new Date(birthdate);
    user.age = age || null;
    user.phone = contactNumber || null;
    
    // Update email if provided
    if (emailAddress) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ 
        email: emailAddress.toLowerCase(), 
        _id: { $ne: user_id } 
      });
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
      }
      user.email = emailAddress.toLowerCase();
    }
    
    await user.save();

    // Update or create doctor profile
    let doctorProfile = await DoctorProfile.findOne({ userId: user_id });
    
    if (doctorProfile) {
      doctorProfile.specialty = specialty || null;
      doctorProfile.department = department || '';
      doctorProfile.yearsOfExperience = yearsofexp || 0;
      doctorProfile.professionalBoard = professionalBoard || '';
      doctorProfile.certificate = certificate || '';
      doctorProfile.status = status || '1';
      await doctorProfile.save();
    } else {
      // Create new doctor profile
      doctorProfile = new DoctorProfile({
        userId: user_id,
        specialty: specialty || null,
        department: department || '',
        yearsOfExperience: yearsofexp || 0,
        professionalBoard: professionalBoard || '',
        certificate: certificate || '',
        status: status || '1'
      });
      await doctorProfile.save();
    }

    res.json({ message: "Doctor profile updated successfully" });
  } catch (error) {
    console.error("Update doctor info error:", error);
    return res.status(500).json({ message: "Failed to update doctor profile" });
  }
});

app.get("/getProfessionalInfo/:user_id", async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const doctorProfile = await DoctorProfile.findOne({ userId: user_id }).lean();

    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const results = [{
      specialty: doctorProfile.specialty,
      department: doctorProfile.department,
      yearsofexp: doctorProfile.yearsOfExperience,
      professionalBoard: doctorProfile.professionalBoard,
      certificate: doctorProfile.certificate,
      status: doctorProfile.status
    }];

    res.json(results);
  } catch (error) {
    console.error("Get professional info error:", error);
    return res.status(500).json({ message: "Database error" });
  }
});

app.get("/getPatientsList", async (req, res) => {
  try {
    const { fullname, emailAddress, user_id, role } = req.query;

    // Build MongoDB query
    const query = {};
    
    if (role === "patient" && user_id) {
      query.userId = user_id;
    }

    // Get patient profiles
    let patients = await PatientProfile.find(query)
      .populate('userId', 'email')
      .lean();

    // Filter by fullname if provided
    if (fullname) {
      const searchTerm = fullname.toLowerCase();
      patients = patients.filter(patient => {
        const fullName = `${patient.firstname || ''} ${patient.middlename || ''} ${patient.lastname || ''}`.toLowerCase();
        return fullName.includes(searchTerm) ||
               (patient.firstname && patient.firstname.toLowerCase().includes(searchTerm)) ||
               (patient.lastname && patient.lastname.toLowerCase().includes(searchTerm));
      });
    }

    // Filter by email if provided
    if (emailAddress) {
      const searchTerm = emailAddress.toLowerCase();
      patients = patients.filter(patient => {
        const email = patient.emailAddress || (patient.userId && patient.userId.email) || '';
        return email.toLowerCase().includes(searchTerm);
      });
    }

    // Format results
    const results = patients.map(patient => ({
      id: patient._id.toString(),
      fullname: `${patient.firstname} ${patient.lastname}`,
      gender: patient.gender,
      age: patient.age,
      mobile_number: patient.mobileNumber,
      email_address: patient.emailAddress || (patient.userId && patient.userId.email) || '',
      user_id: patient.userId ? patient.userId._id.toString() : patient.userId.toString()
    }));

    res.json({ data: results });
  } catch (error) {
    console.error("Get patients list error:", error);
    return res.status(500).json({ message: "Database error", error: error.message });
  }
});

app.get("/getDoctorsList", async (req, res) => {
  try {
    const { doctorName, specialtyId } = req.query;
    
    // Build MongoDB query
    const matchQuery = {};
    
    if (specialtyId) {
      matchQuery.specialty = parseInt(specialtyId);
    }
    
    // Get doctor profiles with populated user data
    let doctors = await DoctorProfile.find(matchQuery)
      .populate('userId', 'firstname middlename lastname email')
      .lean();
    
    // Filter by doctor name if provided
    if (doctorName) {
      const searchTerm = doctorName.toLowerCase();
      doctors = doctors.filter(doctor => {
        const user = doctor.userId;
        if (!user) return false;
        const fullName = `${user.firstname || ''} ${user.middlename || ''} ${user.lastname || ''}`.toLowerCase();
        return fullName.includes(searchTerm) ||
               (user.firstname && user.firstname.toLowerCase().includes(searchTerm)) ||
               (user.lastname && user.lastname.toLowerCase().includes(searchTerm));
      });
    }
    
    // Format results
    const results = doctors.map(doctor => ({
      fullname: doctor.userId ? `${doctor.userId.firstname} ${doctor.userId.lastname}` : '',
      specialty: doctor.specialty,
      email: doctor.userId ? doctor.userId.email : '',
      status: doctor.status,
      id: doctor.userId ? doctor.userId._id.toString() : ''
    }));
    
    res.json({ data: results });
  } catch (error) {
    console.error("Get doctors list error:", error);
    return res.status(500).json({ message: "Database error", error: error.message });
  }
});

app.post("/reschedBooking", async (req, res) => {
  try {
    const { booking_id, formattedDate, newBookingTime } = req.body;

    const appointment = await Appointment.findById(booking_id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.bookingDate = formattedDate;
    appointment.bookingTime = newBookingTime;
    await appointment.save();

    res.json({ message: "Booking rescheduled successfully" });
  } catch (error) {
    console.error("Error rescheduling booking:", error);
    return res.status(500).json({ message: "Failed to reschedule booking" });
  }
});

app.post("/cancelBooking", async (req, res) => {
  try {
    const { booking_id, tag } = req.body;

    const appointment = await Appointment.findById(booking_id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = tag;
    await appointment.save();

    res.json({ message: "Booking cancelled" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return res.status(500).json({ message: "Failed to cancel booking" });
  }
});

app.get("/validateAppointment", async (req, res) => {
  try {
    const { booking_date, booking_time, user_id, consultation_type, doctor_id } = req.query;

    if (!booking_date || !booking_time || !user_id || !consultation_type) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    // Check 1: Validate doctor's time slot availability (prevent double-booking same doctor/date/time)
    if (doctor_id && doctor_id !== '0' && doctor_id !== '') {
      const doctorConflict = await Appointment.findOne({
        doctorId: doctor_id,
        bookingDate: booking_date,
        bookingTime: booking_time,
        status: { $in: ['Booked', 'In Queue'] }
      });

      if (doctorConflict) {
        return res.json({
          exists: true,
          message: "This time slot is already booked for the selected doctor. Please choose a different time.",
          conflictType: "doctor_slot"
        });
      }
    }

    // Check 2: Find patient profile by user_id
    const patientProfile = await PatientProfile.findOne({ userId: user_id });
    if (!patientProfile) {
      return res.json({ exists: false });
    }

    // Check 3: Find appointments for this patient on the same date
    const appointments = await Appointment.find({
      patientId: patientProfile._id,
      bookingDate: booking_date,
      status: { $in: ['Booked', 'In Queue'] }
    }).lean();

    const normalizedType = consultation_type.trim().toLowerCase();
    const normalizedTime = booking_time.trim();

    for (const appointment of appointments) {
      const rowType = appointment.consultationType?.trim().toLowerCase();
      const rowTime = appointment.bookingTime?.trim();

      if (rowType === normalizedType && rowTime === normalizedTime) {
        return res.json({
          exists: true,
          message:
            "You have already booked this consultation type at the same date and time.",
        });
      }

      if (rowType === normalizedType && rowTime !== normalizedTime) {
        return res.json({
          exists: true,
          message:
            "You have already booked this consultation type at the same date with a different time.",
        });
      }

      if (rowType !== normalizedType && rowTime === normalizedTime) {
        return res.json({
          exists: true,
          message:
            "You have already booked a different consultation type at the same date and time.",
        });
      }
    }

    // No match found
    return res.json({ exists: false });
  } catch (error) {
    console.error("Validate appointment error:", error);
    return res.status(500).json({ message: "Database error", error: error.message });
  }
});

app.get("/getDoctorsByConsultationType", async (req, res) => {
  try {
    const consultationType = req.query.consultationType;

    if (!consultationType) {
      return res
        .status(400)
        .json({ error: "Missing consultationType parameter" });
    }

    console.log("🔍 Fetching doctors for consultation type:", consultationType);

    // Find doctors with matching specialty in doctors_profile
    // (don't filter by status here – SQL `status` came in as numeric 1 / string '1')
    const doctorProfiles = await DoctorProfile.find({
      specialty: parseInt(consultationType, 10)
    })
      // Populate ALL linked users; we'll filter by role/status manually
      .populate({
        path: "userId",
        select: "firstname lastname middlename role status",
      })
      .lean();

    console.log("📋 Doctor profiles matched by specialty:", doctorProfiles.length);

    // Keep only docs that actually have a linked user with role 'doctor'
    const results = doctorProfiles
      .filter((doctor) => {
        if (!doctor.userId) {
          console.log(
            "⚠️ Doctor profile missing linked user:",
            doctor._id.toString()
          );
          return false;
        }
        if (doctor.userId.role !== "doctor") {
          console.log(
            "⚠️ Linked user is not role=doctor:",
            doctor.userId._id.toString(),
            doctor.userId.role
          );
          return false;
        }
        return true;
      })
      .map((doctor) => ({
        name: `${doctor.userId.firstname} ${doctor.userId.lastname}`,
        id: doctor.userId._id.toString(),
      }));

    console.log("✅ Returning", results.length, "doctors");

    res.json(results);
  } catch (error) {
    console.error("❌ Error fetching doctors:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
});

app.post("/giveRecommendation", async (req, res) => {
  try {
    const { appointment_id, recommendation, follow_up, pres_tag, prescription } = req.body;

    // Validate recommendation
    if (!recommendation || recommendation.trim() === "") {
      return res.status(400).json({ message: "Recommendation is required." });
    }

    // Validate prescription if required
    if (pres_tag === "Yes" && (!prescription || prescription.trim() === "")) {
      return res.status(400).json({
        message: "Prescription is required when 'Prescription Given' is Yes.",
      });
    }

    // Find appointment to get doctor_id
    const appointment = await Appointment.findById(appointment_id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Create recommendation
    const doctorRecommendation = new DoctorRecommendation({
      appointmentId: appointment_id,
      doctorId: appointment.doctorId,
      recommendation,
      followUpRequired: follow_up || 'No',
      prescriptionGiven: pres_tag === "Yes",
      prescription: prescription || null
    });

    await doctorRecommendation.save();

    // Update appointment status to "Completed" (changed from "Consulted" to match enum)
    appointment.status = 'Completed';
    await appointment.save();

    res.status(200).json({
      message: "Recommendation saved and status updated to Completed.",
    });
  } catch (error) {
    console.error("Give recommendation error:", error);
    return res.status(500).json({ message: "Failed to save recommendation." });
  }
});

app.get("/getConsultationDetails", async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res
        .status(400)
        .json({ message: "Missing required parameter: user_id" });
    }

    // Find patient profile
    const patientProfile = await PatientProfile.findOne({ userId: user_id });
    if (!patientProfile) {
      return res.status(200).json({ data: [] });
    }

    // Find appointments with status Emergency or Completed
    const appointments = await Appointment.find({
      patientId: patientProfile._id,
      status: { $in: ['Emergency', 'Completed'] }
    })
      .populate('doctorId', 'firstname lastname')
      .populate({
        path: 'appointmentId',
        model: 'DoctorRecommendation',
        select: 'recommendation followUpRequired'
      })
      .sort({ bookingDate: -1 })
      .lean();

    // Get recommendations for these appointments
    const appointmentIds = appointments.map(a => a._id);
    const recommendations = await DoctorRecommendation.find({
      appointmentId: { $in: appointmentIds }
    }).lean();

    // Map recommendations to appointments
    const recommendationMap = {};
    recommendations.forEach(rec => {
      if (rec.appointmentId) {
        recommendationMap[rec.appointmentId.toString()] = rec;
      }
    });

    // Format results
    const results = appointments.map(appointment => {
      const rec = recommendationMap[appointment._id.toString()];
      return {
        consultation_date: appointment.bookingDate,
        consultation_type: appointment.consultationType,
        recommendation: rec ? rec.recommendation : null,
        follow_up: rec ? rec.followUpRequired : null,
        doctor_fullname: appointment.doctorId ? `${appointment.doctorId.firstname} ${appointment.doctorId.lastname}` : '',
        consultation_status: appointment.status
      };
    });

    res.status(200).json({ data: results });
  } catch (error) {
    console.error("Error fetching consultation details:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve consultation details." });
  }
});

app.get("/getPatientInfo", async (req, res) => {
  try {
    const { patient_user_id } = req.query;

    if (!patient_user_id) {
      return res
        .status(400)
        .json({ message: "Missing required parameter: patient_user_id" });
    }

    // Find user in MongoDB
    const user = await User.findById(patient_user_id).lean();
    
    if (!user) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Find patient profile
    const patientProfile = await PatientProfile.findOne({ 
      userId: patient_user_id 
    }).lean();

    // Format result to match expected structure
    const result = {
      email: user.email,
      user_id: user._id.toString(),
      firstname: patientProfile ? patientProfile.firstname : user.firstname,
      middlename: patientProfile ? patientProfile.middlename : user.middlename,
      lastname: patientProfile ? patientProfile.lastname : user.lastname,
      gender: patientProfile ? patientProfile.gender : user.gender,
      birthdate: patientProfile ? patientProfile.birthdate : user.birthdate,
      age: patientProfile ? patientProfile.age : user.age,
      civil_status: patientProfile ? patientProfile.civilStatus : null,
      mobile_number: patientProfile ? patientProfile.mobileNumber : user.phone,
      email_address: patientProfile ? patientProfile.emailAddress : user.email,
      home_address: patientProfile ? patientProfile.homeAddress : null,
      emergency_name: patientProfile ? patientProfile.emergencyName : null,
      emergency_relationship: patientProfile ? patientProfile.emergencyRelationship : null,
      emergency_mobile_number: patientProfile ? patientProfile.emergencyMobileNumber : null,
      bloodtype: patientProfile ? patientProfile.bloodtype : null,
      allergies: patientProfile ? patientProfile.allergies : null,
      current_medication: patientProfile ? patientProfile.currentMedication : null,
      past_medical_condition: patientProfile ? patientProfile.pastMedicalCondition : null,
      chronic_illness: patientProfile ? patientProfile.chronicIllness : null
    };

    res.status(200).json({ data: [result] });
  } catch (error) {
    console.error("Error fetching patient details:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve patient details." });
  }
});

app.post("/updatePatientInfo", async (req, res) => {
  try {
    const {
      user_id,
      firstname,
      middlename,
      lastname,
      gender,
      birthdate,
      age,
      civil_status,
      mobile_number,
      home_address,
      emergency_name,
      emergency_relationship,
      emergency_mobile_number,
      bloodtype,
      allergies,
      current_medication,
      past_medical_condition,
      chronic_illness,
      email,
    } = req.body;

    if (!user_id) {
      return res
        .status(400)
        .json({ message: "Missing required parameter: user_id" });
    }

    // Update user email if provided
    if (email) {
      const user = await User.findById(user_id);
      if (user) {
        // Check if email is already taken by another user
        const existingUser = await User.findOne({ 
          email: email.toLowerCase(), 
          _id: { $ne: user_id } 
        });
        if (existingUser) {
          return res.status(409).json({ message: "Email already in use" });
        }
        user.email = email.toLowerCase();
        await user.save();
      }
    }

    // Update or create patient profile
    let patientProfile = await PatientProfile.findOne({ userId: user_id });
    
    if (patientProfile) {
      // Update existing profile
      patientProfile.firstname = firstname;
      patientProfile.middlename = middlename || null;
      patientProfile.lastname = lastname;
      patientProfile.gender = gender;
      patientProfile.birthdate = birthdate;
      patientProfile.age = age;
      patientProfile.civilStatus = civil_status;
      patientProfile.mobileNumber = mobile_number || null;
      patientProfile.emailAddress = email || null;
      patientProfile.homeAddress = home_address || null;
      patientProfile.emergencyName = emergency_name || null;
      patientProfile.emergencyRelationship = emergency_relationship || null;
      patientProfile.emergencyMobileNumber = emergency_mobile_number || null;
      patientProfile.bloodtype = bloodtype || null;
      patientProfile.allergies = allergies || null;
      patientProfile.currentMedication = current_medication || null;
      patientProfile.pastMedicalCondition = past_medical_condition || null;
      patientProfile.chronicIllness = chronic_illness || null;
      await patientProfile.save();
    } else {
      // Create new profile
      patientProfile = new PatientProfile({
        userId: user_id,
        firstname,
        middlename: middlename || null,
        lastname,
        gender,
        birthdate,
        age,
        civilStatus: civil_status,
        mobileNumber: mobile_number || null,
        emailAddress: email || null,
        homeAddress: home_address || null,
        emergencyName: emergency_name || null,
        emergencyRelationship: emergency_relationship || null,
        emergencyMobileNumber: emergency_mobile_number || null,
        bloodtype: bloodtype || null,
        allergies: allergies || null,
        currentMedication: current_medication || null,
        pastMedicalCondition: past_medical_condition || null,
        chronicIllness: chronic_illness || null
      });
      await patientProfile.save();
    }

    res
      .status(200)
      .json({ message: "Patient information updated successfully." });
  } catch (error) {
    console.error("Error updating patient info:", error);
    return res
      .status(500)
      .json({ message: "Failed to update patient info." });
  }
});

app.get("/getInventoryTotal", async (req, res) => {
  try {
    const items = await Inventory.find()
      .populate('category', 'category')
      .lean();

    const results = items.map(item => ({
      id: item._id.toString(),
      item: item.item,
      category: item.category ? item.category.category : '',
      quantity: item.quantity,
      average_quantity: item.averageQuantity,
      price: item.price,
      status: item.status,
      total: (item.quantity || 0) * (item.price || 0)
    }));

    res.json({ data: results });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ message: "Database error" });
  }
});

app.get("/getDoctorsInfo", async (req, res) => {
  try {
    const { doctor_user_id } = req.query;
    if (!doctor_user_id) {
      return res
        .status(400)
        .json({ message: "Missing required parameter: doctors_id" });
    }

    // Find user in MongoDB
    const user = await User.findById(doctor_user_id).lean();
    
    if (!user) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Format result to match expected structure
    const result = {
      email: user.email,
      id: user._id.toString(),
      firstname: user.firstname,
      middlename: user.middlename,
      lastname: user.lastname,
      gender: user.gender,
      birthdate: user.birthdate,
      age: user.age,
      role: user.role,
      status: user.status,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(200).json({ data: [result] });
  } catch (error) {
    console.error("Error fetching doctor details:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve doctor details." });
  }
});

app.get("/getPatientsToday", async (req, res) => {
  try {
    const today = new Date();
    const todayStr = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}-${today.getFullYear()}`;
    
    const appointments = await Appointment.find({
      bookingDate: todayStr,
      status: 'Booked'
    })
      .populate('patientId', 'firstname lastname')
      .sort({ queueNo: 1 })
      .lean();

    const results = appointments.map(appointment => ({
      patient_name: appointment.patientId ? `${appointment.patientId.firstname} ${appointment.patientId.lastname}` : '',
      consultation_type: appointment.consultationType,
      queue_no: appointment.queueNo,
      case_id: appointment._id.toString(),
      status: appointment.status,
      booking_time: appointment.bookingTime
    }));

    res.json(results);
  } catch (error) {
    console.error("Database error fetching patients for today:", error);
    return res.status(500).json({ message: "Database error" });
  }
});

app.get("/getBookings", async (req, res) => {
  try {
    const appointments = await Appointment.find({
      status: 'Booked'
    })
      .populate('patientId', 'firstname lastname')
      .sort({ queueNo: 1 })
      .lean();

    const results = appointments.map(appointment => ({
      patient_name: appointment.patientId ? `${appointment.patientId.firstname} ${appointment.patientId.lastname}` : '',
      consultation_type: appointment.consultationType,
      queue_no: appointment.queueNo,
      case_id: appointment._id.toString(),
      status: appointment.status,
      booking_time: appointment.bookingTime
    }));

    res.json(results);
  } catch (error) {
    console.error("Database error fetching bookings:", error);
    return res.status(500).json({ message: "Database error" });
  }
});

app.get("/getInventoryDashboard", async (req, res) => {
  try {
    const items = await Inventory.find()
      .populate('category', 'category')
      .lean();

    const results = items.map(item => ({
      id: item._id.toString(),
      item: item.item,
      category: item.category ? item.category.category : '',
      quantity: item.quantity,
      average_quantity: item.averageQuantity,
      price: item.price,
      status: item.status
    }));

    res.json(results);
  } catch (error) {
    console.error("Get inventory dashboard error:", error);
    return res.status(500).json({ message: "Database error" });
  }
});

app.get("/getAllPatients", async (req, res) => {
  try {
    const patients = await PatientProfile.find()
      .populate('userId', 'email')
      .lean();

    const results = patients.map(patient => {
      let userId = '';
      if (patient.userId) {
        if (typeof patient.userId === 'object' && patient.userId._id) {
          userId = patient.userId._id.toString();
        } else if (typeof patient.userId === 'string') {
          userId = patient.userId;
        } else {
          try {
            userId = String(patient.userId);
          } catch (e) {
            userId = '';
          }
        }
      }
      
      return {
        id: patient._id ? patient._id.toString() : '',
        fullname: `${patient.firstname || ''} ${patient.lastname || ''}`.trim(),
        gender: patient.gender || '',
        age: patient.age || '',
        mobile_number: patient.mobileNumber || '',
        email_address: patient.emailAddress || (patient.userId && patient.userId.email) || '',
        user_id: userId
      };
    });

    res.json(results);
  } catch (error) {
    console.error("Get all patients error:", error);
    return res.status(500).json({ message: "Database error" });
  }
});