import type { UserInput, SideHustle, ApiConfig } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Dynamic Mock generator based on user input
function generateMockData(input: UserInput): SideHustle[] {
  const candidates: { item: SideHustle; score: number }[] = [];

  // Option 1: AI/Media Writing
  const isCreative = input.personalities.includes('creative') || input.skills.includes('writing') || input.skills.includes('design');
  const noFaceToFace = input.constraints.includes('no_face_to_face');
  const noCapital = input.constraints.includes('no_initial_capital');
  let scoreWriting = 70;
  if (input.personalities.includes('creative')) scoreWriting += 10;
  if (input.skills.includes('writing')) scoreWriting += 15;
  if (input.skills.includes('design')) scoreWriting += 5;
  if (noFaceToFace) scoreWriting += 10;
  if (noCapital) scoreWriting += 5;
  
  candidates.push({
    score: scoreWriting,
    item: {
      id: 'mock_writing',
      title: '小红书与微信公众号自媒体文案创作',
      category: '内容创作',
      matchScore: Math.min(100, scoreWriting),
      reason: `您具备${isCreative ? '创意与写作特长' : '较强自驱力'}，且该兼职符合您${noFaceToFace ? '不露脸' : '灵活时间'}的诉求。自媒体创作门槛低，非常适合利用业余时间在电脑或手机上完成。`,
      difficulty: '中等',
      estimatedIncome: '50 - 300元/篇 或 1000 - 5000元/月',
      prepTime: '2 - 5天',
      pros: [
        '时间完全自由，随时随地用手机或电脑即可开始',
        '随着粉丝积累可以带来长期被动收入（广告与带货）',
        '无需面对面沟通，适合内向专注型性格'
      ],
      cons: [
        '前期起步阶段没有收益，需要持续输出内容',
        '流量不稳定，平台推荐算法变化较快',
        '需要持续学习网络热点和爆款图文排版'
      ],
      requiredSkills: ['爆款文案撰写', '简易图片设计/排版', '热点敏感度'],
      requiredEquipment: ['手机', '电脑（可选）', '网络'],
      actionPlan: [
        '定位垂直领域：根据个人兴趣选择穿搭、读书笔记、职场技能或日常生活分享。',
        '注册平台账号：在小红书、今日头条、百家号等自媒体平台注册。',
        '创作排版模板：设计几套固定视觉风格的封面图（可使用手机美图/Canva等工具）。',
        '发布前5篇内容：日更或隔日更，测试读者反馈并根据数据优化。',
        '接单变现：粉丝达到一定门槛（如小红书1000粉）后开通蒲公英平台接商单，或通过赞赏变现。'
      ],
      platforms: [
        { name: '小红书', url: 'https://www.xiaohongshu.com', desc: '目前对新人最友好的内容种草平台，1000粉丝即可对接商单' },
        { name: 'Canva可画', url: 'https://www.canva.cn', desc: '免费且易上手的在线平面设计工具，用于制作吸睛的笔记封面' }
      ],
      scamWarning: '凡是遇到“招收小红书打字员/录入员”并要求先交押金、培训费或刷单的，100%是诈骗。'
    }
  });

  // Option 2: Professional Service (Coding or Translation/Teaching)
  const isCode = input.skills.includes('coding');
  let scoreSkills = isCode ? 60 : 65;
  if (isCode) {
    scoreSkills += 30;
    if (input.constraints.includes('must_use_pc')) scoreSkills += 10;
    if (input.constraints.includes('no_coding')) scoreSkills -= 50;
    if (input.personalities.includes('analytical')) scoreSkills += 5;
  } else {
    if (input.skills.includes('translation')) scoreSkills += 25;
    if (input.skills.includes('teaching')) scoreSkills += 20;
    if (input.personalities.includes('detail')) scoreSkills += 5;
  }

  candidates.push({
    score: scoreSkills,
    item: {
      id: 'mock_skills',
      title: isCode ? '网页开发与小程序外包' : '在线语言翻译与功课辅导',
      category: '专业服务',
      matchScore: Math.min(100, Math.max(30, scoreSkills)),
      reason: `基于您的${isCode ? '编程与技术' : '语言或教学'}背景。这类兼职客单价高，能将您的专业技能转化为高回报的兼职收入。`,
      difficulty: isCode ? '困难' : '中等',
      estimatedIncome: isCode ? '500 - 3000元/项目' : '80 - 150元/小时',
      prepTime: '3 - 7天',
      pros: [
        '客单价高，技能变现效率优于单纯的体力劳动',
        '有助于提升个人专业水平并积累真实项目案例',
        '容易与客户形成长期稳定的合作关系'
      ],
      cons: [
        '对专业水平有硬性要求，需要有高质量的交付成果',
        '前期寻找信任您的第一批客户比较耗时',
        '项目过程中可能需要反复修改以满足客户需求'
      ],
      requiredSkills: isCode ? ['Vue/React前端开发', 'Git版本控制', '沟通需求能力'] : ['外语能力或学科知识', '耐心与沟通技巧'],
      requiredEquipment: ['配置较好的电脑', '稳定的网络'],
      actionPlan: [
        '整理个人案例集：将过去的优秀作业、开源项目或翻译片段整理成PDF or 网页链接。',
        '入驻接单平台：在国内外专业外包平台注册并完善极具吸引力的个人履历。',
        '积极竞标与主动投递：在平台搜索匹配的项目，提供针对性强的解决方案，而不只是群发简历。',
        '规范合同与预付款：开工前务必收取30%-50%的定金（使用平台担保交易），分阶段交付。',
        '按时交付与收款：提交成果并完成修改，收尾款并请求客户给以好评以提高权重。'
      ],
      platforms: [
        { name: '程序员客栈 / 猪八戒网', url: 'https://www.proginn.com', desc: '国内领先的自由职业者和软件外包平台，适合各类开发设计人员' },
        { name: 'Upwork', url: 'https://www.upwork.com', desc: '全球最大的自由职业外包平台，英语好可以接海外单，赚取美金' }
      ],
      scamWarning: '在私下交易时，如果对方要求在没有平台担保的情况下直接交工，或在开工前要你垫付保证金或押金，极有可能是骗子。'
    }
  });

  // Option 3: Data Annotation
  let scoreTasks = 75;
  if (noCapital) scoreTasks += 10;
  if (input.constraints.includes('no_coding')) scoreTasks += 10;
  if (input.skills.includes('none')) scoreTasks += 15;
  if (input.personalities.includes('detail')) scoreTasks += 5;
  if (input.targetEarnings === '1000+') scoreTasks -= 15;

  candidates.push({
    score: scoreTasks,
    item: {
      id: 'mock_tasks',
      title: 'AI数据训练之文本与图像标注',
      category: '微任务',
      matchScore: Math.min(100, scoreTasks),
      reason: `由于您希望${noCapital ? '零启动资金' : '低门槛入门'}，数据标注是一项极易上手的微任务兼职，用电脑和手机均可随时开工。`,
      difficulty: '简单',
      estimatedIncome: '15 - 40元/小时',
      prepTime: '1 - 2天',
      pros: [
        '几乎零门槛，只需经过简单的在线培训即可开始',
        '多劳多得，按件计酬，结算通常非常及时',
        '适合利用碎片化的零碎时间完成'
      ],
      cons: [
        '单价较低，难以实现高额收入',
        '工作内容较为枯燥、机械化',
        '长期来看无法形成可沉淀的个人核心技能'
      ],
      requiredSkills: ['基本电脑/手机操作', '细心与耐心', '能理解标注规范'],
      requiredEquipment: ['电脑或智能手机', '网络连接'],
      actionPlan: [
        '选择正规的数据标注平台进行注册。',
        '参加平台的免费新手培训，并进行模拟标注测试。',
        '通过平台考核后，领取对应任务（如：图像框选、语音转文字、文本分类）。',
        '利用每天晚间或周末等空闲时间进行标注，注意保持极高的准确率。',
        '定期在平台内申请提现至支付宝/微信。'
      ],
      platforms: [
        { name: '百度众测', url: 'https://zhongce.baidu.com', desc: '百度旗下正规任务平台，提供采集、标注、评测等多维度兼职任务' },
        { name: '腾讯企鹅众包', url: 'https://zbapi.youtu.qq.com', desc: '腾讯推出的微任务标注平台，提供丰富的 AI 训练数据标注任务' }
      ],
      scamWarning: '绝对不要相信“帮拼多多刷单”、“淘宝点赞返利”或“代充值返现”的任务，这些全是刷单诈骗！正规标注平台不会收取任何加盟费。'
    }
  });

  // Option 4: Remote Customer Service or E-commerce
  const isDetail = input.personalities.includes('detail') || input.personalities.includes('practical');
  let scoreEcom = isDetail ? 70 : 68;
  if (isDetail) scoreEcom += 10;
  if (noCapital) scoreEcom += 5;
  if (noFaceToFace) scoreEcom += 5;
  
  candidates.push({
    score: scoreEcom,
    item: {
      id: 'mock_assistant',
      title: isDetail ? '淘宝/拼多多网店远程客服' : '闲鱼虚拟商品无货源销售',
      category: '电商与客服',
      matchScore: Math.min(100, scoreEcom),
      reason: `根据您的性格偏向于${isDetail ? '细心和耐心' : '实践'}。客服或电商兼职能提供稳定的碎片化收益。`,
      difficulty: '简单',
      estimatedIncome: isDetail ? '20 - 35元/小时 或 1500-3000元/月' : '300 - 2000元/月（提成制）',
      prepTime: '2 - 4天',
      pros: [
        '工作机会极其庞大，电商商家长期有夜班/周末班需求',
        '无货源销售无需囤货，资金风险为零',
        '能锻炼电商运营、销售和客户沟通能力'
      ],
      cons: [
        '客服可能需要处理难缠顾客的投诉，有一定情绪压力',
        '网店客服排班时间（如晚班18:00-24:00）需要连续在线',
        '无货源销售前期需要发布大量商品才有曝光'
      ],
      requiredSkills: isDetail ? ['打字速度快', '良好的情绪克制力', '熟悉网购流程'] : ['文案排版', '基础图文编辑', '价格敏感度'],
      requiredEquipment: ['智能手机', '稳定电脑（网店客服通常必须）'],
      actionPlan: isDetail ? [
        '在兼职平台或招聘网站搜索“远程客服”、“淘宝夜班客服”等岗位。',
        '投递简历并进行打字速度及客服模拟测试（通常要求打字速度 > 60字/分）。',
        '接受商家的店铺产品知识、常用话术培训。',
        '按排班时间准时上线，通过客服软件解答顾客售前咨询及售后退换货。',
        '按月或按周结算底薪与提成。'
      ] : [
        '注册闲鱼、转转等平台账号，并进行实人认证。',
        '寻找低门槛甚至零成本的虚拟商品源（如：自己整理的某行业考研笔记、PPT模板、无版权教程）。',
        '编写吸引人的商品标题 and 介绍，配上干净的预览图。',
        '发布至平台，并开启“自动发货”功能或设置好快捷回复。',
        '有顾客咨询时及时跟进，促成交易，通过网盘自动发货。'
      ],
      platforms: [
        { name: 'Boss直聘 / 前程无忧', url: 'https://www.zhipin.com', desc: '搜索“远程客服”或“兼职客服”，筛选可以居家办公的合法岗位' },
        { name: '闲鱼', url: 'https://2.taobao.com', desc: '门槛极低的二手与服务交易平台，适合个人变现技能、闲置或虚拟商品' }
      ],
      scamWarning: '正规招聘网店客服不会要你垫付押金买“客服软件”或“交培训费”。如果面试官加微信要求“去某个小平台刷单”，请立刻拉黑！'
    }
  });

  // Option 5: Local Delivery & Tasks
  let scoreDelivery = 60;
  if (noFaceToFace) scoreDelivery -= 40;
  if (input.skills.includes('driving')) scoreDelivery += 25;
  if (input.personalities.includes('practical')) scoreDelivery += 10;
  if (input.constraints.includes('must_use_pc')) scoreDelivery -= 40;
  if (input.constraints.includes('fast_payout')) scoreDelivery += 10;

  candidates.push({
    score: scoreDelivery,
    item: {
      id: 'mock_delivery',
      title: '同城闪送与代办跑腿服务',
      category: '线下服务',
      matchScore: Math.min(100, Math.max(10, scoreDelivery)),
      reason: `此兼职时间自由度极高，适合喜欢户外、多劳多得的伙伴。配合您的${input.skills.includes('driving') ? '驾驶技能' : '强执行力'}，可快速实现日结变现。`,
      difficulty: '简单',
      estimatedIncome: '25 - 50元/小时 或 150-300元/天',
      prepTime: '1 - 2天',
      pros: [
        '时间自由度高，空闲时间可随时上线接单',
        '即时结账，收入到账快',
        '门槛极低，只需会骑车使用手机导航'
      ],
      cons: [
        '受天气影响大，恶劣天气下派送辛苦且有安全隐患',
        '完全依靠体力劳动，无法积累核心职业技能',
        '收入有上限，受派单区域 and 订单量限制'
      ],
      requiredSkills: ['熟悉本地路况', '熟练使用手机导航', '良好的沟通服务态度'],
      requiredEquipment: ['智能手机', '电动车或摩托车', '保暖/防雨装备'],
      actionPlan: [
        '选择平台：下载美团众包、蜂鸟众包或达达、闪送等接单 App 并注册。',
        '实名认证：按照要求上传身份证、健康证（部分平台需要）进行实人认证。',
        '装备准备：准备好电动车、头盔、保温箱等必备工具。',
        '接单配送：在空闲时间段开启 App 听单或手动抢单，按照导航进行取件 and 配送。',
        '结算提现：配送完成后订单资金自动打入钱包，可随时申请提现。'
      ],
      platforms: [
        { name: '美团众包 / 蜂鸟众包', url: 'https://peisong.meituan.com', desc: '门槛极低的即时配送平台，单量大，随时可上线接单' },
        { name: '闪送 / 顺丰同城', url: 'https://www.ishansong.com', desc: '专注于一对一同城急送，客单价较高，适合有交通工具的个人' }
      ],
      scamWarning: '正规跑腿和众包配送平台注册完全免费。凡是收取“保证金”、“入网费”或强制推销高价“电动车租赁方案”的，极有可能是黑中介或骗局。'
    }
  });

  // Option 6: Online Survey & Product testing
  let scoreSurvey = 55;
  if (noCapital) scoreSurvey += 15;
  if (input.constraints.includes('no_coding')) scoreSurvey += 10;
  if (input.skills.includes('none')) scoreSurvey += 15;
  if (input.personalities.includes('detail')) scoreSurvey += 5;
  if (input.targetEarnings === '1000+') scoreSurvey -= 25;

  candidates.push({
    score: scoreSurvey,
    item: {
      id: 'mock_survey',
      title: '在线问卷调查与产品评测体验',
      category: '微任务',
      matchScore: Math.min(100, Math.max(10, scoreSurvey)),
      reason: `鉴于您希望零门槛、零启动资金且工作灵活。参与正规的市场调研问卷和体验测试，是利用零碎碎片时间赚点零花钱的极简方式。`,
      difficulty: '简单',
      estimatedIncome: '5 - 20元/份 或 100 - 300元/月',
      prepTime: '1天',
      pros: [
        '几乎没有任何门槛，只需用手机答题即可',
        '时间完全碎片化，公交上或休息时段均可填答',
        '无需任何专业技能，适合纯零钱收益的变现'
      ],
      cons: [
        '单价极低，只能赚取微薄零花钱，无法以此为主业',
        '很多问卷存在筛选条件，可能会因画像不匹配被中途筛选出局',
        '工作重复且机械，无法获得职业发展技能的沉淀'
      ],
      requiredSkills: ['基本手机操作', '阅读理解能力', '诚实答题态度'],
      requiredEquipment: ['智能手机', '网络连接'],
      actionPlan: [
        '注册一些信誉良好的正规市场研究或问卷发布平台。',
        '完善个人画像档案（包含地区、职业、消费习惯），增加匹配合适问卷的几率。',
        '每日登录平台，筛选出可以参与的问卷或产品体验任务。',
        '按照要求真实且逻辑一致地填写完问卷，切忌为了快随意乱点。',
        '累积达到平台最小提现额度后，提现至支付宝、微信或兑换礼品卡。'
      ],
      platforms: [
        { name: '腾讯问卷', url: 'https://wj.qq.com', desc: '腾讯旗下的专业问卷系统，部分合作调研任务可获得答卷奖励' },
        { name: '第一调查网', url: 'https://www.1diaocha.com', desc: '国内老牌的专业有奖调查社区，提供大量商业问卷，积分可提现' }
      ],
      scamWarning: '任何自称“问卷打字员”或“问卷刷单”并要求你先充值“VIP”以获取高价问卷任务的，百分之百是诈骗。真正的调研平台决不收费。'
    }
  });

  // Sort candidates by matchScore descending
  candidates.sort((a, b) => b.score - a.score);

  // Return the top N recommendations
  const count = input.recommendCount || 3;
  return candidates.slice(0, count).map(c => c.item);
}

