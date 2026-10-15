# IF LAB · 사람의 가능성에, 기술의 상상력을 더하다.

이경심(Chloe Lee)의 전문성과 교육·기술 프로젝트를 연결하는 브랜드 웹사이트입니다.

- IF LAB: 전문성과 비즈니스
- NOLCO: 함께 배우고 나누는 사회적 가치
- ASNM: 아이디어를 실제 기술과 서비스로 구현하는 역량

## 실행

별도 패키지 설치 없이 Python 3와 브라우저로 실행합니다.

```sh
python3 -m http.server 8000 --directory dist
```

브라우저에서 `http://localhost:8000`을 엽니다. 직접 파일로 열어도 주요 페이지를 볼 수 있습니다.

```sh
npm run build
```

위 빌드는 정적 페이지·내부 링크·다운로드 파일을 검사합니다. Python 3가 필요합니다. 파일을 번들링하거나 외부 패키지를 설치하지 않습니다. 결과물은 이미 `dist/`에 있습니다.

## 구조

- `dist/index.html`: 브랜드, 4가지 서비스, ASNM, 교육 이력, NOLCO, 대표 소개, 자료실, FAQ, 문의
- `dist/services.html`: 서비스별 대상·주제·산출물과 맞춤 문의
- `dist/asnm.html`: 제품의 목적·모듈·개발 상태·한계
- `dist/impact.html`: NOLCO 활동
- `dist/resources.html`: 가입 없는 PDF·Markdown 자료실
- `dist/privacy.html`: 현재 데이터 처리 방식
- `dist/404.html`: 찾을 수 없는 페이지
- `dist/assets/styles.css`, `additions.css`: 원본 디자인 기반
- `dist/assets/refined.css`: 따뜻한 크림·플럼 리디자인과 반응형 개선
- `dist/assets/site.js`: 메뉴·모션·이력 필터·서비스 선택·메일 초안
- `dist/resources/`: 소개서 PDF 및 실무 자료 PDF/Markdown
- `scripts/verify_static.py`: 의존성 없는 정적 검사
- `scripts/test_interactions.cjs`: 브라우저 DOM 대역을 이용한 핵심 동작 검사

## 콘텐츠 수정

페이지의 HTML을 수정합니다. 문의 서비스 옵션을 변경하면 `assets/site.js`의 `serviceMap`, `hints`도 함께 수정합니다. 새 케이스는 `case-card`와 `data-category` 속성을 유지합니다. CSS는 `refined.css`에 추가하여 원본 기반을 보존합니다.

이메일 주소는 HTML, JavaScript, 다운로드 자료에서 함께 관리합니다. 현재 원본의 연락처를 유지했습니다. 실제 운영용 주소로 바꿀 때 PDF 내부 연락처도 바꿔야 합니다.

## 개인정보 최소화

출신 학교명·졸업연도를 노출하지 않고 전공·학위만 표시합니다. 학교 정보가 포함된 원본 경력 페이지와 개발자 프로필의 직접 링크는 소개서로 대체했습니다. 기존 ASNM 자체나 외부 페이지는 수정하지 않았으며, 그 서비스 안의 정보에는 이 변경이 적용되지 않습니다.

원본의 확인되지 않은 수업 횟수 숫자는 제거했습니다. 기관 수행 이력은 첨부본에 있는 내용을 보존했으며 공식 제휴·보증으로 표현하지 않습니다. 학위 수여 상태와 수행 이력의 최신성은 운영자가 확인해야 합니다.

## 문의의 실제 범위

문의 내용은 브라우저에서 이메일 초안으로 변환됩니다. 사이트 서버나 별도 데이터베이스에 전송하지 않습니다. 이메일 앱에서 보내기를 눌러야 실제 전달됩니다. 앱 연결 문제·긴 본문 잘림에 대비해 클립보드 복사와 수동 복사 대안을 제공합니다. 문의 자동 접수·CRM은 연결하지 않았습니다.

## 저장소와 웹사이트

- 소스 저장소: https://github.com/chloeisLovely/if-lab
- 웹사이트: https://if-lab-human-potential.glassyharp3.chatgpt.site/
- 현재 웹사이트는 소유자 전용 검토용입니다. GitHub 저장소의 코드 변경이 자동으로 이 사이트에 배포되지는 않습니다.

## 배포와 검증

현재 검토용 사이트는 본인 전용입니다. 공개 검색을 방지하는 `noindex` 및 `robots.txt`가 포함됩니다. 공개 배포로 변경할 때 `DEPLOY.md`를 따릅니다. 이 저장소는 사이트 소스 보관용입니다. Cloudflare 계정 연결과 자동 배포는 구성하지 않았습니다.

`QA_REPORT.md`에 실제 검사 범위와 브라우저 검증 제한을 기록합니다. 테스트를 통과했다고 모바일 화면을 실제 확인한 것으로 해석하면 안 됩니다.
