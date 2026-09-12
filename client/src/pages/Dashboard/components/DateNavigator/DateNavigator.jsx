import { useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import {
    shiftDate,
    isToday,
    formatHumanDate,
    getLocalDateString,
} from "../../../../utils/dateUtils";
import "./DateNavigator.scss";

const DateNavigator = ({ activeDate, onDateChange }) => {
    const dateInputRef = useRef(null);

    const handlePrevDay = () => {
        onDateChange(shiftDate(activeDate, -1));
    };

    const handleNextDay = () => {
        onDateChange(shiftDate(activeDate, 1));
    };

    const handleToday = () => {
        onDateChange(getLocalDateString(new Date()));
    };

    const handlePickerChange = (e) => {
        if (e.target.value) {
            onDateChange(e.target.value);
        }
    };

    const openCalendarPicker = () => {
        if (dateInputRef.current) {
            if (typeof dateInputRef.current.showPicker === "function") {
                dateInputRef.current.showPicker();
            } else {
                dateInputRef.current.focus();
                dateInputRef.current.click();
            }
        }
    };

    const isCurrentDay = isToday(activeDate);
    const humanDateLabel = formatHumanDate(activeDate);

    return (
        <nav className="date-navigator" aria-label="Date navigation">
            <div className="date-navigator__controls">
                {/* Previous Day Button */}
                <button
                    type="button"
                    className="date-navigator__arrow-btn"
                    onClick={handlePrevDay}
                    aria-label="Previous day"
                    title="Previous day"
                >
                    <ChevronLeft size={20} strokeWidth={2.2} />
                </button>

                {/* Center: Humanized Date Display & Calendar Picker Trigger */}
                <button
                    type="button"
                    className="date-navigator__center"
                    onClick={openCalendarPicker}
                    aria-label="Open calendar picker"
                    title="Choose date from calendar"
                >
                    <Calendar
                        size={18}
                        strokeWidth={2}
                        className="date-navigator__calendar-icon"
                    />
                    <span className="date-navigator__label">
                        {humanDateLabel}
                    </span>
                </button>

                {/* Hidden Native Date Input */}
                <input
                    ref={dateInputRef}
                    type="date"
                    className="date-navigator__hidden-input"
                    value={activeDate}
                    onChange={handlePickerChange}
                    aria-label="Select date"
                    tabIndex={-1}
                />

                {/* Next Day Button */}
                <button
                    type="button"
                    className="date-navigator__arrow-btn"
                    onClick={handleNextDay}
                    aria-label="Next day"
                    title="Next day"
                >
                    <ChevronRight size={20} strokeWidth={2.2} />
                </button>
            </div>

            {/* Quick "Today" Pill Reset Button */}
            {!isCurrentDay && (
                <button
                    type="button"
                    className="date-navigator__today-btn"
                    onClick={handleToday}
                    aria-label="Jump to today"
                >
                    <span className="date-navigator__today-dot" />
                    <span>Back to Today</span>
                </button>
            )}
        </nav>
    );
};

export default DateNavigator;
