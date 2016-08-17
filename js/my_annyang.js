if (annyang) {
  var container = $('.container');

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
    getMarkup: function() {
      $('.markup .content').text( utils.formatCode(container.html(), true, true) );
      hljs.initHighlighting();
    },
    formatCode: function(code, stripWhiteSpaces, stripEmptyLines) {
      "use strict";
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
  };

  var commands = {
    'clear': function() {
      container.html('');
    },
    ':num_columns column(s)': utils.createColumns,
    'get markup': utils.getMarkup
  };

  annyang.addCommands(commands);
  annyang.start();
}
