-- 创建 enrollments 表（如果不存在）
CREATE TABLE IF NOT EXISTS enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT NOT NULL,
    course_id INT NOT NULL,
    student_id INT,
    enrollment_date DATE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 创建 student_course 关联表，用于记录学生与课程的多对多关系
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

-- 创建视图，用于获取课程的学生列表
CREATE OR REPLACE VIEW course_students AS
SELECT
    c.id AS course_id,
    c.name AS course_name,
    s.id AS student_id,
    s.name AS student_name,
    s.age AS student_age,
    s.parent AS student_parent,
    s.contact AS student_contact
FROM
    courses c
LEFT JOIN
    student_course sc ON c.id = sc.course_id
LEFT JOIN
    students s ON sc.student_id = s.id
WHERE
    sc.status = 'active';