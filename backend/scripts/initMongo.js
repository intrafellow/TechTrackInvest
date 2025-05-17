db = connect("mongodb://root:example@localhost:27017/techTrackInvestMongo?authSource=admin");

if (!db) {
    print("Ошибка подключения к MongoDB");
    quit(1);
}

print("Успешное подключение к MongoDB");

// Очистка коллекций
db.articles.drop();
db.niches.drop();
db.conferences.drop();
db.contracts.drop();
db.solutions.drop();
db.crises.drop();
db.startups.drop();

// Добавление статьи
db.articles.insertOne({
  _id: "article-1",
  title: "Top 10 Energy Startups",
  content: "Here are the most promising startups in the green energy niche..."
});

// Добавление ниш
db.niches.insertMany([
  {_id: "niche-1", name: "GreenTech"},
  {_id: "niche-2", name: "MedTech"},
  {_id: "niche-3", name: "SpaceTech"},
  {_id: "niche-4", name: "IT"}
]);

// Добавление конференций (по 8 для каждой ниши)
db.conferences.insertMany([
  // GreenTech conferences (1-8)
  {
    _id: "conf-niche-1-1",
    name: "GreenTech Conference 1",
    description: "GreenTech conference description 1",
    nicheId: "niche-1",
    enrollPrice: 3500,
    gainedReputation: 5,
    expertise: [{ nicheId: "niche-1", change: 5 }]
  },
  {
    _id: "conf-niche-1-2",
    name: "GreenTech Conference 2",
    description: "GreenTech conference description 2",
    nicheId: "niche-1",
    enrollPrice: 4500,
    gainedReputation: 7,
    expertise: [{ nicheId: "niche-1", change: 6 }]
  },
  {
    _id: "conf-niche-1-3",
    name: "GreenTech Conference 3",
    description: "GreenTech conference description 3",
    nicheId: "niche-1",
    enrollPrice: 2500,
    gainedReputation: 4,
    expertise: [{ nicheId: "niche-1", change: 4 }]
  },
  {
    _id: "conf-niche-1-4",
    name: "GreenTech Conference 4",
    description: "GreenTech conference description 4",
    nicheId: "niche-1",
    enrollPrice: 5500,
    gainedReputation: 8,
    expertise: [{ nicheId: "niche-1", change: 7 }]
  },
  {
    _id: "conf-niche-1-5",
    name: "GreenTech Conference 5",
    description: "GreenTech conference description 5",
    nicheId: "niche-1",
    enrollPrice: 6000,
    gainedReputation: 9,
    expertise: [{ nicheId: "niche-1", change: 8 }]
  },
  {
    _id: "conf-niche-1-6",
    name: "GreenTech Conference 6",
    description: "GreenTech conference description 6",
    nicheId: "niche-1",
    enrollPrice: 4000,
    gainedReputation: 6,
    expertise: [{ nicheId: "niche-1", change: 5 }]
  },
  {
    _id: "conf-niche-1-7",
    name: "GreenTech Conference 7",
    description: "GreenTech conference description 7",
    nicheId: "niche-1",
    enrollPrice: 5000,
    gainedReputation: 7,
    expertise: [{ nicheId: "niche-1", change: 6 }]
  },
  {
    _id: "conf-niche-1-8",
    name: "GreenTech Conference 8",
    description: "GreenTech conference description 8",
    nicheId: "niche-1",
    enrollPrice: 3000,
    gainedReputation: 5,
    expertise: [{ nicheId: "niche-1", change: 4 }]
  },

  // MedTech conferences (1-8)
  {
    _id: "conf-niche-2-1",
    name: "MedTech Conference 1",
    description: "MedTech conference description 1",
    nicheId: "niche-2",
    enrollPrice: 5000,
    gainedReputation: 8,
    expertise: [{ nicheId: "niche-2", change: 7 }]
  },
  {
    _id: "conf-niche-2-2",
    name: "MedTech Conference 2",
    description: "MedTech conference description 2",
    nicheId: "niche-2",
    enrollPrice: 6000,
    gainedReputation: 9,
    expertise: [{ nicheId: "niche-2", change: 8 }]
  },
  {
    _id: "conf-niche-2-3",
    name: "MedTech Conference 3",
    description: "MedTech conference description 3",
    nicheId: "niche-2",
    enrollPrice: 4500,
    gainedReputation: 7,
    expertise: [{ nicheId: "niche-2", change: 6 }]
  },
  {
    _id: "conf-niche-2-4",
    name: "MedTech Conference 4",
    description: "MedTech conference description 4",
    nicheId: "niche-2",
    enrollPrice: 5500,
    gainedReputation: 8,
    expertise: [{ nicheId: "niche-2", change: 7 }]
  },
  {
    _id: "conf-niche-2-5",
    name: "MedTech Conference 5",
    description: "MedTech conference description 5",
    nicheId: "niche-2",
    enrollPrice: 6500,
    gainedReputation: 9,
    expertise: [{ nicheId: "niche-2", change: 8 }]
  },
  {
    _id: "conf-niche-2-6",
    name: "MedTech Conference 6",
    description: "MedTech conference description 6",
    nicheId: "niche-2",
    enrollPrice: 4000,
    gainedReputation: 6,
    expertise: [{ nicheId: "niche-2", change: 5 }]
  },
  {
    _id: "conf-niche-2-7",
    name: "MedTech Conference 7",
    description: "MedTech conference description 7",
    nicheId: "niche-2",
    enrollPrice: 7000,
    gainedReputation: 10,
    expertise: [{ nicheId: "niche-2", change: 9 }]
  },
  {
    _id: "conf-niche-2-8",
    name: "MedTech Conference 8",
    description: "MedTech conference description 8",
    nicheId: "niche-2",
    enrollPrice: 4800,
    gainedReputation: 7,
    expertise: [{ nicheId: "niche-2", change: 6 }]
  },

  // SpaceTech conferences (1-8)
  {
    _id: "conf-niche-3-1",
    name: "SpaceTech Conference 1",
    description: "SpaceTech conference description 1",
    nicheId: "niche-3",
    enrollPrice: 6500,
    gainedReputation: 10,
    expertise: [{ nicheId: "niche-3", change: 9 }]
  },
  {
    _id: "conf-niche-3-2",
    name: "SpaceTech Conference 2",
    description: "SpaceTech conference description 2",
    nicheId: "niche-3",
    enrollPrice: 7000,
    gainedReputation: 10,
    expertise: [{ nicheId: "niche-3", change: 10 }]
  },
  {
    _id: "conf-niche-3-3",
    name: "SpaceTech Conference 3",
    description: "SpaceTech conference description 3",
    nicheId: "niche-3",
    enrollPrice: 5500,
    gainedReputation: 8,
    expertise: [{ nicheId: "niche-3", change: 7 }]
  },
  {
    _id: "conf-niche-3-4",
    name: "SpaceTech Conference 4",
    description: "SpaceTech conference description 4",
    nicheId: "niche-3",
    enrollPrice: 6000,
    gainedReputation: 9,
    expertise: [{ nicheId: "niche-3", change: 8 }]
  },
  {
    _id: "conf-niche-3-5",
    name: "SpaceTech Conference 5",
    description: "SpaceTech conference description 5",
    nicheId: "niche-3",
    enrollPrice: 4500,
    gainedReputation: 7,
    expertise: [{ nicheId: "niche-3", change: 6 }]
  },
  {
    _id: "conf-niche-3-6",
    name: "SpaceTech Conference 6",
    description: "SpaceTech conference description 6",
    nicheId: "niche-3",
    enrollPrice: 5000,
    gainedReputation: 8,
    expertise: [{ nicheId: "niche-3", change: 7 }]
  },
  {
    _id: "conf-niche-3-7",
    name: "SpaceTech Conference 7",
    description: "SpaceTech conference description 7",
    nicheId: "niche-3",
    enrollPrice: 7500,
    gainedReputation: 10,
    expertise: [{ nicheId: "niche-3", change: 10 }]
  },
  {
    _id: "conf-niche-3-8",
    name: "SpaceTech Conference 8",
    description: "SpaceTech conference description 8",
    nicheId: "niche-3",
    enrollPrice: 4000,
    gainedReputation: 6,
    expertise: [{ nicheId: "niche-3", change: 5 }]
  },

  // IT conferences (1-8)
  {
    _id: "conf-niche-4-1",
    name: "IT Conference 1",
    description: "IT conference description 1",
    nicheId: "niche-4",
    enrollPrice: 4000,
    gainedReputation: 6,
    expertise: [{ nicheId: "niche-4", change: 6 }]
  },
  {
    _id: "conf-niche-4-2",
    name: "IT Conference 2",
    description: "IT conference description 2",
    nicheId: "niche-4",
    enrollPrice: 5500,
    gainedReputation: 8,
    expertise: [{ nicheId: "niche-4", change: 7 }]
  },
  {
    _id: "conf-niche-4-3",
    name: "IT Conference 3",
    description: "IT conference description 3",
    nicheId: "niche-4",
    enrollPrice: 3000,
    gainedReputation: 5,
    expertise: [{ nicheId: "niche-4", change: 4 }]
  },
  {
    _id: "conf-niche-4-4",
    name: "IT Conference 4",
    description: "IT conference description 4",
    nicheId: "niche-4",
    enrollPrice: 4500,
    gainedReputation: 7,
    expertise: [{ nicheId: "niche-4", change: 6 }]
  },
  {
    _id: "conf-niche-4-5",
    name: "IT Conference 5",
    description: "IT conference description 5",
    nicheId: "niche-4",
    enrollPrice: 6000,
    gainedReputation: 9,
    expertise: [{ nicheId: "niche-4", change: 8 }]
  },
  {
    _id: "conf-niche-4-6",
    name: "IT Conference 6",
    description: "IT conference description 6",
    nicheId: "niche-4",
    enrollPrice: 3500,
    gainedReputation: 6,
    expertise: [{ nicheId: "niche-4", change: 5 }]
  },
  {
    _id: "conf-niche-4-7",
    name: "IT Conference 7",
    description: "IT conference description 7",
    nicheId: "niche-4",
    enrollPrice: 5000,
    gainedReputation: 8,
    expertise: [{ nicheId: "niche-4", change: 7 }]
  },
  {
    _id: "conf-niche-4-8",
    name: "IT Conference 8",
    description: "IT conference description 8",
    nicheId: "niche-4",
    enrollPrice: 6500,
    gainedReputation: 10,
    expertise: [{ nicheId: "niche-4", change: 9 }]
  }
]);

