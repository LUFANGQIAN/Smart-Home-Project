/**
 * 智能家居控制系统 - 设备详情页脚本
 * 负责获取单个设备详情并提供高级控制功能
 */

//全局变量
let pageId = null;
const API_URL = 'https://api.olxok.top/api/devices';
let thisDeviceInfo = null;
//所有图标键值对
const cardIconSet = {
  light: "&#xe69e;",
  thermostat: "&#xe61e;",
  outlet: "&#xe718;",
  fan: "&#xe602;",
  speaker: "&#xe600;",
  camera: "&#xeca5;"
}


// 获取触发详情页的卡片id
function getPageId() {
  const urlParams = new URLSearchParams(window.location.search);
  pageId = urlParams.get('id');
  console.log(pageId)
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

// 添加控制开关监听事件
function addSwitchListeners() {
  const switchInput = document.getElementById(`switch-input-${thisDeviceInfo.id}`);
  switchInput.addEventListener('change', function () {
    updatedDeviceStatus(thisDeviceInfo.id, this.checked ? 'on' : 'off');
  });
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
      thisDeviceInfo.status = newDeviceStatus


      // 重绘卡片区域
      renderDevicePower()

    }
  });
}

// 更新设备设置
function updateDeviceSetting(deviceId, settingName, settingValue) {

  const updateData = {
    setting: settingName,
    value: settingValue
  };

  // 使用ajax的put请求更新数据
  $.ajax({
    url: `${API_URL}/${deviceId}/status`,
    method: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify(updateData),
    success: function (response) {
      console.log(`设备 ${deviceId} ${settingName} 已更新为 ${settingValue}`);
    }
  });
}



//获取当前页面设备的相关信息并初始化
function getThisPageDeviceInfo() {
  // 优先获取当前页面id
  getPageId()

  $.ajax({
    type: 'GET',
    url: `${API_URL}/${pageId}`,
    dataType: 'JSON',
    success: function (res) {
      thisDeviceInfo = res;
      console.log(thisDeviceInfo);
      renderDevicePower();
      selectControlPanelType(thisDeviceInfo.type);
    }
  });
}

//加载控制头部区域
function renderDevicePower() {
  const headerCard = document.getElementById('device-header')

  let statusText;
  if (thisDeviceInfo.status == 'on') {
    statusText = '开启'
  } else {
    statusText = '关闭'
  }

  //选择图标代码
  let cardIcon;
  cardIcon = findFonticonNum(thisDeviceInfo.type)

  headerCard.innerHTML = `<div class="icon-and-info">
                    <div class="device-icon">
                        <span class="iconfont">${cardIcon}</span>
                    </div>

                    <div class="device-title">
                        <h2 id="device-name">${thisDeviceInfo.name}</h2>
                        <p id="device-location">${thisDeviceInfo.location}</p>
                        <div class="device-status">
                            <span class="status-icon ${thisDeviceInfo.status}" id="status-indicator"></span>
                            <span class="status-text" id="status-text">${statusText}</span>
                        </div>
                    </div>
                </div>
                
                <label class="switch">
                    <input type="checkbox" class="switch-input" id="switch-input-${thisDeviceInfo.id}" ${thisDeviceInfo.status == 'on' ? 'checked' : ''}>
                    <div class="check-btn"></div>
                </label>`

  addSwitchListeners()
}

//选择控制面板函数
function selectControlPanelType(deviceType) {

  switch (deviceType) {
    case "light":
      console.log("老登控制面板");
      creatLightControlPanel()
      break;
    case "thermostat":
      console.log("空调控制面板");
      creatThermostatControlPanel()
      break;
    case "fan":
      console.log("风扇控制面板");
      creatFanControlPanel()
      break;
    case "speaker":
      console.log("音响控制面板");
      creatSpeakerControlPanel()
      break;
    default:
      console.log("无功能控制面板");
      creatNoneControlPanel()
  }
}


