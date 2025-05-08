import requests
import json

BASE_URL = "http://localhost:9999"

def test_get_courses():
    response = requests.get(f"{BASE_URL}/courses")
    print("获取课程列表:")
    print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    print("状态码:", response.status_code)

def test_get_grades():
    response = requests.get(f"{BASE_URL}/grades")
    print("\n获取成绩列表:")
    print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    print("状态码:", response.status_code)

def test_add_grade():
    new_grade = {
        "date": "2025-01-20",
        "course": "Phonics Foundation",
        "courseId": "phonics",
        "type": "exam",
        "title": "Midterm Exam",
        "student": "Sophie Lee",
        "studentId": 3,
        "score": 92,
        "maxScore": 100,
        "feedback": "Excellent performance on consonant blends"
    }
    
    response = requests.post(f"{BASE_URL}/grades", json=new_grade)
    print("\n添加单个成绩:")
    print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    print("状态码:", response.status_code)

def test_add_batch_grades():
    batch_grades = [
        {
            "date": "2025-01-25",
            "course": "Young Readers",
            "courseId": "readers",
            "type": "quiz",
            "title": "Vocabulary Quiz",
            "student": "Jason Lam",
            "studentId": 4,
            "score": 88,
            "maxScore": 100,
            "feedback": "Good vocabulary knowledge"
        },
        {
            "date": "2025-01-25",
            "course": "Young Readers",
            "courseId": "readers",
            "type": "quiz",
            "title": "Vocabulary Quiz",
            "student": "Alice Chen",
            "studentId": 5,
            "score": 94,
            "maxScore": 100,
            "feedback": "Excellent vocabulary range"
        }
    ]
    
    response = requests.post(f"{BASE_URL}/grades/batch", json=batch_grades)
    print("\n批量添加成绩:")
    print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    print("状态码:", response.status_code)

if __name__ == "__main__":
    print("开始测试API端点...\n")
    test_get_courses()
    test_get_grades()
    test_add_grade()
    test_add_batch_grades()
    test_get_grades()  # 再次获取成绩列表，验证添加是否成功
    print("\n测试完成!")