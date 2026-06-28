export type ResultCategory =
  | 'non_human'
  | 'solo'
  | 'general_solo'
  | 'group'
  | 'id_photo'
  | 'motorcycle'
  | 'luxury_car'
  | 'tattoo'
  | 'hanbok'
  | 'kimono'
  | 'general';

export type ResultTone = 'roast' | 'hard_roast' | 'absurd' | 'social';
export type GenderPresentation =
  | 'masculine'
  | 'feminine'
  | 'androgynous'
  | 'unknown';
export type ResultCluster =
  | 'self_confident_profile'
  | 'small_talk_social'
  | 'awkward_camera'
  | 'effortless_but_calculated'
  | 'outfit_showoff'
  | 'quiet_chic'
  | 'tryhard_funny'
  | 'id_photo_roast'
  | 'group_roast'
  | 'non_human_roast';

export type ResultSelectionCriteria = {
  photoTypes?: string[];
  gaze?: string[];
  expression?: string[];
  pose?: string[];
  framing?: string[];
  outfitStyle?: string[];
  photoMood?: string[];
  visualTriggers?: string[];
  excludedGaze?: string[];
  excludedExpression?: string[];
  excludedPose?: string[];
  excludedFraming?: string[];
  excludedOutfitStyle?: string[];
  excludedPhotoMood?: string[];
  minScore?: number;
};

export type ResultArchetype = {
  id: string;
  title: string;
  punchline: string;
  reasons: string[];
  scores: { label: string; value: number }[];
  category: ResultCategory;
  photoTypes: string[];
  visualTriggers: string[];
  tone: ResultTone;
  cluster?: ResultCluster;
  presentations?: GenderPresentation[];
  selectionHints?: string[];
  match?: ResultSelectionCriteria;
};

const SELF_CONFIDENT_PROFILE_MATCH = {
  photoTypes: ['selfie', 'profile', 'close_up', 'chest_up'],
  gaze: ['looking_at_camera'],
  expression: ['natural_smile', 'neutral', 'playful'],
  pose: ['natural', 'posed'],
  framing: ['face_close_up', 'chest_up', 'selfie'],
  outfitStyle: ['clean', 'dressed_up', 'effortless'],
  excludedPose: ['awkward', 'exaggerated', 'v_sign', 'finger_heart'],
  excludedFraming: ['full_body', 'third_person_photo', 'mirror_shot'],
  excludedPhotoMood: ['awkward', 'tryhard', 'quiet_presence'],
  minScore: 12,
} satisfies ResultSelectionCriteria;

const CLUSTER_MATCHES = {
  self_confident_profile: SELF_CONFIDENT_PROFILE_MATCH,
  small_talk_social: {
    photoTypes: ['solo', 'daily'],
    gaze: ['looking_at_camera'],
    expression: ['natural_smile', 'playful'],
    pose: ['natural'],
    framing: ['third_person_photo', 'upper_body', 'chest_up'],
    photoMood: ['social', 'bright'],
    excludedExpression: ['neutral', 'forced_smile', 'chic', 'awkward_stiff'],
    excludedPose: [
      'awkward',
      'exaggerated',
      'v_sign',
      'finger_heart',
      'standing_still',
    ],
    excludedFraming: ['face_close_up', 'selfie', 'full_body', 'mirror_shot'],
    excludedPhotoMood: ['awkward', 'chic', 'calm', 'quiet_presence', 'tryhard'],
    minScore: 17,
  },
  awkward_camera: {
    photoTypes: ['solo', 'daily', 'upper_body', 'full_body'],
    expression: ['awkward_stiff', 'forced_smile'],
    pose: ['awkward'],
    framing: ['upper_body', 'full_body', 'chest_up'],
    excludedPose: ['natural', 'posed'],
    minScore: 9,
  },
  effortless_but_calculated: {
    photoTypes: ['solo', 'selfie', 'daily', 'profile'],
    expression: ['natural_smile', 'neutral'],
    pose: ['natural'],
    outfitStyle: ['casual', 'effortless', 'clean'],
    photoMood: ['effortless', 'calm'],
    excludedPhotoMood: ['awkward', 'tryhard'],
    minScore: 9,
  },
  outfit_showoff: {
    photoTypes: ['solo', 'daily', 'full_body'],
    pose: ['posed'],
    framing: ['full_body', 'third_person_photo'],
    outfitStyle: ['dressed_up', 'street', 'formal', 'tryhard'],
    photoMood: ['tryhard', 'chic'],
    excludedFraming: ['face_close_up', 'chest_up', 'selfie'],
    minScore: 9,
  },
  quiet_chic: {
    photoTypes: ['solo', 'profile', 'chest_up', 'upper_body', 'daily'],
    gaze: ['looking_at_camera', 'looking_away'],
    expression: ['neutral', 'chic'],
    pose: ['natural', 'standing_still', 'posed'],
    photoMood: ['calm', 'chic', 'quiet_presence'],
    excludedExpression: ['playful', 'forced_smile'],
    excludedPose: ['awkward', 'exaggerated', 'v_sign', 'finger_heart'],
    minScore: 9,
  },
  tryhard_funny: {
    photoTypes: ['solo', 'selfie', 'daily'],
    expression: ['playful', 'forced_smile', 'awkward_stiff'],
    pose: ['exaggerated', 'v_sign', 'finger_heart'],
    photoMood: ['awkward', 'tryhard', 'social'],
    excludedPose: ['natural', 'standing_still'],
    minScore: 6,
  },
  id_photo_roast: {
    photoTypes: ['id_photo', 'passport', 'profile'],
    visualTriggers: ['id_photo', 'passport', 'plain_background'],
    minScore: 3,
  },
  group_roast: {
    photoTypes: ['group'],
    framing: ['group_photo'],
    visualTriggers: ['multiple_people', 'group_photo'],
    minScore: 3,
  },
  non_human_roast: {
    photoTypes: ['non_human', 'object', 'landscape', 'food', 'pet', 'unknown'],
    visualTriggers: [
      'no_person_detected',
      'object_only',
      'landscape_only',
      'food_only',
      'pet_only',
    ],
    minScore: 3,
  },
} satisfies Record<ResultCluster, ResultSelectionCriteria>;

type ClusterConfig = {
  category: ResultCategory;
  titlePrefix: '넌 딱' | '너희들은 딱';
  photoTypes: string[];
  visualTriggers: string[];
  tone: ResultTone;
  scoreLabels: [string, string, string];
  reasons: [string, string, string];
  titleTails: TitleTailConfig[];
  punchlines: string[];
};

type TitleTailConfig =
  | string
  | {
      text: string;
      presentations?: GenderPresentation[];
    };

