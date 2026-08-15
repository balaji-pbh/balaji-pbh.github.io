/* =========================================================
   FREE SHOP DATA FILE
   ---------------------------------------------------------
   EDIT CATEGORIES HERE. Admin category manager also updates
   this section automatically when you publish/update.
   ========================================================= */

const SHOP = {
  name: "BALAJI GARMENTS",
  ownerWhatsApp: "919532328020",
  bannerImage: "banner.jpg",
  headerLogo: "logo.jpg",
  websiteUrl: "https://balaji-pbh.github.io/"
};

const CATEGORIES = [
  {
    id: "fashion",
    name: "Fashion",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80",
    seo: {
      title: "Fashion Collection | YOUR SHOP",
      description: "Explore the latest fashion collection at YOUR SHOP.",
      keywords: "fashion, clothes, shopping, YOUR SHOP",
      slug: "fashion"
    }
  },
  {
    id: "shoes",
    name: "Shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    seo: {
      title: "Shoes Collection | YOUR SHOP",
      description: "Explore shoes and footwear at YOUR SHOP.",
      keywords: "shoes, footwear, shopping, YOUR SHOP",
      slug: "shoes"
    }
  }
];

const PRODUCTS = [
  {
    id: "PRD-DEMO01",
    name: "Premium Demo Product",
    category: "fashion",
    price: 499,
    oldPrice: 999,
    discount: 50,
    rating: 4.6,
    ratingCount: 18,
    images: [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85"
    ],
    description: "Demo product description. Replace this product from Admin.",
    details: {
      "Material": "Premium quality",
      "Color": "Assorted",
      "Availability": "Contact owner"
    },
    seo: {
      title: "Premium Demo Product | YOUR SHOP",
      description: "Premium demo product available at YOUR SHOP.",
      keywords: "demo product, YOUR SHOP",
      slug: "prd-demo01-premium-demo-product"
    }
  }
];
