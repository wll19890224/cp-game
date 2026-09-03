const PRESET_STORAGE_KEY = 'cp_game_presets'

export const BUILTIN_PRESETS = [
  {
    id: 'official_trio_default',
    isBuiltin: true,
    name: { zh: '官方标准 · 3P双阶段极乐', en: 'Official 3P Bliss', th: 'มาตรฐาน 3P สองสเต็ป' },
    desc: { zh: '破冰、共浴到赤裸前戏的经典平衡体验', en: 'Classic experience from icebreak to deep foreplay', th: 'ประสบการณ์คลาสสิกตั้งแต่จิบเบาๆ จนถึงเล้าโลมขั้นลึก' },
    mode: 'board_3p',
    tasks: {
      trio: [
        {
          id: 'trio-101',
          level: 1,
          duration: 45,
          isTrio: true,
          text: {
            zh: '{FEMALE_1} 从正面吻住并轻吮 {MALE} 的喉结，{FEMALE_2} 则从其身后贴紧，舌尖沿着后颈与锁骨游走，两人同时留下湿热印记持续 30 秒。',
            en: '{FEMALE_1} sucks on {MALE}\'s Adam\'s apple while {FEMALE_2} presses tight from behind, tracing his nape and collarbone with her tongue for 30s.',
            th: '{FEMALE_1} ดูดเม้มลูกกระเดือกของ {MALE} จากด้านหน้า ส่วน {FEMALE_2} แนบชิดจากด้านหลัง ใช้ปลายลิ้นเลียตามซอกคอและไหปลาร้า ทิ้งรอยเปียกชื้นไว้พร้อมกัน 30 วินาที'
          }
        },
        {
          id: 'trio-102',
          level: 1,
          duration: 45,
          isTrio: true,
          text: {
            zh: '将冰凉的 {DRINKABLE} 滴在 {MALE} 的胸口与腹肌沟壑上，两位女士分别伏在其胸前与小腹，用舌尖将酒液一点点舔舐吸干，不准残留一滴。',
            en: 'Drip chilled {DRINKABLE} down {MALE}\'s chest and abs. Both ladies kneel close, using their tongues to lick and suck every drop completely clean.',
            th: 'หยด {DRINKABLE} เย็นจัดลงบนแผงอกและร่องหน้าท้องของ {MALE} สองสาวโน้มตัวลงใช้ปลายลิ้นเลียดูดกินน้ำเครื่องดื่มจนหมดเกลี้ยง ห้ามเหลือแม้แต่หยดเดียว'
          }
        },
        {
          id: 'trio-103',
          level: 1,
          duration: 60,
          isTrio: true,
          text: {
            zh: '两位女士左右各用一只手，缓慢将 {MALE} 的上衣扣子逐颗全部解开并剥褪至肩下，随后指甲轻轻划过其裸露的肋骨与腹部。',
            en: 'The ladies each use one hand to unbutton {MALE}\'s shirt completely, peeling it off his shoulders and lightly raking nails across his bare ribs.',
            th: 'สองสาวใช้มือคนละข้างค่อยๆ ปลดกระดุมเสื้อของ {MALE} ออกจนหมด ดึงเสื้อลงมาที่หัวไหล่ แล้วใช้ปลายเล็บกรีดเบาๆ ผ่านซี่โครงและหน้าท้องเปลือยเปล่า'
          }
        },
        {
          id: 'trio-104',
          level: 1,
          duration: 45,
          isTrio: true,
          text: {
            zh: '{MALE} 戴上 {ITEM} 蒙眼，两位女士轮流用温热的舌尖在其耳廓与下唇轻舔一口，{MALE} 必须凭触感与喘息声猜出先后顺序，猜错任由两女惩罚。',
            en: '{MALE} is blindfolded with {ITEM}. The ladies take turns licking his ear and lower lip. {MALE} must guess who went first by touch and breath alone.',
            th: '{MALE} สวม {ITEM} ปิดตา สองสาวผลัดกันใช้ปลายลิ้นอุ่นๆ เลียที่ใบหูและริมฝีปากล่าง {MALE} ต้องทายลำดับให้ถูกจากสัมผัสและเสียงลมหายใจ หากทายผิดต้องโดนลงโทษ'
          }
        },
        {
          id: 'trio-105',
          level: 1,
          duration: 45,
          isTrio: true,
          text: {
            zh: '{FEMALE_1} 与 {FEMALE_2} 褪去内衣或隔着单薄衣物，左右一齐将丰满胸口死死挤压贴合在 {MALE} 的后背两侧，双手环绕其腰间缓慢磨蹭 30 秒。',
            en: 'Both ladies press their bare or thinly-clad breasts firmly against {MALE}\'s back from both sides, wrapping arms around his waist to rub against him for 30s.',
            th: 'สองสาวแนบหน้าอกชิดติดแผ่นหลังทั้งสองข้างของ {MALE} อย่างแน่นหนา สองมือโอบกอดรอบเอวแล้วบดเบียดเสียดสีหน้าอกไปมา 30 วินาที'
          }
        },
        {
          id: 'trio-106',
          level: 1,
          duration: 45,
          isTrio: true,
          text: {
            zh: '{MALE} 口含一口 {DRINKABLE} 吻向 {FEMALE_1} 度入口中，{FEMALE_1} 咽下一半后，立刻深吻贴向 {FEMALE_2} 将剩余酒液度入其口中，三人唇舌必须深扣。',
            en: '{MALE} takes a sip of {DRINKABLE}, mouth-to-mouth feeding {FEMALE_1}. She swallows half, then immediately french kisses {FEMALE_2} to pass the rest.',
            th: '{MALE} อม {DRINKABLE} ไว้แล้วประกบปากป้อนให้ {FEMALE_1} เมื่อเธอกลืนไปครึ่งหนึ่ง ให้รีบจูบแลกลิ้นส่งต่อส่วนที่เหลือเข้าปาก {FEMALE_2} ทันที'
          }
        },
        {
          id: 'trio-107',
          level: 1,
          duration: 60,
          isTrio: true,
          text: {
            zh: '由两位女士合力解开 {MALE} 的皮带并拉下拉链，两位女士各伸出一只手伸入裤腰两侧抚摸其胯骨边缘，严禁真正触碰正中，挑逗 45 秒。',
            en: 'Both ladies team up to unbuckle {MALE}\'s belt and unzip his pants, sliding hands inside his waistband to caress his hipbones, teasing the edge for 45s.',
            th: 'สองสาวช่วยกันปลดเข็มขัดและรูดซิปกางเกงของ {MALE} สอดมือเข้าไปในขอบเอวทั้งสองข้างลูบไล้กระดูกเชิงกราน ยั่วเย้าตามแนวขอบโดยห้ามจับตรงกลาง 45 วินาที'
          }
        },
        {
          id: 'trio-108',
          level: 1,
          duration: 45,
          isTrio: true,
          text: {
            zh: '将少许 {EATABLE} 抹在 {MALE} 的耳垂与喉结两侧，两位女士左右开工，同时用湿润的舌尖舔尽，期间发出细微吮吸声刺激其听觉。',
            en: 'Dab {EATABLE} on {MALE}\'s earlobes and neck. Both ladies lick it clean simultaneously with wet tongues, making soft sucking sounds in his ears.',
            th: 'ป้าย {EATABLE} เล็กน้อยบนติ่งหูและลำคอของ {MALE} สองสาวประกบซ้ายขวาใช้ลิ้นเลียดูดจนหมด พร้อมส่งเสียงครางเบาๆ กระตุ้นโสตประสาท'
          }
        },
        {
          id: 'trio-109',
          level: 1,
          duration: 45,
          isTrio: true,
          text: {
            zh: '{FEMALE_1} 跨坐在 {MALE} 大腿上，双腿紧紧盘住其腰部前后摆动研磨；同时 {FEMALE_2} 从背后抱住 {MALE} 揉捏其胸口并啃咬其肩膀。',
            en: '{FEMALE_1} straddles {MALE}\'s lap, wrapping her legs tight and grinding against him, while {FEMALE_2} hugs him from behind, groping his chest and biting his shoulder.',
            th: '{FEMALE_1} นั่งคร่อมตัก {MALE} ใช้ขาเกี่ยวเอวไว้แน่นแล้วบดสะโพกเข้าหา ในขณะที่ {FEMALE_2} กอดจากด้านหลัง บีบเค้นแผงอกและขบกัดหัวไหล่ของเขา'
          }
        },
        {
          id: 'trio-110',
          level: 1,
          duration: 45,
          isTrio: true,
          text: {
            zh: '{MALE} 双手分别滑入两位女士的裙底或裤腰内，仅隔着贴身内裤按压抚摸两女的臀肉与大腿内侧，感受两女身体逐渐升高的湿热。',
            en: '{MALE} slides his hands under both ladies\' skirts or waistbands, palming their hips and inner thighs over panties, feeling their growing warmth.',
            th: '{MALE} สอดมือทั้งสองข้างเข้าไปใต้กระโปรงหรือขอบกางเกงของสองสาว ลูบคลำและบีบสะโพกผ่านกางเกงใน สัมผัสความเปียกชื้นและความร้อนที่เพิ่มขึ้น'
          }
        },
        {
          id: 'trio-111',
          level: 1,
          duration: 60,
          isTrio: true,
          text: {
            zh: '两位女士坐在高处，用 {ITEM} 套住 {MALE} 的脖颈令其跪立，顺着小腿一路吻上两女的大腿内侧直至裙摆最深处，两女需抚摸其发丝给予奖赏。',
            en: 'The ladies leash {MALE}\'s neck with {ITEM}, having him kneel to kiss up their calves and inner thighs toward the hemline while stroking his hair.',
            th: 'สองสาวใช้ {ITEM} คล้องคอ {MALE} ให้คุกเข่าลง จูบไล่ตั้งแต่หน้าแข้งขึ้นมาตามโคนขาด้านในจนถึงชายกระโปรง โดยสองสาวลูบผมเขาเป็นรางวัล'
          }
        },
        {
          id: 'trio-112',
          level: 1,
          duration: 45,
          isTrio: true,
          text: {
            zh: '{FEMALE_1} 口含冰水，{FEMALE_2} 口含温水，两人轮流与 {MALE} 进行深吻交换气息，让 {MALE} 的舌尖在极寒与极热的口腔触感中剧烈交替。',
            en: '{FEMALE_1} sips ice water; {FEMALE_2} sips warm water. They take turns french kissing {MALE}, letting his tongue clash between freezing and burning heat.',
            th: '{FEMALE_1} อมน้ำเย็นจัด ส่วน {FEMALE_2} อมน้ำอุ่น สลับกันจูบดูดดื่มแลกลิ้นกับ {MALE} ให้ปลายลิ้นของเขาสัมผัสความเย็นและร้อนสลับกันอย่างบ้าคลั่ง'
          }
        },
        {
          id: 'trio-113',
          level: 1,
          duration: 30,
          isTrio: true,
          text: {
            zh: '两位女士从左右两侧紧贴 {MALE} 耳垂，一边将滚烫的喘息灌入耳道，一边用银牙轻轻拉扯其耳垂，并轻声说出「今晚你是我们的了」。',
            en: 'Both ladies flank {MALE}\'s ears, blowing hot gasps directly into his ear canals, tugging his lobes with teeth while whispering "You\'re ours tonight."',
            th: 'สองสาวแนบชิดใบหูของ {MALE} สองข้าง พ่นลมหายใจร้อนผ่าวเข้าไป ขบดึงติ่งหูเบาๆ พร้อมกระซิบด้วยเสียงแหบพร่าว่า "คืนนี้คุณเป็นของพวกเราแล้ว"'
          }
        },
        {
          id: 'trio-114',
          level: 1,
          duration: 45,
          isTrio: true,
          text: {
            zh: '{FEMALE_1} 与 {FEMALE_2} 同时在唇间含上一块 {EATABLE}，左右同时贴向 {MALE} 的嘴唇，三人共同咬碎并分享这份甜意。',
            en: '{FEMALE_1} and {FEMALE_2} each hold a piece of {EATABLE} with their lips, leaning in from both sides to feed {MALE}, all three sharing the sweetness.',
            th: '{FEMALE_1} และ {FEMALE_2} คาบ {EATABLE} ไว้ที่ริมฝีปากพร้อมกัน ประกบข้างซ้ายขวาป้อน {MALE} ร่วมกันกัดและกลืนรสหวานนี้ด้วยกันทั้งสามคน'
          }
        },
        {
          id: 'trio-115',
          level: 1,
          duration: 45,
          isTrio: true,
          text: {
            zh: '{MALE} 闭上双眼，由两位女士商量后，指派其中一人在其喉结或耳垂轻咬一口，{MALE} 猜出是谁即可与该女士共饮一口 {DRINKABLE}，猜错则独自罚饮。',
            en: '{MALE} closes eyes. The ladies choose one to gently nibble his neck or earlobe. If {MALE} guesses correctly, he shares {DRINKABLE} with her; if wrong, he drinks alone.',
            th: '{MALE} หลับตา สองสาวปรึกษากันส่งคนหนึ่งไปขบกัดเบาๆ ที่ลำคอหรือติ่งหู หาก {MALE} ทายถูกจะได้ดื่ม {DRINKABLE} ร่วมกับคนนั้น หากทายผิดต้องดื่มคนเดียว'
          }
        },
        {
          id: 'trio-116',
          level: 1,
          duration: 45,
          isTrio: true,
          text: {
            zh: '将少量 {DRINKABLE} 分别倾倒在两位女士的锁骨处，{MALE} 俯身用唇舌将水珠轻柔舔尽，期间两位女士双手搭在其肩头感受体温。',
            en: 'Pour a splash of {DRINKABLE} onto each lady\'s collarbone. {MALE} leans down to lick every drop clean, while the ladies rest hands on his shoulders.',
            th: 'ริน {DRINKABLE} เล็กน้อยลงบนไหปลาร้าของสองสาว {MALE} โน้มตัวใช้ริมฝีปากและลิ้นเลียจนหมด โดยสองสาววางมือบนบ่าสัมผัสไออุ่นของเขา'
          }
        },
        {
          id: 'trio-117',
          level: 1,
          duration: 45,
          isTrio: true,
          text: {
            zh: '由 {FEMALE_1} 夹起一块冰块沿着 {MALE} 的下颌线滑至喉结，紧接着 {FEMALE_2} 凑上前用温热的呼气吹拂受凉部位，持续缓解寒意。',
            en: '{FEMALE_1} traces an ice cube down {MALE}\'s jaw to his Adam\'s apple, followed instantly by {FEMALE_2} blowing warm breaths over the chilled skin.',
            th: '{FEMALE_1} ใช้น้ำแข็งลูบจากแนวกรามลงมาถึงลูกกระเดือกของ {MALE} จากนั้น {FEMALE_2} โน้มตัวเป่าลมหายใจร้อนผ่าวบรรเทาความเย็นทันที'
          }
        },
        {
          id: 'trio-118',
          level: 1,
          duration: 60,
          isTrio: true,
          text: {
            zh: '破冰终章：三人共同脱去各自的外套与多余遮蔽，仅留贴身内衣，三人赤裸相拥原地拥吻转圈 30 秒，准备迎接共浴洗礼！',
            en: 'Finale of Phase 1: All strip outer clothes to bare underwear, embracing tightly skin-to-skin and kissing in a circle for 30s before heading to the bath!',
            th: 'บทสรุปช่วงละลายพฤติกรรม: ทั้งสามคนถอดเสื้อผ้าตัวนอกออกเหลือเพียงชุดชั้นใน กอดรัดแนบเนื้อและประกบจูบกันวนไป 30 วินาที พร้อมเข้าสู่การอาบน้ำร่วมกัน!'
          }
        },
        {
          id: 'trio-119',
          level: 2,
          duration: 30,
          isTrio: true,
          text: {
            zh: '{MALE} 平躺，{FEMALE_1} 跨坐在其腰腹上方用唇舌肆虐其喉结与胸口，同时 {FEMALE_2} 俯身在其耳边低喘并将 {FEMALE_1} 的内衣解开，三人胸膛紧密摩擦 30 秒。',
            en: '{MALE} lies back while {FEMALE_1} straddles his hips, attacking his neck and chest with her lips. {FEMALE_2} unhooks {FEMALE_1}\'s bra from behind, rubbing all three bare chests together for 30s.',
            th: '{MALE} นอนหงาย {FEMALE_1} ขึ้นคร่อมตรงเอวใช้ลิ้นและริมฝีปากบดขยี้ลำคอและแผงอก ขณะที่ {FEMALE_2} ปลดบราของ {FEMALE_1} จากด้านหลัง นำหน้าอกเปลือยเปล่าของทั้งสามบดเบียดเสียดสีกัน 30 วินาที'
          }
        },
        {
          id: 'trio-120',
          level: 2,
          duration: 45,
          isTrio: true,
          text: {
            zh: '{MALE} 双手被 {ITEM} 束于头顶，{FEMALE_1} 与 {FEMALE_2} 各持一侧，从脚踝吻至大腿根内侧最敏感边缘，只能喘息不得反抗，持续 45 秒。',
            en: '{MALE}\'s hands are tied overhead with {ITEM}. {FEMALE_1} and {FEMALE_2} kiss from his ankles all the way up his inner thighs right to the edge of forbidden territory for 45s.',
            th: 'มือของ {MALE} ถูกมัดไว้เหนือศีรษะด้วย {ITEM} โดย {FEMALE_1} และ {FEMALE_2} ระดมจูบจากข้อเท้าไล่ขึ้นมาตามโคนขาด้านในจนถึงขอบเขตต้องห้ามต่อเนื่อง 45 วินาที'
          }
        },
        {
          id: 'trio-121',
          level: 2,
          duration: 60,
          isTrio: true,
          text: {
            zh: '{FEMALE_1} 与 {FEMALE_2} 侧卧相拥热吻，{MALE} 跪于二女身后，双手分别探入两女下身最深私密处，伴随两女喘息节奏同时爱抚 1 分钟。',
            en: '{FEMALE_1} and {FEMALE_2} lie side by side making out passionately, while {MALE} kneels behind, sliding hands between their thighs to stroke both simultaneously for 1 min.',
            th: '{FEMALE_1} และ {FEMALE_2} นอนกอดจูบกันอย่างดูดดื่ม โดย {MALE} คุกเข่าอยู่ด้านหลัง สอดมือเข้าไปสัมผัสและลูบไล้จุดซ่อนเร้นของทั้งสองคนพร้อมกันตามจังหวะเสียงคราง 1 นาที'
          }
        },
        {
          id: 'trio-122',
          level: 2,
          duration: 40,
          isTrio: true,
          text: {
            zh: '{FEMALE_1} 含着冰凉的 {DRINKABLE} 吮吸 {MALE} 的左侧敏感带，{FEMALE_2} 用温热呼气与湿润舌尖刺激其右侧乳尖与腰腹，极度温差交替折磨 40 秒。',
            en: '{FEMALE_1} holds cold {DRINKABLE} sucking {MALE}\'s left sensitive zone, while {FEMALE_2} teases his right nipple and abs with hot wet breath and tongue for 40s.',
            th: '{FEMALE_1} อม {DRINKABLE} เย็นจัดดูดดึงจุดอ่อนไหวข้างซ้ายของ {MALE} ส่วน {FEMALE_2} ใช้ลมหายใจร้อนผ่าวและปลายลิ้นเปียกชื้นยั่วเย้ายอดอกและเอวข้างขวา 40 วินาที'
          }
        },
        {
          id: 'trio-123',
          level: 2,
          duration: 45,
          isTrio: true,
          text: {
            zh: '{FEMALE_1} 趴在 {MALE} 腿上，由 {FEMALE_2} 褪下其下衣并轻拍其臀肉至微红，期间 {MALE} 必须深吻压制 {FEMALE_1} 的娇吟与喘息。',
            en: '{FEMALE_1} lies over {MALE}\'s lap. {FEMALE_2} bares her hips and firmly spanks her bottom till rosy, while {MALE} smothers her gasps with deep passionate kisses.',
            th: '{FEMALE_1} นอนคว่ำพาดตัก {MALE} ให้ {FEMALE_2} ดึงกางเกงชั้นในลงแล้วฟาดก้นเบาๆ จนขึ้นรอยแดง โดยระหว่างนั้น {MALE} ต้องประกบจูบดูดดื่มกลืนเสียงครางของเธอไว้'
          }
        },
        {
          id: 'trio-124',
          level: 2,
          duration: 30,
          isTrio: true,
          text: {
            zh: '三人褪去全部上衣紧贴站立，{MALE} 居中，前后紧密夹逼在两女温热赤裸的身躯之间，双手大力揉捏两女翘臀，同步下半身研磨 30 秒。',
            en: 'All strip topless. {MALE} is sandwiched tightly between both bare bodies, groping their hips firmly while grinding their pelvises together for 30s.',
            th: 'ทั้งสามคนเปลื้องท่อนบนจนเปลือยเปล่า {MALE} ยืนตรงกลางโดนประกบแนบชิดทั้งหน้าหลัง สองมือบีบขยำสะโพกของทั้งสองสาวเต็มแรง พร้อมบดเบียดช่วงล่างเข้าหากัน 30 วินาที'
          }
        },
        {
          id: 'trio-125',
          level: 2,
          duration: 45,
          isTrio: true,
          text: {
            zh: '将滴落的 {EATABLE} 涂抹在 {MALE} 的人鱼线与耻骨边缘，{FEMALE_1} 与 {FEMALE_2} 跪在两侧，像争夺猎物般用舌尖顺着毛发边缘舔吮干净。',
            en: 'Drizzle {EATABLE} along {MALE}\'s V-line and pelvic bone. Both ladies kneel, greedily licking and sucking every drop clean right to the edge of his briefs.',
            th: 'ป้าย {EATABLE} ตามแนวร่อง V-line และขอบกระดูกเชิงกรานของ {MALE} สาวๆ ทั้งสองคุกเข่าลง แย่งกันใช้ปลายลิ้นเลียดูดกินจนหมดจรดขอบกางเกงชั้นใน'
          }
        },
        {
          id: 'trio-126',
          level: 2,
          duration: 45,
          isTrio: true,
          text: {
            zh: '两位女士左右合抱 {MALE}，同时在其耳下敏感神经至锁骨处留下清晰吮痕（草莓印），直至 {MALE} 身体忍不住弓起颤抖。',
            en: 'Both ladies flank {MALE}, sinking teeth and lips simultaneously into his neck and collarbones to leave visible love bites until his back arches.',
            th: 'สองสาวขนาบข้างกอด {MALE} ฝังรอยดูดและขบกัดเบาๆ พร้อมกันตั้งแต่ซอกคอถึงไหปลาร้าจนทิ้งรอยรักชัดเจน ให้ {MALE} แอ่นตัวสั่นสะท้าน'
          }
        },
        {
          id: 'trio-127',
          level: 2,
          duration: 45,
          isTrio: true,
          text: {
            zh: '{MALE} 躺平屈膝，拉着 {FEMALE_1} 与 {FEMALE_2} 各自的一根手指同时送入口中吮湿，再由两女将湿润的手指滑入彼此的贴身内衣中探索。',
            en: '{MALE} sucks fingers from both ladies till soaked, then guides their wet fingers directly beneath each other\'s panties to explore.',
            th: '{MALE} ดึงนิ้วของ {FEMALE_1} และ {FEMALE_2} เข้าปากดูดจนเปียกชุ่มพร้อมกัน จากนั้นนำนิ้วที่เปียกชุ่มนั้นสอดเข้าไปใต้กางเกงชั้นในของกันและกันเพื่อสำรวจ'
          }
        },
        {
          id: 'trio-128',
          level: 2,
          duration: 60,
          isTrio: true,
          text: {
            zh: '{FEMALE_1} 呈猫式跪趴，{FEMALE_2} 从后紧密贴合抚摸其敏感带，{MALE} 则从正前方俯身托起 {FEMALE_1} 的下巴与其热吻并揉搓双乳。',
            en: '{FEMALE_1} on all fours; {FEMALE_2} presses flush from behind stroking her clit, while {MALE} kneels in front lifting her chin for deep kisses while cupping her breasts.',
            th: '{FEMALE_1} คุกเข่าโก่งสะโพก {FEMALE_2} แนบชิดจากด้านหลังลูบไล้จุดกระสัน ส่วน {MALE} คุกเข่าด้านหน้าเชิดคางเธอขึ้นมาจูบดูดดื่มพร้อมบดขยำหน้าอก'
          }
        },
        {
          id: 'trio-129',
          level: 2,
          duration: 60,
          isTrio: true,
          text: {
            zh: '{MALE} 俯卧，两位女士分别伏在其后背两侧，一人细细吮吸其后颈与肩胛骨留下齿痕，另一人指尖蘸取温热体液自腰窝滑至股沟边缘轻刮。',
            en: '{MALE} lies face down; both ladies drape over his back. One sucks his nape and shoulder blades, while the other traces fingertips down his spine to his glutes.',
            th: '{MALE} นอนคว่ำ สาวๆ สองคนทาบทับแผ่นหลัง คนหนึ่งดูดเม้มต้นคอและสะบักหลังจนเป็นรอยฟัน อีกคนใช้นิ้วลูบไล้จากร่องเอวลงไปจนถึงร่องสะโพก'
          }
        },
        {
          id: 'trio-130',
          level: 2,
          duration: 60,
          isTrio: true,
          text: {
            zh: '{FEMALE_1} 跨坐在 {MALE} 胸口与其深吻封口，{FEMALE_2} 跪于其双腿间，将双手探入底裤对其命脉与囊袋进行湿润套弄，两女轮流掌控其呼吸。',
            en: '{FEMALE_1} straddles {MALE}\'s chest locking him in a deep kiss, while {FEMALE_2} kneels between his legs, sliding hands into his briefs to stroke his core rhythmically.',
            th: '{FEMALE_1} นั่งคร่อมแผงอกของ {MALE} จูบดูดดื่มปิดปากเขาไว้ ส่วน {FEMALE_2} คุกเข่าระหว่างขา สอดมือเข้าไปรูดสาวส่วนแก่นกายและถุงใต้จุดเสียวในกางเกงในอย่างเร่าร้อน'
          }
        },
        {
          id: 'trio-131',
          level: 3,
          duration: 60,
          isTrio: true,
          text: {
            zh: '两位女士脱去丝袜/底裤，将双腿交叠架在 {MALE} 的肩膀与大腿上，命令 {MALE} 逐寸亲吻每一根脚趾、脚弓直至大腿根。',
            en: 'The ladies rest their bare legs over {MALE}\'s shoulders and lap, ordering him to lick and kiss every toe, arch, and inner thigh reverently.',
            th: 'สาวๆ วางขาเปลือยเปล่าพาดบนบ่าและตักของ {MALE} สั่งให้เขาจูบและใช้ลิ้นเลียไล่ตั้งแต่ปลายนิ้วเท้า อุ้งเท้า ไปจนถึงโคนขาอ่อนทีละคืบ'
          }
        },
        {
          id: 'trio-132',
          level: 3,
          duration: 60,
          isTrio: true,
          text: {
            zh: '开启 {ITEM}（跳蛋/振动棒），由 {MALE} 抵在 {FEMALE_1} 的私密花核上，同时 {FEMALE_1} 伸手握住 {ITEM} 另一端抵在 {FEMALE_2} 的胸尖，三人感受同频共振。',
            en: 'Turn on vibrating {ITEM}. {MALE} presses it to {FEMALE_1}\'s sweet spot, while {FEMALE_1} guides the other end to {FEMALE_2}\'s nipple, sharing the buzz.',
            th: 'เปิดเครื่องสั่น {ITEM} ให้ {MALE} จี้ไปที่จุดเสียวของ {FEMALE_1} ขณะเดียวกัน {FEMALE_1} จับปลายอีกด้านจี้ที่ยอดอกของ {FEMALE_2} ให้ทั้งสามสัมผัสแรงสั่นสะท้านพร้อมกัน'
          }
        },
        {
          id: 'trio-133',
          level: 3,
          duration: 60,
          isTrio: true,
          text: {
            zh: '{FEMALE_1} 跨坐在 {MALE} 大腿上面对面对坐狂吻，{FEMALE_2} 则悄然跪在 {MALE} 身后，将手探入其底裤内对其命脉进行纯熟撸动。',
            en: '{FEMALE_1} straddles {MALE}\'s lap kissing him fiercely, while {FEMALE_2} kneels behind him, slipping her hand into his underwear to stroke him rhythmically.',
            th: '{FEMALE_1} นั่งคร่อมตัก {MALE} หันหน้าเข้าหากระหน่ำจูบอย่างบ้าคลั่ง ในขณะที่ {FEMALE_2} สอดมือเข้าไปในกางเกงในของ {MALE} จากด้านหลังแล้วรูดสาวอย่างเร่าร้อน'
          }
        },
        {
          id: 'trio-134',
          level: 3,
          duration: 45,
          isTrio: true,
          text: {
            zh: '三人头靠头围成极小圆圈，{MALE} 舌吻 {FEMALE_1} 15秒后立刻不间断转头舌吻 {FEMALE_2}，两女再舌吻缠绵，津液交换拉出银丝。',
            en: 'Head to head, {MALE} french kisses {FEMALE_1} for 15s then instantly turns to tongue {FEMALE_2}, followed by the two ladies making out, sharing saliva.',
            th: 'ทั้งสามคนเอาหัวชิดกัน {MALE} แลกสิ้นกับ {FEMALE_1} 15 วินาทีแล้วหันไปแลกลิ้นกับ {FEMALE_2} ทันที ก่อนที่สองสาวจะประกบปากแลกลิ้นกันจนน้ำลายเชื่อมเป็นสาย'
          }
        },
        {
          id: 'trio-135',
          level: 3,
          duration: 45,
          isTrio: true,
          text: {
            zh: '{MALE} 站立，两位女士一前一后将其牢牢夹死在中央，后方用丰满贴紧其后背，前方用下身死死贴合其隆起处，三人剧烈研磨下体 45 秒。',
            en: '{MALE} stands pinned between both ladies—one pressing breasts into his spine, the other grinding her crotch against his bulge firmly for 45s.',
            th: '{MALE} ยืนอยู่ตรงกลางโดนสาวๆ ประกบหน้าหลังจนขยับไม่ได้ ด้านหลังเบียดหน้าอกแนบแผ่นหลัง ด้านหน้าบดถูช่วงล่างเข้ากับส่วนที่แข็งตัวแน่นหนา 45 วินาที'
          }
        },
        {
          id: 'trio-136',
          level: 3,
          duration: 60,
          isTrio: true,
          text: {
            zh: '两位女士一齐将 {MALE} 的内裤拉至大腿半截，仅用指甲尖或发丝轻轻撩拨其冠状沟与囊袋边缘，严禁真正触碰，持续折磨 1 分钟。',
            en: 'The ladies pull {MALE}\'s underwear half-down, teasing the tip and sensitive base only with fingernails and hair, denying him direct touch for 1 min.',
            th: 'สองสาวช่วยกันดึงกางเกงในของ {MALE} ลงมาค้างที่ต้นขา ใช้เพียงปลายเล็บและปลายผมลูบไล้ปลายและโคนส่วนไวสัมผัส โดยห้ามจับตรงๆ ทรมานความเสียว 1 นาที'
          }
        },
        {
          id: 'trio-137',
          level: 3,
          duration: 60,
          isTrio: true,
          text: {
            zh: '{MALE} 命令两位女士褪去底裤侧卧，{MALE} 亲自拨开两人花瓣检查湿润程度，并亲吻最湿润的那一位，随后用湿润的手指抚摸另一人的唇瓣。',
            en: '{MALE} has both ladies strip panties; he spreads their folds to inspect wetness, kissing the wetter one and smearing the moisture over the other\'s lips.',
            th: '{MALE} ให้สองสาวถอดกางเกงในนอนตะแคง เขาใช้นิ้วแหวกกลีบกุหลาบตรวจความเปียกฉ่ำ จูบคนที่เปียกที่สุดแล้วเอานิ้วที่ชุ่มฉ่ำนั้นไปป้ายริมฝีปากของอีกคน'
          }
        },
        {
          id: 'trio-138',
          level: 3,
          duration: 60,
          isTrio: true,
          text: {
            zh: '两位女士分开双腿坐在沙发两侧，命令 {MALE} 趴跪在中央，左右轮流各舔舐两女大腿根与三角边缘 15 口，听从两女喘息打分。',
            en: 'Both ladies sit with legs spread; {MALE} crawls between them, giving 15 slow licks to each inner thigh and bikini line as they moan and rate his service.',
            th: 'สองสาวนั่งแยกขาบนโซฟา สั่งให้ {MALE} คลานอยู่ตรงกลาง ผลัดกันใช้ลิ้นเลียโคนขาและขอบบิกินี่ของทั้งสองคนละ 15 ครั้งตามจังหวะเสียงคราง'
          }
        },
        {
          id: 'trio-139',
          level: 3,
          duration: 60,
          isTrio: true,
          text: {
            zh: '两位女士侧身相对将乳房紧密挤压在一起夹住 {MALE} 的手，{MALE} 在两座峰峦间揉搓，同时两位女士互相深吻并吮吸对方的舌头。',
            en: 'Both ladies press their breasts together around {MALE}\'s hands. As he gropes the cleavage, the two ladies french kiss and suck each other\'s tongues deeply.',
            th: 'สาวๆ เบียดหน้าอกเข้าหากันหนีบมือของ {MALE} เอาไว้ {MALE} บีบเคล้นร่องอกชิด ขณะที่สองสาวประกบปากแลกลิ้นดูดดื่มกันเองอย่างเมามัน'
          }
        },
        {
          id: 'trio-140',
          level: 3,
          duration: 60,
          isTrio: true,
          text: {
            zh: '剥除全员身上最后一件遮蔽物！三人完全赤裸纠缠倒向床榻，肢体相扣、四唇相接，任由双手在彼此身上任意游走点火，直奔极乐！',
            en: 'Strip the very last piece of clothing! All three tumble completely naked onto the bed, limbs tangled, lips locked, hands exploring everywhere!',
            th: 'ปลดเปลื้องอาภรณ์ชิ้นสุดท้ายของทุกคน! ทั้งสามทิ้งตัวลงบนเตียงในสภาพเปลือยเปล่า กอดรัดฟัดเหวี่ยง ปากประกบปาก มือลูบไล้ทั่วเรือนร่างทะยานสู่จุดสูงสุด!'
          }
        },
        {
          id: 'trio-141',
          level: 3,
          duration: 60,
          isTrio: true,
          text: {
            zh: '两位女士将少许 {EATABLE} 沿 {MALE} 的人鱼线淋至大腿内侧根部，两人左右分工，紧贴着下身最敏感的边缘，用舌尖将甜浆一寸寸舔吸干净，持续 60 秒。',
            en: 'The ladies drizzle {EATABLE} along {MALE}\'s V-line down to his inner thigh roots. Flanking both sides, they use their tongues to lick and suck every drop clean along the sensitive perimeter for 60s.',
            th: 'สองสาวหยด {EATABLE} ตามแนวร่อง V-line ไหลลงไปถึงโคนขาอ่อนด้านในของ {MALE} ทั้งสองคนประกบซ้ายขวา ใช้ปลายลิ้นเลียดูดกินความหวานตามขอบจุดอ่อนไหวอย่างช้าๆ 60 วินาที'
          }
        },
        {
          id: 'trio-142',
          level: 3,
          duration: 45,
          isTrio: true,
          text: {
            zh: '{FEMALE_1} 将冰凉的 {DRINKABLE} 缓慢滴在 {MALE} 的下腹骨盆与腹股沟处，{FEMALE_2} 随即使用温热的口腔呼气逼近吹拂，两人交替用冰火温差刺激其敏感带 45 秒。',
            en: '{FEMALE_1} slowly drips chilled {DRINKABLE} onto {MALE}\'s lower pelvis and groin, while {FEMALE_2} closely follows with hot breaths. They alternate fire and ice sensory teasing for 45s.',
            th: '{FEMALE_1} ค่อยๆ หยด {DRINKABLE} เย็นจัดลงบนท้องน้อยและร่องขาหนีบของ {MALE} ขณะที่ {FEMALE_2} ก้มลงเป่าลมหายใจร้อนผ่าวตามรอยหยดน้ำทันที สลับความเย็นและร้อนกระตุ้นจุดไวสัมผัส 45 วินาที'
          }
        },
        {
          id: 'trio-143',
          level: 3,
          duration: 60,
          isTrio: true,
          text: {
            zh: '两位女士手持 {ITEM}，一左一右贴着 {MALE} 的大腿内侧与耻骨边缘来回轻柔滑拉，逼近最敏感核心却严禁直接触碰正中，借由织物/材质摩擦折磨其耐力 1 分钟。',
            en: 'Both ladies hold {ITEM}, sliding it back and forth along {MALE}\'s inner thighs and pelvic edge, teasing close to the threshold without direct center contact for 1 min.',
            th: 'สองสาวจับ {ITEM} คนละข้าง รูดไล้ไปมาตามโคนขาด้านในและขอบกระดูกเชิงกรานของ {MALE} อย่างแผ่วเบา เฉียดจุดสำคัญที่สุดโดยไม่แตะต้องตรงๆ ทรมานความอดทนด้วยสัมผัสเสียดสี 1 นาที'
          }
        },
        {
          id: 'trio-144',
          level: 3,
          duration: 60,
          isTrio: true,
          text: {
            zh: '开启振动的 {ITEM}，由 {FEMALE_1} 紧抵在 {MALE} 的下腹耻骨与大腿根交界处，同时 {FEMALE_2} 口含少许 {DRINKABLE} 深吻封住其双唇，在震颤与窒息感中掌控其反应 60 秒。',
            en: 'Turn on vibrating {ITEM}. {FEMALE_1} presses it firmly to the junction of {MALE}\'s lower groin, while {FEMALE_2} holds {DRINKABLE} in her mouth for a deep locking kiss, controlling his reactions for 60s.',
            th: 'เปิดเครื่องสั่น {ITEM} ให้ {FEMALE_1} กดแนบลงตรงรอยต่อขาหนีบและหัวหน่าวของ {MALE} พร้อมกันนั้น {FEMALE_2} อม {DRINKABLE} ไว้ในปากแล้วจูบดูดดื่มปิดปากเขา ควบคุมทุกปฏิกิริยาใต้แรงสั่น 60 วินาที'
          }
        }
      ],
      action: [], drinkable: [], eatable: [], item: []
    }
  },
  {
    id: 'official_duo_classic',
    isBuiltin: true,
    name: { zh: '官方标准 · 2P双人私密飞行', en: 'Official Duo Classic', th: 'มาตรฐาน 2 คน คลาสสิก' },
    desc: { zh: '经典 1V1 情侣飞行棋互动，含温和暖场与深层调情', en: 'Classic 1v1 couples game from warm-up to deep intimacy', th: 'เกมกระดานคู่รัก 1v1 คลาสสิก ตั้งแต่เร้าอารมณ์เบาๆ จนถึงสนิทสนม' },
    mode: 'board',
    tasks: { trio: [], action: [], drinkable: [], eatable: [], item: [] }
  }
]

