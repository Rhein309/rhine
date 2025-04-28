// Temporary mock implementation until backend is set up
export type UserType = 'parent' | 'teacher' | 'admin';

export interface Profile {
  id: string;
  user_type: UserType;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
}

// Mock users for testing
const mockUsers = {
  'skkaur2003@gmail.com': {
    password: 'Sk@24681379',
    profiles: {
      teacher: {
        id: '123',
        user_type: 'teacher',
        first_name: 'Teacher',
        last_name: 'User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      parent: {
        id: '124',
        user_type: 'parent',
        first_name: 'Parent',
        last_name: 'User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      admin: {
        id: '125',
        user_type: 'admin',
        first_name: 'Admin',
        last_name: 'User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }
  }
};

export async function signUp(email: string, password: string, userType: UserType, firstName: string, lastName: string) {
  const profile = {
    id: Math.random().toString(36).substr(2, 9),
    user_type: userType,
    first_name: firstName,
    last_name: lastName,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  if (!mockUsers[email]) {
    mockUsers[email] = {
      password,
      profiles: {
        [userType]: profile
      }
    };
  } else {
    mockUsers[email].profiles[userType] = profile;
  }
  
  localStorage.setItem('user', JSON.stringify({ email, profile }));
  return { user: { email }, profile };
}

export async function signIn(email: string, password: string, userType?: UserType) {
  const mockUser = mockUsers[email as keyof typeof mockUsers];
  
  if (mockUser && mockUser.password === password) {
    // For the demo email, allow selecting any profile type
    if (email === 'skkaur2003@gmail.com') {
      const profile = mockUser.profiles[userType || 'teacher'];
      localStorage.setItem('user', JSON.stringify({ email, profile }));
      return { user: { email }, profile };
    }
    
    // For other users, use their single profile
    const profile = Object.values(mockUser.profiles)[0];
    localStorage.setItem('user', JSON.stringify({ email, profile }));
    return { user: { email }, profile };
  }
  
  throw new Error('Invalid credentials');
}

export async function signOut() {
  localStorage.removeItem('user');
  window.location.href = '/';
}

export async function getProfile(): Promise<Profile | null> {
  const userData = localStorage.getItem('user');
  if (!userData) return null;
  return JSON.parse(userData).profile;
}