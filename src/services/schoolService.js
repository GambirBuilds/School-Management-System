import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase.js';

// Initial pre-populated data for Safe English Boarding School (Kathmandu, Nepal)
export const initialSchoolInfo = {
  schoolName: "Safe English Boarding School",
  established: "2054 B.S. (1997 A.D.)",
  motto: "Excellence in Education, Character & Discipline",
  affiliation: "Affiliated to Ministry of Education, CDC & NEB, Nepal",
  registrationNo: "SEBS-KTM-2054/08",
  address: "Bhimsensthan-07, Kathmandu, Bagmati Province, Nepal",
  phone: "+977-01-4245678, +977-9851023456",
  email: "info@safeenglishschool.edu.np",
  website: "www.safeenglishschool.edu.np",
  principal: "Mr. Ram Kumar Adhikari, M.Ed.",
  academicYear: "2081 B.S. (2024–2025)",
  currency: "रु (NPR)"
};

export const sampleStudents = [
  {
    id: "std-001",
    admissionNo: "SEBS-2075-012",
    fullName: "Aayush Thapa",
    grade: "Class 10",
    section: "A",
    rollNo: "01",
    dob: "2065-04-12",
    gender: "Male",
    bloodGroup: "B+",
    guardianName: "Hari Prasad Thapa",
    guardianPhone: "+977-9841234567",
    address: "Bhimsensthan, Kathmandu",
    admissionDate: "2075-01-10",
    status: "Active",
    feesDue: 4500,
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "std-002",
    admissionNo: "SEBS-2075-015",
    fullName: "Prerana Karki",
    grade: "Class 10",
    section: "A",
    rollNo: "02",
    dob: "2065-06-25",
    gender: "Female",
    bloodGroup: "O+",
    guardianName: "Bhim Bahadur Karki",
    guardianPhone: "+977-9851123456",
    address: "Kalanki, Kathmandu",
    admissionDate: "2075-01-12",
    status: "Active",
    feesDue: 0,
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "std-003",
    admissionNo: "SEBS-2075-019",
    fullName: "Rohan Sharma",
    grade: "Class 10",
    section: "A",
    rollNo: "03",
    dob: "2065-02-18",
    gender: "Male",
    bloodGroup: "A+",
    guardianName: "Deepak Sharma",
    guardianPhone: "+977-9861345678",
    address: "Tahachal, Kathmandu",
    admissionDate: "2075-01-15",
    status: "Active",
    feesDue: 11000,
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "std-004",
    admissionNo: "SEBS-2076-044",
    fullName: "Ananya Shrestha",
    grade: "Class 9",
    section: "B",
    rollNo: "01",
    dob: "2066-08-04",
    gender: "Female",
    bloodGroup: "AB+",
    guardianName: "Rajendra Shrestha",
    guardianPhone: "+977-9849876543",
    address: "Tripureshwor, Kathmandu",
    admissionDate: "2076-01-08",
    status: "Active",
    feesDue: 2500,
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "std-005",
    admissionNo: "SEBS-2076-052",
    fullName: "Bishal Gurung",
    grade: "Class 9",
    section: "B",
    rollNo: "02",
    dob: "2066-11-19",
    gender: "Male",
    bloodGroup: "O+",
    guardianName: "Sombir Gurung",
    guardianPhone: "+977-9818765432",
    address: "Swayambhu, Kathmandu",
    admissionDate: "2076-01-14",
    status: "Active",
    feesDue: 0,
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "std-006",
    admissionNo: "SEBS-2077-023",
    fullName: "Diwas Tamang",
    grade: "Class 8",
    section: "A",
    rollNo: "01",
    dob: "2067-03-14",
    gender: "Male",
    bloodGroup: "B+",
    guardianName: "Dorje Tamang",
    guardianPhone: "+977-9803456789",
    address: "Teku, Kathmandu",
    admissionDate: "2077-01-05",
    status: "Active",
    feesDue: 3800,
    photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "std-007",
    admissionNo: "SEBS-2077-027",
    fullName: "Kritika Pokharel",
    grade: "Class 8",
    section: "A",
    rollNo: "02",
    dob: "2067-09-02",
    gender: "Female",
    bloodGroup: "A+",
    guardianName: "Madhav Pokharel",
    guardianPhone: "+977-9843210987",
    address: "Kuleshwor, Kathmandu",
    admissionDate: "2077-01-12",
    status: "Active",
    feesDue: 0,
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "std-008",
    admissionNo: "SEBS-2078-011",
    fullName: "Nishan Basnet",
    grade: "Class 7",
    section: "A",
    rollNo: "01",
    dob: "2068-05-11",
    gender: "Male",
    bloodGroup: "O-",
    guardianName: "Surya Basnet",
    guardianPhone: "+977-9860123499",
    address: "Bafal, Kathmandu",
    admissionDate: "2078-01-08",
    status: "Active",
    feesDue: 7200,
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "std-009",
    admissionNo: "SEBS-2079-065",
    fullName: "Samikshya Joshi",
    grade: "Class 6",
    section: "B",
    rollNo: "03",
    dob: "2069-12-01",
    gender: "Female",
    bloodGroup: "B+",
    guardianName: "Kamal Joshi",
    guardianPhone: "+977-9841889900",
    address: "Sanepa, Lalitpur",
    admissionDate: "2079-01-15",
    status: "Active",
    feesDue: 0,
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "std-010",
    admissionNo: "SEBS-2080-088",
    fullName: "Aarav Pandey",
    grade: "Class 5",
    section: "A",
    rollNo: "05",
    dob: "2070-07-20",
    gender: "Male",
    bloodGroup: "A+",
    guardianName: "Gopal Pandey",
    guardianPhone: "+977-9851987654",
    address: "Maitidevi, Kathmandu",
    admissionDate: "2080-01-11",
    status: "Active",
    feesDue: 1800,
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
  }
];

