(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const menuBtn = $('.menu-toggle'), menu = $('#mobile-menu');
  function closeMenu(returnFocus = false) {
    if (!menu || !menuBtn) return;
    menu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.setAttribute('aria-label', '메뉴 열기');
    if (returnFocus) menuBtn.focus();
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => {
      const open = menuBtn.getAttribute('aria-expanded') !== 'true';
      menuBtn.setAttribute('aria-expanded', String(open)); menuBtn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기'); menu.hidden = !open;
    });
    $$('a', menu).forEach(a => a.addEventListener('click', () => closeMenu()));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) closeMenu(true); });
    document.addEventListener('click', e => { if (!menu.hidden && !menu.contains(e.target) && !menuBtn.contains(e.target)) closeMenu(); });
    window.matchMedia('(min-width:781px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
  }
  if ($('#year')) $('#year').textContent = new Date().getFullYear();
  const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if ('IntersectionObserver' in window && !reduced) {
    document.documentElement.classList.add('js-reveal');
    const observer = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); observer.unobserve(e.target); }
    }), {threshold: .06});
    $$('.reveal').forEach(e => observer.observe(e));
  }
  $$('.case-filters button').forEach(button => button.addEventListener('click', () => {
    $$('.case-filters button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    let count = 0;
    $$('.case-card').forEach(card => {
      card.hidden = !(button.dataset.filter === 'all' || card.dataset.category === button.dataset.filter);
      if (!card.hidden) { count++; card.classList.add('is-visible'); }
    });
    $('#case-status').textContent = `${button.textContent} · ${count}건`;
  }));
  const form = $('#inquiry-form');
  if (!form) return;
  const service = $('#service'), status = $('#form-status');
  const serviceMap = { ai:'AI·AX 교육 / 워크숍', data:'데이터 분석 / AI 솔루션', learning:'교육과정 / 콘텐츠 개발', future:'항공우주·공학·창업 융합교육' };
  const hints = {
    'AI·AX 교육 / 워크숍':'대상자의 AI 활용 경험, 다루고 싶은 실제 업무, 교육 목표를 알려주세요.',
    '데이터 분석 / AI 솔루션':'분석할 데이터의 종류, 해결할 질문, 필요한 결과물을 알려주세요. 개인정보·기밀 원자료는 입력하지 마세요.',
    '교육과정 / 콘텐츠 개발':'교육 대상, 과정의 길이, 필요한 교안·실습 자료를 알려주세요.',
    '항공우주·공학·창업 융합교육':'대상 연령, 관심 주제, 직접 만들어 보고 싶은 프로젝트를 알려주세요.',
    '기타 협업 / 강연':'함께 만들고 싶은 변화와 협업 아이디어를 알려주세요.'
  };
  function adaptForm() {
    $('#message').placeholder = hints[service.value] || hints['기타 협업 / 강연'];
    const field = $('#participants-field'); field.hidden = service.value === serviceMap.data;
    $('#participants').disabled = field.hidden;
  }
  const selected = serviceMap[new URLSearchParams(location.search).get('service')];
  if (selected) service.value = selected;
  service.addEventListener('change', adaptForm); adaptForm();
  $$('[data-service]').forEach(a => a.addEventListener('click', () => { service.value = a.dataset.service; adaptForm(); }));
  function collect() {
    const fields = [['문의 유형','service'],['기관 / 소속','organization'],['담당자 성함','name'],['회신 이메일','email'],['희망 일정','schedule'],['참여 인원','participants'],['예산 범위','budget'],['프로젝트 이야기','message']];
    return fields.filter(([,key]) => !form.elements[key].disabled && form.elements[key].value.trim()).map(([label,key]) => `${label}: ${form.elements[key].value.trim()}`).join('\n\n');
  }
  function valid() {
    ['organization','name','email','message'].forEach(key => { form.elements[key].value = form.elements[key].value.trim(); });
    if (!form.reportValidity()) {status.textContent = '필수 항목과 이메일 초안 작성 동의를 확인해 주세요.'; return false;}
    return true;
  }
  $('#copy-inquiry').addEventListener('click', async () => {
    if (!valid()) return;
    const body = collect();
    try {
      await navigator.clipboard.writeText(body); status.textContent = '내용을 복사했습니다. chloehappylee@gmail.com 앞으로 이메일에 붙여 넣어 보내 주세요.';
    } catch {
      let fallback = $('#copy-fallback');
      if (!fallback) { fallback = document.createElement('textarea'); fallback.id = 'copy-fallback'; fallback.readOnly = true; fallback.setAttribute('aria-label','복사할 문의 내용'); fallback.style.cssText = 'width:100%;min-height:180px;font-size:14px;margin-top:15px'; $('#copy-inquiry').after(fallback); }
      fallback.value = body; fallback.focus(); fallback.select(); status.textContent = '아래 내용이 선택되었습니다. Ctrl+C 또는 Cmd+C로 복사해 이메일에 붙여 넣어 주세요.';
    }
  });
  form.addEventListener('submit', e => {
    e.preventDefault(); if (!valid()) return;
    const subject = `[IF LAB 협업 문의] ${service.value} / ${$('#organization').value}`;
    const mailto = `mailto:chloehappylee@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(collect())}`;
    status.textContent = '이메일 앱에서 초안을 확인하고 보내기를 눌러 주세요. 열리지 않거나 내용이 잘리면 아래의 문의 내용 복사를 이용하세요.';
    window.location.href = mailto;
  });
})();
