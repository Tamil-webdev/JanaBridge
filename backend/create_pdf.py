from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import os

os.makedirs("documents", exist_ok=True)

c = canvas.Canvas("documents/kalaignar_scheme.pdf", pagesize=letter)
c.setFont("Helvetica", 12)
c.drawString(72, 720, "Kalaignar Magalir Urimai Thogai Scheme Guidelines")
c.drawString(72, 690, "1. Objective: To recognize women's unpaid labor and empower them financially.")
c.drawString(72, 670, "2. Benefit: ₹1,000 per month transferred directly via DBT to the bank accounts of beneficiaries.")
c.drawString(72, 640, "3. Eligibility:")
c.drawString(90, 620, "- Applicants must be women/transgender individuals aged 21 and above.")
c.drawString(90, 600, "- Must be the head of the family as listed on the ration card.")
c.drawString(90, 580, "- Annual family income should be less than ₹2.5 lakh.")
c.drawString(72, 550, "4. Required Documents: Ration card, Aadhaar card, Bank passbook, Income certificate.")
c.drawString(72, 530, "5. Contact: Visit the official portal at https://kmut.tn.gov.in or local e-Sevai centre.")
c.save()
print("PDF created successfully in backend/documents/")
