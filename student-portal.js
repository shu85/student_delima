import { db } from './firebase-config.js';
import { collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// DOM Elements
const searchForm = document.getElementById('searchForm');
const icNumberInput = document.getElementById('icNumber');
const searchBtn = document.getElementById('searchBtn');
const alertContainer = document.getElementById('alertContainer');
const resultsContainer = document.getElementById('resultsContainer');

// Event Listeners
searchForm.addEventListener('submit', handleSearch);

// Handle Search
async function handleSearch(e) {
    e.preventDefault();

    const icNumber = icNumberInput.value.trim();

    if (!icNumber) {
        showAlert('Please enter your IC number', 'error');
        return;
    }

    // Validate IC number (basic validation)
    if (icNumber.length !== 12 || !/^\d+$/.test(icNumber)) {
        showAlert('Please enter a valid 12-digit IC number', 'error');
        return;
    }

    // Show loading state
    searchBtn.disabled = true;
    searchBtn.innerHTML = '<span class="loading"></span> Searching...';
    clearAlert();
    hideResults();

    try {
        const studentData = await searchStudentByIC(icNumber);

        if (studentData) {
            displayResults(studentData);
            showAlert('Student record found!', 'success');
        } else {
            showAlert('No student found with this IC number. Please check and try again.', 'error');
        }
    } catch (error) {
        console.error('Search error:', error);
        showAlert('An error occurred while searching. Please try again.', 'error');
    } finally {
        // Reset button
        searchBtn.disabled = false;
        searchBtn.textContent = 'Search My Credentials';
    }
}

// Search Student by IC in Firebase
async function searchStudentByIC(icNumber) {
    try {
        const studentsRef = collection(db, 'students');
        const q = query(studentsRef, where('ic', '==', icNumber));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].data();
        }
        return null;
    } catch (error) {
        console.error('Firestore query error:', error);
        throw error;
    }
}

// Display Results
function displayResults(data) {
    resultsContainer.innerHTML = `
        <div class="result-card">
            <div class="result-label">Student Name</div>
            <div class="result-value" style="font-size: 1.1rem; color: #fff; text-transform: uppercase;">${data.name || 'N/A'}</div>
        </div>

        <div class="result-card">
            <div class="result-label">DELIMA ID</div>
            <div class="result-value">${data.delimaId || 'N/A'}</div>
            <button class="copy-btn" onclick="copyToClipboard('${data.delimaId}', this)">
                📋 Copy ID
            </button>
        </div>
        
        <div class="result-card">
            <div class="result-label">Password</div>
            <div class="result-value">${data.password || 'N/A'}</div>
            <button class="copy-btn" onclick="copyToClipboard('${data.password}', this)">
                📋 Copy Password
            </button>
        </div>
        
        <div style="margin-top: 1rem; padding: 1rem; background: rgba(102, 126, 234, 0.1); border-radius: 12px; border-left: 4px solid #667eea;">
            <small style="color: var(--text-secondary); line-height: 1.6;">
                <strong>Important:</strong> Keep your credentials safe. 
                Your full email is <strong>${data.email}</strong>
            </small>
        </div>
    `;

    resultsContainer.classList.remove('hidden');
}

// Hide Results
function hideResults() {
    resultsContainer.classList.add('hidden');
    resultsContainer.innerHTML = '';
}

// Show Alert
function showAlert(message, type = 'info') {
    clearAlert();

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        <span>${getAlertIcon(type)}</span>
        <span>${message}</span>
    `;

    alertContainer.appendChild(alertDiv);

    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(clearAlert, 5000);
    }
}

// Clear Alert
function clearAlert() {
    alertContainer.innerHTML = '';
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

// Copy to Clipboard (global function)
window.copyToClipboard = async function (text, buttonElement) {
    try {
        await navigator.clipboard.writeText(text);

        const originalText = buttonElement.textContent;
        buttonElement.textContent = '✓ Copied!';
        buttonElement.style.background = 'rgba(79, 172, 254, 0.3)';

        setTimeout(() => {
            buttonElement.textContent = originalText;
            buttonElement.style.background = '';
        }, 2000);
    } catch (error) {
        console.error('Copy failed:', error);
        showAlert('Failed to copy. Please select and copy manually.', 'error');
    }
}

// Input formatting - auto remove non-digits
icNumberInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
});
