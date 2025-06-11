/**
 * 智能家居控制系统 - 设备详情页脚本
 * 负责获取单个设备详情并提供高级控制功能
 */

// 全局变量
const API_BASE_URL = 'https://api.olxok.top/api';
let currentDevice = null;

// 页面加载完成后执行
$(document).ready(function() {
    // 获取URL参数中的设备ID
    const urlParams = new URLSearchParams(window.location.search);
    const deviceId = urlParams.get('id');
    
    // 如果没有设备ID，返回首页
    if (!deviceId) {
        window.location.href = 'index.html';
        return;
    }
    
    // 加载设备详情
    loadDeviceDetails(deviceId);
    
    // 绑定电源开关事件
    $('#device-power-toggle').change(function() {
        toggleDeviceStatus(deviceId, this.checked ? 'on' : 'off');
    });
});

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

/**
 * 渲染设备详情
 * @param {Object} device - 设备数据
 */
function renderDeviceDetails(device) {
    // 设置设备基本信息
    $('#device-name').text(device.name);
    $('#device-location').text(device.location);
    $('#device-id').text(device.id);
    $('#device-type').text(getDeviceTypeName(device.type));
    $('#device-manufacturer').text(device.manufacturer || '未知');
    $('#device-model').text(device.model || '未知');
    $('#device-firmware').text(device.firmware || '未知');
    $('#device-connection').text(device.connection || '未知');
    $('#device-added').text(device.addedDate || '未知');
    $('#device-last-active').text(device.lastActive || '未知');
    
    // 设置设备图标
    $('#device-icon-main').attr('class', getDeviceIcon(device.type));
    
    // 设置设备状态
    updateDeviceStatus(device.status);
    
    // 设置电源开关状态
    $('#device-power-toggle').prop('checked', device.status === 'on');
    
    // 根据设备类型渲染控制面板
    renderControlPanel(device);
    
    // 渲染操作历史
    renderDeviceHistory(device.history || []);
}

/**
 * 更新设备状态UI
 * @param {string} status - 设备状态
 */
function updateDeviceStatus(status) {
    const statusIndicator = $('#status-indicator');
    const statusText = $('#status-text');
    
    if (status === 'on') {
        statusIndicator.removeClass('off').addClass('on');
        statusText.text('开启');
    } else {
        statusIndicator.removeClass('on').addClass('off');
        statusText.text('关闭');
    }
}

/**
 * 根据设备类型获取对应的图标类名
 * @param {string} deviceType - 设备类型
 * @returns {string} - 图标类名
 */
function getDeviceIcon(deviceType) {
    const iconMap = {
        'light': 'fas fa-lightbulb',
        'thermostat': 'fas fa-temperature-high',
        'fan': 'fas fa-fan',
        'tv': 'fas fa-tv',
        'speaker': 'fas fa-volume-up',
        'camera': 'fas fa-video',
        'lock': 'fas fa-lock',
        'outlet': 'fas fa-plug'
    };
    
    return iconMap[deviceType] || 'fas fa-microchip';
}

/**
 * 获取设备类型的中文名称
 * @param {string} deviceType - 设备类型
 * @returns {string} - 设备类型中文名称
 */
function getDeviceTypeName(deviceType) {
    const typeMap = {
        'light': '智能灯',
        'thermostat': '温控器',
        'fan': '风扇',
        'tv': '电视',
        'speaker': '音箱',
        'camera': '摄像头',
        'lock': '智能锁',
        'outlet': '智能插座'
    };
    
    return typeMap[deviceType] || '未知设备';
}

/**
 * 根据设备类型渲染控制面板
 * @param {Object} device - 设备数据
 */
function renderControlPanel(device) {
    const controlPanel = $('#control-panel');
    controlPanel.empty();
    
    // 根据设备类型渲染不同的控制面板
    switch (device.type) {
        case 'light':
            renderLightControls(device, controlPanel);
            break;
        case 'thermostat':
            renderThermostatControls(device, controlPanel);
            break;
        case 'fan':
            renderFanControls(device, controlPanel);
            break;
        case 'speaker':
            renderSpeakerControls(device, controlPanel);
            break;
        default:
            controlPanel.html('<p class="no-controls">此设备没有高级控制选项</p>');
    }
}

