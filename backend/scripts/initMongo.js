// Подключаемся к MongoDB с аутентификацией
db = connect("mongodb://root:example@localhost:27017/techTrackInvestMongo?authSource=admin");

// Проверяем подключение
if (!db) {
    print("Ошибка подключения к MongoDB");
    quit(1);
}

print("Успешное подключение к MongoDB");

// Очищаем существующие коллекции
db.articles.drop();
db.niches.drop();
db.conferences.drop();
db.contracts.drop();
db.solutions.drop();
db.crises.drop();
db.startups.drop();

db.articles.insertOne({
  _id: "article-1",
  title: "Top 10 Energy Startups",
  content: "Here are the most promising startups in the green energy niche..."
});

db.niches.insertMany([
  {
  _id: "niche-1",
  name: "GreenTech"},
  {
    _id: "niche-2",
    name: "MedTech"
  },
  {
    _id: "niche-3",
    name: "SpaceTech"
  },
  {
    _id: "niche-4",
    name: "IT"
  }
]);

db.conferences.insertMany([
  {
    _id: "conf-green-1",
    name: "Global Solar Innovation Summit",
    description: "Международный саммит по инновациям в солнечной энергетике и интеграции возобновляемых источников в энергосети",
    nicheId: "niche-1",
    enrollPrice: 300,
    gainedReputation: 60,
    expertise: [{ nicheId: "niche-1", change: 12 }]
  },
  {
    _id: "conf-green-2",
    name: "WindTech Symposium",
    description: "Семинар по последним достижениям в области ветроэнергетики и морским ветряным электростанциям",
    nicheId: "niche-1",
    enrollPrice: 450,
    gainedReputation: 75,
    expertise: [{ nicheId: "niche-1", change: 15 }]
  },
  {
    _id: "conf-green-3",
    name: "Circular Economy Forum",
    description: "Форум по технологиям циркулярной экономики и переработки промышленных отходов",
    nicheId: "niche-1",
    enrollPrice: 250,
    gainedReputation: 55,
    expertise: [{ nicheId: "niche-1", change: 10 }]
  },
  {
    _id: "conf-green-4",
    name: "Smart Cities Expo",
    description: "Выставка экологичных решений для умных городов: от энергоэффективности до эко-транспорта",
    nicheId: "niche-1",
    enrollPrice: 400,
    gainedReputation: 80,
    expertise: [{ nicheId: "niche-1", change: 18 }]
  },

  {
    _id: "conf-med-1",
    name: "Future Surgery Conference",
    description: "Конференция по роботизированной хирургии и AI-ассистированным медицинским операциям",
    nicheId: "niche-2",
    enrollPrice: 600,
    gainedReputation: 90,
    expertise: [{ nicheId: "niche-2", change: 20 }]
  },
  {
    _id: "conf-med-2",
    name: "BioPrinting Symposium",
    description: "Саммит по 3D-биопечати и созданию искусственных органов",
    nicheId: "niche-2",
    enrollPrice: 550,
    gainedReputation: 85,
    expertise: [{ nicheId: "niche-2", change: 18 }]
  },
  {
    _id: "conf-med-3",
    name: "NeuroTech Summit",
    description: "Исследования в области нейроинтерфейсов и мозго-компьютерных интерфейсов",
    nicheId: "niche-2",
    enrollPrice: 500,
    gainedReputation: 80,
    expertise: [{ nicheId: "niche-2", change: 15 }]
  },
  {
    _id: "conf-med-4",
    name: "Digital Health Expo",
    description: "Выставка телемедицинских решений и носимых медицинских устройств",
    nicheId: "niche-2",
    enrollPrice: 450,
    gainedReputation: 75,
    expertise: [{ nicheId: "niche-2", change: 12 }]
  },

  {
    _id: "conf-space-1",
    name: "New Space Economy Forum",
    description: "Форум частной космонавтики: от микроспутников до орбитальных станций",
    nicheId: "niche-3",
    enrollPrice: 800,
    gainedReputation: 100,
    expertise: [{ nicheId: "niche-3", change: 25 }]
  },
  {
    _id: "conf-space-2",
    name: "Mars Colonization Symposium",
    description: "Технологии для создания самоподдерживающихся колоний на Марсе",
    nicheId: "niche-3",
    enrollPrice: 750,
    gainedReputation: 95,
    expertise: [{ nicheId: "niche-3", change: 22 }]
  },
  {
    _id: "conf-space-3",
    name: "Satellite Innovation Summit",
    description: "Саммит по новым технологиям в области спутниковой связи и дистанционного зондирования",
    nicheId: "niche-3",
    enrollPrice: 700,
    gainedReputation: 90,
    expertise: [{ nicheId: "niche-3", change: 20 }]
  },
  {
    _id: "conf-space-4",
    name: "Reusable Rocket Congress",
    description: "Конгресс по разработке многоразовых ракет-носителей и систем космического запуска",
    nicheId: "niche-3",
    enrollPrice: 850,
    gainedReputation: 110,
    expertise: [{ nicheId: "niche-3", change: 28 }]
  },

  {
    _id: "conf-it-1",
    name: "AI Revolution Conference",
    description: "Конференция по этике ИИ и глубокому машинному обучению",
    nicheId: "niche-4",
    enrollPrice: 400,
    gainedReputation: 70,
    expertise: [{ nicheId: "niche-4", change: 15 }]
  },
  {
    _id: "conf-it-2",
    name: "Quantum Computing Summit",
    description: "Саммит по разработке квантовых компьютеров и их промышленному применению",
    nicheId: "niche-4",
    enrollPrice: 600,
    gainedReputation: 95,
    expertise: [{ nicheId: "niche-4", change: 20 }]
  },
  {
    _id: "conf-it-3",
    name: "CyberSecurity Expo",
    description: "Выставка решений в области кибербезопасности и защиты критической инфраструктуры",
    nicheId: "niche-4",
    enrollPrice: 500,
    gainedReputation: 80,
    expertise: [{ nicheId: "niche-4", change: 18 }]
  },
  {
    _id: "conf-it-4",
    name: "Blockchain Revolution Forum",
    description: "Форум по децентрализованным финансам и смарт-контрактам нового поколения",
    nicheId: "niche-4",
    enrollPrice: 550,
    gainedReputation: 85,
    expertise: [{ nicheId: "niche-4", change: 22 }]
  },
  {
    _id: "conf-green-5",
    name: "Hydrogen Future Congress",
    description: "Разработка технологий зеленого водорода и систем хранения энергии",
    nicheId: "niche-1",
    enrollPrice: 350,
    gainedReputation: 65,
    expertise: [{ nicheId: "niche-1", change: 14 }]
  },
  {
    _id: "conf-green-6",
    name: "BioEnergy Symposium",
    description: "Инновации в производстве биотоплива из органических отходов",
    nicheId: "niche-1",
    enrollPrice: 280,
    gainedReputation: 58,
    expertise: [{ nicheId: "niche-1", change: 11 }]
  },
  {
    _id: "conf-green-7",
    name: "Arctic CleanTech Summit",
    description: "Технологии для работы в экстремальных условиях Арктики",
    nicheId: "niche-1",
    enrollPrice: 420,
    gainedReputation: 78,
    expertise: [{ nicheId: "niche-1", change: 17 }]
  },
  {
    _id: "conf-green-8",
    name: "AgroTech Revolution Forum",
    description: "Умные решения для устойчивого сельского хозяйства",
    nicheId: "niche-1",
    enrollPrice: 320,
    gainedReputation: 62,
    expertise: [{ nicheId: "niche-1", change: 13 }]
  },

  {
    _id: "conf-med-5",
    name: "CRISPR Genome Editing Congress",
    description: "Передовые методы генной инженерии и терапии",
    nicheId: "niche-2",
    enrollPrice: 700,
    gainedReputation: 95,
    expertise: [{ nicheId: "niche-2", change: 22 }]
  },
  {
    _id: "conf-med-6",
    name: "NanoMed Symposium",
    description: "Нанороботы для целевой доставки лекарств",
    nicheId: "niche-2",
    enrollPrice: 650,
    gainedReputation: 88,
    expertise: [{ nicheId: "niche-2", change: 19 }]
  },
  {
    _id: "conf-med-7",
    name: "Digital Twin in Healthcare Summit",
    description: "Создание цифровых двойников для персонализированной медицины",
    nicheId: "niche-2",
    enrollPrice: 580,
    gainedReputation: 82,
    expertise: [{ nicheId: "niche-2", change: 16 }]
  },
  {
    _id: "conf-med-8",
    name: "Future Prosthetics Expo",
    description: "Бионические протезы с нейроинтерфейсом",
    nicheId: "niche-2",
    enrollPrice: 720,
    gainedReputation: 98,
    expertise: [{ nicheId: "niche-2", change: 24 }]
  },

  {
    _id: "conf-space-5",
    name: "Lunar Base Architecture Congress",
    description: "Проектирование постоянной базы на Луне",
    nicheId: "niche-3",
    enrollPrice: 900,
    gainedReputation: 115,
    expertise: [{ nicheId: "niche-3", change: 30 }]
  },
  {
    _id: "conf-space-6",
    name: "Asteroid Mining Symposium",
    description: "Технологии добычи полезных ископаемых на астероидах",
    nicheId: "niche-3",
    enrollPrice: 880,
    gainedReputation: 110,
    expertise: [{ nicheId: "niche-3", change: 28 }]
  },
  {
    _id: "conf-space-7",
    name: "Space Tourism Summit",
    description: "Развитие инфраструктуры для космического туризма",
    nicheId: "niche-3",
    enrollPrice: 820,
    gainedReputation: 105,
    expertise: [{ nicheId: "niche-3", change: 25 }]
  },
  {
    _id: "conf-space-8",
    name: "Orbital Debris Solutions Forum",
    description: "Методы очистки околоземной орбиты от космического мусора",
    nicheId: "niche-3",
    enrollPrice: 780,
    gainedReputation: 100,
    expertise: [{ nicheId: "niche-3", change: 23 }]
  },


  {
    _id: "conf-it-5",
    name: "Metaverse Architecture Congress",
    description: "Создание инфраструктуры для параллельных цифровых вселенных",
    nicheId: "niche-4",
    enrollPrice: 480,
    gainedReputation: 75,
    expertise: [{ nicheId: "niche-4", change: 17 }]
  },
  {
    _id: "conf-it-6",
    name: "IoT for Smart Factories Summit",
    description: "Промышленный интернет вещей для Industry 4.0",
    nicheId: "niche-4",
    enrollPrice: 530,
    gainedReputation: 83,
    expertise: [{ nicheId: "niche-4", change: 19 }]
  },
  {
    _id: "conf-it-7",
    name: "Post-Quantum Cryptography Forum",
    description: "Защита данных в эпоху квантовых компьютеров",
    nicheId: "niche-4",
    enrollPrice: 610,
    gainedReputation: 92,
    expertise: [{ nicheId: "niche-4", change: 21 }]
  },
  {
    _id: "conf-it-8",
    name: "AI Governance Symposium",
    description: "Этическое регулирование искусственного интеллекта",
    nicheId: "niche-4",
    enrollPrice: 570,
    gainedReputation: 87,
    expertise: [{ nicheId: "niche-4", change: 20 }]
  }
]);



