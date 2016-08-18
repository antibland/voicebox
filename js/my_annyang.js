(function() {
  "use strict";
  var container = $('.container');

  var buttonHandler = function() {
    $('.no-support').attr('aria-hidden', true);
    var clicked_text = this.innerHTML;

    if (clicked_text === "two columns") {
      utils.createColumns(2);
    } else if (clicked_text === "five columns") {
      utils.createColumns(5);
    } else if (clicked_text === "clear") {
      utils.clear();
    } else if (clicked_text === "get markup") {
      utils.getMarkup();
    }
  };

  $('button').on('click', buttonHandler);

  var utils = {
    numbers: ['one', 'two', 'three', 'four', 'five'],
    createColumns: function(num_columns) {
      var ordinal_columns = $.isNumeric(num_columns) ? num_columns : utils.numbers.indexOf(num_columns) + 1;

      $('<div>')
        .addClass(utils.numbers[ordinal_columns -1] + '-columns')
        .append(utils.createItem(ordinal_columns))
        .appendTo(container)
    },
    createItem: function(times) {
      var times = times || 1,
          html  = "";

      for (var i = 0; i < times; i++) {
        html += '<div class="item">item ' + Number(i+1)  + '</div>';
      }

      return html;
    },
    clear: function() {
      container.html('');
      $('.markup')
        .attr({
          'aria-hidden': true,
          'tabindex': -1
        });

      $('.markup .content').attr('aria-hidden', true);
    },
    getMarkup: function() {
      $('.markup')
        .attr({
          'aria-hidden': false,
          'tabindex': 0
        });

      $('.markup .content')
        .text( utils.formatCode(container.html(), true, true) )
        .attr('aria-hidden', false);

      hljs.initHighlighting();
    },
    formatCode: function(code, stripWhiteSpaces, stripEmptyLines) {
      var whitespace = ' '.repeat(2); // Default indenting 2 whitespaces
      var currentIndent = 0;
      var char = null;
      var nextChar = null;
      var result = '';
      for (var pos = 0; pos <= code.length; pos++) {
        char = code.substr(pos, 1);
        nextChar = code.substr(pos + 1, 1);

        // If opening tag, add newline character and indention
        if (char === '<' && nextChar !== '/') {
          result += '\n' + whitespace.repeat(currentIndent);
          currentIndent++;
        }
        // if Closing tag, add newline and indention
        else if (char === '<' && nextChar === '/') {
          // If there're more closing tags than opening
          if (--currentIndent < 0) currentIndent = 0;
          result += '\n' + whitespace.repeat(currentIndent);
        }

        // remove multiple whitespaces
        else if (stripWhiteSpaces === true && char === ' ' && nextChar === ' ') char = '';
        // remove empty lines
        else if (stripEmptyLines === true && char === '\n') {
          //debugger;
          if (code.substr(pos, code.substr(pos).indexOf("<")).trim() === '') char = '';
        }

        result += char;
      }

      return result;
    }
  }; // end utils

  if (annyang) {
    var commands = {
      'clear': utils.clear,
      ':num_columns column(s)': utils.createColumns,
      'get markup': utils.getMarkup
    };

    annyang.addCommands(commands);
    annyang.start();
  } else {
    setTimeout(function() {
      $('.no-support').attr('aria-hidden', false);
    });
  }
})();
