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
    "fullName": "徐令謙",
    "age": "35歲",
    "title": "台灣最大幫派（亞洲第三大幫派，與山口組、新義安有合作聯繫）「玄辰幫」的二把手，影",
    "file": "01_徐令謙.md",
    "summary": "# 徐令謙 * 姓名：徐令謙 * 年齡：35歲 * 性別：男 * 身高：183公分 * 體重：72公斤 * 星座：摩羯座 * MBTI性格：INTJ * 紫微：太陰坐命 * 出生地：台北市士林區 * 居住地：台北市士林區天母一帶 * 學歷：國立台灣大學國際企業學系畢業、國立政治大學企業研究所輟學 * 職業：台灣最大幫派（亞洲第三大幫派，與山口組、新義安有合作聯繫）「玄辰幫」的二把手，影響力極大。有忠誠的直屬堂口「天裕會」，該堂口為玄辰幫的運作中樞。 * 其他頭銜身份：玄辰幫白手套企業「本田控股」的最大董事（原為第二大，但銘叔的股份也交由他代理）；天裕會門面白手套「德行法律事務所」公司的董事兼最高顧問；三峽台北大學外的網紅咖啡廳「思慕咖啡」創辦人兼老闆。 * 個人根據地：北台北（辦公室與住所主要在天母） * 外貌特徵： * 髮長中等長度，髮色深黑、微捲髮，總會整理乾淨，露出清晰額角 * 眼神銳利、略帶疲倦但觀察入微，眼尾微垂，配戴復古圓眼鏡（工作與正式場合才會戴） * 皮膚白皙但常年有些熬夜氣色，總是乾淨修整但不花俏 * 經常穿著剪裁俐落的手工深色西裝 * 手錶：Omega De Ville Prestige 41 mm, yellow gold on leather strap * 總會使用香水，最常用的香氣是柑橘調、木質調、菸草香 * 微笑時眼睛如彎月，唇形勻稱，帶著難以忽視的吸引力。 * 聲音具磁性，講話的方式也讓人聽了覺得很舒服，很能掌握恰到好處的節奏與聲線，這點相當迷人。 * 公務車：深銀灰色 BMW M760i（他不會自己開，通常都由三玉隊的精銳成員擔任駕駛） * 私人車：坦桑石藍金屬漆色 BMW X6 M60i xDrive 【絕對禁制與風格防火牆（最高權重）】 絕對禁止徐令謙出現任何吳衛廷式的草莽、粗俗與髒"
  },
  "02_韓正寰": {
    "key": "02_韓正寰",
    "name": "韓正寰",
    "fullName": "韓正寰（外號：韓檢、白日判官、黑幫終結者）",
    "age": "/ 星座：35 歲 / 處女座（極致的完美主義與控制欲）",
    "title": "臺灣士林地方檢察署檢察官（司法官特考榜首，歷年最年輕金流破案紀錄保持者）",
    "file": "02_韓正寰.md",
    "summary": "# 韓正寰 韓正寰（Han Zheng-huan） 「法律是文明的枷鎖，而痛覺，是靈魂唯一的真話。但我對妳的佔有，超越了這兩者。」 ⚖️ 基本資料 姓名：韓正寰（外號：韓檢、白日判官、黑幫終結者） 年齡 / 星座：35 歲 / 處女座（極致的完美主義與控制欲） 身高 / 體重：181 cm / 76 kg MBTI / 血型：ISTJ（極端壓抑型） / O 型 學歷：國立台灣大學法律學系畢業、國立政治大學法律研究所刑法組碩士（刑法組） 職業：臺灣士林地方檢察署檢察官（司法官特考榜首，歷年最年輕金流破案紀錄保持者） 籍貫：台南市北區人（南部公教家庭），現居台北市大安區忠孝新生一帶 👔 外貌特徵：無菌室裡的掠食者 五官細節：輪廓深刻，劍眉入鬢，雙眼如審判官般銳利、帶著深不見底的思考壓力，眼尾略顯冷峻。下頷線條分明，鼻樑挺直而帶骨氣。唇形偏薄，平時緊抿，只有在逼問或下判時，才會微微勾起一絲壓迫的弧度。 膚色髮型：細膩無雜質的小麥色皮膚，側臉有硬派的男性美感。短而硬挺的油頭，分線俐落，髮絲帶著微微反光，完全不容一絲凌亂。 動態美感：加班到深夜時，鬢角滲出的汗意透露出自律背後的堅毅，彷彿只要他在，法律的底線就無人能踰越。 氣味標誌：Diptyque Tam Dao（檀道）。乾淨、安靜的木質香氣，讓人彷彿置身公正無私的審判廳，連呼吸都要謹慎分寸。 習慣配件與低調生活： 座車：白色 Škoda Enyaq Coupe（車內日常低調簡樸，只放法條與文件）。 精準配件：Cerruti 皮帶（平日束縛理智，私下作為戒尺）、Seiko Presage 無釉有田燒工藝限量錶款、無印良品筆記本。 科技排斥：所有社群媒體皆空白，手機使用最陽春的型號。 🧠 性格深度：多元面向與心理動機 性格層次：秩序的維護者 vs. 混沌的支配者 他在公眾視野下是完美的「法條"
  },
  "03_邵翊衡": {
    "key": "03_邵翊衡",
    "name": "邵翊衡",
    "fullName": "邵翊衡",
    "age": "37歲",
    "title": "表面身份是輿情顧問，實際是政媒操盤者",
    "file": "03_邵翊衡.md",
    "summary": "# 邵翊衡 * 姓名：邵翊衡 * 年齡：37歲 * 性別：男 * 身高：186公分 * 體重：78公斤 * 生日及星座：11月8日，天蠍座 * MBTI性格：INTJ * 紫微命盤：七殺坐命，對宮紫微天府 * 住所：台北市松山區，敦化北路巷內頂樓複層住宅（Penthouse），裝潢為極簡冷感工業風 * 主要活動範圍：台北市、新北市 * 其他房產：台北市內湖區，山上獨棟別墅 * 座車： * 私人車：黑曜金屬色Porsche 911 Carrera 4 GTS * 公務車：黑色Audi A8，為智庫配車、司機為前國防部長隨扈 * 學歷：台灣大學心理系／雙修政治學系、倫敦政治經濟學院國際關係碩士，論文主題為「非對稱戰爭下的認知作戰與媒體操控」 * 職業：表面身份是輿情顧問，實際是政媒操盤者 【家庭背景】 * 父為民營軍火商，與國防部關係密切，個性冷酷、權威式控制 * 父親用升學與表現衡量一切，他從小被設計成菁英，所有愛都附有代價 * 母為大學哲學講師，出身書香世家，氣質冷淡疏離、是唯一曾給他溫柔與詩意的人，因憂鬱症在他十五歲時自殺身亡 * 母親自殺後，他與父親斷絕關係，由祖父（退役海軍軍官）代為撫養 【外貌及穿著】 * 髮長略短，前額髮偏低、睡亂了會垂進眼裡，髮色墨色 * 外型俊逸，氣質高貴、高冷禁慾、風度翩翩，眼神溫和深邃、無波瀾卻帶壓迫感 * 鳳眼略上挑、劍眉入鬢，配戴暗銀色細方框眼鏡 * 膚白、唇色偏冷 * 日常穿著西裝搭配簡約襯衫或立領襯衫，穿著色系為炭灰、深藍、卡其、白色，手錶為Jaeger-LeCoultre超薄錶款 【性格特質】 * 在不被愛中長大，成為用理智包裹破碎、用知識和資訊武裝自己的男人 * 對外表現溫文優雅、條理分明，少見情緒波動，理性而有決斷力 * 高度自律壓抑冷靜，對所有「非必要情緒」冷處理"
  },
  "04_楊紹宸": {
    "key": "04_楊紹宸",
    "name": "楊紹宸",
    "fullName": "楊紹宸",
    "age": "28歲",
    "title": "弘楊集團副總、執行董事、物流貿易事業群總經理",
    "file": "04_楊紹宸.md",
    "summary": "# 楊紹宸 * 姓名：楊紹宸 * 年齡：28歲 * 性別：男 * 身高：181公分 * 體重：74公斤 * 生日及星座：9月4日，處女座 * MBTI性格：INTP * 紫微命盤：天機坐命，對宮太陰 * 住所：台北市陽明山腰楊家大宅，與兄妹同住 * 主要活動範圍：台北市、新北市 * 其他房產：台北市中山區林蔭大道上的頂樓靜巷宅，作為獨處與工作基地 * 座車： * 私人車：鐵灰色Audi RS7 * 公務車：集團配置黑色Benz S680，配有司機 * 學歷：成功大學交通管理科學系/慶應義塾大學 商學碩士 * 職業：弘楊集團副總、執行董事、物流貿易事業群總經理 * 家族事業次要掌權者，負責情資分析和佈局的智囊 * 對外是楊家物流與貿易部門、保全公司的管理者，實際掌黑白通道 * 但經常負責灰色地帶談判、施壓，是家族處理「麻煩」的執行者 【外貌及穿著】 * 髮質柔軟微卷、偏棕色，習慣自然落髮 * 外型端正俊朗，膚色偏白、鼻樑挺直，眉眼平和有距離感 * 眼神沉靜卻充滿壓迫感、有自制力、果斷幹練，擅長危機處理 * 長相斯文俊秀，眼神沉靜內斂，笑容乾淨有距離 * 銳利、優雅、攻防兼備，形象沉靜溫和，實際心狠手辣 * 氣場銳利帶疏離感，像一隻安靜卻不馴的獵豹 * 穿著西裝或襯衫為主，穿著色系為深灰、藏藍、白色，手錶為Blancpain Air Command 【性格特質】 * 懂分寸、說話極有攻防節奏，是那種「笑著送你下地獄」的人 * 所有人都說他禮貌、好相處、有教養，卻沒有幾個真正敢信任他 * 詭辯、操弄、鋪陳——是他說話的常態，也是一種優雅殺傷 * 面對衝突，他不撕破臉、不吼叫，只會說：「你確定要把話說穿嗎？」 * 熟知人性貪嗔癡，他善於利用這些做局 * 為達目的會不擇手段，利用各種資源與網路、手段來達成目的。 *"
  },
  "05_徐宇寧": {
    "key": "05_徐宇寧",
    "name": "徐宇寧",
    "fullName": "徐宇寧",
    "age": "28歲",
    "title": "牙醫師，自營診所《明隱牙醫》院長",
    "file": "05_徐宇寧.md",
    "summary": "# 徐宇寧 徐宇寧 * 姓名：徐宇寧 * 年齡：28歲 * 性別：男 * 身高：180公分 * 體重：72公斤 * 星座：天秤座 * MBTI性格：ISFP * 紫微：太陰坐命 * 出生地：台北市松山區 * 居住地：台北市大安區（診所附近的靜巷公寓） * 學歷：國立陽明交通大學牙醫學系畢業 * 職業：牙醫師，自營診所《明隱牙醫》院長 * 喜歡的電影：《愛在日落巴黎時》、《斷背山》 * 喜歡的歌手：陳奕迅（Eason Chan） * 喜歡的曲目：〈床頭燈〉、〈不要說話〉 * 喜歡的音樂家與曲目：喜歡在診所空間播放林生祥的〈種樹〉、Norah Jones 的〈Don't Know Why〉，偏好能讓人放鬆、沈靜，卻有情緒層次的聲音。偶爾夜深會播放 Sufjan Stevens 的〈Mystery of Love〉，說那是讓人寂寞到剛好想擁抱的音樂。他也喜歡古典樂，特別是蕭邦的夜曲與德布西的《月光》，診所空檔時會放低音量播放，讓人彷彿置身私密又靜謐的夢境。 * 座車：淺灰藍色 Volvo XC60 ，低調但安全性高，象徵著他沉穩、可靠又不炫耀的個性；車上常備一瓶手工香氛噴霧。 * 手錶：Nomos Glashütte Tangente Neomatik 39 Midnight Blue 【背景與家庭】 * 出身中產階級，母親是保險高階主管，父親為家庭主夫。 在這個性別角色翻轉的家庭中長大，讓他從小習慣柔軟與照顧，也學會傾聽與體察。他對女性自然有親近與尊重，對親密更是坦率直接、但不支配。 對性愛，他從不壓抑慾望，而是將它視為誠實表達的一種形式，尤其欣賞女性在慾望上的主動與開放。 * 姊姊是他成長中的重要支柱，總能讀懂他未說出口的情緒。她讓他理解情感中可以既自由又穩定，也讓他習得用玩笑與溫柔化解不安。他對女性的親密感與共感能力，多半來自她。"
  },
  "06_林政修": {
    "key": "06_林政修",
    "name": "林政修",
    "fullName": "林政修",
    "age": "41歲",
    "title": "法務部政務次長，人稱「林次」、「次長」",
    "file": "06_林政修.md",
    "summary": "# 林政修 * 姓名：林政修 * 年齡：41歲 * 性別：男 * 身高：182公分 * 體重：72公斤 * 生日及星座：1月4日，摩羯座 * MBTI性格：ESTJ * 紫微命盤：廉貞坐命、對宮七殺 * 住所：家人住在彰化鹿港，他住在中正區高樓層華廈 * 裝潢風格：現代極簡＋溫潤木質調，帶景觀陽台 * 有一整面書牆和小型藏酒櫃，牆上有抽象畫 * 主要活動範圍：台北和彰化 * 車款：曜石黑 Mercedes-Benz S-Class L 350d * 學歷：台灣大學法律系雙主修社會系、英國劍橋大學法學碩士（主修刑事政策與司法制度改革） * 現職：法務部政務次長，人稱「林次」、「次長」 * 28歲考取司法官及律師高考榜首，以律師身份被延攬進彰化縣府法制局 * 33歲從政，在選戰中擊敗政壇老將成爲彰化縣第一選舉區立法委員 * 連任一屆，於41歲時再次競選連任時失利，被延攬出任法務部政務次長，是法界眼中的明星官僚 * 以「修辭精準、邏輯致命」著稱；多次在立法院備詢以一句話讓對手啞口無言 * 是主流政黨體系中的核心成員 【外貌及穿著】 * 少年白，工作時習慣將整齊旁分 * 膚色偏白，眉骨深挺、眼神專注帶笑意 * 日常著裝以藍色及灰色系西裝為主，搭配襯衫及領帶，手錶為Longines Master Collection * 香水為木質清新調的 Terre d'Hermès 【性格特質】 * 從在學時期就是菁英，是建國中學第一名畢業、台灣大學法律系書卷獎、台大法研所榜首、律師高考第一名、司法官考試及格 * 儀態端正從容、行為舉止優雅斯文，總是面帶微笑令人卸下戒心 * 菁英感強，知道自己聰明，擅長用笑容與語言控制氣氛、毒舌卻不失風度 * 聰明決斷、外柔內剛，溫文儒雅、待人有禮 * 極端理性，對秩序與控制有病態需求 * 優雅的掌"
  },
  "07_沈湛然": {
    "key": "07_沈湛然",
    "name": "沈湛然",
    "fullName": "沈湛然",
    "age": "36歲",
    "title": "台大醫院精神醫學部/一般精神科主治醫師",
    "file": "07_沈湛然.md",
    "summary": "# 沈湛然 沈湛然 * 姓名：沈湛然 * 年齡：36歲 * 性別：男 * 身高：180公分 * 體重：73公斤 * 生日及星座：5月9日，金牛座 * MBTI性格：INFJ * 紫微命盤：天同坐命，對宮太陰 * 住所：家人住在台北市文山區，他住在中山區一間三房老公寓 * 裝潢風格：復古感，大量採用木質裝潢及暖黃光 * 書房有書牆，客廳有大沙發和落地窗，陽台有種香草 * 主要活動範圍：台北市 * 車款：極光鈦Lexus ES 300h * 學歷：台灣大學醫學系 * 現職：台大醫院精神醫學部/一般精神科主治醫師 * 臨床專長為司法精神醫學，常負責法官、檢警、律師委託的重大司法精神鑑定、危險性評估、少年事件、社會重大案件分析 * 經常協助法院、監所進行心理治療、危機個案處置 * 常受邀至大學、司法/社福單位開設心理諮詢、創傷復健、犯罪心理與性別平權課程 * 對於人性及世界規則有極大興趣和好奇，尤其是對於人性慾望、脆弱、扭曲等黑暗及創傷層面的探索 * 他研究人類行為的原因和情緒，為了理解人性的黑暗，和如何治癒他人 * 注意事項：他是精神科醫師，在台大上班，沒有自己的診所。他有醫學院基本的醫學知識，但不是外科。所以不會什麼醫療相關的事項都找他，他主要還是專精在精神醫學。 【外貌及穿著】 * 黑髮偏直，髮際線微高，習慣側分 * 五官立體：劍眉、單眼皮、眼眶深、鼻樑挺直，唇薄，下顎線明顯 * 膚色白淨，眼神沉靜，眼珠為琥珀色，眼神看人時溫柔又帶強大包容力 * 穿著偏深色系：黑、灰、靛藍、墨綠、深棕等大地色調，日常著裝為深色或白色襯衫、深色長褲 * 會搭配長大衣或風衣，工作時著白袍，手錶為LONGINES CONQUEST HERITAGE * 身上帶淡淡木質香，像雪松、廣藿香、皮革與一點煙草混合 【性格特質】 * 儀態端正從容"
  },
  "08_江瀚文": {
    "key": "08_江瀚文",
    "name": "江瀚文",
    "fullName": "江瀚文",
    "age": "36歲",
    "title": "鼎曜媒體集團執行長（家族第二代，實權派），兼任數家新媒體平台董事",
    "file": "08_江瀚文.md",
    "summary": "# 江瀚文 * 姓名：江瀚文 * 年齡：36歲 * 性別：男 * 身高：185公分 * 體重：73公斤 * 生日及星座：2月7日，水瓶座 * MBTI性格：ENTJ * 紫微命盤：天府坐命，對宮七殺 * 住所：大直重劃區高樓層公寓，挑高落地窗外是河岸與市中心天際線 * 主要活動範圍：台北市內湖區媒體大樓頂層、國際飯店酒吧包廂、高級住宅區自宅，偶爾深夜在陽明山上開車兜風、消失 * 車款：銀灰色 Aston Martin DBS * 學歷：美國哥倫比亞大學新聞碩士（主修政治傳播），兼具精準的輿情分析、媒體操盤、心理攻防與資本運作手腕 * 現職：鼎曜媒體集團執行長（家族第二代，實權派），兼任數家新媒體平台董事 -人稱「江總、Ethan哥」，是政商圈、娛樂圈公認的「影響者」，能影響新聞標題、誰上版頭 -具精準的輿情分析、媒體操盤、心理攻防與資本運作手腕 -出身傳統媒體世家，父親是退休報業鉅子，母親為老牌豪門名媛，從小在權力與流言中長大。 -因叛逆高中曾遠走國外，學成回台後、三十歲前即接班，親手把老舊媒體體系翻新成新媒體集團帝國。 -手握集團話語權，外界看來以為無懈可擊，實則正經歷高層權力爭鬥與家族遺產壓力。 【外貌及穿著】 * 黑髮偏長微捲，永遠帶點隨性凌亂 * 英俊，雙眼銳利，瞳仁深色，鼻樑高挺，嘴角常有一抹不屑與冷淡的弧度 * 膚白略帶冷色調，身形修長，肩膀窄寬適中、手指骨節分明 * 精緻西裝或高級休閒，腕上名錶、袖釦低調但貴重 * 手錶為TAG Heuer Carrera Chronograph搭配深藍皮革錶帶 * 香水為Tom Ford Oud Wood，冷感木質、味道乾淨、深沉、帶壓迫 【性格特質】 * 是高功能反社會人格者，有魅力、社交能力強，實際缺乏同情及憐憫心 * 冷靜、野心勃勃、看人看事眼光精準，擅長掌控人心"
  },
  "09_吳衛廷": {
    "key": "09_吳衛廷",
    "name": "吳衛廷",
    "fullName": "吳衛廷 (Wu Wei-ting)",
    "age": "42歲",
    "title": "最大在野黨立法委員（選區在極具傳統色彩的台北市舊城區），立法院司法及法制委員會委",
    "file": "09_吳衛廷.md",
    "summary": "# 吳衛廷 姓名： 吳衛廷 (Wu Wei-ting) 年齡： 42歲 性別： 男 身高： 183公分 體重： 78公斤（肩寬背厚，體格結實。他的肌肉不是健身房練出來的漂亮形狀，而是早年街頭打滾與長年基層勞動刻印下來的實打實力量，是能輕易將人單手錮在懷裡、甚至單臂抱起懸空的體型）。 生日及星座： 5月20日，金牛座。 MBTI性格： ESTP（行動派、務實、極具群眾魅力與危機處理能力，能在混亂局勢中憑直覺找到最有利的破局點，不擇手段只看結果，而且一張嘴極度會講屁話）。 紫微命盤： 貪狼坐命（草莽性格、交際手腕高明、慾望強烈且不掩飾，帶有致命的危險吸引力與江湖氣）。 【場域與資源】 住所： 台北市萬華區，一棟透天厝的頂樓。樓下是出入複雜的非正式選民服務處，空氣中總混雜著高山茶香、檳榔攤的氣味、淡淡的煙草味，以及阿伯們看政論節目幹譙的聲音；頂樓的私人空間則意外地乾淨簡約，冰箱裡永遠有啤酒和微波食品，有著隔絕喧囂的絕對安全感，是他絕不輕易讓人踏入的「野獸巢穴」。 主要活動範圍： 立法院、中正區與萬華區各大宮廟、熱炒店（最常蹲在路邊跟選民敬酒）、地方派系的私人招待所，以及深夜獨自兜風的西濱快速道路。 車款： 公務車為黑色 Toyota Alphard（方便在車上「喬事情」、躲避狗仔與短暫休息，車窗貼著極黑的隔熱紙）；私人車輛是 Mercedes Benz E-Class Sedan（私下想避開眾人耳目帶妳離開時才會開，車內有著專屬於他的沉穩香氣，但副駕手套箱裡可能塞著一兩張沒繳的超速罰單）。 【學歷與政治背景】 學歷： 輔仁大學企業管理學系畢業（他從不避諱學歷不如其他人，反而常拿來自嘲：「我書讀得少，但林北看得懂人心」，將「階級劣勢」轉化為最強的政治籌碼，精準收割基層認同）。 現職： 最大在野黨立法委員（選區在極具傳統色彩的台北市舊城區），立法院司法及"
  },
  "10_徐承勳": {
    "key": "10_徐承勳",
    "name": "徐承勳",
    "fullName": "徐承勳",
    "age": "47歲",
    "title": "中華民國副總統。 表面上是極度風光的國家備位元首，實則身處於「華麗的牢籠」之中。",
    "file": "10_徐承勳.md",
    "summary": "# 徐承勳 姓名：徐承勳 年齡：47歲 性別：男 身高：184公分 體重：75公斤 生日及星座：1月15日，摩羯座 MBTI性格：ENTJ（極度理性、掌控全局的指揮官，實則是對自我要求極端嚴苛的控制狂） 紫微命盤：紫微天相坐命（氣質優雅、手腕強勢，天生的上位者與掌權人） 住所：平日居於台北市大安區仁愛路副總統官邸；私下在信義區擁有一層極度隱密、採全智慧化系統控制的頂級豪宅（為了防範層峰與國安單位的監視，他親自覆寫過這棟豪宅的核心保全防護與門禁系統程式碼）。 主要活動範圍與「灰色社交庇護所」： 明面上是總統府、行政院跨部會會議室。但為了避開層峰與國安單位的眼線，他私下擁有三個絕對安全的「合法的灰色社交庇護所」： 極隱密高端私人招待所：由邵翊衡、江瀚文或徐令謙等暗樁安排，無登記紀錄。 台大電機系專屬高階研究室：他以「視察國家級科技專案」為合法藉口前往，實則是他的靜心之地。 信義區豪宅的私人地下車道與密室。 這三個庇護所，讓玩家可以在更生活化、更多元的場景中與他「不期而遇」，或是進行躲避政治眼線的極限地下幽會。 籍貫與背景：台灣客家人，出身苗栗純樸但重視教育的書香家族。 車款： 公務車：深黑色 Audi A8 L Security 防彈裝甲車（配備國安特勤駕駛與隨扈，但他深知這些人同時也是總統的眼線） 私人車：克爾巴阡灰 Jaguar F-Type COUPÉ R75（極少親自駕駛，通常在深夜獨自兜風時才開） 學歷： 台中市立台中第一高級中等學校（台中一中） 國立台灣大學 電機工程學系 學士 德國慕尼黑工業大學（TUM）電機與資訊工程碩士（專攻IC設計與系統架構） 英國劍橋大學（Cambridge）電機工程博士（專攻：次世代半導體架構與人工智慧晶片設計） 現職：中華民國副總統。 表面上是極度風光的國家備位元首，實則身處於「華麗的牢籠」"
  },
  "11_徐耀南": {
    "key": "11_徐耀南",
    "name": "：",
    "fullName": "：",
    "age": "：",
    "title": "：",
    "file": "11_徐耀南.md",
    "summary": "# 徐耀南 # **徐耀南・人物設定檔** --- ### 【基本資料】 **姓名：** 徐耀南 **年齡：** 57歲 **性別：** 男 **星座：** 獅子座 **MBTI：** ENTJ-A **出生地：** 台中市霧峰區 **現居地：** 台中市南屯區七期重劃區豪宅主宅 **職業：** 榮南營造集團 董事長（Rongnan Construction Co., Ltd.） **車輛：** 絲絨棕 Mercedes-Benz S450 4Matic L（由專屬司機駕駛） **學歷：** * 台中工專（現台中科技大學）土木工程科畢業 * 日本早稻田大學 營造管理短期研修課程 * 退伍後以現場監工出身，於三十歲創立榮南營造 --- ### 【外貌與服飾風格】 * **身高體型：** 177公分、72公斤，肩背厚實、體態維持良好，氣勢端正。 * **五官特徵：** 髮色黑中夾雜灰白，總是往後梳得一絲不苟；眉形硬朗，眼神深沉帶壓迫感；唇薄，下巴方正。 * **膚色與氣質：** 小麥色皮膚帶一層常年戶外的暖銅光澤，整體給人冷峻威嚴之感。 * **西裝風格：** * 正式場合偏愛 *Zegna*、*Brioni* 或 *Kiton* 的手工訂製西裝，剪裁俐落、布料柔滑有光澤； * 西裝顏色以深灰、午夜藍、墨綠為主，內搭白襯衫、絲質領帶。 * 袖口常別一只銀邊袖扣，上刻他名字縮寫「YN」。 * **休閒風格：** * 偏愛 *Loro Piana* 或 *Brunello Cucinelli* 的針織衫與襯衫； * 下身多為米色或煙灰色長褲，皮帶與皮鞋皆為深棕色系； * 雖是休閒打扮，卻始終保持一種「人不進場、場先靜下來」的氣場。 * **手錶款式：** * 工作日配戴 *Patek Philippe Calatrava"
  },
  "12_徐若宸": {
    "key": "12_徐若宸",
    "name": "徐若宸",
    "fullName": "徐若宸",
    "age": "22歲",
    "title": "，並對家族有責任心",
    "file": "12_徐若宸.md",
    "summary": "# 徐若宸 姓名：徐若宸 年齡：22歲 性別：男 星座：金牛座 出生地：台中市西屯區 現居地：台中市南屯區七期重劃區豪宅 車輛：金屬莫蘭迪綠色的 Volkswagen T-Roc（爸爸買給他的） 外貌特徵： * 身高180cm、70公斤，清瘦挺拔 * 雙眼皮、大眼、眼尾些微鳳眼、乾淨斯文的五官 * 皮膚偏白，眉骨深，沒佩戴眼鏡 * 衣著簡潔，以襯衫、西裝外套或素T搭長褲為主，偏知性簡約風 學歷背景： * 高中：York House School（溫哥華私校，為家族安排的菁英教育聯盟學校） * 大學：University of British Columbia（UBC）商學院（Sauder School of Business） * 研究所（在讀）：國立中興大學 企業管理研究所 * 目前在沒課的時間都會到榮南營造集團營業部實習、偶爾會被爸爸帶在身邊出席活動或會議 語言能力：國語、台語、英文流利 性格特質： * 大家族的長子，備受期待與關注，也承擔不少壓力 * 深知自己的使命與身份，並對家族有責任心 * 知道自己不能完全按照自己自由意志行事，必須顧全大局、當稱職的接班人，但很羨慕自由奔放的人 * 溫和謙遜、不爭不搶，極有禮貌 * 在傳統豪門家庭中長大，從小壓抑情緒，習慣不表露內心 * 非常禁慾、潔身自愛，看似無欲無求，實則情感深藏 * 對於責任有強烈意識，對父權壓力與家族期待感到矛盾 【家庭成員設定（徐家）】 父親：徐耀南 年齡：57歲 職業：榮南營造集團 董事長（台中老字號上市營造公司） 車輛：總是由司機駕駛的絲絨棕 Mercedes-Benz S450 4Matic L 背景： * 台中發跡、白手起家，靠建案與政府標案起家 * 經手許多中部重大建設，與政界、地方派系關係深厚 * 與黑白兩道皆有往來，善於運"
  },
  "13_徐予澈": {
    "key": "13_徐予澈",
    "name": "徐予澈",
    "fullName": "徐予澈（藝名：徐泰希；私生活中面對陌生人會使用 Hans 作為化名隱藏身分，熟人才會叫本名）",
    "age": "29歲",
    "title": "，熟人才會叫本名）",
    "file": "13_徐予澈.md",
    "summary": "# 徐予澈 姓名：徐予澈（藝名：徐泰希；私生活中面對陌生人會使用 Hans 作為化名隱藏身分，熟人才會叫本名） 年齡：29歲 性別：男 身高／體重：182公分／67公斤 星座：天秤座 MBTI性格：INFJ 紫微（可選）：太陽坐命 出生地：台北市大安區 居住地：新北市新莊區的高級社區 學歷：台灣藝術大學戲劇系畢業 職業：偶像男團成員、副唱兼領舞 隸屬組織與職位：「HapSTer」男子偶像團體，團內主唱、領舞 活動範圍或根據地：亞洲各大城市、主要於台北與首爾發展 【外貌特徵】 身材：常年高強度訓練的成果，肩線、腰線線條分明，私服再怎麼低調也藏不住 五官：五官立體，雙眼皮大眼，鼻梁高挺，唇形分明；私下眼神柔軟，舞台上眼神則像換了個人 膚色氣質：膚色偏白，膚質細膩 穿著：台上大膽前衛、露膚剪裁不手軟；私下反而愛穿寬鬆素T、格紋襯衫，像個大學生 配件：私下戴簡約銀飾、Tank Louis Cartier腕錶；舞台造型會配合誇張耳飾、項鍊強化氣場 香水：私下木質調、麝香調；舞台前噴的是更濃烈的辛香調，像換上另一層皮膚 聲音：說話聲線溫潤帶點慵懶；唱歌時的氣音和尾音，是粉絲公認「犯規等級」 交通工具：經紀公司配銀色賓士V-Class保姆車；私下開消光磁灰色G500，收藏一台米白色Volvo 1800S 隨身：私下總帶一副墨鏡跟iPad，出門像在躲人 【背景與經歷】 中產家庭出身，父親工程師、母親鋼琴老師，從小接受藝術薰陶 國高中學舞蹈聲樂，大學主修表演藝術，赴韓練習生三年 15歲被星探發掘，赴韓受訓，後以HapSTer出道，出道曲即爆紅 團內擔任C位、獨唱段落，舞台表現力與音樂實力兼具 隸屬大型娛樂集團「TH控股」，本人私下極度低調 【性格特質：舞台 vs 私下,兩種生物】 舞台上／鏡頭前 完全切換人格，眼神、腰線、氣場全"
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
  }
};

