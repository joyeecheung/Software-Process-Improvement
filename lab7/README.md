# My Homework

一个简单的作业管理系统

## 导入测试数据

1. 使用 mongorestore 导入 dump 到 mockdata 文件夹中的数据，比如导入到 myhomework（没有会自动新建）

  ```
  mongorestore --db myhomework mockdata
  ```
2. 配置项目根目录下的 db.js

  比如使用 localhost 和默认端口，数据放在 myhomework

  ```
  'url' : 'mongodb://localhost:27017/myhomework'
  ```

## 测试账号

1. 学生
  * 用户名：test
  * 密码：12345
  * 注册了课程，提交了部分作业
2. 老师
  * 用户名：test2
  * 密码：12345
  * 注册了课程，批改了部分作业
3. 学生
  * 用户名：test3
  * 密码：12345
  * 注册了课程，提交了部分作业，漏交了部分作业

## 运行

运行 `npm install` 后再运行 `grunt`，访问 `http://localhost:3000`

## 其他

新注册的用户需要在后台注册进课程里。比如在 mongo shell 里

```
> db.courses.find()  // 查看有哪些课程

{ "_id" : ObjectId("5528f91edf6f429c3afc1fd1"), "name" : "软件过程改进", "requirements" : [ ObjectId("5528f91edf6f429c3afc1fd0"), ObjectId("5529186a975e05883e3f7367
"), ObjectId("552947fd28e35a402371abab") ], "__v" : 0, "teacher" : ObjectId("5528f7da5fd523c01cc8f8de") }

>  db.users.update({username: '需要更新的用户名'}, {$push: {courses: ObjectId("5528f91edf6f429c3afc1fd1")}})  // 将之前查到的课程的 ID 放入新用户的 courses 里

```