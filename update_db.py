import pymysql
import os

# 数据库连接配置
db_config = {
    'host': 'localhost',
    'user': 'root',
    'port': 33066,
    'password': '',
    'database': 'project'
}

def update_database():
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
        
        # 读取SQL文件，指定UTF-8编码
        with open('update_db.sql', 'r', encoding='utf-8') as file:
            sql_script = file.read()
        
        # 按语句分割SQL脚本
        sql_commands = sql_script.split(';')
        
        # 执行每条SQL语句
        for command in sql_commands:
            if command.strip():
                try:
                    cursor.execute(command)
                    print(f"执行成功: {command[:50]}...")
                except Exception as e:
                    print(f"执行失败: {command[:50]}..., 错误: {str(e)}")
        
        connection.commit()
        print("数据库更新成功！")
        
    except Exception as e:
        print(f"数据库更新失败: {str(e)}")
    finally:
        cursor.close()
        connection.close()

if __name__ == "__main__":
    update_database()