'use strict';
var dim = '<div class="dim" aria-hidden="true"></div>';
var ua = navigator.userAgent.toLocaleLowerCase();
var isAOS = ua.indexOf('android') !== -1;
var isiOS = ua.indexOf('iphone') !== -1;

function androidV(ua) {
  ua = (ua || navigator.userAgent).toLowerCase(); 
  var match = ua.match(/android\s([0-9\.]*)/i);
  return match ? match[1] : undefined;
};

$(function(){
  if (isAOS) {
    $('html').addClass('AOS');
  } else {
    $('html').addClass('iOS');
  }

  registUI();
});

var registUI = function(){
  if ( $('#header').length ) { _headerControl(); } // 스크롤에 따른 Header
  if ( $('.wrap_contents .fnFixedTop').length ) { _fixedTopInPage($('.fnFixedTop')); } // 스크롤에 따른 페이지 상단고정
  if ( $('.wrap_link_list').length ) { _tabHightlight(); } // 링크 탭 하이라이트
  if ( isiOS && $('.inp').length && $('.section_bottom_fixed').length ) { _iOSInpFixdPos(); } // iOS 키패드 하단고정영역
  if ( $('.wrap_inp').length ) { _inpControl(); } // 인풋 인터렉션
  if ( $('.wrap_dropdown').length ) { _dropDown(); } // dropdown 선택
  if ( $('.wrap_tab_btn').length ) { _tabContents(); } // 탭
  if ( $('.fnSimpleAcco').length ) { _simpleAcco(); } // 단일 아코디언
  if ( $('.section_faq').length ) { _faqAcco(); } // faq 아코디언
  if ( $('.section_terms .btn_acco').length ) { _agreeAccoBtn(); } // 약관동의 아코디언 기능
  if ( $('.section_terms .wrap_chk_all').length ) { _agreeCheckAll(); } // 약관전체동의
  if ( $('.wrap_tooltip').length ) { _tooltip(); } // 툴팁
  if ( $('.wrap_layer').length ) { _layerPop(); } // 레이어팝업
  
  if ( $('.wrap_item_benefit .list_benefit').length ) { _showBenefitList(); } // 혜택리스트
  if ( $('.wrap_loop_scrl').length ) { _loopScrlCont(); } // 무한스크롤링 컨텐츠
  if ( $('.fnFitToCont').length ) { _textFitToCont(); } // 택스트 사이즈 조정
  
  if ( $('.chart_bar_stacked').length ) { _barChartStacked(); } // stacked bar chart
  if ( $('.wrap_vdb_list').length ) { fnVdbCoinChart.animate(); } // 내가받은 혜택 동전차트 애니메이션 실행

};

/**
  * @name _headerControl()
  * @description 스크롤에 따른 Header
  */
var _headerControl = function(){
  //  페이지 스크롤
  var defaultHeight = 50; 

  $(window).on('scroll', function() {
    if ($(window).scrollTop() > 0) {
      $('#header').addClass('scrolled');
    }else {
      $('#header').removeClass('scrolled');
    }
  });
};

/**
  * @name _headerControl()
  * @description F-POP 콘텐츠 스크롤에 따른 Header
  * @param {Element} el 팝업 element
  */
var _headerPopControl = function(el){
  var defaultHeight = 50; 

  $(el).find('.content_layer').on('scroll', function(){
    var $this = $(this);

    var $header = $this.closest('.inner_layer').find('.head_layer');
    var $fixedEl = $this.find('.fnFixedTop');
    var setHeight = parseInt($fixedEl.attr('data-height')) + defaultHeight;

    if ($this.scrollTop() > 0) {
      $header.addClass('scrolled');
      if ( $fixedEl.length ) {
        _setFixedTop($fixedEl, $header, setHeight);
      }
    }else {
      $header.removeClass('scrolled');
      if ( $fixedEl.length ) {
        _clearFixedTop($fixedEl, $header);
      }
    }
  });
}

/**
  * @name _fixedTopInPage()
  * @description 페이지 스크롤에 따른 콘텐츠 상단고정
  */
