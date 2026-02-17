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

// File system module for checking file existence
const fs = require("fs");

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
const InventoryHistory = require('./models/InventoryHistory'); // Inventory history for tracking stock changes
const InventoryTransaction = require('./models/InventoryTransaction'); // Inventory transaction audit logs
const EmailVerificationToken = require('./models/EmailVerificationToken'); // Email verification tokens
const AuditLog = require('./models/AuditLog'); // Audit logs for user activities
const DoctorSchedule = require('./models/DoctorSchedule'); // Doctor availability schedules
const LandingService = require('./models/LandingService'); // Landing page services (dynamic content)

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
// SECTION: CLEAN URL ROUTES (MUST BE BEFORE STATIC MIDDLEWARE)
// ============================================================================
// These routes serve pages directly at clean URLs without redirecting
// URL stays at /landingpage instead of changing to /landingpage/landingpage.html
// This provides cleaner, more user-friendly URLs
// IMPORTANT: These must be defined BEFORE express.static to take precedence

// Root route - serve landing page (keep URL clean at /)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "landingpage", "landingpage.html"));
});

// Define page directories that follow the folder/folder.html pattern
// NOTE: 'homepage' is NOT included because /homepage is an API endpoint that returns session data
const cleanUrlPages = [
  'landingpage',
  'login',
  'signup',
  'verify-email'
];

// App pages that require authentication - these all serve header_menu.html
// The header_menu.js will read the URL and load the correct iframe content
const appPages = [
  'dashboard',
  'appointment_booking',
  'appointment_list',
  'patient',
  'patient_profile',
  'patient_list',
  'doctor',
  'doctors_list',
  'doctors_profile',
  'doctor_schedule',
  'pos',
  'inventory',
  'user_access',
  'users_account',
  'header_menu',
  'analytics',
  'doctor_analytics',
  'audit_logs',
  'financial_report',
  'landing_services',
  'home'
];

// Serve pages directly at clean URLs (no redirect, URL stays clean)
cleanUrlPages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(__dirname, "public", page, `${page}.html`));
  });
});

// Serve header_menu.html for all app pages (SPA-style routing)
// The JavaScript will handle loading the correct content based on URL
appPages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "header_menu", "header_menu.html"));
  });
});

// ============================================================================
// SECTION 5: STATIC FILE SERVING
// ============================================================================
// Serve static files from the public directory (main HTML files, CSS, JS, assets)
// IMPORTANT: index: false prevents express.static from serving directories as index pages
// This ensures our clean URL routes above take precedence
app.use(express.static(path.join(__dirname, "public"), { index: false }));

// Serve static files from the web_immacare directory (legacy/additional files)
app.use(express.static(path.join(__dirname, "web_immacare"), { index: false }));

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

// ============================================================================
// SECTION: DYNAMIC LANDING PAGE SERVICE ROUTES (AFTER STATIC FILES)
// ============================================================================
// This route handles any service slug and serves the dynamic service_detail.html template
// IMPORTANT: This must be AFTER static file serving so CSS/JS files are served correctly
app.get('/landingpage/:slug', (req, res) => {
  const slug = req.params.slug;

  // Serve the dynamic service detail template
  const templatePath = path.join(__dirname, "public", "landingpage", "service_detail.html");
  if (fs.existsSync(templatePath)) {
    res.sendFile(templatePath);
  } else {
    res.status(404).send('Page not found');
  }
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

// Middleware to check if user is admin OR doctor
const requireDoctorOrAdmin = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
  if (req.session.role !== 'admin' && req.session.role !== 'doctor') {
    return res.status(403).json({ success: false, message: 'Doctor or Admin access required' });
  }
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
app.get('/analytics/health-risk-analysis', requireDoctorOrAdmin, async (req, res) => {
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
app.post('/analytics/ai/health-risk-insights', requireDoctorOrAdmin, async (req, res) => {
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
// SECTION: DOCTOR SCHEDULE API ENDPOINTS
// ============================================================================
/**
 * GET /doctor-schedules
 * Purpose: Get all schedules for a specific doctor
 */
app.get("/doctor-schedules", async (req, res) => {
  try {
    const { doctorId, scheduleDate } = req.query;

    if (!doctorId) {
      return res.status(400).json({ message: "Doctor ID is required" });
    }

    const query = { doctorId };
    if (scheduleDate) {
      query.scheduleDate = scheduleDate;
    }

    const schedules = await DoctorSchedule.find(query)
      .sort({ scheduleDate: 1 })
      .lean();

    res.json({ success: true, data: schedules });
  } catch (error) {
    console.error("Get doctor schedules error:", error);
    return res.status(500).json({ message: "Database error", error: error.message });
  }
});

/**
 * POST /doctor-schedule
 * Purpose: Create or update a doctor's schedule for a specific date
 */
app.post("/doctor-schedule", async (req, res) => {
  try {
    const { doctorId, scheduleDate, timeSlots, isAvailable, maxPatients, notes } = req.body;

    if (!doctorId || !scheduleDate) {
      return res.status(400).json({ message: "Doctor ID and schedule date are required" });
    }

    let schedule = await DoctorSchedule.findOne({ doctorId, scheduleDate });

    if (schedule) {
      schedule.timeSlots = timeSlots || schedule.timeSlots;
      schedule.isAvailable = isAvailable !== undefined ? isAvailable : schedule.isAvailable;
      schedule.maxPatients = maxPatients || schedule.maxPatients;
      schedule.notes = notes !== undefined ? notes : schedule.notes;
      await schedule.save();
    } else {
      schedule = new DoctorSchedule({
        doctorId,
        scheduleDate,
        timeSlots: timeSlots || [],
        isAvailable: isAvailable !== undefined ? isAvailable : true,
        maxPatients: maxPatients || 10,
        notes: notes || ''
      });
      await schedule.save();
    }

    res.json({ success: true, message: "Schedule saved successfully", data: schedule });
  } catch (error) {
    console.error("Save doctor schedule error:", error);
    return res.status(500).json({ message: "Database error", error: error.message });
  }
});

// ============================================================================
// SECTION: AUDIT LOGS API ENDPOINT
// ============================================================================

/**
 * GET /audit-logs
 * Purpose: Get audit logs with optional filters
 */
app.get("/audit-logs", async (req, res) => {
  try {
    const { action, startDate, endDate, limit = 100 } = req.query;

    let query = {};

    if (action && action !== 'all') {
      query.action = action;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    // Get the logs (with limit for display)
    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    // Get total counts for each action type (without limit, for accurate summary)
    // Build a base query for date filtering (without action filter)
    let countQuery = {};
    if (startDate || endDate) {
      countQuery.createdAt = {};
      if (startDate) {
        countQuery.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        countQuery.createdAt.$lte = end;
      }
    }

    // Count each action type
    const [loginCount, registerCount, bookingCount] = await Promise.all([
      AuditLog.countDocuments({ ...countQuery, action: 'login' }),
      AuditLog.countDocuments({ ...countQuery, action: 'register' }),
      AuditLog.countDocuments({ ...countQuery, action: 'booking_created' })
    ]);

    const results = logs.map(log => ({
      id: log._id.toString(),
      action: log.action,
      userName: log.userName,
      userRole: log.userRole,
      userEmail: log.userEmail,
      details: log.details,
      metadata: log.metadata,
      createdAt: log.createdAt
    }));

    res.json({
      success: true,
      data: results,
      totalCounts: {
        login: loginCount,
        register: registerCount,
        booking_created: bookingCount
      }
    });
  } catch (error) {
    console.error("Get audit logs error:", error);
    return res.status(500).json({ success: false, message: "Database error" });
  }
});

/**
 * GET /api/inventory-transactions
 * Purpose: Get inventory transactions with filters for audit
 * Access: Admin only
 */
app.get("/api/inventory-transactions", requireAdmin, async (req, res) => {
  try {
    const { transactionType, itemId, startDate, endDate, limit = 500, search } = req.query;

    let query = {};

    if (transactionType && transactionType !== 'all') {
      query.transactionType = transactionType;
    }

    if (itemId) {
      query.inventoryId = itemId;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    if (search) {
      query.$or = [
        { itemName: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
        { 'performedBy.userName': { $regex: search, $options: 'i' } }
      ];
    }

    const transactions = await InventoryTransaction.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error("Get inventory transactions error:", error);
    return res.status(500).json({ success: false, message: "Database error" });
  }
});

/**
 * GET /api/inventory-transactions/summary
 * Purpose: Get summary statistics for inventory transactions
 * Access: Admin only
 */
app.get("/api/inventory-transactions/summary", requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let matchQuery = {};
    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) {
        matchQuery.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchQuery.createdAt.$lte = end;
      }
    }

    const summary = await InventoryTransaction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$transactionType',
          count: { $sum: 1 },
          totalQuantity: { $sum: { $abs: '$quantityChange' } },
          totalValue: { $sum: { $abs: '$totalValue' } }
        }
      }
    ]);

    const topItems = await InventoryTransaction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$inventoryId',
          itemName: { $first: '$itemName' },
          transactionCount: { $sum: 1 },
          totalQuantityMoved: { $sum: { $abs: '$quantityChange' } }
        }
      },
      { $sort: { transactionCount: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: { byType: summary, topItems: topItems }
    });
  } catch (error) {
    console.error("Get inventory transactions summary error:", error);
    return res.status(500).json({ success: false, message: "Database error" });
  }
});

