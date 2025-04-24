document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const requiredDocsList = document.getElementById('requiredDocsList');
    const additionalDocsList = document.getElementById('additionalDocsList');
    const requiredDocsCount = document.getElementById('requiredDocsCount');
    const additionalDocsCount = document.getElementById('additionalDocsCount');
    const totalSize = document.getElementById('totalSize');
    const submitButton = document.querySelector('#step5 .next-step');

    let uploadedFiles = {
        required: [],
        additional: []
    };

    // Required documents based on claim type
    const requiredDocuments = {
        MOTOR: ['Driver\'s License', 'Vehicle Registration', 'Insurance Certificate', 'Damage Photos'],
        SME: ['Business Registration', 'Financial Records', 'Insurance Policy', 'Incident Evidence'],
        AGRO: ['Farm Registration', 'Insurance Policy', 'Damage Assessment', 'Production Records'],
        GADGET: ['Purchase Receipt', 'Insurance Certificate', 'Damage Photos'],
        HOUSEHOLDER: ['Property Documents', 'Insurance Policy', 'Damage Evidence', 'Value Proof']
    };

    // Initialize required documents list based on claim type
    function initializeRequiredDocs() {
        const claimType = formState.claimType;
        if (!claimType || !requiredDocuments[claimType]) return;

        requiredDocsCount.textContent = `0/${requiredDocuments[claimType].length}`;
        updateSubmitButton();
    }

    // Initialize all upload zones
    const uploadZones = document.querySelectorAll('.upload-zone');
    
    uploadZones.forEach(zone => {
        const input = zone.querySelector('.file-input');
        const fileInfo = zone.parentElement.querySelector('.file-info');
        
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            zone.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });

        // Highlight drop zone when dragging over it
        ['dragenter', 'dragover'].forEach(eventName => {
            zone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            zone.addEventListener(eventName, unhighlight, false);
        });

        // Handle dropped files
        zone.addEventListener('drop', handleDrop, false);
        
        // Handle file input change
        input.addEventListener('change', (e) => {
            handleFiles(e.target.files, zone);
        });

        // Handle file preview, replace and remove actions
        if (fileInfo) {
            const previewBtn = fileInfo.querySelector('.preview-btn');
            const replaceBtn = fileInfo.querySelector('.replace-btn');
            const removeBtn = fileInfo.querySelector('.remove-btn');

            if (previewBtn) previewBtn.addEventListener('click', () => previewFile(zone));
            if (replaceBtn) replaceBtn.addEventListener('click', () => replaceFile(zone));
            if (removeBtn) removeBtn.addEventListener('click', () => removeFile(zone));
        }
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        this.classList.add('drag-over');
    }

    function unhighlight(e) {
        this.classList.remove('drag-over');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files, this);
    }

    function handleFiles(files, zone) {
        if (files.length === 0) return;
        
        const file = files[0];
        const fileInfo = zone.parentElement.querySelector('.file-info');
        const uploadStatus = zone.parentElement;
        
        // Validate file type
        const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!allowedTypes.includes(fileExtension)) {
            showError(zone, 'Invalid file type. Please upload PDF, JPG, or PNG files.');
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            showError(zone, 'File size exceeds 5MB limit.');
            return;
        }

        // Update UI to show file info
        const filename = fileInfo.querySelector('.filename');
        const fileIcon = fileInfo.querySelector('i');
        
        filename.textContent = file.name;
        fileIcon.className = `fas ${getFileIcon(fileExtension)}`;
        
        zone.classList.add('hidden');
        fileInfo.classList.remove('hidden');
        uploadStatus.classList.remove('not-uploaded');
        uploadStatus.classList.add('uploaded');

        // Update progress bar
        updateProgress();
    }

    function showError(zone, message) {
        // Remove any existing error message
        const existingError = zone.parentElement.querySelector('.upload-error');
        if (existingError) existingError.remove();

        // Create and show new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'upload-error';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i>${message}`;
        zone.parentElement.appendChild(errorDiv);

        // Remove error message after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    function getFileIcon(extension) {
        switch (extension) {
            case '.pdf':
                return 'fa-file-pdf';
            case '.jpg':
            case '.jpeg':
            case '.png':
                return 'fa-file-image';
            default:
                return 'fa-file';
        }
    }

    function updateProgress() {
        const totalRequired = document.querySelectorAll('.upload-status').length;
        const uploaded = document.querySelectorAll('.upload-status.uploaded').length;
        
        const uploadedCount = document.getElementById('uploadedCount');
        const progressBar = document.querySelector('.progress-bar .progress');
        
        if (uploadedCount) uploadedCount.textContent = uploaded;
        if (progressBar) progressBar.style.width = `${(uploaded / totalRequired) * 100}%`;

        // Enable/disable the complete submission button
        const completeBtn = document.querySelector('.next-step[disabled]');
        if (completeBtn) {
            completeBtn.disabled = uploaded < totalRequired;
        }
    }

    function previewFile(zone) {
        const input = zone.querySelector('.file-input');
        if (input.files && input.files[0]) {
            const file = input.files[0];
            if (file.type.startsWith('image/')) {
                const url = URL.createObjectURL(file);
                window.open(url);
            } else if (file.type === 'application/pdf') {
                const url = URL.createObjectURL(file);
                window.open(url);
            }
        }
    }

    function replaceFile(zone) {
        const input = zone.querySelector('.file-input');
        input.click();
    }

    function removeFile(zone) {
        const fileInfo = zone.parentElement.querySelector('.file-info');
        const uploadStatus = zone.parentElement;
        const input = zone.querySelector('.file-input');

        // Reset file input
        input.value = '';
        
        // Update UI
        zone.classList.remove('hidden');
        fileInfo.classList.add('hidden');
        uploadStatus.classList.remove('uploaded');
        uploadStatus.classList.add('not-uploaded');

        // Update progress
        updateProgress();
    }

    // Update submit button state
    function updateSubmitButton() {
        const claimType = formState.claimType;
        if (!claimType || !requiredDocuments[claimType]) return;

        const hasAllRequired = uploadedFiles.required.length >= requiredDocuments[claimType].length;
        submitButton.disabled = !hasAllRequired;
    }

    // Utility functions
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function simulateUpload(progressBar) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            progressBar.style.width = `${progress}%`;
        }, 200);
    }

    // Initialize
    initializeRequiredDocs();
}); 