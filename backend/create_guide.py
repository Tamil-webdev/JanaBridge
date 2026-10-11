"""
Creates JanaBridge_Government_Document_Application_Guide.md (knowledge source)
and JanaBridge_Government_Document_Application_Guide.pdf (for Pinecone indexing).

Run from backend/ directory:
    python create_guide.py
"""

import sys
from pathlib import Path

GUIDE_MD = Path(__file__).parent / "data" / "knowledge_source" / "JanaBridge_Government_Document_Application_Guide.md"
GUIDE_PDF = Path(__file__).parent / "documents" / "JanaBridge_Government_Document_Application_Guide.pdf"

CONTENT = r"""# JanaBridge Government Document Application Guide

Version: 1.0 | Publication Date: October 2026
Prepared by: JanaBridge Knowledge Team
Scope: Common Indian government documents and Tamil Nadu citizen services

IMPORTANT DISCLAIMER: Requirements, fees, processing times, and application availability can change at any time without notice. Always verify the current procedure and requirements on the relevant official government portal before applying. This guide is for informational purposes only. It does not constitute legal advice. JanaBridge is not affiliated with any government department.

---

## TABLE OF CONTENTS

A. Identity and National Documents
  A1. Aadhaar Enrolment and Updates
  A2. PAN Card Application and Corrections
  A3. Voter ID Registration and Corrections
  A4. Passport Application and Renewal
  A5. Driving Licence and Learner's Licence

B. Tamil Nadu Certificates and Citizen Services
  B1. Community Certificate (REV-101)
  B2. Nativity Certificate (REV-102)
  B3. Income Certificate (REV-103)
  B4. First Graduate Certificate (REV-104)
  B5. Residence Certificate (REV-116)
  B6. OBC Certificate (REV-115)
  B7. EWS Income and Asset Certificate (REV-122)
  B8. Legal Heir Certificate (REV-114)
  B9. Birth Certificate
  B10. Death Certificate
  B11. Ration Card and Family Card Services (PDS-501)

C. Education and Welfare Applications
  C1. Scholarship Applications
  C2. Indira Gandhi National Old Age Pension Scheme (REV-201)
  C3. Destitute Widow Pension Scheme (REV-202)
  C4. Differently Abled Pension Scheme (REV-206)
  C5. Kalaignar Magalir Urimai Thogai Scheme
  C6. Marriage Assistance Scheme
  C7. Handloom Worker Scholarship (DHT-201)
  C8. NFSA Scholarship (ADF-201)

D. General Application Help
  D1. Finding the Correct Official Portal
  D2. Preparing a Document Checklist
  D3. Applying Online: Step-by-Step General Process
  D4. Applying Through Authorized Service Centres
  D5. Saving Your Application / Acknowledgement Number
  D6. How to Check Application Status
  D7. Responding to Returned or Rejected Applications
  D8. Official Help and Grievance Channels

Source Directory

---

## A. IDENTITY AND NATIONAL DOCUMENTS

---

### A1. Aadhaar Enrolment and Updates

Service Name: Aadhaar (Unique Identification Number)
Issuing Authority: Unique Identification Authority of India (UIDAI)
Official Portal: https://uidai.gov.in | Self-service: https://myaadhaar.uidai.gov.in
Department: UIDAI, Ministry of Electronics and Information Technology
Date Checked: October 2026

PURPOSE AND WHO APPLIES:
Aadhaar is a 12-digit unique identification number issued to every resident of India (including children and newborns). It is the foundational ID document required by almost every government service, bank, and welfare scheme.

ELIGIBILITY:
- Any resident of India, regardless of age (including newborns)
- Foreign nationals who have resided in India for 182+ days in the preceding 12 months may also enrol

REQUIRED DOCUMENTS (Adults aged 18+):
Mandatory — choose ONE from each category:
- Proof of Identity (POI): Passport, PAN Card, Voter ID, Driving Licence, NREGS Job Card, Government Photo ID, or any UIDAI-approved document
- Proof of Address (POA): Passport, Bank Statement/Passbook (not older than 3 months), Post Office Account Passbook, Ration Card, Voter ID, Driving Licence, Electricity/Water/Telephone bill (not older than 3 months), Government photo ID with address

For children below 5 years:
- Birth Certificate (mandatory)
- One parent's valid Aadhaar Card (mandatory)

Conditional:
- For Head-of-Family based enrolment: Proof of relationship (birth certificate, marriage certificate, etc.)

STEP-BY-STEP PROCEDURE — New Enrolment:
Step 1: Locate the nearest Aadhaar Enrolment Centre using https://uidai.gov.in > Locate Enrolment Centre.
Step 2: Visit the centre during working hours with original documents and self-attested photocopies.
Step 3: Fill the Aadhaar Enrolment / Correction Form (available at the centre or downloadable from UIDAI).
Step 4: Submit biometrics: fingerprints, iris scan, and photograph at the centre.
Step 5: Submit supporting documents (originals + self-attested copies) to the operator.
Step 6: Collect the Enrolment Acknowledgement Slip with your 14-digit Enrolment ID (EID). Keep this safe.
Step 7: Aadhaar is delivered by post or can be downloaded online after processing (allow up to 90 days).

STEP-BY-STEP PROCEDURE — Online Demographic Update (name, address, DOB, gender, mobile, email):
Step 1: Visit https://myaadhaar.uidai.gov.in.
Step 2: Log in using your Aadhaar number + OTP sent to your registered mobile.
Step 3: Click "Update Aadhaar" and select the field you want to update.
Step 4: Upload the supporting document for the update.
Step 5: Submit and note the Service Request Number (SRN) for tracking.
Note: Biometric updates (fingerprints, iris) MUST be done at an Aadhaar Enrolment Centre — they cannot be done online.

OFFICIAL APPLICATION PORTAL: https://uidai.gov.in | Authorized Aadhaar Enrolment Centres (for new enrolment and biometrics)

FEE AND PROCESSING TIME:
- New enrolment: Free
- Demographic update (online): Rs. 50 (Not verified from an official current source — verify at uidai.gov.in)
- Biometric update at centre: Rs. 100 (Not verified from an official current source)
- Processing time: Up to 90 days after biometric enrolment (Not verified from an official current source)

HOW TO TRACK APPLICATION STATUS:
1. Visit https://myaadhaar.uidai.gov.in/checkStatus
2. Enter your 14-digit Enrolment ID (EID) from your acknowledgement slip.
3. Or send SMS: "UIDAI STATUS <14-digit EID>" to 51969.

CORRECTIONS, RENEWAL, GRIEVANCES:
- Demographic corrections: Online via myaadhaar.uidai.gov.in or at enrolment centre
- Aadhaar does not expire — no renewal is needed
- Lost or damaged Aadhaar: Download e-Aadhaar (legally valid) from myaadhaar.uidai.gov.in
- Grievances: Call UIDAI toll-free 1947 | Email help@uidai.gov.in

COMMON MISTAKES AND TIPS:
- Name spelling must be identical across all documents (POI and POA) — mismatch is the #1 rejection reason
- Check that your mobile number is registered with Aadhaar before attempting online updates
- e-Aadhaar downloaded from UIDAI is legally valid — plastic card is not mandatory
- Keep Acknowledgement Slip safe until you receive your Aadhaar

VERIFICATION STATUS: Based on publicly available UIDAI guidance. Not individually verified from a live official current source. Verify at https://uidai.gov.in before applying.
Official Source URL: https://uidai.gov.in | Department: UIDAI | Date Checked: October 2026

---

### A2. PAN Card Application and Corrections

Service Name: Permanent Account Number (PAN) Card
Issuing Authority: Income Tax Department, Government of India
Official Portal: https://www.incometax.gov.in
Application Portals: NSDL/Protean: https://www.onlineservices.nsdl.com | UTIITSL: https://www.utiitsl.com
Department: Central Board of Direct Taxes (CBDT), Ministry of Finance
Date Checked: October 2026

PURPOSE AND WHO APPLIES:
PAN is a 10-character alphanumeric identifier required for all financial transactions above a threshold, income tax filing, opening bank accounts, buying property, and conducting business in India. All individuals earning taxable income must have a PAN.

ELIGIBILITY:
- Any Indian citizen, including minors
- Companies, trusts, and other legal entities
- Foreign nationals and foreign companies earning income in India

REQUIRED DOCUMENTS (for Individuals):
- Proof of Identity (POI): Aadhaar, Voter ID, Driving Licence, Passport, or Ration Card
- Proof of Address (POA): Aadhaar, Passport, Driving Licence, Voter ID, Bank statement (3 months), Utility bill (3 months)
- Proof of Date of Birth (DOB): Birth Certificate, Aadhaar, School leaving certificate / Class 10 marksheet
- Photograph: Two recent passport-size photographs (for physical form)
For Instant e-PAN: Only Aadhaar Card required (with registered mobile for OTP)

STEP-BY-STEP PROCEDURE — Option 1: Instant e-PAN (Free, online, Aadhaar holders only):
Step 1: Visit https://www.incometax.gov.in/iec/foportal
Step 2: Click "Instant e-PAN" under Quick Links, then "Get New e-PAN".
Step 3: Enter your 12-digit Aadhaar number.
Step 4: Enter the OTP received on your Aadhaar-registered mobile.
Step 5: Confirm the demographic details fetched from UIDAI.
Step 6: Review and submit — e-PAN is generated immediately as a downloadable PDF.

STEP-BY-STEP PROCEDURE — Option 2: Physical PAN Card (via NSDL/Protean):
Step 1: Visit https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html
Step 2: Select "New PAN" > Indian Citizen (Form 49A).
Step 3: Fill personal details, contact information, address.
Step 4: Upload photograph and supporting documents.
Step 5: Pay the application fee online.
Step 6: Submit — note the 15-digit Acknowledgement Number.
Step 7: Physical PAN card is dispatched to your address by Speed Post.

For Corrections or Changes in existing PAN:
Step 1: Visit https://www.onlineservices.nsdl.com → "Changes or Correction in existing PAN data / Reprint of PAN card"
Step 2: Enter existing PAN number, fill change form, upload supporting documents, pay fee.

OFFICIAL APPLICATION PORTAL: https://www.incometax.gov.in | https://www.onlineservices.nsdl.com | https://www.utiitsl.com

FEE AND PROCESSING TIME:
- Instant e-PAN: Free (Not verified from an official current source — verify at incometax.gov.in)
- Physical PAN (domestic address): Approximately Rs. 107 including GST (Not verified from an official current source)
- Physical PAN (foreign address): Approximately Rs. 1,017 (Not verified from an official current source)
- Processing: e-PAN is immediate; physical card takes approximately 15–20 working days

HOW TO TRACK APPLICATION STATUS:
1. Visit https://www.onlineservices.nsdl.com → "Track PAN Card" → Enter 15-digit acknowledgement number
2. Or call NSDL PAN helpdesk: 020-27218080

CORRECTIONS, RENEWAL, GRIEVANCES:
- PAN does not expire — no renewal needed
- Correction form available on NSDL/UTIITSL portals
- IMPORTANT: Link PAN with Aadhaar on incometax.gov.in to keep PAN active (check current deadlines)
- Grievances: Email tininfo@nsdl.co.in | Call 020-27218080

COMMON MISTAKES AND TIPS:
- Ensure Aadhaar and PAN details (name, DOB) match exactly — discrepancies cause rejection
- For minors, the guardian must sign and complete the physical form
- Keep signature strictly within the signature box on physical forms
- PAN-Aadhaar linking is mandatory — check current deadline at incometax.gov.in

VERIFICATION STATUS: Based on publicly available Income Tax Department and NSDL guidance. Fee amounts may have changed — verify at https://www.incometax.gov.in before applying.
Official Source URL: https://www.incometax.gov.in | Department: CBDT | Date Checked: October 2026

---

### A3. Voter ID Registration and Corrections

Service Name: Electoral Photo Identity Card (EPIC) / Voter ID
Issuing Authority: Election Commission of India (ECI) / State Election Commission
Official Portal: https://voters.eci.gov.in | Also: https://www.eci.gov.in
Department: Election Commission of India
Date Checked: October 2026

PURPOSE AND WHO APPLIES:
The Voter ID (EPIC) is the primary document to exercise the right to vote in Indian elections. It is also widely accepted as proof of identity and address. Every eligible Indian citizen should be on the electoral roll.

ELIGIBILITY:
- Indian citizen aged 18 years or above
- Ordinary resident at the address in the constituency where registering
- Not disqualified under any election law

REQUIRED DOCUMENTS:
For New Registration (Form 6):
- Age Proof: Birth Certificate, Class 10 marksheet, Passport, or Aadhaar Card
- Address Proof (must match residential address): Aadhaar Card, Passport, Bank Passbook, Utility bill (latest), Ration Card, or Registered lease/rent agreement

For Correction / Change of Address (Form 8):
- Proof of new address
- Existing EPIC number

STEP-BY-STEP PROCEDURE — New Registration Online:
Step 1: Visit https://voters.eci.gov.in
Step 2: Click "Register as New Voter" (Form 6).
Step 3: Create an account or log in.
Step 4: Fill personal details: name, father/husband name, DOB, address, gender.
Step 5: Upload photograph and supporting documents.
Step 6: Submit — note your Reference ID for tracking.

For Address Change / Correction: Use Form 8 at https://voters.eci.gov.in
For Offline Application: Visit your nearest Electoral Registration Officer (ERO) or Booth Level Officer (BLO) with Form 6 and self-attested documents.

OFFICIAL APPLICATION PORTAL: https://voters.eci.gov.in

FEE AND PROCESSING TIME:
- Free of charge
- Processing depends on the electoral roll revision cycle (Not verified from an official current source — verify at voters.eci.gov.in)

HOW TO TRACK APPLICATION STATUS:
1. Visit https://voters.eci.gov.in → "Track Application Status"
2. Enter Reference ID received at the time of submission.

CORRECTIONS, RENEWAL, GRIEVANCES:
- Change of address: Form 8 at voters.eci.gov.in
- Name/DOB correction: Form 8 → "Correction of entries"
- Shifting to a different constituency: Form 8A
- Lost/damaged card: Apply for duplicate at voters.eci.gov.in
- Grievances: Call National Voter helpline 1950

COMMON MISTAKES AND TIPS:
- Address on form must match exactly with your address proof document
- Register well before state/general elections — rolls close before election dates
- Download the Voter Helpline App (1950) for easier status tracking

VERIFICATION STATUS: Based on publicly available ECI guidance. Verify current procedures at https://voters.eci.gov.in.
Official Source URL: https://voters.eci.gov.in | Department: ECI | Date Checked: October 2026

---

### A4. Passport Application and Renewal

Service Name: Ordinary Passport (Type P) — Fresh / Re-issue
Issuing Authority: Passport Seva Kendras under Ministry of External Affairs
Official Portal: https://www.passportindia.gov.in
Department: Ministry of External Affairs, Government of India
Date Checked: October 2026

PURPOSE AND WHO APPLIES:
A passport is the primary travel document for Indian citizens for international travel. It also serves as proof of Indian citizenship and date of birth.

ELIGIBILITY:
- Indian citizens only
- Minors require parental consent

REQUIRED DOCUMENTS (Fresh Passport — Adult 18+):
Mandatory:
- Proof of Present Address (POA): Aadhaar, Voter ID, Driving Licence, Bank Statement (3 months), Utility bill (3 months), Ration Card
- Proof of Date of Birth (DOB): Birth Certificate, Class 10 marksheet with DOB, Aadhaar, Voter ID, or Driving Licence with DOB
- Aadhaar Card (strongly recommended — simplifies police verification significantly)
- Photograph: Two recent passport-size photographs (white background, 35mm x 45mm)
Optional:
- Class 10 passing certificate (for ECNR — Emigration Check Not Required status)
For Minors: Parents' Aadhaar, Child's Birth Certificate, Annexure D (consent from non-applying parent)

STEP-BY-STEP PROCEDURE:
Step 1: Register at https://www.passportindia.gov.in → "New User Registration"
Step 2: Log in and click "Apply for Fresh Passport / Re-issue of Passport"
Step 3: Select "Fresh Passport" or "Re-issue" as applicable
Step 4: Choose booklet type: 36-page or 60-page
Step 5: Fill the online application form carefully — save your draft regularly
Step 6: Pay the fee online (debit/credit card, net banking, or UPI)
Step 7: Book an appointment at your nearest Passport Seva Kendra (PSK) or District Passport Cell (DPC)
Step 8: Visit PSK on appointment date with: printed application form, appointment confirmation, original documents + two sets of self-attested photocopies
Step 9: Biometrics (fingerprints, photo, signature) are collected at the PSK
Step 10: Receive your 13-digit File Number for tracking

Police Verification: A police officer visits your home for normal passports (post-police verification). Some categories get pre-police verification clearance.

OFFICIAL APPLICATION PORTAL: https://www.passportindia.gov.in

FEE AND PROCESSING TIME:
- 36-page Normal: Rs. 1,500 (Not verified from an official current source — verify at passportindia.gov.in)
- 60-page Normal: Rs. 2,000 (Not verified from an official current source)
- Tatkal (urgent): Additional Rs. 2,000 above normal fee (Not verified from an official current source)
- Processing: Normal — 30 to 45 days; Tatkal — 7 to 14 days after police verification (Not verified)

HOW TO TRACK APPLICATION STATUS:
1. Visit https://www.passportindia.gov.in → "Track Your Application Status"
2. Enter 13-digit File Number and date of birth.
3. Or SMS "STATUS FILE_NUMBER" to 9704100100
4. Or call Passport Seva helpline: 1800-258-1800 (toll-free)

CORRECTIONS, RENEWAL, GRIEVANCES:
- Renewal (re-issue): Same portal, select "Re-issue of Passport"
- Correction of details: Re-issue application with supporting proof
- Lost passport: Re-issue application + FIR copy from police
- Grievances: passportindia.gov.in → Grievance Cell

COMMON MISTAKES AND TIPS:
- Double-check all personal details BEFORE paying fee — corrections after payment need a new application
- Police verification calls may come from unknown numbers — keep your mobile active
- Arrive at PSK 15 minutes early — security check takes time
- If police verification is delayed, contact the local Passport Office with your File Number

VERIFICATION STATUS: Based on publicly available MEA/Passport Seva guidance. Fees are indicative — verify at https://www.passportindia.gov.in before applying.
Official Source URL: https://www.passportindia.gov.in | Department: MEA | Date Checked: October 2026

---

### A5. Driving Licence and Learner's Licence

Service Name: Learner's Licence (LL) and Permanent Driving Licence (DL)
Issuing Authority: Regional Transport Authority (RTA), State Transport Department
Official Portal: https://sarathi.parivahan.gov.in | Also: https://parivahan.gov.in
Department: Ministry of Road Transport and Highways (MoRTH), Government of India
Date Checked: October 2026

PURPOSE AND WHO APPLIES:
A Learner's Licence authorizes a person to learn to drive under supervision. A Driving Licence authorizes a person to independently drive motor vehicles on public roads.

ELIGIBILITY:
- Motorcycle Without Gear (MCWOG): Minimum age 16 years (with parent/guardian consent)
- All other vehicles (with gear, light motor vehicle): Minimum age 18 years
- Commercial/Transport vehicles: Minimum age 20 years and must hold Light Motor Vehicle DL for at least 1 year

REQUIRED DOCUMENTS (Learner's Licence):
Mandatory:
- Proof of Age (DoB): Birth Certificate, Class 10 marksheet, Passport, Aadhaar, or Voter ID
- Proof of Address: Aadhaar, Voter ID, Passport, Bank Passbook, Utility bill (3 months)
- Medical Certificate (Form 1): Self-declaration of medical fitness (all applicants)
- Medical Certificate (Form 1A): For applicants aged 40 and above — must be certified by a registered medical practitioner
- Passport-size photographs (typically 2–3)
Additional for Driving Licence:
- Valid Learner's Licence (must have held LL for at least 30 days before DL application)

STEP-BY-STEP PROCEDURE — Learner's Licence:
Step 1: Visit https://sarathi.parivahan.gov.in and select your state.
Step 2: Click "Apply for Learner Licence".
Step 3: Fill LL application form: personal details, vehicle class(es) required.
Step 4: Upload documents and photograph.
Step 5: Pay the application fee online.
Step 6: Book a slot for the LL Test (computer-based theory test at RTO).
Step 7: Visit RTO on test date with originals — appear for the computer-based test on traffic signs and rules.
Step 8: If passed, Learner's Licence is issued digitally — download from the portal.

STEP-BY-STEP PROCEDURE — Permanent Driving Licence (after 30+ days holding LL):
Step 1: Visit https://sarathi.parivahan.gov.in → "Apply for Driving Licence".
Step 2: Enter your Learner's Licence number and details.
Step 3: Pay DL application fee and book a driving test slot at the RTO.
Step 4: Visit the RTO test ground on the appointed date with YOUR OWN VEHICLE.
Step 5: Demonstrate driving skills: figure-8 manoeuvre, parking, gradient stop, etc.
Step 6: If cleared, DL is dispatched by post or available for digital download.

OFFICIAL APPLICATION PORTAL: https://sarathi.parivahan.gov.in

FEE AND PROCESSING TIME:
- Learner's Licence fee: Varies by state and vehicle class (Not verified from an official current source — check at sarathi.parivahan.gov.in for your state)
- Driving Licence fee: Varies by state (Not verified from an official current source)
- Processing: LL typically issued same day on passing test; DL dispatched within 7–30 days (Not verified)

HOW TO TRACK APPLICATION STATUS:
1. Visit https://sarathi.parivahan.gov.in → "Application Status"
2. Enter your Application Number.

CORRECTIONS, RENEWAL, GRIEVANCES:
- DL renewal: Apply online at sarathi.parivahan.gov.in before expiry
- Address change / vehicle class addition: Apply for DL services online
- Lost DL: Apply for "Duplicate DL" with FIR copy
- Grievances: State Transport Department helpline

COMMON MISTAKES AND TIPS:
- BRING YOUR OWN VEHICLE for the DL driving test — RTO does not provide vehicles
- Carry original Learner's Licence on DL test day — digital copy may not be accepted at all RTOs
- The mandatory 30-day gap between LL issue and DL test CANNOT be waived
- Form 1A medical certificate must be from a registered MBBS/MD doctor

VERIFICATION STATUS: Based on publicly available Parivahan/Sarathi guidance. Fees and exact procedures are state-specific — verify at https://sarathi.parivahan.gov.in for your state.
Official Source URL: https://sarathi.parivahan.gov.in | Department: MoRTH | Date Checked: October 2026

---

## B. TAMIL NADU CERTIFICATES AND CITIZEN SERVICES

KEY TERMS FOR TAMIL NADU SERVICES:
- e-Sevai Portal: https://tnesevai.tn.gov.in — Tamil Nadu's unified citizen services portal
- CAN (Citizen Access Number): A unique ID required to apply for any e-Sevai service; register for free on the portal
- CSC (Common Service Centre): Authorized physical centres where operators help you apply
- VAO (Village Administrative Officer): Field officer who verifies applications at village level
- RI (Revenue Inspector): Supervises VAOs; issues/countersigns certificates
- Tahsildar: Head of the Taluk office — approves certificates and handles grievances

HOW TO REGISTER FOR CAN (Citizen Access Number):
Step 1: Visit https://tnesevai.tn.gov.in
Step 2: Click "Citizen Login" then "Register CAN".
Step 3: Enter your name, Aadhaar number, mobile number, and email ID.
Step 4: An OTP is sent to your mobile — enter it to verify.
Step 5: Your CAN Number is generated and displayed — save it (you will need it for every application).

---

### B1. Community Certificate (REV-101)

Service Name: Community Certificate
Service Code: REV-101
Issuing Authority: Revenue Department, Government of Tamil Nadu
Official Portal: https://tnesevai.tn.gov.in
Source: Tamil Nadu e-District Application User Manual (REV-101), Government of Tamil Nadu, Copyright 2016
Department: Revenue Department, Government of Tamil Nadu
Date Checked: October 2026

PURPOSE AND WHO APPLIES:
A Community Certificate certifies the social community to which an individual belongs — Backward Class (BC), Most Backward Class (MBC), Scheduled Caste (SC), or Scheduled Tribe (ST). It is required for:
- Educational institution admissions under reserved quota
- Government job applications under reserved categories
- Scholarship applications (nearly all schemes require this)
- Government welfare scheme eligibility

ELIGIBILITY:
- Residents of Tamil Nadu belonging to officially recognized backward/scheduled communities
- Community is determined by the applicant's caste/community by birth

REQUIRED DOCUMENTS:
Mandatory:
- Aadhaar Card of the applicant
- Applicant's recent passport-size photograph
- Self-Declaration / Self-Attested affidavit regarding community membership

Conditional (may be required by verifying officer):
- Father's or Mother's Community Certificate (if available — strongly recommended to include)
- Parents' Aadhaar Cards
- Ration Card (for address and family details verification)

Optional:
- School Transfer Certificate (TC) showing community details
- Caste records from village administrative records

STEP-BY-STEP PROCEDURE — Online via e-Sevai Portal:
Step 1: Visit https://tnesevai.tn.gov.in and log in with your CAN number (register CAN first if you do not have one).
Step 2: Click "Services" → "Revenue Department" → "REV-101 Community Certificate".
Step 3: Click "Proceed".
Step 4: Search for your record by CAN number, name, mobile number, email ID, or date of birth.
Step 5: Select your record from search results and click "Proceed".
Step 6: Fill the application form:
  - Section 1: Applicant Details (pre-filled from CAN — verify for accuracy)
  - Section 2: Current Address (pre-filled — verify)
  - Section 3: Permanent Address (pre-filled — verify)
  - Section 4: Contact Details (pre-filled — verify)
  - Section 5: Community Details — enter your community, sub-caste, native village details
Step 7: Upload required documents in specified formats (JPEG for photo, PDF for documents).
Step 8: Review the complete application and click "Submit".
Step 9: Note your Application Number / Acknowledgement Number from the receipt — save it for tracking.

Via Authorized e-Sevai / CSC Centre (if you cannot apply online):
Step 1: Visit your nearest e-Sevai centre with original documents.
Step 2: The operator logs in and fills the form on your behalf.
Step 3: You provide biometric (fingerprint) or OTP confirmation.
Step 4: Pay the service charge to the operator.
Step 5: Collect your printed acknowledgement slip with Application Number.

OFFICIAL APPLICATION PORTAL: https://tnesevai.tn.gov.in | Authorized CSC / e-Sevai centres

FEE AND PROCESSING TIME:
- Application Fee: Nil (zero government fee)
- Service Charge (at e-Sevai centre operator): Approximately Rs. 60 (Not verified from an official current source — verify at tnesevai.tn.gov.in)
- Expected Processing Time: Approximately 15 working days (Not verified from an official current source)

HOW TO TRACK APPLICATION STATUS:
Step 1: Visit https://tnesevai.tn.gov.in
Step 2: Click "Track Application Status" on the home page.
Step 3: Enter your Application Number from the acknowledgement slip.
Step 4: Status displayed: Pending / Under Verification by VAO / Under Verification by RI / Approved / Returned / Rejected.

CORRECTIONS, RENEWAL, APPEAL, GRIEVANCES:
- If application is Returned: Read the Return Remarks from the VAO/RI, correct the uploaded documents, and resubmit on the same portal (no need to start fresh).
- If Rejected: Appeal to the Tahsildar's office with acknowledgement number.
- Grievances: Call CM Helpline 1100 | Submit complaint on tnesevai.tn.gov.in → Grievance section.
- Note: Community Certificates have a validity period — apply for a fresh one when it expires.

COMMON MISTAKES AND TIPS:
- Community name entered must match exactly the terminology in your parents' certificate (e.g., "Backward Class" not "BC")
- Poor image quality (blurry, too dark, file too large) is the most common return reason
- Always upload parents' community certificate if available — it significantly speeds up verification
- If parents lack a community certificate, bring school TC or village records showing community

QUICK-REFERENCE CHECKLIST:
[ ] CAN Number (register if you don't have one)
[ ] Aadhaar Card
[ ] Recent passport-size photograph
[ ] Self-declaration affidavit
[ ] Parents' Community Certificate (if available)
[ ] Ration Card
[ ] Application Number (save after submitting)

VERIFICATION STATUS: Verified against JanaBridge PDF corpus (CSCOperator_REV-101_CommunityCertificate.pdf, Government of Tamil Nadu, Copyright 2016). Fees and processing times should be confirmed at https://tnesevai.tn.gov.in.
Official Source URL: https://tnesevai.tn.gov.in | Department: Revenue Dept, TN | Date Checked: October 2026

---

### B2. Nativity Certificate (REV-102)

Service Name: Nativity Certificate
Service Code: REV-102
Issuing Authority: Revenue Department, Government of Tamil Nadu
Official Portal: https://tnesevai.tn.gov.in
Source: Tamil Nadu e-District Application User Manual (REV-102), Government of Tamil Nadu
Date Checked: October 2026

PURPOSE AND WHO APPLIES:
A Nativity Certificate proves that an individual is a native of Tamil Nadu — typically someone born in Tamil Nadu OR who has been continuously residing there for 5 or more years. Required for:
- College and professional course admissions under state quota
- Tamil Nadu state government employment
- Welfare scheme eligibility

ELIGIBILITY:
- Person born in Tamil Nadu, OR
- Person who has been continuously residing in Tamil Nadu for 5 or more years

REQUIRED DOCUMENTS:
Mandatory:
- Aadhaar Card
- Ration Card (shows family membership in Tamil Nadu)
- Recent passport-size photograph
- Self-Declaration / Affidavit stating nativity

Conditional:
- Birth Certificate (if born in Tamil Nadu — strongest proof of nativity by birth)
- School Transfer Certificate / SSLC mark sheet (for children — to prove residence)
- Any proof showing continuous 5-year stay in Tamil Nadu (school records, property tax receipts, etc.)

Optional:
- Parents' or siblings' existing Nativity Certificate

STEP-BY-STEP PROCEDURE:
Step 1: Visit https://tnesevai.tn.gov.in → Log in with CAN.
Step 2: Click "Services" → "Revenue Department" → "REV-102 Nativity Certificate".
Step 3: Search for your record, select, and click "Proceed".
Step 4: Fill the form: place of birth, number of years of residence in Tamil Nadu, district/taluk.
Step 5: Upload required documents.
Step 6: Review and submit — note Application Number.

OFFICIAL APPLICATION PORTAL: https://tnesevai.tn.gov.in | Authorized CSC / e-Sevai centres

FEE AND PROCESSING TIME:
- Service Charge: Approximately Rs. 60 at e-Sevai centre (Not verified from an official current source)
- Processing: Approximately 15 working days (Not verified from an official current source)

HOW TO TRACK: Visit https://tnesevai.tn.gov.in → "Track Application Status" → Enter Application Number

CORRECTIONS AND GRIEVANCES:
- Returned applications: Correct documents and resubmit on the same portal
- Grievances: Tahsildar's office or CM Helpline 1100

COMMON MISTAKES AND TIPS:
- Insufficient proof of continuous 5-year stay is the most common rejection reason
- Ration card showing same address over multiple years serves as strong proof of continuous residence
- For school-going children, school admission records and TC are the best proof of stay

VERIFICATION STATUS: Verified against JanaBridge PDF corpus (CSCOperator_REV-102_NativityCertificate.pdf). Fees and processing times should be confirmed at https://tnesevai.tn.gov.in.
Official Source URL: https://tnesevai.tn.gov.in | Department: Revenue Dept, TN | Date Checked: October 2026

---

### B3. Income Certificate (REV-103)

Service Name: Income Certificate
Service Code: REV-103
Issuing Authority: Revenue Department, Government of Tamil Nadu
Official Portal: https://tnesevai.tn.gov.in
Source: Tamil Nadu e-District Application User Manual (REV-103), Government of Tamil Nadu, Copyright 2017
Department: Revenue Department, Government of Tamil Nadu
Date Checked: October 2026

PURPOSE AND WHO APPLIES:
An Income Certificate certifies the total annual income of a family or individual. It is required for:
- Scholarship applications (most government scholarships require it)
- Fee concessions at educational institutions
- Welfare scheme eligibility (pensions, housing, ration card category, etc.)
- Benefits linked to income criteria

ELIGIBILITY:
- Any resident of Tamil Nadu who needs to prove their annual family income
- Typically required when annual family income is below a specified threshold for a benefit

REQUIRED DOCUMENTS:
Mandatory:
- Aadhaar Card
- Ration Card
- Self-Declaration / Affidavit stating the total annual family income

Conditional (depending on income source):
- Salary Certificate / Pay slip (for salaried government/private employees)
- Employer's letter / HR declaration
- Income Tax Return (ITR) acknowledgement (if filed)
- Patta / Land Records (for agricultural income)
- Pension order / pension slip (for pensioners)
- Any other income proof (rental income receipts, etc.)

STEP-BY-STEP PROCEDURE:
Step 1: Visit https://tnesevai.tn.gov.in → Log in with CAN number.
Step 2: Click "Services" → "Revenue Department" → "REV-103 Income Certificate".
Step 3: Click "Proceed", search for your record, select it, and click "Proceed".
Step 4: Fill the application form:
  - Enter ALL sources of income for ALL earning family members
  - Specify total annual family income in Rs.
Step 5: Upload supporting income documents (salary slip, ITR, self-declaration, etc.).
Step 6: Review the application carefully and submit.
Step 7: Note the Application Number from the acknowledgement.

OFFICIAL APPLICATION PORTAL: https://tnesevai.tn.gov.in | Authorized CSC / e-Sevai centres

FEE AND PROCESSING TIME:
- Service Charge: Approximately Rs. 60 at e-Sevai centre (Not verified from an official current source)
- Processing: Approximately 15 working days (Not verified from an official current source)

HOW TO TRACK: Visit https://tnesevai.tn.gov.in → "Track Application Status" → Enter Application Number

CORRECTIONS AND GRIEVANCES:
- Income certificates have a validity of typically 1 year — apply fresh after expiry
- For corrections: Approach Tahsildar's office
- Grievances: CM Helpline 1100

COMMON MISTAKES AND TIPS:
- Include income from ALL sources for ALL earning family members — omissions cause rejection after VAO verification
- The VAO (Village Administrative Officer) physically verifies income claims during field inspection — provide accurate information
- For scholarship applications, the certificate must typically be dated within 1 year of application

QUICK-REFERENCE CHECKLIST:
[ ] CAN Number
[ ] Aadhaar Card
[ ] Ration Card
[ ] Salary slip / ITR / income proof for all earning members
[ ] Self-declaration affidavit
[ ] Application Number (save after submitting)

VERIFICATION STATUS: Verified against JanaBridge PDF corpus (CSCOperator_REV-103_IncomeCertificate.pdf, Government of Tamil Nadu, Copyright 2017). Fees and processing times should be confirmed at https://tnesevai.tn.gov.in.
Official Source URL: https://tnesevai.tn.gov.in | Department: Revenue Dept, TN | Date Checked: October 2026

---

### B4. First Graduate Certificate (REV-104)

Service Name: First Graduate Certificate
Service Code: REV-104
Issuing Authority: Revenue Department, Government of Tamil Nadu
Official Portal: https://tnesevai.tn.gov.in
Date Checked: October 2026

PURPOSE AND WHO APPLIES:
This certificate certifies that the applicant is the FIRST person in their immediate family to pursue a graduation-level (degree) qualification. It entitles the holder to:
- Fee concessions at educational institutions
- Special scholarships for first-generation graduates

ELIGIBILITY:
- Applicant must be enrolled in or have completed a degree-level course
- Neither parent (father nor mother) should have completed a degree-level qualification
- No older sibling should have completed or be currently pursuing a degree-level qualification
- The eligibility restriction applies to immediate family only (parents and biological siblings)

REQUIRED DOCUMENTS:
Mandatory:
- Aadhaar Card
- Ration Card
- Self-Declaration / Affidavit (certifying no other immediate family member is a graduate)
- Transfer Certificate (TC) from school (last institution attended before college)
- College admission letter or enrollment certificate

Conditional:
- Parents' educational certificates (SSLC / Class 10 maximum)
- Older siblings' educational certificates (to confirm they are not graduates)

STEP-BY-STEP PROCEDURE:
Step 1: Visit https://tnesevai.tn.gov.in → Log in with CAN.
Step 2: Click "Services" → "Revenue Department" → "REV-104 First Graduate Certificate".
Step 3: Search for record, select, and click "Proceed".
Step 4: Fill form including parents' and siblings' highest educational qualification.
Step 5: Upload required documents.
Step 6: Submit and note Application Number.

OFFICIAL APPLICATION PORTAL: https://tnesevai.tn.gov.in

FEE AND PROCESSING TIME:
- Service Charge: Approximately Rs. 60 at e-Sevai centre (Not verified from an official current source)
- Processing: Approximately 15 working days (Not verified from an official current source)

COMMON MISTAKES AND TIPS:
- If any OLDER sibling has graduated, you are NOT eligible — do not apply
- If parents' educational certificates are unavailable, a self-declaration is accepted
- Attach college enrollment proof to demonstrate you are currently pursuing graduation

VERIFICATION STATUS: Verified against JanaBridge synthetic corpus. Confirm at https://tnesevai.tn.gov.in.
Official Source URL: https://tnesevai.tn.gov.in | Department: Revenue Dept, TN | Date Checked: October 2026

---

### B5. Residence Certificate (REV-116)

Service Name: Residence Certificate
Service Code: REV-116
Issuing Authority: Revenue Department, Government of Tamil Nadu
Official Portal: https://tnesevai.tn.gov.in
Date Checked: October 2026

PURPOSE: Proves that an individual is a current resident of a specific address in Tamil Nadu. Required for school/college admissions, government scheme applications, and employment.

ELIGIBILITY: Any resident of Tamil Nadu

REQUIRED DOCUMENTS:
- Aadhaar Card (with current address)
- Ration Card
- Voter ID Card
- Recent passport-size photograph
- Self-Declaration of residence

STEP-BY-STEP PROCEDURE:
Step 1: Visit https://tnesevai.tn.gov.in → Log in with CAN.
Step 2: Services → Revenue Department → REV-116 Residence Certificate.
Step 3: Fill current address details, upload documents, and submit.

FEE AND PROCESSING TIME:
- Service Charge: Approximately Rs. 60 (Not verified from an official current source)
- Processing: Approximately 15 working days (Not verified from an official current source)

HOW TO TRACK: https://tnesevai.tn.gov.in → Track Application Status

VERIFICATION STATUS: Not verified from an official current source. Confirm at https://tnesevai.tn.gov.in.
Official Source URL: https://tnesevai.tn.gov.in | Department: Revenue Dept, TN | Date Checked: October 2026

---

### B6. OBC Certificate (REV-115)

Service Name: Other Backward Classes (OBC) Certificate
Service Code: REV-115
Issuing Authority: Revenue Department, Government of Tamil Nadu
Official Portal: https://tnesevai.tn.gov.in
Date Checked: October 2026

PURPOSE AND WHO APPLIES:
The OBC Certificate (for Central purposes) certifies that an applicant belongs to a community recognized as Other Backward Class by the Central Government. Required for:
- Central government job applications under OBC reservation (27% quota)
- Central educational institution (IITs, NITs, central universities) admissions under OBC quota

IMPORTANT NOTE: This (REV-115) is different from the Tamil Nadu BC/MBC Community Certificate (REV-101), which is for STATE government reservations. You may need BOTH depending on the institution/job.

ELIGIBILITY:
- Community must be in the Central OBC list (verify with issuing authority)
- Must qualify as Non-Creamy Layer: annual family income below the applicable ceiling (Not verified from an official current source — check with Tahsildar)

REQUIRED DOCUMENTS:
- Aadhaar Card
- Ration Card or address proof
- Self-Declaration / Affidavit
- Parents' community/caste certificates (if available)

STEP-BY-STEP PROCEDURE:
Step 1: Visit https://tnesevai.tn.gov.in → Log in with CAN.
Step 2: Services → Revenue Department → REV-115 OBC Certificate.
Step 3: Fill caste/community details, upload documents, submit.

FEE AND PROCESSING TIME:
- Service Charge: Approximately Rs. 60 (Not verified from an official current source)
- Processing: Approximately 15 working days (Not verified from an official current source)

VERIFICATION STATUS: Not verified from an official current source. Confirm at https://tnesevai.tn.gov.in.
Official Source URL: https://tnesevai.tn.gov.in | Department: Revenue Dept, TN | Date Checked: October 2026

---

### B7. EWS Income and Asset Certificate (REV-122)

Service Name: Income and Asset Certificate for Economically Weaker Sections (EWS)
Service Code: REV-122
Issuing Authority: Revenue Department, Government of Tamil Nadu
Official Portal: https://tnesevai.tn.gov.in
Date Checked: October 2026

PURPOSE AND WHO APPLIES:
The EWS certificate proves that an applicant belongs to the Economically Weaker Section as per Central Government criteria. Required for:
- EWS reservation (10% quota) in Central government jobs
- EWS quota admissions in central educational institutions

ELIGIBILITY (Central Govt criteria — verify current thresholds):
- Annual family income below Rs. 8 lakh
- Family does not own: agricultural land of 5 acres or more; residential plot of 100 sq. yards or more in notified municipalities; residential plot of 200 sq. yards or more in non-notified areas; residential house of 1,000 sq. feet or more
- (Not verified from an official current source — check with issuing authority for current criteria)

REQUIRED DOCUMENTS:
- Aadhaar Card
- Income Certificate or Self-Declaration of income
- Land/property records (if applicable)
- Ration Card
- Self-Declaration regarding income and assets

STEP-BY-STEP PROCEDURE:
Step 1: Visit https://tnesevai.tn.gov.in → Log in with CAN.
Step 2: Services → Revenue Department → REV-122 EWS Certificate.
Step 3: Fill family income and asset details, upload documents, submit.

FEE AND PROCESSING TIME:
- Service Charge: Approximately Rs. 60 (Not verified from an official current source)
- Processing: Approximately 15 working days (Not verified from an official current source)

VERIFICATION STATUS: Not verified from an official current source. Confirm eligibility criteria and current thresholds at https://tnesevai.tn.gov.in.
Official Source URL: https://tnesevai.tn.gov.in | Department: Revenue Dept, TN | Date Checked: October 2026

---

### B8. Legal Heir Certificate (REV-114)

Service Name: Legal Heir Certificate
Service Code: REV-114
Issuing Authority: Revenue Department, Government of Tamil Nadu
Official Portal: https://tnesevai.tn.gov.in
Source: Tamil Nadu e-District Application User Manual (REV-114), Government of Tamil Nadu
Date Checked: October 2026

PURPOSE AND WHO APPLIES:
A Legal Heir Certificate establishes who are the legal heirs of a deceased person. Required for:
- Claiming insurance, pension, gratuity, and provident fund of deceased
- Transferring property or bank accounts held by the deceased
- Receiving dues (salary arrears, etc.) from the employer of the deceased

ELIGIBILITY:
- Spouse, children, or parents of a deceased person
- Application is typically made by one heir on behalf of all legal heirs

REQUIRED DOCUMENTS:
Mandatory:
- Aadhaar Cards of ALL legal heirs
- Death Certificate of the deceased (mandatory — must be from civil registration, not just a hospital report)
- Self-Declaration / Affidavit listing ALL legal heirs with their names, ages, and relationship to the deceased
- Ration Card of the deceased's family

Conditional:
- Marriage certificate (to establish spousal relationship)
- Birth certificates of children (to establish parent-child relationship)
- Any other document proving relationship with the deceased

STEP-BY-STEP PROCEDURE:
Step 1: Visit https://tnesevai.tn.gov.in → Log in with CAN.
Step 2: Services → Revenue Department → REV-114 Legal Heir Certificate.
Step 3: Enter details of the deceased: name, date of birth, date of death, address.
Step 4: Add all legal heirs — for each: name, relationship to deceased, age, Aadhaar number.
Step 5: Upload Death Certificate and supporting relationship documents.
Step 6: Review and submit — note Application Number.

FEE AND PROCESSING TIME:
- Service Charge: Approximately Rs. 60 (Not verified from an official current source)
- Processing: Approximately 15–30 days (Not verified from an official current source)

HOW TO TRACK: https://tnesevai.tn.gov.in → Track Application Status

CORRECTIONS AND GRIEVANCES:
- For corrections or disputes: Approach the Tahsildar's office
- For disputed inheritances: A court-issued Succession Certificate may be required instead

COMMON MISTAKES AND TIPS:
- Ensure ALL heirs are listed — omitting any heir can create legal complications later
- Death Certificate must be from the local civil registration office (municipal/panchayat), NOT just a hospital death report
- If heirs are in dispute, do not use this certificate — get a Succession Certificate from a Civil Court instead

VERIFICATION STATUS: Verified against JanaBridge PDF corpus (CSCOperator_REV-114_LegalHeirCertificate.pdf). Confirm at https://tnesevai.tn.gov.in.
Official Source URL: https://tnesevai.tn.gov.in | Department: Revenue Dept, TN | Date Checked: October 2026

---

### B9. Birth Certificate

Service Name: Birth Certificate Registration and Issuance
Issuing Authority: Urban Local Body (municipal office) or Village Panchayat
Official Portal: Local municipal online portal | https://tnesevai.tn.gov.in (for downloads in some areas)
Department: Local Self Government, Government of Tamil Nadu
Date Checked: October 2026

PURPOSE: Official proof of birth date, birth place, and parentage. Required for school admissions, passport applications, Aadhaar enrolment for children, marriage registration, and age proof in government applications.

REQUIRED DOCUMENTS (for registration within 21 days):
- Hospital birth report / midwife / attending person's birth report
- Parents' Aadhaar Cards

For Late Registration (after 21 days):
- Affidavit from magistrate or notary
- Evidence of birth: hospital records, vaccination card, school enrollment, midwife report
- Parent's identity proof

STEP-BY-STEP PROCEDURE:
For Registration within 21 days:
Step 1: Hospital or midwife submits the birth report to the local body within 21 days.
Step 2: Visit your local municipal office or village panchayat office.
Step 3: Birth is registered and certificate issued.

For Re-issue / Download of existing certificate:
Step 1: Visit https://tnesevai.tn.gov.in or local municipal online portal.
Step 2: Search for Birth Certificate service, enter registration number, download or request reprint.

FEE: Nominal fee; within 21 days typically free (Not verified from an official current source — check with local body)

VERIFICATION STATUS: Not verified from an official current source. Confirm with your local municipal office or at https://tnesevai.tn.gov.in.

---

### B10. Death Certificate

Service Name: Death Certificate
Issuing Authority: Urban Local Body or Village Panchayat
Official Portal: Local municipality | https://tnesevai.tn.gov.in
Date Checked: October 2026

PURPOSE: Official record of death. Required for Legal Heir Certificate, insurance claims, pension discontinuation, property transfer, and bank account settlement.

REQUIRED DOCUMENTS:
- Medical certificate of cause of death (from hospital doctor or attending physician)
- Deceased's Aadhaar Card and Ration Card
- Applicant's (informant's) identity proof

STEP-BY-STEP PROCEDURE:
Step 1: Report the death to the local body within 21 days.
Step 2: Visit the local municipal office or village panchayat.
Step 3: Submit the medical certificate of cause of death.
Step 4: Death is registered and certificate issued.

FEE: Small nominal fee (Not verified from an official current source — check with local body)

VERIFICATION STATUS: Not verified from an official current source. Confirm with your local municipal office.

---

### B11. Ration Card and Family Card Services (PDS-501)

Service Name: Ration Card / Family Card (Tamil Nadu PDS)
Service Code: PDS-501 (for New Ration Card application)
Issuing Authority: Tamil Nadu Civil Supplies Corporation (TNCSC) / Food and Civil Supplies Department
Official Portal: https://www.tnpds.gov.in | Also: https://tnesevai.tn.gov.in
Source: PDS-501 Application for New Ration Card, Government of Tamil Nadu
Date Checked: October 2026

PURPOSE AND WHO APPLIES:
A Ration Card (Smart Family Card) is a primary household document in Tamil Nadu used for:
- Subsidized foodgrains, sugar, and other PDS commodities
- Address proof and household membership proof for virtually all government services
- Multiple welfare scheme eligibility

ELIGIBILITY (New Ration Card):
- Any household in Tamil Nadu not already holding a valid ration card
- Genuine family unit residing together at the same address

REQUIRED DOCUMENTS (New Ration Card — PDS-501):
Mandatory:
- Aadhaar Cards of ALL family members (mandatory for each member)
- Proof of Address of the household (utility bill, rental agreement, property tax receipt)
- Passport-size photographs of all members (including children)

Conditional:
- Marriage certificate (if newly married couple forming a new separate household)
- Surrender certificate from previous state (if migrating from another state with an existing ration card)
- Self-Declaration that no other ration card exists for any member of this household

STEP-BY-STEP PROCEDURE (New Smart Card):
Step 1: Visit https://www.tnpds.gov.in or your nearest Civil Supplies Office.
Step 2: Select "Apply for New Smart Card / Ration Card".
Step 3: Fill family details: names, ages, Aadhaar numbers, address, income category.
Step 4: Upload Aadhaar Card and photograph for each family member.
Step 5: Submit and note the Application Reference Number.
Step 6: A field verification is conducted by the Civil Supplies field officer.
Step 7: On approval, the Smart Ration Card is issued (card or digital copy).

Modifying an Existing Ration Card (adding member, removing deceased, changing FPS shop):
Step 1: Visit https://www.tnpds.gov.in → "Manage Family Card".
Step 2: Log in with your ration card number and registered mobile.
Step 3: Select modification type and submit relevant documents.

OFFICIAL APPLICATION PORTAL: https://www.tnpds.gov.in | Civil Supplies offices | e-Sevai centres

FEE AND PROCESSING TIME:
- Nominal fee for new card (Not verified from an official current source — verify at tnpds.gov.in)
- Processing time varies (Not verified from an official current source)

HOW TO TRACK: https://www.tnpds.gov.in → Application Status → Enter Reference Number

VERIFICATION STATUS: Verified against JanaBridge PDF corpus (PDS-501 Application for New Ration card PDF). Confirm current process at https://www.tnpds.gov.in.
Official Source URL: https://www.tnpds.gov.in | Department: Food and Civil Supplies, TN | Date Checked: October 2026

---

## C. EDUCATION AND WELFARE APPLICATIONS

---

### C1. Scholarship Applications

Service Name: Scholarship Applications (Central and State)
Key Portals:
- National Scholarship Portal (NSP): https://scholarships.gov.in (Central Govt — SC, ST, OBC, Minority, Merit)
- Tamil Nadu state scholarships: https://www.tnscholarship.net.in and department-specific portals
- Tamil Nadu BC/MBC Dept: https://www.bcmbcmw.tn.gov.in
- Tamil Nadu Social Welfare Dept: https://www.tnsocialwelfare.tn.gov.in
Date Checked: October 2026

PURPOSE AND WHO APPLIES:
Financial assistance for students at various education levels (pre-matric, post-matric, graduation, postgraduation) based on community category, income level, and merit.

COMMON REQUIRED DOCUMENTS (verify specific scheme requirements):
- Income Certificate (annual family income below scheme threshold — typically Rs. 1 lakh to Rs. 2.5 lakh)
- Community Certificate (BC/MBC/SC/ST as applicable per scheme)
- Aadhaar Card (mandatory for DBT — Direct Benefit Transfer)
- Bank Passbook (account in student's name, linked to Aadhaar)
- School/College enrollment certificate / bonafide certificate
- Previous year mark sheets / hall ticket number
- Nativity Certificate (for some state schemes)
- First Graduate Certificate (if applying for first-graduate specific scholarships)

STEP-BY-STEP PROCEDURE — National Scholarship Portal (NSP):
Step 1: Visit https://scholarships.gov.in
Step 2: Register using Aadhaar and mobile number.
Step 3: Log in and complete your applicant profile.
Step 4: Browse available schemes and select the applicable scholarship.
Step 5: Fill the scholarship application form for the chosen scheme.
Step 6: Upload all required documents in specified formats.
Step 7: Submit — note your Application ID.
Step 8: Your educational institution verifies and forwards the application.
Step 9: Department approves and amount is disbursed via DBT to your Aadhaar-linked bank account.

IMPORTANT NOTE ON SCHOLARSHIP WINDOWS:
Scholarship applications for most schemes open annually — typically between July and November. The exact opening and closing dates vary by scheme and year. Check https://scholarships.gov.in and https://www.tnscholarship.net.in for current open applications. This guide cannot confirm whether any specific scholarship application window is currently open.

HOW TO TRACK: NSP → Login → Application Status using Application ID

VERIFICATION STATUS: Based on general publicly available information. Verify current schemes and application windows at https://scholarships.gov.in before applying.
Official Source URL: https://scholarships.gov.in | Department: Ministry of Education and others | Date Checked: October 2026

---

### C2. Indira Gandhi National Old Age Pension Scheme (REV-201)

Service Name: Indira Gandhi National Old Age Pension Scheme (IGNOAPS)
Service Code: REV-201
Issuing Authority: Revenue Department, Government of Tamil Nadu / Ministry of Rural Development
Official Portal: https://tnesevai.tn.gov.in
Source: Tamil Nadu e-District Application User Manual (REV-201), Government of Tamil Nadu, Copyright 2019
Department: Revenue Department, Government of Tamil Nadu
Date Checked: October 2026

PURPOSE AND WHO APPLIES:
IGNOAPS provides monthly financial assistance to destitute elderly citizens who have no adequate means of subsistence and no earning family support.

ELIGIBILITY (verify current criteria at tnesevai.tn.gov.in):
- Age: 60 years or above
- Must be Below Poverty Line (BPL) — listed in BPL register
- Must be destitute with no regular income and no able-bodied earning family members who provide support

PENSION AMOUNT: Central component plus state supplement (Not verified from an official current source — amount revised periodically; verify current amount at tnesevai.tn.gov.in or with your Tahsildar)

REQUIRED DOCUMENTS:
- Aadhaar Card (with registered mobile for DBT)
- Ration Card (BPL category preferred)
- Age proof: Birth Certificate, Aadhaar with DOB, Voter ID, or School certificate
- Recent passport-size photograph
- Bank Passbook (Aadhaar-seeded bank account — mandatory for DBT pension transfer)
- Self-Declaration of destitution and absence of earning children
- Income Certificate showing BPL / below poverty status

STEP-BY-STEP PROCEDURE:
Step 1: Visit https://tnesevai.tn.gov.in → Log in with CAN.
Step 2: Click "Services" → "Revenue Department" → "REV-201 Indira Gandhi National Old Age Pension Scheme".
Step 3: Click "Proceed", search for applicant record by CAN, name, or mobile.
Step 4: Select applicant record and click "Proceed".
Step 5: Fill the application:
  - Personal details section (pre-filled from CAN — verify)
  - Age and date of birth
  - Family income details (all earning members)
  - Bank account details (MUST be Aadhaar-linked account for DBT)
Step 6: Upload all required documents.
Step 7: Submit and note Application Number.

OFFICIAL APPLICATION PORTAL: https://tnesevai.tn.gov.in | Authorized CSC / e-Sevai centres

FEE AND PROCESSING TIME:
- Application fee: Free (no fee for welfare pension schemes)
- Processing: Approximately 30 days after field verification (Not verified from an official current source)

HOW TO TRACK: https://tnesevai.tn.gov.in → Track Application Status → Enter Application Number

CORRECTIONS AND GRIEVANCES:
- Bank account issues: Verify Aadhaar-bank seeding at your bank branch
- Grievances: CM Helpline 1100 | Tahsildar's office

VERIFICATION STATUS: Verified against JanaBridge PDF corpus (CSCOperator_REV_201_Indira_Gandhi_National_Old_Age.pdf, Copyright 2019). Current pension amounts should be verified at https://tnesevai.tn.gov.in.
Official Source URL: https://tnesevai.tn.gov.in | Department: Revenue Dept, TN | Date Checked: October 2026

---

### C3. Destitute Widow Pension Scheme (REV-202)

Service Name: Destitute Widow Pension Scheme
Service Code: REV-202
Issuing Authority: Revenue Department, Government of Tamil Nadu
Official Portal: https://tnesevai.tn.gov.in
Source: Tamil Nadu e-District Application User Manual (REV-202), Government of Tamil Nadu
Date Checked: October 2026

PURPOSE AND WHO APPLIES:
Monthly financial assistance to widows who are destitute with no earning male relative providing support.

ELIGIBILITY (verify current criteria):
- Widow (husband deceased — must have official Death Certificate)
- No earning son or son-in-law who is supporting the applicant
- Below poverty line or very low income
- Resident of Tamil Nadu

REQUIRED DOCUMENTS:
- Aadhaar Card
- Husband's Death Certificate (mandatory — from civil registration office)
- Age proof (Aadhaar, Voter ID, Birth Certificate)
- BPL Ration Card or Income Certificate
- Bank Passbook (Aadhaar-linked account for DBT)
- Recent passport-size photograph
- Self-Declaration of destitution

STEP-BY-STEP PROCEDURE:
Step 1: Visit https://tnesevai.tn.gov.in → Log in with CAN.
Step 2: Services → Revenue Department → REV-202 Destitute Widow Pension Scheme.
Step 3: Fill application, upload documents including husband's Death Certificate, submit.

FEE: Free for welfare pensions
PROCESSING: Approximately 30 days (Not verified from an official current source)

VERIFICATION STATUS: Verified against JanaBridge PDF corpus (CSCOperator_REV_202_Destitute_Widow_Pension_Scheme.pdf). Confirm at https://tnesevai.tn.gov.in.
Official Source URL: https://tnesevai.tn.gov.in | Department: Revenue Dept, TN | Date Checked: October 2026

---

### C4. Differently Abled Pension Scheme (REV-206)

Service Name: Differently Abled Pension Scheme
Service Code: REV-206
Issuing Authority: Revenue Department, Government of Tamil Nadu
Official Portal: https://tnesevai.tn.gov.in
Source: Tamil Nadu e-District Application User Manual (REV-206), Government of Tamil Nadu
Date Checked: October 2026

PURPOSE AND WHO APPLIES:
Monthly financial assistance for persons with disabilities who are destitute and below poverty line.

ELIGIBILITY:
- Person with disability of 40% or more as certified by a Government Medical Board
- Must be destitute / below poverty line
- Resident of Tamil Nadu

REQUIRED DOCUMENTS:
- Aadhaar Card
- Disability Certificate issued by a Government Medical Board specifying type and percentage of disability (mandatory)
- Age proof
- BPL Ration Card or Income Certificate
- Bank Passbook (Aadhaar-linked)
- Recent passport-size photograph

STEP-BY-STEP PROCEDURE:
Step 1: Obtain Disability Certificate from the designated Medical Board at a Government Hospital (this must be done FIRST before applying).
Step 2: Visit https://tnesevai.tn.gov.in → Log in with CAN.
Step 3: Services → Revenue Department → REV-206 Differently Abled Pension Scheme.
Step 4: Fill application with disability type, percentage, and Medical Board certificate details.
Step 5: Upload Disability Certificate and all other documents.
Step 6: Submit and note Application Number.

FEE: Free for welfare pensions
PROCESSING: Approximately 30 days (Not verified from an official current source)

VERIFICATION STATUS: Verified against JanaBridge PDF corpus (CSCOperator_REV_206_Differently_Abled_Pension_Scheme.pdf). Confirm at https://tnesevai.tn.gov.in.
Official Source URL: https://tnesevai.tn.gov.in | Department: Revenue Dept, TN | Date Checked: October 2026

---

### C5. Kalaignar Magalir Urimai Thogai Scheme

Service Name: Kalaignar Magalir Urimai Thogai (KMUT)
Issuing Authority: Social Welfare Department, Government of Tamil Nadu
Official Portal: https://kmut.tn.gov.in (designated scheme portal — verify availability)
Also: https://tnesevai.tn.gov.in
Source: kalaignar_scheme.pdf in JanaBridge corpus; Social Welfare Department, Government of Tamil Nadu
Date Checked: October 2026

PURPOSE AND WHO APPLIES:
This scheme provides Rs. 1,000 per month as direct cash assistance (via DBT — Direct Benefit Transfer) to eligible women who are the heads of their families. It aims to recognize and compensate women's unpaid domestic labour and provide financial empowerment.

ELIGIBILITY (verify current thresholds at kmut.tn.gov.in):
- Women (or transgender persons) aged 21 years and above
- Must be the HEAD OF FAMILY as listed on the Ration Card
- Annual family income should be less than Rs. 2,50,000 (Rs. 2.5 lakh) per year
- Must be a resident of Tamil Nadu with a valid Tamil Nadu ration card
- Must have a personal bank account in her own name (for DBT)

REQUIRED DOCUMENTS:
- Aadhaar Card (with registered mobile number for OTP-based DBT)
- Ration Card showing applicant as the family head (her name as head)
- Bank Passbook (the account MUST be in the applicant's own name AND Aadhaar-seeded)
- Income Certificate showing annual family income below Rs. 2.5 lakh

STEP-BY-STEP PROCEDURE — HOW TO REGISTER (IMPORTANT WARNING BELOW):

CRITICAL IMPORTANT NOTE: The Kalaignar Magalir Urimai Thogai scheme registration is conducted through SPECIAL CAMPS organized periodically by the Tamil Nadu Government. It is NOT typically available year-round on the regular e-Sevai portal. New applicants must WAIT FOR THE NEXT GOVERNMENT-ORGANIZED REGISTRATION CAMP to be announced.

CURRENT APPLICATION WINDOW STATUS: UNKNOWN. Are new applications currently open for this scheme? This cannot be confirmed from available information. Monitor official Tamil Nadu Government communications (newspapers, TN government website, local panchayat office notices) for announcements of new registration camps.

When a Registration Camp is Announced:
Step 1: Watch for official government announcements about camp dates and locations in your area.
Step 2: Visit the designated camp location on the announced date with ALL ORIGINAL documents.
Step 3: Camp officials will verify your eligibility on the spot (Aadhaar, ration card, income, age).
Step 4: Biometric verification (Aadhaar fingerprint authentication) is done at the camp.
Step 5: On successful enrollment, Rs. 1,000 per month is credited monthly via DBT to your registered bank account.
Step 6: You will receive an enrollment confirmation — keep this record.

HOW TO CHECK APPLICATION / PAYMENT STATUS (for EXISTING beneficiaries only):
- Visit https://kmut.tn.gov.in (if portal is accessible)
- Enter your Aadhaar number or Ration Card number to check your beneficiary status
- DO NOT CONFUSE STATUS CHECKING WITH NEW APPLICATION REGISTRATION
- The status checking portal is ONLY for existing enrolled beneficiaries to check payment status

CORRECTIONS AND GRIEVANCES:
- If your DBT payment fails: Check with your bank that your account is Aadhaar-seeded (linked)
- For eligibility disputes or grievances: Approach your Block Development Office or Social Welfare Department
- For missed payments: Contact the designated scheme helpline or Social Welfare district office

COMMON MISTAKES AND TIPS:
- Ensure the bank account is Aadhaar-seeded BEFORE attending the registration camp — DBT will fail otherwise
- Check that your name in the bank account, Aadhaar, and Ration Card all match EXACTLY
- Do NOT pay any agent or mediator to enroll you — registration is FREE
- Do not check the status portal expecting to register — status checking is only for existing beneficiaries

VERIFICATION STATUS: Partially verified against JanaBridge corpus (kalaignar_scheme.pdf). Current eligibility thresholds and application window status are NOT verified from an official current source. Check https://kmut.tn.gov.in or contact your local Social Welfare office for up-to-date information.
Official Source URL: https://kmut.tn.gov.in | Department: Social Welfare, TN | Date Checked: October 2026

---

### C6. Marriage Assistance Scheme

Service Name: Chief Minister's Marriage Assistance Scheme
Issuing Authority: Social Welfare Department, Government of Tamil Nadu
Official Portal: https://tnesevai.tn.gov.in
Source: MarriageAssistance_Operators.pdf in JanaBridge corpus
Date Checked: October 2026

PURPOSE: Financial assistance to poor families for the marriage of daughters.

ELIGIBILITY (verify current criteria):
- Bride must be at least 18 years old at the time of marriage
- Bridegroom must be at least 21 years old
- Annual family income below specified limit (Not verified from an official current source)
- Resident of Tamil Nadu

REQUIRED DOCUMENTS:
- Aadhaar Cards of bride, groom, and parents
- Income Certificate
- Community Certificate
- Age proof (birth certificate / SSLC)
- Marriage invitation or marriage registration proof
- Bank Passbook in bride's name (Aadhaar-linked for DBT)

STEP-BY-STEP PROCEDURE:
Apply via https://tnesevai.tn.gov.in → Social Welfare Department → Marriage Assistance Scheme
Or visit your local Social Welfare Department office with original documents.

VERIFICATION STATUS: Partially verified against JanaBridge corpus (MarriageAssistance_Operators.pdf). Full details, eligibility, and assistance amount should be confirmed at https://tnesevai.tn.gov.in.
Official Source URL: https://tnesevai.tn.gov.in | Department: Social Welfare, TN | Date Checked: October 2026

---

### C7. Handloom Worker Scholarship (DHT-201)

Service Name: Handloom Worker Scholarship
Service Code: DHT-201
Issuing Authority: Handloom and Textiles Department, Government of Tamil Nadu
Official Portal: https://tnesevai.tn.gov.in
Source: DHT201AppScholarshipHandloomoperator.pdf in JanaBridge corpus
Date Checked: October 2026

PURPOSE: Financial scholarship for children of registered handloom workers for their education.

ELIGIBILITY:
- Student enrolled in school or college
- Parent must be a registered handloom worker in Tamil Nadu
- Income criteria as specified by the Handloom and Textiles Department (Not verified from an official current source)

REQUIRED DOCUMENTS:
- Aadhaar Card (student and parent)
- Parent's Handloom Worker Registration Certificate
- Income Certificate
- School / college enrollment proof
- Bank Passbook (student's or parent's Aadhaar-linked account)

STEP-BY-STEP PROCEDURE:
Visit https://tnesevai.tn.gov.in → Handloom and Textiles Department → DHT-201 Scholarship.

VERIFICATION STATUS: Partially verified against JanaBridge corpus (DHT201AppScholarshipHandloomoperator.pdf). Confirm details at https://tnesevai.tn.gov.in.
Official Source URL: https://tnesevai.tn.gov.in | Department: Handloom and Textiles, TN | Date Checked: October 2026

---

### C8. NFSA Scholarship (ADF-201)

Service Name: NFSA Scholarship (Adi Dravidar / Tribal)
Service Code: ADF-201
Issuing Authority: Adi Dravidar and Tribal Welfare Department, Government of Tamil Nadu
Official Portal: https://tnesevai.tn.gov.in
Source: ADF201NFSRSchemeOperator.pdf in JanaBridge corpus
Date Checked: October 2026

PURPOSE: Financial support and scholarship for students from Adi Dravidar (SC) and Tribal (ST) communities.

ELIGIBILITY:
- Students belonging to Scheduled Caste / Scheduled Tribe communities
- Enrolled in recognized educational institutions
- Income criteria as applicable (Not verified from an official current source)

REQUIRED DOCUMENTS:
- Aadhaar Card
- Community Certificate (SC/ST)
- Income Certificate
- Educational enrollment proof
- Bank Passbook (Aadhaar-linked)

STEP-BY-STEP PROCEDURE:
Visit https://tnesevai.tn.gov.in → Adi Dravidar and Tribal Welfare Department → ADF-201 Scholarship.

VERIFICATION STATUS: Partially verified against JanaBridge corpus (ADF201NFSRSchemeOperator.pdf). Confirm at https://tnesevai.tn.gov.in.
Official Source URL: https://tnesevai.tn.gov.in | Department: Adi Dravidar and Tribal Welfare, TN | Date Checked: October 2026

---

## D. GENERAL APPLICATION HELP

---

### D1. Finding the Correct Official Portal

Always use websites with these trusted Indian government domain extensions:
- .gov.in — Indian central or state government
- .nic.in — National Informatics Centre (government IT portals)
- .tn.gov.in — Tamil Nadu state government specifically

QUICK REFERENCE — OFFICIAL PORTALS:

Service | Official Portal
--------|---------------
Aadhaar | https://uidai.gov.in
Aadhaar Self-Service | https://myaadhaar.uidai.gov.in
PAN Card | https://www.incometax.gov.in
Voter ID | https://voters.eci.gov.in
Passport | https://www.passportindia.gov.in
Driving Licence | https://sarathi.parivahan.gov.in
TN Revenue Certificates | https://tnesevai.tn.gov.in
TN Ration Card | https://www.tnpds.gov.in
Kalaignar Magalir Urimai | https://kmut.tn.gov.in
National Scholarships | https://scholarships.gov.in

SAFETY WARNING: Do NOT use unofficial "helper" websites or agents that charge fees for government services. Most services are free or have a small official fee. If asked for large unexplained fees, verify on the official portal before paying.

---

### D2. Preparing a Document Checklist

UNIVERSAL DOCUMENTS (required for almost every government application):
[ ] Aadhaar Card — original + 1 self-attested photocopy
[ ] Ration Card — original + 1 photocopy
[ ] Passport-size photographs — bring at least 3 (white/light background, face clearly visible)
[ ] Mobile phone — with your Aadhaar-registered SIM for OTP verification

DOCUMENT PREPARATION TIPS:
1. Check that your Aadhaar-registered mobile number is currently active — OTPs are sent to it.
2. Make photocopies of ALL documents before going to the service centre.
3. Self-attest each photocopy: sign and write "True Copy" with your name and date.
4. Scan documents clearly — minimum 200 DPI resolution, maximum 5 MB per file for most portals.
5. For photographs: white or light plain background, no cap, no sunglasses, face clearly visible, taken recently.
6. Carry both originals and self-attested photocopies in a folder or clear file.
7. Keep digital copies (photos taken on phone) of all documents as backup.

---

### D3. Applying Online: Step-by-Step General Process

Step 1 — Prepare: Gather all required documents, ensure your mobile is active, have Aadhaar ready.
Step 2 — Register: Create an account on the portal (e.g., CAN on tnesevai.tn.gov.in, account on passportindia.gov.in).
Step 3 — Navigate to Service: Find the correct service or form on the portal.
Step 4 — Fill the Form: Fill all fields carefully; double-check name spellings and ID numbers.
Step 5 — Upload Documents: Upload scanned files in the specified format (JPG or PDF) within the size limit (usually 100KB–5MB per file).
Step 6 — Review: Preview the complete form before submitting — check all fields.
Step 7 — Submit: Click "Submit" — the system generates an Application / Acknowledgement Number.
Step 8 — Save: IMMEDIATELY note and save the Application Number — take a screenshot or write it down.

---

### D4. Applying Through Authorized Service Centres

Who should use service centres:
- Citizens without internet access or smartphones
- Citizens who find online forms difficult to navigate
- Citizens who require physical document attestation at the centre

Authorized Service Centre Types:
- e-Sevai Centres (Tamil Nadu): Government-authorized centres across Tamil Nadu; operators apply on your behalf
- CSC (Common Service Centres): Available nationally for central government services
- Passport Seva Kendra (PSK): Mandatory physical visit for passport collection and biometrics
- District Collector / Tahsildar office: For grievances and complex certificate corrections

How to find your nearest e-Sevai centre in Tamil Nadu:
Step 1: Visit https://tnesevai.tn.gov.in
Step 2: Click "Locate e-Sevai Centre"
Step 3: Enter your district and taluk

Tips for Centre Visits:
- Bring originals + 2 photocopies of each document
- Arrive early — popular services like Community Certificate have long queues
- Ask the operator for an acknowledgement receipt — it contains your Application Number
- You have the right to know the official service charge — do not pay unofficial extra fees
- You can also track and monitor the same application online using the Application Number

---

### D5. Saving Your Application / Acknowledgement Number

The Application Number / Acknowledgement Number is your ONLY link to your submitted application. Without it, you cannot:
- Track the status of your application
- Follow up with the department if there are delays
- Re-access returned applications for correction

HOW TO SAVE YOUR APPLICATION NUMBER:
Method 1: Write it in a dedicated notebook or diary immediately after receiving it.
Method 2: Take a screenshot of the confirmation page on your phone.
Method 3: Print the acknowledgement receipt from the portal and keep it safe.
Method 4: Most portals send an SMS to your registered mobile — save that SMS thread.

If you lose your Application Number: Return to the portal, log in with your CAN / account, and check "My Applications" or "Application History" — most portals list all your past applications.

---

### D6. How to Check Application Status

For Tamil Nadu e-Sevai services (Revenue Certificates, Welfare Pensions):
Step 1: Visit https://tnesevai.tn.gov.in
Step 2: Click "Track Application Status" on the home page.
Step 3: Enter your Application Number.
Step 4: Status shown: Pending / Under Verification by VAO / Under Verification by RI / Approved / Certificate Ready / Returned / Rejected.

For Central Government services:
- Aadhaar: https://myaadhaar.uidai.gov.in/checkStatus (enter EID from acknowledgement slip)
- PAN: https://www.onlineservices.nsdl.com → Track PAN (enter 15-digit acknowledgement number)
- Passport: https://www.passportindia.gov.in → Track Application (enter 13-digit file number)
- Voter ID: https://voters.eci.gov.in → Track Application (enter Reference ID)
- Driving Licence: https://sarathi.parivahan.gov.in → Application Status (enter Application Number)
- Ration Card (TN): https://www.tnpds.gov.in → Application Status

TIP: Status updates may take 24–48 hours after any action — check again the next business day if there is no update yet.

---

### D7. Responding to Returned or Rejected Applications

WHAT "RETURNED" MEANS:
Your application was reviewed but sent back for correction. This is NOT a final rejection. The verifying officer (VAO or RI for TN certificates) has found a problem with your uploaded documents or form data.

HOW TO RESPOND TO A RETURNED APPLICATION:
Step 1: Log in to the portal using your CAN number.
Step 2: Find your application in "My Applications" or search by Application Number.
Step 3: Read the "Return Remarks" or "Return Reason" carefully — this tells you exactly what needs to be corrected.
Step 4: Common return reasons and fixes:
  - "Document is blurry / unclear" → Re-scan the document at higher resolution and re-upload
  - "Document does not match application data" → Correct the form field to match the document exactly (or upload the correct document)
  - "Wrong document uploaded" → Upload the correct document in the correct slot
  - "Self-declaration missing" → Write and sign a self-declaration affidavit and upload
  - "Photograph rejected" → Retake photo with white background and upload a clearer one
Step 5: Make corrections and click "Resubmit" — you do NOT need to start a fresh application.

WHAT "REJECTED" MEANS:
Your application was reviewed and the application is denied based on eligibility or documentation. This is more serious than Returned.

HOW TO RESPOND TO A REJECTION:
Step 1: Read the rejection reason carefully.
Step 2: If you believe the rejection is incorrect or unfair, you can APPEAL:
  - For TN Revenue Certificates: Visit the Tahsildar's office with your Application Number and supporting documents.
  - For Passport: Contact the regional Passport Office → Grievance Cell.
  - For Voter ID: Contact the Electoral Registration Officer (ERO).
Step 3: If you have stronger supporting documents, gather them and consider reapplying with the new evidence.

IF YOUR CERTIFICATE HAS AN ERROR AFTER BEING ISSUED:
- For TN Revenue Certificates: Visit the Tahsildar's office with the issued certificate and proof of the correct information.
- For Aadhaar: Use the UIDAI online correction service at myaadhaar.uidai.gov.in.
- For Passport: Apply for re-issue with supporting documents.
- For PAN: Use the "Changes or Correction" form on NSDL/UTIITSL.

---

### D8. Official Help and Grievance Channels

Service | Helpline | Contact / Portal
--------|----------|----------------
Tamil Nadu e-Sevai (all TN services) | 1100 (CM Helpline, TN) | tnesevai.tn.gov.in → Grievance
Aadhaar / UIDAI | 1947 (toll-free, 24x7) | help@uidai.gov.in
PAN / Income Tax | 1800-180-1961 (toll-free) | tininfo@nsdl.co.in | incometax.gov.in
Voter ID / ECI | 1950 (toll-free) | voters.eci.gov.in
Passport | 1800-258-1800 (toll-free) | passportindia.gov.in → Grievance Cell
Driving Licence | State RTO helpline | sarathi.parivahan.gov.in
Ration Card (TNPDS) | 1967 / 044-28592828 | tnpds.gov.in
Kalaignar Magalir Urimai | Social Welfare Dept, TN | kmut.tn.gov.in

ADDITIONAL GRIEVANCE CHANNELS:
- CM Cell (Tamil Nadu): cmcell.tn.gov.in — for any TN government service complaint
- CPGRAMS: pgportal.gov.in — Central Government public grievance portal (for central services)
- Right to Information (RTI): File an RTI online at rtionline.gov.in to get information on the status of your application or the reasons for rejection. RTI is a powerful tool to seek accountability.

---

## SOURCE DIRECTORY

No. | Source Title | Department | URL | Status
----|-------------|-----------|-----|-------
1 | UIDAI — Aadhaar Portal | UIDAI, MeitY | https://uidai.gov.in | Portal confirmed live; specific content not individually verified
2 | Income Tax Dept — PAN | CBDT, Min. Finance | https://www.incometax.gov.in | Portal confirmed live
3 | NSDL/Protean — PAN Services | NSDL | https://www.onlineservices.nsdl.com | Not individually verified
4 | ECI — Voter Services Portal | ECI | https://voters.eci.gov.in | Portal confirmed live
5 | Passport Seva — MEA | Min. External Affairs | https://www.passportindia.gov.in | Portal confirmed live
6 | Parivahan / Sarathi — DL | MoRTH | https://sarathi.parivahan.gov.in | Portal confirmed live
7 | TN e-Sevai Services Portal | Tamil Nadu Govt | https://tnesevai.tn.gov.in | Portal confirmed live
8 | Community Certificate REV-101 Manual | Revenue Dept, TN | JanaBridge PDF corpus | Verified from corpus (2016 manual)
9 | Nativity Certificate REV-102 Manual | Revenue Dept, TN | JanaBridge PDF corpus | Verified from corpus
10 | Income Certificate REV-103 Manual | Revenue Dept, TN | JanaBridge PDF corpus | Verified from corpus (2017 manual)
11 | Legal Heir Certificate REV-114 Manual | Revenue Dept, TN | JanaBridge PDF corpus | Verified from corpus
12 | IGNOAPS REV-201 Manual | Revenue Dept, TN | JanaBridge PDF corpus | Verified from corpus (2019 manual)
13 | Destitute Widow Pension REV-202 | Revenue Dept, TN | JanaBridge PDF corpus | Verified from corpus
14 | Differently Abled Pension REV-206 | Revenue Dept, TN | JanaBridge PDF corpus | Verified from corpus
15 | Kalaignar Magalir Urimai Thogai | Social Welfare, TN | JanaBridge PDF corpus | Partially verified from corpus
16 | Marriage Assistance Scheme | Social Welfare, TN | JanaBridge PDF corpus | Partially verified from corpus
17 | Handloom Scholarship DHT-201 | Handloom and Textiles, TN | JanaBridge PDF corpus | Partially verified from corpus
18 | NFSA Scholarship ADF-201 | Adi Dravidar and Tribal, TN | JanaBridge PDF corpus | Partially verified from corpus
19 | TNPDS — Ration Card Services | Food and Civil Supplies, TN | https://www.tnpds.gov.in | Partially verified from corpus

---

End of Guide
JanaBridge Government Document Application Guide | Version 1.0 | October 2026
This guide is a reference tool only. Always verify current requirements on the official government portal before applying. Requirements, fees, and availability can change without notice.
"""