/**
 * GET /api/inventory-transactions/item/:itemId
 * Purpose: Get transaction history for a specific inventory item
 * Access: Admin only
 */
app.get("/api/inventory-transactions/item/:itemId", requireAdmin, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { limit = 100 } = req.query;

    const transactions = await InventoryTransaction.find({ inventoryId: itemId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error("Get item transactions error:", error);
    return res.status(500).json({ success: false, message: "Database error" });
  }
});

/**
 * POST /api/inventory-transactions
 * Purpose: Manually create an inventory transaction (for adjustments, restocks, etc.)
 * Access: Admin only
 */
app.post("/api/inventory-transactions", requireAdmin, async (req, res) => {
  try {
    const {
      inventoryId,
      transactionType,
      quantityChange,
      notes,
      unitPrice
    } = req.body;

    if (!inventoryId || !transactionType || quantityChange === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: inventoryId, transactionType, quantityChange'
      });
    }

    // Get the inventory item
    const item = await Inventory.findById(inventoryId).populate('category', 'category');
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    const quantityBefore = item.actual_stock || 0;
    const quantityAfter = quantityBefore + quantityChange;

    // Update the inventory item
    item.actual_stock = Math.max(0, quantityAfter);
    item.quantity = item.actual_stock;

    // Update status
    if (item.actual_stock <= 0) {
      item.status = 'Out of Stock';
    } else if (item.abl > 0 && item.actual_stock < item.abl) {
      item.status = 'For Reorder';
    } else {
      item.status = 'In Stock';
    }

    await item.save();

    // Create the transaction record
    const transaction = await InventoryTransaction.create({
      inventoryId: item._id,
      itemName: item.item,
      categoryName: item.category?.category || '',
      unit: item.unit || '',
      transactionType,
      quantityBefore,
      quantityChange,
      quantityAfter: item.actual_stock,
      unitPrice: unitPrice || item.price || 0,
      totalValue: Math.abs(quantityChange) * (unitPrice || item.price || 0),
      referenceType: 'manual',
      performedBy: {
        userId: req.session.userId,
        userName: `${req.session.firstname} ${req.session.lastname}`,
        userRole: req.session.role,
        userEmail: req.session.email
      },
      notes: notes || '',
      ipAddress: req.ip
    });

    res.json({
      success: true,
      data: transaction,
      message: 'Transaction recorded successfully'
    });
  } catch (error) {
    console.error("Create inventory transaction error:", error);
    return res.status(500).json({ success: false, message: "Failed to create transaction" });
  }
});

// ============================================================================
// SECTION: LANDING SERVICES API ENDPOINTS
// ============================================================================
// These endpoints manage the dynamic content for the landing page services

/**
 * GET /api/landing-services
 * Purpose: Get all active landing services for the public landing page
 * Access: Public (no authentication required)
 */
app.get('/api/landing-services', async (req, res) => {
  try {
    const services = await LandingService.find({ isActive: true })
      .sort({ displayOrder: 1 })
      .lean();
    res.json({ success: true, data: services });
  } catch (error) {
    console.error('Error fetching landing services:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch services' });
  }
});

/**
 * GET /api/landing-services/:slug
 * Purpose: Get a single landing service by slug for the detail page
 * Access: Public (no authentication required)
 */
app.get('/api/landing-services/:slug', async (req, res) => {
  try {
    const service = await LandingService.findOne({
      slug: req.params.slug,
      isActive: true
    }).lean();

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json({ success: true, data: service });
  } catch (error) {
    console.error('Error fetching landing service:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch service' });
  }
});

/**
 * GET /api/admin/landing-services
 * Purpose: Get all landing services for admin management (including inactive)
 * Access: Admin only
 */
app.get('/api/admin/landing-services', requireAdmin, async (req, res) => {
  try {
    const services = await LandingService.find()
      .sort({ displayOrder: 1 })
      .lean();
    res.json({ success: true, data: services });
  } catch (error) {
    console.error('Error fetching landing services for admin:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch services' });
  }
});

/**
 * GET /api/admin/landing-services/:id
 * Purpose: Get a single landing service by ID for editing
 * Access: Admin only
 */
app.get('/api/admin/landing-services/:id', requireAdmin, async (req, res) => {
  try {
    const service = await LandingService.findById(req.params.id).lean();

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json({ success: true, data: service });
  } catch (error) {
    console.error('Error fetching landing service:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch service' });
  }
});

/**
 * POST /api/admin/landing-services
 * Purpose: Create a new landing service
 * Access: Admin only
 */
