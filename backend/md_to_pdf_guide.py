import os
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY

def convert_md_to_pdf():
    src_file = Path("data/knowledge_source/guide.md")
    dest_dir = Path("documents")
    dest_dir.mkdir(exist_ok=True)
    
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='Justify', alignment=TA_JUSTIFY))

    pdf_path = dest_dir / "JanaBridge_Government_Document_Application_Guide.pdf"
    print(f"Converting {src_file.name} to {pdf_path.name}...")
    
    doc = SimpleDocTemplate(str(pdf_path), pagesize=letter)
    story = []
    
    with open(src_file, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                story.append(Spacer(1, 12))
            elif line == "---":
                story.append(PageBreak())
            elif line.startswith("# "):
                story.append(Paragraph(line[2:], styles["Heading1"]))
            elif line.startswith("## "):
                story.append(Paragraph(line[3:], styles["Heading2"]))
            elif line.startswith("### "):
                story.append(Paragraph(line[4:], styles["Heading3"]))
            elif line.startswith("* "):
                story.append(Paragraph(f"• {line[2:]}", styles["Normal"]))
            elif line.startswith("1. ") or line.startswith("2. ") or line.startswith("3. ") or line.startswith("4. "):
                story.append(Paragraph(line, styles["Normal"]))
            else:
                story.append(Paragraph(line, styles["Normal"]))
    
    doc.build(story)
    print(f"Saved {pdf_path.name}")

if __name__ == "__main__":
    convert_md_to_pdf()