// Решения (полный список как в оригинале)
db.solutions.insertMany([
  {
    _id: "solution-2",
    title: "Поиск альтернативных поставщиков",
    description: "Найти новых поставщиков компонентов в других регионах.",
    effect: {
      price: 300,
      expenses: 150,
      team: 0,
      product: 2,
      reputation: 5
    }
  },
  {
    _id: "solution-3",
    title: "Перепроектирование продукции",
    description: "Адаптировать продукты под доступные компоненты.",
    effect: {
      price: -200,
      expenses: 100,
      team: 2,
      product: -1,
      reputation: -3
    }
  },
  {
    _id: "solution-4",
    title: "Создание стратегического запаса",
    description: "Закупить компоненты впрок по повышенным ценам.",
    effect: {
      price: 500,
      expenses: 400,
      team: -1,
      product: 0,
      reputation: 2
    }
  },
  {
    _id: "solution-5",
    title: "Усиление защиты",
    description: "Инвестировать в современные системы кибербезопасности.",
    effect: {
      price: 0,
      expenses: 250,
      team: 1,
      product: 1,
      reputation: 8
    }
  },
  {
    _id: "solution-6",
    title: "Компенсация клиентам",
    description: "Предложить пострадавшим клиентам возмещение ущерба.",
    effect: {
      price: -400,
      expenses: -300,
      team: 0,
      product: 0,
      reputation: 5
    }
  },
  {
    _id: "solution-7",
    title: "Смена ИТ-провайдера",
    description: "Перейти на более надежного хостинг-провайдера.",
    effect: {
      price: 100,
      expenses: 180,
      team: -2,
      product: -1,
      reputation: 3
    }
  },
  {
    _id: "solution-8",
    title: "Экологические инициативы",
    description: "Запустить программу по восстановлению экологии.",
    effect: {
      price: -100,
      expenses: -150,
      team: 1,
      product: 0,
      reputation: 12
    }
  },
  {
    _id: "solution-9",
    title: "Отрицание ответственности",
    description: "Оспорить обвинения через суд.",
    effect: {
      price: 200,
      expenses: 100,
      team: -1,
      product: -2,
      reputation: -5
    }
  },
  {
    _id: "solution-10",
    title: "Переход на зеленые технологии",
    description: "Модернизировать производство с учетом экологических стандартов.",
    effect: {
      price: 300,
      expenses: 400,
      team: 0,
      product: 1,
      reputation: 15
    }
  }
]);

