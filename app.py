from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
import pymysql

app = Flask(__name__)
CORS(app)  # 启用CORS支持跨域请求

# 数据库连接配置
db_config = {
    'host': 'localhost',
    'user': 'root',
    'port': 33066,  # 修改为默认MySQL端口
    # 'password': 'Shilihao1230',  # 确认密码是否正确
    'password': '',  # 确认密码是否正确
    'database': 'project'
}

# 初始化数据库表
def init_db():
    try:
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
        
        # 检查students表是否存在，如果不存在则创建
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            date_of_birth DATE NOT NULL,
            id_number VARCHAR(50) NOT NULL,
            id_type VARCHAR(20) NOT NULL,
            grade VARCHAR(20) NOT NULL,
            location VARCHAR(100) NOT NULL,
            courses TEXT NOT NULL,
            parent_name VARCHAR(100) NOT NULL,
            parent_email VARCHAR(100) NOT NULL,
            parent_phone VARCHAR(20) NOT NULL,
            parent_id_number VARCHAR(50) NOT NULL,
            parent_id_type VARCHAR(20) NOT NULL,
            address TEXT,
            emergency_contact VARCHAR(20) NOT NULL,
            medical_info TEXT,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
        
        # 检查teachers表是否存在，如果不存在则创建
        cursor.execute("""
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
        )
        """)
        
        # 检查courses表是否存在，如果不存在则创建
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS courses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            level VARCHAR(50) NOT NULL,
            age_range VARCHAR(50) NOT NULL,
            location VARCHAR(100) NOT NULL,
            schedule VARCHAR(100) NOT NULL,
            time VARCHAR(100) NOT NULL,
            teacher VARCHAR(100) NOT NULL,
            max_students INT NOT NULL,
            fee VARCHAR(50) NOT NULL,
            description TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
        
        connection.commit()
        print("数据库表初始化成功")
    except Exception as e:
        print(f"数据库表初始化失败: {str(e)}")
    finally:
        cursor.close()
        connection.close()

@app.route('/signup', methods=['POST'])
def signup():
    try:
        # 获取JSON数据
        data = request.json
        if not data:
            return jsonify({"error": "没有接收到数据"}), 400
            
        # 从请求中提取数据
        user_type = data.get('userType')
        form_data = data.get('formData')
        
        if not user_type or not form_data:
            return jsonify({"error": "数据格式不正确"}), 400
            
        # 提取表单数据
        first_name = form_data.get('firstName')
        last_name = form_data.get('lastName')
        email = form_data.get('email')
        password = form_data.get('password')
        
        # 打印接收到的数据用于调试
        print(f"用户类型: {user_type}")
        print(f"表单数据: {form_data}")
        
        # 连接数据库
        connection = pymysql.connect(
            host=db_config['host'],
            user=db_config['user'],
            password=db_config['password'],
            port=db_config['port'],  # 添加端口参数
            database=db_config['database'],
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor,
            ssl={'fake': True}  # 绕过SSL验证要求
        )
        cursor = connection.cursor()
        
        try:
            if user_type == 'parent':
                child_name = form_data.get('childName')
                child_age = form_data.get('childAge')
                # 插入数据 - 修正列名格式
                sql = "INSERT INTO parent (`id`, `First_Name`, `Last_Name`, `Email_Address`, `Password`, `Child_Name`, `Child_Age`) VALUES (%s, %s, %s, %s, %s, %s, %s)"
                cursor.execute(sql, (0, first_name, last_name, email, password, child_name, child_age))
            elif user_type == 'teacher':
                subject = form_data.get('subject')
                experience = form_data.get('experience')
                # 插入数据 - 修正列名格式
                sql = "INSERT INTO teacher (`id`, `First_Name`, `Last_Name`, `Email_Address`, `Password`, `Subject`, `Experience`) VALUES (%s, %s, %s, %s, %s, %s, %s)"
                cursor.execute(sql, (0, first_name, last_name, email, password, subject, experience))
            else:
                return jsonify({"error": "不支持的用户类型"}), 400
                
            connection.commit()
            return jsonify({"message": "注册成功！"}), 200
            
        except Exception as e:
            connection.rollback()
            print(f"数据库错误: {str(e)}")
            return jsonify({"error": f"数据库错误: {str(e)}"}), 500
        finally:
            # 关闭连接
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"服务器错误: {str(e)}")
        return jsonify({"error": f"服务器错误: {str(e)}"}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        # 获取JSON数据
        data = request.json
        if not data:
            return jsonify({"error": "没有接收到数据"}), 400
            
        # 从请求中提取数据
        user_type = data.get('userType')
        email = data.get('email')
        password = data.get('password')
        
        if not user_type or not email or not password:
            return jsonify({"error": "数据格式不正确"}), 400
            
        # 打印接收到的数据用于调试
        print(f"登录尝试 - 用户类型: {user_type}, 邮箱: {email}， 密码: {password}")
        
        # 连接数据库
        connection = pymysql.connect(
            host=db_config['host'],
            user=db_config['user'],
            password=db_config['password'],
            port=db_config['port'],  # 添加端口参数
            database=db_config['database'],
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor,
            ssl={'fake': True}  # 绕过SSL验证要求
        )
        cursor = connection.cursor()
        
        try:
            # 根据用户类型查询相应的表
            if user_type == 'parent':
                sql = "SELECT * FROM parent WHERE Email_Address = %s AND Password = %s"
                cursor.execute(sql, (email, password))
                user = cursor.fetchone()
            elif user_type == 'teacher':
                sql = "SELECT * FROM teacher WHERE Email_Address = %s AND Password = %s"
                cursor.execute(sql, (email, password))
                user = cursor.fetchone()
            elif user_type == 'admin':
                sql = "SELECT * FROM admin WHERE Email_Address = %s AND Password = %s"
                cursor.execute(sql, (email, password))
                user = cursor.fetchone()
            else:
                return jsonify({"error": "不支持的用户类型"}), 400
                
            if user:
                # 用户验证成功
                # 注意：在实际生产环境中，应该使用会话或令牌进行身份验证
                return jsonify({
                    "message": "登录成功",
                    "user": {
                        "id": user['id'],
                        "firstName": user['First_Name'],
                        "lastName": user['Last_Name'],
                        "email": user['Email_Address'],
                        "userType": user_type
                    }
                }), 200
            else:
                # 用户验证失败
                return jsonify({"error": "邮箱或密码不正确"}), 401
                
        except Exception as e:
            print(f"数据库错误: {str(e)}")
            return jsonify({"error": f"数据库错误: {str(e)}"}), 500
        finally:
            # 关闭连接
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"服务器错误: {str(e)}")
        return jsonify({"error": f"服务器错误: {str(e)}"}), 500

