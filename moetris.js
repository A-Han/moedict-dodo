(function(){
  var replace$ = ''.replace, split$ = ''.split;
  $(function(){
    return $.get("https://www.moedict.tw/a/index.json", null, function(ALL){
      var matchCache, keys, keyMap, score, w, h, cs, select, draw, doGravity, doit, blacklist;
      ALL = replace$.call(ALL, /[；，]/g, '');
      ALL = replace$.call(ALL, /".",/g, '');
      window.ALL = ALL;
      matchCache = {};
      console.log(pick(''));
      keys = [122, 120, 99, 118, 98, 110, 97, 115, 100, 102, 103, 104, 113, 119, 101, 114, 116, 121, 49, 50, 51, 52, 53, 54, 90, 88, 67, 86, 66, 78, 65, 83, 68, 70, 71, 72, 81, 87, 69, 82, 84, 89, 33, 64, 35, 36, 37, 94];
      keyMap = {};
      keys.forEach(function(keyCode, idx){
        return keyMap[keyCode] = {
          'key': String.fromCharCode(keyCode),
          'x': ~~(idx % 6),
          'y': ~~(idx / 6)
        };
      });
      score = 0;
      w = 2 + $('#proto').width();
      h = 2 + $('#proto').height();
      $('big').remove();
      $.fx.interval = 50;
      $(document).on('keypress', function(arg$){
        var which, shiftKey, pos;
        which = arg$.which, shiftKey = arg$.shiftKey;
        console.log(which);
        switch (which) {
        case 32:
          return $('#wrap').click();
        default:
          if (~keys.indexOf(which)) {
            pos = keyMap[which];
            return select($(".char.col-" + pos.x).eq(pos.y));
          }
        }
      });
      cs = '';
      select = function(it){
        var c, idx;
        c = it.text();
        if (it.hasClass('active')) {
          if (~(idx = cs.indexOf(c))) {
            it.removeClass("active red green");
            draw(cs.substring(0, idx) + cs.substring(idx + 1));
          }
          return;
        }
        it.addClass('active');
        cs += c;
        return draw(cs);
      };
      $('body').on('click', '.char', function(){
        return select($(this));
      });
      draw = function(it){
        var that;
        cs = it;
        $('#wrap').text(cs);
        if (!cs.length) {
          return $('#wrap').removeClass("active red green");
        }
        $('#wrap').addClass('active');
        if (~ALL.indexOf("\"" + cs + "\"")) {
          return $('.active').removeClass('red').addClass('green');
        }
        if (that = /[＊？]/.exec(cs) && !/^[＊？]+$/.test(cs) && ALL.match(RegExp('"(' + cs.replace(/？/g, '[^"]').replace(/＊/g, '(?:[^"]+)?') + ')"'))) {
          $('#wrap').text(that[1]);
          $('.active').removeClass('red').addClass('green');
          return;
        }
        return $('.active').removeClass('green').addClass('red');
      };
      $('#top').css({
        left: '5px',
        width: 6 * w + "px",
        top: '5px'
      });
      $('#proto').css({
        left: '5px',
        width: 10 + 6 * w + "px",
        height: h + "px",
        top: 9 * h
      });
      $('#wrap').css({
        width: '100%',
        height: '100%'
      }).click(function(){
        if ($(this).hasClass('red')) {
          $('.active').removeClass('active').removeClass('red');
          return draw('');
        }
        if ($(this).hasClass('green')) {
          score += $(this).text().length;
          $('#score').text(score);
          $(this).removeClass('active').removeClass('green');
          $('.active').remove();
          doGravity();
          return draw('');
        }
        return $('.falling').finish();
      });
      doGravity = function(){
        var i$, c, lresult$, xs, below, j$, len$, x, top, results$ = [];
        for (i$ = 0; i$ <= 5; ++i$) {
          c = i$;
          lresult$ = [];
          xs = $(".col-" + c + ":not(.falling)").get();
          xs.sort(fn$);
          below = 0;
          for (j$ = 0, len$ = xs.length; j$ < len$; ++j$) {
            x = xs[j$];
            below++;
            top = 50 + (8 - below) * h;
            if (top === $(x).css('top')) {
              continue;
            }
            lresult$.push($(x).animate({
              top: top
            }, 250, 'linear'));
          }
          results$.push(lresult$);
        }
        return results$;
        function fn$(a, b){
          return $(b).css('top') - $(a).css('top');
        }
      };
      (doit = function(){
        var min, i$, c, cnt, col, next, $x, below, $access, ref$;
        min = Infinity;
        for (i$ = 0; i$ <= 5; ++i$) {
          c = i$;
          cnt = $(".col-" + c).length;
          if (min <= cnt) {
            continue;
          }
          min = cnt;
          col = c;
        }
        next = pick($('big').text());
        $x = $('<div/>', {
          'class': "ui char button large col-" + col
        }).append($('<big/>').text(next).addClass(next === '？'
          ? 'qq'
          : next === '＊' ? 'aa' : 'ww')).append($('<small/>').text());
        $x.css({
          display: 'inline-block',
          position: 'absolute',
          left: col * w + 10
        });
        $x.appendTo('body');
        below = $(".col-" + col).length;
        if (below > 8) {
          return alert("Game over");
        }
        $access = $('<div/>', {
          'class': 'ui attached label'
        }).text(keyMap[keys[col + (below - 1) * 6]].key).css({
          position: 'absolute',
          top: 0,
          right: 0,
          'text-transform': 'none'
        });
        $x.append($access);
        $x.addClass('falling');
        return $x.animate({
          top: 50 + (8 - below) * h
        }, (9 - below) * (100 > (ref$ = 500 - score) ? 100 : ref$), 'linear', function(){
          $('.falling').removeClass('falling');
          doGravity();
          return doit();
        });
      })();
      blacklist = {
        "": true
      };
      function pick(cur){
        var seen, scores, i$, ref$, len$, c, results, j$, len1$, r, score, cands, res$, ref1$, s, c2, picks, cand;
        cur == null && (cur = '');
        if (!/[^＊？]/.test(cur)) {
          return "一二三四五六七八九十"[Math.floor(Math.random() * 10)];
        }
        if (Math.random() < 0.05) {
          return "＊";
        }
        if (Math.random() < 0.2) {
          return "？";
        }
        seen = {};
        scores = [];
        for (i$ = 0, len$ = (ref$ = replace$.call(cur, /[＊？]/g, '')).length; i$ < len$; ++i$) {
          c = ref$[i$];
          results = matchCache[c] || (matchCache[c] = ALL.match(RegExp('[^"]*' + c + '[^"]*', 'g')));
          for (j$ = 0, len1$ = results.length; j$ < len1$; ++j$) {
            r = results[j$];
            if (r.length <= 8 && !blacklist[r]) {
              seen[r] == null && (seen[r] = 0);
              score = ++seen[r];
              if (r.length > score + 1) {
                scores[score] == null && (scores[score] = "");
                scores[score] += r + "\n";
              } else {
                blacklist[r] = true;
              }
            }
          }
        }
        cands = [];
        while (!(cands != null && cands.length)) {
          res$ = [];
          for (i$ = 0, len$ = (ref$ = split$.call((ref1$ = scores.pop()) != null ? ref1$ : '', "\n")).length; i$ < len$; ++i$) {
            s = ref$[i$];
            if (!blacklist[s]) {
              res$.push(s);
            }
          }
          cands = res$;
        }
        while (cands.length <= 5 && scores.length) {
          c2 = [];
          while (!((c2 != null && c2.length) || !scores.length)) {
            res$ = [];
            for (i$ = 0, len$ = (ref$ = split$.call((ref1$ = scores.pop()) != null ? ref1$ : '', "\n")).length; i$ < len$; ++i$) {
              s = ref$[i$];
              if (!blacklist[s]) {
                res$.push(s);
              }
            }
            c2 = res$;
          }
          cands = cands.concat(c2);
        }
        picks = "";
        for (i$ = 0, len$ = cands.length; i$ < len$; ++i$) {
          cand = cands[i$];
          for (j$ = 0, len1$ = (ref$ = replace$.call(cur, /[＊？]/g, '')).length; j$ < len1$; ++j$) {
            c = ref$[j$];
            cand = replace$.call(cand, RegExp(c + ''), '');
          }
          picks += cand;
        }
        return picks[Math.floor(Math.random() * picks.length)];
      }
      return pick;
    }, 'text');
  });
}).call(this);
