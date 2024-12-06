# capstone-2024-frontend.

## Overview
The **Pharmacy Messaging Service Frontend** is a modern, responsive web application built with **TypeScript** and **React**. This frontend interfaces with the Pharmacy Messaging Service backend, providing an intuitive UI for managing messages, conversations, and contacts. It serves as a key component for **DPR Group**, facilitating seamless communication for pharmacies and their customers.

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
- **Node.js 18+**: Required for running the application.
- **npm or Yarn**: For dependency management.
- **Backend API**: Running instance of the Pharmacy Messaging Service backend.
- **Environment Variables**: API base URL and other configurations.

---

## Installation

1. **Clone the Repository**:
   ```bash
   git clone git@github.com:Memo-Aldu/capstone-2024-g27-pharmacy-messaging-frontend.git
   cd capstone-2024-g27-pharmacy-messaging-frontend
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
  - Comprehensive test coverage for components and API integrations.

---

## Usage

### Application Structure
- **Messaging Dashboard**:
  - View ongoing conversations.
  - Send and schedule messages.
- **Contact Management**:
  - Add, edit, delete, and search contacts.
- **Settings**:
  - Configure user preferences and notifications.

### Authentication
- OAuth2 Bearer Token authentication.
- Tokens are managed and stored securely in the frontend.

---

## Configuration

### Backend Integration
- Configure the backend API URL in the `.env` file:
  ```
  REACT_APP_API_BASE_URL=https://api.example.com
  ```

### Environment Variables
- Define other variables like API keys or feature flags in `.env`.

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