// Кризисы (полный список как в оригинале)
db.crises.insertMany([
  {
    _id: "crisis-2",
    name: "Дефицит микрочипов",
    description: "Глобальная нехватка полупроводниковых компонентов нарушает производственные цепочки.",
    danger: 4,
    niches: ["niche-2", "niche-3"],
    possibleSolutions: [
      {
        _id: "solution-2",
        title: "Поиск альтернативных поставщиков",
        description: "Найти новых поставщиков компонентов в других регионах.",
        effect: {
          price: 300,
          expenses: 150,
          team: 0,
          product: 2,
          reputation: 5
        }
      },
      {
        _id: "solution-3",
        title: "Перепроектирование продукции",
        description: "Адаптировать продукты под доступные компоненты.",
        effect: {
          price: -200,
          expenses: 100,
          team: 2,
          product: -1,
          reputation: -3
        }
      },
      {
        _id: "solution-4",
        title: "Создание стратегического запаса",
        description: "Закупить компоненты впрок по повышенным ценам.",
        effect: {
          price: 500,
          expenses: 400,
          team: -1,
          product: 0,
          reputation: 2
        }
      }
    ]
  },
  {
    _id: "crisis-3",
    name: "Утечка данных клиентов",
    description: "Хакерская атака привела к компрометации персональных данных пользователей.",
    danger: 5,
    niches: ["niche-4"],
    possibleSolutions: [
      {
        _id: "solution-5",
        title: "Усиление защиты",
        description: "Инвестировать в современные системы кибербезопасности.",
        effect: {
          price: 0,
          expenses: 250,
          team: 1,
          product: 1,
          reputation: 8
        }
      },
      {
        _id: "solution-6",
        title: "Компенсация клиентам",
        description: "Предложить пострадавшим клиентам возмещение ущерба.",
        effect: {
          price: -400,
          expenses: -300,
          team: 0,
          product: 0,
          reputation: 5
        }
      },
      {
        _id: "solution-7",
        title: "Смена ИТ-провайдера",
        description: "Перейти на более надежного хостинг-провайдера.",
        effect: {
          price: 100,
          expenses: 180,
          team: -2,
          product: -1,
          reputation: 3
        }
      }
    ]
  },
  {
    _id: "crisis-4",
    name: "Экологический скандал",
    description: "Компанию обвиняют в нанесении вреда местной экосистеме.",
    danger: 3,
    niches: ["niche-1", "niche-4"],
    possibleSolutions: [
      {
        _id: "solution-8",
        title: "Экологические инициативы",
        description: "Запустить программу по восстановлению экологии.",
        effect: {
          price: -100,
          expenses: -150,
          team: 1,
          product: 0,
          reputation: 12
        }
      },
      {
        _id: "solution-9",
        title: "Отрицание ответственности",
        description: "Оспорить обвинения через суд.",
        effect: {
          price: 200,
          expenses: 100,
          team: -1,
          product: -2,
          reputation: -5
        }
      },
      {
        _id: "solution-10",
        title: "Переход на зеленые технологии",
        description: "Модернизировать производство с учетом экологических стандартов.",
        effect: {
          price: 300,
          expenses: 400,
          team: 0,
          product: 1,
          reputation: 15
        }
      }
    ]
  }
]);

