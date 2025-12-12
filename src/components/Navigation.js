'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlusCircle, Printer } from 'lucide-react';
import styles from './Navigation.module.css';

export default function Navigation() {
    const pathname = usePathname();

    return (
        <nav className={styles.nav}>
            <div className={styles.logo}>
                <div className={styles.logoIcon}>
                    <LayoutDashboard size={24} color="white" />
                </div>
                <span>ServerMonitor</span>
            </div>
            <div className={styles.links}>
                <Link href="/" className={`${styles.link} ${pathname === '/' ? styles.active : ''}`}>
                    <LayoutDashboard size={18} />
                    Dashboard
                </Link>
                <Link href="/printers" className={`${styles.link} ${pathname === '/printers' ? styles.active : ''}`}>
                    <Printer size={18} />
                    Printers
                </Link>
                <Link href="/add" className={`${styles.link} ${pathname === '/add' ? styles.active : ''}`}>
                    <PlusCircle size={18} />
                    Add Machine
                </Link>
            </div>
        </nav>
    );
}