app.post('/api/admin/landing-services', requireAdmin, async (req, res) => {
  try {
    const { title, slug, cardImage, bannerImage, description, sections, displayOrder, isActive } = req.body;

    if (!title || !slug || !cardImage || !bannerImage || !description) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const existingService = await LandingService.findOne({ slug: slug.toLowerCase() });
    if (existingService) {
      return res.status(400).json({ success: false, message: 'A service with this slug already exists' });
    }

    const newService = new LandingService({
      title,
      slug: slug.toLowerCase(),
      cardImage,
      bannerImage,
      description,
      sections: sections || [],
      displayOrder: displayOrder || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    await newService.save();

    await AuditLog.create({
      userId: req.session.userId,
      userName: `${req.session.firstname} ${req.session.lastname}`,
      userRole: req.session.role,
      userEmail: req.session.email,
      action: 'create',
      details: `Created landing service: ${title}`,
      ipAddress: req.ip
    });

    res.json({ success: true, data: newService, message: 'Service created successfully' });
  } catch (error) {
    console.error('Error creating landing service:', error);
    res.status(500).json({ success: false, message: 'Failed to create service' });
  }
});

/**
 * PUT /api/admin/landing-services/:id
 * Purpose: Update an existing landing service
 * Access: Admin only
 */
app.put('/api/admin/landing-services/:id', requireAdmin, async (req, res) => {
  try {
    const { title, slug, cardImage, bannerImage, description, sections, displayOrder, isActive } = req.body;

    const service = await LandingService.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (slug && slug.toLowerCase() !== service.slug) {
      const existingService = await LandingService.findOne({
        slug: slug.toLowerCase(),
        _id: { $ne: req.params.id }
      });
      if (existingService) {
        return res.status(400).json({ success: false, message: 'A service with this slug already exists' });
      }
    }

    if (title) service.title = title;
    if (slug) service.slug = slug.toLowerCase();
    if (cardImage) service.cardImage = cardImage;
    if (bannerImage) service.bannerImage = bannerImage;
    if (description) service.description = description;
    if (sections) {
      // Clean sections - remove invalid _id fields (like "new_14") from new sections
      const cleanedSections = sections.map(section => {
        const cleanSection = { ...section };
        // If _id starts with "new_" or is not a valid ObjectId, remove it
        if (cleanSection._id && (typeof cleanSection._id === 'string' && (cleanSection._id.startsWith('new_') || cleanSection._id.length !== 24))) {
          delete cleanSection._id;
        }
        return cleanSection;
      });
      service.sections = cleanedSections;
    }
    if (displayOrder !== undefined) service.displayOrder = displayOrder;
    if (isActive !== undefined) service.isActive = isActive;

    await service.save();

    await AuditLog.create({
      userId: req.session.userId,
      userName: `${req.session.firstname} ${req.session.lastname}`,
      userRole: req.session.role,
      userEmail: req.session.email,
      action: 'update',
      details: `Updated landing service: ${service.title}`,
      ipAddress: req.ip
    });

    res.json({ success: true, data: service, message: 'Service updated successfully' });
  } catch (error) {
    console.error('Error updating landing service:', error);
    res.status(500).json({ success: false, message: 'Failed to update service' });
  }
});

/**
 * DELETE /api/admin/landing-services/:id
 * Purpose: Delete a landing service
 * Access: Admin only
 */
app.delete('/api/admin/landing-services/:id', requireAdmin, async (req, res) => {
  try {
    const service = await LandingService.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const serviceTitle = service.title;
    await LandingService.findByIdAndDelete(req.params.id);

    await AuditLog.create({
      userId: req.session.userId,
      userName: `${req.session.firstname} ${req.session.lastname}`,
      userRole: req.session.role,
      userEmail: req.session.email,
      action: 'delete',
      details: `Deleted landing service: ${serviceTitle}`,
      ipAddress: req.ip
    });

    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting landing service:', error);
    res.status(500).json({ success: false, message: 'Failed to delete service' });
  }
});

/**
 * PUT /api/admin/landing-services/:id/toggle-status
 * Purpose: Toggle the active status of a landing service
 * Access: Admin only
 */
app.put('/api/admin/landing-services/:id/toggle-status', requireAdmin, async (req, res) => {
  try {
    const service = await LandingService.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    service.isActive = !service.isActive;
    await service.save();

    await AuditLog.create({
      userId: req.session.userId,
      userName: `${req.session.firstname} ${req.session.lastname}`,
      userRole: req.session.role,
      userEmail: req.session.email,
      action: 'update',
      details: `${service.isActive ? 'Activated' : 'Deactivated'} landing service: ${service.title}`,
      ipAddress: req.ip
    });

    res.json({ success: true, data: service, message: `Service ${service.isActive ? 'activated' : 'deactivated'} successfully` });
  } catch (error) {
    console.error('Error toggling landing service status:', error);
    res.status(500).json({ success: false, message: 'Failed to toggle service status' });
  }
});

// ============================================================================
// SECTION 6: SERVER CONFIGURATION AND STARTUP
// ============================================================================
// Server port configuration - use environment variable for production (Render uses PORT)
const PORT = process.env.PORT || 3000;

// Default URL to open when server starts - use clean URL without .html extension
const TARGET_URL = `http://localhost:${PORT}/landingpage`;

// Start the Express server and optionally open browser
// Listen on 0.0.0.0 to allow access from mobile devices on the same network
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Server is accessible from network at http://<your-ip>:${PORT}`);
  console.log(`Opening browser at: ${TARGET_URL}`);

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
// SECTION 7: ADDITIONAL MIDDLEWARE
// ============================================================================
// Parse JSON request bodies (may be needed for routes defined after this point)
app.use(bodyParser.json());

// CORS is already configured in Section 4 with credentials support
// Do not add another cors() middleware here as it overrides the credentials setting
// NOTE: Static file serving is handled earlier in Section 5 - do not duplicate here

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

    // Log successful login to audit log
    try {
      console.log("[AUDIT] Logging login for user:", user.email);
      const auditEntry = await AuditLog.create({
        action: 'login',
        userId: user._id,
        userName: `${user.firstname} ${user.lastname}`,
        userRole: user.role,
        userEmail: user.email,
        details: `User logged in successfully`,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
      });
      console.log("[AUDIT] Login logged successfully, ID:", auditEntry._id);
    } catch (auditError) {
      console.error("[AUDIT] Audit log error:", auditError);
    }

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

    // Log registration to audit log
    try {
      await AuditLog.create({
        action: 'register',
        userId: user._id,
        userName: `${firstname} ${lastname}`,
        userEmail: email.toLowerCase(),
        userRole: 'patient',
        details: `New patient registration: ${firstname} ${lastname}`
      });
      console.log("[AUDIT] Logged registration for user:", email);
    } catch (auditError) {
      console.error("[AUDIT] Failed to log registration:", auditError);
    }

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

    // Get appointments for this patient, sorted by creation date (most recently booked first)
    const appointments = await Appointment.find({ patientId: patientProfile._id })
      .populate('doctorId', 'firstname middlename lastname')
      .sort({ createdAt: -1 })
      .lean();

    // Helper to get specialization name (handles both numeric IDs and already-stored names)
    const specialtiesMap = {
      1: 'Prenatal', 2: 'Post Natal', 3: 'Family Planning', 4: 'Vaccination (Pedia and Adult)',
      5: 'Ultrasound', 6: 'Laboratory Services', 7: 'ECG', 8: 'Non-stress test for pregnant',
      9: 'Hearing screening test', 10: '2D Echo', 11: 'Minor Surgery', 12: 'Obgyne',
      13: 'Pediatrician', 14: 'Surgeon', 15: 'Internal Medicine', 16: 'Urologist',
      17: 'ENT', 18: 'Opthalmologist', 19: 'Ear Piercing', 20: 'Papsmear'
    };
    const allSpecNames = Object.values(specialtiesMap);
    const resolveSpecName = (val) => {
      if (allSpecNames.includes(val)) return val;
      return specialtiesMap[parseInt(val)] || val || 'Unknown';
    };
    const resolveSpecId = (val) => {
      const parsed = parseInt(val);
      if (!isNaN(parsed) && specialtiesMap[parsed]) return String(parsed);
      const entry = Object.entries(specialtiesMap).find(([, name]) => name === val);
      return entry ? entry[0] : val;
    };

    // Format for mobile app
    const formattedAppointments = appointments.map(apt => {
      const specialtyName = resolveSpecName(apt.consultationType);
      const specialtyId = resolveSpecId(apt.consultationType);

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

    // Convert specialization ID to name to match web booking form format
    const consultationTypeName = getSpecialtyName(parseInt(specialization)) !== 'Unknown Specialty'
      ? getSpecialtyName(parseInt(specialization))
      : specialization;

    // Create appointment
    const appointment = new Appointment({
      patientId: patientProfile._id,
      doctorId: doctor,
      consultationType: consultationTypeName,
      bookingDate: formattedDate,
      bookingTime: time,
      status: 'Booked',
      reason: reason || null
    });

    await appointment.save();

    // Log booking to audit log
    try {
      const user = await User.findById(userId);
      await AuditLog.create({
        action: 'booking_created',
        userId: userId,
        userName: `${firstName} ${lastName}`,
        userEmail: user ? user.email : null,
        userRole: 'patient',
        details: `Mobile appointment booked for ${formattedDate} at ${time} - ${specialization}`
      });
      console.log("[AUDIT] Logged mobile booking for patient:", firstName, lastName);
    } catch (auditError) {
      console.error("[AUDIT] Failed to log mobile booking:", auditError);
    }

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
    // Save cancellation reason if provided
    if (req.body && req.body.reason) {
      appointment.reason = req.body.reason;
    }
    await appointment.save();

    res.json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error("Cancel appointment error:", error);
    return res.status(500).json({ message: "Database error" });
  }
});

// PUT /user/appointments/:id/reschedule - Reschedule appointment (mobile)
app.put("/user/appointments/:id/reschedule", verifyMobileToken, async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const userId = req.userId;
    const { newDate, newTime } = req.body;

    if (!newDate || !newTime) {
      return res.status(400).json({ message: "New date and time are required" });
    }

    const patientProfile = await PatientProfile.findOne({ userId: userId });
    if (!patientProfile) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.patientId.toString() !== patientProfile._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Convert date format if needed (YYYY-MM-DD -> MM-DD-YYYY)
    let formattedDate = newDate;
    if (newDate.includes('-') && newDate.split('-')[0].length === 4) {
      const [year, month, day] = newDate.split('-');
      formattedDate = `${month}-${day}-${year}`;
    }

    appointment.bookingDate = formattedDate;
    appointment.bookingTime = newTime;
    await appointment.save();

    res.json({ message: "Appointment rescheduled successfully" });
  } catch (error) {
    console.error("Reschedule appointment error:", error);
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

    // Build MongoDB query - exclude admin and patient roles
    const query = { role: { $nin: ['admin', 'patient'] } };

    if (role && role !== 'patient') {
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

/**
 * GET /patients
 * Purpose: Get all patients for the Patient List page
 */
app.get("/patients", async (req, res) => {
  try {
    const { fullname } = req.query;

    // Build MongoDB query - only patients
    const query = { role: 'patient' };

    if (fullname) {
      query.$or = [
        { firstname: { $regex: fullname, $options: 'i' } },
        { lastname: { $regex: fullname, $options: 'i' } }
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
    console.error("Get patients error:", error);
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
      mobile_number: user.mobileNumber || user.mobile_number || null,
      age: user.age || null,
      home_address: user.homeAddress || user.home_address || null,
      updated_date: user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : null
    };

    res.json({ data: [result] });
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({ message: "Database error" });
  }
});

/**
 * POST /togglePatientStatus
 * Purpose: Enable or disable a patient account
 */
app.post("/togglePatientStatus", async (req, res) => {
  try {
    const { user_id, status } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = status;
    user.updatedAt = new Date();
    await user.save();

    res.json({ message: `Account ${status ? 'enabled' : 'disabled'} successfully` });
  } catch (error) {
    console.error("Toggle patient status error:", error);
    return res.status(500).json({ message: "Failed to update account status" });
  }
});

/**
 * GET /getPatientAppointmentHistory/:userId
 * Purpose: Get appointment history for a specific patient
 */
app.get("/getPatientAppointmentHistory/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // First find the PatientProfile by userId
    const patientProfile = await PatientProfile.findOne({ userId: userId }).lean();
    if (!patientProfile) {
      return res.json({ data: [] });
    }

    const appointments = await Appointment.find({ patientId: patientProfile._id })
      .populate('doctorId', 'firstname lastname')
      .sort({ bookingDate: -1 })
      .lean();

    const results = appointments.map(apt => ({
      booking_date: apt.bookingDate || 'N/A',
      booking_time: apt.bookingTime || 'N/A',
      consultation_type: apt.consultationType || 'N/A',
      doctor_name: apt.doctorId ? `Dr. ${apt.doctorId.firstname} ${apt.doctorId.lastname}` : 'Not Assigned',
      status: apt.status || 'N/A'
    }));

    res.json({ data: results });
  } catch (error) {
    console.error("Get patient appointment history error:", error);
    return res.status(500).json({ message: "Database error" });
  }
});

/**
 * GET /getPatientRecommendations/:userId
 * Purpose: Get recommendations for a specific patient
 */
app.get("/getPatientRecommendations/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // First find the PatientProfile by userId
    const patientProfile = await PatientProfile.findOne({ userId: userId }).lean();
    if (!patientProfile) {
      return res.json({ data: [] });
    }

    // Get appointments with recommendations
    const appointments = await Appointment.find({
      patientId: patientProfile._id,
      recommendation: { $exists: true, $ne: '' }
    })
      .populate('doctorId', 'firstname lastname')
      .sort({ bookingDate: -1 })
      .lean();

    const results = appointments.map(apt => ({
      date: apt.bookingDate || 'N/A',
      doctor_name: apt.doctorId ? `Dr. ${apt.doctorId.firstname} ${apt.doctorId.lastname}` : 'N/A',
      recommendation: apt.recommendation || 'N/A',
      prescription: apt.prescription || 'N/A',
      follow_up: apt.followUp || 'N/A'
    }));

    res.json({ data: results });
  } catch (error) {
    console.error("Get patient recommendations error:", error);
    return res.status(500).json({ message: "Database error" });
  }
});

