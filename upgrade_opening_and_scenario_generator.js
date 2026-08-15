const fs = require('fs');

const appJsPath = '/Users/huanhsu/Desktop/程式碼專案/TJPR/app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');

// 14 位專屬男主特徵資料庫與開場生成器
const dynamicOpeningEngine = `
// ==========================================
// 🌟 14 位男主性格與動態開局劇本合成引擎
// ==========================================

const MALE_LEADS_LORE = {
  '01_徐令謙': {
    name: '徐令謙',
    title: '天裕會二把手 · 幕後制策者',
    outfit: '深灰色手工訂製三件套西裝、細邊金絲眼鏡、Omega 金錶',
    scent: '淺焙咖啡微酸果香、冷冽雪松與高級雪茄菸草氣息',
    vibe: '儒雅深沉、太陰坐命、上位者玩味侵略',
    locationDefault: '台北市士林區德行法律事務所頂樓制策室'
  },
  '02_韓正寰': {
    name: '韓正寰',
    title: '士林地檢署檢察官 · 白日判官',
    outfit: '黑色長風衣、檢察官徽章、領帶微緊、白襯衫挺拔',
    scent: 'Diptyque Tam Dao 檀香與清冽雨水氣息',
    vibe: '處女座極度自律、冷峻刀鋒視線、司法官威壓',
    locationDefault: '士林地檢署第六偵查庭與走廊'
  },
  '03_楊紹宸': {
    name: '楊紹宸',
    title: '弘楊集團少東 · 桀驁掌權者',
    outfit: '暗黑絲絨西裝外套、微敞領口、積家名錶',
    scent: 'Tom Ford 沉香與波本威士忌氣息',
    vibe: '侵略強勢、桀驁不馴、肆意佔有欲',
    locationDefault: '信義區弘楊集團總部頂層董事長辦公室'
  },
  '04_顧霆淵': {
    name: '顧霆淵',
    title: '警政署刑事局重案組長 · 孤狼特警',
    outfit: '戰術黑皮夾克、快拔槍套、工裝長褲與軍靴',
    scent: '硝煙、薄荷菸草與冷冽夜風',
    vibe: '剛毅冷酷、鷹隼般銳利雙眸、荷爾蒙爆棚',
    locationDefault: '台北市刑警大隊地下安全屋'
  },
  '05_陸子驍': {
    name: '陸子驍',
    title: '跨國投資銀行合夥人 · 金融掠奪者',
    outfit: '薩維爾街訂製深藍條紋西裝、百達翡麗萬年曆腕錶',
    scent: '冷冽柑橘、杜松子與古龍水香氣',
    vibe: '從容自若、精於算計、優雅嗜血',
    locationDefault: '信義金融核心頂層私人會所'
  },
  '06_沈淮安': {
    name: '沈淮安',
    title: '名門世家私生子 · 溫潤腹黑名醫',
    outfit: '純黑羊絨高領衫、金絲無框眼鏡、骨節分明修長雙手',
    scent: '清苦草藥香與微甜白麝香',
    vibe: '溫潤如玉卻暗藏殺機、執念深刻',
    locationDefault: '天母私人高端診所VIP研究室'
  },
  '07_江馭寒': {
    name: '江馭寒',
    title: '頂級私人安全顧問 · 冷血貼身保鏢',
    outfit: '全黑戰術襯衫、防彈背心暗層、右腕黑色戰術手套',
    scent: '皮革、黑胡椒與冷鐵氣息',
    vibe: '沉默死忠、冷酷執行力、壓倒性體魄',
    locationDefault: '地下隱蔽安全地下停車場'
  },
  '08_齊銘': {
    name: '齊銘',
    title: '黑市軍火與情報販子 · 狂放不羈梟雄',
    outfit: '磨砂皮夾克、銀質骷髏戒指、微敞領口帶舊傷疤',
    scent: '哈瓦那雪茄、火藥與微烈蘭姆酒',
    vibe: '狂放野性、無法無天、玩命徒極限推拉',
    locationDefault: '淡水港灣廢棄造船廠改裝黑市'
  },
  '09_謝雲深': {
    name: '謝雲深',
    title: '法務部特等通譯 · 神秘雙面間諜',
    outfit: '米灰雙排扣風衣、羊毛圍巾、精緻袖扣',
    scent: '雨後鳶尾花與舊羊皮紙香氣',
    vibe: '溫和假面、深不可測、致命誘惑',
    locationDefault: '大稻埕復古私人茶室'
  },
  '10_裴修遠': {
    name: '裴修遠',
    title: '立法院政黨黨鞭 · 權謀核心操盤手',
    outfit: '深藏青手工西裝、國會議員金徽章、深藍真絲領帶',
    scent: '大紅袍茶香與沉香木氣息',
    vibe: '上位權力掌控者、從容談判、極致禁慾感',
    locationDefault: '陽明山政商隱密私人招待所'
  },
  '11_紀尋': {
    name: '紀尋',
    title: '地下賽車場與酒吧主理人 · 狼系痞帥',
    outfit: '重機皮衣、破洞牛仔褲、銀質耳釘',
    scent: '汽油、燃燒橡膠與柑橘伏特加',
    vibe: '野性狂妄、直白撩撥、少年狼犬侵略感',
    locationDefault: '士林夜市後巷地下改裝車庫與酒吧'
  },
  '12_霍沉舟': {
    name: '霍沉舟',
    title: '遠洋航運巨頭 · 陰鷙深沉寡頭',
    outfit: '黑色雙排扣羊毛大衣、象牙手杖、深黑真絲襯衫',
    scent: '海鹽、苦艾酒與老皮革香氣',
    vibe: '陰冷沉穩、隻手遮天、極強掌控欲',
    locationDefault: '基隆港私人停泊豪華遊艇甲板'
  },
  '13_白楚瑜': {
    name: '白楚瑜',
    title: '當代天才鋼琴家 · 偏執病嬌藝術家',
    outfit: '象牙白絲質襯衫、修長修身西褲、修長蒼白指節',
    scent: '白玫瑰、松節油與冷雨氣息',
    vibe: '偏執迷戀、病態佔有欲、破碎感與瘋狂交織',
    locationDefault: '國家音樂廳後台專屬琴房'
  },
  '14_楚天行': {
    name: '楚天行',
    title: '特種作戰退役指揮官 · 鐵血硬漢',
    outfit: '軍綠戰術夾克、軍用防風背心、右眉骨深刻疤痕',
    scent: '硝煙、松針與剛猛汗水氣息',
    vibe: '鐵血忠誠、沉默山巒、絕對保護力',
    locationDefault: '近郊軍事射擊基地'
  }
};

function resolvePlayerAppearance(appearanceRaw, profession) {
  if (!appearanceRaw || appearanceRaw.trim() === '' || appearanceRaw.trim() === '隨機') {
    const defaultOutfits = [
      '象牙白絲質襯衫配深黑高腰鉛筆裙，微濕的薄風衣勾勒出曼妙身段，散發若有似無的清淡橙花體香',
      '墨綠絲絨收腰長裙外搭西裝大衣，及肩黑髮微捲，精緻杏眼透著敏銳冷靜的智者光芒',
      '深黑幹練合身訂製套裝，內搭蕾絲絲綢吊帶，鎖骨線條分明，兼具職業壓迫感與致命吸引力',
      '素雅杏色羊絨針織洋裝，淡雅長裙下襬微濕，清甜的白桃體香在雨夜空氣中若隱若現'
    ];
    return defaultOutfits[Math.floor(Math.random() * defaultOutfits.length)];
  }
  return appearanceRaw.trim();
}

function generateDynamicFirstChapter(profile) {
  const pName = profile.name || '女主';
  const customScenario = (profile.customScenario || '').trim();
  const isShura = profile.targetLead === '修羅場' || profile.targetLeadName === '修羅場';
  const leadKey = profile.targetLead || '01_徐令謙';
  const leadInfo = MALE_LEADS_LORE[leadKey] || MALE_LEADS_LORE['01_徐令謙'];
  const leadName = isShura ? '徐令謙' : (leadInfo.name || profile.targetLeadName || '徐令謙');

  const resolvedOutfit = resolvePlayerAppearance(profile.appearance, profile.profession);

  // 1. 自訂情境動態開局合成器
  if (customScenario && customScenario.length > 0 && !customScenario.includes('深夜德行法律事務所頂層制策室')) {
    const isConvenienceStore = /(便利商店|超商|7-11|全家|超商|貨架)/.test(customScenario);
    const isVilla = /(山莊|別墅|陽明山|隱密)/.test(customScenario);
    const isCar = /(車|後座|副駕駛|奔馳|保時捷)/.test(customScenario);
    const isBarClub = /(酒吧|夜店|包廂|卡座|調酒)/.test(customScenario);

    let locationStr = '台北深夜隱密之所';
    let settingProse = '';

    if (isConvenienceStore) {
      locationStr = '台北市士林區連鎖便利商店冷藏貨架旁';
      settingProse = 
        \`五月深夜的台北士林，窗外暴雨如注，重重雨幕將街邊的霓虹燈火模糊成一片斑駁流光。\n\n\` +
        \`便利商店的自動門伴隨著清脆的電子提示音滑開，灌入一陣夾雜著暴雨濕氣的冷冽夜風。\${pName}正立於冷藏飲料貨架前，身上穿著\${resolvedOutfit}，指尖剛觸碰到冰涼的鋁罐，身後一道高大挺拔的身影已悄然將她籠罩在陰影之中。\n\n\` +
        \`空氣中那股淺焙咖啡的微酸果香與冷冽雪松菸草氣息瞬間逼近。\${leadName}收起手中滴水的黑色雨傘，深灰三件套西裝筆挺從容，細邊金絲眼鏡後的雙眸深邃如無底深淵。男人的修長手指越過她的肩頭，漫不經心地取下她身旁同一款飲料，居高臨下的溫熱氣息拂過她的耳畔：\n\n\` +
        \`「\${pName}，在台北這片地界，拿著價值數百億的洗錢密帳，卻敢獨自一人在深夜走進這間便利商店……妳是在等我，還是在向我示威？」\n\n\` +
        \`男人的嗓音低沉而富有磁性，指尖若有似無地擦過她的手背，冰冷的金屬隨身碟在兩人的暗流交鋒中隱隱發燙。\` +
        (isShura ? \`\n\n就在此時，超商門外停下一輛黑色公務車，長風衣、身戴地檢署徽章的韓正寰推門而入，冷冽的目光如刀鋒般瞬間將這間狹窄的超商空間鎖死！\` : '');
    } else if (isVilla) {
      locationStr = '陽明山私人隱密山莊落地窗前';
      settingProse = 
        \`陽明山夜色深沉，暴雨瘋狂拍打著隱密山莊的歐式防彈落地窗。\n\n\` +
        \`\${pName}身著\${resolvedOutfit}，端坐在真皮沙發前。胡桃木壁爐內燃燒著幽微的火光，將對面男人英挺深邃的輪廓映照得宛如雕塑。\n\n\` +
        \`\${leadName}緩緩搖晃著水晶杯中的威士忌，嘴角勾起一抹極淡而玩味的弧度：「今晚這座山莊只有我們兩個人。走出這裡，全台北都會為了妳手中的籌碼掀起血雨腥風；但留在這裡……妳必須先學會如何取悅這盤棋局的執棋者。」\` +
        (isShura ? \`\n\n話音剛落，山莊大門傳來沉重的密碼解鎖聲，另一道冷酷挺拔的身影攜帶著滿身風雨強勢踏入，多方博弈在密閉空間中瞬間點燃！\` : '');
    } else {
      // 泛用自訂開場適配
      locationStr = \`台北特殊情境地點 · \${customScenario.slice(0, 15)}...\`;
      settingProse = 
        \`五月深夜的台北，暴雨傾盆，夜色如墨。\n\n\` +
        \`\${customScenario}\n\n\` +
        \`\${pName}一襲\${resolvedOutfit}，在極度壓迫的氛圍中與對面的男人對峙。\${leadName}目光深邃如刀，修長的身形微微逼近，空氣中瀰漫著\${leadInfo.scent}，危險的權謀博弈與情慾性張力在瞬息之間被拉滿到了極限！\`;
    }

    return {
      chapterTitle: \`第 1 回．雨夜初會 · \${leadName} 的危險定契\`,
      prose: settingProse,
      statusPanel: {
        timeLocation: \`2026年5月12日 21:30 星期二 於 \${locationStr}\`,
        tension: '張力值 [75%]',
        intoxication: '微醺度 [20%]',
        outfit: \`\${pName}（\${resolvedOutfit}） ｜ \${leadName}（\${leadInfo.outfit}）\` + (isShura ? ' ｜ 韓正寰（黑風衣、地檢徽章）' : ''),
        interaction: \`初會交鋒 ｜ \${leadName} 近身壓迫，目光鎖定，物理距離不足半米\`,
        inventory: '密錄隨身碟、自身身分底牌',
        rumors: '台北政商高層暗夜動盪，黑白兩道各路人馬正循線追蹤',
        pageCode: 'P.001'
      },
      choices: [
        { id: 'opt_init_a', label: \`[A] 掌局談判：迎上 \${leadName} 的視線，將隨身碟壓在指尖「既然找上了你，開價自然由我說了算」\`, risk: 'low', hint: '展現頂級大女主從容底氣' },
        { id: 'opt_init_b', label: \`[B] 機鋒推拉：唇角勾起極淡輕笑，微退半步拉開距離「二爺這麼近，是想搶我的隨身碟，還是想搶我的人？」\`, risk: 'medium', hint: '危險試探，拉扯男性征服欲' },
        { id: 'opt_init_c', label: \`[C] 情慾反撩：指尖順著他的領口緩緩滑過「這份帳冊能要無數人的命，但今晚……我只想看看你能給我什麼」\`, risk: 'high', hint: '主動點火，將殺機化為極致性張力' }
      ]
    };
  }

  // 2. 經典士林事務所開局（修羅場 vs 單人）
  if (isShura) {
    return {
      chapterTitle: '第 1 回．暴雨制策室 · 黑白兩道的修羅場交鋒',
      prose: \`五月深夜的台北士林，窗外暴雨如注，重重雨幕將整座城市的霓虹燈火模糊成一片斑駁血色。狂風夾雜著滂沱暴雨瘋狂敲打著德行法律事務所頂層制策室的防彈落地窗，發出沉悶而密集的撞擊聲。\n\n制策室內並未開啟明亮的主燈，僅有一盞暖黃色的復古黃銅立燈投射在角落，將巨大的深黑胡桃木長桌染上一層深沉的琥珀光暈。空氣中交織著淺焙手沖咖啡的微酸果香——那是專程自新北市三峽思慕咖啡運抵、由主人親手烘焙研磨的特調豆——以及雪茄菸草與冷冽雪松交纏的壓迫感。\n\n\${pName}身著\${resolvedOutfit}，立於深色長桌正中，微濕的髮梢散發著若有似無的清淡體香。她指尖緊緊貼著手提包內層，那枚載有弘楊集團與政界高層洗錢暗帳的加密隨身碟正隱隱發燙。在台北這座權力叢林中，這枚隨身碟足以讓無數政商巨擘身敗名裂。\n\n長桌上首，徐令謙微倚著深黑高背皮椅。他戴著一副細邊金絲眼鏡，身上的深灰色手工訂製三件套西裝筆挺而從容，左腕上的 Omega 金錶在昏黃吊燈下泛著內斂的冷冽光芒。他修長而骨節分明的手指輕輕搖晃著加冰水晶洛克杯，琥珀色的格蘭花格威士忌在杯壁旋出細密的酒淚，太陰坐命的眼眸深邃得宛如不見底的古潭，目光精準如手術刀般落在她身上。\n\n「\${pName}，在士林這片地界，敢捏著這份帳冊直接找進德行事務所的人，妳是第一個。」徐令謙低沉的嗓音徐徐響起，帶著上位者慣有的溫和審視與危險壓迫感，「不過，既然進了天裕會的門，妳應該很清楚——這裡進來容易，想全身而退，就得看妳給的籌碼夠不夠份量了。」\n\n話音未落，厚重的胡桃木門扉卻傳來一聲沉悶的解鎖聲。室外走廊的穿堂冷風裹挾著雨水潮氣灌入，一道挺拔冷峻的黑色長風衣身影邁步而入——臺灣士林地檢署主任檢察官韓正寰攜帶著濃烈的 Diptyque Tam Dao 檀香氣息，反手扣上了房門。\n\n韓正寰胸前的檢察官徽章閃爍著寒芒，處女座極度自律的眉眼冷若冰霜，視線先是凌厲如刀鋒般掃過徐令謙，隨後牢牢釘在\${pName}身上。\n\n「看來今晚的德行事務所比地檢署法庭還要熱鬧。」韓正寰嗓音如刀刃切過冰面，緩步走近長桌，高大英挺的身形將唯一的出口完全封死，「\${pName}，妳手裡的東西，按照刑事訴訟法，現在就該交給地檢署。待在黑幫的據點裡，可保不住妳的安全。」\n\n「韓檢察官，」徐令謙放下酒杯，唇角勾起一抹極淡的玩味冷笑，指尖輕叩桌面，「在我的地盤上教訓我的客人，士林地檢署的手未免伸得太長了點。」\n\n黑幫幕後二把手與司法界白日判官的視線在半空中激烈交撞，空氣中的火藥味與情慾張力瞬間飆升至臨界點，而兩名危險男人的全部焦點，在這一刻齊齊落在正中央的\${pName}身上。\`,
      statusPanel: {
        timeLocation: '2026年5月12日 21:30 星期二 於 台北市士林區德行法律事務所頂樓制策室',
        tension: '張力值 [80%]',
        intoxication: '微醺度 [25%]',
        outfit: \`\${pName}（\${resolvedOutfit}） ｜ 徐令謙（深灰三件套西裝、金絲眼鏡、Omega金錶） ｜ 韓正寰（黑風衣、地檢徽章、冷峻刀鋒眼神）\`,
        interaction: '三方修羅場 ｜ 徐令謙坐於上首前傾審視，韓正寰反手封門阻斷退路，物理距離均不足一點五米',
        inventory: '弘楊集團洗錢暗帳隨身碟、瑾和基金會特許證',
        rumors: '政界盛傳士林地檢署正秘密查扣天裕會金流，黑白兩道暗潮洶湧一觸即發',
        pageCode: 'P.001'
      },
      choices: [
        { id: 'opt_a', label: '[A] 借力打力：神情自若地拉開中央座椅坐下，將隨身碟壓在掌心「兩位既然都到了，不如聽聽我的開價」', risk: 'low', hint: '展現從容定力，在黑白夾縫中主導談判節奏' },
        { id: 'opt_b', label: '[B] 轉移焦點：抬眼直視韓正寰「韓檢若真想查辦，三年前的洗錢懸案為何至今不敢結案？」', risk: 'medium', hint: '直刺司法痛點，拉扯韓正寰心理防線' },
        { id: 'opt_c', label: '[C] 危險推拉：側身朝徐令謙走近，傾身將隨身碟輕放在他的威士忌杯旁「二爺，您說這東西……我該給誰？」', risk: 'high', hint: '主動跨越安全距離，當著檢察官面與黑幫首領親暱試探' }
      ]
    };
  }

  return {
    chapterTitle: \`第 1 回．暴雨初會 · \${leadInfo.name}\`,
    prose: \`五月深夜的台北，窗外暴雨如注，重重雨幕將整座城市的霓虹燈火模糊成一片斑駁血色。\n\n室內空氣中瀰漫著\${leadInfo.scent}。\${pName}身著\${resolvedOutfit}，指尖握著足以掀翻台北政商黑白兩道的加密隨身碟。\n\n長桌對側，\${leadInfo.name}（\${leadInfo.title}）一身\${leadInfo.outfit}，神態從容而深邃，目光如手術刀般精準落在\${pName}身上：\n\n「\${pName}，在台北這片地界，敢帶著這份底牌直接找上我的人，妳是第一個。」男人的聲音低沉而富有磁性，上位者的壓迫感與若有似無的情慾性張力在空氣中迅速蔓延，\n\n「進了這扇門，妳要麼成為我的專屬盟友，要麼……就準備好承受代價。」\`,
    statusPanel: {
      timeLocation: \`2026年5月12日 21:30 星期二 於 \${leadInfo.locationDefault}\`,
      tension: '張力值 [68%]',
      intoxication: '微醺度 [20%]',
      outfit: \`\${pName}（\${resolvedOutfit}） ｜ \${leadInfo.name}（\${leadInfo.outfit}）\`,
      interaction: \`初次交鋒 ｜ 與 \${leadInfo.name} 對坐，目光交鋒，距離約一點二米\`,
      inventory: '調查底牌、密錄隨身碟',
      rumors: '台北各方勢力暗流湧動，黑白兩道大洗牌即將展開',
      pageCode: 'P.001'
    },
    choices: [
      { id: 'opt_a', label: \`[A] 順應節奏：神情自若地坐下，將隨身碟推向桌心「既然找上了你，就代表我信任你的手段」\`, risk: 'low', hint: '展現職業從容，以籌碼換取信任' },
      { id: 'opt_b', label: \`[B] 反向推拉：冷靜反詰「看來你很清楚，這份帳冊能讓整個台北把誰送進去」\`, risk: 'medium', hint: '言語機鋒試探底線，拉扯權力距離' },
      { id: 'opt_c', label: \`[C] 情慾暗示：迎著他的視線傾身靠近，壓低聲音「那你打算怎麼處置我這個握著炸彈的人？」\`, risk: 'high', hint: '打破社交界限，主動拉近物理距離挑動危險氛圍' }
    ]
  };
}
`;

