"""
Simple HTTP Server for Student Portal Application

This script starts a local web server to serve the Student Portal files.
This is necessary because ES6 modules (import/export) don't work with file:// protocol.

Usage:
    python server.py

Then open: http://localhost:8000
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

# Configuration
PORT = 8000
DIRECTORY = Path(__file__).parent

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)
    
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        # Ensure JavaScript modules are served with correct MIME type
        if self.path.endswith('.js'):
            self.send_header('Content-Type', 'application/javascript')
        super().end_headers()

def main():
    print("=" * 60)
    print("🎓 Student Portal - Local Development Server")
    print("=" * 60)
    print(f"\n📁 Serving files from: {DIRECTORY}")
    print(f"🌐 Server URL: http://localhost:{PORT}\n")
    print("Available pages:")
    print(f"  • Student Portal:    http://localhost:{PORT}/index.html")
    print(f"  • Admin Panel:       http://localhost:{PORT}/admin.html")
    print(f"  • Data Upload:       http://localhost:{PORT}/upload-data.html")
    print(f"  • Standalone Upload: http://localhost:{PORT}/upload-data-standalone.html")
    print("\n" + "=" * 60)
    print("Press Ctrl+C to stop the server")
    print("=" * 60 + "\n")
    
    # Start server
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        # Open browser automatically
        webbrowser.open(f'http://localhost:{PORT}/upload-data.html')
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n✅ Server stopped. Goodbye!")

if __name__ == "__main__":
    main()