export const sampleStaff = [
  {
    id: "stf-001",
    employeeId: "EMP-001",
    fullName: "Ram Kumar Adhikari",
    designation: "Principal & Head of School",
    department: "Administration",
    phone: "+977-9851023456",
    email: "principal@safeenglishschool.edu.np",
    qualification: "M.Ed. Educational Leadership, Tribhuvan University",
    status: "Active",
    joinDate: "2060-01-15",
    subjects: ["Education Administration", "Nepali Literature"],
    classes: ["Class 10", "Class 9"]
  },
  {
    id: "stf-002",
    employeeId: "EMP-002",
    fullName: "Dinesh Gautam",
    designation: "Senior Science Teacher",
    department: "Science & Technology",
    phone: "+977-9841223344",
    email: "dinesh.gautam@safeenglishschool.edu.np",
    qualification: "M.Sc. Physics, Amrit Science Campus",
    status: "Active",
    joinDate: "2065-03-20",
    subjects: ["Science & Technology", "Computer Science"],
    classes: ["Class 10 A", "Class 9 B", "Class 8 A"]
  },
  {
    id: "stf-003",
    employeeId: "EMP-003",
    fullName: "Sabina Neupane",
    designation: "Senior English Teacher",
    department: "Languages",
    phone: "+977-9861556677",
    email: "sabina.neupane@safeenglishschool.edu.np",
    qualification: "M.A. English, TU",
    status: "Active",
    joinDate: "2068-02-10",
    subjects: ["Compulsory English", "Grammar & Composition"],
    classes: ["Class 10 A", "Class 8 A", "Class 7 A"]
  },
  {
    id: "stf-004",
    employeeId: "EMP-004",
    fullName: "Prakash Bhattarai",
    designation: "Mathematics Department Lead",
    department: "Mathematics",
    phone: "+977-9849334455",
    email: "prakash.math@safeenglishschool.edu.np",
    qualification: "M.Sc. Mathematics",
    status: "Active",
    joinDate: "2070-04-12",
    subjects: ["Compulsory Mathematics", "Optional Mathematics"],
    classes: ["Class 10 A", "Class 9 B"]
  },
  {
    id: "stf-005",
    employeeId: "EMP-005",
    fullName: "Sunita Maharjan",
    designation: "Chief Accountant & Bursar",
    department: "Accounts & Finance",
    phone: "+977-9851778899",
    email: "accounts@safeenglishschool.edu.np",
    qualification: "MBS (Master of Business Studies)",
    status: "Active",
    joinDate: "2069-08-01",
    subjects: ["Accountancy (Class 9 & 10)"],
    classes: ["Administration", "Accounts"]
  },
  {
    id: "stf-006",
    employeeId: "EMP-006",
    fullName: "Narayan KC",
    designation: "Exam Controller & Admin Officer",
    department: "Examinations",
    phone: "+977-9801445566",
    email: "exams@safeenglishschool.edu.np",
    qualification: "B.Ed. & MPA",
    status: "Active",
    joinDate: "2072-01-10",
    subjects: ["Social Studies"],
    classes: ["Class 8 A", "Class 7 A"]
  }
];

