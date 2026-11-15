const ANILIBRIA_API = 'https://anilibria.top/api/v1';
    const ANILIBRIA_BACKUP_API = 'https://api.anilibria.app/api/v1';
    const apiMemoryCache = new Map();

    async function fetchAniLibriaJson(path, timeoutMs = 2600) {
      if (apiMemoryCache.has(path)) {
        return apiMemoryCache.get(path);
      }
      const tryMirror = (base) => new Promise(async (resolve, reject) => {
        const ctrl = new AbortController();
        const timer = setTimeout(() => {
          ctrl.abort();
          reject(new Error('timeout'));
        }, timeoutMs);
        try {
          const res = await fetch(`${base}${path}`, { signal: ctrl.signal });
          clearTimeout(timer);
          if (!res.ok) return reject(new Error('status ' + res.status));
          const json = await res.json();
          resolve(json);
        } catch (err) {
          clearTimeout(timer);
          reject(err);
        }
      });

      try {
        const data = await Promise.any([
          tryMirror(ANILIBRIA_API),
          tryMirror(ANILIBRIA_BACKUP_API)
        ]);
        if (data) apiMemoryCache.set(path, data);
        return data;
      } catch (e) {
        return null;
      }
    }

    const FALLBACK_CATALOG = [
      { id: 'fb_solo', releaseId: 9651, alias: 'ore-dake-level-up-na-ken', title: 'Поднятие уровня в одиночку', altTitle: 'Solo Leveling', year: 2024, type: 'TV', episodes: 12, rating: '9.1', isOngoing: false, genres: ['Экшен', 'Фэнтези', 'Приключения'], poster: 'https://anilibria.top/storage/releases/posters/9651/poster.jpg', desc: 'Десять лет назад открылись Врата, соединившие реальный мир с измерением монстров. Сон Джин-Ву получает уникальную Систему прокачки.' },
      { id: 'fb_solo2', releaseId: 9851, alias: 'ore-dake-level-up-na-ken-season-2', title: 'Поднятие уровня в одиночку 2 сезон: Восстаньте из тени', altTitle: 'Solo Leveling Season 2: Arise from the Shadow', year: 2025, type: 'TV', episodes: 13, rating: '9.4', isOngoing: true, genres: ['Экшен', 'Фэнтези', 'Приключения'], poster: 'https://anilibria.top/storage/releases/posters/9651/poster.jpg', desc: 'Продолжение истории теневого монарха Сон Джин-Ву: битва за остров Чеджу и раскрытие тайны Системы.' },
      { id: 'fb_frieren', releaseId: 9544, alias: 'sousou-no-frieren', title: 'Провожающая в последний путь Фрирен', altTitle: 'Sousou no Frieren', year: 2023, type: 'TV', episodes: 28, rating: '9.4', isOngoing: false, genres: ['Фэнтези', 'Приключения', 'Драма'], poster: 'https://anilibria.top/storage/releases/posters/9544/poster.jpg', desc: 'Эльфийка-маг Фрирен отправляется в новое путешествие по следам былых подвигов, чтобы лучше понять людей.' },
      { id: 'fb_chainsaw', releaseId: 9186, alias: 'chainsaw-man', title: 'Человек-бензопила', altTitle: 'Chainsaw Man', year: 2022, type: 'TV', episodes: 12, rating: '8.9', isOngoing: false, genres: ['Экшен', 'Фэнтези', 'Ужасы'], poster: 'https://anilibria.top/storage/releases/posters/9186/poster.jpg', desc: 'Дэндзи сливается с демоном-бензопилой Почитой и вступает в правительственный отряд охотников на демонов.' },
      { id: 'fb_apothecary', releaseId: 9569, alias: 'kusuriya-no-hitorigoto', title: 'Монолог фармацевта', altTitle: 'Kusuriya no Hitorigoto', year: 2023, type: 'TV', episodes: 24, rating: '9.2', isOngoing: false, genres: ['Драма', 'Детектив', 'Исторический'], poster: 'https://anilibria.top/storage/releases/posters/9569/poster.jpg', desc: 'Травница Маомао распутывает заговоры, отравления и тайны во внутреннем дворце императора.' },
      { id: 'fb_apothecary2', releaseId: 9870, alias: 'kusuriya-no-hitorigoto-2nd-season', title: 'Монолог фармацевта 2 сезон', altTitle: 'Kusuriya no Hitorigoto Season 2', year: 2025, type: 'TV', episodes: 24, rating: '9.3', isOngoing: true, genres: ['Драма', 'Детектив', 'Исторический'], poster: 'https://anilibria.top/storage/releases/posters/9569/poster.jpg', desc: 'Новые дворцовые загадки и опасные интриги, которые предстоит раскрыть Маомао и Дзинси.' },
      { id: 'fb_jujutsu1', releaseId: 8674, alias: 'jujutsu-kaisen', title: 'Магическая битва', altTitle: 'Jujutsu Kaisen', year: 2020, type: 'TV', episodes: 24, rating: '8.9', isOngoing: false, genres: ['Экшен', 'Сверхъестественное', 'Сёнен'], poster: 'https://anilibria.top/storage/releases/posters/9468/poster.jpg', desc: 'Юдзи Итадори проглатывает проклятый палец Двуликого Сукуны и поступает в Токийский магический колледж.' },
      { id: 'fb_jujutsu', releaseId: 9468, alias: 'jujutsu-kaisen-2nd-season', title: 'Магическая битва 2', altTitle: 'Jujutsu Kaisen 2nd Season', year: 2023, type: 'TV', episodes: 23, rating: '9.0', isOngoing: false, genres: ['Экшен', 'Сверхъестественное', 'Сёнен'], poster: 'https://anilibria.top/storage/releases/posters/9468/poster.jpg', desc: 'Прошлое Сатору Годзё и Сугуру Гэто, а также масштабный инцидент в Сибуе, который навсегда изменит мир магов.' },
      { id: 'fb_demon1', releaseId: 9380, alias: 'kimetsu-no-yaiba-katanakaji-no-sato-hen', title: 'Клинок, рассекающий демонов: Деревня кузнецов', altTitle: 'Kimetsu no Yaiba: Swordsmith Village Arc', year: 2023, type: 'TV', episodes: 11, rating: '9.0', isOngoing: false, genres: ['Экшен', 'Фэнтези', 'Сёнен'], poster: 'https://anilibria.top/storage/releases/posters/9380/poster.jpg', desc: 'Тандзиро отправляется в тайную деревню кузнецов, где сталкивается с Высшими Лунами.' },
      { id: 'fb_demon2', releaseId: 9705, alias: 'kimetsu-no-yaiba-hashira-geiko-hen', title: 'Клинок, рассекающий демонов: Тренировка столпов', altTitle: 'Kimetsu no Yaiba: Hashira Training Arc', year: 2024, type: 'TV', episodes: 8, rating: '9.1', isOngoing: false, genres: ['Экшен', 'Фэнтези', 'Сёнен'], poster: 'https://anilibria.top/storage/releases/posters/9380/poster.jpg', desc: 'Интенсивная подготовка охотников на демонов под руководством сильнейших Столпов перед финальной битвой с Мудзаном.' },
      { id: 'fb_dandadan', releaseId: 9812, alias: 'dandadan', title: 'Дандадан', altTitle: 'Dandadan', year: 2024, type: 'TV', episodes: 12, rating: '9.1', isOngoing: true, genres: ['Экшен', 'Комедия', 'Сверхъестественное'], poster: 'https://anilibria.top/storage/releases/posters/9651/poster.jpg', desc: 'Момо верит в призраков, а Окарун — в пришельцев. Их спор оборачивается безумным столкновением с паранормальным.' },
      { id: 'fb_bleach', releaseId: 9311, alias: 'bleach-sennen-kessen-hen', title: 'Блич: Тысячелетняя кровавая война', altTitle: 'Bleach: Thousand-Year Blood War', year: 2022, type: 'TV', episodes: 26, rating: '9.2', isOngoing: true, genres: ['Экшен', 'Приключения', 'Сверхъестественное'], poster: 'https://anilibria.top/storage/releases/posters/9186/poster.jpg', desc: 'Возвращение Ичиго Куросаки в грандиозной войне Сообщества Душ против империи Квинси.' }
    ];

    const DESIGN_THEMES = {
      default: {
        name: 'Багровый неон',
        short: 'Неон',
        desc: 'Кибер-стекло и алое северное сияние',
        watermark: '狐 // NEON',
        badgeText: 'CYBER GLASS • 60 FPS HLS',
        arch: 'default',
        dot: '#f43f5e',
        bg: '#07080b',
        surface: '#0c0f17',
        surface2: '#141824',
        glow: 'rgba(244, 63, 94, 0.24)',
        secondary: 'rgba(99, 102, 241, 0.14)',
        cardRadius: '1rem',
        panelRadius: '1.5rem',
        btnRadius: '0.75rem',
        border: 'rgba(244, 63, 94, 0.24)',
        font: "'Outfit', 'Inter', sans-serif",
        pattern: 'radial-gradient(ellipse 85% 45% at 50% -10%, rgba(244, 63, 94, 0.20), transparent 70%)',
        patternSize: '100% 100%',
        b300: '#fda4af', b400: '#fb7185', b500: '#f43f5e', b600: '#e11d48'
      },
      cat: {
        name: 'Манэки-нэко',
        short: 'Кот',
        desc: 'Мягкие капсулы и золотое боке',
        watermark: '招き猫 // NEKO',
        badgeText: 'MANEKI-NEKO • LUCKY STREAM',
        arch: 'soft',
        isCat: true,
        dot: '#f59e0b',
        bg: '#120c18',
        surface: '#1b1224',
        surface2: '#261a33',
        glow: 'rgba(251, 191, 36, 0.30)',
        secondary: 'rgba(244, 114, 182, 0.20)',
        cardRadius: '1.75rem',
        panelRadius: '2.25rem',
        btnRadius: '9999px',
        border: 'rgba(251, 191, 36, 0.35)',
        font: "'Outfit', 'Inter', sans-serif",
        pattern: 'radial-gradient(ellipse 80% 50% at 75% 15%, rgba(251, 191, 36, 0.18), transparent 68%)',
        patternSize: '100% 100%',
        b300: '#fde68a', b400: '#fbbf24', b500: '#f59e0b', b600: '#d97706'
      },
      sunset: {
        name: 'Кибер-Закат',
        short: 'Закат',
        desc: 'Синтвейв-солнце и неоновые сумерки',
        watermark: '電脳 // 2099',
        badgeText: 'SYNTHWAVE HUD • OVERDRIVE',
        arch: 'cyber',
        dot: '#ec4899',
        bg: '#0f0514',
        surface: '#1a0924',
        surface2: '#270f36',
        glow: 'rgba(236, 72, 153, 0.34)',
        secondary: 'rgba(249, 115, 22, 0.24)',
        cardRadius: '0.2rem',
        panelRadius: '0.3rem',
        btnRadius: '0.2rem',
        border: 'rgba(236, 72, 153, 0.45)',
        font: "'JetBrains Mono', 'Outfit', monospace",
        pattern: 'radial-gradient(ellipse 90% 55% at 50% 105%, rgba(249, 115, 22, 0.26), rgba(236, 72, 153, 0.14) 48%, transparent 75%)',
        patternSize: '100% 100%',
        b300: '#f9a8d4', b400: '#f472b6', b500: '#ec4899', b600: '#db2777'
      },
      abyss: {
        name: 'Бездна Океана',
        short: 'Океан',
        desc: 'Глубоководный биолюминесцент',
        watermark: '深海 // ABYSS',
        badgeText: 'DEEP OCEAN • BIOLUMINESCENCE',
        arch: 'crystal',
        dot: '#06b6d4',
        bg: '#020b14',
        surface: '#061626',
        surface2: '#0b2238',
        glow: 'rgba(6, 182, 212, 0.32)',
        secondary: 'rgba(37, 99, 235, 0.22)',
        cardRadius: '1.35rem',
        panelRadius: '1.85rem',
        btnRadius: '0.9rem',
        border: 'rgba(34, 211, 238, 0.32)',
        font: "'Outfit', 'Inter', sans-serif",
        pattern: 'radial-gradient(ellipse 85% 55% at 50% -10%, rgba(34, 211, 238, 0.22), transparent 70%)',
        patternSize: '100% 100%',
        b300: '#67e8f9', b400: '#22d3ee', b500: '#06b6d4', b600: '#0891b2'
      },
      sakura_night: {
        name: 'Ночной Киото',
        short: 'Киото',
        desc: 'Пурпурная луна и храмовые фонари',
        watermark: '京都 // 夜桜',
        badgeText: 'KYOTO SHRINE • NIGHT LANTERNS',
        arch: 'zen',
        dot: '#a855f7',
        bg: '#090414',
        surface: '#130926',
        surface2: '#1e1038',
        glow: 'rgba(168, 85, 247, 0.32)',
        secondary: 'rgba(236, 72, 153, 0.18)',
        cardRadius: '0.75rem',
        panelRadius: '1rem',
        btnRadius: '0.5rem',
        border: 'rgba(192, 132, 252, 0.38)',
        font: "'Playfair Display', Georgia, serif",
        pattern: 'radial-gradient(ellipse 75% 50% at 80% 12%, rgba(192, 132, 252, 0.22), transparent 68%)',
        patternSize: '100% 100%',
        b300: '#d8b4fe', b400: '#c084fc', b500: '#a855f7', b600: '#9333ea'
      },
      spring: {
        name: 'Цветущая Сакура',
        short: 'Сакура',
        desc: 'Нежные лепестки и розовый рассвет',
        watermark: '桜花 // SAKURA',
        badgeText: 'HANAMI SEASON • SILK EDITION',
        arch: 'soft',
        dot: '#f472b6',
        bg: '#140812',
        surface: '#210e1e',
        surface2: '#30152b',
        glow: 'rgba(244, 114, 182, 0.32)',
        secondary: 'rgba(251, 113, 133, 0.18)',
        cardRadius: '1.6rem',
        panelRadius: '2rem',
        btnRadius: '9999px',
        border: 'rgba(244, 114, 182, 0.35)',
        font: "'Playfair Display', 'Outfit', serif",
        pattern: 'radial-gradient(ellipse 80% 50% at 25% 10%, rgba(244, 114, 182, 0.22), transparent 70%)',
        patternSize: '100% 100%',
        b300: '#fbcfe8', b400: '#f472b6', b500: '#ec4899', b600: '#db2777'
      },
      summer: {
        name: 'Токио Голд',
        short: 'Токио',
        desc: 'Золотое сияние и бархатная ночь',
        watermark: '黄金 // GOLD',
        badgeText: 'IMPERIAL GOLD • VIP LOUNGE',
        arch: 'cyber',
        dot: '#eab308',
        bg: '#0c0904',
        surface: '#171208',
        surface2: '#241c0d',
        glow: 'rgba(234, 179, 8, 0.30)',
        secondary: 'rgba(245, 158, 11, 0.16)',
        cardRadius: '0.3rem',
        panelRadius: '0.45rem',
        btnRadius: '0.25rem',
        border: 'rgba(250, 204, 21, 0.42)',
        font: "'JetBrains Mono', 'Outfit', sans-serif",
        pattern: 'radial-gradient(ellipse 80% 45% at 50% 0%, rgba(250, 204, 21, 0.20), transparent 70%)',
        patternSize: '100% 100%',
        b300: '#fef08a', b400: '#facc15', b500: '#eab308', b600: '#ca8a04'
      },
      autumn: {
        name: 'Клён Момидзи',
        short: 'Момидзи',
        desc: 'Тёплый багрянец осеннего храма',
        watermark: '紅葉 // MOMIJI',
        badgeText: 'AUTUMN SHRINE • CRIMSON LEAF',
        arch: 'zen',
        dot: '#f97316',
        bg: '#130704',
        surface: '#210d08',
        surface2: '#30140d',
        glow: 'rgba(249, 115, 22, 0.32)',
        secondary: 'rgba(220, 38, 38, 0.18)',
        cardRadius: '1.1rem',
        panelRadius: '1.5rem',
        btnRadius: '0.65rem',
        border: 'rgba(251, 146, 60, 0.38)',
        font: "'Playfair Display', Georgia, serif",
        pattern: 'radial-gradient(ellipse 85% 50% at 75% 12%, rgba(251, 146, 60, 0.22), transparent 70%)',
        patternSize: '100% 100%',
        b300: '#fed7aa', b400: '#fb923c', b500: '#f97316', b600: '#ea580c'
      },
      winter: {
        name: 'Лёд Хоккайдо',
        short: 'Лёд',
        desc: 'Полярное сияние и морозный хрусталь',
        watermark: '氷雪 // FROST',
        badgeText: 'HOKKAIDO FROST • CRYSTAL UI',
        arch: 'crystal',
        dot: '#38bdf8',
        bg: '#040a14',
        surface: '#091526',
        surface2: '#10213a',
        glow: 'rgba(56, 189, 248, 0.32)',
        secondary: 'rgba(129, 140, 248, 0.20)',
        cardRadius: '1.25rem',
        panelRadius: '1.75rem',
        btnRadius: '0.85rem',
        border: 'rgba(125, 211, 252, 0.35)',
        font: "'Outfit', 'Inter', sans-serif",
        pattern: 'radial-gradient(ellipse 90% 50% at 50% -10%, rgba(125, 211, 252, 0.22), transparent 72%)',
        patternSize: '100% 100%',
        b300: '#bae6fd', b400: '#38bdf8', b500: '#0ea5e9', b600: '#0284c7'
      },
      emerald: {
        name: 'Изумрудный дзен',
        short: 'Дзен',
        desc: 'Лунная бамбуковая роща и нефрит',
        watermark: '竹林 // ZEN',
        badgeText: 'BAMBOO GROVE • JADE SANCTUARY',
        arch: 'zen',
        dot: '#10b981',
        bg: '#040f0a',
        surface: '#081c14',
        surface2: '#0f2b1f',
        glow: 'rgba(16, 185, 129, 0.30)',
        secondary: 'rgba(20, 184, 166, 0.18)',
        cardRadius: '0.9rem',
        panelRadius: '1.35rem',
        btnRadius: '0.6rem',
        border: 'rgba(52, 211, 153, 0.35)',
        font: "'Outfit', 'Inter', sans-serif",
        pattern: 'radial-gradient(ellipse 80% 50% at 20% 10%, rgba(52, 211, 153, 0.20), transparent 70%)',
        patternSize: '100% 100%',
        b300: '#a7f3d0', b400: '#34d399', b500: '#10b981', b600: '#059669'
      },
      haikyuu: {
        name: 'Волейбол!! Зал Карасуно',
        short: 'Волейбол',
        desc: 'Золотой закат в спортзале Карасуно и Хината #10 у сетки',
        watermark: '烏野 // #10',
        badgeText: 'KARASUNO GYM • HINATA #10',
        arch: 'crystal',
        morph: 'haikyuu',
        dot: '#f97316',
        bg: '#160d06',
        surface: '#22140a',
        surface2: '#301d10',
        glow: 'rgba(245, 158, 11, 0.36)',
        secondary: 'rgba(234, 88, 12, 0.24)',
        cardRadius: '1rem',
        panelRadius: '1.5rem',
        btnRadius: '0.75rem',
        border: 'rgba(251, 146, 60, 0.48)',
        font: "'Outfit', 'Inter', sans-serif",
        pattern: 'radial-gradient(ellipse 90% 55% at 50% 0%, rgba(251, 191, 36, 0.24), transparent 72%)',
        patternSize: '100% 100%',
        b300: '#fde68a', b400: '#fb923c', b500: '#f97316', b600: '#ea580c'
      },
      horimiya: {
        name: 'Хоримия // Пастель',
        short: 'Хоримия',
        desc: 'Акварельные облака персика и лазури',
        watermark: 'ホリミヤ // 青春',
        badgeText: 'HORIMIYA • SWEET SODA DIARY',
        arch: 'soft',
        morph: 'horimiya',
        dot: '#f472b6',
        bg: '#130c1c',
        surface: '#1f142e',
        surface2: '#2b1c40',
        glow: 'rgba(244, 114, 182, 0.34)',
        secondary: 'rgba(56, 189, 248, 0.24)',
        cardRadius: '1.65rem',
        panelRadius: '2.2rem',
        btnRadius: '9999px',
        border: 'rgba(244, 114, 182, 0.45)',
        font: "'Outfit', 'Inter', sans-serif",
        pattern: 'radial-gradient(ellipse 80% 55% at 25% 15%, rgba(244, 114, 182, 0.24), transparent 68%)',
        patternSize: '100% 100%',
        b300: '#fbcfe8', b400: '#f472b6', b500: '#ec4899', b600: '#db2777'
      },
      tsuki: {
        name: 'Лунный сад // Бамбук',
        short: 'Луна',
        desc: 'Полная луна, бамбуковая роща и светлячки над водой',
        watermark: '月 // TSUKI',
        badgeText: 'MOON GARDEN • FIREFLY NIGHT',
        arch: 'soft',
        morph: 'tsuki',
        dot: '#7de3c8',
        bg: '#03100f',
        surface: '#07201e',
        surface2: '#0d2f2b',
        glow: 'rgba(125, 227, 200, 0.26)',
        secondary: 'rgba(56, 189, 248, 0.16)',
        cardRadius: '1.1rem',
        panelRadius: '1.8rem',
        btnRadius: '9999px',
        border: 'rgba(125, 227, 200, 0.36)',
        font: "'Outfit', 'Inter', sans-serif",
        pattern: 'radial-gradient(ellipse 60% 40% at 70% 8%, rgba(232, 245, 238, 0.10), transparent 70%)',
        patternSize: '100% 100%',
        b300: '#d2f7ea', b400: '#a1eed6', b500: '#4fd1b0', b600: '#1fa386'
      },
      citypop: {
        name: 'Токио 1985 // Сити-поп',
        short: 'Сити-поп',
        desc: 'Полосатое солнце, неоновая сетка и пальмы',
        watermark: '東京 // 1985',
        badgeText: 'CITY POP • MIDNIGHT CRUISE',
        arch: 'cyber',
        morph: 'citypop',
        dot: '#ff3cac',
        bg: '#0d0221',
        surface: '#170536',
        surface2: '#240a4d',
        glow: 'rgba(255, 60, 172, 0.34)',
        secondary: 'rgba(45, 226, 230, 0.22)',
        cardRadius: '0.5rem',
        panelRadius: '0.8rem',
        btnRadius: '0.4rem',
        border: 'rgba(45, 226, 230, 0.6)',
        font: "'Outfit', 'Inter', sans-serif",
        pattern: 'radial-gradient(ellipse 80% 40% at 50% 100%, rgba(255, 60, 172, 0.20), transparent 70%)',
        patternSize: '100% 100%',
        b300: '#ffc2e6', b400: '#ff7cc8', b500: '#ff3cac', b600: '#d11a85'
      },
      inari: {
        name: 'Тысяча врат // Инари',
        short: 'Тории',
        desc: 'Алые врата Фусими Инари уходят в золотой туман',
        watermark: '千本鳥居 // INARI',
        badgeText: 'SENBON TORII • LANTERN PATH',
        arch: 'zen',
        morph: 'inari',
        dot: '#e8452c',
        bg: '#0b0605',
        surface: '#160b08',
        surface2: '#22110c',
        glow: 'rgba(232, 69, 44, 0.30)',
        secondary: 'rgba(251, 191, 36, 0.18)',
        cardRadius: '0.5rem',
        panelRadius: '0.9rem',
        btnRadius: '0.4rem',
        border: 'rgba(232, 69, 44, 0.5)',
        font: "'Outfit', 'Inter', sans-serif",
        pattern: 'radial-gradient(ellipse 60% 40% at 50% 45%, rgba(251, 191, 36, 0.10), transparent 70%)',
        patternSize: '100% 100%',
        b300: '#ffb4a2', b400: '#f2765c', b500: '#e8452c', b600: '#b92d17'
      },
      aurora: {
        name: 'Северное сияние // Аврора',
        short: 'Аврора',
        desc: 'Танцующее сияние над ледяным озером',
        watermark: 'オーロラ // AURORA',
        badgeText: 'POLAR NIGHT • AURORA BOREALIS',
        arch: 'soft',
        morph: 'aurora',
        dot: '#5eead4',
        bg: '#030a14',
        surface: '#07142a',
        surface2: '#0d2040',
        glow: 'rgba(94, 234, 212, 0.28)',
        secondary: 'rgba(167, 139, 250, 0.26)',
        cardRadius: '1.2rem',
        panelRadius: '1.9rem',
        btnRadius: '9999px',
        border: 'rgba(94, 234, 212, 0.34)',
        font: "'Outfit', 'Inter', sans-serif",
        pattern: 'radial-gradient(ellipse 90% 40% at 40% 0%, rgba(94, 234, 212, 0.14), transparent 70%)',
        patternSize: '100% 100%',
        b300: '#b9f6ea', b400: '#7ee8d3', b500: '#34d3b8', b600: '#14a58f'
      },
      rain: {
        name: 'Токио под дождём // Неон',
        short: 'Дождь',
        desc: 'Мокрые улицы, неоновые вывески и боке',
        watermark: '雨 // NEON RAIN',
        badgeText: 'RAINY NIGHT • WET NEON',
        arch: 'cyber',
        morph: 'rain',
        dot: '#5b8cff',
        bg: '#060912',
        surface: '#0c1226',
        surface2: '#141c3a',
        glow: 'rgba(91, 140, 255, 0.30)',
        secondary: 'rgba(255, 159, 67, 0.18)',
        cardRadius: '0.6rem',
        panelRadius: '1rem',
        btnRadius: '0.5rem',
        border: 'rgba(91, 140, 255, 0.5)',
        font: "'Outfit', 'Inter', sans-serif",
        pattern: 'radial-gradient(ellipse 80% 40% at 50% 100%, rgba(91, 140, 255, 0.30), transparent 70%)',
        patternSize: '100% 100%',
        b300: '#c7d8ff', b400: '#8fb0ff', b500: '#5b8cff', b600: '#3a64d8'
      },
      vangogh: {
        name: 'Звёздная ночь // Ван Гог',
        short: 'Ван Гог',
        desc: 'Вихри неба, жёлтые звёзды и кипарис',
        watermark: '星月夜 // VAN GOGH',
        badgeText: 'STARRY NIGHT • OIL STROKES',
        arch: 'soft',
        morph: 'vangogh',
        dot: '#f4c542',
        bg: '#07122e',
        surface: '#0c1c4a',
        surface2: '#142a68',
        glow: 'rgba(244, 197, 66, 0.26)',
        secondary: 'rgba(111, 163, 255, 0.26)',
        cardRadius: '0.9rem',
        panelRadius: '1.4rem',
        btnRadius: '0.7rem',
        border: 'rgba(244, 197, 66, 0.45)',
        font: "'Outfit', 'Inter', sans-serif",
        pattern: 'radial-gradient(ellipse 80% 40% at 50% 100%, rgba(244, 197, 66, 0.26), transparent 70%)',
        patternSize: '100% 100%',
        b300: '#fdf0b8', b400: '#f9d96a', b500: '#f4c542', b600: '#c99a1c'
      },
      fuji: {
        name: 'Фудзи на рассвете',
        short: 'Фудзи',
        desc: 'Розовый рассвет над горой и зеркальным озером',
        watermark: '富士 // DAWN',
        badgeText: 'FUJI DAWN • SAKURA PETALS',
        arch: 'soft',
        morph: 'fuji',
        dot: '#ff9ec0',
        bg: '#0d0a24',
        surface: '#1a1238',
        surface2: '#281a4c',
        glow: 'rgba(255, 158, 192, 0.30)',
        secondary: 'rgba(255, 217, 160, 0.20)',
        cardRadius: '1.3rem',
        panelRadius: '2rem',
        btnRadius: '9999px',
        border: 'rgba(255, 158, 192, 0.42)',
        font: "'Outfit', 'Inter', sans-serif",
        pattern: 'radial-gradient(ellipse 80% 40% at 50% 100%, rgba(255, 158, 192, 0.30), transparent 70%)',
        patternSize: '100% 100%',
        b300: '#ffe0ec', b400: '#ffc0d8', b500: '#ff9ec0', b600: '#e0679a'
      },
      makie: {
        name: 'Маки-э // Чёрный лак',
        short: 'Маки-э',
        desc: 'Золотые волны и слива на чёрном лаке',
        watermark: '蒔絵 // MAKI-E',
        badgeText: 'BLACK LACQUER • GOLD DUST',
        arch: 'zen',
        morph: 'makie',
        dot: '#e2b44a',
        bg: '#080605',
        surface: '#120d0a',
        surface2: '#1c140f',
        glow: 'rgba(226, 180, 74, 0.22)',
        secondary: 'rgba(190, 40, 30, 0.18)',
        cardRadius: '0.7rem',
        panelRadius: '1rem',
        btnRadius: '0.5rem',
        border: 'rgba(226, 180, 74, 0.5)',
        font: "'Playfair Display', 'Outfit', serif",
        pattern: 'radial-gradient(ellipse 80% 40% at 50% 100%, rgba(226, 180, 74, 0.22), transparent 70%)',
        patternSize: '100% 100%',
        b300: '#f8e8b4', b400: '#ecc968', b500: '#e2b44a', b600: '#a67c1c'
      },
      shrine: {
        name: 'Тёмный храм // Проклятый домен',
        short: 'Храм',
        desc: 'Кровавая луна, храм-призрак и алые разрезы',
        watermark: '呪 // DOMAIN',
        badgeText: 'MALEVOLENT SHRINE • CURSED EMBERS',
        arch: 'crystal',
        morph: 'shrine',
        dot: '#ef2b3a',
        bg: '#060204',
        surface: '#12050a',
        surface2: '#1e0910',
        glow: 'rgba(239, 43, 58, 0.34)',
        secondary: 'rgba(120, 20, 60, 0.28)',
        cardRadius: '0.4rem',
        panelRadius: '0.8rem',
        btnRadius: '0.3rem',
        border: 'rgba(239, 43, 58, 0.55)',
        font: "'Outfit', 'Inter', sans-serif",
        pattern: 'radial-gradient(ellipse 80% 40% at 50% 100%, rgba(239, 43, 58, 0.34), transparent 70%)',
        patternSize: '100% 100%',
        b300: '#ffc2c6', b400: '#ff6b75', b500: '#ef2b3a', b600: '#b3121f'
      },
      cosmos: {
        name: 'Космос // Туманность',
        short: 'Космос',
        desc: 'Живая туманность: пурпур, малина и золото',
        watermark: '星雲 // COSMOS',
        badgeText: 'LIVE NEBULA • DEEP SPACE',
        arch: 'crystal',
        morph: 'cosmos',
        dot: '#d6338a',
        bg: '#05030f',
        surface: '#0d0820',
        surface2: '#170f35',
        glow: 'rgba(214, 51, 138, 0.32)',
        secondary: 'rgba(255, 200, 107, 0.18)',
        cardRadius: '0.9rem',
        panelRadius: '1.4rem',
        btnRadius: '0.7rem',
        border: 'rgba(242, 106, 174, 0.45)',
        font: "'Outfit', 'Inter', sans-serif",
        pattern: 'radial-gradient(ellipse 80% 40% at 50% 100%, rgba(214, 51, 138, 0.32), transparent 70%)',
        patternSize: '100% 100%',
        b300: '#ffc2e0', b400: '#f26aae', b500: '#d6338a', b600: '#a31d66'
      },
      liquidgold: {
        name: 'Жидкое золото',
        short: 'Золото',
        desc: 'Золотые жилы текут в чёрном мраморе',
        watermark: '金 // LIQUID GOLD',
        badgeText: 'BLACK MARBLE • FLOWING GOLD',
        arch: 'zen',
        morph: 'liquidgold',
        dot: '#e0b441',
        bg: '#050403',
        surface: '#100c07',
        surface2: '#1a140b',
        glow: 'rgba(243, 210, 122, 0.22)',
        secondary: 'rgba(160, 110, 30, 0.20)',
        cardRadius: '0.5rem',
        panelRadius: '0.9rem',
        btnRadius: '0.4rem',
        border: 'rgba(224, 180, 65, 0.5)',
        font: "'Outfit', 'Inter', sans-serif",
        pattern: 'radial-gradient(ellipse 80% 40% at 50% 100%, rgba(243, 210, 122, 0.22), transparent 70%)',
        patternSize: '100% 100%',
        b300: '#fbeab0', b400: '#f3d27a', b500: '#e0b441', b600: '#a67c1c'
      },
      curse: {
        name: 'Проклятая энергия',
        short: 'Проклятие',
        desc: 'Багровая и фиолетовая энергия в движении',
        watermark: '呪力 // CURSE',
        badgeText: 'CURSED ENERGY • LIVE FLOW',
        arch: 'crystal',
        morph: 'curse',
        dot: '#e0243d',
        bg: '#04010a',
        surface: '#0d0418',
        surface2: '#170826',
        glow: 'rgba(224, 36, 61, 0.34)',
        secondary: 'rgba(120, 40, 200, 0.26)',
        cardRadius: '0.4rem',
        panelRadius: '0.8rem',
        btnRadius: '0.3rem',
        border: 'rgba(224, 36, 61, 0.55)',
        font: "'Outfit', 'Inter', sans-serif",
        pattern: 'radial-gradient(ellipse 80% 40% at 50% 100%, rgba(224, 36, 61, 0.34), transparent 70%)',
        patternSize: '100% 100%',
        b300: '#ffc0c8', b400: '#ff6b7e', b500: '#e0243d', b600: '#a3122a'
      },
      biolum: {
        name: 'Био-свечение',
        short: 'Био',
        desc: 'Глубина, светящаяся бирюзой',
        watermark: '光 // BIOLUM',
        badgeText: 'DEEP SEA • BIOLUMINESCENCE',
        arch: 'soft',
        morph: 'biolum',
        dot: '#35e0f0',
        bg: '#00060f',
        surface: '#03121f',
        surface2: '#071e30',
        glow: 'rgba(53, 224, 240, 0.28)',
        secondary: 'rgba(94, 234, 212, 0.20)',
        cardRadius: '1rem',
        panelRadius: '1.6rem',
        btnRadius: '9999px',
        border: 'rgba(53, 224, 240, 0.42)',
        font: "'Outfit', 'Inter', sans-serif",
        pattern: 'radial-gradient(ellipse 80% 40% at 50% 100%, rgba(53, 224, 240, 0.28), transparent 70%)',
        patternSize: '100% 100%',
        b300: '#c2f8ff', b400: '#76eaf7', b500: '#35e0f0', b600: '#13a9bd'
      },
      kimi: {
        name: 'Твоё имя // Комета',
        short: 'Комета',
        desc: 'Сумеречное небо, расколотая комета и огни города',
        watermark: '彗星 // KOMET',
        badgeText: 'TWILIGHT SKY • COMET FALL',
        arch: 'soft',
        morph: 'kimi',
        dot: '#ff6fa5',
        bg: '#070818',
        surface: '#0e1032',
        surface2: '#181b4a',
        glow: 'rgba(255, 111, 165, 0.34)',
        secondary: 'rgba(99, 102, 241, 0.30)',
        cardRadius: '1.25rem',
        panelRadius: '2rem',
        btnRadius: '9999px',
        border: 'rgba(255, 158, 199, 0.38)',
        font: "'Outfit', 'Inter', sans-serif",
        pattern: 'radial-gradient(ellipse 90% 50% at 50% 108%, rgba(255, 184, 107, 0.22), transparent 70%)',
        patternSize: '100% 100%',
        b300: '#ffd1e3', b400: '#ff9ec7', b500: '#ff6fa5', b600: '#e0457f'
      },
      kintsugi: {
        name: 'Кинцуги // Золото и тушь',
        short: 'Кинцуги',
        desc: 'Чёрная тушь, мазок энсо и золотые трещины',
        watermark: '金継ぎ // KINTSUGI',
        badgeText: 'SUMI-E INK • GOLD LACQUER',
        arch: 'zen',
        morph: 'kintsugi',
        dot: '#d4a937',
        bg: '#0a0908',
        surface: '#14110e',
        surface2: '#1d1812',
        glow: 'rgba(212, 169, 55, 0.22)',
        secondary: 'rgba(120, 53, 15, 0.22)',
        cardRadius: '0.35rem',
        panelRadius: '0.6rem',
        btnRadius: '0.3rem',
        border: 'rgba(212, 169, 55, 0.45)',
        font: "'Playfair Display', 'Outfit', serif",
        pattern: 'radial-gradient(ellipse 70% 45% at 72% 12%, rgba(212, 169, 55, 0.12), transparent 70%)',
        patternSize: '100% 100%',
        b300: '#f3e2a9', b400: '#e6c46a', b500: '#d4a937', b600: '#a8801f'
      },
      jjk: {
        name: 'Магическая битва',
        short: 'Маг. битва',
        desc: 'Туманность Бесконечности и затмение',
        watermark: '呪術廻戦 // 茈',
        badgeText: 'DOMAIN EXPANSION • HOLLOW PURPLE',
        arch: 'crystal',
        morph: 'jjk',
        dot: '#a855f7',
        bg: '#06030f',
        surface: '#0f0722',
        surface2: '#1a0d36',
        glow: 'rgba(168, 85, 247, 0.40)',
        secondary: 'rgba(225, 29, 72, 0.26)',
        cardRadius: '0.9rem',
        panelRadius: '1.4rem',
        btnRadius: '0.65rem',
        border: 'rgba(168, 85, 247, 0.5)',
        font: "'Outfit', 'Inter', sans-serif",
        pattern: 'radial-gradient(ellipse 85% 55% at 50% 20%, rgba(168, 85, 247, 0.26), transparent 72%)',
        patternSize: '100% 100%',
        b300: '#d8b4fe', b400: '#c084fc', b500: '#9333ea', b600: '#7e22ce'
      },
      sao: {
        name: 'SAO // Айнкрад HUD',
        short: 'САО',
        desc: 'Парящий замок Айнкрад и кристаллы',
        watermark: 'AINCRAD // LV.99',
        badgeText: 'NERVEGEAR OS • LINK START!',
        arch: 'cyber',
        morph: 'sao',
        dot: '#38bdf8',
        bg: '#030b14',
        surface: '#071829',
        surface2: '#0c253d',
        glow: 'rgba(56, 189, 248, 0.36)',
        secondary: 'rgba(52, 211, 153, 0.22)',
        cardRadius: '0rem',
        panelRadius: '0.2rem',
        btnRadius: '0.2rem',
        border: 'rgba(56, 189, 248, 0.55)',
        font: "'JetBrains Mono', 'Outfit', sans-serif",
        pattern: 'radial-gradient(ellipse 85% 50% at 50% -10%, rgba(56, 189, 248, 0.25), transparent 70%)',
        patternSize: '100% 100%',
        b300: '#7dd3fc', b400: '#38bdf8', b500: '#0ea5e9', b600: '#0284c7'
      },
      netflix: {
        name: 'Netflix // N-Series',
        short: 'Netflix',
        desc: 'Фирменный чёрный кинозал #141414 и красный Tudum #E50914',
        watermark: 'N // SERIES',
        badgeText: 'N SERIES • TOP 10 TODAY',
        arch: 'default',
        morph: 'netflix',
        dot: '#e50914',
        bg: '#141414',
        surface: '#181818',
        surface2: '#222222',
        glow: 'rgba(229, 9, 20, 0.34)',
        secondary: 'rgba(178, 7, 16, 0.20)',
        cardRadius: '0.3rem',
        panelRadius: '0.5rem',
        btnRadius: '0.25rem',
        border: 'rgba(229, 9, 20, 0.45)',
        font: "'Outfit', 'Inter', sans-serif",
        pattern: 'radial-gradient(ellipse 90% 50% at 50% -10%, rgba(229, 9, 20, 0.26), transparent 72%)',
        patternSize: '100% 100%',
        b300: '#ff8086', b400: '#ff3b44', b500: '#e50914', b600: '#b20710'
      },
      crunchyroll: {
        name: 'Crunchyroll // Orange',
        short: 'Crunchyroll',
        desc: 'Оранжевый #F47521, графит #141519 и стиль Simulcast Mega Fan',
        watermark: 'CR // SIMULCAST',
        badgeText: 'CRUNCHYROLL MEGA FAN • SIMULCAST',
        arch: 'default',
        morph: 'crunchyroll',
        dot: '#f47521',
        bg: '#000000',
        surface: '#141519',
        surface2: '#23252b',
        glow: 'rgba(244, 117, 33, 0.36)',
        secondary: 'rgba(250, 184, 24, 0.22)',
        cardRadius: '0.25rem',
        panelRadius: '0.4rem',
        btnRadius: '0.2rem',
        border: 'rgba(244, 117, 33, 0.55)',
        font: "'Outfit', 'Inter', sans-serif",
        pattern: 'radial-gradient(ellipse 90% 50% at 50% -10%, rgba(244, 117, 33, 0.26), transparent 72%)',
        patternSize: '100% 100%',
        b300: '#ffbe8f', b400: '#ff944d', b500: '#f47521', b600: '#d95e0e'
      }
    };

    const state = {
      lang: localStorage.getItem('kitsune_lang') || 'ru',
      activePage: 'home',
      feedTab: 'popular',
      myListSubfilter: 'all',
      selectedGenre: '',
      catalog: [...FALLBACK_CATALOG],
      loadedPage: 1,
      isFetchingMore: false,
      hasMorePages: true,
      heroIndex: 0,
      heroPaused: false,
      heroTimer: null,
      accountsDb: JSON.parse(localStorage.getItem('kitsune_accounts_db') || '{}'),
      user: JSON.parse(localStorage.getItem('kitsune_user') || 'null'),
      authMode: 'register',
      myList: {},
      favorites: {},
      watchHistory: {},
      collectionNotes: {},
      collectionShowcase: [],
      friendsList: [],
      viewingPublicUser: null,
      collectionGenreFilter: '',
      currentTicketAnime: null,
      tierList: { S: [], A: [], B: [], C: [] },
      tierPoolExtra: [],
      siteSettings: Object.assign({
        smoothAnim: true,
        gridDensity: '5',
        seasonTheme: 'default',
        uiMorph: 'spatial',
        hidePastCalendarDays: true,
        defaultQuality: '720',
        seekStep: 5,
        autoSkipOp: false,
        ambilight: true,
        avatarFrame: '',
        bgMode: 'aurora',
        eveningCozyGlow: false,
        posterBgOpacity: 38,
        cursorAura: true,
        customTheme: { accent: '#f43f5e', bg: '#07080b', arch: 'cyber' }
      }, JSON.parse(localStorage.getItem('kitsune_settings') || '{}')),
      currentAnime: null,
      currentEpisode: 1,
      anilibriaEpisodes: [],
      hlsInstance: null,
      noteModalAnimeId: null,
      rainSoundActive: false,
      rainAudioCtx: null,
      rainGainNode: null
    };

    function getStoragePrefix() {
      return state.user?.email ? `kitsune_acc_${state.user.email.toLowerCase()}` : 'kitsune_guest';
    }

    function persistSiteSettings() {
      localStorage.setItem('kitsune_settings', JSON.stringify(state.siteSettings));
      const prefix = getStoragePrefix();
      localStorage.setItem(`${prefix}_settings`, JSON.stringify(state.siteSettings));
    }

    function loadUserScopedData() {
      const prefix = getStoragePrefix();
      const savedAccSettings = JSON.parse(localStorage.getItem(`${prefix}_settings`) || 'null');
      const globalSettings = JSON.parse(localStorage.getItem('kitsune_settings') || '{}');
      if (savedAccSettings || Object.keys(globalSettings).length) {
        state.siteSettings = Object.assign(state.siteSettings, globalSettings, savedAccSettings || {});
      }
      state.myList = JSON.parse(localStorage.getItem(`${prefix}_mylist`) || localStorage.getItem('kitsune_mylist') || '{}');
      state.favorites = JSON.parse(localStorage.getItem(`${prefix}_favorites`) || '{}');
      state.watchHistory = JSON.parse(localStorage.getItem(`${prefix}_history`) || localStorage.getItem('kitsune_history') || '{}');
      state.tierList = JSON.parse(localStorage.getItem(`${prefix}_tierlist`) || localStorage.getItem('kitsune_tierlist') || '{"S":[],"A":[],"B":[],"C":[]}');
      state.collectionNotes = JSON.parse(localStorage.getItem(`${prefix}_collection_notes`) || '{}');
      state.collectionShowcase = JSON.parse(localStorage.getItem(`${prefix}_collection_showcase`) || '[]');
      state.friendsList = JSON.parse(localStorage.getItem(`${prefix}_friends`) || '[]');
      state.customAvatar = localStorage.getItem(`${prefix}_avatar`) || (state.user?.avatar || '');
    }

    function saveUserScopedData() {
      const prefix = getStoragePrefix();
      localStorage.setItem(`${prefix}_mylist`, JSON.stringify(state.myList));
      localStorage.setItem(`${prefix}_favorites`, JSON.stringify(state.favorites));
      localStorage.setItem(`${prefix}_history`, JSON.stringify(state.watchHistory));
      localStorage.setItem(`${prefix}_tierlist`, JSON.stringify(state.tierList));
      localStorage.setItem(`${prefix}_collection_notes`, JSON.stringify(state.collectionNotes));
      localStorage.setItem(`${prefix}_collection_showcase`, JSON.stringify(state.collectionShowcase));
      localStorage.setItem(`${prefix}_friends`, JSON.stringify(state.friendsList));
      if (state.customAvatar) {
        localStorage.setItem(`${prefix}_avatar`, state.customAvatar);
      } else {
        localStorage.removeItem(`${prefix}_avatar`);
      }
    }

    function triggerAvatarFilePicker() {
      const inp = document.getElementById('avatarFileInput');
      if (inp) inp.click();
    }

    function handleAvatarFileUpload(event) {
      const file = event.target?.files?.[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        showToast('Пожалуйста, выберите файл изображения (JPG, PNG, WEBP, GIF)');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Кадрируем по центру в квадрат 256x256 для чёткого отображения и экономии памяти localStorage
          const size = 256;
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');

          const minSide = Math.min(img.width, img.height);
          const sx = (img.width - minSide) / 2;
          const sy = (img.height - minSide) / 2;

          ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.88);

          state.customAvatar = dataUrl;
          if (state.user) {
            state.user.avatar = dataUrl;
            localStorage.setItem('kitsune_user', JSON.stringify(state.user));
            if (state.user.email && state.accountsDb[state.user.email]) {
              state.accountsDb[state.user.email].avatar = dataUrl;
              localStorage.setItem('kitsune_accounts_db', JSON.stringify(state.accountsDb));
            }
          }
          saveUserScopedData();
          syncProfileUI();
          showToast('Новая аватарка установлена!');
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
      event.target.value = '';
    }

    function removeCustomAvatar() {
      state.customAvatar = '';
      if (state.user) {
        delete state.user.avatar;
        localStorage.setItem('kitsune_user', JSON.stringify(state.user));
        if (state.user.email && state.accountsDb[state.user.email]) {
          delete state.accountsDb[state.user.email].avatar;
          localStorage.setItem('kitsune_accounts_db', JSON.stringify(state.accountsDb));
        }
      }
      saveUserScopedData();
      syncProfileUI();
      showToast('Аватарка сброшена на стандартную');
    }

    // --- ГЕНЕРАТОР ВЕЧЕРНЕГО КИНОБИЛЕТА ---
    const CINEMA_SNACKS = [
      'Рекомендуемый снек: Острый рамен и холодный зелёный чай',
      'Рекомендуемый снек: Японские моти и клубничный лимонад',
      'Рекомендуемый снек: Карамельный попкорн и какао со сливками',
      'Рекомендуемый снек: Хрустящие гёдза с соевым соусом',
      'Рекомендуемый снек: Тёмный шоколад и пряный латте'
    ];

    function openCinemaSessionModal() {
      const modal = document.getElementById('cinemaSessionModal');
      if (!modal) return;
      modal.classList.remove('hidden');
      generateCinemaTicket('random');
    }

    function closeCinemaSessionModal() {
      const modal = document.getElementById('cinemaSessionModal');
      if (modal) modal.classList.add('hidden');
    }

    function generateCinemaTicket(mode = 'random') {
      let pool = [...state.catalog];
      if (mode === 'action') {
        const f = pool.filter(a => (a.genres || []).some(g => /экшен|приключ|сёнен/i.test(g)));
        if (f.length) pool = f;
      } else if (mode === 'cozy') {
        const f = pool.filter(a => (a.genres || []).some(g => /фэнтези|драма|повседнев|романт/i.test(g)));
        if (f.length) pool = f;
      } else if (mode === 'mystery') {
        const f = pool.filter(a => (a.genres || []).some(g => /детектив|триллер|сверхъест|ужас/i.test(g)));
        if (f.length) pool = f;
      }

      const pick = pool[Math.floor(Math.random() * pool.length)] || state.catalog[0];
      if (!pick) return;
      state.currentTicketAnime = pick;

      const epCount = Math.min(pick.episodes || 12, Math.floor(Math.random() * 3) + 2);
      const snack = CINEMA_SNACKS[Math.floor(Math.random() * CINEMA_SNACKS.length)];
      const hallNum = String(Math.floor(Math.random() * 9) + 1).padStart(2, '0');

      document.getElementById('ticketPoster').src = pick.poster;
      document.getElementById('ticketCodeBadge').textContent = `ЗАЛ #${hallNum} • IMAX HLS`;
      document.getElementById('ticketRatingBadge').textContent = `★ ${pick.rating}`;
      document.getElementById('ticketAnimeTitle').textContent = getAnimeDisplayTitle(pick);
      document.getElementById('ticketPlanText').textContent = `План сеанса: ${epCount} серии подряд (~${epCount * 24} мин) • ${pick.year}`;
      document.getElementById('ticketSnackText').textContent = snack;
    }

    function startCinemaTicketSession() {
      const pick = state.currentTicketAnime || state.catalog[0];
      closeCinemaSessionModal();
      if (pick) openAnimePlayer(pick);
    }

    function downloadCinemaTicketPng() {
      const pick = state.currentTicketAnime || state.catalog[0];
      if (!pick) return;
      const canvas = document.createElement('canvas');
      canvas.width = 820;
      canvas.height = 360;
      const ctx = canvas.getContext('2d');
      const theme = DESIGN_THEMES[state.siteSettings.seasonTheme] || DESIGN_THEMES.default;

      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, 820, 360);

      ctx.strokeStyle = theme.b500;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(20, 20, 780, 320, 24);
      ctx.stroke();

      ctx.fillStyle = theme.b400;
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('KITSUNE // ANIME — OFFICIAL NIGHT CINEMA TICKET', 48, 64);

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 30px sans-serif';
      ctx.fillText(getAnimeDisplayTitle(pick).slice(0, 38), 48, 118);

      ctx.fillStyle = '#d4d4d8';
      ctx.font = '600 17px sans-serif';
      ctx.fillText(document.getElementById('ticketPlanText')?.textContent || '', 48, 165);

      ctx.fillStyle = theme.b300;
      ctx.font = '600 16px sans-serif';
      ctx.fillText(document.getElementById('ticketSnackText')?.textContent || '', 48, 210);

      ctx.fillStyle = '#71717a';
      ctx.font = 'bold 13px monospace';
      ctx.fillText(`HOLDER: ${(state.user?.name || 'GUEST').toUpperCase()}   •   RATING: ★ ${pick.rating}`, 48, 295);

      const link = document.createElement('a');
      link.download = `kitsune-ticket-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('Кинобилет сохранён в PNG!');
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      const text = document.getElementById('toastMessage');
      if (!toast || !text) return;
      text.textContent = msg;
      toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
      clearTimeout(window._kitsuneToastTimer);
      window._kitsuneToastTimer = setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
      }, 2800);
    }

    function getAnimeDisplayTitle(anime) {
      if (!anime) return '';
      return state.lang === 'en' && anime.altTitle ? anime.altTitle : anime.title;
    }

    function navigateTo(pageName, pushHash = true) {
      state.activePage = pageName;
      document.querySelectorAll('.page-view').forEach(el => el.classList.add('hidden'));
      const target = document.getElementById(`page-${pageName}`);
      if (target) target.classList.remove('hidden');

      const isMyList = pageName === 'home' && state.feedTab === 'mylist';
      const activeKey = isMyList ? 'mylist' : pageName;

      document.querySelectorAll('.top-nav-pill').forEach(pill => {
        const active = pill.getAttribute('data-top-nav') === activeKey;
        pill.classList.toggle('bg-brand-600', active);
        pill.classList.toggle('text-white', active);
        pill.classList.toggle('font-bold', active);
        pill.classList.toggle('text-zinc-300', !active);
      });

      if (pushHash && location.hash !== `#${pageName}`) {
        history.pushState({ page: pageName }, '', `#${pageName}`);
      }

      if (pageName === 'tierlist') renderTierListPage();
      if (pageName === 'calendar') {
        renderCalendarPage();
        startRealtimeCalendarTicker();
      }
      if (pageName === 'profile') {
        syncProfileUI();
        renderUserCollection();
        renderUserFavorites();
        renderUserShowcase();
        renderFriendsTab();
      }
      if (pageName === 'settings') syncSettingsUI();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- КОНСТРУКТОР СВОЕЙ ТЕМЫ ---
    function hexToRgbObj(hex) {
      const clean = (hex || '#f43f5e').replace('#', '');
      const num = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
      return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
    }

    function mixHex(hex, targetHex, ratio) {
      const a = hexToRgbObj(hex);
      const b = hexToRgbObj(targetHex);
      const r = Math.round(a.r + (b.r - a.r) * ratio);
      const g = Math.round(a.g + (b.g - a.g) * ratio);
      const bl = Math.round(a.b + (b.b - a.b) * ratio);
      return '#' + [r, g, bl].map(x => x.toString(16).padStart(2, '0')).join('');
    }

    function applyDynamicAccentHex(hexColor) {
      const { r, g, b } = hexToRgbObj(hexColor);
      const root = document.documentElement.style;
      root.setProperty('--season-accent', hexColor);
      root.setProperty('--brand-500', hexColor);
      root.setProperty('--brand-400', mixHex(hexColor, '#ffffff', 0.25));
      root.setProperty('--brand-300', mixHex(hexColor, '#ffffff', 0.48));
      root.setProperty('--brand-600', mixHex(hexColor, '#000000', 0.18));
      root.setProperty('--season-glow', `rgba(${r}, ${g}, ${b}, 0.30)`);
      root.setProperty('--card-border', `rgba(${r}, ${g}, ${b}, 0.36)`);
    }

    function previewCustomThemeLive() {
      const accent = document.getElementById('customAccentPicker')?.value || state.siteSettings.customTheme?.accent || '#f43f5e';
      const bg = document.getElementById('customBgPicker')?.value || state.siteSettings.customTheme?.bg || '#07080b';
      const arch = document.getElementById('customArchSelect')?.value || state.siteSettings.customTheme?.arch || 'default';
      const surface = mixHex(bg, '#1e2436', 0.28);
      const surface2 = mixHex(bg, '#2a324b', 0.42);
      const root = document.documentElement.style;

      applyDynamicAccentHex(accent);
      root.setProperty('--season-bg', bg);
      root.setProperty('--season-surface', surface);
      root.setProperty('--season-surface-2', surface2);
      document.body.style.backgroundColor = bg;
      document.body.setAttribute('data-theme-arch', arch);

      const headerBadge = document.getElementById('headerThemeBadge');
      const activeDesignBadge = document.getElementById('activeDesignBadge');
      if (headerBadge) headerBadge.textContent = 'Своя';
      if (activeDesignBadge) activeDesignBadge.textContent = `Своя тема (${accent.toUpperCase()})`;
    }

    function applyCustomUserTheme(notify = true) {
      const accent = document.getElementById('customAccentPicker')?.value || state.siteSettings.customTheme?.accent || '#f43f5e';
      const bg = document.getElementById('customBgPicker')?.value || state.siteSettings.customTheme?.bg || '#07080b';
      const arch = document.getElementById('customArchSelect')?.value || state.siteSettings.customTheme?.arch || 'default';
      state.siteSettings.customTheme = { accent, bg, arch };
      state.siteSettings.seasonTheme = 'custom';
      persistSiteSettings();
      previewCustomThemeLive();

      document.querySelectorAll('.theme-preset-btn, .mini-theme-pill').forEach(btn => {
        btn.classList.remove('ring-2', 'ring-brand-500');
      });

      if (notify) showToast('Собственный стиль сохранён и применён!');
    }

    // --- ЖИВОЙ ДВИЖОК ФОНА (7 РЕЖИМОВ ВКЛЮЧАЯ GOLDEN HOUR BOKEH) ---
    const BG_MODE_META = {
      aurora: { label: 'Фон: Аврора', name: 'Аврора + Постер' },
      twilight: { label: 'Фон: Закат Боке', name: 'Вечерний Golden Hour & Боке' },
      cybergrid: { label: 'Фон: Кибер-волны', name: 'Кибер-волны горизонта' },
      rain: { label: 'Фон: Дождь', name: 'Неоновый Дождь Токио' },
      nebula: { label: 'Фон: Космос', name: 'Звёздная Туманность' },
      seigaiha: { label: 'Фон: Киото', name: 'Волны Сэйгайха' },
      minimal: { label: 'Фон: Чистый', name: 'Чистый Минимализм' }
    };

    function cycleBackgroundMode() {
      const keys = Object.keys(BG_MODE_META);
      const cur = state.siteSettings.bgMode || 'aurora';
      const next = keys[(keys.indexOf(cur) + 1) % keys.length];
      setBackgroundMode(next, true);
    }

    function setBackgroundMode(mode, notify = true) {
      const m = mode in BG_MODE_META ? mode : 'aurora';
      state.siteSettings.bgMode = m;
      state.siteSettings.eveningCozyGlow = (m === 'twilight');
      persistSiteSettings();

      const orbs = document.getElementById('ambientOrbsLayer');
      const grid = document.getElementById('cyberGridLayer');
      const seigaiha = document.getElementById('seigaihaLayer');
      const twilight = document.getElementById('tokyoTwilightLayer');
      const fxLayer = document.getElementById('specialBgEffectsLayer');
      const headerLabel = document.getElementById('bgModeHeaderLabel');

      if (headerLabel) headerLabel.textContent = BG_MODE_META[m].label;
      if (orbs) orbs.style.opacity = m === 'minimal' ? '0.15' : '1';
      if (grid) grid.style.opacity = m === 'cybergrid' ? '1' : '0';
      if (seigaiha) seigaiha.style.opacity = m === 'seigaiha' ? '1' : '0';
      if (twilight) twilight.style.opacity = m === 'twilight' ? '1' : '0';
      document.body.classList.toggle('evening-cozy-active', m === 'twilight' || Boolean(state.siteSettings.eveningCozyGlow));

      if (fxLayer) {
        if (m === 'twilight') {
          const colors = [
            'rgba(251, 191, 36, 0.34)',
            'rgba(244, 63, 94, 0.28)',
            'rgba(249, 115, 22, 0.30)',
            'rgba(192, 132, 252, 0.26)'
          ];
          let html = '';
          for (let i = 0; i < 22; i++) {
            const x = ((i * 41) % 94) + 2;
            const y = ((i * 29) % 88) + 6;
            const sz = 48 + (i % 5) * 34;
            const dur = (13 + (i % 6) * 2.4).toFixed(1);
            const delay = (-1 * (i * 1.1)).toFixed(1);
            const sway = ((i % 2 === 0 ? 1 : -1) * (30 + (i % 4) * 15)) + 'px';
            const blur = (i % 3 === 0) ? 2 : 8;
            const maxop = (0.28 + (i % 4) * 0.12).toFixed(2);
            const col = colors[i % colors.length];
            html += `<div class="bokeh-orb" style="--x:${x}%;--y:${y}%;--sz:${sz}px;--dur:${dur}s;--delay:${delay}s;--sway:${sway};--blur:${blur}px;--maxop:${maxop};--bcol:${col}"></div>`;
          }
          fxLayer.innerHTML = html;
        } else if (m === 'rain') {
          let html = '';
          for (let i = 0; i < 42; i++) {
            const x = ((i * 29) % 100);
            const dur = (0.85 + (i % 6) * 0.18).toFixed(2);
            const delay = (-1 * (i * 0.17)).toFixed(2);
            const h = 65 + (i % 4) * 28;
            html += `<div class="rain-streak" style="--x:${x}%;--dur:${dur}s;--delay:${delay}s;--h:${h}px"></div>`;
          }
          fxLayer.innerHTML = html;
        } else if (m === 'nebula') {
          let html = '';
          for (let i = 0; i < 55; i++) {
            const x = ((i * 43) % 99) + 0.5;
            const y = ((i * 61) % 98) + 1;
            const sz = 2 + (i % 3) * 1.5;
            const dur = (2.4 + (i % 5) * 0.8).toFixed(1);
            const delay = (-1 * (i * 0.3)).toFixed(1);
            html += `<div class="nebula-star" style="--x:${x}%;--y:${y}%;--sz:${sz}px;--dur:${dur}s;--delay:${delay}s"></div>`;
          }
          fxLayer.innerHTML = html;
        } else {
          fxLayer.innerHTML = '';
        }
      }

      document.querySelectorAll('.bg-mode-pill').forEach(btn => {
        const active = btn.getAttribute('data-bg-mode') === m;
        btn.classList.toggle('ring-2', active);
        btn.classList.toggle('ring-brand-500', active);
        btn.classList.toggle('bg-brand-500/20', active);
      });

      if (notify) showToast(`Живой фон: ${BG_MODE_META[m].name}`);
    }

    // Включает/выключает кинематографичный вечерний лаунж (Golden Hour Боке + мягкие тени)
    function activateEveningVibePreset() {
      state.siteSettings.eveningCozyGlow = !state.siteSettings.eveningCozyGlow;
      const btn = document.getElementById('eveningVibeQuickBtn');
      if (state.siteSettings.eveningCozyGlow) {
        setBackgroundMode('twilight', false);
        document.body.classList.add('evening-cozy-active');
        if (btn) btn.className = 'flex items-center justify-center px-2.5 py-2 rounded-xl text-[11px] font-bold bg-amber-500/25 border border-amber-400/60 text-amber-200 shadow-lg shadow-amber-500/20 transition cursor-pointer truncate';
        showToast('Вечерний Лаунж включён: закатные лучи и мягкое боке');
      } else {
        setBackgroundMode('aurora', false);
        document.body.classList.remove('evening-cozy-active');
        if (btn) btn.className = 'flex items-center justify-center px-2.5 py-2 rounded-xl text-[11px] font-bold bg-white/5 hover:bg-amber-500/20 border border-white/10 text-zinc-200 hover:text-amber-200 transition cursor-pointer truncate';
        showToast('Вернули классический фон Аврора');
      }
      persistSiteSettings();
    }

    function updatePosterBackdropIntensity(val) {
      const num = Number(val);
      state.siteSettings.posterBgOpacity = num;
      persistSiteSettings();
      document.documentElement.style.setProperty('--poster-bg-opacity', (num / 100).toFixed(2));
      const lbl = document.getElementById('posterBlurIntensityVal');
      if (lbl) lbl.textContent = `${num}%`;
    }

    function toggleCursorAura(enabled) {
      state.siteSettings.cursorAura = Boolean(enabled);
      persistSiteSettings();
      const aura = document.getElementById('cursorAuraGlow');
      if (aura) aura.style.display = enabled ? 'block' : 'none';
    }

    let cursorRafPending = false;
    let lastCursorX = 0;
    let lastCursorY = 0;
    window.addEventListener('pointermove', (e) => {
      if (state.siteSettings.cursorAura === false) return;
      lastCursorX = e.clientX;
      lastCursorY = e.clientY;
      if (!cursorRafPending) {
        cursorRafPending = true;
        requestAnimationFrame(() => {
          cursorRafPending = false;
          const aura = document.getElementById('cursorAuraGlow');
          if (aura) {
            aura.style.transform = `translate3d(${lastCursorX}px, ${lastCursorY}px, 0)`;
          }
        });
      }
    }, { passive: true });

    function switchProfileTab(tab) {
      document.getElementById('profileContent-collection').classList.toggle('hidden', tab !== 'collection');
      document.getElementById('profileContent-favorites')?.classList.toggle('hidden', tab !== 'favorites');
      document.getElementById('profileContent-showcase').classList.toggle('hidden', tab !== 'showcase');
      document.getElementById('profileContent-friends')?.classList.toggle('hidden', tab !== 'friends');
      document.getElementById('profileContent-auth').classList.toggle('hidden', tab !== 'auth');

      document.getElementById('profileTab-collection').className = tab === 'collection' ? 'px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold cursor-pointer' : 'px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs font-semibold cursor-pointer';
      const favTabBtn = document.getElementById('profileTab-favorites');
      if (favTabBtn) {
        favTabBtn.className = tab === 'favorites'
          ? 'px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5'
          : 'px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5';
      }
      document.getElementById('profileTab-showcase').className = tab === 'showcase' ? 'px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold cursor-pointer' : 'px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs font-semibold cursor-pointer';
      const friendsTabBtn = document.getElementById('profileTab-friends');
      if (friendsTabBtn) {
        friendsTabBtn.className = tab === 'friends'
          ? 'px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5'
          : 'px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5';
      }
      document.getElementById('profileTab-auth').className = tab === 'auth' ? 'px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold cursor-pointer' : 'px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs font-semibold cursor-pointer';

      if (tab === 'collection') renderUserCollection();
      if (tab === 'favorites') renderUserFavorites();
      if (tab === 'showcase') renderUserShowcase();
      if (tab === 'friends') renderFriendsTab();
    }

    // --- СИСТЕМА ДРУЗЕЙ ПО НИКНЕЙМУ И ПРОСМОТР ЧУЖИХ ПРОФИЛЕЙ (НАДЁЖНЫЙ ПОИСК ПО ВСЕМ РЕАЛЬНЫМ АККАУНТАМ) ---
    function normalizeNickKey(str = '') {
      return String(str || '')
        .trim()
        .toLowerCase()
        .replace(/^@+/, '')
        .replace(/\s+/g, ' ');
    }

    function syncAccountsDatabaseFromStorage() {
      // Перечитываем актуальную базу аккаунтов напрямую из localStorage
      const freshDb = JSON.parse(localStorage.getItem('kitsune_accounts_db') || '{}');
      const currentActive = JSON.parse(localStorage.getItem('kitsune_user') || 'null');

      // Если текущий залогиненный пользователь почему-то не попал в общую таблицу — записываем его
      if (currentActive && currentActive.email) {
        const em = currentActive.email.toLowerCase();
        if (!freshDb[em]) {
          freshDb[em] = {
            name: currentActive.name || em.split('@')[0],
            email: em,
            avatar: currentActive.avatar || '',
            createdAt: Date.now()
          };
        }
      }

      // Также сканируем localStorage на случай аккаунтов, у которых есть сохранённые данные kitsune_acc_{email}_*
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i) || '';
        const match = k.match(/^kitsune_acc_(.+?)_(mylist|favorites|history|tierlist|settings|avatar)$/);
        if (match && match[1]) {
          const emailKey = match[1].toLowerCase();
          if (!freshDb[emailKey]) {
            freshDb[emailKey] = {
              name: emailKey.split('@')[0],
              email: emailKey,
              createdAt: Date.now()
            };
          }
        }
      }

      state.accountsDb = freshDb;
      localStorage.setItem('kitsune_accounts_db', JSON.stringify(freshDb));
      return freshDb;
    }

    function buildDirectoryOfUsers() {
      syncAccountsDatabaseFromStorage();
      const catalogRef = state.catalog.length ? state.catalog : FALLBACK_CATALOG;
      const usersList = [];
      const seenEmails = new Set();

      Object.values(state.accountsDb || {}).forEach(acc => {
        if (!acc || (!acc.email && !acc.name)) return;
        const email = (acc.email || `${acc.name}@kitsune.local`).toLowerCase();
        if (seenEmails.has(email)) return;
        seenEmails.add(email);

        const displayName = (acc.name || email.split('@')[0]).trim();
        const prefix = `kitsune_acc_${email}`;
        const myListObj = JSON.parse(localStorage.getItem(`${prefix}_mylist`) || '{}');
        const favObj = JSON.parse(localStorage.getItem(`${prefix}_favorites`) || '{}');
        const tierObj = JSON.parse(localStorage.getItem(`${prefix}_tierlist`) || '{"S":[],"A":[],"B":[],"C":[]}');
        const showcaseRaw = JSON.parse(localStorage.getItem(`${prefix}_collection_showcase`) || '[]');
        const notesObj = JSON.parse(localStorage.getItem(`${prefix}_collection_notes`) || '{}');
        const avatarData = localStorage.getItem(`${prefix}_avatar`) || acc.avatar || '';

        const completedList = [];
        const seenAnime = new Set();
        Object.values(myListObj).forEach(a => {
          if (a && a.id && a.userStatus === 'completed' && !seenAnime.has(a.id)) {
            seenAnime.add(a.id);
            completedList.push(a);
          }
        });
        Object.values(tierObj).forEach(arr => (arr || []).forEach(a => {
          if (a && a.id && !seenAnime.has(a.id)) {
            seenAnime.add(a.id);
            completedList.push(a);
          }
        }));

        const allKnownForUser = [...completedList, ...Object.values(myListObj), ...Object.values(favObj), ...catalogRef];
        const resolvedShowcase = showcaseRaw.map(entry => {
          if (typeof entry === 'object' && entry !== null) return entry;
          return allKnownForUser.find(x => x && x.id === entry);
        }).filter(Boolean);

        const favoritesArr = Object.values(favObj);

        usersList.push({
          nickname: displayName,
          nickKey: normalizeNickKey(displayName),
          emailLoginKey: normalizeNickKey(email.split('@')[0]),
          email: email,
          rank: completedList.length >= 6 ? 'Девятихвостый Владыка' : completedList.length >= 2 ? 'Мастер Кицунэ' : 'Искатель историй',
          frame: 'frame-kitsune',
          avatar: avatarData,
          avatarEmoji: displayName.slice(0, 1).toUpperCase(),
          online: true,
          isSelf: Boolean(state.user && (
            normalizeNickKey(state.user.email) === email ||
            normalizeNickKey(state.user.name) === normalizeNickKey(displayName)
          )),
          bio: `Зарегистрированный профиль KITSUNE (${email})`,
          showcase: resolvedShowcase.slice(0, 3),
          collection: completedList,
          favorites: favoritesArr,
          notes: notesObj
        });
      });

      return usersList;
    }

    function findUserByNicknameOrEmail(queryStr) {
      const q = normalizeNickKey(queryStr);
      if (!q) return null;
      const allUsers = buildDirectoryOfUsers();

      // 1. Точное совпадение по нику, логину почты или полному email
      let found = allUsers.find(u =>
        u.nickKey === q ||
        u.emailLoginKey === q ||
        u.email === q
      );
      if (found) return found;

      // 2. Совпадение с начала строки (startsWith)
      found = allUsers.find(u =>
        u.nickKey.startsWith(q) ||
        u.emailLoginKey.startsWith(q)
      );
      if (found) return found;

      // 3. Частичное вхождение подстроки (includes)
      return allUsers.find(u =>
        u.nickKey.includes(q) ||
        u.emailLoginKey.includes(q) ||
        u.email.includes(q)
      ) || null;
    }

    function isUserInFriends(nicknameOrEmail) {
      const target = normalizeNickKey(nicknameOrEmail);
      if (!target) return false;
      return (state.friendsList || []).some(f => {
        const fNick = normalizeNickKey(typeof f === 'string' ? f : f?.nickname);
        const fEmail = normalizeNickKey(typeof f === 'object' ? f?.email : '');
        return fNick === target || (fEmail && fEmail === target);
      });
    }

    function syncFriendsCountBadge() {
      const allUsers = buildDirectoryOfUsers();
      const validFriends = (state.friendsList || []).filter(f => {
        const nick = typeof f === 'string' ? f : f?.nickname;
        const email = typeof f === 'object' ? f?.email : '';
        return allUsers.some(u =>
          u.nickKey === normalizeNickKey(nick) ||
          (email && u.email === normalizeNickKey(email))
        );
      });
      const count = validFriends.length;
      const badge = document.getElementById('friendsCountBadge');
      const counter = document.getElementById('myFriendsListCounter');
      if (badge) badge.textContent = String(count);
      if (counter) counter.textContent = String(count);
    }

    function toggleFriendByNickname(nickname) {
      const targetAccount = findUserByNicknameOrEmail(nickname);
      if (!targetAccount) {
        showToast(`Аккаунт «${nickname}» не найден. Проверьте написание ника.`);
        return;
      }

      if (targetAccount.isSelf) {
        showToast('Это твой собственный активный аккаунт');
        return;
      }

      const idx = (state.friendsList || []).findIndex(f => {
        const fNick = normalizeNickKey(typeof f === 'string' ? f : f?.nickname);
        const fEmail = normalizeNickKey(typeof f === 'object' ? f?.email : '');
        return fNick === targetAccount.nickKey || (fEmail && fEmail === targetAccount.email);
      });

      if (idx >= 0) {
        state.friendsList.splice(idx, 1);
        showToast(`Пользователь ${targetAccount.nickname} удалён из друзей`);
      } else {
        state.friendsList.push({
          nickname: targetAccount.nickname,
          email: targetAccount.email,
          addedAt: Date.now()
        });
        showToast(`${targetAccount.nickname} добавлен в твой список друзей!`);
      }

      saveUserScopedData();
      syncFriendsCountBadge();
      renderFriendsTab();
      if (state.viewingPublicUser && normalizeNickKey(state.viewingPublicUser.nickname) === targetAccount.nickKey) {
        syncPublicProfileFriendButton();
      }
    }

    function addFriendByExactInput() {
      const inp = document.getElementById('friendNicknameSearchInput');
      const val = (inp?.value || '').trim();
      if (!val) {
        showToast('Введи никнейм пользователя в поле поиска');
        inp?.focus();
        return;
      }

      const target = findUserByNicknameOrEmail(val);
      if (!target) {
        showToast(`Аккаунт по запросу «${val}» не найден среди зарегистрированных`);
        return;
      }

      if (target.isSelf) {
        openPublicProfileByNickname(target.nickname);
        return;
      }

      if (!isUserInFriends(target.nickname)) {
        toggleFriendByNickname(target.nickname);
        if (inp) inp.value = '';
        renderFriendSearchResults('');
      } else {
        showToast(`${target.nickname} уже в друзьях — открываю профиль!`);
        openPublicProfileByNickname(target.nickname);
      }
    }

    function renderFriendsTab() {
      syncFriendsCountBadge();
      const searchVal = document.getElementById('friendNicknameSearchInput')?.value || '';
      renderFriendSearchResults(searchVal);
      renderMyFriendsGrid();
    }

    function renderFriendSearchResults(query = '') {
      const box = document.getElementById('friendSearchResultsBox');
      const hintBar = document.getElementById('registeredNicknamesHintBar');
      if (!box) return;

      const q = normalizeNickKey(query);
      const allUsers = buildDirectoryOfUsers();

      // Показываем плашки всех зарегистрированных аккаунтов для быстрого клика
      if (hintBar) {
        if (allUsers.length > 0) {
          hintBar.innerHTML =
            `<span class="font-bold text-zinc-300">Зарегистрированные аккаунты (${allUsers.length}):</span>` +
            allUsers.map(u => {
              const safeNick = u.nickname.replace(/'/g, "\\'");
              return `
                <button
                  type="button"
                  onclick="document.getElementById('friendNicknameSearchInput').value='${safeNick}'; renderFriendSearchResults('${safeNick}');"
                  class="px-2.5 py-0.5 rounded-lg bg-white/5 hover:bg-brand-500/20 border border-white/10 text-brand-300 font-semibold transition cursor-pointer"
                >@${u.nickname}${u.isSelf ? ' (Ты)' : ''}</button>
              `;
            }).join('');
        } else {
          hintBar.innerHTML = `<span class="text-zinc-500">Пока нет зарегистрированных профилей во вкладке «Аккаунт и безопасность».</span>`;
        }
      }

      // При поиске показываем все подходящие аккаунты (если запрос пустой — показываем все кроме себя, либо и себя тоже, если он единственный)
      let list = allUsers;
      if (q) {
        list = allUsers.filter(u =>
          u.nickKey.includes(q) ||
          u.emailLoginKey.includes(q) ||
          u.email.includes(q)
        );
      } else {
        const others = allUsers.filter(u => !u.isSelf);
        list = others.length ? others : allUsers;
      }

      if (!list.length) {
        box.innerHTML = `
          <div class="col-span-full p-5 rounded-2xl bg-dark-900 border border-white/10 text-center space-y-1.5">
            <div class="text-xs font-bold text-white">
              ${q ? `По запросу «${query.trim()}» аккаунтов не найдено` : 'Зарегистрированных аккаунтов пока нет'}
            </div>
            <p class="text-[11px] text-zinc-400">
              Проверь подсказки с никами выше или создай второй аккаунт во вкладке «Аккаунт и безопасность».
            </p>
          </div>
        `;
        return;
      }

      box.innerHTML = list.map(u => {
        const isFr = isUserInFriends(u.nickname);
        const safeNick = u.nickname.replace(/'/g, "\\'");
        return `
          <div class="p-3.5 rounded-2xl bg-dark-900 border ${u.isSelf ? 'border-brand-500/40' : 'border-white/10 hover:border-brand-500/50'} transition flex items-center justify-between gap-3">
            <div onclick="openPublicProfileByNickname('${safeNick}')" class="flex items-center gap-3 min-w-0 cursor-pointer flex-1 group">
              <div class="w-11 h-11 rounded-xl bg-brand-600/30 text-white flex items-center justify-center font-display font-black text-base shrink-0 overflow-hidden ${u.frame || ''}">
                ${u.avatar ? `<img src="${u.avatar}" class="w-full h-full object-cover" />` : (u.avatarEmoji || 'K')}
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5">
                  <span class="text-xs font-bold text-white truncate group-hover:text-brand-300">${u.nickname}</span>
                  ${u.isSelf
                    ? `<span class="px-1.5 py-0.2 rounded bg-brand-500/25 text-brand-300 text-[9px] font-bold">Твой профиль</span>`
                    : `<span class="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">Аккаунт</span>`
                  }
                </div>
                <div class="text-[11px] text-zinc-400 truncate">Трофеев: ${u.collection.length} • Избранных: ${u.favorites.length}</div>
              </div>
            </div>

            <div class="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onclick="openPublicProfileByNickname('${safeNick}')"
                class="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-zinc-200 cursor-pointer"
              >Профиль</button>
              ${u.isSelf ? '' : `
                <button
                  type="button"
                  onclick="toggleFriendByNickname('${safeNick}')"
                  class="px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer ${isFr ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300' : 'bg-brand-600 hover:bg-brand-500 text-white'}"
                >${isFr ? '✓ В друзьях' : '+ Друг'}</button>
              `}
            </div>
          </div>
        `;
      }).join('');
    }

    function renderMyFriendsGrid() {
      const grid = document.getElementById('myFriendsGrid');
      if (!grid) return;
      const friends = (state.friendsList || [])
        .map(f => {
          const nick = typeof f === 'string' ? f : f?.nickname;
          const email = typeof f === 'object' ? f?.email : '';
          return findUserByNicknameOrEmail(nick) || findUserByNicknameOrEmail(email);
        })
        .filter(Boolean);

      if (!friends.length) {
        grid.innerHTML = `
          <div class="col-span-full py-10 px-4 text-center space-y-2 bg-dark-800/50 rounded-2xl border border-dashed border-white/15">
            <div class="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-400 flex items-center justify-center mx-auto">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div class="text-xs sm:text-sm font-bold text-white">Список друзей пока пуст</div>
            <p class="text-xs text-zinc-400 max-w-md mx-auto">Найди зарегистрированный аккаунт по никнейму выше и нажми «+ Друг», чтобы видеть его профиль, коллекцию и избранное.</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = friends.map(u => {
        const safeNick = u.nickname.replace(/'/g, "\\'");
        const topPosters = (u.showcase.length ? u.showcase : u.collection).slice(0, 3);
        return `
          <div
            onclick="openPublicProfileByNickname('${safeNick}')"
            class="p-4 rounded-2xl bg-dark-800 hover:bg-dark-800/90 border border-white/10 hover:border-brand-500/60 transition cursor-pointer flex flex-col justify-between gap-3.5 group shadow-lg"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-display font-black text-lg shrink-0 overflow-hidden ${u.frame || ''}">
                  ${u.avatar ? `<img src="${u.avatar}" class="w-full h-full object-cover" />` : (u.avatarEmoji || 'K')}
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5">
                    <h4 class="font-display font-bold text-sm text-white truncate group-hover:text-brand-300">${u.nickname}</h4>
                    <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                  </div>
                  <div class="text-[11px] text-brand-300 font-semibold">${u.rank}</div>
                </div>
              </div>
              <button
                type="button"
                title="Убрать из друзей"
                onclick="event.stopPropagation(); toggleFriendByNickname('${safeNick}')"
                class="px-2 py-1 rounded-lg bg-white/5 hover:bg-rose-500/20 text-[10px] font-bold text-zinc-400 hover:text-rose-300 cursor-pointer"
              >✕</button>
            </div>

            <p class="text-[11px] text-zinc-400 line-clamp-2">Трофеев: ${u.collection.length} • Избранное: ${u.favorites.length} • Витрина: ${u.showcase.length}</p>

            <div class="flex items-center justify-between pt-2 border-t border-white/10">
              <div class="flex items-center -space-x-2">
                ${topPosters.length
                  ? topPosters.map(a => `<img src="${a.poster}" title="${getAnimeDisplayTitle(a)}" class="w-7 h-9 rounded-md object-cover border border-dark-900 shadow" />`).join('')
                  : `<span class="text-[11px] text-zinc-500">Коллекция пуста</span>`
                }
              </div>
              <span class="text-xs font-bold text-brand-400 group-hover:translate-x-0.5 transition-transform">Открыть профиль →</span>
            </div>
          </div>
        `;
      }).join('');
    }

    function openPublicProfileByNickname(nickname) {
      const userObj = findUserByNicknameOrEmail(nickname);
      if (!userObj) {
        showToast(`Аккаунт «${nickname}» не найден среди зарегистрированных`);
        return;
      }
      state.viewingPublicUser = userObj;

      const modal = document.getElementById('publicProfileModal');
      if (!modal) return;
      modal.classList.remove('hidden');

      const av = document.getElementById('pubProfileAvatar');
      if (av) {
        av.className = `w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-display font-black text-2xl overflow-hidden shrink-0 shadow-xl ${userObj.frame || ''}`;
        av.innerHTML = userObj.avatar ? `<img src="${userObj.avatar}" class="w-full h-full object-cover" />` : (userObj.avatarEmoji || 'K');
      }

      document.getElementById('pubProfileName').textContent = userObj.nickname;
      document.getElementById('pubProfileRankBadge').textContent = userObj.rank || 'Мастер Кицунэ';
      document.getElementById('pubProfileBio').textContent = userObj.bio || '';
      document.getElementById('pubProfileStatsLine').textContent = `Трофеев: ${userObj.collection.length} • Избранных: ${userObj.favorites.length}`;
      document.getElementById('pubCollectionCount').textContent = String(userObj.collection.length);
      document.getElementById('pubFavoritesCount').textContent = String(userObj.favorites.length);

      // Расчёт совместимости вкусов с текущим пользователем
      const myIds = new Set([
        ...getCompletedCollectionItems().map(x => x.id),
        ...Object.keys(state.favorites || {}),
        ...Object.keys(state.myList || {})
      ]);
      const overlap = userObj.collection.filter(x => myIds.has(x.id)).length;
      const compatPct = Math.min(99, Math.max(74, 76 + overlap * 7));
      const compatEl = document.getElementById('pubProfileCompatibility');
      if (compatEl) compatEl.textContent = `Совместимость вкусов: ${compatPct}%`;

      syncPublicProfileFriendButton();
      renderPublicProfileContents(userObj);
      switchPublicProfileTab('showcase');
    }

    function syncPublicProfileFriendButton() {
      const btn = document.getElementById('pubProfileFriendActionBtn');
      const u = state.viewingPublicUser;
      if (!btn || !u) return;
      const isFr = isUserInFriends(u.nickname);
      btn.textContent = isFr ? '✓ У тебя в друзьях (Убрать)' : '+ Добавить в друзья';
      btn.className = isFr
        ? 'px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition cursor-pointer'
        : 'px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition cursor-pointer shadow-lg';
    }

    function toggleFriendFromPublicModal() {
      if (!state.viewingPublicUser) return;
      toggleFriendByNickname(state.viewingPublicUser.nickname);
    }

    function closePublicProfileModal() {
      const modal = document.getElementById('publicProfileModal');
      if (modal) modal.classList.add('hidden');
    }

    function switchPublicProfileTab(tab) {
      ['showcase', 'collection', 'favorites'].forEach(t => {
        document.getElementById(`pubContent-${t}`)?.classList.toggle('hidden', t !== tab);
        const btn = document.getElementById(`pubTab-${t}`);
        if (btn) {
          btn.className = t === tab
            ? 'px-3.5 py-1.5 rounded-xl bg-brand-600 text-white text-xs font-bold cursor-pointer'
            : 'px-3.5 py-1.5 rounded-xl bg-white/5 text-zinc-300 text-xs font-semibold cursor-pointer';
        }
      });
    }

    function renderPublicProfileContents(userObj) {
      const showEl = document.getElementById('pubContent-showcase');
      const collEl = document.getElementById('pubContent-collection');
      const favEl = document.getElementById('pubContent-favorites');

      if (showEl) {
        const showList = (userObj.showcase || []).slice(0, 3);
        showEl.innerHTML = showList.length ? showList.map((item, idx) => {
          const safeJson = JSON.stringify(item).replace(/'/g, '&#39;');
          return `
            <div onclick='closePublicProfileModal(); openAnimePlayer(${safeJson})' class="p-4 rounded-2xl bg-dark-800 border border-amber-400/40 hover:border-amber-400 flex items-start gap-3.5 cursor-pointer group transition shadow-lg">
              <img src="${item.poster}" class="w-20 h-28 rounded-xl object-cover shrink-0 shadow-md group-hover:scale-105 transition-transform" />
              <div class="min-w-0 flex-1 space-y-1.5">
                <span class="inline-block px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-black">ТОП #${idx + 1}</span>
                <h4 class="font-display font-bold text-sm text-white line-clamp-2 group-hover:text-brand-300">${getAnimeDisplayTitle(item)}</h4>
                <div class="text-[11px] text-zinc-400">★ ${item.rating} • ${item.year}</div>
                <span class="inline-block text-[11px] font-bold text-brand-400 pt-1">▶ Смотреть</span>
              </div>
            </div>
          `;
        }).join('') : `<div class="col-span-full py-8 text-center text-xs text-zinc-400 bg-dark-800/50 rounded-2xl border border-white/10">Пользователь ещё не закрепил тайтлы на своей Витрине Топ-3</div>`;
      }

      const renderCardList = (arr, withNotes = false, emptyMsg = 'Пусто') => arr.length ? arr.map(a => {
        const safeJson = JSON.stringify(a).replace(/'/g, '&#39;');
        const note = withNotes ? (userObj.notes?.[a.id] || '') : '';
        return `
          <div onclick='closePublicProfileModal(); openAnimePlayer(${safeJson})' class="bg-dark-800 border border-white/10 hover:border-brand-500/60 rounded-2xl overflow-hidden flex flex-col cursor-pointer group transition">
            <div class="relative aspect-[3/4] bg-dark-900 overflow-hidden">
              <img src="${a.poster}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-black/80 text-amber-400 text-[11px] font-bold">★ ${a.rating}</div>
              <div class="hanko-stamp absolute bottom-2 right-2 px-1 py-0.5 text-rose-400 bg-black/80 text-[10px] font-black">完</div>
            </div>
            <div class="p-3 space-y-1">
              <div class="font-display font-bold text-xs text-white line-clamp-1 group-hover:text-brand-300">${getAnimeDisplayTitle(a)}</div>
              <div class="text-[10px] text-zinc-400">${a.year} • ${(a.genres || []).slice(0, 2).join(', ')}</div>
              ${note ? `<p class="text-[11px] text-brand-200 italic line-clamp-2 pt-1">«${note}»</p>` : ''}
            </div>
          </div>
        `;
      }).join('') : `<div class="col-span-full py-8 text-center text-xs text-zinc-400 bg-dark-800/50 rounded-2xl border border-white/10">${emptyMsg}</div>`;

      if (collEl) collEl.innerHTML = renderCardList(userObj.collection || [], true, 'Коллекция трофеев пока пуста');
      if (favEl) favEl.innerHTML = renderCardList(userObj.favorites || [], false, 'В избранном пока пусто');
    }

    // --- ИЗБРАННОЕ ПОЛЬЗОВАТЕЛЯ (SVG СЕРДЦЕ) ---
    const HEART_SVG_FILLED = `<svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    const HEART_SVG_OUTLINE = `<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    const CROWN_SVG_ICON = `<svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/></svg>`;

    function isAnimeFavorite(id) {
      return Boolean(state.favorites && state.favorites[id]);
    }

    function syncFavoritesCountBadge() {
      const badge = document.getElementById('favoritesCountBadge');
      if (badge) badge.textContent = String(Object.keys(state.favorites || {}).length);
    }

    function toggleFavoriteAnime(e, anime) {
      if (e) e.stopPropagation();
      if (!anime || !anime.id) return;
      const fav = isAnimeFavorite(anime.id);
      if (fav) {
        delete state.favorites[anime.id];
        showToast(`Убрано из Избранного: ${getAnimeDisplayTitle(anime)}`);
      } else {
        state.favorites[anime.id] = { ...anime, favAddedAt: Date.now() };
        showToast(`Добавлено в Избранное: ${getAnimeDisplayTitle(anime)}`);
      }
      saveUserScopedData();
      syncFavoritesCountBadge();

      // Обновляем все кнопки сердечка для этого аниме на странице без полной перерисовки DOM
      const nowFav = isAnimeFavorite(anime.id);
      document.querySelectorAll(`[data-fav-btn="${anime.id}"]`).forEach(btn => {
        btn.innerHTML = nowFav ? HEART_SVG_FILLED : HEART_SVG_OUTLINE;
        btn.classList.toggle('bg-rose-500/85', nowFav);
        btn.classList.toggle('border-rose-400', nowFav);
      });

      syncModalFavoriteButton();
      if (state.activePage === 'profile') renderUserFavorites();
    }

    function syncModalFavoriteButton() {
      const btn = document.getElementById('modalFavoriteBtn');
      const icon = document.getElementById('modalFavoriteIcon');
      const txt = document.getElementById('modalFavoriteText');
      if (!btn || !state.currentAnime) return;
      const fav = isAnimeFavorite(state.currentAnime.id);
      if (icon) icon.innerHTML = fav ? HEART_SVG_FILLED : HEART_SVG_OUTLINE;
      if (txt) txt.textContent = fav ? 'В избранном' : 'В избранное';
      btn.className = fav
        ? 'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/50 text-xs font-bold text-rose-300 transition cursor-pointer'
        : 'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-dark-800 hover:bg-rose-500/20 border border-white/10 text-xs font-bold text-zinc-200 transition cursor-pointer';
    }

    function toggleModalFavorite() {
      if (!state.currentAnime) return;
      toggleFavoriteAnime(null, state.currentAnime);
    }

    function renderUserFavorites() {
      const grid = document.getElementById('userFavoritesGrid');
      syncFavoritesCountBadge();
      if (!grid) return;

      let items = Object.values(state.favorites || {});
      const sortMode = document.getElementById('favoritesSortSelect')?.value || 'default';
      items.sort((a, b) => {
        if (sortMode === 'alpha') return getAnimeDisplayTitle(a).localeCompare(getAnimeDisplayTitle(b));
        if (sortMode === 'year') return (b.year || 0) - (a.year || 0);
        if (sortMode === 'rating') return parseFloat(b.rating || 0) - parseFloat(a.rating || 0);
        return (b.favAddedAt || 0) - (a.favAddedAt || 0);
      });

      if (!items.length) {
        grid.innerHTML = `
          <div class="col-span-full py-12 px-4 text-center space-y-2 bg-dark-800/60 rounded-2xl border border-white/10">
            <div class="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">${HEART_SVG_FILLED}</div>
            <div class="text-sm font-bold text-white">В Избранном пока пусто</div>
            <p class="text-xs text-zinc-400 max-w-md mx-auto">Нажми на иконку сердца на любой карточке аниме в каталоге, в результатах поиска или внутри видеоплеера, чтобы добавить любимые тайтлы!</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = items.map(a => {
        const safeJson = JSON.stringify(a).replace(/'/g, '&#39;');
        const inShowcase = isAnimeInShowcase(a.id);
        return `
          <div class="bg-dark-800 border border-rose-500/30 hover:border-rose-500/70 rounded-2xl overflow-hidden flex flex-col relative group transition shadow-lg">
            <div onclick='openAnimePlayer(${safeJson})' class="relative aspect-[3/4] bg-dark-900 overflow-hidden cursor-pointer">
              <img src="${a.poster}" onerror="this.src='https://placehold.co/300x420/131620/f43f5e?text=FAV'" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
              <div class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-black/80 text-amber-400 text-[11px] font-bold">★ ${a.rating}</div>
              <button
                type="button"
                title="Убрать из избранного"
                onclick='toggleFavoriteAnime(event, ${safeJson})'
                class="absolute top-2.5 left-2.5 w-8 h-8 rounded-xl bg-rose-500/90 hover:bg-rose-600 text-white flex items-center justify-center text-xs shadow-lg cursor-pointer"
              >${HEART_SVG_FILLED}</button>
              <button
                type="button"
                title="На витрину топов"
                onclick='event.stopPropagation(); toggleShowcase("${a.id}", ${safeJson})'
                class="absolute bottom-2.5 right-2.5 px-2 py-1 rounded-lg ${inShowcase ? 'bg-amber-500 text-zinc-950 font-black' : 'bg-black/75 text-zinc-200 hover:bg-white/20'} text-[10px] font-bold cursor-pointer"
              >${inShowcase ? 'В топе ✓' : '+ В витрину'}</button>
            </div>
            <div class="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h4 onclick='openAnimePlayer(${safeJson})' class="font-display font-bold text-xs sm:text-sm text-white line-clamp-2 hover:text-brand-300 cursor-pointer">${getAnimeDisplayTitle(a)}</h4>
                <div class="text-[11px] text-zinc-400 mt-0.5">${a.year || 2024} • ${(a.genres || []).slice(0, 2).join(', ')}</div>
              </div>
              <button
                type="button"
                onclick='openAnimePlayer(${safeJson})'
                class="w-full py-1.5 rounded-xl bg-brand-600/20 hover:bg-brand-600 text-brand-300 hover:text-white text-xs font-bold transition cursor-pointer"
              >▶ Смотреть</button>
            </div>
          </div>
        `;
      }).join('');
    }

    // --- КОЛЛЕКЦИЯ ТРОФЕЕВ (ПРОФИЛЬ) ---
    function getCompletedCollectionItems() {
      const completed = [];
      const seen = new Set();
      // Тайтлы со статусом completed в mylist или те, что в S/A/B/C тир-листе
      Object.values(state.myList).forEach(a => {
        if (a.userStatus === 'completed' && !seen.has(a.id)) {
          seen.add(a.id);
          completed.push(a);
        }
      });
      Object.values(state.tierList).forEach(arr => {
        arr.forEach(a => {
          if (!seen.has(a.id)) {
            seen.add(a.id);
            completed.push(a);
          }
        });
      });
      // Если у пользователя пока пусто, для демонстрации галереи подтягиваем парочку из каталога
      if (!completed.length && state.catalog.length) {
        return state.catalog.slice(0, 3);
      }
      return completed;
    }

    function renderUserCollection() {
      const grid = document.getElementById('userCollectionGrid');
      const badge = document.getElementById('collectionCountBadge');
      const genreSlot = document.getElementById('collectionGenreFilterSlot');
      if (!grid) return;

      let items = getCompletedCollectionItems();
      if (badge) badge.textContent = items.length;

      // Жанры для фильтрации внутри коллекции
      const genreSet = new Set();
      items.forEach(i => (i.genres || []).forEach(g => genreSet.add(g)));
      const genres = Array.from(genreSet).sort();

      if (genreSlot) {
        genreSlot.innerHTML = `<button type="button" onclick="setCollectionGenreFilter('')" class="px-2.5 py-1 rounded-lg text-[11px] font-bold ${!state.collectionGenreFilter ? 'bg-brand-600 text-white' : 'bg-dark-900 text-zinc-400 hover:text-white'}">Все жанры</button>` +
          genres.map(g => `<button type="button" onclick="setCollectionGenreFilter('${g.replace(/'/g, "\\'")}')" class="px-2.5 py-1 rounded-lg text-[11px] font-semibold ${state.collectionGenreFilter === g ? 'bg-brand-600 text-white' : 'bg-dark-900 text-zinc-400 hover:text-white'}">${g}</button>`).join('');
      }

      if (state.collectionGenreFilter) {
        items = items.filter(i => (i.genres || []).includes(state.collectionGenreFilter));
      }

      const sortMode = document.getElementById('collectionSortSelect')?.value || 'default';
      items.sort((a, b) => {
        if (sortMode === 'alpha') return getAnimeDisplayTitle(a).localeCompare(getAnimeDisplayTitle(b));
        if (sortMode === 'alpha_rev') return getAnimeDisplayTitle(b).localeCompare(getAnimeDisplayTitle(a));
        if (sortMode === 'year') return (b.year || 0) - (a.year || 0);
        if (sortMode === 'rating') return parseFloat(b.rating || 0) - parseFloat(a.rating || 0);
        return 0;
      });

      if (!items.length) {
        grid.innerHTML = `<div class="col-span-full py-12 text-center text-xs text-zinc-400 bg-dark-800/60 rounded-2xl border border-white/10">В вашей коллекции пока нет трофеев. Отметьте аниме как «Просмотрено» в каталоге!</div>`;
        return;
      }

      grid.innerHTML = items.map(a => {
        const note = state.collectionNotes[a.id] || '';
        const inShowcase = state.collectionShowcase.includes(a.id);
        const safeJson = JSON.stringify(a).replace(/'/g, '&#39;');
        return `
          <div class="bg-dark-800 border border-white/10 rounded-2xl overflow-hidden flex flex-col relative group">
            <div class="relative aspect-[3/4] bg-dark-900 overflow-hidden">
              <img src="${a.poster}" onerror="this.src='https://placehold.co/300x420/131620/f43f5e?text=TROPHY'" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div class="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-black/80 text-amber-400 text-[11px] font-bold">★ ${a.rating}</div>
              <div class="hanko-stamp absolute bottom-3 right-3 px-1.5 py-1 text-rose-400 bg-black/80 text-[10px] font-black tracking-widest">完</div>
              <button type="button" title="На витрину" onclick="toggleShowcase('${a.id}')" class="absolute top-2 left-2 w-7 h-7 rounded-xl ${inShowcase ? 'bg-amber-500 text-zinc-950' : 'bg-black/80 text-zinc-300 hover:text-white'} flex items-center justify-center text-xs cursor-pointer shadow-md">${CROWN_SVG_ICON}</button>
            </div>
            <div class="p-3 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h4 class="font-display font-bold text-xs text-white line-clamp-1">${getAnimeDisplayTitle(a)}</h4>
                <div class="text-[10px] text-zinc-400">${a.year || '2024'} • ${a.type || 'TV'}</div>
              </div>
              <div class="space-y-1.5 pt-1 border-t border-white/5">
                <p onclick="openNoteModal('${a.id}')" class="text-[11px] text-zinc-300 italic line-clamp-2 cursor-pointer hover:text-brand-300" title="Нажми, чтобы изменить заметку">${note ? `«${note}»` : '+ Добавить рецензию/заметку'}</p>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    function setCollectionGenreFilter(g) {
      state.collectionGenreFilter = g;
      renderUserCollection();
    }

    function getAllKnownAnimeMap() {
      const map = new Map();
      const register = (item) => {
        if (item && item.id && !map.has(item.id)) map.set(item.id, item);
      };
      getCompletedCollectionItems().forEach(register);
      Object.values(state.favorites || {}).forEach(register);
      Object.values(state.myList).forEach(register);
      Object.values(state.watchHistory).forEach(h => register(h?.anime));
      Object.values(state.tierList).forEach(arr => (arr || []).forEach(register));
      (state.catalog || []).forEach(register);
      (state.tierPoolExtra || []).forEach(register);
      (state.showcaseExtraPool || []).forEach(register);
      return map;
    }

    function normalizeShowcaseEntryId(entry) {
      return typeof entry === 'object' && entry !== null ? entry.id : entry;
    }

    function getShowcaseItemsResolved() {
      const map = getAllKnownAnimeMap();
      const resolved = [];
      (state.collectionShowcase || []).forEach(entry => {
        if (typeof entry === 'object' && entry !== null && entry.id) {
          if (!map.has(entry.id)) map.set(entry.id, entry);
          resolved.push(entry);
        } else if (typeof entry === 'string' && map.has(entry)) {
          resolved.push(map.get(entry));
        }
      });
      return resolved.slice(0, 3);
    }

    function isAnimeInShowcase(id) {
      return (state.collectionShowcase || []).some(entry => normalizeShowcaseEntryId(entry) === id);
    }

    function toggleShowcase(id, animeObj = null) {
      const map = getAllKnownAnimeMap();
      const targetAnime = animeObj || map.get(id);
      const existingIdx = (state.collectionShowcase || []).findIndex(entry => normalizeShowcaseEntryId(entry) === id);

      if (existingIdx >= 0) {
        state.collectionShowcase.splice(existingIdx, 1);
        showToast('Тайтл убран с витрины');
      } else {
        if ((state.collectionShowcase || []).length >= 3) {
          showToast('На витрине уже 3 тайтла — сначала освободите один слот');
          return;
        }
        state.collectionShowcase.push(targetAnime || id);
        showToast('Тайтл закреплён на Витрине топов!');
      }
      saveUserScopedData();
      renderUserCollection();
      renderUserShowcase();
    }

    function clearUserShowcase() {
      state.collectionShowcase = [];
      saveUserScopedData();
      renderUserCollection();
      renderUserShowcase();
      showToast('Витрина топов очищена');
    }

    function moveShowcaseSlot(idx, dir) {
      const resolved = getShowcaseItemsResolved();
      const targetIdx = idx + dir;
      if (targetIdx < 0 || targetIdx >= resolved.length) return;
      const temp = resolved[idx];
      resolved[idx] = resolved[targetIdx];
      resolved[targetIdx] = temp;
      state.collectionShowcase = resolved;
      saveUserScopedData();
      renderUserShowcase();
    }

    function renderUserShowcase() {
      const grid = document.getElementById('userShowcaseGrid');
      const countEl = document.getElementById('showcaseFilledCount');
      if (!grid) return;

      const resolved = getShowcaseItemsResolved();
      // Синхронизируем массив с полными объектами, чтобы они никогда не терялись
      state.collectionShowcase = resolved;
      if (countEl) countEl.textContent = String(resolved.length);

      const slots = [0, 1, 2].map(i => resolved[i] || null);

      grid.innerHTML = slots.map((item, idx) => {
        if (!item) {
          return `
            <div
              onclick="document.getElementById('showcaseSearchInput')?.focus()"
              class="p-5 rounded-2xl bg-dark-800/50 hover:bg-dark-800 border border-dashed border-white/15 hover:border-brand-500/50 flex flex-col items-center justify-center text-center space-y-2 min-h-[210px] cursor-pointer transition"
            >
              <div class="w-11 h-11 rounded-2xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-amber-300 text-xs font-black">#${idx + 1}</div>
              <div class="text-xs font-bold text-white">Свободный слот витрины #${idx + 1}</div>
              <div class="text-[11px] text-zinc-400">Выбери любой тайтл из списка ниже или в коллекции</div>
            </div>
          `;
        }
        const safeJson = JSON.stringify(item).replace(/'/g, '&#39;');
        return `
          <div class="p-4 rounded-2xl bg-dark-800 border border-amber-400/40 shadow-xl flex flex-col justify-between gap-3 relative overflow-hidden group">
            <div class="absolute -right-2 -bottom-2 text-5xl font-display font-black text-amber-400 opacity-10 select-none pointer-events-none">#${idx + 1}</div>
            <div class="flex items-start gap-3.5">
              <img
                src="${item.poster}"
                onclick='openAnimePlayer(${safeJson})'
                onerror="this.src='https://placehold.co/240x340/131620/f43f5e?text=TOP'"
                class="w-20 h-28 rounded-xl object-cover shrink-0 shadow-lg border border-white/10 cursor-pointer group-hover:scale-105 transition-transform"
              />
              <div class="min-w-0 flex-1 space-y-1.5">
                <div class="flex items-center justify-between gap-1">
                  <span class="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[10px] font-black">ТОП #${idx + 1}</span>
                  <span class="text-xs font-bold text-amber-400">★ ${item.rating}</span>
                </div>
                <h4 onclick='openAnimePlayer(${safeJson})' class="font-display font-bold text-sm text-white line-clamp-2 hover:text-brand-300 cursor-pointer">${getAnimeDisplayTitle(item)}</h4>
                <div class="text-[11px] text-zinc-400">${item.year || 2024} • ${(item.genres || []).slice(0, 2).join(', ')}</div>
              </div>
            </div>

            <div class="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
              <div class="flex items-center gap-1">
                <button type="button" onclick="moveShowcaseSlot(${idx}, -1)" ${idx === 0 ? 'disabled' : ''} class="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-[10px] font-bold text-zinc-300 cursor-pointer">←</button>
                <button type="button" onclick="moveShowcaseSlot(${idx}, 1)" ${idx >= resolved.length - 1 ? 'disabled' : ''} class="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-[10px] font-bold text-zinc-300 cursor-pointer">→</button>
              </div>
              <div class="flex items-center gap-2">
                <button type="button" onclick='openAnimePlayer(${safeJson})' class="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-[10px] font-bold text-white cursor-pointer">▶ Смотреть</button>
                <button type="button" onclick="toggleShowcase('${item.id}')" class="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-[10px] font-bold text-rose-300 cursor-pointer">Убрать</button>
              </div>
            </div>
          </div>
        `;
      }).join('');

      renderShowcaseCandidatePool(document.getElementById('showcaseSearchInput')?.value || '');
    }

    let showcaseSearchTimer = null;
    function renderShowcaseCandidatePool(query = '') {
      const poolGrid = document.getElementById('showcaseCandidatesGrid');
      if (!poolGrid) return;

      const q = (query || '').trim().toLowerCase();
      const allMap = getAllKnownAnimeMap();
      let list = Array.from(allMap.values());

      if (q) {
        list = list.filter(a => `${a.title} ${a.altTitle || ''} ${(a.genres || []).join(' ')}`.toLowerCase().includes(q));
        clearTimeout(showcaseSearchTimer);
        if (list.length < 4 && q.length >= 2) {
          showcaseSearchTimer = setTimeout(async () => {
            const raw = await fetchAniLibriaJson(`/app/search/releases?query=${encodeURIComponent(q)}`, 4000);
            const found = (Array.isArray(raw) ? raw : (raw?.data || [])).slice(0, 12).map(normalizeRelease);
            if (found.length) {
              state.showcaseExtraPool = found;
              renderShowcaseCandidatePool(query);
            }
          }, 320);
        }
      }

      if (!list.length) {
        poolGrid.innerHTML = `<div class="col-span-full py-6 text-center text-xs text-zinc-500">Тайтлы не найдены — попробуйте другое название</div>`;
        return;
      }

      poolGrid.innerHTML = list.slice(0, 18).map(a => {
        const pinned = isAnimeInShowcase(a.id);
        const safeJson = JSON.stringify(a).replace(/'/g, '&#39;');
        return `
          <button
            type="button"
            onclick='toggleShowcase("${a.id}", ${safeJson})'
            class="group p-2 rounded-xl border text-left transition flex flex-col gap-1.5 cursor-pointer ${pinned ? 'bg-amber-500/15 border-amber-400/60' : 'bg-dark-900 border-white/10 hover:border-brand-500/50'}"
          >
            <div class="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-dark-800">
              <img src="${a.poster}" onerror="this.src='https://placehold.co/200x280/131620/f43f5e?text=TV'" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <span class="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-bold ${pinned ? 'text-amber-300' : 'text-zinc-300'}">
                ${pinned ? 'На витрине ✓' : '+ В топ'}
              </span>
            </div>
            <div class="text-[11px] font-bold text-white truncate w-full">${getAnimeDisplayTitle(a)}</div>
          </button>
        `;
      }).join('');
    }

    let activeNoteAnimeId = null;
    function openNoteModal(id) {
      activeNoteAnimeId = id;
      const modal = document.getElementById('noteModal');
      const textarea = document.getElementById('noteTextarea');
      if (!modal || !textarea) return;
      textarea.value = state.collectionNotes[id] || '';
      modal.classList.remove('hidden');
    }

    function closeNoteModal() {
      const modal = document.getElementById('noteModal');
      if (modal) modal.classList.add('hidden');
      activeNoteAnimeId = null;
    }

    function saveNoteModal() {
      if (!activeNoteAnimeId) return;
      const val = document.getElementById('noteTextarea').value.trim();
      if (!val) delete state.collectionNotes[activeNoteAnimeId];
      else state.collectionNotes[activeNoteAnimeId] = val;
      saveUserScopedData();
      closeNoteModal();
      renderUserCollection();
      showToast('Заметка сохранена!');
    }

    function exportCollectionPng() {
      const canvas = document.createElement('canvas');
      canvas.width = 900;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      const theme = DESIGN_THEMES[state.siteSettings.seasonTheme] || DESIGN_THEMES.default;

      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, 900, 480);

      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(24, 24, 852, 432, 28);
      ctx.stroke();

      ctx.fillStyle = theme.b400;
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('KITSUNE // ANIME — TROPHY PASSPORT', 56, 72);

      const userName = state.user?.name || 'Гость KITSUNE';
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 38px sans-serif';
      ctx.fillText(userName, 56, 128);

      const items = getCompletedCollectionItems();
      ctx.fillStyle = theme.b300;
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`Собрано трофеев в коллекции: ${items.length}`, 56, 162);

      const showcaseItems = state.collectionShowcase.map(id => items.find(x => x.id === id)).filter(Boolean);
      ctx.fillStyle = '#a1a1aa';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('ВИТРИНА ТОП-3:', 56, 220);

      ctx.fillStyle = '#f4f4f5';
      ctx.font = '600 16px sans-serif';
      const showcaseText = showcaseItems.length ? showcaseItems.map(x => getAnimeDisplayTitle(x)).join('   •   ') : 'Витрина пуста';
      ctx.fillText(showcaseText.slice(0, 75), 56, 252);

      const link = document.createElement('a');
      link.download = `kitsune-trophies-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('Паспорт коллекции сохранен в PNG!');
    }

    // --- ШАПКА, ПОИСК, КАТАЛОГ, ПЛЕЕР, ТИР-ЛИСТ, ТЕМЫ И АККАУНТЫ ---
    function toggleHeaderMiniMenu(e) {
      e.stopPropagation();
      const dd = document.getElementById('headerMiniMenuDropdown');
      const btn = document.getElementById('headerMiniMenuBtn');
      const themeDd = document.getElementById('themeMiniMenuDropdown');
      if (themeDd) themeDd.classList.add('hidden');
      if (dd) {
        const opened = !dd.classList.toggle('hidden');
        if (btn) btn.classList.toggle('gear-open', opened);
      }
    }

    function closeHeaderMiniMenu() {
      const dd = document.getElementById('headerMiniMenuDropdown');
      const btn = document.getElementById('headerMiniMenuBtn');
      if (dd) dd.classList.add('hidden');
      if (btn) btn.classList.remove('gear-open');
    }

    function toggleThemeMiniMenu(e) {
      e.stopPropagation();
      closeHeaderMiniMenu();
      const dd = document.getElementById('themeMiniMenuDropdown');
      if (dd) dd.classList.toggle('hidden');
    }

    document.addEventListener('click', (e) => {
      const menu = document.getElementById('headerMiniMenuDropdown');
      const btn = document.getElementById('headerMiniMenuBtn');
      if (menu && !menu.contains(e.target) && btn && !btn.contains(e.target)) closeHeaderMiniMenu();
      const tMenu = document.getElementById('themeMiniMenuDropdown');
      const tBtn = document.getElementById('themeQuickBtn');
      if (tMenu && !tMenu.contains(e.target) && tBtn && !tBtn.contains(e.target)) tMenu.classList.add('hidden');
      const omiPop = document.getElementById('omikujiPopoverCard');
      const omiBtn = document.getElementById('kitsuneOmikujiBtn');
      if (omiPop && !omiPop.contains(e.target) && omiBtn && !omiBtn.contains(e.target)) omiPop.classList.add('hidden');
      const searchDd = document.getElementById('liveSearchDropdown');
      const searchInput = document.getElementById('searchInput');
      if (searchDd && !searchDd.contains(e.target) && e.target !== searchInput) searchDd.classList.add('hidden');
    });

    // --- СФЕРА ОМИКУДЗИ И ТАЙТЛ-ХРАНИТЕЛЬ ДНЯ (СЛЕВА ОТ ЛОГОТИПА) ---
    const OMIKUJI_FORTUNES = [
      { kanji: '大吉', title: 'Дай-кити // Великая удача', text: '«Сегодня любая включённая первая серия затянет минимум на полсезона. Идеальный час для эпичного экшена!»' },
      { kanji: '中吉', title: 'Тю-кити // Огненный кураж', text: '«Резонанс вкуса на максимуме: обрати внимание на тайтлы с рейтингом выше 9.0 — сегодня среди них твой новый фаворит.»' },
      { kanji: '小吉', title: 'Сё-кити // Уютный дзен', text: '«Звёзды Киото советуют заварить горячий чай и выбрать атмосферное фэнтези или детектив с глубоким сюжетом.»' },
      { kanji: '極吉', title: 'Кёку-кити // Ранг Монарха', text: '«Редкий свиток S-ранга! Сегодняшний вечер создан для легендарных битв и саундтреков до мурашек.»' },
      { kanji: '縁吉', title: 'Эн-кити // Нить судьбы', text: '«Случайный выбор сегодня точнее любого расчёта. Доверься рекомендации хранителя и открой новую вселенную!»' }
    ];

    function toggleOmikujiPopover(e) {
      if (e) e.stopPropagation();
      const pop = document.getElementById('omikujiPopoverCard');
      if (!pop) return;
      const willOpen = pop.classList.contains('hidden');
      pop.classList.toggle('hidden');
      if (willOpen && !state.currentOmikujiPick) {
        rollNewOmikujiFortune();
      }
    }

    function rollNewOmikujiFortune() {
      const pool = state.catalog.length ? state.catalog : FALLBACK_CATALOG;
      const fortune = OMIKUJI_FORTUNES[Math.floor(Math.random() * OMIKUJI_FORTUNES.length)];
      const pick = pool[Math.floor(Math.random() * pool.length)] || FALLBACK_CATALOG[0];
      state.currentOmikujiPick = pick;

      const orbKanji = document.getElementById('omikujiOrbRankKanji');
      const mainTitle = document.getElementById('omikujiMainTitle');
      const seal = document.getElementById('omikujiPopSeal');
      const luckTitle = document.getElementById('omikujiPopLuckTitle');
      const prophecy = document.getElementById('omikujiPopProphecy');
      const guardianBox = document.getElementById('omikujiGuardianAnimeBox');

      if (orbKanji) orbKanji.textContent = fortune.kanji.slice(0, 1);
      if (mainTitle) mainTitle.textContent = fortune.title.split('//')[1]?.trim() || 'Свиток удачи';
      if (seal) seal.textContent = fortune.kanji;
      if (luckTitle) luckTitle.textContent = fortune.title;
      if (prophecy) prophecy.textContent = fortune.text;

      if (guardianBox && pick) {
        const safeJson = JSON.stringify(pick).replace(/'/g, '&#39;');
        guardianBox.onclick = () => {
          document.getElementById('omikujiPopoverCard')?.classList.add('hidden');
          openAnimePlayer(pick);
        };
        guardianBox.innerHTML = `
          <img src="${pick.poster}" onerror="this.src='https://placehold.co/100x140/131620/f43f5e?text=TV'" class="w-12 h-16 rounded-xl object-cover shrink-0 shadow-md group-hover:scale-105 transition-transform" />
          <div class="min-w-0 flex-1 space-y-0.5">
            <div class="text-xs font-display font-bold text-white truncate group-hover:text-brand-300">${getAnimeDisplayTitle(pick)}</div>
            <div class="text-[11px] text-amber-400 font-bold">★ ${pick.rating} • ${pick.year} • ${pick.episodes} эп.</div>
            <div class="text-[10px] text-zinc-400 truncate">${(pick.genres || []).slice(0, 2).join(' • ')}</div>
          </div>
          <span class="px-2.5 py-1.5 rounded-xl bg-brand-600 group-hover:bg-brand-500 text-white text-[11px] font-bold shrink-0">▶</span>
        `;
      }
    }

    function startHeroSlider() {
      clearInterval(state.heroTimer);
      state.heroTimer = setInterval(() => {
        if (state.heroPaused || state.activePage !== 'home') return;
        const slides = state.catalog.slice(0, 5);
        if (!slides.length) return;
        state.heroIndex = (state.heroIndex + 1) % slides.length;
        updateHeroBanner(slides[state.heroIndex]);
      }, 6500);
    }

    function selectHeroSlide(idx) {
      const slides = state.catalog.slice(0, 5);
      if (!slides[idx]) return;
      state.heroIndex = idx;
      updateHeroBanner(slides[idx]);
    }

    function updateHeroBanner(anime) {
      if (!anime) return;
      state.heroAnime = anime;
      const bg = document.getElementById('heroPosterBg');
      const ambientPoster = document.getElementById('ambientPosterBlur');
      const title = document.getElementById('heroTitle');
      const desc = document.getElementById('heroDesc');
      const rating = document.getElementById('heroRatingBadge');
      const dots = document.getElementById('heroDotsBar');

      if (bg) bg.src = anime.poster;
      if (ambientPoster && anime.poster) ambientPoster.src = anime.poster;
      if (title) title.textContent = getAnimeDisplayTitle(anime);
      if (desc) desc.textContent = anime.desc;
      if (rating) {
        rating.innerHTML = `<svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><span>${anime.rating}</span>`;
      }
      if (dots) {
        const slides = state.catalog.slice(0, 5);
        dots.innerHTML = slides.map((_, idx) => `
          <button
            type="button"
            onclick="selectHeroSlide(${idx})"
            class="h-1.5 rounded-full transition-all cursor-pointer ${idx === state.heroIndex ? 'w-8 bg-brand-500' : 'w-2.5 bg-white/25 hover:bg-white/50'}"
          ></button>
        `).join('');
      }
    }

    function openHeroAnime() {
      openAnimePlayer(state.heroAnime || state.catalog[0]);
    }

    function normalizeRelease(r) {
      const posterPath = r.poster?.optimized?.src || r.poster?.src || '';
      const posterUrl = posterPath
        ? (posterPath.startsWith('http') ? posterPath : `https://anilibria.top${posterPath}`)
        : 'https://placehold.co/400x560/131620/f43f5e?text=KITSUNE';

      const genres = Array.isArray(r.genres)
        ? r.genres.map(g => (typeof g === 'string' ? g : g.name)).filter(Boolean)
        : ['Аниме'];

      return {
        id: `al_${r.id}`,
        releaseId: r.id,
        alias: r.alias || '',
        title: r.name?.main || 'Без названия',
        altTitle: r.name?.english || '',
        year: r.year || 2024,
        type: r.type?.description || r.type?.value || 'TV',
        episodes: r.episodes_total || r.latest_episode?.ordinal || 12,
        rating: (8.2 + ((r.id || 1) % 15) * 0.1).toFixed(1),
        genres: genres.length ? genres : ['Экшен'],
        poster: posterUrl,
        desc: r.description || 'Описание загружается из базы AniLibria...',
        isOngoing: Boolean(r.is_ongoing)
      };
    }

    async function fetchAniLibriaCatalog(page = 1, append = false) {
      if (state.isFetchingMore) return;
      state.isFetchingMore = true;

      const spinner = document.getElementById('catalogSpinner');
      const statusTxt = document.getElementById('catalogStatusText');
      if (spinner) spinner.classList.remove('hidden');
      if (statusTxt) statusTxt.textContent = `Загружаем страницу ${page}...`;

      const newlyAdded = [];
      try {
        const data = await fetchAniLibriaJson(`/anime/catalog/releases?page=${page}&limit=15`, 5000);
        if (data) {
          const items = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
          const normalized = items.map(normalizeRelease);
          if (normalized.length > 0) {
            if (append) {
              const existingIds = new Set(state.catalog.map(x => x.id));
              normalized.forEach(item => {
                if (!existingIds.has(item.id)) {
                  state.catalog.push(item);
                  newlyAdded.push(item);
                }
              });
            } else {
              state.catalog = normalized;
              updateHeroBanner(normalized[0]);
            }
            state.loadedPage = page;
            state.hasMorePages = normalized.length >= 10;
          } else {
            state.hasMorePages = false;
          }
        } else {
          state.hasMorePages = false;
        }
      } catch (e) {
        state.hasMorePages = false;
      }

      state.isFetchingMore = false;
      if (spinner) spinner.classList.add('hidden');
      if (statusTxt) {
        statusTxt.textContent = state.hasMorePages
          ? `Загружено релизов: ${state.catalog.length} • Листайте ниже для подгрузки`
          : `В каталоге показано ${state.catalog.length} релизов`;
      }
      populateGenreSelect();

      // Если это автоподгрузка при скролле в обычной ленте — добавляем ТОЛЬКО новые карточки без пересборки DOM!
      if (append && newlyAdded.length > 0 && state.feedTab === 'popular' && !state.selectedGenre) {
        appendCatalogCards(newlyAdded);
      } else if (!append || newlyAdded.length > 0) {
        renderCatalogGrid();
      }
    }

    function populateGenreSelect() {
      const sel = document.getElementById('genreFilterSelect');
      if (!sel) return;
      const current = sel.value;
      const set = new Set();
      state.catalog.forEach(a => (a.genres || []).forEach(g => set.add(g)));
      sel.innerHTML = `<option value="">Все жанры</option>` +
        Array.from(set).sort().map(g => `<option value="${g}">${g}</option>`).join('');
      sel.value = current;
    }

    function switchFeedTab(tab) {
      state.feedTab = tab;
      document.querySelectorAll('.feed-tab').forEach(btn => {
        btn.classList.remove('bg-brand-600', 'text-white', 'font-bold');
        btn.classList.add('text-zinc-400', 'font-semibold');
      });
      const active = document.getElementById(`tab-${tab}`);
      if (active) {
        active.classList.add('bg-brand-600', 'text-white', 'font-bold');
        active.classList.remove('text-zinc-400', 'font-semibold');
      }
      const subBar = document.getElementById('myListSubfilters');
      if (subBar) subBar.classList.toggle('hidden', tab !== 'mylist');
      renderCatalogGrid();
    }

    function setMyListSubfilter(sub) {
      state.myListSubfilter = sub;
      document.querySelectorAll('.mylist-sub-btn').forEach(btn => {
        const active = btn.getAttribute('data-list-sub') === sub;
        btn.classList.toggle('bg-brand-600', active);
        btn.classList.toggle('text-white', active);
        btn.classList.toggle('font-bold', active);
        btn.classList.toggle('bg-white/5', !active);
        btn.classList.toggle('text-zinc-300', !active);
      });
      renderCatalogGrid();
    }

    function applyGenreFilter(genre) {
      state.selectedGenre = genre;
      renderCatalogGrid();
    }

    const BOOKMARK_STATUS_SVGS = {
      watching: `<svg class="w-3.5 h-3.5 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
      planned: `<svg class="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
      completed: `<svg class="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
      '': `<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`
    };

    function cycleCardBookmark(e, anime) {
      e.stopPropagation();
      const order = ['', 'watching', 'planned', 'completed'];
      const labels = {
        '': 'Удалено из списка',
        watching: 'Добавлено в «Смотрю»',
        planned: 'Добавлено в «В планах»',
        completed: 'Добавлено в Коллекцию трофеев!'
      };
      const cur = state.myList[anime.id]?.userStatus || '';
      const next = order[(order.indexOf(cur) + 1) % order.length];
      if (!next) delete state.myList[anime.id];
      else state.myList[anime.id] = { ...anime, userStatus: next, addedAt: Date.now() };
      saveUserScopedData();
      syncMyListBadge();

      if (state.feedTab === 'mylist') {
        renderCatalogGrid();
      } else {
        const btn = e.currentTarget;
        if (btn) btn.innerHTML = BOOKMARK_STATUS_SVGS[next] || BOOKMARK_STATUS_SVGS[''];
      }
      showToast(labels[next]);
    }

    function handleCardTilt(e, card) {
      // Отключено избыточное 3D-вращение на каждый пиксель мыши ради стабильных 60 FPS без лагов
    }

    function resetCardTilt(card) {
      if (card && card.style.transform) card.style.transform = '';
    }

    function buildAnimeCardHtml(anime, idx, sTierIds) {
      const savedStatus = state.myList[anime.id]?.userStatus || '';
      const statusIcon = BOOKMARK_STATUS_SVGS[savedStatus] || BOOKMARK_STATUS_SVGS[''];
      const isFav = isAnimeFavorite(anime.id);
      const hist = state.watchHistory[anime.id];
      const progressPct = hist ? Math.min(100, Math.round(((hist.time || 0) / (hist.duration || 1440)) * 100)) : 0;
      const isCompleted = savedStatus === 'completed';
      const isSTier = sTierIds.has(anime.id);
      const safeJson = JSON.stringify(anime).replace(/'/g, '&#39;');

      return `
        <article
          data-anime-id="${anime.id}"
          onclick='openAnimePlayer(${safeJson})'
          onmousemove="handleCardTilt(event, this)"
          onmouseleave="resetCardTilt(this)"
          style="--stagger: ${Math.min((idx % 15) * 18, 220)}ms"
          class="anime-card group bg-dark-900 border border-white/10 rounded-2xl overflow-hidden cursor-pointer flex flex-col relative"
        >
          <div class="relative aspect-[3/4] bg-dark-800 overflow-hidden">
            <img
              src="${anime.poster}"
              onerror="this.src='https://placehold.co/400x560/131620/f43f5e?text=KITSUNE'"
              alt="${getAnimeDisplayTitle(anime)}"
              loading="lazy"
              decoding="async"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div class="card-glare pointer-events-none absolute inset-0"></div>

            <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
              <button
                type="button"
                title="Сменить статус в списке / В коллекцию"
                onclick='cycleCardBookmark(event, ${safeJson})'
                class="w-7 h-7 rounded-xl bg-black/80 hover:bg-brand-600 border border-white/15 text-white flex items-center justify-center transition cursor-pointer"
              >
                ${statusIcon}
              </button>
              <button
                type="button"
                data-fav-btn="${anime.id}"
                title="Добавить в Избранное"
                onclick='toggleFavoriteAnime(event, ${safeJson})'
                class="w-7 h-7 rounded-xl ${isFav ? 'bg-rose-500/85 border-rose-400' : 'bg-black/80 hover:bg-rose-500/60 border-white/15'} border text-white flex items-center justify-center text-xs transition cursor-pointer"
              >${isFav ? HEART_SVG_FILLED : HEART_SVG_OUTLINE}</button>
            </div>

            <div class="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/75 text-amber-400 text-[11px] font-bold">
              <span>★ ${anime.rating}</span>
            </div>

            ${isSTier ? `<div class="hanko-stamp absolute bottom-10 right-2.5 px-1 py-1 text-amber-300 bg-black/75 text-xs font-black tracking-widest">神</div>` : ''}
            ${isCompleted ? `<div class="hanko-stamp absolute bottom-10 left-2.5 px-1 py-1 text-rose-400 bg-black/75 text-xs font-black tracking-widest">完</div>` : ''}

            <div class="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between text-[11px] font-semibold text-white">
              <span class="px-2 py-0.5 rounded-md bg-black/75">${hist ? `Серия ${hist.episode}` : `${anime.type} • ${anime.year}`}</span>
              <span class="px-2 py-0.5 rounded-md bg-brand-600/90">${anime.episodes} эп.</span>
            </div>

            ${hist ? `<div class="absolute bottom-0 inset-x-0 h-1 bg-white/15"><div class="h-full bg-brand-500" style="width:${progressPct}%"></div></div>` : ''}
          </div>
          <div class="p-3.5 flex-1 flex flex-col justify-between space-y-1.5">
            <h3 class="font-display font-bold text-xs sm:text-sm text-white line-clamp-2 group-hover:text-brand-400 transition-colors">
              ${getAnimeDisplayTitle(anime)}
            </h3>
            <div class="text-[11px] text-zinc-400 truncate">
              ${(anime.genres || []).slice(0, 2).join(' • ')}
            </div>
          </div>
        </article>
      `;
    }

    function appendCatalogCards(newItems) {
      const grid = document.getElementById('animeCatalogGrid');
      if (!grid || !newItems.length) return;
      const sTierIds = new Set((state.tierList.S || []).map(x => x.id));
      const fragmentHtml = newItems.map((anime, idx) => buildAnimeCardHtml(anime, idx, sTierIds)).join('');
      grid.insertAdjacentHTML('beforeend', fragmentHtml);
    }

    function renderCatalogGrid() {
      const grid = document.getElementById('animeCatalogGrid');
      if (!grid) return;

      let list = [...state.catalog];
      if (state.feedTab === 'ongoing') {
        list = list.filter(a => a.isOngoing);
      } else if (state.feedTab === 'top') {
        list.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
      } else if (state.feedTab === 'mylist') {
        list = Object.values(state.myList);
        if (state.myListSubfilter !== 'all') {
          list = list.filter(a => a.userStatus === state.myListSubfilter);
        }
      }

      if (state.selectedGenre) {
        list = list.filter(a => (a.genres || []).includes(state.selectedGenre));
      }

      if (list.length === 0) {
        grid.innerHTML = `<div class="col-span-full py-12 text-center text-sm text-zinc-400 bg-dark-900 rounded-3xl border border-white/10">Список пуст. Нажми «+» на любой карточке каталога, чтобы добавить аниме в закладки или коллекцию!</div>`;
        return;
      }

      const sTierIds = new Set((state.tierList.S || []).map(x => x.id));
      grid.innerHTML = list.map((anime, idx) => buildAnimeCardHtml(anime, idx, sTierIds)).join('');
    }

    let searchDebounceTimer = null;
    function highlightSearchMatch(text, query) {
      if (!text || !query) return text || '';
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark class="bg-brand-500/35 text-brand-200 px-1 rounded font-extrabold">$1</mark>');
    }

    function handleSearchInput(query) {
      const q = (query || '').trim();
      const clearBtn = document.getElementById('clearSearchBtn');
      const hotkeyHint = document.getElementById('searchHotkeyHint');
      const dd = document.getElementById('liveSearchDropdown');
      if (clearBtn) clearBtn.classList.toggle('hidden', !q);
      if (hotkeyHint) hotkeyHint.classList.toggle('md:inline-flex', !q);
      if (hotkeyHint && q) hotkeyHint.classList.add('hidden');
      if (!q) {
        if (dd) dd.classList.add('hidden');
        return;
      }

      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(async () => {
        if (!dd) return;
        dd.classList.remove('hidden');

        // Сначала мгновенно ищем совпадения в локальном каталоге, чтобы ответ появлялся без задержки
        const qLower = q.toLowerCase();
        const localMatches = state.catalog.filter(a =>
          `${a.title} ${a.altTitle || ''} ${(a.genres || []).join(' ')}`.toLowerCase().includes(qLower)
        );

        dd.innerHTML = `
          <div class="p-4 flex items-center gap-3 text-xs sm:text-sm text-zinc-300 bg-[#0c0f17]">
            <div class="w-4 h-4 rounded-full border-2 border-brand-500 border-t-transparent animate-spin shrink-0"></div>
            <span>Ищем <b>«${q}»</b> по всей базе релизов AniLibria...</span>
          </div>
        `;

        try {
          const raw = await fetchAniLibriaJson(`/app/search/releases?query=${encodeURIComponent(q)}`, 4500);
          const apiList = (Array.isArray(raw) ? raw : (raw?.data || [])).slice(0, 10).map(normalizeRelease);

          const merged = [];
          const seen = new Set();
          [...apiList, ...localMatches].forEach(item => {
            if (item && !seen.has(item.id)) {
              seen.add(item.id);
              merged.push(item);
            }
          });

          if (!merged.length) {
            dd.innerHTML = `
              <div class="p-6 text-center space-y-2 bg-[#0c0f17]">
                <div class="text-sm font-bold text-white">Ничего не найдено по запросу «${q}»</div>
                <div class="text-xs text-zinc-400">Попробуйте ввести другое слово или часть названия на русском / английском</div>
              </div>
            `;
            return;
          }

          dd.innerHTML = `
            <div class="px-4 py-3 bg-[#121726] flex items-center justify-between">
              <span class="text-xs font-extrabold uppercase tracking-wider text-brand-300">Найдено совпадений: ${merged.length}</span>
              <span class="text-[11px] text-zinc-400">Колесико мыши для прокрутки</span>
            </div>
            <div class="bg-[#0c0f17] space-y-1 p-2">
              ${merged.slice(0, 8).map((a, idx) => {
                const safeJson = JSON.stringify(a).replace(/'/g, '&#39;');
                const isFav = isAnimeFavorite(a.id);
                const isTopMatch = idx === 0;
                const highlightedTitle = highlightSearchMatch(getAnimeDisplayTitle(a), q);
                return `
                  <div
                    onclick='openAnimePlayer(${safeJson}); document.getElementById("liveSearchDropdown").classList.add("hidden");'
                    class="group flex items-start gap-4 p-3.5 rounded-2xl hover:bg-[#181f33] transition cursor-pointer ${isTopMatch ? 'bg-[#141a2b]' : 'bg-[#0f131f]'}"
                  >
                    <div class="relative w-16 h-24 sm:w-20 sm:h-28 rounded-2xl overflow-hidden shrink-0 shadow-lg bg-dark-800">
                      <img src="${a.poster}" onerror="this.src='https://placehold.co/160x220/131620/f43f5e?text=TV'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <span class="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/85 text-amber-300 text-[11px] font-black shadow">
                        ★ ${a.rating}
                      </span>
                    </div>

                    <div class="min-w-0 flex-1 space-y-1.5">
                      <div class="flex flex-wrap items-center gap-1.5">
                        ${isTopMatch ? `<span class="px-2 py-0.5 rounded-md bg-brand-600 text-white text-[10px] font-black uppercase tracking-wider">Лучшее совпадение</span>` : ''}
                        <span class="px-2 py-0.5 rounded-md bg-[#1c2336] text-zinc-200 text-[11px] font-bold">${a.year} • ${a.type}</span>
                        <span class="px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-300 text-[11px] font-bold">${a.episodes} эп.</span>
                      </div>

                      <div class="font-display font-extrabold text-sm sm:text-base text-white group-hover:text-brand-300 leading-snug">
                        ${highlightedTitle}
                      </div>

                      <div class="flex flex-wrap gap-1">
                        ${(a.genres || []).slice(0, 3).map(g => `<span class="px-2 py-0.5 rounded-md bg-[#181e2e] text-[11px] text-zinc-300 font-medium">${g}</span>`).join('')}
                      </div>

                      <p class="text-xs text-zinc-400 line-clamp-2 leading-relaxed">${a.desc || ''}</p>
                    </div>

                    <div class="flex flex-col items-end gap-2 shrink-0 self-center">
                      <button
                        type="button"
                        data-fav-btn="${a.id}"
                        title="В избранное"
                        onclick='toggleFavoriteAnime(event, ${safeJson})'
                        class="w-9 h-9 rounded-xl ${isFav ? 'bg-rose-500/85 text-white' : 'bg-[#1c2336] hover:bg-rose-500/30 text-zinc-200'} flex items-center justify-center text-sm transition cursor-pointer"
                      >${isFav ? HEART_SVG_FILLED : HEART_SVG_OUTLINE}</button>
                      <span class="px-3 py-1.5 rounded-xl bg-brand-600 group-hover:bg-brand-500 text-white text-xs font-bold shadow-md">
                        ▶ Смотреть
                      </span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `;
        } catch (e) {
          dd.innerHTML = `<div class="p-4 text-xs text-rose-400 bg-[#0c0f17]">Ошибка соединения с API</div>`;
        }
      }, 240);
    }

    function clearSearch() {
      const inp = document.getElementById('searchInput');
      const dd = document.getElementById('liveSearchDropdown');
      const btn = document.getElementById('clearSearchBtn');
      const hotkeyHint = document.getElementById('searchHotkeyHint');
      if (inp) inp.value = '';
      if (dd) dd.classList.add('hidden');
      if (btn) btn.classList.add('hidden');
      if (hotkeyHint) {
        hotkeyHint.classList.remove('hidden');
        hotkeyHint.classList.add('md:inline-flex');
      }
    }

    // Быстрый фокус в строку поиска по клавише «/»
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        const modal = document.getElementById('playerModal');
        if (modal && !modal.classList.contains('hidden')) return;
        e.preventDefault();
        const inp = document.getElementById('searchInput');
        if (inp) {
          inp.focus();
          inp.select();
        }
      }
    });

    function syncModalShowcasePinBtn() {
      const txt = document.getElementById('modalShowcasePinText');
      const btn = document.getElementById('modalShowcasePinBtn');
      if (!txt || !btn || !state.currentAnime) return;
      const pinned = isAnimeInShowcase(state.currentAnime.id);
      txt.textContent = pinned ? 'На витрине Топ-3 ✓' : 'На витрину Топ-3';
      btn.className = pinned
        ? 'w-full py-2 px-3 rounded-xl bg-amber-500 text-zinc-950 text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg'
        : 'w-full py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-300 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5';
    }

    function populateModalRichDetails(anime, fullApiData = null) {
      if (!anime) return;
      const posterEl = document.getElementById('modalAnimePoster');
      const posterRating = document.getElementById('modalPosterRatingBadge');
      const posterOngoing = document.getElementById('modalPosterOngoingBadge');
      const fullTitleEl = document.getElementById('modalFullTitle');
      const altTitleEl = document.getElementById('modalAltTitle');
      const typeBadge = document.getElementById('modalTypeBadge');
      const seasonYearBadge = document.getElementById('modalSeasonYearBadge');
      const ageBadge = document.getElementById('modalAgeRatingBadge');
      const genresRow = document.getElementById('modalGenresRow');

      const specStatus = document.getElementById('specReleaseStatus');
      const specEps = document.getElementById('specEpisodesCount');
      const specSeason = document.getElementById('specSeasonYear');
      const specStudio = document.getElementById('specVoiceStudio');

      const seasonDesc = fullApiData?.season?.description || '';
      const ageLabel = fullApiData?.age_rating?.label || '16+';
      const epDuration = fullApiData?.average_duration_of_episode || 24;
      const isOngoing = Boolean(fullApiData?.is_ongoing ?? anime.isOngoing);
      const totalEps = fullApiData?.episodes_total || anime.episodes || 12;

      if (posterEl) posterEl.src = anime.poster;
      if (posterRating) posterRating.textContent = `★ ${anime.rating}`;
      if (posterOngoing) posterOngoing.classList.toggle('hidden', !isOngoing);

      if (fullTitleEl) fullTitleEl.textContent = getAnimeDisplayTitle(anime);
      if (altTitleEl) {
        const orig = fullApiData?.name?.english || fullApiData?.name?.alternative || anime.altTitle || anime.alias || '';
        altTitleEl.textContent = orig;
      }
      if (typeBadge) typeBadge.textContent = fullApiData?.type?.description || anime.type || 'TV СЕРИАЛ';
      if (seasonYearBadge) seasonYearBadge.textContent = `${seasonDesc ? seasonDesc + ' ' : ''}${anime.year || 2024}`;
      if (ageBadge) ageBadge.textContent = ageLabel;

      if (genresRow) {
        genresRow.innerHTML = (anime.genres || []).map(g => {
          const safeG = g.replace(/'/g, "\\'");
          return `
            <button
              type="button"
              onclick="closePlayerModal(); navigateTo('home'); applyGenreFilter('${safeG}');"
              class="px-3 py-1 rounded-xl bg-brand-500/15 hover:bg-brand-600 border border-brand-500/30 text-brand-300 hover:text-white text-xs font-bold transition cursor-pointer"
            >${g}</button>
          `;
        }).join('');
      }

      if (specStatus) {
        specStatus.textContent = isOngoing ? 'Онгоинг (выходит)' : 'Завершён (все серии)';
        specStatus.className = isOngoing ? 'text-xs font-bold text-emerald-400 mt-0.5' : 'text-xs font-bold text-sky-400 mt-0.5';
      }
      if (specEps) specEps.textContent = `${totalEps} эп. (~${epDuration} мин)`;
      if (specSeason) specSeason.textContent = `${seasonDesc || 'Сезон'} ${anime.year || 2024}`;
      if (specStudio) specStudio.textContent = 'AniLibria • 1080p HLS';

      syncModalShowcasePinBtn();
      renderModalSimilarAnime(anime);
    }

    function cleanRootTitleForFranchise(title = '') {
      return (title || '')
        .replace(/\s*[\(\[][^\)\]]*[\)\]]/g, '')
        .replace(/\s*(?:[:\-–—]?\s*(?:\d+\s*сезон|сезон\s*\d+|часть\s*\d+|part\s*\d+|2nd\s*season|3rd\s*season|4th\s*season|5th\s*season|season\s*\d+|фильм|movie|ova|ona|спешл|special|ТВ-\d+|tv-\d+|cour\s*\d+)).*$/i, '')
        .replace(/\s+(?:II|III|IV|V|\d+)$/i, '')
        .replace(/[:\-–—]\s*$/, '')
        .trim();
    }

    function isSameFranchiseStrict(baseAnime, candidateAnime) {
      if (!baseAnime || !candidateAnime) return false;
      if (baseAnime.id === candidateAnime.id) return true;
      if (baseAnime.releaseId && candidateAnime.releaseId && baseAnime.releaseId === candidateAnime.releaseId) return true;

      // 1. Проверка по базовому слaгу alias (например: kusuriya-no-hitorigoto и kusuriya-no-hitorigoto-2nd-season)
      const cleanAlias = (al = '') => al
        .toLowerCase()
        .replace(/-(?:season-\d+|\d+nd-season|\d+rd-season|\d+th-season|part-\d+|movie|ova|special|hen|arc|2|3|4)$/g, '')
        .trim();

      if (baseAnime.alias && candidateAnime.alias) {
        const a1 = cleanAlias(baseAnime.alias);
        const a2 = cleanAlias(candidateAnime.alias);
        if (a1.length >= 6 && (a1 === a2 || candidateAnime.alias.startsWith(a1 + '-') || baseAnime.alias.startsWith(a2 + '-'))) {
          return true;
        }
      }

      // 2. Строгая проверка по очищенному корню русского и английского названия
      const r1 = cleanRootTitleForFranchise(baseAnime.title).toLowerCase();
      const r2 = cleanRootTitleForFranchise(candidateAnime.title).toLowerCase();
      if (r1.length >= 5 && r2.length >= 5) {
        if (r1 === r2) return true;
        // Допускаем подзаголовок через двоеточие (например: «Клинок, рассекающий демонов: ...»)
        const colon1 = r1.split(':')[0].trim();
        const colon2 = r2.split(':')[0].trim();
        if (colon1.length >= 7 && colon1 === colon2) return true;
      }

      const e1 = cleanRootTitleForFranchise(baseAnime.altTitle || '').toLowerCase();
      const e2 = cleanRootTitleForFranchise(candidateAnime.altTitle || '').toLowerCase();
      if (e1.length >= 5 && e2.length >= 5) {
        if (e1 === e2) return true;
        const ec1 = e1.split(':')[0].trim();
        const ec2 = e2.split(':')[0].trim();
        if (ec1.length >= 7 && ec1 === ec2) return true;
      }

      return false;
    }

    async function loadAndRenderFranchiseSeasons(anime, fullApiData = null) {
      const grid = document.getElementById('modalFranchiseGrid');
      const countBadge = document.getElementById('modalFranchiseCountBadge');
      if (!grid || !anime) return;

      const franchiseMap = new Map();
      const addCandidate = (item, sortOrder = null, relationNote = '') => {
        if (!item) return;
        const key = item.releaseId ? `rel_${item.releaseId}` : item.id;
        if (!key) return;
        const existing = franchiseMap.get(key);
        const merged = {
          ...(existing || {}),
          ...item,
          sortOrder: sortOrder ?? existing?.sortOrder ?? null,
          relationNote: relationNote || existing?.relationNote || ''
        };
        franchiseMap.set(key, merged);
      };

      // 1. Сначала добавляем сам открытый релиз и строго совпадающие сезоны из локального каталога
      addCandidate(anime, null, '');
      [...state.catalog, ...FALLBACK_CATALOG].forEach(item => {
        if (isSameFranchiseStrict(anime, item)) {
          addCandidate(item, null, '');
        }
      });

      const renderSeasonsDom = () => {
        const seasonsList = Array.from(franchiseMap.values()).sort((a, b) => {
          if (a.sortOrder !== null && b.sortOrder !== null && a.sortOrder !== b.sortOrder) {
            return a.sortOrder - b.sortOrder;
          }
          if ((a.year || 0) !== (b.year || 0)) {
            return (a.year || 2024) - (b.year || 2024);
          }
          return (a.releaseId || 0) - (b.releaseId || 0);
        });

        if (countBadge) {
          countBadge.textContent = seasonsList.length > 1
            ? `Частей во франшизе: ${seasonsList.length}`
            : 'Единственный сезон';
        }

        grid.innerHTML = seasonsList.map((item, idx) => {
          const isCurrent =
            item.id === anime.id ||
            (item.releaseId && anime.releaseId && Number(item.releaseId) === Number(anime.releaseId));
          const safeJson = JSON.stringify(item).replace(/'/g, '&#39;');
          const orderBadge = item.relationNote || (item.type && /фильм|movie/i.test(item.type) ? 'Фильм' : `Сезон #${idx + 1}`);
          return `
            <div
              onclick='${isCurrent ? '' : `openAnimePlayer(${safeJson})`}'
              class="p-3 rounded-2xl border transition flex items-center gap-3.5 ${isCurrent ? 'bg-brand-600/20 border-brand-500 ring-1 ring-brand-500/40 cursor-default' : 'bg-dark-800/90 hover:bg-dark-800 border-white/10 hover:border-brand-500/60 cursor-pointer group'}"
            >
              <div class="relative w-14 h-20 rounded-xl overflow-hidden shrink-0 bg-dark-900 border border-white/10 shadow-md">
                <img src="${item.poster}" onerror="this.src='https://placehold.co/120x170/131620/f43f5e?text=S${idx + 1}'" class="w-full h-full object-cover ${isCurrent ? '' : 'group-hover:scale-105 transition-transform'}" />
                <span class="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-black/85 text-[9px] font-black text-amber-300">#${idx + 1}</span>
              </div>
              <div class="min-w-0 flex-1 space-y-1">
                <div class="flex flex-wrap items-center gap-1.5">
                  <span class="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${isCurrent ? 'bg-brand-600 text-white' : 'bg-white/10 text-zinc-300'}">
                    ${isCurrent ? '▶ Смотрите сейчас' : orderBadge}
                  </span>
                  <span class="text-[10px] font-bold text-amber-400">★ ${item.rating}</span>
                </div>
                <div class="font-display font-bold text-xs text-white line-clamp-2 ${isCurrent ? '' : 'group-hover:text-brand-300'}">${getAnimeDisplayTitle(item)}</div>
                <div class="text-[11px] text-zinc-400">${item.year || ''} • ${item.type || 'TV'} • ${item.episodes || '?'} эп.</div>
              </div>
            </div>
          `;
        }).join('');
      };

      renderSeasonsDom();

      // 2. Официальные данные франшизы из объекта релиза (если пришли сразу)
      const ingestFranchiseArray = (franchisesArr) => {
        if (!Array.isArray(franchisesArr) || !franchisesArr.length) return false;
        // Очищаем предварительные догадки и заполняем строгим официальным списком франшизы
        franchiseMap.clear();
        franchisesArr.forEach(fr => {
          const releases = Array.isArray(fr.franchise_releases)
            ? fr.franchise_releases
            : (Array.isArray(fr.releases) ? fr.releases : []);
          releases.forEach((relEntry, idx) => {
            const r = relEntry.release || relEntry;
            if (r && r.id) {
              const norm = normalizeRelease(r);
              const order = relEntry.sort_order ?? (idx + 1);
              addCandidate(norm, order, `Часть #${order}`);
            }
          });
        });
        addCandidate(anime, null, '');
        return franchiseMap.size > 1;
      };

      if (fullApiData && ingestFranchiseArray(fullApiData.franchises)) {
        renderSeasonsDom();
        return;
      }

      // 3. Запрашиваем официальный эндпоинт франшиз AniLibria для данного релиза
      const relId = fullApiData?.id || anime.releaseId;
      if (relId) {
        const frData = await fetchAniLibriaJson(`/anime/franchises/release/${encodeURIComponent(relId)}`, 2800);
        const frList = Array.isArray(frData) ? frData : (Array.isArray(frData?.data) ? frData.data : []);
        if (ingestFranchiseArray(frList) && state.currentAnime?.id === anime.id) {
          renderSeasonsDom();
          return;
        }
      }

      // 4. Если у релиза не прописана карточка франшизы в API, ищем строго по корневому названию
      const rootName = cleanRootTitleForFranchise(anime.title);
      if (rootName && rootName.length >= 4) {
        const searchRaw = await fetchAniLibriaJson(`/app/search/releases?query=${encodeURIComponent(rootName)}`, 2600);
        if (!searchRaw || state.currentAnime?.id !== anime.id) return;
        const foundList = (Array.isArray(searchRaw) ? searchRaw : (searchRaw?.data || [])).map(normalizeRelease);
        let added = false;
        foundList.forEach(item => {
          if (isSameFranchiseStrict(anime, item)) {
            addCandidate(item, null, '');
            added = true;
          }
        });
        if (added) renderSeasonsDom();
      }
    }

    function renderModalSimilarAnime(anime) {
      const grid = document.getElementById('modalSimilarGrid');
      if (!grid || !anime) return;

      const targetGenres = new Set(anime.genres || []);
      const candidates = state.catalog
        .filter(a => a.id !== anime.id)
        .map(a => {
          const overlap = (a.genres || []).filter(g => targetGenres.has(g)).length;
          return { anime: a, score: overlap * 10 + (parseFloat(a.rating) || 8.5) };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);

      grid.innerHTML = candidates.map(({ anime: sim }) => {
        const safeJson = JSON.stringify(sim).replace(/'/g, '&#39;');
        return `
          <div
            onclick='openAnimePlayer(${safeJson})'
            class="p-2.5 rounded-2xl bg-dark-800/80 hover:bg-dark-800 border border-white/10 hover:border-brand-500/50 transition cursor-pointer flex items-center gap-3 group"
          >
            <img src="${sim.poster}" onerror="this.src='https://placehold.co/100x140/131620/f43f5e?text=TV'" class="w-12 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform" />
            <div class="min-w-0 flex-1 space-y-0.5">
              <div class="text-xs font-bold text-white line-clamp-2 group-hover:text-brand-300 leading-tight">${getAnimeDisplayTitle(sim)}</div>
              <div class="text-[10px] text-amber-400 font-bold">★ ${sim.rating} • ${sim.year}</div>
              <div class="text-[10px] text-zinc-400 truncate">${(sim.genres || []).slice(0, 2).join(', ')}</div>
            </div>
          </div>
        `;
      }).join('');
    }

    function openAnimePlayer(anime, startEp = null, resumeSec = 0) {
      if (!anime) return;
      state.currentAnime = anime;
      state.anilibriaEpisodes = [];

      const modal = document.getElementById('playerModal');
      if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }

      document.getElementById('modalAnimeTitle').textContent = getAnimeDisplayTitle(anime);
      document.getElementById('modalAnimeDesc').textContent = anime.desc || 'Описание отсутствует.';
      document.getElementById('modalStatusSelect').value = state.myList[anime.id]?.userStatus || '';
      syncModalFavoriteButton();
      populateModalRichDetails(anime, null);
      loadAndRenderFranchiseSeasons(anime, null);

      const qSel = document.getElementById('hlsQualitySelect');
      if (qSel) qSel.value = state.siteSettings.defaultQuality || '720';

      const savedHist = state.watchHistory[anime.id];
      const epToPlay = startEp || savedHist?.episode || 1;
      const secToResume = resumeSec || (startEp ? 0 : (savedHist?.time || 0));

      renderEpisodesRibbon(anime.episodes || 12, epToPlay);
      // Запускаем видео МГНОВЕННО, не блокируя открытие модального окна сетевым запросом!
      selectEpisode(epToPlay, secToResume);

      // В фоне подгружаем прямые ссылки на серии AniLibria и расширенные данные
      const key = anime.releaseId || anime.alias;
      if (key) {
        fetchAniLibriaJson(`/anime/releases/${encodeURIComponent(key)}`, 2600).then(full => {
          if (!full || state.currentAnime?.id !== anime.id) return;
          if (Array.isArray(full.episodes) && full.episodes.length > 0) {
            state.anilibriaEpisodes = full.episodes;
            anime.episodes = full.episodes.length || anime.episodes;
            renderEpisodesRibbon(anime.episodes, state.currentEpisode);
            syncFullscreenEpisodeControls();
            // Если пользователь ещё на первых секундах демо-потока, плавно переключаем на оригинальный HLS-поток релиза
            const video = document.getElementById('animeVideoElement');
            const curSec = video ? Math.floor(video.currentTime || 0) : secToResume;
            selectEpisode(state.currentEpisode, curSec);
          }
          if (full.description) {
            document.getElementById('modalAnimeDesc').textContent = full.description;
          }
          populateModalRichDetails(anime, full);
          loadAndRenderFranchiseSeasons(anime, full);
        }).catch(() => {});
      }
    }

    function closePlayerModal() {
      saveCurrentWatchProgress(true);
      const container = document.getElementById('playerVideoContainer');
      const modal = document.getElementById('playerModal');
      if (container) container.classList.remove('pseudo-fullscreen');
      if (modal) modal.classList.remove('fs-active');
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        (document.exitFullscreen || document.webkitExitFullscreen)?.call(document).catch?.(() => {});
      }
      if (modal) modal.classList.add('hidden');
      document.body.style.overflow = '';
      const video = document.getElementById('animeVideoElement');
      if (video) video.pause();
      if (state.hlsInstance) {
        state.hlsInstance.destroy();
        state.hlsInstance = null;
      }
    }

    function isPlayerInFullscreen() {
      const container = document.getElementById('playerVideoContainer');
      const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
      return Boolean(fsEl || (container && container.classList.contains('pseudo-fullscreen')));
    }

    function syncFullscreenButtonState() {
      const btn = document.getElementById('fsToggleBtnLabel');
      const active = isPlayerInFullscreen();
      if (btn) {
        btn.textContent = active ? 'Выйти из полного экрана (Esc)' : 'Полный экран (F)';
      }
    }

    function revealFullscreenOverlay() {
      const bar = document.getElementById('fullscreenEpisodeBar');
      const container = document.getElementById('playerVideoContainer');
      if (!bar) return;
      bar.classList.remove('opacity-0');
      bar.classList.add('opacity-100');
      if (container) container.style.cursor = 'default';
      clearTimeout(window._fsBarTimer);
      window._fsBarTimer = setTimeout(() => {
        const list = document.getElementById('fsEpisodeDropdownList');
        if (list && !list.classList.contains('hidden')) return;
        bar.classList.remove('opacity-100');
        bar.classList.add('opacity-0');
        if (container && isPlayerInFullscreen()) {
          container.style.cursor = 'none';
        }
      }, 2300);
    }

    function toggleFullscreenEpDropdown() {
      const list = document.getElementById('fsEpisodeDropdownList');
      if (!list) return;
      list.classList.toggle('hidden');
      revealFullscreenOverlay();
    }

    function stepEpisode(delta) {
      if (!state.currentAnime) return;
      const total = Math.max(state.currentAnime.episodes || 1, state.anilibriaEpisodes.length || 1);
      const next = state.currentEpisode + delta;
      if (next >= 1 && next <= total) {
        selectEpisode(next, 0);
        triggerPlayerHud(`Серия ${next} / ${total}`);
        revealFullscreenOverlay();
      }
    }

    function syncFullscreenEpisodeControls() {
      const total = Math.max(state.currentAnime?.episodes || 1, state.anilibriaEpisodes?.length || 1);
      const cur = state.currentEpisode || 1;
      const label = document.getElementById('fsCurrentEpLabel');
      const prevBtn = document.getElementById('fsPrevEpBtn');
      const nextBtn = document.getElementById('fsNextEpBtn');
      const list = document.getElementById('fsEpisodeDropdownList');

      if (label) label.textContent = `Серия ${cur} / ${total}`;
      if (prevBtn) prevBtn.disabled = cur <= 1;
      if (nextBtn) nextBtn.disabled = cur >= total;
      if (list) {
        let html = '';
        for (let i = 1; i <= total; i++) {
          const active = i === cur;
          html += `<button type="button" onclick="selectEpisode(${i}, 0); document.getElementById('fsEpisodeDropdownList').classList.add('hidden');" class="w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${active ? 'bg-brand-600 text-white' : 'text-zinc-200 hover:bg-white/10'}">Серия ${i}</button>`;
        }
        list.innerHTML = html;
      }
      syncFullscreenButtonState();
    }

    function enterPseudoFullscreen() {
      const container = document.getElementById('playerVideoContainer');
      const modal = document.getElementById('playerModal');
      if (!container) return;
      if (modal) modal.classList.add('fs-active');
      container.classList.add('pseudo-fullscreen');
      syncFullscreenButtonState();
      revealFullscreenOverlay();
    }

    function exitPseudoFullscreen() {
      const container = document.getElementById('playerVideoContainer');
      const modal = document.getElementById('playerModal');
      if (container) {
        container.classList.remove('pseudo-fullscreen');
        container.style.cursor = 'default';
      }
      if (modal) modal.classList.remove('fs-active');
      syncFullscreenButtonState();
    }

    async function togglePlayerFullscreen(e) {
      if (e && e.target && ['BUTTON', 'SELECT', 'OPTION'].includes(e.target.tagName) && e.type === 'dblclick') {
        return;
      }
      const container = document.getElementById('playerVideoContainer');
      const video = document.getElementById('animeVideoElement');
      if (!container) return;

      const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
      const isPseudo = container.classList.contains('pseudo-fullscreen');

      if (fsEl || isPseudo) {
        exitPseudoFullscreen();
        if (fsEl) {
          if (document.exitFullscreen) {
            await document.exitFullscreen().catch(() => {});
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          }
        }
        syncFullscreenButtonState();
        triggerPlayerHud('Обычный экран');
        return;
      }

      let nativeEntered = false;
      try {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
          nativeEntered = Boolean(document.fullscreenElement);
        } else if (container.webkitRequestFullscreen) {
          container.webkitRequestFullscreen();
          nativeEntered = Boolean(document.webkitFullscreenElement);
        }
      } catch (err) {
        nativeEntered = false;
      }

      if (!nativeEntered) {
        enterPseudoFullscreen();
      } else {
        syncFullscreenButtonState();
        revealFullscreenOverlay();
      }
      triggerPlayerHud('Полный экран');
    }

    document.addEventListener('fullscreenchange', () => {
      const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
      const container = document.getElementById('playerVideoContainer');
      const video = document.getElementById('animeVideoElement');
      // Если пользователь нажал нативную кнопку полного экрана прямо на теге <video>, переключаем полноэкранный режим на контейнер с панелью серий
      if (fsEl === video && container && container.requestFullscreen) {
        document.exitFullscreen?.().then(() => {
          container.requestFullscreen().catch(() => enterPseudoFullscreen());
        }).catch(() => {});
        return;
      }
      if (!fsEl && container) {
        container.style.cursor = 'default';
      }
      syncFullscreenButtonState();
      revealFullscreenOverlay();
    });

    function handleVideoSurfaceClick(e) {
      const video = document.getElementById('animeVideoElement');
      if (!video) return;
      const rect = video.getBoundingClientRect();
      if (e.clientY > rect.bottom - 48) return;
      revealFullscreenOverlay();
    }

    window.addEventListener('keydown', (e) => {
      const modal = document.getElementById('playerModal');
      if (!modal || modal.classList.contains('hidden')) return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

      const video = document.getElementById('animeVideoElement');
      if (!video) return;
      const key = e.key.toLowerCase();
      const step = Number(state.siteSettings.seekStep) || 5;

      if (e.code === 'Space') {
        e.preventDefault();
        if (video.paused) { video.play().catch(() => {}); triggerPlayerHud('Воспроизведение'); }
        else { video.pause(); triggerPlayerHud('Пауза'); }
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        video.currentTime = Math.min(video.duration || 9999, video.currentTime + step);
        triggerPlayerHud(`+${step} сек`);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        video.currentTime = Math.max(0, video.currentTime - step);
        triggerPlayerHud(`-${step} сек`);
      } else if (key === 'f' || key === 'а') {
        e.preventDefault();
        togglePlayerFullscreen();
      } else if (key === 'n' || key === 'т') {
        e.preventDefault();
        stepEpisode(1);
      } else if (key === 'p' || key === 'з') {
        e.preventDefault();
        stepEpisode(-1);
      } else if (e.key === 'Escape') {
        const container = document.getElementById('playerVideoContainer');
        if (container?.classList.contains('pseudo-fullscreen')) {
          e.preventDefault();
          exitPseudoFullscreen();
          triggerPlayerHud('Обычный экран');
        }
      }
    });

    function renderEpisodesRibbon(total, activeEp) {
      const ribbon = document.getElementById('episodesRibbon');
      if (!ribbon) return;
      const count = Math.max(total || 1, state.anilibriaEpisodes.length || 1);
      let html = '';
      for (let i = 1; i <= count; i++) {
        const isCurrent = i === activeEp;
        html += `
          <button
            type="button"
            onclick="selectEpisode(${i}); this.blur();"
            class="px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${isCurrent ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30' : 'bg-dark-800 hover:bg-dark-700 text-zinc-300 border border-white/10'}"
          >
            Серия ${i}
          </button>
        `;
      }
      ribbon.innerHTML = html;
    }

    function selectEpisode(ep, resumeSec = 0) {
      saveCurrentWatchProgress(true);
      state.currentEpisode = ep;
      renderEpisodesRibbon(state.currentAnime?.episodes || 12, ep);
      const pulseBox = document.getElementById('redditPulseContainer');
      const pulseBtn = document.getElementById('redditPulseBtn');
      if (pulseBtn) pulseBtn.textContent = `Собрать мнения (Серия ${ep})`;
      if (pulseBox) {
        pulseBox.innerHTML = `Нажми <b>«Собрать мнения (Серия ${ep})»</b> выше, чтобы получить выжимку обсуждений ${ep}-й серии с Reddit (r/anime) без сюжетных спойлеров.`;
      }
      syncFullscreenEpisodeControls();

      const epObj = state.anilibriaEpisodes.find(e => e.ordinal === ep) || state.anilibriaEpisodes[ep - 1];
      const q = document.getElementById('hlsQualitySelect')?.value || state.siteSettings.defaultQuality || '720';

      const candidates = [];
      if (epObj) {
        if (q === '1080') {
          if (epObj.hls_1080) candidates.push({ url: epObj.hls_1080, label: '1080p' });
          if (epObj.hls_720) candidates.push({ url: epObj.hls_720, label: '720p' });
          if (epObj.hls_480) candidates.push({ url: epObj.hls_480, label: '480p' });
        } else if (q === '480') {
          if (epObj.hls_480) candidates.push({ url: epObj.hls_480, label: '480p' });
          if (epObj.hls_720) candidates.push({ url: epObj.hls_720, label: '720p' });
          if (epObj.hls_1080) candidates.push({ url: epObj.hls_1080, label: '1080p' });
        } else {
          if (epObj.hls_720) candidates.push({ url: epObj.hls_720, label: '720p' });
          if (epObj.hls_1080) candidates.push({ url: epObj.hls_1080, label: '1080p' });
          if (epObj.hls_480) candidates.push({ url: epObj.hls_480, label: '480p' });
        }
      }
      candidates.push({ url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', label: `${q}p` });

      const chosen = candidates[0];
      const badge = document.getElementById('playerStreamBadge');
      if (badge) badge.textContent = `Серия ${ep} • ${chosen.label} HLS`;

      attachVideoSource(candidates.map(c => c.url), resumeSec);
    }

    function releaseVideoControlsBar(video) {
      if (document.activeElement && document.activeElement !== document.body) {
        document.activeElement.blur?.();
      }
      if (video) video.blur?.();
    }

    function attachVideoSource(urlOrList, resumeSec = 0, candidateIdx = 0) {
      const urls = Array.isArray(urlOrList) ? urlOrList : [urlOrList];
      const url = urls[candidateIdx] || 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
      const video = document.getElementById('animeVideoElement');
      if (!video) return;

      if (state.hlsInstance) {
        state.hlsInstance.destroy();
        state.hlsInstance = null;
      }

      const startPlayback = () => {
        if (resumeSec > 1 && Math.abs((video.currentTime || 0) - resumeSec) > 2) {
          try { video.currentTime = resumeSec; } catch (e) {}
        }
        const playPromise = video.play();
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.then(() => releaseVideoControlsBar(video)).catch(() => {});
        } else {
          releaseVideoControlsBar(video);
        }
      };

      if (window.Hls && Hls.isSupported() && url.includes('.m3u8')) {
        const hls = new Hls({
          enableWorker: false,
          startPosition: resumeSec > 1 ? resumeSec : -1
        });
        state.hlsInstance = hls;
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, startPlayback);
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            if (candidateIdx + 1 < urls.length) {
              attachVideoSource(urls, resumeSec, candidateIdx + 1);
            } else {
              hls.destroy();
            }
          }
        });
      } else {
        video.src = url;
        video.onloadedmetadata = startPlayback;
        video.onerror = () => {
          if (candidateIdx + 1 < urls.length) {
            attachVideoSource(urls, resumeSec, candidateIdx + 1);
          }
        };
      }
    }

    function triggerPlayerHud(label) {
      const hud = document.getElementById('playerHudFeedback');
      const txt = document.getElementById('playerHudText');
      if (!hud || !txt) return;
      txt.textContent = label;
      hud.classList.remove('hidden');
      clearTimeout(window._hudTimer);
      window._hudTimer = setTimeout(() => hud.classList.add('hidden'), 850);
    }

    function changeHlsQuality(quality) {
      const q = quality || document.getElementById('hlsQualitySelect')?.value || '720';
      state.siteSettings.defaultQuality = q;
      localStorage.setItem('kitsune_settings', JSON.stringify(state.siteSettings));
      const video = document.getElementById('animeVideoElement');
      const currentSec = video ? Math.floor(video.currentTime || 0) : 0;
      selectEpisode(state.currentEpisode, currentSec);
      releaseVideoControlsBar(video);
      triggerPlayerHud(`Качество: ${q}p`);
    }

    function changePlaybackSpeed(rate) {
      const video = document.getElementById('animeVideoElement');
      if (video) {
        video.playbackRate = parseFloat(rate) || 1;
        releaseVideoControlsBar(video);
        triggerPlayerHud(`Скорость ${rate}x`);
      }
    }

    function toggleAmbilight() {
      state.siteSettings.ambilight = !state.siteSettings.ambilight;
      localStorage.setItem('kitsune_settings', JSON.stringify(state.siteSettings));
    }

    function toggleTheaterMode(force) {
      state.theaterMode = typeof force === 'boolean' ? force : !state.theaterMode;
      const modal = document.getElementById('playerModal');
      if (modal) modal.classList.toggle('bg-black', state.theaterMode);
    }

    function saveCurrentWatchProgress(force = false) {
      const video = document.getElementById('animeVideoElement');
      if (!video || !state.currentAnime) return;
      const t = Math.floor(video.currentTime || 0);
      if (!force && t < 2) return;
      state.watchHistory[state.currentAnime.id] = {
        anime: state.currentAnime,
        episode: state.currentEpisode,
        time: t,
        duration: Math.floor(video.duration || 1440),
        updatedAt: Date.now()
      };
      saveUserScopedData();
      renderContinueWatching();
    }

    function handlePlayerTimeUpdate() {
      saveCurrentWatchProgress(false);
    }

    function handleEpisodeEnded() {
      const total = Math.max(state.currentAnime?.episodes || 12, state.anilibriaEpisodes.length || 1);
      if (state.currentEpisode < total) selectEpisode(state.currentEpisode + 1, 0);
    }

    function setAnimeUserStatus(status) {
      if (!state.currentAnime) return;
      if (!status) {
        delete state.myList[state.currentAnime.id];
        showToast('Удалено из списка');
      } else {
        state.myList[state.currentAnime.id] = { ...state.currentAnime, userStatus: status, addedAt: Date.now() };
        showToast(status === 'completed' ? 'Добавлено в Коллекцию трофеев!' : 'Статус в списке обновлён!');
      }
      saveUserScopedData();
      syncMyListBadge();
      renderCatalogGrid();
    }

    function syncMyListBadge() {
      const badge = document.getElementById('myListCountBadge');
      if (badge) badge.textContent = Object.keys(state.myList).length;
    }

    function renderContinueWatching() {
      const sec = document.getElementById('continueWatchingSection');
      const grid = document.getElementById('continueWatchingGrid');
      const ownerTag = document.getElementById('historyOwnerTag');
      const items = Object.values(state.watchHistory).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).slice(0, 4);
      if (!sec || !grid) return;
      if (!items.length) {
        sec.classList.add('hidden');
        return;
      }
      sec.classList.remove('hidden');
      if (ownerTag) ownerTag.textContent = state.user ? `Профиль: ${state.user.name}` : 'Локально';
      grid.innerHTML = items.map(h => {
        const pct = Math.min(100, Math.round(((h.time || 0) / (h.duration || 1440)) * 100));
        return `
          <div
            onclick='openAnimePlayer(${JSON.stringify(h.anime).replace(/'/g, "&#39;")}, ${h.episode}, ${h.time})'
            class="flex items-center gap-3 p-3 rounded-2xl bg-dark-900 hover:bg-dark-800 border border-white/10 cursor-pointer transition"
          >
            <img src="${h.anime.poster}" class="w-12 h-16 rounded-xl object-cover shrink-0" />
            <div class="min-w-0 flex-1 space-y-1.5">
              <div class="text-xs font-bold text-white truncate">${getAnimeDisplayTitle(h.anime)}</div>
              <div class="text-[11px] text-brand-400 font-semibold">Серия ${h.episode} • ${Math.floor(h.time / 60)}:${String(h.time % 60).padStart(2, '0')}</div>
              <div class="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div class="h-full bg-brand-500" style="width:${pct}%"></div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    function clearWatchHistory() {
      state.watchHistory = {};
      saveUserScopedData();
      renderContinueWatching();
      renderCatalogGrid();
      showToast('История просмотра очищена');
    }

    function renderTierListPage() {
      const rowsEl = document.getElementById('tierRowsContainer');
      const poolEl = document.getElementById('tierPoolGrid');
      if (!rowsEl || !poolEl) return;

      const tiers = [
        { key: 'S', label: 'S — Шедевры', color: 'bg-rose-600' },
        { key: 'A', label: 'A — Топ', color: 'bg-amber-500' },
        { key: 'B', label: 'B — Хорошо', color: 'bg-emerald-600' },
        { key: 'C', label: 'C — На один раз', color: 'bg-sky-600' }
      ];

      const assignedIds = new Set();
      Object.values(state.tierList).forEach(arr => arr.forEach(a => assignedIds.add(a.id)));

      rowsEl.innerHTML = tiers.map(t => {
        const items = state.tierList[t.key] || [];
        return `
          <div class="flex flex-col sm:flex-row bg-dark-900 border border-white/10 rounded-2xl overflow-hidden">
            <div class="${t.color} sm:w-36 p-3 flex items-center justify-center text-center font-display font-black text-sm text-white shrink-0">
              ${t.label}
            </div>
            <div class="flex-1 p-3 flex flex-wrap gap-2.5 min-h-[96px]">
              ${items.length ? items.map(a => `
                <div class="relative group w-16 sm:w-20 rounded-xl overflow-hidden border border-white/15">
                  <img src="${a.poster}" title="${getAnimeDisplayTitle(a)}" class="w-full aspect-[3/4] object-cover" />
                  <button type="button" onclick="removeFromTier('${t.key}', '${a.id}')" class="absolute top-1 right-1 w-5 h-5 rounded-md bg-black/80 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">✕</button>
                </div>
              `).join('') : `<div class="text-xs text-zinc-500 self-center px-2">Пусто — выбери ранг у карточки снизу</div>`}
            </div>
          </div>
        `;
      }).join('');

      const allPool = [...state.tierPoolExtra, ...state.catalog, ...Object.values(state.myList)];
      const uniquePool = [];
      const seen = new Set();
      allPool.forEach(a => {
        if (!seen.has(a.id) && !assignedIds.has(a.id)) {
          seen.add(a.id);
          uniquePool.push(a);
        }
      });

      poolEl.innerHTML = uniquePool.slice(0, 28).map(a => `
        <div class="bg-dark-800 border border-white/10 rounded-xl overflow-hidden flex flex-col">
          <img src="${a.poster}" class="w-full aspect-[3/4] object-cover" />
          <div class="p-2 space-y-1.5 flex-1 flex flex-col justify-between">
            <div class="text-[11px] font-bold text-white line-clamp-2">${getAnimeDisplayTitle(a)}</div>
            <div class="grid grid-cols-4 gap-1">
              ${['S', 'A', 'B', 'C'].map(rank => `
                <button type="button" onclick='assignToTier("${rank}", ${JSON.stringify(a).replace(/'/g, "&#39;")})' class="py-1 rounded bg-white/10 hover:bg-brand-600 text-[10px] font-black text-white cursor-pointer">${rank}</button>
              `).join('')}
            </div>
          </div>
        </div>
      `).join('');
    }

    let tierSearchTimer = null;
    function handleTierSearch(query) {
      const q = (query || '').trim();
      clearTimeout(tierSearchTimer);
      if (!q) return;
      tierSearchTimer = setTimeout(async () => {
        try {
          const res = await fetch(`${ANILIBRIA_API}/app/search/releases?query=${encodeURIComponent(q)}`);
          if (!res.ok) return;
          const raw = await res.json();
          state.tierPoolExtra = (Array.isArray(raw) ? raw : (raw.data || [])).map(normalizeRelease);
          renderTierListPage();
        } catch (e) {}
      }, 300);
    }

    function assignToTier(rank, anime) {
      ['S', 'A', 'B', 'C'].forEach(r => {
        state.tierList[r] = (state.tierList[r] || []).filter(x => x.id !== anime.id);
      });
      state.tierList[rank].push(anime);
      saveUserScopedData();
      renderTierListPage();
      renderCatalogGrid();
    }

    function removeFromTier(rank, id) {
      state.tierList[rank] = (state.tierList[rank] || []).filter(x => x.id !== id);
      saveUserScopedData();
      renderTierListPage();
      renderCatalogGrid();
    }

    function resetTierList() {
      state.tierList = { S: [], A: [], B: [], C: [] };
      saveUserScopedData();
      renderTierListPage();
      renderCatalogGrid();
    }

    function copyTierListSummary() {
      const lines = ['Мой Тир-лист KITSUNE // ANIME:'];
      ['S', 'A', 'B', 'C'].forEach(r => {
        const names = (state.tierList[r] || []).map(a => getAnimeDisplayTitle(a)).join(', ');
        lines.push(`${r}: ${names || '—'}`);
      });
      const temp = document.createElement('textarea');
      temp.value = lines.join('\n');
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
      showToast('Тир-лист скопирован!');
    }

    // --- ЖИВОЙ КАЛЕНДАРЬ В РЕАЛЬНОМ ВРЕМЕНИ (БЕЗ ПРОШЕДШИХ ДНЕЙ НЕДЕЛИ) ---
    let calendarTickerInterval = null;
    let lastRenderedCalendarDayKey = '';

    const WEEKDAYS_META = [
      { iso: 1, name: 'Понедельник', short: 'ПН', jp: '月曜日' },
      { iso: 2, name: 'Вторник', short: 'ВТ', jp: '火曜日' },
      { iso: 3, name: 'Среда', short: 'СР', jp: '水曜日' },
      { iso: 4, name: 'Четверг', short: 'ЧТ', jp: '木曜日' },
      { iso: 5, name: 'Пятница', short: 'ПТ', jp: '金曜日' },
      { iso: 6, name: 'Суббота', short: 'СБ', jp: '土曜日' },
      { iso: 7, name: 'Воскресенье', short: 'ВС', jp: '日曜日' }
    ];

    function getCurrentIsoWeekday(now = new Date()) {
      const d = now.getDay();
      return d === 0 ? 7 : d; // 1 = Понедельник ... 7 = Воскресенье
    }

    function toggleCalendarMode() {
      state.siteSettings.hidePastCalendarDays = !state.siteSettings.hidePastCalendarDays;
      localStorage.setItem('kitsune_settings', JSON.stringify(state.siteSettings));
      renderCalendarPage(true);
      showToast(
        state.siteSettings.hidePastCalendarDays
          ? 'Показываются только сегодня и оставшиеся дни недели'
          : 'Показана вся неделя целиком'
      );
    }

    function updateRealtimeCalendarClock() {
      const now = new Date();
      const clockEl = document.getElementById('calendarRealtimeClock');
      const dateEl = document.getElementById('calendarRealtimeDate');

      if (clockEl) {
        clockEl.textContent = now.toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      }
      if (dateEl) {
        dateEl.textContent = now.toLocaleDateString('ru-RU', {
          weekday: 'long',
          day: 'numeric',
          month: 'long'
        });
      }

      // Обновляем живые обратные отсчёты на сегодняшних карточках
      document.querySelectorAll('[data-ep-release-hour]').forEach(badge => {
        const releaseHour = Number(badge.getAttribute('data-ep-release-hour') || 19);
        const releaseMin = Number(badge.getAttribute('data-ep-release-min') || 0);
        const target = new Date(now);
        target.setHours(releaseHour, releaseMin, 0, 0);
        const diffSec = Math.floor((target - now) / 1000);

        if (diffSec <= 0) {
          badge.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold';
          badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span><span>Серия вышла сегодня в ${String(releaseHour).padStart(2, '0')}:${String(releaseMin).padStart(2, '0')}</span>`;
        } else {
          const hh = String(Math.floor(diffSec / 3600)).padStart(2, '0');
          const mm = String(Math.floor((diffSec % 3600) / 60)).padStart(2, '0');
          const ss = String(diffSec % 60).padStart(2, '0');
          badge.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-mono font-bold';
          badge.innerHTML = `<span>До серии: ${hh}:${mm}:${ss} (${String(releaseHour).padStart(2, '0')}:${String(releaseMin).padStart(2, '0')})</span>`;
        }
      });

      // Если наступила полночь и день сменился — автоматически перестраиваем сетку без прошедшего дня
      const dayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
      if (lastRenderedCalendarDayKey && lastRenderedCalendarDayKey !== dayKey && state.activePage === 'calendar') {
        renderCalendarPage(true);
      }
    }

    function startRealtimeCalendarTicker() {
      clearInterval(calendarTickerInterval);
      updateRealtimeCalendarClock();
      calendarTickerInterval = setInterval(() => {
        if (state.activePage === 'calendar') {
          updateRealtimeCalendarClock();
        }
      }, 1000);
    }

    function renderCalendarPage() {
      const grid = document.getElementById('calendarDaysGrid');
      const modeBtn = document.getElementById('calendarViewModeBtn');
      const subInfo = document.getElementById('calendarSubtitleInfo');
      if (!grid) return;

      const now = new Date();
      lastRenderedCalendarDayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
      const currentIso = getCurrentIsoWeekday(now);
      const hidePast = state.siteSettings.hidePastCalendarDays !== false;

      if (modeBtn) {
        modeBtn.textContent = hidePast ? 'Скрыты прошедшие дни: ВКЛ' : 'Показана вся неделя';
        modeBtn.className = hidePast
          ? 'px-3.5 py-2.5 rounded-xl bg-brand-600/25 border border-brand-500/50 text-xs font-bold text-brand-300 cursor-pointer'
          : 'px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-zinc-300 cursor-pointer';
      }

      // Фильтруем дни текущей недели, которые уже прошли (iso < currentIso)
      const visibleDays = hidePast
        ? WEEKDAYS_META.filter(d => d.iso >= currentIso)
        : WEEKDAYS_META;

      const hiddenCount = WEEKDAYS_META.length - visibleDays.length;
      if (subInfo) {
        subInfo.textContent = hidePast
          ? `Сегодня ${WEEKDAYS_META[currentIso - 1].name}. Прошедшие дни этой недели (${hiddenCount}) автоматически скрыты — показаны только актуальные релизы до конца недели.`
          : `Показаны все 7 дней недели. Включите фильтр, чтобы скрыть уже прошедшие дни.`;
      }

      const releaseSlots = [
        { hour: 17, min: 30 },
        { hour: 19, min: 0 },
        { hour: 21, min: 15 }
      ];

      grid.innerHTML = visibleDays.map((dayObj) => {
        const i = dayObj.iso - 1;
        const isToday = dayObj.iso === currentIso;
        const isTomorrow = dayObj.iso === currentIso + 1;
        const dayOffset = dayObj.iso - currentIso;

        const cardDate = new Date(now);
        cardDate.setDate(now.getDate() + dayOffset);
        const dateFormatted = cardDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });

        const subset = state.catalog.filter((_, idx) => idx % 7 === i).slice(0, 3);
        const dayReleases = subset.length ? subset : state.catalog.slice(0, 2);

        return `
          <div class="bg-dark-900 border ${isToday ? 'border-brand-500 ring-2 ring-brand-500/30 shadow-2xl' : 'border-white/10'} rounded-2xl p-4 sm:p-5 space-y-3.5 relative overflow-hidden">
            <div class="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-display font-black text-base ${isToday ? 'text-brand-400' : 'text-white'}">${dayObj.name}</span>
                  ${isToday ? `<span class="px-2 py-0.5 rounded-md bg-brand-600 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">Сегодня</span>` : ''}
                  ${isTomorrow ? `<span class="px-2 py-0.5 rounded-md bg-white/10 text-zinc-300 text-[10px] font-bold">Завтра</span>` : ''}
                </div>
                <div class="text-[11px] text-zinc-400">${dateFormatted} • ${dayObj.jp}</div>
              </div>
              <span class="text-xs font-mono font-bold text-zinc-400">${dayReleases.length} релиза</span>
            </div>

            <div class="space-y-2.5">
              ${dayReleases.map((a, slotIdx) => {
                const slot = releaseSlots[slotIdx % releaseSlots.length];
                const timeStr = `${String(slot.hour).padStart(2, '0')}:${String(slot.min).padStart(2, '0')}`;
                const safeJson = JSON.stringify(a).replace(/'/g, '&#39;');
                const nextEpNum = Math.min((a.episodes || 12), ((a.releaseId || slotIdx + 3) % (a.episodes || 12)) + 1);
                return `
                  <div
                    onclick='openAnimePlayer(${safeJson})'
                    class="flex items-center gap-3 p-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 border border-white/5 hover:border-brand-500/40 cursor-pointer transition group"
                  >
                    <img src="${a.poster}" onerror="this.src='https://placehold.co/80x110/131620/f43f5e?text=TV'" class="w-12 h-16 rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform" />
                    <div class="min-w-0 flex-1 space-y-1">
                      <div class="text-xs font-bold text-white truncate group-hover:text-brand-300">${getAnimeDisplayTitle(a)}</div>
                      <div class="text-[11px] text-zinc-400">Серия ${nextEpNum} • ★ ${a.rating}</div>
                      ${isToday
                        ? `<div data-ep-release-hour="${slot.hour}" data-ep-release-min="${slot.min}" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold">Премьера в ${timeStr}</div>`
                        : `<div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 text-zinc-300 text-[10px] font-semibold">Выход в ${timeStr} МСК</div>`
                      }
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }).join('');

      updateRealtimeCalendarClock();
    }

    // Умный семантический ИИ-куратор с матрицей настроений, синонимами и живым поиском по API
    const AI_MOOD_CLUSTERS = [
      {
        name: 'Мрачный экшен и битвы',
        triggers: ['мрачн', 'экшен', 'битв', 'драк', 'боев', 'монстр', 'демон', 'титан', 'кров', 'жесток', 'сил', 'прокач', 'охотник', 'оружи', 'сраж', 'войн', 'месть', 'темн', 'тёмн', 'бензопил', 'магическ', 'соло', 'solo', 'атак'],
        genres: ['Экшен', 'Сёнен', 'Сверхъестественное', 'Ужасы', 'Триллер', 'Фэнтези'],
        keywords: ['монстр', 'демон', 'битв', 'сраж', 'сил', 'охотник', 'проклят', 'опасн', 'враг', 'мир']
      },
      {
        name: 'Уютное фэнтези и приключения',
        triggers: ['уют', 'фэнтез', 'отдых', 'вечер', 'спокойн', 'добр', 'путешеств', 'эльф', 'маги', 'приключ', 'лампов', 'расслаб', 'тепл', 'тёпл', 'фрирен', 'лес', 'сказк'],
        genres: ['Фэнтези', 'Приключения', 'Повседневность', 'Драма', 'Комедия'],
        keywords: ['путешеств', 'маг', 'эльф', 'мир', 'друз', 'истори', 'дорог', 'жизн']
      },
      {
        name: 'Романтика, чувства и драма',
        triggers: ['романт', 'любов', 'драм', 'мураш', 'слез', 'слёз', 'поплак', 'чувств', 'отношен', 'сердц', 'школ', 'пар', 'девушк', 'трогательн', 'грустн'],
        genres: ['Романтика', 'Драма', 'Школа', 'Повседневность', 'Сёдзё'],
        keywords: ['люб', 'чувств', 'сердц', 'встреч', 'школ', 'друг', ' тайн', 'судьб']
      },
      {
        name: 'Детектив, триллер и интриги',
        triggers: ['детектив', 'триллер', 'киберпанк', 'тайн', 'загад', 'расслед', 'интриг', 'умн', 'психолог', 'преступ', 'мистик', 'заговор', 'яд', 'дворец', 'тетрад', 'монстр'],
        genres: ['Детектив', 'Триллер', 'Психологическое', 'Фантастика', 'Мистика', 'Исторический', 'Драма'],
        keywords: ['тайн', 'расслед', 'интриг', 'загад', 'преступ', 'правд', 'скрыт', 'разум']
      },
      {
        name: 'Комедия и лёгкое настроение',
        triggers: ['комеди', 'смешн', 'весел', 'весё', 'юмор', 'повседнев', 'чилл', 'легк', 'лёгк', 'угар', 'пароди', 'школа', 'друз'],
        genres: ['Комедия', 'Повседневность', 'Школа', 'Романтика'],
        keywords: ['смеш', 'весел', 'забав', 'жизн', 'школ', 'друз', 'комед']
      },
      {
        name: 'Исекай и перерождение в другом мире',
        triggers: ['исекай', 'другой мир', 'перерожд', 'попадан', 'маги', 'рпг', 'уровен', 'гильд', 'король демонов', 'герой', 'меч'],
        genres: ['Фэнтези', 'Исекай', 'Приключения', 'Экшен', 'Магия'],
        keywords: ['мир', 'маг', 'уров', 'перерожд', 'геро', 'подземел', 'систем']
      }
    ];

    const KITSUNE_BACKEND_URL = window.location.origin.startsWith('http') && window.location.port === '8000'
      ? window.location.origin
      : 'http://127.0.0.1:8000';

    state.backendOnline = false;

    async function checkKitsuneBackendHealth() {
      const dot = document.getElementById('aiBackendStatusDot');
      const txt = document.getElementById('aiBackendStatusText');
      const badge = document.getElementById('aiBackendStatusBadge');
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 1800);
        const res = await fetch(`${KITSUNE_BACKEND_URL}/api/health`, { signal: ctrl.signal });
        clearTimeout(t);
        if (res.ok) {
          const data = await res.json();
          state.backendOnline = true;
          if (dot) dot.className = 'w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse';
          if (txt) txt.textContent = data.gemini_configured ? 'Gemini Pro Backend: ONLINE' : 'Backend ONLINE (Укажите GEMINI_API_KEY)';
          if (badge) badge.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-300';
          return true;
        }
      } catch (e) {}
      state.backendOnline = false;
      if (dot) dot.className = 'w-1.5 h-1.5 rounded-full bg-amber-400';
      if (txt) txt.textContent = 'Автономный режим (Запустите backend.py для Gemini Pro)';
      if (badge) badge.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-[10px] font-mono font-bold text-amber-300';
      return false;
    }

    // Локальная база культовых аниме с глубокими тропами (на случай если сервер ещё не запущен)
    const DEEP_TROPE_KNOWLEDGE_BASE = [
      {
        id: 'ext_lain',
        title: 'Эксперименты Лэйн',
        altTitle: 'Serial Experiments Lain',
        year: 1998,
        type: 'TV',
        episodes: 13,
        rating: '8.9',
        genres: ['Психологическое', 'Киберпанк', 'Драма', 'Триллер'],
        vibe_tags: ['Ненадежный рассказчик', 'Экзистенциальная депрессия', 'Гипнотический саундтрек', 'Без меха/роботов'],
        forbidden_tags: ['робот', 'меха', 'гарем', 'комедия'],
        poster: 'https://placehold.co/320x450/120924/f43f5e?text=Serial+Experiments+Lain',
        desc: 'Замкнутая школьница Лэйн Ивакура погружается в глобальную сеть «Провод», где граница между личностью, богом и коллективным бессознательным полностью стирается.'
      },
      {
        id: 'ext_monster',
        title: 'Монстр',
        altTitle: 'Monster',
        year: 2004,
        type: 'TV',
        episodes: 74,
        rating: '9.3',
        genres: ['Психологическое', 'Триллер', 'Детектив', 'Драма'],
        vibe_tags: ['Серая мораль', 'Медленный саспенс', 'Битва умов', 'Реализм без мистики'],
        forbidden_tags: ['робот', 'меха', 'магия', 'гарем', 'фансервис'],
        poster: 'https://placehold.co/320x450/0c1424/38bdf8?text=MONSTER',
        desc: 'Гениальный нейрохирург Кэндзо Тэмма спасает жизнь мальчику с пулевым ранением головы, ещё не зная, что подарил жизнь абсолютному воплощению зла.'
      },
      {
        id: 'ext_steins',
        title: 'Врата Штейна',
        altTitle: 'Steins;Gate',
        year: 2011,
        type: 'TV',
        episodes: 24,
        rating: '9.4',
        genres: ['Фантастика', 'Триллер', 'Драма', 'Психологическое'],
        vibe_tags: ['Временные петли', 'Отчаяние и выбор', 'Камерный триллер', 'Без роботов'],
        forbidden_tags: ['робот', 'меха', 'исекай'],
        poster: 'https://placehold.co/320x450/1b1408/f59e0b?text=Steins%3BGate',
        desc: 'Самопровозглашённый безумный учёный Ринтаро Окабэ случайно изобретает способ отправлять сообщения в прошлое, попадая в беспощадную ловушку мировых линий.'
      },
      {
        id: 'ext_paranoia',
        title: 'Агент паранойи',
        altTitle: 'Mousou Dairinin (Paranoia Agent)',
        year: 2004,
        type: 'TV',
        episodes: 13,
        rating: '8.7',
        genres: ['Психологическое', 'Триллер', 'Мистика', 'Детектив'],
        vibe_tags: ['Ненадежный рассказчик', 'Сюрреализм Сатоси Кона', 'Психоз мегаполиса', 'Без роботов'],
        forbidden_tags: ['робот', 'меха', 'гарем', 'школа'],
        poster: 'https://placehold.co/320x450/240b15/fb7185?text=Paranoia+Agent',
        desc: 'В Токио происходит серия нападений загадочного подростка на золотых роликах с погнутой битой, и каждая жертва странным образом испытывает облегчение.'
      },
      {
        id: 'ext_madeinabyss',
        title: 'Созданный в Бездне',
        altTitle: 'Made in Abyss',
        year: 2017,
        type: 'TV',
        episodes: 13,
        rating: '9.1',
        genres: ['Фэнтези', 'Приключения', 'Драма', 'Триллер'],
        vibe_tags: ['Контраст милого и жестокого', 'Гениальный саундтрек Кевина Пенкина', 'Спуск в неизвестность'],
        forbidden_tags: ['гарем', 'школа'],
        poster: 'https://placehold.co/320x450/081c18/34d399?text=Made+in+Abyss',
        desc: 'Спуск в гигантскую многоуровневую пропасть, где каждый подъём наверх грозит человеку необратимым проклятием и потерей человечности.'
      }
    ];

    function parseNegationsFromQuery(q) {
      const excluded = [];
      const regex = /(?:без|не\s+про|никаких|исключая|кроме)\s+([a-zа-яё\-]+)/gi;
      let m;
      while ((m = regex.exec(q)) !== null) {
        const word = m[1].toLowerCase();
        if (word.length >= 3) excluded.push(word.slice(0, 5));
      }
      return excluded;
    }

    async function runAiMoodPick(preset) {
      const inp = document.getElementById('aiMoodInput');
      if (preset && inp) inp.value = preset;
      const rawQuery = (inp?.value || preset || '').trim();
      const resEl = document.getElementById('aiRecommendationsResult');
      const summaryEl = document.getElementById('aiCuratorSummary');
      if (!resEl) return;

      if (!rawQuery) {
        showToast('Опиши вайб, тропы или ограничения (например: без роботов)!');
        return;
      }

      resEl.innerHTML = `
        <div class="col-span-full py-10 flex flex-col items-center justify-center gap-3 text-xs text-zinc-300">
          <div class="w-7 h-7 rounded-full border-2 border-brand-500 border-t-transparent animate-spin"></div>
          <span>Деконструируем вайб, темп, тропы и исключения для запроса: <b>«${rawQuery}»</b>...</span>
        </div>
      `;

      // 1. Пробуем обратиться к настоящему FastAPI + Gemini 2.5 Pro бэкенду
      try {
        const response = await fetch(`${KITSUNE_BACKEND_URL}/api/recommend`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: rawQuery,
            catalog: state.catalog.slice(0, 60).map(a => ({
              id: a.id,
              title: a.title,
              altTitle: a.altTitle || '',
              genres: a.genres || [],
              desc: a.desc || '',
              rating: String(a.rating || '8.5'),
              year: Number(a.year || 2024)
            }))
          })
        });

        if (response.ok) {
          const data = await response.json();
          checkKitsuneBackendHealth();
          if (summaryEl) {
            summaryEl.classList.remove('hidden');
            summaryEl.innerHTML = `<span class="font-bold text-white">Разбор Gemini Pro:</span> ${data.curator_analysis}`;
          }

          resEl.innerHTML = (data.recommendations || []).map(rec => {
            const localAnime = [...state.catalog, ...DEEP_TROPE_KNOWLEDGE_BASE].find(
              a => a.id === rec.anime_id ||
                   a.title.toLowerCase() === (rec.title || '').toLowerCase() ||
                   (a.altTitle && rec.alt_title && a.altTitle.toLowerCase() === rec.alt_title.toLowerCase())
            );
            const poster = localAnime
              ? localAnime.poster
              : `https://placehold.co/320x450/131620/f43f5e?text=${encodeURIComponent((rec.alt_title || rec.title || 'ANIME').slice(0, 16))}`;
            const safeTitle = (rec.title || '').replace(/'/g, "\'");
            const clickAction = localAnime && localAnime.releaseId
              ? `openAnimePlayer(${JSON.stringify(localAnime).replace(/'/g, '&#39;')})`
              : `document.getElementById('searchInput').value='${safeTitle}'; handleSearchInput('${safeTitle}'); navigateTo('home');`;

            return `
              <div onclick="${clickAction}" class="bg-dark-800 border border-white/10 hover:border-brand-500 rounded-2xl overflow-hidden cursor-pointer transition flex flex-col group shadow-xl">
                <div class="relative h-52 overflow-hidden bg-dark-900">
                  <img src="${poster}" onerror="this.src='https://placehold.co/320x450/131620/f43f5e?text=AI+PICK'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent"></div>
                  <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg bg-brand-600 text-white text-[10px] font-black shadow">
                    ${rec.match_score}% попадание в вайб
                  </span>
                  ${!localAnime ? `<span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-purple-600/90 text-white text-[10px] font-bold">Gemini Knowledge</span>` : ''}
                  <div class="absolute bottom-2 left-2.5 right-2.5 flex flex-wrap gap-1">
                    ${(rec.vibe_tags || []).map(t => `<span class="px-1.5 py-0.5 rounded bg-black/85 border border-brand-500/40 text-[9px] font-bold text-brand-300">${t}</span>`).join('')}
                  </div>
                </div>
                <div class="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <div class="text-xs sm:text-sm font-bold text-white group-hover:text-brand-300">${rec.title}</div>
                    <div class="text-[10px] font-mono text-zinc-400">${rec.alt_title || ''}</div>
                  </div>
                  <p class="text-[11px] text-zinc-300 leading-relaxed">${rec.explanation}</p>
                </div>
              </div>
            `;
          }).join('');
          return;
        }
      } catch (e) {
        // Сервер не запущен — переключаемся на улучшенный локальный анализатор тропов и отрицаний
      }

      // 2. Умный автономный анализатор (учитывает отрицания «без ...» и глубокие тропы)
      const query = rawQuery.toLowerCase();
      const negations = parseNegationsFromQuery(query);
      const activeClusters = AI_MOOD_CLUSTERS.filter(c => c.triggers.some(t => query.includes(t)));

      const combinedPool = [...DEEP_TROPE_KNOWLEDGE_BASE, ...state.catalog];
      const filteredPool = combinedPool.filter(anime => {
        if (!negations.length) return true;
        const fullText = `${anime.title} ${anime.altTitle || ''} ${(anime.genres || []).join(' ')} ${(anime.forbidden_tags || []).join(' ')} ${anime.desc || ''}`.toLowerCase();
        return !negations.some(neg => fullText.includes(neg));
      });

      const scored = filteredPool.map(anime => {
        let score = 0;
        const vibeTags = [...(anime.vibe_tags || [])];
        const fullText = `${anime.title} ${anime.altTitle || ''} ${(anime.genres || []).join(' ')} ${vibeTags.join(' ')} ${anime.desc || ''}`.toLowerCase();

        if (/депресс|евангелион|ненадежн|психолог|экзистенц/.test(query)) {
          if (/психолог|триллер|драм|лэйн|параной|монстр/.test(fullText)) score += 42;
        }
        if (/петл|врем|спаст/.test(query)) {
          if (/штейна|steins|врем|петл|прошл/.test(fullText)) score += 45;
        }
        if (/гени|ум|интеллект|морал|антигерой/.test(query)) {
          if (/монстр|детектив|триллер|фармацевт/.test(fullText)) score += 38;
        }

        activeClusters.forEach(cluster => {
          const matchedGenres = (anime.genres || []).filter(g =>
            cluster.genres.some(cg => g.toLowerCase().includes(cg.toLowerCase()))
          );
          score += matchedGenres.length * 16;
          matchedGenres.forEach(mg => {
            if (vibeTags.length < 4 && !vibeTags.includes(mg)) vibeTags.push(mg);
          });
        });

        score += (parseFloat(anime.rating) || 8.5) * 1.5;
        return { anime, score, vibeTags: vibeTags.slice(0, 3) };
      });

      scored.sort((a, b) => b.score - a.score);
      const topPicks = scored.slice(0, 6);

      if (summaryEl) {
        summaryEl.classList.remove('hidden');
        const negText = negations.length ? ` • Исключены элементы: <b>${negations.join(', ')}</b>` : '';
        summaryEl.innerHTML = `<b>Автономный анализ тропов:</b> Подобрано по вайбу и ограничениям${negText}. Для полноценного анализа через нейросеть запустите <code>python backend.py</code>.`;
      }

      resEl.innerHTML = topPicks.map(entry => {
        const a = entry.anime;
        const matchPct = Math.min(98, Math.max(80, Math.round(78 + Math.min(20, entry.score / 3))));
        const tags = entry.vibeTags.length ? entry.vibeTags : (a.genres || []).slice(0, 3);
        const safeTitle = (a.title || '').replace(/'/g, "\'");
        const clickAction = a.releaseId
          ? `openAnimePlayer(${JSON.stringify(a).replace(/'/g, '&#39;')})`
          : `document.getElementById('searchInput').value='${safeTitle}'; handleSearchInput('${safeTitle}'); navigateTo('home');`;

        return `
          <div onclick="${clickAction}" class="bg-dark-800 border border-white/10 hover:border-brand-500/60 rounded-2xl overflow-hidden cursor-pointer transition flex flex-col group shadow-lg">
            <div class="relative h-52 overflow-hidden bg-dark-900">
              <img src="${a.poster}" onerror="this.src='https://placehold.co/320x450/131620/f43f5e?text=VIBE+PICK'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30"></div>
              <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg bg-brand-600 text-white text-[10px] font-black shadow-md">
                ${matchPct}% совпадение
              </span>
              <span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-black/75 text-amber-300 text-[11px] font-bold">
                ★ ${a.rating}
              </span>
              <div class="absolute bottom-2 left-2.5 right-2.5 flex flex-wrap gap-1">
                ${tags.map(t => `<span class="px-1.5 py-0.5 rounded bg-black/85 border border-brand-500/40 text-[9px] font-bold text-brand-300">${t}</span>`).join('')}
              </div>
            </div>
            <div class="p-3.5 flex-1 flex flex-col justify-between space-y-1.5">
              <div>
                <div class="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-brand-300">${getAnimeDisplayTitle(a)}</div>
                <div class="text-[10px] font-mono text-zinc-400">${a.altTitle || ''} • ${a.year || ''}</div>
              </div>
              <p class="text-[11px] text-zinc-300 line-clamp-3 leading-relaxed">${a.desc}</p>
            </div>
          </div>
        `;
      }).join('');
    }

    async function loadRedditEpisodePulse(forceRefresh = false) {
      const box = document.getElementById('redditPulseContainer');
      if (!box || !state.currentAnime) return;

      const searchTitle = state.currentAnime.altTitle || state.currentAnime.title;
      const ruTitle = state.currentAnime.title;
      const ep = state.currentEpisode || 1;

      box.innerHTML = `
        <div class="flex items-center gap-2.5 text-orange-300 py-2">
          <div class="w-4 h-4 rounded-full border-2 border-orange-400 border-t-transparent animate-spin shrink-0"></div>
          <span>Ищем тред обсуждения <b>«${searchTitle} — Episode ${ep}»</b> на r/anime и очищаем от спойлеров через Gemini...</span>
        </div>
      `;

      try {
        const url = `${KITSUNE_BACKEND_URL}/api/reddit-pulse?anime_title=${encodeURIComponent(searchTitle)}&ru_title=${encodeURIComponent(ruTitle)}&episode=${ep}&force=${forceRefresh ? '1' : '0'}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Не удалось получить выжимку с сервера');

        box.innerHTML = `
          <div class="space-y-3 pt-1">
            <div class="flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-400 border-b border-white/10 pb-2">
              <a href="${data.reddit_url || 'https://www.reddit.com/r/anime'}" target="_blank" rel="noopener noreferrer" class="truncate font-mono text-orange-300 hover:underline max-w-md" title="Открыть оригинальный тред на Reddit">
                🔗 ${data.thread_title}
              </a>
              <div class="flex items-center gap-1.5 shrink-0">
                ${data.cached ? `<span class="px-2 py-0.5 rounded bg-white/10 text-zinc-300 text-[10px] font-mono">Из SQLite-кэша</span>` : ''}
                <span class="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold">
                  Рейтинг серии: ${data.community_score}/100
                </span>
              </div>
            </div>
            <p class="text-xs text-white font-medium italic bg-black/30 p-2.5 rounded-xl border border-white/5">
              «${data.episode_verdict}»
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-1.5">
                <div class="text-[10px] font-black uppercase tracking-wider text-emerald-400">👍 За что хвалят серию:</div>
                <ul class="list-disc list-inside text-[11px] text-zinc-200 space-y-1">
                  ${(data.praised_for || []).map(p => `<li>${p}</li>`).join('')}
                </ul>
              </div>
              <div class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 space-y-1.5">
                <div class="text-[10px] font-black uppercase tracking-wider text-rose-400">👎 За что ругают / спорно:</div>
                <ul class="list-disc list-inside text-[11px] text-zinc-200 space-y-1">
                  ${(data.criticized_for || []).map(c => `<li>${c}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        `;
      } catch (e) {
        box.innerHTML = `
          <div class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 space-y-1">
            <div class="font-bold">Бэкенд-сервер парсера Reddit сейчас не запущен или недоступен (${e.message})</div>
            <div class="text-[11px] text-zinc-300">Запустите локальный сервер командой <code>python backend.py</code> (инструкция в архиве), чтобы парсить живые треды r/anime в один клик.</div>
          </div>
        `;
      }
    }

    setTimeout(checkKitsuneBackendHealth, 600);

    function renderThemeSelectors() {
      const miniGrid = document.getElementById('themeMiniMenuGrid');
      const settingsGrid = document.getElementById('settingsThemeCardsGrid');
      const entries = Object.entries(DESIGN_THEMES);

      if (miniGrid) {
        miniGrid.innerHTML = entries.map(([key, t]) => `
          <button
            type="button"
            data-mini-theme="${key}"
            onclick="applySeasonTheme('${key}'); document.getElementById('themeMiniMenuDropdown').classList.add('hidden');"
            style="background:${t.surface}; border-color:${t.border}"
            class="mini-theme-pill flex items-center gap-2 px-2.5 py-2 rounded-xl border text-left text-xs font-semibold text-zinc-100 transition hover:scale-[1.02] cursor-pointer"
          >
            <span class="w-3 h-3 rounded-full shrink-0 shadow-sm" style="background:${t.dot}; box-shadow: 0 0 8px ${t.dot}"></span>
            <span class="truncate">${t.name}</span>
          </button>
        `).join('');
      }

      if (settingsGrid) {
        settingsGrid.innerHTML = entries.map(([key, t]) => `
          <button
            type="button"
            data-theme-card="${key}"
            onclick="applySeasonTheme('${key}')"
            style="background: linear-gradient(145deg, ${t.surface}, ${t.bg}); border-color:${t.border}"
            class="theme-preset-btn p-3.5 rounded-2xl border text-left transition hover:scale-[1.03] cursor-pointer flex flex-col justify-between gap-2"
          >
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-bold text-white truncate">${t.name}</span>
              <span class="w-3.5 h-3.5 rounded-full shrink-0" style="background:${t.dot}; box-shadow: 0 0 10px ${t.dot}"></span>
            </div>
            <div class="text-[11px] text-zinc-300 leading-snug">${t.desc || 'Стиль оформления'}</div>
          </button>
        `).join('');
      }
    }

    function getSeasonParticleSvg(season) {
      if (season === 'frieren_moon') {
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#38bdf8" stroke-width="1.4" stroke-dasharray="4 2"/><polygon points="12,3 19.8,16.5 4.2,16.5" stroke="#fde047" stroke-width="1.3" fill="none"/><polygon points="12,21 19.8,7.5 4.2,7.5" stroke="#7dd3fc" stroke-width="1.3" fill="none"/><circle cx="12" cy="12" r="2.2" fill="#ffffff"/></svg>`;
      }
      if (season === 'cat') {
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="#fbbf24" fill-opacity="0.85"><circle cx="12" cy="15" r="4.5"/><circle cx="6.5" cy="9.5" r="2.2"/><circle cx="10" cy="7" r="2.2"/><circle cx="14" cy="7" r="2.2"/><circle cx="17.5" cy="9.5" r="2.2"/></svg>`;
      }
      if (season === 'spring') {
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.5 6 5 10.5 6.5 16C7.5 19.2 10 21 12 22C14 21 16.5 19.2 17.5 16C19 10.5 15.5 6 12 2Z" fill="#f472b6" fill-opacity="0.85"/></svg>`;
      }
      if (season === 'winter') {
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" stroke-width="1.8" stroke-linecap="round"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/></svg>`;
      }
      if (season === 'autumn') {
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="#fb923c" fill-opacity="0.88"><path d="M12 2L14.5 8.5L21 7.5L16.5 13L19.5 18.5L13 17V22H11V17L4.5 18.5L7.5 13L3 7.5L9.5 8.5L12 2Z"/></svg>`;
      }
      if (season === 'abyss') {
        return `<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="6" stroke="#22d3ee" stroke-width="1.5" fill="#06b6d4" fill-opacity="0.22"/></svg>`;
      }
      if (season === 'sunset') {
        return `<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><polygon points="10,1 19,10 10,19 1,10" stroke="#ec4899" stroke-width="1.6" fill="#ec4899" fill-opacity="0.25"/></svg>`;
      }
      if (season === 'sakura_night') {
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="#c084fc" fill-opacity="0.82"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`;
      }
      if (season === 'emerald') {
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="#34d399" fill-opacity="0.8"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8Z"/></svg>`;
      }
      if (season === 'haikyuu') {
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fb923c" stroke-width="1.8"><circle cx="12" cy="12" r="9" fill="#f97316" fill-opacity="0.22"/><path d="M4.5 9.5c4.5 0 9.5 2.5 13 7.5M6.5 17.5c3-4.5 8-6.5 13-5.5M12 3c2 4.5 2 10.5-1.5 17.5"/></svg>`;
      }
      if (season === 'horimiya') {
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="#f472b6" fill-opacity="0.85"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
      }
      if (season === 'jjk') {
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="7" stroke="#c084fc" stroke-width="2" fill="#9333ea" fill-opacity="0.32"/><circle cx="12" cy="12" r="2.5" fill="#f43f5e"/></svg>`;
      }
      if (season === 'sao') {
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polygon points="12,2 20,9 12,22 4,9" stroke="#38bdf8" stroke-width="1.8" fill="#0ea5e9" fill-opacity="0.3"/></svg>`;
      }
      if (season === 'netflix') {
        return `<svg width="16" height="20" viewBox="0 0 24 30" fill="none"><path d="M4 2h5l7 18V2h4v26h-5L8 10v18H4V2z" fill="#e50914" fill-opacity="0.75"/></svg>`;
      }
      if (season === 'crunchyroll') {
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#f47521" stroke-width="2.2" fill="#f47521" fill-opacity="0.22"/><circle cx="13.5" cy="12.5" r="4.5" fill="#fab818" fill-opacity="0.65"/></svg>`;
      }
      return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L10.2 5.8L15 8L10.2 10.2L8 15L5.8 10.2L1 8L5.8 5.8L8 1Z" fill="var(--brand-400)" fill-opacity="0.75"/></svg>`;
    }

    function renderSeasonParticles(season) {
      const layer = document.getElementById('seasonParticlesLayer');
      if (!layer) return;
      if (state.siteSettings.smoothAnim === false) {
        layer.innerHTML = '';
        return;
      }
      const svg = getSeasonParticleSvg(season);
      let html = '';
      for (let i = 0; i < 8; i++) {
        const left = ((i * 37) % 96) + 2;
        const dur = (11 + (i % 5) * 2).toFixed(1);
        const delay = (-1 * (i * 1.5)).toFixed(1);
        const sway = ((i % 2 === 0 ? 1 : -1) * (22 + (i % 4) * 10)) + 'px';
        const scale = (0.75 + (i % 3) * 0.2).toFixed(2);
        const maxOp = (0.45 + (i % 3) * 0.12).toFixed(2);
        html += `<div class="season-particle" style="--x:${left}%;--dur:${dur}s;--delay:${delay}s;--sway:${sway};--scale:${scale};--max-op:${maxOp}">${svg}</div>`;
      }
      layer.innerHTML = html;
    }

    // Отрисовка уникального живого фона и синхронизация статуса сферы Омикудзи
    // ---------- ШЕЙДЕРНЫЕ ФОНЫ (WebGL, лёгкие: половинное разрешение, 30 fps, пауза в фоне) ----------
    const SHADER_LOOKS = {
      cosmos:    { c: ['#05030f', '#3b1a7a', '#d6338a', '#ffc86b'], vein: 0.30, stars: 1, speed: 1.0 },
      liquidgold:{ c: ['#050403', '#14100a', '#2a1f0d', '#f3d27a'], vein: 1.00, stars: 0, speed: 0.8 },
      curse:     { c: ['#04010a', '#2a0a4a', '#c4122c', '#ff6b7e'], vein: 0.65, stars: 0, speed: 1.3 },
      biolum:    { c: ['#00060f', '#04304a', '#0a8f9e', '#8ff5e6'], vein: 0.45, stars: 1, speed: 0.9 }
    };
    let shaderBgState = null;

    function stopShaderBg() {
      if (!shaderBgState) return;
      cancelAnimationFrame(shaderBgState.raf);
      document.removeEventListener('visibilitychange', shaderBgState.onVis);
      window.removeEventListener('resize', shaderBgState.onResize);
      try { const ext = shaderBgState.gl.getExtension('WEBGL_lose_context'); if (ext) ext.loseContext(); } catch (e) {}
      shaderBgState = null;
    }

    function startShaderBg(stage, key) {
      const look = SHADER_LOOKS[key];
      const hex = (h) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
      stage.innerHTML = `
        <div style="position:absolute;inset:0;background:linear-gradient(160deg,${look.c[0]},${look.c[1]} 55%,${look.c[2]});"></div>
        <canvas id="shaderBgCanvas" style="position:absolute;inset:0;width:100%;height:100%;display:block;"></canvas>
        <div style="position:absolute;inset:0;background:radial-gradient(ellipse 90% 80% at 50% 45%, transparent 50%, rgba(0,0,0,.45) 100%);"></div>`;
      const cv = stage.querySelector('#shaderBgCanvas');
      const gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
      if (!gl) return;
      const vs = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }';
      const fs = `
        #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
        #else
        precision mediump float;
        #endif
        uniform vec2 uRes; uniform float uT; uniform float uVein; uniform float uStars;
        uniform vec3 c0; uniform vec3 c1; uniform vec3 c2; uniform vec3 c3;
        float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
        float n(vec2 p){ vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
          return mix(mix(h(i), h(i + vec2(1.0, 0.0)), f.x), mix(h(i + vec2(0.0, 1.0)), h(i + vec2(1.0, 1.0)), f.x), f.y); }
        float fbm(vec2 p){ float v = 0.0; float a = 0.5; for (int i = 0; i < 4; i++) { v += a * n(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; } return v; }
        void main(){
          vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
          float tt = uT * 0.06;
          vec2 q = vec2(fbm(uv * 1.4 + tt), fbm(uv * 1.4 + vec2(5.2, 1.3) - tt));
          vec2 w = vec2(fbm(uv * 1.6 + 2.0 * q + vec2(1.7, 9.2) + tt * 1.3), fbm(uv * 1.6 + 2.0 * q + vec2(8.3, 2.8) - tt));
          float f = fbm(uv * 1.5 + 2.5 * w);
          vec3 col = mix(c0, c1, smoothstep(0.15, 0.75, f));
          col = mix(col, c2, smoothstep(0.3, 1.0, length(q)) * 0.75 * (1.0 - uVein * 0.6));
          float vein = pow(max(0.0, 1.0 - abs(f - 0.52) * 2.2), mix(2.0, 7.0, uVein));
          col += c3 * vein * (0.35 + uVein * 0.9);
          col += c3 * pow(f, 4.0) * 0.25 * (1.0 - uVein);
          float s = step(0.997, h(floor(gl_FragCoord.xy * 0.5)));
          col += s * uStars * (0.5 + 0.5 * sin(uT * 2.0 + h(floor(gl_FragCoord.xy * 0.5) + 3.0) * 30.0)) * 0.8;
          float vg = smoothstep(1.25, 0.3, length(uv * vec2(0.8, 1.0)));
          col *= mix(0.45, 1.0, vg) * 0.9;
          gl_FragColor = vec4(col, 1.0);
        }`;
      const mk = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : (console.warn('shader:', gl.getShaderInfoLog(s)), null); };
      const v = mk(gl.VERTEX_SHADER, vs), f = mk(gl.FRAGMENT_SHADER, fs);
      if (!v || !f) { cv.remove(); return; }
      const prog = gl.createProgram(); gl.attachShader(prog, v); gl.attachShader(prog, f); gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { cv.remove(); return; }
      gl.useProgram(prog);
      const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      const U = (n) => gl.getUniformLocation(prog, n);
      look.c.forEach((c, i) => gl.uniform3fv(U('c' + i), hex(c)));
      gl.uniform1f(U('uVein'), look.vein); gl.uniform1f(U('uStars'), look.stars);
      const SCALE = 0.5;
      const resize = () => { cv.width = Math.max(2, Math.round(cv.clientWidth * SCALE)); cv.height = Math.max(2, Math.round(cv.clientHeight * SCALE)); gl.viewport(0, 0, cv.width, cv.height); gl.uniform2f(U('uRes'), cv.width, cv.height); };
      resize();
      const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const st = { gl, raf: 0, last: 0, t0: performance.now() };
      const draw = (now) => {
        if (!document.hidden && now - st.last >= 33) {
          st.last = now;
          gl.uniform1f(U('uT'), 20 + (now - st.t0) / 1000 * look.speed);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
        }
        if (!still) st.raf = requestAnimationFrame(draw);
      };
      st.onVis = () => { if (!document.hidden && !still) { cancelAnimationFrame(st.raf); st.raf = requestAnimationFrame(draw); } };
      st.onResize = () => { resize(); if (still) draw(performance.now() + 100); };
      document.addEventListener('visibilitychange', st.onVis);
      window.addEventListener('resize', st.onResize);
      shaderBgState = st;
      draw(performance.now() + 100);
    }

    function renderAnimeUniverseBackdropAndEmblem(themeKey, morphKey) {
      const stage = document.getElementById('animeUniverseBgLayer');
      const topStatus = document.getElementById('omikujiTopStatus');
      const activeKey = (morphKey && morphKey !== 'spatial') ? morphKey : themeKey;

      const WORLD_TAGS = {
        haikyuu: 'HARUKO // COURT #1',
        horimiya: 'HORIMIYA // PAGE 14',
        jjk: 'JUJUTSU // DOMAIN',
        sao: 'AINCRAD // FLOOR 100',
        netflix: 'NETFLIX // N SERIES',
        crunchyroll: 'CRUNCHYROLL // MEGA FAN',
        nerv: 'MAGI // TERMINAL',
        manga: 'SHONEN // INK',
        ukiyoe: 'UKIYO-E // SCROLL',
        kimi: 'KOMET // 03:12',
        kintsugi: 'KINTSUGI // 金'
      };
      if (topStatus) {
        topStatus.textContent = WORLD_TAGS[activeKey] || 'ОМИКУДЗИ // ДЕНЬ';
      }

      if (!stage) return;
      stopShaderBg();

      // Полноценные детализированные аниме-сцены на заднем плане
      if (activeKey === 'netflix' || themeKey === 'netflix') {
        stage.innerHTML = `
          <!-- NETFLIX TUDUM PRISM SPECTRUM & N-RIBBON CINEMA STAGE -->
          <div style="position:absolute;inset:0;background:
            radial-gradient(ellipse 85% 55% at 50% 0%, rgba(229,9,20,0.34) 0%, rgba(178,7,16,0.14) 48%, transparent 75%),
            linear-gradient(180deg, #0a0a0a 0%, #141414 45%, #0d0d0d 100%);"></div>

          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;opacity:0.85;">
            <defs>
              <linearGradient id="nfBeamRed" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#e50914" stop-opacity="0"/>
                <stop offset="35%" stop-color="#e50914" stop-opacity="0.55"/>
                <stop offset="65%" stop-color="#ff1f2c" stop-opacity="0.72"/>
                <stop offset="100%" stop-color="#e50914" stop-opacity="0"/>
              </linearGradient>
              <linearGradient id="nfBeamCrimson" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#831010" stop-opacity="0"/>
                <stop offset="50%" stop-color="#b20710" stop-opacity="0.48"/>
                <stop offset="100%" stop-color="#831010" stop-opacity="0"/>
              </linearGradient>
              <linearGradient id="nfRibbonLeft" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#b20710"/>
                <stop offset="100%" stop-color="#7a040a"/>
              </linearGradient>
              <linearGradient id="nfRibbonCenter" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ff2a35"/>
                <stop offset="50%" stop-color="#e50914"/>
                <stop offset="100%" stop-color="#9e050d"/>
              </linearGradient>
            </defs>

            <!-- Вертикальные спектральные световые лучи заставки Netflix Tudum -->
            <g opacity="0.65">
              <rect x="120" y="0" width="16" height="900" fill="url(#nfBeamCrimson)"/>
              <rect x="195" y="0" width="6" height="900" fill="url(#nfBeamRed)"/>
              <rect x="280" y="0" width="28" height="900" fill="url(#nfBeamRed)" opacity="0.5"/>
              <rect x="440" y="0" width="10" height="900" fill="url(#nfBeamCrimson)"/>
              <rect x="590" y="0" width="38" height="900" fill="url(#nfBeamRed)" opacity="0.35"/>
              <rect x="860" y="0" width="14" height="900" fill="url(#nfBeamRed)" opacity="0.55"/>
              <rect x="980" y="0" width="32" height="900" fill="url(#nfBeamCrimson)"/>
              <rect x="1160" y="0" width="8" height="900" fill="url(#nfBeamRed)"/>
              <rect x="1270" y="0" width="22" height="900" fill="url(#nfBeamRed)" opacity="0.45"/>
            </g>

            <!-- Объёмная лента-монограмма «N» Netflix справа в перспективе -->
            <g transform="translate(980, 120) scale(1.05)" opacity="0.34">
              <!-- Левая вертикальная стойка N -->
              <polygon points="40,20 115,20 115,520 40,540" fill="url(#nfRibbonLeft)"/>
              <!-- Правая вертикальная стойка N -->
              <polygon points="245,20 320,20 320,540 245,520" fill="url(#nfRibbonLeft)"/>
              <!-- Центральная диагональная лента с тенью -->
              <polygon points="40,20 118,20 320,540 242,540" fill="url(#nfRibbonCenter)"/>
            </g>

            <!-- Тёмная виньетка кинозала снизу и по краям -->
            <rect x="0" y="640" width="1440" height="260" fill="url(#nfBeamCrimson)" opacity="0.25"/>
          </svg>
        `;
      } else if (activeKey === 'crunchyroll' || themeKey === 'crunchyroll') {
        stage.innerHTML = `
          <!-- CRUNCHYROLL HIME ORANGE SWIRL & SIMULCAST STAGE -->
          <div style="position:absolute;inset:0;background:
            radial-gradient(circle at 82% 24%, rgba(244,117,33,0.40) 0%, rgba(217,94,14,0.18) 38%, transparent 68%),
            radial-gradient(circle at 16% 80%, rgba(250,184,24,0.22) 0%, rgba(244,117,33,0.12) 42%, transparent 70%),
            linear-gradient(180deg, #08090b 0%, #141519 52%, #090a0d 100%);"></div>

          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;opacity:0.88;">
            <defs>
              <linearGradient id="crOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fab818"/>
                <stop offset="50%" stop-color="#f47521"/>
                <stop offset="100%" stop-color="#c94b05"/>
              </linearGradient>
              <linearGradient id="crDiagonalStripe" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#f47521" stop-opacity="0"/>
                <stop offset="50%" stop-color="#f47521" stop-opacity="0.28"/>
                <stop offset="100%" stop-color="#fab818" stop-opacity="0"/>
              </linearGradient>
            </defs>

            <!-- Динамические диагональные полосы эфира Crunchyroll Simulcast -->
            <g transform="rotate(-14 720 450)">
              <rect x="-200" y="180" width="1840" height="42" fill="url(#crDiagonalStripe)"/>
              <rect x="-200" y="540" width="1840" height="24" fill="url(#crDiagonalStripe)"/>
              <line x1="-200" y1="235" x2="1640" y2="235" stroke="#f47521" stroke-width="2" stroke-opacity="0.35" stroke-dasharray="28 14"/>
              <line x1="-200" y1="515" x2="1640" y2="515" stroke="#fab818" stroke-width="1.5" stroke-opacity="0.28" stroke-dasharray="18 12"/>
            </g>

            <!-- Большой фирменный логотип-вихрь (Eye Swirl) Crunchyroll справа -->
            <g transform="translate(1070, 320)" opacity="0.34" style="animation:floatSlowPulse 9s ease-in-out infinite;">
              <!-- Внешнее оранжевое кольцо с разрезом -->
              <path d="M 0,-230 A 230,230 0 1,1 -215,82 A 185,185 0 1,0 32,-175 Z" fill="url(#crOrangeGrad)"/>
              <!-- Внутренний глаз-ядро -->
              <circle cx="28" cy="24" r="118" fill="url(#crOrangeGrad)"/>
              <!-- Белый блик в углу глаза Crunchyroll -->
              <circle cx="-38" cy="-34" r="36" fill="#141519"/>
            </g>

            <!-- Малый вихрь слева внизу -->
            <g transform="translate(210, 690) scale(0.52)" opacity="0.22">
              <path d="M 0,-230 A 230,230 0 1,1 -215,82 A 185,185 0 1,0 32,-175 Z" fill="url(#crOrangeGrad)"/>
              <circle cx="28" cy="24" r="118" fill="url(#crOrangeGrad)"/>
              <circle cx="-38" cy="-34" r="36" fill="#141519"/>
            </g>
          </svg>
        `;
      } else if (activeKey === 'haikyuu' || themeKey === 'haikyuu') {
        stage.innerHTML = `
          <!-- КУЛЬТОВЫЙ КАДР: ХИНАТА #10 ПЕРЕД СЕТКОЙ В ЗАЛЕ КАРАСУНО НА ЗАКАТЕ -->
          <div style="position:absolute;inset:0;background:linear-gradient(180deg, #7c4a1e 0%, #b86f28 32%, #9a5820 68%, #5c3414 100%);"></div>

          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;opacity:0.88;filter:blur(1.5px);">
            <defs>
              <!-- Тёплые деревянные панели стены спортзала -->
              <linearGradient id="gymBackWallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#d98a36"/>
                <stop offset="35%" stop-color="#c47424"/>
                <stop offset="70%" stop-color="#a85d1a"/>
                <stop offset="100%" stop-color="#854512"/>
              </linearGradient>

              <!-- Косой солнечный свет из окон слева -->
              <linearGradient id="windowSunRay" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fef08a" stop-opacity="0.72"/>
                <stop offset="45%" stop-color="#fde047" stop-opacity="0.34"/>
                <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
              </linearGradient>

              <!-- Бордовый занавес сцены -->
              <linearGradient id="stageCurtainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#5c1916"/>
                <stop offset="50%" stop-color="#7f231f"/>
                <stop offset="100%" stop-color="#4a1210"/>
              </linearGradient>

              <!-- Паркет спортзала -->
              <linearGradient id="gymFloorWood" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#9c6b3b"/>
                <stop offset="45%" stop-color="#85562a"/>
                <stop offset="100%" stop-color="#593718"/>
              </linearGradient>

              <!-- Красные мягкие стойки сетки -->
              <linearGradient id="redPostPad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#7f1d1d"/>
                <stop offset="45%" stop-color="#b91c1c"/>
                <stop offset="75%" stop-color="#dc2626"/>
                <stop offset="100%" stop-color="#651717"/>
              </linearGradient>

              <!-- Мелкая ячейка волейбольной сетки -->
              <pattern id="vbNetMesh" width="14" height="14" patternUnits="userSpaceOnUse">
                <path d="M 14 0 L 0 0 0 14" fill="none" stroke="#ffffff" stroke-width="0.75" stroke-opacity="0.32"/>
              </pattern>

              <!-- Мягкое вечернее затемнение по краям для читаемости интерфейса -->
              <radialGradient id="gymVignette" cx="50%" cy="52%" r="65%">
                <stop offset="0%" stop-color="#000000" stop-opacity="0.08"/>
                <stop offset="70%" stop-color="#0e0804" stop-opacity="0.38"/>
                <stop offset="100%" stop-color="#090503" stop-opacity="0.72"/>
              </radialGradient>
            </defs>

            <!-- 1. ЗАДНЯЯ СТЕНА СПОРТЗАЛА С ДЕРЕВЯННЫМИ ПАНЕЛЯМИ -->
            <rect x="0" y="0" width="1440" height="755" fill="url(#gymBackWallGrad)"/>

            <!-- Вертикальные секции деревянных панелей -->
            <g stroke="#783f12" stroke-opacity="0.35" stroke-width="2">
              <line x1="160" y1="160" x2="160" y2="755"/>
              <line x1="295" y1="160" x2="295" y2="755"/>
              <line x1="430" y1="160" x2="430" y2="755"/>
              <line x1="565" y1="160" x2="565" y2="335"/>
              <line x1="720" y1="160" x2="720" y2="335"/>
              <line x1="875" y1="160" x2="875" y2="335"/>
              <line x1="1010" y1="160" x2="1010" y2="755"/>
              <line x1="1145" y1="160" x2="1145" y2="755"/>
              <line x1="1280" y1="160" x2="1280" y2="755"/>
            </g>
            <!-- Горизонтальная балка стены -->
            <rect x="0" y="158" width="1440" height="18" fill="#8f4d17" stroke="#6b370e" stroke-width="1.5"/>

            <!-- 2. ИЗОГНУТЫЙ СВОД КРЫШИ СПОРТЗАЛА СВЕРХУ -->
            <path d="M0,0 L1440,0 L1440,155 Q720,-42 0,155 Z" fill="#57534e" fill-opacity="0.78"/>
            <path d="M-20,162 Q720,-35 1460,162" fill="none" stroke="#a8a29e" stroke-width="18" stroke-opacity="0.7"/>
            <path d="M-20,148 Q720,-48 1460,148" fill="none" stroke="#d6d3d1" stroke-width="6" stroke-opacity="0.65"/>

            <!-- 3. ЯРКИЕ SOLНЕЧНЫЕ ОКНА И КОСЫЕ ЛУЧИ СЛЕВА НА СТЕНЕ -->
            <g opacity="0.9">
              <!-- Световые прямоугольники от окна на стене слева -->
              <polygon points="0,205 155,305 155,415 0,315" fill="#fef08a" fill-opacity="0.58"/>
              <polygon points="0,330 155,430 155,525 0,425" fill="#fde047" fill-opacity="0.48"/>
              <!-- Широкий солнечный поток через зал -->
              <polygon points="0,190 680,580 520,755 0,460" fill="url(#windowSunRay)" style="mix-blend-mode:screen;"/>
            </g>

            <!-- 4. БОКОВЫЕ БАЛКОНЫ И ДВЕРИ СЛЕВА И СПРАВА -->
            <!-- Левый балкон и дверь -->
            <polygon points="0,415 86,470 86,545 0,505" fill="#d6c5b3" stroke="#785a3c" stroke-width="2"/>
            <line x1="0" y1="388" x2="86" y2="445" stroke="#e7e5e4" stroke-width="3" stroke-opacity="0.8"/>
            <rect x="36" y="595" width="168" height="160" fill="#a89984" stroke="#5c4028" stroke-width="4"/>
            <line x1="120" y1="595" x2="120" y2="755" stroke="#5c4028" stroke-width="2.5"/>

            <!-- Правый балкон и дверь -->
            <polygon points="1440,415 1354,470 1354,545 1440,505" fill="#c7b299" stroke="#785a3c" stroke-width="2"/>
            <line x1="1440" y1="388" x2="1354" y2="445" stroke="#e7e5e4" stroke-width="3" stroke-opacity="0.8"/>
            <rect x="1236" y="595" width="168" height="160" fill="#9c8d7a" stroke="#5c4028" stroke-width="4"/>
            <line x1="1320" y1="595" x2="1320" y2="755" stroke="#5c4028" stroke-width="2.5"/>

            <!-- 5. ЭМБЛЕМА ШКОЛЫ, НАСТЕННЫЕ КОЛОНКИ И ЧАСЫ -->
            <!-- Круглая серебряная эмблема над сценой -->
            <g transform="translate(720, 255)">
              <circle cx="0" cy="0" r="32" fill="#78716c" stroke="#57534e" stroke-width="3"/>
              <circle cx="0" cy="0" r="26" fill="#a8a29e" stroke="#d6d3d1" stroke-width="1.5"/>
              <path d="M-14,-6 L0,-18 L14,-6 L10,14 L-10,14 Z" fill="#57534e" opacity="0.75"/>
            </g>

            <!-- Настенные колонки по бокам от сцены -->
            <rect x="184" y="388" width="24" height="74" rx="3" fill="#3f3a36" stroke="#1c1917" stroke-width="2"/>
            <rect x="1232" y="388" width="24" height="74" rx="3" fill="#3f3a36" stroke="#1c1917" stroke-width="2"/>

            <!-- Круглые школьные часы справа -->
            <g transform="translate(1296, 428)">
              <circle cx="0" cy="0" r="24" fill="#f5f5f4" stroke="#78716c" stroke-width="4"/>
              <circle cx="0" cy="0" r="2" fill="#1c1917"/>
              <line x1="0" y1="0" x2="-7" y2="-10" stroke="#1c1917" stroke-width="2.2" stroke-linecap="round"/>
              <line x1="0" y1="0" x2="10" y2="-4" stroke="#1c1917" stroke-width="1.8" stroke-linecap="round"/>
            </g>

            <!-- 6. ЦЕНТРАЛЬНАЯ СЦЕНА С БОРДОВЫМ ЗАНАВЕСОМ И ДЕРЕВЯННЫМ ПОДИУМОМ -->
            <g transform="translate(300, 336)">
              <!-- Рама сцены -->
              <rect x="0" y="0" width="840" height="398" fill="#523018" stroke="#3b200d" stroke-width="5"/>
              <!-- Внутренняя ниша сцены -->
              <rect x="16" y="14" width="808" height="296" fill="#9e8c82"/>
              <rect x="16" y="14" width="808" height="90" fill="#6b5b53" opacity="0.55"/>

              <!-- Боковые портьеры бордового занавеса -->
              <path d="M16,14 L112,14 L92,310 L16,310 Z" fill="url(#stageCurtainGrad)"/>
              <path d="M36,14 L32,310 M56,14 L50,310 M78,14 L70,310" stroke="#3b0a08" stroke-width="2.5" opacity="0.6"/>

              <path d="M728,14 L824,14 L824,310 L748,310 Z" fill="url(#stageCurtainGrad)"/>
              <path d="M755,14 L765,310 M780,14 L788,310 M802,14 L808,310" stroke="#3b0a08" stroke-width="2.5" opacity="0.6"/>

              <!-- Верхний ламбрекен занавеса со складками и золотой бахромой -->
              <path d="M16,14 L824,14 L824,84
                       Q780,94 740,82 Q700,94 660,82 Q620,94 580,82 Q540,94 500,82
                       Q460,94 420,82 Q380,94 340,82 Q300,94 260,82 Q220,94 180,82
                       Q140,94 100,82 Q60,94 16,84 Z"
                    fill="url(#stageCurtainGrad)"/>
              <!-- Золотая бахрома по краю верхнего занавеса -->
              <path d="M16,84
                       Q60,94 100,82 Q140,94 180,82 Q220,94 260,82 Q300,94 340,82
                       Q380,94 420,82 Q460,94 500,82 Q540,94 580,82 Q620,94 660,82
                       Q700,94 740,82 Q780,94 824,84"
                    fill="none" stroke="#eab308" stroke-width="5" stroke-opacity="0.88"/>

              <!-- Нижние деревянные тумбы подиума сцены -->
              <rect x="6" y="310" width="828" height="14" fill="#8c5828" stroke="#4a2c10" stroke-width="2"/>
              <rect x="12" y="324" width="816" height="74" fill="#9c632e" stroke="#4a2c10" stroke-width="2"/>
              <g stroke="#4a2c10" stroke-width="2">
                <line x1="114" y1="324" x2="114" y2="398"/>
                <line x1="216" y1="324" x2="216" y2="398"/>
                <line x1="318" y1="324" x2="318" y2="398"/>
                <line x1="420" y1="324" x2="420" y2="398"/>
                <line x1="522" y1="324" x2="522" y2="398"/>
                <line x1="624" y1="324" x2="624" y2="398"/>
                <line x1="726" y1="324" x2="726" y2="398"/>
              </g>
            </g>

            <!-- 7. ПОЛИРОВАННЫЙ ПАРКЕТ СПОРТЗАЛА И ЛИНИИ РАЗМЕТКИ -->
            <rect x="0" y="734" width="1440" height="166" fill="url(#gymFloorWood)"/>
            <!-- Тёмный плинтус вдоль стены -->
            <rect x="0" y="730" width="1440" height="8" fill="#3b200d"/>
            <!-- Белые линии волейбольной площадки -->
            <line x1="0" y1="788" x2="1440" y2="788" stroke="#f5f5f4" stroke-width="3" stroke-opacity="0.55"/>
            <line x1="210" y1="738" x2="60" y2="900" stroke="#f5f5f4" stroke-width="2.5" stroke-opacity="0.4"/>
            <line x1="1230" y1="738" x2="1380" y2="900" stroke="#f5f5f4" stroke-width="2.5" stroke-opacity="0.4"/>

            <!-- 8. ВОЛЕЙБОЛЬНАЯ СЕТКА С КРАСНЫМИ СТОЙКАМИ ВО ВСЮ ШИРИНУ ЗАЛА -->
            <g>
              <!-- Металлические внутренние штанги стоек -->
              <rect x="110" y="534" width="10" height="225" fill="#a8a29e" stroke="#57534e" stroke-width="1.5"/>
              <rect x="1320" y="534" width="10" height="225" fill="#a8a29e" stroke="#57534e" stroke-width="1.5"/>

              <!-- Красные мягкие защитные кожухи на стойках -->
              <rect x="96" y="596" width="38" height="170" rx="6" fill="url(#redPostPad)" stroke="#450a0a" stroke-width="2"/>
              <rect x="1306" y="596" width="38" height="170" rx="6" fill="url(#redPostPad)" stroke="#450a0a" stroke-width="2"/>

              <!-- Натянутые тросы от стоек к сетке -->
              <line x1="115" y1="538" x2="162" y2="538" stroke="#e7e5e4" stroke-width="2.5"/>
              <line x1="1280" y1="538" x2="1325" y2="538" stroke="#e7e5e4" stroke-width="2.5"/>
              <line x1="134" y1="664" x2="162" y2="664" stroke="#e7e5e4" stroke-width="2"/>
              <line x1="1280" y1="664" x2="1306" y2="664" stroke="#e7e5e4" stroke-width="2"/>

              <!-- Полотно сетки -->
              <rect x="162" y="538" width="1118" height="128" fill="url(#vbNetMesh)"/>
              <rect x="162" y="538" width="1118" height="128" fill="#000000" fill-opacity="0.16"/>

              <!-- Верхняя и нижняя белые ленты сетки -->
              <rect x="160" y="533" width="1122" height="9" rx="2" fill="#f5f5f4" stroke="#d6d3d1" stroke-width="1"/>
              <rect x="160" y="662" width="1122" height="7" rx="2" fill="#e7e5e4" stroke="#a8a29e" stroke-width="1"/>

              <!-- Боковые белые ленты и полосатые красно-белые антенны -->
              <rect x="226" y="534" width="6" height="134" fill="#f5f5f4"/>
              <line x1="229" y1="454" x2="229" y2="534" stroke="#f5f5f4" stroke-width="4.5"/>
              <line x1="229" y1="454" x2="229" y2="534" stroke="#dc2626" stroke-width="4.5" stroke-dasharray="10 10"/>

              <rect x="1210" y="534" width="6" height="134" fill="#f5f5f4"/>
              <line x1="1213" y1="454" x2="1213" y2="534" stroke="#f5f5f4" stroke-width="4.5"/>
              <line x1="1213" y1="454" x2="1213" y2="534" stroke="#dc2626" stroke-width="4.5" stroke-dasharray="10 10"/>
            </g>

            <!-- 9. СЁЁ ХИНАТА (#10 КАРАСУНО), СТОЯЩИЙ СПИНОЙ ПЕРЕД СЕТКОЙ -->
            <g transform="translate(720, 520)">
              <!-- Тень Хинаты на паркете -->
              <ellipse cx="0" cy="252" rx="34" ry="7" fill="#291507" fill-opacity="0.55"/>

              <!-- Ноги в белых носках, чёрных наколенниках и волейбольных кроссовках -->
              <!-- Левая нога -->
              <path d="M-19,154 L-11,154 L-12,238 L-20,238 Z" fill="#e7bda0" stroke="#4a2c18" stroke-width="1.4"/>
              <!-- Правая нога -->
              <path d="M11,154 L19,154 L20,238 L12,238 Z" fill="#e7bda0" stroke="#4a2c18" stroke-width="1.4"/>

              <!-- Чёрные наколенники -->
              <rect x="-20.5" y="182" width="10.5" height="20" rx="3" fill="#27272a" stroke="#18181b" stroke-width="1.2"/>
              <rect x="10" y="182" width="10.5" height="20" rx="3" fill="#27272a" stroke="#18181b" stroke-width="1.2"/>

              <!-- Белые гольфы и кроссовки с красными вставками -->
              <rect x="-20" y="218" width="9" height="18" fill="#f5f5f4" stroke="#78716c" stroke-width="1"/>
              <rect x="11" y="218" width="9" height="18" fill="#f5f5f4" stroke="#78716c" stroke-width="1"/>
              <path d="M-23,234 L-9,234 L-8,248 L-25,248 Z" fill="#f5f5f4" stroke="#27272a" stroke-width="1.4"/>
              <path d="M-23,241 L-9,241" stroke="#dc2626" stroke-width="2.5"/>
              <path d="M9,234 L23,234 L25,248 L8,248 Z" fill="#f5f5f4" stroke="#27272a" stroke-width="1.4"/>
              <path d="M9,241 L23,241" stroke="#dc2626" stroke-width="2.5"/>

              <!-- Руки, опущенные вдоль тела -->
              <path d="M-30,78 L-23,78 L-26,152 L-34,152 Z" fill="#e7bda0" stroke="#4a2c18" stroke-width="1.4"/>
              <circle cx="-30" cy="155" r="4.5" fill="#e7bda0" stroke="#4a2c18" stroke-width="1.2"/>
              <path d="M23,78 L30,78 L34,152 L26,152 Z" fill="#e7bda0" stroke="#4a2c18" stroke-width="1.4"/>
              <circle cx="30" cy="155" r="4.5" fill="#e7bda0" stroke="#4a2c18" stroke-width="1.2"/>

              <!-- Чёрные волейбольные шорты Карасуно с оранжевыми полосками по бокам -->
              <path d="M-23,118 L23,118 L25,156 L4,156 L0,138 L-4,156 L-25,156 Z" fill="#27272a" stroke="#18181b" stroke-width="1.6"/>
              <line x1="-22" y1="120" x2="-23" y2="155" stroke="#ea580c" stroke-width="2.5"/>
              <line x1="22" y1="120" x2="23" y2="155" stroke="#ea580c" stroke-width="2.5"/>

              <!-- Чёрная футболка Карасуно с номером 10 на спине -->
              <path d="M-24,42 L24,42 L35,78 L25,81 L22,120 L-22,120 L-25,81 L-35,78 Z" fill="#27272a" stroke="#18181b" stroke-width="1.8" stroke-linejoin="round"/>
              <!-- Оранжево-белые вставки на воротнике и рукавах -->
              <path d="M-12,42 Q0,47 12,42" fill="none" stroke="#ea580c" stroke-width="3.2"/>
              <path d="M-11,45 Q0,49 11,45" fill="none" stroke="#f5f5f4" stroke-width="1.4"/>
              <line x1="-34" y1="76" x2="-25" y2="79" stroke="#f5f5f4" stroke-width="2"/>
              <line x1="34" y1="76" x2="25" y2="79" stroke="#f5f5f4" stroke-width="2"/>
              <line x1="-20" y1="68" x2="-20" y2="119" stroke="#ea580c" stroke-width="2.2"/>
              <line x1="20" y1="68" x2="20" y2="119" stroke="#ea580c" stroke-width="2.2"/>

              <!-- Надпись школы и крупный номер 10 на спине -->
              <text x="0" y="59" text-anchor="middle" fill="#f5f5f4" font-family="serif" font-weight="800" font-size="7.5" letter-spacing="1.5">烏野高校</text>
              <text x="0" y="95" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="900" font-size="31" letter-spacing="-1">10</text>

              <!-- Шея, уши и каноничная пушистая рыжая причёска Сёё Хинаты (вид со спины как на кадре) -->
              <path d="M-6,28 L-5,42 L5,42 L6,28 Z" fill="#e5b596" stroke="#6b3e26" stroke-width="1"/>
              <!-- Тень под волосами на шее -->
              <path d="M-6,30 Q0,35 6,30 L5.5,35 Q0,38 -5.5,35 Z" fill="#b57c5a"/>
              <!-- Аккуратные уши по бокам головы -->
              <ellipse cx="-16.5" cy="21" rx="2.6" ry="5" transform="rotate(-10 -16.5 21)" fill="#e5b596" stroke="#6b3e26" stroke-width="1"/>
              <ellipse cx="16.5" cy="21" rx="2.6" ry="5" transform="rotate(10 16.5 21)" fill="#e5b596" stroke="#6b3e26" stroke-width="1"/>

              <!-- Основной объёмный силуэт мягких взъерошенных рыжих прядей Хинаты -->
              <path d="M 0,-14
                       C 3,-14 5,-10 7,-7
                       C 10,-11 14,-13 16,-12
                       C 15,-8 14,-5 13,-2
                       C 18,-5 23,-5 26,-3
                       C 23,0 20,3 18,5
                       C 23,5 27,7 29,10
                       C 25,11 22,12 19,13
                       C 23,15 26,18 26,21
                       C 22,20 19,20 17,20
                       C 19,24 19,28 17,31
                       C 14,29 12,28 11,27
                       C 11,31 9,34 7,35
                       C 5,32 4,31 3,30
                       C 2,33 1,35 0,35
                       C -1,35 -2,33 -3,30
                       C -4,31 -5,32 -7,35
                       C -9,34 -11,31 -11,27
                       C -12,28 -14,29 -17,31
                       C -19,28 -19,24 -17,20
                       C -19,20 -22,20 -26,21
                       C -26,18 -23,15 -19,13
                       C -22,12 -25,11 -29,10
                       C -27,7 -23,5 -18,5
                       C -20,3 -23,0 -26,-3
                       C -23,-5 -18,-5 -13,-2
                       C -14,-5 -15,-8 -16,-12
                       C -14,-13 -10,-11 -7,-7
                       C -5,-10 -3,-14 0,-14 Z"
                    fill="#e86c25" stroke="#5c240c" stroke-width="1.35" stroke-linejoin="round"/>

              <!-- Нижние затенённые слои прядей на затылке для живого аниме-объёма -->
              <path d="M -18,16 Q -10,23 0,21 Q 10,23 18,16
                       L 16,28 L 11,26 L 7,34 L 2,29 L 0,34 L -2,29 L -7,34 L -11,26 L -16,28 Z"
                    fill="#c45116" opacity="0.88"/>

              <!-- Верхний солнечный блик и живые линии отдельных прядей от макушки -->
              <path d="M -13,1 C -6,-5 6,-5 13,1 C 9,7 -9,7 -13,1 Z" fill="#f98e45" opacity="0.65"/>
              <path d="M 0,-3 C -5,4 -11,11 -16,17
                       M 0,-3 C 5,4 11,11 16,17
                       M -2,-6 C -6,-1 -12,2 -19,5
                       M 2,-6 C 6,-1 12,2 19,5
                       M 0,-2 C -2,8 -5,17 -8,25
                       M 0,-2 C 2,8 5,17 8,25"
                    fill="none" stroke="#8c3510" stroke-width="1.05" stroke-linecap="round" opacity="0.65"/>
            </g>

            <!-- Мягкая кинематографичная виньетка по краям -->
            <rect x="0" y="0" width="1440" height="900" fill="url(#gymVignette)"/>
          </svg>
        `;
      } else if (activeKey === 'horimiya' || themeKey === 'horimiya') {
        stage.innerHTML = `
          <!-- Мягкое весеннее небо с акварельными переливами персика, розовой сакуры и небесной лазури -->
          <div style="position:absolute;inset:0;background:
            radial-gradient(ellipse 80% 60% at 15% 15%, rgba(251,146,60,0.28) 0%, rgba(244,114,182,0.26) 45%, transparent 72%),
            radial-gradient(ellipse 85% 65% at 88% 20%, rgba(56,189,248,0.32) 0%, rgba(125,211,252,0.16) 48%, transparent 75%),
            radial-gradient(ellipse 90% 55% at 50% 95%, rgba(244,114,182,0.24) 0%, rgba(253,186,116,0.16) 50%, transparent 78%),
            linear-gradient(165deg, #171026 0%, #241536 42%, #19223b 100%);"></div>

          <!-- Тёплые солнечные лучи весеннего полдня -->
          <div style="position:absolute;top:-25%;left:5%;width:35vw;height:130vh;background:linear-gradient(180deg, rgba(254,240,138,0.20) 0%, rgba(251,146,60,0.08) 55%, transparent 100%);transform:rotate(-26deg);filter:blur(28px);"></div>
          <div style="position:absolute;top:-25%;left:32%;width:26vw;height:125vh;background:linear-gradient(180deg, rgba(251,207,232,0.18) 0%, rgba(56,189,248,0.06) 60%, transparent 100%);transform:rotate(-18deg);filter:blur(26px);"></div>

          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;opacity:0.86;">
            <defs>
              <linearGradient id="peachCloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fed7aa" stop-opacity="0.42"/>
                <stop offset="50%" stop-color="#f472b6" stop-opacity="0.28"/>
                <stop offset="100%" stop-color="#c084fc" stop-opacity="0.08"/>
              </linearGradient>
              <linearGradient id="azureCloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#bae6fd" stop-opacity="0.38"/>
                <stop offset="55%" stop-color="#38bdf8" stop-opacity="0.22"/>
                <stop offset="100%" stop-color="#818cf8" stop-opacity="0.06"/>
              </linearGradient>
              <!-- Детализированный лепесток сакуры с выемкой -->
              <g id="sakuraPetalDetail">
                <path d="M0,0 C12,-14 32,-14 42,0 C34,12 14,14 0,0 M38,-2 L31,0 L38,2" fill="#fbcfe8" fill-opacity="0.78" stroke="#f472b6" stroke-width="0.6"/>
              </g>
              <!-- Солнечный зайчик (шестигранный блик объектива) -->
              <polygon id="sunbeamHex" points="30,0 60,17 60,52 30,69 0,52 0,17" fill="#fef08a" fill-opacity="0.16" stroke="#fde68a" stroke-width="1" stroke-opacity="0.35"/>
            </defs>

            <!-- Пышные акварельные облака лазури и персика -->
            <g style="animation:floatIslandSlow 14s ease-in-out infinite;">
              <path d="M-80,320 Q40,210 190,250 Q290,150 450,220 Q580,160 690,260 Q790,230 850,320 L-80,360 Z" fill="url(#peachCloudGrad)"/>
              <path d="M620,240 Q760,120 930,180 Q1080,90 1240,175 Q1360,130 1520,230 L1520,330 L620,330 Z" fill="url(#azureCloudGrad)"/>
            </g>
            <g style="animation:floatIslandSlow 18s ease-in-out infinite reverse;">
              <path d="M-60,790 Q110,660 280,720 Q440,610 640,700 Q820,620 980,720 Q1180,630 1360,710 L1520,760 L1520,920 L-60,920 Z" fill="url(#peachCloudGrad)"/>
              <path d="M180,830 Q380,700 590,770 Q790,670 1010,760 Q1220,680 1490,780 L1490,920 L180,920 Z" fill="url(#azureCloudGrad)"/>
            </g>

            <!-- Цепочка солнечных зайчиков (lens flare) и тёплого боке -->
            <circle cx="190" cy="150" r="88" fill="#fef08a" fill-opacity="0.14"/>
            <circle cx="240" cy="195" r="46" fill="#fbcfe8" fill-opacity="0.20"/>
            <use href="#sunbeamHex" transform="translate(320, 235) scale(0.95) rotate(15)"/>
            <use href="#sunbeamHex" transform="translate(430, 310) scale(0.65) rotate(15)"/>
            <use href="#sunbeamHex" transform="translate(520, 375) scale(1.25) rotate(15)"/>
            <circle cx="670" cy="465" r="54" fill="#7dd3fc" fill-opacity="0.14"/>
            <circle cx="1160" cy="240" r="72" fill="#f472b6" fill-opacity="0.14"/>
            <circle cx="1090" cy="310" r="36" fill="#fde68a" fill-opacity="0.18"/>
            <circle cx="980" cy="580" r="64" fill="#38bdf8" fill-opacity="0.12"/>

            <!-- Кружащиеся в весеннем ветре лепестки сакуры -->
            <use href="#sakuraPetalDetail" transform="translate(160, 280) rotate(-18) scale(1.1)" style="animation:featherDrift 8s ease-in-out infinite;"/>
            <use href="#sakuraPetalDetail" transform="translate(390, 180) rotate(24) scale(0.85)" style="animation:featherDrift 10s ease-in-out infinite reverse;"/>
            <use href="#sakuraPetalDetail" transform="translate(640, 290) rotate(-32) scale(1.2)" style="animation:featherDrift 9s ease-in-out infinite;"/>
            <use href="#sakuraPetalDetail" transform="translate(890, 190) rotate(15) scale(0.95)" style="animation:featherDrift 11s ease-in-out infinite;"/>
            <use href="#sakuraPetalDetail" transform="translate(1180, 380) rotate(-26) scale(1.15)" style="animation:featherDrift 8.5s ease-in-out infinite reverse;"/>
            <use href="#sakuraPetalDetail" transform="translate(310, 560) rotate(35) scale(1.0)" style="animation:featherDrift 9.5s ease-in-out infinite;"/>
            <use href="#sakuraPetalDetail" transform="translate(780, 610) rotate(-14) scale(0.9)" style="animation:featherDrift 10.5s ease-in-out infinite reverse;"/>
            <use href="#sakuraPetalDetail" transform="translate(1280, 620) rotate(22) scale(1.05)" style="animation:featherDrift 7.8s ease-in-out infinite;"/>
          </svg>
        `;
      } else if (activeKey === 'jjk' || themeKey === 'jjk') {
        stage.innerHTML = `
          <!-- Космическая туманность Бесконечности: столкновение Лазури (Синий) слева и Багрянца (Красный) справа в Пустоту Фиолетовый -->
          <div style="position:absolute;inset:0;background:
            radial-gradient(circle at 26% 42%, rgba(14,165,233,0.44) 0%, rgba(2,132,199,0.18) 32%, transparent 62%),
            radial-gradient(circle at 74% 42%, rgba(225,29,72,0.44) 0%, rgba(190,18,60,0.18) 32%, transparent 62%),
            radial-gradient(circle at 50% 42%, rgba(168,85,247,0.52) 0%, rgba(107,33,168,0.26) 38%, transparent 70%),
            linear-gradient(180deg, #04020a 0%, #0b0418 50%, #05020c 100%);"></div>

          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;opacity:0.9;">
            <defs>
              <radialGradient id="aoBlueSphere" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.95"/>
                <stop offset="30%" stop-color="#38bdf8" stop-opacity="0.75"/>
                <stop offset="70%" stop-color="#0284c7" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="#0284c7" stop-opacity="0"/>
              </radialGradient>
              <radialGradient id="akaRedSphere" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ffe4e6" stop-opacity="0.95"/>
                <stop offset="30%" stop-color="#f43f5e" stop-opacity="0.78"/>
                <stop offset="70%" stop-color="#be123c" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="#be123c" stop-opacity="0"/>
              </radialGradient>
              <radialGradient id="murasakiEclipse" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#030108" stop-opacity="0.98"/>
                <stop offset="54%" stop-color="#05020d" stop-opacity="0.95"/>
                <stop offset="63%" stop-color="#f3e8ff" stop-opacity="0.95"/>
                <stop offset="72%" stop-color="#c084fc" stop-opacity="0.82"/>
                <stop offset="86%" stop-color="#7e22ce" stop-opacity="0.32"/>
                <stop offset="100%" stop-color="#581c87" stop-opacity="0"/>
              </radialGradient>
              <linearGradient id="hollowEnergyArc" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#38bdf8"/>
                <stop offset="50%" stop-color="#e9d5ff"/>
                <stop offset="100%" stop-color="#f43f5e"/>
              </linearGradient>
            </defs>

            <!-- Кандзи техник Годзё: 蒼 (Синий), 茈 (Фиолетовый), 赫 (Красный) -->
            <text x="260" y="240" fill="#38bdf8" fill-opacity="0.14" font-family="serif" font-weight="900" font-size="120">蒼</text>
            <text x="1080" y="240" fill="#f43f5e" fill-opacity="0.14" font-family="serif" font-weight="900" font-size="120">赫</text>
            <text x="655" y="790" fill="#c084fc" fill-opacity="0.11" font-family="serif" font-weight="900" font-size="150">茈</text>

            <!-- Сфера притяжения «Синий» (Ao) слева -->
            <g style="animation:jjkOrbCollideLeft 7s ease-in-out infinite;">
              <circle cx="390" cy="380" r="155" fill="url(#aoBlueSphere)"/>
              <path d="M260,380 A130,130 0 1,1 520,380" fill="none" stroke="#7dd3fc" stroke-width="2" stroke-dasharray="12 8" opacity="0.65"/>
            </g>

            <!-- Сфера отталкивания «Красный» (Aka) справа -->
            <g style="animation:jjkOrbCollideRight 7s ease-in-out infinite;">
              <circle cx="1050" cy="380" r="155" fill="url(#akaRedSphere)"/>
              <path d="M920,380 A130,130 0 1,0 1180,380" fill="none" stroke="#fda4af" stroke-width="2" stroke-dasharray="12 8" opacity="0.65"/>
            </g>

            <!-- Центральное сингулярное затмение «Пустота: Фиолетовый» (Murasaki) -->
            <circle cx="720" cy="380" r="215" fill="url(#murasakiEclipse)" style="animation:floatSlowPulse 6s ease-in-out infinite;"/>

            <!-- Гравитационные кольца Бесконечности и органические дуги проклятой энергии -->
            <ellipse cx="720" cy="380" rx="430" ry="125" fill="none" stroke="url(#hollowEnergyArc)" stroke-width="2.6" transform="rotate(-16 720 380)" opacity="0.78"/>
            <ellipse cx="720" cy="380" rx="490" ry="165" fill="none" stroke="url(#hollowEnergyArc)" stroke-width="1.6" stroke-dasharray="22 14" transform="rotate(14 720 380)" opacity="0.58"/>
            <path d="M80,580 C340,260 540,480 720,380 C900,280 1100,500 1360,190" fill="none" stroke="url(#hollowEnergyArc)" stroke-width="3" opacity="0.65"/>

            <!-- Багрово-фиолетовые молнии Чёрной Вспышки (Kokusen) -->
            <polyline points="560,250 615,310 595,335 655,375" fill="none" stroke="#f43f5e" stroke-width="2.8" stroke-linecap="round" opacity="0.85"/>
            <polyline points="885,260 830,320 850,342 790,378" fill="none" stroke="#38bdf8" stroke-width="2.8" stroke-linecap="round" opacity="0.85"/>
            <polyline points="710,515 735,585 705,610 745,685" fill="none" stroke="#e9d5ff" stroke-width="2.4" stroke-linecap="round" opacity="0.8"/>
          </svg>
        `;
      } else if (activeKey === 'sao' || themeKey === 'sao') {
        stage.innerHTML = `
          <!-- Небо Айнкрада с бирюзово-изумрудным северным сиянием -->
          <div style="position:absolute;inset:0;background:
            radial-gradient(ellipse 90% 50% at 50% -5%, rgba(56,189,248,0.38) 0%, rgba(16,185,129,0.22) 45%, transparent 76%),
            radial-gradient(ellipse 75% 50% at 78% 36%, rgba(14,165,233,0.28) 0%, transparent 68%),
            radial-gradient(ellipse 80% 45% at 22% 85%, rgba(52,211,153,0.20) 0%, transparent 70%),
            linear-gradient(180deg, #020813 0%, #06162b 52%, #041020 100%);"></div>

          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;opacity:0.9;">
            <defs>
              <linearGradient id="auroraRibbonSao" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0"/>
                <stop offset="30%" stop-color="#38bdf8" stop-opacity="0.42"/>
                <stop offset="65%" stop-color="#34d399" stop-opacity="0.42"/>
                <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
              </linearGradient>
              <linearGradient id="aincradBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.88"/>
                <stop offset="35%" stop-color="#38bdf8" stop-opacity="0.68"/>
                <stop offset="75%" stop-color="#0369a1" stop-opacity="0.52"/>
                <stop offset="100%" stop-color="#082f49" stop-opacity="0.85"/>
              </linearGradient>
              <linearGradient id="teleportCrystalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ffffff"/>
                <stop offset="45%" stop-color="#7dd3fc"/>
                <stop offset="100%" stop-color="#0284c7"/>
              </linearGradient>
              <!-- Светящийся кристалл телепортации -->
              <g id="saoCrystalShard">
                <polygon points="0,-24 14,0 0,24 -14,0" fill="url(#teleportCrystalGrad)" fill-opacity="0.82" stroke="#bae6fd" stroke-width="1"/>
                <polygon points="0,-24 14,0 0,4" fill="#ffffff" fill-opacity="0.45"/>
              </g>
            </defs>

            <!-- Бирюзовое северное сияние в небе -->
            <path d="M-120,210 C260,60 640,340 1040,140 C1240,50 1390,170 1560,110" fill="none" stroke="url(#auroraRibbonSao)" stroke-width="65" stroke-linecap="round" style="filter:blur(22px);animation:auroraWaveFlow 12s ease-in-out infinite;"/>
            <path d="M-100,340 C340,210 720,440 1140,260 C1310,180 1440,280 1580,220" fill="none" stroke="url(#auroraRibbonSao)" stroke-width="40" stroke-linecap="round" style="filter:blur(18px);animation:auroraWaveFlow 15s ease-in-out infinite reverse;"/>

            <!-- Восходящие столпы света телепортации -->
            <rect x="210" y="0" width="4" height="900" fill="url(#auroraRibbonSao)" opacity="0.55" style="animation:saoPillarBeam 4s ease-in-out infinite;"/>
            <rect x="520" y="0" width="2.5" height="900" fill="url(#auroraRibbonSao)" opacity="0.4" style="animation:saoPillarBeam 5.5s ease-in-out infinite;"/>
            <rect x="1290" y="0" width="3.5" height="900" fill="url(#auroraRibbonSao)" opacity="0.5" style="animation:saoPillarBeam 4.8s ease-in-out infinite;"/>

            <!-- ПАРЯЩИЙ ЗАМОК АЙНКРАД (100 ЭТАЖЕЙ) В ОБЛАКАХ -->
            <g transform="translate(870, 65)" style="animation:floatIslandSlow 11s ease-in-out infinite;">
              <!-- Свечение ядра под замком -->
              <ellipse cx="220" cy="295" rx="210" ry="45" fill="#38bdf8" fill-opacity="0.22" style="filter:blur(16px);"/>

              <!-- Верхний Рубиновый Дворец (100-й этаж) и шпиль -->
              <polygon points="220,10 228,55 212,55" fill="#bae6fd"/>
              <polygon points="220,45 252,95 188,95" fill="url(#aincradBodyGrad)"/>
              <!-- Ступенчатые ярусы этажей Айнкрада с городскими огнями -->
              <polygon points="175,95 265,95 288,138 152,138" fill="url(#aincradBodyGrad)"/>
              <polygon points="136,138 304,138 336,190 104,190" fill="url(#aincradBodyGrad)"/>
              <polygon points="92,190 348,190 388,248 52,248" fill="url(#aincradBodyGrad)"/>
              <polygon points="36,248 404,248 432,292 8,292" fill="url(#aincradBodyGrad)" stroke="#7dd3fc" stroke-width="1.2"/>

              <!-- Горизонтальные светящиеся кольца этажей -->
              <line x1="152" y1="138" x2="288" y2="138" stroke="#bae6fd" stroke-width="2" stroke-opacity="0.8"/>
              <line x1="104" y1="190" x2="336" y2="190" stroke="#7dd3fc" stroke-width="2.2" stroke-opacity="0.85"/>
              <line x1="52" y1="248" x2="388" y2="248" stroke="#38bdf8" stroke-width="2.5" stroke-opacity="0.9"/>

              <!-- Нижняя коническая каменная скала замка и ниспадающие водопады -->
              <polygon points="24,292 416,292 365,375 295,435 220,545 145,435 75,375" fill="#082f49" stroke="#38bdf8" stroke-width="1.2" stroke-opacity="0.65"/>
              <polygon points="220,292 295,435 220,545" fill="#0c4a6e" fill-opacity="0.7"/>
              <!-- Струи водопадов с края Айнкрада -->
              <line x1="115" y1="292" x2="115" y2="455" stroke="#bae6fd" stroke-width="2" stroke-dasharray="10 6" opacity="0.65"/>
              <line x1="315" y1="292" x2="315" y2="445" stroke="#bae6fd" stroke-width="1.8" stroke-dasharray="12 8" opacity="0.6"/>

              <!-- Орбитальные голографические кольца вокруг Айнкрада -->
              <ellipse cx="220" cy="272" rx="255" ry="34" fill="none" stroke="#7dd3fc" stroke-width="1.8" stroke-opacity="0.75"/>
              <ellipse cx="220" cy="285" rx="295" ry="46" fill="none" stroke="#34d399" stroke-width="1.2" stroke-dasharray="16 12" stroke-opacity="0.55"/>

              <!-- Малые парящие каменные острова-спутники рядом с замком -->
              <polygon points="-45,230 -5,230 -18,265 -35,255" fill="#0ea5e9" fill-opacity="0.6"/>
              <polygon points="465,205 510,205 495,248 478,238" fill="#0ea5e9" fill-opacity="0.6"/>
              <polygon points="45,420 92,420 75,465 58,450" fill="#0284c7" fill-opacity="0.65"/>
            </g>

            <!-- Гряда ночных облаков под парящим замком -->
            <path d="M680,460 Q820,390 960,445 Q1110,375 1260,440 Q1370,400 1460,455 L1460,540 L680,540 Z" fill="#0ea5e9" fill-opacity="0.12" style="filter:blur(8px);"/>

            <!-- Восходящие потоки светящихся кристаллов телепортации -->
            <use href="#saoCrystalShard" transform="translate(180, 620) scale(1.1)" style="animation:featherDrift 7s ease-in-out infinite;"/>
            <use href="#saoCrystalShard" transform="translate(235, 420) scale(0.75)" style="animation:featherDrift 9s ease-in-out infinite reverse;"/>
            <use href="#saoCrystalShard" transform="translate(460, 680) scale(0.95)" style="animation:featherDrift 8s ease-in-out infinite;"/>
            <use href="#saoCrystalShard" transform="translate(540, 340) scale(0.65)" style="animation:featherDrift 10s ease-in-out infinite;"/>
            <use href="#saoCrystalShard" transform="translate(760, 590) scale(1.2)" style="animation:featherDrift 7.5s ease-in-out infinite reverse;"/>
            <use href="#saoCrystalShard" transform="translate(1280, 640) scale(0.9)" style="animation:featherDrift 8.5s ease-in-out infinite;"/>
            <use href="#saoCrystalShard" transform="translate(340, 230) scale(0.7)" style="animation:featherDrift 11s ease-in-out infinite reverse;"/>
          </svg>
        `;
      } else if (activeKey === 'nerv') {
        stage.innerHTML = `
          <!-- Плавный радарный купол MAGI без квадратной сетки -->
          <div style="position:absolute;inset:0;background:
            radial-gradient(circle at 50% 45%, rgba(16,185,129,0.22), rgba(245,158,11,0.08) 48%, transparent 72%);"></div>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;opacity:0.35;">
            <circle cx="720" cy="450" r="240" fill="none" stroke="#10b981" stroke-width="1.2" stroke-dasharray="12 10"/>
            <circle cx="720" cy="450" r="380" fill="none" stroke="#f59e0b" stroke-width="1" stroke-opacity="0.5"/>
          </svg>
        `;
      } else if (activeKey === 'abyss' || themeKey === 'abyss') {
        stage.innerHTML = `
          <style>
            @keyframes abFloat { from { transform: translateY(0); } to { transform: translateY(-26px); } }
            @keyframes abBubble { from { transform: translateY(0); opacity: .0; } 15% { opacity: .7; } to { transform: translateY(-340px); opacity: 0; } }
            .ab-jelly { animation: abFloat 7s ease-in-out infinite alternate; }
            .ab-bub { animation: abBubble 9s linear infinite; }
            @media (prefers-reduced-motion: reduce) { .ab-jelly, .ab-bub { animation: none; } }
          </style>
          <div style="position:absolute;inset:0;background:
            radial-gradient(ellipse 80% 50% at 50% -5%, rgba(56,189,248,.45), transparent 65%),
            linear-gradient(180deg,#05324a 0%,#03233a 30%,#021626 65%,#010910 100%);"></div>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;">
            <defs>
              <linearGradient id="abRay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bae6fd" stop-opacity=".38"/><stop offset="1" stop-color="#38bdf8" stop-opacity="0"/></linearGradient>
              <radialGradient id="abJ"><stop offset="0" stop-color="#e0fffb" stop-opacity=".95"/><stop offset=".55" stop-color="#22d3ee" stop-opacity=".55"/><stop offset="1" stop-color="#0891b2" stop-opacity=".1"/></radialGradient>
              <filter id="abBlur"><feGaussianBlur stdDeviation="9"/></filter>
              <filter id="abGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <g filter="url(#abBlur)">
              <polygon points="300,0 420,0 700,760 420,760" fill="url(#abRay)"/>
              <polygon points="640,0 720,0 980,800 760,800" fill="url(#abRay)" opacity=".8"/>
              <polygon points="1000,0 1120,0 1320,720 1080,720" fill="url(#abRay)" opacity=".7"/>
            </g>
            ${[[260,520,1,0],[1130,400,1.4,-2],[760,640,.75,-4]].map(([x,y,s,d]) => `
              <g class="ab-jelly" style="animation-delay:${d}s" transform="translate(${x},${y}) scale(${s})">
                <path d="M-34,0 Q-34,-58 0,-58 Q34,-58 34,0 Q0,10 -34,0 Z" fill="url(#abJ)"/>
                ${[-22,-11,0,11,22].map((dx,k) => `<path d="M${dx},4 q${k % 2 ? 9 : -9},24 -3,48 t4,52" fill="none" stroke="#67e8f9" stroke-opacity=".55" stroke-width="2" stroke-linecap="round"/>`).join('')}
              </g>`).join('')}
            ${Array.from({length: 14}, (_, i) => `<circle class="ab-bub" style="animation-delay:${-(i % 9)}s;animation-duration:${8 + (i % 5)}s" cx="${(i * 173) % 1440}" cy="${620 + (i * 59) % 260}" r="${1.5 + (i % 4)}" fill="none" stroke="#bae6fd" stroke-opacity=".6"/>`).join('')}
            <path d="M0,810 Q180,740 360,800 T760,790 T1120,810 T1440,770 L1440,900 L0,900 Z" fill="#010a12"/>
            <path d="M0,860 Q260,820 520,858 T1040,850 T1440,840 L1440,900 L0,900 Z" fill="#00050a"/>
          </svg>
        `;
      } else if (activeKey === 'summer' || themeKey === 'summer') {
        const bursts = [[420,260,170,'#ffd36b',0],[960,190,210,'#ff6fa5',.9],[1230,360,140,'#ffffff',1.7],[700,380,120,'#7dd3fc',2.4]];
        stage.innerHTML = `
          <style>
            @keyframes hanabi { from { opacity: 0; transform: scale(.15); } 35% { opacity: 1; } to { opacity: .8; transform: scale(1); } }
            .hanabi { transform-box: fill-box; transform-origin: center; animation: hanabi 1.9s cubic-bezier(.12,.8,.3,1) both; }
            @media (prefers-reduced-motion: reduce) { .hanabi { animation: none; } }
          </style>
          <div style="position:absolute;inset:0;background:
            radial-gradient(ellipse 110% 36% at 50% 104%, rgba(251,191,36,.55), rgba(244,114,60,.25) 45%, transparent 72%),
            linear-gradient(180deg,#050719 0%,#0f1236 38%,#3a1b52 70%,#8a3a5a 100%);"></div>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;">
            <defs><filter id="hbGlow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
            ${bursts.map(([cx,cy,R,c,d]) => `
              <g class="hanabi" style="animation-delay:${d}s" filter="url(#hbGlow)" stroke="${c}" stroke-linecap="round" fill="${c}">
                ${Array.from({length: 32}, (_, k) => { const a = k * Math.PI / 16, r1 = R * .3, r2 = R * (k % 2 ? .78 : 1);
                  return `<line x1="${(cx + Math.cos(a) * r1).toFixed(0)}" y1="${(cy + Math.sin(a) * r1).toFixed(0)}" x2="${(cx + Math.cos(a) * r2).toFixed(0)}" y2="${(cy + Math.sin(a) * r2).toFixed(0)}" stroke-width="2" stroke-opacity=".75"/><circle cx="${(cx + Math.cos(a) * (r2 + 8)).toFixed(0)}" cy="${(cy + Math.sin(a) * (r2 + 8)).toFixed(0)}" r="2.6" stroke="none"/>`; }).join('')}
                <circle cx="${cx}" cy="${cy}" r="${R * .12}" stroke="none" fill-opacity=".5"/>
              </g>`).join('')}
            <path d="M0,700 Q360,660 720,690 T1440,670 L1440,900 L0,900 Z" fill="#1a0c33" fill-opacity=".6"/>
            <g fill="#06030f" fill-opacity=".95">
              ${Array.from({length: 48}, (_, i) => { const h = 50 + ((i * 41) % 6) * 24; return `<rect x="${i * 30}" y="${900 - h}" width="${25 + (i % 3) * 4}" height="${h}"/>`; }).join('')}
              <polygon points="1010,900 1040,560 1052,420 1060,330 1068,420 1080,560 1110,900"/>
              <rect x="1040" y="520" width="40" height="8"/><rect x="1049" y="410" width="22" height="6"/>
            </g>
            <g fill="#ffc977">${Array.from({length: 90}, (_, i) => { const col = (i * 7) % 48, row = i % 4, h = 50 + ((col * 41) % 6) * 24; if (row * 18 + 20 > h - 8) return ''; return `<rect x="${col * 30 + 5 + (i % 2) * 9}" y="${900 - h + 10 + row * 18}" width="4" height="6" fill-opacity="${(.3 + (i % 4) * .18).toFixed(2)}"/>`; }).join('')}</g>
          </svg>
        `;
      } else if (activeKey === 'tsuki' || themeKey === 'tsuki') {
        stage.innerHTML = `
          <style>
            @keyframes tkFly { 0%,100% { opacity: .15; transform: translate(0,0); } 50% { opacity: 1; transform: translate(14px,-18px); } }
            .tk-fly { animation: tkFly 5s ease-in-out infinite; }
            @media (prefers-reduced-motion: reduce) { .tk-fly { animation: none; opacity: .6; } }
          </style>
          <div style="position:absolute;inset:0;background:
            radial-gradient(circle at 72% 24%, rgba(232,245,238,.22) 0%, rgba(125,227,200,.12) 26%, transparent 55%),
            linear-gradient(180deg,#020a0c 0%,#04181a 50%,#03100f 100%);"></div>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;">
            <defs>
              <radialGradient id="tkMoon"><stop offset="0" stop-color="#fbfffd"/><stop offset=".7" stop-color="#e3f6ee"/><stop offset="1" stop-color="#b9e8d8"/></radialGradient>
              <filter id="tkHalo" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="26"/></filter>
              <filter id="tkGlow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              <radialGradient id="tkFl"><stop offset="0" stop-color="#f4ffb8"/><stop offset=".25" stop-color="#e9ffa8" stop-opacity=".6"/><stop offset="1" stop-color="#e9ffa8" stop-opacity="0"/></radialGradient><linearGradient id="tkMist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a1eed6" stop-opacity="0"/><stop offset="1" stop-color="#a1eed6" stop-opacity=".22"/></linearGradient>
            </defs>
            <circle cx="1040" cy="216" r="150" fill="#9fe9d2" opacity=".5" filter="url(#tkHalo)"/>
            <circle cx="1040" cy="216" r="104" fill="url(#tkMoon)"/>
            <circle cx="1010" cy="190" r="14" fill="#b9e8d8" opacity=".55"/><circle cx="1072" cy="244" r="20" fill="#b9e8d8" opacity=".4"/><circle cx="1058" cy="168" r="8" fill="#b9e8d8" opacity=".5"/>
            <rect x="0" y="470" width="1440" height="260" fill="url(#tkMist)"/>
            ${Array.from({length: 22}, (_, i) => { const x = 20 + i * 66 + (i % 3) * 14, w = 10 + (i % 4) * 4, far = i % 2, top = far ? 120 : -20, op = far ? .55 : .96;
              return `<g fill="${far ? '#06231f' : '#020b0a'}" fill-opacity="${op}"><rect x="${x}" y="${top}" width="${w}" height="${900 - top}"/>${Array.from({length: 9}, (_, k) => `<rect x="${x - 2}" y="${top + 80 + k * 95 + (i % 5) * 9}" width="${w + 4}" height="4" fill-opacity=".8"/>`).join('')}${i % 3 === 0 ? `<path d="M${x + w},${top + 210} q60,-20 96,18 q-54,-8 -96,2 Z M${x},${top + 350} q-70,-18 -104,22 q58,-10 104,0 Z"/>` : ''}</g>`; }).join('')}
            <rect x="0" y="760" width="1440" height="140" fill="#010605"/>
            <ellipse cx="1040" cy="800" rx="90" ry="9" fill="#e3f6ee" opacity=".35"/><ellipse cx="1040" cy="822" rx="54" ry="5" fill="#e3f6ee" opacity=".22"/><ellipse cx="1040" cy="842" rx="26" ry="3" fill="#e3f6ee" opacity=".14"/>
            <g fill="url(#tkFl)">${Array.from({length: 34}, (_, i) => `<circle class="tk-fly" style="animation-delay:${-(i % 9) * .7}s;animation-duration:${4 + (i % 5)}s" cx="${(i * 227) % 1440}" cy="${380 + (i * 83) % 420}" r="${(1.6 + (i % 3) * .6) * 4}"/>`).join('')}</g>
          </svg>
        `;
      } else if (activeKey === 'citypop' || themeKey === 'citypop') {
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:linear-gradient(180deg,#0d0221 0%,#2a0a5e 44%,#8a1b78 66%,#ff5f9e 80%,#ffb36b 86%,#130326 86.2%,#0d0221 100%);"></div>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;">
            <defs>
              <linearGradient id="cpSun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe45e"/><stop offset=".5" stop-color="#ff6fa5"/><stop offset="1" stop-color="#d11a85"/></linearGradient>
              <clipPath id="cpCut">${Array.from({length: 9}, (_, k) => `<rect x="480" y="${190 + k * 38 + k * k * 1.6}" width="480" height="${34 - k * 2.6}"/>`).join('')}<rect x="480" y="150" width="480" height="40"/></clipPath>
              <filter id="cpGlow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"/></filter>
            </defs>
            <circle cx="720" cy="360" r="210" fill="#ff3cac" opacity=".5" filter="url(#cpGlow)"/>
            <circle cx="720" cy="360" r="190" fill="url(#cpSun)" clip-path="url(#cpCut)"/>
            <g fill="#12032a">${Array.from({length: 32}, (_, i) => { const h = 70 + ((i * 59) % 7) * 30; return `<rect x="${i * 46}" y="${776 - h}" width="${36 + (i % 3) * 5}" height="${h}"/>`; }).join('')}</g>
            <g fill="#2de2e6" fill-opacity=".8">${Array.from({length: 70}, (_, i) => { const col = (i * 5) % 32, h = 70 + ((col * 59) % 7) * 30, row = i % 5; if (row * 22 + 24 > h - 8) return ''; return `<rect x="${col * 46 + 6 + (i % 3) * 9}" y="${776 - h + 10 + row * 22}" width="5" height="7" fill-opacity="${(.3 + (i % 3) * .25).toFixed(2)}"/>`; }).join('')}</g>
            <g fill="#06010f"><path d="M110,776 Q104,640 126,560" stroke="#06010f" stroke-width="9" fill="none"/><path d="M126,560 q-70,-10 -96,30 q50,-24 96,-14 M126,560 q60,-30 110,6 q-52,-12 -110,2 M126,560 q-20,-56 -74,-60 q54,6 74,60 M126,560 q18,-60 78,-64 q-58,10 -78,64"/><path d="M1330,776 Q1338,660 1318,590" stroke="#06010f" stroke-width="8" fill="none"/><path d="M1318,590 q-66,-12 -92,26 q46,-22 92,-12 M1318,590 q58,-28 104,8 q-48,-12 -104,0 M1318,590 q-16,-52 -68,-56 q50,6 68,56 M1318,590 q16,-56 72,-60 q-54,10 -72,60"/></g>
            <rect x="0" y="776" width="1440" height="124" fill="#0d0221"/>
            <g stroke="#ff3cac" stroke-width="1.6" stroke-opacity=".75" fill="none">
              ${Array.from({length: 17}, (_, i) => `<line x1="720" y1="776" x2="${-1400 + i * 280}" y2="900"/>`).join('')}
              ${[784,796,812,834,864].map(y => `<line x1="0" y1="${y}" x2="1440" y2="${y}"/>`).join('')}
            </g>
          </svg>
        `;
      } else if (activeKey === 'inari' || themeKey === 'inari') {
        const gate = (i) => { const s = 1 / (1 + 0.5 * i), X = (x) => (720 + (x - 720) * s).toFixed(1), Y = (y) => (430 + (y - 430) * s).toFixed(1), w = (v) => (v * s).toFixed(1);
          const shade = Math.max(0.28, 1 - i * 0.085), col = `rgb(${Math.round(222 * shade)},${Math.round(56 * shade)},${Math.round(30 * shade)})`;
          return `<g>
            <rect x="${X(300)}" y="${Y(-60)}" width="${w(54)}" height="${w(980)}" fill="${col}"/><rect x="${X(1086)}" y="${Y(-60)}" width="${w(54)}" height="${w(980)}" fill="${col}"/>
            <rect x="${X(330)}" y="${Y(205)}" width="${w(780)}" height="${w(34)}" fill="${col}"/>
            <path d="M${X(190)},${Y(70)} Q${X(720)},${Y(100)} ${X(1250)},${Y(70)} L${X(1270)},${Y(40)} Q${X(720)},${Y(72)} ${X(170)},${Y(40)} Z" fill="#14090a"/>
            <rect x="${X(210)}" y="${Y(76)}" width="${w(1020)}" height="${w(58)}" fill="${col}"/>
            <rect x="${X(300)}" y="${Y(820)}" width="${w(54)}" height="${w(36)}" fill="#14090a" fill-opacity=".85"/><rect x="${X(1086)}" y="${Y(820)}" width="${w(54)}" height="${w(36)}" fill="#14090a" fill-opacity=".85"/>
          </g><rect width="1440" height="900" fill="#1a0c08" fill-opacity="${i === 0 ? 0 : 0.07}"/>`; };
        stage.innerHTML = `
          <style>
            @keyframes inEmber { from { transform: translateY(0); opacity: 0; } 20% { opacity: .9; } to { transform: translateY(-260px); opacity: 0; } }
            .in-ember { animation: inEmber 8s linear infinite; }
            @media (prefers-reduced-motion: reduce) { .in-ember { animation: none; opacity: .5; } }
          </style>
          <div style="position:absolute;inset:0;background:
            radial-gradient(circle at 50% 48%, rgba(255,214,140,.55) 0%, rgba(240,120,60,.22) 18%, transparent 46%),
            linear-gradient(180deg,#0a0504 0%,#1a0b07 55%,#0a0504 100%);"></div>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;">
            <defs>
              <radialGradient id="inEm"><stop offset="0" stop-color="#fff0c0"/><stop offset=".25" stop-color="#ffb55a" stop-opacity=".7"/><stop offset="1" stop-color="#ff8a3a" stop-opacity="0"/></radialGradient><linearGradient id="inFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd69a" stop-opacity=".5"/><stop offset=".25" stop-color="#6b2a14" stop-opacity=".9"/><stop offset="1" stop-color="#120705"/></linearGradient>
              <filter id="inGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <polygon points="700,430 740,430 1400,900 40,900" fill="url(#inFloor)"/>
            ${Array.from({length: 9}, (_, k) => 9 - k).map(gate).join('')}
            <g filter="url(#inGlow)" fill="#ffcf7a">${[1, 2, 3, 4, 5].map(i => { const s = 1 / (1 + .5 * i), y = 430 + (239 - 430) * s;
              return [330, 1110].map(x => { const cx = 720 + (x - 720) * s; return `<ellipse cx="${cx.toFixed(0)}" cy="${(y + 36 * s).toFixed(0)}" rx="${(15 * s).toFixed(1)}" ry="${(24 * s).toFixed(1)}"/>`; }).join(''); }).join('')}</g>
            ${Array.from({length: 30}, (_, i) => `<circle class="in-ember" style="animation-delay:${-(i % 8)}s;animation-duration:${6 + (i % 5)}s" cx="${340 + (i * 97) % 760}" cy="${500 + (i * 61) % 380}" r="${(1.2 + (i % 3) * .6) * 4}" fill="url(#inEm)"/>`).join('')}
          </svg>
          <div style="position:absolute;inset:0;background:radial-gradient(ellipse 90% 80% at 50% 50%, transparent 40%, rgba(5,2,2,.7) 100%);"></div>
        `;
      } else if (activeKey === 'aurora' || themeKey === 'aurora') {
        const ribbon = (hue, amp, off, y0) => Array.from({length: 72}, (_, i) => { const x = i * 20.5 - 20, top = y0 + Math.sin(i * .16 + off) * amp + Math.sin(i * .05 + off * 2) * amp * .8, len = 190 + Math.sin(i * .27 + off) * 70;
          return `<line x1="${x.toFixed(0)}" y1="${top.toFixed(0)}" x2="${(x + 14 + Math.sin(i * .11) * 18).toFixed(0)}" y2="${(top + len).toFixed(0)}" stroke="url(#${hue})" stroke-width="24" stroke-opacity="${(.42 + .3 * Math.sin(i * .21 + off)).toFixed(2)}"/>`; }).join('');
        const layer = (cls, body) => `<svg class="au-l ${cls}" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;left:-3%;top:0;width:106%;height:100%;"><g filter="url(#auBlur)">${body}</g></svg>`;
        stage.innerHTML = `
          <style>
            @keyframes auSway { from { transform: translate3d(-22px,0,0); opacity: .75; } to { transform: translate3d(26px,0,0); opacity: 1; } }
            .au-l { will-change: transform, opacity; }
            .au-a { animation: auSway 18s ease-in-out infinite alternate; }
            .au-b { animation: auSway 26s ease-in-out infinite alternate-reverse; }
            @media (prefers-reduced-motion: reduce) { .au-a, .au-b { animation: none; } }
          </style>
          <div style="position:absolute;inset:0;background:linear-gradient(180deg,#02060f 0%,#051428 48%,#0a2436 74%,#04101c 100%);"></div>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;">
            <defs>
              <linearGradient id="auG" gradientUnits="userSpaceOnUse" x1="0" y1="60" x2="0" y2="520"><stop offset="0" stop-color="#5eead4" stop-opacity="0"/><stop offset=".25" stop-color="#4ade80" stop-opacity=".95"/><stop offset=".6" stop-color="#2dd4bf" stop-opacity=".6"/><stop offset="1" stop-color="#38bdf8" stop-opacity="0"/></linearGradient>
              <linearGradient id="auV" gradientUnits="userSpaceOnUse" x1="0" y1="40" x2="0" y2="480"><stop offset="0" stop-color="#a78bfa" stop-opacity="0"/><stop offset=".3" stop-color="#c084fc" stop-opacity=".85"/><stop offset=".7" stop-color="#e879f9" stop-opacity=".4"/><stop offset="1" stop-color="#818cf8" stop-opacity="0"/></linearGradient>
              <filter id="auBlur" x="-5%" y="-10%" width="110%" height="130%"><feGaussianBlur stdDeviation="9"/></filter>
            </defs>
            ${Array.from({length: 90}, (_, i) => `<circle cx="${(i * 233.1) % 1440}" cy="${(i * 79.7) % 560}" r="${(.5 + (i % 4) * .4).toFixed(1)}" fill="#fff" fill-opacity="${(.3 + (i % 5) * .13).toFixed(2)}"/>`).join('')}
          </svg>
          ${layer('au-a', ribbon('auG', 60, 0, 150))}
          ${layer('au-b', `<g opacity=".8">${ribbon('auV', 50, 2.4, 110)}</g>`)}
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;">
            <defs><linearGradient id="auFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5eead4" stop-opacity=".22"/><stop offset="1" stop-color="#5eead4" stop-opacity="0"/></linearGradient></defs>
            <path d="M0,690 L90,640 L170,670 L300,560 L380,620 L470,590 L600,660 L720,610 L860,670 L980,570 L1090,640 L1210,600 L1330,650 L1440,610 L1440,900 L0,900 Z" fill="#050d1a"/>
            <path d="M300,560 L270,610 L300,596 L326,614 Z M980,570 L954,618 L982,604 L1008,622 Z" fill="#cfeaf5" fill-opacity=".55"/>
            <rect x="0" y="690" width="1440" height="210" fill="#06182a"/>
            <rect x="0" y="690" width="1440" height="210" fill="url(#auFade)"/>
            <g stroke="#bff3ea" stroke-opacity=".12">${[720, 750, 790, 840].map(y => `<line x1="0" y1="${y}" x2="1440" y2="${y}"/>`).join('')}</g>
          </svg>
        `;
      } else if (activeKey === 'rain' || themeKey === 'rain') {
        const signs = [[210,'#ff4d8d',70,210],[470,'#38e1ff',46,300],[760,'#ffb347',90,250],[1040,'#a78bfa',56,330],[1250,'#ff4d8d',64,230]];
        stage.innerHTML = `
          <style>
            @keyframes rnFall { from { transform: translate3d(0,0,0); } to { transform: translate3d(-34px,240px,0); } }
            .rn-rain { will-change: transform; animation: rnFall .8s linear infinite; }
            @media (prefers-reduced-motion: reduce) { .rn-rain { animation: none; } }
          </style>
          <div style="position:absolute;inset:0;background:linear-gradient(180deg,#05070f 0%,#0b1230 52%,#161a44 78%,#0a0d22 100%);"></div>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;">
            <defs>
              ${['ff4d8d','38e1ff','ffb347','a78bfa'].map(c => `<radialGradient id="rnB${c}"><stop offset="0" stop-color="#${c}" stop-opacity=".75"/><stop offset=".6" stop-color="#${c}" stop-opacity=".25"/><stop offset="1" stop-color="#${c}" stop-opacity="0"/></radialGradient>`).join('')}
              <linearGradient id="rnBld" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2150"/><stop offset="1" stop-color="#090c20"/></linearGradient>
              <linearGradient id="rnRef" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
            </defs>
            <g fill="url(#rnBld)">${Array.from({length: 24}, (_, i) => { const h = 220 + ((i * 83) % 8) * 52; return `<rect x="${i * 62 - 10}" y="${780 - h}" width="${50 + (i % 3) * 8}" height="${h}" opacity="${(.55 + (i % 3) * .2).toFixed(2)}"/>`; }).join('')}</g>
            <g fill="#ffd9a0">${Array.from({length: 110}, (_, i) => `<rect x="${((i * 67) % 1440)}" y="${260 + (i * 47) % 480}" width="5" height="7" fill-opacity="${(.12 + (i % 5) * .08).toFixed(2)}"/>`).join('')}</g>
            ${signs.map(([x,c,w,y]) => `<rect x="${x}" y="${y}" width="${w * .16}" height="${w * 2.2}" rx="4" fill="${c}" fill-opacity=".9"/><circle cx="${x + w * .08}" cy="${y + w}" r="${w * 1.6}" fill="url(#rnB${c.slice(1)})"/>`).join('')}
            ${Array.from({length: 34}, (_, i) => `<circle cx="${(i * 197) % 1440}" cy="${300 + (i * 131) % 460}" r="${14 + (i % 5) * 9}" fill="url(#rnB${['ff4d8d','38e1ff','ffb347','a78bfa'][i % 4]})" opacity="${(.35 + (i % 3) * .2).toFixed(2)}"/>`).join('')}
            <rect x="0" y="780" width="1440" height="120" fill="#080b1c"/>
            ${signs.map(([x,c,w]) => `<rect x="${x - w * .3}" y="780" width="${w * .76}" height="120" fill="${c}" fill-opacity=".22"/>`).join('')}
            <rect x="0" y="780" width="1440" height="120" fill="url(#rnRef)" opacity=".18"/>
          </svg>
          <svg class="rn-rain" style="position:absolute;left:0;top:-240px;width:100%;height:calc(100% + 240px);" preserveAspectRatio="none">
            <defs><pattern id="rnPat" width="170" height="240" patternUnits="userSpaceOnUse"><g stroke="#bcd0ff" stroke-linecap="round" stroke-width="1.1"><line x1="20" y1="10" x2="14" y2="62" stroke-opacity=".30"/><line x1="70" y1="120" x2="64" y2="190" stroke-opacity=".22"/><line x1="118" y1="40" x2="112" y2="110" stroke-opacity=".36"/><line x1="150" y1="170" x2="145" y2="226" stroke-opacity=".2"/></g></pattern></defs>
            <rect width="100%" height="100%" fill="url(#rnPat)"/>
          </svg>
        `;
      } else if (activeKey === 'vangogh' || themeKey === 'vangogh') {
        const swirl = (cx, cy, sc) => Array.from({length: 8}, (_, i) => { const r = (34 + i * 30) * sc;
          return Array.from({length: 14}, (_, j) => { const a0 = j * (2 * Math.PI / 14) + i * .5, a1 = a0 + .38, r0 = r + j * 1.8 * sc, r1 = r + (j + 1) * 1.8 * sc;
            return `<path d="M${(cx + Math.cos(a0) * r0).toFixed(0)},${(cy + Math.sin(a0) * r0 * .8).toFixed(0)} A${r1.toFixed(0)},${(r1 * .8).toFixed(0)} 0 0 1 ${(cx + Math.cos(a1) * r1).toFixed(0)},${(cy + Math.sin(a1) * r1 * .8).toFixed(0)}" stroke="${['#1d3f9a','#3b6fd8','#9cc4ff','#f4c542'][(i + j) % 4]}" stroke-width="${7 + (i % 3) * 3}" stroke-linecap="round" fill="none" stroke-opacity=".8"/>`; }).join(''); }).join('');
        const stars = [[200,150,22],[470,90,26],[700,200,20],[880,110,28],[1330,300,18],[1120,60,20],[340,330,16],[1230,140,22]];
        stage.innerHTML = `
          <style>
            @keyframes vgSway { from { transform: rotate(-2.2deg) scale(1.12); } to { transform: rotate(2.2deg) scale(1.12); } }
            .vg-sw { will-change: transform; animation: vgSway 40s ease-in-out infinite alternate; }
            @media (prefers-reduced-motion: reduce) { .vg-sw { animation: none; } }
          </style>
          <div style="position:absolute;inset:0;background:linear-gradient(180deg,#060f33 0%,#0b2166 45%,#12337f 72%,#0a1a4c 100%);"></div>
          <svg class="vg-sw" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;">${swirl(520, 300, 1.15)}${swirl(1050, 380, .85)}
            <path d="M0,330 C300,260 420,420 720,350 S1180,230 1440,320" stroke="#5f8fe6" stroke-width="30" fill="none" stroke-opacity=".35" stroke-linecap="round"/></svg>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;">
            <defs><radialGradient id="vgS"><stop offset="0" stop-color="#fff6c2"/><stop offset=".3" stop-color="#f4c542" stop-opacity=".85"/><stop offset="1" stop-color="#f4c542" stop-opacity="0"/></radialGradient></defs>
            ${stars.map(([x,y,r]) => `<circle cx="${x}" cy="${y}" r="${r * 2.6}" fill="url(#vgS)"/><circle cx="${x}" cy="${y}" r="${r * .45}" fill="#fff6c2"/>`).join('')}
            <circle cx="1240" cy="170" r="92" fill="url(#vgS)" opacity=".7"/><path d="M1262,110 A58,58 0 1 0 1262,226 A44,48 0 1 1 1262,110 Z" fill="#fde68a"/>
            <path d="M0,720 Q200,660 420,712 T820,700 T1180,720 T1440,690 L1440,900 L0,900 Z" fill="#071538"/>
            <path d="M0,790 Q260,745 560,790 T1100,780 T1440,770 L1440,900 L0,900 Z" fill="#040c24"/>
            <path d="M210,900 C150,780 190,640 176,480 C168,380 206,300 214,230 C222,310 262,400 252,520 C246,640 286,790 260,900 Z" fill="#030a1c"/>
            <path d="M214,230 C186,300 168,400 176,480 M214,230 C240,330 262,420 252,520" stroke="#0d1d4a" stroke-width="3" fill="none"/>
            <g fill="#f4c542">${Array.from({length: 14}, (_, i) => `<rect x="${620 + (i * 53) % 640}" y="${735 + (i * 17) % 40}" width="7" height="9" fill-opacity=".85"/>`).join('')}</g>
          </svg>
        `;
      } else if (activeKey === 'fuji' || themeKey === 'fuji') {
        stage.innerHTML = `
          <style>
            @keyframes fjFall { from { transform: translate3d(0,-40px,0) rotate(0deg); opacity: 0; } 10% { opacity: .9; } to { transform: translate3d(var(--dx),105vh,0) rotate(320deg); opacity: .6; } }
            .fj-p { position: absolute; top: 0; width: 10px; height: 14px; border-radius: 80% 0 80% 0; background: linear-gradient(135deg,#ffe0ec,#ff9ec0); will-change: transform; animation: fjFall 16s linear infinite; }
            @media (prefers-reduced-motion: reduce) { .fj-p { display: none; } }
          </style>
          <div style="position:absolute;inset:0;background:
            radial-gradient(ellipse 60% 34% at 50% 70%, rgba(255,196,150,.75) 0%, rgba(255,140,170,.38) 40%, transparent 72%),
            linear-gradient(180deg,#0a0824 0%,#241553 30%,#6a2c78 56%,#d0598a 74%,#ffa98a 84%,#1b1038 84.2%,#0d0a24 100%);"></div>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;">
            <defs>
              <linearGradient id="fjM" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a78"/><stop offset=".55" stop-color="#1f1650"/><stop offset="1" stop-color="#140d38"/></linearGradient>
              <linearGradient id="fjS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3f8"/><stop offset="1" stop-color="#ffb3cf"/></linearGradient>
              <linearGradient id="fjMist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd3df" stop-opacity="0"/><stop offset="1" stop-color="#ffd3df" stop-opacity=".28"/></linearGradient>
              <clipPath id="fjLake"><rect x="0" y="756" width="1440" height="144"/></clipPath>
            </defs>
            ${Array.from({length: 60}, (_, i) => `<circle cx="${(i * 241) % 1440}" cy="${(i * 67) % 330}" r="${(.5 + (i % 3) * .45).toFixed(1)}" fill="#fff" fill-opacity="${(.25 + (i % 4) * .15).toFixed(2)}"/>`).join('')}
            <g id="fjMt"><path d="M150,756 C380,700 540,520 640,380 L690,330 L760,330 L810,380 C910,520 1070,700 1300,756 Z" fill="url(#fjM)"/>
            <path d="M640,380 L690,330 L760,330 L810,380 L782,398 L762,376 L736,418 L712,384 L690,422 L668,392 Z" fill="url(#fjS)"/></g>
            <path d="M0,756 L0,690 Q180,640 360,700 Q520,740 640,716 L640,756 Z M900,756 L900,712 Q1080,650 1240,702 Q1360,730 1440,690 L1440,756 Z" fill="#120b30"/>
            <rect x="0" y="560" width="1440" height="196" fill="url(#fjMist)"/>
            <rect x="0" y="756" width="1440" height="144" fill="#1b1038"/>
            <g clip-path="url(#fjLake)" opacity=".3" transform="translate(0,1512) scale(1,-1)"><use href="#fjMt"/></g>
            <rect x="0" y="756" width="1440" height="144" fill="#ffa98a" fill-opacity=".1"/>
            <g stroke="#ffd3df" stroke-opacity=".16">${[780, 806, 840, 880].map(y => `<line x1="${260 + (y % 7) * 20}" y1="${y}" x2="${1180 - (y % 5) * 30}" y2="${y}"/>`).join('')}</g>
          </svg>
          ${Array.from({length: 14}, (_, i) => `<i class="fj-p" style="left:${(i * 73) % 100}%;--dx:${(i % 2 ? 1 : -1) * (80 + (i % 4) * 40)}px;animation-delay:${-(i * 1.9).toFixed(1)}s;animation-duration:${13 + (i % 5) * 2}s;transform:scale(${(.7 + (i % 3) * .3).toFixed(1)})"></i>`).join('')}
        `;
      } else if (activeKey === 'makie' || themeKey === 'makie') {
        const blossom = (x, y, s) => Array.from({length: 5}, (_, k) => { const a = k * 1.2566 - 1.57; return `<circle cx="${(x + Math.cos(a) * 9 * s).toFixed(1)}" cy="${(y + Math.sin(a) * 9 * s).toFixed(1)}" r="${(8 * s).toFixed(1)}" fill="url(#mkGold)" fill-opacity=".92"/>`; }).join('') + `<circle cx="${x}" cy="${y}" r="${(3.4 * s).toFixed(1)}" fill="#b81e18"/>`;
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:
            radial-gradient(ellipse 60% 50% at 76% 26%, rgba(226,180,74,.20), transparent 68%),
            linear-gradient(165deg,#15100d 0%,#0a0706 45%,#060403 100%);"></div>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;">
            <defs>
              <linearGradient id="mkGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f8e8b4"/><stop offset=".5" stop-color="#e2b44a"/><stop offset="1" stop-color="#9a6f16"/></linearGradient>
              <pattern id="mkWave" width="80" height="40" patternUnits="userSpaceOnUse">
                <g fill="none" stroke="url(#mkGold)" stroke-width="1.6">${[34, 26, 18, 10].map(r => `<circle cx="40" cy="40" r="${r}"/><circle cx="0" cy="20" r="${r}"/><circle cx="80" cy="20" r="${r}"/>`).join('')}</g>
              </pattern>
              <linearGradient id="mkFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".55" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity=".95"/></linearGradient>
              <mask id="mkMask"><rect x="0" y="540" width="1440" height="360" fill="url(#mkFade)"/></mask>
              <radialGradient id="mkMoon" cx=".4" cy=".35"><stop offset="0" stop-color="#fff3c4"/><stop offset=".6" stop-color="#e8c264"/><stop offset="1" stop-color="#b8892a"/></radialGradient>
            </defs>
            <circle cx="1090" cy="240" r="150" fill="none" stroke="url(#mkGold)" stroke-width="1.5" stroke-opacity=".35"/>
            <circle cx="1090" cy="240" r="118" fill="url(#mkMoon)" fill-opacity=".92"/>
            <g fill="url(#mkGold)" fill-opacity=".16"><path d="M0,360 Q120,330 240,356 T480,350 T720,364 L720,392 Q600,372 480,386 T240,388 T0,396 Z"/><path d="M820,520 Q960,492 1100,516 T1440,508 L1440,540 Q1300,522 1100,546 T820,548 Z"/></g>
            <g fill="none" stroke="url(#mkGold)" stroke-linecap="round" stroke-width="5"><path d="M-30,210 C120,196 190,120 330,152 S520,96 610,36"/><path d="M190,150 C210,200 250,230 300,236" stroke-width="3"/><path d="M420,118 C440,170 470,196 520,206" stroke-width="3"/></g>
            ${[[150,176,1],[240,134,1.15],[330,152,1.3],[420,116,1],[520,98,1.2],[600,44,.95],[300,236,.85],[520,206,.8],[110,150,.7]].map(([x,y,s]) => blossom(x,y,s)).join('')}
            <rect x="0" y="540" width="1440" height="360" fill="url(#mkWave)" mask="url(#mkMask)" opacity=".62"/>
            <path d="M-100,0 L520,0 L-100,640 Z" fill="#fff" fill-opacity=".018"/>
            ${Array.from({length: 44}, (_, i) => `<circle cx="${(i * 331) % 1440}" cy="${(i * 163) % 900}" r="${(.8 + (i % 3) * .6).toFixed(1)}" fill="#ecc968" fill-opacity="${(.12 + (i % 5) * .06).toFixed(2)}"/>`).join('')}
          </svg>
        `;
      } else if (activeKey === 'shrine' || themeKey === 'shrine') {
        const roof = (cx, y, w, h) => `<path d="M${cx - w},${y + h} Q${cx - w * .62},${y + h * .72} ${cx - w * .3},${y} L${cx + w * .3},${y} Q${cx + w * .62},${y + h * .72} ${cx + w},${y + h} Q${cx},${y + h * .5} ${cx - w},${y + h} Z"/>`;
        const slashes = [[140,120,1010,420,0],[1300,90,420,640,.12],[260,700,1180,300,.24]];
        stage.innerHTML = `
          <style>
            @keyframes shCut { from { transform: scaleX(0); opacity: 0; } 12% { opacity: 1; } to { transform: scaleX(1); opacity: .85; } }
            @keyframes shRise { from { transform: translate3d(0,0,0); opacity: 0; } 20% { opacity: .9; } to { transform: translate3d(var(--dx),-420px,0); opacity: 0; } }
            .sh-cut { transform-box: fill-box; transform-origin: left center; animation: shCut .45s cubic-bezier(.2,.9,.2,1) both; }
            .sh-em { position: absolute; bottom: -10px; width: 5px; height: 5px; border-radius: 50%; background: radial-gradient(circle,#ffd0d0,#ef2b3a 60%,transparent 70%); will-change: transform; animation: shRise 9s linear infinite; }
            @media (prefers-reduced-motion: reduce) { .sh-cut { animation: none; } .sh-em { display: none; } }
          </style>
          <div style="position:absolute;inset:0;background:
            radial-gradient(ellipse 70% 45% at 50% 100%, rgba(190,18,40,.55), transparent 70%),
            linear-gradient(180deg,#030103 0%,#12040a 52%,#2a0610 80%,#080204 100%);"></div>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;">
            <defs>
              <radialGradient id="shMoon"><stop offset="0" stop-color="#ff6b6b"/><stop offset=".55" stop-color="#c0142a"/><stop offset="1" stop-color="#5a0614"/></radialGradient>
              <radialGradient id="shHalo"><stop offset="0" stop-color="#ef2b3a" stop-opacity=".5"/><stop offset="1" stop-color="#ef2b3a" stop-opacity="0"/></radialGradient>
              <linearGradient id="shCut" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".15" stop-color="#ffe3e3"/><stop offset=".6" stop-color="#ef2b3a"/><stop offset="1" stop-color="#ef2b3a" stop-opacity="0"/></linearGradient>
            </defs>
            ${Array.from({length: 50}, (_, i) => `<circle cx="${(i * 277) % 1440}" cy="${(i * 71) % 420}" r="${(.5 + (i % 3) * .4).toFixed(1)}" fill="#ffd0d0" fill-opacity="${(.2 + (i % 4) * .12).toFixed(2)}"/>`).join('')}
            <circle cx="720" cy="300" r="330" fill="url(#shHalo)"/>
            <circle cx="720" cy="300" r="170" fill="url(#shMoon)"/>
            <circle cx="760" cy="280" r="150" fill="#12040a" fill-opacity=".72"/>
            <g fill="#050103">
              ${roof(720, 250, 190, 56)}${roof(720, 330, 250, 66)}${roof(720, 430, 320, 78)}
              <rect x="640" y="306" width="160" height="24"/><rect x="600" y="396" width="240" height="34"/><rect x="540" y="508" width="360" height="40"/>
              ${[560, 620, 680, 760, 820, 880].map(x => `<rect x="${x}" y="540" width="14" height="130"/>`).join('')}
              <path d="M0,700 L180,660 L360,690 L540,640 L900,640 L1080,690 L1260,656 L1440,700 L1440,900 L0,900 Z"/>
            </g>
            <g fill="#ef2b3a" fill-opacity=".85">${[570, 630, 690, 770, 830, 890].map(x => `<rect x="${x + 3}" y="548" width="3" height="110"/>`).join('')}</g>
            <g stroke="#ef2b3a" stroke-width="2" fill="none" stroke-opacity=".8"><path d="M300,900 L340,760 L318,730 L372,690"/><path d="M1130,900 L1090,780 L1120,744 L1070,700"/><path d="M720,900 L704,820 L730,790"/></g>
            ${slashes.map(([x1,y1,x2,y2,d]) => { const len = Math.hypot(x2 - x1, y2 - y1), ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI; return `<g transform="translate(${x1},${y1}) rotate(${ang.toFixed(1)})"><rect class="sh-cut" style="animation-delay:${d}s" x="0" y="-1.6" width="${len.toFixed(0)}" height="3.2" fill="url(#shCut)"/></g>`; }).join('')}
          </svg>
          ${Array.from({length: 16}, (_, i) => `<i class="sh-em" style="left:${(i * 61) % 100}%;--dx:${(i % 2 ? 1 : -1) * (20 + (i % 4) * 18)}px;animation-delay:${-(i * 0.6).toFixed(1)}s;animation-duration:${7 + (i % 5) * 1.5}s"></i>`).join('')}
          <div style="position:absolute;inset:0;background:radial-gradient(ellipse 90% 80% at 50% 45%, transparent 45%, rgba(3,1,3,.7) 100%);"></div>
        `;
      } else if (SHADER_LOOKS[activeKey] || SHADER_LOOKS[themeKey]) {
        startShaderBg(stage, SHADER_LOOKS[activeKey] ? activeKey : themeKey);
      } else if (activeKey === 'kimi' || themeKey === 'kimi') {
        stage.innerHTML = `
          <style>
            @keyframes kimiArrive { from { opacity: 0; transform: translate(70px,-24px); } to { opacity: 1; transform: none; } }
            @keyframes kimiTwinkle { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
            #kimiComet { animation: kimiArrive 2.6s cubic-bezier(.16,1,.3,1) both; }
            .kimi-star-t { animation: kimiTwinkle 4.5s ease-in-out infinite; }
            @media (prefers-reduced-motion: reduce) { #kimiComet, .kimi-star-t { animation: none; } }
          </style>
          <div style="position:absolute;inset:0;background:
            radial-gradient(ellipse 120% 38% at 50% 104%, rgba(255,184,107,.60) 0%, rgba(255,111,165,.34) 40%, transparent 72%),
            linear-gradient(180deg,#04051a 0%,#0b0c34 32%,#26164c 60%,#5d2062 83%,#a63a6c 100%);"></div>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;">
            <defs>
              <linearGradient id="kimiTail" gradientUnits="userSpaceOnUse" x1="430" y1="250" x2="1300" y2="40">
                <stop offset="0" stop-color="#fff" stop-opacity="1"/>
                <stop offset="0.25" stop-color="#ffd9a8" stop-opacity="0.85"/>
                <stop offset="0.65" stop-color="#ff8fbd" stop-opacity="0.32"/>
                <stop offset="1" stop-color="#ff6fa5" stop-opacity="0"/>
              </linearGradient>
              <radialGradient id="kimiHead"><stop offset="0" stop-color="#fff"/><stop offset="0.3" stop-color="#ffe3bd" stop-opacity="0.85"/><stop offset="1" stop-color="#ff9ec7" stop-opacity="0"/></radialGradient>
              <filter id="kimiBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7"/></filter>
            </defs>
            ${Array.from({length: 90}, (_, i) => {
              const x = (i * 211.7) % 1440, y = ((i * 97.3) % 560) + (i % 5) * 6, r = 0.6 + (i % 4) * 0.45;
              return `<circle class="${i % 6 === 0 ? 'kimi-star-t' : ''}" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(2)}" fill="#fff" fill-opacity="${(0.35 + (i % 5) * 0.14).toFixed(2)}" ${i % 6 === 0 ? `style="animation-delay:${(i % 7) * 0.6}s"` : ''}/>`;
            }).join('')}
            <g id="kimiComet">
              <g filter="url(#kimiBlur)" opacity="0.9">
                <path d="M430,250 L1290,28 L1320,74 Z" fill="url(#kimiTail)"/>
                <path d="M430,250 L1230,150 L1290,190 Z" fill="url(#kimiTail)" opacity="0.7"/>
              </g>
              <path d="M430,250 L1290,28 L1312,64 Z" fill="url(#kimiTail)" opacity="0.8"/>
              <path d="M430,250 L1220,148 L1262,176 Z" fill="url(#kimiTail)" opacity="0.6"/>
              <circle cx="430" cy="250" r="64" fill="url(#kimiHead)"/>
              <circle cx="430" cy="250" r="6" fill="#fff"/>
            </g>
            <path d="M0,640 Q360,590 720,628 T1440,600 L1440,900 L0,900 Z" fill="#1b0f3b" fill-opacity="0.55"/>
            <g fill="#05030f" fill-opacity="0.94">
              ${Array.from({length: 48}, (_, i) => {
                const h = 60 + ((i * 53) % 7) * 26 + (i % 11 === 0 ? 90 : 0), x = i * 30;
                return `<rect x="${x}" y="${900 - h}" width="${24 + (i % 3) * 4}" height="${h}"/>`;
              }).join('')}
            </g>
            <g fill="#ffc977">
              ${Array.from({length: 120}, (_, i) => {
                const col = (i * 7) % 48, row = (i * 5) % 5;
                const h = 60 + ((col * 53) % 7) * 26 + (col % 11 === 0 ? 90 : 0);
                if (row * 18 + 22 > h - 8) return '';
                return `<rect x="${col * 30 + 5 + (i % 2) * 9}" y="${900 - h + 10 + row * 18}" width="4" height="6" fill-opacity="${(0.35 + (i % 4) * 0.18).toFixed(2)}"/>`;
              }).join('')}
            </g>
          </svg>
          <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(4,5,26,.38),rgba(4,5,26,.12) 60%,rgba(4,5,26,.30));"></div>
        `;
      } else if (activeKey === 'kintsugi' || themeKey === 'kintsugi') {
        stage.innerHTML = `
          <style>
            @keyframes kgDraw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
            .kg-vein { stroke-dasharray: 1; animation: kgDraw 3.4s cubic-bezier(.45,.05,.2,1) both; }
            @media (prefers-reduced-motion: reduce) { .kg-vein { animation: none; stroke-dasharray: none; } }
          </style>
          <div style="position:absolute;inset:0;background:
            radial-gradient(ellipse 70% 55% at 72% 30%, rgba(212,169,55,.17), transparent 65%),
            radial-gradient(ellipse 90% 60% at 18% 92%, rgba(120,60,15,.20), transparent 70%),
            linear-gradient(180deg,#0c0b09 0%,#090807 60%,#040302 100%);"></div>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;">
            <defs>
              <linearGradient id="kgGold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#f6e7b0"/><stop offset="0.5" stop-color="#d4a937"/><stop offset="1" stop-color="#8a6516"/>
              </linearGradient>
              <filter id="kgBrush" x="-25%" y="-25%" width="150%" height="150%">
                <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="3" seed="7" result="n"/>
                <feDisplacementMap in="SourceGraphic" in2="n" scale="18"/>
              </filter>
              <filter id="kgGlow" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <linearGradient id="kgMist" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#fff" stop-opacity="0.07"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <path d="M1030,128 A205,205 0 1 1 836,262" fill="none" stroke="url(#kgGold)" stroke-width="24" stroke-linecap="round" opacity="0.42" filter="url(#kgBrush)"/>
            <path d="M0,640 L140,560 L230,610 L380,470 L520,600 L640,520 L760,610 L900,500 L1040,600 L1180,510 L1320,590 L1440,540 L1440,900 L0,900 Z" fill="url(#kgMist)"/>
            <path d="M0,730 L180,650 L300,700 L470,610 L620,700 L800,630 L960,710 L1120,640 L1280,706 L1440,650 L1440,900 L0,900 Z" fill="#fff" fill-opacity="0.035"/>
            <path d="M0,820 L220,770 L420,810 L640,760 L880,812 L1100,770 L1440,818 L1440,900 L0,900 Z" fill="#000" fill-opacity="0.55"/>
            <g fill="none" stroke="url(#kgGold)" stroke-linecap="round" stroke-linejoin="round" filter="url(#kgGlow)">
              <path class="kg-vein" pathLength="1" stroke-width="2.4" d="M-20,610 L140,575 L205,620 L330,560 L410,590 L520,520 L640,548 L700,480"/>
              <path class="kg-vein" pathLength="1" stroke-width="1.5" style="animation-delay:.9s" d="M330,560 L352,640 L300,712 L318,790"/>
              <path class="kg-vein" pathLength="1" stroke-width="1.5" style="animation-delay:1.3s" d="M520,520 L560,450 L545,380 L590,310"/>
              <path class="kg-vein" pathLength="1" stroke-width="2.2" style="animation-delay:.4s" d="M1460,150 L1340,196 L1292,150 L1190,232 L1150,292 L1060,300"/>
              <path class="kg-vein" pathLength="1" stroke-width="1.3" style="animation-delay:1.6s" d="M1190,232 L1232,330 L1200,410"/>
            </g>
            <g fill="#e6c46a">
              ${Array.from({length: 36}, (_, i) => `<circle cx="${((i * 389) % 1440).toFixed(0)}" cy="${((i * 151) % 880).toFixed(0)}" r="${(0.7 + (i % 3) * 0.6).toFixed(1)}" fill-opacity="${(0.12 + (i % 5) * 0.07).toFixed(2)}"/>`).join('')}
            </g>
          </svg>
        `;
      } else if (['sakura_night', 'spring', 'autumn', 'ukiyoe', 'emerald'].includes(activeKey) || ['sakura_night', 'spring', 'autumn', 'emerald'].includes(themeKey)) {
        stage.innerHTML = `
          <!-- Японский ночной пейзаж: большая светящаяся луна в дымке, далёкие горные хребты и ворота Тории -->
          <div style="position:absolute;inset:0;background:
            radial-gradient(ellipse 75% 50% at 75% 18%, var(--season-glow), transparent 68%),
            radial-gradient(ellipse 80% 45% at 25% 88%, var(--season-secondary), transparent 70%);"></div>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;opacity:0.38;">
            <circle cx="1080" cy="220" r="145" fill="var(--brand-400)" fill-opacity="0.22"/>
            <circle cx="1080" cy="220" r="105" fill="var(--brand-300)" fill-opacity="0.25"/>
            <path d="M0,780 Q320,640 680,740 T1440,680 L1440,900 L0,900 Z" fill="var(--season-surface)" fill-opacity="0.55"/>
            <path d="M0,830 Q480,710 920,790 T1440,750 L1440,900 L0,900 Z" fill="var(--season-bg)" fill-opacity="0.75"/>
          </svg>
        `;
      } else {
        // Мягкое шёлковое северное сияние и созвездия под остальные темы (Неон, Океан, Закат, Хоккайдо, Кот, Токио Голд)
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:
            radial-gradient(ellipse 75% 50% at 50% -8%, var(--season-glow), transparent 70%),
            radial-gradient(ellipse 65% 45% at 85% 92%, var(--season-secondary), transparent 68%);"></div>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;opacity:0.36;">
            <path d="M-100,280 C340,120 760,440 1540,190" fill="none" stroke="var(--brand-400)" stroke-width="48" stroke-linecap="round" style="filter:blur(26px);opacity:0.35;"/>
            <path d="M-80,680 C420,520 880,800 1520,560" fill="none" stroke="var(--brand-500)" stroke-width="38" stroke-linecap="round" style="filter:blur(24px);opacity:0.28;"/>
          </svg>
        `;
      }
    }

    function applySeasonTheme(season, notify = true) {
      if (season === 'custom') {
        syncSettingsUI();
        applyCustomUserTheme(notify);
        renderSeasonParticles('default');
        return;
      }
      const theme = DESIGN_THEMES[season] || DESIGN_THEMES.default;
      state.siteSettings.seasonTheme = season in DESIGN_THEMES ? season : 'default';
      persistSiteSettings();

      const root = document.documentElement.style;
      root.setProperty('--season-bg', theme.bg);
      root.setProperty('--season-surface', theme.surface || '#0c0f17');
      root.setProperty('--season-surface-2', theme.surface2 || '#141824');
      root.setProperty('--season-glow', theme.glow);
      root.setProperty('--season-secondary', theme.secondary);
      root.setProperty('--season-accent', theme.b500);
      root.setProperty('--brand-300', theme.b300);
      root.setProperty('--brand-400', theme.b400);
      root.setProperty('--brand-500', theme.b500);
      root.setProperty('--brand-600', theme.b600);
      root.setProperty('--card-radius', theme.cardRadius || '1rem');
      root.setProperty('--panel-radius', theme.panelRadius || '1.5rem');
      root.setProperty('--btn-radius', theme.btnRadius || '0.75rem');
      root.setProperty('--card-border', theme.border || 'rgba(255,255,255,0.12)');
      root.setProperty('--font-heading', theme.font || "'Outfit', 'Inter', sans-serif");
      root.setProperty('--bg-pattern', theme.pattern || 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)');
      root.setProperty('--bg-pattern-size', theme.patternSize || '24px 24px');

      document.body.setAttribute('data-theme-arch', theme.arch || 'default');
      document.body.style.backgroundColor = theme.bg;

      // Если пресет привязан к аниме-морфингу или стриминг-платформе (Волейбол, Хоримия, Маг. битва, САО, Netflix, Crunchyroll), активируем его HUD-оформление
      if (theme.morph) {
        state.siteSettings.uiMorph = theme.morph;
        document.body.setAttribute('data-ui-morph', theme.morph);
      } else if (['haikyuu', 'horimiya', 'jjk', 'sao', 'netflix', 'crunchyroll', 'kimi', 'kintsugi', 'tsuki', 'citypop', 'inari', 'aurora', 'rain', 'vangogh', 'fuji', 'makie', 'shrine', 'cosmos', 'liquidgold', 'curse', 'biolum'].includes(state.siteSettings.uiMorph)) {
        state.siteSettings.uiMorph = 'spatial';
        document.body.removeAttribute('data-ui-morph');
      }
      persistSiteSettings();

      const brandTitle = document.getElementById('headerBrandTitle');
      const headerFoxSvg = document.getElementById('headerFoxSvg');
      const headerBadge = document.getElementById('headerThemeBadge');
      const activeDesignBadge = document.getElementById('activeDesignBadge');
      const watermark = document.getElementById('heroThemeWatermark');
      const heroPillText = document.getElementById('heroThemePillText');

      if (brandTitle) {
        brandTitle.textContent = season === 'netflix'
          ? 'NETFLIX'
          : season === 'crunchyroll'
          ? 'crunchyroll'
          : theme.isCat
          ? 'NEKO'
          : 'KITSUNE';
      }
      if (watermark) watermark.textContent = theme.watermark || '狐 // KITSUNE';
      if (heroPillText) heroPillText.textContent = theme.badgeText || 'Прямой HLS поток • Без VPN';
      if (headerFoxSvg) {
        if (season === 'netflix') {
          headerFoxSvg.innerHTML = `<path d="M16 10 H27 L39 40 V10 H48 V54 H37 L25 24 V54 H16 Z" fill="currentColor"/>`;
        } else if (season === 'crunchyroll') {
          headerFoxSvg.innerHTML = `<path d="M32 8 A24 24 0 1 1 10 40 A19 19 0 1 0 36 14 Z" fill="currentColor"/><circle cx="35" cy="35" r="12" fill="currentColor"/><circle cx="28" cy="28" r="4" fill="#f47521"/>`;
        } else if (theme.isCat) {
          headerFoxSvg.innerHTML = `<path d="M14 26 L18 12 L27 21 Q32 19 37 21 L46 12 L50 26 Q54 38 46 47 Q32 54 18 47 Q10 38 14 26 Z" stroke="currentColor" stroke-width="4.5" stroke-linejoin="round"/><circle cx="25" cy="34" r="2.6" fill="currentColor"/><circle cx="39" cy="34" r="2.6" fill="currentColor"/><path d="M8 34 L16 35 M56 34 L48 35" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`;
        } else {
          headerFoxSvg.innerHTML = `<path d="M12 12 L24 25 L32 23 L40 25 L52 12 L48 37 L32 54 L16 37 Z" stroke="currentColor" stroke-width="4.5" stroke-linejoin="round" /><path d="M22 35 L28 37 M42 35 L36 37" stroke="currentColor" stroke-width="4" stroke-linecap="round" /><path d="M10 31 L17 33 M54 31 L47 33" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" opacity="0.65" />`;
        }
      }
      if (headerBadge) headerBadge.textContent = theme.short;
      if (activeDesignBadge) activeDesignBadge.textContent = `${theme.name} — ${theme.desc}`;

      document.querySelectorAll('.theme-preset-btn, .mini-theme-pill').forEach(btn => {
        const key = btn.getAttribute('data-theme-card') || btn.getAttribute('data-mini-theme');
        const isCurrent = key === state.siteSettings.seasonTheme;
        btn.classList.toggle('ring-2', isCurrent);
        btn.classList.toggle('ring-brand-500', isCurrent);
      });

      renderSeasonParticles(state.siteSettings.seasonTheme);
      renderAnimeUniverseBackdropAndEmblem(state.siteSettings.seasonTheme, state.siteSettings.uiMorph);
      if (notify) showToast(`Дизайн: ${theme.name} (${theme.desc})`);
    }

    // --- ТОТАЛЬНАЯ ТРАНСФОРМАЦИЯ АРХИТЕКТУРЫ ДИЗАЙНА (UI MORPH MODES) ---
    const UI_MORPH_PRESETS = {
      spatial: {
        name: 'Spatial Cyber-Glass',
        themeKey: 'default',
        bgMode: 'aurora',
        watermark: '狐 // NEON',
        pill: 'SPATIAL GLASS • 60 FPS HLS'
      },
      nerv: {
        name: 'NERV // Tactical CRT OS',
        themeKey: 'emerald',
        bgMode: 'cybergrid',
        watermark: '特務機関 // NERV',
        pill: 'MAGI SYSTEM // TACTICAL STREAM'
      },
      manga: {
        name: 'Tokyo Manga // Shonen Ink',
        themeKey: 'default',
        bgMode: 'minimal',
        watermark: '少年 // MANGA INK',
        pill: 'SHONEN JUMP // HALFTONE EDITION'
      },
      ukiyoe: {
        name: 'Ukiyo-e // Imperial Scroll',
        themeKey: 'autumn',
        bgMode: 'seigaiha',
        watermark: '浮世絵 // EDO',
        pill: 'IMPERIAL SCROLL • KYOTO ARCHIVE'
      },
      haikyuu: {
        name: 'Волейбол!! // Karasuno Court',
        themeKey: 'haikyuu',
        bgMode: 'aurora',
        watermark: '飛べ // KARASUNO',
        pill: 'KARASUNO #10 • FLY HIGH COURT'
      },
      horimiya: {
        name: 'Хоримия // Sweet Soda & Pastel',
        themeKey: 'horimiya',
        bgMode: 'nebula',
        watermark: 'ホリミヤ // 青春',
        pill: 'HORI × MIYAMURA • SWEET SODA'
      },
      tsuki: {
        name: 'Лунный сад // Moon Bamboo',
        themeKey: 'tsuki',
        bgMode: 'minimal',
        watermark: '月 // TSUKI',
        pill: 'MOON GARDEN • FIREFLY NIGHT'
      },
      citypop: {
        name: 'Токио 1985 // City Pop',
        themeKey: 'citypop',
        bgMode: 'minimal',
        watermark: '東京 // 1985',
        pill: 'CITY POP • MIDNIGHT CRUISE'
      },
      inari: {
        name: 'Тысяча врат // Inari',
        themeKey: 'inari',
        bgMode: 'minimal',
        watermark: '千本鳥居 // INARI',
        pill: 'SENBON TORII • LANTERN PATH'
      },
      aurora: {
        name: 'Аврора // Polar Night',
        themeKey: 'aurora',
        bgMode: 'minimal',
        watermark: 'オーロラ // AURORA',
        pill: 'POLAR NIGHT • AURORA BOREALIS'
      },
      rain: {
        name: 'Токио под дождём // Neon Rain',
        themeKey: 'rain',
        bgMode: 'minimal',
        watermark: '雨 // NEON RAIN',
        pill: 'RAINY NIGHT • WET NEON'
      },
      vangogh: {
        name: 'Звёздная ночь // Van Gogh',
        themeKey: 'vangogh',
        bgMode: 'minimal',
        watermark: '星月夜 // VAN GOGH',
        pill: 'STARRY NIGHT • OIL STROKES'
      },
      fuji: {
        name: 'Фудзи // Dawn',
        themeKey: 'fuji',
        bgMode: 'minimal',
        watermark: '富士 // DAWN',
        pill: 'FUJI DAWN • SAKURA PETALS'
      },
      makie: {
        name: 'Маки-э // Black Lacquer',
        themeKey: 'makie',
        bgMode: 'minimal',
        watermark: '蒔絵 // MAKI-E',
        pill: 'BLACK LACQUER • GOLD DUST'
      },
      shrine: {
        name: 'Тёмный храм // Domain',
        themeKey: 'shrine',
        bgMode: 'minimal',
        watermark: '呪 // DOMAIN',
        pill: 'MALEVOLENT SHRINE • CURSED EMBERS'
      },
      cosmos: {
        name: 'Космос // Nebula',
        themeKey: 'cosmos',
        bgMode: 'minimal',
        watermark: '星雲 // COSMOS',
        pill: 'LIVE NEBULA • DEEP SPACE'
      },
      liquidgold: {
        name: 'Жидкое золото // Marble',
        themeKey: 'liquidgold',
        bgMode: 'minimal',
        watermark: '金 // LIQUID GOLD',
        pill: 'BLACK MARBLE • FLOWING GOLD'
      },
      curse: {
        name: 'Проклятая энергия // Flow',
        themeKey: 'curse',
        bgMode: 'minimal',
        watermark: '呪力 // CURSE',
        pill: 'CURSED ENERGY • LIVE FLOW'
      },
      biolum: {
        name: 'Био-свечение // Deep',
        themeKey: 'biolum',
        bgMode: 'minimal',
        watermark: '光 // BIOLUM',
        pill: 'DEEP SEA • BIOLUMINESCENCE'
      },
      kimi: {
        name: 'Твоё имя // Twilight Comet',
        themeKey: 'kimi',
        bgMode: 'minimal',
        watermark: '彗星 // KOMET',
        pill: 'TWILIGHT SKY • COMET FALL'
      },
      kintsugi: {
        name: 'Кинцуги // Gold & Ink',
        themeKey: 'kintsugi',
        bgMode: 'minimal',
        watermark: '金継ぎ // KINTSUGI',
        pill: 'SUMI-E INK • GOLD LACQUER'
      },
      jjk: {
        name: 'Магическая битва // Cursed Energy',
        themeKey: 'jjk',
        bgMode: 'aurora',
        watermark: '呪術廻戦 // 茈',
        pill: 'DOMAIN EXPANSION • HOLLOW PURPLE'
      },
      sao: {
        name: 'SAO // Aincrad Link Start HUD',
        themeKey: 'sao',
        bgMode: 'cybergrid',
        watermark: 'AINCRAD // LV.99',
        pill: 'NERVEGEAR OS • LINK START!'
      },
      netflix: {
        name: 'Netflix // N-Series Tudum UI',
        themeKey: 'netflix',
        bgMode: 'minimal',
        watermark: 'N // SERIES',
        pill: 'N SERIES • TOP 10 IN ANIME TODAY'
      },
      crunchyroll: {
        name: 'Crunchyroll // Hime Orange UI',
        themeKey: 'crunchyroll',
        bgMode: 'aurora',
        watermark: 'CR // SIMULCAST',
        pill: 'MEGA FAN • SIMULCAST STREAM'
      }
    };

    function applyUiMorphMode(mode, notify = true) {
      const m = mode in UI_MORPH_PRESETS ? mode : 'spatial';
      const cfg = UI_MORPH_PRESETS[m];
      state.siteSettings.uiMorph = m;

      if (m === 'spatial') {
        document.body.removeAttribute('data-ui-morph');
      } else {
        document.body.setAttribute('data-ui-morph', m);
      }

      if (notify) {
        applySeasonTheme(cfg.themeKey, false);
        setBackgroundMode(cfg.bgMode, false);
      }

      persistSiteSettings();

      // Перезаписываем водяной знак только если выбран специальный режим морфинга (NERV / Manga / Ukiyo-e) или при явном клике
      if (m !== 'spatial' || notify) {
        const currentTheme = DESIGN_THEMES[state.siteSettings.seasonTheme] || DESIGN_THEMES.default;
        const watermark = document.getElementById('heroThemeWatermark');
        const pill = document.getElementById('heroThemePillText');
        if (watermark) watermark.textContent = m === 'spatial' ? (currentTheme.watermark || cfg.watermark) : cfg.watermark;
        if (pill) pill.textContent = m === 'spatial' ? (currentTheme.badgeText || cfg.pill) : cfg.pill;
      }

      document.querySelectorAll('.ui-morph-btn').forEach(btn => {
        const active = btn.getAttribute('data-morph-card') === m;
        btn.classList.toggle('ring-2', active);
        btn.classList.toggle('ring-brand-500', active);
      });

      renderAnimeUniverseBackdropAndEmblem(state.siteSettings.seasonTheme, m);
      if (notify) showToast(`Концепция интерфейса: ${cfg.name}`);
    }

    function syncSettingsUI() {
      const ct = state.siteSettings.customTheme || { accent: '#f43f5e', bg: '#07080b', arch: 'cyber' };
      const accEl = document.getElementById('customAccentPicker');
      const bgEl = document.getElementById('customBgPicker');
      const archEl = document.getElementById('customArchSelect');
      const blurSlider = document.getElementById('posterBlurSlider');
      const auraChk = document.getElementById('cursorAuraToggle');
      if (accEl) accEl.value = ct.accent || '#f43f5e';
      if (bgEl) bgEl.value = ct.bg || '#07080b';
      if (archEl) archEl.value = ct.arch || 'default';
      if (blurSlider) blurSlider.value = state.siteSettings.posterBgOpacity ?? 38;
      if (auraChk) auraChk.checked = state.siteSettings.cursorAura !== false;

      document.querySelectorAll('.ui-morph-btn').forEach(btn => {
        const active = btn.getAttribute('data-morph-card') === (state.siteSettings.uiMorph || 'spatial');
        btn.classList.toggle('ring-2', active);
        btn.classList.toggle('ring-brand-500', active);
      });
    }

    function toggleLofiRadio() {
      const badge = document.getElementById('radioStatusBadge');
      const eq = document.getElementById('headerRadioEq');
      if (state.radioActive) {
        state.radioActive = false;
        clearInterval(state.radioInterval);
        if (state.radioCtx) state.radioCtx.close().catch(() => {});
        if (badge) badge.textContent = 'ВЫКЛ';
        if (eq) eq.classList.add('hidden');
        showToast('Lo-Fi радио выключено');
        return;
      }
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        state.radioCtx = ctx;
        state.radioActive = true;
        const notes = [261.63, 329.63, 392.0, 493.88, 349.23, 440.0];
        let step = 0;
        const playChord = () => {
          if (!state.radioActive) return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = notes[step % notes.length];
          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.035, ctx.currentTime + 0.3);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.65);
          step++;
        };
        playChord();
        state.radioInterval = setInterval(playChord, 1800);
        if (badge) badge.textContent = 'ON AIR';
        if (eq) eq.classList.remove('hidden');
        showToast('KITSUNE Lo-Fi Radio запущено');
      } catch (e) {}
    }

    function switchAuthMode(mode) {
      state.authMode = mode;
      const isReg = mode === 'register';
      const regBtn = document.getElementById('authModeRegBtn');
      const logBtn = document.getElementById('authModeLoginBtn');
      const nickInp = document.getElementById('authNickInput');
      if (regBtn) regBtn.className = isReg ? 'flex-1 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-bold cursor-pointer' : 'flex-1 py-1.5 rounded-lg text-zinc-400 text-xs font-semibold cursor-pointer';
      if (logBtn) logBtn.className = !isReg ? 'flex-1 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-bold cursor-pointer' : 'flex-1 py-1.5 rounded-lg text-zinc-400 text-xs font-semibold cursor-pointer';
      if (nickInp) nickInp.classList.toggle('hidden', !isReg);
    }

    async function handleEmailAuth(e) {
      e.preventDefault();
      const nick = document.getElementById('authNickInput').value.trim();
      const email = document.getElementById('authEmailInput').value.trim().toLowerCase();
      const pass = document.getElementById('authPassInput').value;
      if (!email || !pass) return;

      if (state.authMode === 'register') {
        const newAcc = { name: nick || email.split('@')[0], email, passHash: pass, createdAt: Date.now() };
        state.accountsDb[email] = newAcc;
        localStorage.setItem('kitsune_accounts_db', JSON.stringify(state.accountsDb));
        state.user = { name: newAcc.name, email: newAcc.email };
        localStorage.setItem('kitsune_user', JSON.stringify(state.user));
        saveUserScopedData();
        syncProfileUI();
        renderUserCollection();
        renderUserFavorites();
        renderUserShowcase();
        renderFriendsTab();
        showToast(`Аккаунт ${state.user.name} создан!`);
      } else {
        const existing = state.accountsDb[email];
        if (!existing || existing.passHash !== pass) {
          showToast('Неверный Email или пароль');
          return;
        }
        state.user = { name: existing.name, email: existing.email };
        localStorage.setItem('kitsune_user', JSON.stringify(state.user));
        loadUserScopedData();
        syncProfileUI();
        syncMyListBadge();
        renderContinueWatching();
        renderCatalogGrid();
        renderUserCollection();
        renderUserFavorites();
        renderUserShowcase();
        renderFriendsTab();
        showToast(`С возвращением, ${state.user.name}!`);
      }
    }

    function quickSwitchAccount(email) {
      const acc = state.accountsDb[email];
      if (!acc) return;
      state.user = { name: acc.name, email: acc.email, avatar: acc.avatar || '' };
      localStorage.setItem('kitsune_user', JSON.stringify(state.user));
      loadUserScopedData();
      syncProfileUI();
      syncMyListBadge();
      renderContinueWatching();
      renderCatalogGrid();
      renderUserCollection();
      renderUserFavorites();
      renderUserShowcase();
      renderFriendsTab();
      showToast(`Активный профиль: ${acc.name}`);
    }

    function setAvatarFrame(frameClass) {
      state.siteSettings.avatarFrame = frameClass;
      localStorage.setItem('kitsune_settings', JSON.stringify(state.siteSettings));
      syncProfileUI();
      showToast('Рамка профиля обновлена!');
    }

    function logoutAccount() {
      state.user = null;
      localStorage.removeItem('kitsune_user');
      loadUserScopedData();
      syncProfileUI();
      syncMyListBadge();
      renderContinueWatching();
      renderCatalogGrid();
      renderUserCollection();
      renderUserFavorites();
      renderUserShowcase();
      showToast('Вы вышли из аккаунта');
    }

    function syncProfileUI() {
      const u = state.user;
      const frame = state.siteSettings.avatarFrame || '';
      const avatarSrc = state.customAvatar || u?.avatar || '';
      const headerName = document.getElementById('headerProfileName');
      const headerAvatar = document.getElementById('headerAvatarCircle');
      const bigAvatar = document.getElementById('profileBigAvatar');
      const resetAvatarBtn = document.getElementById('resetAvatarBtn');
      const dispName = document.getElementById('profileDisplayName');
      const dispEmail = document.getElementById('profileDisplayEmail');
      const authBox = document.getElementById('authSectionBox');
      const outBar = document.getElementById('loggedOutBar');
      const switcher = document.getElementById('savedAccountsSwitcher');
      const listEl = document.getElementById('savedAccountsList');
      const defaultFoxSvg = `<svg class="w-4 h-4" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linejoin="round"><path d="M12 12 L24 25 L32 23 L40 25 L52 12 L48 37 L32 54 L16 37 Z"/></svg>`;
      const bigDefaultFoxSvg = `<svg class="w-8 h-8" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linejoin="round"><path d="M12 12 L24 25 L32 23 L40 25 L52 12 L48 37 L32 54 L16 37 Z"/></svg>`;

      if (headerName) headerName.textContent = u ? u.name : 'Войти';
      if (headerAvatar) {
        headerAvatar.className = `w-6 h-6 rounded-lg bg-black/25 flex items-center justify-center text-[11px] font-black overflow-hidden ${frame}`;
        headerAvatar.innerHTML = avatarSrc
          ? `<img src="${avatarSrc}" alt="Avatar" class="w-full h-full object-cover" />`
          : (u ? u.name.slice(0, 1).toUpperCase() : defaultFoxSvg);
      }
      if (bigAvatar) {
        bigAvatar.className = `w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-display font-black text-2xl overflow-hidden cursor-pointer shadow-xl transition-transform group-hover:scale-105 ${frame}`;
        bigAvatar.innerHTML = avatarSrc
          ? `<img src="${avatarSrc}" alt="Avatar" class="w-full h-full object-cover" />`
          : (u ? u.name.slice(0, 1).toUpperCase() : bigDefaultFoxSvg);
      }
      if (resetAvatarBtn) {
        resetAvatarBtn.classList.toggle('hidden', !avatarSrc);
      }
      if (dispName) dispName.textContent = u ? u.name : 'Гость KITSUNE';
      if (dispEmail) dispEmail.textContent = u ? u.email : 'Личный кабинет и галерея трофеев';
      if (authBox) authBox.classList.toggle('hidden', Boolean(u));
      if (outBar) outBar.classList.toggle('hidden', !u);

      if (switcher && listEl) {
        const accs = Object.values(state.accountsDb);
        switcher.classList.toggle('hidden', accs.length === 0);
        listEl.innerHTML = accs.map(a => `
          <button type="button" onclick="quickSwitchAccount('${a.email}')" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer ${u?.email === a.email ? 'bg-brand-600 border-brand-500 text-white' : 'bg-dark-900 border-white/10 text-zinc-300 hover:border-brand-500'}">
            ${a.avatar ? `<img src="${a.avatar}" class="w-4 h-4 rounded-full object-cover" />` : ''}
            <span>${a.name}</span>
          </button>
        `).join('');
      }
    }

    // --- РУЛЕТКА / ОРАКУЛ ---
    function spinPlannedRoulette() {
      const pool = state.catalog;
      const pick = pool[Math.floor(Math.random() * pool.length)];
      if (pick) {
        showToast(`Рулетка выбрала: ${getAnimeDisplayTitle(pick)}`);
        openAnimePlayer(pick);
      }
    }

    // --- ИНИЦИАЛИЗАЦИЯ ---
    window.addEventListener('DOMContentLoaded', () => {
      loadUserScopedData();
      
    Object.assign(DESIGN_THEMES, {
      frieren_moon: {
        name: '💠 Фрирен: Лунные цветы',
        short: 'Фрирен',
        desc: 'Светящееся поле цветов Синей Луны и золотая звёздная пыль',
        watermark: 'フリーレン // 蒼月草',
        badgeText: 'SOUSOU NO FRIEREN • BLUE MOON WEED SANCTUARY',
        arch: 'soft',
        morph: 'frieren_moon',
        dot: '#38bdf8',
        bg: '#060b19',
        surface: '#0d1832',
        surface2: '#15254a',
        glow: 'rgba(56, 189, 248, 0.38)',
        secondary: 'rgba(250, 204, 21, 0.24)',
        cardRadius: '1.55rem',
        panelRadius: '2.15rem',
        btnRadius: '1rem',
        border: 'rgba(125, 211, 252, 0.45)',
        font: "'Playfair Display', Georgia, serif",
        pattern: 'radial-gradient(ellipse 90% 55% at 50% 95%, rgba(56, 189, 248, 0.28), transparent 72%)',
        patternSize: '100% 100%',
        b300: '#bae6fd', b400: '#38bdf8', b500: '#0284c7', b600: '#0369a1'
      },
      violet_letter: {
        name: '✉️ Вайолет: Письма заката',
        short: 'Вайолет',
        desc: 'Золотая филигрань, сургучная печать и тёплый закат Лейденшафтлиха',
        watermark: '自動手記人形 // 手紙',
        badgeText: 'VIOLET EVERGARDEN • AUTO MEMORY DOLL',
        arch: 'zen',
        morph: 'violet_letter',
        dot: '#fbbf24',
        bg: '#160c12',
        surface: '#26141f',
        surface2: '#361c2c',
        glow: 'rgba(251, 191, 36, 0.35)',
        secondary: 'rgba(244, 114, 182, 0.28)',
        cardRadius: '1.25rem',
        panelRadius: '1.85rem',
        btnRadius: '0.85rem',
        border: 'rgba(251, 191, 36, 0.52)',
        font: "'Playfair Display', Georgia, serif",
        pattern: 'radial-gradient(ellipse 85% 55% at 50% 0%, rgba(244, 114, 182, 0.24), rgba(251, 191, 36, 0.16) 50%, transparent 75%)',
        patternSize: '100% 100%',
        b300: '#fde68a', b400: '#fbbf24', b500: '#d97706', b600: '#be185d'
      },
      kamakura_train: {
        name: '🚋 Поезд у океана Камакуры',
        short: 'Камакура',
        desc: 'Вечерняя электричка Энодэн у бирюзового океана на закате',
        watermark: '江ノ電 // 夕凪',
        badgeText: 'KAMAKURA SEASIDE • ENODEN SUNSET LINE',
        arch: 'soft',
        morph: 'kamakura_train',
        dot: '#fb923c',
        bg: '#09131c',
        surface: '#112230',
        surface2: '#1a3144',
        glow: 'rgba(251, 146, 60, 0.36)',
        secondary: 'rgba(45, 212, 191, 0.28)',
        cardRadius: '1.5rem',
        panelRadius: '2.1rem',
        btnRadius: '1rem',
        border: 'rgba(45, 212, 191, 0.42)',
        font: "'Outfit', sans-serif",
        pattern: 'radial-gradient(ellipse 90% 50% at 50% 95%, rgba(251, 146, 60, 0.28), rgba(45, 212, 191, 0.18) 55%, transparent 75%)',
        patternSize: '100% 100%',
        b300: '#fed7aa', b400: '#fb923c', b500: '#f97316', b600: '#0d9488'
      },
      snowy_onsen: {
        name: '♨️ Снежный онсэн Хоккайдо',
        short: 'Онсэн',
        desc: 'Горячий источник с густым паром и янтарными фонарями среди снега',
        watermark: '雪見温泉 // 湯けむり',
        badgeText: 'HOKKAIDO SNOW ONSEN • WARM STEAM SANCTUARY',
        arch: 'crystal',
        morph: 'snowy_onsen',
        dot: '#fde68a',
        bg: '#09101d',
        surface: '#121f36',
        surface2: '#1b2e4f',
        glow: 'rgba(251, 191, 36, 0.34)',
        secondary: 'rgba(125, 211, 252, 0.28)',
        cardRadius: '1.6rem',
        panelRadius: '2.15rem',
        btnRadius: '1rem',
        border: 'rgba(251, 191, 36, 0.45)',
        font: "'Playfair Display', Georgia, serif",
        pattern: 'radial-gradient(ellipse 85% 55% at 50% 100%, rgba(251, 191, 36, 0.25), rgba(125, 211, 252, 0.16) 55%, transparent 75%)',
        patternSize: '100% 100%',
        b300: '#fde68a', b400: '#fbbf24', b500: '#f59e0b', b600: '#0284c7'
      }
    });

    if (typeof UI_MORPH_PRESETS !== 'undefined') {
      Object.assign(UI_MORPH_PRESETS, {
        frieren_moon: { name: '💠 Фрирен: Поле лунных цветов', themeKey: 'frieren_moon', bgMode: 'nebula', watermark: 'フリーレン // 蒼月草', pill: 'BLUE MOON WEED FIELD • STARLIGHT MAGIC' },
        violet_letter: { name: '✉️ Вайолет: Письма на закате', themeKey: 'violet_letter', bgMode: 'twilight', watermark: '自動手記人形 // 手紙', pill: 'VIOLET EVERGARDEN • SUNSET LETTERS' },
        kamakura_train: { name: '🚋 Поезд у океана Камакуры', themeKey: 'kamakura_train', bgMode: 'twilight', watermark: '江ノ電 // 夕凪', pill: 'KAMAKURA SEASIDE • ENODEN SUNSET' },
        snowy_onsen: { name: '♨️ Снежный онсэн Хоккайдо', themeKey: 'snowy_onsen', bgMode: 'aurora', watermark: '雪見温泉 // 湯けむり', pill: 'SNOWY HOT SPRING • LANTERN STEAM' }
      });
    }

    const _prevRenderBackdropV10 = renderAnimeUniverseBackdropAndEmblem;
    renderAnimeUniverseBackdropAndEmblem = function(themeKey, morphKey) {
      const stage = document.getElementById('animeUniverseBgLayer');
      const activeKey = (morphKey && morphKey !== 'spatial') ? morphKey : themeKey;

      if (stage && activeKey === 'frieren_moon') {
        stage.style.filter = 'blur(0.5px) saturate(1.22)';
        stage.innerHTML = `
          <!-- Астральный космос Высшей Магии Фрирен: столкновение Небесной Лазури (Золтраак), Золотой Маны Эльфов и Фиолетовой Звёздной Бездны -->
          <div style="position:absolute;inset:0;background:
            radial-gradient(circle at 24% 40%, rgba(56,189,248,0.46) 0%, rgba(2,132,199,0.20) 34%, transparent 64%),
            radial-gradient(circle at 76% 40%, rgba(250,204,21,0.38) 0%, rgba(168,85,247,0.24) 35%, transparent 64%),
            radial-gradient(circle at 50% 42%, rgba(125,211,252,0.52) 0%, rgba(59,130,246,0.26) 40%, transparent 72%),
            linear-gradient(180deg, #02050e 0%, #071128 48%, #0b0c24 80%, #030611 100%);"></div>

          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;opacity:0.95;">
            <defs>
              <!-- Ядро печати Золтраак -->
              <radialGradient id="zoltraakCoreOrb" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
                <stop offset="28%" stop-color="#e0f2fe" stop-opacity="0.95"/>
                <stop offset="56%" stop-color="#38bdf8" stop-opacity="0.78"/>
                <stop offset="82%" stop-color="#6366f1" stop-opacity="0.32"/>
                <stop offset="100%" stop-color="#0284c7" stop-opacity="0"/>
              </radialGradient>

              <!-- Сфера Золотой Маны Тысячелетней Эльфийки -->
              <radialGradient id="elvenGoldMana" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#fef9c3" stop-opacity="0.95"/>
                <stop offset="35%" stop-color="#facc15" stop-opacity="0.72"/>
                <stop offset="72%" stop-color="#ca8a04" stop-opacity="0.24"/>
                <stop offset="100%" stop-color="#ca8a04" stop-opacity="0"/>
              </radialGradient>

              <!-- Сфера Астрального Космоса (Judradjim / Vollzanbel) -->
              <radialGradient id="arcaneVioletMana" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#f3e8ff" stop-opacity="0.95"/>
                <stop offset="35%" stop-color="#c084fc" stop-opacity="0.75"/>
                <stop offset="72%" stop-color="#7e22ce" stop-opacity="0.26"/>
                <stop offset="100%" stop-color="#581c87" stop-opacity="0"/>
              </radialGradient>

              <!-- Градиент луча Золтраак во весь экран -->
              <linearGradient id="zoltraakHyperBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0"/>
                <stop offset="20%" stop-color="#38bdf8" stop-opacity="0.85"/>
                <stop offset="50%" stop-color="#ffffff" stop-opacity="1"/>
                <stop offset="80%" stop-color="#fde047" stop-opacity="0.85"/>
                <stop offset="100%" stop-color="#c084fc" stop-opacity="0"/>
              </linearGradient>
            </defs>

            <!-- Фоновые кандзи Высшей Магии: 葬送 (Провожающая), 極致 (Вершина Магии), 魔導 (Магия) -->
            <text x="195" y="235" fill="#38bdf8" fill-opacity="0.13" font-family="serif" font-weight="900" font-size="115">葬送</text>
            <text x="1055" y="235" fill="#fde047" fill-opacity="0.13" font-family="serif" font-weight="900" font-size="115">極致</text>
            <text x="660" y="820" fill="#bae6fd" fill-opacity="0.10" font-family="serif" font-weight="900" font-size="145">魔導</text>

            <!-- Левая мана-сфера Золотого Благословения (движется навстречу центру как у Годзё) -->
            <g style="animation:jjkOrbCollideLeft 7.5s ease-in-out infinite;">
              <circle cx="350" cy="390" r="150" fill="url(#elvenGoldMana)"/>
              <circle cx="350" cy="390" r="118" fill="none" stroke="#fde047" stroke-width="1.8" stroke-dasharray="10 8" opacity="0.7"/>
              <polygon points="350,275 450,448 250,448" fill="none" stroke="#fef08a" stroke-width="1.3" opacity="0.5"/>
              <polygon points="350,505 450,332 250,332" fill="none" stroke="#fef08a" stroke-width="1.3" opacity="0.5"/>
            </g>

            <!-- Правая мана-сфера Астрального Разряда -->
            <g style="animation:jjkOrbCollideRight 7.5s ease-in-out infinite;">
              <circle cx="1090" cy="390" r="150" fill="url(#arcaneVioletMana)"/>
              <circle cx="1090" cy="390" r="118" fill="none" stroke="#d8b4fe" stroke-width="1.8" stroke-dasharray="10 8" opacity="0.7"/>
              <polygon points="1090,275 1190,448 990,448" fill="none" stroke="#e9d5ff" stroke-width="1.3" opacity="0.5"/>
              <polygon points="1090,505 1190,332 990,332" fill="none" stroke="#e9d5ff" stroke-width="1.3" opacity="0.5"/>
            </g>

            <!-- ГИГАНТСКАЯ ЦЕНТРАЛЬНАЯ МНОГОСЛОЙНАЯ ПЕЧАТЬ ЗОЛТРААК (6 ВРАЩАЮЩИХСЯ КОЛЕЦ И ГЕКСАГРАММ) -->
            <g transform="translate(720, 390)">
              <!-- Световой ореол ядра Золтраак -->
              <circle cx="0" cy="0" r="265" fill="url(#zoltraakCoreOrb)" style="animation:floatSlowPulse 5.5s ease-in-out infinite;"/>

              <!-- Внешнее кольцо 1 (вращение по часовой стрелке): двойной рунический обод -->
              <g style="animation:zoltraakSpinCW 36s linear infinite;">
                <circle cx="0" cy="0" r="295" fill="none" stroke="#38bdf8" stroke-width="2.2" opacity="0.78"/>
                <circle cx="0" cy="0" r="278" fill="none" stroke="#bae6fd" stroke-width="1.4" stroke-dasharray="18 10 4 10" opacity="0.75"/>
                <!-- 8 малых спутниковых печатей по периметру (как у каста Золтраак Фрирен) -->
                <circle cx="0" cy="-286" r="14" fill="#040b1c" stroke="#7dd3fc" stroke-width="2"/>
                <circle cx="0" cy="286" r="14" fill="#040b1c" stroke="#7dd3fc" stroke-width="2"/>
                <circle cx="-286" cy="0" r="14" fill="#040b1c" stroke="#7dd3fc" stroke-width="2"/>
                <circle cx="286" cy="0" r="14" fill="#040b1c" stroke="#7dd3fc" stroke-width="2"/>
                <circle cx="202" cy="-202" r="11" fill="#040b1c" stroke="#fde047" stroke-width="2"/>
                <circle cx="-202" cy="-202" r="11" fill="#040b1c" stroke="#fde047" stroke-width="2"/>
                <circle cx="202" cy="202" r="11" fill="#040b1c" stroke="#fde047" stroke-width="2"/>
                <circle cx="-202" cy="202" r="11" fill="#040b1c" stroke="#fde047" stroke-width="2"/>
              </g>

              <!-- Среднее кольцо 2 (вращение против часовой стрелки): священная двенадцатиконечная звезда-гексаграмма -->
              <g style="animation:zoltraakSpinCCW 26s linear infinite;">
                <circle cx="0" cy="0" r="225" fill="none" stroke="#fde047" stroke-width="1.8" stroke-dasharray="32 12" opacity="0.82"/>
                <polygon points="0,-222 192,111 -192,111" fill="none" stroke="#7dd3fc" stroke-width="2.2" opacity="0.85"/>
                <polygon points="0,222 192,-111 -192,-111" fill="none" stroke="#7dd3fc" stroke-width="2.2" opacity="0.85"/>
                <rect x="-156" y="-156" width="312" height="312" fill="none" stroke="#fde047" stroke-width="1.5" opacity="0.62"/>
                <rect x="-156" y="-156" width="312" height="312" fill="none" stroke="#c084fc" stroke-width="1.5" transform="rotate(45)" opacity="0.62"/>
              </g>

              <!-- Внутреннее кольцо 3 (быстрое вращение по часовой): геометрический магический затвор -->
              <g style="animation:zoltraakSpinCW 16s linear infinite;">
                <circle cx="0" cy="0" r="135" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-dasharray="14 8" opacity="0.9"/>
                <circle cx="0" cy="0" r="105" fill="none" stroke="#38bdf8" stroke-width="1.8" opacity="0.85"/>
                <polygon points="0,-105 91,52 -91,52" fill="none" stroke="#fde047" stroke-width="2" opacity="0.9"/>
                <polygon points="0,105 91,-52 -91,-52" fill="none" stroke="#fde047" stroke-width="2" opacity="0.9"/>
              </g>

              <!-- Ослепительное центральное ядро каста Золтраак + посох Фрирен (золотой полумесяц с багровым кристаллом) -->
              <circle cx="0" cy="0" r="46" fill="#ffffff" fill-opacity="0.95" style="filter:blur(4px);"/>
              <path d="M-26,-10 A30,30 0 1,0 26,-10 A22,24 0 1,1 -26,-10 Z" fill="#fde047" stroke="#ffffff" stroke-width="1.5"/>
              <circle cx="0" cy="-6" r="9" fill="#e11d48" stroke="#fecdd3" stroke-width="1.8"/>
            </g>

            <!-- Пронзающие экран наклонные лучи гипер-каста Золтраак и наклонные орбиты маны -->
            <g style="animation:zoltraakBeamPulse 4.5s ease-in-out infinite;">
              <ellipse cx="720" cy="390" rx="540" ry="115" fill="none" stroke="url(#zoltraakHyperBeam)" stroke-width="3" transform="rotate(-17 720 390)" opacity="0.85"/>
              <ellipse cx="720" cy="390" rx="590" ry="155" fill="none" stroke="url(#zoltraakHyperBeam)" stroke-width="1.8" stroke-dasharray="24 12" transform="rotate(15 720 390)" opacity="0.68"/>
              <line x1="60" y1="610" x2="1380" y2="170" stroke="url(#zoltraakHyperBeam)" stroke-width="4.5" stroke-linecap="round" opacity="0.82"/>
              <line x1="120" y1="180" x2="1320" y2="600" stroke="url(#zoltraakHyperBeam)" stroke-width="2.5" stroke-dasharray="18 14" stroke-linecap="round" opacity="0.65"/>
            </g>

            <!-- Дуги бело-голубых и золотых молний вокруг разряда Золтраак -->
            <polyline points="520,245 585,305 565,335 635,375" fill="none" stroke="#bae6fd" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="920,520 855,455 875,425 810,395" fill="none" stroke="#fde047" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="745,155 715,235 745,255 725,315" fill="none" stroke="#e0f2fe" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>

            <!-- Светящиеся магические бабочки и лепестки цветов Синей Луны внизу -->
            <g fill="#7dd3fc" opacity="0.88">
              <circle cx="260" cy="680" r="4.5" style="animation:fireflyFloat 6s ease-in-out infinite;"/>
              <circle cx="480" cy="720" r="5.5" fill="#fde047" style="animation:fireflyFloat 7.2s ease-in-out infinite 1s;"/>
              <circle cx="720" cy="740" r="5" style="animation:fireflyFloat 5.6s ease-in-out infinite 0.5s;"/>
              <circle cx="960" cy="710" r="5.5" fill="#fde047" style="animation:fireflyFloat 6.8s ease-in-out infinite 1.5s;"/>
              <circle cx="1180" cy="675" r="4.5" style="animation:fireflyFloat 6.2s ease-in-out infinite 0.8s;"/>
            </g>
          </svg>
        `;
        return;
      }

      if (stage && activeKey === 'violet_letter') {
        stage.style.filter = 'blur(1px) saturate(1.12)';
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:
            radial-gradient(ellipse 90% 55% at 50% 88%, rgba(251,191,36,0.34) 0%, rgba(244,114,182,0.28) 45%, transparent 78%),
            linear-gradient(180deg, #12080f 0%, #261220 48%, #471d32 78%, #210e18 100%);"></div>

          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;opacity:0.9;">
            <!-- Золотая винтажная филигранная рамка и роза ветров в стиле Вайолет Эвергарден -->
            <circle cx="720" cy="450" r="340" fill="none" stroke="#fbbf24" stroke-width="1" stroke-dasharray="6 10" opacity="0.32"/>
            <circle cx="720" cy="450" r="355" fill="none" stroke="#f472b6" stroke-width="0.8" opacity="0.25"/>

            <!-- Парящие в тёплом закатном воздухе конверты с красной сургучной печатью -->
            <g transform="translate(220, 260) rotate(-14)" style="animation:featherDrift 8s ease-in-out infinite;">
              <rect x="0" y="0" width="68" height="44" rx="4" fill="#fef3c7" fill-opacity="0.82" stroke="#d97706" stroke-width="1.5"/>
              <polyline points="2,2 34,26 66,2" fill="none" stroke="#b45309" stroke-width="1.5"/>
              <circle cx="34" cy="24" r="6" fill="#be123c"/>
            </g>

            <g transform="translate(1120, 310) rotate(11) scale(0.9)" style="animation:featherDrift 9.5s ease-in-out infinite 1.5s;">
              <rect x="0" y="0" width="68" height="44" rx="4" fill="#fef3c7" fill-opacity="0.82" stroke="#d97706" stroke-width="1.5"/>
              <polyline points="2,2 34,26 66,2" fill="none" stroke="#b45309" stroke-width="1.5"/>
              <circle cx="34" cy="24" r="6" fill="#be123c"/>
            </g>

            <g transform="translate(880, 620) rotate(-8) scale(0.78)" style="animation:featherDrift 7.5s ease-in-out infinite 0.7s;">
              <rect x="0" y="0" width="68" height="44" rx="4" fill="#fef3c7" fill-opacity="0.75" stroke="#d97706" stroke-width="1.5"/>
              <polyline points="2,2 34,26 66,2" fill="none" stroke="#b45309" stroke-width="1.5"/>
              <circle cx="34" cy="24" r="6" fill="#be123c"/>
            </g>
          </svg>
        `;
        return;
      }

      if (stage && activeKey === 'kamakura_train') {
        stage.style.filter = 'blur(1px) saturate(1.14)';
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:
            radial-gradient(circle at 72% 62%, rgba(251,146,60,0.48) 0%, rgba(244,63,94,0.26) 38%, transparent 68%),
            linear-gradient(180deg, #071422 0%, #102a3f 42%, #293242 66%, #0b1b26 100%);"></div>

          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;opacity:0.92;">
            <!-- Огромное тёплое закатное солнце над океаном Камакуры -->
            <circle cx="1040" cy="540" r="140" fill="#fb923c" fill-opacity="0.78"/>
            <circle cx="1040" cy="540" r="210" fill="#f97316" fill-opacity="0.22" style="filter:blur(20px);"/>

            <!-- Бирюзовая гладь океана с солнечной дорожкой -->
            <rect x="0" y="590" width="1440" height="310" fill="#082032" fill-opacity="0.85"/>
            <ellipse cx="1040" cy="635" rx="160" ry="10" fill="#fde047" fill-opacity="0.55"/>
            <ellipse cx="1040" cy="675" rx="120" ry="8" fill="#fb923c" fill-opacity="0.45"/>
            <ellipse cx="1040" cy="715" rx="85" ry="6" fill="#fb923c" fill-opacity="0.35"/>

            <!-- Уютная ретро-электричка Энодэн с тёплыми жёлтыми окнами, идущая вдоль берега -->
            <line x1="0" y1="775" x2="1440" y2="775" stroke="#334155" stroke-width="6"/>
            <g transform="translate(180, 695)">
              <rect x="0" y="0" width="380" height="74" rx="14" fill="#115e59" stroke="#fef08a" stroke-width="2"/>
              <rect x="0" y="38" width="380" height="8" fill="#fef3c7"/>
              <!-- Тёплые светящиеся окна вагона -->
              <rect x="24" y="12" width="46" height="22" rx="4" fill="#fef08a"/>
              <rect x="84" y="12" width="46" height="22" rx="4" fill="#fef08a"/>
              <rect x="144" y="12" width="46" height="22" rx="4" fill="#fef08a"/>
              <rect x="204" y="12" width="46" height="22" rx="4" fill="#fef08a"/>
              <rect x="264" y="12" width="46" height="22" rx="4" fill="#fef08a"/>
              <rect x="324" y="12" width="34" height="22" rx="4" fill="#fde047"/>
            </g>
          </svg>
        `;
        return;
      }

      if (stage && activeKey === 'snowy_onsen') {
        stage.style.filter = 'blur(1px) saturate(1.12)';
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:
            radial-gradient(ellipse 85% 45% at 50% 95%, rgba(251,191,36,0.34) 0%, rgba(56,189,248,0.22) 52%, transparent 78%),
            linear-gradient(180deg, #060b16 0%, #0e1a32 52%, #162847 82%, #0c1526 100%);"></div>

          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;opacity:0.9;">
            <!-- Заснеженные ветви сосны и тёплые деревянные фонари ротэнбуро (открытого онсэна) -->
            <ellipse cx="720" cy="830" rx="580" ry="70" fill="#0ea5e9" fill-opacity="0.22"/>
            <!-- Клубы тёплого пара над горячей водой источника -->
            <ellipse cx="480" cy="760" rx="190" ry="45" fill="#fef3c7" fill-opacity="0.16" style="filter:blur(18px);animation:floatSlowPulse 7s ease-in-out infinite;"/>
            <ellipse cx="860" cy="745" rx="220" ry="52" fill="#fde68a" fill-opacity="0.18" style="filter:blur(20px);animation:floatSlowPulse 8.5s ease-in-out infinite 1.5s;"/>

            <!-- Тёплые каменные фонари Торо у воды -->
            <g transform="translate(230, 650)">
              <circle cx="0" cy="30" r="65" fill="#fbbf24" fill-opacity="0.32" style="filter:blur(12px);"/>
              <polygon points="-28,12 28,12 18,-6 -18,-6" fill="#334155"/>
              <rect x="-14" y="12" width="28" height="32" rx="3" fill="#fef08a"/>
              <rect x="-18" y="44" width="36" height="50" fill="#1e293b"/>
            </g>
            <g transform="translate(1190, 640)">
              <circle cx="0" cy="30" r="65" fill="#fbbf24" fill-opacity="0.32" style="filter:blur(12px);"/>
              <polygon points="-28,12 28,12 18,-6 -18,-6" fill="#334155"/>
              <rect x="-14" y="12" width="28" height="32" rx="3" fill="#fef08a"/>
              <rect x="-18" y="44" width="36" height="50" fill="#1e293b"/>
            </g>
          </svg>
        `;
        return;
      }

      return _prevRenderBackdropV10(themeKey, morphKey);
    };

    
    Object.assign(DESIGN_THEMES, {
      solo_monarch: {
        name: '👑 Соло Левелинг: Монарх Теней',
        short: 'Монарх',
        desc: 'Заклинание «Восстань!» (Arise), фиолетовая бездна и окно Системы',
        watermark: '起きろ // ARISE',
        badgeText: 'SHADOW MONARCH • SYSTEM LEVEL UP',
        arch: 'cyber',
        morph: 'solo_monarch',
        dot: '#a855f7',
        bg: '#04020a',
        surface: '#0d0622',
        surface2: '#170b38',
        glow: 'rgba(168, 85, 247, 0.45)',
        secondary: 'rgba(56, 189, 248, 0.30)',
        cardRadius: '0.65rem',
        panelRadius: '1.1rem',
        btnRadius: '0.5rem',
        border: 'rgba(168, 85, 247, 0.65)',
        font: "'Outfit', 'JetBrains Mono', sans-serif",
        pattern: 'radial-gradient(ellipse 90% 55% at 50% 40%, rgba(139, 92, 246, 0.32), rgba(56, 189, 248, 0.16) 55%, transparent 75%)',
        patternSize: '100% 100%',
        b300: '#d8b4fe', b400: '#c084fc', b500: '#9333ea', b600: '#0284c7'
      },
      demon_infinity: {
        name: '🔥 Клинок: Танец Бога Огня',
        short: 'Хиноками',
        desc: 'Огненное кольцо Дыхания Солнца и Замок Бесконечности',
        watermark: 'ヒノカミ神楽 // 炎',
        badgeText: 'HINOKAMI KAGURA • INFINITY CASTLE',
        arch: 'zen',
        morph: 'demon_infinity',
        dot: '#f97316',
        bg: '#110504',
        surface: '#210a07',
        surface2: '#33100b',
        glow: 'rgba(249, 115, 22, 0.44)',
        secondary: 'rgba(225, 29, 72, 0.30)',
        cardRadius: '1.15rem',
        panelRadius: '1.65rem',
        btnRadius: '0.75rem',
        border: 'rgba(251, 146, 60, 0.62)',
        font: "'Playfair Display', Georgia, serif",
        pattern: 'radial-gradient(ellipse 90% 55% at 50% 45%, rgba(249, 115, 22, 0.32), rgba(225, 29, 72, 0.20) 55%, transparent 75%)',
        patternSize: '100% 100%',
        b300: '#fde047', b400: '#fb923c', b500: '#ea580c', b600: '#be123c'
      },
      apothecary_palace: {
        name: '🌺 Монолог фармацевта: Дворец',
        short: 'Маомао',
        desc: 'Императорский нефрит, золотая печать и алые пионы Маомао',
        watermark: '薬屋 // 百花',
        badgeText: 'APOTHECARY DIARIES • IMPERIAL JADE PALACE',
        arch: 'zen',
        morph: 'apothecary_palace',
        dot: '#10b981',
        bg: '#04130f',
        surface: '#09241c',
        surface2: '#10362a',
        glow: 'rgba(16, 185, 129, 0.38)',
        secondary: 'rgba(244, 63, 94, 0.26)',
        cardRadius: '1.35rem',
        panelRadius: '1.95rem',
        btnRadius: '0.85rem',
        border: 'rgba(52, 211, 153, 0.58)',
        font: "'Playfair Display', Georgia, serif",
        pattern: 'radial-gradient(ellipse 85% 55% at 50% 35%, rgba(16, 185, 129, 0.28), rgba(251, 191, 36, 0.16) 55%, transparent 75%)',
        patternSize: '100% 100%',
        b300: '#a7f3d0', b400: '#34d399', b500: '#10b981', b600: '#d97706'
      },
      bleach_bankai: {
        name: '🌸 Блич: Банкай Сэнбонзакура',
        short: 'Банкай',
        desc: 'Тысяча светящихся лепестков сакуры и клинки Кагэёси в ночи',
        watermark: '卍解 // 千本桜',
        badgeText: 'BLEACH TYBW • SENBONZAKURA KAGEYOSHI',
        arch: 'crystal',
        morph: 'bleach_bankai',
        dot: '#f472b6',
        bg: '#0b0410',
        surface: '#180824',
        surface2: '#260d38',
        glow: 'rgba(236, 72, 153, 0.42)',
        secondary: 'rgba(168, 85, 247, 0.30)',
        cardRadius: '1.1rem',
        panelRadius: '1.6rem',
        btnRadius: '0.75rem',
        border: 'rgba(244, 114, 182, 0.62)',
        font: "'Playfair Display', Georgia, serif",
        pattern: 'radial-gradient(ellipse 90% 55% at 50% 42%, rgba(236, 72, 153, 0.32), rgba(168, 85, 247, 0.22) 55%, transparent 75%)',
        patternSize: '100% 100%',
        b300: '#fbcfe8', b400: '#f472b6', b500: '#db2777', b600: '#9333ea'
      }
    });

    if (typeof UI_MORPH_PRESETS !== 'undefined') {
      Object.assign(UI_MORPH_PRESETS, {
        solo_monarch: { name: '👑 Соло Левелинг: Монарх Теней', themeKey: 'solo_monarch', bgMode: 'nebula', watermark: '起きろ // ARISE', pill: 'SHADOW MONARCH • SYSTEM ARISE' },
        demon_infinity: { name: '🔥 Клинок: Танец Бога Огня', themeKey: 'demon_infinity', bgMode: 'twilight', watermark: 'ヒノカミ神楽 // 炎', pill: 'HINOKAMI KAGURA • SUN BREATHING' },
        apothecary_palace: { name: '🌺 Монолог фармацевта: Дворец', themeKey: 'apothecary_palace', bgMode: 'aurora', watermark: '薬屋 // 百花', pill: 'IMPERIAL PALACE • JADE & PEONY' },
        bleach_bankai: { name: '🌸 Блич: Банкай Сэнбонзакура', themeKey: 'bleach_bankai', bgMode: 'twilight', watermark: '卍解 // 千本桜', pill: 'BANKAI • SENBONZAKURA KAGEYOSHI' }
      });
    }

    const _prevRenderBackdropV13 = renderAnimeUniverseBackdropAndEmblem;
    renderAnimeUniverseBackdropAndEmblem = function(themeKey, morphKey) {
      const stage = document.getElementById('animeUniverseBgLayer');
      const activeKey = (morphKey && morphKey !== 'spatial') ? morphKey : themeKey;

      if (stage && activeKey === 'solo_monarch') {
        stage.style.filter = 'blur(0.5px) saturate(1.25)';
        stage.innerHTML = `
          <!-- Бездна Теневого Монарха Сон Джин-Ву: столкновение Фиолетовой Некромантии и Лазурного Окна Системы -->
          <div style="position:absolute;inset:0;background:
            radial-gradient(circle at 50% 42%, rgba(168,85,247,0.52) 0%, rgba(109,40,217,0.28) 38%, transparent 70%),
            radial-gradient(circle at 22% 38%, rgba(56,189,248,0.40) 0%, transparent 58%),
            radial-gradient(circle at 78% 38%, rgba(192,132,252,0.40) 0%, transparent 58%),
            linear-gradient(180deg, #030108 0%, #090418 50%, #04010c 100%);"></div>

          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;opacity:0.95;">
            <defs>
              <radialGradient id="monarchAbyssCore" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#04010a" stop-opacity="0.98"/>
                <stop offset="48%" stop-color="#090318" stop-opacity="0.95"/>
                <stop offset="62%" stop-color="#e9d5ff" stop-opacity="0.95"/>
                <stop offset="74%" stop-color="#a855f7" stop-opacity="0.82"/>
                <stop offset="100%" stop-color="#581c87" stop-opacity="0"/>
              </radialGradient>
              <linearGradient id="systemManaSlash" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0"/>
                <stop offset="25%" stop-color="#38bdf8" stop-opacity="0.9"/>
                <stop offset="50%" stop-color="#ffffff" stop-opacity="1"/>
                <stop offset="75%" stop-color="#a855f7" stop-opacity="0.9"/>
                <stop offset="100%" stop-color="#a855f7" stop-opacity="0"/>
              </linearGradient>
            </defs>

            <!-- Фоновые кандзи «Восстань» (起きろ) и «Монарх Теней» (影の君主) -->
            <text x="175" y="230" fill="#a855f7" fill-opacity="0.14" font-family="serif" font-weight="900" font-size="110">影の君主</text>
            <text x="1040" y="230" fill="#38bdf8" fill-opacity="0.14" font-family="monospace" font-weight="900" font-size="95">[ARISE]</text>

            <!-- Вращающийся круг призыва армии Теневого Монарха -->
            <g transform="translate(720, 395)">
              <circle cx="0" cy="0" r="245" fill="url(#monarchAbyssCore)" style="animation:floatSlowPulse 5.5s ease-in-out infinite;"/>
              <g style="animation:zoltraakSpinCW 32s linear infinite;">
                <circle cx="0" cy="0" r="285" fill="none" stroke="#a855f7" stroke-width="2.5" stroke-dasharray="22 10 6 10" opacity="0.85"/>
                <polygon points="0,-275 238,137 -238,137" fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.78"/>
                <polygon points="0,275 238,-137 -238,-137" fill="none" stroke="#c084fc" stroke-width="2" opacity="0.78"/>
              </g>
              <g style="animation:zoltraakSpinCCW 20s linear infinite;">
                <circle cx="0" cy="0" r="190" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="16 8" opacity="0.85"/>
                <rect x="-134" y="-134" width="268" height="268" fill="none" stroke="#e9d5ff" stroke-width="1.6" opacity="0.65"/>
                <rect x="-134" y="-134" width="268" height="268" fill="none" stroke="#a855f7" stroke-width="1.6" transform="rotate(45)" opacity="0.65"/>
              </g>
              <!-- Сияющие лазурные глаза Монарха в центре Бездны -->
              <path d="M-55,-8 Q-28,-24 -8,-4 Q-32,6 -55,-8 Z" fill="#38bdf8" filter="drop-shadow(0 0 12px #38bdf8)"/>
              <path d="M55,-8 Q28,-24 8,-4 Q32,6 55,-8 Z" fill="#a855f7" filter="drop-shadow(0 0 12px #a855f7)"/>
            </g>

            <!-- Диагональные рассечения кинжалами Камиша -->
            <line x1="90" y1="620" x2="1350" y2="170" stroke="url(#systemManaSlash)" stroke-width="4" opacity="0.85"/>
            <line x1="150" y1="190" x2="1290" y2="600" stroke="url(#systemManaSlash)" stroke-width="2.5" stroke-dasharray="20 12" opacity="0.7"/>
          </svg>
        `;
        return;
      }

      if (stage && activeKey === 'demon_infinity') {
        stage.style.filter = 'blur(0.5px) saturate(1.22)';
        stage.innerHTML = `
          <!-- Замок Бесконечности и Огненное Кольцо Дыхания Солнца (Хиноками Кагура) -->
          <div style="position:absolute;inset:0;background:
            radial-gradient(circle at 50% 42%, rgba(249,115,22,0.50) 0%, rgba(225,29,72,0.28) 40%, transparent 72%),
            linear-gradient(180deg, #0d0302 0%, #1f0805 50%, #0b0202 100%);"></div>

          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;opacity:0.94;">
            <defs>
              <radialGradient id="hinokamiSunRing" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#140402" stop-opacity="0.92"/>
                <stop offset="52%" stop-color="#450a0a" stop-opacity="0.85"/>
                <stop offset="68%" stop-color="#fde047" stop-opacity="0.98"/>
                <stop offset="80%" stop-color="#f97316" stop-opacity="0.88"/>
                <stop offset="92%" stop-color="#e11d48" stop-opacity="0.45"/>
                <stop offset="100%" stop-color="#9f1239" stop-opacity="0"/>
              </radialGradient>
            </defs>

            <!-- Перспективные золотые линии сёдзи Замка Бесконечности -->
            <g stroke="#fb923c" stroke-opacity="0.22" stroke-width="1.2">
              <line x1="0" y1="0" x2="720" y2="395"/><line x1="1440" y1="0" x2="720" y2="395"/>
              <line x1="0" y1="900" x2="720" y2="395"/><line x1="1440" y1="900" x2="720" y2="395"/>
              <rect x="260" y="135" width="920" height="520" fill="none"/>
              <rect x="420" y="215" width="600" height="360" fill="none"/>
            </g>

            <text x="190" y="235" fill="#fb923c" fill-opacity="0.15" font-family="serif" font-weight="900" font-size="115">ヒノカミ</text>
            <text x="1040" y="235" fill="#fde047" fill-opacity="0.15" font-family="serif" font-weight="900" font-size="115">神楽</text>

            <!-- Вращающееся огненное кольцо Дыхания Солнца Тандзиро -->
            <g transform="translate(720, 395)">
              <circle cx="0" cy="0" r="255" fill="url(#hinokamiSunRing)" style="animation:floatSlowPulse 5s ease-in-out infinite;"/>
              <g style="animation:zoltraakSpinCW 24s linear infinite;">
                <circle cx="0" cy="0" r="235" fill="none" stroke="#fde047" stroke-width="3" stroke-dasharray="36 14 10 14" opacity="0.92"/>
                <circle cx="0" cy="0" r="195" fill="none" stroke="#f97316" stroke-width="2.2" stroke-dasharray="20 12" opacity="0.85"/>
                <!-- Лучи серёжек Ханафуда (Восходящее солнце) -->
                <line x1="0" y1="-235" x2="0" y2="-135" stroke="#fde047" stroke-width="2.5"/>
                <line x1="0" y1="235" x2="0" y2="135" stroke="#fde047" stroke-width="2.5"/>
                <line x1="-235" y1="0" x2="-135" y2="0" stroke="#fde047" stroke-width="2.5"/>
                <line x1="235" y1="0" x2="135" y2="0" stroke="#fde047" stroke-width="2.5"/>
                <line x1="-166" y1="-166" x2="-95" y2="-95" stroke="#fb923c" stroke-width="2.2"/>
                <line x1="166" y1="-166" x2="95" y2="-95" stroke="#fb923c" stroke-width="2.2"/>
                <line x1="-166" y1="166" x2="-95" y2="95" stroke="#fb923c" stroke-width="2.2"/>
                <line x1="166" y1="166" x2="95" y2="95" stroke="#fb923c" stroke-width="2.2"/>
              </g>
            </g>
          </svg>
        `;
        return;
      }

      if (stage && activeKey === 'apothecary_palace') {
        stage.style.filter = 'blur(0.5px) saturate(1.18)';
        stage.innerHTML = `
          <!-- Нефритовый Внутренний Дворец Маомао: изумрудный шёлк, золотая мандала и алые лепестки пионов -->
          <div style="position:absolute;inset:0;background:
            radial-gradient(circle at 50% 40%, rgba(16,185,129,0.42) 0%, rgba(251,191,36,0.22) 42%, transparent 72%),
            radial-gradient(circle at 80% 25%, rgba(244,63,94,0.28) 0%, transparent 55%),
            linear-gradient(180deg, #030d0a 0%, #072018 52%, #04110d 100%);"></div>

          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;opacity:0.92;">
            <g transform="translate(720, 395)">
              <g style="animation:zoltraakSpinCW 42s linear infinite;">
                <circle cx="0" cy="0" r="270" fill="none" stroke="#fbbf24" stroke-width="2" stroke-dasharray="14 8" opacity="0.72"/>
                <circle cx="0" cy="0" r="245" fill="none" stroke="#34d399" stroke-width="1.6" opacity="0.65"/>
                <rect x="-172" y="-172" width="344" height="344" rx="24" fill="none" stroke="#fbbf24" stroke-width="1.6" opacity="0.55"/>
                <rect x="-172" y="-172" width="344" height="344" rx="24" fill="none" stroke="#34d399" stroke-width="1.6" transform="rotate(45)" opacity="0.55"/>
              </g>
              <circle cx="0" cy="0" r="78" fill="#064e3b" fill-opacity="0.65" stroke="#fbbf24" stroke-width="2.2"/>
              <text x="0" y="18" text-anchor="middle" fill="#fde68a" font-family="serif" font-weight="900" font-size="54">薬</text>
            </g>
          </svg>
        `;
        return;
      }

      if (stage && activeKey === 'bleach_bankai') {
        stage.style.filter = 'blur(0.5px) saturate(1.22)';
        stage.innerHTML = `
          <!-- Банкай Сэнбонзакура Кагэёси: ряды гигантских клинков света и вихрь из тысячи лепестков сакуры -->
          <div style="position:absolute;inset:0;background:
            radial-gradient(circle at 50% 42%, rgba(236,72,153,0.48) 0%, rgba(168,85,247,0.28) 42%, transparent 72%),
            linear-gradient(180deg, #07020b 0%, #160621 52%, #08020d 100%);"></div>

          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;opacity:0.94;">
            <text x="180" y="235" fill="#f472b6" fill-opacity="0.15" font-family="serif" font-weight="900" font-size="120">卍解</text>
            <text x="980" y="235" fill="#fbcfe8" fill-opacity="0.15" font-family="serif" font-weight="900" font-size="110">千本桜</text>

            <!-- Перспективные колонны сияющих клинков Сэнбонзакуры слева и справа -->
            <g fill="#fbcfe8" fill-opacity="0.28" stroke="#f472b6" stroke-width="1.5">
              <polygon points="140,850 165,160 190,850"/>
              <polygon points="240,850 262,210 284,850"/>
              <polygon points="335,850 354,255 373,850"/>
              <polygon points="1300,850 1275,160 1250,850"/>
              <polygon points="1200,850 1178,210 1156,850"/>
              <polygon points="1105,850 1086,255 1067,850"/>
            </g>

            <!-- Центральный вихрь лепестков Банкая -->
            <g transform="translate(720, 395)" style="animation:zoltraakSpinCW 28s linear infinite;">
              <ellipse cx="0" cy="0" rx="340" ry="120" fill="none" stroke="#f472b6" stroke-width="2.5" stroke-dasharray="28 14" opacity="0.82"/>
              <ellipse cx="0" cy="0" rx="340" ry="120" fill="none" stroke="#fbcfe8" stroke-width="2" stroke-dasharray="18 12" transform="rotate(60)" opacity="0.75"/>
              <ellipse cx="0" cy="0" rx="340" ry="120" fill="none" stroke="#c084fc" stroke-width="2" stroke-dasharray="18 12" transform="rotate(120)" opacity="0.75"/>
            </g>
          </svg>
        `;
        return;
      }

      return _prevRenderBackdropV13(themeKey, morphKey);
    };

    renderThemeSelectors();
      document.body.classList.toggle('anim-60fps', state.siteSettings.smoothAnim !== false);
      syncSettingsUI();
      applyUiMorphMode(state.siteSettings.uiMorph || 'spatial', false);
      applySeasonTheme(state.siteSettings.seasonTheme || 'default', false);
      setBackgroundMode(state.siteSettings.bgMode || 'aurora', false);
      updatePosterBackdropIntensity(state.siteSettings.posterBgOpacity ?? 38);
      toggleCursorAura(state.siteSettings.cursorAura !== false);
      syncMyListBadge();
      syncFavoritesCountBadge();
      syncFriendsCountBadge();
      syncProfileUI();
      renderContinueWatching();
      populateGenreSelect();
      renderCatalogGrid();
      startHeroSlider();
      startRealtimeCalendarTicker();
      fetchAniLibriaCatalog(1, false);
      setupInfiniteScroll();
    });

    function setupInfiniteScroll() {
      const sentinel = document.getElementById('infiniteScrollSentinel');
      if (!sentinel || !('IntersectionObserver' in window)) return;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && state.activePage === 'home' && state.feedTab !== 'mylist' && state.hasMorePages && !state.isFetchingMore) {
            fetchAniLibriaCatalog(state.loadedPage + 1, true);
          }
        });
      }, { rootMargin: '400px 0px' });
      observer.observe(sentinel);
    }

    // =========================================================================
    // РАСШИРЕНИЕ V5: 4 НОВЫХ ДИЗАЙНА + ОБЛАЧНАЯ СИНХРОНИЗАЦИЯ НА 4 ДРУЗЕЙ + ZERO-SERVER GEMINI
    // =========================================================================

    Object.assign(DESIGN_THEMES, {
      persona5: {
        name: 'Persona 5 // Phantom',
        short: 'Persona 5',
        desc: 'Красно-чёрный панк-комикс и рваные углы Сибуи',
        watermark: '心の怪盗団 // P5',
        badgeText: 'PHANTOM THIEVES • TAKE YOUR HEART',
        arch: 'cyber',
        morph: 'persona5',
        dot: '#e60012',
        bg: '#0b0204',
        surface: '#120407',
        surface2: '#1f070c',
        glow: 'rgba(230, 0, 18, 0.42)',
        secondary: 'rgba(255, 255, 255, 0.18)',
        cardRadius: '0rem',
        panelRadius: '0rem',
        btnRadius: '0.15rem',
        border: '#ffffff',
        font: "'Outfit', 'Inter', sans-serif",
        pattern: 'repeating-linear-gradient(-25deg, rgba(230,0,18,0.11) 0px, rgba(230,0,18,0.11) 18px, transparent 18px, transparent 36px)',
        patternSize: '100% 100%',
        b300: '#fca5a5', b400: '#ff2a3a', b500: '#e60012', b600: '#b8000e'
      },
      edgerunners: {
        name: 'Cyberpunk // 2077',
        short: '2077',
        desc: 'Кислотный жёлтый #FCEE0A, голубой неон и глитч Найт-Сити',
        watermark: 'NIGHT CITY // 2077',
        badgeText: 'EDGERUNNERS • SANDY OVERDRIVE',
        arch: 'cyber',
        morph: 'edgerunners',
        dot: '#fcee0a',
        bg: '#07060f',
        surface: '#0d0c1d',
        surface2: '#171530',
        glow: 'rgba(252, 238, 10, 0.35)',
        secondary: 'rgba(0, 240, 255, 0.28)',
        cardRadius: '0rem',
        panelRadius: '0.2rem',
        btnRadius: '0.15rem',
        border: 'rgba(252, 238, 10, 0.75)',
        font: "'JetBrains Mono', monospace",
        pattern: 'radial-gradient(ellipse 90% 50% at 50% -10%, rgba(0, 240, 255, 0.25), transparent 70%)',
        patternSize: '100% 100%',
        b300: '#fef08a', b400: '#fcee0a', b500: '#00f0ff', b600: '#ff003c'
      },
      chainsaw: {
        name: 'Chainsaw // VHS 97',
        short: 'VHS 97',
        desc: 'Токийский грайндхаус 1997, кислотный лайм и оранжевая кровь',
        watermark: 'チェンソー // 1997',
        badgeText: 'PUBLIC SAFETY DEVIL HUNTERS • VHS',
        arch: 'cyber',
        morph: 'chainsaw',
        dot: '#a3e635',
        bg: '#0a0907',
        surface: '#14110e',
        surface2: '#211c17',
        glow: 'rgba(163, 230, 53, 0.32)',
        secondary: 'rgba(234, 88, 12, 0.28)',
        cardRadius: '0.15rem',
        panelRadius: '0.25rem',
        btnRadius: '0.15rem',
        border: 'rgba(163, 230, 53, 0.65)',
        font: "'JetBrains Mono', sans-serif",
        pattern: 'radial-gradient(ellipse 85% 50% at 50% 0%, rgba(234, 88, 12, 0.24), transparent 72%)',
        patternSize: '100% 100%',
        b300: '#d9f99d', b400: '#a3e635', b500: '#ea580c', b600: '#c2410c'
      },
      shaft: {
        name: 'Monogatari // SHAFT',
        short: 'SHAFT',
        desc: 'Артхаусная типографика, номера кадров и алая луна',
        watermark: '化物語 // 壱',
        badgeText: 'STUDIO SHAFT • AVANT-GARDE CUT',
        arch: 'zen',
        morph: 'shaft',
        dot: '#e11d48',
        bg: '#09080a',
        surface: '#110f14',
        surface2: '#1b1820',
        glow: 'rgba(225, 29, 72, 0.30)',
        secondary: 'rgba(255, 255, 255, 0.12)',
        cardRadius: '0rem',
        panelRadius: '0rem',
        btnRadius: '0rem',
        border: 'rgba(255, 255, 255, 0.5)',
        font: "'Playfair Display', Georgia, serif",
        pattern: 'radial-gradient(circle at 80% 20%, rgba(225, 29, 72, 0.24), transparent 60%)',
        patternSize: '100% 100%',
        b300: '#fda4af', b400: '#fb7185', b500: '#e11d48', b600: '#be123c'
      }
    });

    if (typeof UI_MORPH_PRESETS !== 'undefined') {
      Object.assign(UI_MORPH_PRESETS, {
        persona5: { name: 'Persona 5 // Phantom Thieves', themeKey: 'persona5', bgMode: 'minimal', watermark: '心の怪盗団 // P5', pill: 'PHANTOM THIEVES • TAKE YOUR HEART' },
        edgerunners: { name: 'Cyberpunk // Edgerunners 2077', themeKey: 'edgerunners', bgMode: 'cybergrid', watermark: 'NIGHT CITY // 2077', pill: 'SANDY OVERDRIVE • BRAINDANCE' },
        chainsaw: { name: 'Chainsaw Man // VHS 1997', themeKey: 'chainsaw', bgMode: 'minimal', watermark: 'チェンソー // VHS', pill: 'DEVIL HUNTER ARCHIVE • 1997' },
        shaft: { name: 'Monogatari // Studio SHAFT', themeKey: 'shaft', bgMode: 'minimal', watermark: '化物語 // 弐', pill: 'STUDIO SHAFT • SCENE 【壱】' }
      });
    }

    const _origRenderBackdrop = renderAnimeUniverseBackdropAndEmblem;
    renderAnimeUniverseBackdropAndEmblem = function(themeKey, morphKey) {
      const stage = document.getElementById('animeUniverseBgLayer');
      const activeKey = (morphKey && morphKey !== 'spatial') ? morphKey : themeKey;

      if (stage && activeKey === 'persona5') {
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:repeating-linear-gradient(-22deg, #090203 0px, #090203 45px, #1c0307 45px, #1c0307 90px);"></div>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;opacity:0.85;">
            <polygon points="1080,-40 1210,320 1540,280 1260,510 1390,880 1040,650 720,860 870,490 580,290 930,310" fill="#e60012" fill-opacity="0.28" stroke="#ffffff" stroke-width="5"/>
            <polygon points="1080,60 1170,340 1440,310 1210,490 1310,780 1050,600 810,760 920,470 700,320 960,330" fill="none" stroke="#ffffff" stroke-width="3" stroke-dasharray="18 10"/>
          </svg>
        `;
        return;
      }
      if (stage && activeKey === 'edgerunners') {
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:radial-gradient(circle at 78% 26%, rgba(252,238,10,0.32) 0%, rgba(0,240,255,0.18) 38%, #07060f 75%);"></div>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;opacity:0.88;">
            <circle cx="1120" cy="240" r="170" fill="#fcee0a" fill-opacity="0.22" stroke="#fcee0a" stroke-width="2"/>
            <circle cx="1126" cy="240" r="170" fill="none" stroke="#ff003c" stroke-width="1.5" stroke-opacity="0.7"/>
            <circle cx="1114" cy="240" r="170" fill="none" stroke="#00f0ff" stroke-width="1.5" stroke-opacity="0.7"/>
          </svg>
        `;
        return;
      }
      if (stage && activeKey === 'chainsaw') {
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:radial-gradient(circle at 20% 25%, rgba(234,88,12,0.28), transparent 60%), radial-gradient(circle at 82% 70%, rgba(163,230,53,0.22), transparent 65%), #0a0907;"></div>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;opacity:0.75;">
            <path d="M0,420 L1440,260" stroke="#a3e635" stroke-width="4" stroke-dasharray="28 14"/>
            <path d="M0,432 L1440,272" stroke="#ea580c" stroke-width="2"/>
          </svg>
        `;
        return;
      }
      if (stage && activeKey === 'shaft') {
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:#09080a;"></div>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;opacity:0.85;">
            <circle cx="1140" cy="250" r="195" fill="#e11d48" fill-opacity="0.24"/>
            <line x1="120" y1="0" x2="120" y2="900" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
            <line x1="0" y1="720" x2="1440" y2="720" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
            <text x="150" y="700" fill="rgba(255,255,255,0.08)" font-family="serif" font-weight="900" font-size="140">【 物語 // 壱 】</text>
          </svg>
        `;
        return;
      }
      return _origRenderBackdrop(themeKey, morphKey);
    };

    renderThemeSelectors();

    // =========================================================================
    // ZERO-SERVER ПРЯМАЯ РАБОТА С GEMINI API И REDDIT ИЗ БРАУЗЕРА (ДЛЯ 4 ДРУЗЕЙ)
    // =========================================================================

    state.directGeminiKey = localStorage.getItem('kitsune_direct_gemini_key') || '';
    const directKeyInp = document.getElementById('directGeminiKeyInput');
    if (directKeyInp && state.directGeminiKey) {
      directKeyInp.value = state.directGeminiKey;
    }

    function saveDirectGeminiApiKey() {
      const inp = document.getElementById('directGeminiKeyInput');
      const val = (inp?.value || '').trim();
      state.directGeminiKey = val;
      if (val) {
        localStorage.setItem('kitsune_direct_gemini_key', val);
        showToast('Ключ Gemini сохранён в браузере! Теперь ИИ и парсер Reddit работают без сервера.');
      } else {
        localStorage.removeItem('kitsune_direct_gemini_key');
        showToast('Ключ Gemini удалён');
      }
      checkKitsuneBackendHealth();
    }

    const _origCheckHealth = checkKitsuneBackendHealth;
    checkKitsuneBackendHealth = async function() {
      const ok = await _origCheckHealth();
      if (!ok && state.directGeminiKey) {
        const dot = document.getElementById('aiBackendStatusDot');
        const txt = document.getElementById('aiBackendStatusText');
        const badge = document.getElementById('aiBackendStatusBadge');
        if (dot) dot.className = 'w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse';
        if (txt) txt.textContent = 'Direct Gemini 2.5 API: АКТИВЕН (Без сервера)';
        if (badge) badge.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-300';
        return true;
      }
      return ok;
    };
    setTimeout(checkKitsuneBackendHealth, 700);

    // Перехватываем runAiMoodPick: если Python-бэкенд не запущен, но есть прямой ключ Gemini в браузере — идем напрямую в Google GenAI REST API!
    const _origRunAiMoodPick = runAiMoodPick;
    runAiMoodPick = async function(preset) {
      const inp = document.getElementById('aiMoodInput');
      if (preset && inp) inp.value = preset;
      const rawQuery = (inp?.value || preset || '').trim();
      if (!rawQuery || !state.directGeminiKey || state.backendOnline) {
        return _origRunAiMoodPick(preset);
      }

      const resEl = document.getElementById('aiRecommendationsResult');
      const summaryEl = document.getElementById('aiCuratorSummary');
      if (!resEl) return;

      resEl.innerHTML = `
        <div class="col-span-full py-10 flex flex-col items-center justify-center gap-3 text-xs text-zinc-300">
          <div class="w-7 h-7 rounded-full border-2 border-brand-500 border-t-transparent animate-spin"></div>
          <span>Прямой запрос к Gemini 2.5 (Zero-Server): анализируем вайб, тропы и исключения для <b>«${rawQuery}»</b>...</span>
        </div>
      `;

      const catalogLines = state.catalog.slice(0, 50).map(a =>
        `- ID: ${a.id} | ${a.title} (${a.altTitle || ''}) | Жанры: ${(a.genres || []).join(', ')}`
      ).join('\n');

      const promptText = `Ты — аниме-куратор KITSUNE. Подбери 6 аниме под запрос: «${rawQuery}».
Учитывай сложные нарративные тропы, темп, саундтрек и СТРОГО исключай то, что пользователь просит убрать (например «без роботов», «не гаремник»).
Доступный каталог сайта:
${catalogLines}
Если в каталоге мало точных совпадений — добавь тайтлы из своей базы знаний (с anime_id: "external").
Верни строго JSON по схеме:
{"curator_analysis": "краткий разбор запроса", "recommendations": [{"anime_id": "str", "title": "русское название", "alt_title": "английское название", "match_score": 95, "vibe_tags": ["троп 1", "троп 2", "троп 3"], "explanation": "2 предложения без спойлеров"}]}`;

      try {
        const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(state.directGeminiKey)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.35 }
          })
        });
        if (!gRes.ok) throw new Error('API Error');
        const gJson = await gRes.json();
        const rawText = gJson.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        const data = JSON.parse(rawText);

        if (summaryEl && data.curator_analysis) {
          summaryEl.classList.remove('hidden');
          summaryEl.innerHTML = `<span class="font-bold text-white">Вердикт Gemini (Zero-Server):</span> ${data.curator_analysis}`;
        }

        resEl.innerHTML = (data.recommendations || []).map(rec => {
          const localAnime = [...state.catalog, ...DEEP_TROPE_KNOWLEDGE_BASE].find(
            a => a.id === rec.anime_id ||
                 a.title.toLowerCase() === (rec.title || '').toLowerCase() ||
                 (a.altTitle && rec.alt_title && a.altTitle.toLowerCase() === rec.alt_title.toLowerCase())
          );
          const poster = localAnime
            ? localAnime.poster
            : `https://placehold.co/320x450/131620/f43f5e?text=${encodeURIComponent((rec.alt_title || rec.title || 'ANIME').slice(0, 16))}`;
          const safeTitle = (rec.title || '').replace(/'/g, "\'");
          const clickAction = localAnime && localAnime.releaseId
            ? `openAnimePlayer(${JSON.stringify(localAnime).replace(/'/g, '&#39;')})`
            : `document.getElementById('searchInput').value='${safeTitle}'; handleSearchInput('${safeTitle}'); navigateTo('home');`;

          return `
            <div onclick="${clickAction}" class="bg-dark-800 border border-white/10 hover:border-brand-500 rounded-2xl overflow-hidden cursor-pointer transition flex flex-col group shadow-xl">
              <div class="relative h-52 overflow-hidden bg-dark-900">
                <img src="${poster}" onerror="this.src='https://placehold.co/320x450/131620/f43f5e?text=AI+PICK'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent"></div>
                <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg bg-brand-600 text-white text-[10px] font-black shadow">
                  ${rec.match_score || 94}% попадание в вайб
                </span>
                ${!localAnime ? `<span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-purple-600/90 text-white text-[10px] font-bold">Gemini Knowledge</span>` : ''}
                <div class="absolute bottom-2 left-2.5 right-2.5 flex flex-wrap gap-1">
                  ${(rec.vibe_tags || []).map(t => `<span class="px-1.5 py-0.5 rounded bg-black/85 border border-brand-500/40 text-[9px] font-bold text-brand-300">${t}</span>`).join('')}
                </div>
              </div>
              <div class="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div class="text-xs sm:text-sm font-bold text-white group-hover:text-brand-300">${rec.title}</div>
                  <div class="text-[10px] font-mono text-zinc-400">${rec.alt_title || ''}</div>
                </div>
                <p class="text-[11px] text-zinc-300 leading-relaxed">${rec.explanation || ''}</p>
              </div>
            </div>
          `;
        }).join('');
      } catch (err) {
        return _origRunAiMoodPick(preset);
      }
    };

    // Прямой парсинг Reddit + суммаризация через браузер, если сервер выключен, но введен прямой ключ Gemini
    const _origLoadRedditPulse = loadRedditEpisodePulse;
    loadRedditEpisodePulse = async function(forceRefresh = false) {
      if (state.backendOnline || !state.directGeminiKey) {
        return _origLoadRedditPulse(forceRefresh);
      }
      const box = document.getElementById('redditPulseContainer');
      if (!box || !state.currentAnime) return;

      const searchTitle = state.currentAnime.altTitle || state.currentAnime.title;
      const ruTitle = state.currentAnime.title;
      const ep = state.currentEpisode || 1;

      box.innerHTML = `
        <div class="flex items-center gap-2.5 text-orange-300 py-2">
          <div class="w-4 h-4 rounded-full border-2 border-orange-400 border-t-transparent animate-spin shrink-0"></div>
          <span>Прямой парсинг r/anime из браузера для <b>«${searchTitle} — Episode ${ep}»</b>...</span>
        </div>
      `;

      try {
        const q = encodeURIComponent(`subreddit:anime "${searchTitle}" Episode ${ep} discussion`);
        const sRes = await fetch(`https://www.reddit.com/r/anime/search.json?q=${q}&restrict_sr=on&sort=relevance&t=all&limit=5`);
        const sJson = await sRes.json();
        const post = sJson?.data?.children?.[0]?.data;
        if (!post) throw new Error(`Тред для «${searchTitle}» (Эп. ${ep}) на r/anime не найден`);

        const redditUrl = `https://www.reddit.com${post.permalink}`;
        const cRes = await fetch(`${redditUrl}.json?limit=35&sort=top`);
        const cJson = await cRes.json();
        const comments = (cJson?.[1]?.data?.children || [])
          .map(c => c?.data?.body)
          .filter(b => b && b.length > 25 && b !== '[deleted]' && b !== '[removed]')
          .slice(0, 28)
          .map(b => b.slice(0, 420))
          .join('\n---\n');

        const prompt = `Проанализируй комментарии с Reddit к аниме "${ruTitle}" (${searchTitle}, Серия ${ep}).
Тред: ${post.title}
КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНЫ СПОЙЛЕРЫ СЮЖЕТА (смерти, твисты, финал). Опиши только мнения об анимации, режиссуре, саундтреке, темпе и эмоциях на русском языке.
Верни строго JSON:
{"episode_verdict": "общий вердикт в 1-2 предложениях", "community_score": 92, "praised_for": ["плюс 1", "плюс 2", "плюс 3"], "criticized_for": ["минус или предмет споров 1", "минус 2"]}
Комментарии:
${comments}`;

        const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(state.directGeminiKey)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.2 }
          })
        });
        const gJson = await gRes.json();
        const data = JSON.parse(gJson.candidates?.[0]?.content?.parts?.[0]?.text || '{}');

        box.innerHTML = `
          <div class="space-y-3 pt-1">
            <div class="flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-400 border-b border-white/10 pb-2">
              <a href="${redditUrl}" target="_blank" rel="noopener noreferrer" class="truncate font-mono text-orange-300 hover:underline max-w-md">
                🔗 ${post.title}
              </a>
              <span class="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold">
                Рейтинг серии: ${data.community_score || 90}/100
              </span>
            </div>
            <p class="text-xs text-white font-medium italic bg-black/30 p-2.5 rounded-xl border border-white/5">
              «${data.episode_verdict || ''}»
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-1.5">
                <div class="text-[10px] font-black uppercase tracking-wider text-emerald-400">👍 За что хвалят серию:</div>
                <ul class="list-disc list-inside text-[11px] text-zinc-200 space-y-1">
                  ${(data.praised_for || []).map(p => `<li>${p}</li>`).join('')}
                </ul>
              </div>
              <div class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 space-y-1.5">
                <div class="text-[10px] font-black uppercase tracking-wider text-rose-400">👎 За что ругают / спорно:</div>
                <ul class="list-disc list-inside text-[11px] text-zinc-200 space-y-1">
                  ${(data.criticized_for || []).map(c => `<li>${c}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        `;
      } catch (err) {
        box.innerHTML = `<div class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">${err.message}</div>`;
      }
    };

    // =========================================================================
    // ОБЛАЧНАЯ СИНХРОНИЗАЦИЯ НА 4 ДРУЗЕЙ (SQUAD CLOUD SYNC)
    // =========================================================================

    state.squadRoomUrl = localStorage.getItem('kitsune_squad_room_url') || '';

    async function createNewSquadCloudRoom() {
      const statusLbl = document.getElementById('squadSyncStatusLabel');
      if (statusLbl) statusLbl.textContent = 'Создаём облачную комнату...';

      const initialPayload = buildMyCloudSnapshot([]);
      try {
        const res = await fetch('https://api.npoint.io/bins', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(initialPayload)
        });
        if (!res.ok) throw new Error('Cloud init failed');
        const data = await res.json();
        const roomUrl = data.id ? `https://api.npoint.io/${data.id}` : '';
        if (!roomUrl) throw new Error('Не получен ID комнаты');

        state.squadRoomUrl = roomUrl;
        localStorage.setItem('kitsune_squad_room_url', roomUrl);
        const inp = document.getElementById('squadRoomUrlInput');
        if (inp) inp.value = roomUrl;
        showToast('Облачная комната создана! Скопируй код и скинь своим 3 друзьям.');
        await syncSquadCloudNow(false);
      } catch (e) {
        showToast('Не удалось создать авто-комнату. Вставьте любой JSONBin/npoint URL вручную.');
      }
    }

    function connectToSquadRoom() {
      const inp = document.getElementById('squadRoomUrlInput');
      let val = (inp?.value || '').trim();
      if (!val) {
        showToast('Вставь код или URL комнаты, который тебе скинул друг!');
        return;
      }
      if (!val.startsWith('http')) {
        val = `https://api.npoint.io/${val}`;
      }
      state.squadRoomUrl = val;
      localStorage.setItem('kitsune_squad_room_url', val);
      if (inp) inp.value = val;
      syncSquadCloudNow(true);
    }

    function copySquadInviteCode() {
      const url = state.squadRoomUrl || document.getElementById('squadRoomUrlInput')?.value || '';
      if (!url) {
        showToast('Сначала нажми «Создать комнату пати»!');
        return;
      }
      navigator.clipboard?.writeText(url);
      showToast('Код комнаты скопирован! Отправь его друзьям в Telegram/Discord.');
    }

    function buildMyCloudSnapshot(existingMembers = [], existingFeed = []) {
      const u = state.user || { name: 'Игрок_' + Math.floor(Math.random() * 90 + 10), email: 'guest@kitsune.local' };
      const emailKey = (u.email || `${u.name}@kitsune.local`).toLowerCase();

      const meEntry = {
        name: u.name,
        email: emailKey,
        avatar: state.customAvatar || u.avatar || '',
        myList: state.myList || {},
        favorites: state.favorites || {},
        tierList: state.tierList || { S: [], A: [], B: [], C: [] },
        showcase: state.collectionShowcase || [],
        notes: state.collectionNotes || {},
        updatedAt: Date.now()
      };

      const membersMap = new Map();
      (existingMembers || []).forEach(m => {
        if (m && m.email) membersMap.set(m.email.toLowerCase(), m);
      });
      membersMap.set(emailKey, meEntry);

      return {
        updatedAt: Date.now(),
        members: Array.from(membersMap.values()),
        feed: (existingFeed || []).slice(0, 25)
      };
    }

    async function syncSquadCloudNow(notify = false, newFeedEvent = '') {
      const inp = document.getElementById('squadRoomUrlInput');
      if (inp && state.squadRoomUrl && !inp.value) inp.value = state.squadRoomUrl;
      if (!state.squadRoomUrl) return;

      const statusLbl = document.getElementById('squadSyncStatusLabel');
      try {
        const getRes = await fetch(state.squadRoomUrl, { cache: 'no-store' });
        let cloudData = { members: [], feed: [] };
        if (getRes.ok) {
          cloudData = await getRes.json();
        }

        const feed = Array.isArray(cloudData.feed) ? cloudData.feed : [];
        if (newFeedEvent && state.user) {
          feed.unshift({
            user: state.user.name,
            text: newFeedEvent,
            time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
          });
        }

        const updatedPayload = buildMyCloudSnapshot(cloudData.members || [], feed);

        (updatedPayload.members || []).forEach(friend => {
          if (!friend || !friend.email) return;
          const em = friend.email.toLowerCase();
          const isMe = state.user && state.user.email && state.user.email.toLowerCase() === em;
          state.accountsDb[em] = {
            name: friend.name,
            email: em,
            avatar: friend.avatar || '',
            createdAt: Date.now()
          };
          if (!isMe) {
            const prefix = `kitsune_acc_${em}`;
            localStorage.setItem(`${prefix}_mylist`, JSON.stringify(friend.myList || {}));
            localStorage.setItem(`${prefix}_favorites`, JSON.stringify(friend.favorites || {}));
            localStorage.setItem(`${prefix}_tierlist`, JSON.stringify(friend.tierList || { S: [], A: [], B: [], C: [] }));
            localStorage.setItem(`${prefix}_collection_showcase`, JSON.stringify(friend.showcase || []));
            localStorage.setItem(`${prefix}_collection_notes`, JSON.stringify(friend.notes || {}));
            if (friend.avatar) localStorage.setItem(`${prefix}_avatar`, friend.avatar);

            if (!isUserInFriends(friend.name)) {
              state.friendsList.push({ nickname: friend.name, email: em, addedAt: Date.now() });
            }
          }
        });

        localStorage.setItem('kitsune_accounts_db', JSON.stringify(state.accountsDb));
        saveUserScopedData();

        await fetch(state.squadRoomUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPayload)
        });

        renderSquadActivityFeed(updatedPayload.feed || []);
        if (state.activePage === 'profile') renderFriendsTab();
        if (statusLbl) statusLbl.textContent = `SQUAD ONLINE // Участников: ${(updatedPayload.members || []).length}`;
        if (notify) showToast(`Синхронизировано! В комнате друзей: ${(updatedPayload.members || []).length}`);
      } catch (e) {
        if (statusLbl) statusLbl.textContent = 'Ошибка связи с облаком комнаты';
      }
    }

    function renderSquadActivityFeed(feed = []) {
      const box = document.getElementById('squadActivityFeedBox');
      if (!box) return;
      if (!feed.length) {
        box.innerHTML = `<div class="text-[11px] text-zinc-400">Комната активна! Любое добавление аниме в тир-лист или коллекцию появится здесь.</div>`;
        return;
      }
      box.innerHTML = feed.slice(0, 12).map(item => `
        <div class="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-dark-900/90 border border-white/5">
          <div><span class="font-bold text-emerald-300">@${item.user}</span> <span class="text-zinc-200">${item.text}</span></div>
          <span class="text-[10px] font-mono text-zinc-500 shrink-0">${item.time || ''}</span>
        </div>
      `).join('');
    }

    const _origAssignToTier = assignToTier;
    assignToTier = function(rank, anime) {
      _origAssignToTier(rank, anime);
      syncSquadCloudNow(false, `поставил ранг [${rank}] тайтлу «${getAnimeDisplayTitle(anime)}»`);
    };

    const _origSetAnimeUserStatus = setAnimeUserStatus;
    setAnimeUserStatus = function(status) {
      const title = state.currentAnime ? getAnimeDisplayTitle(state.currentAnime) : '';
      _origSetAnimeUserStatus(status);
      if (status && title) {
        const label = status === 'completed' ? 'добавил в Коллекцию трофеев' : `добавил в список (${status})`;
        syncSquadCloudNow(false, `${label} «${title}»`);
      }
    };

    setTimeout(() => syncSquadCloudNow(false), 1200);
    setInterval(() => syncSquadCloudNow(false), 25000);


    // =========================================================================
    // УПРАВЛЕНИЕ АРХИТЕКТУРОЙ НАВИГАЦИИ, ФОРМОЙ КАРТОЧЕК И КНОПОК (V7)
    // =========================================================================

    function setSiteNavLayout(mode, notify = false) {
      state.siteSettings.navLayout = 'topbar';
      document.body.removeAttribute('data-nav-layout');
    }

    function setSiteCardLayout(mode, notify = true) {
      const m = ['posters', 'wide_banners', 'bento_grid', 'compact_wall'].includes(mode) ? mode : 'posters';
      state.siteSettings.cardLayout = m;
      persistSiteSettings();

      if (m === 'posters') {
        document.body.removeAttribute('data-card-layout');
      } else {
        document.body.setAttribute('data-card-layout', m);
      }

      document.querySelectorAll('.card-layout-btn').forEach(btn => {
        const active = btn.getAttribute('data-card-pill') === m;
        btn.classList.toggle('ring-2', active);
        btn.classList.toggle('ring-brand-500', active);
        btn.classList.toggle('bg-brand-500/20', active);
      });

      const names = {
        posters: 'Вертикальные постеры',
        wide_banners: 'Широкие горизонтальные баннеры',
        bento_grid: 'Асимметричный Bento-разворот',
        compact_wall: 'Плотная стена (6 в ряд)'
      };
      if (notify) showToast(`Раскладка карточек: ${names[m]}`);
    }

    function setSiteButtonStyle(style, notify = true) {
      const s = ['default', 'mecha_blade', 'brutal_offset', 'holo_pill'].includes(style) ? style : 'default';
      state.siteSettings.btnStyle = s;
      persistSiteSettings();

      if (s === 'default') {
        document.body.removeAttribute('data-btn-style');
      } else {
        document.body.setAttribute('data-btn-style', s);
      }

      document.querySelectorAll('.btn-style-pill').forEach(btn => {
        const active = btn.getAttribute('data-btn-pill') === s;
        btn.classList.toggle('ring-2', active);
        btn.classList.toggle('ring-brand-500', active);
        btn.classList.toggle('bg-brand-500/20', active);
      });

      const names = {
        default: 'Скруглённый Glass',
        mecha_blade: 'Скошенные лезвия 45°',
        brutal_offset: 'Жёсткий кибер-сдвиг 4px',
        holo_pill: 'Голографические капсулы'
      };
      if (notify) showToast(`Геометрия кнопок: ${names[s]}`);
    }

    // Синхронизируем активную подсветку кнопок в боковом сайдбаре при переходе по страницам
    const _origNavigateToV7 = navigateTo;
    navigateTo = function(pageName, pushHash = true) {
      _origNavigateToV7(pageName, pushHash);
      const isMyList = pageName === 'home' && state.feedTab === 'mylist';
      const activeKey = isMyList ? 'mylist' : pageName;
      document.querySelectorAll('.side-nav-btn').forEach(btn => {
        const active = btn.getAttribute('data-side-nav') === activeKey;
        btn.classList.toggle('bg-brand-600', active);
        btn.classList.toggle('text-white', active);
        btn.classList.toggle('font-bold', active);
        btn.classList.toggle('shadow-lg', active);
        btn.classList.toggle('text-zinc-300', !active);
      });
    };

    const _origSwitchFeedTabV7 = switchFeedTab;
    switchFeedTab = function(tab) {
      _origSwitchFeedTabV7(tab);
      const activeKey = tab === 'mylist' ? 'mylist' : 'home';
      document.querySelectorAll('.side-nav-btn').forEach(btn => {
        const active = btn.getAttribute('data-side-nav') === activeKey;
        btn.classList.toggle('bg-brand-600', active);
        btn.classList.toggle('text-white', active);
        btn.classList.toggle('font-bold', active);
      });
    };

    // Применяем сохранённую архитектуру при старте
    setSiteNavLayout(state.siteSettings.navLayout || 'topbar', false);
    setSiteCardLayout(state.siteSettings.cardLayout || 'posters', false);
    setSiteButtonStyle(state.siteSettings.btnStyle || 'default', false);


    // =========================================================================
    // РАСШИРЕНИЕ V8: 4 УЮТНЫХ ЖИВЫХ МИРА + ГЕНЕРАТОР ШУМА ДОЖДЯ И ТЁПЛОГО ВИНИЛА
    // =========================================================================

    Object.assign(DESIGN_THEMES, {
      ghibli_lanterns: {
        name: '🏮 Фонарики Ghibli',
        short: 'Ghibli',
        desc: 'Тёплые бумажные фонарики на деревянной веранде и духи света',
        watermark: '千と千尋 // 湯屋',
        badgeText: 'SPIRITED LANTERN SANCTUARY • COZY WARMTH',
        arch: 'soft',
        morph: 'ghibli_lanterns',
        dot: '#fbbf24',
        bg: '#120b07',
        surface: '#21130c',
        surface2: '#2e1b11',
        glow: 'rgba(251, 191, 36, 0.38)',
        secondary: 'rgba(244, 63, 94, 0.24)',
        cardRadius: '1.5rem',
        panelRadius: '2rem',
        btnRadius: '1rem',
        border: 'rgba(251, 191, 36, 0.45)',
        font: "'Playfair Display', Georgia, serif",
        pattern: 'radial-gradient(ellipse 85% 55% at 50% 0%, rgba(251, 191, 36, 0.26), transparent 72%)',
        patternSize: '100% 100%',
        b300: '#fde68a', b400: '#fbbf24', b500: '#f59e0b', b600: '#d97706'
      },
      shinkai_twilight: {
        name: '🌠 Сумерки Синкая',
        short: 'Синкай',
        desc: 'Волшебный час заката Катаварэ-доки и падающая комета Тиамат',
        watermark: '君の名は // 彗星',
        badgeText: 'KATAWARE-DOKI • TIAMAT COMET SKY',
        arch: 'crystal',
        morph: 'shinkai_twilight',
        dot: '#f472b6',
        bg: '#0b0c20',
        surface: '#161636',
        surface2: '#221e4a',
        glow: 'rgba(244, 114, 182, 0.36)',
        secondary: 'rgba(56, 189, 248, 0.32)',
        cardRadius: '1.45rem',
        panelRadius: '2.1rem',
        btnRadius: '9999px',
        border: 'rgba(244, 114, 182, 0.45)',
        font: "'Playfair Display', 'Outfit', serif",
        pattern: 'radial-gradient(ellipse 90% 55% at 50% -10%, rgba(56, 189, 248, 0.28), rgba(244, 114, 182, 0.20) 50%, transparent 78%)',
        patternSize: '100% 100%',
        b300: '#fbcfe8', b400: '#f472b6', b500: '#ec4899', b600: '#0284c7'
      },
      lofi_cafe: {
        name: '☕ Кофейня в Токио',
        short: 'Кофейня',
        desc: 'Ретро-лампа Эдисона, горячий кофе, кот на окне и вечерний дождь',
        watermark: '純喫茶 // 雨夜',
        badgeText: 'TOKYO RAINY CAFE • LO-FI SANCTUARY',
        arch: 'soft',
        morph: 'lofi_cafe',
        dot: '#f59e0b',
        bg: '#130e0b',
        surface: '#211813',
        surface2: '#2e211a',
        glow: 'rgba(245, 158, 11, 0.34)',
        secondary: 'rgba(234, 88, 12, 0.22)',
        cardRadius: '1.6rem',
        panelRadius: '2.2rem',
        btnRadius: '1rem',
        border: 'rgba(245, 158, 11, 0.40)',
        font: "'Outfit', sans-serif",
        pattern: 'radial-gradient(ellipse 85% 50% at 30% 10%, rgba(245, 158, 11, 0.24), transparent 70%)',
        patternSize: '100% 100%',
        b300: '#fed7aa', b400: '#fbbf24', b500: '#d97706', b600: '#b45309'
      },
      kyoto_fireflies: {
        name: '🌿 Сад со светлячками',
        short: 'Светлячки',
        desc: 'Лунная бамбуковая роща Киото и парящие золотые светлячки',
        watermark: '京都 // 蛍火',
        badgeText: 'KYOTO BAMBOO GARDEN • FIREFLY NIGHT',
        arch: 'zen',
        morph: 'kyoto_fireflies',
        dot: '#a3e635',
        bg: '#06110e',
        surface: '#0c211b',
        surface2: '#133028',
        glow: 'rgba(163, 230, 53, 0.32)',
        secondary: 'rgba(52, 211, 153, 0.24)',
        cardRadius: '1.5rem',
        panelRadius: '2rem',
        btnRadius: '0.9rem',
        border: 'rgba(163, 230, 53, 0.42)',
        font: "'Playfair Display', Georgia, serif",
        pattern: 'radial-gradient(ellipse 85% 50% at 75% 15%, rgba(163, 230, 53, 0.22), transparent 70%)',
        patternSize: '100% 100%',
        b300: '#d9f99d', b400: '#a3e635', b500: '#65a30d', b600: '#4d7c0f'
      }
    });

    if (typeof UI_MORPH_PRESETS !== 'undefined') {
      Object.assign(UI_MORPH_PRESETS, {
        ghibli_lanterns: { name: '🏮 Огни святилища Ghibli', themeKey: 'ghibli_lanterns', bgMode: 'twilight', watermark: '千と千尋 // 湯屋', pill: 'GHIBLI LANTERN SANCTUARY • WARM GLOW' },
        shinkai_twilight: { name: '🌠 Сумерки Макото Синкая', themeKey: 'shinkai_twilight', bgMode: 'nebula', watermark: '君の名は // 彗星', pill: 'YOUR NAME • KATAWARE-DOKI COMET' },
        lofi_cafe: { name: '☕ Ночная кофейня в Токио', themeKey: 'lofi_cafe', bgMode: 'rain', watermark: '純喫茶 // 雨夜', pill: 'TOKYO RAINY ATTIC • LO-FI CAFE' },
        kyoto_fireflies: { name: '🌿 Чайный сад со светлячками', themeKey: 'kyoto_fireflies', bgMode: 'aurora', watermark: '京都 // 蛍火', pill: 'BAMBOO MOON GARDEN • FIREFLIES' }
      });
    }

    // Детализированные уютные живописные SVG-сцены для заднего плана
    const _prevRenderBackdropV8 = renderAnimeUniverseBackdropAndEmblem;
    renderAnimeUniverseBackdropAndEmblem = function(themeKey, morphKey) {
      const stage = document.getElementById('animeUniverseBgLayer');
      const activeKey = (morphKey && morphKey !== 'spatial') ? morphKey : themeKey;

      if (stage && activeKey === 'ghibli_lanterns') {
        stage.style.filter = 'blur(1px) saturate(1.12)';
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:
            radial-gradient(ellipse 90% 55% at 50% 10%, rgba(251,146,60,0.35) 0%, rgba(180,83,9,0.22) 48%, transparent 75%),
            radial-gradient(ellipse 80% 45% at 50% 95%, rgba(245,158,11,0.28) 0%, transparent 70%),
            linear-gradient(180deg, #0d0704 0%, #1c0f08 48%, #26140b 78%, #120905 100%);"></div>

          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;opacity:0.92;">
            <defs>
              <radialGradient id="ghibliLanternGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#fef08a" stop-opacity="0.95"/>
                <stop offset="35%" stop-color="#fb923c" stop-opacity="0.75"/>
                <stop offset="70%" stop-color="#ea580c" stop-opacity="0.28"/>
                <stop offset="100%" stop-color="#ea580c" stop-opacity="0"/>
              </radialGradient>
              <linearGradient id="lanternBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#ef4444"/>
                <stop offset="50%" stop-color="#fb923c"/>
                <stop offset="100%" stop-color="#fef08a"/>
              </linearGradient>
              <!-- Японский тёплый бумажный фонарик Тётин -->
              <g id="cozyLanternUnit">
                <line x1="0" y1="0" x2="0" y2="38" stroke="#78350f" stroke-width="2.5"/>
                <circle cx="0" cy="64" r="68" fill="url(#ghibliLanternGlow)"/>
                <rect x="-14" y="34" width="28" height="6" rx="2" fill="#451a03"/>
                <ellipse cx="0" cy="64" rx="24" ry="30" fill="url(#lanternBodyGrad)" stroke="#7c2d12" stroke-width="1.5"/>
                <path d="M-22,52 Q0,57 22,52 M-24,64 Q0,69 24,64 M-22,76 Q0,81 22,76" fill="none" stroke="#9a3412" stroke-width="1.2" opacity="0.65"/>
                <rect x="-12" y="91" width="24" height="5" rx="2" fill="#451a03"/>
                <line x1="0" y1="96" x2="0" y2="114" stroke="#f59e0b" stroke-width="2"/>
              </g>
            </defs>

            <!-- Тёплая деревянная балка крыши святилища сверху -->
            <path d="M-40,40 Q720,115 1480,35" fill="none" stroke="#451a03" stroke-width="14"/>
            <path d="M-40,44 Q720,119 1480,39" fill="none" stroke="#92400e" stroke-width="3" opacity="0.7"/>

            <!-- Гирлянда качающихся на вечернем ветру бумажных фонариков -->
            <g transform="translate(150, 48)"><g style="animation:lanternSway 5.5s ease-in-out infinite;"><use href="#cozyLanternUnit"/></g></g>
            <g transform="translate(370, 68) scale(0.88)"><g style="animation:lanternSway 6.2s ease-in-out infinite reverse;"><use href="#cozyLanternUnit"/></g></g>
            <g transform="translate(610, 76) scale(0.95)"><g style="animation:lanternSway 5.8s ease-in-out infinite;"><use href="#cozyLanternUnit"/></g></g>
            <g transform="translate(860, 74) scale(0.9)"><g style="animation:lanternSway 6.6s ease-in-out infinite reverse;"><use href="#cozyLanternUnit"/></g></g>
            <g transform="translate(1100, 62) scale(1.02)"><g style="animation:lanternSway 5.2s ease-in-out infinite;"><use href="#cozyLanternUnit"/></g></g>
            <g transform="translate(1310, 44) scale(0.85)"><g style="animation:lanternSway 6.0s ease-in-out infinite reverse;"><use href="#cozyLanternUnit"/></g></g>

            <!-- Силуэт традиционного красного мостика и отражения фонарей в ночной воде внизу -->
            <path d="M920,760 Q1160,685 1420,760" fill="none" stroke="#991b1b" stroke-width="12"/>
            <path d="M920,735 Q1160,660 1420,735" fill="none" stroke="#dc2626" stroke-width="5"/>
            <ellipse cx="320" cy="830" rx="180" ry="18" fill="#fb923c" fill-opacity="0.16" style="filter:blur(10px);"/>
            <ellipse cx="760" cy="845" rx="220" ry="22" fill="#fef08a" fill-opacity="0.14" style="filter:blur(12px);"/>
            <ellipse cx="1160" cy="825" rx="190" ry="20" fill="#f97316" fill-opacity="0.18" style="filter:blur(10px);"/>
          </svg>
        `;
        return;
      }

      if (stage && activeKey === 'shinkai_twilight') {
        stage.style.filter = 'blur(1px) saturate(1.15)';
        stage.innerHTML = `
          <!-- Небо Макото Синкая: переход от глубокого звёздного индиго к нежно-розовому и золотому горизонту -->
          <div style="position:absolute;inset:0;background:
            radial-gradient(ellipse 95% 50% at 50% 95%, rgba(251,146,60,0.42) 0%, rgba(244,114,182,0.38) 42%, rgba(56,189,248,0.22) 72%, transparent 100%),
            linear-gradient(180deg, #060818 0%, #101738 36%, #2b1d4c 64%, #69295c 84%, #b5485d 100%);"></div>

          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;opacity:0.94;">
            <defs>
              <linearGradient id="cometTailBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.98"/>
                <stop offset="25%" stop-color="#7dd3fc" stop-opacity="0.85"/>
                <stop offset="65%" stop-color="#f472b6" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="#c084fc" stop-opacity="0"/>
              </linearGradient>
              <radialGradient id="cometCoreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
                <stop offset="35%" stop-color="#bae6fd" stop-opacity="0.85"/>
                <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
              </radialGradient>
              <linearGradient id="shinkaiCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#fbcfe8" stop-opacity="0.55"/>
                <stop offset="50%" stop-color="#f472b6" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="#311042" stop-opacity="0.75"/>
              </linearGradient>
            </defs>

            <!-- Рассеянные мерцающие звёзды в верхнем зените -->
            <circle cx="180" cy="95" r="1.8" fill="#ffffff" opacity="0.8"/>
            <circle cx="420" cy="65" r="2.2" fill="#bae6fd" opacity="0.9"/>
            <circle cx="690" cy="110" r="1.5" fill="#ffffff" opacity="0.7"/>
            <circle cx="1040" cy="75" r="2.4" fill="#fbcfe8" opacity="0.85"/>
            <circle cx="1290" cy="130" r="1.8" fill="#ffffff" opacity="0.75"/>

            <!-- Двухвостая комета Тиамат («Твоё имя»), рассекающая сумеречное небо -->
            <path d="M 410,330 Q 760,155 1320,-30" fill="none" stroke="url(#cometTailBlue)" stroke-width="18" stroke-linecap="round" style="filter:blur(4px);"/>
            <path d="M 410,330 Q 780,195 1340,35" fill="none" stroke="#f472b6" stroke-width="8" stroke-opacity="0.55" stroke-linecap="round" style="filter:blur(5px);"/>
            <path d="M 410,330 Q 760,155 1280,-20" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="410" cy="330" r="56" fill="url(#cometCoreGlow)"/>
            <circle cx="410" cy="330" r="6" fill="#ffffff"/>

            <!-- Анимация падающей звезды -->
            <line x1="1150" y1="120" x2="1240" y2="65" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" style="animation:shootingStarSlide 9s ease-in-out infinite;"/>

            <!-- Пышные подсвеченные закатом кучевые облака Синкая у горизонта -->
            <path d="M-80,740 Q80,620 240,680 Q380,550 560,655 Q740,560 910,665 Q1120,530 1310,645 Q1410,590 1520,670 L1520,920 L-80,920 Z" fill="url(#shinkaiCloudGrad)"/>
            <!-- Тёмный силуэт холма и кратерного озера Итомори внизу -->
            <path d="M0,835 Q320,765 640,825 Q1020,750 1440,815 L1440,910 L0,910 Z" fill="#090714"/>
          </svg>
        `;
        return;
      }

      if (stage && activeKey === 'lofi_cafe') {
        stage.style.filter = 'blur(1px) saturate(1.1)';
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:
            radial-gradient(circle at 24% 22%, rgba(251,191,36,0.34) 0%, rgba(217,119,6,0.16) 42%, transparent 70%),
            radial-gradient(circle at 78% 72%, rgba(234,88,12,0.22) 0%, transparent 65%),
            linear-gradient(180deg, #0e0a08 0%, #1c130e 55%, #120c09 100%);"></div>

          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;opacity:0.9;">
            <defs>
              <radialGradient id="edisonLampGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#fef3c7" stop-opacity="0.95"/>
                <stop offset="35%" stop-color="#f59e0b" stop-opacity="0.55"/>
                <stop offset="100%" stop-color="#b45309" stop-opacity="0"/>
              </radialGradient>
            </defs>

            <!-- Большое деревянное окно ночной мансарды Токио справа -->
            <g transform="translate(860, 90)" opacity="0.65">
              <rect x="0" y="0" width="460" height="580" rx="8" fill="#0b1320" stroke="#3f2718" stroke-width="14"/>
              <line x1="230" y1="0" x2="230" y2="580" stroke="#3f2718" stroke-width="10"/>
              <line x1="0" y1="290" x2="460" y2="290" stroke="#3f2718" stroke-width="10"/>
              <!-- Размытые огни ночного Токио за мокрым стеклом -->
              <circle cx="95" cy="390" r="28" fill="#fb7185" fill-opacity="0.32" style="filter:blur(8px);"/>
              <circle cx="165" cy="430" r="22" fill="#fbbf24" fill-opacity="0.38" style="filter:blur(6px);"/>
              <circle cx="330" cy="370" r="34" fill="#38bdf8" fill-opacity="0.26" style="filter:blur(9px);"/>
              <circle cx="380" cy="440" r="26" fill="#f97316" fill-opacity="0.35" style="filter:blur(7px);"/>

              <!-- Силуэт спящего кота на деревянном подоконнике -->
              <ellipse cx="135" cy="562" rx="48" ry="22" fill="#18110d"/>
              <circle cx="98" cy="552" r="16" fill="#18110d"/>
              <polygon points="86,540 92,526 101,538" fill="#18110d"/>
              <polygon points="101,538 110,526 114,541" fill="#18110d"/>

              <!-- Чашка горячего кофе с поднимающимся паром -->
              <rect x="310" y="536" width="38" height="34" rx="6" fill="#d97706"/>
              <path d="M348,544 C360,544 360,562 348,562" fill="none" stroke="#d97706" stroke-width="4"/>
              <path d="M322,528 Q316,508 326,492" fill="none" stroke="#fde68a" stroke-width="2.5" stroke-linecap="round" style="animation:steamRiseCozy 4s ease-in-out infinite;"/>
              <path d="M335,530 Q342,510 332,490" fill="none" stroke="#fde68a" stroke-width="2" stroke-linecap="round" style="animation:steamRiseCozy 4.8s ease-in-out infinite 1.2s;"/>
            </g>

            <!-- Подвесная ретро-лампа Эдисона слева с тёплым янтарным ореолом -->
            <line x1="280" y1="0" x2="280" y2="145" stroke="#451a03" stroke-width="4"/>
            <polygon points="240,145 320,145 350,175 210,175" fill="#291509" stroke="#78350f" stroke-width="2"/>
            <circle cx="280" cy="210" r="185" fill="url(#edisonLampGlow)" style="animation:floatSlowPulse 6s ease-in-out infinite;"/>
            <ellipse cx="280" cy="190" rx="16" ry="22" fill="#fef08a"/>
          </svg>
        `;
        return;
      }

      if (stage && activeKey === 'kyoto_fireflies') {
        stage.style.filter = 'blur(1px) saturate(1.12)';
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:
            radial-gradient(circle at 80% 18%, rgba(254,249,195,0.28) 0%, rgba(52,211,153,0.16) 38%, transparent 68%),
            radial-gradient(ellipse 85% 50% at 50% 95%, rgba(132,204,22,0.22) 0%, transparent 72%),
            linear-gradient(180deg, #040c09 0%, #081c16 55%, #05110d 100%);"></div>

          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;opacity:0.9;">
            <!-- Полная тёплая луна над бамбуковой рощей Киото -->
            <circle cx="1140" cy="185" r="88" fill="#fef9c3" fill-opacity="0.88"/>
            <circle cx="1140" cy="185" r="145" fill="#fde047" fill-opacity="0.16" style="filter:blur(18px);"/>

            <!-- Стройные стволы бамбука слева и справа -->
            <g stroke="#134e4a" stroke-width="10" opacity="0.65">
              <line x1="90" y1="0" x2="110" y2="900"/>
              <line x1="155" y1="0" x2="140" y2="900"/>
              <line x1="220" y1="0" x2="235" y2="900"/>
              <line x1="1310" y1="0" x2="1290" y2="900"/>
              <line x1="1375" y1="0" x2="1390" y2="900"/>
            </g>

            <!-- Живые парящие золотисто-лаймовые светлячки -->
            <circle cx="280" cy="620" r="6" fill="#fde047" style="filter:blur(1px);animation:fireflyFloat 6s ease-in-out infinite;"/>
            <circle cx="460" cy="510" r="5" fill="#bef264" style="filter:blur(1px);animation:fireflyFloat 7.5s ease-in-out infinite 1s;"/>
            <circle cx="670" cy="690" r="7" fill="#fde047" style="filter:blur(1px);animation:fireflyFloat 5.8s ease-in-out infinite 0.5s;"/>
            <circle cx="890" cy="540" r="5.5" fill="#bef264" style="filter:blur(1px);animation:fireflyFloat 8s ease-in-out infinite 2s;"/>
            <circle cx="1060" cy="640" r="6.5" fill="#fde047" style="filter:blur(1px);animation:fireflyFloat 6.4s ease-in-out infinite 1.5s;"/>
            <circle cx="540" cy="340" r="4.5" fill="#fde047" style="filter:blur(1px);animation:fireflyFloat 7s ease-in-out infinite 2.4s;"/>
            <circle cx="980" cy="390" r="5" fill="#bef264" style="filter:blur(1px);animation:fireflyFloat 6.8s ease-in-out infinite 0.8s;"/>
          </svg>
        `;
        return;
      }

      return _prevRenderBackdropV8(themeKey, morphKey);
    };

    renderThemeSelectors();

    // =========================================================================
    // ВСТРОЕННЫЙ ГЕНЕРАТОР ЖИВОГО УЮТНОГО ЗВУКА (ДОЖДЬ ЗА ОКНОМ / ТЁПЛЫЙ КАМИН)
    // =========================================================================

    state.cozyAmbienceMode = '';
    state.cozyAudioCtx = null;
    state.cozyNoiseNode = null;

    function toggleCozyAmbience(type) {
      const rainBtn = document.getElementById('cozySoundRainBtn');
      const vinylBtn = document.getElementById('cozySoundVinylBtn');

      if (state.cozyAmbienceMode === type) {
        state.cozyAmbienceMode = '';
        if (state.cozyAudioCtx) {
          state.cozyAudioCtx.close().catch(() => {});
          state.cozyAudioCtx = null;
        }
        if (rainBtn) rainBtn.classList.remove('bg-amber-500', 'text-black');
        if (vinylBtn) vinylBtn.classList.remove('bg-amber-500', 'text-black');
        showToast('Фоновый звук уюта выключен');
        return;
      }

      if (state.cozyAudioCtx) {
        state.cozyAudioCtx.close().catch(() => {});
      }

      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        state.cozyAudioCtx = ctx;
        state.cozyAmbienceMode = type;

        const bufferSize = ctx.sampleRate * 3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = buffer.getChannelData(0);
        let lastOut = 0.0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          output[i] *= (type === 'rain' ? 0.14 : 0.09);
          if (type === 'vinyl' && Math.random() < 0.0012) {
            output[i] += (Math.random() * 0.28);
          }
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = buffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = type === 'rain' ? 950 : 520;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.45;

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        whiteNoise.start(0);

        if (rainBtn) {
          rainBtn.classList.toggle('bg-amber-500', type === 'rain');
          rainBtn.classList.toggle('text-black', type === 'rain');
        }
        if (vinylBtn) {
          vinylBtn.classList.toggle('bg-amber-500', type === 'vinyl');
          vinylBtn.classList.toggle('text-black', type === 'vinyl');
        }

        showToast(type === 'rain' ? '🌧️ Включён мягкий шум ночного дождя за окном' : '📻 Включён уютный треск винила и камина');
      } catch (e) {
        showToast('Браузер заблокировал автозвук — кликните ещё раз');
      }
    }


    // =========================================================================
    // V12 ARCHITECTURAL UPGRADES:
    // 1. 3-Tab Settings Studio Navigation
    // 2. Portable JSON Backup Export/Import + Session-Safe Gemini API Key
    // 3. Smart GPU Shield (Auto-pause animations when video player is open or tab hidden)
    // =========================================================================

    function switchSettingsStudioTab(tabKey) {
      const tabs = ['worlds', 'layout', 'atmosphere'];
      tabs.forEach(k => {
        const content = document.getElementById(`settingsTabContent-${k}`);
        const btn = document.getElementById(`settingsTabBtn-${k}`);
        const active = k === tabKey;
        if (content) content.classList.toggle('hidden', !active);
        if (btn) {
          btn.className = active
            ? 'flex-1 min-w-[160px] py-2.5 px-4 rounded-xl bg-brand-600 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 shadow-lg'
            : 'flex-1 min-w-[160px] py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-2';
        }
      });
    }

    // FIX #4: Pause heavy background SVG/particle animations while watching video or when browser tab is hidden
    const _origOpenPlayerV12 = openAnimePlayer;
    openAnimePlayer = function(anime, startEp = null, resumeSec = 0) {
      document.body.classList.add('player-open');
      return _origOpenPlayerV12(anime, startEp, resumeSec);
    };

    const _origClosePlayerV12 = closePlayerModal;
    closePlayerModal = function() {
      document.body.classList.remove('player-open');
      return _origClosePlayerV12();
    };

    document.addEventListener('visibilitychange', () => {
      document.body.classList.toggle('tab-hidden', document.hidden);
    });

    // FIX #2A: Session-safe Gemini API key storage
    state.directGeminiKey = sessionStorage.getItem('kitsune_session_gemini_key') || localStorage.getItem('kitsune_direct_gemini_key') || '';
    saveDirectGeminiApiKey = function() {
      const inp = document.getElementById('directGeminiKeyInput');
      const sessionOnly = document.getElementById('geminiSessionOnlyChk')?.checked !== false;
      const val = (inp?.value || '').trim();
      state.directGeminiKey = val;

      if (val) {
        if (sessionOnly) {
          sessionStorage.setItem('kitsune_session_gemini_key', val);
          localStorage.removeItem('kitsune_direct_gemini_key');
          showToast('🔒 Ключ Gemini сохранён только для текущей сессии (безопасный режим)');
        } else {
          localStorage.setItem('kitsune_direct_gemini_key', val);
          sessionStorage.setItem('kitsune_session_gemini_key', val);
          showToast('Ключ Gemini сохранён в браузере');
        }
      } else {
        sessionStorage.removeItem('kitsune_session_gemini_key');
        localStorage.removeItem('kitsune_direct_gemini_key');
        showToast('Ключ Gemini удалён');
      }
      checkKitsuneBackendHealth();
    };

    // FIX #2B: Full JSON Backup Export & Import
    function exportFullKitsuneBackupJson() {
      const payload = {
        version: 'KITSUNE_V12',
        exportedAt: new Date().toISOString(),
        user: state.user,
        accountsDb: state.accountsDb,
        siteSettings: state.siteSettings,
        myList: state.myList,
        favorites: state.favorites,
        watchHistory: state.watchHistory,
        tierList: state.tierList,
        collectionNotes: state.collectionNotes,
        collectionShowcase: state.collectionShowcase,
        friendsList: state.friendsList,
        customAvatar: state.customAvatar || ''
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeName = (state.user?.name || 'guest').toLowerCase().replace(/[^a-z0-9а-яё_-]/gi, '_');
      a.href = url;
      a.download = `kitsune_backup_${safeName}_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('📦 Полный бэкап профиля (.JSON) скачан!');
    }

    function importFullKitsuneBackupJson(event) {
      const file = event.target?.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (!data || typeof data !== 'object') throw new Error('Invalid JSON');

          if (data.user) {
            state.user = data.user;
            localStorage.setItem('kitsune_user', JSON.stringify(data.user));
          }
          if (data.accountsDb) {
            state.accountsDb = Object.assign(state.accountsDb || {}, data.accountsDb);
            localStorage.setItem('kitsune_accounts_db', JSON.stringify(state.accountsDb));
          }
          if (data.siteSettings) {
            state.siteSettings = Object.assign(state.siteSettings, data.siteSettings);
            persistSiteSettings();
          }
          if (data.myList) state.myList = data.myList;
          if (data.favorites) state.favorites = data.favorites;
          if (data.watchHistory) state.watchHistory = data.watchHistory;
          if (data.tierList) state.tierList = data.tierList;
          if (data.collectionNotes) state.collectionNotes = data.collectionNotes;
          if (data.collectionShowcase) state.collectionShowcase = data.collectionShowcase;
          if (data.friendsList) state.friendsList = data.friendsList;
          if (typeof data.customAvatar === 'string') state.customAvatar = data.customAvatar;

          saveUserScopedData();
          applySeasonTheme(state.siteSettings.seasonTheme || 'default', false);
          if (state.siteSettings.uiMorph) applyUiMorphMode(state.siteSettings.uiMorph, false);
          setSiteNavLayout(state.siteSettings.navLayout || 'topbar', false);
          setSiteCardLayout(state.siteSettings.cardLayout || 'posters', false);
          setSiteButtonStyle(state.siteSettings.btnStyle || 'default', false);
          syncProfileUI();
          syncMyListBadge();
          syncFavoritesCountBadge();
          renderCatalogGrid();
          renderContinueWatching();
          showToast('✅ Бэкап успешно импортирован! Все списки, трофеи и настройки восстановлены.');
        } catch (err) {
          showToast('Ошибка чтения файла бэкапа: проверьте формат .JSON');
        }
      };
      reader.readAsText(file);
      event.target.value = '';
    }