export const getPresetData = () => {
  try {
    const raw = localStorage.getItem(PRESET_STORAGE_KEY)
    if (!raw) {
      return {
        activePresetId: 'official_trio_default',
        presets: BUILTIN_PRESETS
      }
    }
    const parsed = JSON.parse(raw)
    // 确保内置 Preset 始终包含在列表里并升级任务
    const userPresets = Array.isArray(parsed.presets)
      ? parsed.presets.filter((p) => !p.isBuiltin)
      : []
    return {
      activePresetId: parsed.activePresetId || 'official_trio_default',
      presets: [...BUILTIN_PRESETS, ...userPresets]
    }
  } catch {
    return {
      activePresetId: 'official_trio_default',
      presets: BUILTIN_PRESETS
    }
  }
}

export const savePresetData = (data) => {
  try {
    localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(data))
  } catch (err) {
    console.error('Failed to save preset data to localStorage', err)
  }
}

export const getActivePreset = () => {
  const { activePresetId, presets } = getPresetData()
  const found = presets.find((p) => p.id === activePresetId)
  if (found && found.id === 'official_trio_default') {
    return BUILTIN_PRESETS[0]
  }
  return found || BUILTIN_PRESETS[0]
}

export const setActivePreset = (id) => {
  const data = getPresetData()
  const target = data.presets.find((p) => p.id === id)
  if (target) {
    data.activePresetId = id
    savePresetData(data)
  }
  return target || getActivePreset()
}

