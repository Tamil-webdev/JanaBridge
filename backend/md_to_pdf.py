import os
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY

def convert_md_to_pdf():
    src_dir = Path("data/synthetic_corpus")
    dest_dir = Path("documents")
    dest_dir.mkdir(exist_ok=True)
    
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='Justify', alignment=TA_JUSTIFY))

    for md_file in src_dir.glob("*.md"):
        pdf_path = dest_dir / f"{md_file.stem}.pdf"
        print(f"Converting {md_file.name} to {pdf_path.name}...")
        
        doc = SimpleDocTemplate(str(pdf_path), pagesize=letter)
        story = []
        
        with open(md_file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    story.append(Spacer(1, 12))
                elif line.startswith("# "):
                    story.append(Paragraph(line[2:], styles["Heading1"]))
                elif line.startswith("## "):
                    story.append(Paragraph(line[3:], styles["Heading2"]))
                elif line.startswith("### "):
                    story.append(Paragraph(line[4:], styles["Heading3"]))
                elif line.startswith("* "):
                    story.append(Paragraph(f"• {line[2:]}", styles["Normal"]))
                elif line.startswith("**"):
                    story.append(Paragraph(line, styles["Normal"]))
                else:
                    story.append(Paragraph(line, styles["Normal"]))
        
        doc.build(story)
        print(f"Saved {pdf_path.name}")

if __name__ == "__main__":
    convert_md_to_pdf()
