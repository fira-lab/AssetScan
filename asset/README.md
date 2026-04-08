# AssetGate Scan AI

**Barcode-Enabled Laptop Verification & Ownership Lookup System with AI-Assisted Facial Recognition**

An academic prototype developed at Arba Minch Institute of Technology (AMIT), Arba Minch University.

---

## 📋 Abstract

Laptop theft and unauthorized removal remain significant challenges in university environments. Traditional manual verification at exit gates is time-consuming, inconsistent, and prone to human error and impersonation.

**AssetGate Scan AI** is a smart, secure academic prototype that combines **barcode/QR code scanning** with **AI-powered facial image comparison** to assist gatekeepers in verifying laptop ownership at university exit points.

The system registers laptops and their owners, generates unique barcodes/QR codes when needed, and performs dual verification (laptop + owner identity) at the gate. It supports rather than replaces human decision-making by providing clear ownership information and an AI similarity score.

---

## ✨ Features

- **Laptop & Owner Registration**: Store student name, ID, facial image, and laptop details
- **Barcode/QR Code Generation**: Automatic generation and printing for laptops without scannable codes
- **Exit Gate Verification**:
  - Scan laptop barcode/QR code
  - Capture live facial image of the carrier
  - AI-based facial similarity comparison
- **Decision Support**: Displays owner information and similarity result to assist gatekeepers
- **Centralized Database**: Secure storage of student and asset records
- **Web-based Interface**: Accessible via desktop or mobile devices

---

## 🎯 Objectives

### General Objective
To develop a smart and secure system for verifying laptop ownership and managing assets at Arba Minch University using barcode scanning and AI-based facial recognition.

### Specific Objectives
- Register students and their laptops with essential information
- Generate and attach QR/barcodes to laptops
- Implement dual verification (barcode + facial recognition)
- Provide clear verification results to support gatekeeper decisions
- Maintain accurate records for asset management and security reporting

---

## 🏗️ System Architecture

The system consists of:
- **Frontend & Backend**: Built with Next.js (React + API Routes)
- **Database**: MongoDB
- **AI Component**: External AI image comparison service API
- **Scanning & Capture**: Smartphone camera or webcam for barcode scanning and facial image capture

---

## 🛠️ Technologies Used

- **Framework**: Next.js
- **Database**: MongoDB
- **AI Service**: External Facial Image Comparison API
- **Development Tools**: Visual Studio Code, Git
- **Optional**: MERN stack components

---

## 📍 Scope & Limitations

**In Scope:**
- Laptop and owner registration
- Barcode/QR code generation
- AI-assisted facial verification at exit gate
- Decision support for gatekeepers

**Out of Scope (Academic Prototype):**
- Full campus-wide deployment
- Automated physical gate control
- Advanced real-time surveillance
- Integration with national ID systems

---

## 🎓 Project Details

- **Institution**: Arba Minch Institute of Technology (AMIT), Arba Minch University
- **Department**: Computer Science and IT
- **Advisor**: Mr. Behailu Mitiku
- **Team Members**:
  1.Firaol Terefe 
  2. Eden Solomon
  3. Behailu Bekele 
  4. Bizuayehu Yohannes
  5. Ruot Gatkuoth

---

## 🚀 Getting Started

### Prerequisites
- Node.js
- MongoDB
- API key for facial image comparison service (if using external AI)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/assetgate-scan-ai.git

# Navigate to project directory
cd asset

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run the development server
npm run dev
