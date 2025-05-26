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
  {_id: "GreenTech"},
  {_id: "MedTech"},
  {_id: "SpaceTech"},
  {_id: "IT"}
]);

// Добавление конференций (по 8 для каждой ниши)
db.conferences.insertMany([
  {
    name: "Цифровая трансформация бизнеса 2025",
    description: "Конференция посвящена интеграции ИТ-решений в корпоративные процессы. Участники узнают о внедрении ERP, CRM и BI-систем в крупный и средний бизнес, а также о кейсах цифровизации логистики, HR и продаж.",
    nicheId: "IT",
    enrollPrice: 5000,
    gainedReputation: 4,
    expertise: [
      { nicheId: "IT", change: 5 },
      { nicheId: "GreenTech", change: 1 }
    ]
  },
  {
    name: "Искусственный интеллект и машинное обучение",
    description: "Мероприятие для стартапов, работающих с AI и ML. Темы включают обработку больших данных, обучение нейросетей, этику ИИ и применение в реальных продуктах.",
    nicheId: "IT",
    enrollPrice: 6200,
    gainedReputation: 6,
    expertise: [
      { nicheId: "IT", change: 7 }
    ]
  },
  {
    name: "Кибербезопасность: новые угрозы и защита",
    description: "Конференция ориентирована на стартапы, развивающие решения в сфере защиты данных. Рассматриваются тренды в атакующих технологиях и современные методы киберзащиты.",
    nicheId: "IT",
    enrollPrice: 5500,
    gainedReputation: 5,
    expertise: [
      { nicheId: "IT", change: 6 }
    ]
  },
  {
    name: "Фронтенд будущего: от React до WebAssembly",
    description: "Специализированная конференция для веб-разработчиков, где обсуждаются тренды UI/UX, прогрессивные фреймворки и производительность интерфейсов.",
    nicheId: "IT",
    enrollPrice: 4800,
    gainedReputation: 3,
    expertise: [
      { nicheId: "IT", change: 5 }
    ]
  },
  {
    name: "DevOps & CI/CD: автоматизация разработки",
    description: "Углубленная конференция о DevOps-практиках, автоматическом тестировании, доставке кода и мониторинге. Полезна для команд, стремящихся к непрерывной интеграции.",
    nicheId: "IT",
    enrollPrice: 5700,
    gainedReputation: 5,
    expertise: [
      { nicheId: "IT", change: 6 }
    ]
  },
  {
    name: "Big Data в действии: аналитика и хранилища",
    description: "Практическая конференция о построении дата-архитектуры, выборе подходящих хранилищ и работе с потоковыми данными. Подходит для стартапов с большими объемами информации.",
    nicheId: "IT",
    enrollPrice: 6100,
    gainedReputation: 4,
    expertise: [
      { nicheId: "IT", change: 5 }
    ]
  },
  {
    name: "Голосовые технологии и нейросети",
    description: "Событие о распознавании речи, синтезе голоса, голосовых ассистентах и взаимодействии с пользователем через аудиоинтерфейсы.",
    nicheId: "IT",
    enrollPrice: 5300,
    gainedReputation: 4,
    expertise: [
      { nicheId: "IT", change: 6 }
    ]
  },
  {
    name: "Продуктовый менеджмент в IT",
    description: "Полезная конференция для основателей и руководителей. Рассматриваются вопросы выстраивания IT-продукта, юнит-экономики, метрик и общения с технической командой.",
    nicheId: "IT",
    enrollPrice: 4500,
    gainedReputation: 2,
    expertise: [
      { nicheId: "IT", change: 4 },
      { nicheId: "MedTech", change: 1 }
    ]
  },
  {
    name: "Blockchain и Web3: построение децентрализованных решений",
    description: "Погружение в технологии распределённого реестра, создание смарт-контрактов и архитектуру Web3. Подходит для стартапов, внедряющих токены, NFT и DeFi.",
    nicheId: "IT",
    enrollPrice: 7000,
    gainedReputation: 6,
    expertise: [
      { nicheId: "IT", change: 7 }
    ]
  },
  {
    name: "Low-code и no-code платформы для стартапов",
    description: "Разбираются инструменты для быстрого прототипирования и запуска MVP без больших затрат на разработку. Подходит для фаундеров без технического бэкграунда.",
    nicheId: "IT",
    enrollPrice: 3600,
    gainedReputation: 2,
    expertise: [
      { nicheId: "IT", change: 3 }
    ]
  },
  {
    name: "AR/VR технологии и мета-вселенная",
    description: "Конференция о создании виртуальных продуктов, опыте пользователя в VR и применении дополненной реальности в коммерческих проектах.",
    nicheId: "IT",
    enrollPrice: 6800,
    gainedReputation: 5,
    expertise: [
      { nicheId: "IT", change: 6 }
    ]
  },
  {
    name: "ИТ для социальных проектов и govtech",
    description: "Тематика конференции — цифровизация государственных и социальных сервисов. Разбираются решения, работающие с массовыми пользователями и сложными интеграциями.",
    nicheId: "IT",
    enrollPrice: 4200,
    gainedReputation: 3,
    expertise: [
      { nicheId: "IT", change: 4 },
      { nicheId: "GreenTech", change: 1 }
    ]
  },
  {
    name: "Малая спутниковая революция",
    description: "Конференция, посвящённая разработке, сборке и запуску малых спутников (CubeSat, NanoSat). Включает сессии по выбору полезной нагрузки, орбитальным параметрам и бизнес-моделям спутниковых стартапов.",
    nicheId: "SpaceTech",
    enrollPrice: 6100,
    gainedReputation: 5,
    expertise: [
      { nicheId: "SpaceTech", change: 6 }
    ]
  },
  {
    name: "Коммерческая космонавтика: от идеи до орбиты",
    description: "Мероприятие для стартапов, которые планируют работать в области вывода полезной нагрузки, суборбитальных запусков и космического туризма. Рассматриваются регуляторные, технические и инвестиционные аспекты.",
    nicheId: "SpaceTech",
    enrollPrice: 6700,
    gainedReputation: 6,
    expertise: [
      { nicheId: "SpaceTech", change: 7 }
    ]
  },
  {
    name: "Космическая робототехника и автономные системы",
    description: "Конференция про автономные модули, роботов для космоса, управление и сенсоры. Обсуждаются задачи лунной и марсианской автоматизации.",
    nicheId: "SpaceTech",
    enrollPrice: 5900,
    gainedReputation: 4,
    expertise: [
      { nicheId: "SpaceTech", change: 5 }
    ]
  },
  {
    name: "Данные из космоса: наблюдение Земли и анализ",
    description: "Форум о технологиях спутникового наблюдения и использовании полученных данных в агросекторе, урбанистике и экологии. Упор на анализ изображений и ИИ.",
    nicheId: "SpaceTech",
    enrollPrice: 5200,
    gainedReputation: 3,
    expertise: [
      { nicheId: "SpaceTech", change: 4 },
      { nicheId: "GreenTech", change: 2 }
    ]
  },
  {
    name: "Двигательные установки и новые методы выхода в космос",
    description: "Техническая конференция для инженеров и исследователей, занимающихся ионными, плазменными и химическими двигателями, а также инновационными методами разгона.",
    nicheId: "SpaceTech",
    enrollPrice: 6400,
    gainedReputation: 5,
    expertise: [
      { nicheId: "SpaceTech", change: 6 }
    ]
  },
  {
    name: "Марсианская миссия: вызовы и решения",
    description: "Тематика включает долговременные миссии, жизнеобеспечение, радиационную защиту, психологию экипажа и доставку ресурсов на Марс. Полезно для стартапов, ориентированных на deep space.",
    nicheId: "SpaceTech",
    enrollPrice: 7000,
    gainedReputation: 7,
    expertise: [
      { nicheId: "SpaceTech", change: 8 }
    ]
  },
  {
    name: "Прототипирование космических систем",
    description: "Мастер-классы и лекции по быстрой разработке космического оборудования, тестированию в экстремальных условиях, валидации компонентов.",
    nicheId: "SpaceTech",
    enrollPrice: 4900,
    gainedReputation: 4,
    expertise: [
      { nicheId: "SpaceTech", change: 5 }
    ]
  },
  {
    name: "Связь на орбите: спутниковые коммуникации нового поколения",
    description: "Обсуждение LEO-созвездий, интернета вещей через спутники, задержек сигнала и новых стандартов связи (например, 6G в космосе).",
    nicheId: "SpaceTech",
    enrollPrice: 5500,
    gainedReputation: 4,
    expertise: [
      { nicheId: "SpaceTech", change: 6 },
      { nicheId: "IT", change: 1 }
    ]
  },
  {
    name: "Космическое производство и 3D-печать",
    description: "Рассматриваются технологии аддитивного производства в космосе, создание элементов прямо на орбите или на других планетах. Подходит для deep-tech стартапов.",
    nicheId: "SpaceTech",
    enrollPrice: 5800,
    gainedReputation: 4,
    expertise: [
      { nicheId: "SpaceTech", change: 5 }
    ]
  },
  {
    name: "Экономика околоземного пространства",
    description: "Конференция о бизнес-моделях космических стартапов, проблемах и трендах рынка орбитальных услуг, а также будущем частного космоса.",
    nicheId: "SpaceTech",
    enrollPrice: 4700,
    gainedReputation: 3,
    expertise: [
      { nicheId: "SpaceTech", change: 4 }
    ]
  },
  {
    name: "SpaceTech для начинающих: акселератор идей",
    description: "Формат для стартапов на ранней стадии, где эксперты помогают с определением целевой ниши, технологической реализацией и roadmap проекта.",
    nicheId: "SpaceTech",
    enrollPrice: 4300,
    gainedReputation: 2,
    expertise: [
      { nicheId: "SpaceTech", change: 3 }
    ]
  },
  {
    name: "Космос и устойчивость: орбитальный мусор и экология",
    description: "Мероприятие про очистку орбит от мусора, предотвращение столкновений и устойчивое использование космического пространства.",
    nicheId: "SpaceTech",
    enrollPrice: 5400,
    gainedReputation: 5,
    expertise: [
      { nicheId: "SpaceTech", change: 5 },
      { nicheId: "GreenTech", change: 2 }
    ]
  },
  {
    name: "Цифровая медицина и ИИ в диагностике",
    description: "Конференция, посвящённая применению искусственного интеллекта в медицине: распознавание изображений, анализ ЭКГ, диагностика по биомаркерам. Обсуждаются кейсы, проблемы интерпретации и внедрения.",
    nicheId: "MedTech",
    enrollPrice: 6300,
    gainedReputation: 6,
    expertise: [
      { nicheId: "MedTech", change: 7 },
      { nicheId: "IT", change: 2 }
    ]
  },
  {
    name: "Новые биосенсоры и носимая электроника",
    description: "Мероприятие про инновационные медицинские устройства для мониторинга здоровья: от глюкометров до непрерывных трекеров сна и пульса. Освещаются вопросы точности, сертификации и рынка.",
    nicheId: "MedTech",
    enrollPrice: 5700,
    gainedReputation: 5,
    expertise: [
      { nicheId: "MedTech", change: 6 }
    ]
  },
  {
    name: "Мобильные приложения в медицине: от идеи до регистрации",
    description: "Пошаговая инструкция для команд, разрабатывающих мобильные медприложения. Включает UX в здравоохранении, регуляторные требования и монетизацию.",
    nicheId: "MedTech",
    enrollPrice: 5200,
    gainedReputation: 4,
    expertise: [
      { nicheId: "MedTech", change: 5 },
      { nicheId: "IT", change: 1 }
    ]
  },
  {
    name: "Телемедицина: глобальные тренды и локальные кейсы",
    description: "Обсуждаются технологии удалённого оказания медицинской помощи, правовое регулирование, перспективы роста и интеграции с ИИ.",
    nicheId: "MedTech",
    enrollPrice: 5900,
    gainedReputation: 5,
    expertise: [
      { nicheId: "MedTech", change: 6 }
    ]
  },
  {
    name: "Медицинские нейротехнологии и интерфейсы мозг-компьютер",
    description: "Уникальная площадка для обсуждения BCI-технологий, реабилитации после инсульта и инновационных решений в нейромедицине.",
    nicheId: "MedTech",
    enrollPrice: 6900,
    gainedReputation: 7,
    expertise: [
      { nicheId: "MedTech", change: 8 }
    ]
  },
  {
    name: "Регуляторика и сертификация медтеха",
    description: "Практическая конференция по процедурам регистрации, соответствию требованиям, подготовке технической документации и взаимодействию с надзорными органами.",
    nicheId: "MedTech",
    enrollPrice: 4800,
    gainedReputation: 3,
    expertise: [
      { nicheId: "MedTech", change: 4 }
    ]
  },
  {
    name: "Искусственные органы и 3D-биопечать",
    description: "Научно-практическая конференция, посвящённая созданию прототипов искусственных органов, тканевой инженерии и использованию 3D-печати в хирургии.",
    nicheId: "MedTech",
    enrollPrice: 7000,
    gainedReputation: 6,
    expertise: [
      { nicheId: "MedTech", change: 7 }
    ]
  },
  {
    name: "Data-driven медицина: анализ больших данных в здравоохранении",
    description: "Как использовать медицинские данные для улучшения качества диагностики, лечения и прогноза заболеваний. Вопросы хранения, приватности и ML-моделей.",
    nicheId: "MedTech",
    enrollPrice: 5500,
    gainedReputation: 5,
    expertise: [
      { nicheId: "MedTech", change: 6 },
      { nicheId: "IT", change: 2 }
    ]
  },
  {
    name: "Роботизация хирургии и операционных",
    description: "Конференция для команд, работающих над роботизированными ассистентами в хирургии, навигационными системами и визуализацией в реальном времени.",
    nicheId: "MedTech",
    enrollPrice: 6600,
    gainedReputation: 6,
    expertise: [
      { nicheId: "MedTech", change: 7 }
    ]
  },
  {
    name: "Медицинская визуализация: будущее МРТ, КТ и УЗИ",
    description: "Фокус на программном обеспечении, ИИ-поддержке, улучшении изображений и создании новых методик визуализации.",
    nicheId: "MedTech",
    enrollPrice: 6200,
    gainedReputation: 5,
    expertise: [
      { nicheId: "MedTech", change: 6 }
    ]
  },
  {
    name: "Цифровые клинические исследования",
    description: "Как эффективно запускать и проводить клинические испытания с использованием цифровых инструментов: рекрутинг, трекинг, сбор данных и юридическая база.",
    nicheId: "MedTech",
    enrollPrice: 5100,
    gainedReputation: 4,
    expertise: [
      { nicheId: "MedTech", change: 5 }
    ]
  },
  {
    name: "Индивидуализированная медицина и генетические технологии",
    description: "Конференция об использовании геномных данных для персонализированного лечения, новых лекарствах и технологиях редактирования генов.",
    nicheId: "MedTech",
    enrollPrice: 6700,
    gainedReputation: 6,
    expertise: [
      { nicheId: "MedTech", change: 7 }
    ]
  },
  {
    name: "Возобновляемая энергетика: инновации и масштабирование",
    description: "Конференция о передовых решениях в солнечной, ветровой и водородной энергетике. Рассматриваются бизнес-модели и возможности масштабирования зелёных стартапов.",
    nicheId: "GreenTech",
    enrollPrice: 6700,
    gainedReputation: 6,
    expertise: [
      { nicheId: "GreenTech", change: 7 }
    ]
  },
  {
    name: "Экологичный транспорт: технологии будущего",
    description: "Обсуждение инноваций в электромобилях, водородных двигателях и инфраструктуре для устойчивой мобильности в городах.",
    nicheId: "GreenTech",
    enrollPrice: 6100,
    gainedReputation: 5,
    expertise: [
      { nicheId: "GreenTech", change: 6 },
      { nicheId: "IT", change: 1 }
    ]
  },
  {
    name: "Циркулярная экономика и вторичная переработка",
    description: "Практическая конференция о технологиях и бизнес-подходах к переработке, повторному использованию и минимизации отходов.",
    nicheId: "GreenTech",
    enrollPrice: 5900,
    gainedReputation: 4,
    expertise: [
      { nicheId: "GreenTech", change: 5 }
    ]
  },
  {
    name: "Зелёное строительство и энергоэффективные здания",
    description: "Фокус на технологиях и материалах, которые снижают углеродный след в строительстве, включая пассивные дома и умные энергоэффективные системы.",
    nicheId: "GreenTech",
    enrollPrice: 6300,
    gainedReputation: 5,
    expertise: [
      { nicheId: "GreenTech", change: 6 }
    ]
  },
  {
    name: "Карбоновый след и климатические технологии",
    description: "Технологии мониторинга, снижения и компенсации выбросов CO2. Отчётность, сертификация и глобальные рынки углеродных квот.",
    nicheId: "GreenTech",
    enrollPrice: 6700,
    gainedReputation: 6,
    expertise: [
      { nicheId: "GreenTech", change: 7 }
    ]
  },
  {
    name: "Агроэкотех: устойчивое сельское хозяйство",
    description: "Инновации в сельском хозяйстве: точное земледелие, датчики, биопрепараты, сохранение почвы и водных ресурсов.",
    nicheId: "GreenTech",
    enrollPrice: 5800,
    gainedReputation: 4,
    expertise: [
      { nicheId: "GreenTech", change: 5 }
    ]
  },
  {
    name: "Город будущего: устойчивое развитие мегаполисов",
    description: "Технологии устойчивых городов: водоснабжение, переработка, озеленение, умное освещение и транспорт.",
    nicheId: "GreenTech",
    enrollPrice: 6000,
    gainedReputation: 5,
    expertise: [
      { nicheId: "GreenTech", change: 6 }
    ]
  },
  {
    name: "Зелёные финансы и устойчивое инвестирование",
    description: "Как привлекать инвестиции в экологические проекты. ESG-подходы, зелёные облигации и венчурное финансирование.",
    nicheId: "GreenTech",
    enrollPrice: 5200,
    gainedReputation: 4,
    expertise: [
      { nicheId: "GreenTech", change: 5 }
    ]
  },
  {
    name: "Водородная экономика: от исследований к рынку",
    description: "Технологии производства, хранения и транспортировки водорода. Перспективы замещения традиционного топлива.",
    nicheId: "GreenTech",
    enrollPrice: 7000,
    gainedReputation: 7,
    expertise: [
      { nicheId: "GreenTech", change: 8 }
    ]
  },
  {
    name: "Искусственный интеллект для устойчивого развития",
    description: "Примеры применения ИИ для оптимизации энергетики, предсказания потребления ресурсов и управления отходами.",
    nicheId: "GreenTech",
    enrollPrice: 5400,
    gainedReputation: 3,
    expertise: [
      { nicheId: "GreenTech", change: 4 },
      { nicheId: "IT", change: 2 }
    ]
  },
  {
    name: "Чистая вода и технологии фильтрации",
    description: "Очистка сточных вод, опреснение, портативные фильтры, системы контроля качества воды в промышленных и частных секторах.",
    nicheId: "GreenTech",
    enrollPrice: 5600,
    gainedReputation: 4,
    expertise: [
      { nicheId: "GreenTech", change: 5 }
    ]
  },
  {
    name: "Биотехнологии в экологии и охране природы",
    description: "Применение биотехнологий для очистки почвы, воздуха и воды. Биоразлагаемые материалы и микроорганизмы для восстановления экосистем.",
    nicheId: "GreenTech",
    enrollPrice: 6500,
    gainedReputation: 5,
    expertise: [
      { nicheId: "GreenTech", change: 6 },
      { nicheId: "MedTech", change: 1 }
    ]
  }
]
);


