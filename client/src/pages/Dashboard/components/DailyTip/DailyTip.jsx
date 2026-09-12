import {
    Droplets,
    Salad,
    Scale,
    Dumbbell,
    Apple,
    Sparkles,
    Moon,
    Clock,
    Flame,
    HeartPulse,
    Cookie,
    Zap,
    Lightbulb,
} from "lucide-react";
import { DAILY_TIPS } from "./dailyTipsData";
import "./DailyTip.scss";

const ICON_MAP = {
    Droplets,
    Salad,
    Scale,
    Dumbbell,
    Apple,
    Sparkles,
    Moon,
    Clock,
    Flame,
    HeartPulse,
    Cookie,
    Zap,
};

/**
 * Calculates day of the year (1 - 366) deterministically from a YYYY-MM-DD string or Date.
 */
const getDayOfYear = (dateInput) => {
    let target;
    if (typeof dateInput === "string" && dateInput.includes("-")) {
        const [year, month, day] = dateInput.split("-").map(Number);
        target = new Date(year, month - 1, day);
    } else if (dateInput instanceof Date) {
        target = dateInput;
    } else {
        target = new Date();
    }

    const start = new Date(target.getFullYear(), 0, 1);
    const diffMs = target.getTime() - start.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
};

const DailyTip = ({ activeDate }) => {
    const dayOfYear = getDayOfYear(activeDate);
    const tipIndex = Math.abs(dayOfYear) % DAILY_TIPS.length;
    const tip = DAILY_TIPS[tipIndex] || DAILY_TIPS[0];
    const IconComponent = ICON_MAP[tip.icon] || Lightbulb;

    return (
        <aside
            className="dashboard-card tip-card"
            aria-label="Daily Nutrition Tip"
        >
            <div className="tip-card__icon-badge" aria-hidden="true">
                <IconComponent size={22} className="tip-card__icon" />
            </div>
            <div className="tip-card__content">
                <span className="tip-card__label">Daily Tip</span>
                <h3 className="tip-card__title">{tip.title}</h3>
                <p className="tip-card__desc">{tip.text}</p>
            </div>
        </aside>
    );
};

export default DailyTip;
