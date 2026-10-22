// Single source of truth for business contact details.
export const CONTACT = {
  name: 'P-KOT Spices',
  addressLines: ['P-KOT Spices', 'Parly Post, Edakkara', 'Keralam 679331'],
  email: 'pkotspices@gmail.com',
  phoneDisplay: '+91 81130 08200',
  phoneTel: '+918113008200',
  mapQuery: 'P KOT SPICES, P-KOT spices, Parly Post, Edakkara, Keralam 679331',
  mapLink: 'https://maps.app.goo.gl/hRMSsEJZyrJafrHD6',
  whatsappNumber: '918113008200', // digits only, for wa.me links
};

export const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(CONTACT.mapQuery)}&z=15&output=embed`;

export const whatsappUrl = (text) =>
  `https://wa.me/${CONTACT.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
