const { app, BrowserWindow, ipcMain } = require('electron');
const os = require('os');
const path = require('path');


console.log('Starting Electron app...');

async function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
        },
    });

    win.loadFile('index.html');
}

// Handle resource collection
ipcMain.handle('collect-resources', async () => {
    const cpus = os.cpus().map(cpu => ({
        model: cpu.model,
        speed: cpu.speed,
        times: cpu.times,
    }));
    const totalcpu = os.cpus().length;
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsage = (usedMemory / totalMemory) * 100; // Memory usage percentage

    const resources = {
        totalcpu,
        cpus,
        memoryUsage,
        totalMemory,
    };

    try {
        const response = await fetch('http://192.168.1.9:4000/api/resource', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(resources),
        });

        if (!response.ok) {
            console.error('Failed to send resources:', response.statusText);
        }
    } catch (error) {
        console.error('Error sending resources:', error);
    }
});

// Function to execute a task
async function executeTask(task) {
    let result;

    switch (task.operation) {
        case 'add':
            result = task.numbers.reduce((a, b) => a + b, 0);
            break;
        case 'subtract':
            result = task.numbers.reduce((a, b) => a - b);
            break;
        case 'encrypt':
            result = task.data.split('').map(char => String.fromCharCode(char.charCodeAt(0) + 1)).join('');
            break;
        case 'decrypt':
            result = task.data.split('').map(char => String.fromCharCode(char.charCodeAt(0) - 1)).join('');
            break;
        case 'fibonacci':
            result = fibonacci(task.n);
            break;
        case 'primeFactorization':
            result = primeFactorization(task.number);
            break;
        case 'matrixMultiplication':
            result = matrixMultiplication(task.matrices[0], task.matrices[1]);
            break;
        case 'sortLargeArray':
            result = task.array.sort((a, b) => a - b);
            break;
        default:
            return { error: 'Invalid task' };
    }

    try {
        const response = await fetch('http://192.168.1.9:4000/api/task-result', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ result }),
        });

        if (!response.ok) {
            console.error('Failed to send task result:', response.statusText);
        }
    } catch (error) {
        console.error('Error sending task result:', error);
    }

    return { result };
}

function fibonacci(n) {
    let a = 0n, b = 1n;
    for (let i = 0; i < n; i++) {
        [a, b] = [b, a + b];
    }
    return a.toString();
}

function primeFactorization(n) {
    let factors = [];
    let divisor = 2;
    while (n > 1) {
        if (n % divisor === 0) {
            factors.push(divisor);
            n /= divisor;
        } else {
            divisor++;
        }
    }
    return factors;
}

function matrixMultiplication(a, b) {
    let result = new Array(a.length).fill(0).map(() => new Array(b[0].length).fill(0));
    return result.map((row, i) => {
        return row.map((_, j) => {
            return a[i].reduce((sum, elm, k) => sum + (elm * b[k][j]), 0);
        });
    });
}

// Periodically fetch and execute tasks
setInterval(async () => {
    try {
        const response = await fetch('http://192.168.1.9:4000/api/task');
        if (response.ok) {
            const task = await response.json();
            if (task) {
                const result = await executeTask(task);
                console.log('Executed task result:', result);
            }
        }
    } catch (error) {
        console.error('Error fetching task:', error);
    }
}, 5000); // Fetch tasks every 5 seconds

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
