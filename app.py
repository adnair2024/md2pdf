import os
import logging
from flask import Flask, render_template, request, jsonify, send_file, make_response, redirect, url_for, flash
import markdown
from weasyprint import HTML, CSS
from io import BytesIO
from werkzeug.utils import secure_filename
from config import Config

app = Flask(__name__, template_folder='app/templates', static_folder='app/static')
app.config.from_object(Config)
app.secret_key = app.config['SECRET_KEY']

logging.basicConfig(level=logging.DEBUG)

# Ensure the upload folder exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/render_markdown', methods=['POST'])
def render_markdown():
    data = request.get_json()
    md_text = data.get('markdown', '')
    html = markdown.markdown(md_text, extensions=['fenced_code', 'codehilite'])
    return jsonify({'html': html})

@app.route('/convert_pdf', methods=['POST'])
def convert_pdf():
    try:
        data = request.get_json()
        md_text = data.get('markdown', '')
        font = data.get('font', 'sans-serif')
        font_size = data.get('fontSize', '12px')
        line_height = data.get('lineHeight', '1.5')
        margin = data.get('margin', '25.4mm')
        
        # Check for disposition argument (inline vs attachment)
        disposition = request.args.get('disposition', 'attachment')

        html_content = markdown.markdown(md_text, extensions=['fenced_code', 'codehilite'])

        # Basic HTML structure for PDF
        html_string = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Markdown to PDF</title>
            <style>
                @page {{ margin: {margin}; }}
                body {{ 
                    font-family: {font}; 
                    font-size: {font_size};
                    line-height: {line_height};
                }}
                pre {{ background-color: #eee; padding: 1em; overflow: auto; }}
                code {{ font-family: monospace; }}
                /* Ensure images fit within the page */
                img {{ max-width: 100%; height: auto; }}
            </style>
        </head>
        <body>
            {html_content}
        </body>
        </html>
        """

        # Generate PDF
        html_doc = HTML(string=html_string)
        pdf_bytes = BytesIO()
        html_doc.write_pdf(pdf_bytes)
        pdf_bytes.seek(0)

        response = make_response(send_file(pdf_bytes, mimetype='application/pdf'))
        
        if disposition == 'inline':
             response.headers['Content-Disposition'] = 'inline; filename=preview.pdf'
        else:
             response.headers['Content-Disposition'] = 'attachment; filename=document.pdf'
             
        return response
    except Exception as e:
        app.logger.error(f"PDF conversion failed: {e}", exc_info=True)
        return jsonify({"error": "PDF conversion failed"}), 500

@app.route('/upload_md', methods=['POST'])
def upload_md():
    if 'file' not in request.files:
        flash('No file part')
        return redirect(url_for('index'))
    file = request.files['file']
    if file.filename == '':
        flash('No selected file')
        return redirect(url_for('index'))
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        flash('Markdown file successfully uploaded')
        with open(filepath, 'r') as f:
            md_content = f.read()
        return render_template('index.html', initial_markdown=md_content)
    else:
        flash('Allowed file types are .md and .pdf')
        return redirect(url_for('index'))

@app.route('/upload_pdf', methods=['POST'])
def upload_pdf():
    if 'file' not in request.files:
        flash('No file part')
        return redirect(url_for('index'))
    file = request.files['file']
    if file.filename == '':
        flash('No selected file')
        return redirect(url_for('index'))
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        flash('PDF file successfully uploaded')
        return redirect(url_for('index'))
    else:
        flash('Allowed file types are .md and .pdf')
        return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
