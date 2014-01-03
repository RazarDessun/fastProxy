function getTime() {
	var t = new Date();
	return [ t.getFullYear(), '-', add0(t.getMonth() + 1), '-',
			add0(t.getDate()), ' ', add0(t.getHours()), ':',
			add0(t.getMinutes()), ':', add0(t.getSeconds()) ].join('');
}

function getDay() {
	var t = new Date();
	return [ t.getFullYear(), '-', add0(t.getMonth() + 1), '-',
			add0(t.getDate()) ].join('');

}

function add0(num) {
	return num > 9 ? num : '0' + num;
}

module.exports.getTime=getTime;
module.exports.getDay=getDay;