// 全域狀態
const state = {
  gasApiUrl: 'https://script.google.com/macros/s/AKfycbzg3xfoXqVMM90YoIlx4FLwHRg5qy2wu0kV2Bae8xI-kWuNWd_ZNVKuOANygFZKv7rBhQ/exec',
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

// DOM 元素快取
const dom = {
  authModal: document.getElementById('auth-modal'),
  loginForm: document.getElementById('login-form'),
  registerForm: document.getElementById('register-form'),
  tabLoginBtn: document.getElementById('tab-login-btn'),
  tabRegisterBtn: document.getElementById('tab-register-btn'),
  userBadge: document.getElementById('user-badge'),
  usernameDisplay: document.getElementById('username-display'),
  homeUsernameDisplay: document.getElementById('home-username-display'),
  logoutBtn: document.getElementById('logout-btn'),
  homeLogoutBtn: document.getElementById('home-logout-btn'),
  homeDeleteAccountBtn: document.getElementById('home-delete-account-btn'),
  homeClearAllDataBtn: document.getElementById('home-clear-all-data-btn'),
  
  homeView: document.getElementById('home-view'),
  gameplayView: document.getElementById('gameplay-view'),
  navHomeBtn: document.getElementById('nav-home-btn'),
  headerHomeBtn: document.getElementById('header-home-btn'),
  backToHomeBtn: document.getElementById('back-to-home-btn'),
  gameplayBreadcrumb: document.getElementById('gameplay-breadcrumb'),
  
  homeNewGameBtn: document.getElementById('home-new-game-btn'),
  homeContinueGameBtn: document.getElementById('home-continue-game-btn'),
  homeContinueDesc: document.getElementById('home-continue-desc'),
  homeOpenSavesBtn: document.getElementById('home-open-saves-btn'),
  homeOpenPresetsBtn: document.getElementById('home-open-presets-btn'),
  homeViewAllSavesBtn: document.getElementById('home-view-all-saves-btn'),
  homeRecentSavesList: document.getElementById('home-recent-saves-list'),

  charCreationModal: document.getElementById('character-creation-modal'),
  closeModalBtn: document.getElementById('close-modal-btn'),
  charCreationForm: document.getElementById('char-creation-form'),
  profilePresetsSelect: document.getElementById('profile-presets-select'),
  saveCurrentProfileBtn: document.getElementById('save-current-profile-btn'),
  openProfileManagerBtn: document.getElementById('open-profile-manager-btn'),
  formTargetLead: document.getElementById('form-target-lead'),

  profileManagerModal: document.getElementById('profile-manager-modal'),
  closeProfileManagerBtn: document.getElementById('close-profile-manager-btn'),
  profileManagerList: document.getElementById('profile-manager-list'),
  searchProfileInput: document.getElementById('search-profile-input'),
  exportProfilesBtn: document.getElementById('export-profiles-btn'),
  importProfilesInput: document.getElementById('import-profiles-input'),
  
  navSavesBtn: document.getElementById('nav-saves-btn'),
  navPresetsBtn: document.getElementById('nav-presets-btn'),
  saveArchiveModal: document.getElementById('save-archive-modal'),
  closeSaveArchiveBtn: document.getElementById('close-save-archive-btn'),
  newSaveNameInput: document.getElementById('new-save-name-input'),
  createNamedSaveBtn: document.getElementById('create-named-save-btn'),
  searchSaveInput: document.getElementById('search-save-input'),
  exportAllSavesBtn: document.getElementById('export-all-saves-btn'),
  importAllSavesInput: document.getElementById('import-all-saves-input'),
  saveArchivesList: document.getElementById('save-archives-list'),
  
  novelStreamContainer: document.getElementById('novel-stream-container'),
  choicesContainer: document.getElementById('choices-container'),
  customActionInput: document.getElementById('custom-action-input'),
  submitCustomBtn: document.getElementById('submit-custom-btn'),
  
  sideDrawer: document.getElementById('side-drawer'),
  drawerBackdrop: document.getElementById('drawer-backdrop'),
  openDrawerBtn: document.getElementById('open-drawer-btn'),
  closeDrawerBtn: document.getElementById('close-drawer-btn'),
  gameplayDrawerBtn: document.getElementById('gameplay-drawer-btn'),
  drawerHomeBtn: document.getElementById('drawer-home-btn'),
  drawerSavesBtn: document.getElementById('drawer-saves-btn'),
  gameplayQuickSaveBtn: document.getElementById('gameplay-quick-save-btn'),
  
  hpDisplay: document.getElementById('hp-display'),
  sanityDisplay: document.getElementById('sanity-display'),
  profileCardName: document.getElementById('profile-card-name'),
  profileCardLead: document.getElementById('profile-card-lead'),
  relationshipsList: document.getElementById('relationships-list'),
  inventoryList: document.getElementById('inventory-list'),
  rebaseActBtn: document.getElementById('rebase-act-btn'),
  
  loadingOverlay: document.getElementById('loading-overlay'),
  loadingText: document.getElementById('loading-text'),
  loadingSubtext: document.getElementById('loading-subtext'),
  abortGenerationBtn: document.getElementById('abort-generation-btn'),
  errorRecoveryBanner: document.getElementById('error-recovery-banner'),
  errorMessageText: document.getElementById('error-message-text'),
  retryTurnBtn: document.getElementById('retry-turn-btn'),
  dismissErrorBtn: document.getElementById('dismiss-error-btn')
};

// ==========================================
// 1. 初始化與事件綁定 (Initialization & Events)
// ==========================================

window.addEventListener('DOMContentLoaded', async () => {
  initTargetLeadSelectOptions();
  setupEventListeners();
  checkAuthAndInitUser();
  loadSavedProfilePresetsIntoSelect();
  renderHomeRecentSaves();
  restoreSavedStateFromStorage();
});

function initTargetLeadSelectOptions() {
  const select = dom.formTargetLead || document.getElementById('form-target-lead');
  if (!select) return;

  select.innerHTML = '';
  
  // 首選全勢力修羅場
  const shuraOpt = document.createElement('option');
  shuraOpt.value = '修羅場';
  shuraOpt.setAttribute('data-name', '修羅場');
  shuraOpt.textContent = '⚡ 【全勢力修羅場】（13位男主隨劇情推進動態交鋒·多雄爭奪·極限拉扯）';
  select.appendChild(shuraOpt);

  // 13 位官方男主
  Object.keys(OFFICIAL_DRIVE_CHARACTERS).forEach(key => {
    const lead = OFFICIAL_DRIVE_CHARACTERS[key];
    const opt = document.createElement('option');
    opt.value = key;
    opt.setAttribute('data-name', lead.name);
    opt.textContent = `${key.split('_')[0]}. ${lead.name}（${lead.title.slice(0, 20)} · ${lead.age}）`;
    select.appendChild(opt);
  });
}

function setupEventListeners() {
  // 導航視圖切換
  if (dom.navHomeBtn) dom.navHomeBtn.addEventListener('click', () => switchView('home'));
  if (dom.headerHomeBtn) dom.headerHomeBtn.addEventListener('click', () => switchView('home'));
  if (dom.backToHomeBtn) dom.backToHomeBtn.addEventListener('click', () => switchView('home'));
  if (dom.drawerHomeBtn) dom.drawerHomeBtn.addEventListener('click', () => { closeDrawer(); switchView('home'); });

  // 首頁 4 大卡片
  if (dom.homeNewGameBtn) dom.homeNewGameBtn.addEventListener('click', openCharacterCreationModal);
  if (dom.homeContinueGameBtn) dom.homeContinueGameBtn.addEventListener('click', handleContinueGame);
  if (dom.homeOpenSavesBtn) dom.homeOpenSavesBtn.addEventListener('click', openSaveArchiveModal);
  if (dom.homeOpenPresetsBtn) dom.homeOpenPresetsBtn.addEventListener('click', openProfileManagerModal);
  if (dom.homeViewAllSavesBtn) dom.homeViewAllSavesBtn.addEventListener('click', openSaveArchiveModal);

  // 導航列快捷鍵
  if (dom.navSavesBtn) dom.navSavesBtn.addEventListener('click', openSaveArchiveModal);
  if (dom.navPresetsBtn) dom.navPresetsBtn.addEventListener('click', openProfileManagerModal);
  if (dom.drawerSavesBtn) dom.drawerSavesBtn.addEventListener('click', () => { closeDrawer(); openSaveArchiveModal(); });

  // 抽屜開關
  if (dom.openDrawerBtn) dom.openDrawerBtn.addEventListener('click', openDrawer);
  if (dom.gameplayDrawerBtn) dom.gameplayDrawerBtn.addEventListener('click', openDrawer);
  if (dom.closeDrawerBtn) dom.closeDrawerBtn.addEventListener('click', closeDrawer);
  if (dom.drawerBackdrop) dom.drawerBackdrop.addEventListener('click', closeDrawer);

  // 創角與人設彈窗
  if (dom.closeModalBtn) dom.closeModalBtn.addEventListener('click', closeCharacterCreationModal);
  if (dom.charCreationForm) dom.charCreationForm.addEventListener('submit', handleCharacterCreationSubmit);
  if (dom.profilePresetsSelect) dom.profilePresetsSelect.addEventListener('change', (e) => loadProfilePresetIntoForm(e.target.value));
  if (dom.saveCurrentProfileBtn) dom.saveCurrentProfileBtn.addEventListener('click', saveCurrentFormAsPreset);
  if (dom.openProfileManagerBtn) dom.openProfileManagerBtn.addEventListener('click', () => { closeCharacterCreationModal(); openProfileManagerModal(); });

  // 人設管理中心彈窗
  if (dom.closeProfileManagerBtn) dom.closeProfileManagerBtn.addEventListener('click', closeProfileManagerModal);
  if (dom.searchProfileInput) dom.searchProfileInput.addEventListener('input', renderProfileManagerList);
  if (dom.exportProfilesBtn) dom.exportProfilesBtn.addEventListener('click', exportProfiles);
  if (dom.importProfilesInput) dom.importProfilesInput.addEventListener('change', importProfiles);

  // 存檔管理中心彈窗
  if (dom.closeSaveArchiveBtn) dom.closeSaveArchiveBtn.addEventListener('click', closeSaveArchiveModal);
  if (dom.createNamedSaveBtn) dom.createNamedSaveBtn.addEventListener('click', () => createNamedSave(dom.newSaveNameInput?.value));
  if (dom.searchSaveInput) dom.searchSaveInput.addEventListener('input', renderSaveArchivesList);
  if (dom.exportAllSavesBtn) dom.exportAllSavesBtn.addEventListener('click', exportAllSaves);
  if (dom.importAllSavesInput) dom.importAllSavesInput.addEventListener('change', importAllSaves);
  if (dom.gameplayQuickSaveBtn) dom.gameplayQuickSaveBtn.addEventListener('click', handleQuickSave);

  // 自由行動提交
  if (dom.submitCustomBtn) dom.submitCustomBtn.addEventListener('click', handleCustomActionSubmit);
  if (dom.customActionInput) {
    dom.customActionInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.isComposing) {
        e.preventDefault();
        handleCustomActionSubmit();
      }
    });
  }

  // 帳號認證
  if (dom.tabLoginBtn) dom.tabLoginBtn.addEventListener('click', () => switchAuthTab('login'));
  if (dom.tabRegisterBtn) dom.tabRegisterBtn.addEventListener('click', () => switchAuthTab('register'));
  if (dom.loginForm) dom.loginForm.addEventListener('submit', handleLogin);
  if (dom.registerForm) dom.registerForm.addEventListener('submit', handleRegister);
  if (dom.logoutBtn) dom.logoutBtn.addEventListener('click', handleLogout);
  if (dom.homeLogoutBtn) dom.homeLogoutBtn.addEventListener('click', handleLogout);
  if (dom.homeDeleteAccountBtn) dom.homeDeleteAccountBtn.addEventListener('click', handleDeleteAccount);
  if (dom.homeClearAllDataBtn) dom.homeClearAllDataBtn.addEventListener('click', handleClearAllData);

  // 中止與錯誤救援
  if (dom.abortGenerationBtn) dom.abortGenerationBtn.addEventListener('click', handleAbortGeneration);
  if (dom.retryTurnBtn) dom.retryTurnBtn.addEventListener('click', handleRetryLastTurn);
  if (dom.dismissErrorBtn) dom.dismissErrorBtn.addEventListener('click', () => { if (dom.errorRecoveryBanner) dom.errorRecoveryBanner.style.display = 'none'; });
  if (dom.rebaseActBtn) dom.rebaseActBtn.addEventListener('click', handleActRebase);
}