/**
 * GET /getPatientConsultationHistory/:userId
 * Purpose: Get consultation history for a specific patient (completed appointments)
 */
app.get("/getPatientConsultationHistory/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const patientProfile = await PatientProfile.findOne({ userId: userId }).lean();
    if (!patientProfile) {
      return res.json({ data: [] });
    }

    const appointments = await Appointment.find({
      patientId: patientProfile._id,
      status: 'Completed'
    })
      .populate('doctorId', 'firstname lastname')
      .sort({ bookingDate: -1 })
      .lean();

    const results = appointments.map(apt => ({
      date: apt.bookingDate || 'N/A',
      consultation_type: apt.consultationType || 'N/A',
      doctor_name: apt.doctorId ? `Dr. ${apt.doctorId.firstname} ${apt.doctorId.lastname}` : 'N/A',
      follow_up: apt.followUp || 'N/A',
      status: apt.status || 'Completed'
    }));

    res.json({ data: results });
  } catch (error) {
    console.error("Get patient consultation history error:", error);
    return res.status(500).json({ message: "Database error" });
  }
});

/**
 * GET /getPatientPrescriptions/:userId
 * Purpose: Get prescriptions for a specific patient
 */
app.get("/getPatientPrescriptions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const patientProfile = await PatientProfile.findOne({ userId: userId }).lean();
    if (!patientProfile) {
      return res.json({ data: [] });
    }

    const appointments = await Appointment.find({
      patientId: patientProfile._id,
      prescription: { $exists: true, $ne: '' }
    })
      .populate('doctorId', 'firstname lastname')
      .sort({ bookingDate: -1 })
      .lean();

    const results = [];

    appointments.forEach(apt => {
      // Parse prescription if it's a JSON string (array of medicines)
      let prescriptions = [];
      try {
        if (apt.prescription) {
          const parsed = JSON.parse(apt.prescription);
          if (Array.isArray(parsed)) {
            prescriptions = parsed;
          } else {
            prescriptions = [{ medicine_name: apt.prescription, dosage: '', frequency: '' }];
          }
        }
      } catch (e) {
        prescriptions = [{ medicine_name: apt.prescription, dosage: '', frequency: '' }];
      }

      const doctorName = apt.doctorId ? `Dr. ${apt.doctorId.firstname} ${apt.doctorId.lastname}` : 'N/A';
      const date = apt.bookingDate || 'N/A';

      prescriptions.forEach(pres => {
        results.push({
          date: date,
          doctor_name: doctorName,
          medicine_name: pres.medicine_name || pres.medicineName || 'N/A',
          dosage: pres.dosage || 'N/A',
          frequency: pres.frequency || 'N/A'
        });
      });
    });

    res.json({ data: results });
  } catch (error) {
    console.error("Get patient prescriptions error:", error);
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

    // Log booking to audit log
    try {
      await AuditLog.create({
        action: 'booking_created',
        userId: user_id,
        userName: `${firstname} ${lastname}`,
        userEmail: email_address || null,
        userRole: 'patient',
        details: `Appointment booked for ${booking_date} at ${booking_time} - ${consultation_type}`
      });
      console.log("[AUDIT] Logged booking for patient:", firstname, lastname);
    } catch (auditError) {
      console.error("[AUDIT] Failed to log booking:", auditError);
    }

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
      age: appointment.patientId ? appointment.patientId.age : '',
      reason: appointment.reason || ''
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
    const {
      addItem,
      addCategory,
      addUnit,
      addBeginningBalance,
      addAdjustments,
      addActualStock,
      addQtyUsed,
      addQtyWasted,
      addMonthsUsage,
      addABL,
      addPrice
    } = req.body;

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

    // Map numeric values to category names (updated for new categories)
    const categoryMap = {
      '1': 'Medicines / Pharmaceuticals',
      '2': 'Personal Protective Equipment (PPE)',
      '3': 'Medical Instruments / Tools',
      '4': 'Consumables / Disposables',
      '5': 'Contraceptives'
    };

    if (mongoose.Types.ObjectId.isValid(addCategory)) {
      const categoryExists = await InventoryCategory.findById(addCategory);
      if (!categoryExists) {
        return res.status(400).json({ message: "Invalid category" });
      }
      categoryObjectId = addCategory;
    } else {
      const categoryName = categoryMap[addCategory.toString()];
      if (categoryName) {
        let categoryDoc = await InventoryCategory.findOne({ category: categoryName });
        if (!categoryDoc) {
          // Create the category if it doesn't exist
          categoryDoc = new InventoryCategory({ category: categoryName });
          await categoryDoc.save();
        }
        categoryObjectId = categoryDoc._id;
      } else {
        const categoryDoc = await InventoryCategory.findOne({ category: addCategory });
        if (categoryDoc) {
          categoryObjectId = categoryDoc._id;
        } else {
          return res.status(400).json({ message: "Invalid category" });
        }
      }
    }

    // Step 3: Calculate status based on ABL and ending balance
    const actualStock = parseInt(addActualStock) || 0;
    const qtyUsed = parseInt(addQtyUsed) || 0;
    const qtyWasted = parseInt(addQtyWasted) || 0;
    const abl = parseInt(addABL) || 0;
    const endingBalance = actualStock - qtyUsed - qtyWasted;

    let status = 'In Stock';
    if (endingBalance <= 0) {
      status = 'Out of Stock';
    } else if (abl > 0 && endingBalance < abl) {
      status = 'For Reorder';
    }

    // Step 4: Create new item with all new fields
    const newItem = new Inventory({
      item: addItem,
      category: categoryObjectId,
      unit: addUnit || null,
      beginning_balance: parseInt(addBeginningBalance) || 0,
      adjustments: parseInt(addAdjustments) || 0,
      actual_stock: actualStock,
      qty_used: qtyUsed,
      qty_wasted: qtyWasted,
      months_usage: parseInt(addMonthsUsage) || 0,
      abl: abl,
      price: addPrice ? parseFloat(addPrice) : null,
      status: status,
      // Legacy fields
      quantity: actualStock,
      averageQuantity: abl || null
    });

    await newItem.save();

    res.json({ message: "Inventory item added successfully" });
  } catch (error) {
    console.error("Save inventory error:", error);
    return res.status(500).json({ message: "Error saving inventory item", error: error.message });
  }
});

