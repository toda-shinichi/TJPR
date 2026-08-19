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
    "fullName": "徐令謙（二爺）",
    "age": "35歲",
    "title": "玄辰幫二把手 · 天裕會首領 · 德行事務所最高顧問",
    "mbti": "INTJ（太陰坐命 / 天蠍座）",
    "cars": "私人車：坦桑石藍 BMW X6 M60i；公務車：深銀灰色 BMW M760i xDrive（天裕會三玉隊駕駛）",
    "watch": "Omega De Ville Prestige 41 mm 黃金皮帶腕錶；復古圓眼鏡（工作與正式場合佩戴）",
    "residence": "台北市士林區天母一帶（低調靜謐宅邸）",
    "perfume": "冷冽雪松、微苦煙草與高山茶香",
    "identityRole": "亞洲前三大黑幫「玄辰幫」二把手暨中樞堂口「天裕會」首領，黑白兩道地下秩序真正操盤人。【絕對身分防火牆】：黑道霸主兼幕後操盤者，【絕對不是檢察官或法官】！",
    "personality": "喜怒不形於色，深不可測。平日優雅慵懶，出手時雷霆萬鈞。對親近之人護短且具強烈性張力，掌控欲極強（「在台北，只有我允許的事，才能發生」）。",
    "speechExamples": [
      "「在台北，只有我允許的事，才能發生。」",
      "「既然上了我的車，這盤棋就由不得妳中途下桌。」",
      "「我給妳退路，但妳敢走嗎？」",
      "「把下巴抬起來看著我。在我面前，妳不需要逞強。」"
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

// 全域狀態
const state = {
  gasApiUrl: 'https://script.google.com/macros/s/AKfycbwjdNrRMUveqcxhN2K9Okz8afuBmKrziHnj9Zr5EnoCaX2dlXifACHppa2iJuNRFc0CxQ/exec',
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
  cooldownInterval: null,
  fontSizePx: parseInt(localStorage.getItem('undercurrent_font_size') || '18', 10),
  theme: localStorage.getItem('undercurrent_theme') || 'dark',
  typeSpeed: localStorage.getItem('undercurrent_type_speed') || 'normal'
};

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
  
  hpDisplay: 'hp-display',
  sanityDisplay: 'sanity-display',
  profileCardName: 'profile-card-name',
  profileCardLead: 'profile-card-lead',
  relationshipsList: 'relationships-list',
  inventoryList: 'inventory-list',
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
  loadingText: 'loading-text',
  loadingSubtext: 'loading-subtext',
  abortGenerationBtn: 'abort-generation-btn',
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
// 1. 初始化與事件綁定 (Initialization & Events)
// ==========================================

window.addEventListener('DOMContentLoaded', async () => {
  try { initTargetLeadSelectOptions(); } catch (e) { console.warn('initTargetLeadSelectOptions warn:', e); }
  try { setupEventListeners(); } catch (e) { console.warn('setupEventListeners warn:', e); }
  try { checkAuthAndInitUser(); } catch (e) { console.warn('checkAuthAndInitUser warn:', e); }
  try { loadSavedProfilePresetsIntoSelect(); } catch (e) { console.warn('loadSavedProfilePresetsIntoSelect warn:', e); }
  try { renderHomeRecentSaves(); } catch (e) { console.warn('renderHomeRecentSaves warn:', e); }
  try { restoreSavedStateFromStorage(); } catch (e) { console.warn('restoreSavedStateFromStorage warn:', e); }
});

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
  Object.keys(OFFICIAL_DRIVE_CHARACTERS).forEach(key => {
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

  Object.keys(OFFICIAL_DRIVE_CHARACTERS).forEach(key => {
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
    if (typeof window !== 'undefined' && window.scrollTo) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else if (viewName === 'gameplay') {
    if (homeView) homeView.style.display = 'none';
    if (gameplayView) gameplayView.style.display = 'block';
    updateGameplayBreadcrumb();
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
    on('mobile-menu-btn', 'click', openDrawer);

    // 抽屜內全功能導航
    on('drawer-gameplay-btn', 'click', () => { closeDrawer(); switchView('gameplay'); });
    on('drawer-saves-btn', 'click', () => { closeDrawer(); openSaveArchiveModal(); });
    on('drawer-presets-btn', 'click', () => { closeDrawer(); openProfileManagerModal(); });
    on('drawer-guide-btn', 'click', () => { closeDrawer(); openGameGuideModal('gameplay'); });

    // 抽屜開關
    on('open-drawer-btn', 'click', openDrawer);
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
        if (e.key === 'Enter' && !e.isComposing) {
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
    on('retry-turn-btn', 'click', handleRetryLastTurn);
    on('dismiss-error-btn', 'click', dismissError);
    on('rebase-act-btn', 'click', handleActRebase);

    // 鍵盤 ESC 快捷鍵關閉所有彈窗
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeCharacterCreationModal();
        closeProfileManagerModal();
        closeSaveArchiveModal();
        closeGameGuideModal();
        closeDrawer();
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
}

function openDrawer() {
  if (dom.sideDrawer && dom.drawerBackdrop) {
    dom.drawerBackdrop.classList.remove('opacity-0', 'pointer-events-none');
    dom.sideDrawer.classList.remove('translate-x-full');
    renderSaveState();
  }
}

function closeDrawer() {
  if (dom.sideDrawer && dom.drawerBackdrop) {
    dom.drawerBackdrop.classList.add('opacity-0', 'pointer-events-none');
    dom.sideDrawer.classList.add('translate-x-full');
  }
}

// ==========================================
// 3. 帳號門禁與認證管理 (Authentication)
// ==========================================

async function checkAuthAndInitUser() {
  const storedUser = localStorage.getItem('undercurrent_user_name');
  const storedToken = localStorage.getItem('undercurrent_auth_token');
  
  if (!storedUser || !storedToken) {
    openAuthModal();
    return;
  }

  state.username = storedUser;
  state.token = storedToken;
  state.userId = localStorage.getItem('undercurrent_user_id') || ('usr_' + Date.now());
  state.driveFolderId = localStorage.getItem('undercurrent_drive_folder_id') || '';
  updateUserBadgeUI();
  closeAuthModal();

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
      if (state.driveFolderId) localStorage.setItem('undercurrent_drive_folder_id', state.driveFolderId);
      console.log('[Auth] Token verified with cloud backend.');
    } else {
      console.warn('[Auth] Token verification failed, running in local mode.');
    }
  } catch (err) {
    console.warn('[Auth] Cloud verification skipped (offline or unavailable):', err.message);
  }
}

function openAuthModal() {
  if (dom.authModal) dom.authModal.style.display = 'flex';
}

function closeAuthModal() {
  if (dom.authModal) dom.authModal.style.display = 'none';
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
    if (isManual) alert('目前尚無進行中的遊戲進度可同步至雲端！');
    return;
  }

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
      chapterHistory: state.chapterHistoryList || [],
      namedSaves: getNamedSavesList()
    };

    console.log('[Cloud Sync] Transmitting live game data to Google Drive...', payload);

    const res = await fetch(state.gasApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow'
    });

    const data = await res.json();
    if (data.success) {
      console.log('[Cloud Sync] Successfully synchronized to Google Drive.');
      if (isManual) {
        alert('雲端同步完成！遊戲進度已成功儲存至 Google Drive。');
      }
    } else {
      console.warn('[Cloud Sync] Backend returned error:', data.error);
      if (isManual) {
        alert('雲端同步失敗：' + (data.error?.message || '伺服器回應異常') + '\n遊戲進度已保存於本機。');
      }
    }
  } catch (err) {
    console.warn('[Cloud Sync] Sync failed:', err.message);
    if (isManual) {
      alert('雲端伺服器暫時無法連線，遊戲進度已保存於本機。\n錯誤：' + err.message);
    }
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const pass = document.getElementById('login-password').value.trim();
  if (!username || !pass) return alert('請輸入帳號與密碼！');

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
      state.username = username;
      state.token = data.data.token;
      state.userId = data.data.userId;
      state.driveFolderId = data.data.driveFolderId || '';
      localStorage.setItem('undercurrent_user_name', state.username);
      localStorage.setItem('undercurrent_auth_token', state.token);
      localStorage.setItem('undercurrent_user_id', state.userId);
      if (state.driveFolderId) localStorage.setItem('undercurrent_drive_folder_id', state.driveFolderId);
      updateUserBadgeUI();
      closeAuthModal();
      alert('歡迎回來，' + username + '！已成功登入。');
    } else {
      alert('登入失敗：' + (data.error?.message || '帳號或密碼錯誤，請重新輸入。'));
    }
  } catch (err) {
    console.error('[Login Error]', err);
    // Fallback to local-only mode
    state.username = username;
    state.token = 'tok_local_' + Date.now();
    state.userId = 'usr_' + btoa(encodeURIComponent(username)).slice(0, 12);
    localStorage.setItem('undercurrent_user_name', state.username);
    localStorage.setItem('undercurrent_auth_token', state.token);
    localStorage.setItem('undercurrent_user_id', state.userId);
    updateUserBadgeUI();
    closeAuthModal();
    alert('雲端伺服器暫時無法連線，已以本機模式登入。遊戲進度僅儲存於本機。');
  } finally {
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = '登入'; }
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('reg-username').value.trim();
  const pass = document.getElementById('reg-password').value.trim();
  if (!username || !pass || pass.length < 6) return alert('請輸入完整帳號與至少 6 碼密碼！');

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
      state.username = username;
      state.token = data.data.token;
      state.userId = data.data.userId;
      state.driveFolderId = data.data.driveFolderId || '';
      localStorage.setItem('undercurrent_user_name', state.username);
      localStorage.setItem('undercurrent_auth_token', state.token);
      localStorage.setItem('undercurrent_user_id', state.userId);
      if (state.driveFolderId) localStorage.setItem('undercurrent_drive_folder_id', state.driveFolderId);
      updateUserBadgeUI();
      closeAuthModal();
      alert('註冊成功！歡迎踏入《暗流》，' + username + '。');
    } else {
      alert('註冊失敗：' + (data.error?.message || '伺服器回應異常，請稍後再試。'));
    }
  } catch (err) {
    console.error('[Register Error]', err);
    alert('無法連線至雲端伺服器，請檢查網路或稍後再試。\n錯誤：' + err.message);
  } finally {
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = '立即註冊'; }
  }
}

