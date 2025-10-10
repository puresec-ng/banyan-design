# Additional Information Request System

This document describes the implementation of the Additional Information Request system that allows users to respond to document requests and additional information requests from the claims API.

## Overview

The system provides a comprehensive UI for handling two types of requests:
1. **Document Requests** - Users can upload required documents
2. **Additional Information Requests** - Users can fill out forms with required information

## API Integration

### Endpoint
```
GET /api/v1/claims/additional-information-requests/{claimId}?request_type={requestType}
```

Where:
- `claimId`: The claim identifier (e.g., "LIF-2025-00009")
- `requestType`: Either `document_request` or `additional_information`

### Example Usage
```bash
curl --location -g 'https://api.banyanclaims.com/api/v1/claims/additional-information-requests/LIF-2025-00009?request_type=document_request' \
--header 'Accept: application/json'
```

## Components

### 1. API Service (`src/app/services/claims.tsx`)

Contains all API-related functions and TypeScript interfaces:

- `getAdditionalInfoRequest()` - Fetches request details
- `submitAdditionalInfoResponse()` - Submits user responses
- `uploadDocumentForRequest()` - Handles document uploads

### 2. UI Component (`src/app/components/AdditionalInfoRequest.tsx`)

Main component that handles:
- Fetching and displaying request details
- Rendering form fields based on request type
- Document upload functionality
- Form validation and submission
- Error handling and loading states

### 3. Page Component (`src/app/portal/request-response/page.tsx`)

Standalone page that:
- Accepts claimId and requestType as URL parameters
- Wraps the main component with navigation
- Handles completion callbacks

### 4. Integration (`src/app/portal/track-claim/page.tsx`)

Updated track-claim page with:
- Action buttons for both request types
- Direct navigation to request response page
- Enhanced question display with response buttons

## Features

### Form Fields Support
The system supports various form field types:
- Text inputs
- Textareas
- Select dropdowns
- Checkboxes
- Radio buttons
- Date pickers
- Number inputs
- Email inputs
- Phone inputs

### Document Upload
- Drag-and-drop interface
- File type validation
- File size limits
- Progress indicators
- Upload status tracking

### Validation
- Required field validation
- File format validation
- File size validation
- Form completion checking

### UI/UX Features
- Loading states
- Error handling
- Success notifications
- Responsive design
- Accessibility support
- Clean, modern interface

## Usage

### From Track Claim Page
1. Search for a claim
2. View claim details
3. Click "Document Request" or "Additional Information" button
4. Complete the required form
5. Submit response

### Direct URL Access
```
/portal/request-response?claimId=LIF-2025-00009&requestType=document_request
```

### Test Interface
Visit `/test-ui` to test the component with different claim IDs and request types.

## Data Flow

1. **Fetch Request**: Component fetches request details from API
2. **Render Form**: Based on request type, renders appropriate form fields
3. **User Input**: User fills form and/or uploads documents
4. **Validation**: Client-side validation ensures all required fields are completed
5. **Submission**: Form data is submitted to API
6. **Completion**: User is redirected back to claim details

## Error Handling

The system includes comprehensive error handling:
- Network errors
- API errors
- Validation errors
- File upload errors
- Authentication errors

All errors are displayed to users with helpful messages and appropriate actions.

## Styling

The component uses Tailwind CSS classes and follows the existing design system:
- Consistent color scheme
- Responsive grid layouts
- Modern card-based design
- Proper spacing and typography
- Interactive hover states

## Future Enhancements

Potential improvements could include:
- Real-time form validation
- Auto-save functionality
- Bulk document upload
- Progress tracking
- Email notifications
- Mobile app integration

## Testing

To test the functionality:
1. Use the test interface at `/test-ui`
2. Try different claim IDs and request types
3. Test form validation
4. Test document upload
5. Test error scenarios

## Dependencies

The implementation uses:
- React Query for data fetching
- Axios for HTTP requests
- Heroicons for icons
- Tailwind CSS for styling
- TypeScript for type safety