export const sampleNotices = [
  {
    id: "not-001",
    title: "Second Terminal Examination Routine & Guidelines 2081",
    content: "The Second Terminal Examination for grades Nursery to Class 10 will commence from 2081 Mangsir 18. All students are advised to clear outstanding term fees by Mangsir 14 to receive admit cards.",
    targetAudience: "All",
    priority: "Exam",
    date: "2081-08-10",
    author: "Office of the Examination Controller"
  },
  {
    id: "not-002",
    title: "Parent-Teacher Meeting (PTM) for First Term Review",
    content: "Dear Parents and Guardians, a general PTM has been scheduled on Friday, 2081 Kartik 30 between 10:00 AM and 2:00 PM. Please collect and discuss the First Terminal report card of your ward.",
    targetAudience: "Parents",
    priority: "Urgent",
    date: "2081-07-25",
    author: "Principal Office"
  },
  {
    id: "not-003",
    title: "Annual Sports and Cultural Week 2081 Announcement",
    content: "Registrations are now open for inter-house athletics, badminton, chess, debate, and cultural dance competitions. Contact your house in-charge teachers before Mangsir 05.",
    targetAudience: "Students",
    priority: "Normal",
    date: "2081-07-20",
    author: "Sports & ECA Committee"
  },
  {
    id: "not-004",
    title: "Faculty Professional Development Workshop on Modern Pedagogy",
    content: "All teaching staff are notified to participate in the upcoming pedagogy and STEM teaching workshop on Saturday at the School Audio-Visual Hall.",
    targetAudience: "Teachers",
    priority: "Normal",
    date: "2081-07-15",
    author: "Academic Coordinator"
  }
];

export const sampleFeePayments = [
  {
    id: "pay-001",
    receiptNo: "REC-2081-0321",
    studentId: "std-002",
    studentName: "Prerana Karki",
    grade: "Class 10",
    section: "A",
    amount: 11000,
    paymentMethod: "eSewa",
    month: "Kartik 2081 (Tuition & Exam)",
    date: "2081-07-28",
    collectedBy: "Sunita Maharjan",
    remarks: "Paid in full via eSewa transaction #TX9921"
  },
  {
    id: "pay-002",
    receiptNo: "REC-2081-0322",
    studentId: "std-005",
    studentName: "Bishal Gurung",
    grade: "Class 9",
    section: "B",
    amount: 9800,
    paymentMethod: "Bank Transfer",
    month: "Kartik 2081 (Tuition & Computer)",
    date: "2081-07-29",
    collectedBy: "Sunita Maharjan",
    remarks: "Nabil Bank counter voucher #4412"
  },
  {
    id: "pay-003",
    receiptNo: "REC-2081-0323",
    studentId: "std-007",
    studentName: "Kritika Pokharel",
    grade: "Class 8",
    section: "A",
    amount: 8500,
    paymentMethod: "Cash",
    month: "Kartik 2081 (Monthly Fees)",
    date: "2081-08-01",
    collectedBy: "Sunita Maharjan",
    remarks: "Received at counter in cash"
  },
  {
    id: "pay-004",
    receiptNo: "REC-2081-0324",
    studentId: "std-009",
    studentName: "Samikshya Joshi",
    grade: "Class 6",
    section: "B",
    amount: 7200,
    paymentMethod: "Khalti",
    month: "Kartik 2081",
    date: "2081-08-02",
    collectedBy: "Sunita Maharjan",
    remarks: "Khalti payment ID #KH88210"
  }
];

