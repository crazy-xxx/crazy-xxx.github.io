// Generated by CoffeeScript 1.10.0
var Duties, Game, Kinks, OWRMain, Roll, StartSelector, Twists, Xmoney, Ymoney, button, calcMoney, d, d19, div, form, h1, h3, img, input, label, li, option, p, ref, rollCounter, select, span, strong, ul,
  slice = [].slice;

d = function() {
  return parseInt(Math.random() * 10);
};

d19 = function() {
  return parseInt(1 + Math.random() * 9);
};

Duties = ['[Choose 2 but only charge for cheaper one]', 'Suck for 5min', 'Suck for 10min', 'Suck for 5min, deepthroat every 30s', 'Deepthroat 20x', 'Deepthroat 40x', 'Deepthroat 10x in 1min', 'Deepthroat 20x in 90s, or deepthroat 100x', 'Suck for 5min, then deepthroat 20x', 'Suck for 10min, then deepthroat 40x'];

Kinks = ['[Pick three]', 'Wear nippleclamps', 'Wear blindfold', 'Wear collar', 'Smear everything that comes out of your mouth on your face', 'After doing your duty, slap your face with the dildo 30 times', 'Spank your ass 50 times', 'Moan and beg for more', 'Wear nippleclamps & blindfold', 'Wear nippleclamps & collar'];

Twists = ['Gangbang: X roll is cumulative', null, null, null, null, null, 'Cheap escape: do not collect money for this roll', 'He brings his friend: do double amount of work', 'His favorite bitch: do triple amount of work, get paid double', 'Your pimp comes around: give him half of your money'];

Xmoney = [1000, 20, 20, 30, 20, 35, 40, 70, 40, 55];

Ymoney = [0, 10, 10, 20, 40, 40, 10, 10, 20, 30];

rollCounter = 0;

Roll = (function() {
  function Roll() {
    this.x = d();
    this.y = d();
    this.z = d();
    if (this.x === this.y && this.y === this.z) {
      this.x = this.y = this.z = 0;
    }
    this.x0 = [d19(), d19()];
    this.y0 = _.first(_.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]), 3);
    this.key = rollCounter++;
  }

  Roll.prototype.numDuty = function() {
    var j, ref, res, results;
    res = [this.x];
    if (this.y === this.z) {
      res.push(this.y);
    }
    if (_.contains(res, 0)) {
      res = res.concat(this.x0);
    }
    if (this.z === 0) {
      res = (function() {
        results = [];
        for (var j = 1, ref = _.max(res); 1 <= ref ? j <= ref : j >= ref; 1 <= ref ? j++ : j--){ results.push(j); }
        return results;
      }).apply(this);
    }
    return res;
  };

  Roll.prototype.duty = function() {
    var duties;
    duties = _.map(this.numDuty(), function(x) {
      return Duties[x];
    });
    if (this.z === 7) {
      duties = _.map(duties, function(duty) {
        return duty.replace(/(\d+)(min|x)/g, function(_, p1, p2) {
          return "" + (+p1 * 2) + p2;
        });
      });
    }
    if (this.z === 8) {
      duties = _.map(duties, function(duty) {
        return duty.replace(/(\d+)(min|x)/g, function(_, p1, p2) {
          return "" + (+p1 * 3) + p2;
        });
      });
    }
    return duties;
  };

  Roll.prototype.numKink = function() {
    var res;
    res = [this.y];
    if (this.x === this.z) {
      res.push(this.x);
    }
    if (_.contains(res, 0)) {
      res = res.concat(this.y0);
    }
    return res;
  };

  Roll.prototype.kink = function() {
    return _.map(this.numKink(), function(y) {
      return Kinks[y];
    });
  };

  Roll.prototype.twist = function() {
    var res;
    res = [this.z];
    if (this.x === this.y) {
      res.push(this.x);
    }
    return _.compact(_.map(res, function(z) {
      return Twists[z];
    }));
  };

  Roll.prototype.money = function() {
    var moneys;
    if (6 === this.z) {
      return 0;
    }
    moneys = _.map(this.numDuty(), function(x) {
      return Xmoney[x];
    });
    if (_.contains(this.numDuty(), 0)) {
      moneys = [_.min(moneys)];
    }
    moneys = moneys.concat(_.map(this.numKink(), function(y) {
      return Ymoney[y];
    }));
    if (8 === this.z) {
      moneys = _.map(moneys, function(n) {
        return n * 2;
      });
    }
    return _.reduce(moneys, (function(memo, num) {
      return memo + num;
    }), 0);
  };

  Roll.prototype.takesAll = function() {
    return 0 === this.x + this.y + this.z;
  };

  Roll.prototype.takesHalf = function() {
    return 9 === this.z;
  };

  Roll.prototype.debug = function() {
    return "x=" + this.x + " y=" + this.y + " z=" + this.z + " x0=" + this.x0 + " y0=" + this.y0;
  };

  return Roll;

})();

calcMoney = function(rolls) {
  var m, ref, roll;
  if (rolls.length) {
    ref = rolls, roll = ref[0], rolls = 2 <= ref.length ? slice.call(ref, 1) : [];
    if (roll.takesAll()) {
      return 0;
    }
    m = roll.money() + calcMoney(rolls);
    if (roll.takesHalf()) {
      return parseInt(m / 2);
    } else {
      return m;
    }
  } else {
    return 0;
  }
};

ref = React.DOM, button = ref.button, div = ref.div, form = ref.form, img = ref.img, h1 = ref.h1, h3 = ref.h3, input = ref.input, label = ref.label, li = ref.li, option = ref.option, p = ref.p, select = ref.select, span = ref.span, strong = ref.strong, ul = ref.ul;

