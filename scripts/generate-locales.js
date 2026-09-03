const fs = require('fs');
const path = require('path');

// 1. 女性视角任务数据 (Female -> Target: Male)
const femaleData = {
  action: [
    // Level 1
    { id: "f-a1", level: 1, zh: "女用发梢扫过男的耳朵、后颈和双唇，配合轻声微喘。", en: "Female sweeps her hair ends over Male's ears, neck, and lips while breathing softly.", ja: "女性は髪の毛先で男性の耳、うなじ、唇を優しく撫で、吐息を吹きかける。" },
    { id: "f-a2", level: 1, zh: "女咬住男的耳垂轻轻拉扯，同时向男的耳道内深缓地吹热气。", en: "Female gently nibbles Male's earlobe while blowing warm, deep breath into his ear canal.", ja: "女性は男性の耳たぶを優しく咬みながら、耳元へゆっくりと温かい息を吹きかける。" },
    { id: "f-a3", level: 1, zh: "女用舌尖顺着男的手掌心画圈，随后将男的手指依次含进口中吮吸。", en: "Female traces circles on Male's palm with her tongue, then gently sucks his fingers one by one.", ja: "女性は舌先で男性の手のひらに円を描き、指を一本ずつ口に含んで吸う。" },
    { id: "f-a4", level: 1, zh: "女用指甲在男的背部和臀部轻划出数道痕迹，拉紧男的衣领将男拉向自己。", en: "Female lightly traces her fingernails down Male's back and buttocks, pulling his collar to bring him close.", ja: "女性は爪先で男性の背中とヒップを優しくなぞり、首元を引っ張って引き寄せる。" },
    { id: "f-a5", level: 1, zh: "女用嘴唇含住男的喉结，进行微弱但持续的轻吸与舌尖舔舐。", en: "Female gently kisses and sucks Male's Adam's apple, licking it softly with her tongue.", ja: "女性は男性の喉仏を唇で包み込み、優しく吸いながら舌先で舐めあげる。" },
    // Level 2
    { id: "f-a6", level: 2, zh: "女跪在男的身边，用双唇打湿男的乳头，随后对其吹冷气，再用牙齿极轻地叼咬。", en: "Female kneels beside Male, wetting his nipples with her lips, blowing cool air, then gently nibbling them.", ja: "女性は男性の脇にひざまずき、乳首を舐めて湿らせ、息を吹きかけてから優しく歯で咬む。" },
    { id: "f-a7", level: 2, zh: "女褪去男的下装，用双手掌心用力摩擦男的大腿根部，隔着内裤顶端吹热气。", en: "Female lowers Male's pants, rubbing his upper thighs firmly with her palms and breathing hot air over his underwear.", ja: "女性は男性のパンツを下ろし、太もも付け根をしっかり擦りながら、下着の上から息を吹きかける。" },
    { id: "f-a8", level: 2, zh: "女将男推倒在床，用自己的胸部贴着男的面部或胸口进行来回摩擦。", en: "Female pushes Male onto the bed, rubbing her breasts against his face or chest.", ja: "女性は男性をベッドに押し倒し、自分の胸を男性の顔や胸元に擦りつける。" },
    { id: "f-a9", level: 2, zh: "女手握男的下体敏感区域隔着内裤加压揉动，同时用舌头舔舐男的喉结。", en: "Female cups Male's bulge through his underwear with pressure, simultaneously licking his Adam's apple.", ja: "女性は下着越しに男性の局部を握り揉みながら、舌で男性の喉仏を舐めあげる。" },
    { id: "f-a10", level: 2, zh: "女抓起男的手掌贴在自己的腰际，用自己的胯部主动向男的下体撞击蹭擦。", en: "Female grabs Male's hands, placing them on her waist as she actively grinds her hips into his front.", ja: "女性は男性の手を自分の腰に当てさせ、自分から腰を動かして男性の股間に擦りつける。" },
    // Level 3
    { id: "f-a11", level: 3, zh: "女脱下男的内裤，用嘴唇包裹男的龟头强力吮吸，男身体抖动时猛然停止 5 秒。", en: "Female lowers Male's underwear, taking his head into her mouth for strong suction, stopping abruptly for 5 seconds when he twitches.", ja: "女性は男性の下着を脱がせ、先端を口で包み込んで強く吸い上げる。男性が震えたら突如5秒間停止する。" },
    { id: "f-a12", level: 3, zh: "女用双手握住男的阴茎快速上下套弄，同时用舌头舔舐男的睾丸。", en: "Female uses both hands to stroke Male's shaft rapidly up and down while licking his scrotum.", ja: "女性は両手で男性のペニスを高速でしごきながら、舌で金玉を舐めまわす。" },
    { id: "f-a13", level: 3, zh: "女骑坐在男的身上，用自己的敏感核心对准男的阴茎头部进行深度全接触蹭擦。", en: "Female straddles Male, grinding her sensitive core directly against his head with full body weight.", ja: "女性は男性の上にまたがり、自身のデリケートゾーンを男性の先端に押し当てて擦りつける。" },
    { id: "f-a14", level: 3, zh: "女用手掌握紧男的阴茎根部加压限制，用嘴唇专心致志地套吸男的柱身与头部。", en: "Female grips the base of Male's shaft firmly with her hand, intently sucking his head and shaft.", ja: "女性は片手で男性の根元を強く握って固定し、口でペニス全体を熱心に吸い上げる。" },
    { id: "f-a15", level: 3, zh: "女用舌尖死死顶住男的龟头系带处保持不动，仅靠舌头肌肉的高频抖动来刺激男。", en: "Female presses her tongue tip firmly against Male's frenulum, fluttering her tongue muscles rapidly.", ja: "女性は舌先を男性の裏筋にピタッと当てて動かさず、舌の筋肉の高速振動だけで刺激する。" }
  ],
  drinkable: [
    { id: "f-d1", level: 1, zh: "女与男碰杯，将少量 {DRINKABLE} 倒在男的手掌心，随后用舌头顺着掌纹划圈舔干净。", en: "Female clinks glasses with Male, pours a bit of {DRINKABLE} on his palm, and licks it clean along his palm lines.", ja: "女性は男性と乾杯し、少量の {DRINKABLE} を男性の手のひらに垂らして舌でキレイに舐めあげる。" },
    { id: "f-d2", level: 1, zh: "女将 {DRINKABLE} 涂抹在男的锁骨处，用嘴唇贴着肌肤慢慢舔干净，同时向耳边吹热气。", en: "Female applies {DRINKABLE} to Male's collarbone, slowly licking it clean while breathing warmly into his ear.", ja: "女性は {DRINKABLE} を男性の鎖骨に塗り、唇を肌に密着させてゆっくり舐めとりながら耳元に熱い息を吹きかける。" },
    { id: "f-d3", level: 1, zh: "女含一小口 {DRINKABLE}，贴上男的唇瓣缓缓喂给男，过程中双手紧抱男的后颈。", en: "Female holds a sip of {DRINKABLE} in her mouth, feeding it slowly to Male lips-to-lips while holding his neck.", ja: "女性は {DRINKABLE} を口に含み、男性の首を両手で抱き寄せながら口移しでゆっくり飲ませる。" },
    { id: "f-d4", level: 2, zh: "女手握男的下体，将 {DRINKABLE} 倒在男的睾丸上方，用嘴唇完全包裹并打湿舔吸。", en: "Female cups Male's core, pours {DRINKABLE} over his scrotum, and envelops it with her lips to suck and lick wetly.", ja: "女性は男性の局部を握り、{DRINKABLE} を睾丸に垂らして口全体で包み込み濃厚に吸い舐める。" },
    { id: "f-d5", level: 2, zh: "女跪在男的身边，将冰凉的 {DRINKABLE} 含在口中 5 秒，随后立刻贴上男的下体敏感部位进行打圈深舔。", en: "Female kneels beside Male, holds chilled {DRINKABLE} in her mouth for 5s, then immediately licks his front in circles.", ja: "女性はひざまずき、冷たい {DRINKABLE} を5秒間口に含んだ後、すぐに男性の股間に唇を当てて円を描くように深くなめまわす。" },
    { id: "f-d6", level: 2, zh: "女将 {DRINKABLE} 淋在男的腹肌上，顺着腹肌线条一路向下舔舐收拾干净，直到内裤上沿。", en: "Female drizzles {DRINKABLE} over Male's abs, licking it clean down his abdominal lines to his waistband.", ja: "女性は {DRINKABLE} を男性の腹筋に垂らし、筋肉のラインに沿って下着のウエストゴムまで綺麗に舐め下ろす。" },
    { id: "f-d7", level: 3, zh: "女将 {DRINKABLE} 浇在男的下体敏感部位，用双手握住根部快速套弄，同时用舌头猛烈舔舐睾丸与系带。", en: "Female pours {DRINKABLE} over Male's sensitive area, stroking his base rapidly with both hands while licking intensely.", ja: "女性は {DRINKABLE} を男性の股間に注ぎ、両手で根元を素早くしごきながら、舌で睾丸と裏筋を猛烈に舐めまわす。" },
    { id: "f-d8", level: 3, zh: "女口含 {DRINKABLE} 深度吮吸男的阴茎头部 15 秒，随后吞下液体，换成温热的舌头进行长舔。", en: "Female holds {DRINKABLE} in her mouth while sucking Male's glans deeply for 15s, swallows, then licks warm.", ja: "女性は {DRINKABLE} を口に含んだまま15秒間先端を深々と吸い上げ、飲み干した後に温かい舌でじっくり舐め上げる。" },
    { id: "f-d9", level: 3, zh: "女将 {DRINKABLE} 少量倒在男的会阴处，用舌尖高频点刺，配合下体与男的强烈蹭擦。", en: "Female pours a bit of {DRINKABLE} on Male's perineum, tapping it rapidly with her tongue while grinding her hips against him.", ja: "女性は {DRINKABLE} を男性の会陰に少量垂らし、舌先で超高速タッピングしながら自分の股間に男性に強く擦りつける。" }
  ],
  eatable: [
    { id: "f-e1", level: 1, zh: "女将 {EATABLE} 涂抹在男的锁骨和腹肌上，随后用舌头沿着肌肉线条慢慢舔舐干净。", en: "Female spreads {EATABLE} across Male's collarbone and abs, then licks it clean along his muscle contours.", ja: "女性は {EATABLE} を男性の鎖骨と腹筋に塗り、筋肉のラインに沿って舌でゆっくりと舐めとる。" },
    { id: "f-e2", level: 1, zh: "女用指尖蘸取 {EATABLE} 抹在男的耳垂与颈窝，贴在男耳边轻轻吮吸干净。", en: "Female dabs {EATABLE} on Male's earlobe and neck, gently sucking it clean close to his ear.", ja: "女性は指先で {EATABLE} を男性の耳たぶやくびすじに付け、耳元に密着して優しく吸いとる。" },
    { id: "f-e3", level: 1, zh: "女骑坐在男的腿上，将 {EATABLE} 抹在男的胸口，用唇舌慢慢抹开并挑逗吃掉。", en: "Female straddles Male, applying {EATABLE} on his chest and licking it off seductively.", ja: "女性は男性の膝の上に乗り、胸元に {EATABLE} を塗って唇と舌でゆっくり伸ばしながら綺麗に食べる。" },
    { id: "f-e4", level: 2, zh: "女褪去男的下装，将 {EATABLE} 在男的阴茎冠状沟涂抹一圈，随后俯下身用嘴唇和舌头慢慢舔舐 30 秒全部吃掉。", en: "Female lowers Male's bottoms, applies {EATABLE} around his corona, and slowly licks it clean for 30s.", ja: "女性は男性のパンツを下ろし、亀頭の溝に {EATABLE} を一周塗り、30秒かけて唇と舌で綺麗に舐めとる。" },
    { id: "f-e5", level: 2, zh: "女将 {EATABLE} 涂抹在自己的胸部，贴着男的面部与嘴唇进行来回摩擦挑逗，让男吃掉。", en: "Female applies {EATABLE} to her breasts, rubbing them against Male's face and lips for him to eat.", ja: "女性は自分の胸に {EATABLE} を塗り、男性の顔や唇に擦りつけて食べさせるように挑発する。" },
    { id: "f-e6", level: 2, zh: "女用指腹蘸取 {EATABLE} 涂在男的睾丸与会阴区域，用舌尖缓慢打圈舔舐干净。", en: "Female applies {EATABLE} to Male's scrotum and perineum, slowly licking it clean in circular motions.", ja: "女性は指で {EATABLE} を男性の睾丸と会陰に塗り、舌先でゆっくり円を描くように綺麗に舐めあげる。" },
    { id: "f-e7", level: 3, zh: "女脱下男的内裤，将 {EATABLE} 厚厚涂抹在男的阴茎头部与柱身，用口唇完全包裹进行强力深套吮吸，男身体抖动时猛然停止 5 秒。", en: "Female coats Male's head and shaft richly with {EATABLE}, sucking deeply, pausing 5s when he shivers.", ja: "女性は下着を脱がせ、{EATABLE} を男性のペニス全体にたっぷり塗り、深々と口で包み込んで吸う。身悶えしたら5秒止める。" },
    { id: "f-e8", level: 3, zh: "女将 {EATABLE} 涂抹在男的龟头系带处，用舌尖死死顶住该位置不动，仅靠舌头肌肉的高频抖动将食材完全舔干净。", en: "Female puts {EATABLE} on Male's frenulum, pressing her tongue tip firm and fluttering to lick it clean.", ja: "女性は {EATABLE} を裏筋に塗り、舌先を固定して筋肉の高速振動だけで食材を完全に舐めとる。" },
    { id: "f-e9", level: 3, zh: "女将男转过去成趴姿，将 {EATABLE} 涂在男的臀部肉块，一边揉捏一边用嘴唇舔舐吃掉。", en: "Female turns Male onto his stomach, applying {EATABLE} to his buttocks, squeezing and licking it clean from behind.", ja: "女性は男性をうつ伏せにし、お尻に {EATABLE} を塗って揉みほぐしながら唇と舌で舐めとる。" }
  ],
  item: [
    { id: "f-i1", level: 1, zh: "女用 {ITEM} 蒙住男的眼睛，随后在男的耳边轻轻喘息并给予一个 30 秒的深吻。", en: "Female blindfolds Male with {ITEM}, breathing softly into his ear and giving him a 30s deep kiss.", ja: "女性は {ITEM} で男性の目を覆い、耳元で吐息を漏らしながら30秒間ディープキスをする。" },
    { id: "f-i2", level: 1, zh: "女用 {ITEM} 从男的下巴一路向下划过胸肌和腹肌，停留在裤腰处。", en: "Female traces {ITEM} from Male's chin down his chest and abs, resting at his waistband.", ja: "女性は {ITEM} を男性のアゴから胸筋・腹筋へと滑らせ、パンツのゴム位置で止める。" },
    { id: "f-i3", level: 1, zh: "女用 {ITEM} 轻轻蹭擦男的耳廓和双唇，随后用身体贴紧男的胸膛。", en: "Female gently brushes {ITEM} against Male's ears and lips, then presses her body tightly into his chest.", ja: "女性は {ITEM} で男性の耳や唇を優しく撫で、そのあと全身を男性の胸にぴったり密着させる。" },
    { id: "f-i4", level: 2, zh: "女用 {ITEM} 将男的双手固定在头顶，自己骑在男的腰上用下体隔着衣物蹭擦男的下体。", en: "Female uses {ITEM} to secure Male's hands above his head, straddling him to grind through clothes.", ja: "女性は {ITEM} で男性の手を頭上に固定し、上に乗って服越しに自分の股間を男性に擦りつける。" },
    { id: "f-i5", level: 2, zh: "女用 {ITEM} 贴着男的大腿内侧滑动，同时双手按住男的臀部加压揉搓。", en: "Female slides {ITEM} along Male's inner thighs while firmly squeezing his buttocks with both hands.", ja: "女性は {ITEM} を男性の太もも内側に滑らせ、同時に両手で男性のお尻を強く揉みほぐす。" },
    { id: "f-i6", level: 2, zh: "女用 {ITEM} 刺激男的乳头，随后用嘴唇含住进行轻咬和吮吸。", en: "Female stimulates Male's nipples with {ITEM}, then takes them into her mouth to nibble and suck.", ja: "女性は {ITEM} で男性の乳首を刺激し、そのあと口に含んで優しく噛み吸い上げる。" },
    { id: "f-i7", level: 3, zh: "女用 {ITEM} 绑住男的双腕举过头顶，脱下男的内裤进行高频口舌攻势，男身体抖动时用 {ITEM} 抚摸其胸口。", en: "Female binds Male's wrists with {ITEM}, uncovers his front for intense oral play, stroking his chest with {ITEM} when he shivers.", ja: "女性は {ITEM} で男性の手首を頭上で縛り、下着を脱がせて口で攻め立てる。男性が震えたら {ITEM} で胸を撫でる。" },
    { id: "f-i8", level: 3, zh: "女用 {ITEM} 冰镇/刺激男的阴茎头部 5 秒，随后立刻换成温热的嘴唇进行深套吮吸。", en: "Female stimulates Male's glans with {ITEM} for 5s, immediately switching to warm lips for deep suction.", ja: "女性は {ITEM} で男性の先端を5秒刺激し、直後に温かい唇に替えて深々と吸い上げる。" },
    { id: "f-i9", level: 3, zh: "女将男按在身下，用 {ITEM} 刺激男的敏感区域，双手扣紧男的手腕进行剧烈的全方位下体摩擦。", en: "Female pins Male down, stimulating his core with {ITEM}, holding his wrists while grinding violently.", ja: "女性は男性を押さえつけ、{ITEM} で敏感ゾーンを刺激し、手首を固定して股間を激しく擦りつける。" }
  ]
};

