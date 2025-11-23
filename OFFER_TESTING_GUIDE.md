# Offer Screen Testing Guide

This guide explains how to test the offer screen functionality for claims.

## Prerequisites

1. **Development Server Running**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **User Authentication**
   - You need to be logged in to the portal
   - Navigate to `/portal` and login with valid credentials

## Testing Scenarios

### 1. Accessing the Offer Screen

#### Method 1: From Dashboard
1. Navigate to `/portal/dashboard`
2. Look for claims that have offers
3. Expand a claim that has an offer
4. You should see a "Settlement Offer" section with:
   - Offer amount in Naira (₦)
   - Offer status (Pending, Accepted, Rejected, or Expired)
   - A "View Offer" button
5. Click "View Offer" button
6. You should be redirected to `/portal/offer?claimId={claimId}`

#### Method 2: From Track Claim
1. Navigate to `/portal/track-claim`
2. Enter a claim ID that has an offer (e.g., `SME-2025-00010`)
3. Click "Search"
4. Scroll down to find the "Settlement Offer" section
5. Click "View Offer" button

#### Method 3: Direct URL
1. Navigate directly to: `/portal/offer?claimId={claimId}`
   - Replace `{claimId}` with an actual claim ID that has an offer
   - Example: `/portal/offer?claimId=SME-2025-00010`

### 2. Viewing Offer Details

When you access the offer screen, you should see:

#### Header Section
- ✅ "Settlement Offer" title
- ✅ Claim number/ID displayed
- ✅ Back button to return to claim details

#### Status Banner
- **Pending Response** (Blue) - Offer is available for response
- **Offer Accepted** (Green) - You've already accepted
- **Offer Rejected** (Red) - You've already rejected
- **Offer Expired** (Gray) - Offer has expired

#### Offer Amount Section
- ✅ Large display of settlement amount in Naira (₦)
- ✅ Assessed claim value (if available)
- ✅ Expiry date (if not expired)

#### Payment Breakdown Section
- ✅ Assessed Claim Value
- ✅ Deductions (shown in red with minus sign)
- ✅ Service Fee percentage and amount
- ✅ Final Settlement Amount (highlighted)

#### Payment Information Section
- ✅ Payment Method (e.g., "Card")
- ✅ Payment Timeline (e.g., "3 days")

#### Terms & Conditions Section
- ✅ Offer terms displayed (if available)

#### Special Conditions Section
- ✅ Special conditions highlighted in yellow (if available)

#### Offer Information Section
- ✅ Offer ID
- ✅ Claim Number
- ✅ Claim Type
- ✅ Created date
- ✅ Valid until date

### 3. Testing Accept Offer

**Prerequisites:**
- Offer status must be "settlement_approved" or "pending"
- Offer must not be expired
- Offer must not already be accepted/rejected

**Steps:**
1. Navigate to an offer screen with a pending offer
2. Scroll to the "Your Response" section at the bottom
3. Click the green "Accept Offer" button
4. You should see:
   - Button shows "Accepting..." with spinner
   - Success toast notification: "Offer accepted successfully!"
   - Automatic redirect to track claim page after 1.5 seconds
5. Navigate back to the offer screen
6. Status should now show "Offer Accepted" (green banner)
7. Accept/Reject buttons should no longer be visible

**Expected API Call:**
```
POST /api/v1/claims/settlements/{offerId}/accept
```

### 4. Testing Reject Offer

**Prerequisites:**
- Same as Accept Offer

**Steps:**
1. Navigate to an offer screen with a pending offer
2. Scroll to the "Your Response" section
3. Click the white "Reject Offer" button
4. You should see:
   - Button shows "Rejecting..." with spinner
   - Info toast notification: "Offer rejected"
   - Automatic redirect to track claim page after 1.5 seconds
5. Navigate back to the offer screen
6. Status should now show "Offer Rejected" (red banner)
7. Accept/Reject buttons should no longer be visible

**Expected API Call:**
```
POST /api/v1/claims/settlements/{offerId}/reject
```

### 5. Testing Expired Offer

**Steps:**
1. Navigate to an offer screen where `expired: true` or expiry date has passed
2. You should see:
   - Status banner shows "Offer Expired" (gray)
   - No Accept/Reject buttons
   - Yellow warning message: "This offer has expired and is no longer available for acceptance."

### 6. Testing Already Responded Offer

**Steps:**
1. Navigate to an offer you've already accepted or rejected
2. You should see:
   - Status banner shows "Offer Accepted" or "Offer Rejected"
   - No Accept/Reject buttons
   - Yellow info message showing your response status
   - Any acceptance/rejection notes if available

### 7. Testing Error Scenarios

#### No Offer Available
1. Navigate to `/portal/offer?claimId={claimIdWithoutOffer}`
2. You should see:
   - "No Offer Available" message
   - "Go Back" button
   - Helpful error message

#### API Error
1. Disconnect from internet or use invalid claim ID
2. You should see:
   - Error toast notification
   - Appropriate error message
   - Option to retry or go back

### 8. Testing Currency Formatting

Verify that all amounts display with Naira symbol (₦):
- ✅ Settlement amount: `₦77,000` (not `$77,000` or `NGN 77,000`)
- ✅ Assessed value: `₦100,000`
- ✅ Deductions: `-₦10,000`
- ✅ Service fee: `-₦13,000`
- ✅ All amounts should have proper thousand separators (commas)

### 9. Testing Responsive Design

Test on different screen sizes:
- ✅ Mobile (< 640px)
- ✅ Tablet (640px - 1024px)
- ✅ Desktop (> 1024px)

Verify:
- Layout adapts properly
- Buttons stack vertically on mobile
- Text remains readable
- All sections are accessible

## API Endpoints Used

### Get Offer
```
GET /api/v1/claims/{claimId}/settlement
# OR
GET /api/v1/claims/settlements?claim_id={claimId}
```

### Accept Offer
```
POST /api/v1/claims/settlements/{offerId}/accept
```

### Reject Offer
```
POST /api/v1/claims/settlements/{offerId}/reject
```

## Sample Test Data

You can use these claim IDs for testing (if they exist in your system):
- `SME-2025-00010` (from the sample API response)
- Any claim ID that has a settlement offer

## Browser DevTools Testing

1. **Network Tab**
   - Monitor API calls when loading offer
   - Check request/response payloads
   - Verify error handling

2. **Console Tab**
   - Check for any JavaScript errors
   - Verify React Query cache updates

3. **Application Tab**
   - Check React Query cache after mutations
   - Verify query invalidation works

## Common Issues & Solutions

### Issue: "No offer found for this claim"
**Solution:** Ensure the claim ID has an associated settlement offer in the database.

### Issue: Buttons not showing
**Solution:** Check:
- Offer status is "settlement_approved" or "pending"
- `offer_acceptance_status` is `null`
- `expired` is `false`

### Issue: Currency shows as dollars
**Solution:** Ensure `formatCurrency` function uses `₦` symbol, not `$`.

### Issue: API 404 Error
**Solution:** 
- Verify the endpoint URL is correct
- Check if user has permission to view offers
- Verify claim ID format is correct

## Automated Testing (Future)

Consider adding:
- Unit tests for `formatCurrency` function
- Integration tests for offer acceptance/rejection
- E2E tests for complete offer flow

## Notes

- The offer screen automatically refreshes after accept/reject
- Query cache is invalidated to ensure fresh data
- Navigation happens automatically after successful response
- All amounts are formatted in Naira (₦) with proper thousand separators