export const sampleTransactions = [
  {
    id: "tx-001",
    type: "income",
    title: "Student Monthly Fee Collections (Kartik 2081)",
    category: "Tuition Fees",
    amount: 245000,
    date: "2081-07-30",
    paymentMode: "Bank / Digital",
    voucherNo: "INC-2081-102"
  },
  {
    id: "tx-002",
    type: "expense",
    title: "Teaching & Non-Teaching Staff Salary (Ashwin)",
    category: "Staff Salary",
    amount: 185000,
    date: "2081-07-15",
    paymentMode: "Bank Transfer",
    voucherNo: "EXP-2081-045"
  },
  {
    id: "tx-003",
    type: "expense",
    title: "Science Laboratory Glassware & Reagents Refill",
    category: "Lab & Library",
    amount: 24000,
    date: "2081-07-20",
    paymentMode: "Cheque",
    voucherNo: "EXP-2081-046"
  },
  {
    id: "tx-004",
    type: "income",
    title: "New Student Admission & Registration Fees",
    category: "Admission Fees",
    amount: 45000,
    date: "2081-07-22",
    paymentMode: "Cash",
    voucherNo: "INC-2081-103"
  },
  {
    id: "tx-005",
    type: "expense",
    title: "Electricity & High-Speed Optical Internet Bill",
    category: "Utilities",
    amount: 14500,
    date: "2081-07-25",
    paymentMode: "Online Banking",
    voucherNo: "EXP-2081-047"
  }
];

export const sampleExams = [
  {
    id: "ex-001",
    title: "First Terminal Examination 2081",
    academicYear: "2081 B.S.",
    term: "Term 1",
    startDate: "2081-04-15",
    endDate: "2081-04-24",
    status: "Published"
  },
  {
    id: "ex-002",
    title: "Second Terminal Examination 2081",
    academicYear: "2081 B.S.",
    term: "Term 2",
    startDate: "2081-08-18",
    endDate: "2081-08-28",
    status: "Ongoing"
  },
  {
    id: "ex-003",
    title: "SEE Pre-Board & Annual Examination 2081",
    academicYear: "2081 B.S.",
    term: "Final",
    startDate: "2081-11-20",
    endDate: "2081-12-02",
    status: "Draft"
  }
];