var _fixedTopInPage = function(el) {
  var $fixedEl = $(el);
  var $header = $fixedEl.closest('.wrap_contents').siblings('#header').find('.inner_fixed');
  var headerHeight = $('#header').outerHeight(true);

  var setHeight = headerHeight + parseInt($fixedEl.attr('data-height'));

  $(window).on('scroll', function() {
    if ($(window).scrollTop() > 0) {
      _setFixedTop($fixedEl, $header, setHeight);
    } else {
      _clearFixedTop($fixedEl, $header);
    }
  });
}

/**
  * @name _fixedContent()
  * @description 스크롤에 따른 콘텐츠 상단고정
  * @param {element | string} fixedEl 고정할 element
  * @param {number} fixPos 고정할 element position top
  * @param {element | string} header 고정헤더 element
  * @param {setHeight} header 고정헤더 element 변경 height 
  */
function _setFixedTop(fixedEl, header, setHeight) {
  $(fixedEl).addClass('scrolled');
  $(header).css({
    'height': setHeight,
  });
}
function _clearFixedTop(fixedEl, header) {
  $(fixedEl).removeClass('scrolled');
  $(header).attr('style','');
}

/**
  * @name _tabHightlight()
  * @description 링크 탭 하이라이트 컬러
  */
var _tabHightlight = function() {
  $(document).on('touchstart', '.wrap_link_list a', function(e){
    if (!$(this).hasClass('wrap_box')) {
      $(this).addClass('active');
    }
  });
  $(document).on('touchend', '.wrap_link_list a', function(e){
    $(this).removeClass('active');
  });
};

/**
  * @name _iOSInpFixdPos()
  * @description // iOS 키패드 오픈시 하단고정 영역 키패드 위로
  */
var _iOSInpFixdPos = function() {
  var fixedEl = $('.section_bottom_fixed > div');
  var inp = $('.inp');
  var height = window.visualViewport.height;
  var viewport = window.visualViewport;

  window.visualViewport.addEventListener('resize', resizeHandler);
  $(window).on('touchstart', function(e) {
    var el = e.target.classList;
    if (inp.is(':focus') && !el.contains('inp') && !el.contains('btn_ico_clear') ) {
      inp.blur();
    }
  })

  function resizeHandler() {
    fixedEl.each(function(idx, el) {
      var $el = $(el);
      var current = $el.css('bottom').replace(/[^0-9]/g, '');
      var pos = -(height - viewport.height) + 'px';
      
      $el.css('transform', 'translateY(' +  pos + ')');
    });
  }
};

/**
  * @name _inpControl()
  * @description // 인풋 입력창 인터렉션
  */
var _inpControl = function() {
  var inp = $('.wrap_inp .inp');
  _inpChkVal(inp);

  // 입력 삭제 버튼 추가
  inp.each(function(idx, el) {
    if ( $(el).siblings('.btn_ico_clear').length <= 0 ) {
      $(el).closest('.box_inp').append('<button type="button" class="btn_ico_clear"><span class="blind">입력삭제</span></button>');
    }
  });

  inp.on('focus blur', function(e){
    _inpChkVal($(this));

    $(this).closest('.box_inp').find('.btn_ico_clear').bind('click', function() {
      $(this).siblings('.inp').val('').focus().click();
      $(this).closest('.box_inp').removeClass('show_btn');
    });
    $(this).focusout(function(){
      var $this = $(this);
      setTimeout(function(){
          $this.closest('.box_inp').removeClass('show_btn');
      },100)
    });
    if( $(this).val() !== '' && $(this).is(':focus') ){
      $(this).closest('.box_inp').addClass('show_btn');
    }
  });

  inp.bind('keyup change',function(){
    $(this).closest('.box_inp').addClass('show_btn');
    _inpChkVal($(this));
  });
};

/**
  * @name _inpChkVal()
  * @description // 인풋 value에 따른 클래스
  * @param {string | Element} el 인풋 
  */
var _inpChkVal = function(el) {
  $(el).each(function(){
    if ($(this).val() !== '') {
      $(this).closest('.box_inp').addClass('hasVal');
      $(this).closest('.box_inp').addClass('show_btn');
    } else {
      $(this).closest('.box_inp').removeClass('hasVal');
      $(this).closest('.box_inp').removeClass('show_btn');
    }
  });
};

/**
  * @name _dropDown()
  * @description // dropdown 산텍
 */
