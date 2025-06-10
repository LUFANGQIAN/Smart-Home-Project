/**
 * 智能家居控制系统 - 主脚本
 * 负责与后端API交互并动态更新UI
 */

// 全局变量

// API接口URL
const API_URL = 'https://api.olxok.top/api/devices';
// 所有设备数据
let allDevices = [];


// 最后数据更新模块
function updatedLastTime() {
  const nowtime = new Date();
  const year = nowtime.getFullYear();
  const month = String(nowtime.getMonth() + 1).padStart(2, '0');
  const day = String(nowtime.getDate()).padStart(2, '0');
  const hours = String(nowtime.getHours()).padStart(2, '0');
  const minutes = String(nowtime.getMinutes()).padStart(2, '0');
  const seconds = String(nowtime.getSeconds()).padStart(2, '0');
  const updatedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  console.log(updatedTime)
  lastTime = document.getElementById("last-updated-time")
  lastTime.innerHTML = updatedTime
}

// 添加控制开关监听事件
function addSwitchListeners() {
  allDevices.forEach(deviceInfo => {
    const switchInput = document.getElementById(`switch-input-${deviceInfo.id}`);
    if (switchInput) {
      switchInput.addEventListener('change', function () {
        updatedDeviceStatus(deviceInfo.id, this.checked ? 'on' : 'off');
      });
    }
  });
}

//添加详情按钮跳转页面监听事件
function addJumpLinkListeners() {
  console.log('待开发，敬请期待')
}

//添加所有监听事件函数
function addListeners() {
  addSwitchListeners()
  addJumpLinkListeners()
}

// 同步设备开启状态
function updatedDeviceStatus(deviceId, newDeviceStatus) {

  // 使用ajax的put请求更新数据
  $.ajax({
    url: `${API_URL}/${deviceId}/status`,
    method: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify({ status: newDeviceStatus }),
    success: function (response) {
      console.log(`设备 ${deviceId} 状态已更新为 ${newDeviceStatus}`);

      //修改本地状态
      allDevices.forEach(
        deviceInfo => {
          if (deviceInfo.id == deviceId) {
            deviceInfo.status = newDeviceStatus
          }
        }
      )

      // 重绘卡片区域
      reloadCardList();

    }
  });
}

// 重新加载卡片列表
function reloadCardList() {

  const cardList = document.getElementById('devices-list')
  cardList.innerHTML = '';

  allDevices.forEach(
    deviceInfo => {
      const card = document.createElement('div');
      card.className = "device-card";
      card.id = deviceInfo.id
      let statusText
      if (deviceInfo.status == 'on') {
        statusText = '开启'
      } else {
        statusText = '关闭'
      }

      card.innerHTML = ` 
                        <div class="device-icon">
                            <!-- 设置图标 -->
                            <span class="iconfont">&#xe69e;</span>
                        </div>
                        <div class="device-info">
                            <h3 class="device-name">${deviceInfo.name}</h3>
                            <p class="device-location">${deviceInfo.location}</p>
                            <div class="device-status">
                                <!-- 通过js控制样式是选择on还是off，status-text的内容是开启还是关闭 -->
                                <div class="status-icon ${deviceInfo.status}"></div>
                                <div class="status-text">${statusText}</div>
                            </div>
                            <!-- 控制开关与详情按钮 -->
                            <div class="device-control">
                                <label class="switch">
                                    <!-- 使用三目运算符来确定初始化时是否添加checked选中状态 -->
                                    <input type="checkbox" class="switch-input" id="switch-input-${deviceInfo.id}" ${deviceInfo.status == 'on' ? 'checked' : ''}>
                                    <div class="check-btn"></div>
                                </label>
                                <button class="details-btn" id="${deviceInfo.id}">详情</button>
                            </div>
                        </div>
                    `


      cardList.appendChild(card)
    }
  )
  updatedDeviceRunNum()
  addListeners()
}

//获取全部设备数据
function getAllDevicesInfo() {

  // 使用jquery与ajax获取所有设备数据
  $.ajax({
    type: 'GET',
    url: `${API_URL}`,
    dataType: 'JSON',
    success: function (res) {
      allDevices = res;
      console.log(allDevices);
      reloadCardList()
    }
  });

}


// 更新所有开启设备的数量
function updatedDeviceRunNum() {
  const deviceRunNum = document.getElementById('DeviceRunNum');
  let sumRunNum = 0;
  deviceRunNum.innerText = '';

  // 遍历allDevices数据集,判断开启状态进行计数
  allDevices.forEach(
    deviceInfo => {
      if (deviceInfo.status == 'on') {
        sumRunNum = sumRunNum + 1;
      }
    }
  )

  console.log(sumRunNum)
  deviceRunNum.innerText = `${sumRunNum}`;
}

// 重新加载函数
// 通过调用获取全部设备数据与更新事件函数来实现
function refreshDevices() {
  getAllDevicesInfo()
  updatedLastTime()
}




updatedLastTime()
getAllDevicesInfo()