const CLUSTER_CONFIGS = {
  self_confident_profile: {
    category: 'general_solo',
    titlePrefix: '넌 딱',
    photoTypes: ['selfie', 'profile', 'close_up', 'chest_up'],
    visualTriggers: [],
    tone: 'roast',
    scoreLabels: ['자기확신력', '프사감 농도', '반박 불가율'],
    reasons: [
      '정면 컷에 본인 확신이 먼저 들어왔다',
      '사진을 고르는 기준이 프사감에 맞춰져 있다',
      '남의 반응보다 본인 만족이 먼저 끝났다',
    ],
    titleTails: [
      '프사 바꾸면 누가 봤는지 확인할 놈이야',
      '네가 잘생긴 줄 아는 놈이야',
      '네가 예쁜 줄 아는 애야',
      '스스로가 봐도 잘생긴 놈이야',
      '스스로도 예쁜 줄 아는 애야',
      '자신감 하나로 여기까지 온 놈이야',
      '갤러리에 셀카로 가득할 놈이야',
      '세상의 주인공이 될 놈이야',
      '카메라 켜지면 자존감도 같이 켜지는 놈이야',
      '프사 한 장으로 하루 종일 기분 좋을 놈이야',
      '셀카 잘 나오면 인생도 잘 풀린다고 믿는 놈이야',
      '본인 얼굴에 확신이 너무 많은 놈이야',
      '거울 볼 때마다 스스로 납득하는 놈이야',
      '잘 나온 사진 한 장으로 자아 완성하는 놈이야',
      '인생이 그냥 인스타그램인 놈이야',
      '사진첩을 자기소개서처럼 관리할 놈이야',
      '프사 후보만 따로 마음속 폴더에 넣는 놈이야',
      '카메라 앞에서 본인 확신이 풀충전되는 놈이야',
      '잘 나온 컷 하나로 하루를 이긴 놈이야',
      '프사 바꾸고 아무렇지 않은 척할 놈이야',
    ],
    punchlines: [
      '올리는 순간부터 반응 체크 들어간다. 관심 없는 척하지만 조회수는 누구보다 빠르게 본다.',
      '사진 한 장에 자기확신이 너무 많이 들어갔다. 얼굴보다 확신이 먼저 업로드됐다.',
      '남의 인정까지 기다릴 필요가 없다. 본인이 이미 심사위원이고 합격자다.',
      '렌즈가 켜지는 순간 태도가 달라진다. 사진 앱이 아니라 자존감 충전기를 켠 거다.',
    ],
  },
  small_talk_social: {
    category: 'general_solo',
    titlePrefix: '넌 딱',
    photoTypes: ['solo', 'daily'],
    visualTriggers: [],
    tone: 'social',
    scoreLabels: ['말 걸 구실력', '친화력 과속도', '반박 불가율'],
    reasons: [
      '짧게 끝날 상황을 꼭 대화로 늘린다',
      '상대가 웃어주면 바로 친해진 줄 안다',
      '스몰토크가 아니라 생활 습관이다',
    ],
    titleTails: [
      '편의점 알바한테도 날씨 얘기 걸 놈이야',
      '급식 아주머니랑 베프 돼서 닭다리 6개 먹을 놈이야',
      '수능 볼 때 감독관이랑 친해져서 OMR카드 먼저 받을 놈이야',
      '비행기 타면 이코노미 탔는데 비즈니스 석으로 안내 될 놈이야',
      '모임에 나가면 사람들이 상석에 앉힐 놈이야',
      '택시 기사님이랑 목적지보다 인생 얘기 더 할 놈이야',
      '모르는 사람한테 말 걸고 김치도 얻어 올 놈이야',
      '엘리베이터에서 10층 가는 동안 동네 소식 물어볼 놈이야',
      '카페 직원한테 원두보다 근황을 먼저 물을 놈이야',
      '미용실 처음 가서도 자기가 원하는 스타일 잘 말할 놈이야',
      '버스 옆자리 사람한테 목적지 추천 받을 놈이야',
      '병원 대기실에서 옆 사람 증상까지 알게 될 놈이야',
      '헬스장 트레이너랑 운동하다가 세트 수보다 휴식 시간이 더 길 놈이야',
      '길 묻다가 상대 하루 일정까지 들을 놈이야',
      '마트 시식 코너에서 햇반 놓고 먹을 놈이야',
      '은행 창구에서 돈 찾다가 직원 번호도 찾을 놈이야',
      '처음 본 경비원 아저씨하고 죽마고우 될 놈이야',
      '놀이공원 줄 서면 앞 사람하고 시간가는 줄 모르고 대화할 놈이야',
      'SK이노베이션이나 삼성전자가서 호의호식하면서 잘먹고 잘 살 놈이야',
      '편의점 봉투값 아끼려고 주머니에 다 넣고 올 놈이야',
    ],
    punchlines: [
      '계산만 하면 되는데 굳이 대화를 만든다. 친화력이 아니라 말 걸 구실을 못 참는 놈이다.',
      '처음 보는 사람도 대화 후보가 된다. 조용히 지나가는 기능이 없다.',
      '짧은 상황을 관계로 키운다. 친근함이 아니라 말문 자동개방이다.',
      '상대가 받아준 순간 이미 친해졌다고 판단한다. 혼자 속도가 너무 빠르다.',
    ],
  },
  awkward_camera: {
    category: 'general_solo',
    titlePrefix: '넌 딱',
    photoTypes: ['solo', 'daily', 'upper_body', 'full_body'],
    visualTriggers: [],
    tone: 'roast',
    scoreLabels: ['카메라 경직도', '포즈 미아력', '반박 불가율'],
    reasons: [
      '카메라가 켜지는 순간 몸이 따로 논다',
      '웃는 척하는데 구조 요청이 먼저 보인다',
      '포즈를 잡은 게 아니라 포즈에게 잡혔다',
    ],
    titleTails: [
      '친구한테 인기없는 놈이야',
      '학창시절 추억이라고는 선생님하고 면담한 것 밖에 없는 놈이야',
      '웃어본 적이 없어서 입 주변 근육이 괴사한 놈이야',
      '주목 받는 상황이 되면 도망가버리는 놈이야',
      '군대가면 이쁨 많이 받아야 될 놈이야',
      '브이도 못 할거면 사진도 찍지 말아야 할 놈이야',
      '카메라가 진짜 자기 영혼을 가져간다고 믿는 놈이야',
      '이름만 물어봤는데 집 비밀번호까지 다 알려줄 놈이야',
      '졸업사진 찍는 날에 학교 안 갈 놈이야',
      '아무도 관심 없는데 자기가 관심 받고 있다고 착각하는 놈이야',
      '단체사진에서도 눈에 띌까봐 구석에 숨는 놈이야',
      '친구들끼리 축구할 때 골보이나 하면 다행인 놈이야',
      '여사친 남친들이 안전하다고 생각할 놈이야',
      '남사친 여친들이 안전하다고 생각할 놈이야',
      '인스타도 안하고 그냥 SNS 안하고 책만 볼 놈이야',
      '발표할 때 목소리가 너무 작아서 개미가 귀에다 대고 목소리 좀 크게 내라고 할 놈이야',
      '안 웃긴 얘긴데 설명해서 더 안 웃긴 놈이야',
      '릴스나 쇼츠 이런 거 하지말고 평범하게 회사 다닐 놈이야',
      '연예인이나 뮤지컬 이런 쪽은 소질 없고 공무원 할 놈이야',
      '개성없이 살다가 임종 직전에 후회없이 살았다고 만족할 놈이야',
    ],
    punchlines: [
      '평소엔 멀쩡하다가 카메라만 켜지면 몸이 남의 것이 된다.',
      '미소 명령은 들어갔는데 출력이 꼬였다. 억지웃음이 제일 먼저 들킨다.',
      '자연스럽게 서 있으라는 말이 제일 어렵다. 사진 속에서 대기번호 부르는 중이다.',
      '포즈보다 당황이 먼저 찍혔다. 셔터 소리와 동시에 재촬영이 떠오른다.',
    ],
  },
  effortless_but_calculated: {
    category: 'general_solo',
    titlePrefix: '넌 딱',
    photoTypes: ['solo', 'selfie', 'daily', 'profile'],
    visualTriggers: [],
    tone: 'roast',
    scoreLabels: ['대충 위장력', '계산된 자연스러움', '반박 불가율'],
    reasons: [
      '대충 나온 척하지만 컷 선택은 엄격하다',
      '자연스러움 뒤에 계산이 깔려 있다',
      '힘 안 준 척하는 데 힘을 다 썼다',
    ],
    titleTails: [
      '대충 나온 척하는데 ㅈㄴ 꾸민 놈이야',
      '아무렇게나 사진 찍는 척 하지만 ㅈㄴ 의식하는 놈이야',
      '꾸민 티 안 내려고 ㅈㄴ 꾸민 놈이야',
      '사진 고를 때 제일 쿨게이가 되는 놈이야',
      {
        text: '꾸안꾸가 뭔지 알고 지가 잘 생긴 줄 아는 놈이야',
        presentations: ['masculine'],
      },
      '오오티디가 정확하고 사리 분별을 잘하는 놈이야',
      '낄끼빨빠에 능하고 어딜가나 이쁨 받을 놈이야',
      '군대에서 내 후임이었으면 ㅈㄴ 아꼈을 놈이야',
      {
        text: '나를 게이로 만드는 놈이야',
        presentations: ['masculine'],
      },
      {
        text: '왕사남에 단종 같은 분이야. ㅈㄴ 챙겨 주고 싶어',
        presentations: ['masculine'],
      },
      '옆에 있으면 괜히 기분 좋아지는 놈이야',
      '소개팅 들어왔을 때 프사로 바로 합격인 놈이야',
      '유튜브나 인스타그램에서 조회수 10만 거뜬히 넘길 놈이야',
      '인플루언서가 되어서 대한민국의 위상을 드높일 놈이야',
      '김구 할아버지가 문화통일을 이루고자 한 염원을 이룩할 놈이야',
      'BTS 다음으로 잘 나갈놈이야',
      '택시아저씨가 택시비 안받을 놈이야',
      '급식 아주머니께서 소시지 하나 더 줄 놈이야',
      '발렌타인 데이나 화이트 데이 때 책가방 2개 들고 가야할 놈이야',
      'BTS, 봉준호, 손흥민, Jay Park 다음에 들어갈 놈이야',
    ],
    punchlines: [
      '꾸민 티는 안 내는데 사진은 절대 막 고르지 않는다. 이런 애들이 제일 킹받게 자연스럽다.',
      '우연이라고 말하지만 구도가 너무 성실하다. 대충이 아니라 대충 연기다.',
      '힘 안 준 척하는 데 힘을 다 썼다. 자연스러움에도 계산서가 붙어 있다.',
      '아무거나 올린다면서 제일 오래 본다. 무심함이 제일 예민하다.',
    ],
  },
  outfit_showoff: {
    category: 'general_solo',
    titlePrefix: '넌 딱',
    photoTypes: ['solo', 'daily', 'full_body'],
    visualTriggers: [],
    tone: 'hard_roast',
    scoreLabels: ['착장 과시력', '전신샷 집착력', '반박 불가율'],
    reasons: [
      '약속보다 착장 기록이 먼저다',
      '전신샷 구도에 하루 목적이 다 들어 있다',
      '신발까지 보이게 찍힌 건 사고가 아니다',
    ],
    titleTails: [
      '오늘 착장 보여주려고 약속 잡을 놈이야',
      '전신샷 없으면 외출 의미 없는 놈이야',
      '신발까지 나오게 찍어달라고 할 놈이야',
      '길거리도 런웨이로 쓰는 놈이야',
      '착장 기록하려고 카페 위치 고르는 놈이야',
      '오늘 옷 때문에 약속 장소 바꿀 놈이야',
      '거울 앞에서 외출 허락받는 놈이야',
      '전신샷 찍힐 때 갑자기 진지해지는 놈이야',
      '옷 보여주려고 주머니에 손 넣는 놈이야',
      '하차감보다 착장감 따지는 놈이야',
      '옷 잘 입은 날 말수가 늘어나는 놈이야',
      '외출 전부터 사진 찍힐 벽 찾는 놈이야',
      '친구를 촬영 기사로 쓰는 놈이야',
      '패션 유튜버 하면 100만 유튜버 될 놈이야',
      '옷장 앞에서 이미 하루 승부 본 놈이야',
      '전신샷 비율에 하루 기분 걸린 놈이야',
      '인간이 되기 전에 모델이 될 놈이야',
      '옷이 주인공이고 본인은 모델인 놈이야',
      '오오티디로 밥 벌어 먹을 놈이야',
      '그냥 찍으면 되는 놈이야',
    ],
    punchlines: [
      '만남은 핑계고 진짜 목적은 전신샷이다. 사진 찍히기 전부터 신발까지 계산 끝났다.',
      '나간 이유보다 찍은 이유가 더 선명하다. 착장이 하루 목적이다.',
      '커피보다 배경이 중요하다. 좌석 선택도 사진용이다.',
      '같이 논 게 아니라 컷을 맡겼다. 친구 손에 카메라가 들리면 진지해진다.',
    ],
  },
  quiet_chic: {
    category: 'general_solo',
    titlePrefix: '넌 딱',
    photoTypes: ['solo', 'profile', 'chest_up', 'upper_body', 'daily'],
    visualTriggers: [],
    tone: 'social',
    scoreLabels: ['초면 거리감', '차분한 존재감', '반박 불가율'],
    reasons: [
      '표정 하나로 거리감 세팅이 끝났다',
      '조용한데 사진에는 묘하게 남는다',
      '친해지기 전까지는 다들 말투를 고른다',
    ],
    titleTails: [
      {
        text: '기생 오라비 처럼 생겼다는 말을 많이 들을 상이야',
        presentations: ['masculine'],
      },
      '이성한테 인기 많을 상이야',
      '인플루언서가 되면 삼성전자 부럽지 않을 상이야',
      {
        text: '자기가 잘생긴 줄 알고 그것을 잘 활용할 상이야',
        presentations: ['masculine'],
      },
      '상위 1%의 외모를 활용해서 부자될 상이야',
      '얼굴로 밥벌어 먹고 살 상이야',
      '지나가다보면 한번 쯤 뒤돌아 보게 되는 상이야',
      '남사친 여사친 무조건 있다고 할 상이야',
      '남사친 여사친이 호시탐탐 애인자리 노릴 놈이야',
      '애인이 불안해서 가만히 못 둘 상이야',
      '남사친 여사친이 자꾸 보자고 할 상이야',
      '노력보다는 외모가 부각될 상이야',
      '부모님도 흐뭇하게 바라볼 상이야',
      '영앤리치에 포르쉐타고 한강 뷰 아파트에 살 상이야',
      '나는 솔로에 나가면 무조건 다대일 데이트 할 상이야',
      '하트시그널에서 섭외전화 올 상이야',
      '환승연애에서 전여친이나 전남친이 같이 나가서 인플루언서 되자고 할 상이야',
      'SM 엔터테인먼트에서 명함 줄 상이야',
      '누가봐도 주인공이라고 인정하는 상이야',
      {
        text: '전형적인 여자들이 좋아하는 나쁜남자가 될 상이야',
        presentations: ['masculine'],
      },
    ],
    punchlines: [
      '표정 하나로 거리감 세팅 끝났다. 친해지기 전까지는 다들 괜히 말투 고른다.',
      '말은 별로 안 해도 사진에는 묘하게 남는다. 조용한 척하는 애들이 제일 오래 기억난다.',
      '소리는 작은데 존재감은 크다. 조용함으로 자리를 차지한다.',
      '다가가도 되는지 먼저 계산하게 만든다. 표정이 자동문을 잠근다.',
    ],
  },
  tryhard_funny: {
    category: 'general_solo',
    titlePrefix: '넌 딱',
    photoTypes: ['solo', 'selfie', 'daily'],
    visualTriggers: [],
    tone: 'hard_roast',
    scoreLabels: ['애씀 노출도', '개그 헛발질', '반박 불가율'],
    reasons: [
      '포즈는 큰데 웃음 포인트는 실종됐다',
      '친구들이 웃는 건 개그가 아니라 애쓰는 모습이다',
      '몸짓이 농담보다 먼저 도착했다',
    ],
    titleTails: [
      '곽범이 몰카라고 해도 안 믿고 울고 있을 상이야',
      '김원훈이 같이 유튜브 찍자고 하면 ㅈㄴ 좋아할 상이야',
      'SNL 오디션에서 광탈할 상이야',
      '혼자 유튜브 찍는다고 깨작거리다 포기할 상이야',
      '인스타그램 릴스 찍으면 돈되는 줄 알고 기웃거릴 상이야',
      '친구들이 겉으로는 웃지만 속으로는 감 ㅈㄴ없네 할 상이야',
      '군대에서 만났으면 매일 취침소등 할 상이야',
      '100프로 영포티 확정 상이야',
      '릴스나 쇼츠 조회수 100따리 상이야',
      '피식대학에서 학사경고 받을 상이야',
      '어머니께서만 좋아할 상이야',
      '서폿인데 막타 먹을 상이야',
      '누누 서폿할 상이야',
      '사회에서 만났으면 인사만 할 상이야',
      '그래도 너가 있어서 다행이다 할 상이야',
      '예비군 훈련가서 만나면 반가울 상이야',
      '소개팅에서 만났으면 커피만 마시고 싶은 상이야',
      '유튜버가 되고 싶은데 소질은 없을 상이야',
      '숏박스에서 캐릭터화 되어서 나올 상이야',
      '웃긴데 진짜 웃기긴 한데 안 웃길 상이야',
    ],
    punchlines: [
      '웃기려고 몸은 움직였는데 감각은 집에 두고 왔다. 친구들이 웃는 건 네 개그가 아니라 네가 애쓰는 모습이다.',
      '손가락은 열심히 일했는데 결과는 애매하다. 포즈가 개그를 대신 못 한다.',
      '셔터 앞에서 평범함을 못 견딘다. 뭔가 해야 한다는 강박이 보인다.',
      '조용히 찍히는 법을 모른다. 사진에서도 분량 욕심이 있다.',
    ],
  },
  id_photo_roast: {
    category: 'id_photo',
    titlePrefix: '넌 딱',
    photoTypes: ['id_photo', 'passport', 'profile'],
    visualTriggers: ['id_photo', 'passport', 'plain_background'],
    tone: 'roast',
    scoreLabels: ['행정서류력', '정면 돌파력', '반박 불가율'],
    reasons: [
      '재미 사이트에 행정서류용 사진을 들고 왔다',
      '웃음기보다 제출용 정면성이 먼저 보인다',
      '사진 한 장으로 생활기록부 냄새가 난다',
    ],
    titleTails: [
      '분위기 파악 ㅈㄴ 못하고 감 ㅈㄴ 없을 놈이야',
      '친구들이 이 ㅅㄲ 왜 불렀냐고 화낼 놈이야',
      '클럽 입구에서 택시비 받고 집에 갈 놈이야',
      '생활기록부에 평범하다고 선생님도 인정할 놈이야',
      '국가공인으로 소심하고 나서지 못하는 놈으로 인정받을 놈이야',
      '여권만들라고 찍은 사진을 여기 올린 놈이야',
      '잘 놀지도 못하면서 또 놀고는 싶은 그런 놈이야',
      '민증 사진으로 국도 끓여 먹을 놈이야',
      '소개팅 사진으로도 민증 사진 보여줄 놈이야',
      '증명사진이 인생사진이라 믿는 놈이야',
      '교무실에 가면 항상 있을 것 같을 상이야',
      '초면인데도 구면인 줄 알고 인사해야 할 것 같은 놈이야',
      '천하제일소심대회 나가면 국대로 뽑힐 놈이야',
      '친구가 하는 거 보고 재밌어 보이는 건 하고 싶은데 그것마저 제대로 못하는 놈이야',
      '여기가 잡코리아인줄 알고 있는 놈이야',
      '재미없는 인생을 살고 있지만 스스로는 만족할 상이야',
      '이런 사이트에서 조차 못 즐기는 놈이야',
      '공부도 못하고 게임도 못하고 아무것도 못하는 놈이야',
      '유행하는 건 하고 싶지만 소심하게 시도하는 놈이야',
      '식당가서 김치 더 달라고도 못 할 놈이야',
    ],
    punchlines: [
      '이런 데까지 민증사진을 올린 순간 끝났다. 유일하게 먼저 말 걸어주는 사람은 선생님뿐이다.',
      '표정부터 서류가 완비됐다. 재미를 보러 온 게 아니라 본인확인 하러 온 사람이다.',
      '공항보다 넌딱이 먼저라니 순서가 이상하다. 이건 여행 준비가 아니라 판정 사고다.',
      '재미 사이트인데 문서 냄새가 난다. 클릭보다 접수 번호가 어울린다.',
    ],
  },
  group_roast: {
    category: 'group',
    titlePrefix: '너희들은 딱',
    photoTypes: ['group'],
    visualTriggers: ['multiple_people', 'group_photo'],
    tone: 'social',
    scoreLabels: ['단톡방 온도차', '관계도 노출률', '반박 불가율'],
    reasons: [
      '단체사진인데 친밀도 온도가 다르다',
      '원래 멤버와 오늘 낀 사람이 공존한다',
      '웃고는 있는데 아직 단톡방 적응 중인 사람이 있다',
    ],
    titleTails: [
      '한 명 빼고 다 친한 놈들이야',
      '마지막에 급하게 부른 조합이야',
      '주최자만 신난 모임이야',
      '단톡방 이름 아직 못 정한 조합이야',
      '사진 찍고 바로 흩어질 놈들이야',
      '서로 태그할지 고민하는 사이야',
      '단체사진인데 리더만 둘인 조합이야',
      '친한 애들끼리 찍었는데 한 명은 업무 중이야',
      '다 같이 웃는데 이유는 다른 놈들이야',
      '약속보다 정산이 더 길 조합이야',
      '단체샷 찍으려고 친한 척한 놈들이야',
      '한 명은 아직 이름도 헷갈리는 조합이야',
      '모이면 시끄럽고 끝나면 조용한 놈들이야',
      '사진 속 거리감으로 서열 보이는 조합이야',
      '친구라기보다 프로젝트 팀 같은 놈들이야',
      '한 명만 카메라에 진심인 조합이야',
      '다 같이 왔는데 각자 온 것 같은 놈들이야',
      '단체사진 찍을 때만 팀워크 생기는 놈들이야',
      '사진 올리고 단톡방 싸움 날 조합이야',
      '재밌는 척 하고 있지만 집에 갈 타이밍만 보는 조합이야',
    ],
    punchlines: [
      '단체사진인데 친밀도 온도가 한 명만 다르다. 누군지는 말 안 해도 본인이 제일 잘 안다.',
      '모인 이유보다 사진 찍은 이유가 더 수상하다. 친목이 아니라 출석 인증이다.',
      '사진은 단체인데 에너지는 혼자 독점했다. 나머지는 관계 유지비 내는 중이다.',
      '사진은 찍었는데 설명이 어렵다. 관계를 한 줄로 정리하지 못한다.',
    ],
  },
  non_human_roast: {
    category: 'non_human',
    titlePrefix: '넌 딱',
    photoTypes: ['non_human', 'object', 'landscape', 'food', 'pet', 'unknown'],
    visualTriggers: [
      'no_person_detected',
      'object_only',
      'landscape_only',
      'food_only',
      'pet_only',
    ],
    tone: 'hard_roast',
    scoreLabels: ['사용법 무시력', '맥락 실종률', '반박 불가율'],
    reasons: [
      '사람 판정 받는 사이트에 사람 아닌 걸 올렸다',
      '사진 올리는 곳에서도 기본 룰을 못 읽었다',
      '사람을 올리랬더니 사물로 승부를 봤다',
    ],
    titleTails: [
      '사회에 부적응해서 이런 사이트에서도 어떻게 해야 할지 모를 놈이야',
      '사람 사진 올리라는 말도 이해 못 한 놈이야',
      '입장하자마자 출구로 나갈 놈이야',
      '안내문 세 줄 읽고도 직원 부를 놈이야',
      '튜토리얼 스킵하고 바로 망할 놈이야',
      '사람 판정 사이트에 풍경으로 승부 본 놈이야',
      '음식 사진으로 인생 판정 받으려는 놈이야',
      '반려동물한테 결과 떠넘긴 놈이야',
      '사물 사진으로 자아를 숨긴 놈이야',
      '자신감없고 자존감도 없고 자존심도 없는 놈이야',
      '사진첩에 셀카도 없는 불쌍한 놈이야',
      '컴퓨터 배경화면이 그냥 검은색인 놈이야',
      '고양이 뒤에 숨으려다 들킨 놈이야',
      '차만 올리고 본인은 도망간 놈이야',
      '오토바이만 올려놓고 분위기 맡긴 놈이야',
      '물건으로 자기소개하는 놈이야',
      '사용법보다 장난이 먼저인 놈이야',
      '사진 선택부터 다른 길로 샌 놈이야',
      '친구들 사이에서 눈치 ㅈㄴ없을 상이야',
      '아유~ 그냥 말을 말자. ㄲㅈ',
    ],
    punchlines: [
      '사람 판정 받는 사이트에 사람 아닌 걸 올린 순간 끝났다. 설명서를 줘도 딴 버튼 누를 놈이다.',
      '이 사이트에서조차 맥락을 못 잡으면 일상생활은 이미 난이도 지옥이다.',
      '사진보다 선택이 더 크게 찍혔다. 문제는 대상이 아니라 업로드한 손가락이다.',
      '무슨 결과가 나오든 첫 단추가 틀렸다. 사람 없는 사진은 변명의 여지가 없다.',
    ],
  },
} satisfies Record<ResultCluster, ClusterConfig>;

