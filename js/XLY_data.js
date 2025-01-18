/**
 * FSD Map Lite
 * 
 * @author XLiaovo
 * @link https://github.com/XLiaovo/
 * @license GPL-3.0
 * 
 * Copyright (c) 2025 XLiaovo
 */

class XLY_DataProcessor {
    constructor() {
        this.pilots = [];
        this.atcs = [];
        this.servers = [];
        
        this.icons = {
            pilot: L.icon({
                iconUrl: './img/pilot.png',
                iconSize: [32, 32],
                iconAnchor: [16, 16],
                popupAnchor: [0, -16]
            }),
            atc: L.icon({
                iconUrl: './img/atc.png',
                iconSize: [32, 32],
                iconAnchor: [16, 16],
                popupAnchor: [0, -16]
            })
        };
    }

    getPilotIcon() {
        return this.icons.pilot;
    }

    getATCIcon() {
        return this.icons.atc;
    }

    parseData(rawData) {
        this.pilots = [];
        this.atcs = [];
        this.servers = [];

        const lines = rawData.split('\n');
        
        lines.forEach(line => {
            if (line.trim() === '' || line.startsWith('!') || line.startsWith('[')) {
                return;
            }

            const parts = line.split(':');
            if (parts.length < 4) return;

            const identity = parts[3];

            if (identity === 'PILOT') {
                let rotation = 0;
                for (let i = parts.length - 1; i >= 0; i--) {
                    if (parts[i] && parts[i].trim() !== '') {
                        rotation = parseFloat(parts[i]) || 0;
                        break;
                    }
                }

                const transponder = (parts[17] || '0').toString().padStart(4, '0');

                const pilot = {
                    callsign: parts[0],
                    account: parts[1],
                    position: {
                        lat: parseFloat(parts[5]),
                        lng: parseFloat(parts[6])
                    },
                    altitude: parseInt(parts[7]),
                    speed: parseInt(parts[8]),
                    aircraft: parts[9],
                    departure: parts[11],
                    arrival: parts[13],
                    route: parts[30],
                    transponder: transponder,
                    rotation: rotation
                };
                
                this.pilots.push(pilot);
            } else if (identity === 'ATC') {
                this.atcs.push({
                    callsign: parts[0],
                    frequency: parts[4],
                    position: {
                        lat: parseFloat(parts[5]),
                        lng: parseFloat(parts[6])
                    }
                });
            }
        });
    }

    getPilots() {
        return this.pilots;
    }

    getATCs() {
        return this.atcs;
    }

    getPilotByCallsign(callsign) {
        return this.pilots.find(pilot => pilot.callsign === callsign);
    }

    getATCByCallsign(callsign) {
        return this.atcs.find(atc => atc.callsign === callsign);
    }
}

var XLY_dataProcessor = new XLY_DataProcessor(); 