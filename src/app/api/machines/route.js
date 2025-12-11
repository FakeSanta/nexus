import { NextResponse } from 'next/server';
import { getMachines, addMachine, deleteMachine } from '@/lib/machines';

export const dynamic = 'force-dynamic';

export async function GET() {
    const machines = await getMachines();
    return NextResponse.json(machines);
}

export async function POST(request) {
    const body = await request.json();
    const machine = await addMachine(body);
    return NextResponse.json(machine);
}

export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
        await deleteMachine(id);
        return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
}
