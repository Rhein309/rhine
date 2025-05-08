-- 创建 teachers 表（如果不存在）
CREATE TABLE IF NOT EXISTS teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    id_number VARCHAR(50) NOT NULL,
    id_type VARCHAR(20) NOT NULL,
    location VARCHAR(100) NOT NULL,
    courses TEXT NOT NULL,
    qualifications VARCHAR(255) NOT NULL,
    experience VARCHAR(50) NOT NULL,
    join_date DATE NOT NULL,
    languages VARCHAR(255) NOT NULL,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入示例教师数据
INSERT INTO teachers (first_name, last_name, email, phone, id_number, id_type, location, courses, qualifications, experience, join_date, languages, bio)
VALUES 
('John', 'Smith', 'john.smith@example.com', '+852 9123 4567', 'T12345', 'HKID', 'Tsz Wan Shan Centre', '1,2', 'TESOL,CELTA', '5 years', '2024-01-15', 'English,Cantonese', 'Experienced English teacher specializing in phonics and reading.'),
('Mary', 'Wong', 'mary.wong@example.com', '+852 9876 5432', 'T67890', 'HKID', 'Tseung Kwan O Centre', '2,3', 'MA Education,PGDE', '8 years', '2023-08-10', 'English,Cantonese,Mandarin', 'Passionate about teaching young learners with interactive methods.');

-- 更新 courses 表结构（如果需要）
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS level VARCHAR(50) DEFAULT 'Intermediate',
ADD COLUMN IF NOT EXISTS age_range VARCHAR(50) DEFAULT '6-10 years',
ADD COLUMN IF NOT EXISTS teacher VARCHAR(100) DEFAULT 'John Smith',
ADD COLUMN IF NOT EXISTS max_students INT DEFAULT 15,
ADD COLUMN IF NOT EXISTS fee VARCHAR(50) DEFAULT 'HK$2,000/month',
ADD COLUMN IF NOT EXISTS description TEXT DEFAULT 'Course description',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
MODIFY COLUMN id INT AUTO_INCREMENT;

-- 更新现有课程数据
UPDATE courses SET 
    level = 'Beginner',
    age_range = '5-7 years',
    teacher = 'John Smith',
    max_students = 10,
    fee = 'HK$1,800/month',
    description = 'Foundation course for learning phonics and basic reading skills.'
WHERE name = 'Phonics Foundation';

UPDATE courses SET 
    level = 'Intermediate',
    age_range = '7-9 years',
    teacher = 'Mary Wong',
    max_students = 8,
    fee = 'HK$2,200/month',
    description = 'Reading course for developing comprehension and vocabulary.'
WHERE name = 'Young Readers';

-- 添加更多课程
INSERT INTO courses (name, level, age_range, location, schedule, time, teacher, max_students, fee, description)
VALUES 
('Grammar Masters', 'Advanced', '9-12 years', 'Tsz Wan Shan Centre', 'Tue, Thu', '4:00 PM - 5:30 PM', 'John Smith', 12, 'HK$2,500/month', 'Advanced grammar and writing skills for upper primary students.');

-- 更新 students 表结构（如果需要）
ALTER TABLE students
ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS id_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS id_type VARCHAR(20),
ADD COLUMN IF NOT EXISTS grade VARCHAR(20),
ADD COLUMN IF NOT EXISTS location VARCHAR(100),
ADD COLUMN IF NOT EXISTS courses TEXT,
ADD COLUMN IF NOT EXISTS parent_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS parent_email VARCHAR(100),
ADD COLUMN IF NOT EXISTS parent_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS parent_id_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS parent_id_type VARCHAR(20),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact VARCHAR(20),
ADD COLUMN IF NOT EXISTS medical_info TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 更新现有学生数据
UPDATE students SET 
    first_name = SUBSTRING_INDEX(name, ' ', 1),
    last_name = SUBSTRING_INDEX(name, ' ', -1),
    date_of_birth = DATE_SUB(CURRENT_DATE, INTERVAL age YEAR),
    id_number = CONCAT('S', id),
    id_type = 'HKID',
    grade = CONCAT('Grade ', FLOOR(1 + (age - 5) / 1)),
    location = 'Tsz Wan Shan Centre',
    courses = '1,2',
    parent_name = parent,
    parent_email = CONCAT(LOWER(REPLACE(parent, ' ', '.')), '@example.com'),
    parent_phone = contact,
    parent_id_number = CONCAT('P', id),
    parent_id_type = 'HKID',
    address = 'Hong Kong',
    emergency_contact = contact,
    medical_info = 'None',
    notes = 'Regular student'
WHERE id > 0;

-- 创建 student_course 关联表（如果不存在）
CREATE TABLE IF NOT EXISTS student_course (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    enrollment_date DATE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_course (student_id, course_id)
);

-- 插入学生-课程关联数据
INSERT IGNORE INTO student_course (student_id, course_id, status)
VALUES 
(1, 1, 'active'),
(2, 1, 'active'),
(3, 1, 'active'),
(4, 2, 'active'),
(5, 2, 'active'),
(1, 2, 'active'),
(2, 3, 'active');

-- 创建 grades 表（如果不存在）
CREATE TABLE IF NOT EXISTS grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    course VARCHAR(100) NOT NULL,
    course_id INT NOT NULL,
    type ENUM('quiz', 'exam', 'assignment', 'homework') NOT NULL,
    title VARCHAR(255) NOT NULL,
    student VARCHAR(100) NOT NULL,
    student_id INT NOT NULL,
    score INT NOT NULL,
    max_score INT NOT NULL,
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入示例成绩数据
INSERT INTO grades (date, course, course_id, type, title, student, student_id, score, max_score, feedback)
VALUES 
('2025-01-15', 'Phonics Foundation', 1, 'quiz', 'Week 3 Quiz', 'Emily Wong', 1, 95, 100, 'Excellent understanding of short vowel sounds'),
('2025-01-14', 'Young Readers', 2, 'homework', 'Reading Comprehension Exercise', 'Thomas Chan', 2, 85, 100, 'Good work on main idea identification'),
('2025-01-20', 'Grammar Masters', 3, 'exam', 'Mid-term Test', 'Sophie Lee', 3, 90, 100, 'Strong grammar skills, needs work on punctuation');