function buildClusterArchetypes(cluster: ResultCluster) {
  const config = CLUSTER_CONFIGS[cluster];

  return config.titleTails.map(
    (titleTail, index): ResultArchetype => {
      const titleText =
        typeof titleTail === 'string' ? titleTail : titleTail.text;
      const presentations =
        typeof titleTail === 'string' ? undefined : titleTail.presentations;

      return {
        id: `${cluster}-${String(index + 1).padStart(2, '0')}`,
        title: `${config.titlePrefix} ${titleText}`,
        punchline: config.punchlines[index % config.punchlines.length],
        reasons: [...config.reasons],
        scores: [
          { label: config.scoreLabels[0], value: 92 + ((index * 3) % 7) },
          { label: config.scoreLabels[1], value: 84 + ((index * 5) % 10) },
          { label: config.scoreLabels[2], value: 6 + ((index * 4) % 23) },
        ],
        category: config.category,
        photoTypes: [...config.photoTypes],
        visualTriggers: [...config.visualTriggers],
        tone: config.tone,
        cluster,
        presentations,
        selectionHints: [`${cluster} cluster 전용`],
        match: CLUSTER_MATCHES[cluster],
      };
    }
  );
}

const GENERATED_CLUSTER_ARCHETYPES = (
  Object.keys(CLUSTER_CONFIGS) as ResultCluster[]
).flatMap((cluster) => buildClusterArchetypes(cluster));