const solution = {
  _id: "solution-1",
  title: "Government Grant",
  description: "Get support from the government to mitigate crisis impact.",
  effect: {
    price: -500,
    expenses: -200,
    team: -1,
    product: 3,
    reputation: 10
  }
};
db.solutions.insertOne(solution);

db.crises.insertOne({
  _id: "crisis-1",
  name: "Solar Panel Shortage",
  description: "Shortage in raw materials impacts solar panel production.",
  danger: 3,
  niches: ["niche-1"],
  possibleSolutions: [solution]
});





const startups = [];
const contracts = [];


const niches = [
  {id: "niche-1", name: "GreenTech"},
  {id: "niche-2", name: "MedTech"},
  {id: "niche-3", name: "SpaceTech"},
  {id: "niche-4", name: "IT"}
];

niches.forEach((niche, nicheIndex) => {
  for(let i = 1; i <= 8; i++) {
    const startupId = `startup-${niche.name.toLowerCase()}-${i}`;


    const basePrice = 3000 + (i * 500);
    const teamSize = 5 + i;
    const productQuality = 5 + Math.floor(i * 0.8);
    const reputation = 60 + (i * 3);


    startups.push({
      _id: startupId,
      name: `${niche.name} Innovators #${i}`,
      description: `Передовые решения в области ${niche.name} - ${getStartupDescription(niche.name, i)}`,
      price: basePrice,
      uniqueProductOffer: getUniqueOffer(niche.name, i),
      lastMonthRevenue: 8000 + (i * 1000),
      expenses: 2000 + (i * 300),
      team: teamSize,
      budget: 10000 + (i * 2000),
      product: productQuality,
      reputation: reputation,
      level: Math.floor(i/3) + 1,
      stage: getStage(i),
      niche: niche.id
    });


    contracts.push({
      _id: `contract-${niche.name.toLowerCase()}-${i}`,
      startupId: startupId,
      minPrice: basePrice * 0.3,
      maxPrice: basePrice * 0.7,
      teamEffect: Math.floor(i/2) + 1,
      reputationEffect: 3 + (i % 4)
    });
  }
});


