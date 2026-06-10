export const planetsData = [
  {
    name: "Mercure",
    size: 1.2,
    distance: 28,
    speed: 0.07,
    texture: "textures/2k_mercury.jpg"
  },
  {
    name: "Venus",
    size: 2.5,
    distance: 44,
    speed: 0.025,
    texture: "textures/2k_venus_surface.jpg",
    atmosphereTexture: "textures/2k_venus_atmosphere.jpg"
  },
  {
    name: "Terre",
    size: 3,
    distance: 62,
    speed: 0.018,
    texture: "textures/2k_earth_daymap.jpg",
    moons: [
      { name: "Lune", radius: 0.72, distance: 6.5, speed: 0.12, texture: "textures/2k_moon.jpg", tilt: 0.09 }
    ]
  },
  {
    name: "Mars",
    size: 1.8,
    distance: 78,
    speed: 0.04,
    texture: "textures/2k_mars.jpg",
    moons: [
      { name: "Phobos",  radius: 0.18, distance: 3.2, speed: 0.55, color: 0x8a7a6a, tilt: 0.02 },
      { name: "Déimos",  radius: 0.13, distance: 5.0, speed: 0.22, color: 0x9a8a7a, tilt: 0.05 }
    ]
  },
  {
    name: "Jupiter",
    size: 8,
    distance: 110,
    speed: 0.01,
    texture: "textures/2k_jupiter.jpg",
    moons: [
      { name: "Io",       radius: 0.38, distance: 13,  speed: 0.30, color: 0xe8c040, tilt: 0.00 },
      { name: "Europe",   radius: 0.32, distance: 17,  speed: 0.20, color: 0xd0c8b8, tilt: 0.01 },
      { name: "Ganymède", radius: 0.50, distance: 22,  speed: 0.13, color: 0xb0a080, tilt: 0.01 },
      { name: "Callisto", radius: 0.45, distance: 29,  speed: 0.08, color: 0x706050, tilt: 0.03 }
    ]
  },
  {
    name: "Saturne",
    size: 6.5,
    distance: 150,
    speed: 0.0045,
    texture: "textures/2k_saturn.jpg",
    ringTexture: "textures/2k_saturn_ring_alpha.png",
    moons: [
      { name: "Encelade", radius: 0.20, distance: 11,  speed: 0.28, color: 0xf0f0f8, tilt: 0.00 },
      { name: "Titan",    radius: 0.48, distance: 16,  speed: 0.14, color: 0xd09040, tilt: 0.03 },
      { name: "Rhéa",     radius: 0.24, distance: 21,  speed: 0.08, color: 0xc0b8b0, tilt: 0.01 }
    ]
  },
  {
    name: "Uranus",
    size: 4.5,
    distance: 190,
    speed: 0.002,
    texture: "textures/2k_uranus.jpg",
    moons: [
      { name: "Miranda", radius: 0.18, distance: 7.5,  speed: 0.32, color: 0xa0a0b0, tilt: 1.51 },
      { name: "Ariel",   radius: 0.24, distance: 10,   speed: 0.22, color: 0xb8b8c8, tilt: 1.51 },
      { name: "Titania", radius: 0.28, distance: 14,   speed: 0.12, color: 0xa8a0a0, tilt: 1.51 }
    ]
  },
  {
    name: "Neptune",
    size: 4.3,
    distance: 230,
    speed: 0.0005,
    texture: "textures/2k_neptune.jpg",
    moons: [
      { name: "Triton", radius: 0.35, distance: 9, speed: -0.18, color: 0x8898b8, tilt: 2.75 }
    ]
  }
];

