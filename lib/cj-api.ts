import axios from "axios";
import fs from "fs";
import path from "path";

const CJ_API_URL = "https://developers.cjdropshipping.com/api2.0/v1";

// Path to store the token on your hard drive
const TOKEN_CACHE_FILE = path.join(process.cwd(), ".cj_token_cache.json");

interface CachedToken {
  accessToken: string;
  expiry: number;
}

// 1. Read token from disk
const getCachedToken = (): string | null => {
  if (fs.existsSync(TOKEN_CACHE_FILE)) {
    try {
      const fileContent = fs.readFileSync(TOKEN_CACHE_FILE, "utf-8");
      const data: CachedToken = JSON.parse(fileContent);

      // Check if token is still valid (with a 5-minute buffer)
      if (data.accessToken && data.expiry > Date.now() + 5 * 60 * 1000) {
        return data.accessToken;
      }
    } catch (error) {
      console.error("Error reading token cache:", error);
    }
  }
  return null;
};

// 2. Write token to disk
const saveTokenToCache = (accessToken: string, expiry: number) => {
  try {
    const data: CachedToken = { accessToken, expiry };
    fs.writeFileSync(TOKEN_CACHE_FILE, JSON.stringify(data), "utf-8");
  } catch (error) {
    console.error("Error writing token cache:", error);
  }
};

// 3. Authenticate (Only hits API if cache is empty/expired)
const getAccessToken = async () => {
  // First, check the file system
  const cachedToken = getCachedToken();
  if (cachedToken) {
    return cachedToken;
  }

  console.log("🔄 Requesting NEW CJ Access Token from API...");

  try {
    const response = await axios.post(
      `${CJ_API_URL}/authentication/getAccessToken`,
      {
        email: process.env.CJ_EMAIL,
        password: process.env.CJ_PASSWORD,
      },
    );

    if (response.data.result) {
      const newToken = response.data.data.accessToken;
      // Set expiry to 14 days from now
      const newExpiry = Date.now() + 14 * 24 * 60 * 60 * 1000;

      saveTokenToCache(newToken, newExpiry);
      return newToken;
    } else {
      throw new Error(response.data.message || "Failed to authenticate");
    }
  } catch (error: unknown) {
    if (error instanceof axios.AxiosError && error.response?.status === 429) {
      console.error("⛔ CRITICAL: CJ API Rate Limit Hit (429).");
      console.error("You must wait 30-60 minutes for this ban to lift.");
    }
    throw error;
  }
};

// --- Product Functions ---

export const getXiangqiProducts = async (page = 1, size = 20) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get(`${CJ_API_URL}/product/listV2`, {
      headers: { "CJ-Access-Token": token },
      params: {
        page,
        size,
        keyWord: "Xiangqi Chinese Chess",
      },
    });

    if (response.data.result) {
      return response.data.data.list;
    }
    return [];
  } catch (error) {
    console.error("Fetch Products Error:", error);
    // Return empty array so UI shows "No Products" instead of crashing
    return [];
  }
};

export const getProductDetail = async (pid: string) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get(`${CJ_API_URL}/product/query`, {
      headers: { "CJ-Access-Token": token },
      params: { pid },
    });

    if (response.data.result) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error("Fetch Product Detail Error:", error);
    return null;
  }
};