/**
 * 渲染智能灯控制面板
 * @param {Object} device - 设备数据
 * @param {jQuery} container - 控制面板容器
 */
function renderLightControls(device, container) {
    const settings = device.settings || {};
    
    // 创建亮度滑块
    const brightnessControl = $(`
        <div class="slider-control">
            <div class="slider-header">
                <span class="slider-label">亮度</span>
                <span class="slider-value">${settings.brightness || 100}%</span>
            </div>
            <input type="range" class="range-slider" id="brightness-slider" 
                min="1" max="100" value="${settings.brightness || 100}">
        </div>
    `);
    
    // 创建色温滑块
    const colorTempControl = $(`
        <div class="slider-control">
            <div class="slider-header">
                <span class="slider-label">色温</span>
                <span class="slider-value">${settings.colorTemp || 5000}K</span>
            </div>
            <input type="range" class="range-slider" id="color-temp-slider" 
                min="2700" max="6500" step="100" value="${settings.colorTemp || 5000}">
        </div>
    `);
    
    // 创建场景按钮
    const scenesControl = $(`
        <div class="control-group">
            <h4>场景</h4>
            <div class="button-control">
                <button class="control-btn" data-scene="reading">
                    <i class="fas fa-book"></i>
                    <span>阅读</span>
                </button>
                <button class="control-btn" data-scene="relaxing">
                    <i class="fas fa-couch"></i>
                    <span>放松</span>
                </button>
                <button class="control-btn" data-scene="working">
                    <i class="fas fa-briefcase"></i>
                    <span>工作</span>
                </button>
                <button class="control-btn" data-scene="movie">
                    <i class="fas fa-film"></i>
                    <span>电影</span>
                </button>
            </div>
        </div>
    `);
    
    // 添加到容器
    container.append(brightnessControl);
    container.append(colorTempControl);
    container.append(scenesControl);
    
    // 绑定亮度滑块事件
    $('#brightness-slider').on('input', function() {
        const value = $(this).val();
        $(this).closest('.slider-control').find('.slider-value').text(value + '%');
    });
    
    $('#brightness-slider').on('change', function() {
        const value = $(this).val();
        updateDeviceSetting(device.id, 'brightness', value);
    });
    
    // 绑定色温滑块事件
    $('#color-temp-slider').on('input', function() {
        const value = $(this).val();
        $(this).closest('.slider-control').find('.slider-value').text(value + 'K');
    });
    
    $('#color-temp-slider').on('change', function() {
        const value = $(this).val();
        updateDeviceSetting(device.id, 'colorTemp', value);
    });
    
    // 绑定场景按钮事件
    $('.control-btn[data-scene]').click(function() {
        const scene = $(this).data('scene');
        
        // 移除其他按钮的active类
        $('.control-btn[data-scene]').removeClass('active');
        
        // 添加当前按钮的active类
        $(this).addClass('active');
        
        // 根据场景设置不同的亮度和色温
        let brightness, colorTemp;
        
        switch (scene) {
            case 'reading':
                brightness = 80;
                colorTemp = 5000;
                break;
            case 'relaxing':
                brightness = 40;
                colorTemp = 3000;
                break;
            case 'working':
                brightness = 100;
                colorTemp = 6000;
                break;
            case 'movie':
                brightness = 30;
                colorTemp = 2700;
                break;
        }
        
        // 更新滑块值和显示
        $('#brightness-slider').val(brightness);
        $('#brightness-slider').closest('.slider-control').find('.slider-value').text(brightness + '%');
        
        $('#color-temp-slider').val(colorTemp);
        $('#color-temp-slider').closest('.slider-control').find('.slider-value').text(colorTemp + 'K');
        
        // 更新设备设置
        updateDeviceSetting(device.id, 'scene', scene);
    });
}

/**
 * 渲染温控器控制面板
 * @param {Object} device - 设备数据
 * @param {jQuery} container - 控制面板容器
 */