export const sampleMarks = [
  {
    id: "mk-001",
    examId: "ex-001",
    studentId: "std-001",
    studentName: "Aayush Thapa",
    grade: "Class 10",
    section: "A",
    rollNo: "01",
    subjects: [
      { code: "ENG-10", name: "Compulsory English", fullMarks: 100, passMarks: 35, obtainedTheory: 58, obtainedPractical: 23, total: 81, grade: "A", gp: 3.6 },
      { code: "NEP-10", name: "Nepali", fullMarks: 100, passMarks: 35, obtainedTheory: 56, obtainedPractical: 22, total: 78, grade: "B+", gp: 3.2 },
      { code: "MTH-10", name: "Compulsory Mathematics", fullMarks: 100, passMarks: 35, obtainedTheory: 65, obtainedPractical: 24, total: 89, grade: "A", gp: 3.6 },
      { code: "SCI-10", name: "Science & Technology", fullMarks: 100, passMarks: 35, obtainedTheory: 68, obtainedPractical: 25, total: 93, grade: "A+", gp: 4.0 },
      { code: "SOC-10", name: "Social Studies & Life Skills", fullMarks: 100, passMarks: 35, obtainedTheory: 57, obtainedPractical: 24, total: 81, grade: "A", gp: 3.6 },
      { code: "COM-10", name: "Computer Science (Opt)", fullMarks: 100, passMarks: 35, obtainedTheory: 46, obtainedPractical: 48, total: 94, grade: "A+", gp: 4.0 }
    ],
    totalMarks: 516,
    percentage: 86.0,
    gpa: 3.67,
    finalGrade: "A",
    remarks: "Excellent analytical ability, consistent discipline and dedication."
  },
  {
    id: "mk-002",
    examId: "ex-001",
    studentId: "std-002",
    studentName: "Prerana Karki",
    grade: "Class 10",
    section: "A",
    rollNo: "02",
    subjects: [
      { code: "ENG-10", name: "Compulsory English", fullMarks: 100, passMarks: 35, obtainedTheory: 65, obtainedPractical: 24, total: 89, grade: "A", gp: 3.6 },
      { code: "NEP-10", name: "Nepali", fullMarks: 100, passMarks: 35, obtainedTheory: 62, obtainedPractical: 23, total: 85, grade: "A", gp: 3.6 },
      { code: "MTH-10", name: "Compulsory Mathematics", fullMarks: 100, passMarks: 35, obtainedTheory: 69, obtainedPractical: 25, total: 94, grade: "A+", gp: 4.0 },
      { code: "SCI-10", name: "Science & Technology", fullMarks: 100, passMarks: 35, obtainedTheory: 66, obtainedPractical: 25, total: 91, grade: "A+", gp: 4.0 },
      { code: "SOC-10", name: "Social Studies & Life Skills", fullMarks: 100, passMarks: 35, obtainedTheory: 64, obtainedPractical: 24, total: 88, grade: "A", gp: 3.6 },
      { code: "COM-10", name: "Computer Science (Opt)", fullMarks: 100, passMarks: 35, obtainedTheory: 48, obtainedPractical: 49, total: 97, grade: "A+", gp: 4.0 }
    ],
    totalMarks: 544,
    percentage: 90.6,
    gpa: 3.80,
    finalGrade: "A+",
    remarks: "Outstanding academic performance! First rank in Class 10 'A'."
  }
];

export const sampleHomework = [
  {
    id: "hw-001",
    title: "Gravitation Numerical Problems - Chapter 3",
    grade: "Class 10",
    section: "A",
    subject: "Science & Technology",
    instructions: "Complete all questions from exercise 3.2 (page 48) in your fair science notebook. Show full mathematical derivation for acceleration due to gravity on Mt. Everest.",
    dueDate: "2081-08-15",
    assignedBy: "Mr. Dinesh Gautam",
    createdAt: "2081-08-11"
  },
  {
    id: "hw-002",
    title: "Editorial Letter Writing on Environmental Cleanliness",
    grade: "Class 10",
    section: "A",
    subject: "Compulsory English",
    instructions: "Write a letter (180-200 words) to the Editor of The Kathmandu Post highlighting the necessity of proper solid waste segregation in urban Kathmandu.",
    dueDate: "2081-08-16",
    assignedBy: "Mrs. Sabina Neupane",
    createdAt: "2081-08-12"
  },
  {
    id: "hw-003",
    title: "Simultaneous Linear Equations in Two Variables",
    grade: "Class 9",
    section: "B",
    subject: "Compulsory Mathematics",
    instructions: "Solve problems 1 through 10 by substitution and elimination methods. Prepare for a mini quiz next Sunday.",
    dueDate: "2081-08-17",
    assignedBy: "Mr. Prakash Bhattarai",
    createdAt: "2081-08-12"
  }
];

