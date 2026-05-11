export const products = [
  // 🌿 Main Spices
  {
    id: 'black-pepper',
    name: 'Black Pepper',
    category: 'Main Spices',
    priceINR: '750',
    priceUSD: '9.99',
    unit: 'kg',
    description: 'Premium Malabar black pepper, known for its bold flavor and intense pungency. Hand-harvested and sun-dried to perfection.',
    image: '/products/black-pepper-packed.png',
    gallery: [
      '/products/black-pepper-packed.png',
      '/products/black-pepper.png',
      '/products/black-pepper-1.png',
      '/sequence/frame_0000.jpg'
    ],
    details: 'Grade: Tellicherry Bold. Moisture: Max 12%. Purity: 99%. Origin: Malabar Coast.',
  },
  {
    id: 'cardamom',
    name: 'Cardamom',
    category: 'Main Spices',
    priceINR: '2400',
    priceUSD: '29.99',
    unit: 'kg',
    description: 'Exquisite green cardamom pods with a sweet, eucalyptus-like aroma. Sourced from the high-altitude plantations of Idukki.',
    image: '/products/cardamom-packed.png',
    gallery: [
      '/products/cardamom-packed.png',
      '/products/cardamom.png',
      '/products/cardamom-1.png',
      '/sequence/frame_0005.jpg'
    ],
    details: 'Grade: 8mm Bold. Color: Deep Green. Moisture: Max 10%. Purity: 99.9%.',
  },
  {
    id: 'cinnamon',
    name: 'Cinnamon',
    category: 'Main Spices',
    priceINR: '1200',
    priceUSD: '14.99',
    unit: 'kg',
    description: 'Authentic Ceylon cinnamon sticks with a delicate, sweet flavor and woody aroma. Perfect for both sweet and savory dishes.',
    image: '/products/cinnamon-packed.png',
    gallery: [
      '/products/cinnamon-packed.png',
      '/products/cinnamon.png',
      '/sequence/frame_0000.jpg',
      '/sequence/frame_0001.jpg'
    ],
    details: 'Type: Ceylon (True Cinnamon). Grade: Alba. Texture: Delicate quills.',
  },
  {
    id: 'cloves',
    name: 'Cloves',
    category: 'Main Spices',
    priceINR: '1100',
    priceUSD: '12.99',
    unit: 'kg',
    description: 'Highly aromatic whole cloves, rich in essential oils. These hand-picked flower buds add deep, warm flavor to your culinary creations.',
    image: '/products/cloves-packed.png',
    gallery: [
      '/products/cloves.png',
      '/sequence/frame_0003.jpg',
      '/sequence/frame_0004.jpg'
    ],
    details: 'Grade: Hand-picked. Color: Dark Brown. Aroma: Intense and Spicy.',
  },
  {
    id: 'nutmeg',
    name: 'Nutmeg',
    category: 'Main Spices',
    priceINR: '950',
    priceUSD: '11.99',
    unit: 'kg',
    description: 'Premium whole nutmeg kernels with a warm, nutty, and slightly sweet flavor. Ideal for grating fresh into your favorite recipes.',
    image: '/products/nutmeg-packed.png',
    gallery: [
      '/products/nutmeg.png',
      '/sequence/frame_0006.jpg',
      '/sequence/frame_0007.jpg'
    ],
    details: 'Size: Grade A. Type: Whole with shell. Origin: Kerala.',
  },
  {
    id: 'mace',
    name: 'Mace',
    category: 'Main Spices',
    priceINR: '2800',
    priceUSD: '34.99',
    unit: 'kg',
    description: 'The delicate, lacy outer covering of the nutmeg seed. Mace offers a more refined, floral version of nutmeg flavor.',
    image: '/products/mace-packed.png',
    gallery: [
      '/products/mace.png',
      '/sequence/frame_0009.jpg'
    ],
    details: 'Type: Whole Flower (Javitri). Color: Natural Red/Orange. Sorting: Hand-sorted.',
  },

  // 🌶️ Other Common Spices
  {
    id: 'turmeric',
    name: 'Turmeric',
    category: 'Other Common Spices',
    priceINR: '350',
    priceUSD: '4.99',
    unit: 'kg',
    description: 'Vibrant golden turmeric with high curcumin content. Known for its earthy flavor and powerful health-promoting properties.',
    image: '/products/turmeric-packed.png',
    gallery: [
      '/products/turmeric.png',
      '/products/turmeric-1.png',
      '/sequence/frame_0001.jpg'
    ],
    details: 'Curcumin Content: 5%+. Type: Whole/Powder. Purity: 100% Natural.',
  },
  {
    id: 'ginger',
    name: 'Ginger',
    category: 'Other Common Spices',
    priceINR: '450',
    priceUSD: '5.99',
    unit: 'kg',
    description: 'Sun-dried premium ginger rhizomes with a sharp, spicy, and slightly sweet bite. A staple for both cooking and wellness.',
    image: '/products/ginger-packed.png',
    gallery: [
      '/products/ginger.png',
      '/plantation-01.jpg',
      '/harvest-01.jpg',
      '/process.jpeg',
      '/packaging-01.jpg',
      '/spices-spread.jpg'
    ],
    details: 'Type: Unbleached. Moisture: Max 12%. Quality: Grade A.',
  },
  {
    id: 'garlic',
    name: 'Garlic',
    category: 'Other Common Spices',
    priceINR: '250',
    priceUSD: '3.49',
    unit: 'kg',
    description: 'High-quality garlic bulbs known for their pungent aroma and intense flavor. Essential for building deep flavor profiles.',
    image: '/products/garlic-packed.png',
    gallery: [
      '/products/garlic.png',
      '/plantation-01.jpg',
      '/harvest-01.jpg',
      '/process.jpeg',
      '/packaging-01.jpg',
      '/spices-spread.jpg'
    ],
    details: 'Variety: Bold White. Type: Dried Bulbs/Flakes.',
  },
  {
    id: 'mustard-seeds',
    name: 'Mustard Seeds',
    category: 'Other Common Spices',
    priceINR: '180',
    priceUSD: '2.49',
    unit: 'kg',
    description: 'Tiny, powerful black mustard seeds that add a nutty, sharp flavor when toasted or tempered in oil.',
    image: '/products/mustard-seeds-packed.png',
    gallery: [
      'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=1000',
      '/products/mustard-seeds.png',
      'https://images.unsplash.com/photo-1593358052162-42171120025f?q=80&w=1000'
    ],
    details: 'Variety: Black Mustard. Purity: 99%. Cleaning: Machine Cleaned.',
  },
  {
    id: 'cumin',
    name: 'Cumin',
    category: 'Other Common Spices',
    priceINR: '550',
    priceUSD: '6.99',
    unit: 'kg',
    description: 'Aromatic cumin seeds with a warm, earthy flavor. An essential ingredient in spice blends across global cuisines.',
    image: '/products/cumin-packed.png',
    gallery: [
      '/products/cumin.png',
      '/sequence/packet_00.jpg',
      '/sequence/frame_0001.jpg'
    ],
    details: 'Purity: 99.5%. Type: Whole Seeds. Aroma: Strong Earthy.',
  },
  {
    id: 'fenugreek',
    name: 'Fenugreek',
    category: 'Other Common Spices',
    priceINR: '220',
    priceUSD: '2.99',
    unit: 'kg',
    description: 'Small, angular fenugreek seeds with a unique bitter-sweet flavor, widely used in spice blends and traditional medicine.',
    image: '/products/fenugreek-packed.png',
    gallery: [
      '/products/fenugreek.png',
      '/sequence/frame_0000.jpg',
      '/sequence/frame_0001.jpg'
    ],
    details: 'Grade: Machine Cleaned. Color: Yellowish-Brown.',
  },
  {
    id: 'coriander-seeds',
    name: 'Coriander Seeds',
    category: 'Other Common Spices',
    priceINR: '280',
    priceUSD: '3.49',
    unit: 'kg',
    description: 'Whole coriander seeds with a citrusy, floral, and slightly nutty aroma. Perfect for toasting and grinding fresh.',
    image: '/products/coriander-seeds-packed.png',
    gallery: [
      '/products/coriander-seeds.png',
      '/sequence/frame_0000.jpg',
      '/sequence/frame_0001.jpg'
    ],
    details: 'Variety: Eagle Grade. Color: Natural Greenish-Brown.',
  },

  // 🌱 Other Ingredients Commonly Used
  {
    id: 'star-anise',
    name: 'Star Anise',
    category: 'Other Ingredients',
    priceINR: '1150',
    priceUSD: '13.99',
    unit: 'kg',
    description: 'Beautiful star-shaped pods with a distinct licorice flavor. Adds a sophisticated depth to broths, stews, and spice mixes.',
    image: '/products/star-anise-packed.png',
    gallery: [
      '/products/star-anise.png',
      '/sequence/frame_0005.jpg'
    ],
    details: 'Grade: Hand-picked whole. Broken: Less than 5%.',
  },
  {
    id: 'asafoetida',
    name: 'Asafoetida',
    category: 'Other Ingredients',
    priceINR: '3500',
    priceUSD: '44.99',
    unit: 'kg',
    description: 'Pure asafoetida (Hing) with an intense, savory aroma. A key ingredient for enhancing the umami profile of vegetarian dishes.',
    image: '/products/asafoetida-packed.png',
    gallery: [
      '/products/asafoetida.png',
      '/sequence/frame_0000.jpg',
      '/sequence/frame_0001.jpg'
    ],
    details: 'Type: Pure Compounded. Form: Solid/Powder.',
  },
  {
    id: 'curry-leaves',
    name: 'Curry Leaves',
    category: 'Other Ingredients',
    priceINR: '150',
    priceUSD: '1.99',
    unit: 'kg',
    description: 'Freshly harvested curry leaves with a unique, nutty, and herbal aroma. Indispensable for authentic tempering.',
    image: '/products/curry-leaves-packed.png',
    gallery: [
      '/products/curry-leaves.png',
      '/sequence/frame_0000.jpg',
      '/sequence/frame_0001.jpg'
    ],
    details: 'Type: Fresh/Dried. Origin: Organic Plantations.',
  },
  {
    id: 'tamarind',
    name: 'Tamarind',
    category: 'Other Ingredients',
    priceINR: '200',
    priceUSD: '2.49',
    unit: 'kg',
    description: 'Tangy and sweet tamarind pulp, perfect for adding a natural sourness to curries, chutneys, and sauces.',
    image: '/products/tamarind-packed.png',
    gallery: [
      '/products/tamarind.png',
      '/sequence/frame_0000.jpg',
      '/sequence/frame_0001.jpg'
    ],
    details: 'Type: Seedless/With Seeds. Moisture: 15-20%.',
  }
];