// Replace loadMockDataWithProfile to use generateDynamicFirstChapter(profile)
const oldLoadMockData = `function loadMockDataWithProfile(profile) {
  state.playerProfile = profile;
  localStorage.setItem('undercurrent_current_player_profile', JSON.stringify(profile));
  
  const isShura = profile.targetLead === '修羅場' || profile.targetLeadName === '修羅場';
  const targetLeadDisplay = isShura ? '徐令謙、韓正寰（修羅場）' : profile.targetLeadName;

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
      { id: 'item_press', name: '瑾和基金會特許證 / 記者證', count: 1, desc: '證明自身出入政商名流場合的身分底牌。' }
    ],
    relationships: isShura ? { '徐令謙': 20, '韓正寰': 15, '楊紹宸': 10 } : { [profile.targetLeadName]: 20 },
    questFlags: {
      main_quest: isShura ? '暗流初會：在黑白兩道頂級交鋒中破局' : \`初會：與 \${profile.targetLeadName} 的交鋒\`
    },
    summaryPool: isShura 
      ? \`玩家 \${profile.name} 踏入德行法律事務所制策室，同時面對玄辰幫二把手徐令謙與士林地檢署檢察官韓正寰的雙重目光鎖定。\`
      : \`玩家 \${profile.name} 正式入局，與 \${profile.targetLeadName} 展開首次交鋒。\`,
    turnHistory: []
  };

  localStorage.setItem('undercurrent_current_save_state', JSON.stringify(state.saveState));


  let initialMockChapter;

  if (isShura) {
    initialMockChapter = {
      chapterTitle: \`第 1 回．暴雨制策室 · 黑白兩道的修羅場交鋒\`,
      prose: \`五月深夜的台北士林，窗外暴雨如注，重重雨幕將整座城市的霓虹燈火模糊成一片斑駁血色。狂風夾雜著滂沱暴雨瘋狂敲打著德行法律事務所頂層制策室的防彈落地窗，發出沉悶而密集的撞擊聲。\n\n制策室內並未開啟明亮的主燈，僅有一盞暖黃色的復古黃銅立燈投射在角落，將巨大的深黑胡桃木長桌染上一層深沉的琥珀光暈。空氣中交織著淺焙手沖咖啡的微酸果香——那是專程自新北市三峽思慕咖啡運抵、由主人親手烘焙研磨的特調豆——以及雪茄菸草與冷冽雪松交纏的壓迫感。\n\n\${profile.name}立於深色長桌正中，身上那一襲剪裁極佳的素雅長裙勾勒出纖細而曼妙的身段，微濕的自然捲髮梢垂在白皙細膩的鎖骨間，在溫暖光影下散發著若有似無的清淡甜香。她指尖緊緊貼著手提包內層，那枚載有弘楊集團與政界高層洗錢暗帳的加密隨身碟正隱隱發燙。在台北這座權力叢林中，這枚隨身碟足以讓無數政商巨擘身敗名裂。\n\n長桌上首，徐令謙微倚著深黑高背皮椅。他戴著一副細邊金絲眼鏡，身上的深灰色手工訂製三件套西裝筆挺而從容，左腕上的 Omega 金錶在昏黃吊燈下泛著內斂的冷冽光芒。他修長而骨節分明的手指輕輕搖晃著加冰水晶洛克杯，琥珀色的格蘭花格威士忌在杯壁旋出細密的酒淚，太陰坐命的眼眸深邃得宛如不見底的古潭，目光精準如手術刀般落在她身上。\n\n「\${profile.name}，在士林這片地界，敢捏著這份帳冊直接找進德行事務所的人，妳是第一個。」徐令謙低沉的嗓音徐徐響起，帶著上位者慣有的溫和審視與危險壓迫感，「不過，既然進了天裕會的門，妳應該很清楚——這裡進來容易，想全身而退，就得看妳給的籌碼夠不夠份量了。」\n\n話音未落，厚重的胡桃木門扉卻傳來一聲沉悶的解鎖聲。室外走廊的穿堂冷風裹挾著雨水潮氣灌入，一道挺拔冷峻的黑色長風衣身影邁步而入——臺灣士林地檢署主任檢察官韓正寰攜帶著濃烈的 Diptyque Tam Dao 檀香氣息，反手扣上了房門。\n\n韓正寰胸前的檢察官徽章閃爍著寒芒，處女座極度自律的眉眼冷若冰霜，視線先是凌厲如刀鋒般掃過徐令謙，隨後牢牢釘在\${profile.name}身上。\n\n「看來今晚的德行事務所比地檢署法庭還要熱鬧。」韓正寰嗓音如刀刃切過冰面，緩步走近長桌，高大英挺的身形將唯一的出口完全封死，「\${profile.name}，妳手裡的東西，按照刑事訴訟法，現在就該交給地檢署。待在黑幫的據點裡，可保不住妳的安全。」\n\n「韓檢察官，」徐令謙放下酒杯，唇角勾起一抹極淡的玩味冷笑，指尖輕叩桌面，「在我的地盤上教訓我的客人，士林地檢署的手未免伸得太長了點。」\n\n黑幫幕後二把手與司法界白日判官的視線在半空中激烈交撞，空氣中的火藥味與情慾張力瞬間飆升至臨界點，而兩名危險男人的全部焦點，在這一刻齊齊落在正中央的\${profile.name}身上。\`,
      statusPanel: {
        timeLocation: '2026年5月12日 21:30 星期二 於 台北市士林區德行法律事務所頂樓制策室',
        tension: '張力值 [80%]',
        intoxication: '微醺度 [25%]',
        outfit: \`\${profile.name}（素雅長裙、微濕自然捲髮、清甜體香、眼神沉著） ｜ 徐令謙（深灰三件套西裝、金絲眼鏡、Omega金錶、玩味深沉） ｜ 韓正寰（黑風衣、地檢徽章、冷峻刀鋒眼神）\`,
        interaction: '三方修羅場 ｜ 徐令謙坐於上首前傾審視，韓正寰反手封門阻斷退路，物理距離均不足一點五米',
        inventory: '弘楊集團洗錢暗帳隨身碟、瑾和基金會特許證',
        rumors: '政界盛傳士林地檢署正秘密查扣天裕會金流，黑白兩道暗潮洶湧一觸即發',
        pageCode: 'P.001'
      },
      choices: [
        { id: 'opt_a', label: '[A] 借力打力：神情自若地拉開中央座椅坐下，將隨身碟壓在掌心「兩位既然都到了，不如聽聽我的開價」', risk: 'low', hint: '展現從容定力，在黑白夾縫中主導談判節奏' },
        { id: 'opt_b', label: \`[B] 轉移焦點：抬眼直視韓正寰「韓檢若真想查辦，三年前的洗錢懸案為何至今不敢結案？」\`, risk: 'medium', hint: '直刺司法痛點，拉扯韓正寰心理防線' },
        { id: 'opt_c', label: \`[C] 危險推拉：側身朝徐令謙走近，傾身將隨身碟輕放在他的威士忌杯旁「二爺，您說這東西……我該給誰？」\`, risk: 'high', hint: '主動跨越安全距離，當著檢察官面與黑幫首領親暱試探' }
      ]
    };
  } else {
    initialMockChapter = {
      chapterTitle: \`第 1 回．暴雨德行事務所 · 初會 \${profile.targetLeadName}\`,
      prose: \`五月深夜的台北士林，窗外暴雨如注，重重雨幕將整座城市的霓虹燈火模糊成一片斑駁血色。狂風夾雜著滂沱暴雨瘋狂敲打著德行法律事務所頂層制策室的防彈落地窗，發出沉悶而密集的撞擊聲。\n\n室內並未開啟明亮的主燈，僅有一盞暖黃色的復古黃銅立燈投射在角落，將巨大的深黑胡桃木長桌染上一層深沉的琥珀光暈。空氣中瀰漫著淺焙手沖咖啡的微酸果香——那是專程從新北市三峽思慕咖啡運抵、由主人親自烘焙磨製的特選豆子——以及對面男人身上那股若有似無、混雜著菸草與冷冽雪松的沉穩氣息。\n\n\${profile.name}將身上的深黑合身西裝大衣下擺稍稍攏起，指尖隔著薄皮手套觸碰到手提包內層那枚冰冷而沉重的密錄隨身碟。她深吸了一口氣，掌心微微沁出薄汗，但精緻冷靜的眉眼間沒有洩漏半分怯意。這枚隨身碟裡記錄著三年前那樁牽扯法務部、地檢署與天裕會的政商洗錢金流，是足以引爆整座台北權力圈的炸彈。\n\n長桌上首，\${profile.targetLeadName}微倚著深色高背皮椅。他戴著一副復古細邊金絲眼鏡，身上的深灰色手工訂製三件套西裝筆挺而從容，左腕上的 Omega 金錶在昏暗光影下泛著內斂的奢華光芒。他修長而骨節分明的手指正輕輕搖晃著一只加冰水晶洛克杯，金黃色的格蘭花格威士忌在杯壁旋出細密的酒淚，折射出他微捲黑髮下那雙深邃、精準如手術刀般平靜的眼眸。\n\n「\${profile.name}，在台北這片地界，敢不經銘叔引薦，帶著這份洗錢帳冊底牌直接找進德行事務所的人，妳是第一個。」\n\n\${profile.targetLeadName}緩緩開口，聲音低沉而富有磁性，語調中帶著上位者慣有的溫和紳士與從容審視，彷彿眼前這場足以掀翻台北政商與黑白兩道的滔天風暴，只是一盤早已在他預料之中的殘局。\n\n他微微放下酒杯，冰塊與水晶杯壁發出清脆的撞擊聲。\${profile.targetLeadName}修長的身形微微前傾，金絲眼鏡後的目光精準鎖定在她微顫的睫毛與緊繃的下頜線條上，嘴角勾起一抹極淡、耐人尋味的弧度：\n\n「不過既然進了天裕會的門，妳應該很清楚——這裡進來容易，想全身而退，就得看妳給的籌碼夠不夠份量了。今晚走出這扇門之後，妳要麼是我的盟友，要麼……就是台北地檢署明天清晨在淡水河畔撈起的一具無名浮屍。」\n\n室內的空氣在這一刻徹底凝固，窗外一道白熾的閃電撕裂夜空，將兩人隔桌對峙的身影拉得極長，空氣中的危險張力瞬間飆升至臨界點。\`,
      statusPanel: {
        timeLocation: '2026年5月12日 21:30 星期二 於 台北市士林區德行法律事務所頂樓制策室',
        tension: '張力值 [65%]',
        intoxication: '微醺度 [20%]',
        outfit: \`\${profile.name}（\${profile.appearance || '深黑大衣、冷靜眼神、珍珠耳釘'}） ｜ \${profile.targetLeadName}（深灰三件套手工西裝、金絲眼鏡、Omega金錶、神色平靜深沉）\`,
        interaction: \`初次交鋒 ｜ 與 \${profile.targetLeadName} 隔著胡桃木長桌對坐，目光交鋒，距離約一點二米\`,
        inventory: '調查底牌、密錄隨身碟',
        rumors: '政壇傳言士林地檢署韓正寰正秘密盯梢天裕會金流，黑白兩道暗潮洶湧',
        pageCode: 'P.001'
      },
      choices: [
        { id: 'opt_a', label: '[A] 順應節奏：神情自若地拉開椅子坐下，將隨身碟推向桌心，以籌碼換取保護', risk: 'low', hint: '展現職業從容，以籌碼換取信任' },
        { id: 'opt_b', label: \`[B] 反向推拉：冷靜反詰「看來二爺很清楚，這份帳冊能讓士林地檢署把誰送進去」\`, risk: 'medium', hint: '言語機鋒試探底線，拉扯權力距離' },
        { id: 'opt_c', label: \`[C] 情慾暗示：迎著他的視線傾身靠近，壓低聲音「那二爺打算怎麼處置我這個握著炸彈的人？」\`, risk: 'high', hint: '打破社交界限，主動拉近物理距離挑動危險氛圍' }
      ]
    };
  }

  state.chapterData = initialMockChapter;
  state.chapterHistoryList = [initialMockChapter];
  localStorage.setItem('undercurrent_full_story_chapters', JSON.stringify(state.chapterHistoryList));
  renderStoryStream(initialMockChapter);
  renderSaveState();
  saveGameStateToSlot('1');
}`;

