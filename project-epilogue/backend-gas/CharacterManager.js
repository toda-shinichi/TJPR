/**
 * Project Epilogue - 三層角色管理與快取服務
 * 檔案：CharacterManager.js
 * 
 * 核心職責：
 * 1. CacheService 高速快取管理（TTL 6 小時，避免頻繁向 Drive 發起請求）
 * 2. 三層角色動態注入機制 (Tiered Character Injection)：
 *    - Tier 1: 核心攻略主角（全量 Markdown 人設 + 專屬身分防火牆）
 *    - Tier 2: 當前在場配角（根據文本與玩家輸入動態偵測，上限 1~2 位）
 *    - Tier 3: 世界背景名冊（其餘 11+ 位男主以一句話特徵庫常駐）
 * 3. 快取清理與維護工具函式
 */

var CharacterManager = (function() {
  var CACHE_TTL_SECONDS = 21600; // 6 小時快取 (21,600 秒)

  // 13 位男主官方標準名冊索引與別名庫
  var OFFICIAL_ROSTER = [
    {
      id: "01_徐令謙",
      name: "徐令謙",
      file: "01_徐令謙.md",
      aliases: ["徐令謙", "二爺", "徐二少", "令謙", "天裕會"],
      role: "黑道玄辰幫二把手 · 天裕會中樞 · 幕後制策者",
      oneLiner: "深沉狠戾的黑道制策者，金絲眼鏡後的眼神如刃，擅長以退為進的極致掌控與高位支配。"
    },
    {
      id: "02_韓正寰",
      name: "韓正寰",
      file: "02_韓正寰.md",
      aliases: ["韓正寰", "韓檢", "韓主任", "正寰", "士林地檢署", "白日判官"],
      role: "士林地檢署主任檢察官 · 白日判官",
      oneLiner: "冷峻禁慾的司法利刃，手握法理與罪證，在正義守護與私慾佔有邊界極限拉扯。"
    },
    {
      id: "03_邵翊衡",
      name: "邵翊衡",
      file: "03_邵翊衡.md",
      aliases: ["邵翊衡", "邵秘書", "翊衡", "總統府機要秘書"],
      role: "總統府機要秘書 · 權力樞紐之影",
      oneLiner: "溫潤優雅的政壇操盤手，談笑間封鎖所有退路，帶著溫和面具的無聲支配者。"
    },
    {
      id: "04_楊紹宸",
      name: "楊紹宸",
      file: "04_楊紹宸.md",
      aliases: ["楊紹宸", "楊董", "紹宸", "弘楊集團少東"],
      role: "弘楊集團少東 · 執行董事 · 物流總經理",
      oneLiner: "桀驁不馴的財閥繼承人，掌控跨國物流與碼頭貿易，佔有慾極強且作風凌厲。"
    },
    {
      id: "05_徐宇寧",
      name: "徐宇寧",
      file: "05_徐宇寧.md",
      aliases: ["徐宇寧", "宇寧", "明隱牙醫", "徐醫師"],
      role: "明隱牙醫診所院長 · 牙醫師 · 徐家長房長孫",
      oneLiner: "白袍下的精緻支配者，溫文爾雅、細膩體貼，帶著令人窒息的專注與掌控。"
    },
    {
      id: "06_林政修",
      name: "林政修",
      file: "06_林政修.md",
      aliases: ["林政修", "林次", "政修", "法務部次長"],
      role: "法務部政務次長 · 頂層權力掌舵者",
      oneLiner: "沉穩威嚴的政壇上位者，舉手投足皆是國家機器級別的絕對權力壓迫。"
    },
    {
      id: "07_沈湛然",
      name: "沈湛然",
      file: "07_沈湛然.md",
      aliases: ["沈湛然", "沈醫師", "湛然", "台大精神科"],
      role: "台大醫院精神醫學部主治名醫 · 心理側寫專家",
      oneLiner: "洞悉人性的深淵凝視者，能輕易看穿防禦與隱密慾望，擅長潛意識引導與心理推拉。"
    },
    {
      id: "08_江瀚文",
      name: "江瀚文",
      file: "08_江瀚文.md",
      aliases: ["江瀚文", "江執行長", "瀚文", "鼎曜傳媒"],
      role: "鼎曜媒體集團執行長 · 傳媒巨擘",
      oneLiner: "商界菁英傳媒大亨，擅長資本收購、輿論操控與鏡頭下的致命曖昧。"
    },
    {
      id: "09_吳衛廷",
      name: "吳衛廷",
      file: "09_吳衛廷.md",
      aliases: ["吳衛廷", "吳委員", "衛廷", "在野黨立委"],
      role: "立法院司法及法制委員會立法委員 · 舊城區實力派",
      oneLiner: "深諳基層利益與國會黑幕的實權立委，作風霸道深沉、江湖草莽氣質與政治手腕並存。"
    },
    {
      id: "10_徐承勳",
      name: "徐承勳",
      file: "10_徐承勳.md",
      aliases: ["徐承勳", "副總統", "承勳", "徐副"],
      role: "中華民國副總統 · 國家備位元首",
      oneLiner: "成熟禁慾的政壇巔峰男性，身處權力牢籠，深邃孤獨且極具上位者威儀。"
    },
    {
      id: "11_徐耀南",
      name: "徐耀南",
      file: "11_徐耀南.md",
      aliases: ["徐耀南", "徐董", "耀南", "榮南營造"],
      role: "榮南營造集團創辦人兼董事長 · 中部營造巨擘",
      oneLiner: "白手起家的商界梟雄，冷峻威嚴、體魄硬朗，帶有濃烈宗族家長權威。"
    },
    {
      id: "12_徐若宸",
      name: "徐若宸",
      file: "12_徐若宸.md",
      aliases: ["徐若宸", "若宸", "徐大少"],
      role: "榮南營造家族長子 · UBC商學院/企管所",
      oneLiner: "肩負家族重任的知性清雅貴公子，清瘦內斂，內心壓抑著深沉的情感叛逆。"
    },
    {
      id: "13_徐予澈",
      name: "徐予澈",
      file: "13_徐予澈.md",
      aliases: ["徐予澈", "徐泰希", "泰希", "予澈", "HapSTer"],
      role: "亞洲頂級男團 HapSTer 門面主唱兼領舞（藝名徐泰希）",
      oneLiner: "台上極限魅惑、私下清冷溫潤的頂流偶像，在聚光燈與私密情感間掙扎。"
    }
  ];

  /**
   * 取得全域 Roster 名冊索引（優先讀取 CacheService）
   */
  function getRosterIndex() {
    var cache = CacheService.getScriptCache();
    var cached = cache.get('roster_index_json');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.warn('Roster cache parse error:', e);
      }
    }

    // 若無快取，嘗試從 Drive 讀取或使用內建名冊
    var roster = OFFICIAL_ROSTER;
    try {
      if (typeof StorageService !== 'undefined' && StorageService.loadCharacterMarkdown) {
        // 可從 Drive 讀取自定義 Roster_Index.json
      }
    } catch (err) {
      console.warn('Drive roster read fallback to built-in:', err);
    }

    try {
      cache.put('roster_index_json', JSON.stringify(roster), CACHE_TTL_SECONDS);
    } catch (e) {
      console.warn('Cache put error:', e);
    }
    return roster;
  }

  /**
   * 讀取單一角色 Markdown（含 CacheService 快取機制）
   */
  function getCharacterMarkdown(characterFileName) {
    if (!characterFileName) return '';
    var cache = CacheService.getScriptCache();
    var cacheKey = 'char_md_' + characterFileName.replace(/[^a-zA-Z0-9_]/g, '_');
    var cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    var content = '';
    try {
      if (typeof StorageService !== 'undefined' && StorageService.loadCharacterMarkdown) {
        content = StorageService.loadCharacterMarkdown(characterFileName);
      }
    } catch (e) {
      console.warn('StorageService.loadCharacterMarkdown error for ' + characterFileName + ':', e);
    }

    // 若無內容，組裝預設官方骨架
    if (!content) {
      var matched = OFFICIAL_ROSTER.filter(function(c) {
        return c.file === characterFileName || c.id === characterFileName || characterFileName.indexOf(c.name) !== -1;
      })[0];
      if (matched) {
        content = '# ' + matched.name + '\n- 專屬身分：' + matched.role + '\n- 核心特徵：' + matched.oneLiner;
      }
    }

    if (content) {
      try {
        cache.put(cacheKey, content, CACHE_TTL_SECONDS);
      } catch (e) {
        console.warn('Cache put error for char:', e);
      }
    }

    return content;
  }

  /**
   * 動態偵測當前場景中出現的在場配角 (Tier 2)
   * 掃描上一章結尾文本與玩家最新自訂輸入中的角色別名
   * @param {string} lastChapterText - 上一章節小說正文
   * @param {string} playerChoice - 玩家最新抉擇或自訂對白
   * @param {string} primaryLeadKey - 核心攻略男主（Tier 1 主角，自動排除）
   * @returns {Array<Object>} 在場配角物件陣列 (最多 2 位)
   */
  function detectActiveNPCs(lastChapterText, playerChoice, primaryLeadKey) {
    var roster = getRosterIndex();
    var scanTarget = (playerChoice || '') + ' ' + ((lastChapterText || '').slice(-600));
    var activeNPCs = [];

    for (var i = 0; i < roster.length; i++) {
      var charObj = roster[i];
      // 排除 Tier 1 主角本身
      if (charObj.id === primaryLeadKey || charObj.file === primaryLeadKey || charObj.name === primaryLeadKey) {
        continue;
      }

      var isMentioned = false;
      for (var j = 0; j < charObj.aliases.length; j++) {
        var alias = charObj.aliases[j];
        if (scanTarget.indexOf(alias) !== -1) {
          isMentioned = true;
          break;
        }
      }

      if (isMentioned) {
        activeNPCs.push(charObj);
        if (activeNPCs.length >= 2) break; // 上限 2 位，避免 Token 膨脹
      }
    }

    return activeNPCs;
  }

  /**
   * 組裝三層人設 Prompt 區塊 (Tier 1 / Tier 2 / Tier 3)
   * @param {string} primaryLeadKey - 核心主角識別碼
   * @param {Array<Object>} activeNPCs - 在場配角陣列
   * @param {boolean} isShura - 是否為全勢力修羅場模式
   * @returns {string} 格式化之三層角色提示詞
   */
  function assembleCharacterPromptBlock(primaryLeadKey, activeNPCs, isShura) {
    var roster = getRosterIndex();
    var blocks = [];

    if (isShura) {
      blocks.push('=== 【全勢力修羅場 (Tier 1)】 ===');
      blocks.push('當前模式：十三勢力修羅場交鋒！所有 13 位男主均可能依局勢動態突入，請隨時維持各方勢力交鋒的緊張感與性張力！');
      blocks.push('');
    } else {
      // 1. Tier 1: 主要互動角色
      var primaryChar = roster.filter(function(c) {
        return c.id === primaryLeadKey || c.file === primaryLeadKey || c.name === primaryLeadKey;
      })[0] || roster[0];

      var primaryMarkdown = getCharacterMarkdown(primaryChar.file);
      blocks.push('=== 【主要互動角色 (Tier 1)】 ===');
      blocks.push('【核心對象】：' + primaryChar.name + '（' + primaryChar.role + '）');
      blocks.push(primaryMarkdown || primaryChar.oneLiner);
      blocks.push('');
    }

    // 2. Tier 2: 當前在場配角 (若有，載入全量 Markdown 人設)
    if (activeNPCs && activeNPCs.length > 0) {
      blocks.push('=== 【當前在場配角 (Tier 2 · 動態突入 · 全量人設)】 ===');
      blocks.push('【在場配角演繹指引】：以下角色已動態升階為在場配角！已加載其完整 Markdown 人設與上位者性格，請生動演繹其試探與交鋒，推動衝突，但不可喧賓奪主蓋過核心主角！');
      for (var k = 0; k < activeNPCs.length; k++) {
        var npc = activeNPCs[k];
        var npcMd = getCharacterMarkdown(npc.file);
        blocks.push('▶ 在場配角 [' + (k + 1) + ']：' + npc.name + ' (' + npc.role + ')');
        blocks.push(npcMd || npc.oneLiner);
      }
      blocks.push('');
    }

    // 3. Tier 3: 世界全景背景名冊
    var activeIds = (activeNPCs || []).map(function(n) { return n.id; });
    if (primaryLeadKey) activeIds.push(primaryLeadKey);

    var tier3List = roster.filter(function(c) {
      return activeIds.indexOf(c.id) === -1 && (!primaryLeadKey || c.name !== primaryLeadKey);
    });

    if (tier3List.length > 0) {
      blocks.push('=== 【世界全景背景名冊 (Tier 3 · 勢力網絡)】 ===');
      blocks.push('【宏觀世界與勢力交織】：這些人物構成了台北政商黑白兩道的權力網絡。即使本回合未在場，他們的勢力暗流、新聞傳聞、手下眼線與利益關聯仍持續在背景運轉，隨時可能因情勢變化介入局勢！若劇情中提及，請嚴格遵守其官方身分定位，絕不可張冠李戴：');
      for (var m = 0; m < tier3List.length; m++) {
        var t3 = tier3List[m];
        blocks.push('• ' + t3.name + '：' + t3.role + ' —— ' + t3.oneLiner);
      }
    }

    return blocks.join('\n');
  }

  /**
   * 一鍵清空所有角色與 Roster 快取維護函式
   */
  function clearAllCharacterCache() {
    var cache = CacheService.getScriptCache();
    var keys = ['roster_index_json'];
    for (var i = 0; i < OFFICIAL_ROSTER.length; i++) {
      keys.push('char_md_' + OFFICIAL_ROSTER[i].file.replace(/[^a-zA-Z0-9_]/g, '_'));
    }
    cache.removeAll(keys);
    console.log('All character caches cleared successfully (' + keys.length + ' keys).');
    return { success: true, message: 'Character caches cleared.', clearedCount: keys.length };
  }

  return {
    getRosterIndex: getRosterIndex,
    getCharacterMarkdown: getCharacterMarkdown,
    detectActiveNPCs: detectActiveNPCs,
    assembleCharacterPromptBlock: assembleCharacterPromptBlock,
    clearAllCharacterCache: clearAllCharacterCache
  };

})();
