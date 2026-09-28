/** Mock analytics owned by Team Insights. */
export const WEEKLY_SALES = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'].map((day, i) => ({
  day,
  value: [45, 62, 38, 80, 95, 70, 55][i],
}));