function renderThermostatControls(device, container) {
    const settings = device.settings || {};
    
    // 创建温度滑块
    const temperatureControl = $(`
        <div class="slider-control">
            <div class="slider-header">
                <span class="slider-label">温度设置</span>
                <span class="slider-value">${settings.temperature || 24}°C</span>
            </div>
            <input type="range" class="range-slider" id="temperature-slider" 
                min="16" max="30" step="0.5" value="${settings.temperature || 24}">
        </div>
    `);
    
    // 创建模式按钮
    const modeControl = $(`
        <div class="control-group">
            <h4>模式</h4>
            <div class="button-control">
                <button class="control-btn ${settings.mode === 'cool' ? 'active' : ''}" data-mode="cool">
                    <i class="fas fa-snowflake"></i>
                    <span>制冷</span>
                </button>
                <button class="control-btn ${settings.mode === 'heat' ? 'active' : ''}" data-mode="heat">
                    <i class="fas fa-fire"></i>
                    <span>制热</span>
                </button>
                <button class="control-btn ${settings.mode === 'fan' ? 'active' : ''}" data-mode="fan">
                    <i class="fas fa-fan"></i>
                    <span>通风</span>
                </button>
                <button class="control-btn ${settings.mode === 'auto' ? 'active' : ''}" data-mode="auto">
                    <i class="fas fa-magic"></i>
                    <span>自动</span>
                </button>
            </div>
        </div>
    `);
    
    // 添加到容器
    container.append(temperatureControl);
    container.append(modeControl);
    
    // 绑定温度滑块事件
    $('#temperature-slider').on('input', function() {
        const value = $(this).val();
        $(this).closest('.slider-control').find('.slider-value').text(value + '°C');
    });
    
    $('#temperature-slider').on('change', function() {
        const value = $(this).val();
        updateDeviceSetting(device.id, 'temperature', value);
    });
    
    // 绑定模式按钮事件
    $('.control-btn[data-mode]').click(function() {
        const mode = $(this).data('mode');
        
        // 移除其他按钮的active类
        $('.control-btn[data-mode]').removeClass('active');
        
        // 添加当前按钮的active类
        $(this).addClass('active');
        
        // 更新设备设置
        updateDeviceSetting(device.id, 'mode', mode);
    });
}

/**
 * 渲染风扇控制面板
 * @param {Object} device - 设备数据
 * @param {jQuery} container - 控制面板容器
 */
function renderFanControls(device, container) {
    const settings = device.settings || {};
    
    // 创建风速滑块
    const speedControl = $(`
        <div class="slider-control">
            <div class="slider-header">
                <span class="slider-label">风速</span>
                <span class="slider-value">${settings.speed || 1}</span>
            </div>
            <input type="range" class="range-slider" id="speed-slider" 
                min="1" max="5" step="1" value="${settings.speed || 1}">
        </div>
    `);
    
    // 创建模式按钮
    const modeControl = $(`
        <div class="control-group">
            <h4>模式</h4>
            <div class="button-control">
                <button class="control-btn ${settings.mode === 'normal' ? 'active' : ''}" data-mode="normal">
                    <i class="fas fa-wind"></i>
                    <span>正常</span>
                </button>
                <button class="control-btn ${settings.mode === 'natural' ? 'active' : ''}" data-mode="natural">
                    <i class="fas fa-leaf"></i>
                    <span>自然风</span>
                </button>
                <button class="control-btn ${settings.mode === 'sleep' ? 'active' : ''}" data-mode="sleep">
                    <i class="fas fa-moon"></i>
                    <span>睡眠</span>
                </button>
            </div>
        </div>
    `);
    
    // 创建摇头开关
    const oscillationControl = $(`
        <div class="control-group">
            <h4>摇头</h4>
            <div class="oscillation-control">
                <label class="switch">
                    <input type="checkbox" id="oscillation-toggle" ${settings.oscillation ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
                <span>${settings.oscillation ? '开启' : '关闭'}</span>
            </div>
        </div>
    `);
    
    // 添加到容器
    container.append(speedControl);
    container.append(modeControl);
    container.append(oscillationControl);
    
    // 绑定风速滑块事件
    $('#speed-slider').on('input', function() {
        const value = $(this).val();
        $(this).closest('.slider-control').find('.slider-value').text(value);
    });
    
    $('#speed-slider').on('change', function() {
        const value = $(this).val();
        updateDeviceSetting(device.id, 'speed', value);
    });
    
    // 绑定模式按钮事件
    $('.control-btn[data-mode]').click(function() {
        const mode = $(this).data('mode');
        
        // 移除其他按钮的active类
        $('.control-btn[data-mode]').removeClass('active');
        
        // 添加当前按钮的active类
        $(this).addClass('active');
        
        // 更新设备设置
        updateDeviceSetting(device.id, 'mode', mode);
    });
    
    // 绑定摇头开关事件
    $('#oscillation-toggle').change(function() {
        const value = $(this).prop('checked');
        $(this).closest('.oscillation-control').find('span').text(value ? '开启' : '关闭');
        updateDeviceSetting(device.id, 'oscillation', value);
    });
}