// 构造老登控制面板函数
function creatLightControlPanel() {
  lightContorlPanel = document.getElementById('slider-control')

  lightContorlPanel.innerHTML = ''

  lightContorlPanel.innerHTML =
    `
    <div class="slider-control">
      <div class="slider-title">
        <span class="slider-label">亮度</span>
        <span class="slider-value" id="brightness-value">${thisDeviceInfo.settings.brightness}%</span>
      </div>
      <input type="range" class="range-slider" min="1" max="100" value="${thisDeviceInfo.settings.brightness}" id="brightness-slider">
    </div>

    <div class="slider-control">
      <div class="slider-title">
        <span class="slider-label" >色温</span>
        <span class="slider-value" id="color-temperature-value">${thisDeviceInfo.settings.colorTemp}K</span>
      </div>
      <input type="range" class="range-slider" min="2700" max="6500" step="100" value="${thisDeviceInfo.settings.colorTemp}" id="color-temperature-slider">
    </div>

    <div class="control-group">
      <h4>场景</h4>
      <div class="button-control-list">
        <button class="control-btn" data-scene="reading">
          <div class="control-btn-icon">
            <span class="iconfont">&#xe6ca;</span>
          </div>
          <div>阅读</div>
        </button>
        <button class="control-btn" data-scene="relaxing">
          <div class="control-btn-icon">
            <span class="iconfont">&#xe60b;</span>
          </div>
          <div>放松</div>
        </button>
        <button class="control-btn" data-scene="working">
          <div class="control-btn-icon">
            <span class="iconfont">&#xe8af;</span>
          </div>
          <div>工作</div>
        </button>
        <button class="control-btn" data-scene="movie">
          <div class="control-btn-icon">
            <span class="iconfont">&#xe6e3;</span>
          </div>
          <div>电影</div>
        </button>
      </div>
    </div>`

  // 绑定亮度滑动条监听事件
  brightnessSlider = document.getElementById('brightness-slider');
  brightnessSlider.addEventListener('change', function () {
    let value = brightnessSlider.value
    updateDeviceSetting(thisDeviceInfo.id, 'brightness', value);
  });
  brightnessSlider.addEventListener('input', function () {
    let value = brightnessSlider.value
    document.getElementById('brightness-value').innerText = value + '%';
  });

  // 绑定色温滑动条监听事件
  colorTemperatureSlider = document.getElementById('color-temperature-slider');
  colorTemperatureSlider.addEventListener('change', function () {
    let value = colorTemperatureSlider.value
    updateDeviceSetting(thisDeviceInfo.id, 'colorTemp', value);
  });
  colorTemperatureSlider.addEventListener('input', function () {
    let value = colorTemperatureSlider.value
    document.getElementById('color-temperature-value').innerText = value + 'K';
  });

  // 获取所有场景按钮
  const sceneButtons = document.querySelectorAll('.control-btn');

  sceneButtons.forEach(button => {
    button.addEventListener('click', function () {
      const scene = this.dataset.scene;
      console.log(scene);

      // 移除其他按钮的 active 状态
      sceneButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      // 场景参数设置
      let brightness, colorTemp;
      switch (scene) {
        case 'reading': [brightness, colorTemp] = [80, 5000]; break;
        case 'relaxing': [brightness, colorTemp] = [40, 3000]; break;
        case 'working': [brightness, colorTemp] = [100, 6000]; break;
        case 'movie': [brightness, colorTemp] = [30, 2700]; break;
      }

      // 调用现有 API 函数
      updateDeviceSetting(thisDeviceInfo.id, 'scene', scene);
      updateDeviceSetting(thisDeviceInfo.id, 'brightness', brightness);
      updateDeviceSetting(thisDeviceInfo.id, 'colorTemp', colorTemp);

      //更新本地缓存
      document.getElementById('brightness-value').innerText = brightness + '%';
      document.getElementById('color-temperature-value').innerText = colorTemp + 'K';
      brightnessSlider.value = brightness;
      colorTemperatureSlider.value = colorTemp;
    });
  });


}

// 构造空调控制面板函数
function creatThermostatControlPanel() {

  thermostatContorlPanel = document.getElementById('slider-control')

  thermostatContorlPanel.innerHTML = ''

  thermostatContorlPanel.innerHTML =
    `
    <div class="slider-control">
      <div class="slider-title">
        <span class="slider-label">温度设置</span>
        <span class="slider-value" id="temperature-value">${thisDeviceInfo.settings.temperature}°C</span>
      </div>
      <input type="range" class="range-slider" min="16" max="30" step="0.5" value="${thisDeviceInfo.settings.temperature}" id="temperature-slider">
    </div>



    <div class="control-group">
      <h4>模式</h4>
      <div class="button-control-list">
        <button class="control-btn" data-mode="cool">
          <div class="control-btn-icon">
            <span class="iconfont">&#xe638;</span>
          </div>
          <div>制冷</div>
        </button>
        <button class="control-btn" data-mode="heat">
          <div class="control-btn-icon">
            <span class="iconfont">&#xe634;</span>
          </div>
          <div>制热</div>
        </button>
        <button class="control-btn" data-mode="fan">
          <div class="control-btn-icon">
            <span class="iconfont">&#xe602;</span>
          </div>
          <div>通风</div>
        </button>
        <button class="control-btn" data-mode="auto">
          <div class="control-btn-icon">
            <span class="iconfont">&#xe68a;</span>
          </div>
          <div>自动</div>
        </button>
      </div>
    </div>`

  // 绑定空调温度滑动条监听事件
  temperatureSlider = document.getElementById('temperature-slider');
  temperatureSlider.addEventListener('change', function () {
    let value = temperatureSlider.value
    updateDeviceSetting(thisDeviceInfo.id, 'temperature', value);
  });
  temperatureSlider.addEventListener('input', function () {
    let value = temperatureSlider.value
    document.getElementById('temperature-value').innerText = value + '°C';
  });



  // 获取所有场景按钮
  const modeButtons = document.querySelectorAll('.control-btn');

  modeButtons.forEach(button => {
    button.addEventListener('click', function () {
      const mode = this.dataset.mode;
      console.log(mode);

      // 移除其他按钮的 active 状态
      modeButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      // 场景参数设置
      let temperatureMode;
      switch (mode) {
        case 'cool': temperatureMode = 17; break;
        case 'heat': temperatureMode = 30; break;
        case 'fan': temperatureMode = 26; break;
        case 'auto': temperatureMode = 24; break;
      }

      // 调用现有 API 函数
      updateDeviceSetting(thisDeviceInfo.id, 'mode', mode);
      updateDeviceSetting(thisDeviceInfo.id, 'temperature', temperatureMode);


      //更新本地缓存
      document.getElementById('temperature-value').innerText = temperatureMode + '°C';
      temperatureSlider.value = temperatureMode;

    });
  });

}

