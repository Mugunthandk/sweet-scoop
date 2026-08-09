import { Product, User, Order, Coupon, Review, Store, InventoryItem, Subscription, NotificationItem, Staff } from '../types';

// In-Memory Database Store
class Database {
  private products: Product[] = [];
  private users: User[] = [];
  private orders: Order[] = [];
  private coupons: Coupon[] = [];
  private reviews: Review[] = [];
  private stores: Store[] = [];
  private inventory: InventoryItem[] = [];
  private subscriptions: Subscription[] = [];
  private notifications: NotificationItem[] = [];
  private staff: Staff[] = [];

  constructor() {
    this.seedData();
  }

  private seedData() {
    // 1. Initial Products (20 products)
    this.products = [
      {
        id: 'prod-1',
        name: 'Madagascar Vanilla Bean',
        description: 'A timeless, aromatic classic crafted with real Bourbon Madagascar vanilla beans swirled in fresh dairy sweet cream.',
        price: 180,
        discount: 10,
        images: [
          'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&q=80&w=800'
        ],
        rating: 4.9,
        reviewsCount: 128,
        category: 'Classic',
        stock: 50,
        sizes: ['Single Scoop', 'Double Scoop', 'Pint (500ml)', 'Party Tub (1L)'],
        ingredients: ['Fresh Cream', 'Whole Milk', 'Madagascar Vanilla Bean', 'Cane Sugar', 'Egg Yolks'],
        nutrition: { calories: 220, fat: '12g', carbs: '24g', protein: '4g', sugar: '18g' },
        allergens: ['Milk', 'Egg'],
        recommendedToppings: ['Hot Fudge', 'Toasted Almonds', 'Waffle Chips'],
        isBestseller: true,
        isAvailable: true
      },
      {
        id: 'prod-2',
        name: 'Double Dark Belgian Fudge',
        description: 'Intensely chocolatey, ultra-fudgy artisanal cream infused with 70% dark Belgian cocoa and hand-dropped truffle bits.',
        price: 210,
        discount: 15,
        images: [
          'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=crop&q=80&w=800'
        ],
        rating: 4.9,
        reviewsCount: 240,
        category: 'Chocolate',
        stock: 45,
        sizes: ['Single Scoop', 'Double Scoop', 'Pint (500ml)', 'Party Tub (1L)'],
        ingredients: ['70% Dark Belgian Chocolate', 'Heavy Cream', 'Dutch Cocoa Powder', 'Brown Sugar'],
        nutrition: { calories: 260, fat: '15g', carbs: '28g', protein: '5g', sugar: '21g' },
        allergens: ['Milk', 'Soy'],
        recommendedToppings: ['Brownie Bites', 'Whipped Cream', 'Chocolate Sprinkles'],
        isBestseller: true,
        isAvailable: true
      },
      {
        id: 'prod-3',
        name: 'Fresh Alphonso Mango Swirl',
        description: 'Sunshine in a scoop! Pure Ratnagiri Alphonso mango pulp churned with light cream and ribbons of tangy fruit coulis.',
        price: 195,
        discount: 0,
        images: [
          'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?auto=format&fit=crop&q=80&w=800'
        ],
        rating: 4.8,
        reviewsCount: 95,
        category: 'Fruit',
        stock: 35,
        sizes: ['Single Scoop', 'Double Scoop', 'Pint (500ml)'],
        ingredients: ['Alphonso Mango Pulp', 'Whole Milk', 'Cream', 'Lemon Juice', 'Cane Sugar'],
        nutrition: { calories: 190, fat: '8g', carbs: '26g', protein: '3g', sugar: '22g' },
        allergens: ['Milk'],
        recommendedToppings: ['Cashew Crunch', 'White Chocolate Chips'],
        isSeasonal: true,
        isNew: true,
        isAvailable: true
      },
      {
        id: 'prod-4',
        name: 'Wild Roasted Pistachio Saffron',
        description: 'A regal royal delight! Roasted Iranian pistachios coarse-ground into a silky saffron and cardamom milk base.',
        price: 240,
        discount: 10,
        images: [
          'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=800'
        ],
        rating: 5.0,
        reviewsCount: 110,
        category: 'Premium',
        stock: 30,
        sizes: ['Single Scoop', 'Double Scoop', 'Pint (500ml)'],
        ingredients: ['Roasted Pistachios', 'Kashmiri Saffron', 'Cardamom', 'Whole Milk', 'Cream'],
        nutrition: { calories: 240, fat: '14g', carbs: '22g', protein: '6g', sugar: '16g' },
        allergens: ['Milk', 'Tree Nuts (Pistachio)'],
        recommendedToppings: ['Saffron Syrup', 'Crushed Pistachios'],
        isBestseller: true,
        isAvailable: true
      },
      {
        id: 'prod-5',
        name: 'Royal Nutty Sundae Supreme',
        description: 'Two gigantic scoops of Vanilla and Chocolate topped with hot fudge, crushed waffle, toasted almonds, cherry, and whipped cream.',
        price: 290,
        discount: 20,
        images: [
          'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=800'
        ],
        rating: 4.9,
        reviewsCount: 310,
        category: 'Sundaes',
        stock: 25,
        sizes: ['Sundae Bowl'],
        ingredients: ['Vanilla Scoop', 'Chocolate Scoop', 'Hot Fudge', 'Whipped Cream', 'Almonds', 'Maraschino Cherry'],
        nutrition: { calories: 480, fat: '24g', carbs: '56g', protein: '8g', sugar: '42g' },
        allergens: ['Milk', 'Tree Nuts', 'Gluten', 'Soy'],
        recommendedToppings: ['Extra Cherry', 'Rainbow Sprinkles'],
        isBestseller: true,
        isAvailable: true
      },
      {
        id: 'prod-6',
        name: 'Oreo Cookies & Cream Overload',
        description: 'Crisp chocolate cookie crumbs and large chunks of original Oreo cookies folded into rich vanilla cream.',
        price: 190,
        discount: 5,
        images: [
          'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=800'
        ],
        rating: 4.8,
        reviewsCount: 180,
        category: 'Cookies & Cream',
        stock: 40,
        sizes: ['Single Scoop', 'Double Scoop', 'Pint (500ml)'],
        ingredients: ['Oreo Cookies', 'Sweet Cream Base', 'Cocoa Powder', 'Vanilla Extract'],
        nutrition: { calories: 250, fat: '13g', carbs: '30g', protein: '4g', sugar: '22g' },
        allergens: ['Milk', 'Gluten', 'Soy'],
        recommendedToppings: ['Crushed Oreos', 'Chocolate Syrup'],
        isBestseller: true,
        isAvailable: true
      },
      {
        id: 'prod-7',
        name: 'Vegan Coconut Strawberry Delight',
        description: '100% plant-based creamy coconut milk base blended with luscious fresh garden strawberry preserve.',
        price: 200,
        discount: 0,
        images: [
          'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=800'
        ],
        rating: 4.7,
        reviewsCount: 78,
        category: 'Vegan',
        stock: 30,
        sizes: ['Single Scoop', 'Double Scoop', 'Pint (500ml)'],
        ingredients: ['Organic Coconut Milk', 'Fresh Strawberries', 'Agave Nectar', 'Tapioca Starch'],
        nutrition: { calories: 180, fat: '10g', carbs: '22g', protein: '2g', sugar: '16g' },
        allergens: ['Tree Nuts (Coconut)'],
        isVegan: true,
        isDairyFree: true,
        isAvailable: true
      },
      {
        id: 'prod-8',
        name: 'Sugar-Free Hazelnut Dark Cocoa',
        description: 'Indulge without guilt! Naturally sweetened with monk fruit and stevia, featuring roasted hazelnuts and rich dark cocoa.',
        price: 220,
        discount: 10,
        images: [
          'https://images.unsplash.com/photo-1560008511-11c63416e52d?auto=format&fit=crop&q=80&w=800'
        ],
        rating: 4.6,
        reviewsCount: 64,
        category: 'Sugar-Free',
        stock: 25,
        sizes: ['Single Scoop', 'Double Scoop', 'Pint (500ml)'],
        ingredients: ['Skim Milk', 'Roast Hazelnuts', 'Cocoa Powder', 'Monk Fruit Extract', 'Erythritol'],
        nutrition: { calories: 140, fat: '8g', carbs: '12g', protein: '5g', sugar: '1g' },
        allergens: ['Milk', 'Tree Nuts (Hazelnut)'],
        isSugarFree: true,
        isAvailable: true
      },
      {
        id: 'prod-9',
        name: 'Blackberry Lavender Swirl (Limited)',
        description: 'Flavor of the Month! Locally harvested sweet blackberries swirled into sweet cream infused with organic culinary lavender flowers.',
        price: 225,
        discount: 15,
        images: [
          'https://images.unsplash.com/photo-1534706936160-d5ee67737249?auto=format&fit=crop&q=80&w=800'
        ],
        rating: 4.9,
        reviewsCount: 88,
        category: 'Seasonal',
        stock: 20,
        sizes: ['Single Scoop', 'Double Scoop', 'Pint (500ml)'],
        ingredients: ['Wild Blackberries', 'Culinary Lavender Infusion', 'Whole Cream', 'Cane Sugar'],
        nutrition: { calories: 200, fat: '10g', carbs: '25g', protein: '3g', sugar: '19g' },
        allergens: ['Milk'],
        recommendedToppings: ['Honey Drizzle', 'White Choco Chips'],
        isNew: true,
        isAvailable: true
      },
      {
        id: 'prod-10',
        name: 'Party Combo Box (4 Tubs + Waffle Cones)',
        description: 'The ultimate party saver! Includes 4 x 500ml tubs of your choice, 6 crispy waffle cones, rainbow sprinkles, and hot fudge jar.',
        price: 899,
        discount: 25,
        images: [
          'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=800'
        ],
        rating: 4.9,
        reviewsCount: 145,
        category: 'Combos',
        stock: 15,
        sizes: ['Family Box'],
        ingredients: ['Custom ice cream tubs', 'Waffle cones', 'Toppings jar'],
        nutrition: { calories: 1200, fat: '60g', carbs: '140g', protein: '20g', sugar: '100g' },
        allergens: ['Milk', 'Gluten', 'Soy', 'Tree Nuts'],
        isBestseller: true,
        isAvailable: true
      },
      {
        id: 'prod-11',
        name: 'Mint Chocolate Chunk Gelato',
        description: 'Cool peppermint infusion with specks of bittersweet dark chocolate chunks.',
        price: 190,
        discount: 0,
        images: [
          'https://images.unsplash.com/photo-1516559828984-fb3b99548b21?auto=format&fit=crop&q=80&w=800'
        ],
        rating: 4.7,
        reviewsCount: 82,
        category: 'Classic',
        stock: 35,
        sizes: ['Single Scoop', 'Double Scoop', 'Pint (500ml)'],
        ingredients: ['Fresh Mint', 'Dark Chocolate Chunks', 'Pure Cream'],
        nutrition: { calories: 210, fat: '11g', carbs: '24g', protein: '4g', sugar: '18g' },
        allergens: ['Milk', 'Soy'],
        isAvailable: true
      },
      {
        id: 'prod-12',
        name: 'Salted Caramel Crunch',
        description: 'Handmade burnt sugar caramel churned with pink Himalayan sea salt and toasted almond brittle.',
        price: 215,
        discount: 10,
        images: [
          'https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&q=80&w=800'
        ],
        rating: 4.8,
        reviewsCount: 160,
        category: 'Premium',
        stock: 40,
        sizes: ['Single Scoop', 'Double Scoop', 'Pint (500ml)'],
        ingredients: ['Salted Caramel Sauce', 'Himalayan Pink Salt', 'Almond Brittle'],
        nutrition: { calories: 250, fat: '14g', carbs: '28g', protein: '4g', sugar: '22g' },
        allergens: ['Milk', 'Tree Nuts'],
        isBestseller: true,
        isAvailable: true
      },
      {
        id: 'prod-13',
        name: 'Strawberry Bliss Shortcake',
        description: 'Real farm-picked strawberries layered with soft graham cracker shortcake bits and vanilla cream.',
        price: 200,
        discount: 5,
        images: [
          'https://images.unsplash.com/photo-1557142046-c704a3adf364?auto=format&fit=crop&q=80&w=800'
        ],
        rating: 4.8,
        reviewsCount: 112,
        category: 'Fruit',
        stock: 30,
        sizes: ['Single Scoop', 'Double Scoop', 'Pint (500ml)'],
        ingredients: ['Strawberries', 'Graham Cracker', 'Cream', 'Sugar'],
        nutrition: { calories: 210, fat: '10g', carbs: '27g', protein: '3g', sugar: '20g' },
        allergens: ['Milk', 'Gluten'],
        isAvailable: true
      },
      {
        id: 'prod-14',
        name: 'Brownie Fudge Volcano Sundae',
        description: 'Warm double chocolate brownie topped with two scoops of Dark Belgian Fudge, hot chocolate lava sauce, and roasted cashews.',
        price: 280,
        discount: 15,
        images: [
          'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800'
        ],
        rating: 5.0,
        reviewsCount: 198,
        category: 'Sundaes',
        stock: 20,
        sizes: ['Sundae Bowl'],
        ingredients: ['Chocolate Brownie', 'Belgian Fudge Ice Cream', 'Hot Fudge', 'Cashews'],
        nutrition: { calories: 520, fat: '28g', carbs: '62g', protein: '9g', sugar: '45g' },
        allergens: ['Milk', 'Gluten', 'Tree Nuts', 'Soy'],
        isBestseller: true,
        isAvailable: true
      },
      {
        id: 'prod-15',
        name: 'Vegan Almond Matcha Green Tea',
        description: 'Authentic Kyoto ceremonial matcha green tea churned with almond milk and toasted sesame crunch.',
        price: 210,
        discount: 0,
        images: [
          'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=800'
        ],
        rating: 4.6,
        reviewsCount: 52,
        category: 'Vegan',
        stock: 25,
        sizes: ['Single Scoop', 'Double Scoop', 'Pint (500ml)'],
        ingredients: ['Almond Milk', 'Matcha Green Tea', 'Agave', 'Tapioca'],
        nutrition: { calories: 160, fat: '7g', carbs: '20g', protein: '3g', sugar: '14g' },
        allergens: ['Tree Nuts (Almond)'],
        isVegan: true,
        isDairyFree: true,
        isAvailable: true
      },
      {
        id: 'prod-16',
        name: 'Blueberry Cheesecake Deluxe',
        description: 'Cream cheese base swirled with wild mountain blueberry preserve and buttery biscuit crumble.',
        price: 220,
        discount: 10,
        images: [
          'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=800'
        ],
        rating: 4.9,
        reviewsCount: 175,
        category: 'Premium',
        stock: 35,
        sizes: ['Single Scoop', 'Double Scoop', 'Pint (500ml)'],
        ingredients: ['Cream Cheese', 'Blueberries', 'Biscuit Crumble', 'Milk'],
        nutrition: { calories: 240, fat: '13g', carbs: '28g', protein: '4g', sugar: '21g' },
        allergens: ['Milk', 'Gluten'],
        isBestseller: true,
        isAvailable: true
      },
      {
        id: 'prod-17',
        name: 'Sugar-Free Berry Acai Blast',
        description: 'Antioxidant rich acai berry and raspberry sorbet naturally sweetened with monk fruit.',
        price: 195,
        discount: 5,
        images: [
          'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&q=80&w=800'
        ],
        rating: 4.7,
        reviewsCount: 41,
        category: 'Sugar-Free',
        stock: 20,
        sizes: ['Single Scoop', 'Double Scoop', 'Pint (500ml)'],
        ingredients: ['Acai Berries', 'Raspberries', 'Monk Fruit', 'Water'],
        nutrition: { calories: 90, fat: '1g', carbs: '15g', protein: '1g', sugar: '2g' },
        allergens: [],
        isSugarFree: true,
        isVegan: true,
        isDairyFree: true,
        isAvailable: true
      },
      {
        id: 'prod-18',
        name: 'Triple Chocolate Cookie Dough',
        description: 'Rich chocolate ice cream with soft edible cookie dough chunks and dark chocolate chips.',
        price: 205,
        discount: 10,
        images: [
          'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?auto=format&fit=crop&q=80&w=800'
        ],
        rating: 4.8,
        reviewsCount: 130,
        category: 'Cookies & Cream',
        stock: 35,
        sizes: ['Single Scoop', 'Double Scoop', 'Pint (500ml)'],
        ingredients: ['Chocolate Base', 'Cookie Dough Bites', 'Chocolate Chips'],
        nutrition: { calories: 260, fat: '14g', carbs: '32g', protein: '5g', sugar: '24g' },
        allergens: ['Milk', 'Gluten', 'Soy'],
        isAvailable: true
      },
      {
        id: 'prod-19',
        name: 'Spiced Festive Eggnog & Rum (Seasonal)',
        description: 'Holiday special! Creamy eggnog custard infused with spiced nutmeg, cinnamon, and non-alcoholic rum flavor.',
        price: 210,
        discount: 0,
        images: [
          'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800'
        ],
        rating: 4.8,
        reviewsCount: 62,
        category: 'Seasonal',
        stock: 20,
        sizes: ['Single Scoop', 'Double Scoop', 'Pint (500ml)'],
        ingredients: ['Eggnog Base', 'Nutmeg', 'Cinnamon', 'Vanilla'],
        nutrition: { calories: 230, fat: '12g', carbs: '25g', protein: '4g', sugar: '20g' },
        allergens: ['Milk', 'Egg'],
        isNew: true,
        isAvailable: true
      },
      {
        id: 'prod-20',
        name: 'Couple Sundae Duo Combo',
        description: '2 x Signature Sundaes of choice + 2 x Fresh Baked Chocolate Waffle Cones.',
        price: 499,
        discount: 20,
        images: [
          'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800'
        ],
        rating: 4.9,
        reviewsCount: 205,
        category: 'Combos',
        stock: 25,
        sizes: ['Duo Pack'],
        ingredients: ['Choice of Sundaes', 'Waffle Cones'],
        nutrition: { calories: 800, fat: '40g', carbs: '90g', protein: '14g', sugar: '70g' },
        allergens: ['Milk', 'Gluten', 'Soy', 'Tree Nuts'],
        isBestseller: true,
        isAvailable: true
      }
    ];

    // 2. Initial Users
    this.users = [
      {
        id: 'usr-customer',
        name: 'Ananya Sharma',
        email: 'ananya@example.com',
        mobile: '+91 98765 43210',
        role: 'CUSTOMER',
        sweetPoints: 340,
        tier: 'Scoop Lover',
        addresses: [
          {
            id: 'addr-1',
            type: 'Home',
            name: 'Ananya Sharma',
            phone: '+91 98765 43210',
            house: 'Flat 402, Rosewood Heights',
            street: 'MG Road, Indiranagar',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560038',
            landmark: 'Near Metro Station',
            isDefault: true
          },
          {
            id: 'addr-2',
            type: 'Work',
            name: 'Ananya Sharma',
            phone: '+91 98765 43210',
            house: 'Tech Park Tower B, 3rd Floor',
            street: 'Outer Ring Road, Marathahalli',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560103'
          }
        ],
        wishlist: ['prod-2', 'prod-4', 'prod-9'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr-admin',
        name: 'Chief Scoop Officer (Admin)',
        email: 'admin@sweetscoop.com',
        mobile: '+91 90000 00000',
        role: 'ADMIN',
        sweetPoints: 1000,
        tier: 'Scoop VIP',
        addresses: [],
        wishlist: [],
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr-kitchen',
        name: 'Chef Ramesh (Kitchen Lead)',
        email: 'kitchen@sweetscoop.com',
        mobile: '+91 91111 11111',
        role: 'KITCHEN_STAFF',
        sweetPoints: 0,
        tier: 'Scoop Starter',
        addresses: [],
        wishlist: [],
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr-delivery',
        name: 'Vikram Singh (Express Delivery)',
        email: 'delivery@sweetscoop.com',
        mobile: '+91 92222 22222',
        role: 'DELIVERY_STAFF',
        sweetPoints: 0,
        tier: 'Scoop Starter',
        addresses: [],
        wishlist: [],
        createdAt: new Date().toISOString()
      }
    ];

    // 3. Coupons
    this.coupons = [
      {
        code: 'SCOOP20',
        description: 'Get 20% OFF on all orders above ₹300',
        discountType: 'PERCENT',
        discountValue: 20,
        minOrder: 300,
        maxDiscount: 150,
        expiryDate: '2026-12-31',
        usageLimit: 1000
      },
      {
        code: 'WELCOME50',
        description: 'Flat ₹50 OFF on your first Sweet Scoop purchase',
        discountType: 'FLAT',
        discountValue: 50,
        minOrder: 200,
        maxDiscount: 50,
        expiryDate: '2026-12-31',
        usageLimit: 500
      },
      {
        code: 'SWEETVIP',
        description: 'Exclusive 25% OFF for Scoop VIP Members',
        discountType: 'PERCENT',
        discountValue: 25,
        minOrder: 400,
        maxDiscount: 200,
        expiryDate: '2026-12-31',
        usageLimit: 200
      }
    ];

    // 4. Initial Stores
    this.stores = [
      {
        id: 'store-1',
        name: 'Sweet Scoop Flagship - Indiranagar',
        address: '100 Feet Road, Indiranagar',
        city: 'Bengaluru',
        distance: '1.2 km',
        phone: '+91 80 4123 4567',
        openingHours: '10:00 AM - 11:30 PM (Everyday)',
        lat: 12.9784,
        lng: 77.6408
      },
      {
        id: 'store-2',
        name: 'Sweet Scoop - Koramangala 5th Block',
        address: '80 Feet Road, Opp. Sony Center, Koramangala',
        city: 'Bengaluru',
        distance: '3.8 km',
        phone: '+91 80 4123 9999',
        openingHours: '10:00 AM - 12:00 AM (Midnight)',
        lat: 12.9352,
        lng: 77.6245
      },
      {
        id: 'store-3',
        name: 'Sweet Scoop - Whitefield Main Road',
        address: 'Forum Neighborhood Mall, Whitefield',
        city: 'Bengaluru',
        distance: '7.5 km',
        phone: '+91 80 4123 8888',
        openingHours: '11:00 AM - 11:00 PM',
        lat: 12.9698,
        lng: 77.7499
      }
    ];

    // 5. Initial Reviews
    this.reviews = [
      {
        id: 'rev-1',
        productId: 'prod-1',
        userId: 'usr-1',
        userName: 'Priya N.',
        rating: 5,
        comment: 'You can actually see real vanilla specks! The creaminess is unbelievable, not overly sweet.',
        date: '2 days ago',
        verifiedPurchase: true
      },
      {
        id: 'rev-2',
        productId: 'prod-2',
        userId: 'usr-2',
        userName: 'Rahul M.',
        rating: 5,
        comment: 'Best dark chocolate fudge ice cream in town. Extremely decadent!',
        date: '1 week ago',
        verifiedPurchase: true
      },
      {
        id: 'rev-3',
        productId: 'prod-4',
        userId: 'usr-3',
        userName: 'Siddharth K.',
        rating: 5,
        comment: 'The saffron cardamom aroma with toasted pistachios is pure luxury.',
        date: '3 days ago',
        verifiedPurchase: true
      }
    ];

    // 6. Initial Inventory
    this.inventory = [
      { id: 'inv-1', name: 'Madagascar Vanilla Tub Base', category: 'Ice Cream Tubs', stockQuantity: 45, unit: 'tubs (1L)', reorderLevel: 10, status: 'Available', lastRestocked: 'Yesterday' },
      { id: 'inv-2', name: 'Belgian Dark Chocolate Tub Base', category: 'Ice Cream Tubs', stockQuantity: 38, unit: 'tubs (1L)', reorderLevel: 10, status: 'Available', lastRestocked: 'Yesterday' },
      { id: 'inv-3', name: 'Artisanal Waffle Cones', category: 'Cones & Cups', stockQuantity: 240, unit: 'pcs', reorderLevel: 50, status: 'Available', lastRestocked: '3 days ago' },
      { id: 'inv-4', name: 'Hot Fudge Sauce Jar', category: 'Toppings', stockQuantity: 12, unit: 'jars', reorderLevel: 15, status: 'Low Stock', lastRestocked: '1 week ago' },
      { id: 'inv-5', name: 'Oreo Crumbles', category: 'Toppings', stockQuantity: 5, unit: 'kg', reorderLevel: 10, status: 'Low Stock', lastRestocked: '5 days ago' },
      { id: 'inv-6', name: 'Maraschino Cherries', category: 'Toppings', stockQuantity: 2, unit: 'jars', reorderLevel: 5, status: 'Low Stock', lastRestocked: '1 week ago' }
    ];

    // 7. Initial Orders
    this.orders = [
      {
        id: 'ORD-SS1024',
        userId: 'usr-customer',
        customerName: 'Ananya Sharma',
        customerPhone: '+91 98765 43210',
        customerEmail: 'ananya@example.com',
        items: [
          { id: 'i1', name: 'Double Dark Belgian Fudge', quantity: 2, unitPrice: 178.5, totalPrice: 357, details: 'Double Scoop - Waffle Cone + Hot Fudge', image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&q=80&w=800' },
          { id: 'i2', name: 'Fresh Alphonso Mango Swirl', quantity: 1, unitPrice: 195, totalPrice: 195, details: 'Single Scoop - Classic Cup', image: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?auto=format&fit=crop&q=80&w=800' }
        ],
        subtotal: 552,
        deliveryCharge: 30,
        discount: 50,
        tax: 25,
        pointsDiscount: 0,
        total: 557,
        deliveryAddress: {
          id: 'addr-1',
          type: 'Home',
          name: 'Ananya Sharma',
          phone: '+91 98765 43210',
          house: 'Flat 402, Rosewood Heights',
          street: 'MG Road, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038'
        },
        deliveryType: 'Express',
        storeName: 'Sweet Scoop Flagship - Indiranagar',
        paymentMethod: 'UPI',
        paymentStatus: 'SUCCESS',
        transactionId: 'UPI-982301928301',
        orderStatus: 'Out for Delivery',
        createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        estimatedDelivery: '15-20 Mins',
        deliveryPartnerName: 'Vikram Singh',
        deliveryPartnerPhone: '+91 92222 22222'
      },
      {
        id: 'ORD-SS1020',
        userId: 'usr-customer',
        customerName: 'Ananya Sharma',
        customerPhone: '+91 98765 43210',
        customerEmail: 'ananya@example.com',
        items: [
          { id: 'i3', name: 'Royal Nutty Sundae Supreme', quantity: 1, unitPrice: 232, totalPrice: 232, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=800' }
        ],
        subtotal: 232,
        deliveryCharge: 30,
        discount: 0,
        tax: 12,
        pointsDiscount: 20,
        total: 254,
        deliveryAddress: {
          id: 'addr-1',
          type: 'Home',
          name: 'Ananya Sharma',
          phone: '+91 98765 43210',
          house: 'Flat 402, Rosewood Heights',
          street: 'MG Road, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038'
        },
        deliveryType: 'Standard',
        storeName: 'Sweet Scoop Flagship - Indiranagar',
        paymentMethod: 'Credit/Debit Card',
        paymentStatus: 'SUCCESS',
        transactionId: 'PAY-882039102',
        orderStatus: 'Delivered',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedDelivery: 'Delivered'
      }
    ];

    // 8. Initial Subscriptions
    this.subscriptions = [
      {
        id: 'sub-1',
        userId: 'usr-customer',
        planName: 'Weekly Delight (2 Tubs/wk)',
        type: 'Weekly',
        price: 349,
        status: 'ACTIVE',
        startDate: '2026-07-15',
        nextDeliveryDate: '2026-08-12',
        deliveriesCompleted: 3,
        favoriteFlavors: ['Madagascar Vanilla Bean', 'Double Dark Belgian Fudge']
      }
    ];

    // 9. Initial Notifications
    this.notifications = [
      {
        id: 'notif-1',
        userId: 'usr-customer',
        title: 'Order Out for Delivery! 🍦',
        message: 'Order #ORD-SS1024 is on its way with Vikram Singh. Track live on map!',
        type: 'order',
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'notif-2',
        userId: 'usr-customer',
        title: 'Sweet Points Earned! 🎉',
        message: 'You earned 55 Sweet Points on your recent purchase.',
        type: 'point',
        read: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // 10. Initial Staff
    this.staff = [
      { id: 'stf-1', name: 'Ramesh Kumar', email: 'ramesh@sweetscoop.com', phone: '+91 91111 11111', role: 'KITCHEN_STAFF', status: 'ACTIVE', assignedZone: 'Indiranagar Kitchen', joinedDate: '2025-01-10' },
      { id: 'stf-2', name: 'Vikram Singh', email: 'vikram@sweetscoop.com', phone: '+91 92222 22222', role: 'DELIVERY_STAFF', status: 'ACTIVE', assignedZone: 'Indiranagar Express', joinedDate: '2025-02-01' },
      { id: 'stf-3', name: 'Meera Rao', email: 'meera@sweetscoop.com', phone: '+91 93333 33333', role: 'MANAGER', status: 'ACTIVE', assignedZone: 'Koramangala Branch', joinedDate: '2024-11-15' }
    ];
  }

  // Helper Getters & Mutators
  getProducts(query?: { category?: string; search?: string; vegan?: boolean; sugarFree?: boolean; bestseller?: boolean; sort?: string }) {
    let result = [...this.products];
    if (query?.category && query.category !== 'All') {
      const catLower = query.category.toLowerCase();
      if (catLower === 'vegan' || catLower.includes('plant-based')) {
        result = result.filter(p => p.isVegan || p.category.toLowerCase() === 'vegan');
      } else if (catLower === 'sugar-free' || catLower.includes('keto')) {
        result = result.filter(p => p.isSugarFree || p.category.toLowerCase() === 'sugar-free');
      } else if (catLower === 'cookies & cream' || catLower.includes('cookies')) {
        result = result.filter(p => p.category.toLowerCase().includes('cookie'));
      } else {
        result = result.filter(p => p.category.toLowerCase() === catLower || p.category.toLowerCase().includes(catLower));
      }
    }
    if (query?.search) {
      const q = query.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.ingredients.some(i => i.toLowerCase().includes(q))
      );
    }
    if (query?.vegan) result = result.filter(p => p.isVegan);
    if (query?.sugarFree) result = result.filter(p => p.isSugarFree);
    if (query?.bestseller) result = result.filter(p => p.isBestseller);

    const getFinalPrice = (p: Product) => Math.round(p.price * (1 - (p.discount || 0) / 100));

    if (query?.sort) {
      if (query.sort === 'price-low') result.sort((a, b) => getFinalPrice(a) - getFinalPrice(b));
      if (query.sort === 'price-high') result.sort((a, b) => getFinalPrice(b) - getFinalPrice(a));
      if (query.sort === 'rating') result.sort((a, b) => b.rating - a.rating);
      if (query.sort === 'newest') result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }
    return result;
  }

  getProductById(id: string) {
    return this.products.find(p => p.id === id);
  }

  createProduct(productData: Omit<Product, 'id'>) {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>) {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.products[idx] = { ...this.products[idx], ...updates };
      return this.products[idx];
    }
    return null;
  }

  deleteProduct(id: string) {
    this.products = this.products.filter(p => p.id !== id);
    return true;
  }

  getUsers() { return this.users; }
  getUserById(id: string) { return this.users.find(u => u.id === id); }
  getUserByEmail(email: string) { return this.users.find(u => u.email.toLowerCase() === email.toLowerCase()); }
  createUser(userData: Omit<User, 'id'>) {
    const newUser: User = { ...userData, id: `usr-${Date.now()}` };
    this.users.push(newUser);
    return newUser;
  }

  getOrders(userId?: string) {
    if (userId) return this.orders.filter(o => o.userId === userId);
    return this.orders;
  }

  getOrderById(id: string) {
    return this.orders.find(o => o.id === id);
  }

  createOrder(orderData: Omit<Order, 'id' | 'createdAt'>) {
    const id = `ORD-SS${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id,
      createdAt: new Date().toISOString()
    };
    this.orders.unshift(newOrder);

    // Award Sweet Points: 10 points per ₹100 spent
    const earnedPoints = Math.floor(newOrder.total / 10);
    const user = this.getUserById(newOrder.userId);
    if (user) {
      user.sweetPoints += earnedPoints;
      // Upgrade Tier
      if (user.sweetPoints > 500) user.tier = 'Scoop VIP';
      else if (user.sweetPoints > 200) user.tier = 'Scoop Lover';

      // Push notification
      this.notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: user.id,
        title: 'Order Confirmed! 🍦',
        message: `Order #${id} confirmed! You earned ${earnedPoints} Sweet Points.`,
        type: 'order',
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    return newOrder;
  }

  updateOrderStatus(id: string, status: Order['orderStatus']) {
    const order = this.getOrderById(id);
    if (order) {
      order.orderStatus = status;
      this.notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: order.userId,
        title: `Order Status Update: ${status}`,
        message: `Your Sweet Scoop order #${order.id} is now ${status}.`,
        type: 'order',
        read: false,
        createdAt: new Date().toISOString()
      });
      return order;
    }
    return null;
  }

  getCoupons() { return this.coupons; }
  validateCoupon(code: string, subtotal: number) {
    const coupon = this.coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (!coupon) return { valid: false, message: 'Invalid coupon code' };
    if (subtotal < coupon.minOrder) {
      return { valid: false, message: `Minimum order amount of ₹${coupon.minOrder} required for coupon ${coupon.code}` };
    }
    let discount = 0;
    if (coupon.discountType === 'PERCENT') {
      discount = Math.min((subtotal * coupon.discountValue) / 100, coupon.maxDiscount);
    } else {
      discount = coupon.discountValue;
    }
    return { valid: true, coupon, discountAmount: discount };
  }

  getReviews(productId?: string) {
    if (productId) return this.reviews.filter(r => r.productId === productId);
    return this.reviews;
  }

  addReview(reviewData: Omit<Review, 'id' | 'date'>) {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Just now'
    };
    this.reviews.unshift(newReview);
    return newReview;
  }

  getStores() { return this.stores; }
  getInventory() { return this.inventory; }
  updateInventory(id: string, quantity: number) {
    const item = this.inventory.find(i => i.id === id);
    if (item) {
      item.stockQuantity = quantity;
      item.status = quantity === 0 ? 'Out of Stock' : quantity <= item.reorderLevel ? 'Low Stock' : 'Available';
    }
    return item;
  }

  getSubscriptions(userId: string) {
    return this.subscriptions.filter(s => s.userId === userId);
  }

  getNotifications(userId: string) {
    return this.notifications.filter(n => n.userId === userId);
  }

  getStaff() { return this.staff; }
  addStaff(staffData: Omit<Staff, 'id' | 'joinedDate'>) {
    const newStaff: Staff = {
      ...staffData,
      id: `stf-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    this.staff.push(newStaff);
    return newStaff;
  }

  getAnalytics() {
    const totalOrders = this.orders.length;
    const totalRevenue = this.orders.reduce((sum, o) => sum + (o.paymentStatus === 'SUCCESS' ? o.total : 0), 0);
    const pendingOrders = this.orders.filter(o => ['Order Placed', 'Confirmed', 'Preparing'].includes(o.orderStatus)).length;
    const totalCustomers = this.users.filter(u => u.role === 'CUSTOMER').length;

    return {
      totalRevenue,
      totalOrders,
      pendingOrders,
      totalCustomers,
      dailySales: [
        { day: 'Mon', sales: 4200 },
        { day: 'Tue', sales: 5100 },
        { day: 'Wed', sales: 6300 },
        { day: 'Thu', sales: 5900 },
        { day: 'Fri', sales: 8400 },
        { day: 'Sat', sales: 11200 },
        { day: 'Sun', sales: 13500 }
      ],
      popularFlavors: [
        { name: 'Belgian Dark Fudge', percentage: 32 },
        { name: 'Madagascar Vanilla', percentage: 24 },
        { name: 'Alphonso Mango', percentage: 18 },
        { name: 'Roasted Pistachio', percentage: 14 },
        { name: 'Cookies & Cream', percentage: 12 }
      ]
    };
  }
}

export const db = new Database();