// Кризисы (полный список как в оригинале)
db.crises.insertMany([
  {
    name: "Жёсткое регулирование со стороны экологических надзорных органов",
    description: "В нескольких странах вводятся новые, крайне жёсткие экологические нормы, что требует пересмотра производственных процессов, получения дополнительных лицензий и внедрения систем контроля выбросов.",
    danger: 4,
    niches: ["Greentech", "MedTech"],
    possibleSolutions: [
      {
        _id: "eco1",
        title: "Переход на сертифицированные технологии",
        description: "Закупка оборудования и внедрение решений, соответствующих новым нормам.",
        effect: {
          price: 0,
          expenses: 0,
          team: -10,
          progress: -20,
          reputation: -10
        },
        userEffect: {
          moneyChange: -5000,
          reputationChange: 1,
          expertise: [
            { nicheId: "Greentech", change: 10 }
          ]
        }
      },
      {
        _id: "eco2",
        title: "Аудит и частичная приостановка деятельности",
        description: "Пауза в операциях для прохождения проверки и корректировки бизнес-процессов.",
        effect: {
          price: 0,
          expenses: 0,
          team: -5,
          progress: -30,
          reputation: -15
        },
        userEffect: {
          moneyChange: -3000,
          reputationChange: -1,
          expertise: [
            { nicheId: "MedTech", change: 5 }
          ]
        }
      },
      {
        _id: "eco3",
        title: "Игнорировать регуляции",
        description: "Компания пытается продолжить работу в обход новых требований.",
        effect: {
          price: 0,
          expenses: 0,
          team: -15,
          progress: -10,
          reputation: -30
        },
        userEffect: {
          moneyChange: 2000,
          reputationChange: -2,
          expertise: [
            { nicheId: "Greentech", change: -10 }
          ]
        }
      }
    ]
  },
  {
    name: "Вспышка новой устойчивой к лечению инфекции",
    description: "В нескольких странах начинается распространение инфекции, устойчивой к стандартным антибиотикам. Системы здравоохранения перегружены, усиливается давление на медтехнологические компании.",
    danger: 5,
    niches: ["MedTech"],
    possibleSolutions: [
      {
        _id: "inf1",
        title: "Разработка и выпуск новых решений",
        description: "Срочная работа над новыми диагностическими и лечебными продуктами.",
        effect: {
          price: 0,
          expenses: 0,
          team: -10,
          progress: -15,
          reputation: -5
        },
        userEffect: {
          moneyChange: -7000,
          reputationChange: 2,
          expertise: [
            { nicheId: "MedTech", change: 15 }
          ]
        }
      },
      {
        _id: "inf2",
        title: "Переориентация на сотрудничество с клиниками",
        description: "Фокус на сервисах для госпиталей и диагностических центров.",
        effect: {
          price: 0,
          expenses: 0,
          team: -5,
          progress: -10,
          reputation: -10
        },
        userEffect: {
          moneyChange: -4000,
          reputationChange: 1,
          expertise: [
            { nicheId: "MedTech", change: 8 }
          ]
        }
      },
      {
        _id: "inf3",
        title: "Откат от темы и смена фокуса",
        description: "Уход из проблемной области и попытка избежать рисков.",
        effect: {
          price: 0,
          expenses: 0,
          team: -5,
          progress: -20,
          reputation: -20
        },
        userEffect: {
          moneyChange: -1000,
          reputationChange: -2,
          expertise: [
            { nicheId: "MedTech", change: -5 }
          ]
        }
      }
    ]
  },
  {
    name: "Поломка спутника и обломки на орбите",
    description: "Спутник крупной частной компании разрушился на орбите, образовав опасное облако обломков, которое угрожает другим аппаратам. Орбитальная деятельность временно ограничена.",
    danger: 4,
    niches: ["SpaceTech"],
    possibleSolutions: [
      {
        _id: "orb1",
        title: "Перенос запусков и корректировка траекторий",
        description: "Отложить запуски и пересчитать маршруты для избежания столкновений.",
        effect: {
          price: 0,
          expenses: 0,
          team: -5,
          progress: -25,
          reputation: -5
        },
        userEffect: {
          moneyChange: -4000,
          reputationChange: 1,
          expertise: [
            { nicheId: "SpaceTech", change: 10 }
          ]
        }
      },
      {
        _id: "orb2",
        title: "Инвестировать в технологии очистки орбиты",
        description: "Вложиться в разработку решения по удалению обломков.",
        effect: {
          price: 0,
          expenses: 0,
          team: -10,
          progress: -20,
          reputation: -10
        },
        userEffect: {
          moneyChange: -6000,
          reputationChange: 2,
          expertise: [
            { nicheId: "SpaceTech", change: 12 }
          ]
        }
      },
      {
        _id: "orb3",
        title: "Игнорировать ситуацию",
        description: "Продолжить деятельность без изменений, рискуя потерей аппаратов.",
        effect: {
          price: 0,
          expenses: 0,
          team: -20,
          progress: -10,
          reputation: -30
        },
        userEffect: {
          moneyChange: 2000,
          reputationChange: -3,
          expertise: [
            { nicheId: "SpaceTech", change: -10 }
          ]
        }
      }
    ]
  },
  {
    name: "Сбой в глобальной сети спутников GPS",
    description: "В результате сбоя в системе спутников навигации нарушена работа геолокации, логистики и связанных решений.",
    danger: 5,
    niches: ["IT", "SpaceTech"],
    possibleSolutions: [
      {
        _id: "gps1",
        title: "Переключение на альтернативные системы",
        description: "Интеграция с другими навигационными решениями, такими как ГЛОНАСС или Galileo.",
        effect: {
          price: 0,
          expenses: 0,
          team: -8,
          progress: -20,
          reputation: -10
        },
        userEffect: {
          moneyChange: -5000,
          reputationChange: 2,
          expertise: [
            { nicheId: "IT", change: 8 },
            { nicheId: "SpaceTech", change: 5 }
          ]
        }
      },
      {
        _id: "gps2",
        title: "Разработка автономных решений на базе ИИ",
        description: "Создание ИИ-систем для ориентации без спутниковой привязки.",
        effect: {
          price: 0,
          expenses: 0,
          team: -10,
          progress: -25,
          reputation: -5
        },
        userEffect: {
          moneyChange: -6000,
          reputationChange: 1,
          expertise: [
            { nicheId: "IT", change: 10 }
          ]
        }
      },
      {
        _id: "gps3",
        title: "Временно заморозить проекты",
        description: "Пауза в развитии сервисов до стабилизации ситуации.",
        effect: {
          price: 0,
          expenses: 0,
          team: -5,
          progress: -30,
          reputation: -20
        },
        userEffect: {
          moneyChange: -1000,
          reputationChange: -2,
          expertise: [
            { nicheId: "SpaceTech", change: -5 }
          ]
        }
      }
    ]
  }, 
  {
    name: "Глобальный сбой в цепочках поставок",
    description: "Из-за внезапного закрытия ряда ключевых портов и ограничений на логистику происходит значительный сбой в поставках компонентов и оборудования. Компании испытывают дефицит ресурсов и задержки в производстве.",
    danger: 4,
    niches: ["IT", "MedTech", "GreenTech"],
    possibleSolutions: [
      {
        _id: "solution1",
        title: "Поиск локальных поставщиков",
        description: "Организация альтернативных цепочек поставок на региональном уровне.",
        effect: {
          price: 0,
          expenses: 0,
          team: -5,
          progress: -15,
          reputation: -10
        },
        userEffect: {
          moneyChange: -4000,
          reputationChange: 1,
          expertise: [
            {
              nicheId: "GreenTech",
              change: 10
            }
          ]
        }
      },
      {
        _id: "solution2",
        title: "Увеличение складских запасов в долг",
        description: "Закупка компонентов впрок с привлечением кредитных средств.",
        effect: {
          price: 0,
          expenses: 0,
          team: -10,
          progress: -10,
          reputation: -15
        },
        userEffect: {
          moneyChange: -7000,
          reputationChange: 0,
          expertise: [
            {
              nicheId: "IT",
              change: 5
            }
          ]
        }
      },
      {
        _id: "solution3",
        title: "Сокращение производства",
        description: "Временное сокращение производственной активности для адаптации к ситуации.",
        effect: {
          price: 0,
          expenses: 0,
          team: -15,
          progress: -25,
          reputation: -20
        },
        userEffect: {
          moneyChange: -1000,
          reputationChange: -1,
          expertise: [
            {
              nicheId: "MedTech",
              change: -5
            }
          ]
        }
      }
    ]
  },
  {
    name: "Массовая утечка персональных данных",
    description: "Хакеры получили доступ к конфиденциальной информации пользователей. Компании теряют доверие клиентов и сталкиваются с юридическими последствиями.",
    danger: 5,
    niches: ["IT", "MedTech"],
    possibleSolutions: [
      {
        _id: "solution1",
        title: "Экстренная смена всей системы безопасности",
        description: "Полная модернизация систем защиты данных и аудит безопасности.",
        effect: {
          price: 0,
          expenses: 0,
          team: -10,
          progress: -20,
          reputation: -10
        },
        userEffect: {
          moneyChange: -6000,
          reputationChange: 1,
          expertise: [
            {
              nicheId: "IT",
              change: 15
            }
          ]
        }
      },
      {
        _id: "solution2",
        title: "Открытая PR-кампания с признанием вины",
        description: "Публичное извинение и информирование пользователей о последствиях.",
        effect: {
          price: 0,
          expenses: 0,
          team: -5,
          progress: -10,
          reputation: -15
        },
        userEffect: {
          moneyChange: -3000,
          reputationChange: 0,
          expertise: [
            {
              nicheId: "MedTech",
              change: 5
            }
          ]
        }
      },
      {
        _id: "solution3",
        title: "Попытка скрыть факт утечки",
        description: "Принятие решения не разглашать факт утечки данных.",
        effect: {
          price: 0,
          expenses: 0,
          team: -20,
          progress: -30,
          reputation: -30
        },
        userEffect: {
          moneyChange: 1000,
          reputationChange: -1,
          expertise: [
            {
              nicheId: "IT",
              change: -10
            }
          ]
        }
      }
    ]
  },
  {
    name: "Жёсткое ужесточение экологических норм",
    description: "Внезапное введение новых нормативов по выбросам и переработке отходов. Компании вынуждены быстро перестраивать процессы.",
    danger: 3,
    niches: ["GreenTech", "MedTech"],
    possibleSolutions: [
      {
        _id: "solution1",
        title: "Полный пересмотр технологий",
        description: "Внедрение новых экологичных производственных процессов.",
        effect: {
          price: 0,
          expenses: 0,
          team: -15,
          progress: -20,
          reputation: -5
        },
        userEffect: {
          moneyChange: -5000,
          reputationChange: 1,
          expertise: [
            {
              nicheId: "GreenTech",
              change: 10
            }
          ]
        }
      },
      {
        _id: "solution2",
        title: "Оптимизация существующих процессов",
        description: "Адаптация текущего производства под новые стандарты.",
        effect: {
          price: 0,
          expenses: 0,
          team: -10,
          progress: -15,
          reputation: -10
        },
        userEffect: {
          moneyChange: -3000,
          reputationChange: 0,
          expertise: [
            {
              nicheId: "MedTech",
              change: 5
            }
          ]
        }
      },
      {
        _id: "solution3",
        title: "Игнорирование новых норм",
        description: "Продолжение работы без учёта новых требований.",
        effect: {
          price: 0,
          expenses: 0,
          team: -5,
          progress: -10,
          reputation: -30
        },
        userEffect: {
          moneyChange: 2000,
          reputationChange: -1,
          expertise: [
            {
              nicheId: "GreenTech",
              change: -10
            }
          ]
        }
      }
    ]
  },
  {
    name: "Ограничение доступа к редкоземельным металлам",
    description: "Из-за политического конфликта крупнейшие поставщики редкоземельных металлов приостанавливают экспорт. Это критично для производства электроники, медицинского оборудования, спутников и зелёных технологий.",
    danger: 5,
    niches: ["IT", "MedTech", "SpaceTech", "GreenTech"],
    possibleSolutions: [
      {
        _id: "sol1",
        title: "Переход на альтернативные материалы",
        description: "Адаптация технологических решений под менее дефицитные материалы.",
        effect: {
          price: 0,
          expenses: 0,
          team: -15,
          progress: -20,
          reputation: -10
        },
        userEffect: {
          moneyChange: -6000,
          reputationChange: 1,
          expertise: [
            {
              nicheId: "GreenTech",
              change: 10
            },
            {
              nicheId: "SpaceTech",
              change: 5
            }
          ]
        }
      },
      {
        _id: "sol2",
        title: "Закупка сырья на чёрном рынке",
        description: "Использование нелегальных каналов поставки в обход санкций.",
        effect: {
          price: 0,
          expenses: 0,
          team: -10,
          progress: -10,
          reputation: -30
        },
        userEffect: {
          moneyChange: -3000,
          reputationChange: -1,
          expertise: [
            {
              nicheId: "IT",
              change: -10
            }
          ]
        }
      },
      {
        _id: "sol3",
        title: "Временная приостановка R&D",
        description: "Заморозка всех новых проектов и концентрация на сохранении текущих мощностей.",
        effect: {
          price: 0,
          expenses: 0,
          team: -20,
          progress: -30,
          reputation: -15
        },
        userEffect: {
          moneyChange: 1000,
          reputationChange: -1,
          expertise: [
            {
              nicheId: "MedTech",
              change: -5
            }
          ]
        }
      }
    ]
  },
  {
    name: "Глобальная кибератака на облачные сервисы",
    description: "Скоординированная атака нарушает работу ключевых облачных платформ. Множество стартапов теряют доступ к данным, сервисам и инфраструктуре.",
    danger: 4,
    niches: ["IT", "MedTech", "GreenTech"],
    possibleSolutions: [
      {
        _id: "sol4",
        title: "Перенос инфраструктуры на локальные серверы",
        description: "Разворачивание собственных дата-центров и отказ от облака.",
        effect: {
          price: 0,
          expenses: 0,
          team: -15,
          progress: -25,
          reputation: -5
        },
        userEffect: {
          moneyChange: -5000,
          reputationChange: 1,
          expertise: [
            {
              nicheId: "IT",
              change: 15
            }
          ]
        }
      },
      {
        _id: "sol5",
        title: "Сотрудничество с альтернативными облачными провайдерами",
        description: "Быстрая миграция на менее популярные, но безопасные облачные платформы.",
        effect: {
          price: 0,
          expenses: 0,
          team: -10,
          progress: -15,
          reputation: -10
        },
        userEffect: {
          moneyChange: -4000,
          reputationChange: 0,
          expertise: [
            {
              nicheId: "GreenTech",
              change: 5
            }
          ]
        }
      },
      {
        _id: "sol6",
        title: "Полная остановка цифровых сервисов",
        description: "Приостановка всех процессов, завязанных на облако, до восстановления.",
        effect: {
          price: 0,
          expenses: 0,
          team: -20,
          progress: -30,
          reputation: -25
        },
        userEffect: {
          moneyChange: -1000,
          reputationChange: -1,
          expertise: [
            {
              nicheId: "MedTech",
              change: -10
            }
          ]
        }
      }
    ]
  },
  {
    name: "Мировой энергетический кризис",
    description: "Цены на электроэнергию и топливо резко возросли. Производственные и исследовательские процессы под угрозой.",
    danger: 4,
    niches: ["GreenTech", "SpaceTech", "MedTech"],
    possibleSolutions: [
      {
        _id: "sol7",
        title: "Переход на автономные источники энергии",
        description: "Внедрение солнечных и других альтернативных решений для снижения зависимости.",
        effect: {
          price: 0,
          expenses: 0,
          team: -10,
          progress: -15,
          reputation: -5
        },
        userEffect: {
          moneyChange: -6000,
          reputationChange: 1,
          expertise: [
            {
              nicheId: "GreenTech",
              change: 10
            }
          ]
        }
      },
      {
        _id: "sol8",
        title: "Аренда энергомощностей у частных поставщиков",
        description: "Получение энергии по завышенной цене, но без простоев.",
        effect: {
          price: 0,
          expenses: 0,
          team: -5,
          progress: -10,
          reputation: -10
        },
        userEffect: {
          moneyChange: -7000,
          reputationChange: 0,
          expertise: [
            {
              nicheId: "SpaceTech",
              change: 5
            }
          ]
        }
      },
      {
        _id: "sol9",
        title: "Сокращение производства",
        description: "Ограничение работы в целях экономии энергии.",
        effect: {
          price: 0,
          expenses: 0,
          team: -20,
          progress: -25,
          reputation: -20
        },
        userEffect: {
          moneyChange: -2000,
          reputationChange: -1,
          expertise: [
            {
              nicheId: "MedTech",
              change: -5
            }
          ]
        }
      }
    ]
  },
  {
    name: "Глобальная эпидемия нового вируса",
    description: "Новый вирус с высокой заразностью и летальностью нарушает логистику, снижает продуктивность и требует экстренных медицинских решений.",
    danger: 5,
    niches: ["MedTech", "GreenTech", "IT"],
    possibleSolutions: [
      {
        _id: "sol10",
        title: "Переход на удалённую модель работы",
        description: "Организация процессов в дистанционном формате с новыми технологиями.",
        effect: {
          price: 0,
          expenses: 0,
          team: -5,
          progress: -10,
          reputation: -5
        },
        userEffect: {
          moneyChange: -2000,
          reputationChange: 1,
          expertise: [
            {
              nicheId: "IT",
              change: 10
            }
          ]
        }
      },
      {
        _id: "sol11",
        title: "Разработка медицинского ПО для контроля",
        description: "Создание решений для отслеживания, диагностики и прогнозирования болезни.",
        effect: {
          price: 0,
          expenses: 0,
          team: -10,
          progress: -20,
          reputation: -10
        },
        userEffect: {
          moneyChange: -5000,
          reputationChange: 1,
          expertise: [
            {
              nicheId: "MedTech",
              change: 15
            }
          ]
        }
      },
      {
        _id: "sol12",
        title: "Остановка всех исследований и инвестиций",
        description: "Резкое сокращение расходов и отказ от развития.",
        effect: {
          price: 0,
          expenses: 0,
          team: -20,
          progress: -30,
          reputation: -25
        },
        userEffect: {
          moneyChange: 2000,
          reputationChange: -1,
          expertise: [
            {
              nicheId: "GreenTech",
              change: -10
            }
          ]
        }
      }
    ]
  },
  {
    name: "Финансовый крах венчурного рынка",
    description: "Фонды массово замораживают инвестиции в стартапы. Получить финансирование почти невозможно.",
    danger: 5,
    niches: ["IT", "MedTech", "SpaceTech", "GreenTech"],
    possibleSolutions: [
      {
        _id: "sol13",
        title: "Переход на самоокупаемость",
        description: "Фокус на прибыль, отказ от масштабирования.",
        effect: {
          price: 0,
          expenses: 0,
          team: -15,
          progress: -15,
          reputation: -10
        },
        userEffect: {
          moneyChange: -2000,
          reputationChange: 1,
          expertise: [
            {
              nicheId: "IT",
              change: 10
            },
            {
              nicheId: "MedTech",
              change: 5
            }
          ]
        }
      },
      {
        _id: "sol14",
        title: "Попытка продаться корпорации",
        description: "Переговоры о слиянии с крупной компанией.",
        effect: {
          price: 0,
          expenses: 0,
          team: -10,
          progress: -20,
          reputation: -5
        },
        userEffect: {
          moneyChange: 3000,
          reputationChange: 0,
          expertise: [
            {
              nicheId: "SpaceTech",
              change: 10
            }
          ]
        }
      },
      {
        _id: "sol15",
        title: "Сокращение 70% команды",
        description: "Увольнение сотрудников ради снижения издержек.",
        effect: {
          price: 0,
          expenses: 0,
          team: -20,
          progress: -30,
          reputation: -30
        },
        userEffect: {
          moneyChange: 7000,
          reputationChange: -1,
          expertise: [
            {
              nicheId: "GreenTech",
              change: -10
            }
          ]
        }
      }
    ]
  },
  {
    name: "Глобальный дефицит редкоземельных металлов",
    description: "Резкий рост спроса и геополитические конфликты привели к дефициту редкоземельных металлов, необходимых для производства электроники, медицинского оборудования и космических технологий.",
    danger: 4,
    niches: ["SpaceTech", "MedTech", "IT", "GreenTech"],
    possibleSolutions: [
      {
        _id: "sol101",
        title: "Поиск альтернативных материалов",
        description: "Разработка и внедрение заменителей редкоземельных металлов в производстве.",
        effect: {
          price: 0,
          expenses: 0,
          team: -10,
          progress: -20,
          reputation: -5
        },
        userEffect: {
          moneyChange: -3000,
          reputationChange: 1,
          expertise: [
            { nicheId: "GreenTech", change: 10 }
          ]
        }
      },
      {
        _id: "sol102",
        title: "Оптимизация потребления ресурсов",
        description: "Внедрение технологий по снижению расхода редкоземельных металлов и переработке отходов.",
        effect: {
          price: 0,
          expenses: 0,
          team: -5,
          progress: -15,
          reputation: -10
        },
        userEffect: {
          moneyChange: -1500,
          reputationChange: 1,
          expertise: [
            { nicheId: "IT", change: 5 },
            { nicheId: "MedTech", change: 5 }
          ]
        }
      },
      {
        _id: "sol103",
        title: "Закупка у новых поставщиков",
        description: "Поиск и установление контрактов с альтернативными поставщиками на новых рынках.",
        effect: {
          price: 0,
          expenses: 0,
          team: -15,
          progress: -10,
          reputation: -5
        },
        userEffect: {
          moneyChange: -4000,
          reputationChange: 0,
          expertise: [
            { nicheId: "SpaceTech", change: 5 }
          ]
        }
      }
    ]
  },
  {
    name: "Вспышка опасного вируса с воздействием на технологии",
    description: "Пандемия нового вируса вызывает перебои в работе медтехники, логистики и производства технологических стартапов, снижая общую эффективность отраслей.",
    danger: 5,
    niches: ["MedTech", "IT", "GreenTech"],
    possibleSolutions: [
      {
        _id: "sol104",
        title: "Автоматизация и удалённая работа",
        description: "Массовый переход на удалённые технологии и автоматизацию производства для минимизации риска заражения.",
        effect: {
          price: 0,
          expenses: 0,
          team: -20,
          progress: -25,
          reputation: -5
        },
        userEffect: {
          moneyChange: -5000,
          reputationChange: 1,
          expertise: [
            { nicheId: "IT", change: 10 }
          ]
        }
      },
      {
        _id: "sol105",
        title: "Разработка новых медицинских решений",
        description: "Инвестиции в инновационные медицинские устройства и препараты для борьбы с вирусом.",
        effect: {
          price: 0,
          expenses: 0,
          team: -15,
          progress: -20,
          reputation: -10
        },
        userEffect: {
          moneyChange: -6000,
          reputationChange: 1,
          expertise: [
            { nicheId: "MedTech", change: 15 }
          ]
        }
      },
      {
        _id: "sol106",
        title: "Сокращение производства и реструктуризация бизнеса",
        description: "Временное снижение объёмов производства и переориентация ресурсов для устойчивости бизнеса.",
        effect: {
          price: 0,
          expenses: 0,
          team: -10,
          progress: -15,
          reputation: -10
        },
        userEffect: {
          moneyChange: -2000,
          reputationChange: 0,
          expertise: [
            { nicheId: "GreenTech", change: -5 }
          ]
        }
      }
    ]
  },
  {
    name: "Международные санкции и торговые ограничения",
    description: "Введение новых санкций и ограничений на экспорт технологий и оборудования усложняет ведение бизнеса в нескольких нишах.",
    danger: 4,
    niches: ["SpaceTech", "IT", "GreenTech"],
    possibleSolutions: [
      {
        _id: "sol107",
        title: "Локализация производства",
        description: "Организация производственных мощностей внутри страны для обхода санкций.",
        effect: {
          price: 0,
          expenses: 0,
          team: -15,
          progress: -20,
          reputation: -10
        },
        userEffect: {
          moneyChange: -4500,
          reputationChange: 1,
          expertise: [
            { nicheId: "GreenTech", change: 10 }
          ]
        }
      },
      {
        _id: "sol108",
        title: "Переориентация на внутренний рынок",
        description: "Смена целевой аудитории и оптимизация продуктов под локальных потребителей.",
        effect: {
          price: 0,
          expenses: 0,
          team: -10,
          progress: -15,
          reputation: -5
        },
        userEffect: {
          moneyChange: -2000,
          reputationChange: 0,
          expertise: [
            { nicheId: "SpaceTech", change: 5 }
          ]
        }
      },
      {
        _id: "sol109",
        title: "Альянсы с дружественными странами",
        description: "Поиск партнёров и поставщиков в странах без ограничений для сохранения цепочек поставок.",
        effect: {
          price: 0,
          expenses: 0,
          team: -10,
          progress: -10,
          reputation: -5
        },
        userEffect: {
          moneyChange: -3500,
          reputationChange: 1,
          expertise: [
            { nicheId: "IT", change: 5 }
          ]
        }
      }
    ]
  },
  {
    name: "Экологический кризис и ужесточение норм",
    description: "Повышение экологических требований и ужесточение законодательства создаёт препятствия для стартапов в области энергетики, технологий и медицины.",
    danger: 5,
    niches: ["GreenTech", "MedTech", "IT"],
    possibleSolutions: [
      {
        _id: "sol110",
        title: "Инвестиции в экологичные технологии",
        description: "Модернизация производства и продуктов с учётом новых стандартов экологичности.",
        effect: {
          price: 0,
          expenses: 0,
          team: -15,
          progress: -25,
          reputation: -5
        },
        userEffect: {
          moneyChange: -6000,
          reputationChange: 1,
          expertise: [
            { nicheId: "GreenTech", change: 15 }
          ]
        }
      },
      {
        _id: "sol111",
        title: "Сокращение вредных выбросов и отходов",
        description: "Оптимизация процессов для минимизации загрязнений и штрафов.",
        effect: {
          price: 0,
          expenses: 0,
          team: -10,
          progress: -15,
          reputation: -10
        },
        userEffect: {
          moneyChange: -3000,
          reputationChange: 1,
          expertise: [
            { nicheId: "MedTech", change: 5 }
          ]
        }
      },
      {
        _id: "sol112",
        title: "Привлечение экологических сертификаций",
        description: "Получение международных и национальных сертификатов для улучшения имиджа и доверия.",
        effect: {
          price: 0,
          expenses: 0,
          team: -5,
          progress: -10,
          reputation: -5
        },
        userEffect: {
          moneyChange: -1500,
          reputationChange: 2,
          expertise: [
            { nicheId: "IT", change: 5 }
          ]
        }
      }
    ]
  },
  {
    name: "Крах международных фондовых рынков",
    description: "Резкое падение мировых фондовых рынков вызвало сокращение инвестиций и уменьшение финансирования стартапов в разных технологических отраслях.",
    danger: 5,
    niches: ["IT", "MedTech", "SpaceTech", "GreenTech"],
    possibleSolutions: [
      {
        _id: "sol201",
        title: "Пересмотр финансовой стратегии",
        description: "Оптимизация расходов и поиск альтернативных источников финансирования для сохранения работы.",
        effect: {
          price: 0,
          expenses: 0,
          team: -15,
          progress: -20,
          reputation: -10
        },
        userEffect: {
          moneyChange: -4000,
          reputationChange: 0,
          expertise: [
            { nicheId: "IT", change: -5 },
            { nicheId: "GreenTech", change: -5 }
          ]
        }
      },
      {
        _id: "sol202",
        title: "Усиление работы с клиентами",
        description: "Фокус на удержании и расширении клиентской базы для повышения стабильности доходов.",
        effect: {
          price: 0,
          expenses: 0,
          team: -10,
          progress: -15,
          reputation: -5
        },
        userEffect: {
          moneyChange: -1500,
          reputationChange: 1,
          expertise: [
            { nicheId: "MedTech", change: 5 }
          ]
        }
      },
      {
        _id: "sol203",
        title: "Перенос стартапа в менее рискованную нишу",
        description: "Диверсификация бизнеса или смена направления на более устойчивый сектор.",
        effect: {
          price: 0,
          expenses: 0,
          team: -20,
          progress: -25,
          reputation: -15
        },
        userEffect: {
          moneyChange: -5000,
          reputationChange: -1,
          expertise: [
            { nicheId: "SpaceTech", change: -10 }
          ]
        }
      }
    ]
  },
  {
    name: "Кибератаки на инфраструктуру стартапов",
    description: "Массовые хакерские атаки вызывают сбои в работе IT-сервисов и технологических систем во всех связанных нишах.",
    danger: 4,
    niches: ["IT", "MedTech", "SpaceTech"],
    possibleSolutions: [
      {
        _id: "sol204",
        title: "Инвестиции в кибербезопасность",
        description: "Усиление защиты и внедрение современных систем безопасности для предотвращения атак.",
        effect: {
          price: 0,
          expenses: 0,
          team: -15,
          progress: -20,
          reputation: -5
        },
        userEffect: {
          moneyChange: -4000,
          reputationChange: 2,
          expertise: [
            { nicheId: "IT", change: 15 }
          ]
        }
      },
      {
        _id: "sol205",
        title: "Обучение команды реагированию на атаки",
        description: "Подготовка сотрудников к быстрому реагированию и восстановлению работы после атак.",
        effect: {
          price: 0,
          expenses: 0,
          team: -10,
          progress: -15,
          reputation: -10
        },
        userEffect: {
          moneyChange: -2500,
          reputationChange: 1,
          expertise: [
            { nicheId: "MedTech", change: 5 }
          ]
        }
      },
      {
        _id: "sol206",
        title: "Переход на более защищённые платформы",
        description: "Миграция сервисов и данных на платформы с повышенным уровнем защиты и резервирования.",
        effect: {
          price: 0,
          expenses: 0,
          team: -10,
          progress: -10,
          reputation: -5
        },
        userEffect: {
          moneyChange: -3000,
          reputationChange: 1,
          expertise: [
            { nicheId: "SpaceTech", change: 5 }
          ]
        }
      }
    ]
  },
  {
    name: "Снижение доверия потребителей к новым технологиям",
    description: "Обострение общественной критики и страхи пользователей снижают спрос на инновационные продукты и сервисы в нескольких нишах.",
    danger: 3,
    niches: ["IT", "MedTech", "GreenTech"],
    possibleSolutions: [
      {
        _id: "sol207",
        title: "Повышение прозрачности и информирование",
        description: "Активная работа с клиентами, разъяснение преимуществ и безопасности технологий.",
        effect: {
          price: 0,
          expenses: 0,
          team: -5,
          progress: -10,
          reputation: -5
        },
        userEffect: {
          moneyChange: -1500,
          reputationChange: 2,
          expertise: [
            { nicheId: "GreenTech", change: 10 }
          ]
        }
      },
      {
        _id: "sol208",
        title: "Улучшение качества продуктов",
        description: "Инвестиции в разработку более надёжных и удобных решений для повышения лояльности пользователей.",
        effect: {
          price: 0,
          expenses: 0,
          team: -15,
          progress: -20,
          reputation: -10
        },
        userEffect: {
          moneyChange: -4000,
          reputationChange: 1,
          expertise: [
            { nicheId: "MedTech", change: 5 }
          ]
        }
      },
      {
        _id: "sol209",
        title: "Партнёрства с авторитетными организациями",
        description: "Создание альянсов с известными институтами и брендами для повышения доверия.",
        effect: {
          price: 0,
          expenses: 0,
          team: -10,
          progress: -15,
          reputation: -5
        },
        userEffect: {
          moneyChange: -3000,
          reputationChange: 2,
          expertise: [
            { nicheId: "IT", change: 5 }
          ]
        }
      }
    ]
  },
  {
    name: "Массовый сбой энергоснабжения",
    description: "Длительные перебои с электричеством затрагивают работу стартапов в сферах технологий, медицины и космоса, снижая производительность и возможности развития.",
    danger: 5,
    niches: ["SpaceTech", "MedTech", "IT"],
    possibleSolutions: [
      {
        _id: "sol210",
        title: "Внедрение резервных источников питания",
        description: "Установка генераторов и аккумуляторов для обеспечения бесперебойной работы оборудования.",
        effect: {
          price: 0,
          expenses: 0,
          team: -20,
          progress: -25,
          reputation: -10
        },
        userEffect: {
          moneyChange: -6000,
          reputationChange: 1,
          expertise: [
            { nicheId: "SpaceTech", change: 10 }
          ]
        }
      },
      {
        _id: "sol211",
        title: "Оптимизация энергопотребления",
        description: "Снижение энергозатрат за счёт оптимизации процессов и использования энергоэффективных технологий.",
        effect: {
          price: 0,
          expenses: 0,
          team: -10,
          progress: -15,
          reputation: -5
        },
        userEffect: {
          moneyChange: -3000,
          reputationChange: 1,
          expertise: [
            { nicheId: "MedTech", change: 5 }
          ]
        }
      },
      {
        _id: "sol212",
        title: "Переход на альтернативные источники энергии",
        description: "Использование солнечной, ветровой и других возобновляемых источников для автономной работы.",
        effect: {
          price: 0,
          expenses: 0,
          team: -15,
          progress: -20,
          reputation: -10
        },
        userEffect: {
          moneyChange: -4500,
          reputationChange: 2,
          expertise: [
            { nicheId: "IT", change: 5 }
          ]
        }
      }
    ]
  }
]);

