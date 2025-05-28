# 智能家居控制系统 - 项目说明文档

## 项目概述

XXX

## 技术栈

- 前端：XX
- 后端：XX
- 数据交互：XX
- 设计风格：新拟态设计（Neumorphism）

## 项目结构

```
code/
├── frontend/                 # 前端文件
│   ├── css/                  # CSS样式文件
│   │   ├── index.css         # 主样式表
│   │   ├── reset.css         # 清除默认样式
│   │   └── device-detail.css # 设备详情页样式
│   ├── js/                   # JavaScript文件
│   │   ├── main.js           # 主页面脚本
│   │   └── device.js         # 设备详情页脚本
│   ├── index.html            # 控制面板页面
│   └── device.html           # 设备详情页面
├── backend/                  # 后端文件
│   ├── server.js             # Express服务器
│   └── package.json          # 项目依赖配置
└── README.md                 # 项目说明文档
```

## 功能特点

1. **控制面板页面**：
   - XX
   
2. **设备详情页面**：
   - XX
   
3. **API接口**：
   - 获取所有设备列表：`GET /api/devices`
   - 获取单个设备详情：`GET /api/devices/:id`
   - 更新设备状态：`PUT /api/devices/:id/status`

4. **新拟态设计**：
   - 软UI效果：元素从背景中"挤压"出来的视觉效果
   - 微妙的阴影：使用两个阴影创建凸起或凹陷效果
   - 低对比度：使用柔和的颜色，避免强烈的对比
   - 简约设计：界面简洁、直观
   - 交互反馈：按钮点击时有明显的视觉反馈

## 安装与运行

### 前提条件

- Node.js (v14.0.0 或更高版本)
- npm (v6.0.0 或更高版本)

### 安装步骤

1. 克隆或下载项目到本地

2. 安装后端依赖
   ```bash
   cd smart_home_project/backend
   npm install
   ```

3. 启动后端服务器
   ```bash
   node server.js
   ```

4. 访问应用
   在浏览器中打开 `http://localhost:3000` 即可访问接口

## API文档

### 1. 获取所有设备列表

- **URL**: `/api/devices`
- **方法**: `GET`
- **响应示例**:
  ```json
  [
    {
      "id": "d001",
      "name": "客厅主灯",
      "type": "light",
      "location": "客厅",
      "status": "on"
    },
    ...
  ]
  ```

### 2. 获取单个设备详情

- **URL**: `/api/devices/:id`
- **方法**: `GET`
- **参数**: `id` - 设备ID
- **响应示例**:
  ```json
  {
    "id": "d001",
    "name": "客厅主灯",
    "type": "light",
    "location": "客厅",
    "status": "on",
    "manufacturer": "飞利浦",
    "model": "Hue White A19",
    "firmware": "1.4.2",
    "connection": "WiFi",
    "addedDate": "2025-01-15",
    "lastActive": "2025-05-21 03:15:22",
    "settings": {
      "brightness": 80,
      "colorTemp": 4000
    },
    "history": [...]
  }
  ```

### 3. 更新设备状态

- **URL**: `/api/devices/:id/status`
- **方法**: `PUT`
- **参数**: `id` - 设备ID
- **请求体示例**:
  ```json
  {
    "status": "on"
  }
  ```
  或
  ```json
  {
    "setting": "brightness",
    "value": 75
  }
  ```
- **响应示例**:
  ```json
  {
    "success": true,
    "device": {...}
  }
  ```

### 4. 接口请求示例

```js
// 全局变量
const API_BASE_URL = 'http://localhost:3000/api';
/**
 * 加载设备详情
 * @param {string} deviceId - 设备ID
 */
function loadDeviceDetails(deviceId) {
    // 显示加载动画
    $('#loading-container').show();
    $('#device-content').hide();
    
    // 发起AJAX请求获取设备详情
    $.ajax({
        url: `${API_BASE_URL}/devices/${deviceId}`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            // 保存设备数据
            currentDevice = response;
            
            // 渲染设备详情
            renderDeviceDetails(currentDevice);
            
            // 隐藏加载动画，显示内容
            $('#loading-container').hide();
            $('#device-content').show();
        },
        error: function(xhr, status, error) {
            // 显示错误信息
            alert(`加载设备详情失败: ${error}`);
            console.error('加载设备详情失败:', error);
            
            // 返回首页
            window.location.href = 'index.html';
        }
    });
}
```



## 项目特色

1. **响应式设计**：适配不同尺寸的屏幕，提供良好的移动端体验
2. **新拟态UI**：采用当下流行的设计风格，提供独特的视觉体验
3. **模块化结构**：代码结构清晰，便于维护和扩展
4. **丰富的交互**：提供多种设备控制方式和实时反馈
5. **完善的错误处理**：对各种异常情况进行处理，提高系统稳定性

## 学习要点

1. **前端技术**：
   - HTML结构设计
   - CSS新拟态风格实现
   - JavaScript动态交互
   - jQuery Ajax数据获取与提交

2. **后端技术**：
   - Express服务器搭建
   - RESTful API设计与实现
   - 模拟数据管理

3. **交互设计**：
   - 用户友好的界面设计
   - 实时反馈机制
   - 错误处理与提示