export const RESULT_ARCHETYPES = [
  ...GENERATED_CLUSTER_ARCHETYPES,
  {
    id: 'non-human-site-misfit',
    title:
      '넌 딱 사회에 부적응해서 이런 사이트에서도 어떻게 해야 할지 모를 놈이야',
    punchline:
      '사람 판정 받는 사이트에 사람 아닌 걸 올린 순간 끝났다. 설명서를 줘도 딴 버튼 누를 놈이다.',
    reasons: [
      '사진 올리는 곳에서도 기본 룰을 못 읽었다',
      '사람을 올리랬더니 사물로 승부를 봤다',
      '이 정도면 장난이 아니라 사용법 부적응이다',
    ],
    scores: [
      { label: '사회 부적응력', value: 96 },
      { label: '사용법 무시력', value: 93 },
      { label: '딴 버튼 누를 확률', value: 91 },
      { label: '반박 불가율', value: 4 },
    ],
    category: 'non_human',
    photoTypes: ['non_human', 'object', 'landscape', 'food', 'pet', 'unknown'],
    visualTriggers: [
      'no_person_detected',
      'object_only',
      'landscape_only',
      'food_only',
      'pet_only',
    ],
    tone: 'hard_roast',
  },
  {
    id: 'non-human-cant-read-context',
    title: '넌 딱 사람 사진 올리라는 말도 이해 못 한 놈이야',
    punchline:
      '이 사이트에서조차 맥락을 못 잡으면 일상생활은 이미 난이도 지옥이다.',
    reasons: [
      '사람 판정판에 사물 사진을 밀어 넣었다',
      '업로드 버튼만 보고 목적은 놓쳤다',
      '맥락 파악보다 손가락이 먼저 움직였다',
    ],
    scores: [
      { label: '맥락 실종률', value: 95 },
      { label: '업로드 급발진', value: 88 },
      { label: '반박 불가율', value: 6 },
    ],
    category: 'non_human',
    photoTypes: ['non_human', 'object', 'landscape', 'food', 'pet', 'unknown'],
    visualTriggers: [
      'no_person_detected',
      'object_only',
      'landscape_only',
      'food_only',
      'pet_only',
    ],
    tone: 'hard_roast',
  },
  {
    id: 'non-human-exit-first',
    title: '넌 딱 입장하자마자 출구로 나갈 놈이야',
    punchline: '어디서 뭘 해야 하는지 모르는 재능이 사진 한 장에 다 나왔다.',
    reasons: [
      '서비스 입구에서 방향 감각을 잃었다',
      '첫 단계부터 목적지를 반대로 잡았다',
      '사람 사진 사이트에서 사람을 빼먹었다',
    ],
    scores: [
      { label: '방향 상실력', value: 92 },
      { label: '첫 단계 탈선율', value: 89 },
      { label: '반박 불가율', value: 8 },
    ],
    category: 'non_human',
    photoTypes: ['non_human', 'object', 'landscape', 'food', 'pet', 'unknown'],
    visualTriggers: [
      'no_person_detected',
      'object_only',
      'landscape_only',
      'food_only',
      'pet_only',
    ],
    tone: 'roast',
  },
  {
    id: 'non-human-call-staff',
    title: '넌 딱 안내문 세 줄 읽고도 직원 부를 놈이야',
    punchline:
      '사람 판정 서비스에 사물 사진을 올린 순간, 고객센터가 먼저 떠오른다.',
    reasons: [
      '설명보다 도움 요청이 빠른 타입이다',
      '사람 사진이라는 조건을 정면으로 지나쳤다',
      '직원도 어디서부터 설명할지 막히게 만든다',
    ],
    scores: [
      { label: '고객센터 소환력', value: 94 },
      { label: '안내문 회피력', value: 90 },
      { label: '반박 불가율', value: 7 },
    ],
    category: 'non_human',
    photoTypes: ['non_human', 'object', 'landscape', 'food', 'pet', 'unknown'],
    visualTriggers: [
      'no_person_detected',
      'object_only',
      'landscape_only',
      'food_only',
      'pet_only',
    ],
    tone: 'roast',
  },
  {
    id: 'non-human-skip-tutorial',
    title: '넌 딱 튜토리얼 스킵하고 바로 망할 놈이야',
    punchline: '기본 설명도 못 버티는 집중력으로 여기까지 온 게 기적이다.',
    reasons: [
      '처음부터 규칙을 스킵하고 결과만 요구했다',
      '튜토리얼을 넘긴 대가가 사진 한 장에 찍혔다',
      '기본 입력값부터 틀리는 재능이 있다',
    ],
    scores: [
      { label: '튜토리얼 스킵력', value: 97 },
      { label: '기본값 붕괴율', value: 91 },
      { label: '반박 불가율', value: 5 },
    ],
    category: 'non_human',
    photoTypes: ['non_human', 'object', 'landscape', 'food', 'pet', 'unknown'],
    visualTriggers: [
      'no_person_detected',
      'object_only',
      'landscape_only',
      'food_only',
      'pet_only',
    ],
    tone: 'hard_roast',
  },
  {
    id: 'id-photo-front-seat',
    title: '넌 딱 교탁 바로 앞자리 고정 상이야',
    punchline:
      '이런 데까지 민증사진을 올린 순간 끝났다. 유일하게 먼저 말 걸어주는 사람은 선생님뿐이다.',
    reasons: [
      '재미 사이트에 행정서류용 사진을 들고 왔다',
      '친구들이 말리기도 전에 혼자 제출 버튼 눌렀다',
      '사진 한 장으로 생활기록부 냄새가 난다',
    ],
    scores: [
      { label: '감 없는 자신감', value: 94 },
      { label: '선생님 친화력', value: 88 },
      { label: '반박 불가율', value: 7 },
    ],
    category: 'id_photo',
    photoTypes: ['id_photo', 'passport', 'profile'],
    visualTriggers: ['id_photo', 'passport', 'plain_background'],
    tone: 'roast',
  },
  {
    id: 'id-photo-civil-service',
    title: '넌 딱 주민센터 번호표 뽑고 기다릴 상이야',
    punchline:
      '표정부터 서류가 완비됐다. 재미를 보러 온 게 아니라 본인확인 하러 온 사람이다.',
    reasons: [
      '사진에서 민원창구 조명이 난다',
      '웃음기보다 제출용 정면성이 먼저 보인다',
      '친구가 놀리기도 전에 증명사진 규격이 이겼다',
    ],
    scores: [
      { label: '행정력', value: 89 },
      { label: '정면 돌파력', value: 84 },
      { label: '반박 불가율', value: 12 },
    ],
    category: 'id_photo',
    photoTypes: ['id_photo', 'passport', 'profile'],
    visualTriggers: ['id_photo', 'passport', 'plain_background'],
    tone: 'absurd',
  },
  {
    id: 'id-photo-club-fail',
    title: '넌 딱 클럽 입구에서 신분증 검사만 세 번 받을 상이야',
    punchline:
      '놀 준비는 했는데 사진이 너무 공문서다. 분위기보다 본인확인이 먼저 끝난다.',
    reasons: [
      '얼굴보다 증명사진 느낌이 먼저 입장한다',
      '흥보다 신분확인이 더 강하다',
      '사진 한 장으로 보안요원 집중력이 올라간다',
    ],
    scores: [
      { label: '본인확인력', value: 93 },
      { label: '입구 정체력', value: 82 },
      { label: '반박 불가율', value: 10 },
    ],
    category: 'id_photo',
    photoTypes: ['id_photo', 'passport', 'profile'],
    visualTriggers: ['id_photo', 'passport', 'plain_background'],
    tone: 'roast',
  },
  {
    id: 'group-one-outsider',
    title: '너희들은 딱 한 명 빼고 다 친한 놈들이야',
    punchline:
      '단체사진인데 친밀도 온도가 한 명만 다르다. 누군지는 말 안 해도 본인이 제일 잘 안다.',
    reasons: [
      '다 같이 찍었는데 한 명만 초대 경로가 다르다',
      '원래 멤버와 오늘 낀 애가 공존한다',
      '웃고는 있는데 아직 단톡방 적응 중인 사람 있다',
    ],
    scores: [
      { label: '단톡방 온도차', value: 91 },
      { label: '어색한 한 명 존재감', value: 87 },
      { label: '반박 불가율', value: 13 },
    ],
    category: 'group',
    photoTypes: ['group'],
    visualTriggers: ['multiple_people', 'group_photo'],
    tone: 'social',
  },
  {
    id: 'group-last-minute-invite',
    title: '너희들은 딱 마지막에 급하게 부른 조합이야',
    punchline:
      '모인 이유보다 사진 찍은 이유가 더 수상하다. 친목이 아니라 출석 인증이다.',
    reasons: [
      '포즈 통일 전에 셔터가 먼저 눌렸다',
      '한 명쯤은 약속 장소를 방금 이해했다',
      '사진 속 거리감이 회의실 좌석 배치다',
    ],
    scores: [
      { label: '급조된 단합력', value: 88 },
      { label: '눈치 보는 속도', value: 77 },
      { label: '반박 불가율', value: 19 },
    ],
    category: 'group',
    photoTypes: ['group'],
    visualTriggers: ['multiple_people', 'group_photo'],
    tone: 'social',
  },
  {
    id: 'group-leader-only-happy',
    title: '너희들은 딱 주최자만 신난 모임이야',
    punchline:
      '사진은 단체인데 에너지는 혼자 독점했다. 나머지는 관계 유지비 내는 중이다.',
    reasons: [
      '웃음의 농도가 사람마다 다르다',
      '한 명은 추억 만들고 나머지는 일정 소화 중이다',
      '단체사진인데 회비 정산 공기가 난다',
    ],
    scores: [
      { label: '주최자 텐션', value: 92 },
      { label: '단체 순응력', value: 79 },
      { label: '반박 불가율', value: 15 },
    ],
    category: 'group',
    photoTypes: ['group'],
    visualTriggers: ['multiple_people', 'group_photo'],
    tone: 'roast',
  },
  {
    id: 'motorcycle-delivery-3000',
    title: '넌 딱 건당 3,000원 받을 상이야',
    punchline:
      '헬멧 쓰기 전부터 이미 배차 잡힌 얼굴이다. 사진 찍을 시간에 다음 픽업지 확인하고 있을 놈이다.',
    reasons: [
      '오토바이 하나로 분위기가 바로 배달대행 사무실 됐다',
      '놀러 나온 게 아니라 콜 대기 중이다',
      '신호보다 배달 예상 시간이 먼저 보인다',
    ],
    scores: [
      { label: '배차 대기력', value: 96 },
      { label: '콜 잡는 속도', value: 89 },
      { label: '반박 불가율', value: 8 },
    ],
    category: 'motorcycle',
    photoTypes: ['solo', 'daily', 'unknown'],
    visualTriggers: ['motorcycle', 'helmet', 'scooter'],
    tone: 'hard_roast',
  },
  {
    id: 'motorcycle-signal-main-character',
    title: '넌 딱 빨간불에도 혼자 출발각 재는 상이야',
    punchline:
      '멈춰 있는 사진인데 마음은 이미 차선 사이를 지나갔다. 안전보다 타이밍 계산이 먼저다.',
    reasons: [
      '오토바이 옆에서만 서도 성격이 급해진다',
      '사진에서 방향지시등보다 조급함이 먼저 보인다',
      '쉬러 나온 게 아니라 대기 중인 기운이다',
    ],
    scores: [
      { label: '출발각 계산력', value: 90 },
      { label: '차선 눈치력', value: 86 },
      { label: '반박 불가율', value: 14 },
    ],
    category: 'motorcycle',
    photoTypes: ['solo', 'daily', 'unknown'],
    visualTriggers: ['motorcycle', 'helmet', 'scooter'],
    tone: 'roast',
  },
  {
    id: 'motorcycle-parking-lot-ceo',
    title: '넌 딱 주차장에서 사무실 차린 상이야',
    punchline:
      '오토바이 한 대 세워놨을 뿐인데 주변이 바로 현장 본부가 됐다. 통화는 짧고 계좌는 빠르다.',
    reasons: [
      '배경보다 오토바이 존재감이 더 크다',
      '사진에서 정산 끝난 사람의 피곤함이 난다',
      '가방 없어도 수금 가방이 상상된다',
    ],
    scores: [
      { label: '현장 본부력', value: 87 },
      { label: '정산 민첩성', value: 81 },
      { label: '반박 불가율', value: 16 },
    ],
    category: 'motorcycle',
    photoTypes: ['solo', 'daily', 'unknown'],
    visualTriggers: ['motorcycle', 'helmet', 'scooter'],
    tone: 'absurd',
  },
  {
    id: 'luxury-car-installment-hostage',
    title: '넌 딱 월에 300만 원씩 꼬박꼬박 나갈 놈이야',
    punchline:
      '사진은 성공한 사람처럼 찍었는데, 통장은 이미 할부에 인질 잡혔다.',
    reasons: [
      '차 앞에서는 성공했는데 카드값 앞에서는 조용해진다',
      '드림카가 아니라 자동이체다',
      '차키는 보여주는데 잔고는 숨길 놈이다',
    ],
    scores: [
      { label: '할부 인질력', value: 95 },
      { label: '차키 자랑력', value: 90 },
      { label: '반박 불가율', value: 9 },
    ],
    category: 'luxury_car',
    photoTypes: ['solo', 'daily', 'unknown'],
    visualTriggers: ['luxury_car', 'sports_car', 'car_key'],
    tone: 'hard_roast',
  },
  {
    id: 'luxury-car-showroom-resident',
    title: '넌 딱 전시장 직원보다 차 설명 길게 할 상이야',
    punchline:
      '한 번 물어보면 옵션표가 입에서 나온다. 타기 전에 이미 영업사원 퇴근시킨다.',
    reasons: [
      '차 앞에서 갑자기 말수가 늘어날 조합이다',
      '연비보다 하차감 설명을 먼저 한다',
      '사진 한 장에 옵션 패키지 냄새가 난다',
    ],
    scores: [
      { label: '옵션 설명력', value: 92 },
      { label: '하차감 집착력', value: 88 },
      { label: '반박 불가율', value: 18 },
    ],
    category: 'luxury_car',
    photoTypes: ['solo', 'daily', 'unknown'],
    visualTriggers: ['luxury_car', 'sports_car', 'car_key'],
    tone: 'roast',
  },
  {
    id: 'luxury-car-valet-confusion',
    title: '넌 딱 발렛 맡기고 직원이랑 같이 긴장할 상이야',
    punchline:
      '차는 비싼데 마음은 대중교통이다. 문콕 하나에 하루 컨디션이 날아간다.',
    reasons: [
      '사진 속 여유보다 보험료가 먼저 보인다',
      '차 옆에서는 웃지만 주차장에서는 숨을 참는다',
      '성공 인증인데 유지비가 더 크게 찍혔다',
    ],
    scores: [
      { label: '문콕 경계력', value: 94 },
      { label: '유지비 공포', value: 90 },
      { label: '반박 불가율', value: 20 },
    ],
    category: 'luxury_car',
    photoTypes: ['solo', 'daily', 'unknown'],
    visualTriggers: ['luxury_car', 'sports_car', 'car_key'],
    tone: 'absurd',
  },
  {
    id: 'tattoo-body-backup',
    title:
      '너희들은 딱 인생관을 머리에 저장할 메모리도 부족해서 몸에 백업한 놈들이야',
    punchline:
      '철학이 깊은 게 아니라 저장 위치가 이상한 거다. 피부에 새기기 전에 생각을 한 번 더 했어야 했다.',
    reasons: [
      '타투 하나하나 뜻 있는 척할 가능성 높다',
      '몸에 여백 보이면 바로 업데이트할 조합이다',
      '말로 설명 못 해서 피부에 저장했다',
    ],
    scores: [
      { label: '피부 백업률', value: 97 },
      { label: '인생관 과부하', value: 91 },
      { label: '반박 불가율', value: 6 },
    ],
    category: 'tattoo',
    photoTypes: ['solo', 'group', 'daily', 'unknown'],
    visualTriggers: ['tattoo', 'visible_tattoo'],
    tone: 'hard_roast',
  },
  {
    id: 'tattoo-meaning-presentation',
    title: '넌 딱 타투 뜻 설명하다가 술자리 끝낼 상이야',
    punchline:
      '물어본 건 한 줄인데 대답은 발표자료다. 의미가 깊은 게 아니라 설명이 길다.',
    reasons: [
      '작은 문양에도 서사가 과하다',
      '친구들이 질문한 척하고 바로 후회한다',
      '피부보다 설명 시간이 더 진하다',
    ],
    scores: [
      { label: '뜻 설명력', value: 93 },
      { label: '술자리 정적률', value: 85 },
      { label: '반박 불가율', value: 11 },
    ],
    category: 'tattoo',
    photoTypes: ['solo', 'group', 'daily', 'unknown'],
    visualTriggers: ['tattoo', 'visible_tattoo'],
    tone: 'roast',
  },
  {
    id: 'tattoo-update-required',
    title: '넌 딱 몸에 공지사항 업데이트하는 상이야',
    punchline:
      '생각이 바뀌면 메모장에 적는 게 아니라 피부에 패치한다. 버전 관리가 너무 무겁다.',
    reasons: [
      '빈 공간을 보면 그냥 못 지나간다',
      '인생 이벤트마다 추가 패치가 들어간다',
      '타투샵을 미용실처럼 예약할 기운이다',
    ],
    scores: [
      { label: '피부 업데이트율', value: 90 },
      { label: '공지사항 감성', value: 82 },
      { label: '반박 불가율', value: 17 },
    ],
    category: 'tattoo',
    photoTypes: ['solo', 'group', 'daily', 'unknown'],
    visualTriggers: ['tattoo', 'visible_tattoo'],
    tone: 'absurd',
  },
  {
    id: 'hanbok-new-year-money',
    title: '넌 딱 명절에 세뱃돈 받을 나이 지났는데 아직 기대할 놈이야',
    punchline:
      '한복 입은 순간 어른스러운 척은 하는데, 속으로는 봉투 두께 계산 끝났다.',
    reasons: [
      '예의는 차렸는데 목적은 너무 선명하다',
      '덕담보다 봉투가 먼저다',
      '어른들 앞에서는 조용한데 방 들어가면 바로 폰 볼 놈이다',
    ],
    scores: [
      { label: '세뱃돈 기대력', value: 92 },
      { label: '명절 연기력', value: 86 },
      { label: '반박 불가율', value: 11 },
    ],
    category: 'hanbok',
    photoTypes: ['solo', 'group', 'daily', 'unknown'],
    visualTriggers: ['hanbok', 'traditional_korean_clothes'],
    tone: 'roast',
  },
  {
    id: 'hanbok-family-group-chat',
    title: '넌 딱 가족 단톡방 대표사진으로 박제될 상이야',
    punchline:
      '한복 입은 순간 개인의 삶은 끝났다. 친척들이 저장할 사진이 이미 완성됐다.',
    reasons: [
      '사진에서 어른들 만족도가 먼저 터진다',
      '본인은 장난인데 가족은 프사 후보로 본다',
      '명절 끝나도 단톡방에서 계속 살아남을 상이다',
    ],
    scores: [
      { label: '가족 박제력', value: 94 },
      { label: '친척 만족도', value: 87 },
      { label: '반박 불가율', value: 18 },
    ],
    category: 'hanbok',
    photoTypes: ['solo', 'group', 'daily', 'unknown'],
    visualTriggers: ['hanbok', 'traditional_korean_clothes'],
    tone: 'social',
  },
  {
    id: 'hanbok-bowing-calculator',
    title: '넌 딱 절 한 번에 기대수익 계산 끝낼 상이야',
    punchline:
      '공손함은 자세에서 나오고 계산은 눈빛에서 나온다. 덕담보다 봉투 각도가 중요하다.',
    reasons: [
      '한복 주름보다 계산이 더 또렷하다',
      '예절은 완벽한데 목적지가 지갑이다',
      '어른들 순서까지 수익표로 정리할 기운이다',
    ],
    scores: [
      { label: '절값 계산력', value: 91 },
      { label: '공손한 속셈', value: 84 },
      { label: '반박 불가율', value: 16 },
    ],
    category: 'hanbok',
    photoTypes: ['solo', 'group', 'daily', 'unknown'],
    visualTriggers: ['hanbok', 'traditional_korean_clothes'],
    tone: 'absurd',
  },
  {
    id: 'kimono-colonial-rich',
    title: '넌 딱 일제시대에 태어났으면 부귀영화 누렸을 놈이야',
    punchline:
      '옷 하나 입었는데 시대 배경이 바로 바뀌었다. 사진에서부터 독립운동가랑은 말 섞기 어려운 기운이 난다.',
    reasons: [
      '기모노 입은 순간 국사 시간 분위기가 싸해졌다',
      '관광 사진인데 역사 선생님 표정이 굳는다',
      '광복절에는 조용히 있어야 할 상이다',
    ],
    scores: [
      { label: '시대착오력', value: 96 },
      { label: '역사 선생님 긴장도', value: 91 },
      { label: '반박 불가율', value: 4 },
    ],
    category: 'kimono',
    photoTypes: ['solo', 'group', 'daily', 'unknown'],
    visualTriggers: ['kimono', 'yukata', 'traditional_japanese_clothes'],
    tone: 'hard_roast',
  },
  {
    id: 'kimono-field-trip-warning',
    title: '넌 딱 수학여행 사진이 역사 수행평가로 번질 상이야',
    punchline:
      '관광 인증하려다 교무실 공기가 무거워졌다. 사진 한 장으로 토론 주제가 생겼다.',
    reasons: [
      '예쁘게 찍으려다 역사 선생님 레이더에 걸린다',
      '배경보다 복장 해명이 더 길어진다',
      '친구들이 웃다가 날짜를 확인한다',
    ],
    scores: [
      { label: '수행평가 소환력', value: 89 },
      { label: '해명 길이', value: 83 },
      { label: '반박 불가율', value: 12 },
    ],
    category: 'kimono',
    photoTypes: ['solo', 'group', 'daily', 'unknown'],
    visualTriggers: ['kimono', 'yukata', 'traditional_japanese_clothes'],
    tone: 'roast',
  },
  {
    id: 'kimono-tourist-overheat',
    title: '넌 딱 관광지에서 컨셉 잡다가 국사책 펼칠 상이야',
    punchline:
      '사진은 여행인데 분위기는 바로 시험 범위다. 추억 만들려다 해설이 붙었다.',
    reasons: [
      '옷 하나로 댓글창이 바빠질 기운이다',
      '관광 코스보다 역사 맥락이 먼저 따라온다',
      '친구들이 태그하기 전에 고민한다',
    ],
    scores: [
      { label: '컨셉 과열', value: 86 },
      { label: '댓글창 긴장도', value: 80 },
      { label: '반박 불가율', value: 14 },
    ],
    category: 'kimono',
    photoTypes: ['solo', 'group', 'daily', 'unknown'],
    visualTriggers: ['kimono', 'yukata', 'traditional_japanese_clothes'],
    tone: 'absurd',
  },
  {
    id: 'solo-pretending-candid',
    title: '넌 딱 안 찍히는 척하면서 제일 잘 나온 놈이야',
    punchline:
      '카메라 안 보는 척하는데 각도는 이미 계산 끝났다. 우연인 척하는 사진이 제일 무섭다.',
    reasons: [
      '시선은 딴 데 있는데 사진 의식은 정중앙이다',
      '자연스러움에도 리허설 냄새가 난다',
      '안 찍히는 척하는 사람이 제일 오래 고른 컷이다',
    ],
    scores: [
      { label: '우연 위장력', value: 94 },
      { label: '각도 계산력', value: 88 },
      { label: '반박 불가율', value: 18 },
    ],
    category: 'general_solo',
    photoTypes: ['solo', 'daily', 'profile'],
    visualTriggers: [],
    tone: 'roast',
    selectionHints: [
      'gaze가 looking_away 또는 pretending_not_to_look',
      'pose가 natural 또는 posed',
      'photoMood에 effortless 또는 calm 포함',
      'framing이 full_body가 아님',
    ],
    match: {
      gaze: ['looking_away', 'pretending_not_to_look'],
      pose: ['natural', 'posed'],
      framing: ['face_close_up', 'chest_up', 'upper_body', 'selfie'],
      photoMood: ['effortless', 'calm'],
      excludedFraming: ['full_body'],
    },
  },
  {
    id: 'solo-profile-reaction-checker',
    title: '넌 딱 프사 바꾸면 누가 봤는지 확인할 놈이야',
    punchline:
      '올리는 순간부터 반응 체크 들어간다. 관심 없는 척하지만 조회수는 누구보다 빠르게 본다.',
    reasons: [
      '정면 컷에 반응 수집 의지가 박혀 있다',
      '프사 바꾸고 조용한 척할 준비까지 끝났다',
      '누가 봤는지 확인하는 속도가 알림보다 빠르다',
    ],
    scores: [
      { label: '반응 체크력', value: 95 },
      { label: '프사 교체각', value: 90 },
      { label: '반박 불가율', value: 16 },
    ],
    category: 'general_solo',
    photoTypes: ['selfie', 'profile', 'close_up', 'chest_up'],
    visualTriggers: [],
    tone: 'social',
    cluster: 'self_confident_profile',
    selectionHints: [
      'framing이 face_close_up, chest_up, selfie 계열',
      'gaze가 looking_at_camera',
      'expression이 natural_smile, neutral, playful 중 하나',
      'photoType이 selfie 또는 profile',
      '프사감, 자기확신, 자기애 분위기',
    ],
    match: SELF_CONFIDENT_PROFILE_MATCH,
  },
  {
    id: 'solo-self-confident-handsome',
    title: '넌 딱 네가 잘생긴 줄 아는 놈이야',
    punchline:
      '사진 한 장에 자기확신이 너무 많이 들어갔다. 얼굴보다 확신이 먼저 업로드됐다.',
    reasons: [
      '카메라 보는 순간 본인 확신이 켜졌다',
      '잘 나온 컷을 고르는 기준이 너무 단호하다',
      '프사감이라는 생각을 숨길 마음이 없다',
    ],
    scores: [
      { label: '자기확신력', value: 95 },
      { label: '프사감 집착도', value: 89 },
      { label: '반박 불가율', value: 13 },
    ],
    category: 'general_solo',
    photoTypes: ['selfie', 'profile', 'close_up', 'chest_up'],
    visualTriggers: [],
    tone: 'roast',
    cluster: 'self_confident_profile',
    selectionHints: ['self_confident_profile cluster 전용'],
    match: SELF_CONFIDENT_PROFILE_MATCH,
  },
  {
    id: 'solo-self-confident-pretty',
    title: '넌 딱 네가 예쁜 줄 아는 애야',
    punchline:
      '사진을 고른 손가락부터 자신감이 넘친다. 업로드 전에 이미 본인 마음속에서 합격 처리됐다.',
    reasons: [
      '프사 후보를 보는 눈이 너무 진지하다',
      '본인 컷에 대한 기준이 높고 확신도 높다',
      '사진 한 장으로 기분 관리가 끝난다',
    ],
    scores: [
      { label: '프사 확신력', value: 94 },
      { label: '자기애 농도', value: 90 },
      { label: '반박 불가율', value: 12 },
    ],
    category: 'general_solo',
    photoTypes: ['selfie', 'profile', 'close_up', 'chest_up'],
    visualTriggers: [],
    tone: 'roast',
    cluster: 'self_confident_profile',
    selectionHints: ['self_confident_profile cluster 전용'],
    match: SELF_CONFIDENT_PROFILE_MATCH,
  },
  {
    id: 'solo-self-confident-own-handsome',
    title: '넌 딱 스스로가 봐도 잘생긴 놈이야',
    punchline:
      '남의 인정까지 기다릴 필요가 없다. 본인이 이미 심사위원이고 합격자다.',
    reasons: [
      '사진을 보는 눈빛에 자체 심사가 끝났다',
      '친구 반응보다 본인 만족이 먼저다',
      '카메라 앞에서 자존감이 바로 출근한다',
    ],
    scores: [
      { label: '자체 합격률', value: 96 },
      { label: '자존감 점등률', value: 91 },
      { label: '반박 불가율', value: 14 },
    ],
    category: 'general_solo',
    photoTypes: ['selfie', 'profile', 'close_up', 'chest_up'],
    visualTriggers: [],
    tone: 'social',
    cluster: 'self_confident_profile',
    selectionHints: ['self_confident_profile cluster 전용'],
    match: SELF_CONFIDENT_PROFILE_MATCH,
  },
  {
    id: 'solo-self-confident-own-pretty',
    title: '넌 딱 스스로도 예쁜 줄 아는 애야',
    punchline:
      '확인은 거울이 아니라 업로드 버튼으로 한다. 본인 마음속 반응은 이미 만장일치다.',
    reasons: [
      '사진 선택에 망설임보다 확신이 많다',
      '본인 기준에서 이미 프사 심사가 끝났다',
      '자기 만족도가 먼저 댓글을 단다',
    ],
    scores: [
      { label: '만장일치 자기애', value: 94 },
      { label: '프사 심사력', value: 88 },
      { label: '반박 불가율', value: 13 },
    ],
    category: 'general_solo',
    photoTypes: ['selfie', 'profile', 'close_up', 'chest_up'],
    visualTriggers: [],
    tone: 'social',
    cluster: 'self_confident_profile',
    selectionHints: ['self_confident_profile cluster 전용'],
    match: SELF_CONFIDENT_PROFILE_MATCH,
  },
  {
    id: 'solo-self-confident-only-confidence',
    title: '넌 딱 자신감 하나로 여기까지 온 놈이야',
    punchline:
      '근거보다 태도가 먼저 도착했다. 사진 한 장에서도 자기확신이 길을 뚫는다.',
    reasons: [
      '카메라 앞에서 기세가 먼저 선다',
      '확신이 사진 전체를 밀고 간다',
      '본인 분위기를 의심할 생각이 없다',
    ],
    scores: [
      { label: '근거 없는 기세', value: 92 },
      { label: '자기확신 지속력', value: 95 },
      { label: '반박 불가율', value: 18 },
    ],
    category: 'general_solo',
    photoTypes: ['selfie', 'profile', 'close_up', 'chest_up'],
    visualTriggers: [],
    tone: 'absurd',
    cluster: 'self_confident_profile',
    selectionHints: ['self_confident_profile cluster 전용'],
    match: SELF_CONFIDENT_PROFILE_MATCH,
  },
  {
    id: 'solo-self-confident-winning',
    title: '넌 딱 앞으로도 승승장구할 놈이야',
    punchline:
      '근거는 몰라도 본인만의 상승장은 이미 열렸다. 사진에서부터 운 좋은 척이 아니라 확신이 난다.',
    reasons: [
      '표정에 자기 서사가 이미 쓰여 있다',
      '사진 한 장으로 앞날까지 긍정 처리한다',
      '본인 흐름을 너무 믿고 있다',
    ],
    scores: [
      { label: '승승장구 자기암시', value: 91 },
      { label: '긍정 과잉률', value: 86 },
      { label: '반박 불가율', value: 17 },
    ],
    category: 'general_solo',
    photoTypes: ['selfie', 'profile', 'close_up', 'chest_up'],
    visualTriggers: [],
    tone: 'social',
    cluster: 'self_confident_profile',
    selectionHints: ['self_confident_profile cluster 전용'],
    match: SELF_CONFIDENT_PROFILE_MATCH,
  },
  {
    id: 'solo-self-confident-main-character',
    title: '넌 딱 세상의 주인공이 될 놈이야',
    punchline:
      '사진 한 장인데 배경까지 조연으로 밀렸다. 카메라 앞에서 세계관 중심을 본인으로 잡는다.',
    reasons: [
      '프레임 안에서 중심을 양보하지 않는다',
      '사진보다 주인공 의식이 먼저 보인다',
      '혼자 찍어도 장면을 크게 쓴다',
    ],
    scores: [
      { label: '주인공 의식', value: 96 },
      { label: '프레임 장악력', value: 90 },
      { label: '반박 불가율', value: 15 },
    ],
    category: 'general_solo',
    photoTypes: ['selfie', 'profile', 'close_up', 'chest_up'],
    visualTriggers: [],
    tone: 'absurd',
    cluster: 'self_confident_profile',
    selectionHints: ['self_confident_profile cluster 전용'],
    match: SELF_CONFIDENT_PROFILE_MATCH,
  },
  {
    id: 'solo-self-confident-camera-esteem',
    title: '넌 딱 카메라 켜지면 자존감도 같이 켜지는 놈이야',
    punchline:
      '렌즈가 켜지는 순간 태도가 달라진다. 사진 앱이 아니라 자존감 충전기를 켠 거다.',
    reasons: [
      '카메라 앞에서 표정이 바로 살아난다',
      '사진 찍는 순간 본인 확신이 충전된다',
      '프사 후보 앞에서 기분이 먼저 오른다',
    ],
    scores: [
      { label: '자존감 점화력', value: 95 },
      { label: '카메라 충전률', value: 88 },
      { label: '반박 불가율', value: 16 },
    ],
    category: 'general_solo',
    photoTypes: ['selfie', 'profile', 'close_up', 'chest_up'],
    visualTriggers: [],
    tone: 'roast',
    cluster: 'self_confident_profile',
    selectionHints: ['self_confident_profile cluster 전용'],
    match: SELF_CONFIDENT_PROFILE_MATCH,
  },
  {
    id: 'solo-self-confident-profile-day',
    title: '넌 딱 프사 한 장으로 하루 종일 기분 좋을 놈이야',
    punchline:
      '잘 나온 사진 하나면 하루 컨디션이 해결된다. 일정 관리보다 프사 관리가 더 중요하다.',
    reasons: [
      '사진 한 장으로 기분이 바로 회복된다',
      '프사 후보가 생기면 하루가 가벼워진다',
      '반응 오기 전부터 이미 만족한다',
    ],
    scores: [
      { label: '프사 컨디션력', value: 93 },
      { label: '하루 보정률', value: 87 },
      { label: '반박 불가율', value: 19 },
    ],
    category: 'general_solo',
    photoTypes: ['selfie', 'profile', 'close_up', 'chest_up'],
    visualTriggers: [],
    tone: 'social',
    cluster: 'self_confident_profile',
    selectionHints: ['self_confident_profile cluster 전용'],
    match: SELF_CONFIDENT_PROFILE_MATCH,
  },
  {
    id: 'solo-self-confident-selfie-life',
    title: '넌 딱 셀카 잘 나오면 인생도 잘 풀린다고 믿는 놈이야',
    punchline:
      '사진 운을 인생 운으로 확대해석한다. 셀카 한 장에 미래까지 맡기는 타입이다.',
    reasons: [
      '셀카 결과를 하루의 징조로 받아들인다',
      '잘 나온 사진 하나로 근거 없는 희망이 생긴다',
      '프사감과 인생감을 자꾸 연결한다',
    ],
    scores: [
      { label: '셀카 운명론', value: 94 },
      { label: '확대해석력', value: 90 },
      { label: '반박 불가율', value: 12 },
    ],
    category: 'general_solo',
    photoTypes: ['selfie', 'profile', 'close_up', 'chest_up'],
    visualTriggers: [],
    tone: 'absurd',
    cluster: 'self_confident_profile',
    selectionHints: ['self_confident_profile cluster 전용'],
    match: SELF_CONFIDENT_PROFILE_MATCH,
  },
  {
    id: 'solo-self-confident-face-certainty',
    title: '넌 딱 본인 얼굴에 확신이 너무 많은 놈이야',
    punchline:
      '사진을 고르는 태도부터 단호하다. 남의 평가보다 본인 확신이 훨씬 빠르다.',
    reasons: [
      '후보 사진을 보는 기준이 확실하다',
      '본인 얼굴에 대한 결론이 이미 나 있다',
      '반응 확인은 절차일 뿐이다',
    ],
    scores: [
      { label: '얼굴 확신력', value: 96 },
      { label: '자체 결론 속도', value: 91 },
      { label: '반박 불가율', value: 11 },
    ],
    category: 'general_solo',
    photoTypes: ['selfie', 'profile', 'close_up', 'chest_up'],
    visualTriggers: [],
    tone: 'hard_roast',
    cluster: 'self_confident_profile',
    selectionHints: ['self_confident_profile cluster 전용'],
    match: SELF_CONFIDENT_PROFILE_MATCH,
  },
  {
    id: 'solo-self-confident-mirror-approval',
    title: '넌 딱 거울 볼 때마다 스스로 납득하는 놈이야',
    punchline:
      '거울은 확인용이 아니라 승인용이다. 볼 때마다 본인 선택에 다시 고개를 끄덕인다.',
    reasons: [
      '확인보다 납득이 먼저 끝난다',
      '거울 앞에서 자기 설득이 필요 없다',
      '프사 후보를 고를 때도 같은 확신이 나온다',
    ],
    scores: [
      { label: '자체 승인률', value: 93 },
      { label: '거울 납득력', value: 89 },
      { label: '반박 불가율', value: 16 },
    ],
    category: 'general_solo',
    photoTypes: ['selfie', 'profile', 'close_up', 'chest_up'],
    visualTriggers: [],
    tone: 'roast',
    cluster: 'self_confident_profile',
    selectionHints: ['self_confident_profile cluster 전용'],
    match: SELF_CONFIDENT_PROFILE_MATCH,
  },
  {
    id: 'solo-self-confident-one-photo-ego',
    title: '넌 딱 잘 나온 사진 한 장으로 자아 완성하는 놈이야',
    punchline:
      '사진 하나가 마음속 퍼즐 마지막 조각이다. 업로드 전부터 자아가 정리된다.',
    reasons: [
      '잘 나온 컷 하나에 정체성이 붙는다',
      '사진 선택이 자아 정리처럼 진지하다',
      '프사감이 생기면 태도까지 안정된다',
    ],
    scores: [
      { label: '자아 완성률', value: 95 },
      { label: '프사 의존도', value: 88 },
      { label: '반박 불가율', value: 14 },
    ],
    category: 'general_solo',
    photoTypes: ['selfie', 'profile', 'close_up', 'chest_up'],
    visualTriggers: [],
    tone: 'absurd',
    cluster: 'self_confident_profile',
    selectionHints: ['self_confident_profile cluster 전용'],
    match: SELF_CONFIDENT_PROFILE_MATCH,
  },
  {
    id: 'solo-self-confident-profile-thought',
    title: '넌 딱 ‘이건 프사감인데?’를 하루 세 번 생각할 놈이야',
    punchline:
      '사진을 찍는 순간 이미 용도를 정한다. 하루에 세 번씩 프사 후보를 마음속으로 심사한다.',
    reasons: [
      '사진을 남기는 순간 프사 후보로 분류한다',
      '평범한 컷에도 업데이트 각을 본다',
      '본인 사진첩을 후보 명단처럼 관리한다',
    ],
    scores: [
      { label: '프사 후보 생성력', value: 97 },
      { label: '자기 심사 빈도', value: 92 },
      { label: '반박 불가율', value: 10 },
    ],
    category: 'general_solo',
    photoTypes: ['selfie', 'profile', 'close_up', 'chest_up'],
    visualTriggers: [],
    tone: 'roast',
    cluster: 'self_confident_profile',
    selectionHints: ['self_confident_profile cluster 전용'],
    match: SELF_CONFIDENT_PROFILE_MATCH,
  },
  {
    id: 'solo-effortless-picked',
    title: '넌 딱 대충 나온 척하는데 은근 잘 나온 놈이야',
    punchline:
      '꾸민 티는 안 내는데 사진은 절대 막 고르지 않는다. 이런 애들이 제일 킹받게 자연스럽다.',
    reasons: [
      '대충이라는 말 뒤에 선택 과정이 길다',
      '자연스러움이 우연이 아니라 결과물이다',
      '안 꾸민 척하는데 컷 선정은 엄격하다',
    ],
    scores: [
      { label: '대충 위장력', value: 93 },
      { label: '컷 선별력', value: 89 },
      { label: '반박 불가율', value: 20 },
    ],
    category: 'general_solo',
    photoTypes: ['solo', 'selfie', 'daily', 'profile'],
    visualTriggers: [],
    tone: 'roast',
    selectionHints: [
      'outfitStyle이 casual 또는 effortless',
      'pose가 natural',
      'expression이 natural_smile 또는 neutral',
      'photoMood에 effortless 포함',
    ],
    match: {
      expression: ['natural_smile', 'neutral'],
      pose: ['natural'],
      outfitStyle: ['casual', 'effortless'],
      photoMood: ['effortless'],
    },
  },
  {
    id: 'solo-outfit-meeting',
    title: '넌 딱 오늘 착장 보여주려고 약속 잡은 놈이야',
    punchline:
      '만남은 핑계고 진짜 목적은 전신샷이다. 사진 찍히기 전부터 신발까지 계산 끝났다.',
    reasons: [
      '약속보다 착장 기록이 먼저다',
      '전신샷 구도에 하루 목적이 다 들어 있다',
      '신발까지 보이게 찍힌 건 사고가 아니다',
    ],
    scores: [
      { label: '착장 과시력', value: 96 },
      { label: '전신샷 집착력', value: 91 },
      { label: '반박 불가율', value: 12 },
    ],
    category: 'general_solo',
    photoTypes: ['solo', 'daily', 'full_body'],
    visualTriggers: [],
    tone: 'hard_roast',
    selectionHints: [
      'framing이 full_body',
      'outfitStyle이 dressed_up, street, formal, tryhard 중 하나',
      'pose가 posed',
      'photoMood에 tryhard 포함',
      'selfie/close_up 계열이 아님',
    ],
    match: {
      pose: ['posed'],
      framing: ['full_body'],
      outfitStyle: ['dressed_up', 'street', 'formal', 'tryhard'],
      photoMood: ['tryhard'],
      excludedFraming: ['face_close_up', 'chest_up', 'selfie'],
    },
  },
  {
    id: 'solo-funny-but-not',
    title: '넌 딱 웃기는 놈들 중에서 제일 안 웃기는 놈이야',
    punchline:
      '웃기려고 몸은 움직였는데 감각은 집에 두고 왔다. 친구들이 웃는 건 네 개그가 아니라 네가 애쓰는 모습이다.',
    reasons: [
      '포즈는 큰데 웃음 포인트는 실종됐다',
      '친구들이 웃는 순간을 본인이 오해한다',
      '몸짓이 개그보다 먼저 도착했다',
    ],
    scores: [
      { label: '애씀 노출도', value: 94 },
      { label: '개그 헛발질', value: 87 },
      { label: '반박 불가율', value: 9 },
    ],
    category: 'general_solo',
    photoTypes: ['solo', 'selfie', 'daily'],
    visualTriggers: [],
    tone: 'hard_roast',
    selectionHints: [
      'pose가 exaggerated, v_sign, finger_heart 중 하나',
      'expression이 playful 또는 forced_smile 또는 awkward_stiff',
      'photoMood에 awkward 또는 tryhard 포함',
      '자연스러운 밝은 정면 셀카가 아님',
    ],
    match: {
      expression: ['playful', 'forced_smile', 'awkward_stiff'],
      pose: ['exaggerated', 'v_sign', 'finger_heart'],
      photoMood: ['awkward', 'tryhard'],
      excludedPose: ['natural', 'standing_still'],
    },
  },
  {
    id: 'solo-careful-before-talking',
    title: '넌 딱 말 걸기 전에 한 번 눈치 보게 되는 상이야',
    punchline:
      '표정 하나로 거리감 세팅 끝났다. 친해지기 전까지는 다들 괜히 말투 고른다.',
    reasons: [
      '정면을 보는데 문턱이 같이 보인다',
      '말 걸기 전에 문장 검사를 하게 만든다',
      '친해지기 전 거리감이 자동으로 켜진다',
    ],
    scores: [
      { label: '말투 검열력', value: 91 },
      { label: '초면 거리감', value: 86 },
      { label: '반박 불가율', value: 18 },
    ],
    category: 'general_solo',
    photoTypes: ['solo', 'profile', 'chest_up', 'upper_body'],
    visualTriggers: [],
    tone: 'social',
    selectionHints: [
      'gaze가 looking_at_camera',
      'expression이 neutral 또는 chic',
      'photoMood에 calm 또는 chic 포함',
      'natural_smile/playful이 아님',
    ],
    match: {
      gaze: ['looking_at_camera'],
      expression: ['neutral', 'chic'],
      framing: ['face_close_up', 'chest_up', 'upper_body', 'selfie'],
      photoMood: ['calm', 'chic'],
      excludedExpression: ['natural_smile', 'playful', 'forced_smile'],
      excludedPose: ['awkward', 'exaggerated', 'v_sign', 'finger_heart'],
    },
  },
  {
    id: 'solo-camera-awkward',
    title: '넌 딱 사진 찍을 때만 갑자기 어색해지는 놈이야',
    punchline:
      '평소엔 멀쩡하다가 카메라만 켜지면 몸이 남의 것이 된다. 이건 포즈가 아니라 구조 요청이다.',
    reasons: [
      '포즈를 잡았는데 포즈가 너를 잡았다',
      '카메라 앞에서 손 둘 곳을 잃었다',
      '웃음보다 탈출 의지가 먼저 보인다',
    ],
    scores: [
      { label: '카메라 경직도', value: 95 },
      { label: '손 위치 미아력', value: 89 },
      { label: '반박 불가율', value: 14 },
    ],
    category: 'general_solo',
    photoTypes: ['solo', 'daily', 'upper_body', 'full_body'],
    visualTriggers: [],
    tone: 'roast',
    selectionHints: [
      'pose가 awkward',
      'expression이 awkward_stiff 또는 forced_smile',
      'framing이 upper_body 또는 full_body',
      'natural pose가 아님',
    ],
    match: {
      expression: ['awkward_stiff', 'forced_smile'],
      pose: ['awkward'],
      framing: ['upper_body', 'full_body'],
      excludedPose: ['natural'],
      excludedPhotoMood: ['bright'],
    },
  },
  {
    id: 'solo-carefully-careless',
    title: '넌 딱 아무렇지 않은 척하면서 제일 신경 쓴 놈이야',
    punchline:
      '무심하게 나온 척하지만 머리부터 손 위치까지 다 계산돼 있다. 이런 사진이 제일 능청스럽다.',
    reasons: [
      '무심함에도 설계도가 있다',
      '힘 안 준 척하는 데 힘을 다 썼다',
      '손 위치까지 자연스러운 척 대기 중이다',
    ],
    scores: [
      { label: '무심 연기력', value: 94 },
      { label: '디테일 계산력', value: 90 },
      { label: '반박 불가율', value: 13 },
    ],
    category: 'general_solo',
    photoTypes: ['solo', 'daily', 'profile'],
    visualTriggers: [],
    tone: 'roast',
    selectionHints: [
      'pose가 posed 또는 natural',
      'outfitStyle이 clean, dressed_up, effortless 중 하나',
      'photoMood에 effortless 또는 calm 포함',
    ],
    match: {
      pose: ['posed', 'natural'],
      outfitStyle: ['clean', 'dressed_up', 'effortless'],
      photoMood: ['effortless', 'calm'],
    },
  },
  {
    id: 'solo-selfie-survivor',
    title: '넌 딱 셀카 찍고 17장 중에 이거 고른 놈이야',
    punchline:
      '방금 찍은 척하지만 뒤에 버려진 사진들이 너무 많다. 이건 우연이 아니라 생존 경쟁이다.',
    reasons: [
      '한 장처럼 보이지만 뒤에 탈락자가 줄섰다',
      '셀카 각도에 심사위원 기운이 묻어 있다',
      '저장된 사진첩이 이미 예선전을 끝냈다',
    ],
    scores: [
      { label: '셀카 생존전', value: 97 },
      { label: '탈락 컷 누적률', value: 92 },
      { label: '반박 불가율', value: 11 },
    ],
    category: 'general_solo',
    photoTypes: ['selfie', 'close_up', 'chest_up'],
    visualTriggers: [],
    tone: 'roast',
    selectionHints: [
      'photoType이 selfie',
      'framing이 face_close_up 또는 chest_up',
      'gaze가 looking_at_camera',
    ],
    match: {
      photoTypes: ['selfie'],
      gaze: ['looking_at_camera'],
      framing: ['face_close_up', 'chest_up'],
    },
  },
  {
    id: 'solo-quiet-photo-presence',
    title: '넌 딱 조용히 있다가 사진에서만 존재감 챙기는 놈이야',
    punchline:
      '말은 별로 안 해도 사진에는 묘하게 남는다. 조용한 척하는 애들이 제일 오래 기억난다.',
    reasons: [
      '말수보다 사진 잔상이 더 길다',
      '가만히 있는데 묘하게 시선이 간다',
      '조용함을 핑계로 존재감을 숨기지 못한다',
    ],
    scores: [
      { label: '조용한 잔상력', value: 90 },
      { label: '사진 존재감', value: 86 },
      { label: '반박 불가율', value: 22 },
    ],
    category: 'general_solo',
    photoTypes: ['solo', 'daily', 'profile'],
    visualTriggers: [],
    tone: 'social',
    selectionHints: [
      'photoMood에 quiet_presence 또는 calm 포함',
      'expression이 neutral 또는 natural_smile',
      'pose가 natural 또는 standing_still',
      'bright/social이 강한 사진이 아님',
    ],
    match: {
      expression: ['neutral', 'natural_smile'],
      pose: ['natural', 'standing_still'],
      photoMood: ['quiet_presence', 'calm'],
      excludedPhotoMood: ['bright', 'social', 'tryhard', 'awkward'],
    },
  },
  {
    id: 'solo-mirror-audit',
    title: '넌 딱 거울샷 찍고 방 상태부터 확인할 놈이야',
    punchline:
      '사진은 본인 인증인데 배경 검수가 더 길다. 거울 앞에서 이미 편집 회의 끝났다.',
    reasons: [
      '거울샷 하나에 검수 항목이 너무 많다',
      '찍기보다 지울 물건 찾는 시간이 길다',
      '배경까지 통과해야 업로드되는 타입이다',
    ],
    scores: [
      { label: '배경 검수력', value: 91 },
      { label: '거울샷 집요함', value: 86 },
      { label: '반박 불가율', value: 19 },
    ],
    category: 'general_solo',
    photoTypes: ['mirror_selfie', 'solo', 'daily'],
    visualTriggers: [],
    tone: 'absurd',
    selectionHints: ['framing이 mirror_shot', 'photoType이 mirror_selfie'],
    match: {
      photoTypes: ['mirror_selfie'],
      framing: ['mirror_shot'],
    },
  },
  {
    id: 'solo-v-sign-default',
    title: '넌 딱 사진만 찍으면 브이부터 자동으로 나오는 놈이야',
    punchline:
      '머리는 아직 상황 파악 중인데 손가락은 이미 출근했다. 포즈 선택지가 하나뿐이다.',
    reasons: [
      '카메라 켜지면 손이 먼저 대답한다',
      '브이가 포즈가 아니라 반사신경이다',
      '사진첩이 손가락 출석부로 변한다',
    ],
    scores: [
      { label: '브이 반사력', value: 96 },
      { label: '포즈 단일화', value: 88 },
      { label: '반박 불가율', value: 15 },
    ],
    category: 'general_solo',
    photoTypes: ['solo', 'selfie', 'daily'],
    visualTriggers: [],
    tone: 'roast',
    selectionHints: [
      'pose가 v_sign',
      'expression이 natural_smile 또는 playful',
    ],
    match: {
      expression: ['natural_smile', 'playful'],
      pose: ['v_sign'],
    },
  },
  {
    id: 'solo-finger-heart-contract',
    title: '넌 딱 손하트 하고 귀여운 척 계약서 쓴 놈이야',
    punchline:
      '손가락은 작게 움직였는데 의도는 너무 크게 들켰다. 이건 애교가 아니라 제출물이다.',
    reasons: [
      '손하트가 자연발생한 척한다',
      '귀여움보다 수행평가 느낌이 강하다',
      '포즈 하나에 반응 기대치가 붙어 있다',
    ],
    scores: [
      { label: '애교 제출력', value: 90 },
      { label: '손하트 의도성', value: 87 },
      { label: '반박 불가율', value: 17 },
    ],
    category: 'general_solo',
    photoTypes: ['solo', 'selfie', 'daily'],
    visualTriggers: [],
    tone: 'roast',
    selectionHints: [
      'pose가 finger_heart',
      'photoMood에 social 또는 tryhard 포함',
    ],
    match: {
      pose: ['finger_heart'],
      photoMood: ['social', 'tryhard'],
    },
  },
  {
    id: 'solo-formal-sudden-adult',
    title: '넌 딱 정장 입고 갑자기 어른인 척하는 놈이야',
    punchline:
      '옷만 바뀌었는데 말투까지 바꿀 준비가 끝났다. 사진 찍는 순간 세금 얘기할 얼굴이다.',
    reasons: [
      '정장 하나로 갑자기 책임감 있는 척한다',
      '포즈에서 면접 대기실 공기가 난다',
      '사진 찍고 바로 진지한 척할 준비가 됐다',
    ],
    scores: [
      { label: '어른 연기력', value: 92 },
      { label: '면접 대기감', value: 85 },
      { label: '반박 불가율', value: 21 },
    ],
    category: 'general_solo',
    photoTypes: ['solo', 'profile', 'upper_body', 'full_body'],
    visualTriggers: [],
    tone: 'absurd',
    selectionHints: [
      'outfitStyle이 formal',
      'pose가 posed 또는 standing_still',
    ],
    match: {
      pose: ['posed', 'standing_still'],
      outfitStyle: ['formal'],
    },
  },
  {
    id: 'solo-street-walkway',
    title: '넌 딱 길거리도 런웨이로 쓰는 놈이야',
    punchline:
      '그냥 걷는 척하지만 발끝까지 의식 중이다. 보도블록이 갑자기 무대가 됐다.',
    reasons: [
      '길을 걷는 게 아니라 컷을 뽑고 있다',
      '착장과 배경을 같은 편으로 만들었다',
      '무심한 걸음에 업로드 목적이 숨어 있다',
    ],
    scores: [
      { label: '런웨이 전환력', value: 89 },
      { label: '착장 의식도', value: 88 },
      { label: '반박 불가율', value: 18 },
    ],
    category: 'general_solo',
    photoTypes: ['solo', 'daily', 'full_body'],
    visualTriggers: [],
    tone: 'social',
    selectionHints: [
      'outfitStyle이 street 또는 dressed_up',
      'framing이 full_body 또는 third_person_photo',
      'photoMood에 chic 또는 tryhard 포함',
    ],
    match: {
      framing: ['full_body', 'third_person_photo'],
      outfitStyle: ['street', 'dressed_up'],
      photoMood: ['chic', 'tryhard'],
    },
  },
  {
    id: 'solo-looking-down-notification',
    title: '넌 딱 사진 찍히면서도 알림 확인할 놈이야',
    punchline:
      '시선은 아래로 갔는데 관심은 위로 받고 싶다. 무심한 척하는 방식이 너무 바쁘다.',
    reasons: [
      '아래를 보는 순간에도 사진 각도는 살아 있다',
      '알림 확인인지 컨셉인지 선이 없다',
      '무심함을 찍으려고 너무 성실하다',
    ],
    scores: [
      { label: '알림 핑계력', value: 87 },
      { label: '무심 컨셉력', value: 85 },
      { label: '반박 불가율', value: 23 },
    ],
    category: 'general_solo',
    photoTypes: ['solo', 'daily', 'profile'],
    visualTriggers: [],
    tone: 'roast',
    selectionHints: [
      'gaze가 looking_down',
      'photoMood에 effortless 또는 calm 포함',
    ],
    match: {
      gaze: ['looking_down'],
      photoMood: ['effortless', 'calm'],
    },
  },
  {
    id: 'solo-bright-social-battery',
    title: '넌 딱 편의점 알바한테도 날씨 얘기 걸 놈이야',
    punchline:
      '계산만 하면 되는데 굳이 대화를 만든다. 친화력이 아니라 말 걸 구실을 못 참는 놈이다.',
    reasons: [
      '짧게 끝날 상황을 꼭 대화로 늘린다',
      '상대가 웃어주면 바로 친해진 줄 안다',
      '스몰토크가 아니라 생활 습관이다',
    ],
    scores: [
      { label: '말 걸 구실력', value: 94 },
      { label: '알바 당황도', value: 87 },
      { label: '반박 불가율', value: 9 },
    ],
    category: 'general_solo',
    photoTypes: ['solo', 'daily'],
    visualTriggers: [],
    tone: 'social',
    cluster: 'small_talk_social',
    selectionHints: [
      'gaze가 looking_at_camera',
      'expression이 natural_smile 또는 playful',
      'pose가 natural',
      'photoMood에 social이 강하게 포함',
      'framing이 third_person_photo, upper_body, chest_up 계열',
      '셀카/얼굴 클로즈업이 아니라 타인이 찍어준 자연스러운 교류 느낌',
      'awkward, chic, calm, quiet_presence, tryhard 분위기가 아님',
    ],
    match: {
      photoTypes: ['solo', 'daily'],
      gaze: ['looking_at_camera'],
      expression: ['natural_smile', 'playful'],
      pose: ['natural'],
      framing: ['third_person_photo', 'upper_body', 'chest_up'],
      photoMood: ['social'],
      excludedExpression: ['neutral', 'forced_smile', 'chic', 'awkward_stiff'],
      excludedPose: [
        'awkward',
        'exaggerated',
        'v_sign',
        'finger_heart',
        'standing_still',
      ],
      excludedFraming: ['face_close_up', 'selfie', 'full_body', 'mirror_shot'],
      excludedPhotoMood: [
        'awkward',
        'chic',
        'calm',
        'quiet_presence',
        'tryhard',
      ],
      minScore: 17,
    },
  },
  {
    id: 'solo-small-talk-lunch-lady',
    title:
      '넌 딱 급식 먹을 때 급식 아주머니랑 베프 돼서 닭다리 6개 먹을 놈이야',
    punchline:
      '줄 서는 동안 이미 안부 묻고 친밀도 쌓는다. 남들은 배식받는데 너는 인맥으로 닭다리 뚫는다.',
    reasons: [
      '처음 보는 어른한테도 말문을 튼다',
      '친화력을 식판 위에서 증명한다',
      '이런 애들은 급식실에서도 정치한다',
    ],
    scores: [
      { label: '급식실 인맥력', value: 96 },
      { label: '닭다리 추가 확률', value: 89 },
      { label: '반박 불가율', value: 7 },
    ],
    category: 'general_solo',
    photoTypes: ['solo', 'daily'],
    visualTriggers: [],
    tone: 'social',
    cluster: 'small_talk_social',
    selectionHints: [
      'small_talk_social cluster 전용',
      'social mood가 강하고 타인이 찍어준 자연스러운 교류 느낌',
    ],
    match: {
      photoTypes: ['solo', 'daily'],
      gaze: ['looking_at_camera'],
      expression: ['natural_smile', 'playful'],
      pose: ['natural'],
      framing: ['third_person_photo', 'upper_body', 'chest_up'],
      photoMood: ['social'],
      excludedExpression: ['neutral', 'forced_smile', 'chic', 'awkward_stiff'],
      excludedPose: [
        'awkward',
        'exaggerated',
        'v_sign',
        'finger_heart',
        'standing_still',
      ],
      excludedFraming: ['face_close_up', 'selfie', 'full_body', 'mirror_shot'],
      excludedPhotoMood: [
        'awkward',
        'chic',
        'calm',
        'quiet_presence',
        'tryhard',
      ],
      minScore: 17,
    },
  },
  {
    id: 'solo-small-talk-exam-proctor',
    title: '넌 딱 수능 볼 때 감독관이랑 친해져서 AI 안경 끼고 시험칠 놈이야',
    punchline:
      '시험장에서도 조용히 못 있고 분위기를 튼다. 긴장감보다 친화력이 먼저 입장한 놈이다.',
    reasons: [
      '침묵해야 하는 공간에서도 말 걸 타이밍을 찾는다',
      '감독관도 어느 순간 네 편이 돼 있다',
      '룰보다 친밀감으로 뚫으려는 타입이다',
    ],
    scores: [
      { label: '감독관 포섭력', value: 95 },
      { label: '시험장 소란도', value: 88 },
      { label: '반박 불가율', value: 5 },
    ],
    category: 'general_solo',
    photoTypes: ['solo', 'daily'],
    visualTriggers: [],
    tone: 'hard_roast',
    cluster: 'small_talk_social',
    selectionHints: ['small_talk_social cluster 전용'],
    match: {
      photoTypes: ['solo', 'daily'],
      gaze: ['looking_at_camera'],
      expression: ['natural_smile', 'playful'],
      pose: ['natural'],
      framing: ['third_person_photo', 'upper_body', 'chest_up'],
      photoMood: ['social'],
      excludedExpression: ['neutral', 'forced_smile', 'chic', 'awkward_stiff'],
      excludedPose: [
        'awkward',
        'exaggerated',
        'v_sign',
        'finger_heart',
        'standing_still',
      ],
      excludedFraming: ['face_close_up', 'selfie', 'full_body', 'mirror_shot'],
      excludedPhotoMood: [
        'awkward',
        'chic',
        'calm',
        'quiet_presence',
        'tryhard',
      ],
      minScore: 17,
    },
  },
  {
    id: 'solo-small-talk-flight-attendant',
    title: '넌 딱 비행기 타면 승무원들이 못 챙겨줘서 안달 날 스타일이야',
    punchline:
      '벨 누르기도 전에 눈 마주치고 대화부터 튼다. 기내식보다 친밀감 먼저 받아낼 놈이다.',
    reasons: [
      '처음 보는 서비스직과도 바로 친해진다',
      '요청하기 전에 이미 존재감을 깔아둔다',
      '주변 승객보다 승무원이 먼저 기억한다',
    ],
    scores: [
      { label: '기내 존재감', value: 93 },
      { label: '승무원 친화력', value: 90 },
      { label: '반박 불가율', value: 8 },
    ],
    category: 'general_solo',
    photoTypes: ['solo', 'daily'],
    visualTriggers: [],
    tone: 'social',
    cluster: 'small_talk_social',
    selectionHints: ['small_talk_social cluster 전용'],
    match: {
      photoTypes: ['solo', 'daily'],
      gaze: ['looking_at_camera'],
      expression: ['natural_smile', 'playful'],
      pose: ['natural'],
      framing: ['third_person_photo', 'upper_body', 'chest_up'],
      photoMood: ['social'],
      excludedExpression: ['neutral', 'forced_smile', 'chic', 'awkward_stiff'],
      excludedPose: [
        'awkward',
        'exaggerated',
        'v_sign',
        'finger_heart',
        'standing_still',
      ],
      excludedFraming: ['face_close_up', 'selfie', 'full_body', 'mirror_shot'],
      excludedPhotoMood: [
        'awkward',
        'chic',
        'calm',
        'quiet_presence',
        'tryhard',
      ],
      minScore: 17,
    },
  },
  {
    id: 'solo-small-talk-head-table',
    title: '넌 딱 모임에 나가면 사람들이 상석에 앉힐 놈이야',
    punchline:
      '처음 온 자리에서도 이미 분위기 주도권 잡는다. 누가 시킨 적 없는데 중심에 앉아 있을 놈이다.',
    reasons: [
      '낯선 자리에서도 존재감이 먼저 앉는다',
      '말 몇 마디로 자리 배치를 바꾼다',
      '처음 보는 사람들도 어느새 네 쪽을 본다',
    ],
    scores: [
      { label: '모임 장악력', value: 92 },
      { label: '상석 점유율', value: 86 },
      { label: '반박 불가율', value: 10 },
    ],
    category: 'general_solo',
    photoTypes: ['solo', 'daily'],
    visualTriggers: [],
    tone: 'social',
    cluster: 'small_talk_social',
    selectionHints: ['small_talk_social cluster 전용'],
    match: {
      photoTypes: ['solo', 'daily'],
      gaze: ['looking_at_camera'],
      expression: ['natural_smile', 'playful'],
      pose: ['natural'],
      framing: ['third_person_photo', 'upper_body', 'chest_up'],
      photoMood: ['social'],
      excludedExpression: ['neutral', 'forced_smile', 'chic', 'awkward_stiff'],
      excludedPose: [
        'awkward',
        'exaggerated',
        'v_sign',
        'finger_heart',
        'standing_still',
      ],
      excludedFraming: ['face_close_up', 'selfie', 'full_body', 'mirror_shot'],
      excludedPhotoMood: [
        'awkward',
        'chic',
        'calm',
        'quiet_presence',
        'tryhard',
      ],
      minScore: 17,
    },
  },
  {
    id: 'solo-small-talk-taxi-life-story',
    title: '넌 딱 택시 기사님이랑 목적지보다 인생 얘기 더 할 놈이야',
    punchline:
      '타자마자 조용히 가는 선택지는 없다. 도착할 때쯤 기사님 가족사까지 알고 내릴 놈이다.',
    reasons: [
      '목적지는 짧은데 대화는 장거리다',
      '기사님이 라디오 끄고 네 얘기 들을 상이다',
      '내릴 때 서로 건강 챙기라고 할 타입이다',
    ],
    scores: [
      { label: '택시 토크력', value: 97 },
      { label: '기사님 친밀도', value: 91 },
      { label: '반박 불가율', value: 6 },
    ],
    category: 'general_solo',
    photoTypes: ['solo', 'daily'],
    visualTriggers: [],
    tone: 'hard_roast',
    cluster: 'small_talk_social',
    selectionHints: ['small_talk_social cluster 전용'],
    match: {
      photoTypes: ['solo', 'daily'],
      gaze: ['looking_at_camera'],
      expression: ['natural_smile', 'playful'],
      pose: ['natural'],
      framing: ['third_person_photo', 'upper_body', 'chest_up'],
      photoMood: ['social'],
      excludedExpression: ['neutral', 'forced_smile', 'chic', 'awkward_stiff'],
      excludedPose: [
        'awkward',
        'exaggerated',
        'v_sign',
        'finger_heart',
        'standing_still',
      ],
      excludedFraming: ['face_close_up', 'selfie', 'full_body', 'mirror_shot'],
      excludedPhotoMood: [
        'awkward',
        'chic',
        'calm',
        'quiet_presence',
        'tryhard',
      ],
      minScore: 17,
    },
  },
  {
    id: 'solo-small-talk-one-sided-friendly',
    title: '넌 딱 모르는 사람한테 말 걸고 본인이 친화력 좋은 줄 아는 놈이야',
    punchline:
      '상대가 받아준 게 아니라 도망갈 타이밍을 놓친 거다. 너 혼자 분위기 풀렸다고 착각한다.',
    reasons: [
      '말 걸기 전 망설임이 없다',
      '상대 리액션을 동의로 해석한다',
      '친화력과 부담스러움의 경계에 산다',
    ],
    scores: [
      { label: '혼자 친해진 속도', value: 94 },
      { label: '상대 도망 실패율', value: 88 },
      { label: '반박 불가율', value: 6 },
    ],
    category: 'general_solo',
    photoTypes: ['solo', 'daily'],
    visualTriggers: [],
    tone: 'hard_roast',
    cluster: 'small_talk_social',
    selectionHints: ['small_talk_social cluster 전용'],
    match: {
      photoTypes: ['solo', 'daily'],
      gaze: ['looking_at_camera'],
      expression: ['natural_smile', 'playful'],
      pose: ['natural'],
      framing: ['third_person_photo', 'upper_body', 'chest_up'],
      photoMood: ['social'],
      excludedExpression: ['neutral', 'forced_smile', 'chic', 'awkward_stiff'],
      excludedPose: [
        'awkward',
        'exaggerated',
        'v_sign',
        'finger_heart',
        'standing_still',
      ],
      excludedFraming: ['face_close_up', 'selfie', 'full_body', 'mirror_shot'],
      excludedPhotoMood: [
        'awkward',
        'chic',
        'calm',
        'quiet_presence',
        'tryhard',
      ],
      minScore: 17,
    },
  },
  {
    id: 'solo-dark-feed-curator',
    title: '넌 딱 피드 색감 맞추려고 조명까지 고를 놈이야',
    punchline:
      '사진 한 장인데 계정 전체 톤을 걱정한다. 밝기 조절이 아니라 세계관 관리다.',
    reasons: [
      '조명이 사진보다 먼저 심사받는다',
      '업로드 전에 피드 배열을 계산한다',
      '분위기라는 말로 시간을 오래 쓴다',
    ],
    scores: [
      { label: '피드 관리력', value: 92 },
      { label: '색감 집착도', value: 88 },
      { label: '반박 불가율', value: 20 },
    ],
    category: 'general_solo',
    photoTypes: ['solo', 'daily', 'profile'],
    visualTriggers: [],
    tone: 'roast',
    selectionHints: [
      'photoMood에 chic 또는 calm 포함',
      'expression이 neutral 또는 chic',
    ],
    match: {
      expression: ['neutral', 'chic'],
      photoMood: ['chic', 'calm'],
    },
  },
  {
    id: 'solo-sporty-unplanned',
    title: '넌 딱 운동복 입고 운동은 안 할 놈이야',
    punchline:
      '움직일 준비는 된 척하지만 목적지는 카페다. 활동성은 옷에만 있다.',
    reasons: [
      '운동복이 계획보다 먼저 나왔다',
      '뛰기보다 사진 찍을 동선이 더 자연스럽다',
      '편한 착장으로 성실함까지 빌리려 한다',
    ],
    scores: [
      { label: '운동복 알리바이', value: 88 },
      { label: '활동성 위장률', value: 82 },
      { label: '반박 불가율', value: 25 },
    ],
    category: 'general_solo',
    photoTypes: ['solo', 'daily', 'full_body'],
    visualTriggers: [],
    tone: 'absurd',
    selectionHints: [
      'outfitStyle이 sporty',
      'pose가 natural 또는 standing_still',
    ],
    match: {
      pose: ['natural', 'standing_still'],
      outfitStyle: ['sporty'],
    },
  },
  {
    id: 'solo-third-person-main',
    title: '넌 딱 남이 찍어준 척 친구한테 각도 지시한 놈이야',
    punchline:
      '자연스러운 타이밍인 척하지만 촬영 감독은 너다. 친구는 셔터만 누른 직원이다.',
    reasons: [
      '남이 찍어준 사진에 본인 지시가 남아 있다',
      '자연스러운 컷 뒤에 재촬영 요청이 보인다',
      '친구 손에 카메라를 맡기고 통제권은 안 놓는다',
    ],
    scores: [
      { label: '각도 지시력', value: 94 },
      { label: '친구 촬영팀화', value: 89 },
      { label: '반박 불가율', value: 14 },
    ],
    category: 'general_solo',
    photoTypes: ['solo', 'daily', 'full_body'],
    visualTriggers: [],
    tone: 'hard_roast',
    selectionHints: [
      'framing이 third_person_photo 또는 full_body',
      'pose가 posed',
    ],
    match: {
      pose: ['posed'],
      framing: ['third_person_photo', 'full_body'],
    },
  },
  {
    id: 'solo-still-standing-proof',
    title: '넌 딱 가만히 서 있으라니까 진짜 가만히 선 놈이야',
    punchline:
      '포즈를 덜어낸 게 아니라 포즈가 도망갔다. 사진 속에서 대기번호 부르는 중이다.',
    reasons: [
      '가만히 서 있는 데도 긴장이 보인다',
      '자연스러움이 아니라 정지 버튼이다',
      '사진 찍는 순간 몸이 안내문을 따랐다',
    ],
    scores: [
      { label: '정지 버튼력', value: 90 },
      { label: '대기번호 감성', value: 84 },
      { label: '반박 불가율', value: 22 },
    ],
    category: 'general_solo',
    photoTypes: ['solo', 'daily', 'upper_body', 'full_body'],
    visualTriggers: [],
    tone: 'absurd',
    selectionHints: [
      'pose가 standing_still',
      'expression이 neutral 또는 awkward_stiff',
    ],
    match: {
      expression: ['neutral', 'awkward_stiff'],
      pose: ['standing_still'],
    },
  },
  {
    id: 'solo-front-camera-boss',
    title: '넌 딱 셀카 한 장 찍고 단톡방 공지 올릴 상이야',
    punchline:
      '혼자 찍었는데 이미 분위기 통제권을 쥐었다. 답장 안 하면 개인 면담 들어간다.',
    reasons: [
      '사진에서 리더보다 반장 기운이 강하다',
      '조용히 있어도 단톡방 상단 고정감이 있다',
      '농담처럼 말해도 다들 일정 맞출 상이다',
    ],
    scores: [
      { label: '공지 장악력', value: 88 },
      { label: '단톡방 통제력', value: 83 },
      { label: '반박 불가율', value: 24 },
    ],
    category: 'solo',
    photoTypes: ['solo', 'selfie', 'profile'],
    visualTriggers: ['single_person', 'selfie'],
    tone: 'social',
  },
  {
    id: 'solo-cafe-seat-keeper',
    title: '넌 딱 카페 자리 맡고 친구들 위치 물어볼 상이야',
    punchline:
      '사진 한 장인데 이미 테이블 위 짐 배치가 보인다. 늦는 사람한테 전화 세 번 간다.',
    reasons: [
      '기다리는 척하면서 출석 체크할 기운이다',
      '자리는 맡았는데 표정은 이미 퇴근했다',
      '친구 도착 시간보다 콘센트 위치를 먼저 본다',
    ],
    scores: [
      { label: '자리 사수력', value: 86 },
      { label: '위치 확인력', value: 81 },
      { label: '반박 불가율', value: 22 },
    ],
    category: 'solo',
    photoTypes: ['solo', 'selfie', 'daily', 'profile'],
    visualTriggers: ['single_person'],
    tone: 'roast',
  },
  {
    id: 'solo-reply-late',
    title: '넌 딱 답장은 늦는데 스토리는 계속 올릴 상이야',
    punchline:
      '연락은 못 봤다면서 업로드는 정확하다. 바쁜 게 아니라 선택적 생존이다.',
    reasons: [
      '카톡보다 카메라 앱을 먼저 열 기운이다',
      '읽씹이 아니라 생활 방식이다',
      '친구들이 화내려다 스토리 보고 더 화난다',
    ],
    scores: [
      { label: '선택적 확인력', value: 90 },
      { label: '스토리 생존율', value: 87 },
      { label: '반박 불가율', value: 21 },
    ],
    category: 'solo',
    photoTypes: ['solo', 'selfie', 'daily', 'profile'],
    visualTriggers: ['single_person'],
    tone: 'roast',
  },
  {
    id: 'general-default-verdict',
    title: '넌 딱 아무 사진이나 올려도 놀림 받을 상이야',
    punchline:
      '특별한 증거는 필요 없다. 사진을 올린 선택 자체가 이미 판정 대상이다.',
    reasons: [
      '안전한 사진을 골랐다고 생각한 순간 끝났다',
      '친구들이 반박보다 캡처를 먼저 한다',
      '평범함으로 숨으려다 더 크게 걸렸다',
    ],
    scores: [
      { label: '놀림 적중률', value: 84 },
      { label: '캡처 유발력', value: 82 },
      { label: '반박 불가율', value: 25 },
    ],
    category: 'general',
    photoTypes: ['unknown', 'daily', 'solo', 'selfie', 'profile'],
    visualTriggers: ['unknown'],
    tone: 'absurd',
  },
  {
    id: 'general-friend-roast-safe',
    title: '넌 딱 친구들이 아끼는데 놀리는 건 못 참는 상이야',
    punchline:
      '미움받는 건 아닌데 공격권은 항상 열려 있다. 사랑과 조롱이 같은 속도로 온다.',
    reasons: [
      '친근함이 놀림 허가증처럼 붙어 있다',
      '친구들이 챙기면서도 가만두지 않는다',
      '반박하면 더 크게 돌아올 상이다',
    ],
    scores: [
      { label: '놀림 허용치', value: 88 },
      { label: '친구 공격권', value: 86 },
      { label: '반박 불가율', value: 28 },
    ],
    category: 'general',
    photoTypes: ['unknown', 'daily', 'solo', 'selfie', 'profile'],
    visualTriggers: ['unknown'],
    tone: 'social',
  },
  {
    id: 'general-screenshot-target',
    title: '넌 딱 결과 나오자마자 단톡방에 박제될 상이야',
    punchline:
      '본인은 웃고 넘기려 했지만 친구들은 저장까지 끝냈다. 이제 별명 하나 추가다.',
    reasons: [
      '결과보다 친구들의 반응 속도가 더 빠르다',
      '보내는 순간 대화방 제목감이 된다',
      '억울해할수록 판정이 더 단단해진다',
    ],
    scores: [
      { label: '박제 속도', value: 91 },
      { label: '별명 생성력', value: 84 },
      { label: '반박 불가율', value: 19 },
    ],
    category: 'general',
    photoTypes: ['unknown', 'daily', 'solo', 'selfie', 'profile'],
    visualTriggers: ['unknown'],
    tone: 'absurd',
  },
] as const satisfies readonly ResultArchetype[];

