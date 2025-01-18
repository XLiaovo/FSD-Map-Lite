/**
 * FSD Map Lite
 * 
 * @author XLiaovo
 * @link https://github.com/XLiaovo/
 * @license GPL-3.0
 * 
 * Copyright (c) 2025 XLiaovo
 */

console.log('%c @author XLiaovo ', 'font-size: 24px; font-weight: bold; color: #333;');
console.log('%c https://github.com/XLiaovo/FSD-Map-Lite ', 'font-size: 24px; font-weight: bold; color: #333;');

var XLY_map = L.map('XLY_map', {
    maxZoom: 15,
    minZoom: 4,
    maxBounds: [
        [-60, -Infinity],
        [85, Infinity]
    ],
    maxBoundsViscosity: 1.0
}).setView([36, 108], 4.5);

var XLY_baseLayer = L.tileLayer('https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}', {
    maxZoom: 15,
    minZoom: 4,
    attribution: '© 高德地图 | XLiaovo'
}).addTo(XLY_map);

var XLY_satelliteLayer = L.tileLayer('https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {
    maxZoom: 15,
    minZoom: 4,
    attribution: '© 高德地图 | XLiaovo'
});

var XLY_pilotLayer = L.layerGroup().addTo(XLY_map);
var XLY_atcLayer = L.layerGroup().addTo(XLY_map);

var XLY_selectedPilot = null;

function XLY_updateMarkers(data) {
    XLY_pilotLayer.clearLayers();
    XLY_atcLayer.clearLayers();

    data.getPilots().forEach(pilot => {
        const rotatedIcon = L.divIcon({
            html: `<img src="./img/pilot.png" style="transform: rotate(${pilot.rotation}deg);">`,
            className: 'XLY_pilot_icon',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });

        const marker = L.marker([pilot.position.lat, pilot.position.lng], {
            icon: rotatedIcon,
            title: pilot.callsign
        });
        
        marker.on('click', () => XLY_showSidebarInfo(pilot, 'pilot'));
        XLY_pilotLayer.addLayer(marker);
    });

    data.getATCs().forEach(atc => {
        const marker = L.marker([atc.position.lat, atc.position.lng], {
            icon: XLY_dataProcessor.getATCIcon(),
            title: atc.callsign
        });
        
        marker.bindPopup(`<div style="text-align: center; font-weight: bold;">${atc.callsign}</div>`);
        XLY_atcLayer.addLayer(marker);
    });
}

function XLY_refreshData() {
    fetch('map.txt?' + new Date().getTime())
        .then(response => response.text())
        .then(data => {
            XLY_dataProcessor.parseData(data);
            XLY_updateMarkers(XLY_dataProcessor);
            updateOnlineList();
            
            const sidebar = document.getElementById('XLY_sidebar');
            if (XLY_selectedPilot && sidebar && sidebar.classList.contains('active')) {
                const selectedPilotData = XLY_dataProcessor.getPilotByCallsign(XLY_selectedPilot);
                if (selectedPilotData) {
                    updateSidebarContent(selectedPilotData);
                }
            }
        })
        .catch(error => console.error('Error loading map data:', error));
}

XLY_refreshData();

setInterval(XLY_refreshData, 500);

function XLY_showSidebarInfo(data, type) {
    if (type === 'pilot') {
        XLY_selectedPilot = data.callsign;
        const sidebar = document.getElementById('XLY_sidebar');
        if (sidebar) {
            updateSidebarContent(data);
            sidebar.classList.add('active');
            XLY_map.flyTo([data.position.lat, data.position.lng], 8, {
                duration: 1.5
            });
        }
    }
}

function updateSidebarContent(data) {
    const sidebarTitle = document.getElementById('XLY_sidebar_title');
    const sidebarInfo = document.getElementById('XLY_sidebar_info');
    
    sidebarTitle.textContent = `${data.callsign}`;
    html = `
        <div class="XLY_flight_header">
            <div class="XLY_route_main">
                <div class="XLY_departure">${data.departure}</div>
                <div class="XLY_route_icon">✈</div>
                <div class="XLY_arrival">${data.arrival}</div>
            </div>
        </div>
        <div class="XLY_flight_info">
            <div class="info_row">
                <div class="info_cell">
                    <div class="info_icon">▶</div>
                    <div class="info_value">${data.speed} Kts</div>
                    <div class="info_label">速度</div>
                </div>
                <div class="info_cell">
                    <div class="info_icon">△</div>
                    <div class="info_value">${data.altitude} Ft</div>
                    <div class="info_label">高度</div>
                </div>
            </div>
            <div class="info_row">
                <div class="info_cell">
                    <div class="info_icon">↗</div>
                    <div class="info_value">${data.rotation.toString().padStart(3, '0')}°</div>
                    <div class="info_label">航向</div>
                </div>
                <div class="info_cell">
                    <div class="info_icon">📡</div>
                    <div class="info_value">${data.transponder}</div>
                    <div class="info_label">应答机</div>
                </div>
            </div>
            <div class="info_row full_width">
                <div class="info_cell">
                    <div class="info_icon">✈</div>
                    <div class="info_value">${data.aircraft}</div>
                    <div class="info_label">机型</div>
                </div>
            </div>
        </div>
        <div class="route_section">
            <div class="route_header">
                <div class="route_icon">⇌</div>
                <div class="route_label">航路</div>
            </div>
            <div class="route_value">${data.route}</div>
        </div>
    `;
    sidebarInfo.innerHTML = html;
}

