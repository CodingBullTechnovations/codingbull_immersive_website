import type { FooterContent } from '@/types/content';

export const footerContent: FooterContent = {
  columns: [
    {
      title: 'Services',
      links: [
        { label: 'Healthcare Software', href: '/services/healthcare-software-development' },
        { label: 'E-commerce Development', href: '/services/ecommerce-development' },
        { label: 'HRMS & Payroll', href: '/services/custom-hrms-payroll-software' },
        { label: 'Custom Business Systems', href: '/services/custom-business-systems' },
        // Specialised pages — previously had zero global inbound links.
        { label: 'Custom CRM Development', href: '/services/custom-crm-development' },
        { label: 'Clinic Management Software', href: '/services/clinic-management-software-development' },
        { label: 'Hospital Management Software', href: '/services/hospital-management-software-development' },
        { label: 'Inventory & Order Management', href: '/services/inventory-order-management-software' },
        { label: 'Attendance & Payroll Software', href: '/services/attendance-payroll-management-software' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About CodingBull', href: '/about' },
        { label: 'Case Studies', href: '/case-studies' },
        { label: 'Products', href: '/products' },
        { label: 'Blog', href: '/insights' },
        { label: 'Contact / Get Quote', href: '/contact' },
      ],
    },
    {
      title: 'Locations',
      links: [
        { label: 'Software Company in Ahmedabad', href: '/ahmedabad' },
        { label: 'Software Development Company in Ahmedabad', href: '/software-development-company-ahmedabad' },
        { label: 'Web Development Company in Ahmedabad', href: '/web-development-company-ahmedabad' },
        { label: 'Software Development in India', href: '/india' },
        { label: 'Custom Software for USA', href: '/usa' },
        { label: 'Custom Software for UAE', href: '/uae' },
        { label: 'Custom Software for Canada', href: '/canada' },
      ],
    },
  ],
  legalLinks: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Engagement', href: '/terms' },
  ],
  companyInfo: `© ${new Date().getFullYear()} CodingBull Technovations Pvt. Ltd. | GSTIN: 24AAMCC7617E1ZP. All rights reserved.`,
};
