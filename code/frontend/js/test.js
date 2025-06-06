/**
 * 智能家居控制系统 - 主脚本
 * 负责与后端API交互并动态更新UI
 */

// 全局变量
const API_BASE_URL = 'https://api.olxok.top/api';
let allDevices = [];

// 页面加载完成后执行
$(document).ready(function() {
    // 初始化页面
    initPage();
    
    // 绑定刷新按钮事件
    $('#refresh-devices').click(function() {
        loadDevices();
    });
});

/**
 * 初始化页面
 */
function initPage() {
    // 更新最后更新时间
    updateLastUpdatedTime();
    
    // 加载设备列表
    loadDevices();
}

/**
 * 更新最后更新时间
 */
function updateLastUpdatedTime() {
    const now = new Date();
    const formattedTime = `${now.getFullYear()}-${padZero(now.getMonth() + 1)}-${padZero(now.getDate())} ${padZero(now.getHours())}:${padZero(now.getMinutes())}:${padZero(now.getSeconds())}`;
    $('#last-updated-time').text(formattedTime);
}

/**
 * 数字补零
 * @param {number} num - 需要补零的数字
 * @returns {string} - 补零后的字符串
 */
function padZero(num) {
    return num < 10 ? `0${num}` : num;
}

/**
 * 加载设备列表
 */
function loadDevices() {
    // 显示加载动画
    $('#devices-container').html('<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i><p>正在加载设备...</p></div>');
    
    // 发起AJAX请求获取设备列表
    $.ajax({
        url: `${API_BASE_URL}/devices`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            // 保存设备数据
            allDevices = response;
            
            // 更新环境概览
            updateEnvironmentOverview();
            
            // 渲染设备列表
            renderDevices(allDevices);
        },
        error: function(xhr, status, error) {
            // 显示错误信息
            $('#devices-container').html(`
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>加载设备失败: ${error}</p>
                    <button class="retry-btn" onclick="loadDevices()">重试</button>
                </div>
            `);
            console.error('加载设备失败:', error);
        }
    });
}

/**
 * 更新环境概览数据
 */
function updateEnvironmentOverview() {
    // 计算开启的设备数量
    const devicesOn = allDevices.filter(device => device.status === 'on').length;
    
    // 更新UI
    $('#indoor-temp').text('24°C');  // 模拟数据
    $('#indoor-humidity').text('45%');  // 模拟数据
    $('#devices-on').text(devicesOn);
    $('#total-devices').text(allDevices.length);
    
    // 更新最后更新时间
    updateLastUpdatedTime();
}

/**
 * 渲染设备列表
 * @param {Array} devices - 设备数据数组
 */
function renderDevices(devices) {
    // 清空容器
    $('#devices-container').empty();
    
    // 如果没有设备，显示提示信息
    if (devices.length === 0) {
        $('#devices-container').html('<p class="no-devices">暂无设备</p>');
        return;
    }
    
    // 遍历设备数据，创建设备卡片
    devices.forEach(device => {
        // 克隆模板
        const template = document.getElementById('device-template');
        const deviceCard = document.importNode(template.content, true);
        
        // 设置设备ID
        deviceCard.querySelector('.device-card').dataset.id = device.id;
        
        // 设置设备图标
        const iconElement = deviceCard.querySelector('.device-icon i');
        iconElement.className = getDeviceIcon(device.type);
        
        // 设置设备名称和位置
        deviceCard.querySelector('.device-name').textContent = device.name;
        deviceCard.querySelector('.device-location').textContent = device.location;
        
        // 设置设备状态
        const statusIndicator = deviceCard.querySelector('.status-indicator');
        const statusText = deviceCard.querySelector('.status-text');
        if (device.status === 'on') {
            statusIndicator.classList.add('on');
            statusText.textContent = '开启';
        } else {
            statusIndicator.classList.add('off');
            statusText.textContent = '关闭';
        }
        
        // 设置开关状态
        const toggleSwitch = deviceCard.querySelector('.device-toggle');
        toggleSwitch.checked = device.status === 'on';
        
        // 绑定开关事件
        toggleSwitch.addEventListener('change', function() {
            toggleDeviceStatus(device.id, this.checked ? 'on' : 'off');
        });
        
        // 绑定详情按钮事件
        deviceCard.querySelector('.details-btn').addEventListener('click', function() {
            window.location.href = `device.html?id=${device.id}`;
        });
        
        // 添加到容器
        $('#devices-container').append(deviceCard);
    });
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
            const deviceIndex = allDevices.findIndex(d => d.id === deviceId);
            if (deviceIndex !== -1) {
                allDevices[deviceIndex].status = newStatus;
                
                // 更新UI
                updateDeviceUI(deviceId, newStatus);
                updateEnvironmentOverview();
            }
        },
        error: function(xhr, status, error) {
            console.error(`更新设备状态失败: ${error}`);
            
            // 恢复开关状态
            const deviceCard = $(`.device-card[data-id="${deviceId}"]`);
            const toggleSwitch = deviceCard.find('.device-toggle');
            toggleSwitch.prop('checked', newStatus === 'off');
            
            // 显示错误提示
            alert(`更新设备状态失败: ${error}`);
        }
    });
}

/**
 * 更新设备UI
 * @param {string} deviceId - 设备ID
 * @param {string} status - 设备状态
 */
function updateDeviceUI(deviceId, status) {
    const deviceCard = $(`.device-card[data-id="${deviceId}"]`);
    const statusIndicator = deviceCard.find('.status-indicator');
    const statusText = deviceCard.find('.status-text');
    
    if (status === 'on') {
        statusIndicator.removeClass('off').addClass('on');
        statusText.text('开启');
    } else {
        statusIndicator.removeClass('on').addClass('off');
        statusText.text('关闭');
    }
}
