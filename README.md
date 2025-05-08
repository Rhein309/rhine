# 教育管理系统 - 成绩模块

这个项目实现了一个教育管理系统的成绩管理模块，包括前端界面和后端API。

## 功能特点

- 查看学生成绩列表
- 按课程、评估类型和学生名称筛选成绩
- 添加单个学生成绩
- 批量添加多个学生成绩
- 成绩排序功能

## 技术栈

- 前端：React + TypeScript + Tailwind CSS
- 后端：Python Flask
- 数据库：MySQL

## 项目结构

```
├── app.py                 # 后端Flask应用
├── init_db.py             # 数据库初始化脚本
├── test_api.py            # API测试脚本
└── src/
    └── pages/
        └── teacher/
            └── GradesPage.tsx  # 成绩管理前端页面
```

## 数据库设计

项目使用了以下数据表：

1. **courses** - 存储课程信息
   - id: 课程ID
   - name: 课程名称
   - schedule: 课程安排
   - time: 上课时间
   - location: 上课地点

2. **students** - 存储学生信息
   - id: 学生ID
   - name: 学生姓名
   - age: 学生年龄
   - parent: 家长姓名
   - contact: 联系方式
   - course_id: 所属课程ID

3. **grades** - 存储成绩信息
   - id: 成绩ID
   - date: 评估日期
   - course: 课程名称
   - course_id: 课程ID
   - type: 评估类型（quiz, exam, assignment, homework）
   - title: 评估标题
   - student: 学生姓名
   - student_id: 学生ID
   - score: 得分
   - max_score: 满分
   - feedback: 反馈意见
   - created_at: 创建时间

## 安装与设置

### 前提条件

- Python 3.8+
- MySQL 5.7+
- Node.js 14+
- npm 6+

### 后端设置

1. 安装Python依赖：

```bash
pip install flask flask-cors pymysql
```

2. 配置数据库连接：

编辑`app.py`中的`db_config`变量，设置正确的数据库连接信息：

```python
db_config = {
    'host': 'localhost',
    'user': 'root',
    'port': 33066,  # 根据你的MySQL端口进行修改
    'password': '',  # 设置你的MySQL密码
    'database': 'project'
}
```

3. 初始化数据库：

```bash
python init_db.py
```

4. 启动后端服务器：

```bash
python app.py
```

服务器将在 http://localhost:9999 上运行。

### 前端设置

1. 安装前端依赖：

```bash
npm install
```

2. 启动前端开发服务器：

```bash
npm run dev
```

前端将在 http://localhost:5173 上运行。

## API端点

### 获取课程列表

```
GET /courses
```

### 获取成绩列表

```
GET /grades
```

### 添加单个成绩

```
POST /grades
```

请求体示例：

```json
{
  "date": "2025-01-20",
  "course": "Phonics Foundation",
  "courseId": "phonics",
  "type": "exam",
  "title": "Midterm Exam",
  "student": "Sophie Lee",
  "studentId": 3,
  "score": 92,
  "maxScore": 100,
  "feedback": "Excellent performance on consonant blends"
}
```

### 批量添加成绩

```
POST /grades/batch
```

请求体示例：

```json
[
  {
    "date": "2025-01-25",
    "course": "Young Readers",
    "courseId": "readers",
    "type": "quiz",
    "title": "Vocabulary Quiz",
    "student": "Jason Lam",
    "studentId": 4,
    "score": 88,
    "maxScore": 100,
    "feedback": "Good vocabulary knowledge"
  },
  {
    "date": "2025-01-25",
    "course": "Young Readers",
    "courseId": "readers",
    "type": "quiz",
    "title": "Vocabulary Quiz",
    "student": "Alice Chen",
    "studentId": 5,
    "score": 94,
    "maxScore": 100,
    "feedback": "Excellent vocabulary range"
  }
]
```

## 测试API

使用提供的测试脚本测试API端点：

```bash
python test_api.py
```

## 许可证

MIT