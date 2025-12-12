'use client';
import { useState, useEffect } from 'react';
import { Monitor, Server, Globe, Download, Trash2, Activity, Printer } from 'lucide-react';
import { downloadRdp } from '@/lib/rdp';
import styles from './MachineCard.module.css';

export default function MachineCard({ machine, onDelete }) {
    const [online, setOnline] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkStatus();
        const interval = setInterval(checkStatus, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const checkStatus = async () => {
        try {
            const res = await fetch(`/api/ping?ip=${machine.ip}`);
            const data = await res.json();
            setOnline(data.online);
        } catch (e) {
            setOnline(false);
        } finally {
            setLoading(false);
        }
    };

    const handleClick = () => {
        if (machine.actionType === 'web') {
            let url;
            // If the IP contains non-IP characters or slash, treat as potential URL
            if (machine.ip.includes('/') || /[a-zA-Z]/.test(machine.ip)) {
                // Try to create a valid URL
                let tempIp = machine.ip;
                if (!/^https?:\/\//.test(tempIp)) {
                    tempIp = (machine.port === '443' ? 'https://' : 'http://') + tempIp;
                }
                try {
                    const u = new URL(tempIp);
                    if (machine.port && !u.port) u.port = machine.port;
                    url = u.toString();
                } catch (e) {
                    // Fallback
                    url = tempIp;
                }
            } else {
                // Classic IP behavior
                const protocol = machine.port === '443' ? 'https' : 'http';
                url = `${protocol}://${machine.ip}:${machine.port || ''}`;
            }

            // Clean up trailing colon if port was empty
            if (url.endsWith(':')) url = url.slice(0, -1);

            window.open(url, '_blank');
        } else {
            downloadRdp(machine.ip.split('/')[0], machine.name); // only IP for RDP
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        // Direct delete without native confirm
        await onDelete(machine.id);
    }

    return (
        <div className={styles.card} onClick={handleClick}>
            <div className={styles.header}>
                <div className={styles.iconWrapper}>
                    {machine.type === 'proxmox' ? <Server size={24} color="#fff" /> :
                        machine.type === 'hyperv' ? <Activity size={24} color="#fff" /> :
                            machine.type === 'printer' ? <Printer size={24} color="#fff" /> :
                                <Monitor size={24} color="#fff" />}
                </div>
                <div className={styles.statusIndicator}>
                    {loading ? (
                        <span className={styles.loadingDot} />
                    ) : (
                        <span className={`${styles.dot} ${online ? styles.online : styles.offline}`} />
                    )}
                </div>
            </div>

            <div className={styles.info}>
                <h3 className={styles.name}>{machine.name}</h3>
                <p className={styles.ip}>{machine.ip}</p>
            </div>

            <div className={styles.footer}>
                <span className={styles.typeBadge}>{machine.type}</span>
                <div className={styles.actions}>
                    {machine.actionType === 'web' ? <Globe size={16} /> : <Download size={16} />}
                    <button className={styles.deleteBtn} onClick={handleDelete}>
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