export type ResultArchetypeId = (typeof RESULT_ARCHETYPES)[number]['id'];

export const RESULT_ARCHETYPE_IDS: readonly string[] = RESULT_ARCHETYPES.map(
  (result) => result.id
);

const ALL_RESULT_ARCHETYPES: readonly ResultArchetype[] = RESULT_ARCHETYPES;

export const NON_HUMAN_ARCHETYPES = ALL_RESULT_ARCHETYPES.filter(
  (result) => result.category === 'non_human'
);

export const GROUP_ARCHETYPES = ALL_RESULT_ARCHETYPES.filter(
  (result) => result.category === 'group'
);

export const ID_PHOTO_ARCHETYPES = ALL_RESULT_ARCHETYPES.filter(
  (result) => result.category === 'id_photo'
);

export const MOTORCYCLE_ARCHETYPES = ALL_RESULT_ARCHETYPES.filter(
  (result) => result.category === 'motorcycle'
);

export const LUXURY_CAR_ARCHETYPES = ALL_RESULT_ARCHETYPES.filter(
  (result) => result.category === 'luxury_car'
);

export const TATTOO_ARCHETYPES = ALL_RESULT_ARCHETYPES.filter(
  (result) => result.category === 'tattoo'
);

export const HANBOK_ARCHETYPES = ALL_RESULT_ARCHETYPES.filter(
  (result) => result.category === 'hanbok'
);