@app.route('/students', methods=['POST'])
def add_student():
    try:
        # 获取JSON数据
        data = request.json
        if not data:
            return jsonify({"error": "没有接收到数据"}), 400
            
        # 打印接收到的数据用于调试
        print(f"接收到的学生数据: {data}")
        
        # 连接数据库
        connection = pymysql.connect(
            host=db_config['host'],
            user=db_config['user'],
            password=db_config['password'],
            port=db_config['port'],
            database=db_config['database'],
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor,
            ssl={'fake': True}  # 绕过SSL验证要求
        )
        cursor = connection.cursor()
        
        try:
            # 从请求中提取学生数据
            first_name = data.get('firstName')
            last_name = data.get('lastName')
            date_of_birth = data.get('dateOfBirth')
            id_number = data.get('idNumber')
            id_type = data.get('idType')
            grade = data.get('grade')
            location = data.get('location')
            courses = ','.join(data.get('courses', []))  # 将课程列表转换为逗号分隔的字符串
            
            # 家长信息
            parent_name = data.get('parentName')
            parent_email = data.get('parentEmail')
            parent_phone = data.get('parentPhone')
            parent_id_number = data.get('parentIdNumber')
            parent_id_type = data.get('parentIdType')
            
            # 其他信息
            address = data.get('address')
            emergency_contact = data.get('emergencyContact')
            medical_info = data.get('medicalInfo')
            notes = data.get('notes')
            
            # 插入数据到学生表
            sql = """
            INSERT INTO students (
                first_name, last_name, date_of_birth, id_number, id_type,
                grade, location, courses, parent_name, parent_email,
                parent_phone, parent_id_number, parent_id_type, address,
                emergency_contact, medical_info, notes
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            )
            """
            cursor.execute(sql, (
                first_name, last_name, date_of_birth, id_number, id_type,
                grade, location, courses, parent_name, parent_email,
                parent_phone, parent_id_number, parent_id_type, address,
                emergency_contact, medical_info, notes
            ))
                
            connection.commit()
            return jsonify({"message": "学生添加成功！"}), 200
            
        except Exception as e:
            connection.rollback()
            print(f"数据库错误: {str(e)}")
            return jsonify({"error": f"数据库错误: {str(e)}"}), 500
        finally:
            # 关闭连接
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"服务器错误: {str(e)}")
        return jsonify({"error": f"服务器错误: {str(e)}"}), 500

