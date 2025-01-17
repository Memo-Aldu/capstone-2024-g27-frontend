# capstone-2024-frontend.

## Overview
The RelayCom Messaging Service Frontend is a modern web application built with TypeScript, React, and Material UI. It interfaces with the Messaging Service backend, providing an UI for managing messages, conversations, and contacts. It serves as a key component for client and their customers.

## Features
- **User-Friendly Messaging Interface**:
  - Send and schedule messages (SMS/MMS).
  - View and manage conversations in real-time.
- **Contact Management**:
  - Add, update, and delete contacts.
  - Search and filter contact lists.
- **Responsive Design**:
  - Optimized for desktop and mobile use.
- **Provider Agnostic Support**:
  - Integrated with backend for Twilio and other provider flexibility.
- **Scalability and Reliability**:
  - Modular React components for scalable development.

---

## Architecture
The application is structured with a modular design:
1. **Components**:
   - Reusable UI elements (buttons, modals, forms).
2. **Pages**:
   - High-level views for messaging, contacts, and settings.
3. **Services**:
   - API integration for seamless communication with the backend.
4. **State Management**:
   - Centralized state using **React Query** for efficient data fetching and caching.

Each layer is designed to ensure maintainability and extensibility.

---

## Requirements
- **npm or Yarn**: For dependency management.
- **Backend API**: Running instance of the Messaging Service backend.
- **Environment Variables**: API base URL and other configurations.

---

## Installation

1. **Clone the Repository**:
   ```bash
   git@github.com:Memo-Aldu/capstone-2024-g27-frontend.git
   cd capstone-2024-g27-frontend
   ```

2. **Set Up Environment Variables**:
   - Copy the example file:
     ```bash
     cp .env.example .env
     ```
   - Update `.env` with:
     - API base URL
     - Additional environment-specific configurations

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```

---

## Testing

### Unit and Integration Tests
Run all tests:
```bash
npm test
```
- **Coverage**:
  -  Test coverage for components and API integrations.

---

## Usage

### Application Structure
- **Messaging Dashboard**:
  - View ongoing conversations.
  - Send and schedule messages.
- **Contact Management**:
  - Add, edit, delete, and search contacts.

### Authentication
- OAuth2 Bearer Token authentication.
- Tokens are managed and stored securely in the frontend.

---

## Configuration

### Backend Integration
- Configure the backend API URL in the `.env` file:
  ```
  REACT_APP_CONTACT_MGMT_URL=https://some-name-id.eastus2.azurecontainerapps.io/api/v1/contacts
  REACT_APP_CONVERSATION_MGMT_URL=https://some-name-id.eastus2.azurecontainerapps.io/api/v1/conversation
  REACT_APP_SMS_MGMT_URL=https:///some-name-id.eastus2.azurecontainerapps.io/api/v1/messages
  REACT_APP_CONTACTLIST_MGMT_URL=https:///some-name-id.eastus2.azurecontainerapps.io/api/v1/contact_lists
  ```

### Environment Variables
- Define other variables in `.env`.
  ```
  REACT_APP_TWILIO_NUMBER=+18732400000
  
  REACT_APP_AZURE_AD_CLIENT_ID=3b3b3b3b-3b3b-3b3b-3b3b-3b3b3b3b3b3b
  REACT_APP_TENANT_ID=3b3b3b3b-3b3b-3b3b-3b3b-3b3b3b3b3b3b
  REACT_APP_BACKEND_API_ID=3b3b3b3b-3b3b-3b3b-3b3b-3b3b3b3b3b3b
  REACT_APP_REDIRECT_URI=http://localhost:3000/app/auth/callback
  ```

---

## Deployment

1. **Build the Application**:
   ```bash
   npm run build
   ```

2. **Serve the Build**:
   Deploy the contents of the `build` directory to any static hosting service (e.g., AWS S3, Vercel, Netlify).

---

## Contact
For questions or support, please contact **Memo Aldujaili** at [maldu064@uottawa.ca](mailto:maldu064@uottawa.ca).
