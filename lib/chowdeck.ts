/**
 * Chowdeck API integration.
 * Vendor: Lekki Mart (ID: 133994)
 *
 * Price note: Chowdeck stores all prices in KOBO (NGN minor unit).
 * Convert to naira: price / 100.
 */

// ─── Chowdeck API shape (partial) ───────────────────────────────────────────

interface ChowdeckImage {
    id: number;
    path: string;
    rank: number;
    is_active: boolean;
}

interface ChowdeckCategory {
    id: number;
    name: string;
    is_published: boolean;
}

interface ChowdeckMenuItem {
    id: number;
    name: string;
    description: string;
    price: number;           // in kobo
    discount_price: number;  // in kobo (field name in customer API)
    discounted_price?: number; // in kobo (alternate field name in merchant API)
    in_stock: boolean;
    is_published: boolean;
    is_active: boolean;
    reference: string;      // SKU
    category: ChowdeckCategory | null;
    images: ChowdeckImage[];
}

interface ChowdeckApiResponse {
    status: string;
    message: string;
    data: ChowdeckMenuItem[];
}

// ─── Our internal Product shape ──────────────────────────────────────────────

export interface Product {
    id: number;
    sku: string;
    name: string;
    description: string;
    price: number;          // naira
    discountedPrice: number; // naira
    inStock: boolean;
    image: string;
    category: string;
}

// ─── Category constants ──────────────────────────────────────────────────────

export const KNOWN_CATEGORIES = [
    'Water',
    'Soda & Drinks',
    'Energy',
    'Juice',
    'Alcohol',
    'Snacks & Sweets',
    'Breakfast',
    'Milk/Milk Drinks',
    'Noodles',
    'Cooking Essentials',
    'Deodorant & Perfume',
    'Household',
    'Toiletries',
    'Packs & Bundles',
    'Feminine Care',
    'Smoking & Tobacco',
] as const;

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop';

// ─── Transform helpers ───────────────────────────────────────────────────────

function koboToNaira(kobo: number): number {
    return kobo / 100;
}

function sanitizeCategoryName(raw: string | undefined | null): string {
    if (!raw) return 'Other';
    // Trim trailing spaces/special chars that exist in some Chowdeck entries
    return raw.trim();
}

function getBestImage(images: ChowdeckImage[]): string {
    if (!images || images.length === 0) return FALLBACK_IMAGE;
    // Sort by rank descending, prefer rank === 1
    const sorted = [...images]
        .filter(img => img.is_active)
        .sort((a, b) => b.rank - a.rank);
    return sorted[0]?.path || FALLBACK_IMAGE;
}

function mapItem(item: ChowdeckMenuItem): Product {
    // Chowdeck uses different field names across merchant vs customer APIs
    const rawDiscountedPrice = item.discount_price ?? item.discounted_price ?? item.price;
    return {
        id: item.id,
        sku: item.reference,
        name: item.name.trim(),
        description: item.description?.trim() || item.name.trim(),
        price: koboToNaira(item.price),
        discountedPrice: koboToNaira(rawDiscountedPrice),
        inStock: item.in_stock,
        image: getBestImage(item.images),
        category: sanitizeCategoryName(item.category?.name),
    };
}

// ─── Core fetch ─────────────────────────────────────────────────────────────

const MERCHANT_REF = process.env.CHOWDECK_MERCHANT_REFERENCE || '133994';
const API_BASE = process.env.CHOWDECK_API_URL || 'https://api.chowdeck.com';
const API_TOKEN = process.env.CHOWDECK_API_TOKEN || '';

// In-memory cache — avoids the Next.js 2MB fetch-cache limit.
// The full Chowdeck menu payload is ~2.15MB raw JSON; storing the
// parsed Product[] (~200KB) is far more efficient.
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
let _cache: { products: Product[]; expiresAt: number } | null = null;