// Добавление стартапов (по 8 для каждой ниши)
db.startups.insertMany([
  // GreenTech startups (1-8)
  {
    _id: "startup-niche-1-1",
    name: "GreenTech Startup 1",
    description: "GreenTech startup description 1",
    price: 12000,
    uniqueProductOffer: "Unique GreenTech offer 1",
    lastMonthRevenue: 5000,
    expenses: 4000,
    team: 15,
    budget: 8000,
    product: 20,
    reputation: 25,
    level: 1,
    stage: "IDEA",
    niche: "niche-1"
  },
  {
    _id: "startup-niche-1-2",
    name: "GreenTech Startup 2",
    description: "GreenTech startup description 2",
    price: 18000,
    uniqueProductOffer: "Unique GreenTech offer 2",
    lastMonthRevenue: 7000,
    expenses: 5000,
    team: 25,
    budget: 9000,
    product: 35,
    reputation: 40,
    level: 2,
    stage: "MVP",
    niche: "niche-1"
  },
  {
    _id: "startup-niche-1-3",
    name: "GreenTech Startup 3",
    description: "GreenTech startup description 3",
    price: 22000,
    uniqueProductOffer: "Unique GreenTech offer 3",
    lastMonthRevenue: 6000,
    expenses: 4500,
    team: 20,
    budget: 8500,
    product: 30,
    reputation: 35,
    level: 2,
    stage: "SCALE",
    niche: "niche-1"
  },
  {
    _id: "startup-niche-1-4",
    name: "GreenTech Startup 4",
    description: "GreenTech startup description 4",
    price: 28000,
    uniqueProductOffer: "Unique GreenTech offer 4",
    lastMonthRevenue: 8000,
    expenses: 6000,
    team: 35,
    budget: 9500,
    product: 45,
    reputation: 50,
    level: 3,
    stage: "MARKET",
    niche: "niche-1"
  },
  {
    _id: "startup-niche-1-5",
    name: "GreenTech Startup 5",
    description: "GreenTech startup description 5",
    price: 15000,
    uniqueProductOffer: "Unique GreenTech offer 5",
    lastMonthRevenue: 5500,
    expenses: 4200,
    team: 18,
    budget: 8200,
    product: 25,
    reputation: 30,
    level: 1,
    stage: "IDEA",
    niche: "niche-1"
  },
  {
    _id: "startup-niche-1-6",
    name: "GreenTech Startup 6",
    description: "GreenTech startup description 6",
    price: 25000,
    uniqueProductOffer: "Unique GreenTech offer 6",
    lastMonthRevenue: 9000,
    expenses: 7000,
    team: 40,
    budget: 9800,
    product: 50,
    reputation: 50,
    level: 3,
    stage: "SCALE",
    niche: "niche-1"
  },
  {
    _id: "startup-niche-1-7",
    name: "GreenTech Startup 7",
    description: "GreenTech startup description 7",
    price: 19000,
    uniqueProductOffer: "Unique GreenTech offer 7",
    lastMonthRevenue: 6500,
    expenses: 4800,
    team: 28,
    budget: 8800,
    product: 38,
    reputation: 42,
    level: 2,
    stage: "MVP",
    niche: "niche-1"
  },
  {
    _id: "startup-niche-1-8",
    name: "GreenTech Startup 8",
    description: "GreenTech startup description 8",
    price: 32000,
    uniqueProductOffer: "Unique GreenTech offer 8",
    lastMonthRevenue: 10000,
    expenses: 8000,
    team: 50,
    budget: 10000,
    product: 50,
    reputation: 50,
    level: 3,
    stage: "MARKET",
    niche: "niche-1"
  },

  // MedTech startups (1-8)
  {
    _id: "startup-niche-2-1",
    name: "MedTech Startup 1",
    description: "MedTech startup description 1",
    price: 25000,
    uniqueProductOffer: "Unique MedTech offer 1",
    lastMonthRevenue: 8000,
    expenses: 6000,
    team: 30,
    budget: 9500,
    product: 40,
    reputation: 45,
    level: 2,
    stage: "SCALE",
    niche: "niche-2"
  },
  {
    _id: "startup-niche-2-2",
    name: "MedTech Startup 2",
    description: "MedTech startup description 2",
    price: 35000,
    uniqueProductOffer: "Unique MedTech offer 2",
    lastMonthRevenue: 10000,
    expenses: 8000,
    team: 45,
    budget: 10000,
    product: 50,
    reputation: 50,
    level: 3,
    stage: "MARKET",
    niche: "niche-2"
  },
  {
    _id: "startup-niche-2-3",
    name: "MedTech Startup 3",
    description: "MedTech startup description 3",
    price: 18000,
    uniqueProductOffer: "Unique MedTech offer 3",
    lastMonthRevenue: 7000,
    expenses: 5500,
    team: 25,
    budget: 9000,
    product: 35,
    reputation: 40,
    level: 2,
    stage: "MVP",
    niche: "niche-2"
  },
  {
    _id: "startup-niche-2-4",
    name: "MedTech Startup 4",
    description: "MedTech startup description 4",
    price: 28000,
    uniqueProductOffer: "Unique MedTech offer 4",
    lastMonthRevenue: 9000,
    expenses: 7000,
    team: 38,
    budget: 9800,
    product: 45,
    reputation: 48,
    level: 3,
    stage: "SCALE",
    niche: "niche-2"
  },
  {
    _id: "startup-niche-2-5",
    name: "MedTech Startup 5",
    description: "MedTech startup description 5",
    price: 15000,
    uniqueProductOffer: "Unique MedTech offer 5",
    lastMonthRevenue: 6000,
    expenses: 4500,
    team: 20,
    budget: 8500,
    product: 30,
    reputation: 35,
    level: 1,
    stage: "IDEA",
    niche: "niche-2"
  },
  {
    _id: "startup-niche-2-6",
    name: "MedTech Startup 6",
    description: "MedTech startup description 6",
    price: 22000,
    uniqueProductOffer: "Unique MedTech offer 6",
    lastMonthRevenue: 7500,
    expenses: 5800,
    team: 32,
    budget: 9200,
    product: 42,
    reputation: 45,
    level: 2,
    stage: "MVP",
    niche: "niche-2"
  },
  {
    _id: "startup-niche-2-7",
    name: "MedTech Startup 7",
    description: "MedTech startup description 7",
    price: 30000,
    uniqueProductOffer: "Unique MedTech offer 7",
    lastMonthRevenue: 9500,
    expenses: 7500,
    team: 42,
    budget: 9900,
    product: 48,
    reputation: 50,
    level: 3,
    stage: "MARKET",
    niche: "niche-2"
  },
  {
    _id: "startup-niche-2-8",
    name: "MedTech Startup 8",
    description: "MedTech startup description 8",
    price: 20000,
    uniqueProductOffer: "Unique MedTech offer 8",
    lastMonthRevenue: 6500,
    expenses: 5000,
    team: 28,
    budget: 8700,
    product: 38,
    reputation: 42,
    level: 2,
    stage: "SCALE",
    niche: "niche-2"
  },

  // SpaceTech startups (1-8)
  {
    _id: "startup-niche-3-1",
    name: "SpaceTech Startup 1",
    description: "SpaceTech startup description 1",
    price: 30000,
    uniqueProductOffer: "Unique SpaceTech offer 1",
    lastMonthRevenue: 9500,
    expenses: 7500,
    team: 42,
    budget: 9900,
    product: 48,
    reputation: 50,
    level: 3,
    stage: "MARKET",
    niche: "niche-3"
  },
  {
    _id: "startup-niche-3-2",
    name: "SpaceTech Startup 2",
    description: "SpaceTech startup description 2",
    price: 40000,
    uniqueProductOffer: "Unique SpaceTech offer 2",
    lastMonthRevenue: 10000,
    expenses: 8000,
    team: 50,
    budget: 10000,
    product: 50,
    reputation: 50,
    level: 3,
    stage: "MARKET",
    niche: "niche-3"
  },
  {
    _id: "startup-niche-3-3",
    name: "SpaceTech Startup 3",
    description: "SpaceTech startup description 3",
    price: 22000,
    uniqueProductOffer: "Unique SpaceTech offer 3",
    lastMonthRevenue: 7500,
    expenses: 5800,
    team: 32,
    budget: 9200,
    product: 42,
    reputation: 45,
    level: 2,
    stage: "SCALE",
    niche: "niche-3"
  },
  {
    _id: "startup-niche-3-4",
    name: "SpaceTech Startup 4",
    description: "SpaceTech startup description 4",
    price: 28000,
    uniqueProductOffer: "Unique SpaceTech offer 4",
    lastMonthRevenue: 9000,
    expenses: 7000,
    team: 38,
    budget: 9800,
    product: 45,
    reputation: 48,
    level: 3,
    stage: "MARKET",
    niche: "niche-3"
  },
  {
    _id: "startup-niche-3-5",
    name: "SpaceTech Startup 5",
    description: "SpaceTech startup description 5",
    price: 18000,
    uniqueProductOffer: "Unique SpaceTech offer 5",
    lastMonthRevenue: 7000,
    expenses: 5500,
    team: 25,
    budget: 9000,
    product: 35,
    reputation: 40,
    level: 2,
    stage: "MVP",
    niche: "niche-3"
  },
  {
    _id: "startup-niche-3-6",
    name: "SpaceTech Startup 6",
    description: "SpaceTech startup description 6",
    price: 25000,
    uniqueProductOffer: "Unique SpaceTech offer 6",
    lastMonthRevenue: 8000,
    expenses: 6000,
    team: 35,
    budget: 9500,
    product: 45,
    reputation: 50,
    level: 3,
    stage: "SCALE",
    niche: "niche-3"
  },
  {
    _id: "startup-niche-3-7",
    name: "SpaceTech Startup 7",
    description: "SpaceTech startup description 7",
    price: 32000,
    uniqueProductOffer: "Unique SpaceTech offer 7",
    lastMonthRevenue: 10000,
    expenses: 8000,
    team: 48,
    budget: 10000,
    product: 50,
    reputation: 50,
    level: 3,
    stage: "MARKET",
    niche: "niche-3"
  },
  {
    _id: "startup-niche-3-8",
    name: "SpaceTech Startup 8",
    description: "SpaceTech startup description 8",
    price: 20000,
    uniqueProductOffer: "Unique SpaceTech offer 8",
    lastMonthRevenue: 6500,
    expenses: 5000,
    team: 28,
    budget: 8700,
    product: 38,
    reputation: 42,
    level: 2,
    stage: "MVP",
    niche: "niche-3"
  },

  // IT startups (1-8)
  {
    _id: "startup-niche-4-1",
    name: "IT Startup 1",
    description: "IT startup description 1",
    price: 15000,
    uniqueProductOffer: "Unique IT offer 1",
    lastMonthRevenue: 6000,
    expenses: 4500,
    team: 20,
    budget: 8500,
    product: 30,
    reputation: 35,
    level: 1,
    stage: "IDEA",
    niche: "niche-4"
  },
  {
    _id: "startup-niche-4-2",
    name: "IT Startup 2",
    description: "IT startup description 2",
    price: 22000,
    uniqueProductOffer: "Unique IT offer 2",
    lastMonthRevenue: 7500,
    expenses: 5800,
    team: 32,
    budget: 9200,
    product: 42,
    reputation: 45,
    level: 2,
    stage: "MVP",
    niche: "niche-4"
  },
  {
    _id: "startup-niche-4-3",
    name: "IT Startup 3",
    description: "IT startup description 3",
    price: 28000,
    uniqueProductOffer: "Unique IT offer 3",
    lastMonthRevenue: 9000,
    expenses: 7000,
    team: 38,
    budget: 9800,
    product: 45,
    reputation: 48,
    level: 3,
    stage: "SCALE",
    niche: "niche-4"
  },
  {
    _id: "startup-niche-4-4",
    name: "IT Startup 4",
    description: "IT startup description 4",
    price: 35000,
    uniqueProductOffer: "Unique IT offer 4",
    lastMonthRevenue: 10000,
    expenses: 8000,
    team: 50,
    budget: 10000,
    product: 50,
    reputation: 50,
    level: 3,
    stage: "MARKET",
    niche: "niche-4"
  },
  {
    _id: "startup-niche-4-5",
    name: "IT Startup 5",
    description: "IT startup description 5",
    price: 18000,
    uniqueProductOffer: "Unique IT offer 5",
    lastMonthRevenue: 7000,  // Исправлено с 700 на 7000
    expenses: 5500,
    team: 25,
    budget: 9000,
    product: 35,
    reputation: 40,
    level: 2,
    stage: "MVP",
    niche: "niche-4"
  },
  {
    _id: "startup-niche-4-6",
    name: "IT Startup 6",
    description: "IT startup description 6",
    price: 25000,
    uniqueProductOffer: "Unique IT offer 6",
    lastMonthRevenue: 8000,
    expenses: 6000,
    team: 35,
    budget: 9500,
    product: 45,
    reputation: 50,
    level: 3,
    stage: "SCALE",
    niche: "niche-4"
  },
  {
    _id: "startup-niche-4-7",
    name: "IT Startup 7",
    description: "IT startup description 7",
    price: 30000,
    uniqueProductOffer: "Unique IT offer 7",
    lastMonthRevenue: 9500,
    expenses: 7500,
    team: 45,
    budget: 9900,
    product: 50,
    reputation: 50,
    level: 3,
    stage: "MARKET",
    niche: "niche-4"
  },
  {
    _id: "startup-niche-4-8",
    name: "IT Startup 8",
    description: "IT startup description 8",
    price: 20000,
    uniqueProductOffer: "Unique IT offer 8",
    lastMonthRevenue: 6500,
    expenses: 5000,
    team: 30,
    budget: 8800,
    product: 40,
    reputation: 45,
    level: 2,
    stage: "SCALE",
    niche: "niche-4"
  }
]);

