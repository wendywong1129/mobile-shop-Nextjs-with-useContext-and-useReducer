import bcrypt from "bcryptjs";

const data = {
  users: [
    {
      name: "admin",
      email: "admin@gmail.com",
      password: bcrypt.hashSync("123456"),
      isAdmin: true,
    },
    {
      name: "summer",
      email: "summer@gmail.com",
      password: bcrypt.hashSync("123456"),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: "iPhone SE",
      slug: "iphone-se",
      category: "Phones",
      image: "/images/iphone-se.jpg",
      price: 719,
      brand: "Apple",
      rating: 4.0,
      numReviews: 5,
      countInStock: 7,
      description:
        "4.7-inch Retina HD display; Advanced single-camera system with 12MP Wide camera, Smart HDR 4, Photographic Styles, Portrait mode, and 4K video up to 60 fps; 7MP FaceTime HD camera with Smart HDR 4, Photographic Styles, Portrait mode and 1080p video recording.",
    },
    {
      name: "iPhone 14",
      slug: "iphone-14",
      category: "Phones",
      image: "/images/iphone-14.jpg",
      price: 1399,
      brand: "Apple",
      rating: 4.2,
      numReviews: 8,
      countInStock: 20,
      description:
        "6.1-inch Super Retina XDR display; Cinematic mode now in 4K Dolby Vision up to 30 fps; Action mode for smooth, steady, hand-held videos.",
    },
    {
      name: "iPhone 14 Pro",
      slug: "iphone-14-pro",
      category: "Phones",
      image: "/images/iphone-14-pro.jpg",
      price: 1749,
      brand: "Apple",
      rating: 4.5,
      numReviews: 12,
      countInStock: 13,
      description:
        "6.1-inch Super Retina XDR display featuring Always-On and ProMotion; Dynamic Island, a magical new way to interact with iPhone; 48MP Main camera for up to 4x greater resolution.",
    },
    {
      name: "iPhone 14 Pro Max",
      slug: "iphone-14-pro-max",
      category: "Phones",
      image: "/images/iphone-14-pro-max.jpg",
      price: 1899,
      brand: "Apple",
      rating: 4.4,
      numReviews: 9,
      countInStock: 10,
      description:
        "6.7-inch Super Retina XDR display featuring Always-On and ProMotion; Dynamic Island, a magical new way to interact with iPhone; 48MP Main camera for up to 4x greater resolution.",
      isFeatured: true,
      banner: "/images/iphone-14-pro-banner.jpg",
    },
    {
      name: "Samsung Galaxy Z Fold4",
      slug: "samsung-galaxy-z-fold4",
      category: "Phones",
      image: "/images/samsung-galaxy-z-fold4.jpg",
      price: 2499,
      brand: "Samsung",
      rating: 3.8,
      numReviews: 5,
      countInStock: 3,
      description:
        'Unfold for a Tablet like experience on our lightest Fold yet; 7.6" Main & 6.2" cover display2 with up to 120Hz refresh; Rated IPX8 and wrapped in tough Gorilla Glass Victus+.',
    },
    {
      name: "Samsung Galaxy S22",
      slug: "samsung-galaxy-s22",
      category: "Phones",
      image: "/images/samsung-galaxy-s22.jpg",
      price: 1197,
      brand: "Samsung",
      rating: 4,
      numReviews: 4,
      countInStock: 5,
      description:
        '6.1" BrightVision display with adaptive 120Hz refresh rate; 50MP camera - with new Adaptive Pixel Technology. Three lenses, advanced Nightography and 8K video recording; 3,700mAh (typical) All Day Battery with 25W Super-Fast Charging.',
    },
    {
      name: "OPPO A54",
      slug: "oppo-a54",
      category: "Phones",
      image: "/images/oppo-a54.jpg",
      price: 399,
      brand: "OPPO",
      rating: 4.3,
      numReviews: 9,
      countInStock: 15,
      description:
        "5000mAh Long-lasting battery; OPPO Enduring quality; 90Hz Colour-rich punch-hole display.",
    },
    {
      name: "Vivo Y33s",
      slug: "vivo-y33s",
      category: "Phones",
      image: "/images/vivo-y33s.jpg",
      price: 999,
      brand: "Vivo",
      rating: 4.8,
      numReviews: 6,
      countInStock: 8,
      description:
        "Take your photography to new heights with futuristic technology; Hasselblad Camera for Mobile; SLR-Level 5-Axis Optical Image Stabilisation.",
    },
    {
      name: "Apple AirPods",
      slug: "apple-airpods",
      category: "Headphones",
      image: "/images/apple-airpods.jpg",
      price: 249,
      brand: "Apple",
      rating: 4.1,
      numReviews: 11,
      countInStock: 23,
      description:
        "Spatial audio with dynamic head tracking places sound all around you; Adaptive EQ automatically tunes music to your ears; All-new contoured design.",
    },
    {
      name: "Apple AirPods Pro",
      slug: "apple-airpods-pro",
      category: "Headphones",
      image: "/images/apple-airpods-pro.jpg",
      price: 399,
      brand: "Apple",
      rating: 4.8,
      numReviews: 6,
      countInStock: 14,
      description:
        "Active Noise Cancellation reduces unwanted background noise; Personalised Spatial Audio with dynamic head tracking places sound all around you;Charging case with speaker for locating.",
      isFeatured: true,
      banner: "/images/apple-airpods-pro-banner.jpg",
    },
    {
      name: "Sony WF-C500",
      slug: "sony-wf-c500",
      category: "Headphones",
      image: "/images/sony-wf-c500.jpg",
      price: 129,
      brand: "Sony",
      rating: 4.0,
      numReviews: 33,
      countInStock: 41,
      description:
        "Truly Wireless Headphones with compact charging case; IPX4* water-resistant, for go-anywhere everyday use; Up to 10 hours music per charge, 20 hours with the charging case.",
    },
    {
      name: "Bose Sports Earbuds",
      slug: "bose-sports-earbuds",
      category: "Headphones",
      image: "/images/bose-sports-earbuds.jpg",
      price: 299,
      brand: "Bose",
      rating: 4.2,
      numReviews: 26,
      countInStock: 29,
      description:
        "Small, sweat & weather resistant earphones ideal for sports; Secure, comfortable silicone tips for better bass; lifelike sound, while still hearing your surroundings.",
    },
  ],
};

export default data;