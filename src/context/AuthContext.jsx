import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'School Administrator',
  ACCOUNTANT: 'Accountant',
  TEACHER: 'Teacher',
  STUDENT: 'Student',
  PARENT: 'Parent / Guardian'
};

// Preset demo user accounts for rapid testing & validation
export const DEMO_ACCOUNTS = [
  {
    id: 'user-001',
    name: 'Admin',
    email: 'superadmin@safeenglishschool.edu.np',
    role: ROLES.SUPER_ADMIN,
    title: 'Managing Director & Super Admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    assignedClass: 'All',
    department: 'Management'
  },
  {
    id: 'user-002',
    name: 'Mr. Ram Kumar Adhikari',
    email: 'principal@safeenglishschool.edu.np',
    role: ROLES.ADMIN,
    title: 'Principal & Head Administrator',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    assignedClass: 'All',
    department: 'Administration'
  },
  {
    id: 'user-003',
    name: 'Mrs. Sunita Maharjan',
    email: 'accountant@safeenglishschool.edu.np',
    role: ROLES.ACCOUNTANT,
    title: 'Senior Bursar & Accountant',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    assignedClass: 'None',
    department: 'Accounts & Finance'
  },
  {
    id: 'user-004',
    name: 'Mr. Dinesh Gautam',
    email: 'teacher@safeenglishschool.edu.np',
    role: ROLES.TEACHER,
    title: 'HOD Science & Class 10 Teacher',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    assignedClass: 'Class 10 A',
    department: 'Science & Technology'
  },
  {
    id: 'user-005',
    name: 'Aayush Thapa',
    email: 'student@safeenglishschool.edu.np',
    role: ROLES.STUDENT,
    title: 'Class 10 A (Roll No. 01)',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
    assignedClass: 'Class 10 A',
    studentId: 'std-001',
    admissionNo: 'SEBS-2075-012'
  },
  {
    id: 'user-006',
    name: 'Hari Prasad Thapa',
    email: 'parent@safeenglishschool.edu.np',
    role: ROLES.PARENT,
    title: 'Guardian of Aayush Thapa (Class 10 A)',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80',
    wardId: 'std-001',
    wardName: 'Aayush Thapa',
    assignedClass: 'Class 10 A'
  }
];

export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: ['dashboard', 'students', 'staff', 'academics', 'attendance', 'exams', 'fees', 'accounts', 'hr', 'notices', 'homework', 'idcards', 'reports', 'settings'],
  [ROLES.ADMIN]: ['dashboard', 'students', 'staff', 'academics', 'attendance', 'exams', 'fees', 'accounts', 'hr', 'notices', 'homework', 'idcards', 'reports', 'settings'],
  [ROLES.ACCOUNTANT]: ['dashboard', 'students', 'fees', 'accounts', 'reports', 'notices'],
  [ROLES.TEACHER]: ['dashboard', 'attendance', 'exams', 'homework', 'academics', 'notices'],
  [ROLES.STUDENT]: ['dashboard', 'homework', 'exams', 'attendance', 'notices', 'fees', 'idcards'],
  [ROLES.PARENT]: ['dashboard', 'attendance', 'exams', 'homework', 'fees', 'notices', 'idcards']
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('sebs_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name && parsed.name.toLowerCase().includes('bikash')) {
          parsed.name = 'Admin';
        }
        return parsed;
      }
      return DEMO_ACCOUNTS[0]; // Defaults to Super Admin
    } catch {
      return DEMO_ACCOUNTS[0];
    }
  });

  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Second Terminal Exam Starting Soon', time: '10 mins ago', read: false },
    { id: '2', title: 'Fee collection batch synced (NPR 45,000)', time: '1 hour ago', read: false },
    { id: '3', title: 'Daily attendance registered for Class 10 A', time: '3 hours ago', read: true }
  ]);

  useEffect(() => {
    try {
      if (currentUser) {
        sessionStorage.setItem('sebs_user', JSON.stringify(currentUser));
      } else {
        sessionStorage.removeItem('sebs_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  const login = (email, password) => {
    // Check if matching predefined demo user
    const matched = DEMO_ACCOUNTS.find(acc => acc.email.toLowerCase() === email.trim().toLowerCase());
    if (matched) {
      setCurrentUser(matched);
      return { success: true };
    }
    // Generic login validation
    if (email && password) {
      const genericUser = {
        id: 'user-custom',
        name: email.split('@')[0],
        email: email,
        role: ROLES.ADMIN,
        title: 'Staff Member',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        assignedClass: 'All',
        department: 'General'
      };
      setCurrentUser(genericUser);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const switchRole = (account) => {
    setCurrentUser(account);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const hasPermission = (moduleName) => {
    if (!currentUser) return false;
    const permissions = ROLE_PERMISSIONS[currentUser.role] || [];
    return permissions.includes(moduleName);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        switchRole,
        hasPermission,
        notifications,
        setNotifications
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