@app.route('/courses', methods=['POST'])
def add_course():
    try:
        # 获取JSON数据
        data = request.json
        if not data:
            return jsonify({"error": "没有接收到数据"}), 400
            
        # 打印接收到的数据用于调试
        print(f"接收到的课程数据: {data}")
        
        # 连接数据库
        connection = pymysql.connect(
            host=db_config['host'],
            user=db_config['user'],
            password=db_config['password'],
            port=db_config['port'],
            database=db_config['database'],
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor,
            ssl={'fake': True}  # 绕过SSL验证要求
        )
        cursor = connection.cursor()
        
        try:
            # 从请求中提取课程数据
            name = data.get('name')
            level = data.get('level')
            age_range = data.get('ageRange')
            location = data.get('location')
            schedule = data.get('schedule')
            time = data.get('time')
            teacher_id = data.get('teacher')  # 现在这是教师ID
            max_students = data.get('maxStudents')
            fee = data.get('fee')
            description = data.get('description')
            
            # 根据教师ID获取教师名称
            teacher_name = ""
            if teacher_id:
                sql_get_teacher = "SELECT CONCAT(first_name, ' ', last_name) as full_name FROM teachers WHERE id = %s"
                cursor.execute(sql_get_teacher, (teacher_id,))
                teacher_result = cursor.fetchone()
                if teacher_result:
                    teacher_name = teacher_result['full_name']
                else:
                    # 如果找不到教师，使用ID作为备用
                    teacher_name = f"Teacher ID: {teacher_id}"
            
            # 插入数据到课程表
            sql = """
            INSERT INTO courses (
                name, level, age_range, location, schedule,
                time, teacher, max_students, fee, description
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            )
            """
            cursor.execute(sql, (
                name, level, age_range, location, schedule,
                time, teacher_name, max_students, fee, description
            ))
                
            connection.commit()
            return jsonify({"message": "课程添加成功！"}), 200
            
        except Exception as e:
            connection.rollback()
            print(f"数据库错误: {str(e)}")
            return jsonify({"error": f"数据库错误: {str(e)}"}), 500
        finally:
            # 关闭连接
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"服务器错误: {str(e)}")
        return jsonify({"error": f"服务器错误: {str(e)}"}), 500

@app.route('/teachers', methods=['POST'])
def add_teacher():
    try:
        # 获取JSON数据
        data = request.json
        if not data:
            return jsonify({"error": "没有接收到数据"}), 400
            
        # 打印接收到的数据用于调试
        print(f"接收到的教师数据: {data}")
        
        # 连接数据库
        connection = pymysql.connect(
            host=db_config['host'],
            user=db_config['user'],
            password=db_config['password'],
            port=db_config['port'],
            database=db_config['database'],
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor,
            ssl={'fake': True}  # 绕过SSL验证要求
        )
        cursor = connection.cursor()
        
        try:
            # 从请求中提取教师数据
            first_name = data.get('firstName')
            last_name = data.get('lastName')
            email = data.get('email')
            phone = data.get('phone')
            id_number = data.get('idNumber')
            id_type = data.get('idType')
            location = data.get('location')
            courses = ','.join(data.get('courses', []))  # 将课程列表转换为逗号分隔的字符串
            qualifications = data.get('qualifications')
            experience = data.get('experience')
            join_date = data.get('joinDate')
            languages = data.get('languages')
            bio = data.get('bio', '')
            
            # 插入数据到教师表
            sql = """
            INSERT INTO teachers (
                first_name, last_name, email, phone, id_number, id_type,
                location, courses, qualifications, experience, join_date,
                languages, bio
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            )
            """
            cursor.execute(sql, (
                first_name, last_name, email, phone, id_number, id_type,
                location, courses, qualifications, experience, join_date,
                languages, bio
            ))
                
            connection.commit()
            return jsonify({"message": "教师添加成功！"}), 200
            
        except Exception as e:
            connection.rollback()
            print(f"数据库错误: {str(e)}")
            return jsonify({"error": f"数据库错误: {str(e)}"}), 500
        finally:
            # 关闭连接
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"服务器错误: {str(e)}")
        return jsonify({"error": f"服务器错误: {str(e)}"}), 500