def write_markdown():
    GUIDE_MD.parent.mkdir(parents=True, exist_ok=True)
    GUIDE_MD.write_text(CONTENT, encoding="utf-8")
    print(f"[OK] Markdown saved: {GUIDE_MD}")
    print(f"     Size: {GUIDE_MD.stat().st_size:,} bytes")

def write_pdf():
    try:
        import pymupdf
    except ImportError:
        print("[ERROR] pymupdf not installed. Run: pip install pymupdf")
        sys.exit(1)

    GUIDE_PDF.parent.mkdir(parents=True, exist_ok=True)

    doc = pymupdf.open()
    
    # -----------------------------------------------
    # Styles
    # -----------------------------------------------
    MARGIN = 50
    PAGE_W = 595
    PAGE_H = 842
    TEXT_W = PAGE_W - 2 * MARGIN

    FONT_TITLE     = "helv"   # Helvetica bold
    FONT_BODY      = "helv"
    FONT_MONO      = "cour"

    SZ_COVER_H1    = 22
    SZ_COVER_H2    = 14
    SZ_SECTION     = 14
    SZ_SUBSECTION  = 12
    SZ_BODY        = 9
    SZ_SMALL       = 8

    COL_NAVY       = (0.05, 0.15, 0.40)
    COL_TEAL       = (0.00, 0.50, 0.55)
    COL_ORANGE     = (0.85, 0.35, 0.05)
    COL_DARK       = (0.10, 0.10, 0.10)
    COL_MID        = (0.30, 0.30, 0.30)
    COL_LIGHT      = (0.90, 0.93, 0.97)
    COL_WHITE      = (1.00, 1.00, 1.00)

    # -----------------------------------------------
    # Helper: add new page
    # -----------------------------------------------
    def new_page():
        p = doc.new_page(width=PAGE_W, height=PAGE_H)
        return p, MARGIN, PAGE_H - MARGIN

    def add_footer(page, page_num):
        r = pymupdf.Rect(MARGIN, PAGE_H - 30, PAGE_W - MARGIN, PAGE_H - 15)
        page.draw_rect(r, color=None, fill=COL_LIGHT)
        page.insert_text(
            (MARGIN + 4, PAGE_H - 18),
            "JanaBridge Government Document Application Guide | Version 1.0 | October 2026",
            fontname=FONT_BODY, fontsize=6.5, color=COL_MID
        )
        pn = str(page_num)
        page.insert_text(
            (PAGE_W - MARGIN - 20, PAGE_H - 18),
            pn, fontname=FONT_BODY, fontsize=6.5, color=COL_MID
        )

    # -----------------------------------------------
    # Cover page
    # -----------------------------------------------
    page = doc.new_page(width=PAGE_W, height=PAGE_H)
    # Background
    page.draw_rect(pymupdf.Rect(0, 0, PAGE_W, PAGE_H), color=None, fill=COL_NAVY)
    # Accent band
    page.draw_rect(pymupdf.Rect(0, 300, PAGE_W, 360), color=None, fill=COL_TEAL)
    # Title
    page.insert_text((MARGIN, 200), "JanaBridge", fontname="hebo", fontsize=36, color=COL_WHITE)
    page.insert_text((MARGIN, 240), "Government Document", fontname="hebo", fontsize=26, color=COL_WHITE)
    page.insert_text((MARGIN, 275), "Application Guide", fontname="hebo", fontsize=26, color=COL_ORANGE)
    # Subtitle on band
    page.insert_text((MARGIN, 335), "Comprehensive citizen guide for Indian & Tamil Nadu government services",
                     fontname=FONT_BODY, fontsize=11, color=COL_WHITE)
    # Meta
    page.insert_text((MARGIN, 420), "Version 1.0  |  October 2026", fontname=FONT_BODY, fontsize=11, color=COL_WHITE)
    page.insert_text((MARGIN, 445), "Prepared by: JanaBridge Knowledge Team", fontname=FONT_BODY, fontsize=10, color=COL_WHITE)
    page.insert_text((MARGIN, 470), "Scope: Common Indian government documents and Tamil Nadu citizen services",
                     fontname=FONT_BODY, fontsize=10, color=COL_WHITE)
    # Disclaimer box
    disc_r = pymupdf.Rect(MARGIN, 560, PAGE_W - MARGIN, 720)
    page.draw_rect(disc_r, color=COL_ORANGE, fill=(0.98, 0.94, 0.88), width=1.5)
    page.insert_text((MARGIN + 8, 578), "DISCLAIMER", fontname="hebo", fontsize=10, color=COL_ORANGE)
    disc_text = (
        "Requirements, fees, processing times, and application availability can change\n"
        "at any time without notice. Always verify the current procedure on the relevant\n"
        "official government portal before applying. This guide is for informational\n"
        "purposes only. It does not constitute legal advice. JanaBridge is not affiliated\n"
        "with any government department."
    )
    page.insert_textbox(
        pymupdf.Rect(MARGIN + 8, 592, PAGE_W - MARGIN - 8, 718),
        disc_text, fontname=FONT_BODY, fontsize=9, color=COL_DARK
    )

    # -----------------------------------------------
    # Split content into lines and render
    # -----------------------------------------------
    lines = CONTENT.strip().split("\n")

    page, x, bottom = new_page()
    y = MARGIN + 10
    page_num = 2

    def flush_page():
        nonlocal page, y, page_num
        add_footer(page, page_num)
        page, _, _ = new_page()
        y = MARGIN + 10
        page_num += 1

    def need_space(needed):
        nonlocal y
        if y + needed > bottom - 35:
            flush_page()

    for raw_line in lines:
        line = raw_line.rstrip()

        # Section headings (## A. / ## B. / etc.)
        if line.startswith("## "):
            need_space(30)
            text = line[3:].strip()
            header_r = pymupdf.Rect(MARGIN - 5, y - 3, PAGE_W - MARGIN + 5, y + 18)
            page.draw_rect(header_r, color=None, fill=COL_NAVY)
            page.insert_text((MARGIN + 2, y + 12), text,
                             fontname="hebo", fontsize=SZ_SECTION, color=COL_WHITE)
            y += 26
            continue

        # Service sub-headings (### A1. / ### B1. etc.)
        if line.startswith("### "):
            need_space(22)
            text = line[4:].strip()
            page.draw_rect(pymupdf.Rect(MARGIN - 5, y - 2, PAGE_W - MARGIN + 5, y + 15),
                          color=None, fill=COL_LIGHT)
            page.insert_text((MARGIN + 2, y + 11), text,
                             fontname="hebo", fontsize=SZ_SUBSECTION, color=COL_NAVY)
            y += 20
            continue

        # Skip the main # title line (rendered on cover)
        if line.startswith("# "):
            continue

        # Horizontal rules
        if line.strip() == "---":
            need_space(10)
            page.draw_line((MARGIN, y + 4), (PAGE_W - MARGIN, y + 4), color=COL_TEAL, width=0.5)
            y += 10
            continue

        # Blank lines
        if not line.strip():
            y += 5
            continue

        # ALL-CAPS label lines (field headers within a service)
        stripped = line.strip()
        if stripped.isupper() and len(stripped) > 4:
            need_space(14)
            page.insert_text((MARGIN, y + 9), stripped,
                             fontname="hebo", fontsize=SZ_BODY, color=COL_TEAL)
            y += 13
            continue

        # Determine indent / bullet / step
        indent = len(line) - len(line.lstrip())
        x_pos = MARGIN + min(indent * 4, 32)
        available = PAGE_W - MARGIN - x_pos - 10

        fontname = FONT_BODY
        fontsize = SZ_BODY
        color = COL_DARK

        # Key: value lines  
        if ":" in stripped and not stripped.startswith("-") and not stripped.startswith("["):
            parts = stripped.split(":", 1)
            key = parts[0].strip()
            val = parts[1].strip() if len(parts) > 1 else ""
            # Key bold in teal, value normal
            kw = len(key + ": ") * fontsize * 0.55
            need_space(12)
            page.insert_text((x_pos, y + 9), key + ": ", fontname="hebo", fontsize=fontsize, color=COL_TEAL)
            # wrap value
            if val:
                val_rect = pymupdf.Rect(x_pos + kw, y, PAGE_W - MARGIN - 5, y + 12)
                if val_rect.width > 20:
                    page.insert_textbox(val_rect, val, fontname=FONT_BODY, fontsize=fontsize, color=COL_DARK)
            y += 13
            # If value was long, add extra lines
            estimated_lines = max(1, len(val) // max(int(available / 5.5), 1))
            if estimated_lines > 1:
                y += (estimated_lines - 1) * 11
            continue

        # Bullet list items
        if stripped.startswith("- ") or stripped.startswith("* "):
            bullet_text = stripped[2:]
            need_space(12)
            page.insert_text((x_pos, y + 9), chr(0x2022) + "  ", fontname=FONT_BODY, fontsize=fontsize, color=COL_TEAL)
            rect = pymupdf.Rect(x_pos + 14, y, PAGE_W - MARGIN - 5, y + 100)
            page.insert_textbox(rect, bullet_text, fontname=FONT_BODY, fontsize=fontsize, color=COL_DARK)
            lines_needed = max(1, len(bullet_text) // max(int((PAGE_W - MARGIN - x_pos - 19) / 5.5), 1))
            y += lines_needed * 11 + 2
            continue

        # Checklist items [ ]
        if stripped.startswith("[ ]"):
            need_space(12)
            check_text = stripped[4:]
            page.draw_rect(pymupdf.Rect(x_pos, y + 1, x_pos + 9, y + 10), color=COL_TEAL, width=0.7)
            rect = pymupdf.Rect(x_pos + 13, y, PAGE_W - MARGIN - 5, y + 100)
            page.insert_textbox(rect, check_text, fontname=FONT_BODY, fontsize=fontsize, color=COL_DARK)
            lines_n = max(1, len(check_text) // max(int((PAGE_W - MARGIN - x_pos - 18) / 5.5), 1))
            y += lines_n * 11 + 2
            continue

        # Numbered steps: "Step N:" / "N."
        if stripped.startswith("Step ") and ":" in stripped[:15]:
            need_space(12)
            colon_idx = stripped.index(":")
            step_label = stripped[:colon_idx+1]
            step_body  = stripped[colon_idx+1:].strip()
            lbl_w = len(step_label + " ") * fontsize * 0.55
            page.insert_text((x_pos, y + 9), step_label + " ", fontname="hebo", fontsize=fontsize, color=COL_ORANGE)
            rect = pymupdf.Rect(x_pos + lbl_w, y, PAGE_W - MARGIN - 5, y + 100)
            page.insert_textbox(rect, step_body, fontname=FONT_BODY, fontsize=fontsize, color=COL_DARK)
            lines_n = max(1, len(step_body) // max(int((PAGE_W - MARGIN - x_pos - lbl_w - 5) / 5.5), 1))
            y += lines_n * 11 + 3
            continue

        # Regular paragraph / body text
        need_space(12)
        rect = pymupdf.Rect(x_pos, y, PAGE_W - MARGIN - 5, y + 200)
        n_chars = PAGE_W - MARGIN - x_pos - 10
        chars_per_line = max(int(n_chars / 5.5), 40)
        lines_n = max(1, len(stripped) // chars_per_line + 1)
        need_space(lines_n * 11)
        rect = pymupdf.Rect(x_pos, y, PAGE_W - MARGIN - 5, y + lines_n * 12 + 10)
        page.insert_textbox(rect, stripped, fontname=fontname, fontsize=fontsize, color=color)
        y += lines_n * 11 + 2

    add_footer(page, page_num)

    doc.save(str(GUIDE_PDF))
    print(f"[OK] PDF saved:      {GUIDE_PDF}")
    print(f"     Pages:          {doc.page_count}")
    print(f"     Size:           {GUIDE_PDF.stat().st_size:,} bytes")

if __name__ == "__main__":
    print("=== JanaBridge Guide Creator ===")
    write_markdown()
    write_pdf()
    print("\nDone. Both files created.")