// 2. 男性视角任务数据 (Male -> Target: Female)
const maleData = {
  action: [
    // Level 1
    { id: "m-a1", level: 1, zh: "男用指尖从女的大腿内侧根部向上划过，每次停顿 3 秒，但不碰到核心区域。", en: "Male lightly strokes Female's inner thigh upward, pausing 3s without touching her core.", ja: "男性は指先で女性の太もも内側の付け根から上へ滑らせ、毎回3秒止める（デリケートゾーンには触れない）。" },
    { id: "m-a2", level: 1, zh: "男用嘴唇从女的后颈沿着脊柱骨一寸一寸向下吮吸，直到腰窝处留下浅浅的印记。", en: "Male kisses and gently sucks down Female's spine inch by inch down to her waist dimples.", ja: "男性は女性のうなじから背骨に沿って腰のくびれまで、ゆっくりと唇で吸いながら跡を残す。" },
    { id: "m-a3", level: 1, zh: "男从身后紧抱住女，下巴抵在女的肩头，用双手掌心紧贴女的腹部向后收紧贴合。", en: "Male hugs Female tightly from behind, resting his chin on her shoulder and pulling her waist close.", ja: "男性は後ろから女性を抱きしめ、顎を肩に乗せ、両手で腰を引き寄せて密着させる。" },
    { id: "m-a4", level: 1, zh: "男用湿润的舌头沿女的锁骨线条来回划过，并在中央凹陷处停留吮吸 10 秒。", en: "Male traces Female's collarbones with his wet tongue, gently sucking her collarbone cavity for 10s.", ja: "男性は湿った舌で女性の鎖骨ラインをなぞり、くぼみ部分を10秒間吸い上げる。" },
    { id: "m-a5", level: 1, zh: "男用嘴唇轻抚女闭上的眼皮，并在耳后敏感区域轻吹热气。", en: "Male softly kisses Female's closed eyelids and gently blows warm breath behind her ear.", ja: "男性は女性の閉じたまぶたに優しくキスし、耳の後の敏感な部分に温かい息を吹きかける。" },
    // Level 2
    { id: "m-a6", level: 2, zh: "男抓住女的双膝将其向两侧分开，将面部贴近女的大腿内侧，用舌尖缓慢勾画圈圈。", en: "Male spreads Female's knees apart, bringing his face close to her inner thighs and slowly licking in circles.", ja: "男性は女性の膝を大きく開き、太もも内側に顔を近づけて舌先でゆっくり円を描く。" },
    { id: "m-a7", level: 2, zh: "男从身后抱住女，一手揉捏女的胸部，另一只手隔着内裤轻揉阴蒂敏感点。", en: "Male hugs Female from behind, massaging her breast with one hand while stimulating her clitoris over her panties with the other.", ja: "男性は後ろから抱きしめ、片手で胸を揉みながら、もう片方の指で下着越しにクリトリスを刺激する。" },
    { id: "m-a8", level: 2, zh: "男将女的双手拉至头顶用单手扣住，用另一只手侵入女的下装按压阴蒂。", en: "Male holds Female's wrists above her head with one hand, reaching into her underwear with the other to press her clitoris.", ja: "男性は女性の両手を頭の上に固定し、もう片方の手を下着の中に滑り込ませてクリトリスを押す。" },
    { id: "m-a9", level: 2, zh: "男用手掌覆在女的核心部位，快速进行左右打圈式的揉搓加压，使其充血。", en: "Male covers Female's core with his palm, applying quick circular friction to swell the sensitive area.", ja: "男性は女性のデリケートゾーンを手掌で包み込み、円を描くように急速に擦って刺激する。" },
    { id: "m-a10", level: 2, zh: "男将女的单腿抬起挂在自己的腰上，用胯部紧贴女的核心区域进行上下蹭擦。", en: "Male lifts one of Female's legs over his waist, pressing his hips directly against her core to grind vertically.", ja: "男性は女性の片足を自分の腰に掛け、腰を押し当ててデリケートゾーンを上下に擦りつける。" },
    // Level 3
    { id: "m-a11", level: 3, zh: "男脱下女的下装，用舌头专心致志地深舔女的核心区域，女身体抖动时停止 5 秒再继续。", en: "Male removes Female's bottoms and licks her core intensely, pausing for 5s whenever she trembles.", ja: "男性は女性の下着を脱がせ、デリケートゾーンを深々と舐めほぐす。彼女が身悶えしたら5秒止めて再開する。" },
    { id: "m-a12", level: 3, zh: "男用两根手指深入女的体内按压敏感 G 点，配合嘴唇对女的阴蒂进行强力吮吸。", en: "Male inserts two fingers inside Female to press her G-spot while simultaneously sucking her clitoris.", ja: "男性は指2本を膣内に挿入してGスポットを刺激しながら、同時に口でクリトリスを力強く吸う。" },
    { id: "m-a13", level: 3, zh: "男强行撬开女的双唇深吻，同时手指在女的体内进行快速地进出抽动。", en: "Male deeply kisses Female, forcing her lips open while rapidly thrusting his fingers inside her.", ja: "男性は女性の唇をこじあけてディープキスを交わしながら、指を体内で高速で出し入れする。" },
    { id: "m-a14", level: 3, zh: "男用嘴唇完全包裹并强力吮吸女的阴蒂，在女即将高潮时猛然抽离并用手掌盖住。", en: "Male envelops Female's clitoris with intense suction, abruptly pulling away right at her edge to cover it with his palm.", ja: "男性は女性のクリトリスを口で包み込み強烈に吸い上げ、寸止めの瞬間にパッと口を離して掌で覆い隠す。" },
    { id: "m-a15", level: 3, zh: "男用舌尖快速连续地顶刺女的阴蒂（模仿缝纫机高频节奏），双手死死扣住女的大腿。", en: "Male rapidly vibrates his tongue tip against Female's clitoris like a sewing machine, holding her thighs tightly.", ja: "男性は舌先で女性のクリトリスをミシンのような超高速リズムで連続で突き、両手で太ももを固定する。" }
  ],
  drinkable: [
    { id: "m-d1", level: 1, zh: "男与女碰杯，将少量 {DRINKABLE} 含在口中，贴上女的唇瓣缓缓喂给女，双手紧贴女的腰际。", en: "Male clinks glasses with Female, holds {DRINKABLE} in his mouth, feeding it lips-to-lips while holding her waist.", ja: "男性は乾杯し、{DRINKABLE} を口に含んで女性の唇に重ねて口移しで飲ませ、腰を抱き寄せる。" },
    { id: "m-d2", level: 1, zh: "男将少量 {DRINKABLE} 倒在女的锁骨凹陷处，用嘴唇专心致志地吮吸干净。", en: "Male pours a bit of {DRINKABLE} onto Female's collarbone cavity, sucking it clean with his lips.", ja: "男性は {DRINKABLE} を女性の鎖骨のくぼみに垂らし、唇で熱心に吸いとる。" },
    { id: "m-d3", level: 1, zh: "男将 {DRINKABLE} 涂抹在女的手腕与脖颈处，用舌尖轻轻舔舐干净并吹热气。", en: "Male applies {DRINKABLE} to Female's wrists and neck, gently licking it clean and blowing warm air.", ja: "男性は {DRINKABLE} を女性の手首や首すじに塗り、舌先で優しく舐めとって息を吹きかける。" },
    { id: "m-d4", level: 2, zh: "男将 {DRINKABLE} 倒在女的下腹部，俯下身用舌头一路向下舔舐收拾干净。", en: "Male pours {DRINKABLE} on Female's lower belly, leaning down to lick it clean down to her core.", ja: "男性は {DRINKABLE} を女性の下腹部に垂らし、身を乗り出して舌で綺麗に舐め下ろす。" },
    { id: "m-d5", level: 2, zh: "男拉开女的内裤边缘，将少量 {DRINKABLE} 滴在女的大腿根部，用嘴唇和舌头舔吸干净。", en: "Male pulls Female's panty edge, dripping {DRINKABLE} on her upper thigh root, licking it clean.", ja: "男性は女性の下着の端を引っ張り、太もも付け根に {DRINKABLE} を滴らせて舌と唇で舐めとる。" },
    { id: "m-d6", level: 2, zh: "男将冰凉的 {DRINKABLE} 含在口中 5 秒，随后立刻贴上女的核心外围进行打圈深舔。", en: "Male holds chilled {DRINKABLE} in his mouth for 5s, then immediately licks around Female's core in circles.", ja: "男性は冷たい {DRINKABLE} を5秒間口に含んだ後、すぐに女性のデリケートゾーンに唇を当てて円を描くように深くなめまわす。" },
    { id: "m-d7", level: 3, zh: "男用 {DRINKABLE} 淋在女的阴蒂与大阴唇上，用舌头高频打圈舔舐，配合手指深入体内。", en: "Male drizzles {DRINKABLE} over Female's clitoris, licking rapidly in circles while inserting fingers inside.", ja: "男性は {DRINKABLE} をクリトリスと陰唇に注ぎ、舌で高速で舐めまわしながら指を体内に挿入する。" },
    { id: "m-d8", level: 3, zh: "男将 {DRINKABLE} 倒在女的核心区，用舌尖模仿缝纫机高频节奏快速顶刺女的阴蒂。", en: "Male pours {DRINKABLE} on Female's core, rapidly tapping her clitoris with his tongue tip in a machine rhythm.", ja: "男性は {DRINKABLE} を女性のデリケートゾーンに注ぎ、舌先でミシンのような超高速リズムで連続刺激する。" },
    { id: "m-d9", level: 3, zh: "男口含 {DRINKABLE} 贴上女的阴蒂吮吸 15 秒，随后吞下，换成温热的舌头深入攻陷。", en: "Male holds {DRINKABLE} in mouth, sucking Female's clitoris for 15s, swallows, then uses warm tongue to explore deeply.", ja: "男性は {DRINKABLE} を含んだままクリトリスを15秒間強く吸い上げ、飲み干した後に温かい舌で深々と攻め込む。" }
  ],
  eatable: [
    { id: "m-e1", level: 1, zh: "男将 {EATABLE} 点抹在女的锁骨与肚脐处，俯下身用舌尖挑逗并吃掉。", en: "Male dabs {EATABLE} on Female's collarbone and belly button, leaning down to lick it off playfully.", ja: "男性は {EATABLE} を女性の鎖骨とおヘソに付け、かがんで舌先で戯れながら舐めとる。" },
    { id: "m-e2", level: 1, zh: "男用指尖蘸取 {EATABLE} 涂在女的耳垂和颈窝，贴着耳边轻轻咬吸干净。", en: "Male applies {EATABLE} to Female's earlobe and neck, gently sucking it clean near her ear.", ja: "男性は指先で {EATABLE} を女性の耳たぶやくびすじに付け、耳元で優しく吸いとる。" },
    { id: "m-e3", level: 1, zh: "男将 {EATABLE} 涂在女的手背与指尖，将女的手指依次含进口中吮吸干净。", en: "Male applies {EATABLE} to Female's hand and fingertips, sucking her fingers clean one by one.", ja: "男性は {EATABLE} を女性の手の甲や指先に塗り、指を1本ずつ口に含んで舐めとる。" },
    { id: "m-e4", level: 2, zh: "男分开女的双膝，将少量 {EATABLE} 抹在女的阴蒂外围，将面部贴近女的核心区，用舌尖缓慢打圈舔舐干净。", en: "Male spreads Female's knees, dabs {EATABLE} around her clitoris, licking it clean slowly in circles.", ja: "男性は女性の膝を開き、クリトリスの周りに {EATABLE} を少量塗り、顔を近づけて舌先でゆっくり綺麗に舐めあげる。" },
    { id: "m-e5", level: 2, zh: "男将 {EATABLE} 点抹在女的双侧乳头上，用嘴唇分别含住用力吮吸，直到乳头挺立。", en: "Male dabs {EATABLE} on Female's nipples, sucking them firmly into his mouth until erect.", ja: "男性は {EATABLE} を女性の両乳首に塗り、それぞれ口に含んで強く吸い上げ、乳首を立たせる。" },
    { id: "m-e6", level: 2, zh: "男拉开女的内裤边缘，将 {EATABLE} 涂抹在女的大腿根部褶皱处，用舌头与嘴唇舔舐吃掉。", en: "Male pulls Female's panty edge, applying {EATABLE} to her inner thigh fold, licking it off.", ja: "男性は女性の下着の端を引っ張り、太もも付け根に {EATABLE} を塗って舌と唇で舐めとる。" },
    { id: "m-e7", level: 3, zh: "男脱下女的下装，将 {EATABLE} 涂抹在女的核心阴蒂与阴道口，用舌头专心致志地深舔挑逗，女身体抖动时停止 5 秒再继续攻势。", en: "Male lowers Female's bottoms, applying {EATABLE} to her clitoris and opening, licking intensely, pausing 5s when she shivers.", ja: "男性は女性の下着を脱がせ、クリトリスと膣口に {EATABLE} を塗り、没頭して舐めほぐす。彼女が身悶えしたら5秒止めて再開する。" },
    { id: "m-e8", level: 3, zh: "男用两根手指蘸取 {EATABLE} 深入女的体内按压敏感 G 点，配合嘴唇对女涂有 {EATABLE} 的阴蒂进行强力吮吸。", en: "Male dips two fingers in {EATABLE}, inserting inside to stimulate her G-spot while sucking her clitoris.", ja: "男性は {EATABLE} を指2本につけて膣内に挿入しGスポットを刺激しながら、同時に口でクリトリスを強く吸う。" },
    { id: "m-e9", level: 3, zh: "男将女压制成趴姿，将 {EATABLE} 涂在女的臀部肉块与核心后方，一手拉住女的头发，嘴唇与舌头在后方猛烈攻陷。", en: "Male holds Female face down, applying {EATABLE} to her buttocks and rear core, pulling her hair while licking intensely from behind.", ja: "男性は女性をうつ伏せにし、お尻と股間後方に {EATABLE} を塗り、髪を引っ張りながら後ろから猛烈に舐め攻める。" }
  ],
  item: [
    { id: "m-i1", level: 1, zh: "男用 {ITEM} 蒙住女的眼睛，随后用手掌覆在女的胸部进行轻柔打圈揉按。", en: "Male blindfolds Female with {ITEM}, placing his palms on her breasts to gently massage in circles.", ja: "男性は {ITEM} で女性に目隠しをし、掌を胸に当てて優しく円を描くように揉みほぐす。" },
    { id: "m-i2", level: 1, zh: "男用 {ITEM} 从女的大腿内侧根部向上划过，每次停顿 3 秒，但不碰到核心。", en: "Male lightly strokes {ITEM} up Female's inner thigh, pausing 3s without touching her core.", ja: "男性は {ITEM} で女性の太もも内側の付け根から上へ滑らせ、毎回3秒止める（デリケートゾーンには触れない）。" },
    { id: "m-i3", level: 1, zh: "男用 {ITEM} 抚摸女的后颈与背部，配合耳边轻声喘息。", en: "Male caresses Female's neck and back with {ITEM}, breathing softly into her ear.", ja: "男性は {ITEM} で女性のうなじと背中を撫で、耳元で静かに吐息を漏らす。" },
    { id: "m-i4", level: 2, zh: "男用 {ITEM} 将女的双手固定在头顶，用另一只手侵入女的下装进行深层揉抚。", en: "Male secures Female's hands above her head with {ITEM}, reaching into her bottoms to massage deeply.", ja: "男性は {ITEM} で女性の両手を頭上に固定し、もう片方の手を下着の中に滑り込ませて深く揉みほぐす。" },
    { id: "m-i5", level: 2, zh: "男用 {ITEM} 贴着女的核心区域隔着内裤轻蹭，同时用嘴唇亲吻女的脖颈。", en: "Male brushes {ITEM} against Female's core over her panties while kissing her neck.", ja: "男性は {ITEM} を下着越しに女性の股間に軽く擦りつけながら、唇で首すじにキスをする。" },
    { id: "m-i6", level: 2, zh: "男用 {ITEM} 冰镇/刺激女的乳头 5 秒，随后用嘴唇含住进行轻咬和吮吸。", en: "Male chills/stimulates Female's nipples with {ITEM} for 5s, then takes them into his mouth to nibble and suck.", ja: "男性は {ITEM} で女性の乳首を5秒間刺激し、そのあと口に含んで優しく噛み吸い上げる。" },
    { id: "m-i7", level: 3, zh: "男用 {ITEM} 刺激女的阴蒂 3 秒，立刻换成湿热的舌头进行长达 10 秒的深舔打圈。", en: "Male stimulates Female's clitoris with {ITEM} for 3s, switching immediately to a warm tongue for 10s of circular licking.", ja: "男性は {ITEM} でクリトリスを3秒刺激し、直後に温かい舌に替えて10秒間円を描くように濃厚に舐める。" },
    { id: "m-i8", level: 3, zh: "男用 {ITEM} 抬高女的双腿悬空，用自己的下体与女的核心进行悬空强烈摩擦。", en: "Male uses {ITEM} to elevate Female's legs, forcefully grinding his front against her suspended core.", ja: "男性は {ITEM} を使って女性の足を浮かせ、自分の股間と彼女のデリケートゾーンを空中で激しく擦り合わせる。" },
    { id: "m-i9", level: 3, zh: "男用 {ITEM} 扣住女的手腕，用手指在女体内快速旋转，同时用嘴唇强力吮吸女的阴蒂。", en: "Male holds Female's wrists with {ITEM}, rapidly rotating fingers inside her while sucking her clitoris.", ja: "男性は {ITEM} で女性の手首を固定し、指を体内で回転させながら、口でクリトリスを強力に吸い上げる。" }
  ]
};

