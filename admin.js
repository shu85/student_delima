import { db } from './firebase-config.js';
import { collection, doc, setDoc, writeBatch } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// Admin Credentials
const ADMIN_CREDENTIALS = {
    userId: 'admin',
    password: '12345678'
};

// Session key
const SESSION_KEY = 'admin_session';

// DOM Elements
const loginPage = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const loginAlert = document.getElementById('loginAlert');
const logoutBtn = document.getElementById('logoutBtn');
const dashboardAlert = document.getElementById('dashboardAlert');
const excelFile = document.getElementById('excelFile');
const fileSelectBtn = document.getElementById('fileSelectBtn');
const fileInfo = document.getElementById('fileInfo');
const uploadBtn = document.getElementById('uploadBtn');
const uploadProgress = document.getElementById('uploadProgress');

let selectedFile = null;

// Initialize
checkSession();

// Event Listeners
loginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', handleLogout);
fileSelectBtn.addEventListener('click', () => excelFile.click());
excelFile.addEventListener('change', handleFileSelect);
uploadBtn.addEventListener('click', handleUpload);

// Check Session
function checkSession() {
    const session = localStorage.getItem(SESSION_KEY);
    if (session === 'active') {
        showDashboard();
    } else {
        showLogin();
    }
}

// Show Login Page
function showLogin() {
    loginPage.classList.remove('hidden');
    dashboardPage.classList.add('hidden');
}

// Show Dashboard
function showDashboard() {
    loginPage.classList.add('hidden');
    dashboardPage.classList.remove('hidden');
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();

    const userId = document.getElementById('userId').value.trim();
    const password = document.getElementById('password').value;

    if (userId === ADMIN_CREDENTIALS.userId && password === ADMIN_CREDENTIALS.password) {
        // Successful login
        localStorage.setItem(SESSION_KEY, 'active');
        showAlert('Login successful! Redirecting...', 'success', loginAlert);

        setTimeout(() => {
            showDashboard();
        }, 1000);
    } else {
        showAlert('Invalid credentials. Please try again.', 'error', loginAlert);
    }
}

// Handle Logout
function handleLogout() {
    localStorage.removeItem(SESSION_KEY);
    showAlert('Logged out successfully', 'success', loginAlert);
    showLogin();

    // Reset form
    loginForm.reset();
}

// Handle File Select
function handleFileSelect(e) {
    const file = e.target.files[0];

    if (file) {
        selectedFile = file;
        fileInfo.innerHTML = `
            <div style="background: rgba(79, 172, 254, 0.1); padding: 0.75rem; border-radius: 8px; border-left: 3px solid #4facfe;">
                <strong>Selected:</strong> ${file.name} (${(file.size / 1024).toFixed(2)} KB)
            </div>
        `;
        uploadBtn.disabled = false;
    } else {
        selectedFile = null;
        fileInfo.textContent = '';
        uploadBtn.disabled = true;
    }
}

// Handle Upload
async function handleUpload() {
    if (!selectedFile) {
        showAlert('Please select a file first', 'error', dashboardAlert);
        return;
    }

    uploadBtn.disabled = true;
    document.getElementById('uploadBtnText').innerHTML = '<span class="loading"></span> Processing...';
    uploadProgress.innerHTML = '';
    uploadProgress.classList.remove('hidden');

    try {
        // Read Excel file
        updateProgress('Reading Excel file...');
        const data = await readExcelFile(selectedFile);

        if (data.length === 0) {
            showAlert('No valid data found in the Excel file', 'error', dashboardAlert);
            return;
        }

        // Upload to Firebase
        updateProgress(`Uploading ${data.length} student records...`);
        await uploadToFirebase(data);

        // Success
        updateProgress(`✅ Successfully uploaded ${data.length} student records!`);
        showAlert(`Successfully uploaded ${data.length} student records to Firebase`, 'success', dashboardAlert);

        // Reset
        setTimeout(() => {
            excelFile.value = '';
            selectedFile = null;
            fileInfo.textContent = '';
            uploadBtn.disabled = true;
            uploadProgress.classList.add('hidden');
        }, 3000);

    } catch (error) {
        console.error('Upload error:', error);
        showAlert(`Upload failed: ${error.message}`, 'error', dashboardAlert);
        updateProgress(`❌ Error: ${error.message}`);
    } finally {
        uploadBtn.disabled = false;
        document.getElementById('uploadBtnText').textContent = 'Upload to Firebase';
    }
}

// Read Excel File
async function readExcelFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                // Get first sheet
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

                // Parse data (skip header row)
                const students = [];
                for (let i = 1; i < jsonData.length; i++) {
                    const row = jsonData[i];

                    // Skip empty rows
                    if (!row || row.length === 0 || !row[2]) continue;

                    // Extract data based on column positions
                    // Columns: BIL, NAMA PENUH, NO. KP, ID DELIMA, KATA LALUAN
                    const bil = String(row[0] || '').trim();
                    const namaPenuh = String(row[1] || '').trim();
                    const ic = String(row[2] || '').trim();
                    const delimaId = String(row[3] || '').trim();
                    const password = String(row[4] || '').trim();

                    // Validate IC number
                    if (ic && ic.length >= 10) {
                        // Generate email from DELIMA ID
                        const email = delimaId ? `${delimaId.toLowerCase()}@delima.edu.my` : 'N/A';

                        students.push({
                            ic: ic,
                            name: namaPenuh || 'N/A',
                            delimaId: delimaId || 'N/A',
                            email: email,
                            password: password || 'N/A'
                        });
                    }
                }

                resolve(students);
            } catch (error) {
                reject(new Error('Failed to parse Excel file: ' + error.message));
            }
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
    });
}

// Upload to Firebase
async function uploadToFirebase(students) {
    const studentsCollection = collection(db, 'students');

    // Use batched writes for better performance (max 500 per batch)
    const batchSize = 500;
    let currentBatch = writeBatch(db);
    let operationCount = 0;
    let batchCount = 0;

    for (let i = 0; i < students.length; i++) {
        const student = students[i];

        // Use IC as document ID for easy lookup and updates
        const docRef = doc(studentsCollection, student.ic);
        currentBatch.set(docRef, student, { merge: true });

        operationCount++;

        // Commit batch when we reach the limit
        if (operationCount === batchSize) {
            await currentBatch.commit();
            batchCount++;
            updateProgress(`Uploaded batch ${batchCount} (${i + 1}/${students.length} records)...`);

            // Start new batch
            currentBatch = writeBatch(db);
            operationCount = 0;
        }
    }

    // Commit remaining operations
    if (operationCount > 0) {
        await currentBatch.commit();
        batchCount++;
    }

    updateProgress(`All ${students.length} records uploaded successfully!`);
}

// Update Progress
function updateProgress(message) {
    const progressDiv = document.createElement('div');
    progressDiv.style.cssText = 'padding: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;';
    progressDiv.textContent = message;
    uploadProgress.appendChild(progressDiv);

    // Auto-scroll to bottom
    uploadProgress.scrollTop = uploadProgress.scrollHeight;
}

// Show Alert
function showAlert(message, type = 'info', container) {
    container.innerHTML = '';

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        <span>${getAlertIcon(type)}</span>
        <span>${message}</span>
    `;

    container.appendChild(alertDiv);

    // Auto-hide after 5 seconds for success/error
    if (type === 'success' || type === 'error') {
        setTimeout(() => {
            container.innerHTML = '';
        }, 5000);
    }
}

// Get Alert Icon
function getAlertIcon(type) {
    const icons = {
        error: '❌',
        success: '✅',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}
