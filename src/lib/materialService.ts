// 模拟课程资料服务
import { getProfile } from './supabase';

export interface Material {
  id: string;
  title: string;
  courseId: string;
  week: string;
  type: string;
  format: string;
  teacher: string;
  uploadDate: string;
  fileSize: string;
  filePath: string;
  notes?: string;
  assignedTo: string;
}

// 模拟存储
let materials: Material[] = [
  {
    id: '1',
    title: 'Phonics Worksheet - Short Vowels',
    courseId: 'phonics',
    week: 'week-1',
    type: 'homework',
    format: 'pdf',
    teacher: 'Ms. Sarah',
    uploadDate: '2025-01-15',
    fileSize: '2.4 MB',
    filePath: '/mock/files/phonics_worksheet.pdf',
    assignedTo: 'All Students'
  },
  {
    id: '2',
    title: 'Vocabulary List - Animals',
    courseId: 'readers',
    week: 'week-1',
    type: 'notes',
    format: 'xlsx',
    teacher: 'Mr. John',
    uploadDate: '2025-01-14',
    fileSize: '1.8 MB',
    filePath: '/mock/files/vocabulary_list.xlsx',
    assignedTo: 'All Students'
  },
  {
    id: '3',
    title: 'Quiz Review - Consonant Blends',
    courseId: 'phonics',
    week: 'week-2',
    type: 'quiz',
    format: 'pdf',
    teacher: 'Ms. Sarah',
    uploadDate: '2025-01-13',
    fileSize: '3.1 MB',
    filePath: '/mock/files/quiz_review.pdf',
    assignedTo: 'All Students'
  }
];

// 获取所有课程资料
export async function getAllMaterials(): Promise<Material[]> {
  return materials;
}

// 获取特定课程的资料
export async function getMaterialsByCourse(courseId: string): Promise<Material[]> {
  return materials.filter(material => material.courseId === courseId);
}

// 获取特定周的资料
export async function getMaterialsByWeek(week: string): Promise<Material[]> {
  return materials.filter(material => material.week === week);
}

// 上传新资料
export async function uploadMaterial(materialData: Omit<Material, 'id' | 'uploadDate' | 'fileSize'>): Promise<Material> {
  const profile = await getProfile();
  if (!profile) {
    throw new Error('User not authenticated');
  }

  if (profile.user_type !== 'teacher' && profile.user_type !== 'admin') {
    throw new Error('Only teachers and admins can upload materials');
  }

  const newMaterial: Material = {
    ...materialData,
    id: Math.random().toString(36).substr(2, 9),
    uploadDate: new Date().toISOString().split('T')[0],
    fileSize: `${(Math.random() * 5 + 1).toFixed(1)} MB`, // 模拟文件大小
  };

  materials.push(newMaterial);
  return newMaterial;
}

// 删除资料
export async function deleteMaterial(id: string): Promise<void> {
  const profile = await getProfile();
  if (!profile) {
    throw new Error('User not authenticated');
  }

  if (profile.user_type !== 'teacher' && profile.user_type !== 'admin') {
    throw new Error('Only teachers and admins can delete materials');
  }

  materials = materials.filter(material => material.id !== id);
}

// 模拟文件上传函数
export async function uploadFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    // 模拟上传延迟
    setTimeout(() => {
      // 返回模拟的文件路径
      resolve(`/mock/files/${file.name}`);
    }, 1000);
  });
}

// 模拟文件下载函数
export async function downloadFile(filePath: string, fileName: string): Promise<void> {
  // 在实际应用中，这里会从Supabase存储中获取文件并触发下载
  // 这里我们只是模拟这个过程
  console.log(`Downloading file: ${fileName} from path: ${filePath}`);
  
  // 创建一个模拟的下载链接
  const link = document.createElement('a');
  link.href = '#';
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // 显示下载成功消息
  alert(`文件 ${fileName} 下载已开始`);
}