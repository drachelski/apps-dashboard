
export interface App {
    appId: AppNames;
    title: string;
    icon: string;
    banner: string;
    package: string;
    description?: string[];
    featured?: boolean;
    isModern?: boolean;
    images?: string[];
}

export enum AppNames {
   dragonpet, realdragonpet, dragonpetvr, dragonpetxmass,
   unicornpet, flappydragon, unicornride,
   beautifulbatterywidget, circlebatterywidget,
   elementaljewels, laboratoryjewels,
   pantherswroclaw,
   interstellarlander,
   myrealgirlfriend,
   dragonpet2
}

export const getAppId = (paramId: string): AppNames =>
   AppNames[paramId.toLowerCase()];

export const toAppName = (appId: AppNames): string =>
   AppNames[appId].toLowerCase();

export const getAppFromParamId = (paramId: string): App => {
   const appId = getAppId(paramId);

   return getApp(appId);
}

export const getApp = (appId: AppNames): App => {
   return Apps.filter((app: App) => app.appId === appId)[0];
};

export const getModernApps = () => {
   return Apps.filter((app: App) => {
      return app.isModern;
   });
}

export const getOldApps = () => {
   return Apps.filter((app: App) => {
      return !app.isModern;
   });
}

export const Apps = [
   {
      appId: AppNames.dragonpet2,
      title: "Dragon Pet 2",
      icon: "/img/icons/dp2.png",
      banner: "",
      package: "pl.ntwins.dragonpet2",
      description: [
         "Long awaited sequel of Dragon Pet - the first 3d tamagotchi on mobile. Still in development. This time powered with Unity 3d.",
      ],
      images: [
         "dp2/port1.png", "dp2/port4.png", "dp2/land5.png", "dp2/land1.png", "dp2/port2.png",
         "dp2/land6.png", "dp2/land4.png", "dp2/port9.png", "dp2/port6.png", "dp2/port8.png",
         "dp2/port3.png", "dp2/port5.png", "dp2/port7.png", "dp2/land2.png", "dp2/land3.png",
      ],
      featured: true,
      isModern: true
   },
   {
    appId: AppNames.dragonpet,
    title: "Dragon Pet",
    icon: "/img/icons/dp512.png",
    banner: "/img/promos/banner_dp.jpg",
    package: "eu.aagames.dragopet",
    description: [
      "On the snowy peaks of an ancient mountain you have found a magic dragon egg. All you have to do is to keep it at proper temperature, an it might hatch into a virtual baby pet with whom you can spend wonderful adventures by playing, training and taking care of your cute pet. Train a dragon and become creator of your own saga. Care for him and he will become your best, magic friend or simply ignore him and he will eventually run away, get sick or even die.",
      "Like a modern 3d, virtual pet, his life will go on even after you close game and an icon will notify you anytime your dragon need your help. Hatch your first egg to receive cute tiny dragon. Create your own story and become best dragon pet Trainer in dragons world. Hear yelp of your foes. Visit shops in a dragons city and build this fairlyland."
    ],
    featured: true
 },
 {
    appId: AppNames.realdragonpet,
    title: "Real Dragon Pet",
    icon: "/img/icons/rdp512.png",
    banner: "/img/promos/banner_rdp.jpg",
    package: "eu.aagames.real.dragon.pet",
    description: [
      "Play and have fun with your own Dragon in the real world thanks to Augmented Reality! Newest game from makers of great hit  Dragon Pet",
      "Have you ever wondered how it is to see Dragons in real life, standing next to you? Now you have this chance!"
    ]
 },
 {
    appId: AppNames.dragonpetxmass,
    title: "Dragon Pet Xmass",
    icon: "/img/icons/dpx512.png",
    banner: "/img/promos/banner_dpx.jpg",
    package: "eu.aagames.dragopet.xmass",
    description: [
      "Special Christmas version of Dragon Pet is here!",
      "On the snowy peaks of an ancient mountain you have found a magic dragon egg. All you have to do is to keep it at proper temperature, an it might hatch into a virtual baby pet with whom you can spend wonderful adventures by playing, training and taking care of your cute pet. Train a dragon and become creator of your own saga. Care for him and he will become your best, magic friend or simply ignore him and he will eventually run away, get sick or even die."
    ],
 },
 {
    appId: AppNames.interstellarlander,
    title: "Interstellar Lander",
    icon: "/img/icons/lander512.png",
    banner: "/img/promos/banner_lander.jpg",
    package: "eu.aagames.interstellar.lander",
    description: [
      "Deep under the Earth's surface there is a secret hidden laboratory... For the last 20 years a crazy scienist has been working on a powerful energy source based on natural elements. Your mission is to help him to gather all Elemental Jewels!"
    ]
 },
 {
    appId: AppNames.unicornpet,
    title: "Unicorn Pet",
    icon: "/img/icons/up512.png",
    banner: "/img/promos/banner_up.jpg",
    package: "eu.aagames.unicornpet",
    description: [
      "Unicorn Pet - a new, magical, 3d virtual pet game is here! Pick your pony and enjoy this magical saga in unicorns world.",
      "In the magical world of the Unicorns, life was peaceful and pleasant. That was until the evil Warlock imprisoned nearly all of the unicorns in his ghastly castle and took away their magic power. Fortunately, there's still the good wizard, who, from time to time, manages to free one of those fairy ponies and return their powers.",
      "Will you try taking care one of a saved unicorn ?"
    ],
    featured: true
 },
 {
    appId: AppNames.beautifulbatterywidget,
    title: "Beautiful Battery Widget",
    icon: "/img/icons/bbw512.png",
    banner: "/img/promos/banner_bbw.jpg",
    package: "eu.aagames.widget.battery.beautiful",
    description: [
      "An elegant Battery Widget with battery level on status bar"
    ]
 },
 {
    appId: AppNames.circlebatterywidget,
    title: "Circle Battery Widget",
    icon: "/img/icons/cbw512.png",
    banner: "/img/promos/banner_cbw.jpg",
    package: "eu.aagames.widget.battery.circle",
    description: [
      "Beautifully designed, simple battery widget to optimize battery usage and save some energy"
    ]
 },
 {
    appId: AppNames.elementaljewels,
    title: "Elemental Jewels",
    icon: "/img/icons/ej512.png",
    banner: "/img/promos/banner_ej.jpg",
    package: "eu.aagames.elementaljewels.free",
    description: [
      "Deep under the Earth's surface there is a secret hidden laboratory... For the last 20 years a crazy scienist has been working on a powerful energy source based on natural elements. Your mission is to help him to gather all Elemental Jewels!"
    ]
 },
 {
    appId: AppNames.laboratoryjewels,
    title: "Laboratory Jewels",
    icon: "/img/icons/lj512.png",
    banner: "/img/promos/banner_lj.jpg",
    package: "eu.aagames.laboratory.jewels",
    description: [
      "Discover the secrets of a mysterious laboratory with Laboratory Jewels",
      "Join Doctor Jewel - the crazy professor in the great saga of discovering new chemicals!",
      "Match, switch and mix jewels to create new ones through over 70 levels of pure laboratory adventure! Whether you played the other jewels games, you should try to play this game, it's newest, very addicting and completely free to play!"
    ]
 },
 {
    appId: AppNames.flappydragon,
    title: "Flappy dragon",
    icon: "/img/icons/flappy512.png",
    banner: "/img/promos/banner_flappy.jpg",
    package: "eu.aagames.floppydragon",
    description: [
      "Fly through the sky and avoid trees with your awesome dragon in 3D"
    ]
 },
 {
    appId: AppNames.unicornride,
    title: "Unicorn ride",
    icon: "/img/icons/ur512.png",
    banner: "/img/promos/banner_ur.jpg",
    package: "eu.aagames.unicornride",
    description: [
      "Your mission seems to be simple - one Unicorn baby got separeted from his family and you have to help him in his journey throught Scary Lands, full of monsters and obstacles.",
      "Explore the magic world of unicorns riding them in 3D"
    ]
 },
 {
    appId: AppNames.pantherswroclaw,
    title: "Football Wroclaw Panthers",
    icon: "/img/icons/fwp512.png",
    banner: "/img/promos/banner_fwp.jpg",
    package: "eu.aagames.kick",
    description: [
      "Become a real PLFA Kicker! Live out in the player of Wroclaw Panthers and reach for the cup!"
    ]
 },
 {
    appId: AppNames.myrealgirlfriend,
    title: "My real girlfriend",
    icon: "/img/icons/mrg512.png",
    banner: "/img/promos/banner_mrg.jpg",
    package: "eu.aagames.my.real.girl",
    description: [
      "Play and have fun with your own Girlfriend in the real world thanks to Augmented Reality!"
    ]
 },
 {
    appId: AppNames.dragonpetvr,
    title: "Dragon Pet VR",
    icon: "/img/icons/dpvr512.png",
    banner: "/img/promos/banner_dpvr.jpg",
    package: "eu.aagames.vr.dragonpet",
    description: [
      "Experience the magic of Virtual Reality and feel as you were standing next to your dragon with VR Dragon Pet."
    ],
 },
];