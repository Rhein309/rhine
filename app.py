from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
import pymysql

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Database connection configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'port': 33066,  # Modified to default MySQL port
    # 'password': 'Shilihao1230',  # Verify if password is correct
    'password': '',  # Verify if password is correct
    'database': 'project'
}

# Initialize database tables
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
        
        # Check if students table exists, create if not
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
        
        # Check if teachers table exists, create if not
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
        
        # Check if courses table exists, create if not
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
        
        # Check if enrollments table exists, create if not
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS enrollments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            parent_id INT NOT NULL,
            course_id INT NOT NULL,
            enrollment_date DATE DEFAULT CURRENT_TIMESTAMP,
            status VARCHAR(20) DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
        )
        """)
        
        connection.commit()
        print("Database tables initialized successfully")
    except Exception as e:
        print(f"Database tables initialization failed: {str(e)}")
    finally:
        cursor.close()
        connection.close()

@app.route('/signup', methods=['POST'])
def signup():
    try:
        # Get JSON data
        data = request.json
        if not data:
            return jsonify({"error": "No data received"}), 400
            
        # Extract data from request
        user_type = data.get('userType')
        form_data = data.get('formData')
        
        if not user_type or not form_data:
            return jsonify({"error": "Incorrect data format"}), 400
            
        # Extract form data
        first_name = form_data.get('firstName')
        last_name = form_data.get('lastName')
        email = form_data.get('email')
        password = form_data.get('password')
        
        # Print received data for debugging
        print(f"User type: {user_type}")
        print(f"Form data: {form_data}")
        
        # Connect to database
        connection = pymysql.connect(
            host=db_config['host'],
            user=db_config['user'],
            password=db_config['password'],
            port=db_config['port'],  # 添加端口参数
            database=db_config['database'],
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor,
            ssl={'fake': True}  # Bypass SSL verification requirement
        )
        cursor = connection.cursor()
        
        try:
            if user_type == 'parent':
                child_name = form_data.get('childName')
                child_age = form_data.get('childAge')
                # Insert data - Fix column name format
                sql = "INSERT INTO parent (`id`, `First_Name`, `Last_Name`, `Email_Address`, `Password`, `Child_Name`, `Child_Age`) VALUES (%s, %s, %s, %s, %s, %s, %s)"
                cursor.execute(sql, (0, first_name, last_name, email, password, child_name, child_age))
            elif user_type == 'teacher':
                subject = form_data.get('subject')
                experience = form_data.get('experience')
                # Insert data - Fix column name format
                sql = "INSERT INTO teacher (`id`, `First_Name`, `Last_Name`, `Email_Address`, `Password`, `Subject`, `Experience`) VALUES (%s, %s, %s, %s, %s, %s, %s)"
                cursor.execute(sql, (0, first_name, last_name, email, password, subject, experience))
            else:
                return jsonify({"error": "Unsupported user type"}), 400
                
            connection.commit()
            return jsonify({"message": "Registration successful!"}), 200
            
        except Exception as e:
            connection.rollback()
            print(f"Database error: {str(e)}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        finally:
            # Close connection
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"Server error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        # Get JSON data
        data = request.json
        if not data:
            return jsonify({"error": "No data received"}), 400
            
        # Extract data from request
        user_type = data.get('userType')
        email = data.get('email')
        password = data.get('password')
        
        if not user_type or not email or not password:
            return jsonify({"error": "Incorrect data format"}), 400
            
        # Print received data for debugging
        print(f"Login attempt - User type: {user_type}, Email: {email}, Password: {password}")
        
        # Connect to database
        connection = pymysql.connect(
            host=db_config['host'],
            user=db_config['user'],
            password=db_config['password'],
            port=db_config['port'],  # 添加端口参数
            database=db_config['database'],
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor,
            ssl={'fake': True}  # Bypass SSL verification requirement
        )
        cursor = connection.cursor()
        
        try:
            # Query the appropriate table based on user type
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
                return jsonify({"error": "Unsupported user type"}), 400
                
            if user:
                # User authentication successful
                # Note: In a production environment, sessions or tokens should be used for authentication
                return jsonify({
                    "message": "Login successful",
                    "user": {
                        "id": user['id'],
                        "firstName": user['First_Name'],
                        "lastName": user['Last_Name'],
                        "email": user['Email_Address'],
                        "userType": user_type
                    }
                }), 200
            else:
                # User authentication failed
                return jsonify({"error": "Incorrect email or password"}), 401
                
        except Exception as e:
            print(f"Database error: {str(e)}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        finally:
            # Close connection
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"Server error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/students', methods=['POST'])
def add_student():
    try:
        # Get JSON data
        data = request.json
        if not data:
            return jsonify({"error": "No data received"}), 400
            
        # Print received data for debugging
        print(f"Received student data: {data}")
        
        # Connect to database
        connection = pymysql.connect(
            host=db_config['host'],
            user=db_config['user'],
            password=db_config['password'],
            port=db_config['port'],
            database=db_config['database'],
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor,
            ssl={'fake': True}  # Bypass SSL verification requirement
        )
        cursor = connection.cursor()
        
        try:
            # Extract student data from request
            first_name = data.get('firstName')
            last_name = data.get('lastName')
            date_of_birth = data.get('dateOfBirth')
            id_number = data.get('idNumber')
            id_type = data.get('idType')
            grade = data.get('grade')
            location = data.get('location')
            courses = ','.join(data.get('courses', []))  # Convert course list to comma-separated string
            
            # Parent information
            parent_name = data.get('parentName')
            parent_email = data.get('parentEmail')
            parent_phone = data.get('parentPhone')
            parent_id_number = data.get('parentIdNumber')
            parent_id_type = data.get('parentIdType')
            
            # Other information
            address = data.get('address')
            emergency_contact = data.get('emergencyContact')
            medical_info = data.get('medicalInfo')
            notes = data.get('notes')
            
            # Insert data into students table
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
            return jsonify({"message": "Student added successfully!"}), 200
            
        except Exception as e:
            connection.rollback()
            print(f"Database error: {str(e)}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        finally:
            # Close connection
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"Server error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/courses', methods=['POST'])
def add_course():
    try:
        # Get JSON data
        data = request.json
        if not data:
            return jsonify({"error": "No data received"}), 400
            
        # Print received data for debugging
        print(f"Received course data: {data}")
        
        # Connect to database
        connection = pymysql.connect(
            host=db_config['host'],
            user=db_config['user'],
            password=db_config['password'],
            port=db_config['port'],
            database=db_config['database'],
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor,
            ssl={'fake': True}  # Bypass SSL verification requirement
        )
        cursor = connection.cursor()
        
        try:
            # Extract course data from request
            name = data.get('name')
            level = data.get('level')
            age_range = data.get('ageRange')
            location = data.get('location')
            schedule = data.get('schedule')
            time = data.get('time')
            teacher_id = data.get('teacher')  # This is now the teacher ID
            max_students = data.get('maxStudents')
            fee = data.get('fee')
            description = data.get('description')
            
            # Get teacher name based on teacher ID
            teacher_name = ""
            if teacher_id:
                sql_get_teacher = "SELECT CONCAT(first_name, ' ', last_name) as full_name FROM teachers WHERE id = %s"
                cursor.execute(sql_get_teacher, (teacher_id,))
                teacher_result = cursor.fetchone()
                if teacher_result:
                    teacher_name = teacher_result['full_name']
                else:
                    # If teacher not found, use ID as fallback
                    teacher_name = f"Teacher ID: {teacher_id}"
            
            # Insert data into courses table
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
            return jsonify({"message": "Course added successfully!"}), 200
            
        except Exception as e:
            connection.rollback()
            print(f"Database error: {str(e)}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        finally:
            # Close connection
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"Server error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/teachers', methods=['POST'])
def add_teacher():
    try:
        # Get JSON data
        data = request.json
        if not data:
            return jsonify({"error": "No data received"}), 400
            
        # Print received data for debugging
        print(f"Received teacher data: {data}")
        
        # Connect to database
        connection = pymysql.connect(
            host=db_config['host'],
            user=db_config['user'],
            password=db_config['password'],
            port=db_config['port'],
            database=db_config['database'],
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor,
            ssl={'fake': True}  # Bypass SSL verification requirement
        )
        cursor = connection.cursor()
        
        try:
            # Extract teacher data from request
            first_name = data.get('firstName')
            last_name = data.get('lastName')
            email = data.get('email')
            phone = data.get('phone')
            id_number = data.get('idNumber')
            id_type = data.get('idType')
            location = data.get('location')
            courses = ','.join(data.get('courses', []))  # Convert course list to comma-separated string
            qualifications = data.get('qualifications')
            experience = data.get('experience')
            join_date = data.get('joinDate')
            languages = data.get('languages')
            bio = data.get('bio', '')
            
            # Insert data into teachers table
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
            return jsonify({"message": "Teacher added successfully!"}), 200
            
        except Exception as e:
            connection.rollback()
            print(f"Database error: {str(e)}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        finally:
            # Close connection
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"Server error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/courses/<int:course_id>', methods=['DELETE'])
def delete_course(course_id):
    try:
        # Connect to database
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
            # Delete course
            sql = "DELETE FROM courses WHERE id = %s"
            cursor.execute(sql, (course_id,))
            
            if cursor.rowcount == 0:
                return jsonify({"error": "Course not found"}), 404
                
            connection.commit()
            return jsonify({"message": "Course deleted successfully"}), 200
            
        except Exception as e:
            connection.rollback()
            print(f"Database error: {str(e)}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        finally:
            # Close connection
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"Server error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/courses', methods=['GET'])
def get_courses():
    try:
        # Connect to database
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
            # Query all courses
            sql = "SELECT * FROM courses"
            cursor.execute(sql)
            courses_data = cursor.fetchall()
            
            # Query the number of registered students for each course
            courses = []
            for course in courses_data:
                # Query the number of students registered for this course
                sql = "SELECT COUNT(*) as count FROM students WHERE FIND_IN_SET(%s, courses)"
                cursor.execute(sql, (str(course['id'])))
                enrolled_count = cursor.fetchone()['count']
                
                # Convert data format to match frontend requirements
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
                    'status': 'active'  # Default all courses are active
                })
                
            return jsonify(courses), 200
            
        except Exception as e:
            print(f"Database error: {str(e)}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        finally:
            # Close connection
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"Server error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/students', methods=['GET'])
def get_students():
    try:
        # Connect to database
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
            # Query all students
            sql = "SELECT * FROM students"
            cursor.execute(sql)
            students_data = cursor.fetchall()
            
            # Convert data format to match frontend requirements
            students = []
            for student in students_data:
                # Calculate age (based on date of birth)
                from datetime import datetime
                birth_date = datetime.strptime(str(student['date_of_birth']), '%Y-%m-%d')
                today = datetime.today()
                age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
                
                # Convert courses string to array
                courses_list = student['courses'].split(',') if student['courses'] else []
                
                # Convert data format
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
                    'status': 'active'  # Default all students are active
                })
                
            return jsonify(students), 200
            
        except Exception as e:
            print(f"Database error: {str(e)}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        finally:
            # Close connection
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"Server error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/teachers/<int:teacher_id>', methods=['DELETE'])
def delete_teacher(teacher_id):
    try:
        # Connect to database
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
            # Delete teacher
            sql = "DELETE FROM teachers WHERE id = %s"
            cursor.execute(sql, (teacher_id,))
            
            if cursor.rowcount == 0:
                return jsonify({"error": "Teacher not found"}), 404
                
            connection.commit()
            return jsonify({"message": "Teacher deleted successfully"}), 200
            
        except Exception as e:
            connection.rollback()
            print(f"Database error: {str(e)}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        finally:
            # Close connection
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"Server error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/students/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    try:
        # Connect to database
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
            # Delete student
            sql = "DELETE FROM students WHERE id = %s"
            cursor.execute(sql, (student_id,))
            
            if cursor.rowcount == 0:
                return jsonify({"error": "Student not found"}), 404
                
            connection.commit()
            return jsonify({"message": "Student deleted successfully"}), 200
            
        except Exception as e:
            connection.rollback()
            print(f"Database error: {str(e)}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        finally:
            # Close connection
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"Server error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/locations', methods=['GET'])
def get_locations():
    try:
        # Connect to database
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
            # Query all distinct locations
            sql = "SELECT DISTINCT location FROM students"
            cursor.execute(sql)
            locations_data = cursor.fetchall()
            
            # Convert data format
            locations = []
            for idx, location in enumerate(locations_data):
                location_name = location['location']
                # Generate a simple ID
                location_id = ''.join(c.lower() for c in location_name if c.isalpha())[:3]
                locations.append({
                    'id': location_id,
                    'name': location_name
                })
                
            return jsonify(locations), 200
            
        except Exception as e:
            print(f"Database error: {str(e)}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        finally:
            # Close connection
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"Server error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/course-names', methods=['GET'])
def get_course_names():
    try:
        # Connect to database
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
            # Query all courses
            sql = "SELECT id, name FROM courses"
            cursor.execute(sql)
            courses_data = cursor.fetchall()
            
            # Convert data format
            courses = []
            for course in courses_data:
                courses.append({
                    'id': str(course['id']),
                    'name': course['name']
                })
                
            return jsonify(courses), 200
            
        except Exception as e:
            print(f"Database error: {str(e)}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        finally:
            # Close connection
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"Server error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/teachers', methods=['GET'])
def get_teachers():
    try:
        # Connect to database
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
            # Query all teachers
            sql = "SELECT * FROM teachers"
            cursor.execute(sql)
            teachers_data = cursor.fetchall()
            
            # Convert data format to match frontend requirements
            teachers = []
            for teacher in teachers_data:
                # Convert courses string to array
                courses_list = teacher['courses'].split(',') if teacher['courses'] else []
                
                # Convert qualifications string to array
                qualifications_list = teacher['qualifications'].split(',') if teacher['qualifications'] else []
                
                # Convert data format
                teachers.append({
                    'id': teacher['id'],
                    'name': f"{teacher['first_name']} {teacher['last_name']}",
                    'location': teacher['location'],
                    'courses': courses_list,
                    'experience': teacher['experience'],
                    'qualifications': qualifications_list,
                    'contact': teacher['phone'],
                    'joinDate': teacher['join_date'].strftime('%Y-%m-%d'),
                    'status': 'active'  # Default all teachers are active
                })
                
            return jsonify(teachers), 200
            
        except Exception as e:
            print(f"Database error: {str(e)}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        finally:
            # Close connection
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"Server error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/grades', methods=['GET'])
def get_grades():
    try:
        # Connect to database
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
            # Query all distinct grades
            sql = "SELECT DISTINCT grade FROM students"
            cursor.execute(sql)
            grades_data = cursor.fetchall()
            
            # Extract grade list
            grades = [grade['grade'] for grade in grades_data]
            
            # If no grade data in database, return default grades
            if not grades:
                grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6']
                
            return jsonify(grades), 200
            
        except Exception as e:
            print(f"Database error: {str(e)}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        finally:
            # Close connection
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"Server error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/admin/dashboard-stats', methods=['GET'])
def get_dashboard_stats():
    try:
        # Connect to database
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
            # Get total number of students
            cursor.execute("SELECT COUNT(*) as count FROM students")
            total_students = cursor.fetchone()['count']
            
            # Get last month's student count, calculate percentage change
            from datetime import datetime, timedelta
            one_month_ago = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
            cursor.execute("SELECT COUNT(*) as count FROM students WHERE created_at < %s", (one_month_ago,))
            last_month_students = cursor.fetchone()['count'] or 1  # Avoid division by zero
            student_change_percent = round(((total_students - last_month_students) / last_month_students) * 100)
            student_change = f"+{student_change_percent}%" if student_change_percent > 0 else f"{student_change_percent}%"
            
            # Get active course count
            cursor.execute("SELECT COUNT(*) as count FROM courses")
            active_courses = cursor.fetchone()['count']
            
            # Get last month's course count, calculate change
            cursor.execute("SELECT COUNT(*) as count FROM courses WHERE created_at < %s", (one_month_ago,))
            last_month_courses = cursor.fetchone()['count'] or 0
            course_change = f"+{active_courses - last_month_courses}" if active_courses > last_month_courses else f"{active_courses - last_month_courses}"
            
            # Get total number of teachers
            cursor.execute("SELECT COUNT(*) as count FROM teachers")
            total_teachers = cursor.fetchone()['count']
            
            # Get last month's teacher count, calculate change
            cursor.execute("SELECT COUNT(*) as count FROM teachers WHERE created_at < %s", (one_month_ago,))
            last_month_teachers = cursor.fetchone()['count'] or total_teachers
            teacher_change = f"+{total_teachers - last_month_teachers}" if total_teachers > last_month_teachers else f"{total_teachers - last_month_teachers}"
            
            # Get today's class count (this needs to be adjusted based on actual situation, assuming there's a course schedule table)
            # Since there's no course schedule table, use an estimate here: each course has one class per week
            today_weekday = datetime.now().weekday()  # 0-6，0是周一
            cursor.execute("SELECT COUNT(*) as count FROM courses WHERE schedule LIKE %s", (f"%{today_weekday}%",))
            classes_today_result = cursor.fetchone()
            classes_today = classes_today_result['count'] if classes_today_result else 0
            
            # Assume last week's class count on the same day
            last_week_classes = int(classes_today * 1.1)  # Assume 10% more than this week
            classes_change = f"{classes_today - last_week_classes}"
            
            # Build response data
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
            print(f"Database error: {str(e)}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        finally:
            # Close connection
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"Server error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/enroll', methods=['POST'])
def enroll_course():
    try:
        # Get JSON data
        data = request.json
        if not data:
            return jsonify({"error": "No data received"}), 400
            
        # Extract data from request
        course_id = data.get('courseId')
        parent_id = data.get('parentId')
        
        if not course_id or not parent_id:
            return jsonify({"error": "Incorrect data format, missing courseId or parentId"}), 400
            
        # Print received data for debugging
        print(f"Enrollment request - Course ID: {course_id}, Parent ID: {parent_id}")
        
        # Connect to database
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
            # Check if course exists
            cursor.execute("SELECT * FROM courses WHERE id = %s", (course_id,))
            course = cursor.fetchone()
            if not course:
                return jsonify({"error": "Course does not exist"}), 404
                
            # Check if course is full
            cursor.execute("SELECT COUNT(*) as count FROM students WHERE FIND_IN_SET(%s, courses)", (str(course_id),))
            enrolled_count = cursor.fetchone()['count']
            
            if enrolled_count >= course['max_students']:
                return jsonify({"error": "Course is full"}), 400
            
            # Create enrollment record
            # Note: Here we create a new table to store enrollment information, rather than relying on a specific table structure
            # First check if enrollments table exists, if not create it
            # Note: enrollments table has already been created in init_db(), no need to create it again here
            
            # Check if already enrolled
            cursor.execute("SELECT * FROM enrollments WHERE course_id = %s AND parent_id = %s",
                          (course_id, parent_id))
            existing_enrollment = cursor.fetchone()
            
            if existing_enrollment:
                return jsonify({"error": "You have already enrolled in this course"}), 400
            
            # Create new enrollment record
            # Ensure parent_id is integer type
            try:
                parent_id_int = int(parent_id)
            except ValueError:
                return jsonify({"error": "parentId must be an integer"}), 400
                
            cursor.execute("INSERT INTO enrollments (course_id, parent_id) VALUES (%s, %s)",
                          (course_id, parent_id_int))
            
            connection.commit()
            return jsonify({"message": "Enrollment successful"}), 200
            
        except Exception as e:
            connection.rollback()
            print(f"Database error: {str(e)}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        finally:
            # Close connection
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"Server error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/user-enrollments', methods=['GET'])
def get_user_enrollments():
    try:
        # Get request parameters
        parent_id = request.args.get('parentId')
        
        if not parent_id:
            return jsonify({"error": "Missing parentId parameter"}), 400
            
        # Ensure parent_id is integer type
        try:
            parent_id_int = int(parent_id)
        except ValueError:
            return jsonify({"error": "parentId must be an integer"}), 400
            
        # Connect to database
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
            # Query user's enrolled courses
            sql = """
            SELECT c.*, e.enrollment_date, e.status as enrollment_status
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.parent_id = %s AND e.status = 'active'
            """
            cursor.execute(sql, (parent_id_int,))
            enrollments = cursor.fetchall()
            
            # Format results
            formatted_enrollments = []
            for enrollment in enrollments:
                # Safely handle time format
                time_parts = enrollment['time'].split('-') if '-' in enrollment['time'] else ['00:00', '00:00']
                start_time = time_parts[0].strip() if len(time_parts) > 0 else '00:00'
                end_time = time_parts[1].strip() if len(time_parts) > 1 else '01:00'
                
                formatted_enrollments.append({
                    'id': str(enrollment['id']),
                    'title': enrollment['name'],
                    'start': f"2025-01-16T{start_time}:00",  # 使用课程时间创建事件开始时间
                    'end': f"2025-01-16T{end_time}:00",    # 使用课程时间创建事件结束时间
                    'extendedProps': {
                        'location': enrollment['location'],
                        'teacher': enrollment['teacher'],
                        'zoomLink': 'https://zoom.us/j/123456789' if 'Online' in enrollment['location'] else None,
                        'courseId': str(enrollment['id'])
                    }
                })
            
            return jsonify(formatted_enrollments), 200
            
        except Exception as e:
            print(f"Database error: {str(e)}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        finally:
            # Close connection
            cursor.close()
            connection.close()
            
    except Exception as e:
        print(f"Server error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    # Initialize database tables
    init_db()
    app.run(port=9999, debug=True, host='0.0.0.0')