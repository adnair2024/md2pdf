document.addEventListener('DOMContentLoaded', function() {
    const markdownInput = document.getElementById('markdown-input');
    const preview = document.getElementById('preview');
    const convertToPdfButton = document.getElementById('convert-to-pdf');
    const previewPdfBtn = document.getElementById('preview-pdf-btn');
    
    // Upload controls
    const uploadMdBtn = document.getElementById('upload-md-btn');
    const uploadPdfBtn = document.getElementById('upload-pdf-btn');
    const uploadModal = document.getElementById('upload-modal');
    const uploadForm = document.getElementById('upload-form');
    
    // PDF Preview Modal
    const pdfPreviewModal = document.getElementById('pdf-preview-modal');
    const pdfPreviewFrame = document.getElementById('pdf-preview-frame');
    
    // Formatting controls
    const fontSelect = document.getElementById('font-select');
    const sizeSelect = document.getElementById('size-select');
    const spacingSelect = document.getElementById('spacing-select');
    const marginSelect = document.getElementById('margin-select');

    let timeout = null;

    // Helper to get current formatting options
    function getFormattingOptions() {
        return {
            font: fontSelect ? fontSelect.value : 'sans-serif',
            fontSize: sizeSelect ? sizeSelect.value : '12px',
            lineHeight: spacingSelect ? spacingSelect.value : '1.5',
            margin: marginSelect ? marginSelect.value : '25.4mm'
        };
    }

    // Apply styles to the live HTML preview
    function updatePreviewStyles() {
        if (!preview) return;
        const options = getFormattingOptions();
        preview.style.fontFamily = options.font;
        preview.style.fontSize = options.fontSize;
        preview.style.lineHeight = options.lineHeight;
        // Simulate margins with padding in the preview pane
        preview.style.padding = options.margin;
    }

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
            updatePreviewStyles(); // Apply styles after content update
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
            timeout = setTimeout(renderMarkdown, 500);
        });
        
        // Listen to formatting changes
        if(fontSelect) fontSelect.addEventListener('change', updatePreviewStyles);
        if(sizeSelect) sizeSelect.addEventListener('change', updatePreviewStyles);
        if(spacingSelect) spacingSelect.addEventListener('change', updatePreviewStyles);
        if(marginSelect) marginSelect.addEventListener('change', updatePreviewStyles);

        // Initial render
        renderMarkdown();
    }

    // Convert to PDF functionality (Download)
    if (convertToPdfButton) {
        convertToPdfButton.addEventListener('click', function() {
            const markdownText = markdownInput.value;
            const options = getFormattingOptions();
            
            convertToPdfButton.textContent = 'Converting...';
            convertToPdfButton.disabled = true;

            fetch('/convert_pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    markdown: markdownText,
                    ...options
                })
            })
            .then(response => {
                if (!response.ok) throw new Error('PDF conversion failed.');
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

    // Preview PDF functionality (View in Modal)
    if (previewPdfBtn) {
        previewPdfBtn.addEventListener('click', function() {
            const markdownText = markdownInput.value;
            const options = getFormattingOptions();
            
            previewPdfBtn.textContent = 'Generating Preview...';
            previewPdfBtn.disabled = true;

            // Request inline display
            fetch('/convert_pdf?disposition=inline', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    markdown: markdownText,
                    ...options
                })
            })
            .then(response => {
                if (!response.ok) throw new Error('PDF preview failed.');
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                pdfPreviewFrame.src = url;
                if (pdfPreviewModal) {
                    pdfPreviewModal.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred generating the PDF preview.');
            })
            .finally(() => {
                previewPdfBtn.textContent = 'Preview PDF';
                previewPdfBtn.disabled = false;
            });
        });
    }

    // Modal Handling
    const closeButtons = document.querySelectorAll('.close-button');
    
    function closeAllModals() {
        if (uploadModal) uploadModal.style.display = 'none';
        if (pdfPreviewModal) pdfPreviewModal.style.display = 'none';
        
        // Clear file input
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.value = '';
    }

    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    window.addEventListener('click', function(event) {
        if (event.target === uploadModal || event.target === pdfPreviewModal) {
            closeAllModals();
        }
    });

    // Upload Button Logic
    if (uploadMdBtn) {
        uploadMdBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (uploadModal) {
                uploadModal.style.display = 'block';
                uploadForm.action = '/upload_md';
                document.getElementById('file-input').accept = '.md';
            }
        });
    }

    if (uploadPdfBtn) {
        uploadPdfBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (uploadModal) {
                uploadModal.style.display = 'block';
                uploadForm.action = '/upload_pdf';
                document.getElementById('file-input').accept = '.pdf';
            }
        });
    }
});