@app.route('/courses/<int:course_id>', methods=['DELETE'])
def delete_course(course_id):
    try:
        # 连接数据库
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
        
        try:
            # 删除课程
            sql = "DELETE FROM courses WHERE id = %s"
            cursor.execute(sql, (course_id,))
            
            if cursor.rowcount == 0:
                return jsonify({"error": "未找到指定课程"}), 404
                
            connection.commit()
            return jsonify({"message": "课程删除成功"}), 200
            
        except Exception as e:
            connection.rollback()
            print(f"数据库错误: {str(e)}")
            return jsonify({"error": f"数据库错误: {str(e)}"}), 500
        finally:
            # 关闭连接
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"服务器错误: {str(e)}")
        return jsonify({"error": f"服务器错误: {str(e)}"}), 500

@app.route('/courses', methods=['GET'])
def get_courses():
    try:
        # 连接数据库
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
        
        try:
            # 查询所有课程
            sql = "SELECT * FROM courses"
            cursor.execute(sql)
            courses_data = cursor.fetchall()
            
            # 查询每个课程的已注册学生数量
            courses = []
            for course in courses_data:
                # 查询已注册该课程的学生数量
                sql = "SELECT COUNT(*) as count FROM students WHERE FIND_IN_SET(%s, courses)"
                cursor.execute(sql, (str(course['id'])))
                enrolled_count = cursor.fetchone()['count']
                
                # 转换数据格式以匹配前端需求
                courses.append({
                    'id': course['id'],
                    'name': course['name'],
                    'level': course['level'],
                    'ageRange': course['age_range'],
                    'location': course['location'],
                    'schedule': course['schedule'],
                    'time': course['time'],
                    'teacher': course['teacher'],
                    'enrolledStudents': enrolled_count,
                    'maxStudents': course['max_students'],
                    'fee': course['fee'],
                    'status': 'active'  # 默认所有课程都是活跃的
                })
                
            return jsonify(courses), 200
            
        except Exception as e:
            print(f"数据库错误: {str(e)}")
            return jsonify({"error": f"数据库错误: {str(e)}"}), 500
        finally:
            # 关闭连接
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"服务器错误: {str(e)}")
        return jsonify({"error": f"服务器错误: {str(e)}"}), 500

@app.route('/students', methods=['GET'])
def get_students():
    try:
        # 连接数据库
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
        
        try:
            # 查询所有学生
            sql = "SELECT * FROM students"
            cursor.execute(sql)
            students_data = cursor.fetchall()
            
            # 转换数据格式以匹配前端需求
            students = []
            for student in students_data:
                # 计算年龄（根据出生日期）
                from datetime import datetime
                birth_date = datetime.strptime(str(student['date_of_birth']), '%Y-%m-%d')
                today = datetime.today()
                age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
                
                # 将课程字符串转换为数组
                courses_list = student['courses'].split(',') if student['courses'] else []
                
                # 转换数据格式
                students.append({
                    'id': student['id'],
                    'name': f"{student['first_name']} {student['last_name']}",
                    'age': age,
                    'grade': student['grade'],
                    'location': student['location'],
                    'courses': courses_list,
                    'parent': student['parent_name'],
                    'contact': student['parent_phone'],
                    'joinDate': student['created_at'].strftime('%Y-%m-%d'),
                    'status': 'active'  # 默认所有学生都是活跃的
                })
                
            return jsonify(students), 200
            
        except Exception as e:
            print(f"数据库错误: {str(e)}")
            return jsonify({"error": f"数据库错误: {str(e)}"}), 500
        finally:
            # 关闭连接
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"服务器错误: {str(e)}")
        return jsonify({"error": f"服务器错误: {str(e)}"}), 500

@app.route('/teachers/<int:teacher_id>', methods=['DELETE'])
def delete_teacher(teacher_id):
    try:
        # 连接数据库
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
        
        try:
            # 删除教师
            sql = "DELETE FROM teachers WHERE id = %s"
            cursor.execute(sql, (teacher_id,))
            
            if cursor.rowcount == 0:
                return jsonify({"error": "未找到指定教师"}), 404
                
            connection.commit()
            return jsonify({"message": "教师删除成功"}), 200
            
        except Exception as e:
            connection.rollback()
            print(f"数据库错误: {str(e)}")
            return jsonify({"error": f"数据库错误: {str(e)}"}), 500
        finally:
            # 关闭连接
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"服务器错误: {str(e)}")
        return jsonify({"error": f"服务器错误: {str(e)}"}), 500