export const saveCustomPreset = (preset) => {
  const data = getPresetData()
  const newPreset = {
    ...preset,
    id: preset.id || `custom_preset_${Date.now()}`,
    isBuiltin: false
  }
  const existingIdx = data.presets.findIndex((p) => p.id === newPreset.id)
  if (existingIdx >= 0) {
    data.presets[existingIdx] = newPreset
  } else {
    data.presets.push(newPreset)
  }
  data.activePresetId = newPreset.id
  savePresetData(data)
  return newPreset
}

export const deleteCustomPreset = (id) => {
  const data = getPresetData()
  const target = data.presets.find((p) => p.id === id)
  if (target && !target.isBuiltin) {
    data.presets = data.presets.filter((p) => p.id !== id)
    if (data.activePresetId === id) {
      data.activePresetId = 'official_trio_default'
    }
    savePresetData(data)
  }
  return getPresetData()
}

export const exportPreset = (id, downloadJsonFn) => {
  const { presets } = getPresetData()
  const target = presets.find((p) => p.id === id) || getActivePreset()
  const exportPayload = {
    version: '2.0',
    type: 'preset',
    preset: target
  }
  if (downloadJsonFn) {
    downloadJsonFn(exportPayload, `preset_${target.id}.json`)
  }
  return exportPayload
}

export const importPreset = (jsonObj) => {
  let presetToImport = null
  if (jsonObj?.type === 'preset' && jsonObj?.preset) {
    presetToImport = jsonObj.preset
  } else if (jsonObj && typeof jsonObj === 'object') {
    // 兼容旧格式 config
    presetToImport = {
      id: `imported_preset_${Date.now()}`,
      name: {
        zh: jsonObj.settings?.name || '导入的主题套件',
        en: jsonObj.settings?.name || 'Imported Preset',
        th: jsonObj.settings?.name || 'ชุดธีมที่นำเข้า'
      },
      desc: {
        zh: '从外部 JSON 导入的玩法规则',
        en: 'Custom rules imported from JSON',
        th: 'กติกานำเข้าจากภายนอก'
      },
      mode: jsonObj.settings?.gameMode === 'duo' ? 'board' : 'board_3p',
      tasks: jsonObj.tasks || { trio: [], action: [], drinkable: [], eatable: [], item: [] }
    }
  }

  if (presetToImport) {
    return saveCustomPreset(presetToImport)
  }
  throw new Error('Invalid preset JSON format')
}
