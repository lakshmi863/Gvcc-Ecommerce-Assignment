const db = require('./src/config/db');

console.log("Initializing Database...");

// 1. DEFINE TABLE CREATION & SEEDING LOGIC
db.serialize(() => {
  // Create Products Table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT,
      short_desc TEXT,
      long_desc TEXT,
      price DECIMAL(10, 2),
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error("Error creating products table:", err.message);
    else console.log("Products table check: OK");
  });

  // Create Enquiries Table
  db.run(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `, (err) => {
    if (err) console.error("Error creating enquiries table:", err.message);
    else console.log("Enquiries table check: OK");

    // AFTER TABLES ARE CREATED, RUN SEED
    checkAndSeedData();
  });
});

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error("Error creating users table:", err.message);
    else console.log("Users table check: OK");
  });

// 2. HELPER FUNCTIONS
function checkAndSeedData() {
  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (row && row.count === 0) {
      console.log("Database empty. Seeding data...");
      seedDatabase();
    } else {
      console.log("Database already has data. Skipping seed.");
    }
  });
}

function seedDatabase() {
  const stmt = db.prepare("INSERT INTO products (name, category, short_desc, long_desc, price, image_url) VALUES (?, ?, ?, ?, ?, ?)");
  
  // Flatten the nested object into a simple array of products
  const flatList = [];
  
  // Recursive function to dig through categories
  function extractProducts(data) {
    for (const key in data) {
      if (Array.isArray(data[key]) && Array.isArray(data[key][0])) {
        // We found an array of products (e.g., Audio, Books)
        flatList.push(...data[key]);
      } else if (typeof data[key] === 'object') {
        // Go deeper (e.g., Electronics -> Audio)
        extractProducts(data[key]);
      }
    }
  }

  extractProducts(productsData);

  // Insert everyone
  flatList.forEach(prod => {
    stmt.run(prod, (err) => {
      if (err) console.error("Insert Error: " + prod[0], err.message);
    });
  });

  stmt.finalize();
  console.log(`Seeding complete. Inserted ${flatList.length} products.`);
}

// --- DATA STRUCTURE ---
const productsData = {
  
  Electronics: {
    Electronics:[[
        "Marshall Emberton II Portable Speaker",
        "Electronics",
        "Iconic British design with 360° sound, 30+ hours of battery life, and IP67 dust/water resistance.",
        `Product Description – Marshall Emberton II

        Rich, clear, and loud, like the artist intended. Emberton II utilises True Stereophonic, a unique form of multi-directional sound from Marshall. Experience absolute 360° sound where every spot is a sweet spot. With 30+ hours of playtime and a durable IP67 rating, it’s built for the road.

        Specifications:
        Battery: 30+ Hours
        Charging: USB-C (20 min charge = 4 hours play)
        Waterproof: IP67
        Bluetooth: 5.1 with Stack Mode`,
        17499,
        "https://www.jiomart.com/images/product/original/493285633/marshall-emberton-2-bluetooth-wireless-speaker-more-than-30-hrs-of-playtime-ip67-dust-water-resistance-black-and-brass-digital-o493285633-p593408562-6-202511220129.jpeg"
      ],
      [
        "Apple AirPods Pro (2nd Gen) USB-C",
        "Electronics",
        "The ultimate wireless earbuds with 2x Active Noise Cancellation, Transparency mode, and Personalized Spatial Audio.",
        `Product Description – AirPods Pro (2nd Gen)

        Re-engineered for even richer audio experiences. The H2 chip powers smarter noise cancellation and three-dimensional sound. The MagSafe Charging Case (USB-C) features Precision Finding, a built-in speaker, and a lanyard loop.

        Features:
        Chip: Apple H2 Headphone Chip
        Audio: Adaptive EQ, Spatial Audio
        Battery: Up to 6 hours listening time
        Case: MagSafe + USB-C Charging`,
        24900,
        "https://m.media-amazon.com/images/I/61SUj2aKoEL._SL1500_.jpg"
      ],
      [
        "LG C3 55-Inch 4K OLED evo TV",
        "Electronics",
        "The gold standard in picture quality with self-lit OLED pixels, 100% color fidelity, and 120Hz refresh rate for gaming.",
        `Product Description – LG OLED evo C3

        Experience the pinnacle of TV technology. LG OLED's self-lit pixels turn on and off independently to achieve perfect black and infinite contrast. Powered by the α9 AI Processor Gen6, it enhances objects in the foreground and background for natural depth.

        Specifications:
        Display: 4K OLED (120Hz)
        Gaming: G-Sync, FreeSync Premium, VRR
        Sound: Dolby Atmos & Vision
        Smart: WebOS 23 with ThinQ AI`,
        114990,
        "https://www.lg.com/content/dam/channel/wcms/sg/images/tv/features/oled2023/TV-OLED-C3-18-SC9-Soundbar-Mobile.jpg"
      ],
      [
        "Sony HT-S40R 5.1ch Home Cinema",
        "Electronics",
        "Real 5.1 channel surround sound with wireless rear speakers and a 600W total power output.",
        `Product Description – Sony HT-S40R

        Bring every movie to life. The HT-S40R features a three-channel bar speaker, a wired subwoofer, and wireless rear speakers that combine to deliver huge, full-frequency sound. The wireless amplifier powering the rear speakers implies there are no wires between the front and the back of your room.

        Specifications:
        Power: 600W Total Output
        Channels: 5.1 Real Surround
        Connectivity: HDMI ARC, Optical, Bluetooth, USB`,
        24990,
        "https://m.media-amazon.com/images/I/416y4pV8DgL._AC_UF1000,1000_QL80_.jpg"
      ],
      [
        "Google Pixel 8 (128 GB)",
        "Electronics",
        "The helpful phone engineered by Google. Amazing camera, powerful security, and the new Google Tensor G3 chip.",
        `Product Description – Google Pixel 8

        Meet Pixel 8. The helpful phone with an amazing camera, powerful security, and an all-day battery. With Google AI, you can do more, even faster – like fix photos, screen calls, and get answers. The Actua display is twice as bright as the Pixel 7.

        Specifications:
        Display: 6.2-inch Actua OLED (120Hz)
        Processor: Google Tensor G3
        Camera: 50MP Wide + 12MP Ultrawide
        AI Features: Magic Eraser, Best Take, Audio Magic Eraser`,
        62999,
        "https://m.media-amazon.com/images/I/61iLQG-KbLL.jpg"
      ],
      [
        "Nothing Phone (2) 5G",
        "Electronics",
        "Uniquely designed with the Glyph Interface, transparent back, and Snapdragon 8+ Gen 1 performance.",
        `Product Description – Nothing Phone (2)

        Come to the bright side. The Nothing Phone (2) features the new Glyph Interface that lets you assign different light and sound sequences for each contact and notification type. It is powered by the Snapdragon 8+ Gen 1 for blazingly fast speed.

        Specifications:
        RAM: 12GB
        Storage: 256GB
        Display: 6.7” LTPO OLED
        OS: Nothing OS 2.0 (Clean Android experience)`,
        36999,
        "https://fdn2.gsmarena.com/vv/bigpic/nothing-phone2_.jpg"
      ],
      [
        "Lenovo Legion Slim 5 AI Gaming Laptop",
        "Electronics",
        "A portable gaming powerhouse with AMD Ryzen 7, NVIDIA RTX 4060, and an AI-tuned cooling system.",
        `Product Description – Lenovo Legion Slim 5

        Decimate the competition. The Legion Slim 5 is built for gamers who need portability without sacrificing power. It features the AMD Ryzen 7 7840HS processor and NVIDIA GeForce RTX 4060 graphics. The Lenovo AI Engine+ with LA1 AI chip optimizes performance in real-time.

        Specifications:
        Display: 16" WQXGA (165Hz)
        GPU: RTX 4060 8GB GDDR6
        RAM: 16GB DDR5
        Storage: 1TB SSD`,
        104990,
        "https://rukminim2.flixcart.com/image/480/640/xif0q/computer/z/i/t/slim-5-gaming-laptop-lenovo-original-imagrzmfqyeeajhk.jpeg"
      ],
      [
        "Keychron K2 Wireless Mechanical Keyboard",
        "Electronics",
        "A compact 75% layout mechanical keyboard with Bluetooth connectivity for Mac and Windows users.",
        `Product Description – Keychron K2 (Version 2)

        The Keychron K2 is a super tactile wireless or wired keyboard giving you all the keys and function you need while keeping it compact. It has a battery life of up to 72 hours and connects with up to 3 devices via Bluetooth.

        Features:
        Switch Type: Gateron Brown (Tactile)
        Backlight: RGB
        Connectivity: Bluetooth 5.1 / USB Type-C
        Layout: 84 Keys (75%)`,
        8499,
        "https://m.media-amazon.com/images/I/61hiiYPHWvL._AC_UF1000,1000_QL80_.jpg"
      ],
      [
        "Sony PlayStation 5 Slim Console",
        "Electronics",
        "The world's most popular gaming console, now slimmer. Play like never before with 4K 120Hz graphics and Haptic Feedback.",
        `Product Description – PlayStation 5 Slim (Disc Edition)

        Experience lightning-fast loading with an ultra-high-speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio, and an all-new generation of incredible PlayStation games. The new Slim design packs the same power into a smaller form factor.

        Specifications:
        Storage: 1TB Custom SSD
        Output: 4K @ 120Hz, 8K Support
        Controller: DualSense Wireless Controller`,
        54990,
        "https://sm.pcmag.com/pcmag_me/review/s/sony-plays/sony-playstation-5-slim_myb3.jpg"
      ],
      [
        "DJI Mini 4 Pro Drone",
        "Electronics",
        "Under 249g ultra-light drone with 4K/60fps HDR video, omnidirectional obstacle sensing, and 20km transmission.",
        `Product Description – DJI Mini 4 Pro

        Go big with Mini. The DJI Mini 4 Pro is the most advanced mini-camera drone to date. It integrates powerful imaging capabilities, omnidirectional obstacle sensing, ActiveTrack 360° with the new Trace Mode, and 20km FHD video transmission.

        Specifications:
        Weight: < 249 g
        Flight Time: 34 Mins
        Camera: 4K/60fps HDR, Vertical Shooting
        Safety: Omnidirectional Obstacle Sensing`,
        99990,
        "https://m.media-amazon.com/images/I/6189cydQh8L.jpg"
      ]
    ],
    Audio: [
      [
        "JBL Tune Buds - True Wireless Earbuds",
        "Audio",
        "Pure Bass Sound TWS earbuds with Active Noise Cancelling and up to 48 hours of battery life.",
        `Product Overview – JBL Tune Buds (Active Noise Cancelling)

        Tackle your day one song at a time with the JBL Tune Buds. These true wireless earbuds give you up to 48 hours of exceptional JBL Pure Bass Sound, while the ergonomic, water and dust-resistant design gives you all-day comfort in any weather. A simple touch allows you to manage calls anywhere, without ambient noises.

        Color Options: Black, White, Blue, Purple

        Specifications:
        Driver Size: 10mm Dynamic Driver
        Playtime: Up to 12 hrs (Earbuds) + 36 hrs (Case)
        Bluetooth: Version 5.3 with LE Audio
        Noise Control: Active Noise Cancelling (ANC) with Smart Ambient
        Water Resistance: IP54 (Dust and Water Resistant)
        Mic: 4-Mic technology for crisp, clear calls

        Key Features:
        JBL Pure Bass Sound: Smartly designed drivers deliver pulsing beat.
        Smart Ambient: Hear more of what you want, less of what you don't. TalkThru lets you hear others without removing earbuds.
        Fast Charge: Speed charge for 15 mins to get 4 hours of playtime.
        Comfort Fit: Bud design ensures perfect isolation and secure fit.

        Benefits:
        Focus: Tune out the world with ANC when you need to study or work.
        Durability: Perfect for gym and outdoor runs due to sweat resistance.
        Clear Calls: Dual mics on each bud ensure your voice is heard clearly.`,
        5499,
        "https://microless.com/cdn/products/a5d537bc0bb7b4a6dc286258de7a12d6-hi.jpg"
      ],
      [
        "Sony WH-CH520 Wireless Headphones",
        "Audio",
        "Lightweight on-ear Bluetooth headphones with multipoint connection and massive 50-hour battery life.",
        `Product Description – Sony On-Ear Wireless Headphones

        Designed to be lightweight and comfortable for all-day use, the Sony WH-CH520 headphones give you high-quality sound and a battery that keeps going. With Multipoint connection, you can pair with two devices at once—perfect for switching between a laptop meeting and a phone call instantly.

        Color Options: Black, Blue, Beige, White

        Specifications:
        Type: On-Ear Wireless
        Battery Life: Up to 50 Hours
        Quick Charge: 3 mins charge = 1.5 hours play
        Bluetooth: Version 5.2 (Multipoint Supported)
        Weight: Ultra-lightweight (147g)
        Driver Unit: 30mm Closed Dynamic

        Design Features:
        Swivel design for compact carrying.
        Soft ear pads and adjustable headband cushion.
        Physical buttons for volume and track control.

        Benefits:
        Work From Home: Connect to PC and Phone simultaneously.
        Long Trips: 50-hour battery means you rarely need to charge.
        Custom Sound: Use the Sony Headphones Connect app to adjust EQ settings.
        Clear Voice: Built-in mic with noise suppression for online classes/calls.`,
        4490,
        "https://www.sony.jp/products/picture/WH-CH520.jpg"
      ],
      [
        "boAt Aavante Bar 1500+ Soundbar",
        "Audio",
        "A powerful 120W 2.1 channel home theater soundbar with a wired subwoofer for cinematic bass.",
        `Product Description – 120W Home Theater Soundbar

        Bring the cinema home with the boAt Aavante Bar 1500+. With a powerful 120W RMS output and a wired subwoofer, it delivers thumping bass and crystal-clear audio. Its sleek, premium design fits perfectly under your TV, transforming your living room into an entertainment hub.

        Color Options: Premium Black

        Specifications:
        Power Output: 120W RMS (60W Bar + 60W Subwoofer)
        Channel: 2.1 Surround Sound
        Subwoofer: Wired external subwoofer
        Connectivity: Bluetooth 5.0, HDMI (ARC), Optical, AUX, USB
        EQ Modes: Movies, Music, News, 3D

        Design:
        Sleek bar design that can be wall-mounted.
        Wooden subwoofer cabinet for rich bass resonance.
        LED display and side controls.

        Benefits:
        Immersive Audio: 2.1 channel sound separates left/right audio + dedicated bass.
        Multiple Connectivity: Connects easily to TV via HDMI ARC or Optical cable.
        Remote Control: Full-function master remote included.`,
        7999,
        "https://m.media-amazon.com/images/I/71Bl0ee2tEL._SL1500_.jpg"
      ],
      [
        "JBL Flip Essential 2 Bluetooth Speaker",
        "Audio",
        "Rugged and waterproof portable Bluetooth speaker delivering bold JBL Original Pro Sound.",
        `Product Description – Portable Waterproof Speaker

        Take your tunes on the go with the powerful JBL Flip Essential 2. Our lightweight Bluetooth speaker goes anywhere. Bad weather? Not to worry. With its waterproof design, you can rock out to our JBL Original Pro Sound rain or shine. Enjoy up to 10 hours of playtime for your favorite music.

        Color Options: Gunmetal Black

        Specifications:
        Output Power: 20W RMS
        Battery Life: Up to 10 Hours
        Charging Time: ~3 Hours (USB-C)
        Waterproof: IPX7 (Can be submerged in water)
        Bluetooth: Version 5.1
        Dimensions: 17.5 x 6.8 x 7 cm

        Design:
        Durable fabric material and rugged rubber housing.
        Cylindrical shape for wide sound dispersion.
        Simple button controls (Power, Bluetooth, Volume).

        Benefits:
        Pool Party Ready: IPX7 rating means it survives spills or drops in the pool.
        Room-Filling Sound: Surprisingly loud for its compact size.
        Portable: Fits easily in a backpack or water bottle holder.`,
        4999,
        "https://ntptechstore.com/wp-content/uploads/2024/12/JBL-Flip-Essential-2-Portable-Bluetooth-Speaker.png"
      ],
      [
        "boAt BassHeads 100 Wired Earphones",
        "Audio",
        "Iconic hawk-inspired wired earphones with powerful 10mm drivers and a built-in HD microphone.",
        `Product Description – BassHeads 100 In-Ear Wired Headphones

        The BassHeads 100 "Hawk" edition is the quintessential budget earphone for bass lovers. Its unique hawk-inspired shape allows for a comfortable fit while looking stylish. Equipped with 10mm dynamic drivers, it pumps out heavy bass and clear vocals, perfect for Bollywood tracks and daily commutes.

        Color Options: Black, White, Taffy Pink, Mint Orange

        Specifications:
        Driver Size: 10mm Dynamic
        Connector: 3.5mm Gold Plated Jack
        Microphone: In-line HD Mic
        Cable Length: 1.2 meters (Tangle-free coating)
        Impedance: 16 Ohms

        Design:
        Unique "Hawk" shape design.
        Ergonomic fit that doesn't fall out easily.
        Multifunction button (Play/Pause/Answer Call).

        Benefits:
        Super Extra Bass: Tuned specifically for Indian listeners who love bass.
        Clear Calls: Good quality mic for phone calls and Zoom meetings.
        Value for Money: Excellent durability and sound at an entry-level price.`,
        399,
        "https://m.media-amazon.com/images/S/aplus-media-library-service-media/e21c9772-b0b0-4bfe-880c-d2831beed748.__CR0,0,600,450_PT0_SX600_V1___.jpg"
      ]
    ],
    Smart_Technologies: [
      [
        "Echo Dot (5th Gen) Smart Speaker",
        "Smart_Technologies",
        "The latest smart speaker with Alexa, featuring deeper bass, motion detection, and voice control for your smart home.",
        `Product Overview – Echo Dot (5th Gen) with Alexa

        Make your home smarter with the best-sounding Echo Dot yet. This compact sphere delivers crisp vocals and deep bass. Just ask Alexa to play music, set alarms, check the weather, or control your smart lights and AC. It detects motion to turn on lights when you enter a room and speaks English & Hindi fluently.

        Color Options: Black, Cloud Blue, White

        Specifications:
        Audio: 1.73" front-firing speaker
        Microphone: Built-in off button (Privacy control)
        Sensors: Temperature, Ultrasound Motion Detection
        Connectivity: Dual-band Wi-Fi, Bluetooth Low Energy Mesh
        Voice Assistant: Amazon Alexa (Hands-free)

        Key Features:
        Voice Control: "Alexa, switch on the Geyser."
        Tap Controls: Tap the top to pause music or snooze alarms.
        Intercom: Use as an intercom to talk to other rooms.

        Benefits:
        Convenience: Manage your day without lifting a finger.
        Home Automation Hub: Acts as a bridge for compatible smart bulbs and plugs.
        Entertainment: Stream Spotify, JioSaavn, and Apple Music directly.`,
        5499,
        "https://m.media-amazon.com/images/G/35/kindle/journeys/Mvq9IW0GZYhQQxsK3yOI2P3mAwEpOFjw7I006Eo32BTY3D/Y2YwZDUxOWQt._CB608570751_.jpg"
      ],
      [
        "360° Smart Home Security Camera",
        "Smart_Technologies",
        "1080p Full HD Wi-Fi security camera with 360° pan-tilt, night vision, and two-way talk for total home protection.",
        `Product Description – 360° Pan-Tilt Wi-Fi Camera

        Keep an eye on your home, baby, or pets from anywhere in the world. This Smart Camera connects to your Wi-Fi and provides live video feeds to your phone. With AI Motion Detection, it alerts you immediately if it sees movement. The 360-degree rotating head ensures no blind spots.

        Specifications:
        Resolution: 1080p Full HD / 2K Pro (Model dependent)
        Field of View: 360° horizontal, 96° vertical
        Night Vision: Infrared (up to 30ft in total darkness)
        Storage: MicroSD Card (up to 128GB) or Cloud
        Audio: 2-Way Audio (Talk & Listen)
        Mounting: Tabletop or Ceiling (Inverted)

        Design:
        Compact dome shape.
        Privacy lens (physically covers lens when off).
        Silent motor rotation.

        Benefits:
        Remote Monitoring: Check in on elderly parents or pets while at work.
        Deterrent: Sound a siren alarm via the app if you see an intruder.
        Talk Back: Use the mic to talk to delivery agents or family members.
        Clear Night Vision: See clearly even with lights off.`,
        2999,
        "https://m.media-amazon.com/images/I/61ZiaOfR6lL._SL1500_.jpg"
      ],
      [
        "Smart Wi-Fi LED Bulb (16M Colors)",
        "Smart_Technologies",
        "Voice-controlled 9W smart bulb offering 16 million colors, dimmable white light, and schedule automation.",
        `Product Description – RGB Smart LED Bulb

        Set the perfect mood for any moment. This Smart Wi-Fi Bulb replaces your regular bulb and connects directly to your router—no hub required. Change colors for a party, dim the lights for movie night, or set a schedule to wake up gently with sunrise colors, all from your smartphone or via voice commands.

        Specifications:
        Wattage: 9W / 12W
        Socket: B22 (Indian Pin) or E27 (Screw)
        Colors: RGB (16 Million) + Tunable White (Warm to Cool)
        Connectivity: Wi-Fi 2.4GHz
        Lifespan: 25,000 Hours
        App Support: Wipro Smart / Smart Life / Tuya

        Features:
        Music Sync: Lights change beat to the music.
        Voice Control: Works with Alexa & Google Assistant.
        Grouping: Control all living room lights with one tap.

        Benefits:
        Energy Saving: Set timers to ensure lights turn off automatically.
        Mood Lighting: Cool white for studying, Warm yellow for relaxing, Purple for gaming.
        Remote Access: Turn on lights before you reach home for safety.`,
        699,
        "https://smartrevolutiongh.com/wp-content/uploads/2024/09/IMG_7367.jpg"
      ],
      [
        "Smart Health Tracking Ring",
        "Smart_Technologies",
        "A sleek, screen-free smart ring that tracks sleep, recovery, and heart rate with titanium durability.",
        `Product Description – Titanium Smart Ring

        The future of wearables is screen-less. This lightweight Smart Ring monitors your health 24/7 without the distraction of notifications. Made from fighter-jet grade titanium, it tracks your sleep stages, skin temperature, heart rate, and movement to provide a "Recovery Score" every morning.

        Color Options: Matte Black, Gold, Silver, Rose Gold

        Specifications:
        Material: Titanium Outer, Medical-grade Epoxy Inner
        Sensors: PPG Heart Rate, SpO2, Skin Temperature, Motion
        Water Resistance: up to 100m (Swim proof)
        Battery Life: 4 to 6 days
        Weight: Ultra-light (2 to 3 grams)

        Design:
        Looks like a regular premium jewelry ring.
        No vibrating motor or screen (Zero distraction).
        Hypoallergenic inner shell.

        Benefits:
        Detailed Sleep Data: More accurate sleep tracking than most watches.
        Comfort: Comfortable enough to wear to bed (unlike bulky watches).
        Holistic Health: Focuses on body recovery and readiness, not just steps.`,
        19999,
        "https://m.media-amazon.com/images/I/71XQpUD02lL._AC_SL1500_.jpg"
      ],
      [
        "Smart Wi-Fi Plug with Energy Monitor",
        "Smart_Technologies",
        "Turn heavy appliances smart with this 16A plug. Control ACs and Geysers remotely and monitor electricity usage.",
        `Product Description – 16A Smart Plug (Heavy Duty)

        Make your dumb appliances smart. This 16A Smart Plug is designed for heavy-load devices like Air Conditioners, Geysers (Water Heaters), and Microwaves. Plug your appliance into this, and you can turn it on/off from anywhere using your phone, set schedules, and even track how much electricity it consumes.

        Specifications:
        Rating: 16A (Suitable for Heavy Appliances)
        Voltage: 220-240V
        Connectivity: Wi-Fi 2.4GHz
        Material: Fire-retardant Polycarbonate
        Voice Support: Alexa / Google Assistant

        Key Features:
        Energy Monitoring: View daily/monthly power consumption graphs in the app.
        Scheduling: Set Geyser to turn on at 6:00 AM and off at 6:30 AM automatically.
        Countdown Timer: "Turn off AC in 30 minutes."

        Benefits:
        Safety: Never worry if you left the Geyser on; check app and turn it off.
        Savings: Monitor power usage to reduce electricity bills.
        Comfort: Turn on the AC 10 minutes before you reach home to cool the room.`,
        999,
        "https://m.media-amazon.com/images/I/41S-3dOjCRL.jpg"
      ]
    ],
    "Laptops_Accessories": [
      [
        "HP Victus Gaming Laptop (Ryzen 5)",
        "Laptops & Accessories",
        "A powerful mid-range gaming laptop featuring AMD Ryzen 5, NVIDIA RTX graphics, and a 144Hz high-refresh-rate display.",
        `Product Overview – HP Victus Gaming Laptop 15

        Built for play and engineered for performance. The HP Victus 15 allows you to experience high-grade gaming with the AMD Ryzen 5 Hexa-Core processor and NVIDIA GeForce RTX graphics. Its updated thermal design keeps things cool during intense gaming sessions, while the OMEN Gaming Hub allows you to control every performance detail.

        Specifications:
        Processor: AMD Ryzen 5 5600H (up to 4.2 GHz)
        Graphics: NVIDIA GeForce RTX 3050 (4GB GDDR6 dedicated)
        RAM: 8GB / 16GB DDR4 (Expandable to 32GB)
        Storage: 512GB PCIe Gen4 NVMe M.2 SSD
        Display: 15.6-inch FHD (1920 x 1080), 144Hz, 9ms response time
        Battery: 52.5 Wh Li-ion polymer
        OS: Windows 11 Home

        Key Features:
        High Refresh Rate: 144Hz screen ensures smooth gameplay without ghosting.
        Cooling System: Enhanced airflow with dual fans and wide rear vents.
        Backlit Keyboard: Integrated numeric keypad and super-responsive keys.

        Benefits:
        Multitasking: Capable of handling video editing and gaming simultaneously.
        Fast Loading: NVMe SSD ensures games load in seconds.
        Portability: Relatively slim profile for a gaming laptop (2.29 kg).`,
        58999,
        "https://microless.com/cdn/products/5c3af96ba2a60b122435a562bf2568a7-hi.jpg"
      ],
      [
        "Apple MacBook Air M2 (13.6-inch)",
        "Laptops_Accessories",
        "The ultra-thin and light MacBook Air supercharged by the M2 chip, offering 18 hours of battery life and a stunning Liquid Retina display.",
        `Product Description – MacBook Air M2 Chip

        Don’t take it lightly. The redesigned MacBook Air is supercharged by the next-generation M2 chip, giving you exceptional speed and power efficiency within a durable all-aluminum enclosure. Whether you are editing 4K video, coding, or just browsing, it handles it all silently without a fan.

        Color Options: Midnight (Dark Blue), Starlight (Champagne Gold), Space Grey, Silver

        Specifications:
        Chip: Apple M2 (8-core CPU, 8-core GPU)
        RAM: 8GB Unified Memory (Configurable to 24GB)
        Storage: 256GB / 512GB SSD
        Display: 13.6-inch Liquid Retina with True Tone
        Battery: Up to 18 hours video playback
        Weight: 1.24 kg
        Charging: MagSafe 3 dedicated charging port

        Key Features:
        Silent Design: No fan means it runs completely silent.
        Camera: 1080p FaceTime HD camera for clear video calls.
        Touch ID: Fingerprint sensor embedded in the power key for security.

        Benefits:
        All-Day Battery: Forget your charger at home; it lasts a full workday.
        Ecosystem: Copy text on your iPhone and paste it on your Mac instantly.
        Performance: Up to 1.4x faster than the previous M1 model.`,
        99900,
        "https://shopdunk.com/images/thumbs/0005888_air-m2-silver_1600.jpeg"
      ],
      [
        "ASUS Vivobook 16 (2024 Model)",
        "Laptops_Accessories",
        "A sleek, large-screen budget laptop perfect for students and office work, featuring a 180° hinge and antimicrobial guard.",
        `Product Description – ASUS Vivobook 16 (X1605)

        Let your vision shine with the ASUS Vivobook 16. It features a grand 16-inch display within a compact chassis, making it perfect for students who need extra screen space for spreadsheets or coding. The device is protected by ASUS Antimicrobial Guard Plus to inhibit viral and bacterial growth.

        Color Options: Indie Black, Transparent Silver

        Specifications:
        Processor: Intel Core i5-1235U / i3-1315U (12th/13th Gen)
        RAM: 8GB / 16GB DDR4 (Dual channel support)
        Display: 16.0-inch WUXGA (1920 x 1200) 16:10 aspect ratio
        Storage: 512GB M.2 NVMe PCIe SSD
        Weight: 1.88 kg
        Hinge: 180° lay-flat hinge

        Design Features:
        Privacy Shutter: Physical slider over the webcam.
        ErgoSense Keyboard: Dish-shaped keys for comfortable typing.
        Fingerprint Sensor: Built into the touchpad for one-touch login.

        Benefits:
        Larger Workspace: The 16:10 aspect ratio gives you more vertical screen real estate.
        Hygiene: The laptop surface inhibits 99% of bacteria for 3 years.
        Durability: Military-grade (US MIL-STD 810H) tested for toughness.`,
        42990,
        "https://i.gadgets360cdn.com/products/large/asus-vivobook-s-16-asus-db-1170x800-1716362561.jpg"
      ],
      [
        "Logitech MX Master 3S Wireless Mouse",
        "Laptops_Accessories",
        "The ultimate productivity mouse for coders and creators, featuring an 8K DPI sensor and ultra-quiet electromagnetic scrolling.",
        `Product Description – Logitech MX Master 3S

        Meet the master of productivity. The MX Master 3S is an icon remastered with Quiet Click technology and an 8000 DPI track-on-glass sensor. Its ergonomic silhouette supports your palm and wrist perfectly, while the electromagnetic MagSpeed scroll wheel is precise enough to stop on a pixel and fast enough to scroll 1,000 lines per second.

        Color Options: Graphite (Dark Grey), Pale Grey

        Specifications:
        DPI: 200 to 8000 DPI (Adjustable)
        Buttons: 7 programmable buttons
        Scroll Wheel: MagSpeed Smartshift (Ratchet & Free-spin)
        Battery Life: 70 Days on full charge
        Connectivity: Bluetooth Low Energy & Logi Bolt USB Receiver

        Key Features:
        Cross-Computer Control: Move cursor seamlessly between up to 3 computers.
        Quiet Clicks: 90% less click noise compared to previous models.
        Thumb Wheel: Dedicated horizontal scroll wheel for Excel or timeline editing.

        Benefits:
        Ergonomics: Reduces wrist strain during long working hours.
        Versatility: Works on any surface, including glass tables.
        Efficiency: Copy text on one computer and paste it on another instantly.`,
        8995,
        "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6516/6516285_sd.jpg"
      ],
      [
        "Portronics My Buddy K Portable Laptop Stand",
        "Laptops_Accessories",
        "Ergonomic, height-adjustable aluminium laptop stand that prevents neck pain and improves laptop cooling.",
        `Product Description – Portronics My Buddy K Stand

        Improve your posture and productivity with the My Buddy K Laptop Stand. Crafted from premium aluminium alloy, this stand raises your laptop to eye level, relieving neck and shoulder strain. Its ventilated open design ensures your laptop stays cool even during heavy tasks.

        Color Options: Silver, Black

        Specifications:
        Material: Aluminium Alloy + Silicone Pads
        Height Levels: 7 Adjustable angles
        Compatibility: Supports 10-inch to 15.6-inch laptops (MacBook, Dell, HP, etc.)
        Weight Capacity: Holds up to 4-5 kg
        Foldable: Yes (Folds into a thin strip)

        Design Features:
        Anti-Slip Pads: Silicon rubber pads prevent scratches and sliding.
        Open Ventilation: Prevents the laptop from overheating by allowing airflow.
        Compact: Comes with a velvet carry pouch for portability.

        Benefits:
        Ergonomic Health: Fixes "tech neck" by correcting your viewing angle.
        Sturdy Build: Solid triangular support structure prevents wobbling while typing.
        Portable: Fits easily into your laptop bag alongside the laptop.`,
        799,
        "https://img.ltwebstatic.com/images3_spmp/2024/09/10/5e/1725957875bb232a8e536a8e06a0dc86543dc422fa.webp"
      ]
    ],
    "TV_Home_Entertainment": [
      [
        "55-Inch 4K Ultra HD Smart LED TV",
        "TV & Home Entertainment",
        "Stunning 4K visual experience with Dolby Vision, MEMC technology, and built-in smart apps like Netflix and Prime Video.",
        `Product Overview – 55-Inch 4K UHD Smart TV

        Transform your living room into a cinema. This 55-inch 4K Smart TV delivers four times the resolution of Full HD, offering crystal-clear detail and vibrant colors. Powered by a quad-core processor and running the latest Android TV OS, it ensures a lag-free entertainment experience with access to thousands of apps.

        Picture Quality:
        Resolution: 4K Ultra HD (3840 x 2160 pixels)
        Panel Type: A+ Grade LED Panel
        HDR Support: Dolby Vision & HDR10+ for deep blacks and bright whites
        Refresh Rate: 60Hz with MEMC (Motion Estimation Motion Compensation)

        Smart Features:
        OS: Android TV / Google TV (Certified)
        Voice Assistant: Built-in Google Assistant / Alexa
        Apps: Netflix, YouTube, Prime Video, Hotstar, and 5000+ apps via Play Store
        Casting: Built-in Chromecast / Miracast

        Audio:
        Sound Output: 30 Watts
        Technology: Dolby Atmos / DTS Virtual:X
        Speakers: Down-firing box speakers

        Benefits:
        Cinematic Experience: Bezel-less design maximizes viewing area.
        Smart Home Control: Control smart lights and devices via the TV remote.
        Gaming Ready: Low latency mode for console gaming.`,
        36999,
        "https://www.ytechb.com/wp-content/uploads/2021/10/how-to-delete-apps-on-samsung-smart-tv.webp"
      ],
      [
        "Dolby Atmos Soundbar with Wireless Subwoofer",
        "TV_Home_Entertainment",
        "A powerful 3.1 channel soundbar system delivering immersive 3D audio with a wireless deep-bass subwoofer.",
        `Product Description – Premium Soundbar System

        Elevate your TV audio to theater levels. This 3.1 Channel Soundbar comes with Dolby Atmos support, projecting sound around you for a true 3D experience. The wireless subwoofer eliminates cable clutter while providing chest-thumping bass, making movies, music, and games come alive.

        Color Options: Matte Black

        Specifications:
        Total Power: 320W - 400W (RMS)
        Channels: 3.1 (Left, Right, Center + Subwoofer)
        Audio Decoding: Dolby Atmos, DTS:X
        Subwoofer: Wireless active subwoofer (6.5 inch driver)
        Connectivity: HDMI eARC, Optical, USB, Bluetooth 5.1

        Design:
        Sleek, low-profile bar that fits under most TVs.
        Wall-mountable (brackets usually included).
        LED display concealed behind the grille.

        Benefits:
        Clear Dialogue: Dedicated center channel ensures you hear every word of dialogue.
        Immersive Sound: Surround sound effect without needing rear speakers.
        Wireless Clean Setup: Place the subwoofer anywhere in the room.`,
        16999,
        "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6541/6541474ld.jpg"
      ],
      [
        "4K Media Streaming Stick",
        "TV_Home_Entertainment",
        "Turn any TV into a Smart TV instantly. Stream 4K content with Dolby Vision and voice control remote.",
        `Product Description – 4K Streaming Media Player

        Don't buy a new TV, just upgrade it! Plug this Streaming Stick into the HDMI port of your existing TV to access a world of entertainment. It supports 4K Ultra HD streaming, Dolby Vision, and HDR10+. It comes with a voice remote to search for movies, launch apps, and control volume.

        Specifications:
        Output Resolution: Up to 4K Ultra HD at 60fps
        Video Formats: Dolby Vision, HDR 10, HDR10+, HLG
        Audio Support: Dolby Atmos (via pass-through)
        Processor: Quad-core 1.7GHz or higher
        Storage: 8GB (for apps and cache)
        Connectivity: Wi-Fi 6 / MIMO
        Remote: Voice Remote with TV power and volume controls

        Key Features:
        Plug and Play: Simple setup hidden behind the TV.
        Massive Content: Access Netflix, Prime, Disney+, Hotstar, Zee5, YouTube, etc.
        Portable: Take it with you on vacation to hotels.
        Smart Home: View live camera feeds or check weather via voice.`,
        4499,
        "https://static1.pocketlintimages.com/wordpress/wp-content/uploads/wm/2025/05/roku-streaming-stick-plus-12.jpg"
      ],
      [
        "5.1 Home Theater Speaker System",
        "TV_Home_Entertainment",
        "Complete surround sound system with 5 speakers and a powerful subwoofer for a true cinema hall feel at home.",
        `Product Description – 5.1 Multimedia Speaker System

        For the audiophiles who want true surround sound. This 5.1 Speaker System includes five satellite speakers (front left/right, rear left/right, center) and a powerful subwoofer. It creates a 360-degree sound field, perfect for action movies and gaming.

        Color Options: Glossy Black, Wood Finish

        Specifications:
        Total Output: 120W – 160W RMS
        Subwoofer Driver: 8-inch bass driver
        Connectivity: Bluetooth, USB, SD Card, FM Radio, AUX, RCA
        Remote: Fully functional wireless remote
        Display: Digital LED display on subwoofer unit

        Design:
        Compact satellite speakers suitable for wall mounting or shelf placement.
        Wooden cabinet subwoofer for deep, resonance-free bass.

        Benefits:
        True Surround: Discrete audio channels allow you to hear bullets whizzing past or footsteps.
        Multi-Purpose: Connects to PC, TV, DVD player, or phone via Bluetooth.
        Deep Bass: Heavy bass response suitable for parties and action films.`,
        7999,
        "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6336/6336542_sd.jpg"
      ],
      [
        "Full HD LED Projector (Home Cinema)",
        "TV_Home_Entertainment",
        "Bright 1080p Native Projector for a massive 120-inch screen experience, perfect for movies and IPL matches.",
        `Product Description – Home Cinema LED Projector

        Bring the big screen home. This Native 1080p Projector allows you to project an image up to 200 inches on a wall or screen. With high brightness and vivid color reproduction, it is perfect for movie nights, cricket matches, and gaming sessions.

        Specifications:
        Native Resolution: 1920 x 1080p (Full HD)
        Brightness: 6000 Lumens / 600 ANSI Lumens
        Contrast Ratio: 5000:1
        Lamp Life: 30,000 – 50,000 hours (LED)
        Projection Size: 40 inches to 200 inches
        Inputs: 2x HDMI, 2x USB, AV, 3.5mm Audio Out
        Keystone Correction: Manual / Digital ±15 degrees

        Key Features:
        Built-in Speaker: 5W speaker included.
        Media Player: Play movies directly from a USB pen drive.
        Smartphone Mirroring: Supports screen casting (model dependent).

        Benefits:
        Massive Screen: Much larger than any TV for a fraction of the price.
        Eye Protection: Diffused reflection light is gentler on eyes than direct TV light.`,
        12999,
        "https://images.thdstatic.com/productImages/530a2729-7ba5-4109-ad02-e15a8ec7d0b5/svn/etokfoks-projectors-mlsa10-2ki020-64_1000.jpg"
      ]
    ],
    Mobiles: [
      [
        "Galaxy Ultra 5G Smartphone",
        "Mobiles",
        "Flagship 5G smartphone with 108MP camera, stunning AMOLED display, and ultra-fast performance.",
        `Product Description – Galaxy Ultra 5G

        Experience the future of mobile technology with the Galaxy Ultra 5G. Designed for power users, creators, and gamers, this device combines a pro-grade camera system with the world’s fastest smartphone chip.

        Color Options: Phantom Black, Mystic Bronze, Cloud White

        Specifications:
        Display: 6.8-inch Dynamic AMOLED 2X (120Hz Refresh Rate)
        Processor: Octa-core flagship processor (4nm technology)
        RAM/Storage: 12GB RAM / 256GB & 512GB Options
        Camera: Quad setup (108MP Main + 12MP Ultra-wide + 10MP Telephoto)
        Battery: 5000mAh with 45W Fast Charging

        Key Features:
        Nightography: Capture crystal clear photos and videos even in low light.
        S-Pen Support: Precise input for drawing and note-taking.
        Durability: Gorilla Glass Victus+ front and back, IP68 water resistance.`,
        75999,
        "https://ampro.in/wp-content/uploads/2024/01/Samsung-Galaxy-S24-Ultra-5G-3-3.jpg"
      ],
      [
        "Mid-Range Pro 5G",
        "Mobiles",
        "A value-for-money 5G powerhouse with 90Hz screen, fast charging, and smooth multitasking.",
        `Product Description – Mid-Range Pro 5G

        The perfect balance of performance and price. The Mid-Range Pro 5G brings you blazing-fast download speeds, a silky smooth screen for gaming, and a battery that easily lasts more than a day.

        Color Options: Ocean Blue, Midnight Gray, Teal Green

        Specifications:
        Display: 6.5-inch FHD+ IPS LCD (90Hz)
        Processor: MediaTek Dimensity 5G Chipset
        RAM/Storage: 6GB/8GB RAM, 128GB Storage (Expandable)
        Camera: 50MP AI Triple Camera System
        Battery: 5000mAh with 33W Fast Charging
        SIM: Dual Nano SIM + SD Card Slot

        Benefits:
        Future Ready: Support for 5G bands ensures high internet speeds.
        All-Day Battery: Optimized power management for heavy usage.
        Smooth Gaming: 90Hz refresh rate makes animations and gaming lag-free.`,
        14999,
        "https://netmag.pk/wp-content/uploads/2025/03/OPPO.png"
      ],
      [
        "Classic Keypad 4G",
        "Mobiles",
        "Rugged and reliable feature phone with 4G VoLTE, long battery life, and loud audio for calls.",
        `Product Description – Classic Keypad 4G

        Sometimes simplicity is best. This Classic Keypad 4G phone is built for durability, clear calls, and extremely long battery life. Perfect as a secondary phone or for senior citizens who prefer physical buttons.

        Color Options: Charcoal Black, Deep Blue

        Specifications:
        Network: 4G VoLTE (Works with Jio, Airtel, VI)
        Display: 2.4-inch QVGA Color Screen
        Keypad: Alphanumeric with rubberized tactile keys
        Battery: 1800mAh Removable Battery (Standby up to 10 days)
        Features: Torch, FM Radio (Wireless), Call Recording, MP3 Player

        Benefits:
        HD Voice Calls: Crystal clear voice over LTE networks.
        Long Backup: No need to charge every day; lasts for days on a single charge.
        Durable: Can withstand accidental drops better than glass smartphones.`,
        2299,
        "https://cdn.beebom.com/mobile/jio-bharat-b2-front.png"
      ],
      [
        "Foldable Z Flip Phone",
        "Mobiles",
        "Compact foldable smartphone that fits in your pocket, featuring a flex mode camera and cover screen.",
        `Product Description – Foldable Z Flip Phone

        A phone that bends to your will. This foldable smartphone offers a full-size screen experience that folds into a compact device fits perfectly in small pockets or purses. A statement of style and innovation.

        Color Options: Lavender, Cream, Graphite, Mint

        Specifications:
        Main Display: 6.7-inch Foldable Dynamic AMOLED 2X
        Cover Display: 1.9-inch Super AMOLED (for notifications/widgets)
        Processor: Snapdragon 8+ Gen 1
        Water Resistance: IPX8 (Submersible up to 1.5 meters)
        Camera: Dual 12MP Rear (Wide + Ultra Wide), 10MP Front
        Storage: 256GB / 512GB

        Benefits:
        Pocketability: Folds down to half the size of a standard phone.
        Hands-Free Selfies: Sit the phone in L-shape (Flex Mode) to take photos without a tripod.
        Quick View: Check texts, change music, and see calls on the outer screen.`,
        69999,
        "https://images.hindustantimes.com/img/2022/09/01/1600x900/2df2032a-29d6-11ed-bc83-9c2713d606c3_1662038669844.jpg"
      ]
    ]
  },
  Fashion: {
    Kids: [
      [
        "Boys' Cotton T-Shirt & Shorts Set",
        "Kids",
        "A comfortable, playful 100% cotton summer combo set featuring fun prints and an elastic waistband for active play.",
        `Product Description – Boys' Summer Combo Set

        Keep your little one cool and stylish with this bright and cheerful T-Shirt and Shorts set. Made from premium bio-washed cotton, it ensures maximum comfort during playdates, park visits, or lounging at home. The breathable fabric prevents rashes, making it safe for sensitive skin.

        Color Options: Bright Yellow & Blue, Red & Navy, Dinosaur Print

        Specifications:
        Fabric: 100% Soft Cotton (180 GSM)
        Neck: Round Neck
        Waistband: Soft elastic (no marks on waist)
        Age Group: 2 Years – 8 Years
        Fit: Regular Relaxed Fit

        Benefits:
        Skin-Friendly: Hypoallergenic fabric prevents sweating and itching.
        Easy Wear: Elastic waist makes it easy for kids to dress themselves.
        Durable: Holds up well against frequent washing.`,
        549,
        "https://assetscdn1.paytm.com/images/catalog/product/K/KI/KIDDONGLI-BOYS-ZEBU23329C695FA4A/1563365726566_0..jpg"
      ],
      [
        "Girls' Princess Party Wear Frock",
        "Kids",
        "An enchanting satin and tulle party dress with floral details, perfect for birthdays and weddings.",
        `Product Description – Girls' Premium Party Frock

        Make your little girl feel like a princess! This exquisite Party Wear Frock is designed with layers of soft net and a satin lining to provide volume without irritation. The inner lining is 100% cotton to ensure she stays comfortable while twirling and dancing.

        Color Options: Blush Pink, Powder Blue, Crimson Red, Lavender

        Specifications:
        Outer Material: Net / Satin blend
        Inner Lining: 100% Soft Cotton
        Closure: Concealed zipper at the back
        Length: Knee-length or Midi
        Occasion: Birthdays, Weddings, Festivals

        Design Details:
        Decorative flower applique or bow at the waist.
        Sleeveless or Cap sleeves (comfortable movement).
        Flared skirt for the "ballgown" look.`,
        1299,
        "https://i.pinimg.com/originals/a5/31/e9/a531e9741e3e7eaa68a2e91290eb8995.jpg"
      ],
      [
        "Kids' Unisex Puffer Jacket",
        "Kids",
        "Warm and cozy winter jacket with a hood, designed to keep kids protected from cold winds and light rain.",
        `Product Description – Kids' Winter Hooded Jacket

        Beat the chill with this ultra-lightweight yet warm Puffer Jacket. Suitable for both boys and girls, this jacket traps body heat effectively while remaining light enough for kids to run around in. It comes with a hood and secure pockets for keeping little hands warm.

        Color Options: Neon Green, Bright Orange, Navy Blue, Hot Pink

        Specifications:
        Material: 100% Polyester shell
        Filling: Micro-fiber thermal insulation
        Closure: Smooth heavy-duty zipper
        Water Resistant: Yes (light rain/snow)
        Age: 4 Years – 12 Years

        Benefits:
        Lightweight: Does not feel heavy or bulky on the child.
        Easy Cleaning: Wipes clean easily; machine washable.
        Warmth: Excellent insulation for temperatures down to 5°C.`,
        999,
        "https://ikalicostume.com/cdn/shop/products/boys_Lightweight_jacket_blue_1_3000x.jpg"
      ],
      [
        "Boys' Traditional Kurta Pajama",
        "Kids",
        "A festive ethnic set featuring a cotton silk kurta and comfortable white bottoms, ideal for festivals and weddings.",
        `Product Description – Boys' Festive Ethnic Set

        Get your little gentleman festive-ready with this charming Kurta Pajama set. Crafted from rich-looking cotton blend fabric, it offers the shine of silk with the breathability of cotton. Perfect for Diwali, Eid, weddings, and school cultural events.

        Color Options: Royal Blue, Maroon, Golden Yellow, Turquoise

        Specifications:
        Top Fabric: Cotton Silk Blend
        Bottom Fabric: 100% Cotton
        Neck: Mandarin Collar
        Set Includes: 1 Kurta + 1 Pajama (Bottom)

        Benefits:
        No Fuss: Easy for kids to put on and take off.
        Comfortable: Roomy fit allows for running and playing.
        Elegant: Traditional look without being heavy or itchy.`,
        799,
        "https://i.etsystatic.com/18196501/r/il/b0e2e1/3198480448/il_fullxfull.3198480448_a4a5.jpg"
      ],
      [
        "Kids' LED Light-Up Sneakers",
        "Kids",
        "Fun and funky velcro sneakers that light up with every step, featuring non-slip soles for safety.",
        `Product Description – Kids' LED Light-Up Shoes

        Make walking fun! These LED sneakers flash bright colors every time your child takes a step. Not only are they entertaining, but they also provide great visibility in low light. The velcro straps ensure kids can put them on and take them off without help.

        Color Options: White with Multi-lights, Blue Spiderman Theme, Pink Unicorn Theme

        Specifications:
        Outer Material: Synthetic Leather / Mesh
        Sole: Anti-skid Rubber
        Closure: Velcro Strap (Hook and Loop)
        Light Battery: Built-in (Non-chargeable)

        Benefits:
        Independent Wear: No laces to tie.
        Safety: Non-slip sole prevents falls on slippery floors.
        Fun Factor: Keeps kids excited about walking and running.`,
        899,
        "https://i5.walmartimages.com/seo/Hessimy-Kids-LED-Light-Up-Shoes-for-Boys-and-Girls-Cool-Flashing-Sneakers-Unisex-RD1-7-5_e70b9377-2f97-4932-a63e-1bc9e841bbc3.e398b9d114101c5bcf9569908b691ba1.jpeg"
      ]
    ],
    Women: [
      [
        "Women's Banarasi Art Silk Saree",
        "Women",
        "A stunning traditional Banarasi Art Silk saree with intricate Zari work, perfect for weddings and festivals.",
        `Product Description – Banarasi Art Silk Saree with Blouse Piece

        Elegance meets tradition in this exquisite Banarasi Art Silk Saree. Featuring rich Zari weaving on the border and pallu, this saree drapes beautifully and gives a royal look for special occasions. It comes with an unstitched blouse piece that can be tailored to your style.

        Color Options: Royal Blue & Gold, Crimson Red, Emerald Green, Mustard Yellow

        Specifications:
        Saree Fabric: Art Silk / Banarasi Silk Blend
        Blouse Fabric: Matching Art Silk (0.8 meters)
        Saree Length: 5.5 meters
        Work: Jacquard Zari Weaving
        Occasion: Wedding, Reception, Festivals, Puja

        Design Details:
        Heavy Zari pallu with floral or peacock motifs.
        Broad golden border for a grand appearance.
        Soft texture that is easy to pleat and carry.`,
        1899,
        "https://ik.imagekit.io/ldqsn9vvwgg/images/1599904.jpg"
      ],
      [
        "Women's Floral Print Maxi Dress",
        "Women",
        "A breezy and stylish floral maxi dress made from breathable georgette fabric, ideal for summer outings and vacations.",
        `Product Description – Floral Georgette Maxi Dress

        Step out in style with this flowy Floral Maxi Dress. Designed for the modern woman, it features a flattering A-line silhouette, a cinched waist, and flared hem. Whether you are going for a brunch date or a beach vacation, this dress ensures you look chic and feel comfortable.

        Color Options: Peach & White Floral, Navy Blue & Pink, Black & Red Roses, Teal Green

        Specifications:
        Fabric: Poly Georgette / Crepe
        Length: Ankle Length (Maxi)
        Neckline: V-Neck or Wrap style
        Lining: Attached soft inner lining

        Benefits:
        Breathable: Perfect for hot and humid weather.
        Low Maintenance: Does not require heavy ironing.
        Versatile: Pair with heels for a party or flats for a casual look.`,
        1199,
        "https://i.pinimg.com/originals/3f/01/dd/3f01dd4bb8c2363c6a07a3c4398bca93.jpg"
      ],
      [
        "Women's High-Waist Skinny Jeans",
        "Women",
        "Classic high-waist denim jeans with stretchable fabric for a perfect fit and all-day comfort.",
        `Product Description – High-Waist Stretchable Denim Jeans

        The ultimate wardrobe staple. These High-Waist Skinny Jeans are crafted from a premium cotton-lycra blend that hugs your curves while providing enough stretch for movement. The high-rise design offers tummy control and pairs perfectly with crop tops or tucked-in shirts.

        Color Options: Ice Blue, Dark Indigo, Jet Black, Grey

        Specifications:
        Material: 78% Cotton, 20% Polyester, 2% Elastane
        Fit: Skinny / Slim Fit
        Rise: High-Rise (sits above the navel)
        Closure: Button and Zip Fly
        Pockets: 5-pocket classic styling

        Benefits:
        Shape Retention: Doesn't bag out at the knees after wearing.
        Comfort: Stretch fabric allows you to sit and move easily.
        Style: Elongates the legs and defines the waist.`,
        1299,
        "https://oldnavy.gap.com/webcontent/0052/474/838/cn52474838.jpg"
      ],
      [
        "Women's Formal Blazer",
        "Women",
        "A sharp, tailored single-breasted blazer that adds a professional touch to any office or formal outfit.",
        `Product Description – Women's Slim Fit Formal Blazer

        Power dressing made easy. This tailored Formal Blazer is designed to give you a sharp, authoritative look for the office, interviews, or client meetings. Made from wrinkle-resistant fabric, it keeps you looking polished from morning to evening.

        Color Options: Black, Navy Blue, Beige, Wine Red

        Specifications:
        Fabric: Polyester Viscose Blend
        Fit: Slim / Tailored Fit
        Closure: Single Button
        Lining: Full satin lining

        Design Features:
        Notched lapel collar.
        Padded shoulders for structure.
        Two functional side pockets with flaps.`,
        1999,
        "https://i.pinimg.com/originals/9c/6a/86/9c6a86ec5eda4576b0d6f093421adb72.jpg"
      ],
      [
        "Women's Block Heel Sandals",
        "Women",
        "Stylish and comfortable block heels with a cushioned sole, perfect for parties, weddings, and office wear.",
        `Product Description – Women's Strappy Block Heels

        Dance the night away without the pain. These Block Heel Sandals combine fashion with function. The sturdy block heel provides better stability than stilettos, while the cushioned insole ensures your feet stay comfortable for hours.

        Color Options: Nude / Beige, Black, Gold, Rose Gold

        Specifications:
        Upper Material: Synthetic Suede / PU Leather
        Sole: Non-slip Resin Sheet
        Heel Height: 2.5 to 3 inches
        Closure: Adjustable ankle buckle strap

        Benefits:
        Stability: Wide heel base makes walking easy on grass or uneven floors.
        Comfort: Padded footbed reduces pressure on the balls of feet.
        Style: Adds height and elegance to any outfit.`,
        1099,
        "https://i.pinimg.com/736x/33/3f/aa/333faa5b475d34485842f691c388b540.jpg"
      ]
    ],
    Men: [
      [
        "Men's Solid Polo T-Shirt",
        "Men",
        "A classic pique cotton polo t-shirt with a ribbed collar, offering a smart-casual look for any occasion.",
        `Product Description – Classic Men's Polo

        Elevate your everyday style with this timeless Solid Polo T-Shirt. Made from breathable pique cotton fabric, it features a structured collar and ribbed cuffs. Whether you are heading to the golf course, a casual Friday at work, or a weekend brunch, this polo ensures you look sharp and feel comfortable.

        Color Options: Navy Blue, Classic White, Maroon, Charcoal Grey

        Specifications:
        Fabric: 100% Cotton Pique (220 GSM)
        Fit: Regular / Slim Fit
        Sleeves: Half Sleeves with ribbed cuffs
        Pattern: Solid

        Design Features:
        Side vents at the hem for better movement.
        Tennis-tail hem (slightly longer at the back).
        Moisture-wicking fabric keeps you dry.`,
        799,
        "https://i.pinimg.com/736x/d8/dd/d3/d8ddd3ae94c4702af8485cc302d27b58.jpg"
      ],
      [
        "Men's Slim Fit Chino Trousers",
        "Men's Fashion",
        "Stylish and stretchable cotton chinos that bridge the gap between formal trousers and casual jeans.",
        `Product Description – Premium Cotton Chinos

        Ditch the stiff formal pants for our Slim Fit Chinos. Crafted from a premium cotton-spandex blend, these trousers offer the perfect amount of stretch for all-day comfort. They are tailored to provide a clean, modern silhouette suitable for office wear or evening outings.

        Color Options: Khaki / Beige, Olive Green, Navy Blue, Black

        Specifications:
        Material: 98% Cotton, 2% Elastane (Spandex)
        Fit: Slim Tapered Fit
        Closure: Button and Zip Fly
        Pockets: 2 side slant pockets, 2 back welt pockets

        Benefits:
        Comfort: Stretch fabric moves with you.
        Style: Looks professional with a shirt, casual with a t-shirt.
        Breathable: Keeps you cool unlike heavy denim.`,
        1299,
        "https://i5.walmartimages.com/seo/Mens-Slim-Fit-Cotton-Stretch-Chino-Pants-3-Pack_85396698-9aa0-45b5-aa68-4e5e156ae9e2.a347423d9a68da028ee4f94f852930c2.jpeg"
      ],
      [
        "Men's Denim Trucker Jacket",
        "Men",
        "A rugged and trendy denim jacket with a vintage wash, perfect for layering over t-shirts and hoodies.",
        `Product Description – Classic Denim Trucker Jacket

        Add an edge to your outfit with this iconic Denim Trucker Jacket. Built from heavy-gauge durable denim, it features a classic button-down front and chest pockets. It is the ultimate layering piece for transitional weather or winter style.

        Color Options: Vintage Blue, Faded Black, Light Wash Ice Blue

        Specifications:
        Fabric: 100% Cotton Denim
        Fit: Regular Fit
        Closure: Metal Shank Buttons
        Pockets: 2 Chest flap pockets, 2 Side welt pockets

        Design Features:
        Adjustable waist tabs at the back.
        Contrast stitching for a classic look.
        Durable construction that gets better with age.`,
        2499,
        "https://img.shopstyle-cdn.com/sim/c9/70/c970d952e0175b6212cc02a737beeb2e_best/vesniba-denim-jacket-men-vintage-mens-rugged-wear-denim-jacket-washed-distressed-flex-stretch-casual-trucker-jean-jacket.jpg"
      ],
      [
        "Men's Formal Leather Loafers",
        "Men",
        "Sophisticated slip-on leather loafers with a cushioned insole, ideal for office wear and parties.",
        `Product Description – Penny Loafers for Men

        Step into sophistication with these handcrafted Leather Loafers. Designed for the modern gentleman, they feature a sleek silhouette and a decorative strap (penny style). The cushioned footbed ensures you can wear them from the boardroom to the bar without discomfort.

        Color Options: Tan Brown, Classic Black, Dark Cherry

        Specifications:
        Upper Material: Genuine Leather / High-grade PU
        Sole: TPR (Thermoplastic Rubber) for grip
        Style: Slip-on Loafer
        Insole: Memory foam padding

        Benefits:
        Convenience: Easy to slip on and off (no laces).
        Versatile: Matches suits, chinos, and even jeans.
        Durability: Sturdy sole and quality stitching.`,
        1899,
        "https://i.pinimg.com/originals/75/a3/87/75a387306a29406bda56b63390515674.png"
      ],
      [
        "Men's Analog Chronograph Watch",
        "Men's Fashion",
        "A premium stainless steel chronograph watch with a bold dial, adding a touch of luxury to your wrist.",
        `Product Description – Men's Stainless Steel Watch

        Make a statement with this bold Analog Chronograph Watch. Featuring a heavy-duty stainless steel strap and a multi-function dial, it is the perfect accessory for the man who values time and style. Water-resistant and scratch-proof, it is built for daily wear.

        Color Options: Silver Chain / Blue Dial, All Black, Gold & Silver Dual Tone

        Specifications:
        Movement: Quartz
        Display: Analog with Date and Chronograph (Stopwatch)
        Strap Material: Stainless Steel
        Water Resistance: 30M / 50M

        Benefits:
        Professional Look: Completes a formal outfit instantly.
        Durability: Steel construction resists corrosion.
        Functionality: Stopwatch feature for timing activities.`,
        3499,
        "https://rukminim2.flixcart.com/image/832/832/xif0q/watch/j/r/u/1-d-d-f95-blue-silver-chain-piraso-men-original-imagkyg5gxufh2cp.jpeg"
      ],
      [
        "Men's Regular Fit Cotton T-Shirt",
        "Fashion",
        "A classic, breathable 100% cotton t-shirt designed for everyday comfort and casual style.",
        `Product Description – Men's Premium Cotton T-Shirt

        Upgrade your wardrobe basics with our Premium Cotton T-Shirt. Crafted from combed soft-touch cotton, this tee offers a relaxed fit that looks good on everyone. Whether paired with jeans for a casual outing or layered under a jacket, it remains soft, breathable, and durable wash after wash.

        Color Options: Classic White, Jet Black, Navy Blue, Charcoal Grey

        Specifications:
        Material: 100% Bio-washed Cotton (180 GSM)
        Fit: Regular Fit / Comfort Fit
        Neckline: Ribbed Round Neck
        Sleeves: Half Sleeves

        Benefits:
        Versatile Style: Works for gym, casual work days, or lounging.
        Soft on Skin: Hypoallergenic natural fabric.
        Easy Care: Iron-friendly and color-fast.`,
        599,
        "https://www.jiomart.com/images/product/500x630/rvhijlanam/gespo-men-s-navy-blue-white-colorblocked-round-neck-cotton-blend-half-sleeve-t-shirt-product-images-rvhijlanam-0-202306061448.jpg"
      ],
      [
        "Men's Slim Fit Formal Shirt",
        "Fashion",
        "Sharp and crisp formal shirt for men, made from anti-wrinkle cotton blend fabric suitable for office and meetings.",
        `Product Description – Men's Formal Office Shirt

        Look sharp and professional with our Slim Fit Formal Shirt. Tailored to perfection, this shirt provides a crisp silhouette that enhances your confidence in meetings and interviews. The anti-wrinkle blend ensures you look fresh from 9 to 5.

        Color Options: Sky Blue, Crisp White, Lavender

        Specifications:
        Material: Cotton Poly Blend
        Fit: Slim Fit (Tapered at waist)
        Collar: Spread Collar
        Cuff: Adjustable button cuffs
        Pocket: Single chest patch pocket

        Design:
        Stiff collar stays to maintain structure.
        Curved hemline (can be worn tucked or untucked).
        Premium buttons that don't crack easily.`,
        1199,
        "https://rukminim1.flixcart.com/image/612/612/xif0q/shirt/q/2/i/42-men-regular-slim-fit-solid-button-down-collar-formal-shirt-original-imagf4nbrwdqgnc6-bb.jpeg"
      ],
      [
        "White Casual Sneakers",
        "Fashion",
        "Trendy white PU leather sneakers with a cushioned sole, perfect for matching with any casual outfit.",
        `Product Description – Unisex Casual White Sneakers

        The ultimate fashion staple. These minimalist White Sneakers are designed to go with everything in your closet. Featuring a durable synthetic leather upper and a chunky rubber sole, they offer both height and comfort.

        Color Options: White with Black Heel Tab, All White, White with Navy Stripes

        Specifications:
        Upper Material: Premium Synthetic PU Leather
        Sole Material: TPR / Rubber (Anti-skid)
        Closure: Lace-up
        Insole: Memory foam cushion
        Heel Height: Approx 1.5 inches

        Benefits:
        Versatile: Matches jeans, chinos, skirts, and dresses.
        Comfort: Memory foam insoles support feet for long walking.
        Durable: Rubber sole provides good grip on city streets.`,
        1899,
        "https://img.joomcdn.net/ba7a2b9a535387b7735454ddc0159d4d6d1d06c7_original.jpeg"
      ]
    ],
    Bags_Luggage: [
      [
        "Polycarbonate Hard Sided Trolley Bag (55cm)",
        "Bags_Luggage",
        "Durable and scratch-resistant hard-shell cabin luggage with 360-degree rotating wheels and a built-in TSA lock.",
        `Product Description – Hard Shell Cabin Luggage

        Travel with confidence and style. This robust Hard Sided Trolley is built from premium polycarbonate, making it lightweight yet incredibly strong. Designed to fit in overhead bins, it features a scratch-resistant textured finish and smooth dual wheels for effortless navigation through busy airports.

        Color Options: Midnight Blue, Charcoal Grey, Metallic Silver, Rose Gold

        Specifications:
        Size: Cabin (55 cm / 20-22 inch)
        Material: Polycarbonate (Unbreakable shell)
        Wheels: 4 Double-wheels (360-degree rotation)
        Lock: Integrated TSA Number Lock
        Capacity: 40-45 Liters

        Benefits:
        Maneuverability: Glides smoothly alongside you.
        Security: TSA lock ensures belongings are safe yet accessible to security agents.
        Durability: Absorbs impact under stress and flexes back to original shape.`,
        3499,
        "https://m.media-amazon.com/images/I/41F1E42zP2L._AC_.jpg"
      ],
      [
        "Anti-Theft Laptop Backpack with USB Port",
        "Bags_Luggage",
        "A water-resistant tech backpack featuring a hidden zipper design, padded laptop sleeve, and external USB charging port.",
        `Product Description – Smart Anti-Theft Backpack

        Keep your gadgets safe and powered up. This innovative backpack is designed with hidden zippers against your back to prevent theft while commuting. It includes a built-in USB charging port (power bank not included) and multiple organizers, making it the perfect daily driver for professionals and students.

        Color Options: Black, Grey, Navy Blue

        Specifications:
        Material: Oxford Fabric (Water Repellent)
        Laptop Fit: Up to 15.6 inches
        Port: External USB type-A with built-in cable
        Straps: Padded ergonomic shoulder straps

        Design Features:
        Reflective strip for night visibility.
        Hidden back pocket for wallet/passport.
        Luggage strap to attach to trolley handles.

        Benefits:
        Security: "Invisible" zippers make it impossible to open while worn.
        Convenience: Charge your phone on the go.`,
        1299,
        "https://m.media-amazon.com/images/I/819YKQ5KZyL._AC_.jpg"
      ],
      [
        "Leatherette Weekender Duffle Bag",
        "Bags_Luggage",
        "A stylish and spacious duffle bag with a separate shoe compartment, ideal for gym sessions and weekend getaways.",
        `Product Description – Vintage Leatherette Gym & Travel Bag

        Combines luxury looks with rugged utility. This Weekender Duffle Bag is crafted from premium vegan leather (leatherette) with a vintage finish. It’s sized perfectly for a 2-3 day trip or a heavy gym session, featuring a dedicated side pocket to keep dirty shoes separate from clean clothes.

        Color Options: Tan Brown, Chocolate Brown, Black

        Specifications:
        Material: Premium PU Leather (Vegan)
        Capacity: Approx 35 Liters
        Shoe Pocket: Ventilated side compartment
        Strap: Detachable and adjustable shoulder strap
        Closure: High-quality metal zippers

        Benefits:
        Hygiene: Keeps shoes/laundry separate from fresh items.
        Versatile: Looks professional enough for business travel and cool enough for the gym.
        Water Resistant: Protects gear from light splashes.`,
        1799,
        "https://www.northmanplus.com/cdn/shop/products/YY8A4733_copy.jpg"
      ],
      [
        "55L Trekking Rucksack with Rain Cover",
        "Bags_Luggage",
        "High-capacity adventure backpack with ergonomic back support, rain cover, and multiple utility straps for camping gear.",
        `Product Description – 55L Hiking Rucksack

        Built for the outdoors. This 55-liter Rucksack is designed for long treks, camping, and backpacking trips. It features a heavy-duty ergonomic design that distributes weight evenly across your hips and shoulders, preventing fatigue. Comes with a waterproof rain cover to keep your gear dry in storms.

        Color Options: Army Green, Camouflage, Royal Blue, Red & Black

        Specifications:
        Capacity: 55 Liters
        Material: Tear-resistant Polyester
        Frame: Internal padded support
        Rain Cover: Included
        Compartments: Main sack, Shoe pocket, Top hood pocket

        Benefits:
        High Capacity: Fits clothes, food, and gear for 3-5 days.
        Comfort: Adjustable sternum and waist straps reduce shoulder load.
        Weather Proof: Rain cover ensures belongings stay dry.`,
        2499,
        "https://64.media.tumblr.com/1ef115adaa2404529e724cc4e3b0e41f/bb3c64b6d506398b-25/s640x960/eb90555e726acdfbb564601e5c7ded5473a4a805.webp"
      ],
      [
        "Women's Quilted Sling Bag",
        "Bags_Luggage",
        "A chic and trendy quilted sling bag with a gold-chain strap, perfect for parties and casual evenings.",
        `Product Description – Fashion Crossbody Sling Bag

        Small in size, big on style. This Quilted Sling Bag is the ultimate accessory for parties, dinners, or casual outings. The classic diamond-pattern stitching and gold-tone chain strap add a luxurious touch to any outfit, while the compact interior holds your phone, lipstick, keys, and cards.

        Color Options: Black, Beige / Nude, Red, White

        Specifications:
        Material: PU Leather
        Strap: Gold metal chain with leather shoulder pad
        Dimensions: 8" x 5" x 2.5"
        Pattern: Quilted / Chevron

        Benefits:
        Hands-Free: Crossbody style keeps hands free.
        Stylish: Elevates a simple jeans-and-tee outfit.
        Essential Storage: Forces you to carry only what you need.`,
        899,
        "https://roolee.com/cdn/shop/files/7W4A6023_1400x1400.jpg"
      ],
      [
        "Structured Tote Bag for Women",
        "Fashion",
        "Spacious and stylish tote bag with zip closure, suitable for work, travel, and shopping.",
        `Product Description – Women's Classic Tote Bag

        Carry your world with you. This Structured Tote Bag combines functionality with high-end style. Large enough to hold a laptop, makeup pouch, water bottle, and wallet, it is the perfect daily companion for working professionals and students.

        Color Options: Tan Brown, Classic Black, Beige / Nude

        Specifications:
        Material: Vegan Leather (High-grade PU)
        Compartments: 1 Main Zip Compartment, 2 Inner pockets
        Dimensions: 14" W x 11" H x 5" D
        Handle: Double shoulder straps (Reinforced)

        Benefits:
        High Capacity: Fits A4 documents and up to 14-inch laptops.
        Secure: Main zipper keeps items safe (unlike open-top shoppers).
        Durable: Scratch-resistant texture.`,
        999,
        "https://m.media-amazon.com/images/I/71UliNMczvL._AC_SL1500_.jpg"
      ]
    ],
    Sportswear: [
      [
        "Men's Dry-Fit Performance T-Shirt",
        "Sportswear",
        "Lightweight, moisture-wicking sports t-shirt designed for running, gym training, and high-intensity workouts.",
        `Product Description – Men's Athletic Running Tee

        Push your limits with this Performance Dry-Fit T-Shirt. Engineered with advanced sweat-wicking technology, it pulls moisture away from the skin to keep you cool and dry. The ergonomic cut ensures freedom of movement, making it ideal for weightlifting, cardio, or outdoor sports.

        Color Options: Neon Green, Electric Blue, Jet Black, Heather Grey

        Specifications:
        Fabric: 100% Polyester Mesh Blend
        Fit: Regular Athletic Fit
        Tech: Quick-Dry, Anti-Odor

        Design Features:
        Reflective logo for night visibility.
        Mesh panels underarms for ventilation.
        Flatlock seams to prevent chafing/irritation.

        Benefits:
        Stays Dry: Rapid evaporation of sweat.
        Odor Control: Anti-microbial finish keeps you smelling fresh.
        Lightweight: Feels like a second skin.`,
        599,
        "https://i5.walmartimages.com/seo/Real-Essentials-4-Pack-Men-s-Dry-Fit-Short-Sleeve-Pocket-Crew-Performance-Athletic-T-Shirt-Available-in-Big-Tall_c684ea54-520d-4007-8aa7-458720243740.f94f6e26c486f69523b645b409881401.jpeg"
      ],
      [
        "Women's High-Waist Yoga Leggings",
        "Sportswear",
        "Squat-proof, 4-way stretch leggings with tummy control and a side pocket for your phone.",
        `Product Description – High-Waist Compression Leggings

        From the yoga mat to the grocery store, these High-Waist Leggings are your go-to activewear. Made from a buttery-soft nylon-spandex blend, they offer a supportive compression fit that sculpts your shape while allowing full flexibility. Completely opaque (squat-proof) for peace of mind during workouts.

        Color Options: Black, Mauve / Dusty Pink, Teal Blue, Burgundy

        Specifications:
        Fabric: 80% Nylon, 20% Spandex
        Length: Ankle Length (27 inches)
        Waist: High-rise wide waistband
        Pockets: 1 Deep Side Pocket
        Transparency: 100% Opaque (Squat-proof)

        Benefits:
        Tummy Control: Holds the core in comfortably.
        Soft Feel: Fabric feels like cotton but performs like sport tech.
        Convenience: Phone pocket fits most large smartphones.`,
        1299,
        "https://i.pinimg.com/736x/30/66/9a/30669a95eed12da27c8b756915e08011.jpg"
      ],
      [
        "Men's Slim Fit Track Pants / Joggers",
        "Sportswear",
        "Stylish and functional track pants with zipper pockets, perfect for gym sessions or casual streetwear.",
        `Product Description – Men's Slim Fit Gym Joggers

        Train in style with these Slim Fit Joggers. Designed with a tapered leg and ankle cuffs, they provide a modern look without being too tight. The breathable fabric stretches with your movement, and the secure zipper pockets ensure your keys and phone don't fall out while running.

        Color Options: Charcoal Grey, Navy Blue, Black with White Stripe

        Specifications:
        Material: Polyester-Elastane Blend (NS Lycra)
        Fit: Slim Tapered
        Pockets: 2 Side Zipper Pockets
        Cuff: Ribbed ankle cuffs

        Benefits:
        Secure Storage: Zippers keep essentials safe.
        Versatile: Looks good in the gym and at the cafe.
        Comfort: Soft inner texture prevents itching.`,
        999,
        "https://i.pinimg.com/originals/67/46/08/6746080f22f74777acc0ef235ddc9d03.jpg"
      ],
      [
        "Women's High-Impact Sports Bra",
        "Sportswear",
        "Maximum support sports bra with padded cups and a racerback design for running and HIIT workouts.",
        `Product Description – High-Support Racerback Sports Bra

        Say goodbye to bounce. This High-Impact Sports Bra is designed for intense activities like running, aerobics, and Zumba. Featuring molded padded cups and a wide under-bust band, it provides superior lift and stability without digging into your skin.

        Color Options: Black, White, Neon Pink, Grey Marl

        Specifications:
        Fabric: Moisture-wicking Spandex Blend
        Support Level: High Impact
        Padding: Removable pads
        Style: Racerback

        Benefits:
        Bounce Control: Keeps everything secure during jumping.
        Breathable: Mesh details prevent sweat buildup.
        Shape: Removable pads offer customizable coverage.`,
        1099,
        "https://m.media-amazon.com/images/I/81n77GdpV2L.jpg"
      ],
      [
        "Men's Lightweight Running Shoes",
        "Sportswear",
        "Breathable mesh running shoes with EVA cushioning for daily jogging, walking, and gym training.",
        `Product Description – Men's Breathable Running Trainers

        Run further and faster. These Lightweight Running Shoes feature a porous mesh upper that allows your feet to breathe, preventing overheating. The EVA foam sole absorbs shock with every step, reducing impact on your knees and joints.

        Color Options: Grey & Green, Blue & Orange, Black & White

        Specifications:
        Upper Material: Breathable Air Mesh
        Sole Material: EVA / Phylon (Lightweight)
        Closure: Lace-up
        Weight: Approx 250g per shoe
        Usage: Road running, Treadmill, Walking

        Benefits:
        Shock Absorption: Protects joints during impact.
        Airflow: Keeps feet cool and reduces sweat.
        Lightweight: Reduces fatigue during long walks or runs.`,
        1599,
        "https://m.media-amazon.com/images/I/71qvyIalvlL._AC_UY900_.jpg"
      ],
      [
        "Women's Printed Ethnic Kurta Set",
        "Fashion",
        "Elegant rayonn blend kurta with palazzos, featuring intricate embroidery perfect for festive and casual wear.",
        `Product Description – Women's Printed Kurta & Palazzo Set

        Embrace traditional elegance with a modern twist. This printed Kurta Set includes a stylish straight-cut kurta and matching comfortable palazzo pants. Made from high-quality fabric that drapes beautifully, it is perfect for office wear, family gatherings, or small festive events.

        Color Options: Teal Green, Mustard Yellow, Rani Pink

        Specifications:
        Fabric: Viscose Rayon Blend
        Sleeve Length: Three-Quarter Sleeves
        Neck Type: Mandarin Collar / Round Neck with notch
        Set Includes: 1 Kurta, 1 Palazzo
        Print Type: Gold foil print / Floral motifs

        Benefits:
        Ready-to-Wear: No need for stitching or matching bottoms.
        Breathable: Light and airy fit.
        Color Protection: Fabric treated to resist fading.`,
        1299,
        "https://juniperfashion.com/cdn/shop/files/J4992OT13RAMAGREEN_1.jpg"
      ]
    ]
  },
  Books: [
    [
      "Atomic Habits by James Clear",
      "Books",
      "The #1 New York Times bestseller offering a proven framework for improving every day by building good habits and breaking bad ones.",
      `Book Overview – Atomic Habits

      People think when you want to change your life, you need to think big. But world-renowned habits expert James Clear has discovered another way. He knows that real change comes from the compound effect of hundreds of small decisions—doing two push-ups a day, waking up five minutes earlier, or reading just one short page. He calls them Atomic Habits.

      About the Book:
      Author: James Clear
      Genre: Self-Help / Personal Development
      Format: Paperback / Hardcover
      Publisher: Penguin Random House
      Pages: 320

      Key Key Takeaways:
      The 1% Rule: Improving by just 1% every day leads to massive results over time.
      System vs. Goals: Focus on the system (the process) rather than the goal (the result).
      Identity Change: The most effective way to change your habits is to focus not on what you want to achieve, but on who you want to become.

      Why Read This?
      If you’re having trouble changing your habits, the problem isn’t you. The problem is your system. This book gives you a practical guide to restructuring your environment to make success inevitable.`,
      520,
      "https://m.media-amazon.com/images/I/91bYsX41DVL._AC_UY327_FMwebp_QL65_.jpg"
    ],
    [
      "The Psychology of Money",
      "Books",
      "Timeless lessons on wealth, greed, and happiness. A must-read guide on how to think about money differently.",
      `Book Overview – The Psychology of Money

      Doing well with money isn’t necessarily about what you know. It’s about how you behave. And behavior is hard to teach, even to really smart people. In this book, award-winning author Morgan Housel shares 19 short stories exploring the strange ways people think about money and teaches you how to make better sense of one of life’s most important topics.

      About the Book:
      Author: Morgan Housel
      Genre: Finance / Business
      Publisher: Jaico Publishing House
      Pages: 252

      Key Themes:
      Luck & Risk: Understanding that financial success is often a mix of hard work and luck.
      Compounding: The most powerful force in finance that requires patience.
      Getting Wealthy vs. Staying Wealthy: Two very different skills.

      Who is this for?
      Perfect for beginners in investing, experts looking for a fresh perspective, or anyone who wants to have a healthier relationship with their finances without getting bogged down in complex math.`,
      345,
      "https://m.media-amazon.com/images/I/71g2ednj0JL._AC_UY327_FMwebp_QL65_.jpg"
    ],
    [
      "Wings of Fire: An Autobiography",
      "Books",
      "The inspiring true story of Dr. A.P.J. Abdul Kalam, from a humble boy in Rameswaram to the President of India.",
      `Book Overview – Wings of Fire

      One of the most inspiring books ever written in India. This is the story of Kalam, who from very humble beginnings rose to become a key player in Indian space research and missile programs, and later became the 11th President of India. It is a story of courage, belief, and the power of dreams.

      About the Book:
      Authors: A.P.J. Abdul Kalam & Arun Tiwari
      Genre: Autobiography / Biography
      Publisher: Universities Press
      Pages: 180

      Highlights:
      Early Life: His childhood in Rameswaram and the lessons from his parents.
      Scientific Journey: Inside stories of ISRO, DRDO, and the Agni/Prithvi missile launches.
      Leadership: Lessons on managing failure and leading teams.

      Why Read This?
      It is not just a biography; it is a manual on how to face difficulties with a smile. Essential reading for every student and young professional in India.`,
      325,
      "https://jamesclear.com/wp-content/uploads/2019/04/Atomic-Habits-image-e1556227442177.jpg"
    ],
    [
      "The Palace of Illusions",
      "Books",
      "A magical and lyrical retelling of the Mahabharata from the perspective of Draupadi (Panchaali).",
      `Book Overview – The Palace of Illusions

      We have all heard the Mahabharata, but never like this. Chitra Banerjee Divakaruni takes us back to a time that is half-history, half-myth, and wholly magical. Through Draupadi’s eyes, we see the epic saga of war, love, duty, and destiny. It is a story of a woman living in a man’s world.

      About the Book:
      Author: Chitra Banerjee Divakaruni
      Genre: Mythological Fiction / Historical Fiction
      Publisher: Pan Macmillan India
      Pages: 384

      Plot Points:
      Draupadi's birth from fire.
      Her complicated friendship with Krishna.
      Her secret attraction to her husbands' greatest enemy, Karna.
      The great war of Kurukshetra viewed from the domestic quarters.

      Why Read This?
      If you love mythology but want a fresh, feminist, and deeply emotional perspective on the Indian Epic, this modern classic is unputdownable.`,
      390,
      "https://m.media-amazon.com/images/I/71W4BFX7CkL._SL1000_.jpg"
    ],
    [
      "Ikigai: The Japanese Secret to a Long and Happy Life",
      "Books",
      "Discover the secrets of the world’s longest-living people and find your own reason for being.",
      `Book Overview – Ikigai

      What is your reason for getting up in the morning? According to the Japanese, everyone has an 'Ikigai'—a reason for living. This book touches on the lifestyle of the residents of Okinawa, Japan (a Blue Zone), and reveals their secrets to longevity, happiness, and health.

      About the Book:
      Authors: Hector Garcia & Francesc Miralles
      Genre: Lifestyle / Philosophy
      Publisher: Random House UK
      Pages: 208

      Key Concepts:
      The 80% Rule: Eat only until you are 80% full.
      Moai: Surrounded by good friends.
      Flow: Finding joy in the work you do.
      Diagram: Finding the intersection of What you love, What you are good at, What the world needs, and What you can be paid for.

      Why Read This?
      A short, calming, and beautiful book that helps you slow down and appreciate the small joys of life while finding your purpose.`,
      380,
      "https://thecriticalscript.com/public/uploads/blog/636501303ded1_tmpphpmvjaxn.jpg"
    ]
  ]
};