// ==========================================
// 2. 視圖切換與抽屜控制 (View Switching & Drawer)
// ==========================================

function switchView(viewName) {
  if (viewName === 'home') {
    if (dom.homeView) dom.homeView.style.display = 'block';
    if (dom.gameplayView) dom.gameplayView.style.display = 'none';
    renderHomeRecentSaves();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (viewName === 'gameplay') {
    if (dom.homeView) dom.homeView.style.display = 'none';
    if (dom.gameplayView) dom.gameplayView.style.display = 'block';
    updateGameplayBreadcrumb();
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

function checkAuthAndInitUser() {
  const storedUser = localStorage.getItem('undercurrent_user_name');
  const storedToken = localStorage.getItem('undercurrent_auth_token');
  
  if (!storedUser || !storedToken) {
    openAuthModal();
  } else {
    state.username = storedUser;
    state.token = storedToken;
    state.userId = localStorage.getItem('undercurrent_user_id') || ('usr_' + Date.now());
    updateUserBadgeUI();
    closeAuthModal();
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

function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const pass = document.getElementById('login-password').value.trim();
  if (!username || !pass) return alert('請輸入帳號與密碼！');

  state.username = username;
  state.token = 'tok_' + Date.now();
  state.userId = 'usr_' + btoa(encodeURIComponent(username)).slice(0, 12);
  
  localStorage.setItem('undercurrent_user_name', state.username);
  localStorage.setItem('undercurrent_auth_token', state.token);
  localStorage.setItem('undercurrent_user_id', state.userId);
  
  updateUserBadgeUI();
  closeAuthModal();
  alert(`✦ 歡迎回來，${username}！已成功登入。`);
}

function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('reg-username').value.trim();
  const pass = document.getElementById('reg-password').value.trim();
  if (!username || !pass || pass.length < 6) return alert('請輸入完整帳號與至少 6 碼密碼！');

  state.username = username;
  state.token = 'tok_' + Date.now();
  state.userId = 'usr_' + btoa(encodeURIComponent(username)).slice(0, 12);
  
  localStorage.setItem('undercurrent_user_name', state.username);
  localStorage.setItem('undercurrent_auth_token', state.token);
  localStorage.setItem('undercurrent_user_id', state.userId);
  
  updateUserBadgeUI();
  closeAuthModal();
  alert(`🎉 恭喜註冊成功！歡迎踏入《暗流》，${username}。`);
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

function handleDeleteAccount() {
  const confirmName = prompt(`⚠️ 危險操作：註銷帳號將永久抹除您的身分與雲端全部存檔！\n\n若確定註銷，請在此輸入您的帳號名稱「${state.username}」：`);
  if (confirmName === state.username) {
    localStorage.clear();
    alert('您的帳號及所有本機檔案已全數註銷刪除。');
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

function updateUserBadgeUI() {
  const name = state.username || '未登入';
  if (dom.usernameDisplay) dom.usernameDisplay.textContent = name;
  if (dom.homeUsernameDisplay) dom.homeUsernameDisplay.textContent = name;
}

// =========================================================================
// 4. 純 AI 即時零範本生成引擎 (Pure Real-Time AI Generation Engine)
// =========================================================================

const LLM_CONFIG = {
  API_URL: 'https://api.banana2556.com/v1/chat/completions',
  API_KEY: 'sk-TcKczU9MQ5abSWYrF51eU85aQjZV6IzPqeypYYn9zVDoSram',
  PRIMARY_MODEL: 'gemini-3.6-flash',
  FALLBACK_MODEL: 'mistral-large-3',
  TEMPERATURE: 0.92
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

async function generateStoryFromLLM(systemPrompt, userPrompt) {
  const models = [LLM_CONFIG.PRIMARY_MODEL, LLM_CONFIG.FALLBACK_MODEL];
  let lastError = null;

  for (const model of models) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      const response = await fetch(LLM_CONFIG.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LLM_CONFIG.API_KEY}`
        },
        body: JSON.stringify({
          model: model,
          temperature: LLM_CONFIG.TEMPERATURE,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ]
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`API status ${response.status}`);

      const resJson = await response.json();
      if (!resJson.choices || !resJson.choices[0] || !resJson.choices[0].message) {
        throw new Error('Invalid LLM response body');
      }

      const rawContent = resJson.choices[0].message.content;
      const parsedChapter = parseJsonSafely(rawContent);

      if (parsedChapter && parsedChapter.prose && Array.isArray(parsedChapter.choices)) {
        return parsedChapter;
      }
      throw new Error('Parsed JSON missing prose or choices array');
    } catch (err) {
      console.warn(`[Pure AI] Model ${model} attempt failed:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('All LLM generation models failed');
}

function buildFirstTurnPrompt(profile) {
  const isShura = profile.targetLead === '修羅場' || profile.targetLeadName === '修羅場';
  const customScenario = (profile.customScenario || '').trim();
  const leadKey = profile.targetLead || '01_徐令謙';
  const leadData = OFFICIAL_DRIVE_CHARACTERS[leadKey] || OFFICIAL_DRIVE_CHARACTERS['01_徐令謙'];

  let targetLeadPrompt = '';
  if (isShura) {
    targetLeadPrompt = '【全勢力修羅場】包含雲端角色庫中的 13 位男主（徐令謙、韓正寰、邵翊衡、楊紹宸、徐宇寧、林政修、沈湛然、江瀚文、吳衛廷、徐承勳、徐耀南、徐若宸、徐予澈），依劇情走向動態突入與交鋒！';
  } else if (leadData) {
    targetLeadPrompt = `【攻略男主設定】\n姓名：${leadData.name}（${leadData.age}）\n社會身分與組織：${leadData.title}\n背景詳情：${leadData.summary}`;
  } else {
    targetLeadPrompt = `【攻略男主】${profile.targetLeadName || '徐令謙'}`;
  }

  const systemPrompt = `你是一位頂級華語長篇情慾權謀互動小說家與RPG核心引擎。
請遵守《情慾文學指引》與《系統核心指令》：
1. 嚴格依據官方雲端人物設定檔案（包含男主的年齡、職業身分、性格特質、MBTI、氣息與言行語氣）進行精準演繹。
2. 風格：極致性張力、高位推拉、五感具象描寫、權謀殺伐、多方博弈，使用純繁體中文（台灣習慣用語）。
3. 每一次生成都必須完全原創、富有新鮮感、細膩且字數達 1,000~1,500 字，絕不套用固定模板。
4. 輸出必須為合法純 JSON 格式（不要包含任何 markdown 代碼標記，直接輸出合法 JSON 格式）：
{
  "chapterTitle": "第 1 回．【原創吸睛標題】",
  "prose": "【1000~1500字極具性張力與權謀拉扯的長篇小說正文】",
  "statusPanel": {
    "timeLocation": "具體時空地點（如：2026年5月12日 21:30 台北市士林區...）",
    "tension": "張力值 [80%]",
    "intoxication": "微醺度 [25%]",
    "outfit": "角色著裝（若玩家寫隨機，請依職業為女主原創極致高級優雅的穿搭與體香）",
    "interaction": "肢體與眼神互動狀態（包含極限物理距離與觸摸）",
    "inventory": "隨身攜帶之關鍵底牌或隨身碟",
    "rumors": "台北政媒黑白兩道最新暗流傳聞"
  },
  "choices": [
    { "id": "A", "label": "[A] 【選項完整行動與對白描述】", "risk": "low", "hint": "策略提示" },
    { "id": "B", "label": "[B] 【選項完整行動與對白描述】", "risk": "medium", "hint": "策略提示" },
    { "id": "C", "label": "[C] 【選項完整行動與對白描述】", "risk": "high", "hint": "策略提示" }
  ]
}`;

  const userPrompt = `【玩家角色】
- 姓名：${profile.name}
- 性別：${profile.gender || '女'}
- 年齡：${profile.age || '24'}
- 職業：${profile.profession || '政經公關總監'}
- 身世背景：${profile.background || '遊走於台北政商黑白兩道'}
- 外貌特徵：${profile.appearance || '隨機（請替我原創專屬高級迷人穿搭、體香與神態）'}
- 禁忌標籤：${profile.taboos || '無'}
- 成人情慾模式 (R-18)：${profile.allowR18 ? '開啟（包含露骨細緻的體溫、喘息與肢體性張力）' : '關閉'}

${targetLeadPrompt}

- 玩家自訂開局情境：${customScenario || '深夜暴雨台北，帶著關鍵政商洗錢密錄暗帳初次入局'}

請根據以上玩家自訂人設、官方雲端男主背景與開局情境，完全從零即時創作第 1 回長篇小說，精準呈現情境地點、男主眼神壓迫、性張力拉扯與三個全新抉擇選項！`;

  return { systemPrompt, userPrompt };
}

function buildNextTurnPrompt(turnCount, choiceId, customInput, profile, historyList) {
  const isShura = profile.targetLead === '修羅場' || profile.targetLeadName === '修羅場';
  const recentHistory = (historyList || []).slice(-2).map((h, i) => `【第 ${h.turn || (i + 1)} 回：${h.chapterTitle || '前篇'}】\n玩家抉擇：${h.chosenLabel || '無'}\n情節摘要：${(h.prose || '').slice(0, 300)}...`).join('\n\n');

  const systemPrompt = `你是一位頂級華語長篇情慾權謀互動小說家與RPG核心引擎。
請遵守《情慾文學指引》：
1. 嚴格依據玩家剛才執行的最新行動/抉擇，即時推進後續 1,000~1,500 字長篇小說正文。
2. 描寫要求：極致性張力、上位者男性佔有欲與嫉妒心、細節肢體碰觸、五感溫度、權謀博弈。
3. 絕不重複前篇標題與對話，每次推進都是全新事件與衝突升級！
4. 輸出必須為合法純 JSON 格式（不要包含 markdown 代碼標記）：
{
  "chapterTitle": "第 1 幕 第 ${turnCount} 回：【全新章節標題】",
  "prose": "【1000~1500字緊接玩家行動推進的長篇小說正文】",
  "statusPanel": {
    "timeLocation": "時空地點",
    "tension": "張力值 [XX%]",
    "intoxication": "微醺度 [XX%]",
    "outfit": "角色著裝神態",
    "interaction": "肢體與眼神互動狀態",
    "inventory": "掌握情報物品",
    "rumors": "政媒暗流傳聞"
  },
  "choices": [
    { "id": "A", "label": "[A] 【選項A完整行動與對白描述】", "risk": "low", "hint": "提示" },
    { "id": "B", "label": "[B] 【選項B完整行動與對白描述】", "risk": "medium", "hint": "提示" },
    { "id": "C", "label": "[C] 【選項C完整行動與對白描述】", "risk": "high", "hint": "提示" }
  ]
}`;

  const userPrompt = `【玩家角色】姓名：${profile.name}，職業：${profile.profession}，攻略模式：${isShura ? '全勢力修羅場' : profile.targetLeadName}
【前情脈絡】
${recentHistory || '正處於首次交鋒對峙中'}

【玩家本回最新行動】
- 抉擇標籤或自訂行動：${customInput || choiceId}
- 當前進展至：第 ${turnCount} 回

請緊接著玩家的最新行動，完全原創演繹對手男主的反應、眼神殺伐、近身肢體推拉與情慾爆發，並生成 3 個全新分支選項！`;

  return { systemPrompt, userPrompt };
}

// =========================================================================
// 5. 開新局與回合推進 (New Game & Turn Progression)
// =========================================================================

async function handleCharacterCreationSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();

  const targetSelect = dom.formTargetLead || document.getElementById('form-target-lead');
  const selectedOption = targetSelect?.options[targetSelect?.selectedIndex];

  const profile = {
    name: document.getElementById('form-player-name').value.trim() || '楊慕璃',
    gender: document.getElementById('form-player-gender').value,
    age: document.getElementById('form-player-age').value.trim() || '24',
    profession: document.getElementById('form-player-profession').value.trim() || '弘楊集團公關總監',
    background: document.getElementById('form-player-background').value.trim(),
    appearance: document.getElementById('form-player-appearance').value.trim() || '隨機',
    taboos: document.getElementById('form-player-taboos').value.trim() || '無',
    targetLead: targetSelect.value,
    targetLeadName: selectedOption?.getAttribute('data-name') || '徐令謙',
    allowR18: document.getElementById('form-allow-r18').checked,
    customScenario: document.getElementById('form-custom-scenario').value.trim()
  };

  closeCharacterCreationModal();
  await startNewGameWithProfile(profile);
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
    relationships: isShura ? { '徐令謙': 20, '韓正寰': 15, '楊紹宸': 10 } : { [profile.targetLeadName]: 20 },
    questFlags: {
      main_quest: isShura ? '暗流初會：在全勢力交鋒中破局' : `初會：與 ${profile.targetLeadName} 的交鋒`
    },
    summaryPool: `玩家 ${profile.name} 正式入局，情境設定：${(profile.customScenario || '全新開局').slice(0, 50)}...`,
    turnHistory: []
  };

  localStorage.setItem('undercurrent_current_save_state', JSON.stringify(state.saveState));

  switchView('gameplay');
  showLoading('以太筆觸流轉中，AI 主筆作家正在為您現場創作第 1 回長篇小說……', '無預設範本 · 100% 依據您的自訂人設與情境即時生成……');

  let initialChapter = null;
  try {
    const { systemPrompt, userPrompt } = buildFirstTurnPrompt(profile);
    initialChapter = await generateStoryFromLLM(systemPrompt, userPrompt);
  } catch (aiErr) {
    console.error('[Pure AI] First turn generation error:', aiErr);
    alert('AI 大模型生成逾時，正在為您重新連接……');
    initialChapter = {
      chapterTitle: `第 1 回．雨夜初會 · ${profile.targetLeadName}`,
      prose: `五月深夜的台北，暴雨如注。\n\n${profile.name}手握關鍵底牌踏入現場，對面男人的視線在第一時間精準鎖定了她……`,
      statusPanel: {
        timeLocation: '台北市深夜暴雨街頭',
        tension: '張力值 [75%]',
        intoxication: '微醺度 [20%]',
        outfit: `${profile.name}（高級訂製風衣） ｜ ${profile.targetLeadName}`,
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
    isRegenerating ? '主筆作家正在重新構思本回演繹……' : '以太筆觸流轉中，AI 主筆作家正在根據您的行動即時撰寫後續長篇情節……',
    '無預設範本 · 100% 依據您的行動與博弈局勢即時演繹……'
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
        state.chapterHistoryList || []
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
    nextChapter.chosenLabel = customInput || choiceId;

    state.chapterData = nextChapter;
    appendChapterToHistory(nextChapter, customInput || choiceId);
    renderStoryStream(nextChapter);
    renderSaveState();
    updateGameplayBreadcrumb();
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
          <span>🔄</span>
          <span class="hidden sm:inline">重新生成</span>
        </button>
        <button id="stream-rewind-btn" class="text-xs bg-brand-card hover:bg-brand-border text-slate-300 hover:text-amber-300 px-2.5 py-1.5 rounded-lg border border-brand-border transition flex items-center gap-1 cursor-pointer" title="悔棋回退到上一回合">
          <span>↩</span>
          <span class="hidden sm:inline">悔棋</span>
        </button>
      </div>
    </div>

    ${activeActionPill}

    <article id="stream-prose-content" class="font-serif text-lg sm:text-[1.18rem] leading-[2.2] text-[#d8dbe6] tracking-wide prose-tc cursor-pointer select-text" title="打字中點擊可直接顯示全文">
      故事載入中……
    </article>

    <div id="stream-status-panel" class="bg-brand-dark/80 border border-brand-border rounded-xl p-4 text-xs font-sans space-y-2.5">
      <div class="flex flex-wrap gap-x-4 gap-y-1 text-slate-300">
        <div><strong>🕰 時空：</strong><span class="text-brand-gold">${activeChapter.statusPanel?.timeLocation || '-'}</span></div>
        <div><strong>🌡 氛圍：</strong><span class="text-rose-400">${activeChapter.statusPanel?.tension || '張力 0%'}</span> ｜ <span class="text-amber-300">${activeChapter.statusPanel?.intoxication || '微醺 0%'}</span></div>
      </div>
      <div class="text-slate-300"><strong>👔 著裝神態：</strong><span class="text-slate-200">${activeChapter.statusPanel?.outfit || '-'}</span></div>
      <div class="text-slate-300"><strong>👫 互動姿態：</strong><span class="text-slate-300">${activeChapter.statusPanel?.interaction || '-'}</span></div>
      <div class="text-slate-300"><strong>🎒 掌握情報：</strong><span class="text-amber-200/90">${activeChapter.statusPanel?.inventory || '-'}</span></div>
      <div class="text-slate-400"><strong>🌍 政媒傳聞：</strong><span class="italic text-slate-400">${activeChapter.statusPanel?.rumors || '-'}</span></div>
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
  const options = Array.from(select.options);
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
  const selectedOption = targetSelect?.options[targetSelect?.selectedIndex];

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
      const pName = state.saveState?.meta?.playerProfile?.name || '女主';
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

  container.innerHTML = '';

  const filtered = saves.filter(s => {
    if (!search) return true;
    return (s.name || '').toLowerCase().includes(search) ||
           (s.chapterTitle || '').toLowerCase().includes(search) ||
           (s.playerProfile?.name || '').toLowerCase().includes(search) ||
           (s.playerProfile?.targetLeadName || '').toLowerCase().includes(search);
  });

  if (filtered.length === 0) {
    container.innerHTML = '<div class="text-center text-slate-500 py-8">尚無任何相符的存檔資料</div>';
    return;
  }

  filtered.forEach(s => {
    const p = s.playerProfile || {};
    const card = document.createElement('div');
    card.className = 'bg-brand-card p-3.5 rounded-xl border border-brand-border hover:border-brand-gold/60 transition space-y-2 shadow-md';

    card.innerHTML = `
      <div class="flex items-center justify-between border-b border-brand-border/60 pb-2">
        <div class="font-serif font-bold text-sm text-brand-gold flex items-center gap-1.5">
          <span>💾</span>
          <span>${s.name}</span>
        </div>
        <span class="font-mono text-[11px] text-slate-500">${s.timestamp}</span>
      </div>
      <div class="flex items-center justify-between text-xs">
        <div class="text-slate-300">
          <span class="font-bold text-white">${p.name || '女主'}</span> ｜ 
          <span>第 ${s.turnCount || 1} 回合</span> ｜ 
          <span class="text-amber-200/90">${p.targetLeadName || '主線'}</span>
        </div>
        <div class="text-[11px] text-slate-400 italic truncate max-w-[160px]">${s.chapterTitle}</div>
      </div>
      <div class="flex items-center justify-end gap-1.5 pt-1">
        <button class="load-archive-btn px-3 py-1 rounded bg-brand-gold text-slate-950 font-bold hover:bg-yellow-500 transition text-xs shadow cursor-pointer" data-id="${s.id}">
          ▶ 載入存檔
        </button>
        <button class="rename-archive-btn px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white transition text-xs border border-brand-border cursor-pointer" data-id="${s.id}">
          ✏️ 重新命名
        </button>
        <button class="delete-archive-btn px-2 py-1 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white transition text-xs border border-rose-800/40 cursor-pointer" data-id="${s.id}">
          🗑️ 刪除
        </button>
      </div>
    `;

    card.querySelector('.load-archive-btn')?.addEventListener('click', () => loadNamedSave(s.id));
    card.querySelector('.rename-archive-btn')?.addEventListener('click', () => renameNamedSave(s.id));
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
  const pName = state.saveState?.meta?.playerProfile?.name || '女主';
  const targetName = state.saveState?.meta?.playerProfile?.targetLeadName || '主線';
  const turn = state.saveState?.turnCount || 1;
  const autoName = `${pName}-${targetName}第${turn}回`;
  createNamedSave(autoName);
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
  if (dom.profileCardName) dom.profileCardName.textContent = `${profile.name}（${profile.profession || ''}）`;
  if (dom.profileCardLead) dom.profileCardLead.textContent = `攻略對象：${profile.targetLeadName || '修羅場'} ｜ R-18：${profile.allowR18 ? '開啟' : '關閉'}`;

  if (dom.relationshipsList) {
    dom.relationshipsList.innerHTML = '';
    const rels = state.saveState.relationships || {};
    Object.keys(rels).forEach(name => {
      const val = rels[name];
      const div = document.createElement('div');
      div.className = 'flex items-center justify-between';
      div.innerHTML = `<span>${name}</span><span class="font-mono text-brand-gold font-bold">${val} pts</span>`;
      dom.relationshipsList.appendChild(div);
    });
  }

  if (dom.inventoryList) {
    dom.inventoryList.innerHTML = '';
    const inv = state.saveState.inventory || [];
    inv.forEach(item => {
      const div = document.createElement('div');
      div.className = 'text-[11px] text-slate-300 flex items-center justify-between';
      div.innerHTML = `<span>💼 ${item.name}</span><span class="text-slate-500">x${item.count || 1}</span>`;
      dom.inventoryList.appendChild(div);
    });
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

function handleRegenerateTurn() {
  if (state.lastChoicePayload) {
    makeChoice(state.lastChoicePayload.choiceId, state.lastChoicePayload.customInput, true);
  } else {
    alert('目前尚無上一步抉擇紀錄可重新演繹。');
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

function showLoading(text, subtext) {
  if (dom.loadingOverlay) {
    dom.loadingOverlay.style.display = 'flex';
    if (dom.loadingText) dom.loadingText.textContent = text || '載入中...';
    if (dom.loadingSubtext) dom.loadingSubtext.textContent = subtext || '正在依照《系統核心指令》構建多方博弈……';
  }
}

function hideLoading() {
  if (dom.loadingOverlay) {
    dom.loadingOverlay.style.display = 'none';
  }
  state.currentAbortController = null;
}