/**
 * 渲染音箱控制面板
 * @param {Object} device - 设备数据
 * @param {jQuery} container - 控制面板容器
 */
function renderSpeakerControls(device, container) {
    const settings = device.settings || {};
    
    // 创建音量滑块
    const volumeControl = $(`
        <div class="slider-control">
            <div class="slider-header">
                <span class="slider-label">音量</span>
                <span class="slider-value">${settings.volume || 50}%</span>
            </div>
            <input type="range" class="range-slider" id="volume-slider" 
                min="0" max="100" value="${settings.volume || 50}">
        </div>
    `);
    
    // 创建播放控制
    const playbackControl = $(`
        <div class="control-group">
            <h4>播放控制</h4>
            <div class="button-control">
                <button class="control-btn" id="prev-btn">
                    <i class="fas fa-step-backward"></i>
                    <span>上一曲</span>
                </button>
                <button class="control-btn" id="play-pause-btn">
                    <i class="fas ${settings.playing ? 'fa-pause' : 'fa-play'}"></i>
                    <span>${settings.playing ? '暂停' : '播放'}</span>
                </button>
                <button class="control-btn" id="next-btn">
                    <i class="fas fa-step-forward"></i>
                    <span>下一曲</span>
                </button>
            </div>
        </div>
    `);
    
    // 创建均衡器设置
    const equalizerControl = $(`
        <div class="control-group">
            <h4>均衡器</h4>
            <div class="button-control">
                <button class="control-btn ${settings.equalizer === 'normal' ? 'active' : ''}" data-eq="normal">
                    <i class="fas fa-sliders-h"></i>
                    <span>正常</span>
                </button>
                <button class="control-btn ${settings.equalizer === 'bass' ? 'active' : ''}" data-eq="bass">
                    <i class="fas fa-drum"></i>
                    <span>重低音</span>
                </button>
                <button class="control-btn ${settings.equalizer === 'vocal' ? 'active' : ''}" data-eq="vocal">
                    <i class="fas fa-microphone"></i>
                    <span>人声</span>
                </button>
                <button class="control-btn ${settings.equalizer === 'rock' ? 'active' : ''}" data-eq="rock">
                    <i class="fas fa-guitar"></i>
                    <span>摇滚</span>
                </button>
            </div>
        </div>
    `);
    
    // 添加到容器
    container.append(volumeControl);
    container.append(playbackControl);
    container.append(equalizerControl);
    
    // 绑定音量滑块事件
    $('#volume-slider').on('input', function() {
        const value = $(this).val();
        $(this).closest('.slider-control').find('.slider-value').text(value + '%');
    });
    
    $('#volume-slider').on('change', function() {
        const value = $(this).val();
        updateDeviceSetting(device.id, 'volume', value);
    });
    
    // 绑定播放控制按钮事件
    $('#play-pause-btn').click(function() {
        const isPlaying = $(this).find('i').hasClass('fa-pause');
        
        if (isPlaying) {
            $(this).find('i').removeClass('fa-pause').addClass('fa-play');
            $(this).find('span').text('播放');
        } else {
            $(this).find('i').removeClass('fa-play').addClass('fa-pause');
            $(this).find('span').text('暂停');
        }
        
        updateDeviceSetting(device.id, 'playing', !isPlaying);
    });
    
    $('#prev-btn').click(function() {
        // 模拟上一曲操作
        console.log('上一曲');
    });
    
    $('#next-btn').click(function() {
        // 模拟下一曲操作
        console.log('下一曲');
    });
    
    // 绑定均衡器按钮事件
    $('.control-btn[data-eq]').click(function() {
        const eq = $(this).data('eq');
        
        // 移除其他按钮的active类
        $('.control-btn[data-eq]').removeClass('active');
        
        // 添加当前按钮的active类
        $(this).addClass('active');
        
        // 更新设备设置
        updateDeviceSetting(device.id, 'equalizer', eq);
    });
}

