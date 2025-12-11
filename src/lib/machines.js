import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'machines.json');

export async function getMachines() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
        // Create file if it doesn't exist
        await fs.writeFile(dataFilePath, '[]', 'utf8');
        return [];
    }
    throw error;
  }
}

export async function addMachine(machine) {
  const machines = await getMachines();
  const newMachine = { ...machine, id: Date.now().toString() };
  machines.push(newMachine);
  await fs.writeFile(dataFilePath, JSON.stringify(machines, null, 2), 'utf8');
  return newMachine;
}

export async function deleteMachine(id) {
    let machines = await getMachines();
    machines = machines.filter(m => m.id !== id);
    await fs.writeFile(dataFilePath, JSON.stringify(machines, null, 2), 'utf8');
    return true;
}