var _dropDown = function() {
  $('.wrap_dropdown').each(function() {
    var $el = $(this);
    var $btnDropDown = $(this).find('.btn_dropdown');
    var $list = $(this).find('.list_dropdown');
    var $selBtn = $list.find('button');

    $btnDropDown.on('click', function() {
      if ($el.hasClass('on')) {
        $el.removeClass('on');
      } else {
        $el.addClass('on');
      }
    });
  
    $selBtn.on('click', function() {
      var selected = $(this).find('span').text();
      $el.find('.current').text(selected);
      if ($el.hasClass('on')) {
        $el.removeClass('on');
      } else {
        $el.addClass('on');
      }
    });
  });
}

/**
  * @name _tabContents()
  * @description // 탭
  */
var _tabContents = function() {
  var $tabSection;
  var $tabBtn = $('.wrap_tab_btn').find('.btn_tab_box');

  $tabBtn.on('click', function() {
    $tabSection = $(this).closest('.section_tab');
    var idx = $(this).closest('li').index(),
      $tabCont = $tabSection.find('.tab_cont');

    $(this).closest('li').addClass('on').siblings().removeClass('on');
    $tabCont.eq(idx).addClass('on').siblings().removeClass('on');

    if ($tabSection.hasClass('type_fullpage')) {
      $(document).scrollTop(0);
    }
  });
}

/**
  * @name _simpleAcco()
  * @description // 단일 아코디언 버튼
  */
var _simpleAcco = function() {
  var accoBtn = $('.fnSimpleAcco').find('.btn_acco');
  accoBtn.on('click',function(){
    var $accoCont = $(this).siblings('.wrap_acco');

    if ($(this).hasClass('on')) {
      $(this).removeClass('on');
      $accoCont.slideUp(300);
    } else {
      $(this).addClass('on');
      $accoCont.slideDown(300);
    }
  });
}

/**
  * @name _faqAcco()
  * @description // faq 아코디언
  */
var _faqAcco = function() {
  var accoBtn = $('.section_faq').find('.btn_acco');
  accoBtn.on('click',function(){
    var $item = $(this).closest('li');
    var $accoCont = $item.find('.wrap_acco');

    if ($item.hasClass('on')) {
      $item.removeClass('on');
      $accoCont.slideUp(300);
      $(this).attr('title', 'faq 상세 열기');
    } else {
      $item.addClass('on');
      $accoCont.slideDown(300);
      $(this).attr('title', 'faq 상세 닫기');
    }
  });
}

/**
  * @name _agreeAccoBtn()
  * @description // 약관동의 아코디언 버튼
  */
var _agreeAccoBtn = function() {
  var accoBtn = $('.section_terms .btn_acco');
  var chk = $('.section_terms .wrap_agree_list > li .chk input[type="checkbox"]');

  accoBtn.on('click', function(){
    var $this = $(this);
    var $accoCont = $(this).closest('.box_chk').siblings('.wrap_acco');

    if ($this.hasClass('on')) {
      _closeAgreeAcco($this, $accoCont);
    } else {
      _openAgreeAcco($this, $accoCont);
    }
  });

  var _openAgreeAcco = function(btn, acco){
    $(btn).addClass('on');
    $(acco).slideDown(300);
  }

  var _closeAgreeAcco = function(btn, acco){
    $(btn).removeClass('on');
    $(acco).slideUp(300);
  }
}

/**
  * @name _agreeCheckAll()
  * @description // 약관전체동의
  */
