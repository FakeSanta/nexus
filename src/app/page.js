'use client';
import { useState, useEffect } from 'react';
import MachineCard from '@/components/MachineCard';
import styles from './page.module.css';

export default function Home() {
  const [machines, setMachines] = useState([]);
  const [filter, setFilter] = useState('all');

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

  const filteredMachines = machines.filter(m => {
    if (filter === 'all') return true;
    if (filter === 'vm') return m.type === 'vm';
    if (filter === 'hypervisor') return m.type === 'proxmox' || m.type === 'hyperv';
    if (filter === 'web') return m.actionType === 'web';
    if (filter === 'rdp') return m.actionType === 'rdp';
    return true;
  });

  return (
    <>
      <div className={styles.filterBar}>
        {['all', 'vm', 'hypervisor', 'web', 'rdp'].map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.activeFilter : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filteredMachines.map((machine) => (
          <MachineCard key={machine.id} machine={machine} onDelete={handleDelete} />
        ))}

        {filteredMachines.length === 0 && (
          <div className={styles.empty}>
            <p>No machines found for this filter.</p>
          </div>
        )}
      </div>
    </>
  );
}
