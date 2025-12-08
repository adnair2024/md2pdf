# md2pdf - Minimalist Markdown to PDF Converter

`md2pdf` is a fast, private, and highly minimalist web tool designed for converting Markdown text into high-quality PDF documents. This Flask-based application provides a live editor, allowing users to see their Markdown rendered to HTML in real-time, and offers seamless conversion to PDF, along with options to upload existing Markdown or PDF files.

## Features

*   **Live Markdown Editor**: A split-screen interface where users can type Markdown on the left and see a live HTML preview on the right.
*   **Instant Preview**: The HTML preview updates instantly as Markdown is typed, powered by client-side JavaScript.
*   **Markdown to PDF Conversion**: Convert your Markdown content directly into a high-quality PDF document using WeasyPrint.
*   **Markdown File Upload**: Easily upload local Markdown files (`.md`) to the editor for further editing or immediate conversion.
*   **PDF File Upload**: Upload existing PDF files for management or archiving purposes (not for conversion within the app).
*   **Minimalist Design**: A clean, distraction-free user interface with a dark-mode theme by default, adapting to user system preferences for light mode.
*   **Responsive Layout**: The application layout adjusts to different screen sizes, providing a consistent experience.

## Technologies Used

*   **Backend**: Python 3.11+
    *   **Flask**: Web framework.
    *   **WeasyPrint**: Converts HTML and CSS to PDF.
    *   **Markdown**: Converts Markdown text to HTML.
    *   **Werkzeug**: Provides `secure_filename` for secure file uploads.
    *   **Pydyf**: A low-level PDF generator used by WeasyPrint.
*   **Frontend**:
    *   HTML5, CSS3 (vanilla CSS, responsive design, `prefers-color-scheme` for theming).
    *   JavaScript (for live preview and UI interactions).

## Architecture and File Structure

The project follows a standard Flask application structure, albeit simplified by merging blueprint routes into the main `app.py` for easier debugging in this development environment:

```
md2pdf_project/
├── venv/                   # Python virtual environment
├── app.py                  # Main Flask application, routes, and logic
├── config.py               # Configuration variables (e.g., upload paths, secret key)
├── requirements.txt        # Python dependencies
├── .gitignore              # Specifies intentionally untracked files to ignore
├── GEMINI.md               # Project context and instructions for Gemini agent
├── gemlog.md               # Detailed log of agent's actions and project development
├── README.md               # This file
└── app/
    ├── __init__.py         # (Currently empty, formerly blueprint definition)
    ├── views.py            # (Currently empty, routes merged into app.py for debugging)
    ├── templates/
    │   ├── base.html       # Base HTML template
    │   └── index.html      # Main editor/preview page
    └── static/
        ├── style.css       # Minimalist CSS styling
        └── main.js         # Live preview and UI interaction logic
```

## Setup and Installation

Follow these steps to get `md2pdf` up and running on your local machine:

1.  **Clone the repository (if applicable):**
    ```bash
    git clone https://github.com/your-username/md2pdf.git
    cd md2pdf
    ```

2.  **Create and activate a virtual environment:**
    It's highly recommended to use a virtual environment to manage dependencies.
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
    (On Windows, use `venv\Scripts\activate`.)

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the Flask application:**
    ```bash
    python app.py
    ```
    The application will typically run on `http://127.0.0.1:5000/`. Open this URL in your web browser.

## Usage

Once the application is running, you can interact with it as follows:

1.  **Live Markdown Editor**:
    *   Navigate to the home page (`http://127.0.0.1:5000/`).
    *   Type or paste your Markdown text into the large left-hand editor pane.
    *   Observe the live HTML rendering of your Markdown in the right-hand preview pane.

2.  **Convert to PDF**:
    *   After composing or editing your Markdown, click the "Convert to PDF" button located at the top right of the application header.
    *   Your Markdown content will be processed and a PDF file (`document.pdf`) will be automatically downloaded to your browser.

3.  **Upload Markdown File**:
    *   To upload an existing Markdown file, click the "Upload Markdown" button in the application header.
    *   A modal window will appear. Click "Choose File" and select a `.md` file from your local system.
    *   Click "Upload". The content of your uploaded Markdown file will replace the current content in the editor.

4.  **Upload PDF File**:
    *   To upload an existing PDF file, click the "Upload PDF" button in the application header.
    *   A modal window will appear. Click "Choose File" and select a `.pdf` file from your local system.
    *   Click "Upload". The PDF file will be saved to the server's configured `uploads` directory.

## Styling

The application features a minimalist design with a dark theme by default. It automatically switches to a light theme if your operating system's preferences are set to light mode, thanks to the `prefers-color-scheme` CSS media query. The editor and preview panes are designed to be spacious and responsive, adapting to your screen size.

## Next Steps

If you have any specific features or modifications in mind, please let me know!