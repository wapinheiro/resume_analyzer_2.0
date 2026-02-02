#!/usr/bin/env python3
"""Extract text from PDF files in the docs directory."""

import os
import sys

try:
    import PyPDF2
except ImportError:
    print("PyPDF2 not installed. Installing...")
    os.system(f"{sys.executable} -m pip install PyPDF2 --quiet")
    import PyPDF2

def extract_pdf_text(pdf_path):
    """Extract text from a PDF file."""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text
    except Exception as e:
        return f"Error extracting {pdf_path}: {str(e)}"

def main():
    docs_dir = "/Users/wagnerp2/Documents/byu/resume_analyzer_2.0/docs"
    output_dir = "/Users/wagnerp2/Documents/byu/resume_analyzer_2.0/docs/extracted"
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Get all PDF files
    pdf_files = [f for f in os.listdir(docs_dir) if f.endswith('.pdf')]
    
    print(f"Found {len(pdf_files)} PDF files to process...")
    
    for pdf_file in pdf_files:
        pdf_path = os.path.join(docs_dir, pdf_file)
        output_file = os.path.join(output_dir, pdf_file.replace('.pdf', '.txt'))
        
        print(f"Processing: {pdf_file}")
        text = extract_pdf_text(pdf_path)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(text)
        
        print(f"  → Saved to: {output_file}")
    
    print(f"\nExtraction complete! Files saved to: {output_dir}")

if __name__ == "__main__":
    main()