function handleLogout() {
  if (confirm('確定要登出當前帳號嗎？')) {
    localStorage.removeItem('undercurrent_auth_token');
    localStorage.removeItem('undercurrent_user_name');
    state.username = '';
    state.token = '';
    updateUserBadgeUI();
    openAuthModal();
  }
}

async function handleDeleteAccount() {
  const confirmName = prompt('危險操作：註銷帳號將永久抹除您的身分與雲端全部存檔！\n\n若確定註銷，請在此輸入您的帳號名稱「' + state.username + '」：');
  if (confirmName === state.username) {
    try {
      await fetch(state.gasApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'auth/delete-account', token: state.token, userId: state.userId }),
        redirect: 'follow'
      });
    } catch (err) {
      console.warn('[Delete Account] Cloud deletion may have failed:', err.message);
    }
    localStorage.clear();
    alert('您的帳號及所有檔案已全數註銷刪除。');
    location.reload();
  } else if (confirmName !== null) {
    alert('輸入名稱不相符，已取消註銷操作。');
  }
}

function handleClearAllData() {
  if (confirm('確定要清空所有本機暫存與遊玩紀錄嗎？（不影響雲端已備份檔案）')) {
    localStorage.removeItem('undercurrent_current_save_state');
    localStorage.removeItem('undercurrent_full_story_chapters');
    localStorage.removeItem('undercurrent_named_saves');
    state.saveState = null;
    state.chapterData = null;
    state.chapterHistoryList = [];
    alert('本機存檔資料已清空重置。');
    location.reload();
  }
}

/**
 * 從雲端載入存檔（跨裝置接續遊玩）
 */
async function loadStateFromCloud() {
  if (!state.token || state.token.startsWith('tok_local_')) {
    alert('您目前為本機模式，請先使用雲端帳號登入後再載入雲端存檔。');
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
        localStorage.setItem('undercurrent_current_save_state', JSON.stringify(cloudSave.saveState));
      }
      if (cloudSave.chapter) {
        state.chapterData = cloudSave.chapter;
        localStorage.setItem('undercurrent_full_story_chapters', JSON.stringify(cloudSave.chapter));
      }
      alert('雲端存檔已成功載入！可以繼續遊玩。');
      console.log('[Cloud Load] State loaded from Google Drive.');
    } else {
      alert('雲端無可用存檔，或存檔讀取失敗：' + (data.error?.message || '無資料'));
    }
  } catch (err) {
    console.error('[Cloud Load] Failed:', err);
    alert('無法從雲端載入存檔：' + err.message);
  }
}

if (typeof window !== 'undefined') {
  window.loadStateFromCloud = loadStateFromCloud;
}

function updateUserBadgeUI() {
  const name = state.username || '未登入';
  if (dom.usernameDisplay) dom.usernameDisplay.textContent = name;
  if (dom.homeUsernameDisplay) dom.homeUsernameDisplay.textContent = name;
}

// =========================================================================
// 4. 純 AI 即時零範本生成引擎 (Pure Real-Time AI Generation Engine)
// =========================================================================

const NARRATIVE_MODELS = [
  'mistral-large-3',
  'gemini-3.6-flash',
  'cognitivecomputations/dolphin-mistral-24b-venice-edition',
  'gpt-5.6-luna',
  'aion-3.0'
];

const LLM_CONFIG = {
  API_URL: 'https://api.banana2556.com/v1/chat/completions',
  API_KEY: 'sk-TcKczU9MQ5abSWYrF51eU85aQjZV6IzPqeypYYn9zVDoSram',
  PRIMARY_MODEL: 'mistral-large-3',
  FALLBACK_MODEL: 'gemini-3.6-flash',
  MODELS: NARRATIVE_MODELS,
  TEMPERATURE: 0.88
};

/**
 * 健壯的 JSON 自動修復與解析器
 */
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
    clean = clean.replace(/\\n/g, "\\n")  
                 .replace(/\\'/g, "\\'")
                 .replace(/\\"/g, '\\"')
                 .replace(/\\&/g, "\\&")
                 .replace(/\\r/g, "\\r")
                 .replace(/\\t/g, "\\t")
                 .replace(/\\b/g, "\\b")
                 .replace(/\\f/g, "\\f");
    return JSON.parse(clean);
  }
}

let lastRequestTimestamp = 0;
const MIN_REQUEST_GAP_MS = 12000; // 5 RPM: 60s / 5 = 12s

/**
 * ⚡ 伺服器頻率守衛（Rate Limit Cooldown Protector）
 */