// 构造风扇控制面板函数
function creatFanControlPanel() {

  fanContorlPanel = document.getElementById('slider-control')

  fanContorlPanel.innerHTML = ''

  fanContorlPanel.innerHTML =
    `
<div class="slider-control">
  <div class="slider-title">
    <span class="slider-label">风速</span>
    <span class="slider-value" id="speed-value">${thisDeviceInfo.settings.speed}</span>
  </div>
  <input type="range" class="range-slider" min="1" max="5" value="${thisDeviceInfo.settings.speed}" id="speed-slider">
</div>



<div class="control-group">
  <h4>模式</h4>
  <div class="button-control-list">
    <button class="control-btn" data-mode="normal">
      <div class="control-btn-icon">
        <span class="iconfont">&#xe603;</span>
      </div>
      <div>正常</div>
    </button>
    <button class="control-btn" data-mode="natural">
      <div class="control-btn-icon">
        <span class="iconfont">&#xe601;</span>
      </div>
      <div>自然</div>
    </button>
    <button class="control-btn" data-mode="sleep">
      <div class="control-btn-icon">
        <span class="iconfont">&#xe719;</span>
      </div>
      <div>睡眠</div>
    </button>
  </div>
</div>


<h4>摇头</h4>
<div class="fan-oscillation">
  <label class="switch">
    <input type="checkbox" class="switch-input" id="switch-oscillation-${thisDeviceInfo.id}" ${thisDeviceInfo.settings.oscillation ? 'checked' : ''}>
    <div class="check-btn"></div>

  </label>
  <div class="fan-oscillation-state" id="fanOscillationState">${thisDeviceInfo.settings.oscillation ? '开启' : '关闭'}</div>
</div>
`


  // 绑定空调温度滑动条监听事件
  speedSlider = document.getElementById('speed-slider');
  speedSlider.addEventListener('change', function () {
    let value = speedSlider.value
    updateDeviceSetting(thisDeviceInfo.id, 'speed', value);
  });
  speedSlider.addEventListener('input', function () {
    let value = speedSlider.value
    document.getElementById('speed-value').innerText = value;
  });



  // 获取所有场景按钮
  const modeButtons = document.querySelectorAll('.control-btn');

  modeButtons.forEach(button => {
    button.addEventListener('click', function () {
      const mode = this.dataset.mode;
      console.log(mode);

      // 移除其他按钮的 active 状态
      modeButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      // 场景参数设置
      let speedMode;
      switch (mode) {
        case 'normal': speedMode = 5; break;
        case 'natural': speedMode = 3; break;
        case 'sleep': speedMode = 1; break;
      }

      // 调用现有 API 函数
      updateDeviceSetting(thisDeviceInfo.id, 'mode', mode);
      updateDeviceSetting(thisDeviceInfo.id, 'speed', speedMode);


      //更新本地缓存
      document.getElementById('speed-value').innerText = speedMode;
      speedSlider.value = speedMode;

    });
  });

  //风扇摇头开关
  const switchInput = document.getElementById(`switch-oscillation-${thisDeviceInfo.id}`);
  const switchText = document.getElementById('fanOscillationState')
  switchInput.addEventListener('change', function () {
    updateDeviceSetting(thisDeviceInfo.id, "oscillation", this.checked ? true : false);
    switchText.innerText = ''
    switchText.innerText = `${this.checked ? '开启' : '关闭'}`
  });
}

// 构造音响控制面板函数
function creatSpeakerControlPanel() {

}

// 构造无功能控制面板函数
function creatNoneControlPanel() {

}


getThisPageDeviceInfo()



