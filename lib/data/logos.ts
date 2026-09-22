/**
 * Real vendor logos shipped in /public. Products without an entry fall back to the
 * initial-letter tile in <SoftwareLogo>. In the backend phase this becomes `software.logo_url`
 * (Supabase storage bucket `logos`).
 */
const SAGE = "/logos/sage-100.png";
const MICROSOFT = "/logos/dynamics-365-business-central.png";

export const PRODUCT_LOGOS: Record<string, string> = {
  asana: "/logos/asana.png",
  hubspot: "/logos/hubspot.png",
  "monday-com": "/logos/monday-com.png",
  odoo: "/logos/odoo.png",
  pipedrive: "/logos/pipedrive.png",
  salesforce: "/logos/salesforce.png",
  "sap-business-one": "/logos/sap-business-one.png",
  "zoho-crm": "/logos/zoho-crm.png",
  "dynamics-365-business-central": MICROSOFT,
  "dynamics-365-sales": MICROSOFT,
  "sage-active": SAGE,
  "sage-50-connected": SAGE,
  "sage-hr-payroll": SAGE,
  "sage-hr-suite": SAGE,
  "sage-100": SAGE,
  "sage-50-handwerk": SAGE,
  "sage-b7": SAGE,
  "sage-sales-management": SAGE,
  "paychex-deutschland": "/integrations/paychex.svg",
};

/** Integration name (as stored in `software.integrations`) → icon in /public/integrations. */
export const INTEGRATION_ICONS: Record<string, string> = {
  Shopify: "/integrations/shopify.svg",
  Slack: "/integrations/slack.svg",
  "Microsoft Teams": "/integrations/microsoft-teams.svg",
  "Microsoft 365": "/integrations/microsoft-365.svg",
  "Microsoft Office": "/integrations/microsoft-365.svg",
  Excel: "/integrations/microsoft.com.png",
  SharePoint: "/integrations/microsoft.com.png",
  "Power BI": "/integrations/microsoft.com.png",
  "Microsoft Dynamics": "/integrations/microsoft.com.png",
  OneDrive: "/integrations/microsoft.com.png",
  Outlook: "/integrations/outlook.com.png",
  Gmail: "/integrations/gmail.com.png",
  "Google Workspace": "/integrations/google.com.png",
  "Google Calendar": "/integrations/google.com.png",
  "Google Drive": "/integrations/google.com.png",
  PayPal: "/integrations/paypal.svg",
  Stripe: "/integrations/stripe.svg",
  Zapier: "/integrations/zapier.svg",
  WooCommerce: "/integrations/woocommerce.svg",
  Amazon: "/integrations/amazon.svg",
  eBay: "/integrations/ebay.svg",
  Salesforce: "/integrations/salesforce.png",
  HubSpot: "/integrations/hubspot.com.png",
  DocuSign: "/integrations/docusign.png",
  SAP: "/integrations/sap.com.png",
  "SAP Analytics Cloud": "/integrations/sap.com.png",
  Zoom: "/integrations/zoom.us.png",
  WordPress: "/integrations/wordpress.org.png",
  GitHub: "/integrations/github.com.png",
  Jira: "/logos/jira.png",
  Mailchimp: "/integrations/mailchimp.svg",
  Dropbox: "/integrations/dropbox.com.png",
  "Zoho Books": "/integrations/zoho-books.svg",
  Square: "/integrations/square.svg",
  "Sage HR Suite": "/integrations/sage.com.png",
  "Sage Active": "/integrations/sage.com.png",
  "Sage Lohnabrechnung": "/integrations/sage.com.png",
  Odoo: "/logos/odoo.png",
  Asana: "/logos/asana.png",
  "monday.com": "/logos/monday-com.png",
  Pipedrive: "/logos/pipedrive.png",
};
