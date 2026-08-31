function getKinshipAndSpecialTiesPrompt(playerProfile, primaryLeadKey, activeNPCs = []) {
  let ties = [];
  const profileName = (playerProfile?.name || '').trim();
  const leadKeys = [primaryLeadKey, ...activeNPCs].filter(Boolean);

  // 1. 楊慕璃 (女主) × 楊紹宸 (二哥) 核心豪門羈絆
  const isPlayerMuLi = profileName.includes('楊慕璃') || profileName.includes('慕璃');
  const hasShaoChen = leadKeys.some(k => String(k).includes('楊紹宸') || String(k).includes('04_'));

  if (isPlayerMuLi && hasShaoChen) {
    ties.push(`【🔥 絕對不可撼動之血緣與既定羈絆防火牆：楊慕璃 × 楊紹宸】
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
    ties.push(`【🔥 既定親屬關係：徐令謙 × 徐宇寧】
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
 * 1. 🚀 純 AI 即時零範本生成架構（大模型現場實時創作長篇小說與分支選項）
 * 2. 👑 100% 同步 Google Drive 官方 13 位男主人物設定檔案
 * 3. 📝 完整人物與劇情設定庫 (Profile Manager)：支援編輯、重新命名、刪除、匯出匯入與一鍵開局
 * 4. 💾 完整存檔庫 (Save Archives)：支援自訂命名、搜尋、重新命名、刪除、跨設備匯出匯入
 * 5. 📱 App 風格頂部返回導航列、歷史章節瀑布流、打字機動畫與微醺/張力即時面板
 */

// 官方 13 位男主資料庫
const OFFICIAL_DRIVE_CHARACTERS = {
  "01_徐令謙": {
    "key": "01_徐令謙",
    "name": "徐令謙",
    "fullName": "徐令謙（徐顧問 · 謙哥）",
    "age": "35歲",
    "title": "玄辰幫二把手 · 天裕會首領 · 德行事務所最高顧問",
    "mbti": "INTJ（太陰坐命 / 天蠍座）",
    "cars": "私人車：坦桑石藍 BMW X6 M60i；公務車：深銀灰色 BMW M760i xDrive（天裕會三玉隊駕駛）",
    "watch": "Omega De Ville Prestige 41 mm 黃金皮帶腕錶；復古圓眼鏡（工作與正式場合佩戴）",
    "residence": "台北市士林區天母一帶（低調靜謐宅邸）",
    "perfume": "冷冽雪松、微苦煙草與高山茶香",
    "identityRole": "亞洲前三大黑幫「玄辰幫」二把手暨中樞堂口「天裕會」首領，黑白兩道地下秩序真正操盤人。【絕對身分防火牆】：冷靜自持的秩序操盤者，【絕對不是檢察官或法官】！",
    "personality": "冷靜、自持、紳士，喜怒不形於色卻充滿份量與吸引力。不油條、不浮誇、不逞兇鬥狠；對有興趣的女性維持風度、尊重自主，以克制形成張力。愛到深處極其專一深情，給她自由並默默備妥保險、退路與守護，力量永遠朝向外部風險而非她。",
    "speechExamples": [
      "「妳可以拒絕。我只希望妳知道全部代價後，再做決定。」",
      "「去做妳想做的事，剩下的我來安排。」",
      "「妳不欠我。幫妳，是我的選擇。」",
      "「我不攔妳，但我會確保妳平安回來。」"
    ]
  },
  "02_韓正寰": {
    "key": "02_韓正寰",
    "name": "韓正寰",
    "fullName": "韓正寰（韓主任 · 白日判官）",
    "age": "35歲",
    "title": "士林地檢署重大刑案專組主任檢察官 · 白日判官（全劇唯一檢察官）",
    "mbti": "ISTJ（紫微破軍 / 摩羯座）",
    "cars": "公私皆用白色 Škoda Enyaq Coupe（低調嚴謹、不收受任何財閥配車）",
    "watch": "Seiko Presage 無釉有田燒限量工藝錶；Cerruti 1881 黑色皮帶；【無配戴眼鏡】",
    "residence": "台北市大安區（極簡無多餘雜物的單身公寓）",
    "perfume": "乾淨皂香、薄荷與法袍剛熨燙過的味道",
    "identityRole": "士林地檢署重大刑案專組主任檢察官，司法界正義最後一道防線。【絕對身分防火牆】：【全劇唯一主任檢察官】，代表國家司法公權力，【絕對不是警察、律師或黑道】！",
    "personality": "鋼鐵原則、油鹽不進、不畏強權。私下壓抑內斂，情慾極度深沉克制，動情時兼具司法審問般的壓迫感與近乎奉獻的偏執保護慾。",
    "speechExamples": [
      "「在我的偵查庭裡，只有證據和偽證，沒有灰色地帶。」",
      "「妳現在的每一句喘息，都在我的筆錄監控之下。」",
      "「把手放上來。回答我，看著我說實話。」",
      "「如果這是一場罪，我會親手將妳逮捕，然後陪妳服刑。」"
    ]
  },
  "03_邵翊衡": {
    "key": "03_邵翊衡",
    "name": "邵翊衡",
    "fullName": "邵翊衡（邵顧問）",
    "age": "37歲",
    "title": "昱合策略創辦人暨執行長 · 政媒幕後操盤者 · 頂級輿情顧問 · 智庫政策顧問",
    "mbti": "INTJ（七殺坐命 / 天蠍座）",
    "cars": "私人車：黑曜金屬色 Porsche 911 Carrera 4 GTS；公務車：黑色 Audi A8（智庫配車，前國防部隨扈駕駛）",
    "watch": "Jaeger-LeCoultre 超薄大師系列腕錶；【配戴暗銀色細方框眼鏡】",
    "residence": "台北市松山區敦化北路巷內頂樓 Penthouse；其他房產：內湖山上獨棟別墅",
    "perfume": "沉穩木質調；喜好無糖黑咖啡與 Macallan Enigma / Hibiki 21",
    "identityRole": "政商黑白兩道頂級輿情顧問與危機處理操盤手。表面是風度翩翩的策士，實為操弄人心、控制風向的無聲支配者。",
    "personality": "溫文優雅、少見情緒波動，高度自律壓抑冷靜，用斯文禮貌包裝疏離。親密關係中溫柔緩慢具詩意，擅長引導對方主動臣服（「我碰妳不是因為妳濕，是因為妳沒說不行」）。",
    "speechExamples": [
      "「我們不是來找共識的，是來決定——誰的立場更禁得起時間檢驗。」",
      "「你可以不接受，但這不是選項，是現實。」",
      "「我會讓妳自由，但不是放手，是因為我知道妳會回來。」",
      "「把腿張開。這不是命令，是邀請。」"
    ]
  },
  "04_楊紹宸": {
    "key": "04_楊紹宸",
    "name": "楊紹宸",
    "fullName": "楊紹宸（楊副總 · 二哥）",
    "age": "28歲",
    "title": "弘楊集團副總 · 執行董事 · 物流貿易事業群總經理",
    "mbti": "INTP（天機坐命，對宮太陰 / 處女座）",
    "cars": "私人車：鐵灰色 Audi RS7；公務車：黑色 Benz S680 配專屬司機（絕非邁巴赫）",
    "watch": "Blancpain Air Command 飛行員腕錶；【無配戴眼鏡】",
    "residence": "台北市士林區陽明山腰楊家大宅（與慕璃同住）；私人秘密公寓位於大直",
    "perfume": "冷冽柑橘、杜松子與高級皮革香",
    "identityRole": "弘楊集團副總裁、執行董事兼物流貿易總經理（【職銜：副總/二哥，絕非少東】），楊家次子，楊慕璃二哥。商場狠辣決絕、行事雷厲風行。",
    "personality": "表面毒舌刻薄、挑剔難搞，實則對慕璃護短至極。極致的智力優越感，情慾佔有慾極度熾烈強勢，擅長用言語羞辱推拉掩飾深沉慾望。",
    "speechExamples": [
      "「楊慕璃，妳是不是忘了整個弘楊的物流網是誰在掌控的？」",
      "「過來，別讓我說第二次。」",
      "「妳以為躲到別的男人身後，我就拿妳沒辦法了嗎？」",
      "「不要急著下判斷，風向永遠比事實快一步。」",
      "「別說妳沒準備好，妳現在連呼吸都在等我。」"
    ]
  },
  "05_徐宇寧": {
    "key": "05_徐宇寧",
    "name": "徐宇寧",
    "fullName": "徐宇寧（徐院長 · 宇寧）",
    "age": "28歲",
    "title": "明隱牙醫診所院長 · 專職牙醫師 · 全國空氣手槍射擊高手",
    "mbti": "ISFP（太陰坐命 / 天秤座）",
    "cars": "淺灰藍色 Volvo XC60（低調沈穩高安全，車上常備手工香氛噴霧）",
    "watch": "Nomos Glashütte Tangente Neomatik 39 Midnight Blue；【無配戴眼鏡！單眼皮笑起來眼尾微彎】",
    "residence": "台北市大安區永康街一帶靜巷公寓（出身松山區）",
    "perfume": "Diptyque Philosykos（無花果木）與 Jo Malone 苦橙葉",
    "identityRole": "自營《明隱牙醫》診所院長兼主治牙醫師，徐令謙遠房堂弟，徐令謙、楊紹宸、沈湛然的牙醫，楊紹宸薇閣中學六年同窗。【絕對身分防火牆】：【專職牙醫師】，【絕非全科醫生/內科外科/密醫，嚴禁提醫藥箱出外急救量血壓】！【絕非白袍掌控狂，無戴眼鏡，穿著淺灰深藍制服或私服亞麻襯衫】！",
    "personality": "冷靜自在、放鬆很 Chill、情緒穩定、爽朗陽光、溫柔細膩、氣質出眾。非常幽默且帶點調皮，撩人無形型＋情慾技巧型。擅長觀察情緒，在潛移默化中建立親密感。",
    "speechExamples": [
      "「放鬆，牙齒咬合稍微合上一點點就好……對，妳做得很好。」",
      "「紹宸，你又忘記定期洗牙了？不過看你今天這火氣，牙齦應該在抗議了。」",
      "「我只是個牙醫，動刀救命找湛然，但要讓妳今晚心情放鬆，我這裡隨時有現磨手沖咖啡。」",
      "「別繃著臉了，笑一個嘛。眼尾彎起來的時候，妳比誰都好看。」"
    ]
  },
  "06_林政修": {
    "key": "06_林政修",
    "name": "林政修",
    "fullName": "林政修（林次 · 次長）",
    "age": "41歲",
    "title": "法務部政務次長（林次）",
    "mbti": "ESTJ / ENTJ（鹿港世家出身 / 處女座）",
    "cars": "曜石黑 Mercedes-Benz S-Class L 350d（公務配車）",
    "watch": "低調頂級瑞士機械錶；【無配戴眼鏡】",
    "residence": "台北市中正區高樓層華廈（老家彰化鹿港）",
    "perfume": "沉香、菸草、老墨水香氣",
    "identityRole": "法務部政務次長，人稱「林次」，政壇頂層權力核心掌舵者。舉手投足皆是國家機器級別的絕對權力壓迫感。",
    "personality": "沉穩威嚴、城府極深、喜怒不形於色。對體制與權力結構了若指掌，習慣在高位俯瞰獵物，以國家大局與制度力量進行無形降維打擊。",
    "speechExamples": [
      "「在體制面前，沒有人能真正置身事外。」",
      "「有些公文，簽下去就是一條人命；有些沈默，比判決更重。」",
      "「過來。在這個房間裡，妳只需要聽從我的裁決。」"
    ]
  },
  "07_沈湛然": {
    "key": "07_沈湛然",
    "name": "沈湛然",
    "fullName": "沈湛然（沈醫師 · 湛然）",
    "age": "36歲",
    "title": "台大醫院精神醫學部主治醫師 · 司法精神醫學權威（全劇唯一精神科主治醫師）",
    "mbti": "INFJ（巨蟹座）",
    "cars": "私人車：極光鈦 Lexus ES 300h（車齡七年，維護極佳，車內乾淨沈靜）",
    "watch": "Grand Seiko 經典機械錶；【無配戴眼鏡】",
    "residence": "台北市中山區行天宮站附近三房老公寓",
    "perfume": "雪松、乾淨棉麻與極淡白茶香",
    "identityRole": "台大醫院精神醫學部主治醫師、司法精神鑑定權威（全劇唯一合法大型醫學中心精神科醫師，【在台大醫院上班，無個人診所，非院長非外科】）。",
    "personality": "溫和內斂、極具共情力與洞察力。能一眼看穿人心深處的創傷與慾望，用最溫柔的言語進行精神層面的極限解構與救贖式愛撫。",
    "speechExamples": [
      "「妳現在的防衛機制，是在害怕我，還是在害怕看清妳自己？」",
      "「把眼睛閉上，感受心跳。在我這裡，妳不需要任何偽裝。」",
      "「痛是真實的，但不要怕，我會陪妳一起走過去。」"
    ]
  },
  "08_江瀚文": {
    "key": "08_江瀚文",
    "name": "江瀚文",
    "fullName": "江瀚文（江總 · Ethan哥）",
    "age": "36歲",
    "title": "鼎曜媒體集團執行長 · 娛樂影視帝國掌門人",
    "mbti": "ENTJ（獅子座）",
    "cars": "私人車：銀灰色 Aston Martin DBS；商務車：Benz Maybach",
    "watch": "Audemars Piguet 皇家橡樹離岸型；【無配戴眼鏡】",
    "residence": "台北市中山區大直挑高河景頂級公寓",
    "perfume": "Tom Ford 烏木與琥珀奢華調",
    "identityRole": "鼎曜媒體集團執行長，操縱全台娛樂媒體、公關風向與影視資源的頂級資本家。風流倜儻、極具魅力與審美品味。",
    "personality": "自信張揚、霸道而懂得享受生活。習慣用資本與資源作為籌碼，但在動真情時展現出無與倫比的寵溺與致命性張力。",
    "speechExamples": [
      "「在我的鏡頭與媒體下，妳想成為誰，就能成為誰。」",
      "「今晚的頭條留給別人，而妳，留給我。」",
      "「別跟我談合約，現在我想跟妳談談私人條款。」"
    ]
  },
  "09_吳衛廷": {
    "key": "09_吳衛廷",
    "name": "吳衛廷",
    "fullName": "吳衛廷（衛廷哥 · 吳委員）",
    "age": "42歲",
    "title": "最大在野黨立法委員（台北市舊城區/萬華）· 國會喬王",
    "mbti": "ESTP（萬華在地派系出身 / 白羊座）",
    "cars": "公務車：黑色 Toyota Alphard（極黑隔熱紙）；私人車：Mercedes-Benz E-Class Sedan",
    "watch": "Rolex Submariner 黑水鬼；【無配戴眼鏡】",
    "residence": "台北市萬華區地方透天厝頂樓加蓋",
    "perfume": "淡淡菸草味、薄荷爽身水與熱炒店的草莽男人味",
    "identityRole": "最大在野黨立法委員、立法院司法及法制委員會委員、國會喬王。【全劇唯一許可草莽粗話與台語交織的角色】。",
    "personality": "豪爽講義氣、接地氣、深諳基層人心與利益交換。看似粗獷實則心思縝密，對認定的人無條件護短、敢為其提刀擋槍。",
    "speechExamples": [
      "「幹，誰敢動妳一根寒毛，林北讓他走不出萬華！」",
      "「這條法案能不能過我說了算，但妳今晚要不要跟我走，妳自己選。」",
      "「少在那邊跟我咬文嚼字，老子要的就是妳這句話。」"
    ]
  },
  "10_徐承勳": {
    "key": "10_徐承勳",
    "name": "徐承勳",
    "fullName": "徐承勳（副總統 · 徐先生）",
    "age": "47歲",
    "title": "中華民國副總統 · 科技經濟巨擘 · 頂層掌權人",
    "mbti": "ENTJ（紫微天相 / 摩羯座）",
    "cars": "公務車：深黑色 Audi A8 L Security 防彈裝甲車；私人車：克爾巴阡灰 Jaguar F-Type COUPÉ R75",
    "watch": "朗格 A. Lange & Söhne Zeitwerk；【配戴極細鈦金屬無框眼鏡】",
    "residence": "台北市大安區仁愛路副總統官邸；信義區智慧頂級豪宅",
    "perfume": "高級檀香、冷冽雪茄與頂級白茶香",
    "identityRole": "中華民國副總統，國家權力最巔峰掌舵者之一，苗栗客家書香門第出身，兼具科技巨擘背景與政治最高手腕。",
    "personality": "極端理性、冷靜深沉、掌控全局的絕對上位者。外表溫文儒雅收斂鋒芒，實則是對自我與他人要求極端嚴苛的掌局者。",
    "speechExamples": [
      "「國家的秩序由我維護，而妳的安全，由我親自負責。」",
      "「有些棋子一旦落下，就沒有收回的餘地——包括妳我。」",
      "「到我身邊來。站在這裡，妳才能看清整個局勢。」"
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
    "watch": "百達翡麗 Patek Philippe 黃金腕錶；【無配戴眼鏡】",
    "residence": "台中市南屯區七期重劃區豪宅主宅",
    "perfume": "老沉香、高級威士忌與濃烈雪茄香",
    "identityRole": "榮南營造集團董事長，中台灣營造業教父，徐若宸之父。白手起家、霸道狠絕、氣場雄渾。",
    "personality": "說一不二的傳統威權大家長。重情重義但控制欲極強，信奉力量與實力，對看重的人給予頂級的庇護與沉重的壓迫感。",
    "speechExamples": [
      "「在中台灣這塊地上，只要我徐耀南點頭，就沒人敢搖頭。」",
      "「年輕人有野心是好事，但在我面前，先學會怎麼站穩。」",
      "「榮南的門檻很高，但只要妳跨進來，誰也動不了妳。」"
    ]
  },
  "12_徐若宸": {
    "key": "12_徐若宸",
    "name": "徐若宸",
    "fullName": "徐若宸（若宸 · 小徐總）",
    "age": "22歲",
    "title": "榮南營造家族長子 · 中興大學企業管理研究所研究生 · 營業部實習",
    "mbti": "ISFJ / ISTJ（金牛座）",
    "cars": "金屬莫蘭迪綠色 Volkswagen T-Roc（父親所贈）",
    "watch": "簡約知性腕錶；【明確無配戴眼鏡！雙眼皮大眼微帶鳳眼】",
    "residence": "台中市南屯區七期重劃區豪宅",
    "perfume": "清新柑橘、白麝香與剛洗淨的純棉襯衫香",
    "identityRole": "榮南營造家族長子，徐耀南之子，溫哥華私校/UBC畢業，現就讀中興企管所並在家族實習。",
    "personality": "斯文清瘦、乾淨知性、有家教且克制禮貌。在嚴格家教下長大，內心渴望掙脫父權束縛，動情時兼具少年純情與壓抑已久的叛逆執著。",
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
    "title": "亞洲頂級男團 HapSTer 門面主唱兼領舞",
    "mbti": "INFJ（太陽坐命 / 天秤座）",
    "cars": "保姆車：銀色 Benz V-Class；私用車：消光磁灰 Benz G500；收藏車：米白色 Volvo 1800S",
    "watch": "Cartier 腕錶；【舞台與私下造型配戴銀鏈耳環與復古圓框眼鏡】",
    "residence": "新北市新莊區高級社區（低調隱密）",
    "perfume": "溫潤琥珀、小荳蔻與舞台燈光烘烤後的迷幻香氣",
    "identityRole": "風靡亞洲的頂級男團「HapSTer」主唱兼領舞，舞台上萬人矚目的頂流巨星，私下渴望真實平靜的靈魂。",
    "personality": "台下眼神柔軟細膩、極具同理心；舞台上魅力四射、眼神霸氣。對外界築起厚重防備，一旦對人敞開心扉便展現出極致深情與無助依賴。",
    "speechExamples": [
      "「在所有人眼裡我是徐泰希，但在妳面前，我只是徐予澈。」",
      "「舞台上的掌聲再響，如果台下沒有妳，一切都沒有意義。」",
      "「抱緊我，別讓我醒過來。」"
    ]
  },
  "14_楊慕璃": {
    "key": "14_楊慕璃",
    "name": "楊慕璃",
    "fullName": "楊慕璃（慕璃 · 楊總監）",
    "age": "24歲",
    "title": "弘楊集團公關總監 · 瑾和文教基金會執行長（楊家三房獨生女）",
    "mbti": "INTJ（金牛座）",
    "cars": "白色 Porsche Macan",
    "watch": "Cartier Tank 經典女錶；【無配戴眼鏡！杏眼白皙、及肩黑髮自然捲】",
    "residence": "陽明山腰楊家大宅（與兩位哥哥同住）；新莊副都心高樓私人豪宅",
    "perfume": "天然動情體香，偏好金萱茶與不甜香檳，不喝咖啡",
    "identityRole": "楊家三房獨生女，台大法律/北大犯罪所畢業，弘楊集團公關總監。遊走於政商多方勢力間的頂級智性大女主。",
    "personality": "外表嬌小甜美自帶少女感，內心極度冷靜果決、智商超群。深諳權謀博弈與人心弱點，在多方勢力爭奪中保持獨立與掌控。",
    "speechExamples": [
      "「各位哥哥與長輩們爭奪這盤大棋，可曾問過我的意願？」",
      "「既然入了這局，就別怪我按照我的規則來玩。」"
    ]
  }
};


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
 * 自訂對話框，取代原生 alert / confirm / prompt。
 * 原生對話框會凍結整頁、樣式與遊戲美術脫節，手機上還會顯示網域名稱，
 * 且 prompt() 在部分瀏覽器已被限制。
 * @returns {Promise<boolean|string|null>} alert → true；confirm → boolean；prompt → 字串或 null
 */
function showDialog(options = {}) {
  const {
    title = '提示',
    message = '',
    icon = '✦',
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
  if (iconEl) iconEl.textContent = icon;
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
  showDialog(Object.assign({ message, title: '請確認', mode: 'confirm', icon: '❓' }, options));
const confirmDangerDialog = (message, options = {}) =>
  showDialog(Object.assign({ message, title: '危險操作', mode: 'confirm', icon: '⚠️', tone: 'danger', confirmText: '我了解，繼續' }, options));
const promptDialog = (message, defaultValue = '', options = {}) =>
  showDialog(Object.assign({ message, defaultValue, title: '請輸入', mode: 'prompt', icon: '✎' }, options));

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
  closeBtn.textContent = '✕';
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
  document.querySelectorAll('.game-action-control, #submit-custom-btn, #gameplay-quick-save-btn, #rebase-act-btn').forEach(el => {
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
  shuraOpt.textContent = '⚡ 【全勢力修羅場】（13位男主隨劇情推進動態交鋒 · 多雄爭奪 · 極限拉扯）';
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
    on('report-error-btn', 'click', () => {
      const errMsg = document.getElementById('error-message-text')?.textContent || '生成異常';
      openFeedbackModal({
        category: '🐞 Bug / 系統異常報錯',
        content: `【系統異常報錯】：${errMsg}\n請協助排查此問題。`
      });
    });

    // 遊戲指南與角色圖鑑彈窗
    on('close-game-guide-btn', 'click', closeGameGuideModal);
    on('guide-tab-gameplay-btn', 'click', () => switchGuideTab('gameplay'));
    on('guide-tab-system-btn', 'click', () => switchGuideTab('system'));
    on('guide-tab-roster-btn', 'click', () => switchGuideTab('roster'));
    on('search-roster-input', 'input', renderRosterGallery);

    // 自由行動提交
    on('submit-custom-btn', 'click', handleCustomActionSubmit);
    const customInputEl = document.getElementById('custom-action-input');
    if (customInputEl) {
      customInputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
          e.preventDefault();
          handleCustomActionSubmit();
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
  dom.gameplayBreadcrumb.textContent = `第 ${act} 幕 · 第 ${turn} 回 ｜ ${leadName}`;
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
 * ☁️ 非同步同步真實遊戲存檔至 Google Drive (Player_Saves) 與 Google Sheets (Master_Index)
 */
async function syncStateToGoogleDriveCloud(saveStateObj, chapterDataObj, isManual = false) {
  const saveState = saveStateObj || state.saveState;
  const chapterData = chapterDataObj || state.chapterData;
  const playerProfile = state.playerProfile || (saveState && saveState.meta && saveState.meta.playerProfile);

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
      chapterHistory: chapterWindow(state.chapterHistoryList),
      namedSaves: getNamedSavesList()
    };

    // 不記錄整個 payload：其中含有 session token。
    console.log('[Cloud Sync] Transmitting live game data to Google Drive...', {
      turnCount: saveState && saveState.turnCount,
      chapters: (state.chapterHistoryList || []).length,
      namedSaves: payload.namedSaves.length
    });

    const res = await fetch(state.gasApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow'
    });

    const data = await res.json();
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
    { title: '最終確認', icon: '⚠️', confirmText: '永久註銷', tone: 'danger' }
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
    displayText = '⚠️ ' + name + ' (已過期)';
    colorClass = 'text-red-400';
  } else if (status === 'offline') {
    displayText = '☁️ ' + name + ' (離線)';
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
const NARRATIVE_MODELS = [
  'aion-3.0',
  'qwen/qwen3-vl-235b-a22b-instruct',
  'mistral-large-3'
];

const LLM_CONFIG = {
  WORKER_URL: 'https://tjpr-llm-proxy.todashinchi.workers.dev/',
  // 連續多久收不到新資料才判定該模型失敗並切換備援。
  // 這是「停滯」門檻，不是總時長上限 —— 正在正常吐字的串流不會被中斷。
  STALL_TIMEOUT_MS: 25000,
  API_URL: 'https://api.banana2556.com/v1/chat/completions',
  API_KEY: '', // 安全起見，已轉移至 GAS Proxy
  // 主力：aion-3.0
  // 22k tokens 真實條件實測：前情銜接 3/3、人設細節 3/4（會自行推理出
  // 「圓眼鏡沾了水霧，顯然不是社交場合的裝束」這類延伸），四項尺度全通過，
  // 設定遵循 6/6 零遺漏 —— 文學性與邏輯是候選中最強的。
  // 代價：首字約 56 秒、總計約 76 秒。串流逐字顯示會有較長的等待，
  // 這是刻意接受的取捨（showLoading 在 15 秒後會顯示已等待秒數）。
  PRIMARY_MODEL: 'aion-3.0',
  // 備援：qwen3-vl-235b
  // 首字 5 秒、總計 26.6 秒，是主力的近三倍速；前情銜接同樣 3/3、
  // 四項尺度全通過且是候選中最露骨的，因此情慾章節不需要再往下切。
  FALLBACK_MODEL: 'qwen/qwen3-vl-235b-a22b-instruct',
  // 目前主力與備援都不會自我審查，此清單僅供 warnIfCensoringModel 判斷用。
  // gemini 系列實測會擋掉情慾內容，已全數移出生成鏈。
  CENSORING_MODELS: ['gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.1-pro'],
  // 主模型嘗試次數。aion 實測不會拒絕 R-18，重試主要是為了容忍供應商的
  // 偶發 5xx（mistral 就實測到過連續 503 的高負載狀況）。
  // 2 次主力 + 1 次備援 = 3 次請求，在上游每分鐘 5 次的共用額度內。
  PRIMARY_MAX_ATTEMPTS: 2,
  // 主模型連續失敗後依序嘗試。
  UNCENSORED_FALLBACK_MODELS: [
    'qwen/qwen3-vl-235b-a22b-instruct'
  ],
  MODELS: NARRATIVE_MODELS,
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
function auditGeneratedChapter(input, profile, historyList = []) {
  const chapter = isPlainObject(input) ? input : {};
  chapter.chapterTitle = String(chapter.chapterTitle || '未命名章節').slice(0, 160);
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
const MIN_REQUEST_GAP_MS = 16000;

/**
 * ⚡ 伺服器頻率守衛（Rate Limit Cooldown Protector）
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
  const primaryModel = LLM_CONFIG.PRIMARY_MODEL;
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
      const armStallTimer = () => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          const idleMs = Date.now() - lastChunkAt;
          if (idleMs >= LLM_CONFIG.STALL_TIMEOUT_MS - 50) {
            console.warn(`[Worker] ${model} 停滯 ${Math.round(idleMs / 1000)}s 無回應，切換備援。`);
            if (controller) controller.abort();
          } else {
            armStallTimer();
          }
        }, LLM_CONFIG.STALL_TIMEOUT_MS);
      };
      armStallTimer();
      const workerHeaders = {
        'Content-Type': 'application/json',
        'X-Undercurrent-Token': state.token || ''
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
          stream: true
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
          // 會審查的模型是回 200 加拒絕語，不是回錯誤 —— 必須主動判定
          const verdict = detectRefusal(finalParsed);
          if (verdict.refused) throw createRefusalError(model, verdict.reason);
          const validationError = getNarrativeValidationError(finalParsed);
          if (validationError) throw new Error(`模型章節結構不完整：${validationError}`);
          const literaryError = getLiteraryValidationError(finalParsed, state.chapterHistoryList);
          if (literaryError && planIdx < modelsToTry.length - 1) {
            throw new Error(`模型文學品質未達門檻：${literaryError}`);
          }
          if (literaryError) console.warn(`[Literary Quality] 最終備援仍有警告，保留可遊玩章節：${literaryError}`);
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
  /我(無法|不能|不便)(協助|提供|繼續|完成|生成|撰寫|描寫)/,
  /(不符合|違反|超出)(我的)?(使用|內容|安全)?(政策|規範|準則|原則|限制)/,
  /我(是一個|只是一個)?(AI|人工智慧|語言模型)/,
  /(改為|建議)(描寫|撰寫)(較為)?(含蓄|委婉|保守)/,
  /無法(生成|產生|創作)(這類|此類|該類)(內容|情節|描寫)/,
  // 簡體中文拒絕語。中國廠商的模型（GLM、Qwen、MiniMax 等）多以簡體回覆，
  // 而上面那組全是繁體字樣式 —— 「无法」不會被「無法」命中，一個字都對不上。
  /(很抱歉|抱歉|对不起)[，,。\s]*(我|本人|作为)?(无法|不能|不便|没有办法)/,
  /我(无法|不能|不便)(协助|提供|继续|完成|生成|撰写|描写)/,
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
 * 建立這一回的模型嘗試計畫：
 *   Gemini × 2 → Mistral → Dolphin。Worker 與 GAS 共用這一份固定計畫。
 */
function buildAttemptPlan() {
  const primary = LLM_CONFIG.PRIMARY_MODEL;
  const maxPrimary = Math.max(1, LLM_CONFIG.PRIMARY_MAX_ATTEMPTS || 1);
  const plan = new Array(maxPrimary).fill(primary);

  const pool = (LLM_CONFIG.UNCENSORED_FALLBACK_MODELS || []).filter(Boolean);
  plan.push(...pool);
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
  if (model === LLM_CONFIG.PRIMARY_MODEL) return;
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
        const verdict = detectRefusal(parsed);
        if (verdict.refused) {
          console.warn(`[Pure AI] ${model} 被判定為拒絕／審查（${verdict.reason}），改試下一個。`);
          reportGenerationProgress(model, mIdx + 1, models.length, '被拒絕，改試下一個');
          continue;
        }
        const validationError = getNarrativeValidationError(parsed);
        if (validationError) {
          console.warn(`[Pure AI] ${model} 章節結構不完整（${validationError}），改試下一個。`);
          reportGenerationProgress(model, mIdx + 1, models.length, '結構不完整，改試下一個');
          continue;
        }
        const literaryError = getLiteraryValidationError(parsed, state.chapterHistoryList);
        if (literaryError && mIdx < models.length - 1) {
          console.warn(`[Pure AI] ${model} 文學品質未達門檻（${literaryError}），改試下一個。`);
          reportGenerationProgress(model, mIdx + 1, models.length, '文學品質不足，改試下一個');
          continue;
        }
        if (literaryError) console.warn(`[Literary Quality] 最終 GAS 備援仍有警告，保留可遊玩章節：${literaryError}`);
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
// 4.4 Drive 角色卡調閱與快取 (Lore Retrieval)
// =========================================================================

/**
 * Drive 上 14 份角色 .md 共約 50,900 字元，而 app.js 硬編的
 * OFFICIAL_DRIVE_CHARACTERS 只有約 7,000 字元 —— 缺少關係網絡、家族背景、
 * 幕僚系統、宿敵設定，以及部分角色專屬的風格防火牆。長局中最容易造成
 * 性格漂移的正是這些內容。
 *
 * 單張角色卡最大 8,512 字元（徐承勳）≈ 14k tokens，而目前整份提示詞只有
 * 約 7,800 字元。注入 Tier 1 全文後總量約 23k tokens，遠低於 mistral-large
 * 的 128k 視窗 —— 因此不需要精打細算，主攻角色一律注入完整人設。
 *
 * 取得方式：GAS 的 lore/get-character（需登入）。取不到時自動退回硬編資料，
 * 本機模式與離線都不會因此中斷遊戲。
 */
const LORE_CACHE_PREFIX = 'undercurrent_lore_';
const LORE_CACHE_TTL_MS = 24 * 60 * 60 * 1000;   // 24 小時後自動重新調閱
const LORE_TIER2_LIMIT = 2;                       // 在場配角最多注入兩張全文

/** 記憶體層快取，避免同一回合內反覆讀 localStorage 與 JSON.parse */
const loreMemoryCache = new Map();

function readLoreCache(id) {
  if (loreMemoryCache.has(id)) return loreMemoryCache.get(id);
  try {
    const raw = localStorage.getItem(LORE_CACHE_PREFIX + id);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.markdown) return null;
    if (Date.now() - (parsed.fetchedAt || 0) > LORE_CACHE_TTL_MS) return null;
    loreMemoryCache.set(id, parsed);
    return parsed;
  } catch (e) {
    return null;
  }
}

function writeLoreCache(id, markdown) {
  const entry = { id, markdown, fetchedAt: Date.now() };
  loreMemoryCache.set(id, entry);
  safeLocalStorageSet(LORE_CACHE_PREFIX + id, JSON.stringify(entry));
}

/** 清空所有角色卡快取，強迫下次重新自 Drive 調閱（Drive 上編輯後用） */
function clearLoreCache() {
  loreMemoryCache.clear();
  let removed = 0;
  try {
    // 用 localStorage.key(i) 索引迭代而非 Object.keys()：前者是 Storage 的
    // 標準介面，在任何實作上都可靠；後者依賴 key 被暴露為可列舉自有屬性。
    // 先收集再刪除 —— 邊迭代邊 removeItem 會讓索引位移、漏刪。
    const doomed = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(LORE_CACHE_PREFIX)) doomed.push(k);
    }
    doomed.forEach(k => { localStorage.removeItem(k); removed++; });
  } catch (e) {
    console.warn('[Lore] 清除快取時發生異常:', e.message);
  }
  return removed;
}

/**
 * 自 Drive 調閱指定角色的完整人設，結果寫入快取。
 * @param {string[]} ids 角色識別碼（如 '01_徐令謙'）
 * @param {{force?: boolean}} options force 為 true 時忽略既有快取
 * @returns {Promise<number>} 本次實際取得的張數
 */
async function fetchCharacterLore(ids, options = {}) {
  const { force = false } = options;
  const wanted = (Array.isArray(ids) ? ids : [ids])
    .filter(Boolean)
    .filter(id => force || !readLoreCache(id));
  if (wanted.length === 0) return 0;

  // 本機模式沒有雲端身分可用，直接沿用硬編資料
  if (!state.token || state.token.startsWith('tok_local_')) return 0;

  try {
    const res = await fetch(state.gasApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'lore/get-character',
        token: state.token,
        userId: state.userId,
        ids: wanted.slice(0, 4)
      }),
      redirect: 'follow'
    });
    const data = await res.json();
    if (!data.success || !data.data || !data.data.cards) {
      console.warn('[Lore] 調閱失敗，沿用硬編人設:', data.error?.message);
      return 0;
    }
    let count = 0;
    Object.values(data.data.cards).forEach(card => {
      if (card && card.markdown) { writeLoreCache(card.id, card.markdown); count++; }
    });
    if ((data.data.missing || []).length) {
      console.warn('[Lore] Drive 上找不到角色卡:', data.data.missing.join(', '));
    }
    console.log(`[Lore] 已自 Drive 調閱 ${count} 張角色卡。`);
    return count;
  } catch (err) {
    console.warn('[Lore] 調閱時網路異常，沿用硬編人設:', err.message);
    return 0;
  }
}

/**
 * 每隔幾回在提示詞裡加一段「重新對標人設」的強化指令。
 *
 * 為什麼需要：滾動摘要池會把早期劇情壓縮成事實條目，語氣與性格的細節
 * 在壓縮中流失最快，長局因此容易出現「講話方式變了」的漂移。
 * 完整角色卡雖然每回都注入，但單純放著不代表模型會持續對標它 ——
 * 定期給一句明確的重新校準指令，效果好得多。
 */
const LORE_RECALIBRATE_EVERY = 5;

function buildLoreRecalibrationNote(turnCount, leadName) {
  if (!turnCount || turnCount < LORE_RECALIBRATE_EVERY) return '';
  if (turnCount % LORE_RECALIBRATE_EVERY !== 0) return '';
  return [
    '',
    `【人設重新校準 · 第 ${turnCount} 回】`,
    `已進行 ${turnCount} 回，請在本回動筆前重新通讀上方 ${leadName} 的官方完整人設檔案，`,
    '特別是說話風格與例句、性格與情慾動態，以及該角色專屬的風格禁制段落。',
    '本回的對白與行為必須與檔案完全吻合 —— 若先前幾回出現語氣偏移、用詞粗俗化',
    '或性格軟化，請在本回自然地校正回來，不要沿用偏移後的寫法。',
    ''
  ].join('\n');
}

/** 取出快取中的完整人設；沒有就回傳 null（呼叫端負責降級） */
function getLoreMarkdown(id) {
  const entry = readLoreCache(id);
  return entry ? entry.markdown : null;
}

/**
 * 手動重新調閱：在 Google Drive 上編輯過角色卡後，用這個讓修改立即生效
 * （否則要等 24 小時快取到期）。
 */
async function handleReloadLore() {
  const profile = getActivePlayerProfile();
  if (!state.token || state.token.startsWith('tok_local_')) {
    notifyUser('本機模式無法更新雲端角色設定，將沿用內建人設。', 'error', 5000);
    return;
  }
  const removed = clearLoreCache();
  notifyUser('正在自 Drive 重新調閱角色卡……', 'info', 2500);
  const ids = [];
  if (profile.targetLead && profile.targetLead !== '修羅場') ids.push(profile.targetLead);
  (profile.supportingLeads || []).forEach(k => ids.push(k));
  const got = await fetchCharacterLore(ids, { force: true });
  renderLoreStatus();
  notifyUser(
    got > 0
      ? `已重新調閱 ${got} 張角色卡，下一回起生效（清除舊快取 ${removed} 筆）。`
      : 'Drive 上未取得角色卡，將沿用內建人設。',
    got > 0 ? 'success' : 'error',
    6000
  );
}

/** 在選單抽屜顯示目前使用的是 Drive 全文還是內建精簡人設 */
function renderLoreStatus() {
  const el = document.getElementById('lore-status-line');
  if (!el) return;
  const profile = getActivePlayerProfile();
  const lead = profile.targetLead;
  if (!lead || lead === '修羅場') {
    el.textContent = '修羅場模式：使用全 13 位背景名冊。';
    return;
  }
  const md = getLoreMarkdown(lead);
  el.textContent = md
    ? `目前 ${profile.targetLeadName || lead}：Drive 完整人設（${md.length} 字元）已載入。`
    : `目前 ${profile.targetLeadName || lead}：使用內建精簡人設。點上方按鈕自 Drive 調閱完整版。`;
}

/**
 * 開局或載入存檔後預熱：主攻對象 + 指定配角。
 * 刻意不 await —— 第一回的提示詞可以先用硬編資料組成，
 * 調閱完成後從第二回起自動升級為全量人設。
 */
function warmLoreCache(profile) {
  if (!profile) return;
  const ids = [];
  if (profile.targetLead && profile.targetLead !== '修羅場') ids.push(profile.targetLead);
  (profile.supportingLeads || []).forEach(k => ids.push(k));
  if (ids.length) fetchCharacterLore(ids).catch(() => {});
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
  actDossierChars: 900,        // 單份幕篇檔案上限
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
    const seg = [`── 第 ${turn} 回：${h.chapterTitle || '前篇'} ──`];
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
  list.filter(h => h && h.memoryPinned).forEach(h => byTurn.set(Number(h.turn), h));
  const pinned = Array.from(byTurn.values()).slice(-8);
  if (pinned.length === 0) return '';
  const entries = pinned.map(h => {
    const facts = [
      `── 第 ${h.turn || '?'} 回：${h.chapterTitle || '重要回合'} ──`,
      h.chosenLabel ? `【玩家行動】${h.chosenLabel}` : '',
      `【不可遺忘原文】${clampBlock(h.prose, 900)}`
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
  Object.keys(delta.relationshipChanges).forEach(name => {
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
  if (normalizedDelta.relationshipChanges[leadName] === undefined) {
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
  if (relEntries.length) {
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

// =========================================================================
// 4.5 三層角色動態注入引擎與長期滾動摘要池 (Tiered Lore & Memory Pipeline)
// =========================================================================

const CHARACTER_IDENTITY_FIREWALL = `
【13 位官方男主身分、職業、外貌與座車不可撼動防火牆（100% 絕對對標，嚴禁混淆與張冠李戴）】：
1. 徐令謙（35歲）：玄辰幫二把手 · 直屬堂口天裕會首領 · 德行法律事務所顧問。【黑道商業操盤教父，配戴復古圓眼鏡（工作場合才戴）。座車：私人坦桑石藍 BMW X6 M60i / 公務深銀灰 BMW M760i xDrive。絕非檢警】
2. 韓正寰（35歲）：士林地檢署重大刑案主任檢察官 · 白日判官。【全劇唯一檢察官，無戴眼鏡！短而硬挺油頭、小麥色皮膚、法袍/無褶白襯衫。座車：白色 Škoda Enyaq Coupe。絕非警察、律師或黑道】
3. 邵翊衡（37歲）：昱合策略執行長 · 政媒幕後操盤者 · 頂級輿情顧問。【配戴暗銀色細方框眼鏡。座車：私人黑曜金 Porsche 911 Carrera 4 GTS / 公務黑色 Audi A8】
4. 楊紹宸（28歲）：弘楊集團副總 · 執行董事 · 物流貿易事業群總經理（楊副總/二哥，無戴眼鏡！【絕非少東！】座車：私人鐵灰 Audi RS7 / 公務黑色 Benz S680 配司機，【絕非邁巴赫！】）
5. 徐宇寧（28歲）：明隱牙醫診所院長 · 專職牙醫師 · 全國空氣手槍高手（徐令謙堂弟、楊紹宸薇閣同學）。【專職牙醫師！無戴眼鏡！單眼皮笑起來眼尾微彎。不穿白袍（診所淺灰深藍制服/私服亞麻襯衫搭寬褲）。性格很 Chill、幽默調皮、溫柔細膩、撩人無形。座車：淺灰藍 Volvo XC60。【嚴禁當成全科醫生、內外科密醫或拎急救醫藥箱到處量血壓心率！】】
6. 林政修（41歲）：法務部政務次長（林次）。【司法體制頂層掌舵者，無戴眼鏡！座車：公務曜石黑 Benz S-Class L 350d】
7. 沈湛然（36歲）：台大醫院精神醫學部主治醫師 · 司法精神醫學權威。【全劇唯一精神科醫師，在台大醫院上班，無個人診所，非院長非外科，無戴眼鏡！座車：私人極光鈦 Lexus ES 300h】
8. 江瀚文（36歲）：鼎曜媒體集團執行長。【傳媒大亨，無戴眼鏡！座車：私人銀灰 Aston Martin DBS】
9. 吳衛廷（42歲）：最大在野黨立法委員（台北市舊城區/萬華）· 國會喬王。【全劇唯一許可草莽粗話與台語交織，無戴眼鏡！座車：公務 Toyota Alphard / 私人 Benz E-Class】
10. 徐承勳（47歲）：中華民國副總統 · 科技經濟巨擘。【配戴極細鈦金屬無框眼鏡。座車：公務防彈 Audi A8 L Security / 私人克爾巴阡灰 Jaguar F-Type COUPÉ R75】
11. 徐耀南（57歲）：榮南營造集團董事長（榮南王）。【營造地產教父，無戴眼鏡！座車：公務絲絨棕 Benz S450 4Matic L 配專屬司機】
12. 徐若宸（22歲）：榮南營造家族長子 · 中興大學企管所研究生（徐耀南長子）。【明確無配戴眼鏡！清瘦挺拔、乾淨知性。座車：金屬莫蘭迪綠 VW T-Roc】
13. 徐予澈（29歲）：亞洲頂級男團 HapSTer 門面主唱兼領舞（藝名徐泰希 / 化名 Hans）。【配戴銀鏈耳環與造型復古圓框眼鏡。座車：Benz V-Class / Benz G500 / Volvo 1800S】

【全角色眼鏡配戴唯一真理清單】：
- 戴眼鏡的角色只有 4 位：徐令謙（復古圓眼鏡）、邵翊衡（細方框眼鏡）、徐承勳（極細無框眼鏡）、徐予澈（造型圓框眼鏡）。
- 其餘角色（徐宇寧、楊紹宸、韓正寰、林政修、沈湛然、江瀚文、吳衛廷、徐耀南、徐若宸、楊慕璃）全部【沒有配戴眼鏡】，嚴禁隨意描寫戴眼鏡或摘拭眼鏡！
`;

const ROSTER_ONE_LINERS = [
  { id: "01_徐令謙", name: "徐令謙", aliases: ["徐令謙", "徐顧問", "謙哥", "徐二少", "令謙", "天裕會"], role: "玄辰幫二把手 · 天裕會中樞 · 幕後操盤者", oneLiner: "冷靜自持、極有分寸的政商秩序操盤者，工作場合戴復古圓眼鏡，座車坦桑石藍 BMW X6 / 深銀灰 BMW M760i；不必提高音量便有十足份量，對所愛之人給予自由並默默承擔一切風險。" },
  { id: "02_韓正寰", name: "韓正寰", aliases: ["韓正寰", "韓檢", "韓主任", "正寰", "士林地檢署", "白日判官"], role: "士林地檢署主任檢察官 · 白日判官", oneLiner: "冷峻禁慾的司法利刃，無眼鏡、短油頭法袍，座車白色 Škoda Enyaq Coupe，在正義守護與私慾佔有邊界極限拉扯。" },
  { id: "03_邵翊衡", name: "邵翊衡", aliases: ["邵翊衡", "邵顧問", "翊衡", "昱合策略"], role: "昱合策略執行長 · 政媒幕後操盤者 · 頂級輿情顧問", oneLiner: "溫潤優雅的政媒策士，戴暗銀色細方框眼鏡，座車 Porsche 911 / Audi A8，帶著溫和面具的無聲支配者。" },
  { id: "04_楊紹宸", name: "楊紹宸", aliases: ["楊紹宸", "楊副總", "副總", "紹宸", "二哥"], role: "弘楊集團副總 · 執行董事 · 物流貿易總經理", oneLiner: "深沉銳利的集團副總（絕非少東！無眼鏡），掌管灰色物流通道，座車 Audi RS7 / 黑色 Benz S680（絕非邁巴赫），毒舌重度護短。" },
  { id: "05_徐宇寧", name: "徐宇寧", aliases: ["徐宇寧", "宇寧", "明隱牙醫", "徐醫師", "徐院長"], role: "明隱牙醫診所院長 · 專職牙醫師 · 空氣手槍高手", oneLiner: "專職牙醫師（無眼鏡！不穿白袍，淺灰深藍制服/亞麻襯衫，座車淺灰藍 Volvo XC60）。很 Chill、幽默調皮、溫柔細膩、撩人無形。【絕非全科醫生/密醫，嚴禁拎醫藥箱到處量血壓！】" },
  { id: "06_林政修", name: "林政修", aliases: ["林政修", "林次", "政修", "法務部次長"], role: "法務部政務次長 · 頂層權力掌舵者", oneLiner: "沉穩威嚴的政壇上位者（無眼鏡，座車 Benz S-Class L 350d），舉手投足皆是國家機器級別的絕對權力壓迫。" },
  { id: "07_沈湛然", name: "沈湛然", aliases: ["沈湛然", "沈醫師", "湛然", "台大精神科"], role: "台大醫院精神醫學部主治名醫 · 司法精神醫學權威", oneLiner: "台大醫院精神醫學主治醫師（無眼鏡，座車 Lexus ES 300h），洞悉人性的深淵凝視者，能輕易看穿防禦與隱密慾望。" },
  { id: "08_江瀚文", name: "江瀚文", aliases: ["江瀚文", "江執行長", "江總", "瀚文", "Ethan", "鼎曜傳媒"], role: "鼎曜媒體集團執行長 · 傳媒巨擘", oneLiner: "傳媒娛樂大亨（無眼鏡，座車 Aston Martin DBS），擅長資本運作、公關風向與鏡頭下的致命曖昧。" },
  { id: "09_吳衛廷", name: "吳衛廷", aliases: ["吳衛廷", "吳委員", "衛廷", "衛廷哥", "在野黨立委"], role: "立法院司法及法制委員會立法委員 · 國會喬王", oneLiner: "深諳基層利益與國會黑幕的實權立委（無眼鏡，座車 Toyota Alphard / Benz E-Class），江湖草莽氣質與政治手腕並存，唯一可講粗話。" },
  { id: "10_徐承勳", name: "徐承勳", aliases: ["徐承勳", "副總統", "承勳", "徐副"], role: "中華民國副總統 · 科技經濟巨擘", oneLiner: "成熟禁慾的政壇巔峰男性（戴極細鈦金屬無框眼鏡，座車防彈裝甲 Audi A8 L / Jaguar F-Type），身處權力牢籠，深邃孤獨且極具威儀。" },
  { id: "11_徐耀南", name: "徐耀南", aliases: ["徐耀南", "徐董", "耀南", "榮南王", "榮南營造"], role: "榮南營造集團董事長 · 中部營造霸主", oneLiner: "白手起家的商界梟雄（無眼鏡，座車絲絨棕 Benz S450 4Matic L 配司機），冷峻威嚴，帶有濃烈宗族家長權威。" },
  { id: "12_徐若宸", name: "徐若宸", aliases: ["徐若宸", "若宸", "小徐總"], role: "榮南營造家族長子 · 中興企管所研究生", oneLiner: "知性清雅貴公子（明確無眼鏡！座車金屬莫蘭迪綠 VW T-Roc），清瘦內斂，內心壓抑著深沉的情感叛逆。" },
  { id: "13_徐予澈", name: "徐予澈", aliases: ["徐予澈", "徐泰希", "泰希", "予澈", "Hans", "HapSTer"], role: "亞洲頂級男團 HapSTer 門面主唱兼領舞（藝名徐泰希）", oneLiner: "台上極限魅惑、私下溫潤細膩的頂流偶像（配戴銀鏈耳環與造型復古圓眼鏡，座車 Benz V-Class / Benz G500 / Volvo 1800S）。" }
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
function assembleCharacterPromptBlock(primaryLeadKey, activeNPCs, isShura) {
  const blocks = [];

  if (isShura) {
    blocks.push('=== 【全勢力修羅場 (Tier 1)】 ===');
    blocks.push('當前模式：十三勢力修羅場交鋒！所有 13 位男主均可能依局勢動態突入，請隨時維持各方勢力交鋒的緊張感與性張力！提及各角色時必須嚴格對標其官方座車、職銜與性格！\n');
  } else {
    const primaryChar = OFFICIAL_DRIVE_CHARACTERS[primaryLeadKey] || OFFICIAL_DRIVE_CHARACTERS['01_徐令謙'];
    const primaryLore = getLoreMarkdown(primaryLeadKey);

    if (primaryLore) {
      // Drive 上的完整角色卡：含關係網絡、家族背景、幕僚系統、宿敵與
      // 角色專屬風格防火牆 —— 這些是硬編摘要沒有、而長局防漂移最需要的內容。
      blocks.push('=== 【主要互動角色 (Tier 1 · 核心主角 · Drive 官方完整人設檔案)】 ===');
      blocks.push('【最高權重】以下為該角色的官方完整設定檔全文。任何描寫與此衝突時，一律以本檔案為準：');
      blocks.push(primaryLore.trim());
      blocks.push('');
      return finishCharacterBlocks(blocks, primaryLeadKey, activeNPCs);
    }

    const exStr = (primaryChar.speechExamples || []).map(ex => '  * ' + ex).join('\n');
    blocks.push('=== 【主要互動角色 (Tier 1 · 核心主角 · 精簡人設)】 ===');
    blocks.push(`- 姓名與稱謂：${primaryChar.fullName || primaryChar.name}（${primaryChar.age}，${primaryChar.mbti || ''}）
- 官方專屬職銜：${primaryChar.title}
- 專屬座車出入：${primaryChar.cars || '依照官方設定'}
- 專屬手錶配件：${primaryChar.watch || '依照官方設定'}
- 住所與活動範圍：${primaryChar.residence || '依照官方設定'}
- 香水與感官氣息：${primaryChar.perfume || '依照官方設定'}
- 核心身分定位：${primaryChar.identityRole}
- 深度性格與情慾動態：${primaryChar.personality}
- 專屬說話風格例句（請嚴格對標其說話語調）：
${exStr}\n`);
  }

  if (activeNPCs && activeNPCs.length > 0) {
    blocks.push('=== 【當前在場配角 (Tier 2 · 動態突入 · 精準人設對標)】 ===');
    blocks.push('【在場配角演繹指引】：以下角色已動態升階為在場配角！請載入其完整職銜、座車與上位者身分，推動衝突與暗流，絕不可張冠李戴或隨意發明設定！');
    let tier2FullCount = 0;
    activeNPCs.forEach((npc, idx) => {
      const npcLore = tier2FullCount < LORE_TIER2_LIMIT ? getLoreMarkdown(npc.id) : null;
      if (npcLore) {
        tier2FullCount++;
        blocks.push(`▶ 在場配角 [${idx + 1}]：${npc.name}（Drive 官方完整人設檔案）`);
        blocks.push(npcLore.trim());
        blocks.push('');
        return;
      }
      const fullChar = OFFICIAL_DRIVE_CHARACTERS[npc.id] || OFFICIAL_DRIVE_CHARACTERS[npc.name] || {};
      blocks.push(`▶ 在場配角 [${idx + 1}]：${fullChar.fullName || npc.name}（${fullChar.age || ''}）
  - 精確職銜：${fullChar.title || npc.role}
  - 專屬座車：${fullChar.cars || '-'}
  - 專屬手錶/住所：${fullChar.watch || '-'} ｜ ${fullChar.residence || '-'}
  - 核心特徵與性格：${fullChar.personality || npc.oneLiner}
  - 經典語調：${(fullChar.speechExamples || [])[0] || '-'}`);
    });
    blocks.push('');
  }

  return finishCharacterBlocks(blocks, primaryLeadKey, activeNPCs, true);
}

/**
 * 補上 Tier 2 / Tier 3 區塊。
 * Tier 1 走 Drive 全文時會提前 return，因此這段抽成獨立函式供兩條路徑共用。
 * @param {boolean} tier2AlreadyDone 呼叫端是否已自行輸出 Tier 2
 */
function finishCharacterBlocks(blocks, primaryLeadKey, activeNPCs, tier2AlreadyDone = false) {
  if (!tier2AlreadyDone && activeNPCs && activeNPCs.length > 0) {
    blocks.push('=== 【當前在場配角 (Tier 2 · 動態突入)】 ===');
    let n = 0;
    activeNPCs.forEach((npc, idx) => {
      const npcLore = n < LORE_TIER2_LIMIT ? getLoreMarkdown(npc.id) : null;
      if (npcLore) {
        n++;
        blocks.push(`▶ 在場配角 [${idx + 1}]：${npc.name}（Drive 官方完整人設檔案）`);
        blocks.push(npcLore.trim());
      } else {
        const c = OFFICIAL_DRIVE_CHARACTERS[npc.id] || {};
        blocks.push(`▶ 在場配角 [${idx + 1}]：${c.fullName || npc.name}｜${c.title || npc.role}｜座車 ${c.cars || '-'}`);
        blocks.push(`  性格：${c.personality || npc.oneLiner}`);
      }
    });
    blocks.push('');
  }

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

  // Drive 人物卡可能仍是舊快取；把最新演繹規則放在所有人物資料之後，
  // 避免較晚載入的舊版措辭把徐令謙拉回兇狠、控制型模板。
  const requiresXuCalibration = primaryLeadKey === '01_徐令謙'
    || primaryLeadKey === '徐令謙'
    || primaryLeadKey === '修羅場'
    || (activeNPCs || []).some(npc => npc.id === '01_徐令謙' || npc.name === '徐令謙');
  if (requiresXuCalibration) {
    blocks.push('');
    blocks.push(`=== 【徐令謙最新演繹校準（最高優先，覆蓋舊版 Drive 用語）】 ===
若前方人物卡或快取文字與本段衝突，一律視為舊版並以本段為準：
1. 徐令謙冷靜、自持、有分寸且具紳士風度；語句簡潔、不油條、不浮誇、不吼叫、不以逞兇鬥狠展示份量。
2. 他對玩家的吸引力來自克制、可靠與不動聲色的照顧。尊重玩家的選擇與界線，不強迫靠近、不封路、不以命令或威脅換取服從。
3. 情感加深後，他會深情且堅定地支持玩家想做的事，主動承擔風險，默默備妥保險、退路與秘密守護；給予自由，而不是把保護變成控制。
4. 他的權勢與危險只用來處理外部威脅，絕不朝向玩家。親密張力須建立在雙方明確意願上，不預設羞辱、疼痛、強迫或無路可退。`);
  }

  return blocks.join('\n');
}

const LITERARY_CLICHE_PATTERNS = [
  '空氣瞬間凝滯', '空氣凝滯', '眼底閃過一絲', '眼底閃過', '眸中掠過',
  '唇角勾起', '嘴角勾起', '心跳如鼓', '看穿靈魂', '無形的網', '無形的牆',
  '蟄伏的獸', '危險又迷人', '不容置疑', '不容拒絕', '宣告主權',
  '喉結滾動', '指尖微顫', '呼吸一滯', '渾身一僵', '電流竄過',
  '眼神銳利如刀', '銳利如刀刃', '眼神像刀', '未引爆的計時器', '未引爆計時器'
];

const SCENE_RHYTHM_CYCLE = [
  { name: '潛流鋪陳', brief: '降低表面音量，以一個具體物件或環境變化承載不安；不急著製造高潮。' },
  { name: '言語試探', brief: '讓對話表層與真正意圖錯開；至少一句話在後文產生第二層意思。' },
  { name: '情報揭露', brief: '只揭開一項會改變判斷的新事實，同時讓角色為知道它付出代價。' },
  { name: '關係偏移', brief: '用選擇、讓步或拒絕改變雙方距離，不直接替讀者宣布感情升溫。' },
  { name: '壓力峰值', brief: '讓先前累積的矛盾落到不可迴避的行動；高潮必須改變局勢，而非只提高形容詞強度。' },
  { name: '餘韻留白', brief: '處理上一個轉折的後果，以未說完的話、物件或動作收尾，保留下一回張力。' }
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

function buildLiteraryCraftBlock(turnCount, historyList) {
  const rhythm = getSceneRhythm(turnCount);
  const echoes = collectRecentStyleEchoes(historyList);
  return `【本回文學敘事規格（優先於氣氛口號，僅次於人物設定與事實連續性）】
- 敘事視角：貼近玩家感官的限知第二人稱；只寫當下可察覺或合理推斷之事，不替其他角色解說內心。
- 文體：台灣當代都會黑色小說。用精準名詞、動詞與可驗證細節形成質感；克制形容詞，避免把「高級、危險、壓迫、性感」當成結論反覆宣告。
- 對話：台詞表面意義與真正目的之間要有距離，以停頓、答非所問、避開稱謂或改變動作呈現潛台詞；不要在旁白立刻解釋每句台詞。
- 節奏：長短句與段落密度須有變化。一段只保留一個主要感官焦點；全回核心比喻最多 2 個，且必須取材自當前場景；「像、彷彿、如同、宛如」四種詞合計最多 3 次。
- 交稿前靜默自檢：逐字搜尋「像、彷彿、如同、宛如」，合計超過 3 次就刪減；這是硬性上限，不是建議。
- 避免機械重複：同一句話、同一物件狀態或「你＋動作」句型不得換字反覆描述；除非是刻意設計的唯一一次回聲，完整句子不可重複。
- 跨回推進：不可把上一回的招牌物件、收尾意象或整段動作只換幾個字再寫一次；若物件仍在場，必須寫出它因新行動產生的變化或後果。
- 情慾與權力：由人物承擔的風險、允許或拒絕、物理距離與具體後果產生；不得直接用「性張力爆發、佔有慾、危險迷人」代替戲劇行動。
- 場景單位：完成一個有因果的戲劇節拍即可，不必每回高潮或封口。結尾留下會影響下一回的具體餘波，不寫「這只是開始」式總結。
- 收尾禁制：不得用「這不是 X。這是 Y。」「裂縫已經打開」「一切才剛開始」等判詞替讀者總結；必須以仍在發生的動作、物件、聲音或未完成對話收尾。
- 本回節奏角色：${rhythm.name}——${rhythm.brief}
- 通用反套路：避免使用「${LITERARY_CLICHE_PATTERNS.join('、')}」及其近義改寫；若確有必要，整回最多只能出現其中一項。
- 近期三回已出現、尤其不可再用：${echoes.length ? echoes.join('、') : '無；仍須遵守通用反套路'}。
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
  if (simileCount > 3) warnings.push(`比喻訊號過密（${simileCount} 次）`);

  const repeatedSentenceCount = countRepeatedLiterarySentences(prose);
  if (repeatedSentenceCount) warnings.push(`完整句子重複（${repeatedSentenceCount} 次）`);

  const simplifiedChineseCount = countSimplifiedChineseMarkers(prose);
  if (simplifiedChineseCount) warnings.push(`混入簡體字（${simplifiedChineseCount} 字）`);

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
    score: Math.max(0, 100 - clichéHits.length * 8 - Math.max(0, simileCount - 2) * 5 - repeatedSentenceCount * 8 - simplifiedChineseCount * 12 - Math.max(0, recentEchoLength - 11) * 3 - longChoices * 5 - (formulaicClosure ? 12 : 0) - warnings.length * 4),
    warnings,
    metrics: { clichéHits, simileCount, repeatedSentenceCount, simplifiedChineseCount, recentEchoLength, sentenceCount: sentences.length, longChoices, formulaicClosure }
  };
}

function getLiteraryValidationError(chapter, historyList = []) {
  const quality = assessLiteraryQuality(chapter, historyList);
  if (quality.metrics.clichéHits.length >= 3) return `套路語過多（${quality.metrics.clichéHits.length} 項）`;
  if (quality.metrics.simileCount > 4) return `比喻訊號過密（${quality.metrics.simileCount} 次）`;
  if (quality.metrics.simplifiedChineseCount) return `混入簡體字（${quality.metrics.simplifiedChineseCount} 字）`;
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
【最高指導原則：全量人物設定 100% 絕對對標（最高約束力）】：
1. 【嚴格對標座車與配件】：提及角色出入或座車時，必須 100% 使用其設定檔中的指定座車（例如：楊紹宸為私人鐵灰 Audi RS7 / 公務黑色 Benz S680 配司機，絕非邁巴赫；徐令謙為 BMW M760i / X6 M60i；韓正寰為 Škoda Enyaq；邵翊衡為 Porsche 911 / Audi A8；徐宇寧為 Volvo XC60；徐承勳為 Audi A8 L 防彈裝甲車 / Jaguar F-Type；江瀚文為 Aston Martin DBS 等），嚴禁 AI 自行隨意發明！
2. 【嚴格對標官方職銜與稱謂】：必須使用精準官方職稱（徐令謙在正式、政商場合稱「徐顧問」，熟識者、天裕會與江湖人物稱「謙哥」，不得另造老派排行尊稱；楊紹宸為弘楊集團「副總/楊副總/二哥」，絕非少東；韓正寰為「主任檢察官/白日判官」；徐宇寧為「明隱牙醫院長兼專職牙醫」，絕非檢警或黑道；沈湛然為「台大醫院精神科主治醫師」，絕非院長或外科）。
3. 【嚴格對標專屬說話風格與語句】：必須嚴格參照各角色設定檔中的口吻與範例台詞。徐令謙必須冷靜、自持、紳士，台詞簡潔有份量，不油條、不浮誇、不逞兇鬥狠；對玩家尊重自主，以克制形成張力，力量只朝向外部風險。不得把冷靜寫成冷酷、保護寫成控制、佔有慾寫成剝奪自由。
4. 【血緣與親情既定事實】：楊慕璃與二哥楊紹宸同住陽明山大宅，熟知彼此生活習慣，嚴禁任何初次見面的陌生化描寫！

${literaryCraftBlock}

請嚴格遵守《情慾文學指引》與《系統核心指令》：
1. 風格與成人情慾（R-18）：以人物意圖、選擇後果、五感細節與未說出口的欲望形成張力，並結合權謀殺伐與多方博弈；使用純台灣繁體中文。
   - 徐令謙專屬例外：他的張力來自風度、克制、可靠承擔與深情守護；除非玩家主動表達偏好，不得預設威脅、羞辱、疼痛、強迫或封鎖退路。
2. 【正文篇幅目標】prose 建議 800–1200 個中文字，依場景需要自然增減。完成一個實質改變局勢或關係的戲劇節拍，不必每回高潮或封口；不截斷、不灌水、不套固定模板。
3. 【數值真實性運算規則】：
   - tension（張力值 0~100）：依據當前壓迫感/物理距離/對峙危險度給出具體整數。
   - intoxication（微醺度 0~100）：【物理法則】只有在正文中實際喝了酒才會增加（一杯酒+15~20）；若無任何飲酒情節，數值必須保持 0！
   - favorabilityDelta（好感度變動 -5~+10）：依據主角言行魅力與交鋒魄力給予增減（初次見面展現膽識給予 +2~+5）。
   - 【線索與籌碼】：只有正文中真的取得、查證、曝光或交付的資訊才能寫入 intelDelta。新增線索必須說明來源與用途；沒有變動時回傳空陣列，嚴禁憑空塞入通用道具。
4. 【三層角色設定集】：
${characterPromptBlock}

5. 輸出必須為合法純 JSON 格式（不要包含任何 markdown 標記）：
{
  "chapterTitle": "第 1 回．【原創吸睛標題】",
  "statusPanel": {
    "timeLocation": "具體時空地點（如：2026年5月12日 21:30 台北市士林區...）",
    "tension": 【依劇情張力給出 0~100 整數，初次見面高壓對峙約 60~75】,
    "tensionLabel": "【依 tension 數值原創描述，如：高壓對峙 · 步步緊逼】",
    "intoxication": 0,
    "intoxicationLabel": "完全清醒",
    "favorabilityDelta": 【依主角言行給 -5~+10 整數】,
    "favorabilityReason": "【原因說明】",
    "outfit": "角色著裝神態（依主角性別與職業原創高級迷人穿搭、香氣與神態）",
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
    "relationshipChanges": { "${profile.targetLeadName || '主要對象'}": 0 },
    "questProgress": "本回實際推進的任務狀態；沒有則留空字串"
  },
  "prose": "【800–1200 個中文字為建議範圍；完成一個有因果的戲劇節拍，保留具體餘波，不截斷、不灌水、不以旁白解釋潛台詞】",
  "choices": [
    { "id": "A", "label": "[A] 【25–60 字：一個明確行動＋必要對白】", "risk": "low", "hint": "【10–24 字策略提示】" },
    { "id": "B", "label": "[B] 【25–60 字：不同策略的一個行動＋必要對白】", "risk": "medium", "hint": "【10–24 字策略提示】" },
    { "id": "C", "label": "[C] 【25–60 字：高風險破局行動＋必要對白】", "risk": "high", "hint": "【10–24 字策略提示】" }
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
- 成人情慾模式 (R-18)：開啟

- 玩家自訂開局情境：${customScenario || '深夜暴雨台北，帶著關鍵政商洗錢密錄暗帳初次入局'}

請根據以上設定與開局情境創作第 1 回。直接從一個正在發生的具體動作切入，讓人物意圖透過選擇、對話潛台詞與場景細節浮現；不要先介紹世界觀，也不要用旁白宣告角色危險、迷人或充滿性張力。最後生成三個精簡且真正不同策略的抉擇。全文「像、彷彿、如同、宛如」合計不得超過 3 次。`;

  return { systemPrompt, userPrompt };
}

function buildNextTurnPrompt(turnCount, choiceId, customInput, profile, historyList, summaryPool, saveState = state.saveState) {
  const isShura = profile.targetLead === '修羅場' || profile.targetLeadName === '修羅場';
  const leadKey = profile.targetLead || '01_徐令謙';
  
  // 提取最近回合文本與玩家輸入進行配角掃描
  const lastChapter = (historyList || [])[(historyList || []).length - 1] || {};
  const lastProseText = lastChapter.prose || '';
  const playerActionText = customInput || choiceId;

  // 1. 動態偵測在場配角
  const activeNPCs = detectActiveNPCs(lastProseText, playerActionText, leadKey, profile.supportingLeads || []);
  // 在場配角可能是本局第一次登場，順手調閱其角色卡（下一回即可用上全文）
  fetchCharacterLore(activeNPCs.slice(0, LORE_TIER2_LIMIT).map(n => n.id)).catch(() => {});
  const characterPromptBlock = assembleCharacterPromptBlock(leadKey, activeNPCs, isShura);

  // 2. 上下文信封各區塊（見 CONTEXT_BUDGET 的說明）
  const playerBlock = buildPlayerProfileBlock(profile);
  const dossierBlock = buildActDossierBlock(saveState);
  const recentHistory = buildRecentHistoryBlock(historyList, saveState);
  const pinnedMemoryBlock = buildPinnedMemoryBlock(historyList, saveState);
  const liveStateBlock = buildLiveStateBlock(saveState, profile);
  const summaryBlock = summaryPool ? `【長期劇情摘要池（中期劇情的濃縮事實）】\n${summaryPool}\n` : '';
  const literaryCraftBlock = buildLiteraryCraftBlock(turnCount, historyList);

  const systemPrompt = `你是連載長篇小說作者，同時負責維持互動故事的狀態資料。正文必須先像可出版的小說成立，再正確填寫遊戲欄位。
${CHARACTER_IDENTITY_FIREWALL}
【最高指導原則：全量人物設定 100% 絕對對標（最高約束力）】：
1. 【嚴格對標座車與配件】：提及角色出入或座車時，必須 100% 使用其設定檔中的指定座車（例如：楊紹宸為私人鐵灰 Audi RS7 / 公務黑色 Benz S680 配司機，絕非邁巴赫；徐令謙為 BMW M760i / X6 M60i；韓正寰為 Škoda Enyaq；邵翊衡為 Porsche 911 / Audi A8；徐宇寧為 Volvo XC60；徐承勳為 Audi A8 L 防彈裝甲車 / Jaguar F-Type；江瀚文為 Aston Martin DBS 等），嚴禁 AI 自行隨意發明！
2. 【嚴格對標官方職銜與稱謂】：必須使用精準官方職稱（徐令謙在正式、政商場合稱「徐顧問」，熟識者、天裕會與江湖人物稱「謙哥」，不得另造老派排行尊稱；楊紹宸為弘楊集團「副總/楊副總/二哥」，絕非少東；韓正寰為「主任檢察官/白日判官」；徐宇寧為「明隱牙醫院長兼專職牙醫」，絕非檢警或黑道；沈湛然為「台大醫院精神科主治醫師」，絕非院長或外科）。
3. 【嚴格對標專屬說話風格與語句】：必須嚴格參照各角色設定檔中的口吻與範例台詞。徐令謙必須冷靜、自持、紳士，台詞簡潔有份量，不油條、不浮誇、不逞兇鬥狠；對玩家尊重自主，以克制形成張力，力量只朝向外部風險。不得把冷靜寫成冷酷、保護寫成控制、佔有慾寫成剝奪自由。
4. 【血緣與親情既定事實】：楊慕璃與二哥楊紹宸同住陽明山大宅，熟知彼此生活習慣，嚴禁任何初次見面的陌生化描寫！

${literaryCraftBlock}

請嚴格遵守《情慾文學指引》與《系統核心指令》：
1. 嚴格依據玩家最新行動推進。prose 建議 800–1200 個中文字，依場景自然增減；完成一個有因果、會改變局勢或關係的戲劇節拍，不要求每回高潮或封口，不截斷、不灌水。
2. 描寫要求：以人物選擇、實際風險、距離變化、對話潛台詞及具體感官細節形成成人情慾與權力博弈；不得只提高形容詞強度，使用純台灣繁體中文。
   - 徐令謙專屬例外：他的張力來自風度、克制、可靠承擔與深情守護；給玩家自由並在暗處備妥保險。除非玩家主動表達偏好，不得預設威脅、羞辱、疼痛、強迫或封鎖退路。
3. 絕不重複前篇標題與對話；每回必須產生新資訊、選擇代價或關係偏移，但不必機械式升級衝突。
3-A. 【時空連續性】本回必須從上一回最後的時間、地點與人物物理位置接續。若 timeLocation 改變，prose 必須明寫離開、移動、抵達或時間流逝的過程；嚴禁狀態面板靜默跳到新地點。連續對話或同一場景原則上只能自然推進數分鐘；若時鐘跳動超過 30 分鐘，正文必須明確交代經過多久與期間發生何事，不得自行從深夜跳到凌晨數小時後。
3-B. 【核心人物連續性】主要攻略對象若上一回仍在場，本回必須延續其反應或明寫其離場／暫時分開；不得無故消失、換人或重置彼此已知情報。若本回合理分線，也要保留其未完成承諾與下一個可追蹤連結。
4. 【數值真實性運算規則】：
   - tension（張力值 0~100）：依據當前壓迫感/物理距離/對峙危險度給出具體整數。
   - intoxication（微醺度 0~100）：【物理法則】只有在正文中實際喝了酒才會增加（一杯酒+15~20）；若無任何飲酒情節，微醺度保持原值或隨時間代謝衰減 5%！
   - favorabilityDelta（好感度變動 -5~+10）：依據主角此舉是否合乎該男主性格給予增減（精準博弈 +2~+5，重大浪漫/致命共犯 +8~+10，失誤冒犯 -2~-5）。
   - 【線索與籌碼狀態機】：只能操作【當前數值狀態】列出的可用線索 ID。正文真的取得新線索才放入 intelDelta.add；使用、公開、交付、證偽既有線索時，必須在 intelDelta.update 更新 status 或 confidence。沒有變動時兩個陣列都留空。
5. 【三層角色設定集】：
${characterPromptBlock}
${buildLoreRecalibrationNote(turnCount, profile.targetLeadName || '主要對象')}

6. 輸出必須為合法純 JSON 格式（不要包含 markdown 代碼標記）：
{
  "chapterTitle": "第 1 幕 第 ${turnCount} 回：【全新章節標題】",
  "prose": "【800–1200 個中文字為建議範圍；緊接玩家行動，完成一個有因果的戲劇節拍並保留具體餘波；不截斷、不灌水、不解釋潛台詞】",
  "statusPanel": {
    "timeLocation": "時空地點",
    "tension": 70,
    "tensionLabel": "高壓對峙",
    "intoxication": 0,
    "intoxicationLabel": "清醒",
    "favorabilityDelta": 4,
    "favorabilityReason": "機鋒應對擊中軟肋",
    "outfit": "角色著裝神態",
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
    "relationshipChanges": { "${profile.targetLeadName || '主要對象'}": 0 },
    "questProgress": "本回實際推進的任務狀態；沒有則留空字串"
  },
  "choices": [
    { "id": "A", "label": "[A] 【25–60 字：一個明確行動＋必要對白】", "risk": "low", "hint": "【10–24 字提示】" },
    { "id": "B", "label": "[B] 【25–60 字：不同策略的一個行動＋必要對白】", "risk": "medium", "hint": "【10–24 字提示】" },
    { "id": "C", "label": "[C] 【25–60 字：高風險破局行動＋必要對白】", "risk": "high", "hint": "【10–24 字提示】" }
  ]
}`;

  // 由遠而近排列：幕篇檔案 → 摘要池 → 近期全文 → 當前數值 → 本回行動。
  // 最新且最需要精準銜接的資訊放在結尾，模型對結尾的注意力最強。
  const userPrompt = [
    playerBlock,
    '',
    `【目前進度】第 ${saveState?.meta?.currentAct || 1} 幕 · 第 ${turnCount} 回`,
    '',
    dossierBlock,
    summaryBlock,
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
    '若本回變更 timeLocation，正文必須先敘明移動或時間流逝；連續場景不可讓時鐘無故跳超過 30 分鐘。若主要攻略對象離場，正文必須明寫離場原因與未完成的關係線。',
    '全文「像、彷彿、如同、宛如」合計不得超過 3 次；不要使用近期已列出的套路語或近義改寫。'
  ].filter(part => part !== undefined && part !== null).join('\n');

  return { systemPrompt, userPrompt };
}

async function triggerRollingSummaryUpdate(turnCount) {
  if (!state.saveState || turnCount <= 1 || !state.token || state.token.startsWith('tok_local_')) return;
  console.log(`[MemoryPipeline] Triggering rolling summary compression for Turn ${turnCount}...`);

  const recent5Turns = (state.chapterHistoryList || []).slice(-5).map(h => ({
    turn: h.turn,
    title: h.chapterTitle,
    action: h.chosenLabel,
    prose: clampBlock(h.prose, CONTEXT_BUDGET.recentProsePerTurn),
    offeredChoices: (h.choices || []).map(choice => choice.label).filter(Boolean)
  }));

  const systemPrompt = '你是小說記憶統整引擎。請將現有摘要與最新 5 回合完整故事紀錄濃縮為 1,000 ~ 1,500 字元高資訊密度摘要池。務必保留關鍵對話與承諾、人物知道或不知道的資訊、場景位置與時間、物品、關係轉折、重大線索及尚未完成的行動。請一律使用台灣繁體中文輸出純文字摘要，不要多餘寒暄。';
  const userPrompt = `--- 現有摘要池 ---\n${state.saveState.summaryPool || '（初始開局）'}\n\n--- 待整合的最新回合記錄 ---\n${JSON.stringify(recent5Turns, null, 2)}\n\n【請直接輸出更新後的純摘要文字】：`;

  try {
    const response = await fetch(state.gasApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        action: 'llm/proxy',
        model: 'aion-3.0-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 2000,
        token: state.token,
        userId: state.userId
      }),
      redirect: 'follow'
    });

    if (response.ok) {
      const data = await response.json();
      const newSummary = data.success && data.data?.content?.trim();
      if (newSummary && newSummary.length > 20) {
        state.saveState.summaryPool = clampSummaryPool(newSummary);
        safeLocalStorageSet('undercurrent_current_save_state', JSON.stringify(state.saveState));
        console.log(`[MemoryPipeline] Summary Pool successfully updated (${newSummary.length} chars).`);
        syncStateToGoogleDriveCloud(state.saveState, state.chapterData);
      }
    }
  } catch (err) {
    console.warn('[MemoryPipeline] Summary update failed in background:', err.message);
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

  safeLocalStorageSet('undercurrent_current_player_profile', JSON.stringify(profile));

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

  safeLocalStorageSet('undercurrent_current_save_state', JSON.stringify(state.saveState));
  renderSaveState();

  switchView('gameplay');
  showLoading('選項確認中……', '正在依照自訂人設與情境即時生成第 1 回……');

  let initialChapter = null;
  try {
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
    if (isGenerationAbortError(aiErr)) {
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
      notifyUser('已中止本次開局生成。', 'info');
      return;
    }
    console.error('[Pure AI] First turn generation error:', aiErr);
    showErrorRecovery('AI 生成逾時，已先為您鋪上臨時開局。可點擊「重新生成」重試第 1 回。', { canRetry: false });
    initialChapter = {
      chapterTitle: `第 1 回．雨夜初會 · ${profile.targetLeadName || '徐令謙'}`,
      prose: `五月深夜，雨水沿著騎樓邊緣落成一道不整齊的簾。\n\n${profile.name}把濕掉的文件袋換到另一隻手。對面的男人先看了封口處的泥痕，才抬眼確認她的身分；他沒有招呼，只替她留住即將闔上的門。`,
      statusPanel: {
        timeLocation: '台北市深夜暴雨街頭',
        tension: '張力值 [75%]',
        intoxication: '微醺度 [20%]',
        outfit: `${profile.name}（高級訂製風衣） ｜ ${profile.targetLeadName || '徐令謙'}`,
        interaction: '目光鎖定',
        rumors: '台北政媒暗潮湧動'
      },
      intelDelta: { add: [], update: [] },
      choices: [
        { id: 'A', label: '[A] 掌局談判：迎上視線開出交換條件', risk: 'low', hint: '展現從容底氣' },
        { id: 'B', label: '[B] 機鋒推拉：言語試探對方底線', risk: 'medium', hint: '心理推拉' },
        { id: 'C', label: '[C] 情慾反撩：主動靠近拉滿性張力', risk: 'high', hint: '極限點火' }
      ]
    };
  } finally {
    hideLoading();
    setGenerationBusy(false);
  }

  initialChapter = auditGeneratedChapter(initialChapter, profile);
  initialChapter.act = 1;
  initialChapter.turn = 1;
  initialChapter.chosenLabel = '【正式開局】';
  applyChapterStateChanges(initialChapter, profile, 1);

  state.chapterData = initialChapter;
  initialChapter.stateSnapshot = JSON.parse(JSON.stringify(state.saveState || {}));
  state.chapterHistoryList = [initialChapter];
  persistChapterHistory(state.chapterHistoryList);
  
  renderStoryStream(initialChapter);
  renderSaveState();
  updateGameplayBreadcrumb();
  
  saveGameStateToSlot('1');
  syncStateToGoogleDriveCloud(state.saveState, initialChapter);
  startServerCooldown(10);
}

async function makeChoice(choiceId, customInput, isRegenerating = false) {
  if (state.isGenerating) return notifyUser('本回合正在生成，請稍候。');
  setGenerationBusy(true);
  state.generationAbortRequested = false;
  const selectedChoice = (state.chapterData?.choices || []).find(choice => choice.id === choiceId);
  const choiceLabel = customInput || selectedChoice?.label || choiceId;

  if (!isRegenerating) {
    state.previousStateSnapshot = {
      saveState: JSON.parse(JSON.stringify(state.saveState || {})),
      chapterData: JSON.parse(JSON.stringify(state.chapterData || {}))
    };
    state.lastChoicePayload = { choiceId, customInput };
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
    safeLocalStorageSet('undercurrent_current_save_state', JSON.stringify(state.saveState));

    let nextChapter = null;

    try {
      const { systemPrompt, userPrompt } = buildNextTurnPrompt(
        state.saveState.turnCount,
        choiceId,
        customInput,
        profile,
        state.chapterHistoryList || [],
        state.saveState.summaryPool || ''
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
      console.warn('[Pure AI] Next turn LLM call failed, generating dynamic fallback turn:', llmErr);
      nextChapter = {
        chapterTitle: `第 1 幕 第 ${state.saveState.turnCount} 回：暗流激盪 · 局勢推進`,
        prose: `${profile.name}的話落下後，桌面那杯沒有人碰過的水仍在慢慢退去霧氣。\n\n對面的男人沒有立刻回答。他把原本準備收起的文件留在原處，指腹壓著紙頁一角，像是在衡量這句話究竟值得哪一種回應。門外傳來電梯抵達的提示音，兩人都沒有回頭。`,
        statusPanel: {
          timeLocation: '台北市深宵密室',
          tension: '張力值 [85%]',
          intoxication: '微醺度 [30%]',
          outfit: `${profile.name} ｜ ${profile.targetLeadName}`,
          interaction: '近距離推拉',
          rumors: '暗流湧動'
        },
        intelDelta: { add: [], update: [] },
        choices: [
          { id: 'A', label: '[A] 步步逼近：直視其眼眸開出底線條件', risk: 'low', hint: '穩健博弈' },
          { id: 'B', label: '[B] 言語挑釁：機鋒試探拉扯對峙節奏', risk: 'medium', hint: '心理戰術' },
          { id: 'C', label: '[C] 肢體反撩：傾身拉近物理距離點燃性張力', risk: 'high', hint: '極限誘惑' }
        ]
      };
    }

    setLoadingPhase('saving', '內容檢查完成，正在套用數值變化並保存本回進度。');
    nextChapter = auditGeneratedChapter(nextChapter, profile, state.chapterHistoryList);
    nextChapter.act = state.saveState.meta.currentAct || 1;
    nextChapter.turn = state.saveState.turnCount;
    applyChapterStateChanges(nextChapter, profile, state.saveState.turnCount);

    nextChapter.chosenLabel = choiceLabel;
    dismissError();

    state.chapterData = nextChapter;
    appendChapterToHistory(nextChapter, choiceLabel);
    renderStoryStream(nextChapter);
    renderSaveState();
    updateGameplayBreadcrumb();

    // ⚡ 每 5 回合自動在背景非同步更新滾動摘要池 (Summary Pool)
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
      showErrorRecovery('推進章節時發生錯誤：' + err.message);
    }
  } finally {
    hideLoading();
    setGenerationBusy(false);
  }
}

function handleCustomActionSubmit() {
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
  makeChoice(sourceChoiceId, val, false);
}

function appendChapterToHistory(chapter, chosenLabel) {
  if (!state.chapterHistoryList) state.chapterHistoryList = [];
  const record = Object.assign({}, chapter, {
    timestamp: new Date().toISOString(),
    chosenLabel: chosenLabel || '玩家行動',
    stateSnapshot: JSON.parse(JSON.stringify(state.saveState || {}))
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
        <span>✦ 玩家行動：</span>
        <span class="text-amber-200 font-sans">${escapeHtml(past.chosenLabel)}</span>
      </div>
    ` : '';

    section.innerHTML = `
      <div class="border-b border-brand-border/40 pb-3">
        <div class="flex justify-between items-center mb-1">
          <div class="font-mono text-xs text-brand-gold tracking-widest uppercase bg-brand-gold/10 inline-block px-2 py-0.5 rounded border border-brand-gold/20">
            第 ${escapeHtml(past.act || 1)} 幕 · 第 ${escapeHtml(past.turn || (i + 1))} 回合
          </div>
          ${past.timestamp ? `<span class="font-mono text-[11px] text-slate-500">${new Date(past.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>` : ''}
        </div>
        <h2 class="font-serif text-xl sm:text-2xl font-black text-slate-100">${escapeHtml(past.chapterTitle || '未命名章節')}</h2>
      </div>
      ${decisionPill}
      <article class="font-serif prose-tc is-past select-text">${paragraphsHtml}</article>
      <div class="flex flex-wrap justify-end gap-2 pt-2 border-t border-brand-border/30">
        <button class="past-pin-btn px-2.5 py-1.5 rounded-full border border-brand-border text-[11px] ${past.memoryPinned ? 'text-brand-gold border-brand-gold/50' : 'text-slate-500'} cursor-pointer" data-turn="${escapeHtml(past.turn || (i + 1))}">${past.memoryPinned ? '📌 已標記重要' : '📌 標記重要'}</button>
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
      <span>✦ 玩家行動：</span>
      <span class="text-amber-200 font-sans">${escapeHtml(activeRecord.chosenLabel)}</span>
    </div>
  ` : '';

  activeSection.innerHTML = `
    <div class="flex justify-between items-start gap-2 border-b border-brand-border pb-4">
      <div>
        <div class="inline-block font-mono text-xs text-brand-gold tracking-widest uppercase bg-brand-gold/10 border border-brand-gold/20 px-2.5 py-1 rounded mb-2">
          第 ${escapeHtml(currentActNum)} 幕 · 第 ${escapeHtml(currentTurnNum)} 回合（最新進度）
        </div>
        <h1 class="font-serif text-2xl sm:text-3xl font-black text-white leading-tight">
          ${escapeHtml(activeChapter.chapterTitle || '未命名章節')}
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
        ${activeChapter.statusPanel?.favorabilityDelta ? `
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
      <button id="stream-pin-memory-btn" class="px-3 py-1.5 rounded-full border ${activeRecord?.memoryPinned ? 'border-brand-gold/60 text-brand-gold' : 'border-brand-border text-slate-500'} text-[11px] cursor-pointer">${activeRecord?.memoryPinned ? '📌 已標記重要' : '📌 標記重要'}</button>
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
    row.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="font-mono text-[10px] shrink-0 opacity-70">第 ${ch.act || 1}-${turn} 回</span>
        <span class="font-serif font-bold truncate">${escapeHtml(ch.chapterTitle || '未命名章節')}</span>
        ${isCurrent ? '<span class="ml-auto text-[10px] font-mono shrink-0">目前</span>' : ''}
      </div>
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
    const title = state.chapterData.chapterTitle || `第 ${turn} 回`;
    desc.textContent = title;
    if (meta) {
      meta.style.display = 'flex';
      meta.innerHTML = `
        <span class="px-2 py-0.5 rounded bg-sky-950/60 border border-sky-700/50 text-sky-300 font-mono">第 ${act} 幕 · 第 ${turn} 回</span>
        <span class="px-2 py-0.5 rounded bg-brand-gold/15 border border-brand-gold/30 text-brand-gold">🎯 ${escapeHtml(profile.targetLeadName || '修羅場')}</span>
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
            ✏️ 編輯
          </button>
          ${!p.isDefault ? `
            <button class="rename-profile-btn px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white text-xs border border-brand-border transition cursor-pointer" data-key="${escapeHtml(p.key)}">
              🏷️ 重新命名
            </button>
            <button class="delete-profile-btn px-2 py-1 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white text-xs border border-rose-800/40 transition cursor-pointer" data-key="${escapeHtml(p.key)}">
              🗑️ 刪除
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
    opt.textContent = `📁 【自訂】${prof.name}（${(prof.profession || '').slice(0, 10)}...）`;
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

/** 摘要池上限：CONFIG.PIPELINE.SUMMARY_POOL_MAX_CHARS 對應的前端硬夾制 */
const SUMMARY_POOL_MAX_CHARS = 2000;
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

function renderMemoryCenter() {
  const container = dom.memoryCenterContent;
  if (!container) return;
  const summary = state.saveState?.summaryPool || '目前尚未建立長期摘要；近期回合仍以完整正文保留。';
  const pinned = getPinnedMemories();
  const sp = state.chapterData?.statusPanel || {};
  const rels = state.saveState?.relationships || {};
  const recentCount = Math.min(CONTEXT_BUDGET.recentTurns, (state.chapterHistoryList || []).length);
  const pinnedHtml = pinned.length ? pinned.map(ch => `
    <article class="p-3 rounded-xl bg-brand-card border border-brand-border space-y-1.5">
      <div class="flex items-center justify-between gap-2">
        <strong class="font-serif text-brand-gold">第 ${escapeHtml(ch.turn || '?')} 回 · ${escapeHtml(ch.chapterTitle || '重要回合')}</strong>
        <button class="memory-unpin-btn text-[11px] text-rose-500 hover:text-rose-700 cursor-pointer" data-turn="${escapeHtml(ch.turn || '')}">取消釘選</button>
      </div>
      ${ch.chosenLabel ? `<div class="text-slate-500">玩家行動：${escapeHtml(ch.chosenLabel)}</div>` : ''}
      <p class="text-slate-600 leading-relaxed">${escapeHtml(String(ch.prose || '').slice(0, 260))}${String(ch.prose || '').length > 260 ? '……' : ''}</p>
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
        <div class="p-3 rounded-xl bg-brand-card border border-brand-border"><span class="text-slate-500">角色關係</span><div class="mt-1 text-slate-700">${escapeHtml(Object.entries(rels).map(([k,v]) => `${k} ${v}/100`).join('、') || '尚未記錄')}</div></div>
      </div>
    </section>
    <section class="space-y-2"><h4 class="font-serif font-bold text-brand-gold">玩家釘選的重要記憶（${pinned.length}）</h4>${pinnedHtml}</section>
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
        prose: String(chapter.prose || '').slice(0, 1200),
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
  const title = String(state.chapterData.chapterTitle || '未命名章節').replace(/^第[^：:]*[：:]?\s*/, '').slice(0, 28);
  const name = `分歧・第${turn}回・${title}`;
  createNamedSave(name, { branchOrigin: { turn, title: state.chapterData.chapterTitle || '' } });
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
  createCurrentStoryFork();
  state.saveState = JSON.parse(JSON.stringify(target.stateSnapshot));
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
    id: 'save_' + Date.now(),
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

  // 1. 如果當前有正在進行中的遊戲進度，在最上方提供【🟢 進行中的最新冒險進度 (AutoSave)】大卡片
  if (state.chapterData && state.saveState && !search) {
    const p = state.playerProfile || state.saveState?.meta?.playerProfile || {};
    const turn = state.saveState?.turnCount || 1;
    const lead = p.targetLeadName || p.targetLead || '主線';
    const title = state.chapterData.chapterTitle || `第 ${turn} 回`;
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
          <span class="text-slate-400">🎯 攻略男主：</span>
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
            <span>💾</span>
            <span>儲存為新檔</span>
          </button>
          <button class="active-sync-drive-btn px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-blue-100 font-bold transition text-xs border border-blue-600/50 cursor-pointer flex items-center gap-1">
            <span>☁️</span>
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
    const chTitle = s.chapterTitle || `第 ${turn} 回`;
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
          <span>🕒</span>
          <span>${escapeHtml(s.timestamp || '-')}</span>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3 text-xs">
        <div class="flex items-center gap-1.5 bg-brand-dark/80 px-2.5 py-1 rounded border border-brand-border/60">
          <span class="text-slate-400">主角：</span>
          <span class="font-bold text-white">${escapeHtml(p.name || '女主')}</span>
        </div>
        <div class="flex items-center gap-1.5 bg-brand-dark/80 px-2.5 py-1 rounded border border-brand-border/60">
          <span class="text-slate-400">🎯 攻略：</span>
          <span class="font-bold text-amber-300">${escapeHtml(lead)}</span>
        </div>
        <div class="flex items-center gap-1.5 bg-brand-dark/80 px-2.5 py-1 rounded border border-brand-border/60">
          <span class="text-slate-400">📖 進度：</span>
          <span class="font-bold text-sky-300">第 ${escapeHtml(turn)} 回（${escapeHtml(chTitle)}）</span>
        </div>
        ${s.branchOrigin ? `<div class="flex items-center gap-1.5 bg-purple-50 px-2.5 py-1 rounded border border-purple-200"><span class="text-purple-600">⑂ 分歧來源：</span><span class="font-bold text-purple-700">第 ${escapeHtml(s.branchOrigin.turn || '?')} 回</span></div>` : ''}
        <div class="flex items-center gap-2 text-[11px] text-slate-400 ml-auto">
          <span>🌡️ 張力: <b class="text-rose-400">${escapeHtml(tension)}%</b></span>
          <span>🍷 微醺: <b class="text-amber-400">${escapeHtml(tipsy)}%</b></span>
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
          <span>✏️</span>
          <span>重新命名</span>
        </button>
        <button class="sync-single-archive-btn px-3 py-1.5 rounded-lg bg-blue-950/70 hover:bg-blue-900 text-blue-200 hover:text-white transition text-xs border border-blue-700/50 cursor-pointer flex items-center gap-1" data-id="${escapeHtml(s.id || '')}">
          <span>☁️</span>
          <span>手動同步此檔至雲端（可跨裝置遊戲）</span>
        </button>
        <button class="delete-archive-btn px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white transition text-xs border border-rose-800/40 cursor-pointer flex items-center gap-1" data-id="${escapeHtml(s.id || '')}">
          <span>🗑️</span>
          <span>刪除</span>
        </button>
      </div>
    `;

    card.querySelector('.load-archive-btn')?.addEventListener('click', () => loadNamedSave(s.id));
    card.querySelector('.rename-archive-btn')?.addEventListener('click', () => renameNamedSave(s.id));
    card.querySelector('.sync-single-archive-btn')?.addEventListener('click', () => {
      syncStateToGoogleDriveCloud(s.saveState, s.chapterData, true);
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
        <span class="text-brand-gold">💾</span>
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
          ✦ 以此男主開局 →
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
  if (dom.profileCardLead) dom.profileCardLead.textContent = `攻略對象：${profile.targetLeadName || '修羅場'} ｜ R-18：${profile.allowR18 ? '開啟' : '關閉'}`;

  if (dom.relationshipsList) {
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
      regeneratedChapter.stateSnapshot = JSON.parse(JSON.stringify(state.saveState || {}));
      state.chapterData = regeneratedChapter;
      state.chapterHistoryList = [regeneratedChapter];
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
  if (state.previousStateSnapshot) {
    state.saveState = JSON.parse(JSON.stringify(state.previousStateSnapshot.saveState));
    state.chapterData = JSON.parse(JSON.stringify(state.previousStateSnapshot.chapterData));
    if (state.chapterHistoryList.length > 1) {
      state.chapterHistoryList.pop();
    }
    safeLocalStorageSet('undercurrent_current_save_state', JSON.stringify(state.saveState));
    persistChapterHistory(state.chapterHistoryList);
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

  if (!state.token || state.token.startsWith('tok_local_')) {
    const actNumber = state.saveState.meta.currentAct || 1;
    const recent = (state.chapterHistoryList || []).slice(-8);
    const localDossier = [
      `# 第 ${actNumber} 幕幕篇檔案（本機濃縮）`,
      clampBlock(state.saveState.summaryPool || '尚無長期摘要。', 1200),
      '## 幕末銜接',
      recent.map(ch => `- 第 ${ch.turn || '?'} 回 ${ch.chapterTitle || ''}：${String(ch.prose || '').slice(0, 160)}`).join('\n')
    ].join('\n\n');
    state.saveState.actDossiers = (Array.isArray(state.saveState.actDossiers) ? state.saveState.actDossiers : [])
      .concat(localDossier).slice(-6);
    state.saveState.meta.currentAct = actNumber + 1;
    state.saveState.meta.contextResetTurn = Math.max(1, Number(state.saveState.turnCount) || 1);
    state.saveState.summaryPool = `【第 ${actNumber} 幕已完結並重整】${clampBlock(state.saveState.summaryPool, 1700)}`;
    safeLocalStorageSet('undercurrent_current_save_state', JSON.stringify(state.saveState));
    updateGameplayBreadcrumb();
    notifyUser('故事記憶整理完成，已進入第 ' + state.saveState.meta.currentAct + ' 幕。', 'success', 5000);
    return;
  }

  showLoading('正在整理故事記憶……', '系統會保留人物關係、數值、物品與重要情節。');
  setGenerationBusy(true);
  try {
    const response = await fetch(state.gasApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'novel/rebase',
        token: state.token,
        userId: state.userId,
        saveState: state.saveState
      }),
      redirect: 'follow'
    });
    const data = await response.json();
    if (!data.success || !data.data?.saveState) {
      throw new Error(data.error?.message || '後端未回傳重整存檔');
    }
    state.saveState = data.data.saveState;
    safeLocalStorageSet('undercurrent_current_save_state', JSON.stringify(state.saveState));
    updateGameplayBreadcrumb();
    renderSaveState();
    notifyUser('故事記憶整理完成，已進入第 ' + state.saveState.meta.currentAct + ' 幕。', 'success', 5000);
  } catch (err) {
    console.error('[Act Rebase] Failed:', err);
    notifyUser('故事記憶整理失敗：' + err.message, 'error', 6000);
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
      model: LLM_CONFIG.PRIMARY_MODEL || 'aion-3.0',
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

  const category = document.getElementById('feedback-category')?.value || '💬 一般心得';
  const content = document.getElementById('feedback-content')?.value.trim();
  const contact = document.getElementById('feedback-contact')?.value.trim() || state.username || '匿名玩家';
  const attachDiag = document.getElementById('feedback-attach-diagnostics')?.checked !== false;

  let rating = '⭐⭐⭐⭐⭐ 5星 (極致沉浸)';
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
    model: LLM_CONFIG.PRIMARY_MODEL || 'aion-3.0',
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
      submitBtn.innerHTML = '<span>🚀</span><span>送出回饋通知</span>';
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