// GET INVENTORY CATEGORIES
app.get("/getInventoryCategories", async (req, res) => {
  try {
    const categories = await InventoryCategory.find({}).lean();
    const results = categories.map(cat => ({
      id: cat._id.toString(),
      category: cat.category
    }));
    res.json({ success: true, data: results });
  } catch (error) {
    console.error("Get inventory categories error:", error);
    return res.status(500).json({ success: false, message: "Database error" });
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

    // Format results to match expected structure with new fields
    const results = items.map(inv => ({
      id: inv._id.toString(),
      item: inv.item,
      category: inv.category ? inv.category.category : '',
      category_id: inv.category ? inv.category._id.toString() : '',
      unit: inv.unit || '',
      beginning_balance: inv.beginning_balance || 0,
      adjustments: inv.adjustments || 0,
      actual_stock: inv.actual_stock || inv.quantity || 0,
      qty_used: inv.qty_used || 0,
      qty_wasted: inv.qty_wasted || 0,
      months_usage: inv.months_usage || 0,
      abl: inv.abl || inv.averageQuantity || 0,
      price: inv.price || 0,
      status: inv.status || 'In Stock'
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
      unit: item.unit || '',
      beginning_balance: item.beginning_balance || 0,
      adjustments: item.adjustments || 0,
      actual_stock: item.actual_stock || item.quantity || 0,
      qty_used: item.qty_used || 0,
      qty_wasted: item.qty_wasted || 0,
      months_usage: item.months_usage || 0,
      abl: item.abl || item.averageQuantity || 0,
      price: item.price || 0,
      status: item.status || 'In Stock'
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
      updateUnit,
      updateBeginningBalance,
      updateAdjustments,
      updateActualStock,
      updateQtyUsed,
      updateQtyWasted,
      updateMonthsUsage,
      updateABL,
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

    // Updated category map for new categories
    const categoryMap = {
      '1': 'Medicines / Pharmaceuticals',
      '2': 'Personal Protective Equipment (PPE)',
      '3': 'Medical Instruments / Tools',
      '4': 'Consumables / Disposables',
      '5': 'Contraceptives'
    };

    if (mongoose.Types.ObjectId.isValid(updateCategory)) {
      const categoryExists = await InventoryCategory.findById(updateCategory);
      if (!categoryExists) {
        return res.status(400).json({ message: "Invalid category" });
      }
      categoryObjectId = updateCategory;
    } else {
      const categoryName = categoryMap[updateCategory?.toString()];
      if (categoryName) {
        let categoryDoc = await InventoryCategory.findOne({ category: categoryName });
        if (!categoryDoc) {
          // Create the category if it doesn't exist
          categoryDoc = new InventoryCategory({ category: categoryName });
          await categoryDoc.save();
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

    // Calculate status based on ABL and ending balance
    const actualStock = parseInt(updateActualStock) || 0;
    const qtyUsed = parseInt(updateQtyUsed) || 0;
    const qtyWasted = parseInt(updateQtyWasted) || 0;
    const abl = parseInt(updateABL) || 0;
    const endingBalance = actualStock - qtyUsed - qtyWasted;

    let status = 'In Stock';
    if (endingBalance <= 0) {
      status = 'Out of Stock';
    } else if (abl > 0 && endingBalance < abl) {
      status = 'For Reorder';
    }

    // Store previous values for transaction logging
    const previousStock = item.actual_stock || 0;
    const previousAdjustments = item.adjustments || 0;

    // Update item with all new fields
    item.item = updateItemName;
    item.category = categoryObjectId;
    item.unit = updateUnit || null;
    item.beginning_balance = parseInt(updateBeginningBalance) || 0;
    item.adjustments = parseInt(updateAdjustments) || 0;
    item.actual_stock = actualStock;
    item.qty_used = qtyUsed;
    item.qty_wasted = qtyWasted;
    item.months_usage = parseInt(updateMonthsUsage) || 0;
    item.abl = abl;
    item.price = updatePrice ? parseFloat(updatePrice) : null;
    item.status = status;
    // Legacy fields
    item.quantity = actualStock;
    item.averageQuantity = abl || null;

    await item.save();

    // ALWAYS Log inventory transaction for ANY update
    const stockChange = actualStock - previousStock;
    const adjustmentChange = (parseInt(updateAdjustments) || 0) - previousAdjustments;

    console.log(`[INVENTORY] ========= UPDATE INVENTORY ENDPOINT HIT =========`);
    console.log(`[INVENTORY] Item: ${updateItemName}, Previous Stock: ${previousStock}, New Stock: ${actualStock}, Change: ${stockChange}`);

    // Always log the transaction, regardless of what changed
    {
      try {
        const category = await InventoryCategory.findById(categoryObjectId);
        const categoryName = category ? category.category : '';

        // Determine transaction type based on changes
        let transactionType = 'adjustment';
        let notes = '';

        if (stockChange > 0) {
          transactionType = 'restock';
          notes = `Inventory restock: +${stockChange} units`;
        } else if (stockChange < 0) {
          transactionType = 'adjustment';
          notes = `Inventory adjustment: ${stockChange} units`;
        } else if (adjustmentChange !== 0) {
          transactionType = 'adjustment';
          notes = `Adjustment field changed by ${adjustmentChange}`;
        }

        await InventoryTransaction.create({
          inventoryId: item._id,
          itemName: updateItemName,
          categoryName: categoryName,
          unit: updateUnit || '',
          transactionType: transactionType,
          quantityBefore: previousStock,
          quantityChange: stockChange,
          quantityAfter: actualStock,
          unitPrice: updatePrice ? parseFloat(updatePrice) : 0,
          totalValue: Math.abs(stockChange) * (updatePrice ? parseFloat(updatePrice) : 0),
          referenceType: 'manual',
          performedBy: {
            userId: req.session?.userId,
            userName: req.session?.firstname && req.session?.lastname
              ? `${req.session.firstname} ${req.session.lastname}`
              : 'Staff',
            userRole: req.session?.role || 'staff',
            userEmail: req.session?.email || ''
          },
          notes: notes,
          ipAddress: req.ip
        });
        console.log(`[INVENTORY] Transaction logged: ${transactionType} for ${updateItemName}`);
      } catch (txError) {
        console.error("[INVENTORY] Failed to log transaction:", txError);
      }
    }

    res.json({ message: "Inventory updated successfully" });
  } catch (error) {
    console.error("Update inventory error:", error);
    return res.status(500).json({ message: "Inventory update failed", error: error.message });
  }
});

// POS - Update inventory stock after sale
app.post("/pos/updateStock", async (req, res) => {
  try {
    const { itemId, quantitySold } = req.body;

    if (!itemId || !quantitySold) {
      return res.status(400).json({ message: "Item ID and quantity sold are required" });
    }

    const item = await Inventory.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Update actual_stock by subtracting the quantity sold
    const currentStock = item.actual_stock || 0;
    const newStock = Math.max(0, currentStock - quantitySold);
    item.actual_stock = newStock;

    // Update qty_used to track total sold
    item.qty_used = (item.qty_used || 0) + quantitySold;

    // Update legacy quantity field
    item.quantity = newStock;

    // Recalculate status based on new stock level
    const qtyWasted = item.qty_wasted || 0;
    const abl = item.abl || 0;
    const endingBalance = newStock - qtyWasted;

    if (endingBalance <= 0) {
      item.status = 'Out of Stock';
    } else if (abl > 0 && endingBalance < abl) {
      item.status = 'For Reorder';
    } else {
      item.status = 'In Stock';
    }

    await item.save();

    // Create history entry for this stock change
    try {
      const category = await InventoryCategory.findById(item.category);
      const categoryName = category ? category.category : '';

      // Create legacy InventoryHistory entry
      await InventoryHistory.create({
        inventoryId: item._id,
        item: item.item,
        category: categoryName,
        unit: item.unit,
        beginning_balance: item.beginning_balance,
        adjustments: item.adjustments,
        actual_stock: newStock,
        qty_used: item.qty_used,
        qty_wasted: item.qty_wasted,
        months_usage: item.months_usage,
        abl: item.abl,
        price: item.price,
        status: item.status,
        changeType: 'pos_sale',
        quantityChanged: -quantitySold,
        snapshotDate: new Date()
      });

      // Create detailed InventoryTransaction for audit trail
      await InventoryTransaction.create({
        inventoryId: item._id,
        itemName: item.item,
        categoryName: categoryName,
        unit: item.unit || '',
        transactionType: 'sale',
        quantityBefore: currentStock,
        quantityChange: -quantitySold,
        quantityAfter: newStock,
        unitPrice: item.price || 0,
        totalValue: quantitySold * (item.price || 0),
        referenceType: 'pos_transaction',
        performedBy: {
          userId: req.session?.userId,
          userName: req.session?.firstname && req.session?.lastname
            ? `${req.session.firstname} ${req.session.lastname}`
            : 'POS User',
          userRole: req.session?.role || 'staff',
          userEmail: req.session?.email || ''
        },
        notes: `POS Sale: ${quantitySold} units`,
        ipAddress: req.ip
      });
    } catch (historyError) {
      console.error("[POS] Failed to create history/transaction entry:", historyError);
    }

    console.log(`[POS] Stock updated for item ${item.item}: ${currentStock} -> ${newStock} (sold: ${quantitySold})`);

    res.json({
      message: "Stock updated successfully",
      newStock: newStock,
      status: item.status
    });
  } catch (error) {
    console.error("POS update stock error:", error);
    return res.status(500).json({ message: "Stock update failed", error: error.message });
  }
});

// Get inventory history by date range for reporting
app.get("/getInventoryHistory", async (req, res) => {
  try {
    const { startDate, endDate, month, year } = req.query;

    let targetDate = null;

    if (startDate && endDate) {
      // Use the end date as the target - get latest snapshot on or before this date
      targetDate = new Date(endDate + 'T23:59:59.999');
    } else if (month) {
      // Use provided year or current year, but check if month is in the future
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const monthNum = parseInt(month);
      let targetYear = year ? parseInt(year) : currentYear;
      if (!year && monthNum > currentMonth) {
        targetYear = currentYear - 1;
      }
      // Get end of the selected month
      targetDate = new Date(targetYear, monthNum, 0, 23, 59, 59, 999);
    }

    // Get the latest snapshot for each inventory item ON OR BEFORE the target date
    const query = targetDate ? { snapshotDate: { $lte: targetDate } } : {};

    const history = await InventoryHistory.aggregate([
      { $match: query },
      { $sort: { snapshotDate: -1 } },
      {
        $group: {
          _id: "$inventoryId",
          latestSnapshot: { $first: "$$ROOT" }
        }
      },
      { $replaceRoot: { newRoot: "$latestSnapshot" } }
    ]);

    const results = history.map(h => ({
      id: h.inventoryId.toString(),
      item: h.item,
      category: h.category,
      unit: h.unit,
      beginning_balance: h.beginning_balance,
      adjustments: h.adjustments,
      actual_stock: h.actual_stock,
      qty_used: h.qty_used,
      qty_wasted: h.qty_wasted,
      months_usage: h.months_usage,
      abl: h.abl,
      price: h.price,
      status: h.status,
      snapshotDate: h.snapshotDate
    }));

    res.json({ success: true, data: results });
  } catch (error) {
    console.error("Get inventory history error:", error);
    return res.status(500).json({ success: false, message: "Database error" });
  }
});

// Create initial history snapshots for all inventory items (run once to establish baseline)
app.post("/initializeInventoryHistory", async (req, res) => {
  try {
    const items = await Inventory.find({}).populate('category', 'category').lean();

    let createdCount = 0;
    for (const item of items) {
      // Check if this item already has a history entry
      const existingHistory = await InventoryHistory.findOne({ inventoryId: item._id });
      if (!existingHistory) {
        await InventoryHistory.create({
          inventoryId: item._id,
          item: item.item,
          category: item.category ? item.category.category : '',
          unit: item.unit,
          beginning_balance: item.beginning_balance || 0,
          adjustments: item.adjustments || 0,
          actual_stock: item.actual_stock || 0,
          qty_used: item.qty_used || 0,
          qty_wasted: item.qty_wasted || 0,
          months_usage: item.months_usage || 0,
          abl: item.abl || 0,
          price: item.price || 0,
          status: item.status || 'In Stock',
          changeType: 'initial',
          quantityChanged: 0,
          snapshotDate: new Date()
        });
        createdCount++;
      }
    }

    res.json({ success: true, message: `Created ${createdCount} initial history snapshots` });
  } catch (error) {
    console.error("Initialize inventory history error:", error);
    return res.status(500).json({ success: false, message: "Database error" });
  }
});

// Create sample history data for past months (for testing date-based reports)
app.post("/seedInventoryHistoryData", async (req, res) => {
  try {
    const items = await Inventory.find({}).populate('category', 'category').lean();

    // Create history entries for past 12 months
    const now = new Date();
    let createdCount = 0;

    for (const item of items) {
      // Create entries for each month from Jan 2025 to current
      for (let monthsAgo = 12; monthsAgo >= 0; monthsAgo--) {
        const snapshotDate = new Date(now);
        snapshotDate.setMonth(snapshotDate.getMonth() - monthsAgo);
        snapshotDate.setDate(15); // Middle of month
        snapshotDate.setHours(12, 0, 0, 0);

        // Simulate stock changes over time - higher stock in past, decreasing
        const stockMultiplier = 1 + (monthsAgo * 0.1); // 10% more stock per month ago
        const simulatedStock = Math.round((item.actual_stock || 10) * stockMultiplier);
        const simulatedQtyUsed = Math.round((item.qty_used || 0) * (1 - monthsAgo * 0.08));

        // Check if entry already exists for this item and approximate date
        const startOfMonth = new Date(snapshotDate.getFullYear(), snapshotDate.getMonth(), 1);
        const endOfMonth = new Date(snapshotDate.getFullYear(), snapshotDate.getMonth() + 1, 0, 23, 59, 59);

        const existing = await InventoryHistory.findOne({
          inventoryId: item._id,
          snapshotDate: { $gte: startOfMonth, $lte: endOfMonth }
        });

        if (!existing) {
          await InventoryHistory.create({
            inventoryId: item._id,
            item: item.item,
            category: item.category ? item.category.category : '',
            unit: item.unit,
            beginning_balance: item.beginning_balance || 0,
            adjustments: item.adjustments || 0,
            actual_stock: simulatedStock,
            qty_used: Math.max(0, simulatedQtyUsed),
            qty_wasted: item.qty_wasted || 0,
            months_usage: item.months_usage || 0,
            abl: item.abl || 0,
            price: item.price || 0,
            status: simulatedStock > 0 ? 'In Stock' : 'Out of Stock',
            changeType: 'initial',
            quantityChanged: 0,
            snapshotDate: snapshotDate
          });
          createdCount++;
        }
      }
    }

    res.json({ success: true, message: `Created ${createdCount} historical snapshots for testing` });
  } catch (error) {
    console.error("Seed inventory history error:", error);
    return res.status(500).json({ success: false, message: "Database error" });
  }
});

// Update inventory status inline
app.post("/updateInventoryStatus", async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!id || !status) {
      return res.status(400).json({ message: "Item ID and status are required" });
    }

    const item = await Inventory.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.status = status;
    await item.save();

    res.json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Update status error:", error);
    return res.status(500).json({ message: "Status update failed", error: error.message });
  }
});

// Update inventory category inline
app.post("/updateInventoryCategory", async (req, res) => {
  try {
    const { id, category } = req.body;

    if (!id || !category) {
      return res.status(400).json({ message: "Item ID and category are required" });
    }

    const item = await Inventory.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Updated category map
    const categoryMap = {
      '1': 'Medicines / Pharmaceuticals',
      '2': 'Personal Protective Equipment (PPE)',
      '3': 'Medical Instruments / Tools',
      '4': 'Consumables / Disposables',
      '5': 'Contraceptives'
    };

    const mongoose = require('mongoose');
    let categoryObjectId;

    if (mongoose.Types.ObjectId.isValid(category)) {
      categoryObjectId = category;
    } else {
      const categoryName = categoryMap[category?.toString()];
      if (categoryName) {
        let categoryDoc = await InventoryCategory.findOne({ category: categoryName });
        if (!categoryDoc) {
          categoryDoc = new InventoryCategory({ category: categoryName });
          await categoryDoc.save();
        }
        categoryObjectId = categoryDoc._id;
      } else {
        return res.status(400).json({ message: "Invalid category" });
      }
    }

    item.category = categoryObjectId;
    await item.save();

    res.json({ message: "Category updated successfully" });
  } catch (error) {
    console.error("Update category error:", error);
    return res.status(500).json({ message: "Category update failed", error: error.message });
  }
});

// Delete inventory item
app.delete("/deleteInventoryItem/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const item = await Inventory.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Delete inventory error:", error);
    return res.status(500).json({ message: "Delete failed", error: error.message });
  }
});