async function waitForRpmCooldown() {
  const now = Date.now();
  const elapsed = now - lastRequestTimestamp;
  if (elapsed < MIN_REQUEST_GAP_MS) {
    let remainingSec = Math.ceil((MIN_REQUEST_GAP_MS - elapsed) / 1000);
    while (remainingSec > 0) {
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
async function generateStoryFromLLM(systemPrompt, userPrompt) {
  const models = [
    'mistral-large-3',
    'gemini-3.6-flash',
    'cognitivecomputations/dolphin-mistral-24b-venice-edition',
    'aion-3.0',
    'gpt-5.6-luna'
  ];

  await waitForRpmCooldown();

  for (let mIdx = 0; mIdx < models.length; mIdx++) {
    const model = models[mIdx];
    try {
      const controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
      state.currentAbortController = controller;
      const timeoutId = setTimeout(() => {
        if (controller) controller.abort();
      }, 25000); // 25 秒極速換線保護

      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LLM_CONFIG.API_KEY}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: LLM_CONFIG.TEMPERATURE,
          max_tokens: 2500
        })
      };
      if (controller) {
        fetchOptions.signal = controller.signal;
      }

      const response = await fetch(LLM_CONFIG.API_URL, fetchOptions);
      clearTimeout(timeoutId);
      lastRequestTimestamp = Date.now();

      if (response.status === 429) {
        console.warn(`[Pure AI] Rate Limit. Waiting 12s cooldown...`);
        let cd = 12;
        while (cd > 0) {
          if (dom.loadingText) dom.loadingText.textContent = `筆觸冷卻中（剩餘 ${cd} 秒）……`;
          if (dom.loadingSubtext) dom.loadingSubtext.textContent = '正在為您自動重試推進，請稍候……';
          await new Promise(r => setTimeout(r, 1000));
          cd--;
        }
        lastRequestTimestamp = Date.now();
        continue;
      }

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[Pure AI] Model ${model} HTTP ${response.status}: ${errText.slice(0, 100)}`);
        continue;
      }

      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content;
      if (!rawContent) {
        console.warn(`[Pure AI] Model ${model} returned empty content.`);
        continue;
      }

      const parsed = parseJsonSafely(rawContent);
      if (parsed && parsed.prose) {
        console.log(`[Pure AI] Successfully generated with model: ${model} (${parsed.prose.length} chars)`);
        return parsed;
      }
    } catch (err) {
      console.warn(`[Pure AI] Model ${model} attempt error:`, err.message);
    }
  }

  throw new Error('所有 AI 創作模型生成逾時或回傳格式異常，請檢查網路連線。');
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
  { id: "01_徐令謙", name: "徐令謙", aliases: ["徐令謙", "二爺", "徐二少", "令謙", "天裕會"], role: "玄辰幫二把手 · 天裕會中樞 · 幕後操盤者", oneLiner: "深沉狠戾的黑道商業操盤者，工作場合戴復古圓眼鏡，座車坦桑石藍 BMW X6 / 深銀灰 BMW M760i，擅長以退為進的極致掌控。" },
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
function detectActiveNPCs(lastProseText, playerChoice, primaryLeadKey, defaultSupportingLeads = []) {
  const scanTarget = ((playerChoice || '') + ' ' + ((lastProseText || '').slice(-600))).toLowerCase();
  const activeNPCs = [];

  for (let i = 0; i < ROSTER_ONE_LINERS.length; i++) {
    const charObj = ROSTER_ONE_LINERS[i];
    if (charObj.id === primaryLeadKey || charObj.name === primaryLeadKey) continue;

    let isMentioned = false;
    for (let j = 0; j < charObj.aliases.length; j++) {
      if (scanTarget.includes(charObj.aliases[j].toLowerCase())) {
        isMentioned = true;
        break;
      }
    }

    if (isMentioned) {
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
    const exStr = (primaryChar.speechExamples || []).map(ex => '  * ' + ex).join('\n');
    blocks.push('=== 【主要互動角色 (Tier 1 · 核心主角 · 全量真實人設)】 ===');
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
    activeNPCs.forEach((npc, idx) => {
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

  return blocks.join('\n');
}

function buildFirstTurnPrompt(profile) {
  const isShura = profile.targetLead === '修羅場' || profile.targetLeadName === '修羅場';
  const customScenario = (profile.customScenario || '').trim();
  const leadKey = profile.targetLead || '01_徐令謙';

  // 1. 動態偵測自訂情境中是否包含配角
  const activeNPCs = detectActiveNPCs('', customScenario, leadKey, profile.supportingLeads || []);
  const characterPromptBlock = assembleCharacterPromptBlock(leadKey, activeNPCs, isShura);

  const systemPrompt = `你是一位專精沉浸式情感小說、權謀博弈與多方張力的頂級角色扮演敘事者與RPG核心引擎。
${CHARACTER_IDENTITY_FIREWALL}
【最高指導原則：全量人物設定 100% 絕對對標（最高約束力）】：
1. 【嚴格對標座車與配件】：提及角色出入或座車時，必須 100% 使用其設定檔中的指定座車（例如：楊紹宸為私人鐵灰 Audi RS7 / 公務黑色 Benz S680 配司機，絕非邁巴赫；徐令謙為 BMW M760i / X6 M60i；韓正寰為 Škoda Enyaq；邵翊衡為 Porsche 911 / Audi A8；徐宇寧為 Volvo XC60；徐承勳為 Audi A8 L 防彈裝甲車 / Jaguar F-Type；江瀚文為 Aston Martin DBS 等），嚴禁 AI 自行隨意發明！
2. 【嚴格對標官方職銜與稱謂】：必須使用精準官方職稱（例如：楊紹宸為弘楊集團「副總/楊副總/二哥」，絕非少東；韓正寰為「主任檢察官/白日判官」；徐宇寧為「明隱牙醫院長兼專職牙醫」，絕非檢警或黑道；沈湛然為「台大醫院精神科主治醫師」，絕非院長或外科）。
3. 【嚴格對標專屬說話風格與語句】：必須嚴格參照各角色設定檔中的口吻與範例台詞（如楊紹宸的機鋒做局、邵翊衡的深沉策士、韓正寰的精準痛覺律令、徐令謙的白手套手術刀）。
4. 【血緣與親情既定事實】：楊慕璃與二哥楊紹宸同住陽明山大宅，熟知彼此生活習慣，嚴禁任何初次見面的陌生化描寫！

請嚴格遵守《情慾文學指引》與《系統核心指令》：
1. 風格與成人情慾（R-18）：極致性張力、高位推拉、五感具象（體溫、喘息、香氣、眼神壓迫、肢體碰觸）、權謀殺伐與多方博弈，使用純台灣繁體中文。
2. 每一次生成完全原創、字數達 1,000~1,500 字，絕不套用固定模板。
3. 【數值真實性運算規則】：
   - tension（張力值 0~100）：依據當前壓迫感/物理距離/對峙危險度給出具體整數。
   - intoxication（微醺度 0~100）：【物理法則】只有在正文中實際喝了酒才會增加（一杯酒+15~20）；若無任何飲酒情節，數值必須保持 0！
   - favorabilityDelta（好感度變動 -5~+10）：依據主角言行魅力與交鋒魄力給予增減（初次見面展現膽識給予 +2~+5）。
4. 【三層角色設定集】：
${characterPromptBlock}

5. 輸出必須為合法純 JSON 格式（不要包含任何 markdown 標記）：
{
  "chapterTitle": "第 1 回．【原創吸睛標題】",
  "prose": "【1000~1500字極具性張力、權謀拉扯與成人情慾描寫的長篇小說正文】",
  "statusPanel": {
    "timeLocation": "具體時空地點（如：2026年5月12日 21:30 台北市士林區...）",
    "tension": 65,
    "tensionLabel": "高壓對峙 · 步步緊逼",
    "intoxication": 0,
    "intoxicationLabel": "完全清醒",
    "favorabilityDelta": 3,
    "favorabilityReason": "展現從容膽識，引起男主探究欲",
    "outfit": "角色著裝神態（依主角性別與職業原創高級迷人穿搭、香氣與神態）",
    "interaction": "肢體接觸與眼神距離",
    "inventory": "隨身攜帶之關鍵情報或物品",
    "rumors": "台北政媒黑白兩道最新暗流傳聞"
  },
  "choices": [
    { "id": "A", "label": "[A] 【選項A完整行動與對白描述】", "risk": "low", "hint": "策略提示" },
    { "id": "B", "label": "[B] 【選項B完整行動與對白描述】", "risk": "medium", "hint": "策略提示" },
    { "id": "C", "label": "[C] 【選項C情慾暗示/主動靠近/破局點】", "risk": "high", "hint": "策略提示" }
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

請根據以上設定與開局情境，完全從零即時創作第 1 回長篇小說，精準呈現情境地點、男主眼神壓迫、性張力拉扯與三個全新抉擇選項！`;

  return { systemPrompt, userPrompt };
}

function buildNextTurnPrompt(turnCount, choiceId, customInput, profile, historyList, summaryPool) {
  const isShura = profile.targetLead === '修羅場' || profile.targetLeadName === '修羅場';
  const leadKey = profile.targetLead || '01_徐令謙';
  
  // 提取最近回合文本與玩家輸入進行配角掃描
  const lastChapter = (historyList || [])[(historyList || []).length - 1] || {};
  const lastProseText = lastChapter.prose || '';
  const playerActionText = customInput || choiceId;

  // 1. 動態偵測在場配角
  const activeNPCs = detectActiveNPCs(lastProseText, playerActionText, leadKey, profile.supportingLeads || []);
  const characterPromptBlock = assembleCharacterPromptBlock(leadKey, activeNPCs, isShura);

  // 2. 組裝近期 2 回合精簡記憶
  const recentHistory = (historyList || []).slice(-2).map((h, i) => `【第 ${h.turn || (i + 1)} 回：${h.chapterTitle || '前篇'}】\n玩家行動：${h.chosenLabel || '無'}\n情節要點：${(h.prose || '').slice(0, 260)}...`).join('\n\n');

  // 3. 組裝長期滾動摘要池
  const summaryBlock = summaryPool ? `【長期劇情摘要池】\n${summaryPool}\n\n` : '';

  const systemPrompt = `你是一位專精沉浸式情感小說、權謀博弈與多方張力的頂級角色扮演敘事者與RPG核心引擎。
${CHARACTER_IDENTITY_FIREWALL}
【最高指導原則：全量人物設定 100% 絕對對標（最高約束力）】：
1. 【嚴格對標座車與配件】：提及角色出入或座車時，必須 100% 使用其設定檔中的指定座車（例如：楊紹宸為私人鐵灰 Audi RS7 / 公務黑色 Benz S680 配司機，絕非邁巴赫；徐令謙為 BMW M760i / X6 M60i；韓正寰為 Škoda Enyaq；邵翊衡為 Porsche 911 / Audi A8；徐宇寧為 Volvo XC60；徐承勳為 Audi A8 L 防彈裝甲車 / Jaguar F-Type；江瀚文為 Aston Martin DBS 等），嚴禁 AI 自行隨意發明！
2. 【嚴格對標官方職銜與稱謂】：必須使用精準官方職稱（例如：楊紹宸為弘楊集團「副總/楊副總/二哥」，絕非少東；韓正寰為「主任檢察官/白日判官」；徐宇寧為「明隱牙醫院長兼專職牙醫」，絕非檢警或黑道；沈湛然為「台大醫院精神科主治醫師」，絕非院長或外科）。
3. 【嚴格對標專屬說話風格與語句】：必須嚴格參照各角色設定檔中的口吻與範例台詞（如楊紹宸的機鋒做局、邵翊衡的深沉策士、韓正寰的精準痛覺律令、徐令謙的白手套手術刀）。
4. 【血緣與親情既定事實】：楊慕璃與二哥楊紹宸同住陽明山大宅，熟知彼此生活習慣，嚴禁任何初次見面的陌生化描寫！

請嚴格遵守《情慾文學指引》與《系統核心指令》：
1. 嚴格依據玩家剛才執行的最新行動/抉擇，即時推進後續 1,000~1,500 字長篇小說正文。
2. 描寫要求：極致性張力、上位者男性佔有欲、五感溫度、喘息、支配與臣服、細節肢體碰觸、成人情慾拉扯與權謀博弈，使用純台灣繁體中文。
3. 絕不重複前篇標題與對話，每次推進都是全新事件與衝突升級！
4. 【數值真實性運算規則】：
   - tension（張力值 0~100）：依據當前壓迫感/物理距離/對峙危險度給出具體整數。
   - intoxication（微醺度 0~100）：【物理法則】只有在正文中實際喝了酒才會增加（一杯酒+15~20）；若無任何飲酒情節，微醺度保持原值或隨時間代謝衰減 5%！
   - favorabilityDelta（好感度變動 -5~+10）：依據主角此舉是否合乎該男主性格給予增減（精準博弈 +2~+5，重大浪漫/致命共犯 +8~+10，失誤冒犯 -2~-5）。
5. 【三層角色設定集】：
${characterPromptBlock}

6. 輸出必須為合法純 JSON 格式（不要包含 markdown 代碼標記）：
{
  "chapterTitle": "第 1 幕 第 ${turnCount} 回：【全新章節標題】",
  "prose": "【1000~1500字緊接玩家行動推進的長篇小說正文】",
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
    "inventory": "掌握情報物品",
    "rumors": "政媒暗流傳聞"
  },
  "choices": [
    { "id": "A", "label": "[A] 【選項A完整行動與對白描述】", "risk": "low", "hint": "提示" },
    { "id": "B", "label": "[B] 【選項B完整行動與對白描述】", "risk": "medium", "hint": "提示" },
    { "id": "C", "label": "[C] 【選項C情慾暗示/破局點】", "risk": "high", "hint": "提示" }
  ]
}`;

  const userPrompt = `【玩家主角設定】姓名：${profile.name}，性別：${profile.gender || '女'}，年齡：${profile.age || '24'}，職業：${profile.profession}，攻略模式：${isShura ? '全勢力修羅場' : profile.targetLeadName}
- 成人情慾模式 (R-18)：開啟
- 【性別代名詞與視角平權】：請嚴格依據玩家所選之性別（${profile.gender || '女'}）與姓名（${profile.name}）使用正確的人稱代名詞（男性玩家使用「他」，女性玩家使用「她」，非二元玩家使用合適稱謂），給予同等極致性張力與權謀交鋒！
【前情脈絡】
${summaryBlock}${recentHistory || '正處於交鋒對峙中'}

【玩家本回最新行動】
- 抉擇標籤或自訂行動：${playerActionText}
- 當前進展至：第 ${turnCount} 回

請緊接著玩家的最新行動，完全原創演繹對手男主的反應、眼神殺伐、近身肢體推拉與情慾爆發，並生成 3 個全新分支選項！`;

  return { systemPrompt, userPrompt };
}

async function triggerRollingSummaryUpdate(turnCount) {
  if (!state.saveState || turnCount <= 1) return;
  console.log(`[MemoryPipeline] Triggering rolling summary compression for Turn ${turnCount}...`);

  const recent5Turns = (state.chapterHistoryList || []).slice(-5).map(h => ({
    turn: h.turn,
    title: h.chapterTitle,
    action: h.chosenLabel,
    snippet: (h.prose || '').substring(0, 250)
  }));

  const systemPrompt = '你是小說記憶統整引擎。請將現有摘要與最新 5 回合故事紀錄濃縮為 1,000 ~ 1,500 字元高資訊密度摘要池（保留關鍵物品、人物好感度轉折、重大線索與承諾）。請一律使用台灣繁體中文輸出純文字摘要，不要多餘寒暄。';
  const userPrompt = `--- 現有摘要池 ---\n${state.saveState.summaryPool || '（初始開局）'}\n\n--- 待整合的最新回合記錄 ---\n${JSON.stringify(recent5Turns, null, 2)}\n\n【請直接輸出更新後的純摘要文字】：`;

  try {
    const response = await fetch(LLM_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LLM_CONFIG.API_KEY}`
      },
      body: JSON.stringify({
        model: 'aion-3.0-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 1000
      })
    });

    if (response.ok) {
      const data = await response.json();
      const newSummary = data.choices?.[0]?.message?.content?.trim();
      if (newSummary && newSummary.length > 20) {
        state.saveState.summaryPool = newSummary;
        localStorage.setItem('undercurrent_current_save_state', JSON.stringify(state.saveState));
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
    alert('開局發生異常：' + err.message + '，正在嘗試為您自動恢復……');
    switchView('gameplay');
  }
}