var _agreeCheckAll = function() {
  $('.section_terms').each(function(){
    var $this = $(this);
    var chkAllBtn = $this.find('.wrap_chk_all input[type="checkbox"]');
    var agreeChk = $this.find('.wrap_agree_list li > .box_chk input[type="checkbox"]');
    var subChk = $this.find('.wrap_agree_list .wrap_acco input[type="checkbox"]');
    var requiredChk = $this.find('.wrap_agree_list li > .box_chk input[required]')
    var submitBtn = $this.closest('.wrap_contents').find('.wrap_btn_full .btn_full_primary');

    if ($this.parents('.wrap_layer').length) {
      submitBtn = $this.closest('.wrap_layer').find('.wrap_btn_full .btn_full_primary');
    }

    chkAllBtn.on('change', function(){
      if( $(this).is(':checked') == false ){
        agreeChk.prop('checked',false);
        subChk.prop('checked',false);
        submitBtn.prop('disabled',true);
      }else{
        agreeChk.prop('checked',true);
        subChk.prop('checked',true);
        submitBtn.prop('disabled',false);
      }   
    });

    agreeChk.on('change', function(){
      // 전체체크
      if( agreeChk.length == $this.find('.wrap_agree_list li > .box_chk input[type="checkbox"]:checked').length ){
        chkAllBtn.prop('checked',true);
      }else{
        chkAllBtn.prop('checked',false);
      }

      // 하위체크
      var sub = $(this).closest('li').find('.chk.type_sub input[type="checkbox"]');
      if( sub.length && $(this).is(':checked') == true ) {
        sub.prop('checked',true);
      } else if ( sub.length && $(this).is(':checked') == false ){
        sub.prop('checked',false);
      }

      // 필수체크 확인
      if ( requiredChk.length !== $this.find('.wrap_agree_list li > .box_chk input[required]:checked').length ) {
        submitBtn.prop('disabled',true);
      } else {
        submitBtn.prop('disabled',false);
      }

    });

    subChk.on('change', function(){
      var checkedLength = $(this).closest('.chk_list').find('.chk.type_sub input:checked').length;
      var parentChk = $(this).closest('.wrap_acco').siblings('.box_chk').find('input[type="checkbox"]');
      if ( checkedLength <= 0) {
        parentChk.prop('checked',false);
        agreeChk.trigger('change');
      } else {
        parentChk.prop('checked',true);
      }
    });
  });
}

/**
  * @name _tooltip()
  * @description // 툴팁
  */
var _tooltip = function() {
  var $focusEl;

  $('.fnOpenTooltip').on('click', function(){
    $focusEl = $(this);
    var $tooltip = $('#' + $(this).attr('data-name'));
    var winW = $(window).outerWidth();
    var width = $tooltip.outerWidth(true)/2;
    var posY = $focusEl.offset().top + $focusEl.outerHeight(true) + 5;
    var posX = winW/2 - width; // default center
    var btnX = 0;
    
    // inside pop
    if ($('.wrap_layer.show').length) {
      var current = $('.wrap_layer.show').css('z-index');
      var zIndex = parseInt(current) + 1;
      $tooltip.css({'z-index' : zIndex});
    }

    // get Btn position
    if ($focusEl.find('.ico_tooltip').length) {
      btnX = $focusEl.find('.ico_tooltip').offset().left + ($focusEl.find('.ico_tooltip').outerWidth(true)/2);
    } else {
      btnX = $focusEl.offset().left + $focusEl.outerWidth(true)/2;
    }

    // calc position left
    if ( btnX < winW/3 ) {
      posX = '2.4rem';
    } else if ( btnX > winW * 0.66 ) {
      posX = winW - $tooltip.outerWidth(true) - 24;
    }

    $tooltip.css({
      'top': posY,
      'left': posX,
    });
    $tooltip.addClass('show');
    $tooltip.find('.inner_tooltip').children(':first').focus();
  });

  $('.fnCloseTooltip').on('click', function(){
    var $tooltip = $(this).closest('.wrap_tooltip');

    $tooltip.removeClass('show');
    $focusEl.focus();
  });
};

/**
  * @name _layerPop()
  * @description // 레이어팝업
  */
var _layerPop = function() {
  var $focusBtn;
  $('.fnOpenPop').on('click', function(){
    var popId = $(this).attr('data-name');
    fnOpenLayerPop(popId);
    $focusBtn = $(this);
  });

  $('.fnClosePop').on('click', function(){
    var popId = $(this).closest('.wrap_layer').attr('id');
    if ( !$focusBtn ) {
      $focusBtn = $('[data-name="' + popId + '"]');
    }
    fnCloseLayerPop(popId, $focusBtn);
  });
};

/**
  * @name _showBenefitList()
  * @description // 혜택리스트
  */
