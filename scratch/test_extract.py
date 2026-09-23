from pypdf import PdfReader

reader = PdfReader("temp/ryan_richards_resume.pdf")
page = reader.pages[0]
contents = page["/Contents"]

has_text_ops = False
for obj in contents:
    data = obj.get_data()
    if b"BT" in data or b"Tj" in data or b"TJ" in data:
        has_text_ops = True
        print(f"Found text ops in stream {obj.indirect_reference}")

if not has_text_ops:
    print("NO TEXT OPERATORS (BT/Tj/TJ) FOUND AT ALL IN THE ENTIRE PDF!")
