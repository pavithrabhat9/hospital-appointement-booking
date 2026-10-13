export interface HospitalConfig {
  name: string;
  shortName: string;
  tagline: string;
  location: string;
  address: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  voiceStudioName: string;
  enterpriseSlug: string;
  defaultAgentId: string;
  phoneLineUuid: string;
  webhookEndpoint: string;
  adminUser: {
    name: string;
    role: string;
    email: string;
    avatarUrl: string;
  };
}

export const hospitalConfig: HospitalConfig = {
  name: "CityCare Multispeciality Hospital",
  shortName: "CityCare Hospital",
  tagline: "Precision Healthcare with Human Touch",
  location: "Mangaluru, Karnataka",
  address: "KSR Road, Hampankatta, Mangaluru, Karnataka 575001",
  phone: "+91 824 222 5555",
  emergencyPhone: "+91 824 222 5500",
  email: "admin@citycaremangalore.com",
  voiceStudioName: "Voice Studio",
  enterpriseSlug: "TRIKONDEMO",
  defaultAgentId: "4275b22c-1adf-4bcd-ae3c-32228d8b6e29",
  phoneLineUuid: "line_blr_8031321629",
  webhookEndpoint: "https://api.citycare.health/v1/webhooks/trikon",
  adminUser: {
    name: "Dr. Admin",
    role: "Administrator",
    email: "admin@citycare.health",
    avatarUrl: "",
  },
};