@app.route('/students/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    try:
        # 连接数据库
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
        
        try:
            # 删除学生
            sql = "DELETE FROM students WHERE id = %s"
            cursor.execute(sql, (student_id,))
            
            if cursor.rowcount == 0:
                return jsonify({"error": "未找到指定学生"}), 404
                
            connection.commit()
            return jsonify({"message": "学生删除成功"}), 200
            
        except Exception as e:
            connection.rollback()
            print(f"数据库错误: {str(e)}")
            return jsonify({"error": f"数据库错误: {str(e)}"}), 500
        finally:
            # 关闭连接
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"服务器错误: {str(e)}")
        return jsonify({"error": f"服务器错误: {str(e)}"}), 500

@app.route('/locations', methods=['GET'])
def get_locations():
    try:
        # 连接数据库
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
        
        try:
            # 查询所有不同的位置
            sql = "SELECT DISTINCT location FROM students"
            cursor.execute(sql)
            locations_data = cursor.fetchall()
            
            # 转换数据格式
            locations = []
            for idx, location in enumerate(locations_data):
                location_name = location['location']
                # 生成一个简单的ID
                location_id = ''.join(c.lower() for c in location_name if c.isalpha())[:3]
                locations.append({
                    'id': location_id,
                    'name': location_name
                })
                
            return jsonify(locations), 200
            
        except Exception as e:
            print(f"数据库错误: {str(e)}")
            return jsonify({"error": f"数据库错误: {str(e)}"}), 500
        finally:
            # 关闭连接
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"服务器错误: {str(e)}")
        return jsonify({"error": f"服务器错误: {str(e)}"}), 500

@app.route('/course-names', methods=['GET'])
def get_course_names():
    try:
        # 连接数据库
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
        
        try:
            # 查询所有课程
            sql = "SELECT id, name FROM courses"
            cursor.execute(sql)
            courses_data = cursor.fetchall()
            
            # 转换数据格式
            courses = []
            for course in courses_data:
                courses.append({
                    'id': str(course['id']),
                    'name': course['name']
                })
                
            return jsonify(courses), 200
            
        except Exception as e:
            print(f"数据库错误: {str(e)}")
            return jsonify({"error": f"数据库错误: {str(e)}"}), 500
        finally:
            # 关闭连接
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"服务器错误: {str(e)}")
        return jsonify({"error": f"服务器错误: {str(e)}"}), 500

@app.route('/teachers', methods=['GET'])
def get_teachers():
    try:
        # 连接数据库
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
        
        try:
            # 查询所有教师
            sql = "SELECT * FROM teachers"
            cursor.execute(sql)
            teachers_data = cursor.fetchall()
            
            # 转换数据格式以匹配前端需求
            teachers = []
            for teacher in teachers_data:
                # 将课程字符串转换为数组
                courses_list = teacher['courses'].split(',') if teacher['courses'] else []
                
                # 将资格证书字符串转换为数组
                qualifications_list = teacher['qualifications'].split(',') if teacher['qualifications'] else []
                
                # 转换数据格式
                teachers.append({
                    'id': teacher['id'],
                    'name': f"{teacher['first_name']} {teacher['last_name']}",
                    'location': teacher['location'],
                    'courses': courses_list,
                    'experience': teacher['experience'],
                    'qualifications': qualifications_list,
                    'contact': teacher['phone'],
                    'joinDate': teacher['join_date'].strftime('%Y-%m-%d'),
                    'status': 'active'  # 默认所有教师都是活跃的
                })
                
            return jsonify(teachers), 200
            
        except Exception as e:
            print(f"数据库错误: {str(e)}")
            return jsonify({"error": f"数据库错误: {str(e)}"}), 500
        finally:
            # 关闭连接
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"服务器错误: {str(e)}")
        return jsonify({"error": f"服务器错误: {str(e)}"}), 500

