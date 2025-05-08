import requests
import json
import webbrowser
import os
import time
import subprocess
import sys

BASE_URL = "http://localhost:9999"

def print_header(text):
    print("\n" + "=" * 50)
    print(f" {text} ".center(50, "="))
    print("=" * 50)

def test_database_connection():
    print_header("测试数据库连接")
    try:
        import pymysql
        from app import db_config
        
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
        
        # 测试查询
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        
        print("数据库连接成功!")
        print(f"数据库中的表: {[table.values() for table in tables]}")
        
        cursor.close()
        connection.close()
        return True
    except Exception as e:
        print(f"数据库连接失败: {str(e)}")
        return False

def test_api_endpoints():
    print_header("测试API端点")
    
    endpoints = [
        {"name": "获取课程列表", "method": "GET", "url": "/courses"},
        {"name": "获取成绩列表", "method": "GET", "url": "/grades"}
    ]
    
    all_passed = True
    
    for endpoint in endpoints:
        print(f"\n测试: {endpoint['name']} ({endpoint['method']} {endpoint['url']})")
        try:
            if endpoint['method'] == 'GET':
                response = requests.get(f"{BASE_URL}{endpoint['url']}")
            else:
                continue  # 暂不测试其他方法
                
            if response.status_code == 200:
                print(f"✅ 状态码: {response.status_code}")
                data = response.json()
                print(f"数据示例: {json.dumps(data[:2] if isinstance(data, list) and len(data) > 0 else data, indent=2, ensure_ascii=False)}")
            else:
                print(f"❌ 状态码: {response.status_code}")
                print(f"错误信息: {response.text}")
                all_passed = False
        except Exception as e:
            print(f"❌ 请求失败: {str(e)}")
            all_passed = False
    
    return all_passed

def test_add_grade():
    print_header("测试添加成绩")
    
    new_grade = {
        "date": "2025-01-22",
        "course": "Phonics Foundation",
        "courseId": "phonics",
        "type": "assignment",
        "title": "Phonics Workbook Exercise",
        "student": "Sophie Lee",
        "studentId": 3,
        "score": 88,
        "maxScore": 100,
        "feedback": "Good progress with consonant blends"
    }
    
    try:
        print("发送成绩数据...")
        response = requests.post(f"{BASE_URL}/grades", json=new_grade)
        
        if response.status_code in [200, 201]:
            print(f"✅ 状态码: {response.status_code}")
            data = response.json()
            print(f"返回数据: {json.dumps(data, indent=2, ensure_ascii=False)}")
            return True
        else:
            print(f"❌ 状态码: {response.status_code}")
            print(f"错误信息: {response.text}")
            return False
    except Exception as e:
        print(f"❌ 请求失败: {str(e)}")
        return False

def test_batch_add_grades():
    print_header("测试批量添加成绩")
    
    batch_grades = [
        {
            "date": "2025-01-28",
            "course": "Young Readers",
            "courseId": "readers",
            "type": "exam",
            "title": "Reading Comprehension Test",
            "student": "Jason Lam",
            "studentId": 4,
            "score": 91,
            "maxScore": 100,
            "feedback": "Excellent understanding of main ideas"
        },
        {
            "date": "2025-01-28",
            "course": "Young Readers",
            "courseId": "readers",
            "type": "exam",
            "title": "Reading Comprehension Test",
            "student": "Alice Chen",
            "studentId": 5,
            "score": 96,
            "maxScore": 100,
            "feedback": "Outstanding performance in all areas"
        }
    ]
    
    try:
        print("发送批量成绩数据...")
        response = requests.post(f"{BASE_URL}/grades/batch", json=batch_grades)
        
        if response.status_code in [200, 201]:
            print(f"✅ 状态码: {response.status_code}")
            data = response.json()
            print(f"返回数据示例: {json.dumps(data[0] if len(data) > 0 else {}, indent=2, ensure_ascii=False)}")
            print(f"成功添加 {len(data)} 条成绩记录")
            return True
        else:
            print(f"❌ 状态码: {response.status_code}")
            print(f"错误信息: {response.text}")
            return False
    except Exception as e:
        print(f"❌ 请求失败: {str(e)}")
        return False

def open_test_frontend():
    print_header("打开测试前端页面")
    
    try:
        # 获取当前脚本所在目录的绝对路径
        current_dir = os.path.dirname(os.path.abspath(__file__))
        # 构建HTML文件的绝对路径
        html_path = os.path.join(current_dir, "test_frontend.html")
        
        # 检查文件是否存在
        if not os.path.exists(html_path):
            print(f"❌ 找不到测试前端页面: {html_path}")
            return False
        
        # 将文件路径转换为URL格式
        file_url = f"file://{html_path}"
        
        print(f"正在打开测试前端页面: {file_url}")
        webbrowser.open(file_url)
        print("✅ 已在浏览器中打开测试前端页面")
        return True
    except Exception as e:
        print(f"❌ 打开测试前端页面失败: {str(e)}")
        return False

def check_server_running():
    print_header("检查服务器状态")
    
    try:
        response = requests.get(f"{BASE_URL}/courses")
        print(f"✅ 服务器正在运行，状态码: {response.status_code}")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ 服务器未运行")
        return False
    except Exception as e:
        print(f"❌ 检查服务器状态时出错: {str(e)}")
        return False

def start_server():
    print_header("启动服务器")
    
    try:
        # 使用非阻塞方式启动服务器
        server_process = subprocess.Popen(
            [sys.executable, "app.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # 等待服务器启动
        print("等待服务器启动...")
        time.sleep(3)
        
        # 检查进程是否仍在运行
        if server_process.poll() is None:
            print("✅ 服务器已启动")
            return server_process
        else:
            stdout, stderr = server_process.communicate()
            print(f"❌ 服务器启动失败: {stderr}")
            return None
    except Exception as e:
        print(f"❌ 启动服务器时出错: {str(e)}")
        return None

def main():
    print("=" * 50)
    print(" 教育管理系统 - 成绩模块测试 ".center(50, "="))
    print("=" * 50)
    
    # 检查服务器是否已在运行
    server_running = check_server_running()
    server_process = None
    
    if not server_running:
        # 初始化数据库
        print("\n正在初始化数据库...")
        subprocess.run([sys.executable, "init_db.py"], check=True)
        
        # 启动服务器
        server_process = start_server()
        if not server_process:
            print("无法启动服务器，测试终止")
            return
    
    try:
        # 测试数据库连接
        db_ok = test_database_connection()
        if not db_ok:
            print("数据库连接失败，测试终止")
            return
        
        # 测试API端点
        api_ok = test_api_endpoints()
        if not api_ok:
            print("API端点测试失败")
        
        # 测试添加成绩
        add_grade_ok = test_add_grade()
        if not add_grade_ok:
            print("添加成绩测试失败")
        
        # 测试批量添加成绩
        batch_add_ok = test_batch_add_grades()
        if not batch_add_ok:
            print("批量添加成绩测试失败")
        
        # 打开测试前端页面
        frontend_ok = open_test_frontend()
        if not frontend_ok:
            print("打开测试前端页面失败")
        
        print("\n" + "=" * 50)
        print(" 测试完成 ".center(50, "="))
        print("=" * 50)
        
        if server_process:
            input("\n按Enter键停止服务器...")
    finally:
        # 如果我们启动了服务器，确保在退出时关闭它
        if server_process:
            print("\n正在关闭服务器...")
            server_process.terminate()
            print("服务器已关闭")

if __name__ == "__main__":
    main()