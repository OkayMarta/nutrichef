import LeafIcon from "../../../../components/common/LeafIcon";
import "./WhyNutriChef.scss";

const WhyNutriChef = () => {
    return (
        <section id="features" className="why-nutrichef container">
            <div className="why-nutrichef__grid">
                {/* Left: Illustrated Bowl with Macro Tags */}
                <div className="why-nutrichef__visual-card">
                    {/* Floating Tag: Calories */}
                    <div className="why-nutrichef__tag why-nutrichef__tag--calories">
                        <span className="why-nutrichef__tag-name">
                            Calories
                        </span>
                        <strong className="why-nutrichef__tag-value">
                            320 kcal
                        </strong>
                    </div>

                    {/* Floating Tag: Protein */}
                    <div className="why-nutrichef__tag why-nutrichef__tag--protein">
                        <span className="why-nutrichef__tag-name">Protein</span>
                        <strong className="why-nutrichef__tag-value">
                            18 g
                        </strong>
                    </div>

                    {/* Floating Tag: Fats */}
                    <div className="why-nutrichef__tag why-nutrichef__tag--fats">
                        <span className="why-nutrichef__tag-name">Fats</span>
                        <strong className="why-nutrichef__tag-value">
                            12 g
                        </strong>
                    </div>

                    {/* Floating Tag: Carbs */}
                    <div className="why-nutrichef__tag why-nutrichef__tag--carbs">
                        <span className="why-nutrichef__tag-name">Carbs</span>
                        <strong className="why-nutrichef__tag-value">
                            34 g
                        </strong>
                    </div>

                    {/* Decorative leaf icon */}
                    <LeafIcon
                        className="why-nutrichef__decor-leaf"
                        width={42}
                        height={42}
                        color="#469c3c"
                    />

                    {/* Central Stylized Nutrition Bowl */}
                    <div className="why-nutrichef__bowl-wrap">
                        <svg
                            className="why-nutrichef__bowl-art"
                            viewBox="0 0 240 240"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {/* Bowl base */}
                            <circle
                                cx="120"
                                cy="120"
                                r="110"
                                fill="#f6f9f3"
                                stroke="#e0ebd8"
                                strokeWidth="4"
                            />
                            <circle cx="120" cy="120" r="100" fill="#eaf4e2" />

                            {/* Greens bed / Spinach */}
                            <path
                                d="M40 100 Q60 50 110 60 Q120 110 70 120 Z"
                                fill="#74bd57"
                                opacity="0.9"
                            />
                            <path
                                d="M110 50 Q160 40 180 90 Q140 120 100 80 Z"
                                fill="#60a844"
                                opacity="0.95"
                            />
                            <path
                                d="M140 110 Q190 120 190 170 Q130 180 120 130 Z"
                                fill="#469c3c"
                                opacity="0.9"
                            />
                            <path
                                d="M50 130 Q70 190 120 190 Q110 140 60 120 Z"
                                fill="#69b84a"
                                opacity="0.85"
                            />

                            {/* Quinoa / Grains center */}
                            <ellipse
                                cx="125"
                                cy="115"
                                rx="38"
                                ry="34"
                                fill="#deb887"
                            />
                            <circle cx="115" cy="105" r="3" fill="#c49b65" />
                            <circle cx="125" cy="100" r="3" fill="#c49b65" />
                            <circle cx="135" cy="110" r="3" fill="#c49b65" />
                            <circle cx="118" cy="122" r="3" fill="#c49b65" />
                            <circle cx="130" cy="125" r="3" fill="#c49b65" />
                            <circle cx="140" cy="120" r="3" fill="#c49b65" />

                            {/* Sliced Avocado fan */}
                            <g transform="translate(60, 110)">
                                <ellipse
                                    cx="22"
                                    cy="18"
                                    rx="14"
                                    ry="26"
                                    transform="rotate(-30 22 18)"
                                    fill="#8ec373"
                                    stroke="#5b9c3e"
                                    strokeWidth="2"
                                />
                                <ellipse
                                    cx="32"
                                    cy="22"
                                    rx="12"
                                    ry="24"
                                    transform="rotate(-15 32 22)"
                                    fill="#a6d68b"
                                    stroke="#5b9c3e"
                                    strokeWidth="2"
                                />
                                <ellipse
                                    cx="44"
                                    cy="28"
                                    rx="12"
                                    ry="24"
                                    transform="rotate(5 44 28)"
                                    fill="#c0e7a4"
                                    stroke="#5b9c3e"
                                    strokeWidth="2"
                                />
                            </g>

                            {/* Cherry Tomatoes */}
                            <circle cx="158" cy="148" r="14" fill="#e74c3c" />
                            <circle
                                cx="154"
                                cy="144"
                                r="4"
                                fill="#ff7675"
                                opacity="0.7"
                            />
                            <circle cx="176" cy="132" r="12" fill="#c0392b" />
                            <circle
                                cx="173"
                                cy="129"
                                r="3"
                                fill="#ff7675"
                                opacity="0.7"
                            />
                            <circle cx="168" cy="164" r="11" fill="#e74c3c" />

                            {/* Roasted chickpea/seed sprinkle */}
                            <circle cx="95" cy="85" r="5" fill="#f39c12" />
                            <circle cx="108" cy="72" r="5" fill="#e67e22" />
                            <circle cx="82" cy="98" r="4" fill="#f1c40f" />
                            <circle cx="92" cy="158" r="4" fill="#27ae60" />
                            <circle cx="102" cy="170" r="4" fill="#2ecc71" />
                        </svg>
                    </div>
                </div>

                {/* Right: Why NutriChef Highlights */}
                <div className="why-nutrichef__content">
                    <span className="why-nutrichef__tag-label">
                        Why NutriChef
                    </span>
                    <h2 className="why-nutrichef__title">
                        Simple. Convenient. Useful.
                    </h2>

                    <div className="why-nutrichef__list">
                        <div className="why-nutrichef__item">
                            <span className="why-nutrichef__check-icon">✓</span>
                            <span>
                                Accurate calculations for finished dishes
                            </span>
                        </div>
                        <div className="why-nutrichef__item">
                            <span className="why-nutrichef__check-icon">✓</span>
                            <span>Save your favorite recipes</span>
                        </div>
                        <div className="why-nutrichef__item">
                            <span className="why-nutrichef__check-icon">✓</span>
                            <span>
                                Track portions and monitor your nutrition
                            </span>
                        </div>
                        <div className="why-nutrichef__item">
                            <span className="why-nutrichef__check-icon">✓</span>
                            <span>Clean and intuitive interface</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyNutriChef;