async function fetchChowdeckMenu(): Promise<Product[]> {
    // Return cached data if still fresh
    if (_cache && Date.now() < _cache.expiresAt) {
        return _cache.products;
    }

    const url = `${API_BASE}/merchant/${MERCHANT_REF}/menu`;
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (API_TOKEN) headers['Authorization'] = `Bearer ${API_TOKEN}`;

    const res = await fetch(url, {
        // Disable Next.js fetch cache — we manage caching ourselves
        cache: 'no-store',
        headers,
    });

    if (res.status === 401) {
        throw new Error(
            'Chowdeck API: Unauthorized (401). Set CHOWDECK_API_TOKEN in .env.local'
        );
    }

    if (!res.ok) {
        throw new Error(`Chowdeck API error: ${res.status} ${res.statusText} — ${url}`);
    }

    const json: ChowdeckApiResponse = await res.json();

    if (json.status !== 'success' || !Array.isArray(json.data)) {
        throw new Error(`Unexpected Chowdeck response shape: ${json.message}`);
    }

    const products = json.data
        .filter(item => item.is_published && item.is_active)
        .map(mapItem);

    // Store in memory cache
    _cache = { products, expiresAt: Date.now() + CACHE_TTL_MS };

    return products;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function getProducts(category?: string): Promise<Product[]> {
    const products = await fetchChowdeckMenu();

    if (!category) return products;

    // Normalize: Chowdeck sometimes has trailing spaces in category names
    const needle = category.trim().toLowerCase();
    return products.filter(p => p.category.toLowerCase() === needle);
}

export async function getProductById(id: string | number): Promise<Product | null> {
    // Strategy: fetch from the list (already cached) and find by numeric id.
    // If the id looks like a SKU reference, we can also hit the single-item endpoint.
    const isNumeric = !isNaN(Number(id));

    if (isNumeric) {
        // Fetch from the cached full list and match by id
        try {
            const products = await fetchChowdeckMenu();
            return products.find(p => p.id === Number(id)) || null;
        } catch {
            return null;
        }
    }

    // SKU reference path — use the dedicated single-item endpoint
    const url = `${API_BASE}/merchant/${MERCHANT_REF}/menu/${id}`;
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (API_TOKEN) headers['Authorization'] = `Bearer ${API_TOKEN}`;

    const res = await fetch(url, { next: { revalidate: 300 }, headers });
    if (!res.ok) return null;

    const json = await res.json();
    if (json.status !== 'success' || !json.data) return null;

    return mapItem(json.data as ChowdeckMenuItem);
}

export async function getCategories(): Promise<{ name: string; count: number }[]> {
    const products = await fetchChowdeckMenu();

    const counts: Record<string, number> = {};
    for (const p of products) {
        counts[p.category] = (counts[p.category] || 0) + 1;
    }

    // Return in our preferred display order, then append any unexpected new categories
    const ordered: { name: string; count: number }[] = KNOWN_CATEGORIES
        .filter(cat => counts[cat] > 0)
        .map(cat => ({ name: cat as string, count: counts[cat] }));

    const extras = Object.entries(counts)
        .filter(([name]) => !KNOWN_CATEGORIES.includes(name as typeof KNOWN_CATEGORIES[number]))
        .map(([name, count]) => ({ name, count }));

    return [...ordered, ...extras];
}

// ─── Delivery ────────────────────────────────────────────────────────────────

export interface DeliveryRequest {
    fee_id: string | number;
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    estimated_order_amount: number; // in naira
    delivery_note?: string;
    reference?: string;
}

/**
 * Creates a delivery in Chowdeck.
 */
export async function createChowdeckDelivery(data: DeliveryRequest) {
    const {
        fee_id,
        customer_name,
        customer_phone,
        customer_email,
        estimated_order_amount = 0,
        delivery_note,
        reference,
    } = data;

    // Normalize Nigerian phone number — strip leading 0 and add country code
    const phone = customer_phone.replace(/\D/g, '').replace(/^0/, '');

    const payload = {
        destination_contact: {
            name: customer_name,
            phone: phone,
            email: customer_email || undefined,
            country_code: 'NG',
        },
        source_contact: {
            phone: process.env.STORE_PHONE || '08012345678',
            email: process.env.STORE_EMAIL || 'orders@lekkimart.com',
            country_code: 'NG',
        },
        fee_id: Number(fee_id),
        item_type: 'food',
        user_action: 'sending',
        customer_delivery_note: delivery_note || 'Handle with care',
        customer_vendor_note: 'Fresh groceries from Lekki Mart',
        estimated_order_amount: Math.round(estimated_order_amount * 100), // kobo
        reference: reference || `LKMT-${Date.now()}`,
    };

    const url = `${API_BASE}/merchant/${MERCHANT_REF}/delivery`;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    };
    if (API_TOKEN) headers['Authorization'] = `Bearer ${API_TOKEN}`;

    const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const err = await res.text();
        console.error('[/lib/chowdeck] createChowdeckDelivery error:', err);
        throw new Error(`Failed to create delivery: ${res.statusText}`);
    }

    const json = await res.json();
    return json.data;
}