const newLoadMockData = dynamicOpeningEngine + \`
function loadMockDataWithProfile(profile) {
  state.playerProfile = profile;
  localStorage.setItem('undercurrent_current_player_profile', JSON.stringify(profile));
  
  const isShura = profile.targetLead === '修羅場' || profile.targetLeadName === '修羅場';
  const targetLeadDisplay = isShura ? '全勢力男主（修羅場）' : profile.targetLeadName;

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
      { id: 'item_press', name: '瑾和基金會特許證 / 記者證', count: 1, desc: '證明自身出入政商名流場合的身分底牌。' }
    ],
    relationships: isShura ? { '徐令謙': 20, '韓正寰': 15, '楊紹宸': 10, '顧霆淵': 10, '陸子驍': 10 } : { [profile.targetLeadName]: 20 },
    questFlags: {
      main_quest: isShura ? '暗流初會：在全勢力交鋒中破局' : \`初會：與 \${profile.targetLeadName} 的交鋒\`
    },
    summaryPool: \`玩家 \${profile.name} 正式入局，情境設定：\${(profile.customScenario || '經典開局').slice(0, 50)}...\`,
    turnHistory: []
  };

  localStorage.setItem('undercurrent_current_save_state', JSON.stringify(state.saveState));

  // 真正依據玩家自訂情境、隨機穿搭智慧生成、14位專屬男主合成第 1 回！
  const initialMockChapter = generateDynamicFirstChapter(profile);

  state.chapterData = initialMockChapter;
  state.chapterHistoryList = [initialMockChapter];
  localStorage.setItem('undercurrent_full_story_chapters', JSON.stringify(state.chapterHistoryList));
  renderStoryStream(initialMockChapter);
  renderSaveState();
  saveGameStateToSlot('1');
}
\`;

appJs = appJs.replace(oldLoadMockData, newLoadMockData);

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('app.js successfully updated with dynamic opening engine & custom scenario synthesis!');
