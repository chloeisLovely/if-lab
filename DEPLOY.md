# 운영과 배포

## 현재 상태

본인 전용 검토용 사이트로 배포합니다. 기존 ASNM 저장소는 수정하지 않았습니다. GitHub 저장소 이름은 if-lab입니다. Cloudflare 계정 연결은 별도 단계입니다. 소스 파일은 별도 사이트에 동기화되며, 이 동기화가 GitHub 업로드나 PR 생성을 의미하지 않습니다.

## GitHub → Cloudflare Pages로 옮길 때

1. 본인 계정에서 `if-lab`라는 별도의 Private 저장소를 생성합니다.
2. 이 ZIP을 풀어 `dist/`, `scripts/`, `package.json`, 문서를 업로드합니다. 기존 ASNM 저장소에 올리지 않습니다.
3. 개발 브랜치에서 변경하고 Pull Request에서 `python3 scripts/verify_static.py` 결과를 확인합니다.
4. Cloudflare Pages에서 새 저장소를 연결합니다. 배포 브랜치는 `main`, 정적 출력 폴더는 **`dist`**입니다.
5. 빌드 명령은 `npm run build`를 사용할 수 있습니다. 이는 Python 3로 정적 파일 무결성을 검사합니다. 별도 빌드 없이 올릴 경우 명령은 생략하고 동일한 `dist`를 사용합니다.
6. 공개 배포 전 실제 최종 URL을 결정하고 모든 HTML의 canonical·og:url·og:image와 sitemap.xml의 주소를 변경합니다.
7. 공개를 결정한 뒤 HTML의 `noindex, nofollow`를 제거하고 robots.txt를 공개용으로 변경합니다. 인증·접근 제한과 noindex는 다른 기능입니다.
8. 배포 성공 기록, HTTPS, 첫 화면, 모바일 메뉴, 필터, 문의 이메일 초안, 4개 PDF 다운로드를 실제 브라우저에서 확인합니다.

Cloudflare 관리 화면의 실제 항목은 계정 화면을 기준으로 설정합니다. 도메인 구매나 유료 옵션은 이 작업에 포함하지 않았습니다.

## 커스텀 도메인

선택한 호스팅 서비스의 Custom domains에서 소유 도메인을 등록하고 안내된 DNS 레코드를 사용합니다. 값은 서비스가 반환한 것을 그대로 사용하며 미리 추정하지 않습니다. 인증서 발급 완료 후 기본 주소와 도메인 주소의 동작을 확인합니다.

## 1개월 운영

- 운영용 연락처와 학위·이력 최신성 확정
- 실제 브라우저·모바일 검토 후 공개 주소 연결
- 승인된 교육 현장 사진 3~5장과 실제 사례별 산출물 보강
- 문의 유형별 응답 템플릿 준비

## 3개월 운영

- 대표 서비스별 독립 페이지와 실제 교육 사례 확장
- 리소스 다운로드 이후 연관 과정 탐색 동선 개선
- 필요할 때만 문의 접수 API와 운영자 전용 관리 화면 구축
- 접수 기능을 추가하면 개인정보 항목·이용 목적·보관 및 삭제 기준과 스팸 방지 설계
- 유료 자료는 실제 콘텐츠·결제·환불·이용 조건이 준비된 뒤 별도 공개


## GitHub Pages 자동 배포

사용자의 2026-10-15 요청에 따라 GitHub Pages용 자동 배포 워크플로를 추가합니다.

- `.github/workflows/deploy-pages.yml`: `main` 변경 시 검증·배포, PR에서는 검증만 수행
- `scripts/prepare_pages.py`: `dist/`를 `_site/`로 복사하고 GitHub Pages 주소·OG·사이트맵·robots·404 경로를 맞춤
- 배포 주소: `https://chloeislovely.github.io/if-lab/` (실제 배포 성공 후 사용 가능)
- 저장소 Settings → Pages → Source를 `GitHub Actions`로 설정해야 합니다.
- 비공개 저장소의 Pages 사용이 현재 플랜에서 제한되는 경우 저장소 공개 전환 또는 지원 플랜이 필요합니다. 자동으로 공개 전환하거나 유료 플랜을 구매하지 않습니다.
- `main`으로 병합되면 자동 실행됩니다. 설정 복구 후 재배포는 Actions → Deploy IF LAB to GitHub Pages → Run workflow로 실행합니다.
- GitHub Pages용 `_site/`에는 웹 파일과 다운로드 자료만 포함되며 루트 운영 문서·스크립트는 포함되지 않습니다.
- 기존 본인 전용 사이트의 소스와 접근 설정은 이 워크플로가 변경하지 않습니다.