export const KIMONO_ARCHETYPES = ALL_RESULT_ARCHETYPES.filter(
  (result) => result.category === 'kimono'
);

export const SOLO_ARCHETYPES = ALL_RESULT_ARCHETYPES.filter(
  (result) => result.category === 'general_solo'
);

export const SMALL_TALK_SOCIAL_ARCHETYPES = ALL_RESULT_ARCHETYPES.filter(
  (result) => result.cluster === 'small_talk_social'
);

export const SELF_CONFIDENT_PROFILE_ARCHETYPES = ALL_RESULT_ARCHETYPES.filter(
  (result) => result.cluster === 'self_confident_profile'
);

function getClusterPool(cluster: string | undefined) {
  if (!cluster) {
    return [];
  }

  return ALL_RESULT_ARCHETYPES.filter((result) => result.cluster === cluster);
}

const specialPriority: ResultCategory[] = [
  'non_human',
  'group',
  'id_photo',
  'motorcycle',
  'luxury_car',
  'tattoo',
  'hanbok',
  'kimono',
];

const nonHumanPhotoTypes = ['non_human', 'object', 'landscape', 'food', 'pet'];

export function getResultById(id: string): ResultArchetype | undefined {
  return RESULT_ARCHETYPES.find((result) => result.id === id);
}

