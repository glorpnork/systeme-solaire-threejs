// Vitesses augmentées (multipliées par 5 pour plus de dynamisme)
export const planetsData = [
  {
    name: "Mercure",
    size: 1.2,
    distance: 28,
    speed: 0.2, // Était 0.04
    texture: "textures/2k_mercury.jpg",
    atmosphereTexture: null,
    ringTexture: null
  },
  {
    name: "Venus",
    size: 2.5,
    distance: 44,
    speed: 0.075, // Était 0.015
    texture: "textures/2k_venus_surface.jpg",
    atmosphereTexture: "textures/2k_venus_atmosphere.jpg",
    ringTexture: null
  },
  {
    name: "Terre",
    size: 3,
    distance: 62,
    speed: 0.05, // Était 0.01
    texture: "textures/2k_earth_daymap.jpg",
    atmosphereTexture: null,
    ringTexture: null
  },
  {
    name: "Mars",
    size: 1.8,
    distance: 78,
    speed: 0.04, // Était 0.008
    texture: "textures/2k_mars.jpg",
    atmosphereTexture: null,
    ringTexture: null
  },
  {
    name: "Jupiter",
    size: 8,
    distance: 110,
    speed: 0.01, // Était 0.002
    texture: "textures/2k_jupiter.jpg",
    atmosphereTexture: null,
    ringTexture: null
  },
  {
    name: "Saturne",
    size: 6.5,
    distance: 150,
    speed: 0.0045, // Était 0.0009
    texture: "textures/2k_saturn.jpg",
    atmosphereTexture: null,
    ringTexture: "textures/2k_saturn_ring_alpha.png"
  },
  {
    name: "Uranus",
    size: 4.5,
    distance: 190,
    speed: 0.002, // Était 0.0004
    texture: "textures/2k_uranus.jpg",
    atmosphereTexture: null,
    ringTexture: null
  },
  {
    name: "Neptune",
    size: 4.3,
    distance: 230,
    speed: 0.0005, // Était 0.0001
    texture: "textures/2k_neptune.jpg",
    atmosphereTexture: null,
    ringTexture: null
  }
];

const RAW_PLANET_DATA = {
  soleil: {
    name: 'Soleil',
    color: '#FDB813',
    facts: ['Diamètre : 1 391 000 km', 'Âge : 4,6 milliards d\'années', 'Température : 5 778 K en surface'],
    audioText: 'Le Soleil est notre étoile. Naine jaune vieille de 4,6 milliards d\'années, son diamètre est 109 fois celui de la Terre. Il représente 99,8 pourcent de la masse du système solaire. Sa chaleur et sa lumière rendent la vie possible sur Terre.'
  },
  mercure: {
    name: 'Mercure',
    color: '#b5b5b5',
    facts: ['Diamètre : 4 879 km', 'Orbite : 88 jours terrestres', 'Températures : -180°C à +430°C'],
    audioText: 'Mercure est la planète la plus proche du Soleil et la plus petite du système solaire.'
  },
  venus: {
    name: 'Vénus',
    color: '#e8cda0',
    facts: ['Diamètre : 12 104 km', 'Température : 465°C en moyenne', 'Pression : 92× celle de la Terre'],
    audioText: 'Vénus est la planète la plus chaude du système solaire, avec une température moyenne de 465 degrés Celsius.'
  },
  terre: {
    name: 'Terre',
    color: '#2e86ab',
    facts: ['Diamètre : 12 742 km', '71% de surface recouverte d\'eau', '1 satellite naturel : la Lune'],
    audioText: 'La Terre est notre planète natale, la seule connue à abriter la vie dans l\'univers.'
  },
  mars: {
    name: 'Mars',
    color: '#c1440e',
    facts: ['Diamètre : 6 779 km', 'Olympus Mons : 22 km de haut', '2 lunes : Phobos et Déimos'],
    audioText: 'Mars est la planète rouge, sa couleur provenant de l\'oxyde de fer dans son sol.'
  },
  jupiter: {
    name: 'Jupiter',
    color: '#c88b3a',
    facts: ['Diamètre : 139 820 km', '95 lunes connues', 'Grande Tache Rouge : 350+ ans'],
    audioText: 'Jupiter est la plus grande planète du système solaire, avec un diamètre 11 fois celui de la Terre.'
  },
  saturne: {
    name: 'Saturne',
    color: '#e4d191',
    facts: ['Diamètre : 116 460 km', 'Anneaux : glace et rochers', '146 lunes dont Titan'],
    audioText: 'Saturne est reconnaissable à ses magnifiques anneaux, composés de glace et de rochers.'
  },
  uranus: {
    name: 'Uranus',
    color: '#7de8e8',
    facts: ['Diamètre : 50 724 km', 'Axe incliné à 98 degrés', 'Température : -224°C'],
    audioText: 'Uranus est une géante de glace avec une particularité unique : elle tourne sur le côté.'
  },
  neptune: {
    name: 'Neptune',
    color: '#3f54ba',
    facts: ['Diamètre : 4 9 244 km', 'Vents : jusqu\'à 2 100 km/h', '1 orbite = 165 ans terrestres'],
    audioText: 'Neptune est la planète la plus éloignée du Soleil.'
  }
};

export const PLANET_DATA = {};
Object.keys(RAW_PLANET_DATA).forEach(key => {
  const data = RAW_PLANET_DATA[key];
  let radius = 16;
  const matched3D = planetsData.find(p => p.name.toLowerCase() === data.name.toLowerCase() || (key === 'venus' && p.name === 'Venus'));
  if (matched3D) radius = matched3D.size;

  // Double affectation (Minuscule ET Majuscule) pour être certain que le module VR trouve la donnée
  const infoObj = {
    title: data.name,
    text: data.facts.join('\n'),
    audioText: data.audioText,
    radius: radius
  };

  PLANET_DATA[data.name] = infoObj;
  PLANET_DATA[data.name.toLowerCase()] = infoObj;
  if (data.name === 'Vénus') PLANET_DATA['Venus'] = infoObj;
});