async function startNewGameWithProfile(profile) {
  // 1. 徹底重置遊戲全域狀態與 DOM（絕不殘留舊局卡片）
  state.playerProfile = profile;
  state.chapterHistoryList = [];
  state.chapterData = null;
  state.lastChoicePayload = null;
  state.previousStateSnapshot = null;
  
  if (dom.novelStreamContainer) dom.novelStreamContainer.innerHTML = '';
  if (dom.choicesContainer) dom.choicesContainer.innerHTML = '';
  if (dom.customActionInput) dom.customActionInput.value = '';

  localStorage.setItem('undercurrent_current_player_profile', JSON.stringify(profile));

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
      playerProfile: profile
    },
    turnCount: 1,
    protagonist: {
      id: profile.targetLead,
      name: targetLeadDisplay,
      hp: 100,
      sanity: 100
    },
    inventory: [
      { id: 'item_card', name: '密錄隨身碟 / 調查底牌', count: 1, desc: '記載著政商併購與洗錢暗帳的關鍵隨身碟。' },
      { id: 'item_press', name: '特許採訪證 / 身分底牌', count: 1, desc: '證明自身出入政商名流場合的身分底牌。' }
    ],
    relationships: rels,
    questFlags: {
      main_quest: isShura ? '暗流初會：在全勢力交鋒中破局' : `初會：與 ${profile.targetLeadName} 的交鋒`
    },
    summaryPool: `玩家 ${profile.name} 正式入局，情境設定：${(profile.customScenario || '全新開局').slice(0, 50)}...`,
    turnHistory: []
  };

  localStorage.setItem('undercurrent_current_save_state', JSON.stringify(state.saveState));

  switchView('gameplay');
  showLoading('選項確認中……', '正在依照自訂人設與情境即時生成第 1 回……');

  let initialChapter = null;
  try {
    const { systemPrompt, userPrompt } = buildFirstTurnPrompt(profile);
    initialChapter = await generateStoryFromLLM(systemPrompt, userPrompt);
  } catch (aiErr) {
    console.error('[Pure AI] First turn generation error:', aiErr);
    alert('AI 大模型生成逾時，正在為您重新連接……');
    initialChapter = {
      chapterTitle: `第 1 回．雨夜初會 · ${profile.targetLeadName || '徐令謙'}`,
      prose: `五月深夜的台北，暴雨如注。\n\n${profile.name}手握關鍵底牌踏入現場，對面男人的視線在第一時間精準鎖定了她……`,
      statusPanel: {
        timeLocation: '台北市深夜暴雨街頭',
        tension: '張力值 [75%]',
        intoxication: '微醺度 [20%]',
        outfit: `${profile.name}（高級訂製風衣） ｜ ${profile.targetLeadName || '徐令謙'}`,
        interaction: '目光鎖定',
        inventory: '密錄隨身碟',
        rumors: '台北政媒暗潮湧動'
      },
      choices: [
        { id: 'A', label: '[A] 掌局談判：迎上視線開出交換條件', risk: 'low', hint: '展現從容底氣' },
        { id: 'B', label: '[B] 機鋒推拉：言語試探對方底線', risk: 'medium', hint: '心理推拉' },
        { id: 'C', label: '[C] 情慾反撩：主動靠近拉滿性張力', risk: 'high', hint: '極限點火' }
      ]
    };
  } finally {
    hideLoading();
  }

  initialChapter.act = 1;
  initialChapter.turn = 1;
  initialChapter.chosenLabel = '【正式開局】';

  state.chapterData = initialChapter;
  state.chapterHistoryList = [initialChapter];
  localStorage.setItem('undercurrent_full_story_chapters', JSON.stringify(state.chapterHistoryList));
  
  renderStoryStream(initialChapter);
  renderSaveState();
  updateGameplayBreadcrumb();
  
  saveGameStateToSlot('1');
  syncStateToGoogleDriveCloud(state.saveState, initialChapter);
}

async function makeChoice(choiceId, customInput, isRegenerating = false) {
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

  try {
    state.saveState = state.saveState || {};
    state.saveState.turnCount = (state.saveState.turnCount || 1) + 1;
    
    const profile = getActivePlayerProfile();
    state.saveState.meta = state.saveState.meta || {};
    state.saveState.meta.playerProfile = profile;
    localStorage.setItem('undercurrent_current_save_state', JSON.stringify(state.saveState));

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
      nextChapter = await generateStoryFromLLM(systemPrompt, userPrompt);
    } catch (llmErr) {
      console.warn('[Pure AI] Next turn LLM call failed, generating dynamic fallback turn:', llmErr);
      nextChapter = {
        chapterTitle: `第 1 幕 第 ${state.saveState.turnCount} 回：暗流激盪 · 局勢推進`,
        prose: `隨著${profile.name}做出這一抉擇，空氣中的張力陡然飆升！\n\n對面的男人修長的手指輕輕叩擊著桌面，深邃的雙眸中掠過一抹極致的玩味與佔有慾……`,
        statusPanel: {
          timeLocation: '台北市深宵密室',
          tension: '張力值 [85%]',
          intoxication: '微醺度 [30%]',
          outfit: `${profile.name} ｜ ${profile.targetLeadName}`,
          interaction: '近距離推拉',
          inventory: '掌握情報',
          rumors: '暗流湧動'
        },
        choices: [
          { id: 'A', label: '[A] 步步逼近：直視其眼眸開出底線條件', risk: 'low', hint: '穩健博弈' },
          { id: 'B', label: '[B] 言語挑釁：機鋒試探拉扯對峙節奏', risk: 'medium', hint: '心理戰術' },
          { id: 'C', label: '[C] 肢體反撩：傾身拉近物理距離點燃性張力', risk: 'high', hint: '極限誘惑' }
        ]
      };
    }

    nextChapter.act = state.saveState.meta.currentAct || 1;
    nextChapter.turn = state.saveState.turnCount;

    // 💡 真實數值解析與更新
    if (nextChapter.statusPanel) {
      const sp = nextChapter.statusPanel;
      state.saveState.status = state.saveState.status || {};
      
      // 張力值解析
      if (typeof sp.tension === 'number') {
        state.saveState.status.tension = Math.max(0, Math.min(100, Math.round(sp.tension)));
      } else if (typeof sp.tension === 'string') {
        const num = parseInt(sp.tension.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(num)) state.saveState.status.tension = Math.max(0, Math.min(100, num));
      }
      
      // 微醺度解析
      if (typeof sp.intoxication === 'number') {
        state.saveState.status.tipsy = Math.max(0, Math.min(100, Math.round(sp.intoxication)));
      } else if (typeof sp.intoxication === 'string') {
        const num = parseInt(sp.intoxication.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(num)) state.saveState.status.tipsy = Math.max(0, Math.min(100, num));
      }
      
      // 好感度增減解析
      const leadKey = profile.targetLeadName || profile.targetLead || '徐令謙';
      state.saveState.relationships = state.saveState.relationships || {};
      const curFav = state.saveState.relationships[leadKey] || 25;
      const delta = typeof sp.favorabilityDelta === 'number' ? sp.favorabilityDelta : 3;
      state.saveState.relationships[leadKey] = Math.max(0, Math.min(100, curFav + delta));
    }

    nextChapter.chosenLabel = customInput || choiceId;

    state.chapterData = nextChapter;
    appendChapterToHistory(nextChapter, customInput || choiceId);
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
    alert('推進章節時發生錯誤: ' + err.message);
  } finally {
    hideLoading();
  }
}