// 3. 构建配置与遍历生成
const languages = ['zh', 'en', 'ja'];
const genders = ['female', 'male'];
const categories = ['action', 'drinkable', 'eatable', 'item'];

languages.forEach(lang => {
  genders.forEach(gender => {
    const dataSource = gender === 'female' ? femaleData : maleData;
    
    // 自动在 locales/ 下生成对应的语言和性别目录
    const dirPath = path.join(__dirname, 'locales', lang, gender);
    fs.mkdirSync(dirPath, { recursive: true });

    categories.forEach(cat => {
      // 提取符合模版要求的 [{ id, level, text }] 格式
      const formattedItems = dataSource[cat].map(item => {
        const explicitDuration = item.zh.match(/(\d+)\s*秒/)?.[1];
        return {
          id: item.id,
          level: item.level,
          duration: explicitDuration ? Number(explicitDuration) : ({ 1: 30, 2: 60, 3: 90 }[item.level]),
          text: item[lang]
        };
      });

      const filePath = path.join(dirPath, `${cat}.json`);
      fs.writeFileSync(filePath, JSON.stringify(formattedItems, null, 2), 'utf8');
      console.log(`[Generated] locales/${lang}/${gender}/${cat}.json`);
    });
  });
});

console.log('\n✨ 24 个多语言/性别/类型的卡片配置文件已全部自动生成完成！');