function getStartupDescription(niche, index) {
  const descriptions = {
    GreenTech: [
      "Солнечные панели с КПД 35%",
      "Ветрогенераторы для городской среды",
      "Система рециклинга пластика",
      "Биотопливо из водорослей",
      "Умные энергосети",
      "Эко-стройматериалы",
      "Зеленый водород",
      "Контроль качества воздуха"
    ],
    MedTech: [
      "ИИ для диагностики рака",
      "Бионические протезы",
      "Наноботы для доставки лекарств",
      "Цифровой двойник органов",
      "Генная терапия",
      "Телемедицинская платформа",
      "Импланты с сенсорами",
      "VR-реабилитация"
    ],
    SpaceTech: [
      "Мини-спутники связи",
      "Ракетные двигатели на метане",
      "Космический 3D-принтер",
      "Орбитальная солнечная станция",
      "Лунный ровер",
      "Система уборки космического мусора",
      "Космическая оранжерея",
      "Гиперзвуковые двигатели"
    ],
    IT: [
      "AI-оптимизация бизнес-процессов",
      "Квантовые алгоритмы",
      "Блокчейн для логистики",
      "Кибербезопасность для IoT",
      "AR-платформа для ритейла",
      "Нейроинтерфейсы управления",
      "Распределенные вычисления",
      "Генеративные дизайн-системы"
    ]
  };
  return descriptions[niche][index-1];
}

function getUniqueOffer(niche, index) {
  const offers = {
    GreenTech: ["Эко-сертификация", "Государственная поддержка", "Патентованные технологии", "Нулевые выбросы"],
    MedTech: ["FDA approval", "Клинические испытания", "Индивидуальный подход", "Медицинская лицензия"],
    SpaceTech: ["NASA партнерство", "Сертификация ESA", "Уникальные материалы", "Орбитальные испытания"],
    IT: ["Патентованные алгоритмы", "Криптозащита", "Облачная интеграция", "Масштабируемость"]
  };
  return offers[niche][index % 4] + ` +${index * 5}% эффективности`;
}

function getStage(index) {
  const stages = ["IDEA", "MVP", "SCALE", "MARKET"];
  return stages[index % 4];
}


db.startups.insertMany(startups);
db.contracts.insertMany(contracts);
