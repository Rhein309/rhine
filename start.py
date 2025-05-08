import subprocess
import sys
import time
import os

def check_dependencies():
    """检查必要的依赖是否已安装"""
    try:
        import flask
        import pymysql
        import flask_cors
        print("✅ 所有Python依赖已安装")
        return True
    except ImportError as e:
        print(f"❌ 缺少依赖: {e}")
        print("请运行: pip install flask flask-cors pymysql")
        return False

def init_database():
    """初始化数据库"""
    print("正在初始化数据库...")
    try:
        subprocess.run([sys.executable, "init_db.py"], check=True)
        print("✅ 数据库初始化成功")
        return True
    except subprocess.CalledProcessError:
        print("❌ 数据库初始化失败")
        return False

def start_backend():
    """启动后端服务器"""
    print("正在启动后端服务器...")
    try:
        # 使用非阻塞方式启动后端
        backend_process = subprocess.Popen(
            [sys.executable, "app.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # 等待服务器启动
        time.sleep(2)
        
        # 检查进程是否仍在运行
        if backend_process.poll() is None:
            print("✅ 后端服务器已启动，运行在 http://localhost:9999")
            return backend_process
        else:
            stdout, stderr = backend_process.communicate()
            print(f"❌ 后端服务器启动失败: {stderr}")
            return None
    except Exception as e:
        print(f"❌ 启动后端服务器时出错: {e}")
        return None

def test_api():
    """测试API端点"""
    print("\n是否要测试API端点? (y/n)")
    choice = input().lower()
    if choice == 'y':
        print("正在测试API端点...")
        try:
            subprocess.run([sys.executable, "test_api.py"], check=True)
            print("✅ API测试完成")
        except subprocess.CalledProcessError:
            print("❌ API测试失败")

def main():
    """主函数"""
    print("=== 教育管理系统 - 成绩模块启动脚本 ===\n")
    
    # 检查依赖
    if not check_dependencies():
        return
    
    # 初始化数据库
    if not init_database():
        return
    
    # 启动后端
    backend_process = start_backend()
    if not backend_process:
        return
    
    # 测试API
    test_api()
    
    print("\n系统已成功启动!")
    print("- 后端API: http://localhost:9999")
    print("\n按Ctrl+C停止服务器...")
    
    try:
        # 保持脚本运行，直到用户按Ctrl+C
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n正在关闭服务器...")
        backend_process.terminate()
        print("✅ 服务器已关闭")

if __name__ == "__main__":
    main()