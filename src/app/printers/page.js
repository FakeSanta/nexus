'use client';
import { useState, useEffect } from 'react';
import MachineCard from '@/components/MachineCard';
import styles from '../page.module.css'; // Reusing dashboard styles

export default function PrintersPage() {
    const [machines, setMachines] = useState([]);

    const fetchMachines = async () => {
        const res = await fetch('/api/machines');
        if (res.ok) {
            const allMachines = await res.json();
            // Filter only printers
            setMachines(allMachines.filter(m => m.type === 'printer'));
        }
    };

    useEffect(() => {
        fetchMachines();
    }, []);

    const handleDelete = async (id) => {
        await fetch(`/api/machines?id=${id}`, { method: 'DELETE' });
        fetchMachines();
    };

    return (
        <div className={styles.grid}>
            {machines.map((machine) => (
                <MachineCard key={machine.id} machine={machine} onDelete={handleDelete} />
            ))}

            {machines.length === 0 && (
                <div className={styles.empty}>
                    <p>No printers added yet.</p>
                    <p>Go to "Add Machine" and select type "Printer".</p>
                </div>
            )}
        </div>
    );
}
