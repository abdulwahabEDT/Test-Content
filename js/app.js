function eq(a, b) {
  return a == b;
}

function lt(a, b) {
  return a < b;
}

function lte(a, b) {
  return a <= b;
}

function gt(a, b) {
  return a > b;
}

function gte(a, b) {
  return a >= b;
}

function diff(a, b) {
  return a != b;
}

const comps = {
  ">=": gte,
  "==": eq,
  "<": lt,
  ">": gt,
  "<=": lte,
  "!=": diff
}

function tokenize(s) {
  let searches = s.split(":");
  if (searches.length == 0)
    return undefined;

  let terms = []
  for (let i = 0; i < searches.length; i++) {
    let match = searches[i].match(/^([a-zA-Z0-9_+\-\/* ]+)\s*(>=|<=|>|<|==|!=)\s*([a-zA-Z0-9_+\-\/* ]+)$/)
    if (match.length != 4) {
      continue;
      // malformed
    }
    terms.push({ func: comps[match[2]], term1: match[1], term2: match[3] });
  }
  return terms;
}

$.getJSON("https://raw.githubusercontent.com/cta-wave/Test-Content/master/database.json", function (data) {
  var player = dashjs.MediaPlayer().create();
  let app = new Vue({
    el: '#app',
    data: {
      database: data,
      search: '',
      results_cfhd: Object.values(data)[0],
      results_cfhd_cenc: Object.values(data)[1],
      results_cfhd_splicing: Object.values(data)[2]
    },
    methods: {
      play: function(mpd) {
        player.initialize(document.querySelector("#videoPlayer"), mpd, true);
      },
      searchInDB: function (e) {
        let tokens = tokenize(this.search);
        this.results = Object.values(this.database).filter(element => {
          var cond = true;
          var hasBeenIn = false;
          tokens.forEach((token) => {
            //todo implement OR and more complex searches
            cond = cond && token.func(element[token.term1], token.term2);
            hasBeenIn = true;
          })
          return hasBeenIn && cond;

        });
        console.log(results.length)
        e.preventDefault();
      }
    }
  })
});
