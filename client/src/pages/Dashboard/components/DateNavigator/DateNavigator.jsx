import { useRef } from "react";
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
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>

                {/* Center: Humanized Date Display & Calendar Picker Trigger */}
                <div
                    className="date-navigator__center"
                    onClick={openCalendarPicker}
                >
                    <button
                        type="button"
                        className="date-navigator__calendar-btn"
                        aria-label="Open calendar picker"
                        title="Choose date from calendar"
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect
                                x="3"
                                y="4"
                                width="18"
                                height="18"
                                rx="2"
                                ry="2"
                            />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                    </button>

                    <h2 className="date-navigator__label">{humanDateLabel}</h2>

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
                </div>

                {/* Next Day Button */}
                <button
                    type="button"
                    className="date-navigator__arrow-btn"
                    onClick={handleNextDay}
                    aria-label="Next day"
                    title="Next day"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
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
