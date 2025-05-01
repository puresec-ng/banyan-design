
export interface Business {
    id: string;
    name: string;
    tradingName: string;
    description: string;
    email: string;
    phoneNumber: string;
    industry: string;
    productType: string;
    businessType: string;
    registrationNumber: string;
    website: string;
    countryOfIncorporation: string;
    registeredState: string;
    registeredCity: string;
    registeredBusinessAddress: string;
    regulatoryAgency: string;
    regulatoryStatus: string;
    operatingState: string;
    operatingCity: string;
    operatingBusinessAddress: string;
    webhookUrl: string | null;
    sourceOfFunds: string;
    numberOfVendors: number;
    sendFrom: string;
    sendTo: string;
    kycStatus: "PENDING" | "APPROVED" | "REJECTED"; // Add other possible statuses if needed
    knitCoreUserId: string;
    createdAt: string;
    updatedAt: string;
}