function getSystemInstruction(recommendCount: number): string {
  return `
你是一位专业的兼职分析师与职业生涯规划师。你的任务是根据用户的输入信息，为用户推荐 ${recommendCount} 个最适合他们的兼职（Side Hustles）。
你必须输出一个严谨的 JSON 数组，里面的元素必须匹配以下 TypeScript 接口定义：

interface Platform {
  name: string; // 平台/工具名称
  url: string; // 网址或主要作用描述
  desc: string; // 针对该兼职如何在此平台起步的简要指导
}

interface SideHustle {
  id: string; // 唯一标识符，格式如 "hustle_1", "hustle_2" 等
  title: string; // 兼职名称（例如：自媒体文案撰写、网页前端开发、淘宝远程客服）
  category: string; // 兼职类别（例如：内容创作、专业服务、技术开发、电商运营、微任务）
  matchScore: number; // 匹配度评分，范围 0-100 之间的整数
  reason: string; // 推荐理由，说明为什么根据其性格、时间和技能这个兼职非常契合他们（2-3句中文）
  difficulty: '简单' | '中等' | '困难'; // 难度级别
  estimatedIncome: string; // 预计收入范围，例如 "30-50元/小时" 或 "1500-4000元/月"
  prepTime: string; // 准备周期/起步时间，例如 "1-3天" 或 "2周"
  pros: string[]; // 这个兼职的 3 个主要优势/好处（中文）
  cons: string[]; // 这个兼职的 3 个主要挑战/劣势（中文）
  requiredSkills: string[]; // 2-4 个核心技能要求
  requiredEquipment: string[]; // 1-3 个硬件设备要求
  actionPlan: string[]; // 4-5 个步骤的详细实操起步指南
  platforms: Platform[]; // 2 个可以实操、真实存在的推荐注册平台或工具
  scamWarning: string; // 1 个针对该兼职领域，提醒用户防范骗局/割韭菜的预警提示（核心重要！）
}

请确保所有文本均用中文撰写。提供真实存在、合规合法的兼职项目。不要推荐任何违规、灰色、违法或者需要高额资金投入的兼职。
只返回纯 JSON 内容，不要包含任何 markdown 块或前后的解释性文本。
`;
}