// Добавление стартапов (по 8 для каждой ниши)
db.startups.insertMany([
  {
    "_id": "startup-IT-001",
    "name": "CodeNest",
    "description": "Онлайн-платформа для совместной разработки кода в реальном времени с поддержкой ИИ.",
    "price": 27450,
    "uniqueProductOffer": "Позволяет разработчикам из разных стран писать код одновременно без задержек и конфликтов.",
    "lastMonthRevenue": 8610,
    "expenses": 7190,
    "team": 15,
    "budget": 4380,
    "product": 42,
    "reputation": 37,
    "level": 3,
    "stage": "MARKET",
    "niche": "IT"
  },
  {
    "_id": "startup-IT-002",
    "name": "BugReaper",
    "description": "Сервис автоматического поиска и устранения багов в программном коде.",
    "price": 31200,
    "uniqueProductOffer": "Использует ИИ для анализа логов и предлагает исправления в автоматическом режиме.",
    "lastMonthRevenue": 9030,
    "expenses": 7580,
    "team": 20,
    "budget": 2890,
    "product": 49,
    "reputation": 45,
    "level": 4,
    "stage": "MARKET",
    "niche": "IT"
  },
  {
    "_id": "startup-IT-003",
    "name": "CloudRun",
    "description": "Инфраструктура для масштабирования микросервисов без настройки серверов.",
    "price": 38400,
    "uniqueProductOffer": "Позволяет развернуть сервис за считанные секунды без необходимости управления кластерами.",
    "lastMonthRevenue": 9920,
    "expenses": 9370,
    "team": 35,
    "budget": 1360,
    "product": 47,
    "reputation": 41,
    "level": 5,
    "stage": "SCALE",
    "niche": "IT"
  },
  {
    "_id": "startup-IT-004",
    "name": "DevPulse",
    "description": "Платформа аналитики продуктивности команд разработчиков.",
    "price": 18300,
    "uniqueProductOffer": "Отслеживает показатели производительности и выгорания в команде в режиме реального времени.",
    "lastMonthRevenue": 4790,
    "expenses": 6890,
    "team": 9,
    "budget": 4920,
    "product": 28,
    "reputation": 22,
    "level": 2,
    "stage": "MVP",
    "niche": "IT"
  },
  {
    "_id": "startup-IT-005",
    "name": "AlgoTutor",
    "description": "Интерактивный обучающий сервис по алгоритмам и структурам данных.",
    "price": 24100,
    "uniqueProductOffer": "Учит программированию с помощью адаптивных тестов и разбора решений настоящих задач.",
    "lastMonthRevenue": 7560,
    "expenses": 6420,
    "team": 13,
    "budget": 3940,
    "product": 43,
    "reputation": 38,
    "level": 3,
    "stage": "MARKET",
    "niche": "IT"
  },
  {
    "_id": "startup-IT-006",
    "name": "SecuEye",
    "description": "Решение для мониторинга и предотвращения кибератак в малом бизнесе.",
    "price": 39700,
    "uniqueProductOffer": "Обнаруживает угрозы в трафике и предлагает автоматические меры по их устранению.",
    "lastMonthRevenue": 8540,
    "expenses": 9010,
    "team": 28,
    "budget": 2210,
    "product": 46,
    "reputation": 44,
    "level": 4,
    "stage": "MARKET",
    "niche": "IT"
  },
  {
    "_id": "startup-IT-007",
    "name": "ScriptForge",
    "description": "Сервис для генерации скриптов и ботов под задачи автоматизации бизнеса.",
    "price": 20800,
    "uniqueProductOffer": "Создаёт рабочие сценарии по описанию задачи на русском языке.",
    "lastMonthRevenue": 6610,
    "expenses": 6350,
    "team": 11,
    "budget": 3530,
    "product": 39,
    "reputation": 30,
    "level": 3,
    "stage": "MARKET",
    "niche": "IT"
  },
  {
    "_id": "startup-IT-008",
    "name": "NoCodeSky",
    "description": "Конструктор бизнес-приложений без программирования.",
    "price": 32300,
    "uniqueProductOffer": "Позволяет малому бизнесу создавать CRM и ERP системы самостоятельно за один день.",
    "lastMonthRevenue": 9780,
    "expenses": 9040,
    "team": 33,
    "budget": 4150,
    "product": 50,
    "reputation": 49,
    "level": 5,
    "stage": "SCALE",
    "niche": "IT"
  },
  {
    "_id": "startup-IT-009",
    "name": "SyncBase",
    "description": "Инструмент для синхронизации баз данных между разными платформами.",
    "price": 16100,
    "uniqueProductOffer": "Решает проблемы миграции и слияния баз данных с минимальными потерями.",
    "lastMonthRevenue": 4880,
    "expenses": 5270,
    "team": 10,
    "budget": 3020,
    "product": 27,
    "reputation": 24,
    "level": 2,
    "stage": "MVP",
    "niche": "IT"
  },
  {
    "_id": "startup-IT-010",
    "name": "PixeLink",
    "description": "Облачное хранилище и система управления изображениями для разработчиков.",
    "price": 19600,
    "uniqueProductOffer": "Предоставляет API для обработки, хранения и публикации изображений без лишнего кода.",
    "lastMonthRevenue": 6950,
    "expenses": 7090,
    "team": 14,
    "budget": 4170,
    "product": 38,
    "reputation": 35,
    "level": 3,
    "stage": "MARKET",
    "niche": "IT"
  },
  {
    "_id": "startup-IT-011",
    "name": "AITrack",
    "description": "Сервис для слежения за действиями пользователей на сайтах и прогнозирования их поведения.",
    "price": 25500,
    "uniqueProductOffer": "Анализирует поведение клиентов и повышает конверсию с помощью ИИ-моделей.",
    "lastMonthRevenue": 8890,
    "expenses": 7730,
    "team": 21,
    "budget": 2850,
    "product": 45,
    "reputation": 39,
    "level": 4,
    "stage": "MARKET",
    "niche": "IT"
  },
  {
    "_id": "startup-IT-012",
    "name": "TaskQuake",
    "description": "Система управления задачами и коммуникацией в командах с адаптацией под методологии.",
    "price": 21700,
    "uniqueProductOffer": "Автоматически настраивает процессы под Scrum, Kanban или гибридные подходы.",
    "lastMonthRevenue": 5820,
    "expenses": 6630,
    "team": 18,
    "budget": 3710,
    "product": 31,
    "reputation": 28,
    "level": 3,
    "stage": "MVP",
    "niche": "IT"
  },
  {
    "_id": "startup-SpaceTech-001",
    "name": "OrbitalSync",
    "description": "Разрабатывает систему синхронизации спутников для предотвращения столкновений на орбите",
    "price": 37000,
    "uniqueProductOffer": "Первое решение на рынке, позволяющее автоматически корректировать орбиты спутников в реальном времени",
    "lastMonthRevenue": 6700,
    "expenses": 7200,
    "team": 18,
    "budget": 4900,
    "product": 37,
    "reputation": 42,
    "level": 3,
    "stage": "MARKET",
    "niche": "SpaceTech"
  },
  {
    "_id": "startup-SpaceTech-002",
    "name": "StellarForge",
    "description": "Создаёт модульные спутники с возможностью апгрейда на орбите",
    "price": 29000,
    "uniqueProductOffer": "Спутники, которые можно улучшать без возвращения на Землю, сокращая затраты до 60%",
    "lastMonthRevenue": 8600,
    "expenses": 9400,
    "team": 25,
    "budget": 3500,
    "product": 43,
    "reputation": 39,
    "level": 4,
    "stage": "SCALE",
    "niche": "SpaceTech"
  },
  {
    "_id": "startup-SpaceTech-003",
    "name": "LunaNet",
    "description": "Разрабатывает сеть бесперебойной связи между Землёй и лунной орбитой",
    "price": 34000,
    "uniqueProductOffer": "Единая сетевая инфраструктура для управления миссиями на Луне в реальном времени",
    "lastMonthRevenue": 7800,
    "expenses": 7700,
    "team": 22,
    "budget": 2900,
    "product": 45,
    "reputation": 40,
    "level": 3,
    "stage": "MARKET",
    "niche": "SpaceTech"
  },
  {
    "_id": "startup-SpaceTech-004",
    "name": "CosmoDock",
    "description": "Разрабатывает автономные орбитальные док-станции для заправки спутников",
    "price": 40000,
    "uniqueProductOffer": "Позволяет продлевать срок службы спутников без вывода новых аппаратов на орбиту",
    "lastMonthRevenue": 9300,
    "expenses": 8900,
    "team": 27,
    "budget": 4400,
    "product": 48,
    "reputation": 47,
    "level": 4,
    "stage": "SCALE",
    "niche": "SpaceTech"
  },
  {
    "_id": "startup-SpaceTech-005",
    "name": "AstroSoil",
    "description": "Проводит исследования по созданию почвы для марсианских теплиц",
    "price": 16000,
    "uniqueProductOffer": "Субстрат, способный удерживать влагу и питательные вещества в условиях Марса",
    "lastMonthRevenue": 4800,
    "expenses": 5400,
    "team": 11,
    "budget": 3900,
    "product": 29,
    "reputation": 33,
    "level": 2,
    "stage": "MVP",
    "niche": "SpaceTech"
  },
  {
    "_id": "startup-SpaceTech-006",
    "name": "RadiShield",
    "description": "Создаёт технологии защиты от космической радиации для пилотируемых миссий",
    "price": 24000,
    "uniqueProductOffer": "Компактный защитный материал, снижающий радиационную нагрузку на 85%",
    "lastMonthRevenue": 5300,
    "expenses": 5000,
    "team": 13,
    "budget": 4700,
    "product": 35,
    "reputation": 38,
    "level": 3,
    "stage": "MARKET",
    "niche": "SpaceTech"
  },
  {
    "_id": "startup-SpaceTech-007",
    "name": "SkyMine",
    "description": "Разрабатывает беспилотные аппараты для добычи ресурсов с астероидов",
    "price": 39000,
    "uniqueProductOffer": "Полностью автономная платформа для разведки и первичной переработки астероидов",
    "lastMonthRevenue": 8700,
    "expenses": 9300,
    "team": 30,
    "budget": 5100,
    "product": 46,
    "reputation": 45,
    "level": 4,
    "stage": "SCALE",
    "niche": "SpaceTech"
  },
  {
    "_id": "startup-SpaceTech-008",
    "name": "ThermaJet",
    "description": "Создаёт терморегуляторы для космических аппаратов нового поколения",
    "price": 27000,
    "uniqueProductOffer": "Технология, адаптирующаяся к температурным условиям в реальном времени без потребления энергии",
    "lastMonthRevenue": 6700,
    "expenses": 6200,
    "team": 17,
    "budget": 4800,
    "product": 41,
    "reputation": 35,
    "level": 3,
    "stage": "MARKET",
    "niche": "SpaceTech"
  },
  {
    "_id": "startup-SpaceTech-009",
    "name": "MicroNav",
    "description": "Разрабатывает микроскопические модули навигации для малых спутников",
    "price": 20000,
    "uniqueProductOffer": "Навигационные блоки весом менее 100 граммов, работающие без GPS",
    "lastMonthRevenue": 5600,
    "expenses": 5900,
    "team": 10,
    "budget": 3000,
    "product": 31,
    "reputation": 30,
    "level": 2,
    "stage": "MVP",
    "niche": "SpaceTech"
  },
  {
    "_id": "startup-SpaceTech-010",
    "name": "GeoOrbit",
    "description": "Создаёт программное обеспечение для анализа орбитального движения объектов",
    "price": 12000,
    "uniqueProductOffer": "Прогнозирование столкновений и оптимизация траекторий с помощью нейросетей",
    "lastMonthRevenue": 3900,
    "expenses": 3600,
    "team": 7,
    "budget": 2800,
    "product": 25,
    "reputation": 22,
    "level": 2,
    "stage": "MVP",
    "niche": "SpaceTech"
  },
  {
    "_id": "startup-SpaceTech-011",
    "name": "CosmicPrint",
    "description": "Разрабатывает технологии 3D-печати в условиях невесомости",
    "price": 35000,
    "uniqueProductOffer": "Промышленные 3D-принтеры, работающие в открытом космосе без фиксации на поверхности",
    "lastMonthRevenue": 8200,
    "expenses": 8100,
    "team": 23,
    "budget": 4300,
    "product": 47,
    "reputation": 41,
    "level": 4,
    "stage": "SCALE",
    "niche": "SpaceTech"
  },
  {
    "_id": "startup-SpaceTech-012",
    "name": "NanoScope",
    "description": "Разрабатывает наноспутники для научных экспериментов в микрогравитации",
    "price": 22000,
    "uniqueProductOffer": "Компактные лаборатории на орбите, управляемые через мобильное приложение",
    "lastMonthRevenue": 6100,
    "expenses": 5700,
    "team": 15,
    "budget": 4900,
    "product": 39,
    "reputation": 36,
    "level": 3,
    "stage": "MARKET",
    "niche": "SpaceTech"
  },
  {
    "_id": "startup-GreenTech-001",
    "name": "EcoBloom",
    "description": "Создаёт умные системы автоматического полива для сельского хозяйства с минимальным расходом воды",
    "price": 21000,
    "uniqueProductOffer": "Точная регулировка полива на основе данных о влажности почвы и погодных условиях",
    "lastMonthRevenue": 6500,
    "expenses": 5200,
    "team": 14,
    "budget": 4700,
    "product": 41,
    "reputation": 44,
    "level": 3,
    "stage": "MARKET",
    "niche": "GreenTech"
  },
  {
    "_id": "startup-GreenTech-002",
    "name": "SolarNest",
    "description": "Разрабатывает портативные солнечные панели для бытового и коммерческого использования",
    "price": 32000,
    "uniqueProductOffer": "Легкие и компактные панели с высоким коэффициентом преобразования солнечной энергии",
    "lastMonthRevenue": 9000,
    "expenses": 8500,
    "team": 21,
    "budget": 5300,
    "product": 47,
    "reputation": 48,
    "level": 4,
    "stage": "SCALE",
    "niche": "GreenTech"
  },
  {
    "_id": "startup-GreenTech-003",
    "name": "WasteCycle",
    "description": "Создаёт автоматизированные системы сортировки бытовых отходов с использованием ИИ",
    "price": 18000,
    "uniqueProductOffer": "Снижение количества мусора на полигонах за счёт повышения точности сортировки до 95%",
    "lastMonthRevenue": 7200,
    "expenses": 6800,
    "team": 19,
    "budget": 4100,
    "product": 39,
    "reputation": 37,
    "level": 3,
    "stage": "MARKET",
    "niche": "GreenTech"
  },
  {
    "_id": "startup-GreenTech-004",
    "name": "BioFuelX",
    "description": "Разрабатывает биотопливо на основе водорослей с низким уровнем выбросов CO2",
    "price": 27000,
    "uniqueProductOffer": "Экологичный заменитель дизельного топлива с увеличенной энергетической плотностью",
    "lastMonthRevenue": 8300,
    "expenses": 7900,
    "team": 23,
    "budget": 4600,
    "product": 43,
    "reputation": 42,
    "level": 4,
    "stage": "SCALE",
    "niche": "GreenTech"
  },
  {
    "_id": "startup-GreenTech-005",
    "name": "AirGuard",
    "description": "Создаёт датчики для мониторинга качества воздуха в городах в режиме реального времени",
    "price": 15000,
    "uniqueProductOffer": "Мобильные и стационарные датчики с высокой точностью измерения загрязняющих веществ",
    "lastMonthRevenue": 5400,
    "expenses": 5100,
    "team": 12,
    "budget": 3800,
    "product": 33,
    "reputation": 34,
    "level": 2,
    "stage": "MVP",
    "niche": "GreenTech"
  },
  {
    "_id": "startup-GreenTech-006",
    "name": "GreenRoof",
    "description": "Разрабатывает технологии озеленения крыш для улучшения микроклимата в городах",
    "price": 22000,
    "uniqueProductOffer": "Лёгкие и долговечные системы, снижающие температуру и уровень шума в помещениях",
    "lastMonthRevenue": 6300,
    "expenses": 5900,
    "team": 16,
    "budget": 4300,
    "product": 38,
    "reputation": 36,
    "level": 3,
    "stage": "MARKET",
    "niche": "GreenTech"
  },
  {
    "_id": "startup-GreenTech-007",
    "name": "HydroPure",
    "description": "Создаёт компактные системы очистки воды для сельских и отдалённых районов",
    "price": 26000,
    "uniqueProductOffer": "Фильтры с использованием нанотехнологий для удаления тяжелых металлов и бактерий",
    "lastMonthRevenue": 7000,
    "expenses": 6800,
    "team": 18,
    "budget": 4400,
    "product": 40,
    "reputation": 39,
    "level": 3,
    "stage": "MARKET",
    "niche": "GreenTech"
  },
  {
    "_id": "startup-GreenTech-008",
    "name": "EcoCharge",
    "description": "Разрабатывает системы накопления энергии для электромобилей на основе вторичных батарей",
    "price": 29000,
    "uniqueProductOffer": "Удлинённый срок службы батарей при снижении затрат на производство на 30%",
    "lastMonthRevenue": 8800,
    "expenses": 9100,
    "team": 26,
    "budget": 4900,
    "product": 45,
    "reputation": 43,
    "level": 4,
    "stage": "SCALE",
    "niche": "GreenTech"
  },
  {
    "_id": "startup-GreenTech-009",
    "name": "SmartGrid",
    "description": "Создаёт интеллектуальные сети распределения электроэнергии для домов и предприятий",
    "price": 20000,
    "uniqueProductOffer": "Оптимизация энергопотребления с использованием анализа данных и автоматического управления",
    "lastMonthRevenue": 6000,
    "expenses": 5800,
    "team": 14,
    "budget": 3500,
    "product": 36,
    "reputation": 35,
    "level": 3,
    "stage": "MARKET",
    "niche": "GreenTech"
  },
  {
    "_id": "startup-GreenTech-010",
    "name": "RecyClean",
    "description": "Разрабатывает биодеградируемые материалы для упаковки и одноразовой посуды",
    "price": 14000,
    "uniqueProductOffer": "Материалы, полностью распадающиеся в естественной среде без вреда для экологии",
    "lastMonthRevenue": 4800,
    "expenses": 4600,
    "team": 10,
    "budget": 3200,
    "product": 28,
    "reputation": 29,
    "level": 2,
    "stage": "MVP",
    "niche": "GreenTech"
  },
  {
    "_id": "startup-GreenTech-011",
    "name": "WindWay",
    "description": "Создаёт компактные и тихие ветрогенераторы для частных домов и офисов",
    "price": 31000,
    "uniqueProductOffer": "Высокая эффективность при низком уровне шума и минимальном обслуживании",
    "lastMonthRevenue": 8200,
    "expenses": 7900,
    "team": 22,
    "budget": 4700,
    "product": 44,
    "reputation": 40,
    "level": 4,
    "stage": "SCALE",
    "niche": "GreenTech"
  },
  {
    "_id": "startup-GreenTech-012",
    "name": "PlantGuard",
    "description": "Разрабатывает датчики и системы мониторинга для защиты сельскохозяйственных культур от вредителей",
    "price": 17000,
    "uniqueProductOffer": "Раннее обнаружение угроз с помощью анализа данных и предупреждение фермера",
    "lastMonthRevenue": 5600,
    "expenses": 5300,
    "team": 13,
    "budget": 3700,
    "product": 34,
    "reputation": 33,
    "level": 3,
    "stage": "MARKET",
    "niche": "GreenTech"
  },
  {
    "_id": "startup-MedTech-001",
    "name": "MediScan",
    "description": "Разрабатывает портативные устройства для быстрой диагностики заболеваний на основе ИИ",
    "price": 25000,
    "uniqueProductOffer": "Высокоточная диагностика без необходимости посещения клиники",
    "lastMonthRevenue": 7200,
    "expenses": 6800,
    "team": 18,
    "budget": 4000,
    "product": 40,
    "reputation": 42,
    "level": 3,
    "stage": "MARKET",
    "niche": "MedTech"
  },
  {
    "_id": "startup-MedTech-002",
    "name": "BioPulse",
    "description": "Создаёт носимые датчики для мониторинга жизненно важных показателей в режиме реального времени",
    "price": 21000,
    "uniqueProductOffer": "Непрерывный контроль здоровья с предупреждениями о рисках",
    "lastMonthRevenue": 6800,
    "expenses": 6500,
    "team": 15,
    "budget": 3700,
    "product": 38,
    "reputation": 39,
    "level": 3,
    "stage": "MARKET",
    "niche": "MedTech"
  },
  {
    "_id": "startup-MedTech-003",
    "name": "NeuroLink",
    "description": "Разрабатывает интерфейсы для взаимодействия мозга с компьютером для реабилитации пациентов",
    "price": 33000,
    "uniqueProductOffer": "Восстановление двигательных функций с помощью нейроинтерфейсов",
    "lastMonthRevenue": 9000,
    "expenses": 8500,
    "team": 25,
    "budget": 5200,
    "product": 47,
    "reputation": 45,
    "level": 4,
    "stage": "SCALE",
    "niche": "MedTech"
  },
  {
    "_id": "startup-MedTech-004",
    "name": "HealthBot",
    "description": "Создаёт виртуальных помощников для поддержки пациентов с хроническими заболеваниями",
    "price": 17000,
    "uniqueProductOffer": "Персонализированные рекомендации и контроль лечения в режиме онлайн",
    "lastMonthRevenue": 5600,
    "expenses": 5300,
    "team": 12,
    "budget": 3500,
    "product": 35,
    "reputation": 34,
    "level": 2,
    "stage": "MVP",
    "niche": "MedTech"
  },
  {
    "_id": "startup-MedTech-005",
    "name": "SafeDose",
    "description": "Разрабатывает системы контроля и автоматического дозирования лекарств для больниц",
    "price": 28000,
    "uniqueProductOffer": "Уменьшение ошибок при назначении лекарств и повышение безопасности пациентов",
    "lastMonthRevenue": 7900,
    "expenses": 7400,
    "team": 20,
    "budget": 4500,
    "product": 42,
    "reputation": 40,
    "level": 3,
    "stage": "MARKET",
    "niche": "MedTech"
  },
  {
    "_id": "startup-MedTech-006",
    "name": "RehabPro",
    "description": "Создаёт интерактивные платформы для дистанционной физиотерапии и реабилитации",
    "price": 19000,
    "uniqueProductOffer": "Индивидуальные программы восстановления с контролем прогресса через приложение",
    "lastMonthRevenue": 6000,
    "expenses": 5700,
    "team": 14,
    "budget": 3600,
    "product": 36,
    "reputation": 38,
    "level": 3,
    "stage": "MARKET",
    "niche": "MedTech"
  },
  {
    "_id": "startup-MedTech-007",
    "name": "DiagnoAI",
    "description": "Разрабатывает программное обеспечение для анализа медицинских снимков с помощью искусственного интеллекта",
    "price": 35000,
    "uniqueProductOffer": "Высокая точность выявления патологий на ранних стадиях",
    "lastMonthRevenue": 9500,
    "expenses": 9000,
    "team": 28,
    "budget": 6000,
    "product": 50,
    "reputation": 49,
    "level": 5,
    "stage": "SCALE",
    "niche": "MedTech"
  },
  {
    "_id": "startup-MedTech-008",
    "name": "MediCloud",
    "description": "Создаёт облачные платформы для хранения и обмена медицинскими данными между клиниками",
    "price": 24000,
    "uniqueProductOffer": "Обеспечение безопасности и удобства доступа к данным пациентов в любой точке мира",
    "lastMonthRevenue": 6700,
    "expenses": 6400,
    "team": 18,
    "budget": 4200,
    "product": 41,
    "reputation": 41,
    "level": 3,
    "stage": "MARKET",
    "niche": "MedTech"
  },
  {
    "_id": "startup-MedTech-009",
    "name": "VitaScan",
    "description": "Разрабатывает компактные устройства для домашнего мониторинга состояния здоровья",
    "price": 22000,
    "uniqueProductOffer": "Простое и быстрое измерение основных показателей с передачей данных врачу",
    "lastMonthRevenue": 6400,
    "expenses": 6000,
    "team": 16,
    "budget": 3900,
    "product": 39,
    "reputation": 37,
    "level": 3,
    "stage": "MARKET",
    "niche": "MedTech"
  },
  {
    "_id": "startup-MedTech-010",
    "name": "PharmaTrack",
    "description": "Создаёт системы отслеживания и управления запасами лекарств в аптеках и больницах",
    "price": 18000,
    "uniqueProductOffer": "Минимизация потерь и предотвращение дефицита медикаментов",
    "lastMonthRevenue": 5800,
    "expenses": 5500,
    "team": 13,
    "budget": 3400,
    "product": 34,
    "reputation": 33,
    "level": 2,
    "stage": "MVP",
    "niche": "MedTech"
  },
  {
    "_id": "startup-MedTech-011",
    "name": "CardioSense",
    "description": "Разрабатывает носимые устройства для мониторинга работы сердца и предупреждения о сбоях",
    "price": 27000,
    "uniqueProductOffer": "Раннее выявление аритмий и других сердечных патологий в домашних условиях",
    "lastMonthRevenue": 7200,
    "expenses": 7000,
    "team": 19,
    "budget": 4100,
    "product": 42,
    "reputation": 40,
    "level": 3,
    "stage": "MARKET",
    "niche": "MedTech"
  },
  {
    "_id": "startup-MedTech-012",
    "name": "SurgiAssist",
    "description": "Создаёт роботизированные системы поддержки хирургов для повышения точности операций",
    "price": 38000,
    "uniqueProductOffer": "Интеллектуальная помощь и контроль во время сложных хирургических вмешательств",
    "lastMonthRevenue": 10000,
    "expenses": 9500,
    "team": 30,
    "budget": 5800,
    "product": 50,
    "reputation": 50,
    "level": 5,
    "stage": "SCALE",
    "niche": "MedTech"
  }
]);

