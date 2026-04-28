export const ACCENT = "#7F00FF";
export const ACCENT_HOVER = "#5E00CC";
export const cx = (...v) => v.filter(Boolean).join(" ");

export function buildOrbitUi(isDark) {
  return isDark
    ? {
        pageBg: "bg-[#070B16]",
        frame: "bg-[#0F1729]/90 border-[#27324B]",
        card: "bg-[#101A2F] border-[#2B3754]",
        soft: "bg-[#121D33]",
        textMain: "text-[#E5EBFF]",
        textSub: "text-[#9EABC8]",
        input: "bg-[#0D1426] border-[#293651] text-[#E5EBFF]",
        sidebar: "bg-[#0B1326]/90 border-[#26314A]",
      }
    : {
        pageBg: "bg-[#F4F6FB]",
        frame: "bg-white/95 border-[#D6DCEC]",
        card: "bg-white border-[#DCE2F0]",
        soft: "bg-[#F1F4FC]",
        textMain: "text-[#1B2642]",
        textSub: "text-[#617094]",
        input: "bg-white border-[#CDD6EA] text-[#1B2642]",
        sidebar: "bg-white/90 border-[#D6DCEC]",
      };
}

export function Pill({ children, tone = "neutral" }) {
  const styles = {
    neutral: "bg-[#F7F7F7] text-[#333333] border-[#D1D1D1]",
    ok: "bg-green-50 text-green-700 border-green-200",
    warn: "bg-amber-50 text-amber-700 border-amber-200",
    bad: "bg-red-50 text-red-700 border-red-200",
  };

  return <span className={`px-2.5 py-1 rounded-full text-xs border ${styles[tone]}`}>{children}</span>;
}