// Seed sample data for inventory items
app.post("/seedInventoryData", async (req, res) => {
  try {
    const items = await Inventory.find({});

    // Sample data configurations based on item names
    const sampleDataMap = {
      'ointments': { beginning_balance: 200, adjustments: 0, actual_stock: 195, qty_used: 145, qty_wasted: 5, months_usage: 6, abl: 20, price: 200, unit: 'Tube' },
      'injections': { beginning_balance: 200, adjustments: 0, actual_stock: 198, qty_used: 166, qty_wasted: 0, months_usage: 6, abl: 30, price: 500, unit: 'Vial' },
      'gloves': { beginning_balance: 60, adjustments: 0, actual_stock: 48, qty_used: 50, qty_wasted: 0, months_usage: 3, abl: 10, price: 15, unit: 'Box' },
      'mask': { beginning_balance: 100, adjustments: 0, actual_stock: 250, qty_used: 50, qty_wasted: 0, months_usage: 6, abl: 20, price: 15, unit: 'Box' },
      'stethoscopes': { beginning_balance: 20, adjustments: 0, actual_stock: 120, qty_used: 20, qty_wasted: 0, months_usage: 12, abl: 5, price: 700, unit: 'Piece' },
      'thermometers': { beginning_balance: 80, adjustments: 0, actual_stock: 75, qty_used: 75, qty_wasted: 0, months_usage: 6, abl: 10, price: 160, unit: 'Piece' },
      'cotton balls': { beginning_balance: 100, adjustments: 0, actual_stock: 150, qty_used: 50, qty_wasted: 0, months_usage: 6, abl: 15, price: 45, unit: 'Pack' },
      'solmux': { beginning_balance: 80, adjustments: 0, actual_stock: 100, qty_used: 79, qty_wasted: 0, months_usage: 6, abl: 10, price: 222, unit: 'Bottle' },
      'solmux 2.0': { beginning_balance: 200, adjustments: 0, actual_stock: 480, qty_used: 120, qty_wasted: 5, months_usage: 6, abl: 100, price: 12, unit: 'Tablet' },
      '23': { beginning_balance: 20, adjustments: 0, actual_stock: 25, qty_used: 8, qty_wasted: 1, months_usage: 6, abl: 5, price: 350, unit: 'Piece' },
    };

    // Default sample data for items not in the map
    const defaultSamples = [
      { beginning_balance: 150, adjustments: 0, actual_stock: 195, qty_used: 145, qty_wasted: 5, months_usage: 6, abl: 20, price: 200 },
      { beginning_balance: 200, adjustments: 0, actual_stock: 198, qty_used: 166, qty_wasted: 0, months_usage: 6, abl: 30, price: 500 },
      { beginning_balance: 60, adjustments: 0, actual_stock: 48, qty_used: 50, qty_wasted: 0, months_usage: 3, abl: 10, price: 15 },
      { beginning_balance: 100, adjustments: 0, actual_stock: 250, qty_used: 50, qty_wasted: 0, months_usage: 6, abl: 20, price: 15 },
      { beginning_balance: 20, adjustments: 0, actual_stock: 120, qty_used: 20, qty_wasted: 0, months_usage: 12, abl: 5, price: 700 },
      { beginning_balance: 80, adjustments: 0, actual_stock: 75, qty_used: 75, qty_wasted: 0, months_usage: 6, abl: 10, price: 160 },
    ];

    let updatedCount = 0;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemNameLower = item.item ? item.item.toLowerCase() : '';

      // Check if we have specific sample data for this item
      let sampleData = sampleDataMap[itemNameLower];

      if (!sampleData) {
        // Use default sample data based on index
        sampleData = defaultSamples[i % defaultSamples.length];
      }

      // Update the item with sample data
      item.beginning_balance = sampleData.beginning_balance;
      item.adjustments = sampleData.adjustments;
      item.actual_stock = sampleData.actual_stock;
      item.qty_used = sampleData.qty_used;
      item.qty_wasted = sampleData.qty_wasted;
      item.months_usage = sampleData.months_usage;
      item.abl = sampleData.abl;
      item.price = sampleData.price;
      if (sampleData.unit) {
        item.unit = sampleData.unit;
      }

      // Calculate status
      const endingBalance = item.actual_stock - item.qty_used - item.qty_wasted;
      if (endingBalance <= 0) {
        item.status = 'Out of Stock';
      } else if (item.abl > 0 && endingBalance < item.abl) {
        item.status = 'For Reorder';
      } else {
        item.status = 'In Stock';
      }

      // Update legacy fields
      item.quantity = item.actual_stock;
      item.averageQuantity = item.abl;

      await item.save();
      updatedCount++;
    }

    res.json({ message: `Sample data added to ${updatedCount} inventory items` });
  } catch (error) {
    console.error("Seed inventory data error:", error);
    return res.status(500).json({ message: "Failed to seed data", error: error.message });
  }
});