function buildUserPrompt(input: UserInput): string {
  return `
这是用户的个人条件输入：
- 年龄段: ${input.ageGroup}
- 当前身份: ${input.role}
- 每周可用时间: ${input.weeklyHours} 小时
- 适合的兼职时段: ${input.timeSlots.join(', ')}
- 性格特点: ${input.personalities.join(', ')}
- 拥有的技能/兴趣: ${input.skills.join(', ')}
- 期望兼职收益: ${input.targetEarnings}
- 限制条件/不想做的事情: ${input.constraints.join(', ')}
- 自我补充说明: ${input.customDescription || '无'}

请根据这些条件，为用户量身定制 ${input.recommendCount || 3} 个兼职。
`;
}

function cleanAndParseJson(text: string): SideHustle[] {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```$/, '');
  }
  cleaned = cleaned.trim();
  
  const parsed = JSON.parse(cleaned);
  if (Array.isArray(parsed)) {
    return parsed as SideHustle[];
  }
  throw new Error("Parsed response is not an array");
}

function checkIsGemini(config: ApiConfig): boolean {
  const url = config.baseUrl.trim().toLowerCase();
  const model = config.model.trim().toLowerCase();
  return url.includes('generativelanguage.googleapis.com') || model.includes('gemini');
}

// 1. Connection Tester
export async function testApiConnection(config: ApiConfig): Promise<boolean> {
  if (config.id === 'mock_profile') {
    return true;
  }

  const isGemini = checkIsGemini(config);

  if (isGemini) {
    const baseUrl = config.baseUrl.trim() || 'https://generativelanguage.googleapis.com';
    const cleanUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const model = config.model || 'gemini-1.5-flash';
    const url = `${cleanUrl}/v1beta/models/${model}:generateContent?key=${config.apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'hello. answer with "ok" only.' }] }],
        generationConfig: { maxOutputTokens: 5 }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`连接失败 (HTTP ${response.status}): ${errorText || response.statusText}`);
    }
    return true;
  } else {
    // OpenAI Compatible
    const baseUrl = config.baseUrl.trim() || 'https://api.openai.com/v1';
    const cleanUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const url = `${cleanUrl}/chat/completions`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model || 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'hello. answer with "ok" only.' }],
        max_tokens: 5
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`连接失败 (HTTP ${response.status}): ${errorText || response.statusText}`);
    }
    return true;
  }
}