var _showBenefitList = function() {
  var $el = $('.wrap_item_benefit');
  var tit = $el.find('.tit_wrap');
  var list = $el.find('.list_benefit li');

  if (!$el.is(':visible')) return;
  if ($el.parents('.wrap_layer').length ){
    // F-Pop 일 경우 
    setTimeout(function(){
      _titShow();
      _listshow();
    },400);
  } else {
    _titShow();
    _listshow();
  }

  function _titShow() {
    tit.waypoint({
      handler: function() {
        $el.find('.tit_wrap').addClass('transform');
      },
      offset: '100%'
    });
  }

  function _listshow() {
    list.each(function(){
      var $this = $(this);
      $this.waypoint({
        element: this,
        handler: function() {
          $this.addClass('transform active');
          $('.list_benefit li.active').each(function(idx){
            var delay = 0.1 * idx + 's';
            $(this).css({
              'transition-delay': delay
            });
          });
          setTimeout(function(){
            list.removeClass('active');
          },100);
          
        },
        context: '.content_layer',
        offset: '100%'
      });
    });
  }
}

/**
  * @name _loopScrlCont()
  * @description // 무한 자동 스크롤 컨텐츠
  */
var _loopScrlCont = function(){
  var styles = '';
  $('.wrap_loop_scrl').find('ul').each(function(){
    var $list = $(this),
      listClass = $list.attr('class'),
      dir = $list.data('dir'),
      $slide = $list.find('li').clone(),
      length = $list.find('li').length,
      width = $list.find('li').outerWidth(true),
      left = -(width * length),
      duration = 2000 * length;

    if (dir === 'rtl') {
      // left = width * length;
      
      styles += '.' + listClass + ' { animation: ' + listClass + ' ' + duration + 'ms linear reverse infinite ; }';
    } else {
      
      styles += '.' + listClass + ' { animation: ' + listClass + ' ' + duration + 'ms linear infinite; }';
    }
    
    $list.append($slide);
    $list.prepend($slide.clone());
    styles += '@keyframes ' + listClass + ' { ';
    styles += '0% { transform: translateX(0) }';
    styles += '100% { transform: translateX(' + left + 'px) }';
    styles += '}';

  });

  var styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerHTML = styles;
  document.getElementsByTagName('head')[0].appendChild(styleSheet);
}

/**
  * @name _textFitToCont()
  * @description // adjust font-size to fit 
  */
var _textFitToCont = function(){
  var $el = $('.fnFitToCont');

  var observer = new MutationObserver(function(e){
    resize();
  });

  observer.observe($el.find('.txt_num')[0], {
    childList: true,
    characterData: true
  });

  function resize() {
    $el.each(function(idx, el){
      $(this).removeAttr('style');
      var txt = $(this).find('.txt_num');
      if ( txt.width() + 34 > $(this).width()) {
        $(this).css('font-size', (parseInt($(this).css('font-size')) - 3) + "px");
      }
    });
  }
  resize();
}

/**
  * @name _barChartStacked()
  * @description // animate stacked bar chart
  */
var _barChartStacked = function(){
  $('.chart_bar_stacked').each(function(){
    fnAnimateBar($(this));
  });
}

/**
  * @name fnOpenLayerPop()
  * @description 레이어팝업 열기
  * @param {string} popID 팝업ID 
  */
var fnOpenLayerPop = function(popID) {
  var $el = $('#' + popID);

  if ($('.wrap_layer.show').length) {
    var current = $('.wrap_layer.show').css('z-index');
    var zIndex = parseInt(current) + 1;
    $el.css('z-index', zIndex);
  }

  if ($el.find('.section_bottom_fixed').length) {
    $el.addClass('hasFixedBtn');
  }

  $('body').addClass('open_pop');
  $el.addClass('show');
  $el.append(dim);

  if ($el.find('tit_layer').length) {
    $el.find('.tit_layer').focus();
  } else {
    $el.find('.inner_layer').children(':first').focus();
  }

  // 풀팝업인 경우 헤더스크롤 이벤트 실행
  if ($el.hasClass('type_full')) {
    _headerPopControl($el);
  }

  // 딤 클릭 시 해당 팝업 닫기
  $(document).on('click', '.dim', function() {
    // alert, comfirm일 경우 dim 클릭시 닫힘 기능 없음
    if ($(this).closest('.wrap_layer').hasClass('type_alert')) { 
      return;
    }
    fnCloseLayerPop(popID);
  });
}

/**
  * @name fnCloseLayerPop()
  * @description 레이어팝업 닫기
  * @param {string} popID 팝업ID
  * @param {string | Element} focusEl focus보낼 element
  */