// Update single inventory field inline
app.post("/updateInventoryField", async (req, res) => {
  console.log("[INVENTORY FIELD] ========= ENDPOINT HIT =========");
  console.log("[INVENTORY FIELD] Request body:", req.body);
  try {
    const { id, field, value } = req.body;
    console.log("[INVENTORY FIELD] Parsed - id:", id, "field:", field, "value:", value);

    if (!id || !field) {
      console.log("[INVENTORY FIELD] Missing id or field");
      return res.status(400).json({ message: "Item ID and field are required" });
    }

    const item = await Inventory.findById(id).populate('category', 'category');
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Allowed fields for inline editing
    const allowedFields = ['unit', 'beginning_balance', 'adjustments', 'actual_stock', 'qty_used', 'qty_wasted', 'months_usage', 'abl', 'price'];

    if (!allowedFields.includes(field)) {
      return res.status(400).json({ message: "Invalid field" });
    }

    // Store previous value for logging
    const previousValue = item[field];
    const previousStock = item.actual_stock || 0;

    // Update the field
    let newValue;
    if (field === 'unit') {
      newValue = value || null;
      item[field] = newValue;
    } else if (field === 'price') {
      newValue = value ? parseFloat(value) : null;
      item[field] = newValue;
    } else {
      newValue = parseInt(value) || 0;
      item[field] = newValue;
    }

    // Recalculate status based on new values
    const actualStock = parseFloat(item.actual_stock) || 0;
    const qtyUsed = parseFloat(item.qty_used) || 0;
    const qtyWasted = parseFloat(item.qty_wasted) || 0;
    const abl = parseFloat(item.abl) || 0;
    const endingBalance = actualStock - qtyUsed - qtyWasted;

    if (endingBalance <= 0) {
      item.status = 'Out of Stock';
    } else if (abl > 0 && endingBalance < abl) {
      item.status = 'For Reorder';
    } else {
      item.status = 'In Stock';
    }

    // Update legacy fields
    item.quantity = actualStock;
    item.averageQuantity = abl || null;

    await item.save();

    // Log the transaction
    try {
      const categoryName = item.category ? item.category.category : '';
      const stockChange = (field === 'actual_stock') ? (newValue - previousStock) : 0;

      // Determine transaction type
      let transactionType = 'adjustment';
      let notes = `Field "${field}" changed from ${previousValue} to ${newValue}`;

      if (field === 'actual_stock') {
        if (stockChange > 0) {
          transactionType = 'restock';
          notes = `Inventory restock: +${stockChange} units (inline edit)`;
        } else if (stockChange < 0) {
          transactionType = 'adjustment';
          notes = `Inventory adjustment: ${stockChange} units (inline edit)`;
        }
      }

      await InventoryTransaction.create({
        inventoryId: item._id,
        itemName: item.item,
        categoryName: categoryName,
        unit: item.unit || '',
        transactionType: transactionType,
        quantityBefore: previousStock,
        quantityChange: stockChange,
        quantityAfter: actualStock,
        unitPrice: item.price || 0,
        totalValue: Math.abs(stockChange) * (item.price || 0),
        referenceType: 'manual',
        performedBy: {
          userId: req.session?.userId,
          userName: req.session?.firstname && req.session?.lastname
            ? `${req.session.firstname} ${req.session.lastname}`
            : 'Staff',
          userRole: req.session?.role || 'staff',
          userEmail: req.session?.email || ''
        },
        notes: notes,
        ipAddress: req.ip
      });
      console.log(`[INVENTORY] Field update logged: ${field} for ${item.item}`);
    } catch (txError) {
      console.error("[INVENTORY] Failed to log field update transaction:", txError);
    }

    res.json({ message: "Field updated successfully" });
  } catch (error) {
    console.error("Update field error:", error);
    return res.status(500).json({ message: "Field update failed", error: error.message });
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

    // Only update fields that are provided
    if (firstname) user.firstname = firstname;
    user.middlename = middlename || null;
    if (lastname) user.lastname = lastname;
    if (gender && ['Male', 'Female', 'Other'].includes(gender)) {
      user.gender = gender;
    } else if (gender) {
      return res.status(400).json({ message: "Invalid gender" });
    }
    if (birthdate) {
      const parsedDate = new Date(birthdate);
      if (!isNaN(parsedDate.getTime())) {
        user.birthdate = parsedDate;
      } else {
        return res.status(400).json({ message: "Invalid birthdate" });
      }
    }
    if (age && isNaN(age)) {
      return res.status(400).json({ message: "Age must be a number" });
    }
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
    const { booking_id, tag, reason } = req.body;

    if (!booking_id || !tag) {
      return res.status(400).json({ message: "Missing booking_id or tag" });
    }

    // Validate tag is a valid status
    const validStatuses = ['Booked', 'Completed', 'Cancelled', 'In Queue', 'Emergency'];
    if (!validStatuses.includes(tag)) {
      return res.status(400).json({ message: "Invalid status tag" });
    }

    // Build update object
    const updateData = { status: tag };

    // If cancelling, save the reason
    if (tag === 'Cancelled' && reason) {
      updateData.reason = reason;
    }

    // Use findByIdAndUpdate to avoid validation issues
    const appointment = await Appointment.findByIdAndUpdate(
      booking_id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Booking status updated successfully" });
  } catch (error) {
    console.error("Error updating booking status:", error);
    return res.status(500).json({ message: error.message || "Failed to update booking status" });
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
        prescription: rec ? rec.prescription : null,
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