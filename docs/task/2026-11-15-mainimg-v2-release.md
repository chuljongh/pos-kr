# 펼친 장부·QR 메인 이미지 교체

- 사용자 승인: 첨부한 mainimg-v2.png를 pos.kr의 mainimg로 교체하고 배포한다.
- 기준: main / 10a0455f0731540318d36b77a770b062de79eecd. 기존 IMPROVEMENTS.md 수정과 미추적 업무 자료는 이번 커밋에서 제외한다.
- 원본: Sales/data/meal_ledger_email_variants_20261111_v2/assets/mainimg-v2.png. 사진 내용은 수정하지 않고 웹용 크기·포맷만 맞춘다.
- 범위: mainimg.png, mainimg.jpg, mainimg.webp, mainimg-800.webp 및 이를 사용하는 메인·제안서·브로셔의 캐시 버전. 기존 mainimg_old 파일과 이전 버전 Git 이력은 보존한다.
- 완료 조건: 원본 일치, 이미지 디코딩·크기 및 기존 SEO 검사 통과, PC·모바일 표시 확인, origin/main 푸시와 Vercel 배포·공개 파일 확인.
- 적용 완료: PNG 1774×887 원본 완전복사, JPEG/WebP 1600×800, 모바일 WebP 800×400. 원본 SHA256: c3e79cd2d358a0f50c220b79c7b80da1a4c2855144e47742b2bf6f9b4725563d.
- 기존 이미지 캐시가 일주일 유지될 수 있어 CSS·사용 이미지 URL에 v=20261115를 적용했다. 원본 mainimg 파일명은 유지하며, 동일 JPEG를 쓰는 제안서·브로셔의 참조도 함께 갱신했다. 대체 텍스트는 펼친 장부와 QR·스캐너 합성 구성에 맞췄다.
- 로컬 검증: 4종 이미지 RGB·디코딩·크기 확인, python scripts/check-seo.py --check-images(17페이지) 및 git diff --check 통과. Orca 1440×960 / 390×844에서 새 이미지 사용, 모바일 이미지 2:1 표시 및 문서 가로 넘침 없음 확인. 캡처 육안 확인 완료.
- 로컬 file URL 조회 실패 후 임시 HTTP 서버로 검증했다. 운영 검증 이후 서버 종료·리스너 부재, 자체 Orca 탭 닫힘 및 임시 캡처 5개 삭제·부재까지 확인했다. 원본 이미지·이전 버전·다른 업무 자료는 보존했다.
- 변경된 HTML/CSS는 이미지 URL·버전·alt만 수정한 것을 diff로 검토했다. 기존 mainimg_old 및 무관한 변경은 보존했다.
- 배포 완료: 변경 10개 파일을 22ef5ef53a3130fc8306cf1b73895b4762b42f88로 커밋하고 origin/main에 push했다. Vercel pos-kr D9bqwvRwhfn7N9zBRteGJxevpvS6 및 pos-kr-cafe BcEZSxGQBT6w1MeJAsqGkQqH7PWb 모두 success.
- 운영 검증: 홈·이미지4종·CSS·제안서·브로셔2종 총9주소 HTTP200 및 배포 커밋 바이트 일치. 실제 공개 PC1440에서는 새 WebP 배경, 모바일390에서는 800px WebP 밴드가 선택됨을 확인하고 양쪽 캡처를 육안 검토했다. 문서 가로 넘침 없음·깨진 이미지 없음.
- 사용자 요청의 이미지 교체·배포·공개 확인 완료. 기존 IMPROVEMENTS.md 변경은 이번 커밋에 섞지 않았다. 이 문서의 완료 상태만 후속 커밋한다.
