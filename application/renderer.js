// Call the collectResources function every 10 seconds
setInterval(() => {
    if (window.electron && window.electron.requestResourceCollection) {
        window.electron.requestResourceCollection();
    } else {
        console.error('requestResourceCollection is not available.');
    }
}, 10000);

// Example: Sending a task to add two numbers
// async function sendTask() {
//     const task = {
//         operation: 'add',
//         numbers: [5, 10],
//     };

//     const result = await window.electron.executeTask(task);
//     console.log('Task result:', result);
// }

// // Call sendTask function to test
// sendTask();