// Ton dictionnaire personnalisé d'origine complet
const RAW_PLANET_DATA = {
  soleil: {
    name: 'Soleil',
    color: '#FDB813',
    facts: [
      'Diamètre : 1 391 000 km',
      'Âge : 4,6 milliards d\'années',
      'Température : 5 778 K en surface'
    ],
    audioText: 'Le Soleil est notre étoile. Naine jaune vieille de 4,6 milliards d\'années, son diamètre est 109 fois celui de la Terre. Il représente 99,8 pourcent de la masse du système solaire. Sa chaleur et sa lumière rendent la vie possible sur Terre.'
  },
  mercure: {
    name: 'Mercure',
    color: '#b5b5b5',
    facts: [
      'Diamètre : 4 879 km',
      'Orbite : 88 jours terrestres',
      'Températures : -180°C à +430°C'
    ],
    audioText: 'Mercure est la planète la plus proche du Soleil et la plus petite du système solaire. Une année sur Mercure ne dure que 88 jours terrestres. Sans atmosphère pour retenir la chaleur, ses températures varient de moins 180 à plus 430 degrés Celsius.'
  },
  venus: {
    name: 'Vénus',
    color: '#e8cda0',
    facts: [
      'Diamètre : 12 104 km',
      'Température : 465°C en moyenne',
      'Pression : 92× celle de la Terre'
    ],
    audioText: 'Vénus est la planète la plus chaude du système solaire, avec une température moyenne de 465 degrés Celsius. Son épaisse atmosphère de dioxyde de carbone provoque un effet de serre extrême. Fait surprenant, Vénus tourne dans le sens inverse des autres planètes.'
  },
  terre: {
    name: 'Terre',
    color: '#2e86ab',
    facts: [
      'Diamètre : 12 742 km',
      '71% de surface recouverte d\'eau',
      '1 satellite naturel : la Lune'
    ],
    audioText: 'La Terre est notre planète natale, la seule connue à abriter la vie dans l\'univers. Elle possède une atmosphère riche en azote et en oxygène. 71 pourcent de sa surface est recouverte d\'eau. Sa Lune stabilise son axe de rotation et génère les marées océaniques.'
  },
  mars: {
    name: 'Mars',
    color: '#c1440e',
    facts: [
      'Diamètre : 6 779 km',
      'Olympus Mons : 22 km de haut',
      '2 lunes : Phobos et Déimos'
    ],
    audioText: 'Mars est la planète rouge, sa couleur provenant de l\'oxyde de fer dans son sol. Elle abrite l\'Olympus Mons, le plus grand volcan du système solaire avec 22 kilomètres de hauteur. Des missions spatiales ont confirmé la présence d\'eau glacée à ses pôles.'
  },
  jupiter: {
    name: 'Jupiter',
    color: '#c88b3a',
    facts: [
      'Diamètre : 139 820 km',
      '95 lunes connues',
      'Grande Tache Rouge : 350+ ans'
    ],
    audioText: 'Jupiter est la plus grande planète du système solaire, avec un diamètre 11 fois celui de la Terre. Sa célèbre Grande Tache Rouge est une tempête qui dure depuis plus de 350 ans. Sa lune Europe possède un océan sous-glaciaire, candidat à la vie extraterrestre.'
  },
  saturne: {
    name: 'Saturne',
    color: '#e4d191',
    facts: [
      'Diamètre : 116 460 km',
      'Anneaux : glace et rochers',
      '146 lunes dont Titan'
    ],
    audioText: 'Saturne est reconnaissable à ses magnifiques anneaux, composés de glace et de rochers. C\'est la planète la moins dense du système solaire, si légère qu\'elle flotterait sur l\'eau. Sa lune Titan possède une atmosphère épaisse et des lacs de méthane liquide.'
  },
  uranus: {
    name: 'Uranus',
    color: '#7de8e8',
    facts: [
      'Diamètre : 50 724 km',
      'Axe incliné à 98 degrés',
      'Température : -224°C'
    ],
    audioText: 'Uranus est une géante de glace avec une particularité unique : elle tourne sur le côté, son axe étant incliné à 98 degrés. C\'est la planète la plus froide du système solaire avec des températures descendant à moins 224 degrés Celsius. Elle possède 13 anneaux et 28 lunes connues.'
  },
  neptune: {
    name: 'Neptune',
    color: '#3f54ba',
    facts: [
      'Diamètre : 49 244 km',
      'Vents : jusqu\'à 2 100 km/h',
      '1 orbite = 165 ans terrestres'
    ],
    audioText: 'Neptune est la planète la plus éloignée du Soleil. Elle est battue par les vents les plus violents du système solaire, atteignant 2 100 kilomètres par heure. Une année sur Neptune dure 165 années terrestres. Triton, sa plus grande lune, orbite en sens rétrograde.'
  }
};

// Indexation dynamique à l'épreuve des erreurs d'accents ou de casse (Majuscule/Minuscule)
export const PLANET_DATA = {};
Object.keys(RAW_PLANET_DATA).forEach(key => {
  const item = RAW_PLANET_DATA[key];
  let size = 3;
  const match = planetsData.find(p => p.name.toLowerCase() === item.name.toLowerCase() || (key === 'venus' && p.name === 'Venus'));
  if (match) size = match.size;
  if (key === 'soleil') size = 16;

  const dataFormatted = {
    title: item.name,
    text: item.facts.join('\n'),
    audioText: item.audioText,
    radius: size
  };

  // On enregistre sous toutes les formes possibles pour couvrir Vénus/Venus et Terre/terre
  PLANET_DATA[item.name] = dataFormatted;
  PLANET_DATA[item.name.toLowerCase()] = dataFormatted;
  if (item.name === "Vénus") PLANET_DATA["Venus"] = dataFormatted;
});