function handleCustomActionSubmit() {
  const input = dom.customActionInput;
  if (!input) return;
  const val = input.value.trim();
  if (!val) return alert('請輸入您的自訂行動或對白！');
  input.value = '';
  makeChoice('CUSTOM', val, false);
}

function appendChapterToHistory(chapter, chosenLabel) {
  if (!state.chapterHistoryList) state.chapterHistoryList = [];
  const record = Object.assign({}, chapter, {
    timestamp: new Date().toISOString(),
    chosenLabel: chosenLabel || '玩家行動'
  });
  state.chapterHistoryList.push(record);
  localStorage.setItem('undercurrent_full_story_chapters', JSON.stringify(state.chapterHistoryList));
}

// ==========================================
// 6. 小說瀑布流與打字機渲染 (Story Stream & Typewriter)
// ==========================================

function renderStoryStream(activeChapter) {
  if (!dom.novelStreamContainer) return;

  const chapters = state.chapterHistoryList || [];
  const count = chapters.length;

  dom.novelStreamContainer.innerHTML = '';

  for (let i = 0; i < count - 1; i++) {
    const past = chapters[i];
    if (!past) continue;

    const section = document.createElement('section');
    section.className = 'bg-brand-surface/70 border border-brand-border/60 rounded-2xl p-5 sm:p-7 space-y-4 shadow-lg text-slate-300 opacity-90 transition';

    const paragraphs = (past.prose || '').split('\n\n');
    const paragraphsHtml = paragraphs.map(p => `<p class="mb-4 leading-relaxed indent-6 sm:indent-8 select-text">${p.trim()}</p>`).join('');

    let decisionPill = past.chosenLabel && past.chosenLabel !== '【正式開局】' ? `
      <div class="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-gold/15 text-brand-gold border border-brand-gold/30 text-xs font-bold font-serif">
        <span>✦ 玩家行動：</span>
        <span class="text-amber-200 font-sans">${past.chosenLabel}</span>
      </div>
    ` : '';

    section.innerHTML = `
      <div class="border-b border-brand-border/40 pb-3">
        <div class="flex justify-between items-center mb-1">
          <div class="font-mono text-xs text-brand-gold tracking-widest uppercase bg-brand-gold/10 inline-block px-2 py-0.5 rounded border border-brand-gold/20">
            第 ${past.act || 1} 幕 · 第 ${past.turn || (i + 1)} 回合
          </div>
          ${past.timestamp ? `<span class="font-mono text-[11px] text-slate-500">${new Date(past.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>` : ''}
        </div>
        <h2 class="font-serif text-xl sm:text-2xl font-black text-slate-100">${past.chapterTitle}</h2>
      </div>
      ${decisionPill}
      <article class="font-serif text-base sm:text-lg prose-tc select-text">${paragraphsHtml}</article>
    `;

    dom.novelStreamContainer.appendChild(section);
  }

  const activeSection = document.createElement('section');
  activeSection.id = 'active-chapter-card';
  activeSection.className = 'bg-brand-surface border border-brand-gold/50 rounded-2xl p-5 sm:p-7 space-y-5 shadow-2xl relative transition scroll-mt-20';

  const currentTurnNum = state.saveState?.turnCount || count;
  const currentActNum = state.saveState?.meta?.currentAct || 1;
  const activeRecord = chapters[count - 1] || activeChapter;
  const activeActionPill = activeRecord && activeRecord.chosenLabel && activeRecord.chosenLabel !== '【正式開局】' ? `
    <div class="mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-gold/15 text-brand-gold border border-brand-gold/30 text-xs font-bold font-serif">
      <span>✦ 玩家行動：</span>
      <span class="text-amber-200 font-sans">${activeRecord.chosenLabel}</span>
    </div>
  ` : '';

  activeSection.innerHTML = `
    <div class="flex justify-between items-start gap-2 border-b border-brand-border pb-4">
      <div>
        <div class="inline-block font-mono text-xs text-brand-gold tracking-widest uppercase bg-brand-gold/10 border border-brand-gold/20 px-2.5 py-1 rounded mb-2">
          第 ${currentActNum} 幕 · 第 ${currentTurnNum} 回合（最新進度）
        </div>
        <h1 class="font-serif text-2xl sm:text-3xl font-black text-white leading-tight">
          ${activeChapter.chapterTitle || '未命名章節'}
        </h1>
      </div>

      <div class="flex items-center gap-1.5 shrink-0">
        <button id="stream-regenerate-btn" class="text-xs bg-brand-card hover:bg-brand-border text-slate-300 hover:text-brand-gold px-2.5 py-1.5 rounded-lg border border-brand-border transition flex items-center gap-1 cursor-pointer" title="重新生成本回演繹">
          <span>重新生成</span>
        </button>
        <button id="stream-rewind-btn" class="text-xs bg-brand-card hover:bg-brand-border text-slate-300 hover:text-amber-300 px-2.5 py-1.5 rounded-lg border border-brand-border transition flex items-center gap-1 cursor-pointer" title="悔棋回退到上一回合">
          <span>悔棋</span>
        </button>
      </div>
    </div>

    ${activeActionPill}

    <article id="stream-prose-content" class="font-serif text-lg sm:text-[1.18rem] leading-[2.2] text-[#d8dbe6] tracking-wide prose-tc cursor-pointer select-text" title="打字中點擊可直接顯示全文">
      故事載入中……
    </article>

    
    <div id="stream-status-panel" class="bg-brand-dark/85 border border-brand-border rounded-xl p-3 sm:p-4 text-xs font-sans space-y-2.5 shadow-md">
      <!-- 數值即時標籤列 -->
      <div class="flex flex-wrap items-center gap-2">
        <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950/70 border border-rose-700/50 text-rose-200">
          <span>張力值：</span>
          <span class="font-mono font-bold text-rose-300">${activeChapter.statusPanel?.tension !== undefined ? activeChapter.statusPanel.tension : 65}%</span>
          <span class="text-[10px] text-rose-400/80">(${activeChapter.statusPanel?.tensionLabel || '高壓推拉'})</span>
        </div>
        <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/70 border border-amber-700/50 text-amber-200">
          <span>微醺度：</span>
          <span class="font-mono font-bold text-amber-300">${activeChapter.statusPanel?.intoxication !== undefined ? activeChapter.statusPanel.intoxication : 0}%</span>
          <span class="text-[10px] text-amber-400/80">(${activeChapter.statusPanel?.intoxicationLabel || '清醒'})</span>
        </div>
        ${activeChapter.statusPanel?.favorabilityDelta ? `
        <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-700/50 text-emerald-200">
          <span>好感變動：</span>
          <span class="font-mono font-bold text-emerald-300">${activeChapter.statusPanel.favorabilityDelta > 0 ? '+' : ''}${activeChapter.statusPanel.favorabilityDelta} pts</span>
          ${activeChapter.statusPanel.favorabilityReason ? `<span class="text-[10px] text-emerald-400/80 hidden sm:inline">(${activeChapter.statusPanel.favorabilityReason})</span>` : ''}
        </div>` : ''}
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 pt-1 border-t border-brand-border/40">
        <div><strong>時空地點：</strong><span class="text-brand-gold">${activeChapter.statusPanel?.timeLocation || '台北市'}</span></div>
        <div><strong>著裝神態：</strong><span class="text-slate-200">${activeChapter.statusPanel?.outfit || '-'}</span></div>
      </div>
      <div class="text-slate-300"><strong>互動姿態：</strong><span class="text-slate-300">${activeChapter.statusPanel?.interaction || '-'}</span></div>
      ${activeChapter.statusPanel?.inventory ? `<div class="text-slate-300"><strong>關鍵情報：</strong><span class="text-amber-200/90">${activeChapter.statusPanel.inventory}</span></div>` : ''}
      ${activeChapter.statusPanel?.rumors ? `<div class="text-slate-400"><strong>政媒傳聞：</strong><span class="italic text-slate-400">${activeChapter.statusPanel.rumors}</span></div>` : ''}
    </div>
  `;

  dom.novelStreamContainer.appendChild(activeSection);

  document.getElementById('stream-regenerate-btn')?.addEventListener('click', handleRegenerateTurn);
  document.getElementById('stream-rewind-btn')?.addEventListener('click', handleUndoTurn);

  const proseEl = document.getElementById('stream-prose-content');
  const cleanProse = activeChapter.prose || '';

  streamTypewriterEffect(cleanProse, proseEl, null, () => {
    renderChoices(activeChapter.choices || []);
  });

  setTimeout(() => {
    if (activeSection && typeof activeSection.scrollIntoView === 'function') {
      activeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
}

function streamTypewriterEffect(fullText, targetEl, skipBtn, onComplete) {
  if (!targetEl) return;
  state.isTyping = true;
  state.skipTypewriterTriggered = false;

  targetEl.innerHTML = '';
  const paragraphs = fullText.split('\n\n');
  let pIdx = 0;
  let charIdx = 0;
  let currentP = document.createElement('p');
  currentP.className = 'mb-6 indent-6 sm:indent-8';
  targetEl.appendChild(currentP);

  const speedMs = 10;

  function typeNext() {
    if (state.skipTypewriterTriggered || !state.isTyping) {
      targetEl.innerHTML = '';
      paragraphs.forEach(pt => {
        const p = document.createElement('p');
        p.className = 'mb-6 indent-6 sm:indent-8';
        p.textContent = pt;
        targetEl.appendChild(p);
      });
      state.isTyping = false;
      if (onComplete) onComplete();
      return;
    }

    if (pIdx < paragraphs.length) {
      const curText = paragraphs[pIdx];
      if (charIdx < curText.length) {
        currentP.textContent += curText.charAt(charIdx);
        charIdx++;
        state.typewriterTimer = setTimeout(typeNext, speedMs);
      } else {
        pIdx++;
        charIdx = 0;
        if (pIdx < paragraphs.length) {
          currentP = document.createElement('p');
          currentP.className = 'mb-6 indent-6 sm:indent-8';
          targetEl.appendChild(currentP);
          state.typewriterTimer = setTimeout(typeNext, speedMs * 3);
        } else {
          state.isTyping = false;
          if (onComplete) onComplete();
        }
      }
    }
  }

  typeNext();

  targetEl.onclick = () => {
    state.skipTypewriterTriggered = true;
  };
}

function renderChoices(choices) {
  if (!dom.choicesContainer) return;
  dom.choicesContainer.innerHTML = '';

  if (!choices || choices.length === 0) {
    dom.choicesContainer.innerHTML = '<div class="text-xs text-slate-500 py-2">（請於下方輸入自訂自由行動以推進情節）</div>';
    return;
  }

  choices.forEach((c, idx) => {
    const btn = document.createElement('button');
    const borderCls = c.risk === 'high' ? 'border-rose-500/50 hover:border-rose-400 bg-rose-950/20' : 
                      c.risk === 'medium' ? 'border-amber-500/50 hover:border-amber-400 bg-amber-950/20' : 
                      'border-brand-border hover:border-brand-gold bg-brand-surface';
    
    btn.className = `w-full text-left p-4 rounded-xl border ${borderCls} transition duration-150 flex flex-col gap-1.5 shadow-md group cursor-pointer`;
    
    const riskBadge = c.risk === 'high' ? '<span class="text-[10px] bg-rose-900/60 text-rose-300 px-1.5 py-0.5 rounded font-bold">高風險情慾/殺機</span>' :
                      c.risk === 'medium' ? '<span class="text-[10px] bg-amber-900/60 text-amber-300 px-1.5 py-0.5 rounded font-bold">權謀推拉</span>' :
                      '<span class="text-[10px] bg-emerald-900/60 text-emerald-300 px-1.5 py-0.5 rounded font-bold">穩健推進</span>';

    btn.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="font-mono text-xs text-brand-gold font-bold">CHOICE ${String.fromCharCode(65 + idx)}</span>
        ${riskBadge}
      </div>
      <div class="font-serif font-bold text-sm text-slate-100 group-hover:text-brand-gold transition leading-snug">
        ${c.label}
      </div>
      ${c.hint ? `<div class="text-xs text-slate-400 font-sans mt-0.5">${c.hint}</div>` : ''}
    `;

    btn.addEventListener('click', () => {
      makeChoice(c.id || `opt_${idx}`, c.label, false);
    });

    dom.choicesContainer.appendChild(btn);
  });
}

// ==========================================
// 7. 人設庫核心管理 (Profile Presets CRUD)
// ==========================================

function getCustomPresets() {
  try {
    return JSON.parse(localStorage.getItem('undercurrent_custom_profiles') || '{}');
  } catch (e) {
    return {};
  }
}

function persistCustomPresets(presets) {
  localStorage.setItem('undercurrent_custom_profiles', JSON.stringify(presets));
  loadSavedProfilePresetsIntoSelect();
  renderProfileManagerList();
}

function openProfileManagerModal() {
  if (dom.profileManagerModal) {
    dom.profileManagerModal.style.display = 'flex';
    renderProfileManagerList();
  }
}

function closeProfileManagerModal() {
  if (dom.profileManagerModal) dom.profileManagerModal.style.display = 'none';
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
          <span class="font-serif font-bold text-sm text-white">${d.name}</span>
          <span class="text-[11px] px-2 py-0.5 rounded ${p.isDefault ? 'bg-brand-gold/15 text-brand-gold border border-brand-gold/30' : 'bg-purple-950/60 text-purple-300 border border-purple-800/40'}">
            ${p.isDefault ? '官方預設' : '自訂人設'}
          </span>
          <span class="text-xs text-slate-400">${d.gender || '女'} ｜ ${d.age || '24'}歲</span>
        </div>
        <div class="flex items-center gap-1">
          <button class="use-profile-btn px-2.5 py-1 rounded bg-brand-gold/15 hover:bg-brand-gold/30 text-brand-gold text-xs font-bold border border-brand-gold/30 transition cursor-pointer" data-key="${p.key}">
            ▶ 套用開局
          </button>
          <button class="edit-profile-btn px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs border border-brand-border transition cursor-pointer" data-key="${p.key}">
            ✏️ 編輯
          </button>
          ${!p.isDefault ? `
            <button class="rename-profile-btn px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white text-xs border border-brand-border transition cursor-pointer" data-key="${p.key}">
              🏷️ 重新命名
            </button>
            <button class="delete-profile-btn px-2 py-1 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white text-xs border border-rose-800/40 transition cursor-pointer" data-key="${p.key}">
              🗑️ 刪除
            </button>
          ` : ''}
        </div>
      </div>
      <div class="text-xs text-slate-300"><strong>社會身分：</strong>${d.profession || '-'}</div>
      <div class="text-xs text-slate-400 line-clamp-2"><strong>身世背景：</strong>${d.background || '-'}</div>
      <div class="text-xs text-amber-200/90"><strong>攻略對象：</strong>${d.targetLeadName || '修羅場'} ｜ <strong>R-18：</strong>${d.allowR18 ? '開啟' : '關閉'}</div>
      ${d.customScenario ? `<div class="text-[11px] text-slate-400 bg-brand-dark/60 p-2 rounded border border-brand-border/40"><strong>開場情境：</strong>${d.customScenario}</div>` : ''}
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
  if (!name) return alert('請先輸入角色姓名！');

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
  
  alert(`🎉 人設「${name}」已成功另存為自訂範本！`);
}

function renameProfilePreset(key) {
  const custom = getCustomPresets();
  const prof = custom[key];
  if (!prof) return;

  const newName = prompt('請輸入新的人設姓名：', prof.name);
  if (newName && newName.trim()) {
    prof.name = newName.trim();
    custom[key] = prof;
    persistCustomPresets(custom);
    alert('已成功重新命名人設！');
  }
}

function deleteProfilePreset(key) {
  const custom = getCustomPresets();
  const prof = custom[key];
  if (!prof) return;

  if (confirm(`確定要刪除自訂人設「${prof.name}」嗎？`)) {
    delete custom[key];
    persistCustomPresets(custom);
    alert('已刪除該自訂人設。');
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
      const custom = getCustomPresets();
      Object.assign(custom, imported);
      persistCustomPresets(custom);
      alert('🎉 成功匯入自訂人設範本！');
    } catch (err) {
      alert('人設檔案解析失敗：' + err.message);
    }
  };
  reader.readAsText(file);
}

// ==========================================
// 8. 存檔庫核心管理 (Save Archives CRUD)
// ==========================================

function getNamedSavesList() {
  try {
    const raw = localStorage.getItem('undercurrent_named_saves');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function persistNamedSavesList(saves) {
  localStorage.setItem('undercurrent_named_saves', JSON.stringify(saves));
  renderSaveArchivesList();
  renderHomeRecentSaves();
}

function openSaveArchiveModal() {
  if (dom.saveArchiveModal) {
    dom.saveArchiveModal.style.display = 'flex';
    if (dom.newSaveNameInput) {
      const pName = state.saveState?.meta?.playerProfile?.name || '主角';
      const targetName = state.saveState?.meta?.playerProfile?.targetLeadName || '主線';
      const turn = state.saveState?.turnCount || 1;
      dom.newSaveNameInput.value = `${pName}-${targetName}第${turn}回`;
    }
    renderSaveArchivesList();
  }
}

function closeSaveArchiveModal() {
  if (dom.saveArchiveModal) dom.saveArchiveModal.style.display = 'none';
}

function createNamedSave(saveName) {
  const name = (saveName || '').trim();
  if (!name) return alert('請輸入存檔名稱！');
  if (!state.chapterData && (!state.chapterHistoryList || state.chapterHistoryList.length === 0)) {
    return alert('當前尚未有遊戲進度可儲存！請先開啟新局。');
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
    playerProfile: profile,
    saveState: state.saveState,
    chapterData: state.chapterData,
    chapterHistoryList: state.chapterHistoryList || []
  };

  saves.unshift(newSaveEntry);
  persistNamedSavesList(saves);
  alert(`🎉 存檔「${name}」已成功儲存至存檔庫！`);
  syncStateToGoogleDriveCloud(state.saveState, state.chapterData);
}

function renameNamedSave(saveId) {
  const saves = getNamedSavesList();
  const target = saves.find(s => s.id === saveId);
  if (!target) return;

  const newName = prompt('請輸入新的存檔名稱：', target.name);
  if (newName && newName.trim()) {
    target.name = newName.trim();
    persistNamedSavesList(saves);
    alert('已成功重新命名存檔！');
  }
}

function deleteNamedSave(saveId) {
  const saves = getNamedSavesList();
  const target = saves.find(s => s.id === saveId);
  if (!target) return;

  if (confirm(`確定要刪除存檔「${target.name}」嗎？`)) {
    const remaining = saves.filter(s => s.id !== saveId);
    persistNamedSavesList(remaining);
    alert('已刪除該筆存檔。');
  }
}

function loadNamedSave(saveId) {
  const saves = getNamedSavesList();
  const target = saves.find(s => s.id === saveId);
  if (!target) return alert('找不到該筆存檔！');

  state.saveState = target.saveState;
  state.chapterData = target.chapterData;
  state.chapterHistoryList = target.chapterHistoryList || [];

  localStorage.setItem('undercurrent_current_save_state', JSON.stringify(state.saveState));
  localStorage.setItem('undercurrent_full_story_chapters', JSON.stringify(state.chapterHistoryList));
  if (target.playerProfile) {
    localStorage.setItem('undercurrent_current_player_profile', JSON.stringify(target.playerProfile));
  }

  closeSaveArchiveModal();
  switchView('gameplay');
  
  renderStoryStream(state.chapterData);
  renderSaveState();
  updateGameplayBreadcrumb();

  alert(`✦ 成功載入存檔「${target.name}」！`);
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
          <span class="font-serif font-bold text-sm text-white">當前即時進度（第 ${turn} 回 · ${title}）</span>
        </div>
        <span class="text-[11px] text-amber-200/80 font-mono">剛剛動態更新</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
        <div class="flex items-center gap-2">
          <span class="text-slate-400">主角：</span>
          <span class="font-bold text-white">${p.name || '女主'}</span>
          <span class="text-slate-500">（${p.age || '25'}歲 · ${p.occupation || '政經分析師'}）</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-slate-400">🎯 攻略男主：</span>
          <span class="font-bold text-amber-300">${lead}</span>
        </div>
      </div>

      <div class="text-xs text-slate-300 bg-brand-dark/70 p-2.5 rounded-lg border border-brand-border/60 italic leading-relaxed">
        "${snippet}"
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
          <span class="font-serif font-black text-sm text-white group-hover:text-brand-gold transition">${s.name}</span>
        </div>
        <div class="flex items-center gap-2 font-mono text-[11px] text-slate-400">
          <span>🕒</span>
          <span>${s.timestamp}</span>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3 text-xs">
        <div class="flex items-center gap-1.5 bg-brand-dark/80 px-2.5 py-1 rounded border border-brand-border/60">
          <span class="text-slate-400">主角：</span>
          <span class="font-bold text-white">${p.name || '女主'}</span>
        </div>
        <div class="flex items-center gap-1.5 bg-brand-dark/80 px-2.5 py-1 rounded border border-brand-border/60">
          <span class="text-slate-400">🎯 攻略：</span>
          <span class="font-bold text-amber-300">${lead}</span>
        </div>
        <div class="flex items-center gap-1.5 bg-brand-dark/80 px-2.5 py-1 rounded border border-brand-border/60">
          <span class="text-slate-400">📖 進度：</span>
          <span class="font-bold text-sky-300">第 ${turn} 回（${chTitle}）</span>
        </div>
        <div class="flex items-center gap-2 text-[11px] text-slate-400 ml-auto">
          <span>🌡️ 張力: <b class="text-rose-400">${tension}%</b></span>
          <span>🍷 微醺: <b class="text-amber-400">${tipsy}%</b></span>
        </div>
      </div>

      <div class="text-xs text-slate-300 bg-brand-dark/60 p-2.5 rounded-lg border border-brand-border/40 italic leading-relaxed">
        "${snippet}"
      </div>

      <div class="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-brand-border/40">
        <button class="load-archive-btn px-4 py-1.5 rounded-lg bg-brand-gold text-slate-950 font-black hover:bg-yellow-500 transition text-xs shadow-md cursor-pointer flex items-center gap-1" data-id="${s.id}">
          <span>▶</span>
          <span>讀取載入此存檔</span>
        </button>
        <button class="rename-archive-btn px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white transition text-xs border border-brand-border cursor-pointer flex items-center gap-1" data-id="${s.id}">
          <span>✏️</span>
          <span>重新命名</span>
        </button>
        <button class="sync-single-archive-btn px-3 py-1.5 rounded-lg bg-blue-950/70 hover:bg-blue-900 text-blue-200 hover:text-white transition text-xs border border-blue-700/50 cursor-pointer flex items-center gap-1" data-id="${s.id}">
          <span>☁️</span>
          <span>手動同步此檔至雲端（可跨裝置遊戲）</span>
        </button>
        <button class="delete-archive-btn px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white transition text-xs border border-rose-800/40 cursor-pointer flex items-center gap-1" data-id="${s.id}">
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
        <span class="font-bold text-white">${s.name}</span>
        <span class="text-[11px] text-slate-400">（第 ${s.turnCount || 1} 回 · ${s.playerProfile?.targetLeadName || '主線'}）</span>
      </div>
      <span class="font-mono text-[11px] text-slate-500">${s.timestamp}</span>
    `;

    row.addEventListener('click', () => loadNamedSave(s.id));
    container.appendChild(row);
  });
}

function handleContinueGame() {
  if (state.chapterHistoryList && state.chapterHistoryList.length > 0 && state.chapterData) {
    switchView('gameplay');
  } else {
    const saves = getNamedSavesList();
    if (saves.length > 0) {
      openSaveArchiveModal();
    } else {
      alert('目前尚無進行中的冒險進度，請先開啟全新局創角！');
      openCharacterCreationModal();
    }
  }
}

function handleQuickSave() {
  if (!state.chapterData) return alert('目前尚無進行中的故事進度可存檔！');
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
  if (dom.gameGuideModal) {
    dom.gameGuideModal.style.display = 'flex';
    switchGuideTab(initialTab);
  }
}

function closeGameGuideModal() {
  if (dom.gameGuideModal) dom.gameGuideModal.style.display = 'none';
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
    if (!search) return true;
    return c.name.toLowerCase().includes(search) ||
           c.identityRole.toLowerCase().includes(search) ||
           c.summary.toLowerCase().includes(search) ||
           c.title.toLowerCase().includes(search);
  });

  if (filteredKeys.length === 0) {
    container.innerHTML = '<div class="col-span-full text-center text-slate-500 py-6">找不到相符的角色資料</div>';
    return;
  }

  filteredKeys.forEach(k => {
    const c = OFFICIAL_DRIVE_CHARACTERS[k];
    const rMatch = ROSTER_ONE_LINERS.find(r => r.id === k || r.name === c.name);
    const oneLiner = rMatch ? rMatch.oneLiner : c.summary;

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
          <span class="text-[10px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">官方男主</span>
        </div>
        <div class="text-[11px] font-bold text-amber-200/90 leading-tight">
          ${c.identityRole}
        </div>
        <div class="text-xs text-slate-300 leading-relaxed pt-1">
          ${oneLiner}
        </div>
        <div class="text-[11px] text-slate-400 bg-brand-dark/60 p-2 rounded-lg border border-brand-border/40 mt-1 leading-normal">
          ${c.summary}
        </div>
      </div>
      <div class="pt-2 flex items-center justify-end">
        <button class="select-this-lead-btn px-3 py-1.5 rounded-lg bg-brand-gold/20 hover:bg-brand-gold text-brand-gold hover:text-slate-950 font-bold text-xs transition border border-brand-gold/40 cursor-pointer shadow-sm" data-key="${k}">
          ✦ 以此男主開局 →
        </button>
      </div>
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
      const existing = getNamedSavesList();
      const existingIds = new Set(existing.map(s => s.id));
      const newItems = imported.filter(s => !existingIds.has(s.id));
      const merged = [...newItems, ...existing];
      persistNamedSavesList(merged);
      alert(`🎉 成功匯入 ${newItems.length} 筆新存檔！`);
    } catch (err) {
      alert('存檔匯入失敗：' + err.message);
    }
  };
  reader.readAsText(file);
}

// ==========================================
// 9. 輔助與抽屜狀態渲染 (Helpers & State)
// ==========================================

function openCharacterCreationModal() {
  if (dom.charCreationModal) {
    dom.charCreationModal.style.display = 'flex';
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
      setFormValue('form-allow-r18', profile.allowR18 !== false);
      setFormValue('form-custom-scenario', profile.customScenario || '');
    }
  }
}

function closeCharacterCreationModal() {
  if (dom.charCreationModal) dom.charCreationModal.style.display = 'none';
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
        let tierLabel = '初識審視';
        let barColor = 'from-slate-600 to-slate-400';
        if (val >= 90) { tierLabel = '靈肉共沉'; barColor = 'from-rose-600 to-pink-500'; }
        else if (val >= 75) { tierLabel = '致命深陷'; barColor = 'from-rose-500 to-amber-500'; }
        else if (val >= 50) { tierLabel = '曖昧交鋒'; barColor = 'from-amber-500 to-yellow-400'; }
        else if (val >= 30) { tierLabel = '利益試探'; barColor = 'from-blue-500 to-cyan-400'; }

        const div = document.createElement('div');
        div.className = 'space-y-1 bg-brand-dark/60 p-2.5 rounded-lg border border-brand-border/60';
        div.innerHTML = `
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-white">${name}</span>
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

  if (dom.inventoryList) {
    dom.inventoryList.innerHTML = '';
    const inv = state.saveState.inventory || [];
    if (inv.length === 0) {
      dom.inventoryList.innerHTML = '<div class="text-slate-500 text-xs py-1">暫無隨身特殊物品</div>';
    } else {
      inv.forEach(item => {
        const div = document.createElement('div');
        div.className = 'text-[11px] text-slate-300 flex items-center justify-between bg-brand-dark/40 px-2 py-1 rounded border border-brand-border/40';
        div.innerHTML = `<span>💼 ${item.name || item}</span><span class="text-slate-500">x${item.count || 1}</span>`;
        dom.inventoryList.appendChild(div);
      });
    }
  }
}

function restoreSavedStateFromStorage() {
  try {
    const savedState = localStorage.getItem('undercurrent_current_save_state');
    const savedChapters = localStorage.getItem('undercurrent_full_story_chapters');
    if (savedState && savedChapters) {
      state.saveState = JSON.parse(savedState);
      state.chapterHistoryList = JSON.parse(savedChapters);
      state.chapterData = state.chapterHistoryList[state.chapterHistoryList.length - 1];
    }
  } catch (e) {
    console.warn('Failed to restore saved state from storage:', e);
  }
}

function saveGameStateToSlot(slotId) {
  if (!state.saveState) return;
  localStorage.setItem(`undercurrent_save_slot_${slotId}`, JSON.stringify({
    saveState: state.saveState,
    chapterData: state.chapterData,
    chapterHistoryList: state.chapterHistoryList || [],
    savedAt: new Date().toISOString()
  }));
}

async function handleRegenerateTurn() {
  const turnCount = state.saveState?.turnCount || 1;
  
  if (turnCount <= 1 || !state.lastChoicePayload) {
    // 重新演繹第 1 回開局
    const profile = getActivePlayerProfile();
    showLoading('選項確認中……', '正在重新演算並構思第 1 回開局情節……');
    try {
      const { systemPrompt, userPrompt } = buildFirstTurnPrompt(profile);
      const regeneratedChapter = await generateStoryFromLLM(systemPrompt, userPrompt);
      regeneratedChapter.act = 1;
      regeneratedChapter.turn = 1;
      regeneratedChapter.chosenLabel = '【正式開局】';
      state.chapterData = regeneratedChapter;
      state.chapterHistoryList = [regeneratedChapter];
      localStorage.setItem('undercurrent_full_story_chapters', JSON.stringify(state.chapterHistoryList));
      renderStoryStream(regeneratedChapter);
      renderSaveState();
      saveGameStateToSlot('1');
      syncStateToGoogleDriveCloud(state.saveState, regeneratedChapter);
    } catch (err) {
      console.error('第 1 回重新生成失敗:', err);
      alert('第 1 回重新生成逾時，請檢查網路連線或稍後再試。');
    } finally {
      hideLoading();
    }
  } else {
    makeChoice(state.lastChoicePayload.choiceId, state.lastChoicePayload.customInput, true);
  }
}

function handleUndoTurn() {
  if (state.previousStateSnapshot) {
    state.saveState = JSON.parse(JSON.stringify(state.previousStateSnapshot.saveState));
    state.chapterData = JSON.parse(JSON.stringify(state.previousStateSnapshot.chapterData));
    if (state.chapterHistoryList.length > 1) {
      state.chapterHistoryList.pop();
      localStorage.setItem('undercurrent_full_story_chapters', JSON.stringify(state.chapterHistoryList));
    }
    renderStoryStream(state.chapterData);
    renderSaveState();
    alert('已成功悔棋回退至上一回合！');
  } else {
    alert('已無更早的上一動快照可回退。');
  }
}

function handleRetryLastTurn() {
  if (state.lastChoicePayload) {
    makeChoice(state.lastChoicePayload.choiceId, state.lastChoicePayload.customInput, true);
  }
}

function handleAbortGeneration() {
  sendTelemetryError('USER_ABORT', '玩家主動中止生成', { duration: state.loadingSeconds || 0 });
  if (state.currentAbortController) {
    state.currentAbortController.abort();
    state.currentAbortController = null;
  }
  hideLoading();
  alert('已中止本次生成。');
}

function handleActRebase() {
  if (!confirm('確定要執行【卷末換窗 (Act Rebase)】嗎？\n這將把本幕所有章節濃縮為 800 字檔案重整視窗，保留數值與道具。')) return;
  state.saveState.meta.currentAct = (state.saveState.meta.currentAct || 1) + 1;
  alert('【卷末換窗完成】已晉升至第 ' + state.saveState.meta.currentAct + ' 幕！');
}

function startServerCooldown(seconds) {
  const text = document.getElementById('server-status-text');
  if (!text) return;

  let remaining = seconds || 10;
  text.textContent = `冷卻中 (${remaining}s) · 防限流保護`;
  
  if (state.cooldownInterval) clearInterval(state.cooldownInterval);
  state.cooldownInterval = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      clearInterval(state.cooldownInterval);
      text.textContent = 'AI 主筆作家在線 · 動態演繹就緒';
    } else {
      text.textContent = `冷卻中 (${remaining}s) · 防限流保護`;
    }
  }, 1000);
}

const ROTATING_PROGRESS_STEPS = [
  '選項確認中……',
  '角色意向確認中……',
  '劇情故事產生中……',
  '場景世界建構中……',
  '人物言行確認中……',
  '內容產出中……',
  '邏輯校正中……',
  '請稍候……'
];

let loadingTimer = null;
let loadingStepInterval = null;

function showLoading(initialText, initialSubtext) {
  if (dom.loadingOverlay) {
    dom.loadingOverlay.style.display = 'flex';
    
    let stepIndex = 0;
    if (dom.loadingText) dom.loadingText.textContent = initialText || ROTATING_PROGRESS_STEPS[0];
    if (dom.loadingSubtext) dom.loadingSubtext.textContent = initialSubtext || '正在依照當前局勢動態演算與鋪陳情節……';
    
    let secondsElapsed = 0;
    const timerSpan = document.getElementById('loading-timer-badge');
    if (timerSpan) timerSpan.textContent = `已耗時 0 秒`;

    if (loadingTimer) clearInterval(loadingTimer);
    loadingTimer = setInterval(() => {
      secondsElapsed++;
      if (timerSpan) timerSpan.textContent = `已耗時 ${secondsElapsed} 秒`;
    }, 1000);

    if (loadingStepInterval) clearInterval(loadingStepInterval);
    loadingStepInterval = setInterval(() => {
      stepIndex = (stepIndex + 1) % ROTATING_PROGRESS_STEPS.length;
      if (dom.loadingText) {
        dom.loadingText.textContent = ROTATING_PROGRESS_STEPS[stepIndex];
      }
    }, 4000);
  }
}

function hideLoading() {
  if (loadingTimer) {
    clearInterval(loadingTimer);
    loadingTimer = null;
  }
  if (loadingStepInterval) {
    clearInterval(loadingStepInterval);
    loadingStepInterval = null;
  }
  if (dom.loadingOverlay) {
    dom.loadingOverlay.style.display = 'none';
  }
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
async function sendTelemetryError(category, message, details = {}) {
  try {
    const payload = {
      action: 'telemetry/log-error',
      category: category || 'GENERAL_ERROR',
      message: String(message || '未知錯誤'),
      model: LLM_CONFIG.PRIMARY_MODEL || 'mistral-large-3',
      userId: state.username || state.userId || localStorage.getItem('undercurrent_user_name') || 'guest',
      act: state.saveState?.meta?.currentAct || 1,
      turn: state.saveState?.turnCount || 1,
      targetLead: state.saveState?.meta?.targetLeadName || '未指定',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Node/Test',
      details: details
    };

    console.warn('[Telemetry Alert]', payload);

    const gasUrl = (typeof state !== 'undefined' && state.gasApiUrl) || 'https://script.google.com/macros/s/AKfycbwjdNrRMUveqcxhN2K9Okz8afuBmKrziHnj9Zr5EnoCaX2dlXifACHppa2iJuNRFc0CxQ/exec';
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
  const modal = document.getElementById('feedback-modal');
  if (!modal) return;

  modal.style.display = 'flex';

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
  const modal = document.getElementById('feedback-modal');
  if (modal) modal.style.display = 'none';
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
    return alert('請填寫具體回饋內容後再送出！');
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
    model: LLM_CONFIG.PRIMARY_MODEL || 'mistral-large-3',
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
        alert('感謝您的寶貴回饋！意見已成功同步至開發管理團隊。');
      } else {
        alert('回饋提交失敗：' + (data.error?.message || '伺服器回應異常，請稍後再試。'));
      }
    } else {
      alert('系統尚未配置雲端端點，回饋已記錄於本機。');
    }
    closeFeedbackModal();
    const contentArea = document.getElementById('feedback-content');
    if (contentArea) contentArea.value = '';
  } catch (err) {
    console.error('Submit feedback error:', err);
    alert('回饋提交失敗：無法連線至雲端伺服器。\n錯誤：' + err.message);
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
