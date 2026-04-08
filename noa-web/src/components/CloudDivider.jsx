export default function CloudDivider() {
  return (
    <div className="cloud-divider">
      {/* Black background behind clouds */}
      <div className="cloud-bg-top" />

      {/* SVG clouds — outline on black, filled black covering white below */}
      <svg
        className="cloud-svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* White outline clouds (visible against black hero) */}
        <g fill="none" stroke="white" strokeWidth="1.5">
          {/* Cloud 1 — left */}
          <path d="M-20,280 Q0,220 60,230 Q70,180 130,185 Q150,150 200,160 Q230,130 270,145 Q310,120 350,140 Q380,115 420,130 Q450,110 480,125 Q500,140 510,160 Q540,150 570,165 Q580,190 570,210 Q590,220 590,250 Q590,280 560,285 L-20,285 Z" />
          {/* Cloud 2 — center */}
          <path d="M400,290 Q420,240 480,248 Q490,205 550,210 Q570,175 620,185 Q650,155 700,168 Q740,140 785,158 Q820,135 865,150 Q900,130 940,148 Q970,155 980,178 Q1010,165 1040,182 Q1055,205 1045,228 Q1070,238 1072,265 Q1072,290 1040,295 L400,295 Z" />
          {/* Cloud 3 — right */}
          <path d="M900,285 Q920,235 975,242 Q985,198 1045,205 Q1065,170 1115,180 Q1145,148 1195,162 Q1235,138 1275,155 Q1310,132 1355,150 Q1395,135 1440,152 L1440,290 L900,290 Z" />
          {/* Cloud 4 — small left mid */}
          <path d="M100,295 Q115,260 155,265 Q162,238 200,242 Q218,220 248,228 Q270,215 295,224 Q310,235 308,255 Q325,260 325,280 Q325,298 305,300 L100,300 Z" />
          {/* Cloud 5 — small right mid */}
          <path d="M780,298 Q795,268 830,272 Q838,248 872,252 Q888,232 914,240 Q933,228 958,236 Q972,248 970,265 Q985,270 986,286 Q986,300 968,302 L780,302 Z" />
        </g>

        {/* Filled black clouds — covers the white section below (mask effect) */}
        <g fill="black" stroke="white" strokeWidth="1.5">
          <path d="M-20,300 Q0,240 60,250 Q70,200 130,205 Q150,168 200,178 Q230,148 270,163 Q310,138 350,158 Q380,133 420,148 Q450,128 480,143 Q500,158 510,178 Q540,168 570,183 Q580,208 570,228 Q590,238 590,268 Q590,310 560,310 L-20,310 Z" />
          <path d="M400,310 Q420,258 480,266 Q490,222 550,228 Q570,192 620,202 Q650,172 700,185 Q740,158 785,175 Q820,152 865,168 Q900,148 940,165 Q970,172 980,195 Q1010,182 1040,199 Q1055,222 1045,245 Q1070,255 1072,282 Q1072,310 1040,310 L400,310 Z" />
          <path d="M900,310 Q920,252 975,260 Q985,215 1045,222 Q1065,187 1115,197 Q1145,165 1195,178 Q1235,155 1275,172 Q1310,150 1355,168 Q1395,152 1440,170 L1440,310 L900,310 Z" />
          <path d="M100,310 Q115,275 155,280 Q162,252 200,257 Q218,235 248,243 Q270,230 295,239 Q310,250 308,270 Q325,275 325,293 Q325,310 305,310 L100,310 Z" />
          <path d="M780,310 Q795,280 830,284 Q838,260 872,264 Q888,244 914,252 Q933,240 958,248 Q972,260 970,277 Q985,282 986,298 Q986,310 968,310 L780,310 Z" />
        </g>

        {/* Solid black bar at very bottom to seamlessly connect to white section */}
        <rect x="0" y="308" width="1440" height="12" fill="black" />
      </svg>

      {/* White section begins here */}
      <div className="cloud-bg-bottom" />
    </div>
  );
}