export const sampleAttendance = [
  {
    id: "att-001",
    date: "2081-08-12",
    grade: "Class 10",
    section: "A",
    totalStudents: 3,
    presentCount: 3,
    absentCount: 0,
    lateCount: 0,
    leaveCount: 0,
    records: [
      { studentId: "std-001", name: "Aayush Thapa", rollNo: "01", status: "Present" },
      { studentId: "std-002", name: "Prerana Karki", rollNo: "02", status: "Present" },
      { studentId: "std-003", name: "Rohan Sharma", rollNo: "03", status: "Present" }
    ]
  },
  {
    id: "att-002",
    date: "2081-08-11",
    grade: "Class 10",
    section: "A",
    totalStudents: 3,
    presentCount: 2,
    absentCount: 1,
    lateCount: 0,
    leaveCount: 0,
    records: [
      { studentId: "std-001", name: "Aayush Thapa", rollNo: "01", status: "Present" },
      { studentId: "std-002", name: "Prerana Karki", rollNo: "02", status: "Present" },
      { studentId: "std-003", name: "Rohan Sharma", rollNo: "03", status: "Absent", remark: "Sick leave reported" }
    ]
  }
];

// Helper to calculate Grade and GPA according to Nepal CDC / NEB standard
export function calculateNepaliGrade(percentage) {
  if (percentage >= 90) return { grade: "A+", gp: 4.0, remark: "Outstanding" };
  if (percentage >= 80) return { grade: "A", gp: 3.6, remark: "Excellent" };
  if (percentage >= 70) return { grade: "B+", gp: 3.2, remark: "Very Good" };
  if (percentage >= 60) return { grade: "B", gp: 2.8, remark: "Good" };
  if (percentage >= 50) return { grade: "C+", gp: 2.4, remark: "Satisfactory" };
  if (percentage >= 40) return { grade: "C", gp: 2.0, remark: "Acceptable" };
  if (percentage >= 35) return { grade: "D", gp: 1.6, remark: "Basic" };
  return { grade: "NG", gp: 0.0, remark: "Non-Graded" };
}

// Service methods with Firestore and resilient fallback
export async function getSchoolInfo() {
  try {
    const docRef = doc(db, 'settings', 'schoolInfo');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...initialSchoolInfo, ...docSnap.data() };
    }
  } catch (error) {
    console.warn("Using local school info fallback:", error.message);
  }
  return initialSchoolInfo;
}

export async function updateSchoolInfo(data) {
  try {
    const docRef = doc(db, 'settings', 'schoolInfo');
    await setDoc(docRef, data, { merge: true });
    return data;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'settings/schoolInfo');
  }
}

export async function getStudents() {
  try {
    const q = collection(db, 'students');
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  } catch (error) {
    console.warn("Firestore students read fallback:", error.message);
  }
  return sampleStudents;
}

export async function addStudent(studentData) {
  try {
    const docRef = await addDoc(collection(db, 'students'), {
      ...studentData,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...studentData };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'students');
  }
}

export async function updateStudent(id, studentData) {
  try {
    const docRef = doc(db, 'students', id);
    await updateDoc(docRef, studentData);
    return { id, ...studentData };
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `students/${id}`);
  }
}

export async function deleteStudent(id) {
  try {
    const docRef = doc(db, 'students', id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `students/${id}`);
  }
}

export async function getStaff() {
  try {
    const q = collection(db, 'staff');
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  } catch (error) {
    console.warn("Firestore staff read fallback:", error.message);
  }
  return sampleStaff;
}

export async function addStaff(staffData) {
  try {
    const docRef = await addDoc(collection(db, 'staff'), {
      ...staffData,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...staffData };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'staff');
  }
}

export async function getNotices() {
  try {
    const q = collection(db, 'notices');
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  } catch (error) {
    console.warn("Firestore notices read fallback:", error.message);
  }
  return sampleNotices;
}

export async function addNotice(noticeData) {
  try {
    const docRef = await addDoc(collection(db, 'notices'), {
      ...noticeData,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...noticeData };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'notices');
  }
}

