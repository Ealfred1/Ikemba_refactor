import fs from 'fs';
import path from 'path';

export interface Product {
    sku: string;
    barcode: string;
    name: string;
    price: number;
    discountedPrice: number;
    image: string;
    category: string;
}

export const CATEGORIES = [
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

export type Category = typeof CATEGORIES[number];

// Category assignment rules — keyword matching against product names
const CATEGORY_RULES: { category: Category; keywords: string[] }[] = [
    {
        category: 'Water',
        keywords: ['water', 'pure life', 'laqua', 'cway water', 'aquafina water', 'pure water sachet'],
    },
    {
        category: 'Alcohol',
        keywords: [
            'wine', 'beer', 'gin', 'rum', 'vodka', 'whisky', 'whiskey', 'tequila', 'brandy',
            'cognac', 'champagne', 'stout', 'hennessy', 'baileys', 'jameson', 'jack daniel',
            'ciroc', 'smirnoff', 'bacardi', 'captain morgan', 'johnnie walker', 'chivas', 'grey goose',
            'absolut', 'campari', 'amarula', 'malibu', 'orijin', 'desperados', 'star lager',
            'guinness', 'budweiser', 'tiger', 'goldberg', 'trophy', 'heineken', 'four cousins',
            'carlo rossi', 'martini', 'meukow', 'remy martin', 'martell', 'moet', 'veuve', 'olmeca',
            'skyy', 'jinro', 'soju', 'jose cuervo', 'don julio', '818', 'sierra tequila', 'aznauri',
            'mapu', 'highland chief', 'andre', 'black bullet', 'gordon\'s', 'coco samba',
            'captain jack rum', 'declan red', 'agor red',
        ],
    },
    {
        category: 'Juice',
        keywords: [
            'juice', 'chivita', 'ribena', 'lucozade', '5 alive', 'caprisun', 'sosa', 'arizona',
            'pure heaven grape', 'chivita ice tea',
        ],
    },
    {
        category: 'Soda & Drinks',
        keywords: [
            'coke', 'coca cola', 'pepsi', 'fanta', 'sprite', 'schweppes', 'lacasera', 'bigi',
            'malta', 'malt', 'red bull', 'monster', 'fearless', 'miranda', 'supa komando',
            'predator', 'amstel malta', 'dubic malt', 'bullet energy', 'fayrouz', 'maltina',
        ],
    },
    {
        category: 'Milk/Milk Drinks',
        keywords: [
            'milk', 'yoghurt', 'yogurt', 'vitamilk', 'hollandia', 'peak', 'cowbell', 'dano',
            'loya', 'three crowns', 'hollandia yoghurt', 'fresh yo', 'viju', 'l&z', 'nutri-milk',
            'cway nutri', 'evaporated milk',
        ],
    },
    {
        category: 'Breakfast',
        keywords: [
            'bread', 'cornflake', 'coco pops', 'milo', 'ovaltine', 'tea', 'coffee', 'nescafe',
            'lipton', 'egg', 'cereal', 'oat', 'golden morn', 'kellogg', 'nutribom', 'cadbury hot',
            'checkers custard', 'ballerina tea', 'café art', 'gold kili', 'jam', 'blue pearl',
            'hungry jack', 'american midi', 'maxton', 'english oven', 'goochi', 'yale bread',
            'cowbell chocolate', 'pocco', 'nasco cornflakes',
        ],
    },
    {
        category: 'Noodles',
        keywords: ['noodle', 'indomie', 'spaghetti', 'pasta', 'macaroni', 'crown spaghetti', 'golden penny pasta'],
    },
    {
        category: 'Snacks & Sweets',
        keywords: [
            'biscuit', 'cookie', 'pringles', 'gala', 'plantain chip', 'potato chip', 'snicker',
            'mars', 'bounty', 'twix', 'oreo', 'nabisco', 'mcvities', 'mcvitie', 'yale', 'parle',
            'super 2', 'merba', 'maryland', 'fab!', 'tesco cream', 'tuc', 'jacob', 'dockers cracker',
            'beloxxi', 'elkes', 'fox\'s', 'didian', 'bakemate', 'nature valley', 'desmond', 'fray',
            'newbisco', 'kemps', 'take nice', 'pure bliss', 'chips', 'crackers', 'kopiko', 'candy',
            'roven alpin', 'ocean plus dried', 'superbite', 'essjays', 'gummy', 'sweets',
        ],
    },
    {
        category: 'Cooking Essentials',
        keywords: [
            'oil', 'sugar', 'salt', 'garri', 'rice', 'beans', 'flour', 'yam', 'pounded yam',
            'butter', 'margarine', 'mayonnaise', 'ketchup', 'honey', 'jam', 'peanut butter',
            'sardine', 'tuna', 'corned beef', 'crayfish', 'egusi', 'ogbono', 'seasoning', 'maggi',
            'knorr', 'skimmer', 'grater', 'blender', 'kettle', 'foil', 'cling film', 'baking soda',
            'baking powder', 'yeast', 'syrup', 'coconut oil', 'sesame oil', 'basmati', 'oats meal',
            'wheat meal', 'cook', 'palm oil', 'wesson', 'laziz', 'devon king', 'golden terra',
            'mamador', 'power vegetable', 'famili palm',
        ],
    },
    {
        category: 'Deodorant & Perfume',
        keywords: [
            'perfume', 'eau de parfum', 'eau de toilette', 'deodorant', 'antiperspirant', 'roll-on',
            'roll on', 'axe', 'dove men care sport', 'dove advanced care', 'sure women', 'sure men',
            'right guard', 'nivea men antiperspirant', 'nivea black & white', 'rexona', 'dovespray',
            'carolina herrera', 'riggs rider', 'lattafa', 'terra d\'hermes', 'tom ford',
            'boss orange', 'kaly libre', '212 vip', 'passport for love', 'chairman paris',
            'imperio', 'empire way', 'qaed al fursan', 'element eau de parfum',
        ],
    },
    {
        category: 'Household',
        keywords: [
            'detergent', 'starch', 'dishwash', 'dish wash', 'insect', 'air freshener', 'polish',
            'iron', 'battery', 'sponge', 'towel', 'ludo', 'lemon fresh', 'mr sheen', 'cleanmax',
            'air wick', 'raid', 'rambo', 'sniper', 'ambipur', 'stella freshener', 'lb car wash',
            'mama lemon', 'so klin', 'viva plus', 'good mama detergent', 'mama mama', 'envelope',
            'packing tape', 'f1 car dashboard', 'shoe', 'swiss tangerine', 'tiger head battery',
            'mczen battery', 'raymax', 'rejoice envelope', 'generic face', 'white face towel',
            'silver crest', 'euromax',
        ],
    },
    {
        category: 'Toiletries',
        keywords: [
            'soap', 'shampoo', 'lotion', 'body lotion', 'vaseline', 'baby oil', 'petroleum jelly',
            'toothpaste', 'colgate', 'oral-b', 'sensodyne', 'dabur', 'dove bar', 'dudu osun',
            'irish spring', 'premier cool bar', 'asantee', 'dove pink', 'dove gentle',
            'dove refreshing', 'dove pampering', 'dove relaxing', 'dove beauty cream', 'african sponge',
            'xtreme activated charcoal', 'rexona men invisible roll', 'dove advanced care sensitive roll',
            'toilet tissue', 'rose plus toilet', 'mirin cool kitchen sponge', 'amanda kitchen sponge',
            'baby towel', 'williams adult bath', 'cussons', 'pears baby', 'johnson\'s baby',
            'nivea men body lotion', 'toke carrot', 'jimpo-ori shea', 'nivea radiant', 'nivea perfect',
            'nivea rich', 'dove cocoa butter',
        ],
    },
    {
        category: 'Packs & Bundles',
        keywords: ['pack of 40', 'pack of 24', 'pack of 20', 'pack of 12', 'cookies supreme', 'amstel malta pack'],
    },
    {
        category: 'Feminine Care',
        keywords: [
            'sanitary pad', 'panty liner', 'softcare', 'always', 'lady care', 'molped', 'love panty',
            'virony', 'feminine', 'female hygiene',
        ],
    },
    {
        category: 'Smoking & Tobacco',
        keywords: [
            'cigarette', 'tobacco', 'cigar', 'backwoods', 'rothmans', 'benson & hedges', 'marlboro',
            'chesterfield', 'esse', 'dunhill', 'cicada rolling', 'wetop rolling', 'oris chocolate cigarette',
            'oris strawberry cigarette', 'plastic grinder', 'smoking gas lighter',
        ],
    },
    {
        category: 'Energy',
        keywords: ['energy drink', 'lucozade boost', 'monster energy', 'red bull', 'fearless energy', 'bullet energy'],
    },
];

function assignCategory(productName: string): Category {
    const lower = productName.toLowerCase();

    for (const rule of CATEGORY_RULES) {
        for (const keyword of rule.keywords) {
            if (lower.includes(keyword.toLowerCase())) {
                return rule.category;
            }
        }
    }

    // Default fallback
    return 'Cooking Essentials';
}

export async function getProducts(category?: string): Promise<Product[]> {
    const csvPath = path.join(process.cwd(), 'public/data/products.csv');
    const csvData = fs.readFileSync(csvPath, 'utf8');

    const lines = csvData.split('\n');
    const products: Product[] = [];

    // Skip header
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        
        if (parts.length >= 5) {
            const name = parts[2].replace(/^"|"$/g, '').trim();
            const productCategory = assignCategory(name);

            if (category && productCategory !== category) continue;

            products.push({
                sku: parts[0].trim(),
                barcode: parts[1].trim(),
                name,
                price: parseFloat(parts[3]) || 0,
                discountedPrice: parseFloat(parts[4]) || 0,
                image: `https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop`,
                category: productCategory,
            });
        }
    }

    return products;
}

export async function getCategories(): Promise<{ name: string; count: number }[]> {
    const products = await getProducts();
    const counts: Record<string, number> = {};

    for (const p of products) {
        counts[p.category] = (counts[p.category] || 0) + 1;
    }

    return CATEGORIES
        .filter(cat => counts[cat] > 0)
        .map(cat => ({ name: cat, count: counts[cat] || 0 }));
}

export async function getProductBySku(skuId: string): Promise<Product | null> {
    const products = await getProducts();
    return products.find(p => {
        const productHash = p.name.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0).toString();
        return p.sku === skuId || productHash === skuId;
    }) || null;
}
