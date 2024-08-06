import Component from "../Component/Component.js";
import ChatInfoRule from "../ChatInfoRule/ChatInfoRule.js";
import { FormattedDate } from "../../utils/utils.js";

import './DateRule.css';


class DateRule extends Component {
    baseCtx = {
        date: null,
    }

    constructor(...args){
        super(...args);

        this.childComponents = {
            ChatInfoRule,
        }
        this.childContexts = {
            rule: {
                text: this.formatDate(this.ctx.date),
            }
        }
    }

    formatDate(date){
        let fd = new FormattedDate(date);
        let day = (fd.altDayName == 'Today') ? fd.altDayName: fd.dayName;
        
        return `${day}, ${fd.monthName} ${fd.date}, ${fd.year}`;
    }

    view(){
        return `
            <Component-lc lc--ChatInfoRule:rule--cl></Component-lc>
        `
    }

    // view(){
    //     return `
    //         <div class="date-rule">
    //             <hr>
    //             <span>${this.formatDate(this.ctx.date)}</span>
    //         </div>
    //     `
    // }
}

export default DateRule;