export function getDefaultResult() {
  return RESULT_ARCHETYPES.find((result) => result.category === 'general')!;
}

function getPoolByCategory(category: ResultCategory) {
  return RESULT_ARCHETYPES.filter((result) => result.category === category);
}

function filterByGenderPresentation(
  pool: readonly ResultArchetype[],
  genderPresentation: GenderPresentation | undefined
) {
  const presentation = genderPresentation ?? 'unknown';
  const commonPool = pool.filter((result) => !result.presentations?.length);

  if (presentation === 'unknown') {
    return commonPool.length > 0 ? commonPool : [...pool];
  }

  const filteredPool = pool.filter((result) => {
    if (!result.presentations?.length) {
      return true;
    }

    return result.presentations.includes(presentation);
  });

  if (filteredPool.length > 0) {
    return filteredPool;
  }

  if (commonPool.length > 0) {
    return commonPool;
  }

  return [...pool];
}

function isAllowedByGenderPresentation(
  result: ResultArchetype,
  genderPresentation: GenderPresentation | undefined
) {
  if (!result.presentations?.length) {
    return true;
  }

  const presentation = genderPresentation ?? 'unknown';

  if (presentation === 'unknown') {
    return false;
  }

  return result.presentations.includes(presentation);
}

function pickFromPool(
  pool: readonly ResultArchetype[],
  selectedResultId?: string,
  genderPresentation?: GenderPresentation
) {
  const filteredPool = filterByGenderPresentation(pool, genderPresentation);
  const selectedResult = selectedResultId
    ? getResultById(selectedResultId)
    : null;

  if (
    selectedResult &&
    filteredPool.some((result) => result.id === selectedResult.id)
  ) {
    return selectedResult;
  }

  return filteredPool[0] ?? pool[0];
}