StartSelector = React.createClass({displayName: "StartSelector",
  getInitialState: function() {
    return {
      value: 0
    };
  },
  handleSubmit: function(e) {
    e.preventDefault();
    return this.props.started(this.state.value);
  },
  handleChange: function(e) {
    return this.setState({
      value: e.target.value
    });
  },
  render: function() {
    var x;
    return div({}, p({
      className: "lead"
    }, 'The game is not started. To start it select a value for A (target amount of money) and press Start.'), form({
      className: "form-inline",
      onSubmit: this.handleSubmit
    }, div({
      className: "form-group"
    }, label({}, 'A ='), select({
      className: "form-control",
      onChange: this.handleChange
    }, option({
      value: 0
    }, 'Random'), (function() {
      var j, results;
      results = [];
      for (x = j = 1; j <= 10; x = ++j) {
        results.push(option({
          key: x,
          value: x
        }, x + " ($" + x + "00)"));
      }
      return results;
    })())), ' ', button({
      type: "submit",
      className: "btn btn-primary"
    }, 'Start')));
  }
});

Game = React.createClass({displayName: "Game",
  getInitialState: function() {
    return {
      money: 0,
      target: this.props.A * 100,
      rolls: [],
      debug: false,
      original: false
    };
  },
  createNextTask: function(e) {
    var money, rolls;
    e.preventDefault();
    rolls = [new Roll()].concat(this.state.rolls);
    money = calcMoney(rolls);
    return this.setState({
      rolls: rolls,
      money: money
    });
  },
  rollB: function() {
    return this.setState({
      b: d()
    });
  },
  listify: function(a) {
    if (a.length > 1) {
      return ul({}, _.map(a, function(el, i) {
        return li({
          key: i
        }, el);
      }));
    } else {
      return a[0];
    }
  },
  finalDecision: function() {
    var can;
    can = this.state.b < this.props.A;
    return div({
      className: "panel text-center " + (can ? 'panel-success' : "panel-danger"),
      style: {
        marginTop: 20
      }
    }, h1({
      className: 'panel-heading panel-title'
    }, "You " + (can ? "can" : "can't") + " cum!"), "Your B is " + this.state.b);
  },
  toggleDebug: function() {
    return this.setState({
      debug: !this.state.debug
    });
  },
  toggleOriginal: function() {
    return this.setState({
      original: !this.state.original
    });
  },
  render: function() {
    var beforeFinal, canGetNext, finished;
    canGetNext = this.state.money < this.state.target;
    beforeFinal = !canGetNext && this.state.b === void 0;
    finished = !canGetNext && !beforeFinal;
    return div({}, div({
      className: 'row'
    }, div({
      className: 'col-xs-6'
    }, h3({}, span({
      className: 'label label-info'
    }, "Your money: $" + this.state.money))), div({
      className: 'col-xs-6 text-right'
    }, h3({}, span({
      className: 'label label-success'
    }, "Target money: $" + this.state.target)))), div({
      className: 'row'
    }, div({
      className: 'col-xs-12'
    }, canGetNext && button({
      className: "btn btn-primary btn-lg center-block",
      onClick: this.createNextTask
    }, 'Get next task'), beforeFinal && button({
      className: "btn btn-success btn-lg center-block",
      onClick: this.rollB
    }, 'Roll for B'), finished && this.finalDecision())), div({
      className: 'row',
      style: {
        marginTop: 20
      }
    }, div({
      className: 'col-xs-4'
    }, strong({}, 'Duty')), div({
      className: 'col-xs-3'
    }, strong({}, 'Kink')), div({
      className: 'col-xs-3'
    }, strong({}, 'Twist')), div({
      className: 'col-xs-2'
    }, strong({}, 'Money'))), _.map(this.state.rolls, (function(_this) {
      return function(roll, i) {
        return div({
          key: roll.key,
          className: "row " + (0 === i ? 'lead' : 'text-muted'),
          style: {
            marginTop: 20
          }
        }, div({
          className: 'col-xs-4'
        }, _this.listify(roll.duty())), div({
          className: 'col-xs-3'
        }, _this.listify(roll.kink())), div({
          className: 'col-xs-3'
        }, _this.listify(roll.twist())), div({
          className: 'col-xs-2'
        }, "$" + (roll.money())), _this.state.debug && div({
          className: 'col-xs-12'
        }, roll.debug()));
      };
    })(this)), div({
      className: 'row',
      style: {
        marginTop: 40
      }
    }, div({
      className: 'col-xs-12 text-right'
    }, label({}, input({
      type: 'checkbox',
      checked: this.state.original,
      onChange: this.toggleOriginal
    }), ' Show original  '), label({}, input({
      type: 'checkbox',
      checked: this.state.debug,
      onChange: this.toggleDebug
    }), ' Debug'))), this.state.original && img({
      className: 'img-responsive',
      src: 'http://40.media.tumblr.com/3d37deb13a8382de854e2c0ca1715877/tumblr_nuos2gddcs1rw2ehco1_1280.png'
    }));
  }
});

OWRMain = React.createClass({displayName: "OWRMain",
  getInitialState: function() {
    return {
      started: false
    };
  },
  startGame: function(a) {
    a || (a = parseInt(1 + Math.random() * 10));
    return this.setState({
      started: true,
      A: a
    });
  },
  render: function() {
    return div({
      className: "container"
    }, h1({}, 'Oral Whore Roulette'), this.state.started ? React.createElement(Game, {
      "A": this.state.A
    }) : React.createElement(StartSelector, {
      "started": this.startGame
    }));
  }
});

ReactDOM.render(React.createElement(OWRMain, null), document.getElementById('content'));