export async function getFeePayments() {
  try {
    const q = collection(db, 'feePayments');
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  } catch (error) {
    console.warn("Firestore feePayments read fallback:", error.message);
  }
  return sampleFeePayments;
}

export async function addFeePayment(paymentData) {
  try {
    const docRef = await addDoc(collection(db, 'feePayments'), {
      ...paymentData,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...paymentData };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'feePayments');
  }
}

export async function getTransactions() {
  try {
    const q = collection(db, 'transactions');
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  } catch (error) {
    console.warn("Firestore transactions read fallback:", error.message);
  }
  return sampleTransactions;
}

export async function addTransaction(transactionData) {
  try {
    const docRef = await addDoc(collection(db, 'transactions'), {
      ...transactionData,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...transactionData };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'transactions');
  }
}

export async function getExams() {
  try {
    const q = collection(db, 'exams');
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  } catch (error) {
    console.warn("Firestore exams read fallback:", error.message);
  }
  return sampleExams;
}

export async function getMarks() {
  try {
    const q = collection(db, 'marks');
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  } catch (error) {
    console.warn("Firestore marks read fallback:", error.message);
  }
  return sampleMarks;
}

export async function saveMarkEntry(markData) {
  try {
    if (markData.id) {
      const docRef = doc(db, 'marks', markData.id);
      await updateDoc(docRef, markData);
      return markData;
    } else {
      const docRef = await addDoc(collection(db, 'marks'), {
        ...markData,
        createdAt: new Date().toISOString()
      });
      return { id: docRef.id, ...markData };
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'marks');
  }
}

export async function getHomework() {
  try {
    const q = collection(db, 'homework');
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  } catch (error) {
    console.warn("Firestore homework read fallback:", error.message);
  }
  return sampleHomework;
}

export async function addHomework(homeworkData) {
  try {
    const docRef = await addDoc(collection(db, 'homework'), {
      ...homeworkData,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...homeworkData };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'homework');
  }
}

export async function getAttendance() {
  try {
    const q = collection(db, 'attendance');
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  } catch (error) {
    console.warn("Firestore attendance read fallback:", error.message);
  }
  return sampleAttendance;
}

export async function saveAttendance(attendanceData) {
  try {
    const docRef = await addDoc(collection(db, 'attendance'), {
      ...attendanceData,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...attendanceData };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'attendance');
  }
}

// Reset or seed fresh demo data to Firestore
export async function seedInitialFirestoreData() {
  try {
    // Save school info
    await setDoc(doc(db, 'settings', 'schoolInfo'), initialSchoolInfo, { merge: true });

    // Seed students
    for (const student of sampleStudents) {
      await setDoc(doc(db, 'students', student.id), student, { merge: true });
    }
    // Seed staff
    for (const staff of sampleStaff) {
      await setDoc(doc(db, 'staff', staff.id), staff, { merge: true });
    }
    // Seed notices
    for (const notice of sampleNotices) {
      await setDoc(doc(db, 'notices', notice.id), notice, { merge: true });
    }
    // Seed fee payments
    for (const payment of sampleFeePayments) {
      await setDoc(doc(db, 'feePayments', payment.id), payment, { merge: true });
    }
    // Seed transactions
    for (const tx of sampleTransactions) {
      await setDoc(doc(db, 'transactions', tx.id), tx, { merge: true });
    }
    // Seed exams
    for (const ex of sampleExams) {
      await setDoc(doc(db, 'exams', ex.id), ex, { merge: true });
    }
    // Seed marks
    for (const mk of sampleMarks) {
      await setDoc(doc(db, 'marks', mk.id), mk, { merge: true });
    }
    // Seed homework
    for (const hw of sampleHomework) {
      await setDoc(doc(db, 'homework', hw.id), hw, { merge: true });
    }
    return { success: true, message: "Database seeded successfully!" };
  } catch (error) {
    console.error("Error seeding Firestore:", error);
    return { success: false, error: error.message };
  }
}
