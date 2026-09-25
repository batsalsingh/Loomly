import dotenv from "dotenv";
import connectDB from "../src/db/index.js"; // Adjust path if your connectDB is elsewhere
import { Product } from "../src/models/product.model.js";
import { Category } from "../src/models/category.model.js";

dotenv.config({ path: "./.env" });

// --- Seed Data ---

const seedCategories = [
  { name: "Old Money", slug: "old-money" },
  { name: "Streetwear", slug: "streetwear" },
  { name: "Ethnic", slug: "ethnic" },
  { name: "Formals", slug: "formals" },
  { name: "Men T-Shirts", slug: "men-tshirts" },
  { name: "Women Tops", slug: "women-tops" },
  { name: "Men Casual Shirts", slug: "men-casual-shirts" },
  { name: "Men Sweatshirts", slug: "men-sweatshirts" },
  { name: "Men Jackets", slug: "men-jackets" },
  { name: "Men Blazers", slug: "men-blazers" },
  { name: "Ethnic Sherwanis", slug: "ethnic-sherwanis" },
  { name: "Ethnic Nehru Jackets", slug: "ethnic-nehru-jackets" },
  { name: "Men Jeans", slug: "men-jeans" },
  { name: "Men Trousers", slug: "men-trousers" },
  { name: "Men Shorts", slug: "men-shorts" },
  { name: "Ethnic Sarees", slug: "ethnic-sarees" },
  { name: "Ethnic Lehenga", slug: "ethnic-lehenga" },
  { name: "Women Dresses", slug: "women-dresses" },
  { name: "Women Jeans", slug: "women-jeans" },
  { name: "Women T-Shirts", slug: "women-tshirts" },
  { name: "Women Skirts", slug: "women-skirts" },
  { name: "Women Jackets", slug: "women-jackets" },
  { name: "Kids Boys T-Shirts", slug: "kids-boys-tshirts" },
  { name: "Kids Boys Shirts", slug: "kids-boys-shirts" },
  { name: "Kids Boys Jeans", slug: "kids-boys-jeans" },
  { name: "Kids Girls Dresses", slug: "kids-girls-dresses" },
  { name: "Kids Girls Tops", slug: "kids-girls-tops" },
  { name: "Kids Girls T-Shirts", slug: "kids-girls-tshirts" },
];

const buildVariants = (skuPrefix, sizeStocks) =>
  sizeStocks.map(({ size, stock }) => ({
    size,
    sku: `${skuPrefix}-${size}`,
    stock,
  }));

