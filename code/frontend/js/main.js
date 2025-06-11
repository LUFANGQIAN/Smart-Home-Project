/**
 * 智能家居控制系统 - 主脚本
 * 负责与后端API交互并动态更新UI
 */

// 全局变量

// API接口URL
const API_URL = 'https://api.olxok.top/api/devices';
// 所有设备数据
let allDevices = [];
//所有图标键值对
const cardIconSet = {
  light: "&#xe69e;",
  thermostat: "&#xe61e;",
  outlet: "&#xe718;",
  fan: "&#xe602;",
  speaker: "&#xe600;",
  camera: "&#xeca5;"
}


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
  lastTime.innerHTML = updatedTime;
}

// 添加控制开关监听事件
function addSwitchListeners() {
  allDevices.forEach(deviceInfo => {
    const switchInput = document.getElementById(`switch-input-${deviceInfo.id}`);
    switchInput.addEventListener('change', function () {
      updatedDeviceStatus(deviceInfo.id, this.checked ? 'on' : 'off');
    });
  });
}

//添加详情按钮跳转页面监听事件
function addJumpLinkListeners() {
  allDevices.forEach(deviceInfo => {
    const detailsBtn = document.getElementById(`details-btn-${deviceInfo.id}`);
    detailsBtn.addEventListener('click', function () {
      window.location.href = `device.html?id=${deviceInfo.id}`;
      console.log("`device.html?id=${device.id}`")
    });
  });
}

//添加所有监听事件函数
function addListeners() {
  addSwitchListeners()
  addJumpLinkListeners()
}

//查找字体图标编号函数
function findFonticonNum(deviceType) {
  if (cardIconSet[deviceType] == undefined) {
    return '&#xe606;';
  }
  else {
    return cardIconSet[deviceType];
  }

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

      //根据开关状态选择文本
      let statusText;
      if (deviceInfo.status == 'on') {
        statusText = '开启'
      } else {
        statusText = '关闭'
      }

      //选择图标代码
      let cardIcon;
      cardIcon = findFonticonNum(deviceInfo.type)

      card.innerHTML = ` 
                        <div class="device-icon">
                            <!-- 设置图标 -->
                            <span class="iconfont">${cardIcon}</span>
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
                                <button class="details-btn" id="details-btn-${deviceInfo.id}">详情</button>
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


// 应用程序入口函数
function init() {
  // 初始化时间显示
  updatedLastTime();
  
  // 获取设备数据并渲染界面
  getAllDevicesInfo();

}

// 页面加载完成后执行初始化
document.addEventListener('DOMContentLoaded', init);