@app.route('/grades', methods=['GET'])
def get_grades():
    try:
        # 连接数据库
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
        
        try:
            # 查询所有不同的年级
            sql = "SELECT DISTINCT grade FROM students"
            cursor.execute(sql)
            grades_data = cursor.fetchall()
            
            # 提取年级列表
            grades = [grade['grade'] for grade in grades_data]
            
            # 如果数据库中没有年级数据，返回默认年级
            if not grades:
                grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6']
                
            return jsonify(grades), 200
            
        except Exception as e:
            print(f"数据库错误: {str(e)}")
            return jsonify({"error": f"数据库错误: {str(e)}"}), 500
        finally:
            # 关闭连接
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"服务器错误: {str(e)}")
        return jsonify({"error": f"服务器错误: {str(e)}"}), 500

@app.route('/admin/dashboard-stats', methods=['GET'])
def get_dashboard_stats():
    try:
        # 连接数据库
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
        
        try:
            # 获取学生总数
            cursor.execute("SELECT COUNT(*) as count FROM students")
            total_students = cursor.fetchone()['count']
            
            # 获取上个月学生总数，计算变化百分比
            from datetime import datetime, timedelta
            one_month_ago = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
            cursor.execute("SELECT COUNT(*) as count FROM students WHERE created_at < %s", (one_month_ago,))
            last_month_students = cursor.fetchone()['count'] or 1  # 避免除以零
            student_change_percent = round(((total_students - last_month_students) / last_month_students) * 100)
            student_change = f"+{student_change_percent}%" if student_change_percent > 0 else f"{student_change_percent}%"
            
            # 获取活跃课程数
            cursor.execute("SELECT COUNT(*) as count FROM courses")
            active_courses = cursor.fetchone()['count']
            
            # 获取上个月课程数，计算变化
            cursor.execute("SELECT COUNT(*) as count FROM courses WHERE created_at < %s", (one_month_ago,))
            last_month_courses = cursor.fetchone()['count'] or 0
            course_change = f"+{active_courses - last_month_courses}" if active_courses > last_month_courses else f"{active_courses - last_month_courses}"
            
            # 获取教师总数
            cursor.execute("SELECT COUNT(*) as count FROM teachers")
            total_teachers = cursor.fetchone()['count']
            
            # 获取上个月教师数，计算变化
            cursor.execute("SELECT COUNT(*) as count FROM teachers WHERE created_at < %s", (one_month_ago,))
            last_month_teachers = cursor.fetchone()['count'] or total_teachers
            teacher_change = f"+{total_teachers - last_month_teachers}" if total_teachers > last_month_teachers else f"{total_teachers - last_month_teachers}"
            
            # 获取今日课程数（这里需要根据实际情况调整，假设有一个课程表表格）
            # 由于没有课程表表格，这里使用一个估计值：每个课程每周上课一次
            today_weekday = datetime.now().weekday()  # 0-6，0是周一
            cursor.execute("SELECT COUNT(*) as count FROM courses WHERE schedule LIKE %s", (f"%{today_weekday}%",))
            classes_today_result = cursor.fetchone()
            classes_today = classes_today_result['count'] if classes_today_result else 0
            
            # 假设上周同一天的课程数
            last_week_classes = int(classes_today * 1.1)  # 假设比本周多10%
            classes_change = f"{classes_today - last_week_classes}"
            
            # 构建响应数据
            stats = {
                "totalStudents": {
                    "value": str(total_students),
                    "change": student_change,
                    "changeType": "increase" if student_change_percent > 0 else "decrease" if student_change_percent < 0 else "neutral"
                },
                "activeCourses": {
                    "value": str(active_courses),
                    "change": course_change,
                    "changeType": "increase" if active_courses > last_month_courses else "decrease" if active_courses < last_month_courses else "neutral"
                },
                "teachers": {
                    "value": str(total_teachers),
                    "change": teacher_change,
                    "changeType": "increase" if total_teachers > last_month_teachers else "decrease" if total_teachers < last_month_teachers else "neutral"
                },
                "classesToday": {
                    "value": str(classes_today),
                    "change": classes_change,
                    "changeType": "increase" if classes_today > last_week_classes else "decrease" if classes_today < last_week_classes else "neutral"
                }
            }
            
            return jsonify(stats), 200
            
        except Exception as e:
            print(f"数据库错误: {str(e)}")
            return jsonify({"error": f"数据库错误: {str(e)}"}), 500
        finally:
            # 关闭连接
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"服务器错误: {str(e)}")
        return jsonify({"error": f"服务器错误: {str(e)}"}), 500

if __name__ == '__main__':
    # 初始化数据库表
    init_db()
    app.run(port=9999, debug=True, host='0.0.0.0')