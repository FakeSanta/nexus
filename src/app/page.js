'use client';
import { useState, useEffect } from 'react';
import MachineCard from '@/components/MachineCard';
import styles from './page.module.css';

export default function Home() {
  const [machines, setMachines] = useState([]);

  const fetchMachines = async () => {
    const res = await fetch('/api/machines');
    if (res.ok) {
      setMachines(await res.json());
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
          <p>No machines monitoring.</p>
          <p>Click "Add Machine" to start.</p>
        </div>
      )}
    </div>
  );
}