// Добавление контрактов (по одному для каждого стартапа)
db.contracts.insertMany([
    {
        startupId: "startup-IT-001",
        minPrice: 21960,
        maxPrice: 32940,
        teamEffect: 4,
        reputationEffect: 1
    },
    {
        startupId: "startup-IT-002",
        minPrice: 24960,
        maxPrice: 37440,
        teamEffect: 1,
        reputationEffect: 7
    },
    {
        startupId: "startup-IT-003",
        minPrice: 30720,
        maxPrice: 46080,
        teamEffect: 5,
        reputationEffect: 8
    },
    {
        startupId: "startup-IT-004",
        minPrice: 14640,
        maxPrice: 21960,
        teamEffect: 0,
        reputationEffect: 7
    },
    {
        startupId: "startup-IT-005",
        minPrice: 19280,
        maxPrice: 28920,
        teamEffect: 1,
        reputationEffect: 9
    },
    {
        startupId: "startup-IT-006",
        minPrice: 31760,
        maxPrice: 47640,
        teamEffect: 6,
        reputationEffect: 1
    },
    {
        startupId: "startup-IT-007",
        minPrice: 16640,
        maxPrice: 24960,
        teamEffect: 4,
        reputationEffect: 7
    },
    {
        startupId: "startup-IT-008",
        minPrice: 25840,
        maxPrice: 38760,
        teamEffect: 6,
        reputationEffect: 3
    },
    {
        startupId: "startup-IT-009",
        minPrice: 12880,
        maxPrice: 19320,
        teamEffect: 10,
        reputationEffect: 3
    },
    {
        startupId: "startup-IT-010",
        minPrice: 15680,
        maxPrice: 23520,
        teamEffect: 9,
        reputationEffect: 7
    },
    {
        startupId: "startup-IT-011",
        minPrice: 20400,
        maxPrice: 30600,
        teamEffect: 0,
        reputationEffect: 10
    },
    {
        startupId: "startup-IT-012",
        minPrice: 17360,
        maxPrice: 26040,
        teamEffect: 4,
        reputationEffect: 7
    },
    {
        startupId: "startup-SpaceTech-001",
        minPrice: 29600,
        maxPrice: 44400,
        teamEffect: 4,
        reputationEffect: 0
    },
    {
        startupId: "startup-SpaceTech-002",
        minPrice: 23200,
        maxPrice: 34800,
        teamEffect: 7,
        reputationEffect: 7
    },
    {
        startupId: "startup-SpaceTech-003",
        minPrice: 27200,
        maxPrice: 40800,
        teamEffect: 8,
        reputationEffect: 10
    },
    {
        startupId: "startup-SpaceTech-004",
        minPrice: 32000,
        maxPrice: 48000,
        teamEffect: 3,
        reputationEffect: 8
    },
    {
        startupId: "startup-SpaceTech-005",
        minPrice: 12800,
        maxPrice: 19200,
        teamEffect: 3,
        reputationEffect: 6
    },
    {
        startupId: "startup-SpaceTech-006",
        minPrice: 19200,
        maxPrice: 28800,
        teamEffect: 2,
        reputationEffect: 2
    },
    {
        startupId: "startup-SpaceTech-007",
        minPrice: 31200,
        maxPrice: 46800,
        teamEffect: 7,
        reputationEffect: 7
    },
    {
        startupId: "startup-SpaceTech-008",
        minPrice: 21600,
        maxPrice: 32400,
        teamEffect: 6,
        reputationEffect: 4
    },
    {
        startupId: "startup-SpaceTech-009",
        minPrice: 16000,
        maxPrice: 24000,
        teamEffect: 3,
        reputationEffect: 5
    },
    {
        startupId: "startup-SpaceTech-010",
        minPrice: 9600,
        maxPrice: 14400,
        teamEffect: 0,
        reputationEffect: 0
    },
    {
        startupId: "startup-SpaceTech-011",
        minPrice: 28000,
        maxPrice: 42000,
        teamEffect: 2,
        reputationEffect: 10
    },
    {
        startupId: "startup-SpaceTech-012",
        minPrice: 17600,
        maxPrice: 26400,
        teamEffect: 9,
        reputationEffect: 9
    },
    {
        startupId: "startup-GreenTech-001",
        minPrice: 16800,
        maxPrice: 25200,
        teamEffect: 9,
        reputationEffect: 2
    },
    {
        startupId: "startup-GreenTech-002",
        minPrice: 25600,
        maxPrice: 38400,
        teamEffect: 9,
        reputationEffect: 10
    },
    {
        startupId: "startup-GreenTech-003",
        minPrice: 14400,
        maxPrice: 21600,
        teamEffect: 0,
        reputationEffect: 6
    },
    {
        startupId: "startup-GreenTech-004",
        minPrice: 21600,
        maxPrice: 32400,
        teamEffect: 0,
        reputationEffect: 7
    },
    {
        startupId: "startup-GreenTech-005",
        minPrice: 12000,
        maxPrice: 18000,
        teamEffect: 5,
        reputationEffect: 2
    },
    {
        startupId: "startup-GreenTech-006",
        minPrice: 17600,
        maxPrice: 26400,
        teamEffect: 10,
        reputationEffect: 4
    },
    {
        startupId: "startup-GreenTech-007",
        minPrice: 20800,
        maxPrice: 31200,
        teamEffect: 0,
        reputationEffect: 6
    },
    {
        startupId: "startup-GreenTech-008",
        minPrice: 23200,
        maxPrice: 34800,
        teamEffect: 3,
        reputationEffect: 6
    },
    {
        startupId: "startup-GreenTech-009",
        minPrice: 16000,
        maxPrice: 24000,
        teamEffect: 5,
        reputationEffect: 2
    },
    {
        startupId: "startup-GreenTech-010",
        minPrice: 11200,
        maxPrice: 16800,
        teamEffect: 1,
        reputationEffect: 0
    },
    {
        startupId: "startup-GreenTech-011",
        minPrice: 24800,
        maxPrice: 37200,
        teamEffect: 4,
        reputationEffect: 8
    },
    {
        startupId: "startup-GreenTech-012",
        minPrice: 13600,
        maxPrice: 20400,
        teamEffect: 2,
        reputationEffect: 8
    },
    {
        startupId: "startup-MedTech-001",
        minPrice: 20000,
        maxPrice: 30000,
        teamEffect: 9,
        reputationEffect: 5
    },
    {
        startupId: "startup-MedTech-002",
        minPrice: 16800,
        maxPrice: 25200,
        teamEffect: 0,
        reputationEffect: 10
    },
    {
        startupId: "startup-MedTech-003",
        minPrice: 26400,
        maxPrice: 39600,
        teamEffect: 10,
        reputationEffect: 5
    },
    {
        startupId: "startup-MedTech-004",
        minPrice: 13600,
        maxPrice: 20400,
        teamEffect: 6,
        reputationEffect: 0
    },
    {
        startupId: "startup-MedTech-005",
        minPrice: 22400,
        maxPrice: 33600,
        teamEffect: 4,
        reputationEffect: 5
    },
    {
        startupId: "startup-MedTech-006",
        minPrice: 15200,
        maxPrice: 22800,
        teamEffect: 1,
        reputationEffect: 2
    },
    {
        startupId: "startup-MedTech-007",
        minPrice: 28000,
        maxPrice: 42000,
        teamEffect: 10,
        reputationEffect: 7
    },
    {
        startupId: "startup-MedTech-008",
        minPrice: 19200,
        maxPrice: 28800,
        teamEffect: 4,
        reputationEffect: 8
    },
    {
        startupId: "startup-MedTech-009",
        minPrice: 17600,
        maxPrice: 26400,
        teamEffect: 4,
        reputationEffect: 9
    },
    {
        startupId: "startup-MedTech-010",
        minPrice: 14400,
        maxPrice: 21600,
        teamEffect: 0,
        reputationEffect: 1
    },
    {
        startupId: "startup-MedTech-011",
        minPrice: 21600,
        maxPrice: 32400,
        teamEffect: 2,
        reputationEffect: 7
    },
    {
        startupId: "startup-MedTech-012",
        minPrice: 30400,
        maxPrice: 45600,
        teamEffect: 3,
        reputationEffect: 0
    }
]);

print("Данные успешно сгенерированы и добавлены в базу");