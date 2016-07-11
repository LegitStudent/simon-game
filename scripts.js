// All colors must be represented in character form
// global Game object to hold all variables
var game = {
  level: 0,
  checkLevel: 0,
  currentPattern: [],
  colors: ['r', 'b', 'g', 'y'],
  userPattern: [],
  presses: 0,
  advanceLevel: function() {
    this.level++;

    if (this.level === 21) {
      alert('You win!');
      this.initialize();
    }

    this.checkLevel = 0;
    var randomColor = this.chooseRandomColor();
    this.currentPattern.push(randomColor);
    this.userPattern = [];
    $('.play').addClass('no-touch');
    this.blinkNext(0);
    // append generated clear user-pressed
  },
  checkPattern: function() {
    // checks pattern only to currentLevel
    for (var i = 0; i < this.checkLevel; i++) {
      if (this.userPattern[i] !== this.currentPattern[i]) {
        this.userMistake();
        return false;
      }
    }

    if (this.checkLevel === this.level) {
      var state = this;
      setTimeout(function() {
        state.advanceLevel();
        state.update();
      }, 1000);
    }

    return true;
  },
  chooseRandomColor: function() {
    return this.colors[Math.floor(Math.random() * 4)];
  },
  update: function() {
    // update view to reflect changes in game object
    $('#level').text(this.level);
    $('#checkString').text(this.currentPattern);
    $('#mainString').text(this.userPattern);
    $('#checkLevel').text(this.checkLevel);
  },
  userChoice: function(event) {
    this.checkLevel++;
    this.userPattern.push($(event.target).data().color);
    if (this.checkPattern()) {
      document.getElementById('audio-' + $(event.target).data().color).play();
    }
  },
  userMistake: function() {
    this.checkLevel = 0;
    this.userPattern = [];
    alert('You made a mistake');
    this.blinkNext(0);
  },
  blinkNext: function(i) {
    if (i === this.currentPattern.length) {
      $('.play').removeClass('no-touch');
      return false;
    }
    console.log('blinking: ' + this.currentPattern[i]);

    var animClass = "";
    switch(this.currentPattern[i]) {
      case 'r':
        animClass = "blink-red";
        break;
      case 'b':
        animClass = "blink-blue";
        break;
      case 'g':
        animClass = "blink-green";
        break;
      case 'y':
        animClass = "blink-yellow";
        break;
      default:
        break;
    }

    $('.play[data-color="' + this.currentPattern[i] + '"').addClass(animClass);
    document.getElementById('audio-' + this.currentPattern[i]).play();
    setTimeout(this.blinkNext.bind(this), 750, i+1);
  },
  initialize: function() {
    this.level = 0;
    this.currentPattern = [];
    this.advanceLevel();
    this.update();
  }
}

// button state functions

function setActive(e) {
  if ($(this).hasClass('no-touch') || game.checkLevel === game.level) return false;
  $(this).addClass('active');
  game.userChoice(e);
  game.update();
}

function setInactive(e) {
  $(this).removeClass('active');
}

$(document).ready(function() {
  // Pre-load operations

  // FCC's provided audio files are annoyingly at different volumes
  var settings = {
    'audio-r': 0.3,
    'audio-b': 0.3,
    'audio-g': 0.8,
    'audio-y': 1.0
  }

  Object.keys(settings).forEach(function(id) {
    document.getElementById(id).volume = settings[id];
  });
  // Event Listeners


  $('#start').on('click', function(e) {
    game.initialize();
    $(this).attr('disabled', true);
  });

  $('.play').on("mousedown", setActive);

  $('.play').on("mouseout mouseup", setInactive);

  $('.play').on('animationend', function(e) {
    $(this).attr('class', 'play');
  });
});