const toPublicIdBase = (productName) =>
  productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const seedProducts = [
  {
    name: "Classic Linen Shirt",
    description:
      "A breathable linen shirt with a tailored silhouette and clean collar construction. Built for summer layering with a premium feel.",
    price: 89.99,
    categorySlug: "old-money",
    imageUrls: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
    ],
    variants: buildVariants("LM-CLS-LINEN", [
      { size: "S", stock: 8 },
      { size: "M", stock: 10 },
      { size: "L", stock: 9 },
      { size: "XL", stock: 7 },
    ]),
    trending: true,
  },
  {
    name: "Vintage Washed Graphic Tee",
    description:
      "Heavyweight cotton tee with a faded print and relaxed drape. A street staple with soft hand-feel and durable stitching.",
    price: 45.0,
    categorySlug: "streetwear",
    imageUrls: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
    ],
    variants: buildVariants("LM-VTG-GRAPHIC", [
      { size: "S", stock: 16 },
      { size: "M", stock: 22 },
      { size: "L", stock: 20 },
      { size: "XL", stock: 14 },
    ]),
    trending: true,
  },
  {
    name: "Embroidered Silk Kurta",
    description:
      "Festive silk-blend kurta with tonal embroidery and a clean placket. Designed for celebrations with breathable comfort.",
    price: 129.5,
    categorySlug: "ethnic",
    imageUrls: [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
    ],
    variants: buildVariants("LM-EMB-KURTA", [
      { size: "S", stock: 6 },
      { size: "M", stock: 8 },
      { size: "L", stock: 7 },
      { size: "XL", stock: 5 },
    ]),
    trending: true,
  },
  {
    name: "Slim-Fit Pinstripe Suit",
    description:
      "A modern two-piece pinstripe suit with structured shoulders and lightweight wool blend fabric. Built for sharp formal wear.",
    price: 349.99,
    categorySlug: "formals",
    imageUrls: [
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=1200&q=80",
    ],
    variants: buildVariants("LM-SLM-PINSTRIPE", [
      { size: "S", stock: 4 },
      { size: "M", stock: 6 },
      { size: "L", stock: 5 },
      { size: "XL", stock: 4 },
    ]),
    trending: false,
  },
  {
    name: "Oversized Fleece Hoodie",
    description:
      "An oversized hoodie cut from heavyweight fleece with ribbed cuffs and a roomy hood. Perfect for layered streetwear fits.",
    price: 95.0,
    categorySlug: "streetwear",
    imageUrls: [
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80",
    ],
    variants: buildVariants("LM-OVR-HOODIE", [
      { size: "S", stock: 14 },
      { size: "M", stock: 19 },
      { size: "L", stock: 17 },
      { size: "XL", stock: 12 },
    ]),
    trending: true,
  },
  {
    name: "Minimalist Crewneck Tee",
    description:
      "A clean everyday pima-cotton tee with a soft hand-feel and balanced fit. Built to be the most versatile layer in your wardrobe.",
    price: 29.99,
    categorySlug: "men-tshirts",
    imageUrls: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1200&q=80",
    ],
    variants: buildVariants("LM-MIN-CREW", [
      { size: "S", stock: 22 },
      { size: "M", stock: 28 },
      { size: "L", stock: 24 },
      { size: "XL", stock: 20 },
    ]),
    trending: false,
  },
  {
    name: "Flowy Bell-Sleeve Top",
    description:
      "A draped top with statement bell sleeves and airy fabric. Designed for movement and effortless day-to-evening styling.",
    price: 55.0,
    categorySlug: "women-tops",
    imageUrls: [
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80",
    ],
    variants: buildVariants("LM-FLW-BELL", [
      { size: "XS", stock: 9 },
      { size: "S", stock: 12 },
      { size: "M", stock: 13 },
      { size: "L", stock: 9 },
    ]),
    trending: false,
  },
  {
    name: "Tailored Wool Peacoat",
    description:
      "A classic double-breasted peacoat with a tailored structure and warm wool blend. A cold-weather staple with timeless polish.",
    price: 220.0,
    categorySlug: "old-money",
    imageUrls: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80",
    ],
    variants: buildVariants("LM-TLR-PEACOAT", [
      { size: "S", stock: 6 },
      { size: "M", stock: 8 },
      { size: "L", stock: 7 },
      { size: "XL", stock: 5 },
    ]),
    trending: false,
  },
  {
    name: "Relaxed Wide-Leg Trousers",
    description:
      "Clean pleated trousers with a relaxed wide-leg cut and fluid drape. Easy pairing for both formal and smart-casual looks.",
    price: 78.0,
    categorySlug: "formals",
    imageUrls: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=80",
    ],
    variants: buildVariants("LM-RLX-TROUSER", [
      { size: "S", stock: 10 },
      { size: "M", stock: 13 },
      { size: "L", stock: 12 },
      { size: "XL", stock: 9 },
    ]),
    trending: false,
  },
  {
    name: "Cropped Ribbed Tank",
    description:
      "Soft ribbed knit tank with a cropped fit and stretchy comfort. Great for layering under shirts, blazers, and lightweight jackets.",
    price: 34.5,
    categorySlug: "women-tops",
    imageUrls: [
      "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    ],
    variants: buildVariants("LM-CRP-TANK", [
      { size: "XS", stock: 11 },
      { size: "S", stock: 14 },
      { size: "M", stock: 16 },
      { size: "L", stock: 10 },
    ]),
    trending: true,
  },
  {
    name: "Heritage Logo Street Tee",
    description:
      "Boxy-fit logo tee with reinforced neck rib and pre-shrunk cotton. Everyday streetwear essential with premium structure.",
    price: 39.0,
    categorySlug: "men-tshirts",
    imageUrls: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=80",
    ],
    variants: buildVariants("LM-HRT-LOGOTEE", [
      { size: "S", stock: 15 },
      { size: "M", stock: 18 },
      { size: "L", stock: 17 },
      { size: "XL", stock: 14 },
    ]),
    trending: true,
  },
];

// --- Seeder Logic ---

const importData = async () => {
  try {
    // 1. Clear existing data
    await Category.deleteMany();
    await Product.deleteMany();
    console.log("Old data destroyed!");

    // 2. Insert new categories
    const createdCategories = await Category.insertMany(seedCategories);
    console.log("Categories imported!");

    // 3. Map category slugs to their new _id values
    const categoryMap = createdCategories.reduce((acc, category) => {
      acc[category.slug] = category._id;
      return acc;
    }, {});

    // 4. Prepare products with the correct category _id
    const productsWithCategoryIds = seedProducts.map((product) => {
      const categoryId = categoryMap[product.categorySlug];
      const publicIdBase = toPublicIdBase(product.name);
      const mappedImages = product.imageUrls.map((url, index) => ({
        public_id: `loomly_seed/${publicIdBase}_${index + 1}`,
        url,
      }));

      if (!categoryId) {
        throw new Error(`Category not found for slug: ${product.categorySlug}`);
      }

      const calculatedStock = product.variants.reduce(
        (total, variant) => total + variant.stock,
        0
      );

      return {
        name: product.name,
        description: product.description,
        price: product.price,
        category: categoryId,
        thumbnail: mappedImages[0],
        images: mappedImages,
        variants: product.variants,
        stock: calculatedStock,
        trending: Boolean(product.trending),
      };
    });

    // 5. Insert new products
    await Product.insertMany(productsWithCategoryIds);
    console.log("Products imported!");

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Category.deleteMany();
    await Product.deleteMany();
    console.log("Data destroyed!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// --- Execution ---

const runSeeder = async () => {
  await connectDB(); // Establish database connection first

  if (process.argv[2] === "-d") {
    // If you run `node seeder.js -d`, it will destroy data
    destroyData();
  } else {
    // Otherwise, it will import data
    importData();
  }
};

runSeeder();