// 2. Core LLM caller
export async function getSideHustleRecommendations(
  input: UserInput,
  config: ApiConfig
): Promise<SideHustle[]> {
  if (config.id === 'mock_profile') {
    await delay(1500);
    return generateMockData(input);
  }

  const prompt = buildUserPrompt(input);
  const isGemini = checkIsGemini(config);

  if (isGemini) {
    const baseUrl = config.baseUrl.trim() || 'https://generativelanguage.googleapis.com';
    const cleanUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const model = config.model;
    const url = `${cleanUrl}/v1beta/models/${model}:generateContent?key=${config.apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: getSystemInstruction(input.recommendCount || 3) },
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini-API 请求错误 (${response.status}): ${errText}`);
    }

    const resData = await response.json();
    const resultText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!resultText) {
      throw new Error("Gemini 模型未返回有效文本内容");
    }
    return cleanAndParseJson(resultText);
  } else {
    // OpenAI Compatible
    const baseUrl = config.baseUrl.trim() || 'https://api.openai.com/v1';
    const cleanUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const url = `${cleanUrl}/chat/completions`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: getSystemInstruction(input.recommendCount || 3) },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI-API 请求错误 (${response.status}): ${errText}`);
    }

    const resData = await response.json();
    const resultText = resData.choices?.[0]?.message?.content;
    if (!resultText) {
      throw new Error("模型未返回有效文本内容");
    }
    return cleanAndParseJson(resultText);
  }
}
