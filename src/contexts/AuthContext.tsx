import React, { createContext, useContext, useEffect, useState } from 'react';

// 用户类型定义
export type UserType = 'parent' | 'teacher' | 'admin';

// 用户信息接口
export interface Profile {
  id: string;
  user_type: UserType;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
}

// 用户接口
interface User {
  email: string;
}

// 认证上下文接口
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  logout: () => Promise<void>;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  logout: async () => {}
});

// 认证提供者组件
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // 在组件挂载时从 localStorage 读取用户数据
  useEffect(() => {
    // 检查 localStorage 中的用户数据
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const { email, profile } = JSON.parse(userData);
        setUser({ email });
        setProfile(profile);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        // 如果解析失败，清除 localStorage 中的用户数据
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // 登出函数
  const logout = async () => {
    // 清除 localStorage 中的用户数据
    localStorage.removeItem('user');
    // 更新状态
    setUser(null);
    setProfile(null);
    // 重定向到首页
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义 hook 用于访问认证上下文
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};