/**
 * 更新设备设置
 * @param {string} deviceId - 设备ID
 * @param {string} setting - 设置名称
 * @param {any} value - 设置值
 */
function updateDeviceSetting(deviceId, setting, value) {
    // 构建更新数据
    const updateData = {
        setting: setting,
        value: value
    };
    
    // 发起AJAX请求更新设备设置
    $.ajax({
        url: `${API_BASE_URL}/devices/${deviceId}/status`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(updateData),
        success: function(response) {
            console.log(`设备 ${deviceId} 的 ${setting} 已更新为 ${value}`);
            
            // 更新本地数据
            if (!currentDevice.settings) {
                currentDevice.settings = {};
            }
            currentDevice.settings[setting] = value;
        },
        error: function(xhr, status, error) {
            console.error(`更新设备设置失败: ${error}`);
            alert(`更新设备设置失败: ${error}`);
        }
    });
}

/**
 * 切换设备状态
 * @param {string} deviceId - 设备ID
 * @param {string} newStatus - 新状态 ('on' 或 'off')
 */
function toggleDeviceStatus(deviceId, newStatus) {
    // 发起AJAX请求更新设备状态
    $.ajax({
        url: `${API_BASE_URL}/devices/${deviceId}/status`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ status: newStatus }),
        success: function(response) {
            console.log(`设备 ${deviceId} 状态已更新为 ${newStatus}`);
            
            // 更新本地数据
            currentDevice.status = newStatus;
            
            // 更新UI
            updateDeviceStatus(newStatus);
        },
        error: function(xhr, status, error) {
            console.error(`更新设备状态失败: ${error}`);
            
            // 恢复开关状态
            $('#device-power-toggle').prop('checked', newStatus === 'off');
            
            // 显示错误提示
            alert(`更新设备状态失败: ${error}`);
        }
    });
}

/**
 * 渲染设备操作历史
 * @param {Array} history - 历史记录数组
 */
function renderDeviceHistory(history) {
    const historyList = $('#history-list');
    historyList.empty();
    
    // 如果没有历史记录，显示提示信息
    if (history.length === 0) {
        historyList.html('<p class="no-history">暂无操作历史</p>');
        return;
    }
    
    // 遍历历史记录，创建历史项
    history.forEach(item => {
        const historyItem = $(`
            <div class="history-item">
                <div class="history-icon">
                    <i class="${getHistoryIcon(item.action)}"></i>
                </div>
                <div class="history-content">
                    <div class="history-action">${item.description}</div>
                    <div class="history-time">${item.time}</div>
                </div>
            </div>
        `);
        
        historyList.append(historyItem);
    });
}

/**
 * 获取历史操作对应的图标
 * @param {string} action - 操作类型
 * @returns {string} - 图标类名
 */
function getHistoryIcon(action) {
    const iconMap = {
        'power': 'fas fa-power-off',
        'setting': 'fas fa-sliders-h',
        'mode': 'fas fa-exchange-alt',
        'schedule': 'fas fa-clock',
        'update': 'fas fa-sync-alt'
    };
    
    return iconMap[action] || 'fas fa-history';
}
