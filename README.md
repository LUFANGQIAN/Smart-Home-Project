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

# 主脚本文档

## 文件信息
- **文件名**: main.js
- **路径**: `/code/frontend/js/main.js`
- **功能**: 负责与后端API交互并动态更新UI

## 全局变量

### API_URL
- **类型**: `const string`
- **值**: `'https://api.olxok.top/api/devices'`
- **用途**: 后端API的基础URL

### allDevices
- **类型**: `let array`
- **用途**: 存储所有设备的数据

### cardIconSet
- **类型**: `const object`
- **用途**: 设备类型与图标编码的映射表
- **支持的设备类型**:
  - light: 灯具
  - thermostat: 温控器
  - outlet: 插座
  - fan: 风扇
  - speaker: 音箱
  - camera: 摄像头

## 核心功能

### 1. 初始化
```javascript
function init()
```
- 页面加载完成后执行
- 初始化时间显示
- 获取并显示设备数据

### 2. 设备状态管理
```javascript
function updatedDeviceStatus(deviceId, newDeviceStatus)
```
- 更新设备开关状态
- 发送PUT请求到后端
- 更新本地数据并重新渲染

### 3. 界面渲染
```javascript
function reloadCardList()
```
- 清空并重新渲染设备卡片列表
- 根据设备类型显示对应图标
- 显示设备状态（开启/关闭）

### 4. 事件监听
```javascript
function addListeners()
```
包含两个子功能：
- `addSwitchListeners()`: 设备开关状态切换
- `addJumpLinkListeners()`: 详情页面跳转

### 5. 数据统计
```javascript
function updatedDeviceRunNum()
```
- 统计当前开启的设备数量
- 更新显示数值

### 6. 时间更新
```javascript
function updatedLastTime()
```
- 格式化并显示当前时间
- 用于显示最后更新时间

## API 交互

### 获取设备列表
- **方法**: GET
- **URL**: `${API_URL}`
- **返回**: 设备数组

### 更新设备状态
- **方法**: PUT
- **URL**: `${API_URL}/${deviceId}/status`
- **数据格式**: `{ status: 'on'/'off' }`

## 使用说明

1. 页面加载时自动初始化：
```javascript
document.addEventListener('DOMContentLoaded', init);
```

2. 手动刷新数据：
```javascript
function refreshDevices()
```
- 重新获取设备数据
- 更新最后更新时间

## 注意事项

1. 所有DOM操作都在`DOMContentLoaded`事件后执行
2. 设备状态更改后会自动重新渲染整个列表
3. 设备类型如果在`cardIconSet`中未定义，将使用默认图标（`&#xe606;`）


​     