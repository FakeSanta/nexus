'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

export default function AddMachine() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        ip: '',
        type: 'vm',
        actionType: 'rdp',
        port: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        await fetch('/api/machines', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        router.push('/');
        router.refresh(); // Ensure the dashboard reloads data
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/" className={styles.backLink}>
                    <ArrowLeft size={20} /> Back
                </Link>
                <h1>Add New Machine</h1>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label>Friendly Name</label>
                    <input
                        required
                        type="text"
                        placeholder="e.g. Primary Domain Controller"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>IP / Hostname / URL Path</label>
                    <input
                        required
                        type="text"
                        placeholder="192.168.1.10 or 172.16.1.45/fog"
                        value={formData.ip}
                        onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                    />
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Machine Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="vm">Virtual Machine</option>
                            <option value="proxmox">Proxmox Node</option>
                            <option value="hyperv">Hyper-V Host</option>
                            <option value="printer">Printer</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Action Type</label>
                        <select
                            value={formData.actionType}
                            onChange={(e) => setFormData({ ...formData, actionType: e.target.value })}
                        >
                            <option value="rdp">RDP Connection</option>
                            <option value="web">Web Interface</option>
                        </select>
                    </div>
                </div>

                {formData.actionType === 'web' && (
                    <div className={styles.formGroup}>
                        <label>Port (Optional)</label>
                        <input
                            type="text"
                            placeholder="e.g. 8006"
                            value={formData.port}
                            onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                        />
                    </div>
                )}

                <button type="submit" disabled={loading} className={styles.submitBtn}>
                    <Save size={18} />
                    {loading ? 'Saving...' : 'Save Machine'}
                </button>
            </form>
        </div>
    );
}
