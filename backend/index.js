const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");
const slugify = require("slugify");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
const port = 3000;

// 10 minute
const cache = new NodeCache({ stdTTL: 600 });

dotenv.config();

app.use(cors());

const companies = ["AMZ", "FLP", "SNP", "MYN", "AZO"];
const baseUrl = "http://20.244.56.144";

function generateUniqueId(product, company) {
  const companyNameSlug = slugify(company, { lower: true });
  const productNameSlug = slugify(product.productName, { lower: true });
  return `${companyNameSlug}-${productNameSlug}`;
}

function getConfig() {
  return {
    companyName: process.env.COMPANY_NAME,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    ownerName: process.env.OWNER_NAME,
    ownerEmail: process.env.OWNER_EMAIL,
    rollNo: process.env.ROLL_NO,
  };
}

async function getBearerToken() {
  const cacheKey = "authToken";
  let tokenData = cache.get(cacheKey);

  if (tokenData) {
    return tokenData.access_token;
  }

  const config = getConfig();

  try {
    const { data } = await axios.post(`${baseUrl}/test/auth`, config);

    const expiresInMs = data.expires_in;
    const currentTimestampMs = Date.now();

    const ttlSeconds = Math.floor((expiresInMs - currentTimestampMs) / 1000);

    cache.set(cacheKey, tokenData, ttlSeconds);

    return data.access_token;
  } catch (error) {
    throw error;
  }
}

async function fetchProducts(categoryName, minPrice, maxPrice, n) {
  const requests = companies.map(async (company) => {
    const bearerToken = await getBearerToken();
    return axios.get(
      `${baseUrl}/test/companies/${company}/categories/${categoryName}/products?minPrice=${minPrice}&maxPrice=${maxPrice}&top=${n}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
      }
    );
  });

  const responses = await Promise.all(requests);

  return responses.flatMap((response, index) =>
    response.data.map((product) => ({
      ...product,
      company: companies[index],
      id: generateUniqueId(product, companies[index]),
    }))
  );
}

// Categories endpoint
app.get("/categories/:categoryName/products", async (req, res) => {
  try {
    const { categoryName } = req.params;
    const {
      n = 10,
      page = 1,
      minPrice = 1,
      maxPrice = 10000,
      sortBy = "price",
      order = "asc",
    } = req.query;

    const cacheKey = `${categoryName}-${minPrice}-${maxPrice}`;
    let products = cache.get(cacheKey);

    if (!products) {
      products = await fetchProducts(categoryName, minPrice, maxPrice, n);
      cache.set(cacheKey, products);
    }

    products.sort((a, b) =>
      order === "asc" ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]
    );

    const startIndex = (page - 1) * n;
    const paginatedProducts = products.slice(
      startIndex,
      startIndex + Number(n)
    );

    res.json({
      products: paginatedProducts,
      totalProducts: products.length,
      page: Number(page),
      pageSize: Number(n),
      totalPages: Math.ceil(products.length / n),
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching products" });
  }
});

// Product endpoint
app.get("/categories/:categoryName/products/:productId", async (req, res) => {
  try {
    const { categoryName, productId } = req.params;
    const cacheKey = `${categoryName}-products`;
    let products = cache.get(cacheKey);

    if (!products) {
      products = await fetchProducts(categoryName, 1, 10000, 10);
      cache.set(cacheKey, products);
    }

    const product = products.find((p) => p.id === productId);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json(product);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the product" });
  }
});

app.listen(port, () => {
  console.log(`Server started 🎉\nhttp://localhost:${port}`);
});