function updateUTCTime() {
    const now = new Date();
    const hours = now.getUTCHours().toString().padStart(2, '0');
    const minutes = now.getUTCMinutes().toString().padStart(2, '0');
    const seconds = now.getUTCSeconds().toString().padStart(2, '0');
    document.getElementById('XLY_utc_time').textContent = `${hours}:${minutes}:${seconds}UTC`;
}

updateUTCTime();

setInterval(updateUTCTime, 1000); 

function updateOnlineList() {
    const pilots = XLY_dataProcessor.getPilots();
    const atcs = XLY_dataProcessor.getATCs();
    
    document.getElementById('XLY_online_list').textContent = '在线列表';
    document.querySelector('[data-tab="pilots"]').textContent = `机组(${pilots.length})`;
    document.querySelector('[data-tab="atc"]').textContent = `管制(${atcs.length})`;
    
    const content = document.getElementById('XLY_list_content');
    let html = '';
    
    const activeTab = document.querySelector('.XLY_tab.active').dataset.tab;
    
    if (activeTab === 'pilots') {
        html = `
            <div class="XLY_list_header">
                <div class="list_col">呼号</div>
                <div class="list_col">编号</div>
                <div class="list_col">飞行计划</div>
            </div>
        `;
        pilots.forEach(pilot => {
            const planStatus = pilot.route ? '已提交' : '未提交';
            html += `
                <div class="XLY_list_item" data-type="pilot" data-callsign="${pilot.callsign}">
                    <div class="list_col">${pilot.callsign}</div>
                    <div class="list_col">${pilot.account}</div>
                    <div class="list_col">${planStatus}</div>
                </div>
            `;
        });
    } else if (activeTab === 'atc') {
        html = `
            <div class="XLY_list_header">
                <div class="list_col">席位</div>
                <div class="list_col">频率</div>
            </div>
        `;
        atcs.forEach(atc => {
            html += `
                <div class="XLY_list_item" data-type="atc" data-callsign="${atc.callsign}">
                    <div class="list_col">${atc.callsign}</div>
                    <div class="list_col">${atc.frequency}</div>
                </div>
            `;
        });
    }
    
    content.innerHTML = html;
}

document.querySelector('.XLY_online_tabs').addEventListener('click', (e) => {
    const tab = e.target.closest('.XLY_tab');
    if (!tab) return;
    
    document.querySelectorAll('.XLY_tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    document.querySelector('.XLY_online_list').dataset.activeTab = tab.dataset.tab;
    
    updateOnlineList();
});

document.querySelector('.XLY_online_list').dataset.activeTab = 'pilots';

document.getElementById('XLY_online_list').addEventListener('click', () => {
    document.getElementById('XLY_online_sidebar').classList.add('active');
});

document.getElementById('XLY_online_close').addEventListener('click', () => {
    document.getElementById('XLY_online_sidebar').classList.remove('active');
});

document.getElementById('XLY_list_content').addEventListener('click', (e) => {
    const item = e.target.closest('.XLY_list_item');
    if (!item) return;
    
    const type = item.dataset.type;
    const callsign = item.dataset.callsign;
    
    if (type === 'pilot') {
        const pilot = XLY_dataProcessor.getPilotByCallsign(callsign);
        if (pilot) {
            XLY_map.flyTo([pilot.position.lat, pilot.position.lng], 8, {
                duration: 1.5
            });
            XLY_showSidebarInfo(pilot, 'pilot');
        }
    } else if (type === 'atc') {
        const atc = XLY_dataProcessor.getATCByCallsign(callsign);
        if (atc) {
            XLY_map.flyTo([atc.position.lat, atc.position.lng], 8, {
                duration: 1.5
            });
            XLY_atcLayer.eachLayer(layer => {
                if (layer.options.title === callsign) {
                    layer.openPopup();
                }
            });
        }
    }
});

document.getElementById('XLY_sidebar_close').addEventListener('click', () => {
    const sidebar = document.getElementById('XLY_sidebar');
    if (sidebar) {
        sidebar.classList.remove('active');
        XLY_selectedPilot = null;
    }
});

XLY_map.on('click', () => {
    const sidebar = document.getElementById('XLY_sidebar');
    if (sidebar) {
        sidebar.classList.remove('active');
        XLY_selectedPilot = null;
    }
});

var XLY_atcBoundaries = L.tileLayer('https://tiles.flightradar24.com/atc_boundaries/{z}/{x}/{y}/tile.png', {
    maxZoom: 15,
    minZoom: 4
});

var XLY_lowAltitude = L.tileLayer('https://tiles.flightradar24.com/navdata_la/{z}/{x}/{y}/tile.png', {
    maxZoom: 15,
    minZoom: 4
});

async function getWeatherUpTime() {
    try {
        const response = await fetch('https://tilecache.rainviewer.com/api/maps.json');
        const data = await response.json();
        return data[data.length - 1];
    } catch (error) {
        console.error('Error fetching weather time:', error);
        return null;
    }
}

async function addWeatherLayer() {
    const upTime = await getWeatherUpTime();
    if (upTime) {
        var XLY_weather = L.tileLayer('https://tilecache.rainviewer.com/v2/radar/' + upTime + '/512/{z}/{x}/{y}/6/0_1.png', {
            maxZoom: 15,
            minZoom: 4
        });

        // 创建图层控制
        var overlayMaps = {
            "管制区域": XLY_atcBoundaries,
            "气象图": XLY_weather,
            "低空航路": XLY_lowAltitude
        };

        // 添加图层控制器到地图
        L.control.layers(null, overlayMaps, {
            position: 'topright'
        }).addTo(XLY_map);
    }
}

addWeatherLayer();

setInterval(addWeatherLayer, 300000);