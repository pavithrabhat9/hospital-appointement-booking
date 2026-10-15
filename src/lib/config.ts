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
  trikonVoiceWidget?: {
    src: string;
    publicKey: string;
    agentId: string;
    position: string;
  };
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
  voiceStudioName: "CareDesk",
  enterpriseSlug: "TRIKONDEMO",
  defaultAgentId: "19a28b2c-4fff-45fe-9298-1e25a2f12a9e",
  phoneLineUuid: "line_blr_8031321629",
  webhookEndpoint: "https://api.citycare.health/v1/webhooks/trikon",
  trikonVoiceWidget: {
    src: "https://voice.trikon.tech/embed.js",
    publicKey: "tvk_pk_u57lzhwA7LUKPf5pvnlUeS22he1c86mv",
    agentId: "19a28b2c-4fff-45fe-9298-1e25a2f12a9e",
    position: "right",
  },
  adminUser: {
    name: "Dr. Admin",
    role: "Administrator",
    email: "admin@citycare.health",
    avatarUrl: "",
  },
};

