import pymysql
import datetime

# 数据库连接配置
db_config = {
    'host': 'localhost',
    'user': 'root',
    'port': 33066,
    'password': '',
    'database': 'project'
}

def init_database():
    try:
        # 连接到数据库
        connection = pymysql.connect(
            host=db_config['host'],
            user=db_config['user'],
            password=db_config['password'],
            port=db_config['port'],
            database=db_config['database'],
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor,
            ssl={'fake': True}
        )
        cursor = connection.cursor()
        
        # 删除现有表（如果存在）
        cursor.execute("DROP TABLE IF EXISTS grades")
        cursor.execute("DROP TABLE IF EXISTS students")
        cursor.execute("DROP TABLE IF EXISTS student_course")
        cursor.execute("DROP TABLE IF EXISTS enrollments")
        cursor.execute("DROP TABLE IF EXISTS courses")
        
        print("已删除现有表")
        
        # 创建课程表
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS courses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            schedule VARCHAR(100),
            time VARCHAR(100),
            location VARCHAR(100)
        )
        """)
        
        # 创建学生表
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            age INT NOT NULL,
            parent VARCHAR(100) NOT NULL,
            contact VARCHAR(50) NOT NULL,
            course_id INT,
            FOREIGN KEY (course_id) REFERENCES courses(id)
        )
        """)
        
        # 创建成绩表
        cursor.execute("""
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
        )
        """)
        
        # 插入示例课程数据
        courses = [
            ('Phonics Foundation', 'Mon, Wed, Fri', '10:00 AM - 11:00 AM', 'Room 101'),
            ('Young Readers', 'Tue, Thu', '11:30 AM - 12:30 PM', 'Online')
        ]
        
        course_ids = {}  # 用于存储课程名称和ID的映射
        
        for course in courses:
            try:
                cursor.execute("""
                INSERT INTO courses (name, schedule, time, location)
                VALUES (%s, %s, %s, %s)
                """, course)
                # 获取自动生成的ID
                course_id = cursor.lastrowid
                course_ids[course[0]] = course_id
            except pymysql.err.IntegrityError:
                print(f"课程 {course[0]} 已存在，跳过插入")
                # 查询已存在课程的ID
                cursor.execute("SELECT id FROM courses WHERE name = %s", (course[0],))
                result = cursor.fetchone()
                if result:
                    course_ids[course[0]] = result['id']
        
        # 插入示例学生数据
        students = [
            (1, 'Emily Wong', 7, 'Sarah Wong', '+852 9876 5432', course_ids.get('Phonics Foundation')),
            (2, 'Thomas Chan', 6, 'David Chan', '+852 9876 1234', course_ids.get('Phonics Foundation')),
            (3, 'Sophie Lee', 7, 'Michelle Lee', '+852 9876 7890', course_ids.get('Phonics Foundation')),
            (4, 'Jason Lam', 8, 'Peter Lam', '+852 9876 4321', course_ids.get('Young Readers')),
            (5, 'Alice Chen', 8, 'Mary Chen', '+852 9876 8765', course_ids.get('Young Readers'))
        ]
        
        for student in students:
            try:
                cursor.execute("""
                INSERT INTO students (id, name, age, parent, contact, course_id)
                VALUES (%s, %s, %s, %s, %s, %s)
                """, student)
            except pymysql.err.IntegrityError:
                print(f"学生 {student[1]} 已存在，跳过插入")
        
        # 插入示例成绩数据
        grades = [
            ('2025-01-15', 'Phonics Foundation', course_ids.get('Phonics Foundation'), 'quiz', 'Week 3 Quiz', 'Emily Wong', 1, 95, 100, 'Excellent understanding of short vowel sounds'),
            ('2025-01-14', 'Young Readers', course_ids.get('Young Readers'), 'homework', 'Reading Comprehension Exercise', 'Thomas Chan', 2, 85, 100, 'Good work on main idea identification')
        ]
        
        for grade in grades:
            cursor.execute("""
            INSERT INTO grades (date, course, course_id, type, title, student, student_id, score, max_score, feedback)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, grade)
        
        connection.commit()
        print("数据库初始化成功！")
        
    except Exception as e:
        print(f"数据库初始化失败: {str(e)}")
    finally:
        cursor.close()
        connection.close()

if __name__ == "__main__":
    init_database()