var fnCloseLayerPop = function(popID, focusEl){
  var $el = $('#' + popID);
  var $focusEl;

  if (!focusEl) {
    $focusEl = $('[data-name="' + popID + '"]');
  } else {
    $focusEl = $(focusEl);
  }

  $el.removeClass('show');
  setTimeout(function(){
    $el.find('.dim').remove();
    $el.removeAttr('style');
    $('body').removeClass('open_pop');
    $focusEl.focus();
  },300);
};

/**
  * @name fnToastPop()
  * @description 토스트팝업 열기
  * @param {string} popID 팝업ID 
  */
var fnToastPop = function(popID) {
  var $el = $('#' + popID);

  $el.addClass('show');

  if ( $('.wrap_btn_full').length && $('.wrap_btn_full').is(':visible') ) {
    $el.addClass('withFixedBtn');
  }
  setTimeout(function(){
    $el.removeClass('show withFixedBtn');
  }, 3000);
};

/**
  * @name skeletonLoading.start();
  * @description skeleton loading
  * @param {Element | string} el loading element 
  */
var skeletonLoading = (function(){
  var $el;

  function _moneybagListLoading(el) {
    var list = $(el).find('.wrap_list_trans');
    var item = '<div class="list_trans skeleton">';
        item += '<div class="trans_info">';
        item += '<h4 class="skeleton-item"></h4>';
        item += '<ul><li class="skeleton-item"></li><li class="skeleton-item"></li></ul>';
        item += '</div>';
        item += '</div>';

    if ($(el).hasClass('skeletonLoading')) {
      list.prepend(item);
    } else {
      $('.list_trans.skeleton').remove();
    }
  }

  function start(el){
    $el = $(el);
    $el.addClass('skeletonLoading');
    _moneybagListLoading($el);
  }

  function end(el){
    $el = $(el);
    setTimeout(function(){
      $el.removeClass('skeletonLoading');
      _moneybagListLoading($el);
    },300);
  }

  return {
    start: start,
    end: end
  }
})();

/**
  * @name fnCheckInView()
  * @description 뷰포트 안에 있는 지 체크
  * @param {Element | string} el 뷰포트 안에 있는지 체크할 element 
  */
var fnCheckInView = function(el) {
  var posTop = $(el).offset().top;
  var posBottom = posTop + $(el).outerHeight();

  var viewTop = $(window).scrollTop();
  var viewBottom = viewTop + $(window).height();

  return posBottom > viewTop && posTop < viewBottom;
}

/**
  * @name fnCounterUp()
  * @description number counter up
  * @param {Element | string} el element 
  * @param {number} delay The delay in milliseconds per number count up
  * @param {number} time The total duration of the count up animation
  */
var fnCounterUp = function(el, delay, time) {
  var $el = $(el);

  $el.counterUp({
    delay: delay,
    time: time
  });
}

/**
  * @name fnAnimateBar()
  * @description bar chart animation
  * @param {Element | string} el bar chart element 
  */
var fnAnimateBar = function(el) {
  var $el = $(el),
      basis = 0,
      bar = $el.find('.bar');
  bar.each(function(){
    basis += parseInt( $(this).find('.txt_num').text().replace(/,/g, ''), 10 );
  })

  $el.waypoint({
    handler: function() {
      bar.each(function() {
        var amount = parseInt( $(this).find('.txt_num').text().replace(/,/g, ''), 10 );
        var rate = Math.round( ((amount / basis) * 100) );
        $(this).data('percent', rate);
        var percentage = $(this).data('percent') + '%';
        if ( amount == 0 ) {
          $(this).css('min-width','unset');
        }else {
          $(this).removeAttr('style');
        }
        $(this).css('width', percentage);
        
      });
    },
    offset: '90%'
  });
}

/**
  * @name fnVdbCoinChart.animate()
  * @description 내가받은 혜택 동전 애니메이션
  * @url VDB_001
  */
