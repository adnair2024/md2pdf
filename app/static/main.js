document.addEventListener('DOMContentLoaded', function() {
    const markdownInput = document.getElementById('markdown-input');
    const preview = document.getElementById('preview');
    const convertToPdfButton = document.getElementById('convert-to-pdf');
    const uploadMdBtn = document.getElementById('upload-md-btn');
    const uploadPdfBtn = document.getElementById('upload-pdf-btn');
    const uploadModal = document.getElementById('upload-modal');
    const closeModalButton = document.querySelector('.modal .close-button');
    const uploadForm = document.getElementById('upload-form');

    let timeout = null;

    // Function to render Markdown to HTML
    function renderMarkdown() {
        const markdownText = markdownInput.value;
        fetch('/render_markdown', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ markdown: markdownText })
        })
        .then(response => response.json())
        .then(data => {
            preview.innerHTML = data.html;
        })
        .catch(error => {
            console.error('Error:', error);
            preview.innerHTML = '<p style="color: red;">Error rendering Markdown.</p>';
        });
    }

    // Live preview functionality with debounce
    if (markdownInput && preview) {
        markdownInput.addEventListener('keyup', function() {
            clearTimeout(timeout);
            timeout = setTimeout(renderMarkdown, 500); // Debounce by 500ms
        });
        // Initial render on page load
        renderMarkdown();
    }

    // Convert to PDF functionality
    if (convertToPdfButton) {
        convertToPdfButton.addEventListener('click', function() {
            const markdownText = markdownInput.value;
            convertToPdfButton.textContent = 'Converting...';
            convertToPdfButton.disabled = true;

            fetch('/convert_pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ markdown: markdownText })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('PDF conversion failed.');
                }
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'document.pdf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred during PDF conversion.');
            })
            .finally(() => {
                convertToPdfButton.textContent = 'Convert to PDF';
                convertToPdfButton.disabled = false;
            });
        });
    }

    // Modal functionality for uploads
    function openModal() {
        if (uploadModal) {
            uploadModal.style.display = 'block';
        }
    }

    function closeModal() {
        if (uploadModal) {
            uploadModal.style.display = 'none';
            // Clear any previous file selection
            const fileInput = document.getElementById('file-input');
            if (fileInput) {
                fileInput.value = '';
            }
        }
    }

    if (uploadMdBtn) {
        uploadMdBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
            // Optionally set form action for markdown upload
            uploadForm.action = '/upload_md';
            // Set accepted file types
            document.getElementById('file-input').accept = '.md';
        });
    }

    if (uploadPdfBtn) {
        uploadPdfBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
            // Optionally set form action for PDF upload
            uploadForm.action = '/upload_pdf';
            // Set accepted file types
            document.getElementById('file-input').accept = '.pdf';
        });
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeModal);
    }

    // Close modal if user clicks outside of it
    window.addEventListener('click', function(event) {
        if (event.target === uploadModal) {
            closeModal();
        }
    });

    // Handle upload form submission (for AJAX upload or direct form submission)
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            // For now, allow default form submission to handle file upload
            // In a more complex app, you might use fetch API for AJAX upload
            console.log('Upload form submitted to:', uploadForm.action);
        });
    }
});