# RESTful API 文档

## 用户认证

### 登录

- **URL**: `/api/auth/login`
- **方法**: `POST`
- **描述**: 用户登录（支持微信登录和本地登录）
- **请求体**:
  ```json
  {
    "authType": "wechat" | "local",
    "code": "string", // 微信登录时使用
    "username": "string", // 本地登录时使用
    "password": "string" // 本地登录时使用
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "token": "string",
    "user": {
      "id": "uuid",
      "openId": "string",
      "username": "string",
      "authType": "wechat" | "local",
      "ratedDailySalary": 300,
      "ratedWorkStartTime": "09:00",
      "ratedWorkEndTime": "18:00",
      "ratedWorkHours": 9,
      "ratedHourlyRate": 33.3333
    }
  }
  ```

### 注册

- **URL**: `/api/auth/register`
- **方法**: `POST`
- **描述**: 用户注册（支持微信注册和本地注册）
- **请求体**:
  ```json
  {
    "authType": "wechat" | "local",
    "username": "string", // 本地注册时使用
    "password": "string", // 本地注册时使用
    "code": "string" // 微信注册时使用
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "token": "string",
    "user": {
      "id": "uuid",
      "openId": "string",
      "username": "string",
      "authType": "wechat" | "local",
      "ratedDailySalary": 300,
      "ratedWorkStartTime": "09:00",
      "ratedWorkEndTime": "18:00",
      "ratedWorkHours": 9,
      "ratedHourlyRate": 33.3333
    }
  }
  ```

### 验证令牌

- **URL**: `/api/auth/verify`
- **方法**: `POST`
- **描述**: 验证用户的JWT令牌
- **请求体**:
  ```json
  {
    "token": "string",
    "authType": "wechat" | "local"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "user": {
      "id": "uuid",
      "openId": "string",
      "username": "string",
      "authType": "wechat" | "local"
    }
  }
  ```

## 用户设置

### 设置工作参数

- **URL**: `/api/users/settings`
- **方法**: `POST`
- **描述**: 设置用户的工作参数
- **请求头**: 
  - `Authorization: Bearer <token>`
- **请求体**:
  ```json
  {
    "ratedDailySalary": 300,
    "ratedWorkStartTime": "09:00",
    "ratedWorkEndTime": "18:00"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "user": {
      "id": "uuid",
      "openId": "string",
      "username": "string",
      "authType": "wechat" | "local",
      "ratedDailySalary": 300,
      "ratedWorkStartTime": "09:00",
      "ratedWorkEndTime": "18:00",
      "ratedWorkHours": 9,
      "ratedHourlyRate": 33.3333
    }
  }
  ```

## 打卡功能

### 上班打卡

- **URL**: `/api/clock/clock-in`
- **方法**: `POST`
- **描述**: 用户上班打卡
- **请求头**: 
  - `Authorization: Bearer <token>`
- **响应**:
  ```json
  {
    "success": true,
    "clockRecord": {
      "id": "uuid",
      "date": "2023-05-20",
      "clockInTime": "2023-05-20T09:00:00Z",
      "ratedWorkStartTime": "09:00",
      "ratedWorkEndTime": "18:00",
      "ratedHourlyRate": 33.3333,
      "ratedWorkHours": 9,
      "ratedDailySalary": 300,
      "expectedDailySalary": 300
    }
  }
  ```

### 下班打卡

- **URL**: `/api/clock/clock-out`
- **方法**: `POST`
- **描述**: 用户下班打卡
- **请求头**: 
  - `Authorization: Bearer <token>`
- **响应**:
  ```json
  {
    "success": true,
    "clockRecord": {
      "id": "uuid",
      "date": "2023-05-20",
      "clockInTime": "2023-05-20T09:00:00Z",
      "clockOutTime": "2023-05-20T18:00:00Z",
      "ratedWorkStartTime": "09:00",
      "ratedWorkEndTime": "18:00",
      "ratedHourlyRate": 33.3333,
      "actualHourlyRate": 33.3333,
      "ratedWorkHours": 9,
      "actualWorkHours": 9,
      "expectedDailySalary": 300,
      "ratedDailySalary": 300
    }
  }
  ```

### 获取今日打卡记录

- **URL**: `/api/clock/today`
- **方法**: `GET`
- **描述**: 获取用户当天的打卡记录
- **请求头**: 
  - `Authorization: Bearer <token>`
- **响应**:
  ```json
  {
    "success": true,
    "clockRecord": {
      "id": "uuid",
      "date": "2023-05-20",
      "clockInTime": "2023-05-20T09:00:00Z",
      "clockOutTime": "2023-05-20T18:00:00Z",
      "ratedWorkStartTime": "09:00",
      "ratedWorkEndTime": "18:00",
      "ratedHourlyRate": 33.3333,
      "actualHourlyRate": 33.3333,
      "ratedWorkHours": 9,
      "actualWorkHours": 9,
      "expectedDailySalary": 300,
      "ratedDailySalary": 300
    }
  }
  ```
  注意：如果当天没有打卡记录，`clockRecord` 将为 `null`。

## 数据展示

### 获取热力图数据

- **URL**: `/api/stats/heatmap`
- **方法**: `GET`
- **描述**: 获取用户的热力图数据
- **请求头**: 
  - `Authorization: Bearer <token>`
- **查询参数**:
  - `startDate`: 开始日期 (YYYY-MM-DD)
  - `endDate`: 结束日期 (YYYY-MM-DD)
  - `type`: 'hourlyRate' 或 'workHours'
- **响应**:
  ```json
  {
    "success": true,
    "data": [
      {
        "date": "2023-05-20",
        "value": 33.33
      },
      {
        "date": "2023-05-21",
        "value": 35.00
      }
    ]
  }
  ```

注意：所有的API调用都应该使用HTTPS来确保数据传输的安全性。对于需要认证的端点，请在请求头中包含有效的JWT令牌。