function getSpecialCategory({
  photoType,
  personCount,
  detectedTriggers,
}: {
  photoType?: string;
  personCount?: number;
  detectedTriggers?: string[];
}): ResultCategory | null {
  if (personCount === 0 || nonHumanPhotoTypes.includes(photoType ?? '')) {
    return 'non_human';
  }

  if ((personCount ?? 0) >= 2 || photoType === 'group') {
    return 'group';
  }

  if (photoType === 'id_photo' || photoType === 'passport') {
    return 'id_photo';
  }

  const triggers = new Set(detectedTriggers ?? []);

  if (triggers.has('motorcycle')) {
    return 'motorcycle';
  }

  if (triggers.has('luxury_car')) {
    return 'luxury_car';
  }

  if (triggers.has('tattoo')) {
    return 'tattoo';
  }

  if (triggers.has('hanbok')) {
    return 'hanbok';
  }

  if (triggers.has('kimono')) {
    return 'kimono';
  }

  return null;
}

function scoreCriteria(
  result: ResultArchetype,
  signals: {
    photoType?: string;
    gaze?: string;
    expression?: string;
    pose?: string;
    framing?: string;
    outfitStyle?: string;
    photoMood?: string[];
  }
) {
  const match = result.match;

  if (!match) {
    return 0;
  }

  if (signals.gaze && match.excludedGaze?.includes(signals.gaze)) {
    return 0;
  }

  if (
    signals.expression &&
    match.excludedExpression?.includes(signals.expression)
  ) {
    return 0;
  }

  if (signals.pose && match.excludedPose?.includes(signals.pose)) {
    return 0;
  }

  if (signals.framing && match.excludedFraming?.includes(signals.framing)) {
    return 0;
  }

  if (
    signals.outfitStyle &&
    match.excludedOutfitStyle?.includes(signals.outfitStyle)
  ) {
    return 0;
  }

  if (
    signals.photoMood?.some((mood) => match.excludedPhotoMood?.includes(mood))
  ) {
    return 0;
  }

  let score = 0;

  if (signals.photoType && match.photoTypes?.includes(signals.photoType)) {
    score += 3;
  }

  if (signals.gaze && match.gaze?.includes(signals.gaze)) {
    score += 3;
  }

  if (signals.expression && match.expression?.includes(signals.expression)) {
    score += 3;
  }

  if (signals.pose && match.pose?.includes(signals.pose)) {
    score += 3;
  }

  if (signals.framing && match.framing?.includes(signals.framing)) {
    score += 3;
  }

  if (signals.outfitStyle && match.outfitStyle?.includes(signals.outfitStyle)) {
    score += 3;
  }

  if (signals.photoMood?.some((mood) => match.photoMood?.includes(mood))) {
    score += 2;
  }

  if (match.minScore && score < match.minScore) {
    return 0;
  }

  return score;
}

function hashToIndex(seed: string | undefined, poolLength: number) {
  if (!seed || poolLength <= 0) {
    return 0;
  }

  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return hash % poolLength;
}

function isSmallTalkSocialSignals(signals: {
  selectedCluster?: string;
  selectedResultId?: string;
  alternateResultIds?: string[];
  photoType?: string;
  gaze?: string;
  expression?: string;
  pose?: string;
  framing?: string;
  photoMood?: string[];
}) {
  const selectedResult = signals.selectedResultId
    ? getResultById(signals.selectedResultId)
    : null;
  const alternateHasCluster = signals.alternateResultIds
    ?.map((id) => getResultById(id))
    .some((result) => result?.cluster === 'small_talk_social');
  const clusterWasSelected =
    signals.selectedCluster === 'small_talk_social' ||
    selectedResult?.cluster === 'small_talk_social' ||
    alternateHasCluster;

  if (!clusterWasSelected) {
    return false;
  }

  const blockedMoods = ['awkward', 'chic', 'calm', 'quiet_presence', 'tryhard'];

  return (
    (signals.expression === 'natural_smile' ||
      signals.expression === 'playful') &&
    signals.pose === 'natural' &&
    signals.gaze === 'looking_at_camera' &&
    (signals.photoMood?.includes('social') ||
      signals.photoMood?.includes('bright')) &&
    !signals.photoMood?.some((mood) => blockedMoods.includes(mood)) &&
    ['solo', 'daily'].includes(signals.photoType ?? '') &&
    ['third_person_photo', 'upper_body', 'chest_up'].includes(
      signals.framing ?? ''
    )
  );
}

function isSelfConfidentProfileSignals(signals: {
  selectedCluster?: string;
  selectedResultId?: string;
  alternateResultIds?: string[];
  photoType?: string;
  gaze?: string;
  expression?: string;
  pose?: string;
  framing?: string;
  outfitStyle?: string;
  photoMood?: string[];
}) {
  const selectedResult = signals.selectedResultId
    ? getResultById(signals.selectedResultId)
    : null;
  const alternateHasCluster = signals.alternateResultIds
    ?.map((id) => getResultById(id))
    .some((result) => result?.cluster === 'self_confident_profile');
  const clusterWasSelected =
    signals.selectedCluster === 'self_confident_profile' ||
    selectedResult?.cluster === 'self_confident_profile' ||
    alternateHasCluster;

  if (!clusterWasSelected) {
    return false;
  }

  return (
    ['selfie', 'profile', 'close_up', 'chest_up'].includes(
      signals.photoType ?? ''
    ) &&
    signals.gaze === 'looking_at_camera' &&
    ['natural_smile', 'neutral', 'playful'].includes(
      signals.expression ?? ''
    ) &&
    ['natural', 'posed'].includes(signals.pose ?? '') &&
    ['face_close_up', 'chest_up', 'selfie'].includes(signals.framing ?? '') &&
    !signals.photoMood?.some((mood) =>
      ['awkward', 'tryhard', 'quiet_presence'].includes(mood)
    )
  );
}

function isClusteredResult(result: ResultArchetype) {
  return Boolean(result.cluster);
}

function pickClusterResult(
  pool: readonly ResultArchetype[],
  imageHash?: string,
  genderPresentation?: GenderPresentation,
  selectedCluster?: string
) {
  const filteredPool = filterByGenderPresentation(pool, genderPresentation);
  const resolved =
    filteredPool[hashToIndex(imageHash, filteredPool.length)] ??
    filteredPool[0] ??
    pool[0];

  console.log('NEONDAK_PRESENTATION_FILTER_DEBUG', {
    genderPresentation: genderPresentation ?? 'unknown',
    selectedCluster,
    beforeCount: pool.length,
    afterCount: filteredPool.length,
    resolvedResultId: resolved?.id,
    resolvedTitle: resolved?.title,
    presentations: resolved?.presentations ?? 'common',
  });

  return resolved;
}

function pickSmallTalkSocialResult(
  imageHash?: string,
  genderPresentation?: GenderPresentation
) {
  return (
    pickClusterResult(
      SMALL_TALK_SOCIAL_ARCHETYPES,
      imageHash,
      genderPresentation,
      'small_talk_social'
    ) ??
    SMALL_TALK_SOCIAL_ARCHETYPES[0]
  );
}

function pickSelfConfidentProfileResult(
  imageHash?: string,
  genderPresentation?: GenderPresentation
) {
  return (
    pickClusterResult(
      SELF_CONFIDENT_PROFILE_ARCHETYPES,
      imageHash,
      genderPresentation,
      'self_confident_profile'
    ) ??
    SELF_CONFIDENT_PROFILE_ARCHETYPES[0]
  );
}

function pickResultFromSelectedCluster({
  selectedCluster,
  imageHash,
  genderPresentation,
}: {
  selectedCluster?: string;
  imageHash?: string;
  genderPresentation?: GenderPresentation;
}) {
  if (!selectedCluster || selectedCluster === 'none') {
    return undefined;
  }

  return pickClusterResult(
    getClusterPool(selectedCluster),
    imageHash,
    genderPresentation,
    selectedCluster
  );
}

function pickSoloResult(signals: {
  photoType?: string;
  gaze?: string;
  expression?: string;
  pose?: string;
  framing?: string;
  outfitStyle?: string;
  photoMood?: string[];
  selectedCluster?: string;
  selectedResultId?: string;
  alternateResultIds?: string[];
  imageHash?: string;
  genderPresentation?: GenderPresentation;
}) {
  if (isSmallTalkSocialSignals(signals)) {
    return pickSmallTalkSocialResult(
      signals.imageHash,
      signals.genderPresentation
    );
  }

  if (isSelfConfidentProfileSignals(signals)) {
    return pickSelfConfidentProfileResult(
      signals.imageHash,
      signals.genderPresentation
    );
  }

  const selectedResult = signals.selectedResultId
    ? getResultById(signals.selectedResultId)
    : null;

  if (
    selectedResult?.category === 'general_solo' &&
    !isClusteredResult(selectedResult) &&
    isAllowedByGenderPresentation(selectedResult, signals.genderPresentation) &&
    scoreCriteria(selectedResult, signals) > 0
  ) {
    return selectedResult;
  }

  const alternateResult = signals.alternateResultIds
    ?.map((id) => getResultById(id))
    .find(
      (result) =>
        result?.category === 'general_solo' &&
        !isClusteredResult(result) &&
        isAllowedByGenderPresentation(result, signals.genderPresentation) &&
        scoreCriteria(result, signals) > 0
    );

  if (alternateResult) {
    return alternateResult;
  }

  const rankedResults = SOLO_ARCHETYPES.filter(
    (result) =>
      !isClusteredResult(result) &&
      isAllowedByGenderPresentation(result, signals.genderPresentation)
  )
    .map((result) => ({
      result,
      score: scoreCriteria(result, signals),
    }))
    .sort((left, right) => right.score - left.score);

  const bestResult = rankedResults[0];

  if (bestResult && bestResult.score > 0) {
    return bestResult.result;
  }

  const photoTypeMatchedResult = SOLO_ARCHETYPES.find(
    (result) =>
      !isClusteredResult(result) &&
      isAllowedByGenderPresentation(result, signals.genderPresentation) &&
      (result.photoTypes as readonly string[]).includes(signals.photoType ?? '')
  );

  return photoTypeMatchedResult ?? SOLO_ARCHETYPES[0] ?? getDefaultResult();
}

export function pickResultBySignals({
  photoType,
  personCount,
  gaze,
  expression,
  pose,
  framing,
  outfitStyle,
  photoMood,
  detectedTriggers,
  selectedCluster,
  selectedResultId,
  alternateResultIds,
  imageHash,
  genderPresentation,
}: {
  photoType?: string;
  personCount?: number;
  gaze?: string;
  expression?: string;
  pose?: string;
  framing?: string;
  outfitStyle?: string;
  photoMood?: string[];
  detectedTriggers?: string[];
  selectedCluster?: string;
  selectedResultId?: string;
  alternateResultIds?: string[];
  imageHash?: string;
  genderPresentation?: GenderPresentation;
}) {
  const selectedClusterResult = pickResultFromSelectedCluster({
    selectedCluster,
    imageHash,
    genderPresentation,
  });

  if (selectedClusterResult) {
    return selectedClusterResult;
  }

  const specialCategory = getSpecialCategory({
    photoType,
    personCount,
    detectedTriggers,
  });

  if (specialCategory) {
    return pickFromPool(
      getPoolByCategory(specialCategory),
      selectedResultId,
      genderPresentation
    );
  }

  if (
    photoType &&
    [
      'solo',
      'selfie',
      'mirror_selfie',
      'close_up',
      'chest_up',
      'upper_body',
      'full_body',
      'profile',
      'daily',
    ].includes(photoType)
  ) {
    return pickSoloResult({
      photoType,
      gaze,
      expression,
      pose,
      framing,
      outfitStyle,
      photoMood,
      selectedCluster,
      selectedResultId,
      alternateResultIds,
      imageHash,
      genderPresentation,
    });
  }

  const selectedResult = selectedResultId
    ? getResultById(selectedResultId)
    : null;

  if (
    selectedResult &&
    !specialPriority.includes(selectedResult.category) &&
    selectedResult.category !== 'general' &&
    isAllowedByGenderPresentation(selectedResult, genderPresentation)
  ) {
    return selectedResult;
  }

  return getDefaultResult();
}
