const less = require('less');

module.exports = function (source) {
    let callback = this.async();
    less.render(source, function (err, obj) {
		// 将less转化为css
        callback(err, obj.css);
    });
};