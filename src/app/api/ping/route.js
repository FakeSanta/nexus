import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const ip = searchParams.get('ip');

    if (!ip) {
        return NextResponse.json({ error: 'IP is required' }, { status: 400 });
    }

    try {
        // Extract hostname if input is a URL/path (e.g., "192.168.1.50/fog" -> "192.168.1.50")
        let targetHost = ip;
        try {
            // If doesn't start with protocol, add one to parse correctly
            const urlStr = ip.match(/^https?:\/\//) ? ip : `http://${ip}`;
            const url = new URL(urlStr);
            targetHost = url.hostname;
        } catch (e) {
            // Fallback to splitting by slash if URL parsing fails
            targetHost = ip.split('/')[0];
        }

        // Clean up any remaining characters that aren't valid for ping (basic security)
        targetHost = targetHost.replace(/[^a-zA-Z0-9.-]/g, '');

        // Windows ping: -n 1 (1 count), -w 1000 (1000ms timeout)
        const isWindows = process.platform === 'win32';
        const command = isWindows
            ? `ping -n 1 -w 1000 ${targetHost}`
            : `ping -c 1 -W 1 ${targetHost}`;

        await execPromise(command);

        return NextResponse.json({ online: true });
    } catch (error) {
        return NextResponse.json({ online: false });
    }
}
