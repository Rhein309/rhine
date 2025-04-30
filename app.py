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

if __name__ == '__main__':
    # 初始化数据库表
    init_db()
    app.run(port=9999, debug=True, host='0.0.0.0')