const moment = require('moment');
module.exports = {
    formatMonthStartDate() {
        return moment().startOf('month').format('YYYY-MM-DD');
    },

    formatMonthEndDate() {
        return moment().endOf('month').format('YYYY-MM-DD');
    },
};
