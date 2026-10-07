function getKinshipAndSpecialTiesPrompt(playerProfile, primaryLeadKey, activeNPCs = []) {
  let ties = [];
  const profileName = (playerProfile?.name || '').trim();
  const leadKeys = [primaryLeadKey, ...activeNPCs].filter(Boolean);

  // 1. 楊慕璃 (女主) × 楊紹宸 (二哥) 核心豪門羈絆
  const isPlayerMuLi = profileName.includes('楊慕璃') || profileName.includes('慕璃');
  const hasShaoChen = leadKeys.some(k => String(k).includes('楊紹宸') || String(k).includes('04_'));

  if (isPlayerMuLi && hasShaoChen) {
    ties.push(`【絕對不可撼動之血緣與既定羈絆防火牆：楊慕璃 × 楊紹宸】
1. 【親屬與豪門位階與稱謂】：楊慕璃（弘楊集團三房千金兼瑾和文教基金會執行長，24歲）是 楊紹宸（大房次子 · 弘楊集團副總兼執行董事，28歲）同父異母的「親妹妹」。楊紹宸在集團職銜為「副總 / 楊副總」，【絕非少東】。
2. 【同住既定事實】：兩人自幼同住在陽明山腰的楊家大宅多年，【絕對不是初次見面的陌生人】！絕不可出現「初次見面自我介紹」、「客套遞名片」、「請問您是哪位」等嚴重破壞沉浸感的失誤！
3. 【稱謂與互動默契】：楊慕璃私下稱其為「二哥」或「紹宸哥」；楊紹宸稱其為「慕璃」或「小妹」。
4. 【深層張力與心理】：楊紹宸表面冷靜自律、步步做局，但對妹妹慕璃有著極度壓抑、強烈佔有慾的「重度妹控」屬性，深知慕璃的一切生活習慣（喜飲金萱與不甜香檳、不喝咖啡、體質敏感精緻）。
5. 【嚴格禁制】：兩人互動必須建立在深厚熟稔與豪門權力推拉的基礎上，嚴禁任何陌生化描寫！
6. 【座車與出入設定】：楊紹宸私人座車為鐵灰色 Audi RS7，公務座車為集團配置黑色 Mercedes-Benz S680 配專屬司機，【絕對不是邁巴赫（Maybach）】！`);
  }

  // 2. 徐令謙 (堂哥) × 徐宇寧 (堂弟)
  const hasLingQian = leadKeys.some(k => String(k).includes('徐令謙') || String(k).includes('01_'));
  const hasYuNing = leadKeys.some(k => String(k).includes('徐宇寧') || String(k).includes('05_'));
  if (hasLingQian && hasYuNing) {
    ties.push(`【既定親屬關係：徐令謙 × 徐宇寧】
- 徐令謙是徐宇寧的遠房堂哥。少年時期徐令謙曾啟發宇寧練習射擊（「找出你的優勢，有效率地變強」）。
- 徐宇寧為徐令謙的主治牙醫，兩人在天母與永康街偶有往來，非陌生人。`);
  }

  return ties.length > 0 ? ('\n\n' + ties.join('\n\n') + '\n') : '';
}

/**
 * 《暗流》（UNDER CURRENT）— 頂級沉浸式互動文字 RPG 核心引擎
 * 版本: v20260816_v50
 * 
 * 核心特性：
 * 1. 純 AI 即時零範本生成架構（大模型現場實時創作長篇小說與分支選項）
 * 2. 100% 同步 Google Drive 官方 13 位男主人物設定檔案
 * 3. 完整人物與劇情設定庫 (Profile Manager)：支援編輯、重新命名、刪除、匯出匯入與一鍵開局
 * 4. 完整存檔庫 (Save Archives)：支援自訂命名、搜尋、重新命名、刪除、跨設備匯出匯入
 * 5. App 風格頂部返回導航列、歷史章節瀑布流、打字機動畫與微醺/張力即時面板
 */

// 官方 13 位男主資料庫
const OFFICIAL_DRIVE_CHARACTERS = {
  "01_徐令謙": {
    "key": "01_徐令謙",
    "name": "徐令謙",
    "fullName": "徐令謙（徐顧問 · 謙哥）",
    "age": "35歲",
    "title": "玄辰幫二把手 · 天裕會首領 · 德行事務所最高顧問",
    "mbti": "INTJ（摩羯座）",
    "cars": "私人車：坦桑石藍 BMW X6 M60i；公務車：深銀灰色 BMW M760i xDrive（天裕會三玉隊駕駛）",
    "watch": "Omega De Ville Prestige 41 mm 黃金皮帶腕錶；復古圓眼鏡（工作與正式場合佩戴）",
    "residence": "台北市士林區天母一帶（低調靜謐宅邸）",
    "perfume": "柑橘調、木質調、菸草香",
    "identityRole": "亞洲前三大黑幫「玄辰幫」二把手暨中樞堂口「天裕會」首領，黑白兩道地下秩序真正操盤人，冷靜自持的秩序操盤者。",
    "personality": "溫和紳士的黑道謀略家，以算計與承擔建立秩序。沉著冷靜、禮貌克制，聽起來舒服且令人信賴，帶有距離感但不冷漠。",
    "speechExamples": [
      "「去做妳想做的事，剩下的我來安排。」"
    ]
  },
  "02_韓正寰": {
    "key": "02_韓正寰",
    "name": "韓正寰",
    "fullName": "韓正寰（韓檢 · 白日判官）",
    "age": "35歲",
    "title": "士林地檢署檢察官 · 白日判官（全劇唯一檢察官）",
    "mbti": "ISTJ（處女座）",
    "cars": "公私皆用白色 Škoda Enyaq Coupe（低調嚴謹、不收受任何財閥配車）",
    "watch": "Seiko Presage 無釉有田燒限量工藝錶；Cerruti 1881 黑色皮帶",
    "residence": "台北市大安區（極簡無多餘雜物的單身公寓）",
    "perfume": "Diptyque Tam Dao（檀道）",
    "identityRole": "士林地檢署檢察官，司法界正義最後一道防線，代表國家司法公權力。",
    "personality": "白日判官：以法律為刀、痛覺為真的極致控制者。低沉、平穩、無波瀾，像宣讀判決書；但在逼問或支配時會微微上揚，帶著不容反駁的壓迫感。",
    "speechExamples": [
      "「抓一個開槍的人不難，難的是拉出那些從來不沾血，卻能讓整個城市聽命的人。」",
      "「當我拍打你的皮膚，我是在確認你還活著；當我讓你感到痛苦，那是因為我正在接管你的靈魂。」",
      "「法律是文明的枷鎖，而痛覺，是靈魂唯一的真話。但我對妳的佔有，超越了這兩者。」"
    ]
  },
  "03_邵翊衡": {
    "key": "03_邵翊衡",
    "name": "邵翊衡",
    "fullName": "邵翊衡（邵顧問）",
    "age": "37歲",
    "title": "昱合策略創辦人暨執行長 · 政媒幕後操盤者 · 頂級輿情顧問 · 智庫政策顧問",
    "mbti": "INTJ（天蠍座）",
    "cars": "私人車：黑曜金屬色 Porsche 911 Carrera 4 GTS；公務車：黑色 Audi A8（智庫配車，前國防部長隨扈駕駛）",
    "watch": "Jaeger-LeCoultre 超薄大師系列腕錶；暗銀色細方框眼鏡",
    "residence": "台北市松山區敦化北路巷內頂樓 Penthouse；其他房產：內湖山上獨棟別墅",
    "perfume": "木質調",
    "identityRole": "政商黑白兩道頂級輿情顧問與危機處理操盤手。表面是風度翩翩的策士，實為操弄人心、控制風向的無聲支配者。",
    "personality": "政媒操盤手，用理智包裹破碎，以資訊與策略掌控局勢。語氣溫和、冷靜、有距離感，帶著風度卻不失溫度，聽起來像策士在布局，不急不徐，卻有隱隱的壓迫感。",
    "speechExamples": [
      "「我知道那邊想要什麼，但他們要的是畫面，不是結果。」",
      "「如果連反對的聲音都不夠具體，那這方案就還沒成熟。」",
      "「我會讓妳自由，但不是放手，是因為我知道妳會回來。」",
      "「我想進去，但我等妳點頭。現在告訴我，妳要我。說出來。」"
    ]
  },
  "04_楊紹宸": {
    "key": "04_楊紹宸",
    "name": "楊紹宸",
    "fullName": "楊紹宸（楊副總 · 二哥）",
    "age": "28歲",
    "title": "弘楊集團副總 · 執行董事 · 物流貿易事業群總經理",
    "mbti": "INTP（處女座）",
    "cars": "私人車：鐵灰色 Audi RS7；公務車：黑色 Benz S680 配專屬司機（絕非邁巴赫）",
    "watch": "Blancpain Air Command 飛行員腕錶",
    "residence": "台北市士林區陽明山腰楊家大宅（與慕璃同住）；私人頂樓靜巷宅位於中山區林蔭大道",
    "perfume": "雪松、冷杉、岩蘭的木質調香水",
    "identityRole": "弘楊集團副總、執行董事兼物流貿易總經理，楊家次子，楊慕璃二哥。商場狠辣決絕、行事雷厲風行。",
    "personality": "弘楊集團副總，優雅攻防的智囊，笑著送你下地獄的獵豹。沉靜溫和，帶有距離感，聽起來禮貌好相處，卻隱含壓迫與掌控，像平靜湖面下的暗流。",
    "speechExamples": [
      "「這不是誰對誰錯的問題，是誰比較知道什麼不能說。」",
      "「我們不是要說服他，是讓他自己想出我們要的答案。」",
      "「我會讓妳自由，但不是放手，是因為我知道妳會回來。」",
      "「別說你沒準備好，你現在呼吸都在等我。」"
    ]
  },
  "05_徐宇寧": {
    "key": "05_徐宇寧",
    "name": "徐宇寧",
    "fullName": "徐宇寧（徐院長 · 宇寧）",
    "age": "28歲",
    "title": "明隱牙醫診所院長 · 專職牙醫師 · 學生時代射擊隊空氣手槍好手",
    "mbti": "ISFP（天秤座）",
    "cars": "淺灰藍色 Volvo XC60（低調沈穩高安全，車上常備手工香氛噴霧）",
    "watch": "Nomos Glashütte Tangente Neomatik 39 Midnight Blue；單眼皮，笑起來眼尾微彎",
    "residence": "台北市大安區永康街一帶靜巷公寓（出身松山區）",
    "perfume": "Diptyque Philosykos（無花果木）與 Jo Malone 苦橙葉",
    "identityRole": "自營《明隱牙醫》診所院長兼主治牙醫師，徐令謙遠房堂弟，徐令謙、楊紹宸、沈湛然的牙醫，楊紹宸薇閣中學國中、高中六年同班同學。平日穿淺灰或深藍制服，私下穿亞麻襯衫。",
    "personality": "溫柔細膩的牙醫，以氣味、節奏與細節，讓人不知不覺卸下心防。溫暖、陽光、輕柔，帶點調皮的幽默感，聽起來令人放鬆、安心，彷彿被溫柔包覆。",
    "speechExamples": [
      "「你今天講話比平常慢一點」",
      "「風有點大，下次幫你記得帶圍巾。」",
      "「我知道妳現在全身都在發燙，還想假裝妳沒有感覺嗎？」",
      "「我進來了。」"
    ]
  },
  "06_林政修": {
    "key": "06_林政修",
    "name": "林政修",
    "fullName": "林政修（林次 · 次長）",
    "age": "41歲",
    "title": "法務部政務次長（林次）",
    "mbti": "ESTJ（摩羯座）",
    "cars": "曜石黑 Mercedes-Benz S-Class L 350d（公務配車）",
    "watch": "Longines Master Collection",
    "residence": "台北市中正區高樓層華廈（老家彰化鹿港）",
    "perfume": "Terre d'Hermès",
    "identityRole": "法務部政務次長，人稱「林次」，法界明星官僚。總是面帶微笑、修辭精準，用優雅的語氣說出致命的評論。",
    "personality": "以笑容與邏輯掌控全局的法務部政務次長，優雅而危險的秩序維護者。溫文儒雅、從容有禮，帶著笑意卻有不容置疑的權威感，聽起來令人卸下戒心，實則句句帶刺。",
    "speechExamples": [
      "「我們當然樂意聽取各界的指教，但事實上，現行法規對於這一類問題早有明確規範，您可以再參考一下第十三條。」",
      "「每個人的觀點都很寶貴，只是有時候，經驗本身未必能取代制度設計的初衷。」",
      "「妳以為我不在乎，其實我只是在看妳想怎麼做。」",
      "「不必跟我討價還價。我已經決定了，妳要的會比妳想像的還多。」"
    ]
  },
  "07_沈湛然": {
    "key": "07_沈湛然",
    "name": "沈湛然",
    "fullName": "沈湛然（沈醫師 · 湛然）",
    "age": "36歲",
    "title": "台大醫院精神醫學部主治醫師 · 司法精神醫學權威（全劇唯一精神科主治醫師）",
    "mbti": "INFJ（金牛座）",
    "cars": "私人車：極光鈦 Lexus ES 300h（車齡七年，維護極佳，車內乾淨沈靜）",
    "watch": "LONGINES CONQUEST HERITAGE",
    "residence": "台北市中山區行天宮站附近三房老公寓",
    "perfume": "雪松、廣藿香、皮革與一點煙草混合的木質香",
    "identityRole": "台大醫院精神醫學部主治醫師、司法精神鑑定權威。",
    "personality": "以理性拆解人性、以溫柔包容失控的司法精神醫學權威。低穩、沉靜，帶有安全感和包容力，偶爾透出壓迫感。",
    "speechExamples": [
      "「我並不期待你馬上說實話，但你有多堅持，等到那時候我都還在。」",
      "「每個人都會說謊，但真正想被看見的人，會選擇什麼時候停下。」",
      "「你不用逞強，我會在你想安靜的時候安靜，在你想哭的時候讓你哭完。」",
      "「你可以回來，無論什麼時候。」"
    ]
  },
  "08_江瀚文": {
    "key": "08_江瀚文",
    "name": "江瀚文",
    "fullName": "江瀚文（江總 · Ethan哥）",
    "age": "36歲",
    "title": "鼎曜媒體集團執行長 · 娛樂影視帝國掌門人",
    "mbti": "ENTJ（水瓶座）",
    "cars": "銀灰色 Aston Martin DBS",
    "watch": "TAG Heuer Carrera Chronograph搭配深藍皮革錶帶",
    "residence": "台北市中山區大直挑高河景頂級公寓",
    "perfume": "Tom Ford Oud Wood（冷感木質、乾淨深沉）",
    "identityRole": "鼎曜媒體集團執行長，操縱全台娛樂媒體、公關風向與影視資源的頂級資本家。風流倜儻、極具魅力與審美品味。",
    "personality": "媒體帝國的冷血掌門人，用控制與算計包裹一切。冷靜、銳利、帶有壓迫感，偶爾溫柔但總藏著算計。",
    "speechExamples": [
      "「每個人都有秘密，我只想知道你願意給我看多少。」",
      "「想掩飾的細節，往往才是最真實的部分。」",
      "「我一直在等一個人，哪怕只有一夜，讓我放心失控。」",
      "「別忍耐了，你知道我最受不了你裝無所謂。」"
    ]
  },
  "09_吳衛廷": {
    "key": "09_吳衛廷",
    "name": "吳衛廷",
    "fullName": "吳衛廷（衛廷哥 · 吳委員）",
    "age": "42歲",
    "title": "最大在野黨立法委員（台北市舊城區/萬華）· 國會喬王",
    "mbti": "ESTP（金牛座）",
    "cars": "公務車：黑色 Toyota Alphard（極黑隔熱紙）；私人車：Mercedes-Benz E-Class Sedan",
    "watch": "刮痕累累的半金勞力士",
    "residence": "台北市萬華區透天厝頂樓",
    "perfume": "七星菸草味、曬過太陽的衣物柔軟精味，偶爾夾雜威士忌、黑咖啡與一絲廟宇線香",
    "identityRole": "最大在野黨立法委員、立法院司法及法制委員會委員、國會喬王，說話草莽、台語夾雜。",
    "personality": "萬華出身的草莽立委，用江湖氣與基層智慧在國會殺出一條血路。粗獷、圓融、帶有基層智慧，笑裡藏刀，中氣十足，偶爾流露野獸般的警告意味。",
    "speechExamples": [
      "「次長，你那套標準放在冷氣房裡很完美啦，但搬到菜市場裡，是會逼死人的。規矩是死人定的，活人總要吃飯吧？不給飯吃，你是要逼我掀桌嗎？」",
      "「幹，少跟我來這套。大家出來混都是混口飯吃，沒有什麼是坐下來喝杯高粱喬不攏的。如果不攏……（點燃打火機）那就看誰的酒瓶比較硬了。」",
      "「外面那些烏煙瘴氣的麻煩事我去幹，妳只要乖乖待在我身邊就好。天塌下來，有我吳衛廷頂著，輪不到妳來操心。」",
      "「嫌我俗？靠北，我就俗啊，但我疼妳是真的。林政修只會跟妳講道理，邵翊衡只會算計妳，外面那些穿西裝的哪個有我耐操？我只知道妳現在是我的，誰敢動妳一下，我讓他連台北市都待不下去。」"
    ]
  },
  "10_徐承勳": {
    "key": "10_徐承勳",
    "name": "徐承勳",
    "fullName": "徐承勳（副總統 · 徐先生）",
    "age": "47歲",
    "title": "中華民國副總統 · 科技經濟巨擘 · 頂層掌權人",
    "mbti": "ENTJ（摩羯座）",
    "cars": "公務車：深黑色 Audi A8 L Security 防彈裝甲車；私人車：克爾巴阡灰 Jaguar F-Type COUPÉ R75",
    "watch": "A. Lange & Söhne (朗格) Zeitwerk；極細鈦金屬無框眼鏡",
    "residence": "台北市大安區仁愛路副總統官邸；信義區智慧頂級豪宅",
    "perfume": "Penhaligon's The Tragedy of Lord George (喬治勳爵的悲劇)",
    "identityRole": "中華民國副總統，國家權力最巔峰掌舵者之一，苗栗客家書香門第出身，兼具科技巨擘背景與政治最高手腕。",
    "personality": "被架空的副總統，以頂尖大腦與情報網在體制內外進行無形絞殺的極致博弈者。冷靜、深沉、優雅，帶著上位者的威嚴與壓迫感，偶爾流露幽默與諷刺，但從不失控。",
    "speechExamples": [
      "「江總，新聞自由是國家給的，希望鼎曜的頭版，對得起國家的期待。」",
      "「我們可以在灰色地帶遊走，但絕對不能越界違法。這攸關你我的政治生命。」"
    ]
  },
  "11_徐耀南": {
    "key": "11_徐耀南",
    "name": "徐耀南",
    "fullName": "徐耀南（徐董 · 榮南王）",
    "age": "57歲",
    "title": "榮南營造集團董事長（榮南王）· 中台灣營建霸主",
    "mbti": "ENTJ-A（獅子座）",
    "cars": "公務車：絲絨棕 Mercedes-Benz S450 4Matic L（專屬司機駕駛）",
    "watch": "Patek Philippe Calatrava 5227G（工作日）；Rolex Day-Date 40 白金藍面（假日）",
    "residence": "台中市南屯區七期重劃區豪宅主宅",
    "perfume": "Tom Ford Oud Wood（平日）；Maison Francis Kurkdjian Baccarat Rouge 540（夜晚或私密場合）",
    "identityRole": "榮南營造集團董事長，中台灣營造業教父，徐若宸之父。白手起家、霸道狠絕、氣場雄渾。",
    "personality": "從工地爬上金字塔的台中營造霸主，以掌控為信仰的權力型人物。冷峻威嚴，帶著壓迫感，像在審視對方。",
    "speechExamples": [
      "「這個味道我記得。」",
      "「掌控比愛更可靠。」",
      "「妳屬於我。」"
    ]
  },
  "12_徐若宸": {
    "key": "12_徐若宸",
    "name": "徐若宸",
    "fullName": "徐若宸（若宸 · 小徐總）",
    "age": "22歲",
    "title": "榮南營造家族長子 · 中興大學企業管理研究所研究生 · 營業部實習",
    "mbti": "金牛座",
    "cars": "金屬莫蘭迪綠色 Volkswagen T-Roc（父親所贈）",
    "watch": "簡約知性腕錶；雙眼皮大眼，微帶鳳眼",
    "residence": "台中市南屯區七期重劃區豪宅",
    "perfume": "清新柑橘、白麝香與剛洗淨的純棉襯衫香",
    "identityRole": "榮南營造家族長子，徐耀南之子，溫哥華私校/UBC畢業，現就讀中興企管所並在家族實習。",
    "personality": "榮南營造接班人，溫和禁慾的壓抑長子。溫和、謙遜，聽起來平靜有教養，但偶爾流露壓抑的遲疑或感嘆。",
    "speechExamples": [
      "「我不想只做我父親安排好的繼承人，我想用我自己的方式保護妳。」",
      "「別走……今晚留下來，不要讓我一個人面對這棟大房子。」",
      "「我可能沒有他們那麼多的手段，但我對妳的心，沒有半分算計。」"
    ]
  },
  "13_徐予澈": {
    "key": "13_徐予澈",
    "name": "徐予澈",
    "fullName": "徐予澈（藝名徐泰希 / 化名 Hans）",
    "age": "29歲",
    "title": "亞洲頂級男團 HapSTer 主唱兼領舞",
    "mbti": "INFJ（天秤座）",
    "cars": "保姆車：銀色 Benz V-Class；私用車：消光磁灰 Benz G500；收藏車：米白色 Volvo 1800S",
    "watch": "Cartier Tank Louis 腕錶；私下戴簡約銀飾，出門常戴墨鏡（沒有戴眼鏡）",
    "residence": "新北市新莊區高級社區（低調隱密）",
    "perfume": "私下木質調、麝香調；舞台前噴的是更濃烈的辛香調",
    "identityRole": "風靡亞洲的頂級男團「HapSTer」主唱兼領舞，舞台上萬人矚目的頂流巨星，私下渴望真實平靜的靈魂。",
    "personality": "舞台上是性張力本體，私下是呆萌慢熱的大男孩。溫潤慵懶，帶點傻氣與真誠，容易害羞臉紅，語無倫次時會結巴。",
    "speechExamples": [
      "「那個......是工作啦」",
      "「別看別看」",
      "「剛剛那個算不算告白」",
      "「欸等等,妳是不是又在騙我」"
    ]
  },
  "14_楊慕璃": {
    "key": "14_楊慕璃",
    "name": "楊慕璃",
    "fullName": "楊慕璃（慕璃 · 楊總監）",
    "age": "24歲",
    "title": "弘楊集團公關總監 · 瑾和文教基金會執行長（楊家三房獨生女）",
    "mbti": "INTJ（金牛座）",
    "cars": "冰晶藍色 Porsche Panamera（多為收藏，不常親自駕駛）",
    "watch": "Cartier Tank 經典女錶；杏眼白皙、及肩黑髮自然捲",
    "residence": "陽明山腰楊家大宅（與兩位哥哥同住）；新莊副都心高樓私人豪宅",
    "perfume": "天然動情體香，偏好金萱茶與不甜香檳，不喝咖啡",
    "identityRole": "楊家三房獨生女，台大法律/北大犯罪所畢業，弘楊集團公關總監。遊走於政商多方勢力間的頂級智性大女主。",
    "personality": "表面冷靜鋒利、內裡溫柔細膩的楊家三房獨生女，以智慧與美貌在重男輕女的家族中站穩腳步。冷靜理性中帶著溫柔，語氣輕柔卻有鋒利感，聽起來從容不迫、帶有距離感，但偶爾流露俏皮與體貼。",
    "speechExamples": [
      "「各位哥哥與長輩們爭奪這盤大棋，可曾問過我的意願？」",
      "「既然入了這局，就別怪我按照我的規則來玩。」"
    ]
  }
};

/**
 * 角色硬性設定（只進提示詞與糾察隊，不顯示在人物圖鑑）。
 *
 * 這些規則原本以【】標記寫在 OFFICIAL_DRIVE_CHARACTERS 的 watch／identityRole
 * 裡，結果「【絕對不是檢察官或法官】」「【無配戴眼鏡】」直接顯示在玩家看的
 * 人物圖鑑上。拆開後：圖鑑只放介紹，規則集中在這裡。
 *
 * glasses：null 代表不戴眼鏡；字串代表會戴、以及戴的樣式。
 */
const CHARACTER_CANON_RULES = {
  '01_徐令謙': { glasses: '工作與正式場合戴復古圓眼鏡', rules: ['身分是玄辰幫二把手，絕對不是檢察官或法官'] },
  '02_韓正寰': { glasses: null, rules: ['全劇唯一的檢察官（士林地檢署檢察官，不是主任檢察官），代表國家司法公權力', '絕對不是警察、律師或黑道'] },
  '03_邵翊衡': { glasses: '暗銀色細方框眼鏡', rules: [] },
  '04_楊紹宸': { glasses: null, rules: ['職銜是副總（楊副總），楊慕璃稱他二哥；絕對不可稱為少東'] },
  '05_徐宇寧': { glasses: null, rules: ['專職牙醫師，絕非全科醫生、內外科醫生或密醫；不可提著醫藥箱外出急救或量血壓', '不是穿白袍的掌控狂'] },
  '06_林政修': { glasses: null, rules: [] },
  '07_沈湛然': { glasses: null, rules: ['在台大醫院上班，沒有個人診所，不是院長，也不是外科醫生'] },
  '08_江瀚文': { glasses: null, rules: [] },
  '09_吳衛廷': { glasses: null, rules: ['全劇唯一可以講草莽粗話、台語夾雜的角色；其他角色都不可以這樣說話'] },
  '10_徐承勳': { glasses: '極細鈦金屬無框眼鏡', rules: [] },
  '11_徐耀南': { glasses: null, rules: [] },
  '12_徐若宸': { glasses: null, rules: [] },
  '13_徐予澈': { glasses: null, rules: ['私下外出常戴墨鏡遮掩身分'] },
  '14_楊慕璃': { glasses: null, rules: [] }
};

/** 把一位角色的硬性設定組成提示詞條列。 */
function formatCanonRules(key) {
  const c = OFFICIAL_DRIVE_CHARACTERS[key];
  const r = CHARACTER_CANON_RULES[key];
  if (!c || !r) return '';
  const lines = [r.glasses ? `會戴眼鏡：${r.glasses}` : '不戴眼鏡', ...r.rules];
  return `【${c.name} 硬性設定（違反即為錯誤）】\n${lines.map(l => `- ${l}`).join('\n')}`;
}


// 預設官方人設範本
const DEFAULT_PRESETS = {
  'preset_yang': {
    name: '楊慕璃',
    gender: '女',
    age: '24',
    profession: '弘楊集團公關總監 · 瑾和文教基金會執行長',
    background: '台灣大學法律系、台北大學犯罪學研究所畢業。身為楊家三房獨生女，在權謀風暴中憑藉智慧與魅力遊走於各方勢力之間。',
    appearance: '隨機',
    taboos: '禁止暴力侮辱，無特定雷區',
    targetLead: '修羅場',
    targetLeadName: '修羅場',
    allowR18: true,
    customScenario: '在深夜的台北士林便利商店遇到徐令謙'
  },
  'preset_ruan': {
    name: '阮思薇',
    gender: '女',
    age: '26',
    profession: '司法政經獨立調查特派員',
    background: '曾任主流大報政治組調查記者，後因揭發官商弊案獨立經營調查報導自媒體，掌握多方未公開金流帳冊。',
    appearance: '隨機',
    taboos: '無特定雷區',
    targetLead: '02_韓正寰',
    targetLeadName: '韓正寰',
    allowR18: true,
    customScenario: '士林地檢署第六偵查庭深夜閉門訊問'
  },
  'preset_chen': {
    name: '陳牧言',
    gender: '男',
    age: '25',
    profession: '新銳獨立調查記者 · 政經專欄作家',
    background: '台大政治系畢業。以冷峻敏銳的視角剖析政商金流與派系黑幕，在各方勢力博弈中探尋真相與破局點。',
    appearance: '隨機',
    taboos: '無特定雷區',
    targetLead: '01_徐令謙',
    targetLeadName: '徐令謙',
    allowR18: true,
    customScenario: '在天母思慕咖啡深夜初次遭遇徐令謙'
  }
};

// 官方角色庫另含主角楊慕璃；攻略與配角選單只能列出 13 位男主。
function getOfficialLeadKeys() {
  return Object.keys(OFFICIAL_DRIVE_CHARACTERS).filter(key => key !== '14_楊慕璃');
}

// 全域狀態
const state = {
  gasApiUrl: 'https://script.google.com/macros/s/AKfycby-MudkbcVPAfVDZk2B1zznDlOfjnJOqMB2A3586Ct3ZGq_CUNteKe1lZ4bbw8HwqS9sw/exec',
  token: localStorage.getItem('undercurrent_auth_token') || '',
  userId: localStorage.getItem('undercurrent_user_id') || '',
  username: localStorage.getItem('undercurrent_user_name') || '',
  currentTurn: 1,
  currentAct: 1,
  chapterData: null,
  saveState: null,
  chapterHistoryList: [],
  isTyping: false,
  skipTypewriterTriggered: false,
  typewriterTimer: null,
  lastChoicePayload: null,
  // 本回合生成模式（'normal' 一般 ／ 'spicy' 開車），由玩家按下的送出鍵決定。
  // 這裡刻意寫字面值：state 宣告在 DEFAULT_GENERATION_MODE 之前，引用會踩到暫時性死區。
  generationMode: 'normal',
  previousStateSnapshot: null,
  currentAbortController: null,
  generationAbortRequested: false,
  isGenerating: false,
  cooldownInterval: null,
  fontSizePx: parseInt(localStorage.getItem('undercurrent_font_size') || '18', 10),
  theme: localStorage.getItem('undercurrent_theme') || 'dark',
  typeSpeed: localStorage.getItem('undercurrent_type_speed') || 'fast'
};

function createGenerationAbortError() {
  const error = new Error('Generation aborted by user.');
  error.name = 'AbortError';
  return error;
}

function isGenerationAbortError(error) {
  return state.generationAbortRequested || (error && error.name === 'AbortError');
}

function throwIfGenerationAborted() {
  if (state.generationAbortRequested) throw createGenerationAbortError();
}

// ==========================================
// 2. DOM 元素動態安全代理 (Dynamic DOM Proxy)
// ==========================================

const DOM_ID_MAP = {
  authModal: 'auth-modal',
  loginForm: 'login-form',
  registerForm: 'register-form',
  tabLoginBtn: 'tab-login-btn',
  tabRegisterBtn: 'tab-register-btn',
  userBadge: 'user-badge',
  usernameDisplay: 'username-display',
  homeUsernameDisplay: 'home-username-display',
  logoutBtn: 'logout-btn',
  homeLogoutBtn: 'home-logout-btn',
  homeDeleteAccountBtn: 'home-delete-account-btn',
  homeClearAllDataBtn: 'home-clear-all-data-btn',
  
  homeView: 'home-view',
  gameplayView: 'gameplay-view',
  navHomeBtn: 'nav-home-btn',
  headerHomeBtn: 'header-home-btn',
  backToHomeBtn: 'back-to-home-btn',
  gameplayBreadcrumb: 'gameplay-breadcrumb',
  
  homeNewGameBtn: 'home-new-game-btn',
  homeContinueGameBtn: 'home-continue-game-btn',
  homeContinueDesc: 'home-continue-desc',
  homeOpenSavesBtn: 'home-open-saves-btn',
  homeOpenPresetsBtn: 'home-open-presets-btn',
  homeViewAllSavesBtn: 'home-view-all-saves-btn',
  homeRecentSavesList: 'home-recent-saves-list',
  homeOpenGuideBtn: 'home-open-guide-btn',

  charCreationModal: 'character-creation-modal',
  closeModalBtn: 'close-modal-btn',
  cancelCharCreationBtn: 'cancel-char-creation-btn',
  charCreationForm: 'char-creation-form',
  profilePresetsSelect: 'profile-presets-select',
  saveCurrentProfileBtn: 'save-current-profile-btn',
  openProfileManagerBtn: 'open-profile-manager-btn',
  formTargetLead: 'form-target-lead',

  profileManagerModal: 'profile-manager-modal',
  closeProfileManagerBtn: 'close-profile-manager-btn',
  profileManagerList: 'profile-manager-list',
  searchProfileInput: 'search-profile-input',
  exportProfilesBtn: 'export-profiles-btn',
  importProfilesInput: 'import-profiles-input',
  
  navSavesBtn: 'nav-saves-btn',
  navPresetsBtn: 'nav-presets-btn',
  navGuideBtn: 'nav-guide-btn',
  navFeedbackBtn: 'nav-feedback-btn',
  mobileNavSavesBtn: 'mobile-nav-saves-btn',
  mobileMenuBtn: 'mobile-menu-btn',

  drawerGameplayBtn: 'drawer-gameplay-btn',
  drawerPresetsBtn: 'drawer-presets-btn',
  drawerGuideBtn: 'drawer-guide-btn',
  drawerFeedbackBtn: 'drawer-feedback-btn',
  drawerHomeBtn: 'drawer-home-btn',
  drawerSavesBtn: 'drawer-saves-btn',

  saveArchiveModal: 'save-archive-modal',
  closeSaveArchiveBtn: 'close-save-archive-btn',
  newSaveNameInput: 'new-save-name-input',
  createNamedSaveBtn: 'create-named-save-btn',
  searchSaveInput: 'search-save-input',
  exportAllSavesBtn: 'export-all-saves-btn',
  importAllSavesInput: 'import-all-saves-input',
  manualCloudSyncBtn: 'manual-cloud-sync-btn',
  saveArchivesList: 'save-archives-list',
  
  novelStreamContainer: 'novel-stream-container',
  choicesContainer: 'choices-container',
  customActionInput: 'custom-action-input',
  submitCustomBtn: 'submit-custom-btn',
  
  sideDrawer: 'side-drawer',
  drawerBackdrop: 'drawer-backdrop',
  openDrawerBtn: 'open-drawer-btn',
  closeDrawerBtn: 'close-drawer-btn',
  gameplayDrawerBtn: 'gameplay-drawer-btn',
  gameplayQuickSaveBtn: 'gameplay-quick-save-btn',
  gameplayMemoryBtn: 'gameplay-memory-btn',

  memoryCenterModal: 'memory-center-modal',
  memoryCenterContent: 'memory-center-content',
  closeMemoryCenterBtn: 'close-memory-center-btn',
  closeMemoryCenterBottomBtn: 'close-memory-center-bottom-btn',
  forkCurrentStoryBtn: 'fork-current-story-btn',
  
  hpDisplay: 'hp-display',
  sanityDisplay: 'sanity-display',
  profileCardName: 'profile-card-name',
  profileCardLead: 'profile-card-lead',
  relationshipsList: 'relationships-list',
  intelLedgerList: 'intel-ledger-list',
  rebaseActBtn: 'rebase-act-btn',
  
  shuraWarningCard: 'shura-warning-card',
  supportingLeadsBlock: 'supporting-leads-block',
  supportingLeadsChips: 'supporting-leads-chips',
  
  gameGuideModal: 'game-guide-modal',
  closeGameGuideBtn: 'close-game-guide-btn',
  guideTabGameplayBtn: 'guide-tab-gameplay-btn',
  guideTabSystemBtn: 'guide-tab-system-btn',
  guideTabRosterBtn: 'guide-tab-roster-btn',
  guidePanelGameplay: 'guide-panel-gameplay',
  guidePanelSystem: 'guide-panel-system',
  guidePanelRoster: 'guide-panel-roster',
  searchRosterInput: 'search-roster-input',
  rosterGalleryList: 'roster-gallery-list',

  loadingOverlay: 'loading-overlay',
  loadingPhaseText: 'loading-phase-text',
  loadingProgressBar: 'loading-progress-bar',
  loadingText: 'loading-text',
  loadingSubtext: 'loading-subtext',
  abortGenerationBtn: 'abort-generation-btn',
  minimizeGenerationBtn: 'minimize-generation-btn',
  generationStatusDock: 'generation-status-dock',
  generationDockTitle: 'generation-dock-title',
  generationDockMeta: 'generation-dock-meta',
  restoreGenerationBtn: 'restore-generation-btn',
  dockAbortGenerationBtn: 'dock-abort-generation-btn',
  errorRecoveryBanner: 'error-recovery-banner',
  errorMessageText: 'error-message-text',
  retryTurnBtn: 'retry-turn-btn',
  dismissErrorBtn: 'dismiss-error-btn',

  feedbackModal: 'feedback-modal',
  closeFeedbackBtn: 'close-feedback-btn',
  cancelFeedbackBtn: 'cancel-feedback-btn',
  feedbackForm: 'feedback-form',
  feedbackCategory: 'feedback-category',
  feedbackContent: 'feedback-content',
  feedbackContact: 'feedback-contact',
  feedbackAttachDiagnostics: 'feedback-attach-diagnostics',
  submitFeedbackBtn: 'submit-feedback-btn',
  reportErrorBtn: 'report-error-btn'
};

const dom = new Proxy({}, {
  get: (target, prop) => {
    if (typeof prop !== 'string') return undefined;
    if (typeof document === 'undefined') return undefined;
    const mappedId = DOM_ID_MAP[prop];
    if (mappedId) {
      const el = document.getElementById(mappedId);
      if (el) return el;
    }
    const kebab = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
    return document.getElementById(kebab) || document.getElementById(prop) || null;
  }
});

// ==========================================
// 2.5 共用 UI 基礎設施 (Dialog / Toast / Modal a11y)
// ==========================================
/**
 * 線條 icon（取代 emoji）。圖示定義在 index.html 的 SVG 圖示表（<symbol id="i-…">）。
 * 只能用在 innerHTML／模板字串；textContent 與 <option> 文字無法顯示 SVG。
 */
function uiIcon(name, extraClass = '') {
  const key = name || 'sparkle';
  return `<svg class="ui-icon${extraClass ? ' ' + extraClass : ''}" aria-hidden="true"><use href="#i-${key}"></use></svg>`;
}


/**
 * 自訂對話框，取代原生 alert / confirm / prompt。
 * 原生對話框會凍結整頁、樣式與遊戲美術脫節，手機上還會顯示網域名稱，
 * 且 prompt() 在部分瀏覽器已被限制。
 * @returns {Promise<boolean|string|null>} alert → true；confirm → boolean；prompt → 字串或 null
 */
function showDialog(options = {}) {
  const {
    title = '提示',
    message = '',
    icon = 'sparkle',
    mode = 'alert',          // 'alert' | 'confirm' | 'prompt'
    confirmText = '確定',
    cancelText = '取消',
    tone = 'default',        // 'default' | 'danger'
    defaultValue = ''
  } = options;

  const root = document.getElementById('app-dialog');
  if (!root) {
    // 極端降級：對話框節點不存在時不可讓流程靜默中斷
    if (mode === 'confirm') return Promise.resolve(window.confirm(message));
    if (mode === 'prompt') return Promise.resolve(window.prompt(message, defaultValue));
    window.alert(message);
    return Promise.resolve(true);
  }

  const titleEl = document.getElementById('app-dialog-title');
  const msgEl = document.getElementById('app-dialog-message');
  const iconEl = document.getElementById('app-dialog-icon');
  const inputWrap = document.getElementById('app-dialog-input-wrap');
  const inputEl = document.getElementById('app-dialog-input');
  const confirmBtn = document.getElementById('app-dialog-confirm');
  const cancelBtn = document.getElementById('app-dialog-cancel');

  if (titleEl) titleEl.textContent = title;
  if (msgEl) msgEl.textContent = message;
  if (iconEl) iconEl.innerHTML = uiIcon(icon);
  if (confirmBtn) {
    confirmBtn.textContent = confirmText;
    confirmBtn.className = tone === 'danger'
      ? 'px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition cursor-pointer shadow-lg shadow-rose-900/30'
      : 'px-4 py-2 rounded-xl bg-brand-gold hover:bg-yellow-500 text-slate-950 text-xs font-black transition cursor-pointer shadow-lg shadow-brand-gold/10';
  }
  if (cancelBtn) {
    cancelBtn.textContent = cancelText;
    cancelBtn.style.display = mode === 'alert' ? 'none' : 'inline-flex';
  }
  if (inputWrap) inputWrap.style.display = mode === 'prompt' ? 'block' : 'none';
  if (inputEl) inputEl.value = defaultValue || '';

  const previouslyFocused = document.activeElement;
  root.style.display = 'flex';
  lockBodyScroll(true);

  return new Promise(resolve => {
    const settle = (result) => {
      root.style.display = 'none';
      confirmBtn?.removeEventListener('click', onConfirm);
      cancelBtn?.removeEventListener('click', onCancel);
      root.removeEventListener('keydown', onKeydown);
      root.removeEventListener('mousedown', onBackdrop);
      lockBodyScroll(false);
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
      resolve(result);
    };
    const onConfirm = () => settle(mode === 'prompt' ? (inputEl ? inputEl.value : '') : true);
    const onCancel = () => settle(mode === 'prompt' ? null : false);
    const onKeydown = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onCancel(); }
      else if (e.key === 'Enter' && mode !== 'alert') { e.preventDefault(); onConfirm(); }
      else trapFocusWithin(root, e);
    };
    const onBackdrop = (e) => { if (e.target === root) onCancel(); };

    confirmBtn?.addEventListener('click', onConfirm);
    cancelBtn?.addEventListener('click', onCancel);
    root.addEventListener('keydown', onKeydown);
    root.addEventListener('mousedown', onBackdrop);

    // 對話框開啟後把焦點移進來：prompt 進輸入框，其餘進主要按鈕
    deferFocus(() => {
      if (mode === 'prompt' && inputEl) { inputEl.focus(); inputEl.select(); }
      else confirmBtn?.focus();
    });
  });
}

/**
 * 在下一個事件循環把焦點移入浮層。
 * 不用 requestAnimationFrame：頁面未取得焦點（背景分頁、隱藏視窗）時 rAF
 * 會被節流甚至完全不觸發，導致焦點永遠不會移進對話框。
 */
function deferFocus(fn) {
  setTimeout(fn, 0);
}

/** 語意化捷徑 */
const notifyDialog = (message, title = '提示') => showDialog({ message, title });
const confirmDialog = (message, options = {}) =>
  showDialog(Object.assign({ message, title: '請確認', mode: 'confirm', icon: 'help' }, options));
const confirmDangerDialog = (message, options = {}) =>
  showDialog(Object.assign({ message, title: '危險操作', mode: 'confirm', icon: 'alert', tone: 'danger', confirmText: '我了解，繼續' }, options));
const promptDialog = (message, defaultValue = '', options = {}) =>
  showDialog(Object.assign({ message, defaultValue, title: '請輸入', mode: 'prompt', icon: 'pencil' }, options));

/** 背景捲動鎖定計數器（避免嵌套彈窗提早解鎖） */
let bodyScrollLockCount = 0;
function lockBodyScroll(shouldLock) {
  if (typeof document === 'undefined' || !document.body) return;
  bodyScrollLockCount = Math.max(0, bodyScrollLockCount + (shouldLock ? 1 : -1));
  document.body.style.overflow = bodyScrollLockCount > 0 ? 'hidden' : '';
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** 把 Tab 鍵鎖在容器內，避免焦點跑到背後的頁面 */
function trapFocusWithin(container, event) {
  if (!container || event.key !== 'Tab') return;
  const items = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR))
    .filter(el => el.offsetParent !== null || el === document.activeElement);
  if (items.length === 0) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

// 記住每個彈窗開啟前的焦點，關閉時歸還
const modalReturnFocus = new Map();

/** 開啟浮層：顯示、鎖背景捲動、移入焦點、掛上 Tab 鎖 */
function openOverlay(elementId, options = {}) {
  const el = document.getElementById(elementId);
  if (!el) return null;
  const { display = 'flex', focusSelector = null } = options;
  modalReturnFocus.set(elementId, document.activeElement);
  el.style.display = display;
  lockBodyScroll(true);
  if (!el._focusTrapBound) {
    el.addEventListener('keydown', (e) => trapFocusWithin(el, e));
    el._focusTrapBound = true;
  }
  deferFocus(() => {
    const target = (focusSelector && el.querySelector(focusSelector))
      || el.querySelector(FOCUSABLE_SELECTOR);
    if (target && typeof target.focus === 'function') target.focus();
  });
  return el;
}

/** 關閉浮層：隱藏、解除捲動鎖、歸還焦點 */
function closeOverlay(elementId) {
  const el = document.getElementById(elementId);
  if (!el || el.style.display === 'none') return;
  el.style.display = 'none';
  lockBodyScroll(false);
  const prev = modalReturnFocus.get(elementId);
  modalReturnFocus.delete(elementId);
  if (prev && typeof prev.focus === 'function' && document.body.contains(prev)) prev.focus();
}

function isOverlayOpen(elementId) {
  const el = document.getElementById(elementId);
  return !!el && el.style.display !== 'none' && el.style.display !== '';
}

// ==========================================
// 1. 初始化與事件綁定 (Initialization & Events)
// ==========================================

window.addEventListener('DOMContentLoaded', async () => {
  try { initTargetLeadSelectOptions(); } catch (e) { console.warn('initTargetLeadSelectOptions warn:', e); }
  try { setupEventListeners(); } catch (e) { console.warn('setupEventListeners warn:', e); }
  try { checkAuthAndInitUser(); } catch (e) { console.warn('checkAuthAndInitUser warn:', e); }
  try { loadSavedProfilePresetsIntoSelect(); } catch (e) { console.warn('loadSavedProfilePresetsIntoSelect warn:', e); }
  try { renderHomeRecentSaves(); } catch (e) { console.warn('renderHomeRecentSaves warn:', e); }
  try { restoreSavedStateFromStorage(); } catch (e) { console.warn('restoreSavedStateFromStorage warn:', e); }
  try { initializeUxControls(); } catch (e) { console.warn('initializeUxControls warn:', e); }
  try { updateHomeContinueCard(); } catch (e) { console.warn('updateHomeContinueCard warn:', e); }
  try { updateGenderedCopy(); } catch (e) { console.warn('updateGenderedCopy warn:', e); }
  try {
    updateCloudSyncBadge(
      (!state.token || state.token.startsWith('tok_local_')) ? 'local' : 'idle'
    );
  } catch (e) { console.warn('updateCloudSyncBadge warn:', e); }
});

/**
 * localStorage 安全寫入：配額耗盡（QuotaExceededError）時不再向外拋出，
 * 否則 appendChapterToHistory 等呼叫點會讓整個回合推進失敗、遊戲永久卡死。
 * 回傳是否寫入成功，並在失敗時提示玩家清理存檔。
 */
function safeLocalStorageSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err) {
    console.error('[Storage] 寫入 localStorage 失敗（' + key + '）:', err && err.name, err && err.message);
    if (!safeLocalStorageSet._warned) {
      safeLocalStorageSet._warned = true;
      try {
        notifyUser('本機儲存空間已滿，最新進度可能未保存。請至存檔庫刪除舊存檔後再繼續。', 'error', 8000);
      } catch (e) { /* notifyUser 尚未就緒時忽略 */ }
    }
    return false;
  }
}

function notifyUser(message, type = 'info', duration = 3200) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  const tone = type === 'success'
    ? 'border-emerald-500/60 bg-emerald-950/95 text-emerald-100'
    : type === 'error'
      ? 'border-rose-500/60 bg-rose-950/95 text-rose-100'
      : 'border-brand-gold/50 bg-brand-surface/95 text-slate-100';
  toast.className = `pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-2xl backdrop-blur-md ${tone}`;
  toast.setAttribute('role', type === 'error' ? 'alert' : 'status');

  const text = document.createElement('span');
  text.className = 'flex-1 leading-relaxed';
  text.textContent = message;
  toast.appendChild(text);

  // 可手動關閉：長訊息（如儲存空間警告）若在閱讀時自動消失，玩家就完全錯過了
  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'shrink-0 -mr-1 -mt-0.5 px-1.5 text-base leading-none opacity-60 hover:opacity-100 transition cursor-pointer';
  closeBtn.setAttribute('aria-label', '關閉通知');
  closeBtn.innerHTML = uiIcon('x');
  toast.appendChild(closeBtn);

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast-visible'));

  let dismissTimer = null;
  const dismiss = () => {
    if (dismissTimer) clearTimeout(dismissTimer);
    dismissTimer = null;
    toast.classList.remove('toast-visible');
    setTimeout(() => toast.remove(), 220);
  };
  const startTimer = () => {
    if (dismissTimer) clearTimeout(dismissTimer);
    dismissTimer = setTimeout(dismiss, duration);
  };

  closeBtn.addEventListener('click', dismiss);
  // 指標停留時暫停倒數，離開後重新計時
  toast.addEventListener('mouseenter', () => { if (dismissTimer) { clearTimeout(dismissTimer); dismissTimer = null; } });
  toast.addEventListener('mouseleave', startTimer);
  startTimer();
}

function setFormMessage(formName, message = '', type = 'error') {
  const el = document.getElementById(`${formName}-form-message`);
  if (!el) return;
  el.textContent = message;
  el.className = `form-message ${message ? 'is-visible' : ''} ${type === 'success' ? 'is-success' : 'is-error'}`;
}

const FONT_SIZE_MIN = 16;
const FONT_SIZE_MAX = 26;
const SPEED_LABELS = { instant: '立即顯示', fast: '快速', normal: '沉浸' };

/** 套用正文字級到 CSS 變數（style.css 的 .prose-tc 已改為讀取它） */
function applyReaderFontSize(px) {
  const clamped = Math.min(FONT_SIZE_MAX, Math.max(FONT_SIZE_MIN, Math.round(px)));
  state.fontSizePx = clamped;
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.style.setProperty('--reader-font-size', clamped + 'px');
    // 字級越大行高比例略降，避免大字時行距過鬆
    const ratio = clamped >= 22 ? 1.9 : clamped >= 19 ? 2.0 : 2.1;
    document.documentElement.style.setProperty('--reader-line-height', String(ratio));
  }
  safeLocalStorageSet('undercurrent_font_size', String(clamped));
  syncReadingPreferenceControls();
  return clamped;
}

function adjustReaderFontSize(delta) {
  const before = state.fontSizePx;
  const after = applyReaderFontSize((state.fontSizePx || 18) + delta);
  if (after === before) {
    notifyUser(delta > 0 ? '已是最大字級。' : '已是最小字級。', 'info', 2000);
  }
}

function setReadingSpeed(value) {
  if (!SPEED_LABELS[value]) return;
  state.typeSpeed = value;
  safeLocalStorageSet('undercurrent_type_speed', value);
  syncReadingPreferenceControls();
  notifyUser(`文字速度已切換為「${SPEED_LABELS[value]}」。`, 'success', 2400);
}

/** 抉擇區與選單抽屜有兩組相同的偏好控制項，任一改動都要同步另一組 */
function syncReadingPreferenceControls() {
  const px = state.fontSizePx || 18;
  ['font-size-display', 'drawer-font-size-display'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = px + 'px';
  });
  ['reading-speed-select', 'drawer-reading-speed-select'].forEach(id => {
    const el = document.getElementById(id);
    if (el && el.value !== state.typeSpeed) el.value = state.typeSpeed;
  });
}

/**
 * 自由行動輸入框自動增高。
 * 必須設下限：初始化時遊玩畫面仍是 display:none，scrollHeight 為 0，
 * 若直接套用會把高度壓到一行以下、裁掉 placeholder。
 */
const ACTION_INPUT_MIN_HEIGHT = 44;
const ACTION_INPUT_MAX_HEIGHT = 160;

function autoGrowActionInput() {
  const el = document.getElementById('custom-action-input');
  if (!el) return;
  // 空的時候一律用最小高度，不去信任量測結果。
  // Tailwind 由 CDN 在執行期產生樣式，DOMContentLoaded 當下 max-h/padding 等
  // 類別尚未生效，此時量到的 scrollHeight 會把高度鎖在上限 160px。
  if (!el.value) {
    el.style.height = ACTION_INPUT_MIN_HEIGHT + 'px';
    return;
  }
  el.style.height = 'auto';
  const needed = el.scrollHeight || ACTION_INPUT_MIN_HEIGHT;
  el.style.height = Math.min(Math.max(needed, ACTION_INPUT_MIN_HEIGHT), ACTION_INPUT_MAX_HEIGHT) + 'px';
}

function initializeUxControls() {
  // A4: 字級偏好先前只從 localStorage 讀進 state，既沒有 UI 也從未被套用
  applyReaderFontSize(state.fontSizePx || 18);

  ['reading-speed-select', 'drawer-reading-speed-select'].forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    sel.value = state.typeSpeed;
    sel.addEventListener('change', () => setReadingSpeed(sel.value));
  });

  [['font-size-up-btn', 1], ['drawer-font-size-up-btn', 1],
   ['font-size-down-btn', -1], ['drawer-font-size-down-btn', -1]].forEach(([id, dir]) => {
    document.getElementById(id)?.addEventListener('click', () => adjustReaderFontSize(dir * 1));
  });

  document.querySelectorAll('.password-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.target);
      if (!input) return;
      const shouldShow = input.type === 'password';
      input.type = shouldShow ? 'text' : 'password';
      button.textContent = shouldShow ? '隱藏' : '顯示';
      button.setAttribute('aria-label', shouldShow ? '隱藏密碼' : '顯示密碼');
    });
  });

  // F2: 量測 header 實際高度供遊玩狀態條的 sticky 定位使用，不再硬編 top-16
  const syncHeaderHeight = () => {
    const header = document.querySelector('header');
    if (header && document.documentElement) {
      document.documentElement.style.setProperty('--header-height', header.offsetHeight + 'px');
    }
  };
  syncHeaderHeight();
  window.addEventListener('resize', syncHeaderHeight);

  // F4: 自由行動輸入框自動增高
  const actionInput = document.getElementById('custom-action-input');
  if (actionInput) {
    actionInput.addEventListener('input', autoGrowActionInput);
    autoGrowActionInput();
  }

  syncReadingPreferenceControls();
}

function setGenerationBusy(isBusy) {
  state.isGenerating = isBusy;
  if (isBusy) showStreamingAbortControl(); else hideStreamingAbortControl();
  document.querySelectorAll('.game-action-control, #submit-custom-btn, #submit-spicy-btn, #gameplay-quick-save-btn, #rebase-act-btn').forEach(el => {
    el.disabled = isBusy;
    el.setAttribute('aria-disabled', String(isBusy));
  });
}

function initTargetLeadSelectOptions() {
  const select = document.getElementById('form-target-lead');
  if (!select) return;

  select.innerHTML = '';
  
  // 首選全勢力修羅場
  const shuraOpt = document.createElement('option');
  shuraOpt.value = '修羅場';
  shuraOpt.setAttribute('data-name', '修羅場');
  shuraOpt.textContent = '【全勢力修羅場】（13位男主隨劇情推進動態交鋒 · 多雄爭奪 · 極限拉扯）';
  select.appendChild(shuraOpt);

  // 13 位官方男主
  getOfficialLeadKeys().forEach(key => {
    const lead = OFFICIAL_DRIVE_CHARACTERS[key];
    const opt = document.createElement('option');
    opt.value = key;
    opt.setAttribute('data-name', lead.name);
    opt.textContent = `${key.split('_')[0]}. ${lead.name}（${lead.title} · ${lead.age}）`;
    select.appendChild(opt);
  });

  // 監聽主要攻略對象切換
  select.addEventListener('change', handleTargetLeadChange);
  handleTargetLeadChange();
}

function handleTargetLeadChange() {
  const select = dom.formTargetLead || document.getElementById('form-target-lead');
  const warningCard = dom.shuraWarningCard || document.getElementById('shura-warning-card');
  const supportingBlock = dom.supportingLeadsBlock || document.getElementById('supporting-leads-block');
  if (!select) return;

  const isShura = select.value === '修羅場';

  if (warningCard) {
    warningCard.style.display = isShura ? 'block' : 'none';
  }
  if (supportingBlock) {
    supportingBlock.style.display = isShura ? 'none' : 'block';
  }

  if (!isShura) {
    renderSupportingLeadsChips(select.value);
  }
}

function renderSupportingLeadsChips(primaryLeadKey) {
  const container = dom.supportingLeadsChips || document.getElementById('supporting-leads-chips');
  if (!container) return;

  container.innerHTML = '';

  getOfficialLeadKeys().forEach(key => {
    if (key === primaryLeadKey) return; // 排除主選對象
    const lead = OFFICIAL_DRIVE_CHARACTERS[key];

    const label = document.createElement('label');
    label.className = 'flex items-center gap-1.5 p-1.5 rounded-lg bg-brand-surface hover:bg-brand-surface/80 border border-brand-border/60 cursor-pointer transition select-none text-[11px] text-slate-300 hover:text-white';
    
    label.innerHTML = `
      <input type="checkbox" value="${key}" class="supporting-lead-cb w-3.5 h-3.5 accent-brand-gold rounded cursor-pointer">
      <span class="truncate font-serif font-bold text-slate-200">${lead.name}</span>
      <span class="text-[9px] text-slate-500 truncate font-sans">${key.split('_')[0]}</span>
    `;

    container.appendChild(label);
  });
}

/**
 * 切換首頁 (home) 與遊玩主介面 (gameplay) 視圖
 */
function switchView(viewName) {
  const homeView = document.getElementById('home-view') || dom.homeView;
  const gameplayView = document.getElementById('gameplay-view') || dom.gameplayView;

  if (viewName === 'home') {
    if (homeView) homeView.style.display = 'block';
    if (gameplayView) gameplayView.style.display = 'none';
    renderHomeRecentSaves();
    updateHomeContinueCard();
    if (typeof window !== 'undefined' && window.scrollTo) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else if (viewName === 'gameplay') {
    if (homeView) homeView.style.display = 'none';
    if (gameplayView) gameplayView.style.display = 'block';
    updateGameplayBreadcrumb();
    autoGrowActionInput();
    if (typeof window !== 'undefined' && window.scrollTo) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

function setupEventListeners() {
  function on(id, event, handler) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener(event, handler);
    }
  }

  try {
    // 導航視圖切換
    on('nav-home-btn', 'click', () => switchView('home'));
    on('header-home-btn', 'click', () => switchView('home'));
    on('back-to-home-btn', 'click', () => switchView('home'));
    on('drawer-home-btn', 'click', () => { closeDrawer(); switchView('home'); });

    // 首頁 4 大卡片
    on('home-new-game-btn', 'click', openCharacterCreationModal);
    on('home-continue-game-btn', 'click', handleContinueGame);
    on('home-open-saves-btn', 'click', openSaveArchiveModal);
    on('home-open-presets-btn', 'click', openProfileManagerModal);
    on('home-view-all-saves-btn', 'click', openSaveArchiveModal);
    on('home-open-guide-btn', 'click', () => openGameGuideModal('gameplay'));

    // 頂部導航列快捷鍵
    on('nav-saves-btn', 'click', openSaveArchiveModal);
    on('nav-presets-btn', 'click', openProfileManagerModal);
    on('nav-guide-btn', 'click', () => openGameGuideModal('gameplay'));
    on('mobile-nav-saves-btn', 'click', openSaveArchiveModal);

    // 抽屜內全功能導航
    on('drawer-gameplay-btn', 'click', () => { closeDrawer(); handleContinueGame(); });
    on('drawer-saves-btn', 'click', () => { closeDrawer(); openSaveArchiveModal(); });
    on('drawer-presets-btn', 'click', () => { closeDrawer(); openProfileManagerModal(); });
    on('drawer-guide-btn', 'click', () => { closeDrawer(); openGameGuideModal('gameplay'); });
    on('drawer-timeline-btn', 'click', () => {
      closeDrawer();
      if (!(state.chapterHistoryList || []).length) return notifyUser('目前還沒有劇情紀錄。', 'info');
      openChapterNav();
    });

    // 抽屜開關
    on('open-drawer-btn', 'click', openMenuDrawer);
    on('gameplay-drawer-btn', 'click', openDrawer);
    on('close-drawer-btn', 'click', closeDrawer);
    on('drawer-backdrop', 'click', closeDrawer);

    // 創角與人設表單彈窗
    on('close-modal-btn', 'click', closeCharacterCreationModal);
    on('cancel-char-creation-btn', 'click', closeCharacterCreationModal);
    on('char-creation-form', 'submit', handleCharacterCreationSubmit);
    on('submit-char-btn', 'click', (e) => {
      e.preventDefault();
      handleCharacterCreationSubmit(e);
    });
    on('profile-presets-select', 'change', (e) => loadProfilePresetIntoForm(e.target.value));
    on('randomize-profile-btn', 'click', randomizeProfileForm);
    on('creator-advanced-toggle', 'click', toggleCreatorAdvancedFields);
    on('save-current-profile-btn', 'click', saveCurrentFormAsPreset);
    on('open-profile-manager-btn', 'click', () => { closeCharacterCreationModal(); openProfileManagerModal(); });

    // 人設管理中心彈窗
    on('close-profile-manager-btn', 'click', closeProfileManagerModal);
    on('search-profile-input', 'input', renderProfileManagerList);
    on('export-profiles-btn', 'click', exportProfiles);
    on('import-profiles-input', 'change', importProfiles);

    // 存檔管理中心彈窗
    on('close-save-archive-btn', 'click', closeSaveArchiveModal);
    on('create-named-save-btn', 'click', () => createNamedSave(document.getElementById('new-save-name-input')?.value));
    on('search-save-input', 'input', renderSaveArchivesList);
    on('manual-cloud-sync-btn', 'click', () => syncStateToGoogleDriveCloud(state.saveState, state.chapterData, true));
    on('export-all-saves-btn', 'click', exportAllSaves);
    on('import-all-saves-input', 'change', importAllSaves);
    on('gameplay-quick-save-btn', 'click', handleQuickSave);
    on('gameplay-memory-btn', 'click', openMemoryCenter);
    on('close-memory-center-btn', 'click', closeMemoryCenter);
    on('close-memory-center-bottom-btn', 'click', closeMemoryCenter);
    on('fork-current-story-btn', 'click', createCurrentStoryFork);

        // 意見回饋與問題回報彈窗
    on('nav-feedback-btn', 'click', () => openFeedbackModal());
    on('drawer-feedback-btn', 'click', () => { closeDrawer(); openFeedbackModal(); });
    on('close-feedback-btn', 'click', closeFeedbackModal);
    on('cancel-feedback-btn', 'click', closeFeedbackModal);
    on('feedback-form', 'submit', handleFeedbackSubmit);

    // 遊戲指南與角色圖鑑彈窗
    on('close-game-guide-btn', 'click', closeGameGuideModal);
    on('guide-tab-gameplay-btn', 'click', () => switchGuideTab('gameplay'));
    on('guide-tab-system-btn', 'click', () => switchGuideTab('system'));
    on('guide-tab-roster-btn', 'click', () => switchGuideTab('roster'));
    on('search-roster-input', 'input', renderRosterGallery);

    // 自由行動提交
    on('submit-custom-btn', 'click', () => handleCustomActionSubmit('normal'));
    on('submit-spicy-btn', 'click', () => handleCustomActionSubmit('spicy'));
    const customInputEl = document.getElementById('custom-action-input');
    if (customInputEl) {
      customInputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
          e.preventDefault();
          // Enter 走一般鏈；情慾章節需明確按「開車」，避免誤觸昂貴／露骨模型。
          handleCustomActionSubmit('normal');
        }
      });
    }

    // 帳號認證
    on('tab-login-btn', 'click', () => switchAuthTab('login'));
    on('tab-register-btn', 'click', () => switchAuthTab('register'));
    on('login-form', 'submit', handleLogin);
    on('register-form', 'submit', handleRegister);
    on('logout-btn', 'click', handleLogout);
    on('home-logout-btn', 'click', handleLogout);
    on('home-delete-account-btn', 'click', handleDeleteAccount);
    on('home-clear-all-data-btn', 'click', handleClearAllData);

    // 中止與錯誤救援
    on('abort-generation-btn', 'click', handleAbortGeneration);
    on('dock-abort-generation-btn', 'click', handleAbortGeneration);
    on('minimize-generation-btn', 'click', minimizeGenerationOverlay);
    on('restore-generation-btn', 'click', restoreGenerationOverlay);
    on('retry-turn-btn', 'click', handleRetryLastTurn);
    on('report-error-btn', 'click', reportGenerationFailure);
    on('dismiss-error-btn', 'click', dismissError);
    on('rebase-act-btn', 'click', handleActRebase);

    // ── 拆分後的兩個抽屜 ──
    on('mobile-menu-btn', 'click', openMenuDrawer);
    on('close-menu-drawer-btn', 'click', closeDrawer);
    on('drawer-logout-btn', 'click', () => { closeDrawer(); handleLogout(); });
    on('drawer-clear-all-data-btn', 'click', () => { closeDrawer(); handleClearAllData(); });
    on('drawer-delete-account-btn', 'click', () => { closeDrawer(); handleDeleteAccount(); });
    on('drawer-cloud-load-btn', 'click', () => { closeDrawer(); loadStateFromCloud(); });
    on('drawer-reload-lore-btn', 'click', handleReloadLore);
    on('home-open-account-btn', 'click', openMenuDrawer);

    // ── A3: 雲端讀檔入口（先前只掛在 window 上，沒有任何按鈕） ──
    on('cloud-load-btn', 'click', loadStateFromCloud);

    // ── B1: 同步徽章點擊即手動同步 ──
    on('cloud-sync-status-badge', 'click', () => syncStateToGoogleDriveCloud(state.saveState, state.chapterData, true));

    // ── C2/A2: 底部浮動閱讀控制 ──
    on('skip-typewriter-fab', 'click', () => { state.skipTypewriterTriggered = true; });
    on('abort-streaming-fab', 'click', handleAbortGeneration);
    on('back-to-latest-fab', 'click', () => {
      document.getElementById('active-chapter-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // ── C4: 章節目錄 ──
    on('chapter-nav-btn', 'click', openChapterNav);
    on('close-chapter-nav-btn', 'click', closeChapterNav);
    document.getElementById('chapter-nav-panel')?.addEventListener('mousedown', (e) => {
      if (e.target.id === 'chapter-nav-panel') closeChapterNav();
    });
    window.addEventListener('scroll', updateBackToLatestFab, { passive: true });

    // ── G5: 換窗建議橫幅 ──
    on('rebase-suggestion-action-btn', 'click', () => { dismissRebaseSuggestion(); handleActRebase(); });
    on('rebase-suggestion-dismiss-btn', 'click', dismissRebaseSuggestion);

    // ── E3: Esc 逐層關閉（含先前漏掉的意見回饋彈窗），一次只關最上層 ──
    window.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      // 自訂對話框自行處理 Esc，層級最高
      if (isOverlayOpen('app-dialog')) return;
      const layers = [
        ['chapter-nav-panel', closeChapterNav],
        ['memory-center-modal', closeMemoryCenter],
        ['feedback-modal', closeFeedbackModal],
        ['game-guide-modal', closeGameGuideModal],
        ['save-archive-modal', closeSaveArchiveModal],
        ['profile-manager-modal', closeProfileManagerModal],
        ['character-creation-modal', closeCharacterCreationModal]
      ];
      for (const [id, close] of layers) {
        if (isOverlayOpen(id)) { close(); return; }
      }
      if (openDrawerKind) { closeDrawer(); return; }
    });

    // ── E5: 選項鍵盤快捷鍵（A/B/C 與 1/2/3），桌機玩家不必再全程用滑鼠 ──
    window.addEventListener('keydown', (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.isComposing) return;
      const tag = (e.target?.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (state.isGenerating) return;
      // 任何浮層開著時不攔鍵盤
      if (openDrawerKind || ['app-dialog', 'chapter-nav-panel', 'memory-center-modal', 'feedback-modal', 'game-guide-modal',
           'save-archive-modal', 'profile-manager-modal', 'character-creation-modal', 'auth-modal']
           .some(isOverlayOpen)) return;

      // 空白鍵／Enter：正文播放中則跳過
      if (state.isTyping && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        state.skipTypewriterTriggered = true;
        return;
      }

      const key = e.key.toUpperCase();
      let idx = -1;
      if (key >= 'A' && key <= 'C') idx = key.charCodeAt(0) - 65;
      else if (key >= '1' && key <= '3') idx = Number(key) - 1;
      if (idx < 0) return;

      const btn = document.querySelector(`.choice-option-btn[data-choice-index="${idx}"]`);
      if (btn && !btn.disabled) {
        e.preventDefault();
        btn.click();
      }
    });

  } catch (err) {
    console.error('[Setup Events Error]', err);
  }
}

function updateGameplayBreadcrumb() {
  if (!dom.gameplayBreadcrumb) return;
  const act = state.saveState?.meta?.currentAct || 1;
  const turn = state.saveState?.turnCount || 1;
  const leadName = state.saveState?.meta?.playerProfile?.targetLeadName || '修羅場';
  dom.gameplayBreadcrumb.textContent = `${formatActTurn(act, turn)} ｜ ${leadName}`;
  updateRebaseSuggestion();
  updateGenderedCopy();
  updateBackToLatestFab();
}

/**
 * 抽屜拆成兩個：狀態面板（角色數值）與功能選單（導覽＋閱讀偏好＋帳號）。
 * 先前兩者混在同一個抽屜，玩家遊玩中想查好感度會撞見一整排導覽項，
 * 想改設定又得先滑過一大片數值。
 */
const DRAWER_IDS = { status: 'side-drawer', menu: 'menu-drawer' };
let openDrawerKind = null;

function openDrawerPanel(kind) {
  const backdrop = document.getElementById('drawer-backdrop');
  const panel = document.getElementById(DRAWER_IDS[kind]);
  if (!panel || !backdrop) return;

  // 一次只開一個：另一個若開著先收起
  Object.entries(DRAWER_IDS).forEach(([k, id]) => {
    if (k !== kind) document.getElementById(id)?.classList.add('translate-x-full');
  });

  if (!openDrawerKind) lockBodyScroll(true);
  modalReturnFocus.set(DRAWER_IDS[kind], document.activeElement);
  openDrawerKind = kind;

  backdrop.classList.remove('opacity-0', 'pointer-events-none');
  panel.classList.remove('translate-x-full');

  if (!panel._focusTrapBound) {
    panel.addEventListener('keydown', (e) => trapFocusWithin(panel, e));
    panel._focusTrapBound = true;
  }
  if (kind === 'status') renderSaveState();
  if (kind === 'menu') { syncReadingPreferenceControls(); renderLoreStatus(); }

  deferFocus(() => { panel.querySelector(FOCUSABLE_SELECTOR)?.focus(); });
}

function closeDrawer() {
  const backdrop = document.getElementById('drawer-backdrop');
  if (backdrop) backdrop.classList.add('opacity-0', 'pointer-events-none');
  Object.values(DRAWER_IDS).forEach(id => {
    document.getElementById(id)?.classList.add('translate-x-full');
  });
  if (openDrawerKind) {
    lockBodyScroll(false);
    const prev = modalReturnFocus.get(DRAWER_IDS[openDrawerKind]);
    modalReturnFocus.delete(DRAWER_IDS[openDrawerKind]);
    if (prev && typeof prev.focus === 'function' && document.body.contains(prev)) prev.focus();
  }
  openDrawerKind = null;
}

// 向後兼容：openDrawer() 一律開啟狀態面板
function openDrawer() { openDrawerPanel('status'); }
function openStatusDrawer() { openDrawerPanel('status'); }
function openMenuDrawer() { openDrawerPanel('menu'); }

// ==========================================
// 3. 帳號門禁與認證管理 (Authentication)
// ==========================================

const LOCAL_DATA_OWNER_KEY = 'undercurrent_local_data_owner';
const LOCAL_USER_DATA_KEYS = [
  'undercurrent_current_save_state',
  'undercurrent_full_story_chapters',
  'undercurrent_current_player_profile',
  'undercurrent_named_saves',
  'undercurrent_custom_profiles',
  'undercurrent_save_slot_1'
];

function scopedLocalKey(userId, key) {
  return `undercurrent_scope_${encodeURIComponent(String(userId || 'anonymous'))}_${key}`;
}

function archiveCurrentLocalScope(userId) {
  if (!userId) return;
  LOCAL_USER_DATA_KEYS.forEach(key => {
    const value = localStorage.getItem(key);
    const scopedKey = scopedLocalKey(userId, key);
    if (value === null) localStorage.removeItem(scopedKey);
    else safeLocalStorageSet(scopedKey, value);
  });
}

function restoreLocalScope(userId) {
  LOCAL_USER_DATA_KEYS.forEach(key => {
    const value = localStorage.getItem(scopedLocalKey(userId, key));
    if (value === null) localStorage.removeItem(key);
    else safeLocalStorageSet(key, value);
  });
}

function refreshRuntimeFromLocalScope() {
  state.saveState = null;
  state.chapterData = null;
  state.chapterHistoryList = [];
  state.playerProfile = null;
  restoreSavedStateFromStorage();
  loadSavedProfilePresetsIntoSelect();
  renderHomeRecentSaves();
  updateHomeContinueCard();
}

function switchLocalUserScope(nextUserId) {
  if (!nextUserId) return;
  const owner = localStorage.getItem(LOCAL_DATA_OWNER_KEY);
  if (!owner) {
    // 升級前的既有本機資料歸屬目前已登入帳號；之後每次切換都會隔離。
    safeLocalStorageSet(LOCAL_DATA_OWNER_KEY, nextUserId);
    return;
  }
  if (owner === nextUserId) return;
  archiveCurrentLocalScope(owner);
  restoreLocalScope(nextUserId);
  safeLocalStorageSet(LOCAL_DATA_OWNER_KEY, nextUserId);
  refreshRuntimeFromLocalScope();
}

function clearCurrentLocalUserData(userId = localStorage.getItem(LOCAL_DATA_OWNER_KEY)) {
  LOCAL_USER_DATA_KEYS.forEach(key => {
    localStorage.removeItem(key);
    if (userId) localStorage.removeItem(scopedLocalKey(userId, key));
  });
}

async function checkAuthAndInitUser() {
  const storedUser = localStorage.getItem('undercurrent_user_name');
  const storedToken = localStorage.getItem('undercurrent_auth_token');
  
  if (!storedUser || !storedToken) {
    updateUserBadgeUI('logged-out');
    openAuthModal();
    return;
  }

  state.username = storedUser;
  state.token = storedToken;
  state.userId = localStorage.getItem('undercurrent_user_id') || ('usr_' + Date.now());
  switchLocalUserScope(state.userId);
  state.driveFolderId = localStorage.getItem('undercurrent_drive_folder_id') || '';
  updateUserBadgeUI();
  closeAuthModal();

  // 本機離線憑證不是雲端可驗證的 token；保留本機工作階段，避免重新整理後被誤判為過期。
  if (storedToken.startsWith('tok_local_')) {
    updateUserBadgeUI('offline');
    return;
  }

  // Background token verification (non-blocking)
  try {
    const res = await fetch(state.gasApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'auth/verify', token: storedToken, userId: state.userId }),
      redirect: 'follow'
    });
    const data = await res.json();
    if (data.success && data.data) {
      state.driveFolderId = data.data.driveFolderId || state.driveFolderId;
      if (state.driveFolderId) safeLocalStorageSet('undercurrent_drive_folder_id', state.driveFolderId);
      console.log('[Auth] Token verified with cloud backend.');
      updateUserBadgeUI('active');
    } else {
      console.warn('[Auth] Token verification failed; clearing the expired session.');
      clearAuthSession();
      updateUserBadgeUI('expired');
      openAuthModal();
    }
  } catch (err) {
    console.warn('[Auth] Cloud verification skipped (offline or unavailable):', err.message);
    updateUserBadgeUI('offline');
  }
}

function openAuthModal() {
  openOverlay('auth-modal', { focusSelector: '#login-username' });
}

function closeAuthModal() {
  closeOverlay('auth-modal');
}

function clearAuthSession() {
  localStorage.removeItem('undercurrent_auth_token');
  localStorage.removeItem('undercurrent_user_name');
  localStorage.removeItem('undercurrent_user_id');
  localStorage.removeItem('undercurrent_drive_folder_id');
  state.username = '';
  state.token = '';
  state.userId = '';
  state.driveFolderId = '';
}

function switchAuthTab(tab) {
  if (tab === 'login') {
    if (dom.tabLoginBtn) dom.tabLoginBtn.className = 'flex-1 py-2.5 rounded-md bg-brand-gold text-slate-950 transition cursor-pointer font-bold';
    if (dom.tabRegisterBtn) dom.tabRegisterBtn.className = 'flex-1 py-2.5 rounded-md text-slate-400 hover:text-white transition cursor-pointer font-bold';
    if (dom.loginForm) dom.loginForm.style.display = 'block';
    if (dom.registerForm) dom.registerForm.style.display = 'none';
  } else {
    if (dom.tabLoginBtn) dom.tabLoginBtn.className = 'flex-1 py-2.5 rounded-md text-slate-400 hover:text-white transition cursor-pointer font-bold';
    if (dom.tabRegisterBtn) dom.tabRegisterBtn.className = 'flex-1 py-2.5 rounded-md bg-emerald-500 text-slate-950 transition cursor-pointer font-bold';
    if (dom.loginForm) dom.loginForm.style.display = 'none';
    if (dom.registerForm) dom.registerForm.style.display = 'block';
  }
}


/**
 * 非同步同步真實遊戲存檔至 Google Drive (Player_Saves) 與 Google Sheets (Master_Index)
 */
let cloudWriteChain = Promise.resolve();
let cloudWriteRevision = 0;

async function syncStateToGoogleDriveCloud(saveStateObj, chapterDataObj, isManual = false, historyList = state.chapterHistoryList) {
  const saveState = saveStateObj || state.saveState;
  const chapterData = chapterDataObj || state.chapterData;
  const playerProfile = saveState?.meta?.playerProfile || state.playerProfile;

  if (!saveState && !chapterData) {
    if (isManual) notifyUser('目前尚無進行中的遊戲進度可同步至雲端。', 'error');
    return;
  }

  if (!state.token || state.token.startsWith('tok_local_')) {
    updateCloudSyncBadge('local');
    if (isManual) notifyUser('您目前為本機模式，請先使用雲端帳號登入後再同步。', 'error');
    return;
  }

  updateCloudSyncBadge('syncing');
  const revision = ++cloudWriteRevision;
  const syncToken = state.token;
  const syncUrl = state.gasApiUrl;

  try {
    const email = state.username ? (state.username.includes('@') ? state.username : `${state.username}@undercurrent.game`) : 'player@undercurrent.game';
    const payload = {
      action: 'novel/save-state',
      token: state.token || 'tok_player_' + (state.userId || 'guest'),
      userId: state.userId || 'usr_player',
      email: email,
      saveState: saveState,
      chapter: chapterData,
      playerProfile: playerProfile,
      // 只帶最近視窗，不再每回合整份上傳（完整正文由後端 Full_Novel.md 累積歸檔）
      chapterHistory: chapterWindow(historyList),
      namedSaves: getNamedSavesList()
    };

    // 不記錄整個 payload：其中含有 session token。
    console.log('[Cloud Sync] Transmitting live game data to Google Drive...', {
      turnCount: saveState && saveState.turnCount,
      chapters: (state.chapterHistoryList || []).length,
      namedSaves: payload.namedSaves.length
    });

    // Capture the complete payload now, then serialize writes so older requests
    // cannot finish after newer progress and overwrite it in Drive.
    const body = JSON.stringify(payload);
    const pending = cloudWriteChain.catch(() => {}).then(async () => {
      if (state.token !== syncToken) return null;
      const res = await fetch(syncUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body,
        redirect: 'follow'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    });
    cloudWriteChain = pending.catch(() => {});
    const data = await pending;
    if (!data || state.token !== syncToken || revision !== cloudWriteRevision) return;

    if (data.success) {
      console.log('[Cloud Sync] Successfully synchronized to Google Drive.');
      updateCloudSyncBadge('synced', new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false }));
      if (isManual) {
        notifyUser('雲端同步完成，遊戲進度已儲存。', 'success');
      }
    } else {
      console.warn('[Cloud Sync] Backend returned error:', data.error);
      updateCloudSyncBadge('failed');
      if (isManual) {
        notifyUser('雲端同步失敗：' + (data.error?.message || '伺服器回應異常') + '（進度已保存於本機）', 'error', 6000);
      }
    }
  } catch (err) {
    console.warn('[Cloud Sync] Sync failed:', err.message);
    if (state.token !== syncToken || revision !== cloudWriteRevision) return;
    updateCloudSyncBadge('failed');
    if (isManual) {
      notifyUser('雲端伺服器暫時無法連線，進度已保存於本機。', 'error', 6000);
    }
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const pass = document.getElementById('login-password').value.trim();
  setFormMessage('login');
  if (!username || !pass) {
    setFormMessage('login', '請輸入帳號與密碼。');
    return;
  }

  const email = username.includes('@') ? username : `${username}@undercurrent.game`;
  const submitBtn = document.querySelector('#login-form button[type="submit"]');
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '登入中...'; }

  try {
    const res = await fetch(state.gasApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'auth/login', email: email, password: pass }),
      redirect: 'follow'
    });
    const data = await res.json();
    if (data.success && data.data && data.data.token) {
      switchLocalUserScope(data.data.userId);
      state.username = username;
      state.token = data.data.token;
      state.userId = data.data.userId;
      state.driveFolderId = data.data.driveFolderId || '';
      safeLocalStorageSet('undercurrent_user_name', state.username);
      safeLocalStorageSet('undercurrent_auth_token', state.token);
      safeLocalStorageSet('undercurrent_user_id', state.userId);
      if (state.driveFolderId) safeLocalStorageSet('undercurrent_drive_folder_id', state.driveFolderId);
      updateUserBadgeUI();
      updateCloudSyncBadge('idle');
      closeAuthModal();
      notifyUser('歡迎回來，' + username + '！', 'success');
    } else {
      setFormMessage('login', data.error?.message || '帳號或密碼錯誤，請重新輸入。');
    }
  } catch (err) {
    console.error('[Login Error]', err);
    // Fallback to local-only mode
    state.username = username;
    state.token = 'tok_local_' + Date.now();
    state.userId = 'usr_' + btoa(encodeURIComponent(username)).slice(0, 12);
    switchLocalUserScope(state.userId);
    safeLocalStorageSet('undercurrent_user_name', state.username);
    safeLocalStorageSet('undercurrent_auth_token', state.token);
    safeLocalStorageSet('undercurrent_user_id', state.userId);
    updateUserBadgeUI();
    updateCloudSyncBadge('local');
    closeAuthModal();
    notifyUser('雲端暫時無法連線，已以本機模式進入。', 'info', 5000);
  } finally {
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = '登入'; }
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('reg-username').value.trim();
  const pass = document.getElementById('reg-password').value.trim();
  setFormMessage('register');
  if (!username || !pass || pass.length < 6) {
    setFormMessage('register', '請輸入完整帳號與至少 6 碼密碼。');
    return;
  }

  const email = username.includes('@') ? username : `${username}@undercurrent.game`;
  const submitBtn = document.querySelector('#register-form button[type="submit"]');
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '註冊中...'; }

  try {
    const res = await fetch(state.gasApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'auth/register', email: email, password: pass }),
      redirect: 'follow'
    });
    const data = await res.json();
    if (data.success && data.data && data.data.token) {
      switchLocalUserScope(data.data.userId);
      state.username = username;
      state.token = data.data.token;
      state.userId = data.data.userId;
      state.driveFolderId = data.data.driveFolderId || '';
      safeLocalStorageSet('undercurrent_user_name', state.username);
      safeLocalStorageSet('undercurrent_auth_token', state.token);
      safeLocalStorageSet('undercurrent_user_id', state.userId);
      if (state.driveFolderId) safeLocalStorageSet('undercurrent_drive_folder_id', state.driveFolderId);
      updateUserBadgeUI();
      updateCloudSyncBadge('idle');
      closeAuthModal();
      notifyUser('註冊成功！歡迎踏入《暗流》，' + username + '。', 'success');
    } else {
      setFormMessage('register', data.error?.message || '伺服器回應異常，請稍後再試。');
    }
  } catch (err) {
    console.error('[Register Error]', err);
    setFormMessage('register', '無法連線至雲端伺服器，請檢查網路或稍後再試。');
  } finally {
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = '立即註冊'; }
  }
}

async function handleLogout() {
  const ok = await confirmDialog('登出後需要重新輸入帳號密碼才能繼續遊玩。\n本機已保存的進度不會被刪除。', {
    title: '登出帳號',
    confirmText: '登出'
  });
  if (!ok) return;
  clearAuthSession();
  updateUserBadgeUI();
  openAuthModal();
}

async function handleDeleteAccount() {
  const acknowledged = await confirmDangerDialog(
    '註銷帳號會永久抹除您的身分、雲端全部存檔與小說正文，且無法復原。\n\n下一步將請您輸入帳號名稱以確認。',
    { title: '註銷帳號', confirmText: '我了解，繼續' }
  );
  if (!acknowledged) return;

  const confirmName = await promptDialog(
    '請輸入您的帳號名稱「' + state.username + '」以完成註銷：',
    '',
    { title: '最終確認', icon: 'alert', confirmText: '永久註銷', tone: 'danger' }
  );
  if (confirmName === null) return;

  if (confirmName.trim() === state.username) {
    try {
      const response = await fetch(state.gasApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'auth/delete-account', token: state.token, userId: state.userId }),
        redirect: 'follow'
      });
      const data = await response.json();
      if (!data.success || !data.data?.deleted) {
        throw new Error(data.error?.message || '雲端未確認完成註銷');
      }
    } catch (err) {
      console.error('[Delete Account] Failed:', err);
      notifyUser('註銷失敗，帳號與本機資料保留不變：' + err.message, 'error', 6000);
      return;
    }
    const deletedUserId = state.userId;
    clearCurrentLocalUserData(deletedUserId);
    clearAuthSession();
    await notifyDialog('您的帳號及所有檔案已全數註銷刪除。', '註銷完成');
    location.reload();
  } else {
    notifyUser('輸入名稱不相符，已取消註銷操作。', 'error', 5000);
  }
}

async function handleClearAllData() {
  const ok = await confirmDangerDialog(
    '將清空本機的當前進度、章節正文與具名存檔清單。\n已同步至雲端的檔案不受影響。',
    { title: '清空本機存檔', confirmText: '清空本機資料' }
  );
  if (ok) {
    clearCurrentLocalUserData();
    state.saveState = null;
    state.chapterData = null;
    state.chapterHistoryList = [];
    state.playerProfile = null;
    notifyUser('本機存檔資料已清空重置。', 'success');
    location.reload();
  }
}

/**
 * 從雲端載入存檔（跨裝置接續遊玩）
 */
async function loadStateFromCloud() {
  if (state.isGenerating) return notifyUser('生成進行中，請先完成或中止本回。', 'info');
  const loadToken = state.token;
  const loadState = state.saveState;
  const loadHistory = JSON.stringify(state.chapterHistoryList || []);
  if (!state.token || state.token.startsWith('tok_local_')) {
    notifyUser('您目前為本機模式，請先使用雲端帳號登入後再載入雲端存檔。', 'error', 5000);
    return;
  }

  try {
    const res = await fetch(state.gasApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'novel/load-state',
        token: state.token,
        userId: state.userId
      }),
      redirect: 'follow'
    });
    const data = await res.json();
    if (state.token !== loadToken || state.saveState !== loadState || state.isGenerating
      || JSON.stringify(state.chapterHistoryList || []) !== loadHistory) return;
    if (data.success && data.data) {
      const cloudSave = data.data;
      if (cloudSave.saveState) {
        state.saveState = cloudSave.saveState;
        state.playerProfile = cloudSave.saveState?.meta?.playerProfile || null;
        safeLocalStorageSet('undercurrent_current_save_state', JSON.stringify(cloudSave.saveState));
      }
      if (cloudSave.chapter) {
        state.chapterData = cloudSave.chapter;
        const cloudHistory = Array.isArray(cloudSave.chapterHistory) && cloudSave.chapterHistory.length > 0
          ? cloudSave.chapterHistory
          : [cloudSave.chapter];
        state.chapterHistoryList = cloudHistory;
        persistChapterHistory(cloudHistory);
      } else if (cloudSave.saveState) {
        // 雲端有存檔但沒有章節：必須清空本機舊章節，否則會把別局的正文與
        // 雲端的 turnCount 混在一起顯示。
        state.chapterData = null;
        state.chapterHistoryList = [];
        persistChapterHistory([]);
        notifyUser('雲端僅有數值存檔、無章節正文，已載入進度數值。', 'info', 5000);
      }
      if (state.chapterData) {
        state.previousStateSnapshot = null;
        state.lastChoicePayload = null;
        renderStoryStream(state.chapterData);
        renderSaveState();
        updateGameplayBreadcrumb();
      }
      notifyUser('雲端存檔已成功載入，可以繼續遊玩。', 'success');
      console.log('[Cloud Load] State loaded from Google Drive.');
    } else {
      notifyUser('雲端無可用存檔，或讀取失敗：' + (data.error?.message || '無資料'), 'error', 5000);
    }
  } catch (err) {
    console.error('[Cloud Load] Failed:', err);
    notifyUser('無法從雲端載入存檔：' + err.message, 'error', 5000);
  }
}

if (typeof window !== 'undefined') {
  window.loadStateFromCloud = loadStateFromCloud;
}

function updateUserBadgeUI(status = 'active') {
  const authenticated = Boolean(state.username && state.token) && status !== 'logged-out';
  if (dom.userBadge) dom.userBadge.style.display = authenticated ? '' : 'none';
  const cloudBadge = document.getElementById('cloud-sync-status-badge');
  if (cloudBadge) cloudBadge.style.display = authenticated ? '' : 'none';

  const name = state.username || '未登入';
  let displayText = name;
  let colorClass = 'text-brand-gold';
  
  if (status === 'expired') {
    displayText = name + '（已過期）';
    colorClass = 'text-red-400';
  } else if (status === 'offline') {
    displayText = name + '（離線）';
    colorClass = 'text-gray-400';
  }

  const updateEl = (el) => {
    if (!el) return;
    el.textContent = displayText;
    el.classList.remove('text-brand-gold', 'text-red-400', 'text-gray-400');
    el.classList.add(colorClass);
    
    if (status === 'expired') {
      el.style.cursor = 'pointer';
      el.onclick = openAuthModal;
      el.title = '點擊重新登入以啟用雲端同步';
    } else {
      el.style.cursor = '';
      el.onclick = null;
      el.title = '';
    }
  };

  updateEl(dom.usernameDisplay);
  updateEl(dom.homeUsernameDisplay);
}

// =========================================================================
// 4. 純 AI 即時零範本生成引擎 (Pure Real-Time AI Generation Engine)
// =========================================================================

// 經 tools/probe-model-latitude.js 與 22k tokens 真實條件測試後留下的模型。
// 已淘汰：gemini 系列（會自我審查、且 3.7-flash 有 60% 機率被靜默降級）、
// dolphin-venice（長上下文下語意崩壞）、minimax/glm（拒絕 R-18 或輸出簡體）。
/**
 * 生成模式。玩家在輸入列上以兩顆按鍵明確指定本回合要走哪條鏈：
 *  - normal：一般敘事。成本極低、上下文極長，負責絕大多數回合。
 *  - spicy ：情慾章節。走不自我審查的模型，避免被拒生成。
 * 之所以由玩家指定而非自動偵測：自動偵測一旦誤判，玩家看到的是
 * 「文風忽然變保守」或「白白多花一次請求」，兩者都比多按一顆鍵糟。
 */
const GENERATION_MODES = {
  normal: {
    label: '一般',
    PRIMARY_MODEL: 'deepseek/deepseek-v4-flash-0731',
    PRIMARY_MAX_ATTEMPTS: 2,
    FALLBACK_MAX_ATTEMPTS: 2,
    FALLBACK_MODELS: ['qwen/qwen3-235b-a22b-2507']
  },
  spicy: {
    label: '露骨',
    // 2026-10-06 對比（4 位男主 × 2 組，Sonnet 盲評）：hy3 勝 6／7，文筆 3.7 vs 2.1、
    // 像角色 4.0 vs 2.4，速度穩定 13–33 秒；qwen3-30b 比喻過密、人稱混亂、會亂加設定。
    // hy3 每回約 0.0019 美元。
    PRIMARY_MODEL: 'tencent/hy3',
    PRIMARY_MAX_ATTEMPTS: 2,
    FALLBACK_MAX_ATTEMPTS: 2,
    // 2026-10-07 短篇比較：minimax-m3 文學性與角色演繹最好、露骨完整，取代 qwen3-30b 當備援
    FALLBACK_MODELS: ['minimax/minimax-m3']
  }
};
const DEFAULT_GENERATION_MODE = 'normal';

/**
 * 功能開關。
 * favorability：好感度系統（2026-10-05 依作者指示暫時移除）。關閉時提示詞不再要求模型計算好感度、
 * 不再累積與顯示好感度；程式碼保留，改回 true 即可恢復。
 */
const FEATURES = {
  favorability: false
};

const NARRATIVE_MODELS = Object.values(GENERATION_MODES).flatMap(m => [
  m.PRIMARY_MODEL,
  ...m.FALLBACK_MODELS.map(e => (typeof e === 'string' ? e : e.model))
]);

const LLM_CONFIG = {
  WORKER_URL: 'https://tjpr-llm-proxy.todashinchi.workers.dev/',
  // 連續多久收不到新資料才判定該模型失敗並切換備援。
  // 這是「停滯」門檻，不是總時長上限 —— 正在正常吐字的串流不會被中斷。
  FIRST_BYTE_TIMEOUT_MS: 120000,
  STALL_TIMEOUT_MS: 25000,
  API_URL: 'https://openrouter.ai/api/v1/chat/completions',
  API_KEY: '', // 安全起見，金鑰只存在 Worker secret 與 GAS Proxy
  MODES: GENERATION_MODES,
  // 相容欄位：未指定模式時視同一般敘事。
  PRIMARY_MODEL: GENERATION_MODES[DEFAULT_GENERATION_MODE].PRIMARY_MODEL,
  FALLBACK_MODEL: (() => {
    const first = GENERATION_MODES[DEFAULT_GENERATION_MODE].FALLBACK_MODELS[0];
    return typeof first === 'string' ? first : first.model;
  })(),
  PRIMARY_MAX_ATTEMPTS: GENERATION_MODES[DEFAULT_GENERATION_MODE].PRIMARY_MAX_ATTEMPTS,
  FALLBACK_MODELS: GENERATION_MODES[DEFAULT_GENERATION_MODE].FALLBACK_MODELS,
  // 會自我審查的模型（供 warnIfCensoringModel 判斷）。
  // 目前鏈上四顆實測皆能寫出 L4 露骨描寫，故此清單為空。
  //  - gemma-4-26b：原本預期它會與 gemini 同源而自我審查，實測 L1–L4 全過，
  //    因此不列入 —— 誤列會讓玩家每次落備援都看到不實的「文風變保守」警告。
  //  - minimax-m3：約半數機率拒絕，但那是「不穩定」而非「必定審查」，
  //    由 detectRefusal 當場接手切換即可，不需事前警告。
  CENSORING_MODELS: [],
  MODELS: NARRATIVE_MODELS,
  // 摘要池（長期記憶）用的模型。必須在 Worker 與 GAS 白名單內 ——
  // 先前寫死的 aion-3.0-mini 在遷移到 OpenRouter 後不在白名單，摘要每次都被拒，
  // 而錯誤被靜默吞掉，長期記憶因此停止更新。
  SUMMARY_MODEL: 'deepseek/deepseek-v4-flash-0731',
  // 檢索用嵌入模型（走 Worker 的 /embed，由 Cloudflare Workers AI 提供）。
  // OpenRouter 型錄內沒有任何 embedding 模型，因此嵌入不與生成同源。
  EMBEDDING_MODEL: '@cf/baai/bge-m3',
  TEMPERATURE: 0.88
};

/**
 * 健壯的 JSON 自動修復與解析器
 */

/**
 * 從任意 LLM 輸出文字中萃取遊戲資料（不依賴 JSON.parse，直接 regex 挖欄位）
 * 解決模型把換行直接寫在 JSON 字串裡導致解析失敗的問題
 */
/** 解碼 JSON 字串常量中的轉義序列（供 regex 萃取的欄位使用） */
function decodeJsonStringEscapes(value) {
  try {
    return JSON.parse('"' + value + '"');
  } catch (e) {
    return value;
  }
}

function extractGameData(rawText) {
  if (!rawText) return null;

  // 先嘗試標準 JSON parse（最快、最準確）
  try {
    const parsed = parseJsonSafely(rawText);
    if (parsed && parsed.prose) return parsed;
  } catch(e) {}

  const result = {
    chapterTitle: '',
    prose: '',
    statusPanel: {},
    choices: []
  };

  // ── 萃取簡單字串/數字欄位 ──────────────────────────────────────────────────
  const getStr = (key) => {
    const m = rawText.match(new RegExp('"' + key + '"\\s*:\\s*"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"'));
    return m ? decodeJsonStringEscapes(m[1]) : '';
  };
  const getNum = (key) => {
    const m = rawText.match(new RegExp('"' + key + '"\\s*:\\s*(-?\\d+)'));
    return m ? parseInt(m[1]) : null;
  };

  const title = getStr('chapterTitle');
  if (title) result.chapterTitle = title;

  const sp = result.statusPanel;
  const tension = getNum('tension');
  if (tension !== null) sp.tension = tension;
  const intox = getNum('intoxication');
  if (intox !== null) sp.intoxication = intox;
  const favDelta = getNum('favorabilityDelta');
  if (favDelta !== null) sp.favorabilityDelta = favDelta;

  ['timeLocation','tensionLabel','intoxicationLabel','favorabilityReason',
   'outfit','interaction','inventory','rumors'].forEach(key => {
    const v = getStr(key);
    if (v) sp[key] = v;
  });

  // ── 萃取 choices（找 "choices" 陣列區塊後用 regex 逐一解析）──────────────
  const choicesIdx = rawText.indexOf('"choices"');
  if (choicesIdx !== -1) {
    const arrStart = rawText.indexOf('[', choicesIdx);
    if (arrStart !== -1) {
      // 找到配對的 ]
      let depth = 0, arrEnd = -1;
      for (let i = arrStart; i < rawText.length; i++) {
        if (rawText[i] === '[') depth++;
        else if (rawText[i] === ']') { depth--; if (depth === 0) { arrEnd = i; break; } }
      }
      const arrStr = rawText.slice(arrStart, arrEnd !== -1 ? arrEnd + 1 : rawText.length);
      const choiceRx = /\{[^}]*?"id"\s*:\s*"(\w+)"[^}]*?"label"\s*:\s*"([^"]+)"[^}]*?"risk"\s*:\s*"([^"]+)"(?:[^}]*?"hint"\s*:\s*"([^"]*)")?[^}]*?\}/g;
      for (const m of arrStr.matchAll(choiceRx)) {
        result.choices.push({
          id: m[1],
          label: decodeJsonStringEscapes(m[2]),
          risk: m[3],
          hint: decodeJsonStringEscapes(m[4] || '')
        });
      }
    }
  }

  // ── 萃取 prose（逐字元掃描，正確處理 JSON 字串轉義）────────────────────────
  const proseKeyIdx = rawText.indexOf('"prose"');
  if (proseKeyIdx !== -1) {
    const openQuote = rawText.indexOf('"', proseKeyIdx + 7);
    if (openQuote !== -1) {
      let i = openQuote + 1;
      let proseRaw = '';
      while (i < rawText.length) {
        const ch = rawText[i];
        if (ch === '\\') {
          const next = rawText[i + 1];
          if (next === 'n') { proseRaw += '\n'; i += 2; }
          else if (next === 'r') { proseRaw += '\r'; i += 2; }
          else if (next === 't') { proseRaw += '\t'; i += 2; }
          else if (next === 'b') { proseRaw += '\b'; i += 2; }
          else if (next === 'f') { proseRaw += '\f'; i += 2; }
          else if (next === '/') { proseRaw += '/'; i += 2; }
          else if (next === '"') { proseRaw += '"'; i += 2; }
          else if (next === '\\') { proseRaw += '\\'; i += 2; }
          else if (next === 'u' && /^[0-9a-fA-F]{4}$/.test(rawText.substr(i + 2, 4))) {
            proseRaw += String.fromCharCode(parseInt(rawText.substr(i + 2, 4), 16));
            i += 6;
          }
          else { proseRaw += next; i += 2; }
        } else if (ch === '"') {
          break; // 找到結束引號
        } else if (ch === '\n' || ch === '\r') {
          proseRaw += '\n'; i++; // 直接的換行（非法但兼容）
        } else {
          proseRaw += ch; i++;
        }
      }
      result.prose = proseRaw;
    }
  }

  return result.prose.length > 20 ? result : null;
}

// 向後兼容 alias
function extractFirstJson(text) { return extractGameData(text); }

/**
 * 生成後的輕量品質閘門。只做可確定的結構修復；世界觀疑點保留正文並標記，
 * 避免自動替字破壞小說語意或為了稽核額外消耗一次模型請求。
 */
/**
 * 幕與回的編號只由遊戲進度決定（saveState.meta.currentAct、turnCount），
 * 不讓模型自己寫在標題裡。先前範本要模型輸出「第 1 幕 第 N 回：標題」，
 * 「第 1 幕」是寫死的，換幕後模型仍寫第 1 幕，模型也常數錯回數；
 * 畫面又另外標示實際進度，兩組編號同時出現、互相矛盾。
 */
const CHAPTER_NUMBER_PREFIX = /^(?:\s*[【\[]?\s*第\s*[0-9０-９一二三四五六七八九十百零〇兩]+\s*[幕回章節集話]\s*[】\]]?\s*[．.、:：·・\-—–|｜,，\s]*)+/;

function stripChapterNumbering(title) {
  const cleaned = String(title || '').replace(CHAPTER_NUMBER_PREFIX, '').replace(/^[【\[]\s*(.*?)\s*[】\]]$/, '$1').trim();
  return cleaned || '';
}

function displayChapterTitle(chapter, fallback = '未命名章節') {
  return stripChapterNumbering(chapter?.chapterTitle) || fallback;
}

function formatActTurn(act, turn) {
  return `第 ${Number(act) || 1} 幕 · 第 ${Number(turn) || 1} 回`;
}

function auditGeneratedChapter(input, profile, historyList = []) {
  const chapter = isPlainObject(input) ? input : {};
  chapter.chapterTitle = (stripChapterNumbering(chapter.chapterTitle) || '未命名章節').slice(0, 160);
  chapter.prose = String(chapter.prose || '').trim();
  chapter.statusPanel = isPlainObject(chapter.statusPanel) ? chapter.statusPanel : {};

  const sp = chapter.statusPanel;
  ['tension', 'intoxication'].forEach(key => {
    if (sp[key] === undefined) return;
    const n = typeof sp[key] === 'number' ? sp[key] : parseInt(String(sp[key]).replace(/[^0-9-]/g, ''), 10);
    if (Number.isFinite(n)) sp[key] = Math.max(0, Math.min(100, Math.round(n)));
  });
  if (sp.favorabilityDelta !== undefined) {
    const n = Number(sp.favorabilityDelta);
    if (Number.isFinite(n)) sp.favorabilityDelta = Math.max(-5, Math.min(10, Math.round(n)));
  }

  const seen = new Set();
  chapter.choices = (Array.isArray(chapter.choices) ? chapter.choices : []).slice(0, 3).map((choice, idx) => {
    const c = isPlainObject(choice) ? choice : {};
    let id = String(c.id || String.fromCharCode(65 + idx)).toUpperCase().slice(0, 8);
    if (seen.has(id)) id = String.fromCharCode(65 + idx);
    seen.add(id);
    return {
      id,
      label: String(c.label || `選項 ${id}`).slice(0, 500),
      risk: ['low', 'medium', 'high'].includes(c.risk) ? c.risk : 'medium',
      hint: String(c.hint || '').slice(0, 240)
    };
  });
  chapter.intelDelta = normalizeIntelDelta(chapter.intelDelta, state.saveState?.turnCount || chapter.turn || 1);
  chapter.stateDelta = normalizeStateDelta(chapter.stateDelta);

  const warnings = [];
  if (chapter.prose.length < 300) warnings.push('正文篇幅明顯偏短');
  if (chapter.choices.length < 3) warnings.push(`僅取得 ${chapter.choices.length} 個可用選項`);
  if (!sp.timeLocation) warnings.push('缺少明確時空地點');
  const lead = profile?.targetLeadName || '';
  if (lead === '徐令謙' && /徐令謙.{0,16}(?:檢察官|警察|刑警)|(?:檢察官|警察|刑警).{0,16}徐令謙/.test(chapter.prose)) {
    warnings.push('疑似混淆徐令謙的官方職業');
  }
  const literaryQuality = assessLiteraryQuality(chapter, historyList);
  literaryQuality.warnings.forEach(warning => warnings.push(`文學品質：${warning}`));
  chapter.literaryQuality = literaryQuality;
  if (literaryQuality.warnings.length) {
    console.warn('[Literary Quality]', {
      score: literaryQuality.score,
      warnings: literaryQuality.warnings,
      metrics: literaryQuality.metrics
    });
  }
  chapter.qualityWarnings = warnings;
  return chapter;
}

function parseJsonSafely(rawText) {
  if (!rawText) throw new Error('Empty response from LLM');
  let clean = rawText.trim();
  
  clean = clean.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    clean = clean.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(clean);
  } catch (e) {
    // 大模型常見的兩種格式瑕疵：字串內夾帶未轉義的實體換行、以及結尾多餘逗號。
    try {
      return JSON.parse(stripTrailingCommas(escapeRawControlCharsInJsonStrings(clean)));
    } catch (repairError) {
      // Gemini 偶爾會先吐半份物件，再從 chapterTitle 重新開始完整 JSON。
      // 從最後一個候選起點倒序解析，避免第一份殘片遮住後面的可用結果。
      const starts = [...clean.matchAll(/\{\s*"chapterTitle"/g)].map(match => match.index).reverse();
      const lastBrace = clean.lastIndexOf('}');
      for (const start of starts) {
        if (start === 0 || lastBrace <= start) continue;
        const candidate = clean.slice(start, lastBrace + 1);
        try {
          return JSON.parse(candidate);
        } catch (candidateError) {
          try {
            return JSON.parse(stripTrailingCommas(escapeRawControlCharsInJsonStrings(candidate)));
          } catch (ignored) { /* 繼續找更前一個候選 */ }
        }
      }
      throw repairError;
    }
  }
}

/** 將 JSON 字串常量內部未轉義的實體控制字元（換行/Tab/CR）轉為合法轉義序列 */
function escapeRawControlCharsInJsonStrings(text) {
  let out = '';
  let inString = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inString && ch === '\\') {
      out += ch + (text[i + 1] ?? '');
      i++;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      out += ch;
      continue;
    }
    if (inString) {
      if (ch === '\n') { out += '\\n'; continue; }
      if (ch === '\r') { out += '\\r'; continue; }
      if (ch === '\t') { out += '\\t'; continue; }
    }
    out += ch;
  }
  return out;
}

/** 移除 } / ] 前的多餘逗號（僅處理字串常量之外的部分） */
function stripTrailingCommas(text) {
  let out = '';
  let inString = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inString && ch === '\\') { out += ch + (text[i + 1] ?? ''); i++; continue; }
    if (ch === '"') { inString = !inString; out += ch; continue; }
    if (!inString && ch === ',') {
      let j = i + 1;
      while (j < text.length && /\s/.test(text[j])) j++;
      if (text[j] === '}' || text[j] === ']') continue; // 丟掉這個逗號
    }
    out += ch;
  }
  return out;
}

let lastRequestTimestamp = 0;
// 上游限制是跨模型共享 5 RPM；16 秒約為 3.75 RPM，避開滾動窗口與共享流量邊界。
const MIN_REQUEST_GAP_MS = 1500;

/**
 * 伺服器頻率守衛（Rate Limit Cooldown Protector）
 */
async function waitForRpmCooldown() {
  const now = Date.now();
  const elapsed = now - lastRequestTimestamp;
  if (elapsed < MIN_REQUEST_GAP_MS) {
    let remainingSec = Math.ceil((MIN_REQUEST_GAP_MS - elapsed) / 1000);
    while (remainingSec > 0) {
      throwIfGenerationAborted();
      if (dom.loadingText) {
        dom.loadingText.textContent = `筆觸沉澱冷卻中（剩餘 ${remainingSec} 秒）……`;
      }
      if (dom.loadingSubtext) {
        dom.loadingSubtext.textContent = '系統正為您自動排隊，即將於倒數結束後即時推演劇情……';
      }
      await new Promise(r => setTimeout(r, 1000));
      remainingSec--;
    }
  }
}

/**
 * 核心大模型直接呼叫函數 (極速多模型 + 429 自癒機制)
 */

async function generateStoryWithWorkerStream(workerUrl, systemPrompt, userPrompt, onStreamUpdate) {
  // 主模型重試 PRIMARY_MAX_ATTEMPTS 次後依序切換未審查模型（見 buildAttemptPlan）
  const modelsToTry = buildAttemptPlan();
  const primaryModel = getModeConfig().PRIMARY_MODEL;
  const unavailableModels = new Set();
  let attemptNo = 0;
  // 排隊相關：排隊不是失敗，不計入模型嘗試次數
  let queuedTotalMs = 0;
  let retryCurrentModel = false;
  let queueTicket = '';

  for (let planIdx = 0; planIdx < modelsToTry.length; planIdx++) {
    const model = modelsToTry[planIdx];
    if (retryCurrentModel) {
      retryCurrentModel = false;
      planIdx--;                 // 排隊完成後重試同一個模型
    } else {
      attemptNo++;
    }
    // 已確認不可用的模型不再重試 —— 那是確定性失敗，重試只是白打請求
    if (unavailableModels.has(model)) continue;
    let timeoutId = null;
    try {
      throwIfGenerationAborted();
      // 這條路徑【不】呼叫 waitForRpmCooldown()：上游額度由 Worker 的
      // 全域排隊器（Durable Object）統一調度，前端再等一次是重複計算。
      // 實測會讓三次嘗試白等 32 秒，而且前端的冷卻只管自己這個瀏覽器，
      // 本來就擋不住多玩家同時上線 —— 那正是排隊器存在的理由。
      // GAS 備援路徑不經過 Worker，仍保留 waitForRpmCooldown()。
      lastRequestTimestamp = Date.now();
      const controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
      state.currentAbortController = controller;
      // 逾時改為「停滯偵測」：先前是 50 秒的總時長硬上限，會把一個正常
      // 吐字的串流從中間砍掉（實測 mistral-large-3 首字 3.5s、但要 67s 才寫完，
      // 於是每回都在它身上白等 50 秒、最後仍改用備援的輸出）。
      // 現在只在「連續一段時間收不到新資料」時判定失敗，健康的串流不會被中斷。
      let lastChunkAt = Date.now();
      let hasReceivedChunk = false;
      const armStallTimer = () => {
        if (timeoutId) clearTimeout(timeoutId);
        const idleLimit = hasReceivedChunk ? LLM_CONFIG.STALL_TIMEOUT_MS : LLM_CONFIG.FIRST_BYTE_TIMEOUT_MS;
        timeoutId = setTimeout(() => {
          const idleMs = Date.now() - lastChunkAt;
          if (idleMs >= idleLimit - 50) {
            console.warn(`[Worker] ${model} 停滯 ${Math.round(idleMs / 1000)}s 無回應，切換備援。`);
            if (controller) controller.abort();
          } else {
            armStallTimer();
          }
        }, idleLimit);
      };
      armStallTimer();
      const workerHeaders = {
        'Content-Type': 'application/json',
        'X-Undercurrent-Token': state.token || '',
        // 用量記錄用：正文回合計入回合數與遊玩時段
        'X-Request-Kind': 'chapter'
      };
      if (queueTicket) workerHeaders['X-Queue-Ticket'] = queueTicket;
      const response = await fetch(workerUrl, {
        method: 'POST',
        headers: workerHeaders,
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: LLM_CONFIG.TEMPERATURE,
          max_tokens: 6144,
          stream: true,
          // 要求供應商在解碼層就只能產出合法 JSON。這是減少格式錯誤最根本的手段：
          // 事後的寬鬆解析只能「救」，這裡是讓錯誤一開始就不會發生。
          response_format: { type: 'json_object' }
        }),
        ...(controller ? { signal: controller.signal } : {})
      });

      if (!response.ok) {
        let errBody = '';
        try { errBody = await response.text(); } catch (e) { /* 忽略 */ }

        // 排隊中：還沒輪到，不是失敗。睡完該等的時間後重試同一個模型。
        const queueInfo = parseQueueResponse(errBody);
        if (queueInfo && queueInfo.queueUnavailable) {
          notifyUser('排隊服務暫時無法使用；為避免超出共用額度，本回尚未送出。請稍後重試。', 'error', 9000);
          throw createQueueUnavailableError('queue service unavailable');
        }
        if (queueInfo && queueInfo.queueFull) {
          notifyUser(`目前同時遊玩人數較多（約需 ${queueInfo.etaSeconds} 秒），請稍後再試這一回。`, 'error', 9000);
          throw createQueueUnavailableError('queue full');
        }
        if (queueInfo && queueInfo.queued) {
          queueTicket = queueInfo.ticket || queueTicket;
          if (queuedTotalMs + queueInfo.waitMs > QUEUE_MAX_TOTAL_WAIT_MS) {
            notifyUser('排隊等待已超過 6 分鐘，本回尚未送出；請稍後再試。', 'error', 9000);
            throw new Error('排隊等待逾時，請稍後再試。');
          }
          reportQueueStatus(queueInfo.position, queueInfo.etaSeconds, queuedTotalMs, queueInfo.upstreamBackoff);
          await new Promise(r => setTimeout(r, queueInfo.waitMs));
          queuedTotalMs += queueInfo.waitMs;
          throwIfGenerationAborted();
          retryCurrentModel = true;
          throw createQueueRetryError(model);
        }

        // AI 額度用完（OpenRouter 金鑰達到上限或餘額不足）：換模型也沒用，直接說明並停止重試。
        // 2026-10-06 玩家回報「卡住」：金鑰總額度用完，前端仍輪流重試四個模型，畫面只顯示一般錯誤。
        if (isQuotaExhaustedResponse(response.status, errBody)) {
          notifyUser('遊戲的 AI 額度暫時用完了，已通知管理員補充。你的進度都還在，補充後就能接著玩。', 'error', 12000);
          throw createQueueUnavailableError('AI quota exhausted');
        }
        if (isRateLimitedResponse(errBody)) throw createRateLimitError(model, errBody);
        if (isModelUnavailableResponse(errBody)) throw createModelUnavailableError(model, errBody);
        throw new Error(`Worker HTTP ${response.status}${errBody ? ': ' + errBody.slice(0, 120) : ''}`);
      }

      setLoadingPhase('writing', '故事引擎已開始撰寫；首段文字出現後會即時顯示。');
      const reader = response.body.getReader();
      queueTicket = '';
      const decoder = new TextDecoder("utf-8");
      let fullContent = "";
      let buffer = "";
      let receivedFirstToken = false;
      // 用來即時顯示的狀態
      let proseStartIdx = -1; // 在 fullContent 中 prose 值起始的 index

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        throwIfGenerationAborted();
        lastChunkAt = Date.now();
        hasReceivedChunk = true;
        armStallTimer();

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith('data: ') || line === 'data: [DONE]') continue;
          try {
            const parsed = JSON.parse(line.slice(6));
            const token = parsed?.choices?.[0]?.delta?.content ?? '';
            if (!token) continue;
            if (!receivedFirstToken) {
              receivedFirstToken = true;
              setLoadingPhase('streaming', '故事已開始回傳，正在完成本回後半段。');
            }
            fullContent += token;

            // 即時顯示：找到 "prose": " 之後才開始串流
            if (onStreamUpdate) {
              if (proseStartIdx === -1) {
                // 找 "prose" key 後面的開頭引號
                const keyMatch = fullContent.match(/"prose"\s*:\s*"/);
                if (keyMatch) {
                  proseStartIdx = fullContent.indexOf(keyMatch[0]) + keyMatch[0].length;
                }
              }
              if (proseStartIdx !== -1) {
                // 從 proseStartIdx 開始，去掉結尾可能的 ", 或 "} 等
                let rawSlice = fullContent.slice(proseStartIdx);
                // 移除結尾的 JSON 結構（如果 prose 已結束）
                rawSlice = rawSlice.replace(/",\s*"[a-zA-Z].*$/s, '');
                // 解碼 JSON 轉義字元
                const displayProse = rawSlice.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                if (displayProse.length > 0) {
                  onStreamUpdate(displayProse);
                }
              }
            }
          } catch (e) {
            // 忽略不完整的 JSON chunk
          }
        }
      }
      
      // Stream 結束，解析最終完整 JSON
      if (fullContent.length > 10) {
        setLoadingPhase('polishing', '正文已完成，正在檢查章節、數值與下一步選項。');
        // 嘗試 1: parseJsonSafely
        let finalParsed = null;
        try {
          finalParsed = parseJsonSafely(fullContent);
        } catch(e) { /* ignore */ }
        
        // 嘗試 2: extractFirstJson（更寬鬆，處理 markdown 包裹）
        if (!finalParsed || !finalParsed.prose) {
          finalParsed = extractGameData(fullContent);
        }
        
        if (finalParsed && finalParsed.prose) {
          // 拒絕與正文過短才重跑；其餘就地修補或交給下一回修正（見 finalizeChapter）
          await finalizeChapter(finalParsed, model);
          console.log(`[Worker] ${model} 成功（第 ${attemptNo} 次嘗試），正文 ${finalParsed.prose.length} 字、選項 ${(finalParsed.choices||[]).length} 個`);
          if (model !== primaryModel) noteUncensoredFallbackUsed(model, attemptNo);
          warnIfCensoringModel(model);
          return finalParsed;
        }
        
        // 最後防線: 用已串流的 prose，但回傳空選項（讓 UI 顯示文字，選項之後由重新生成補上）
        if (proseStartIdx !== -1) {
          let rawSlice = fullContent.slice(proseStartIdx);
          rawSlice = rawSlice.replace(/",\s*"[a-zA-Z].*$/s, '');
          const displayProse = rawSlice.replace(/\\n/g, '\n').replace(/\\"/g, '"');
          if (displayProse.length > 50) {
            const salvage = { prose: displayProse, statusPanel: {}, choices: [], chapterTitle: '命運推演' };
            const salvageVerdict = detectRefusal(salvage);
            if (salvageVerdict.refused) throw createRefusalError(model, salvageVerdict.reason);
            console.warn('[Worker] JSON parse failed；保留串流預覽但不接受缺少狀態與選項的殘片，改試下一模型。');
          }
        }
      }
      console.warn(`[Worker] No usable content. fullContent(${fullContent.length}): ${fullContent.slice(0, 100)}`);
    } catch (err) {
      // 只有玩家明確中止才停止整條備援鏈；逾時、拒絕、模型不可用都應繼續往下試。
      if (state.generationAbortRequested) throw createGenerationAbortError();
      if (err && err.isRateLimited) {
        // 額度是帳號層級、跨模型共用的 —— 繼續往下試只會全部撞 429，
        // 直接中止整條鏈並讓上層顯示「請稍候再試」比空轉有意義。
        console.warn(`[Worker] 已達上游速率限制（${model}），停止本回其餘嘗試。`);
        notifyUser('已達上游每分鐘請求上限，請稍候約一分鐘再重試本回。', 'error', 9000);
        throw err;
      }
      if (err && err.isQueueUnavailable) throw err;
      if (err && err.isQueueRetry) {
        continue;   // 排隊等待已完成，下一輪重試同一個模型
      }
      if (err && err.isModelUnavailable) {
        unavailableModels.add(model);
        console.warn(`[Worker] ${model} 在上游不可用，跳過其餘重試：`, err.message);
        reportGenerationProgress(model, attemptNo, modelsToTry.length, '在上游不可用，跳過');
      } else if (err && err.isRefusal) {
        console.warn(`[Worker] ${model} 第 ${attemptNo} 次嘗試被判定為拒絕／審查：`, err.message);
        reportGenerationProgress(model, attemptNo, modelsToTry.length, '被拒絕，改試下一個');
      } else {
        console.warn(`[Worker] Model ${model} error (attempt ${attemptNo}):`, err.message);
        reportGenerationProgress(model, attemptNo, modelsToTry.length, '失敗，改試下一個');
      }
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      state.currentAbortController = null;
    }
  }
  throw new Error('Worker Streaming failed, falling back to GAS.');
}

/**
 * 判斷回應是否代表「這個模型在上游根本不可用」（名稱錯誤、未開通、無可用通道）。
 *
 * 這類失敗是確定性的：重試同一個名字五次不會有不同結果，只是白打五次請求。
 * 拒絕（審查）則不同 —— 溫度 0.88 下同一提示詞未必每次都被拒，重試有意義。
 * 兩者必須分開處理。
 */
const MODEL_UNAVAILABLE_PATTERNS = [
  /model_not_found/i,
  /no available channel/i,
  /model not allowed/i,
  /unsupported model|invalid model/i
];

function isModelUnavailableResponse(text) {
  return MODEL_UNAVAILABLE_PATTERNS.some(re => re.test(String(text || '')));
}

/**
 * 上游帳號層級的速率限制：每分鐘 5 次，且【跨模型共用】。
 * 實測時連續打了幾個不同模型就收到
 * 「您已达到请求数限制：1分钟内最多请求5次」，證實額度不是分模型計算的。
 *
 * 這對重試策略是硬約束：每次嘗試都必須經過 16 秒安全間隔，
 * 收到 429 後也不能再切換模型空轉。
 * 收到 429 時必須停止往下試，並明確告知玩家要等待，而不是繼續空轉。
 */
const RATE_LIMIT_PATTERNS = [
  /请求数限制|請求數限制/,
  /rate limit|too many requests/i,
  /1分钟内最多|1分鐘內最多/
];

function isRateLimitedResponse(text) {
  return RATE_LIMIT_PATTERNS.some(re => re.test(String(text || '')));
}

/**
 * 排隊：Worker 是所有玩家的唯一匯流點，上游額度由全體共用。
 *
 * 為什麼不能只靠前端的 waitForRpmCooldown()：那個只管自己這個瀏覽器。
 * 三個玩家同時按下選項時，各自算各自的冷卻，必然一起打上游、一起吃 429。
 * Worker 的 KV 限速是「每 IP」的，同樣擋不住不同玩家。
 *
 * 收到 429 且帶 queued 旗標時代表「還沒輪到」—— 這不是失敗，
 * 不可計入模型嘗試次數，睡完該等的時間後重試同一個模型即可。
 */
// 三人正式併發遇到上游退避時最慢約 232 秒；保留 6 分鐘避免快輪到時被踢出。
const QUEUE_MAX_TOTAL_WAIT_MS = 360000;

/**
 * 解析 Worker 的排隊回應。
 * @returns {{queued:true,ticket:string,waitMs:number,etaSeconds:number,position:number}
 *          |{queueFull:true,etaSeconds:number}|{queueUnavailable:true}|null}
 */
function parseQueueResponse(bodyText) {
  try {
    const data = JSON.parse(bodyText);
    if (data && data.queued) {
      return {
        queued: true,
        ticket: typeof data.ticket === 'string' ? data.ticket : '',
        waitMs: Math.max(1000, Number(data.waitMs) || 1000),
        etaSeconds: Number(data.etaSeconds) || 1,
        position: Number(data.position) || 1,
        upstreamBackoff: !!data.upstreamBackoff
      };
    }
    if (data && data.error && data.error.queueFull) {
      return { queueFull: true, etaSeconds: Number(data.error.etaSeconds) || 0 };
    }
    if (data && data.error && data.error.queueUnavailable) return { queueUnavailable: true };
  } catch (e) { /* 不是排隊回應，交給後續的錯誤判別 */ }
  return null;
}

/** 排隊期間把等待狀況寫進 loading，讓玩家知道系統沒當掉而是在排隊 */
function reportQueueStatus(position, etaSeconds, waitedMs, upstreamBackoff = false) {
  const waited = Math.round(waitedMs / 1000);
  const statusText = document.getElementById('server-status-text');
  const cooldownText = document.getElementById('server-cooldown-text');
  setLoadingPhase('queue', upstreamBackoff
    ? '上游暫時忙碌，已保留你的優先重試順位；不需要重新操作。'
    : `目前排在第 ${position} 位，預計還需 ${etaSeconds} 秒。`);
  if (dom.loadingSubtext) {
    dom.loadingSubtext.textContent = upstreamBackoff
      ? `上游正在恢復服務，約 ${etaSeconds} 秒後自動重試。順位與遊戲進度都已保留。`
      : `目前排在第 ${position} 位，預計還需 ${etaSeconds} 秒`
        + (waited > 0 ? `（已等待 ${waited} 秒）。可縮小視窗閱讀前文。` : '。可縮小視窗閱讀前文。');
  }
  if (statusText) statusText.textContent = `前方有其他玩家，已保留第 ${position} 位`;
  if (cooldownText) cooldownText.textContent = `約 ${etaSeconds} 秒`;
}

/** 排隊重試不是失敗，只是「還沒輪到」，必須與真正的錯誤區分 */
function createQueueRetryError(model) {
  const err = new Error(`Model ${model} queued`);
  err.isQueueRetry = true;
  return err;
}

function isQuotaExhaustedResponse(status, body) {
  const text = String(body || '');
  return status === 402 || /Key limit exceeded|Insufficient credits|credit limit|quota exceeded/i.test(text);
}

function createQueueUnavailableError(detail) {
  const err = new Error(`Queue unavailable: ${detail}`);
  err.isQueueUnavailable = true;
  return err;
}

function createRateLimitError(model, detail) {
  const err = new Error(`Model ${model} rate limited: ${String(detail).slice(0, 160)}`);
  err.isRateLimited = true;
  err.model = model;
  return err;
}

function createModelUnavailableError(model, detail) {
  const err = new Error(`Model ${model} unavailable: ${String(detail).slice(0, 160)}`);
  err.isModelUnavailable = true;
  err.model = model;
  return err;
}

/** 建立可辨識的「拒絕」錯誤，讓外層迴圈能與網路錯誤區分 */
function createRefusalError(model, reason) {
  const err = new Error(`Model ${model} refused: ${reason}`);
  err.isRefusal = true;
  err.model = model;
  return err;
}

/**
 * 真的用到未審查備援時：記錄並告知玩家。
 * 玩家需要知道這一章是換了模型寫的 —— 文風會有差異。
 */
function noteUncensoredFallbackUsed(model, attemptNo) {
  const short = String(model).split('/').pop();
  console.log(`[Fallback] 主模型連續失敗，本回改由 ${short} 生成（第 ${attemptNo} 次嘗試）。`);
  notifyUser(`主模型連續拒絕，本回改由 ${short} 生成。`, 'info', 6000);
}

/** 把重試進度寫進 loading 文字，避免五次重試期間畫面看起來像卡住 */
function reportGenerationProgress(model, attemptNo, total, note) {
  const short = String(model).split('/').pop();
  if (dom.loadingSubtext) {
    dom.loadingSubtext.textContent = `模型 ${short}（第 ${attemptNo}/${total} 次嘗試）${note}……`;
  }
}

/**
 * 拒絕／自我審查偵測。
 *
 * 這是整個輪替機制的關鍵：會審查的模型不會回 HTTP 錯誤，而是回 200 加上
 * 一段拒絕語（或被淡化到失去情慾張力的正文）。先前的成功判定只看
 * 「有沒有 prose」，那種回應會被當成成功接受 —— 也就是說「重試五次失敗」
 * 在審查情境下根本不會被觸發。必須先能認出拒絕，重試與輪替才有意義。
 */
/**
 * 供應商回傳的錯誤訊息會被包成「助理的回覆」送過來，而不是 HTTP 錯誤。
 * 實測 gemini-3.1-pro 曾回傳：
 *   「⚠️ Upstream Gemini returned an empty response. If this Worker runs on
 *     Cloudflare/serverless, Google may be blocking the egress IP...」
 * 這種內容長度超過短文門檻、又不含拒絕語，會直接被當成小說正文寫進章節。
 */
const PROVIDER_ERROR_PATTERNS = [
  /upstream\s+\w+\s+returned/i,
  /blocking the egress ip/i,
  /wrangler tail/i,
  /^\s*⚠️/,
  /system disk overloaded/i,
  /\brequest id:\s*\d{8,}/i,
  /无效的令牌|無效的令牌/
];

function looksLikeProviderError(text) {
  return PROVIDER_ERROR_PATTERNS.some(re => re.test(String(text || '')));
}

const REFUSAL_PATTERNS = [
  // 中文常見拒絕語
  /(很抱歉|抱歉|對不起)[，,。\s]*(我|本人|作為)?(無法|不能|不便|沒有辦法)/,
  // 動詞與「無法」之間常插入受詞（「我無法**按照您的要求**撰寫」），
  // 不留間隔容許就會整句對不上 —— 實測 gemma-3-27b 的拒絕正是這個句式。
  /我(無法|不能|不便)[^。，,]{0,14}(協助|提供|繼續|完成|生成|撰寫|描寫|滿足)/,
  /(不符合|違反|超出)(我的)?(使用|內容|安全)?(政策|規範|準則|原則|限制)/,
  /我(是一個|只是一個)?(AI|人工智慧|語言模型)/,
  /(改為|建議)(描寫|撰寫)(較為)?(含蓄|委婉|保守)/,
  // 模型自述設計目的／道德準則，幾乎只出現在拒絕信裡
  /我的(設計目的|設計初衷)/,
  /(違反|違背)(了)?我的(道德|倫理)(準則|規範|原則)/,
  /無法(生成|產生|創作)(這類|此類|該類)(內容|情節|描寫)/,
  // 簡體中文拒絕語。中國廠商的模型（GLM、Qwen、MiniMax 等）多以簡體回覆，
  // 而上面那組全是繁體字樣式 —— 「无法」不會被「無法」命中，一個字都對不上。
  /(很抱歉|抱歉|对不起)[，,。\s]*(我|本人|作为)?(无法|不能|不便|没有办法)/,
  /我(无法|不能|不便)[^。，,]{0,14}(协助|提供|继续|完成|生成|撰写|描写|满足)/,
  /(不符合|违反|超出)(我的)?(使用|内容|安全)?(政策|规范|准则|原则|限制)/,
  /(根据|依据)[^。]{0,12}(内容|安全|平台)[^。]{0,6}(规范|政策|准则)/,
  /我(是一个|只是一个)?(AI|人工智能|语言模型)/,
  /(改为|建议)(描写|撰写)(较为)?(含蓄|委婉|保守)/,
  // 英文常見拒絕語
  /\bI\s+(can(?:'|’)?t|cannot|am\s+unable\s+to)\s+(help|assist|provide|continue|generate|write|create)/i,
  /\b(against|violates?)\s+(my|the)\s+(guidelines|policy|policies|content\s+policy)/i,
  /\bas\s+an\s+AI\s+(language\s+)?model\b/i,
  /\bI\s+(must|have\s+to)\s+decline\b/i
];

/** 正文過短通常代表模型只回了一句拒絕，而不是真的寫了章節 */
const REFUSAL_MAX_PROSE_CHARS = 220;

/**
 * @param {object} chapter 解析後的章節物件
 * @returns {{refused: boolean, reason?: string}}
 */
function detectRefusal(chapter) {
  const prose = String((chapter && chapter.prose) || '');
  if (!prose) return { refused: true, reason: '沒有正文' };

  // 供應商錯誤訊息不論長度都要攔下 —— 否則會被當成小說正文寫進章節
  if (looksLikeProviderError(prose)) {
    return { refused: true, reason: '供應商錯誤訊息被當成正文回傳' };
  }

  // 只在正文很短時才用關鍵字判定：正常章節裡角色本來就可能說出
  // 「我不能」這類台詞，長文命中關鍵字不代表模型拒絕。
  if (prose.length <= REFUSAL_MAX_PROSE_CHARS) {
    for (const re of REFUSAL_PATTERNS) {
      if (re.test(prose)) return { refused: true, reason: `疑似拒絕語（正文僅 ${prose.length} 字）` };
    }
    if (prose.length < 80) return { refused: true, reason: `正文過短（${prose.length} 字）` };
  }

  // 開頭就是拒絕語：即使後面接了長篇說明，也算拒絕
  const head = prose.slice(0, 120);
  for (const re of REFUSAL_PATTERNS) {
    if (re.test(head)) return { refused: true, reason: '正文開頭為拒絕語' };
  }

  return { refused: false };
}

/** 回應必須足以讓遊戲繼續；缺選項或狀態時應切換下一模型，而不是接受殘片。 */
function getNarrativeValidationError(chapter) {
  if (!chapter || typeof chapter !== 'object') return '回應不是章節物件';
  const prose = String(chapter.prose || '').trim();
  if (prose.length < 220) return `正文過短（${prose.length} 字）`;
  if (!chapter.statusPanel || !String(chapter.statusPanel.timeLocation || '').trim()) return '缺少時空狀態';
  if (!Array.isArray(chapter.choices) || chapter.choices.length !== 3) {
    return `選項數量錯誤（${Array.isArray(chapter.choices) ? chapter.choices.length : 0}/3）`;
  }
  return '';
}

/**
 * 生成結果的分流處理 —— 只有真正無法挽救的才重新生成。
 *
 * 先前的做法是任何品質問題都整章丟掉換模型重跑：混入幾個簡體字、選項少一個、
 * 比喻多用一次，都要再付一次完整生成（數十秒＋費用）。這裡改成三類分流：
 *
 *   硬失敗（重跑）：拒絕生成、正文過短 —— 內容本身不存在，只能重來
 *   可修補（就地修）：簡體字、非台灣用語、半形標點、缺時空欄位、選項數量不對
 *   風格瑕疵（照收）：比喻過密、套路語、AI 腔 —— 交給下一回提示詞點名修正
 *
 * 選項修補是唯一需要呼叫模型的修補，但只請它補三個選項（數百 token），
 * 成本約為重寫整章的十分之一。
 */
/**
 * 露骨模式的硬性要求：正文必須真的寫到性行為。
 * 實測（2026-10-04）span-01-lite 6/6 判斷正確，有發生 0.95–0.96、沒有 0.04–0.06，
 * 連「前戲寫得很露骨但沒做」與「關燈後跳到隔天早上」都分得出來。
 * 糾察服務本身失敗時放行，不因檢查失敗而擋掉一個可能正常的章節。
 */
async function verifySpicyIntercourse(prose) {
  try {
    const answers = await callDecisions({
      sex: {
        type: 'noul',
        instructions: '正文是否描寫了實際發生的性行為（性交、身體結合）？只有親吻、愛撫、口頭邀請、前戲後中斷，或以「隔天早上」之類的轉場跳過，都不算。',
        criteria: {
          true: '正文明確寫出兩人實際發生性交（身體結合）的過程',
          false: '正文沒有寫出實際的性交過程（只有前戲、親吻、中斷或跳過）'
        }
      }
    }, `【正文】\n${clampBlock(prose, 6000)}`);
    const p = answers?.sex?.noul;
    if (typeof p !== 'number') return { ok: true, unknown: true };
    return { ok: p >= 0.5, probability: p };
  } catch (e) {
    return { ok: true, unknown: true };
  }
}

/** 與近期回合連續相同達此字數（去標點後）即視為照抄。 */
const COPIED_PROSE_ECHO_CHARS = 80;

async function finalizeChapter(chapter, model) {
  const verdict = detectRefusal(chapter);
  if (verdict.refused) throw createRefusalError(model, verdict.reason);

  // 按下「露骨」就必須發生性行為：沒有就退回，由模型鏈換下一次嘗試
  const profileForMode = getActivePlayerProfile ? getActivePlayerProfile() : null;
  if (state.generationMode === 'spicy' && profileForMode?.allowR18 !== false) {
    const check = await verifySpicyIntercourse(chapter.prose);
    if (!check.ok) {
      throw new Error(`露骨章節沒有發生性行為（判定機率 ${check.probability?.toFixed(2)}），退回重寫`);
    }
  }

  const polished = normalizeChapterChinese(chapter);
  if (polished) console.info(`[Polish] ${model}：就地修正 ${polished} 個字（簡繁／台灣用語／標點），未重新生成。`);

  chapter.generationMode = state.generationMode;
  await repairRepeatedPassages(chapter, model);
  await repairPassiveEnding(chapter, model);

  await repairChapterStructure(chapter, model);
  const structureError = getNarrativeValidationError(chapter);
  if (structureError) throw new Error(`模型章節結構不完整：${structureError}`);

  // 整段照抄前文是「內容沒寫出來」，不是風格瑕疵：10 回合模擬中曾有一回幾乎逐字複製上一回。
  // 一般措辭重複約 12–30 字（交給下一回提醒），連續 80 字以上相同才視為照抄並重跑。
  const echo = getLongestRecentLiteraryEcho(chapter.prose, state.chapterHistoryList);
  if (echo >= COPIED_PROSE_ECHO_CHARS) {
    throw new Error(`正文照抄近期回合（連續 ${echo} 字相同），退回重寫`);
  }

  const literaryError = getLiteraryValidationError(chapter, state.chapterHistoryList);
  if (literaryError) {
    console.info(`[Literary Quality] ${model}：${literaryError} —— 保留本章，將於下一回提示詞中點名修正。`);
  }
  return chapter;
}

/** 與先前回合連續相同達此字數（去標點後）的句子，視為重複段落。 */
const REPEATED_PASSAGE_MIN_CHARS = 14;

/**
 * 比對的先前回合：最近 3 回，加上所有露骨回合。
 * 2026-10-05 修羅場實測：第 9 回整句沿用第 5 回的性愛描寫（「車廂裡只剩下
 * 喘息……」「將名字喊成一句祈禱」），中間隔了 3 回，舊的照抄檢查只看最近 3 回。
 */
function collectComparisonProse(historyList = []) {
  const list = Array.isArray(historyList) ? historyList : [];
  const recent = list.slice(-3);
  const intimate = list.filter(item => item?.generationMode === 'spicy' && !recent.includes(item));
  return [...intimate, ...recent].map(item => String(item?.prose || '')).filter(Boolean);
}

/** 找出與先前回合重複的句子（連續 REPEATED_PASSAGE_MIN_CHARS 字相同）。 */
function findRepeatedSentences(prose, historyList = []) {
  const normalize = value => String(value || '').replace(/[\s，。！？!?；;、：「」『』“”‘’（）()—…·,.:'"\-]/g, '');
  const n = REPEATED_PASSAGE_MIN_CHARS;
  const grams = new Set();
  collectComparisonProse(historyList).forEach(text => {
    const t = normalize(text);
    for (let i = 0; i + n <= t.length; i += 1) grams.add(t.slice(i, i + n));
  });
  if (!grams.size) return [];
  const sentences = String(prose || '').match(/[^。！？\n]+[。！？」]*/g) || [];
  return sentences.filter(sentence => {
    const t = normalize(sentence);
    for (let i = 0; i + n <= t.length; i += 1) if (grams.has(t.slice(i, i + n))) return true;
    return false;
  }).map(sentence => sentence.trim());
}

/**
 * 只改寫含重複句的段落，不重跑整回；失敗或不合格就保留原文。
 */
async function repairRepeatedPassages(chapter, model) {
  const repeated = findRepeatedSentences(chapter?.prose, state.chapterHistoryList);
  if (!repeated.length) return false;
  const paragraphs = String(chapter.prose).split(/\n+/);
  const targets = paragraphs
    .map((text, index) => ({ text, index }))
    .filter(p => p.text.trim() && repeated.some(sentence => p.text.includes(sentence)));
  if (!targets.length) return false;

  const repairModel = state.generationMode === 'spicy' ? model : LLM_CONFIG.SUMMARY_MODEL;
  try {
    const raw = await requestWorkerCompletion({
      model: repairModel,
      system: '你是女性向情慾小說的編修。用台灣繁體中文改寫使用者給的段落，只輸出 JSON。' + TW_PLAIN_STYLE_RULE,
      user: `下面這些段落裡，有句子和前幾回幾乎一模一樣。請逐段改寫：保留發生的事、人物、人稱與尺度（情慾描寫維持原本的直白程度），換成新的動作、感官細節與說法，不要沿用這些句子：
${repeated.map(sentence => `- ${sentence}`).join('\n')}

段落：
${targets.map((p, i) => `[${i}] ${p.text}`).join('\n\n')}

只輸出 JSON：{"paragraphs":["改寫後的第 0 段","改寫後的第 1 段"]}，數量與順序和輸入相同。`,
      maxTokens: 3000,
      temperature: 0.7,
      json: true,
      timeoutMs: 60000
    });
    const parsed = JSON.parse(String(raw || '').replace(/^```(?:json)?\s*|\s*```$/g, ''));
    const rewritten = Array.isArray(parsed?.paragraphs) ? parsed.paragraphs : [];
    if (rewritten.length !== targets.length) return false;
    let changed = 0;
    targets.forEach((p, i) => {
      const text = polishTaiwaneseText(String(rewritten[i] || '').trim());
      if (text && text.length >= p.text.length * 0.5 && text.length <= p.text.length * 2) {
        paragraphs[p.index] = text;
        changed += 1;
      }
    });
    if (!changed) return false;
    chapter.prose = paragraphs.join('\n\n');
    console.info(`[Repeat] ${repairModel}：改寫 ${changed} 段與先前回合重複的段落，未重跑整回。`);
    return true;
  } catch (error) {
    console.warn('[Repeat] 重複段落改寫失敗，保留原文：', error?.message || error);
    return false;
  }
}

/**
 * 結尾「把決定權推回給玩家」的句型。提示詞已經禁止，但模型仍常以
 * 「他沒有催促，等著妳的下一步」「妳可以慢慢想」「我送妳回去」收尾
 * （2026-10-05 模擬：被動判定的回合幾乎都落在最後兩段）。
 */
const PASSIVE_ENDING_PATTERN = /沒有催促|沒有催|不催|等著妳|等妳(的)?(決定|回答|反應|開口|下一步|點頭)|等她(的)?(決定|回答|反應|開口|下一步|點頭)|妳可以(慢慢想|決定|選擇)|不用現在回答|想清楚|再打給我|送妳回去|送妳一程|要上來嗎|如果妳願意|兩個選擇|妳選哪一個|要不要跟/;

/**
 * 只改寫最後兩段，不重跑整回：偵測到等待句型才呼叫一次短請求，
 * 失敗或改寫不合格就保留原文。
 */
async function repairPassiveEnding(chapter, model) {
  const prose = String(chapter?.prose || '');
  const paragraphs = prose.split(/\n+/);
  const tailIndexes = [];
  for (let i = paragraphs.length - 1; i >= 0 && tailIndexes.length < 2; i -= 1) {
    if (paragraphs[i].trim()) tailIndexes.unshift(i);
  }
  if (!tailIndexes.length) return false;
  const tail = tailIndexes.map(i => paragraphs[i]).join('\n\n');
  if (!PASSIVE_ENDING_PATTERN.test(tail)) return false;

  const repairModel = state.generationMode === 'spicy' ? model : LLM_CONFIG.SUMMARY_MODEL;
  try {
    const raw = await requestWorkerCompletion({
      model: repairModel,
      system: '你是女性向情慾小說的編修。只改寫使用者給的最後兩段正文，用台灣繁體中文，直接輸出改寫後的兩段，不加說明。' + TW_PLAIN_STYLE_RULE,
      user: `以下是一回正文的最後兩段。男主角在結尾停下來等女主角決定、把選擇推回給她，或要送她回去。

請改寫：保留人物、場景、語氣、人稱（女主角是「妳」）與篇幅；刪掉「沒有催促」「等著妳的決定」「妳可以慢慢想」「我送妳回去」「要上來嗎」這類等待或退場的寫法，改成他已經做出的行動（直接帶她走、留下來、吻她、替她決定去哪），結尾停在他的行動上。不要新增人物或改變情節走向。

${tail}`,
      maxTokens: 900,
      temperature: 0.5,
      timeoutMs: 45000
    });
    const rewritten = polishTaiwaneseText(String(raw || '').trim());
    if (!rewritten || rewritten.length < tail.length * 0.5 || rewritten.length > tail.length * 1.8) return false;
    const newParagraphs = rewritten.split(/\n+/).filter(line => line.trim());
    paragraphs.splice(tailIndexes[0], paragraphs.length - tailIndexes[0], ...newParagraphs);
    chapter.prose = paragraphs.join('\n\n');
    console.info(`[Ending] ${repairModel}：改寫結尾的等待句型，未重跑整回。`);
    return true;
  } catch (error) {
    console.warn('[Ending] 結尾改寫失敗，保留原文：', error?.message || error);
    return false;
  }
}

/** 補齊可推斷的結構欄位；只有正文過短這類無法推斷的問題才留給上層重跑。 */
async function repairChapterStructure(chapter, model) {
  if (!chapter.statusPanel || typeof chapter.statusPanel !== 'object') chapter.statusPanel = {};
  if (!String(chapter.statusPanel.timeLocation || '').trim()) {
    // 時空欄位缺漏時沿用上一回 —— 同一場景的連續回合本來就常是同一時地
    chapter.statusPanel.timeLocation = state.chapterData?.statusPanel?.timeLocation || '延續上一場景';
  }

  const validChoices = (Array.isArray(chapter.choices) ? chapter.choices : [])
    .filter(c => c && typeof c === 'object' && String(c.label || '').trim());
  if (validChoices.length > 3) validChoices.length = 3;
  if (validChoices.length < 3 && String(chapter.prose || '').trim().length >= 220) {
    const extra = await requestChoicesRepair(chapter.prose, validChoices, model);
    validChoices.push(...extra.slice(0, 3 - validChoices.length));
  }
  const ids = ['A', 'B', 'C'];
  const risks = ['low', 'mid', 'high'];
  chapter.choices = validChoices.map((c, i) => ({
    ...c,
    id: ids[i],
    risk: c.risk || risks[i],
    hint: String(c.hint || '')
  }));
}

/**
 * 經由 Worker 的單次非串流式文字請求（內部仍讀 SSE，回傳完整字串）。
 * 摘要池、換幕整理、逐回摘要與選項修補共用。全部走 Worker、不經 GAS，
 * 因此 GAS 停在舊版也不影響這些功能。
 */
async function requestWorkerCompletion({ model, system, user, maxTokens = 800, temperature = 0.4, json = false, timeoutMs = 60000 }) {
  if (!LLM_CONFIG.WORKER_URL) throw new Error('未設定 Worker');
  let ticket = '';
  for (let attempt = 0; attempt < 8; attempt++) {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
    try {
      const headers = { 'Content-Type': 'application/json', 'X-Undercurrent-Token': state.token || '', 'X-Request-Kind': 'aux' };
      if (ticket) headers['X-Queue-Ticket'] = ticket;
      const body = {
        model,
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
        temperature,
        max_tokens: maxTokens,
        stream: true
      };
      if (json) body.response_format = { type: 'json_object' };
      const res = await fetch(LLM_CONFIG.WORKER_URL, {
        method: 'POST', headers, body: JSON.stringify(body),
        ...(controller ? { signal: controller.signal } : {})
      });
      const text = await res.text();
      if (!res.ok) {
        const q = parseQueueResponse(text);
        if (q && q.queued && q.ticket) {
          ticket = q.ticket;
          await new Promise(r => setTimeout(r, q.waitMs));
          continue;
        }
        throw new Error(`Worker 回應 ${res.status}`);
      }
      let out = '';
      text.split('\n').forEach(line => {
        if (!line.startsWith('data: ')) return;
        const payload = line.slice(6).trim();
        if (!payload || payload === '[DONE]') return;
        try {
          const o = JSON.parse(payload);
          (o.choices || []).forEach(c => { out += (c.delta && c.delta.content) || ''; });
        } catch (e) { /* 不完整片段 */ }
      });
      return out.trim();
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
  throw new Error('排隊等待過久');
}

/**
 * 只請模型補選項，不重寫正文。
 * 失敗時回傳空陣列，由 getNarrativeValidationError 判定為硬失敗 —— 這時才真的重跑。
 */
async function requestChoicesRepair(prose, existing, model) {
  const need = 3 - existing.length;
  if (need <= 0 || !LLM_CONFIG.WORKER_URL) return [];
  try {
    throwIfGenerationAborted();
    const out = await requestWorkerCompletion({
      model,
      system: '你是《暗流》的選項設計師，使用台灣繁體中文。只輸出一個 JSON 物件：'
        + '{"choices":[{"label":"25–60 字，一個明確行動＋必要的一句話","risk":"low|mid|high","hint":"10–24 字"}]}。' + TW_PLAIN_STYLE_RULE,
      user: `--- 本回正文 ---\n${clampBlock(prose, 2400)}\n\n`
        + (existing.length ? `--- 已有選項（不要重複）---\n${existing.map(c => c.label).join('\n')}\n\n` : '')
        + `請補上 ${need} 個接續正文、彼此方向不同的選項。`,
      maxTokens: 600,
      temperature: 0.7,
      json: true
    });
    const parsed = parseJsonSafely(out);
    const list = (parsed && Array.isArray(parsed.choices)) ? parsed.choices : [];
    const cleaned = list
      .filter(c => c && String(c.label || '').trim())
      .map(c => ({ label: polishTaiwaneseText(c.label), risk: c.risk, hint: polishTaiwaneseText(c.hint || '') }));
    console.info(`[Repair] ${model}：只補 ${cleaned.length} 個選項，未重寫正文。`);
    return cleaned;
  } catch (err) {
    if (isGenerationAbortError(err)) throw err;
    console.warn('[Repair] 選項修補失敗，交由模型鏈重試：', err);
    return [];
  }
}

/**
 * 建立這一回的模型嘗試計畫：
 *   Gemini × 2 → Mistral → Dolphin。Worker 與 GAS 共用這一份固定計畫。
 */
function resolveGenerationMode(mode) {
  const key = mode || state.generationMode || DEFAULT_GENERATION_MODE;
  return LLM_CONFIG.MODES[key] ? key : DEFAULT_GENERATION_MODE;
}

function getModeConfig(mode) {
  return LLM_CONFIG.MODES[resolveGenerationMode(mode)];
}

function buildAttemptPlan(mode) {
  const cfg = getModeConfig(mode);
  const maxPrimary = Math.max(1, cfg.PRIMARY_MAX_ATTEMPTS || 1);
  const plan = new Array(maxPrimary).fill(cfg.PRIMARY_MODEL);

  // 備援預設與主力一樣重試 FALLBACK_MAX_ATTEMPTS 次。
  // 每個模型在 Worker 端已經會跨供應商輪替，這裡的重試是針對「模型自身拒絕生成」。
  // 個別備援可用 { model, attempts } 覆寫次數 —— 品質較差的最後防線只給一次，
  // 免得玩家為了一顆本來就不該常用的模型多等一輪。
  const defaultAttempts = Math.max(1, cfg.FALLBACK_MAX_ATTEMPTS || 1);
  for (const entry of (cfg.FALLBACK_MODELS || []).filter(Boolean)) {
    const model = typeof entry === 'string' ? entry : entry.model;
    if (!model) continue;
    const attempts = typeof entry === 'string'
      ? defaultAttempts
      : Math.max(1, entry.attempts || defaultAttempts);
    for (let i = 0; i < attempts; i++) plan.push(model);
  }
  return plan;
}

/**
 * 落到會自我審查的模型時提示玩家一次。
 * 不提示的話，玩家只會發現「文風忽然變保守」卻不知道原因。
 */
let censoringModelWarned = false;
function warnIfCensoringModel(model) {
  if (!(LLM_CONFIG.CENSORING_MODELS || []).includes(model)) return;
  // 主模型本身就是會審查的（刻意選擇：快又便宜），被拒時有輪替機制接手。
  // 這種情況每回都提示只會變成雜訊 —— 只有「落到非主模型的審查模型」才值得警告。
  if (model === getModeConfig().PRIMARY_MODEL) return;
  if (censoringModelWarned) return;
  censoringModelWarned = true;
  notifyUser(
    `目前由備援模型 ${model} 生成，該模型會自我審查、可能淡化情慾描寫。`
    + '建議稍後重試以改回主要模型。',
    'error',
    9000
  );
}

async function generateStoryFromLLM(systemPrompt, userPrompt, onStreamUpdate = null) {
  if (LLM_CONFIG.WORKER_URL) {
    try {
      const res = await generateStoryWithWorkerStream(LLM_CONFIG.WORKER_URL, systemPrompt, userPrompt, onStreamUpdate);
      if (res) return res;
    } catch(e) {
      if (isGenerationAbortError(e)) throw createGenerationAbortError();
      // Worker 與 GAS 共用同一個上游額度；429 時切 GAS 只會再次被限流。
      if (e && (e.isRateLimited || e.isQueueUnavailable)) throw e;
      console.warn('Worker error, fallback to GAS', e);
    }
  }
  // GAS 路徑保留重複的第二次 Gemini，順序與 Worker 完全一致。
  const models = buildAttemptPlan();
  const unavailableModelsGas = new Set();
  for (let mIdx = 0; mIdx < models.length; mIdx++) {
    const model = models[mIdx];
    if (unavailableModelsGas.has(model)) continue;
    let timeoutId = null;
    try {
      throwIfGenerationAborted();
      await waitForRpmCooldown();
      lastRequestTimestamp = Date.now();
      const controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
      state.currentAbortController = controller;
      timeoutId = setTimeout(() => {
        if (controller) controller.abort();
      }, 50000); // 延長至 50 秒以配合 GAS 代理
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          action: 'llm/proxy',
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: LLM_CONFIG.TEMPERATURE,
          max_tokens: 6144,
          response_format: { type: 'json_object' },
          token: state.token,
          userId: state.userId
        }),
        redirect: 'follow'
      };
      if (controller) {
        fetchOptions.signal = controller.signal;
      }
      const response = await fetch(state.gasApiUrl, fetchOptions);
      if (!response.ok) {
        const errText = await response.text();
        if (isRateLimitedResponse(errText)) {
          console.warn(`[Pure AI] 已達上游速率限制（${model}），停止其餘嘗試。`);
          notifyUser('已達上游每分鐘請求上限，請稍候約一分鐘再重試本回。', 'error', 9000);
          break;
        }
        if (isModelUnavailableResponse(errText)) {
          console.warn(`[Pure AI] ${model} 在上游不可用，跳過其餘重試。`);
          unavailableModelsGas.add(model);
        } else {
          console.warn(`[Pure AI] Model ${model} HTTP ${response.status}: ${errText.slice(0, 100)}`);
        }
        continue;
      }
      const data = await response.json();
      if (!data.success || !data.data || !data.data.content) {
        console.warn(`[Pure AI] Model ${model} returned empty or failed content via proxy.`);
        continue;
      }
      const rawContent = data.data.content;
      const parsed = parseJsonSafely(rawContent);
      if (parsed && parsed.prose) {
        try {
          await finalizeChapter(parsed, model);
        } catch (finalizeErr) {
          if (isGenerationAbortError(finalizeErr)) throw finalizeErr;
          console.warn(`[Pure AI] ${model} 無法使用（${finalizeErr.message}），改試下一個。`);
          reportGenerationProgress(model, mIdx + 1, models.length, '無法使用，改試下一個');
          continue;
        }
        console.log(`[Pure AI] Successfully generated with model: ${model} via proxy (${parsed.prose.length} chars)`);
        if (model !== LLM_CONFIG.PRIMARY_MODEL) noteUncensoredFallbackUsed(model, mIdx + 1);
        warnIfCensoringModel(model);
        return parsed;
      }
    } catch (err) {
      if (state.generationAbortRequested) throw createGenerationAbortError();
      console.warn(`[Pure AI] Model ${model} attempt error:`, err.message);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      state.currentAbortController = null;
    }
  }
  throw new Error('所有 AI 創作模型生成逾時或回傳格式異常，請檢查網路連線。');
}

// =========================================================================
// 4.4 角色卡載入與按場景檢索 (Character Cards)
// =========================================================================

/**
 * 角色完整人設的來源：遊戲網站自己提供的 characters/*.md（14 份，約 139KB）。
 *
 * 為什麼不再從 Drive 讀：舊做法經 GAS 的 lore/get-character 調閱 Drive，
 * 但只要 GAS 未部署、登入權杖過期或 Drive 找不到檔案，就只在主控台留一行
 * 警告、默默退回精簡人設 —— 玩家與作者都看不到它失敗了。這 14 份檔案本來
 * 就在 repo 裡、隨網站公開發布，同網域直接讀取，不需要登入也不經過任何後端。
 *
 * 為什麼不整張塞進提示詞：最大的角色卡有 24KB，而且多數內容與當下場景無關。
 * 改為：精簡核心人設＋硬性設定每回都帶；完整角色卡切成片段，用 bge-m3 依
 * 本回場景挑最相關的幾段。情慾場景會撈到情慾動態，對峙場景會撈到關係與宿敵。
 */
const CHARACTER_CARD_PATHS = ['characters/', '../../characters/'];
const LORE_TIER2_LIMIT = 2;            // 在場配角最多附上兩位的角色卡片段
const PERSONA_CHUNK_CHARS = 500;
const PERSONA = {
  leadChunks: 6,                       // 主角每回附幾段
  leadChunksRecalibrate: 10,           // 每 5 回校準時加量
  npcChunks: 2,                        // 每位在場配角附幾段
  wholeCardChars: 3600,                // 主角卡在此字數內就整張帶入
  minScore: 0.35
};

/** id -> markdown。只放記憶體：角色卡共約 139KB，寫進 localStorage 會擠壓存檔空間。 */
const characterCardCache = new Map();
/** id -> [{ id, text }]，切好的片段 */
const characterChunkCache = new Map();
/**
 * id -> 演繹卡（characters/voice/*.json）。依言談、思想、優先順序、語氣、用字、情慾特質、
 * 追求方式、慣常行動、形式風格整理，全部依據角色卡；例句經逐字比對，必定出自角色卡。
 */
const characterVoiceCache = new Map();

async function fetchCharacterVoice(id) {
  if (characterVoiceCache.has(id)) return characterVoiceCache.get(id);
  const file = 'voice/' + encodeURIComponent(id) + '.json';
  for (const base of CHARACTER_CARD_PATHS) {
    try {
      const res = await fetch(base + file, { cache: 'no-cache' });
      if (res.ok) {
        const voice = await res.json();
        if (voice && voice.speech) { characterVoiceCache.set(id, voice); return voice; }
      }
    } catch (e) { /* 換下一個路徑 */ }
  }
  return null;
}

function getCharacterVoice(id) {
  return characterVoiceCache.get(id) || null;
}
/** 本回挑好的片段，供同步組裝提示詞時讀取 */
let preparedPersonaChunks = {};
let characterCardFailureNotified = false;

function splitCharacterCard(markdown) {
  // 角色卡的段落標題用 emoji 開頭（⚖️ 基本資料、⛓️ …）；留在提示詞裡，模型可能把它們抄進正文
  const cleaned = String(markdown || '')
    // 先把「emoji 開頭的短行」轉成 Markdown 標題，清掉 emoji 後仍認得出段落
    .replace(/^[ \t]*[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}][\u{FE0F}]?[ \t]*(.{1,38})$/gmu, '## $1')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{FE0F}]/gu, '')
    .replace(/^[ \t]+/gm, '');
  const paragraphs = cleaned.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const chunks = [];
  let heading = '';
  let buffer = '';
  const flush = () => {
    const text = buffer.trim();
    if (text.length >= 30) chunks.push(heading && !text.startsWith(heading) ? `${heading}\n${text}` : text);
    buffer = '';
  };
  paragraphs.forEach(p => {
    // 段落標題：Markdown 標題，或角色卡慣用的「符號開頭短行」
    const isHeading = /^#{1,4}\s/.test(p) || (p.length <= 40 && !p.includes('\n') && /^[^\w㐀-鿿「『（(\-*\d]/u.test(p));
    if (isHeading) {
      flush();
      heading = p.replace(/^#+\s*/, '').replace(/\*\*/g, '').trim();
      return;
    }
    // 單一段落過長時依句號切開，避免整段變成一個過大的片段
    const pieces = p.length > PERSONA_CHUNK_CHARS
      ? (p.match(/[^。！？\n]+[。！？]?/g) || [p])
      : [p];
    pieces.forEach(piece => {
      if ((buffer + '\n' + piece).length > PERSONA_CHUNK_CHARS) flush();
      buffer += (buffer ? (pieces.length > 1 ? '' : '\n') : '') + piece;
    });
  });
  flush();
  return chunks;
}

async function fetchCharacterCardText(id) {
  const file = encodeURIComponent(id) + '.md';
  for (const base of CHARACTER_CARD_PATHS) {
    try {
      const res = await fetch(base + file, { cache: 'no-cache' });
      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 50) return text;
      }
    } catch (e) { /* 換下一個路徑 */ }
  }
  return null;
}

/**
 * 載入指定角色的完整角色卡。失敗時要讓人看得到 —— 這正是舊做法最大的問題。
 * @returns {Promise<number>} 本次實際載入的張數
 */
async function fetchCharacterLore(ids, options = {}) {
  const { force = false } = options;
  const wanted = (Array.isArray(ids) ? ids : [ids])
    .filter(Boolean)
    .filter(id => force || !characterCardCache.has(id));
  if (!wanted.length) return 0;
  let count = 0;
  const missing = [];
  await Promise.all(wanted.map(async id => {
    fetchCharacterVoice(id).catch(() => {});
    const md = await fetchCharacterCardText(id);
    if (md) {
      characterCardCache.set(id, md);
      characterChunkCache.set(id, splitCharacterCard(md).map((text, i) => ({ id: `card:${id}:${i}`, text })));
      count++;
    } else {
      missing.push(id);
    }
  }));
  if (missing.length) {
    console.warn('[Persona] 角色卡載入失敗，暫用精簡人設：', missing.join('、'));
    if (!characterCardFailureNotified) {
      characterCardFailureNotified = true;
      notifyUser(`角色卡載入失敗（${missing.map(m => m.replace(/^\d+_/, '')).join('、')}），本回暫用精簡人設。`, 'error', 6000);
    }
  }
  return count;
}

function getLoreMarkdown(id) {
  return characterCardCache.get(id) || null;
}

function clearLoreCache() {
  const n = characterCardCache.size;
  characterCardCache.clear();
  characterChunkCache.clear();
  // 清掉舊版寫進 localStorage 的 Drive 角色卡快取，釋出存檔空間
  try {
    const doomed = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('undercurrent_lore_')) doomed.push(k);
    }
    doomed.forEach(k => localStorage.removeItem(k));
  } catch (e) { /* 忽略 */ }
  return n;
}

/**
 * 依本回場景，替主角與在場配角挑出最相關的角色卡片段。
 * 生成前呼叫（非同步）；結果放在 preparedPersonaChunks，供組裝提示詞時同步讀取。
 * 任何失敗都只是少了補充片段，核心人設與硬性設定仍會照常帶入。
 */
async function preparePersonaContext(leadKey, npcIds, sceneQuery, turnCount) {
  preparedPersonaChunks = {};
  const ids = [leadKey, ...(npcIds || []).slice(0, LORE_TIER2_LIMIT)].filter(k => k && OFFICIAL_DRIVE_CHARACTERS[k]);
  if (!ids.length) return;
  try {
    await Promise.all([fetchCharacterLore(ids), ...ids.map(id => fetchCharacterVoice(id).catch(() => null))]);
    const query = clampBlock(String(sceneQuery || ''), 400);
    if (!query) return;
    const recalibrate = turnCount >= LORE_RECALIBRATE_EVERY && turnCount % LORE_RECALIBRATE_EVERY === 0;
    for (const id of ids) {
      const chunks = characterChunkCache.get(id) || [];
      if (!chunks.length) continue;
      const k = id === leadKey ? (recalibrate ? PERSONA.leadChunksRecalibrate : PERSONA.leadChunks) : PERSONA.npcChunks;
      // 短卡片（主角卡在預算內）整張帶入：只有 9 段卻挑 6 段，挑選本身沒有意義，
      // 反而會漏掉剩下那幾段。只有長卡片才需要依場景挑選。
      const totalChars = chunks.reduce((n, c) => n + c.text.length, 0);
      if (id === leadKey && totalChars <= PERSONA.wholeCardChars) {
        preparedPersonaChunks[id] = chunks.map(c => c.text);
        continue;
      }
      await ensureMemoryVectors(chunks);
      const [qv] = await embedTexts([query]);
      if (!qv?.length) continue;
      preparedPersonaChunks[id] = chunks
        .map((c, i) => ({ i, text: c.text, score: cosineSimilarity(qv, memoryVectors.get(c.id)) }))
        .filter(c => c.score >= PERSONA.minScore)
        .sort((a, b) => b.score - a.score)
        .slice(0, k)
        .sort((a, b) => a.i - b.i)          // 依原文順序排，讀起來才連貫
        .map(c => c.text);
    }
  } catch (err) {
    console.warn('[Persona] 角色卡片段檢索失敗，本回只用核心人設：', err);
  }
}

/**
 * 依本回情境偵測在場角色並挑選角色卡片段。偵測邏輯與提示詞組裝完全一致，
 * 確保「挑片段的角色」就是「出現在提示詞裡的角色」。
 */
async function preparePersonaForTurn(profile, actionText, lastProseText, turnCount) {
  if (!profile) return;
  const isShura = profile.targetLead === '修羅場' || profile.targetLeadName === '修羅場';
  if (isShura) { preparedPersonaChunks = {}; return; }
  const leadKey = profile.targetLead || '01_徐令謙';
  const npcs = detectActiveNPCs(lastProseText || '', actionText || '', leadKey, profile.supportingLeads || []);
  const spicy = state.generationMode === 'spicy' ? '親密 情慾 身體 慾望' : '';
  // 角色卡片段要配合場景，所以查詢帶上一回結尾（與記憶檢索不同：記憶要避開近期，人設要貼合當下）
  const query = [actionText, String(lastProseText || '').slice(-300), spicy].filter(Boolean).join('\n');
  await preparePersonaContext(leadKey, npcs.map(n => n.id), query, turnCount);
}

function getPreparedPersonaChunks(id) {
  return preparedPersonaChunks[id] || [];
}

async function handleReloadLore() {
  const profile = getActivePlayerProfile();
  const removed = clearLoreCache();
  characterCardFailureNotified = false;
  notifyUser('正在重新載入角色設定……', 'info', 2500);
  const ids = [];
  if (profile.targetLead && profile.targetLead !== '修羅場') ids.push(profile.targetLead);
  (profile.supportingLeads || []).forEach(k => ids.push(k));
  const got = await fetchCharacterLore(ids, { force: true });
  renderLoreStatus();
  notifyUser(
    got > 0 ? `已重新載入 ${got} 張角色卡，下一回起生效。` : '角色卡載入失敗，將沿用精簡人設。',
    got > 0 ? 'success' : 'error',
    6000
  );
  return removed;
}

function renderLoreStatus() {
  const el = document.getElementById('lore-status-line');
  if (!el) return;
  const profile = getActivePlayerProfile();
  const lead = profile.targetLead;
  if (!lead || lead === '修羅場') {
    el.textContent = '修羅場模式：使用全員背景名冊。';
    return;
  }
  const md = getLoreMarkdown(lead);
  el.textContent = md
    ? `${profile.targetLeadName || lead}：完整角色卡已載入（${md.length} 字），每回依場景挑選相關段落。`
    : `${profile.targetLeadName || lead}：角色卡尚未載入，目前使用精簡人設。`;
}

function warmLoreCache(profile) {
  if (!profile) return;
  const ids = [];
  if (profile.targetLead && profile.targetLead !== '修羅場') ids.push(profile.targetLead);
  (profile.supportingLeads || []).forEach(k => ids.push(k));
  if (ids.length) fetchCharacterLore(ids).catch(() => {});
}

/**
 * 每隔幾回加一段「重新對標人設」的指令，並加大角色卡片段的份量。
 * 摘要池會把語氣與性格的細節磨平，長局容易出現「講話方式變了」的漂移；
 * 單純把人設放著不代表模型會持續對標，定期明確要求校準效果好得多。
 */
const LORE_RECALIBRATE_EVERY = 5;

function buildLoreRecalibrationNote(turnCount, leadName) {
  if (!turnCount || turnCount < LORE_RECALIBRATE_EVERY) return '';
  if (turnCount % LORE_RECALIBRATE_EVERY !== 0) return '';
  return [
    '',
    `【人設重新校準 · 第 ${turnCount} 回】`,
    `已進行 ${turnCount} 回，請在本回動筆前重新通讀上方 ${leadName} 的核心人設、硬性設定與角色卡段落，`,
    '特別是說話風格與例句、性格與情慾動態，以及該角色專屬的禁制。',
    '本回的對白與行為必須與設定完全吻合 —— 若先前幾回出現語氣偏移、用詞粗俗化',
    '或性格軟化，請在本回自然地校正回來，不要沿用偏移後的寫法。',
    ''
  ].join('\n');
}

// =========================================================================
// 4.45 上下文信封 (Context Envelope)
// =========================================================================

/**
 * 每回都把完整脈絡重新送一次 —— 這個 API 是無狀態的，模型不會「記得」上一回，
 * 第 40 回和第 1 回一樣都是從零重建整份提示詞。因此「定期重新餵」不是額外機制，
 * 而是每回的必然；真正決定品質的是【餵了什麼、以及餵得夠不夠】。
 *
 * 先前的實測（第 41 回）顯示提示詞只用掉 128k 視窗的 17%，卻同時漏掉了：
 *   - 近期劇情只餵 2 回 × 260 字元 = 520 字元（模型每回實際寫 1,458 字，只看到 18%）
 *   - 好感度／HP／理智／道具／任務旗標完全沒送（數值迴路是斷的：
 *     statusPanel 被解析進存檔，卻從來沒有餵回去）
 *   - Act Dossier 沒送（卷末換窗清掉 turnHistory，換來的檔案卻沒進提示詞，
 *     等於淨損失）
 *   - 玩家的背景／外貌／雷區禁忌／自訂開場情境沒送
 *
 * 以下各區塊都有明確的字元上限，避免任何單一區塊在長局中失控膨脹。
 */
const CONTEXT_BUDGET = {
  recentTurns: 5,              // 近期劇情回合數（保留足夠對話與場景細節）
  // 單回正文上限。與 max_tokens 6144 連動：模型可寫到約 1,800–2,000 字，
  // 這裡若設太小，較長的章節餵回下一回的歷史時會被裁掉、失去銜接細節。
  recentProsePerTurn: 2400,
  actDossiers: 2,              // 保留最近幾幕的幕篇檔案
  actDossierChars: 1400,       // 單份幕篇檔案上限（幕篇檔案要求 800–1,200 字）
  playerProfileChars: 900,
  liveStateChars: 800,
  questFlagsShown: 4           // 任務旗標只列最新幾條，避免隨回合累積膨脹
};

function clampBlock(text, max) {
  const str = String(text || '');
  return str.length <= max ? str : str.slice(0, max - 1) + '…';
}

/** 玩家設定：先前 buildNextTurnPrompt 只送了姓名／性別／年齡／職業 */
function buildPlayerProfileBlock(profile) {
  const p = profile || {};
  const isShura = p.targetLead === '修羅場' || p.targetLeadName === '修羅場';
  const lines = [
    '【玩家主角設定】',
    `- 姓名：${p.name || '玩家'} ｜ 性別：${p.gender || '女'} ｜ 年齡：${p.age || '24'} 歲`,
    `- 職業與身分：${p.profession || '政經公關總監'}`,
    `- 身世背景：${p.background || '遊走於台北政商黑白兩道'}`,
    `- 外貌與著裝：${p.appearance || '隨機（請維持一致的專屬穿搭、體香與神態）'}`,
    `- 【雷區禁忌 · 絕對避免】：${p.taboos || '無特定雷區'}`,
    `- 攻略模式：${isShura ? '全勢力修羅場' : (p.targetLeadName || '徐令謙')}`,
    `- 成人情慾模式 (R-18)：${p.allowR18 === false ? '關閉（純情權謀 PG-15）' : '開啟'}`,
    `- 強勢主導劇情：${isDominantPlotEnabled(p) ? '已勾選同意' : '未勾選'}`,
    `- 【性別代名詞】：請嚴格依玩家性別（${p.gender || '女'}）使用正確人稱（男性用「他」、女性用「她」、非二元用合適稱謂）。`
  ];
  if (p.customScenario) {
    lines.push(`- 開局自訂情境（本局的既定前提，不可推翻）：${p.customScenario}`);
  }
  return clampBlock(lines.join('\n'), CONTEXT_BUDGET.playerProfileChars);
}

/**
 * 幕篇檔案。卷末換窗會清空 turnHistory 並把整幕壓成約 800 字的檔案，
 * 但先前前端提示詞從不讀 actDossiers —— 換窗因此變成「刪掉上下文、
 * 換來的東西沒送出去」的淨損失。
 */
function buildActDossierBlock(saveState) {
  const dossiers = (saveState && Array.isArray(saveState.actDossiers)) ? saveState.actDossiers : [];
  if (dossiers.length === 0) return '';
  const recent = dossiers.slice(-CONTEXT_BUDGET.actDossiers);
  const offset = dossiers.length - recent.length;
  const parts = recent.map((d, i) =>
    `── 第 ${offset + i + 1} 幕 幕篇檔案 ──\n${clampBlock(d, CONTEXT_BUDGET.actDossierChars)}`
  );
  return `【已完結幕篇的歷史檔案（早期劇情的權威濃縮，請視為既定事實）】\n${parts.join('\n\n')}\n`;
}

/**
 * 近期劇情：最近 N 回的完整正文，並附上當時提供給玩家的三個選項
 * —— 讓模型知道玩家是在什麼選項組合裡做出該抉擇的。
 */
function buildRecentHistoryBlock(historyList, saveState = state.saveState) {
  const resetTurn = Math.max(0, Number(saveState?.meta?.contextResetTurn) || 0);
  const list = (Array.isArray(historyList) ? historyList : []).filter(item =>
    !resetTurn || Number(item?.turn || 0) >= resetTurn
  );
  if (list.length === 0) return '【近期劇情】\n（本局剛開始，正處於交鋒對峙中）\n';

  const recent = list.slice(-CONTEXT_BUDGET.recentTurns);
  const parts = recent.map((h, i) => {
    const turn = h.turn || (list.length - recent.length + i + 1);
    const seg = [`── ${formatActTurn(h.act, turn)}：${displayChapterTitle(h, '前篇')} ──`];
    if (h.chosenLabel) seg.push(`【玩家當回行動】${h.chosenLabel}`);
    const prose = clampBlock(h.prose, CONTEXT_BUDGET.recentProsePerTurn);
    seg.push(`【正文】\n${prose}${h.proseArchived ? '\n（本回較早，正文已濃縮）' : ''}`);
    const offered = (h.choices || []).map(c => c.label).filter(Boolean);
    if (offered.length) {
      seg.push(`【當回提供的選項】${offered.join(' ／ ')}`);
    }
    return seg.join('\n');
  });
  return `【近期劇情（最近 ${recent.length} 回全文，請確保情節與細節完全銜接）】\n${parts.join('\n\n')}\n`;
}

/** 玩家指定不可遺忘的回合，以原文摘錄放在摘要之後、近期全文之前。 */
function buildPinnedMemoryBlock(historyList, saveState = state.saveState) {
  const list = Array.isArray(historyList) ? historyList : [];
  const saved = Array.isArray(saveState?.pinnedMemories) ? saveState.pinnedMemories : [];
  const byTurn = new Map();
  saved.forEach(h => { if (h) byTurn.set(Number(h.turn), h); });
  list.filter(h => h && h.memoryPinned).forEach(h => {
    const saved = byTurn.get(Number(h.turn));
    // Archived display excerpts must not replace the player's longer pinned copy.
    if (!saved || String(h.prose || '').length > String(saved.prose || '').length) {
      byTurn.set(Number(h.turn), h);
    }
  });
  const pinned = Array.from(byTurn.values()).slice(-8);
  if (pinned.length === 0) return '';
  const entries = pinned.map(h => {
    const facts = [
      `── ${formatActTurn(h.act, h.turn)}：${displayChapterTitle(h, '重要回合')} ──`,
      h.chosenLabel ? `【玩家行動】${h.chosenLabel}` : '',
      `【不可遺忘原文】${clampBlock(h.prose, 1500)}`
    ].filter(Boolean);
    return facts.join('\n');
  });
  return `【玩家釘選的重要記憶（權威事實，後續不得遺忘或推翻）】\n${entries.join('\n\n')}\n`;
}

const INTEL_TYPES = ['evidence', 'intel', 'contact', 'access'];
const INTEL_CONFIDENCE = ['unverified', 'partial', 'verified'];
const INTEL_STATUSES = ['available', 'exposed', 'delivered', 'invalid'];
const INTEL_TYPE_LABELS = { evidence: '物證', intel: '情報', contact: '人脈', access: '權限' };
const INTEL_CONFIDENCE_LABELS = { unverified: '未查證', partial: '部分印證', verified: '已確認' };
const INTEL_STATUS_LABELS = { available: '可用', exposed: '已曝光', delivered: '已交付', invalid: '已失效' };

function createIntelId(name) {
  let hash = 2166136261;
  const text = String(name || '線索');
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `intel_${(hash >>> 0).toString(36)}`;
}

function normalizeIntelEntry(raw, turn = 1) {
  const source = typeof raw === 'string' ? { name: raw } : (isPlainObject(raw) ? raw : {});
  const name = String(source.name || source.label || '').trim().slice(0, 120);
  if (!name) return null;
  const rawId = String(source.id || '').trim();
  const id = /^[a-zA-Z0-9_-]{3,64}$/.test(rawId) ? rawId : createIntelId(name);
  return {
    id,
    name,
    type: INTEL_TYPES.includes(source.type) ? source.type : 'intel',
    confidence: INTEL_CONFIDENCE.includes(source.confidence) ? source.confidence : 'unverified',
    status: INTEL_STATUSES.includes(source.status) ? source.status : 'available',
    source: String(source.source || '劇情取得').trim().slice(0, 120),
    effect: String(source.effect || source.desc || '').trim().slice(0, 240),
    acquiredTurn: Math.max(1, Number(source.acquiredTurn) || turn),
    updatedTurn: Math.max(1, Number(source.updatedTurn) || turn)
  };
}

/** 舊存檔遷移：保留真正物品，排除舊版固定塞入、從未運作的兩個示範占位物。 */
function ensureIntelLedger(saveState = state.saveState) {
  if (!saveState || typeof saveState !== 'object') return [];
  const turn = Math.max(1, Number(saveState.turnCount) || 1);
  let source = Array.isArray(saveState.intelLedger) ? saveState.intelLedger : [];
  if (!Array.isArray(saveState.intelLedger) && Array.isArray(saveState.inventory)) {
    source = saveState.inventory.filter(item => !['item_card', 'item_press'].includes(item && item.id));
  }
  const seen = new Set();
  saveState.intelLedger = source.map(item => normalizeIntelEntry(item, turn)).filter(item => {
    if (!item || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  }).slice(-60);
  return saveState.intelLedger;
}

function normalizeIntelDelta(raw, turn = 1) {
  const delta = isPlainObject(raw) ? raw : {};
  const add = (Array.isArray(delta.add) ? delta.add : [])
    .map(item => normalizeIntelEntry(Object.assign({}, item, { acquiredTurn: turn, updatedTurn: turn }), turn))
    .filter(Boolean)
    .slice(0, 8);
  const update = (Array.isArray(delta.update) ? delta.update : []).map(item => {
    if (!isPlainObject(item)) return null;
    const id = String(item.id || '').trim().slice(0, 64);
    const name = String(item.name || '').trim().slice(0, 120);
    if (!id && !name) return null;
    const out = { id, name };
    if (INTEL_STATUSES.includes(item.status)) out.status = item.status;
    if (INTEL_CONFIDENCE.includes(item.confidence)) out.confidence = item.confidence;
    if (item.effect !== undefined) out.effect = String(item.effect || '').trim().slice(0, 240);
    if (item.source !== undefined) out.source = String(item.source || '').trim().slice(0, 120);
    return out;
  }).filter(Boolean).slice(0, 8);
  return { add, update };
}

function applyIntelDelta(saveState, rawDelta, turn) {
  const ledger = ensureIntelLedger(saveState);
  const delta = normalizeIntelDelta(rawDelta, turn);
  const changes = { added: [], updated: [] };

  delta.add.forEach(entry => {
    const existing = ledger.find(item => item.id === entry.id || item.name === entry.name);
    if (existing) {
      Object.assign(existing, entry, { id: existing.id, acquiredTurn: existing.acquiredTurn, updatedTurn: turn });
      changes.updated.push(existing);
    } else {
      ledger.push(entry);
      changes.added.push(entry);
    }
  });

  delta.update.forEach(change => {
    const target = ledger.find(item => (change.id && item.id === change.id) || (change.name && item.name === change.name));
    if (!target) return;
    ['status', 'confidence', 'effect', 'source'].forEach(key => {
      if (change[key] !== undefined) target[key] = change[key];
    });
    target.updatedTurn = turn;
    changes.updated.push(target);
  });

  saveState.intelLedger = ledger.slice(-60);
  return changes;
}

function normalizeStateDelta(raw) {
  const delta = isPlainObject(raw) ? raw : {};
  const clampChange = value => {
    const n = Number(value);
    return Number.isFinite(n) ? Math.max(-100, Math.min(100, Math.round(n))) : 0;
  };
  const normalizeItem = item => {
    if (!isPlainObject(item)) return null;
    const name = String(item.name || '').trim().slice(0, 120);
    if (!name) return null;
    return {
      id: String(item.id || createIntelId(name)).trim().slice(0, 64),
      name,
      count: Math.max(1, Math.min(99, Number(item.count) || 1)),
      desc: String(item.desc || '').trim().slice(0, 240)
    };
  };
  const relationshipChanges = {};
  if (isPlainObject(delta.relationshipChanges)) {
    Object.keys(delta.relationshipChanges).slice(0, 20).forEach(name => {
      const value = clampChange(delta.relationshipChanges[name]);
      if (value) relationshipChanges[String(name).slice(0, 80)] = value;
    });
  }
  return {
    hpChange: clampChange(delta.hpChange),
    sanityChange: clampChange(delta.sanityChange),
    itemsAdded: (Array.isArray(delta.itemsAdded) ? delta.itemsAdded : []).map(normalizeItem).filter(Boolean).slice(0, 8),
    itemsRemoved: (Array.isArray(delta.itemsRemoved) ? delta.itemsRemoved : []).map(item =>
      String(isPlainObject(item) ? (item.id || item.name || '') : item || '').slice(0, 120)
    ).filter(Boolean).slice(0, 8),
    relationshipChanges,
    questProgress: String(delta.questProgress || '').trim().slice(0, 500)
  };
}

function applyStateDelta(saveState, rawDelta) {
  const st = saveState || {};
  const delta = normalizeStateDelta(rawDelta);
  st.protagonist = isPlainObject(st.protagonist) ? st.protagonist : {};
  const currentHp = Number(st.protagonist.hp);
  const currentSanity = Number(st.protagonist.sanity);
  st.protagonist.hp = Math.max(0, Math.min(100, (Number.isFinite(currentHp) ? currentHp : 100) + delta.hpChange));
  st.protagonist.sanity = Math.max(0, Math.min(100, (Number.isFinite(currentSanity) ? currentSanity : 100) + delta.sanityChange));
  st.inventory = Array.isArray(st.inventory) ? st.inventory : [];
  delta.itemsAdded.forEach(item => {
    const existing = st.inventory.find(current => current && (current.id === item.id || current.name === item.name));
    if (existing) existing.count = Math.min(99, (Number(existing.count) || 1) + item.count);
    else st.inventory.push(item);
  });
  if (delta.itemsRemoved.length) {
    st.inventory = st.inventory.filter(item => item && !delta.itemsRemoved.includes(item.id) && !delta.itemsRemoved.includes(item.name));
  }
  st.inventory = st.inventory.slice(-60);
  st.relationships = isPlainObject(st.relationships) ? st.relationships : {};
  if (FEATURES.favorability) Object.keys(delta.relationshipChanges).forEach(name => {
    const current = Number(st.relationships[name]);
    st.relationships[name] = Math.max(0, Math.min(100, (Number.isFinite(current) ? current : 0) + delta.relationshipChanges[name]));
  });
  st.questFlags = isPlainObject(st.questFlags) ? st.questFlags : {};
  if (delta.questProgress) st.questFlags.latest_update = delta.questProgress;
  return delta;
}

function applyChapterStateChanges(chapter, profile, turn) {
  state.saveState = state.saveState || {};
  const normalizedDelta = normalizeStateDelta(chapter.stateDelta);
  chapter.stateDelta = normalizedDelta;
  chapter.intelChanges = applyIntelDelta(state.saveState, chapter.intelDelta, turn);
  applyStateDelta(state.saveState, normalizedDelta);

  const sp = chapter.statusPanel || {};
  state.saveState.status = isPlainObject(state.saveState.status) ? state.saveState.status : {};
  const readPercent = value => {
    if (typeof value === 'number') return value;
    const parsed = parseInt(String(value || '').replace(/[^0-9-]/g, ''), 10);
    return Number.isFinite(parsed) ? parsed : null;
  };
  const tension = readPercent(sp.tension);
  const intoxication = readPercent(sp.intoxication);
  if (tension !== null) state.saveState.status.tension = Math.max(0, Math.min(100, Math.round(tension)));
  if (intoxication !== null) state.saveState.status.tipsy = Math.max(0, Math.min(100, Math.round(intoxication)));

  const leadName = profile?.targetLeadName || profile?.targetLead || '徐令謙';
  if (FEATURES.favorability && normalizedDelta.relationshipChanges[leadName] === undefined) {
    const favDelta = Number(sp.favorabilityDelta);
    if (Number.isFinite(favDelta)) {
      state.saveState.relationships = isPlainObject(state.saveState.relationships) ? state.saveState.relationships : {};
      const current = Number(state.saveState.relationships[leadName]);
      state.saveState.relationships[leadName] = Math.max(0, Math.min(100,
        (Number.isFinite(current) ? current : 25) + Math.max(-5, Math.min(10, Math.round(favDelta)))));
    }
  }
  return chapter;
}

/**
 * 當前數值狀態。先前完全沒有送出 —— makeChoice 會把模型回傳的 statusPanel
 * 解析進 saveState（張力值、微醺度、好感度都存了），卻從來沒有餵回去，
 * 所以模型每回都在憑空重新發明數值而非延續，好感度尤其明顯：
 * 攻略了 40 回，模型並不知道現在是 38 還是 88。
 */
function buildLiveStateBlock(saveState, profile) {
  const st = saveState || {};
  const lines = ['【當前數值狀態（請延續這些數值，不要重新發明）】'];

  const pro = st.protagonist || {};
  lines.push(`- 生命值 ${pro.hp !== undefined ? pro.hp : 100} / 100 ｜ 理智值 ${pro.sanity !== undefined ? pro.sanity : 100} / 100`);

  if (st.status && (st.status.tension !== undefined || st.status.tipsy !== undefined)) {
    const bits = [];
    if (st.status.tension !== undefined) bits.push(`張力值 ${st.status.tension}%`);
    if (st.status.tipsy !== undefined) bits.push(`微醺度 ${st.status.tipsy}%`);
    lines.push(`- 上回結束時：${bits.join(' ｜ ')}（本回請由此接續變化，微醺度未飲酒則衰減）`);
  }

  const rels = st.relationships && typeof st.relationships === 'object' ? st.relationships : {};
  const relEntries = Object.keys(rels)
    .map(k => [k, Number(rels[k])])
    .filter(([, v]) => isFinite(v));
  if (FEATURES.favorability && relEntries.length) {
    const leadName = profile && profile.targetLeadName;
    // 主攻對象排最前面，其餘依好感度由高到低
    relEntries.sort((a, b) => (b[0] === leadName ? 1 : 0) - (a[0] === leadName ? 1 : 0) || b[1] - a[1]);
    lines.push(`- 好感度累積：${relEntries.map(([k, v]) => `${k} ${v}/100`).join('、')}`);
    lines.push('  （好感度是 40 回累積的結果，男主的態度親疏必須與此吻合，不可退回初識的疏離感）');
  }

  const usableIntel = ensureIntelLedger(st).filter(item => item.status === 'available');
  if (usableIntel.length) {
    lines.push('- 可用線索與談判籌碼（只有下列項目可被玩家使用；引用時必須沿用 ID）：');
    usableIntel.slice(-12).forEach(item => {
      lines.push(`  - [${item.id}] ${item.name}｜類型 ${item.type}｜可信度 ${item.confidence}｜來源 ${item.source}${item.effect ? `｜用途 ${item.effect}` : ''}`);
    });
  } else {
    lines.push('- 可用線索與談判籌碼：目前沒有。不得憑空聲稱玩家持有未取得的證據或權限。');
  }

  const flags = st.questFlags && typeof st.questFlags === 'object' ? st.questFlags : {};
  const flagKeys = Object.keys(flags).slice(-CONTEXT_BUDGET.questFlagsShown);
  if (flagKeys.length) {
    lines.push(`- 任務進展：${flagKeys.map(k => `${k}＝${flags[k]}`).join('；')}`);
  }

  return clampBlock(lines.join('\n'), CONTEXT_BUDGET.liveStateChars);
}

// ==========================================
// 4.6 語意記憶模組（bge-m3 嵌入檢索 ＋ span-01-lite 糾察隊）
// ==========================================
/**
 * 為什麼需要獨立的記憶庫：
 *  - 摘要池是「壓縮」，會把細節磨平。
 *  - 近期全文只看得到最後 5 回。
 *  - 章節本身會被壓縮：超過 30 回的正文截成 240 字，超過 60 回整章移出記憶。
 * 因此第 61 回之後，第 1 回立下的約定就徹底看不到了。
 *
 * 記憶庫把每回的關鍵事實另存成精簡條目（存在 saveState，隨存檔同步到雲端），
 * 不隨章節壓縮而消失。條目有兩種：
 *  - fact ：模型在同一次生成中順手產出的 memoryNotes（承諾、物品去向、身分揭露、
 *           關係轉折）。不需要額外呼叫模型。
 *  - scene：該回的場景摘錄，作為事實之外的情境線索。
 *
 * 每回生成前，用 bge-m3 把「本回行動＋上一回結尾」當查詢，撈回最相關的條目；
 * 生成後，span-01-lite 在背景比對正文與設定、記憶是否矛盾，
 * 結果寫進下一回的提示詞 —— 不重新生成本回。
 */
const MEMORY = {
  maxFacts: 1000,          // 約 60 字／則，1,000 則約 60KB；每回 3–4 則，可涵蓋 250 回以上
  maxScenes: 120,
  maxSummaries: 1000,      // 逐回摘要，每回一則、50 字內
  factChars: 120,          // 模型常寫到 70–90 字；60 字上限曾把約定的時間地點截掉
  sceneChars: 260,
  topK: 6,                 // 撈回幾則。太多會擠壓近期全文的份量。
  maxScenes: 2,            // 場景條目長且不精確，最多佔兩則，其餘名額留給事實
  scenePenalty: 0.04,      // 場景條目的分數折扣：同樣相關時優先採用精簡的事實
  minScore: 0.42,          // 低於此分數視為不相關，寧可不補也不要餵雜訊。
  batchSize: 64            // 與 Worker 的 EMBED_MAX_BATCH 一致
};

/** id -> 向量。只存在本次工作階段；重載後按需重新嵌入（Workers AI 成本極低）。 */
const memoryVectors = new Map();

async function embedTexts(texts) {
  if (!LLM_CONFIG.WORKER_URL || !texts.length) return [];
  const res = await fetch(LLM_CONFIG.WORKER_URL.replace(/\/$/, '') + '/embed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Undercurrent-Token': state.token || ''
    },
    body: JSON.stringify({ text: texts })
  });
  if (!res.ok) throw new Error('嵌入服務回應 ' + res.status);
  const data = await res.json();
  return (data?.data || []).map(v => Array.isArray(v) ? v : (v?.embedding || []));
}

function cosineSimilarity(a, b) {
  if (!a?.length || !b?.length || a.length !== b.length) return 0;
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function getMemoryBank() {
  if (!state.saveState) return [];
  if (!Array.isArray(state.saveState.memoryBank)) state.saveState.memoryBank = [];
  return state.saveState.memoryBank;
}

function normalizeMemoryKey(text) {
  return String(text || '').replace(/[\s，。、！？「」『』：；,.!?:;]/g, '');
}

/** 依類型各自限量；事實比場景珍貴，各自保留最新的若干筆。 */
function trimMemoryBank(bank) {
  const facts = bank.filter(m => m.kind === 'fact').slice(-MEMORY.maxFacts);
  const scenes = bank.filter(m => m.kind === 'scene').slice(-MEMORY.maxScenes);
  const summaries = bank.filter(m => m.kind === 'summary').slice(-MEMORY.maxSummaries);
  return [...facts, ...scenes, ...summaries].sort((a, b) => a.turn - b.turn);
}

/**
 * 把剛被採用的章節寫入記憶庫。
 * 同一回合重新生成時，先移除該回合（含之後）的舊條目，避免被丟棄的版本殘留。
 */
function rememberChapter(chapter) {
  if (!chapter || !state.saveState) return;
  const turn = Number(chapter.turn) || Number(state.saveState.turnCount) || 1;
  const bank = getMemoryBank().filter(m => m.turn < turn);
  const seen = new Set(bank.filter(m => m.kind === 'fact').map(m => normalizeMemoryKey(m.text)));

  const notes = Array.isArray(chapter.memoryNotes) ? chapter.memoryNotes : [];
  notes.slice(0, 4).forEach((note, i) => {
    // 接受 { topic, fact } 或純字串（舊格式／模型偶爾省略主題）
    const rawFact = typeof note === 'string' ? note : (note && (note.fact || note.text)) || '';
    const rawTopic = typeof note === 'string' ? '' : (note && note.topic) || '';
    const text = clampBlock(polishTaiwaneseText(String(rawFact).trim()), MEMORY.factChars);
    const topic = clampBlock(polishTaiwaneseText(String(rawTopic).trim()), 16);
    const key = normalizeMemoryKey(text);
    if (text.length < 6 || seen.has(key)) return;
    seen.add(key);
    bank.push({ id: `t${turn}_f${i}`, turn, kind: 'fact', text, ...(topic ? { topic } : {}) });
  });

  const prose = String(chapter.prose || '').replace(/\s+/g, ' ').trim();
  if (prose.length >= 40) {
    const head = chapter.chosenLabel ? `玩家行動：${clampBlock(chapter.chosenLabel, 40)}。` : '';
    bank.push({ id: `t${turn}_s`, turn, kind: 'scene', text: head + clampBlock(prose, MEMORY.sceneChars) });
  }
  state.saveState.memoryBank = trimMemoryBank(bank);
}

/** 舊存檔沒有記憶庫：從現存章節回填場景條目，讓檢索立即可用。 */
function backfillMemoryBank() {
  if (!state.saveState || getMemoryBank().length) return;
  (state.chapterHistoryList || []).forEach((chapter, index) => {
    const turn = Number(chapter?.turn) || index + 1;
    const prose = String(chapter?.prose || '').replace(/\s+/g, ' ').trim();
    if (prose.length < 40) return;
    const head = chapter.chosenLabel ? `玩家行動：${clampBlock(chapter.chosenLabel, 40)}。` : '';
    getMemoryBank().push({ id: `t${turn}_s`, turn, kind: 'scene', text: head + clampBlock(prose, MEMORY.sceneChars) });
  });
  state.saveState.memoryBank = trimMemoryBank(getMemoryBank());
}

async function ensureMemoryVectors(entries) {
  const missing = entries.filter(m => !memoryVectors.has(m.id));
  for (let i = 0; i < missing.length; i += MEMORY.batchSize) {
    const slice = missing.slice(i, i + MEMORY.batchSize);
    const vectors = await embedTexts(slice.map(m => m.text));
    slice.forEach((m, j) => { if (vectors[j]?.length) memoryVectors.set(m.id, vectors[j]); });
  }
}

/** 以語意相似度排序記憶；場景條目打折並限量，名額優先給精簡的事實。 */
async function rankMemories(queryText, candidates, topK = MEMORY.topK) {
  if (!candidates.length) return [];
  await ensureMemoryVectors(candidates);
  const [queryVec] = await embedTexts([queryText]);
  if (!queryVec?.length) return [];
  const scored = candidates
    .map(m => {
      const raw = cosineSimilarity(queryVec, memoryVectors.get(m.id));
      return { ...m, score: raw, rank: m.kind === 'scene' ? raw - MEMORY.scenePenalty : raw };
    })
    .filter(m => m.score >= MEMORY.minScore)
    .sort((a, b) => b.rank - a.rank);
  const picked = [];
  let scenes = 0;
  for (const m of scored) {
    if (m.kind === 'scene') {
      if (scenes >= MEMORY.maxScenes) continue;
      scenes += 1;
    }
    picked.push(m);
    if (picked.length >= topK) break;
  }
  return picked;
}

/** 本回實際注入提示詞的記憶。糾察隊會拿它來比對正文有沒有寫錯。 */
let lastRetrievedMemories = [];

/**
 * 依本回行動撈回最相關的舊記憶。
 * 近期 N 回已經全文在信封裡，重複撈回只是浪費預算，故只檢索更早的回合。
 * 檢索失敗一律回空字串 —— 少了補充記憶只是劇情略平，
 * 但若讓它拋出例外中斷生成，玩家會直接失去這一回。
 */
async function buildRetrievedMemoryBlock(queryText) {
  lastRetrievedMemories = [];
  const action = String(queryText || '').trim();
  if (!action || !state.saveState) return '';
  try {
    backfillMemoryBank();
    const currentTurn = Number(state.saveState.turnCount) || 1;
    const windowStart = currentTurn - CONTEXT_BUDGET.recentTurns;
    const bank = getMemoryBank();
    // 已有逐回摘要的回合，不再用較長、較不精準的場景摘錄
    const summarizedTurns = new Set(bank.filter(m => m.kind === 'summary').map(m => m.turn));
    const candidates = bank.filter(m => m.turn < currentTurn
      && (m.kind === 'fact' || m.turn < windowStart)
      && !(m.kind === 'scene' && summarizedTurns.has(m.turn)));
    if (!candidates.length) return '';

    // 查詢只用本回行動。曾經混入「上一回結尾」，結果檢索被上一回的話題帶偏
    // （實測問「赴約」卻撈回上一回的「手沖咖啡」）；上一回本來就以全文在提示詞裡，不需要再撈。
    const ranked = await rankMemories(clampBlock(action, 160), candidates);
    if (!ranked.length) return '';
    lastRetrievedMemories = ranked;

    const facts = ranked.filter(m => m.kind === 'fact').sort((a, b) => a.turn - b.turn);
    const summaries = ranked.filter(m => m.kind === 'summary').sort((a, b) => a.turn - b.turn);
    const scenes = ranked.filter(m => m.kind === 'scene').sort((a, b) => a.turn - b.turn);
    const lines = ['【語意檢索記憶（與本回行動相關的早期劇情；與之矛盾即為錯誤，務必保持一致）】'];
    if (facts.length) {
      lines.push('已確立的事實：');
      facts.forEach(m => lines.push(`- 第 ${m.turn} 回：${m.text}`));
    }
    if (summaries.length) {
      lines.push('相關回合：');
      summaries.forEach(m => lines.push(`- 第 ${m.turn} 回：${m.text}`));
    }
    if (scenes.length) {
      lines.push('相關場景：');
      scenes.forEach(m => lines.push(`- 第 ${m.turn} 回：${m.text}`));
    }
    return lines.join('\n') + '\n';
  } catch (err) {
    console.warn('[Memory] 檢索失敗，本回改用既有上下文：', err);
    return '';
  }
}

// ------------------------------------------
// 糾察隊：span-01-lite（行為評分分類器，免費、約 0.5 秒）
// ------------------------------------------
/**
 * 實測（2026-10-03）的結論與設計取捨：
 *  - 一題籠統的「有沒有矛盾」只抓得到一半的矛盾。
 *  - 每條事實單獨一題可全數抓到，但「沒提到」常被誤判為矛盾（誤報 8/29）。
 *  - 每條事實拆成「有沒有寫到」＋「有沒有寫錯」兩題、兩題都過門檻才算，
 *    誤報降到 1/34。有寫到且寫對時矛盾機率僅 0.05–0.15，寫錯時 0.67–0.94，界線清楚。
 *  - 它只接受是非題（noul），一次最多 12 題，平行作答。
 *
 * 準度足以「指出問題」，不足以「判整章作廢」。所以結果只寫進下一回提示詞，
 * 由模型在後續自然修正，本回不重新生成。
 */
const PATROL = {
  model: 'respan/span-01-lite',
  mentionThreshold: 0.4,
  contradictThreshold: 0.6,
  maxFactsPerCall: 5,      // 5 條 × 2 題 ＋ 2 題通用檢查 = 12 題上限
  maxCalls: 3,
  memoryFacts: 6,          // 每回最多比對幾條過去的記憶事實
  personaChecks: 3,        // 每回最多檢查幾位出場角色的語氣與性格
  personaThreshold: 0.7,
  timeoutMs: 6000
};

/** 從出場角色的官方設定抽出可檢查的硬性事實（座車、眼鏡、職銜）。 */
function collectCanonFactsForProse(prose) {
  const facts = [];
  Object.values(OFFICIAL_DRIVE_CHARACTERS || {}).forEach(c => {
    if (!c?.name || !prose.includes(c.name)) return;
    if (c.cars) facts.push({ topic: `${c.name}開或搭乘的車`, fact: `${c.name}的座車：${clampBlock(c.cars, 70)}` });
    const canon = Object.entries(CHARACTER_CANON_RULES).find(([key]) => OFFICIAL_DRIVE_CHARACTERS[key] === c);
    if (canon) {
      const rule = canon[1];
      facts.push({
        topic: `${c.name}臉上有沒有戴眼鏡`,
        fact: rule.glasses ? `${c.name}會戴眼鏡（${rule.glasses}）` : `${c.name}不戴眼鏡`
      });
    }
    if (c.title) facts.push({ topic: `${c.name}的職業或職銜`, fact: `${c.name}是${clampBlock(c.title, 50)}` });
  });
  return facts;
}

async function callDecisions(questions, stateText) {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), PATROL.timeoutMs) : null;
  try {
    const res = await fetch(LLM_CONFIG.WORKER_URL.replace(/\/$/, '') + '/decide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Undercurrent-Token': state.token || '' },
      body: JSON.stringify({ model: PATROL.model, questions, state: stateText }),
      ...(controller ? { signal: controller.signal } : {})
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data && data.answers ? data.answers : null;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * 背景糾察：比對正文與設定、檢索到的記憶，並檢查是否回應玩家行動、是否灌水或混入說明。
 * 回傳要寫進下一回提示詞的更正事項（字串陣列）。任何失敗都回空陣列，不影響遊玩。
 */
async function runContinuityPatrol(chapter, actionLabel, memories) {
  const prose = String(chapter?.prose || '');
  if (!prose || !LLM_CONFIG.WORKER_URL) return [];
  try {
    // 要檢查的是「這一章寫到的東西有沒有跟過去矛盾」，所以拿正文本身去找相關記憶，
    // 而不是只用玩家行動撈到的那批（實測後者會漏掉正文另外寫到的物品與約定）。
    const turn = Number(chapter.turn) || Number(state.saveState?.turnCount) || 0;
    const pastFacts = getMemoryBank().filter(m => m.kind === 'fact' && m.turn < turn);
    let related = [];
    try {
      related = await rankMemories(clampBlock(prose, 1200), pastFacts, PATROL.memoryFacts);
    } catch (e) { related = []; }
    const memoryFacts = [...related, ...(memories || []).filter(m => m.kind === 'fact')]
      .filter((m, i, arr) => arr.findIndex(x => x.id === m.id) === i)
      // 沒有主題的事實不檢查：拿整句話當「是否提及」的主題，實測提及機率只有 0.08–0.18，
      // 等於永遠判定沒提到；而單看矛盾機率又沒有鑑別力（無關記憶也有 0.85 以上）。
      .filter(m => m.topic)
      .slice(0, PATROL.memoryFacts)
      .map(m => ({ topic: m.topic, fact: m.text, source: `第 ${m.turn} 回記憶` }));
    const facts = [
      ...collectCanonFactsForProse(prose).map(f => ({ ...f, source: '角色設定' })),
      ...memoryFacts
    ].slice(0, PATROL.maxFactsPerCall * PATROL.maxCalls);

    const general = {
      g_action: {
        type: 'noul',
        instructions: `玩家這一回選擇的行動是「${clampBlock(actionLabel, 80)}」。正文是否描寫了這個行動的執行與後果？`,
        criteria: { true: '正文描寫了玩家行動的執行與後果', false: '正文忽略、跳過或改寫了玩家的行動' }
      },
      g_padding: {
        type: 'noul',
        instructions: '正文是否有灌水：重複描寫同一件事、反覆重述已知資訊，或堆疊空洞形容而沒有推進劇情？',
        criteria: { true: '有明顯的重複或灌水段落', false: '每一段都在推進劇情或提供新資訊' }
      }
    };

    const groups = [];
    for (let i = 0; i < Math.max(facts.length, 1); i += PATROL.maxFactsPerCall) {
      groups.push(facts.slice(i, i + PATROL.maxFactsPerCall));
    }
    const results = await Promise.all(groups.map((group, gi) => {
      const questions = gi === 0 ? { ...general } : {};
      group.forEach((f, i) => {
        questions[`m${i}`] = {
          type: 'noul',
          instructions: `正文是否具體描寫了「${f.topic}」？`,
          criteria: { true: `正文有具體寫到${f.topic}`, false: `正文完全沒有寫到${f.topic}` }
        };
        questions[`c${i}`] = {
          type: 'noul',
          instructions: `既定事實是「${f.fact}」。正文寫到的內容是否與這條事實不同？`,
          criteria: { true: `正文寫的與「${f.fact}」不同`, false: `正文寫的與「${f.fact}」相同，或沒有寫到` }
        };
      });
      if (!Object.keys(questions).length) return Promise.resolve(null);
      return callDecisions(questions, `【新章節正文】\n${clampBlock(prose, 6000)}`)
        .then(answers => ({ group, answers }));
    }));

    // 語氣與性格：實測（2026-10-03）符合人設時 0.15–0.31、明顯崩壞時 0.92–0.96，界線清楚。
    // 細微漂移的準度較低，那部分交給每 5 回的人設校準。
    const personaTargets = Object.values(OFFICIAL_DRIVE_CHARACTERS)
      .filter(c => c?.name && prose.includes(c.name) && c.personality)
      .slice(0, PATROL.personaChecks);
    const personaPromise = personaTargets.length ? (() => {
      const q = {};
      personaTargets.forEach((c, i) => {
        const v = getCharacterVoice(c.key);
        const persona = v
          ? `${v.core} 語氣：${v.tone} 言談：${v.speech}${v.ooc?.length ? ' 絕不會：' + v.ooc.slice(0, 3).join('；') : ''}`
          : `${c.title || ''}。${c.personality}${c.speechExamples?.[0] ? ' 例句：' + c.speechExamples[0] : ''}`;
        q[`v${i}`] = {
          type: 'noul',
          instructions: `角色設定：${c.name}——${clampBlock(persona, 260)}\n正文中${c.name}的說話語氣與用詞，是否明顯不符合這個設定？`,
          criteria: { true: `${c.name}的語氣或用詞明顯偏離設定（例如變得油滑、撒嬌、粗俗或浮誇）`, false: `${c.name}的語氣與用詞符合設定` }
        };
        q[`b${i}`] = {
          type: 'noul',
          instructions: `角色設定：${c.name}——${clampBlock(persona, 260)}\n正文中${c.name}的行為與態度，是否明顯違背這個設定的性格？`,
          criteria: { true: `${c.name}的行為明顯違背設定的性格`, false: `${c.name}的行為符合設定的性格` }
        };
      });
      return callDecisions(q, `【新章節正文】\n${clampBlock(prose, 6000)}`).catch(() => null);
    })() : Promise.resolve(null);

    const notes = [];
    lastPatrolReport = [];
    const personaAnswers = await personaPromise;
    if (personaAnswers) {
      personaTargets.forEach((c, i) => {
        const v = personaAnswers[`v${i}`]?.noul ?? 0;
        const b = personaAnswers[`b${i}`]?.noul ?? 0;
        lastPatrolReport.push({ fact: `${c.name} 語氣／行為`, source: '人設', mention: 1, contradict: Math.max(v, b) });
        if (v >= PATROL.personaThreshold || b >= PATROL.personaThreshold) {
          const what = [v >= PATROL.personaThreshold ? '說話語氣' : '', b >= PATROL.personaThreshold ? '行為態度' : ''].filter(Boolean).join('與');
          const v = getCharacterVoice(c.key);
          const target = v ? `${v.tone} ${v.speech}` : c.personality;
          const ref = v?.examples?.intimate?.[0] || v?.examples?.public?.[0] || c.speechExamples?.[0];
          notes.push(`上一回${c.name}的${what}偏離人設。本回回到設定：${clampBlock(target, 110)}${ref ? '（語調參考：「' + String(ref).replace(/^「|」$/g, '') + '」）' : ''}`);
        }
      });
    }
    results.forEach((r, gi) => {
      if (!r || !r.answers) return;
      r.group.forEach((f, i) => {
        const m = r.answers[`m${i}`]?.noul ?? 0;
        const c = r.answers[`c${i}`]?.noul ?? 0;
        lastPatrolReport.push({ fact: f.fact, source: f.source, mention: m, contradict: c });
        if (m >= PATROL.mentionThreshold && c >= PATROL.contradictThreshold) {
          notes.push(`上一回可能把「${f.topic}」寫錯了，正確應為：${f.fact}。本回以正確設定為準，必要時自然帶過，不要點破。`);
        }
      });
      if (gi === 0) {
        if ((r.answers.g_action?.noul ?? 1) < 0.3) {
          notes.push(`上一回沒有確實寫出玩家選擇的行動「${clampBlock(actionLabel, 40)}」的結果，本回開頭先交代它的後果。`);
        }
        if ((r.answers.g_padding?.noul ?? 0) >= 0.8) {
          notes.push('上一回有重複或灌水的段落，本回每一段都要推進劇情或提供新資訊。');
        }
      }
    });
    if (notes.length) console.info(`[Patrol] 糾察隊發現 ${notes.length} 項，將寫入下一回提示詞：`, notes);
    return notes;
  } catch (err) {
    console.warn('[Patrol] 糾察隊檢查失敗（不影響遊玩）：', err);
    return [];
  }
}

// ------------------------------------------
// 逐回摘要（每回 50 字內，背景生成）
// ------------------------------------------
/**
 * 每回結束後在背景請模型寫一句 50 字內的摘要，不擋畫面、不影響下一回送出。
 * 三個用途：
 *  - 劇情時間軸：較早回合的摘要放進提示詞，讓模型知道「整局走到哪裡」
 *  - 語意檢索：存進記憶庫（kind: summary），比場景摘錄更精準
 *  - 玩家查看：顯示在章節導覽；超過 60 回、章節已移出記憶的回合也看得到
 */
const TURN_SUMMARY_MAX_CHARS = 50;

function clampTurnSummary(text) {
  let t = polishTaiwaneseText(String(text || '').replace(/^[「『"]|[」』"]$/g, '').replace(/\s+/g, '').trim());
  if (t.length <= TURN_SUMMARY_MAX_CHARS) return t;
  // 超過上限時從最後一個標點斷開，不在字詞中間截斷
  const cut = t.slice(0, TURN_SUMMARY_MAX_CHARS);
  const p = Math.max(cut.lastIndexOf('，'), cut.lastIndexOf('。'), cut.lastIndexOf('；'));
  return p >= 20 ? cut.slice(0, p) + '。' : cut;
}

function rememberTurnSummary(turn, text) {
  if (!state.saveState || !text) return;
  const bank = getMemoryBank().filter(m => !(m.kind === 'summary' && m.turn === turn));
  bank.push({ id: `t${turn}_m`, turn, kind: 'summary', text });
  state.saveState.memoryBank = trimMemoryBank(bank);
}

async function generateTurnSummary(chapter) {
  // 正文多半只用「他」「妳」稱呼，摘要模型曾因此自行編造名字（「周聿」「林靖」「陳默」），
  // 而這些摘要會寫進記憶庫與時間軸，必須明確告知人物是誰
  const profile = typeof getActivePlayerProfile === 'function' ? getActivePlayerProfile() : {};
  const playerName = profile?.name || '女主角';
  const leadName = profile?.targetLeadName && profile.targetLeadName !== '修羅場' ? profile.targetLeadName : '';
  const cast = `女主角（玩家，正文中的「妳」）是${playerName}${leadName ? `；主要男主角（正文中的「他」）是${leadName}` : ''}。`;
  const raw = await requestWorkerCompletion({
    model: LLM_CONFIG.SUMMARY_MODEL,
    system: `用台灣繁體中文寫一句 50 字以內的本回摘要：誰、做了什麼、結果如何。${cast}只能使用上述人名或正文中明確出現的人名，不可編造名字。不寫形容與評論，只輸出那一句。${TW_PLAIN_STYLE_RULE}`,
    user: `玩家行動：${clampBlock(chapter.chosenLabel || '', 80)}\n\n本回正文：\n${clampBlock(chapter.prose, 2400)}`,
    maxTokens: 150,
    temperature: 0.2,
    timeoutMs: 45000
  });
  return clampTurnSummary(raw);
}

function scheduleTurnSummary(chapter) {
  const turn = Number(chapter?.turn) || 0;
  if (!turn || !chapter?.prose) return;
  generateTurnSummary(chapter).then(summary => {
    if (!summary || summary.length < 6) return;
    // 生成期間玩家可能已回溯或換檔；只寫回仍存在的同一回合
    const record = (state.chapterHistoryList || []).find(ch => Number(ch.turn) === turn);
    if (!record || record.prose !== chapter.prose) return;
    record.turnSummary = summary;
    if (state.chapterData && Number(state.chapterData.turn) === turn) state.chapterData.turnSummary = summary;
    rememberTurnSummary(turn, summary);
    persistChapterHistory(state.chapterHistoryList);
    safeLocalStorageSet('undercurrent_current_save_state', JSON.stringify(state.saveState));
    const nav = document.getElementById('chapter-nav-list');
    if (nav && nav.offsetParent !== null) renderChapterNavList();
  }).catch(err => console.warn('[TurnSummary] 第 ' + turn + ' 回摘要生成失敗（不影響遊玩）：', err.message));
}

/**
 * 舊存檔沒有逐回摘要：續玩時在背景補最近 10 回。
 * 一次一則依序進行，生成中就暫停，避免和正文生成搶排隊名額。
 */
let turnSummaryBackfillRunning = false;
async function backfillTurnSummaries(limit = 10) {
  if (turnSummaryBackfillRunning || !state.token || state.token.startsWith('tok_local_')) return;
  turnSummaryBackfillRunning = true;
  try {
    backfillMemoryBank();
    const pending = (state.chapterHistoryList || [])
      .filter(ch => ch && !ch.turnSummary && !ch.proseArchived && String(ch.prose || '').length > 80)
      .slice(-limit);
    for (const ch of pending) {
      if (state.isGenerating) break;
      const summary = await generateTurnSummary(ch).catch(() => '');
      if (!summary || summary.length < 6) continue;
      ch.turnSummary = summary;
      rememberTurnSummary(Number(ch.turn), summary);
    }
    if (pending.length) {
      persistChapterHistory(state.chapterHistoryList);
      safeLocalStorageSet('undercurrent_current_save_state', JSON.stringify(state.saveState));
    }
  } finally {
    turnSummaryBackfillRunning = false;
  }
}

/**
 * 劇情時間軸：近期全文窗口之前的回合，各用一句摘要串起來。
 * 更早的劇情由摘要池與幕篇檔案涵蓋，這裡只放最近 40 回，約 2,000 字。
 */
function buildTurnTimelineBlock(currentTurn) {
  const windowStart = (Number(currentTurn) || 1) - CONTEXT_BUDGET.recentTurns;
  const items = getMemoryBank()
    .filter(m => m.kind === 'summary' && m.turn < windowStart)
    .sort((a, b) => a.turn - b.turn)
    .slice(-40);
  if (!items.length) return '';
  return `【劇情時間軸（較早回合的逐回摘要）】\n${items.map(m => `第 ${m.turn} 回：${m.text}`).join('\n')}\n`;
}

/**
 * 章節採用後立刻在背景啟動糾察，不阻塞畫面。
 * 結果存進 saveState，下一回組提示詞時讀取；下一回若在糾察完成前就送出，最多等待片刻。
 */
let pendingPatrol = null;
/** 最近一次糾察的逐條原始機率，供除錯（主控台輸入 lastPatrolReport 即可查看）。 */
let lastPatrolReport = [];
function scheduleContinuityPatrol(chapter, actionLabel) {
  const memories = lastRetrievedMemories.slice();
  const turn = Number(chapter?.turn) || 0;
  pendingPatrol = runContinuityPatrol(chapter, actionLabel, memories).then(notes => {
    if (state.saveState && Number(state.saveState.turnCount) === turn) {
      state.saveState.patrolNotes = { turn, notes };
      safeLocalStorageSet('undercurrent_current_save_state', JSON.stringify(state.saveState));
    }
    return notes;
  });
}

async function buildPatrolCorrectionBlock() {
  if (pendingPatrol) {
    await Promise.race([pendingPatrol, new Promise(r => setTimeout(r, 2500))]).catch(() => {});
  }
  const record = state.saveState?.patrolNotes;
  const currentTurn = Number(state.saveState?.turnCount) || 0;
  // 只採用「上一回」的糾察結果；更早的已經被那一回的生成處理過了
  if (!record || record.turn !== currentTurn - 1 || !record.notes?.length) return '';
  return `【連續性更正（糾察隊比對上一回正文發現；本回必須遵守）】\n${record.notes.map(n => `- ${n}`).join('\n')}\n`;
}

// =========================================================================
// 4.5 三層角色動態注入引擎與長期滾動摘要池 (Tiered Lore & Memory Pipeline)
// =========================================================================

const CHARACTER_IDENTITY_FIREWALL = `
【13 位官方男主身分、職業、外貌與座車不可撼動防火牆（100% 絕對對標，嚴禁混淆與張冠李戴）】：
1. 徐令謙（35歲）：玄辰幫二把手 · 直屬堂口天裕會首領 · 德行法律事務所顧問。【黑道商業操盤教父，配戴復古圓眼鏡（工作場合才戴）。座車：私人坦桑石藍 BMW X6 M60i / 公務深銀灰 BMW M760i xDrive。絕非檢警】
2. 韓正寰（35歲）：士林地檢署檢察官 · 白日判官。【全劇唯一檢察官，無戴眼鏡！短而硬挺油頭、小麥色皮膚、法袍/無褶白襯衫。座車：白色 Škoda Enyaq Coupe。絕非警察、律師或黑道】
3. 邵翊衡（37歲）：昱合策略執行長 · 政媒幕後操盤者 · 頂級輿情顧問。【配戴暗銀色細方框眼鏡。座車：私人黑曜金 Porsche 911 Carrera 4 GTS / 公務黑色 Audi A8】
4. 楊紹宸（28歲）：弘楊集團副總 · 執行董事 · 物流貿易事業群總經理（楊副總/二哥，無戴眼鏡！【絕非少東！】座車：私人鐵灰 Audi RS7 / 公務黑色 Benz S680 配司機，【絕非邁巴赫！】）
5. 徐宇寧（28歲）：明隱牙醫診所院長 · 專職牙醫師 · 學生時代射擊隊空氣手槍好手（徐令謙遠房堂弟、楊紹宸薇閣國高中同班同學）。【專職牙醫師！無戴眼鏡！單眼皮笑起來眼尾微彎。不穿白袍（診所淺灰深藍制服/私服亞麻襯衫搭寬褲）。性格很 Chill、幽默調皮、溫柔細膩、撩人無形。座車：淺灰藍 Volvo XC60。【嚴禁當成全科醫生、內外科密醫或拎急救醫藥箱到處量血壓心率！】】
6. 林政修（41歲）：法務部政務次長（林次）。【司法體制頂層掌舵者，無戴眼鏡！座車：公務曜石黑 Benz S-Class L 350d】
7. 沈湛然（36歲）：台大醫院精神醫學部主治醫師 · 司法精神醫學權威。【全劇唯一精神科醫師，在台大醫院上班，無個人診所，非院長非外科，無戴眼鏡！座車：私人極光鈦 Lexus ES 300h】
8. 江瀚文（36歲）：鼎曜媒體集團執行長。【傳媒大亨，無戴眼鏡！座車：私人銀灰 Aston Martin DBS】
9. 吳衛廷（42歲）：最大在野黨立法委員（台北市舊城區/萬華）· 國會喬王。【全劇唯一許可草莽粗話與台語交織，無戴眼鏡！座車：公務 Toyota Alphard / 私人 Benz E-Class】
10. 徐承勳（47歲）：中華民國副總統 · 科技經濟巨擘。【配戴極細鈦金屬無框眼鏡。座車：公務防彈 Audi A8 L Security / 私人克爾巴阡灰 Jaguar F-Type COUPÉ R75】
11. 徐耀南（57歲）：榮南營造集團董事長（榮南王）。【營造地產教父，無戴眼鏡！座車：公務絲絨棕 Benz S450 4Matic L 配專屬司機】
12. 徐若宸（22歲）：榮南營造家族長子 · 中興大學企管所研究生（徐耀南長子）。【明確無配戴眼鏡！清瘦挺拔、乾淨知性。座車：金屬莫蘭迪綠 VW T-Roc】
13. 徐予澈（29歲）：亞洲頂級男團 HapSTer 主唱兼領舞（藝名徐泰希 / 化名 Hans）。【沒有戴眼鏡！私下出門常戴墨鏡、戴簡約銀飾。私下呆萌慢熱、粗線條。座車：Benz V-Class / Benz G500 / Volvo 1800S】

【全角色眼鏡配戴唯一真理清單】：
- 戴眼鏡的角色只有 3 位：徐令謙（復古圓眼鏡）、邵翊衡（細方框眼鏡）、徐承勳（極細無框眼鏡）。
- 其餘角色（徐宇寧、楊紹宸、韓正寰、林政修、沈湛然、江瀚文、吳衛廷、徐耀南、徐若宸、徐予澈、楊慕璃）全部【沒有配戴眼鏡】，嚴禁隨意描寫戴眼鏡或摘拭眼鏡！
`;

const ROSTER_ONE_LINERS = [
  { id: "01_徐令謙", name: "徐令謙", aliases: ["徐令謙", "徐顧問", "謙哥", "令謙", "天裕會"], role: "玄辰幫二把手 · 天裕會中樞 · 幕後操盤者", oneLiner: "冷靜自持、極有分寸的政商秩序操盤者，工作場合戴復古圓眼鏡，座車坦桑石藍 BMW X6 / 深銀灰 BMW M760i；不必提高音量便有十足份量，對所愛之人給予自由並默默承擔一切風險。" },
  { id: "02_韓正寰", name: "韓正寰", aliases: ["韓正寰", "韓檢", "正寰", "士林地檢署", "白日判官"], role: "士林地檢署檢察官 · 白日判官", oneLiner: "冷峻禁慾的司法利刃，無眼鏡、短油頭法袍，座車白色 Škoda Enyaq Coupe，在正義守護與私慾佔有邊界極限拉扯。" },
  { id: "03_邵翊衡", name: "邵翊衡", aliases: ["邵翊衡", "邵顧問", "翊衡", "昱合策略"], role: "昱合策略執行長 · 政媒幕後操盤者 · 頂級輿情顧問", oneLiner: "溫潤優雅的政媒策士，戴暗銀色細方框眼鏡，座車 Porsche 911 / Audi A8，帶著溫和面具的無聲支配者。" },
  { id: "04_楊紹宸", name: "楊紹宸", aliases: ["楊紹宸", "楊副總", "副總", "紹宸", "二哥"], role: "弘楊集團副總 · 執行董事 · 物流貿易總經理", oneLiner: "深沉銳利的集團副總（絕非少東！無眼鏡），掌管灰色物流通道，座車 Audi RS7 / 黑色 Benz S680（絕非邁巴赫），笑著做局、極度疼愛妹妹。" },
  { id: "05_徐宇寧", name: "徐宇寧", aliases: ["徐宇寧", "宇寧", "明隱牙醫", "徐醫師", "徐院長"], role: "明隱牙醫診所院長 · 專職牙醫師 · 楊紹宸國高中同班同學", oneLiner: "專職牙醫師（無眼鏡！不穿白袍，淺灰深藍制服/亞麻襯衫，座車淺灰藍 Volvo XC60）。很 Chill、幽默調皮、溫柔細膩、撩人無形。【絕非全科醫生/密醫，嚴禁拎醫藥箱到處量血壓！】" },
  { id: "06_林政修", name: "林政修", aliases: ["林政修", "林次", "政修", "法務部次長"], role: "法務部政務次長 · 法界明星官僚", oneLiner: "面帶微笑、優雅斯文的法務部次長（無眼鏡，座車 Benz S-Class L 350d），笑著說狠話，用邏輯與修辭控場。" },
  { id: "07_沈湛然", name: "沈湛然", aliases: ["沈湛然", "沈醫師", "湛然", "台大精神科"], role: "台大醫院精神醫學部主治名醫 · 司法精神醫學權威", oneLiner: "台大醫院精神醫學主治醫師（無眼鏡，座車 Lexus ES 300h），洞悉人性的深淵凝視者，能輕易看穿防禦與隱密慾望。" },
  { id: "08_江瀚文", name: "江瀚文", aliases: ["江瀚文", "江執行長", "江總", "瀚文", "Ethan", "鼎曜傳媒"], role: "鼎曜媒體集團執行長 · 傳媒巨擘", oneLiner: "傳媒娛樂大亨（無眼鏡，座車 Aston Martin DBS），擅長資本運作、公關風向與鏡頭下的致命曖昧。" },
  { id: "09_吳衛廷", name: "吳衛廷", aliases: ["吳衛廷", "吳委員", "衛廷", "衛廷哥", "在野黨立委"], role: "立法院司法及法制委員會立法委員 · 國會喬王", oneLiner: "深諳基層利益與國會黑幕的實權立委（無眼鏡，座車 Toyota Alphard / Benz E-Class），江湖草莽氣質與政治手腕並存，唯一可講粗話。" },
  { id: "10_徐承勳", name: "徐承勳", aliases: ["徐承勳", "副總統", "承勳", "副總統徐承勳"], role: "中華民國副總統 · 科技經濟巨擘", oneLiner: "成熟禁慾的政壇巔峰男性（戴極細鈦金屬無框眼鏡，座車防彈裝甲 Audi A8 L / Jaguar F-Type），身處權力牢籠，深邃孤獨且極具威儀。" },
  { id: "11_徐耀南", name: "徐耀南", aliases: ["徐耀南", "徐董", "耀南", "榮南王", "榮南營造"], role: "榮南營造集團董事長 · 中部營造霸主", oneLiner: "白手起家的商界梟雄（無眼鏡，座車絲絨棕 Benz S450 4Matic L 配司機），冷峻威嚴，帶有濃烈宗族家長權威。" },
  { id: "12_徐若宸", name: "徐若宸", aliases: ["徐若宸", "若宸", "小徐總"], role: "榮南營造家族長子 · 中興企管所研究生", oneLiner: "知性清雅貴公子（明確無眼鏡！座車金屬莫蘭迪綠 VW T-Roc），清瘦內斂，內心壓抑著深沉的情感叛逆。" },
  { id: "13_徐予澈", name: "徐予澈", aliases: ["徐予澈", "徐泰希", "泰希", "予澈", "Hans", "HapSTer"], role: "亞洲頂級男團 HapSTer 主唱兼領舞（藝名徐泰希）", oneLiner: "台上極限魅惑、私下呆萌慢熱又粗線條的頂流偶像（沒有戴眼鏡，私下出門戴墨鏡，座車 Benz V-Class / Benz G500 / Volvo 1800S）。" }
];

/**
 * 動態在場配角偵測器 (Tier 2 NPC Detector)
 */
/**
 * 別名比對採「最長優先、位置獨佔」：短別名若落在已被更長別名佔用的區段內就不算命中。
 * 這是必要的 —— 「副總」是楊紹宸的別名，而「副總統」是徐承勳的別名，
 * 單純用 includes() 會讓每次提到副總統徐承勳都誤判楊紹宸在場並注入他的全量人設。
 */
function buildAliasMatchMap(scanTarget, roster) {
  const entries = [];
  roster.forEach(charObj => {
    (charObj.aliases || []).forEach(alias => {
      if (alias) entries.push({ id: charObj.id, alias: alias.toLowerCase() });
    });
  });
  entries.sort((a, b) => b.alias.length - a.alias.length);

  const claimed = new Array(scanTarget.length).fill(false);
  const matchedIds = new Set();

  entries.forEach(entry => {
    let from = 0;
    for (;;) {
      const at = scanTarget.indexOf(entry.alias, from);
      if (at === -1) break;
      let free = true;
      for (let i = at; i < at + entry.alias.length; i++) {
        if (claimed[i]) { free = false; break; }
      }
      if (free) {
        for (let i = at; i < at + entry.alias.length; i++) claimed[i] = true;
        matchedIds.add(entry.id);
        break;
      }
      from = at + 1;
    }
  });

  return matchedIds;
}

function detectActiveNPCs(lastProseText, playerChoice, primaryLeadKey, defaultSupportingLeads = []) {
  const scanTarget = ((playerChoice || '') + ' ' + ((lastProseText || '').slice(-600))).toLowerCase();
  const activeNPCs = [];
  const matchedIds = buildAliasMatchMap(scanTarget, ROSTER_ONE_LINERS);

  for (let i = 0; i < ROSTER_ONE_LINERS.length; i++) {
    const charObj = ROSTER_ONE_LINERS[i];
    if (charObj.id === primaryLeadKey || charObj.name === primaryLeadKey) continue;

    if (matchedIds.has(charObj.id)) {
      activeNPCs.push(charObj);
      if (activeNPCs.length >= 2) break;
    }
  }

  if (activeNPCs.length === 0 && defaultSupportingLeads && defaultSupportingLeads.length > 0) {
    for (let k = 0; k < defaultSupportingLeads.length; k++) {
      const sKey = defaultSupportingLeads[k];
      const match = ROSTER_ONE_LINERS.find(c => c.id === sKey || c.name === sKey);
      if (match && match.id !== primaryLeadKey && match.name !== primaryLeadKey) {
        activeNPCs.push(match);
        if (activeNPCs.length >= 2) break;
      }
    }
  }

  return activeNPCs;
}

/**
 * 三層角色提示詞組裝器 (Tier 1 主角 / Tier 2 在場配角 / Tier 3 世界名冊)
 * 具備 100% 原始人設檔案全量細節對標能力（座車、手錶、住所、語氣、關係）
 */
/**
 * 演繹卡：讓角色「寫起來像他本人」的核心資料。
 * 先前每回送進提示詞的核心人設與角色卡大量矛盾（例：林政修的角色卡是優雅斯文、
 * 面帶微笑、笑著說狠話，資料庫卻寫成「沉穩威嚴、喜怒不形於色」，例句也不是角色卡的），
 * 盲測顯示所有角色的機鋒、詩意、戲謔都被磨平，寫成同一種直接溫和的男人。
 */
function formatVoiceProfile(c, v, { compact = false } = {}) {
  const list = arr => (Array.isArray(arr) ? arr.filter(Boolean) : []);
  const examples = [...list(v.examples?.public).slice(0, compact ? 1 : 3), ...list(v.examples?.intimate).slice(0, compact ? 1 : 3)];
  if (compact) {
    return [
      `- ${c.fullName || c.name}（${c.title || ''}）：${v.core || ''}`,
      `  言談與語氣：${v.speech || ''} ${v.tone || ''}`,
      list(v.diction?.avoids).length ? `  絕不會用：${list(v.diction.avoids).join('、')}` : '',
      list(v.ooc).length ? `  崩壞警訊：${list(v.ooc).slice(0, 3).join('；')}` : '',
      examples.length ? `  語調參考：${examples.map(e => `「${e.replace(/^「|」$/g, '')}」`).join(' ')}` : ''
    ].filter(Boolean).join('\n');
  }
  const f = v.facts || {};
  return [
    `- 姓名與稱謂：${c.fullName || c.name}（${c.age || ''}${f.mbti ? '，' + f.mbti : ''}${f.zodiac ? '，' + f.zodiac : ''}）`,
    `- 職銜：${c.title || ''}｜座車：${f.car || c.cars || ''}`,
    `- 一句話定位：${v.core || ''}`,
    `- 言談：${v.speech || ''}`,
    `- 語氣：${v.tone || ''}`,
    `- 用字：慣用 ${list(v.diction?.uses).join('、') || '—'}；絕不會用 ${list(v.diction?.avoids).join('、') || '—'}`,
    `- 思想：${v.worldview || ''}`,
    `- 優先順序：${list(v.priorities).join(' ＞ ')}`,
    `- 情慾特質：${v.sexuality || ''}`,
    `- 追求方式：${v.courtship || ''}`,
    `- 慣常行動：${v.actions || ''}`,
    `- 形式風格：${v.style || ''}`,
    list(v.writingCues).length ? `- 寫法提示：\n${list(v.writingCues).map(x => `  * ${x}`).join('\n')}` : '',
    v.contrast ? `- 不要寫得像別人：${v.contrast}` : '',
    list(v.ooc).length ? `- 崩壞警訊（出現即為寫錯）：\n${list(v.ooc).map(x => `  * ${x}`).join('\n')}` : '',
    examples.length ? `- 角色卡原句（只供揣摩語調，不得在正文中照抄或改幾個字重用）：\n${examples.map(e => `  * 「${e.replace(/^「|」$/g, '')}」`).join('\n')}` : ''
  ].filter(Boolean).join('\n');
}

/** 精簡核心人設：每回都帶，是角色卡片段之外的骨架。有演繹卡時一律以演繹卡為準。 */
function formatCoreProfile(c, { compact = false } = {}) {
  const voice = c?.key ? getCharacterVoice(c.key) : null;
  if (voice) return formatVoiceProfile(c, voice, { compact });
  const examples = (c.speechExamples || []).slice(0, compact ? 1 : 4).map(ex => `  * ${ex}`).join('\n');
  const lines = [
    `- 姓名與稱謂：${c.fullName || c.name}（${c.age || ''}${c.mbti ? '，' + c.mbti : ''}）`,
    `- 職銜：${c.title || '依照官方設定'}`,
    `- 座車：${c.cars || '依照官方設定'}`,
    compact ? '' : `- 配件：${c.watch || '依照官方設定'}`,
    compact ? '' : `- 住所與活動範圍：${c.residence || '依照官方設定'}`,
    compact ? '' : `- 香氣：${c.perfume || '依照官方設定'}`,
    `- 身分定位：${c.identityRole || ''}`,
    `- 性格與情慾動態：${c.personality || ''}`,
    examples ? `- 說話風格例句（嚴格對標語調）：\n${examples}` : ''
  ];
  return lines.filter(Boolean).join('\n');
}

function pushPersonaChunks(blocks, key, name) {
  const chunks = getPreparedPersonaChunks(key);
  if (!chunks.length) return;
  blocks.push(`【${name} 角色卡相關段落（依本回場景挑選，與上方設定同等權威）】`);
  chunks.forEach(text => blocks.push(text));
}

/**
 * 組角色設定集。回傳 { stable, scene }：
 * - stable：核心人設、硬性設定、在場配角簡介、背景名冊——同一場景的連續回合不變。
 * - scene：依本回場景挑選的角色卡段落與演繹校準——每回可能不同。
 * 分開是為了提示詞快取（2026-10-06）：供應商只快取「開頭完全相同」的部分，
 * 先前這些每回變動的段落夾在固定段落中間，連續兩回只有開頭約 3,100 字能命中快取。
 */
function assembleCharacterPromptParts(primaryLeadKey, activeNPCs, isShura) {
  const blocks = [];
  const sceneBlocks = [];

  if (isShura) {
    blocks.push('=== 【全勢力修羅場（核心）】 ===');
    blocks.push('當前模式：十三勢力修羅場交鋒！所有 13 位男主均可能依局勢動態突入，請隨時維持各方勢力交鋒的緊張感與性張力！提及各角色時必須嚴格對標其官方座車、職銜與性格！');
    // 修羅場人人都可能出場，硬性設定全員帶上（每人一兩行，份量很小）
    Object.keys(CHARACTER_CANON_RULES).forEach(key => {
      const rule = formatCanonRules(key);
      if (rule) blocks.push(rule);
    });
    blocks.push('');
  } else {
    const key = OFFICIAL_DRIVE_CHARACTERS[primaryLeadKey] ? primaryLeadKey : '01_徐令謙';
    const c = OFFICIAL_DRIVE_CHARACTERS[key];
    blocks.push('=== 【主要互動角色（核心主角）】 ===');
    blocks.push(formatCoreProfile(c));
    blocks.push(formatCanonRules(key));
    pushPersonaChunks(sceneBlocks, key, c.name);
    blocks.push('');
  }

  if (activeNPCs && activeNPCs.length > 0) {
    blocks.push('=== 【當前在場配角（動態突入）】 ===');
    blocks.push('以下角色已在場：請依其職銜、座車與身分推動衝突與暗流，絕不可張冠李戴或隨意發明設定。');
    activeNPCs.forEach((npc, idx) => {
      const c = OFFICIAL_DRIVE_CHARACTERS[npc.id] || OFFICIAL_DRIVE_CHARACTERS[npc.name] || {};
      blocks.push(`- 在場配角 ${idx + 1}：${c.fullName || npc.name}`);
      blocks.push(c.name ? formatCoreProfile(c, { compact: true }) : `  ${npc.role || ''} ${npc.oneLiner || ''}`);
      if (npc.id && CHARACTER_CANON_RULES[npc.id]) blocks.push(formatCanonRules(npc.id));
      if (idx < LORE_TIER2_LIMIT && npc.id) pushPersonaChunks(sceneBlocks, npc.id, c.name || npc.name);
    });
    blocks.push('');
  }

  return finishCharacterBlocks(blocks, primaryLeadKey, activeNPCs, sceneBlocks);
}

function assembleCharacterPromptBlock(primaryLeadKey, activeNPCs, isShura) {
  const parts = assembleCharacterPromptParts(primaryLeadKey, activeNPCs, isShura);
  return [parts.stable, parts.scene].filter(Boolean).join('\n');
}

/**
 * 補上背景名冊與角色演繹校準。
 */
function finishCharacterBlocks(blocks, primaryLeadKey, activeNPCs, sceneBlocks = []) {

  const activeIds = (activeNPCs || []).map(n => n.id);
  if (primaryLeadKey) activeIds.push(primaryLeadKey);

  const tier3List = ROSTER_ONE_LINERS.filter(c => !activeIds.includes(c.id) && c.name !== primaryLeadKey);
  if (tier3List.length > 0) {
    blocks.push('=== 【世界全景背景名冊 (Tier 3 · 勢力網絡與座車職銜對標表)】 ===');
    blocks.push('【宏觀世界與勢力交織】：若劇情或傳聞中提及以下人物，請嚴格遵守其官方身分、職銜與座車，絕不可混淆：');
    tier3List.forEach(t3 => {
      const cObj = OFFICIAL_DRIVE_CHARACTERS[t3.id] || {};
      const carInfo = cObj.cars ? ` ｜ 座車：${cObj.cars.split('；')[0]}` : '';
      blocks.push(`• ${t3.name}：${cObj.title || t3.role}${carInfo}`);
    });
  }

  // 角色卡原文有部分舊版措辭；把最新演繹規則放在所有人物資料之後，
  // 避免角色卡片段把徐令謙拉回兇狠、控制型模板。
  const requiresXuCalibration = primaryLeadKey === '01_徐令謙'
    || primaryLeadKey === '徐令謙'
    || primaryLeadKey === '修羅場'
    || (activeNPCs || []).some(npc => npc.id === '01_徐令謙' || npc.name === '徐令謙');
  if (requiresXuCalibration) {
    sceneBlocks.push('');
    sceneBlocks.push(`=== 【徐令謙最新演繹校準（最高優先，覆蓋角色卡舊版用語）】 ===
若前方人物卡或快取文字與本段衝突，一律視為舊版並以本段為準：
1. 徐令謙對所有人都克制、壓抑、紀律嚴明；語句簡潔、不油條、不浮誇、不吼叫、不以逞兇鬥狠展示份量。
2. 唯獨面對玩家，他會控制不住。他用自己的方式主動：嘴上繞圈、說反話（「我只是順路」「別誤會」），行動卻一步不退——主動出現、主動靠近、主動吻她、主動留下。
3. 他會傲嬌地要求、低聲請求、偶爾彆扭地撒嬌，繞了一圈仍清楚說出他想要什麼；不要讓他停在「妳可以拒絕」「等妳決定」。
4. 平時紳士而篤定，不靠命令或威脅；情慾正濃、吃醋或危機等劇情氛圍需要時，可以強勢、直接下命令，用的仍是乾淨有教養的語言。他的權勢與危險主要用來處理外部威脅、守護她。`);
  }

  return { stable: blocks.join('\n'), scene: sceneBlocks.join('\n') };
}

const LITERARY_CLICHE_PATTERNS = [
  '空氣瞬間凝滯', '空氣凝滯', '眼底閃過一絲', '眼底閃過', '眸中掠過',
  '唇角勾起', '嘴角勾起', '心跳如鼓', '看穿靈魂', '無形的網', '無形的牆',
  '蟄伏的獸', '危險又迷人', '不容置疑', '不容拒絕', '宣告主權',
  '喉結滾動', '指尖微顫', '呼吸一滯', '渾身一僵', '電流竄過',
  '眼神銳利如刀', '銳利如刀刃', '眼神像刀', '未引爆的計時器', '未引爆計時器',
  // 讓所有男主變成同一個人的通用反應
  '若有似無的弧度', '不容忽視的重量', '手指在桌面輕敲', '目光沉靜',
  // 讓男主停在等待、把決定權推回玩家的寫法
  '沒有催促', '拒絕的空間', '妳不用現在回答', '我可以等', '安靜地等', '等她決定', '等妳決定',
  '等著妳的決定', '等妳的決定', '兩個選擇', '妳可以選擇', '沒有追問', '等著妳自己', '沒有逼妳', '想清楚了', '送妳回去', '再打給我', '要上來嗎', '如果妳願意'
];

const SCENE_RHYTHM_CYCLE = [
  // 先前六階段中有三個在放慢節奏（潛流鋪陳「不急著製造高潮」、言語試探、餘韻留白），
  // 玩家反映玩好幾回都沒有演進。改為每個階段都要求往前走一步。
  { name: '推進升溫', brief: '讓關係或局勢明顯往前一步：一次主動的靠近、一個新的承諾或一次越界。' },
  { name: '情報揭露', brief: '揭開一項會改變判斷的新事實，並讓它立刻影響兩人的互動。' },
  { name: '親密升溫', brief: '男主主動拉近身體或情感的距離，這一回兩人要比上一回更近。' },
  { name: '壓力峰值', brief: '讓累積的矛盾或慾望落到行動上，局勢或關係必須因此改變。' },
  { name: '事件轉折', brief: '讓外部事件或第三方介入，逼兩人做出選擇；男主不因此離場。' }
];

function getSceneRhythm(turnCount) {
  const turn = Math.max(1, Number(turnCount) || 1);
  return SCENE_RHYTHM_CYCLE[(turn - 1) % SCENE_RHYTHM_CYCLE.length];
}

function collectRecentStyleEchoes(historyList) {
  const prose = (Array.isArray(historyList) ? historyList : [])
    .slice(-3)
    .map(item => String(item?.prose || ''))
    .join('\n');
  return LITERARY_CLICHE_PATTERNS.filter(phrase => prose.includes(phrase)).slice(0, 8);
}

/**
 * AI 腔偵測（取自「去 AI 感與台灣用語」守則，改寫為小說適用版）。
 *
 * 偵測結果「不」觸發重新生成 —— 重跑一次要數十秒與一次完整費用，
 * 而這些都是可以靠下一回提醒修正的文風習慣。它們會被寫進下一回的
 * 提示詞，點名要模型避開，讓文風逐回收斂。
 *
 * 與通用文章規則的差異：驚嘆號與破折號只限制旁白，對白不受限 ——
 * 角色講話本來就需要「！」與「——」表現情緒與被打斷。
 */
const AI_FLAVOR_CONTRAST_PATTERNS = [
  /不是[^。！？\n]{1,20}[，,]?\s*而是/g,
  /並非[^。！？\n]{1,20}而是/g,
  /與其說[^。！？\n]{1,24}不如說/g,
  /看似[^。！？\n]{1,20}(?:實則|其實)/g,
  /你以為[^。！？\n]{1,24}其實/g,
  /不只是[^。！？\n]{1,20}更是/g,
  /比起[^。！？\n]{1,20}更重要的是/g,
  /重點從來不是/g,
  /只是表面[^。！？\n]{0,12}才是/g,
  /說是[^。！？\n]{1,20}倒不如說/g
];
const AI_FLAVOR_OBSCURE_WORDS = [
  '氤氳', '繾綣', '闌珊', '旖旎', '婆娑', '蹁躚', '嫋嫋', '踽踽', '惘然', '悵惘', '喟嘆',
  '翩然', '澄澈', '清冽', '靜謐', '恬淡', '嫣然', '潸然', '泫然', '罅隙', '漫漶', '熨貼',
  '熨帖', '淬鍊', '滌盪', '蘊藉', '雋永', '邈遠', '杳然', '寂寥', '蕭索', '迤邐'
];
const AI_FLAVOR_THERAPY_WORDS = [
  '被看見', '被聽見', '接住了', '安放', '允許自己', '溫柔以待', '療癒', '精神內耗',
  '鬆弛感', '松弛感', '儀式感', '情緒價值', '與自己和解', '做自己的光', '歲月靜好', '煙火氣'
];
const AI_FLAVOR_SUBLIMATION_WORDS = [
  '命運的齒輪', '靈魂深處', '宿命般', '這就是人生', '某種救贖', '生命的意義', '時間彷彿靜止',
  '所有的一切終將', '真正的愛是', '真正的強大'
];
// 以下依作者寫作守則擴充（只檢查旁白，對白照角色口吻）
const AI_FLAVOR_HYPE_WORDS = ['極致', '完美', '無與倫比', '前所未有', '史詩級', '令人窒息', '嘆為觀止', '淋漓盡致'];
const AI_FLAVOR_JARGON_WORDS = ['張力', '肌理', '底色', '質地', '場域', '他者'];
const AI_FLAVOR_GAME_METAPHORS = ['入局', '破局', '這局', '進入我的局', '手術刀', '外科手術'];
const AI_FLAVOR_TEMPLATE_WORDS = ['此外', '值得注意的是', '值得一提的是', '不可否認', '總而言之', '綜上所述', '總的來說', '由此可見', '說真的', '老實說', '不得不說', '說到底'];
const AI_FLAVOR_TRANSLATIONESE = [/進行了?[一-龥]{2}/g, /作為一個/g, /扮演[^。！？\n]{1,10}角色/g];

function stripDialogue(prose) {
  return String(prose || '').replace(/「[^」]*」|『[^』]*』/g, '');
}

function detectAiFlavor(prose) {
  const text = String(prose || '');
  const narration = stripDialogue(text);
  const issues = [];
  const contrast = AI_FLAVOR_CONTRAST_PATTERNS
    .reduce((n, re) => n + (text.match(re) || []).length, 0);
  if (contrast > 1) issues.push(`「不是…而是／與其說…不如說」這類對比翻轉句出現 ${contrast} 次（上限 1 次）`);
  const obscure = AI_FLAVOR_OBSCURE_WORDS.filter(w => text.includes(w));
  if (obscure.length) issues.push(`生冷文藝詞：${obscure.slice(0, 5).join('、')}`);
  const therapy = AI_FLAVOR_THERAPY_WORDS.filter(w => text.includes(w));
  if (therapy.length) issues.push(`心理勵志腔：${therapy.slice(0, 5).join('、')}`);
  const sublimation = AI_FLAVOR_SUBLIMATION_WORDS.filter(w => text.includes(w));
  if (sublimation.length) issues.push(`昇華句：${sublimation.slice(0, 3).join('、')}`);
  const hype = AI_FLAVOR_HYPE_WORDS.filter(w => narration.includes(w));
  if (hype.length) issues.push(`誇大詞：${hype.slice(0, 4).join('、')}（改用具體事實）`);
  const jargon = AI_FLAVOR_JARGON_WORDS.filter(w => narration.includes(w));
  if (jargon.length) issues.push(`評論行話：${jargon.slice(0, 4).join('、')}（改寫成畫面）`);
  const gameMeta = AI_FLAVOR_GAME_METAPHORS.filter(w => narration.includes(w));
  if (gameMeta.length) issues.push(`「局」「刀」比喻：${gameMeta.slice(0, 3).join('、')}`);
  const template = AI_FLAVOR_TEMPLATE_WORDS.filter(w => narration.includes(w));
  if (template.length) issues.push(`模板銜接或假坦白：${template.slice(0, 4).join('、')}`);
  const translationese = AI_FLAVOR_TRANSLATIONESE.reduce((n, re) => n + (narration.match(re) || []).length, 0);
  if (translationese) issues.push(`翻譯腔 ${translationese} 處（進行＋動詞、作為一個、扮演……角色）`);
  const tilde = (narration.match(/[～~]/g) || []).length;
  if (tilde) issues.push(`旁白用了 ${tilde} 個「～」`);
  const narrationExclaim = (narration.match(/[！!]/g) || []).length;
  if (narrationExclaim) issues.push(`旁白用了 ${narrationExclaim} 個驚嘆號（旁白不用驚嘆號，只留給對白）`);
  const narrationDash = (narration.match(/——/g) || []).length;
  if (narrationDash > 2) issues.push(`旁白破折號 ${narrationDash} 處（上限 2 處）`);
  return issues;
}

/**
 * 從上一回正文算出需要修正的文風瑕疵，交給本回提示詞。
 * 這是「不重跑也能提升品質」的核心：瑕疵不會被丟棄重寫，而是成為下一回的具體指示。
 */
function buildPreviousTurnStyleNote(historyList) {
  const last = (Array.isArray(historyList) ? historyList : []).slice(-1)[0];
  const prose = String(last?.prose || '');
  if (!prose) return '';
  const issues = detectAiFlavor(prose);
  const simileCount = countLiterarySimiles(prose);
  if (simileCount > 6) issues.push(`比喻用了 ${simileCount} 次，偏多`);
  const cliches = LITERARY_CLICHE_PATTERNS.filter(phrase => prose.includes(phrase));
  if (cliches.length) issues.push(`套路語：${cliches.slice(0, 4).join('、')}`);
  if (!issues.length) return '';
  return `- 上一回已出現以下文風瑕疵，本回務必改掉：\n${issues.map(i => `  · ${i}`).join('\n')}`;
}

/**
 * 依玩家按下的送出鍵，明確告訴模型本回的情慾尺度與篇幅。
 *
 * 先前兩顆按鍵只換模型、提示詞完全相同，唯一的情慾指示又偏含蓄（「以未說出口的
 * 欲望形成張力」），再加上文風守則裡大量的「克制」，露骨模式的模型因此寫得又短
 * 又保守：實測 qwen3-30b 正文常只有 148–290 字，低於 220 字門檻就被判失敗，
 * 玩家看到的就是「按露骨跑不了」。
 *
 * 玩家在人設中關閉 R-18 時，兩種模式都不寫性愛場景。
 */
/**
 * 本回角色演繹重點：放在提示詞結尾（模型注意力最強的位置）。
 * 演繹卡本身放在系統提示詞前段，盲測顯示單靠它壓不過其他通用規則，
 * 角色最有特色的那一面（機鋒、詩意、戲謔、諷刺）仍會被磨平成「語氣直接」。
 */
function buildCharacterSpotlightBlock(leadKey, npcIds = []) {
  const keys = [leadKey, ...npcIds].filter((k, i, a) => k && a.indexOf(k) === i).slice(0, 3);
  const parts = keys.map((key, idx) => {
    const v = getCharacterVoice(key);
    const c = OFFICIAL_DRIVE_CHARACTERS[key];
    if (!v || !c) return '';
    const cues = (v.writingCues || []).slice(0, idx === 0 ? 3 : 2).map(x => `  * ${x}`).join('\n');
    const ooc = (v.ooc || []).slice(0, idx === 0 ? 3 : 2).map(x => `  * 不要：${x}`).join('\n');
    // 不在結尾放角色卡原句：實測模型會直接把原句抄進對白，長局裡同一句話會一再出現
    return [
      `${c.name}：${v.tone}`,
      cues,
      // 追求方式只決定「怎麼主動」，不決定「要不要主動」：演繹卡裡「讓對方主動靠近」「給對方選擇權」
      // 這類描述曾讓男主停在等待，玩家反映角色像被迫的
      v.courtship ? `  * 他主動的方式（個性決定怎麼主動，不是決定要不要主動；不要寫成一般愛情小說的坦白示愛）：${v.courtship}` : '',
      ooc,
      // 不要求對白數量：話少、靠行動表達的角色若被逼著多說，反而會把心事說破
      idx === 0 ? `  * 他的對白要讓人不看名字也聽得出是他；他最有特色的那一面要寫出來，不要寫成通用的「冷靜、直接、克制」男主，也不要讓他用不屬於他的方式表露感情。` : ''
    ].filter(Boolean).join('\n');
  }).filter(Boolean);
  return parts.length ? `【本回角色演繹重點】\n${parts.join('\n')}` : '';
}

/**
 * 男主的主動性與在場（放在提示詞結尾）。
 * 實測（2026-10-04）：玩家說「今晚不想一個人」或不下車看著他時，男主主動推進親密只有 38%，
 * 被動退讓（「妳想清楚」「我不會勉強妳」）高達 88%；挽留他「今晚別走」時仍有 25% 離開。
 * 玩家反映角色像被迫的、要講得超白話才會推進、而且一直登場又退場。
 */
function buildMaleLeadInitiativeBlock(allowR18 = true) {
  return `【男主的主動性與在場（女性向情慾遊戲的核心）】
- 本作以情慾與戀愛為核心，商戰、政治、權謀與職場是背景與阻力。每一位男主都對玩家有好感：依劇情進展與初始設定，從心動、喜歡到愛戀，初識時也已經被她吸引。每一回都要扣回他與玩家的感情線，不要讓整回只剩公事或權謀。
- 男主對玩家有好感或慾望時要主動：主動靠近、主動觸碰、主動吻、主動索求、主動把關係往前推，方式照他自己的個性。不要讓玩家每一步都得先開口。
- 玩家釋出邀請時，這一回他一定要做出一個明確的主動行為並做完：吻她、把她拉進懷裡、解開她的安全帶把她拉過來、抱起她、把她帶進屋裡。不要碰一下手背就收回、不要停在「等她開口」。
- 玩家已經釋出邀請時，不要再確認她的意願（不問「妳確定？」「可以嗎？」「妳想要嗎？」）——她的行動就是答案。
- 不要寫等待與退讓：「沒有催促」「給她留了拒絕的空間」「妳不用現在回答」「我可以等」「安靜地等她」「要她親口說」「妳想清楚」「我不會勉強妳」「等妳準備好」這類句子整回最多一句。只有玩家明確拒絕時才停下來。
- 結尾不要交給她選：不要以男主給她二選一（「妳可以下車，或是……」「妳有兩個選擇」）、「他等著妳的決定」「他沒有逼妳，只是等著」收尾。章節最後一個畫面是他已經做出的行動（已經帶她上樓、已經吻下去、已經替她決定去哪），三個選項是她怎麼回應他，不是要不要接受他。
- 他想知道什麼就直接問到底或直接行動，不要寫「他沒有追問，等她自己開口」；也不要用一個等她回答的問句收尾（「妳可以告訴我……」「明天妳會來嗎？」）。
- 不要寫「妳想清楚了就打給我」「超過時間就當妳放棄」「我送妳回去」：這些都是把她推開或退場。玩家沒說要回家，他就把她帶在身邊，帶去下一個地方。
- 不要用「遞名片、留電話，說等妳想好再打」然後離開來結束相遇：名片可以給，但他人不走。也不要問「要上來嗎？」「如果妳願意，我送妳」——他直接說「上來」「跟我走」，然後帶她走。
- 解讀暗示：玩家的曖昧行動（不下車、不道晚安、靠近、凝視、說不想一個人、選了偏親密的選項）就是邀請，照這個方向推進${allowR18 === false ? '（玩家已關閉 R-18，停在擁抱與親吻）' : ''}，不需要玩家講白話。
- 在場與停留：他在場時預設留下、延續相處，不要以「該走了」「還有公事」收尾。玩家挽留時一定留下（可以把車停好、打電話交代公事、脫下外套）。親密之後留下來過夜或溫存，不要做完就走。親吻或親密升溫之後要順勢延續（跟她上樓、帶她回他的住處、繼續下去），不要由他自己喊停、送她回家或道晚安。只有發生無法推辭的緊急事件才離開，而且要先鋪陳。
- 三個選項：一個推進主線、一個大膽推進與他的關係或親密、一個高風險、可能翻盤。至少一個選項必須是與他之間的感情或親密行動（靠近、觸碰、吻、留下、邀約）；他不在場時，改為去找他或約他見面。不可以三個都是調查、查帳或公事。`;
}

/**
 * 依關係階段調整節奏。10 回合模擬（2026-10-05）顯示節奏兩極：
 * 有的角色初識當晚就接吻回家（Sonnet：「缺少試探與猶豫的鋪墊」），
 * 有的十回都停在同一個窗邊反覆邀約（「原地打轉」）。
 * 階段依好感度判斷；沒有好感度資料時依回合數。按下「露骨」時以露骨規則為準。
 */
function getRelationshipStage(profile, saveState, turnCount) {
  const lead = profile?.targetLeadName;
  const score = FEATURES.favorability ? Number(saveState?.relationships?.[lead]) : NaN;
  if (Number.isFinite(score)) return score >= 55 ? 'love' : score >= 25 ? 'flirt' : 'meet';
  const t = Number(turnCount) || 1;
  return t >= 9 ? 'love' : t >= 4 ? 'flirt' : 'meet';
}

function buildPacingBlock(profile, saveState, turnCount) {
  const stage = getRelationshipStage(profile, saveState, turnCount);
  const stageText = {
    meet: '初識期：他已經被她吸引，主動製造相處機會、言語撩撥、做越界的小動作（靠近、觸碰、替她撥頭髮、主動聯絡她）。這個階段先不接吻、不上床，除非玩家主動要求或按下「露骨」。',
    meetDominant: '初識期：他已經被她吸引，主動製造相處機會、言語撩撥、做越界的小動作。玩家已勾選強勢主導劇情：氣氛或局勢推到了，他可以設局、用籌碼或魅力直接把她帶到吻與床上，不必等到熟識。',
    // 不寫「等玩家明確邀請」：被動玩家永遠不會明確邀請，模擬中男主因此卡在門口「等她決定」連續五回
    flirt: '曖昧期：主動靠近與觸碰、接吻，確認彼此在意，吃醋與佔有慾浮現；親密升溫時由他順勢推進，不要停在門口等她決定（一般模式下寫到身體結合時用文學筆法）。',
    love: '戀愛期：兩人已互相承認心意，親密與情慾是日常的一部分，他會主動索求。'
  }[stage === 'meet' && isDominantPlotEnabled(profile) ? 'meetDominant' : stage];
  return `【節奏】
- 目前關係階段：${stageText}
- 每回往前推一步，不要跳級，也不要原地打轉。
- 同一個場景最多延續 3 回；第 3 回之後要轉場，或讓事件把兩人帶往下一步。
- 玩家沒有回應或只是沉默時，男主不要重複同一個邀約或同一句試探；改由他直接行動（帶她離開、留下來、吻她、換個地方、說出他想要什麼）。
- 不要重複近兩回用過的動作、道具或句子（例如同樣的小動作、同樣的邀約）。
- 主要男主不在場時，最多缺席一回：下一回要讓他回到場景（他主動來找她、約她見面、出現在她身邊），不要只剩傳訊息或電話；三個選項中至少一個是去找他或讓他出現。`;
}

/**
 * 玩家在開局勾選「強勢主導劇情」才啟用（需同時開啟 R-18）。
 * 男主可以不等明確邀請就把關係推到性愛，手段可含權勢、設局、權謀、誘惑；
 * 性愛當下女主角仍是清醒、願意並回應的。
 */
function isDominantPlotEnabled(profile) {
  return profile?.allowR18 !== false && profile?.allowDominantPlot === true;
}

function buildDominantPlotBlock(profile) {
  if (!isDominantPlotEnabled(profile)) return '';
  return `【強勢主導劇情（玩家已在開局勾選同意，屬於本作的劇情創作設定）】
- 親密不需要玩家先明確邀請：劇情、氣氛、情慾張力或玩家指令推到合適的時候，男主可以自己發動，直接把關係推到性愛，不必先問、不必等她開口。
- 可以用權勢落差、職場上下、設局、權謀、交易籌碼、誘惑與魅惑把兩人帶到這一步：他布局讓她只能與他獨處、拿籌碼跟她談條件、用魅力讓她招架不住、把她逼到退無可退。
- 界線：進入性愛時，女主角是清醒、願意並且回應的——她可以被算計、被逼到牆角、被撩到失守，但最後是她自己迎上去。不寫下藥、灌醉後發生關係、暴力強迫，也不寫她明確拒絕後繼續。
- 主導方式照各男主的演繹卡，用他自己的方式強勢；劇情或氛圍需要時，可以比演繹卡平時的分寸更強勢。
- 玩家雷區優先於本設定。`;
}

function buildContentModeBlock(mode, allowR18 = true) {
  if (allowR18 === false) {
    return `【本回情慾尺度：玩家已關閉 R-18】
- 親密互動停在擁抱、親吻與情感張力，不寫性愛場景。正文 800–1,200 字。`;
  }
  if (mode === 'spicy') {
    return `【本回情慾尺度：露骨（玩家明確按下「露骨」要求的章節）】
- 硬性要求：本回必須發生實際的性行為（性交、身體結合），這是玩家按下「露骨」的唯一目的。只寫到親吻、愛撫、前戲，或寫到一半被打斷、轉場、淡出，都視為沒有完成本回，會被退回重寫。
- 若主要對象此刻不在場或場景不允許，就在本回開頭合理地讓兩人獨處，再發展到性行為；不要拖到下一回。
- 直接、完整地寫出性愛過程：身體結合、動作節奏、觸感與生理反應，可以使用性器官的名稱。不要淡化，不要用「畫面一轉」「一夜過去」跳過，不要只寫前戲就收尾。
- 這一回以親密場景為主體，把場景從開始寫到結束，事後的餘韻與兩人關係的變化也要寫到。
- 露骨不代表換了一個人：角色的性格、說話方式、硬性設定與禁制全部照舊。
- 上方文風守則的「克制」是指用字不浮誇、不堆形容詞，不是要迴避或淡化情慾內容。
- 篇幅：正文至少 1,000 字，建議 1,100–1,500 字。親密場景要寫滿：靠近與前戲、身體結合、高潮、事後各自至少一段，不要寫到結合就草草收尾。`;
  }
  return `【本回情慾尺度：一般（文學性）】
- 允許情慾與親密內容。劇情或玩家行動走向親密時，就自然寫下去，不要迴避、不要突然中斷場景；男主有好感時會主動推進。
- 用文學筆法呈現：動作、觸感、呼吸、距離與心理變化；可以寫到身體結合，但用含蓄的說法，不使用性器官的名稱與直白的性行為用詞。
- 篇幅：正文 800–1,200 字。`;
}

function buildLiteraryCraftBlock(turnCount, historyList) {
  const rhythm = getSceneRhythm(turnCount);
  const echoes = collectRecentStyleEchoes(historyList);
  const previousStyleNote = buildPreviousTurnStyleNote(historyList);
  // 旁白稱呼玩家的人稱依性別固定。只寫「第二人稱」時，模型會在「你」「妳」之間混用
  const playerGender = (typeof getActivePlayerProfile === 'function' ? getActivePlayerProfile()?.gender : '') || '女';
  const playerPronounRule = /男/.test(playerGender)
    ? '旁白稱呼玩家一律用「你」。'
    : '玩家是女性，旁白一律用第二人稱「妳」稱呼玩家，不可寫成「你」，也不可改用第三人稱「她」；角色對男性說話時才用「你」。';
  return `【本回文學敘事規格（優先於氣氛口號，僅次於人物設定與事實連續性）】
- 敘事視角：貼近玩家感官的限知第二人稱；只寫當下可察覺或合理推斷之事，不替其他角色解說內心。
- 人稱：${playerPronounRule}
- 文體：女性向情慾戀愛小說，以台北都會的商戰、政治與權謀為背景。用精準名詞、動詞與可驗證細節形成質感；克制形容詞，避免把「高級、危險、壓迫、性感」當成結論反覆宣告。
- 對話：每位角色的台詞照他自己的演繹卡寫——有人迂迴、有人直接、有人幽默、有人帶刺，說話方式、句型與用字必須一聽就知道是誰。不要在旁白立刻解釋每句台詞。
- 角色差異化：不同角色不得共用同一套反應模板。「沉默不語、目光沉靜地凝視、手指輕敲桌面、嘴角勾起若有似無的弧度、語氣平淡卻帶著不容忽視的重量」是通用的冷硬男主模板，除非該角色的演繹卡明確如此，否則不要用。角色最有特色的那一面（機鋒、戲謔、詩意、溫暖、粗獷、羞澀）要寫出來，不要磨平成「冷靜克制」。
- 節奏：長短句與段落密度須有變化。一段只保留一個主要感官焦點；比喻一段最多一個，取自日常生活或當下場景，不用典故。
- 避免機械重複：同一句話、同一物件狀態或「你＋動作」句型不得換字反覆描述；除非是刻意設計的唯一一次回聲，完整句子不可重複。
- 跨回推進：不可把上一回的招牌物件、收尾意象或整段動作只換幾個字再寫一次；若物件仍在場，必須寫出它因新行動產生的變化或後果。
- 情慾與權力：由人物的慾望、主動與具體動作產生；不得直接用「性張力爆發、佔有慾、危險迷人」等詞代替戲劇行動。
- 推進：每回都要往前走一步——關係更進一步、事件發生或真相揭露；不能整回只停在試探、對峙或寒暄。不必每回都是高潮，但不能原地打轉。結尾留下會影響下一回的具體餘波，不寫「這只是開始」式總結。
- 收尾禁制：不得用「這不是 X。這是 Y。」「裂縫已經打開」「一切才剛開始」等判詞替讀者總結；必須以仍在發生的動作、物件、聲音或未完成對話收尾。
- 本回節奏角色：${rhythm.name}——${rhythm.brief}
- 通用反套路：避免使用「${LITERARY_CLICHE_PATTERNS.join('、')}」及其近義改寫；若確有必要，整回最多只能出現其中一項。
- 近期三回已出現、尤其不可再用：${echoes.length ? echoes.join('、') : '無；仍須遵守通用反套路'}。
- 去 AI 腔：「不是…而是／與其說…不如說／看似…實則／你以為…其實」這類對比翻轉句整回最多 1 次；不寫把具體物件接到人生、命運、靈魂、救贖的昇華句與金句；三個詞或三個短句同構連排最多 1 次。
- 旁白用字：國中生看得懂。不用生冷文藝詞（氤氳、繾綣、旖旎、婆娑、靜謐、澄澈、寂寥等），重的情緒用輕的字；不用心理勵志腔（被看見、接住、安放、療癒、與自己和解）。
- 以上去 AI 腔與用字規則只管旁白。角色的對白一律照他的演繹卡：該有修辭、雙關、詩意、諷刺、粗話或台語的角色，對白就要有，不要被旁白規則磨平。
- 台灣用語與字形：捷運、計程車、影片、訊息、品質、立刻；裡、著、為、溫；標點一律全形，引號用「」，刪節號用……。
- 驚嘆號與破折號只用在對白裡：旁白不用驚嘆號，旁白破折號整回最多 2 處。${previousStyleNote ? '\n' + previousStyleNote : ''}
- 三個選項各自只寫「一個明確行動＋必要的一句話」，label 建議 25–60 字，hint 建議 10–24 字；不要把選項寫成另一段正文。`;
}

function countLiterarySimiles(prose) {
  const text = String(prose || '');
  // 不把「監視影像、圖像、攝像」等名詞中的「像」誤判成比喻。
  return (text.match(/(?:彷彿|如同|宛如|好像|像是|像被|像在|像要|像從|像一(?:個|把|張|道|場|頭|隻|枚|座|面|根|顆|條|件))/g) || []).length;
}

function countRepeatedLiterarySentences(prose) {
  const counts = new Map();
  String(prose || '')
    .split(/[。！？!?；;\n]+/)
    .map(sentence => sentence.replace(/[「」『』“”\s，、：:—…]/g, '').trim())
    .filter(sentence => sentence.length >= 3)
    .forEach(sentence => counts.set(sentence, (counts.get(sentence) || 0) + 1));
  return Array.from(counts.values()).reduce((total, count) => total + Math.max(0, count - 1), 0);
}
/**
 * 簡體字就地轉繁體。
 *
 * 為什麼不是「退回重跑」：模型偶爾混入簡體字是用字瑕疵，不是內容錯誤。
 * 先前一章混入 48 個簡體字就整章丟掉換模型，等於花一次完整生成
 * （數十秒＋費用）去修一個查表就能修好的問題。
 *
 * 只收錄「繁體中文不存在或極罕用」的簡體字。后、里、发、干、只、面、台、
 * 余、系、制、复、冲、划、脏、准、斗 這類在繁體中本身就是合法字
 * （皇后、公里、若干、只有、台灣），盲目替換會把正確的字改錯，
 * 因此只透過下方的詞組表、在明確語境中轉換。
 */
const S2T_CHAR_MAP = (() => {
  const pairs = '这這为為会會门門问問见見与與东東个個来來时時说說车車书書边邊应應过過还還从從对對将將无無现現开開关關经經处處实實试試'
    + '们們么麼样樣让讓认認识識话話语語请請谁誰记記讲講设設该該读讀调調谈談论論证證议議诉訴词詞译譯访訪订訂计計许許讨討评評诗詩误誤课課谢謝谓謂谜謎谎謊诱誘诺諾'
    + '给給结結绝絕统統维維线線练練组組细細终終红紅纸紙级級约約纪紀织織绕繞绪緒续續绳繩编編缓緩缘緣绑綁绿綠继繼缠纏网網纳納纷紛纯純绍紹'
    + '钱錢银銀铁鐵锁鎖错錯键鍵镜鏡针針钥鑰链鏈锐銳钢鋼铺鋪锋鋒钻鑽间間闻聞闭閉闪閃闲閒阅閱阔闊闯闖'
    + '头頭买買卖賣气氣爱愛听聽声聲觉覺学學体體动動场場战戰难難鸡雞鸟鳥马馬驾駕驶駛验驗骑騎驱驅'
    + '带帶帮幫师師归歸当當录錄国國图圖园園围圍岁歲压壓厅廳厨廚产產亲親众眾传傳伤傷价價优優侦偵侧側俩倆债債儿兒农農'
    + '决決况況净淨冻凍凤鳳击擊则則刚剛创創删刪别別办辦务務劳勞势勢单單卫衛厉厲双雙变變叙敘号號叹嘆吗嗎吓嚇启啟员員呜嗚响響哑啞唤喚团團'
    + '坏壞块塊坚堅坛壇坟墳尘塵备備夺奪奋奮妈媽妇婦宁寧宝寶宽寬审審宫宮寻尋导導尔爾尝嘗层層屡屢岛島岭嶺币幣帅帥帐帳'
    + '庆慶库庫废廢广廣张張弹彈强強彻徹忆憶忧憂怀懷态態总總恋戀恼惱悬懸惊驚惧懼惨慘愿願户戶'
    + '扑撲执執扩擴扫掃扬揚抚撫抢搶护護报報担擔拥擁择擇挂掛挡擋挣掙挤擠挥揮损損捡撿换換据據掷擲揽攬搂摟携攜摄攝摆擺'
    + '数數敌敵断斷旧舊显顯晓曉晕暈暂暫术術杀殺杂雜权權条條杨楊极極构構枪槍柜櫃标標栏欄树樹桥橋梦夢检檢楼樓欢歡残殘毕畢'
    + '汇匯汉漢没沒沟溝泪淚泽澤洁潔浅淺测測济濟浓濃涌湧润潤涨漲渐漸温溫湿濕满滿滚滾灭滅灯燈灵靈灾災炉爐烟煙热熱焕煥爷爺'
    + '牵牽犹猶狱獄独獨猎獵环環玛瑪电電画畫畅暢疗療痒癢皱皺盏盞盘盤睁睜确確礼禮祸禍离離种種积積称稱稳穩穷窮'
    + '笔筆笼籠筑築签簽简簡类類紧緊罗羅罚罰职職联聯聪聰肃肅胁脅脉脈脑腦脸臉腾騰节節苏蘇荣榮药藥获獲虽雖'
    + '补補衬襯袜襪装裝视視览覽触觸贝貝负負贡貢财財责責贤賢败敗货貨质質贩販贪貪购購贯貫贴貼贵貴费費贺賀资資赌賭赏賞赔賠赖賴'
    + '赶趕赵趙跃躍践踐轨軌转轉轮輪软軟轻輕载載较較辆輛输輸辽遼达達迁遷运運进進远遠违違连連迟遲选選适適递遞逻邏遗遺'
    + '邻鄰郑鄭酱醬释釋长長队隊阳陽阴陰阵陣阶階际際陆陸陈陳险險随隨隐隱雾霧顶頂项項顺順须須顾顧顿頓预預领領频頻题題颜顏额額'
    + '风風飞飛饭飯饮飲饱飽饿餓馆館鱼魚鲜鮮龙龍着著尽盡叶葉历歷'
    // 動作、身體與情慾描寫的高頻字（露骨章節最常出現的漏網之魚）
    + '拨撥抛拋摇搖撑撐拦攔搅攪颤顫骤驟喷噴啧嘖颈頸肤膚肠腸胀脹腻膩凉涼烫燙渗滲'
    + '缝縫绷繃缩縮绵綿缕縷纤纖络絡纠糾纵縱绣繡颗顆颊頰齿齒龄齡侣侶惩懲恳懇愤憤'
    + '婴嬰娇嬌妩嫵妆妝艳艷浑渾浊濁闷悶闹鬧阁閣窃竊宾賓诞誕诡詭谋謀谨謹谐諧谊誼'
    + '讯訊讶訝讽諷询詢详詳诚誠诊診嘱囑呛嗆咙嚨饶饒馋饞鬓鬢铃鈴锦錦镯鐲钮鈕铜銅'
    + '窝窩帘簾灿燦烂爛炼煉烁爍烧燒迹跡逊遜遥遙邮郵鸣鳴齐齊颅顱挠撓挞撻搀攙'
    // 港式與異體字形：繁體但非台灣慣用寫法
    + '裏裡綫線衞衛爲為説說麪麵啓啟峯峰羣群温溫'
    // 人名、地名與一般高頻字（排除在繁體中也合法的字：于云余松范系谷征等）
    + '谦謙内內写寫亿億万萬丝絲丢丟两兩严嚴丧喪临臨丽麗举舉义義乌烏乐樂乔喬习習乡鄉乱亂争爭亏虧亚亞亩畝亵褻仅僅仑侖仓倉仪儀伞傘伟偉伪偽佣傭侠俠侥僥侨僑俭儉倾傾偿償储儲兑兌党黨兰蘭兴興养養兽獸冈岡册冊军軍冯馮减減凑湊凛凜凭憑凯凱凿鑿刘劉剂劑剑劍剧劇劝勸励勵劲勁勋勳匀勻华華协協卢盧卤滷卧臥却卻厂廠厌厭县縣参參叠疊吕呂吴吳呐吶咏詠哗嘩啬嗇啸嘯圆圓圣聖坝壩坠墜垄壟垒壘堕墮墙牆壮壯壳殼壶壺够夠夹夾奖獎奥奧娄婁娱娛婶嬸孙孫孪孿宠寵宪憲寝寢寿壽尧堯尴尷屉屜届屆属屬岂豈岗崗峡峽帜幟帧幀庄莊庙廟庞龐异異弃棄弥彌弯彎彦彥径徑怂慫怜憐恒恆恶惡悦悅惫憊惯慣慑懾懒懶戏戲扰擾拟擬拢攏拣揀拧擰挚摯挟挾捞撈捣搗掳擄掸撣掺摻搁擱摊攤撵攆敛斂斋齋斩斬旷曠昙曇晋晉晒曬机機枢樞枣棗柠檸栈棧栋棟桩樁椭橢榄欖横橫樱櫻欧歐歼殲殴毆毁毀毙斃汤湯沥瀝沦淪沪滬泼潑浆漿浇澆浏瀏涛濤涡渦渊淵渔漁湾灣溃潰溅濺滞滯滤濾滥濫滨濱潜潛潇瀟澜瀾点點烛燭烦煩狈狽狮獅狭狹猪豬猫貓献獻琐瑣疯瘋瘫癱盐鹽监監盖蓋瞒瞞矫矯矿礦码碼砖磚础礎碍礙窍竅竖豎竞競笋筍筛篩粮糧纱紗纲綱纹紋纺紡绅紳绊絆绒絨绘繪绩績绰綽综綜缀綴罢罷聋聾肿腫胆膽胜勝胶膠舰艦舱艙艰艱芦蘆苍蒼茧繭荐薦荡蕩莲蓮莹瑩萝蘿萤螢营營蓝藍蔼藹虏虜虑慮虚虛蚀蝕蚁蟻蛮蠻袭襲裤褲观觀规規誉譽讥譏训訓讳諱诀訣诈詐诫誡诸諸谅諒谍諜谣謠谱譜贞貞账帳贫貧贱賤贷貸贸貿贼賊赐賜赚賺赛賽赞讚赠贈趋趨踪蹤轩軒轰轟轿轎辅輔辉輝辈輩辑輯辖轄辞辭辩辯迈邁邓鄧酿釀鉴鑑钉釘钓釣钞鈔钦欽钩鉤铅鉛铭銘铲鏟铸鑄销銷锅鍋锡錫锤錘锯鋸锻鍛镇鎮闸閘阐闡陕陝雏雛静靜韦韋韧韌韩韓页頁顽頑颁頒颂頌颇頗颓頹颠顛飘飄饥飢饰飾饲飼饼餅驰馳驳駁驴驢驻駐骂罵骄驕骆駱骇駭骗騙骚騷鲁魯鸽鴿鹅鵝鹰鷹麦麥黄黃龟龜萧蕭汹洶';
  const map = new Map();
  for (let i = 0; i + 1 < pairs.length; i += 2) map.set(pairs[i], pairs[i + 1]);
  return map;
})();

/** 一字多義的簡體字：只在明確詞組中轉換，其餘保持原樣（它們在繁體中也是合法字）。 */
const S2T_PHRASES = [
  // 后 → 後（皇后、王后、太后、后羿 等保持不變）
  ['之后', '之後'], ['然后', '然後'], ['最后', '最後'], ['以后', '以後'], ['后来', '後來'],
  ['后面', '後面'], ['后悔', '後悔'], ['背后', '背後'], ['身后', '身後'], ['随后', '隨後'],
  ['前后', '前後'], ['后头', '後頭'], ['后退', '後退'], ['后果', '後果'], ['后方', '後方'],
  ['落后', '落後'], ['后宫', '後宮'], ['事后', '事後'], ['午后', '午後'], ['今后', '今後'], ['后颈', '後頸'], ['后背', '後背'],
  // 里 → 裡（公里、里長、鄰里 等保持不變）
  ['这里', '這裡'], ['那里', '那裡'], ['哪里', '哪裡'], ['里面', '裡面'], ['心里', '心裡'],
  ['家里', '家裡'], ['屋里', '屋裡'], ['眼里', '眼裡'], ['手里', '手裡'], ['怀里', '懷裡'],
  ['夜里', '夜裡'], ['话里', '話裡'], ['房里', '房裡'], ['车里', '車裡'], ['口袋里', '口袋裡'],
  // 发 → 髮（頭髮相關），其餘一律 → 發
  ['头发', '頭髮'], ['頭发', '頭髮'], ['发丝', '髮絲'], ['发梢', '髮梢'], ['发型', '髮型'],
  ['长发', '長髮'], ['短发', '短髮'], ['黑发', '黑髮'], ['白发', '白髮'], ['秀发', '秀髮'],
  ['毛发', '毛髮'], ['发际', '髮際'], ['发尾', '髮尾'], ['湿发', '濕髮'], ['乱发', '亂髮'],
  // 只 → 隻（量詞）
  ['一只手', '一隻手'], ['两只手', '兩隻手'], ['一只眼', '一隻眼'],
  // 干 → 乾／幹
  ['干净', '乾淨'], ['干燥', '乾燥'], ['干脆', '乾脆'], ['干嘛', '幹嘛'], ['干什么', '幹什麼'],
  // 其他高頻詞
  ['日历', '日曆'], ['钟表', '鐘錶'], ['手表', '手錶'], ['面条', '麵條'], ['出租车', '計程車'],
  ['准备', '準備'], ['标准', '標準'], ['复杂', '複雜'], ['重复', '重複'], ['恢复', '恢復'], ['回复', '回覆']
];

function convertSimplifiedToTraditional(text) {
  let out = String(text == null ? '' : text);
  if (!out) return out;
  // 先處理詞組，再處理單字 —— 順序反過來的話「头发」會先變成「頭发」而錯過髮
  for (const [s, t] of S2T_PHRASES) {
    if (out.includes(s)) out = out.split(s).join(t);
  }
  let converted = '';
  for (const ch of out) converted += S2T_CHAR_MAP.get(ch) || ch;
  // 詞組處理完後仍殘留的「发」一律視為「發」（髮的情境已在詞組表中處理）
  return converted.replace(/发/g, '發');
}

/**
 * 非台灣用語 → 台灣用語。
 * 只收「一對一、在小說語境中不會誤傷」的詞。刻意排除的例子：
 *  - 酒店：在台灣指有陪侍的場所，黑幫背景的故事裡很可能是刻意用的
 *  - 土豆：台灣指花生，不能換成馬鈴薯
 *  - 領導、顏值、內卷：台灣口語也在用，換掉反而不自然
 *  - 搜索：台灣法律用語是「搜索票」「搜索扣押」，換成「搜尋」會把司法情節寫錯
 *  - 網絡：「關係網絡」「人際網絡」在台灣是正確用法，角色卡本身就這樣寫
 * 取自「去 AI 感與台灣用語」守則的非台灣用語表。
 */
/**
 * 依作者的寫作守則（「去 AI 感與台灣用語」skill）改寫的小說版規則。
 * 原守則是給文案用的；小說版的差別：角色對白照各自口吻（吳衛廷可講台語與粗話），
 * 規則主要約束旁白。放在系統提示詞的固定段落，可吃到提示詞快取。
 */
const TW_FICTION_STYLE_RULES = `【台灣中文與去 AI 感（作者寫作守則，旁白必須遵守）】
- 用台灣用語、台灣字形與全形標點，不用中國大陸或港式用語（影片不寫視頻、品質不寫質量、叫車不寫打車、社區不寫小區、立刻不寫立馬）。角色對白照各自口吻。
- 旁白寫具體的人、動作、物件、聲音、氣味；溫度來自細節，不替讀者宣告感受（不寫「讓人心頭一暖」「美得令人窒息」）。
- 一句最多一個形容詞，程度用事實表達；一段最多一個比喻，取自日常生活或當下場景，不用典故。
- 對比翻轉句（不是 A 而是 B、與其說……不如說、看似……實則、比起 A 更重要的是 B）全回最多 1 次。
- 不寫昇華句與萬用金句（命運的齒輪、靈魂深處、真正的……是……、每一個……都……）。
- 不用絕對與誇大詞（極致、完美、無與倫比、前所未有）、生冷文藝詞（氤氳、繾綣、旖旎、靜謐、澄澈、寂寥）與評論行話（張力、肌理、底色、質地、場域）；國中生看得懂。
- 不用心理勵志腔（被看見、接住、安放、底氣、療癒、情緒價值）與「局」「刀」比喻（入局、破局、這局、手術刀）。
- 不用模板銜接與假坦白（此外、值得注意的是、總而言之、說真的、老實說），不用翻譯腔（進行＋動詞、作為一個、扮演……角色）。
- 旁白不用驚嘆號與「～」，破折號全回最多 2 處；超過 35 字的句子拆開，但不要短句連發。`;

/** 輔助請求（摘要、改寫、幕篇檔案）共用的簡短版。 */
const TW_PLAIN_STYLE_RULE = '用台灣繁體中文、台灣用語與全形標點；寫具體的事，不用誇大詞、生冷字、翻譯腔與心理勵志腔。';

const TAIWAN_TERM_REPLACEMENTS = [
  ['出租車', '計程車'], ['的士', '計程車'], ['打車', '叫車'], ['地鐵', '捷運'], ['公交車', '公車'],
  ['視頻', '影片'], ['短信', '簡訊'], ['信息', '訊息'], ['手機號', '手機號碼'], ['郵箱', '電子信箱'],
  ['屏幕', '螢幕'], ['軟件', '軟體'], ['賬號', '帳號'],
  ['質量', '品質'], ['身份證', '身分證'], ['身份', '身分'], ['公佈', '公布'],
  ['立馬', '立刻'], ['靠譜', '可靠'], ['小區', '社區'], ['服務員', '服務生'],
  ['盒飯', '便當'], ['方便麵', '泡麵'], ['西紅柿', '番茄'], ['酸奶', '優格'],
  ['冰激凌', '冰淇淋'], ['菠蘿', '鳳梨'], ['獼猴桃', '奇異果'], ['三文魚', '鮭魚'],
  ['充電寶', '行動電源'], ['U盤', '隨身碟'], ['點贊', '按讚'], ['反饋', '回饋'],
  ['水平很高', '水準很高'], ['性價比', 'CP 值'], ['咱們', '我們'], ['啥', '什麼'], ['咋', '怎麼'],
  // 2026-10-06 依作者寫作守則擴充；「酒店」「大佬」「拿捏」「支付」「策劃」「設置」「搜索票」「工資」「智能障礙」「代碼」「默認」「登錄」「卸載」「迭代」「兼容」在台灣有正常用法，不換
  ['帖子', '貼文'], ['私信', '私訊'], ['群聊', '群組'], ['刷屏', '洗版'], ['官宣', '正式宣布'],
  ['外賣', '外送'], ['公交', '公車'], ['航站樓', '航廈'], ['登機牌', '登機證'],
  ['厘米', '公分'], ['千米', '公里'], ['平方米', '平方公尺'],
  ['入職', '到職'], ['簡歷', '履歷'], ['社保', '勞健保'], ['調研', '調查'],
  ['牽頭', '主導'], ['高質量', '高品質'], ['高端', '高階'], ['營銷', '行銷'],
  ['打印', '列印'], ['複印', '影印'], ['鼠標', '滑鼠'], ['筆記本電腦', '筆電'], ['文檔', '文件'], ['界面', '介面'],
  ['博客', '部落格'], ['互聯網', '網際網路'], ['人工智能', '人工智慧'], ['數字化', '數位化'],
  ['服務器', '伺服器'], ['數據庫', '資料庫'], ['內存', '記憶體'], ['硬盤', '硬碟'],
  ['激活', '啟用'], ['截屏', '截圖'], ['芯片', '晶片'],
  ['算法', '演算法'], ['激光', '雷射'],
  ['音頻', '音訊'], ['高清', '高畫質'], ['充值', '儲值'],
  ['打工人', '上班族'], ['顏值', '外型'], ['吃瓜', '看熱鬧'], ['內卷', '過度競爭'], ['接地氣', '生活化'],
  ['牛逼', '厲害'], ['搞掂', '搞定'], ['埋單', '結帳'], ['寫字樓', '辦公大樓'], ['按揭', '房貸'],
  ['賦能', '協助'], ['底層邏輯', '運作原理'], ['抓手', '著力點'], ['閉環', '完整流程'],
  ['痛點', '困擾'], ['觸達', '接觸到'],
  ['運營', '營運'], ['鏈接', '連結']
];

/**
 * 標點正規化：半形 → 全形、引號 → 「」、刪節號 → ……
 * 只轉換「夾在中文之間」的半形標點，避免破壞 BMW X6、M60i、3.5 這類英數。
 */
function normalizeChinesePunctuation(text) {
  let out = String(text == null ? '' : text);
  if (!out) return out;
  // 先轉引號：後面判斷「標點是否夾在中文之間」時，引號必須已經是全形
  // 成對的彎引號才轉換；落單的不動，以免錯配
  out = out.replace(/“([^“”]*)”/g, '「$1」').replace(/‘([^‘’]*)’/g, '『$1』');
  out = out.replace(/\.{3,}|。{3,}|…(?!…)/g, '……').replace(/…{3,}/g, '……');
  const cjk = '\u3400-\u9fff\uff00-\uffef「」『』';
  const map = { ',': '，', '.': '。', '?': '？', '!': '！', ':': '：', ';': '；' };
  out = out.replace(new RegExp(`([${cjk}])([,.?!:;])(?=[${cjk}\\s]|$)`, 'g'), (m, a, p) => a + map[p]);
  return out;
}

function applyTaiwanTerms(text) {
  let out = String(text == null ? '' : text);
  for (const [from, to] of TAIWAN_TERM_REPLACEMENTS) {
    if (out.includes(from)) out = out.split(from).join(to);
  }
  return out;
}

/** 單一欄位的完整潤飾：簡繁 → 台灣用語 → 標點。 */
function polishTaiwaneseText(text) {
  return normalizeChinesePunctuation(applyTaiwanTerms(convertSimplifiedToTraditional(text)));
}

/** 把章節中所有玩家看得到的文字欄位轉為繁體，回傳轉換了幾個字。 */
function normalizeChapterChinese(chapter) {
  if (!chapter || typeof chapter !== 'object') return 0;
  let changed = 0;
  const fix = value => {
    if (typeof value !== 'string' || !value) return value;
    const next = polishTaiwaneseText(value);
    if (next !== value) {
      for (let i = 0; i < value.length; i += 1) if (value[i] !== next[i]) changed += 1;
    }
    return next;
  };
  chapter.prose = fix(chapter.prose);
  chapter.chapterTitle = fix(chapter.chapterTitle);
  if (chapter.statusPanel && typeof chapter.statusPanel === 'object') {
    for (const key of Object.keys(chapter.statusPanel)) {
      chapter.statusPanel[key] = fix(chapter.statusPanel[key]);
    }
  }
  if (Array.isArray(chapter.choices)) {
    chapter.choices.forEach(choice => {
      if (!choice || typeof choice !== 'object') return;
      choice.label = fix(choice.label);
      choice.hint = fix(choice.hint);
    });
  }
  return changed;
}

/**
 * 容許的簡體字數上限。
 * 原本只要出現一個就整章退回重試 —— 那過於嚴苛：偶爾一兩個簡體字
 * 讀者幾乎不會察覺，但重試要多花一次模型額度與數十秒等待，
 * 代價遠高於瑕疵本身。超過這個數量才視為「模型整段切換成簡體」。
 */
const SIMPLIFIED_CHINESE_TOLERANCE = 5;


function countSimplifiedChineseMarkers(prose) {
  return (String(prose || '').match(/[这为后发会门问见与东个来时说车书里边应过还从对将无现开关经处实试]/g) || []).length;
}

function getLongestRecentLiteraryEcho(prose, historyList = []) {
  const normalize = value => String(value || '').replace(/[\s，。！？!?；;、：「」『』“”‘’（）()—…·,.:'"\-]/g, '');
  const current = normalize(prose);
  let longest = 0;
  (Array.isArray(historyList) ? historyList : []).slice(-3).forEach(item => {
    const previous = normalize(item?.prose || item?.chapter?.prose || '');
    if (!current || !previous) return;
    let priorRow = new Uint16Array(previous.length + 1);
    for (let i = 1; i <= current.length; i += 1) {
      const row = new Uint16Array(previous.length + 1);
      for (let j = 1; j <= previous.length; j += 1) {
        if (current[i - 1] === previous[j - 1]) {
          row[j] = priorRow[j - 1] + 1;
          if (row[j] > longest) longest = row[j];
        }
      }
      priorRow = row;
    }
  });
  return longest;
}

function assessLiteraryQuality(chapter, historyList = []) {
  const prose = String(chapter?.prose || '').trim();
  const warnings = [];
  const clichéHits = LITERARY_CLICHE_PATTERNS.filter(phrase => prose.includes(phrase));
  if (clichéHits.length > 1) warnings.push(`套路語密度偏高：${clichéHits.slice(0, 4).join('、')}`);

  const simileCount = countLiterarySimiles(prose);
  if (simileCount > 6) warnings.push(`比喻訊號過密（${simileCount} 次）`);

  const repeatedSentenceCount = countRepeatedLiterarySentences(prose);
  if (repeatedSentenceCount) warnings.push(`完整句子重複（${repeatedSentenceCount} 次）`);

  const simplifiedChineseCount = countSimplifiedChineseMarkers(prose);
  if (simplifiedChineseCount > SIMPLIFIED_CHINESE_TOLERANCE) {
    warnings.push(`混入簡體字（${simplifiedChineseCount} 字）`);
  }

  const recentEchoLength = getLongestRecentLiteraryEcho(prose, historyList);
  if (recentEchoLength >= 12) warnings.push(`沿用近期回合措辭（連續 ${recentEchoLength} 字）`);

  const sentences = prose.split(/[。！？!?]+/).map(s => s.trim()).filter(s => s.length >= 4);
  if (sentences.length >= 8) {
    const lengths = sentences.map(s => s.length);
    const average = lengths.reduce((sum, n) => sum + n, 0) / lengths.length;
    const variance = lengths.reduce((sum, n) => sum + Math.pow(n - average, 2), 0) / lengths.length;
    if (Math.sqrt(variance) < 7) warnings.push('句長變化偏低，節奏可能過度整齊');
  }

  const previousOpenings = (Array.isArray(historyList) ? historyList : [])
    .slice(-3)
    .map(item => String(item?.prose || '').replace(/\s+/g, '').slice(0, 18))
    .filter(Boolean);
  const currentOpening = prose.replace(/\s+/g, '').slice(0, 18);
  if (currentOpening && previousOpenings.includes(currentOpening)) warnings.push('章節開頭與近期回合重複');

  const choices = Array.isArray(chapter?.choices) ? chapter.choices : [];
  const longChoices = choices.filter(choice => String(choice?.label || '').length > 120).length;
  if (longChoices) warnings.push(`${longChoices} 個選項過長，分散正文注意力`);

  const tail = prose.slice(-220).replace(/\s+/g, ' ');
  const formulaicClosure = /這不是[^。！？]{1,40}[。！？][\s\S]{0,28}?這是[^。！？]{1,40}[。！？]/.test(prose)
    || /這不是[^，。！？]{1,40}[，,]\s*是[^。！？]{1,40}[。！？]/.test(prose)
    || /(?:這只是|一切才|一切只是).{0,10}(?:開始|剛開始)/.test(tail);
  if (formulaicClosure) warnings.push('結尾使用判詞式總結，缺少具體餘韻');

  return {
    score: Math.max(0, 100 - clichéHits.length * 8 - Math.max(0, simileCount - 2) * 5 - repeatedSentenceCount * 8 - Math.max(0, simplifiedChineseCount - SIMPLIFIED_CHINESE_TOLERANCE) * 12 - Math.max(0, recentEchoLength - 11) * 3 - longChoices * 5 - (formulaicClosure ? 12 : 0) - warnings.length * 4),
    warnings,
    metrics: { clichéHits, simileCount, repeatedSentenceCount, simplifiedChineseCount, recentEchoLength, sentenceCount: sentences.length, longChoices, formulaicClosure }
  };
}

function getLiteraryValidationError(chapter, historyList = []) {
  const quality = assessLiteraryQuality(chapter, historyList);
  if (quality.metrics.clichéHits.length >= 3) return `套路語過多（${quality.metrics.clichéHits.length} 項）`;
  if (quality.metrics.simileCount > 6) return `比喻訊號過密（${quality.metrics.simileCount} 次）`;
  if (quality.metrics.simplifiedChineseCount > SIMPLIFIED_CHINESE_TOLERANCE) {
    return `混入簡體字（${quality.metrics.simplifiedChineseCount} 字）`;
  }
  if (quality.metrics.formulaicClosure) return '使用判詞式模板收尾';
  if (quality.metrics.repeatedSentenceCount >= 2) return `完整句子重複（${quality.metrics.repeatedSentenceCount} 次）`;
  if (quality.metrics.recentEchoLength >= 12) return `沿用近期回合措辭（連續 ${quality.metrics.recentEchoLength} 字）`;
  if (quality.score < 65) return `文學品質分數過低（${quality.score}）`;
  return '';
}

function buildFirstTurnPrompt(profile) {
  const isShura = profile.targetLead === '修羅場' || profile.targetLeadName === '修羅場';
  const customScenario = (profile.customScenario || '').trim();
  const leadKey = profile.targetLead || '01_徐令謙';

  // 1. 動態偵測自訂情境中是否包含配角
  const activeNPCs = detectActiveNPCs('', customScenario, leadKey, profile.supportingLeads || []);
  const characterPromptBlock = assembleCharacterPromptBlock(leadKey, activeNPCs, isShura);
  const literaryCraftBlock = buildLiteraryCraftBlock(1, []);

  const systemPrompt = `你是連載長篇小說作者，同時負責維持互動故事的狀態資料。正文必須先像可出版的小說成立，再正確填寫遊戲欄位。
${CHARACTER_IDENTITY_FIREWALL}
${TW_FICTION_STYLE_RULES}
【最高指導原則：全量人物設定 100% 絕對對標（最高約束力）】：
1. 【嚴格對標座車與配件】：提及角色出入或座車時，必須 100% 使用其設定檔中的指定座車（例如：楊紹宸為私人鐵灰 Audi RS7 / 公務黑色 Benz S680 配司機，絕非邁巴赫；徐令謙為 BMW M760i / X6 M60i；韓正寰為 Škoda Enyaq；邵翊衡為 Porsche 911 / Audi A8；徐宇寧為 Volvo XC60；徐承勳為 Audi A8 L 防彈裝甲車 / Jaguar F-Type；江瀚文為 Aston Martin DBS 等），嚴禁 AI 自行隨意發明！
2. 【嚴格對標官方職銜與稱謂】：必須使用精準官方職稱（徐令謙在正式、政商場合稱「徐顧問」，熟識者、天裕會與江湖人物稱「謙哥」，不得另造老派排行尊稱；楊紹宸為弘楊集團「副總/楊副總/二哥」，絕非少東；韓正寰為「檢察官（韓檢）/白日判官」；徐宇寧為「明隱牙醫院長兼專職牙醫」，絕非檢警或黑道；沈湛然為「台大醫院精神科主治醫師」，絕非院長或外科）。
3. 【嚴格對標專屬說話風格與語句】：必須嚴格參照各角色設定檔中的口吻與範例台詞。徐令謙必須冷靜、自持、紳士，台詞簡潔有份量，不油條、不浮誇、不逞兇鬥狠；對玩家尊重自主，以克制形成張力，力量只朝向外部風險。不得把冷靜寫成冷酷、保護寫成控制、佔有慾寫成剝奪自由。
4. 【血緣與親情既定事實】：楊慕璃與二哥楊紹宸同住陽明山大宅，熟知彼此生活習慣，嚴禁任何初次見面的陌生化描寫！

${literaryCraftBlock}

請嚴格遵守《情慾文學指引》與《系統核心指令》：
1. 核心與成人情慾（R-18）：本作以情慾與戀愛為核心，商戰、政治、權謀與職場為背景與阻力。以人物慾望、主動、五感細節形成張力；使用純台灣繁體中文。
   - 徐令謙專屬例外：克制、壓抑、紀律嚴明，唯獨面對玩家會控制不住；傲嬌卻主動，會要求、請求、彆扭地撒嬌；平時紳士而篤定，不靠命令或威脅；情慾正濃、吃醋或危機等劇情氛圍需要時，可以強勢、直接下命令，用的仍是乾淨有教養的語言。
2. 【正文篇幅目標】prose 建議 800–1200 個中文字，依場景需要自然增減。完成一個實質改變局勢或關係的戲劇節拍，不必每回高潮或封口；不截斷、不灌水、不套固定模板。
3. 【數值真實性運算規則】：
   - tension（張力值 0~100）：依據當前壓迫感/物理距離/對峙危險度給出具體整數。
   - intoxication（微醺度 0~100）：【物理法則】只有在正文中實際喝了酒才會增加（一杯酒+15~20）；若無任何飲酒情節，數值必須保持 0！
${FEATURES.favorability ? '   - favorabilityDelta（好感度變動 -5~+10）：依據主角言行魅力與交鋒魄力給予增減（初次見面展現膽識給予 +2~+5）。\n' : ''}   - 【線索與籌碼】：只有正文中真的取得、查證、曝光或交付的資訊才能寫入 intelDelta。新增線索必須說明來源與用途；沒有變動時回傳空陣列，嚴禁憑空塞入通用道具。
4. 【三層角色設定集】：
${characterPromptBlock}

5. 輸出必須為合法純 JSON 格式（不要包含任何 markdown 標記）：
{
  "chapterTitle": "原創章節標題（只寫標題，不要寫「第幾幕」「第幾回」）",
  "statusPanel": {
    "timeLocation": "具體時空地點（如：2026年5月12日 21:30 台北市士林區...）",
    "tension": 【依劇情張力給出 0~100 整數，初次見面高壓對峙約 60~75】,
    "tensionLabel": "【依 tension 數值原創描述，如：高壓對峙 · 步步緊逼】",
    "intoxication": 0,
    "intoxicationLabel": "完全清醒",
${FEATURES.favorability ? '    "favorabilityDelta": 【依主角言行給 -5~+10 整數】,\n    "favorabilityReason": "【原因說明】",\n' : ''}    "outfit": "角色著裝神態（依主角性別與職業原創高級迷人穿搭、香氣與神態）",
    "interaction": "肢體接觸與眼神距離",
    "rumors": "台北政媒黑白兩道最新暗流傳聞"
  },
  "intelDelta": {
    "add": [{ "id": "intel_英文短碼", "name": "具體線索名稱", "type": "evidence|intel|contact|access", "confidence": "unverified|partial|verified", "source": "取得來源", "effect": "可用於何種查證或談判" }],
    "update": [{ "id": "既有線索ID", "status": "available|exposed|delivered|invalid", "confidence": "unverified|partial|verified", "effect": "狀態改變後的用途" }]
  },
  "stateDelta": {
    "hpChange": 0,
    "sanityChange": 0,
    "itemsAdded": [],
    "itemsRemoved": [],
${FEATURES.favorability ? `    "relationshipChanges": { "${profile.targetLeadName || '主要對象'}": 0 },\n` : ''}    "questProgress": "本回實際推進的任務狀態；沒有則留空字串"
  },
  "prose": "【800–1200 個中文字為建議範圍；完成一個有因果的戲劇節拍，保留具體餘波，不截斷、不灌水、不以旁白解釋潛台詞】",
  "memoryNotes": [{ "topic": "【寫成「誰的什麼」，具體到人與物，16 字內，例如：祖母綠胸針放在哪、楊慕璃與徐令謙碰面的時間地點、韓正寰的職銜】", "fact": "【本回新確立、日後必須記得的事實，40 字內，寫清楚人名：承諾約定（時間地點）、物品去向、身分或秘密揭露、關係轉折】" }],
  "choices": [
    { "id": "A", "label": "[A] 【25–60 字：一個明確行動＋必要對白】", "risk": "low", "hint": "【10–24 字策略提示】" },
    { "id": "B", "label": "[B] 【25–60 字：不同策略的一個行動＋必要對白】", "risk": "medium", "hint": "【10–24 字策略提示】" },
    { "id": "C", "label": "[C] 【25–60 字：高風險、可能翻盤的行動＋必要對白】", "risk": "high", "hint": "【10–24 字策略提示】" }
  ]
}`;

  const userPrompt = `【玩家角色】
- 姓名：${profile.name}
- 性別：${profile.gender || '女'}
- 年齡：${profile.age || '24'}
- 職業：${profile.profession || '政經公關總監'}
- 身世背景：${profile.background || '遊走於台北政商黑白兩道'}
- 外貌特徵：${profile.appearance || '隨機（請原創專屬高級迷人穿搭、體香與神態）'}
- 禁忌標籤：${profile.taboos || '無'}
- 成人情慾模式 (R-18)：開啟${isDominantPlotEnabled(profile) ? '\n- 強勢主導劇情：已勾選同意' : ''}

- 玩家自訂開局情境：${customScenario || '深夜暴雨台北，帶著關鍵政商洗錢密錄暗帳初次入局'}

請根據以上設定與開局情境創作第 1 回。直接從一個正在發生的具體動作切入，讓人物意圖透過選擇、對話潛台詞與場景細節浮現；不要先介紹世界觀，也不要用旁白宣告角色危險、迷人或充滿性張力。最後生成三個精簡且真正不同策略的抉擇。比喻一段最多一個，取自日常生活或當下場景。

${buildDominantPlotBlock(profile)}

${buildContentModeBlock('normal', profile.allowR18)}`;

  return { systemPrompt, userPrompt };
}

function buildNextTurnPrompt(turnCount, choiceId, customInput, profile, historyList, summaryPool, saveState = state.saveState, retrievedMemoryBlock = '', patrolCorrectionBlock = '') {
  const isShura = profile.targetLead === '修羅場' || profile.targetLeadName === '修羅場';
  const leadKey = profile.targetLead || '01_徐令謙';
  
  // 提取最近回合文本與玩家輸入進行配角掃描
  const lastChapter = (historyList || [])[(historyList || []).length - 1] || {};
  const lastProseText = lastChapter.prose || '';
  const playerActionText = customInput || choiceId;

  // 1. 動態偵測在場配角
  const activeNPCs = detectActiveNPCs(lastProseText, playerActionText, leadKey, profile.supportingLeads || []);
  const characterParts = assembleCharacterPromptParts(leadKey, activeNPCs, isShura);

  // 2. 上下文信封各區塊（見 CONTEXT_BUDGET 的說明）
  const playerBlock = buildPlayerProfileBlock(profile);
  const dossierBlock = buildActDossierBlock(saveState);
  const recentHistory = buildRecentHistoryBlock(historyList, saveState);
  const pinnedMemoryBlock = buildPinnedMemoryBlock(historyList, saveState);
  const liveStateBlock = buildLiveStateBlock(saveState, profile);
  const summaryBlock = summaryPool ? `【長期劇情摘要池（中期劇情的濃縮事實）】\n${summaryPool}\n` : '';
  const timelineBlock = buildTurnTimelineBlock(turnCount);
  const literaryCraftBlock = buildLiteraryCraftBlock(turnCount, historyList);

  const systemPrompt = `你是連載長篇小說作者，同時負責維持互動故事的狀態資料。正文必須先像可出版的小說成立，再正確填寫遊戲欄位。
${CHARACTER_IDENTITY_FIREWALL}
【最高指導原則：全量人物設定 100% 絕對對標（最高約束力）】：
1. 【嚴格對標座車與配件】：提及角色出入或座車時，必須 100% 使用其設定檔中的指定座車（例如：楊紹宸為私人鐵灰 Audi RS7 / 公務黑色 Benz S680 配司機，絕非邁巴赫；徐令謙為 BMW M760i / X6 M60i；韓正寰為 Škoda Enyaq；邵翊衡為 Porsche 911 / Audi A8；徐宇寧為 Volvo XC60；徐承勳為 Audi A8 L 防彈裝甲車 / Jaguar F-Type；江瀚文為 Aston Martin DBS 等），嚴禁 AI 自行隨意發明！
2. 【嚴格對標官方職銜與稱謂】：必須使用精準官方職稱（徐令謙在正式、政商場合稱「徐顧問」，熟識者、天裕會與江湖人物稱「謙哥」，不得另造老派排行尊稱；楊紹宸為弘楊集團「副總/楊副總/二哥」，絕非少東；韓正寰為「檢察官（韓檢）/白日判官」；徐宇寧為「明隱牙醫院長兼專職牙醫」，絕非檢警或黑道；沈湛然為「台大醫院精神科主治醫師」，絕非院長或外科）。
3. 【嚴格對標專屬說話風格與語句】：必須嚴格參照各角色設定檔中的口吻與範例台詞。徐令謙必須冷靜、自持、紳士，台詞簡潔有份量，不油條、不浮誇、不逞兇鬥狠；對玩家尊重自主，以克制形成張力，力量只朝向外部風險。不得把冷靜寫成冷酷、保護寫成控制、佔有慾寫成剝奪自由。
4. 【血緣與親情既定事實】：楊慕璃與二哥楊紹宸同住陽明山大宅，熟知彼此生活習慣，嚴禁任何初次見面的陌生化描寫！

${TW_FICTION_STYLE_RULES}

請嚴格遵守《情慾文學指引》與《系統核心指令》：
1. 嚴格依據玩家最新行動推進。prose 篇幅依結尾【本回情慾尺度】的要求；每回都要有實質推進（關係更進一步、事件發生或真相揭露），不能整回停在試探、對峙或寒暄；不截斷、不灌水。
2. 描寫要求：本作以情慾與戀愛為核心，權謀與職場是背景與阻力。以人物慾望、主動、距離變化、對話潛台詞及具體感官細節推動感情線；不得只提高形容詞強度，使用純台灣繁體中文。
   - 徐令謙專屬例外：克制、壓抑、紀律嚴明，唯獨面對玩家會控制不住；傲嬌卻主動，會要求、請求、彆扭地撒嬌；平時紳士而篤定，不靠命令或威脅；情慾正濃、吃醋或危機等劇情氛圍需要時，可以強勢、直接下命令，用的仍是乾淨有教養的語言。
3. 絕不重複前篇標題與對話；每回必須產生新資訊、選擇代價或關係偏移，但不必機械式升級衝突。
3-A. 【時空連續性】本回必須從上一回最後的時間、地點與人物物理位置接續。若 timeLocation 改變，prose 必須明寫離開、移動、抵達或時間流逝的過程；嚴禁狀態面板靜默跳到新地點。連續對話或同一場景原則上只能自然推進數分鐘；若時鐘跳動超過 30 分鐘，正文必須明確交代經過多久與期間發生何事，不得自行從深夜跳到凌晨數小時後。
3-B. 【核心人物連續性】主要攻略對象若上一回仍在場，本回預設他仍在場並延續互動。只有發生無法推辭的緊急事件時才可離開，且必須先鋪陳；不得無故消失、換人或重置彼此已知情報。
4. 【數值真實性運算規則】：
   - tension（張力值 0~100）：依據當前壓迫感/物理距離/對峙危險度給出具體整數。
   - intoxication（微醺度 0~100）：【物理法則】只有在正文中實際喝了酒才會增加（一杯酒+15~20）；若無任何飲酒情節，微醺度保持原值或隨時間代謝衰減 5%！
${FEATURES.favorability ? '   - favorabilityDelta（好感度變動 -5~+10）：依據主角此舉是否合乎該男主性格給予增減（精準博弈 +2~+5，重大浪漫/致命共犯 +8~+10，失誤冒犯 -2~-5）。' + '\n' : ''}   - 【線索與籌碼狀態機】：只能操作【當前數值狀態】列出的可用線索 ID。正文真的取得新線索才放入 intelDelta.add；使用、公開、交付、證偽既有線索時，必須在 intelDelta.update 更新 status 或 confidence。沒有變動時兩個陣列都留空。
5. 【三層角色設定集】：
${characterParts.stable}

6. 輸出必須為合法純 JSON 格式（不要包含 markdown 代碼標記）：
{
  "chapterTitle": "全新章節標題（只寫標題，不要寫「第幾幕」「第幾回」，編號由系統標示）",
  "prose": "【篇幅依結尾【本回情慾尺度】的要求；緊接玩家行動，完成一個有因果的戲劇節拍並保留具體餘波；不截斷、不灌水、不解釋潛台詞】",
  "statusPanel": {
    "timeLocation": "時空地點",
    "tension": 70,
    "tensionLabel": "高壓對峙",
    "intoxication": 0,
    "intoxicationLabel": "清醒",
${FEATURES.favorability ? '    "favorabilityDelta": 4,\n    "favorabilityReason": "機鋒應對擊中軟肋",\n' : ''}    "outfit": "角色著裝神態",
    "interaction": "肢體與眼神互動狀態",
    "rumors": "政媒暗流傳聞"
  },
  "intelDelta": {
    "add": [{ "id": "intel_英文短碼", "name": "具體線索名稱", "type": "evidence|intel|contact|access", "confidence": "unverified|partial|verified", "source": "取得來源", "effect": "可用於何種查證或談判" }],
    "update": [{ "id": "既有線索ID", "status": "available|exposed|delivered|invalid", "confidence": "unverified|partial|verified", "effect": "更新後用途" }]
  },
  "stateDelta": {
    "hpChange": 0,
    "sanityChange": 0,
    "itemsAdded": [],
    "itemsRemoved": [],
${FEATURES.favorability ? `    "relationshipChanges": { "${profile.targetLeadName || '主要對象'}": 0 },\n` : ''}    "questProgress": "本回實際推進的任務狀態；沒有則留空字串"
  },
  "memoryNotes": [{ "topic": "【寫成「誰的什麼」，具體到人與物，16 字內，例如：祖母綠胸針放在哪、楊慕璃與徐令謙碰面的時間地點、韓正寰的職銜】", "fact": "【本回新確立、日後必須記得的事實，40 字內，寫清楚人名：承諾約定（時間地點）、物品去向、身分或秘密揭露、關係轉折】" }],
  "choices": [
    { "id": "A", "label": "[A] 【25–60 字：一個明確行動＋必要對白】", "risk": "low", "hint": "【10–24 字提示】" },
    { "id": "B", "label": "[B] 【25–60 字：不同策略的一個行動＋必要對白】", "risk": "medium", "hint": "【10–24 字提示】" },
    { "id": "C", "label": "[C] 【25–60 字：高風險、可能翻盤的行動＋必要對白】", "risk": "high", "hint": "【10–24 字提示】" }
  ]
}

=== 【本回場景補充（依本回情境挑選，與上方設定同等權威）】 ===
${characterParts.scene}
${buildLoreRecalibrationNote(turnCount, profile.targetLeadName || '主要對象')}

${literaryCraftBlock}`;

  // 由遠而近排列：幕篇檔案 → 摘要池 → 近期全文 → 當前數值 → 本回行動。
  // 最新且最需要精準銜接的資訊放在結尾，模型對結尾的注意力最強。
  const userPrompt = [
    playerBlock,
    '',
    `【目前進度】第 ${saveState?.meta?.currentAct || 1} 幕 · 第 ${turnCount} 回`,
    '',
    dossierBlock,
    summaryBlock,
    timelineBlock,
    retrievedMemoryBlock,
    patrolCorrectionBlock,
    pinnedMemoryBlock,
    recentHistory,
    '',
    liveStateBlock,
    '',
    '【玩家本回最新行動】',
    `- 抉擇標籤或自訂行動：${playerActionText}`,
    '',
    '請緊接玩家最新行動，以具體選擇、對話潛台詞與場景後果呈現對手反應；不要用旁白直接宣布情緒、權力或性張力。生成 3 個精簡、策略真正不同的分支選項。',
    '務必與上方【近期劇情】的場景、時間、在場人物與物理位置完全銜接，不可跳接或重置場景。',
    '若本回變更 timeLocation，正文必須先敘明移動或時間流逝；連續場景不可讓時鐘無故跳超過 30 分鐘。主要攻略對象預設不離場；若真的必須離開，正文要先鋪陳無法推辭的原因。',
    '不要使用近期已列出的套路語或近義改寫。',
    // 人稱規則在系統提示詞前段也有，但露骨鏈的 qwen3-30b 對前段規則遵守較差，結尾再強調一次
    /男/.test(profile.gender || '') ? '旁白稱呼玩家一律用「你」。' : '玩家是女性：旁白一律用第二人稱「妳」稱呼玩家，不可寫成「你」，也不可改用第三人稱「她」。',
    '',
    isShura ? '' : buildCharacterSpotlightBlock(leadKey, activeNPCs.map(n => n.id)),
    '',
    // 放在角色演繹重點之後：演繹卡的「克制、給選擇權」描述不得壓過主動性
    buildMaleLeadInitiativeBlock(profile.allowR18),
    '',
    buildDominantPlotBlock(profile),
    '',
    buildPacingBlock(profile, saveState, turnCount),
    '',
    buildContentModeBlock(state.generationMode, profile.allowR18)
  ].filter(part => part !== undefined && part !== null).join('\n');

  return { systemPrompt, userPrompt };
}

async function triggerRollingSummaryUpdate(turnCount) {
  if (!state.saveState || turnCount <= 1 || !state.token || state.token.startsWith('tok_local_')) return;
  const sourceState = state.saveState;
  const sourceToken = state.token;
  const sourceSummary = sourceState.summaryPool || '';
  const sourceHistory = JSON.stringify(state.chapterHistoryList || []);
  console.log(`[MemoryPipeline] Triggering rolling summary compression for Turn ${turnCount}...`);

  const recent5Turns = (state.chapterHistoryList || []).slice(-5).map(h => ({
    turn: h.turn,
    title: h.chapterTitle,
    action: h.chosenLabel,
    prose: clampBlock(h.prose, CONTEXT_BUDGET.recentProsePerTurn),
    offeredChoices: (h.choices || []).map(choice => choice.label).filter(Boolean)
  }));

  const systemPrompt = '你是小說記憶統整引擎。請將現有摘要與最新 5 回合完整故事紀錄整合為 3,000 ~ 4,500 字的高資訊密度摘要池。'
    + '務必保留：關鍵對話與承諾、人物知道或不知道的資訊、場景位置與時間、物品去向、關係轉折、重大線索、尚未完成的行動。'
    + '依時間順序分段，寫清楚人名，不寫評論與形容。請一律使用台灣繁體中文輸出純文字摘要，不要多餘寒暄。' + TW_PLAIN_STYLE_RULE;
  const userPrompt = `--- 現有摘要池 ---\n${state.saveState.summaryPool || '（初始開局）'}\n\n--- 待整合的最新回合記錄 ---\n${JSON.stringify(recent5Turns, null, 2)}\n\n【請直接輸出更新後的純摘要文字】：`;

  try {
    // 改走 Worker：先前經 GAS 代理，GAS 停在舊版時摘要會被白名單擋下而靜默失效
    const raw = await requestWorkerCompletion({
      model: LLM_CONFIG.SUMMARY_MODEL,
      system: systemPrompt,
      user: userPrompt,
      maxTokens: 4000,
      temperature: 0.2,
      timeoutMs: 120000
    });
    // 摘要會被注入每一回的提示詞，簡體字與非台灣用語要在這裡就清掉
    const newSummary = raw ? polishTaiwaneseText(raw) : '';
    const stillCurrent = state.saveState === sourceState && state.token === sourceToken
      && state.saveState.turnCount === turnCount
      && (state.saveState.summaryPool || '') === sourceSummary
      && JSON.stringify(state.chapterHistoryList || []) === sourceHistory;
    if (!newSummary || newSummary.length <= 20) {
      console.warn('[MemoryPipeline] 摘要池更新回傳空內容，長期記憶本回未更新。');
      return;
    }
    if (stillCurrent) {
      state.saveState.summaryPool = clampSummaryPool(newSummary);
      safeLocalStorageSet('undercurrent_current_save_state', JSON.stringify(state.saveState));
      console.log(`[MemoryPipeline] 摘要池已更新（${newSummary.length} 字）。`);
      syncStateToGoogleDriveCloud(state.saveState, state.chapterData);
    }
  } catch (err) {
    console.warn('[MemoryPipeline] 摘要池更新失敗，長期記憶本回未更新：', err.message);
  }
}

// =========================================================================
// 5. 開新局與回合推進 (New Game & Turn Progression)
// =========================================================================

async function handleCharacterCreationSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();

  try {
    const targetSelect = document.getElementById('form-target-lead') || dom.formTargetLead;
    const selectedOption = (targetSelect && targetSelect.options && targetSelect.selectedIndex >= 0) ? targetSelect.options[targetSelect.selectedIndex] : null;

    const supportingCheckboxes = document.querySelectorAll('.supporting-lead-cb:checked');
    const supportingLeads = Array.from(supportingCheckboxes).map(cb => cb.value);

    const profile = {
      name: document.getElementById('form-player-name')?.value?.trim() || '楊慕璃',
      gender: document.getElementById('form-player-gender')?.value || '女',
      age: document.getElementById('form-player-age')?.value?.trim() || '24',
      profession: document.getElementById('form-player-profession')?.value?.trim() || '弘楊集團公關總監 · 瑾和文教基金會執行長',
      background: document.getElementById('form-player-background')?.value?.trim() || '台大法律/北大犯罪所畢業。身為楊家三房獨生女，在權謀風暴中憑藉智慧與魅力遊走於各方勢力之間。',
      appearance: document.getElementById('form-player-appearance')?.value?.trim() || '隨機',
      taboos: document.getElementById('form-player-taboos')?.value?.trim() || '禁止暴力侮辱，無特定雷區',
      targetLead: targetSelect?.value || '01_徐令謙',
      targetLeadName: selectedOption?.getAttribute('data-name') || '徐令謙',
      supportingLeads: supportingLeads,
      allowR18: document.getElementById('form-allow-r18')?.checked !== false,
      allowDominantPlot: document.getElementById('form-allow-dominant')?.checked === true,
      customScenario: document.getElementById('form-custom-scenario')?.value?.trim() || ''
    };

    closeCharacterCreationModal();
    switchView('gameplay');
    await startNewGameWithProfile(profile);
  } catch (err) {
    console.error('[handleCharacterCreationSubmit Error]', err);
    sendTelemetryError('START_GAME_ERROR', err.message, { stack: err.stack });
    await notifyDialog('開局發生異常：' + err.message + '\n系統正在嘗試自動恢復。', '開局異常');
    switchView('gameplay');
  }
}

async function startNewGameWithProfile(profile) {
  if (state.isGenerating) return notifyUser('劇情正在生成，請稍候。');
  const previousGameSnapshot = {
    playerProfile: state.playerProfile,
    saveState: state.saveState,
    chapterData: state.chapterData,
    chapterHistoryList: state.chapterHistoryList,
    lastChoicePayload: state.lastChoicePayload,
    previousStateSnapshot: state.previousStateSnapshot
  };
  setGenerationBusy(true);
  state.generationAbortRequested = false;
  // 1. 徹底重置遊戲全域狀態與 DOM（絕不殘留舊局卡片）
  state.playerProfile = profile;
  // 自 Drive 預熱角色卡（不 await：第 1 回先用硬編資料，取回後從第 2 回起升級為全量人設）
  warmLoreCache(profile);
  state.chapterHistoryList = [];
  state.chapterData = null;
  state.lastChoicePayload = null;
  state.previousStateSnapshot = null;
  
  if (dom.novelStreamContainer) dom.novelStreamContainer.innerHTML = '';
  if (dom.choicesContainer) dom.choicesContainer.innerHTML = '';
  if (dom.customActionInput) dom.customActionInput.value = '';


  const isShura = profile.targetLead === '修羅場' || profile.targetLeadName === '修羅場';
  const targetLeadDisplay = isShura ? '全勢力男主（修羅場）' : profile.targetLeadName;

  const rels = {};
  if (isShura) {
    rels['徐令謙'] = 20;
    rels['韓正寰'] = 15;
    rels['楊紹宸'] = 10;
  } else {
    rels[profile.targetLeadName] = 25;
    (profile.supportingLeads || []).forEach(leadKey => {
      const sLead = OFFICIAL_DRIVE_CHARACTERS[leadKey];
      if (sLead) rels[sLead.name] = 15;
    });
  }

  state.saveState = {
    meta: {
      userId: state.userId || 'usr_local',
      createdAt: new Date().toISOString(),
      currentAct: 1,
      playerProfile: profile,
      initialStateBaseline: {
        protagonist: { hp: 100, sanity: 100 },
        relationships: JSON.parse(JSON.stringify(rels)),
        inventory: [],
        intelLedger: [],
        questFlags: {
          main_quest: isShura ? '暗流初會：在全勢力交鋒中破局' : `初會：與 ${profile.targetLeadName} 的交鋒`
        }
      }
    },
    turnCount: 1,
    protagonist: {
      id: profile.targetLead,
      name: targetLeadDisplay,
      hp: 100,
      sanity: 100
    },
    inventory: [], // 舊版相容欄位；新系統一律使用 intelLedger
    intelLedger: [],
    relationships: rels,
    questFlags: {
      main_quest: isShura ? '暗流初會：在全勢力交鋒中破局' : `初會：與 ${profile.targetLeadName} 的交鋒`
    },
    summaryPool: `玩家 ${profile.name} 正式入局，情境設定：${(profile.customScenario || '全新開局').slice(0, 50)}...`,
    pinnedMemories: [],
    turnHistory: []
  };

  renderSaveState();

  switchView('gameplay');
  showLoading('選項確認中……', '正在依照自訂人設與情境即時生成第 1 回……');

  let initialChapter = null;
  try {
    await preparePersonaForTurn(profile, profile.customScenario || '故事開場', '', 1);
    const { systemPrompt, userPrompt } = buildFirstTurnPrompt(profile);
    
    minimizeGenerationOverlay();
    const tempChapter = { act: 1, turn: 1, chosenLabel: '【正式開局】', prose: '', statusPanel: null, choices: [] };
    renderStoryStream(tempChapter);
    const proseEl = document.getElementById('stream-prose-content');
    if (proseEl) proseEl.innerHTML = '<p class="mb-6 indent-6 sm:indent-8 animate-pulse text-brand-gold/80">命運推演中……</p>';
    
    let isFirstToken = true;
    let didStream = false;
    initialChapter = await generateStoryFromLLM(systemPrompt, userPrompt, (streamedProse) => {
         didStream = true;
         if (proseEl) {
             if (isFirstToken) { proseEl.innerHTML = ''; isFirstToken = false; }
             proseEl.innerHTML = buildProseHtml(streamedProse);
             // 只在使用者已接近底部（150px內）才自動追蹤捲動，不強制鎖定閱讀位置
             const distFromBottom = document.body.scrollHeight - window.scrollY - window.innerHeight;
             if (distFromBottom < 150) {
               window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
             }
         }
    });
    if (didStream) initialChapter.skipTypewriter = true;
    setLoadingPhase('saving', '內容檢查完成，正在建立第一回存檔。');
  } catch (aiErr) {
    state.playerProfile = previousGameSnapshot.playerProfile;
    state.saveState = previousGameSnapshot.saveState;
    state.chapterData = previousGameSnapshot.chapterData;
    state.chapterHistoryList = previousGameSnapshot.chapterHistoryList || [];
    state.lastChoicePayload = previousGameSnapshot.lastChoicePayload;
    state.previousStateSnapshot = previousGameSnapshot.previousStateSnapshot;
    if (state.saveState) safeLocalStorageSet('undercurrent_current_save_state', JSON.stringify(state.saveState));
    else localStorage.removeItem('undercurrent_current_save_state');
    persistChapterHistory(state.chapterHistoryList);
    if (state.playerProfile) safeLocalStorageSet('undercurrent_current_player_profile', JSON.stringify(state.playerProfile));
    else localStorage.removeItem('undercurrent_current_player_profile');
    if (state.chapterData) {
      renderStoryStream(state.chapterData);
      renderSaveState();
      updateGameplayBreadcrumb();
    } else {
      if (dom.novelStreamContainer) dom.novelStreamContainer.innerHTML = '';
      if (dom.choicesContainer) dom.choicesContainer.innerHTML = '';
    }
    if (isGenerationAbortError(aiErr)) notifyUser('已中止本次開局生成。', 'info');
    else showErrorRecovery('開局生成失敗，原進度已保留，請重新開局：' + aiErr.message, { canRetry: false });
    return;
  } finally {
    hideLoading();
    setGenerationBusy(false);
  }

  initialChapter = auditGeneratedChapter(initialChapter, profile);
  initialChapter.act = 1;
  initialChapter.turn = 1;
  initialChapter.chosenLabel = '【正式開局】';
  applyChapterStateChanges(initialChapter, profile, 1);
  safeLocalStorageSet('undercurrent_current_save_state', JSON.stringify(state.saveState));
  safeLocalStorageSet('undercurrent_current_player_profile', JSON.stringify(profile));

  state.chapterData = initialChapter;
  initialChapter.stateSnapshot = JSON.parse(JSON.stringify(state.saveState || {}));
  delete initialChapter.stateSnapshot.memoryBank;
  state.chapterHistoryList = [initialChapter];
  rememberChapter(initialChapter);
  scheduleTurnSummary(initialChapter);
  persistChapterHistory(state.chapterHistoryList);
  
  renderStoryStream(initialChapter);
  renderSaveState();
  updateGameplayBreadcrumb();
  
  saveGameStateToSlot('1');
  syncStateToGoogleDriveCloud(state.saveState, initialChapter);
  startServerCooldown(10);
}

async function makeChoice(choiceId, customInput, isRegenerating = false, mode) {
  if (state.isGenerating) return notifyUser('本回合正在生成，請稍候。');
  // 重試時沿用原本那一回合的模式，否則「開車」重試會掉回一般鏈而被審查擋下。
  state.generationMode = resolveGenerationMode(
    mode || (isRegenerating ? state.lastChoicePayload?.mode : null)
  );
  setGenerationBusy(true);
  state.generationAbortRequested = false;
  const selectedChoice = (state.chapterData?.choices || []).find(choice => choice.id === choiceId);
  const choiceLabel = customInput || selectedChoice?.label || choiceId;

  if (!isRegenerating) {
    state.previousStateSnapshot = {
      saveState: JSON.parse(JSON.stringify(state.saveState || {})),
      chapterData: JSON.parse(JSON.stringify(state.chapterData || {}))
    };
    state.lastChoicePayload = { choiceId, customInput, mode: state.generationMode };
  }

  showLoading(
    isRegenerating ? '章節重新生成中……' : '選項確認中……',
    '正在依照當前局勢動態演算與鋪陳情節……'
  );

  if (dom.errorRecoveryBanner) dom.errorRecoveryBanner.style.display = 'none';

  const transactionSnapshot = {
    saveState: JSON.parse(JSON.stringify(state.saveState || {})),
    chapterData: JSON.parse(JSON.stringify(state.chapterData || {})),
    chapterHistoryLength: (state.chapterHistoryList || []).length
  };

  try {
    state.saveState = state.saveState || {};
    const turnCountBeforeAdvance = state.saveState.turnCount || 1;
    state.saveState.turnCount = turnCountBeforeAdvance + 1;
    
    const profile = getActivePlayerProfile();
    state.saveState.meta = state.saveState.meta || {};
    state.saveState.meta.playerProfile = profile;

    let nextChapter = null;

    try {
      // 先做語意檢索再組提示詞。失敗會回空字串，不會中斷這一回。
      const lastProseForPersona = String((state.chapterHistoryList || []).slice(-1)[0]?.prose || '');
      await preparePersonaForTurn(profile, customInput || choiceLabel, lastProseForPersona, state.saveState.turnCount);
      const retrievedMemoryBlock = await buildRetrievedMemoryBlock(choiceLabel);
      const patrolCorrectionBlock = await buildPatrolCorrectionBlock();
      const { systemPrompt, userPrompt } = buildNextTurnPrompt(
        state.saveState.turnCount,
        choiceId,
        customInput,
        profile,
        state.chapterHistoryList || [],
        state.saveState.summaryPool || '',
        state.saveState,
        retrievedMemoryBlock,
        patrolCorrectionBlock
      );
      
      // 將等待畫面縮成常駐狀態列，玩家仍可閱讀前文或隨時展開查看進度。
      minimizeGenerationOverlay();
      const tempChapter = {
        act: state.saveState.meta.currentAct || 1,
        turn: state.saveState.turnCount,
        chosenLabel: choiceLabel,
        prose: '',
        statusPanel: null,
        choices: []
      };
      // 我們不把它放進 chapterHistoryList，直接呼叫 renderStoryStream 給它 activeChapter
      renderStoryStream(tempChapter);
      const proseEl = document.getElementById('stream-prose-content');
      // D3: 佔位文字與正式段落用同一個排版容器，首個 token 到達時只替換內容，
      // 不再出現「遮罩 → 空卡片 → 文字」三段視覺跳動。
      if (proseEl) proseEl.innerHTML = '<p class="mb-6 indent-6 sm:indent-8 animate-pulse text-brand-gold/80">命運推演中……</p>';
      
      let isFirstToken = true;
      let didStream = false;
      nextChapter = await generateStoryFromLLM(systemPrompt, userPrompt, (streamedProse) => {
         didStream = true;
         if (proseEl) {
             if (isFirstToken) { proseEl.innerHTML = ''; isFirstToken = false; }
             // 轉換段落
             proseEl.innerHTML = buildProseHtml(streamedProse);
             // 只在使用者已接近底部（150px內）才自動追蹤捲動，不強制鎖定閱讀位置
             const distFromBottom = document.body.scrollHeight - window.scrollY - window.innerHeight;
             if (distFromBottom < 150) {
               window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
             }
         }
      });
      if (didStream) nextChapter.skipTypewriter = true;
    } catch (llmErr) {
      if (isGenerationAbortError(llmErr)) throw createGenerationAbortError();
      throw llmErr;
    }

    setLoadingPhase('saving', '內容檢查完成，正在套用數值變化並保存本回進度。');
    nextChapter = auditGeneratedChapter(nextChapter, profile, state.chapterHistoryList);
    nextChapter.act = state.saveState.meta.currentAct || 1;
    nextChapter.turn = state.saveState.turnCount;
    applyChapterStateChanges(nextChapter, profile, state.saveState.turnCount);
    safeLocalStorageSet('undercurrent_current_save_state', JSON.stringify(state.saveState));

    nextChapter.chosenLabel = choiceLabel;
    dismissError();

    state.chapterData = nextChapter;
    rememberChapter(nextChapter);
    appendChapterToHistory(nextChapter, choiceLabel);
    renderStoryStream(nextChapter);
    renderSaveState();
    updateGameplayBreadcrumb();
    // 背景糾察：不阻塞畫面，結果於下一回提示詞中生效
    scheduleContinuityPatrol(nextChapter, choiceLabel);
    scheduleTurnSummary(nextChapter);

    // 每 5 回合自動在背景非同步更新滾動摘要池 (Summary Pool)
    if (state.saveState.turnCount % 5 === 0) {
      triggerRollingSummaryUpdate(state.saveState.turnCount);
    }

    syncStateToGoogleDriveCloud(state.saveState, nextChapter);
    startServerCooldown(10);
  } catch (err) {
    console.error('makeChoice execution error:', err);
    // 本回合未成功推進，把預先遞增的回合數還原，避免回合編號憑空跳號。
    state.saveState = transactionSnapshot.saveState;
    state.chapterData = transactionSnapshot.chapterData;
    state.chapterHistoryList = (state.chapterHistoryList || []).slice(0, transactionSnapshot.chapterHistoryLength);
    safeLocalStorageSet('undercurrent_current_save_state', JSON.stringify(state.saveState));
    persistChapterHistory(state.chapterHistoryList);
    if (isGenerationAbortError(err)) {
      renderStoryStream(state.chapterData);
      renderSaveState();
      notifyUser('已中止本次生成，回合進度未變更。', 'info');
    } else {
      renderStoryStream(state.chapterData);
      renderSaveState();
      const attemptCount = buildAttemptPlan().length;
      showErrorRecovery(
        `本回 ${attemptCount} 次生成皆失敗，進度未變更。可重試此回，或暫停遊戲回報作者：` + err.message
      );
    }
  } finally {
    hideLoading();
    setGenerationBusy(false);
  }
}

function handleCustomActionSubmit(mode) {
  if (mode === 'spicy' && getActivePlayerProfile()?.allowR18 === false) {
    notifyUser('目前人設已關閉 R-18，「露骨」不會寫性愛場景。可在人設庫開啟 R-18。', 'info', 6000);
  }
  const input = dom.customActionInput;
  if (!input) return;
  const val = input.value.trim();
  if (!val) return notifyUser('請先輸入您的自訂行動或對白。', 'error');
  const sourceChoiceId = input.dataset.choiceId || 'CUSTOM';
  input.value = '';
  delete input.dataset.choiceId;
  delete input.dataset.intelId;
  const selectedSummary = document.getElementById('selected-action-summary');
  if (selectedSummary) { selectedSummary.classList.add('hidden'); selectedSummary.textContent = ''; }
  autoGrowActionInput();
  makeChoice(sourceChoiceId, val, false, mode);
}

function appendChapterToHistory(chapter, chosenLabel) {
  if (!state.chapterHistoryList) state.chapterHistoryList = [];
  const record = Object.assign({}, chapter, {
    timestamp: new Date().toISOString(),
    chosenLabel: chosenLabel || '玩家行動',
    // 記憶庫不放進每章快照：它只會增長，12 份快照各存一份會撐爆 localStorage。
    // 回溯時由 rememberChapter／檢索依回合數過濾，不需要快照還原。
    stateSnapshot: (() => {
      const snapshot = JSON.parse(JSON.stringify(state.saveState || {}));
      delete snapshot.memoryBank;
      delete snapshot.patrolNotes;
      return snapshot;
    })()
  });
  state.chapterHistoryList.push(record);
  state.chapterHistoryList = compactChaptersForMemory(state.chapterHistoryList);
  persistChapterHistory(state.chapterHistoryList);
}

// ==========================================
// 6. 小說瀑布流與打字機渲染 (Story Stream & Typewriter)
// ==========================================

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 統一的正文段落切分規則（\n\n 與單一 \n 皆視為換段），
// 供串流即時渲染、打字機與歷史章節共用，避免三處行為不一致。
/**
 * 把正文段落轉為 HTML。對話段（以引號開頭）不縮排，
 * 單獨的分隔符號段落轉為場景分隔線，避免長篇讀起來是一整塊。
 */
function buildProseHtml(text, extraClass = 'mb-6 indent-6 sm:indent-8') {
  return splitProseParagraphs(text).map(raw => {
    const para = raw.trim();
    if (/^[*＊·・—\-–—]{2,}$/.test(para)) return '<hr class="scene-break">';
    const isDialogue = /^[「『“"]/.test(para);
    return `<p class="${extraClass}${isDialogue ? ' is-dialogue' : ''}">${escapeHtml(para)}</p>`;
  }).join('');
}

function buildIntelChangesHtml(chapter) {
  const changes = chapter?.intelChanges || {};
  const added = Array.isArray(changes.added) ? changes.added : [];
  const updated = Array.isArray(changes.updated) ? changes.updated : [];
  if (!added.length && !updated.length) return '';
  const parts = [];
  added.forEach(item => parts.push(`<span class="text-emerald-300">＋ ${escapeHtml(item.name)}</span>`));
  updated.forEach(item => parts.push(
    `<span class="text-amber-200">↻ ${escapeHtml(item.name)}（${escapeHtml(INTEL_STATUS_LABELS[item.status] || item.status)}）</span>`
  ));
  return `<div class="text-slate-300"><strong>線索變動：</strong>${parts.join('<span class="text-slate-600"> ／ </span>')}</div>`;
}

function splitProseParagraphs(text) {
  return String(text || '').split(/\n\n|\n/).map(p => p.trim()).filter(Boolean);
}

function renderStoryStream(activeChapter) {
  if (!dom.novelStreamContainer) return;
  if (state.typewriterTimer) {
    clearTimeout(state.typewriterTimer);
    state.typewriterTimer = null;
  }
  state.isTyping = false;

  const chapters = state.chapterHistoryList || [];
  const count = chapters.length;
  // activeChapter 若尚未寫入 chapterHistoryList（串流中的暫存回合），
  // 過往章節必須完整渲染到最後一筆，否則上一回合會在生成期間憑空消失。
  const activeInHistory = count > 0 && (chapters[count - 1] === activeChapter
    || (activeChapter && chapters[count - 1]?.turn === activeChapter.turn));
  const pastCount = activeInHistory ? count - 1 : count;

  // DOM 永遠只保留最近視窗；切換存檔時也必定清空，避免混入上一條時間線。
  // 每次最多重建 12 張卡片，成本固定，不再隨 50／100 回線性成長。
  const DOM_CHAPTER_WINDOW_SIZE = 12;
  const renderStart = Math.max(0, pastCount - DOM_CHAPTER_WINDOW_SIZE);
  dom.novelStreamContainer.innerHTML = '';

  for (let i = renderStart; i < pastCount; i++) {
    const past = chapters[i];
    if (!past) continue;

    const section = document.createElement('section');
    section.dataset.pastTurnIndex = String(i);
    section.id = `chapter-anchor-${past.turn || (i + 1)}`;
    section.className = 'bg-brand-surface/70 border border-brand-border/60 rounded-2xl p-5 sm:p-7 space-y-4 shadow-lg text-slate-300 opacity-90 transition';

    const paragraphsHtml = buildProseHtml(past.prose, 'mb-4 leading-relaxed indent-6 sm:indent-8 select-text');

    let decisionPill = past.chosenLabel && past.chosenLabel !== '【正式開局】' ? `
      <div class="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-gold/15 text-brand-gold border border-brand-gold/30 text-xs font-bold font-serif">
        <span>${uiIcon('sparkle')} 玩家行動：</span>
        <span class="text-amber-200 font-sans">${escapeHtml(past.chosenLabel)}</span>
      </div>
    ` : '';

    section.innerHTML = `
      <div class="border-b border-brand-border/40 pb-3">
        <div class="flex justify-between items-center mb-1">
          <div class="font-mono text-xs text-brand-gold tracking-widest uppercase bg-brand-gold/10 inline-block px-2 py-0.5 rounded border border-brand-gold/20">
            ${escapeHtml(formatActTurn(past.act, past.turn || (i + 1)))}
          </div>
          ${past.timestamp ? `<span class="font-mono text-[11px] text-slate-500">${new Date(past.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>` : ''}
        </div>
        <h2 class="font-serif text-xl sm:text-2xl font-black text-slate-100">${escapeHtml(displayChapterTitle(past))}</h2>
      </div>
      ${decisionPill}
      <article class="font-serif prose-tc is-past select-text">${paragraphsHtml}</article>
      <div class="flex flex-wrap justify-end gap-2 pt-2 border-t border-brand-border/30">
        <button class="past-pin-btn px-2.5 py-1.5 rounded-full border border-brand-border text-[11px] ${past.memoryPinned ? 'text-brand-gold border-brand-gold/50' : 'text-slate-500'} cursor-pointer" data-turn="${escapeHtml(past.turn || (i + 1))}">${past.memoryPinned ? uiIcon('pin') + ' 已標記重要' : uiIcon('pin') + ' 標記重要'}</button>
        <button class="past-rewind-btn px-2.5 py-1.5 rounded-full border border-rose-300/50 text-[11px] text-rose-600 cursor-pointer" data-turn="${escapeHtml(past.turn || (i + 1))}">↩︎ 從此回分歧</button>
      </div>
    `;

    section.querySelector('.past-pin-btn')?.addEventListener('click', () => toggleMemoryPin(past.turn || (i + 1)));
    section.querySelector('.past-rewind-btn')?.addEventListener('click', () => rewindStoryToTurn(past.turn || (i + 1)));

    dom.novelStreamContainer.appendChild(section);
  }

  const activeSection = document.createElement('section');
  activeSection.id = 'active-chapter-card';
  activeSection.className = 'bg-brand-surface border border-brand-gold/50 rounded-2xl p-5 sm:p-7 space-y-5 shadow-2xl relative transition scroll-mt-20';

  const currentTurnNum = state.saveState?.turnCount || count;
  const currentActNum = state.saveState?.meta?.currentAct || 1;
  const activeRecord = activeChapter || chapters[count - 1];
  const activeActionPill = activeRecord && activeRecord.chosenLabel && activeRecord.chosenLabel !== '【正式開局】' ? `
    <div class="mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-gold/15 text-brand-gold border border-brand-gold/30 text-xs font-bold font-serif">
      <span>${uiIcon('sparkle')} 玩家行動：</span>
      <span class="text-amber-200 font-sans">${escapeHtml(activeRecord.chosenLabel)}</span>
    </div>
  ` : '';

  activeSection.innerHTML = `
    <div class="flex justify-between items-start gap-2 border-b border-brand-border pb-4">
      <div>
        <div class="inline-block font-mono text-xs text-brand-gold tracking-widest uppercase bg-brand-gold/10 border border-brand-gold/20 px-2.5 py-1 rounded mb-2">
          ${escapeHtml(formatActTurn(currentActNum, currentTurnNum))}（最新進度）
        </div>
        <h1 class="font-serif text-2xl sm:text-3xl font-black text-white leading-tight">
          ${escapeHtml(displayChapterTitle(activeChapter))}
        </h1>
      </div>

      <details class="chapter-actions-menu relative shrink-0">
        <summary class="list-none px-3 py-1.5 rounded-lg bg-brand-card hover:bg-brand-border border border-brand-border text-xs font-bold text-slate-700 cursor-pointer">章節操作 ⋯</summary>
        <div class="absolute right-0 top-full z-20 mt-1 min-w-40 rounded-xl border border-brand-border bg-brand-surface p-1.5 shadow-xl flex flex-col gap-1">
          <button id="stream-regenerate-btn" class="game-action-control text-left text-xs hover:bg-brand-card text-slate-700 px-3 py-2 rounded-lg transition cursor-pointer" title="重新生成本回演繹">重新生成本回</button>
          <button id="stream-edit-last-btn" class="game-action-control text-left text-xs hover:bg-brand-card text-slate-700 px-3 py-2 rounded-lg transition cursor-pointer" title="修改上一個玩家行動再重新演繹">改寫上一個行動</button>
          <button id="stream-rewind-btn" class="game-action-control text-left text-xs hover:bg-brand-card text-slate-700 px-3 py-2 rounded-lg transition cursor-pointer" title="回退到上一回合（可重新選擇）">回退上一回</button>
        </div>
      </details>
    </div>

    ${activeActionPill}

    <article id="stream-prose-content" class="font-serif text-slate-800 tracking-wide prose-tc cursor-pointer select-text" title="打字中點擊可直接顯示全文">
      故事載入中……
    </article>

    ${(activeChapter.qualityWarnings || []).length ? `
      <div class="rounded-xl border border-amber-300/60 bg-amber-50 p-3 text-xs text-amber-800">
        <strong>本回品質檢查提醒：</strong>${escapeHtml(activeChapter.qualityWarnings.join('、'))}。內容已保留，可使用「重新生成」或「改寫行動」。
      </div>` : ''}

    
    <div id="stream-status-panel" class="bg-brand-dark/85 border border-brand-border rounded-xl p-3 sm:p-4 text-xs font-sans space-y-2.5 shadow-md">
      <div class="flex items-center justify-between gap-2">
        <strong class="text-brand-gold">本回狀態摘要</strong>
        <button id="toggle-status-details-btn" class="text-[11px] text-slate-500 hover:text-brand-gold cursor-pointer" aria-expanded="true">收合詳細 ▴</button>
      </div>
      <!-- 數值即時標籤列 -->
      <div class="flex flex-wrap items-center gap-2">
        <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950/70 border border-rose-700/50 text-rose-200">
          <span>張力值：</span>
          <span class="font-mono font-bold text-rose-300">${escapeHtml(activeChapter.statusPanel?.tension !== undefined ? activeChapter.statusPanel.tension : 65)}%</span>
          <span class="text-[10px] text-rose-400/80">(${escapeHtml(activeChapter.statusPanel?.tensionLabel || '高壓推拉')})</span>
        </div>
        <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/70 border border-amber-700/50 text-amber-200">
          <span>微醺度：</span>
          <span class="font-mono font-bold text-amber-300">${escapeHtml(activeChapter.statusPanel?.intoxication !== undefined ? activeChapter.statusPanel.intoxication : 0)}%</span>
          <span class="text-[10px] text-amber-400/80">(${escapeHtml(activeChapter.statusPanel?.intoxicationLabel || '清醒')})</span>
        </div>
        ${FEATURES.favorability && activeChapter.statusPanel?.favorabilityDelta ? `
        <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-700/50 text-emerald-200">
          <span>好感變動：</span>
          <span class="font-mono font-bold text-emerald-300">${activeChapter.statusPanel.favorabilityDelta > 0 ? '+' : ''}${escapeHtml(activeChapter.statusPanel.favorabilityDelta)} pts</span>
          ${activeChapter.statusPanel.favorabilityReason ? `<span class="text-[10px] text-emerald-400/80 hidden sm:inline">(${escapeHtml(activeChapter.statusPanel.favorabilityReason)})</span>` : ''}
        </div>` : ''}
      </div>

      <div id="status-detail-body" class="space-y-2">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 pt-1 border-t border-brand-border/40">
          <div><strong>時空地點：</strong><span class="text-brand-gold">${escapeHtml(activeChapter.statusPanel?.timeLocation || '台北市')}</span></div>
          <div><strong>著裝神態：</strong><span class="text-slate-200">${escapeHtml(activeChapter.statusPanel?.outfit || '-')}</span></div>
        </div>
        <div class="text-slate-300"><strong>互動姿態：</strong><span class="text-slate-300">${escapeHtml(activeChapter.statusPanel?.interaction || '-')}</span></div>
        ${buildIntelChangesHtml(activeChapter)}
        ${activeChapter.statusPanel?.rumors ? `<div class="text-slate-400"><strong>政媒傳聞：</strong><span class="italic text-slate-400">${escapeHtml(activeChapter.statusPanel.rumors)}</span></div>` : ''}
      </div>
    </div>
    <div class="flex flex-wrap justify-end gap-2">
      <button id="stream-pin-memory-btn" class="px-3 py-1.5 rounded-full border ${activeRecord?.memoryPinned ? 'border-brand-gold/60 text-brand-gold' : 'border-brand-border text-slate-500'} text-[11px] cursor-pointer">${activeRecord?.memoryPinned ? uiIcon('pin') + ' 已標記重要' : uiIcon('pin') + ' 標記重要'}</button>
      <button id="stream-fork-btn" class="px-3 py-1.5 rounded-full border border-purple-300/50 text-purple-600 text-[11px] cursor-pointer">⑂ 建立分歧存檔</button>
    </div>
  `;

  dom.novelStreamContainer.appendChild(activeSection);

  document.getElementById('stream-regenerate-btn')?.addEventListener('click', handleRegenerateTurn);
  document.getElementById('stream-edit-last-btn')?.addEventListener('click', handleEditLastAction);
  document.getElementById('stream-rewind-btn')?.addEventListener('click', handleUndoTurn);
  document.getElementById('stream-pin-memory-btn')?.addEventListener('click', () => toggleMemoryPin(activeRecord?.turn || currentTurnNum));
  document.getElementById('stream-fork-btn')?.addEventListener('click', createCurrentStoryFork);
  document.getElementById('toggle-status-details-btn')?.addEventListener('click', (event) => {
    const body = document.getElementById('status-detail-body');
    if (!body) return;
    const collapsed = !body.classList.contains('hidden');
    body.classList.toggle('hidden', collapsed);
    event.currentTarget.setAttribute('aria-expanded', String(!collapsed));
    event.currentTarget.textContent = collapsed ? '展開詳細 ▾' : '收合詳細 ▴';
  });

  const proseEl = document.getElementById('stream-prose-content');
  const cleanProse = activeChapter.prose || '';

  if (activeChapter.skipTypewriter) {
    proseEl.innerHTML = buildProseHtml(cleanProse);
    renderChoices(activeChapter.choices || []);
  } else {
    // C1: 先把選項畫出來（停用態），玩家才知道正文播完後有幾個選擇、內容是什麼；
    // 先前要等打字機跑完才 renderChoices，「沉浸」模式下要盯著空白區域等一分半。
    renderChoices(activeChapter.choices || []);
    streamTypewriterEffect(cleanProse, proseEl, null, () => {
      renderChoices(activeChapter.choices || []);
    });
  }

//  setTimeout(() => {
//    if (activeSection && typeof activeSection.scrollIntoView === 'function') {
//      activeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
//    }
//  }, 100);
}

function streamTypewriterEffect(fullText, targetEl, skipBtn, onComplete) {
  if (!targetEl) return;
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const finish = () => {
    targetEl.innerHTML = buildProseHtml(fullText);
    state.isTyping = false;
    hideSkipTypewriterControl();
    setChoicesInteractive(!state.isGenerating);
    if (onComplete) onComplete();
  };

  if (state.typeSpeed === 'instant' || reduceMotion) {
    finish();
    return;
  }

  state.isTyping = true;
  state.skipTypewriterTriggered = false;
  setChoicesInteractive(false);

  targetEl.innerHTML = '';
  // 與 buildProseHtml/歷史章節同一套切分規則（\n\n 與單一 \n 皆換段）
  const paragraphs = splitProseParagraphs(fullText);
  let pIdx = 0;
  let charIdx = 0;

  const makeParagraph = (text) => {
    const el = document.createElement('p');
    el.className = 'mb-6 indent-6 sm:indent-8';
    if (/^[「『“"]/.test(text)) el.classList.add('is-dialogue');
    return el;
  };
  let currentP = makeParagraph(paragraphs[0] || '');
  targetEl.appendChild(currentP);

  const baseSpeedMs = state.typeSpeed === 'fast' ? 9 : 30;
  // C2: 跳過控制改為畫面底部的浮動膠囊。先前放在章節卡片頂端，
  // 但玩家打字時眼睛盯著底部正在長出來的那一行，要跳過還得先往上滑。
  showSkipTypewriterControl();

  function typeNext() {
    if (state.skipTypewriterTriggered || !state.isTyping) {
      finish();
      return;
    }

    if (pIdx >= paragraphs.length) {
      finish();
      return;
    }

    const curText = paragraphs[pIdx];
    if (charIdx < curText.length) {
      const char = curText.charAt(charIdx);
      currentP.textContent += char;
      charIdx++;

      // 智能標點符號停頓
      let nextSpeed;
      if (char === '，' || char === '、') {
        nextSpeed = 150;
      } else if (char === '。' || char === '！' || char === '？' || char === '…') {
        nextSpeed = 300;
      } else {
        nextSpeed = baseSpeedMs + (Math.random() * 20 - 10);
      }

      state.typewriterTimer = setTimeout(typeNext, nextSpeed);
    } else {
      pIdx++;
      charIdx = 0;
      if (pIdx < paragraphs.length) {
        currentP = makeParagraph(paragraphs[pIdx]);
        targetEl.appendChild(currentP);
        state.typewriterTimer = setTimeout(typeNext, 500); // 換段停頓更長
      } else {
        finish();
      }
    }
  }

  typeNext();

  targetEl.onclick = () => { state.skipTypewriterTriggered = true; };
}

function showSkipTypewriterControl() {
  const fab = document.getElementById('skip-typewriter-fab');
  if (fab) { fab.classList.remove('hidden'); fab.classList.add('flex'); }
}

function hideSkipTypewriterControl() {
  const fab = document.getElementById('skip-typewriter-fab');
  if (fab) { fab.classList.add('hidden'); fab.classList.remove('flex'); }
}

function renderChoices(choices) {
  if (!dom.choicesContainer) return;
  dom.choicesContainer.innerHTML = '';

  if (!choices || choices.length === 0) {
    dom.choicesContainer.innerHTML = '<div class="text-xs text-slate-500 py-2">（請於下方輸入自訂自由行動以推進情節）</div>';
    return;
  }

  choices.forEach((c, idx) => {
    const letter = String.fromCharCode(65 + idx);
    const btn = document.createElement('button');
    const borderCls = c.risk === 'high' ? 'border-rose-500/50 hover:border-rose-400 bg-rose-950/20' :
                      c.risk === 'medium' ? 'border-amber-500/50 hover:border-amber-400 bg-amber-950/20' :
                      'border-brand-border hover:border-brand-gold bg-brand-surface';

    btn.className = `w-full text-left p-4 rounded-xl border ${borderCls} transition duration-150 flex flex-col gap-1.5 shadow-md group cursor-pointer`;
    btn.classList.add('game-action-control', 'choice-option-btn');
    btn.dataset.choiceIndex = String(idx);
    btn.setAttribute('aria-keyshortcuts', letter);

    // G2: 不再用「高風險情慾/殺機」「穩健推進」直接把三個選項的結果講死，
    // 改為不透露方向的強度標記，保留抉擇張力。
    const intensity = c.risk === 'high' ? '◆◆◆' : c.risk === 'medium' ? '◆◆' : '◆';
    const intensityCls = c.risk === 'high' ? 'text-rose-400' : c.risk === 'medium' ? 'text-amber-400' : 'text-emerald-400';
    const intensityTitle = c.risk === 'high' ? '張力極高' : c.risk === 'medium' ? '張力中等' : '張力平穩';

    // G1: label 本身已含提示詞規定的「[A] 」前綴，左上角再標一次會變成
    // 「CHOICE A」＋「[A] …」重複顯示，這裡把前綴剝掉。
    const cleanLabel = String(c.label || '').replace(/^\s*[\[［]\s*[A-Za-z]\s*[\]］]\s*/, '').trim() || c.label || '';

    btn.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="font-mono text-xs text-brand-gold font-bold">
          <kbd class="not-italic font-mono bg-brand-gold/15 border border-brand-gold/30 rounded px-1.5 py-0.5">${letter}</kbd>
        </span>
        <span class="font-mono text-xs ${intensityCls} tracking-widest" title="${intensityTitle}" aria-label="${intensityTitle}">${intensity}</span>
      </div>
      <div class="font-serif font-bold text-sm text-slate-100 group-hover:text-brand-gold transition leading-snug">
        ${escapeHtml(cleanLabel)}
      </div>
      ${c.hint ? `<div class="text-xs text-slate-400 font-sans mt-0.5">${escapeHtml(c.hint)}</div>` : ''}
    `;

    btn.addEventListener('click', () => {
      if (!dom.customActionInput) return;
      document.querySelectorAll('.choice-option-btn').forEach(other => {
        other.classList.remove('ring-2', 'ring-brand-gold/60', 'bg-brand-gold/10');
        other.removeAttribute('aria-pressed');
      });
      btn.classList.add('ring-2', 'ring-brand-gold/60', 'bg-brand-gold/10');
      btn.setAttribute('aria-pressed', 'true');
      dom.customActionInput.value = cleanLabel;
      dom.customActionInput.dataset.choiceId = c.id || `opt_${idx}`;
      delete dom.customActionInput.dataset.intelId;
      autoGrowActionInput();
      dom.customActionInput.focus();
      dom.customActionInput.setSelectionRange(cleanLabel.length, cleanLabel.length);
      const selectedSummary = document.getElementById('selected-action-summary');
      if (selectedSummary) {
        selectedSummary.textContent = `已選擇：${cleanLabel}。可以直接執行，或在下方修改內容。`;
        selectedSummary.classList.remove('hidden');
      }
      notifyUser('已帶入建議行動；可直接執行，或先改寫成更符合你的做法。', 'info', 2600);
    });

    dom.choicesContainer.appendChild(btn);
  });

  // C1: 打字機播放中先把選項渲染出來但停用，讓玩家看得到終點在哪
  setChoicesInteractive(!state.isTyping && !state.isGenerating);
}

/** 打字機播放或生成中時，選項顯示但不可點 */
function setChoicesInteractive(enabled) {
  document.querySelectorAll('.choice-option-btn').forEach(btn => {
    btn.disabled = !enabled;
    btn.setAttribute('aria-disabled', String(!enabled));
    btn.classList.toggle('opacity-45', !enabled);
    btn.title = enabled ? '' : '正文播放中，可點擊正文或下方「顯示全文」立即跳過';
  });
}

// ==========================================
// 6.5 閱讀導覽、狀態顯示與提示 (Reader Nav & Status Indicators)
// ==========================================

/**
 * C4: 章節目錄。長局進行到數十回時原本是一條數萬字的無盡瀑布流，
 * 沒有目錄、沒有回合跳轉、也沒有回到最新章節的入口。
 */
function renderChapterNavList() {
  const listEl = document.getElementById('chapter-nav-list');
  if (!listEl) return;
  const chapters = state.chapterHistoryList || [];
  listEl.innerHTML = '';

  if (chapters.length === 0) {
    listEl.innerHTML = '<div class="text-slate-500 py-4 text-center">尚無章節紀錄。</div>';
    return;
  }

  const currentTurn = state.saveState?.turnCount;
  const summaryByTurn = new Map(getMemoryBank().filter(m => m.kind === 'summary').map(m => [m.turn, m.text]));
  // 超過 60 回的章節會移出記憶，但逐回摘要仍在記憶庫裡 —— 讓玩家照樣查得到
  const listedTurns = new Set(chapters.map((ch, idx) => Number(ch.turn || idx + 1)));
  const archived = Array.from(summaryByTurn.entries()).filter(([t]) => !listedTurns.has(t)).sort((a, b) => a[0] - b[0]);
  if (archived.length) {
    const box = document.createElement('div');
    box.className = 'px-3 py-2 rounded-lg border border-brand-border/40 bg-brand-dark/40 text-slate-400 space-y-1';
    box.innerHTML = `<div class="text-[10px] font-mono opacity-70">較早回合（正文已封存，僅保留摘要）</div>`
      + archived.map(([t, text]) => `<div class="text-[11px] leading-relaxed"><span class="font-mono opacity-60">第 ${t} 回</span>　${escapeHtml(text)}</div>`).join('');
    listEl.appendChild(box);
  }
  chapters.forEach((ch, idx) => {
    const turn = ch.turn || (idx + 1);
    const isCurrent = turn === currentTurn;
    const row = document.createElement('button');
    row.type = 'button';
    row.className = `w-full text-left px-3 py-2 rounded-lg border transition cursor-pointer ${
      isCurrent
        ? 'bg-brand-gold/15 border-brand-gold/50 text-brand-gold'
        : 'bg-brand-card/60 border-brand-border/60 text-slate-300 hover:border-brand-gold/40 hover:text-white'
    }`;
    const summary = ch.turnSummary || summaryByTurn.get(Number(turn)) || '';
    row.innerHTML = `
      <div class="flex items-start gap-2">
        <span class="font-mono text-[10px] shrink-0 opacity-70 mt-0.5">${formatActTurn(ch.act, turn)}</span>
        <span class="font-serif font-bold break-words min-w-0">${escapeHtml(displayChapterTitle(ch))}</span>
        ${isCurrent ? '<span class="ml-auto text-[10px] font-mono shrink-0">目前</span>' : ''}
      </div>
      ${summary ? `<div class="mt-1 text-[11px] leading-relaxed text-slate-400">${escapeHtml(summary)}</div>` : ''}
    `;
    row.addEventListener('click', () => {
      closeChapterNav();
      jumpToChapter(turn);
    });
    listEl.appendChild(row);
  });
}

function jumpToChapter(turn) {
  const target = document.getElementById(`chapter-anchor-${turn}`)
    || (turn === state.saveState?.turnCount ? document.getElementById('active-chapter-card') : null);
  if (!target) {
    notifyUser('該章節尚未載入到畫面上。', 'info');
    return;
  }
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  target.classList.add('ring-2', 'ring-brand-gold/60');
  setTimeout(() => target.classList.remove('ring-2', 'ring-brand-gold/60'), 1600);
}

function openChapterNav() {
  renderChapterNavList();
  openOverlay('chapter-nav-panel');
  document.getElementById('chapter-nav-btn')?.setAttribute('aria-expanded', 'true');
}

function closeChapterNav() {
  closeOverlay('chapter-nav-panel');
  document.getElementById('chapter-nav-btn')?.setAttribute('aria-expanded', 'false');
}

/** C4: 捲離最新章節一段距離後浮出「回到最新章節」 */
function updateBackToLatestFab() {
  const fab = document.getElementById('back-to-latest-fab');
  const activeCard = document.getElementById('active-chapter-card');
  if (!fab || !activeCard) return;
  // 打字機的跳過鍵優先佔用底部位置，避免兩顆疊在一起
  if (state.isTyping || state.isGenerating) {
    fab.classList.add('hidden');
    fab.classList.remove('flex');
    return;
  }
  const rect = activeCard.getBoundingClientRect();
  const isFarAbove = rect.top > window.innerHeight;   // 最新章節還在畫面下方很遠
  const isFarBelow = rect.bottom < 0;                // 已經捲過最新章節
  const shouldShow = isFarAbove || isFarBelow;
  fab.classList.toggle('hidden', !shouldShow);
  fab.classList.toggle('flex', shouldShow);
}

/**
 * B1: 雲端同步狀態徽章。先前是硬編死字「雲端已自動同步」，
 * 本機模式、同步失敗、離線一律顯示綠燈，玩家會在以為有備份的狀態下遺失進度。
 */
function updateCloudSyncBadge(status, detail = '') {
  const badge = document.getElementById('cloud-sync-status-badge');
  const dot = document.getElementById('cloud-sync-dot');
  const text = document.getElementById('cloud-sync-text');
  if (!badge || !dot || !text) return;

  const presets = {
    syncing: ['bg-sky-950/60 border-sky-700/50 text-sky-300', 'bg-sky-400 animate-pulse', '同步中……'],
    synced:  ['bg-emerald-950/60 border-emerald-700/50 text-emerald-300', 'bg-emerald-400', '已同步 ' + detail],
    failed:  ['bg-rose-950/60 border-rose-700/50 text-rose-300', 'bg-rose-400', '同步失敗（點擊重試）'],
    local:   ['bg-slate-800/70 border-slate-600/50 text-slate-400', 'bg-slate-500', '本機模式'],
    idle:    ['bg-slate-800/70 border-slate-600/50 text-slate-300', 'bg-slate-500', '尚未同步']
  };
  const [badgeCls, dotCls, label] = presets[status] || presets.idle;
  badge.className = 'hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono transition cursor-pointer ' + badgeCls;
  dot.className = 'w-2 h-2 rounded-full ' + dotCls;
  text.textContent = label;
  badge.title = status === 'local'
    ? '本機模式：進度只存在這台裝置，登入雲端帳號後才會備份'
    : '雲端同步狀態（點擊立即同步）';
  updateSaveTrustStatus(status, detail);
}

function updateSaveTrustStatus(status, detail = '') {
  const el = document.getElementById('save-trust-status');
  if (!el) return;
  const labels = {
    syncing: '正在備份進度…',
    synced: `雲端已保存${detail ? ` · ${detail}` : ''}`,
    failed: '本機已保存 · 雲端待重試',
    local: '進度只保存在這台裝置',
    idle: '進度已保存在本機'
  };
  el.textContent = labels[status] || labels.idle;
  el.className = status === 'failed'
    ? 'text-[11px] font-bold text-rose-700'
    : 'text-[11px] text-slate-600';
}

/** B2: 首頁「繼續當前冒險」卡片顯示真實進度，無進度時停用 */
function updateHomeContinueCard() {
  const desc = document.getElementById('home-continue-desc');
  const meta = document.getElementById('home-continue-meta');
  const card = document.getElementById('home-continue-game-btn');
  const newGameCard = document.getElementById('home-new-game-btn');
  const cta = document.getElementById('home-continue-cta');
  if (!desc || !card) return;

  const hasProgress = !!(state.chapterData && state.chapterHistoryList?.length);
  const hasSaves = getNamedSavesList().length > 0;

  if (hasProgress) {
    const profile = getActivePlayerProfile();
    const act = state.saveState?.meta?.currentAct || 1;
    const turn = state.saveState?.turnCount || 1;
    const title = displayChapterTitle(state.chapterData, formatActTurn(act, turn));
    desc.textContent = title;
    if (meta) {
      meta.style.display = 'flex';
      meta.innerHTML = `
        <span class="px-2 py-0.5 rounded bg-sky-950/60 border border-sky-700/50 text-sky-300 font-mono">${formatActTurn(act, turn)}</span>
        <span class="px-2 py-0.5 rounded bg-brand-gold/15 border border-brand-gold/30 text-brand-gold">${uiIcon('target')} ${escapeHtml(profile.targetLeadName || '修羅場')}</span>
        <span class="text-slate-500">${escapeHtml(profile.name || '主角')}</span>
      `;
    }
    card.classList.remove('opacity-50', 'pointer-events-none');
    card.removeAttribute('aria-disabled');
    card.classList.add('home-action-primary');
    newGameCard?.classList.remove('home-action-primary');
    if (cta) cta.textContent = `繼續第 ${turn} 回 →`;
  } else {
    desc.textContent = hasSaves
      ? '目前無進行中的章節，可從存檔庫挑選存檔載入。'
      : '尚無進行中的冒險。請先點擊左側【開啟全新局】創角啟程。';
    if (meta) { meta.style.display = 'none'; meta.innerHTML = ''; }
    const shouldDisable = !hasSaves;
    card.classList.toggle('opacity-50', shouldDisable);
    card.classList.toggle('pointer-events-none', shouldDisable);
    if (shouldDisable) card.setAttribute('aria-disabled', 'true');
    else card.removeAttribute('aria-disabled');
    card.classList.remove('home-action-primary');
    newGameCard?.classList.add('home-action-primary');
    if (cta) cta.textContent = hasSaves ? '選擇存檔 →' : '尚無進度';
  }
}

/** G5: 回合數累積過多時主動建議執行卷末換窗 */
const REBASE_SUGGEST_THRESHOLD = 30;
let rebaseSuggestionDismissedAtTurn = 0;

function updateRebaseSuggestion() {
  const banner = document.getElementById('rebase-suggestion-banner');
  const textEl = document.getElementById('rebase-suggestion-text');
  if (!banner) return;

  const turn = state.saveState?.turnCount || 1;
  const act = state.saveState?.meta?.currentAct || 1;
  const turnsInAct = (state.chapterHistoryList || []).length;
  const shouldSuggest = turnsInAct >= REBASE_SUGGEST_THRESHOLD
    && turn > rebaseSuggestionDismissedAtTurn + 10;

  if (!shouldSuggest) {
    banner.style.display = 'none';
    return;
  }
  if (textEl) {
    textEl.textContent = `第 ${act} 幕已累積 ${turnsInAct} 回，上下文已相當長。`
      + '建議整理故事記憶，把本幕濃縮成重要情節以維持連貫度（數值與道具全部保留）。';
  }
  banner.style.display = 'flex';
}

function dismissRebaseSuggestion() {
  rebaseSuggestionDismissedAtTurn = state.saveState?.turnCount || 1;
  const banner = document.getElementById('rebase-suggestion-banner');
  if (banner) banner.style.display = 'none';
}

/** G8: 抉擇區代稱依玩家性別填入，不再固定寫「妳」 */
function updateGenderedCopy() {
  const el = document.getElementById('decisions-heading-pronoun');
  if (!el) return;
  const gender = (getActivePlayerProfile()?.gender || '').trim();
  el.textContent = gender === '女' ? '妳' : gender === '男' ? '你' : '你';
}

// ==========================================
// 7. 人設庫核心管理 (Profile Presets CRUD)
// ==========================================

function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function isValidProfilePreset(value) {
  if (!isPlainObject(value) || typeof value.name !== 'string') return false;
  const stringFields = ['gender', 'age', 'profession', 'background', 'appearance', 'taboos', 'targetLead', 'targetLeadName', 'customScenario'];
  return stringFields.every(key => value[key] === undefined || typeof value[key] === 'string')
    && (value.supportingLeads === undefined || (Array.isArray(value.supportingLeads) && value.supportingLeads.every(item => typeof item === 'string')));
}

function normalizeProfilePresets(value) {
  if (!isPlainObject(value)) return {};
  const normalized = {};
  Object.keys(value).slice(0, 200).forEach(key => {
    if (key !== '__proto__' && key !== 'constructor' && key !== 'prototype' && isValidProfilePreset(value[key])) {
      normalized[key] = value[key];
    }
  });
  return normalized;
}

function getCustomPresets() {
  try {
    return normalizeProfilePresets(JSON.parse(localStorage.getItem('undercurrent_custom_profiles') || '{}'));
  } catch (e) {
    return {};
  }
}

function persistCustomPresets(presets) {
  safeLocalStorageSet('undercurrent_custom_profiles', JSON.stringify(presets));
  loadSavedProfilePresetsIntoSelect();
  renderProfileManagerList();
}

function openProfileManagerModal() {
  if (!openOverlay('profile-manager-modal', { focusSelector: '#search-profile-input' })) return;
  renderProfileManagerList();
}

function closeProfileManagerModal() {
  closeOverlay('profile-manager-modal');
}

function renderProfileManagerList() {
  const container = dom.profileManagerList;
  if (!container) return;

  const custom = getCustomPresets();
  const search = (dom.searchProfileInput?.value || '').toLowerCase().trim();

  container.innerHTML = '';

  const allProfiles = [];
  
  Object.keys(DEFAULT_PRESETS).forEach(key => {
    allProfiles.push({ key: key, data: DEFAULT_PRESETS[key], isDefault: true });
  });

  Object.keys(custom).forEach(key => {
    allProfiles.push({ key: key, data: custom[key], isDefault: false });
  });

  const filtered = allProfiles.filter(p => {
    if (!search) return true;
    const d = p.data;
    return (d.name || '').toLowerCase().includes(search) ||
           (d.profession || '').toLowerCase().includes(search) ||
           (d.targetLeadName || '').toLowerCase().includes(search) ||
           (d.customScenario || '').toLowerCase().includes(search);
  });

  if (filtered.length === 0) {
    container.innerHTML = '<div class="text-center text-slate-500 py-8">找不到相符的人設檔案</div>';
    return;
  }

  filtered.forEach(p => {
    const d = p.data;
    const card = document.createElement('div');
    card.className = 'bg-brand-card p-4 rounded-xl border border-brand-border hover:border-purple-500/60 transition space-y-2.5 shadow-md';

    card.innerHTML = `
      <div class="flex items-center justify-between border-b border-brand-border/60 pb-2">
        <div class="flex items-center gap-2">
          <span class="font-serif font-bold text-sm text-white">${escapeHtml(d.name)}</span>
          <span class="text-[11px] px-2 py-0.5 rounded ${p.isDefault ? 'bg-brand-gold/15 text-brand-gold border border-brand-gold/30' : 'bg-purple-950/60 text-purple-300 border border-purple-800/40'}">
            ${p.isDefault ? '官方預設' : '自訂人設'}
          </span>
          <span class="text-xs text-slate-400">${escapeHtml(d.gender || '女')} ｜ ${escapeHtml(d.age || '24')}歲</span>
        </div>
        <div class="flex items-center gap-1">
          <button class="use-profile-btn px-2.5 py-1 rounded bg-brand-gold/15 hover:bg-brand-gold/30 text-brand-gold text-xs font-bold border border-brand-gold/30 transition cursor-pointer" data-key="${escapeHtml(p.key)}">
            ▶ 套用開局
          </button>
          <button class="edit-profile-btn px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs border border-brand-border transition cursor-pointer" data-key="${escapeHtml(p.key)}">
            ${uiIcon('pencil')} 編輯
          </button>
          ${!p.isDefault ? `
            <button class="rename-profile-btn px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white text-xs border border-brand-border transition cursor-pointer" data-key="${escapeHtml(p.key)}">
              ${uiIcon('tag')} 重新命名
            </button>
            <button class="delete-profile-btn px-2 py-1 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white text-xs border border-rose-800/40 transition cursor-pointer" data-key="${escapeHtml(p.key)}">
              ${uiIcon('trash')} 刪除
            </button>
          ` : ''}
        </div>
      </div>
      <div class="text-xs text-slate-300"><strong>社會身分：</strong>${escapeHtml(d.profession || '-')}</div>
      <div class="text-xs text-slate-400 line-clamp-2"><strong>身世背景：</strong>${escapeHtml(d.background || '-')}</div>
      <div class="text-xs text-amber-200/90"><strong>攻略對象：</strong>${escapeHtml(d.targetLeadName || '修羅場')} ｜ <strong>R-18：</strong>${d.allowR18 ? '開啟' : '關閉'}</div>
      ${d.customScenario ? `<div class="text-[11px] text-slate-400 bg-brand-dark/60 p-2 rounded border border-brand-border/40"><strong>開場情境：</strong>${escapeHtml(d.customScenario)}</div>` : ''}
    `;

    card.querySelector('.use-profile-btn')?.addEventListener('click', () => {
      closeProfileManagerModal();
      loadProfilePresetIntoForm(p.key);
      handleCharacterCreationSubmit();
    });

    card.querySelector('.edit-profile-btn')?.addEventListener('click', () => {
      closeProfileManagerModal();
      openCharacterCreationModal();
      loadProfilePresetIntoForm(p.key);
    });

    card.querySelector('.rename-profile-btn')?.addEventListener('click', () => {
      renameProfilePreset(p.key);
    });

    card.querySelector('.delete-profile-btn')?.addEventListener('click', () => {
      deleteProfilePreset(p.key);
    });

    container.appendChild(card);
  });
}

function loadSavedProfilePresetsIntoSelect() {
  const select = dom.profilePresetsSelect;
  if (!select) return;

  const custom = getCustomPresets();
  const options = select.options ? Array.from(select.options) : [];
  options.forEach(opt => {
    if (opt.value && opt.value.startsWith('custom_')) opt.remove();
  });

  Object.keys(custom).forEach(key => {
    const prof = custom[key];
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = `【自訂】${prof.name}（${(prof.profession || '').slice(0, 10)}...）`;
    select.appendChild(opt);
  });
}

function loadProfilePresetIntoForm(presetKey) {
  let profile = DEFAULT_PRESETS[presetKey];
  if (!profile) {
    const custom = getCustomPresets();
    profile = custom[presetKey];
  }
  if (!profile) return;

  setFormValue('form-player-name', profile.name);
  setFormValue('form-player-gender', profile.gender || '女');
  setFormValue('form-player-age', profile.age || '24');
  setFormValue('form-player-profession', profile.profession);
  setFormValue('form-player-background', profile.background);
  setFormValue('form-player-appearance', profile.appearance || '隨機');
  setFormValue('form-player-taboos', profile.taboos || '無');
  setFormValue('form-target-lead', profile.targetLead || '01_徐令謙');
  setFormValue('form-allow-r18', profile.allowR18 !== false);
  setFormValue('form-allow-dominant', profile.allowDominantPlot === true);
  setFormValue('form-custom-scenario', profile.customScenario || '');
}

function saveCurrentFormAsPreset() {
  const name = document.getElementById('form-player-name').value.trim();
  if (!name) return notifyUser('請先輸入角色姓名。', 'error');

  const targetSelect = dom.formTargetLead || document.getElementById('form-target-lead');
  const selectedOption = (targetSelect && targetSelect.options && targetSelect.selectedIndex >= 0) ? targetSelect.options[targetSelect.selectedIndex] : null;

  const profile = {
    name: name,
    gender: document.getElementById('form-player-gender').value,
    age: document.getElementById('form-player-age').value.trim() || '24',
    profession: document.getElementById('form-player-profession').value.trim(),
    background: document.getElementById('form-player-background').value.trim(),
    appearance: document.getElementById('form-player-appearance').value.trim() || '隨機',
    taboos: document.getElementById('form-player-taboos').value.trim() || '無',
    targetLead: targetSelect.value,
    targetLeadName: selectedOption?.getAttribute('data-name') || '徐令謙',
    allowR18: document.getElementById('form-allow-r18').checked,
    allowDominantPlot: document.getElementById('form-allow-dominant')?.checked === true,
    customScenario: document.getElementById('form-custom-scenario').value.trim()
  };

  const custom = getCustomPresets();
  const key = 'custom_' + Date.now();
  custom[key] = profile;
  persistCustomPresets(custom);
  
  notifyUser(`人設「${name}」已另存為自訂範本。`, 'success');
}

async function renameProfilePreset(key) {
  const custom = getCustomPresets();
  const prof = custom[key];
  if (!prof) return;

  const newName = await promptDialog('請輸入新的人設姓名：', prof.name, { title: '重新命名人設' });
  if (newName && newName.trim()) {
    prof.name = newName.trim();
    custom[key] = prof;
    persistCustomPresets(custom);
    notifyUser('已重新命名人設。', 'success');
  }
}

async function deleteProfilePreset(key) {
  const custom = getCustomPresets();
  const prof = custom[key];
  if (!prof) return;

  if (await confirmDangerDialog(`確定要刪除自訂人設「${prof.name}」嗎？此操作無法復原。`, { title: '刪除人設', confirmText: '刪除' })) {
    delete custom[key];
    persistCustomPresets(custom);
    notifyUser('已刪除該自訂人設。', 'success');
  }
}

function exportProfiles() {
  const custom = getCustomPresets();
  const blob = new Blob([JSON.stringify(custom, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `UnderCurrent_Profiles_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importProfiles(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const imported = JSON.parse(evt.target.result);
      if (!isPlainObject(imported)) throw new Error('檔案格式不正確，應為人設物件');
      const normalized = normalizeProfilePresets(imported);
      if (Object.keys(normalized).length !== Object.keys(imported).length) throw new Error('檔案包含無效或不安全的人設資料');
      const custom = getCustomPresets();
      Object.assign(custom, normalized);
      persistCustomPresets(custom);
      notifyUser('已成功匯入自訂人設範本。', 'success');
    } catch (err) {
      notifyUser('人設檔案解析失敗：' + err.message, 'error', 5000);
    }
  };
  reader.readAsText(file);
}

// ==========================================
// 8.0 長局容量管理 (Long-run Capacity Guards)
// ==========================================

/**
 * 每個具名存檔、每次雲端同步要攜帶的章節視窗大小。
 *
 * 為什麼需要這個：mistral-large-3 每回輸出約 1,400 個中文字，
 * chapterHistoryList 的 JSON 在 30 回時已達 209 KB、50 回 348 KB。
 * 而先前「每個具名存檔各自複製一份完整歷史」＋「每回合整份 POST 到雲端」，
 * 會讓 localStorage（約 5 MB）在十來個存檔後就爆掉，長局根本跑不到結束。
 * 完整正文由後端的 Full_Novel.md 單向累積歸檔，這裡只需要足以還原畫面的視窗。
 */
const CHAPTER_WINDOW_SIZE = 12;

/** 極舊章節保留的正文摘錄長度（供目錄與卡片顯示） */
const ARCHIVED_PROSE_EXCERPT = 240;

/** 本機保留完整正文的回合數；更舊的只留摘錄（完整版在雲端 Full_Novel.md） */
const LOCAL_FULL_PROSE_TURNS = 30;
const MAX_IN_MEMORY_CHAPTERS = 60;
const FULL_STATE_SNAPSHOT_TURNS = 12;

/** 取出最近的章節視窗 */
function chapterWindow(list, size = CHAPTER_WINDOW_SIZE) {
  const arr = Array.isArray(list) ? list : [];
  return arr.length > size ? arr.slice(-size) : arr.slice();
}

/**
 * 為了寫入 localStorage 而壓縮章節列表：
 * 最近 LOCAL_FULL_PROSE_TURNS 回保留完整正文，更舊的只留摘錄並標記。
 * 回傳新陣列，不改動傳入的物件（畫面上顯示的資料不受影響）。
 */
function compactChaptersForStorage(list) {
  const arr = Array.isArray(list) ? list : [];
  if (arr.length <= LOCAL_FULL_PROSE_TURNS) return arr;
  const cutoff = arr.length - LOCAL_FULL_PROSE_TURNS;
  return arr.map((ch, idx) => {
    if (idx >= cutoff || !ch || ch.proseArchived) return ch;
    const prose = String(ch.prose || '');
    if (prose.length <= ARCHIVED_PROSE_EXCERPT) return ch;
    return Object.assign({}, ch, {
      prose: prose.slice(0, ARCHIVED_PROSE_EXCERPT) + '……',
      proseArchived: true
    });
  });
}

function compactChaptersForMemory(list) {
  let compacted = compactChaptersForStorage(list);
  const snapshotCutoff = Math.max(0, compacted.length - FULL_STATE_SNAPSHOT_TURNS);
  compacted = compacted.map((chapter, index) => {
    if (!chapter || index >= snapshotCutoff || chapter.stateSnapshot === undefined) return chapter;
    const copy = Object.assign({}, chapter);
    delete copy.stateSnapshot;
    return copy;
  });
  return compacted.slice(-MAX_IN_MEMORY_CHAPTERS);
}

/** 統一的章節列表持久化入口，所有寫入都應該經過這裡 */
function persistChapterHistory(list) {
  return safeLocalStorageSet(
    'undercurrent_full_story_chapters',
    JSON.stringify(compactChaptersForStorage(list))
  );
}

/** 摘要池上限。2,000 字在長局中太快被壓縮到失去細節，調高到 5,000 字。 */
const SUMMARY_POOL_MAX_CHARS = 5000;
function clampSummaryPool(text) {
  const str = String(text || '');
  if (str.length <= SUMMARY_POOL_MAX_CHARS) return str;
  return str.slice(0, SUMMARY_POOL_MAX_CHARS - 1) + '…';
}

// ==========================================
// 8. 存檔庫核心管理 (Save Archives CRUD)
// ==========================================

function isValidNamedSave(value) {
  return isPlainObject(value)
    && typeof value.id === 'string'
    && value.id.length > 0 && value.id.length <= 200
    && typeof value.name === 'string'
    && value.name.length <= 200
    && (value.timestamp === undefined || typeof value.timestamp === 'string')
    && (value.turnCount === undefined || (typeof value.turnCount === 'number' && Number.isFinite(value.turnCount)))
    && (value.chapterTitle === undefined || typeof value.chapterTitle === 'string')
    && (value.branchOrigin === undefined || isPlainObject(value.branchOrigin))
    && (value.playerProfile === undefined || isValidProfilePreset(value.playerProfile))
    && isPlainObject(value.saveState)
    && isValidChapterRecord(value.chapterData)
    && Array.isArray(value.chapterHistoryList)
    && value.chapterHistoryList.length <= 500
    && value.chapterHistoryList.every(isValidChapterRecord);
}

function isValidChapterRecord(value) {
  return isPlainObject(value)
    && typeof value.prose === 'string'
    && value.prose.length <= 200000
    && (value.chapterTitle === undefined || typeof value.chapterTitle === 'string')
    && (value.memoryPinned === undefined || typeof value.memoryPinned === 'boolean')
    && (value.stateSnapshot === undefined || isPlainObject(value.stateSnapshot))
    && (value.choices === undefined || Array.isArray(value.choices));
}

function getNamedSavesList() {
  try {
    const raw = localStorage.getItem('undercurrent_named_saves');
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(isValidNamedSave).slice(0, 500) : [];
  } catch (e) {
    return [];
  }
}

function persistNamedSavesList(saves) {
  const ok = safeLocalStorageSet('undercurrent_named_saves', JSON.stringify(saves.slice(0, 100)));
  if (!ok) return false;
  renderSaveArchivesList();
  renderHomeRecentSaves();
  return true;
}

function openSaveArchiveModal() {
  if (!openOverlay('save-archive-modal', { focusSelector: '#new-save-name-input' })) return;
  if (dom.newSaveNameInput) {
    const pName = state.saveState?.meta?.playerProfile?.name || '主角';
    const targetName = state.saveState?.meta?.playerProfile?.targetLeadName || '主線';
    const turn = state.saveState?.turnCount || 1;
    dom.newSaveNameInput.value = `${pName}-${targetName}第${turn}回`;
  }
  renderSaveArchivesList();
}

function closeSaveArchiveModal() {
  closeOverlay('save-archive-modal');
}

function getPinnedMemories() {
  const byTurn = new Map();
  (Array.isArray(state.saveState?.pinnedMemories) ? state.saveState.pinnedMemories : [])
    .forEach(ch => { if (ch) byTurn.set(Number(ch.turn), ch); });
  (state.chapterHistoryList || []).filter(ch => ch && ch.memoryPinned)
    .forEach(ch => byTurn.set(Number(ch.turn), ch));
  return Array.from(byTurn.values()).slice(-8);
}

/** 長文先顯示前 260 字，可展開全文（取代先前的硬截斷「……」）。 */
function renderExpandableProse(prose) {
  const text = String(prose || '');
  if (text.length <= 260) return `<p class="text-slate-600 leading-relaxed whitespace-pre-wrap">${escapeHtml(text)}</p>`;
  return `<details class="group">
    <summary class="list-none cursor-pointer text-slate-600 leading-relaxed">
      <span class="whitespace-pre-wrap">${escapeHtml(text.slice(0, 260))}</span><span class="group-open:hidden">…… <span class="text-brand-gold text-[11px]">展開全文</span></span>
    </summary>
    <p class="text-slate-600 leading-relaxed whitespace-pre-wrap">${escapeHtml(text.slice(260))}</p>
  </details>`;
}

function renderMemoryCenter() {
  const container = dom.memoryCenterContent;
  if (!container) return;
  const summary = state.saveState?.summaryPool || '目前尚未建立長期摘要；近期回合仍以完整正文保留。';
  const pinned = getPinnedMemories();
  const sp = state.chapterData?.statusPanel || {};
  const rels = state.saveState?.relationships || {};
  const recentCount = Math.min(CONTEXT_BUDGET.recentTurns, (state.chapterHistoryList || []).length);
  const facts = getMemoryBank().filter(m => m.kind === 'fact').slice().sort((a, b) => b.turn - a.turn);
  const factsHtml = facts.length
    ? `<div class="p-3 rounded-xl bg-brand-card border border-brand-border space-y-1.5 max-h-80 overflow-y-auto">${facts.map(m => `
        <div class="leading-relaxed text-slate-600"><span class="font-mono text-[10px] text-slate-400 mr-1">第 ${escapeHtml(m.turn)} 回</span>${m.topic ? `<span class="text-brand-gold mr-1">［${escapeHtml(m.topic)}］</span>` : ''}${escapeHtml(m.text)}</div>`).join('')}</div>`
    : '<div class="p-3 rounded-xl bg-brand-card/60 border border-brand-border text-slate-500">記憶庫目前是空的。每一回結束後，模型會把新確立的事實寫進來。</div>';
  const pinnedHtml = pinned.length ? pinned.map(ch => `
    <article class="p-3 rounded-xl bg-brand-card border border-brand-border space-y-1.5">
      <div class="flex items-center justify-between gap-2">
        <strong class="font-serif text-brand-gold">${escapeHtml(formatActTurn(ch.act, ch.turn))} · ${escapeHtml(displayChapterTitle(ch, '重要回合'))}</strong>
        <button class="memory-unpin-btn text-[11px] text-rose-500 hover:text-rose-700 cursor-pointer" data-turn="${escapeHtml(ch.turn || '')}">取消釘選</button>
      </div>
      ${ch.chosenLabel ? `<div class="text-slate-500">玩家行動：${escapeHtml(ch.chosenLabel)}</div>` : ''}
      ${renderExpandableProse(ch.prose)}
    </article>`).join('') : '<div class="p-3 rounded-xl bg-brand-card/60 border border-brand-border text-slate-500">尚未釘選重要回合。可在每一回章節卡片使用「標記重要」。</div>';

  container.innerHTML = `
    <section class="space-y-2">
      <div class="flex items-center justify-between"><h4 class="font-serif font-bold text-brand-gold">長期劇情摘要</h4><span class="text-[10px] text-slate-500">近期 ${recentCount} 回另以全文保留</span></div>
      <div class="whitespace-pre-wrap leading-relaxed p-3 rounded-xl bg-brand-card border border-brand-border text-slate-600">${escapeHtml(summary)}</div>
    </section>
    <section class="space-y-2">
      <h4 class="font-serif font-bold text-brand-gold">目前狀態快照</h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div class="p-3 rounded-xl bg-brand-card border border-brand-border"><span class="text-slate-500">時空地點</span><div class="mt-1 text-slate-700">${escapeHtml(sp.timeLocation || '尚未記錄')}</div></div>
        ${FEATURES.favorability ? `<div class="p-3 rounded-xl bg-brand-card border border-brand-border"><span class="text-slate-500">角色關係</span><div class="mt-1 text-slate-700">${escapeHtml(Object.entries(rels).map(([k,v]) => `${k} ${v}/100`).join('、') || '尚未記錄')}</div></div>` : ''}
      </div>
    </section>
    <section class="space-y-2"><h4 class="font-serif font-bold text-brand-gold">玩家釘選的重要記憶（${pinned.length}）</h4>${pinnedHtml}</section>
    <section class="space-y-2">
      <div class="flex items-center justify-between"><h4 class="font-serif font-bold text-brand-gold">記憶庫：已確立的事實（${facts.length}）</h4><span class="text-[10px] text-slate-500">每回生成前依劇情檢索</span></div>
      ${factsHtml}
    </section>
  `;
  container.querySelectorAll('.memory-unpin-btn').forEach(btn => {
    btn.addEventListener('click', () => toggleMemoryPin(Number(btn.dataset.turn), false));
  });
}

function openMemoryCenter() {
  if (!state.chapterData) return notifyUser('目前尚無故事記憶可查看。', 'info');
  renderMemoryCenter();
  openOverlay('memory-center-modal');
}

function closeMemoryCenter() {
  closeOverlay('memory-center-modal');
}

function toggleMemoryPin(turn, forceValue) {
  const chapter = (state.chapterHistoryList || []).find(ch => Number(ch.turn) === Number(turn));
  const storedBefore = Array.isArray(state.saveState?.pinnedMemories) ? state.saveState.pinnedMemories : [];
  if (!chapter) {
    if (forceValue === false && storedBefore.some(item => Number(item?.turn) === Number(turn))) {
      state.saveState.pinnedMemories = storedBefore.filter(item => Number(item?.turn) !== Number(turn));
      safeLocalStorageSet('undercurrent_current_save_state', JSON.stringify(state.saveState || {}));
      if (isOverlayOpen('memory-center-modal')) renderMemoryCenter();
      return notifyUser('已取消重要記憶標記。', 'success');
    }
    return notifyUser('找不到這個回合，可能已不在本機章節視窗中。', 'error');
  }
  chapter.memoryPinned = typeof forceValue === 'boolean' ? forceValue : !chapter.memoryPinned;
  if (state.chapterData && Number(state.chapterData.turn) === Number(turn)) {
    state.chapterData.memoryPinned = chapter.memoryPinned;
  }
  state.saveState = state.saveState || {};
  const stored = storedBefore;
  const withoutTurn = stored.filter(item => Number(item?.turn) !== Number(turn));
  state.saveState.pinnedMemories = chapter.memoryPinned
    ? [...withoutTurn, {
        turn: chapter.turn,
        chapterTitle: chapter.chapterTitle || '',
        chosenLabel: chapter.chosenLabel || '',
        // 存全文：先前只存前 1,200 字，長章節的後半段一釘選就永久遺失
        prose: String(chapter.prose || ''),
        memoryPinned: true
      }].slice(-8)
    : withoutTurn;
  persistChapterHistory(state.chapterHistoryList);
  safeLocalStorageSet('undercurrent_current_save_state', JSON.stringify(state.saveState || {}));
  if (dom.novelStreamContainer) dom.novelStreamContainer.innerHTML = '';
  renderStoryStream(state.chapterData);
  if (isOverlayOpen('memory-center-modal')) renderMemoryCenter();
  notifyUser(chapter.memoryPinned ? '已標記為重要記憶，後續回合會保留原文摘錄。' : '已取消重要記憶標記。', 'success');
}

function createCurrentStoryFork() {
  if (!state.chapterData) return notifyUser('目前尚無進度可建立分歧。', 'error');
  const turn = state.saveState?.turnCount || state.chapterData.turn || 1;
  const title = displayChapterTitle(state.chapterData).slice(0, 28);
  const name = `分歧・第${turn}回・${title}`;
  return createNamedSave(name, { branchOrigin: { turn, title: state.chapterData.chapterTitle || '' } });
}

async function rewindStoryToTurn(turn) {
  if (state.isGenerating) return notifyUser('生成進行中，請先完成或中止本回。', 'info');
  const chapters = state.chapterHistoryList || [];
  const index = chapters.findIndex(ch => Number(ch.turn) === Number(turn));
  const target = chapters[index];
  if (!target) return notifyUser('找不到指定回合。', 'error');
  if (!target.stateSnapshot) {
    return notifyUser('這是舊版章節，沒有完整數值快照；為避免狀態錯亂，不執行回溯。可改載入當時建立的具名存檔。', 'error', 7000);
  }
  const removed = chapters.length - index - 1;
  if (removed <= 0) return notifyUser('目前已位於這個回合。', 'info');
  const ok = await confirmDialog(`將先建立目前進度的安全分歧存檔，再回到第 ${turn} 回。\n其後 ${removed} 回會從目前時間線移除，但可由分歧存檔取回。`, {
    title: '回溯故事時間線', confirmText: '建立分歧並回溯'
  });
  if (!ok) return;
  if (!createCurrentStoryFork()) return;
  // 快照不含記憶庫（見 appendChapterToHistory），回溯時沿用現有記憶庫並剔除「未來」的條目
  const carriedMemory = getMemoryBank().slice();
  state.saveState = JSON.parse(JSON.stringify(target.stateSnapshot));
  const restoredTurn = Number(state.saveState.turnCount) || Number(target.turn) || 1;
  state.saveState.memoryBank = carriedMemory.filter(m => m.turn <= restoredTurn);
  delete state.saveState.patrolNotes;
  state.chapterHistoryList = chapters.slice(0, index + 1);
  state.chapterData = state.chapterHistoryList[state.chapterHistoryList.length - 1];
  state.playerProfile = state.saveState?.meta?.playerProfile || state.playerProfile;
  state.previousStateSnapshot = null;
  state.lastChoicePayload = null;
  safeLocalStorageSet('undercurrent_current_save_state', JSON.stringify(state.saveState));
  persistChapterHistory(state.chapterHistoryList);
  if (dom.novelStreamContainer) dom.novelStreamContainer.innerHTML = '';
  renderStoryStream(state.chapterData);
  renderSaveState();
  updateGameplayBreadcrumb();
  closeChapterNav();
  notifyUser(`已回到第 ${turn} 回；原進度已保存為分歧存檔。`, 'success', 5500);
}

function createNamedSave(saveName, metadata = {}) {
  const name = (saveName || '').trim();
  if (!name) return notifyUser('請先輸入存檔名稱。', 'error');
  if (!state.chapterData && (!state.chapterHistoryList || state.chapterHistoryList.length === 0)) {
    return notifyUser('當前尚無遊戲進度可儲存，請先開啟新局。', 'error');
  }

  const saves = getNamedSavesList();
  const profile = getActivePlayerProfile();
  const lastChapter = state.chapterHistoryList[state.chapterHistoryList.length - 1] || state.chapterData;

  const newSaveEntry = {
    id: 'save_' + crypto.randomUUID(),
    name: name,
    timestamp: new Date().toLocaleString('zh-TW', { hour12: false }),
    turnCount: state.saveState?.turnCount || 1,
    chapterTitle: lastChapter?.chapterTitle || '第 1 回',
    branchOrigin: metadata.branchOrigin,
    playerProfile: profile,
    saveState: state.saveState,
    chapterData: state.chapterData,
    // 只帶最近視窗：先前每個具名存檔都複製一份完整歷史，
    // 長局時十來個存檔就會撞爆 localStorage 配額。
    chapterHistoryList: chapterWindow(state.chapterHistoryList)
  };

  saves.unshift(newSaveEntry);
  if (!persistNamedSavesList(saves)) {
    notifyUser('本機儲存空間不足，這筆存檔尚未建立；請先匯出或刪除舊存檔。', 'error', 8000);
    return false;
  }
  notifyUser(`存檔「${name}」已儲存。`, 'success');
  syncStateToGoogleDriveCloud(state.saveState, state.chapterData);
  return true;
}

async function renameNamedSave(saveId) {
  const saves = getNamedSavesList();
  const target = saves.find(s => s.id === saveId);
  if (!target) return;

  const newName = await promptDialog('請輸入新的存檔名稱：', target.name, { title: '重新命名存檔' });
  if (newName && newName.trim()) {
    target.name = newName.trim();
    if (persistNamedSavesList(saves)) notifyUser('存檔已重新命名。', 'success');
    else notifyUser('本機儲存空間不足，重新命名未保存。', 'error');
  }
}

async function deleteNamedSave(saveId) {
  const saves = getNamedSavesList();
  const target = saves.find(s => s.id === saveId);
  if (!target) return;

  if (await confirmDangerDialog(`確定要刪除存檔「${target.name}」嗎？此操作無法復原。`, { title: '刪除存檔', confirmText: '刪除' })) {
    const remaining = saves.filter(s => s.id !== saveId);
    if (persistNamedSavesList(remaining)) notifyUser('已刪除該筆存檔。', 'success');
    else notifyUser('無法更新本機存檔索引。', 'error');
  }
}

function loadNamedSave(saveId) {
  if (state.isGenerating) return notifyUser('生成進行中，請先完成或中止本回。', 'info');
  const saves = getNamedSavesList();
  const target = saves.find(s => s.id === saveId);
  if (!target) return notifyUser('找不到該筆存檔。', 'error');

  state.saveState = target.saveState;
  state.chapterData = target.chapterData;
  state.chapterHistoryList = compactChaptersForMemory(target.chapterHistoryList || []);
  state.playerProfile = target.playerProfile || target.saveState?.meta?.playerProfile || null;
  state.previousStateSnapshot = null;
  state.lastChoicePayload = null;

  safeLocalStorageSet('undercurrent_current_save_state', JSON.stringify(state.saveState));
  persistChapterHistory(state.chapterHistoryList);
  if (target.playerProfile) {
    safeLocalStorageSet('undercurrent_current_player_profile', JSON.stringify(target.playerProfile));
  }

  closeSaveArchiveModal();
  switchView('gameplay');
  
  renderStoryStream(state.chapterData);
  renderSaveState();
  updateGameplayBreadcrumb();

  notifyUser(`已載入存檔「${target.name}」。`, 'success');
}

function renderSaveArchivesList() {
  const container = dom.saveArchivesList;
  if (!container) return;

  const saves = getNamedSavesList();
  const search = (dom.searchSaveInput?.value || '').toLowerCase().trim();
  const countBadge = document.getElementById('save-count-badge');
  if (countBadge) countBadge.textContent = `${saves.length} 個存檔槽位`;

  container.innerHTML = '';

  // 1. 如果當前有正在進行中的遊戲進度，在最上方提供【 進行中的最新冒險進度 (AutoSave)】大卡片
  if (state.chapterData && state.saveState && !search) {
    const p = state.playerProfile || state.saveState?.meta?.playerProfile || {};
    const turn = state.saveState?.turnCount || 1;
    const lead = p.targetLeadName || p.targetLead || '主線';
    const title = displayChapterTitle(state.chapterData, `第 ${turn} 回`);
    const snippet = (state.chapterData.prose || '').replace(/\n+/g, ' ').slice(0, 110) + '……';

    const activeCard = document.createElement('div');
    activeCard.className = 'bg-gradient-to-r from-amber-950/40 via-brand-card to-amber-950/40 p-4 rounded-xl border border-brand-gold/60 shadow-lg space-y-2.5 relative overflow-hidden';

    activeCard.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-brand-gold/30 pb-2">
        <div class="flex items-center gap-2">
          <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span class="font-mono text-xs font-bold text-brand-gold bg-brand-gold/20 px-2 py-0.5 rounded border border-brand-gold/40">CURRENT · 進行中</span>
          <span class="font-serif font-bold text-sm text-white">當前即時進度（第 ${escapeHtml(turn)} 回 · ${escapeHtml(title)}）</span>
        </div>
        <span class="text-[11px] text-amber-200/80 font-mono">剛剛動態更新</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
        <div class="flex items-center gap-2">
          <span class="text-slate-400">主角：</span>
          <span class="font-bold text-white">${escapeHtml(p.name || '女主')}</span>
          <span class="text-slate-500">（${escapeHtml(p.age || '25')}歲 · ${escapeHtml(p.profession || p.occupation || '政經分析師')}）</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-slate-400">${uiIcon('target')} 攻略男主：</span>
          <span class="font-bold text-amber-300">${escapeHtml(lead)}</span>
        </div>
      </div>

      <div class="text-xs text-slate-300 bg-brand-dark/70 p-2.5 rounded-lg border border-brand-border/60 italic leading-relaxed">
        "${escapeHtml(snippet)}"
      </div>

      <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div class="text-[11px] text-slate-400">
          * 隨時可點擊右側將此進度建立為永久獨立存檔或手動同步至雲端（可跨裝置遊戲）。
        </div>
        <div class="flex items-center gap-2">
          <button class="active-save-as-btn px-3 py-1.5 rounded-lg bg-brand-gold text-slate-950 font-black hover:bg-yellow-500 transition text-xs shadow cursor-pointer flex items-center gap-1">
            <span>${uiIcon('save')}</span>
            <span>儲存為新檔</span>
          </button>
          <button class="active-sync-drive-btn px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-blue-100 font-bold transition text-xs border border-blue-600/50 cursor-pointer flex items-center gap-1">
            <span>${uiIcon('cloud')}</span>
            <span>手動同步此局至雲端（可跨裝置遊戲）</span>
          </button>
          <button class="active-resume-btn px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold transition text-xs cursor-pointer flex items-center gap-1">
            <span>▶</span>
            <span>繼續遊玩</span>
          </button>
        </div>
      </div>
    `;

    activeCard.querySelector('.active-save-as-btn')?.addEventListener('click', handleQuickSave);
    activeCard.querySelector('.active-sync-drive-btn')?.addEventListener('click', () => syncStateToGoogleDriveCloud(state.saveState, state.chapterData, true));
    activeCard.querySelector('.active-resume-btn')?.addEventListener('click', () => {
      closeSaveArchiveModal();
      switchView('gameplay');
    });

    container.appendChild(activeCard);
  }

  // 2. 篩選存檔清單
  const filtered = saves.filter(s => {
    if (!search) return true;
    return (s.name || '').toLowerCase().includes(search) ||
           (s.chapterTitle || '').toLowerCase().includes(search) ||
           (s.playerProfile?.name || '').toLowerCase().includes(search) ||
           (s.playerProfile?.targetLeadName || '').toLowerCase().includes(search);
  });

  if (filtered.length === 0 && (!state.chapterData || search)) {
    container.innerHTML += '<div class="text-center text-slate-500 py-10 bg-brand-card/40 rounded-xl border border-brand-border/40">尚無符合條件的存檔紀錄</div>';
    return;
  }

  // 3. 渲染所有存檔卡片 (大選單卡片風格)
  filtered.forEach((s, idx) => {
    const p = s.playerProfile || {};
    const turn = s.turnCount || 1;
    const lead = p.targetLeadName || p.targetLead || '主線';
    const chTitle = stripChapterNumbering(s.chapterTitle) || `第 ${turn} 回`;
    const snippet = s.chapterData?.prose ? (s.chapterData.prose.replace(/\n+/g, ' ').slice(0, 110) + '……') : '（已儲存之分支劇情節點）';
    const tension = s.saveState?.status?.tension || s.saveState?.tension || 0;
    const tipsy = s.saveState?.status?.tipsy || s.saveState?.tipsy || 0;

    const card = document.createElement('div');
    card.className = 'bg-brand-card p-4 rounded-xl border border-brand-border hover:border-brand-gold/60 transition space-y-3 shadow-md group relative';

    card.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-brand-border/70 pb-2">
        <div class="flex items-center gap-2">
          <span class="font-mono text-xs font-black text-brand-gold bg-brand-gold/15 px-2 py-0.5 rounded border border-brand-gold/30">SLOT ${String(idx + 1).padStart(2, '0')}</span>
          <span class="font-serif font-black text-sm text-white group-hover:text-brand-gold transition">${escapeHtml(s.name)}</span>
        </div>
        <div class="flex items-center gap-2 font-mono text-[11px] text-slate-400">
          <span>${uiIcon('clock')}</span>
          <span>${escapeHtml(s.timestamp || '-')}</span>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3 text-xs">
        <div class="flex items-center gap-1.5 bg-brand-dark/80 px-2.5 py-1 rounded border border-brand-border/60">
          <span class="text-slate-400">主角：</span>
          <span class="font-bold text-white">${escapeHtml(p.name || '女主')}</span>
        </div>
        <div class="flex items-center gap-1.5 bg-brand-dark/80 px-2.5 py-1 rounded border border-brand-border/60">
          <span class="text-slate-400">${uiIcon('target')} 攻略：</span>
          <span class="font-bold text-amber-300">${escapeHtml(lead)}</span>
        </div>
        <div class="flex items-center gap-1.5 bg-brand-dark/80 px-2.5 py-1 rounded border border-brand-border/60">
          <span class="text-slate-400">${uiIcon('book')} 進度：</span>
          <span class="font-bold text-sky-300">第 ${escapeHtml(turn)} 回（${escapeHtml(chTitle)}）</span>
        </div>
        ${s.branchOrigin ? `<div class="flex items-center gap-1.5 bg-purple-50 px-2.5 py-1 rounded border border-purple-200"><span class="text-purple-600">⑂ 分歧來源：</span><span class="font-bold text-purple-700">第 ${escapeHtml(s.branchOrigin.turn || '?')} 回</span></div>` : ''}
        <div class="flex items-center gap-2 text-[11px] text-slate-400 ml-auto">
          <span>${uiIcon('thermo')} 張力: <b class="text-rose-400">${escapeHtml(tension)}%</b></span>
          <span>${uiIcon('wine')} 微醺: <b class="text-amber-400">${escapeHtml(tipsy)}%</b></span>
        </div>
      </div>

      <div class="text-xs text-slate-300 bg-brand-dark/60 p-2.5 rounded-lg border border-brand-border/40 italic leading-relaxed">
        "${escapeHtml(snippet)}"
      </div>

      <div class="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-brand-border/40">
        <button class="load-archive-btn px-4 py-1.5 rounded-lg bg-brand-gold text-slate-950 font-black hover:bg-yellow-500 transition text-xs shadow-md cursor-pointer flex items-center gap-1" data-id="${escapeHtml(s.id || '')}">
          <span>▶</span>
          <span>讀取載入此存檔</span>
        </button>
        <button class="rename-archive-btn px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white transition text-xs border border-brand-border cursor-pointer flex items-center gap-1" data-id="${escapeHtml(s.id || '')}">
          <span>${uiIcon('pencil')}</span>
          <span>重新命名</span>
        </button>
        <button class="sync-single-archive-btn px-3 py-1.5 rounded-lg bg-blue-950/70 hover:bg-blue-900 text-blue-200 hover:text-white transition text-xs border border-blue-700/50 cursor-pointer flex items-center gap-1" data-id="${escapeHtml(s.id || '')}">
          <span>${uiIcon('cloud')}</span>
          <span>手動同步此檔至雲端（可跨裝置遊戲）</span>
        </button>
        <button class="delete-archive-btn px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white transition text-xs border border-rose-800/40 cursor-pointer flex items-center gap-1" data-id="${escapeHtml(s.id || '')}">
          <span>${uiIcon('trash')}</span>
          <span>刪除</span>
        </button>
      </div>
    `;

    card.querySelector('.load-archive-btn')?.addEventListener('click', () => loadNamedSave(s.id));
    card.querySelector('.rename-archive-btn')?.addEventListener('click', () => renameNamedSave(s.id));
    card.querySelector('.sync-single-archive-btn')?.addEventListener('click', () => {
      syncStateToGoogleDriveCloud(s.saveState, s.chapterData, true, s.chapterHistoryList || []);
    });
    card.querySelector('.delete-archive-btn')?.addEventListener('click', () => deleteNamedSave(s.id));

    container.appendChild(card);
  });
}

function renderHomeRecentSaves() {
  updateHomeContinueCard();
  const container = dom.homeRecentSavesList;
  if (!container) return;

  const saves = getNamedSavesList();
  container.innerHTML = '';

  if (saves.length === 0) {
    container.innerHTML = '<div class="text-xs text-slate-500 py-3 text-center">尚無存檔紀錄，點擊上方【開啟全新局】即刻啟程！</div>';
    return;
  }

  saves.slice(0, 3).forEach(s => {
    const row = document.createElement('div');
    row.className = 'flex items-center justify-between p-2.5 rounded-lg bg-brand-dark/80 border border-brand-border/60 hover:border-brand-gold/40 transition cursor-pointer text-xs';
    
    row.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="text-brand-gold">${uiIcon('save')}</span>
        <span class="font-bold text-white">${escapeHtml(s.name)}</span>
        <span class="text-[11px] text-slate-400">（第 ${escapeHtml(s.turnCount || 1)} 回 · ${escapeHtml(s.playerProfile?.targetLeadName || '主線')}）</span>
      </div>
      <span class="font-mono text-[11px] text-slate-500">${escapeHtml(s.timestamp || '-')}</span>
    `;

    row.addEventListener('click', () => loadNamedSave(s.id));
    container.appendChild(row);
  });
}

function handleContinueGame() {
  warmLoreCache(getActivePlayerProfile());
  backfillTurnSummaries();
  if (state.chapterHistoryList && state.chapterHistoryList.length > 0 && state.chapterData) {
    switchView('gameplay');
    // switchView 只更新麵包屑，從不渲染故事本體 —— 先前續玩進來會看到一片空白，
    // 選項也不會出現（renderChoices 是由 renderStoryStream 觸發的）。
    renderStoryStream(state.chapterData);
    renderSaveState();
  } else {
    const saves = getNamedSavesList();
    if (saves.length > 0) {
      openSaveArchiveModal();
    } else {
      notifyUser('目前尚無進行中的冒險進度，請先開啟全新局創角。', 'info', 4500);
      openCharacterCreationModal();
    }
  }
}

function handleQuickSave() {
  if (!state.chapterData) return notifyUser('目前尚無進行中的故事進度可存檔。', 'error');
  const pName = state.saveState?.meta?.playerProfile?.name || '主角';
  const targetName = state.saveState?.meta?.playerProfile?.targetLeadName || '主線';
  const turn = state.saveState?.turnCount || 1;
  const autoName = `${pName}-${targetName}第${turn}回`;
  createNamedSave(autoName);
}

// ==========================================
// 8.5 遊戲指南、系統說明與角色全景圖鑑 (Game Guide & Roster Gallery)
// ==========================================

function openGameGuideModal(initialTab = 'gameplay') {
  if (!openOverlay('game-guide-modal')) return;
  switchGuideTab(initialTab);
}

function closeGameGuideModal() {
  closeOverlay('game-guide-modal');
}

function switchGuideTab(tabName) {
  const tabs = {
    gameplay: { btn: dom.guideTabGameplayBtn, panel: dom.guidePanelGameplay },
    system: { btn: dom.guideTabSystemBtn, panel: dom.guidePanelSystem },
    roster: { btn: dom.guideTabRosterBtn, panel: dom.guidePanelRoster }
  };

  Object.keys(tabs).forEach(k => {
    const t = tabs[k];
    if (t.btn) {
      if (k === tabName) {
        t.btn.classList.add('border-brand-gold', 'text-brand-gold');
        t.btn.classList.remove('border-transparent', 'text-slate-400');
      } else {
        t.btn.classList.remove('border-brand-gold', 'text-brand-gold');
        t.btn.classList.add('border-transparent', 'text-slate-400');
      }
    }
    if (t.panel) {
      t.panel.style.display = (k === tabName) ? 'block' : 'none';
    }
  });

  if (tabName === 'roster') {
    renderRosterGallery();
  }
}

function renderRosterGallery() {
  const container = dom.rosterGalleryList;
  if (!container) return;

  const search = (dom.searchRosterInput?.value || '').toLowerCase().trim();
  container.innerHTML = '';

  const charKeys = Object.keys(OFFICIAL_DRIVE_CHARACTERS);
  const filteredKeys = charKeys.filter(k => {
    const c = OFFICIAL_DRIVE_CHARACTERS[k];
    const summary = c.summary || c.personality || c.identityRole || '';
    if (!search) return true;
    return c.name.toLowerCase().includes(search) ||
           c.identityRole.toLowerCase().includes(search) ||
           summary.toLowerCase().includes(search) ||
           c.title.toLowerCase().includes(search);
  });

  if (filteredKeys.length === 0) {
    container.innerHTML = '<div class="col-span-full text-center text-slate-500 py-6">找不到相符的角色資料</div>';
    return;
  }

  filteredKeys.forEach(k => {
    const c = OFFICIAL_DRIVE_CHARACTERS[k];
    const isProtagonist = k === '14_楊慕璃';
    const summary = c.summary || c.personality || c.identityRole || '';
    const rMatch = ROSTER_ONE_LINERS.find(r => r.id === k || r.name === c.name);
    const oneLiner = rMatch ? rMatch.oneLiner : summary;

    const card = document.createElement('div');
    card.className = 'bg-brand-card p-3.5 rounded-xl border border-brand-border hover:border-brand-gold/60 transition space-y-2 flex flex-col justify-between shadow-md group';

    card.innerHTML = `
      <div class="space-y-1.5">
        <div class="flex items-center justify-between border-b border-brand-border/60 pb-1.5">
          <div class="flex items-center gap-2">
            <span class="font-mono text-xs font-bold text-brand-gold bg-brand-gold/15 px-1.5 py-0.5 rounded border border-brand-gold/30">${k.split('_')[0]}</span>
            <span class="font-serif font-black text-sm text-white group-hover:text-brand-gold transition">${c.name}</span>
            <span class="text-[11px] text-slate-400 font-mono">（${c.age}）</span>
          </div>
          <span class="text-[10px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">${isProtagonist ? '官方主角' : '官方男主'}</span>
        </div>
        <div class="text-[11px] font-bold text-amber-200/90 leading-tight">
          ${c.identityRole}
        </div>
        <div class="text-xs text-slate-300 leading-relaxed pt-1">
          ${oneLiner}
        </div>
        <div class="text-[11px] text-slate-400 bg-brand-dark/60 p-2 rounded-lg border border-brand-border/40 mt-1 leading-normal">
          ${summary}
        </div>
      </div>
      ${isProtagonist ? '' : `<div class="pt-2 flex items-center justify-end">
        <button class="select-this-lead-btn px-3 py-1.5 rounded-lg bg-brand-gold/20 hover:bg-brand-gold text-brand-gold hover:text-slate-950 font-bold text-xs transition border border-brand-gold/40 cursor-pointer shadow-sm" data-key="${k}">
          ${uiIcon('sparkle')} 以此男主開局 →
        </button>
      </div>`}
    `;

    card.querySelector('.select-this-lead-btn')?.addEventListener('click', () => {
      closeGameGuideModal();
      openCharacterCreationModal();
      const select = dom.formTargetLead || document.getElementById('form-target-lead');
      if (select) {
        select.value = k;
        handleTargetLeadChange();
      }
    });

    container.appendChild(card);
  });
}

function exportAllSaves() {
  const saves = getNamedSavesList();
  const blob = new Blob([JSON.stringify(saves, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `UnderCurrent_Saves_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importAllSaves(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const imported = JSON.parse(evt.target.result);
      if (!Array.isArray(imported)) throw new Error('檔案格式不正確，應為 JSON 陣列');
      if (imported.length > 500) throw new Error('匯入檔超過 500 筆存檔上限');
      if (!imported.every(isValidNamedSave)) throw new Error('檔案包含不完整或不安全的存檔資料');
      const existing = getNamedSavesList();
      const existingIds = new Set(existing.map(s => s.id));
      const newItems = imported.filter(s => !existingIds.has(s.id));
      const merged = [...newItems, ...existing];
      persistNamedSavesList(merged);
      notifyUser(`已成功匯入 ${newItems.length} 筆新存檔。`, 'success');
    } catch (err) {
      notifyUser('存檔匯入失敗：' + err.message, 'error', 5000);
    }
  };
  reader.readAsText(file);
}

// ==========================================
// 9. 輔助與抽屜狀態渲染 (Helpers & State)
// ==========================================

function openCharacterCreationModal() {
  if (openOverlay('character-creation-modal', { focusSelector: '#form-player-name' })) {
    dom.charCreationModal.scrollTop = 0;
    loadSavedProfilePresetsIntoSelect();
    const profile = getActivePlayerProfile();
    if (profile) {
      setFormValue('form-player-name', profile.name);
      setFormValue('form-player-gender', profile.gender || '女');
      setFormValue('form-player-age', profile.age || '24');
      setFormValue('form-player-profession', profile.profession);
      setFormValue('form-player-background', profile.background);
      setFormValue('form-player-appearance', profile.appearance || '隨機');
      setFormValue('form-player-taboos', profile.taboos || '無');
      setFormValue('form-target-lead', profile.targetLead || '01_徐令謙');
      handleTargetLeadChange();
      setFormValue('form-allow-r18', profile.allowR18 !== false);
      setFormValue('form-allow-dominant', profile.allowDominantPlot === true);
      setFormValue('form-custom-scenario', profile.customScenario || '');
    }
  }
}

function toggleCreatorAdvancedFields() {
  const form = document.getElementById('char-creation-form');
  const button = document.getElementById('creator-advanced-toggle');
  const icon = document.getElementById('creator-advanced-toggle-icon');
  if (!form || !button) return;
  const opening = form.classList.contains('creator-advanced-fields-collapsed');
  form.classList.toggle('creator-advanced-fields-collapsed', !opening);
  button.setAttribute('aria-expanded', String(opening));
  if (icon) icon.textContent = opening ? '收合 ▴' : '展開 ▾';
}

function randomizeProfileForm() {
  const keys = Object.keys(DEFAULT_PRESETS).filter(key => key !== 'preset_custom');
  const key = keys[Math.floor(Math.random() * keys.length)] || 'preset_yang';
  loadProfilePresetIntoForm(key);
  setFormValue('form-player-appearance', '隨機');
  notifyUser('已產生一組完整人設；仍可自由修改後再開始。', 'success', 3200);
}

function closeCharacterCreationModal() {
  closeOverlay('character-creation-modal');
}

function getActivePlayerProfile() {
  if (state.saveState?.meta?.playerProfile?.name) {
    return state.saveState.meta.playerProfile;
  }
  try {
    const raw = localStorage.getItem('undercurrent_current_player_profile');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return DEFAULT_PRESETS['preset_yang'];
}

function setFormValue(id, val) {
  const el = document.getElementById(id);
  if (el) {
    if (el.type === 'checkbox') el.checked = !!val;
    else el.value = val !== undefined && val !== null ? val : '';
  }
}

function prepareIntelAction(intelId) {
  const item = ensureIntelLedger().find(entry => entry.id === intelId);
  if (!item || item.status !== 'available') return notifyUser('這項線索目前已不可使用。', 'error');
  const input = dom.customActionInput;
  if (!input) return;
  const prefix = `使用線索「${item.name}」[${item.id}]：`;
  input.value = input.value.trim() ? `${prefix}\n${input.value.trim()}` : prefix;
  input.dataset.choiceId = 'CUSTOM';
  input.dataset.intelId = item.id;
  closeDrawer();
  autoGrowActionInput();
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
  notifyUser(`已帶入「${item.name}」，補上使用方式後即可送出。`, 'success', 3200);
}

function renderSaveState() {
  if (!state.saveState) return;
  const p = state.saveState.protagonist || { hp: 100, sanity: 100 };
  if (dom.hpDisplay) dom.hpDisplay.textContent = p.hp;
  if (dom.sanityDisplay) dom.sanityDisplay.textContent = p.sanity;

  const profile = getActivePlayerProfile();
  if (dom.profileCardName) dom.profileCardName.textContent = `${profile.name || '女主'}（${profile.age || '24'}歲 · ${profile.profession || '政商人士'}）`;
  if (dom.profileCardLead) dom.profileCardLead.textContent = `攻略對象：${profile.targetLeadName || '修羅場'} ｜ R-18：${profile.allowR18 ? '開啟' : '關閉'}${isDominantPlotEnabled(profile) ? ' ｜ 強勢主導：開啟' : ''}`;

  const relationshipsSection = document.getElementById('relationships-section');
  if (relationshipsSection) relationshipsSection.hidden = !FEATURES.favorability;
  if (FEATURES.favorability && dom.relationshipsList) {
    dom.relationshipsList.innerHTML = '';
    const rels = state.saveState.relationships || {};
    
    const leadNames = Object.keys(rels);
    if (leadNames.length === 0) {
      dom.relationshipsList.innerHTML = '<div class="text-slate-500 text-xs py-2">尚無人物好感度數據</div>';
    } else {
      leadNames.forEach(name => {
        const val = Math.max(0, Math.min(100, rels[name] || 0));
        // G6: 門檻對齊實際初始值（單一攻略開局 25、修羅場 20/15/10），
        // 先前 <30 全歸「初識審視」，導致所有人開局都是同一格灰條。
        let tierLabel = '初識審視';
        let barColor = 'from-slate-600 to-slate-400';
        if (val >= 88) { tierLabel = '靈肉共沉'; barColor = 'from-rose-600 to-pink-500'; }
        else if (val >= 70) { tierLabel = '致命深陷'; barColor = 'from-rose-500 to-amber-500'; }
        else if (val >= 50) { tierLabel = '曖昧交鋒'; barColor = 'from-amber-500 to-yellow-400'; }
        else if (val >= 32) { tierLabel = '利益試探'; barColor = 'from-blue-500 to-cyan-400'; }
        else if (val >= 18) { tierLabel = '初步結識'; barColor = 'from-slate-500 to-blue-400'; }

        const div = document.createElement('div');
        div.className = 'space-y-1 bg-brand-dark/60 p-2.5 rounded-lg border border-brand-border/60';
        div.innerHTML = `
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-white">${escapeHtml(name)}</span>
            <span class="font-mono text-brand-gold font-bold">${val} <span class="text-[10px] text-slate-400 font-sans">(${tierLabel})</span></span>
          </div>
          <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div class="bg-gradient-to-r ${barColor} h-1.5 rounded-full transition-all duration-500" style="width: ${val}%"></div>
          </div>
        `;
        dom.relationshipsList.appendChild(div);
      });
    }
  }

  if (dom.intelLedgerList) {
    dom.intelLedgerList.innerHTML = '';
    const ledger = ensureIntelLedger(state.saveState).slice().sort((a, b) => {
      const availability = (a.status === 'available' ? 0 : 1) - (b.status === 'available' ? 0 : 1);
      return availability || (b.updatedTurn || 0) - (a.updatedTurn || 0);
    });
    if (ledger.length === 0) {
      dom.intelLedgerList.innerHTML = '<div class="rounded-lg border border-dashed border-brand-border px-3 py-3 text-[11px] leading-relaxed text-slate-500">目前沒有可用線索。只有劇情中實際取得或查證的情報才會出現在這裡。</div>';
    } else {
      ledger.slice(0, 16).forEach(item => {
        const usable = item.status === 'available';
        const card = document.createElement(usable ? 'button' : 'div');
        if (usable) card.type = 'button';
        card.className = `w-full rounded-lg border p-2.5 text-left text-[11px] space-y-1 ${usable
          ? 'border-amber-500/40 bg-amber-950/20 hover:border-brand-gold hover:bg-amber-950/35 cursor-pointer'
          : 'border-brand-border/40 bg-brand-dark/35 opacity-65'}`;
        card.innerHTML = `
          <div class="flex items-start justify-between gap-2">
            <span class="font-bold ${usable ? 'text-amber-100' : 'text-slate-400'}">${escapeHtml(item.name)}</span>
            <span class="shrink-0 rounded px-1.5 py-0.5 text-[10px] ${usable ? 'bg-emerald-900/60 text-emerald-300' : 'bg-slate-800 text-slate-400'}">${escapeHtml(INTEL_STATUS_LABELS[item.status] || item.status)}</span>
          </div>
          <div class="flex flex-wrap gap-1.5 text-[10px] text-slate-400">
            <span>${escapeHtml(INTEL_TYPE_LABELS[item.type] || item.type)}</span>
            <span>·</span>
            <span>${escapeHtml(INTEL_CONFIDENCE_LABELS[item.confidence] || item.confidence)}</span>
            <span>·</span>
            <span>第 ${escapeHtml(item.acquiredTurn)} 回取得</span>
          </div>
          ${item.effect ? `<div class="leading-relaxed text-slate-400">${escapeHtml(item.effect)}</div>` : ''}
          ${usable ? '<div class="pt-1 text-[10px] font-bold text-brand-gold">帶入行動 →</div>' : ''}
        `;
        if (usable) card.addEventListener('click', () => prepareIntelAction(item.id));
        dom.intelLedgerList.appendChild(card);
      });
    }
  }
}

function restoreSavedStateFromStorage() {
  try {
    const savedState = localStorage.getItem('undercurrent_current_save_state');
    const savedChapters = localStorage.getItem('undercurrent_full_story_chapters');
    // 章節列表若遺失（配額清除等），仍必須恢復 saveState，否則玩家會誤以為整局進度不見了。
    if (savedState) {
      state.saveState = JSON.parse(savedState);
      ensureIntelLedger(state.saveState);
      state.playerProfile = state.saveState?.meta?.playerProfile || null;
    }
    if (savedChapters) {
      const parsedChapters = JSON.parse(savedChapters);
      if (Array.isArray(parsedChapters) && parsedChapters.length > 0) {
        state.chapterHistoryList = compactChaptersForMemory(parsedChapters);
        state.chapterData = state.chapterHistoryList[state.chapterHistoryList.length - 1];
      }
    }
  } catch (e) {
    console.warn('Failed to restore saved state from storage:', e);
  }
}

function saveGameStateToSlot(slotId) {
  if (!state.saveState) return;
  safeLocalStorageSet(`undercurrent_save_slot_${slotId}`, JSON.stringify({
    saveState: state.saveState,
    chapterData: state.chapterData,
    chapterHistoryList: chapterWindow(state.chapterHistoryList),
    savedAt: new Date().toISOString()
  }));
}

async function handleRegenerateTurn() {
  if (state.isGenerating) return notifyUser('劇情正在生成，請稍候。');
  const turnCount = state.saveState?.turnCount || 1;
  
  if (turnCount <= 1 || !state.lastChoicePayload) {
    setGenerationBusy(true);
    state.generationAbortRequested = false;
    // 重新演繹第 1 回開局
    const profile = getActivePlayerProfile();
    showLoading('選項確認中……', '正在重新演算並構思第 1 回開局情節……');
    try {
      await preparePersonaForTurn(profile, profile.customScenario || '故事開場', '', 1);
      const { systemPrompt, userPrompt } = buildFirstTurnPrompt(profile);
      // 先渲染空白卡片，立即隱藏 loading
      hideLoading();
      const regenTemp = { act: 1, turn: 1, chosenLabel: '【重新生成】', prose: '', statusPanel: null, choices: [] };
      renderStoryStream(regenTemp);
      const rProseEl = document.getElementById('stream-prose-content');
      if (rProseEl) rProseEl.innerHTML = '<p class="mb-6 indent-6 sm:indent-8 animate-pulse text-brand-gold/80">重新推演命運中……</p>';
      let rFirstToken = true, rDidStream = false;
      let regeneratedChapter = await generateStoryFromLLM(systemPrompt, userPrompt, (streamedProse) => {
        rDidStream = true;
        if (rProseEl) {
          if (rFirstToken) { rProseEl.innerHTML = ''; rFirstToken = false; }
          rProseEl.innerHTML = buildProseHtml(streamedProse);
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
      });
      if (rDidStream) regeneratedChapter.skipTypewriter = true;
      const auditedRegeneratedChapter = auditGeneratedChapter(regeneratedChapter, profile, state.chapterHistoryList.slice(0, -1));
      regeneratedChapter = auditedRegeneratedChapter;
      regeneratedChapter.act = 1;
      regeneratedChapter.turn = 1;
      regeneratedChapter.chosenLabel = '【正式開局】';
      const baseline = state.saveState?.meta?.initialStateBaseline;
      if (baseline) {
        state.saveState.protagonist = Object.assign({}, state.saveState.protagonist || {}, baseline.protagonist || {});
        state.saveState.relationships = JSON.parse(JSON.stringify(baseline.relationships || {}));
        state.saveState.inventory = JSON.parse(JSON.stringify(baseline.inventory || []));
        state.saveState.intelLedger = JSON.parse(JSON.stringify(baseline.intelLedger || []));
        state.saveState.questFlags = JSON.parse(JSON.stringify(baseline.questFlags || {}));
        state.saveState.status = {};
      }
      applyChapterStateChanges(regeneratedChapter, profile, 1);
      safeLocalStorageSet('undercurrent_current_save_state', JSON.stringify(state.saveState));
      regeneratedChapter.stateSnapshot = JSON.parse(JSON.stringify(state.saveState || {}));
      delete regeneratedChapter.stateSnapshot.memoryBank;
      state.chapterData = regeneratedChapter;
      state.chapterHistoryList = [regeneratedChapter];
      rememberChapter(regeneratedChapter);
      persistChapterHistory(state.chapterHistoryList);
      renderStoryStream(regeneratedChapter);
      renderSaveState();
      saveGameStateToSlot('1');
      syncStateToGoogleDriveCloud(state.saveState, regeneratedChapter);
    } catch (err) {
      console.error('第 1 回重新生成失敗:', err);
      renderStoryStream(state.chapterData);
      renderSaveState();
      if (isGenerationAbortError(err)) notifyUser('已中止重新生成，原章節保持不變。', 'info');
      else showErrorRecovery('第 1 回重新生成逾時，請檢查網路連線或稍後再試。', { canRetry: false });
    } finally {
      hideLoading();
      setGenerationBusy(false);
    }
  } else {
    if (!restorePreviousTurnForRetry()) {
      notifyUser('找不到本回合的前一狀態，無法安全重新生成。', 'error', 5000);
      return;
    }
    makeChoice(state.lastChoicePayload.choiceId, state.lastChoicePayload.customInput, true);
  }
}

function restorePreviousTurnForRetry() {
  if (!state.previousStateSnapshot) return false;

  state.saveState = JSON.parse(JSON.stringify(state.previousStateSnapshot.saveState));
  state.chapterData = JSON.parse(JSON.stringify(state.previousStateSnapshot.chapterData));
  const restoredTurn = state.saveState?.turnCount || 1;
  while (state.chapterHistoryList.length > 1) {
    const lastTurn = state.chapterHistoryList[state.chapterHistoryList.length - 1]?.turn || 1;
    if (lastTurn <= restoredTurn) break;
    state.chapterHistoryList.pop();
  }
  safeLocalStorageSet('undercurrent_current_save_state', JSON.stringify(state.saveState));
  persistChapterHistory(state.chapterHistoryList);
  return true;
}

function handleUndoTurn() {
  if (state.isGenerating) return notifyUser('生成進行中，請先完成或中止本回。', 'info');
  if (restorePreviousTurnForRetry()) {
    state.previousStateSnapshot = null;
    state.lastChoicePayload = null;
    renderStoryStream(state.chapterData);
    renderSaveState();
    updateGameplayBreadcrumb();
    notifyUser('已回退至上一回合，可重新選擇。', 'success');
  } else {
    notifyUser('已無更早的回合可回退。', 'info');
  }
}

function handleRetryLastTurn() {
  if (state.isGenerating) return notifyUser('生成進行中，請先完成或中止本回。', 'info');
  if (state.lastChoicePayload) {
    if (!restorePreviousTurnForRetry()) return;
    makeChoice(state.lastChoicePayload.choiceId, state.lastChoicePayload.customInput, true);
  }
}

function handleEditLastAction() {
  if (state.isGenerating) return notifyUser('劇情正在生成，請稍候。');
  if (!state.lastChoicePayload || !state.previousStateSnapshot) {
    return notifyUser('目前沒有可安全改寫的上一個行動。', 'info');
  }
  const original = state.lastChoicePayload.customInput
    || (state.chapterData?.chosenLabel && state.chapterData.chosenLabel !== '【正式開局】' ? state.chapterData.chosenLabel : '');
  if (!restorePreviousTurnForRetry()) return notifyUser('找不到上一回合快照。', 'error');
  renderStoryStream(state.chapterData);
  renderSaveState();
  updateGameplayBreadcrumb();
  if (dom.customActionInput) {
    dom.customActionInput.value = String(original || '').replace(/^\s*[\[［][A-Za-z][\]］]\s*/, '');
    dom.customActionInput.dataset.choiceId = state.lastChoicePayload.choiceId || 'CUSTOM';
    autoGrowActionInput();
    dom.customActionInput.focus();
    dom.customActionInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  notifyUser('已回到上一回合並帶入原行動；修改後按「執行行動」即可重新演繹。', 'success', 5200);
}

function showStreamingAbortControl() {
  const fab = document.getElementById('abort-streaming-fab');
  if (fab) { fab.classList.remove('hidden'); fab.classList.add('flex'); }
}

function hideStreamingAbortControl() {
  const fab = document.getElementById('abort-streaming-fab');
  if (fab) { fab.classList.add('hidden'); fab.classList.remove('flex'); }
}

function handleAbortGeneration() {
  state.generationAbortRequested = true;
  sendTelemetryError('USER_ABORT', '玩家主動中止生成', { duration: state.loadingSeconds || 0 });
  if (state.currentAbortController) {
    state.currentAbortController.abort();
    state.currentAbortController = null;
  }
  setGenerationBusy(false);
  hideLoading();
  notifyUser('已中止本次生成。', 'info');
}

async function handleActRebase() {
  if (state.isGenerating) return notifyUser('目前有劇情正在生成，請完成後再整理故事記憶。');
  const rebaseOk = await confirmDialog(
    '系統會整理本幕的重要情節，讓下一幕維持連貫。\n數值、好感度、道具與原始正文都會保留。',
    { title: '整理故事記憶', confirmText: '開始整理' }
  );
  if (!rebaseOk) return;
  if (!state.saveState) return notifyUser('目前尚無可重整的遊戲進度。', 'error');

  const actNumber = state.saveState.meta.currentAct || 1;
  const recent = (state.chapterHistoryList || []).slice(-8);
  // 本機濃縮版：Worker 無法使用時的退路，也是 AI 版失敗時的保底
  const localDossier = [
    `# 第 ${actNumber} 幕幕篇檔案（本機濃縮）`,
    clampBlock(state.saveState.summaryPool || '尚無長期摘要。', 1200),
    '## 幕末銜接',
    recent.map(ch => `- ${formatActTurn(ch.act, ch.turn)} ${displayChapterTitle(ch, '')}：${ch.turnSummary || String(ch.prose || '').slice(0, 160)}`).join('\n')
  ].join('\n\n');

  showLoading('正在整理故事記憶……', '系統會保留人物關係、數值、物品與重要情節。');
  setGenerationBusy(true);
  let dossier = localDossier;
  try {
    // 改走 Worker：GAS 的 novel/rebase 內部用的是舊供應商的模型 ID，在 OpenRouter 上不存在
    const timeline = (state.chapterHistoryList || [])
      .map(ch => ch.turnSummary ? `第 ${ch.turn} 回：${ch.turnSummary}` : '')
      .filter(Boolean).join('\n');
    const facts = getMemoryBank().filter(m => m.kind === 'fact')
      .slice(-60).map(m => `第 ${m.turn} 回：${m.text}`).join('\n');
    const tail = recent.map(ch => `── ${formatActTurn(ch.act, ch.turn)} ${displayChapterTitle(ch, '')} ──\n${clampBlock(ch.prose, 900)}`).join('\n');
    const raw = await requestWorkerCompletion({
      model: LLM_CONFIG.SUMMARY_MODEL,
      system: '你是長篇小說的編輯，負責在換幕時撰寫「幕篇檔案」，讓下一幕能無縫承接。使用台灣繁體中文，只輸出檔案內容。'
        + '依序寫四段：一、本幕主線（發生了什麼、因果）；二、人物關係與立場的變化；三、已確立且不可推翻的事實（承諾、物品去向、身分秘密）；'
        + '四、懸而未決的線索與下一幕的起點。寫清楚人名，不寫評論與形容，總長 800–1,200 字。' + TW_PLAIN_STYLE_RULE,
      user: `【第 ${actNumber} 幕】\n\n--- 摘要池 ---\n${state.saveState.summaryPool || '（無）'}\n\n`
        + (timeline ? `--- 逐回摘要 ---\n${timeline}\n\n` : '')
        + (facts ? `--- 已確立的事實 ---\n${facts}\n\n` : '')
        + `--- 幕末最近幾回 ---\n${tail}`,
      maxTokens: 2500,
      temperature: 0.3,
      timeoutMs: 120000
    });
    if (raw && raw.length > 200) dossier = `# 第 ${actNumber} 幕幕篇檔案\n\n${polishTaiwaneseText(raw)}`;
    else console.warn('[Act Rebase] AI 幕篇檔案過短，改用本機濃縮版。');
  } catch (err) {
    console.warn('[Act Rebase] AI 幕篇檔案失敗，改用本機濃縮版：', err.message);
  }

  try {
    state.saveState.actDossiers = (Array.isArray(state.saveState.actDossiers) ? state.saveState.actDossiers : [])
      .concat(dossier).slice(-6);
    state.saveState.meta.currentAct = actNumber + 1;
    state.saveState.meta.contextResetTurn = Math.max(1, Number(state.saveState.turnCount) || 1);
    state.saveState.summaryPool = `【第 ${actNumber} 幕已完結並重整】${clampBlock(state.saveState.summaryPool, 4500)}`;
    safeLocalStorageSet('undercurrent_current_save_state', JSON.stringify(state.saveState));
    syncStateToGoogleDriveCloud(state.saveState, state.chapterData);
    updateGameplayBreadcrumb();
    renderSaveState();
    notifyUser('故事記憶整理完成，已進入第 ' + state.saveState.meta.currentAct + ' 幕。', 'success', 5000);
  } finally {
    hideLoading();
    setGenerationBusy(false);
  }
}

function startServerCooldown(seconds) {
  const statusText = document.getElementById('server-status-text');
  // B3: 原本右側顯示的是「RPM: 5/min」這種內部指標，對玩家沒有意義；
  // 改成直接告訴玩家還要等幾秒才能送下一回。
  const cooldownEls = Array.from(document.querySelectorAll('#server-cooldown-text'));

  let remaining = seconds || 10;
  const paint = () => {
    if (statusText) {
      statusText.textContent = remaining > 0
        ? '正在等待下一個生成時段'
        : '故事引擎已就緒';
    }
    cooldownEls.forEach(el => {
      el.textContent = remaining > 0 ? `約 ${remaining} 秒` : '可立即操作';
      el.className = remaining > 0
        ? 'text-[11px] font-mono text-amber-400'
        : 'text-[11px] font-mono text-slate-500';
    });
  };
  paint();

  if (state.cooldownInterval) clearInterval(state.cooldownInterval);
  state.cooldownInterval = setInterval(() => {
    remaining--;
    paint();
    if (remaining <= 0) {
      clearInterval(state.cooldownInterval);
      state.cooldownInterval = null;
    }
  }, 1000);
}

let loadingTimer = null;
const LOADING_TIMER_REVEAL_MS = 15000; // 超過這個時間才顯示已等待秒數

const LOADING_PHASES = {
  preparing: { label: '準備故事', title: '正在整理本回脈絡……', progress: 12, step: '' },
  queue: { label: '順位已保留', title: '正在等待故事生成順位……', progress: 24, step: 'queue' },
  writing: { label: '故事撰寫中', title: '故事引擎正在落筆……', progress: 48, step: 'writing' },
  streaming: { label: '內容回傳中', title: '本回故事正在成形……', progress: 72, step: 'writing' },
  polishing: { label: '內容整理中', title: '正在檢查章節與選項……', progress: 90, step: 'polishing' },
  saving: { label: '保存進度', title: '正在保存這一回……', progress: 98, step: 'saving' }
};

function setLoadingPhase(phase, detail) {
  const config = LOADING_PHASES[phase] || LOADING_PHASES.preparing;
  state.loadingPhase = phase;
  if (dom.loadingPhaseText) dom.loadingPhaseText.textContent = config.label;
  if (dom.loadingText) dom.loadingText.textContent = config.title;
  if (detail && dom.loadingSubtext) dom.loadingSubtext.textContent = detail;
  if (dom.loadingProgressBar) dom.loadingProgressBar.style.width = `${config.progress}%`;
  document.querySelectorAll('[data-loading-step]').forEach(el => {
    const active = el.dataset.loadingStep === config.step;
    el.classList.toggle('bg-amber-900/50', active);
    el.classList.toggle('text-amber-200', active);
    el.classList.toggle('border', active);
    el.classList.toggle('border-amber-700/50', active);
    el.classList.toggle('bg-slate-800', !active);
    el.classList.toggle('text-slate-500', !active);
  });
  if (dom.generationDockTitle) dom.generationDockTitle.textContent = config.title.replace(/……$/, '');
  if (dom.generationDockMeta) {
    dom.generationDockMeta.textContent = detail || '生成會在背景繼續，可安心閱讀前文。';
  }
}

function minimizeGenerationOverlay() {
  if (!state.isGenerating || !dom.loadingOverlay) return;
  dom.loadingOverlay.style.display = 'none';
  if (dom.generationStatusDock) dom.generationStatusDock.style.display = 'flex';
}

function restoreGenerationOverlay() {
  if (!state.isGenerating || !dom.loadingOverlay) return;
  dom.loadingOverlay.style.display = 'flex';
  if (dom.generationStatusDock) dom.generationStatusDock.style.display = 'none';
}

function showLoading(initialText, initialSubtext) {
  if (!dom.loadingOverlay) return;
  dom.loadingOverlay.style.display = 'flex';
  if (dom.generationStatusDock) dom.generationStatusDock.style.display = 'none';
  setLoadingPhase('preparing', initialSubtext || initialText || '正在整理人物、場景與上一回的重要線索。');

  // D1: 計時器原本每秒累加卻從不顯示，且 state.loadingSeconds 從未被設定，
  // 遙測的等待時間永遠回報 0。現在維持氣氛（15 秒內不顯示），超時才淡入。
  state.loadingSeconds = 0;
  const timerBadge = document.getElementById('loading-timer-badge');
  if (timerBadge) {
    timerBadge.textContent = '';
    timerBadge.classList.add('opacity-0');
  }

  if (loadingTimer) clearInterval(loadingTimer);
  loadingTimer = setInterval(() => {
    state.loadingSeconds++;
    if (timerBadge && state.loadingSeconds * 1000 >= LOADING_TIMER_REVEAL_MS) {
      timerBadge.textContent = `已等待 ${state.loadingSeconds} 秒`;
      timerBadge.classList.remove('opacity-0');
    }
    if (dom.generationDockMeta && dom.generationStatusDock?.style.display === 'flex') {
      dom.generationDockMeta.textContent = `已等待 ${state.loadingSeconds} 秒 · 可繼續閱讀前文`;
    }
  }, 1000);
}

function hideLoading() {
  if (loadingTimer) {
    clearInterval(loadingTimer);
    loadingTimer = null;
  }
  if (dom.loadingOverlay) {
    dom.loadingOverlay.style.display = 'none';
  }
  if (dom.generationStatusDock) dom.generationStatusDock.style.display = 'none';
  state.currentAbortController = null;
}


if (typeof window !== 'undefined') {
  window.OFFICIAL_DRIVE_CHARACTERS = OFFICIAL_DRIVE_CHARACTERS;
  window.NARRATIVE_MODELS = NARRATIVE_MODELS;
  window.state = state;
  window.DEFAULT_PRESETS = DEFAULT_PRESETS;
  window.openCharacterCreationModal = openCharacterCreationModal;
  window.closeCharacterCreationModal = closeCharacterCreationModal;
  window.openSaveArchiveModal = openSaveArchiveModal;
  window.closeSaveArchiveModal = closeSaveArchiveModal;
  window.openProfileManagerModal = openProfileManagerModal;
  window.closeProfileManagerModal = closeProfileManagerModal;
  window.openDrawer = openDrawer;
  window.closeDrawer = closeDrawer;
  window.createNamedSave = createNamedSave;
  window.saveCurrentFormAsPreset = saveCurrentFormAsPreset;
  window.getKinshipAndSpecialTiesPrompt = getKinshipAndSpecialTiesPrompt;
  window.dismissError = dismissError;
  window.handleRetryLastTurn = handleRetryLastTurn;
  window.openFeedbackModal = openFeedbackModal;
  window.closeFeedbackModal = closeFeedbackModal;
  window.openGameGuideModal = openGameGuideModal;
  window.closeGameGuideModal = closeGameGuideModal;
  window.sendTelemetryError = sendTelemetryError;
  window.handleFeedbackSubmit = handleFeedbackSubmit;
  window.switchView = switchView;
  window.openStatusDrawer = openStatusDrawer;
  window.openMenuDrawer = openMenuDrawer;
  window.closeDrawer = closeDrawer;
  window.openChapterNav = openChapterNav;
  window.closeChapterNav = closeChapterNav;
  window.showDialog = showDialog;
  window.showErrorRecovery = showErrorRecovery;
  window.handleReloadLore = handleReloadLore;
  window.clearLoreCache = clearLoreCache;
  window.fetchCharacterLore = fetchCharacterLore;
}


/**
 * 顯示生成失敗的救援橫幅。
 * 這個橫幅（含「重試此回」與「一鍵回報問題」）原本就寫在 index.html 裡，
 * 但整份程式只有隱藏它、從來沒有任何一行顯示它 —— 玩家只會看到一個
 * 按掉就沒了的原生 alert，拿不到任何重試或回報入口。
 * @param {string} message 顯示給玩家的失敗原因
 * @param {{canRetry?: boolean}} options canRetry 為 false 時隱藏「重試此回」
 */
function showErrorRecovery(message, options = {}) {
  const { canRetry = true } = options;
  const banner = document.getElementById('error-recovery-banner');
  const textEl = document.getElementById('error-message-text');
  const retryBtn = document.getElementById('retry-turn-btn');
  if (textEl) textEl.textContent = message || '生成請求超時或中斷。';
  if (retryBtn) {
    const retryable = canRetry && !!state.lastChoicePayload;
    retryBtn.style.display = retryable ? 'inline-flex' : 'none';
  }
  if (banner) {
    banner.style.display = 'flex';
    if (typeof banner.scrollIntoView === 'function') {
      banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
}

/**
 * 生成連續失敗後，把「當下發生什麼事」直接填進回饋表單送交作者信箱。
 * 玩家在這個當下最不想做的事就是自己描述錯誤，所以模式、模型鏈、回合數
 * 與失敗訊息全部由程式帶入，玩家只要按送出。
 */
function reportGenerationFailure() {
  const modeKey = resolveGenerationMode();
  const modeCfg = getModeConfig(modeKey);
  const failureText = document.getElementById('error-message-text')?.textContent || '（未取得失敗訊息）';
  const lines = [
    '【自動帶入：生成失敗回報】',
    `生成模式：${modeCfg.label}（${modeKey}）`,
    `模型鏈：${buildAttemptPlan(modeKey).join(' → ')}`,
    `回合數：${state.chapterHistoryList?.length ?? '未知'}`,
    `失敗訊息：${failureText}`,
    `發生時間：${new Date().toISOString()}`,
    '',
    '（可在此補充當時的操作或期待的劇情走向）'
  ];
  openFeedbackModal({
    category: 'Bug / 系統異常報錯',
    content: lines.join('\n')
  });
}

function dismissError() {
  const banner = document.getElementById('error-recovery-banner');
  if (banner) banner.style.display = 'none';
}


// =========================================================================
// 10. 系統遙測日誌與意見回饋管理 (Telemetry & Feedback Engine)
// =========================================================================

/**
 * 非同步傳送系統異常日誌至 Google Drive 試算表與管理員 Email
 */
const TELEMETRY_DEDUP_WINDOW_MS = 5 * 60 * 1000; // 同一類錯誤 5 分鐘內只上報一次
const TELEMETRY_MAX_PER_SESSION = 10;
const telemetrySentAt = new Map();
let telemetrySentCount = 0;

async function sendTelemetryError(category, message, details = {}) {
  try {
    // 後端每筆日誌都會寄一封 MailApp 通知（每日配額 100 封）。
    // 若不節流，模型全數失敗時的重試迴圈會在幾分鐘內打爆配額。
    const dedupKey = (category || 'GENERAL_ERROR') + '|' + String(message || '').slice(0, 120);
    const now = Date.now();
    const lastSent = telemetrySentAt.get(dedupKey);
    if (lastSent && now - lastSent < TELEMETRY_DEDUP_WINDOW_MS) {
      console.warn('[Telemetry] 略過重複回報（' + dedupKey + '）');
      return;
    }
    if (telemetrySentCount >= TELEMETRY_MAX_PER_SESSION) {
      console.warn('[Telemetry] 本次工作階段回報數已達上限，後續錯誤僅記錄於主控台。');
      return;
    }
    telemetrySentAt.set(dedupKey, now);
    telemetrySentCount++;

    const payload = {
      action: 'telemetry/log-error',
      category: category || 'GENERAL_ERROR',
      message: String(message || '未知錯誤'),
      model: LLM_CONFIG.PRIMARY_MODEL || 'gemini-3.8-flash',
      userId: state.username || state.userId || localStorage.getItem('undercurrent_user_name') || 'guest',
      act: state.saveState?.meta?.currentAct || 1,
      turn: state.saveState?.turnCount || 1,
      targetLead: state.saveState?.meta?.targetLeadName || '未指定',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Node/Test',
      details: details
    };

    console.warn('[Telemetry Alert]', payload);

    // 只使用當前部署的 API 端點；先前硬編在此的舊部署 URL 已失效，會把日誌送進黑洞。
    const gasUrl = (typeof state !== 'undefined' && state.gasApiUrl) || '';
    if (gasUrl) {
      fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        redirect: 'follow'
      }).then(res => res.json()).then(data => {
        if (data.success) {
          console.log('[Telemetry] Error logged to cloud successfully.');
        } else {
          console.warn('[Telemetry] Cloud logging returned error:', data.error);
        }
      }).catch(err => console.warn('[Telemetry Sync Ignored]', err));
    }
  } catch (err) {
    console.warn('[Telemetry Failed]', err);
  }
}

/**
 * 開啟意見回饋彈窗
 */
function openFeedbackModal(prefilledData = {}) {
  const modal = openOverlay('feedback-modal', { focusSelector: '#feedback-content' });
  if (!modal) return;

  const categorySel = document.getElementById('feedback-category');
  const contentArea = document.getElementById('feedback-content');
  const contactInput = document.getElementById('feedback-contact');

  if (categorySel && prefilledData.category) {
    categorySel.value = prefilledData.category;
  }
  if (contentArea && prefilledData.content) {
    contentArea.value = prefilledData.content;
  }
  if (contactInput && !contactInput.value) {
    contactInput.value = state.username || localStorage.getItem('undercurrent_user_name') || '';
  }
}

/**
 * 關閉意見回饋彈窗
 */
function closeFeedbackModal() {
  closeOverlay('feedback-modal');
}

/**
 * 處理玩家提交意見回饋
 */
async function handleFeedbackSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();

  const category = document.getElementById('feedback-category')?.value || '整體遊玩心得 / 其他';
  const content = document.getElementById('feedback-content')?.value.trim();
  const contact = document.getElementById('feedback-contact')?.value.trim() || state.username || '匿名玩家';
  const attachDiag = document.getElementById('feedback-attach-diagnostics')?.checked !== false;

  let rating = '5星 (極致沉浸)';
  const checkedRating = document.querySelector('input[name="feedback-rating"]:checked');
  if (checkedRating) rating = checkedRating.value;

  if (!content) {
    return notifyUser('請填寫具體回饋內容後再送出。', 'error');
  }

  const submitBtn = document.getElementById('submit-feedback-btn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = '傳送中……';
  }

  const diagnostics = attachDiag ? {
    act: state.saveState?.meta?.currentAct || 1,
    turn: state.saveState?.turnCount || 1,
    targetLead: state.saveState?.meta?.targetLeadName || '未指定',
    playerProfile: state.saveState?.meta?.playerProfile || null,
    model: LLM_CONFIG.PRIMARY_MODEL || 'gemini-3.8-flash',
    status: state.saveState?.protagonist || null
  } : null;

  const payload = {
    action: 'telemetry/submit-feedback',
    category: category,
    rating: rating,
    content: content,
    contact: contact,
    act: state.saveState?.meta?.currentAct || 1,
    turn: state.saveState?.turnCount || 1,
    targetLead: state.saveState?.meta?.targetLeadName || '未指定',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Node/Test',
    diagnostics: diagnostics
  };

  try {
    const gasUrl = (typeof state !== 'undefined' && state.gasApiUrl) || 'https://script.google.com/macros/s/AKfycbwjdNrRMUveqcxhN2K9Okz8afuBmKrziHnj9Zr5EnoCaX2dlXifACHppa2iJuNRFc0CxQ/exec';
    if (gasUrl) {
      const res = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        redirect: 'follow'
      });
      const data = await res.json();
      if (data.success) {
        notifyUser('感謝您的回饋，意見已同步至開發團隊。', 'success', 5000);
      } else {
        notifyUser('回饋提交失敗：' + (data.error?.message || '伺服器回應異常，請稍後再試。'), 'error', 5000);
      }
    } else {
      notifyUser('系統尚未配置雲端端點，回饋已記錄於本機。', 'info', 5000);
    }
    closeFeedbackModal();
    const contentArea = document.getElementById('feedback-content');
    if (contentArea) contentArea.value = '';
  } catch (err) {
    console.error('Submit feedback error:', err);
    notifyUser('回饋提交失敗：無法連線至雲端伺服器。', 'error', 5000);
    closeFeedbackModal();
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `${uiIcon('send')}<span>送出回饋通知</span>`;
    }
  }
}


if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    sendTelemetryError('UNCAUGHT_JS_EXCEPTION', e.message, { filename: e.filename, lineno: e.lineno, colno: e.colno, stack: e.error?.stack });
  });
  window.addEventListener('unhandledrejection', (e) => {
    sendTelemetryError('UNHANDLED_PROMISE_REJECTION', e.reason?.message || String(e.reason), { stack: e.reason?.stack });
  });
}
