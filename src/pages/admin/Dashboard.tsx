import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, School, Calendar } from 'lucide-react';

// 定义API返回的统计数据类型
interface StatData {
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
}

interface DashboardStats {
  totalStudents: StatData;
  activeCourses: StatData;
  teachers: StatData;
  classesToday: StatData;
}

// 定义前端使用的统计卡片类型
interface StatCard {
  name: string;
  value: string;
  icon: React.FC<any>;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  link: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatCard[]>([]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:9999/admin/dashboard-stats');
        
        if (!response.ok) {
          throw new Error(`API请求失败: ${response.status}`);
        }
        
        const data: DashboardStats = await response.json();
        
        // 将API数据转换为前端使用的格式
        const statsData: StatCard[] = [
          {
            name: 'Total Students',
            value: data.totalStudents.value,
            icon: Users,
            change: data.totalStudents.change,
            changeType: data.totalStudents.changeType,
            link: '/admin/students'
          },
          {
            name: 'Active Courses',
            value: data.activeCourses.value,
            icon: BookOpen,
            change: data.activeCourses.change,
            changeType: data.activeCourses.changeType,
            link: '/admin/courses'
          },
          {
            name: 'Teachers',
            value: data.teachers.value,
            icon: School,
            change: data.teachers.change,
            changeType: data.teachers.changeType,
            link: '/admin/teachers'
          },
          {
            name: 'Classes Today',
            value: data.classesToday.value,
            icon: Calendar,
            change: data.classesToday.change,
            changeType: data.classesToday.changeType,
            link: '/admin/courses'
          }
        ];
        
        setStats(statsData);
        setError(null);
      } catch (err) {
        console.error('获取仪表板数据失败:', err);
        setError('获取数据失败，请稍后再试');
        // 使用默认数据作为备份
        setStats([
          {
            name: 'Total Students',
            value: '0',
            icon: Users,
            change: '0%',
            changeType: 'neutral',
            link: '/admin/students'
          },
          {
            name: 'Active Courses',
            value: '0',
            icon: BookOpen,
            change: '0',
            changeType: 'neutral',
            link: '/admin/courses'
          },
          {
            name: 'Teachers',
            value: '0',
            icon: School,
            change: '0',
            changeType: 'neutral',
            link: '/admin/teachers'
          },
          {
            name: 'Classes Today',
            value: '0',
            icon: Calendar,
            change: '0',
            changeType: 'neutral',
            link: '/admin/courses'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardStats();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="bg-white rounded-lg p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200"
                onClick={() => navigate(stat.link)}
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="w-8 h-8 text-purple-600" />
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' :
                    stat.changeType === 'decrease' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600">{stat.name}</p>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              {/* Add activity content here */}
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">System Status</h2>
              {/* Add status content here */}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;