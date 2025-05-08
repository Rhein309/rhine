-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS project;
USE project;

-- 创建课程表
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    schedule VARCHAR(100),
    time VARCHAR(100),
    location VARCHAR(100)
);

-- 创建学生表
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    parent VARCHAR(100) NOT NULL,
    contact VARCHAR(50) NOT NULL,
    course_id INT,
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- 创建成绩表
CREATE TABLE IF NOT EXISTS grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    course VARCHAR(100) NOT NULL,
    course_id VARCHAR(50) NOT NULL,
    type ENUM('quiz', 'exam', 'assignment', 'homework') NOT NULL,
    title VARCHAR(255) NOT NULL,
    student VARCHAR(100) NOT NULL,
    student_id INT NOT NULL,
    score INT NOT NULL,
    max_score INT NOT NULL,
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入示例课程数据
INSERT INTO courses (id, name, schedule, time, location) VALUES
('phonics', 'Phonics Foundation', 'Mon, Wed, Fri', '10:00 AM - 11:00 AM', 'Room 101'),
('readers', 'Young Readers', 'Tue, Thu', '11:30 AM - 12:30 PM', 'Online');

-- 插入示例学生数据
INSERT INTO students (id, name, age, parent, contact, course_id) VALUES
(1, 'Emily Wong', 7, 'Sarah Wong', '+852 9876 5432', 'phonics'),
(2, 'Thomas Chan', 6, 'David Chan', '+852 9876 1234', 'phonics'),
(3, 'Sophie Lee', 7, 'Michelle Lee', '+852 9876 7890', 'phonics'),
(4, 'Jason Lam', 8, 'Peter Lam', '+852 9876 4321', 'readers'),
(5, 'Alice Chen', 8, 'Mary Chen', '+852 9876 8765', 'readers');

-- 插入示例成绩数据
INSERT INTO grades (date, course, course_id, type, title, student, student_id, score, max_score, feedback) VALUES
('2025-01-15', 'Phonics Foundation', 'phonics', 'quiz', 'Week 3 Quiz', 'Emily Wong', 1, 95, 100, 'Excellent understanding of short vowel sounds'),
('2025-01-14', 'Young Readers', 'readers', 'homework', 'Reading Comprehension Exercise', 'Thomas Chan', 2, 85, 100, 'Good work on main idea identification');