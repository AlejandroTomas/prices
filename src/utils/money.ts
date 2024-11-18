import { FormatMoney } from "format-money-js";

const fm = new FormatMoney({
  decimals: 2,
});
const formatMoney = (amount: number, noSimbol: boolean = false): string => {
  const format = fm.from(amount, {
    symbol: noSimbol ? "" : "$",
  });
  return format as string;
};

export default formatMoney;