// Добавление контрактов (по одному для каждого стартапа)
db.contracts.insertMany([
  // Контракты для GreenTech стартапов (1-8)
  {
    _id: "contract-niche-1-1",
    startupId: "startup-niche-1-1",
    minPrice: 9600,  // 12000 * 0.8
    maxPrice: 14400, // 12000 * 1.2
    teamEffect: 5,
    reputationEffect: 6
  },
  {
    _id: "contract-niche-1-2",
    startupId: "startup-niche-1-2",
    minPrice: 14400, // 18000 * 0.8
    maxPrice: 21600, // 18000 * 1.2
    teamEffect: 7,
    reputationEffect: 8
  },
  {
    _id: "contract-niche-1-3",
    startupId: "startup-niche-1-3",
    minPrice: 17600, // 22000 * 0.8
    maxPrice: 26400, // 22000 * 1.2
    teamEffect: 6,
    reputationEffect: 7
  },
  {
    _id: "contract-niche-1-4",
    startupId: "startup-niche-1-4",
    minPrice: 22400, // 28000 * 0.8
    maxPrice: 33600, // 28000 * 1.2
    teamEffect: 8,
    reputationEffect: 9
  },
  {
    _id: "contract-niche-1-5",
    startupId: "startup-niche-1-5",
    minPrice: 12000, // 15000 * 0.8
    maxPrice: 18000, // 15000 * 1.2
    teamEffect: 4,
    reputationEffect: 5
  },
  {
    _id: "contract-niche-1-6",
    startupId: "startup-niche-1-6",
    minPrice: 20000, // 25000 * 0.8
    maxPrice: 30000, // 25000 * 1.2
    teamEffect: 9,
    reputationEffect: 10
  },
  {
    _id: "contract-niche-1-7",
    startupId: "startup-niche-1-7",
    minPrice: 15200, // 19000 * 0.8
    maxPrice: 22800, // 19000 * 1.2
    teamEffect: 7,
    reputationEffect: 8
  },
  {
    _id: "contract-niche-1-8",
    startupId: "startup-niche-1-8",
    minPrice: 25600, // 32000 * 0.8
    maxPrice: 38400, // 32000 * 1.2
    teamEffect: 10,
    reputationEffect: 10
  },

  // Контракты для MedTech стартапов (1-8)
  {
    _id: "contract-niche-2-1",
    startupId: "startup-niche-2-1",
    minPrice: 20000, // 25000 * 0.8
    maxPrice: 30000, // 25000 * 1.2
    teamEffect: 8,
    reputationEffect: 9
  },
  {
    _id: "contract-niche-2-2",
    startupId: "startup-niche-2-2",
    minPrice: 28000, // 35000 * 0.8
    maxPrice: 42000, // 35000 * 1.2
    teamEffect: 10,
    reputationEffect: 10
  },
  {
    _id: "contract-niche-2-3",
    startupId: "startup-niche-2-3",
    minPrice: 14400, // 18000 * 0.8
    maxPrice: 21600, // 18000 * 1.2
    teamEffect: 6,
    reputationEffect: 7
  },
  {
    _id: "contract-niche-2-4",
    startupId: "startup-niche-2-4",
    minPrice: 22400, // 28000 * 0.8
    maxPrice: 33600, // 28000 * 1.2
    teamEffect: 8,
    reputationEffect: 9
  },
  {
    _id: "contract-niche-2-5",
    startupId: "startup-niche-2-5",
    minPrice: 12000, // 15000 * 0.8
    maxPrice: 18000, // 15000 * 1.2
    teamEffect: 5,
    reputationEffect: 6
  },
  {
    _id: "contract-niche-2-6",
    startupId: "startup-niche-2-6",
    minPrice: 17600, // 22000 * 0.8
    maxPrice: 26400, // 22000 * 1.2
    teamEffect: 7,
    reputationEffect: 8
  },
  {
    _id: "contract-niche-2-7",
    startupId: "startup-niche-2-7",
    minPrice: 24000, // 30000 * 0.8
    maxPrice: 36000, // 30000 * 1.2
    teamEffect: 9,
    reputationEffect: 10
  },
  {
    _id: "contract-niche-2-8",
    startupId: "startup-niche-2-8",
    minPrice: 16000, // 20000 * 0.8
    maxPrice: 24000, // 20000 * 1.2
    teamEffect: 6,
    reputationEffect: 7
  },

  // Контракты для SpaceTech стартапов (1-8)
  {
    _id: "contract-niche-3-1",
    startupId: "startup-niche-3-1",
    minPrice: 24000, // 30000 * 0.8
    maxPrice: 36000, // 30000 * 1.2
    teamEffect: 9,
    reputationEffect: 10
  },
  {
    _id: "contract-niche-3-2",
    startupId: "startup-niche-3-2",
    minPrice: 32000, // 40000 * 0.8
    maxPrice: 48000, // 40000 * 1.2
    teamEffect: 10,
    reputationEffect: 10
  },
  {
    _id: "contract-niche-3-3",
    startupId: "startup-niche-3-3",
    minPrice: 17600, // 22000 * 0.8
    maxPrice: 26400, // 22000 * 1.2
    teamEffect: 7,
    reputationEffect: 8
  },
  {
    _id: "contract-niche-3-4",
    startupId: "startup-niche-3-4",
    minPrice: 22400, // 28000 * 0.8
    maxPrice: 33600, // 28000 * 1.2
    teamEffect: 8,
    reputationEffect: 9
  },
  {
    _id: "contract-niche-3-5",
    startupId: "startup-niche-3-5",
    minPrice: 14400, // 18000 * 0.8
    maxPrice: 21600, // 18000 * 1.2
    teamEffect: 6,
    reputationEffect: 7
  },
  {
    _id: "contract-niche-3-6",
    startupId: "startup-niche-3-6",
    minPrice: 20000, // 25000 * 0.8
    maxPrice: 30000, // 25000 * 1.2
    teamEffect: 8,
    reputationEffect: 9
  },
  {
    _id: "contract-niche-3-7",
    startupId: "startup-niche-3-7",
    minPrice: 25600, // 32000 * 0.8
    maxPrice: 38400, // 32000 * 1.2
    teamEffect: 10,
    reputationEffect: 10
  },
  {
    _id: "contract-niche-3-8",
    startupId: "startup-niche-3-8",
    minPrice: 16000, // 20000 * 0.8
    maxPrice: 24000, // 20000 * 1.2
    teamEffect: 6,
    reputationEffect: 7
  },

  // Контракты для IT стартапов (1-8)
  {
    _id: "contract-niche-4-1",
    startupId: "startup-niche-4-1",
    minPrice: 12000, // 15000 * 0.8
    maxPrice: 18000, // 15000 * 1.2
    teamEffect: 5,
    reputationEffect: 6
  },
  {
    _id: "contract-niche-4-2",
    startupId: "startup-niche-4-2",
    minPrice: 17600, // 22000 * 0.8
    maxPrice: 26400, // 22000 * 1.2
    teamEffect: 7,
    reputationEffect: 8
  },
  {
    _id: "contract-niche-4-3",
    startupId: "startup-niche-4-3",
    minPrice: 22400, // 28000 * 0.8
    maxPrice: 33600, // 28000 * 1.2
    teamEffect: 8,
    reputationEffect: 9
  },
  {
    _id: "contract-niche-4-4",
    startupId: "startup-niche-4-4",
    minPrice: 28000, // 35000 * 0.8
    maxPrice: 42000, // 35000 * 1.2
    teamEffect: 10,
    reputationEffect: 10
  },
  {
    _id: "contract-niche-4-5",
    startupId: "startup-niche-4-5",
    minPrice: 14400, // 18000 * 0.8
    maxPrice: 21600, // 18000 * 1.2
    teamEffect: 6,
    reputationEffect: 7
  },
  {
    _id: "contract-niche-4-6",
    startupId: "startup-niche-4-6",
    minPrice: 20000, // 25000 * 0.8
    maxPrice: 30000, // 25000 * 1.2
    teamEffect: 8,
    reputationEffect: 9
  },
  {
    _id: "contract-niche-4-7",
    startupId: "startup-niche-4-7",
    minPrice: 24000, // 30000 * 0.8
    maxPrice: 36000, // 30000 * 1.2
    teamEffect: 9,
    reputationEffect: 10
  },
  {
    _id: "contract-niche-4-8",
    startupId: "startup-niche-4-8",
    minPrice: 16000, // 20000 * 0.8
    maxPrice: 24000, // 20000 * 1.2
    teamEffect: 6,
    reputationEffect: 7
  }
]);

print("Данные успешно сгенерированы и добавлены в базу");