var fnVdbCoinChart = (function() {
  var $el;

  function animate() {
    $el = $('.wrap_vdb_list');
    $el.each(function(idx, el){
      $(el).waypoint({
        handler: function() {
          if ( $(el).hasClass('transform') ) { 
            return;
          }
          $(el).find('li').each(function(listIdx, listEl){
            if ( !$(this).hasClass('empty') ) {
              var chart = $(this).find('.chart_coin');
              var coinH = 6;
              
              // 첫번째 카테고리 기준 비율 계산 data-percent 설정
              if ( listIdx > 0 ) {
                var basis = parseInt( $(el).find('li:first-child').find('.txt_num').text().replace(/,/g, ''), 10 );
                var currentVal = parseInt( $(this).find('.txt_num').text().replace(/,/g, ''), 10 );
                var rate = Math.round( ((currentVal / basis) * 100) );
  
                chart.data('percent', rate);
              }
              
              // data-percent 값을 가져와 coin 이미지 생성
              var percentage = chart.data('percent');
              var coinSize = parseInt( (chart.outerHeight(true) * percentage / 100) / coinH );
              if (coinSize < 6) {
                var coins = '<p class="img_coin"></p>';
              } else {
                var coins = new Array(coinSize).join('<p class="img_coin"></p>');
              };

              chart
                .append(coins)
                .find('.img_coin').last().addClass('last');
              setTimeout(function(){
                $(el).addClass('transform');
              },100);
            } 
          });
        },
        offset: '80%',
      });
  
    });
  }

  function reset() {
    $el.find('.img_coin').remove();
    $el.removeClass('transform');
  }

  return {
    animate: animate,
    reset: reset
  }
})();

/**
  * @name fnHanamoneyGuideControl()
  * @description 하나머니 안내 트랜지션 컨트롤
  * @url UTL_001
 */
var fnHanamoneyGuideControl = function() {
  // 무한적립 swiper
  var accumSwiper = new Swiper('.utl_accum_swiper', {
    freeMode: true,
    loop: true,
    slidesPerView: 'auto',
    observeParents: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
  });

  // 수수료면제 swiper
  var chargeSwiper = new Swiper('.utl_charge_swiper', {
    allowTouchMove: false,
    loop: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    // autoplay: {
    //   delay: 3000,
    // },
  });

  //포인트 swiper
  var pointSwiper = new Swiper('.utl_point_swiper', {
    direction: 'vertical',
    allowTouchMove: false,
    loop: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    effect: 'coverflow',
    coverflowEffect: {
        rotate: 0,
        stretch: 10,
        depth: 500,
        modifier: 1,
        slideShadows : false,
    },
    on: {
      init: function() {
        var wrapperEl = $(this.wrapperEl);
        
        wrapperEl.find('.swiper-slide-prev').prev().addClass('swiper-slide-first').prevAll().addClass('prevAll');
        wrapperEl.find('.swiper-slide-next').next().addClass('swiper-slide-last').nextAll().addClass('nextAll');
      },
      slideChange: function() {
        var wrapperEl = $(this.wrapperEl);
        wrapperEl.find('.swiper-slide').removeClass('prevAll nextAll swiper-slide-first swiper-slide-last');

        var $active = wrapperEl.find('.swiper-slide').eq(this.activeIndex);

        $active.prev().prev().addClass('swiper-slide-first').prevAll().addClass('prevAll');
        $active.next().next().addClass('swiper-slide-last').nextAll().addClass('nextAll');
      },
    }
  });

  // 스크롤에 따른 animation 시작
  $(window).on('scroll', function(){
    $('.section_cont').each(function(idx, el){
      if ( fnCheckInView($(el))) {
        if ($(el).hasClass('guide_hanamoney_1')) { accumSwiper.autoplay.start(); }
        else if ($(el).hasClass('guide_hanamoney_3')) { chargeSwiper.autoplay.start(); }
        else if ($(el).hasClass('guide_hanamoney_4')) { pointSwiper.params.autoplay.delay = 1000; pointSwiper.autoplay.start(); }
        else { $(el).addClass('transform'); }
      } else {
        if ($(el).hasClass('guide_hanamoney_1')) { accumSwiper.autoplay.stop(); }
        else if ($(el).hasClass('guide_hanamoney_3')) { chargeSwiper.autoplay.stop(); }
        else if ($(el).hasClass('guide_hanamoney_4')) { pointSwiper.autoplay.stop(); }
        else { $(el).removeClass('transform'); }
      }
    });
  });
}