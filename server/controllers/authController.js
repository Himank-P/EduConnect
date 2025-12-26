const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const otpStore = {};

// --- OTP Generation ---
exports.register = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required.' });
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return res.status(500).json({ error: 'Email service is not configured.' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, timestamp: Date.now() };
    console.log(`Generated OTP for ${email}: ${otp}`);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
        from: `"EduConnect Verification" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Your EduConnect Verification Code`,
        html: `<h2>Your OTP is ${otp}</h2><p>It is valid for 10 minutes.</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: `OTP sent to ${email}` });
    } catch (error) {
        console.error('Error sending OTP email:', error);
        res.status(500).json({ error: 'Failed to send OTP.' });
    }
};

// --- OTP Verification ---
exports.verifyOtp = (req, res) => {
    const { email, otp } = req.body;
    const storedOtpData = otpStore[email];

    if (!storedOtpData) return res.status(400).json({ error: 'OTP expired or invalid.' });
    
    const isExpired = (Date.now() - storedOtpData.timestamp) > 10 * 60 * 1000; // 10 minutes
    if (isExpired) {
        delete otpStore[email];
        return res.status(400).json({ error: 'OTP has expired.' });
    }

    if (storedOtpData.otp === otp) {
        delete otpStore[email];
        res.status(200).json({ message: 'Verification successful!' });
    } else {
        res.status(400).json({ error: 'Invalid OTP.' });
    }
};

// --- Onboarding & Login Logic ---
const saveUser = (filePath, newUser, userType, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: `Could not read ${userType} data file.` });
        const users = JSON.parse(data);
        users.push(newUser);

        fs.writeFile(filePath, JSON.stringify(users, null, 2), (writeErr) => {
            if (writeErr) return res.status(500).json({ error: `Could not save ${userType} data.` });
            res.status(201).json({ 
                message: `${userType} registered successfully!`,
                user: { name: newUser.fullName || newUser.schoolName, email: newUser.email, role: userType } 
            });
        });
    });
};

exports.onboardSchool = (req, res) => {
    const { email, schoolName, phone, address, principalName, schoolBoard, website, password } = req.body;
    const newUser = { id: Date.now(), email, schoolName, phone, address, principalName, schoolBoard, website, password, registeredOn: new Date().toISOString() };
    saveUser(path.join(__dirname, '../data/schools.json'), newUser, 'school', res);
};

exports.onboardTeacher = (req, res) => {
    const { email, fullName, schoolId, department, phone, password } = req.body;
    const newUser = { id: Date.now(), email, fullName, schoolId, department, phone, password, registeredOn: new Date().toISOString() };
    saveUser(path.join(__dirname, '../data/teachers.json'), newUser, 'teacher', res);
};

exports.onboardStudent = (req, res) => {
    const { email, fullName, studentId, dob, parentName, password } = req.body;
    const newUser = { id: Date.now(), email, fullName, studentId, dob, parentName, password, registeredOn: new Date().toISOString() };
    saveUser(path.join(__dirname, '../data/students.json'), newUser, 'student', res);
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    try {
        const schools = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/schools.json')));
        const teachers = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/teachers.json')));
        const students = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/students.json')));
        
        let foundUser = null;
        let userRole = '';

        const schoolUser = schools.find(u => u.email === email && u.password === password);
        if(schoolUser) { foundUser = schoolUser; userRole = 'school'; }
        else {
            const teacherUser = teachers.find(u => u.email === email && u.password === password);
            if(teacherUser) { foundUser = teacherUser; userRole = 'teacher'; }
            else {
                const studentUser = students.find(u => u.email === email && u.password === password);
                if(studentUser) { foundUser = studentUser; userRole = 'student'; }
            }
        }

        if (foundUser) {
            res.status(200).json({
                message: 'Login successful!',
                user: { name: foundUser.fullName || foundUser.schoolName, email: foundUser.email, role: userRole }
            });
        } else {
            res.status(401).json({ error: 'Invalid email or password.' });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "An error occurred during login." });
    }
};

