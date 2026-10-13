# School Management System

A complete, professional, secure, and responsive School Management ERP application designed for schools in nepal.

<img width="1888" height="907" alt="image" src="https://github.com/user-attachments/assets/c1f77dcf-074e-4193-8d22-da70e29cf0bb" />

---

## 🏫 Key Features & Functional Modules

### 1. Modern Institutional Dashboard
- Real-time KPI statistics: Total enrolled students (boy/girl breakdown), faculty count, daily attendance %, pending fee dues in NPR (रु), and monthly revenue.
- Visual charts: Monthly fee collection vs expected targets, attendance distribution, upcoming examination milestones.
- Quick Administrative shortcuts (New Admission, Collect Fee, Mark Attendance, Enter Marks, Issue ID Card).

### 2. Multi-Role RBAC (Role-Based Access Control)
The application provides customized permission boundaries and 1-click test switching for:
1. **Super Admin** – Full administrative, academic, financial, and configuration oversight.
2. **School Administrator** – Academic planning, admissions, routines, circulars, and rosters.
3. **Accountant** – Fee structures, collection receipts, income & expense ledgers, audit registers.
4. **Teacher** – Roll call attendance, CDC/NEB marks entry, homework assignment, class routine.
5. **Student** – View assigned homework, attendance record, terminal progress report cards, fee receipts.
6. **Parent / Guardian** – Ward profile, fee dues ledger, term report cards, attendance status.

### 3. Student Admissions & Records
- Full student directory with admission numbers (e.g. `SEBS-2075-012`), roll numbers, dates of birth (B.S.), blood group, guardian contact, and residential address.
- Auto-validation preventing duplicate admission numbers across the institution.
- Detailed student profile drawer with academic history, fee balance, and direct fee collection shortcut.
- One-click CSV export and print-friendly student directories.

### 4. Faculty & Staff Management
- Staff profiles with unique employee IDs (`EMP-001`, `EMP-002`, etc.), qualifications, departments, assigned subjects, and teaching classes.

### 5. Academic Routine & Timetable
- Academic sessions (2081 B.S. / 2024–2025), classes (Nursery to Class 10), and sections (A, B, C).
- Period routine timetable (Periods 1 to 7 from 10:00 AM to 4:00 PM, Sunday through Friday as standard in Nepal).

### 6. Daily Attendance Register
- Daily roll call with Present (P), Absent (A), Late (L), and Leave (LV) statuses.
- Real-time calculation of daily attendance percentages.
- Bulk "Mark All Present" and individual student remarks.

### 7. Examination, Grading & Report Cards
- Terminal Examination management (First Terminal, Second Terminal, SEE Pre-Board).
- CDC / NEB (Nepal National Examinations Board) grading engine:
  - 90–100%: **A+** (4.0 GPA, Outstanding)
  - 80–89%: **A** (3.6 GPA, Excellent)
  - 70–79%: **B+** (3.2 GPA, Very Good)
  - 60–69%: **B** (2.8 GPA, Good)
  - 50–59%: **C+** (2.4 GPA, Satisfactory)
  - 40–49%: **C** (2.0 GPA, Acceptable)
  - 35–39%: **D** (1.6 GPA, Basic)
  - <35%: **NG** (0.0 GPA, Non-Graded)
- **Printable Terminal Progress Report Card** complete with official Safe English Boarding School letterhead, subject-wise Theory & Practical marks, GPA, teacher remarks, and signature lines.

### 8. Fee Collection & Accounts
- Fee collections in Nepalese Rupees (NPR - रु) with payment modes: Cash, eSewa, Khalti, Bank Transfer, and Cheque.
- Uniquely numbered money receipts (e.g. `REC-2081-0321`).
- Official printable Money Receipt voucher.
- Income & expense ledger with balance tracking.

### 9. Homework & Notice Circulars
- Teachers assign homework with instructions, class, subject, and due date.
- School circulars with priority tags (Urgent, Exam, Holiday, General) targeted to Parents, Students, Teachers, or School-wide.

### 10. Printable ID Cards & Certificates
- Student ID Cards (photo, barcode, emergency phone, school emblem).
- Faculty ID Cards.
- Official School Character & Transfer Certificate (TC) generator.

---

## 🛠 Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS
- **Icons**: Lucide React
- **Cloud Database**: Google Cloud Firestore with security rules deployed
- **Auth**: Firebase Auth & RBAC State Provider
- **Print Engine**: Dedicated `@media print` CSS layouts
"# School-Management-System" 
